/**
 * Wuitalur RPG - Modulo de Autenticacao Unificada por Token (Edicao 2.0)
 * Chaves no Armazenamento Local: wu_user_token e mesa_token
 * Zero Emojis, Zero Exclamacoes, Paleta Escura
 */
(function (global) {
  "use strict";

  const STORAGE_KEY_WU = "wu_user_token";
  const STORAGE_KEY_MESA = "mesa_token";

  const SUPABASE_CONFIG = {
    url: "https://qkupdpgcjusbedaoahwi.supabase.co",
    key: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdXBkcGdjanVzYmVkYW9haHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNzk1ODAsImV4cCI6MjEwMzc1NTU4MH0.UDc5nE7ZwUyWmwNZKpq7bGrty1N6Uh0bjq2PJtBkVrk"
  };

  const MASTER_HASHES = [
    "3be80f43b640706663346f0b1fb5aa2a9c26e6b6d27a934139854e111355a93b",
    "c43cc5a2574d90e4a87d2ba0db242c99b3cdc0cbfd8c94448724b591320953ef"
  ];

  const SLOT_HASHES = {
    1: ["2dd19af57e1afab99db2a52767841b4188121375b4e107e25f1e19b5a08074b7", "67444813cdcd8add28ec10fe6184264bd4acddcd339083da3cee52779ef2b52f"],
    2: ["1c3b0fa0bb6d1186cbfbde84001fd11845b5a68922a1029288319fdffd1325fa", "113917ac98d6019f27deda3d987664c09f8fd5c12da07f5981485dfe2a0b62b2"],
    3: ["f95666157dd397d4157d44720f05c660446b23b6c3140aa2bcb8ca5761a47f28", "25bf418695fe134c210bdf931fc5893b2d7a292f7ed262c008ecd759cb11983e"],
    4: ["8b7903ff85b96269fee9ef4165adc18ae24ce32f20e3de2c5daa3ffd17e002bd", "50677632f0e9c26b7573bd471219e6ebea8cfb44cd12c34251a39f8cdfb5d660"],
    5: ["7f42d2ea1b3752c523f50d69830e942858b6c0980c4638bdbaf215d94c76bb73", "8877df43636ee69b3b5e0953869ec2a80c9844ddc6bc9247cf64c29d2a75c09c"],
    6: ["b38466b6c44627df5485939cb241d72a86f54008b87e828a144fdd78aee213cb", "4e6dd809209ad92ce0a547b2b1a5473c610c2c0bb5139bec6ce6fd2b5e65e964"],
    7: ["187542c177a73f8011cb57622b694f3ec8ffd5c11ea61ea1de5378c85ce24451", "397303bab301646c0c74e253491aeb2ffdbe9cfc6f9395dbd9748583b5d81330"],
    8: ["a1a0efb57f6f279826e7419fa6630b4cd85d6bcb8e69cb191916a28d428a72c6", "dacd72e3e91ae602668271fa5eecbe67ad6efd099ba82a29dddf6e20d3a52926"]
  };

  async function computeSha256(str) {
    if (typeof crypto !== "undefined" && crypto.subtle) {
      const buffer = new TextEncoder().encode(str);
      const hashBuf = await crypto.subtle.digest("SHA-256", buffer);
      return Array.from(new Uint8Array(hashBuf))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    }
    return "";
  }

  const AuthToken = {
    getActiveToken() {
      if (typeof localStorage === "undefined") return null;
      const wu = localStorage.getItem(STORAGE_KEY_WU);
      if (wu && wu.trim()) return wu.trim().toUpperCase();
      const mesa = localStorage.getItem(STORAGE_KEY_MESA);
      if (mesa && mesa.trim()) return mesa.trim().toUpperCase();
      return null;
    },

    saveActiveToken(token) {
      if (!token) return;
      const norm = token.trim().toUpperCase();
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(STORAGE_KEY_WU, norm);
        localStorage.setItem(STORAGE_KEY_MESA, norm);
      }
      return norm;
    },

    clearToken() {
      if (typeof localStorage !== "undefined") {
        localStorage.removeItem(STORAGE_KEY_WU);
        localStorage.removeItem(STORAGE_KEY_MESA);
      }
    },

    async validateToken(rawToken) {
      if (!rawToken || !rawToken.trim()) {
        return { valid: false, message: "Informe um token para identificacao" };
      }

      const token = rawToken.trim().toUpperCase();
      const hash = await computeSha256(token);

      // 1. Checa se e Mestre
      if (hash && MASTER_HASHES.includes(hash)) {
        this.saveActiveToken(token);
        return {
          valid: true,
          token,
          isMaster: true,
          slot: null,
          playerName: "Mestre da Mesa",
          roleLabel: "Mestre"
        };
      }

      // 2. Checa se corresponde a um Slot de jogador
      let matchedSlot = null;
      if (hash) {
        for (const s in SLOT_HASHES) {
          if (SLOT_HASHES[s].includes(hash)) {
            matchedSlot = Number(s);
            break;
          }
        }
      }

      // 3. Consulta Supabase se disponivel
      let cloudPlayer = null;
      try {
        let client = global.supabaseClient || (global.supabase ? global.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key) : null);
        if (client) {
          const { data, error } = await client
            .from("personagens")
            .select("id, token, slot, nome, raca, arquetipo")
            .eq("token", token)
            .maybeSingle();

          if (data && !error) {
            cloudPlayer = data;
          }
        }
      } catch (err) {
        console.warn("Falha na consulta do token ao Supabase:", err);
      }

      if (cloudPlayer) {
        this.saveActiveToken(token);
        return {
          valid: true,
          token,
          isMaster: false,
          slot: cloudPlayer.slot || matchedSlot,
          playerName: cloudPlayer.nome || `Jogador Slot ${cloudPlayer.slot}`,
          roleLabel: "Jogador Conectado",
          characterInfo: cloudPlayer
        };
      }

      if (matchedSlot) {
        this.saveActiveToken(token);
        return {
          valid: true,
          token,
          isMaster: false,
          slot: matchedSlot,
          playerName: `Jogador Slot ${matchedSlot}`,
          roleLabel: "Jogador Conectado"
        };
      }

      // 4. Token valido por formato (padrao 4 caracteres alfanumericos)
      if (/^[A-Z0-9]{3,12}$/.test(token)) {
        this.saveActiveToken(token);
        return {
          valid: true,
          token,
          isMaster: false,
          slot: null,
          playerName: `Jogador (${token})`,
          roleLabel: "Sessao Local / Nuvem"
        };
      }

      return {
        valid: false,
        message: "Token invalido. Formato esperado de 4 caracteres alfanumericos (ex: R5K1)"
      };
    },

    async initAutoDetection(onAuthChange) {
      const active = this.getActiveToken();
      if (!active) {
        if (typeof onAuthChange === "function") {
          onAuthChange(null);
        }
        return null;
      }

      const res = await this.validateToken(active);
      if (res.valid) {
        if (typeof onAuthChange === "function") {
          onAuthChange(res);
        }
        return res;
      } else {
        this.clearToken();
        if (typeof onAuthChange === "function") {
          onAuthChange(null);
        }
        return null;
      }
    },

    mountAuthBar(containerOrId, onAuthChange) {
      const container = typeof containerOrId === "string" ? document.getElementById(containerOrId) : containerOrId;
      if (!container) return;

      const EYE_OPEN_SVG = `<svg class="eye-icon eye-open" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
      const EYE_CLOSED_SVG = `<svg class="eye-icon eye-closed" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`;

      const renderBar = (authData) => {
        container.innerHTML = "";
        const bar = document.createElement("div");
        bar.className = "token-auth-bar";

        if (authData && authData.valid) {
          let isTokenVisible = false;

          bar.innerHTML = `
            <div class="auth-bar-status">
              <span class="auth-bar-label">Autenticacao:</span>
              <span class="auth-token-wrapper">
                <span class="auth-token-badge" id="auth-token-display">****</span>
                <button type="button" class="btn-token-toggle-eye" id="btn-toggle-token-eye" title="Revelar ou ocultar token" aria-label="Revelar ou ocultar token">
                  ${EYE_OPEN_SVG}
                </button>
              </span>
              <span class="auth-player-name">${authData.playerName || "Jogador"}</span>
              <span class="badge-tag-passiva" style="margin-left: 6px;">${authData.roleLabel || "Conectado"}</span>
            </div>
            <div class="auth-bar-actions">
              <button type="button" class="btn-auth-action btn-auth-switch" id="btn-auth-switch">Trocar Token</button>
            </div>
          `;

          const tokenDisplay = bar.querySelector("#auth-token-display");
          const toggleEyeBtn = bar.querySelector("#btn-toggle-token-eye");

          if (toggleEyeBtn && tokenDisplay) {
            toggleEyeBtn.addEventListener("click", () => {
              isTokenVisible = !isTokenVisible;
              if (isTokenVisible) {
                tokenDisplay.textContent = authData.token;
                toggleEyeBtn.innerHTML = EYE_CLOSED_SVG;
              } else {
                tokenDisplay.textContent = "****";
                toggleEyeBtn.innerHTML = EYE_OPEN_SVG;
              }
            });
          }

          const switchBtn = bar.querySelector("#btn-auth-switch");
          if (switchBtn) {
            switchBtn.addEventListener("click", () => {
              this.clearToken();
              renderBar(null);
              if (typeof onAuthChange === "function") onAuthChange(null);
            });
          }
        } else {
          bar.innerHTML = `
            <div class="auth-bar-status">
              <span class="auth-bar-label">Identificacao por Token:</span>
              <span style="color: #9E9AA6; font-size: 0.8rem;">Conecte seu token da Mesa Virtual para sincronizar fichas.</span>
            </div>
            <div class="auth-bar-form">
              <div class="auth-input-eye-wrap">
                <input type="password" class="auth-token-input" id="auth-token-input-field" placeholder="Ex: R5K1" maxlength="12" autocomplete="off">
                <button type="button" class="btn-token-toggle-eye" id="btn-toggle-input-eye" title="Revelar ou ocultar token digitado" aria-label="Revelar ou ocultar token digitado">
                  ${EYE_OPEN_SVG}
                </button>
              </div>
              <button type="button" class="btn-auth-action btn-auth-submit" id="btn-auth-submit">Conectar</button>
              <span class="auth-feedback-msg" id="auth-feedback-msg"></span>
            </div>
          `;

          const input = bar.querySelector("#auth-token-input-field");
          const toggleInputEye = bar.querySelector("#btn-toggle-input-eye");
          const submitBtn = bar.querySelector("#btn-auth-submit");
          const msgEl = bar.querySelector("#auth-feedback-msg");

          if (toggleInputEye && input) {
            toggleInputEye.addEventListener("click", () => {
              if (input.type === "password") {
                input.type = "text";
                toggleInputEye.innerHTML = EYE_CLOSED_SVG;
              } else {
                input.type = "password";
                toggleInputEye.innerHTML = EYE_OPEN_SVG;
              }
            });
          }

          const doAuth = async () => {
            const val = input.value.trim();
            if (!val) {
              msgEl.textContent = "Digite seu token";
              msgEl.className = "auth-feedback-msg error";
              return;
            }

            submitBtn.disabled = true;
            msgEl.textContent = "Validando...";
            msgEl.className = "auth-feedback-msg";

            const res = await this.validateToken(val);
            submitBtn.disabled = false;

            if (res.valid) {
              renderBar(res);
              if (typeof onAuthChange === "function") onAuthChange(res);
            } else {
              msgEl.textContent = res.message || "Token invalido";
              msgEl.className = "auth-feedback-msg error";
            }
          };

          if (submitBtn) submitBtn.addEventListener("click", doAuth);
          if (input) {
            input.addEventListener("keydown", (e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                doAuth();
              }
            });
          }
        }

        container.appendChild(bar);
      };

      // Executa deteccao automatica inicial
      this.initAutoDetection((initialAuth) => {
        renderBar(initialAuth);
        if (typeof onAuthChange === "function") onAuthChange(initialAuth);
      });
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = AuthToken;
  } else {
    global.WuAuthToken = AuthToken;
  }
})(typeof window !== "undefined" ? window : globalThis);
