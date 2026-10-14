/* ============================================================
   MESA VIRTUAL E ENGINES — WUITALUR RPG
   - Glitch Background Engine
   - Diagonal Comic Stream Engine (Ficha)
   - State, 4-Char Tokens, Mobile UI e Real-Time Live Editing (Zero Emojis, In-Place DOM Updates)
   ============================================================ */

const MESA_VERSION = 'v1.9.3';

// SVG CONSTANTS (Sem Emojis)
const SVG_ICONS = {
  eye: `<svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  pencil: `<svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`,
  key: `<svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>`
};

// ---- MODO LEVE (PERFORMANCE) ----
// Aparelhos fracos, celulares e quem prefere menos movimento recebem a versão sem efeitos pesados.
const MESA_LITE = (() => {
  try {
    const weakCpu = (navigator.hardwareConcurrency || 8) <= 4;
    const weakRam = (navigator.deviceMemory || 8) <= 4;
    const touch = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    const small = window.innerWidth < 900;
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const forced = localStorage.getItem('mesa_perf') === 'lite';
    const full = localStorage.getItem('mesa_perf') === 'full';
    return !full && (forced || weakCpu || weakRam || touch || small || reduced);
  } catch (e) { return false; }
})();
if (MESA_LITE) document.documentElement.classList.add('perf-lite');

// ---- 1. MOTOR DE GLITCH DO FUNDO DA MESA ----
const GlitchEngine = {
  canvas: null,
  ctx: null,
  width: 0,
  height: 0,
  glitches: [],
  running: true,

  init() {
    if (MESA_LITE) return;
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
    if (MESA_LITE) return;
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
    if (MESA_LITE) return;
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
    if (MESA_LITE) return;
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


// ---- 2.2 MOTOR DE SEGURANÇA E PROTEÇÃO CONTRA FORÇA BRUTA (RATE LIMITING E TIMING PROTECTION) ----
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


// ---- 3. MESA APP (GERENCIADOR DE ESTADO, SUPABASE E TOKENS SEGUROS) ----
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
    if (tokenToValidate) {
      await this.checkSavedToken(tokenToValidate);
    } else {
      this.updateTokenBtnState();
    }

    if (this.SUPABASE_URL && this.SUPABASE_KEY && window.supabase) {
      this.supabase = window.supabase.createClient(this.SUPABASE_URL, this.SUPABASE_KEY);
      await this.fetchPlayers();
      this.subscribeToRealtime();
      this.startAreaSyncPolling();
    } else {
      console.warn("Supabase não disponível. Exibindo dados locais.");
      this.loadMockData();
    }

    MesaColetaveis.init();
    MesaChat.init();
    MesaReactions.init();
    MesaDice.init();
    MesaAreaManager.init();
    this.updateTokenBtnState();
    if (window.MesaCombate && typeof MesaCombate.updateMasterControls === 'function') {
      MesaCombate.updateMasterControls();
    }
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
        if (window.MesaCombate && typeof MesaCombate.updateMasterControls === 'function') MesaCombate.updateMasterControls();
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
    document.body.classList.toggle('is-master', Boolean(this.state && this.state.isMaster));
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
      const menuAreaBtn = document.getElementById('menu-area-btn');
      if (menuAreaBtn) menuAreaBtn.style.display = 'flex';
      if (chooseAreaBtn) chooseAreaBtn.style.display = 'inline-flex';
      if (mobileChooseAreaItem) mobileChooseAreaItem.style.display = 'flex';

      const navCombateBtn = document.getElementById('nav-combate-btn');
      if (navCombateBtn) navCombateBtn.style.display = 'inline-flex';
      const menuCombateBtn = document.getElementById('menu-combate-btn');
      if (menuCombateBtn) menuCombateBtn.style.display = 'flex';
      const mobileCombateBtn = document.getElementById('mobile-combate-item');
      if (mobileCombateBtn) mobileCombateBtn.style.display = 'flex';
      const menuColetaveisBtn = document.getElementById('menu-coletaveis-btn');
      if (menuColetaveisBtn) menuColetaveisBtn.style.display = 'flex';
      const mobileColetaveisBtn = document.getElementById('mobile-coletaveis-item');
      if (mobileColetaveisBtn) mobileColetaveisBtn.style.display = 'flex';
      const combatColetaveisBtn = document.getElementById('combat-coletaveis-item');
      if (combatColetaveisBtn) combatColetaveisBtn.style.display = 'flex';
    } else if (this.state.myToken) {
      if (tokenLabel) {
        tokenLabel.textContent = this.state.myPlayerSlot ? `Slot ${this.state.myPlayerSlot} Conectado` : 'Token Ativo';
      }
      if (alertBadge) alertBadge.style.display = 'none';
      if (chooseAreaBtn) chooseAreaBtn.style.display = 'none';
      if (mobileChooseAreaItem) mobileChooseAreaItem.style.display = 'none';

      const navCombateBtn = document.getElementById('nav-combate-btn');
      if (navCombateBtn) navCombateBtn.style.display = 'none';
      const menuCombateBtn = document.getElementById('menu-combate-btn');
      if (menuCombateBtn) menuCombateBtn.style.display = 'none';
      const mobileCombateBtn = document.getElementById('mobile-combate-item');
      if (mobileCombateBtn) mobileCombateBtn.style.display = 'none';
      const menuColetaveisBtn = document.getElementById('menu-coletaveis-btn');
      if (menuColetaveisBtn) menuColetaveisBtn.style.display = 'none';
      const mobileColetaveisBtn = document.getElementById('mobile-coletaveis-item');
      if (mobileColetaveisBtn) mobileColetaveisBtn.style.display = 'none';
      const combatColetaveisBtn = document.getElementById('combat-coletaveis-item');
      if (combatColetaveisBtn) combatColetaveisBtn.style.display = 'none';
    } else {
      if (tokenLabel) tokenLabel.textContent = 'Token';
      if (alertBadge) alertBadge.style.display = 'flex';
      if (chooseAreaBtn) chooseAreaBtn.style.display = 'none';
      if (mobileChooseAreaItem) mobileChooseAreaItem.style.display = 'none';

      const navCombateBtn = document.getElementById('nav-combate-btn');
      if (navCombateBtn) navCombateBtn.style.display = 'none';
      const menuCombateBtn = document.getElementById('menu-combate-btn');
      if (menuCombateBtn) menuCombateBtn.style.display = 'none';
      const mobileCombateBtn = document.getElementById('mobile-combate-item');
      if (mobileCombateBtn) mobileCombateBtn.style.display = 'none';
      const menuColetaveisBtn = document.getElementById('menu-coletaveis-btn');
      if (menuColetaveisBtn) menuColetaveisBtn.style.display = 'none';
      const mobileColetaveisBtn = document.getElementById('mobile-coletaveis-item');
      if (mobileColetaveisBtn) mobileColetaveisBtn.style.display = 'none';
      const combatColetaveisBtn = document.getElementById('combat-coletaveis-item');
      if (combatColetaveisBtn) combatColetaveisBtn.style.display = 'none';
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
    if (window.MesaCombate && typeof MesaCombate.updateMasterControls === 'function') {
      MesaCombate.updateMasterControls();
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
      imagem: 'assets/pera.png?v=1.5.1',
      avatar: 'assets/pera_avatar.png?v=1.5.1',
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
      nome: 'Willian Kars', idade: '17 anos', altura: '1,86m', raca: 'Animalesco', arquetipo: 'Valentão', imagem: 'assets/william.png?v=1.5.1', avatar: 'assets/william_avatar.png?v=1.5.1',
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
      imagem: 'assets/blinko.png?v=2',
      avatar: 'assets/blinko_avatar.png',
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
        let sysArea = 'none';
        data.forEach(raw => {
          if (raw.atributos) {
            const attr = typeof raw.atributos === 'string' ? JSON.parse(raw.atributos) : raw.atributos;
            if (attr && attr._sys_area) sysArea = attr._sys_area;
          }
        });
        if (window.MesaAreaManager) {
          console.log("[SYNC] Area canônica da mesa no banco:", sysArea);
          MesaAreaManager.applyArea(sysArea, false);
        }
        
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

          if (p.token === 'H2Q9' || p.slot === 4) {
            p.imagem = 'assets/pera.png?v=1.5.1';
            p.avatar = 'assets/pera_avatar.png?v=1.5.1';
          }

          if (p.token === 'J8W4' || p.slot === 5) {
            p.imagem = 'assets/william.png?v=1.5.1';
            p.avatar = 'assets/william_avatar.png?v=1.5.1';
          }

          if (p.token === 'T6D3' || p.slot === 6) {
            p.imagem = 'assets/john.png';
            p.avatar = 'assets/john_avatar.png';
          }

          if (p.token === 'Y4M7' || p.slot === 7) {
            p.imagem = 'assets/odara.png?v=3';
            p.avatar = 'assets/odara_avatar.png?v=3';
          }

          if (p.token === 'F9C5' || p.slot === 8) {
            p.imagem = 'assets/blinko.png?v=2';
            p.avatar = 'assets/blinko_avatar.png';
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
          id: 4, slot: 4, token: 'H2Q9', nome: 'Pera Hylidae da Silva', idade: '18 anos', altura: '1,58m', raca: 'Animalesco', arquetipo: 'Rebelde', classe: 'Adivinha', imagem: 'assets/pera.png?v=1.5.1', avatar: 'assets/pera_avatar.png?v=1.5.1',
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
          id: 5, slot: 5, token: 'J8W4', nome: 'Willian Kars', idade: '17 anos', altura: '1,86m', raca: 'Animalesco', arquetipo: 'Valentão', imagem: 'assets/william.png?v=1.5.1', avatar: 'assets/william_avatar.png?v=1.5.1',
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
          imagem: 'assets/blinko.png?v=2', avatar: 'assets/blinko_avatar.png',
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
      
      // Sincroniza estados do sistema gravados no slot 1 (área, coletáveis, notebook e abertura)
      if (data && data[0] && data[0].atributos) {
        try {
          const p1Attrs = typeof data[0].atributos === 'string' ? JSON.parse(data[0].atributos) : data[0].atributos;
          if (p1Attrs) {
            if (Array.isArray(p1Attrs._sys_coletaveis) && p1Attrs._sys_coletaveis.length > 0 && window.MesaColetaveis) {
              const { items: merged, changed } = MesaColetaveis.mergeCanonical(p1Attrs._sys_coletaveis);
              const remoteStr = JSON.stringify(merged);
              if (remoteStr !== JSON.stringify(MesaColetaveis.items)) {
                MesaColetaveis.items = merged;
                localStorage.setItem('wu_coletaveis_v2', remoteStr);
                if (typeof MesaColetaveis.render === 'function') MesaColetaveis.render();
                if (typeof MesaColetaveis.renderFicha === 'function') MesaColetaveis.renderFicha();
                if (changed && MesaApp && MesaApp.state && MesaApp.state.isMaster) {
                  MesaColetaveis.saveAndSync();
                }
              }
            }
            if (p1Attrs._sys_notebook && window.MesaNotebookSara) {
              const nb = p1Attrs._sys_notebook;
              if (nb.active && !MesaNotebookSara.isActive) {
                if (nb.camImages) MesaNotebookSara.camImages = nb.camImages;
                MesaNotebookSara.activeCam = nb.activeCam || 1;
                MesaNotebookSara.triggerStart(nb.sessionStartTime);
                if (nb.stage === 'cctv') MesaNotebookSara.showCctvStage(nb.activeCam || 1);
              } else if (!nb.active && MesaNotebookSara.isActive) {
                MesaNotebookSara.triggerStop();
              }
            }
            if (p1Attrs._sys_igris_shop && window.MesaIgrisShop) {
              const ig = p1Attrs._sys_igris_shop;
              if (ig.interests) MesaIgrisShop.interests = ig.interests;
              if (ig.merchantImage) MesaIgrisShop.setMerchantImage(ig.merchantImage);
            }
            if (p1Attrs._sys_abertura && window.MesaAbertura) {
              const ab = p1Attrs._sys_abertura;
              const ov = document.getElementById('abertura-overlay');
              const isActive = ov && ov.classList.contains('active');
              if (ab.active && !isActive && (Date.now() - (ab.timestamp || 0) < 55000)) {
                const offset = Math.max(0, (Date.now() - (ab.timestamp || 0)) / 1000);
                MesaAbertura.triggerAbertura(offset);
              } else if (!ab.active && isActive) {
                MesaAbertura.triggerStop();
              }
            }
            if (p1Attrs._sys_combate && window.MesaCombate) {
              const cb = p1Attrs._sys_combate;
              if (cb.active && !MesaCombate.isActive) {
                MesaCombate.startCombat(cb, false);
              } else if (!cb.active && MesaCombate.isActive) {
                MesaCombate.stopCombat(false);
              } else if (cb.active && MesaCombate.isActive && cb.opponentName !== MesaCombate.opponentName) {
                MesaCombate.setOpponent(cb, false);
              }
              if (cb.turnCycle) {
                MesaCombate.syncTurnCycle(cb.turnCycle);
              } else if (MesaCombate.turnCycle && MesaCombate.turnCycle.active && !cb.active) {
                MesaCombate.stopTurnCycle(false);
              }
            }
          }
        } catch(eSync) {}
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

  
  startAreaSyncPolling() {
    if (this._areaSyncTimer) clearInterval(this._areaSyncTimer);
    this._areaSyncTimer = setInterval(async () => {
      if (!this.supabase) return;
      try {
        const { data } = await this.supabase
          .from('personagens')
          .select('atributos')
          .eq('id', 1)
          .single();
        if (data && data.atributos) {
          const attrs = typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos;

          // 1. Sincronização de Área
          const targetArea = (attrs && attrs._sys_area) ? attrs._sys_area : 'none';
          if (window.MesaAreaManager && targetArea !== MesaAreaManager.currentAreaId) {
            console.log("[HEARTBEAT 1s] Sincronizando com a área do Mestre:", targetArea);
            MesaAreaManager.applyArea(targetArea, false);
          }

          // 2. Sincronização de Coletáveis (liberações/edições do Mestre)
          if (attrs && Array.isArray(attrs._sys_coletaveis) && window.MesaColetaveis) {
            const { items: merged } = MesaColetaveis.mergeCanonical(attrs._sys_coletaveis);
            const remoteStr = JSON.stringify(merged);
            const localStr = JSON.stringify(MesaColetaveis.items);
            if (remoteStr !== localStr) {
              MesaColetaveis.items = merged;
              localStorage.setItem('wu_coletaveis_v2', remoteStr);
              MesaColetaveis.render();
              if (typeof MesaColetaveis.renderFicha === 'function') MesaColetaveis.renderFicha();
            }
          }

          // 3. Sincronização do Notebook da Sara (Transmissão em tempo real)
          if (attrs && attrs._sys_notebook && window.MesaNotebookSara) {
            const nb = attrs._sys_notebook;
            if (nb.active) {
              if (!MesaNotebookSara.isActive) {
                if (nb.camImages) MesaNotebookSara.camImages = nb.camImages;
                MesaNotebookSara.activeCam = nb.activeCam || 1;
                MesaNotebookSara.triggerStart(nb.sessionStartTime);
              }
              if (nb.stage && nb.stage !== MesaNotebookSara.stage) {
                if (nb.stage === 'cctv') {
                  const lockStage = document.getElementById('notebook-lock-stage');
                  const cctvStage = document.getElementById('notebook-cctv-stage');
                  if (lockStage) lockStage.style.display = 'none';
                  if (cctvStage) cctvStage.style.display = 'flex';
                  MesaNotebookSara.stage = 'cctv';
                  MesaNotebookSara.switchCamera(nb.activeCam || 1, false);
                } else if (nb.stage === 'lock') {
                  MesaNotebookSara.showLockScreen();
                }
              }
              if (nb.activeCam && MesaNotebookSara.stage === 'cctv' && MesaNotebookSara.activeCam !== nb.activeCam) {
                MesaNotebookSara.switchCamera(nb.activeCam, false);
              }
              if (nb.signalLost !== undefined && nb.signalLost !== MesaNotebookSara.signalLost) {
                if (nb.signalLost) {
                  MesaNotebookSara.signalLost = true;
                  const lostEl = document.getElementById('cctv-signal-lost');
                  if (lostEl) lostEl.style.display = 'flex';
                } else {
                  MesaNotebookSara.restoreSignal();
                }
              }
            } else if (!nb.active && MesaNotebookSara.isActive) {
              MesaNotebookSara.triggerStop();
            }
          }

          // 3.1 Sincronização da Tenda do Igris
          if (attrs && attrs._sys_igris_shop && window.MesaIgrisShop) {
            const ig = attrs._sys_igris_shop;
            if (ig.interests) {
              MesaIgrisShop.interests = ig.interests;
              if (MesaIgrisShop.isOpen) MesaIgrisShop.renderShowcase();
            }
            if (ig.merchantImage) MesaIgrisShop.setMerchantImage(ig.merchantImage);
          }

          // 4. Sincronização de Abertura
          if (attrs && attrs._sys_abertura && window.MesaAbertura) {
            const ab = attrs._sys_abertura;
            const ov = document.getElementById('abertura-overlay');
            const isActive = ov && ov.classList.contains('active');
            if (ab.active && !isActive) {
              if (Date.now() - (ab.timestamp || 0) < 55000) {
                const offset = Math.max(0, (Date.now() - (ab.timestamp || 0)) / 1000);
                MesaAbertura.triggerAbertura(offset);
              }
            } else if (!ab.active && isActive) {
              MesaAbertura.triggerStop();
            }
          }

          // 5. Sincronização de Combate
          if (attrs && attrs._sys_combate && window.MesaCombate) {
            const cb = attrs._sys_combate;
            if (cb.active && !MesaCombate.isActive) {
              MesaCombate.startCombat(cb, false);
            } else if (!cb.active && MesaCombate.isActive) {
              MesaCombate.stopCombat(false);
            } else if (cb.active && MesaCombate.isActive && cb.opponentName !== MesaCombate.opponentName) {
              MesaCombate.setOpponent(cb, false);
            }
            if (cb.turnCycle) {
              MesaCombate.syncTurnCycle(cb.turnCycle);
            } else if (MesaCombate.turnCycle && MesaCombate.turnCycle.active && !cb.active) {
              MesaCombate.stopTurnCycle(false);
            }
          }
        }
      } catch(e) {}
    }, 1000);
  },

  subscribeToRealtime() {
    if (!this.supabase) return;

    if (this.channel) {
      try { this.supabase.removeChannel(this.channel); } catch(e) {}
    }

    const channel = this.supabase.channel('mesa_main_channel', {
      config: {
        broadcast: { ack: false }
      }
    });

    this.channel = channel;
    if (window.MesaChat) MesaChat.channel = channel;

    // 1. Postgres changes para sincronizar dados dos personagens e estados
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'personagens' }, (payload) => {
      console.log("Atualização da mesa recebida via Postgres CDC:", payload);
      this.fetchPlayers();
    });

    // 2. Sincronização de Coletáveis
    channel.on('broadcast', { event: 'coletaveis_sync' }, (payload) => {
      const data = payload.payload;
      if (data && Array.isArray(data.items) && window.MesaColetaveis) {
        const { items: merged } = MesaColetaveis.mergeCanonical(data.items);
        MesaColetaveis.items = merged;
        localStorage.setItem('wu_coletaveis_v2', JSON.stringify(merged));
        MesaColetaveis.render();
        if (typeof MesaColetaveis.renderFicha === 'function') MesaColetaveis.renderFicha();
      }
    });

    // 3. Sincronização de Área
    channel.on('broadcast', { event: 'area_changed' }, (payload) => {
      const data = payload.payload;
      if (data && data.areaId && window.MesaAreaManager && MesaAreaManager.currentAreaId !== data.areaId) {
        MesaAreaManager.applyArea(data.areaId, false);
        MesaApp.closeModal('area-map-modal');
      }
    });

    // 4. Abertura da Mesa
    channel.on('broadcast', { event: 'play_abertura' }, (payload) => {
      const ts = payload && payload.payload && payload.payload.timestamp;
      const offset = ts ? Math.max(0, (Date.now() - ts) / 1000) : 0;
      if (window.MesaAbertura) MesaAbertura.triggerAbertura(offset);
    });
    channel.on('broadcast', { event: 'stop_abertura' }, () => {
      if (window.MesaAbertura) MesaAbertura.triggerStop();
    });

    // 5. Notebook da Sara (Dispositivos da Campanha)
    channel.on('broadcast', { event: 'notebook_start' }, (payload) => {
      if (window.MesaNotebookSara) {
        if (payload.payload && payload.payload.camImages) {
          MesaNotebookSara.camImages = payload.payload.camImages;
        }
        if (payload.payload && payload.payload.activeCam) {
          MesaNotebookSara.activeCam = payload.payload.activeCam;
        }
        MesaNotebookSara.triggerStart(payload.payload && payload.payload.sessionStartTime);
      }
    });

    channel.on('broadcast', { event: 'notebook_stop' }, () => {
      if (window.MesaNotebookSara) {
        MesaNotebookSara.triggerStop();
      }
    });

    channel.on('broadcast', { event: 'notebook_sync' }, (payload) => {
      if (window.MesaNotebookSara && payload.payload) {
        MesaNotebookSara.handleIncomingSync(payload.payload);
      }
    });

    // 5.1 Modo de Combate da Campanha
    channel.on('broadcast', { event: 'combat_start' }, (payload) => {
      if (window.MesaCombate && payload.payload) {
        MesaCombate.startCombat(payload.payload, false);
      }
    });
    channel.on('broadcast', { event: 'combat_update' }, (payload) => {
      if (window.MesaCombate && payload.payload) {
        MesaCombate.setOpponent(payload.payload, false);
      }
    });
    channel.on('broadcast', { event: 'combat_stop' }, () => {
      if (window.MesaCombate) {
        MesaCombate.stopCombat(false);
      }
    });
    channel.on('broadcast', { event: 'combat_turn_sync' }, (payload) => {
      if (window.MesaCombate && payload.payload) {
        MesaCombate.syncTurnCycle(payload.payload);
      }
    });
    channel.on('broadcast', { event: 'combat_turn_stop' }, () => {
      if (window.MesaCombate) {
        MesaCombate.stopTurnCycle(false);
      }
    });

    // 5.2 A Tenda do Igris (Interface de Mercador)
    channel.on('broadcast', { event: 'igris_shop_open' }, (payload) => {
      if (window.MesaIgrisShop) {
        if (payload.payload && payload.payload.interests) {
          MesaIgrisShop.interests = payload.payload.interests;
        }
        if (payload.payload && payload.payload.merchantImage) {
          MesaIgrisShop.setMerchantImage(payload.payload.merchantImage);
        }
        MesaIgrisShop.open();
      }
    });

    channel.on('broadcast', { event: 'igris_interest_sync' }, (payload) => {
      if (window.MesaIgrisShop && payload.payload) {
        MesaIgrisShop.handleIncomingInterestSync(payload.payload);
      }
    });

    // 6. Mensagens de Chat e Reações
    channel.on('broadcast', { event: 'chat_msg' }, (payload) => {
      if (window.MesaChat) MesaChat.receiveMessage(payload.payload);
    });

    channel.on('broadcast', { event: 'chat_message' }, (payload) => {
      if (window.MesaChat && payload.payload) {
        MesaChat.receiveMessage({
          id: payload.payload.id || 'msg_' + Date.now(),
          sender_name: payload.payload.sender || 'Sistema',
          is_master: payload.payload.role === 'mestre',
          content: payload.payload.text,
          created_at: new Date().toISOString()
        });
      }
    });

    channel.on('broadcast', { event: 'player_reaction' }, (payload) => {
      const data = payload.payload;
      if (data && data.slot && window.MesaReactions) {
        MesaReactions.showBubble(data.slot, data.faceKey || data.emoji);
      }
    });

    channel.on('broadcast', { event: 'dice_roll' }, (payload) => {
      const data = payload.payload;
      if (data && window.MesaDice) {
        MesaDice.playRollAnimation(data);
      }
    });

    channel.on('broadcast', { event: 'vitals_sync' }, (payload) => {
      const data = payload.payload;
      if (data && data.slot) {
        MesaApp.handleIncomingVitals(data);
      }
    });

    channel.on('broadcast', { event: 'media_sync' }, (payload) => {
      if (window.MesaMediaPlayer && (!MesaApp.state || !MesaApp.state.isMaster)) {
        MesaMediaPlayer.handleIncomingSync(payload.payload);
      }
    });

    channel.subscribe((status, err) => {
      console.log("[MESA REALTIME UNIFICADO] Status da conexão:", status, err || '');
    });
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
    if (window.MesaCombate && MesaCombate.isActive) {
      const dock = document.getElementById('combat-players-dock');
      const activeCount = (this.state.players || []).filter(p => p && p.nome).length;
      const currentCards = dock ? dock.querySelectorAll('.combat-player-card').length : 0;
      if (!dock || currentCards !== activeCount || currentCards === 0) {
        MesaCombate.renderPlayers();
      } else {
        MesaCombate.updateAllPlayerVitals();
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
    if (window.MesaCombate && MesaCombate.isActive) {
      MesaCombate.updatePlayerVitals(player);
    }

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
    if (window.MesaCombate && MesaCombate.isActive) {
      MesaCombate.updatePlayerVitals(player);
    }

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
    const isMaster = Boolean(this.state && this.state.isMaster);

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
          <div class="cube-placeholder-box" style="position:relative;">
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

        <!-- 5. Coletáveis e Itens da Campanha -->
        <div class="ficha-open-section ficha-section-coletaveis" style="margin-top: 18px; width: 100%;">
          <div class="ink-ribbon-title ficha-coletaveis-title" style="background: #d97706; display: flex; align-items: center; justify-content: space-between; transform: none !important; clip-path: none !important; width: 100%; box-sizing: border-box; border-radius: 0;">
            <span>ITENS E COLETÁVEIS EM POSSE</span>
            ${isMaster ? `
              <button type="button" class="ficha-open-catalog-btn" onclick="MesaColetaveis.openModal()" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.3); color: #fff; font-size: 0.72rem; padding: 2px 8px; cursor: pointer; border-radius: 2px;">Catálogo Geral (Mestre) &rarr;</button>
            ` : ''}
          </div>
          <div id="ficha-coletaveis-container" class="ficha-coletaveis-container" style="margin-top: 12px;"></div>
        </div>
      </div>
    `;

    if (startParticles) {
      FichaParticlesEngine.start();
    }

    fichaModal.classList.add('active');
    const infoCol = document.querySelector('.ficha-info-col');
    if (infoCol) {
      infoCol.scrollTop = 0;
    }
    const portraitCol = document.querySelector('.ficha-portrait-col');
    if (portraitCol) {
      portraitCol.onwheel = (e) => {
        const targetInfo = document.querySelector('.ficha-info-col');
        if (targetInfo) {
          targetInfo.scrollTop += e.deltaY;
        }
      };
    }
    if (window.MesaColetaveis) {
      MesaColetaveis.renderFicha();
    }

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
        if (window.MesaCombate && typeof MesaCombate.updateMasterControls === 'function') {
          MesaCombate.updateMasterControls();
        }
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
    this.channel = MesaApp.channel;
  },

  async fetchMessages() {
    if (!MesaApp.supabase) return;

    try {
      const { data, error } = await MesaApp.supabase
        .from('mensagens_chat')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(60);

      if (data && data.length > 0) {
        // Tenta achar a mudanca de area mais recente no historico do chat
        const latestAreaMsg = data.find(m => m.content && m.content.startsWith('SYS_AREA:'));
        if (latestAreaMsg && window.MesaAreaManager) {
          const areaId = latestAreaMsg.content.split('|')[0].split(':')[1];
          if (areaId) {
            MesaAreaManager.applyArea(areaId, false);
          }
        }

        this.messages = data.reverse().map(m => {
          let c = m.content;
          if (c && c.startsWith('SYS_AREA:')) {
            const parts = c.split('|');
            c = parts.length > 1 ? parts.slice(1).join('|') : '';
          }
          return {
            id: m.id,
            sender_name: m.sender_name,
            is_master: m.is_master,
            content: c,
            created_at: m.created_at,
            token: m.sender_token
          };
        }).filter(m => m.content && m.content.trim() !== '');
        
        this.renderMessages();
      }
    } catch(err) {
      console.warn("Erro ao buscar historico de mensagens:", err);
    }
  },

  receiveMessage(msg) {
    if (!msg || !msg.content) return;
    
    // Tratamento de mudanca de area real-time via chat (SISTEMA_AREA)
    if (msg.content.startsWith('SYS_AREA:')) {
      const parts = msg.content.split('|');
      const areaId = parts[0].split(':')[1];
      if (window.MesaAreaManager && areaId && MesaAreaManager.currentAreaId !== areaId) {
        MesaAreaManager.applyArea(areaId, false);
      }
      if (parts.length > 1 && parts[1].trim()) {
        msg.content = parts.slice(1).join('|');
      } else {
        return; // Mensagem silenciosa de sistema, não exibe no chat visual
      }
    }

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


// ---- 5. MOTOR DE REAÇÕES DE EMOJIS EM PIXEL ART E BALÕES DE FALA COMIC ----
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
// 7. SISTEMA DE ÁREAS E MAPA DE INVESTIGAÇÃO — WUITALUR RPG
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
      "npcs_presentes": ["isaque-valente"],
    "id": "colegio-primordio",
    "name": "Colégio Integrado Primórdio",
    "shortName": "Colégio Primórdio",
    "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10v6M2 10l10-5 10 5-10 5z\"></path><path d=\"M6 12v5c3 3 9 3 12 0v-5\"></path></svg>",
    "themeClass": "area-colegio-primordio",
    "district": "Setor Estudantil e Cívico • Centro de Fragktus",
    "dangerLevel": "Inspetores Rígidos e Vigilância Escolar",
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
            "info": "No fundo da gaveta há uma pasta suspensa rotulada 'Transferências e Saúde - Casos Especiais', contendo os relatórios de Trisha Auguil (ano letivo de 2060) e Sara Auguil (2061), acompanhados de cópias de laudos médicos confidenciais."
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
    "dangerLevel": "Ameaça Desconhecida",
    "dangerLevelClass": "danger",
    "ambience": "A floresta que cerca Mina de Prata é densa, úmida e sufocante. A luz do sol mal penetra a copa das árvores e o chão é um tapete espesso de folhas mortas que abafa os passos. Não há animais cantando; o silêncio é pesado e hostil.",
    "lore": "No centro de uma clareira específica, o ar torna-se subitamente gélido e cheira a enxofre e lodo.",
    "rumor": "Dizem que o bosque abriga forças antigas e anomalias inexplicáveis.",
    "pois": []
  },
  "casa-auguil": {
    "id": "casa-auguil",
    "name": "Casa Auguil",
    "shortName": "Casa Auguil",
    "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"></path><polyline points=\"9 22 9 12 15 12 15 22\"></polyline></svg>",
    "themeClass": "area-casa-auguil",
    "district": "Bairro Residencial • Mina de Prata",
    "dangerLevel": "Isolamento Policial e Atividade Paranormal",
    "dangerLevelClass": "danger",
    "ambience": "Uma moradia de dois andares de alto padrão, agora transformada em cena de crime. O exterior está isolado e envolto em dezenas de fitas policiais amarelas e pretas de 'Não Ultrapasse'. A atmosfera é pesada, cheirando a lodo e abandono.",
    "lore": "Casa da família de Sara e Trisha. O local de onde Trisha desapareceu, e onde Sara sofreu seus últimos dias de delírio antes de fugir para a floresta.",
    "rumor": "A polícia investigou a casa durante o dia, mas não encontraram nada. Contudo, os vizinhos dizem que, à noite, a casa parece... respirar.",
        "pois": [
      {
        "cabecalho": {
          "nome": "A Janela da Cozinha (Infiltração)",
          "descricao_publica": "Nas traseiras da casa, a janela da cozinha encontra-se meio aberta. Não há fitas da polícia aqui, mas o quintal está escuro e coberto de folhas secas."
        },
        "testes": [
          {
            "pericia": "Ladinagem / Crime",
            "ct_dt": 6,
            "informacao_revelada": "Forçar a tranca da janela basculante de forma limpa para abrir passagem suficiente sem quebrar o vidro."
          },
          {
            "pericia": "Furtividade",
            "ct_dt": 7,
            "informacao_revelada": "Necessário se os jogadores tentarem entrar pela frente ou pelos fundos sem alertar os vizinhos. A casa está sob investigação, e qualquer luz de lanterna muito forte pode chamar a atenção de patrulhas."
          },
          {
            "pericia": "Sem Teste (Uso de Item)",
            "ct_dt": "-",
            "informacao_revelada": "Se utilizarem o \"Molho de Chaves da Casa Auguil\" obtido com Elias, abrem a porta da frente ou dos fundos silenciosamente e sem qualquer risco."
          }
        ],
        "notas_mestre": "Este ponto define como os jogadores entram. O silêncio inicial da casa é propositado para contrastar com a tensão do que vão encontrar no andar superior e com a fuga barulhenta que terão de fazer no final."
      },
      {
        "cabecalho": {
          "nome": "O Tapete da Escada (O Rastro)",
          "descricao_publica": "A escada de madeira que liga a sala ao corredor do segundo andar é forrada por um tapete que outrora foi claro. Agora, está imundo. O silêncio na casa é quebrado apenas pelo ranger dos degraus sob o peso dos jogadores."
        },
        "testes": [
          {
            "pericia": "Investigação",
            "ct_dt": 6,
            "informacao_revelada": "Permite analisar as manchas escuras no tapete de perto. Os jogadores percebem que, nos primeiros degraus, as manchas têm o formato perfeito de patas de um gato grande. Contudo, à medida que a escada sobe, as pegadas distorcem-se, derretem e transformam-se nas pegadas pesadas e arrastadas de lodo de um humanoide deformado."
          },
          {
            "pericia": "Sobrevivência / Rastrear",
            "ct_dt": 7,
            "informacao_revelada": "O jogador percebe que as pegadas não indicam alguém a descer. O que quer que tenha subido, nunca mais voltou para o andar de baixo. A ameaça ainda está no segundo piso."
          }
        ],
        "notas_mestre": "Esta é a principal construção de tensão do cenário. Confirma aos jogadores que a entidade parasitou o gato e depois mudou de forma. Prepara o estado mental do grupo para o combate iminente."
      },
      {
        "cabecalho": {
          "nome": "A Mesa de Sara (A Escrivaninha no Quarto)",
          "descricao_publica": "O quarto de Sara é um reflexo de uma mente em colapso. A escrivaninha encostada à parede é um caos absoluto de cadernos rasgados, pratos com restos de comida e canetas partidas. No centro deste desastre, três coisas destacam-se imediatamente à luz das lanternas."
        },
        "testes": [
          {
            "pericia": "Sem Teste (Interação Automática)",
            "ct_dt": "-",
            "informacao_revelada": "Os jogadores avistam imediatamente os três itens centrais:\n\n• O Diário de Sara (que dita que \"a porta precisa de carne para girar a chave\").\n• A Poção Solar de Cura (frasco dourado que cura 1d8).\n• O Notebook de Sara (ligado, bloqueado por senha, mas com o botão \"Acesso Rápido: Câmaras de Segurança\" disponível)."
          },
          {
            "pericia": "Investigação",
            "ct_dt": 7,
            "informacao_revelada": "Vasculhando com cuidado as gavetas e as pilhas de papel no escuro. Se passarem, encontram dois itens fora do comum soterrados: o Livro Infantil \"O Viajante e a Terra\" e a Caixa Negra e Dourada selada."
          },
          {
            "pericia": "Tecnologia (Falha Automática)",
            "ct_dt": "-",
            "informacao_revelada": "Tentar hackear a senha do Notebook falha. Apenas a interface das câmaras está acessível."
          }
        ],
        "notas_mestre": "É crucial que encontrem a poção antes do combate (para terem hipótese contra o Zumbi). A interação com o Notebook deve ser apresentada aqui, mas o seu uso definitivo e aterrante (a falha de sinal e a chegada de Constança) só ocorre após o combate na banheira."
      },
      {
        "cabecalho": {
          "nome": "A Banheira de Porcelana (O Clímax)",
          "descricao_publica": "A porta do quarto de banho adjacente ao quarto de Sara está entreaberta. O cheiro de água podre, esgoto e cobre (sangue) atinge os jogadores como um soco. Lá dentro, a banheira de porcelana branca está transbordar de uma água densa, negra e imóvel, como piche líquido."
        },
        "testes": [
          {
            "pericia": "Percepção",
            "ct_dt": 8,
            "informacao_revelada": "Ao aproximarem-se da porta do quarto de banho, permite notar que a superfície da água preta na banheira vibrou ligeiramente, não devido a passos, mas como se algo denso estivesse a respirar submerso. Evita que o grupo sofra um ataque surpresa."
          },
          {
            "pericia": "Iniciativa (Combate Automático)",
            "ct_dt": "-",
            "informacao_revelada": "Assim que entrarem no raio de alcance ou tocarem na água, o Zumbi de Lodo (Cadáver de Kali) ergue-se violentamente da banheira, iniciando o combate final da sessão."
          },
          {
            "pericia": "Sem Teste (Pós-Combate)",
            "ct_dt": "-",
            "informacao_revelada": "Com o monstro morto e o lodo a escoar pelo ralo da banheira, os jogadores encontram automaticamente o Laço Rosa de Kali preso no metal, confirmando o sacrifício."
          }
        ],
        "notas_mestre": "Após encontrarem o Laço Rosa e a tensão baixar momentaneamente, deve ativar o gatilho sonoro da Porta da Frente a abrir-se no andar de baixo. Se os jogadores correrem para ver as câmaras no Notebook, verão a figura encapuzada de Constança a subir as escadas antes de o ecrã falhar em estática, dando início à fuga desesperada."
      }
    ]
  },
  "cafe-da-nevoa": {
    "id": "cafe-da-nevoa",
    "name": "Café da Névoa",
    "shortName": "Café",
    "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 8h1a4 4 0 0 1 0 8h-1\"></path><path d=\"M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z\"></path><line x1=\"6\" y1=\"1\" x2=\"6\" y2=\"4\"></line><line x1=\"10\" y1=\"1\" x2=\"10\" y2=\"4\"></line><line x1=\"14\" y1=\"1\" x2=\"14\" y2=\"4\"></line></svg>",
    "themeClass": "area-cafe-da-nevoa",
    "district": "Rua Comercial • Centro",
    "dangerLevel": "Abandono Recente e Luto",
    "dangerLevelClass": "warning",
    "ambience": "O sol está a pôr-se e a rua comercial está a esvaziar. O letreiro de néon do Café da Névoa, que costumava ser um ponto de encontro acolhedor, está apagado. As cadeiras da esplanada já foram recolhidas e empilhadas de forma descuidada. O cheiro a café torrado mistura-se com o odor forte a lixívia e água suja do chão recém-lavado.",
    "lore": "Café onde Sara trabalhava como barista. Era um ambiente agitado, mas que perdeu sua luz nos últimos dias.",
    "rumor": "Dizem que a gerente desapareceu e o outro funcionário, Elias, não fala com ninguém.",
    "pois": []
  },
  "clinica-renovare": {
    "id": "clinica-renovare",
    "name": "Clínica Renovare",
    "shortName": "Clínica",
    "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 12h-4l-3 9L9 3l-3 9H2\"></path></svg>",
    "themeClass": "area-clinica-renovare",
    "district": "Centro Médico • Setor Sul",
    "dangerLevel": "Risco Biológico e Segurança",
    "dangerLevelClass": "danger",
    "ambience": "A Clínica Renovare revela-se muito mais do que um simples pronto-socorro de bairro. O interior é uma instalação de ponta, com iluminação fria, piso impecável e um design circular opressivo. O núcleo do edifício é um grande bloco central fechado, rodeado por um longo corredor quadrado. A clínica está ativa, com luzes acesas e enfermeiros circulando.",
    "lore": "Centro hospitalar altamente equipado sob direção da misteriosa Dra. Melissa Vane.",
    "rumor": "A administração oculta pacientes no Bloco Central à noite, com prontuários que nunca chegam aos servidores públicos.",
    "pois": []
  }
};



