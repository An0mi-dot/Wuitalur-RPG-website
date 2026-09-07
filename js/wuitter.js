/**
 * WUITTER — Motor Lógico & Rede Social In-Universe de Wuitalur RPG
 * 100% SVG Icons, Zero Emojis, LocalStorage Persistence & RPG Prop Generator
 */

const WUITTER_STORAGE_KEY_POSTS = 'wuitter_posts_v1';
const WUITTER_STORAGE_KEY_PERSONAS = 'wuitter_personas_v1';
const WUITTER_STORAGE_KEY_ACTIVE = 'wuitter_active_persona_v1';
const WUITTER_STORAGE_KEY_FOLLOWS = 'wuitter_following_v1';

// SVGs
const SVG_ICONS = {
  verifiedBlue: `<svg class="w-badge-verified w-badge-blue" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>`,
  verifiedGold: `<svg class="w-badge-verified w-badge-gold" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  verifiedRed: `<svg class="w-badge-verified w-badge-red" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/></svg>`,
  comment: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  rewuit: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  like: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  share: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  image: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  alert: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="7.86 2 16.14 2 22 7.86 22 16.14 16.14 22 7.86 22 2 16.14 2 7.86 7.86 2"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`
};

// Default Personas
const DEFAULT_PERSONAS = [
  {
    id: 'eric_blade',
    name: 'Detetive Eric Blade',
    handle: '@eric_blade',
    avatar: 'EB',
    avatarBg: '#ff1133',
    badge: 'blue',
    bio: 'Investigador independente. Especialista em anomalias e crimes sem explicação.',
    isDefault: true
  },
  {
    id: 'gazeta_wuitalur',
    name: 'Gazeta de Wuitalur',
    handle: '@gazeta_wuitalur',
    avatar: 'GW',
    avatarBg: '#1d9bf0',
    badge: 'gold',
    bio: 'O maior portal de notícias do continente. Cobertura factual 24 horas.',
    isDefault: true
  },
  {
    id: 'conclave_oficial',
    name: 'Conclave de Investigação',
    handle: '@conclave_oficial',
    avatar: 'CO',
    avatarBg: '#f59e0b',
    badge: 'gold',
    bio: 'Registro e contenção de eventos paranormais e fios do pesadelo.',
    isDefault: true
  },
  {
    id: 'helena_rossi',
    name: 'Dra. Helena Rossi',
    handle: '@helena_med',
    avatar: 'HR',
    avatarBg: '#10b981',
    badge: 'blue',
    bio: 'Médica-legista no Hospital Central. Não acredito no sobrenatural até ver a autópsia.',
    isDefault: true
  },
  {
    id: 'sussurros_noturnos',
    name: 'Sussurros da Noite',
    handle: '@sussurros_noturnos',
    avatar: 'SN',
    avatarBg: '#a855f7',
    badge: 'red',
    bio: 'O que a polícia não conta, eu posto. Olhem para cima às 3h.',
    isDefault: true
  }
];

