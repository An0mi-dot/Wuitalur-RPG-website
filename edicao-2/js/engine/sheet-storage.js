/**
 * Wuitalur RPG - Modulo de Persistencia e Sincronizacao de Fichas (Edicao 2.0)
 * Integracao Supabase Cloud + LocalStorage Fallback
 * Zero Emojis, Zero Exclamacoes, Paleta Escura
 */
(function (global) {
  "use strict";

  const SUPABASE_CONFIG = {
    url: "https://qkupdpgcjusbedaoahwi.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdXBkcGdjanVzYmVkYW9haHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNzk1ODAsImV4cCI6MjEwMzc1NTU4MH0.UDc5nE7ZwUyWmwNZKpq7bGrty1N6Uh0bjq2PJtBkVrk"
  };

  let clientInstance = null;

  function getClient() {
    if (clientInstance) return clientInstance;
    if (global.supabaseClient) {
      clientInstance = global.supabaseClient;
      return clientInstance;
    }
    if (global.supabase && typeof global.supabase.createClient === "function") {
      clientInstance = global.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
      global.supabaseClient = clientInstance;
      return clientInstance;
    }
    if (typeof require !== "undefined") {
      try {
        const { createClient } = require("@supabase/supabase-js");
        clientInstance = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
        return clientInstance;
      } catch (e) {}
    }
    return null;
  }

  function getLocalSheets(token) {
    if (typeof localStorage === "undefined") return [];
    try {
      const raw = localStorage.getItem(`wu_fichas_v2_${token}`);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  function setLocalSheets(token, sheets) {
    if (typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(`wu_fichas_v2_${token}`, JSON.stringify(sheets));
    } catch (e) {}
  }

  const SheetStorage = {
    async loadSheets(rawToken) {
      if (!rawToken) return [];
      const token = rawToken.trim().toUpperCase();
      const localSheets = getLocalSheets(token);

      const client = getClient();
      if (!client) {
        return localSheets;
      }

      try {
        let cloudSheets = [];

        // 1. Tenta carregar do registro especifico do jogador em 'personagens'
        const { data: playerRow, error: pErr } = await client
          .from("personagens")
          .select("id, token, atributos")
          .eq("token", token)
          .maybeSingle();

        if (playerRow && playerRow.atributos && Array.isArray(playerRow.atributos._fichas_v2)) {
          cloudSheets = playerRow.atributos._fichas_v2;
        }

        // 2. Tenta carregar do repositorio central em id 1 caso nao haja ou haja complementares
        const { data: centralRow } = await client
          .from("personagens")
          .select("id, atributos")
          .eq("id", 1)
          .maybeSingle();

        if (centralRow && centralRow.atributos && centralRow.atributos._all_fichas_v2) {
          const fromCentral = centralRow.atributos._all_fichas_v2[token];
          if (Array.isArray(fromCentral)) {
            // Mescla fichas do repositório central
            fromCentral.forEach((c) => {
              if (!cloudSheets.some((s) => s.meta && s.meta.id === c.meta?.id)) {
                cloudSheets.push(c);
              }
            });
          }
        }

        // Mescla cloud e local com desempate por updatedAt
        const mergedMap = {};
        localSheets.forEach((s) => {
          if (s && s.meta && s.meta.id) mergedMap[s.meta.id] = s;
        });

        cloudSheets.forEach((cs) => {
          if (cs && cs.meta && cs.meta.id) {
            const existing = mergedMap[cs.meta.id];
            if (!existing) {
              mergedMap[cs.meta.id] = cs;
            } else {
              const cloudTime = new Date(cs.meta.updatedAt || 0).getTime();
              const localTime = new Date(existing.meta.updatedAt || 0).getTime();
              if (cloudTime >= localTime) {
                mergedMap[cs.meta.id] = cs;
              }
            }
          }
        });

        const mergedList = Object.values(mergedMap);
        setLocalSheets(token, mergedList);
        return mergedList;
      } catch (err) {
        console.warn("Falha ao carregar fichas do Supabase, utilizando cache local:", err);
        return localSheets;
      }
    },

    async saveSheet(rawToken, sheetData) {
      if (!rawToken || !sheetData) {
        throw new Error("Token e dados da ficha sao obrigatorios");
      }
      const token = rawToken.trim().toUpperCase();

      if (!sheetData.meta) sheetData.meta = {};
      if (!sheetData.meta.id) {
        sheetData.meta.id = `v2_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      }
      sheetData.meta.token = token;
      sheetData.meta.updatedAt = new Date().toISOString();

      // 1. Salva no LocalStorage
      const localSheets = getLocalSheets(token);
      const updatedLocal = [...localSheets.filter((s) => s.meta.id !== sheetData.meta.id), sheetData];
      setLocalSheets(token, updatedLocal);

      // 2. Sincroniza com o Supabase
      const client = getClient();
      if (client) {
        try {
          // A. Se existe linha de jogador correspondente em 'personagens', atualiza
          const { data: playerRow } = await client
            .from("personagens")
            .select("id, token, atributos")
            .eq("token", token)
            .maybeSingle();

          if (playerRow) {
            const currentAttrs = playerRow.atributos || {};
            const existingInPlayer = Array.isArray(currentAttrs._fichas_v2) ? currentAttrs._fichas_v2 : [];
            const newPlayerList = [...existingInPlayer.filter((s) => s.meta.id !== sheetData.meta.id), sheetData];

            await client
              .from("personagens")
              .update({
                atributos: { ...currentAttrs, _fichas_v2: newPlayerList }
              })
              .eq("id", playerRow.id);
          }

          // B. Sincroniza tambem no repositorio central em id 1
          const { data: centralRow } = await client
            .from("personagens")
            .select("id, atributos")
            .eq("id", 1)
            .maybeSingle();

          if (centralRow) {
            const currentCentralAttrs = centralRow.atributos || {};
            const allStore = currentCentralAttrs._all_fichas_v2 || {};
            const tokenList = Array.isArray(allStore[token]) ? allStore[token] : [];
            const newTokenList = [...tokenList.filter((s) => s.meta.id !== sheetData.meta.id), sheetData];
            allStore[token] = newTokenList;

            await client
              .from("personagens")
              .update({
                atributos: { ...currentCentralAttrs, _all_fichas_v2: allStore }
              })
              .eq("id", 1);
          }
        } catch (cloudErr) {
          console.warn("Falha ao salvar no Supabase (ficha mantida localmente):", cloudErr);
        }
      }

      return { success: true, sheet: sheetData };
    },

    async deleteSheet(rawToken, sheetId) {
      if (!rawToken || !sheetId) return { success: false };
      const token = rawToken.trim().toUpperCase();

      // 1. Remove do LocalStorage
      const localSheets = getLocalSheets(token);
      const remaining = localSheets.filter((s) => s.meta.id !== sheetId);
      setLocalSheets(token, remaining);

      // 2. Remove do Supabase
      const client = getClient();
      if (client) {
        try {
          const { data: playerRow } = await client
            .from("personagens")
            .select("id, token, atributos")
            .eq("token", token)
            .maybeSingle();

          if (playerRow && playerRow.atributos && Array.isArray(playerRow.atributos._fichas_v2)) {
            const filteredPlayer = playerRow.atributos._fichas_v2.filter((s) => s.meta.id !== sheetId);
            await client
              .from("personagens")
              .update({
                atributos: { ...playerRow.atributos, _fichas_v2: filteredPlayer }
              })
              .eq("id", playerRow.id);
          }

          const { data: centralRow } = await client
            .from("personagens")
            .select("id, atributos")
            .eq("id", 1)
            .maybeSingle();

          if (centralRow && centralRow.atributos && centralRow.atributos._all_fichas_v2) {
            const allStore = centralRow.atributos._all_fichas_v2;
            if (Array.isArray(allStore[token])) {
              allStore[token] = allStore[token].filter((s) => s.meta.id !== sheetId);
              await client
                .from("personagens")
                .update({
                  atributos: { ...centralRow.atributos, _all_fichas_v2: allStore }
                })
                .eq("id", 1);
            }
          }
        } catch (err) {
          console.warn("Falha ao remover do Supabase:", err);
        }
      }

      return { success: true };
    },

    async levelUpSheet(rawToken, sheetId, newLevel) {
      const sheets = await this.loadSheets(rawToken);
      const target = sheets.find((s) => s.meta.id === sheetId);
      if (!target) {
        throw new Error("Ficha nao encontrada para subida de nivel");
      }

      target.progression.level = Math.max(1, Math.min(15, Number(newLevel)));

      // Recalcula atributos, maestria e vitalidade pelo Motor de Regras
      const Engine = global.WuCalculationEngine || (typeof require !== "undefined" ? require("./calculation-engine.js") : null);
      const Registry = global.WuRulesRegistry || (typeof require !== "undefined" ? require("./rules-registry.js") : null);

      if (Engine && Registry) {
        // Registra habilidades caracteristicas automaticas se atingiu marcos 4 ou 7
        const cDef = Registry.CLASSES[target.identity.classId];
        if (cDef && cDef.progression && cDef.progression.characteristicAbilities) {
          const autoChars = [];
          if (target.progression.level >= 1 && cDef.progression.characteristicAbilities[1]) {
            autoChars.push(cDef.progression.characteristicAbilities[1].id);
          }
          if (target.progression.level >= 4 && cDef.progression.characteristicAbilities[4]) {
            autoChars.push(cDef.progression.characteristicAbilities[4].id);
          }
          if (target.progression.level >= 7 && cDef.progression.characteristicAbilities[7]) {
            autoChars.push(cDef.progression.characteristicAbilities[7].id);
          }
          target.abilities.characteristics = autoChars;
        }

        Engine.recalculate(target, Registry);
      }

      return await this.saveSheet(rawToken, target);
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = SheetStorage;
  } else {
    global.WuSheetStorage = SheetStorage;
  }
})(typeof window !== "undefined" ? window : globalThis);