const MesaAreaManager = {
  currentAreaId: 'none',
  selectedAreaId: 'none',

  init() {
    // Se o Supabase estiver disponível, fetchPlayers já carregou a área correta do banco!
    if (!MesaApp.supabase) {
      const saved = localStorage.getItem('mesa_current_area');
      if (saved && MESA_AREAS[saved]) {
        this.currentAreaId = saved;
      } else {
        this.currentAreaId = 'none';
      }
      this.selectedAreaId = this.currentAreaId;
      this.applyArea(this.currentAreaId, false);
    }
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
        },
                'casa-auguil': {
          xPct: 50, yPct: 20,
          color: '#e5e7eb',
          glow: 'rgba(229, 231, 235, 0.75)',
          roadD: 'M 500 160 C 500 200, 500 260, 500 320',
          roadTwinD: 'M 508 160 C 508 200, 508 260, 508 320'
        },
        'cafe-da-nevoa': {
            xPct: 24, yPct: 80,
            color: '#f59e0b',
            glow: 'rgba(245, 158, 11, 0.75)',
            roadD: 'M 280 512 C 380 512, 450 400, 500 320',
            roadTwinD: 'M 280 520 C 380 520, 450 408, 508 320'
          },
          'clinica-renovare': {
            xPct: 76, yPct: 80,
            color: '#3b82f6',
            glow: 'rgba(59, 130, 246, 0.75)',
            roadD: 'M 720 512 C 620 512, 550 400, 500 320',
            roadTwinD: 'M 720 520 C 620 520, 550 408, 508 320'
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

    console.log("[MASTER ACTION] Deslocando grupo oficialmente para:", this.selectedAreaId);
    this.applyArea(this.selectedAreaId, true);
    this.closeModals();
  },

    applyArea(areaId, shouldBroadcast = false) {
    const area = MESA_AREAS[areaId];
    if (!area) return;

    this.currentAreaId = areaId;
    this.selectedAreaId = areaId;
    localStorage.setItem('mesa_current_area', areaId);

    // Atualiza o selo visual de versão e área em tempo real no canto inferior
    const badge = document.getElementById('mesa-version-badge');
    if (badge) {
      badge.textContent = MESA_VERSION;
    }

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

    if (shouldBroadcast) {
      // 1. Gravação imediata persistente no banco de dados (ID 1)
      if (MesaApp.supabase) {
        (async () => {
          try {
            const { data } = await MesaApp.supabase
              .from('personagens')
              .select('atributos')
              .eq('id', 1)
              .single();
            const attrs = data && data.atributos 
              ? (typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos) 
              : {};
            attrs._sys_area = area.id;
            await MesaApp.supabase
              .from('personagens')
              .update({ atributos: attrs })
              .eq('id', 1);
            console.log("[SYNC MASTER] Área oficial salva no Supabase:", area.id);
          } catch(err) {
            console.error("[SYNC MASTER] Erro ao gravar área:", err);
          }
        })();
      }

      // 2. Disparo de WebSocket Broadcast imediato (< 50ms)
      const broadcastPayload = {
        areaId: area.id,
        name: area.name,
        timestamp: Date.now()
      };
      if (MesaChat && MesaChat.channel) {
        try {
          MesaChat.channel.send({
            type: 'broadcast',
            event: 'area_changed',
            payload: broadcastPayload
          });
        } catch(e) {}
      }
      if (MesaApp && MesaApp.channel) {
        try {
          MesaApp.channel.send({
            type: 'broadcast',
            event: 'area_changed',
            payload: broadcastPayload
          });
        } catch(e) {}
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
          ${isMasterUser ? `<span class="area-meta-tag">${pdiCount} ${pdiCount === 1 ? 'Ponto de Interesse' : 'Pontos de Interesse'}</span>` : ''}
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
            <strong class="area-exits-title">ROTAS E CONEXÕES DE SAÍDA:</strong>
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
          <h4 class="area-section-title">ATMOSFERA E CENÁRIO</h4>
        </div>
        <div class="area-atmosphere-content">
          ${atmosferaParagraphs}
        </div>
        ${exitsHtml}
        ${area.lore ? `<div class="area-lore-block"><h4 class="area-section-title" style="margin-top: 20px;">HISTÓRIA E CONTEXTO LOCAL</h4><p class="area-atmosphere-p">${area.lore}</p></div>` : ''}
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
              <h5>CONDIÇÕES DE ACESSO E INFILTRAÇÃO</h5>
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
                ${area.texto_narrativo ? `
                <button type="button" class="pdi-tool-btn" style="color: var(--accent-red); border-color: rgba(255,17,51,0.4);" onclick="MesaAreaManager.openInteriorDrawer('${area.id}')">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                  ${area.titulo_narrativo || 'Texto Narrativo'}
                </button>
                ` : ''}
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

      openInteriorDrawer(areaId) {
    const area = (window.CAMPAIGN_AREAS && window.CAMPAIGN_AREAS[areaId]) || MESA_AREAS[areaId];
    if (area && area.texto_narrativo) {
        const titleEl = document.getElementById('interior-drawer-title');
        if(titleEl) titleEl.textContent = area.titulo_narrativo || 'Texto Narrativo';
        
        const paras = area.texto_narrativo.split('\n').filter(p => p.trim());
        const formatted = paras.map(p => `<p><em>${p.trim()}</em></p>`).join('');
        
        const contentHtml = `
          <div style="font-family: var(--font-body, 'Merriweather', serif); font-size: 0.95rem; line-height: 1.6; color: var(--ink-text-dim);">
            ${formatted}
            
            <div style="margin-top: 24px; display: flex; gap: 10px; flex-direction: column;">
              <button type="button" class="mesa-btn-primary" onclick="MesaChat.sendMessage(document.getElementById('narrative-text-raw').innerText); MesaAreaManager.closeInteriorDrawer(); if(!MesaChat.isOpen) MesaChat.toggleChat();" style="width: 100%; justify-content: center;">
                <svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"></path></svg>
                Enviar para o Chat da Mesa
              </button>
              <button type="button" class="mesa-btn-secondary" onclick="navigator.clipboard.writeText(document.getElementById('narrative-text-raw').innerText); alert('Texto copiado para a área de transferência!');" style="width: 100%; justify-content: center;">
                <svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                Copiar Texto
              </button>
            </div>
            <div id="narrative-text-raw" style="display: none;">${area.texto_narrativo.replace(/"/g, '&quot;')}</div>
          </div>
        `;
        document.getElementById('interior-drawer-content').innerHTML = contentHtml;
    }
    document.body.classList.add('interior-drawer-open');
  },
  closeInteriorDrawer() {
    document.body.classList.remove('interior-drawer-open');
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

    let attrHtml = '';
    if (npc.atributos) {
      const keys = Object.keys(npc.atributos);
      if (keys.length > 0) {
        const boxes = keys.map(k => {
          return `<div style="flex: 1; background: rgba(255,255,255,0.03); border: 1px solid var(--ink-edge-soft); padding: 8px; border-radius: 6px; text-align: center; min-width: 60px;">
            <div style="font-size: 0.65rem; color: var(--ink-text-dim); text-transform: uppercase; margin-bottom: 4px;">${k}</div>
            <div style="font-size: 1.1rem; font-weight: bold; color: var(--ink-text); font-family: var(--font-heading, 'Cinzel', serif);">${npc.atributos[k]}</div>
          </div>`;
        }).join('');
        attrHtml = `<div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;">${boxes}</div>`;
      }
    }

    content.innerHTML = `
      ${npcTabsHtml}

      <div class="npc-sheet-head" style="display: flex; flex-direction: column; align-items: flex-start; gap: 6px; margin-bottom: 20px;">
        <h2 class="npc-sheet-name" style="margin: 0;">${npc.nome}</h2>
        <span class="npc-role-tag" style="margin: 0;">${roleName}</span>
        ${npc.pv !== undefined ? `<span class="npc-pv-tag" style="background:#16a34a; color:#fff; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem;">PV: ${npc.pv}</span>` : ''}
      </div>
      
      ${attrHtml}

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
          ${npc.notas_mestre ? `
          <div class="npc-callout" style="border-left-color: #f59e0b; background: rgba(245, 158, 11, 0.05);">
            <span class="npc-callout-label" style="color: #f59e0b;">Notas do Mestre</span>
            <p>${npc.notas_mestre.replace(/\n/g, '<br><br>')}</p>
          </div>` : ''}
        </div>
    `;

    document.body.classList.add('npc-drawer-open');
  },

  closeModals() {
    MesaApp.closeModal('area-map-modal');
    MesaApp.closeModal('area-info-modal');
    this.closeNpcDrawer();
    this.closeInteriorDrawer();
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
    const aberturaBtn = document.getElementById('menu-abertura-btn');
    if (aberturaBtn) {
      aberturaBtn.style.display = isMaster ? 'flex' : 'none';
    }
    const skipBtn = document.getElementById('abertura-skip-btn');
    if (skipBtn) {
      skipBtn.style.display = isMaster ? 'flex' : 'none';
    }
    const mediaBtn = document.getElementById('menu-media-btn');
    if (mediaBtn) {
      mediaBtn.style.display = isMaster ? 'flex' : 'none';
    }

    const navDispositivosBtn = document.getElementById('nav-dispositivos-btn');
    if (navDispositivosBtn) {
      navDispositivosBtn.style.display = isMaster ? 'inline-flex' : 'none';
    }

    const menuDispositivosBtn = document.getElementById('menu-dispositivos-btn');
    if (menuDispositivosBtn) {
      menuDispositivosBtn.style.display = isMaster ? 'flex' : 'none';
    }

    const menuCombateBtn = document.getElementById('menu-combate-btn');
    if (menuCombateBtn) {
      menuCombateBtn.style.display = isMaster ? 'flex' : 'none';
    }
    const menuColetaveisBtn = document.getElementById('menu-coletaveis-btn');
    if (menuColetaveisBtn) {
      menuColetaveisBtn.style.display = isMaster ? 'flex' : 'none';
    }

    const notebookCloseBtn = document.getElementById('notebook-close-btn');
    if (notebookCloseBtn) {
      notebookCloseBtn.style.display = isMaster ? 'flex' : 'none';
    }

    if (!isMaster && window.MesaDispositivos && MesaDispositivos.isOpen) {
      MesaDispositivos.closeDrawer();
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
    const mobileAberturaBtn = document.getElementById('mobile-abertura-item');
    if (mobileAberturaBtn) {
      mobileAberturaBtn.style.display = isMaster ? 'flex' : 'none';
    }
    const mobileMediaBtn = document.getElementById('mobile-media-item');
    if (mobileMediaBtn) {
      mobileMediaBtn.style.display = isMaster ? 'flex' : 'none';
    }
    const mobileDispBtn = document.getElementById('mobile-dispositivos-item');
    if (mobileDispBtn) {
      mobileDispBtn.style.display = isMaster ? 'flex' : 'none';
    }
    const mobileCombateBtn = document.getElementById('mobile-combate-item');
    if (mobileCombateBtn) {
      mobileCombateBtn.style.display = isMaster ? 'flex' : 'none';
    }
    const mobileColetaveisBtn = document.getElementById('mobile-coletaveis-item');
    if (mobileColetaveisBtn) {
      mobileColetaveisBtn.style.display = isMaster ? 'flex' : 'none';
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
  if (window.MesaMediaPlayer) MesaMediaPlayer.init();
  if (window.MesaCombate) MesaCombate.init();
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

  // Fecha Ficha, Dossiê de NPCs e menus ao pressionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const fichaModal = document.getElementById('ficha-modal');
      if (fichaModal && fichaModal.classList.contains('active')) {
        MesaApp.closeModal('ficha-modal');
        return;
      }
      if (window.MesaCombate) {
        const turnModal = document.getElementById('combat-turn-modal');
        if (turnModal && turnModal.classList.contains('active')) {
          MesaCombate.closeTurnModal();
          return;
        }
        const selectModal = document.getElementById('combat-select-modal');
        if (selectModal && selectModal.classList.contains('active')) {
          MesaCombate.closeSelectModal();
          return;
        }
      }
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

// ============================================================
// SISTEMA DE COLETÁVEIS E ITENS ENCONTRADOS
// ============================================================
const MesaColetaveis = {
  items: [],
  searchQuery: '',
  fichaSearchQuery: '',

  getPlayerOptions() {
    const players = (MesaApp && MesaApp.state && MesaApp.state.players) || [];
    const options = [];
    const defaultNames = [
      'Thulita De La Benevidez',
      'Sanguiminerva "Minerva" Qamari',
      'Eric "Blade" Tepes Adams',
      'Pera Hylidae da Silva',
      'Willian Kars',
      'John Doe',
      'Odara De La Benevidez',
      "Canneth 'Blinko' Biloxi"
    ];
    for (let slot = 1; slot <= 8; slot++) {
      const p = players[slot - 1] || (players.find ? players.find(x => x && (x.slot === slot || x.id === slot)) : null);
      const name = p && p.nome ? p.nome : defaultNames[slot - 1];
      options.push({ slot, name });
    }
    return options;
  },

  getPlayerName(slot) {
    if (!slot) return null;
    const num = parseInt(slot, 10);
    const opts = this.getPlayerOptions();
    const found = opts.find(o => o.slot === num);
    return found ? found.name : `Slot ${slot}`;
  },

  mergeCanonical(list) {
    const canonical = window.CAMPAIGN_COLETAVEIS || window.MESA_COLETAVEIS || [];
    if (!Array.isArray(list)) list = [];
    let merged = [...list];
    let changed = false;

    canonical.forEach(can => {
      const idx = merged.findIndex(it => it.id === can.id);
      if (idx === -1) {
        merged.push({ 
          ...can, 
          desbloqueado: can.desbloqueado !== undefined ? can.desbloqueado : true,
          posse: can.posse !== undefined ? can.posse : null
        });
        changed = true;
      } else {
        if (can.imagem && merged[idx].imagem !== can.imagem) {
          merged[idx].imagem = can.imagem;
          changed = true;
        }
        if (can.paginas && !merged[idx].paginas) {
          merged[idx].paginas = can.paginas;
          changed = true;
        }
        if (can.detalhe && merged[idx].detalhe !== can.detalhe) {
          merged[idx].detalhe = can.detalhe;
          changed = true;
        }
        if (can.resumo && merged[idx].resumo !== can.resumo) {
          merged[idx].resumo = can.resumo;
          changed = true;
        }
        if (merged[idx].posse === undefined) {
          merged[idx].posse = can.posse !== undefined ? can.posse : null;
          changed = true;
        }
        if (['col_notebook_sara', 'col_livro_viajante_terra', 'col_caixa_negra_dourada'].includes(can.id)) {
          if (!merged[idx].desbloqueado) {
            merged[idx].desbloqueado = true;
            changed = true;
          }
        }
      }
    });

    return { items: merged, changed };
  },

  init() {
    const canonical = window.CAMPAIGN_COLETAVEIS || window.MESA_COLETAVEIS || [];

    // Prioridade 1: Sincronização oficial remota do Supabase
    if (MesaApp && MesaApp.state && MesaApp.state.players && MesaApp.state.players[0] && MesaApp.state.players[0].atributos) {
      try {
        const raw = MesaApp.state.players[0].atributos;
        const attrs = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (attrs && Array.isArray(attrs._sys_coletaveis) && attrs._sys_coletaveis.length > 0) {
          const { items: merged, changed } = this.mergeCanonical(attrs._sys_coletaveis);
          this.items = merged;
          localStorage.setItem('wu_coletaveis_v2', JSON.stringify(this.items));
          if (changed && MesaApp && MesaApp.state && MesaApp.state.isMaster) {
            this.saveAndSync();
          }
          return;
        }
      } catch(e) {}
    }

    const saved = localStorage.getItem('wu_coletaveis_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const { items: merged } = this.mergeCanonical(parsed);
          this.items = merged;
        } else {
          this.items = canonical.map(it => ({ ...it, desbloqueado: it.desbloqueado === true, posse: it.posse || null }));
        }
      } catch (e) {
        this.items = canonical.map(it => ({ ...it, desbloqueado: it.desbloqueado === true, posse: it.posse || null }));
      }
    } else {
      this.items = canonical.map(it => ({ ...it, desbloqueado: it.desbloqueado === true, posse: it.posse || null }));
      localStorage.setItem('wu_coletaveis_v2', JSON.stringify(this.items));
    }
  },

  assignItem(itemId, slotValue) {
    if (!MesaApp || !MesaApp.state || !MesaApp.state.isMaster) return;
    const item = this.items.find(it => it.id === itemId);
    if (!item) return;

    const newSlot = (slotValue === '' || slotValue === 'none' || slotValue === null || slotValue === undefined)
      ? null
      : parseInt(slotValue, 10);

    item.posse = newSlot;
    if (newSlot !== null) {
      item.desbloqueado = true;
    }

    this.saveAndSync();
    this.render();
    this.renderFicha();

    let targetName = 'Acervo Geral do Grupo';
    if (newSlot !== null) {
      targetName = this.getPlayerName(newSlot) || `Slot ${newSlot}`;
    }

    if (MesaChat && MesaChat.channel) {
      try {
        MesaChat.channel.send({
          type: 'broadcast',
          event: 'chat_message',
          payload: {
            id: 'msg_' + Date.now(),
            text: newSlot !== null
              ? `[ITEM ENTREGUE]: "${item.nome}" foi entregue a ${targetName}! O item já aparece na ficha do personagem.`
              : `[ITEM RECOLHIDO]: "${item.nome}" foi devolvido ao acervo geral pelo Mestre.`,
            sender: 'Mestre',
            role: 'mestre',
            timestamp: Date.now()
          }
        });
      } catch(e) {}
    }
  },

  openModal() {
    if (!MesaApp || !MesaApp.state || !MesaApp.state.isMaster) {
      alert('[ACESSO RESTRITO]: O Catálogo Geral de Coletáveis é exclusivo do Mestre. Os itens obtidos pelo seu personagem ficam disponíveis na sua ficha.');
      return;
    }
    this.init();
    this.searchQuery = '';
    const input = document.getElementById('coletaveis-search-input');
    if (input) input.value = '';
    
    const addBtn = document.getElementById('coletaveis-master-add-btn');
    const restoreBtn = document.getElementById('coletaveis-master-restore-btn');
    if (addBtn) addBtn.style.display = 'inline-flex';
    if (restoreBtn) restoreBtn.style.display = 'inline-flex';

    this.render();
    MesaApp.openModal('coletaveis-modal');
  },

  closeModal() {
    MesaApp.closeModal('coletaveis-modal');
  },

  openAddModal() {
    if (!MesaApp.state.isMaster) return;
    const idEl = document.getElementById('coletavel-form-id');
    const titleEl = document.getElementById('coletavel-form-title');
    const submitEl = document.getElementById('coletavel-form-submit-btn');
    const nomeEl = document.getElementById('coletavel-form-nome');
    const pesoEl = document.getElementById('coletavel-form-peso');
    const tipoEl = document.getElementById('coletavel-form-tipo');
    const areaEl = document.getElementById('coletavel-form-area');
    const campoTipoEl = document.getElementById('coletavel-form-campo-tipo');
    const statusEl = document.getElementById('coletavel-form-status');
    const posseEl = document.getElementById('coletavel-form-posse');
    const resumoEl = document.getElementById('coletavel-form-resumo');
    const detalheEl = document.getElementById('coletavel-form-detalhe');

    if (idEl) idEl.value = '';
    if (titleEl) titleEl.textContent = 'CADASTRAR NOVO COLETÁVEL';
    if (submitEl) submitEl.textContent = 'Cadastrar Item';
    if (nomeEl) nomeEl.value = '';
    if (pesoEl) pesoEl.value = 0;
    if (tipoEl) tipoEl.value = '';
    if (areaEl) areaEl.value = '';
    if (campoTipoEl) campoTipoEl.value = 'Detalhe';
    if (statusEl) statusEl.value = 'unlocked';
    if (posseEl) posseEl.value = '';
    const imgEl = document.getElementById('coletavel-form-imagem'); if (imgEl) imgEl.value = '';
    if (resumoEl) resumoEl.value = '';
    if (detalheEl) detalheEl.value = '';

    MesaApp.openModal('coletavel-form-modal');
  },

  openEditModal(id) {
    if (!MesaApp.state.isMaster) return;
    const item = this.items.find(it => it.id === id);
    if (!item) return;

    const idEl = document.getElementById('coletavel-form-id');
    const titleEl = document.getElementById('coletavel-form-title');
    const submitEl = document.getElementById('coletavel-form-submit-btn');
    const nomeEl = document.getElementById('coletavel-form-nome');
    const pesoEl = document.getElementById('coletavel-form-peso');
    const tipoEl = document.getElementById('coletavel-form-tipo');
    const areaEl = document.getElementById('coletavel-form-area');
    const campoTipoEl = document.getElementById('coletavel-form-campo-tipo');
    const statusEl = document.getElementById('coletavel-form-status');
    const posseEl = document.getElementById('coletavel-form-posse');
    const resumoEl = document.getElementById('coletavel-form-resumo');
    const detalheEl = document.getElementById('coletavel-form-detalhe');

    if (idEl) idEl.value = item.id;
    if (titleEl) titleEl.textContent = 'EDITAR COLETÁVEL';
    if (submitEl) submitEl.textContent = 'Salvar Alterações';
    if (nomeEl) nomeEl.value = item.nome || '';
    if (pesoEl) pesoEl.value = item.peso !== undefined ? item.peso : 0;
    if (tipoEl) tipoEl.value = item.tipo || '';
    if (areaEl) areaEl.value = item.area || '';
    if (campoTipoEl) campoTipoEl.value = item.campo_tipo || 'Detalhe';
    if (statusEl) statusEl.value = item.desbloqueado ? 'unlocked' : 'locked';
    if (posseEl) posseEl.value = item.posse !== null && item.posse !== undefined ? String(item.posse) : '';
    const imgEl = document.getElementById('coletavel-form-imagem'); if (imgEl) imgEl.value = item.imagem || '';
    if (resumoEl) resumoEl.value = item.resumo || '';
    if (detalheEl) detalheEl.value = item.detalhe || item.desc || '';

    MesaApp.openModal('coletavel-form-modal');
  },

  closeFormModal() {
    MesaApp.closeModal('coletavel-form-modal');
  },

  closeAddModal() {
    this.closeFormModal();
  },

  handleSave(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!MesaApp.state.isMaster) return;

    const id = (document.getElementById('coletavel-form-id')?.value || '').trim();
    const nome = (document.getElementById('coletavel-form-nome')?.value || '').trim();
    const peso = parseInt(document.getElementById('coletavel-form-peso')?.value, 10) || 0;
    const tipo = (document.getElementById('coletavel-form-tipo')?.value || '').trim() || 'Objeto / Pista';
    const area = (document.getElementById('coletavel-form-area')?.value || '').trim() || 'Área Desconhecida';
    const campo_tipo = (document.getElementById('coletavel-form-campo-tipo')?.value || '').trim() || 'Detalhe';
    const statusVal = document.getElementById('coletavel-form-status')?.value;
    const desbloqueado = (statusVal === 'unlocked');
    const posseVal = document.getElementById('coletavel-form-posse')?.value;
    const posse = (posseVal === '' || posseVal === null || posseVal === undefined) ? null : parseInt(posseVal, 10);
    const imagem = (document.getElementById('coletavel-form-imagem')?.value || '').trim();
    const resumo = (document.getElementById('coletavel-form-resumo')?.value || '').trim();
    const detalhe = (document.getElementById('coletavel-form-detalhe')?.value || '').trim() || 'Sem detalhes adicionais.';

    if (!nome) return;

    if (id) {
      const item = this.items.find(it => it.id === id);
      if (item) {
        item.nome = nome;
        item.peso = peso;
        item.tipo = tipo;
        item.area = area;
        item.campo_tipo = campo_tipo;
        item.desbloqueado = desbloqueado;
        item.posse = posse;
        if (imagem) item.imagem = imagem;
        item.resumo = resumo;
        item.detalhe = detalhe;
        item.desc = detalhe;
      }
      if (MesaChat && MesaChat.channel) {
        MesaChat.channel.send({
          type: 'broadcast',
          event: 'chat_message',
          payload: {
            id: 'msg_' + Date.now(),
            text: `[COLETÁVEL ATUALIZADO]: O Mestre editou as informações de "${nome}".`,
            sender: 'Mestre',
            role: 'mestre',
            timestamp: Date.now()
          }
        });
      }
    } else {
      const newItem = {
        id: 'col_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        nome,
        peso,
        tipo,
        area,
        campo_tipo,
        resumo,
        detalhe,
        desc: detalhe,
        desbloqueado,
        posse,
        imagem,
        dataCriacao: new Date().toLocaleDateString('pt-BR')
      };
      this.items.unshift(newItem);
      if (MesaChat && MesaChat.channel) {
        MesaChat.channel.send({
          type: 'broadcast',
          event: 'chat_message',
          payload: {
            id: 'msg_' + Date.now(),
            text: `[NOVO COLETÁVEL REGISTRADO]: ${nome} (${tipo}) foi catalogado pelo Mestre (${desbloqueado ? 'Liberado' : 'Bloqueado'}).`,
            sender: 'Mestre',
            role: 'mestre',
            timestamp: Date.now()
          }
        });
      }
    }

    this.saveAndSync();
    this.closeFormModal();
    this.render();
    this.renderFicha();
  },

  handleCreate(e) {
    this.handleSave(e);
  },

  toggleLock(id) {
    if (!MesaApp.state.isMaster) return;
    const item = this.items.find(it => it.id === id);
    if (!item) return;

    item.desbloqueado = !item.desbloqueado;
    this.saveAndSync();
    this.render();
    this.renderFicha();

    if (MesaChat && MesaChat.channel) {
      MesaChat.channel.send({
        type: 'broadcast',
        event: 'chat_message',
        payload: {
          id: 'msg_' + Date.now(),
          text: item.desbloqueado
            ? `[COLETÁVEL LIBERADO]: O Mestre liberou o item "${item.nome}"!`
            : `[COLETÁVEL TRANCADO]: O item "${item.nome}" foi trancado pelo Mestre.`,
          sender: 'Mestre',
          role: 'mestre',
          timestamp: Date.now()
        }
      });
    }
  },

  deleteItem(id) {
    if (!MesaApp.state.isMaster) return;
    if (!confirm('Deseja realmente remover este coletável do inventário?')) return;

    this.items = this.items.filter(it => it.id !== id);
    this.saveAndSync();
    this.render();
    this.renderFicha();
  },

  restoreDefaults() {
    if (!MesaApp.state.isMaster) return;
    if (!confirm('Deseja restaurar todos os 15 coletáveis canônicos da campanha?')) return;
    const canonical = window.CAMPAIGN_COLETAVEIS || window.MESA_COLETAVEIS || [];
    this.items = canonical.map(it => ({ ...it, desbloqueado: true, posse: it.posse || null }));
    this.saveAndSync();
    this.render();
    this.renderFicha();
  },

  saveAndSync() {
    localStorage.setItem('wu_coletaveis_v2', JSON.stringify(this.items));
    const chan = (MesaChat && MesaChat.channel) || (MesaApp && MesaApp.channel);
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'coletaveis_sync',
          payload: { items: this.items }
        });
      } catch(e) {}
    }

    // Persistência universal no banco de dados para garantir sincronização para todos
    if (MesaApp && MesaApp.supabase && MesaApp.state && MesaApp.state.isMaster) {
      (async () => {
        try {
          const { data } = await MesaApp.supabase
            .from('personagens')
            .select('atributos')
            .eq('id', 1)
            .single();
          const attrs = data && data.atributos 
            ? (typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos) 
            : {};
          attrs._sys_coletaveis = this.items;
          await MesaApp.supabase
            .from('personagens')
            .update({ atributos: attrs })
            .eq('id', 1);
        } catch(err) {
          console.error("Erro ao persistir coletáveis no Supabase:", err);
        }
      })();
    }
  },

  onSearch(val) {
    this.searchQuery = (val || '').trim().toLowerCase();
    this.render();
  },

  filterFicha(val) {
    this.fichaSearchQuery = (val || '').trim().toLowerCase();
    this.renderFicha();
  },

  renderFicha(targetPlayer) {
    const container = document.getElementById('ficha-coletaveis-container');
    if (!container) return;
    this.init();

    const isMaster = Boolean(MesaApp && MesaApp.state && MesaApp.state.isMaster);
    const activePlayer = targetPlayer || (MesaApp && MesaApp.state && MesaApp.state.activeViewingPlayer);
    if (!activePlayer) return;

    const playerSlot = activePlayer.slot;
    const playerName = activePlayer.nome || `Slot ${playerSlot}`;

    // Filtra estritamente os itens que estão na posse deste personagem
    const playerItems = this.items.filter(it => it.posse !== null && it.posse !== undefined && it.posse !== '' && String(it.posse) === String(playerSlot));

    if (playerItems.length === 0) {
      container.innerHTML = `
        <div class="coletaveis-empty-state" style="padding: 22px 14px; text-align: center; border: 1px dashed rgba(245, 158, 11, 0.25); border-radius: 4px; background: rgba(0,0,0,0.35);">
          <div class="coletaveis-empty-title" style="font-size: 0.9rem; color: #a3a3a3; font-family: var(--font-heading, 'Cinzel', serif);">[ NENHUM ITEM EM POSSE ]</div>
          <div class="coletaveis-empty-desc" style="font-size: 0.8rem; color: #737373; margin-top: 6px;">
            Nenhum item, pista ou documento da campanha está em posse de <strong>${playerName}</strong> no momento.
          </div>
          ${isMaster ? `
            <div style="margin-top: 12px;">
              <button type="button" class="mesa-btn ink-tag coletaveis-master-deliver-btn" onclick="MesaColetaveis.openModal()" style="font-size: 0.74rem; padding: 4px 10px; color: #fbbf24; border-color: rgba(245, 158, 11, 0.4); cursor: pointer;">
                Entregar Itens pelo Catálogo do Mestre &rarr;
              </button>
            </div>
          ` : ''}
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="coletaveis-cards-grid" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px;">
        ${playerItems.map(it => {
          const isBook = it.id === 'col_livro_viajante_terra' || (it.paginas && it.paginas.length > 0);
          const isDiario = it.id === 'col_diario_sara';
          const isCaixa = it.id === 'col_caixa_negra_dourada';
          const isNotebook = it.id === 'col_notebook_sara';
          const isClickable = isBook || isDiario || isCaixa || isNotebook;
          const clickAction = isBook ? `MesaLivroReader.open('col_livro_viajante_terra')` : (isDiario ? `MesaLivroReader.open('col_diario_sara')` : (isCaixa ? `MesaLivroReader.open('col_caixa_negra_dourada')` : (isNotebook ? `if(window.MesaNotebookSara) MesaNotebookSara.open()` : '')));
          const clickTitle = isBook ? 'Clique para folhear e ler este livro' : (isDiario ? 'Clique para abrir e ler a página do diário' : (isCaixa ? 'Clique para inspecionar a caixa selada' : (isNotebook ? 'Clique para acessar as câmeras de segurança' : '')));

          return `
            <div class="coletavel-card ${isClickable ? 'clickable-item' : ''}" style="padding: 12px 14px;" ${isClickable ? `onclick="${clickAction}" title="${clickTitle}"` : ''}>
              <div class="coletavel-card-header">
                <h4 class="coletavel-card-title" style="font-size: 0.95rem; color: #fbbf24;">${it.nome}</h4>
                <div class="coletavel-card-badges">
                  <span class="coletavel-card-badge">${it.tipo || 'Item'}</span>
                  <span class="coletavel-weight-badge">Peso ${it.peso !== undefined ? it.peso : 0}</span>
                </div>
              </div>
              ${it.area ? `
                <div class="coletavel-card-area" style="font-size: 0.72rem; margin-top: 4px;">
                  <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>${it.area}</span>
                </div>
              ` : ''}
              ${it.resumo ? `<div class="coletavel-card-resumo" style="font-size: 0.8rem; margin-top: 6px;">${it.resumo}</div>` : ''}
              ${(it.detalhe || it.desc) ? `
                <p class="coletavel-card-desc" style="font-size: 0.8rem; margin-top: 6px;">
                  <strong>${it.campo_tipo || (it.efeito ? 'Efeito' : 'Detalhe')}:</strong>
                  ${it.detalhe || it.desc}
                </p>
              ` : ''}
              ${it.imagem ? `
                <div class="coletavel-card-media" style="margin: 8px 0; border-radius: 4px; overflow: hidden; border: 1px solid rgba(245, 158, 11, 0.25); background: #08070b; text-align: center; max-height: 180px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                  <img src="${it.imagem}" alt="${it.nome}" style="max-height: 180px; width: 100%; object-fit: contain; display: block;" />
                </div>
              ` : ''}
              ${isBook ? `
                <button type="button" class="coletavel-read-book-btn" onclick="event.stopPropagation(); MesaLivroReader.open('col_livro_viajante_terra');">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                  <span>Abrir e Ler Livro (4 Páginas Ilustradas)</span>
                </button>
              ` : ''}
              ${isDiario ? `
                <button type="button" class="coletavel-read-book-btn" onclick="event.stopPropagation(); MesaLivroReader.open('col_diario_sara');">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                  <span>Abrir e Ler Diário (1 Página)</span>
                </button>
              ` : ''}
              ${isCaixa ? `
                <button type="button" class="coletavel-read-book-btn" onclick="event.stopPropagation(); MesaLivroReader.open('col_caixa_negra_dourada');" style="background: rgba(245, 158, 11, 0.16); border-color: #f59e0b; color: #fbbf24;">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                  <span>Inspecionar Caixa Negra e Dourada</span>
                </button>
              ` : ''}
              ${isNotebook ? `
                <button type="button" class="coletavel-read-book-btn" onclick="event.stopPropagation(); if(window.MesaNotebookSara) MesaNotebookSara.open();" style="background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.45); color: #38bdf8;">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                  <span>Acesso Rápido: Câmeras de Segurança</span>
                </button>
              ` : ''}
              ${isMaster ? `
                <div class="coletavel-card-footer" style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-top:8px; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 6px;">
                  <span style="font-size: 0.7rem; color: #a3a3a3;">Posse: Slot ${playerSlot}</span>
                  <button type="button" class="coletavel-delete-btn" onclick="event.stopPropagation(); MesaColetaveis.assignItem('${it.id}', '');" title="Desvincular item deste personagem" style="font-size: 0.72rem; padding: 2px 6px;">
                    Desvincular
                  </button>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  },

  render() {
    const container = document.getElementById('coletaveis-scroll-container');
    if (!container) return;

    const isMaster = Boolean(MesaApp && MesaApp.state && MesaApp.state.isMaster);
    const playerOptions = this.getPlayerOptions();

    if (!this.items || this.items.length === 0) {
      container.innerHTML = `
        <div class="coletaveis-empty-state">
          <svg class="coletaveis-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
            <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
            <line x1="12" y1="22.08" x2="12" y2="12"></line>
          </svg>
          <div class="coletaveis-empty-title">[ NENHUM COLETÁVEL ENCONTRADO ]</div>
          <div class="coletaveis-empty-desc">Nenhum item ou registro foi catalogado pelo grupo até o momento.</div>
        </div>
      `;
      return;
    }

    const filtered = this.items.filter(it => {
      if (!this.searchQuery) return true;
      const q = this.searchQuery;
      return (
        (it.nome && it.nome.toLowerCase().includes(q)) ||
        (it.tipo && it.tipo.toLowerCase().includes(q)) ||
        (it.area && it.area.toLowerCase().includes(q)) ||
        (it.resumo && it.resumo.toLowerCase().includes(q)) ||
        (it.detalhe && it.detalhe.toLowerCase().includes(q)) ||
        (it.desc && it.desc.toLowerCase().includes(q))
      );
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div class="coletaveis-empty-state">
          <div class="coletaveis-empty-title">[ NENHUM RESULTADO ]</div>
          <div class="coletaveis-empty-desc">Nenhum item corresponde ao termo pesquisado "${this.searchQuery}".</div>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="coletaveis-cards-grid">
        ${filtered.map(it => {
          const isBook = it.id === 'col_livro_viajante_terra' || (it.paginas && it.paginas.length > 0);
          const isDiario = it.id === 'col_diario_sara';
          const isCaixa = it.id === 'col_caixa_negra_dourada';
          const isNotebook = it.id === 'col_notebook_sara';
          const isClickable = isBook || isDiario || isCaixa || isNotebook;
          const clickAction = isBook ? `MesaLivroReader.open('col_livro_viajante_terra')` : (isDiario ? `MesaLivroReader.open('col_diario_sara')` : (isCaixa ? `MesaLivroReader.open('col_caixa_negra_dourada')` : (isNotebook ? `if(window.MesaNotebookSara) MesaNotebookSara.open()` : '')));
          const clickTitle = isBook ? 'Clique para folhear e ler este livro' : (isDiario ? 'Clique para abrir e ler a página do diário' : (isCaixa ? 'Clique para inspecionar a caixa selada' : (isNotebook ? 'Clique para acessar as câmeras de segurança' : '')));

          return `
            <div class="coletavel-card ${isMaster ? (it.desbloqueado ? 'master-unlocked' : 'master-locked') : ''} ${isClickable ? 'clickable-item' : ''}" ${isClickable ? `onclick="${clickAction}" title="${clickTitle}"` : ''}>
              <div class="coletavel-card-header">
                <h3 class="coletavel-card-title">${it.nome}</h3>
                <div class="coletavel-card-badges">
                  ${isMaster ? `<span class="coletavel-status-badge ${it.desbloqueado ? 'unlocked' : 'locked'}">${it.desbloqueado ? 'Liberado' : 'Bloqueado'}</span>` : ''}
                  <span class="coletavel-card-badge">${it.tipo || 'Pista'}</span>
                  <span class="coletavel-weight-badge">Peso ${it.peso !== undefined ? it.peso : 0}</span>
                </div>
              </div>
              ${it.area ? `
                <div class="coletavel-card-area">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  <span>${it.area}</span>
                </div>
              ` : ''}
              ${it.resumo ? `<div class="coletavel-card-resumo">${it.resumo}</div>` : ''}
              ${(it.detalhe || it.desc) ? `
                <p class="coletavel-card-desc">
                  <strong>${it.campo_tipo || (it.efeito ? 'Efeito' : 'Detalhe')}:</strong>
                  ${it.detalhe || it.desc}
                </p>
              ` : ''}
              ${it.imagem ? `
                <div class="coletavel-card-media" style="margin: 8px 0; border-radius: 4px; overflow: hidden; border: 1px solid rgba(245, 158, 11, 0.25); background: #08070b; text-align: center; max-height: 180px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
                  <img src="${it.imagem}" alt="${it.nome}" style="max-height: 180px; width: 100%; object-fit: contain; display: block;" />
                </div>
              ` : ''}
              ${isBook ? `
                <button type="button" class="coletavel-read-book-btn" onclick="event.stopPropagation(); MesaLivroReader.open('col_livro_viajante_terra');">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>
                  <span>Abrir e Ler Livro (4 Páginas Ilustradas)</span>
                </button>
              ` : ''}
              ${isDiario ? `
                <button type="button" class="coletavel-read-book-btn" onclick="event.stopPropagation(); MesaLivroReader.open('col_diario_sara');">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                  <span>Abrir e Ler Diário (1 Página)</span>
                </button>
              ` : ''}
              ${isCaixa ? `
                <button type="button" class="coletavel-read-book-btn" onclick="event.stopPropagation(); MesaLivroReader.open('col_caixa_negra_dourada');" style="background: rgba(245, 158, 11, 0.16); border-color: #f59e0b; color: #fbbf24;">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>
                  <span>Inspecionar Caixa Negra e Dourada</span>
                </button>
              ` : ''}
              ${isNotebook ? `
                <button type="button" class="coletavel-read-book-btn" onclick="event.stopPropagation(); if(window.MesaNotebookSara) MesaNotebookSara.open();" style="background: rgba(56, 189, 248, 0.12); border-color: rgba(56, 189, 248, 0.45); color: #38bdf8;">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>
                  <span>Acesso Rápido: Câmeras de Segurança</span>
                </button>
              ` : ''}
              ${isMaster ? `
                <div class="coletavel-assign-row" onclick="event.stopPropagation();">
                  <span class="coletavel-assign-label">Posse:</span>
                  <select class="coletavel-assign-select" onchange="MesaColetaveis.assignItem('${it.id}', this.value)">
                    <option value="" ${!it.posse ? 'selected' : ''}>-- Nenhum (Acervo Geral do Grupo) --</option>
                    ${playerOptions.map(opt => `
                      <option value="${opt.slot}" ${String(it.posse) === String(opt.slot) ? 'selected' : ''}>
                        Slot ${opt.slot}: ${opt.name}
                      </option>
                    `).join('')}
                  </select>
                </div>
                <div class="coletavel-card-footer" style="display:flex; justify-content:space-between; align-items:center; width:100%; margin-top:10px;">
                  <button type="button" class="coletavel-lock-btn ${it.desbloqueado ? 'lock-action' : 'unlock-action'}" onclick="event.stopPropagation(); MesaColetaveis.toggleLock('${it.id}')">
                    ${it.desbloqueado ? `
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="11"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                      Trancar Item
                    ` : `
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="11" width="16" height="11"></rect><path d="M7 11V7a5 5 0 0 1 9.9-1"></path></svg>
                      Liberar Item
                    `}
                  </button>
                  <div style="display:flex; gap:6px; align-items:center;">
                    <button type="button" class="coletavel-edit-btn" onclick="event.stopPropagation(); MesaColetaveis.openEditModal('${it.id}')" title="Editar Coletável">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                      Editar
                    </button>
                    <button type="button" class="coletavel-delete-btn" onclick="event.stopPropagation(); MesaColetaveis.deleteItem('${it.id}')" title="Excluir Coletável">
                      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      Excluir
                    </button>
                  </div>
                </div>
              ` : ''}
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
};


// ==========================================================================
// MESA LIVRO E DOCUMENTOS READER (O VIAJANTE E A TERRA / DIÁRIO / CAIXA)
// ==========================================================================
const MesaLivroReader = {
  currentDocId: 'col_livro_viajante_terra',
  currentPage: 1,
  totalPags: 4,
  mode: 'single', // 'single' ou 'all'
  pages: [
    {
      num: 1,
      ilustracaoDesc: 'Uma estrela cadente escura.',
      texto: 'Veio do céu que não tem fim um Viajante bondoso. Ele viajava pelo escuro do espaço procurando uma casa que precisasse de luz e de cuidado.'
    },
    {
      num: 2,
      ilustracaoDesc: 'Um ser brilhante descendo numa floresta triste.',
      texto: 'Ele desceu nas árvores de uma terra cansada. O povo de lá estava doente, fraco e com medo. O Viajante abriu os braços e disse: \'Não chorem mais. Eu trago o presente da energia infinita\'.'
    },
    {
      num: 3,
      ilustracaoDesc: 'O povo de mãos dadas com o Viajante.',
      texto: 'O povo ficou feliz e abriu as portas de suas casas para ele. O Viajante pediu que todos fechassem os olhos e lhe entregassem os seus sonhos, pois só ele poderia guardá-los de todo o mal.'
    },
    {
      num: 4,
      ilustracaoDesc: 'O Viajante cobrindo o planeta como um cobertor escuro.',
      texto: 'Eles entregaram. Então, o Viajante cresceu tanto que abraçou o mundo inteiro. E todos dormiram para sempre, bem quentinhos em seu abraço, em silêncio e em paz.'
    }
  ],

  open(itemId = 'col_livro_viajante_terra', page = 1) {
    this.currentDocId = itemId || 'col_livro_viajante_terra';
    this.currentPage = page;
    this.mode = 'single';
    this.render();
    MesaApp.openModal('livro-reader-modal');
  },

  close() {
    MesaApp.closeModal('livro-reader-modal');
  },

  nextPage() {
    if (this.currentDocId !== 'col_livro_viajante_terra') return;
    if (this.currentPage < this.totalPags) {
      this.currentPage++;
      this.render();
    }
  },

  prevPage() {
    if (this.currentDocId !== 'col_livro_viajante_terra') return;
    if (this.currentPage > 1) {
      this.currentPage--;
      this.render();
    }
  },

  goToPage(p) {
    if (this.currentDocId !== 'col_livro_viajante_terra') return;
    if (p >= 1 && p <= this.totalPags) {
      this.currentPage = p;
      this.mode = 'single';
      this.render();
    }
  },

  toggleMode() {
    if (this.currentDocId !== 'col_livro_viajante_terra') return;
    this.mode = this.mode === 'single' ? 'all' : 'single';
    this.render();
  },

  render() {
    const modal = document.getElementById('livro-reader-modal');
    if (!modal) return;
    const badge = document.getElementById('livro-reader-badge');
    const title = document.getElementById('livro-reader-title');
    const subtitle = document.getElementById('livro-reader-subtitle');
    const controls = document.getElementById('livro-reader-controls');
    const container = document.getElementById('livro-reader-body');
    const note = document.getElementById('livro-reader-note');

    // MODO 1: DIÁRIO DE SARA (1 PÁGINA)
    if (this.currentDocId === 'col_diario_sara') {
      if (badge) {
        badge.textContent = 'DOCUMENTO DA CAMPANHA • RESIDÊNCIA AUGUIL';
        badge.style.display = 'inline-block';
      }
      if (title) title.textContent = 'DIÁRIO DE SARA';
      if (subtitle) {
        subtitle.textContent = 'Página Única Encontrada na Escrivaninha';
        subtitle.style.display = 'block';
      }
      if (controls) controls.style.display = 'none';
      if (note) note.textContent = 'Caderno espiral encontrado na escrivaninha de Sara Auguil. As demais folhas foram arrancadas.';
      if (container) {
        container.innerHTML = `
          <div class="livro-single-doc-wrap" style="display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 6px 4px;">
            <div class="livro-doc-img-container" style="max-width: 100%; border-radius: 4px; overflow: hidden; border: 1px solid rgba(245, 158, 11, 0.4); box-shadow: 0 8px 32px rgba(0,0,0,0.85); background: #000; text-align: center;">
              <img src="assets/pagina_diario.png" alt="Página do Diário de Sara" style="max-height: 480px; width: 100%; object-fit: contain; display: block;" />
            </div>
            <div class="livro-page-text-box" style="width: 100%; max-width: 620px; text-align: center; border-color: rgba(245, 158, 11, 0.45); background: rgba(20, 16, 26, 0.88); padding: 16px 20px;">
              <span class="livro-quote-mark">&ldquo;</span>
              <p class="livro-page-text" style="font-size: 1.18rem; color: #fef08a; font-style: italic; letter-spacing: 0.5px; margin: 0; line-height: 1.5;">
                A porta precisa de carne para girar a chave.
              </p>
              <span class="livro-quote-mark right">&rdquo;</span>
            </div>
          </div>
        `;
      }
      return;
    }

    // MODO 2: CAIXA NEGRA E DOURADA (INSPEÇÃO DO ARTEFACTO)
    if (this.currentDocId === 'col_caixa_negra_dourada') {
      if (badge) {
        badge.textContent = 'ARTEFACTO DA CAMPANHA • RESIDÊNCIA AUGUIL';
        badge.style.display = 'inline-block';
      }
      if (title) title.textContent = 'CAIXA NEGRA E DOURADA';
      if (subtitle) {
        subtitle.textContent = 'Artefacto Selado • Inspeção Detalhada';
        subtitle.style.display = 'block';
      }
      if (controls) controls.style.display = 'none';
      if (note) note.textContent = 'Item encontrado soterrado na escrivaninha de Sara Auguil.';
      if (container) {
        container.innerHTML = `
          <div class="livro-single-doc-wrap" style="display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 6px 4px;">
            <div class="livro-doc-img-container" style="max-width: 100%; border-radius: 4px; overflow: hidden; border: 1px solid rgba(245, 158, 11, 0.45); box-shadow: 0 8px 32px rgba(0,0,0,0.9), 0 0 24px rgba(245, 158, 11, 0.2); background: radial-gradient(circle, rgba(245,158,11,0.1) 0%, rgba(8,7,12,0.98) 75%); text-align: center; padding: 14px;">
              <img src="assets/caixa.png" alt="Caixa Negra e Dourada" style="max-height: 380px; width: 100%; object-fit: contain; display: block;" />
            </div>
            <div class="livro-page-text-box" style="width: 100%; max-width: 620px; text-align: left; border-color: rgba(245, 158, 11, 0.4); background: rgba(20, 16, 26, 0.88); padding: 16px 20px;">
              <div style="font-size: 0.8rem; color: #fbbf24; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; font-family: monospace;">Descrição Sensorial:</div>
              <p style="font-size: 0.95rem; color: #f3f4f6; margin: 0 0 12px; line-height: 1.55;">
                Uma pequena caixa pesada de material desconhecido, negra como obsidiana e contornada por filetes de ouro puro que formam padrões geométricos.
              </p>
              <div style="font-size: 0.8rem; color: #f87171; font-weight: 700; text-transform: uppercase; margin-bottom: 6px; font-family: monospace;">Efeito / Investigação:</div>
              <p style="font-size: 0.92rem; color: #d1d5db; margin: 0; line-height: 1.55;">
                A caixa encontra-se completamente selada. Qualquer tentativa de impacto, uso de força bruta, lâminas ou ferramentas de arrombamento falha automaticamente, sem deixar um único arranhão na superfície.
              </p>
            </div>
          </div>
        `;
      }
      return;
    }

    // MODO 3: "O VIAJANTE DA TERRA" (4 PÁGINAS LIMPAS)
    if (badge) badge.style.display = 'none';
    if (title) title.textContent = 'O VIAJANTE DA TERRA';
    if (subtitle) subtitle.style.display = 'none';
    if (controls) controls.style.display = 'flex';
    if (note) note.textContent = 'Item encontrado soterrado na escrivaninha de Sara Auguil (Casa Auguil).';

    const indicator = document.getElementById('livro-page-indicator-text');
    const prevBtn = document.getElementById('livro-prev-btn');
    const nextBtn = document.getElementById('livro-next-btn');
    const modeBtn = document.getElementById('livro-mode-btn');

    if (indicator) {
      indicator.textContent = this.mode === 'single'
        ? `PÁGINA ${this.currentPage} DE ${this.totalPags}`
        : `TODAS AS PÁGINAS (1 A ${this.totalPags})`;
    }

    if (prevBtn) {
      prevBtn.style.display = this.mode === 'single' ? 'inline-flex' : 'none';
      prevBtn.disabled = this.currentPage <= 1;
      prevBtn.style.opacity = this.currentPage <= 1 ? '0.35' : '1';
    }

    if (nextBtn) {
      nextBtn.style.display = this.mode === 'single' ? 'inline-flex' : 'none';
      nextBtn.disabled = this.currentPage >= this.totalPags;
      nextBtn.style.opacity = this.currentPage >= this.totalPags ? '0.35' : '1';
    }

    if (modeBtn) {
      modeBtn.textContent = this.mode === 'single' ? 'Ver Todas as Páginas' : 'Ver Página por Página';
    }

    if (!container) return;

    if (this.mode === 'all') {
      container.innerHTML = `
        <div class="livro-all-pages-container">
          ${this.pages.map(p => this.renderPageCard(p)).join('')}
        </div>
      `;
    } else {
      const pageData = this.pages[this.currentPage - 1];
      container.innerHTML = `
        <div class="livro-single-page-wrap">
          ${this.renderPageCard(pageData)}
          <div class="livro-quick-dots-row">
            ${this.pages.map(p => `
              <button type="button" class="livro-dot-btn ${p.num === this.currentPage ? 'active' : ''}" onclick="MesaLivroReader.goToPage(${p.num})" title="Ir para Página ${p.num}">
                ${p.num}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }
  },

  renderPageCard(p) {
    return `
      <article class="livro-page-card" id="livro-page-${p.num}">
        <div class="livro-page-card-header">
          <span class="livro-page-num-pill">Página ${p.num} de ${this.totalPags}</span>
        </div>

        <div class="livro-illustration-frame clean">
          <span class="livro-illustration-label">Ilustração</span>
          <p class="livro-illustration-desc">${p.ilustracaoDesc}</p>
        </div>

        <div class="livro-page-text-box">
          <span class="livro-quote-mark">&ldquo;</span>
          <p class="livro-page-text">${p.texto}</p>
          <span class="livro-quote-mark right">&rdquo;</span>
        </div>
      </article>
    `;
  }
};
window.MesaLivroReader = MesaLivroReader;

// Suporte para teclas de seta do teclado ao ler o livro
document.addEventListener('keydown', (e) => {
  const modal = document.getElementById('livro-reader-modal');
  if (modal && modal.classList.contains('active')) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      MesaLivroReader.nextPage();
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      MesaLivroReader.prevPage();
    } else if (e.key === 'Escape') {
      MesaLivroReader.close();
    }
  }
});


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
      // Repara textos gravados enquanto o ficheiro estava com encoding corrompido
      const fixText = (s) => {
        if (typeof s !== 'string' || !/[\u00C2-\u00C3][\u0080-\u00BF]/.test(s)) return s;
        try {
          const bytes = Uint8Array.from([...s].map(c => c.charCodeAt(0) & 0xFF));
          return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
        } catch (err) { return s; }
      };
      let repaired = false;
      this.episodes.forEach(ep => {
        const t = fixText(ep.title), c = fixText(ep.content);
        if (t !== ep.title || c !== ep.content) { ep.title = t; ep.content = c; repaired = true; }
      });
      if (repaired) this.saveData();
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
    document.body.classList.add('roteiro-drawer-open');
    this.switchTab('edit');
  },

  closeModal() {
    document.body.classList.remove('roteiro-drawer-open');
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

// Fix for global visibility of modules
window.MesaApp = MesaApp;

window.MesaAreaManager = MesaAreaManager;
window.MesaChat = MesaChat;
window.MesaQuickMenu = MesaQuickMenu;
window.MesaMobileMenu = MesaMobileMenu;
window.MesaSecurity = MesaSecurity;
window.MesaColetaveis = MesaColetaveis;
  window.MesaSara = MesaSara;
window.MesaRoteiro = MesaRoteiro;
window.MesaReactions = MesaReactions;
window.MesaDice = MesaDice;



// --- MESA MEDIA PLAYER ---

const MesaMediaPlayer = {
  isMasterUnlocked: false,
  isDrawerOpen: false,
  activeTab: 'video',
  isTransmitting: false,
  isBlackout: false,
  transitionSpeed: '0.8s',
  videoPlaylist: [],
  currentVideoIndex: -1,
  isPlaying: false,
  volume: 1,
  isSeeking: false,
  pointA: 0,
  pointB: 0,
  isLoopActive: false,
  imagePlaylist: [],
  currentImageIndex: -1,

  init() {
    this.updateMasterVisibility();
    this.setupListeners();
    this.setupDropZones();
  },

  updateMasterVisibility() {
    const wrapper = document.getElementById('nav-master-dropdown-wrapper');
    if (wrapper) {
      if (MesaApp.state.isMaster) {
        wrapper.style.display = 'inline-flex';
        this.isMasterUnlocked = true;
      } else {
        wrapper.style.display = 'none';
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
    document.querySelectorAll('.adm-tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.adm-tab-content').forEach(view => view.classList.remove('active'));

    const tabBtn = document.getElementById(`adm-tab-${tab}`);
    const tabView = document.getElementById(`adm-view-${tab}`);
    if (tabBtn) tabBtn.classList.add('active');
    if (tabView) tabView.classList.add('active');

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
      if (btn) { btn.classList.add('transmitting'); btn.textContent = 'Transmitindo'; }
      if (statusTag) { statusTag.className = 'adm-status-tag live'; statusTag.textContent = '● Transmitindo'; }
      if (liveVideo) liveVideo.style.display = 'block';
      if (liveImage) liveImage.style.display = 'block';
    } else {
      if (btn) { btn.classList.remove('transmitting'); btn.textContent = 'Transmitir'; }
      if (statusTag) { statusTag.className = 'adm-status-tag inactive'; statusTag.textContent = '● Inativo'; }
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

  setupListeners() {
    const video = document.getElementById('adm-preview-video');
    const timeline = document.getElementById('adm-video-timeline');
    const timeDisplay = document.getElementById('adm-video-time');

    if (video) {
      video.addEventListener('timeupdate', () => {
        if (!this.isSeeking && video.duration > 0) {
          if (timeline) timeline.value = (video.currentTime / video.duration) * 100;
          if (timeDisplay) timeDisplay.textContent = `${this.formatTime(video.currentTime)} / ${this.formatTime(video.duration)}`;
        }

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
    let url = input.value.trim();
    if (!url) {
      alert("Por favor, cole um link valido de video ou audio.");
      return;
    }
    
    let name = url.split('/').pop().split('?')[0] || 'Video Online';
    
    // Format Google Drive links automatically
    const gDriveMatch1 = url.match(/drive\.google\.com\/.*?id=([a-zA-Z0-9_-]+)/);
    if (gDriveMatch1) {
      url = `https://drive.usercontent.google.com/download?id=${gDriveMatch1[1]}`;
      name = 'Google Drive Video';
    } else if (url.includes('drive.google.com/file/d/')) {
      const id = url.split('file/d/')[1].split('/')[0];
      url = `https://drive.usercontent.google.com/download?id=${id}`;
      name = 'Google Drive Video';
    }
    this.videoPlaylist.push({ name: name, url: url });
    input.value = '';
    this.renderVideoPlaylist();
    this.selectVideo(this.videoPlaylist.length - 1);
  },

  addVideos(files) {
    alert("ATENCAO: Arquivos de video adicionados pelo botao 'Arquivo Local' tocam apenas localmente no seu navegador para preview.\n\nPara transmitir a todos na mesa sem usar Supabase, coloque o arquivo na pasta 'assets/videos/' do site (GitHub) e insira o caminho relativo (ex: assets/videos/exemplo.mp4) ou link web no campo de Link!");
    Array.from(files).forEach(file => {
      const localBlob = URL.createObjectURL(file);
      const playlistItem = {
        name: file.name,
        url: localBlob,
        file: file
      };
      this.videoPlaylist.push(playlistItem);
      this.renderVideoPlaylist();
      if (this.currentVideoIndex === -1) {
        this.selectVideo(this.videoPlaylist.length - 1);
      }
    });
  },

  renderVideoPlaylist() {
    const list = document.getElementById('adm-video-playlist-list');
    if (!list) return;
    if (this.videoPlaylist.length === 0) {
      list.innerHTML = `<div class="adm-empty-note">Nenhum video na playlist.</div>`;
      return;
    }
    list.innerHTML = this.videoPlaylist.map((item, idx) => `
      <div class="adm-playlist-item ${idx === this.currentVideoIndex ? 'active' : ''}" onclick="MesaMediaPlayer.selectVideo(${idx})">
        <span class="adm-item-name" title="${item.name}">${idx + 1}. ${item.name}</span>
        <button class="adm-item-remove" onclick="event.stopPropagation(); MesaMediaPlayer.removeVideo(${idx})">&times;</button>
      </div>
    `).join('');
  },

  removeVideo(idx) {
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
    if (video) video.currentTime = this.pointA || 0;
    if (this.isTransmitting) this.syncLiveDisplay();
  },

  handleSeekInput() { this.isSeeking = true; },
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

  toggleLoopCheckbox(checked) { this.isLoopActive = checked; },
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

  handleImageAdd(e) {
    const files = Array.from(e.target.files);
    if (files.length > 0) this.addImages(files);
  },

  addImageFromInput() {
    const input = document.getElementById('adm-image-url-input');
    if (!input) return;
    let url = input.value.trim();
    if (!url) return;
    
    let name = url.split('/').pop().split('?')[0] || 'Imagem Online';

    // Format Google Drive links automatically
    const gDriveMatch1 = url.match(/drive\.google\.com\/.*?id=([a-zA-Z0-9_-]+)/);
    if (gDriveMatch1) {
      url = `https://drive.usercontent.google.com/download?id=${gDriveMatch1[1]}`;
      name = 'Google Drive Imagem';
    } else if (url.includes('drive.google.com/file/d/')) {
      const id = url.split('file/d/')[1].split('/')[0];
      url = `https://drive.usercontent.google.com/download?id=${id}`;
      name = 'Google Drive Imagem';
    }
    this.imagePlaylist.push({ name: name, url: url });
    input.value = '';
    this.renderImagePlaylist();
    this.selectImage(this.imagePlaylist.length - 1);
  },

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
          resolve(canvas.toDataURL('image/jpeg', quality));
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
      this.imagePlaylist.push({ name: file.name, url: dataUrl, file: file });
      this.renderImagePlaylist();
      if (this.currentImageIndex === -1) this.selectImage(0);
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
    if (counter) counter.textContent = `${this.currentImageIndex + 1}/${this.imagePlaylist.length}`;
    list.innerHTML = this.imagePlaylist.map((item, idx) => `
      <div class="adm-playlist-item ${idx === this.currentImageIndex ? 'active' : ''}" onclick="MesaMediaPlayer.selectImage(${idx})">
        <span class="adm-item-name" title="${item.name}">${idx + 1}. ${item.name}</span>
        <button class="adm-item-remove" onclick="event.stopPropagation(); MesaMediaPlayer.removeImage(${idx})">&times;</button>
      </div>
    `).join('');
  },

  removeImage(idx) {
    this.imagePlaylist.splice(idx, 1);
    if (this.currentImageIndex >= this.imagePlaylist.length) this.currentImageIndex = this.imagePlaylist.length - 1;
    this.renderImagePlaylist();
    if (this.currentImageIndex >= 0) this.selectImage(this.currentImageIndex);
    else {
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
        payload.mediaType = 'video';
        payload.currentTime = previewVideo ? previewVideo.currentTime : 0;
        payload.isPlaying = this.isPlaying;
        payload.volume = this.volume;
        payload.url = item && item.url && !item.url.startsWith('blob:') ? item.url : null;
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
        if (theaterImage) { theaterImage.src = item.url; theaterImage.style.display = 'block'; }
      }
    } else {
      if (overlay) overlay.classList.remove('active');
      if (theaterVideo) { theaterVideo.pause(); theaterVideo.src = ''; }
      if (theaterImage) { theaterImage.src = ''; }
    }

    if (MesaApp.state.isMaster && MesaChat.channel) {
      MesaChat.channel.send({
        type: 'broadcast',
        event: 'media_sync',
        payload: payload
      });
    }
  },

  handleIncomingSync(data) {
    if (MesaApp.state.isMaster) return;
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
      if (data.url && !data.url.startsWith('blob:')) {
        if (statusNote) statusNote.style.display = 'none';
        if (theaterVideo) {
          theaterVideo.style.display = 'block';
          if (theaterVideo.src !== data.url) { theaterVideo.src = data.url; theaterVideo.load(); }
          if (Math.abs(theaterVideo.currentTime - data.currentTime) > 1.5) theaterVideo.currentTime = data.currentTime;
          theaterVideo.volume = data.volume !== undefined ? data.volume : 1;
          if (data.isPlaying) theaterVideo.play().catch(() => { theaterVideo.muted = true; theaterVideo.play(); });
          else theaterVideo.pause();
        }
      }
    } else if (data.mediaType === 'image') {
      if (theaterVideo) { theaterVideo.style.display = 'none'; theaterVideo.pause(); }
      if (data.url) {
        if (statusNote) statusNote.style.display = 'none';
        if (theaterImage) { theaterImage.src = data.url; theaterImage.style.display = 'block'; }
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



window.MesaMediaPlayer = MesaMediaPlayer;


// --- MESA ABERTURA ---
const MesaAbertura = {
  play() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    
    const now = Date.now();

    // 1. Broadcast para todos os jogadores
    const chan = (MesaChat && MesaChat.channel) || (MesaApp && MesaApp.channel);
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'play_abertura',
          payload: { timestamp: now }
        });
      } catch(e) {}
    }

    // 2. Persistência no banco Supabase
    if (MesaApp.supabase) {
      (async () => {
        try {
          const { data } = await MesaApp.supabase
            .from('personagens')
            .select('atributos')
            .eq('id', 1)
            .single();
          const attrs = data && data.atributos 
            ? (typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos) 
            : {};
          attrs._sys_abertura = { active: true, timestamp: now };
          await MesaApp.supabase
            .from('personagens')
            .update({ atributos: attrs })
            .eq('id', 1);
        } catch(e) {}
      })();
    }
    
    // Toca para o Mestre
    this.triggerAbertura(0);
  },

  stop() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    const chan = (MesaChat && MesaChat.channel) || (MesaApp && MesaApp.channel);
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'stop_abertura',
          payload: {}
        });
      } catch(e) {}
    }

    if (MesaApp.supabase) {
      (async () => {
        try {
          const { data } = await MesaApp.supabase
            .from('personagens')
            .select('atributos')
            .eq('id', 1)
            .single();
          const attrs = data && data.atributos 
            ? (typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos) 
            : {};
          attrs._sys_abertura = { active: false, timestamp: Date.now() };
          await MesaApp.supabase
            .from('personagens')
            .update({ atributos: attrs })
            .eq('id', 1);
        } catch(e) {}
      })();
    }

    this.triggerStop();
  },

  triggerStop() {
    document.body.classList.remove('abertura-active');
    const overlay = document.getElementById('abertura-overlay');
    const video = document.getElementById('abertura-video');
    if (overlay && video) {
      overlay.classList.remove('active');
      setTimeout(() => {
        video.pause();
        video.currentTime = 0;
      }, 1200);
    }
  },

  triggerAbertura(startTime = 0) {
    document.body.classList.add('abertura-active');
    const overlay = document.getElementById('abertura-overlay');
    const video = document.getElementById('abertura-video');
    
    if (overlay && video) {
      video.muted = false;
      if (typeof startTime === 'number' && startTime > 0 && startTime < 46) {
        try { video.currentTime = startTime; } catch(e) {}
      } else {
        try { video.currentTime = 0; } catch(e) {}
      }
      overlay.classList.add('active');
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(e => {
          console.warn("Autoplay com áudio bloqueado pelo navegador. Tentando com mudo...", e);
          video.muted = true;
          video.play().catch(err2 => console.error("Abertura video bloqueado:", err2));
        });
      }

      video.onended = () => {
        document.body.classList.remove('abertura-active');
        overlay.classList.remove('active');
        setTimeout(() => {
          video.pause();
          video.currentTime = 0;
        }, 1200);
      };
    }
  }
};
window.MesaAbertura = MesaAbertura;



