const fs = require('fs');
const htmlPath = 'c:/Users/jguiv/Desktop/COISAS/PROG/WuSistema/new-site/mesa.html';
let html = fs.readFileSync(htmlPath, 'utf8');

const desktopInsert = `
            <button type="button" class="quick-menu-item" onclick="MesaReactions.togglePicker(); MesaQuickMenu.close();">
              <svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
              <span>Reações Rápidas</span>
            </button>

            <button type="button" class="quick-menu-item" onclick="MesaSara.openModal(); MesaQuickMenu.close();">
              <svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
              <span>Sobre Sara</span>
            </button>

            <button type="button" id="menu-roteiro-btn" class="quick-menu-item master-item" onclick="MesaRoteiro.openModal(); MesaQuickMenu.close();" style="display: none; color: #a78bfa;">
              <svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
              <span>Roteiro da Campanha</span>
              <span class="quick-menu-badge-master">Mestre</span>
            </button>
`;

html = html.replace(/<button type="button" class="quick-menu-item" onclick="MesaReactions\.togglePicker\(\); MesaQuickMenu\.close\(\);">[\s\S]*?<span>Reações Rápidas<\/span>[\s\S]*?<\/button>/, desktopInsert);

const mobileInsert = `
          <button class="mobile-menu-item" onclick="MesaReactions.togglePicker(); MesaMobileMenu.close()">
            <svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
              <line x1="9" y1="9" x2="9.01" y2="9"></line>
              <line x1="15" y1="9" x2="15.01" y2="9"></line>
            </svg>
            <span>Reagir com Emoji</span>
          </button>

          <button class="mobile-menu-item" onclick="MesaSara.openModal(); MesaMobileMenu.close()">
            <svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path></svg>
            <span>Sobre Sara</span>
          </button>

          <button id="mobile-roteiro-item" class="mobile-menu-item master-item" onclick="MesaRoteiro.openModal(); MesaMobileMenu.close()" style="display: none; color: #a78bfa;">
            <svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <span>Roteiro da Campanha (Mestre)</span>
          </button>
`;

html = html.replace(/<button class="mobile-menu-item" onclick="MesaReactions\.togglePicker\(\); MesaMobileMenu\.close\(\)">[\s\S]*?<span>Reagir com Emoji<\/span>[\s\S]*?<\/button>/, mobileInsert);

