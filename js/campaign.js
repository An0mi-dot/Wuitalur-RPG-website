/**
 * ============================================================
 * WUITALUR RPG — CONTROLADOR DO DOSSIÊ DA CAMPANHA
 * Interface Dinâmica de Consulta para Áreas e NPCs
 * Sistema de Autenticação e Proteção Confidencial do Mestre
 * ============================================================
 */

(function () {
  'use strict';

  const CampaignApp = {
    currentTab: 'areas', // 'areas' | 'npcs'
    selectedAreaId: 'colegio-primordio',
    selectedNpcId: 'gustavo',
    isMaster: false,
    hideMasterNotes: false, // Modo Apresentação: oculta segredos para projetar tela

    MASTER_HASHES: [
      '3be80f43b640706663346f0b1fb5aa2a9c26e6b6d27a934139854e111355a93b', // Z9K4
      'c43cc5a2574d90e4a87d2ba0db242c99b3cdc0cbfd8c94448724b591320953ef'  // WUI-Z9K4-MAST
    ],

    MASTER_PLAIN_TOKENS: ['Z9K4', 'WUI-Z9K4-MAST', 'MESTRE', 'MASTER', 'ADM', 'ADMIN', 'GM', 'Z9K4-MAST'],

    PLAYER_TOKENS: {
      'X7V2': 'Thulita De La Benevidez',
      'N3L8': 'Sanguiminerva "Minerva" Von Adams',
      'R5K1': 'Eric "Blade" Adams',
      'H2Q9': 'Pera Hylidae da Silva',
      'J8W4': 'Willian Kars',
      'T6D3': 'John Doe',
      'Y4M7': 'Odara De La Benevidez',
      'F9C5': "Canneth 'Blinko' Biloxi"
    },

    async sha256(text) {
      if (!text) return '';
      try {
        const encoder = new TextEncoder();
        const data = encoder.encode(text.trim().toUpperCase());
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      } catch (e) {
        return '';
      }
    },

    async verifyToken(rawToken) {
      if (!rawToken) return { isMaster: false, isPlayer: false };
      const token = String(rawToken).trim().toUpperCase();

      // 1. Verifica se é token de jogador conhecido
      if (this.PLAYER_TOKENS[token]) {
        return { isMaster: false, isPlayer: true, charName: this.PLAYER_TOKENS[token] };
      }

      // 2. Verifica se é token do mestre em texto plano
      if (this.MASTER_PLAIN_TOKENS.includes(token)) {
        return { isMaster: true, isPlayer: false };
      }

      // 3. Verifica hash SHA-256
      const hash = await this.sha256(token);
      if (this.MASTER_HASHES.includes(hash)) {
        return { isMaster: true, isPlayer: false };
      }

      return { isMaster: false, isPlayer: false };
    },

    async init() {
      // Carrega dados globais se disponíveis
      if (!window.CAMPAIGN_AREAS || !window.CAMPAIGN_NPCS) {
        console.error('Dados da campanha não encontrados em window.');
        return;
      }

      // Verifica token salvo no localStorage (sincronizado com mesa_token da Mesa Virtual)
      const savedToken = localStorage.getItem('mesa_token');
      if (savedToken) {
        const auth = await this.verifyToken(savedToken);
        if (auth.isMaster) {
          this.isMaster = true;
        }
      }

      this.renderAuthBanner();
      this.renderTabNav();
      this.renderCurrentView();
    },

    renderAuthBanner() {
      const banner = document.getElementById('campaign-auth-banner');
      if (!banner) return;

      if (this.isMaster) {
        banner.className = 'campaign-auth-banner is-master';
        banner.innerHTML = `
          <div class="auth-status-info">
            <div class="auth-status-icon">
              <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div class="auth-status-texts">
              <h4>MESTRE DA SESSÃO AUTENTICADO</h4>
              <p>Acesso total liberado aos segredos dos NPCs, notas confidenciais de bastidores e testes de perícia.</p>
            </div>
          </div>
          <div class="auth-btn-group">
            <button class="auth-action-btn auth-btn-toggle ${this.hideMasterNotes ? 'active' : ''}" onclick="CampaignApp.togglePresentationMode()" title="Ocultar notas confidenciais ao compartilhar tela com os jogadores">
              <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              ${this.hideMasterNotes ? 'Mostrar Segredos' : 'Modo Apresentação (Ocultar)'}
            </button>
            <button class="auth-action-btn auth-btn-lock" onclick="CampaignApp.lockMasterAccess()" title="Bloquear acesso e retornar à visão de jogador">
              <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Bloquear Acesso
            </button>
            <a href="mesa.html" class="auth-action-btn auth-btn-mesa">
              <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Mesa Virtual
            </a>
          </div>
        `;
      } else {
        banner.className = 'campaign-auth-banner is-player';
        banner.innerHTML = `
          <div class="auth-status-info">
            <div class="auth-status-icon">
              <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            </div>
            <div class="auth-status-texts">
              <h4>MODO DE JOGADOR / VISITANTE • CONTEÚDO CONFIDENCIAL PROTEGIDO</h4>
              <p>Os segredos dos NPCs, notas confidenciais de bastidores e testes são visíveis exclusivamente pelo Mestre da Sessão.</p>
            </div>
          </div>
          <div class="auth-btn-group">
            <button class="auth-action-btn auth-btn-unlock" onclick="CampaignApp.openAuthModal()">
              <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              Autenticar como Mestre
            </button>
            <a href="mesa.html" class="auth-action-btn auth-btn-mesa">
              <svg viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              Mesa Virtual
            </a>
          </div>
        `;
      }
    },

    togglePresentationMode() {
      this.hideMasterNotes = !this.hideMasterNotes;
      this.renderAuthBanner();
      this.renderCurrentView();
    },

    lockMasterAccess() {
      this.isMaster = false;
      this.hideMasterNotes = false;
      this.renderAuthBanner();
      this.renderTabNav();
      this.renderCurrentView();
    },

    openAuthModal() {
      const modal = document.getElementById('campaign-auth-modal');
      const input = document.getElementById('campaign-modal-token-input');
      const feedback = document.getElementById('campaign-modal-feedback');
      if (modal) modal.style.display = 'flex';
      if (feedback) feedback.style.display = 'none';
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 100);
      }
    },

    closeAuthModal() {
      const modal = document.getElementById('campaign-auth-modal');
      if (modal) modal.style.display = 'none';
    },

    async submitModalToken() {
      const input = document.getElementById('campaign-modal-token-input');
      const feedback = document.getElementById('campaign-modal-feedback');
      const submitBtn = document.getElementById('campaign-modal-submit-btn');
      if (!input || !feedback) return;

      const rawToken = input.value.trim();
      if (!rawToken) {
        feedback.className = 'gate-feedback-msg error';
        feedback.textContent = 'Por favor, digite o Token do Mestre.';
        feedback.style.display = 'block';
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Verificando...';
      }

      const auth = await this.verifyToken(rawToken);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Desbloquear Segredos';
      }

      if (auth.isMaster) {
        this.isMaster = true;
        localStorage.setItem('mesa_token', rawToken.toUpperCase());
        this.closeAuthModal();
        this.renderAuthBanner();
        this.renderTabNav();
        this.renderCurrentView();
      } else if (auth.isPlayer) {
        feedback.className = 'gate-feedback-msg error';
        feedback.innerHTML = `<strong>Acesso Negado:</strong> O token informado pertence ao jogador <em>${auth.charName}</em>. O Dossiê de NPCs e segredos de bastidores são visíveis apenas para o Mestre.`;
        feedback.style.display = 'block';
      } else {
        feedback.className = 'gate-feedback-msg error';
        feedback.textContent = 'Token de Mestre inválido ou não reconhecido pelo sistema.';
        feedback.style.display = 'block';
      }
    },

    async submitGateToken() {
      const input = document.getElementById('gate-token-input');
      const feedback = document.getElementById('gate-feedback-msg');
      const submitBtn = document.getElementById('gate-submit-btn');
      if (!input || !feedback) return;

      const rawToken = input.value.trim();
      if (!rawToken) {
        feedback.className = 'gate-feedback-msg error';
        feedback.textContent = 'Por favor, digite o Token do Mestre.';
        feedback.style.display = 'block';
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Verificando...';
      }

      const auth = await this.verifyToken(rawToken);

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Desbloquear Dossiê
        `;
      }

      if (auth.isMaster) {
        this.isMaster = true;
        localStorage.setItem('mesa_token', rawToken.toUpperCase());
        this.renderAuthBanner();
        this.renderTabNav();
        this.renderCurrentView();
      } else if (auth.isPlayer) {
        feedback.className = 'gate-feedback-msg error';
        feedback.innerHTML = `<strong>Acesso Negado:</strong> O token informado pertence ao jogador <em>${auth.charName}</em>. O Dossiê de NPCs e segredos de bastidores são visíveis apenas para o Mestre.`;
        feedback.style.display = 'block';
      } else {
        feedback.className = 'gate-feedback-msg error';
        feedback.textContent = 'Token de Mestre inválido ou não reconhecido pelo sistema.';
        feedback.style.display = 'block';
      }
    },

    switchTab(tab) {
      this.currentTab = tab;
      this.renderTabNav();
      this.renderCurrentView();
    },

    selectArea(areaId) {
      this.selectedAreaId = areaId;
      this.currentTab = 'areas';
      this.renderTabNav();
      this.renderCurrentView();
      window.scrollTo({ top: 120, behavior: 'smooth' });
    },

    selectNpc(npcId) {
      this.selectedNpcId = npcId;
      this.currentTab = 'npcs';
      this.renderTabNav();
      this.renderCurrentView();
      window.scrollTo({ top: 120, behavior: 'smooth' });
    },

    renderTabNav() {
      const container = document.getElementById('campaign-tab-nav');
      if (!container) return;

      const npcLabel = this.isMaster
        ? `Dossiê de NPCs (${Object.keys(window.CAMPAIGN_NPCS).length})`
        : 'Dossiê de NPCs (Restrito ao Mestre)';

      const npcIcon = this.isMaster
        ? '<svg class="tab-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>'
        : '<svg class="tab-icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>';

      container.innerHTML = `
        <button class="campaign-tab-btn ${this.currentTab === 'areas' ? 'active' : ''}" onclick="CampaignApp.switchTab('areas')">
          <svg class="tab-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          Áreas de Investigação (${Object.keys(window.CAMPAIGN_AREAS).length})
        </button>
        <button class="campaign-tab-btn ${this.currentTab === 'npcs' ? 'active' : ''}" onclick="CampaignApp.switchTab('npcs')">
          ${npcIcon}
          ${npcLabel}
        </button>
      `;
    },

    renderCurrentView() {
      const viewContainer = document.getElementById('campaign-view-container');
      if (!viewContainer) return;

      if (this.currentTab === 'areas') {
        this.renderAreaView(viewContainer);
      } else {
        this.renderNpcView(viewContainer);
      }
    },

    renderAreaView(container) {
      const area = window.CAMPAIGN_AREAS[this.selectedAreaId];
      if (!area) return;

      // Seletor de Áreas
      let areaButtonsHtml = '';
      Object.values(window.CAMPAIGN_AREAS).forEach(a => {
        const isSelected = a.id === this.selectedAreaId;
        areaButtonsHtml += `
          <button class="item-picker-btn ${isSelected ? 'active' : ''}" onclick="CampaignApp.selectArea('${a.id}')">
            ${a.shortName || a.nome}
            <span class="btn-badge">${a.pontos_de_interesse.length} PdIs</span>
          </button>
        `;
      });

      // Tags de NPCs presentes (VISÍVEIS APENAS PARA O MESTRE)
      let npcsHtml = '';
      if (this.isMaster) {
        if (area.npcs_presentes && area.npcs_presentes.length > 0) {
          area.npcs_presentes.forEach(npcId => {
            const npc = window.CAMPAIGN_NPCS[npcId];
            const npcName = npc ? npc.nome.split('•')[0].trim() : npcId;
            npcsHtml += `
              <button class="npc-tag-btn" onclick="CampaignApp.selectNpc('${npcId}')" title="Ver ficha completa do NPC">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                <span>${npcName}</span>
              </button>
            `;
          });
        } else {
          npcsHtml = '<span style="color: var(--text-muted); font-size: 0.85rem;">Nenhum NPC registrado neste local no momento.</span>';
        }
      } else {
        // Bloqueado para jogadores
        npcsHtml = `
          <div class="area-npcs-locked">
            <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
            <span>Lista de NPCs presentes nesta área é confidencial (Acesso exclusivo do Mestre).</span>
          </div>
        `;
      }

      // Conexões de saída
      let exitsHtml = '';
      if (area.conexoes_saida && area.conexoes_saida.length > 0) {
        area.conexoes_saida.forEach(ex => {
          exitsHtml += `
            <div class="exit-link-card" onclick="CampaignApp.selectArea('${ex.area_id}')" title="Ir para esta área">
              <div class="exit-card-top">
                <span class="exit-name">${ex.nome}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
              </div>
              <span class="exit-gancho">${ex.gancho}</span>
            </div>
          `;
        });
      }

      // Pontos de Interesse (PdIs) estruturados conforme o Schema
      let pdisHtml = '';
      area.pontos_de_interesse.forEach((pdi, idx) => {
        const numPadded = (idx + 1) < 10 ? '0' + (idx + 1) : (idx + 1);

        // Se for o Mestre: exibe a tabela de testes de perícia com DT e informação revelada
        let testsBlockHtml = '';
        if (this.isMaster) {
          let testsRowsHtml = '';
          pdi.testes.forEach(t => {
            testsRowsHtml += `
              <tr>
                <td class="pdi-skill-name">${t.pericia}</td>
                <td style="text-align: center;"><span class="pdi-dt-badge">DT ${t.ct_dt}</span></td>
                <td class="pdi-info-text">${t.informacao_revelada}</td>
              </tr>
            `;
          });

          testsBlockHtml = `
            <div class="pdi-tests-table-wrap">
              <table class="pdi-tests-table">
                <thead>
                  <tr>
                    <th class="th-pericia">Perícia</th>
                    <th class="th-dt">Classe de Teste (CT/DT)</th>
                    <th class="th-info">Informação Revelada</th>
                  </tr>
                </thead>
                <tbody>
                  ${testsRowsHtml}
                </tbody>
              </table>
            </div>
          `;
        } else {
          // Para jogadores: exibe placeholder indicando que os testes são secretos
          testsBlockHtml = `
            <div class="pdi-locked-tests-placeholder">
              <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <div>
                <strong>Testes de Perícia & Informações Reveladas Ocultas</strong>
                <p>As dificuldades (DTs) e descobertas deste Ponto de Interesse são confidenciais do Mestre e serão reveladas mediante testes de dados durante a sessão.</p>
              </div>
            </div>
          `;
        }

        // Notas do Mestre (exclusivas do mestre e ocultas caso esteja em modo apresentação)
        let masterNotesHtml = '';
        if (this.isMaster && !this.hideMasterNotes) {
          masterNotesHtml = `
            <div class="pdi-master-notes-box">
              <div class="master-notes-icon" title="Segredo do Mestre">
                <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div class="master-notes-content">
                <span class="master-notes-label">[NOTAS DO MESTRE • SEGREDO CONFIDENCIAL]</span>
                <p>${pdi.notas_mestre}</p>
              </div>
            </div>
          `;
        }

        pdisHtml += `
          <div class="pdi-session-card">
            <!-- CABEÇALHO DO PDI (PÚBLICO) -->
            <div class="pdi-session-header">
              <div class="pdi-badge-row">
                <span class="pdi-index-pill">Ponto de Interesse ${numPadded}</span>
              </div>
              <h3 class="pdi-session-title">${pdi.cabecalho.nome}</h3>
              <p class="pdi-public-desc">${pdi.cabecalho.descricao_publica}</p>
            </div>

            <!-- TABELA DE TESTES -->
            ${testsBlockHtml}

            <!-- NOTAS DO MESTRE (APENAS MESTRE) -->
            ${masterNotesHtml}
          </div>
        `;
      });

      container.innerHTML = `
        <div class="campaign-item-picker">
          ${areaButtonsHtml}
        </div>

        <div class="area-view-card">
          <div class="area-view-header">
            <div class="area-title-group">
              <div class="area-avatar-icon">${area.svgIcon || ''}</div>
              <div>
                <h2>${area.nome}</h2>
                <span class="area-district-label">${area.district} • Perigo: ${area.dangerLevel}</span>
              </div>
            </div>
          </div>

          <!-- RESUMO DA ATMOSFERA (O QUE OS JOGADORES SENTEM AO CHEGAR) -->
          <div class="area-atmosphere-box">
            <div class="atmosphere-label">
              <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
              Resumo da Atmosfera • O que os jogadores sentem ao chegar
            </div>
            <p>${area.resumo_atmosfera}</p>
          </div>

          <!-- REQUISITOS DE ACESSO -->
          <div class="area-access-box">
            <div class="access-label">
              <svg viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Requisitos de Acesso & Condições de Entrada
            </div>
            <p>${area.requisitos_acesso}</p>
          </div>

          <!-- NPCS PRESENTES NESTA LOCALIDADE -->
          <div class="area-npcs-section">
            <div class="section-subhead">
              <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
              NPCs Presentes no Local ${this.isMaster ? '(Clique para inspecionar)' : '(Exclusivo do Mestre)'}
            </div>
            <div class="area-npc-tags-list">
              ${npcsHtml}
            </div>
          </div>

          <!-- CONEXÕES DE SAÍDA / ROTAS -->
          <div class="area-exits-section">
            <div class="section-subhead">
              <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><polyline points="12 8 8 12 12 16"></polyline><line x1="16" y1="12" x2="8" y2="12"></line></svg>
              Conexões de Saída & Rotas Narrativas
            </div>
            <div class="exits-grid">
              ${exitsHtml}
            </div>
          </div>

          <!-- PONTOS DE INTERESSE DA SESSÃO -->
          <div style="margin-top: 14px;">
            <div class="section-subhead" style="color: #ffffff; font-size: 0.95rem;">
              <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              Pontos de Interesse (${area.pontos_de_interesse.length} PdIs Estruturados)
            </div>
            <div class="area-pdi-list-container">
              ${pdisHtml}
            </div>
          </div>
        </div>
      `;
    },

    renderNpcView(container) {
      // SE NÃO FOR O MESTRE: BLOQUEIA E EXIBE A TELA DE AUTENTICAÇÃO DO MESTRE
      if (!this.isMaster) {
        container.innerHTML = `
          <div class="master-gate-screen">
            <div class="gate-card">
              <div class="gate-icon-shield">
                <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <h2>DOSSIÊ DE NPCS • ACESSO RESTRITO AO MESTRE</h2>
              <p class="gate-desc">
                As fichas completas dos NPCs, histórico resumido, segredos úteis, gatilhos de revelação e papéis na conspiração são dados confidenciais reservados ao Mestre para conduzir as sessões sem spoilers para os jogadores.
              </p>
              
              <form class="gate-form" onsubmit="event.preventDefault(); CampaignApp.submitGateToken();">
                <div class="gate-input-wrap">
                  <input type="text" id="gate-token-input" placeholder="Token do Mestre (ex: Z9K4)" autocomplete="off" autocapitalize="characters" spellcheck="false">
                  <button type="submit" class="gate-submit-btn" id="gate-submit-btn">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    Desbloquear Dossiê
                  </button>
                </div>
                <div id="gate-feedback-msg" class="gate-feedback-msg" style="display: none;"></div>
              </form>
            </div>
          </div>
        `;
        return;
      }

      // SE FOR O MESTRE: RENDERIZAÇÃO COMPLETA DO DOSSIÊ
      let npcButtonsHtml = '';
      Object.values(window.CAMPAIGN_NPCS).forEach(n => {
        const isSelected = n.id === this.selectedNpcId;
        const shortName = n.nome.split('•')[0].trim();
        npcButtonsHtml += `
          <button class="item-picker-btn ${isSelected ? 'active' : ''}" onclick="CampaignApp.selectNpc('${n.id}')">
            ${shortName}
          </button>
        `;
      });

      let cardsHtml = '';
      const npcsToRender = Object.values(window.CAMPAIGN_NPCS);

      npcsToRender.forEach(npc => {
        const isFocused = npc.id === this.selectedNpcId;
        
        let roleClass = 'aliado';
        if (npc.ligacao_misterio.toLowerCase().includes('cúmplice') || npc.ligacao_misterio.toLowerCase().includes('mentora')) {
          roleClass = 'cumplice';
        } else if (npc.ligacao_misterio.toLowerCase().includes('vítima')) {
          roleClass = 'vitima';
        }

        // Procura em quais áreas este NPC está presente
        const areasFound = [];
        Object.values(window.CAMPAIGN_AREAS).forEach(a => {
          if (a.npcs_presentes && a.npcs_presentes.includes(npc.id)) {
            areasFound.push(a);
          }
        });

        let locationsHtml = '';
        if (areasFound.length > 0) {
          locationsHtml = areasFound.map(a => `
            <button class="npc-tag-btn" onclick="CampaignApp.selectArea('${a.id}')" style="font-size: 0.78rem; padding: 4px 8px;">
              ${a.shortName || a.nome}
            </button>
          `).join(' ');
        } else {
          locationsHtml = '<span style="color: var(--text-muted); font-size: 0.8rem;">Localização confidencial</span>';
        }

        // Se estiver em modo apresentação, mascara os segredos
        const secretContent = this.hideMasterNotes ? `
          <div style="color: #fca5a5; font-size: 0.84rem; font-style: italic;">[Segredo Útil ocultado temporariamente no Modo Apresentação]</div>
        ` : `<p>${npc.segredo_util}</p>`;

        const triggerContent = this.hideMasterNotes ? `
          <div style="color: #fde68a; font-size: 0.84rem; font-style: italic;">[Gatilho ocultado temporariamente no Modo Apresentação]</div>
        ` : `<p>${npc.gatilho_revelacao}</p>`;

        cardsHtml += `
          <div class="npc-dossier-card" id="npc-card-${npc.id}" style="${isFocused ? 'border-color: #ff7700; box-shadow: 0 0 25px rgba(255, 119, 0, 0.25);' : ''}">
            <!-- CABEÇALHO DO NPC -->
            <div class="npc-dossier-header">
              <div class="npc-badge-row">
                <span class="npc-id-badge">NPC ID: ${npc.id}</span>
                <span class="npc-role-tag ${roleClass}">${npc.ligacao_misterio.split('.')[0]}</span>
              </div>
              <h3 class="npc-dossier-name">${npc.nome}</h3>
            </div>

            <!-- CORPO DO DOSSIÊ -->
            <div class="npc-dossier-body">
              <!-- PERSONALIDADE -->
              <div class="npc-field-block">
                <span class="npc-field-label">Personalidade & Comportamento</span>
                <p>${npc.personalidade}</p>
              </div>

              <!-- HISTÓRIA RESUMIDA -->
              <div class="npc-field-block">
                <span class="npc-field-label">História Resumida</span>
                <p>${npc.historia_resumida}</p>
              </div>

              <!-- INFORMAÇÃO LIVRE -->
              <div class="npc-field-block">
                <span class="npc-field-label">Informação Livre (Diálogo Casual)</span>
                <p>${npc.informacao_livre}</p>
              </div>

              <!-- SEGREDO ÚTIL (DESTAQUE DA SESSÃO) -->
              <div class="npc-secret-box">
                <div class="npc-secret-label">
                  <svg viewBox="0 0 24 24"><path d="M21 2l-2 2m-6 6l7-7-2-2-7 7v4h4z"></path><path d="M3 15v6h6l11-11-6-6L3 15z"></path></svg>
                  Segredo Útil (Pista Crucial)
                </div>
                ${secretContent}
              </div>

              <!-- GATILHO DE REVELAÇÃO -->
              <div class="npc-trigger-box">
                <div class="npc-trigger-label">
                  <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  Gatilho de Revelação (Condição Exata)
                </div>
                ${triggerContent}
              </div>

              <!-- LIGAÇÃO COM O MISTÉRIO -->
              <div class="npc-field-block">
                <span class="npc-field-label">Papel na Conspiração / Ligação</span>
                <p style="color: #e4e4e7; font-weight: 600;">${npc.ligacao_misterio}</p>
              </div>

              <!-- LOCALIDADES ONDE PODE SER ENCONTRADO -->
              <div class="npc-field-block" style="margin-top: auto; padding-top: 10px; border-top: 1px dashed var(--border-subtle);">
                <span class="npc-field-label">Presente nas Áreas:</span>
                <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px;">
                  ${locationsHtml}
                </div>
              </div>
            </div>
          </div>
        `;
      });

      container.innerHTML = `
        <div class="campaign-item-picker">
          ${npcButtonsHtml}
        </div>

        <div class="npc-dossier-grid">
          ${cardsHtml}
        </div>
      `;
    }
  };

  // Inicialização no DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => CampaignApp.init());
  } else {
    CampaignApp.init();
  }

  // Exportação global
  window.CampaignApp = CampaignApp;

})();