// ==========================================================================
// MESA DISPOSITIVOS DA CAMPANHA (HUB DO MESTRE)
// ==========================================================================
const MesaDispositivos = {
  isOpen: false,

  toggleDrawer() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      document.body.classList.add('dispositivos-drawer-open');
    } else {
      document.body.classList.remove('dispositivos-drawer-open');
    }
  },

  closeDrawer() {
    this.isOpen = false;
    document.body.classList.remove('dispositivos-drawer-open');
  }
};
window.MesaDispositivos = MesaDispositivos;


// ==========================================================================
// ==========================================================================
// MESA NOTEBOOK DA SARA (SISTEMA OPERACIONAL E CFTV)
// ==========================================================================
const MesaNotebookSara = {
  isActive: false,
  stage: 'boot', // 'boot' | 'lock' | 'cctv'
  activeCam: 1,
  signalLost: false,
  isGlitching: false,
  sessionStartTime: null,
  camImages: {
    1: '',
    2: '',
    3: ''
  },
  bootTimeout: null,
  glitchTimeout: null,
  staticAnimId: null,
  clockInterval: null,

  getChannel() {
    return (window.MesaApp && MesaApp.channel) || (window.MesaChat && MesaChat.channel) || null;
  },

  async saveNotebookStateToSupabase() {
    if (!window.MesaApp || !MesaApp.supabase || !MesaApp.state || !MesaApp.state.isMaster) return;
    try {
      const { data } = await MesaApp.supabase
        .from('personagens')
        .select('atributos')
        .eq('id', 1)
        .single();
      const attrs = data && data.atributos 
        ? (typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos) 
        : {};
      attrs._sys_notebook = {
        active: !!this.isActive,
        stage: this.stage || 'boot',
        activeCam: this.activeCam || 1,
        signalLost: !!this.signalLost,
        sessionStartTime: this.sessionStartTime || Date.now(),
        camImages: this.camImages || {},
        updatedAt: Date.now()
      };
      await MesaApp.supabase
        .from('personagens')
        .update({ atributos: attrs })
        .eq('id', 1);
    } catch(e) {
      console.warn("Erro ao persistir notebook no Supabase:", e);
    }
  },

  play() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    this.isActive = true;
    this.stage = 'boot';
    this.signalLost = false;
    this.isGlitching = false;
    this.sessionStartTime = Date.now();

    // Broadcast para todos os jogadores
    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'notebook_start',
          payload: {
            activeCam: this.activeCam,
            camImages: this.camImages,
            sessionStartTime: this.sessionStartTime
          }
        });
      } catch(e) {}
    }

    this.saveNotebookStateToSupabase();
    this.triggerStart(this.sessionStartTime);
  },

  stop() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'notebook_stop',
          payload: {}
        });
      } catch(e) {}
    }
    this.isActive = false;
    this.saveNotebookStateToSupabase();
    this.triggerStop();
  },

  triggerStart(sessionStartTime) {
    const overlay = document.getElementById('notebook-sara-overlay');
    if (!overlay) return;

    this.isActive = true;
    this.stage = 'boot';
    this.signalLost = false;
    this.isGlitching = false;
    this.sessionStartTime = sessionStartTime || this.sessionStartTime || Date.now();

    const isMaster = !!(MesaApp.state && MesaApp.state.isMaster);
    overlay.classList.toggle('viewer-only', !isMaster);

    // Atualiza status no drawer do Mestre
    const badge = document.getElementById('notebook-status-badge');
    const btnPlay = document.getElementById('btn-transmit-notebook');
    const btnStop = document.getElementById('btn-stop-notebook');
    if (badge) {
      badge.textContent = 'Transmitindo';
      badge.className = 'dispositivo-status-badge transmitting';
    }
    if (btnPlay) btnPlay.style.display = 'none';
    if (btnStop) btnStop.style.display = 'flex';

    // Mostra estágio de boot
    const bootStage = document.getElementById('notebook-boot-stage');
    const lockStage = document.getElementById('notebook-lock-stage');
    const cctvStage = document.getElementById('notebook-cctv-stage');
    if (bootStage) bootStage.style.display = 'flex';
    if (lockStage) lockStage.style.display = 'none';
    if (cctvStage) cctvStage.style.display = 'none';

    overlay.classList.add('active');

    this.startClock();

    // Transiciona do boot para o lock screen após ~2.4s
    clearTimeout(this.bootTimeout);
    this.bootTimeout = setTimeout(() => {
      this.showLockScreen();
    }, 2400);
  },

  triggerStop() {
    const overlay = document.getElementById('notebook-sara-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      overlay.classList.remove('viewer-only');
    }

    this.stopStaticNoise();
    clearTimeout(this.bootTimeout);
    clearTimeout(this.glitchTimeout);
    clearInterval(this.clockInterval);
    this.sessionStartTime = null;

    // Atualiza status no drawer do Mestre
    const badge = document.getElementById('notebook-status-badge');
    const btnPlay = document.getElementById('btn-transmit-notebook');
    const btnStop = document.getElementById('btn-stop-notebook');
    if (badge) {
      badge.textContent = 'Pronto';
      badge.className = 'dispositivo-status-badge ready';
    }
    if (btnPlay) btnPlay.style.display = 'flex';
    if (btnStop) btnStop.style.display = 'none';

    setTimeout(() => {
      this.isActive = false;
      this.stage = 'boot';
      this.signalLost = false;
      this.isGlitching = false;
      const bootStage = document.getElementById('notebook-boot-stage');
      const lockStage = document.getElementById('notebook-lock-stage');
      const cctvStage = document.getElementById('notebook-cctv-stage');
      if (bootStage) bootStage.style.display = 'flex';
      if (lockStage) lockStage.style.display = 'none';
      if (cctvStage) cctvStage.style.display = 'none';
      const staticCanvas = document.getElementById('cctv-static-canvas');
      if (staticCanvas) staticCanvas.style.display = 'none';
      const signalLostEl = document.getElementById('cctv-signal-lost');
      if (signalLostEl) signalLostEl.style.display = 'none';
    }, 1200);
  },

  startClock() {
    clearInterval(this.clockInterval);
    if (!this.sessionStartTime) {
      this.sessionStartTime = Date.now();
    }
    const update = () => {
      const elapsedMs = Date.now() - this.sessionStartTime;
      const elapsedSec = Math.floor(elapsedMs / 1000);

      // Inicia a partir das 22:30:00 da noite
      const baseSec = (22 * 60 + 30) * 60; // 81000 segundos
      const currentSecTotal = baseSec + elapsedSec;

      const hrs = String(Math.floor(currentSecTotal / 3600) % 24).padStart(2, '0');
      const mins = String(Math.floor((currentSecTotal % 3600) / 60)).padStart(2, '0');
      const secs = String(currentSecTotal % 60).padStart(2, '0');
      const ms = String(Math.floor((elapsedMs % 1000) / 10)).padStart(2, '0');

      const timeEl = document.getElementById('windows-lock-time');
      if (timeEl) timeEl.textContent = `${hrs}:${mins}`;

      const dateEl = document.getElementById('windows-lock-date');
      if (dateEl) dateEl.textContent = 'terça-feira, 4 de agosto de 2061';

      const cctvTime = document.getElementById('cctv-timestamp');
      if (cctvTime) {
        cctvTime.textContent = `04/08/2061 ${hrs}:${mins}:${secs}`;
      }

      const hudTime = document.getElementById('cctv-hud-time');
      if (hudTime) {
        hudTime.textContent = `${hrs}:${mins}:${secs}.${ms}`;
      }
    };
    update();
    this.clockInterval = setInterval(update, 50);
  },

  showLockScreen() {
    this.stage = 'lock';
    const bootStage = document.getElementById('notebook-boot-stage');
    const lockStage = document.getElementById('notebook-lock-stage');
    const cctvStage = document.getElementById('notebook-cctv-stage');
    if (bootStage) bootStage.style.display = 'none';
    if (lockStage) lockStage.style.display = 'flex';
    if (cctvStage) cctvStage.style.display = 'none';

    const isMaster = !!(MesaApp.state && MesaApp.state.isMaster);
    const wrapper = document.getElementById('windows-input-wrapper');
    const input = document.getElementById('notebook-password-input');
    const err = document.getElementById('notebook-password-error');

    if (wrapper) wrapper.classList.remove('has-error', 'shake-error');
    if (err) err.style.display = 'none';

    if (input) {
      input.value = '';
      if (!isMaster) {
        input.readOnly = true;
        input.tabIndex = -1;
      } else {
        input.readOnly = false;
        input.removeAttribute('tabindex');
        if (!input.dataset.boundInput) {
          input.dataset.boundInput = '1';
          input.addEventListener('input', () => {
            if (wrapper) wrapper.classList.remove('has-error', 'shake-error');
            if (err) err.style.display = 'none';
          });
        }
        setTimeout(() => input.focus(), 100);
      }
    }
  },

  submitPassword(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    const wrapper = document.getElementById('windows-input-wrapper');
    const err = document.getElementById('notebook-password-error');
    const input = document.getElementById('notebook-password-input');

    if (wrapper) {
      wrapper.classList.add('has-error');
    }
    if (err) {
      err.textContent = 'Senha incorreta';
      err.style.display = 'block';
    }
    if (input) {
      input.value = '';
      input.focus();
    }
  },

  showCctvStage(camNum = 1) {
    this.stage = 'cctv';
    const bootStage = document.getElementById('notebook-boot-stage');
    const lockStage = document.getElementById('notebook-lock-stage');
    const cctvStage = document.getElementById('notebook-cctv-stage');
    if (bootStage) bootStage.style.display = 'none';
    if (lockStage) lockStage.style.display = 'none';
    if (cctvStage) cctvStage.style.display = 'flex';
    this.switchCamera(camNum, false);
  },

  openCameras() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    this.showCctvStage(this.activeCam || 1);

    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'notebook_sync',
          payload: {
            stage: 'cctv',
            activeCam: this.activeCam,
            signalLost: this.signalLost
          }
        });
      } catch(e) {}
    }
    this.saveNotebookStateToSupabase();
  },

  returnToLock() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    this.showLockScreen();
    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'notebook_sync',
          payload: {
            stage: 'lock'
          }
        });
      } catch(e) {}
    }
    this.saveNotebookStateToSupabase();
  },

  switchCamera(camNum, shouldSync = true) {
    if (shouldSync && (!MesaApp.state || !MesaApp.state.isMaster)) return;
    if (this.signalLost && shouldSync) return;
    this.activeCam = camNum;

    // Atualiza tabs do CFTV
    [1, 2, 3].forEach(n => {
      const tab = document.getElementById(`cctv-tab-${n}`);
      if (tab) {
        if (n === camNum) tab.classList.add('active');
        else tab.classList.remove('active');
      }
      const ctrlBtn = document.getElementById(`disp-ctrl-cam-${n}`);
      if (ctrlBtn) {
        if (n === camNum) ctrlBtn.classList.add('active');
        else ctrlBtn.classList.remove('active');
      }
    });

    const camNames = {
      1: 'CAM 01 - SALA DE ESTAR',
      2: 'CAM 02 - ESCADARIA',
      3: 'CAM 03 - CORREDOR DO 2º ANDAR'
    };

    const camTag = document.getElementById('cctv-cam-tag');
    if (camTag) camTag.textContent = camNames[camNum] || `CAM 0${camNum}`;

    const hudChan = document.getElementById('cctv-hud-channel');
    if (hudChan) {
      const shortNames = { 1: 'CH-01 [SALA]', 2: 'CH-02 [ESCADA]', 3: 'CH-03 [CORREDOR]' };
      hudChan.textContent = `${shortNames[camNum]} • 15.0 FPS NV`;
    }

    this.renderCameraFeed();

    if (shouldSync) {
      const chan = this.getChannel();
      if (chan) {
        try {
          chan.send({
            type: 'broadcast',
            event: 'notebook_sync',
            payload: {
              stage: 'cctv',
              activeCam: this.activeCam,
              signalLost: this.signalLost
            }
          });
        } catch(e) {}
      }
      this.saveNotebookStateToSupabase();
    }
  },

  setCamera(camNum) {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    if (!this.isActive) this.play();
    setTimeout(() => {
      this.openCameras();
      this.switchCamera(camNum);
    }, 400);
  },

  renderCameraFeed() {
    const imgEl = document.getElementById('cctv-feed-img');
    const procEl = document.getElementById('cctv-feed-procedural');
    const svgEl = document.getElementById('cctv-procedural-svg');

    // Todas as câmeras exibem tela preta
    if (imgEl) imgEl.style.display = 'none';
    if (procEl) procEl.style.display = 'none';
    if (svgEl) svgEl.innerHTML = '';
  },

  getProceduralSceneSVG(camNum) {
    if (camNum === 1) {
      return `
        <rect width="800" height="450" fill="#040507" />
        <polygon points="0,320 800,320 800,450 0,450" fill="#0a0c10" />
        <line x1="0" y1="320" x2="800" y2="320" stroke="#1f242d" stroke-width="2" />
        <rect x="520" y="60" width="160" height="200" fill="#0e131b" stroke="#252f3e" stroke-width="2" />
        <line x1="520" y1="90" x2="680" y2="90" stroke="#171e28" stroke-width="1.5" />
        <line x1="520" y1="120" x2="680" y2="120" stroke="#171e28" stroke-width="1.5" />
        <line x1="520" y1="150" x2="680" y2="150" stroke="#171e28" stroke-width="1.5" />
        <line x1="520" y1="180" x2="680" y2="180" stroke="#171e28" stroke-width="1.5" />
        <line x1="520" y1="210" x2="680" y2="210" stroke="#171e28" stroke-width="1.5" />
        <line x1="520" y1="240" x2="680" y2="240" stroke="#171e28" stroke-width="1.5" />
        <rect x="120" y="260" width="280" height="80" rx="4" fill="#0e1117" stroke="#1c212a" stroke-width="2" />
        <rect x="100" y="280" width="35" height="60" rx="3" fill="#0b0e13" stroke="#1a1e26" stroke-width="1.5" />
        <rect x="385" y="280" width="35" height="60" rx="3" fill="#0b0e13" stroke="#1a1e26" stroke-width="1.5" />
        <rect x="145" y="240" width="110" height="40" rx="2" fill="#12161f" />
        <rect x="265" y="240" width="110" height="40" rx="2" fill="#12161f" />
        <rect x="180" y="360" width="160" height="45" fill="#0c0e13" stroke="#222834" stroke-width="1.5" />
        <rect x="250" y="345" width="14" height="18" fill="#1e293b" />
        <text x="30" y="420" fill="#64748b" font-family="monospace" font-size="14" letter-spacing="2">CAM 01 // RESIDÊNCIA AUGUIL - SALA DE ESTAR [TÉRREO]</text>
      `;
    } else if (camNum === 2) {
      return `
        <rect width="800" height="450" fill="#030406" />
        <polygon points="120,450 680,450 640,400 160,400" fill="#0c0f14" stroke="#1c212b" stroke-width="1.5" />
        <polygon points="160,400 640,400 600,350 200,350" fill="#0a0c10" stroke="#1c212b" stroke-width="1.5" />
        <polygon points="200,350 600,350 560,300 240,300" fill="#080a0e" stroke="#1a1e26" stroke-width="1.5" />
        <polygon points="240,300 560,300 520,250 280,250" fill="#07080c" stroke="#171b23" stroke-width="1.5" />
        <polygon points="280,250 520,250 480,200 320,200" fill="#050609" stroke="#14171e" stroke-width="1.5" />
        <polygon points="320,200 480,200 450,150 350,150" fill="#040507" stroke="#11141a" stroke-width="1.5" />
        <polygon points="350,150 450,150 420,100 380,100" fill="#020304" />
        <line x1="120" y1="410" x2="380" y2="70" stroke="#252e3d" stroke-width="6" />
        <line x1="180" y1="430" x2="180" y2="350" stroke="#18202b" stroke-width="3" />
        <line x1="240" y1="380" x2="240" y2="300" stroke="#18202b" stroke-width="3" />
        <line x1="300" y1="330" x2="300" y2="250" stroke="#18202b" stroke-width="3" />
        <line x1="360" y1="280" x2="360" y2="200" stroke="#18202b" stroke-width="3" />
        <text x="30" y="420" fill="#64748b" font-family="monospace" font-size="14" letter-spacing="2">CAM 02 // RESIDÊNCIA AUGUIL - ESCADARIA PRINCIPAL</text>
      `;
    } else {
      return `
        <rect width="800" height="450" fill="#030405" />
        <polygon points="0,450 800,450 460,225 340,225" fill="#0b0d12" stroke="#191e27" stroke-width="1" />
        <polygon points="0,0 800,0 460,225 340,225" fill="#06070a" stroke="#161a22" stroke-width="1" />
        <polygon points="0,0 0,450 340,225" fill="#080a0e" stroke="#141820" stroke-width="1" />
        <polygon points="800,0 800,450 460,225" fill="#080a0e" stroke="#141820" stroke-width="1" />
        <rect x="340" y="210" width="120" height="60" fill="#000000" />
        <polygon points="80,120 180,165 180,360 80,410" fill="#050608" stroke="#1e2531" stroke-width="2" />
        <polygon points="220,180 280,205 280,300 220,325" fill="#020305" stroke="#ef4444" stroke-width="1" stroke-dasharray="3,3" />
        <polygon points="720,120 620,165 620,360 720,410" fill="#050608" stroke="#1e2531" stroke-width="2" />
        <circle cx="400" cy="110" r="12" fill="#1e293b" />
        <line x1="400" y1="0" x2="400" y2="100" stroke="#0f172a" stroke-width="2" />
        <text x="30" y="420" fill="#64748b" font-family="monospace" font-size="14" letter-spacing="2">CAM 03 // RESIDÊNCIA AUGUIL - CORREDOR DO 2º ANDAR [ÁREA DOS QUARTOS]</text>
      `;
    }
  },

  setCustomCamImage(camNum, url) {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    this.camImages[camNum] = url || '';
    if (this.activeCam === camNum) {
      this.renderCameraFeed();
    }
    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'notebook_sync',
          payload: {
            camImages: this.camImages
          }
        });
      } catch(e) {}
    }
    this.saveNotebookStateToSupabase();
  },

  triggerGlitch() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    this.isGlitching = true;
    this.startStaticNoise();

    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'notebook_sync',
          payload: {
            glitch: true
          }
        });
      } catch(e) {}
    }

    clearTimeout(this.glitchTimeout);
    this.glitchTimeout = setTimeout(() => {
      this.stopStaticNoise();
      this.signalLost = true;
      this.isGlitching = false;

      const lostEl = document.getElementById('cctv-signal-lost');
      if (lostEl) {
        lostEl.style.display = 'flex';
        const camNames = {
          1: 'CAM 01 - SALA DE ESTAR',
          2: 'CAM 02 - ESCADARIA',
          3: 'CAM 03 - CORREDOR DO 2º ANDAR'
        };
        const lostCamTag = document.getElementById('signal-lost-cam-name');
        if (lostCamTag) lostCamTag.textContent = camNames[this.activeCam] || `CAM 0${this.activeCam}`;
      }

      [1, 2, 3].forEach(n => {
        const btn = document.getElementById(`cctv-tab-${n}`);
        if (btn) btn.classList.add('disabled');
      });

      const ch = this.getChannel();
      if (ch) {
        try {
          ch.send({
            type: 'broadcast',
            event: 'notebook_sync',
            payload: {
              signalLost: true
            }
          });
        } catch(e) {}
      }
      this.saveNotebookStateToSupabase();
    }, 2500);
  },

  restoreSignal() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    this.signalLost = false;
    this.isGlitching = false;
    this.stopStaticNoise();

    const lostEl = document.getElementById('cctv-signal-lost');
    if (lostEl) lostEl.style.display = 'none';

    [1, 2, 3].forEach(n => {
      const btn = document.getElementById(`cctv-tab-${n}`);
      if (btn) btn.classList.remove('disabled');
    });

    this.switchCamera(this.activeCam, false);

    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'notebook_sync',
          payload: {
            signalLost: false,
            activeCam: this.activeCam
          }
        });
      } catch(e) {}
    }
    this.saveNotebookStateToSupabase();
  },

  startStaticNoise() {
    const canvas = document.getElementById('cctv-static-canvas');
    if (!canvas) return;
    canvas.style.display = 'block';
    const ctx = canvas.getContext('2d');
    canvas.width = 320;
    canvas.height = 180;

    const render = () => {
      const imgData = ctx.createImageData(canvas.width, canvas.height);
      const buffer = new Uint32Array(imgData.data.buffer);
      for (let i = 0; i < buffer.length; i++) {
        const shade = Math.random() < 0.5 ? (Math.random() * 255) | 0 : 0;
        buffer[i] = (255 << 24) | (shade << 16) | (shade << 8) | shade;
      }
      ctx.putImageData(imgData, 0, 0);

      // Linhas aleatórias de interferência de sinal
      for (let j = 0; j < 3; j++) {
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.4})`;
        ctx.fillRect(0, Math.random() * canvas.height, canvas.width, Math.random() * 6);
      }

      this.staticAnimId = requestAnimationFrame(render);
    };
    render();
  },

  stopStaticNoise() {
    if (this.staticAnimId) {
      cancelAnimationFrame(this.staticAnimId);
      this.staticAnimId = null;
    }
    const canvas = document.getElementById('cctv-static-canvas');
    if (canvas) canvas.style.display = 'none';
  },

  handleIncomingSync(data) {
    if (!data) return;
    if (data.camImages) {
      this.camImages = data.camImages;
      this.renderCameraFeed();
    }
    if (data.stage === 'lock') {
      this.showLockScreen();
    } else if (data.stage === 'cctv') {
      this.showCctvStage(data.activeCam || this.activeCam || 1);
    }

    if (data.activeCam && this.stage === 'cctv') {
      this.switchCamera(data.activeCam, false);
    }

    if (data.glitch) {
      this.isGlitching = true;
      this.startStaticNoise();
      setTimeout(() => {
        this.stopStaticNoise();
      }, 2500);
    }

    if (data.signalLost !== undefined) {
      this.signalLost = data.signalLost;
      const lostEl = document.getElementById('cctv-signal-lost');
      if (lostEl) {
        lostEl.style.display = this.signalLost ? 'flex' : 'none';
        if (this.signalLost) {
          const camNames = {
            1: 'CAM 01 - SALA DE ESTAR',
            2: 'CAM 02 - ESCADARIA',
            3: 'CAM 03 - CORREDOR DO 2º ANDAR'
          };
          const lostCamTag = document.getElementById('signal-lost-cam-name');
          if (lostCamTag) lostCamTag.textContent = camNames[this.activeCam] || `CAM 0${this.activeCam}`;
        }
      }
      [1, 2, 3].forEach(n => {
        const btn = document.getElementById(`cctv-tab-${n}`);
        if (btn) {
          if (this.signalLost) btn.classList.add('disabled');
          else btn.classList.remove('disabled');
        }
      });
      if (!this.signalLost) {
        this.renderCameraFeed();
      }
    }
  }
};
window.MesaNotebookSara = MesaNotebookSara;

// ==========================================================================
// A TENDA DO IGRIS (INTERFACE DE MERCADOR - SALAO DE RELIQUIAS E TROCAS)
// ==========================================================================
const MesaIgrisShop = {
  isOpen: false,
  merchantImage: null, // Pode ser preenchida dinamicamente no futuro
  items: [], // Conforme solicitado: nenhum item na loja nesta fase (array vazio)
  interests: {}, // Map: { [itemId]: [slotOrMaster, ...] }

  getChannel() {
    return (window.MesaApp && MesaApp.channel) || (window.MesaChat && MesaChat.channel) || null;
  },

  // Retorna os dados do usuario atual (slot do jogador ou mestre)
  getCurrentUserIdentity() {
    if (!window.MesaApp || !MesaApp.state) return null;
    const isMaster = !!MesaApp.state.isMaster;
    const slot = MesaApp.state.myPlayerSlot;
    if (slot) {
      const player = MesaApp.state.players && MesaApp.state.players[slot - 1];
      return {
        id: `slot_${slot}`,
        slot: slot,
        isMaster: false,
        name: (player && player.nome) ? player.nome : `Jogador ${slot}`,
        image: (player && player.imagem) ? player.imagem : null
      };
    }
    if (isMaster) {
      return {
        id: 'master',
        slot: null,
        isMaster: true,
        name: 'Mestre',
        image: null
      };
    }
    return null;
  },

  // Retorna dados visuais para renderizar o avatar de um participante interessado
  getParticipantDisplay(identifier) {
    if (identifier === 'master') {
      return {
        id: 'master',
        name: 'Mestre',
        image: null,
        initial: 'M',
        isMaster: true
      };
    }
    // Formato 'slot_1', 'slot_2' etc. ou numero 1, 2
    let slotNum = null;
    if (typeof identifier === 'string' && identifier.startsWith('slot_')) {
      slotNum = parseInt(identifier.replace('slot_', ''), 10);
    } else if (typeof identifier === 'number') {
      slotNum = identifier;
    }
    if (slotNum && window.MesaApp && MesaApp.state && MesaApp.state.players) {
      const p = MesaApp.state.players[slotNum - 1];
      if (p) {
        return {
          id: `slot_${slotNum}`,
          slot: slotNum,
          name: p.nome || `Jogador ${slotNum}`,
          image: p.imagem || null,
          initial: (p.nome ? p.nome.trim().charAt(0) : `${slotNum}`).toUpperCase(),
          isMaster: false
        };
      }
    }
    return {
      id: identifier,
      name: `Jogador ${identifier}`,
      image: null,
      initial: '?',
      isMaster: false
    };
  },

  // Abre a interface localmente
  open() {
    this.isOpen = true;
    document.body.classList.add('igris-shop-open');
    const overlay = document.getElementById('igris-shop-overlay');
    if (overlay) {
      overlay.classList.remove('active');
      void overlay.offsetWidth;
      overlay.classList.add('active');
    }
    this.updateUserChip();
    this.renderShowcase();
  },

  // Fecha a interface localmente
  close(broadcast = false) {
    this.isOpen = false;
    document.body.classList.remove('igris-shop-open');
    const overlay = document.getElementById('igris-shop-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
    if (broadcast && window.MesaApp && MesaApp.state && MesaApp.state.isMaster) {
      const chan = this.getChannel();
      if (chan) {
        try {
          chan.send({
            type: 'broadcast',
            event: 'igris_shop_close',
            payload: {}
          });
        } catch(e) {}
      }
    }
  },

  // Transmite a abertura da tenda para todos os jogadores na mesa
  broadcastOpen() {
    this.open();
    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'igris_shop_open',
          payload: {
            interests: this.interests,
            merchantImage: this.merchantImage
          }
        });
      } catch (e) {
        console.warn('Erro ao transmitir abertura da Tenda de Igris:', e);
      }
    }
    this.saveStateToSupabase();
  },

  // Define uma imagem para o mercador futuramente
  setMerchantImage(url) {
    this.merchantImage = url;
    const imgEl = document.getElementById('igris-merchant-img');
    const pedestalContent = document.querySelector('#igris-portrait-placeholder .igris-pedestal-content');
    if (imgEl) {
      if (url) {
        imgEl.src = url;
        imgEl.style.display = 'block';
        if (pedestalContent) pedestalContent.style.opacity = '0.15';
      } else {
        imgEl.src = '';
        imgEl.style.display = 'none';
        if (pedestalContent) pedestalContent.style.opacity = '1';
      }
    }
  },

  // Permite alimentar itens na loja futuramente
  setItems(newItems) {
    this.items = Array.isArray(newItems) ? newItems : [];
    this.renderShowcase();
  },

  // Atualiza o chip com o usuario logado no topo
  updateUserChip() {
    const chip = document.getElementById('igris-user-chip');
    if (!chip) return;
    const user = this.getCurrentUserIdentity();
    if (!user) {
      chip.innerHTML = `
        <span style="color: #94a3b8; font-style: italic;">Modo Visitante (Sem Token)</span>
        <button type="button" onclick="MesaApp.openTokenModal()" style="background:#28303b; border:1px solid #475569; color:#f1f5f9; border-radius:3px; padding:2px 6px; font-size:0.68rem; cursor:pointer;">Conectar</button>
      `;
      return;
    }
    if (user.isMaster) {
      chip.innerHTML = `
        <div class="igris-user-chip-avatar" style="border-color: #94a3b8; color: #cbd5e1;">M</div>
        <span style="font-weight: 700;">Mestre da Mesa</span>
      `;
      return;
    }
    const avatarHtml = user.image 
      ? `<img src="${user.image}" class="igris-user-chip-avatar" alt="${user.name}" onerror="this.outerHTML='<div class=\\'igris-user-chip-avatar\\'>${user.name.charAt(0).toUpperCase()}</div>'" />`
      : `<div class="igris-user-chip-avatar">${user.name.charAt(0).toUpperCase()}</div>`;
    chip.innerHTML = `
      ${avatarHtml}
      <span>${user.name}</span>
    `;
  },

  // Renderiza a vitrina (CSS Grid)
  renderShowcase() {
    const grid = document.getElementById('igris-showcase-grid');
    const counter = document.getElementById('igris-items-counter');
    if (!grid) return;

    if (counter) {
      const count = (this.items && this.items.length) || 0;
      counter.textContent = `${count} ${count === 1 ? 'Artefato Exposto' : 'Artefatos Expostos'}`;
    }

    // Se nao ha itens cadastrados (fase atual da loja): mantem a grelha limpa e vazia
    if (!this.items || this.items.length === 0) {
      grid.innerHTML = '';
      return;
    }

    // Se houver itens futuramente, renderiza os cards
    const user = this.getCurrentUserIdentity();
    const myId = user ? user.id : null;

    grid.innerHTML = this.items.map(item => {
      const interestedList = this.interests[item.id] || [];
      const hasMyInterest = myId && interestedList.includes(myId);
      const avatarsHtml = this.renderInterestAvatars(item.id);

      return `
        <div class="igris-item-card ${hasMyInterest ? 'has-my-interest' : ''}" 
             data-item-id="${item.id}" 
             onclick="MesaIgrisShop.toggleInterest('${item.id}')"
             title="Clique para manifestar interesse de troca">
          <div class="igris-card-inner">
            <div class="igris-card-thumb-wrapper">
              <img src="${item.imagem || 'assets/images/placeholder_stone.png'}" 
                   alt="${item.nome || 'Artefato'}" 
                   class="igris-card-thumb" 
                   onerror="this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'100\\' height=\\'100\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'%23475569\\' stroke-width=\\'1\\'><rect width=\\'18\\' height=\\'18\\' x=\\'3\\' y=\\'3\\' rx=\\'2\\'/><circle cx=\\'8.5\\' cy=\\'8.5\\' r=\\'1.5\\'/><path d=\\'m21 15-5-5L5 21\\'/></svg>'" />
              <span class="igris-card-rarity-badge">${item.raridade || 'Reliquia'}</span>
            </div>
            <div class="igris-card-content">
              <h4 class="igris-card-title">${item.nome || 'Item Desconhecido'}</h4>
              <span class="igris-card-type">${item.tipo || 'Artefato de Pedra'}</span>
              <p class="igris-card-desc">${item.descricao || 'Nenhuma informacao decifrada sobre esta reliquia.'}</p>
              <div class="igris-card-footer">
                <span class="igris-card-price">${item.preco || 'Sob Consulta'}</span>
              </div>
            </div>
          </div>

          <!-- Borda inferior direita: Avatares lado a lado indicando disputa -->
          <div class="igris-card-interests" id="igris-card-interests-${item.id}">
            ${avatarsHtml}
          </div>
        </div>
      `;
    }).join('');
  },

  // Gera o HTML dos avatares de personagens interessados em determinado cartao
  renderInterestAvatars(itemId) {
    const list = this.interests[itemId] || [];
    if (!list || list.length === 0) return '';

    const user = this.getCurrentUserIdentity();
    const myId = user ? user.id : null;
    const isDisputed = list.length > 1;

    let html = '';
    if (isDisputed) {
      html += `<span class="igris-dispute-badge" title="Multiplos interessados em disputa!">Disputa (${list.length})</span>`;
    }

    list.forEach(identifier => {
      const participant = this.getParticipantDisplay(identifier);
      const isMe = (myId && participant.id === myId);
      const titleAttr = `Interessado: ${participant.name}${participant.isMaster ? ' (Mestre)' : ''}`;

      if (participant.image) {
        html += `
          <div class="igris-interest-avatar ${isMe ? 'is-my-slot' : ''} ${participant.isMaster ? 'is-master' : ''}" 
               title="${titleAttr}">
            <img src="${participant.image}" class="igris-interest-avatar-img" alt="${participant.name}" 
                 onerror="this.outerHTML='<span class=\\'igris-interest-initial\\'>${participant.initial}</span>'" />
          </div>
        `;
      } else {
        html += `
          <div class="igris-interest-avatar ${isMe ? 'is-my-slot' : ''} ${participant.isMaster ? 'is-master' : ''}" 
               title="${titleAttr}">
            <span>${participant.initial}</span>
          </div>
        `;
      }
    });

    return html;
  },

  // Alterna o interesse do jogador logado no cartao
  toggleInterest(itemId) {
    const user = this.getCurrentUserIdentity();
    if (!user) {
      if (window.MesaApp && typeof MesaApp.openTokenModal === 'function') {
        MesaApp.openTokenModal();
      }
      return;
    }

    if (!this.interests[itemId]) {
      this.interests[itemId] = [];
    }

    const index = this.interests[itemId].indexOf(user.id);
    if (index > -1) {
      // Jogador ja estava interessado: remove o interesse
      this.interests[itemId].splice(index, 1);
    } else {
      // Adiciona o jogador a lista de interessados
      this.interests[itemId].push(user.id);
    }

    // Atualiza a visualizacao do card especifico na tela
    this.updateCardInterestsUI(itemId);

    // Broadcast para todos os outros jogadores
    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'igris_interest_sync',
          payload: {
            itemId: itemId,
            interests: this.interests[itemId],
            allInterests: this.interests
          }
        });
      } catch (e) {
        console.warn('Erro ao transmitir interesse:', e);
      }
    }

    this.saveStateToSupabase();
  },

  // Atualiza apenas os avatares do cartao no DOM com animacao suave
  updateCardInterestsUI(itemId) {
    const cardEl = document.querySelector(`.igris-item-card[data-item-id="${itemId}"]`);
    const container = document.getElementById(`igris-card-interests-${itemId}`);
    if (container) {
      container.innerHTML = this.renderInterestAvatars(itemId);
    }
    if (cardEl) {
      const user = this.getCurrentUserIdentity();
      const myId = user ? user.id : null;
      const list = this.interests[itemId] || [];
      if (myId && list.includes(myId)) {
        cardEl.classList.add('has-my-interest');
      } else {
        cardEl.classList.remove('has-my-interest');
      }
    }
  },

  // Recebe atualizacoes de outros jogadores via Realtime
  handleIncomingInterestSync(payload) {
    if (!payload) return;
    if (payload.allInterests) {
      this.interests = payload.allInterests;
    } else if (payload.itemId && payload.interests) {
      this.interests[payload.itemId] = payload.interests;
    }

    if (payload.itemId) {
      this.updateCardInterestsUI(payload.itemId);
    } else {
      this.renderShowcase();
    }
  },

  // Persiste estado no Supabase (se mestre estiver conectado)
  async saveStateToSupabase() {
    if (!window.MesaApp || !MesaApp.supabase || !MesaApp.state || !MesaApp.state.isMaster) return;
    try {
      const { data } = await MesaApp.supabase
        .from('personagens')
        .select('atributos')
        .eq('id', 1)
        .single();
      const attrs = data && data.atributos 
        ? (typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos) 
        : {};
      attrs._sys_igris_shop = {
        interests: this.interests || {},
        merchantImage: this.merchantImage || null,
        updatedAt: Date.now()
      };
      await MesaApp.supabase
        .from('personagens')
        .update({ atributos: attrs })
        .eq('id', 1);
    } catch(e) {
      console.warn('Erro ao persistir tenda de Igris no Supabase:', e);
    }
  }
};
window.MesaIgrisShop = MesaIgrisShop;

// ==========================================================================
// MESA MODO DE COMBATE (CINEMATOGRÁFICO, VÍDEO E RAMPA PRETA UNDERTALE)
// ==========================================================================
const MesaCombate = {
  isActive: false,
  opponentId: 'unknown',
  opponentName: '???',
  videoUrl: 'assets/videos/cine1.mp4',
  selectedPresetId: 'unknown',
  turnCycle: null,
  playerHpCache: {},
  _audioCtx: null,
  _rampCanvas: null,
  _rampCtx: null,
  _rampWaveRaf: null,
  _rampWaveStartTime: 0,
  _rampResizeBound: null,
  _currentDomeLeft: null,
  _currentDomeRight: null,
  _currentDomeTop: null,

  presets: [
    {
      id: 'unknown',
      name: '???',
      video: 'assets/videos/cine1.mp4',
      desc: 'Oponente de teste'
    }
  ],

  init() {
    this.renderPresets();
    this.updateNavLabels();
    this.initRampWave();
    if (this.isActive) {
      this.startRampWave();
    }
    if (window.MesaCombatMenu && typeof MesaCombatMenu.init === 'function') {
      MesaCombatMenu.init();
    }
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.combat-master-menu-wrapper')) {
        this.closeMobileMasterMenu();
      }
    });
  },

  toggleMobileMasterMenu(e) {
    if (e && e.stopPropagation) e.stopPropagation();
    const drop = document.getElementById('combat-master-mobile-dropdown');
    if (!drop) return;
    const isShown = drop.style.display !== 'none';
    drop.style.display = isShown ? 'none' : 'flex';
  },

  closeMobileMasterMenu() {
    const drop = document.getElementById('combat-master-mobile-dropdown');
    if (drop) drop.style.display = 'none';
  },

  getChannel() {
    return (window.MesaApp && MesaApp.channel) || (window.MesaChat && MesaChat.channel) || null;
  },

  saveCombatStateDebounced() {
    if (this._saveCombatTimeout) {
      clearTimeout(this._saveCombatTimeout);
    }
    this._saveCombatTimeout = setTimeout(() => {
      this.saveCombatStateToSupabase();
    }, 350);
  },

  async saveCombatStateToSupabase() {
    if (!window.MesaApp || !MesaApp.supabase || !MesaApp.state || !MesaApp.state.isMaster) return;
    try {
      const { data } = await MesaApp.supabase
        .from('personagens')
        .select('atributos')
        .eq('id', 1)
        .single();
      const attrs = data && data.atributos 
        ? (typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos) 
        : {};
      attrs._sys_combate = {
        active: !!this.isActive,
        opponentId: this.opponentId || 'unknown',
        opponentName: this.opponentName || '???',
        videoUrl: this.videoUrl || 'assets/videos/cine1.mp4',
        turnCycle: this.turnCycle ? JSON.parse(JSON.stringify(this.turnCycle)) : null,
        updatedAt: Date.now()
      };
      await MesaApp.supabase
        .from('personagens')
        .update({ atributos: attrs })
        .eq('id', 1);
    } catch(e) {
      console.warn("Erro ao persistir estado de combate no Supabase:", e);
    }
  },

  handleNavClick() {
    if (window.MesaApp && MesaApp.state && !MesaApp.state.isMaster) {
      alert("Apenas o Mestre pode gerenciar o modo de combate.");
      return;
    }
    this.openSelectModal();
  },

  openSelectModal() {
    if (window.MesaApp && MesaApp.state && !MesaApp.state.isMaster) return;
    this.renderPresets();
    const modal = document.getElementById('combat-select-modal');
    if (modal) {
      modal.classList.add('active');
    }

    const submitBtn = document.getElementById('combat-modal-submit-btn');
    if (submitBtn) {
      submitBtn.textContent = this.isActive ? 'Atualizar Oponente' : 'Iniciar Combate';
    }

    const nameInput = document.getElementById('combat-custom-name');
    const videoInput = document.getElementById('combat-custom-video');
    if (nameInput) nameInput.value = this.opponentName || '???';
    if (videoInput) videoInput.value = this.videoUrl || 'assets/videos/cine1.mp4';
  },

  closeSelectModal() {
    const modal = document.getElementById('combat-select-modal');
    if (modal) {
      modal.classList.remove('active');
    }
  },

  renderPresets() {
    const grid = document.getElementById('combat-presets-grid');
    if (!grid) return;

    grid.innerHTML = this.presets.map(p => `
      <div class="combat-preset-card ${p.id === this.selectedPresetId ? 'selected' : ''}" 
           onclick="MesaCombate.selectPreset('${p.id}')"
           ondblclick="MesaCombate.selectAndStart('${p.id}')"
           title="Clique para selecionar ou duplo clique para iniciar combate imediatamente">
        <div class="combat-preset-name">${p.name}</div>
        <div class="combat-preset-desc">${p.desc}</div>
      </div>
    `).join('');
  },

  selectAndStart(id) {
    this.selectPreset(id);
    this.confirmSelection();
  },

  selectPreset(id) {
    this.selectedPresetId = id;
    this.renderPresets();

    const preset = this.presets.find(p => p.id === id);
    if (preset) {
      const nameInput = document.getElementById('combat-custom-name');
      const videoInput = document.getElementById('combat-custom-video');
      if (nameInput) nameInput.value = preset.name;
      if (videoInput) videoInput.value = preset.video;
    }
  },

  confirmSelection() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;

    const nameInput = document.getElementById('combat-custom-name');
    const videoInput = document.getElementById('combat-custom-video');
    const name = (nameInput && nameInput.value.trim()) || '???';
    const video = (videoInput && videoInput.value.trim()) || 'assets/videos/cine1.mp4';

    this.closeSelectModal();

    if (!this.isActive) {
      this.startCombat({ opponentId: this.selectedPresetId, opponentName: name, videoUrl: video }, true);
    } else {
      this.setOpponent({ opponentId: this.selectedPresetId, opponentName: name, videoUrl: video }, true);
    }
  },

  startCombat(data = {}, shouldBroadcast = true) {
    if (shouldBroadcast && (!MesaApp.state || !MesaApp.state.isMaster)) return;

    this.isActive = true;
    this.opponentId = data.opponentId || 'unknown';
    this.opponentName = data.opponentName || '???';
    this.videoUrl = data.videoUrl !== undefined ? data.videoUrl : (this.videoUrl || 'assets/videos/cine1.mp4');

    // Reseta cache de PV dos personagens
    this.playerHpCache = {};

    // Sincroniza turnos caso já venham no payload
    if (data.turnCycle) {
      this.turnCycle = data.turnCycle;
    }

    // Flash dramático de encontro (estilo Undertale)
    const flash = document.getElementById('combat-encounter-flash');
    if (flash) {
      flash.classList.remove('trigger');
      void flash.offsetWidth;
      flash.classList.add('trigger');
    }

    // Ativa classe no body para transição dos cards da mesa para a rampa
    document.body.classList.add('combat-active');

    // Inicia animação de ondas em pixel art na linha diagonal da rampa
    this.startRampWave();

    // Atualiza título do oponente
    const titleEl = document.getElementById('combat-opponent-title');
    if (titleEl) {
      titleEl.textContent = this.opponentName;
      titleEl.classList.remove('slam');
      void titleEl.offsetWidth;
      titleEl.classList.add('slam');
    }

    // Carrega o vídeo ou ativa o fallback atmosférico
    this.loadVideo(this.videoUrl);

    // Renderiza os cards dos personagens com estética Undertale
    this.renderPlayers();

    // Controles do Mestre e de Convidado durante o combate
    this.updateMasterControls();

    this.updateNavLabels();
    this.updateTurnUI();

    if (shouldBroadcast) {
      const chan = this.getChannel();
      if (chan) {
        try {
          chan.send({
            type: 'broadcast',
            event: 'combat_start',
            payload: {
              opponentId: this.opponentId,
              opponentName: this.opponentName,
              videoUrl: this.videoUrl,
              turnCycle: this.turnCycle
            }
          });
        } catch(e) {}
      }
      this.saveCombatStateToSupabase();
    }
  },

  setOpponent(data = {}, shouldBroadcast = true) {
    if (shouldBroadcast && (!MesaApp.state || !MesaApp.state.isMaster)) return;

    this.opponentId = data.opponentId || this.opponentId;
    this.opponentName = data.opponentName || this.opponentName;
    this.videoUrl = data.videoUrl !== undefined ? data.videoUrl : this.videoUrl;

    const titleEl = document.getElementById('combat-opponent-title');
    if (titleEl) {
      titleEl.textContent = this.opponentName;
      titleEl.classList.remove('slam');
      void titleEl.offsetWidth;
      titleEl.classList.add('slam');
    }

    // Se houver um oponente no ciclo de turnos, atualiza o nome dele na iniciativa
    if (this.turnCycle && this.turnCycle.order) {
      this.turnCycle.order.forEach(i => {
        if (i.type === 'boss') i.name = this.opponentName;
      });
      this.updateTurnUI();
    }

    this.loadVideo(this.videoUrl);

    if (shouldBroadcast) {
      const chan = this.getChannel();
      if (chan) {
        try {
          chan.send({
            type: 'broadcast',
            event: 'combat_update',
            payload: {
              opponentId: this.opponentId,
              opponentName: this.opponentName,
              videoUrl: this.videoUrl
            }
          });
        } catch(e) {}
      }
      this.saveCombatStateToSupabase();
    }
  },

  stopCombat(shouldBroadcast = true) {
    if (shouldBroadcast && (!MesaApp.state || !MesaApp.state.isMaster)) return;

    this.isActive = false;
    if (this.turnCycle) {
      this.turnCycle.active = false;
    }
    this.updateTurnUI();

    document.body.classList.remove('combat-active');

    if (window.MesaCombatMenu && typeof MesaCombatMenu.close === 'function') {
      MesaCombatMenu.close();
    }
    if (window.MesaCombatPlayersModal && typeof MesaCombatPlayersModal.close === 'function') {
      MesaCombatPlayersModal.close();
    }

    // Para a animação de ondas na rampa para economizar recursos
    this.stopRampWave();

    const video = document.getElementById('combat-bg-video');
    if (video) {
      try { video.pause(); } catch(e) {}
      video.classList.remove('playing');
      video.removeAttribute('src');
    }

    this.updateNavLabels();
    this.updateMasterControls();

    if (shouldBroadcast) {
      const chan = this.getChannel();
      if (chan) {
        try {
          chan.send({
            type: 'broadcast',
            event: 'combat_stop',
            payload: {}
          });
        } catch(e) {}
      }
      this.saveCombatStateToSupabase();
    }
  },

  loadVideo(url) {
    const video = document.getElementById('combat-bg-video');
    const fallback = document.getElementById('combat-video-fallback');
    const fallbackLabel = document.getElementById('combat-fallback-label');
    if (!video) return;

    if (fallbackLabel) {
      fallbackLabel.textContent = this.opponentName || 'ÁREA DE COMBATE';
    }

    if (url && url.trim()) {
      video.src = url.trim();
      video.load();
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          video.classList.add('playing');
          if (fallback) fallback.style.display = 'none';
        }).catch(() => {
          video.classList.remove('playing');
          if (fallback) fallback.style.display = 'flex';
        });
      }
      video.onerror = () => {
        video.classList.remove('playing');
        if (fallback) fallback.style.display = 'flex';
      };
    } else {
      video.classList.remove('playing');
      video.removeAttribute('src');
      video.load();
      if (fallback) fallback.style.display = 'flex';
    }
  },

  renderPlayers() {
    const dock = document.getElementById('combat-players-dock');
    if (!dock) return;

    const players = (MesaApp && MesaApp.state && MesaApp.state.players) || [];
    const activePlayers = players.filter(p => p && p.nome);

    if (activePlayers.length === 0) {
      dock.innerHTML = `<div style="font-family:'Press Start 2P',monospace; font-size:0.6rem; color:#888;">SEM JOGADORES NA MESA</div>`;
      return;
    }

    // Colunas dinâmicas para evitar cards órfãos e espaços vazios exagerados (ex: 8 cards -> 4 colunas em 2 linhas)
    const count = activePlayers.length;
    let cols = 4;
    if (count <= 4) cols = count;
    else if (count <= 6) cols = 3;
    else cols = 4;
    dock.style.setProperty('--combat-cols', cols);
    if (window.innerWidth <= 768) {
      dock.style.removeProperty('grid-template-columns');
      if (count <= 2) {
        dock.classList.add('is-centered-cards');
      } else {
        dock.classList.remove('is-centered-cards');
      }
    } else {
      dock.classList.remove('is-centered-cards');
      dock.style.gridTemplateColumns = `repeat(${cols}, 184px)`;
    }

    dock.innerHTML = activePlayers.map((p, idx) => {
      const slotNum = (p.slot !== undefined && p.slot !== null) ? p.slot : (idx + 1);
      const hpMax = p.hpMax || p.hp || 1;
      const hpVal = Math.max(0, p.hp || 0);
      const hpPct = Math.min(100, Math.max(0, Math.round((hpVal / hpMax) * 100)));
      const avatarSrc = p.avatar || p.imagem || '';
      const avatarHtml = avatarSrc
        ? `<img src="${avatarSrc}" alt="${p.nome}" class="combat-card-avatar-img" />`
        : `<span class="combat-card-avatar-fallback">${p.nome.charAt(0)}</span>`;

      // Inicializa o cache de PV para controle de dano brutal
      this.playerHpCache[slotNum] = hpVal;

      const stressPts = p.stressPoints || 0;
      const maxStress = p.stressPointsMax || 6;
      let pipsHtml = '';
      for (let s = 0; s < maxStress; s++) {
        pipsHtml += `<span class="undertale-stress-pip ${s < stressPts ? 'filled' : ''}"></span>`;
      }

      const animDelay = (idx * 0.05).toFixed(2);

      return `
        <div class="combat-player-card combat-card-entrance" id="combat-player-card-${slotNum}" style="animation-delay: ${animDelay}s" onclick="MesaCombate.openPlayerFicha(${slotNum})" title="Clique para abrir a ficha de ${p.nome}">
          <div class="combat-slash-overlay" id="combat-slash-${slotNum}"></div>
          <div class="combat-card-header">
            <span class="combat-card-name">${p.nome}</span>
            <span class="combat-card-slot-badge">S${slotNum}</span>
          </div>
          <div class="combat-card-body">
            <div class="combat-card-avatar-box">
              ${avatarHtml}
            </div>
            <div class="combat-card-stats">
              <div class="undertale-stat-row">
                <span class="undertale-stat-label">PV</span>
                <div class="undertale-hp-track">
                  <div class="undertale-hp-bar" id="combat-hp-bar-${slotNum}" style="width: ${hpPct}%"></div>
                </div>
                <span class="undertale-stat-val" id="combat-hp-val-${slotNum}">${hpVal}/${hpMax}</span>
              </div>
              <div class="undertale-stat-row">
                <span class="undertale-stat-label">PE</span>
                <span class="undertale-stat-val" id="combat-pe-val-${slotNum}">${p.pe || 0}/${p.peMax || p.pe || 0}</span>
              </div>
              <div class="undertale-stat-row">
                <span class="undertale-stat-label">EST</span>
                <span class="undertale-stat-val" id="combat-est-val-${slotNum}">${p.st || 0}/${p.stMax || 44}</span>
              </div>
              <div class="undertale-stress-row" id="combat-stress-pips-${slotNum}">
                ${pipsHtml}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Remove a classe de animação inicial após 800ms e aplica o delay staggered da flutuação idle
    setTimeout(() => {
      if (!dock) return;
      const cards = dock.querySelectorAll('.combat-player-card');
      cards.forEach((c, i) => {
        c.classList.remove('combat-card-entrance');
        c.style.animationDelay = `${((i % 5) * 0.45).toFixed(2)}s`;
      });
    }, 800);

    // Re-aplica indicadores visuais de turno
    this.updateTurnUI();
  },

  updatePlayerVitals(player) {
    if (!player || !player.slot) return;
    const slot = player.slot;
    const hpBar = document.getElementById(`combat-hp-bar-${slot}`);
    const hpVal = document.getElementById(`combat-hp-val-${slot}`);
    const peVal = document.getElementById(`combat-pe-val-${slot}`);
    const estVal = document.getElementById(`combat-est-val-${slot}`);
    const pipsBox = document.getElementById(`combat-stress-pips-${slot}`);

    const hpMax = player.hpMax || player.hp || 1;
    const hpCurrent = Math.max(0, player.hp || 0);
    const hpPct = Math.min(100, Math.max(0, Math.round((hpCurrent / hpMax) * 100)));

    // Se o PV abaixou, ativa o efeito de dano bruto (tremor, flash vermelho e marcas de corte pixel art)
    const prevHp = this.playerHpCache[slot];
    if (prevHp !== undefined && hpCurrent < prevHp) {
      this.triggerDamageFx(slot);
    }
    this.playerHpCache[slot] = hpCurrent;

    if (hpBar) hpBar.style.width = `${hpPct}%`;
    if (hpVal) hpVal.textContent = `${hpCurrent}/${hpMax}`;
    if (peVal) peVal.textContent = `${player.pe || 0}/${player.peMax || player.pe || 0}`;
    if (estVal) estVal.textContent = `${player.st || 0}/${player.stMax || 44}`;

    if (pipsBox) {
      const stressPts = player.stressPoints || 0;
      const maxStress = player.stressPointsMax || 6;
      let pipsHtml = '';
      for (let s = 0; s < maxStress; s++) {
        pipsHtml += `<span class="undertale-stress-pip ${s < stressPts ? 'filled' : ''}"></span>`;
      }
      pipsBox.innerHTML = pipsHtml;
    }
  },

  updateAllPlayerVitals() {
    const players = (MesaApp && MesaApp.state && MesaApp.state.players) || [];
    players.forEach(p => {
      if (p && p.slot) {
        this.updatePlayerVitals(p);
      }
    });
  },

  triggerDamageFx(slot) {
    const card = document.getElementById(`combat-player-card-${slot}`);
    const slashBox = document.getElementById(`combat-slash-${slot}`);
    if (!card) return;

    // Reinicia animação de tremor bruto e piscar vermelho
    card.classList.remove('damaged');
    void card.offsetWidth;
    card.classList.add('damaged');

    if (slashBox) {
      slashBox.innerHTML = `
        <svg class="combat-pixel-slash-svg" viewBox="0 0 100 70" preserveAspectRatio="none">
          <!-- Pixel slash corte 1 (branco brilhante estilo Undertale) -->
          <path d="M 88 4 L 80 4 L 80 10 L 72 10 L 72 16 L 64 16 L 64 24 L 54 24 L 54 32 L 44 32 L 44 40 L 32 40 L 32 48 L 22 48 L 22 56 L 10 56 L 10 66 L 18 66 L 28 56 L 38 56 L 48 48 L 58 48 L 68 40 L 76 40 L 84 30 L 92 30 L 96 16 L 96 4 Z" fill="#ffffff" />
          <!-- Pixel slash contorno sangue vermelho -->
          <path d="M 92 2 L 84 2 L 84 8 L 76 8 L 76 14 L 68 14 L 68 22 L 58 22 L 58 30 L 48 30 L 48 38 L 36 38 L 36 46 L 26 46 L 26 54 L 14 54 L 14 62 L 6 62 L 6 68 L 14 68 L 24 60 L 34 60 L 44 52 L 54 52 L 64 44 L 72 44 L 80 34 L 88 34 L 94 20 L 98 20 L 98 8 Z" fill="#ff0022" opacity="0.85" />
          <!-- Pixel slash corte 2 cruzado -->
          <path d="M 12 10 L 20 10 L 30 20 L 40 20 L 50 30 L 60 30 L 70 42 L 80 42 L 88 56 L 80 56 L 70 46 L 58 46 L 48 34 L 38 34 L 26 22 L 16 22 L 12 10 Z" fill="#ffffff" />
        </svg>
      `;
      slashBox.classList.remove('active');
      void slashBox.offsetWidth;
      slashBox.classList.add('active');
    }

    setTimeout(() => {
      card.classList.remove('damaged');
      if (slashBox) {
        slashBox.classList.remove('active');
        slashBox.innerHTML = '';
      }
    }, 600);
  },

  playHitSound() {
    // Som desativado a pedido do mestre
  },

  updateNavLabels() {
    const navLabel = document.getElementById('nav-combate-label');
    const menuLabel = document.getElementById('menu-combate-label');
    const mobileLabel = document.getElementById('mobile-combate-label');

    const text = this.isActive ? 'Combate Ativo' : 'Iniciar Combate';
    if (navLabel) navLabel.textContent = text;
    if (menuLabel) menuLabel.textContent = text;
    if (mobileLabel) mobileLabel.textContent = `${text} (Mestre)`;
  },

  openPlayerFicha(slot) {
    if (!window.MesaApp) return;
    const num = Number(slot);
    const players = (MesaApp.state && MesaApp.state.players) || [];
    const player = players.find(p => p && Number(p.slot) === num)
                || players.find(p => p && p.slot == slot)
                || (num > 0 && num <= players.length ? players[num - 1] : null)
                || players.find(p => p && p.id == slot);

    if (player && typeof MesaApp.openFicha === 'function') {
      MesaApp.openFicha(player);
      return;
    }
    if (typeof MesaApp.handleSlotClick === 'function' && !isNaN(num)) {
      MesaApp.handleSlotClick(num);
    }
  },

  // ============================================================
  // GERENCIAMENTO DO CICLO DE TURNOS
  // ============================================================
  openTurnModal() {
    if (window.MesaApp && MesaApp.state && !MesaApp.state.isMaster) {
      alert("Apenas o Mestre pode gerenciar o ciclo de turnos.");
      return;
    }

    if (!this.turnCycle || !this.turnCycle.order || this.turnCycle.order.length === 0) {
      this.initDefaultTurnOrder();
    }

    this.renderTurnOrderList();
    const modal = document.getElementById('combat-turn-modal');
    if (modal) modal.classList.add('active');

    const stopBtn = document.getElementById('combat-turn-stop-btn');
    const startBtn = document.getElementById('combat-turn-start-btn');
    if (stopBtn) stopBtn.style.display = (this.turnCycle && this.turnCycle.active) ? 'inline-block' : 'none';
    if (startBtn) startBtn.textContent = (this.turnCycle && this.turnCycle.active) ? 'Salvar Ordem' : 'Começar Ciclo de Turnos';

    const roundValEl = document.getElementById('combat-modal-round-val');
    if (roundValEl) roundValEl.textContent = (this.turnCycle && this.turnCycle.currentRound) || 1;
  },

  adjustRound(delta) {
    if (!this.turnCycle) this.initDefaultTurnOrder();
    let r = (parseInt(this.turnCycle.currentRound, 10) || 1) + delta;
    if (r < 1) r = 1;
    this.turnCycle.currentRound = r;
    this.turnCycle.updatedAt = Date.now();
    const roundValEl = document.getElementById('combat-modal-round-val');
    if (roundValEl) roundValEl.textContent = r;
    this.updateTurnUI();
    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'combat_turn_sync',
          payload: this.turnCycle
        });
      } catch(e) {}
    }
    this.saveCombatStateDebounced();
  },

  closeTurnModal() {
    const modal = document.getElementById('combat-turn-modal');
    if (modal) modal.classList.remove('active');
  },

  initDefaultTurnOrder() {
    const players = (MesaApp && MesaApp.state && MesaApp.state.players) || [];
    const activePlayers = players.filter(p => p && p.nome);

    const order = activePlayers.map(p => ({
      id: `slot_${p.slot}`,
      slot: p.slot,
      name: p.nome,
      type: 'player'
    }));

    // Adiciona o oponente da batalha na iniciativa
    order.push({
      id: 'boss',
      slot: null,
      name: this.opponentName || '???',
      type: 'boss'
    });

    this.turnCycle = {
      active: false,
      order: order,
      currentIndex: 0,
      currentRound: 1,
      updatedAt: Date.now()
    };
  },

  renderTurnOrderList() {
    const listEl = document.getElementById('combat-turn-order-list');
    if (!listEl) return;
    if (!this.turnCycle || !this.turnCycle.order) return;

    listEl.innerHTML = this.turnCycle.order.map((item, idx) => {
      const isCurrent = idx === (this.turnCycle.currentIndex || 0);
      const isBoss = item.type === 'boss';
      const label = isBoss ? `${item.name} [OPONENTE]` : `${item.name} (S${item.slot})`;
      const numLabel = `${idx + 1}º`;

      return `
        <div class="combat-turn-item ${isCurrent ? 'is-turn-current' : ''}">
          <div class="combat-turn-item-left">
            <span class="combat-turn-item-num">${numLabel}</span>
            <span class="combat-turn-item-name ${isBoss ? 'boss-name' : ''}">${label}</span>
          </div>
          <div class="combat-turn-item-actions">
            <button type="button" class="combat-turn-action-btn ${isCurrent ? 'active' : ''}" onclick="MesaCombate.setTurnCurrentIndex(${idx})" title="Definir como turno atual">
              ${isCurrent ? '● VEZ ATUAL' : 'Tornar Vez'}
            </button>
            <button type="button" class="combat-turn-arrow-btn" onclick="MesaCombate.moveTurnItem(${idx}, -1)" ${idx === 0 ? 'disabled' : ''} title="Subir na iniciativa">
              ▲
            </button>
            <button type="button" class="combat-turn-arrow-btn" onclick="MesaCombate.moveTurnItem(${idx}, 1)" ${idx === this.turnCycle.order.length - 1 ? 'disabled' : ''} title="Descer na iniciativa">
              ▼
            </button>
            <button type="button" class="combat-turn-arrow-btn turn-dup-btn" onclick="MesaCombate.duplicateTurnItem(${idx})" title="Duplicar este turno (adicionar mais uma ação para este personagem)">
              +
            </button>
            <button type="button" class="combat-turn-arrow-btn turn-del-btn" onclick="MesaCombate.removeTurnItem(${idx})" ${this.turnCycle.order.length <= 1 ? 'disabled' : ''} title="Remover este turno">
              ✕
            </button>
          </div>
        </div>
      `;
    }).join('');
  },

  moveTurnItem(index, dir) {
    if (!this.turnCycle || !this.turnCycle.order) return;
    const targetIdx = index + dir;
    if (targetIdx < 0 || targetIdx >= this.turnCycle.order.length) return;

    const temp = this.turnCycle.order[index];
    this.turnCycle.order[index] = this.turnCycle.order[targetIdx];
    this.turnCycle.order[targetIdx] = temp;

    if (this.turnCycle.currentIndex === index) {
      this.turnCycle.currentIndex = targetIdx;
    } else if (this.turnCycle.currentIndex === targetIdx) {
      this.turnCycle.currentIndex = index;
    }

    this.renderTurnOrderList();
  },

  duplicateTurnItem(index) {
    if (!this.turnCycle || !this.turnCycle.order) return;
    const item = this.turnCycle.order[index];
    if (!item) return;

    const clone = {
      id: `${item.type}_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      slot: item.slot,
      name: item.name,
      type: item.type
    };

    this.turnCycle.order.splice(index + 1, 0, clone);
    if (this.turnCycle.currentIndex > index) {
      this.turnCycle.currentIndex++;
    }
    this.renderTurnOrderList();
  },

  removeTurnItem(index) {
    if (!this.turnCycle || !this.turnCycle.order) return;
    if (this.turnCycle.order.length <= 1) {
      alert("A ordem de iniciativa deve ter pelo menos um turno.");
      return;
    }

    this.turnCycle.order.splice(index, 1);
    if (this.turnCycle.currentIndex >= this.turnCycle.order.length) {
      this.turnCycle.currentIndex = 0;
    } else if (this.turnCycle.currentIndex > index) {
      this.turnCycle.currentIndex--;
    }
    this.renderTurnOrderList();
  },

  addBossTurn() {
    if (!this.turnCycle) this.initDefaultTurnOrder();
    this.turnCycle.order.push({
      id: `boss_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      slot: null,
      name: this.opponentName || '???',
      type: 'boss'
    });
    this.renderTurnOrderList();
  },

  resetTurnOrderDefault() {
    this.initDefaultTurnOrder();
    const roundValEl = document.getElementById('combat-modal-round-val');
    if (roundValEl) roundValEl.textContent = 1;
    this.renderTurnOrderList();
    this.updateTurnUI();
  },

  presetInterleavedBoss(everyN = 2) {
    if (!this.turnCycle) this.initDefaultTurnOrder();
    const players = (MesaApp && MesaApp.state && MesaApp.state.players) || [];
    const activePlayers = players.filter(p => p && p.nome);
    const bossName = this.opponentName || '???';

    if (activePlayers.length === 0) {
      this.turnCycle.order = [{
        id: `boss_${Date.now()}`,
        slot: null,
        name: bossName,
        type: 'boss'
      }];
      this.turnCycle.currentIndex = 0;
      this.turnCycle.currentRound = 1;
      this.turnCycle.updatedAt = Date.now();
      const roundValEl = document.getElementById('combat-modal-round-val');
      if (roundValEl) roundValEl.textContent = 1;
      this.renderTurnOrderList();
      this.updateTurnUI();
      return;
    }

    const newOrder = [];
    for (let i = 0; i < activePlayers.length; i++) {
      const p = activePlayers[i];
      newOrder.push({
        id: `slot_${p.slot}_${i}`,
        slot: p.slot,
        name: p.nome,
        type: 'player'
      });
      // A cada everyN jogadores, insere o turno do oponente
      if ((i + 1) % everyN === 0) {
        newOrder.push({
          id: `boss_${Date.now()}_${i}`,
          slot: null,
          name: bossName,
          type: 'boss'
        });
      }
    }

    // Se o número total de jogadores não for múltiplo de everyN, coloca um turno do oponente no final
    if (activePlayers.length % everyN !== 0) {
      newOrder.push({
        id: `boss_${Date.now()}_end`,
        slot: null,
        name: bossName,
        type: 'boss'
      });
    }

    this.turnCycle.order = newOrder;
    this.turnCycle.currentIndex = 0;
    this.turnCycle.currentRound = 1;
    this.turnCycle.updatedAt = Date.now();
    const roundValEl = document.getElementById('combat-modal-round-val');
    if (roundValEl) roundValEl.textContent = 1;
    this.renderTurnOrderList();
    this.updateTurnUI();
  },

  setTurnCurrentIndex(index) {
    if (!this.turnCycle || !this.turnCycle.order) return;
    this.turnCycle.currentIndex = index;
    this.turnCycle.updatedAt = Date.now();
    this.renderTurnOrderList();
    this.updateTurnUI();
    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'combat_turn_sync',
          payload: this.turnCycle
        });
      } catch(e) {}
    }
    this.saveCombatStateDebounced();
  },

  confirmTurnCycle() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    if (!this.turnCycle) this.initDefaultTurnOrder();

    this.turnCycle.active = true;
    if (!this.turnCycle.currentRound) {
      this.turnCycle.currentRound = 1;
    }
    this.turnCycle.updatedAt = Date.now();
    this.closeTurnModal();
    this.updateTurnUI();
    this.updateMasterControls();

    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'combat_turn_sync',
          payload: this.turnCycle
        });
      } catch(e) {}
    }
    this.saveCombatStateToSupabase();
  },

  stopTurnCycle(shouldBroadcast = true) {
    if (shouldBroadcast && (!MesaApp.state || !MesaApp.state.isMaster)) return;

    if (this.turnCycle) {
      this.turnCycle.active = false;
      this.turnCycle.currentRound = 1;
      this.turnCycle.updatedAt = Date.now();
    }
    this.closeTurnModal();
    this.updateTurnUI();
    this.updateMasterControls();

    if (shouldBroadcast) {
      const chan = this.getChannel();
      if (chan) {
        try {
          chan.send({
            type: 'broadcast',
            event: 'combat_turn_stop',
            payload: {}
          });
        } catch(e) {}
      }
      this.saveCombatStateToSupabase();
    }
  },

  nextTurn() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    if (!this.turnCycle || !this.turnCycle.order || this.turnCycle.order.length === 0) return;

    const len = this.turnCycle.order.length;
    let curr = parseInt(this.turnCycle.currentIndex, 10);
    if (isNaN(curr) || curr < 0 || curr >= len) {
      curr = 0;
    }
    const nextIdx = (curr + 1) % len;

    // Se o ciclo concluiu e reiniciou (voltou ao 1º turno da ordem), avança para a próxima rodada
    if (curr === len - 1 && nextIdx === 0) {
      this.turnCycle.currentRound = (parseInt(this.turnCycle.currentRound, 10) || 1) + 1;
    }

    this.turnCycle.currentIndex = nextIdx;
    this.turnCycle.updatedAt = Date.now();
    this.updateTurnUI();

    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'combat_turn_sync',
          payload: this.turnCycle
        });
      } catch(e) {}
    }
    this.saveCombatStateDebounced();
  },

  prevTurn() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    if (!this.turnCycle || !this.turnCycle.order || this.turnCycle.order.length === 0) return;

    const len = this.turnCycle.order.length;
    let curr = parseInt(this.turnCycle.currentIndex, 10);
    if (isNaN(curr) || curr < 0 || curr >= len) {
      curr = 0;
    }
    const prevIdx = (curr - 1 + len) % len;

    // Se estava no início do ciclo e voltou para o final, decrementa a rodada
    if (curr === 0 && prevIdx === len - 1 && (parseInt(this.turnCycle.currentRound, 10) || 1) > 1) {
      this.turnCycle.currentRound = (parseInt(this.turnCycle.currentRound, 10) || 1) - 1;
    }

    this.turnCycle.currentIndex = prevIdx;
    this.turnCycle.updatedAt = Date.now();
    this.updateTurnUI();

    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'combat_turn_sync',
          payload: this.turnCycle
        });
      } catch(e) {}
    }
    this.saveCombatStateDebounced();
  },

  syncTurnCycle(cycleData) {
    if (!cycleData || !Array.isArray(cycleData.order) || cycleData.order.length === 0) return;

    const isMaster = !!(window.MesaApp && MesaApp.state && MesaApp.state.isMaster);
    const localTs = (this.turnCycle && this.turnCycle.updatedAt) || 0;
    const incomingTs = cycleData.updatedAt || 0;

    // Se o cliente for o mestre e a atualização recebida for mais antiga ou igual ao estado local atual, ignora
    if (isMaster && this.turnCycle && this.turnCycle.active) {
      if (incomingTs && incomingTs <= localTs) {
        return;
      }
    }

    this.turnCycle = cycleData;
    this.updateTurnUI();
    this.updateMasterControls();
  },

  updateTurnUI() {
    const isMaster = !!(MesaApp.state && MesaApp.state.isMaster);
    const subLabel = document.getElementById('combat-current-turn-sub');
    const turnBtnLabel = document.getElementById('combat-turn-btn-label');
    const navControls = document.getElementById('combat-turn-nav-controls');
    const opponentTitle = document.getElementById('combat-opponent-title');
    const roundBadge = document.getElementById('combat-round-badge');
    const roundText = document.getElementById('combat-round-badge-text');

    // Remove destaques anteriores dos cards e limpa classes de entrada
    document.querySelectorAll('.combat-player-card').forEach(card => {
      card.classList.remove('is-current-turn');
      card.classList.remove('combat-card-entrance');
    });
    if (opponentTitle) opponentTitle.classList.remove('is-current-turn-boss');

    if (!this.turnCycle || !this.turnCycle.active || !this.turnCycle.order || this.turnCycle.order.length === 0) {
      if (subLabel) {
        subLabel.style.display = 'none';
        subLabel.textContent = '';
      }
      if (turnBtnLabel) turnBtnLabel.textContent = 'Começar ciclo de turnos';
      if (navControls) navControls.style.display = 'none';
      if (roundBadge) roundBadge.style.display = 'none';
      return;
    }

    if (turnBtnLabel) turnBtnLabel.textContent = 'Ordem de Turnos';
    if (navControls) navControls.style.display = (this.isActive && isMaster) ? 'flex' : 'none';

    // 0. Atualiza o indicador da Rodada Atual em cima dos cards dos jogadores
    const roundNum = parseInt(this.turnCycle.currentRound, 10) || 1;
    if (roundBadge) {
      roundBadge.style.display = 'inline-flex';
      if (roundText) {
        const oldText = roundText.textContent.trim();
        const newText = `Rodada ${roundNum}`;
        roundText.textContent = newText;
        if (oldText !== newText) {
          roundBadge.classList.remove('round-bump');
          void roundBadge.offsetWidth;
          roundBadge.classList.add('round-bump');
        }
      }
    }

    // Sincroniza o número da rodada no modal se estiver aberto
    const modalRoundEl = document.getElementById('combat-modal-round-val');
    if (modalRoundEl) modalRoundEl.textContent = roundNum;

    // Normaliza o índice atual de forma segura
    const len = this.turnCycle.order.length;
    let idx = parseInt(this.turnCycle.currentIndex, 10);
    if (isNaN(idx) || idx < 0 || idx >= len) {
      idx = 0;
      this.turnCycle.currentIndex = 0;
    }

    const currentItem = this.turnCycle.order[idx];
    if (!currentItem) return;

    // Se o personagem/oponente agir mais de 1 vez na rodada, exibe o indicador de ação (ex: "(1/2)")
    let actionCountText = '';
    const sameItems = this.turnCycle.order.filter(it => {
      if (currentItem.type === 'boss') return it.type === 'boss';
      return it.type === 'player' && it.slot === currentItem.slot;
    });
    if (sameItems.length > 1) {
      const myOccurrence = this.turnCycle.order.slice(0, idx + 1).filter(it => {
        if (currentItem.type === 'boss') return it.type === 'boss';
        return it.type === 'player' && it.slot === currentItem.slot;
      }).length;
      actionCountText = ` (${myOccurrence}/${sameItems.length})`;
    }

    // 1. Atualiza "Turno de [Nome]" logo abaixo do nome do inimigo com micro-pulso de confirmação
    if (subLabel) {
      subLabel.textContent = `Turno de ${currentItem.name}${actionCountText}`;
      subLabel.style.display = 'block';
      subLabel.classList.remove('turn-pulse');
      void subLabel.offsetWidth;
      subLabel.classList.add('turn-pulse');
    }

    // 2. Se for a vez de um jogador, destaca o card dele com brilho laranja
    if (currentItem.type === 'player') {
      let card = (currentItem.slot !== undefined && currentItem.slot !== null)
        ? document.getElementById(`combat-player-card-${currentItem.slot}`)
        : null;
      if (!card && currentItem.name) {
        const allCards = document.querySelectorAll('.combat-player-card');
        for (const c of allCards) {
          const nameEl = c.querySelector('.combat-card-name');
          if (nameEl && nameEl.textContent.trim().toLowerCase() === currentItem.name.trim().toLowerCase()) {
            card = c;
            break;
          }
        }
      }
      if (card) {
        card.classList.remove('combat-card-entrance');
        card.classList.add('is-current-turn');
        try {
          card.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
        } catch(e) {}
      }
    } else if (currentItem.type === 'boss') {
      if (opponentTitle) opponentTitle.classList.add('is-current-turn-boss');
    }
  },

  updateMasterControls() {
    const isMaster = !!(window.MesaApp && MesaApp.state && MesaApp.state.isMaster);
    const masterCtrl = document.getElementById('combat-master-controls');

    if (masterCtrl) masterCtrl.style.display = (this.isActive && isMaster) ? 'flex' : 'none';

    const turnActive = !!(this.turnCycle && this.turnCycle.active && this.turnCycle.order && this.turnCycle.order.length > 0);

    const navControls = document.getElementById('combat-turn-nav-controls');
    if (navControls) {
      navControls.style.display = (this.isActive && isMaster && turnActive) ? 'flex' : 'none';
    }

    const mobileNextBtn = document.getElementById('combat-mobile-next-btn');
    if (mobileNextBtn) {
      mobileNextBtn.style.display = (this.isActive && isMaster && turnActive) ? 'inline-flex' : 'none';
    }

    const mobilePrevItem = document.getElementById('combat-mobile-prev-item');
    if (mobilePrevItem) {
      mobilePrevItem.style.display = turnActive ? 'block' : 'none';
    }

    const mobileTurnLabel = document.getElementById('combat-mobile-turn-label');
    if (mobileTurnLabel) {
      mobileTurnLabel.textContent = turnActive ? 'Ordem de Turnos' : 'Começar ciclo de turnos';
    }

    const drawerTurnLabel = document.getElementById('combat-drawer-turn-label');
    if (drawerTurnLabel) {
      drawerTurnLabel.textContent = turnActive ? 'Ordem de Turnos' : 'Começar ciclo de turnos';
    }
  },

  /* ============================================================
     SISTEMA DE ONDA DE PIXEL ART NA RAMPA DE COMBATE
     ============================================================ */
  initRampWave() {
    const canvas = document.getElementById('combat-ramp-canvas');
    if (!canvas) return;
    this._rampCanvas = canvas;
    this._rampCtx = canvas.getContext('2d');
    if (this._rampCtx) {
      this._rampCtx.imageSmoothingEnabled = false;
    }

    this._updateRampCanvasSize();

    if (!this._rampResizeBound) {
      this._rampResizeBound = () => {
        this._updateRampCanvasSize();
        const dockEl = document.getElementById('combat-players-dock');
        if (dockEl) {
          if (window.innerWidth <= 768) {
            dockEl.style.removeProperty('grid-template-columns');
            const numPlayers = (dockEl.children && dockEl.children.length) || 0;
            if (numPlayers <= 2) {
              dockEl.classList.add('is-centered-cards');
            } else {
              dockEl.classList.remove('is-centered-cards');
            }
          } else {
            dockEl.classList.remove('is-centered-cards');
            const currentCols = dockEl.style.getPropertyValue('--combat-cols') || 4;
            dockEl.style.gridTemplateColumns = `repeat(${currentCols}, 184px)`;
          }
        }
        if (this.isActive) {
          this.drawRampWave();
        }
      };
      window.addEventListener('resize', this._rampResizeBound);
    }
  },

  _updateRampCanvasSize() {
    if (!this._rampCanvas) return;
    const rampEl = this._rampCanvas.parentElement;
    const rect = rampEl ? rampEl.getBoundingClientRect() : null;
    const w = (rect && rect.width > 0) ? Math.round(rect.width) : window.innerWidth;
    const fallbackH = Math.round(window.innerHeight * (window.innerWidth <= 768 ? 0.44 : 0.58));
    const h = (rect && rect.height > 0) ? Math.round(rect.height) : fallbackH;

    if (this._rampCanvas.width !== w || this._rampCanvas.height !== h) {
      this._rampCanvas.width = w;
      this._rampCanvas.height = h;
      if (this._rampCtx) {
        this._rampCtx.imageSmoothingEnabled = false;
      }
    }
  },

  startRampWave() {
    this.initRampWave();
    if (this._rampWaveRaf) {
      cancelAnimationFrame(this._rampWaveRaf);
      this._rampWaveRaf = null;
    }
    this._rampWaveStartTime = performance.now();
    this._currentDomeLeft = null;
    this._currentDomeRight = null;
    this._currentDomeTop = null;

    const loop = () => {
      if (!this.isActive) {
        this._rampWaveRaf = null;
        return;
      }
      this.drawRampWave();
      this._rampWaveRaf = requestAnimationFrame(loop);
    };
    this._rampWaveRaf = requestAnimationFrame(loop);
  },

  stopRampWave() {
    if (this._rampWaveRaf) {
      cancelAnimationFrame(this._rampWaveRaf);
      this._rampWaveRaf = null;
    }
    this._currentDomeLeft = null;
    this._currentDomeRight = null;
    this._currentDomeTop = null;
    if (this._rampCtx && this._rampCanvas) {
      this._rampCtx.clearRect(0, 0, this._rampCanvas.width, this._rampCanvas.height);
    }
  },

  drawRampWave() {
    const canvas = this._rampCanvas;
    if (!canvas) return;
    const ctx = this._rampCtx;
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    if (w <= 0 || h <= 0) return;

    const isMobile = w <= 768;
    // Tamanho do bloco pixelado para estética retro (4px desktop, 3px mobile)
    const pixelSize = isMobile ? 3 : 4;

    const dockContainer = document.querySelector('.combat-dock-container');
    const containerRect = dockContainer ? dockContainer.getBoundingClientRect() : null;
    const canvasRect = canvas.getBoundingClientRect();
    const dockTopInCanvas = (containerRect && canvasRect) ? (containerRect.top - canvasRect.top) : (h * 0.45);

    let targetLeft, targetRight, targetTop, cornerR;

    if (isMobile) {
      // No Mobile: A rampa preta é uma base sólida contínua de borda a borda com onda pixelada estilizada no topo
      targetLeft = -6;
      targetRight = w + 6;
      targetTop = Math.max(10, Math.round(dockTopInCanvas - 16));
      cornerR = 0;
    } else {
      // No Desktop: Domo simétrico centralizado com ombros arredondados
      const padX = Math.max(32, Math.min(65, Math.round(w * 0.035)));
      const padTop = 22;

      targetLeft = Math.max(16, Math.round(w * 0.5 - 420));
      targetRight = Math.min(w - 16, Math.round(w * 0.5 + 420));
      targetTop = Math.max(16, Math.round(h * 0.45));

      if (containerRect && containerRect.width > 0 && containerRect.height > 0) {
        const dockLeftInCanvas = containerRect.left - canvasRect.left;
        const dockRightInCanvas = containerRect.right - canvasRect.left;
        targetLeft = Math.max(16, Math.round(dockLeftInCanvas - padX));
        targetRight = Math.min(w - 16, Math.round(dockRightInCanvas + padX));
        targetTop = Math.max(16, Math.round(dockTopInCanvas - padTop));
      }

      const maxR = Math.min((targetRight - targetLeft) * 0.25, (h - targetTop) * 0.45);
      const maxSafeR = Math.max(10, Math.floor((targetRight - targetLeft) * 0.35));
      cornerR = Math.max(28, Math.min(65, Math.min(Math.round(maxR), maxSafeR)));
    }

    // Interpolação suave (lerp) para adaptação suave sem sobressaltos visuais
    if (this._currentDomeLeft === undefined || this._currentDomeLeft === null) {
      this._currentDomeLeft = targetLeft;
      this._currentDomeRight = targetRight;
      this._currentDomeTop = targetTop;
    } else {
      this._currentDomeLeft += (targetLeft - this._currentDomeLeft) * 0.15;
      this._currentDomeRight += (targetRight - this._currentDomeRight) * 0.15;
      this._currentDomeTop += (targetTop - this._currentDomeTop) * 0.15;
    }

    const x_left = Math.round(this._currentDomeLeft);
    const x_right = Math.round(this._currentDomeRight);
    const y_top = Math.round(this._currentDomeTop);

    const cx_left = x_left + cornerR;
    const cx_right = x_right - cornerR;
    const cy = y_top + cornerR;

    // Segmentos do Domo Simétrico:
    // L1: Parede vertical esquerda (sobe da base)
    // L2: Ombro arredondado esquerdo (curva do topo esquerdo, apenas no desktop)
    // L3: Parede horizontal superior (corre para a direita sobre os cards com ondas pixeladas)
    // L4: Ombro arredondado direito (curva do topo direito, apenas no desktop)
    // L5: Parede vertical direita (desce até a base)
    const L1 = Math.max(0, h - cy);
    const L2 = cornerR > 0 ? (cornerR * (Math.PI * 0.5)) : 0;
    const L3 = Math.max(0, cx_right - cx_left);
    const L4 = cornerR > 0 ? (cornerR * (Math.PI * 0.5)) : 0;
    const L5 = Math.max(0, h - cy);
    const totalLength = L1 + L2 + L3 + L4 + L5;
    if (totalLength <= 0) return;

    const numSteps = Math.max(12, Math.round(totalLength / pixelSize));
    const t = (performance.now() - this._rampWaveStartTime) * 0.001;

    // 2. Calcula os pontos discretos ao longo do contorno simétrico do domo
    const points = [];
    for (let i = 0; i <= numSteps; i++) {
      const s = (i / numSteps) * totalLength;
      let x_base, y_base, nx, ny;

      if (s <= L1) {
        // 1. Parede vertical esquerda (sobe da base)
        x_base = x_left;
        y_base = h - s;
        nx = -1;
        ny = 0;
      } else if (cornerR > 0 && s <= L1 + L2) {
        // 2. Ombro esquerdo arredondado
        const s_arc = s - L1;
        const theta = Math.PI + (s_arc / L2) * (Math.PI * 0.5);
        x_base = cx_left + cornerR * Math.cos(theta);
        y_base = cy + cornerR * Math.sin(theta);
        nx = Math.cos(theta);
        ny = Math.sin(theta);
      } else if (s <= L1 + L2 + L3) {
        // 3. Parede horizontal superior (teto do domo sobre os cards)
        const s_top = s - (L1 + L2);
        x_base = cx_left + s_top;
        y_base = y_top;
        nx = 0;
        ny = -1;
      } else if (cornerR > 0 && s <= L1 + L2 + L3 + L4) {
        // 4. Ombro direito arredondado
        const s_arc = s - (L1 + L2 + L3);
        const theta = Math.PI * 1.5 + (s_arc / L4) * (Math.PI * 0.5);
        x_base = cx_right + cornerR * Math.cos(theta);
        y_base = cy + cornerR * Math.sin(theta);
        nx = Math.cos(theta);
        ny = Math.sin(theta);
      } else {
        // 5. Parede vertical direita (desce para a base)
        const s_down = s - (L1 + L2 + L3 + L4);
        x_base = x_right;
        y_base = cy + s_down;
        nx = 1;
        ny = 0;
      }

      // Envelope que ancora perfeitamente nas duas extremidades da base inferior (s = 0 e s = totalLength)
      const sNorm = s / totalLength;
      const envelope = Math.min(1, Math.sin(sNorm * Math.PI) * 1.6);

      // Superposição de ondas senoidais estilo pixel art
      const w1 = Math.sin(s * 0.012 - t * 2.4) * 8.0;
      const w2 = Math.sin(s * 0.026 + t * 3.6) * 4.0;
      const w3 = Math.cos(s * 0.006 - t * 1.3) * 2.5;
      const displacement = (w1 + w2 + w3) * envelope;

      const rawX = x_base + nx * displacement;
      const rawY = y_base + ny * displacement;

      // Quantização estrita na grade de pixels
      const qx = Math.round(rawX / pixelSize) * pixelSize;
      const qy = Math.round(rawY / pixelSize) * pixelSize;

      points.push({ x: qx, y: qy });
    }

    // 3. Limpa o canvas
    ctx.clearRect(0, 0, w, h);

    // 4. Preenchimento Preto Sólido (#000000) dentro do Domo Simétrico
    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.moveTo(points[0].x, h);
    for (let i = 0; i <= numSteps; i++) {
      ctx.lineTo(points[i].x, points[i].y);
    }
    // Fecha a base do domo simétrico na linha inferior da tela
    ctx.lineTo(points[numSteps].x, h);
    ctx.lineTo(points[0].x, h);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // 5. Desenho do Contorno do Domo em Pixel Art Laranja (#ff5500) com Glow Neon
    ctx.save();
    ctx.fillStyle = '#ff5500';
    ctx.shadowColor = 'rgba(255, 85, 0, 0.7)';
    ctx.shadowBlur = 8;

    for (let i = 0; i <= numSteps; i++) {
      const curr = points[i];
      ctx.fillRect(curr.x, curr.y, pixelSize, pixelSize);

      if (i > 0) {
        const prev = points[i - 1];
        if (prev.x !== curr.x || prev.y !== curr.y) {
          const dx = curr.x - prev.x;
          const dy = curr.y - prev.y;
          const steps = Math.max(Math.abs(dx / pixelSize), Math.abs(dy / pixelSize));
          for (let k = 1; k < steps; k++) {
            const kx = Math.round((prev.x + (dx * k) / steps) / pixelSize) * pixelSize;
            const ky = Math.round((prev.y + (dy * k) / steps) / pixelSize) * pixelSize;
            ctx.fillRect(kx, ky, pixelSize, pixelSize);
          }
        }
      }
    }
    ctx.restore();
  }
};
window.MesaCombate = MesaCombate;