const modals = `
    <!-- Modal Sobre Sara -->
    <div id="sara-modal" class="mesa-modal-overlay">
      <div class="mesa-modal ink-modal" style="max-width: 600px; padding: 0;">
        <button class="mesa-modal-close" onclick="MesaSara.closeModal()" style="top: 14px; right: 18px; z-index: 10;">&times;</button>
        
        <div style="display: flex; flex-direction: column;">
          <div style="position: relative; height: 180px; overflow: hidden; border-bottom: 2px solid var(--ink-edge-soft);">
            <div style="position: absolute; inset: 0; background: url('assets/sara_encruzilhada.jpg') center/cover no-repeat; opacity: 0.4; filter: grayscale(80%) sepia(20%);"></div>
            <div style="position: absolute; inset: 0; background: linear-gradient(to top, var(--ink-bg), transparent);"></div>
            
            <div style="position: absolute; bottom: -30px; left: 30px; display: flex; align-items: flex-end; gap: 20px;">
              <img src="assets/sara_avatar.jpg" alt="Sara Auguil" style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid var(--ink-bg); object-fit: cover; filter: sepia(30%) contrast(110%); box-shadow: 0 4px 12px rgba(0,0,0,0.5);">
            </div>
          </div>
          
          <div style="padding: 40px 30px 30px;">
            <h2 style="margin: 0 0 5px; font-family: var(--font-heading, 'Cinzel', serif); font-size: 1.8rem; color: var(--ink-text);">Sara Auguil</h2>
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
              <span class="area-meta-tag" style="font-size: 0.75rem; border: 1px solid var(--ink-edge-soft);">18 anos</span>
              <span class="area-meta-tag" style="font-size: 0.75rem; border: 1px solid var(--ink-edge-soft);">Estudante & Gerente</span>
            </div>
            
            <div style="font-family: var(--font-body, 'Merriweather', serif); font-size: 0.95rem; line-height: 1.6; color: var(--ink-text-dim);">
              <p style="margin-top: 0;">Conhecida como a garota carismática e "perfeitinha" do Colégio Primórdio. Dona de um intelecto afiado e talentos múltiplos, domina piano, violão, flauta e guitarra.</p>
              <p>Tem gostos muito próprios: ouve discos de vinil de rock alternativo antigo, adora fotografia analógica e tem um conhecimento enciclopédico sobre a botânica local.</p>
              <h4 style="margin: 20px 0 10px; color: var(--ink-text); font-family: var(--font-heading, 'Cinzel', serif); font-size: 1.1rem; border-bottom: 1px solid var(--ink-edge-soft); padding-bottom: 5px;">Ocupação e Passado</h4>
              <p style="margin-bottom: 0;">Atualmente trabalha e administra o "Café da Névoa", propriedade que assumiu como herança precoce após o misterioso desaparecimento da sua irmã mais velha (Trisha) no ano passado.</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Roteiro do Mestre -->
    <div id="master-script-modal" class="mesa-modal-overlay">
      <div class="mesa-modal ink-modal" style="width: min(1100px, 95vw); height: min(80vh, 800px); max-width: none; display: flex; flex-direction: column; padding: 0; overflow: hidden;">
        <button class="mesa-modal-close" onclick="MesaRoteiro.closeModal()" style="top: 14px; right: 18px; z-index: 10;">&times;</button>
        
        <div style="padding: 20px 24px; border-bottom: 2px solid var(--ink-edge-soft); display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            <h2 style="margin: 0; font-family: var(--font-heading, 'Cinzel', serif); font-size: 1.4rem; color: #a78bfa;">Roteiro da Campanha</h2>
          </div>
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 0.8rem; color: var(--ink-text-dim);">Episódio Atual:</span>
            <input type="text" id="roteiro-ep-input" class="mesa-input ink-input" style="width: 140px; padding: 6px 10px;" placeholder="Ex: Episódio 1" onchange="MesaRoteiro.changeEpisode(this.value)">
          </div>
        </div>

        <div style="display: flex; flex: 1; min-height: 0;">
          <!-- Menu Lateral de Episódios -->
          <div style="width: 240px; border-right: 1px solid var(--ink-edge-soft); background: rgba(0,0,0,0.2); display: flex; flex-direction: column;">
            <div style="padding: 14px; font-family: var(--font-heading, 'Cinzel', serif); font-size: 0.9rem; color: var(--ink-text-dim); border-bottom: 1px solid var(--ink-edge-soft); display: flex; justify-content: space-between; align-items: center;">
              <span>Arquivo</span>
              <button onclick="MesaRoteiro.createNewEpisode()" style="background: none; border: none; color: #a78bfa; cursor: pointer; font-size: 1.2rem; padding: 0;">+</button>
            </div>
            <div id="roteiro-list" style="flex: 1; overflow-y: auto; padding: 10px;">
              <!-- Renderizado dinamicamente -->
            </div>
          </div>

          <!-- Editor e Preview -->
          <div style="flex: 1; display: flex; flex-direction: column; position: relative;">
            <div style="display: flex; border-bottom: 1px solid var(--ink-edge-soft); background: rgba(0,0,0,0.3);">
              <button id="roteiro-tab-edit" class="area-tab-nav-btn active" style="flex: 1; border: none; border-bottom: 2px solid transparent;" onclick="MesaRoteiro.switchTab('edit')">Editor (Markdown)</button>
              <button id="roteiro-tab-preview" class="area-tab-nav-btn" style="flex: 1; border: none; border-bottom: 2px solid transparent;" onclick="MesaRoteiro.switchTab('preview')">Visualização</button>
            </div>
            
            <div id="roteiro-pane-edit" style="flex: 1; display: flex; flex-direction: column;">
              <textarea id="roteiro-textarea" class="mesa-input ink-input" style="flex: 1; border: none; resize: none; border-radius: 0; padding: 20px; font-family: monospace; font-size: 0.95rem; line-height: 1.6; background: transparent;" placeholder="Escreva o seu roteiro aqui usando Markdown...&#10;&#10;# Título Principal&#10;## Título Secundário&#10;- Lista de itens&#10;**Texto em Negrito**&#10;*Texto em Itálico*" oninput="MesaRoteiro.saveCurrent()"></textarea>
            </div>
            
            <div id="roteiro-pane-preview" style="flex: 1; display: none; padding: 30px; overflow-y: auto; background: var(--ink-bg);">
              <div id="roteiro-preview-content" style="font-family: var(--font-body, 'Merriweather', serif); font-size: 0.95rem; line-height: 1.6; color: var(--ink-text-dim);">
                <!-- Renderizado pelo Marked.js -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Biblioteca Marked.js para renderização de Markdown -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>

<script src="js/campaign-data.js?v=3.2.0"></script>
`;

