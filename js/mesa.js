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
    MesaAreaManager.init();
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
    const chooseAreaBtn = document.getElementById('nav-choose-area-btn');
    const mobileChooseAreaItem = document.getElementById('mobile-choose-area-item');

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

    if (window.MesaAreaManager && typeof MesaAreaManager.updateMasterButtons === 'function') {
      MesaAreaManager.updateMasterButtons();
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

    // 5. WebSocket Broadcast de Mudança de Área / Mapa em Tempo Real
    this.channel.on('broadcast', { event: 'area_changed' }, (payload) => {
      const data = payload.payload;
      if (data && data.areaId && window.MesaAreaManager) {
        MesaAreaManager.applyArea(data.areaId, false);
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
  'mina-de-prata': {
    id: 'mina-de-prata',
    name: "Condomínio Mina de Prata",
    shortName: "Mina de Prata",
    svgIcon: '<svg class="area-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 9h.01M15 9h.01M9 13h.01M15 13h.01"></path></svg>',
    themeClass: 'area-mina-de-prata',
    district: "Residencial de Alta Renda • Zona Sul de Fragktus",
    dangerLevel: "Vigilância Privada & Câmeras Ocultas",
    dangerLevelClass: 'danger',
    ambience: "Mansões neoclássicas, ruas silenciosas de paralelepípedo molhado, névoa baixa e o ranger distante de portões de ferro.",
    lore: "Enclave da elite de Fragktus onde morava Sara Auguil e onde se escondem os interesses de figuras influentes da cidade. Sob a fachada de opulência e segurança armada, moradores sussurram sobre carros pretos sem placas circulando de madrugada e documentos queimados nos fundos das propriedades.",
    rumor: "«Na noite em que Sara sumiu, os postes da Alameda dos Ipês piscaram três vezes e o sistema de câmeras da guarita apagou por exatamente dez minutos.»",
    pois: [
      {
        num: 1,
        title: "QUARTO DE SARA (MANSÃO AUGUIL)",
        headerDesc: "O quarto no segundo andar permanece exatamente como na noite do desaparecimento. Cama impecavelmente forrada, janelas de vidro fumê entreabertas e um aroma residual de lavanda tentando disfarçar um cheiro químico acre.",
        skills: [
          { skill: "Investigação", dt: 6, info: "Sob o fundo falso da gaveta inferior do guarda-roupa, há frascos vazios de morfina e um bilhete rasgado: 'Não confie na Dra. Melissa. Ela entregou Trisha'." },
          { skill: "Percepção", dt: 6, info: "A tranca da janela foi forçada de dentro para fora; no parapeito externo de alvenaria há vestígios de terra preta e folhas de pinheiro." },
          { skill: "Percepção", dt: 8, info: "Pequenas manchas de sangue seco estão camufladas no rodapé de madeira ao lado da cama, condizentes com crises hemorrágicas limpas às pressas." }
        ],
        context: "Sara escondia de todos o avanço implacável do sarcoma terminal. Na madrugada de 31 de junho, ela fugiu pela janela para evitar os sensores do alarme residencial, já determinada a atender ao chamado de 'Ele' na floresta."
      },
      {
        num: 2,
        title: "GUARITA PRINCIPAL DE MINA DE PRATA",
        headerDesc: "Cabine blindada com vidros espelhados e cancelas eletrônicas no acesso único do condomínio fechado, guarnecida pelo vigia Valdir sob chuva fina constante.",
        skills: [
          { skill: "Percepção", dt: 6, info: "O caderno de registro físico de veículos tem a página da madrugada de 31/06 com duas linhas cobertas por corretivo líquido espesso." },
          { skill: "Lábia", dt: 8, info: "Valdir admite sob pressão que recebeu ordem direta e pagamento da Diretora Constança Montenegro para abrir a cancela e desligar o alarme entre 01h00 e 01h30." },
          { skill: "Tecnologia", dt: 10, info: "O switch de rede da guarita teve o log de gravação das câmeras deletado remotamente a partir de um IP residencial da Alameda dos Ipês." }
        ],
        context: "Constança utilizou sua autoridade incontestável na diretoria do condomínio para criar uma janela cega de fuga, garantindo que o transporte de Sara não gerasse registros formais de tráfego."
      },
      {
        num: 3,
        title: "ALAMEDA DOS IPÊS (LOTE 14 - CASA EM OBRAS)",
        headerDesc: "Imóvel vizinho à residência de Sara cercado por tapumes de madeira compensada e caçambas de entulho molhadas de chuva, em ponto cego da iluminação pública.",
        skills: [
          { skill: "Sobrevivência", dt: 6, info: "Marcas de pneus largos de um SUV executivo recente manobrando em marcha à ré na terra fofa da calçada." },
          { skill: "Percepção", dt: 8, info: "Bitucas de cigarro de cravo importado com filtro dourado jogadas perto do tapume, a mesma marca cara consumida exclusivamente por Constança Montenegro." }
        ],
        context: "O veículo oficial da diretora aguardou Sara neste lote durante 25 minutos. Sara desceu do muro e entrou no veículo voluntariamente, já debilitada pelas dores do câncer."
      },
      {
        num: 4,
        title: "QUADRO DE DISTRIBUIÇÃO ELÉTRICA (SETOR NORTE)",
        headerDesc: "Gabinete metálico cinzento com sinalização de alta tensão instalado na divisa dos muros do condomínio com a vegetação nativa.",
        skills: [
          { skill: "Tecnologia", dt: 6, info: "Os disjuntores da cerca perimetral e dos postes de iluminação foram desligados cirurgicamente com a chave mestra de serviço da administração." },
          { skill: "Investigação", dt: 8, info: "No chão de brita ao lado do poste há um crachá plástico de visitante temporário com o timbre da Clínica Renovare esquecido na pressa." }
        ],
        context: "O corte momentâneo de energia às 00h45 de 31/06 foi planejado para apagar os holofotes do perímetro no instante em que Sara e seus condutores deixavam o perímetro seguro."
      },
      {
        num: 5,
        title: "PRAÇA DOS FUNDADORES & FONTE SECA",
        headerDesc: "Espaço paisagístico central com bancos de ferro fundido e uma fonte ornamental de mármore desligada, encimada pelo brasão em relevo da família Montenegro.",
        skills: [
          { skill: "Ocultismo", dt: 6, info: "Na base da fonte há marcas circulares e espirais raspadas na pedra com giz carmesim, reproduzindo símbolos idênticos aos cadernos de Trisha de 2060." },
          { skill: "Percepção", dt: 8, info: "Moedas coloniais de prata do século XIX foram depositadas na água estagnada do fundo como oferenda ritualística periódica." }
        ],
        context: "A dinastia Montenegro realiza oferendas neste marco há mais de um século para renovar o pacto de prosperidade e imunidade mantido com a entidade ancestral que reside na floresta."
      },
      {
        num: 6,
        title: "LIXEIRA COMUNITÁRIA DO BLOCO C",
        headerDesc: "Depósito de descarte seletivo com contêineres plásticos fechados sob uma cobertura de telha de fibrocimento nos fundos da alameda.",
        skills: [
          { skill: "Investigação", dt: 6, info: "Sacola descartável contendo laudos triturados da Clínica Renovare: resultados de biópsia confirmando sarcoma inoperável em Sara Auguil." },
          { skill: "Percepção", dt: 8, info: "Envelope timbrado do Colégio Primórdio com nota marginal da diretoria: 'Aluna sem herdeiros diretos. Apta para alívio e descanso'." }
        ],
        context: "O descarte feito pelo motorista de Constança comprova o esquema de monitoramento clandestino de alunos terminais articulado entre a escola nobre e a médica particular."
      },
      {
        num: 7,
        title: "ESTUFA DO SR. HORÁCIO (VIZINHO APOSENTADO)",
        headerDesc: "Estufa de vidro repleta de orquídeas raras nos fundos do lote vizinho, onde um telescópio astronômico e blocos de anotações estão montados junto à janela.",
        skills: [
          { skill: "Lábia", dt: 6, info: "Horácio revela que desconfiava dos movimentos noturnos na casa de Sara e começou a anotar placas de carros e horários em um caderninho." },
          { skill: "Percepção", dt: 8, info: "O gravador de fita de Horácio capturou trecho de uma conversa sussurrada na calçada: a voz gélida de Constança dizendo 'Trisha encontrou a paz nas raízes, Sara. Você também encontrará'." }
        ],
        context: "O aposentado gravou acidentalmente a manipulação psicológica executada por Constança, mas teme retaliações dos advogados influentes da diretoria."
      },
      {
        num: 8,
        title: "GRADE DE DRENAGEM PLUVIAL (DIVISA NORTE)",
        headerDesc: "Canaleta de concreto e tubulação de águas pluviais que passa sob a base do muro de cinco metros que delimita o condomínio com a reserva da mata.",
        skills: [
          { skill: "Atletismo", dt: 6, info: "A grade de ferro fundido teve duas barras serradas por alicate industrial, criando vão suficiente para a passagem rastejante de uma pessoa." },
          { skill: "Percepção", dt: 8, info: "Um retalho de lã vermelha do sobretudo de Sara está preso nos dentes de ferro, embebido em orvalho e seiva vegetal escura." }
        ],
        context: "A rota de escape a pé usada por Sara para atravessar o muro sem tocar nos sensores perimetrais e alcançar a estrada de terra onde o carro a aguardava."
      },
      {
        num: 9,
        title: "GARAGEM DA MANSÃO AUGUIL",
        headerDesc: "Ampla garagem subterrânea com piso de epóxi cinza. O carro compacto de Sara permanece estacionado debaixo de uma fina camada de poeira.",
        skills: [
          { skill: "Investigação", dt: 6, info: "O porta-malas está destrancado, contendo a mochila escolar de Sara com materiais didáticos intactos, provando que não houve preparação de viagem." },
          { skill: "Sobrevivência", dt: 8, info: "Resquícios de terra vermelha ácida incrustados nas ranhuras dos pneus, um tipo de solo argiloso característico apenas do interior da Mata do Norte." }
        ],
        context: "Sara já havia visitado a orla da floresta dias antes, seguindo os sussurros que ouviu no Café da Névoa para se certificar de que a promessa da entidade era real."
      },
      {
        num: 10,
        title: "SALA DE MONITORAMENTO & SERVIDORES",
        headerDesc: "Sala trancada na sede administrativa de Mina de Prata, equipada com racks refrigerados e múltiplos monitores exibindo as câmeras do condomínio.",
        skills: [
          { skill: "Hackeamento", dt: 8, info: "Recupera arquivos temporários da lixeira do servidor: 15 frames corrompidos gravados à 01h12 mostrando Sara caminhando em direção ao sedan preto da diretoria." },
          { skill: "Investigação", dt: 10, info: "Registros de transferência bancária comprovam que o síndico Robson recebeu um pix vultoso da Fundação Montenegro na manhã de 01 de julho." }
        ],
        context: "A prova cabal que desmonta a narrativa de 'fuga voluntária para longe da cidade': Sara foi acolhida e transportada pela pessoa de maior confiança da elite de Fragktus."
      }
    ]
  },
  'colegio-primordio': {
    id: 'colegio-primordio',
    name: "Colégio Integrado Primórdio",
    shortName: "Colégio Primórdio",
    svgIcon: '<svg class="area-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>',
    themeClass: 'area-colegio-primordio',
    district: "Setor Estudantil & Cívico • Centro de Fragktus",
    dangerLevel: "Inspetores Rígidos & Vigilância Escolar",
    dangerLevelClass: 'warning',
    ambience: "Corredores ecoantes com cheiro de cera velha e desinfetante hospitalar, murais com fotos desbotadas e armários metálicos enferrujados.",
    lore: "O colégio mais tradicional de Fragktus, onde Sara e seus colegas estudavam. Sob o verniz da disciplina impecável, circulam segredos sombrios sobre chantagens entre grêmios, favores concedidos a filhos de diretores e o silenciamento sistemático de alunos que faziam perguntas demais.",
    rumor: "«Sara não foi assistir à última aula de química. Testemunhas dizem que ela foi vista discutindo aos prantos atrás da arquibancada com alguém de jaleco branco.»",
    pois: [
      {
        num: 1,
        title: "ARMÁRIO 108 DE SARA AUGUIL",
        headerDesc: "Armário de latão verde-escuro no corredor do 2º Ano B, com a tinta descascada nos cantos e adesivos antigos de bandas colados na porta.",
        skills: [
          { skill: "Ladinagem", dt: 6, info: "O cadeado cede com facilidade. Dentro, atrás de livros didáticos pesados, há uma chave de vestiário colada atrás do espelho de plástico." },
          { skill: "Investigação", dt: 8, info: "Caderno de anotações com a folha de 30/06 arrancada e o rascunho a lápis de uma árvore gigantesca com olhos: 'Ele prometeu que a dor no peito vai parar'." }
        ],
        context: "Sara usava o armário para ocultar os registros de suas pesquisas sobre o que ocorrera com Trisha, temendo que os inspetores revistassem sua mochila."
      },
      {
        num: 2,
        title: "LABORATÓRIO DE QUÍMICA B",
        headerDesc: "Sala com bancadas de granito polido, bicos de Bunsen, frascos de reagentes e vidrarias sob luz fluorescente fria que zune continuamente.",
        skills: [
          { skill: "Ciências", dt: 6, info: "No quadro-negro dos fundos há a fórmula residual de um sedativo hipnótico potente de manipulação controlada, fora do currículo didático." },
          { skill: "Investigação", dt: 8, info: "O livro de controle de reagentes acusa a retirada de compostos anestésicos autorizada pelo carimbo oficial da Diretora Constança." }
        ],
        context: "Constança manipulava insumos da escola para preparar chás calmantes que oferecia aos alunos selecionados, reduzindo sua resistência psicológica."
      },
      {
        num: 3,
        title: "GABINETE DA DIRETORA CONSTANÇA MONTENEGRO",
        headerDesc: "Sala suntuosa com piso de madeira nobre, estantes repletas de tomos jurídicos, diplomas aristocráticos e grandes cortinas de veludo carmesim.",
        skills: [
          { skill: "Furtividade", dt: 6, info: "Permite esgueirar-se pela sala sem disparar o sensor de movimento da recepção." },
          { skill: "Investigação", dt: 8, info: "Pasta confidencial contendo cópias autenticadas dos prontuários de Sara e Trisha com carimbo da Renovare e anotação manual: 'Sem amparo familiar. Pacto selado'." },
          { skill: "Percepção", dt: 10, info: "Atrás do quadro do fundador na parede há um cofre cuja combinação é a data de desaparecimento de Trisha (041260)." }
        ],
        context: "Constança gerenciava o colégio como um viveiro onde mapeava alunos desenganados, vendo a entrega das jovens a 'Ele' como um favor piedoso e um sacrifício sagrado para a família."
      },
      {
        num: 4,
        title: "MEMORIAL DE FLORES NO SAGUÃO CENTRAL",
        headerDesc: "Altar público montado pela administração da escola, composto por retratos emoldurados de Sara rodeados por dezenas de crisântemos e lírios brancos.",
        skills: [
          { skill: "Percepção", dt: 6, info: "Escondido entre as folhas dos vasos há um bilhete anônimo de um estudante: 'Vocês sabem que ela não fugiu. Parem de fingir luto'." },
          { skill: "Ocultismo", dt: 8, info: "A distribuição geométrica das flores e velas eletrônicas reproduz exatamente o círculo de ancoragem da entidade da floresta." }
        ],
        context: "O memorial foi erguido por Constança com duplo propósito: encerrar oficialmente os questionamentos da comunidade e energeticamente fechar o ciclo de Sara no mundo dos vivos."
      },
      {
        num: 5,
        title: "SALA DO PROFESSOR EDWARD (HISTÓRIA REGIONAL)",
        headerDesc: "Gabinete entulhado de pilhas de livros antigos, recortes de jornais do século XIX, mapas coloniais de Fragktus e fósseis minerais sobre a escrivaninha.",
        skills: [
          { skill: "História", dt: 6, info: "Edward revela que a cada 25 anos registros da cidade documentam jovens debilitados que entram descalços na floresta ao norte e nunca mais retornam." },
          { skill: "Investigação", dt: 8, info: "Ele apresenta crônicas de 1910 sobre 'Ele': um organismo primordial da terra que oferece ausência eterna de dor em troca da assimilação voluntária da alma." }
        ],
        context: "Edward é o único acadêmico que compreende a verdade mística de Fragktus, mas silenciou por décadas por receio de ser internado ou assassinado pela elite."
      },
      {
        num: 6,
        title: "ATRÁS DA ARQUIBANCADA DA QUADRA POLIESPORTIVA",
        headerDesc: "Espaço sombrio e empoeirado sob os degraus de concreto da arquibancada, ponto cego habitual para conversas sigilosas dos estudantes.",
        skills: [
          { skill: "Percepção", dt: 6, info: "Copo térmico descartável com o logotipo do Café da Névoa e marcas de duas pessoas que permaneceram sentadas conversando sob a chuva na véspera." },
          { skill: "Psicologia", dt: 8, info: "Gustavo conversou com Sara aqui; um áudio gravado no celular dele revela Sara chorando e dizendo: 'A quimioterapia não está funcionando, Gustavo. Eu só quero que a dor pare'." }
        ],
        context: "O último momento de vulnerabilidade em que Sara quase revelou sua intenção aos amigos mais próximos antes de ser abordada pela diretora."
      },
      {
        num: 7,
        title: "SALA DO GRÊMIO ESTUDANTIL",
        headerDesc: "Sala caótica com sofás puídos, cartazes de protesto empilhados, computadores antigos e murais com comunicados estudantis.",
        skills: [
          { skill: "Investigação", dt: 6, info: "Um rascunho de abaixo-assinado exigindo investigações reais sobre o sumiço de Trisha em 2060, censurado pela administração com ameaça de suspensão geral." },
          { skill: "Lábia", dt: 8, info: "O líder estudantil confessa que membros da reitoria confiscaram os panfletos sobre Sara no dia seguinte ao desaparecimento." }
        ],
        context: "A máquina institucional do colégio agiu de imediato para blindar o nome da instituição contra qualquer repercussão policial."
      },
      {
        num: 8,
        title: "VESTIÁRIO FEMININO (ARMÁRIO TRANCADO)",
        headerDesc: "Vestiário esportivo subterrâneo com chão de azulejos brancos manchados e fileiras de armários numerados com respiradouros.",
        skills: [
          { skill: "Ladinagem", dt: 6, info: "A chave pequena encontrada no armário 108 destranca o compartimento de fundo duplo do armário 44." },
          { skill: "Tecnologia", dt: 8, info: "Pen drive contendo gravações de áudio clandestinas feitas por Sara das consultas com a Dra. Melissa Vane, onde a médica insiste na venda dos bens de Trisha." }
        ],
        context: "Sara já desconfiava da cumplicidade da clínica e arquivou as evidências no vestiário para que não fossem encontradas durante eventuais buscas em seu quarto."
      },
      {
        num: 9,
        title: "BICICLETÁRIO DOS FUNDOS",
        headerDesc: "Pátio cercado por alambrado alto onde alunos guardam bicicletas, próximo ao portão de serviço por onde transitam veículos de entrega.",
        skills: [
          { skill: "Percepção", dt: 6, info: "A bicicleta de Sara permanece acorrentada com os pneus deliberadamente perfurados por instrumento perfurocortante fino." },
          { skill: "Investigação", dt: 8, info: "Marcas de pneus de sedan no asfalto do portão de carga registradas às 17h30 de 31/06, horário em que Sara teve que aceitar carona da diretora." }
        ],
        context: "A sabotagem do transporte de Sara forçou a garota a aceitar a carona de Constança, iniciando o isolamento final que culminou na entrega na floresta."
      },
      {
        num: 10,
        title: "SALA DE SERVIDORES DE TI DO COLÉGIO",
        headerDesc: "Compartimento refrigerado anexo à biblioteca com racks de rede, modems e servidores de controle acadêmico.",
        skills: [
          { skill: "Hackeamento", dt: 8, info: "O histórico de buscas acadêmicas de Sara mostra consultas repetidas sobre: 'lenda de Ele Fragktus', 'tempo de sobrevida sarcoma grau 4' e 'Trisha Auguil desaparecida'." },
          { skill: "Investigação", dt: 10, info: "Recupera um e-mail rascunhado por Sara endereçado a Gustavo que não chegou a ser enviado: 'Gustavo, se eu não voltar, vá ao ferro-velho do Rato'." }
        ],
        context: "A pista textual direta que orienta o grupo de jogadores a buscar o mecânico da periferia para desvendar a movimentação do veículo de Constança."
      }
    ]
  },
  'cafe-da-nevoa': {
    id: 'cafe-da-nevoa',
    name: "Café da Névoa",
    shortName: "Café da Névoa",
    svgIcon: '<svg class="area-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"></path></svg>',
    themeClass: 'area-cafe-da-nevoa',
    district: "Bairro Operário & Boêmio • Centro Velho",
    dangerLevel: "Informantes nas Sombras & Escutas Ocultas",
    dangerLevelClass: 'warning',
    ambience: "Luz lilás tênue, aroma de café torrado misturado à umidade do asfalto, vinil chiando na vitrola e janelas embaçadas pelo vapor.",
    lore: "Fundado por Trisha Auguil e herdado à força por Sara aos 18 anos. Era o refúgio das irmãs contra a pressão familiar e o epicentro onde Trisha ouvia conversas que nunca deveria ter escutado. Depois que Trisha sumiu, o café virou um antro de clientes calados e informantes discretos.",
    rumor: "«Trisha nunca saiu de Fragktus. As caixas de suprimentos que chegam toda terça trazem mais do que grãos de café.»",
    pois: [
      {
        num: 1,
        title: "BECO DOS FUNDOS & A PORTA DE SERVIÇO",
        headerDesc: "Ruela estreita e mal iluminada atrás do café, onde latas de lixo e caixotes de madeira acumulam poças de chuva sob um lampião amarelo piscante.",
        skills: [
          { skill: "Ocultismo", dt: 6, info: "Mancha circular de terra calcinada onde um gato de rua morreu em convulsão após ter seu corpo tomado temporariamente por 'Ele'." },
          { skill: "Percepção", dt: 8, info: "A carcaça preservada do gato esconde olhos transformados em resina vegetal âmbar, com raízes finas brotando das mandíbulas." }
        ],
        context: "O local exato onde o pacto de Sara foi selado 12 dias antes do sumiço. A entidade falou com Sara através do felino moribundo, prometendo reencontro com Trisha e alívio de suas dores na floresta."
      },
      {
        num: 2,
        title: "BALCÃO PRINCIPAL & CAIXA REGISTRADORA",
        headerDesc: "Balcão imponente de madeira escura polida, máquina de expresso de latão brilhante e uma lousa de parede com receitas e recados com giz lilás.",
        skills: [
          { skill: "Investigação", dt: 6, info: "Fundo falso da gaveta de cédulas esconde um caderno contábil com propostas de compra milionárias do imóvel feitas por empresas de fachada de Constança, todas recusadas por Trisha." },
          { skill: "Percepção", dt: 8, info: "Entalhe fresco na madeira sob o tampo do balcão feito com estilete: '31 de Junho - Eu vou encontrar você, Trisha'." }
        ],
        context: "O Café da Névoa era o símbolo da independência das irmãs Auguil. A recusa de Trisha em vender o imóvel desencadeou a perseguição que terminou em seu sumiço em 2060."
      },
      {
        num: 3,
        title: "MESA 4 (CANTO JUNTO À JANELA)",
        headerDesc: "Mesa redonda reservada em um recanto com poltronas aveludadas e cortinas pesadas, com vista para as ruas enevoadas do centro antigo.",
        skills: [
          { skill: "Percepção", dt: 6, info: "Gravador magnético em miniatura fixado com fita adesiva reforçada embaixo do centro da mesa." },
          { skill: "Tecnologia", dt: 8, info: "A fita revela a Dra. Melissa Vane conversando com Sara: 'Seu corpo não vai aguentar mais um mês, Sara. Fale com a Constança. Ela conhece o caminho para o mundo feliz'." }
        ],
        context: "Sara registrou a abordagem direta de sua médica a empurrando para a órbita da diretora, comprovando a coordenação médica e psicológica do plano."
      },
      {
        num: 4,
        title: "DESPENSA & ESTOQUE DE GRÃOS",
        headerDesc: "Cômodo fechado e escuro com prateleiras até o teto repletas de sacos de café de juta, caixas de xaropes aromáticos e sacarias de especiarias.",
        skills: [
          { skill: "Investigação", dt: 6, info: "Embaixo de sacos de café velhos há uma caixa térmica lacrada com o logotipo da Clínica Renovare: 'Material Biológico Confidencial - Paciente T. Auguil (2060)'." },
          { skill: "Sobrevivência", dt: 8, info: "Marcas desesperadas de unhas arranhando a alvenaria atrás das prateleiras, deixadas por Trisha durante sua contenção antes de sumir." }
        ],
        context: "Trisha também foi drogada e sequestrada neste mesmo local em 2060, evidenciando o padrão de ação idêntico aplicado a ambas as irmãs."
      },
      {
        num: 5,
        title: "ESCRITÓRIO DE TRISHA NO MEZANINO",
        headerDesc: "Sala no segundo andar do café com janelas de vidro canelado, mesa de mogno com livros de poesia, pastas fiscais e fotos de infância das irmãs.",
        skills: [
          { skill: "Ladinagem", dt: 6, info: "Destranca o cofre de combinação embutido na parede atrás do quadro com fotos de família." },
          { skill: "Investigação", dt: 8, info: "Cartas formais de intimação e ameaças veladas de desapropriação assinadas pelo departamento jurídico do Condomínio Mina de Prata." }
        ],
        context: "As irmãs Auguil resistiram por meses à pressão financeira da elite antes de Constança recorrer à manipulação e ao pacto sobrenatural."
      },
      {
        num: 6,
        title: "VITROLA ANTIGA & DISCO EM LOOP",
        headerDesc: "Aparelho de som vintage com corneta dourada girando lentamente um vinil de blues melancólico que chia a cada volta na agulha.",
        skills: [
          { skill: "Percepção", dt: 6, info: "O vinil está arranhado deliberadamente para repetir em loop um compasso específico de 5 segundos." },
          { skill: "Ocultismo", dt: 8, info: "A frequência harmônica emitida pelo chiado atrai neblina e ressoa com as correntes de vento que descem da Mata do Norte." }
        ],
        context: "Sara mantinha essa gravação tocando para tentar silenciar as vozes e sussurros que ouvia em sua cabeça após o encontro no beco."
      },
      {
        num: 7,
        title: "PORÃO SUBTERRÂNEO SOB O ALÇAPÃO",
        headerDesc: "Abaixo de um alçapão de madeira atrás do balcão, uma escada íngreme leva a um porão de pedra rústica com cheiro de mofo e terra úmida.",
        skills: [
          { skill: "Sobrevivência", dt: 6, info: "Colchão improvisado, garrafas de água e embalagens de ração mostram que Gustavo utilizou o porão como esconderijo de vigilância após o sumiço de Sara." },
          { skill: "Investigação", dt: 8, info: "Esboço de mapa desenhado por Gustavo marcando as rotas dos veículos de segurança privada entre o café, o colégio e a floresta." }
        ],
        context: "Gustavo permaneceu no café por 72 horas após Sara desaparecer, reunindo as primeiras pistas antes de recuar para seu bunker impenetrável."
      },
      {
        num: 8,
        title: "FOGÃO E COZINHA DO CAFÉ",
        headerDesc: "Cozinha compacta de aço inoxidável com fogão industrial, bancadas de preparo de bolos e armários de utensílios de cerâmica.",
        skills: [
          { skill: "Investigação", dt: 6, info: "Dentro da fornalha apagada há cinzas de receitas de remédios controlados emitidas pela Renovare para Sara Auguil parcialmente queimadas." },
          { skill: "Ciências", dt: 8, info: "Resíduos em uma caneca de cerâmica confirmam a presença de infusão de plantas nativas da mata misturadas a alcaloides anestésicos potentes." }
        ],
        context: "Sara consumia as infusões fornecidas por Constança para suportar a dor física, alheia ao fato de que as ervas aceleravam sua receptividade psíquica a 'Ele'."
      },
      {
        num: 9,
        title: "MURAL DE RECADOS & FOTOS DOS FREQUENTADORES",
        headerDesc: "Painel de cortiça repleto de bilhetes carinhosos de clientes fiéis, fotografias instantâneas e desenhos em guardanapos de papel.",
        skills: [
          { skill: "Percepção", dt: 6, info: "Uma foto tirada na véspera do sumiço mostra Sara pálida e sorridente; no reflexo da vidraça da rua atrás dela é nítido o sedan preto de Constança estacionado." },
          { skill: "Psicologia", dt: 8, info: "Os últimos recados deixados por Sara para os clientes no mural funcionam como uma carta de despedida consciente e resignada." }
        ],
        context: "Sara sabia que seus dias como humana estavam contados e utilizou o mural para se despedir sem alarmar as pessoas ao seu redor."
      },
      {
        num: 10,
        title: "TELEFONE FIXO DE DISCO NO CORREDOR",
        headerDesc: "Aparelho telefônico analógico preto de baquelite parafusado na parede de azulejos perto do banheiro dos fundos.",
        skills: [
          { skill: "Tecnologia", dt: 6, info: "Dispositivo de escuta telefônica com bateria autônoma instalado no interior do circuito da campainha do aparelho." },
          { skill: "Investigação", dt: 8, info: "O sinal da escuta transmite diretamente para a frequência da empresa de segurança contratada pelo condomínio Mina de Prata." }
        ],
        context: "Todas as conversas e pedidos de socorro de Sara foram interceptados em tempo real pela rede de Constança, impedindo qualquer fuga imprevista."
      }
    ]
  },
  'clinica-renovare': {
    id: 'clinica-renovare',
    name: "Clínica Renovare",
    shortName: "Clínica Renovare",
    svgIcon: '<svg class="area-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"></rect><path d="M12 8v8M8 12h8"></path></svg>',
    themeClass: 'area-clinica-renovare',
    district: "Complexo Médico Privado • Zona Nobre de Fragktus",
    dangerLevel: "Segurança Armada, Biometria & Protocolos Ocultos",
    dangerLevelClass: 'danger',
    ambience: "Luzes brancas frias, cheiro esterilizante de álcool e ozônio, portas com sensores magnéticos e murmúrios abafados atrás de vidros fumê.",
    lore: "Instituição médica de prestígio internacional responsável por tratamentos experimentais de ponta. Onde Sara tratava em segredo absoluto seu câncer terminal sob os cuidados do renomado Dr. Alvarez. Os registros médicos oficiais mostram apenas consultas de rotina, mas alas subterrâneas abrigam projetos que a ética médica baniu há décadas.",
    rumor: "«Pacientes que dão entrada no 4º subsolo não recebem alta: recebem novos atestados de óbito ou desaparecem do sistema nacional de saúde.»",
    pois: [
      {
        num: 1,
        title: "CONSULTÓRIO 402 (DRA. MELISSA VANE)",
        headerDesc: "Consultório executivo impecável com piso de porcelanato branco, mesa de vidro com computador touch-screen e estantes com tratados de oncologia contemporânea.",
        skills: [
          { skill: "Furtividade", dt: 6, info: "Permite acessar a sala pelos fundos sem acionar a fechadura biométrica inteligente." },
          { skill: "Investigação", dt: 8, info: "Prontuário físico original de Sara Auguil atestando sarcoma metastático irreversível, acompanhado do memorando confidencial: 'Vítima aceita. Encaminhar para Constança Montenegro'." },
          { skill: "Medicina", dt: 10, info: "As dosagens prescritas para Sara foram calculadas para dopar sua consciência sem curar a neoplasia, facilitando sua condução mental." }
        ],
        context: "A médica particular da elite atuava como o filtro diagnóstico da conspiração, confirmando quais alunos estavam condenados e sem perspectiva de recuperação familiar."
      },
      {
        num: 2,
        title: "TERMINAL DE TRIAGEM & PRONTUÁRIOS DIGITAIS",
        headerDesc: "Totens de atendimento automatizado no saguão central da clínica, conectados ao servidor médico interno de Fragktus.",
        skills: [
          { skill: "Hackeamento", dt: 8, info: "Localiza a exclusão deliberada das fichas de internação de Sara e Trisha Auguil, com backup transferido para o IP residencial da família Montenegro." },
          { skill: "Investigação", dt: 10, info: "Lista oculta com quatro novos nomes de estudantes terminais do Colégio Primórdio marcados como 'próximos candidatos para descanso'." }
        ],
        context: "A rotina da clínica é permanente: novos jovens desenganados continuam sendo catalogados para futuras renovações do pacto."
      },
      {
        num: 3,
        title: "LABORATÓRIO DE CITOLOGIA & AMOSTRAS BIOLÓGICAS",
        headerDesc: "Ambiente hermético com freezers criogênicos de aço inoxidável, centrífugas digitais e estufas bacteriológicas sob lâmpadas germicidas UV.",
        skills: [
          { skill: "Ciências", dt: 6, info: "Tubos criogênicos marcados 'S.A. - Biópsia 12 Dias': as células tumorais de Sara pararam de se multiplicar e começaram a sintetizar fibras de celulose viva." },
          { skill: "Percepção", dt: 8, info: "Sob luz ultravioleta, as amostras de sangue de Sara emitem suave bioluminescência esmeralda idêntica à seiva da mata." }
        ],
        context: "O contato com a entidade iniciou a transformação celular de Sara antes mesmo de sua ida física para a floresta: a doença estava sendo engolida pela vida vegetal."
      },
      {
        num: 4,
        title: "ALA DE INTERNAÇÃO VIP (LEITO 03)",
        headerDesc: "Suíte hospitalar privativa de alto padrão com cortinas acústicas, monitor cardíaco desativado e janela panorâmica com vista para o jardim interno.",
        skills: [
          { skill: "Percepção", dt: 6, info: "Embaixo do estrado da cama hospitalar há uma flor silvestre seca que só floresce na copa dos pinheiros centenários da floresta ao norte." },
          { skill: "Investigação", dt: 8, info: "Documento de alta médica precoce assinado por Constança Montenegro como 'tutora temporária' à revelia da legislação civil." }
        ],
        context: "Constança retirou Sara deste quarto dois dias antes do sumiço oficial e a levou para a mansão em Mina de Prata para os ritos preparatórios finais."
      },
      {
        num: 5,
        title: "FARMÁCIA CENTRAL DE MANIPULAÇÃO",
        headerDesc: "Câmara farmacêutica blindada com armários refrigerados, balanças analíticas e cofre de substâncias entorpecentes e venenos biológicos.",
        skills: [
          { skill: "Investigação", dt: 6, info: "Registros de dispensação sem prescrição médica de sedativos neurológicos pesados e anestésicos cirúrgicos veterinários." },
          { skill: "Lábia", dt: 8, info: "O farmacêutico de plantão admite que entregava caixas térmicas com sedativos diretamente ao motorista particular da diretora escolar semanalmente." }
        ],
        context: "Os fármacos eram utilizados para assegurar que as vítimas permanecessem em transe dócil e sem dor aguda durante a noite da entrega."
      },
      {
        num: 6,
        title: "INCINERADOR DE RESÍDUOS HOSPITALARES (SUBSOLO)",
        headerDesc: "Fornalha industrial de queima contínua no segundo subsolo da clínica, com canos de exaustão e caçambas de descarte biológico.",
        skills: [
          { skill: "Investigação", dt: 6, info: "No depósito de cinzas resfriadas, encontram-se fragmentos de metal da fivela da bolsa escolar de Trisha Auguil destruída em dezembro de 2060." },
          { skill: "Sobrevivência", dt: 8, info: "Resíduos de cinza com forte odor de madeira resinosa de pinheiro misturada a desinfetante hospitalar." }
        ],
        context: "Provas materiais da internação e dos pertences de Trisha foram eliminadas neste incinerador para apagar os laços entre a clínica e o primeiro desaparecimento."
      },
      {
        num: 7,
        title: "ELEVADOR DE SERVIÇO & ACESSO RESTRITO",
        headerDesc: "Monta-cargas metálico de serviço com grades sanfonadas, descendo para níveis subterrâneos não indicados no painel de botões principal.",
        skills: [
          { skill: "Ladinagem", dt: 8, info: "Burla o leitor de cartão magnético e acessa o terceiro subsolo técnico não constante na planta aprovada na prefeitura." },
          { skill: "Percepção", dt: 8, info: "As paredes de concreto armado do fosso do elevador foram rompidas por grossas raízes negras que penetram nas galerias da clínica." }
        ],
        context: "A presença das raízes sob a clínica demonstra que 'Ele' estende sua influência biológica pelo subsolo da cidade até os prédios dos cúmplices do pacto."
      },
      {
        num: 8,
        title: "SALA DE SEGURANÇA & CIRCUITO INTERNO",
        headerDesc: "Central de monitoramento com computadores e telas transmitindo as imagens de dezenas de câmeras das alas e corredores da clínica.",
        skills: [
          { skill: "Tecnologia", dt: 6, info: "Gravações da madrugada de 30 de junho mostram Constança Montenegro conduzindo Sara Auguil em cadeira de rodas pela porta da doca de ambulâncias." },
          { skill: "Intimidação", dt: 8, info: "O operador de segurança confessa que foi instruído pela diretoria a sobrescrever o trecho da filmagem com arquivos vazios." }
        ],
        context: "Registro visual incontestável da transferência da jovem do leito da clínica para a custódia direta de Constança."
      },
      {
        num: 9,
        title: "SALA DE DESCANSO DOS MÉDICOS",
        headerDesc: "Lounge exclusivo com poltronas reclináveis, cafeteira expresso e armários individuais com chaves para a equipe médica sênior.",
        skills: [
          { skill: "Investigação", dt: 6, info: "No armário pessoal da Dra. Melissa Vane há uma apólice de seguro de vida milionária no nome de Sara Auguil com a clínica indicada como recebedora dos fundos." },
          { skill: "Percepção", dt: 8, info: "Pingente de prata em formato de árvore ressecada guardado na gaveta da médica, o mesmo emblema heráldico da família Montenegro." }
        ],
        context: "A recompensa financeira e social que garantiu a cumplicidade ativa da médica na facilitação do sumiço das irmãs Auguil."
      },
      {
        num: 10,
        title: "DOCA DE CARGAS & AMBULÂNCIA DESCARACTERIZADA",
        headerDesc: "Pátio coberto e fechado nos fundos do complexo hospitalar, projetado para entrada e saída discreta de veículos de emergência e resgate.",
        skills: [
          { skill: "Investigação", dt: 6, info: "Furgão médico branco sem logotipos ou sirene, com marcas de barro vermelho ressecado nos para-lamas e pneus todo-terreno." },
          { skill: "Tecnologia", dt: 8, info: "O navegador GPS integrado ao furgão registrou itinerário direto na madrugada de 01/07 entre a clínica e o KM 18 da rodovia da floresta." }
        ],
        context: "O veículo que transportou os cilindros de oxigênio e os medicamentos de suporte que mantiveram Sara estável até a entrega na mata."
      }
    ]
  },
  'ferro-velho': {
    id: 'ferro-velho',
    name: "Ferro-Velho do Rato",
    shortName: "Ferro-Velho do Rato",
    svgIcon: '<svg class="area-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
    themeClass: 'area-ferro-velho',
    district: "Distrito Industrial & Sucata • Periferia Norte",
    dangerLevel: "Cães de Guarda, Sucata Pesada & Mercenários",
    dangerLevelClass: 'danger',
    ambience: "Montanhas de carcaças enferrujadas sob o céu cinzento de fuligem, poças de óleo diesel refletindo néon barato e latidos agressivos de cães acorrentados.",
    lore: "Oficialmente um pátio de reciclagem e desmanche de autopeças. Nos bastidores, é a central clandestina onde veículos incriminadores são triturados, peças de tecnologia roubadas são desmontadas e onde o temido 'Rato' vende informações valiosas a quem tiver moedas ou ameaças suficientes.",
    rumor: "«Um sedan preto blindado foi guinchado para cá às quatro da manhã seguinte ao sumiço da garota. Até o meio-dia, o carro já tinha virado um bloco de aço compactado.»",
    pois: [
      {
        num: 1,
        title: "CONTÊINER ESCRITÓRIO DO RATO",
        headerDesc: "Contêiner enferrujado adaptado com mesa desordenada, ventilador ruidoso, pilhas de notas fiscais falsificadas e monitores analógicos em preto e branco.",
        skills: [
          { skill: "Intimidação", dt: 6, info: "O Rato cede sob ameaça e entrega uma caixa de charutos com cartões de visita de Constança Montenegro e maços de dinheiro vivo." },
          { skill: "Investigação", dt: 8, info: "Anotações com a placa oficial do sedan de luxo de Constança e a ordem manuscrita: 'Troca de para-choque e descarte das peças avariadas na madrugada de 01/07'." }
        ],
        context: "O Rato realizou serviços clandestinos de funilaria para a diretora após o carro colidir com galhos na entrada da mata, guardando recibos para futura extorsão."
      },
      {
        num: 2,
        title: "PRENSA HIDRÁULICA INDUSTRIAL",
        headerDesc: "Gigantesca máquina compactadora de sucata com êmbolo de aço capaz de reduzir automóveis a blocos sólidos de metal sob toneladas de pressão.",
        skills: [
          { skill: "Percepção", dt: 6, info: "Entre as lâminas de ferro há lascas de tinta preta metálica fresca e o brasão da montadora do sedan da reitoria escolar." },
          { skill: "Investigação", dt: 8, info: "Raspas de resina vegetal e cascas de pinheiro presas no metal do para-choque amassado antes de ser compactado." }
        ],
        context: "O para-choque avariado na estrada da mata foi destruído na prensa poucas horas após o sumiço de Sara para eliminar qualquer vestígio de batida."
      },
      {
        num: 3,
        title: "CÂMERAS CLANDESTINAS NA ESTRADA DA FLORESTA",
        headerDesc: "Câmeras de vigilância instaladas ilegalmente pelo Rato em postes podres de madeira na rodovia vicinal que leva à cerca da reserva florestal.",
        skills: [
          { skill: "Tecnologia", dt: 6, info: "Recupera gravação da noite de 31/06 para 01/07 às 02h14: o sedan preto de Constança trafegando em alta velocidade rumo à mata." },
          { skill: "Percepção", dt: 8, info: "A imagem congelada permite ver Sara imóvel com a cabeça apoiada no vidro do banco do passageiro e Constança ao volante." }
        ],
        context: "A evidência visual central do caso: Sara não fugiu sozinha; foi levada diretamente por Constança para a orla da mata."
      },
      {
        num: 4,
        title: "CANIL DOS MOLOSSOS DE GUARDA",
        headerDesc: "Cercado de arame farpado onde três cães de grande porte rosnam furiosamente diante de qualquer aproximação estranha.",
        skills: [
          { skill: "Adestramento", dt: 6, info: "Acalma os animais utilizando comida ou demonstração firme de autoridade física." },
          { skill: "Percepção", dt: 8, info: "Os cães ladram obstinadamente na direção da boca de uma tubulação de drenagem coberta por chapas de aço." }
        ],
        context: "Os animais farejam a umidade doce e pútrida que sopra da tubulação que conecta os limites do ferro-velho à reserva da floresta."
      },
      {
        num: 5,
        title: "PILHA DE ELETRÔNICOS & SUCATA DIGITAL",
        headerDesc: "Enorme depósito a céu aberto com dezenas de carcaças de computadores, rádios veiculares, baterias e placas eletrônicas empilhadas.",
        skills: [
          { skill: "Tecnologia", dt: 8, info: "Encontra o módulo receptor de rádio da segurança de Mina de Prata vendido clandestinamente pelo vigia Valdir para o Rato." },
          { skill: "Investigação", dt: 8, info: "O áudio armazenado na memória interna registra o diálogo entre o vigia e Constança confirmando que o alarme perimetral foi religado após a passagem do carro." }
        ],
        context: "Rato comprou o equipamento para revender peças, sem perceber que a memória flash preservou a comunicação incriminadora."
      },
      {
        num: 6,
        title: "GALPÃO DE PEÇAS & MOTORES CLANDESTINOS",
        headerDesc: "Hangar escuro e abafado repleto de motores dependurados em talhas de corrente e prateleiras com ferramentas pneumáticas pesadas.",
        skills: [
          { skill: "Investigação", dt: 6, info: "Caixa de ferramentas que oculta placas de trânsito clonadas compatíveis com a frota de serviços públicos de Fragktus." },
          { skill: "Ladinagem", dt: 8, info: "Recibos de pagamentos regulares feitos pelo Colégio Integrado Primórdio sob o disfarce contábil de 'descarte ecológico de sucatas'." }
        ],
        context: "Constança comprava o silêncio do Rato injetando verbas escolares no negócio ilegal de autopeças do ferro-velho."
      },
      {
        num: 7,
        title: "VALA DE ÓLEO & DESCARTE QUÍMICO",
        headerDesc: "Fosso comprido cavado na terra batida onde dezenas de litros de óleo de motor usado e solventes industriais formam uma poça viscosa negra.",
        skills: [
          { skill: "Percepção", dt: 6, info: "Chaveiro metálico em forma de xícara de café gravado com o nome 'Trisha' boiando na borda oleosa da vala." },
          { skill: "Investigação", dt: 8, info: "O item pertencia à bolsa de Trisha descartada pelos capangas de Constança em dezembro de 2060 após seu desaparecimento." }
        ],
        context: "A evidência material que conecta o destino de Sara à tragédia ocorrida com sua irmã Trisha exatamente no mesmo ecossistema criminoso."
      },
      {
        num: 8,
        title: "TRAILER ELEVADO DE VIGILÂNCIA",
        headerDesc: "Trailer de acampamento antigo calçado em dormentes de ferrovia no ponto mais alto do ferro-velho, usado como guarita pelos vigias do Rato.",
        skills: [
          { skill: "Investigação", dt: 6, info: "Binóculo militar de visão noturna e cadernos anotando frequências de rádio de ondas curtas operadas por Gustavo." },
          { skill: "Sobrevivência", dt: 8, info: "Um ajudante confessa aterrorizado que já viu figuras humanas feitas de galhos se movendo na margem da floresta durante madrugadas de nevoeiro." }
        ],
        context: "Os capangas da periferia respeitam e temem a floresta porque já presenciaram as manifestações de 'Ele' na fronteira do bairro."
      },
      {
        num: 9,
        title: "FOGUEIRA DE INCINERAÇÃO DE COBRE",
        headerDesc: "Tambor de óleo cortado com brasas ainda quentes e fumaça escura de plástico queimado, usado para limpar fiações e queimar evidências.",
        skills: [
          { skill: "Investigação", dt: 6, info: "Fivelas metálicas chamuscadas da mochila escolar de Sara Auguil e a placa de identificação com seu nome parcialmente derretida." },
          { skill: "Percepção", dt: 8, info: "Fragmento de página de caderno chamuscada onde Sara escreveu: 'A dor vai acabar. Trisha está me esperando nas árvores'." }
        ],
        context: "Constança entregou a mochila de Sara para incineração para simular que a jovem viajara para outra localidade levando seus pertences."
      },
      {
        num: 10,
        title: "TÚNEL DE DRENAGEM PARA A MATA DO NORTE",
        headerDesc: "Tubulação de concreto armado de 1,5m de diâmetro sob uma carcaça de caminhão betoneira, com fluxo de água correndo em direção à mata.",
        skills: [
          { skill: "Atletismo", dt: 6, info: "Permite avançar pelo interior da galeria subterrânea, evitando o cerco armado da guarita do KM 18." },
          { skill: "Percepção", dt: 8, info: "Marcas de pés descalços de mulher na lama do fundo do túnel seguindo em direção à clareira da floresta." }
        ],
        context: "A rota clandestina de pedestres utilizada pelos intermediários para acessar a orla da floresta sem chamar a atenção dos bloqueios policiais."
      }
    ]
  },
  'floresta-proibida': {
    id: 'floresta-proibida',
    name: "A Mata do Norte",
    shortName: "Mata do Norte",
    svgIcon: '<svg class="area-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L5 12h4l-3 6h5v4h2v-4h5l-3-6h4L12 2z"></path></svg>',
    themeClass: 'area-floresta-proibida',
    district: "Reserva Florestal Fechada • Zona Rural",
    dangerLevel: "Fauna Alterada, Névoa Tóxica & Armadilhas",
    dangerLevelClass: 'danger',
    ambience: "Árvores centenárias retorcidas, neblina espessa que engole os faróis, silêncio sepulcral quebrado apenas pelo estalar de galhos e arame farpado enferrujado.",
    lore: "Área de preservação ambiental isolada pelas autoridades municipais sob alegação de contaminação do solo e desabamentos de antigas minas. Trilhas fechadas ocultam instalações subterrâneas desativadas da época da fundação de Fragktus e clareiras onde eventos anômalos foram registrados.",
    rumor: "«Guardas florestais privados não usam fardas do Estado: usam coletes pretos táticos e atiram sem aviso contra qualquer um que passe da cerca do KM 18.»",
    pois: [
      {
        num: 1,
        title: "O CARVALHO ANCESTRAL & O ALTAR DE RAÍZES",
        headerDesc: "Colossal carvalho de dezenas de metros de altura no centro de uma clareira silenciosa e enevoada, cujas raízes expostas formam muralhas orgânicas contorcidas.",
        skills: [
          { skill: "Ocultismo", dt: 6, info: "O ponto focal da entidade 'Ele'. As raízes formam um casulo oco no tronco onde vidas humanas desenganadas são absorvidas para o 'mundo feliz'." },
          { skill: "Percepção", dt: 8, info: "No interior do oco há o sapato de Sara e fitas de tecido de seu vestido entrelaçadas em cipós que sangram seiva vegetal preta aromática." },
          { skill: "Sobrevivência", dt: 10, info: "Sob a névoa, a silhueta vegetal serena de Sara e Trisha Auguil pode ser entrevista na madeira viva: suas feições estão em paz, livres de dor." }
        ],
        context: "O clímax da investigação: Sara não foi assassinada por violência convencional, mas manipulada para se entregar voluntariamente à entidade para reencontrar a irmã e escapar do câncer incurável."
      },
      {
        num: 2,
        title: "PORTÃO MILITARIZADO DO KM 18",
        headerDesc: "Cancelas duplas reforçadas com cerca concertina cortante, refletores halógenos e guarita guarnecida por seguranças particulares armados dos Montenegro.",
        skills: [
          { skill: "Furtividade", dt: 6, info: "Permite contornar os refletores e sensores de movimento pelas ravinas laterais de mata densa." },
          { skill: "Investigação", dt: 8, info: "Os guardas operam sob contrato privado direto da Fundação Montenegro, com ordem expressa de atirar em qualquer civil sob pretexto de 'quarentena ambiental'." }
        ],
        context: "A barreira física estabelecida pela elite para garantir que nenhum policial ou investigador curioso chegue perto da clareira do pacto."
      },
      {
        num: 3,
        title: "TRILHAS DE PNEUS NA LAMA VERMELHA",
        headerDesc: "Estrada de terra batida que termina bruscamente na beira de um precipício de vegetação virgem, com profundos sulcos de pneus na lama recente.",
        skills: [
          { skill: "Sobrevivência", dt: 6, info: "Identifica os sulcos dos pneus do SUV de Constança manobrando na orla às 02h30 da madrugada de 01/07." },
          { skill: "Percepção", dt: 8, info: "Pegadas elegantes de salto alto de Constança descendo na terra e pegadas lentas e cambaleantes de Sara avançando descalça entre os galhos da mata." }
        ],
        context: "A cena da entrega física: Constança não precisou usar violência física, apenas abriu a porta do carro e indicou a direção da clareira a Sara."
      },
      {
        num: 4,
        title: "ACAMPAMENTO ABANDONADO DOS FUNDOS",
        headerDesc: "Tenda camuflada militar abandonada sob pinheiros altos, com gerador a gasolina desligado, caixas de ração militar e equipamentos de monitoramento biométrico.",
        skills: [
          { skill: "Investigação", dt: 6, info: "Relatórios de telemetria cardíaca transmitidos por sensores colocados em Sara no instante de sua chegada à clareira." },
          { skill: "Medicina", dt: 8, info: "O gráfico demonstra que os batimentos de Sara desaceleraram harmonicamente e os espasmos de dor cessaram no exato momento da fusão com as raízes." }
        ],
        context: "A equipe médica da Dra. Melissa monitorou os sinais vitais de Sara até o instante da simbiose com a floresta."
      },
      {
        num: 5,
        title: "A BOCA DA MINA DE PRATA COLONIAL",
        headerDesc: "Entrada de túnel subterrâneo escavado no século XIX com escoras de madeira apodrecida e trilhos enferrujados adentrando a montanha rochosa.",
        skills: [
          { skill: "História", dt: 6, info: "Inscrições antigas nas vigas de sustentação revelam que o primeiro pacto da família Montenegro com 'Ele' ocorreu aqui durante a fundação de Fragktus em 1880." },
          { skill: "Ocultismo", dt: 8, info: "Murais rupestres mostram que a prosperidade mineral da cidade foi obtida entregando periodicamente pessoas sem vigor vital à floresta." }
        ],
        context: "A origem secular da conspiração: a opulência de Fragktus foi construída sobre o pacto simbiótico estabelecido na mina."
      },
      {
        num: 6,
        title: "O CHARCO DAS ÁGUAS NEGRAS",
        headerDesc: "Brejo estagnado entre ravinas íngremes, coberto por uma névoa espessa sulfurosa com vegetação petrificada ao redor.",
        skills: [
          { skill: "Ciências", dt: 6, info: "A água possui resina orgânica idêntica àquela encontrada nos olhos petrificados do gato morto no beco do café." },
          { skill: "Percepção", dt: 8, info: "No reflexo das águas escuras, vultos humanoides parecem acenar em repouso absoluto sob a lâmina d'água." }
        ],
        context: "As manifestações ilusórias da entidade para desorientar e atrair intrusos para o lodo pantanoso."
      },
      {
        num: 7,
        title: "CABANA EM RUÍNAS DO GUARDA-FLORESTAL",
        headerDesc: "Construção de madeira carcomida com teto desmoronado, coberta por heras e musgos espessos no meio da trilha abandonada.",
        skills: [
          { skill: "Investigação", dt: 6, info: "Diário manuscrito do antigo guarda florestal registrando que Trisha Auguil foi trazida no porta-malas do carro da diretoria em 2060." },
          { skill: "Percepção", dt: 8, info: "Revólver calibre .38 descarregado no chão com cápsulas disparadas contra as raízes que invadiram as paredes do quarto." }
        ],
        context: "O guarda tentou intervir no sequestro de Trisha e foi consumido pela floresta para preservar o segredo dos Montenegro."
      },
      {
        num: 8,
        title: "A CERCA PERIMETRAL CORTADA (KM 22)",
        headerDesc: "Trecho da cerca de arame farpado que delimita a serra, aberto com alicate industrial entre árvores retorcidas.",
        skills: [
          { skill: "Percepção", dt: 6, info: "O cordão de prata de formatura com o nome gravado de Sara Auguil preso em uma ponta do arame farpado." },
          { skill: "Sobrevivência", dt: 8, info: "Pegadas quadrúpedes com sulcos de madeira viva escoltando as marcas de pés de Sara em direção ao coração da floresta." }
        ],
        context: "'Ele' enviou suas criaturas menores para guiar Sara pelo caminho seguro da mata até o altar das raízes."
      },
      {
        num: 9,
        title: "POSTO DE TRANSMISSÃO DE RÁDIO ABANDONADO",
        headerDesc: "Torre de comunicação metálica enferrujada no pico mais alto da reserva, com cabos rompidos estalando com o vento gelado.",
        skills: [
          { skill: "Tecnologia", dt: 6, info: "A antena capta as transmissões de ondas curtas emitidas desesperadamente do quarto de Gustavo em sinal intermitente." },
          { skill: "Percepção", dt: 8, info: "Os cipós que cobrem a torre ressoam emitindo sussurros audíveis em coro: 'Não há mais dor aqui... estamos em paz'." }
        ],
        context: "A entidade reverbera as vozes de Trisha e Sara através do magnetismo da torre, atormentando a mente de Gustavo na cidade."
      },
      {
        num: 10,
        title: "O CASULO SUBTERRÂNEO DE TRISHA E SARA",
        headerDesc: "Câmara natural sob as raízes mestras do carvalho, iluminada por esporos verdes bioluminescentes flutuando no ar perfumado de terra e jasmim.",
        skills: [
          { skill: "Ocultismo", dt: 8, info: "Comprova que as almas e memórias de Trisha e Sara estão entrelaçadas em harmonia indestrutível com a entidade da mata." },
          { skill: "Medicina", dt: 10, info: "Qualquer tentativa cirúrgica ou física de extirpar seus corpos das raízes acarretaria a morte cerebral imediata de ambas." }
        ],
        context: "O dilema moral final para os jogadores: punir Constança e expor a hipocrisia de Fragktus sabendo que Sara e Trisha encontraram o descanso eterno na floresta."
      }
    ]
  },
  'refugio-gustavo': {
    id: 'refugio-gustavo',
    name: "Refúgio do Gustavo",
    shortName: "Refúgio do Gustavo",
    svgIcon: '<svg class="area-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 8v4M12 16h.01"></path></svg>',
    themeClass: 'area-refugio-gustavo',
    district: "Bunker Subterrâneo Clandestino • Localização Confidencial",
    dangerLevel: "Paranoia Extrema, Armadilhas Caseiras & Escutas",
    dangerLevelClass: 'danger',
    ambience: "Luz de emergência vermelha, paredes forradas com cortiça e mapas repletos de linhas vermelhas de barbante ligando fotos, documentos e fita isolante.",
    lore: "O esconderijo ultra-secreto montado por Gustavo, um ex-investigador / confidente que vinha ajudando Sara a desvendar o que realmente aconteceu com Trisha. O local é blindado contra rastreamento eletrônico e reúne as maiores peças do quebra-cabeça conspiratório que envolve toda a cidade.",
    rumor: "«Gustavo não confia nem na própria sombra. Para falar com ele, você precisa saber a senha correta ou desarmar as armadilhas da porta.»",
    pois: [
      {
        num: 1,
        title: "MURAL CONSPIRATÓRIO DAS LINHAS VERMELHAS",
        headerDesc: "Parede inteira forrada de cortiça com dezenas de recortes de jornais de 2060 e 2061, retratos de Sara e Trisha e fios de lã vermelha cruzando o mapa de Fragktus.",
        skills: [
          { skill: "Investigação", dt: 6, info: "Os fios vermelhos conectam geometricamente três locais: a mansão de Constança em Mina de Prata, a Clínica Renovare e o ferro-velho do Rato." },
          { skill: "Percepção", dt: 8, info: "Gustavo calculou o intervalo de tempo entre o diagnóstico terminal e o sumiço: exatamente seis meses de manipulação psicológica em ambos os casos." }
        ],
        context: "Gustavo já havia decifrado toda a engrenagem do esquema criminoso, necessitando apenas de cúmplices confiáveis para obter as provas materiais."
      },
      {
        num: 2,
        title: "BANCADA DE ESCUTAS & INTERCEPTAÇÃO DE RÁDIO",
        headerDesc: "Mesa de aço repleta de receptores de radiofrequência militares, antenas direcionais, fones acolchoados e gravadores de fita cassete em operação contínua.",
        skills: [
          { skill: "Tecnologia", dt: 6, info: "Rádio sintonizado na frequência dos vigilantes privados de Mina de Prata gravando os diálogos da patrulha." },
          { skill: "Investigação", dt: 8, info: "Gravação da voz de Constança orientando a queima de arquivos no ferro-velho do Rato na manhã de 01/07." }
        ],
        context: "A chave que Gustavo entrega aos personagens para demonstrar que o desaparecimento de Sara foi uma entrega premeditada."
      },
      {
        num: 3,
        title: "TERMINAL COMPUTACIONAL AIR-GAPPED",
        headerDesc: "Desktop robusto com três telas panorâmicas sem placas de wi-fi ou cabos de internet, isolado fisicamente para evitar invasões da polícia ou de hackers.",
        skills: [
          { skill: "Hackeamento", dt: 8, info: "Descriptografa os vídeos capturados clandestinamente por Gustavo dos acessos da guarita de Mina de Prata na noite de 31 de junho." },
          { skill: "Percepção", dt: 8, info: "O vídeo em alta resolução mostra o sedan preto de Constança cruzando o portão sem ser parado pelo vigia Valdir." }
        ],
        context: "A gravação visual definitiva que desmonta qualquer tentativa da diretora de negar que esteve com Sara naquela madrugada."
      },
      {
        num: 4,
        title: "ARMÁRIO DE ARMAS & EQUIPAMENTOS TÁTICOS",
        headerDesc: "Armário de aço reforçado com fechadura de combinação mecânica, munições, lanternas táticas e coletes à prova de balas leves.",
        skills: [
          { skill: "Armamento", dt: 6, info: "Revólver Rossi calibre .38 carregado com munição expansiva, granadas de fumaça e lanternas de alta intensidade." },
          { skill: "Sobrevivência", dt: 8, info: "Kits cirúrgicos de campo com ampolas de atropina e adrenalina preparados para reverter sedações farmacológicas." }
        ],
        context: "Gustavo estava pronto para tentar resgatar Sara sozinho caso ninguém aceitasse ajudá-lo a enfrentar a elite de Fragktus."
      },
      {
        num: 5,
        title: "COFRE DE CHÃO SOB A PLACA DE AÇO",
        headerDesc: "Compartimento estanque oculto sob uma placa de aço parafusada no chão de concreto, disfarçada por um tapete de borracha.",
        skills: [
          { skill: "Ladinagem", dt: 6, info: "Abre o mecanismo de trava mecânica do cofre de chão." },
          { skill: "Investigação", dt: 8, info: "Dossiê jurídico com certidões comprovando que a Fundação Montenegro tentou quatro vezes comprar o imóvel do Café da Névoa antes dos sumiços." }
        ],
        context: "A evidência de cobiça imobiliária que serve de base para levar os cúmplices a julgamento na justiça comum."
      },
      {
        num: 6,
        title: "SECRETÁRIA ELETRÔNICA & GRAVAÇÃO MAGNÉTICA 07",
        headerDesc: "Aparelho analógico de secretária telefônica conectado a uma linha clonada do telefone do quarto de Sara na mansão Auguil.",
        skills: [
          { skill: "Percepção", dt: 6, info: "A última mensagem registrada às 19h00 de 31/06: a voz gélida de Constança dizendo 'O caminho está preparado, Sara. Trisha está esperando'." },
          { skill: "Psicologia", dt: 8, info: "A resposta entrecortada pelo choro de Sara: 'A dor tá insuportável... eu quero que pare, Constança'." }
        ],
        context: "O registro em áudio que comprova o estado de desespero físico e a manipulação final sofrida por Sara horas antes de seu sumiço."
      },
      {
        num: 7,
        title: "BANCADA DE QUÍMICA & ANTÍDOTOS EXPERIMENTAIS",
        headerDesc: "Bancada com tubos de ensaio, destilador caseiro e frascos âmbar de reagentes químicos sintetizados por Gustavo.",
        skills: [
          { skill: "Ciências", dt: 6, info: "Gustavo conseguiu furtar amostras do sedativo usado pela clínica e desenvolveu ampolas de um estimulante capaz de quebrar o transe hipnótico." },
          { skill: "Medicina", dt: 8, info: "O antídoto pode ser administrado nos personagens ou em NPCs para neutralizar toxinas alucinógenas." }
        ],
        context: "Recurso mecânico de jogo valioso para ajudar os investigadores a enfrentar os capangas dopados de Constança."
      },
      {
        num: 8,
        title: "PORTA BLINDADA COM CIRCUITO DE ALTA VOLTAGEM",
        headerDesc: "Porta de cofre de aço maciço com trancas de barra quádrupla e cabos grossos de cobre ligados a capacitores elétricos na maçaneta.",
        skills: [
          { skill: "Ladinagem", dt: 8, info: "Desarma a armadilha elétrica de 2.000 volts antes de encostar na maçaneta sem sofrer choque incapacitante." },
          { skill: "Tecnologia", dt: 6, info: "Identifica a chave geral camuflada no batente externo para desativar a corrente de alta voltagem." }
        ],
        context: "O sistema defensivo paranoico de Gustavo contra os mercenários que ele sabia que Constança mandaria para silenciá-lo."
      },
      {
        num: 9,
        title: "DUTO DE EVACUAÇÃO PARA O SISTEMA DE GALERIAS",
        headerDesc: "Tubo de ventilação reforçado no canto inferior da sala com escada de marinheiro que dá acesso a uma galeria de esgoto pluvial.",
        skills: [
          { skill: "Atletismo", dt: 6, info: "Rota de fuga rápida que permite ao grupo sair em um bueiro seguro a três quadras de distância caso o bunker seja cercado." },
          { skill: "Furtividade", dt: 8, info: "Permite sair e entrar sem que os olheiros da segurança privada posicionados nas esquinas percebam." }
        ],
        context: "A rota de emergência que garante que o grupo não fique encurralado pelos capangas da diretora."
      },
      {
        num: 10,
        title: "DIÁRIO CONFIDENCIAL DE GUSTAVO SOBRE OS JOGADORES",
        headerDesc: "Caderno de capa de couro preta com fecho elástico sobre a cama de solteiro de Gustavo, repleto de anotações datadas com caligrafia obsessiva.",
        skills: [
          { skill: "Investigação", dt: 6, info: "O caderno lista o nome de cada personagem jogador da mesa, seus vínculos com Sara e suas motivações individuais." },
          { skill: "Intuição", dt: 8, info: "Gustavo registrou: 'Eles são os únicos que ainda se importam com a verdade. Se eu morrer ou for pego, deixo tudo nas mãos deles'." }
        ],
        context: "A validação narrativa dos jogadores como os verdadeiros detetives e herdeiros da investigação de Sara Auguil."
      }
    ]
  }
};


const MesaAreaManager = {
  currentAreaId: 'mina-de-prata',
  selectedAreaId: 'mina-de-prata',

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
    const mobileCampaignItem = document.getElementById('mobile-campaign-item');
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
    if (mobileCampaignItem) {
      mobileCampaignItem.style.display = isMaster ? 'flex' : 'none';
    }
  },

  openMapModal() {
    const board = document.getElementById('area-roadmap-board') || document.getElementById('area-map-grid');
    if (!board) return;

    this.selectedAreaId = this.currentAreaId;
    board.innerHTML = '';

    const ROADMAP_CONFIG = {
      'floresta-proibida': {
        xPct: 50, yPct: 15,
        color: '#10b981',
        glow: 'rgba(16, 185, 129, 0.75)',
        roadD: 'M 500 295 C 490 235, 510 170, 500 135',
        roadTwinD: 'M 508 295 C 498 235, 518 170, 508 135'
      },
      'ferro-velho': {
        xPct: 18, yPct: 24,
        color: '#84cc16',
        glow: 'rgba(132, 204, 22, 0.75)',
        roadD: 'M 470 305 C 385 260, 285 210, 220 170',
        roadTwinD: 'M 475 312 C 390 267, 290 217, 225 177'
      },
      'mina-de-prata': {
        xPct: 82, yPct: 24,
        color: '#f97316',
        glow: 'rgba(249, 115, 22, 0.75)',
        roadD: 'M 530 305 C 615 260, 715 210, 780 170',
        roadTwinD: 'M 525 312 C 610 267, 710 217, 775 177'
      },
      'colegio-primordio': {
        xPct: 15, yPct: 56,
        color: '#14b8a6',
        glow: 'rgba(20, 184, 166, 0.75)',
        roadD: 'M 465 325 C 375 330, 275 340, 195 355',
        roadTwinD: 'M 465 333 C 375 338, 275 348, 195 363'
      },
      'clinica-renovare': {
        xPct: 85, yPct: 56,
        color: '#38bdf8',
        glow: 'rgba(56, 189, 248, 0.75)',
        roadD: 'M 535 325 C 625 330, 725 340, 805 355',
        roadTwinD: 'M 535 333 C 625 338, 725 348, 805 363'
      },
      'cafe-da-nevoa': {
        xPct: 29, yPct: 84,
        color: '#c084fc',
        glow: 'rgba(192, 132, 252, 0.75)',
        roadD: 'M 475 340 C 410 400, 360 455, 320 495',
        roadTwinD: 'M 481 346 C 416 406, 366 461, 326 501'
      },
      'refugio-gustavo': {
        xPct: 71, yPct: 84,
        color: '#ef4444',
        glow: 'rgba(239, 68, 68, 0.75)',
        roadD: 'M 525 340 C 590 400, 640 455, 680 495',
        roadTwinD: 'M 519 346 C 584 406, 634 461, 674 501'
      }
    };

    // 1. Constrói o SVG de Estradas Interconectadas (Estilo Desenho Cartográfico 1:1 com a referência)
    let roadsSvgHtml = `
      <svg class="roadmap-roads-svg" viewBox="0 0 1000 640" preserveAspectRatio="none">
        <defs>
          <radialGradient id="crossroads-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#ff5500" stop-opacity="0.35" />
            <stop offset="100%" stop-color="#ff5500" stop-opacity="0" />
          </radialGradient>
        </defs>
    `;

    // Leitos largos de terra de cada estrada
    Object.values(ROADMAP_CONFIG).forEach(cfg => {
      roadsSvgHtml += `
        <path d="${cfg.roadD}" fill="none" stroke="#0e1017" stroke-width="24" stroke-linecap="round" />
        <path d="${cfg.roadD}" fill="none" stroke="rgba(255, 255, 255, 0.06)" stroke-width="20" stroke-linecap="round" />
      `;
    });

    // Linhas duplas paralelas (estilo croqui desenhado à mão da referência)
    Object.values(ROADMAP_CONFIG).forEach(cfg => {
      roadsSvgHtml += `
        <path d="${cfg.roadD}" fill="none" stroke="rgba(255, 255, 255, 0.42)" stroke-width="2.2" stroke-linecap="round" />
        <path d="${cfg.roadTwinD}" fill="none" stroke="rgba(255, 255, 255, 0.42)" stroke-width="2.2" stroke-linecap="round" />
        <path d="${cfg.roadD}" fill="none" stroke="rgba(249, 115, 22, 0.5)" stroke-width="1.8" stroke-dasharray="6, 8" stroke-linecap="round" />
      `;
    });

    // Marco Zero / Encruzilhada Central
    roadsSvgHtml += `
        <!-- Brilho e Encruzilhada Central -->
        <circle cx="500" cy="320" r="50" fill="url(#crossroads-glow)" />
        <circle cx="500" cy="320" r="28" fill="#0f1015" stroke="rgba(255, 85, 0, 0.6)" stroke-width="2" stroke-dasharray="5, 3" />
        <circle cx="500" cy="320" r="6" fill="#f97316" />
        <text x="500" y="324" text-anchor="middle" fill="#a1a1aa" font-size="8.5" font-weight="700" font-family="sans-serif" letter-spacing="1.5">ENCRUZILHADA</text>
      </svg>
    `;

    board.innerHTML = roadsSvgHtml;

    // 2. Adiciona os 7 Nós Cartográficos (Apenas Símbolo Grande e Nome)
    Object.values(MESA_AREAS).forEach(area => {
      const cfg = ROADMAP_CONFIG[area.id] || { xPct: 50, yPct: 50, color: '#f97316', glow: 'rgba(249, 115, 22, 0.6)' };
      const isCurrent = area.id === this.currentAreaId;
      const isSelected = area.id === this.selectedAreaId;

      const node = document.createElement('div');
      node.className = `area-map-node ${isCurrent ? 'is-current' : ''} ${isSelected ? 'selected' : ''}`;
      node.id = `area-node-${area.id}`;
      node.style.left = `${cfg.xPct}%`;
      node.style.top = `${cfg.yPct}%`;
      node.style.setProperty('--node-color', cfg.color);
      node.style.setProperty('--node-glow', cfg.glow);
      node.onclick = () => this.selectAreaPreview(area.id);

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

    const isMaster = MesaApp && MesaApp.state && MesaApp.state.isMaster;
    const confirmBtn = document.getElementById('area-confirm-travel-btn');
    if (confirmBtn) {
      confirmBtn.style.display = isMaster ? 'inline-flex' : 'none';
    }

    const modal = document.getElementById('area-map-modal');
    if (modal) modal.classList.add('active');
  },

  selectAreaPreview(areaId) {
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
    const isMaster = MesaApp && MesaApp.state && MesaApp.state.isMaster;

    preview.innerHTML = `
      <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
        <span style="display: inline-flex; width: 20px; height: 20px; color: var(--area-accent, #f97316);">${area.svgIcon}</span>
        <strong style="color: #ffffff; font-size: 0.96rem;">${area.name}</strong> • <span style="color: #cbd5e1;">${area.district}</span>
      </div>
      <div style="color: #a1a1aa; font-size: 0.84rem; line-height: 1.45;">${area.ambience}</div>
      ${isCurrent ? '<div style="color: #4ade80; font-weight: 700; margin-top: 4px; font-size: 0.82rem;">[ Grupo já se encontra nesta localidade ]</div>' : ''}
      ${!isMaster && !isCurrent ? '<div style="color: #fbbf24; font-size: 0.82rem; margin-top: 4px;">(Apenas o Mestre pode autorizar deslocamento do grupo)</div>' : ''}
    `;

    const confirmBtn = document.getElementById('area-confirm-travel-btn');
    if (confirmBtn && isMaster) {
      confirmBtn.disabled = isCurrent;
      confirmBtn.style.opacity = isCurrent ? '0.5' : '1';
      confirmBtn.textContent = isCurrent ? 'GRUPO JÁ NESTA ÁREA' : `DESLOCAR GRUPO PARA ${area.shortName.toUpperCase()}`;
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

  openAboutAreaModal(areaId = null) {
    const targetId = areaId || this.currentAreaId;
    const area = (window.CAMPAIGN_AREAS && window.CAMPAIGN_AREAS[targetId]) || MESA_AREAS[targetId];
    if (!area) return;

    const areaName = area.nome || area.name;
    const pdiCount = (area.pontos_de_interesse && area.pontos_de_interesse.length) || (area.pois && area.pois.length) || 10;

    // Cabeçalho da Área
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
          <span class="area-meta-tag">${pdiCount} Pontos de Interesse</span>
        </div>
      `;
    }

    // Informações Públicas (Visíveis a todos)
    const publicInfo = document.getElementById('area-public-info');
    if (publicInfo) {
      const atmosfera = area.resumo_atmosfera || area.ambience || '';
      const acesso = area.requisitos_acesso ? `
        <div style="background: rgba(30, 24, 10, 0.6); border: 1.5px solid rgba(245, 158, 11, 0.4); border-left: 4px solid #f59e0b; border-radius: 4px; padding: 12px 14px; margin-top: 12px;">
          <strong style="color: #fbbf24; font-size: 0.78rem; text-transform: uppercase; display: block; margin-bottom: 4px;">REQUISITOS DE ACESSO & CONDIÇÕES:</strong>
          <span style="color: #fef3c7; font-size: 0.86rem; line-height: 1.45;">${area.requisitos_acesso}</span>
        </div>
      ` : '';

      // NPCs presentes com botões clicáveis para abrir o modal de NPC (EXCLUSIVO DO MESTRE)
      const isMasterUser = MesaApp && MesaApp.state && MesaApp.state.isMaster;
      let npcsHtml = '';
      if (isMasterUser && area.npcs_presentes && area.npcs_presentes.length > 0) {
        npcsHtml = `
          <div style="margin-top: 14px;">
            <strong style="color: #38bdf8; font-size: 0.76rem; text-transform: uppercase; display: block; margin-bottom: 6px;">[MESTRE] NPCS PRESENTES NESTA ÁREA (CLIQUE PARA ABRIR DOSSIÊ):</strong>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
              ${area.npcs_presentes.map(npcId => {
                const npc = (window.CAMPAIGN_NPCS && window.CAMPAIGN_NPCS[npcId]);
                const npcName = npc ? npc.nome.split('•')[0].trim() : npcId;
                return `<button type="button" class="mesa-npc-tag-btn" onclick="MesaAreaManager.openNpcModal('${npcId}')">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                  ${npcName}
                </button>`;
              }).join('')}
            </div>
          </div>
        `;
      }

      // Conexões de saída
      let exitsHtml = '';
      if (area.conexoes_saida && area.conexoes_saida.length > 0) {
        exitsHtml = `
          <div style="margin-top: 14px;">
            <strong style="color: #ff9933; font-size: 0.76rem; text-transform: uppercase; display: block; margin-bottom: 6px;">ROTAS & CONEXÕES DE SAÍDA:</strong>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
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
        <h4 style="margin: 0 0 6px 0; color: var(--area-accent, var(--mesa-orange)); font-size: 0.85rem; text-transform: uppercase;">ATMOSFERA & CENÁRIO</h4>
        <p style="margin: 0; font-size: 0.9rem; line-height: 1.55; color: #e4e4e7;">${atmosfera}</p>
        ${acesso}
        ${npcsHtml}
        ${exitsHtml}
        ${area.lore ? `<h4 style="margin-top: 14px;">HISTÓRIA & CONTEXTO LOCAL</h4><p>${area.lore}</p>` : ''}
        ${area.rumor ? `<div class="area-rumor-box"><strong>RUMOR INVESTIGATIVO:</strong> ${area.rumor}</div>` : ''}
      `;
    }

    // Dossiê do Mestre (Pontos de Interesse Estruturados)
    const isMaster = MesaApp && MesaApp.state && MesaApp.state.isMaster;
    const masterDossier = document.getElementById('area-master-dossier');
    const cardsContainer = document.getElementById('area-poi-cards-container');
    const quickNav = document.getElementById('area-poi-quicknav');

    if (masterDossier) {
      masterDossier.style.display = isMaster ? 'block' : 'none';
    }

    if (isMaster && cardsContainer) {
      cardsContainer.innerHTML = '';
      if (quickNav) quickNav.innerHTML = '';

      const pdiList = area.pontos_de_interesse || area.pois || [];
      pdiList.forEach((poi, idx) => {
        const num = poi.num || (idx + 1);
        const title = (poi.cabecalho && poi.cabecalho.nome) || poi.title || `Ponto de Interesse ${num}`;
        const desc = (poi.cabecalho && poi.cabecalho.descricao_publica) || poi.headerDesc || '';
        const masterNotes = poi.notas_mestre || poi.context || '';

        // 1. Botão QuickNav
        if (quickNav) {
          const navBtn = document.createElement('button');
          navBtn.className = 'poi-nav-btn';
          const shortTitle = title.length > 20 ? title.substring(0, 20) + '...' : title;
          navBtn.textContent = `#${num} ${shortTitle}`;
          navBtn.title = title;
          navBtn.onclick = () => {
            const el = document.getElementById(`poi-card-${num}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          };
          quickNav.appendChild(navBtn);
        }

        // 2. Quadro de Testes de Perícias
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

        // 3. Card do Ponto de Interesse
        const card = document.createElement('div');
        card.className = 'poi-card';
        card.id = `poi-card-${num}`;
        card.innerHTML = `
          <!-- CABEÇALHO DO PDI -->
          <div class="poi-header-block">
            <div class="poi-header-badge-row">
              <span class="poi-index-badge">PONTO DE INTERESSE ${num < 10 ? '0' + num : num}</span>
            </div>
            <h4 class="poi-header-title">${title}</h4>
            <p class="poi-header-desc">${desc}</p>
          </div>

          <!-- QUADRO DE TESTES -->
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

          <!-- NOTAS DO MESTRE (DESTAQUE VISUAL DE LEITURA RÁPIDA) -->
          <div class="mesa-master-notes-box">
            <div class="mesa-master-notes-icon" title="Segredo do Mestre">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            </div>
            <div style="flex: 1;">
              <span class="mesa-master-notes-label">[NOTAS DO MESTRE • SEGREDO CONFIDENCIAL]</span>
              <p style="margin: 0; font-size: 0.88rem; color: #fee2e2; line-height: 1.55;">${masterNotes}</p>
            </div>
          </div>
        `;

        cardsContainer.appendChild(card);
      });
    }

    const modal = document.getElementById('area-info-modal');
    if (modal) modal.classList.add('active');
  },

  openNpcModal(npcId = null) {
    if (!MesaApp || !MesaApp.state || !MesaApp.state.isMaster) {
      alert("[ACESSO RESTRITO] O Dossiê de NPCs e seus segredos são confidenciais e exclusivos do Mestre. Autentique seu Token de Mestre para consultar.");
      return;
    }

    const targetId = npcId || 'gustavo';
    const npcs = window.CAMPAIGN_NPCS || {};
    const npc = npcs[targetId] || Object.values(npcs)[0];
    if (!npc) return;

    const modal = document.getElementById('npc-dossier-modal');
    const content = document.getElementById('npc-dossier-content');
    if (!modal || !content) return;

    let roleClass = 'aliado';
    if (npc.ligacao_misterio.toLowerCase().includes('cúmplice') || npc.ligacao_misterio.toLowerCase().includes('mentora')) {
      roleClass = 'cumplice';
    } else if (npc.ligacao_misterio.toLowerCase().includes('vítima')) {
      roleClass = 'vitima';
    }

    // Seletor rápido de NPCs no topo
    let npcTabsHtml = '';
    Object.values(npcs).forEach(n => {
      const isSelected = n.id === targetId;
      const shortName = n.nome.split('•')[0].trim();
      npcTabsHtml += `
        <button type="button" class="mesa-btn ink-tag ${isSelected ? 'primary' : ''}" style="font-size: 0.78rem; padding: 4px 10px;" onclick="MesaAreaManager.openNpcModal('${n.id}')">
          ${shortName}
        </button>
      `;
    });

    content.innerHTML = `
      <div style="display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; border-bottom: 1px dashed rgba(255, 255, 255, 0.15); padding-bottom: 10px;">
        ${npcTabsHtml}
      </div>

      <div style="border-bottom: 2px solid #38bdf8; padding-bottom: 12px; margin-bottom: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
          <span style="font-size: 0.72rem; font-weight: 800; color: #94a3b8; background: rgba(255, 255, 255, 0.08); padding: 2px 7px; border-radius: 3px;">NPC ID: ${npc.id}</span>
          <span style="font-size: 0.74rem; font-weight: 800; padding: 3px 8px; border-radius: 4px; text-transform: uppercase; background: rgba(56, 189, 248, 0.15); color: #38bdf8; border: 1px solid #38bdf8;">${npc.ligacao_misterio.split('.')[0]}</span>
        </div>
        <h2 style="margin: 0; font-size: 1.25rem; font-weight: 800; color: #ffffff;">${npc.nome}</h2>
      </div>

      <div style="display: flex; flex-direction: column; gap: 14px;">
        <div>
          <span style="font-size: 0.72rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 3px;">Personalidade & Postura</span>
          <p style="margin: 0; font-size: 0.88rem; color: #e2e8f0; line-height: 1.55;">${npc.personalidade}</p>
        </div>

        <div>
          <span style="font-size: 0.72rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 3px;">História Resumida</span>
          <p style="margin: 0; font-size: 0.88rem; color: #cbd5e1; line-height: 1.55;">${npc.historia_resumida}</p>
        </div>

        <div>
          <span style="font-size: 0.72rem; font-weight: 800; color: #94a3b8; text-transform: uppercase; display: block; margin-bottom: 3px;">Informação Livre (Diálogo Casual)</span>
          <p style="margin: 0; font-size: 0.88rem; color: #e2e8f0; line-height: 1.55;">${npc.informacao_livre}</p>
        </div>

        <!-- SEGREDO ÚTIL EM DESTAQUE -->
        <div style="background: rgba(35, 12, 12, 0.75); border: 1.5px solid #ef4444; border-left: 4px solid #ef4444; border-radius: 6px; padding: 14px;">
          <div style="font-size: 0.75rem; font-weight: 900; color: #fca5a5; text-transform: uppercase; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 2l-2 2m-6 6l7-7-2-2-7 7v4h4z"></path><path d="M3 15v6h6l11-11-6-6L3 15z"></path></svg>
            [SEGREDO ÚTIL • PISTA CRUCIAL]
          </div>
          <p style="margin: 0; font-size: 0.9rem; color: #fee2e2; line-height: 1.55;">${npc.segredo_util}</p>
        </div>

        <!-- GATILHO DE REVELAÇÃO EM DESTAQUE -->
        <div style="background: rgba(30, 24, 10, 0.75); border: 1.5px solid #f59e0b; border-left: 4px solid #f59e0b; border-radius: 6px; padding: 14px;">
          <div style="font-size: 0.75rem; font-weight: 900; color: #fde68a; text-transform: uppercase; margin-bottom: 4px; display: flex; align-items: center; gap: 6px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
            [GATILHO DE REVELAÇÃO • REQUISITO EXATO]
          </div>
          <p style="margin: 0; font-size: 0.9rem; color: #fef3c7; line-height: 1.55;">${npc.gatilho_revelacao}</p>
        </div>
      </div>
    `;

    modal.classList.add('active');
  },

  closeModals() {
    MesaApp.closeModal('area-map-modal');
    MesaApp.closeModal('area-info-modal');
    MesaApp.closeModal('npc-dossier-modal');
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
