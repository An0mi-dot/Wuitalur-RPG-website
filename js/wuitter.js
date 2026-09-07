/**
 * WUITTER — Rede Social In-Universe de Wuitalur RPG
 * Sincronização Persistente em Nuvem (Supabase DB + WebSocket + Polling), Zero Emojis
 */

const WUITTER_STORAGE_POSTS = 'wuitter_posts_v2';
const WUITTER_STORAGE_ACCOUNTS = 'wuitter_accounts_v2';
const WUITTER_STORAGE_TOKEN = 'mesa_token';

const SUPABASE_CONFIG = {
  url: 'https://qkupdpgcjusbedaoahwi.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdXBkcGdjanVzYmVkYW9haHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNzk1ODAsImV4cCI6MjEwMzc1NTU4MH0.UDc5nE7ZwUyWmwNZKpq7bGrty1N6Uh0bjq2PJtBkVrk'
};

// SVGs Dedicados (100% livres de emojis)
const SVG_ICONS = {
  wLogo: `<svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4l4.5 16L12 9l4.5 11L21 4"/></svg>`,
  verifiedBlue: `<svg class="w-badge-verified w-badge-blue" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>`,
  verifiedGold: `<svg class="w-badge-verified w-badge-gold" width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`,
  comment: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  rewuit: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></svg>`,
  like: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`,
  share: `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`,
  trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  image: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`,
  settings: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>`,
  crown: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
};

// Hashes oficiais do Mestre (compatíveis com Mesa Virtual)
const MASTER_HASHES = [
  'ffd77d81aa08ae3582779ba189e7dbbabd57da8ceb9aa8b6a64d2988dc552e76', // M9X7
  '74d06b763fd7ccdd4e86b81b59989c73b923a319c0adda2c243137079434d63d', // WUI-M9X7-MAST
  '011e063f8402ff1a9263d6cbf115896ce8844f14c8c1a03b1e70992be9fc84b4'  // WUI-MASTER-99
];

const MASTER_PLAIN_TOKENS = ['M9X7', 'WUI-M9X7-MAST', 'WUI-MASTER-99', 'MESTRE', 'MASTER', 'ADM', 'ADMIN', 'GM', 'M9X7-MAST'];

// Contas Padrão Vinculadas aos Tokens do Sistema
const DEFAULT_ACCOUNTS = [
  {
    id: 'mestre',
    slot: null,
    tokens: MASTER_PLAIN_TOKENS,
    hashes: MASTER_HASHES,
    name: 'Mestre',
    handle: '@mestre',
    bio: '',
    avatarLetter: 'M',
    avatarImage: '',
    avatarColor: '#ff1133',
    badge: 'gold',
    isMaster: true
  },
  {
    id: 'char_1',
    slot: 1,
    tokens: ['W4R9', 'WUI-W4R9-9K2M'],
    hashes: ['6d6b9e504b9a07f490b068e62a6d5a5b4beb6d5ab51c949a8ab8f1950c1261d2', '43c11d372feae45dd633a6a37286cf1a44f0c1278235b2ef7dc49d2d309c20b5'],
    name: 'Thulita',
    handle: '@thulita',
    bio: '',
    avatarLetter: 'T',
    avatarImage: '',
    avatarColor: '#10b981',
    badge: 'none',
    isMaster: false
  },
  {
    id: 'char_2',
    slot: 2,
    tokens: ['M7Q2', 'WUI-M7Q2-4L1B'],
    hashes: ['2619977a9e5e0522d65a338b053fe9d668b9ffd7a26fb694f4f89a332a2573ee', 'caa37dd424c75c8bcc49096685ff408930c6409922491c2b7465694b67934fd9'],
    name: 'Minerva',
    handle: '@minerva',
    bio: '',
    avatarLetter: 'M',
    avatarImage: '',
    avatarColor: '#8b5cf6',
    badge: 'none',
    isMaster: false
  },
  {
    id: 'char_3',
    slot: 3,
    tokens: ['B8T3', 'WUI-B8T3-7X8A'],
    hashes: ['63c816ce5724c99e47758d2bca36cd1c41b210bc3d295922731867746c891527', '9f741eaf72fb7c0417ecdf910cd18132a7cc6945a91655a38fc00dd3f20da436'],
    name: 'Eric',
    handle: '@eric',
    bio: '',
    avatarLetter: 'E',
    avatarImage: '',
    avatarColor: '#ef4444',
    badge: 'none',
    isMaster: false
  },
  {
    id: 'char_4',
    slot: 4,
    tokens: ['P3R4', 'WUI-P3R4-3D9V'],
    hashes: ['50aedd3f6c1ec1bbd96b4462cf11f9e51365b6d7657a092c857df19ecd7f22c6', '610c3adf93b9f4f25d5169ba2ece084e06a2d6491db68eb10ffaf49e0e4cb29c'],
    name: 'Pera',
    handle: '@pera',
    bio: '',
    avatarLetter: 'P',
    avatarImage: '',
    avatarColor: '#f59e0b',
    badge: 'none',
    isMaster: false
  },
  {
    id: 'char_5',
    slot: 5,
    tokens: ['K4R5', 'WUI-K4R5-8F2Q'],
    hashes: ['04d7fd5ceb247311a8f46bb5f5d353a927ac7fd25776cafbdd3ac9f70182a2b8', '1ed723041d29cae397ffc8fafc052009b36a001e601be6d3a5aba3ceea9ccaa9'],
    name: 'Willian',
    handle: '@willian',
    bio: '',
    avatarLetter: 'W',
    avatarImage: '',
    avatarColor: '#06b6d4',
    badge: 'none',
    isMaster: false
  },
  {
    id: 'char_6',
    slot: 6,
    tokens: ['J9D6', 'WUI-J9D6-5M7N'],
    hashes: ['f25cf5826fd56f85266d0aeb7d1e361d4035ceb0dac146166c1a8ad28ec03735', '409f7205e3d6398aaa57d0f6058e66d10a2ea22502faa4ba6c442af7353cff94'],
    name: 'John Doe',
    handle: '@johndoe',
    bio: '',
    avatarLetter: 'J',
    avatarImage: '',
    avatarColor: '#3b82f6',
    badge: 'none',
    isMaster: false
  },
  {
    id: 'char_7',
    slot: 7,
    tokens: ['O7D7', 'WUI-O7D7-2H4Z'],
    hashes: ['ba486a269e0fb9deac1c37f61ccb38be5cae83fd47ac6743adeddc8772681530', 'b094e8349e61a7092f6e0b54356560900cd295e9b6f29e4690e73a7899fc368b'],
    name: 'Odara',
    handle: '@odara',
    bio: '',
    avatarLetter: 'O',
    avatarImage: '',
    avatarColor: '#ec4899',
    badge: 'none',
    isMaster: false
  },
  {
    id: 'char_8',
    slot: 8,
    tokens: ['C8B8', 'WUI-C8B8-6P1K'],
    hashes: ['7d704a54101b1028e1dc54f3eb0fe527a6c358746a25008236e2b3940fb7b97c', '0a218ab04615fd7a9e9a69da55aabde2faadf19b62e4ba78902b34a83331fd23'],
    name: 'Canneth',
    handle: '@canneth',
    bio: '',
    avatarLetter: 'C',
    avatarImage: '',
    avatarColor: '#14b8a6',
    badge: 'none',
    isMaster: false
  }
];