html = html.replace(/<script src="js\/campaign-data\.js\?v=3\.2\.0"><\/script>/, modals);

fs.writeFileSync(htmlPath, html, 'utf8');

const jsPath = 'c:/Users/jguiv/Desktop/COISAS/PROG/WuSistema/new-site/js/mesa.js';
let js = fs.readFileSync(jsPath, 'utf8');

const jsAppend = `

// ============================================================
// 8. SARA MODAL
// ============================================================
const MesaSara = {
  openModal() {
    MesaApp.openModal('sara-modal');
  },
  closeModal() {
    MesaApp.closeModal('sara-modal');
  }
};

// ============================================================
// 9. GESTOR DE ROTEIROS DO MESTRE (MARKDOWN)
// ============================================================
const MesaRoteiro = {
  episodes: [],
  currentId: null,

  init() {
    const saved = localStorage.getItem('wu_master_scripts');
    if (saved) {
      try {
        this.episodes = JSON.parse(saved);
      } catch(e) {
        this.episodes = [];
      }
    }
    
    if (this.episodes.length === 0) {
      this.episodes.push({ id: Date.now().toString(), title: 'Episódio 1', content: '' });
    }
    this.currentId = this.episodes[0].id;
  },

  openModal() {
    if (!MesaApp.state.isMaster) return;
    this.init();
    this.renderList();
    this.loadEpisode(this.currentId);
    MesaApp.openModal('master-script-modal');
    this.switchTab('edit');
  },

  closeModal() {
    MesaApp.closeModal('master-script-modal');
  },

  saveData() {
    localStorage.setItem('wu_master_scripts', JSON.stringify(this.episodes));
  },

  renderList() {
    const listEl = document.getElementById('roteiro-list');
    if (!listEl) return;
    
    listEl.innerHTML = '';
    this.episodes.forEach(ep => {
      const btn = document.createElement('button');
      btn.className = 'area-tab-nav-btn ' + (ep.id === this.currentId ? 'active' : '');
      btn.style.display = 'block';
      btn.style.width = '100%';
      btn.style.textAlign = 'left';
      btn.style.marginBottom = '5px';
      btn.style.border = '1px solid transparent';
      if(ep.id === this.currentId) {
        btn.style.borderColor = '#a78bfa';
        btn.style.color = '#fff';
        btn.style.background = 'rgba(167, 139, 250, 0.1)';
      }
      btn.textContent = ep.title || 'Sem Título';
      btn.onclick = () => this.loadEpisode(ep.id);
      listEl.appendChild(btn);
    });
  },

  loadEpisode(id) {
    this.currentId = id;
    const ep = this.episodes.find(e => e.id === id);
    if (!ep) return;
    
    const titleInput = document.getElementById('roteiro-ep-input');
    const textArea = document.getElementById('roteiro-textarea');
    
    if (titleInput) titleInput.value = ep.title;
    if (textArea) textArea.value = ep.content;
    
    this.renderList();
    this.updatePreview();
  },

  changeEpisode(newTitle) {
    const ep = this.episodes.find(e => e.id === this.currentId);
    if (ep) {
      ep.title = newTitle;
      this.saveData();
      this.renderList();
    }
  },

  saveCurrent() {
    const ep = this.episodes.find(e => e.id === this.currentId);
    const textArea = document.getElementById('roteiro-textarea');
    if (ep && textArea) {
      ep.content = textArea.value;
      this.saveData();
      this.updatePreview();
    }
  },

  createNewEpisode() {
    const newEp = {
      id: Date.now().toString(),
      title: \`Episódio \${this.episodes.length + 1}\`,
      content: ''
    };
    this.episodes.push(newEp);
    this.saveData();
    this.loadEpisode(newEp.id);
  },

  switchTab(tab) {
    const editBtn = document.getElementById('roteiro-tab-edit');
    const previewBtn = document.getElementById('roteiro-tab-preview');
    const editPane = document.getElementById('roteiro-pane-edit');
    const previewPane = document.getElementById('roteiro-pane-preview');
    
    if (tab === 'edit') {
      if(editBtn) { editBtn.classList.add('active'); editBtn.style.borderBottomColor = '#a78bfa'; editBtn.style.color = '#a78bfa'; }
      if(previewBtn) { previewBtn.classList.remove('active'); previewBtn.style.borderBottomColor = 'transparent'; previewBtn.style.color = ''; }
      if(editPane) editPane.style.display = 'flex';
      if(previewPane) previewPane.style.display = 'none';
    } else {
      if(previewBtn) { previewBtn.classList.add('active'); previewBtn.style.borderBottomColor = '#a78bfa'; previewBtn.style.color = '#a78bfa'; }
      if(editBtn) { editBtn.classList.remove('active'); editBtn.style.borderBottomColor = 'transparent'; editBtn.style.color = ''; }
      if(editPane) editPane.style.display = 'none';
      if(previewPane) previewPane.style.display = 'block';
      this.updatePreview();
    }
  },

  updatePreview() {
    const previewEl = document.getElementById('roteiro-preview-content');
    const ep = this.episodes.find(e => e.id === this.currentId);
    if (previewEl && ep && window.marked) {
      previewEl.innerHTML = marked.parse(ep.content || '_Sem conteúdo_');
    }
  }
};
`;

js += jsAppend;

// Update updateMasterButtons
const target = "    const mobileNpcsItem = document.getElementById('mobile-npcs-item');";
const replace = "    const mobileNpcsItem = document.getElementById('mobile-npcs-item');\n    const roteiroBtn = document.getElementById('menu-roteiro-btn');\n    const mobileRoteiroBtn = document.getElementById('mobile-roteiro-item');";
js = js.replace(target, replace);

const target2 = "    if (mobileNpcsItem) {\n      mobileNpcsItem.style.display = isMaster ? 'flex' : 'none';\n    }";
const replace2 = "    if (mobileNpcsItem) {\n      mobileNpcsItem.style.display = isMaster ? 'flex' : 'none';\n    }\n    if (roteiroBtn) {\n      roteiroBtn.style.display = isMaster ? 'inline-flex' : 'none';\n    }\n    if (mobileRoteiroBtn) {\n      mobileRoteiroBtn.style.display = isMaster ? 'flex' : 'none';\n    }";
js = js.replace(target2, replace2);

fs.writeFileSync(jsPath, js, 'utf8');
