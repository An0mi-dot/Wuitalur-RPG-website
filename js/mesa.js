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
  
  // HASHES SHA-256 DO MESTRE
  MASTER_HASHES: [
    '3be80f43b640706663346f0b1fb5aa2a9c26e6b6d27a934139854e111355a93b',
    'c43cc5a2574d90e4a87d2ba0db242c99b3cdc0cbfd8c94448724b591320953ef'
  ],

  // HASHES SHA-256 DOS SLOTS PADRÃO DA MESA
  SLOT_HASHES: {
    1: ['2dd19af57e1afab99db2a52767841b4188121375b4e107e25f1e19b5a08074b7', '67444813cdcd8add28ec10fe6184264bd4acddcd339083da3cee52779ef2b52f'], // Slot 1
    2: ['1c3b0fa0bb6d1186cbfbde84001fd11845b5a68922a1029288319fdffd1325fa', '113917ac98d6019f27deda3d987664c09f8fd5c12da07f5981485dfe2a0b62b2'], // Slot 2
    3: ['f95666157dd397d4157d44720f05c660446b23b6c3140aa2bcb8ca5761a47f28', '25bf418695fe134c210bdf931fc5893b2d7a292f7ed262c008ecd759cb11983e'], // Slot 3
    4: ['8b7903ff85b96269fee9ef4165adc18ae24ce32f20e3de2c5daa3ffd17e002bd', '50677632f0e9c26b7573bd471219e6ebea8cfb44cd12c34251a39f8cdfb5d660'], // Slot 4
    5: ['7f42d2ea1b3752c523f50d69830e942858b6c0980c4638bdbaf215d94c76bb73', '8877df43636ee69b3b5e0953869ec2a80c9844ddc6bc9247cf64c29d2a75c09c'], // Slot 5
    6: ['b38466b6c44627df5485939cb241d72a86f54008b87e828a144fdd78aee213cb', '4e6dd809209ad92ce0a547b2b1a5473c610c2c0bb5139bec6ce6fd2b5e65e964'], // Slot 6
    7: ['187542c177a73f8011cb57622b694f3ec8ffd5c11ea61ea1de5378c85ce24451', '397303bab301646c0c74e253491aeb2ffdbe9cfc6f9395dbd9748583b5d81330'], // Slot 7
    8: ['a1a0efb57f6f279826e7419fa6630b4cd85d6bcb8e69cb191916a28d428a72c6', 'dacd72e3e91ae602668271fa5eecbe67ad6efd099ba82a29dddf6e20d3a52926']   // Slot 8
  },

  supabase: null,
  
  state: {
    players: new Array(8).fill(null),
    myToken: localStorage.getItem('wu_user_token') || localStorage.getItem('mesa_token') || null,
    myPlayerSlot: null,
    isMaster: false,
    activeViewingPlayer: null
  },

  async init(initialToken = null) {
    console.log("Inicializando Mesa Virtual...");

    GlitchEngine.init();
    FichaParticlesEngine.init();

    const tokenToValidate = initialToken || localStorage.getItem('wu_user_token') || localStorage.getItem('mesa_token');

    if (this.SUPABASE_URL && this.SUPABASE_KEY && window.supabase) {
      this.supabase = window.supabase.createClient(this.SUPABASE_URL, this.SUPABASE_KEY);
      await this.fetchPlayers();
      this.subscribeToRealtime();
    } else {
      console.warn("Supabase não disponível. Exibindo dados locais.");
      this.loadMockData();
    }

    if (tokenToValidate) {
      await this.checkSavedToken(tokenToValidate);
    } else {
      this.updateTokenBtnState();
    }

    MesaChat.init();
    MesaReactions.init();
    MesaDice.init();
    MesaAreaManager.init();
    this.updateTokenBtnState();
  },

  async checkSavedToken(customToken = null) {
    const saved = customToken || localStorage.getItem('wu_user_token') || localStorage.getItem('mesa_token');

    if (saved) {
      const candidateToken = saved.trim().toUpperCase();
      const hash = await MesaSecurity.sha256(candidateToken);

      // 1. Verifica se é token do Mestre
      if (this.MASTER_HASHES.includes(hash)) {
        this.state.isMaster = true;
        this.state.myToken = candidateToken;
        this.state.myPlayerSlot = null;
        localStorage.setItem('wu_user_token', candidateToken);
        localStorage.setItem('mesa_token', candidateToken);
        this.updateTokenBtnState();
        if (window.MesaAreaManager && typeof MesaAreaManager.updateMasterButtons === 'function') MesaAreaManager.updateMasterButtons();
        if (window.MesaQuickMenu && typeof MesaQuickMenu.updateState === 'function') MesaQuickMenu.updateState();
        return true;
      }

      // 2. Verifica se pertence a algum slot padrão nos hashes locais
      let matchedSlot = null;
      for (const [slotNum, hashes] of Object.entries(this.SLOT_HASHES)) {
        if (hashes.includes(hash)) {
          matchedSlot = parseInt(slotNum, 10);
          break;
        }
      }

      // 3. Verifica nos personagens carregados na memória
      let matchedPlayer = null;
      if (matchedSlot && this.state.players[matchedSlot - 1]) {
        matchedPlayer = this.state.players[matchedSlot - 1];
      }
      if (!matchedPlayer) {
        matchedPlayer = this.state.players.find(p => p && p.token && p.token.toUpperCase() === candidateToken);
        if (matchedPlayer) {
          matchedSlot = matchedPlayer.slot;
        }
      }

      // 4. Se não achou na memória, verifica na base do Supabase
      if (!matchedPlayer && this.supabase) {
        try {
          const { data } = await this.supabase
            .from('personagens')
            .select('*')
            .eq('token', candidateToken)
            .single();

          if (data) {
            matchedPlayer = data;
            matchedSlot = data.slot;
          }
        } catch (err) {
          console.warn("Erro ao validar token salvo:", err);
        }
      }

      if (matchedPlayer || matchedSlot) {
        this.state.isMaster = false;
        this.state.myToken = candidateToken;
        this.state.myPlayerSlot = matchedSlot || (matchedPlayer ? matchedPlayer.slot : null);
        localStorage.setItem('wu_user_token', candidateToken);
        localStorage.setItem('mesa_token', candidateToken);
        this.updateTokenBtnState();
        return true;
      } else {
        // Token inválido na base: limpa para não ficar em estado corrompido
        console.warn("Token salvo não encontrado ou inválido:", candidateToken);
        localStorage.removeItem('wu_user_token');
        localStorage.removeItem('mesa_token');
        this.state.myToken = null;
        this.state.isMaster = false;
        this.state.myPlayerSlot = null;
        this.updateTokenBtnState();
        if (window.MesaAreaManager && typeof MesaAreaManager.updateMasterButtons === 'function') MesaAreaManager.updateMasterButtons();
        if (window.MesaQuickMenu && typeof MesaQuickMenu.updateState === 'function') MesaQuickMenu.updateState();
        return false;
      }
    }

    return false;
  },

  getAuthInfo() {
    if (this.state.isMaster) {
      return { kind: 'master', name: 'Mestre', full: 'Autenticado com o token do Mestre', short: 'Token do Mestre' };
    }
    if (this.state.myToken) {
      const slot = this.state.myPlayerSlot;
      const player = slot ? this.state.players[slot - 1] : null;
      const name = (player && player.nome) ? player.nome : (slot ? `Slot ${slot}` : 'jogador');
      return { kind: 'player', name, full: `Autenticado com o token de ${name}`, short: `Token de ${name}` };
    }
    return { kind: 'none', name: '', full: 'Não autenticado', short: 'Não autenticado' };
  },

  updateAuthChip() {
    const info = this.getAuthInfo();
    const chip = document.getElementById('nav-auth-chip');
    if (chip) {
      chip.className = `nav-auth-chip auth-${info.kind}`;
      chip.title = info.kind === 'none' ? 'Clique para autenticar seu token' : info.full;
      const text = chip.querySelector('.nav-auth-text');
      if (text) text.textContent = info.full;
    }
    const modalLine = document.getElementById('token-auth-current');
    if (modalLine) {
      modalLine.style.display = info.kind === 'none' ? 'none' : 'block';
      modalLine.textContent = info.full;
    }
  },

  updateTokenBtnState() {
    const tokenBtn = document.getElementById('nav-token-btn');
    const tokenLabel = document.getElementById('nav-token-label');
    const alertBadge = document.getElementById('token-alert-badge');
    const chooseAreaBtn = document.getElementById('nav-choose-area-btn');
    const mobileChooseAreaItem = document.getElementById('mobile-choose-area-item');
    const logoutBtn = document.getElementById('nav-logout-btn');
    const mobileLogoutItem = document.getElementById('mobile-logout-item');

    const hasSession = Boolean(this.state.isMaster || this.state.myToken);
    if (logoutBtn) logoutBtn.style.display = hasSession ? 'inline-flex' : 'none';
    if (mobileLogoutItem) mobileLogoutItem.style.display = hasSession ? 'flex' : 'none';

    if (this.state.isMaster) {
      if (tokenLabel) tokenLabel.textContent = 'Mestre Ativo';
      if (alertBadge) alertBadge.style.display = 'none';
      if (chooseAreaBtn) chooseAreaBtn.style.display = 'inline-flex';
      if (mobileChooseAreaItem) mobileChooseAreaItem.style.display = 'flex';
    } else if (this.state.myToken) {
      if (tokenLabel) {
        tokenLabel.textContent = this.state.myPlayerSlot ? `Slot ${this.state.myPlayerSlot} Conectado` : 'Token Ativo';
      }
      if (alertBadge) alertBadge.style.display = 'none';
      if (chooseAreaBtn) chooseAreaBtn.style.display = 'none';
      if (mobileChooseAreaItem) mobileChooseAreaItem.style.display = 'none';
    } else {
      if (tokenLabel) tokenLabel.textContent = 'Token';
      if (alertBadge) alertBadge.style.display = 'flex';
      if (chooseAreaBtn) chooseAreaBtn.style.display = 'none';
      if (mobileChooseAreaItem) mobileChooseAreaItem.style.display = 'none';
    }

    this.updateAuthChip();

    if (window.MesaAreaManager && typeof MesaAreaManager.updateMasterButtons === 'function') {
      MesaAreaManager.updateMasterButtons();
    }
    if (window.MesaMobileMenu && typeof MesaMobileMenu.updateState === 'function') {
      MesaMobileMenu.updateState();
    }
    if (window.MesaQuickMenu && typeof MesaQuickMenu.updateState === 'function') {
      MesaQuickMenu.updateState();
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
      imagem: 'assets/minerva.png?v=3',
      avatar: 'assets/minerva_avatar.png?v=3',
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
      imagem: 'assets/john.png',
      avatar: 'assets/john_avatar.png',
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
      imagem: 'assets/odara.png?v=3',
      avatar: 'assets/odara_avatar.png?v=3',
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

          if (p.token === 'N3L8' || p.slot === 2) {
            p.imagem = 'assets/minerva.png?v=3';
            p.avatar = 'assets/minerva_avatar.png?v=3';
          }

          if (p.token === 'R5K1' || p.slot === 3) {
            p.imagem = 'assets/eric.png';
            p.avatar = 'assets/eric_avatar.png';
          }

          if (p.token === 'T6D3' || p.slot === 6) {
            p.imagem = 'assets/john.png';
            p.avatar = 'assets/john_avatar.png';
          }

          if (p.token === 'Y4M7' || p.slot === 7) {
            p.imagem = 'assets/odara.png?v=3';
            p.avatar = 'assets/odara_avatar.png?v=3';
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
          imagem: 'assets/minerva.png?v=3', avatar: 'assets/minerva_avatar.png?v=3',
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
          id: 6, slot: 6, token: 'T6D3', nome: 'John Doe', idade: '899 dias (Autômato)', altura: '2,20m', raca: 'E.X.O.s', arquetipo: 'Palhaço', imagem: 'assets/john.png', avatar: 'assets/john_avatar.png',
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
          imagem: 'assets/odara.png?v=3', avatar: 'assets/odara_avatar.png?v=3',
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
    const tokenLogoutBtn = document.getElementById('token-logout-btn');
    if (tokenLogoutBtn) {
      tokenLogoutBtn.style.display = (this.state.isMaster || this.state.myToken) ? 'block' : 'none';
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

    await MesaSecurity.timingDelay(600);

    const isValid = await this.checkSavedToken(token);

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = 'AUTENTICAR TOKEN';
    }

    if (isValid) {
      MesaSecurity.recordSuccess();
      localStorage.setItem('wu_user_token', token);
      localStorage.setItem('mesa_token', token);
      this.updateTokenBtnState();
        this.updateAuthChip();
        MesaChat.updateSenderIdentity();

      if (this.state.isMaster) {
        alert("[SUCESSO] Token de Mestre autenticado com sucesso.");
        this.closeModal('token-modal');
      } else {
        let player = null;
        if (this.state.myPlayerSlot) {
          player = this.state.players[this.state.myPlayerSlot - 1];
        }
        if (!player) {
          player = this.state.players.find(p => p && p.token && p.token.toUpperCase() === token);
        }
        const playerName = player ? `${player.nome} (Slot ${player.slot})` : 'Jogador';
        alert(`[CONECTADO] ${playerName} - Modo de edição ativado.`);
        this.closeModal('token-modal');
        if (player) {
          this.openFicha(player);
        }
      }
    } else {
      const { fails, lockoutDuration } = MesaSecurity.recordFailedAttempt();
      if (lockoutDuration > 0) {
        alert(`[BLOQUEIO DE SEGURANÇA] Token inválido. Você excedeu o limite de tentativas (${fails}). Aguarde ${lockoutDuration} segundos.`);
      } else {
        alert(`[ERRO] Token inválido ou não encontrado (${fails}/3 tentativas antes do bloqueio temporário).`);
      }
    }
  },

  logout() {
    localStorage.removeItem('wu_user_token');
    localStorage.removeItem('mesa_token');
    window.location.reload();
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

    // 5. WebSocket Broadcast de Mudança de Área / Mapa em Tempo Real
    this.channel.on('broadcast', { event: 'area_changed' }, (payload) => {
      const data = payload.payload;
      if (data && data.areaId && window.MesaAreaManager) {
        MesaAreaManager.applyArea(data.areaId, false);
        MesaApp.closeModal('area-map-modal');
      }
    });





    // 6. Postgres Changes para novas mensagens gravadas
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


// ============================================================
// 7. SISTEMA DE ÁREAS & MAPA DE INVESTIGAÇÃO — WUITALUR RPG
// 7 Áreas Canônicas, 10 Pontos de Interesse Estruturados (Cabeçalho, Quadro de Perícias e Descrição Contextual)
// ============================================================

const MESA_AREAS = {
  "none": {
    "id": "none",
    "name": "Mesa Livre",
    "shortName": "Sem Área",
    "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"4.93\" y1=\"4.93\" x2=\"19.07\" y2=\"19.07\"></line></svg>",
    "themeClass": "area-none",
    "district": "",
    "dangerLevel": "Livre",
    "dangerLevelClass": "safe",
    "ambience": "A mesa encontra-se livre. Nenhuma área selecionada.",
    "lore": "Layout livre.",
    "rumor": "",
    "pois": []
  },
  "colegio-primordio": {
    "id": "colegio-primordio",
    "name": "Colégio Integrado Primórdio",
    "shortName": "Colégio Primórdio",
    "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10v6M2 10l10-5 10 5-10 5z\"></path><path d=\"M6 12v5c3 3 9 3 12 0v-5\"></path></svg>",
    "themeClass": "area-colegio-primordio",
    "district": "Setor Estudantil & Cívico • Centro de Fragktus",
    "dangerLevel": "Inspetores Rígidos & Vigilância Escolar",
    "dangerLevelClass": "warning",
    "ambience": "A arquitetura impõe-se de forma rígida e asseada. Os corredores longos possuem pisos de mosaico polido que refletem uma luz fluorescente pálida, ladeados por filas intermináveis de cacifos de metal verde-oliva. Os passos ecoam de forma seca e solitária nas paredes frias, transmitindo a sensação constante de vigilância e de que as conversas nunca são verdadeiramente privadas. No pátio central e no ginásio, a grandiosidade da infraestrutura serve apenas para reforçar a pequenez e a vulnerabilidade de quem ali estuda.\n\nO ar carrega uma mistura enjoativa de cera de polir, papel velho da biblioteca e desinfetante forte — o aroma da limpeza extrema, usado pela direção para apagar rapidamente qualquer vestígio de fraqueza, dor ou escândalo. Durante as aulas, um silêncio opressivo domina os pisos, quebrado apenas pelo tiquetaque rígido dos relógios de parede e pelo som distante e calculista de sapatos de salto alto a ecoar no rés-do-chão.\n\nA pressão social paira densa nos intervalos. Os alunos, filhos da elite local, agrupam-se com posturas impecáveis e olhares de julgamento, criando um ecossistema hostil a quem não partilha do mesmo estatuto. É um espaço claustrofóbico e profundamente hipócrita, onde o arranjo de flores mortas no corredor contrasta com a ordem imaculada da instituição, provando aos investigadores que o sofrimento ali não é tratado, mas sim silenciado de imediato.",
    "lore": "O colégio mais tradicional de Fragktus, onde Sara e seus colegas estudavam. Sob o verniz da disciplina impecável, circulam segredos sombrios sobre chantagens entre grêmios, favores concedidos a filhos de diretores e o silenciamento sistemático de alunos que faziam perguntas demais.",
    "rumor": "«Sara não foi assistir à última aula de química. Testemunhas dizem que ela foi vista discutindo aos prantos atrás da arquibancada com alguém de jaleco branco.»",
    "pois": [
      {
        "num": 1,
        "title": "O Armário de Sara (2º Andar, Corredor Norte)",
        "headerDesc": "O armário metálico nº 73, situado no corredor entre a biblioteca e a sala do 3º ano. O chão em frente e a chapa verde-oliva acolhem um memorial improvisado: vasos pequenos com cravos secos, crisântemos murchos, copos de plástico com cera endurecida de velas e várias mensagens coladas com fita-cola. A porta está encostada apenas no fecho metálico, sem cadeado.",
        "skills": [
          {
            "skill": "Investigação",
            "dt": 6,
            "info": "Ao inspecionar a estrutura física e afastar o amontoado de flores da base, nota-se que as homenagens foram fixadas em momentos distintos. Entre papéis banais de estudantes, há um envelope denso colado com fita-cola na lateral de acesso mais difícil, bem rente à dobra da porta."
          },
          {
            "skill": "Percepção",
            "dt": 6,
            "info": "Pelas grelhas de ventilação do metal escapa um odor químico de desinfetante hospitalar forte misturado com cera perfumada de flor de laranjeira, destoando completamente do pó e mofo do corredor."
          },
          {
            "skill": "Ladinagem / Crime",
            "dt": 8,
            "info": "O trinco interior do armário não ostenta mossas, marcas de ferramentas ou sinais de gazua. Ele foi destrancado com a chave-mestra administrativa da coordenação antes da colocação das flores."
          },
          {
            "skill": "Intuição",
            "dt": 6,
            "info": "A disposição das velas e das jarras não parece puramente espontânea: segue uma ordem excessivamente simétrica e limpa, típica de algo inspecionado ou supervisionado pela própria coordenação escolar."
          }
        ],
        "context": "A diretora Constança Montenegro acedeu ao armário com a chave-mestra poucas horas após os boatos do desaparecimento de Sara. Ela higienizou o interior para remover resquícios de medicação e autorizou o memorial como cortina de fumo. Uma busca bem-sucedida revela o Cartão Envelopado."
      },
      {
        "num": 2,
        "title": "O Cartão Envelopado (Encontrado no Armário)",
        "headerDesc": "Um envelope de alta gramagem, feito de papel de linho texturado, sem remetente formal no exterior. No interior, há um cartão dobrado com a seguinte inscrição manual em caligrafia cursiva elegante: 'Que as tuas dores finalmente encontrem repouso sob a sombra do eterno silêncio. Foste corajosa ao aceitar o descanso que merecias. — C.'",
        "skills": [
          {
            "skill": "Investigação",
            "dt": 6,
            "info": "O papel de linho e o corte do envelope correspondem exatamente aos materiais de expediente solene utilizados em exclusivo pela direção do Colégio Primórdio."
          },
          {
            "skill": "Percepção",
            "dt": 6,
            "info": "A tinta utilizada na escrita é fluida, própria de caneta de tinta permanente num tom púrpura escuro, impregnando um perfume suave de essência floral no papel."
          },
          {
            "skill": "Intuição",
            "dt": 8,
            "info": "A mensagem encara a ausência de Sara como um termo definitivo e consumado, denotando que o autor conhecia a sua enfermidade latente ('as tuas dores') e sabia que a jovem partiu de livre vontade."
          }
        ],
        "context": "O cartão foi depositado discretamente no memorial por Constança Montenegro. A tinta roxa é o seu cunho pessoal em despachos formais. O bilhete entrega aos jogadores que alguém com a inicial 'C' na escola sabia do cancro terminal de Sara e apoiou a sua entrega à entidade."
      },
      {
        "num": 3,
        "title": "O Balneário do Ginásio (1º Andar, Rés-do-chão - Ala Este)",
        "headerDesc": "Um banco de madeira comprido fixo aos azulejos frios nos fundos do balneário feminino da quadra, próximo à saída de emergência que conduz às traseiras do recinto escolar.",
        "skills": [
          {
            "skill": "Investigação",
            "dt": 6,
            "info": "Sob o assento do último banco encontram-se resíduos de fita-cola recente. No vão do ralo desativado logo abaixo, foi descartado um frasco cilíndrico de remédio vazio e sem rótulo comercial, preservando apenas um código impresso da Clínica Médica de Mina de Prata."
          },
          {
            "skill": "Percepção",
            "dt": 8,
            "info": "Na parede de azulejos, atrás da fila de armários, alguém usou a ponta metálica de um compasso para riscar na argamassa: 'O gato preto estava no pátio outra vez. Ele olhou para mim da árvore.'"
          },
          {
            "skill": "Medicina / Alquimia",
            "dt": 6,
            "info": "O odor residual no frasco de vidro pertence a analgésicos opioides pesados, prescritos estritamente para o alívio de dor crónica severa em estágios avançados de tumores terminais."
          }
        ],
        "context": "Sara lidava com episódios frequentes de náuseas e dores intensas. Com medo de que o seu estado de saúde fosse exposto perante a comunidade elitista do colégio, ela escondia-se no balneário vazio para se medicar em segredo."
      },
      {
        "num": 4,
        "title": "O Gabinete da Direção (1º Andar, Rés-do-chão - Ala Oeste)",
        "headerDesc": "A secretária imponente de carvalho escuro de Constança Montenegro e um armário de arquivos de aço cinzento encastrado na alvenaria atrás da sua poltrona de cabedal, protegido por uma fechadura cilíndrica de latão.",
        "skills": [
          {
            "skill": "Ladinagem / Crime",
            "dt": 8,
            "info": "Destrancar o compartimento inferior do arquivo de aço sem entortar a lingueta de metal nem disparar o alarme mecânico instalado no batente da porta."
          },
          {
            "skill": "Investigação",
            "dt": 6,
            "info": "No fundo da gaveta há uma pasta suspensa rotulada 'Transferências & Saúde - Casos Especiais', contendo os relatórios de Trisha Auguil (ano letivo de 2060) e Sara Auguil (2061), acompanhados de cópias de laudos médicos confidenciais."
          },
          {
            "skill": "Intuição",
            "dt": 8,
            "info": "Agrafado ao laudo de Sara há um bilhete escrito com caneta de tinta permanente roxa: 'Degeneração celular incurável confirmada. Perfil dócil e sem suporte familiar direto. Proceder com a apresentação à Névoa.'"
          }
        ],
        "context": "Prova documental direta do papel de Constança. A diretora usa a sua posição de autoridade para mapear jovens desamparados e doentes graves, encaminhando-os para a entidade 'Ele' em troca de manter o seu pacto de influência e prosperidade em Fragktus."
      },
      {
        "num": 5,
        "title": "A Sala de Música (2º Andar, Ala Sul)",
        "headerDesc": "O piano de cauda negro encostado junto às cortinas pesadas de veludo na sala de ensaio com isolamento acústico, cercado por estantes de partituras e violinos guardados em caixas de madeira.",
        "skills": [
          {
            "skill": "Investigação",
            "dt": 6,
            "info": "Sob as cordas de aço da caixa de ressonância do piano, há uma folha pautada de partitura com uma lista manuscrita de horários de saída e entrada do carro particular de Constança durante as madrugadas de junho."
          },
          {
            "skill": "História / Ocultismo",
            "dt": 8,
            "info": "No verso da partitura, há anotações manuais que transcrevem uma cantiga arcaica de Fragktus sobre 'Aquele que habita sob as raízes e aceita os que não possuem futuro'."
          },
          {
            "skill": "Percepção",
            "dt": 6,
            "info": "O fecho da janela das traseiras está destravado e há marcas de terra seca no parapeito, indicando que o local servia de passagem clandestina para a passarela exterior do ginásio."
          }
        ],
        "context": "A sala de música era o esconderijo que Sara usava para tentar compreender o que a entidade havia falado por intermédio do gato possuído e para monitorizar as movimentações noturnas da diretora Constança antes de desaparecer de vez."
      }
    ]
  },
  "floresta-proibida": {
    "id": "floresta-proibida",
    "name": "A Mata do Norte",
    "shortName": "Mata do Norte",
    "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 2L5 12h4l-3 6h5v4h2v-4h5l-3-6h4L12 2z\"></path></svg>",
    "themeClass": "area-floresta-proibida",
    "district": "Reserva Florestal Fechada • Zona Rural",
    "dangerLevel": "Fauna Alterada, Névoa Tóxica & Armadilhas",
    "dangerLevelClass": "danger",
    "ambience": "Árvores centenárias retorcidas, neblina espessa que engole os faróis, silêncio sepulcral quebrado apenas pelo estalar de galhos e arame farpado enferrujado.",
    "lore": "Área de preservação ambiental isolada pelas autoridades municipais sob alegação de contaminação do solo e desabamentos de antigas minas. Trilhas fechadas ocultam instalações subterrâneas desativadas da época da fundação de Fragktus e clareiras onde eventos anômalos foram registrados.",
    "rumor": "«Guardas florestais privados não usam fardas do Estado: usam coletes pretos táticos e atiram sem aviso contra qualquer um que passe da cerca do KM 18.»",
    "pois": []
  }
};

const MesaAreaManager = {
  currentAreaId: 'colegio-primordio',
  selectedAreaId: 'colegio-primordio',

  init() {
    const saved = localStorage.getItem('mesa_current_area');
    if (saved && MESA_AREAS[saved]) {
      this.currentAreaId = saved;
    }
    this.selectedAreaId = this.currentAreaId;
    this.applyArea(this.currentAreaId, false);
    this.updateMasterButtons();
  },

  updateMasterButtons() {
    const isMaster = MesaApp && MesaApp.state && MesaApp.state.isMaster;
    const chooseAreaBtn = document.getElementById('nav-choose-area-btn');
    const mobileChooseAreaItem = document.getElementById('mobile-choose-area-item');
    const npcsBtn = document.getElementById('nav-npcs-btn');
    const mobileNpcsItem = document.getElementById('mobile-npcs-item');
    const roteiroBtn = document.getElementById('menu-roteiro-btn');
    const mobileRoteiroBtn = document.getElementById('mobile-roteiro-item');
    if (chooseAreaBtn) {
      chooseAreaBtn.style.display = isMaster ? 'inline-flex' : 'none';
    }
    if (mobileChooseAreaItem) {
      mobileChooseAreaItem.style.display = isMaster ? 'flex' : 'none';
    }
    if (npcsBtn) {
      npcsBtn.style.display = isMaster ? 'inline-flex' : 'none';
    }
    if (mobileNpcsItem) {
      mobileNpcsItem.style.display = isMaster ? 'flex' : 'none';
    }
    if (window.MesaQuickMenu) {
      MesaQuickMenu.updateState();
    }
    if (window.MesaQuickMenu) {
      MesaQuickMenu.updateState();
    }
  },

  closeMapModal() {
    const isMaster = Boolean(MesaApp && MesaApp.state && MesaApp.state.isMaster);
    MesaApp.closeModal('area-map-modal');

  },

  openMapModal() {
    const isMaster = Boolean(MesaApp && MesaApp.state && MesaApp.state.isMaster);
    if (!isMaster) {
      return;
    }



    const board = document.getElementById('area-roadmap-board') || document.getElementById('area-map-grid');
    if (!board) return;

    this.selectedAreaId = this.currentAreaId;
    board.innerHTML = '';

    const ROADMAP_CONFIG = {
      'none': {
        xPct: 50, yPct: 80,
        color: '#6b7280',
        glow: 'rgba(107, 114, 128, 0.75)',
        roadD: 'M 500 320 C 500 450, 500 500, 500 512',
        roadTwinD: 'M 508 320 C 508 450, 508 500, 508 512'
      },
      'colegio-primordio': {
        xPct: 24, yPct: 50,
        color: '#14b8a6',
        glow: 'rgba(20, 184, 166, 0.75)',
        roadD: 'M 280 320 C 380 320, 460 320, 500 320',
        roadTwinD: 'M 280 328 C 380 328, 460 328, 500 328'
      },
      'floresta-proibida': {
        xPct: 76, yPct: 50,
        color: '#10b981',
        glow: 'rgba(16, 185, 129, 0.75)',
        roadD: 'M 500 320 C 540 320, 620 320, 720 320',
        roadTwinD: 'M 500 328 C 540 328, 620 328, 720 328'
      }
    };

    // 1. Constrói o SVG de Estradas Interconectadas
    let roadsSvgHtml = `
      <svg class="roadmap-roads-svg" viewBox="0 0 1000 640" preserveAspectRatio="none">
        <defs>
          <radialGradient id="crossroads-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ff5500" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#ff5500" stop-opacity="0" />
          </radialGradient>
        </defs>
    `;

    Object.values(ROADMAP_CONFIG).forEach(cfg => {
      roadsSvgHtml += `
        <path d="${cfg.roadD}" fill="none" stroke="#1c0b04" stroke-width="24" stroke-linecap="round" />
        <path d="${cfg.roadD}" fill="none" stroke="rgba(255, 140, 70, 0.07)" stroke-width="20" stroke-linecap="round" />
      `;
    });

    Object.values(ROADMAP_CONFIG).forEach(cfg => {
      roadsSvgHtml += `
        <path d="${cfg.roadD}" fill="none" stroke="rgba(255, 220, 190, 0.4)" stroke-width="2.2" stroke-linecap="round" />
        <path d="${cfg.roadTwinD}" fill="none" stroke="rgba(255, 220, 190, 0.4)" stroke-width="2.2" stroke-linecap="round" />
        <path d="${cfg.roadD}" fill="none" stroke="rgba(249, 115, 22, 0.5)" stroke-width="1.8" stroke-dasharray="6, 8" stroke-linecap="round" />
      `;
    });

    roadsSvgHtml += `
        <circle cx="500" cy="320" r="50" fill="url(#crossroads-glow)" />
        <circle cx="500" cy="320" r="28" fill="#140803" stroke="rgba(255, 85, 0, 0.6)" stroke-width="2" stroke-dasharray="5, 3" />
        <circle cx="500" cy="320" r="6" fill="#f97316" />
        <text x="500" y="324" text-anchor="middle" fill="#c9b49f" font-size="8.5" font-weight="700" font-family="sans-serif" letter-spacing="1.5">ENCRUZILHADA</text>
      </svg>
    `;

    board.innerHTML = roadsSvgHtml;

    // 2. Adiciona os Nós Cartográficos
    Object.values(MESA_AREAS).forEach(area => {
      const cfg = ROADMAP_CONFIG[area.id] || { xPct: 50, yPct: 50, color: '#f97316', glow: 'rgba(249, 115, 22, 0.6)' };
      const isCurrent = area.id === this.currentAreaId;
      const isSelected = area.id === this.selectedAreaId;

      const node = document.createElement('div');
      node.className = `area-map-node ${isCurrent ? 'is-current' : ''} ${isSelected ? 'selected' : ''} ${!isMaster ? 'read-only' : ''}`;
      node.id = `area-node-${area.id}`;
      node.style.left = `${cfg.xPct}%`;
      node.style.top = `${cfg.yPct}%`;
      node.style.setProperty('--node-color', cfg.color);
      node.style.setProperty('--node-glow', cfg.glow);

      if (isMaster) {
        node.onclick = () => this.selectAreaPreview(area.id);
      } else {
        node.onclick = null;
        node.style.pointerEvents = 'none';
        node.style.cursor = 'default';
      }

      node.innerHTML = `
        ${isCurrent ? '<span class="node-current-pin">LOCAL ATUAL</span>' : ''}
        <div class="area-node-symbol-wrap" title="${area.name}">
          ${area.svgIcon}
        </div>
        <div class="area-node-name">${area.name}</div>
      `;

      board.appendChild(node);
    });

    this.updatePreviewNote();

    const confirmBtn = document.getElementById('area-confirm-travel-btn');
    if (confirmBtn) {
      confirmBtn.style.display = isMaster ? 'inline-flex' : 'none';
    }

    const modal = document.getElementById('area-map-modal');
    if (modal) modal.classList.add('active');
  },

  selectAreaPreview(areaId) {
    const isMaster = Boolean(MesaApp && MesaApp.state && MesaApp.state.isMaster);
    if (!isMaster) return;

    this.selectedAreaId = areaId;
    document.querySelectorAll('.area-map-node').forEach(n => n.classList.remove('selected'));
    const target = document.getElementById(`area-node-${areaId}`);
    if (target) target.classList.add('selected');
    this.updatePreviewNote();
  },

  updatePreviewNote() {
    const preview = document.getElementById('area-map-preview-note');
    const area = MESA_AREAS[this.selectedAreaId];
    if (!preview || !area) return;

    const isCurrent = area.id === this.currentAreaId;
    const isMaster = Boolean(MesaApp && MesaApp.state && MesaApp.state.isMaster);

    let statusMsg = '';
    if (isCurrent) {
      statusMsg = '<div class="map-status map-status-current">Grupo já se encontra nesta localidade</div>';
    } else if (!isMaster) {
      statusMsg = '<div class="map-status map-status-warn">Apenas o Mestre pode autorizar o deslocamento do grupo</div>';
    }

    preview.innerHTML = `
      <div class="map-note-head">
        <span class="map-note-icon">${area.svgIcon}</span>
        <strong class="map-note-name">${area.name}</strong><span class="map-note-district">${area.district}</span>
      </div>
      <div class="map-note-ambience">${area.ambience}</div>
      ${statusMsg}
    `;

    const confirmBtn = document.getElementById('area-confirm-travel-btn');
    if (confirmBtn && isMaster) {
      confirmBtn.disabled = isCurrent;
      confirmBtn.style.opacity = isCurrent ? '0.5' : '1';
      confirmBtn.textContent = isCurrent ? 'GRUPO JÁ NESTA ÁREA' : `DESLOCAR GRUPO PARA ${(area.shortName || area.name).toUpperCase()}`;
    }
  },

  confirmSelectedArea() {
    if (!MesaApp || !MesaApp.state || !MesaApp.state.isMaster) {
      alert("Apenas o Mestre tem permissão para deslocar a área da mesa.");
      return;
    }

    if (this.selectedAreaId === this.currentAreaId) {
      this.closeModals();
      return;
    }

    this.applyArea(this.selectedAreaId, true);
    this.closeModals();
  },

    applyArea(areaId, shouldBroadcast = false) {
    const area = MESA_AREAS[areaId];
    if (!area) return;

    this.currentAreaId = areaId;
    this.selectedAreaId = areaId;
    localStorage.setItem('mesa_current_area', areaId);

    // Adiciona classe de transição suave de atmosfera e cor no body
    document.body.classList.add('mesa-area-switching');

    // Remove classes anteriores de área do body e aplica a nova
    Object.values(MESA_AREAS).forEach(a => {
      document.body.classList.remove(a.themeClass);
    });
    document.body.classList.add(area.themeClass);

    setTimeout(() => {
      document.body.classList.remove('mesa-area-switching');
    }, 1400);

    // Atualiza botões da barra superior e mobile com SVGs
    const aboutBtnLabel = document.getElementById('nav-about-area-label');
    const mobileAboutBtnLabel = document.getElementById('mobile-about-area-label');
    const aboutBtnIcon = document.getElementById('nav-about-area-icon');
    const mobileAboutBtnIcon = document.getElementById('mobile-about-area-icon');

    if (aboutBtnLabel) aboutBtnLabel.textContent = `Sobre: ${area.shortName || area.name}`;
    if (mobileAboutBtnLabel) mobileAboutBtnLabel.textContent = `Sobre: ${area.shortName || area.name}`;
    if (aboutBtnIcon) aboutBtnIcon.innerHTML = area.svgIcon;
    if (mobileAboutBtnIcon) mobileAboutBtnIcon.innerHTML = area.svgIcon;

    const aboutBtn = document.getElementById('nav-about-area-btn');
    const mobileAboutBtn = document.getElementById('mobile-about-area-icon') ? document.getElementById('mobile-about-area-icon').parentElement : null;

    if (area.id === 'none') {
      if (aboutBtn) aboutBtn.style.display = 'none';
      if (mobileAboutBtn) mobileAboutBtn.style.display = 'none';
    } else {
      if (aboutBtn) aboutBtn.style.display = 'inline-flex';
      if (mobileAboutBtn) mobileAboutBtn.style.display = 'flex';
    }

    if (shouldBroadcast && MesaChat && MesaChat.channel) {
      MesaChat.channel.send({
        type: 'broadcast',
        event: 'area_changed',
        payload: {
          areaId: area.id,
          name: area.name,
          timestamp: Date.now()
        }
      });

      // Notificação amigável no chat para os jogadores
      if (typeof MesaChat.receiveMessage === 'function') {
        MesaChat.receiveMessage({
          id: 'area-alert-' + Date.now(),
          sender_name: 'SISTEMA DA MESA',
          is_master: true,
          content: `[ÁREA] O Mestre deslocou a investigação para: [ ${area.name} ]`,
          created_at: new Date().toISOString()
        });
      }
    }
  },

  getAllNpcs() {
    const source = window.CAMPAIGN_NPCS;
    if (!source) return [];
    return Array.isArray(source) ? source : Object.values(source);
  },

  getNpcById(npcId) {
    return this.getAllNpcs().find(n => n && n.id === npcId) || null;
  },

  activeAreaTab: 'public',

  switchAreaTab(tabKey) {
    const isMasterUser = Boolean(MesaApp && MesaApp.state && MesaApp.state.isMaster);
    if (!isMasterUser && tabKey !== 'public') {
      tabKey = 'public';
    }
    this.activeAreaTab = tabKey;

    // Atualiza botões de navegação de abas
    document.querySelectorAll('.area-tab-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabKey);
    });

    // Atualiza painéis das abas
    document.querySelectorAll('.area-tab-pane').forEach(pane => {
      pane.classList.toggle('active', pane.id === `area-tab-pane-${tabKey}`);
    });
  },

  togglePdi(num) {
    const card = document.getElementById(`pdi-accordion-${num}`);
    if (card) {
      card.classList.toggle('open');
    }
  },

  expandAllPdis() {
    document.querySelectorAll('.pdi-accordion-card').forEach(card => card.classList.add('open'));
  },

  collapseAllPdis() {
    document.querySelectorAll('.pdi-accordion-card').forEach(card => card.classList.remove('open'));
  },

  openAboutAreaModal(areaId = null) {
    const targetId = areaId || this.currentAreaId;
    const area = (window.CAMPAIGN_AREAS && window.CAMPAIGN_AREAS[targetId]) || MESA_AREAS[targetId];
    if (!area) return;

    const areaName = area.nome || area.name;
    const pdiList = area.pontos_de_interesse || area.pois || [];
    const pdiCount = pdiList.length;
    const isMasterUser = Boolean(MesaApp && MesaApp.state && MesaApp.state.isMaster);

    // 1. Cabeçalho Geral da Área (Identidade, Distrito e Nível de Perigo)
    const header = document.getElementById('area-info-header');
    if (header) {
      header.innerHTML = `
        <div class="area-header-identity">
          <div class="area-header-symbol">${area.svgIcon}</div>
          <div class="area-header-titles">
            <h2>${areaName}</h2>
            <p>${area.district}</p>
          </div>
        </div>
        <div class="area-header-meta">
          <span class="area-meta-tag ${area.dangerLevelClass || 'warning'}">${area.dangerLevel}</span>
          <span class="area-meta-tag">${pdiCount} ${pdiCount === 1 ? 'Ponto de Interesse' : 'Pontos de Interesse'}</span>
        </div>
      `;
    }

    // 2. Configura Visibilidade dos Separadores (Tabs)
    const backstageTabBtn = document.getElementById('tab-btn-backstage');
    const pdisTabBtn = document.getElementById('tab-btn-pdis');
    const pdiCounterBadge = document.getElementById('tab-pdi-count-badge');

    if (pdiCounterBadge) {
      pdiCounterBadge.textContent = pdiCount;
    }

    if (backstageTabBtn) {
      backstageTabBtn.style.display = isMasterUser ? 'inline-flex' : 'none';
    }
    if (pdisTabBtn) {
      pdisTabBtn.style.display = isMasterUser ? 'inline-flex' : 'none';
    }

    // 3. TAB 1: VISÃO PÚBLICA (Mestre e Jogadores)
    const publicInfo = document.getElementById('area-public-info');
    if (publicInfo) {
      const atmosferaText = area.resumo_atmosfera || area.ambience || '';
      const atmosferaParagraphs = atmosferaText
        .split(/\n\s*\n/)
        .filter(p => p.trim().length > 0)
        .map(p => `<p class="area-atmosphere-p">${p.trim()}</p>`)
        .join('');

      let exitsHtml = '';
      if (area.conexoes_saida && area.conexoes_saida.length > 0) {
        exitsHtml = `
          <div class="area-exits-block">
            <strong class="area-exits-title">ROTAS & CONEXÕES DE SAÍDA:</strong>
            <div class="area-exits-row">
              ${area.conexoes_saida.map(ex => {
                return `<button type="button" class="mesa-exit-btn" onclick="MesaAreaManager.openAboutAreaModal('${ex.area_id}')" title="${ex.gancho}">
                  ${ex.nome} &rarr;
                </button>`;
              }).join('')}
            </div>
          </div>
        `;
      }

      publicInfo.innerHTML = `
        <div class="area-section-header">
          <h4 class="area-section-title">ATMOSFERA & CENÁRIO</h4>
        </div>
        <div class="area-atmosphere-content">
          ${atmosferaParagraphs}
        </div>
        ${exitsHtml}
        ${area.lore ? `<div class="area-lore-block"><h4 class="area-section-title" style="margin-top: 20px;">HISTÓRIA & CONTEXTO LOCAL</h4><p class="area-atmosphere-p">${area.lore}</p></div>` : ''}
        ${area.rumor ? `<div class="area-rumor-box"><strong>RUMOR INVESTIGATIVO:</strong> ${area.rumor}</div>` : ''}
      `;
    }

    // 4. TAB 2: BASTIDORES (Exclusivo do Mestre)
    const backstageContainer = document.getElementById('area-backstage-info');
    if (backstageContainer && isMasterUser) {
      // Bloco de NPCs Presentes
      let npcsListHtml = '';
      if (area.npcs_presentes && area.npcs_presentes.length > 0) {
        npcsListHtml = `
          <div class="backstage-npcs-grid">
            ${area.npcs_presentes.map(npcId => {
              const npc = this.getNpcById(npcId);
              const rawName = npc ? npc.nome : npcId;
              const parts = rawName.split('•');
              const mainName = parts[0].trim();
              const roleTitle = parts[1] ? parts[1].trim() : (npc ? npc.ligacao_misterio : 'Personagem Local');
              return `
                <div class="backstage-npc-card" onclick="MesaAreaManager.openNpcModal('${npcId}')">
                  <div class="backstage-npc-avatar-box">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  </div>
                  <div class="backstage-npc-details">
                    <strong class="backstage-npc-name">${mainName}</strong>
                    <span class="backstage-npc-role">${roleTitle}</span>
                  </div>
                  <button type="button" class="backstage-npc-open-btn" title="Abrir Dossiê">
                    Dossiê &rarr;
                  </button>
                </div>
              `;
            }).join('')}
          </div>
        `;
      } else {
        npcsListHtml = '<p class="backstage-empty-text">Nenhum NPC registrado nesta área no momento.</p>';
      }

      backstageContainer.innerHTML = `
        <!-- CARD 1: REQUISITOS DE ACESSO -->
        <div class="backstage-panel-card">
          <div class="backstage-panel-header">
            <div class="backstage-panel-title-wrap">
              <svg class="backstage-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              <h5>CONDIÇÕES DE ACESSO & INFILTRAÇÃO</h5>
            </div>
            <span class="backstage-confidential-badge">ACESSO DO MESTRE</span>
          </div>
          <div class="backstage-panel-body">
            <p class="backstage-access-desc">${area.requisitos_acesso || 'Acesso livre e sem restrições especiais cadastradas.'}</p>
          </div>
        </div>

        <!-- CARD 2: NPCS PRESENTES -->
        <div class="backstage-panel-card" style="margin-top: 18px;">
          <div class="backstage-panel-header">
            <div class="backstage-panel-title-wrap">
              <svg class="backstage-header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              <h5>PERSONAGENS PRESENTES NESTA ÁREA</h5>
            </div>
            <span class="backstage-count-badge">${(area.npcs_presentes || []).length} Mapeados</span>
          </div>
          <div class="backstage-panel-body">
            <p class="backstage-hint-text">Clique em qualquer personagem abaixo para abrir instantaneamente o seu Dossiê Confidencial com segredos e gatilhos de revelação:</p>
            ${npcsListHtml}
          </div>
        </div>
      `;
    }

    // 5. TAB 3: INVESTIGAÇÃO / PDIS (Exclusivo do Mestre — Acordeões Fechados por Default)
    const pdisContainer = document.getElementById('area-pdis-container');
    if (pdisContainer && isMasterUser) {
      if (pdiList.length === 0) {
        pdisContainer.innerHTML = `
          <div class="pdis-empty-box">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#71717a" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <p>Nenhum ponto de interesse registrado nesta área ainda.</p>
          </div>
        `;
      } else {
        const accordionsHtml = pdiList.map((poi, idx) => {
          const num = poi.num || (idx + 1);
          const title = (poi.cabecalho && poi.cabecalho.nome) || poi.title || `Ponto de Interesse ${num}`;
          const desc = (poi.cabecalho && poi.cabecalho.descricao_publica) || poi.headerDesc || '';
          const masterNotes = poi.notas_mestre || poi.context || '';
          const tests = poi.testes || (poi.skills ? poi.skills.map(s => ({ pericia: s.skill, ct_dt: s.dt, informacao_revelada: s.info })) : []);

          let rowsHtml = '';
          tests.forEach((t, tIdx) => {
            const tintClass = `skill-tint-${tIdx % 4}`;
            rowsHtml += `
              <tr class="${tintClass}">
                <td class="poi-skill-cell">${t.pericia}</td>
                <td class="poi-dt-cell"><span class="mesa-pdi-dt-badge">DT ${t.ct_dt}</span></td>
                <td class="poi-info-cell">${t.informacao_revelada}</td>
              </tr>
            `;
          });

          return `
            <div class="pdi-accordion-card" id="pdi-accordion-${num}">
              <!-- CABEÇALHO DO ACORDEÃO (CLICÁVEL) -->
              <button type="button" class="pdi-accordion-header" onclick="MesaAreaManager.togglePdi(${num})" aria-label="Expandir ou recolher Ponto de Interesse">
                <div class="pdi-accordion-header-left">
                  <span class="pdi-num-badge">#${num < 10 ? '0' + num : num}</span>
                  <strong class="pdi-title-text">${title}</strong>
                </div>
                <div class="pdi-accordion-header-right">
                  <span class="pdi-tests-tag">${tests.length} ${tests.length === 1 ? 'Teste' : 'Testes'}</span>
                  <svg class="pdi-chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
                </div>
              </button>

              <!-- CORPO DO ACORDEÃO (EXPANSÍVEL) -->
              <div class="pdi-accordion-body" id="pdi-body-${num}">
                <!-- Descrição Sensorial Inicial -->
                <div class="pdi-public-desc-box">
                  <span class="pdi-box-mini-tag">DESCRIÇÃO INICIAL / SENSORIAL</span>
                  <p class="pdi-public-desc-text">${desc}</p>
                </div>

                <!-- Quadro de Testes de Perícias -->
                <div class="poi-skills-table-wrap">
                  <table class="poi-skills-table">
                    <thead>
                      <tr>
                        <th class="th-pericia">Perícia</th>
                        <th class="th-dt">Classe de Teste (CT/DT)</th>
                        <th class="th-info">Informação Revelada</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${rowsHtml}
                    </tbody>
                  </table>
                </div>

                <!-- Notas do Mestre (Segredos da Trama) -->
                <div class="mesa-master-notes-box">
                  <div class="mesa-master-notes-icon" title="Segredo do Mestre">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                  </div>
                  <div class="mesa-master-notes-content">
                    <span class="mesa-master-notes-label">[NOTAS DO MESTRE • SEGREDO CONFIDENCIAL]</span>
                    <p>${masterNotes}</p>
                  </div>
                </div>
              </div>
            </div>
          `;
        }).join('');

        pdisContainer.innerHTML = `
          <!-- BARRA DE FERRAMENTAS DOS PDIS -->
          <div class="pdis-toolbar">
            <div class="pdis-toolbar-title-wrap">
              <h4 class="pdis-toolbar-title">PONTOS DE INTERESSE DA LOCALIDADE</h4>
              <span class="pdis-toolbar-subtitle">Clique em qualquer ponto abaixo para inspecionar testes, DTs e segredos.</span>
            </div>
            <div class="pdis-toolbar-actions">
              <button type="button" class="pdi-tool-btn" onclick="MesaAreaManager.expandAllPdis()">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="7 11 12 6 17 11"></polyline><polyline points="7 18 12 13 17 18"></polyline></svg>
                Expandir Todos
              </button>
              <button type="button" class="pdi-tool-btn" onclick="MesaAreaManager.collapseAllPdis()">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline></svg>
                Recolher Todos
              </button>
            </div>
          </div>

          <!-- LISTA DE ACORDEÕES -->
          <div class="pdis-accordion-list">
            ${accordionsHtml}
          </div>
        `;
      }
    }

    // 6. Ativa a aba atual (garante 'public' para jogadores)
    this.switchAreaTab(this.activeAreaTab || 'public');

    // 7. Exibe o Modal
    const modal = document.getElementById('area-info-modal');
    if (modal) modal.classList.add('active');
  },

  closeNpcDrawer() {
    document.body.classList.remove('npc-drawer-open');
  },

  openNpcModal(npcId = null) {
    if (!MesaApp || !MesaApp.state || !MesaApp.state.isMaster) {
      alert("[ACESSO RESTRITO] O Dossiê de NPCs e seus segredos são confidenciais e exclusivos do Mestre. Autentique seu Token de Mestre para consultar.");
      return;
    }

    const npcsList = this.getAllNpcs();
    if (npcsList.length === 0) return;

    const targetId = npcId || npcsList[0].id;
    const npc = npcsList.find(n => n.id === targetId) || npcsList[0];
    if (!npc) return;

    const content = document.getElementById('npc-dossier-content');
    if (!content) return;

    // Seletor rapido de NPCs no topo se houver mais de 1
    let npcTabsHtml = '';
    if (npcsList.length > 1) {
      const tabsBtns = npcsList.map(n => {
        const isSelected = n.id === npc.id;
        const shortName = n.nome.split('•')[0].trim();
        return `<button type="button" class="npc-switch-btn ${isSelected ? 'active' : ''}" onclick="MesaAreaManager.openNpcModal('${n.id}')">${shortName}</button>`;
      }).join('');
      npcTabsHtml = `<div class="npc-switch-row">${tabsBtns}</div>`;
    }

    const roleName = npc.papel || (npc.ligacao_misterio ? npc.ligacao_misterio.split('.')[0] : 'Personagem Local');
    const fieldRow = (label, text) => `
      <div class="npc-field">
        <span class="npc-field-label">${label}</span>
        <p class="npc-field-text">${text || ''}</p>
      </div>`;

    content.innerHTML = `
      ${npcTabsHtml}

      <div class="npc-sheet-head">
        <span class="npc-role-tag">${roleName}</span>
        <h2 class="npc-sheet-name">${npc.nome}</h2>
      </div>

      <div class="npc-fields">
        ${fieldRow('Personalidade e postura', npc.personalidade)}
        ${fieldRow('História resumida', npc.historia_resumida)}
        ${fieldRow('Informação livre (conversa casual)', npc.informacao_livre)}

        <div class="npc-callout npc-callout-secret">
          <span class="npc-callout-label">Segredo útil</span>
          <p>${npc.segredo_util || ''}</p>
        </div>

        <div class="npc-callout npc-callout-trigger">
          <span class="npc-callout-label">Gatilho de revelação</span>
          <p>${npc.gatilho_revelacao || ''}</p>
        </div>
      </div>
    `;

    document.body.classList.add('npc-drawer-open');
  },

  closeModals() {
    MesaApp.closeModal('area-map-modal');
    MesaApp.closeModal('area-info-modal');
    this.closeNpcDrawer();
  }
};





// ---- 7.1. MOTOR DO MENU HAMBÚRGUER DA BARRA SUPERIOR ----
const MesaQuickMenu = {
  isOpen: false,

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  },

  open() {
      this.isOpen = true;
      const dropdown = document.getElementById('mesa-quick-menu-dropdown');
      const btn = document.getElementById('nav-hamburger-btn');
      if (dropdown) dropdown.classList.add('active');
      if (btn) btn.classList.add('active');
      this.updateState();
    },

  close() {
    this.isOpen = false;
    const dropdown = document.getElementById('mesa-quick-menu-dropdown');
    const btn = document.getElementById('nav-hamburger-btn');
    if (dropdown) dropdown.classList.remove('active');
    if (btn) btn.classList.remove('active');
  },

  updateState() {
    const isMaster = Boolean(MesaApp && MesaApp.state && MesaApp.state.isMaster);
    const myToken = MesaApp && MesaApp.state && MesaApp.state.myToken;
    const hasSession = Boolean(isMaster || myToken);

    const npcsBtn = document.getElementById('menu-npcs-btn');
    if (npcsBtn) {
      npcsBtn.style.display = isMaster ? 'flex' : 'none';
    }

    const roteiroBtn = document.getElementById('menu-roteiro-btn');
    if (roteiroBtn) {
      roteiroBtn.style.display = isMaster ? 'flex' : 'none';
    }

    const logoutBtn = document.getElementById('menu-logout-btn');
    if (logoutBtn) {
      logoutBtn.style.display = hasSession ? 'flex' : 'none';
    }

    const tokenLabel = document.getElementById('menu-token-label');
    const tokenAlert = document.getElementById('menu-token-alert-badge');
    if (tokenLabel) {
      const authInfo = MesaApp.getAuthInfo();
      tokenLabel.textContent = authInfo.kind === 'none' ? 'Autenticar Token' : authInfo.short;
    }
    if (tokenAlert) {
      tokenAlert.style.display = (!myToken && !isMaster) ? 'inline-block' : 'none';
    }

    const chatBadge = document.getElementById('chat-unread-badge');
    const isChatUnread = chatBadge && chatBadge.style.display !== 'none';
    const menuChatBadge = document.getElementById('menu-chat-unread-badge');
    const navHamburgerBadge = document.getElementById('nav-hamburger-badge');
    if (menuChatBadge) menuChatBadge.style.display = isChatUnread ? 'inline-block' : 'none';
    if (navHamburgerBadge) navHamburgerBadge.style.display = isChatUnread ? 'inline-block' : 'none';
  }
};

// ---- 8. MOTOR DO MENU FLUTUANTE HAMBÚRGUER MOBILE ----
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
    const mobileChooseArea = document.getElementById('mobile-choose-area-item');

    const isMaster = MesaApp && MesaApp.state && MesaApp.state.isMaster;
    const myToken = MesaApp && MesaApp.state && MesaApp.state.myToken;

    if (mobileChooseArea) {
      mobileChooseArea.style.display = isMaster ? 'flex' : 'none';
    }

    const mobileRoteiroBtn = document.getElementById('mobile-roteiro-item');
    if (mobileRoteiroBtn) {
      mobileRoteiroBtn.style.display = isMaster ? 'flex' : 'none';
    }

    if (tokenLabel) {
      const authInfo = MesaApp.getAuthInfo();
      tokenLabel.textContent = authInfo.kind === 'none' ? 'Autenticar Token' : authInfo.short;
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

    const mobileLogoutItem = document.getElementById('mobile-logout-item');
    if (mobileLogoutItem) {
      mobileLogoutItem.style.display = (myToken || isMaster) ? 'flex' : 'none';
    }
  }
};

document.addEventListener('DOMContentLoaded', async () => {
  const savedToken = localStorage.getItem('wu_user_token') || localStorage.getItem('mesa_token');
  await MesaApp.init(savedToken);
  MesaMobileMenu.init();
  if (window.MesaQuickMenu) {
    MesaQuickMenu.updateState();
  }

  // Fecha Menu Hambúrguer ao clicar fora
  document.addEventListener('click', (e) => {
    if (window.MesaQuickMenu && MesaQuickMenu.isOpen) {
      const dropdown = document.getElementById('mesa-quick-menu-dropdown');
      const btn = document.getElementById('nav-hamburger-btn');
      if (dropdown && btn && !dropdown.contains(e.target) && !btn.contains(e.target)) {
        MesaQuickMenu.close();
      }
    }
  });

  // Fecha Dossiê de NPCs ao pressionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (window.MesaAreaManager) {
        MesaAreaManager.closeNpcDrawer();
      }
      if (window.MesaQuickMenu) {
        MesaQuickMenu.close();
      }
    }
  });
});


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
      title: `Episódio ${this.episodes.length + 1}`,
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
