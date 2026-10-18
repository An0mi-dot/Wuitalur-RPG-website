/* ============================================================
   WUITALUR RPG — CONTROLADOR DO BOLETIM INFORMATIVO
   Interface de Leitura e Arquivo de Boletins
   (Zero Emojis, Transições Limpas, Suporte a Deep-linking)
   ============================================================ */

const BoletimApp = {
  data: [],
  currentId: null,
  searchQuery: '',

  init() {
    if (!window.BOLETINS_DATA || !Array.isArray(window.BOLETINS_DATA)) {
      console.warn('Dados de boletins não encontrados.');
      return;
    }

    // Ordena garantindo sempre o mais recente primeiro (por número decrescente)
    this.data = [...window.BOLETINS_DATA].sort((a, b) => (b.numero || 0) - (a.numero || 0));

    // Determina o boletim inicial: via hash da URL ou o mais recente (primeiro)
    const hash = window.location.hash ? window.location.hash.replace('#', '').trim() : '';
    const initialItem = this.data.find(b => b.id === hash) || this.data[0];

    if (initialItem) {
      this.currentId = initialItem.id;
    }

    this.bindEvents();
    this.render();

    // Listener de mudanca de hash para permitir historico de navegacao
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '').trim();
      if (h && h !== this.currentId) {
        const found = this.data.find(b => b.id === h);
        if (found) {
          this.selectEdition(found.id, false);
        }
      }
    });
  },

  bindEvents() {
    const searchInput = document.getElementById('boletim-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = (e.target.value || '').trim().toLowerCase();
        this.renderArchiveList();
      });
    }

    const mobileToggle = document.getElementById('boletim-mobile-toggle-btn');
    const archivePane = document.getElementById('boletim-archive-pane');
    if (mobileToggle && archivePane) {
      mobileToggle.addEventListener('click', () => {
        archivePane.classList.toggle('is-open-mobile');
        const isOpen = archivePane.classList.contains('is-open-mobile');
        mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }
  },

  getCurrentItem() {
    return this.data.find(b => b.id === this.currentId) || this.data[0];
  },

  selectEdition(id, updateHash = true) {
    if (!id || id === this.currentId) {
      // Fecha menu mobile se clicar no mesmo
      this.closeMobileArchive();
      return;
    }

    this.currentId = id;
    if (updateHash) {
      window.location.hash = id;
    }

    this.renderArchiveList();
    this.renderReader();
    this.closeMobileArchive();

    // Rola o leitor para o topo suavemente
    const readerEl = document.getElementById('boletim-reader-card');
    if (readerEl) {
      readerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  },

  closeMobileArchive() {
    const archivePane = document.getElementById('boletim-archive-pane');
    if (archivePane) {
      archivePane.classList.remove('is-open-mobile');
    }
    const mobileToggle = document.getElementById('boletim-mobile-toggle-btn');
    if (mobileToggle) {
      mobileToggle.setAttribute('aria-expanded', 'false');
    }
  },

  render() {
    this.renderArchiveList();
    this.renderReader();
  },

  renderArchiveList() {
    const listContainer = document.getElementById('boletim-archive-list');
    if (!listContainer) return;

    let filtered = this.data;
    if (this.searchQuery) {
      filtered = this.data.filter(b => {
        const titleMatch = (b.titulo || '').toLowerCase().includes(this.searchQuery);
        const subMatch = (b.subtitulo || '').toLowerCase().includes(this.searchQuery);
        const resumeMatch = (b.resumo || '').toLowerCase().includes(this.searchQuery);
        const tagMatch = (b.tags || []).some(t => t.toLowerCase().includes(this.searchQuery));
        return titleMatch || subMatch || resumeMatch || tagMatch;
      });
    }

    if (filtered.length === 0) {
      listContainer.innerHTML = `
        <div class="boletim-empty-search">
          <p>Nenhuma edição encontrada para o termo pesquisado.</p>
        </div>
      `;
      return;
    }

    const latestId = this.data[0]?.id;

    listContainer.innerHTML = filtered.map((item) => {
      const isSelected = item.id === this.currentId;
      const isLatest = item.id === latestId;

      return `
        <article class="boletim-nav-card ${isSelected ? 'active' : ''}" 
                 onclick="BoletimApp.selectEdition('${item.id}')"
                 tabindex="0"
                 role="button"
                 aria-selected="${isSelected ? 'true' : 'false'}">
          <div class="boletim-nav-card-header">
            <span class="boletim-nav-ed-badge">${item.edicao}</span>
            ${isLatest ? '<span class="boletim-nav-latest-badge">Mais Recente</span>' : ''}
            <span class="boletim-nav-date">${item.data}</span>
          </div>
          <h4 class="boletim-nav-card-title">${item.titulo}</h4>
          <p class="boletim-nav-card-resumo">${item.resumo}</p>
          <div class="boletim-nav-card-footer">
            <span class="boletim-nav-readtime">${item.tempoLeitura}</span>
            <div class="boletim-nav-tags">
              ${(item.tags || []).slice(0, 2).map(t => `<span class="boletim-nav-tag">${t}</span>`).join('')}
            </div>
          </div>
        </article>
      `;
    }).join('');

    // Atualiza contadores
    const countEl = document.getElementById('boletim-archive-count');
    if (countEl) {
      countEl.textContent = `${this.data.length} ${this.data.length === 1 ? 'edição' : 'edições'}`;
    }
  },

  renderReader() {
    const readerContainer = document.getElementById('boletim-reader-view');
    if (!readerContainer) return;

    const item = this.getCurrentItem();
    if (!item) {
      readerContainer.innerHTML = '<p>Selecione uma edição para ler.</p>';
      return;
    }

    const currentIndex = this.data.findIndex(b => b.id === item.id);
    const prevItem = currentIndex < this.data.length - 1 ? this.data[currentIndex + 1] : null; // Anterior cronologicamente
    const nextItem = currentIndex > 0 ? this.data[currentIndex - 1] : null; // Próximo cronologicamente

    // Atualiza botão mobile de seleção atual
    const mobileCurrentLabel = document.getElementById('boletim-mobile-current-title');
    if (mobileCurrentLabel) {
      mobileCurrentLabel.textContent = `${item.edicao}: ${item.titulo}`;
    }

    const isLatest = currentIndex === 0;

    readerContainer.innerHTML = `
      <article class="boletim-reader-article" id="boletim-reader-card">
        <!-- Cabeçalho Editorial do Boletim -->
        <header class="boletim-article-header">
          <div class="boletim-header-badges">
            <span class="boletim-badge-pill edition">${item.edicao}</span>
            <span class="boletim-badge-pill season">${item.epoca}</span>
            ${isLatest ? '<span class="boletim-badge-pill latest">Mais Recente</span>' : ''}
          </div>

          <h2 class="boletim-article-title">${item.titulo}</h2>
          ${item.subtitulo ? `<p class="boletim-article-subtitle">${item.subtitulo}</p>` : ''}

          <div class="boletim-meta-bar">
            <div class="boletim-meta-item">
              <span class="boletim-meta-label">Data de Publicação</span>
              <span class="boletim-meta-val">${item.data}</span>
            </div>
            <div class="boletim-meta-item">
              <span class="boletim-meta-label">Expedido por</span>
              <span class="boletim-meta-val">${item.autor}</span>
            </div>
            <div class="boletim-meta-item">
              <span class="boletim-meta-label">Tempo Estimado</span>
              <span class="boletim-meta-val">${item.tempoLeitura}</span>
            </div>
          </div>

          <div class="boletim-tags-row">
            ${(item.tags || []).map(t => `<span class="boletim-tag-chip">#${t}</span>`).join('')}
          </div>
        </header>

        <!-- Divisor Ornamental de Nanquim -->
        <div class="boletim-divider-nanquim">
          <span class="boletim-divider-glyph">&#x25C7;</span>
        </div>

        <!-- Conteúdo Textual Formatado -->
        <div class="boletim-article-body">
          ${item.conteudoHtml}
        </div>

        ${(prevItem || nextItem) ? `
        <!-- Rodapé com Navegação Entre Edições -->
        <footer class="boletim-article-footer">
          <div class="boletim-nav-actions">
            ${prevItem ? `
              <button type="button" class="boletim-nav-arrow-btn prev" onclick="BoletimApp.selectEdition('${prevItem.id}')">
                <span class="arrow-icon">&larr;</span>
                <div class="arrow-content">
                  <span class="arrow-sub">Edição Anterior</span>
                  <span class="arrow-title">${prevItem.edicao} &mdash; ${prevItem.titulo}</span>
                </div>
              </button>
            ` : '<div class="boletim-nav-arrow-placeholder"></div>'}

            ${nextItem ? `
              <button type="button" class="boletim-nav-arrow-btn next" onclick="BoletimApp.selectEdition('${nextItem.id}')">
                <div class="arrow-content text-right">
                  <span class="arrow-sub">Edição Seguinte</span>
                  <span class="arrow-title">${nextItem.edicao} &mdash; ${nextItem.titulo}</span>
                </div>
                <span class="arrow-icon">&rarr;</span>
              </button>
            ` : '<div class="boletim-nav-arrow-placeholder"></div>'}
          </div>
        </footer>
        ` : ''}
      </article>
    `;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  BoletimApp.init();
});

if (typeof window !== 'undefined') {
  window.BoletimApp = BoletimApp;
}
