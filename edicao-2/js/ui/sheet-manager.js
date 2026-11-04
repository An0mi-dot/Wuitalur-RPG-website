/**
 * Wuitalur RPG - Gerenciador e Visualizador de Fichas (Edicao 2.0)
 * Integracao com Supabase, CalculationEngine, DynamicTrackers e AuthToken
 * Zero Emojis, Zero Exclamacoes, Paleta Escura
 */
(function (global) {
  "use strict";

  const SheetManager = {
    container: null,
    currentAuth: null,
    sheets: [],

    init(mountId) {
      this.container = document.getElementById(mountId);
      if (!this.container) return;

      // Monta a barra de autenticacao
      if (global.WuAuthToken) {
        global.WuAuthToken.mountAuthBar("auth-bar-mount", (auth) => {
          this.currentAuth = auth;
          this.refresh();
        });
      } else {
        this.refresh();
      }
    },

    async refresh() {
      if (!this.container) return;
      this.container.innerHTML = "";

      if (!this.currentAuth || !this.currentAuth.valid) {
        this.renderUnauthenticatedState();
        return;
      }

      this.renderLoadingState();

      try {
        const Storage = global.WuSheetStorage;
        if (!Storage) {
          throw new Error("Modulo WuSheetStorage nao encontrado");
        }

        const rawSheets = await Storage.loadSheets(this.currentAuth.token);
        this.sheets = rawSheets;

        this.renderGrid();
      } catch (err) {
        console.error("Falha ao carregar fichas:", err);
        this.renderErrorState(err.message);
      }
    },

    renderUnauthenticatedState() {
      this.container.innerHTML = `
        <div class="empty-fichas-card">
          <h4>Nenhum Token Conectado</h4>
          <p>Identifique o seu token de jogador na barra superior para carregar seus personagens salvos no Supabase e no dispositivo.</p>
        </div>
      `;
    },

    renderLoadingState() {
      this.container.innerHTML = `
        <div class="empty-fichas-card">
          <p style="color: #A855F7;">Carregando e sincronizando fichas com o Supabase...</p>
        </div>
      `;
    },

    renderErrorState(msg) {
      this.container.innerHTML = `
        <div class="empty-fichas-card" style="border-color: #5C2237;">
          <h4 style="color: #FB7185;">Nao Foi Possivel Carregar as Fichas</h4>
          <p>${msg || "Ocorreu uma falha na comunicacao com o banco de dados."}</p>
        </div>
      `;
    },

    renderGrid() {
      this.container.innerHTML = "";

      if (!this.sheets || this.sheets.length === 0) {
        this.container.innerHTML = `
          <div class="empty-fichas-card">
            <h4>Nenhuma Ficha Registrada</h4>
            <p>Voce ainda nao possui personagens criados na Edicao 2.0 sob o token <strong>${this.currentAuth.token}</strong>.</p>
            <a href="criador.html" class="btn-wizard btn-primary" style="text-decoration: none; margin-top: 8px;">
              Criar Primeiro Personagem
            </a>
          </div>
        `;
        return;
      }

      const grid = document.createElement("div");
      grid.className = "fichas-cards-grid";

      const Engine = global.WuCalculationEngine;
      const Registry = global.WuRulesRegistry;

      this.sheets.forEach((sheet) => {
        let calc = null;
        if (Engine && Registry) {
          calc = Engine.recalculate(sheet, Registry);
        }

        const card = this.renderCard(sheet, calc);
        grid.appendChild(card);
      });

      this.container.appendChild(grid);
    },

    renderCard(sheet, calc) {
      const card = document.createElement("div");
      card.className = "char-card-v2";

      const name = sheet.meta?.name || "Personagem Sem Nome";
      const concept = sheet.meta?.concept || "Sem conceito definido";
      const lvl = sheet.progression?.level || 1;
      const maestry = calc?.maestry || 2;
      const vitals = calc?.vitals || { resourceLabel: "Vida", max: 10 };
      const ea = calc?.vitals?.energyAstral?.max || 25;
      const def = calc?.defense?.total || 10;
      const load = calc?.load || { current: 0, max: 5 };

      const raceName = sheet.identity?.raceId || "Ancestralidade";
      const className = sheet.identity?.classId || "Classe";
      const vocName = sheet.identity?.vocationId || "Vocacao";

      let specialTagHtml = "";
      if (vitals.resourceType === "estabilidade") {
        specialTagHtml = `<span class="char-tag tag-special">Estabilidade Cosmica</span>`;
      } else if (vitals.resourceType === "pc") {
        specialTagHtml = `<span class="char-tag tag-special">Pontos de Chassi</span>`;
      }

      // Rastreadores mini
      let trackersMiniHtml = "";
      if (calc && calc.trackers && calc.trackers.length > 0) {
        const trackerNames = calc.trackers.map((t) => t.label).join(", ");
        trackersMiniHtml = `
          <div class="char-trackers-mini">
            <span>Rastreadores:</span>
            <strong>${trackerNames}</strong>
          </div>
        `;
      }

      card.innerHTML = `
        <div class="char-card-header">
          <div class="char-card-identity">
            <h3>${name}</h3>
            <span class="char-card-concept">${concept}</span>
          </div>
          <span class="badge-level-pill">NV ${lvl}</span>
        </div>

        <div class="char-tags-strip">
          <span class="char-tag">${raceName}</span>
          <span class="char-tag">${className}</span>
          <span class="char-tag">${vocName}</span>
          <span class="char-tag tag-maestry">Maestria +${maestry}</span>
          ${specialTagHtml}
        </div>

        <div class="char-metrics-strip">
          <div class="char-metric-box">
            <span class="char-metric-label">${vitals.resourceLabel}</span>
            <span class="char-metric-val">${vitals.max}</span>
          </div>
          <div class="char-metric-box">
            <span class="char-metric-label">EA</span>
            <span class="char-metric-val">${ea}</span>
          </div>
          <div class="char-metric-box">
            <span class="char-metric-label">DEF</span>
            <span class="char-metric-val">${def}</span>
          </div>
          <div class="char-metric-box">
            <span class="char-metric-label">CARGA</span>
            <span class="char-metric-val">${load.current}/${load.max}</span>
          </div>
        </div>

        ${trackersMiniHtml}

        <div class="char-card-actions">
          <button type="button" class="btn-card-action btn-action-open" data-act="open">Abrir Ficha</button>
          <button type="button" class="btn-card-action btn-action-lvl" data-act="lvl">Subir Nivel</button>
          <button type="button" class="btn-card-action btn-action-del" data-act="del" title="Excluir Personagem">Excluir</button>
        </div>
      `;

      card.querySelector('[data-act="open"]').addEventListener("click", () => {
        this.openSheetViewer(sheet, calc);
      });

      card.querySelector('[data-act="lvl"]').addEventListener("click", () => {
        this.openLevelUpModal(sheet);
      });

      card.querySelector('[data-act="del"]').addEventListener("click", () => {
        this.confirmDelete(sheet);
      });

      return card;
    },

    openLevelUpModal(sheet) {
      const existing = document.getElementById("level-up-modal");
      if (existing) existing.remove();

      const overlay = document.createElement("div");
      overlay.id = "level-up-modal";
      overlay.className = "level-up-modal-overlay";

      const currentLvl = sheet.progression?.level || 1;

      overlay.innerHTML = `
        <div class="level-up-dialog">
          <div>
            <span class="modal-sub" style="font-family: var(--font-heading); text-transform: uppercase; font-size: 0.72rem; letter-spacing: 0.1em; color: #A855F7;">Progressao Universal</span>
            <h3 style="font-family: var(--font-heading); color: #FFFFFF; margin: 4px 0 0; font-size: 1.2rem;">Alterar Nivel — ${sheet.meta?.name || "Personagem"}</h3>
            <p style="color: #9E9AA6; font-size: 0.84rem; margin: 6px 0 0;">
              Selecione o novo patamar de 1 a 15. Os atributos, maestria e habilidades serao recalculados e persistidos no Supabase.
            </p>
          </div>

          <div class="level-selector-grid">
            ${Array.from({ length: 15 }, (_, i) => i + 1).map((n) => `
              <button type="button" class="level-btn ${n === currentLvl ? "active" : ""}" data-lvl="${n}">
                ${n}
              </button>
            `).join("")}
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;">
            <button type="button" class="btn-wizard btn-secondary" id="btn-cancel-lvl">Cancelar</button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      overlay.querySelector("#btn-cancel-lvl").addEventListener("click", () => overlay.remove());

      const lvlBtns = overlay.querySelectorAll(".level-btn");
      lvlBtns.forEach((b) => {
        b.addEventListener("click", async () => {
          const newLvl = Number(b.getAttribute("data-lvl"));
          overlay.remove();
          this.renderLoadingState();
          await global.WuSheetStorage.levelUpSheet(this.currentAuth.token, sheet.meta.id, newLvl);
          this.refresh();
        });
      });
    },

    async confirmDelete(sheet) {
      const name = sheet.meta?.name || "este personagem";
      const ok = confirm(`Deseja realmente excluir ${name}? Essa acao removera a ficha do banco de dados no Supabase e do armazenamento local.`);
      if (!ok) return;

      this.renderLoadingState();
      await global.WuSheetStorage.deleteSheet(this.currentAuth.token, sheet.meta.id);
      this.refresh();
    },

    openSheetViewer(sheet, calc) {
      const existing = document.getElementById("sheet-viewer-modal");
      if (existing) existing.remove();

      const overlay = document.createElement("div");
      overlay.id = "sheet-viewer-modal";
      overlay.className = "sheet-viewer-modal-overlay";

      const name = sheet.meta?.name || "Personagem";
      const concept = sheet.meta?.concept || "Sem conceito";
      const lvl = sheet.progression?.level || 1;
      const maestry = calc?.maestry || 2;
      const vitals = calc?.vitals || { resourceLabel: "Vida", max: 10 };
      const ea = calc?.vitals?.energyAstral?.max || 25;
      const def = calc?.defense?.total || 10;
      const load = calc?.load || { current: 0, max: 5 };
      const attrs = calc?.effectiveAttributes || { for: 0, des: 0, vig: 0, men: 0, exp: 0 };

      const Registry = global.WuRulesRegistry || {};
      const cDef = Registry.CLASSES ? Registry.CLASSES[sheet.identity?.classId] : null;

      // Habilidades caracteristicas ativas
      let charsHtml = "";
      if (cDef && cDef.progression && cDef.progression.characteristicAbilities) {
        const activeChars = [];
        if (lvl >= 1 && cDef.progression.characteristicAbilities[1]) activeChars.push(cDef.progression.characteristicAbilities[1]);
        if (lvl >= 4 && cDef.progression.characteristicAbilities[4]) activeChars.push(cDef.progression.characteristicAbilities[4]);
        if (lvl >= 7 && cDef.progression.characteristicAbilities[7]) activeChars.push(cDef.progression.characteristicAbilities[7]);

        charsHtml = activeChars.map((ch) => `
          <div class="viewer-power-item">
            <div class="viewer-power-top">
              <strong>${ch.name} <span class="badge-tag-passiva">${ch.tag}</span></strong>
              <span class="auth-bar-label">Caracteristica</span>
            </div>
            <p class="viewer-power-desc">${ch.desc}</p>
          </div>
        `).join("");
      }

      // Habilidade escolhida nivel 1
      let chosenHtml = "";
      if (cDef && cDef.progression && cDef.progression.choices && cDef.progression.choices[1]) {
        const choiceId = sheet.abilities?.choices ? sheet.abilities.choices["1"] : null;
        const choiceDef = cDef.progression.choices[1].find((x) => x.id === choiceId);
        if (choiceDef) {
          chosenHtml = `
            <div class="viewer-power-item" style="border-left: 3px solid #7C3AED;">
              <div class="viewer-power-top">
                <strong>${choiceDef.name} <span style="font-family: var(--font-mono); font-size: 0.72rem; color: #38BDF8;">${choiceDef.cost}</span></strong>
                <span class="auth-bar-label">Escolha NV 1</span>
              </div>
              <p class="viewer-power-desc">${choiceDef.desc}</p>
            </div>
          `;
        }
      }

      // Pericias
      let skillsHtml = "";
      if (calc && calc.skills) {
        skillsHtml = `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 8px;">
            ${calc.skills.map((s) => `
              <div style="background: #17141E; border: 1px solid ${s.trained ? "#4D3866" : "#282431"}; padding: 6px 10px; display: flex; justify-content: space-between; align-items: center;">
                <span style="font-size: 0.8rem; color: ${s.trained ? "#C084FC" : "#D1CFD7"};">${s.name}</span>
                <span style="font-family: var(--font-mono); font-size: 0.72rem; color: ${s.trained ? "#38BDF8" : "#8E8A96"};">
                  ${s.trained ? "2d20kh1" : "1d20"}${s.attributeBonus >= 0 ? `+${s.attributeBonus}` : s.attributeBonus}
                </span>
              </div>
            `).join("")}
          </div>
        `;
      }

      overlay.innerHTML = `
        <div class="sheet-viewer-dialog">
          <div class="viewer-header">
            <div class="viewer-header-info">
              <h2>${name} <span class="badge-level-pill">NV ${lvl}</span></h2>
              <span class="fichas-subtitle">${concept} &bull; ${sheet.identity?.raceId || ""} &bull; ${sheet.identity?.classId || ""}</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button type="button" class="btn-card-action btn-action-lvl" id="btn-export-json">Exportar JSON</button>
              <button type="button" class="btn-card-action btn-action-del" id="btn-close-viewer">Fechar</button>
            </div>
          </div>

          <div class="viewer-body">
            <!-- METRICAS VITAIS -->
            <div>
              <div class="viewer-section-title">Metricas de Sobrevivencia e Carga</div>
              <div class="char-metrics-strip" style="grid-template-columns: repeat(5, 1fr);">
                <div class="char-metric-box">
                  <span class="char-metric-label">${vitals.resourceLabel}</span>
                  <span class="char-metric-val">${vitals.max}</span>
                </div>
                <div class="char-metric-box">
                  <span class="char-metric-label">Energia Astral</span>
                  <span class="char-metric-val">${ea}</span>
                </div>
                <div class="char-metric-box">
                  <span class="char-metric-label">Defesa (DEF)</span>
                  <span class="char-metric-val">${def}</span>
                </div>
                <div class="char-metric-box">
                  <span class="char-metric-label">Carga</span>
                  <span class="char-metric-val">${load.current}/${load.max}</span>
                </div>
                <div class="char-metric-box">
                  <span class="char-metric-label">Maestria</span>
                  <span class="char-metric-val">+${maestry}</span>
                </div>
              </div>
            </div>

            <!-- ATRIBUTOS -->
            <div>
              <div class="viewer-section-title">Atributos Fundamentais</div>
              <div class="viewer-attrs-grid">
                <div class="viewer-attr-card">
                  <span class="viewer-attr-name">FOR</span>
                  <div class="viewer-attr-val">${attrs.for >= 0 ? `+${attrs.for}` : attrs.for}</div>
                </div>
                <div class="viewer-attr-card">
                  <span class="viewer-attr-name">DES</span>
                  <div class="viewer-attr-val">${attrs.des >= 0 ? `+${attrs.des}` : attrs.des}</div>
                </div>
                <div class="viewer-attr-card">
                  <span class="viewer-attr-name">VIG</span>
                  <div class="viewer-attr-val">${attrs.vig >= 0 ? `+${attrs.vig}` : attrs.vig}</div>
                </div>
                <div class="viewer-attr-card">
                  <span class="viewer-attr-name">MEN</span>
                  <div class="viewer-attr-val">${attrs.men >= 0 ? `+${attrs.men}` : attrs.men}</div>
                </div>
                <div class="viewer-attr-card">
                  <span class="viewer-attr-name">EXP</span>
                  <div class="viewer-attr-val">${attrs.exp >= 0 ? `+${attrs.exp}` : attrs.exp}</div>
                </div>
              </div>
            </div>

            <!-- RASTREADORES DINAMICOS -->
            <div id="viewer-trackers-mount"></div>

            <!-- PERICIAS -->
            <div>
              <div class="viewer-section-title">Pericias (Vantagem = 2d20kh1 + Atributo)</div>
              ${skillsHtml}
            </div>

            <!-- HABILIDADES -->
            <div>
              <div class="viewer-section-title">Poderes e Habilidades Ativas</div>
              <div class="viewer-powers-list">
                ${charsHtml}
                ${chosenHtml}
              </div>
            </div>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      // Renderiza Rastreadores Dinamicos se houver
      if (global.WuDynamicTrackers && calc && calc.trackers && calc.trackers.length > 0) {
        const tMount = overlay.querySelector("#viewer-trackers-mount");
        if (tMount) {
          tMount.innerHTML = `<div class="viewer-section-title">Recursos e Rastreadores Dinamicos</div>`;
          const subWrap = document.createElement("div");
          subWrap.className = "trackers-grid";
          global.WuDynamicTrackers.renderTrackers(
            calc.trackers,
            sheet.customTrackers || {},
            subWrap,
            (key, val) => {
              if (!sheet.customTrackers) sheet.customTrackers = {};
              sheet.customTrackers[key] = val;
              global.WuSheetStorage.saveSheet(this.currentAuth.token, sheet);
            }
          );
          tMount.appendChild(subWrap);
        }
      }

      overlay.querySelector("#btn-close-viewer").addEventListener("click", () => overlay.remove());

      overlay.querySelector("#btn-export-json").addEventListener("click", () => {
        const blob = new Blob([JSON.stringify(sheet, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ficha_${(sheet.meta?.name || "personagem").toLowerCase().replace(/\s+/g, "_")}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = SheetManager;
  } else {
    global.WuSheetManager = SheetManager;
  }
})(typeof window !== "undefined" ? window : globalThis);
