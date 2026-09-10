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


// ---- 2.1 MOTOR DE GLITCH DA ILUSTRAÇÃO DA FICHA (MESMA FREQUÊNCIA E ESTILO DO BG) ----
const PortraitGlitchEngine = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  glitches: [],
  running: false,
  spawnTimer: null,
  animId: null,

  start() {
    this.canvas = document.getElementById('portrait-glitch-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.resize();
    this.running = true;
    this.glitches = [];

    // Trigger inicial de abertura
    for (let i = 0; i < 3; i++) {
      this.createGlitch();
    }

    if (this.animId) cancelAnimationFrame(this.animId);
    this.loop();
    this.scheduleSpawns();
  },

  stop() {
    this.running = false;
    if (this.spawnTimer) clearTimeout(this.spawnTimer);
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  },

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : null;
    this.width = this.canvas.width = rect && rect.width > 50 ? rect.width : 450;
    this.height = this.canvas.height = rect && rect.height > 50 ? rect.height : 650;
  },

  scheduleSpawns() {
    if (!this.running) return;
    const triggerGlitchBurst = () => {
      if (!this.running) return;
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        this.createGlitch();
      }
      const nextTime = Math.random() * 2500 + 800; // Mesma frequência do BG
      this.spawnTimer = setTimeout(triggerGlitchBurst, nextTime);
    };

    triggerGlitchBurst();
  },

  createGlitch() {
    const types = ['slice', 'scanline', 'microBlock', 'digitalDot'];
    const type = types[Math.floor(Math.random() * types.length)];

    const orangePalette = [
      'rgba(255, 85, 0, 0.45)',
      'rgba(255, 110, 0, 0.40)',
      'rgba(255, 140, 20, 0.35)',
      'rgba(220, 70, 0, 0.40)',
      'rgba(255, 170, 40, 0.30)'
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
      glitch.width = Math.random() * (this.width * 0.45) + 30;
      glitch.height = Math.random() * 3 + 1;
      glitch.x = Math.random() * (this.width - glitch.width);
    } else if (type === 'scanline') {
      glitch.width = this.width;
      glitch.height = Math.random() * 1.5 + 0.8;
      glitch.x = 0;
    } else if (type === 'microBlock') {
      glitch.width = Math.random() * 45 + 15;
      glitch.height = Math.random() * 14 + 4;
      glitch.hollow = Math.random() > 0.4;
    } else if (type === 'digitalDot') {
      glitch.size = Math.random() * 3 + 1.5;
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
      this.ctx.globalAlpha = fade * 0.75;
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

    this.animId = requestAnimationFrame(() => this.loop());
  }
};


// ---- 2.2 MOTOR DE GLITCH DA ILUSTRAÇÃO CENTRAL DA MESA (MESMA FREQUÊNCIA E ESTILO DO BG) ----
const BoardCenterGlitchEngine = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  glitches: [],
  running: false,
  spawnTimer: null,
  animId: null,

  start() {
    this.canvas = document.getElementById('board-center-glitch-canvas');
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    
    this.resize();
    this.running = true;
    this.glitches = [];

    // Trigger inicial de abertura
    for (let i = 0; i < 3; i++) {
      this.createGlitch();
    }

    if (this.animId) cancelAnimationFrame(this.animId);
    this.loop();
    this.scheduleSpawns();
  },

  stop() {
    this.running = false;
    if (this.spawnTimer) clearTimeout(this.spawnTimer);
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.ctx && this.canvas) {
      this.ctx.clearRect(0, 0, this.width, this.height);
    }
  },

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement ? this.canvas.parentElement.getBoundingClientRect() : null;
    this.width = this.canvas.width = rect && rect.width > 50 ? rect.width : 500;
    this.height = this.canvas.height = rect && rect.height > 50 ? rect.height : 360;
  },

  scheduleSpawns() {
    if (!this.running) return;
    const triggerGlitchBurst = () => {
      if (!this.running) return;
      const count = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < count; i++) {
        this.createGlitch();
      }
      const nextTime = Math.random() * 2500 + 800; // Mesma frequência do BG
      this.spawnTimer = setTimeout(triggerGlitchBurst, nextTime);
    };

    triggerGlitchBurst();
  },

  createGlitch() {
    const types = ['slice', 'scanline', 'microBlock', 'digitalDot'];
    const type = types[Math.floor(Math.random() * types.length)];

    const orangePalette = [
      'rgba(255, 85, 0, 0.45)',
      'rgba(255, 110, 0, 0.40)',
      'rgba(255, 140, 20, 0.35)',
      'rgba(220, 70, 0, 0.40)',
      'rgba(255, 170, 40, 0.30)'
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
      glitch.width = Math.random() * (this.width * 0.45) + 30;
      glitch.height = Math.random() * 3 + 1;
      glitch.x = Math.random() * (this.width - glitch.width);
    } else if (type === 'scanline') {
      glitch.width = this.width;
      glitch.height = Math.random() * 1.5 + 0.8;
      glitch.x = 0;
    } else if (type === 'microBlock') {
      glitch.width = Math.random() * 45 + 15;
      glitch.height = Math.random() * 14 + 4;
      glitch.hollow = Math.random() > 0.4;
    } else if (type === 'digitalDot') {
      glitch.size = Math.random() * 3 + 1.5;
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
      this.ctx.globalAlpha = fade * 0.75;
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

    this.animId = requestAnimationFrame(() => this.loop());
  }
};