class WuitterSystem {
  constructor() {
    this.accounts = [];
    this.posts = [];
    this.myToken = localStorage.getItem(WUITTER_STORAGE_TOKEN) || localStorage.getItem('wuitter_token') || null;
    this.authenticatedAccount = null;
    this.selectedPostingAccountId = null;
    this.activeTab = 'para-voce';
    this.searchQuery = '';
    this.pendingImageBase64 = '';

    // Supabase Cloud & Realtime
    this.supabase = null;
    this.realtimeChannel = null;
    this.localBroadcast = null;
    this.isSyncing = false;
    this.lastCloudSyncTime = 0;

    this.init();
  }

  async init() {
    this.loadLocalCache();
    await this.authenticateWithSavedToken();
    this.initSupabaseClient();
    this.bindEvents();
    this.render();

    // Busca imediata do banco de dados na nuvem
    await this.fetchCloudFeed();

    // Inicia ouvintes de tempo real e polling contínuo
    this.initRealtimeSubscriptions();
    this.startBackgroundSync();
  }

  initSupabaseClient() {
    try {
      if (window.supabase && SUPABASE_CONFIG.url && SUPABASE_CONFIG.key) {
        this.supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
      }
    } catch(err) {
      console.warn('Erro ao inicializar Supabase client:', err);
    }
  }

  // ---- PERSISTÊNCIA NA NUVEM (SUPABASE) ----
  async fetchCloudFeed(silent = false) {
    if (!this.supabase) return;

    try {
      const { data, error } = await this.supabase
        .from('personagens')
        .select('atributos')
        .eq('id', 3)
        .single();

      if (error) {
        if (!silent) console.warn('Erro ao carregar Wuitter do Supabase:', error);
        return;
      }

      if (data && data.atributos) {
        const rawAtributos = typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos;
        const wData = rawAtributos._wuitter;

        if (wData) {
          let hasChanges = false;

          // Atualiza posts da nuvem
          if (Array.isArray(wData.posts)) {
            const currentJson = JSON.stringify(this.posts);
            const remoteJson = JSON.stringify(wData.posts);
            if (currentJson !== remoteJson) {
              this.posts = wData.posts;
              this.savePostsLocal();
              hasChanges = true;
            }
          }

          // Atualiza contas customizadas da nuvem
          if (Array.isArray(wData.accounts) && wData.accounts.length > 0) {
            wData.accounts.forEach(ra => {
              const idx = this.accounts.findIndex(a => a.id === ra.id);
              if (idx !== -1) {
                this.accounts[idx] = ra;
              } else {
                this.accounts.push(ra);
              }
            });
            this.saveAccountsLocal();
            hasChanges = true;
          }

          if (hasChanges) {
            this.render();
          }
        }
      }
    } catch(err) {
      if (!silent) console.warn('Exceção ao buscar feed da nuvem:', err);
    }
  }

  async syncToCloud() {
    if (!this.supabase || this.isSyncing) return;
    this.isSyncing = true;

    try {
      // 1. Busca os atributos atuais para não sobrescrever dados da mesa
      const { data: currentRecord } = await this.supabase
        .from('personagens')
        .select('atributos')
        .eq('id', 3)
        .single();

      let atributosObj = {};
      if (currentRecord && currentRecord.atributos) {
        atributosObj = typeof currentRecord.atributos === 'string' ? JSON.parse(currentRecord.atributos) : currentRecord.atributos;
      }

      // Adiciona / atualiza o namespace _wuitter com posts e contas
      atributosObj._wuitter = {
        posts: this.posts.slice(0, 150), // mantem até 150 posts recentes
        accounts: this.accounts.filter(a => !a.slot), // contas customizadas
        updatedAt: Date.now()
      };

      // 2. Grava no Supabase
      await this.supabase
        .from('personagens')
        .update({
          atributos: atributosObj,
          updated_at: new Date().toISOString()
        })
        .eq('id', 3);

      this.lastCloudSyncTime = Date.now();
    } catch(err) {
      console.warn('Erro ao sincronizar Wuitter com a nuvem:', err);
    } finally {
      this.isSyncing = false;
    }
  }

