// ============================================================
// WUITALUR RPG 2.0 - ASSISTENTE DE CRIACAO DE PERSONAGEM (WIZARD)
// ============================================================

(function(global) {
  const Wizard = {
    currentStep: 1,
    totalSteps: 5,
    charData: null,
    calculationState: null,
    onFinishCallback: null,

    init(containerEl, onFinish) {
      this.container = typeof containerEl === "string" ? document.getElementById(containerEl) : containerEl;
      this.onFinishCallback = onFinish;

      const Model = global.WuSheetModel || (typeof require !== "undefined" ? require("./sheet-model.js") : null);
      if (!Model) {
        console.error("SheetModel nao carregado.");
        return;
      }

      this.charData = Model.createDefaultCharacter({
        attributes: {
          base: { for: 0, des: 0, vig: 0, men: 0, exp: 0 }
        }
      });

      this.assignedPills = {
        for: null,
        des: null,
        vig: null,
        men: null,
        exp: null
      };

      this.updateCalculations();
      this.render();
    },

    updateCalculations() {
      const Engine = global.WuCalculationEngine || (typeof require !== "undefined" ? require("./calculation-engine.js") : null);
      const Registry = global.WuRulesRegistry || (typeof require !== "undefined" ? require("./rules-registry.js") : null);

      if (Engine) {
        this.calculationState = Engine.recalculate(this.charData, Registry);
      }
    },

    setStep(stepNum) {
      if (this.currentStep === 4 && stepNum > 4) {
        const choiceSelected = Boolean(this.charData.abilities && this.charData.abilities.choices && this.charData.abilities.choices["1"]);
        if (!choiceSelected) {
          this.render();
          return;
        }
      }
      if (stepNum >= 1 && stepNum <= this.totalSteps) {
        this.currentStep = stepNum;
        this.render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },

    nextStep() {
      if (this.currentStep === 4) {
        const choiceSelected = Boolean(this.charData.abilities && this.charData.abilities.choices && this.charData.abilities.choices["1"]);
        if (!choiceSelected) {
          this.render();
          return;
        }
      }
      if (this.currentStep < this.totalSteps) {
        this.setStep(this.currentStep + 1);
      } else {
        this.finishCreation();
      }
    },

    prevStep() {
      if (this.currentStep > 1) {
        this.setStep(this.currentStep - 1);
      }
    },

    render() {
      if (!this.container) return;
      this.container.innerHTML = "";

      const layout = document.createElement("div");
      layout.className = "wizard-layout";

      // 1. Barra de progresso dos 5 passos
      const progressNav = this.renderProgressBar();
      layout.appendChild(progressNav);

      // 2. Grid de Conteudo (Passo Atual + Painel Lateral de Previa Reativa)
      const contentGrid = document.createElement("div");
      contentGrid.className = "wizard-content-grid";

      const stepContainer = document.createElement("div");
      stepContainer.className = "wizard-step-container";

      switch (this.currentStep) {
        case 1:
          stepContainer.appendChild(this.renderStep1());
          break;
        case 2:
          stepContainer.appendChild(this.renderStep2());
          break;
        case 3:
          stepContainer.appendChild(this.renderStep3());
          break;
        case 4:
          stepContainer.appendChild(this.renderStep4());
          break;
        case 5:
          stepContainer.appendChild(this.renderStep5());
          break;
      }

      // Botoes de Navegacao (Anterior / Proximo)
      const navButtons = document.createElement("div");
      navButtons.className = "wizard-nav-buttons";

      if (this.currentStep > 1) {
        const prevBtn = document.createElement("button");
        prevBtn.type = "button";
        prevBtn.className = "btn-wizard btn-secondary";
        prevBtn.textContent = "Voltar";
        prevBtn.addEventListener("click", () => this.prevStep());
        navButtons.appendChild(prevBtn);
      } else {
        const spacer = document.createElement("div");
        navButtons.appendChild(spacer);
      }

      const nextBtn = document.createElement("button");
      nextBtn.type = "button";
      nextBtn.className = "btn-wizard btn-primary";
      nextBtn.textContent = this.currentStep === this.totalSteps ? "Concluir Ficha" : "Proximo Passo";

      let isChoiceBlocked = false;
      if (this.currentStep === 4) {
        const choiceSelected = Boolean(this.charData.abilities && this.charData.abilities.choices && this.charData.abilities.choices["1"]);
        if (!choiceSelected) {
          isChoiceBlocked = true;
          nextBtn.disabled = true;
          nextBtn.classList.add("btn-disabled");
          nextBtn.title = "Selecione uma habilidade de escolha de nivel 1 da sua classe antes de avancar";
        }
      }

      nextBtn.addEventListener("click", () => this.nextStep());
      navButtons.appendChild(nextBtn);

      if (isChoiceBlocked) {
        const warnNotice = document.createElement("div");
        warnNotice.className = "step-blocking-notice";
        warnNotice.innerHTML = `
          <span class="blocking-tag">Escolha Obrigatoria</span>
          <span>Selecione 1 Habilidade de Escolha de Nivel 1 da sua classe acima para poder avancar para a Fase 5.</span>
        `;
        stepContainer.appendChild(warnNotice);
      }

      stepContainer.appendChild(navButtons);
      contentGrid.appendChild(stepContainer);

      // Painel Lateral de Resumo em Tempo Real
      const sidebarPreview = this.renderSidebarPreview();
      contentGrid.appendChild(sidebarPreview);

      layout.appendChild(contentGrid);
      this.container.appendChild(layout);
    },

    renderProgressBar() {
      const wrap = document.createElement("nav");
      wrap.className = "wizard-progress-bar";
      wrap.setAttribute("aria-label", "Etapas de Criacao");

      const stepsData = [
        { num: 1, title: "Conceito & Raca" },
        { num: 2, title: "Vocacao" },
        { num: 3, title: "Atributos" },
        { num: 4, title: "Classe & Poderes" },
        { num: 5, title: "Carga & Revisao" }
      ];

      stepsData.forEach((s) => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = `wizard-step-indicator ${s.num === this.currentStep ? "active" : ""} ${s.num < this.currentStep ? "completed" : ""}`;
        item.innerHTML = `
          <span class="step-badge">${s.num < this.currentStep ? "&#10003;" : s.num}</span>
          <span class="step-label">${s.title}</span>
        `;
        item.addEventListener("click", () => this.setStep(s.num));
        wrap.appendChild(item);
      });

      return wrap;
    },

    // --------------------------------------------------------
    // PASSO 1: CONCEITO E RACA
    // --------------------------------------------------------
    renderStep1() {
      const section = document.createElement("div");
      section.className = "step-section step-1";

      section.innerHTML = `
        <div class="step-heading">
          <span class="step-sub">Fase 1 de 5</span>
          <h2 class="step-title">Conceito e Raca</h2>
          <p class="step-intro">Defina a identidade de seu personagem e selecione sua ancestralidade no mundo de Wuitalur.</p>
        </div>
      `;

      // Inputs de Identidade
      const metaBox = document.createElement("div");
      metaBox.className = "card-sub-box meta-input-grid";

      metaBox.innerHTML = `
        <div class="form-group">
          <label for="input-char-name">Nome do Personagem</label>
          <input type="text" id="input-char-name" class="form-control" placeholder="Ex: Valerius Vane" value="${this.charData.meta.name || ""}">
        </div>
        <div class="form-group">
          <label for="input-char-concept">Conceito / Arquétipo</label>
          <input type="text" id="input-char-concept" class="form-control" placeholder="Ex: Pesquisador renegado de anomalias" value="${this.charData.meta.concept || ""}">
        </div>
        <div class="form-group">
          <label for="input-char-player">Jogador / Mestre</label>
          <input type="text" id="input-char-player" class="form-control" placeholder="Nome do jogador" value="${this.charData.meta.player || ""}">
        </div>
      `;

      metaBox.querySelector("#input-char-name").addEventListener("input", (e) => {
        this.charData.meta.name = e.target.value;
        this.updateCalculations();
        this.refreshPreview();
      });
      metaBox.querySelector("#input-char-concept").addEventListener("input", (e) => {
        this.charData.meta.concept = e.target.value;
        this.updateCalculations();
        this.refreshPreview();
      });
      metaBox.querySelector("#input-char-player").addEventListener("input", (e) => {
        this.charData.meta.player = e.target.value;
      });

      section.appendChild(metaBox);

      // Catalogo de Racas
      const Registry = global.WuRulesRegistry || {};
      const racesMap = Registry.RACES || {};

      const racesContainer = document.createElement("div");
      racesContainer.className = "races-selection-section";
      racesContainer.innerHTML = `<h3 class="section-subtitle">Escolha sua Raca</h3>`;

      const raceGrid = document.createElement("div");
      raceGrid.className = "selection-cards-grid";

      Object.keys(racesMap).forEach((rId) => {
        const rDef = racesMap[rId];
        const isSelected = this.charData.identity.raceId === rId;

        const card = document.createElement("div");
        card.className = `selection-card ${isSelected ? "selected" : ""}`;

        let specialTag = "";
        if (rDef.overrides && rDef.overrides.vitalResource) {
          specialTag = `<span class="badge-tag-special">${rDef.overrides.vitalResource.label}</span>`;
        }

        card.innerHTML = `
          <div class="card-top">
            <span class="card-category">${rDef.category || "Ancestralidade"}</span>
            ${specialTag}
          </div>
          <h4 class="card-name">${rDef.name}</h4>
          <p class="card-desc">${rDef.traits ? rDef.traits[0].desc : ""}</p>
        `;

        card.addEventListener("click", () => {
          this.charData.identity.raceId = rId;
          this.charData.identity.raceVariant = rDef.variants ? rDef.variants[0].id : "";
          this.charData.abilities.racialTraits = rDef.traits ? rDef.traits.map(t => t.id) : [];

          this.updateCalculations();
          this.render();
        });

        raceGrid.appendChild(card);
      });

      racesContainer.appendChild(raceGrid);
      section.appendChild(racesContainer);

      // Detalhes da Raca Selecionada + Variantes se houver (ex: Espectros)
      const selectedRace = racesMap[this.charData.identity.raceId];
      if (selectedRace) {
        const detailBox = document.createElement("div");
        detailBox.className = "card-sub-box race-detail-box";

        let variantsHtml = "";
        if (Array.isArray(selectedRace.variants)) {
          variantsHtml = `
            <div class="variants-selector-wrap">
              <h4 class="variants-title">Escolha o Tipo de Anomalia Cosmica</h4>
              <div class="variants-buttons-grid">
                ${selectedRace.variants.map((v) => `
                  <button type="button" class="variant-select-btn ${this.charData.identity.raceVariant === v.id ? "active" : ""}" data-vid="${v.id}">
                    <strong>${v.name}</strong>
                    <span>${v.desc}</span>
                  </button>
                `).join("")}
              </div>
            </div>
          `;
        }

        detailBox.innerHTML = `
          <div class="race-detail-header">
            <h4>${selectedRace.name} — Caracteristicas Raciais</h4>
          </div>
          <ul class="race-traits-list">
            ${(selectedRace.traits || []).map((t) => `
              <li><strong>${t.name}:</strong> ${t.desc}</li>
            `).join("")}
          </ul>
          ${variantsHtml}
        `;

        const variantBtns = detailBox.querySelectorAll(".variant-select-btn");
        variantBtns.forEach((btn) => {
          btn.addEventListener("click", (e) => {
            const vid = btn.getAttribute("data-vid");
            this.charData.identity.raceVariant = vid;
            this.updateCalculations();
            this.render();
          });
        });

        section.appendChild(detailBox);
      }

      return section;
    },

    // --------------------------------------------------------
    // PASSO 2: VOCACAO
    // --------------------------------------------------------
    renderStep2() {
      const section = document.createElement("div");
      section.className = "step-section step-2";

      section.innerHTML = `
        <div class="step-heading">
          <span class="step-sub">Fase 2 de 5</span>
          <h2 class="step-title">Vocacao de Origem</h2>
          <p class="step-intro">A vocacao define a historia pregressa do aventureiro, concedendo pericias treinadas e itens de preparo.</p>
        </div>
      `;

      const Registry = global.WuRulesRegistry || {};
      const vocationsMap = Registry.VOCATIONS || {};

      const vocGrid = document.createElement("div");
      vocGrid.className = "selection-cards-grid";

      Object.keys(vocationsMap).forEach((vId) => {
        const vDef = vocationsMap[vId];
        const isSelected = this.charData.identity.vocationId === vId;

        const card = document.createElement("div");
        card.className = `selection-card ${isSelected ? "selected" : ""}`;

        const skillNames = (vDef.trainedSkills || []).map(s => Registry.SKILLS[s]?.name || s).join(" e ");

        card.innerHTML = `
          <div class="card-top">
            <span class="card-category">Origem</span>
          </div>
          <h4 class="card-name">${vDef.name}</h4>
          <p class="card-desc"><strong>Pericias:</strong> ${skillNames}</p>
          <div class="card-footer-power">
            <span>${vDef.powers ? vDef.powers[0].name : ""}</span>
          </div>
        `;

        card.addEventListener("click", () => {
          this.charData.identity.vocationId = vId;
          this.charData.skills.trained = [...(vDef.trainedSkills || [])];
          this.charData.abilities.vocationPowers = vDef.powers ? vDef.powers.map(p => p.id) : [];

          // Adiciona o kit padrao ao inventario se houver
          if (vDef.defaultKitId && Registry.KITS[vDef.defaultKitId]) {
            const kitDef = Registry.KITS[vDef.defaultKitId];
            this.charData.equipment.kits = [
              { id: kitDef.id, name: kitDef.name, load: kitDef.load }
            ];
            // Adiciona itens do kit
            this.charData.equipment.items = (kitDef.containedItemIds || []).map(itemId => ({
              id: itemId,
              name: itemId.replace(/_/g, " "),
              load: 1,
              kitId: kitDef.id,
              quantity: 1
            }));
          }

          this.updateCalculations();
          this.render();
        });

        vocGrid.appendChild(card);
      });

      section.appendChild(vocGrid);
      return section;
    },

    // --------------------------------------------------------
    // PASSO 3: ATRIBUTOS
    // --------------------------------------------------------
    renderStep3() {
      const section = document.createElement("div");
      section.className = "step-section step-3";

      section.innerHTML = `
        <div class="step-heading">
          <span class="step-sub">Fase 3 de 5</span>
          <h2 class="step-title">Distribuicao de Atributos</h2>
          <p class="step-intro">Aloue a matriz fixa da Edicao 2.0 nos cinco atributos fundamentais: <strong>[+3, +2, +1, +1, 0]</strong>.</p>
        </div>
      `;

      const attrGrid = document.createElement("div");
      attrGrid.className = "attributes-assigner-grid";

      const attrsInfo = [
        { key: "for", name: "Forca", desc: "Potencia muscular, dano de impacto e capacidade de carga." },
        { key: "des", name: "Destreza", desc: "Reflexos, agilidade, esquiva e precisao com armas ageis." },
        { key: "vig", name: "Vigor", desc: "Constituicao fisica, folego e tolerancia a ferimentos." },
        { key: "men", name: "Mente", desc: "Logica, deducoes analiticas, alquimia e estabilidade cosmica." },
        { key: "exp", name: "Expressao", desc: "Presenca social, fervor espiritual, labia e lideranca." }
      ];

      // Valores disponiveis na matriz fixa
      const standardPills = [3, 2, 1, 1, 0];

      attrsInfo.forEach((attr) => {
        const row = document.createElement("div");
        row.className = "attribute-assign-row";

        const currentVal = this.charData.attributes.base[attr.key];

        row.innerHTML = `
          <div class="attr-info-col">
            <h4 class="attr-title">${attr.name} <span class="attr-code">${attr.key.toUpperCase()}</span></h4>
            <p class="attr-desc">${attr.desc}</p>
          </div>
          <div class="attr-pill-selector-col" id="selector-${attr.key}">
            <div class="pills-option-group">
              ${standardPills.map((val, idx) => `
                <button type="button" class="attr-pill-btn ${currentVal === val && this.assignedPills[attr.key] === idx ? "active" : ""}" data-val="${val}" data-idx="${idx}">
                  ${val >= 0 ? `+${val}` : val}
                </button>
              `).join("")}
            </div>
          </div>
        `;

        const btns = row.querySelectorAll(".attr-pill-btn");
        btns.forEach((b) => {
          b.addEventListener("click", () => {
            const val = Number(b.getAttribute("data-val"));
            const idx = Number(b.getAttribute("data-idx"));

            // Desaloca se outra chave estava com esse indice
            for (const k in this.assignedPills) {
              if (this.assignedPills[k] === idx) {
                this.assignedPills[k] = null;
                this.charData.attributes.base[k] = 0;
              }
            }

            this.assignedPills[attr.key] = idx;
            this.charData.attributes.base[attr.key] = val;

            this.updateCalculations();
            this.render();
          });
        });

        attrGrid.appendChild(row);
      });

      section.appendChild(attrGrid);
      return section;
    },

    // --------------------------------------------------------
    // PASSO 4: CLASSE E PODERES INICIAIS
    // --------------------------------------------------------
    renderStep4() {
      const section = document.createElement("div");
      section.className = "step-section step-4";

      section.innerHTML = `
        <div class="step-heading">
          <span class="step-sub">Fase 4 de 5</span>
          <h2 class="step-title">Classe e Poderes Iniciais</h2>
          <p class="step-intro">Sua classe concede o papel tatico, habilidades caracteristicas e escolhas de tecnicas de combate.</p>
        </div>
      `;

      const Registry = global.WuRulesRegistry || {};
      const classesMap = Registry.CLASSES || {};

      const classGrid = document.createElement("div");
      classGrid.className = "selection-cards-grid";

      Object.keys(classesMap).forEach((cId) => {
        const cDef = classesMap[cId];
        const isSelected = this.charData.identity.classId === cId;

        const card = document.createElement("div");
        card.className = `selection-card ${isSelected ? "selected" : ""}`;

        card.innerHTML = `
          <div class="card-top">
            <span class="card-category">${cDef.role}</span>
          </div>
          <h4 class="card-name">${cDef.name}</h4>
          <p class="card-desc">Vida: ${cDef.baseHpInitial} + VIG inicial | EA: ${cDef.baseEaInitial} + 10/nivel</p>
          <div class="card-footer-power">
            <span>Resistencias: ${cDef.savingThrows.join(" e ").toUpperCase()}</span>
          </div>
        `;

        card.addEventListener("click", () => {
          this.charData.identity.classId = cId;

          // Habilidade caracteristica automatica do nivel 1
          if (cDef.progression && cDef.progression.characteristicAbilities[1]) {
            this.charData.abilities.characteristics = [cDef.progression.characteristicAbilities[1].id];
          }

          // Reseta escolha se for nova classe
          this.charData.abilities.choices["1"] = null;

          this.updateCalculations();
          this.render();
        });

        classGrid.appendChild(card);
      });

      section.appendChild(classGrid);

      // Se classe selecionada, mostra Habilidade Caracteristica Nivel 1 e Escolha Nivel 1
      const selectedClass = classesMap[this.charData.identity.classId];
      if (selectedClass && selectedClass.progression) {
        const powersBox = document.createElement("div");
        powersBox.className = "card-sub-box powers-setup-box";

        const charNv1 = selectedClass.progression.characteristicAbilities[1];
        const choicesNv1 = selectedClass.progression.choices[1] || [];

        powersBox.innerHTML = `
          <div class="power-tier-header">
            <h4>Habilidade Caracteristica Automatica — Nivel 1</h4>
          </div>
          <div class="characteristic-power-badge-card">
            <span class="ability-tag-char">Habilidade Caracteristica</span>
            <h5 class="char-power-title">${charNv1.name} <span class="badge-tag-passiva">${charNv1.tag}</span></h5>
            <p class="char-power-desc">${charNv1.desc}</p>
          </div>

          <div class="power-tier-header" style="margin-top: var(--space-xl);">
            <h4>Escolha de Poder — Nivel 1 (Selecione 1)</h4>
          </div>
          <div class="choices-power-grid">
            ${choicesNv1.map((choice) => `
              <div class="choice-power-card ${this.charData.abilities.choices["1"] === choice.id ? "selected" : ""}" data-cid="${choice.id}">
                <div class="choice-card-top">
                  <span class="choice-title">${choice.name}</span>
                  <span class="choice-cost">${choice.cost}</span>
                </div>
                <p class="choice-desc">${choice.desc}</p>
                <div class="choice-action-indicator">
                  ${this.charData.abilities.choices["1"] === choice.id ? "SELECIONADO" : "CLIQUE PARA ESCOLHER"}
                </div>
              </div>
            `).join("")}
          </div>
        `;

        const choiceCards = powersBox.querySelectorAll(".choice-power-card");
        choiceCards.forEach((c) => {
          c.addEventListener("click", () => {
            const cid = c.getAttribute("data-cid");
            this.charData.abilities.choices["1"] = cid;
            this.updateCalculations();
            this.render();
          });
        });

        section.appendChild(powersBox);
      }

      return section;
    },

    // --------------------------------------------------------
    // PASSO 5: CARGA E REVISAO FINAL
    // --------------------------------------------------------
    renderStep5() {
      const section = document.createElement("div");
      section.className = "step-section step-5";

      section.innerHTML = `
        <div class="step-heading">
          <span class="step-sub">Fase 5 de 5</span>
          <h2 class="step-title">Equipamento, Carga e Conclusao</h2>
          <p class="step-intro">Revise os espacos de carga, equipamentos transportados e confira a integridade da ficha criada.</p>
        </div>
      `;

      const loadCalc = this.calculationState ? this.calculationState.load : { current: 0, max: 5, status: "normal" };

      const loadBox = document.createElement("div");
      loadBox.className = "card-sub-box load-monitor-box";

      const percent = Math.min(100, Math.round((loadCalc.current / loadCalc.max) * 100));

      loadBox.innerHTML = `
        <div class="load-monitor-header">
          <div>
            <h4 class="load-title">Capacidade de Carga (Capitulo 6)</h4>
            <span class="load-formula">Formula: (FOR vezes 3) + 5 = <strong>${loadCalc.max} Espacos</strong></span>
          </div>
          <div class="load-badge ${loadCalc.status}">
            ${loadCalc.current} / ${loadCalc.max} ESPACOS
          </div>
        </div>
        <div class="load-progress-bar-wrap">
          <div class="load-progress-bar-fill ${loadCalc.status}" style="width: ${percent}%;"></div>
        </div>
        <div class="load-rules-note">
          Itens armazenados dentro de um kit fechado contam apenas o peso do kit fechado no inventario.
        </div>
      `;

      section.appendChild(loadBox);

      // Revisao Geral Consolidada
      const reviewBox = document.createElement("div");
      reviewBox.className = "card-sub-box final-review-box";

      const vitals = this.calculationState?.vitals || { resourceLabel: "Vida", max: 10 };
      const def = this.calculationState?.defense?.total || 10;
      const maestry = this.calculationState?.maestry || 2;

      reviewBox.innerHTML = `
        <h4 class="review-title">Resumo da Ficha — Nivel 1</h4>
        <div class="review-stats-grid">
          <div class="review-stat-item">
            <span class="stat-name">Nome</span>
            <span class="stat-val">${this.charData.meta.name || "Aventureiro"}</span>
          </div>
          <div class="review-stat-item">
            <span class="stat-name">Raca</span>
            <span class="stat-val">${this.charData.identity.raceId || "Nao selecionada"}</span>
          </div>
          <div class="review-stat-item">
            <span class="stat-name">Vocacao</span>
            <span class="stat-val">${this.charData.identity.vocationId || "Nao selecionada"}</span>
          </div>
          <div class="review-stat-item">
            <span class="stat-name">Classe</span>
            <span class="stat-val">${this.charData.identity.classId || "Nao selecionada"}</span>
          </div>
          <div class="review-stat-item">
            <span class="stat-name">${vitals.resourceLabel}</span>
            <span class="stat-val stat-highlight">${vitals.max}</span>
          </div>
          <div class="review-stat-item">
            <span class="stat-name">Defesa (DEF)</span>
            <span class="stat-val stat-highlight">${def}</span>
          </div>
          <div class="review-stat-item">
            <span class="stat-name">Energia Astral</span>
            <span class="stat-val stat-highlight">${vitals.energyAstral?.max || 25}</span>
          </div>
          <div class="review-stat-item">
            <span class="stat-name">Maestria</span>
            <span class="stat-val">+${maestry}</span>
          </div>
        </div>
      `;

      section.appendChild(reviewBox);
      return section;
    },

    // --------------------------------------------------------
    // PAINEL LATERAL: PREVIA REATIVA EM TEMPO REAL
    // --------------------------------------------------------
    renderSidebarPreview() {
      const aside = document.createElement("aside");
      aside.className = "wizard-preview-sidebar";
      aside.id = "wizard-preview-sidebar";

      const vitals = this.calculationState?.vitals || { resourceLabel: "Vida", max: 10, resourceType: "pv" };
      const ea = this.calculationState?.vitals?.energyAstral?.max || 25;
      const def = this.calculationState?.defense?.total || 10;
      const load = this.calculationState?.load || { current: 0, max: 5 };
      const maestry = this.calculationState?.maestry || 2;
      const attrs = this.calculationState?.effectiveAttributes || { for: 0, des: 0, vig: 0, men: 0, exp: 0 };

      aside.innerHTML = `
        <div class="preview-header">
          <span class="preview-tag">PREVIA EM TEMPO REAL</span>
          <h3 class="preview-name">${this.charData.meta.name || "Novo Personagem"}</h3>
          <span class="preview-concept">${this.charData.meta.concept || "Sem conceito definido"}</span>
        </div>

        <div class="preview-metrics-grid">
          <div class="metric-card metric-vital">
            <span class="metric-label">${vitals.resourceLabel}</span>
            <span class="metric-value">${vitals.max}</span>
          </div>
          <div class="metric-card metric-ea">
            <span class="metric-label">Energia Astral</span>
            <span class="metric-value">${ea}</span>
          </div>
          <div class="metric-card metric-def">
            <span class="metric-label">Defesa Total</span>
            <span class="metric-value">${def}</span>
          </div>
          <div class="metric-card metric-load">
            <span class="metric-label">Carga</span>
            <span class="metric-value">${load.current}/${load.max}</span>
          </div>
        </div>

        <div class="preview-attrs-strip">
          <div class="preview-attr-chip">FOR: <strong>${attrs.for >= 0 ? `+${attrs.for}` : attrs.for}</strong></div>
          <div class="preview-attr-chip">DES: <strong>${attrs.des >= 0 ? `+${attrs.des}` : attrs.des}</strong></div>
          <div class="preview-attr-chip">VIG: <strong>${attrs.vig >= 0 ? `+${attrs.vig}` : attrs.vig}</strong></div>
          <div class="preview-attr-chip">MEN: <strong>${attrs.men >= 0 ? `+${attrs.men}` : attrs.men}</strong></div>
          <div class="preview-attr-chip">EXP: <strong>${attrs.exp >= 0 ? `+${attrs.exp}` : attrs.exp}</strong></div>
        </div>

        <!-- Renderizacao dos Rastreadores Dinamicos Reativos -->
        <div class="preview-trackers-container" id="preview-trackers-container"></div>
      `;

      // Injeta Rastreadores Dinamicos
      const trackersContainer = aside.querySelector("#preview-trackers-container");
      const TrackersUI = global.WuDynamicTrackers;
      if (TrackersUI && this.calculationState?.trackers) {
        TrackersUI.renderAll(
          this.calculationState.trackers,
          this.charData.customTrackers,
          trackersContainer,
          (key, nextState) => {
            this.charData.customTrackers[key] = nextState;
            this.updateCalculations();
            this.refreshPreview();
          }
        );
      }

      return aside;
    },

    refreshPreview() {
      const aside = document.getElementById("wizard-preview-sidebar");
      if (aside && aside.parentNode) {
        const newAside = this.renderSidebarPreview();
        aside.parentNode.replaceChild(newAside, aside);
      }
    },

    async finishCreation() {
      const activeToken = global.WuAuthToken ? global.WuAuthToken.getActiveToken() : null;
      if (global.WuSheetStorage && activeToken) {
        try {
          await global.WuSheetStorage.saveSheet(activeToken, this.charData);
        } catch (err) {
          console.warn("Falha ao sincronizar ficha no Supabase:", err);
        }
      }

      // Salva no LocalStorage legado / local
      try {
        const Model = global.WuSheetModel;
        if (Model) {
          const serialized = Model.serializeCharacter(this.charData);
          localStorage.setItem(`wuitalur_v2_char_${this.charData.meta.id}`, serialized);
          localStorage.setItem("wuitalur_v2_active_char_id", this.charData.meta.id);
        }
      } catch (err) {
        console.warn("Nao foi possivel persistir ficha no localStorage:", err);
      }

      if (typeof this.onFinishCallback === "function") {
        this.onFinishCallback(this.charData, this.calculationState);
      } else {
        this.renderCompletionModal(activeToken);
      }
    },

    renderCompletionModal(activeToken) {
      const existingModal = document.getElementById("wizard-completion-modal");
      if (existingModal) existingModal.remove();

      const overlay = document.createElement("div");
      overlay.id = "wizard-completion-modal";
      overlay.className = "wizard-modal-overlay";

      const charName = this.charData.meta.name || "Aventureiro";
      const tokenDisplay = activeToken ? activeToken : "Armazenamento Local";

      overlay.innerHTML = `
        <div class="wizard-modal-dialog">
          <div class="wizard-modal-header">
            <span class="modal-sub">Processo Concluido</span>
            <h3 class="modal-title">Ficha Criada e Salva</h3>
          </div>
          <div class="wizard-modal-body">
            <p>O personagem <strong>${charName}</strong> foi registrado com integridade matematica no sistema 2.0.</p>
            <p style="color: #9E9AA6; font-size: 0.85rem; margin-top: 8px;">
              Vinculado ao token: <span class="auth-token-badge">${tokenDisplay}</span>
            </p>
          </div>
          <div class="wizard-modal-footer">
            <a href="fichas.html" class="btn-wizard btn-primary" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center;">
              Ver no Gerenciador de Fichas
            </a>
            <button type="button" class="btn-wizard btn-secondary" id="btn-modal-new-char">
              Criar Outro Personagem
            </button>
          </div>
        </div>
      `;

      document.body.appendChild(overlay);

      const newCharBtn = overlay.querySelector("#btn-modal-new-char");
      if (newCharBtn) {
        newCharBtn.addEventListener("click", () => {
          overlay.remove();
          this.init();
        });
      }
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = Wizard;
  } else {
    global.WuCreatorWizard = Wizard;
  }
})(typeof window !== "undefined" ? window : globalThis);
