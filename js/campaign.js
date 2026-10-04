/**
 * ============================================================
 * WUITALUR RPG — CONTROLADOR DO DOSSIÊ DA CAMPANHA
 * Interface Dinâmica de Consulta para Áreas e NPCs
 * ============================================================
 */

(function () {
  'use strict';

  const CampaignApp = {
    currentTab: 'areas', // 'areas' | 'npcs'
    selectedAreaId: 'colegio-primordio',
    selectedNpcId: 'gustavo',

    init() {
      // Carrega dados globais se disponíveis
      if (!window.CAMPAIGN_AREAS || !window.CAMPAIGN_NPCS) {
        console.error('Dados da campanha não encontrados em window.');
        return;
      }

      this.renderTabNav();
      this.renderCurrentView();
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

      container.innerHTML = `
        <button class="campaign-tab-btn ${this.currentTab === 'areas' ? 'active' : ''}" onclick="CampaignApp.switchTab('areas')">
          <svg class="tab-icon" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          Áreas de Investigação (${Object.keys(window.CAMPAIGN_AREAS).length})
        </button>
        <button class="campaign-tab-btn ${this.currentTab === 'npcs' ? 'active' : ''}" onclick="CampaignApp.switchTab('npcs')">
          <svg class="tab-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          Dossiê de NPCs (${Object.keys(window.CAMPAIGN_NPCS).length})
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

      // Tags de NPCs presentes
      let npcsHtml = '';
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

        // Tabela de Testes
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

        pdisHtml += `
          <div class="pdi-session-card">
            <!-- CABEÇALHO DO PDI -->
            <div class="pdi-session-header">
              <div class="pdi-badge-row">
                <span class="pdi-index-pill">Ponto de Interesse ${numPadded}</span>
              </div>
              <h3 class="pdi-session-title">${pdi.cabecalho.nome}</h3>
              <p class="pdi-public-desc">${pdi.cabecalho.descricao_publica}</p>
            </div>

            <!-- TABELA DE TESTES (DESTAQUE VISUAL PARA MESTRAGEM) -->
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

            <!-- NOTAS DO MESTRE (DESTAQUE EXCLUSIVO DE BASTIDORES) -->
            <div class="pdi-master-notes-box">
              <div class="master-notes-icon" title="Segredo do Mestre">
                <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
              </div>
              <div class="master-notes-content">
                <span class="master-notes-label">[NOTAS DO MESTRE • SEGREDO CONFIDENCIAL]</span>
                <p>${pdi.notas_mestre}</p>
              </div>
            </div>
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
              <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              NPCs Presentes no Local (Clique para inspecionar)
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
      // Seletor de NPCs
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

      // Grade de todos os NPCs ou detalhe do selecionado
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
                <p>${npc.segredo_util}</p>
              </div>

              <!-- GATILHO DE REVELAÇÃO -->
              <div class="npc-trigger-box">
                <div class="npc-trigger-label">
                  <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                  Gatilho de Revelação (Condição Exata)
                </div>
                <p>${npc.gatilho_revelacao}</p>
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

  global.CampaignApp = CampaignApp;

  document.addEventListener('DOMContentLoaded', () => {
    CampaignApp.init();
  });

})(typeof window !== 'undefined' ? window : globalThis);
