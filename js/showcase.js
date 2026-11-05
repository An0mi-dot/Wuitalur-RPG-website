/* ============================================================
   WUITALUR RPG — CONTROLADOR SHOWCASE DE CLASSES E RAÇAS (V6)
   - Menu Hambúrguer no Topo Esquerdo
   - Navegação por Tópicos na Esquerda
   - Palco Central com Hero Spotlight 2.5D Parallax (Estilo Deadlock)
   - 3 Camadas 3D: Fundo Geométrico / Personagem / Tipografia e Badges
   - Sombra Suave Direcional e Rotação Dinâmica via mousemove (rAF)
   - Paleta Urbana Streetwear: #121114, #1B191F, #9B51E0
   ============================================================ */

// ---- MOTOR DE GLITCH PROCEDURAL EM CANVAS (ESTILO MESA VIRTUAL) ----
const SpotlightGlitchEngine = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  glitches: [],
  running: false,
  animId: null,

  init() {
    this.canvas = document.getElementById('spotlight-glitch-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.resize();
  },

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : null;
    this.width = this.canvas.width = rect && rect.width > 50 ? rect.width : 500;
    this.height = this.canvas.height = rect && rect.height > 50 ? rect.height : 750;
  },

  triggerBurst(count = 5) {
    if (!this.canvas) this.init();
    if (!this.canvas || !this.ctx) return;
    this.resize();
    for (let i = 0; i < count; i++) {
      this.createGlitch();
    }
    if (!this.running) {
      this.running = true;
      this.loop();
    }
  },

  createGlitch() {
    const types = ['slice', 'scanline', 'microBlock', 'digitalDot'];
    const type = types[Math.floor(Math.random() * types.length)];
    const colors = [
      'rgba(255, 85, 0, 0.55)',
      'rgba(255, 120, 20, 0.45)',
      'rgba(255, 170, 40, 0.40)',
      'rgba(168, 85, 247, 0.50)',
      'rgba(255, 255, 255, 0.65)'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const x = Math.random() * this.width;
    const y = Math.random() * this.height;

    let glitch = {
      type,
      x,
      y,
      color,
      life: Math.floor(Math.random() * 12) + 8,
      maxLife: 18,
      width: 0,
      height: 0,
      size: 0
    };

    if (type === 'slice') {
      glitch.width = Math.random() * (this.width * 0.55) + 40;
      glitch.height = Math.random() * 4 + 1.5;
      glitch.x = Math.random() * (this.width - glitch.width);
    } else if (type === 'scanline') {
      glitch.width = this.width;
      glitch.height = Math.random() * 2 + 1;
      glitch.x = 0;
    } else if (type === 'microBlock') {
      glitch.width = Math.random() * 50 + 20;
      glitch.height = Math.random() * 16 + 6;
      glitch.hollow = Math.random() > 0.4;
    } else if (type === 'digitalDot') {
      glitch.size = Math.random() * 4 + 2;
    }

    glitch.maxLife = glitch.life;
    this.glitches.push(glitch);
  },

  loop() {
    if (!this.running || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    for (let i = this.glitches.length - 1; i >= 0; i--) {
      const g = this.glitches[i];
      g.life--;
      const fade = g.life / g.maxLife;
      this.ctx.save();
      this.ctx.globalAlpha = fade * 0.85;

      if (g.type === 'slice') {
        this.ctx.fillStyle = g.color;
        this.ctx.fillRect(g.x, g.y, g.width, g.height);
      } else if (g.type === 'scanline') {
        this.ctx.fillStyle = g.color;
        this.ctx.fillRect(0, g.y, this.width, g.height);
      } else if (g.type === 'microBlock') {
        if (g.hollow) {
          this.ctx.strokeStyle = g.color;
          this.ctx.lineWidth = 1.5;
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

    if (this.glitches.length > 0) {
      this.animId = requestAnimationFrame(() => this.loop());
    } else {
      this.running = false;
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  }
};

const ShowcaseEngine = {
  mode: 'classes', // 'classes' ou 'races'
  items: [],
  currentId: null,
  activeTopicIndex: 0,
  
  // Dicionário de Conceitos / Tags para cada Classe e Raça
  classConcepts: {
    // Classes
    consagrados: ['ESTRATEGISTA', 'SUPORTE', 'CONTROLADOR'],
    compactador: ['DEFENSOR', 'COLOSSO', 'TANQUE'],
    bestial: ['ATACANTE', 'COLOSSO', 'DUELISTA'],
    'cavaleiros-paladium': ['DEFENSOR', 'TANQUE', 'SUPORTE'],
    eterno: ['ATACANTE', 'CANHÃO DE VIDRO', 'DUELISTA'],
    furtassaltantes: ['ATACANTE', 'DUELISTA', 'UTILITÁRIO'],
    pistoleiro: ['ATACANTE', 'CANHÃO DE VIDRO', 'TÁTICO'],
    rastejantes: ['ESTRATEGISTA', 'CONTROLADOR', 'UTILITÁRIO'],
    anomalo: ['ESTRATEGISTA', 'CONTROLADOR', 'CANHÃO DE VIDRO'],
    'atirador-espectral': ['ATACANTE', 'CANHÃO DE VIDRO', 'TÁTICO'],
    lampinario: ['ESTRATEGISTA', 'SUPORTE', 'UTILITÁRIO'],
    protegidos: ['DEFENSOR', 'TANQUE', 'TÁTICO'],
    sobrevivente: ['N/A'],

    // Raças
    akivus: ['SILVESTRE', 'FLORA & VINHAS', 'FURTIVO'],
    animalescos: ['FERAL', 'INSTINTO', 'PREDATÓRIO'],
    plantiferos: ['VEGETAL', 'REGENERAÇÃO', 'CLOROFILA'],
    humanos: ['ADAPTAÇÃO', 'VERSATILIDADE', 'DETERMINAÇÃO'],
    vampiros: ['SANGUINÁRIO', 'CARGAS DE SANGUE', 'NOTURNO'],
    'dragao-anao': ['RÉPTIL', 'DRACÔNICO', 'SOPRO & ESCAMAS'],
    dragaoanao: ['RÉPTIL', 'DRACÔNICO', 'SOPRO & ESCAMAS'],
    insectoides: ['QUITINOSO', 'EXOESQUELETO', 'MEMBROS EXTRAS'],
    praguentos: ['TOXINAS', 'INFECÇÃO', 'RESISTÊNCIA'],
    abissais: ['AQUÁTICO', 'PROFUNDEZAS', 'PRESSÃO ASTRAL'],
    exos: ['AUTÔMATO', 'PONTOS DE CHASSI', 'OVERCLOCK'],
    exo: ['AUTÔMATO', 'PONTOS DE CHASSI', 'OVERCLOCK'],
    espectros: ['ANOMALIA', 'ESTABILIDADE CÓSMICA', 'GLITCH']
  },

  // Funções Táticas / Dossiês de cada Classe e Raça
  classRoles: {
    // Classes
    consagrados: 'ESTRATEGISTA | SUPORTE | CONTROLADOR',
    compactador: 'DEFENSOR | COLOSSO | TANQUE',
    bestial: 'ATACANTE | COLOSSO | DUELISTA',
    'cavaleiros-paladium': 'DEFENSOR | TANQUE | SUPORTE',
    eterno: 'ATACANTE | CANHÃO DE VIDRO | DUELISTA',
    furtassaltantes: 'ATACANTE | DUELISTA | UTILITÁRIO',
    pistoleiro: 'ATACANTE | CANHÃO DE VIDRO | TÁTICO',
    rastejantes: 'ESTRATEGISTA | CONTROLADOR | UTILITÁRIO',
    anomalo: 'ESTRATEGISTA | CONTROLADOR | CANHÃO DE VIDRO',
    'atirador-espectral': 'ATACANTE | CANHÃO DE VIDRO | TÁTICO',
    lampinario: 'ESTRATEGISTA | SUPORTE | UTILITÁRIO',
    protegidos: 'DEFENSOR | TANQUE | TÁTICO',
    sobrevivente: 'N/A',

    // Raças
    akivus: 'SILVESTRE | CONTROLADOR | FURTIVO',
    animalescos: 'FERAL | AGILIDADE | INSTINTIVO',
    plantiferos: 'VEGETAL | REGENERAÇÃO | RESILIENTE',
    humanos: 'VERSÁTIL | ADAPTATIVO | DETERMINADO',
    vampiros: 'SANGUINÁRIO | SUSTENTAÇÃO | PREDADOR',
    'dragao-anao': 'DRACÔNICO | ROBUSTEZ | ELEMENTAL',
    dragaoanao: 'DRACÔNICO | ROBUSTEZ | ELEMENTAL',
    insectoides: 'QUITINOSO | MULTITAREFA | DEFENSOR',
    praguentos: 'TOXINAS | INFECÇÃO | DEBILITANTE',
    abissais: 'AQUÁTICO | PRESSÃO ASTRAL | SONDADOR',
    exos: 'AUTÔMATO | PONTOS DE CHASSI | OVERCLOCK',
    exo: 'AUTÔMATO | PONTOS DE CHASSI | OVERCLOCK',
    espectros: 'ANOMALIA | ESTABILIDADE CÓSMICA | GLITCH'
  },

  // Enquadramento e Posição Customizados para a Ilustração de cada Classe e Raça
  // Otimizado com foco no busto (torso até a cabeça), com enquadramento harmonioso abaixo do título
  classFraming: {
    consagrados: { scale: 1.48, x: 0, y: -22 },
    compactador: { scale: 1.0, x: 0, y: 0 },
    eterno: { scale: 1.05, x: 0, y: 0 },
    'cavaleiros-paladium': { scale: 1.42, x: 0, y: -15 },
    rastejantes: { scale: 1.32, x: 0, y: -10 },
    protegidos: { scale: 1.48, x: 0, y: -17 },
    lampinario: { scale: 1.15, x: 5, y: 4, maskStart: 42, maskEnd: 88 },
    furtassaltantes: { scale: 1.32, x: 0, y: -10 },
    pistoleiro: { scale: 1.0, x: 0, y: 2 },
    bestial: { scale: 1.05, x: 0, y: 0 },
    anomalo: { scale: 1.18, x: 0, y: -6 },
    'atirador-espectral': { scale: 1.35, x: 0, y: -34 },
    sobrevivente: { scale: 1.08, x: 0, y: 0 },

    // Raças
    akivus: { scale: 1.15, x: 0, y: 0 },
    animalescos: { scale: 1.12, x: 0, y: 0 },
    plantiferos: { scale: 1.12, x: 0, y: 0 },
    humanos: { scale: 1.12, x: 0, y: 0 },
    vampiros: { scale: 1.15, x: 0, y: 0 },
    'dragao-anao': { scale: 1.1, x: 0, y: 0 },
    dragaoanao: { scale: 1.1, x: 0, y: 0 },
    insectoides: { scale: 1.12, x: 0, y: 0 },
    praguentos: { scale: 1.12, x: 0, y: 0 },
    abissais: { scale: 1.12, x: 0, y: 0 },
    exos: { scale: 1.12, x: 0, y: 0 },
    exo: { scale: 1.12, x: 0, y: 0 },
    espectros: { scale: 1.18, x: 0, y: 0 }
  },

  // Paletas de Cores Streetwear personalizadas para cada Classe e Raça
  classPalettes: {
    // Classes
    compactador: {
      accent: '#00D2FF',
      accentLight: '#67E8F9',
      contrast: '#FFFFFF',
      rgb: '0, 210, 255',
      darkTint: '#061D26',
      border: 'rgba(0, 210, 255, 0.45)'
    },
    consagrados: {
      accent: '#F59E0B',
      accentLight: '#FEF08A',
      contrast: '#FFFFFF',
      rgb: '245, 158, 11',
      darkTint: '#241806',
      border: 'rgba(245, 158, 11, 0.45)'
    },
    bestial: {
      accent: '#EF4444',
      accentLight: '#FCA5A5',
      contrast: '#FFFFFF',
      rgb: '239, 68, 68',
      darkTint: '#240E10',
      border: 'rgba(239, 68, 68, 0.45)'
    },
    'cavaleiros-paladium': {
      accent: '#DC2626',
      accentLight: '#FCA5A5',
      contrast: '#FFFFFF',
      rgb: '220, 38, 38',
      darkTint: '#260B0B',
      border: 'rgba(220, 38, 38, 0.45)'
    },
    eterno: {
      accent: '#0D9488',
      accentLight: '#5EEAD4',
      contrast: '#FFFFFF',
      rgb: '13, 148, 136',
      darkTint: '#061D1A',
      border: 'rgba(13, 148, 136, 0.45)'
    },
    furtassaltantes: {
      accent: '#E11D48',
      accentLight: '#FDA4AF',
      contrast: '#FFFFFF',
      rgb: '225, 29, 72',
      darkTint: '#260B12',
      border: 'rgba(225, 29, 72, 0.45)'
    },
    pistoleiro: {
      accent: '#D97706',
      accentLight: '#FDE68A',
      contrast: '#FFFFFF',
      rgb: '217, 119, 6',
      darkTint: '#261506',
      border: 'rgba(217, 119, 6, 0.45)'
    },
    rastejantes: {
      accent: '#B45309',
      accentLight: '#FDE68A',
      contrast: '#FFFFFF',
      rgb: '180, 83, 9',
      darkTint: '#241206',
      border: 'rgba(180, 83, 9, 0.45)'
    },
    anomalo: {
      accent: '#EF4444',
      accentLight: '#FCA5A5',
      contrast: '#FFFFFF',
      rgb: '239, 68, 68',
      darkTint: '#260B0E',
      border: 'rgba(239, 68, 68, 0.45)'
    },
    'atirador-espectral': {
      accent: '#A78BFA',
      accentLight: '#DDD6FE',
      contrast: '#FFFFFF',
      rgb: '167, 139, 250',
      darkTint: '#1B142B',
      border: 'rgba(167, 139, 250, 0.45)'
    },
    lampinario: {
      accent: '#9B51E0',
      accentLight: '#C084FC',
      contrast: '#FFFFFF',
      rgb: '155, 81, 224',
      darkTint: '#191422',
      border: 'rgba(155, 81, 224, 0.45)'
    },
    protegidos: {
      accent: '#38BDF8',
      accentLight: '#BAE6FD',
      contrast: '#FFFFFF',
      rgb: '56, 189, 248',
      darkTint: '#0C1E2E',
      border: 'rgba(56, 189, 248, 0.45)'
    },
    sobrevivente: {
      accent: '#94A3B8',
      accentLight: '#F1F5F9',
      contrast: '#FFFFFF',
      rgb: '148, 163, 184',
      darkTint: '#14171E',
      border: 'rgba(148, 163, 184, 0.45)'
    },

    // Raças
    akivus: { accent: '#06B6D4', accentLight: '#67E8F9', contrast: '#000000', rgb: '6, 182, 212', darkTint: '#082228', border: 'rgba(6, 182, 212, 0.45)' },
    animalescos: { accent: '#D97706', accentLight: '#FDE68A', contrast: '#000000', rgb: '217, 119, 6', darkTint: '#261506', border: 'rgba(217, 119, 6, 0.45)' },
    plantiferos: { accent: '#10B981', accentLight: '#6EE7B7', contrast: '#FFFFFF', rgb: '16, 185, 129', darkTint: '#092218', border: 'rgba(16, 185, 129, 0.45)' },
    humanos: { accent: '#3B82F6', accentLight: '#93C5FD', contrast: '#FFFFFF', rgb: '59, 130, 246', darkTint: '#0A1C36', border: 'rgba(59, 130, 246, 0.45)' },
    vampiros: { accent: '#E11D48', accentLight: '#FDA4AF', contrast: '#FFFFFF', rgb: '225, 29, 72', darkTint: '#260B12', border: 'rgba(225, 29, 72, 0.45)' },
    dragaoanao: { accent: '#F97316', accentLight: '#FDBA74', contrast: '#000000', rgb: '249, 115, 22', darkTint: '#281408', border: 'rgba(249, 115, 22, 0.45)' },
    'dragao-anao': { accent: '#F97316', accentLight: '#FDBA74', contrast: '#000000', rgb: '249, 115, 22', darkTint: '#281408', border: 'rgba(249, 115, 22, 0.45)' },
    insectoides: { accent: '#84CC16', accentLight: '#BEF264', contrast: '#000000', rgb: '132, 204, 22', darkTint: '#182208', border: 'rgba(132, 204, 22, 0.45)' },
    praguentos: { accent: '#DC2626', accentLight: '#FCA5A5', contrast: '#FFFFFF', rgb: '220, 38, 38', darkTint: '#260B0B', border: 'rgba(220, 38, 38, 0.45)' },
    abissais: { accent: '#0284C7', accentLight: '#7DD3FC', contrast: '#FFFFFF', rgb: '2, 132, 199', darkTint: '#061D2B', border: 'rgba(2, 132, 199, 0.45)' },
    exo: { accent: '#00D2FF', accentLight: '#67E8F9', contrast: '#000000', rgb: '0, 210, 255', darkTint: '#061C24', border: 'rgba(0, 210, 255, 0.45)' },
    exos: { accent: '#00D2FF', accentLight: '#67E8F9', contrast: '#000000', rgb: '0, 210, 255', darkTint: '#061C24', border: 'rgba(0, 210, 255, 0.45)' },
    espectros: { accent: '#A855F7', accentLight: '#DDD6FE', contrast: '#FFFFFF', rgb: '168, 85, 247', darkTint: '#1D1730', border: 'rgba(168, 85, 247, 0.45)' }
  },

  applyClassTheme(itemId) {
    const p = this.classPalettes[itemId] || {
      accent: '#F59E0B',
      accentLight: '#FEF08A',
      contrast: '#FFFFFF',
      rgb: '245, 158, 11',
      darkTint: '#241806',
      border: 'rgba(245, 158, 11, 0.45)'
    };

    const target = document.getElementById('spotlight-viewport') || document.getElementById('showcase-viewport') || document.documentElement;

    target.style.setProperty('--spotlight-accent', p.accent);
    target.style.setProperty('--spotlight-accent-light', p.accentLight);
    target.style.setProperty('--spotlight-accent-contrast', p.contrast);
    target.style.setProperty('--spotlight-accent-border', p.border);
    target.style.setProperty('--spotlight-backdrop-tint', p.darkTint);
    target.style.setProperty('--spotlight-accent-glow-subtle', `rgba(${p.rgb}, 0.22)`);
    target.style.setProperty('--spotlight-backlight', `rgba(${p.rgb}, 0.26)`);
    target.style.setProperty('--spotlight-backlight-outer', `rgba(${p.rgb}, 0.08)`);
    target.style.setProperty('--spotlight-halftone-color', `rgba(${p.rgb}, 0.35)`);
    target.style.setProperty('--spotlight-slash-bg', `rgba(${p.rgb}, 0.12)`);
    target.style.setProperty('--spotlight-slash-border', `rgba(${p.rgb}, 0.4)`);
    target.style.setProperty('--spotlight-slash-border-subtle', `rgba(${p.rgb}, 0.15)`);
    target.style.setProperty('--spotlight-poly-color', `rgba(${p.rgb}, 0.2)`);
    target.style.setProperty('--spotlight-shadow-glow', `rgba(${p.rgb}, 0.35)`);
    target.style.setProperty('--spotlight-hazard-color', `rgba(${p.rgb}, 0.22)`);

    // Aplica o enquadramento (escala e offset X/Y) e fade inferior específico da ilustração
    const framing = this.classFraming[itemId] || { scale: 1.0, x: 0, y: 0 };
    target.style.setProperty('--art-scale', framing.scale);
    target.style.setProperty('--art-offset-x', `${framing.x}%`);
    target.style.setProperty('--art-offset-y', `${framing.y}%`);
    if (framing.maskStart) {
      target.style.setProperty('--art-mask-start', `${framing.maskStart}%`);
      target.style.setProperty('--art-mask-end', `${framing.maskEnd}%`);
    } else {
      target.style.setProperty('--art-mask-start', '72%');
      target.style.setProperty('--art-mask-end', '98%');
    }
  },

  // Elementos do DOM
  elements: {
    viewport: null,
    hubView: null,
    hubList: null,
    hubGrid: null,
    hubSearch: null,
    hubSidebarBtn: null,
    detailView: null,
    detailLeft: null,
    detailRight: null,
    btnBackHub: null,
    btnDetailSidebar: null,
    spotlightViewport: null,
    spotlightStage: null,
    spotlightTitle: null,
    spotlightTags: null,
    spotlightCoords: null,
    spotlightNdIndicator: null,
    spotlightRoleIndicator: null,
    spotlightBack: null,
    spotlightChar: null,
    spotlightFg: null,
    compendiumRole: null,
    compendiumNd: null,
    compendiumSearch: null,
    compendiumSearchClear: null,
    compendiumTabs: null,
    compendiumPane: null,
    compendiumTopicTitle: null,
    compendiumBody: null,
    siteSidebar: null,
    sidebarBackdrop: null,
    artView: null,
    contentView: null,
    heroArt: null,
    bigName: null,
    ndBadge: null,
    topicActiveTitle: null,
    topicCategory: null,
    topicTabs: null,
    topicContent: null,
    btnViewArt: null,
    drawerBackdrop: null,
    drawerList: null,
    drawerInput: null,
    drawerHeading: null,
    hamburgerBtn: null,
    hamburgerLabel: null,
    bladeNd: null,
    ndTier: null,
    ndGauge: null
  },

  // Controlador Parallax 2.5D baseado no mousemove
  parallax: {
    engine: null,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
    rafId: null,
    isHovered: false,

    init(engine) {
      this.engine = engine;
      const stage = engine.elements.spotlightStage;
      let trigger = document.getElementById('spotlight-hitbox');

      // Se o hitbox não existir no HTML, cria automaticamente sobre a área da arte
      if (!trigger && stage) {
        trigger = document.createElement('div');
        trigger.id = 'spotlight-hitbox';
        trigger.className = 'spotlight-hitbox';
        trigger.setAttribute('aria-hidden', 'true');
        stage.appendChild(trigger);
      }

      if (!stage || !trigger) return;

      trigger.addEventListener('mousemove', (e) => {
        const rect = trigger.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        // Offset normalizado relativo à área da imagem (-1 a 1)
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        this.targetX = Math.max(-1, Math.min(1, px * 2 - 1));
        this.targetY = Math.max(-1, Math.min(1, py * 2 - 1));
        this.isHovered = true;

        if (engine.elements.spotlightCoords) {
          const cx = Math.round(this.targetX * 50);
          const cy = Math.round(this.targetY * 50);
          engine.elements.spotlightCoords.textContent = `X:${cx >= 0 ? '+' : ''}${cx} Y:${cy >= 0 ? '+' : ''}${cy}`;
        }

        if (!this.rafId) {
          this.rafId = requestAnimationFrame(() => this.tick());
        }
      });

      trigger.addEventListener('mouseleave', () => {
        this.isHovered = false;
        this.targetX = 0;
        this.targetY = 0;
        if (engine.elements.spotlightCoords) {
          engine.elements.spotlightCoords.textContent = 'X:00 Y:00';
        }
        if (!this.rafId) {
          this.rafId = requestAnimationFrame(() => this.tick());
        }
      });

      this.tick();
    },

    tick() {
      const el = this.engine.elements;
      if (!el.spotlightStage) return;

      // Interpolação suave (lerp) com ease-out
      const factor = this.isHovered ? 0.085 : 0.06;
      this.currentX += (this.targetX - this.currentX) * factor;
      this.currentY += (this.targetY - this.currentY) * factor;

      const diffX = Math.abs(this.targetX - this.currentX);
      const diffY = Math.abs(this.targetY - this.currentY);

      // O container principal permanece estático para garantir estabilidade e legibilidade absoluta do texto
      el.spotlightStage.style.transform = '';

      // Camada 1: Fundo Geométrico e Técnico (profundidade sutil mínima)
      if (el.spotlightBack) {
        const bx = (this.currentX * 6).toFixed(2);
        const by = (this.currentY * 5).toFixed(2);
        el.spotlightBack.style.transform = `translate3d(${bx}px, ${by}px, 0px)`;
      }

      // Camada 2: Personagem (O PARALLAX E INCLINAÇÃO 3D OCORREM EXCLUSIVAMENTE NO CONTAINER EXTERNO)
      if (el.spotlightChar) {
        const rotX = (-this.currentY * 3.5).toFixed(2);
        const rotY = (this.currentX * 4.5).toFixed(2);
        const cx = (this.currentX * 16).toFixed(2);
        const cy = (this.currentY * 14).toFixed(2);
        el.spotlightChar.style.transform = `perspective(1800px) translate3d(${cx}px, ${cy}px, 0px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      }

      // Reação física dos vincos do papel à inclinação 3D pelo cursor
      const dispMap = document.getElementById('paper-warp-map') || document.querySelector('#paper-warp feDisplacementMap');
      if (dispMap) {
        const tiltIntensity = Math.abs(this.currentX) + Math.abs(this.currentY);
        const foldScale = (2.2 + tiltIntensity * 2.0).toFixed(1);
        dispMap.setAttribute('scale', foldScale);
      }

      // Camada 3: Foreground Tipografia e Badges 100% fixas (sem movimento de cursor)
      if (el.spotlightFg) {
        el.spotlightFg.style.transform = 'none';
      }

      if (this.isHovered || diffX > 0.001 || diffY > 0.001) {
        this.rafId = requestAnimationFrame(() => this.tick());
      } else {
        this.rafId = null;
        el.spotlightStage.style.transform = '';
        if (el.spotlightBack) el.spotlightBack.style.transform = '';
        if (el.spotlightChar) el.spotlightChar.style.transform = '';
        if (el.spotlightFg) el.spotlightFg.style.transform = 'none';
        if (dispMap) dispMap.setAttribute('scale', '2.2');
      }
    }
  },

  init(mode = 'classes') {
    document.body.classList.add('has-showcase');
    this.mode = mode;

    // Garante que os filtros SVG de papel amassado / textura existam na página
    if (!document.getElementById('paper-warp')) {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'sr-only');
      svg.setAttribute('aria-hidden', 'true');
      svg.style.cssText = 'position:absolute;width:0;height:0;pointer-events:none;';
      svg.innerHTML = `
        <filter id="paper-warp" x="-35%" y="-35%" width="170%" height="170%" filterUnits="objectBoundingBox">
          <feTurbulence type="fractalNoise" baseFrequency="0.025 0.025" numOctaves="3" result="noise" seed="2" />
          <feDisplacementMap id="paper-warp-map" in="SourceGraphic" in2="noise" scale="2.5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <filter id="paper-texture">
          <feTurbulence type="fractalNoise" baseFrequency="0.04 0.04" numOctaves="4" result="noise" />
          <feColorMatrix type="matrix" values="0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0.33 0.33 0.33 0 0  0 0 0 0.15 0" result="glitch" />
          <feComposite in2="SourceGraphic" in="glitch" operator="in" />
        </filter>
      `;
      document.body.appendChild(svg);
    }

    this.parseContent();
    this.bindElements();
    this.bindEvents();
    this.parallax.init(this);

    // Garante que a janela fique no topo
    window.scrollTo(0, 0);

    // Suporte ao layout legado de 3 colunas caso exista a dock esquerda (ex: races.html)
    if (this.elements.leftDock && this.elements.viewport) {
      this.elements.viewport.classList.add('has-legacy-dock');
    }

    // Se temos a tela de hub (como em classes.html)
    if (this.elements.hubView) {
      this.renderHubList();
    }

    // Determina o estado inicial pelo hash da URL
    const hash = window.location.hash.replace('#', '').trim();
    const matchedItem = this.items.find(it => it.id === hash);

    if (matchedItem) {
      this.openClass(matchedItem.id, false);
    } else {
      if (this.elements.hubView) {
        this.openHub(false);
      } else if (this.items.length > 0) {
        this.selectItem(this.items[0].id, false);
      }
    }

    // Navegação via botões Voltar/Avançar do navegador
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '').trim();
      const it = this.items.find(item => item.id === h);
      if (it) {
        this.openClass(it.id, false);
      } else if (this.elements.hubView) {
        this.openHub(false);
      }
    });
  },

  parseContent() {
    this.items = [];
    const sections = document.querySelectorAll('section.subsection, section.race-section');
    
    sections.forEach(sec => {
      if (sec.id === 'intro' || sec.id === 'hibridos') return;

      const id = sec.id;
      const card = sec.querySelector('.race-card, .hud-card') || sec;
      const nameEl = sec.querySelector('.race-name, .hud-card-title, h2, h3');
      const name = nameEl ? nameEl.textContent.trim() : id;
      
      const imgEl = sec.querySelector('.race-card-image img, img');
      const imgSrc = imgEl ? imgEl.getAttribute('src') : '';

      const badgeEl = sec.querySelector('.difficulty-badge, .badge');
      const badge = badgeEl ? badgeEl.textContent.trim() : '';

      // Tópicos da classe/raça
      const topics = [];

      // Tópico 0: Ilustração (exibe a arte no centro)
      topics.push({
        isIllustration: true,
        title: 'Ilustração',
        fullTitle: 'Ilustração',
        contentHtml: ''
      });

      const body = sec.querySelector('.race-card-body') || card;

      if (body) {
        // Tópico 1: Visão Geral / Descrição inicial
        const descParagraphs = Array.from(body.children).filter(el => 
          el.tagName === 'P' || el.classList.contains('callout') || el.classList.contains('race-description')
        );
        if (descParagraphs.length > 0) {
          const wrapper = document.createElement('div');
          descParagraphs.forEach(p => wrapper.appendChild(p.cloneNode(true)));
          topics.push({
            isIllustration: false,
            title: 'Visão Geral',
            fullTitle: 'Visão Geral',
            contentHtml: wrapper.innerHTML
          });
        }

        // Tópicos subsequentes agrupados por cabeçalhos (H4)
        const h4Elements = body.querySelectorAll('h4');
        h4Elements.forEach(h4 => {
          let rawTitle = h4.textContent.trim();
          rawTitle = rawTitle.replace(/[\uFFFD\x97\x96\?]/g, ' - ')
                             .replace(/^[—–-\s]+|[—–-\s]+$/g, '')
                             .replace(/\s*[—–]\s*/g, ' - ')
                             .replace(/\s{2,}/g, ' ');

          let title = rawTitle;
          if (title.length > 26) {
            title = title.split(' - ')[0] || title.slice(0, 24) + '...';
          }
          const wrapper = document.createElement('div');
          let next = h4.nextElementSibling;
          
          while (next && next.tagName !== 'H4') {
            wrapper.appendChild(next.cloneNode(true));
            next = next.nextElementSibling;
          }

          if (wrapper.children.length > 0) {
            topics.push({
              isIllustration: false,
              title: title,
              fullTitle: rawTitle,
              contentHtml: wrapper.innerHTML
            });
          }
        });
      }

      if (topics.length === 1) {
        topics.push({
          isIllustration: false,
          title: 'Visão Geral',
          fullTitle: 'Visão Geral',
          contentHtml: body ? body.innerHTML : sec.innerHTML
        });
      }

      const descEl = sec.querySelector('.race-description, p');
      const description = descEl ? descEl.textContent.trim() : '';

      this.items.push({
        id,
        name,
        imgSrc,
        badge,
        description,
        topics
      });
    });

    // Oculta as seções brutas originais para dar lugar ao showcase
    sections.forEach(sec => sec.style.display = 'none');
    const intro = document.getElementById('intro');
    if (intro) intro.style.display = 'none';

    // Pré-carrega todas as ilustrações para cache imediato na memória
    this.items.forEach(it => {
      if (it.imgSrc) {
        const preload = new Image();
        preload.src = it.imgSrc;
      }
    });
  },

  bindElements() {
    // Stage e Viewports
    this.elements.viewport = document.getElementById('showcase-viewport');
    this.elements.hubView = document.getElementById('showcase-hub-view');
    this.elements.hubList = document.getElementById('showcase-hub-list');
    this.elements.hubGrid = document.getElementById('showcase-hub-grid');
    this.elements.hubSearch = document.getElementById('showcase-hub-search');
    this.elements.hubSidebarBtn = document.getElementById('showcase-hub-sidebar-btn');

    // Split View (Tela da Classe em 2 Colunas)
    this.elements.detailView = document.getElementById('showcase-detail-view');
    this.elements.detailLeft = document.getElementById('showcase-detail-left');
    this.elements.detailRight = document.getElementById('showcase-detail-right');
    this.elements.btnBackHub = document.getElementById('showcase-btn-back-hub');
    this.elements.btnDetailSidebar = document.getElementById('showcase-btn-detail-sidebar');

    // Hero Spotlight 2.5D
    this.elements.spotlightViewport = document.getElementById('spotlight-viewport');
    this.elements.spotlightStage = document.getElementById('spotlight-stage');
    this.elements.spotlightCharWrap = document.getElementById('spotlight-char-wrap');
    this.elements.heroArt = document.getElementById('showcase-hero-art');
    this.elements.heroArtG1 = document.getElementById('showcase-hero-art-g1');
    this.elements.heroArtG2 = document.getElementById('showcase-hero-art-g2');
    this.elements.spotlightGlitchCanvas = document.getElementById('spotlight-glitch-canvas');
    this.elements.spotlightTitle = document.getElementById('showcase-spotlight-title');
    this.elements.spotlightTags = document.getElementById('showcase-spotlight-tags');
    this.elements.spotlightCoords = document.getElementById('spotlight-coords');
    this.elements.spotlightNdIndicator = document.getElementById('spotlight-nd-indicator');
    this.elements.spotlightRoleIndicator = document.getElementById('spotlight-role-indicator');
    this.elements.spotlightBack = document.querySelector('.spotlight-layer-back');
    this.elements.spotlightChar = document.querySelector('.spotlight-layer-character');
    this.elements.spotlightFg = document.querySelector('.spotlight-layer-foreground');

    SpotlightGlitchEngine.init();
    window.addEventListener('resize', () => SpotlightGlitchEngine.resize());

    // Compêndio da Classe (Coluna Direita)
    this.elements.compendiumRole = document.getElementById('compendium-role-indicator');
    this.elements.compendiumNd = document.getElementById('compendium-nd-indicator');
    this.elements.compendiumSearch = document.getElementById('compendium-topic-search');
    this.elements.compendiumSearchClear = document.getElementById('compendium-search-clear');
    this.elements.compendiumNavContainer = document.getElementById('compendium-nav-container');
    this.elements.compendiumTopicNav = document.getElementById('compendium-topic-nav');
    this.elements.compendiumNavPrev = document.getElementById('compendium-nav-prev');
    this.elements.compendiumNavNext = document.getElementById('compendium-nav-next');
    this.elements.compendiumTabs = document.getElementById('compendium-topic-tabs');
    this.elements.compendiumPane = document.getElementById('compendium-scroll-pane');
    this.elements.compendiumTopicTitle = document.getElementById('compendium-topic-title');
    this.elements.compendiumBody = document.getElementById('compendium-content-body');

    // Sidebar do site e backdrop retrátil
    this.elements.siteSidebar = document.getElementById('sidebar') || document.querySelector('.sidebar');
    this.elements.sidebarBackdrop = document.getElementById('sidebar-backdrop');

    // Elementos legados (suporte a races.html e edicao-2)
    this.elements.artView = document.getElementById('showcase-art-view');
    this.elements.contentView = document.getElementById('showcase-content-view');
    this.elements.bigName = document.getElementById('showcase-big-name');
    this.elements.ndBadge = document.getElementById('showcase-nd-badge');
    this.elements.topicActiveTitle = document.getElementById('showcase-topic-active-title');
    this.elements.topicCategory = document.getElementById('showcase-content-category');
    this.elements.topicTabs = document.getElementById('showcase-topic-tabs');
    this.elements.topicContent = document.getElementById('showcase-topic-content');
    this.elements.btnViewArt = document.getElementById('showcase-btn-view-art');
    this.elements.drawerBackdrop = document.getElementById('showcase-drawer-backdrop');
    this.elements.drawerList = document.getElementById('showcase-drawer-list');
    this.elements.drawerInput = document.getElementById('showcase-drawer-input');
    this.elements.drawerHeading = document.getElementById('showcase-drawer-heading');
    this.elements.hamburgerBtn = document.getElementById('showcase-hamburger-btn');
    this.elements.hamburgerLabel = document.getElementById('showcase-hamburger-label');
    this.elements.bladeNd = document.getElementById('showcase-blade-nd');
    this.elements.ndTier = document.getElementById('showcase-nd-tier');
    this.elements.ndGauge = document.getElementById('showcase-nd-gauge');

    if (this.elements.drawerHeading) {
      this.elements.drawerHeading.textContent = this.mode === 'classes' ? 'Todas as Classes' : 'Todas as Raças';
    }

    if (this.elements.topicCategory) {
      this.elements.topicCategory.textContent = this.mode === 'classes' ? 'Classe' : 'Raça';
    }
  },

  bindEvents() {
    // Botão de voltar ao Hub de Seleção
    if (this.elements.btnBackHub) {
      this.elements.btnBackHub.addEventListener('click', () => {
        this.openHub(true);
      });
    }

    // Botões para abrir/fechar o menu geral do site
    if (this.elements.hubSidebarBtn) {
      this.elements.hubSidebarBtn.addEventListener('click', () => this.toggleSidebar());
    }
    if (this.elements.btnDetailSidebar) {
      this.elements.btnDetailSidebar.addEventListener('click', () => this.toggleSidebar());
    }
    if (this.elements.sidebarBackdrop) {
      this.elements.sidebarBackdrop.addEventListener('click', () => this.closeSidebar());
    }

    // Filtro de busca no Hub de Seleção
    if (this.elements.hubSearch) {
      this.elements.hubSearch.addEventListener('input', (e) => {
        this.renderHubList(e.target.value);
      });
    }

    // Filtro de busca no Compêndio da Classe
    if (this.elements.compendiumSearch) {
      this.elements.compendiumSearch.addEventListener('input', (e) => {
        this.filterCompendiumTopics(e.target.value);
      });
    }
    if (this.elements.compendiumSearchClear) {
      this.elements.compendiumSearchClear.addEventListener('click', () => {
        if (this.elements.compendiumSearch) {
          this.elements.compendiumSearch.value = '';
          this.elements.compendiumSearch.focus();
        }
        this.filterCompendiumTopics('');
      });
    }

    // Navegação e Rolagem Horizontal das Abas de Tópicos
    const topicNav = this.elements.compendiumTopicNav || document.getElementById('compendium-topic-nav');
    const prevBtn = this.elements.compendiumNavPrev || document.getElementById('compendium-nav-prev');
    const nextBtn = this.elements.compendiumNavNext || document.getElementById('compendium-nav-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (topicNav) {
          topicNav.scrollBy({ left: -240, behavior: 'smooth' });
          setTimeout(() => this.updateTopicNavArrows(), 280);
        }
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (topicNav) {
          topicNav.scrollBy({ left: 240, behavior: 'smooth' });
          setTimeout(() => this.updateTopicNavArrows(), 280);
        }
      });
    }

    if (topicNav) {
      // Converte o scroll da rodinha do mouse em rolagem horizontal suave
      topicNav.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
          e.preventDefault();
          topicNav.scrollLeft += e.deltaY * 1.1;
          this.updateTopicNavArrows();
        }
      }, { passive: false });

      topicNav.addEventListener('scroll', () => {
        this.updateTopicNavArrows();
      }, { passive: true });

      // Suporte a clicar e arrastar (drag to scroll)
      let isDown = false;
      let startX = 0;
      let scrollStart = 0;

      topicNav.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        isDown = true;
        startX = e.pageX - topicNav.offsetLeft;
        scrollStart = topicNav.scrollLeft;
      });

      window.addEventListener('mouseup', () => {
        isDown = false;
      });

      topicNav.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - topicNav.offsetLeft;
        const walk = (x - startX) * 1.4;
        topicNav.scrollLeft = scrollStart - walk;
        this.updateTopicNavArrows();
      });
    }

    window.addEventListener('resize', () => {
      this.updateTopicNavArrows();
    });

    // Eventos legados para a gaveta lateral (races.html)
    if (this.elements.hamburgerBtn) {
      this.elements.hamburgerBtn.addEventListener('click', () => this.openDrawer());
    }
    const closeBtn = document.getElementById('showcase-drawer-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeDrawer());
    }
    if (this.elements.drawerBackdrop) {
      this.elements.drawerBackdrop.addEventListener('click', (e) => {
        if (e.target === this.elements.drawerBackdrop) this.closeDrawer();
      });
    }
    if (this.elements.btnViewArt) {
      this.elements.btnViewArt.addEventListener('click', () => {
        this.selectTopic(0);
      });
    }
    if (this.elements.drawerInput) {
      this.elements.drawerInput.addEventListener('input', (e) => {
        const q = (e.target.value || '').toLowerCase().trim();
        this.renderDrawerList(q);
      });
    }

    // Tecla ESC para fechar menu, gaveta ou voltar para o Hub
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.elements.siteSidebar && this.elements.siteSidebar.classList.contains('is-open')) {
          this.closeSidebar();
        } else if (this.elements.drawerBackdrop && this.elements.drawerBackdrop.classList.contains('is-open')) {
          this.closeDrawer();
        } else if (this.elements.detailView && this.elements.detailView.style.display !== 'none' && this.elements.hubView) {
          this.openHub(true);
        } else if (this.activeTopicIndex !== 0) {
          this.selectTopic(0);
        }
      }
    });

    // Hash change na URL (navegação pelo histórico do navegador)
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '').trim();
      const matched = this.items.find(it => it.id === hash);
      if (matched) {
        this.openClass(matched.id, false);
      } else if (this.elements.hubView) {
        this.openHub(false);
      }
    });
  },

  toggleSidebar() {
    if (!this.elements.siteSidebar) return;
    const isOpen = this.elements.siteSidebar.classList.toggle('is-open');
    if (this.elements.sidebarBackdrop) {
      this.elements.sidebarBackdrop.classList.toggle('is-open', isOpen);
    }
  },

  closeSidebar() {
    if (this.elements.siteSidebar) {
      this.elements.siteSidebar.classList.remove('is-open');
    }
    if (this.elements.sidebarBackdrop) {
      this.elements.sidebarBackdrop.classList.remove('is-open');
    }
  },

  openHub(updateHash = true) {
    if (updateHash) {
      if (window.location.hash) {
        history.pushState(null, '', window.location.pathname + window.location.search);
      }
    }

    document.body.classList.remove('is-detail-view');
    document.body.classList.add('is-hub-view');

    if (this.elements.heroArt) {
      this.elements.heroArt.style.visibility = 'hidden';
      if (this.elements.heroArtG1) this.elements.heroArtG1.style.visibility = 'hidden';
      if (this.elements.heroArtG2) this.elements.heroArtG2.style.visibility = 'hidden';
    }

    if (this.elements.hubView) {
      this.elements.hubView.style.display = 'flex';
      if (this.mode === 'races') {
        this.elements.hubView.classList.add('hub-grid-mode');
      }
    }
    if (this.elements.detailView) {
      this.elements.detailView.style.display = 'none';
    }
    if (this.elements.hubSearch) {
      this.elements.hubSearch.value = '';
    }

    this.renderHubList();
    this.closeSidebar();
    window.scrollTo(0, 0);
  },

  openClass(id, updateHash = true) {
    const item = this.items.find(it => it.id === id);
    if (!item) return;

    if (updateHash) {
      window.location.hash = id;
    }

    document.body.classList.remove('is-hub-view');
    document.body.classList.add('is-detail-view');

    if (this.elements.heroArt) {
      this.elements.heroArt.style.visibility = 'hidden';
      if (this.elements.heroArtG1) this.elements.heroArtG1.style.visibility = 'hidden';
      if (this.elements.heroArtG2) this.elements.heroArtG2.style.visibility = 'hidden';
    }

    if (this.elements.hubView) {
      this.elements.hubView.style.display = 'none';
    }
    if (this.elements.detailView) {
      this.elements.detailView.style.display = 'flex';
    }

    if (this.elements.btnBackHub) {
      const backText = this.elements.btnBackHub.querySelector('.back-text');
      if (backText) {
        backText.textContent = this.mode === 'classes' ? 'Seleção de Classes' : 'Seleção de Raças';
      }
    }

    this.closeSidebar();
    this.selectItem(id, false);
    window.scrollTo(0, 0);
  },

  renderHubList(filterQuery = '') {
    const listContainer = this.elements.hubList || document.getElementById('showcase-hub-list');
    const gridContainer = this.elements.hubGrid || document.getElementById('showcase-hub-grid');
    if (!listContainer && !gridContainer) return;

    const q = (filterQuery || '').toLowerCase().trim();

    const filtered = this.items.filter(it => {
      const nameMatch = it.name.toLowerCase().includes(q) || it.id.toLowerCase().includes(q);
      const tags = this.classConcepts[it.id] || [];
      const tagMatch = tags.some(t => t.toLowerCase().includes(q));
      const descMatch = (it.description || '').toLowerCase().includes(q);
      return nameMatch || tagMatch || descMatch;
    });

    if (gridContainer) {
      gridContainer.innerHTML = '';
      if (filtered.length === 0) {
        gridContainer.innerHTML = `
          <div class="hub-list-empty" style="grid-column: 1 / -1;">
            Nenhuma raça encontrada para o filtro.
          </div>
        `;
        return;
      }

      filtered.forEach(it => {
        const card = document.createElement('div');
        card.className = 'hub-race-card font-scope-' + it.id;
        card.setAttribute('data-class', it.id);
        card.setAttribute('role', 'button');
        card.setAttribute('tabindex', '0');
        card.setAttribute('aria-label', 'Selecionar ' + it.name);

        const badgeText = it.badge || (this.mode === 'classes' ? 'ND 1' : 'ND 1');
        const ndMeta = this.getNDMeta(badgeText);
        const tags = this.classConcepts[it.id] || [];
        const tagChips = tags.slice(0, 2).map(t => `<span class="hub-race-chip">${t}</span>`).join('');
        const p = this.classPalettes[it.id] || { accent: '#7C3AED' };
        card.style.setProperty('--race-accent', p.accent);

        card.innerHTML = `
          <div class="hub-race-card-media">
            <img src="${it.imgSrc}" alt="${it.name}" loading="lazy" decoding="async">
            <div class="hub-race-media-overlay"></div>
            <div class="hub-race-nd-pill" style="color: ${ndMeta.color}; border-color: ${ndMeta.color};">
              ${badgeText}
            </div>
          </div>
          <div class="hub-race-card-body">
            <div class="hub-race-card-header">
              <h3 class="hub-race-card-title">${it.name}</h3>
              <div class="hub-race-chips-row">${tagChips}</div>
            </div>
            <p class="hub-race-card-desc">${it.description || ''}</p>
            <div class="hub-race-card-action">
              <span class="hub-race-action-text">Ver Dossiê da Raça</span>
              <span class="hub-race-action-arrow">&rarr;</span>
            </div>
          </div>
        `;

        card.addEventListener('click', () => {
          this.openClass(it.id, true);
        });

        card.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.openClass(it.id, true);
          }
        });

        gridContainer.appendChild(card);
      });
      return;
    }

    if (listContainer) {
      listContainer.innerHTML = '';
      if (filtered.length === 0) {
        listContainer.innerHTML = `
          <div class="hub-list-empty">
            Nenhuma classe encontrada para o filtro.
          </div>
        `;
        return;
      }

      filtered.forEach(it => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hub-class-btn font-scope-' + it.id;
        btn.setAttribute('data-class', it.id);
        btn.setAttribute('aria-label', 'Selecionar ' + it.name);

        const displayName = it.id === 'anomalo' ? 'ANOMALO' : it.name;

        btn.innerHTML = `
          <span class="hub-btn-name font-class-${it.id}">${displayName}</span>
          <span class="hub-btn-arrow">&#x2192;</span>
        `;

        btn.addEventListener('click', () => {
          this.openClass(it.id, true);
        });

        listContainer.appendChild(btn);
      });
    }
  },

  renderCompendium(item) {
    if (!this.elements.compendiumTabs || !this.elements.compendiumBody) return;

    // Tópicos textuais da classe (ignora tópico 0 de ilustração)
    const textTopics = item.topics.filter(t => !t.isIllustration);
    this.currentTextTopics = textTopics.length > 0 ? textTopics : item.topics;
    this.activeCompendiumIndex = 0;

    if (this.elements.compendiumSearch) {
      this.elements.compendiumSearch.value = '';
    }
    if (this.elements.compendiumSearchClear) {
      this.elements.compendiumSearchClear.style.display = 'none';
    }

    this.renderCompendiumTabs(this.currentTextTopics);

    let initialTopicIndex = 0;
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const targetTab = urlParams.get('tab');
      if (targetTab) {
        const norm = str => (str || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
        const normTarget = norm(targetTab);
        const foundIdx = this.currentTextTopics.findIndex(t => 
          norm(t.title).includes(normTarget) || 
          norm(t.fullTitle).includes(normTarget)
        );
        if (foundIdx !== -1) initialTopicIndex = foundIdx;
      }
    } catch (e) {}

    this.selectCompendiumTopic(initialTopicIndex);
  },

  updateTopicNavArrows() {
    const nav = this.elements.compendiumTopicNav || document.getElementById('compendium-topic-nav');
    const prev = this.elements.compendiumNavPrev || document.getElementById('compendium-nav-prev');
    const next = this.elements.compendiumNavNext || document.getElementById('compendium-nav-next');
    if (!nav) return;

    const maxScroll = Math.max(0, nav.scrollWidth - nav.clientWidth);
    const hasOverflow = maxScroll > 4;

    if (prev && next) {
      if (!hasOverflow) {
        prev.style.display = 'none';
        next.style.display = 'none';
        return;
      }

      prev.style.display = 'inline-flex';
      next.style.display = 'inline-flex';

      const atStart = nav.scrollLeft <= 4;
      const atEnd = nav.scrollLeft >= maxScroll - 4;

      prev.disabled = atStart;
      next.disabled = atEnd;
      prev.style.opacity = atStart ? '0.2' : '1';
      next.style.opacity = atEnd ? '0.2' : '1';
    }
  },

  renderCompendiumTabs(topicsList, searchQuery = '') {
    if (!this.elements.compendiumTabs) return;
    this.elements.compendiumTabs.innerHTML = '';

    if (topicsList.length === 0) {
      this.elements.compendiumTabs.innerHTML = `
        <div class="compendium-no-topics">Nenhum tópico encontrado</div>
      `;
      this.updateTopicNavArrows();
      return;
    }

    topicsList.forEach((topic, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'compendium-tab-btn' + (idx === this.activeCompendiumIndex ? ' active' : '');
      btn.textContent = topic.title;
      btn.title = topic.fullTitle || topic.title;

      btn.addEventListener('click', () => {
        this.selectCompendiumTopic(idx, topicsList);
      });

      this.elements.compendiumTabs.appendChild(btn);
    });

    setTimeout(() => this.updateTopicNavArrows(), 50);
  },

  selectCompendiumTopic(index, topicsList = null) {
    const list = topicsList || this.currentTextTopics || [];
    const topic = list[index];
    if (!topic) return;

    this.activeCompendiumIndex = index;

    // Atualiza estado ativo nas tabs e centraliza aba visível
    if (this.elements.compendiumTabs) {
      const chips = this.elements.compendiumTabs.querySelectorAll('.compendium-tab-btn');
      chips.forEach((c, i) => {
        const isActive = i === index;
        c.classList.toggle('active', isActive);
        if (isActive) {
          c.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
      });
      setTimeout(() => this.updateTopicNavArrows(), 280);
    }

    // Atualiza título do tópico ativo com animação glitch
    if (this.elements.compendiumTopicTitle) {
      this.elements.compendiumTopicTitle.classList.remove('is-glitching');
      void this.elements.compendiumTopicTitle.offsetWidth;
      this.elements.compendiumTopicTitle.textContent = topic.fullTitle || topic.title;
      this.elements.compendiumTopicTitle.classList.add('is-glitching');
      setTimeout(() => {
        if (this.elements.compendiumTopicTitle) {
          this.elements.compendiumTopicTitle.classList.remove('is-glitching');
        }
      }, 300);
    }

    // Injeta conteúdo com transição glitch suave
    if (this.elements.compendiumBody) {
      this.elements.compendiumBody.classList.remove('is-glitching');
      void this.elements.compendiumBody.offsetWidth;
      this.elements.compendiumBody.innerHTML = topic.contentHtml;
      this.elements.compendiumBody.classList.add('is-glitching');
      if (this.elements.compendiumPane) {
        this.elements.compendiumPane.scrollTop = 0;
      }
      setTimeout(() => {
        if (this.elements.compendiumBody) {
          this.elements.compendiumBody.classList.remove('is-glitching');
        }
      }, 300);
    }
  },

  filterCompendiumTopics(query = '') {
    const q = (query || '').toLowerCase().trim();

    if (this.elements.compendiumSearchClear) {
      this.elements.compendiumSearchClear.style.display = q ? 'block' : 'none';
    }

    if (!this.currentTextTopics) return;

    if (!q) {
      this.renderCompendiumTabs(this.currentTextTopics);
      this.selectCompendiumTopic(this.activeCompendiumIndex || 0, this.currentTextTopics);
      return;
    }

    // Filtra tópicos cujo título ou conteúdo contêm a busca
    const matches = this.currentTextTopics.filter(t => {
      const tMatch = (t.title || '').toLowerCase().includes(q) || (t.fullTitle || '').toLowerCase().includes(q);
      const cMatch = (t.contentHtml || '').toLowerCase().includes(q);
      return tMatch || cMatch;
    });

    this.renderCompendiumTabs(matches, q);
    if (matches.length > 0) {
      this.selectCompendiumTopic(0, matches);
    } else {
      if (this.elements.compendiumTopicTitle) {
        this.elements.compendiumTopicTitle.textContent = 'Nenhum resultado';
      }
      if (this.elements.compendiumBody) {
        this.elements.compendiumBody.innerHTML = `
          <div class="compendium-search-empty">
            <p>Nenhuma menção encontrada para "${query}". Tente buscar por habilidades, magias ou atributos.</p>
          </div>
        `;
      }
    }
  },

  openDrawer() {
    if (!this.elements.drawerBackdrop) return;
    this.renderDrawerList();
    this.elements.drawerBackdrop.classList.add('is-open');
    if (this.elements.drawerInput) {
      this.elements.drawerInput.value = '';
      setTimeout(() => this.elements.drawerInput.focus(), 120);
    }
  },

  closeDrawer() {
    if (!this.elements.drawerBackdrop) return;
    this.elements.drawerBackdrop.classList.remove('is-open');
  },

  renderDrawerList(query = '') {
    if (!this.elements.drawerList) return;
    this.elements.drawerList.innerHTML = '';

    const filtered = this.items.filter(it => 
      it.name.toLowerCase().includes(query) || it.id.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
      this.elements.drawerList.innerHTML = `
        <div style="padding: 18px; text-align: center; color: #9E9AA6; font-size: 0.88rem;">
          Nenhum resultado encontrado
        </div>
      `;
      return;
    }

    filtered.forEach(it => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'showcase-drawer-item' + (it.id === this.currentId ? ' active' : '');
      btn.innerHTML = `
        <span class="showcase-drawer-item-name">${it.name}</span>
        ${it.badge ? `<span class="showcase-drawer-item-badge">${it.badge}</span>` : ''}
      `;
      btn.addEventListener('click', () => {
        this.selectItem(it.id);
        this.closeDrawer();
      });
      this.elements.drawerList.appendChild(btn);
    });
  },

  getNDMeta(badgeText) {
    let ndNum = 1;
    const match = (badgeText || '').match(/(\d+)/);
    if (match) ndNum = parseInt(match[1], 10);

    let color = '#4ade80'; // Verde (ND 1)
    let tier = 'Iniciante';
    let glow = 'rgba(74, 222, 128, 0.7)';

    if (ndNum === 2) {
      color = '#facc15'; // Amarelo
      tier = 'Intermediário';
      glow = 'rgba(250, 204, 21, 0.7)';
    } else if (ndNum === 3) {
      color = '#fb923c'; // Laranja
      tier = 'Avançado';
      glow = 'rgba(251, 146, 60, 0.7)';
    } else if (ndNum >= 4) {
      color = '#ef4444'; // Vermelho
      tier = 'Extremo';
      glow = 'rgba(239, 68, 68, 0.8)';
    } else if (this.mode === 'races' && !match) {
      tier = 'Padrão';
    }

    return { ndNum, color, tier, glow };
  },

  selectItem(id, updateHash = true) {
    const item = this.items.find(it => it.id === id);
    if (!item) return;

    this.currentId = id;
    this.activeTopicIndex = 0;
    window.scrollTo(0, 0);

    // Aplica paleta temática dinâmica correspondente à ilustração da classe/raça
    this.applyClassTheme(item.id);

    if (updateHash) {
      window.location.hash = id;
    }

    if (this.elements.spotlightStage) {
      this.elements.spotlightStage.setAttribute('data-class', item.id);
    }
    if (this.elements.spotlightViewport) {
      this.elements.spotlightViewport.setAttribute('data-class', item.id);
    }

    // Label do botão hambúrguer no topo da esquerda (legado)
    if (this.elements.hamburgerLabel) {
      this.elements.hamburgerLabel.textContent = this.mode === 'classes' ? 'Classes' : 'Raças';
    }

    // Atualiza imagem central recortada com multi-layer glitch estilo Mesa Virtual
    const heroArt = this.elements.heroArt;
    const heroG1 = this.elements.heroArtG1 || document.getElementById('showcase-hero-art-g1');
    const heroG2 = this.elements.heroArtG2 || document.getElementById('showcase-hero-art-g2');
    const charWrap = this.elements.spotlightCharWrap || document.getElementById('spotlight-char-wrap');

    if (heroArt) {
      const newSrc = item.imgSrc;

      // Oculta imediatamente para NUNCA exibir ou vazar a arte da classe anterior
      heroArt.style.visibility = 'hidden';
      if (heroG1) heroG1.style.visibility = 'hidden';
      if (heroG2) heroG2.style.visibility = 'hidden';

      heroArt.setAttribute('data-class', item.id);
      if (heroG1) heroG1.setAttribute('data-class', item.id);
      if (heroG2) heroG2.setAttribute('data-class', item.id);

      if (newSrc) {
        const tempImg = new Image();
        tempImg.src = newSrc;

        const applyAndGlitch = () => {
          heroArt.src = newSrc;
          heroArt.alt = item.name;
          heroArt.style.display = 'block';
          heroArt.style.visibility = 'visible';

          if (heroG1) {
            heroG1.src = newSrc;
            heroG1.style.display = 'block';
            heroG1.style.visibility = 'visible';
          }
          if (heroG2) {
            heroG2.src = newSrc;
            heroG2.style.display = 'block';
            heroG2.style.visibility = 'visible';
          }

          if (charWrap) {
            charWrap.classList.remove('is-glitching-entrance');
            void charWrap.offsetWidth; // Força reflow para reiniciar animações em todas as 3 camadas
            charWrap.classList.add('is-glitching-entrance');

            if (this.glitchEntranceTimer) clearTimeout(this.glitchEntranceTimer);
            this.glitchEntranceTimer = setTimeout(() => {
              charWrap.classList.remove('is-glitching-entrance');
            }, 580);
          }

          SpotlightGlitchEngine.triggerBurst(5);
        };

        if (tempImg.complete) {
          applyAndGlitch();
        } else {
          tempImg.onload = applyAndGlitch;
        }
      } else {
        heroArt.style.display = 'none';
        if (heroG1) heroG1.style.display = 'none';
        if (heroG2) heroG2.style.display = 'none';
      }
    }

    // Nome na Camada 3 do Hero Spotlight com efeito glitch
    if (this.elements.spotlightTitle) {
      const spotlightName = item.id === 'anomalo' ? 'ANOMALO' : item.name;
      this.elements.spotlightTitle.textContent = spotlightName;
      this.elements.spotlightTitle.setAttribute('data-class', item.id);
      this.elements.spotlightTitle.className = 'spotlight-class-title font-class-' + item.id;
      this.elements.spotlightTitle.classList.remove('is-glitching');
      void this.elements.spotlightTitle.offsetWidth;
      this.elements.spotlightTitle.classList.add('is-glitching');
      setTimeout(() => {
        if (this.elements.spotlightTitle) this.elements.spotlightTitle.classList.remove('is-glitching');
      }, 340);
    }

    // Tags de Conceito na Camada 3 (Badges estilo fita adesiva com tilt na paleta da classe)
    if (this.elements.spotlightTags) {
      const tags = this.classConcepts[item.id] || ['COMBATE', 'TÁTICA', 'MESTRIA'];
      const styles = ['tag-tape-primary', 'tag-tape-dark', 'tag-tape-hazard'];
      this.elements.spotlightTags.innerHTML = tags.map((t, idx) => `
        <span class="spotlight-tag ${styles[idx % styles.length]}">${t}</span>
      `).join('');
    }

    // Sincroniza bigName legado se presente no DOM
    if (this.elements.bigName) {
      const spotlightName = item.id === 'anomalo' ? 'ANOMALO' : item.name;
      this.elements.bigName.textContent = spotlightName;
      this.elements.bigName.setAttribute('data-class', item.id);
      this.elements.bigName.className = 'showcase-big-name font-class-' + item.id;
    }

    // Metadados e Cores do ND
    const badgeText = item.badge || (this.mode === 'classes' ? 'ND 1' : 'Base');
    const ndMeta = this.getNDMeta(badgeText);
    const roleText = this.classRoles[item.id] || (this.mode === 'classes' ? 'DOSSIÊ TÁTICO' : 'HERANÇA RACIAL');

    // Indicador técnico de ND e Função Tática no TOPO do Hero Spotlight
    if (this.elements.spotlightNdIndicator) {
      this.elements.spotlightNdIndicator.textContent = `ND ${ndMeta.ndNum} // ${ndMeta.tier.toUpperCase()}`;
      this.elements.spotlightNdIndicator.style.color = ndMeta.color;
    }
    if (this.elements.spotlightRoleIndicator) {
      this.elements.spotlightRoleIndicator.textContent = roleText;
    }

    // Indicadores do Compêndio (Split View Coluna Direita)
    if (this.elements.compendiumNd) {
      this.elements.compendiumNd.textContent = `ND ${ndMeta.ndNum} // ${ndMeta.tier.toUpperCase()}`;
      this.elements.compendiumNd.style.color = ndMeta.color;
    }
    if (this.elements.compendiumRole) {
      this.elements.compendiumRole.textContent = roleText;
    }

    // Constrói abas e conteúdo do compêndio
    this.renderCompendium(item);

    // ND na lâmina direita (legado)
    if (this.elements.bladeNd) {
      this.elements.bladeNd.textContent = `ND ${ndMeta.ndNum}`;
      this.elements.bladeNd.style.color = ndMeta.color;
      this.elements.bladeNd.style.textShadow = `0 0 18px ${ndMeta.glow}, 2px 2px 0 #000000`;
    }

    // Tier de Dificuldade (legado)
    if (this.elements.ndTier) {
      this.elements.ndTier.textContent = ndMeta.tier;
      this.elements.ndTier.style.color = ndMeta.color;
      this.elements.ndTier.style.borderColor = ndMeta.color;
      this.elements.ndTier.style.background = `${ndMeta.color}25`;
      this.elements.ndTier.style.boxShadow = `0 0 12px ${ndMeta.glow}`;
    }

    // Marcadores da régua (gauge pips - legado)
    if (this.elements.ndGauge) {
      const pips = this.elements.ndGauge.querySelectorAll('.gauge-pip');
      pips.forEach((pip, idx) => {
        if (idx < ndMeta.ndNum) {
          pip.classList.add('active');
          pip.style.background = ndMeta.color;
          pip.style.boxShadow = `0 0 10px ${ndMeta.glow}`;
        } else {
          pip.classList.remove('active');
          pip.style.background = '#2C2833';
          pip.style.boxShadow = 'none';
        }
      });
    }

    // Atualiza badge no modal de conteúdo (legado)
    if (this.elements.ndBadge) {
      this.elements.ndBadge.textContent = badgeText;
      this.elements.ndBadge.style.borderColor = ndMeta.color;
      this.elements.ndBadge.style.color = ndMeta.color;
    }

    // Reconstrói a lista de tópicos legada (races.html)
    if (this.elements.topicTabs) {
      this.renderTopicsNav(item);
    }

    // Exibe a visualização de tópico legada (races.html)
    if (this.elements.artView || this.elements.contentView) {
      this.applyTopicView(item);
    }
  },

  renderTopicsNav(item) {
    if (!this.elements.topicTabs) return;
    this.elements.topicTabs.innerHTML = '';

    item.topics.forEach((topic, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'showcase-tab-btn' + (idx === this.activeTopicIndex ? ' active' : '');
      btn.textContent = topic.title;
      btn.title = topic.fullTitle || topic.title;

      btn.addEventListener('click', () => {
        this.selectTopic(idx);
      });

      this.elements.topicTabs.appendChild(btn);
    });
  },

  selectTopic(index) {
    const item = this.items.find(it => it.id === this.currentId);
    if (!item) return;

    this.activeTopicIndex = index;

    // Atualiza estado ativo nos botões da coluna esquerda
    if (this.elements.topicTabs) {
      const btns = this.elements.topicTabs.querySelectorAll('.showcase-tab-btn');
      btns.forEach((btn, idx) => {
        btn.classList.toggle('active', idx === index);
      });
    }

    this.applyTopicView(item);
  },

  applyTopicView(item) {
    const activeTopic = item.topics[this.activeTopicIndex] || item.topics[0];
    if (!activeTopic) return;

    // Se for o Tópico 0 (Ilustração), mostra o Hero Spotlight 2.5D no centro
    if (activeTopic.isIllustration) {
      if (this.elements.contentView) {
        this.elements.contentView.style.display = 'none';
      }
      if (this.elements.artView) {
        this.elements.artView.classList.remove('is-hidden');
        this.elements.artView.style.display = 'flex';
      }
      return;
    }

    // Se for qualquer outro tópico, SAI DA ILUSTRAÇÃO e MOSTRA O CONTEÚDO no centro
    if (this.elements.artView) {
      this.elements.artView.classList.add('is-hidden');
      this.elements.artView.style.display = 'none';
    }

    if (this.elements.contentView) {
      this.elements.contentView.style.display = 'flex';
      
      // Atualiza título do tópico ativo no cabeçalho do card central
      if (this.elements.topicActiveTitle) {
        this.elements.topicActiveTitle.textContent = activeTopic.fullTitle || activeTopic.title;
      }

      // Renderiza o conteúdo textual com fade suave
      if (this.elements.topicContent) {
        this.elements.topicContent.style.opacity = '0';
        this.elements.topicContent.style.transform = 'translateY(10px)';

        setTimeout(() => {
          this.elements.topicContent.innerHTML = activeTopic.contentHtml;
          this.elements.topicContent.scrollTop = 0;
          this.elements.topicContent.style.transition = 'opacity 0.22s ease, transform 0.22s ease';
          this.elements.topicContent.style.opacity = '1';
          this.elements.topicContent.style.transform = 'translateY(0)';
        }, 50);
      }
    }
  }
};