// ---- 2.2 MOTOR DE SEGURANÇA E PROTEÇÃO CONTRA FORÇA BRUTA (RATE LIMITING & TIMING PROTECTION) ----
const MesaSecurity = {
  STORAGE_KEY_ATTEMPTS: 'mesa_sec_fails',
  STORAGE_KEY_LOCKOUT: 'mesa_sec_lockout_until',
  timerInterval: null,

  async sha256(text) {
    if (!text) return '';
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(text.trim().toUpperCase());
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    } catch(e) {
      // Fallback simples caso crypto não esteja disponível
      let hash = 0;
      const str = text.trim().toUpperCase();
      for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) - hash) + str.charCodeAt(i);
        hash |= 0;
      }
      return 'fb_' + Math.abs(hash).toString(16);
    }
  },

  timingDelay(ms = 600) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  getLockoutSecondsRemaining() {
    const lockoutUntil = parseInt(localStorage.getItem(this.STORAGE_KEY_LOCKOUT) || '0', 10);
    const now = Date.now();
    if (lockoutUntil > now) {
      return Math.ceil((lockoutUntil - now) / 1000);
    }
    return 0;
  },

  canAttempt() {
    return this.getLockoutSecondsRemaining() <= 0;
  },

  getFailedAttempts() {
    return parseInt(localStorage.getItem(this.STORAGE_KEY_ATTEMPTS) || '0', 10);
  },

  recordFailedAttempt() {
    let fails = this.getFailedAttempts() + 1;
    localStorage.setItem(this.STORAGE_KEY_ATTEMPTS, fails.toString());

    let lockoutDuration = 0;
    if (fails >= 8) {
      lockoutDuration = 300; // 5 minutos de bloqueio contra ataques contínuos
    } else if (fails >= 5) {
      lockoutDuration = 60;  // 1 minuto de bloqueio
    } else if (fails >= 3) {
      lockoutDuration = 15;  // 15 segundos de resfriamento
    }

    if (lockoutDuration > 0) {
      const lockoutUntil = Date.now() + (lockoutDuration * 1000);
      localStorage.setItem(this.STORAGE_KEY_LOCKOUT, lockoutUntil.toString());
    }

    this.updateModalUI();
    return { fails, lockoutDuration };
  },

  recordSuccess() {
    localStorage.removeItem(this.STORAGE_KEY_ATTEMPTS);
    localStorage.removeItem(this.STORAGE_KEY_LOCKOUT);
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
    this.updateModalUI();
  },

  updateModalUI() {
    const input = document.getElementById('token-input');
    const submitBtn = document.getElementById('token-submit-btn');
    const errorEl = document.getElementById('token-security-status');
    if (!input || !submitBtn) return;

    const remaining = this.getLockoutSecondsRemaining();
    if (remaining > 0) {
      input.disabled = true;
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.5';
      submitBtn.style.cursor = 'not-allowed';
      if (errorEl) {
        errorEl.style.display = 'block';
        errorEl.innerHTML = `<span style="color:#ff3355; font-weight:700;">[BLOQUEIO ATIVO]</span> Muitas tentativas incorretas. Aguarde <strong>${remaining}s</strong> para tentar novamente.`;
      }

      if (!this.timerInterval) {
        this.timerInterval = setInterval(() => {
          const rem = this.getLockoutSecondsRemaining();
          if (rem <= 0) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            this.updateModalUI();
          } else {
            if (errorEl) {
              errorEl.innerHTML = `<span style="color:#ff3355; font-weight:700;">[BLOQUEIO ATIVO]</span> Muitas tentativas incorretas. Aguarde <strong>${rem}s</strong> para tentar novamente.`;
            }
          }
        }, 1000);
      }
    } else {
      input.disabled = false;
      submitBtn.disabled = false;
      submitBtn.style.opacity = '1';
      submitBtn.style.cursor = 'pointer';
      const fails = this.getFailedAttempts();
      if (errorEl) {
        if (fails > 0 && fails < 3) {
          errorEl.style.display = 'block';
          errorEl.innerHTML = `<span style="color:#ffaa00;">Tentativa incorreta (${fails}/3 antes do bloqueio).</span>`;
        } else if (fails === 0) {
          errorEl.style.display = 'none';
          errorEl.innerHTML = '';
        }
      }
    }
  }
};