// Default Posts
const DEFAULT_POSTS = [
  {
    id: 'wuit_1',
    authorId: 'conclave_oficial',
    text: 'COMUNICADO OFICIAL: Registramos um surto anômalo no setor norte da cidade. Nossos investigadores já estão no local analisando os Pontos de Interesse. Não se aproximem do casarão antigo. #Alerta #Conclave #FiosDoMedo',
    category: 'conclave',
    timestamp: Date.now() - 1000 * 60 * 25, // 25 min ago
    likes: 142,
    liked: false,
    rewuits: 58,
    rewuited: false,
    comments: [
      {
        id: 'c1',
        authorId: 'sussurros_noturnos',
        text: 'Eles estão mentindo. Ouvimos gritos de dentro do casarão desde as 22h!',
        timestamp: Date.now() - 1000 * 60 * 18
      }
    ],
    media: ''
  },
  {
    id: 'wuit_2',
    authorId: 'gazeta_wuitalur',
    text: 'URGENTE: Blecaute inexplicável atinge 4 bairros centrais simultaneamente. Testemunhas afirmam ter visto figuras sem rosto nos corredores do metrô. Autoridades pedem para a população trancar portas e janelas. #BlackoutNoCentro #GazetaNews',
    category: 'alerta',
    timestamp: Date.now() - 1000 * 60 * 52,
    likes: 389,
    liked: false,
    rewuits: 210,
    rewuited: false,
    comments: [],
    media: ''
  },
  {
    id: 'wuit_3',
    authorId: 'eric_blade',
    text: 'Encontrei um símbolo talhado na madeira do quarto 204. A tinta ainda estava fresca... mas o prédio está abandonado há duas décadas. Não é um crime comum. #Investigacao #EricBlade',
    category: 'noticia',
    timestamp: Date.now() - 1000 * 60 * 120,
    likes: 95,
    liked: false,
    rewuits: 34,
    rewuited: false,
    comments: [
      {
        id: 'c2',
        authorId: 'helena_rossi',
        text: 'Eric, passe no laboratório assim que puder. Os exames toxicológicos da vítima chegaram e não fazem sentido.',
        timestamp: Date.now() - 1000 * 60 * 85
      }
    ],
    media: ''
  }
];

class WuitterApp {
  constructor() {
    this.personas = [];
    this.posts = [];
    this.activePersonaId = 'eric_blade';
    this.activeTab = 'para-voce';
    this.searchQuery = '';
    this.followingIds = ['gazeta_wuitalur', 'conclave_oficial'];
    this.pendingImageBase64 = '';
    this.pendingCategory = 'none';

    this.init();
  }

  init() {
    this.loadState();
    this.bindEvents();
    this.render();
  }

  loadState() {
    // Load Personas
    const savedPersonas = localStorage.getItem(WUITTER_STORAGE_KEY_PERSONAS);
    if (savedPersonas) {
      try {
        this.personas = JSON.parse(savedPersonas);
      } catch (e) {
        this.personas = DEFAULT_PERSONAS;
      }
    } else {
      this.personas = DEFAULT_PERSONAS;
      this.savePersonas();
    }

    // Load Active Persona
    const savedActive = localStorage.getItem(WUITTER_STORAGE_KEY_ACTIVE);
    if (savedActive && this.personas.some(p => p.id === savedActive)) {
      this.activePersonaId = savedActive;
    } else {
      this.activePersonaId = this.personas[0].id;
    }

    // Load Following
    const savedFollows = localStorage.getItem(WUITTER_STORAGE_KEY_FOLLOWS);
    if (savedFollows) {
      try {
        this.followingIds = JSON.parse(savedFollows);
      } catch (e) {
        this.followingIds = ['gazeta_wuitalur', 'conclave_oficial'];
      }
    }

    // Load Posts
    const savedPosts = localStorage.getItem(WUITTER_STORAGE_KEY_POSTS);
    if (savedPosts) {
      try {
        this.posts = JSON.parse(savedPosts);
      } catch (e) {
        this.posts = DEFAULT_POSTS;
      }
    } else {
      this.posts = DEFAULT_POSTS;
      this.savePosts();
    }
  }

  savePosts() {
    localStorage.setItem(WUITTER_STORAGE_KEY_POSTS, JSON.stringify(this.posts));
  }

  savePersonas() {
    localStorage.setItem(WUITTER_STORAGE_KEY_PERSONAS, JSON.stringify(this.personas));
  }

  saveActivePersona() {
    localStorage.setItem(WUITTER_STORAGE_KEY_ACTIVE, this.activePersonaId);
  }

  saveFollows() {
    localStorage.setItem(WUITTER_STORAGE_KEY_FOLLOWS, JSON.stringify(this.followingIds));
  }

  getActivePersona() {
    return this.personas.find(p => p.id === this.activePersonaId) || this.personas[0];
  }

  getPersonaById(id) {
    return this.personas.find(p => p.id === id) || {
      id: id,
      name: 'Desconhecido',
      handle: '@desconhecido',
      avatar: '?',
      avatarBg: '#374151',
      badge: 'none'
    };
  }