  // ---- SINCRONIZAÇÃO EM TEMPO REAL (WEBSOCKET + POLLING) ----
  initRealtimeSubscriptions() {
    // 1. Canal Local de Navegador (entre abas)
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        this.localBroadcast = new BroadcastChannel('wuitter_local_sync_v3');
        this.localBroadcast.onmessage = (e) => {
          if (e.data) {
            this.handleIncomingSync(e.data);
          }
        };
      }
    } catch(err) {}

    // Storage local cross-tab
    window.addEventListener('storage', (e) => {
      if (e.key === WUITTER_STORAGE_POSTS && e.newValue) {
        try {
          this.posts = JSON.parse(e.newValue);
          this.renderFeed();
        } catch(err) {}
      }
    });

    // 2. Supabase Realtime (Postgres Changes + Broadcast WebSocket)
    if (this.supabase) {
      this.realtimeChannel = this.supabase
        .channel('wuitter_realtime_channel')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'personagens' }, (payload) => {
          // Atualização recebida do banco de dados na nuvem
          this.fetchCloudFeed(true);
        })
        .on('broadcast', { event: 'wuitter_event' }, (msg) => {
          if (msg && msg.payload) {
            this.handleIncomingSync(msg.payload);
          }
        })
        .subscribe();
    }
  }

  startBackgroundSync() {
    // Polling inteligente a cada 4 segundos como garantia de tempo real
    setInterval(() => {
      this.fetchCloudFeed(true);
    }, 4000);
  }

  broadcastSync(action, payload) {
    const message = {
      action: action,
      payload: payload,
      timestamp: Date.now(),
      senderToken: this.myToken
    };

    if (this.localBroadcast) {
      try { this.localBroadcast.postMessage(message); } catch(e) {}
    }

    if (this.realtimeChannel) {
      try {
        this.realtimeChannel.send({
          type: 'broadcast',
          event: 'wuitter_event',
          payload: message
        });
      } catch(e) {}
    }
  }

  handleIncomingSync(data) {
    if (!data || !data.action) return;

    switch(data.action) {
      case 'NEW_POST': {
        const post = data.payload.post;
        if (post && !this.posts.some(p => p.id === post.id)) {
          this.posts.unshift(post);
          this.savePostsLocal();
          this.renderFeed(post.id);
        }
        break;
      }
      case 'DELETE_POST': {
        const postId = data.payload.postId;
        if (postId) {
          this.posts = this.posts.filter(p => p.id !== postId);
          this.savePostsLocal();
          this.renderFeed();
        }
        break;
      }
      case 'TOGGLE_LIKE': {
        const { postId, likedBy, likes } = data.payload;
        const post = this.posts.find(p => p.id === postId);
        if (post) {
          post.likedBy = likedBy;
          post.likes = likes;
          this.savePostsLocal();
          this.updatePostStatsInDOM(postId);
        }
        break;
      }
      case 'TOGGLE_REWUIT': {
        const { postId, rewuitedBy, rewuits } = data.payload;
        const post = this.posts.find(p => p.id === postId);
        if (post) {
          post.rewuitedBy = rewuitedBy;
          post.rewuits = rewuits;
          this.savePostsLocal();
          this.updatePostStatsInDOM(postId);
        }
        break;
      }
      case 'ADD_COMMENT': {
        const { postId, comment } = data.payload;
        const post = this.posts.find(p => p.id === postId);
        if (post) {
          if (!post.comments) post.comments = [];
          if (!post.comments.some(c => c.id === comment.id)) {
            post.comments.push(comment);
            this.savePostsLocal();
            this.updatePostStatsInDOM(postId);
            const modal = document.getElementById('w-comments-modal');
            if (modal && modal.classList.contains('active')) {
              this.openCommentsModal(postId);
            }
          }
        }
        break;
      }
      case 'UPDATE_ACCOUNT': {
        const acc = data.payload.account;
        if (acc) {
          const index = this.accounts.findIndex(a => a.id === acc.id);
          if (index !== -1) {
            this.accounts[index] = acc;
          } else {
            this.accounts.push(acc);
          }
          this.saveAccountsLocal();
          this.render();
        }
        break;
      }
    }
  }

  updatePostStatsInDOM(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;
    const card = document.getElementById(`post_${postId}`);
    if (!card) return;

    const myId = this.authenticatedAccount ? this.authenticatedAccount.id : null;
    const isLiked = myId && post.likedBy && post.likedBy.includes(myId);
    const isRewuited = myId && post.rewuitedBy && post.rewuitedBy.includes(myId);
    const commentsCount = post.comments ? post.comments.length : 0;

    const likeBtn = card.querySelector('.w-action-btn.like');
    if (likeBtn) {
      likeBtn.classList.toggle('active', !!isLiked);
      const span = likeBtn.querySelector('span');
      if (span) span.textContent = post.likes > 0 ? post.likes : '';
    }

    const rewuitBtn = card.querySelector('.w-action-btn.rewuit');
    if (rewuitBtn) {
      rewuitBtn.classList.toggle('active', !!isRewuited);
      const span = rewuitBtn.querySelector('span');
      if (span) span.textContent = post.rewuits > 0 ? post.rewuits : '';
    }

    const replyBtn = card.querySelector('.w-action-btn.reply');
    if (replyBtn) {
      const span = replyBtn.querySelector('span');
      if (span) span.textContent = commentsCount > 0 ? commentsCount : '';
    }
  }

  // Hash SHA-256 helper
  async sha256(text) {
    if (!text) return '';
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text.trim().toUpperCase());
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch(e) {
      let hash = 0;
      const str = text.trim().toUpperCase();
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return 'fb_' + Math.abs(hash).toString(16);
    }
  }

  loadLocalCache() {
    const savedAcc = localStorage.getItem(WUITTER_STORAGE_ACCOUNTS);
    if (savedAcc) {
      try {
        this.accounts = JSON.parse(savedAcc);
        DEFAULT_ACCOUNTS.forEach(def => {
          const exists = this.accounts.find(a => a.id === def.id);
          if (!exists) {
            this.accounts.push(def);
          } else {
            exists.tokens = def.tokens;
            exists.hashes = def.hashes;
            exists.isMaster = def.isMaster;
            if (def.isMaster) {
              exists.name = 'Mestre';
              exists.handle = '@mestre';
              exists.badge = 'gold';
            }
            if (!exists.avatarLetter) exists.avatarLetter = (exists.name || 'P').charAt(0).toUpperCase();
          }
        });
      } catch (e) {
        this.accounts = [...DEFAULT_ACCOUNTS];
      }
    } else {
      this.accounts = [...DEFAULT_ACCOUNTS];
      this.saveAccountsLocal();
    }

    const savedPosts = localStorage.getItem(WUITTER_STORAGE_POSTS);
    if (savedPosts) {
      try {
        this.posts = JSON.parse(savedPosts);
      } catch (e) {
        this.posts = [];
      }
    } else {
      this.posts = [];
    }
  }

  saveAccountsLocal() {
    localStorage.setItem(WUITTER_STORAGE_ACCOUNTS, JSON.stringify(this.accounts));
  }

  savePostsLocal() {
    localStorage.setItem(WUITTER_STORAGE_POSTS, JSON.stringify(this.posts));
  }

  async authenticateWithSavedToken() {
    const token = this.myToken || localStorage.getItem(WUITTER_STORAGE_TOKEN) || localStorage.getItem('wuitter_token');
    if (token) {
      await this.loginWithToken(token, false);
    }
  }

  async loginWithToken(rawToken, showAlert = true) {
    if (!rawToken) return false;
    const token = rawToken.trim().toUpperCase();
    const tokenHash = await this.sha256(token);

    const isDirectMaster = MASTER_PLAIN_TOKENS.includes(token) || MASTER_HASHES.includes(tokenHash) || MASTER_HASHES.includes(token.toLowerCase());

    let matched = null;

    if (isDirectMaster) {
      matched = this.accounts.find(a => a.id === 'mestre' || a.isMaster === true);
      if (!matched) {
        matched = DEFAULT_ACCOUNTS[0];
        this.accounts.unshift(matched);
      }
    } else {
      matched = this.accounts.find(acc => {
        if (acc.tokens && acc.tokens.some(t => t.toUpperCase() === token)) return true;
        if (acc.hashes && (acc.hashes.includes(tokenHash) || acc.hashes.includes(token.toLowerCase()))) return true;
        return false;
      });
    }

    if (matched) {
      this.myToken = token;
      localStorage.setItem(WUITTER_STORAGE_TOKEN, token);
      localStorage.setItem('wuitter_token', token);
      this.authenticatedAccount = matched;
      this.selectedPostingAccountId = matched.id;

      if (showAlert) {
        if (matched.isMaster) {
          alert('Autenticado com sucesso como MESTRE! Painel do Mestre e ferramentas liberados.');
        } else {
          alert(`Autenticado com sucesso como ${matched.name}!`);
        }
      }
      this.render();
      return true;
    } else {
      if (showAlert) {
        alert('Token inválido. Verifique o código fornecido.');
      }
      return false;
    }
  }

  logout() {
    this.myToken = null;
    localStorage.removeItem(WUITTER_STORAGE_TOKEN);
    localStorage.removeItem('wuitter_token');
    this.authenticatedAccount = null;
    this.selectedPostingAccountId = null;
    this.render();
  }

  isMaster() {
    return this.authenticatedAccount && this.authenticatedAccount.isMaster === true;
  }

  getPostingAccount() {
    if (this.isMaster() && this.selectedPostingAccountId) {
      return this.accounts.find(a => a.id === this.selectedPostingAccountId) || this.authenticatedAccount;
    }
    return this.authenticatedAccount || {
      id: 'visitante',
      name: 'Visitante Não Autenticado',
      handle: '@visitante',
      avatarLetter: '?',
      avatarImage: '',
      avatarColor: '#374151',
      badge: 'none'
    };
  }

  getAccountById(id) {
    return this.accounts.find(a => a.id === id) || {
      id: id,
      name: 'Desconhecido',
      handle: '@desconhecido',
      avatarLetter: '?',
      avatarImage: '',
      avatarColor: '#374151',
      badge: 'none'
    };
  }

  bindEvents() {
    document.querySelectorAll('.w-feed-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.w-feed-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.activeTab = tab.dataset.tab;
        this.renderFeed();
      });
    });

    const textarea = document.getElementById('w-compose-input');
    const charCounter = document.getElementById('w-char-counter');
    const postBtn = document.getElementById('w-btn-post');

    if (textarea) {
      textarea.addEventListener('input', () => {
        const len = textarea.value.length;
        if (charCounter) charCounter.textContent = `${len}/280`;
        if (postBtn) {
          postBtn.disabled = (!this.authenticatedAccount) || (len === 0 && !this.pendingImageBase64);
        }
      });

      textarea.addEventListener('paste', (e) => {
        const items = (e.clipboardData || e.originalEvent.clipboardData).items;
        for (let index in items) {
          const item = items[index];
          if (item.kind === 'file') {
            const blob = item.getAsFile();
            if (blob.type.startsWith('image/')) {
              e.preventDefault();
              const reader = new FileReader();
              reader.onload = (event) => {
                this.pendingImageBase64 = event.target.result;
                this.showImagePreview(this.pendingImageBase64);
                if (postBtn && this.authenticatedAccount) postBtn.disabled = false;
              };
              reader.readAsDataURL(blob);
            } else {
              alert('Apenas fotos e imagens podem ser anexadas (vídeos não são permitidos).');
            }
          }
        }
      });
    }

    if (postBtn) {
      postBtn.addEventListener('click', () => {
        this.submitWuit();
      });
    }

    const imgInput = document.getElementById('w-compose-image-input');
    if (imgInput) {
      imgInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          if (!file.type.startsWith('image/')) {
            alert('Apenas arquivos de imagem e fotos são permitidos (vídeos não são suportados).');
            imgInput.value = '';
            return;
          }
          const reader = new FileReader();
          reader.onload = (re) => {
            this.pendingImageBase64 = re.target.result;
            this.showImagePreview(this.pendingImageBase64);
            if (postBtn && this.authenticatedAccount) postBtn.disabled = false;
          };
          reader.readAsDataURL(file);
        }
      });
    }

    const imgUrlBtn = document.getElementById('w-tool-img-url');
    if (imgUrlBtn) {
      imgUrlBtn.addEventListener('click', () => {
        const url = prompt('Insira o link direto da imagem/foto (URL):');
        if (url && url.trim()) {
          this.pendingImageBase64 = url.trim();
          this.showImagePreview(this.pendingImageBase64);
          if (postBtn && this.authenticatedAccount) postBtn.disabled = false;
        }
      });
    }

    const removePreviewBtn = document.getElementById('w-remove-preview-btn');
    if (removePreviewBtn) {
      removePreviewBtn.addEventListener('click', () => {
        this.pendingImageBase64 = '';
        if (imgInput) imgInput.value = '';
        const preview = document.getElementById('w-compose-preview');
        if (preview) preview.style.display = 'none';
        if (textarea && postBtn) {
          postBtn.disabled = textarea.value.trim().length === 0;
        }
      });
    }

    const searchInput = document.getElementById('w-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderFeed();
      });
    }

    const btnNewAccount = document.getElementById('w-gm-new-account');
    if (btnNewAccount) {
      btnNewAccount.addEventListener('click', () => this.openNewAccountModal());
    }

    const btnExportJson = document.getElementById('w-gm-export-json');
    if (btnExportJson) {
      btnExportJson.addEventListener('click', () => this.exportFeedJson());
    }

    const btnImportJson = document.getElementById('w-gm-import-json');
    if (btnImportJson) {
      btnImportJson.addEventListener('click', () => this.importFeedJson());
    }

    const masterAccountSelector = document.getElementById('w-master-account-select');
    if (masterAccountSelector) {
      masterAccountSelector.addEventListener('change', (e) => {
        this.selectedPostingAccountId = e.target.value;
        this.renderComposeHeader();
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

  async submitWuit() {
    if (!this.authenticatedAccount) {
      this.openTokenModal();
      return;
    }

    const textarea = document.getElementById('w-compose-input');
    const text = textarea ? textarea.value.trim() : '';

    if (!text && !this.pendingImageBase64) return;

    const postingAcc = this.getPostingAccount();

    const newPost = {
      id: 'wuit_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
      authorId: postingAcc.id,
      text: text,
      timestamp: Date.now(),
      likes: 0,
      likedBy: [],
      rewuits: 0,
      rewuitedBy: [],
      comments: [],
      media: this.pendingImageBase64 || ''
    };

    this.posts.unshift(newPost);
    this.savePostsLocal();

    // Reset Compose Box
    if (textarea) textarea.value = '';
    this.pendingImageBase64 = '';
    const imgInput = document.getElementById('w-compose-image-input');
    if (imgInput) imgInput.value = '';
    const preview = document.getElementById('w-compose-preview');
    if (preview) preview.style.display = 'none';
    const charCounter = document.getElementById('w-char-counter');
    if (charCounter) charCounter.textContent = '0/280';
    const postBtn = document.getElementById('w-btn-post');
    if (postBtn) postBtn.disabled = true;

    this.renderFeed(newPost.id);

    // Transmite instantaneamente para os outros usuários e grava no Supabase Cloud
    this.broadcastSync('NEW_POST', { post: newPost });
    await this.syncToCloud();
  }

  render() {
    this.renderSidebarAuth();
    this.renderComposeHeader();
    this.renderFeed();
    this.renderMasterPanel();
    this.renderTrends();
  }

  renderSidebarAuth() {
    const authContainer = document.getElementById('w-auth-section');
    const masterNavBtn = document.getElementById('w-nav-master-item');
    if (!authContainer) return;

    const isMaster = this.isMaster();

    if (masterNavBtn) {
      masterNavBtn.style.display = isMaster ? 'flex' : 'none';
    }

    if (!this.authenticatedAccount) {
      authContainer.innerHTML = `
        <div class="w-auth-box-unlogged">
          <p class="w-auth-unlogged-text">Conecte o token do seu personagem para wuitar.</p>
          <button class="w-btn-post-primary" style="padding: 9px 16px; width: 100%; font-size: 0.88rem;" onclick="window.wuitter.openTokenModal()">
            Autenticar Token
          </button>
        </div>
      `;
      return;
    }

    const acc = this.authenticatedAccount;

    authContainer.innerHTML = `
      <div class="w-persona-card-auth">
        <div class="w-persona-info">
          ${this.renderAvatarHtml(acc, 'normal')}
          <div class="w-persona-names">
            <span class="w-persona-name">
              ${acc.name}
              ${this.renderBadgeSvg(acc.badge)}
            </span>
            <span class="w-persona-handle">${acc.handle}</span>
          </div>
        </div>
      </div>
      
      ${isMaster ? `
        <button class="w-gm-btn w-gm-btn-highlight" onclick="window.wuitter.openMasterPanelModal()" style="width: 100%; margin-top: 8px; justify-content: center;">
          ${SVG_ICONS.crown}
          <span>Painel do Mestre</span>
        </button>
      ` : ''}

      <div style="display: flex; gap: 6px; margin-top: 8px;">
        <button class="w-gm-btn" style="flex: 1; padding: 6px 10px; font-size: 0.78rem; justify-content: center;" onclick="window.wuitter.openEditProfileModal(window.wuitter.authenticatedAccount)">
          ${SVG_ICONS.settings}
          <span>Editar Perfil</span>
        </button>
        <button class="w-gm-btn" style="color: var(--w-accent-red); padding: 6px 10px; font-size: 0.78rem;" onclick="window.wuitter.logout()" title="Sair da Conta">
          Sair
        </button>
      </div>
    `;
  }

  renderComposeHeader() {
    const avatarEl = document.getElementById('w-compose-avatar-wrap');
    const postingAcc = this.getPostingAccount();

    if (avatarEl) {
      avatarEl.innerHTML = this.renderAvatarHtml(postingAcc, 'normal');
    }

    const masterSelectWrap = document.getElementById('w-master-selector-wrap');
    if (masterSelectWrap) {
      if (this.isMaster()) {
        masterSelectWrap.style.display = 'block';
        const selectEl = document.getElementById('w-master-account-select');
        if (selectEl) {
          selectEl.innerHTML = this.accounts.map(a => `
            <option value="${a.id}" ${a.id === this.selectedPostingAccountId ? 'selected' : ''}>
              ${a.name} (${a.handle}) ${a.isMaster ? '[MESTRE]' : ''}
            </option>
          `).join('');
        }
      } else {
        masterSelectWrap.style.display = 'none';
      }
    }

    const postBtn = document.getElementById('w-btn-post');
    const textarea = document.getElementById('w-compose-input');
    if (postBtn && textarea) {
      if (!this.authenticatedAccount) {
        textarea.placeholder = 'Autentique seu token de personagem para poder wuitar...';
        textarea.disabled = true;
        postBtn.disabled = true;
      } else {
        textarea.placeholder = `O que está acontecendo, ${postingAcc.name}?`;
        textarea.disabled = false;
        postBtn.disabled = textarea.value.trim().length === 0 && !this.pendingImageBase64;
      }
    }
  }

  renderAvatarHtml(account, size = 'normal') {
    const sizeClass = size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : '';
    if (account.avatarImage) {
      return `<img src="${account.avatarImage}" class="w-avatar ${sizeClass}" alt="${account.name}">`;
    }
    const letter = (account.avatarLetter || account.name.charAt(0) || 'P').toUpperCase();
    const bg = account.avatarColor || '#1f2937';
    return `<div class="w-avatar ${sizeClass}" style="background-color: ${bg};">${letter}</div>`;
  }

  renderBadgeSvg(badgeType) {
    if (badgeType === 'blue') return SVG_ICONS.verifiedBlue;
    if (badgeType === 'gold') return SVG_ICONS.verifiedGold;
    return '';
  }

  formatTime(timestamp) {
    const diff = Math.floor((Date.now() - timestamp) / 1000);
    if (diff < 60) return `${diff}s`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
    return `${Math.floor(diff / 86400)}d`;
  }

  formatText(text) {
    const escaped = (text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    return escaped
      .replace(/#([a-zA-Z0-9_]+)/g, '<a href="javascript:void(0)" class="w-tag" onclick="window.wuitter.filterByTag(\'$1\')">#$1</a>')
      .replace(/@([a-zA-Z0-9_]+)/g, '<a href="javascript:void(0)" class="w-mention" onclick="window.wuitter.filterByMention(\'$1\')">@$1</a>');
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

  renderFeed(highlightPostId = null) {
    const feedContainer = document.getElementById('w-feed-list');
    if (!feedContainer) return;

    let filtered = [...this.posts];

    if (this.searchQuery) {
      filtered = filtered.filter(p => {
        const author = this.getAccountById(p.authorId);
        return p.text.toLowerCase().includes(this.searchQuery) ||
               author.name.toLowerCase().includes(this.searchQuery) ||
               author.handle.toLowerCase().includes(this.searchQuery);
      });
    }

    if (filtered.length === 0) {
      feedContainer.innerHTML = `
        <div style="padding: 50px 20px; text-align: center; color: var(--w-text-muted);">
          <p style="font-size: 1.1rem; font-weight: 700; color: #fff; margin-bottom: 6px;">Nenhum Wuit no momento</p>
          <p style="font-size: 0.9rem;">Autentique seu token de personagem e seja o primeiro a postar!</p>
        </div>
      `;
      return;
    }

    feedContainer.innerHTML = filtered.map(post => this.renderPostCard(post, post.id === highlightPostId)).join('');
  }

  renderPostCard(post, isNew = false) {
    const author = this.getAccountById(post.authorId);
    const badgeSvg = this.renderBadgeSvg(author.badge);

    const mediaHtml = post.media ? `
      <div class="w-wuit-media" onclick="window.wuitter.openLightbox('${post.media}')">
        <img src="${post.media}" alt="Foto do Wuit" loading="lazy">
      </div>
    ` : '';

    const commentsCount = post.comments ? post.comments.length : 0;
    const canDelete = this.isMaster() || (this.authenticatedAccount && this.authenticatedAccount.id === post.authorId);
    const isLiked = this.authenticatedAccount && post.likedBy && post.likedBy.includes(this.authenticatedAccount.id);
    const isRewuited = this.authenticatedAccount && post.rewuitedBy && post.rewuitedBy.includes(this.authenticatedAccount.id);

    return `
      <article class="w-wuit-card ${isNew ? 'new-incoming' : ''}" id="post_${post.id}">
        ${this.renderAvatarHtml(author, 'normal')}
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

          <div class="w-wuit-text">${this.formatText(post.text)}</div>

          ${mediaHtml}

          <div class="w-wuit-actions">
            <button class="w-action-btn reply" onclick="window.wuitter.openCommentsModal('${post.id}')" title="Responder">
              ${SVG_ICONS.comment}
              <span>${commentsCount > 0 ? commentsCount : ''}</span>
            </button>

            <button class="w-action-btn rewuit ${isRewuited ? 'active' : ''}" onclick="window.wuitter.toggleRewuit('${post.id}')" title="Re-wuitar">
              ${SVG_ICONS.rewuit}
              <span>${post.rewuits > 0 ? post.rewuits : ''}</span>
            </button>

            <button class="w-action-btn like ${isLiked ? 'active' : ''}" onclick="window.wuitter.toggleLike('${post.id}')" title="Curtir">
              ${SVG_ICONS.like}
              <span>${post.likes > 0 ? post.likes : ''}</span>
            </button>

            <button class="w-action-btn share" onclick="window.wuitter.openPropModal('${post.id}')" title="Gerar Cartão de Pista (Prop RPG)">
              ${SVG_ICONS.share}
            </button>
          </div>
        </div>
      </article>
    `;
  }

  async toggleLike(postId) {
    if (!this.authenticatedAccount) {
      this.openTokenModal();
      return;
    }
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    if (!post.likedBy) post.likedBy = [];
    const myId = this.authenticatedAccount.id;

    if (post.likedBy.includes(myId)) {
      post.likedBy = post.likedBy.filter(id => id !== myId);
      post.likes = Math.max(0, (post.likes || 1) - 1);
    } else {
      post.likedBy.push(myId);
      post.likes = (post.likes || 0) + 1;
    }

    this.savePostsLocal();
    this.updatePostStatsInDOM(postId);

    this.broadcastSync('TOGGLE_LIKE', { postId: postId, likedBy: post.likedBy, likes: post.likes });
    await this.syncToCloud();
  }

  async toggleRewuit(postId) {
    if (!this.authenticatedAccount) {
      this.openTokenModal();
      return;
    }
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    if (!post.rewuitedBy) post.rewuitedBy = [];
    const myId = this.authenticatedAccount.id;

    if (post.rewuitedBy.includes(myId)) {
      post.rewuitedBy = post.rewuitedBy.filter(id => id !== myId);
      post.rewuits = Math.max(0, (post.rewuits || 1) - 1);
    } else {
      post.rewuitedBy.push(myId);
      post.rewuits = (post.rewuits || 0) + 1;
    }

    this.savePostsLocal();
    this.updatePostStatsInDOM(postId);

    this.broadcastSync('TOGGLE_REWUIT', { postId: postId, rewuitedBy: post.rewuitedBy, rewuits: post.rewuits });
    await this.syncToCloud();
  }

  async deletePost(postId) {
    if (confirm('Tem certeza que deseja excluir este Wuit?')) {
      this.posts = this.posts.filter(p => p.id !== postId);
      this.savePostsLocal();
      this.renderFeed();

      this.broadcastSync('DELETE_POST', { postId: postId });
      await this.syncToCloud();
    }
  }

  renderTrends() {
    const container = document.getElementById('w-trends-list');
    if (!container) return;

    const trends = [
      { tag: 'FiosDoMedo', cat: 'Mistério &bull; Em alta', count: '12,4 mil wuits' },
      { tag: 'Pesadelo', cat: 'Sobrenatural', count: '8,1 mil wuits' },
      { tag: 'Conclave', cat: 'Instituição', count: '5,9 mil wuits' },
      { tag: 'Investigacao', cat: 'Casos sem Solução', count: '3,2 mil wuits' }
    ];

    container.innerHTML = trends.map(t => `
      <div class="w-trend-item" onclick="window.wuitter.filterByTag('${t.tag}')">
        <span class="w-trend-cat">${t.cat}</span>
        <span class="w-trend-tag">#${t.tag}</span>
        <span class="w-trend-count">${t.count}</span>
      </div>
    `).join('');
  }

  renderMasterPanel() {
    const panel = document.getElementById('w-gm-panel-container');
    if (!panel) return;

    if (!this.isMaster()) {
      panel.style.display = 'none';
      return;
    }

    panel.style.display = 'block';

    const renderAccountItem = (acc) => `
      <div class="w-follow-item" style="padding: 8px 12px; border-bottom: 1px solid var(--w-border-subtle); display: flex; align-items: center; justify-content: space-between;">
        <div class="w-persona-info">
          ${this.renderAvatarHtml(acc, 'sm')}
          <div class="w-persona-names">
            <span class="w-persona-name">${acc.name} ${this.renderBadgeSvg(acc.badge)}</span>
            <span class="w-persona-handle">${acc.handle} ${acc.isMaster ? '[Mestre]' : ''}</span>
          </div>
        </div>
        <button class="w-btn-follow" style="padding: 4px 10px; font-size: 0.75rem;" onclick="window.wuitter.openEditProfileModal(window.wuitter.getAccountById('${acc.id}'))">
          Editar
        </button>
      </div>
    `;

    const accountListEl = document.getElementById('w-gm-accounts-list');
    if (accountListEl) {
      accountListEl.innerHTML = this.accounts.map(renderAccountItem).join('');
    }

    const modalMasterAccounts = document.getElementById('w-modal-master-accounts');
    if (modalMasterAccounts) {
      modalMasterAccounts.innerHTML = this.accounts.map(renderAccountItem).join('');
    }
  }

  // Modais
  openMasterPanelModal() {
    if (!this.isMaster()) {
      this.openTokenModal();
      return;
    }
    this.renderMasterPanel();
    const modal = document.getElementById('w-master-modal');
    if (modal) modal.classList.add('active');
  }

  openTokenModal() {
    const modal = document.getElementById('w-token-modal');
    const input = document.getElementById('w-token-input');
    if (input) input.value = '';
    if (modal) modal.classList.add('active');
    setTimeout(() => { if (input) input.focus(); }, 100);
  }

  async submitTokenFromModal() {
    const input = document.getElementById('w-token-input');
    const token = input ? input.value.trim() : '';
    if (!token) return;

    const success = await this.loginWithToken(token, true);
    if (success) {
      this.closeModals();
    }
  }

  openEditProfileModal(account) {
    if (!account) return;
    const modal = document.getElementById('w-edit-profile-modal');
    if (!modal) return;

    document.getElementById('w-edit-target-id').value = account.id;
    document.getElementById('w-edit-name').value = account.name || '';
    document.getElementById('w-edit-handle').value = account.handle || '';
    document.getElementById('w-edit-bio').value = account.bio || '';
    document.getElementById('w-edit-avatar-letter').value = account.avatarLetter || account.name.charAt(0) || '';
    document.getElementById('w-edit-avatar-color').value = account.avatarColor || '#ff1133';
    document.getElementById('w-edit-avatar-img').value = account.avatarImage || '';

    const badgeGroup = document.getElementById('w-edit-badge-group');
    if (badgeGroup) {
      badgeGroup.style.display = this.isMaster() ? 'block' : 'none';
      document.getElementById('w-edit-badge-select').value = account.badge || 'none';
    }

    modal.classList.add('active');
  }

  async saveProfileChanges() {
    const targetId = document.getElementById('w-edit-target-id').value;
    const acc = this.accounts.find(a => a.id === targetId);
    if (!acc) return;

    const name = document.getElementById('w-edit-name').value.trim();
    let handle = document.getElementById('w-edit-handle').value.trim();
    const bio = document.getElementById('w-edit-bio').value.trim();
    const avatarLetter = document.getElementById('w-edit-avatar-letter').value.trim().toUpperCase().slice(0, 2);
    const avatarColor = document.getElementById('w-edit-avatar-color').value;
    const avatarImg = document.getElementById('w-edit-avatar-img').value.trim();

    if (!name || !handle) {
      alert('Nome e @Handle são obrigatórios.');
      return;
    }

    if (!handle.startsWith('@')) handle = '@' + handle;

    acc.name = name;
    acc.handle = handle;
    acc.bio = bio;
    acc.avatarLetter = avatarLetter || name.charAt(0).toUpperCase();
    acc.avatarColor = avatarColor;
    acc.avatarImage = avatarImg;

    if (this.isMaster()) {
      const badgeSelect = document.getElementById('w-edit-badge-select');
      if (badgeSelect) acc.badge = badgeSelect.value;
    }

    this.saveAccountsLocal();
    this.broadcastSync('UPDATE_ACCOUNT', { account: acc });
    await this.syncToCloud();

    this.closeModals();
    this.render();
    alert('Perfil atualizado e sincronizado com sucesso!');
  }

  openNewAccountModal() {
    if (!this.isMaster()) return;
    const modal = document.getElementById('w-new-account-modal');
    if (modal) modal.classList.add('active');
  }

  async saveNewAccount() {
    if (!this.isMaster()) return;

    const name = document.getElementById('w-new-acc-name').value.trim();
    let handle = document.getElementById('w-new-acc-handle').value.trim();
    const token = document.getElementById('w-new-acc-token').value.trim().toUpperCase();
    const badge = document.getElementById('w-new-acc-badge').value;
    const color = document.getElementById('w-new-acc-color').value;

    if (!name || !handle) {
      alert('Nome e @Handle são obrigatórios.');
      return;
    }

    if (!handle.startsWith('@')) handle = '@' + handle;

    const id = 'acc_' + Date.now();
    const newAcc = {
      id: id,
      slot: null,
      tokens: token ? [token] : [],
      hashes: [],
      name: name,
      handle: handle,
      bio: '',
      avatarLetter: name.charAt(0).toUpperCase(),
      avatarImage: '',
      avatarColor: color,
      badge: badge,
      isMaster: false
    };

    this.accounts.push(newAcc);
    this.saveAccountsLocal();
    this.broadcastSync('UPDATE_ACCOUNT', { account: newAcc });
    await this.syncToCloud();

    this.closeModals();
    this.render();
    alert('Nova conta cadastrada e sincronizada com sucesso!');
  }

  openCommentsModal(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const modal = document.getElementById('w-comments-modal');
    const container = document.getElementById('w-comments-container');
    const targetPostPreview = document.getElementById('w-modal-post-target');
    const sendBtn = document.getElementById('w-btn-send-comment');

    if (!modal || !container || !targetPostPreview) return;

    const author = this.getAccountById(post.authorId);
    targetPostPreview.innerHTML = `
      <div style="display: flex; gap: 10px; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid var(--w-border);">
        ${this.renderAvatarHtml(author, 'sm')}
        <div>
          <div style="font-weight: 700; font-size: 0.9rem; color: #fff;">${author.name} <span style="color: var(--w-text-muted); font-weight: normal;">${author.handle}</span></div>
          <div style="font-size: 0.88rem; color: var(--w-text-main); margin-top: 4px;">${this.formatText(post.text)}</div>
        </div>
      </div>
    `;

    if (post.comments && post.comments.length > 0) {
      container.innerHTML = post.comments.map(c => {
        const cAuthor = this.getAccountById(c.authorId);
        return `
          <div class="w-comment-item">
            ${this.renderAvatarHtml(cAuthor, 'sm')}
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
      container.innerHTML = `<p style="color: var(--w-text-muted); font-size: 0.85rem; text-align: center; padding: 12px 0;">Nenhuma resposta ainda.</p>`;
    }

    if (sendBtn) {
      sendBtn.onclick = async () => {
        if (!this.authenticatedAccount) {
          this.openTokenModal();
          return;
        }
        const commentInput = document.getElementById('w-comment-input');
        const cText = commentInput ? commentInput.value.trim() : '';
        if (!cText) return;

        const postingAcc = this.getPostingAccount();

        const newComment = {
          id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
          authorId: postingAcc.id,
          text: cText,
          timestamp: Date.now()
        };

        if (!post.comments) post.comments = [];
        post.comments.push(newComment);

        this.savePostsLocal();
        this.updatePostStatsInDOM(postId);

        this.broadcastSync('ADD_COMMENT', { postId: postId, comment: newComment });
        await this.syncToCloud();

        if (commentInput) commentInput.value = '';
        this.openCommentsModal(postId);
      };
    }

    modal.classList.add('active');
  }

  openPropModal(postId) {
    const post = this.posts.find(p => p.id === postId);
    if (!post) return;

    const modal = document.getElementById('w-prop-modal');
    const container = document.getElementById('w-prop-render-area');
    if (!modal || !container) return;

    const author = this.getAccountById(post.authorId);
    const badgeSvg = this.renderBadgeSvg(author.badge);

    container.innerHTML = `
      <div class="w-prop-card" style="max-width: 520px; margin: 0 auto;">
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid var(--w-border); padding-bottom: 10px; margin-bottom: 12px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--w-primary)" stroke-width="2.8"><path d="M3 4l4.5 16L12 9l4.5 11L21 4"/></svg>
            <span style="font-weight: 900; font-size: 0.95rem; letter-spacing: 0.05em; color: #fff;">WUITTER &bull; REGISTRO DE REDE</span>
          </div>
          <span style="font-size: 0.75rem; color: var(--w-text-muted); font-family: var(--w-font-mono);">EVIDÊNCIA #${post.id.slice(-6)}</span>
        </div>

        <div style="display: flex; gap: 12px; margin-bottom: 12px;">
          ${this.renderAvatarHtml(author, 'normal')}
          <div>
            <div style="font-weight: 700; color: #fff; font-size: 0.95rem; display: flex; align-items: center; gap: 4px;">
              ${author.name} ${badgeSvg}
            </div>
            <div style="color: var(--w-text-muted); font-size: 0.8rem;">${author.handle}</div>
          </div>
        </div>

        <div style="font-size: 1.05rem; line-height: 1.5; color: #fff; margin-bottom: 14px; white-space: pre-wrap; text-align: left;">
          ${this.formatText(post.text)}
        </div>

        ${post.media ? `<div style="border-radius: 8px; overflow: hidden; margin-bottom: 12px; border: 1px solid var(--w-border);"><img src="${post.media}" style="width: 100%; display: block;"></div>` : ''}

        <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid var(--w-border); padding-top: 10px; font-size: 0.8rem; color: var(--w-text-muted); font-family: var(--w-font-mono);">
          <span>${new Date(post.timestamp).toLocaleString('pt-BR')}</span>
          <span>${post.likes || 0} Curtidas &bull; ${post.rewuits || 0} Re-wuits</span>
        </div>
      </div>
    `;

    modal.classList.add('active');
  }

  openLightbox(src) {
    const modal = document.getElementById('w-lightbox-modal');
    const img = document.getElementById('w-lightbox-img');
    if (modal && img) {
      img.src = src;
      modal.classList.add('active');
    }
  }

  exportFeedJson() {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      accounts: this.accounts,
      posts: this.posts
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wuitter_feed_${Date.now()}.json`;
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
        reader.onload = async (re) => {
          try {
            const data = JSON.parse(re.target.result);
            if (data.posts && Array.isArray(data.posts)) {
              this.posts = data.posts;
              this.savePostsLocal();
            }
            if (data.accounts && Array.isArray(data.accounts)) {
              this.accounts = data.accounts;
              this.saveAccountsLocal();
            }
            this.render();
            await this.syncToCloud();
            alert('Feed e Contas importados e sincronizados com sucesso na Nuvem!');
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

document.addEventListener('DOMContentLoaded', () => {
  window.wuitter = new WuitterSystem();
});