// ==========================================================================
// MENU LATERAL / DRAWER DE COMBATE (MOBILE E DESKTOP)
// ==========================================================================
const MesaCombatMenu = {
  isOpen: false,

  init() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.isOpen) this.close();
        if (window.MesaCombatPlayersModal && MesaCombatPlayersModal.isOpen) {
          MesaCombatPlayersModal.close();
        }
      }
    });
  },

  toggle() {
    this.isOpen ? this.close() : this.open();
  },

  open() {
    this.isOpen = true;
    const drawer = document.getElementById('combat-menu-drawer');
    const backdrop = document.getElementById('combat-menu-backdrop');
    if (drawer) drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');

    // Sincroniza visibilidade dos itens restritos ao Mestre
    const isMaster = !!(window.MesaApp && MesaApp.state && MesaApp.state.isMaster);
    document.querySelectorAll('.combat-menu-master-item').forEach(el => {
      el.style.display = isMaster ? 'flex' : 'none';
    });
  },

  close() {
    this.isOpen = false;
    const drawer = document.getElementById('combat-menu-drawer');
    const backdrop = document.getElementById('combat-menu-backdrop');
    if (drawer) drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
  }
};
window.MesaCombatMenu = MesaCombatMenu;

// ==========================================================================
// MODAL DE VISUALIZAÇÃO E EDIÇÃO DE PERSONAGENS EM COMBATE
// ==========================================================================
const MesaCombatPlayersModal = {
  isOpen: false,

  open() {
    if (window.MesaCombatMenu) {
      MesaCombatMenu.close();
    }
    this.render();
    const modal = document.getElementById('combat-players-modal');
    if (modal) {
      modal.classList.add('active');
      this.isOpen = true;
    }
  },

  close() {
    const modal = document.getElementById('combat-players-modal');
    if (modal) {
      modal.classList.remove('active');
      this.isOpen = false;
    }
  },

  render() {
    const grid = document.getElementById('combat-modal-players-grid');
    if (!grid) return;

    const players = (window.MesaApp && MesaApp.state && MesaApp.state.players) || [];
    const activePlayers = players.filter(p => p && (p.nome || p.hp !== undefined || p.slot !== undefined));

    if (activePlayers.length === 0) {
      grid.innerHTML = `
        <div style="font-family:'Press Start 2P',monospace; font-size:0.6rem; color:#888; text-align:center; padding:30px 10px; grid-column: 1 / -1;">
          NENHUM PERSONAGEM ENCONTRADO NA MESA
        </div>
      `;
      return;
    }

    grid.innerHTML = activePlayers.map((p, idx) => {
      const slotNum = (p.slot !== undefined && p.slot !== null) ? p.slot : (idx + 1);
      const hpMax = Math.max(1, p.hpMax || p.hp || 1);
      const hpVal = Math.max(0, p.hp !== undefined ? p.hp : hpMax);
      const hpPct = Math.min(100, Math.max(0, Math.round((hpVal / hpMax) * 100)));
      const avatarSrc = p.avatar || p.imagem || '';
      const avatarHtml = avatarSrc
        ? `<img src="${avatarSrc}" alt="${p.nome || 'Personagem'}" class="combat-pmodal-avatar-img" />`
        : `<span class="combat-pmodal-avatar-fallback">${p.nome ? p.nome.charAt(0).toUpperCase() : '?'}</span>`;

      const stressPts = p.stressPoints || 0;
      const maxStress = p.stressPointsMax || 6;
      let pipsHtml = '';
      for (let s = 0; s < maxStress; s++) {
        pipsHtml += `<span class="undertale-stress-pip ${s < stressPts ? 'filled' : ''}"></span>`;
      }

      const peVal = p.pe !== undefined ? p.pe : 0;
      const peMax = p.peMax !== undefined ? p.peMax : peVal;
      const estVal = p.st !== undefined ? p.st : 0;
      const estMax = p.stMax !== undefined ? p.stMax : 44;

      return `
        <div class="combat-pmodal-card" onclick="MesaCombatPlayersModal.selectPlayer(${slotNum})" title="Clique para abrir e editar a ficha de ${p.nome || 'Personagem'}">
          <div class="combat-pmodal-card-header">
            <span class="combat-pmodal-card-name" title="${p.nome || 'Sem Nome'}">${p.nome || 'Sem Nome'}</span>
            <span class="combat-pmodal-card-slot">SLOT ${slotNum}</span>
          </div>
          <div class="combat-pmodal-card-body">
            <div class="combat-pmodal-avatar-box">
              ${avatarHtml}
            </div>
            <div class="combat-pmodal-stats">
              <div class="undertale-stat-row">
                <span class="undertale-stat-label">PV</span>
                <div class="undertale-hp-track">
                  <div class="undertale-hp-bar" style="width: ${hpPct}%;"></div>
                </div>
                <span class="undertale-stat-val">${hpVal}/${hpMax}</span>
              </div>
              <div class="undertale-stat-row">
                <span class="undertale-stat-label">PE</span>
                <span class="undertale-stat-val">${peVal}/${peMax}</span>
              </div>
              <div class="undertale-stat-row">
                <span class="undertale-stat-label">EST</span>
                <span class="undertale-stat-val">${estVal}/${estMax}</span>
              </div>
              <div class="undertale-stress-row">
                ${pipsHtml}
              </div>
            </div>
          </div>
          <div class="combat-pmodal-card-footer">
            <span class="combat-pmodal-action-tag">Abrir / Editar Ficha ▶</span>
          </div>
        </div>
      `;
    }).join('');
  },

  selectPlayer(slot) {
    this.close();
    if (window.MesaCombate && typeof MesaCombate.openPlayerFicha === 'function') {
      MesaCombate.openPlayerFicha(slot);
    } else if (window.MesaApp && typeof MesaApp.handleSlotClick === 'function') {
      MesaApp.handleSlotClick(Number(slot));
    }
  }
};
window.MesaCombatPlayersModal = MesaCombatPlayersModal;