  bindEvents() {
    // Tabs
    document.querySelectorAll('.w-feed-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('.w-feed-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeTab = tab.dataset.tab;
        this.renderFeed();
      });
    });

    // Compose textarea
    const textarea = document.getElementById('w-compose-input');
    const charCounter = document.getElementById('w-char-counter');
    const postBtn = document.getElementById('w-btn-post');

    if (textarea) {
      textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        if (charCounter) charCounter.textContent = `${len}/280`;
        if (postBtn) postBtn.disabled = len === 0 && !this.pendingImageBase64;
      });
    }

    // Post Button
    if (postBtn) {
      postBtn.addEventListener('click', () => {
        this.createPost();
      });
    }

    // Image upload
    const imgInput = document.getElementById('w-compose-image-input');
    if (imgInput) {
      imgInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (re) => {
            this.pendingImageBase64 = re.target.result;
            this.showImagePreview(this.pendingImageBase64);
            if (postBtn) postBtn.disabled = false;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Image URL button
    const imgUrlBtn = document.getElementById('w-tool-img-url');
    if (imgUrlBtn) {
      imgUrlBtn.addEventListener('click', () => {
        const url = prompt('Insira a URL direta da imagem:');
        if (url && url.trim()) {
          this.pendingImageBase64 = url.trim();
          this.showImagePreview(this.pendingImageBase64);
          if (postBtn) postBtn.disabled = false;
        }
      });
    }

    // Remove Preview
    const removePreviewBtn = document.getElementById('w-remove-preview-btn');
    if (removePreviewBtn) {
      removePreviewBtn.addEventListener('click', () => {
        this.pendingImageBase64 = '';
        const preview = document.getElementById('w-compose-preview');
        if (preview) preview.style.display = 'none';
        if (textarea && postBtn) {
          postBtn.disabled = textarea.value.trim().length === 0;
        }
      });
    }

    // Tag button
    const tagBtn = document.getElementById('w-tool-tag');
    if (tagBtn) {
      tagBtn.addEventListener('click', () => {
        const options = ['none', 'alerta', 'noticia', 'conclave'];
        const currentIdx = options.indexOf(this.pendingCategory);
        const nextIdx = (currentIdx + 1) % options.length;
        this.pendingCategory = options[nextIdx];
        
        tagBtn.style.color = this.pendingCategory === 'alerta' ? 'var(--w-accent-red)' :
                             this.pendingCategory === 'noticia' ? 'var(--w-primary)' :
                             this.pendingCategory === 'conclave' ? 'var(--w-accent-gold)' : 'var(--w-text-muted)';
      });
    }

    // Persona Switcher Click
    const personaSwitchBtn = document.getElementById('w-persona-switch-btn');
    if (personaSwitchBtn) {
      personaSwitchBtn.addEventListener('click', () => {
        this.openPersonaModal();
      });
    }

    // Search Input
    const searchInput = document.getElementById('w-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderFeed();
      });
    }

    // GM Panel Buttons
    const btnNewPersona = document.getElementById('w-gm-new-persona');
    if (btnNewPersona) {
      btnNewPersona.addEventListener('click', () => {
        this.openNewPersonaModal();
      });
    }

    const btnExportJson = document.getElementById('w-gm-export-json');
    if (btnExportJson) {
      btnExportJson.addEventListener('click', () => {
        this.exportFeedJson();
      });
    }

    const btnImportJson = document.getElementById('w-gm-import-json');
    if (btnImportJson) {
      btnImportJson.addEventListener('click', () => {
        this.importFeedJson();
      });
    }

    const btnResetDefault = document.getElementById('w-gm-reset-feed');
    if (btnResetDefault) {
      btnResetDefault.addEventListener('click', () => {
        if (confirm('Deseja restaurar os posts padrão do Wuitter? Seus posts personalizados serão mantidos.')) {
          this.posts = DEFAULT_POSTS;
          this.savePosts();
          this.renderFeed();
        }
      });
    }
  }

  showImagePreview(src) {
    const preview = document.getElementById('w-compose-preview');
    const previewImg = document.getElementById('w-compose-preview-img');
    if (preview && previewImg) {
      previewImg.src = src;
      preview.style.display = 'block';
    }
  }

  createPost() {
    const textarea = document.getElementById('w-compose-input');
    const text = textarea ? textarea.value.trim() : '';

    if (!text && !this.pendingImageBase64) return;

    const newPost = {
      id: 'wuit_' + Date.now(),
      authorId: this.activePersonaId,
      text: text,
      category: this.pendingCategory !== 'none' ? this.pendingCategory : '',
      timestamp: Date.now(),
      likes: 0,
      liked: false,
      rewuits: 0,
      rewuited: false,
      comments: [],
      media: this.pendingImageBase64 || ''
    };

    this.posts.unshift(newPost);
    this.savePosts();

    // Reset Compose
    if (textarea) textarea.value = '';
    this.pendingImageBase64 = '';
    this.pendingCategory = 'none';
    const preview = document.getElementById('w-compose-preview');
    if (preview) preview.style.display = 'none';
    const charCounter = document.getElementById('w-char-counter');
    if (charCounter) charCounter.textContent = '0/280';
    const postBtn = document.getElementById('w-btn-post');
    if (postBtn) postBtn.disabled = true;

    this.renderFeed();
  }

  render() {
    this.renderActivePersona();
    this.renderFeed();
    this.renderTrends();
    this.renderSuggestions();
  }

  renderActivePersona() {
    const active = this.getActivePersona();
    
    // Sidebar profile
    const avatarEl = document.getElementById('w-active-avatar');
    const nameEl = document.getElementById('w-active-name');
    const handleEl = document.getElementById('w-active-handle');
    const badgeEl = document.getElementById('w-active-badge');

    if (avatarEl) {
      avatarEl.textContent = active.avatar;
      avatarEl.style.backgroundColor = active.avatarBg;
    }
    if (nameEl) nameEl.textContent = active.name;
    if (handleEl) handleEl.textContent = active.handle;
    if (badgeEl) {
      badgeEl.innerHTML = active.badge === 'blue' ? SVG_ICONS.verifiedBlue :
                          active.badge === 'gold' ? SVG_ICONS.verifiedGold :
                          active.badge === 'red' ? SVG_ICONS.verifiedRed : '';
    }

    // Compose avatar
    const composeAvatar = document.getElementById('w-compose-avatar');
    if (composeAvatar) {
      composeAvatar.textContent = active.avatar;
      composeAvatar.style.backgroundColor = active.avatarBg;
    }
  }

  formatTime(timestamp) {
    const diff = Math.floor((Date.now() - timestamp) / 1000); // seconds
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }

  formatText(text) {
    // Escape HTML
    const escaped = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Format #hashtags and @mentions
    return escaped
      .replace(/#(\w+)/g, '<a href="javascript:void(0)" class="w-tag" onclick="window.wuitter.filterByTag('$1')">#$1</a>')
      .replace(/@(\w+)/g, '<a href="javascript:void(0)" class="w-mention" onclick="window.wuitter.filterByMention('$1')">@$1</a>');
  }

  filterByTag(tag) {
    const searchInput = document.getElementById('w-search-input');
    if (searchInput) searchInput.value = `#${tag}`;
    this.searchQuery = `#${tag}`.toLowerCase();
    this.renderFeed();
  }

  filterByMention(mention) {
    const searchInput = document.getElementById('w-search-input');
    if (searchInput) searchInput.value = `@${mention}`;
    this.searchQuery = `@${mention}`.toLowerCase();
    this.renderFeed();
  }

  renderFeed() {
    const feedContainer = document.getElementById('w-feed-list');
    if (!feedContainer) return;

    let filtered = [...this.posts];

    // Filter by Tab
    if (this.activeTab === 'seguindo') {
      filtered = filtered.filter(p => this.followingIds.includes(p.authorId) || p.authorId === this.activePersonaId);
    } else if (this.activeTab === 'noticias') {
      filtered = filtered.filter(p => p.category === 'alerta' || p.category === 'noticia' || p.category === 'conclave');
    }

    // Filter by Search Query
    if (this.searchQuery) {
      filtered = filtered.filter(p => {
        const author = this.getPersonaById(p.authorId);
        return p.text.toLowerCase().includes(this.searchQuery) ||
               author.name.toLowerCase().includes(this.searchQuery) ||
               author.handle.toLowerCase().includes(this.searchQuery) ||
               (p.category && p.category.toLowerCase().includes(this.searchQuery));
      });
    }

    if (filtered.length === 0) {
      feedContainer.innerHTML = `
        <div style="padding: 40px 20px; text-align: center; color: var(--w-text-muted);">
          <p style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 6px;">Nenhum Wuit encontrado</p>
          <p style="font-size: 0.9rem;">Tente buscar por outro termo ou poste um novo Wuit no feed.</p>
        </div>
      `;
      return;
    }

    feedContainer.innerHTML = filtered.map(post => this.renderPostCard(post)).join('');
  }

  renderPostCard(post) {
    const author = this.getPersonaById(post.authorId);
    const badgeSvg = author.badge === 'blue' ? SVG_ICONS.verifiedBlue :
                     author.badge === 'gold' ? SVG_ICONS.verifiedGold :
                     author.badge === 'red' ? SVG_ICONS.verifiedRed : '';

    const categoryHtml = post.category ? `
      <div class="w-category-tag ${post.category}">
        ${post.category === 'alerta' ? 'Alerta Urgente' : post.category === 'conclave' ? 'Registro Conclave' : 'Imprensa'}
      </div>
    ` : '';

    const mediaHtml = post.media ? `
      <div class="w-wuit-media" onclick="window.wuitter.openLightbox('${post.media}')">
        <img src="${post.media}" alt="Anexo do Wuit" loading="lazy">
      </div>
    ` : '';

    const commentsCount = post.comments ? post.comments.length : 0;
    const canDelete = post.authorId === this.activePersonaId;

    return `
      <article class="w-wuit-card" id="post_${post.id}">
        <div class="w-avatar" style="background-color: ${author.avatarBg};" title="${author.name}">
          ${author.avatar}
        </div>
        <div class="w-wuit-content-area">
          <div class="w-wuit-meta">
            <div class="w-wuit-author-info">
              <span class="w-wuit-name" onclick="window.wuitter.filterByMention('${author.handle.replace('@', '')}')">${author.name}</span>
              ${badgeSvg}
              <span class="w-wuit-handle">${author.handle}</span>
              <span class="w-wuit-dot">&bull;</span>
              <span class="w-wuit-time">${this.formatTime(post.timestamp)}</span>
            </div>
            ${canDelete ? `
              <button class="w-delete-btn" onclick="window.wuitter.deletePost('${post.id}')" title="Excluir Wuit">
                ${SVG_ICONS.trash}
              </button>
            ` : ''}
          </div>

          ${categoryHtml}

          <div class="w-wuit-text">${this.formatText(post.text)}</div>

          ${mediaHtml}

          <div class="w-wuit-actions">
            <!-- Comentar -->
            <button class="w-action-btn reply" onclick="window.wuitter.openCommentsModal('${post.id}')" title="Responder">
              ${SVG_ICONS.comment}
              <span>${commentsCount > 0 ? commentsCount : ''}</span>
            </button>

            <!-- Re-wuitar -->
            <button class="w-action-btn rewuit ${post.rewuited ? 'active' : ''}" onclick="window.wuitter.toggleRewuit('${post.id}')" title="Re-wuitar">
              ${SVG_ICONS.rewuit}
              <span>${post.rewuits > 0 ? post.rewuits : ''}</span>
            </button>

            <!-- Curtir -->
            <button class="w-action-btn like ${post.liked ? 'active' : ''}" onclick="window.wuitter.toggleLike('${post.id}')" title="Curtir">
              ${SVG_ICONS.like}
              <span>${post.likes > 0 ? post.likes : ''}</span>
            </button>

            <!-- Exportar como Pista (Prop) -->
            <button class="w-action-btn share" onclick="window.wuitter.openPropModal('${post.id}')" title="Gerar Cartão de Pista (Prop RPG)">
              ${SVG_ICONS.share}
            </button>
          </div>
        </div>
      </article>
    `;
  }

  toggleLike(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    if (post.liked) {
      post.liked = false;
      post.likes = Math.max(0, post.likes - 1);
    } else {
      post.liked = true;
      post.likes += 1;
    }

    this.savePosts();
    this.renderFeed();
  }

  toggleRewuit(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    if (post.rewuited) {
      post.rewuited = false;
      post.rewuits = Math.max(0, post.rewuits - 1);
    } else {
      post.rewuited = true;
      post.rewuits += 1;
    }

    this.savePosts();
    this.renderFeed();
  }

  deletePost(postId) {
    if (confirm('Tem certeza que deseja excluir este Wuit?')) {
      this.posts = this.posts.filter(p => p.id !== postId);
      this.savePosts();
      this.renderFeed();
    }
  }

  renderTrends() {
    const trendsContainer = document.getElementById('w-trends-list');
    if (!trendsContainer) return;

    const trends = [
      { tag: 'BlackoutNoCentro', cat: 'Urgente em Wuitalur', count: '14,2 mil wuits' },
      { tag: 'FiosDoMedo', cat: 'Sobrenatural &bull; Em alta', count: '9,8 mil wuits' },
      { tag: 'PesadeloNaMansao', cat: 'Mistério &bull; Casos Arquivados', count: '6,4 mil wuits' },
      { tag: 'Conclave', cat: 'Instituição &bull; Notícias', count: '4,1 mil wuits' },
      { tag: 'EricBlade', cat: 'Detetives Particulares', count: '2,9 mil wuits' }
    ];

    trendsContainer.innerHTML = trends.map(t => `
      <div class="w-trend-item" onclick="window.wuitter.filterByTag('${t.tag}')">
        <span class="w-trend-cat">${t.cat}</span>
        <span class="w-trend-tag">#${t.tag}</span>
        <span class="w-trend-count">${t.count}</span>
      </div>
    `).join('');
  }

  renderSuggestions() {
    const container = document.getElementById('w-suggestions-list');
    if (!container) return;

    const suggestions = this.personas.filter(p => p.id !== this.activePersonaId).slice(0, 3);

    container.innerHTML = suggestions.map(p => {
      const isFollowing = this.followingIds.includes(p.id);
      return `
        <div class="w-follow-item">
          <div class="w-persona-info">
            <div class="w-avatar sm" style="background-color: ${p.avatarBg};">${p.avatar}</div>
            <div class="w-persona-names">
              <span class="w-persona-name">${p.name}</span>
              <span class="w-persona-handle">${p.handle}</span>
            </div>
          </div>
          <button class="w-btn-follow ${isFollowing ? 'active' : ''}" onclick="window.wuitter.toggleFollow('${p.id}')">
            ${isFollowing ? 'Seguindo' : 'Seguir'}
          </button>
        </div>
      `;
    }).join('');
  }

  toggleFollow(personaId) {
    if (this.followingIds.includes(personaId)) {
      this.followingIds = this.followingIds.filter(id => id !== personaId);
    } else {
      this.followingIds.push(personaId);
    }
    this.saveFollows();
    this.renderSuggestions();
    if (this.activeTab === 'seguindo') {
      this.renderFeed();
    }
  }

  // Persona Modal
  openPersonaModal() {
    const modal = document.getElementById('w-persona-modal');
    const list = document.getElementById('w-persona-modal-list');
    if (!modal || !list) return;

    list.innerHTML = this.personas.map(p => `
      <div class="w-follow-item" style="cursor: pointer; border-radius: var(--w-radius-md);" onclick="window.wuitter.selectPersona('${p.id}')">
        <div class="w-persona-info">
          <div class="w-avatar" style="background-color: ${p.avatarBg};">${p.avatar}</div>
          <div class="w-persona-names">
            <span class="w-persona-name">${p.name} ${p.id === this.activePersonaId ? '<span style="color: var(--w-primary); font-size: 0.75rem;">(Ativo)</span>' : ''}</span>
            <span class="w-persona-handle">${p.handle}</span>
          </div>
        </div>
        <button class="w-btn-post-sm" style="padding: 4px 12px; font-size: 0.8rem;">
          ${p.id === this.activePersonaId ? 'Selecionado' : 'Usar'}
        </button>
      </div>
    `).join('');

    modal.classList.add('active');
  }

  selectPersona(personaId) {
    this.activePersonaId = personaId;
    this.saveActivePersona();
    this.renderActivePersona();
    this.renderSuggestions();
    this.renderFeed();
    this.closeModals();
  }

  openNewPersonaModal() {
    const modal = document.getElementById('w-new-persona-modal');
    if (modal) modal.classList.add('active');
  }

  saveNewPersona() {
    const nameInput = document.getElementById('w-new-persona-name');
    const handleInput = document.getElementById('w-new-persona-handle');
    const avatarInput = document.getElementById('w-new-persona-avatar');
    const badgeSelect = document.getElementById('w-new-persona-badge');
    const colorInput = document.getElementById('w-new-persona-color');

    const name = nameInput ? nameInput.value.trim() : '';
    let handle = handleInput ? handleInput.value.trim() : '';
    const avatar = avatarInput ? avatarInput.value.trim().toUpperCase().slice(0, 2) : '??';
    const badge = badgeSelect ? badgeSelect.value : 'none';
    const color = colorInput ? colorInput.value : '#3b82f6';

    if (!name || !handle) {
      alert('Por favor, informe Nome e @Handle.');
      return;
    }

    if (!handle.startsWith('@')) handle = '@' + handle;

    const id = 'persona_' + Date.now();
    const newPersona = {
      id: id,
      name: name,
      handle: handle,
      avatar: avatar || name.slice(0, 2).toUpperCase(),
      avatarBg: color,
      badge: badge,
      isDefault: false
    };

    this.personas.push(newPersona);
    this.savePersonas();
    this.activePersonaId = id;
    this.saveActivePersona();

    this.renderActivePersona();
    this.renderSuggestions();
    this.renderFeed();
    this.closeModals();

    // Reset inputs
    if (nameInput) nameInput.value = '';
    if (handleInput) handleInput.value = '';
    if (avatarInput) avatarInput.value = '';
  }

  // Comments / Thread Modal
  openCommentsModal(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const modal = document.getElementById('w-comments-modal');
    const container = document.getElementById('w-comments-container');
    const targetPostPreview = document.getElementById('w-modal-post-target');
    const sendBtn = document.getElementById('w-btn-send-comment');

    if (!modal || !container || !targetPostPreview) return;

    // Render Original Post summary
    const author = this.getPersonaById(post.authorId);
    targetPostPreview.innerHTML = `
      <div style="display: flex; gap: 10px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--w-border);">
        <div class="w-avatar sm" style="background-color: ${author.avatarBg};">${author.avatar}</div>
        <div>
          <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">${author.name} <span style="color: var(--w-text-muted); font-weight: normal;">${author.handle}</span></div>
          <div style="font-size: 0.88rem; color: var(--w-text-main); margin-top: 4px;">${this.formatText(post.text)}</div>
        </div>
      </div>
    `;

    // Render Comments
    if (post.comments && post.comments.length > 0) {
      container.innerHTML = post.comments.map(c => {
        const cAuthor = this.getPersonaById(c.authorId);
        return `
          <div class="w-comment-item">
            <div class="w-avatar sm" style="background-color: ${cAuthor.avatarBg};">${cAuthor.avatar}</div>
            <div style="flex: 1;">
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <span style="font-weight: 700; font-size: 0.85rem; color: #fff;">${cAuthor.name}</span>
                <span style="font-size: 0.75rem; color: var(--w-text-muted);">${this.formatTime(c.timestamp)}</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--w-text-main); margin-top: 2px;">${this.formatText(c.text)}</p>
            </div>
          </div>
        `;
      }).join('');
    } else {
      container.innerHTML = `<p style="color: var(--w-text-muted); font-size: 0.85rem; text-align: center; padding: 12px 0;">Nenhuma resposta ainda. Seja o primeiro a responder!</p>`;
    }

    if (sendBtn) {
      sendBtn.onclick = () => {
        const commentInput = document.getElementById('w-comment-input');
        const cText = commentInput ? commentInput.value.trim() : '';
        if (!cText) return;

        if (!post.comments) post.comments = [];
        post.comments.push({
          id: 'c_' + Date.now(),
          authorId: this.activePersonaId,
          text: cText,
          timestamp: Date.now()
        });

        this.savePosts();
        if (commentInput) commentInput.value = '';
        this.openCommentsModal(postId);
        this.renderFeed();
      };
    }

    modal.classList.add('active');
  }

  // Prop Snapshot Modal
  openPropModal(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const modal = document.getElementById('w-prop-modal');
    const container = document.getElementById('w-prop-render-area');
    if (!modal || !container) return;

    const author = this.getPersonaById(post.authorId);
    const badgeSvg = author.badge === 'blue' ? SVG_ICONS.verifiedBlue :
                     author.badge === 'gold' ? SVG_ICONS.verifiedGold :
                     author.badge === 'red' ? SVG_ICONS.verifiedRed : '';

    container.innerHTML = `
      <div class="w-prop-card" style="max-width: 520px; margin: 0 auto;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--w-border); padding-bottom: 10px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--w-primary)" stroke-width="2.5"><path d="M4 4l7.5 7.5L4 19M20 4l-7.5 7.5L20 19"/></svg>
            <span style="font-weight: 900; font-size: 0.95rem; letter-spacing: 0.05em; color: #fff;">WUITTER &bull; REGISTRO DE REDE</span>
          </div>
          <span style="font-size: 0.75rem; color: var(--w-text-muted); font-family: var(--w-font-mono);">EVIDÊNCIA #${post.id.slice(-6)}</span>
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 12px;">
          <div class="w-avatar" style="background-color: ${author.avatarBg};">${author.avatar}</div>
          <div>
            <div style="font-weight: 700; color: #fff; font-size: 0.95rem; display: flex; align-items: center; gap: 4px;">
              ${author.name} ${badgeSvg}
            </div>
            <div style="color: var(--w-text-muted); font-size: 0.8rem;">${author.handle}</div>
          </div>
        </div>

        <div style="font-size: 1.05rem; line-height: 1.5; color: #fff; margin-bottom: 14px; white-space: pre-wrap;">
          ${this.formatText(post.text)}
        </div>

        ${post.media ? `<div style="border-radius: 8px; overflow: hidden; margin-bottom: 12px; border: 1px solid var(--w-border);"><img src="${post.media}" style="width: 100%; display: block;"></div>` : ''}

        <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--w-border); padding-top: 10px; font-size: 0.8rem; color: var(--w-text-muted); font-family: var(--w-font-mono);">
          <span>${new Date(post.timestamp).toLocaleString('pt-BR')}</span>
          <span>${post.likes} Curtidas &bull; ${post.rewuits} Re-wuits</span>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  // Lightbox
  openLightbox(src) {
    const modal = document.getElementById('w-lightbox-modal');
    const img = document.getElementById('w-lightbox-img');
    if (modal && img) {
      img.src = src;
      modal.classList.add('active');
    }
  }

  // JSON Export / Import
  exportFeedJson() {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      personas: this.personas,
      posts: this.posts
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wuitter_backup_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  importFeedJson() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          try {
            const data = JSON.parse(re.target.result);
            if (data.posts && Array.isArray(data.posts)) {
              this.posts = data.posts;
              this.savePosts();
            }
            if (data.personas && Array.isArray(data.personas)) {
              this.personas = data.personas;
              this.savePersonas();
            }
            this.render();
            alert('Feed e Personas importados com sucesso!');
          } catch (err) {
            alert('Arquivo JSON inválido.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }

  closeModals() {
    document.querySelectorAll('.w-modal-overlay').forEach(m => m.classList.remove('active'));
  }
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  window.wuitter = new WuitterApp();
});
