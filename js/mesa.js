/* ============================================================
   MESA VIRTUAL & ENGINES — WUITALUR RPG
   - Glitch Background Engine
   - Diagonal Comic Stream Engine (Ficha)
   - State, 4-Char Tokens, Mobile UI & Real-Time Live Editing (Zero Emojis, In-Place DOM Updates)
   ============================================================ */

// SVG CONSTANTS (Sem Emojis)
const SVG_ICONS = {
  eye: `<svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  pencil: `<svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`,
  key: `<svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>`
};

// ---- 1. MOTOR DE GLITCH DO FUNDO DA MESA ----
const GlitchEngine = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  glitches: [],
  running: true,

  init() {
    this.canvas = document.getElementById('glitch-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.loop();
    this.scheduleSpawns();
  },

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  },

  scheduleSpawns() {
    const triggerGlitchBurst = () => {
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        this.createGlitch();
      }
      const nextTime = Math.random() * 2500 + 800;
      setTimeout(triggerGlitchBurst, nextTime);
    };

    triggerGlitchBurst();
  },

  createGlitch() {
    const types = ['slice', 'scanline', 'microBlock', 'digitalDot'];
    const type = types[Math.floor(Math.random() * types.length)];

    const orangePalette = [
      'rgba(255, 85, 0, 0.40)',
      'rgba(255, 110, 0, 0.35)',
      'rgba(255, 140, 20, 0.30)',
      'rgba(220, 70, 0, 0.35)',
      'rgba(255, 170, 40, 0.25)'
    ];
    const color = orangePalette[Math.floor(Math.random() * orangePalette.length)];

    const x = Math.random() * this.width;
    const y = Math.random() * this.height;

    let glitch = {
      type,
      x,
      y,
      color,
      life: Math.floor(Math.random() * 12) + 6,
      maxLife: 14,
      width: 0,
      height: 0,
      size: 0
    };

    if (type === 'slice') {
      glitch.width = Math.random() * (this.width * 0.35) + 30;
      glitch.height = Math.random() * 3 + 1;
      glitch.x = Math.random() * (this.width - glitch.width);
    } else if (type === 'scanline') {
      glitch.width = this.width;
      glitch.height = Math.random() * 1.5 + 0.8;
      glitch.x = 0;
    } else if (type === 'microBlock') {
      glitch.width = Math.random() * 50 + 15;
      glitch.height = Math.random() * 14 + 4;
      glitch.hollow = Math.random() > 0.4;
    } else if (type === 'digitalDot') {
      glitch.size = Math.random() * 3 + 1.5;
    }

    glitch.maxLife = glitch.life;
    this.glitches.push(glitch);
  },

  loop() {
    if (!this.running) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.glitches.length - 1; i >= 0; i--) {
      const g = this.glitches[i];
      g.life--;

      const fade = g.life / g.maxLife;
      this.ctx.save();
      this.ctx.globalAlpha = fade * 0.7;
      this.ctx.shadowBlur = 6;
      this.ctx.shadowColor = '#ff5500';

      if (g.type === 'slice') {
        this.ctx.fillStyle = g.color;
        this.ctx.fillRect(g.x, g.y, g.width, g.height);
      } else if (g.type === 'scanline') {
        this.ctx.fillStyle = g.color;
        this.ctx.fillRect(0, g.y, this.width, g.height);
      } else if (g.type === 'microBlock') {
        if (g.hollow) {
          this.ctx.strokeStyle = g.color;
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(g.x, g.y, g.width, g.height);
        } else {
          this.ctx.fillStyle = g.color;
          this.ctx.fillRect(g.x, g.y, g.width, g.height);
        }
      } else if (g.type === 'digitalDot') {
        this.ctx.fillStyle = g.color;
        this.ctx.fillRect(g.x, g.y, g.size, g.size);
      }

      this.ctx.restore();

      if (g.life <= 0) {
        this.glitches.splice(i, 1);
      }
    }

    requestAnimationFrame(() => this.loop());
  }
};


// ---- 2. MOTOR DE BOLINHAS COMIC EM FLUXO DIAGONAL ----
const FichaParticlesEngine = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  particles: [],
  active: false,

  init() {
    this.canvas = document.getElementById('ficha-particles-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.spawnParticles();
  },

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  },

  createParticle(initial = false) {
    let x, y;
    if (initial) {
      x = Math.random() * (this.width * 0.65);
      y = this.height - (Math.random() * (this.height * 0.75));
    } else {
      if (Math.random() > 0.5) {
        x = Math.random() * (this.width * 0.45);
        y = this.height + 15;
      } else {
        x = -15;
        y = this.height - (Math.random() * (this.height * 0.6));
      }
    }

    const speed = Math.random() * 1.5 + 1.0;
    return {
      x,
      y,
      radius: Math.random() * 7 + 2.5,
      vx: speed,
      vy: -speed * (Math.random() * 0.3 + 0.85),
      baseAlpha: Math.random() * 0.35 + 0.15,
      color: Math.random() > 0.3 ? '255, 95, 0' : '255, 150, 30'
    };
  },

  spawnParticles() {
    this.particles = [];
    const count = 45;
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createParticle(true));
    }
  },

  start() {
    this.active = true;
    this.loop();
  },

  stop() {
    this.active = false;
  },

  loop() {
    if (!this.active) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = 0; i < this.particles.length; i++) {
      let p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;

      const distFromOrigin = Math.sqrt(p.x * p.x + (this.height - p.y) * (this.height - p.y));
      const maxDist = Math.max(this.width, this.height) * 0.75;
      let fade = 1 - Math.min(distFromOrigin / maxDist, 1);

      if (fade > 0.05) {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = `rgba(${p.color}, ${p.baseAlpha * fade})`;
        this.ctx.fill();
      }

      if (p.x > this.width * 0.75 || p.y < -20 || fade <= 0.05) {
        this.particles[i] = this.createParticle(false);
      }
    }

    requestAnimationFrame(() => this.loop());
  }
};


// ---- 3. MESA APP (GERENCIADOR DE ESTADO, SUPABASE & TOKENS) ----
const MesaApp = {
  SUPABASE_URL: 'https://qkupdpgcjusbedaoahwi.supabase.co', 
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdXBkcGdjanVzYmVkYW9haHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNzk1ODAsImV4cCI6MjEwMzc1NTU4MH0.UDc5nE7ZwUyWmwNZKpq7bGrty1N6Uh0bjq2PJtBkVrk', 
  
  // TOKEN EXCLUSIVO DO MESTRE (ACESSO TOTAL)
  MASTER_TOKEN: 'M9X7',

  // LISTA DE TOKENS DE 4 CARACTERES PARA OS 8 SLOTS
  SLOT_TOKENS: {
    1: 'W4R9',
    2: 'K7M2',
    3: 'B8T3', // Eric "Blade"
    4: 'V5N8',
    5: 'L3P6',
    6: 'H9D4',
    7: 'Z2Q7',
    8: 'X6K1'
  },

  supabase: null,
  
  state: {
    players: new Array(8).fill(null),
    myToken: localStorage.getItem('mesa_token') || null,
    isMaster: false,
    activeViewingPlayer: null
  },

  init() {
    console.log("Inicializando Mesa Virtual...");

    GlitchEngine.init();
    FichaParticlesEngine.init();
    
    this.checkSavedToken();

    if (this.SUPABASE_URL && this.SUPABASE_KEY && window.supabase) {
      this.supabase = window.supabase.createClient(this.SUPABASE_URL, this.SUPABASE_KEY);
      this.fetchPlayers();
      this.subscribeToRealtime();
    } else {
      console.warn("Supabase não disponível. Exibindo dados locais.");
      this.loadMockData();
    }

    MesaChat.init();
    MesaReactions.init();
    MesaDice.init();
    MesaMediaPlayer.init();
    this.updateTokenBtnState();
  },

  checkSavedToken() {
    const saved = localStorage.getItem('mesa_token');

    if (saved) {
      this.state.myToken = saved.toUpperCase();
      if (this.state.myToken === this.MASTER_TOKEN) {
        this.state.isMaster = true;
      }
    }

    this.updateTokenBtnState();

    if (typeof MesaMediaPlayer !== 'undefined') {
      MesaMediaPlayer.updateMasterVisibility();
    }
  },

  updateTokenBtnState() {
    const tokenBtn = document.getElementById('nav-token-btn');
    const tokenLabel = document.getElementById('nav-token-label');
    const alertBadge = document.getElementById('token-alert-badge');
    if (!tokenBtn) return;

    if (this.state.isMaster) {
      if (tokenLabel) tokenLabel.textContent = 'Token Ativo';
      if (alertBadge) alertBadge.style.display = 'none';
    } else if (this.state.myToken) {
      if (tokenLabel) tokenLabel.textContent = this.state.myToken;
      if (alertBadge) alertBadge.style.display = 'none';
    } else {
      if (tokenLabel) tokenLabel.textContent = 'Token';
      if (alertBadge) alertBadge.style.display = 'flex';
    }
  },

  loadMockData() {
    // Personagem para Slot 1 (Thulita De La Benevidez)
    this.state.players[0] = {
      id: 2,
      slot: 1,
      token: 'W4R9',
      nome: 'Thulita De La Benevidez',
      idade: '18 anos',
      altura: '1,40',
      raca: 'Dragão Anão',
      arquetipo: 'Popular',
      hp: 14, hpMax: 14,
      pe: 10, peMax: 10,
      st: 0, stMax: 32,
      stressPoints: 0,
      stressPointsMax: 6,
      atributos: {
        'Saúde': 'd12',
        'Vigor': 'd16',
        'Força': 'd4',
        'Mente': 'd8'
      },
      bonus: [
        { origem: 'Raça (Dragão Anão)', desc: '+d4 em testes de Mente' },
        { origem: 'Arquétipo (Popular)', desc: '+d4 em Testes Sociais' }
      ],
      pericias: ['Atletismo', 'Percepção', 'Acrobacia', 'Intuição'],
      habilidades: [
        { nome: 'Sopro Ancestral', custo: '4 PE', desc: 'Expele um cone de energia elemental (frio, fogo ou ácido) de 3m. Inimigos na área sofrem dano igual a uma rolagem de Força e devem passar em teste de Vigor (CT 13) ou ficam atordoados por 1 rodada.' },
        { nome: 'Conexão Sensorial', custo: '2 PE', desc: 'Usa suas antenas para se comunicar telepaticamente com aliados a até 20m por 1 cena. Transmite emoções, imagens simples e intenções.' },
        { nome: 'Carisma Natural', custo: 'Passiva', desc: 'Testemunhas e habitantes locais sempre confiam em você e compartilham boatos e segredos da cidade.' }
      ]
    };

    // Personagem para Slot 2 (Sanguiminerva "Minerva" Qamari Von Adams)
    this.state.players[1] = {
      id: 3,
      slot: 2,
      token: 'M7Q2',
      nome: 'Sanguiminerva "Minerva" Qamari Von Adams',
      idade: '18 anos',
      altura: '1,78m',
      raca: 'Vampira',
      arquetipo: 'Nerd',
      hp: 12, hpMax: 12,
      pe: 10, peMax: 10,
      st: 0, stMax: 40,
      stressPoints: 0,
      stressPointsMax: 6,
      atributos: {
        'Saúde': 'd8',
        'Vigor': 'd12',
        'Força': 'd4',
        'Mente': 'd16'
      },
      bonus: [
        { origem: 'Raça (Vampira)', desc: '+d4 em testes de Mente e Visão no Escuro (5B)' },
        { origem: 'Arquétipo (Nerd)', desc: '+d4 em Testes de Mente' }
      ],
      pericias: ['Furtividade', 'Intimidação', 'Investigação', 'Astúcia'],
      habilidades: [
        { nome: 'Mordida Vampírica', custo: '3 PE', desc: 'Morde um alvo adjacente para drenar sangue. Causa dano igual a uma rolagem de Força e restaura PV iguais à metade do dano causado.' },
        { nome: 'Presença Hipnótica', custo: '2 PE', desc: 'Exerce magnetismo sobrenatural. Ganha vantagem em testes de Mente para intimidar ou convencer até o fim da cena.' },
        { nome: 'Raciocínio Lógico', custo: '2 PE', desc: 'Pode gastar 2 PE para analisar uma cena de enigma, mecanismo ou texto cifrado e deduzir instantaneamente um padrão oculto.' }
      ]
    };

    // Personagem para Slot 3 (Eric "Blade")
    this.state.players[2] = {
      id: 1,
      slot: 3,
      token: 'B8T3',
      nome: 'Eric "Blade" Tepes Adams',
      idade: '17 anos',
      altura: '1,76',
      raca: 'Vampiro',
      arquetipo: 'Curioso',
      hp: 12, hpMax: 12,
      pe: 10, peMax: 10,
      st: 0, stMax: 44,
      stressPoints: 0,
      stressPointsMax: 6,
      atributos: {
        'Mente': 'd16',
        'Saúde': 'd4',
        'Vigor': 'd12',
        'Força': 'd8'
      },
      bonus: [
        { origem: 'Raça (Vampiro)', desc: '+d4 em testes de Mente e Visão no Escuro (5B)' },
        { origem: 'Arquétipo (Curioso)', desc: '+d4 em testes de Investigação' }
      ],
      pericias: ['Investigação', 'Percepção', 'Disparada', 'Medicina'],
      habilidades: [
        { nome: 'Mordida Vampírica', custo: '3 PE', desc: 'Morde um alvo adjacente para drenar sangue. Causa dano igual a uma rolagem de Força e restaura PV iguais à metade do dano causado.' },
        { nome: 'Presença Hipnótica', custo: '2 PE', desc: 'Exerce magnetismo sobrenatural. Ganha vantagem em testes de Mente para intimidar ou convencer até o fim da cena.' },
        { nome: 'Olhar Investigativo', custo: '2 PE', desc: 'Gasta 2 PE para notar instantaneamente marcas de arranhões, botões falsos ou compartimentos secretos na cena.' }
      ]
    };
    
    this.renderMesa();
  },

  async fetchPlayers() {
    if (!this.supabase) return;
    
    try {
      const { data, error } = await this.supabase
        .from('personagens')
        .select('*');
        
      if (error) {
        console.warn("Erro ao buscar personagens no Supabase:", error.message);
        this.loadMockData();
        return;
      }
      
      this.state.players = new Array(8).fill(null);
      
      if (data && data.length > 0) {
        data.forEach(raw => {
          const p = {
            id: raw.id,
            slot: raw.slot,
            token: raw.token,
            nome: raw.nome,
            idade: raw.idade,
            altura: raw.altura,
            raca: raw.raca,
            arquetipo: raw.arquetipo,
            hp: raw.hp !== undefined ? raw.hp : 12,
            hpMax: raw.hp_max !== undefined ? raw.hp_max : (raw.hpMax || 12),
            pe: raw.pe !== undefined ? raw.pe : 10,
            peMax: raw.pe_max !== undefined ? raw.pe_max : (raw.peMax || 10),
            st: raw.st !== undefined ? raw.st : 0,
            stMax: raw.st_max !== undefined ? raw.st_max : (raw.stMax || 44),
            stressPoints: raw.stress_points !== undefined ? raw.stress_points : (raw.stressPoints || 0),
            stressPointsMax: raw.stress_points_max !== undefined ? raw.stress_points_max : (raw.stressPointsMax || 6),
            atributos: typeof raw.atributos === 'string' ? JSON.parse(raw.atributos || '{}') : (raw.atributos || {}),
            bonus: typeof raw.bonus === 'string' ? JSON.parse(raw.bonus || '[]') : (raw.bonus || []),
            pericias: typeof raw.pericias === 'string' ? JSON.parse(raw.pericias || '[]') : (raw.pericias || []),
            habilidades: (typeof raw.habilidades === 'string' ? JSON.parse(raw.habilidades || '[]') : (raw.habilidades || []))
              .filter(h => {
                if (!h || !h.nome) return false;
                const clean = h.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
                return !clean.includes("visao") && !clean.includes("escuro");
              })
          };

          // Garantir que Eric (Slot 3 / Token B8T3) tenha apenas as 3 habilidades corretas
          if (p.token === 'B8T3' || p.slot === 3) {
            p.habilidades = p.habilidades.filter(h => {
              if (!h || !h.nome) return false;
              const clean = h.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
              return !clean.includes("visao") && !clean.includes("escuro");
            });

            if (!p.habilidades.some(h => h.nome === 'Olhar Investigativo')) {
              p.habilidades.push({
                nome: 'Olhar Investigativo',
                custo: '2 PE',
                desc: 'Gasta 2 PE para notar instantaneamente marcas de arranhões, botões falsos ou compartimentos secretos na cena.'
              });
            }

            // Sincroniza e limpa no banco de dados do Supabase
            if (this.supabase && p.id) {
              this.supabase.from('personagens').update({
                habilidades: p.habilidades
              }).eq('id', p.id).then(() => {});
            }
          }

          if (p.slot >= 1 && p.slot <= 8) {
            this.state.players[p.slot - 1] = p;
          }
        });
      }

      // Garante que Thulita (Slot 1), Minerva (Slot 2) e Eric (Slot 3) estejam presentes
      if (!this.state.players[0]) {
        this.state.players[0] = {
          id: 2, slot: 1, token: 'W4R9', nome: 'Thulita De La Benevidez', idade: '18 anos', altura: '1,40', raca: 'Dragão Anão', arquetipo: 'Popular',
          hp: 14, hpMax: 14, pe: 10, peMax: 10, st: 0, stMax: 32, stressPoints: 0, stressPointsMax: 6,
          atributos: { 'Saúde': 'd12', 'Vigor': 'd16', 'Força': 'd4', 'Mente': 'd8' },
          bonus: [{ origem: 'Raça (Dragão Anão)', desc: '+d4 em testes de Mente' }, { origem: 'Arquétipo (Popular)', desc: '+d4 em Testes Sociais' }],
          pericias: ['Atletismo', 'Percepção', 'Acrobacia', 'Intuição'],
          habilidades: [
            { nome: 'Sopro Ancestral', custo: '4 PE', desc: 'Expele um cone de energia elemental (frio, fogo ou ácido) de 3m. Inimigos na área sofrem dano igual a uma rolagem de Força e devem passar em teste de Vigor (CT 13) ou ficam atordoados por 1 rodada.' },
            { nome: 'Conexão Sensorial', custo: '2 PE', desc: 'Usa suas antenas para se comunicar telepaticamente com aliados a até 20m por 1 cena. Transmite emoções, imagens simples e intenções.' },
            { nome: 'Carisma Natural', custo: 'Passiva', desc: 'Testemunhas e habitantes locais sempre confiam em você e compartilham boatos e segredos da cidade.' }
          ]
        };
      }

      if (!this.state.players[1]) {
        this.state.players[1] = {
          id: 3, slot: 2, token: 'M7Q2', nome: 'Sanguiminerva "Minerva" Qamari Von Adams', idade: '18 anos', altura: '1,78m', raca: 'Vampira', arquetipo: 'Nerd',
          hp: 12, hpMax: 12, pe: 10, peMax: 10, st: 0, stMax: 40, stressPoints: 0, stressPointsMax: 6,
          atributos: { 'Saúde': 'd8', 'Vigor': 'd12', 'Força': 'd4', 'Mente': 'd16' },
          bonus: [{ origem: 'Raça (Vampira)', desc: '+d4 em testes de Mente e Visão no Escuro (5B)' }, { origem: 'Arquétipo (Nerd)', desc: '+d4 em Testes de Mente' }],
          pericias: ['Furtividade', 'Intimidação', 'Investigação', 'Astúcia'],
          habilidades: [
            { nome: 'Mordida Vampírica', custo: '3 PE', desc: 'Morde um alvo adjacente para drenar sangue. Causa dano igual a uma rolagem de Força e restaura PV iguais à metade do dano causado.' },
            { nome: 'Presença Hipnótica', custo: '2 PE', desc: 'Exerce magnetismo sobrenatural. Ganha vantagem em testes de Mente para intimidar ou convencer até o fim da cena.' },
            { nome: 'Raciocínio Lógico', custo: '2 PE', desc: 'Pode gastar 2 PE para analisar uma cena de enigma, mecanismo ou texto cifrado e deduzir instantaneamente um padrão oculto.' }
          ]
        };
      }

      if (!this.state.players[2]) {
        this.state.players[2] = {
          id: 1, slot: 3, token: 'B8T3', nome: 'Eric "Blade" Tepes Adams', idade: '17 anos', altura: '1,76', raca: 'Vampiro', arquetipo: 'Curioso',
          hp: 12, hpMax: 12, pe: 10, peMax: 10, st: 0, stMax: 44, stressPoints: 0, stressPointsMax: 6,
          atributos: { 'Mente': 'd16', 'Saúde': 'd4', 'Vigor': 'd12', 'Força': 'd8' },
          bonus: [{ origem: 'Raça (Vampiro)', desc: '+d4 em testes de Mente e Visão no Escuro (5B)' }, { origem: 'Arquétipo (Curioso)', desc: '+d4 em testes de Investigação' }],
          pericias: ['Investigação', 'Percepção', 'Disparada', 'Medicina'],
          habilidades: [
            { nome: 'Mordida Vampírica', custo: '3 PE', desc: 'Morde um alvo adjacente para drenar sangue. Causa dano igual a uma rolagem de Força e restaura PV iguais à metade do dano causado.' },
            { nome: 'Presença Hipnótica', custo: '2 PE', desc: 'Exerce magnetismo sobrenatural. Ganha vantagem em testes de Mente para intimidar ou convencer até o fim da cena.' },
            { nome: 'Olhar Investigativo', custo: '2 PE', desc: 'Gasta 2 PE para notar instantaneamente marcas de arranhões, botões falsos ou compartimentos secretos na cena.' }
          ]
        };
      }
      
      this.renderMesa();

      // Se a ficha de alguém estiver aberta, atualiza SOMENTE os valores sem re-animar
      if (this.state.activeViewingPlayer) {
        const updated = this.state.players.find(p => p && p.slot === this.state.activeViewingPlayer.slot);
        if (updated) {
          this.state.activeViewingPlayer = updated;
          this.updateVitalsUI(updated);
        }
      }
      
    } catch(err) {
      console.error("Erro ao sincronizar mesa:", err);
      this.loadMockData();
    }
  },

  subscribeToRealtime() {
    if (!this.supabase) return;

    this.supabase
      .channel('mesa_realtime_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'personagens' }, (payload) => {
        console.log("Atualização da mesa recebida:", payload);
        this.fetchPlayers();
      })
      .subscribe();
  },

  renderMesa() {
    for (let i = 0; i < 8; i++) {
      const slotEl = document.querySelector(`.slot-${i + 1}`);
      const p = this.state.players[i];
      
      if (!slotEl) continue;
      
      if (p) {
        slotEl.classList.remove('empty');
        slotEl.innerHTML = `
          <div class="player-avatar-placeholder">${p.nome.charAt(0)}</div>
          <div class="player-name-badge" title="${p.nome}">${p.nome}</div>
          <div class="player-stats-segmented">
            <div class="stat-segmented-row">
              <span class="stat-label-tag" style="background:#16a34a; color:#fff;">PV</span>
              <span>${p.hp}/${p.hpMax || p.hp}</span>
            </div>
            <div class="stat-segmented-row">
              <span class="stat-label-tag" style="background:#0254c2; color:#fff;">PE</span>
              <span>${p.pe}/${p.peMax || p.pe}</span>
            </div>
            <div class="stat-segmented-row">
              <span class="stat-label-tag" style="background:#701cb8; color:#fff;">EST</span>
              <span>${p.st || 0}/${p.stMax || 44}</span>
            </div>
          </div>
        `;
      } else {
        slotEl.classList.add('empty');
        slotEl.innerHTML = `<div class="slot-empty-label">Slot ${i + 1}</div>`;
      }
    }
  },

  handleSlotClick(slotIndex) {
    const p = this.state.players[slotIndex - 1];
    if (p) {
      this.openFicha(p);
    } else {
      alert(`Slot ${slotIndex} está vazio.`);
    }
  },

  // VERIFICA SE O USUÁRIO TEM PERMISSÃO DE EDIÇÃO NESTA FICHA
  canEdit(player) {
    if (!player) return false;
    if (this.state.isMaster) return true;
    if (this.state.myToken && player.token && this.state.myToken === player.token.toUpperCase()) {
      return true;
    }
    return false;
  },

  // ATUALIZAÇÃO CIRÚRGICA DOS VALORES NO DOM (SEM REPETIR ANIMAÇÕES)
  updateVitalsUI(player) {
    const pvEl = document.getElementById('ficha-pv-val');
    const peEl = document.getElementById('ficha-pe-val');
    const stEl = document.getElementById('ficha-stress-val');
    const fillEl = document.getElementById('ficha-stress-fill');
    const pipsEl = document.getElementById('ficha-stress-pips');

    if (pvEl) pvEl.textContent = `${player.hp} / ${player.hpMax || player.hp}`;
    if (peEl) peEl.textContent = `${player.pe} / ${player.peMax || player.pe}`;
    
    const stCurrent = player.st || 0;
    const stMax = player.stMax || 44;
    const stPercent = Math.min(Math.round((stCurrent / stMax) * 100), 100);
    const stressPoints = player.stressPoints || 0;
    const maxStressPoints = player.stressPointsMax || 6;

    if (stEl) stEl.textContent = `${stCurrent} / ${stMax}`;
    if (fillEl) fillEl.style.width = `${stPercent}%`;

    if (pipsEl) {
      let stressPipsHtml = '';
      for (let i = 0; i < maxStressPoints; i++) {
        const isFilled = i < stressPoints ? 'filled' : 'empty';
        stressPipsHtml += `<span class="stress-pip ${isFilled}" title="Ponto de Estresse ${i + 1}"></span>`;
      }
      pipsEl.innerHTML = stressPipsHtml;
    }
  },

  // ATUALIZAÇÃO EM TEMPO REAL DOS STATUS
  async updateStat(slot, field, delta) {
    const player = this.state.players[slot - 1];
    if (!player || !this.canEdit(player)) return;

    let patchData = {};

    if (field === 'hp') {
      const max = player.hpMax || 12;
      const next = Math.max(0, Math.min(max, (player.hp || 0) + delta));
      player.hp = next;
      patchData.hp = next;
    } else if (field === 'pe') {
      const max = player.peMax || 10;
      const next = Math.max(0, Math.min(max, (player.pe || 0) + delta));
      player.pe = next;
      patchData.pe = next;
    } else if (field === 'st') {
      const max = player.stMax || 44;
      let next = (player.st || 0) + delta;
      
      if (next >= max) {
        player.st = 0;
        player.stressPoints = Math.min((player.stressPointsMax || 6), (player.stressPoints || 0) + 1);
        patchData.st = 0;
        patchData.stress_points = player.stressPoints;
      } else {
        next = Math.max(0, next);
        player.st = next;
        patchData.st = next;
      }
    } else if (field === 'stressPoints') {
      const max = player.stressPointsMax || 6;
      const next = Math.max(0, Math.min(max, (player.stressPoints || 0) + delta));
      player.stressPoints = next;
      patchData.stress_points = next;
    }

    // 1. Atualiza cirurgicamente no DOM (zero replay de animação)
    this.updateVitalsUI(player);
    this.renderMesa();

    // 2. Sincroniza com o Supabase
    if (this.supabase && player.id) {
      try {
        await this.supabase
          .from('personagens')
          .update(patchData)
          .eq('id', player.id);
      } catch(err) {
        console.error("Erro ao salvar status no Supabase:", err);
      }
    }
  },

  // ABRE A TELA DA FICHA COMPLETA
  openFicha(player, startParticles = true) {
    const fichaModal = document.getElementById('ficha-modal');

    // Se a ficha já está aberta para ESTE mesmo personagem, apenas atualiza valores
    if (fichaModal.classList.contains('active') && this.state.activeViewingPlayer && this.state.activeViewingPlayer.slot === player.slot) {
      this.state.activeViewingPlayer = player;
      this.updateVitalsUI(player);
      return;
    }

    this.state.activeViewingPlayer = player;
    const content = document.getElementById('ficha-content');
    const editable = this.canEdit(player);

    let rawAttrs = player.atributos || {};
    let skills = player.pericias || [];
    let habs = player.habilidades || [];
    let bonusList = player.bonus && player.bonus.length > 0 ? player.bonus : [
      { origem: `Raça (${player.raca || 'Vampiro'})`, desc: '+d4 em Mente' },
      { origem: `Arquétipo (${player.arquetipo || 'Curioso'})`, desc: '+d4 em Mente' }
    ];

    // Atributos limpos
    let attrsHtml = Object.keys(rawAttrs).map((k, idx) => {
      let val = typeof rawAttrs[k] === 'object' ? rawAttrs[k].val : rawAttrs[k];
      return `
        <div class="attr-open-item" style="--attr-idx: ${idx};">
          <span class="attr-open-name">${k}</span>
          <span class="attr-open-badge">${val || 'd4'}</span>
        </div>
      `;
    }).join('');

    // Bônus de Raça / Arquétipo
    let bonusHtml = bonusList.map((b, idx) => `
      <div class="bonus-item-badge" style="--bonus-idx: ${idx};">
        <span class="bonus-origem">${b.origem}:</span>
        <span class="bonus-desc">${b.desc}</span>
      </div>
    `).join('');

    // Perícias em UMA ÚNICA COLUNA VERTICAL
    let skillsHtml = skills.map((s, idx) => `
      <li class="skill-open-item" style="--skill-idx: ${idx};">${s}</li>
    `).join('');
    
    // Habilidades filtradas estritamente (removendo qualquer variante de Visão no Escuro)
    const isDarkVision = (name) => {
      if (!name) return false;
      const clean = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
      return clean.includes("visao") || clean.includes("escuro");
    };

    let habsHtml = habs.filter(h => h && h.nome && !isDarkVision(h.nome)).map((h, idx) => `
      <li class="hab-open-item" style="--hab-idx: ${idx};">
        <div class="hab-open-title">
          ✦ ${h.nome}
          ${h.custo ? `<span class="hab-open-cost">${h.custo}</span>` : ''}
        </div>
        <p class="hab-open-desc">${h.desc}</p>
      </li>
    `).join('');

    // Cálculo da Barra de Estresse Roxa
    const stCurrent = player.st || 0;
    const stMax = player.stMax || 44;
    const stPercent = Math.min(Math.round((stCurrent / stMax) * 100), 100);
    const stressPoints = player.stressPoints || 0;
    const maxStressPoints = player.stressPointsMax || 6;

    let stressPipsHtml = '';
    for (let i = 0; i < maxStressPoints; i++) {
      const isFilled = i < stressPoints ? 'filled' : 'empty';
      stressPipsHtml += `<span class="stress-pip ${isFilled}" title="Ponto de Estresse ${i + 1}"></span>`;
    }

    content.innerHTML = `
      <!-- COLUNA ESQUERDA: ILUSTRAÇÃO (CUBO SECO) -->
      <div class="ficha-portrait-col">
        <div class="cube-placeholder-box">
          <svg viewBox="0 0 100 100" class="cube-svg">
            <polygon points="50,12 88,34 50,56 12,34" fill="rgba(255,85,0,0.12)" stroke="#ff5500" stroke-width="2.2" />
            <polygon points="12,34 50,56 50,92 12,70" fill="rgba(255,85,0,0.06)" stroke="#ff5500" stroke-width="2.2" />
            <polygon points="88,34 50,56 50,92 88,70" fill="rgba(255,85,0,0.18)" stroke="#ff5500" stroke-width="2.2" />
            <line x1="50" y1="56" x2="50" y2="92" stroke="#ff7733" stroke-width="2.2" />
          </svg>
          <div class="cube-label-dry">[ SEM IMAGEM ]</div>
        </div>
      </div>

      <!-- COLUNA DIREITA: INFORMAÇÕES LIMPAS E DISPERSAS -->
      <div class="ficha-info-col">
        
        <!-- Cabeçalho com Nome, Tags e Indicador de Modo (Com SVGs) -->
        <div class="ficha-char-header">
          <h1 class="ficha-char-title">${player.nome}</h1>
          <div class="ficha-tags-row">
            <span class="ficha-badge-tag">${player.raca || 'N/A'}</span>
            <span class="ficha-badge-tag">${player.arquetipo || 'N/A'}</span>
            <span class="ficha-badge-tag">${player.idade || 'N/A'}</span>
            <span class="ficha-badge-tag">${player.altura || 'N/A'}</span>
            <span class="ficha-permission-tag ${editable ? 'edit' : 'view'}">
              ${editable ? `${SVG_ICONS.pencil} Modo Edição` : `${SVG_ICONS.eye} Modo Leitura`}
            </span>
          </div>
        </div>

        <!-- 1. Linha de PV (Verde) e PE (Azul) com Controles se tiver Permissão -->
        <div class="ficha-vital-row">
          <div class="vital-stat-block">
            <span class="vital-stat-tag pv-tag">PV</span>
            <span id="ficha-pv-val" class="vital-stat-val">${player.hp} / ${player.hpMax || player.hp}</span>
            ${editable ? `
              <button class="stat-edit-btn" onclick="MesaApp.updateStat(${player.slot}, 'hp', -1)" title="Diminuir PV">-</button>
              <button class="stat-edit-btn" onclick="MesaApp.updateStat(${player.slot}, 'hp', +1)" title="Aumentar PV">+</button>
            ` : ''}
          </div>
          
          <div class="vital-stat-block">
            <span class="vital-stat-tag pe-tag">PE</span>
            <span id="ficha-pe-val" class="vital-stat-val">${player.pe} / ${player.peMax || player.pe}</span>
            ${editable ? `
              <button class="stat-edit-btn" onclick="MesaApp.updateStat(${player.slot}, 'pe', -1)" title="Gastar PE">-</button>
              <button class="stat-edit-btn" onclick="MesaApp.updateStat(${player.slot}, 'pe', +1)" title="Restaurar PE">+</button>
            ` : ''}
          </div>
        </div>

        <!-- 2. Barra Roxa de Estresse e 6 Bolinhas Transparentes Abaixo -->
        <div class="ficha-stress-container">
          <div class="stress-bar-header">
            <span class="vital-stat-tag stress-tag">ESTRESSE</span>
            <span id="ficha-stress-val" class="stress-val">${stCurrent} / ${stMax}</span>
            ${editable ? `
              <button class="stat-edit-btn" onclick="MesaApp.updateStat(${player.slot}, 'st', -1)" title="Diminuir Estresse">-</button>
              <button class="stat-edit-btn" onclick="MesaApp.updateStat(${player.slot}, 'st', +1)" title="Aumentar Estresse">+</button>
              <button class="stat-edit-btn" onclick="MesaApp.updateStat(${player.slot}, 'st', +5)" title="+5 Estresse">+5</button>
            ` : ''}
          </div>
          
          <!-- Barra Roxa -->
          <div class="stress-meter-track">
            <div id="ficha-stress-fill" class="stress-meter-fill" style="width: ${stPercent}%;"></div>
          </div>

          <!-- 6 Bolinhas de Pontos de Estresse -->
          <div class="stress-points-row">
            <span class="stress-points-label">Pontos de Estresse:</span>
            <div id="ficha-stress-pips" class="stress-pips-list">
              ${stressPipsHtml}
            </div>
            ${editable ? `
              <button class="stat-edit-btn" style="width:20px;height:20px;font-size:0.75rem;" onclick="MesaApp.updateStat(${player.slot}, 'stressPoints', -1)" title="Remover Ponto">-</button>
              <button class="stat-edit-btn" style="width:20px;height:20px;font-size:0.75rem;" onclick="MesaApp.updateStat(${player.slot}, 'stressPoints', +1)" title="Adicionar Ponto">+</button>
            ` : ''}
          </div>
        </div>

        <!-- 3. Atributos e Bônus de Arquétipo/Raça -->
        <div class="ficha-dual-row">
          <div class="ficha-open-section ficha-section-attrs">
            <div class="ink-ribbon-title">ATRIBUTOS</div>
            <div class="ficha-open-attrs">
              ${attrsHtml}
            </div>
          </div>

          <div class="ficha-open-section ficha-section-bonus">
            <div class="ink-ribbon-title" style="background:#8b1b00;">BÔNUS DE ARQUÉTIPO / RAÇA</div>
            <div class="bonus-badges-list">
              ${bonusHtml}
            </div>
          </div>
        </div>

        <!-- 4. Perícias (Coluna Única) e Habilidades Lado a Lado -->
        <div class="ficha-skills-habs-row">
          <div class="ficha-open-section ficha-section-skills">
            <div class="ink-ribbon-title">PERÍCIAS</div>
            <ul class="skills-single-col-list">
              ${skillsHtml}
            </ul>
          </div>

          <div class="ficha-open-section ficha-section-habs">
            <div class="ink-ribbon-title">HABILIDADES</div>
            <ul class="habs-open-list">
              ${habsHtml}
            </ul>
          </div>
        </div>

      </div>
    `;

    if (startParticles) {
      FichaParticlesEngine.start();
    }

    fichaModal.classList.add('active');
  },

  openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('active');
    }
  },

  openTokenModal() {
    this.openModal('token-modal');
    const input = document.getElementById('token-input');
    if (input) {
      input.value = this.state.myToken || '';
      input.focus();
    }
  },

  closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.remove('active');
    }
    if (id === 'ficha-modal') {
      FichaParticlesEngine.stop();
      this.state.activeViewingPlayer = null;
    }
  },

  toggleMobileGroupView() {
    const fichaModal = document.getElementById('ficha-modal');
    if (fichaModal.classList.contains('active')) {
      this.closeModal('ficha-modal');
    } else {
      this.toggleView();
    }
  },

  async submitToken() {
    const rawInput = document.getElementById('token-input').value.trim();
    if (!rawInput) return;

    const token = rawInput.toUpperCase();

    // 1. VERIFICA SE É O TOKEN DE ACESSO TOTAL
    if (token === this.MASTER_TOKEN) {
      localStorage.setItem('mesa_token', token);
      this.state.myToken = token;
      this.state.isMaster = true;

      this.updateTokenBtnState();
      MesaChat.updateSenderIdentity();
      if (typeof MesaMediaPlayer !== 'undefined') {
        MesaMediaPlayer.updateMasterVisibility();
      }
      alert("[SUCESSO] Token autenticado com sucesso.");
      this.closeModal('token-modal');
      return;
    }

    // 2. VERIFICA SE É O TOKEN DE UM DOS JOGADORES
    localStorage.setItem('mesa_token', token);
    this.state.myToken = token;
    this.state.isMaster = false;
    this.updateTokenBtnState();

    let matchedPlayer = this.state.players.find(p => p && p.token && p.token.toUpperCase() === token);

    if (this.supabase && !matchedPlayer) {
      try {
        const { data, error } = await this.supabase
          .from('personagens')
          .select('*')
          .eq('token', token)
          .single();

        if (data) {
          matchedPlayer = data;
        }
      } catch(err) {
        console.warn("Erro ao verificar token:", err);
      }
    }

    if (matchedPlayer) {
      this.updateTokenBtnState();
      MesaChat.updateSenderIdentity();
      alert(`[CONECTADO] ${matchedPlayer.nome} (Slot ${matchedPlayer.slot}) - Modo de edição ativado.`);
      this.closeModal('token-modal');
      this.openFicha(matchedPlayer);
    } else {
      this.updateTokenBtnState();
      MesaChat.updateSenderIdentity();
      alert(`Token '${token}' salvo.`);
      this.closeModal('token-modal');
    }
  },
  
  toggleView() {
    if (this.state.myToken && !this.state.isMaster) {
      const myChar = this.state.players.find(p => p && p.token && p.token.toUpperCase() === this.state.myToken);
      if (myChar) {
        this.openFicha(myChar);
        return;
      }
    }

    const firstChar = this.state.players.find(p => p !== null) || this.state.players[2];
    if (firstChar) {
      this.openFicha(firstChar);
    } else {
      this.openTokenModal();
    }
  }
};


// ---- 4. MOTOR DE CHAT EM TEMPO REAL DA MESA ----
const MesaChat = {
  isOpen: false,
  messages: [],
  channel: null,

  init() {
    this.updateSenderIdentity();
    this.subscribeToChat();
    this.fetchMessages();
  },

  getCurrentSender() {
    if (MesaApp.state.isMaster) {
      return { name: 'Mestre', isMaster: true, token: 'M9X7' };
    }

    if (MesaApp.state.myToken) {
      const char = MesaApp.state.players.find(p => p && p.token && p.token.toUpperCase() === MesaApp.state.myToken.toUpperCase());
      if (char) {
        return { name: char.nome, isMaster: false, token: MesaApp.state.myToken };
      }
    }

    return { name: 'Observador', isMaster: false, token: null };
  },

  updateSenderIdentity() {
    const el = document.getElementById('chat-sender-identity');
    if (!el) return;
    const sender = this.getCurrentSender();
    el.textContent = `Falando como: ${sender.name}`;
    if (sender.isMaster) {
      el.style.color = '#c084fc';
    } else {
      el.style.color = 'var(--mesa-orange)';
    }
  },

  toggleChat() {
    this.isOpen = !this.isOpen;
    const panel = document.getElementById('mesa-chat-panel');
    const badge = document.getElementById('chat-unread-badge');
    
    if (panel) {
      if (this.isOpen) {
        panel.classList.add('active');
        if (badge) badge.style.display = 'none';
        this.updateSenderIdentity();
        this.scrollToBottom();
        const input = document.getElementById('chat-message-input');
        if (input) setTimeout(() => input.focus(), 150);
      } else {
        panel.classList.remove('active');
      }
    }
  },

  subscribeToChat() {
    if (!MesaApp.supabase) return;

    this.channel = MesaApp.supabase.channel('mesa_chat_room', {
      config: {
        broadcast: { ack: false }
      }
    });

    // 1. WebSocket Broadcast ultra-rápido (< 50ms)
    this.channel.on('broadcast', { event: 'chat_msg' }, (payload) => {
      this.receiveMessage(payload.payload);
    });

    // 2. WebSocket Broadcast de Reações de Emoji (Balão Comic nos Cards)
    this.channel.on('broadcast', { event: 'player_reaction' }, (payload) => {
      const data = payload.payload;
      if (data && data.slot) {
        MesaReactions.showBubble(data.slot, data.faceKey || data.emoji);
      }
    });

    // 3. WebSocket Broadcast de Rolagem de Dados no Palco Central
    this.channel.on('broadcast', { event: 'dice_roll' }, (payload) => {
      const data = payload.payload;
      if (data) {
        MesaDice.playRollAnimation(data);
      }
    });

    // 4. WebSocket Broadcast de Transmissão de Mídia do Mestre (DeskRPG)
    this.channel.on('broadcast', { event: 'media_sync' }, (payload) => {
      const data = payload.payload;
      if (data && typeof MesaMediaPlayer !== 'undefined') {
        MesaMediaPlayer.handleIncomingSync(data);
      }
    });

    // 5. Postgres Changes para novas mensagens gravadas
    this.channel.on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'mensagens_chat' }, (payload) => {
      const msg = payload.new;
      this.receiveMessage({
        id: msg.id,
        sender_name: msg.sender_name,
        is_master: msg.is_master,
        content: msg.content,
        created_at: msg.created_at,
        token: msg.sender_token
      });
    });

    this.channel.subscribe();
  },

  async fetchMessages() {
    if (!MesaApp.supabase) return;

    try {
      const { data, error } = await MesaApp.supabase
        .from('mensagens_chat')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(60);

      if (data && data.length > 0) {
        this.messages = data.map(m => ({
          id: m.id,
          sender_name: m.sender_name,
          is_master: m.is_master,
          content: m.content,
          created_at: m.created_at,
          token: m.sender_token
        }));
        this.renderMessages();
      }
    } catch(err) {
      console.warn("Aviso na tabela mensagens_chat:", err);
    }
  },

  receiveMessage(msg) {
    if (!msg || !msg.content) return;
    
    // Evita duplicatas se já renderizado via broadcast ou optimistic UI
    if (this.messages.some(m => m.id === msg.id || (m.tempId && m.tempId === msg.tempId))) {
      return;
    }

    this.messages.push(msg);
    this.renderSingleMessage(msg);
    this.scrollToBottom();

    if (!this.isOpen) {
      const badge = document.getElementById('chat-unread-badge');
      if (badge) badge.style.display = 'inline-block';
    }
  },

  renderMessages() {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    container.innerHTML = `<div class="chat-system-notice">Conectado ao canal em tempo real da mesa.</div>`;
    this.messages.forEach(msg => {
      this.renderSingleMessage(msg, false);
    });
    this.scrollToBottom();
  },

  renderSingleMessage(msg, scroll = true) {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    const sender = this.getCurrentSender();
    const isMe = (msg.token && sender.token && msg.token.toUpperCase() === sender.token.toUpperCase()) || 
                 (msg.is_master && sender.isMaster) ||
                 (msg.sender_name === sender.name);

    const timeStr = msg.created_at ? new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const msgEl = document.createElement('div');
    msgEl.className = `chat-msg-row ${isMe ? 'is-me' : ''} ${msg.is_master ? 'is-master' : ''}`;
    msgEl.innerHTML = `
      <div class="chat-msg-meta">
        <span class="chat-msg-sender">${this.escapeHtml(msg.sender_name)}</span>
        <span class="chat-msg-time">${timeStr}</span>
      </div>
      <div class="chat-msg-bubble">${this.escapeHtml(msg.content)}</div>
    `;

    container.appendChild(msgEl);
    if (scroll) this.scrollToBottom();
  },

  scrollToBottom() {
    const container = document.getElementById('chat-messages-container');
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  },

  escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  },

  async handleSubmit(e) {
    if (e) e.preventDefault();
    const input = document.getElementById('chat-message-input');
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    input.value = '';

    const sender = this.getCurrentSender();
    const tempId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);

    const msgPayload = {
      id: tempId,
      tempId: tempId,
      sender_name: sender.name,
      sender_token: sender.token,
      is_master: sender.isMaster,
      content: text,
      created_at: new Date().toISOString()
    };

    // 1. Optimistic UI (Aparece instantaneamente para o usuário sem esperar a rede)
    this.receiveMessage(msgPayload);

    // 2. Broadcast ultra-rápido via WebSocket para todos os jogadores na sala
    if (this.channel) {
      this.channel.send({
        type: 'broadcast',
        event: 'chat_msg',
        payload: msgPayload
      });
    }

    // 3. Persistência assíncrona no Supabase
    if (MesaApp.supabase) {
      try {
        await MesaApp.supabase
          .from('mensagens_chat')
          .insert({
            sender_name: sender.name,
            sender_token: sender.token,
            is_master: sender.isMaster,
            content: text
          });
      } catch(err) {
        console.warn("Erro ao gravar mensagem:", err);
      }
    }
  }
};


// ---- 5. MOTOR DE REAÇÕES DE EMOJIS EM PIXEL ART & BALÕES DE FALA COMIC ----
const PIXEL_FACES_SVG = {
  smile: `<svg class="pixel-face-svg" viewBox="0 0 16 16"><rect x="4" y="1" width="8" height="14" fill="#facc15"/><rect x="2" y="2" width="12" height="12" fill="#facc15"/><rect x="1" y="4" width="14" height="8" fill="#facc15"/><rect x="4" y="0" width="8" height="1" fill="#000"/><rect x="4" y="15" width="8" height="1" fill="#000"/><rect x="0" y="4" width="1" height="8" fill="#000"/><rect x="15" y="4" width="1" height="8" fill="#000"/><rect x="2" y="1" width="2" height="1" fill="#000"/><rect x="12" y="1" width="2" height="1" fill="#000"/><rect x="1" y="2" width="1" height="2" fill="#000"/><rect x="14" y="2" width="1" height="2" fill="#000"/><rect x="1" y="12" width="1" height="2" fill="#000"/><rect x="14" y="12" width="1" height="2" fill="#000"/><rect x="2" y="14" width="2" height="1" fill="#000"/><rect x="12" y="14" width="2" height="1" fill="#000"/><rect x="4" y="5" width="2" height="3" fill="#000"/><rect x="10" y="5" width="2" height="3" fill="#000"/><rect x="4" y="10" width="1" height="1" fill="#000"/><rect x="11" y="10" width="1" height="1" fill="#000"/><rect x="5" y="11" width="6" height="1" fill="#000"/></svg>`,
  
  laugh: `<svg class="pixel-face-svg" viewBox="0 0 16 16"><rect x="4" y="1" width="8" height="14" fill="#facc15"/><rect x="2" y="2" width="12" height="12" fill="#facc15"/><rect x="1" y="4" width="14" height="8" fill="#facc15"/><rect x="4" y="0" width="8" height="1" fill="#000"/><rect x="4" y="15" width="8" height="1" fill="#000"/><rect x="0" y="4" width="1" height="8" fill="#000"/><rect x="15" y="4" width="1" height="8" fill="#000"/><rect x="2" y="1" width="2" height="1" fill="#000"/><rect x="12" y="1" width="2" height="1" fill="#000"/><rect x="1" y="2" width="1" height="2" fill="#000"/><rect x="14" y="2" width="1" height="2" fill="#000"/><rect x="1" y="12" width="1" height="2" fill="#000"/><rect x="14" y="12" width="1" height="2" fill="#000"/><rect x="2" y="14" width="2" height="1" fill="#000"/><rect x="12" y="14" width="2" height="1" fill="#000"/><rect x="4" y="5" width="2" height="1" fill="#000"/><rect x="3" y="6" width="1" height="1" fill="#000"/><rect x="10" y="5" width="2" height="1" fill="#000"/><rect x="12" y="6" width="1" height="1" fill="#000"/><rect x="4" y="9" width="8" height="3" fill="#000"/><rect x="5" y="12" width="6" height="1" fill="#000"/><rect x="6" y="10" width="4" height="2" fill="#ef4444"/></svg>`,

  shock: `<svg class="pixel-face-svg" viewBox="0 0 16 16"><rect x="4" y="1" width="8" height="14" fill="#facc15"/><rect x="2" y="2" width="12" height="12" fill="#facc15"/><rect x="1" y="4" width="14" height="8" fill="#facc15"/><rect x="4" y="0" width="8" height="1" fill="#000"/><rect x="4" y="15" width="8" height="1" fill="#000"/><rect x="0" y="4" width="1" height="8" fill="#000"/><rect x="15" y="4" width="1" height="8" fill="#000"/><rect x="2" y="1" width="2" height="1" fill="#000"/><rect x="12" y="1" width="2" height="1" fill="#000"/><rect x="1" y="2" width="1" height="2" fill="#000"/><rect x="14" y="2" width="1" height="2" fill="#000"/><rect x="1" y="12" width="1" height="2" fill="#000"/><rect x="14" y="12" width="1" height="2" fill="#000"/><rect x="2" y="14" width="2" height="1" fill="#000"/><rect x="12" y="14" width="2" height="1" fill="#000"/><rect x="3" y="4" width="3" height="3" fill="#000"/><rect x="10" y="4" width="3" height="3" fill="#000"/><rect x="4" y="5" width="1" height="1" fill="#fff"/><rect x="11" y="5" width="1" height="1" fill="#fff"/><rect x="6" y="9" width="4" height="4" fill="#000"/></svg>`,

  angry: `<svg class="pixel-face-svg" viewBox="0 0 16 16"><rect x="4" y="1" width="8" height="14" fill="#ef4444"/><rect x="2" y="2" width="12" height="12" fill="#ef4444"/><rect x="1" y="4" width="14" height="8" fill="#ef4444"/><rect x="4" y="0" width="8" height="1" fill="#000"/><rect x="4" y="15" width="8" height="1" fill="#000"/><rect x="0" y="4" width="1" height="8" fill="#000"/><rect x="15" y="4" width="1" height="8" fill="#000"/><rect x="2" y="1" width="2" height="1" fill="#000"/><rect x="12" y="1" width="2" height="1" fill="#000"/><rect x="1" y="2" width="1" height="2" fill="#000"/><rect x="14" y="2" width="1" height="2" fill="#000"/><rect x="1" y="12" width="1" height="2" fill="#000"/><rect x="14" y="12" width="1" height="2" fill="#000"/><rect x="2" y="14" width="2" height="1" fill="#000"/><rect x="12" y="14" width="2" height="1" fill="#000"/><rect x="3" y="4" width="2" height="1" fill="#000"/><rect x="5" y="5" width="2" height="1" fill="#000"/><rect x="11" y="4" width="2" height="1" fill="#000"/><rect x="9" y="5" width="2" height="1" fill="#000"/><rect x="4" y="6" width="2" height="2" fill="#000"/><rect x="10" y="6" width="2" height="2" fill="#000"/><rect x="5" y="11" width="6" height="1" fill="#000"/><rect x="4" y="12" width="1" height="1" fill="#000"/><rect x="11" y="12" width="1" height="1" fill="#000"/></svg>`,

  cool: `<svg class="pixel-face-svg" viewBox="0 0 16 16"><rect x="4" y="1" width="8" height="14" fill="#facc15"/><rect x="2" y="2" width="12" height="12" fill="#facc15"/><rect x="1" y="4" width="14" height="8" fill="#facc15"/><rect x="4" y="0" width="8" height="1" fill="#000"/><rect x="4" y="15" width="8" height="1" fill="#000"/><rect x="0" y="4" width="1" height="8" fill="#000"/><rect x="15" y="4" width="1" height="8" fill="#000"/><rect x="2" y="1" width="2" height="1" fill="#000"/><rect x="12" y="1" width="2" height="1" fill="#000"/><rect x="1" y="2" width="1" height="2" fill="#000"/><rect x="14" y="2" width="1" height="2" fill="#000"/><rect x="1" y="12" width="1" height="2" fill="#000"/><rect x="14" y="12" width="1" height="2" fill="#000"/><rect x="2" y="14" width="2" height="1" fill="#000"/><rect x="12" y="14" width="2" height="1" fill="#000"/><rect x="2" y="5" width="12" height="3" fill="#000"/><rect x="3" y="8" width="4" height="1" fill="#000"/><rect x="9" y="8" width="4" height="1" fill="#000"/><rect x="3" y="6" width="1" height="1" fill="#fff"/><rect x="9" y="6" width="1" height="1" fill="#fff"/><rect x="5" y="11" width="6" height="1" fill="#000"/><rect x="11" y="10" width="1" height="1" fill="#000"/></svg>`,

  dead: `<svg class="pixel-face-svg" viewBox="0 0 16 16"><rect x="4" y="1" width="8" height="14" fill="#a3a3a3"/><rect x="2" y="2" width="12" height="12" fill="#a3a3a3"/><rect x="1" y="4" width="14" height="8" fill="#a3a3a3"/><rect x="4" y="0" width="8" height="1" fill="#000"/><rect x="4" y="15" width="8" height="1" fill="#000"/><rect x="0" y="4" width="1" height="8" fill="#000"/><rect x="15" y="4" width="1" height="8" fill="#000"/><rect x="2" y="1" width="2" height="1" fill="#000"/><rect x="12" y="1" width="2" height="1" fill="#000"/><rect x="1" y="2" width="1" height="2" fill="#000"/><rect x="14" y="2" width="1" height="2" fill="#000"/><rect x="1" y="12" width="1" height="2" fill="#000"/><rect x="14" y="12" width="1" height="2" fill="#000"/><rect x="2" y="14" width="2" height="1" fill="#000"/><rect x="12" y="14" width="2" height="1" fill="#000"/><rect x="3" y="4" width="1" height="1" fill="#000"/><rect x="5" y="4" width="1" height="1" fill="#000"/><rect x="4" y="5" width="1" height="1" fill="#000"/><rect x="3" y="6" width="1" height="1" fill="#000"/><rect x="5" y="6" width="1" height="1" fill="#000"/><rect x="10" y="4" width="1" height="1" fill="#000"/><rect x="12" y="4" width="1" height="1" fill="#000"/><rect x="11" y="5" width="1" height="1" fill="#000"/><rect x="10" y="6" width="1" height="1" fill="#000"/><rect x="12" y="6" width="1" height="1" fill="#000"/><rect x="4" y="10" width="8" height="1" fill="#000"/><rect x="8" y="11" width="3" height="3" fill="#f43f5e"/></svg>`,

  crying: `<svg class="pixel-face-svg" viewBox="0 0 16 16"><rect x="4" y="1" width="8" height="14" fill="#facc15"/><rect x="2" y="2" width="12" height="12" fill="#facc15"/><rect x="1" y="4" width="14" height="8" fill="#facc15"/><rect x="4" y="0" width="8" height="1" fill="#000"/><rect x="4" y="15" width="8" height="1" fill="#000"/><rect x="0" y="4" width="1" height="8" fill="#000"/><rect x="15" y="4" width="1" height="8" fill="#000"/><rect x="2" y="1" width="2" height="1" fill="#000"/><rect x="12" y="1" width="2" height="1" fill="#000"/><rect x="1" y="2" width="1" height="2" fill="#000"/><rect x="14" y="2" width="1" height="2" fill="#000"/><rect x="1" y="12" width="1" height="2" fill="#000"/><rect x="14" y="12" width="1" height="2" fill="#000"/><rect x="2" y="14" width="2" height="1" fill="#000"/><rect x="12" y="14" width="2" height="1" fill="#000"/><rect x="4" y="4" width="2" height="2" fill="#000"/><rect x="10" y="4" width="2" height="2" fill="#000"/><rect x="3" y="6" width="2" height="5" fill="#38bdf8"/><rect x="11" y="6" width="2" height="5" fill="#38bdf8"/><rect x="5" y="12" width="6" height="1" fill="#000"/><rect x="4" y="13" width="1" height="1" fill="#000"/><rect x="11" y="13" width="1" height="1" fill="#000"/></svg>`,

  wink: `<svg class="pixel-face-svg" viewBox="0 0 16 16"><rect x="4" y="1" width="8" height="14" fill="#facc15"/><rect x="2" y="2" width="12" height="12" fill="#facc15"/><rect x="1" y="4" width="14" height="8" fill="#facc15"/><rect x="4" y="0" width="8" height="1" fill="#000"/><rect x="4" y="15" width="8" height="1" fill="#000"/><rect x="0" y="4" width="1" height="8" fill="#000"/><rect x="15" y="4" width="1" height="8" fill="#000"/><rect x="2" y="1" width="2" height="1" fill="#000"/><rect x="12" y="1" width="2" height="1" fill="#000"/><rect x="1" y="2" width="1" height="2" fill="#000"/><rect x="14" y="2" width="1" height="2" fill="#000"/><rect x="1" y="12" width="1" height="2" fill="#000"/><rect x="14" y="12" width="1" height="2" fill="#000"/><rect x="2" y="14" width="2" height="1" fill="#000"/><rect x="12" y="14" width="2" height="1" fill="#000"/><rect x="3" y="5" width="3" height="1" fill="#000"/><rect x="10" y="4" width="2" height="3" fill="#000"/><rect x="4" y="10" width="1" height="1" fill="#000"/><rect x="11" y="10" width="1" height="1" fill="#000"/><rect x="5" y="11" width="6" height="1" fill="#000"/></svg>`,

  smirk: `<svg class="pixel-face-svg" viewBox="0 0 16 16"><rect x="4" y="1" width="8" height="14" fill="#facc15"/><rect x="2" y="2" width="12" height="12" fill="#facc15"/><rect x="1" y="4" width="14" height="8" fill="#facc15"/><rect x="4" y="0" width="8" height="1" fill="#000"/><rect x="4" y="15" width="8" height="1" fill="#000"/><rect x="0" y="4" width="1" height="8" fill="#000"/><rect x="15" y="4" width="1" height="8" fill="#000"/><rect x="2" y="1" width="2" height="1" fill="#000"/><rect x="12" y="1" width="2" height="1" fill="#000"/><rect x="1" y="2" width="1" height="2" fill="#000"/><rect x="14" y="2" width="1" height="2" fill="#000"/><rect x="1" y="12" width="1" height="2" fill="#000"/><rect x="14" y="12" width="1" height="2" fill="#000"/><rect x="2" y="14" width="2" height="1" fill="#000"/><rect x="12" y="14" width="2" height="1" fill="#000"/><rect x="3" y="5" width="3" height="1" fill="#000"/><rect x="9" y="5" width="3" height="1" fill="#000"/><rect x="5" y="6" width="1" height="1" fill="#000"/><rect x="11" y="6" width="1" height="1" fill="#000"/><rect x="7" y="10" width="4" height="1" fill="#000"/><rect x="11" y="9" width="1" height="1" fill="#000"/></svg>`,

  thinking: `<svg class="pixel-face-svg" viewBox="0 0 16 16"><rect x="4" y="1" width="8" height="14" fill="#facc15"/><rect x="2" y="2" width="12" height="12" fill="#facc15"/><rect x="1" y="4" width="14" height="8" fill="#facc15"/><rect x="4" y="0" width="8" height="1" fill="#000"/><rect x="4" y="15" width="8" height="1" fill="#000"/><rect x="0" y="4" width="1" height="8" fill="#000"/><rect x="15" y="4" width="1" height="8" fill="#000"/><rect x="2" y="1" width="2" height="1" fill="#000"/><rect x="12" y="1" width="2" height="1" fill="#000"/><rect x="1" y="2" width="1" height="2" fill="#000"/><rect x="14" y="2" width="1" height="2" fill="#000"/><rect x="1" y="12" width="1" height="2" fill="#000"/><rect x="14" y="12" width="1" height="2" fill="#000"/><rect x="2" y="14" width="2" height="1" fill="#000"/><rect x="12" y="14" width="2" height="1" fill="#000"/><rect x="4" y="4" width="2" height="1" fill="#000"/><rect x="10" y="5" width="2" height="1" fill="#000"/><rect x="4" y="6" width="2" height="2" fill="#000"/><rect x="10" y="6" width="2" height="2" fill="#000"/><rect x="5" y="11" width="5" height="1" fill="#000"/></svg>`
};

const MesaReactions = {
  isPickerOpen: false,

  init() {
    this.renderPickerGrid();

    // Fecha a paleta ao clicar fora
    document.addEventListener('click', (e) => {
      const picker = document.getElementById('mesa-reaction-picker');
      const btn = document.getElementById('nav-reaction-btn');
      if (picker && this.isPickerOpen && !picker.contains(e.target) && !btn.contains(e.target)) {
        this.closePicker();
      }
    });
  },

  renderPickerGrid() {
    const grid = document.getElementById('reaction-picker-grid');
    if (!grid) return;

    grid.innerHTML = '';
    Object.keys(PIXEL_FACES_SVG).forEach(key => {
      const btn = document.createElement('button');
      btn.className = 'reaction-btn';
      btn.title = key;
      btn.innerHTML = PIXEL_FACES_SVG[key];
      btn.onclick = () => this.sendReaction(key);
      grid.appendChild(btn);
    });
  },

  togglePicker() {
    if (!MesaApp.state.myToken && !MesaApp.state.isMaster) {
      alert("Observadores não podem usar reações de emojis. Conecte seu token de personagem para reagir na mesa!");
      MesaApp.openTokenModal();
      return;
    }

    this.isPickerOpen = !this.isPickerOpen;
    const picker = document.getElementById('mesa-reaction-picker');
    if (picker) {
      if (this.isPickerOpen) {
        picker.classList.add('active');
      } else {
        picker.classList.remove('active');
      }
    }
  },

  closePicker() {
    this.isPickerOpen = false;
    const picker = document.getElementById('mesa-reaction-picker');
    if (picker) picker.classList.remove('active');
  },

  sendReaction(faceKey) {
    this.closePicker();

    if (!MesaApp.state.myToken && !MesaApp.state.isMaster) {
      alert("Observadores não podem usar reações de emojis. Conecte seu token de personagem!");
      MesaApp.openTokenModal();
      return;
    }

    // Determina o slot do jogador atual
    let targetSlot = null;

    if (MesaApp.state.myToken && !MesaApp.state.isMaster) {
      const myChar = MesaApp.state.players.find(p => p && p.token && p.token.toUpperCase() === MesaApp.state.myToken.toUpperCase());
      if (myChar) {
        targetSlot = myChar.slot;
      }
    } else if (MesaApp.state.isMaster) {
      // Se for Mestre, reage no personagem ativo ou no primeiro disponível
      if (MesaApp.state.activeViewingPlayer) {
        targetSlot = MesaApp.state.activeViewingPlayer.slot;
      } else {
        const firstOccupied = MesaApp.state.players.find(p => p !== null);
        targetSlot = firstOccupied ? firstOccupied.slot : 1;
      }
    }

    if (!targetSlot) {
      alert("Conecte um token de personagem para enviar reações no seu card!");
      MesaApp.openTokenModal();
      return;
    }

    // 1. Exibe instantaneamente no card local
    this.showBubble(targetSlot, faceKey);

    // 2. Transmite via WebSocket Broadcast para todos os jogadores na sala
    if (MesaChat.channel) {
      MesaChat.channel.send({
        type: 'broadcast',
        event: 'player_reaction',
        payload: { slot: targetSlot, faceKey: faceKey }
      });
    }
  },

  showBubble(slot, faceKey) {
    const slotEl = document.querySelector(`.player-slot.slot-${slot}`);
    const board = document.getElementById('mesa-board-container');
    if (!slotEl || !board) return;

    // Remove qualquer balão anterior no mesmo slot
    const existing = document.getElementById(`comic-bubble-slot-${slot}`);
    if (existing) existing.remove();

    const svgContent = PIXEL_FACES_SVG[faceKey] || PIXEL_FACES_SVG.smile;

    // Obtém dimensões relativas exatas ao container da mesa
    const slotRect = slotEl.getBoundingClientRect();
    const boardRect = board.getBoundingClientRect();

    const bubble = document.createElement('div');
    bubble.id = `comic-bubble-slot-${slot}`;
    bubble.className = 'comic-speech-bubble';
    bubble.innerHTML = svgContent;

    // Se o slot estiver na metade direita da mesa, coloca o balão fora à esquerda do card; senão coloca à direita.
    const isRightSide = (slotRect.left + slotRect.width / 2) > (boardRect.left + boardRect.width / 2);

    let leftPos, topPos;
    if (isRightSide) {
      bubble.classList.add('bubble-pointing-right');
      leftPos = (slotRect.left - boardRect.left) - 75; // totalmente fora, à esquerda do card
      topPos = (slotRect.top - boardRect.top) + 16;
    } else {
      bubble.classList.add('bubble-pointing-left');
      leftPos = (slotRect.right - boardRect.left) + 16; // totalmente fora, à direita do card
      topPos = (slotRect.top - boardRect.top) + 16;
    }

    bubble.style.position = 'absolute';
    bubble.style.left = `${Math.round(leftPos)}px`;
    bubble.style.top = `${Math.round(topPos)}px`;

    board.appendChild(bubble);

    // Animação de saída e remoção automática após ~3.5s
    setTimeout(() => {
      if (bubble.parentNode) {
        bubble.classList.add('fade-out');
      }
    }, 3200);

    setTimeout(() => {
      if (bubble.parentNode) {
        bubble.remove();
      }
    }, 3600);
  }
};


// ---- 6. MOTOR DE ROLAGEM DE DADOS COM ALEATORIEDADE CRIPTOGRÁFICA (CSPRNG) ----
const MesaDice = {
  selectedDice: [20], // padrão inicial: 1d20
  modifier: 0,
  isRolling: false,
  rollTimeout: null,

  init() {
    this.renderSelectedList();
  },

  // Gerador Criptograficamente Seguro de Números Aleatórios (CSPRNG - sem viés de módulo)
  cryptoRandomInt(min, max) {
    const range = max - min + 1;
    const maxUint32 = 0xFFFFFFFF;
    const limit = maxUint32 - (maxUint32 % range);
    const array = new Uint32Array(1);

    let randomVal;
    do {
      window.crypto.getRandomValues(array);
      randomVal = array[0];
    } while (randomVal >= limit);

    return min + (randomVal % range);
  },

  openModal() {
    if (!MesaApp.state.myToken && !MesaApp.state.isMaster) {
      alert("Observadores não podem rolar dados. Conecte seu token de personagem para rolar dados na mesa!");
      MesaApp.openTokenModal();
      return;
    }
    MesaApp.openModal('dice-modal');
    this.renderSelectedList();
  },

  addDie(sides) {
    if (this.selectedDice.length >= 8) {
      alert("Limite de 8 dados por rolagem atingido.");
      return;
    }
    this.selectedDice.push(sides);
    this.renderSelectedList();
  },

  removeDie(index) {
    this.selectedDice.splice(index, 1);
    this.renderSelectedList();
  },

  clearPool() {
    this.selectedDice = [];
    this.modifier = 0;
    const modInput = document.getElementById('dice-modifier-input');
    if (modInput) modInput.value = 0;
    this.renderSelectedList();
  },

  adjustModifier(delta) {
    this.modifier += delta;
    const modInput = document.getElementById('dice-modifier-input');
    if (modInput) modInput.value = this.modifier;
    this.updateRollButtonLabel();
  },

  setModifier(val) {
    const parsed = parseInt(val, 10);
    this.modifier = isNaN(parsed) ? 0 : parsed;
    this.updateRollButtonLabel();
  },

  renderSelectedList() {
    const container = document.getElementById('dice-selected-list');
    if (!container) return;

    if (this.selectedDice.length === 0) {
      container.innerHTML = `<span class="dice-empty-hint">Nenhum dado selecionado (clique nos botões de dados acima)</span>`;
    } else {
      container.innerHTML = this.selectedDice.map((sides, idx) => `
        <span class="selected-die-badge">
          d${sides}
          <button class="remove-die-btn" onclick="MesaDice.removeDie(${idx})" title="Remover">&times;</button>
        </span>
      `).join('');
    }

    this.updateRollButtonLabel();
  },

  updateRollButtonLabel() {
    const btn = document.getElementById('dice-roll-execute-btn');
    if (!btn) return;

    if (this.selectedDice.length === 0) {
      btn.textContent = 'SELECIONE AO MENOS 1 DADO';
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
      return;
    }

    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';

    // Agrupa dados para exibição (ex: 2d12 + 1d4)
    const counts = {};
    this.selectedDice.forEach(s => counts[s] = (counts[s] || 0) + 1);
    const diceStr = Object.keys(counts).map(s => `${counts[s]}d${s}`).join(' + ');

    const modStr = this.modifier > 0 ? ` + ${this.modifier}` : (this.modifier < 0 ? ` - ${Math.abs(this.modifier)}` : '');
    btn.textContent = `ROLAR (${diceStr}${modStr})`;
  },

  executeRoll() {
    if (!MesaApp.state.myToken && !MesaApp.state.isMaster) {
      alert("Observadores não podem rolar dados.");
      return;
    }

    if (this.selectedDice.length === 0) return;

    MesaApp.closeModal('dice-modal');

    // 1. Gera resultados criptograficamente seguros para cada dado
    const diceResults = this.selectedDice.map(sides => ({
      sides: sides,
      val: this.cryptoRandomInt(1, sides)
    }));

    const diceSum = diceResults.reduce((acc, d) => acc + d.val, 0);
    const total = diceSum + this.modifier;

    const sender = MesaChat.getCurrentSender();

    const rollPayload = {
      rollerName: sender.name,
      isMaster: sender.isMaster,
      results: diceResults,
      modifier: this.modifier,
      total: total
    };

    // 2. Executa a animação no quadrado preto central
    this.playRollAnimation(rollPayload);

    // 3. Transmite para todos os jogadores na mesa em tempo real via WebSocket
    if (MesaChat.channel) {
      MesaChat.channel.send({
        type: 'broadcast',
        event: 'dice_roll',
        payload: rollPayload
      });
    }

    // 4. Log no chat da mesa
    const breakdown = diceResults.map(d => `[d${d.sides}: ${d.val}]`).join(' + ');
    const modStr = this.modifier !== 0 ? (this.modifier > 0 ? ` + ${this.modifier}` : ` - ${Math.abs(this.modifier)}`) : '';
    const chatContent = `🎲 Rolou ${breakdown}${modStr} ➔ Total: ${total}`;

    MesaChat.receiveMessage({
      id: 'dice_' + Date.now(),
      sender_name: sender.name,
      is_master: sender.isMaster,
      content: chatContent,
      created_at: new Date().toISOString()
    });
  },

  playRollAnimation(data) {
    const stage = document.getElementById('dice-stage');
    if (!stage) return;

    if (this.rollTimeout) clearTimeout(this.rollTimeout);

    stage.classList.add('active');

    // Monta a arena de rolagem
    stage.innerHTML = `
      <div class="dice-roller-badge ${data.isMaster ? 'is-master' : ''}">
        ${data.rollerName} está rolando...
      </div>
      <div class="dice-tumbling-arena">
        ${data.results.map((d, i) => `
          <div id="dice-box-${i}" class="dice-tumble-box rolling">
            <span class="dice-tumble-type">d${d.sides}</span>
            <span id="dice-val-${i}" class="dice-tumble-val">?</span>
          </div>
        `).join('')}
      </div>
      <div id="dice-total-box" class="dice-total-banner" style="display:none;"></div>
    `;

    // Animação de números girando em alta velocidade por 1.2 segundos
    const interval = setInterval(() => {
      data.results.forEach((d, i) => {
        const valEl = document.getElementById(`dice-val-${i}`);
        if (valEl) {
          valEl.textContent = this.cryptoRandomInt(1, d.sides);
        }
      });
    }, 45);

    // Para a animação e bate o valor real criptográfico
    setTimeout(() => {
      clearInterval(interval);

      data.results.forEach((d, i) => {
        const box = document.getElementById(`dice-box-${i}`);
        const valEl = document.getElementById(`dice-val-${i}`);
        if (box && valEl) {
          box.classList.remove('rolling');
          box.classList.add('settled');
          valEl.textContent = d.val;
        }
      });

      // Exibe o total final e detalhamento
      const totalBox = document.getElementById('dice-total-box');
      if (totalBox) {
        const breakdownStr = data.results.map(d => `d${d.sides}(${d.val})`).join(' + ');
        const modStr = data.modifier !== 0 ? (data.modifier > 0 ? ` + ${data.modifier}` : ` - ${Math.abs(data.modifier)}`) : '';

        totalBox.style.display = 'flex';
        totalBox.innerHTML = `
          <span class="dice-breakdown-text">${breakdownStr}${modStr}</span>
          <span class="dice-grand-total">${data.total}</span>
        `;
      }
    }, 1200);

    // Mantém na tela e retorna suavemente ao estado de repouso após 5.5s
    this.rollTimeout = setTimeout(() => {
      stage.classList.remove('active');
      stage.innerHTML = '';
    }, 5500);
  }
};


// ---- 7. MOTOR DE TRANSMISSÃO DE MÍDIA DO MESTRE (INTEGRAÇÃO COMPLETA DESKRPG) ----
const MesaMediaPlayer = {
  isMasterUnlocked: false,
  isDrawerOpen: false,
  activeTab: 'video', // 'video' | 'slideshow'
  
  // Estado de Transmissão & Blackout
  isTransmitting: false,
  isBlackout: false,
  transitionSpeed: '0.8s',

  // Playlist de Vídeos
  videoPlaylist: [],
  currentVideoIndex: -1,
  isPlaying: false,
  volume: 1,
  isSeeking: false,

  // Estação de Loop A-B
  pointA: 0,
  pointB: 0,
  isLoopActive: false,

  // Galeria de Slides (Imagens)
  imagePlaylist: [],
  currentImageIndex: -1,

  init() {
    this.updateMasterVisibility();
    this.setupListeners();
    this.setupDropZones();
  },

  updateMasterVisibility() {
    const btn = document.getElementById('nav-master-media-btn');
    if (btn) {
      if (MesaApp.state.isMaster) {
        btn.style.display = 'inline-flex';
        this.isMasterUnlocked = true;
      } else {
        btn.style.display = 'none';
        this.isMasterUnlocked = false;
        if (this.isDrawerOpen) this.toggleDrawer();
      }
    }
  },

  toggleDrawer() {
    if (!MesaApp.state.isMaster) return;
    this.isDrawerOpen = !this.isDrawerOpen;
    const drawer = document.getElementById('master-media-drawer');
    if (drawer) {
      if (this.isDrawerOpen) {
        drawer.classList.add('active');
        document.body.classList.add('mp-drawer-open');
      } else {
        drawer.classList.remove('active');
        document.body.classList.remove('mp-drawer-open');
      }
    }
  },

  switchTab(tab) {
    this.activeTab = tab;
    
    // Abas de navegação
    document.querySelectorAll('.adm-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.adm-tab-content').forEach(view => view.classList.remove('active'));

    const tabBtn = document.getElementById(`adm-tab-${tab}`);
    const tabView = document.getElementById(`adm-view-${tab}`);
    if (tabBtn) tabBtn.classList.add('active');
    if (tabView) tabView.classList.add('active');

    // Se estiver transmitindo ao vivo, atualiza o palco para a aba ativa
    if (this.isTransmitting) {
      this.syncLiveDisplay();
    }
  },

  toggleTransmit() {
    this.isTransmitting = !this.isTransmitting;
    const btn = document.getElementById('adm-btn-transmit');
    const statusTag = document.getElementById('adm-status-tag');
    const liveVideo = document.getElementById('adm-live-badge-video');
    const liveImage = document.getElementById('adm-live-badge-image');

    if (this.isTransmitting) {
      if (btn) {
        btn.classList.add('transmitting');
        btn.textContent = 'Transmitindo';
      }
      if (statusTag) {
        statusTag.className = 'adm-status-tag live';
        statusTag.textContent = '● Transmitindo';
      }
      if (liveVideo) liveVideo.style.display = 'block';
      if (liveImage) liveImage.style.display = 'block';
    } else {
      if (btn) {
        btn.classList.remove('transmitting');
        btn.textContent = 'Transmitir';
      }
      if (statusTag) {
        statusTag.className = 'adm-status-tag inactive';
        statusTag.textContent = '● Inativo';
      }
      if (liveVideo) liveVideo.style.display = 'none';
      if (liveImage) liveImage.style.display = 'none';
    }

    this.syncLiveDisplay();
  },

  toggleBlackout() {
    this.isBlackout = !this.isBlackout;
    const btn = document.getElementById('adm-btn-blackout');
    if (btn) {
      if (this.isBlackout) btn.classList.add('active');
      else btn.classList.remove('active');
    }
    this.syncLiveDisplay();
  },

  setTransition(speed) {
    this.transitionSpeed = speed;
    this.syncLiveDisplay();
  },

  // ---- 1. GERENCIADOR DE VÍDEOS & ÁUDIOS ----
  setupListeners() {
    const video = document.getElementById('adm-preview-video');
    const timeline = document.getElementById('adm-video-timeline');
    const timeDisplay = document.getElementById('adm-video-time');

    if (video) {
      video.addEventListener('timeupdate', () => {
        if (!this.isSeeking && video.duration > 0) {
          if (timeline) {
            timeline.value = (video.currentTime / video.duration) * 100;
          }
          if (timeDisplay) {
            timeDisplay.textContent = `${this.formatTime(video.currentTime)} / ${this.formatTime(video.duration)}`;
          }
        }

        // Estação de Loop A-B
        if (this.isLoopActive && this.pointB > this.pointA) {
          if (video.currentTime >= this.pointB) {
            video.currentTime = this.pointA;
            video.play().catch(() => {});
          }
        }
      });

      video.addEventListener('ended', () => {
        if (this.isLoopActive) {
          video.currentTime = this.pointA;
          video.play().catch(() => {});
        } else {
          this.nextVideo();
        }
      });
    }
  },

  setupDropZones() {
    // Dropzone Vídeos
    const dropVideo = document.getElementById('adm-video-dropzone');
    if (dropVideo) {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
        dropVideo.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); });
      });
      dropVideo.addEventListener('dragenter', () => dropVideo.classList.add('drag-over'));
      dropVideo.addEventListener('dragover', () => dropVideo.classList.add('drag-over'));
      dropVideo.addEventListener('dragleave', () => dropVideo.classList.remove('drag-over'));
      dropVideo.addEventListener('drop', e => {
        dropVideo.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('video/') || f.type.startsWith('audio/'));
        if (files.length > 0) this.addVideos(files);
      });
      dropVideo.addEventListener('click', () => document.getElementById('adm-video-input').click());
    }

    // Dropzone Imagens
    const dropImage = document.getElementById('adm-image-dropzone');
    if (dropImage) {
      ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => {
        dropImage.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); });
      });
      dropImage.addEventListener('dragenter', () => dropImage.classList.add('drag-over'));
      dropImage.addEventListener('dragover', () => dropImage.classList.add('drag-over'));
      dropImage.addEventListener('dragleave', () => dropImage.classList.remove('drag-over'));
      dropImage.addEventListener('drop', e => {
        dropImage.classList.remove('drag-over');
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length > 0) this.addImages(files);
      });
      dropImage.addEventListener('click', () => document.getElementById('adm-image-input').click());
    }
  },

  handleVideoAdd(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0) this.addVideos(files);
  },

  addVideoFromInput() {
    const input = document.getElementById('adm-video-url-input');
    if (!input) return;
    const url = input.value.trim();
    if (!url) {
      alert("Por favor, cole um link válido de vídeo ou áudio.");
      return;
    }

    const name = url.split('/').pop().split('?')[0] || 'Vídeo Online';
    this.videoPlaylist.push({ name: name, url: url });
    input.value = '';
    this.renderVideoPlaylist();
    this.selectVideo(this.videoPlaylist.length - 1);
  },

  promptAddVideoUrl() {
    const url = prompt("Insira o Link / URL direto do vídeo ou áudio (ex: https://.../video.mp4, Catbox, Discord, Streamable, Tenor):");
    if (!url || !url.trim()) return;
    const cleanUrl = url.trim();
    const name = cleanUrl.split('/').pop().split('?')[0] || 'Vídeo Online';
    this.videoPlaylist.push({ name: name, url: cleanUrl });
    this.renderVideoPlaylist();
    if (this.currentVideoIndex === -1 && this.videoPlaylist.length > 0) {
      this.selectVideo(this.videoPlaylist.length - 1);
    }
  },

  // Upload temporário que não polui o banco e se auto-deleta ao remover ou fechar a página
  async uploadTempFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    const fileName = `temp_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;

    // 1. Tenta Supabase Storage
    if (MesaApp.supabase && MesaApp.supabase.storage) {
      try {
        const { data, error } = await MesaApp.supabase.storage
          .from('temp_media')
          .upload(fileName, file, { cacheControl: '3600', upsert: true });

        if (!error && data) {
          const { data: pubData } = MesaApp.supabase.storage
            .from('temp_media')
            .getPublicUrl(fileName);
          if (pubData && pubData.publicUrl) {
            return { url: pubData.publicUrl, storagePath: fileName, provider: 'supabase' };
          }
        }
      } catch (err) {
        console.warn("Supabase storage indisponível:", err);
      }
    }

    // 2. Fallback: Litterbox API (Arquivo temporário que expira e se auto-destrói em 1 hora)
    try {
      const formData = new FormData();
      formData.append('reqtype', 'fileupload');
      formData.append('time', '1h');
      formData.append('fileToUpload', file);

      const res = await fetch('https://litterbox.catbox.moe/resources/internals/api.php', {
        method: 'POST',
        body: formData
      });

      if (res.ok) {
        const url = await res.text();
        if (url && url.startsWith('http')) {
          return { url: url.trim(), provider: 'litterbox' };
        }
      }
    } catch (err) {
      console.warn("Fallback Litterbox temporário falhou:", err);
    }

    return null;
  },

  addVideos(files) {
    Array.from(files).forEach(async file => {
      const localBlob = URL.createObjectURL(file);
      const playlistItem = {
        name: file.name,
        url: localBlob,
        file: file,
        isUploading: true
      };

      this.videoPlaylist.push(playlistItem);
      this.renderVideoPlaylist();
      const itemIndex = this.videoPlaylist.length - 1;
      if (this.currentVideoIndex === -1) {
        this.selectVideo(itemIndex);
      }

      // Upload temporário em segundo plano
      try {
        const res = await this.uploadTempFile(file);
        if (res && res.url) {
          playlistItem.url = res.url;
          playlistItem.storagePath = res.storagePath;
          playlistItem.provider = res.provider;
          playlistItem.isUploading = false;
          this.renderVideoPlaylist();
          if (this.isTransmitting && this.currentVideoIndex === itemIndex) {
            this.syncLiveDisplay();
          }
        } else {
          playlistItem.isUploading = false;
          playlistItem.uploadFailed = true;
          this.renderVideoPlaylist();
        }
      } catch (e) {
        playlistItem.isUploading = false;
        playlistItem.uploadFailed = true;
        this.renderVideoPlaylist();
      }
    });
  },

  renderVideoPlaylist() {
    const list = document.getElementById('adm-video-playlist-list');
    if (!list) return;

    if (this.videoPlaylist.length === 0) {
      list.innerHTML = `<div class="adm-empty-note">Nenhum vídeo na playlist.</div>`;
      return;
    }

    list.innerHTML = this.videoPlaylist.map((item, idx) => `
      <div class="adm-playlist-item ${idx === this.currentVideoIndex ? 'active' : ''}" onclick="MesaMediaPlayer.selectVideo(${idx})">
        <span class="adm-item-name" title="${item.name}">
          ${idx + 1}. ${item.name}
          ${item.isUploading ? '<span style="color:var(--mesa-orange); font-size:0.68rem; margin-left:4px;">⏳ Preparando...</span>' : ''}
          ${item.uploadFailed ? '<span style="color:#ef4444; font-size:0.68rem; margin-left:4px;">(Use +Link)</span>' : ''}
        </span>
        <button class="adm-item-remove" onclick="event.stopPropagation(); MesaMediaPlayer.removeVideo(${idx})">&times;</button>
      </div>
    `).join('');
  },

  async removeVideo(idx) {
    const item = this.videoPlaylist[idx];
    if (item && item.storagePath && MesaApp.supabase && MesaApp.supabase.storage) {
      try {
        await MesaApp.supabase.storage.from('temp_media').remove([item.storagePath]);
      } catch (e) {}
    }

    this.videoPlaylist.splice(idx, 1);
    if (this.currentVideoIndex >= this.videoPlaylist.length) {
      this.currentVideoIndex = this.videoPlaylist.length - 1;
    }
    this.renderVideoPlaylist();
    if (this.currentVideoIndex >= 0) {
      this.selectVideo(this.currentVideoIndex);
    } else {
      const video = document.getElementById('adm-preview-video');
      if (video) { video.src = ''; video.pause(); }
    }
  },

  selectVideo(idx) {
    if (idx < 0 || idx >= this.videoPlaylist.length) return;
    this.currentVideoIndex = idx;
    this.renderVideoPlaylist();

    const item = this.videoPlaylist[idx];
    const video = document.getElementById('adm-preview-video');
    const playBtn = document.getElementById('adm-btn-play');

    if (video) {
      video.src = item.url;
      video.volume = this.volume;
      video.play().then(() => {
        this.isPlaying = true;
        if (playBtn) playBtn.innerHTML = '&#10074;&#10074;';
        if (this.isTransmitting) this.syncLiveDisplay();
      }).catch(e => console.warn(e));
    }
  },

  togglePlay() {
    const video = document.getElementById('adm-preview-video');
    const playBtn = document.getElementById('adm-btn-play');
    if (!video || !video.src) return;

    if (this.isPlaying) {
      video.pause();
      this.isPlaying = false;
      if (playBtn) playBtn.innerHTML = '&#9654;';
    } else {
      video.play().catch(() => {});
      this.isPlaying = true;
      if (playBtn) playBtn.innerHTML = '&#10074;&#10074;';
    }

    if (this.isTransmitting) this.syncLiveDisplay();
  },

  rewindToStart() {
    const video = document.getElementById('adm-preview-video');
    if (video) {
      video.currentTime = this.pointA || 0;
    }
    if (this.isTransmitting) this.syncLiveDisplay();
  },

  handleSeekInput() {
    this.isSeeking = true;
  },

  handleSeekChange() {
    const timeline = document.getElementById('adm-video-timeline');
    const video = document.getElementById('adm-preview-video');
    if (timeline && video && video.duration > 0) {
      video.currentTime = (timeline.value / 100) * video.duration;
      if (this.isTransmitting) this.syncLiveDisplay();
    }
    this.isSeeking = false;
  },

  handleVolumeChange(val) {
    this.volume = parseFloat(val);
    const video = document.getElementById('adm-preview-video');
    if (video) video.volume = this.volume;
    if (this.isTransmitting) this.syncLiveDisplay();
  },

  prevVideo() {
    if (this.videoPlaylist.length === 0) return;
    let prev = this.currentVideoIndex - 1;
    if (prev < 0) prev = this.videoPlaylist.length - 1;
    this.selectVideo(prev);
  },

  nextVideo() {
    if (this.videoPlaylist.length === 0) return;
    let next = this.currentVideoIndex + 1;
    if (next >= this.videoPlaylist.length) next = 0;
    this.selectVideo(next);
  },

  // Loop A-B
  toggleLoopCheckbox(checked) {
    this.isLoopActive = checked;
  },

  markPointA() {
    const video = document.getElementById('adm-preview-video');
    if (video) {
      this.pointA = video.currentTime;
      const el = document.getElementById('adm-point-a-val');
      if (el) el.textContent = this.formatTimePrecise(this.pointA);
    }
  },

  markPointB() {
    const video = document.getElementById('adm-preview-video');
    if (video) {
      this.pointB = video.currentTime;
      const el = document.getElementById('adm-point-b-val');
      if (el) el.textContent = this.formatTimePrecise(this.pointB);
    }
  },

  jumpToPointA() {
    const video = document.getElementById('adm-preview-video');
    if (video) video.currentTime = this.pointA || 0;
  },

  clearLoopPoints() {
    this.pointA = 0;
    this.pointB = 0;
    this.isLoopActive = false;
    const check = document.getElementById('adm-loop-active');
    const elA = document.getElementById('adm-point-a-val');
    const elB = document.getElementById('adm-point-b-val');
    if (check) check.checked = false;
    if (elA) elA.textContent = '00:00.0';
    if (elB) elB.textContent = '00:00.0';
  },

  // ---- 2. COMPARTILHADOR DE IMAGENS (SLIDESHOW) ----
  handleImageAdd(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0) this.addImages(files);
  },

  addImageFromInput() {
    const input = document.getElementById('adm-image-url-input');
    if (!input) return;
    const url = input.value.trim();
    if (!url) {
      alert("Por favor, cole um link válido de imagem.");
      return;
    }

    const name = url.split('/').pop().split('?')[0] || 'Imagem Online';
    this.imagePlaylist.push({ name: name, url: url });
    input.value = '';
    this.renderImagePlaylist();
    this.selectImage(this.imagePlaylist.length - 1);
  },

  promptAddImageUrl() {
    const url = prompt("Insira o Link / URL direto da imagem (ex: https://.../imagem.png/jpg, Imgur, Discord, Tenor):");
    if (!url || !url.trim()) return;
    const cleanUrl = url.trim();
    const name = cleanUrl.split('/').pop().split('?')[0] || 'Imagem Online';
    this.imagePlaylist.push({ name: name, url: cleanUrl });
    this.renderImagePlaylist();
    if (this.currentImageIndex === -1 && this.imagePlaylist.length > 0) {
      this.selectImage(this.imagePlaylist.length - 1);
    }
  },

  // Comprime qualquer imagem local para ~70KB em 20ms e transmite direto via WebSocket sem falhas
  compressImageToDataUrl(file, maxWidth = 1400, maxHeight = 900, quality = 0.82) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth || height > maxHeight) {
            if (width / height > maxWidth / maxHeight) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  },

  async addImages(files) {
    for (const file of Array.from(files)) {
      const dataUrl = await this.compressImageToDataUrl(file);
      if (!dataUrl) continue;

      const playlistItem = {
        name: file.name,
        url: dataUrl,
        file: file
      };

      this.imagePlaylist.push(playlistItem);
      this.renderImagePlaylist();
      if (this.currentImageIndex === -1) {
        this.selectImage(0);
      }
    }
  },

  renderImagePlaylist() {
    const list = document.getElementById('adm-image-playlist-list');
    const counter = document.getElementById('adm-slide-counter');

    if (!list) return;

    if (this.imagePlaylist.length === 0) {
      list.innerHTML = `<div class="adm-empty-note">Nenhuma imagem na galeria.</div>`;
      if (counter) counter.textContent = '0/0';
      return;
    }

    if (counter) {
      counter.textContent = `${this.currentImageIndex + 1}/${this.imagePlaylist.length}`;
    }

    list.innerHTML = this.imagePlaylist.map((item, idx) => `
      <div class="adm-playlist-item ${idx === this.currentImageIndex ? 'active' : ''}" onclick="MesaMediaPlayer.selectImage(${idx})">
        <span class="adm-item-name" title="${item.name}">${idx + 1}. ${item.name}</span>
        <button class="adm-item-remove" onclick="event.stopPropagation(); MesaMediaPlayer.removeImage(${idx})">&times;</button>
      </div>
    `).join('');
  },

  removeImage(idx) {
    this.imagePlaylist.splice(idx, 1);
    if (this.currentImageIndex >= this.imagePlaylist.length) {
      this.currentImageIndex = this.imagePlaylist.length - 1;
    }
    this.renderImagePlaylist();
    if (this.currentImageIndex >= 0) {
      this.selectImage(this.currentImageIndex);
    } else {
      const img = document.getElementById('adm-preview-image');
      const emptyTxt = document.getElementById('adm-preview-image-empty');
      if (img) { img.src = ''; img.style.display = 'none'; }
      if (emptyTxt) emptyTxt.style.display = 'block';
    }
  },

  selectImage(idx) {
    if (idx < 0 || idx >= this.imagePlaylist.length) return;
    this.currentImageIndex = idx;
    this.renderImagePlaylist();

    const item = this.imagePlaylist[idx];
    const img = document.getElementById('adm-preview-image');
    const emptyTxt = document.getElementById('adm-preview-image-empty');

    if (img) {
      img.src = item.url;
      img.style.display = 'block';
      if (emptyTxt) emptyTxt.style.display = 'none';
      if (this.isTransmitting) this.syncLiveDisplay();
    }
  },

  prevImage() {
    if (this.imagePlaylist.length === 0) return;
    let prev = this.currentImageIndex - 1;
    if (prev < 0) prev = this.imagePlaylist.length - 1;
    this.selectImage(prev);
  },

  nextImage() {
    if (this.imagePlaylist.length === 0) return;
    let next = this.currentImageIndex + 1;
    if (next >= this.imagePlaylist.length) next = 0;
    this.selectImage(next);
  },

  // ---- 3. TRANSMISSÃO AO VIVO PARA TODOS OS JOGADORES (THEATER OVERLAY) ----
  syncLiveDisplay() {
    const overlay = document.getElementById('master-media-theater-overlay');
    const frame = overlay ? overlay.querySelector('.theater-media-frame') : null;
    const theaterVideo = document.getElementById('theater-video-player');
    const theaterImage = document.getElementById('theater-image-player');

    let payload = {
      isTransmitting: this.isTransmitting,
      isBlackout: this.isBlackout,
      activeTab: this.activeTab,
      transitionSpeed: this.transitionSpeed
    };

    if (this.isTransmitting) {
      if (overlay) overlay.classList.add('active');
      if (frame) {
        if (this.isBlackout) frame.classList.add('blackout');
        else frame.classList.remove('blackout');
      }

      if (this.activeTab === 'video' && this.currentVideoIndex >= 0) {
        const item = this.videoPlaylist[this.currentVideoIndex];
        const previewVideo = document.getElementById('adm-preview-video');

        payload.url = item.url;
        payload.mediaType = 'video';
        payload.currentTime = previewVideo ? previewVideo.currentTime : 0;
        payload.isPlaying = this.isPlaying;
        payload.volume = this.volume;

        if (theaterImage) theaterImage.style.display = 'none';
        if (theaterVideo) {
          theaterVideo.style.display = 'block';
          if (theaterVideo.src !== item.url) theaterVideo.src = item.url;
          theaterVideo.currentTime = payload.currentTime;
          theaterVideo.volume = this.volume;
          if (this.isPlaying) theaterVideo.play().catch(() => {});
          else theaterVideo.pause();
        }
      } else if (this.activeTab === 'slideshow' && this.currentImageIndex >= 0) {
        const item = this.imagePlaylist[this.currentImageIndex];
        payload.url = item.url;
        payload.mediaType = 'image';

        if (theaterVideo) { theaterVideo.style.display = 'none'; theaterVideo.pause(); }
        if (theaterImage) {
          theaterImage.src = item.url;
          theaterImage.style.display = 'block';
        }
      }
    } else {
      if (overlay) overlay.classList.remove('active');
      if (theaterVideo) { theaterVideo.pause(); theaterVideo.src = ''; }
      if (theaterImage) { theaterImage.src = ''; }
    }

    // Transmite via WebSocket para sincronizar a tela de todos
    if (MesaApp.state.isMaster && MesaChat.channel) {
      MesaChat.channel.send({
        type: 'broadcast',
        event: 'media_sync',
        payload: payload
      });
    }
  },

  handleIncomingSync(data) {
    if (MesaApp.state.isMaster) return; // Mestre já controla a própria tela

    const overlay = document.getElementById('master-media-theater-overlay');
    const frame = overlay ? overlay.querySelector('.theater-media-frame') : null;
    const theaterVideo = document.getElementById('theater-video-player');
    const theaterImage = document.getElementById('theater-image-player');
    const statusNote = document.getElementById('theater-status-note');

    if (!overlay) return;

    if (!data.isTransmitting) {
      overlay.classList.remove('active');
      if (theaterVideo) { theaterVideo.pause(); theaterVideo.src = ''; theaterVideo.style.display = 'none'; }
      if (theaterImage) { theaterImage.src = ''; theaterImage.style.display = 'none'; }
      if (statusNote) statusNote.style.display = 'none';
      return;
    }

    overlay.classList.add('active');

    if (frame) {
      if (data.isBlackout) frame.classList.add('blackout');
      else frame.classList.remove('blackout');
    }

    if (data.mediaType === 'video') {
      if (theaterImage) { theaterImage.style.display = 'none'; theaterImage.src = ''; }

      if (data.url) {
        if (statusNote) statusNote.style.display = 'none';
        if (theaterVideo) {
          theaterVideo.style.display = 'block';
          if (theaterVideo.src !== data.url) {
            theaterVideo.src = data.url;
            theaterVideo.load();
          }
          if (Math.abs(theaterVideo.currentTime - data.currentTime) > 1.5) {
            theaterVideo.currentTime = data.currentTime;
          }
          theaterVideo.volume = data.volume !== undefined ? data.volume : 1;
          if (data.isPlaying) {
            const playPromise = theaterVideo.play();
            if (playPromise !== undefined) {
              playPromise.catch(() => {
                theaterVideo.muted = true;
                theaterVideo.play().catch(e => console.warn("Falha no playback com mudo:", e));
              });
            }
          } else {
            theaterVideo.pause();
          }
        }
      } else {
        if (theaterVideo) theaterVideo.style.display = 'none';
        if (statusNote) {
          statusNote.style.display = 'block';
          statusNote.textContent = 'Aguardando o Mestre selecionar um vídeo...';
        }
      }
    } else if (data.mediaType === 'image') {
      if (theaterVideo) { theaterVideo.style.display = 'none'; theaterVideo.pause(); theaterVideo.src = ''; }

      if (data.url) {
        if (statusNote) statusNote.style.display = 'none';
        if (theaterImage) {
          theaterImage.src = data.url;
          theaterImage.style.display = 'block';
        }
      } else {
        if (theaterImage) theaterImage.style.display = 'none';
        if (statusNote) {
          statusNote.style.display = 'block';
          statusNote.textContent = 'Aguardando o Mestre selecionar uma imagem...';
        }
      }
    }
  },

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  },

  formatTimePrecise(seconds) {
    if (!seconds || isNaN(seconds)) return '00:00.0';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const tenths = Math.floor((seconds % 1) * 10);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}.${tenths}`;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MesaApp.init();
});

window.addEventListener('beforeunload', () => {
  // Limpa arquivos temporários do Supabase Storage ao fechar ou recarregar a mesa
  if (typeof MesaMediaPlayer !== 'undefined' && MesaApp.supabase && MesaApp.supabase.storage) {
    const pathsToDelete = [];
    MesaMediaPlayer.videoPlaylist.forEach(v => { if (v.storagePath) pathsToDelete.push(v.storagePath); });
    MesaMediaPlayer.imagePlaylist.forEach(i => { if (i.storagePath) pathsToDelete.push(i.storagePath); });
    if (pathsToDelete.length > 0) {
      MesaApp.supabase.storage.from('temp_media').remove(pathsToDelete);
    }
  }
});
