// ============================================================
// WUITALUR RPG 2.0 - COMPONENTES DE RASTREADORES DINAMICOS
// ============================================================

(function(global) {
  const DynamicTrackers = {
    render(trackerKey, trackerDef, currentState, onChangeCallback) {
      if (!trackerDef) return null;

      const card = document.createElement("div");
      card.className = `dynamic-tracker-card tracker-${trackerDef.type || "generic"}`;
      card.id = `tracker-${trackerKey}`;

      if (trackerDef.type === "pips") {
        this.renderPipsTracker(card, trackerKey, trackerDef, currentState, onChangeCallback);
      } else if (trackerDef.type === "slots") {
        this.renderSlotsTracker(card, trackerKey, trackerDef, currentState, onChangeCallback);
      } else if (trackerDef.type === "boolean_threshold") {
        this.renderThresholdTracker(card, trackerKey, trackerDef, currentState);
      } else {
        card.innerHTML = `
          <div class="tracker-header">
            <span class="tracker-title">${trackerDef.label || trackerKey}</span>
          </div>
          <div class="tracker-body">Rastreador de recurso generico.</div>
        `;
      }

      return card;
    },

    renderPipsTracker(container, key, def, state, onChange) {
      const min = def.min || 0;
      const max = def.max || 5;
      const cur = state && typeof state.current === "number" ? Math.min(max, Math.max(min, state.current)) : min;

      const header = document.createElement("div");
      header.className = "tracker-header";
      header.innerHTML = `
        <div class="tracker-title-wrap">
          <span class="tracker-badge">RECURSO DINAMICO</span>
          <h4 class="tracker-title">${def.label || key}</h4>
        </div>
        <div class="tracker-counter">
          <span class="tracker-val-current">${cur}</span>
          <span class="tracker-val-divider">/</span>
          <span class="tracker-val-max">${max}</span>
        </div>
      `;
      container.appendChild(header);

      const pipsWrap = document.createElement("div");
      pipsWrap.className = "tracker-pips-container";

      for (let i = 1; i <= max; i++) {
        const pip = document.createElement("button");
        pip.type = "button";
        pip.className = `tracker-pip ${i <= cur ? "active" : ""}`;
        pip.title = `Definir ${def.label || key} para ${i}`;
        pip.setAttribute("aria-label", `Nivel ${i}`);

        pip.addEventListener("click", () => {
          const nextVal = cur === i ? i - 1 : i;
          if (typeof onChange === "function") {
            onChange(key, { ...state, current: nextVal });
          }
        });

        pipsWrap.appendChild(pip);
      }
      container.appendChild(pipsWrap);

      // Milestones / Opcoes descritivas associadas aos pips
      if (def.milestones) {
        const milestonesWrap = document.createElement("div");
        milestonesWrap.className = "tracker-milestones-list";

        for (let i = 1; i <= max; i++) {
          const desc = def.milestones[i];
          if (desc) {
            const item = document.createElement("div");
            item.className = `tracker-milestone-item ${i <= cur ? "unlocked" : "locked"}`;
            item.innerHTML = `
              <span class="milestone-cost">${i}</span>
              <span class="milestone-desc">${desc}</span>
            `;
            milestonesWrap.appendChild(item);
          }
        }
        container.appendChild(milestonesWrap);
      }

      if (Array.isArray(def.options)) {
        const optionsWrap = document.createElement("div");
        optionsWrap.className = "tracker-options-list";
        def.options.forEach((optText) => {
          const item = document.createElement("div");
          item.className = "tracker-option-pill";
          item.textContent = optText;
          optionsWrap.appendChild(item);
        });
        container.appendChild(optionsWrap);
      }
    },

    renderSlotsTracker(container, key, def, state, onChange) {
      const maxActive = def.maxActive || 2;
      const activeSlots = Array.isArray(state?.slots) ? state.slots : [];

      const header = document.createElement("div");
      header.className = "tracker-header";
      header.innerHTML = `
        <div class="tracker-title-wrap">
          <span class="tracker-badge">ESTADOS ATIVOS</span>
          <h4 class="tracker-title">${def.label || key}</h4>
        </div>
        <div class="tracker-counter">
          <span class="tracker-val-current">${activeSlots.length}</span>
          <span class="tracker-val-divider">/</span>
          <span class="tracker-val-max">${maxActive} Max</span>
        </div>
      `;
      container.appendChild(header);

      const slotsGrid = document.createElement("div");
      slotsGrid.className = "tracker-slots-grid";

      (def.options || []).forEach((opt) => {
        const isActive = activeSlots.includes(opt.id);
        const slotCard = document.createElement("div");
        slotCard.className = `tracker-slot-card ${isActive ? "active" : ""}`;

        slotCard.innerHTML = `
          <div class="slot-card-top">
            <span class="slot-name">${opt.name}</span>
            <span class="slot-status-indicator">${isActive ? "ATIVO" : "INATIVO"}</span>
          </div>
          <p class="slot-desc">${opt.desc || ""}</p>
        `;

        slotCard.addEventListener("click", () => {
          let updated = [...activeSlots];
          if (isActive) {
            updated = updated.filter((id) => id !== opt.id);
          } else {
            if (updated.length < maxActive) {
              updated.push(opt.id);
            } else {
              // Substitui o mais antigo se atingiu limite
              updated.shift();
              updated.push(opt.id);
            }
          }

          if (typeof onChange === "function") {
            onChange(key, { ...state, slots: updated });
          }
        });

        slotsGrid.appendChild(slotCard);
      });

      container.appendChild(slotsGrid);
    },

    renderThresholdTracker(container, key, def, state) {
      const isActive = Boolean(state?.isActive);

      container.className += isActive ? " threshold-active" : " threshold-idle";
      container.innerHTML = `
        <div class="tracker-header">
          <div class="tracker-title-wrap">
            <span class="tracker-badge ${isActive ? "badge-danger" : "badge-neutral"}">GATILHO REATIVO</span>
            <h4 class="tracker-title">${def.label || key}</h4>
          </div>
          <span class="threshold-pill ${isActive ? "active" : "inactive"}">
            ${isActive ? "GATILHO ATIVO" : "EM ESPERA"}
          </span>
        </div>
        <div class="threshold-content">
          <p class="threshold-desc">${def.activeBuffDesc || "Efeito ativado automaticamente sob condicao de limiar."}</p>
          <div class="threshold-condition-note">
            Gatilho: ativado quando a integridade vital estiver igual ou abaixo de ${def.thresholdPercent || 25}%.
          </div>
        </div>
      `;
    },

    renderAll(trackersDefMap, statesMap, containerEl, onChange) {
      if (!containerEl) return;
      containerEl.innerHTML = "";

      const keys = Object.keys(trackersDefMap || {});
      if (keys.length === 0) {
        containerEl.innerHTML = `<div class="trackers-empty-note">Nenhum recurso especial ativado para a classe ou raca selecionada.</div>`;
        return;
      }

      keys.forEach((key) => {
        const def = trackersDefMap[key];
        const state = statesMap ? statesMap[key] : null;
        const rendered = this.render(key, def, state, onChange);
        if (rendered) {
          containerEl.appendChild(rendered);
        }
      });
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = DynamicTrackers;
  } else {
    global.WuDynamicTrackers = DynamicTrackers;
  }
})(typeof window !== "undefined" ? window : globalThis);