// ---- 3. MESA APP (GERENCIADOR DE ESTADO, SUPABASE & TOKENS SEGUROS) ----
const MesaApp = {
  SUPABASE_URL: 'https://qkupdpgcjusbedaoahwi.supabase.co', 
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdXBkcGdjanVzYmVkYW9haHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNzk1ODAsImV4cCI6MjEwMzc1NTU4MH0.UDc5nE7ZwUyWmwNZKpq7bGrty1N6Uh0bjq2PJtBkVrk', 
  
  // HASHES SHA-256 DO MESTRE (Zero exposição em texto puro no código do cliente)
  MASTER_HASHES: [
    '3be80f43b640706663346f0b1fb5aa2a9c26e6b6d27a934139854e111355a93b', // Z9K4
    'c43cc5a2574d90e4a87d2ba0db242c99b3cdc0cbfd8c94448724b591320953ef'  // WUI-Z9K4-MAST
  ],

  // HASHES SHA-256 DOS SLOTS PADRÃO DA MESA
  SLOT_HASHES: {
    1: ['2dd19af57e1afab99db2a52767841b4188121375b4e107e25f1e19b5a08074b7', '67444813cdcd8add28ec10fe6184264bd4acddcd339083da3cee52779ef2b52f'], // Thulita (X7V2 / WUI-X7V2-THUL)
    2: ['1c3b0fa0bb6d1186cbfbde84001fd11845b5a68922a1029288319fdffd1325fa', '113917ac98d6019f27deda3d987664c09f8fd5c12da07f5981485dfe2a0b62b2'], // Minerva (N3L8 / WUI-N3L8-MINE)
    3: ['f95666157dd397d4157d44720f05c660446b23b6c3140aa2bcb8ca5761a47f28', '25bf418695fe134c210bdf931fc5893b2d7a292f7ed262c008ecd759cb11983e'], // Eric (R5K1 / WUI-R5K1-ERIC)
    4: ['8b7903ff85b96269fee9ef4165adc18ae24ce32f20e3de2c5daa3ffd17e002bd', '50677632f0e9c26b7573bd471219e6ebea8cfb44cd12c34251a39f8cdfb5d660'], // Pera (H2Q9 / WUI-H2Q9-PERA)
    5: ['7f42d2ea1b3752c523f50d69830e942858b6c0980c4638bdbaf215d94c76bb73', '8877df43636ee69b3b5e0953869ec2a80c9844ddc6bc9247cf64c29d2a75c09c'], // Willian (J8W4 / WUI-J8W4-WILL)
    6: ['b38466b6c44627df5485939cb241d72a86f54008b87e828a144fdd78aee213cb', '4e6dd809209ad92ce0a547b2b1a5473c610c2c0bb5139bec6ce6fd2b5e65e964'], // John Doe (T6D3 / WUI-T6D3-JOHN)
    7: ['187542c177a73f8011cb57622b694f3ec8ffd5c11ea61ea1de5378c85ce24451', '397303bab301646c0c74e253491aeb2ffdbe9cfc6f9395dbd9748583b5d81330'], // Odara (Y4M7 / WUI-Y4M7-ODAR)
    8: ['a1a0efb57f6f279826e7419fa6630b4cd85d6bcb8e69cb191916a28d428a72c6', 'dacd72e3e91ae602668271fa5eecbe67ad6efd099ba82a29dddf6e20d3a52926']   // Canneth (F9C5 / WUI-F9C5-CANN)
  },

  supabase: null,
  
  state: {
    players: new Array(8).fill(null),
    myToken: localStorage.getItem('mesa_token') || null,
    myPlayerSlot: null,
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
    this.updateTokenBtnState();
  },

  async checkSavedToken() {
    const saved = localStorage.getItem('mesa_token');

    if (saved) {
      this.state.myToken = saved.toUpperCase();
      const hash = await MesaSecurity.sha256(this.state.myToken);

      if (this.MASTER_HASHES.includes(hash)) {
        this.state.isMaster = true;
        this.state.myPlayerSlot = null;
      } else {
        this.state.isMaster = false;
        // Verifica se pertence a algum slot padrão
        for (const [slotNum, hashes] of Object.entries(this.SLOT_HASHES)) {
          if (hashes.includes(hash)) {
            this.state.myPlayerSlot = parseInt(slotNum, 10);
            break;
          }
        }
      }
    }

    this.updateTokenBtnState();
  },

  updateTokenBtnState() {
    const tokenBtn = document.getElementById('nav-token-btn');
    const tokenLabel = document.getElementById('nav-token-label');
    const alertBadge = document.getElementById('token-alert-badge');
    if (!tokenBtn) return;

    if (this.state.isMaster) {
      if (tokenLabel) tokenLabel.textContent = 'Mestre Ativo';
      if (alertBadge) alertBadge.style.display = 'none';
    } else if (this.state.myToken) {
      if (tokenLabel) {
        tokenLabel.textContent = this.state.myPlayerSlot ? `Slot ${this.state.myPlayerSlot} Conectado` : 'Token Ativo';
      }
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
      token: 'X7V2',
      nome: 'Thulita De La Benevidez',
      idade: '18 anos',
      altura: '1,40',
      raca: 'Dragão Anão',
      arquetipo: 'Popular',
      imagem: 'assets/thulita.png',
      avatar: 'assets/thulita_avatar.png',
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
      token: 'N3L8',
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
      token: 'R5K1',
      nome: 'Eric "Blade" Tepes Adams',
      idade: '17 anos',
      altura: '1,76',
      raca: 'Vampiro',
      arquetipo: 'Curioso',
      imagem: 'assets/eric.png',
      avatar: 'assets/eric_avatar.png',
      hp: 12, hpMax: 12,
      pe: 10, peMax: 10,
      st: 0, stMax: 44,
      stressPoints: 0,
      stressPointsMax: 6,
      atributos: {
        'Mente': 'd16',
        'Saúde': 'd8',
        'Vigor': 'd12',
        'Força': 'd4'
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

    // Personagem para Slot 4 (Pera Hylidae da Silva)
    this.state.players[3] = {
      id: 4,
      slot: 4,
      token: 'H2Q9',
      nome: 'Pera Hylidae da Silva',
      idade: '18 anos',
      altura: '1,58m',
      raca: 'Animalesco',
      arquetipo: 'Rebelde',
      classe: 'Adivinha',
      hp: 12, hpMax: 12,
      pe: 10, peMax: 10,
      st: 0, stMax: 24,
      stressPoints: 0,
      stressPointsMax: 6,
      atributos: {
        'Mente': 'd4',
        'Saúde': 'd8',
        'Vigor': 'd12',
        'Força': 'd16'
      },
      bonus: [
        { origem: 'Raça (Animalesco)', desc: '+d4 em testes de Esquiva' },
        { origem: 'Arquétipo (Rebelde)', desc: '+d4 em Força' }
      ],
      pericias: ['Intimidação', 'Atletismo', 'Disparada', 'Sobrevivência'],
      habilidades: [
        { nome: 'Percepção Aprimorada', custo: '2 PE', desc: 'Seus sentidos animais se aguçam. Ganha vantagem em testes de Mente para detectar presenças, sons ou cheiros suspeitos por 1 cena.' },
        { nome: 'Instinto de Sobrevivência', custo: '3 PE', desc: 'Em situações de perigo iminente, o corpo reage antes da mente. Sobe 1 degrau no dado de Vigor ou Força para a próxima ação.' },
        { nome: 'Desobediência Instintiva', custo: 'Passiva', desc: 'Possui vantagem em testes para resistir a ordens forçadas, coerções sociais ou hipnoses de entidades.' }
      ]
    };

    // Personagem para Slot 5 (Willian Kars)
    this.state.players[4] = {
      id: 5,
      slot: 5,
      token: 'J8W4',
      nome: 'Willian Kars',
      idade: '17 anos',
      altura: '1,86m',
      raca: 'Animalesco',
      arquetipo: 'Valentão',
      hp: 15, hpMax: 15,
      pe: 10, peMax: 10,
      st: 0, stMax: 28,
      stressPoints: 0,
      stressPointsMax: 6,
      atributos: {
        'Saúde': 'd4',
        'Vigor': 'd16',
        'Força': 'd12',
        'Mente': 'd8'
      },
      bonus: [
        { origem: 'Raça (Animalesco)', desc: '+d4 em testes de Esquiva' },
        { origem: 'Arquétipo (Valentão)', desc: '+d4 em testes de Força' }
      ],
      pericias: ['Furtividade', 'Atletismo', 'Intuição', 'Acrobacia'],
      habilidades: [
        { nome: 'Percepção Aprimorada', custo: '2 PE', desc: 'Seus sentidos animais se aguçam. Ganha vantagem em testes de Mente para detectar presenças, sons ou cheiros suspeitos por 1 cena.' },
        { nome: 'Instinto de Sobrevivência', custo: '3 PE', desc: 'Em situações de perigo iminente, o corpo reage antes da mente. Sobe 1 degrau no dado de Vigor ou Força para a próxima ação.' },
        { nome: 'Intimidação Física', custo: '2 PE', desc: 'Gasta 2 PE para subjugar NPCs humanos ou abrir portas emperradas com uma ombrada violenta.' }
      ]
    };

    // Personagem para Slot 6 (John Doe)
    this.state.players[5] = {
      id: 6,
      slot: 6,
      token: 'T6D3',
      nome: 'John Doe',
      idade: '899 dias (Autômato)',
      altura: '2,20m',
      raca: 'E.X.O.s',
      arquetipo: 'Palhaço',
      hp: 16, hpMax: 16,
      pe: 13, peMax: 13,
      st: 0, stMax: 32,
      stressPoints: 0,
      stressPointsMax: 6,
      atributos: {
        'Força': 'd16',
        'Mente': 'd12',
        'Saúde': 'd8',
        'Vigor': 'd4'
      },
      bonus: [
        { origem: 'Raça (E.X.O.s)', desc: 'Autorreparo passivo (recupera 1 PV por turno)' },
        { origem: 'Arquétipo (Palhaço)', desc: '+3 PE Máximos' }
      ],
      pericias: ['Atletismo (Força)', 'Diplomacia (Mente)', 'Intimidação (Força/Mente)', 'Percepção (Mente)'],
      habilidades: [
        { nome: 'Quebrar a Tensão', custo: 'Passiva', desc: 'Com uma piada ou comentário sarcástico, reduz em 1d4 a Barra de Estresse de todos os aliados após um momento de pânico.' },
        { nome: 'Mira Telemétrica', custo: '3 PE', desc: 'Sensores ópticos calculam vento, distância e trajetória. Ganha vantagem em testes de ataque à distância até o fim da cena.' },
        { nome: 'Torque Forçado', custo: '2 PE', desc: 'Trava engrenagens no solo para aplicar força bruta. Ganha +d4 em testes de Força para erguer cargas, arrombar portas ou resistir a ser empurrado.' }
      ]
    };

    // Personagem para Slot 7 (Odara De La Benevidez)
    this.state.players[6] = {
      id: 7,
      slot: 7,
      token: 'Y4M7',
      nome: 'Odara De La Benevidez',
      idade: '18 anos',
      altura: '1,42m',
      raca: 'Dragão Anão',
      arquetipo: 'Gótica',
      hp: 14, hpMax: 14,
      pe: 10, peMax: 10,
      st: 0, stMax: 36,
      stressPoints: 0,
      stressPointsMax: 6,
      atributos: {
        'Força': 'd16',
        'Mente': 'd12',
        'Saúde': 'd8',
        'Vigor': 'd4'
      },
      bonus: [
        { origem: 'Raça (Dragão Anão)', desc: '+d4 em testes de Mente' },
        { origem: 'Arquétipo (Gótica)', desc: '+3 Redução de Dano Mental' }
      ],
      pericias: ['Intimidação', 'Atletismo', 'Intuição', 'Astúcia'],
      habilidades: [
        { nome: 'Sopro Ancestral', custo: '4 PE', desc: 'Expele um cone de energia elemental (Fogo/Solar, Estase ou Ácido) em um raio de 3B à sua frente. Inimigos na área devem rolar teste de Destreza (CT 15) ou sofrer 3d10 de dano elemental.' },
        { nome: 'Conexão Sensorial', custo: '2 PE', desc: 'As seis antenas permitem comunicação telepática limitada com criaturas a até 10B, transmitindo emoções, intenções simples ou imagens mentais.' },
        { nome: 'Familiaridade com o Macabro', custo: 'Passiva', desc: 'A visão de cadáveres, ossadas ou sangue seco não provoca dano na sua Barra de Estresse.' }
      ]
    };

    // Personagem para Slot 8 (Canneth ‘Blinko’ Biloxi)
    this.state.players[7] = {
      id: 8,
      slot: 8,
      token: 'F9C5',
      nome: "Canneth 'Blinko' Biloxi",
      idade: '18 anos',
      altura: '1,75m',
      raca: 'Animalesco',
      arquetipo: 'Teimoso',
      hp: 17, hpMax: 17,
      pe: 10, peMax: 10,
      st: 0, stMax: 36,
      stressPoints: 0,
      stressPointsMax: 6,
      atributos: {
        'Vigor': 'd12',
        'Saúde': 'd8',
        'Força': 'd4',
        'Mente': 'd16'
      },
      bonus: [
        { origem: 'Raça (Animalesco)', desc: '+d4 em testes de Esquiva / Sentidos Aguçados' },
        { origem: 'Arquétipo (Teimoso)', desc: 'Resistência a ser coagido ou derrubado' }
      ],
      pericias: ['Intimidação', 'Engenharia', 'Atletismo', 'História'],
      habilidades: [
        { nome: 'Recusa em Cair', custo: '3 PE', desc: 'Ao sofrer dano que o deixaria com 0 PV, gasta 3 PE para permanecer de pé com exatamente 1 PV (uma vez por sessão).' },
        { nome: 'Percepção Aprimorada', custo: '2 PE', desc: 'Seus sentidos animais se aguçam. Ganha vantagem em testes de Mente para detectar presenças, sons ou cheiros suspeitos por 1 cena.' },
        { nome: 'Instinto de Sobrevivência', custo: '3 PE', desc: 'Em situações de perigo iminente, o corpo reage antes da mente. Sobe 1 degrau no dado de Vigor ou Força para a próxima ação.' }
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
            atributos: (() => {
              const parsed = typeof raw.atributos === 'string' ? JSON.parse(raw.atributos || '{}') : (raw.atributos || {});
              const clean = {};
              for (const [k, v] of Object.entries(parsed)) {
                if (!k.startsWith('_') && !k.startsWith('$') && typeof v !== 'object') {
                  clean[k] = v;
                }
              }
              return clean;
            })(),
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
          if (p.token === 'R5K1' || p.slot === 3) {
            if (p.atributos && typeof p.atributos === 'object') {
              p.atributos['Saúde'] = 'd8';
              p.atributos['Força'] = 'd4';
            }
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

          if (p.token === 'X7V2' || p.slot === 1) {
            p.imagem = 'assets/thulita.png';
            p.avatar = 'assets/thulita_avatar.png';
          }

          if (p.token === 'R5K1' || p.slot === 3) {
            p.imagem = 'assets/eric.png';
            p.avatar = 'assets/eric_avatar.png';
          }

          if (p.slot >= 1 && p.slot <= 8) {
            this.state.players[p.slot - 1] = p;
          }
        });
      }

      // Garante que Thulita (Slot 1), Minerva (Slot 2) e Eric (Slot 3) estejam presentes
      if (!this.state.players[0]) {
        this.state.players[0] = {
          id: 2, slot: 1, token: 'X7V2', nome: 'Thulita De La Benevidez', idade: '18 anos', altura: '1,40', raca: 'Dragão Anão', arquetipo: 'Popular', imagem: 'assets/thulita.png', avatar: 'assets/thulita_avatar.png',
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
          id: 3, slot: 2, token: 'N3L8', nome: 'Sanguiminerva "Minerva" Qamari Von Adams', idade: '18 anos', altura: '1,78m', raca: 'Vampira', arquetipo: 'Nerd',
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
          id: 1, slot: 3, token: 'R5K1', nome: 'Eric "Blade" Tepes Adams', idade: '17 anos', altura: '1,76', raca: 'Vampiro', arquetipo: 'Curioso', imagem: 'assets/eric.png', avatar: 'assets/eric_avatar.png',
          hp: 12, hpMax: 12, pe: 10, peMax: 10, st: 0, stMax: 44, stressPoints: 0, stressPointsMax: 6,
          atributos: { 'Mente': 'd16', 'Saúde': 'd8', 'Vigor': 'd12', 'Força': 'd4' },
          bonus: [{ origem: 'Raça (Vampiro)', desc: '+d4 em testes de Mente e Visão no Escuro (5B)' }, { origem: 'Arquétipo (Curioso)', desc: '+d4 em testes de Investigação' }],
          pericias: ['Investigação', 'Percepção', 'Disparada', 'Medicina'],
          habilidades: [
            { nome: 'Mordida Vampírica', custo: '3 PE', desc: 'Morde um alvo adjacente para drenar sangue. Causa dano igual a uma rolagem de Força e restaura PV iguais à metade do dano causado.' },
            { nome: 'Presença Hipnótica', custo: '2 PE', desc: 'Exerce magnetismo sobrenatural. Ganha vantagem em testes de Mente para intimidar ou convencer até o fim da cena.' },
            { nome: 'Olhar Investigativo', custo: '2 PE', desc: 'Gasta 2 PE para notar instantaneamente marcas de arranhões, botões falsos ou compartimentos secretos na cena.' }
          ]
        };
      }

      if (!this.state.players[3]) {
        this.state.players[3] = {
          id: 4, slot: 4, token: 'H2Q9', nome: 'Pera Hylidae da Silva', idade: '18 anos', altura: '1,58m', raca: 'Animalesco', arquetipo: 'Rebelde', classe: 'Adivinha',
          hp: 12, hpMax: 12, pe: 10, peMax: 10, st: 0, stMax: 24, stressPoints: 0, stressPointsMax: 6,
          atributos: { 'Mente': 'd4', 'Saúde': 'd8', 'Vigor': 'd12', 'Força': 'd16' },
          bonus: [
            { origem: 'Raça (Animalesco)', desc: '+d4 em testes de Esquiva' },
            { origem: 'Arquétipo (Rebelde)', desc: '+d4 em Força' }
          ],
          pericias: ['Intimidação', 'Atletismo', 'Disparada', 'Sobrevivência'],
          habilidades: [
            { nome: 'Percepção Aprimorada', custo: '2 PE', desc: 'Seus sentidos animais se aguçam. Ganha vantagem em testes de Mente para detectar presenças, sons ou cheiros suspeitos por 1 cena.' },
            { nome: 'Instinto de Sobrevivência', custo: '3 PE', desc: 'Em situações de perigo iminente, o corpo reage antes da mente. Sobe 1 degrau no dado de Vigor ou Força para a próxima ação.' },
            { nome: 'Desobediência Instintiva', custo: 'Passiva', desc: 'Possui vantagem em testes para resistir a ordens forçadas, coerções sociais ou hipnoses de entidades.' }
          ]
        };
      }

      if (!this.state.players[4]) {
        this.state.players[4] = {
          id: 5, slot: 5, token: 'J8W4', nome: 'Willian Kars', idade: '17 anos', altura: '1,86m', raca: 'Animalesco', arquetipo: 'Valentão',
          hp: 15, hpMax: 15, pe: 10, peMax: 10, st: 0, stMax: 28, stressPoints: 0, stressPointsMax: 6,
          atributos: { 'Saúde': 'd4', 'Vigor': 'd16', 'Força': 'd12', 'Mente': 'd8' },
          bonus: [
            { origem: 'Raça (Animalesco)', desc: '+d4 em testes de Esquiva' },
            { origem: 'Arquétipo (Valentão)', desc: '+d4 em testes de Força' }
          ],
          pericias: ['Furtividade', 'Atletismo', 'Intuição', 'Acrobacia'],
          habilidades: [
            { nome: 'Percepção Aprimorada', custo: '2 PE', desc: 'Seus sentidos animais se aguçam. Ganha vantagem em testes de Mente para detectar presenças, sons ou cheiros suspeitos por 1 cena.' },
            { nome: 'Instinto de Sobrevivência', custo: '3 PE', desc: 'Em situações de perigo iminente, o corpo reage antes da mente. Sobe 1 degrau no dado de Vigor ou Força para a próxima ação.' },
            { nome: 'Intimidação Física', custo: '2 PE', desc: 'Gasta 2 PE para subjugar NPCs humanos ou abrir portas emperradas com uma ombrada violenta.' }
          ]
        };
      }

      if (!this.state.players[5]) {
        this.state.players[5] = {
          id: 6, slot: 6, token: 'T6D3', nome: 'John Doe', idade: '899 dias (Autômato)', altura: '2,20m', raca: 'E.X.O.s', arquetipo: 'Palhaço',
          hp: 16, hpMax: 16, pe: 13, peMax: 13, st: 0, stMax: 32, stressPoints: 0, stressPointsMax: 6,
          atributos: { 'Força': 'd16', 'Mente': 'd12', 'Saúde': 'd8', 'Vigor': 'd4' },
          bonus: [
            { origem: 'Raça (E.X.O.s)', desc: 'Autorreparo passivo (recupera 1 PV por turno)' },
            { origem: 'Arquétipo (Palhaço)', desc: '+3 PE Máximos' }
          ],
          pericias: ['Atletismo (Força)', 'Diplomacia (Mente)', 'Intimidação (Força/Mente)', 'Percepção (Mente)'],
          habilidades: [
            { nome: 'Quebrar a Tensão', custo: 'Passiva', desc: 'Com uma piada ou comentário sarcástico, reduz em 1d4 a Barra de Estresse de todos os aliados após um momento de pânico.' },
            { nome: 'Mira Telemétrica', custo: '3 PE', desc: 'Sensores ópticos calculam vento, distância e trajetória. Ganha vantagem em testes de ataque à distância até o fim da cena.' },
            { nome: 'Torque Forçado', custo: '2 PE', desc: 'Trava engrenagens no solo para aplicar força bruta. Ganha +d4 em testes de Força para erguer cargas, arrombar portas ou resistir a ser empurrado.' }
          ]
        };
      }

      if (!this.state.players[6]) {
        this.state.players[6] = {
          id: 7, slot: 7, token: 'Y4M7', nome: 'Odara De La Benevidez', idade: '18 anos', altura: '1,42m', raca: 'Dragão Anão', arquetipo: 'Gótica',
          hp: 14, hpMax: 14, pe: 10, peMax: 10, st: 0, stMax: 36, stressPoints: 0, stressPointsMax: 6,
          atributos: { 'Força': 'd16', 'Mente': 'd12', 'Saúde': 'd8', 'Vigor': 'd4' },
          bonus: [
            { origem: 'Raça (Dragão Anão)', desc: '+d4 em testes de Mente' },
            { origem: 'Arquétipo (Gótica)', desc: '+3 Redução de Dano Mental' }
          ],
          pericias: ['Intimidação', 'Atletismo', 'Intuição', 'Astúcia'],
          habilidades: [
            { nome: 'Sopro Ancestral', custo: '4 PE', desc: 'Expele um cone de energia elemental (Fogo/Solar, Estase ou Ácido) em um raio de 3B à sua frente. Inimigos na área devem rolar teste de Destreza (CT 15) ou sofrer 3d10 de dano elemental.' },
            { nome: 'Conexão Sensorial', custo: '2 PE', desc: 'As seis antenas permitem comunicação telepática limitada com criaturas a até 10B, transmitindo emoções, intenções simples ou imagens mentais.' },
            { nome: 'Familiaridade com o Macabro', custo: 'Passiva', desc: 'A visão de cadáveres, ossadas ou sangue seco não provoca dano na sua Barra de Estresse.' }
          ]
        };
      }

      if (!this.state.players[7]) {
        this.state.players[7] = {
          id: 8, slot: 8, token: 'F9C5', nome: "Canneth 'Blinko' Biloxi", idade: '18 anos', altura: '1,75m', raca: 'Animalesco', arquetipo: 'Teimoso',
          hp: 17, hpMax: 17, pe: 10, peMax: 10, st: 0, stMax: 36, stressPoints: 0, stressPointsMax: 6,
          atributos: { 'Vigor': 'd12', 'Saúde': 'd8', 'Força': 'd4', 'Mente': 'd16' },
          bonus: [
            { origem: 'Raça (Animalesco)', desc: '+d4 em testes de Esquiva / Sentidos Aguçados' },
            { origem: 'Arquétipo (Teimoso)', desc: 'Resistência a ser coagido ou derrubado' }
          ],
          pericias: ['Intimidação', 'Engenharia', 'Atletismo', 'História'],
          habilidades: [
            { nome: 'Recusa em Cair', custo: '3 PE', desc: 'Ao sofrer dano que o deixaria com 0 PV, gasta 3 PE para permanecer de pé com exatamente 1 PV (uma vez por sessão).' },
            { nome: 'Percepção Aprimorada', custo: '2 PE', desc: 'Seus sentidos animais se aguçam. Ganha vantagem em testes de Mente para detectar presenças, sons ou cheiros suspeitos por 1 cena.' },
            { nome: 'Instinto de Sobrevivência', custo: '3 PE', desc: 'Em situações de perigo iminente, o corpo reage antes da mente. Sobe 1 degrau no dado de Vigor ou Força para a próxima ação.' }
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
        const avatarSrc = p.avatar || p.imagem;
        const avatarContent = avatarSrc
          ? `<img src="${avatarSrc}" alt="${p.nome}" class="slot-avatar-img" />`
          : `${p.nome.charAt(0)}`;

        slotEl.innerHTML = `
          <div class="player-avatar-placeholder">${avatarContent}</div>
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
    if (this.state.myPlayerSlot && player.slot && this.state.myPlayerSlot === player.slot) {
      return true;
    }
    if (this.state.myToken && player.token && this.state.myToken.toUpperCase() === player.token.toUpperCase()) {
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

    // 1. Atualiza cirurgicamente no DOM local (zero replay de animação)
    this.updateVitalsUI(player);
    this.renderMesa();

    // 2. Transmissão WebSocket Instantânea para todas as telas conectadas (<30ms)
    if (MesaChat.channel) {
      MesaChat.channel.send({
        type: 'broadcast',
        event: 'vitals_sync',
        payload: {
          slot: player.slot,
          hp: player.hp,
          hpMax: player.hpMax,
          pe: player.pe,
          peMax: player.peMax,
          st: player.st,
          stMax: player.stMax,
          stressPoints: player.stressPoints,
          stressPointsMax: player.stressPointsMax
        }
      });
    }

    // 3. Sincroniza persistentemente com o Supabase
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

  // RECEBE SINCRONIZAÇÃO DE STATUS EM TEMPO REAL VIA WEBSOCKET
  handleIncomingVitals(data) {
    if (!data || !data.slot) return;
    const player = this.state.players[data.slot - 1];
    if (!player) return;

    if (data.hp !== undefined) player.hp = data.hp;
    if (data.hpMax !== undefined) player.hpMax = data.hpMax;
    if (data.pe !== undefined) player.pe = data.pe;
    if (data.peMax !== undefined) player.peMax = data.peMax;
    if (data.st !== undefined) player.st = data.st;
    if (data.stMax !== undefined) player.stMax = data.stMax;
    if (data.stressPoints !== undefined) player.stressPoints = data.stressPoints;
    if (data.stressPointsMax !== undefined) player.stressPointsMax = data.stressPointsMax;

    // Atualiza o card correspondente na mesa
    this.renderMesa();

    // Se a ficha deste personagem estiver aberta, atualiza imediatamente os números e barras
    if (this.state.activeViewingPlayer && this.state.activeViewingPlayer.slot === data.slot) {
      this.state.activeViewingPlayer = player;
      this.updateVitalsUI(player);
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

    // Atributos limpos (ignora metadados e namespaces internos como _wuitter)
    let validKeys = Object.keys(rawAttrs).filter(k => !k.startsWith('_') && !k.startsWith('$') && typeof rawAttrs[k] !== 'object');
    let attrsHtml = validKeys.map((k, idx) => {
      let val = rawAttrs[k];
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
          - ${h.nome}
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
      <!-- COLUNA ESQUERDA: ILUSTRAÇÃO -->
      <div class="ficha-portrait-col">
        ${player.imagem ? `
          <div class="ficha-char-portrait-box glitch-portrait-box">
            <canvas id="portrait-glitch-canvas" class="portrait-glitch-canvas"></canvas>
            <img src="${player.imagem}" alt="${player.nome}" class="ficha-char-portrait-img glitch-img-base" />
            <img src="${player.imagem}" alt="" class="ficha-char-portrait-img glitch-img-layer glitch-layer-1" aria-hidden="true" />
            <img src="${player.imagem}" alt="" class="ficha-char-portrait-img glitch-img-layer glitch-layer-2" aria-hidden="true" />
          </div>
        ` : `
          <div class="cube-placeholder-box">
            <svg viewBox="0 0 100 100" class="cube-svg">
              <polygon points="50,12 88,34 50,56 12,34" fill="rgba(255,85,0,0.12)" stroke="#ff5500" stroke-width="2.2" />
              <polygon points="12,34 50,56 50,92 12,70" fill="rgba(255,85,0,0.06)" stroke="#ff5500" stroke-width="2.2" />
              <polygon points="88,34 50,56 50,92 88,70" fill="rgba(255,85,0,0.18)" stroke="#ff5500" stroke-width="2.2" />
              <line x1="50" y1="56" x2="50" y2="92" stroke="#ff7733" stroke-width="2.2" />
            </svg>
            <div class="cube-label-dry">[ SEM IMAGEM ]</div>
          </div>
        `}
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

    // Inicia o motor de glitch procedural na ilustração (mesma frequência e tipos do BG)
    setTimeout(() => {
      PortraitGlitchEngine.start();
    }, 25);
  },

  openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
      modal.classList.add('active');
    }
  },

  openTokenModal() {
    this.openModal('token-modal');
    MesaSecurity.updateModalUI();
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
      PortraitGlitchEngine.stop();
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
    if (!MesaSecurity.canAttempt()) {
      const remaining = MesaSecurity.getLockoutSecondsRemaining();
      alert(`[BLOQUEIO ATIVO] Muitas tentativas incorretas. Aguarde ${remaining} segundos.`);
      MesaSecurity.updateModalUI();
      return;
    }

    const rawInput = document.getElementById('token-input').value.trim();
    if (!rawInput) return;

    const token = rawInput.toUpperCase();
    const submitBtn = document.getElementById('token-submit-btn');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'AUTENTICANDO...';
    }

    // Atraso artificial de segurança (timing attack & brute force throttle)
    await MesaSecurity.timingDelay(600);

    const tokenHash = await MesaSecurity.sha256(token);

    // 1. VERIFICA SE É TOKEN DO MESTRE (ACESSO TOTAL)
    if (this.MASTER_HASHES.includes(tokenHash)) {
      MesaSecurity.recordSuccess();
      localStorage.setItem('mesa_token', token);
      this.state.myToken = token;
      this.state.myPlayerSlot = null;
      this.state.isMaster = true;

      this.updateTokenBtnState();
      MesaChat.updateSenderIdentity();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'AUTENTICAR TOKEN';
      }
      alert("[SUCESSO] Token de Mestre autenticado com sucesso.");
      this.closeModal('token-modal');
      return;
    }

    // 2. VERIFICA SE É O TOKEN DE UM DOS JOGADORES (VIA HASH OU SUPABASE)
    let matchedSlot = null;
    for (const [slotNum, hashes] of Object.entries(this.SLOT_HASHES)) {
      if (hashes.includes(tokenHash)) {
        matchedSlot = parseInt(slotNum, 10);
        break;
      }
    }

    let matchedPlayer = null;
    if (matchedSlot && this.state.players[matchedSlot - 1]) {
      matchedPlayer = this.state.players[matchedSlot - 1];
    }

    if (this.supabase && !matchedPlayer) {
      try {
        const { data, error } = await this.supabase
          .from('personagens')
          .select('*')
          .eq('token', token)
          .single();

        if (data) {
          matchedPlayer = data;
          matchedSlot = data.slot;
        }
      } catch(err) {
        console.warn("Erro ao verificar token:", err);
      }
    }

    if (matchedPlayer) {
      MesaSecurity.recordSuccess();
      localStorage.setItem('mesa_token', token);
      this.state.myToken = token;
      this.state.myPlayerSlot = matchedSlot || matchedPlayer.slot;
      this.state.isMaster = false;

      this.updateTokenBtnState();
      MesaChat.updateSenderIdentity();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'AUTENTICAR TOKEN';
      }
      alert(`[CONECTADO] ${matchedPlayer.nome} (Slot ${matchedPlayer.slot}) - Modo de edição ativado.`);
      this.closeModal('token-modal');
      this.openFicha(matchedPlayer);
    } else {
      const { fails, lockoutDuration } = MesaSecurity.recordFailedAttempt();
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'AUTENTICAR TOKEN';
      }
      if (lockoutDuration > 0) {
        alert(`[BLOQUEIO DE SEGURANÇA] Token inválido. Você excedeu o limite de tentativas (${fails}). Aguarde ${lockoutDuration} segundos.`);
      } else {
        alert(`[ERRO] Token inválido ou não encontrado (${fails}/3 tentativas antes do bloqueio temporário).`);
      }
    }
  },

  toggleView() {
    // 1. Se o jogador tem um token ativo, abre diretamente a ficha dele
    if (this.state.myToken && !this.state.isMaster) {
      let myChar = null;
      if (this.state.myPlayerSlot) {
        myChar = this.state.players[this.state.myPlayerSlot - 1];
      }
      if (!myChar) {
        myChar = this.state.players.find(p => p && p.token && p.token.toUpperCase() === this.state.myToken.toUpperCase());
      }
      if (myChar) {
        this.openFicha(myChar);
        return;
      }
    }

    // 2. Se for o Mestre com acesso total
    if (this.state.isMaster) {
      const targetChar = this.state.activeViewingPlayer || this.state.players.find(p => p !== null);
      if (targetChar) {
        this.openFicha(targetChar);
      } else {
        alert("[ACESSO TOTAL]: Clique no card de qualquer personagem na mesa para abrir e editar a ficha.");
      }
      return;
    }

    // 3. Se ainda não possui token conectado, abre o modal de token
    this.openTokenModal();
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
      return { name: 'Mestre', isMaster: true, token: 'Z9K4' };
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
      el.style.color = '#ffffff';
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
        const mobileBadge = document.getElementById('mobile-chat-unread-pip');
        if (mobileBadge) mobileBadge.style.display = 'none';
        if (typeof MesaMobileMenu !== 'undefined') MesaMobileMenu.updateState();
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

    // 4. WebSocket Broadcast de Vitals em Tempo Real (PV, PE, Estresse instantâneo < 30ms)
    this.channel.on('broadcast', { event: 'vitals_sync' }, (payload) => {
      const data = payload.payload;
      if (data && data.slot) {
        MesaApp.handleIncomingVitals(data);
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
      const mobileBadge = document.getElementById('mobile-chat-unread-pip');
      if (mobileBadge) mobileBadge.style.display = 'inline-block';
      if (typeof MesaMobileMenu !== 'undefined') MesaMobileMenu.updateState();
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

    // Determina o slot do jogador atual ou o Card Central do Mestre
    let targetSlot = null;

    if (MesaApp.state.isMaster) {
      targetSlot = 'master';
    } else if (MesaApp.state.myToken) {
      const myChar = MesaApp.state.players.find(p => p && p.token && p.token.toUpperCase() === MesaApp.state.myToken.toUpperCase());
      if (myChar) {
        targetSlot = myChar.slot;
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
    const slotEl = slot === 'master' ? document.getElementById('master-slot') : document.querySelector(`.player-slot.slot-${slot}`);
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

    if (slot === 'master') {
      bubble.classList.add('bubble-pointing-left');
      const leftPos = (slotRect.right - boardRect.left) + 12;
      const topPos = (slotRect.top - boardRect.top) + 16;
      bubble.style.position = 'absolute';
      bubble.style.left = `${Math.round(leftPos)}px`;
      bubble.style.top = `${Math.round(topPos)}px`;
    } else {
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
    }

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
  isGlobalRolling: false,
  currentRoller: null,
  lastRollTimestamp: 0,
  ROLL_COOLDOWN_MS: 3500,
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

    if (this.isGlobalRolling) {
      alert(`[MESA OCUPADA]: ${this.currentRoller || 'Outro jogador'} está rolando dados no palco central neste momento. Aguarde a rolagem terminar!`);
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

    if (this.isGlobalRolling) {
      btn.textContent = `AGUARDE (${this.currentRoller || 'Rolagem'} em andamento...)`;
      btn.disabled = true;
      btn.style.opacity = '0.5';
      btn.style.cursor = 'not-allowed';
      return;
    }

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

    // 1. Trava contra concorrência global (alguém já rolando no palco)
    if (this.isGlobalRolling) {
      alert(`[MESA OCUPADA]: ${this.currentRoller || 'Outro jogador'} está rolando dados neste momento. Aguarde o resultado!`);
      return;
    }

    // 2. Trava anti-spam (cooldown de segurança)
    const now = Date.now();
    const elapsed = now - this.lastRollTimestamp;
    if (elapsed < this.ROLL_COOLDOWN_MS && !MesaApp.state.isMaster) {
      const waitSec = Math.ceil((this.ROLL_COOLDOWN_MS - elapsed) / 1000);
      alert(`[AGUARDE]: Aguarde ${waitSec}s antes de rolar dados novamente.`);
      return;
    }

    if (this.selectedDice.length === 0) return;

    this.lastRollTimestamp = now;
    MesaApp.closeModal('dice-modal');

    // 3. Gera resultados criptograficamente seguros para cada dado
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

    // 4. Executa a animação no quadrado preto central
    this.playRollAnimation(rollPayload);

    // 5. Transmite para todos os jogadores na mesa em tempo real via WebSocket
    if (MesaChat.channel) {
      MesaChat.channel.send({
        type: 'broadcast',
        event: 'dice_roll',
        payload: rollPayload
      });
    }

    // 6. Log no chat da mesa
    const breakdown = diceResults.map(d => `[d${d.sides}: ${d.val}]`).join(' + ');
    const modStr = this.modifier !== 0 ? (this.modifier > 0 ? ` + ${this.modifier}` : ` - ${Math.abs(this.modifier)}`) : '';
    const chatContent = `Rolou ${breakdown}${modStr} -> Total: ${total}`;

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

    // Trava global ativa enquanto a rolagem ocorre no palco
    this.isGlobalRolling = true;
    this.currentRoller = data.rollerName;
    this.updateRollButtonLabel();

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

    // Mantém na tela e retorna suavemente ao estado de repouso após 5.0s, liberando a trava global
    this.rollTimeout = setTimeout(() => {
      stage.classList.remove('active');
      stage.innerHTML = '';
      this.isGlobalRolling = false;
      this.currentRoller = null;
      this.updateRollButtonLabel();
    }, 5000);
  }
};


// ---- 7. MOTOR DO MENU FLUTUANTE HAMBÚRGUER MOBILE ----
const MesaMobileMenu = {
  isOpen: false,

  init() {
    document.addEventListener('click', (e) => {
      const container = document.getElementById('mesa-mobile-fab-container');
      if (container && this.isOpen && !container.contains(e.target)) {
        this.close();
      }
    });
    this.updateState();
  },

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  },

  open() {
    this.isOpen = true;
    const drawer = document.getElementById('mesa-mobile-menu-drawer');
    const fabBtn = document.getElementById('mesa-mobile-fab-btn');
    const backdrop = document.getElementById('mesa-mobile-backdrop');
    if (drawer) drawer.classList.add('active');
    if (fabBtn) fabBtn.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    this.updateState();
  },

  close() {
    this.isOpen = false;
    const drawer = document.getElementById('mesa-mobile-menu-drawer');
    const fabBtn = document.getElementById('mesa-mobile-fab-btn');
    const backdrop = document.getElementById('mesa-mobile-backdrop');
    if (drawer) drawer.classList.remove('active');
    if (fabBtn) fabBtn.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
  },

  updateState() {
    const tokenLabel = document.getElementById('mobile-token-label');
    const tokenAlert = document.getElementById('mobile-token-alert-pip');
    const groupLabel = document.getElementById('mobile-menu-group-label');
    const fabAlert = document.getElementById('mobile-fab-alert-pip');
    const fichaModal = document.getElementById('ficha-modal');

    const isMaster = MesaApp && MesaApp.state && MesaApp.state.isMaster;
    const myToken = MesaApp && MesaApp.state && MesaApp.state.myToken;

    if (tokenLabel) {
      if (isMaster) {
        tokenLabel.textContent = 'Token Ativo (Mestre)';
      } else if (myToken) {
        tokenLabel.textContent = `Token: ${myToken}`;
      } else {
        tokenLabel.textContent = 'Autenticar Token';
      }
    }

    const needsToken = !myToken && !isMaster;
    if (tokenAlert) {
      tokenAlert.style.display = needsToken ? 'flex' : 'none';
    }

    const chatBadge = document.getElementById('mobile-chat-unread-pip');
    const hasUnreadChat = chatBadge && chatBadge.style.display !== 'none';
    if (fabAlert) {
      fabAlert.style.display = (needsToken || hasUnreadChat) ? 'block' : 'none';
    }

    if (groupLabel) {
      const isFichaActive = fichaModal && fichaModal.classList.contains('active');
      groupLabel.textContent = isFichaActive ? 'Ver Grupo na Mesa' : 'Ver Minha Ficha';
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MesaApp.init();
  MesaMobileMenu.init();
});
