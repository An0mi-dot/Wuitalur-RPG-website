/* ============================================================
   MESA VIRTUAL E ENGINES — WUITALUR RPG
   - Glitch Background Engine
   - Diagonal Comic Stream Engine (Ficha)
   - State, 4-Char Tokens, Mobile UI e Real-Time Live Editing (Zero Emojis, In-Place DOM Updates)
   ============================================================ */

const MESA_VERSION = 'v2.5.7';
const FIOS_DO_MEDO_ARQUETIPOS_HABILIDADES = {
  'Raciocínio Lógico': {
    nome: 'Raciocínio Lógico',
    custo: '2 PE',
    desc: 'Ao analisar um enigma, mecanismo de tranca, terminal ou mensagem cifrada, pode gastar 2 PE para subir o dado de Mente em 1 degrau no teste de decifração. Se tiver sucesso, o Mestre revela a lógica do mecanismo ou a pista direta para o próximo passo.'
  },
  'Lábia Convincente': {
    nome: 'Lábia Convincente',
    custo: '2 PE',
    desc: 'Ao negociar com porteiros, policiais ou testemunhas hesitantes, pode gastar 2 PE para transformar uma Falha simples em um Sucesso comum em testes de persuasão e suborno, ou para obter acesso imediato a uma área restrita sem precisar arrombar portas.'
  },
  'Disciplina Sob Fogo': {
    nome: 'Disciplina Sob Fogo',
    custo: '1 PE',
    desc: 'Ignora qualquer Desvantagem imposta por penumbra ou escuridão em seus ataques e ferramentas. Quando estiver sob o efeito do Dado de Pavor, pode gastar 1 PE para anular a penalidade do Pavor na rolagem atual.'
  },
  'Solitário Resiliente': {
    nome: 'Solitário Resiliente',
    custo: 'Passiva',
    desc: 'Sempre que estiver a mais de 6B de distância de qualquer aliado ou completamente sozinho em um cômodo, sobe em 1 degrau seus dados de Força e Vigor para testes de Esquiva, Defesa e manobras de fuga.'
  },
  'Quebrar a Tensão': {
    nome: 'Quebrar a Tensão',
    custo: '2 PE',
    desc: 'Imediatamente após um combate, armadilha ou perseguição, pode gastar 2 PE com uma Ação Padrão para soltar uma piada. Todos os aliados que puderem ouvi-lo recuperam 1d4 pontos na Barra de Estresse. Limite de uma vez por cena de respiro.'
  },
  'Por um Triz': {
    nome: 'Por um Triz',
    custo: '3 PE',
    desc: 'Como uma Reação ao sofrer um golpe que acertaria ou ao falhar em uma Esquiva, pode gastar 3 PE para que um acidente bizarro do ambiente salve sua vida. O ataque inimigo erra completamente e você sofre zero de dano, mas você termina a ação com a condição Caído no chão.'
  },
  'Intimidação Física': {
    nome: 'Intimidação Física',
    custo: '2 PE',
    desc: 'Pode gastar 2 PE com uma Ação Padrão para uma investida brutal. Contra portas ou barricadas, sobe o dado de Força em 1 degrau e dobra o dano de impacto para arrombar. Contra um humanoide, força um teste resistido de Força; se vencer, deixa o alvo Caído e Abalado até o fim do próximo turno dele.'
  },
  'Carisma Natural': {
    nome: 'Carisma Natural',
    custo: '2 PE',
    desc: 'Possui Vantagem natural em testes de Mente para persuadir ou acalmar civis neutros. Pode gastar 2 PE em uma conversa para fazer uma pergunta incisiva adicional sem levantar suspeitas ou para reduzir a Dificuldade do teste social em 4 pontos.'
  },
  'Olhar Investigativo': {
    nome: 'Olhar Investigativo',
    custo: '2 PE',
    desc: 'Pode gastar 2 PE para realizar uma busca minuciosa com Ação Bônus em vez de Ação Padrão, recebendo Vantagem no teste de Mente para encontrar compartimentos secretos, travas ocultas ou fios de armadilhas no cômodo.'
  },
  'Instinto Andarilho': {
    nome: 'Instinto Andarilho',
    custo: '2 PE',
    desc: 'Possui Vantagem permanente em testes de Sobrevivência para traçar rotas e se orientar no escuro. Em perseguições, pode gastar 2 PE como Ação Livre para identificar uma rota alternativa, concedendo +2B de deslocamento a si mesmo e a um aliado adjacente na rodada.'
  },
  'Frente ao Perigo': {
    nome: 'Frente ao Perigo',
    custo: '2 PE',
    desc: 'Como uma Reação ao declarar a retirada do grupo de um cômodo ou corredor estreito, gasta 2 PE para barrar a passagem. Aliados recuam sem sofrer ataques de oportunidade e ganham Vantagem no teste de fuga. O Corajoso ganha +1 degrau no dado de Defesa, sendo o último a sair.'
  },
  'Recusa em Cair': {
    nome: 'Recusa em Cair',
    custo: '3 PE',
    desc: 'Ao sofrer dano que o deixaria com 0 PV, gasta 3 PE para permanecer de pé com exatamente 1 PV. Limite de uma vez por sessão.'
  }
};

function normalizeFiosDoMedoHabilidades(habs) {
  if (!Array.isArray(habs)) return [];
  return habs.map(h => {
    if (!h || !h.nome) return h;
    const canon = FIOS_DO_MEDO_ARQUETIPOS_HABILIDADES[h.nome.trim()];
    if (canon) {
      return { ...h, custo: canon.custo, desc: canon.desc };
    }
    return h;
  });
}


// SVG CONSTANTS (Sem Emojis)
const SVG_ICONS = {
  eye: `<svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`,
  pencil: `<svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`,
  key: `<svg class="ink-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>`
};

// ---- MODO LEVE (PERFORMANCE) ----
const MESA_LITE = (() => {
  try {
    return localStorage.getItem('mesa_perf') === 'lite';
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

  
  createDustVanishEffect(targetElement, color = '#ff1133', count = 35) {
    if (!targetElement) return;
    const rect = targetElement.getBoundingClientRect();
    targetElement.classList.add('dust-vanish-active');
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'dust-particle';
      const size = Math.random() * 5 + 2;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.background = Math.random() > 0.4 ? color : '#111';
      p.style.boxShadow = `0 0 6px ${color}`;
      p.style.left = (rect.left + Math.random() * rect.width) + 'px';
      p.style.top = (rect.top + Math.random() * rect.height) + 'px';
      const tx = (Math.random() - 0.5) * 80;
      const ty = - (Math.random() * 60 + 20);
      p.style.setProperty('--tx', tx + 'px');
      p.style.setProperty('--ty', ty + 'px');
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
  },

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


// Símbolo de Totem com selo circular do Conclave (SVG sem emoji)
const CONCLAVE_TOTEM_SVG = `<svg class="totem-conclave-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="10.75" stroke="currentColor" stroke-width="1.35" opacity="0.65"></circle><path d="M5 9.2L8.5 8.2V7.2L12 4.4L15.5 7.2V8.2L19 9.2L17.6 11.4L15.5 10.9V18.8H17.2V20.5H6.8V18.8H8.5V10.9L6.4 11.4Z" fill="currentColor"></path><circle cx="10.3" cy="9.2" r="0.95" fill="#180808"></circle><circle cx="13.7" cy="9.2" r="0.95" fill="#180808"></circle><path d="M9.2 12.6H14.8M9.2 15.7H14.8" stroke="#180808" stroke-width="1.25" stroke-linecap="round"></path></svg>`;

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
  _row1UpdateChain: Promise.resolve(),
  _lastPlayersVisualSig: null,

  queueRow1Update(mutatorFn) {
    if (!this.supabase || !this.state || !this.state.isMaster) return Promise.resolve();
    this._row1UpdateChain = this._row1UpdateChain.then(async () => {
      try {
        const { data } = await this.supabase
          .from('personagens')
          .select('atributos')
          .eq('id', 1)
          .single();
        const attrs = data && data.atributos
          ? (typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos)
          : {};
        mutatorFn(attrs);
        if (this.state) {
          this.state.rawRow1Atributos = attrs;
        }
        await this.supabase
          .from('personagens')
          .update({ atributos: attrs })
          .eq('id', 1);
      } catch (e) {
        console.warn('[SYNC QUEUE] Erro ao atualizar row 1:', e);
      }
    });
    return this._row1UpdateChain;
  },

  /** Seeks a media element safely even when preload="none" has not loaded metadata yet. */
  seekVideoWhenReady(video, targetSec) {
    if (!video) return;
    const sec = Number(targetSec) > 0 ? Number(targetSec) : 0;
    const applySeek = () => {
      try {
        if (video.duration && !isNaN(video.duration)) {
          video.currentTime = Math.min(sec, Math.max(0, video.duration - 0.25));
        } else {
          video.currentTime = sec;
        }
      } catch (e) {}
    };
    if (video.readyState >= 1) {
      applySeek();
    } else if (sec > 0) {
      video.addEventListener('loadedmetadata', applySeek, { once: true });
    }
  },

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

    if (this.SUPABASE_URL && this.SUPABASE_KEY && window.supabase) {
      this.supabase = window.supabase.createClient(this.SUPABASE_URL, this.SUPABASE_KEY);
      await this.fetchPlayers();
      this.subscribeToRealtime();
      this.startAreaSyncPolling();
    } else {
      console.warn("Supabase não disponível. Exibindo dados locais.");
      this.loadMockData();
    }

    const tokenToValidate = initialToken || localStorage.getItem('wu_user_token') || localStorage.getItem('mesa_token');
    if (tokenToValidate) {
      await this.checkSavedToken(tokenToValidate);
    } else {
      this.updateTokenBtnState();
    }

    MesaColetaveis.init();
    MesaChat.init();
    MesaReactions.init();
    MesaDice.init();
    MesaAreaManager.init();
    const badge = document.getElementById('mesa-version-badge');
    if (badge) {
      badge.textContent = MESA_VERSION;
    }
    if (window.MesaRollLog) {
      MesaRollLog.init();
    }
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
      const navEsconderijoBtn = document.getElementById('nav-esconderijo-btn');
      if (navEsconderijoBtn) navEsconderijoBtn.style.display = 'inline-flex';
      const menuEsconderijoBtn = document.getElementById('menu-esconderijo-btn');
      if (menuEsconderijoBtn) menuEsconderijoBtn.style.display = 'flex';
      const mobileEsconderijo = document.getElementById('mobile-esconderijo-item');
      if (mobileEsconderijo) mobileEsconderijo.style.display = 'flex';

      const navDispositivosBtn = document.getElementById('nav-dispositivos-btn');
      if (navDispositivosBtn) navDispositivosBtn.style.display = 'inline-flex';
      const menuDispositivosBtn = document.getElementById('menu-dispositivos-btn');
      if (menuDispositivosBtn) menuDispositivosBtn.style.display = 'flex';
      const mobileDispositivos = document.getElementById('mobile-dispositivos-item');
      if (mobileDispositivos) mobileDispositivos.style.display = 'flex';
      const menuMediaBtn = document.getElementById('menu-media-btn');
      if (menuMediaBtn) menuMediaBtn.style.display = 'flex';
      const mobileMediaItem = document.getElementById('mobile-media-item');
      if (mobileMediaItem) mobileMediaItem.style.display = 'flex';
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
      const navEsconderijoBtn = document.getElementById('nav-esconderijo-btn');
      if (navEsconderijoBtn) navEsconderijoBtn.style.display = 'none';
      const menuEsconderijoBtn = document.getElementById('menu-esconderijo-btn');
      if (menuEsconderijoBtn) menuEsconderijoBtn.style.display = 'none';
      const mobileEsconderijo = document.getElementById('mobile-esconderijo-item');
      if (mobileEsconderijo) mobileEsconderijo.style.display = 'none';

      const navDispositivosBtn = document.getElementById('nav-dispositivos-btn');
      if (navDispositivosBtn) navDispositivosBtn.style.display = 'none';
      const menuDispositivosBtn = document.getElementById('menu-dispositivos-btn');
      if (menuDispositivosBtn) menuDispositivosBtn.style.display = 'none';
      const mobileDispositivos = document.getElementById('mobile-dispositivos-item');
      if (mobileDispositivos) mobileDispositivos.style.display = 'none';
      const menuMediaBtn = document.getElementById('menu-media-btn');
      if (menuMediaBtn) menuMediaBtn.style.display = 'none';
      const mobileMediaItem = document.getElementById('mobile-media-item');
      if (mobileMediaItem) mobileMediaItem.style.display = 'none';
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
      const navEsconderijoBtn = document.getElementById('nav-esconderijo-btn');
      if (navEsconderijoBtn) navEsconderijoBtn.style.display = 'none';
      const menuEsconderijoBtn = document.getElementById('menu-esconderijo-btn');
      if (menuEsconderijoBtn) menuEsconderijoBtn.style.display = 'none';
      const mobileEsconderijo = document.getElementById('mobile-esconderijo-item');
      if (mobileEsconderijo) mobileEsconderijo.style.display = 'none';

      const navDispositivosBtn = document.getElementById('nav-dispositivos-btn');
      if (navDispositivosBtn) navDispositivosBtn.style.display = 'none';
      const menuDispositivosBtn = document.getElementById('menu-dispositivos-btn');
      if (menuDispositivosBtn) menuDispositivosBtn.style.display = 'none';
      const mobileDispositivos = document.getElementById('mobile-dispositivos-item');
      if (mobileDispositivos) mobileDispositivos.style.display = 'none';
      const menuMediaBtn = document.getElementById('menu-media-btn');
      if (menuMediaBtn) menuMediaBtn.style.display = 'none';
      const mobileMediaItem = document.getElementById('mobile-media-item');
      if (mobileMediaItem) mobileMediaItem.style.display = 'none';
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
      vidrilhos: 10,
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
        { nome: 'Carisma Natural', custo: '2 PE', desc: 'Possui Vantagem natural em testes de Mente para persuadir ou acalmar civis neutros. Pode gastar 2 PE em uma conversa para fazer uma pergunta incisiva adicional sem levantar suspeitas ou para reduzir a Dificuldade do teste social em 4 pontos.' }
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
      vidrilhos: 15,
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
        { nome: 'Raciocínio Lógico', custo: '2 PE', desc: 'Ao analisar um enigma, mecanismo de tranca, terminal ou mensagem cifrada, pode gastar 2 PE para subir o dado de Mente em 1 degrau no teste de decifração. Se tiver sucesso, o Mestre revela a lógica do mecanismo ou a pista direta para o próximo passo.' }
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
      vidrilhos: 10,
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
        { nome: 'Olhar Investigativo', custo: '2 PE', desc: 'Pode gastar 2 PE para realizar uma busca minuciosa com Ação Bônus em vez de Ação Padrão, recebendo Vantagem no teste de Mente para encontrar compartimentos secretos, travas ocultas ou fios de armadilhas no cômodo.' }
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
      vidrilhos: 15,
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
      vidrilhos: 15,
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
        { nome: 'Intimidação Física', custo: '2 PE', desc: 'Pode gastar 2 PE com uma Ação Padrão para uma investida brutal. Contra portas ou barricadas, sobe o dado de Força em 1 degrau e dobra o dano de impacto para arrombar. Contra um humanoide, força um teste resistido de Força; se vencer, deixa o alvo Caído e Abalado até o fim do próximo turno dele.' }
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
      vidrilhos: 15,
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
        { nome: 'Quebrar a Tensão', custo: '2 PE', desc: 'Imediatamente após um combate, armadilha ou perseguição, pode gastar 2 PE com uma Ação Padrão para soltar uma piada. Todos os aliados que puderem ouvi-lo recuperam 1d4 pontos na Barra de Estresse. Limite de uma vez por cena de respiro.' },
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
      vidrilhos: 15,
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
      vidrilhos: 15,
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
        { nome: 'Recusa em Cair', custo: '3 PE', desc: 'Ao sofrer dano que o deixaria com 0 PV, gasta 3 PE para permanecer de pé com exatamente 1 PV. Limite de uma vez por sessão.' },
        { nome: 'Percepção Aprimorada', custo: '2 PE', desc: 'Seus sentidos animais se aguçam. Ganha vantagem em testes de Mente para detectar presenças, sons ou cheiros suspeitos por 1 cena.' },
        { nome: 'Instinto de Sobrevivência', custo: '3 PE', desc: 'Em situações de perigo iminente, o corpo reage antes da mente. Sobe 1 degrau no dado de Vigor ou Força para a próxima ação.' }
      ]
    };
    
    this.state.players.forEach(p => {
      if (p && p.totens == null) p.totens = 0;
    });

    this.renderMesa();
  },

  _fetchDebounceTimer: null,
  fetchPlayersDebounced() {
    if (this._fetchDebounceTimer) {
      clearTimeout(this._fetchDebounceTimer);
    }
    this._fetchDebounceTimer = setTimeout(() => {
      this._fetchDebounceTimer = null;
      this.fetchPlayers();
    }, 250);
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
        let sysPavorSlots = {};
        data.forEach(raw => {
          if (raw.atributos) {
            const attr = typeof raw.atributos === 'string' ? JSON.parse(raw.atributos) : raw.atributos;
            if (attr && attr._sys_area) sysArea = attr._sys_area;
            if (attr && attr._sys_pavor_slots) sysPavorSlots = attr._sys_pavor_slots;
            if (attr && attr._sys_owlbear_url && window.MesaOwlbear) {
              MesaOwlbear.syncFromRemote(attr._sys_owlbear_url);
            }
            if (attr && attr._sys_center_artwork && window.MesaCenterArtwork) {
              MesaCenterArtwork.syncFromRemote(attr._sys_center_artwork);
            }
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
            vidrilhos: (() => {
              const parsed = typeof raw.atributos === 'string' ? JSON.parse(raw.atributos || '{}') : (raw.atributos || {});
              if (parsed && parsed.vidrilhos !== undefined && parsed.vidrilhos !== null) {
                const num = Number(parsed.vidrilhos);
                return num === 0 ? 15 : num;
              }
              if (raw.vidrilhos !== undefined && raw.vidrilhos !== null) {
                const num = Number(raw.vidrilhos);
                return num === 0 ? 15 : num;
              }
              return 15;
            })(),
            totens: (() => {
              const parsed = typeof raw.atributos === 'string' ? JSON.parse(raw.atributos || '{}') : (raw.atributos || {});
              if (parsed && parsed.totens !== undefined && parsed.totens !== null) {
                return Math.max(0, Number(parsed.totens) || 0);
              }
              if (raw.totens !== undefined && raw.totens !== null) {
                return Math.max(0, Number(raw.totens) || 0);
              }
              return 0;
            })(),
            atributos: (() => {
              const parsed = typeof raw.atributos === 'string' ? JSON.parse(raw.atributos || '{}') : (raw.atributos || {});
              const clean = {};
              for (const [k, v] of Object.entries(parsed)) {
                if (!k.startsWith('_') && !k.startsWith('$') && k !== 'vidrilhos' && k !== 'totens' && typeof v !== 'object') {
                  clean[k] = v;
                }
              }
              return clean;
            })(),
            bonus: typeof raw.bonus === 'string' ? JSON.parse(raw.bonus || '[]') : (raw.bonus || []),
            pericias: typeof raw.pericias === 'string' ? JSON.parse(raw.pericias || '[]') : (raw.pericias || []),
            habilidades: normalizeFiosDoMedoHabilidades(typeof raw.habilidades === 'string' ? JSON.parse(raw.habilidades || '[]') : (raw.habilidades || []))
              .filter(h => {
                if (!h || !h.nome) return false;
                const clean = h.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
                return !clean.includes("visao") && !clean.includes("escuro");
              })
          };

          // Garantir que Eric (Slot 3 / Token B8T3) tenha apenas as 3 habilidades corretas
          if (p.token === 'R5K1' || p.slot === 3) {
            if (!p.nome || p.nome === 'Mestre') {
              p.nome = 'Eric "Blade" Tepes Adams';
            }
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
                desc: 'Pode gastar 2 PE para realizar uma busca minuciosa com Ação Bônus em vez de Ação Padrão, recebendo Vantagem no teste de Mente para encontrar compartimentos secretos, travas ocultas ou fios de armadilhas no cômodo.'
              });
            }

            // Sincroniza e limpa no banco de dados do Supabase apenas se houver divergencia real e se for Mestre
            const rawHabsStr = typeof raw.habilidades === 'string' ? raw.habilidades : JSON.stringify(raw.habilidades || []);
            const needsSync = !rawHabsStr.includes('Olhar Investigativo') || rawHabsStr.toLowerCase().includes('visao');
            if (needsSync && this.supabase && p.id && this.state && this.state.isMaster) {
              this.supabase.from('personagens').update({
                habilidades: p.habilidades
              }).eq('id', p.id).then(() => {});
            }
          }

          if (p.token === 'X7V2' || p.slot === 1) {
            p.imagem = 'assets/thulita.png';
            p.avatar = 'assets/thulita_avatar.png';
            if (!p.atributos || typeof p.atributos !== 'object') p.atributos = {};
            if (!p.atributos['Saúde']) p.atributos['Saúde'] = 'd12';
            if (!p.atributos['Vigor']) p.atributos['Vigor'] = 'd16';
            if (!p.atributos['Força']) p.atributos['Força'] = 'd4';
            if (!p.atributos['Mente']) p.atributos['Mente'] = 'd8';

            const rawAttrsObj = typeof raw.atributos === 'string' ? JSON.parse(raw.atributos || '{}') : (raw.atributos || {});
            if (!rawAttrsObj['Saúde'] || !rawAttrsObj['Vigor'] || !rawAttrsObj['Força'] || !rawAttrsObj['Mente']) {
              rawAttrsObj['Saúde'] = 'd12';
              rawAttrsObj['Vigor'] = 'd16';
              rawAttrsObj['Força'] = 'd4';
              rawAttrsObj['Mente'] = 'd8';
              if (this.supabase && p.id && this.state && this.state.isMaster) {
                this.supabase.from('personagens').update({ atributos: rawAttrsObj }).eq('id', p.id).then(() => {});
              }
            }
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

          const DEFAULT_SLOT_ATTRS = {
            1: { 'Saúde': 'd12', 'Vigor': 'd16', 'Força': 'd4', 'Mente': 'd8' },
            2: { 'Saúde': 'd8', 'Vigor': 'd12', 'Força': 'd4', 'Mente': 'd16' },
            3: { 'Mente': 'd16', 'Saúde': 'd8', 'Vigor': 'd12', 'Força': 'd4' },
            4: { 'Mente': 'd4', 'Saúde': 'd8', 'Vigor': 'd12', 'Força': 'd16' },
            5: { 'Saúde': 'd4', 'Vigor': 'd16', 'Força': 'd12', 'Mente': 'd8' },
            6: { 'Força': 'd16', 'Mente': 'd12', 'Saúde': 'd8', 'Vigor': 'd4' },
            7: { 'Força': 'd16', 'Mente': 'd12', 'Saúde': 'd8', 'Vigor': 'd4' },
            8: { 'Vigor': 'd12', 'Saúde': 'd8', 'Força': 'd4', 'Mente': 'd16' }
          };
          if (p.slot && DEFAULT_SLOT_ATTRS[p.slot]) {
            const canonical = DEFAULT_SLOT_ATTRS[p.slot];
            if (!p.atributos || typeof p.atributos !== 'object') p.atributos = {};
            for (const [attrName, defaultVal] of Object.entries(canonical)) {
              if (!p.atributos[attrName]) {
                p.atributos[attrName] = defaultVal;
              }
            }
          }

          if (p.slot && sysPavorSlots && sysPavorSlots[p.slot] !== undefined) {
            p.dadoDePavor = Boolean(sysPavorSlots[p.slot]);
          }

          if (p.slot >= 1 && p.slot <= 8) {
            this.state.players[p.slot - 1] = p;
          }
        });
      }

      // Garante que Thulita (Slot 1), Minerva (Slot 2) e Eric (Slot 3) estejam presentes
      if (!this.state.players[0]) {
        this.state.players[0] = {
          id: 3, slot: 1, token: 'X7V2', nome: 'Thulita De La Benevidez', idade: '18 anos', altura: '1,40', raca: 'Dragão Anão', arquetipo: 'Popular', imagem: 'assets/thulita.png', avatar: 'assets/thulita_avatar.png',
          hp: 14, hpMax: 14, pe: 10, peMax: 10, st: 0, stMax: 32, stressPoints: 0, stressPointsMax: 6, vidrilhos: 10,
          atributos: { 'Saúde': 'd12', 'Vigor': 'd16', 'Força': 'd4', 'Mente': 'd8' },
          bonus: [{ origem: 'Raça (Dragão Anão)', desc: '+d4 em testes de Mente' }, { origem: 'Arquétipo (Popular)', desc: '+d4 em Testes Sociais' }],
          pericias: ['Atletismo', 'Percepção', 'Acrobacia', 'Intuição'],
          habilidades: [
            { nome: 'Sopro Ancestral', custo: '4 PE', desc: 'Expele um cone de energia elemental (frio, fogo ou ácido) de 3m. Inimigos na área sofrem dano igual a uma rolagem de Força e devem passar em teste de Vigor (CT 13) ou ficam atordoados por 1 rodada.' },
            { nome: 'Conexão Sensorial', custo: '2 PE', desc: 'Usa suas antenas para se comunicar telepaticamente com aliados a até 20m por 1 cena. Transmite emoções, imagens simples e intenções.' },
            { nome: 'Carisma Natural', custo: '2 PE', desc: 'Possui Vantagem natural em testes de Mente para persuadir ou acalmar civis neutros. Pode gastar 2 PE em uma conversa para fazer uma pergunta incisiva adicional sem levantar suspeitas ou para reduzir a Dificuldade do teste social em 4 pontos.' }
          ]
        };
      }

      if (!this.state.players[1]) {
        this.state.players[1] = {
          id: null, slot: 2, token: 'N3L8', nome: 'Sanguiminerva "Minerva" Qamari Von Adams', idade: '18 anos', altura: '1,78m', raca: 'Vampira', arquetipo: 'Nerd',
          imagem: 'assets/minerva.png?v=3', avatar: 'assets/minerva_avatar.png?v=3',
          hp: 12, hpMax: 12, pe: 10, peMax: 10, st: 0, stMax: 40, stressPoints: 0, stressPointsMax: 6, vidrilhos: 15,
          atributos: { 'Saúde': 'd8', 'Vigor': 'd12', 'Força': 'd4', 'Mente': 'd16' },
          bonus: [{ origem: 'Raça (Vampira)', desc: '+d4 em testes de Mente e Visão no Escuro (5B)' }, { origem: 'Arquétipo (Nerd)', desc: '+d4 em Testes de Mente' }],
          pericias: ['Furtividade', 'Intimidação', 'Investigação', 'Astúcia'],
          habilidades: [
            { nome: 'Mordida Vampírica', custo: '3 PE', desc: 'Morde um alvo adjacente para drenar sangue. Causa dano igual a uma rolagem de Força e restaura PV iguais à metade do dano causado.' },
            { nome: 'Presença Hipnótica', custo: '2 PE', desc: 'Exerce magnetismo sobrenatural. Ganha vantagem em testes de Mente para intimidar ou convencer até o fim da cena.' },
            { nome: 'Raciocínio Lógico', custo: '2 PE', desc: 'Ao analisar um enigma, mecanismo de tranca, terminal ou mensagem cifrada, pode gastar 2 PE para subir o dado de Mente em 1 degrau no teste de decifração. Se tiver sucesso, o Mestre revela a lógica do mecanismo ou a pista direta para o próximo passo.' }
          ]
        };
      }

      if (!this.state.players[2]) {
        this.state.players[2] = {
          id: 1, slot: 3, token: 'R5K1', nome: 'Eric "Blade" Tepes Adams', idade: '17 anos', altura: '1,76', raca: 'Vampiro', arquetipo: 'Curioso', imagem: 'assets/eric.png', avatar: 'assets/eric_avatar.png',
          hp: 12, hpMax: 12, pe: 10, peMax: 10, st: 0, stMax: 44, stressPoints: 0, stressPointsMax: 6, vidrilhos: 10,
          atributos: { 'Mente': 'd16', 'Saúde': 'd8', 'Vigor': 'd12', 'Força': 'd4' },
          bonus: [{ origem: 'Raça (Vampiro)', desc: '+d4 em testes de Mente e Visão no Escuro (5B)' }, { origem: 'Arquétipo (Curioso)', desc: '+d4 em testes de Investigação' }],
          pericias: ['Investigação', 'Percepção', 'Disparada', 'Medicina'],
          habilidades: [
            { nome: 'Mordida Vampírica', custo: '3 PE', desc: 'Morde um alvo adjacente para drenar sangue. Causa dano igual a uma rolagem de Força e restaura PV iguais à metade do dano causado.' },
            { nome: 'Presença Hipnótica', custo: '2 PE', desc: 'Exerce magnetismo sobrenatural. Ganha vantagem em testes de Mente para intimidar ou convencer até o fim da cena.' },
            { nome: 'Olhar Investigativo', custo: '2 PE', desc: 'Pode gastar 2 PE para realizar uma busca minuciosa com Ação Bônus em vez de Ação Padrão, recebendo Vantagem no teste de Mente para encontrar compartimentos secretos, travas ocultas ou fios de armadilhas no cômodo.' }
          ]
        };
      }

      if (!this.state.players[3]) {
        this.state.players[3] = {
          id: null, slot: 4, token: 'H2Q9', nome: 'Pera Hylidae da Silva', idade: '18 anos', altura: '1,58m', raca: 'Animalesco', arquetipo: 'Rebelde', classe: 'Adivinha', imagem: 'assets/pera.png?v=1.5.1', avatar: 'assets/pera_avatar.png?v=1.5.1',
          hp: 12, hpMax: 12, pe: 10, peMax: 10, st: 0, stMax: 24, stressPoints: 0, stressPointsMax: 6, vidrilhos: 15,
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
          id: null, slot: 5, token: 'J8W4', nome: 'Willian Kars', idade: '17 anos', altura: '1,86m', raca: 'Animalesco', arquetipo: 'Valentão', imagem: 'assets/william.png?v=1.5.1', avatar: 'assets/william_avatar.png?v=1.5.1',
          hp: 15, hpMax: 15, pe: 10, peMax: 10, st: 0, stMax: 28, stressPoints: 0, stressPointsMax: 6, vidrilhos: 15,
          atributos: { 'Saúde': 'd4', 'Vigor': 'd16', 'Força': 'd12', 'Mente': 'd8' },
          bonus: [
            { origem: 'Raça (Animalesco)', desc: '+d4 em testes de Esquiva' },
            { origem: 'Arquétipo (Valentão)', desc: '+d4 em testes de Força' }
          ],
          pericias: ['Furtividade', 'Atletismo', 'Intuição', 'Acrobacia'],
          habilidades: [
            { nome: 'Percepção Aprimorada', custo: '2 PE', desc: 'Seus sentidos animais se aguçam. Ganha vantagem em testes de Mente para detectar presenças, sons ou cheiros suspeitos por 1 cena.' },
            { nome: 'Instinto de Sobrevivência', custo: '3 PE', desc: 'Em situações de perigo iminente, o corpo reage antes da mente. Sobe 1 degrau no dado de Vigor ou Força para a próxima ação.' },
            { nome: 'Intimidação Física', custo: '2 PE', desc: 'Pode gastar 2 PE com uma Ação Padrão para uma investida brutal. Contra portas ou barricadas, sobe o dado de Força em 1 degrau e dobra o dano de impacto para arrombar. Contra um humanoide, força um teste resistido de Força; se vencer, deixa o alvo Caído e Abalado até o fim do próximo turno dele.' }
          ]
        };
      }

      if (!this.state.players[5]) {
        this.state.players[5] = {
          id: null, slot: 6, token: 'T6D3', nome: 'John Doe', idade: '899 dias (Autômato)', altura: '2,20m', raca: 'E.X.O.s', arquetipo: 'Palhaço', imagem: 'assets/john.png', avatar: 'assets/john_avatar.png',
          hp: 16, hpMax: 16, pe: 13, peMax: 13, st: 0, stMax: 32, stressPoints: 0, stressPointsMax: 6, vidrilhos: 15,
          atributos: { 'Força': 'd16', 'Mente': 'd12', 'Saúde': 'd8', 'Vigor': 'd4' },
          bonus: [
            { origem: 'Raça (E.X.O.s)', desc: 'Autorreparo passivo (recupera 1 PV por turno)' },
            { origem: 'Arquétipo (Palhaço)', desc: '+3 PE Máximos' }
          ],
          pericias: ['Atletismo (Força)', 'Diplomacia (Mente)', 'Intimidação (Força/Mente)', 'Percepção (Mente)'],
          habilidades: [
            { nome: 'Quebrar a Tensão', custo: '2 PE', desc: 'Imediatamente após um combate, armadilha ou perseguição, pode gastar 2 PE com uma Ação Padrão para soltar uma piada. Todos os aliados que puderem ouvi-lo recuperam 1d4 pontos na Barra de Estresse. Limite de uma vez por cena de respiro.' },
            { nome: 'Mira Telemétrica', custo: '3 PE', desc: 'Sensores ópticos calculam vento, distância e trajetória. Ganha vantagem em testes de ataque à distância até o fim da cena.' },
            { nome: 'Torque Forçado', custo: '2 PE', desc: 'Trava engrenagens no solo para aplicar força bruta. Ganha +d4 em testes de Força para erguer cargas, arrombar portas ou resistir a ser empurrado.' }
          ]
        };
      }

      if (!this.state.players[6]) {
        this.state.players[6] = {
          id: null, slot: 7, token: 'Y4M7', nome: 'Odara De La Benevidez', idade: '18 anos', altura: '1,42m', raca: 'Dragão Anão', arquetipo: 'Gótica',
          imagem: 'assets/odara.png?v=3', avatar: 'assets/odara_avatar.png?v=3',
          hp: 14, hpMax: 14, pe: 10, peMax: 10, st: 0, stMax: 36, stressPoints: 0, stressPointsMax: 6, vidrilhos: 15,
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
          id: null, slot: 8, token: 'F9C5', nome: "Canneth 'Blinko' Biloxi", idade: '18 anos', altura: '1,75m', raca: 'Animalesco', arquetipo: 'Teimoso',
          imagem: 'assets/blinko.png?v=2', avatar: 'assets/blinko_avatar.png',
          hp: 17, hpMax: 17, pe: 10, peMax: 10, st: 0, stMax: 36, stressPoints: 0, stressPointsMax: 6, vidrilhos: 15,
          atributos: { 'Vigor': 'd12', 'Saúde': 'd8', 'Força': 'd4', 'Mente': 'd16' },
          bonus: [
            { origem: 'Raça (Animalesco)', desc: '+d4 em testes de Esquiva / Sentidos Aguçados' },
            { origem: 'Arquétipo (Teimoso)', desc: 'Resistência a ser coagido ou derrubado' }
          ],
          pericias: ['Intimidação', 'Engenharia', 'Atletismo', 'História'],
          habilidades: [
            { nome: 'Recusa em Cair', custo: '3 PE', desc: 'Ao sofrer dano que o deixaria com 0 PV, gasta 3 PE para permanecer de pé com exatamente 1 PV. Limite de uma vez por sessão.' },
            { nome: 'Percepção Aprimorada', custo: '2 PE', desc: 'Seus sentidos animais se aguçam. Ganha vantagem em testes de Mente para detectar presenças, sons ou cheiros suspeitos por 1 cena.' },
            { nome: 'Instinto de Sobrevivência', custo: '3 PE', desc: 'Em situações de perigo iminente, o corpo reage antes da mente. Sobe 1 degrau no dado de Vigor ou Força para a próxima ação.' }
          ]
        };
      }
      
      // Extrai os atributos compartilhados da linha mestra (id: 1)
      const row1 = (data || []).find(r => Number(r.id) === 1) || (data && data[0]);
      let sysVitals = {};
      try {
        const cachedStr = localStorage.getItem('wu_mesa_vitals_cache');
        if (cachedStr) sysVitals = JSON.parse(cachedStr) || {};
      } catch(e) {}

      if (row1 && row1.atributos) {
        try {
          const p1Attrs = typeof row1.atributos === 'string' ? JSON.parse(row1.atributos) : row1.atributos;
          if (p1Attrs && p1Attrs._sys_players_vitals) {
            sysVitals = { ...sysVitals, ...p1Attrs._sys_players_vitals };
          }
        } catch(e) {}
      }

      // Aplica os status salvos no banco para cada um dos 8 jogadores
      for (let i = 0; i < 8; i++) {
        const p = this.state.players[i];
        if (p && sysVitals && sysVitals[p.slot]) {
          const v = sysVitals[p.slot];
          if (v.hp !== undefined) p.hp = v.hp;
          if (v.hpMax !== undefined) p.hpMax = v.hpMax;
          if (v.pe !== undefined) p.pe = v.pe;
          if (v.peMax !== undefined) p.peMax = v.peMax;
          if (v.st !== undefined) p.st = v.st;
          if (v.stMax !== undefined) p.stMax = v.stMax;
          if (v.stressPoints !== undefined) p.stressPoints = v.stressPoints;
          if (v.stressPointsMax !== undefined) p.stressPointsMax = v.stressPointsMax;
          if (v.vidrilhos !== undefined && v.vidrilhos !== null) {
            const vNum = Number(v.vidrilhos);
            p.vidrilhos = vNum === 0 ? 15 : vNum;
          }
          if (v.totens !== undefined && v.totens !== null) {
            p.totens = Math.max(0, Number(v.totens) || 0);
          }
        }
        if (p && (p.vidrilhos === 0 || p.vidrilhos == null)) {
          p.vidrilhos = 15;
        }
        if (p && (p.totens == null || isNaN(Number(p.totens)))) {
          p.totens = 0;
        }
      }

      // Sincroniza estados do sistema gravados na linha mestra (área, coletáveis, notebook e abertura)
      if (row1 && row1.atributos) {
        try {
          const p1Attrs = typeof row1.atributos === 'string' ? JSON.parse(row1.atributos) : row1.atributos;
          if (p1Attrs) {
            this.state.rawRow1Atributos = p1Attrs;
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
              MesaNotebookSara.syncFromRemote(p1Attrs._sys_notebook);
            }
            if (p1Attrs._sys_igris_shop && window.MesaIgrisShop) {
              const ig = p1Attrs._sys_igris_shop;
              const isShopOpen = MesaIgrisShop.isOpen;
              const isMaster = !!(this.state && this.state.isMaster);
              const remoteTime = ig.updatedAt || 0;
              const localTime = MesaIgrisShop.lastLocalUpdate || 0;
              if (!isShopOpen || remoteTime > localTime) {
                if (ig.interests) MesaIgrisShop.interests = ig.interests;
                if (ig.merchantImage) MesaIgrisShop.setMerchantImage(ig.merchantImage);
              }
              if (!isMaster && typeof ig.isOpen === 'boolean') {
                if (ig.isOpen === true && !MesaIgrisShop.isOpen) {
                  MesaIgrisShop.open(false);
                } else if (ig.isOpen === false && MesaIgrisShop.isOpen) {
                  MesaIgrisShop.close(true);
                }
              }
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
            
            if (p1Attrs._sys_perseguicao && window.MesaPerseguicaoFloresta) {
              const pf = p1Attrs._sys_perseguicao;
              const ov = document.getElementById('perseguicao-floresta-overlay');
              const isActive = ov && ov.classList.contains('active');
              const isMaster = Boolean(this.state && this.state.isMaster);
              if (!(isMaster && MesaPerseguicaoFloresta.localActionTime)) {
                if (pf.active && !isActive) {
                  MesaPerseguicaoFloresta.triggerStart();
                } else if (!pf.active && isActive) {
                  const timeSinceLocal = Date.now() - (MesaPerseguicaoFloresta.localStartTime || 0);
                  if (timeSinceLocal > 6000) {
                    MesaPerseguicaoFloresta.triggerStop();
                  }
                }
              }
            }
            if (p1Attrs._sys_tv_estatica && window.MesaTvEstatica) {
              const tv = p1Attrs._sys_tv_estatica;
              const ov = document.getElementById('tv-estatica-overlay');
              const isActive = ov && ov.classList.contains('active');
              const isMaster = Boolean(this.state && this.state.isMaster);
              if (!(isMaster && MesaTvEstatica.localActionTime)) {
                if (tv.active && !isActive) {
                  MesaTvEstatica.triggerStart();
                } else if (!tv.active && isActive) {
                  const timeSinceLocal = Date.now() - (MesaTvEstatica.localStartTime || 0);
                  if (timeSinceLocal > 6000) {
                    MesaTvEstatica.triggerStop();
                  }
                }
              }
            }
            if (p1Attrs._sys_tv_estatica_2 && window.MesaTvEstatica2) {
              const tv2 = p1Attrs._sys_tv_estatica_2;
              const ov2 = document.getElementById('tv-estatica-2-overlay');
              const isActive2 = ov2 && ov2.classList.contains('active');
              const isMaster = Boolean(this.state && this.state.isMaster);
              if (!(isMaster && MesaTvEstatica2.localActionTime)) {
                if (tv2.active && !isActive2) {
                  MesaTvEstatica2.triggerStart();
                } else if (!tv2.active && isActive2) {
                  const timeSinceLocal = Date.now() - (MesaTvEstatica2.localStartTime || 0);
                  if (timeSinceLocal > 6000) {
                    MesaTvEstatica2.triggerStop();
                  }
                }
              }
            }
            if (p1Attrs._sys_fita_1 && window.MesaFita1) {
              const f1 = p1Attrs._sys_fita_1;
              const ov = document.getElementById('fita-1-overlay');
              const isActive = ov && ov.classList.contains('active');
              const now = Date.now();
              const elapsed = (now - (f1.timestamp || 0)) / 1000;
              const isMaster = Boolean(this.state && this.state.isMaster);
              if (f1.active && !isActive && elapsed >= 0 && elapsed < 75) {
                MesaFita1.triggerStart(f1.timestamp, false);
              } else if (!f1.active && isActive && !isMaster) {
                const timeSinceLocal = now - (MesaFita1.localStartTime || 0);
                if (timeSinceLocal > 6000) {
                  MesaFita1.triggerStop();
                }
              }
            }
            if (p1Attrs._sys_fita_2 && window.MesaFita2) {
              const f2 = p1Attrs._sys_fita_2;
              const ov = document.getElementById('fita-2-overlay');
              const isActive = ov && ov.classList.contains('active');
              const now = Date.now();
              const elapsed = (now - (f2.timestamp || 0)) / 1000;
              const isMaster = Boolean(this.state && this.state.isMaster);
              if (f2.active && !isActive && elapsed >= 0 && elapsed < 280) {
                MesaFita2.triggerStart(f2.timestamp, false);
              } else if (!f2.active && isActive && !isMaster) {
                const timeSinceLocal = now - (MesaFita2.localStartTime || 0);
                if (timeSinceLocal > 6000) {
                  MesaFita2.triggerStop();
                }
              }
            }
            if (p1Attrs._sys_roll_log && window.MesaRollLog) {
              MesaRollLog.syncFromRemote(p1Attrs._sys_roll_log);
            }
            if (p1Attrs._sys_combate && window.MesaCombate) {
              MesaCombate.syncFromRemote(p1Attrs._sys_combate);
            }
            if (p1Attrs._sys_owlbear_url && window.MesaOwlbear) {
              MesaOwlbear.syncFromRemote(p1Attrs._sys_owlbear_url);
            }
            if (p1Attrs._sys_center_artwork && window.MesaCenterArtwork) {
              MesaCenterArtwork.syncFromRemote(p1Attrs._sys_center_artwork);
            }
            if (p1Attrs._sys_esconderijo && window.MesaEsconderijo) {
              MesaEsconderijo.syncFromRemote(p1Attrs._sys_esconderijo);
            }
          }
        } catch(eSync) {}
      }

      const visualSig = JSON.stringify((this.state.players || []).map(p => p ? [
        p.id, p.slot, p.nome, p.hp, p.hpMax, p.pe, p.peMax, p.st, p.stMax,
        p.stressPoints, p.stressPointsMax, p.vidrilhos, p.totens, p.dadoDePavor, p.imagem, p.avatar
      ] : null));
      if (visualSig !== this._lastPlayersVisualSig) {
        this._lastPlayersVisualSig = visualSig;
        this.renderMesa();
      }

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

          // 3. Sincronizacao do Notebook da Sara (Espelhamento Completo Mestre -> Jogadores)
          if (attrs && attrs._sys_notebook && window.MesaNotebookSara) {
            MesaNotebookSara.syncFromRemote(attrs._sys_notebook);
          }

          // 3.1 Sincronização da Tenda do Igris
          if (attrs && attrs._sys_igris_shop && window.MesaIgrisShop) {
            const ig = attrs._sys_igris_shop;
            const isMaster = !!(this.state && this.state.isMaster);
            const remoteTime = ig.updatedAt || 0;
            const localTime = MesaIgrisShop.lastLocalUpdate || 0;
            // Se a loja estiver aberta na tela, as selecoes sao gerenciadas em tempo real via WebSocket (evita reverter desselecao)
            if (!MesaIgrisShop.isOpen && remoteTime > localTime) {
              if (ig.interests) {
                MesaIgrisShop.interests = ig.interests;
              }
              if (ig.merchantImage) MesaIgrisShop.setMerchantImage(ig.merchantImage);
            }
            if (!isMaster && typeof ig.isOpen === 'boolean') {
              if (ig.isOpen === true && !MesaIgrisShop.isOpen) {
                MesaIgrisShop.open(false);
              } else if (ig.isOpen === false && MesaIgrisShop.isOpen) {
                MesaIgrisShop.close(true);
              }
            }
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
          if (attrs && attrs._sys_roll_log && window.MesaRollLog) {
            MesaRollLog.syncFromRemote(attrs._sys_roll_log);
          }
          if (attrs && attrs._sys_combate && window.MesaCombate) {
            MesaCombate.syncFromRemote(attrs._sys_combate);
          }

          if (attrs && attrs._sys_fita_1 && window.MesaFita1) {
            const f1 = attrs._sys_fita_1;
            const ov = document.getElementById('fita-1-overlay');
            const isActive = ov && ov.classList.contains('active');
            const now = Date.now();
            const elapsed = (now - (f1.timestamp || 0)) / 1000;
            const isMaster = Boolean(this.state && this.state.isMaster);
            if (f1.active && !isActive && elapsed >= 0 && elapsed < 75) {
              MesaFita1.triggerStart(f1.timestamp, false);
            } else if (!f1.active && isActive && !isMaster) {
              const timeSinceLocal = now - (MesaFita1.localStartTime || 0);
              if (timeSinceLocal > 6000) {
                MesaFita1.triggerStop();
              }
            }
          }
          if (attrs && attrs._sys_fita_2 && window.MesaFita2) {
            const f2 = attrs._sys_fita_2;
            const ov = document.getElementById('fita-2-overlay');
            const isActive = ov && ov.classList.contains('active');
            const now = Date.now();
            const elapsed = (now - (f2.timestamp || 0)) / 1000;
            const isMaster = Boolean(this.state && this.state.isMaster);
            if (f2.active && !isActive && elapsed >= 0 && elapsed < 280) {
              MesaFita2.triggerStart(f2.timestamp, false);
            } else if (!f2.active && isActive && !isMaster) {
              const timeSinceLocal = now - (MesaFita2.localStartTime || 0);
              if (timeSinceLocal > 6000) {
                MesaFita2.triggerStop();
              }
            }
          }
          if (attrs && attrs._sys_tv_estatica && window.MesaTvEstatica) {
            const tv = attrs._sys_tv_estatica;
            const ov = document.getElementById('tv-estatica-overlay');
            const isActive = ov && ov.classList.contains('active');
            const isMaster = Boolean(this.state && this.state.isMaster);
            if (!(isMaster && MesaTvEstatica.localActionTime)) {
              if (tv.active && !isActive) {
                MesaTvEstatica.triggerStart();
              } else if (!tv.active && isActive) {
                const timeSinceLocal = Date.now() - (MesaTvEstatica.localStartTime || 0);
                if (timeSinceLocal > 6000) {
                  MesaTvEstatica.triggerStop();
                }
              }
            }
          }
          if (attrs && attrs._sys_tv_estatica_2 && window.MesaTvEstatica2) {
            const tv2 = attrs._sys_tv_estatica_2;
            const ov2 = document.getElementById('tv-estatica-2-overlay');
            const isActive2 = ov2 && ov2.classList.contains('active');
            const isMaster = Boolean(this.state && this.state.isMaster);
            if (!(isMaster && MesaTvEstatica2.localActionTime)) {
              if (tv2.active && !isActive2) {
                MesaTvEstatica2.triggerStart();
              } else if (!tv2.active && isActive2) {
                const timeSinceLocal = Date.now() - (MesaTvEstatica2.localStartTime || 0);
                if (timeSinceLocal > 6000) {
                  MesaTvEstatica2.triggerStop();
                }
              }
            }
          }
          if (attrs && attrs._sys_perseguicao && window.MesaPerseguicaoFloresta) {
            const pf = attrs._sys_perseguicao;
            const ov = document.getElementById('perseguicao-floresta-overlay');
            const isActive = ov && ov.classList.contains('active');
            const isMaster = Boolean(this.state && this.state.isMaster);
            if (!(isMaster && MesaPerseguicaoFloresta.localActionTime)) {
              if (pf.active && !isActive) {
                MesaPerseguicaoFloresta.triggerStart();
              } else if (!pf.active && isActive) {
                const timeSinceLocal = Date.now() - (MesaPerseguicaoFloresta.localStartTime || 0);
                if (timeSinceLocal > 6000) {
                  MesaPerseguicaoFloresta.triggerStop();
                }
              }
            }
          }
          if (attrs && attrs._sys_esconderijo && window.MesaEsconderijo) {
            MesaEsconderijo.syncFromRemote(attrs._sys_esconderijo);
          }

          // 6. Sincronizacao do Tabuleiro Mapa [Owlbear]
          if (attrs && attrs._sys_owlbear_url && window.MesaOwlbear) {
            if (attrs._sys_owlbear_url !== MesaOwlbear.url) {
              MesaOwlbear.syncFromRemote(attrs._sys_owlbear_url);
            }
          }

          // 7. Sincronizacao da Ilustracao Central de Cena / NPC
          if (attrs && attrs._sys_center_artwork && window.MesaCenterArtwork) {
            const remoteArt = attrs._sys_center_artwork;
            const isDiff = (Boolean(remoteArt.active) !== MesaCenterArtwork.active) || 
                           (remoteArt.active && (remoteArt.npcId !== MesaCenterArtwork.npcId || remoteArt.imgUrl !== MesaCenterArtwork.imgUrl));
            if (isDiff) {
              MesaCenterArtwork.syncFromRemote(remoteArt);
            }
          }
        }
      } catch(e) {}
    }, 1000);
  },

  clientId: 'c_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now(),

  subscribeToRealtime() {
    if (!this.supabase) return;

    if (this.channel) {
      try { this.supabase.removeChannel(this.channel); } catch(e) {}
    }

    if (!this.clientId) {
      this.clientId = 'c_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    }

    const channel = this.supabase.channel('mesa_main_channel', {
      config: {
        broadcast: { ack: false, self: false }
      }
    });

    // Envolve o envio para anexar automaticamente o identificador unico do cliente emissor (_senderId)
    const rawSend = channel.send.bind(channel);
    channel.send = (msg) => {
      if (msg && msg.type === 'broadcast') {
        if (!msg.payload) msg.payload = {};
        if (!msg.payload._senderId) {
          msg.payload._senderId = this.clientId;
        }
      }
      return rawSend(msg);
    };

    this.channel = channel;
    if (window.MesaChat) MesaChat.channel = channel;

    // Helper universal para ignorar broadcasts vindos deste proprio cliente (elimina eco, duplo disparo e replay de animacoes)
    const isFromSelf = (payload) => {
      if (!payload) return false;
      const data = payload.payload;
      if (data && data._senderId && data._senderId === this.clientId) {
        return true;
      }
      return false;
    };

    // 1. Postgres changes com debounce para evitar tempestade de selects e loops
    channel.on('postgres_changes', { event: '*', schema: 'public', table: 'personagens' }, (payload) => {
      this.fetchPlayersDebounced();
    });

    // 2. Sincronização de Coletáveis
    channel.on('broadcast', { event: 'coletaveis_sync' }, (payload) => {
      if (isFromSelf(payload)) return;
      const data = payload.payload;
      if (data && Array.isArray(data.items) && window.MesaColetaveis) {
        const { items: merged } = MesaColetaveis.mergeCanonical(data.items);
        MesaColetaveis.items = merged;
        localStorage.setItem('wu_coletaveis_v2', JSON.stringify(merged));
        if (this.state) {
          if (!this.state.rawRow1Atributos) this.state.rawRow1Atributos = {};
          this.state.rawRow1Atributos._sys_coletaveis = merged;
        }
        MesaColetaveis.render();
        if (typeof MesaColetaveis.renderFicha === 'function') MesaColetaveis.renderFicha();
      }
    });

    // 3. Sincronização de Área
    channel.on('broadcast', { event: 'area_changed' }, (payload) => {
      if (isFromSelf(payload)) return;
      const data = payload.payload;
      if (data && data.areaId && window.MesaAreaManager && MesaAreaManager.currentAreaId !== data.areaId) {
        MesaAreaManager.applyArea(data.areaId, false);
        MesaApp.closeModal('area-map-modal');
      }
    });

    // 4. Abertura da Mesa
    channel.on('broadcast', { event: 'play_abertura' }, (payload) => {
      if (isFromSelf(payload)) return;
      const ts = payload && payload.payload && payload.payload.timestamp;
      const offset = ts ? Math.max(0, (Date.now() - ts) / 1000) : 0;
      if (window.MesaAbertura) MesaAbertura.triggerAbertura(offset);
    });
    channel.on('broadcast', { event: 'stop_abertura' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaAbertura) MesaAbertura.triggerStop();
    });

    // 5. Notebook da Sara (Dispositivos da Campanha)
    channel.on('broadcast', { event: 'notebook_start' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaNotebookSara && payload.payload) {
        MesaNotebookSara.syncFromRemote({ active: true, ...payload.payload });
      }
    });

    channel.on('broadcast', { event: 'fita_2_start' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaFita2) {
        MesaFita2.triggerStart(0, true);
      }
    });

    channel.on('broadcast', { event: 'fita_2_stop' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaFita2) {
        MesaFita2.triggerStop();
      }
    });

    channel.on('broadcast', { event: 'fita_1_start' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaFita1) {
        MesaFita1.triggerStart(0, true);
      }
    });

    channel.on('broadcast', { event: 'fita_1_stop' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaFita1) {
        MesaFita1.triggerStop();
      }
    });

    channel.on('broadcast', { event: 'tv_estatica_start' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaTvEstatica) {
        MesaTvEstatica.triggerStart();
      }
    });

    channel.on('broadcast', { event: 'tv_estatica_stop' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaTvEstatica) {
        MesaTvEstatica.triggerStop();
      }
    });

    channel.on('broadcast', { event: 'tv_estatica_2_start' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaTvEstatica2) {
        MesaTvEstatica2.triggerStart();
      }
    });

    channel.on('broadcast', { event: 'tv_estatica_2_stop' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaTvEstatica2) {
        MesaTvEstatica2.triggerStop();
      }
    });

    channel.on('broadcast', { event: 'perseguicao_floresta_start' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaPerseguicaoFloresta) {
        MesaPerseguicaoFloresta.localStartTime = Date.now();
        MesaPerseguicaoFloresta.triggerStart();
      }
    });

    channel.on('broadcast', { event: 'perseguicao_floresta_stop' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaPerseguicaoFloresta) {
        MesaPerseguicaoFloresta.triggerStop();
      }
    });

    channel.on('broadcast', { event: 'notebook_stop' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaNotebookSara) {
        MesaNotebookSara.triggerStop();
      }
    });

    channel.on('broadcast', { event: 'notebook_sync' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaNotebookSara && payload.payload) {
        MesaNotebookSara.handleIncomingSync(payload.payload);
      }
    });

    // 5.1 Modo de Combate da Campanha
    channel.on('broadcast', { event: 'combat_start' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaCombate && payload.payload) {
        MesaCombate.startCombat(payload.payload, false);
      }
    });
    channel.on('broadcast', { event: 'combat_update' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaCombate && payload.payload) {
        MesaCombate.setOpponent(payload.payload, false);
      }
    });
    channel.on('broadcast', { event: 'combat_stop' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaCombate) {
        MesaCombate.stopCombat(false);
      }
    });
    channel.on('broadcast', { event: 'combat_turn_sync' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaCombate && payload.payload) {
        MesaCombate.syncTurnCycle(payload.payload);
      }
    });
    channel.on('broadcast', { event: 'combat_turn_stop' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaCombate) {
        MesaCombate.stopTurnCycle(false);
      }
    });

    // 5.2 A Tenda do Igris (Interface de Mercador)
    channel.on('broadcast', { event: 'igris_shop_open' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaIgrisShop) {
        if (payload.payload && payload.payload.interests) {
          MesaIgrisShop.interests = payload.payload.interests;
        }
        if (payload.payload && payload.payload.merchantImage) {
          MesaIgrisShop.setMerchantImage(payload.payload.merchantImage);
        }
        MesaIgrisShop.open(false);
      }
    });

    channel.on('broadcast', { event: 'igris_interest_sync' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaIgrisShop && payload.payload) {
        MesaIgrisShop.handleIncomingInterestSync(payload.payload);
      }
    });

    channel.on('broadcast', { event: 'igris_shop_close' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaIgrisShop) {
        MesaIgrisShop.close(true);
      }
    });

    channel.on('broadcast', { event: 'igris_roulette_spin' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaIgrisShop && payload && payload.payload) {
        const p = payload.payload;
        MesaIgrisShop.runRouletteAnimation(p.itemId, p.itemName, p.participants, p.winnerId);
      }
    });

    channel.on('broadcast', { event: 'igris_items_granted' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaIgrisShop && payload && payload.payload) {
        MesaIgrisShop.handleItemsGranted(payload.payload);
      }
    });

    // 6. Mensagens de Chat e Reações
    channel.on('broadcast', { event: 'chat_msg' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaChat) MesaChat.receiveMessage(payload.payload);
    });

    channel.on('broadcast', { event: 'chat_message' }, (payload) => {
      if (isFromSelf(payload)) return;
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
      if (isFromSelf(payload)) return;
      const data = payload.payload;
      if (data && data.slot && window.MesaReactions) {
        MesaReactions.showBubble(data.slot, data.faceKey || data.emoji);
      }
    });

    channel.on('broadcast', { event: 'pavor_toggle' }, (payload) => {
      if (isFromSelf(payload)) return;
      const data = payload.payload;
      if (data && data.slot) {
        const p = MesaApp.state.players[data.slot - 1];
        if (p) {
          p.dadoDePavor = Boolean(data.dadoDePavor);
          MesaApp.renderMesa();
          if (MesaApp.state.activeViewingPlayer && MesaApp.state.activeViewingPlayer.slot === p.slot) {
            MesaApp.openFicha(p);
          }
        }
      }
    });

    channel.on('broadcast', { event: 'esconderijo_iniciar' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaEsconderijo) {
        MesaEsconderijo.handleIncomingStart(payload.payload);
      }
    });

    channel.on('broadcast', { event: 'esconderijo_busca' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaEsconderijo) {
        MesaEsconderijo.handleIncomingSearch(payload.payload);
      }
    });

    channel.on('broadcast', { event: 'esconderijo_encerrar' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaEsconderijo) {
        MesaEsconderijo.handleIncomingStop(payload.payload);
      }
    });

    channel.on('broadcast', { event: 'esconderijo_fase' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaEsconderijo) {
        MesaEsconderijo.handleIncomingPhase(payload.payload);
      }
    });

    channel.on('broadcast', { event: 'esconderijo_evaporou' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaEsconderijo) {
        MesaEsconderijo.handleIncomingEvaporation(payload.payload);
      }
    });

    channel.on('broadcast', { event: 'dice_roll' }, (payload) => {
      if (isFromSelf(payload)) return;
      const data = payload.payload;
      if (data && window.MesaDice) {
        MesaDice.playRollAnimation(data);
      }
      if (data && !data.isMaster && window.MesaRollLog) {
        MesaRollLog.receiveIncomingRoll(data);
      }
    });

    channel.on('broadcast', { event: 'vitals_sync' }, (payload) => {
      if (isFromSelf(payload)) return;
      const data = payload.payload;
      if (data && data.slot) {
        MesaApp.handleIncomingVitals(data);
      }
    });

    channel.on('broadcast', { event: 'media_sync' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaMediaPlayer && (!MesaApp.state || !MesaApp.state.isMaster)) {
        MesaMediaPlayer.handleIncomingSync(payload.payload);
      }
    });

    channel.on('broadcast', { event: 'owlbear_url_sync' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaOwlbear && payload.payload) {
        MesaOwlbear.handleIncomingSync(payload.payload);
      }
    });

    channel.on('broadcast', { event: 'owlbear_broadcast_open' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaOwlbear && payload.payload) {
        MesaOwlbear.handleIncomingBroadcastOpen(payload.payload);
      }
    });

    channel.on('broadcast', { event: 'center_artwork_sync' }, (payload) => {
      if (isFromSelf(payload)) return;
      if (window.MesaCenterArtwork && payload.payload) {
        MesaCenterArtwork.syncFromRemote(payload.payload);
      }
    });

    channel.subscribe((status, err) => {
      console.log("[MESA REALTIME UNIFICADO] Status da conexão:", status, err || '');
    });
  },

  
  showToast(msg) {
    const container = document.getElementById('mesa-toast-container');
    if (!container) return;
    const item = document.createElement('div');
    item.className = 'mesa-toast-item';
    item.textContent = msg;
    container.appendChild(item);
    setTimeout(() => item.remove(), 3200);
  },

  toggleDadoDePavor(slot) {
    if (!this.state || !this.state.isMaster) {
      this.showToast("Apenas o Mestre pode adicionar ou remover o Dado de Pavor.");
      return;
    }
    if (slot === undefined || slot === null) {
      if (this.state.activeViewingPlayer) slot = this.state.activeViewingPlayer.slot;
      else if (this.state.mySlot) slot = this.state.mySlot;
      else slot = 1;
    }
    const slotNum = Number(slot);
    let p = (this.state.players || []).find(pl => pl && Number(pl.slot) === slotNum);
    if (!p && this.state.players && this.state.players[slotNum - 1]) {
      p = this.state.players[slotNum - 1];
    }
    if (!p) {
      console.warn("[PAVOR] Jogador nao encontrado para slot:", slot);
      return;
    }

    p.dadoDePavor = !p.dadoDePavor;
    console.log(`[PAVOR] Dado de Pavor para ${p.nome} (Slot ${p.slot}):`, p.dadoDePavor);

    // 1. Atualiza Ficha aberta diretamente
    const fichaBtn = document.querySelector('.ficha-pavor-toggle-btn');
    if (fichaBtn) {
      fichaBtn.classList.toggle('active', Boolean(p.dadoDePavor));
      const span = fichaBtn.querySelector('span');
      if (span) {
        span.textContent = p.dadoDePavor ? 'Dado de Pavor Ativo' : 'Ativar Pavor';
      }
    }

    // 2. Atualiza chip no modal de rolagem
    if (window.MesaDice && MesaDice.updatePavorChipUI) {
      MesaDice.updatePavorChipUI();
    }

    // 3. Atualiza slots da mesa e dock de combate
    this.renderMesa();
    if (window.MesaCombate && MesaCombate.isActive && MesaCombate.renderPlayers) {
      MesaCombate.renderPlayers();
    }

    // 4. Feedback visual em toast
    this.showToast(p.dadoDePavor ? `Dado de Pavor ativado para ${p.nome}` : `Dado de Pavor desativado para ${p.nome}`);

    // 5. Broadcast Supabase
    if (MesaChat && MesaChat.channel) {
      MesaChat.channel.send({
        type: 'broadcast',
        event: 'pavor_toggle',
        payload: { slot: p.slot || slotNum, dadoDePavor: p.dadoDePavor }
      });
    }

    // 6. Persistencia no Supabase (apenas Mestre)
    if (this.supabase && this.state.isMaster) {
      (async () => {
        try {
          const { data } = await this.supabase
            .from('personagens')
            .select('atributos')
            .eq('id', 1)
            .single();
          const attrs = data && data.atributos
            ? (typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos)
            : {};
          if (!attrs._sys_pavor_slots) attrs._sys_pavor_slots = {};
          attrs._sys_pavor_slots[p.slot || slotNum] = Boolean(p.dadoDePavor);
          await this.supabase
            .from('personagens')
            .update({ atributos: attrs })
            .eq('id', 1);
        } catch (e) {
          console.warn("[PAVOR] Erro ao persistir estado no Supabase:", e);
        }
      })();
    }
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

        slotEl.classList.toggle('has-pavor', Boolean(p.dadoDePavor));
        slotEl.innerHTML = `
          <div class="player-avatar-placeholder">${avatarContent}</div>
          ${p.dadoDePavor ? `<div class="slot-pavor-badge" title="Dado de Pavor Ativo">PAVOR</div>` : ''}
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

    const vidEl = document.getElementById('ficha-vidrilhos-val');
    const vidInvEl = document.getElementById('ficha-inv-vidrilhos-val');
    const vidVal = player.vidrilhos != null ? player.vidrilhos : 0;
    if (vidEl) vidEl.textContent = `${vidVal}`;
    if (vidInvEl) vidInvEl.textContent = `${vidVal}`;

    const totEl = document.getElementById('ficha-totens-val');
    const totInvEl = document.getElementById('ficha-inv-totens-val');
    const totVal = player.totens != null ? player.totens : 0;
    if (totEl) totEl.textContent = `${totVal}`;
    if (totInvEl) totInvEl.textContent = `${totVal}`;

    const isMaster = Boolean(this.state && this.state.isMaster);
    const fichaPavorBtn = document.querySelector('.ficha-pavor-toggle-btn');
    if (fichaPavorBtn) {
      if (isMaster) {
        fichaPavorBtn.style.display = 'inline-flex';
        fichaPavorBtn.style.cursor = 'pointer';
        fichaPavorBtn.style.pointerEvents = 'auto';
        fichaPavorBtn.classList.toggle('active', Boolean(player.dadoDePavor));
        const span = fichaPavorBtn.querySelector('span');
        if (span) {
          span.textContent = player.dadoDePavor ? 'Dado de Pavor Ativo' : 'Ativar Pavor';
        }
      } else {
        fichaPavorBtn.style.display = player.dadoDePavor ? 'inline-flex' : 'none';
        fichaPavorBtn.style.cursor = 'default';
        fichaPavorBtn.style.pointerEvents = 'none';
        fichaPavorBtn.classList.toggle('active', Boolean(player.dadoDePavor));
        const span = fichaPavorBtn.querySelector('span');
        if (span) {
          span.textContent = 'Dado de Pavor Ativo';
        }
      }
    }

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

    // 3. Salva no cache local imediato
    try {
      const cacheStr = localStorage.getItem('wu_mesa_vitals_cache');
      const cache = cacheStr ? JSON.parse(cacheStr) : {};
      cache[player.slot] = {
        ...(cache[player.slot] || {}),
        hp: player.hp,
        hpMax: player.hpMax,
        pe: player.pe,
        peMax: player.peMax,
        st: player.st,
        stMax: player.stMax,
        stressPoints: player.stressPoints,
        stressPointsMax: player.stressPointsMax,
        vidrilhos: player.vidrilhos,
        totens: player.totens != null ? player.totens : 0
      };
      localStorage.setItem('wu_mesa_vitals_cache', JSON.stringify(cache));
    } catch(e) {}

    // 4. Sincroniza persistentemente com o Supabase (para todos os jogadores)
    if (this.supabase) {
      (async () => {
        try {
          // Se for linha direta existente no banco (ex: id 1 ou id 3), atualiza colunas nativas
          if (player.id && (player.id === 1 || player.id === 3)) {
            await this.supabase
              .from('personagens')
              .update(patchData)
              .eq('id', player.id);
          }

          // Persiste os status de todos os 8 slots no registro compartilhado de id: 1
          const { data } = await this.supabase
            .from('personagens')
            .select('atributos')
            .eq('id', 1)
            .single();
          const currentAttrs = data && data.atributos
            ? (typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos)
            : {};
          if (!currentAttrs._sys_players_vitals) currentAttrs._sys_players_vitals = {};
          currentAttrs._sys_players_vitals[player.slot] = {
            ...(currentAttrs._sys_players_vitals[player.slot] || {}),
            hp: player.hp,
            hpMax: player.hpMax,
            pe: player.pe,
            peMax: player.peMax,
            st: player.st,
            stMax: player.stMax,
            stressPoints: player.stressPoints,
            stressPointsMax: player.stressPointsMax,
            vidrilhos: player.vidrilhos,
            totens: player.totens != null ? player.totens : 0
          };
          await this.supabase
            .from('personagens')
            .update({ atributos: currentAttrs })
            .eq('id', 1);
        } catch(err) {
          console.error("Erro ao salvar status no Supabase:", err);
        }
      })();
    }
  },

  /** Persists a numeric character counter (vidrilhos or totens) to local cache, character row, and shared slot vitals. */
  async savePlayerCounter(slot, field, value) {
    const player = this.state.players[slot - 1];
    if (!player || !this.supabase) return;

    try {
      // 1. Atualiza no cache local imediatamente
      try {
        const cacheStr = localStorage.getItem('wu_mesa_vitals_cache');
        const cache = cacheStr ? JSON.parse(cacheStr) : {};
        if (!cache[slot]) cache[slot] = {};
        cache[slot][field] = value;
        localStorage.setItem('wu_mesa_vitals_cache', JSON.stringify(cache));
      } catch(e) {}

      // 2. Se for linha propria no banco (id 1 ou id 3), atualiza
      if (player.id && (player.id === 1 || player.id === 3)) {
        const { data } = await this.supabase
          .from('personagens')
          .select('atributos')
          .eq('id', player.id)
          .single();

        let currentAttrs = {};
        if (data && data.atributos) {
          currentAttrs = typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos;
        }
        currentAttrs[field] = value;

        await this.supabase
          .from('personagens')
          .update({ atributos: currentAttrs })
          .eq('id', player.id);
      }

      // 3. Persiste para todos os 8 slots no registro compartilhado de id: 1
      const { data: mData } = await this.supabase
        .from('personagens')
        .select('atributos')
        .eq('id', 1)
        .single();
      const mAttrs = mData && mData.atributos
        ? (typeof mData.atributos === 'string' ? JSON.parse(mData.atributos) : mData.atributos)
        : {};
      if (!mAttrs._sys_players_vitals) mAttrs._sys_players_vitals = {};
      if (!mAttrs._sys_players_vitals[slot]) mAttrs._sys_players_vitals[slot] = {};
      mAttrs._sys_players_vitals[slot][field] = value;

      await this.supabase
        .from('personagens')
        .update({ atributos: mAttrs })
        .eq('id', 1);
    } catch(err) {
      console.error(`Erro ao salvar ${field} no Supabase:`, err);
    }
  },

  async savePlayerVidrilhos(slot, vidrilhos) {
    return this.savePlayerCounter(slot, 'vidrilhos', vidrilhos);
  },

  async savePlayerTotens(slot, totens) {
    return this.savePlayerCounter(slot, 'totens', totens);
  },

  async updateVidrilhos(slot, delta) {
    const player = this.state.players[slot - 1];
    if (!player) return;

    const current = (player.vidrilhos != null) ? player.vidrilhos : 25;
    const next = Math.max(0, current + delta);
    player.vidrilhos = next;

    // 1. Atualiza cirurgicamente no DOM
    this.updateVitalsUI(player);
    this.renderMesa();
    if (window.MesaIgrisShop && MesaIgrisShop.isOpen) {
      MesaIgrisShop.updateUserChip();
    }

    // 2. Transmissao WebSocket em tempo real
    if (MesaChat.channel) {
      try {
        MesaChat.channel.send({
          type: 'broadcast',
          event: 'vitals_sync',
          payload: {
            slot: player.slot,
            vidrilhos: player.vidrilhos
          }
        });
      } catch(e) {}
    }

    // 3. Persiste no banco Supabase
    await this.savePlayerVidrilhos(slot, next);
  },

  async promptSetVidrilhos(slot) {
    const isMaster = Boolean(this.state && this.state.isMaster);
    if (!isMaster) return;
    const player = this.state.players[slot - 1];
    if (!player) return;

    const current = (player.vidrilhos != null) ? player.vidrilhos : 25;
    const input = prompt(`Definir saldo exato de Vidrilhos para ${player.nome}:`, current);
    if (input === null) return;
    const val = parseInt(input.trim(), 10);
    if (isNaN(val) || val < 0) {
      alert('Por favor, informe um número inteiro válido maior ou igual a zero.');
      return;
    }
    const delta = val - current;
    await this.updateVidrilhos(slot, delta);
  },

  async updateTotens(slot, delta) {
    const player = this.state.players[slot - 1];
    if (!player || !this.canEdit(player)) return;

    const current = (player.totens != null && !isNaN(Number(player.totens))) ? Number(player.totens) : 0;
    const next = Math.max(0, current + delta);
    player.totens = next;

    // 1. Atualiza cirurgicamente no DOM
    this.updateVitalsUI(player);
    this.renderMesa();

    // 2. Transmissao WebSocket em tempo real
    const chan = (window.MesaChat && MesaChat.channel) || this.channel;
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'vitals_sync',
          payload: {
            slot: player.slot,
            totens: player.totens
          }
        });
      } catch(e) {}
    }

    // 3. Persiste no banco Supabase
    await this.savePlayerTotens(slot, next);
  },

  async promptSetTotens(slot) {
    const player = this.state.players[slot - 1];
    if (!player || !this.canEdit(player)) return;

    const current = (player.totens != null && !isNaN(Number(player.totens))) ? Number(player.totens) : 0;
    const input = prompt(`Definir quantidade de Totens do Conclave para ${player.nome}:`, current);
    if (input === null) return;
    const val = parseInt(input.trim(), 10);
    if (isNaN(val) || val < 0) {
      alert('Por favor, informe um número inteiro válido maior ou igual a zero.');
      return;
    }
    const delta = val - current;
    await this.updateTotens(slot, delta);
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

    // Cache no localStorage
    try {
      const cacheStr = localStorage.getItem('wu_mesa_vitals_cache');
      const cache = cacheStr ? JSON.parse(cacheStr) : {};
      cache[player.slot] = {
        ...(cache[player.slot] || {}),
        hp: player.hp,
        hpMax: player.hpMax,
        pe: player.pe,
        peMax: player.peMax,
        st: player.st,
        stMax: player.stMax,
        stressPoints: player.stressPoints,
        stressPointsMax: player.stressPointsMax,
        ...(data.vidrilhos !== undefined ? { vidrilhos: data.vidrilhos } : {}),
        ...(data.totens !== undefined ? { totens: data.totens } : {})
      };
      localStorage.setItem('wu_mesa_vitals_cache', JSON.stringify(cache));
    } catch(e) {}

    if (data.vidrilhos !== undefined) {
      player.vidrilhos = data.vidrilhos;
      if (window.MesaIgrisShop && MesaIgrisShop.isOpen) {
        MesaIgrisShop.updateUserChip();
      }
    }

    if (data.totens !== undefined) {
      player.totens = Math.max(0, Number(data.totens) || 0);
    }

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
    let habs = normalizeFiosDoMedoHabilidades(player.habilidades || []);
    let bonusList = player.bonus && player.bonus.length > 0 ? player.bonus : [
      { origem: `Raça (${player.raca || 'Vampiro'})`, desc: '+d4 em Mente' },
      { origem: `Arquétipo (${player.arquetipo || 'Curioso'})`, desc: '+d4 em Mente' }
    ];

    // Atributos limpos (ignora metadados e namespaces internos como _wuitter e os contadores vidrilhos/totens)
    let validKeys = Object.keys(rawAttrs).filter(k => !k.startsWith('_') && !k.startsWith('$') && k !== 'vidrilhos' && k !== 'totens' && typeof rawAttrs[k] !== 'object');
    if (validKeys.length === 0) {
      const fallbackMap = {
        1: { 'Saúde': 'd12', 'Vigor': 'd16', 'Força': 'd4', 'Mente': 'd8' },
        2: { 'Saúde': 'd8', 'Vigor': 'd12', 'Força': 'd4', 'Mente': 'd16' },
        3: { 'Mente': 'd16', 'Saúde': 'd8', 'Vigor': 'd12', 'Força': 'd4' },
        4: { 'Mente': 'd4', 'Saúde': 'd8', 'Vigor': 'd12', 'Força': 'd16' },
        5: { 'Saúde': 'd4', 'Vigor': 'd16', 'Força': 'd12', 'Mente': 'd8' },
        6: { 'Força': 'd16', 'Mente': 'd12', 'Saúde': 'd8', 'Vigor': 'd4' },
        7: { 'Força': 'd16', 'Mente': 'd12', 'Saúde': 'd8', 'Vigor': 'd4' },
        8: { 'Vigor': 'd12', 'Saúde': 'd8', 'Força': 'd4', 'Mente': 'd16' }
      };
      const defaults = fallbackMap[player.slot] || { 'Saúde': 'd12', 'Vigor': 'd16', 'Força': 'd4', 'Mente': 'd8' };
      player.atributos = { ...defaults, ...rawAttrs };
      rawAttrs = player.atributos;
      validKeys = Object.keys(rawAttrs).filter(k => !k.startsWith('_') && !k.startsWith('$') && k !== 'vidrilhos' && k !== 'totens' && typeof rawAttrs[k] !== 'object');
    }
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
            ${isMaster ? `
              <button type="button" class="ficha-pavor-toggle-btn ${player.dadoDePavor ? 'active' : ''}" onclick="MesaApp.toggleDadoDePavor(${player.slot})" title="Alternar Dado de Pavor">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/></svg>
                <span>${player.dadoDePavor ? 'Dado de Pavor Ativo' : 'Ativar Pavor'}</span>
              </button>
            ` : (player.dadoDePavor ? `
              <span class="ficha-pavor-toggle-btn active" style="cursor: default; pointer-events: none;" title="Dado de Pavor ativo pelo Mestre">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><path d="M16 8h.01"/><path d="M8 8h.01"/><path d="M8 16h.01"/><path d="M16 16h.01"/><path d="M12 12h.01"/></svg>
                <span>Dado de Pavor Ativo</span>
              </span>
            ` : '')}
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

          <div class="vital-stat-block vital-stat-vidrilhos">
            <span class="vital-stat-tag vidrilhos-tag"><img src="assets/vidrilhos.png" class="vidrilhos-icon" alt="" /> VIDRILHOS</span>
            <span id="ficha-vidrilhos-val" class="vital-stat-val">${player.vidrilhos != null ? player.vidrilhos : 0}</span>
            ${isMaster ? `
              <button class="stat-edit-btn" onclick="MesaApp.updateVidrilhos(${player.slot}, -1)" title="Diminuir Vidrilhos">-</button>
              <button class="stat-edit-btn" onclick="MesaApp.updateVidrilhos(${player.slot}, +1)" title="Aumentar Vidrilhos">+</button>
              <button class="stat-edit-btn" onclick="MesaApp.promptSetVidrilhos(${player.slot})" title="Definir Valor Exato">&#9998;</button>
            ` : ''}
          </div>

          <div class="vital-stat-block vital-stat-totens">
            <span class="vital-stat-tag totens-tag">${CONCLAVE_TOTEM_SVG} TOTENS</span>
            <span id="ficha-totens-val" class="vital-stat-val">${player.totens != null ? player.totens : 0}</span>
            ${editable ? `
              <button class="stat-edit-btn" onclick="MesaApp.updateTotens(${player.slot}, -1)" title="Diminuir Totens">-</button>
              <button class="stat-edit-btn" onclick="MesaApp.updateTotens(${player.slot}, +1)" title="Aumentar Totens">+</button>
              <button class="stat-edit-btn" onclick="MesaApp.promptSetTotens(${player.slot})" title="Definir Valor Exato de Totens">&#9998;</button>
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
          <div class="ink-ribbon-title ficha-coletaveis-title" style="background: #d97706; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 8px; transform: none !important; clip-path: none !important; width: 100%; box-sizing: border-box; border-radius: 0;">
            <div style="display: flex; flex-wrap: wrap; align-items: center; gap: 8px;">
              <span>ITENS E COLETÁVEIS EM POSSE</span>
              <span class="ficha-inventory-vidrilhos-pill" title="Saldo de Vidrilhos"><img src="assets/vidrilhos.png" class="vidrilhos-icon" alt="" /> <strong id="ficha-inv-vidrilhos-val">${player.vidrilhos != null ? player.vidrilhos : 0}</strong> Vidrilhos</span>
              <span class="ficha-inventory-totens-pill" title="Totens do Conclave">
                ${CONCLAVE_TOTEM_SVG}
                <span>Totens: <strong id="ficha-inv-totens-val">${player.totens != null ? player.totens : 0}</strong></span>
                ${editable ? `
                  <span class="totens-inline-controls">
                    <button type="button" class="totens-mini-btn" onclick="MesaApp.updateTotens(${player.slot}, -1)" title="Diminuir Totem">-</button>
                    <button type="button" class="totens-mini-btn" onclick="MesaApp.updateTotens(${player.slot}, +1)" title="Aumentar Totem">+</button>
                    <button type="button" class="totens-mini-btn" onclick="MesaApp.promptSetTotens(${player.slot})" title="Editar Totens">&#9998;</button>
                  </span>
                ` : ''}
              </span>
            </div>
            ${isMaster ? `
              <div style="display: flex; align-items: center; gap: 6px;">
                <button type="button" class="ficha-open-catalog-btn" onclick="MesaApp.promptSetVidrilhos(${player.slot})" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.3); color: #fbbf24; font-size: 0.72rem; padding: 2px 8px; cursor: pointer; border-radius: 2px;">Editar Vidrilhos</button>
                <button type="button" class="ficha-open-catalog-btn" onclick="MesaColetaveis.openModal()" style="background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.3); color: #fff; font-size: 0.72rem; padding: 2px 8px; cursor: pointer; border-radius: 2px;">Catálogo Geral (Mestre) &rarr;</button>
              </div>
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

    // Fecha a paleta ao clicar fora (sem propagar erro ou fechar imediatamente)
    document.addEventListener('click', (e) => {
      const picker = document.getElementById('mesa-reaction-picker');
      const btn = document.getElementById('nav-reaction-btn');
      if (picker && this.isPickerOpen) {
        if (picker.contains(e.target)) return;
        if (btn && btn.contains(e.target)) return;
        if (e.target.closest && (e.target.closest('#nav-reaction-btn') || e.target.closest('.quick-menu-item') || e.target.closest('.mobile-menu-item') || e.target.closest('.combat-menu-item'))) return;
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
      btn.onclick = (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        this.sendReaction(key);
      };
      grid.appendChild(btn);
    });
  },

  togglePicker(e) {
    if (e && e.stopPropagation) {
      e.stopPropagation();
    }

    if (!MesaApp.state.myToken && !MesaApp.state.isMaster) {
      alert("Observadores não podem usar reações de emojis. Conecte seu token de personagem para reagir na mesa!");
      MesaApp.openTokenModal();
      return;
    }

    this.isPickerOpen = !this.isPickerOpen;
    const picker = document.getElementById('mesa-reaction-picker');
    const btn = document.getElementById('nav-reaction-btn');
    if (picker) {
      picker.classList.toggle('active', this.isPickerOpen);
    }
    if (btn) {
      btn.classList.toggle('active', this.isPickerOpen);
    }
  },

  closePicker() {
    this.isPickerOpen = false;
    const picker = document.getElementById('mesa-reaction-picker');
    const btn = document.getElementById('nav-reaction-btn');
    if (picker) picker.classList.remove('active');
    if (btn) btn.classList.remove('active');
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
    bubble.style.zIndex = '2500';
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


// ---- 5B. MOTOR 3D VOLUMÉTRICO REAL PARA DADOS POLIÉDRICOS (CANVAS 3D) ----
const Mesa3DDice = {
  _solidsCache: {},
  _instances: new Map(),
  _rafId: null,

  _vecNorm(v) {
    const l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  },
  _vecSub(a, b) { return [a[0] - b[0], a[1] - b[1], a[2] - b[2]]; },
  _vecAdd(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; },
  _vecScale(v, s) { return [v[0] * s, v[1] * s, v[2] * s]; },
  _vecDot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; },
  _vecCross(a, b) {
    return [
      a[1] * b[2] - a[2] * b[1],
      a[2] * b[0] - a[0] * b[2],
      a[0] * b[1] - a[1] * b[0]
    ];
  },
  _distPointToSeg(p, a, b) {
    const ab = this._vecSub(b, a);
    const ap = this._vecSub(p, a);
    const t = Math.max(0, Math.min(1, this._vecDot(ap, ab) / (this._vecDot(ab, ab) || 1)));
    const closest = this._vecAdd(a, this._vecScale(ab, t));
    const d = this._vecSub(p, closest);
    return Math.hypot(d[0], d[1], d[2]);
  },

  _finalizeSolid(vertsIn, facesRaw, opts = {}) {
    let nScale;
    if (opts.preservePlanarScale) {
      const m = Math.max(...vertsIn.map(v => Math.hypot(v[0], v[1], v[2]))) || 1;
      nScale = vertsIn.map(v => this._vecScale(v, 1 / m));
    } else {
      nScale = vertsIn.map(v => this._vecNorm(v));
    }

    const f0 = facesRaw[0];
    let n0 = this._vecNorm(this._vecCross(
      this._vecSub(nScale[f0[1]], nScale[f0[0]]),
      this._vecSub(nScale[f0[2]], nScale[f0[0]])
    ));
    const c0 = f0.reduce((a, i) => this._vecAdd(a, nScale[i]), [0, 0, 0]).map(x => x / f0.length);
    if (this._vecDot(n0, c0) < 0) n0 = this._vecScale(n0, -1);

    let upHint = Math.abs(n0[1]) < 0.9 ? [0, 1, 0] : [0, 0, -1];
    if (opts.upFromEdgeMidpoint && f0.length === 3) {
      upHint = this._vecSub(nScale[f0[0]], this._vecScale(this._vecAdd(nScale[f0[1]], nScale[f0[2]]), 0.5));
    } else if (opts.kiteApexIndex !== undefined) {
      upHint = this._vecSub(nScale[f0[opts.kiteApexIndex]], c0);
    }

    let v0 = this._vecNorm(this._vecSub(upHint, this._vecScale(n0, this._vecDot(upHint, n0))));
    const u0 = this._vecNorm(this._vecCross(v0, n0));
    v0 = this._vecNorm(this._vecCross(n0, u0));

    const verts = nScale.map(p => [this._vecDot(p, u0), this._vecDot(p, v0), this._vecDot(p, n0)]);
    const faces = facesRaw.map((rawF, fi) => {
      const cAvg = rawF.reduce((a, i) => this._vecAdd(a, verts[i]), [0, 0, 0]).map(x => x / rawF.length);
      let n = this._vecNorm(this._vecCross(
        this._vecSub(verts[rawF[1]], verts[rawF[0]]),
        this._vecSub(verts[rawF[2]], verts[rawF[0]])
      ));
      const indices = this._vecDot(n, cAvg) >= 0 ? [...rawF] : [...rawF].reverse();
      n = this._vecNorm(this._vecCross(
        this._vecSub(verts[indices[1]], verts[indices[0]]),
        this._vecSub(verts[indices[2]], verts[indices[0]])
      ));

      let center = cAvg;
      if (opts.kiteWeight && indices.length === 4) {
        const d02 = Math.hypot(...this._vecSub(verts[indices[0]], verts[indices[2]]));
        const d13 = Math.hypot(...this._vecSub(verts[indices[1]], verts[indices[3]]));
        center = d02 > d13
          ? this._vecAdd(
              this._vecAdd(this._vecScale(verts[indices[0]], 0.2), this._vecScale(verts[indices[2]], 0.2)),
              this._vecAdd(this._vecScale(verts[indices[1]], 0.3), this._vecScale(verts[indices[3]], 0.3))
            )
          : this._vecAdd(
              this._vecAdd(this._vecScale(verts[indices[1]], 0.2), this._vecScale(verts[indices[3]], 0.2)),
              this._vecAdd(this._vecScale(verts[indices[0]], 0.3), this._vecScale(verts[indices[2]], 0.3))
            );
      }

      let inradius = Infinity;
      for (let i = 0; i < indices.length; i++) {
        inradius = Math.min(inradius, this._distPointToSeg(center, verts[indices[i]], verts[indices[(i + 1) % indices.length]]));
      }

      const ref = fi === 0 ? [0, -1, 0] : (Math.abs(n[1]) < 0.9 ? [0, -1, 0] : [0, 0, -1]);
      const fv = this._vecNorm(this._vecSub(ref, this._vecScale(n, this._vecDot(ref, n))));
      const fu = this._vecNorm(this._vecCross(n, fv));
      return { indices, center, normal: n, uAxis: fu, vAxis: fv, inradius };
    });

    return { verts, faces, endTilt: opts.endTilt || { rx: -0.16, ry: 0.22 } };
  },

  _buildTrapezohedron(n, endTilt) {
    const H = 1.05;
    const r = 0.92;
    const cHalf = Math.cos(Math.PI / n);
    const yRing = H * (1 - cHalf) / (1 + cHalf);
    const verts = [[0, H, 0], [0, -H, 0]];
    for (let k = 0; k < n; k++) {
      const a = (2 * Math.PI * k) / n;
      verts.push([r * Math.cos(a), yRing, r * Math.sin(a)]);
    }
    for (let k = 0; k < n; k++) {
      const a = (2 * Math.PI * k) / n + Math.PI / n;
      verts.push([r * Math.cos(a), -yRing, r * Math.sin(a)]);
    }
    const faces = [];
    for (let k = 0; k < n; k++) {
      const u0 = 2 + k;
      const u1 = 2 + ((k + 1) % n);
      const l0 = 2 + n + k;
      const lPrev = 2 + n + ((k - 1 + n) % n);
      faces.push([0, u1, l0, u0]);
      faces.push([1, lPrev, u0, l0]);
    }
    return this._finalizeSolid(verts, faces, {
      preservePlanarScale: true,
      kiteApexIndex: 0,
      kiteWeight: true,
      endTilt
    });
  },

  getSolid(sides) {
    const s = Number(sides) || 20;
    const key = [4, 6, 8, 10, 12, 16, 20].includes(s) ? s : (s === 100 ? 10 : 20);
    if (this._solidsCache[key]) return this._solidsCache[key];

    let solid;
    if (key === 4) {
      solid = this._finalizeSolid(
        [[1, 1, 1], [1, -1, -1], [-1, 1, -1], [-1, -1, 1]],
        [[0, 1, 2], [0, 3, 1], [0, 2, 3], [1, 3, 2]],
        { upFromEdgeMidpoint: true, endTilt: { rx: -0.22, ry: 0.52 } }
      );
    } else if (key === 6) {
      solid = this._finalizeSolid(
        [[-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1], [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1]],
        [[0, 1, 2, 3], [5, 4, 7, 6], [1, 5, 6, 2], [4, 0, 3, 7], [3, 2, 6, 7], [4, 5, 1, 0]],
        { preservePlanarScale: true, endTilt: { rx: -0.20, ry: 0.24 } }
      );
    } else if (key === 8) {
      solid = this._finalizeSolid(
        [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]],
        [[2, 0, 4], [2, 4, 1], [3, 1, 4], [3, 4, 0], [2, 5, 0], [2, 1, 5], [3, 5, 1], [3, 0, 5]],
        { upFromEdgeMidpoint: true, endTilt: { rx: -0.18, ry: 0.22 } }
      );
    } else if (key === 10) {
      solid = this._buildTrapezohedron(5, { rx: -0.16, ry: 0.22 });
    } else if (key === 16) {
      solid = this._buildTrapezohedron(8, { rx: -0.16, ry: 0.22 });
    } else {
      const phi = (1 + Math.sqrt(5)) / 2;
      const icoVerts = [
        [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
        [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
        [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
      ];
      const icoFaces = [
        [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
        [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
        [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
        [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]
      ];
      if (key === 12) {
        const dodecaVerts = icoFaces.map(f => this._vecNorm(
          this._vecAdd(this._vecAdd(icoVerts[f[0]], icoVerts[f[1]]), icoVerts[f[2]])
        ));
        const dodecaFaces = icoVerts.map((v, vi) => {
          const vn = this._vecNorm(v);
          const ring = [];
          icoFaces.forEach((f, fi) => { if (f.includes(vi)) ring.push(fi); });
          const refUp = Math.abs(vn[1]) < 0.9 ? [0, 1, 0] : [0, 0, -1];
          const ux = this._vecNorm(this._vecCross(refUp, vn));
          const vy = this._vecNorm(this._vecCross(vn, ux));
          ring.sort((a, b) =>
            Math.atan2(this._vecDot(dodecaVerts[a], vy), this._vecDot(dodecaVerts[a], ux)) -
            Math.atan2(this._vecDot(dodecaVerts[b], vy), this._vecDot(dodecaVerts[b], ux))
          );
          return ring;
        });
        solid = this._finalizeSolid(dodecaVerts, dodecaFaces, {
          preservePlanarScale: true,
          endTilt: { rx: -0.16, ry: 0.22 }
        });
      } else {
        solid = this._finalizeSolid(icoVerts, icoFaces, {
          upFromEdgeMidpoint: true,
          endTilt: { rx: -0.16, ry: 0.22 }
        });
      }
    }

    this._solidsCache[key] = solid;
    return solid;
  },

  _buildFaceLabels(sides, faceCount, targetVal) {
    const s = Number(sides) || 20;
    const labels = new Array(faceCount);
    const valStr = String(targetVal ?? '?');
    labels[0] = valStr;

    let pool = [];
    if (s === 100) {
      pool = ['00', '10', '20', '30', '40', '50', '60', '70', '80', '90'].filter(x => x !== valStr);
    } else if (s <= faceCount) {
      const targetNum = Number(targetVal);
      for (let i = 1; i <= s; i++) {
        if (i !== targetNum) pool.push(String(i));
      }
    } else {
      for (let i = 1; i < faceCount; i++) {
        pool.push(String(((i * 7) % s) + 1));
      }
    }

    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = pool[i];
      pool[i] = pool[j];
      pool[j] = tmp;
    }

    for (let i = 1; i < faceCount; i++) {
      labels[i] = pool[(i - 1) % pool.length] || String(i);
    }
    return labels;
  },

  _rotateVec(p, cx, sx, cy, sy, cz, sz) {
    const x0 = p[0], y0 = p[1], z0 = p[2];
    const y1 = y0 * cx - z0 * sx;
    const z1 = y0 * sx + z0 * cx;
    const x2 = x0 * cy + z1 * sy;
    const z2 = -x0 * sy + z1 * cy;
    const x3 = x2 * cz - y1 * sz;
    const y3 = x2 * sz + y1 * cz;
    return [x3, y3, z2];
  },

  _resolvePalette(theme, isShaking) {
    if (theme === 'pavor') {
      return {
        isGothicPavor: true,
        baseRgb: [6, 2, 4],
        litRgb: [36, 7, 15],
        specRgb: [215, 185, 190],
        stroke: '#6b081b',
        strokeLit: '#b81d38',
        innerHighlight: 'rgba(225, 205, 198, 0.24)',
        gothicBevel: 'rgba(218, 196, 188, 0.34)',
        halo: 'rgba(130, 8, 30, 0.52)',
        text: '#efe5dc'
      };
    }
    if (theme === 'esconderijo') {
      return {
        baseRgb: [22, 2, 7],
        litRgb: [112, 10, 30],
        specRgb: [255, 138, 158],
        stroke: isShaking ? '#ffffff' : '#ff1133',
        strokeLit: isShaking ? '#ffffff' : '#ff6b85',
        innerHighlight: 'rgba(255, 120, 145, 0.16)',
        halo: 'rgba(255, 17, 51, 0.36)',
        text: '#ffffff'
      };
    }
    if (theme === 'crit-max') {
      return {
        baseRgb: [36, 24, 4],
        litRgb: [128, 90, 14],
        specRgb: [255, 244, 178],
        stroke: '#ffcc55',
        strokeLit: '#fff0a8',
        innerHighlight: 'rgba(255, 235, 150, 0.22)',
        halo: 'rgba(255, 204, 85, 0.42)',
        text: '#fff5cc'
      };
    }
    if (theme === 'crit-min') {
      return {
        baseRgb: [32, 3, 8],
        litRgb: [104, 8, 24],
        specRgb: [255, 140, 155],
        stroke: '#ff2244',
        strokeLit: '#ff7085',
        innerHighlight: 'rgba(255, 130, 150, 0.16)',
        halo: 'rgba(255, 34, 68, 0.38)',
        text: '#ffe0e5'
      };
    }
    return {
      baseRgb: [20, 7, 2],
      litRgb: [96, 35, 10],
      specRgb: [255, 182, 106],
      stroke: '#ff6614',
      strokeLit: '#ffaa58',
      innerHighlight: 'rgba(255, 195, 135, 0.14)',
      halo: 'rgba(255, 85, 0, 0.32)',
      text: '#ffffff'
    };
  },

  _renderDie(inst, rx, ry, rz, bounceScale = 1) {
    const { canvas, solid, labels, theme } = inst;
    if (!canvas || !canvas.isConnected) return;

    const logicalSize = Number(inst.size) || 106;
    const dpr = Math.min(2.5, Math.max(1.5, window.devicePixelRatio || 1));
    const pxSize = Math.round(logicalSize * dpr);
    if (canvas.width !== pxSize || canvas.height !== pxSize) {
      canvas.width = pxSize;
      canvas.height = pxSize;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, logicalSize, logicalSize);

    const box = canvas.closest('.dice-tumble-box');
    const isShaking = Boolean(box && box.classList.contains('shaking'));
    const pal = this._resolvePalette(theme, isShaking);

    const cx = Math.cos(rx), sx = Math.sin(rx);
    const cy = Math.cos(ry), sy = Math.sin(ry);
    const cz = Math.cos(rz), sz = Math.sin(rz);

    const half = logicalSize / 2;
    const focal = 4.2;
    const baseRadius = logicalSize * 0.355 * bounceScale;

    // Subtle soft radial halo behind the 3D solid (or gothic occult halo for Dado de Pavor)
    const haloGrad = ctx.createRadialGradient(half, half, 4, half, half, logicalSize * 0.47);
    haloGrad.addColorStop(0, pal.halo);
    haloGrad.addColorStop(0.62, pal.isGothicPavor ? 'rgba(30, 0, 8, 0.5)' : 'rgba(0,0,0,0)');
    haloGrad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(half, half, logicalSize * 0.47, 0, Math.PI * 2);
    ctx.fill();

    if (pal.isGothicPavor) {
      const auraAngle = (rx * 0.14 + ry * 0.22);
      ctx.save();
      ctx.translate(half, half);
      ctx.rotate(auraAngle);
      // 8 thorny gothic iron spires + occult ritual circle behind the die
      ctx.strokeStyle = 'rgba(165, 22, 48, 0.62)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.arc(0, 0, logicalSize * 0.415, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(220, 198, 190, 0.28)';
      ctx.setLineDash([3, 4]);
      ctx.beginPath();
      ctx.arc(0, 0, logicalSize * 0.365, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      for (let sp = 0; sp < 8; sp++) {
        const ang = (sp * Math.PI) / 4;
        const innerR = logicalSize * 0.35;
        const outerR = sp % 2 === 0 ? logicalSize * 0.475 : logicalSize * 0.425;
        ctx.save();
        ctx.rotate(ang);
        ctx.beginPath();
        ctx.moveTo(0, -outerR);
        ctx.lineTo(2.4, -innerR);
        ctx.lineTo(-2.4, -innerR);
        ctx.closePath();
        ctx.fillStyle = sp % 2 === 0 ? 'rgba(130, 10, 30, 0.85)' : 'rgba(60, 4, 15, 0.85)';
        ctx.fill();
        ctx.strokeStyle = 'rgba(225, 200, 190, 0.35)';
        ctx.lineWidth = 0.7;
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }

    const frac = (inst.fracture && inst.fracture.active) ? inst.fracture : null;
    const fracP = frac ? frac.progress : 0;

    let jitterX = 0, jitterY = 0;
    if (fracP > 0) {
      jitterX = (Math.random() - 0.5) * 6.5 * fracP;
      jitterY = (Math.random() - 0.5) * 6.5 * fracP;
    }

    const rotVerts = solid.verts.map(v => this._rotateVec(v, cx, sx, cy, sy, cz, sz));
    const projVerts = rotVerts.map(p => {
      const s = focal / (focal - p[2]);
      return { x: half + p[0] * baseRadius * s + jitterX, y: half - p[1] * baseRadius * s + jitterY };
    });

    const lightMain = [-0.42, 0.56, 0.71];
    const halfVec = this._vecNorm([lightMain[0], lightMain[1], lightMain[2] + 1]);

    const visibleFaces = [];
    for (let fi = 0; fi < solid.faces.length; fi++) {
      const f = solid.faces[fi];
      const rn = this._rotateVec(f.normal, cx, sx, cy, sy, cz, sz);
      if (rn[2] <= 0.01) continue;
      let zAvg = 0;
      for (let k = 0; k < f.indices.length; k++) zAvg += rotVerts[f.indices[k]][2];
      zAvg /= f.indices.length;
      visibleFaces.push({ fi, f, rn, zAvg });
    }
    visibleFaces.sort((a, b) => a.zAvg - b.zAvg);

    const GLYPH_REF = 22;

    for (let vi = 0; vi < visibleFaces.length; vi++) {
      const { fi, f, rn } = visibleFaces[vi];
      const faceDisplace = fracP * 0.088;
      const pts = f.indices.map(idx => {
        if (faceDisplace > 0.001) {
          const v = rotVerts[idx];
          const vOut = [v[0] + rn[0] * faceDisplace, v[1] + rn[1] * faceDisplace, v[2] + rn[2] * faceDisplace];
          const s = focal / (focal - vOut[2]);
          return { x: half + vOut[0] * baseRadius * s + jitterX, y: half - vOut[1] * baseRadius * s + jitterY };
        }
        return projVerts[idx];
      });
      visibleFaces[vi].pts = pts;

      const diff = Math.max(0, this._vecDot(rn, lightMain));
      const spec = Math.pow(Math.max(0, this._vecDot(rn, halfVec)), 18) * 0.42;
      const frontBoost = fi === 0 && inst.settled ? 0.14 : 0;
      const mix = Math.min(1, 0.14 + diff * 0.82 + frontBoost);

      const r = Math.min(255, Math.round(pal.baseRgb[0] + (pal.litRgb[0] - pal.baseRgb[0]) * mix + pal.specRgb[0] * spec));
      const g = Math.min(255, Math.round(pal.baseRgb[1] + (pal.litRgb[1] - pal.baseRgb[1]) * mix + pal.specRgb[1] * spec));
      const b = Math.min(255, Math.round(pal.baseRgb[2] + (pal.litRgb[2] - pal.baseRgb[2]) * mix + pal.specRgb[2] * spec));

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let p = 1; p < pts.length; p++) ctx.lineTo(pts[p].x, pts[p].y);
      ctx.closePath();

      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fill();

      // Subtle inner specular highlight along upper bevel
      if (diff > 0.35 || (fi === 0 && inst.settled)) {
        ctx.save();
        ctx.strokeStyle = pal.innerHighlight;
        ctx.lineWidth = 2.6;
        ctx.clip();
        ctx.stroke();
        ctx.restore();
      }

      ctx.strokeStyle = diff > 0.6 ? pal.strokeLit : pal.stroke;
      ctx.lineWidth = (fi === 0 && inst.settled) ? 2.0 : 1.5;
      ctx.lineJoin = 'round';
      ctx.stroke();

      // Moldura gótica chanfrada nas faces do Dado de Pavor
      if (pal.isGothicPavor && pts.length >= 3) {
        let fcx = 0, fcy = 0;
        for (let p = 0; p < pts.length; p++) { fcx += pts[p].x; fcy += pts[p].y; }
        fcx /= pts.length;
        fcy /= pts.length;
        const inset = 0.78;
        ctx.save();
        ctx.beginPath();
        for (let p = 0; p < pts.length; p++) {
          const ix = fcx + (pts[p].x - fcx) * inset;
          const iy = fcy + (pts[p].y - fcy) * inset;
          if (p === 0) ctx.moveTo(ix, iy);
          else ctx.lineTo(ix, iy);
        }
        ctx.closePath();
        ctx.strokeStyle = (fi === 0 && inst.settled) ? 'rgba(230, 212, 204, 0.46)' : pal.gothicBevel;
        ctx.lineWidth = 0.9;
        ctx.stroke();

        ctx.beginPath();
        for (let p = 0; p < pts.length; p++) {
          const ix = fcx + (pts[p].x - fcx) * inset;
          const iy = fcy + (pts[p].y - fcy) * inset;
          ctx.moveTo(pts[p].x, pts[p].y);
          ctx.lineTo(ix, iy);
        }
        ctx.strokeStyle = 'rgba(184, 29, 56, 0.45)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
        ctx.restore();
      }

      // Project affine tangent frame to render face number locked onto the 3D facet
      if (rn[2] > 0.08) {
        const rc = this._rotateVec(f.center, cx, sx, cy, sy, cz, sz);
        const ru = this._rotateVec(f.uAxis, cx, sx, cy, sy, cz, sz);
        const rv = this._rotateVec(f.vAxis, cx, sx, cy, sy, cz, sz);
        const glyphHalf = f.inradius * 0.78;
        const pC3 = rc;
        const pU3 = this._vecAdd(rc, this._vecScale(ru, glyphHalf));
        const pV3 = this._vecAdd(rc, this._vecScale(rv, glyphHalf));

        const sC = focal / (focal - pC3[2]);
        const sU = focal / (focal - pU3[2]);
        const sV = focal / (focal - pV3[2]);
        const xC = half + pC3[0] * baseRadius * sC + jitterX;
        const yC = half - pC3[1] * baseRadius * sC + jitterY;
        const dux = (half + pU3[0] * baseRadius * sU + jitterX) - xC;
        const duy = (half - pU3[1] * baseRadius * sU + jitterY) - yC;
        const dvx = (half + pV3[0] * baseRadius * sV + jitterX) - xC;
        const dvy = (half - pV3[1] * baseRadius * sV + jitterY) - yC;

        const det = dux * dvy - duy * dvx;
        if (det > 1.5) {
          const txt = String(labels[fi] || '');
          if (txt) {
            const alpha = Math.min(1, Math.max(0.15, (rn[2] - 0.08) / 0.34));
            const fontPx = txt.length >= 3 ? 21 : (txt.length === 2 ? 26 : 31);
            ctx.save();
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let p = 1; p < pts.length; p++) ctx.lineTo(pts[p].x, pts[p].y);
            ctx.closePath();
            ctx.clip();

            ctx.transform(dux / GLYPH_REF, duy / GLYPH_REF, dvx / GLYPH_REF, dvy / GLYPH_REF, xC, yC);
            ctx.globalAlpha = alpha;
            ctx.font = pal.isGothicPavor
              ? `800 ${fontPx}px "Cinzel", "Times New Roman", serif`
              : `900 ${fontPx}px "Courier New", monospace`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.lineJoin = 'round';
            ctx.lineWidth = pal.isGothicPavor ? 4.8 : 4.2;
            ctx.strokeStyle = pal.isGothicPavor ? 'rgba(38, 0, 10, 0.96)' : 'rgba(0, 0, 0, 0.88)';
            ctx.strokeText(txt, 0, 1);
            ctx.fillStyle = pal.text;
            ctx.fillText(txt, 0, 1);

            if (txt === '6' || txt === '9') {
              ctx.fillRect(-7, fontPx * 0.44, 14, 2.4);
            }
            ctx.restore();
          }
        }
      }
    }

    // Se o dado estiver em estado de fratura (Pavor Superado), desenha rachaduras 3D diretamente no poliedro
    if (fracP > 0.02) {
      ctx.save();

      // 1. Rachaduras ao longo das bordas das faces 3D (seams se abrindo)
      ctx.beginPath();
      for (let vi = 0; vi < visibleFaces.length; vi++) {
        const { pts } = visibleFaces[vi];
        if (pts.length < 3) continue;
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let p = 1; p < pts.length; p++) ctx.lineTo(pts[p].x, pts[p].y);
        ctx.closePath();
      }
      ctx.strokeStyle = `rgba(74, 222, 128, ${Math.min(1, 0.45 + fracP * 0.55)})`;
      ctx.lineWidth = 1.6 + fracP * 2.2;
      ctx.shadowColor = '#22c55e';
      ctx.shadowBlur = 8 + fracP * 12;
      ctx.stroke();

      // 2. Fissuras ramificadas diretamente na face frontal (face 0 com o valor 1)
      const frontFace = visibleFaces.find(vf => vf.fi === 0);
      if (frontFace && frontFace.pts.length >= 3) {
        let fcx = 0, fcy = 0;
        for (let p = 0; p < frontFace.pts.length; p++) {
          fcx += frontFace.pts[p].x;
          fcy += frontFace.pts[p].y;
        }
        fcx /= frontFace.pts.length;
        fcy /= frontFace.pts.length;

        const nPts = frontFace.pts.length;
        const pA = frontFace.pts[0];
        const pB = frontFace.pts[Math.floor(nPts / 2)];

        const drawBranch = (x1, y1, x2, y2, seed, maxW, pProg) => {
          if (pProg <= 0.05) return;
          const steps = 6;
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          for (let s = 1; s <= steps; s++) {
            const t = s / steps;
            if (t > pProg) {
              const curX = x1 + (x2 - x1) * pProg;
              const curY = y1 + (y2 - y1) * pProg;
              ctx.lineTo(curX, curY);
              break;
            }
            const jx = Math.sin(s * 7.1 + seed) * (1 - Math.abs(t - 0.5) * 1.5) * 6;
            const jy = Math.cos(s * 8.3 + seed) * (1 - Math.abs(t - 0.5) * 1.5) * 6;
            ctx.lineTo(x1 + (x2 - x1) * t + jx, y1 + (y2 - y1) * t + jy);
          }
          // Camada externa brilhante verde
          ctx.strokeStyle = '#22c55e';
          ctx.lineWidth = maxW;
          ctx.shadowColor = '#4ade80';
          ctx.shadowBlur = 10 + fracP * 10;
          ctx.stroke();
          // Nucleo interno branco incandescente
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = Math.max(1, maxW * 0.35);
          ctx.shadowColor = '#86efac';
          ctx.shadowBlur = 3;
          ctx.stroke();
        };

        // Fissura mestra central cortando a face e o numero 1
        drawBranch(pA.x, pA.y, pB.x, pB.y, 1.3, 3.2 + fracP * 2.2, Math.min(1, 0.25 + fracP * 0.75));

        // Ramificacoes do centro para cada vertice 3D da face
        frontFace.pts.forEach((pt, idx) => {
          const branchSeed = idx * 2.7 + 0.5;
          const branchProg = Math.min(1, 0.15 + fracP * 0.85);
          drawBranch(fcx, fcy, pt.x, pt.y, branchSeed, 2.2 + fracP * 1.6, branchProg);
        });

        // Fissuras secundarias nas faces adjacentes
        if (fracP > 0.15) {
          visibleFaces.filter(vf => vf.fi !== 0).forEach((vf, vfi) => {
            if (vf.pts.length < 3) return;
            let afcx = 0, afcy = 0;
            vf.pts.forEach(p => { afcx += p.x; afcy += p.y; });
            afcx /= vf.pts.length;
            afcy /= vf.pts.length;
            const edgeMid = {
              x: (vf.pts[0].x + vf.pts[1].x) * 0.5,
              y: (vf.pts[0].y + vf.pts[1].y) * 0.5
            };
            drawBranch(edgeMid.x, edgeMid.y, afcx, afcy, vfi * 3.1, 1.8 + fracP * 1.2, Math.min(1, 0.1 + fracP * 0.9));
          });
        }
      }

      // 3. Fagulhas de energia verde espirrando ao redor do dado
      if (frac && frac.sparks) {
        frac.sparks.forEach(sp => {
          const sparkDist = (logicalSize * 0.38) * (0.1 + fracP * 0.9);
          const sx = half + sp.vx * sparkDist;
          const sy = half + sp.vy * sparkDist;
          const alpha = Math.max(0, sp.alpha * (1 - fracP * 0.35));
          ctx.fillStyle = `rgba(134, 239, 172, ${alpha})`;
          ctx.shadowColor = '#22c55e';
          ctx.shadowBlur = 7;
          ctx.beginPath();
          ctx.arc(sx, sy, sp.size * (0.8 + fracP * 0.4), 0, Math.PI * 2);
          ctx.fill();
        });
      }

      ctx.restore();
    }
  },

  attach(canvas, {
    sides = 20,
    targetVal = '?',
    theme = 'normal',
    durationMs = 1150,
    easePower = 3.2,
    instantSettle = false,
    size = 106
  } = {}) {
    if (!canvas) return null;
    const solid = this.getSolid(sides);
    const labels = this._buildFaceLabels(sides, solid.faces.length, targetVal);
    const pickDir = () => (Math.random() < 0.5 ? -1 : 1);
    const turns = instantSettle ? { x: 0, y: 0, z: 0 } : {
      x: pickDir() * (Math.PI * 2 * (2 + Math.random() * 1.8) + 0.9),
      y: pickDir() * (Math.PI * 2 * (1.8 + Math.random() * 1.6) + 0.7),
      z: pickDir() * (Math.PI * 2 * (1.1 + Math.random() * 1.2) + 0.5)
    };
    const inst = {
      canvas,
      sides: Number(sides) || 20,
      solid,
      labels,
      theme,
      durationMs: Math.max(120, Number(durationMs) || 1150),
      easePower: Number(easePower) || 3.2,
      startTime: performance.now(),
      turns,
      settled: Boolean(instantSettle),
      size
    };
    this._instances.set(canvas, inst);
    if (instantSettle) {
      this._renderDie(inst, solid.endTilt.rx, solid.endTilt.ry, 0, 1);
    } else {
      this._ensureLoop();
    }
    return inst;
  },

  settle(canvas, targetVal, theme) {
    if (!canvas) return;
    const inst = this._instances.get(canvas);
    if (!inst) return;
    if (targetVal !== undefined && targetVal !== null) {
      inst.labels[0] = String(targetVal);
    }
    if (theme) inst.theme = theme;
    if (inst.fracture) inst.fracture.active = false;
    inst.settled = true;
    this._renderDie(inst, inst.solid.endTilt.rx, inst.solid.endTilt.ry, 0, 1);
  },

  startSuperadoFracture(canvas, durationMs = 1000) {
    if (!canvas) return;
    const inst = this._instances.get(canvas);
    if (!inst) return;
    inst.settled = false;
    const sparks = [];
    for (let i = 0; i < 22; i++) {
      const ang = Math.random() * Math.PI * 2;
      const speed = 0.4 + Math.random() * 0.9;
      sparks.push({
        vx: Math.cos(ang) * speed,
        vy: Math.sin(ang) * speed,
        size: 1.4 + Math.random() * 2.6,
        alpha: 0.8 + Math.random() * 0.2
      });
    }
    inst.fracture = {
      active: true,
      startTime: performance.now(),
      durationMs: Math.max(200, Number(durationMs) || 1000),
      progress: 0.08,
      sparks
    };
    this._renderDie(inst, inst.solid.endTilt.rx, inst.solid.endTilt.ry, 0, 1);
    this._ensureLoop();
  },

  stopFracture(canvas) {
    if (!canvas) return;
    const inst = this._instances.get(canvas);
    if (!inst) return;
    if (inst.fracture) inst.fracture.active = false;
    inst.settled = true;
  },

  _ensureLoop() {
    if (this._rafId) return;
    const step = (now) => {
      let hasActive = false;
      const curTime = performance.now();
      this._instances.forEach((inst, canvas) => {
        if (!canvas.isConnected) {
          this._instances.delete(canvas);
          return;
        }
        if (inst.settled && (!inst.fracture || !inst.fracture.active)) return;
        hasActive = true;

        if (inst.fracture && inst.fracture.active) {
          const elapsed = curTime - inst.fracture.startTime;
          const p = Math.min(1, Math.max(0.08, elapsed / inst.fracture.durationMs));
          inst.fracture.progress = p;
          const jMag = 0.03 + 0.05 * p;
          const rx = inst.solid.endTilt.rx + (Math.random() - 0.5) * jMag;
          const ry = inst.solid.endTilt.ry + (Math.random() - 0.5) * jMag;
          const rz = 0;
          const bounce = 1 + p * 0.08;
          this._renderDie(inst, rx, ry, rz, bounce);
          if (p >= 1) {
            inst.fracture.active = false;
            inst.settled = true;
          }
          return;
        }

        const elapsed = now - inst.startTime;
        const rawT = Math.min(1, Math.max(0, elapsed / inst.durationMs));
        const rem = Math.pow(1 - rawT, inst.easePower);
        const rx = inst.solid.endTilt.rx + inst.turns.x * rem;
        const ry = inst.solid.endTilt.ry + inst.turns.y * rem;
        const rz = inst.turns.z * rem;
        const impactBoost = rawT > 0.85 ? 1 + Math.sin(((rawT - 0.85) / 0.15) * Math.PI) * 0.08 : 1;
        this._renderDie(inst, rx, ry, rz, impactBoost);
        if (rawT >= 1) {
          inst.settled = true;
          this._renderDie(inst, inst.solid.endTilt.rx, inst.solid.endTilt.ry, 0, 1);
        }
      });
      if (hasActive) {
        this._rafId = requestAnimationFrame(step);
      } else {
        this._rafId = null;
      }
    };
    this._rafId = requestAnimationFrame(step);
  }
};
window.Mesa3DDice = Mesa3DDice;

// ---- 6. MOTOR DE ROLAGEM DE DADOS COM ALEATORIEDADE CRIPTOGRÁFICA (CSPRNG) ----
const MesaDice = {
  principalDie: 8, // padrão inicial: d8 (opções: 4, 8, 12, 16)
  extraDice: [],
  modifier: 0,
  manualPavorActive: false,
  isRolling: false,
  isGlobalRolling: false,
  currentRoller: null,
  lastRollTimestamp: 0,
  ROLL_COOLDOWN_MS: 3500,
  rollTimeout: null,

  get selectedDice() {
    return [this.principalDie, ...(this.extraDice || [])].filter(Boolean);
  },
  set selectedDice(arr) {
    if (Array.isArray(arr) && arr.length > 0) {
      const first = Number(arr[0]);
      if ([4, 8, 12, 16].includes(first)) {
        this.principalDie = first;
        this.extraDice = arr.slice(1).map(Number);
      } else {
        this.principalDie = 8;
        this.extraDice = arr.map(Number);
      }
    } else {
      this.extraDice = [];
    }
  },

  init() {
    this.renderSelectedList();
  },

  createDustVanishEffect(targetElement, color = '#ff1133', count = 35) {
    if (!targetElement) return;
    const rect = targetElement.getBoundingClientRect();
    targetElement.classList.add('dust-vanish-active');
    for (let i = 0; i < count; i++) {
      const p = document.createElement('div');
      p.className = 'dust-particle';
      const size = Math.random() * 5 + 2;
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.background = Math.random() > 0.4 ? color : '#111';
      p.style.boxShadow = `0 0 6px ${color}`;
      p.style.left = (rect.left + Math.random() * rect.width) + 'px';
      p.style.top = (rect.top + Math.random() * rect.height) + 'px';
      const tx = (Math.random() - 0.5) * 80;
      const ty = - (Math.random() * 60 + 20);
      p.style.setProperty('--tx', tx + 'px');
      p.style.setProperty('--ty', ty + 'px');
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 1200);
    }
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

  // Sorteio criptograficamente uniforme no Dado de Pavor (totalmente aleatorio, sem vies)
  cryptoRandomPavor(sides) {
    if (!sides || sides <= 1) return 1;
    return this.cryptoRandomInt(1, sides);
  },

  setPrincipalDie(sides) {
    const s = Number(sides);
    if (![4, 8, 12, 16].includes(s)) return;
    this.principalDie = s;
    this.updatePrincipalButtonsUI();
    this.updatePavorDescUI();
    this.renderSelectedList();
    this.updateRollButtonLabel();
  },

  updatePrincipalButtonsUI() {
    const btns = document.querySelectorAll('.dice-principal-btn');
    btns.forEach(b => {
      const bSides = Number(b.dataset.sides);
      b.classList.toggle('active', bSides === this.principalDie);
    });
  },

  updatePavorDescUI() {
    const desc = document.getElementById('dice-pavor-desc');
    if (desc) {
      desc.textContent = `Copia o Dado Principal (d${this.principalDie}) e subtrai o valor do total. Se tirar 1, o pavor é superado.`;
    }
  },

  openDiceModal() {
    this.openModal();
  },

  openModal() {
    if (!MesaApp.state.myToken && !MesaApp.state.isMaster && !MesaApp.state.myPlayerSlot) {
      alert("Observadores não podem rolar dados. Conecte seu token de personagem para rolar dados na mesa.");
      MesaApp.openTokenModal();
      return;
    }

    if (this.isGlobalRolling) {
      alert(`[MESA OCUPADA]: ${this.currentRoller || 'Outro jogador'} está rolando dados no palco central neste momento. Aguarde a rolagem terminar.`);
      return;
    }

    const isMaster = Boolean(MesaApp.state && MesaApp.state.isMaster);
    let p = null;
    if (MesaApp.state && MesaApp.state.mySlot && MesaApp.state.players) {
      p = MesaApp.state.players[MesaApp.state.mySlot - 1];
    } else if (MesaApp.state && MesaApp.state.activeViewingPlayer) {
      p = MesaApp.state.activeViewingPlayer;
    }
    // Apenas o Mestre tem controle manual do Dado de Pavor no modal
    // Se um jogador ja tiver status de pavor atribuido na ficha pelo Mestre, herda na rolagem
    if (isMaster) {
      if (p && p.dadoDePavor) {
        this.manualPavorActive = true;
      }
    } else {
      this.manualPavorActive = Boolean(p && p.dadoDePavor);
    }

    MesaApp.openModal('dice-modal');
    this.updatePrincipalButtonsUI();
    this.updatePavorDescUI();
    this.renderSelectedList();
    this.updatePavorChipUI();
  },

  togglePavorInModal() {
    if (!MesaApp.state || !MesaApp.state.isMaster) {
      if (typeof MesaApp.showToast === 'function') {
        MesaApp.showToast("Apenas o Mestre pode alterar o Dado de Pavor.");
      }
      return;
    }
    this.manualPavorActive = !this.manualPavorActive;
    let p = null;
    if (MesaApp.state && MesaApp.state.mySlot && MesaApp.state.players) {
      p = MesaApp.state.players[MesaApp.state.mySlot - 1];
    } else if (MesaApp.state && MesaApp.state.activeViewingPlayer) {
      p = MesaApp.state.activeViewingPlayer;
    }
    if (p) {
      p.dadoDePavor = this.manualPavorActive;
      MesaApp.renderMesa();
      if (MesaChat.channel) {
        MesaChat.channel.send({
          type: 'broadcast',
          event: 'pavor_toggle',
          payload: { slot: p.slot, dadoDePavor: p.dadoDePavor }
        });
      }
    }
    this.updatePavorChipUI();
  },

  updatePavorChipUI() {
    const btn = document.getElementById('dice-pavor-chip-btn');
    const isMaster = Boolean(MesaApp.state && MesaApp.state.isMaster);
    const card = document.getElementById('dice-pavor-card') || (btn ? btn.closest('.dice-pavor-card') : null);
    if (card) {
      card.style.display = isMaster ? 'block' : 'none';
      card.classList.toggle('active', Boolean(this.manualPavorActive));
    }
    if (!btn) return;
    btn.style.cursor = isMaster ? 'pointer' : 'not-allowed';
    btn.title = isMaster ? 'Alternar Dado de Pavor nesta rolagem' : 'Apenas o Mestre pode alterar o Dado de Pavor';
    const isActive = Boolean(this.manualPavorActive);
    btn.classList.toggle('active', isActive);
    const label = document.getElementById('dice-pavor-chip-label');
    if (label) {
      label.textContent = isActive ? 'LIGADO' : 'DESLIGADO';
    }
  },

  addExtraDie(sides) {
    if (this.selectedDice.length >= 8) {
      alert("Limite de 8 dados por rolagem atingido.");
      return;
    }
    this.extraDice.push(Number(sides) || 6);
    this.renderSelectedList();
  },

  addDie(sides) {
    this.addExtraDie(sides);
  },

  removeExtraDie(index) {
    if (this.extraDice && index >= 0 && index < this.extraDice.length) {
      this.extraDice.splice(index, 1);
    }
    this.renderSelectedList();
  },

  removeDie(index) {
    if (index === 0) {
      return;
    }
    this.removeExtraDie(index - 1);
  },

  clearPool() {
    this.extraDice = [];
    this.modifier = 0;
    const modInput = document.getElementById('dice-modifier-input');
    if (modInput) modInput.value = 0;
    this.renderSelectedList();
    this.updateRollButtonLabel();
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

    const principalHtml = `
      <span class="selected-die-badge principal-die-badge" title="Dado Principal (Atributo)">
        <span class="principal-star">★</span>
        d${this.principalDie}
        <span class="principal-tag">PRINCIPAL</span>
      </span>
    `;

    const extraHtml = (this.extraDice || []).map((sides, idx) => `
      <span class="selected-die-badge">
        + d${sides}
        <button type="button" class="remove-die-btn" onclick="MesaDice.removeExtraDie(${idx})" title="Remover dado extra">&times;</button>
      </span>
    `).join('');

    container.innerHTML = principalHtml + extraHtml;
    this.updatePrincipalButtonsUI();
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

    btn.disabled = false;
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';

    // Agrupa dados para exibição (ex: d8 [Principal] + 1d6)
    let diceParts = [`d${this.principalDie}`];
    if (this.extraDice && this.extraDice.length > 0) {
      const counts = {};
      this.extraDice.forEach(s => counts[s] = (counts[s] || 0) + 1);
      Object.keys(counts).forEach(s => diceParts.push(`${counts[s]}d${s}`));
    }
    const diceStr = diceParts.join(' + ');
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
      alert(`[MESA OCUPADA]: ${this.currentRoller || 'Outro jogador'} está rolando dados neste momento. Aguarde o resultado.`);
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

    this.lastRollTimestamp = now;
    MesaApp.closeModal('dice-modal');

    // 3. Gera resultados criptograficamente seguros para cada dado
    const diceResults = [
      {
        sides: this.principalDie,
        val: this.cryptoRandomInt(1, this.principalDie),
        isPrincipal: true
      },
      ...(this.extraDice || []).map(sides => ({
        sides: sides,
        val: this.cryptoRandomInt(1, sides),
        isPrincipal: false
      }))
    ];

    const sender = MesaChat.getCurrentSender();

    let rollerPlayer = null;
    if (MesaApp.state && MesaApp.state.mySlot && MesaApp.state.players) {
      rollerPlayer = MesaApp.state.players[MesaApp.state.mySlot - 1];
    } else if (MesaApp.state && MesaApp.state.players) {
      rollerPlayer = MesaApp.state.players.find(p => p && p.nome === sender.name);
    }

    let pavorResult = null;
    const diceSum = diceResults.reduce((acc, d) => acc + d.val, 0);
    let finalTotal = diceSum + this.modifier;

    const isPavorActive = Boolean(this.manualPavorActive || (rollerPlayer && rollerPlayer.dadoDePavor));

    if (isPavorActive) {
      // O Dado de Pavor SEMPRE copia o Dado Principal selecionado
      const mirroredSides = this.principalDie || 8;
      const pavorVal = this.cryptoRandomPavor(mirroredSides);
      pavorResult = {
        sides: mirroredSides,
        val: pavorVal,
        playerSlot: rollerPlayer ? rollerPlayer.slot : null,
        playerName: rollerPlayer ? rollerPlayer.nome : sender.name
      };

      if (pavorVal === 1) {
        // PAVOR SUPERADO: o valor 1 NÃO é subtraído do total!
        finalTotal = diceSum + this.modifier;
      } else {
        finalTotal = diceSum - pavorVal + this.modifier;
      }
    }

    const rollPayload = {
      rollerName: sender.name,
      isMaster: sender.isMaster,
      results: diceResults,
      pavorResult: pavorResult,
      modifier: this.modifier,
      total: finalTotal
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
    let breakdown = diceResults.map(d => `[${d.isPrincipal ? 'Principal ' : ''}d${d.sides}: ${d.val}]`).join(' + ');
    if (pavorResult) {
      if (pavorResult.val === 1) {
        breakdown += ` - [Pavor d${pavorResult.sides}: 1 (SUPERADO / +0)]`;
      } else {
        breakdown += ` - [Pavor d${pavorResult.sides}: ${pavorResult.val}]`;
      }
    }
    const modStr = this.modifier !== 0 ? (this.modifier > 0 ? ` + ${this.modifier}` : ` - ${Math.abs(this.modifier)}`) : '';
    const chatContent = `Rolou ${breakdown}${modStr} -> Total: ${finalTotal}`;

    if (pavorResult) {
      if (pavorResult.val === 1) {
        this.manualPavorActive = false;
        if (rollerPlayer) {
          setTimeout(() => {
            MesaChat.receiveMessage({
              id: 'pavor_clear_' + Date.now(),
              sender_name: 'Fios do Medo',
              is_master: true,
              content: `O Dado de Pavor de ${rollerPlayer.nome} sorteou 1 e foi estilhaçado. O terror foi superado e nenhuma penalidade foi aplicada.`,
              created_at: new Date().toISOString()
            });
            rollerPlayer.dadoDePavor = false;
            MesaApp.renderMesa();
            if (MesaChat.channel) {
              MesaChat.channel.send({
                type: 'broadcast',
                event: 'pavor_toggle',
                payload: { slot: rollerPlayer.slot, dadoDePavor: false }
              });
            }
          }, 3200);
        }
      } else {
        if (!rollerPlayer || !rollerPlayer.dadoDePavor) {
          this.manualPavorActive = false;
        }
      }
    }

    MesaChat.receiveMessage({
      id: 'dice_' + Date.now(),
      sender_name: sender.name,
      is_master: sender.isMaster,
      content: chatContent,
      created_at: new Date().toISOString()
    });

    // Grava no Registro de Rolagens se a rolagem for de jogador (nao do mestre)
    if (!sender.isMaster && window.MesaRollLog) {
      MesaRollLog.recordRoll({
        rollerName: sender.name,
        rollerSlot: rollerPlayer ? rollerPlayer.slot : (MesaApp.state && MesaApp.state.mySlot ? MesaApp.state.mySlot : null),
        results: diceResults,
        pavorResult: pavorResult,
        modifier: this.modifier,
        total: finalTotal,
        breakdown: breakdown
      });
    }
  },

  /** Returns normalized shape key for a die face count. */
  getDieShapeSpec(sides) {
    const s = Number(sides) || 20;
    const valid = [4, 6, 8, 10, 12, 16, 20, 100];
    return { shapeKey: valid.includes(s) ? `d${s}` : `d${s}` };
  },

  /** Builds a real 3D Canvas polyhedral die element matching the die sides and theme. */
  buildPolyhedralDieHtml({
    id = '',
    sides = 20,
    initialVal = '?',
    boxClass = 'rolling',
    title = '',
    topTagHtml = '',
    bottomTagHtml = '',
    showType = true,
    typeLabel = ''
  } = {}) {
    const s = Number(sides) || 20;
    const spec = this.getDieShapeSpec(s);
    const idAttr = id ? `id="${id}"` : '';
    const titleAttr = title ? `title="${title}"` : '';
    const labelText = typeLabel || `d${s}`;
    return `
      <div ${idAttr} class="dice-tumble-box ${boxClass}" data-die-sides="${spec.shapeKey}" data-die-val="${initialVal}" ${titleAttr}>
        ${topTagHtml}
        <canvas class="die-3d-canvas" aria-hidden="true"></canvas>
        ${showType ? `<span class="die-3d-type-label">${labelText}</span>` : ''}
        ${bottomTagHtml}
      </div>
    `;
  },

  playRollAnimation(data) {
    const isCombat = document.body.classList.contains('combat-active');
    const stage = (isCombat && document.getElementById('combat-dice-stage'))
      ? document.getElementById('combat-dice-stage')
      : document.getElementById('dice-stage');
    if (!stage) return;

    if (this.rollTimeout) clearTimeout(this.rollTimeout);
    if (this.rollClearTimeout) clearTimeout(this.rollClearTimeout);
    if (this._commonInterval) clearTimeout(this._commonInterval);
    const rollGen = (this._rollGen = (this._rollGen || 0) + 1);

    // Trava global ativa enquanto a rolagem ocorre no palco
    this.isGlobalRolling = true;
    this.currentRoller = data.rollerName;
    this.updateRollButtonLabel();

    stage.classList.add('active');

    const hasPavor = Boolean(data.pavorResult);
    const isPavorOne = Boolean(hasPavor && data.pavorResult.val === 1);

    // Etapa 1: Renderiza dados 3D comuns rolando em múltiplas direções. O Dado de Pavor fica oculto inicialmente.
    stage.innerHTML = `
      <div class="dice-roller-badge ${data.isMaster ? 'is-master' : ''}">
        ${data.rollerName} está rolando...
      </div>
      <div id="dice-tumbling-arena" class="dice-tumbling-arena">
        ${data.results.map((d, i) => this.buildPolyhedralDieHtml({
          id: `dice-box-${i}`,
          sides: d.sides,
          initialVal: '?',
          boxClass: `rolling ${d.isPrincipal ? 'is-principal-die' : ''}`,
          typeLabel: d.isPrincipal ? `PRINCIPAL • d${d.sides}` : `d${d.sides}`
        })).join('')}
      </div>
      <div id="dice-total-box" class="dice-total-banner" style="display:none;"></div>
    `;

    const arena = stage.querySelector('#dice-tumbling-arena');
    data.results.forEach((d, i) => {
      const box = stage.querySelector(`#dice-box-${i}`);
      const canvas = box ? box.querySelector('.die-3d-canvas') : null;
      if (canvas && window.Mesa3DDice) {
        Mesa3DDice.attach(canvas, {
          sides: d.sides,
          targetVal: d.val,
          theme: 'normal',
          durationMs: 1120,
          easePower: 3.1,
          size: 96
        });
      }
    });

    // Fim da Etapa 1: Estabiliza os modelos 3D após 1.15s e exibe o total parcial
    this._commonInterval = setTimeout(() => {
      if (this._rollGen !== rollGen) return;

      data.results.forEach((d, i) => {
        const box = stage.querySelector(`#dice-box-${i}`);
        const canvas = box ? box.querySelector('.die-3d-canvas') : null;
        if (box) {
          box.classList.remove('rolling');
          box.classList.add('settled');
          box.dataset.dieVal = String(d.val);
          if (d.val === d.sides && d.sides >= 4) box.classList.add('crit-max');
          else if (d.val === 1 && d.sides >= 4) box.classList.add('crit-min');
        }
        if (canvas && window.Mesa3DDice) {
          const theme = (d.val === d.sides && d.sides >= 4)
            ? 'crit-max'
            : ((d.val === 1 && d.sides >= 4) ? 'crit-min' : 'normal');
          Mesa3DDice.settle(canvas, d.val, theme);
        }
      });

      const commonDiceBreakdown = data.results.map(d => `${d.isPrincipal ? '★' : ''}d${d.sides}(${d.val})`).join(' + ');
      const commonSum = data.results.reduce((a, b) => a + b.val, 0);
      const modStr = data.modifier !== 0 ? (data.modifier > 0 ? ` + ${data.modifier}` : ` − ${Math.abs(data.modifier)}`) : '';
      const partialTotal = commonSum + data.modifier;

      const totalBox = stage.querySelector('#dice-total-box');

      if (!hasPavor) {
        // Rolagem padrão sem pavor: exibe total final diretamente
        if (totalBox) {
          totalBox.classList.remove('has-pavor');
          let formulaParts = '';
          if (data.results.length > 1) {
            formulaParts = `${commonDiceBreakdown} [${commonSum}]${modStr} =`;
          } else {
            formulaParts = `${commonDiceBreakdown}${modStr} =`;
          }
          totalBox.style.display = 'flex';
          totalBox.innerHTML = `
            <div class="dice-formula-container">
              <span class="dice-breakdown-text">${formulaParts}</span>
              <span class="dice-grand-total">${data.total}</span>
            </div>
          `;
        }
        return;
      }

      // Se há pavor: exibe o total parcial provisório no centro
      if (totalBox) {
        totalBox.classList.add('has-pavor');
        let partialFormula = data.results.length > 1 ? `${commonDiceBreakdown} [${commonSum}]${modStr} =` : `${commonDiceBreakdown}${modStr} =`;
        totalBox.style.display = 'flex';
        totalBox.innerHTML = `
          <div class="dice-formula-container" id="dice-partial-formula-wrap">
            <span class="dice-breakdown-text">${partialFormula}</span>
            <span id="dice-partial-total-num" class="dice-grand-total">${partialTotal}</span>
          </div>
        `;
      }

      // Etapa 2: Após suspense de 900ms, o Dado de Pavor gótico 3D surge no palco e gira com desaceleração tensa
      setTimeout(() => {
        if (this._rollGen !== rollGen || !arena) return;

        const pavorTemp = document.createElement('div');
        pavorTemp.innerHTML = this.buildPolyhedralDieHtml({
          id: 'dice-pavor-box',
          sides: data.pavorResult.sides,
          initialVal: '?',
          boxClass: 'pavor-box pavor-entrance rolling',
          title: 'Dado de Pavor (Fios do Medo)',
          typeLabel: `PAVOR • d${data.pavorResult.sides}`
        }).trim();
        const pavorEl = pavorTemp.firstElementChild;
        arena.appendChild(pavorEl);

        const pavorCanvas = pavorEl.querySelector('.die-3d-canvas');
        if (pavorCanvas && window.Mesa3DDice) {
          Mesa3DDice.attach(pavorCanvas, {
            sides: data.pavorResult.sides,
            targetVal: data.pavorResult.val,
            theme: 'pavor',
            durationMs: 2780,
            easePower: 3.8,
            size: 96
          });
        }

        const finishPavorRoll = () => {
          if (this._rollGen !== rollGen || !stage.classList.contains('active')) return;
          pavorEl.classList.remove('rolling');
          pavorEl.classList.add('settled-pavor');
          pavorEl.dataset.dieVal = String(data.pavorResult.val);
          if (pavorCanvas && window.Mesa3DDice) {
            Mesa3DDice.settle(pavorCanvas, data.pavorResult.val, 'pavor');
          }

          if (data.pavorResult.val === 1) {
            // === CINEMÁTICA ESPECIAL: PAVOR SUPERADO (VALOR 1) ===
            // 1. Temporariamente os outros dados somem com transição suave
            const otherDice = arena.querySelectorAll('.dice-tumble-box:not(#dice-pavor-box)');
            arena.classList.add('pavor-solo-mode');
            otherDice.forEach(box => box.classList.add('pavor-superado-hide'));
            if (totalBox) {
              totalBox.style.opacity = '0';
              totalBox.style.pointerEvents = 'none';
            }

            // 2. O Dado de Pavor vai para o centro e ganha zoom
            pavorEl.classList.add('pavor-superado-focus');

            // 3. Após zoom (600ms), começa a rachar e tremer
            setTimeout(() => {
              if (this._rollGen !== rollGen) return;
              pavorEl.classList.add('pavor-superado-shake');

              // Ativa rachaduras 3D em tempo real diretamente no modelo poliedrico
              if (pavorCanvas && window.Mesa3DDice) {
                Mesa3DDice.startSuperadoFracture(pavorCanvas, 2400);
              }

              // Injeta fissuras de rachadura verdes/carmesins sobre o dado
              const crackOverlay = document.createElement('div');
              crackOverlay.className = 'pavor-crack-fissures';
              crackOverlay.innerHTML = `
                <svg viewBox="0 0 100 100" class="pavor-crack-svg">
                  <path class="crack-path" d="M50 12 L48 34 L40 46 L54 60 L46 74 L50 88 M48 34 L64 38 L76 30 M40 46 L26 54 L14 48 M54 60 L68 64 L82 78 M46 74 L32 82" />
                </svg>
              `;
              pavorEl.appendChild(crackOverlay);

              // 4. Apos 2400ms de tremor e rachadura, ele quebra com explosao de poeira e particulas
              setTimeout(() => {
                if (this._rollGen !== rollGen) return;

                if (pavorCanvas && window.Mesa3DDice) {
                  Mesa3DDice.stopFracture(pavorCanvas);
                }

                // Efeito de fragmentacao / estilhaco
                this.createDustVanishEffect(pavorEl, '#22c55e', 45);
                this.createDustVanishEffect(pavorEl, '#ef4444', 35);

                pavorEl.classList.add('pavor-shattered');

                // Flash sutil no palco
                stage.classList.add('pavor-superado-flash');
                setTimeout(() => stage.classList.remove('pavor-superado-flash'), 700);

                // Exibe o texto limpo em verde no centro: "Pavor superado"
                const superadoBanner = document.createElement('div');
                superadoBanner.className = 'pavor-superado-cinematic-banner';
                superadoBanner.innerHTML = `
                  <div class="pavor-superado-cinematic-title">Pavor superado</div>
                `;
                arena.appendChild(superadoBanner);

                // 5. Apos 1900ms do estilhaco, o texto "Pavor superado" faz fade-out para dar espaco aos dados
                setTimeout(() => {
                  if (this._rollGen !== rollGen) return;
                  if (superadoBanner) {
                    superadoBanner.classList.add('fade-out');
                  }

                  // Apos o fade-out do texto (300ms), remove o banner, restaura os dados comuns e revela o total
                  setTimeout(() => {
                    if (this._rollGen !== rollGen) return;
                    if (superadoBanner && superadoBanner.parentNode) {
                      superadoBanner.remove();
                    }

                    arena.classList.remove('pavor-solo-mode');
                    pavorEl.classList.add('pavor-shattered-collapsed');
                    otherDice.forEach(box => box.classList.remove('pavor-superado-hide'));

                    if (totalBox) {
                      totalBox.style.opacity = '1';
                      totalBox.style.pointerEvents = 'all';
                      totalBox.innerHTML = `
                        <div class="dice-formula-container">
                          <span class="dice-breakdown-text">
                            ${commonDiceBreakdown} ${data.results.length > 1 ? `[${commonSum}]` : ''} 
                            <span class="pavor-breakdown-superado-pill">PAVOR SUPERADO (+0)</span>
                            ${modStr} =
                          </span>
                          <span class="dice-grand-total pavor-superado-total">${data.total}</span>
                        </div>
                      `;
                    }
                  }, 300);

                }, 1900);

              }, 2400);

            }, 600);

          } else {
            // Caso padrão (valor > 1): subtrai o pavor normalmente
            if (totalBox) {
              let formulaParts = data.results.length > 1
                ? `${commonDiceBreakdown} [${commonSum}] <span class="pavor-breakdown-minus">− PAVOR (${data.pavorResult.val})</span>${modStr} =`
                : `${commonDiceBreakdown} <span class="pavor-breakdown-minus">− PAVOR (${data.pavorResult.val})</span>${modStr} =`;

              totalBox.innerHTML = `
                <div class="dice-formula-container">
                  <span class="dice-breakdown-text">${formulaParts}</span>
                  <span class="dice-grand-total with-pavor">${data.total}</span>
                </div>
              `;
            }
          }
        };

        setTimeout(finishPavorRoll, 2800);

      }, 900);

    }, 1150);

    // Duração do palco: se for pavor 1, estende para 15000ms para a cinematica completa ser apreciada
    const totalDuration = isPavorOne ? 15000 : (hasPavor ? 7900 : 4700);
    this.rollTimeout = setTimeout(() => {
      if (this._rollGen !== rollGen) return;
      stage.classList.remove('active');
      this.rollClearTimeout = setTimeout(() => {
        if (this._rollGen !== rollGen) return;
        stage.innerHTML = '';
        this.isGlobalRolling = false;
        this.currentRoller = null;
        this.updateRollButtonLabel();
      }, 320);
    }, totalDuration);
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
  },
  "pavilhao-abandonado": {
    "id": "pavilhao-abandonado",
    "name": "Pavilhão de Acolhimento Abandonado",
    "shortName": "Pavilhão Abandonado",
    "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 21h18\"></path><path d=\"M5 21V7l7-4 7 4v14\"></path><path d=\"M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v11H9V10z\"></path><line x1=\"9\" y1=\"21\" x2=\"9\" y2=\"14\"></line><line x1=\"15\" y1=\"21\" x2=\"15\" y2=\"14\"></line></svg>",
    "themeClass": "area-pavilhao-abandonado",
    "district": "Divisa entre a Mata do Norte e o Subúrbio • Fragktus",
    "dangerLevel": "Zona de Investigação / Perigo Baixo",
    "dangerLevelClass": "warning",
    "ambience": "Um antigo anexo de reabilitação juvenil desativado há décadas, engolido pela vegetação densa na divisa entre a Mata do Norte e o subúrbio de Fragktus.\n\nCondições de Ambiente: Escuridão - Personagens que não possuem visão noturna, recebem -1 em testes de percepção e investigação.",
    "lore": "Desativado há décadas, o anexo serviu em segredo como santuário e centro de recrutamento clandestino. Jovens em desespero ou acometidos por enfermidades graves eram reunidos no escuro sob falsas promessas de descanso e salvação definitiva.",
    "rumor": "Dizem que dezenas de panfletos de desaparecimento de crianças e adolescentes foram arrancados dos postes da cidade para abafar as buscas e selecionar vítimas em segredo.",
    "requisitos_acesso": "Acessos do Pavilhão:\n• Janela Quebrada (Lateral): Entrada de emergência vinda da orla da floresta.\n• Porta Principal (Frente): Trancada por fora com correntes pesadas e cadeado enferrujado (Força DT 9 ou Crime DT 8 para abrir por dentro, mas faz muito barulho).\n• Galeria de Escoamento (Subsolo): Saída furtiva que dá acesso às tubulações de drenagem e leva de volta às ruas traseiras da cidade.",
    "conexoes_saida": [
      {
        "nome": "Janela Quebrada (Mata do Norte)",
        "area_id": "floresta-proibida",
        "gancho": "Acesso direto à orla densa da floresta."
      },
      {
        "nome": "Galeria de Escoamento (Subsolo)",
        "area_id": "casa-auguil",
        "gancho": "Tubulações de drenagem que conduzem às ruas traseiras do subúrbio."
      }
    ],
    "pois": [
      {
            "num": 1,
            "title": "A Pilha de Panfletos e o Mural (Corredor de Entrada)",
            "cabecalho": {
                  "nome": "A Pilha de Panfletos e o Mural (Corredor de Entrada)",
                  "descricao_publica": "Local no Mapa: Na entrada superior esquerda, espalhados pelo chão e nas escadas de acesso ao mezanino.\n\nO chão está úmido de goteiras e coberto por dezenas de cartazes arrancados dos postes da cidade e empilhados num canto, como se alguém estivesse limpando os arredores da mata para abafar as buscas."
            },
            "testes": [
                  {
                        "pericia": "Sem Teste (Frente do Cartaz)",
                        "ct_dt": "-",
                        "informacao_revelada": "Evidência Encontrada (Frente do Cartaz):\nPROCURA-SE\n• Nome: Kali (Idade aparente: 9 a 11 anos)\n• Descrição: Akivus, cabelos castanhos curtos, olhos expressivos e usa um tapa-olho no olho direito. Blusa de frio simples, vista pela última vez com laço de cabelo rosa.\n• Último Visto: Nas proximidades da trilha do bosque da Mata do Norte."
                  },
                  {
                        "pericia": "Investigação",
                        "ct_dt": 6,
                        "informacao_revelada": "Pista Desbloqueada (Verso do Cartaz — Tinta Roxa):\nNo verso de um dos panfletos, há anotações feitas à mão com uma caneta de tinta roxa (a mesma cor de tinta do bilhete no armário de Sara no EP 1), sem nenhuma assinatura:\n• \"Terça-feira (14:15) — Saiu da aula antes dos outros. Caminha sozinha pela orla da mata.\"\n• \"Quinta-feira (14:10) — O mesmo trajeto. Ninguém a acompanha. O bosque está silencioso neste horário.\"\n• \"Conclusão: Perfeita para a passagem. O cordeiro está pronto para a Porta de Sara.\""
                  }
            ],
            "notas_mestre": "Recompensa / Pista: Panfleto Anotado de Kali (Prova que a criança não foi uma vítima acidental, mas sim vigiada e selecionada para a passagem). A tinta roxa é o elemento que aponta para a diretora Constança."
      },
      {
            "num": 2,
            "title": "O Círculo de Cadeiras e os Relatos (Centro do Galpão)",
            "cabecalho": {
                  "nome": "O Círculo de Cadeiras e os Relatos (Centro do Galpão)",
                  "descricao_publica": "Local no Mapa: O círculo central de cadeiras cercado por caixotes, com velas derretidas no chão e papéis espalhados sobre a mesa do mezanino.\n\nNove cadeiras velhas dispostas em círculo no centro do concreto rachado, iluminadas por restos de velas ainda quentes. Ao redor e sobre as bancadas, há diários rasgados, prontuários médicos amassados e recortes de jornais antigos. Não há nenhum documento formal que identifique o dono do local."
            },
            "testes": [
                  {
                        "pericia": "Investigação",
                        "ct_dt": 7,
                        "informacao_revelada": "O Padrão das Vítimas: Todos os jovens que frequentavam aquela roda passavam por tragédias reais e irreversíveis: Sara tinha câncer; outros sofriam de doenças degenerativas sem cura, abandonos severos ou perdas familiares brutais. Quem comanda o círculo seleciona apenas jovens que já estão no limite do sofrimento físico ou mental."
                  },
                  {
                        "pericia": "Ocultismo",
                        "ct_dt": 7,
                        "informacao_revelada": "A Regra da Caixa: Entre os rascunhos de doutrinação sobre o \"Jardim Dele\", uma anotação aparece repetida várias vezes: \"A Caixa só se abre para aqueles cujo tempo na Terra já está condenado.\""
                  }
            ],
            "notas_mestre": "Pistas Desbloqueadas:\n• O Padrão das Vítimas: Todos os jovens que frequentavam aquela roda passavam por tragédias reais e irreversíveis: Sara tinha câncer; outros sofriam de doenças degenerativas sem cura, abandonos severos ou perdas familiares brutais. Quem comanda o círculo seleciona apenas jovens que já estão no limite do sofrimento físico ou mental.\n• A Regra da Caixa: Entre os rascunhos de doutrinação sobre o \"Jardim Dele\", uma anotação aparece repetida várias vezes: \"A Caixa só se abre para aqueles cujo tempo na Terra já está condenado.\""
      },
      {
            "num": 3,
            "title": "A Gaveta Emperrada — Gravador de Fita #01 (Mezanino Esquerdo)",
            "cabecalho": {
                  "nome": "A Gaveta Emperrada — Gravador de Fita #01 (Mezanino Esquerdo)",
                  "descricao_publica": "Local no Mapa: Na mesa de ferro posicionada na passarela elevada à esquerda.\n\nUma escrivaninha de metal enferrujada com a gaveta central travada pela umidade."
            },
            "testes": [
                  {
                        "pericia": "Força (Arrancar no Tranco)",
                        "ct_dt": 7,
                        "informacao_revelada": "Força a gaveta com impacto físico e solta o trilho empenado, revelando o Gravador de Fita Antigo #01 (\"A Exigência da Passagem\")."
                  },
                  {
                        "pericia": "Crime / Destreza (Destravar Trilho)",
                        "ct_dt": 6,
                        "informacao_revelada": "Manipula o trilho corroído com delicadeza, abrindo a gaveta silenciosamente e obtendo o Gravador de Fita Antigo #01 (\"A Exigência da Passagem\")."
                  },
                  {
                        "pericia": "Audição da Fita (Transcrição Completa)",
                        "ct_dt": "-",
                        "informacao_revelada": "[O botão 'Play' afunda com um estalo. Som de goteiras no galpão escuro. Ouve-se uma respiração curta, chiada, e o barulho metálico da Caixa Negra já destrancada no colo de Sara]\n\n— Voz da Mulher (calma, solene, com uma autoridade mansa e inquestionável): \"Muito bem, Sara. Olhe para ela aberta no seu colo. A primeira parte acabou. O seu espírito finalmente soltou as amarras deste mundo. Você já não pertence mais a esta vida.\"\n\n— Sara (demora segundos para responder; voz arrastada, oca, de quem já está com a mente completamente derretida): \"...Já posso ir? Nas árvores... eu já posso passar?\"\n\n— Voz da Mulher: \"Ainda não, minha querida. A chave está na sua mão, mas a Porta não se abre para quem chega de mãos vazias. Como eu lhe disse desde o primeiro dia... a dor que nós sentimos aqui fora nos esvazia. Olhe para você: o sofrimento secou tudo o que havia aí dentro. E Ele não aceita cascas vazias no Jardim.\"\n\n— Sara (um murmúrio confuso, lento, quase infantil): \"Vazia... Eu tô vazia. Mas... o que que falta?\"\n\n— Voz da Mulher (o tom fica mais baixo, frio e dogmático): \"A ordem Dele para a passagem é clara, Sara. Antes de cruzar o arco, você deve tomar para dentro de si uma vida que ainda esteja cheia. Você precisa abater o cordeiro e consumir da sua carne ainda quente.\"\n\n— Sara (pausa longa no escuro; a respiração falha um pouco): \"...Comer? Mas... por quê?\"\n\n— Voz da Mulher: \"Porque é a vontade Dele para que a travessia se cumpra. Não cabe a nós questionar o rito, menina, apenas obedecer. As pessoas lá fora passam a vida inteira engolindo remédios amargos, suportando humilhações e agonizando em camas de hospital em troca de nada... Você vai recusar um único ato sagrado em troca da eternidade sem dor? Quando você engolir aquela carne, a centelha que falta ficará guardada dentro de você. Só assim Ele a reconhecerá quando a Porta abrir.\"\n\n— Sara (um silêncio pesado; depois, uma voz completamente submissa e anestesiada): \"...Se Ele mandou... então eu faço. Só quero que pare de doer.\"\n\n— Voz da Mulher (num sussurro acariciante): \"Eu sabia que você estava pronta. Amanhã, às duas e quinze, na beira do bosque. Ela passa sozinha. Cumpra o que Ele pediu... e o seu descanso estará esperando.\"\n\n— Sara (num sopro quase inaudível): \"...Duas e quinze. Como Ele pediu...\"\n\n[Clique seco desligando o aparelho]"
                  }
            ],
            "notas_mestre": "Item Encontrado: Gravador de Fita Antigo #01 (\"A Exigência da Passagem\"). A fita prova a manipulação direta e fria de Sara pela Voz da Mulher (Constança), ordenando o sacrifício e consumo da carne de Kali para a travessia da Porta."
      },
      {
            "num": 4,
            "title": "As Mochilas Mofadas — Gravador de Fita #02 (Caixotes Centrais)",
            "cabecalho": {
                  "nome": "As Mochilas Mofadas — Gravador de Fita #02 (Caixotes Centrais)",
                  "descricao_publica": "Local no Mapa: Escondido entre as pilhas de caixotes de madeira e mochilas velhas ao redor do círculo de cadeiras.\n\nPertences deixados para trás por outros adolescentes que frequentavam o galpão. No fundo de uma mochila rasgada, há um gravador de bolso branco com a tampa presa por fita adesiva."
            },
            "testes": [
                  {
                        "pericia": "Vasculhar Caixotes (Automático ou Percepção / Investigação)",
                        "ct_dt": 6,
                        "informacao_revelada": "Localiza a mochila rasgada e extrai o Gravador de Bolso #02 (\"Por Trás da Máscara\")."
                  },
                  {
                        "pericia": "Audição da Fita (Sara e Bia)",
                        "ct_dt": "-",
                        "informacao_revelada": "[Chiado de fita. Som de chuva fina batendo nas telhas quebradas. Ouve-se o som de Sara balançando o corpo para frente e para trás numa cadeira de madeira que range sem parar]\n\n— Bia (voz jovem, cansada, puxando um caixote para sentar perto): \"Sara? Achei que todo mundo já tinha vazado... Vai ficar aí no escuro até que horas?\"\n\n— Sara (voz baixa, monótona, sem parar de balançar): \"...Só esperando dar amanhã.\"\n\n— Bia (suspira fundo, acendendo um isqueiro só pra fazer luz por um segundo): \"Quem dera eu tivesse pressa pra chegar amanhã. Só de pensar em voltar pra casa, ver meu pai chorando pelos cantos e tomar aquela droga de soro na clínica, já dá vontade de sumir. Às vezes eu fico ouvindo ela falar aqui na roda e penso que a gente é muito idiota mesmo de continuar insistindo nessa vida... Mas sei lá, uma coisa ainda me dá nervoso. Por que ela nunca tira aquela máscara na frente da gente? Se a gente tá todo mundo no mesmo barco, pra que esconder a cara?\"\n\n— Sara (um murmúrio lento, oco, quase sem expressão): \"Ela tirou... Hoje ela me mostrou.\"\n\n— Bia (para na hora; a voz muda, cheia de surpresa e curiosidade): \"Não brinca. Sério? Quando o resto do pessoal saiu? E quem é ela, Sara? A gente conhece da rua?\"\n\n— Sara (com uma calma bizarra, olhando pro vazio): \"Todo mundo conhece... Mas ela disse que rosto é só casca. Só serve pra quem vai ficar aqui. Quando a caixa abriu, ela tirou.\"\n\n— Bia (inclinando-se para perto, impressionada ao olhar para o colo de Sara): \"...A tampa abriu mesmo. Você conseguiu destrancar... Mas me fala logo quem é ela, Sara, não me deixa curiosa.\"\n\n— Sara (ignorando a pergunta sobre o rosto, num tom arrastado e anestesiado): \"Não faz diferença... Ainda falta uma coisa. Ele não deixa passar vazia. Ela disse que eu tenho que fazer o que Ele mandou amanhã.\"\n\n— Bia: \"Ué, mas já não tá com a chave aí na mão? Que que falta fazer?\"\n\n— Sara: \"A passagem... Às duas e quinze, no bosque. Tenho que pegar uma menina que passa lá... e comer a carne enquanto tá quente.\"\n\n— Bia (silêncio de uns três segundos; ela solta o ar devagar, achando bizarro, mas sem entrar em pânico): \"...Comer carne de gente? Pesado isso aí... Você não acha meio estranho Ele pedir um negócio desses?\"\n\n— Sara (apática, quase infantil): \"É a ordem Dele pra abrir a Porta... Lá fora o hospital corta a gente, queima a gente por dentro e não resolve nada. Pelo menos isso... é uma vez só. E depois acaba.\"\n\n— Bia (fica pensativa, a voz baixando num tom melancólico e honesto): \"É... pensando por esse lado, você não tá errada. A gente apanha todo dia de graça mesmo. Sinceramente, Sara? Eu nem julgo você. Se a caixa tivesse aberto pra mim hoje, acho que eu também faria qualquer coisa que mandassem só pra não sentir mais dor.\"\n\n— Sara (vira o rosto devagar na direção dela no escuro): \"...E por que não abriu pra você?\"\n\n— Bia (um riso fraco, cansado, olhando pro chão): \"Sei lá. Acho que lá no fundo eu ainda sou ingênua. Ainda fico esperando acontecer algum milagre, ou ter um dia bom antes de apagar de vez... Mesmo sabendo que é só ilusão e que amanhã vai doer tudo de novo. Você pelo menos teve coragem de largar mão logo.\"\n\n— Sara (voltando a olhar para o nada, a cadeira rangendo): \"Cansa esperar... Eu só quero silêncio.\"\n\n— Bia (levantando do caixote devagar e batendo a poeira da calça): \"Eu sei. Vai dar tudo certo amanhã no bosque, Sara. Tomara que esse Jardim seja bom mesmo... Se eu não aguentar mais essa situação aqui fora, qualquer dia desses eu abro a próxima caixa e vou atrás de você. Boa sorte lá.\"\n\n— Sara (num sopro quase inaudível): \"...Tchau, Bia.\"\n\n[Som dos passos calmos de Bia saindo na chuva. A fita continua rodando no escuro com o barulho constante da cadeira da Sara rangendo — nhec, nhec — até o áudio cortar]"
                  }
            ],
            "notas_mestre": "Item Encontrado: Gravador de Bolso #02 (\"Por Trás da Máscara\"). Revela que Sara viu o rosto da líder mascarada (\"todo mundo conhece\"), confirmando que a responsável é uma figura pública e influente de Fraguiktos."
      },
      {
            "num": 5,
            "title": "O Canto do Mercador — Igris (Fundo Direito / Caixotes)",
            "cabecalho": {
                  "nome": "O Canto do Mercador — Igris (Fundo Direito / Caixotes)",
                  "descricao_publica": "Local no Mapa: Sentado sobre as caixas de madeira na lateral direita ou na ponta sul do mezanino, surgindo após o grupo investigar a sala.\n\nUm homem de presença silenciosa organizando mercadorias sobre um pano aberto no escuro, completamente indiferente ao perigo lá fora."
            },
            "testes": [
                  {
                        "pericia": "Diálogo Enigmático",
                        "ct_dt": "-",
                        "informacao_revelada": "Nunca responde perguntas de forma direta; fala apenas por enigmas curtos sobre \"mãos que já não têm nada a perder\" e \"a carne faminta nos túneis abaixo\"."
                  },
                  {
                        "pericia": "Comércio Mercante",
                        "ct_dt": "-",
                        "informacao_revelada": "Permite aos jogadores gastarem seus Vidrilhos para comprar itens de cura, redutores de estresse, lanternas ou armas improvisadas antes de descerem para o esgoto. Desaparece sem deixar rastro assim que o grupo vira as costas."
                  }
            ],
            "notas_mestre": "Interação e Comércio: Nunca responde perguntas de forma direta; fala por enigmas sobre \"mãos que já não têm nada a perder\" e \"a carne faminta nos túneis abaixo\". Permite comprar itens de cura, lanternas ou armas improvisadas usando Vidrilhos antes de descerem para a drenagem."
      },
      {
            "num": 6,
            "title": "A Grade de Escoamento (Canto Inferior Esquerdo)",
            "cabecalho": {
                  "nome": "A Grade de Escoamento (Canto Inferior Esquerdo)",
                  "descricao_publica": "Local no Mapa: A grande grade quadrada de ferro enferrujado cercada por lodo e água suja na parte inferior esquerda do mapa.\n\nCom a porta principal acorrentada por fora e vigiada pela Figura Mascarada na mata, a tubulação de drenagem subterrânea é a única rota de fuga de volta para as ruas de Fraguiktos."
            },
            "testes": [
                  {
                        "pericia": "Mecânica da Grade (Fuga)",
                        "ct_dt": "-",
                        "informacao_revelada": "A grade está emperrada pelo lodo e ferrugem, exigindo que alguém se aproxime fisicamente para puxá-la e abrir a passagem de drenagem subterrânea."
                  },
                  {
                        "pericia": "Evento Roteirizado (O Gatilho da Praga)",
                        "ct_dt": "-",
                        "informacao_revelada": "Ao puxarem a grade pesada para abrir passagem, o Rato Carniceiro Portador da Praga salta da tubulação seca em emboscada veloz."
                  },
                  {
                        "pericia": "Alvo Fixo (Ataque a Minerva)",
                        "ct_dt": "-",
                        "informacao_revelada": "A criatura avança diretamente em Minerva (Incisivos Pestilentos), causando 1d4 de dano perfurante aparentemente superficial, mas transmitindo silenciosamente a Praga para a corrente sanguínea dela."
                  }
            ],
            "notas_mestre": "Ameaça Local (Encontro do PDI #06):\nRATO CARNICEIRO (PORTADOR DA PRAGA) [ Criatura Pequena / Besta Infectada ]\n• PV: 12 | Defesa: 6 | Iniciativa: Alta (Age primeiro na emboscada contra Minerva)\n• Passiva — Sangue Pestilento: O corpo do animal está tomado por caroços cinzentos e veias arroxeadas. Qualquer ataque corpo a corpo que o mate espalha sangue escuro e fétido no chão (sem efeito de contágio pelo ar, apenas por mordida direta).\n• Ação — Incisivos Pestilentos (Corpo a Corpo): Avança ferozmente no alvo mais próximo da grade (Minerva), causando 1d4 de dano perfurante e aplicando silenciosamente a condição oculta Portador da Praga (Incubação)."
      }
]
  },
  "galerias-escoamento": {
    "id": "galerias-escoamento",
    "name": "As Galerias de Escoamento (Esgoto de Fraguiktos)",
    "shortName": "Galerias de Escoamento",
    "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"></rect><path d=\"M3 9h18\"></path><path d=\"M3 15h18\"></path><path d=\"M9 3v18\"></path><path d=\"M15 3v18\"></path></svg>",
    "themeClass": "area-galerias-escoamento",
    "district": "Rede de Esgoto Pluvial e Sanitário • Subúrbio de Fraguiktos",
    "dangerLevel": "Zona Subterrânea / Isolamento Fétido",
    "dangerLevelClass": "danger",
    "ambience": "Ao descerem pela grade quebrada, o cheiro pesado de esgoto, lodo podre e umidade velha atinge o nariz de vocês na hora. O túnel é baixo, abafado e escuro, feito de blocos de pedra sujos de limo preto. Pelo meio da galeria corre uma vala de água esverdeada, grossa e parada, cheia de lixo boiando e tábuas de madeira velhas jogadas por cima para servir de passagem. O único som é o pinga-pinga constante de infiltração no teto, o eco dos passos de vocês na pedra molhada e o barulho de água correndo nos canos enferrujados das paredes.\n\nCondições de Ambiente: Mau Cheiro Asfixiante e Escuridão - Testes que dependam de olfato ou concentração sofrem Desvantagem sem proteção nasal.",
    "lore": "Um trecho comum, antigo e fétido da rede de esgoto pluvial e sanitário que passa por baixo do subúrbio de Fraguiktos, cujo isolamento completo e cheiro insuportável afastam qualquer pessoa normal dali.",
    "rumor": "Presos nas grades enferrujadas e caixotes do esgoto, há vestígios de testes cirúrgicos prévios e prontuários médicos roubados das clínicas de Fraguiktos.",
    "requisitos_acesso": "Acessos das Galerias:\n• Grade Quebrada do Pavilhão (Norte): Entrada subterrânea a partir do subsolo do Pavilhão de Acolhimento Abandonado.\n• Vala Central e Passarelas: Travessia sobre tábuas de madeira podre e concreto limoso.\n• Escada de Saída do Bueiro (Sul/Leste): Saída de emergência para as ruas do subúrbio a duas quadras do Pavilhão Abandonado.",
    "conexoes_saida": [
      {
        "area_id": "pavilhao-abandonado",
        "nome": "Pavilhão Abandonado",
        "gancho": "Subida pela grade de drenagem quebrada."
      },
      {
        "area_id": "casa-auguil",
        "nome": "Casa Auguil",
        "gancho": "Ruas traseiras do subúrbio de Fraguiktos após a saída do bueiro."
      }
    ],
    "pois": [
      {
        "num": 1,
        "title": "A Vala Central e o Cruzamento de Água Suja (Topo / Centro do Mapa)",
        "cabecalho": {
          "nome": "A Vala Central e o Cruzamento de Água Suja (Topo / Centro do Mapa)",
          "descricao_publica": "Local no Mapa: O canal comprido de água esverdeada que desce do norte e corta o mapa até o sul, com passarelas estreitas de concreto nas bordas e tábuas de madeira podre atravessadas por cima.\n\nUm esgoto comum e imundo. A água turva carrega sacolas rasgadas, garrafas velhas, folhas apodrecidas vindas da mata e lama escura acumulada nos cantos."
        },
        "testes": [
          {
            "pericia": "Percepção ou Sobrevivência",
            "ct_dt": 6,
            "informacao_revelada": "• Pegadas no Lodo: No meio da sujeira comum do esgoto e do barro nas passarelas laterais, há pegadas recentes de sapatos que não são de trabalhadores de manutenção — alguém desce ali embaixo com frequência e caminha sempre na direção das salas laterais secas.\n\n• Cobaias Cirúrgicas: Presos numa grade enferrujada dentro da água suja do cruzamento, há restos de pequenos animais de rua (ratos e pombos) que não morreram afogados: estão abertos com cortes retos e limpos, como se alguém os tivesse usado para testar cortes cirúrgicos ali mesmo e jogado na vala."
          }
        ],
        "notas_mestre": "Indica movimentação frequente no subterrâneo e os testes anatômicos prévios antes do abate ritual."
      },
      {
        "num": 2,
        "title": "A Sala de Tubulação (Sala Iluminada — Meio-Esquerda)",
        "cabecalho": {
          "nome": "A Sala de Tubulação (Sala Iluminada — Meio-Esquerda)",
          "descricao_publica": "Local no Mapa: A plataforma quadrada de pedra à esquerda da vala, onde há um cano grosso na parede, alguns barris velhos de manutenção e uma lâmpada amarela/laranja fraca acesa perto de uma válvula vermelha.\n\nUma área técnica comum do esgoto, usada originalmente para controlar a pressão dos canos do bairro. O chão de cimento está seco, mas sujo de poeira e graxa. Alguém puxou um fio clandestino para manter a lâmpada da parede acesa e usou o topo dos barris enferrujados como mesa improvisada para deixar papéis e cadernos longe da água suja."
        },
        "testes": [
          {
            "pericia": "Investigação ou Ocultismo",
            "ct_dt": 7,
            "informacao_revelada": "Pistas Desbloqueadas (Os Cadernos de Estudo sobre \"Ele\"):\n\n• Por que comer a carne (Anotações em Tinta Roxa):\nDentro de uma pasta plástica suja em cima dos barris, há folhas escritas à mão (com a mesma caneta de tinta roxa do cartaz lá de cima). O texto trata o ritual de Sara de forma totalmente fria e calculista, explicando o verdadeiro motivo da ordem de devorar alguém:\n\n\"Anotação #14: Os jovens do Pavilhão abrem as Caixas facilmente porque já desistiram de viver, mas a doença e o sofrimento prolongado deixam suas almas fracas, quase sem Energia Astral. Quando passam pela Porta assim, Ele recebe muito pouco alimento.\"\n\n\"Anotação #19: A carne e o sangue de alguém saudável guardam energia astral limpa. Fazendo o escolhido matar uma vítima e engolir a carne quente antes de abrir a Porta, essa energia fica retida temporariamente dentro dele. Eles acreditam que estão cumprindo uma ordem sagrada Dele para merecer o descanso, sem saber que estão apenas engordando a própria energia interior para que Ele se alimente melhor quando atravessarem.\"\n\n• O Segredo da Caixa Negra:\nRascunhos mostram desenhos da Caixa Negra e Dourada e confirmam por que o grupo não conseguiu abri-la: a caixa não tem fechadura mecânica; ela só destranca quando tocada por alguém que carrega uma condenação real de morte no corpo e já perdeu qualquer esperança de futuro."
          }
        ],
        "notas_mestre": "Revela a verdade perturbadora do culto: o rito canibal serve para 'cevar' a alma condenada com energia astral limpa antes da passagem para alimentar 'Ele'."
      },
      {
        "num": 3,
        "title": "O Depósito Velho de Manutenção (Sala de Madeira — Direita)",
        "cabecalho": {
          "nome": "O Depósito Velho de Manutenção (Sala de Madeira — Direita)",
          "descricao_publica": "Local no Mapa: O cômodo grande com piso de tábuas de madeira velha à direita do canal, cheio de barris encostados nas paredes, caixas de papelão/madeira no meio e uma escada de madeira quebrada que dava para o andar de cima.\n\nUm depósito subterrâneo comum, cheio de teias de aranha, cheiro de madeira mofada e barris vazios que antigamente guardavam produtos de limpeza da rede de água. No meio das caixas velhas perto da escada quebrada, há pertences escondidos por quem usa o esgoto."
        },
        "testes": [
          {
            "pericia": "Investigação (Caixas Abertas)",
            "ct_dt": 6,
            "informacao_revelada": "• Fichas Médicas Roubadas: Uma caixa de arquivo contém prontuários médicos reais tirados de hospitais e clínicas de Fraguiktos — incluindo os exames de câncer da Sara Auguil e de outros adolescentes do círculo (como a Bia). Quem lidera o culto usa esses arquivos para escolher a dedo jovens que vão morrer em breve.\n\n• Máscaras Sujas: Enroladas num pano velho, há duas máscaras lisas trincadas, sujas de barro seco."
          },
          {
            "pericia": "Crime (Estourar Cadeado)",
            "ct_dt": 7,
            "informacao_revelada": "• Itens Úteis (Na caixa com cadeado): Suprimentos guardados para emergências (2d4 Vidrilhos, kit de primeiros socorros básico ou lanterna/pilhas de reposição)."
          }
        ],
        "notas_mestre": "Prova o vazamento criminoso de prontuários médicos para seleção de jovens vulneráveis e fornece suprimentos de sobrevivência."
      },
      {
        "num": 4,
        "title": "O Canto Desmoronado e a Estátua da Árvore (Canto Inferior Esquerdo)",
        "cabecalho": {
          "nome": "O Canto Desmoronado e a Estátua da Árvore (Canto Inferior Esquerdo)",
          "descricao_publica": "Local no Mapa: A salinha torta no canto inferior esquerdo, depois de um corredor estreito e escuro que sai da sala dos canos; o fundo tem o piso quebrado em meia-lua com velas no chão e uma escultura em forma de árvore seca/raízes.\n\nUm fim de túnel sem saída do esgoto, onde parte do concreto antigo cedeu. Ao contrário do resto da galeria comum, alguém limpou a lama desse canto e montou um altar improvisado no escuro: no chão de pedra úmida, cercada por tocos de velas derretidas, há uma estátua estranha esculpida na forma de uma Árvore retorcida e sem folhas."
        },
        "testes": [
          {
            "pericia": "Ocultismo ou Investigação",
            "ct_dt": 7,
            "informacao_revelada": "Pistas Desbloqueadas (O Estudo sobre a Árvore e \"Ele\"):\n\n• O que é a Estátua: A árvore é feita de madeira escura velha misturada com ferro retorcido e fios laranjas amarrados nos galhos. Preso na base da estátua, há um caderno aberto cheio de anotações de estudo sobre a relação entre \"Ele\" e as árvores da mata:\n\n\"O que os jovens chamam de 'Jardim' nos seus delírios é a própria extensão Dele. Ele não habita um céu; Ele cresce como uma raiz parasita entre os planos. Toda vez que uma Caixa é usada nas árvores do bosque, a Porta não leva ninguém para descansar — ela usa o corpo e a energia acumulada da vítima como semente para que as vinhas Dele atravessem para o nosso lado.\"\n\n• Amostra nas Raízes (Conexão com o Jornal da Parte 4): Preso num pote de vidro sujo aos pés da estátua da árvore, há um pedaço ressecado e morto de uma vinha de cor prateada (exatamente igual às vinhas prateadas que aparecerão no plantão de TV horas depois nos cadáveres de Paládium). Uma etiqueta no vidro diz apenas: \"Amostra recolhida após o evento de Paládium — A semente responde à mesma entidade.\""
          }
        ],
        "notas_mestre": "Conexão crucial com o horror biológico e cósmico: as caixas plantam vinhas prateadas parasitas nos corpos dos jovens para romper a barreira dimensional."
      },
      {
        "num": 5,
        "title": "A Escada de Saída do Bueiro (Corredor Superior Direito ou Final do Canal)",
        "cabecalho": {
          "nome": "A Escada de Saída do Bueiro (Corredor Superior Direito ou Final do Canal)",
          "descricao_publica": "Local no Mapa: A escada de degraus de cimento no canto superior direito do mapa (ou a grade final no fim do canal de água lá embaixo).\n\nUma saída normal de manutenção do esgoto que sobe até uma tampa de bueiro pesada numa rua vazia a duas quadras do Pavilhão Abandonado, permitindo que o grupo saia do subterrâneo em segurança longe da Figura Mascarada."
        },
        "testes": [
          {
            "pericia": "Sem Teste / Ação de Saída",
            "ct_dt": "-",
            "informacao_revelada": "A tampa de ferro fundido dá acesso direto a um beco calmo na periferia de Fraguiktos. O ar fresco da noite alivia a náusea do esgoto e permite que o grupo reorganize seus passos após a fuga do subterrâneo."
          }
        ],
        "notas_mestre": "Ponto de extração seguro que conclui a fuga subterrânea do episódio longe da Figura Mascarada."
      }
    ]
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
          },
          'pavilhao-abandonado': {
            xPct: 76, yPct: 20,
            color: '#a855f7',
            glow: 'rgba(168, 85, 247, 0.75)',
            roadD: 'M 720 320 C 740 240, 750 180, 760 128',
            roadTwinD: 'M 728 320 C 748 240, 758 180, 768 128'
          },
          'galerias-escoamento': {
            xPct: 90, yPct: 35,
            color: '#059669',
            glow: 'rgba(5, 150, 105, 0.75)',
            roadD: 'M 760 128 C 820 140, 870 180, 900 224',
            roadTwinD: 'M 768 128 C 828 140, 878 180, 908 224'
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

    console.log("[MASTER ACTION] Deslocando grupo em definitivo para:", this.selectedAreaId);
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
            console.log("[SYNC MASTER] Área ativa salva no Supabase:", area.id);
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
    const drawer = document.getElementById('npc-dossier-drawer');
    if (drawer) {
      drawer.scrollTop = 0;
    }
  },

  openNpcModal(npcId = null) {
    if (!MesaApp || !MesaApp.state || !MesaApp.state.isMaster) {
      alert("[ACESSO RESTRITO] O Dossiê de NPCs e seus segredos são confidenciais e exclusivos do Mestre. Autentique seu Token de Mestre para consultar.");
      return;
    }

    if (window.MesaApp && typeof MesaApp.closeModal === 'function') {
      MesaApp.closeModal('area-map-modal');
      MesaApp.closeModal('area-info-modal');
    }

    const npcsList = this.getAllNpcs();
    if (npcsList.length === 0) return;

    const targetId = npcId || npcsList[0].id;
    const cleanTarget = String(targetId).trim().toLowerCase();
    const npc = npcsList.find(n => n.id === targetId || n.id === cleanTarget || ((cleanTarget === '???' || cleanTarget === 'interrogacao') && n.id === 'figura-mascarada')) || npcsList[0];
    if (!npc) return;

    const content = document.getElementById('npc-dossier-content');
    if (!content) return;

    const roleName = npc.papel || (npc.ligacao_misterio ? npc.ligacao_misterio.split('.')[0] : 'Personagem Local');

    // 1. Sidebar Items (Coluna Lateral de Selecao)
    const sidebarItemsHtml = npcsList.map(n => {
      const isSelected = n.id === npc.id;
      const thumb = n.ilustracao || (n.id === 'elias-ribeiro' ? 'assets/npcs/elias-ribeiro.png' : (n.id === 'isaque-valente' ? 'assets/npcs/isaque-valente.png' : ''));
      const shortRole = n.papel ? n.papel.split('•')[0].trim() : 'NPC';
      return `
        <button type="button" class="npc-sidebar-item ${isSelected ? 'active' : ''}" onclick="MesaAreaManager.openNpcModal('${n.id}')">
          <div class="npc-sidebar-thumb">
            ${thumb ? `<img src="${thumb}" alt="${n.nome}">` : `<span class="npc-thumb-fallback">${n.nome.charAt(0)}</span>`}
          </div>
          <div class="npc-sidebar-details">
            <span class="npc-sidebar-item-name">${n.nome}</span>
            <span class="npc-sidebar-item-role">${shortRole}</span>
          </div>
        </button>
      `;
    }).join('');

    // 2. Ilustracao e Botao de Exibicao Central
    const ilustracao = npc.ilustracao || (npc.id === 'elias-ribeiro' ? 'assets/npcs/elias-ribeiro.png' : (npc.id === 'isaque-valente' ? 'assets/npcs/isaque-valente.png' : null));
    const isDisplayed = Boolean(window.MesaCenterArtwork && MesaCenterArtwork.active && (MesaCenterArtwork.npcId === npc.id || MesaCenterArtwork.imgUrl === ilustracao));

    // BACKUP: Botao central desativado conforme solicitacao do Mestre
    const artworkHeaderHtml = ilustracao ? `
      <div class="npc-header-artwork-box">
        <div class="npc-header-thumb-preview">
          <img src="${ilustracao}" alt="${npc.nome}">
        </div>
      </div>
    ` : '';

    // 3. Atributos
    let attrsHtml = '';
    if (npc.atributos) {
      const keys = Object.keys(npc.atributos);
      attrsHtml = keys.map(k => `
        <div class="npc-attr-card">
          <span class="npc-attr-label">${k}</span>
          <span class="npc-attr-value">${npc.atributos[k]}</span>
        </div>
      `).join('');
    }

    // 4. Equipamento como tags simples
    let equipHtml = '';
    if (Array.isArray(npc.equipamento) && npc.equipamento.length > 0) {
      const tags = npc.equipamento.map(eq => `<span class="npc-pill-tag npc-pill-equip">${eq}</span>`).join('');
      equipHtml = `
        <div class="npc-tactical-sub">
          <span class="npc-sub-label">Equipamento & Itens</span>
          <div class="npc-tags-container">${tags}</div>
        </div>
      `;
    }

    // 5. Pericias Treinadas (nomes puros das regras)
    let periciasHtml = '';
    if (Array.isArray(npc.pericias) && npc.pericias.length > 0) {
      const tags = npc.pericias.map(p => `<span class="npc-pill-tag npc-pill-pericia">${p}</span>`).join('');
      periciasHtml = `
        <div class="npc-tactical-sub">
          <span class="npc-sub-label">Perícias Treinadas <span class="npc-caption-dim">(Vantagem Automática)</span></span>
          <div class="npc-tags-container">${tags}</div>
        </div>
      `;
    }

    // 6. Habilidades com custos em PE
    let habilidadesHtml = '';
    if (Array.isArray(npc.habilidades) && npc.habilidades.length > 0) {
      const cards = npc.habilidades.map(h => `
        <div class="npc-ability-card">
          <div class="npc-ability-header">
            <span class="npc-ability-name">${h.nome}</span>
            <span class="npc-ability-type-badge">${h.tipo}</span>
          </div>
          <p class="npc-ability-effect">${h.efeito}</p>
        </div>
      `).join('');
      habilidadesHtml = `
        <div class="npc-tactical-sub">
          <span class="npc-sub-label">Habilidades</span>
          <div class="npc-abilities-grid">${cards}</div>
        </div>
      `;
    }

    // 7. O Que Ele Sabe (Topicos de revelacoes e pistas)
    let oQueSabeHtml = '';
    if (Array.isArray(npc.o_que_sabe) && npc.o_que_sabe.length > 0) {
      const items = npc.o_que_sabe.map(topic => {
        const sepIdx = topic.indexOf(':');
        if (sepIdx > 0 && sepIdx < 45) {
          const title = topic.substring(0, sepIdx);
          const text = topic.substring(sepIdx + 1);
          return `<li class="npc-info-item npc-know-item">
            <strong class="npc-info-lead">${title}:</strong>
            <span class="npc-info-body">${text}</span>
          </li>`;
        }
        return `<li class="npc-info-item npc-know-item"><span class="npc-info-body">${topic}</span></li>`;
      }).join('');

      oQueSabeHtml = `
        <div class="npc-investigation-box npc-box-know">
          <div class="npc-box-heading">
            <svg class="npc-box-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
            <h4>O Que Ele Sabe <span class="npc-box-subtag">Revelações & Pistas</span></h4>
          </div>
          <ul class="npc-investigation-list">${items}</ul>
        </div>
      `;
    }

    // 8. O Que Ele NÃO Sabe (Limites narrativos com aviso para o Mestre)
    let oQueNaoSabeHtml = '';
    if (Array.isArray(npc.o_que_nao_sabe) && npc.o_que_nao_sabe.length > 0) {
      const items = npc.o_que_nao_sabe.map(topic => {
        const sepIdx = topic.indexOf(':');
        if (sepIdx > 0 && sepIdx < 45) {
          const title = topic.substring(0, sepIdx);
          const text = topic.substring(sepIdx + 1);
          return `<li class="npc-info-item npc-dont-know-item">
            <strong class="npc-info-lead">${title}:</strong>
            <span class="npc-info-body">${text}</span>
          </li>`;
        }
        return `<li class="npc-info-item npc-dont-know-item"><span class="npc-info-body">${topic}</span></li>`;
      }).join('');

      oQueNaoSabeHtml = `
        <div class="npc-investigation-box npc-box-dont-know">
          <div class="npc-box-heading">
            <svg class="npc-box-icon warning-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <h4>O Que Ele NÃO Sabe <span class="npc-box-subtag warn-tag">Limites Narrativos do Mestre</span></h4>
          </div>
          <p class="npc-narrative-warning">Aviso ao Mestre: Este personagem desconhece as informações abaixo. Evite revelá-las durante a interpretação ou diálogos com ele.</p>
          <ul class="npc-investigation-list">${items}</ul>
        </div>
      `;
    }

    content.innerHTML = `
      <div class="npc-dossier-layout">
        <!-- Coluna Lateral de Seleção -->
        <aside class="npc-dossier-sidebar">
          <div class="npc-sidebar-head">
            <span class="npc-sidebar-title">Personagens</span>
            <span class="npc-sidebar-count">${npcsList.length}</span>
          </div>
          <div class="npc-sidebar-list">
            ${sidebarItemsHtml}
          </div>
        </aside>

        <!-- Coluna Principal de Leitura -->
        <main class="npc-dossier-main">
          <!-- Cabeçalho -->
          <div class="npc-main-header">
            <div class="npc-main-header-info">
              <div class="npc-main-name-row">
                <h2 class="npc-main-name">${npc.nome}</h2>
                <div class="npc-vitals-wrap">
                  ${npc.pv !== undefined ? `<span class="npc-vital-pill npc-pill-pv" title="Pontos de Vida"><strong class="pill-k">PV</strong> <span class="pill-v">${npc.pv}</span></span>` : ''}
                  ${npc.pe !== undefined ? `<span class="npc-vital-pill npc-pill-pe" title="Pontos de Esforço"><strong class="pill-k">PE</strong> <span class="pill-v">${npc.pe}</span></span>` : ''}
                  ${npc.deslocamento ? `<span class="npc-vital-pill npc-pill-desloc" title="Deslocamento"><strong class="pill-k">DESL</strong> <span class="pill-v">${npc.deslocamento}</span></span>` : ''}
                </div>
              </div>
              <div class="npc-main-role">${roleName}</div>
            </div>
            
            ${artworkHeaderHtml}
          </div>

          <!-- Bloco Tático -->
          <section class="npc-section-block npc-tactical-block">
            <div class="npc-section-heading">
              <h3 class="npc-section-title">Bloco Tático</h3>
              <span class="npc-section-badge">Combate & Ficha</span>
            </div>

            <!-- Atributos -->
            <div class="npc-tactical-sub">
              <span class="npc-sub-label">Atributos</span>
              <div class="npc-attributes-row">
                ${attrsHtml}
              </div>
            </div>

            <!-- Equipamento -->
            ${equipHtml}

            <!-- Perícias Treinadas -->
            ${periciasHtml}

            <!-- Habilidades -->
            ${habilidadesHtml}
          </section>

          <!-- Módulo de Investigação -->
          <section class="npc-section-block npc-investigation-block">
            <div class="npc-section-heading">
              <h3 class="npc-section-title">Módulo de Investigação</h3>
              <span class="npc-section-badge">Pistas & Condução</span>
            </div>

            <!-- 1. Perfil e Postura -->
            <div class="npc-investigative-subblock">
              <div class="npc-profile-card">
                <span class="npc-field-tag">Perfil e Postura</span>
                <p class="npc-field-text">${npc.personalidade || 'Sem registro de personalidade.'}</p>
              </div>
              <div class="npc-profile-card">
                <span class="npc-field-tag">História Resumida</span>
                <p class="npc-field-text">${npc.historia_resumida || 'Sem histórico registrado.'}</p>
              </div>
            </div>

            <!-- 2. O Que Ele Sabe -->
            ${oQueSabeHtml}

            <!-- 3. O Que Ele NÃO Sabe -->
            ${oQueNaoSabeHtml}

            <!-- 4. Interrogatório e Gatilhos -->
            <div class="npc-interrogatorio-wrap">
              <div class="npc-callout-card npc-callout-casual">
                <span class="npc-callout-tag">Informação Livre (Conversa Casual)</span>
                <p>${npc.informacao_livre || 'Nenhuma informação casual.'}</p>
              </div>

              <div class="npc-callout-card npc-callout-secret">
                <span class="npc-callout-tag">Segredo Útil</span>
                <p>${npc.segredo_util || 'Nenhum segredo útil registrado.'}</p>
              </div>

              <div class="npc-callout-card npc-callout-trigger">
                <span class="npc-callout-tag">Gatilhos de Revelação (Testes & Dificuldades)</span>
                <p>${npc.gatilho_revelacao || 'Sem gatilhos específicos.'}</p>
              </div>

              ${npc.notas_mestre ? `
                <div class="npc-callout-card npc-callout-master">
                  <span class="npc-callout-tag">Notas do Mestre</span>
                  <p>${npc.notas_mestre.replace(/\n/g, '<br><br>')}</p>
                </div>
              ` : ''}
            </div>
          </section>
        </main>
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

    const masterSection = document.getElementById('quick-menu-master-section');
    if (masterSection) {
      masterSection.style.display = isMaster ? 'block' : 'none';
    }
    const masterBadge = document.getElementById('quick-menu-master-badge');
    if (masterBadge) {
      masterBadge.style.display = isMaster ? 'inline-block' : 'none';
    }

    const menuAreaBtn = document.getElementById('menu-area-btn');
    if (menuAreaBtn) {
      menuAreaBtn.style.display = isMaster ? 'flex' : 'none';
    }

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

    const navEsconderijoBtn = document.getElementById('nav-esconderijo-btn');
    if (navEsconderijoBtn) {
      navEsconderijoBtn.style.display = isMaster ? 'inline-flex' : 'none';
    }
    const menuEsconderijoBtn = document.getElementById('menu-esconderijo-btn');
    if (menuEsconderijoBtn) {
      menuEsconderijoBtn.style.display = isMaster ? 'flex' : 'none';
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
    const fabBtn = document.getElementById('mesa-mobile-fab-btn');
    if (fabBtn && !fabBtn._hasFabBound) {
      fabBtn._hasFabBound = true;
      fabBtn.addEventListener('click', (e) => {
        if (e && e.stopPropagation) e.stopPropagation();
        this.toggle(e);
      });
    }
    document.addEventListener('click', (e) => {
      const container = document.getElementById('mesa-mobile-fab-container');
      if (container && this.isOpen && !container.contains(e.target)) {
        this.close();
      }
    });
    this.updateState();
  },

  toggle(e) {
    if (e && e.stopPropagation) e.stopPropagation();
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
    const mobileEsconderijo = document.getElementById('mobile-esconderijo-item');
    if (mobileEsconderijo) {
      mobileEsconderijo.style.display = isMaster ? 'flex' : 'none';
    }
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
window.MesaMobileMenu = MesaMobileMenu;

document.addEventListener('DOMContentLoaded', async () => {
  if (window.MesaMediaPlayer) MesaMediaPlayer.init();
  if (window.MesaCombate) MesaCombate.init();
  MesaMobileMenu.init();
  const savedToken = localStorage.getItem('wu_user_token') || localStorage.getItem('mesa_token');
  await MesaApp.init(savedToken);
  MesaMobileMenu.updateState();
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

  // Fecha Ficha, Dossie de NPCs e menus ao pressionar Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (document.body.classList.contains('npc-drawer-open')) {
        if (window.MesaAreaManager) MesaAreaManager.closeNpcDrawer();
        else document.body.classList.remove('npc-drawer-open');
        return;
      }
      if (document.body.classList.contains('interior-drawer-open')) {
        if (window.MesaAreaManager) MesaAreaManager.closeInteriorDrawer();
        else document.body.classList.remove('interior-drawer-open');
        return;
      }
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
      if (window.MesaDispositivos && MesaDispositivos.isOpen) {
        MesaDispositivos.closeDrawer();
      }
      if (window.MesaQuickMenu) {
        MesaQuickMenu.close();
      }
    }
  });

  // Garante que o Dossie de NPCs feche confiavelmente ao clicar no botao de fechar ou no backdrop
  document.addEventListener('click', (e) => {
    if (e.target && (e.target.matches('#npc-drawer-backdrop') || e.target.closest('#npc-dossier-drawer .npc-drawer-close-btn'))) {
      if (document.body.classList.contains('npc-drawer-open')) {
        if (window.MesaAreaManager) MesaAreaManager.closeNpcDrawer();
        else document.body.classList.remove('npc-drawer-open');
      }
    }
  });

  if (window.MesaOwlbear) {
    MesaOwlbear.init();
  }
  if (window.MesaCenterArtwork) {
    MesaCenterArtwork.init();
  }
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
        if (can.estoque !== undefined && merged[idx].estoque === undefined) {
          merged[idx].estoque = can.estoque;
          changed = true;
        }
        if (can.quantidade !== undefined && merged[idx].quantidade === undefined) {
          merged[idx].quantidade = can.quantidade;
          changed = true;
        }
        if (merged[idx].posse === undefined) {
          merged[idx].posse = can.posse !== undefined ? can.posse : null;
          changed = true;
        }
        if (['col_notebook_sara', 'col_livro_viajante_terra', 'col_caixa_negra_dourada', 'col_fita_01', 'col_fita_02'].includes(can.id)) {
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

    // Prioridade 1: Sincronização canônica remota do Supabase
    const raw = (MesaApp && MesaApp.state && (MesaApp.state.rawRow1Atributos || (MesaApp.state.players && MesaApp.state.players[0] && MesaApp.state.players[0].atributos)));
    if (raw) {
      try {
        const attrs = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (attrs && Array.isArray(attrs._sys_coletaveis) && attrs._sys_coletaveis.length > 0) {
          const { items: merged, changed } = this.mergeCanonical(attrs._sys_coletaveis);
          if (Array.isArray(this.items) && this.items.length > 0) {
            this.items.forEach(it => {
              if (it && it.id && !merged.some(m => m.id === it.id)) {
                merged.push(it);
              }
            });
          }
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
          if (Array.isArray(this.items) && this.items.length > 0) {
            this.items.forEach(it => {
              if (it && it.id && !merged.some(m => m.id === it.id)) {
                merged.push(it);
              }
            });
          }
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
          const isCartaz = it.id === 'col_cartaz_desaparecido' || it.id === 'col_panfleto_anotado_kali';
          const isGravador = it.id === 'col_gravador_fita_01' || it.id === 'col_gravador_bolso_02';
          const isFita = it.id === 'col_fita_01' || it.id === 'col_fita_02';
          const isClickable = isBook || isDiario || isCaixa || isNotebook || isCartaz || isGravador || isFita;
          const clickAction = isBook ? `MesaLivroReader.open('col_livro_viajante_terra')` : (isDiario ? `MesaLivroReader.open('col_diario_sara')` : (isCaixa ? `MesaLivroReader.open('col_caixa_negra_dourada')` : (isNotebook ? `if(window.MesaNotebookSara) MesaNotebookSara.open()` : (isCartaz ? `MesaLivroReader.open('col_cartaz_desaparecido')` : ((isGravador || isFita) ? `MesaLivroReader.open('${it.id}')` : '')))));
          const clickTitle = isBook ? 'Clique para folhear e ler este livro' : (isDiario ? 'Clique para abrir e ler a página do diário' : (isCaixa ? 'Clique para inspecionar a caixa selada' : (isNotebook ? 'Clique para acessar as câmeras de segurança' : (isCartaz ? 'Clique para examinar o cartaz e ler o verso' : (isFita ? 'Clique para ouvir os ecos da fita espectral' : '')))));

          return `
            <div class="coletavel-card ${isClickable ? 'clickable-item' : ''}" style="padding: 12px 14px;" ${isClickable ? `onclick="${clickAction}" title="${clickTitle}"` : ''}>
              <div class="coletavel-card-header">
                <h4 class="coletavel-card-title" style="font-size: 0.95rem; color: #fbbf24;">${it.nome}</h4>
                <div class="coletavel-card-badges">
                  <span class="coletavel-card-badge">${it.tipo || 'Item'}</span>
                  <span class="coletavel-weight-badge">Peso ${it.peso !== undefined ? it.peso : 0}</span>
                  ${(it.estoque != null || (it.quantidade != null && Number(it.quantidade) > 0)) ? `<span class="coletavel-stock-badge">Estoque: ${it.estoque != null ? it.estoque : it.quantidade}</span>` : ''}
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
              ${isCartaz ? `
                <button type="button" class="coletavel-read-book-btn" onclick="event.stopPropagation(); MesaLivroReader.open('col_cartaz_desaparecido');" style="background: rgba(168, 85, 247, 0.16); border-color: rgba(168, 85, 247, 0.45); color: #c084fc;">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                  <span>Examinar Cartaz (Frente e Verso)</span>
                </button>
              ` : ''}
              ${isGravador ? `
                <button type="button" class="coletavel-read-book-btn" onclick="event.stopPropagation(); MesaLivroReader.open('${it.id}');" style="background: rgba(245, 158, 11, 0.16); border-color: rgba(245, 158, 11, 0.45); color: #fbbf24;">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                  <span>Ouvir e Ler Transcrição da Fita</span>
                </button>
              ` : ''}
              ${isFita ? `
                <button type="button" class="coletavel-read-book-btn" onclick="event.stopPropagation(); MesaLivroReader.open('${it.id}');" style="background: rgba(249, 115, 22, 0.16); border-color: rgba(249, 115, 22, 0.55); color: #fb923c;">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                  <span>Ouvir Ecos da Fita Espectral</span>
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
          const isCartaz = it.id === 'col_cartaz_desaparecido' || it.id === 'col_panfleto_anotado_kali';
          const isGravador = it.id === 'col_gravador_fita_01' || it.id === 'col_gravador_bolso_02';
          const isFita = it.id === 'col_fita_01' || it.id === 'col_fita_02';
          const isClickable = isBook || isDiario || isCaixa || isNotebook || isCartaz || isGravador || isFita;
          const clickAction = isBook ? `MesaLivroReader.open('col_livro_viajante_terra')` : (isDiario ? `MesaLivroReader.open('col_diario_sara')` : (isCaixa ? `MesaLivroReader.open('col_caixa_negra_dourada')` : (isNotebook ? `if(window.MesaNotebookSara) MesaNotebookSara.open()` : (isCartaz ? `MesaLivroReader.open('col_cartaz_desaparecido')` : ((isGravador || isFita) ? `MesaLivroReader.open('${it.id}')` : '')))));
          const clickTitle = isBook ? 'Clique para folhear e ler este livro' : (isDiario ? 'Clique para abrir e ler a página do diário' : (isCaixa ? 'Clique para inspecionar a caixa selada' : (isNotebook ? 'Clique para acessar as câmeras de segurança' : (isCartaz ? 'Clique para examinar o cartaz e ler o verso' : (isFita ? 'Clique para ouvir os ecos da fita espectral' : '')))));

          return `
            <div class="coletavel-card ${isMaster ? (it.desbloqueado ? 'master-unlocked' : 'master-locked') : ''} ${isClickable ? 'clickable-item' : ''}" ${isClickable ? `onclick="${clickAction}" title="${clickTitle}"` : ''}>
              <div class="coletavel-card-header">
                <h3 class="coletavel-card-title">${it.nome}</h3>
                <div class="coletavel-card-badges">
                  ${isMaster ? `<span class="coletavel-status-badge ${it.desbloqueado ? 'unlocked' : 'locked'}">${it.desbloqueado ? 'Liberado' : 'Bloqueado'}</span>` : ''}
                  <span class="coletavel-card-badge">${it.tipo || 'Pista'}</span>
                  <span class="coletavel-weight-badge">Peso ${it.peso !== undefined ? it.peso : 0}</span>
                  ${(it.estoque != null || (it.quantidade != null && Number(it.quantidade) > 0)) ? `<span class="coletavel-stock-badge">Estoque: ${it.estoque != null ? it.estoque : it.quantidade}</span>` : ''}
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
              ${isCartaz ? `
                <button type="button" class="coletavel-read-book-btn" onclick="event.stopPropagation(); MesaLivroReader.open('col_cartaz_desaparecido');" style="background: rgba(168, 85, 247, 0.16); border-color: rgba(168, 85, 247, 0.45); color: #c084fc;">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                  <span>Examinar Cartaz (Frente e Verso)</span>
                </button>
              ` : ''}
              ${isGravador ? `
                <button type="button" class="coletavel-read-book-btn" onclick="event.stopPropagation(); MesaLivroReader.open('${it.id}');" style="background: rgba(245, 158, 11, 0.16); border-color: rgba(245, 158, 11, 0.45); color: #fbbf24;">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                  <span>Ouvir e Ler Transcrição da Fita</span>
                </button>
              ` : ''}
              ${isFita ? `
                <button type="button" class="coletavel-read-book-btn" onclick="event.stopPropagation(); MesaLivroReader.open('${it.id}');" style="background: rgba(249, 115, 22, 0.16); border-color: rgba(249, 115, 22, 0.55); color: #fb923c;">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                  <span>Ouvir Ecos da Fita Espectral</span>
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

    // MODO 0: CARTAZ DE DESAPARECIDO (FRENTE E VERSO)
    if (this.currentDocId === 'col_cartaz_desaparecido' || this.currentDocId === 'col_panfleto_anotado_kali') {
      if (badge) {
        badge.textContent = 'DOCUMENTO DA CAMPANHA • EVIDÊNCIA';
        badge.style.display = 'inline-block';
      }
      if (title) title.textContent = 'CARTAZ DE DESAPARECIDO';
      if (subtitle) {
        subtitle.textContent = 'Pavilhão de Acolhimento Abandonado • Folha A4 Amarelada';
        subtitle.style.display = 'block';
      }
      if (controls) controls.style.display = 'none';
      if (note) note.textContent = 'Folha de papel sulfite A4 amarelada e amassada nas bordas. O verso foi totalmente utilizado como rascunho de vigilância.';
      if (container) {
        container.innerHTML = `
          <div class="livro-single-doc-wrap" style="display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 6px 4px;">
            
            <div style="width: 100%; max-width: 620px; background: #fffcf2; color: #111111; border: 2px solid #33281e; border-radius: 4px; padding: 24px 26px; box-shadow: 0 8px 32px rgba(0,0,0,0.85); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #1a1a1a; padding-bottom: 8px; margin-bottom: 12px;">
                <span style="font-size: 0.8rem; font-weight: 900; letter-spacing: 2px; color: #222222; text-transform: uppercase;">FRENTE DO CARTAZ</span>
                <span style="font-size: 0.72rem; font-weight: 800; color: #444444; letter-spacing: 1px; text-transform: uppercase;">FOLHA A4</span>
              </div>
              <div style="text-align: center; margin-bottom: 12px;">
                <h2 style="font-size: 2.2rem; font-weight: 900; margin: 0; letter-spacing: 3px; color: #000000; text-transform: uppercase;">PROCURA-SE</h2>
              </div>
              <div style="display: flex; justify-content: center; margin: 0 0 16px;">
                <div style="background: #ffffff; padding: 6px 6px 10px; border: 2px solid #222222; box-shadow: 0 4px 14px rgba(0,0,0,0.22); border-radius: 2px; max-width: 200px; text-align: center;">
                  <img src="assets/kali_cartaz.png" alt="Retrato de Kali" style="width: 100%; height: auto; max-height: 240px; object-fit: cover; display: block; border: 1px solid #444444;" />
                  <span style="display: block; margin-top: 6px; font-size: 0.72rem; font-weight: 800; color: #222222; letter-spacing: 1px; text-transform: uppercase;">KALI (FOTO RECENTE)</span>
                </div>
              </div>
              <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.95rem; line-height: 1.55; color: #111111;">
                <div style="padding-bottom: 6px; border-bottom: 1px solid rgba(0,0,0,0.12);">
                  <strong style="color: #000000; font-size: 0.95rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; min-width: 145px;">Nome:</strong>
                  <span style="color: #000000; font-weight: 800; font-size: 1.05rem;">Kali</span>
                  <span style="color: #333333; font-size: 0.85rem; font-weight: 600; margin-left: 4px;">(Sem sobrenome divulgado nos panfletos públicos)</span>
                </div>
                <div style="padding-bottom: 6px; border-bottom: 1px solid rgba(0,0,0,0.12);">
                  <strong style="color: #000000; font-size: 0.95rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; display: inline-block; min-width: 145px;">Idade Aparente:</strong>
                  <span style="color: #000000; font-weight: 700; font-size: 1rem;">Aprox. 9 a 11 anos</span>
                </div>
                <div style="padding-bottom: 6px; border-bottom: 1px solid rgba(0,0,0,0.12);">
                  <strong style="color: #000000; font-size: 0.95rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">Descrição Física:</strong>
                  <span style="color: #111111; font-weight: 600; font-size: 0.95rem; line-height: 1.5;">Akivus, cabelos castanhos curtos, olhos expressivos e usa um tapa-olho no olho direito. Veste-se com uma blusa de frio simples e foi vista pela última vez usando um marcante laço de cabelo rosa.</span>
                </div>
                <div style="padding-bottom: 6px; border-bottom: 1px solid rgba(0,0,0,0.12);">
                  <strong style="color: #000000; font-size: 0.95rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 2px;">Último Visto:</strong>
                  <span style="color: #111111; font-weight: 600; font-size: 0.95rem; line-height: 1.5;">Desaparecida desde a tarde do dia 01/08/2061, vista nas proximidades do bosque da Mata do Norte, nos limites do subúrbio de Fraguiktos.</span>
                </div>
                <div style="margin-top: 4px;">
                  <strong style="color: #000000; font-size: 0.95rem; font-weight: 900; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px;">Informações:</strong>
                  <div style="background: rgba(0,0,0,0.05); border-left: 4px solid #111111; padding: 10px 14px; font-style: italic; color: #000000; font-weight: 600; font-size: 0.93rem; line-height: 1.55;">
                    “Se você viu qualquer coisa ou tem pistas sobre o paradeiro de Kali, por favor, entre em contato com as autoridades locais ou ligue para o número abaixo. A família oferece recompensa por qualquer pista real.”
                  </div>
                </div>
                <div style="font-size: 0.85rem; color: #222222; font-weight: 700; margin: 10px 0 0; text-align: center; border-top: 1px dashed #666666; padding-top: 8px;">
                  [Há um número de telefone rasurado à mão no rodapé da folha]
                </div>
              </div>
            </div>

            
            <div style="width: 100%; max-width: 620px; background: #fffcf2; color: #111111; border: 2px solid #33281e; border-radius: 4px; padding: 24px 26px; box-shadow: 0 8px 32px rgba(0,0,0,0.85); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 2px solid #581c87; padding-bottom: 8px; margin-bottom: 12px;">
                <span style="font-size: 0.8rem; font-weight: 900; letter-spacing: 2px; color: #3b0764; text-transform: uppercase;">VERSO DO CARTAZ</span>
                <span style="font-size: 0.72rem; font-weight: 800; color: #581c87; letter-spacing: 1px; text-transform: uppercase; border: 1px solid #7e22ce; padding: 2px 8px; border-radius: 2px; background: rgba(126, 34, 206, 0.08);">ANOTAÇÕES EM TINTA ROXA</span>
              </div>
              <p style="font-size: 0.92rem; color: #262626; margin: 0 0 12px; line-height: 1.5; font-weight: 600;">
                Ao virar o papel, é possível notar que o verso foi totalmente utilizado como rascunho de vigilância:
              </p>
              <div style="padding: 14px 16px; background: rgba(107, 33, 168, 0.06); border-left: 4px solid #6b21a8; border-radius: 0 4px 4px 0; font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 0.92rem; line-height: 1.65; color: #3b0764;">
                <div style="font-weight: 900; color: #581c87; text-transform: uppercase; letter-spacing: 1px; font-size: 0.8rem; margin-bottom: 8px;">Anotações à Margem (Tinta Roxa):</div>
                <p style="margin: 0 0 8px; color: #2e1065;"><strong style="color: #4a044e; font-weight: 900;">Terça-feira (14:15)</strong> — Saiu da aula antes dos outros. Caminha sozinha pela orla da mata.</p>
                <p style="margin: 0 0 10px; color: #2e1065;"><strong style="color: #4a044e; font-weight: 900;">Quinta-feira (14:10)</strong> — O mesmo trajeto. Ninguém a acompanha. O bosque está silencioso neste horário.</p>
                <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed rgba(107, 33, 168, 0.35); color: #4a044e; font-weight: 900; font-size: 0.95rem; line-height: 1.5;">
                  <span style="text-decoration: underline; text-underline-offset: 3px; color: #581c87;">Conclusão:</span> Perfeita para a transição. O sacrifício está pronto para a salvação da Proscrita.
                </div>
              </div>
            </div>
          </div>
        `;
      }
      return;
    }

    // MODO GRAVADOR DE FITA #01
    if (this.currentDocId === 'col_gravador_fita_01') {
      if (badge) {
        badge.textContent = 'REGISTRO DE ÁUDIO • EVIDÊNCIA #01';
        badge.style.display = 'inline-block';
      }
      if (title) title.textContent = 'GRAVADOR DE FITA #01: A EXIGÊNCIA DA PASSAGEM';
      if (subtitle) {
        subtitle.textContent = 'Pavilhão de Acolhimento Abandonado • Gaveta do Mezanino';
        subtitle.style.display = 'block';
      }
      if (controls) controls.style.display = 'none';
      if (note) note.textContent = 'Fita magnética gravada encontrada na gaveta emperrada da escrivaninha de ferro.';
      if (container) {
        container.innerHTML = `
          <div class="livro-single-doc-wrap" style="display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 6px 4px;">
            <div style="width: 100%; max-width: 640px; background: rgba(14, 16, 22, 0.96); border: 1.5px solid rgba(245, 158, 11, 0.45); border-radius: 4px; padding: 22px 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.9);">
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(245, 158, 11, 0.3); padding-bottom: 8px; margin-bottom: 14px;">
                <span style="font-size: 0.82rem; font-weight: 800; color: #fbbf24; letter-spacing: 1.5px; font-family: monospace;">FITA CASSETE • LADO A</span>
                <span style="font-size: 0.72rem; color: #9ca3af; font-family: monospace;">ÁUDIO RECUPERADO</span>
              </div>
              <div style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 0.92rem; line-height: 1.7; color: #e5e7eb;">
                <p style="margin: 0 0 10px; color: #9ca3af; font-style: italic;">[O botão 'Play' afunda com um estalo. Som de goteiras no galpão escuro. Ouve-se uma respiração curta, chiada, e o barulho metálico da Caixa Negra já destrancada no colo de Sara]</p>
                <p style="margin: 0 0 10px;"><strong style="color: #fbbf24;">— Voz da Mulher</strong> (calma, solene, com autoridade mansa e inquestionável): "Muito bem, Sara. Olhe para ela aberta no seu colo. A primeira parte acabou. O seu espírito finalmente soltou as amarras deste mundo. Você já não pertence mais a esta vida."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #60a5fa;">— Sara</strong> (demora segundos para responder; voz arrastada, oca, de quem já está com a mente completamente derretida): "...Já posso ir? Nas árvores... eu já posso passar?"</p>
                <p style="margin: 0 0 10px;"><strong style="color: #fbbf24;">— Voz da Mulher</strong>: "Ainda não, minha querida. A chave está na sua mão, mas a Porta não se abre para quem chega de mãos vazias. Como eu lhe disse desde o primeiro dia... a dor que nós sentimos aqui fora nos esvazia. Olhe para você: o sofrimento secou tudo o que havia aí dentro. E Ele não aceita cascas vazias no Jardim."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #60a5fa;">— Sara</strong> (um murmúrio confuso, lento, quase infantil): "Vazia... Eu tô vazia. Mas... o que que falta?"</p>
                <p style="margin: 0 0 10px;"><strong style="color: #fbbf24;">— Voz da Mulher</strong> (o tom fica mais baixo, frio e dogmático): "A ordem Dele para a passagem é clara, Sara. Antes de cruzar o arco, você deve tomar para dentro de si uma vida que ainda esteja cheia. Você precisa abater o cordeiro e consumir da sua carne ainda quente."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #60a5fa;">— Sara</strong> (pausa longa no escuro; a respiração falha um pouco): "...Comer? Mas... por quê?"</p>
                <p style="margin: 0 0 10px;"><strong style="color: #fbbf24;">— Voz da Mulher</strong>: "Porque é a vontade Dele para que a travessia se cumpra. Não cabe a nós questionar o rito, menina, apenas obedecer. As pessoas lá fora passam a vida inteira engolindo remédios amargos, suportando humilhações e agonizando em camas de hospital em troca de nada... Você vai recusar um único ato sagrado em troca da eternidade sem dor? Quando você engolir aquela carne, a centelha que falta ficará guardada dentro de você. Só assim Ele a reconhecerá quando a Porta abrir."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #60a5fa;">— Sara</strong> (silêncio pesado; depois, uma voz submissa e anestesiada): "...Se Ele mandou... então eu faço. Só quero que pare de doer."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #fbbf24;">— Voz da Mulher</strong> (num sussurro acariciante): "Eu sabia que você estava pronta. Amanhã, às duas e quinze, na beira do bosque. Ela passa sozinha. Cumpra o que Ele pediu... e o seu descanso estará esperando."</p>
                <p style="margin: 0 0 12px;"><strong style="color: #60a5fa;">— Sara</strong> (num sopro quase inaudível): "...Duas e quinze. Como Ele pediu..."</p>
                <p style="margin: 0; color: #9ca3af; font-style: italic;">[Clique seco desligando o aparelho]</p>
              </div>
            </div>
          </div>
        `;
      }
      return;
    }

    // MODO GRAVADOR DE BOLSO #02
    if (this.currentDocId === 'col_gravador_bolso_02') {
      if (badge) {
        badge.textContent = 'REGISTRO DE ÁUDIO • EVIDÊNCIA #02';
        badge.style.display = 'inline-block';
      }
      if (title) title.textContent = 'GRAVADOR DE BOLSO #02: POR TRÁS DA MÁSCARA';
      if (subtitle) {
        subtitle.textContent = 'Pavilhão de Acolhimento Abandonado • Mochilas Mofadas';
        subtitle.style.display = 'block';
      }
      if (controls) controls.style.display = 'none';
      if (note) note.textContent = 'Gravador branco com tampa presa por fita adesiva, contendo o diálogo confidencial entre Sara e Bia.';
      if (container) {
        container.innerHTML = `
          <div class="livro-single-doc-wrap" style="display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 6px 4px;">
            <div style="width: 100%; max-width: 640px; background: rgba(14, 16, 22, 0.96); border: 1.5px solid rgba(168, 85, 247, 0.45); border-radius: 4px; padding: 22px 24px; box-shadow: 0 8px 32px rgba(0,0,0,0.9);">
              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(168, 85, 247, 0.3); padding-bottom: 8px; margin-bottom: 14px;">
                <span style="font-size: 0.82rem; font-weight: 800; color: #c084fc; letter-spacing: 1.5px; font-family: monospace;">GRAVADOR DE BOLSO • TRANSCRIÇÃO</span>
                <span style="font-size: 0.72rem; color: #9ca3af; font-family: monospace;">ÁUDIO RECUPERADO</span>
              </div>
              <div style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 0.92rem; line-height: 1.7; color: #e5e7eb;">
                <p style="margin: 0 0 10px; color: #9ca3af; font-style: italic;">[Chiado de fita. Som de chuva fina batendo nas telhas quebradas. Ouve-se o som de Sara balançando o corpo para frente e para trás numa cadeira de madeira que range sem parar]</p>
                <p style="margin: 0 0 10px;"><strong style="color: #a7f3d0;">— Bia</strong> (voz jovem, cansada, puxando um caixote para sentar perto): "Sara? Achei que todo mundo já tinha vazado... Vai ficar aí no escuro até que horas?"</p>
                <p style="margin: 0 0 10px;"><strong style="color: #60a5fa;">— Sara</strong> (voz baixa, monótona, sem parar de balançar): "...Só esperando dar amanhã."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #a7f3d0;">— Bia</strong> (suspira fundo, acendendo um isqueiro só pra fazer luz por um segundo): "Quem dera eu tivesse pressa pra chegar amanhã. Só de pensar em voltar pra casa, ver meu pai chorando pelos cantos e tomar aquela droga de soro na clínica, já dá vontade de sumir. Às vezes eu fico ouvindo ela falar aqui na roda e penso que a gente é muito idiota mesmo de continuar insistindo nessa vida... Mas sei lá, uma coisa ainda me dá nervoso. Por que ela nunca tira aquela máscara na frente da gente? Se a gente tá todo mundo no mesmo barco, pra que esconder a cara?"</p>
                <p style="margin: 0 0 10px;"><strong style="color: #60a5fa;">— Sara</strong> (um murmúrio lento, oco, quase sem expressão): "Ela tirou... Hoje ela me mostrou."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #a7f3d0;">— Bia</strong> (para na hora; a voz muda, cheia de surpresa e curiosidade): "Não brinca. Sério? Quando o resto do pessoal saiu? E quem é ela, Sara? A gente conhece da rua?"</p>
                <p style="margin: 0 0 10px;"><strong style="color: #60a5fa;">— Sara</strong> (com uma calma bizarra, olhando pro vazio): "Todo mundo conhece... Mas ela disse que rosto é só casca. Só serve pra quem vai ficar aqui. Quando a caixa abriu, ela tirou."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #a7f3d0;">— Bia</strong> (inclinando-se para perto, impressionada ao olhar para o colo de Sara): "...A tampa abriu mesmo. Você conseguiu destrancar... Mas me fala logo quem é ela, Sara, não me deixa curiosa."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #60a5fa;">— Sara</strong> (ignorando a pergunta sobre o rosto, num tom arrastado e anestesiado): "Não faz diferença... Ainda falta uma coisa. Ele não deixa passar vazia. Ela disse que eu tenho que fazer o que Ele mandou amanhã."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #a7f3d0;">— Bia</strong>: "Ué, mas já não tá com a chave aí na mão? Que que falta fazer?"</p>
                <p style="margin: 0 0 10px;"><strong style="color: #60a5fa;">— Sara</strong>: "A passagem... Às duas e quinze, no bosque. Tenho que pegar uma menina que passa lá... e comer a carne enquanto tá quente."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #a7f3d0;">— Bia</strong> (silêncio de uns três segundos; ela solta o ar devagar, achando bizarro, mas sem entrar em pânico): "...Comer carne de gente? Pesado isso aí... Você não acha meio estranho Ele pedir um negócio desses?"</p>
                <p style="margin: 0 0 10px;"><strong style="color: #60a5fa;">— Sara</strong> (apática, quase infantil): "É a ordem Dele pra abrir a Porta... Lá fora o hospital corta a gente, queima a gente por dentro e não resolve nada. Pelo menos isso... é uma vez só. E depois acaba."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #a7f3d0;">— Bia</strong> (fica pensativa, a voz baixando num tom melancólico e honesto): "É... pensando por esse lado, você não tá errada. A gente apanha todo dia de graça mesmo. Sinceramente, Sara? Eu nem julgo você. Se a caixa tivesse aberto pra mim hoje, acho que eu também faria qualquer coisa que mandassem só pra não sentir mais dor."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #60a5fa;">— Sara</strong> (vira o rosto devagar na direção dela no escuro): "...E por que não abriu pra você?"</p>
                <p style="margin: 0 0 10px;"><strong style="color: #a7f3d0;">— Bia</strong> (um riso fraco, cansado, olhando pro chão): "Sei lá. Acho que lá no fundo eu ainda sou ingênua. Ainda fico esperando acontecer algum milagre, ou ter um dia bom antes de apagar de vez... Mesmo sabendo que é só ilusão e que amanhã vai doer tudo de novo. Você pelo menos teve coragem de largar mão logo."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #60a5fa;">— Sara</strong> (voltando a olhar para o nada, a cadeira rangendo): "Cansa esperar... Eu só quero silêncio."</p>
                <p style="margin: 0 0 12px;"><strong style="color: #a7f3d0;">— Bia</strong> (levantando do caixote devagar e batendo a poeira da calça): "Eu sei. Vai dar tudo certo amanhã no bosque, Sara. Tomara que esse Jardim seja bom mesmo... Se eu não aguentar mais essa situação aqui fora, qualquer dia desses eu abro a próxima caixa e vou atrás de você. Boa sorte lá."</p>
                <p style="margin: 0 0 12px;"><strong style="color: #60a5fa;">— Sara</strong> (num sopro quase inaudível): "...Tchau, Bia."</p>
                <p style="margin: 0; color: #9ca3af; font-style: italic;">[Som dos passos calmos de Bia saindo na chuva. A fita continua rodando no escuro com o barulho constante da cadeira da Sara rangendo — nhec, nhec — até o áudio cortar]</p>
              </div>
            </div>
          </div>
        `;
      }
      return;
    }

    // MODO RELÍQUIA ESPECTRAL: FITA ESPECTRAL #01
    if (this.currentDocId === 'col_fita_01') {
      if (badge) {
        badge.textContent = 'RELÍQUIA ESPECTRAL • FITA CASSETE #01';
        badge.style.display = 'inline-block';
        badge.style.borderColor = '#f97316';
        badge.style.color = '#fb923c';
      }
      if (title) title.textContent = 'FITA ESPECTRAL #01: ECOS DA TRAVESSIA';
      if (subtitle) {
        subtitle.textContent = 'Pavilhão de Acolhimento Abandonado • Artefato Translúcido Âmbar';
        subtitle.style.display = 'block';
      }
      if (controls) controls.style.display = 'none';
      if (note) note.textContent = 'Fita cassete alaranjada e translúcida oscilando entre os planos. O carretel magnético gira sozinho no ar sem reprodutor mecânico, emanando sussurros e estática fria.';
      if (container) {
        const isMaster = Boolean(window.MesaApp && MesaApp.state && MesaApp.state.isMaster);
        container.innerHTML = `
          <div class="livro-single-doc-wrap" style="display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 6px 4px;">
            <div style="width: 100%; max-width: 640px; background: radial-gradient(circle at 50% 10%, rgba(249, 115, 22, 0.12), rgba(12, 10, 16, 0.98) 70%); border: 1.5px solid rgba(249, 115, 22, 0.55); border-radius: 6px; padding: 22px 24px; box-shadow: 0 10px 40px rgba(249, 115, 22, 0.15), 0 8px 32px rgba(0,0,0,0.9); position: relative; overflow: hidden;">
              
              <!-- Moldura Visual da Fita Cassete Espectral Alaranjada -->
              <div style="background: rgba(249, 115, 22, 0.08); border: 1.5px dashed rgba(249, 115, 22, 0.4); border-radius: 8px; padding: 16px; margin-bottom: 18px; display: flex; align-items: center; justify-content: space-between; gap: 14px; box-shadow: inset 0 0 20px rgba(249, 115, 22, 0.08);">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <div style="width: 48px; height: 48px; border-radius: 50%; border: 2px solid rgba(249, 115, 22, 0.8); background: radial-gradient(circle, rgba(249, 115, 22, 0.35) 0%, rgba(0,0,0,0.8) 70%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 14px rgba(249, 115, 22, 0.5);">
                    <div style="width: 16px; height: 16px; border: 2px dashed #fb923c; border-radius: 50%; animation: spinTape 4s linear infinite;"></div>
                  </div>
                  <div>
                    <div style="font-family: 'Cinzel', serif; font-size: 0.95rem; font-weight: 700; color: #fdba74; letter-spacing: 1px;">CASSETE ESPECTRAL ALARANJADA</div>
                    <div style="font-size: 0.75rem; color: #f97316; font-family: monospace;">CARRETEL MAGNÉTICO EM ROTAÇÃO AUTÔNOMA</div>
                  </div>
                </div>
                ${isMaster ? `
                  <button type="button" onclick="MesaFita1.play(); MesaLivroReader.close();" style="background: #9f1239; border: 1px solid #f43f5e; color: #fff1f2; font-size: 0.78rem; font-weight: 700; padding: 6px 12px; border-radius: 3px; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(244, 63, 94, 0.35);">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>
                    <span>Transmitir Cena</span>
                  </button>
                ` : ''}
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(249, 115, 22, 0.3); padding-bottom: 8px; margin-bottom: 14px;">
                <span style="font-size: 0.82rem; font-weight: 800; color: #fb923c; letter-spacing: 1.5px; font-family: monospace;">FREQUÊNCIA RESIDUAL • ÁUDIO ESPECTRAL</span>
                <span style="font-size: 0.72rem; color: #fdba74; font-family: monospace;">RESSONÂNCIA ATIVA</span>
              </div>

              <div style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 0.92rem; line-height: 1.7; color: #fed7aa;">
                <p style="margin: 0 0 10px; color: #ea580c; font-style: italic;">[A fita flutua levemente a poucos centímetros da mesa. Uma névoa translúcida alaranjada emana das bobinas. Não há alto-falante, mas as vozes ressoam diretamente na mente dos presentes]</p>
                <p style="margin: 0 0 10px;"><strong style="color: #fb923c;">— Ecos do Passado</strong>: Som de passos apressados e pesados pisando em lodo frio e água acumulada. O arfar de quem corre desesperado pela escuridão de um galpão.</p>
                <p style="margin: 0 0 10px;"><strong style="color: #fdba74;">— Voz Feminina Firme</strong> (instruindo com solenidade glacial): "Não vacile agora. As árvores já sentiram a sua aproximação. O sangue que você carrega é a única chave que as raízes reconhecem."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #fed7aa;">— Voz Arfante</strong> (quase sem fôlego): "Tem alguém atrás de mim... eu vi a lanterna piscando na cerca do ferro-velho..."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #fdba74;">— Voz Feminina Firme</strong>: "Não olhe para trás. Seja lá o que você ouvir nos arbustos, a travessia começou. Se você hesitar por um segundo sequer, o solo vai engolir você antes da cerca."</p>
                <p style="margin: 0 0 12px;"><strong style="color: #ea580c;">— Sussurro Sobreposto</strong> (ecoando em várias direções com estática âmbar): "...não olhe para trás... a travessia começou... não olhe para trás..."</p>
                <p style="margin: 0; color: #ea580c; font-style: italic;">[A estática alaranjada pulsa em ondas lentas de calor, deixando no ar um odor metálico de ozônio e terra molhada]</p>
              </div>
            </div>
          </div>
        `;
      }
      return;
    }

    // MODO RELÍQUIA ESPECTRAL: FITA ESPECTRAL #02
    if (this.currentDocId === 'col_fita_02') {
      if (badge) {
        badge.textContent = 'RELÍQUIA ESPECTRAL • FITA CASSETE #02';
        badge.style.display = 'inline-block';
        badge.style.borderColor = '#ea580c';
        badge.style.color = '#f97316';
      }
      if (title) title.textContent = 'FITA ESPECTRAL #02: BATIMENTOS DO VAZIO';
      if (subtitle) {
        subtitle.textContent = 'Pavilhão de Acolhimento Abandonado • Artefato Translúcido Âmbar';
        subtitle.style.display = 'block';
      }
      if (controls) controls.style.display = 'none';
      if (note) note.textContent = 'Segunda fita alaranjada translúcida. Seu brilho pulsa como um coração distante e transmite fragmentos nítidos de diálogos e interferências cósmicas.';
      if (container) {
        const isMaster = Boolean(window.MesaApp && MesaApp.state && MesaApp.state.isMaster);
        container.innerHTML = `
          <div class="livro-single-doc-wrap" style="display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 6px 4px;">
            <div style="width: 100%; max-width: 640px; background: radial-gradient(circle at 50% 10%, rgba(234, 88, 12, 0.14), rgba(12, 10, 16, 0.98) 70%); border: 1.5px solid rgba(234, 88, 12, 0.55); border-radius: 6px; padding: 22px 24px; box-shadow: 0 10px 40px rgba(234, 88, 12, 0.18), 0 8px 32px rgba(0,0,0,0.9); position: relative; overflow: hidden;">
              
              <!-- Moldura Visual da Fita Cassete Espectral Alaranjada #02 -->
              <div style="background: rgba(234, 88, 12, 0.08); border: 1.5px dashed rgba(234, 88, 12, 0.4); border-radius: 8px; padding: 16px; margin-bottom: 18px; display: flex; align-items: center; justify-content: space-between; gap: 14px; box-shadow: inset 0 0 20px rgba(234, 88, 12, 0.08);">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <div style="width: 48px; height: 48px; border-radius: 50%; border: 2px solid rgba(234, 88, 12, 0.85); background: radial-gradient(circle, rgba(234, 88, 12, 0.4) 0%, rgba(0,0,0,0.8) 70%); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 14px rgba(234, 88, 12, 0.55);">
                    <div style="width: 16px; height: 16px; border: 2px dashed #f97316; border-radius: 50%; animation: spinTape 3s linear infinite;"></div>
                  </div>
                  <div>
                    <div style="font-family: 'Cinzel', serif; font-size: 0.95rem; font-weight: 700; color: #fdba74; letter-spacing: 1px;">CASSETE ESPECTRAL ALARANJADA #02</div>
                    <div style="font-size: 0.75rem; color: #ea580c; font-family: monospace;">PULSAÇÃO RÍTMICA CÓSMICA</div>
                  </div>
                </div>
                ${isMaster ? `
                  <button type="button" onclick="MesaFita2.play(); MesaLivroReader.close();" style="background: #9f1239; border: 1px solid #f43f5e; color: #fff1f2; font-size: 0.78rem; font-weight: 700; padding: 6px 12px; border-radius: 3px; cursor: pointer; display: flex; align-items: center; gap: 6px; box-shadow: 0 2px 8px rgba(244, 63, 94, 0.35);">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><polygon points="6 4 20 12 6 20 6 4"></polygon></svg>
                    <span>Transmitir Cena</span>
                  </button>
                ` : ''}
              </div>

              <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(234, 88, 12, 0.3); padding-bottom: 8px; margin-bottom: 14px;">
                <span style="font-size: 0.82rem; font-weight: 800; color: #f97316; letter-spacing: 1.5px; font-family: monospace;">DIÁLOGOS VAZADOS • FREQUÊNCIA PROFUNDA</span>
                <span style="font-size: 0.72rem; color: #fdba74; font-family: monospace;">INTERFERÊNCIA GRAVADA</span>
              </div>

              <div style="font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 0.92rem; line-height: 1.7; color: #fed7aa;">
                <p style="margin: 0 0 10px; color: #ea580c; font-style: italic;">[Ruído seco de fita antiga se desgastando. Uma estática mais cortante e rítmica reverbera, sincronizada com batimentos cardíacos lentos]</p>
                <p style="margin: 0 0 10px;"><strong style="color: #f97316;">— Ruídos Ambientais</strong>: Galhos secos estalando na mata densa. Uma respiração sufocada e rápida.</p>
                <p style="margin: 0 0 10px;"><strong style="color: #60a5fa;">— Sara</strong> (em transe hipnótico, com voz sobreposta que ecoa em duas afinações distintas): "...Quatro, nove, sete... Não pertence ao vale. Três graus ao norte do poço de calcário..."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #fdba74;">— Segunda Voz</strong> (distorcida, filtrada como através de um rádio militar valvulado): "O sinal está preso entre as frequências. Se as pedras começarem a sangrar, não interrompa o circuito."</p>
                <p style="margin: 0 0 10px;"><strong style="color: #60a5fa;">— Sara</strong>: "...A carne ainda está quente. O cordeiro não gritou. Eu fiz exatamente o que Ele mandou..."</p>
                <p style="margin: 0 0 12px;"><strong style="color: #ea580c;">— Estática Cósmica</strong> (um zumbido de baixa frequência preenche o ambiente por cinco segundos, modulando como se respirasse): "...estamos esperando do outro lado..."</p>
                <p style="margin: 0; color: #ea580c; font-style: italic;">[O som se desvanece gradualmente em um estalo seco, mantendo o brilho alaranjado da fita pulsando suavemente no escuro]</p>
              </div>
            </div>
          </div>
        `;
      }
      return;
    }

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
    if (!MesaApp.state || !MesaApp.state.isMaster) {
      if (window.MesaApp && typeof MesaApp.showToast === 'function') {
        MesaApp.showToast('Autentique seu Token de Mestre para transmitir a cena.');
      }
      return;
    }
    
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
      const startOffset = (typeof startTime === 'number' && startTime > 0 && startTime < 46) ? startTime : 0;
      MesaApp.seekVideoWhenReady(video, startOffset);
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

// ==========================================================================
// MESA PERSEGUIÇÃO NA FLORESTA (FUGA DE ERIC)
// ==========================================================================
const MesaPerseguicaoFloresta = {
  isActive: false,
  _audioCtx: null,
  _ambientNodes: null,

  play() {
    if (!MesaApp.state || !MesaApp.state.isMaster) {
      if (window.MesaApp && typeof MesaApp.showToast === 'function') {
        MesaApp.showToast('Autentique seu Token de Mestre para transmitir a cena.');
      }
      return;
    }
    const now = Date.now();
    this.localStartTime = now;
    this.localActionTime = now;

    const chan = (MesaChat && MesaChat.channel) || (MesaApp && MesaApp.channel);
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'perseguicao_floresta_start',
          payload: {
            timestamp: now,
            _senderId: (window.MesaApp && MesaApp.clientId) || null
          }
        });
      } catch (e) {}
    }

    if (typeof MesaApp.queueRow1Update === 'function') {
      MesaApp.queueRow1Update((attrs) => {
        attrs._sys_perseguicao = { active: true, timestamp: now };
      });
    }

    this.triggerStart();
  },

  stop() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    this.localActionTime = Date.now();

    const chan = (MesaChat && MesaChat.channel) || (MesaApp && MesaApp.channel);
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'perseguicao_floresta_stop',
          payload: {}
        });
      } catch (e) {}
    }

    if (typeof MesaApp.queueRow1Update === 'function') {
      MesaApp.queueRow1Update((attrs) => {
        attrs._sys_perseguicao = { active: false, timestamp: Date.now() };
      });
    }

    this.triggerStop();
  },

  triggerStart() {
    this.isActive = true;
    this.localStartTime = Date.now();
    const overlay = document.getElementById('perseguicao-floresta-overlay');
    if (overlay) {
      overlay.classList.add('active');
      if (!this._overlayUnlockBound) {
        this._overlayUnlockBound = () => {
          if (this._audioCtx && this._audioCtx.state === 'suspended') {
            this._audioCtx.resume().catch(() => {});
          }
        };
        overlay.addEventListener('click', this._overlayUnlockBound);
        overlay.addEventListener('pointerdown', this._overlayUnlockBound);
      }
    }
    const badge = document.getElementById('perseguicao-status-badge');
    if (badge) {
      badge.textContent = 'Em Exibição';
      badge.className = 'dispositivo-status-badge active';
      badge.style.borderColor = '#10b981';
      badge.style.color = '#34d399';
    }
    const btnTransmit = document.getElementById('btn-transmit-perseguicao');
    const btnStop = document.getElementById('btn-stop-perseguicao');
    if (btnTransmit) btnTransmit.style.display = 'none';
    if (btnStop) btnStop.style.display = 'inline-flex';

    this.startAmbientAudio();
  },

  triggerStop() {
    this.isActive = false;
    const overlay = document.getElementById('perseguicao-floresta-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
    const badge = document.getElementById('perseguicao-status-badge');
    if (badge) {
      badge.textContent = 'Pronto';
      badge.className = 'dispositivo-status-badge ready';
      badge.style.borderColor = '#10b981';
      badge.style.color = '#34d399';
    }
    const btnTransmit = document.getElementById('btn-transmit-perseguicao');
    const btnStop = document.getElementById('btn-stop-perseguicao');
    if (btnTransmit) btnTransmit.style.display = 'inline-flex';
    if (btnStop) btnStop.style.display = 'none';

    this.stopAmbientAudio();
  },

  startAmbientAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this._audioCtx) {
        this._audioCtx = new AudioCtx();
      }
      if (this._audioCtx.state === 'suspended') {
        this._audioCtx.resume().catch(() => {});
      }
      this.stopAmbientAudio();

      const sampleRate = this._audioCtx.sampleRate;
      const bufferSize = sampleRate * 3;
      const noiseBuffer = this._audioCtx.createBuffer(1, bufferSize, sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.05;
        b6 = white * 0.115926;
      }

      const noiseSource = this._audioCtx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const lowpass = this._audioCtx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(160, this._audioCtx.currentTime);

      const droneOsc = this._audioCtx.createOscillator();
      droneOsc.type = 'sine';
      droneOsc.frequency.setValueAtTime(54, this._audioCtx.currentTime);

      const droneGain = this._audioCtx.createGain();
      droneGain.gain.setValueAtTime(0.08, this._audioCtx.currentTime);

      const masterGain = this._audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.01, this._audioCtx.currentTime);
      masterGain.gain.linearRampToValueAtTime(0.24, this._audioCtx.currentTime + 1.8);

      noiseSource.connect(lowpass);
      lowpass.connect(masterGain);

      droneOsc.connect(droneGain);
      droneGain.connect(masterGain);

      masterGain.connect(this._audioCtx.destination);

      noiseSource.start();
      droneOsc.start();

      this._ambientNodes = { noiseSource, droneOsc, masterGain };
    } catch (e) {}
  },

  stopAmbientAudio() {
    if (this._ambientNodes) {
      try {
        const { noiseSource, droneOsc, masterGain } = this._ambientNodes;
        if (this._audioCtx && masterGain) {
          masterGain.gain.linearRampToValueAtTime(0.001, this._audioCtx.currentTime + 0.6);
        }
        setTimeout(() => {
          try {
            if (noiseSource) noiseSource.stop();
            if (droneOsc) droneOsc.stop();
          } catch (e) {}
        }, 700);
      } catch (e) {}
      this._ambientNodes = null;
    }
  }
};
window.MesaPerseguicaoFloresta = MesaPerseguicaoFloresta;



// ==========================================================================
// MESA SINAL DE TV ANTIGA / ESTÁTICA
// ==========================================================================
const MesaTvEstatica = {
  isActive: false,
  _audioCtx: null,
  _staticSource: null,
  _staticGain: null,
  _canvasRaf: null,

  play() {
    if (!MesaApp.state || !MesaApp.state.isMaster) {
      if (window.MesaApp && typeof MesaApp.showToast === 'function') {
        MesaApp.showToast('Autentique seu Token de Mestre para transmitir a cena.');
      }
      return;
    }
    const now = Date.now();
    this.localStartTime = now;

    const chan = (MesaChat && MesaChat.channel) || (MesaApp && MesaApp.channel);
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'tv_estatica_start',
          payload: { timestamp: now }
        });
      } catch (e) {}
    }

    if (typeof MesaApp.queueRow1Update === 'function') {
      MesaApp.queueRow1Update((attrs) => {
        attrs._sys_tv_estatica = { active: true, timestamp: now };
      });
    }

    this.triggerStart();
  },

  stop() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    this.localActionTime = Date.now();

    const chan = (MesaChat && MesaChat.channel) || (MesaApp && MesaApp.channel);
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'tv_estatica_stop',
          payload: {}
        });
      } catch (e) {}
    }

    if (typeof MesaApp.queueRow1Update === 'function') {
      MesaApp.queueRow1Update((attrs) => {
        attrs._sys_tv_estatica = { active: false, timestamp: Date.now() };
      });
    }

    this.triggerStop();
  },

  triggerStart() {
    this.isActive = true;
    this.localStartTime = Date.now();
    const overlay = document.getElementById('tv-estatica-overlay');
    if (overlay) {
      overlay.classList.add('active');
      if (!this._overlayUnlockBound) {
        this._overlayUnlockBound = () => {
          if (this._audioCtx && this._audioCtx.state === 'suspended') {
            this._audioCtx.resume().catch(() => {});
          }
        };
        overlay.addEventListener('click', this._overlayUnlockBound);
        overlay.addEventListener('pointerdown', this._overlayUnlockBound);
      }
    }
    const badge = document.getElementById('tv-status-badge');
    if (badge) {
      badge.textContent = 'Em Exibição';
      badge.className = 'dispositivo-status-badge active';
      badge.style.borderColor = '#a855f7';
      badge.style.color = '#c084fc';
    }
    const btnTransmit = document.getElementById('btn-transmit-tv');
    const btnStop = document.getElementById('btn-stop-tv');
    if (btnTransmit) btnTransmit.style.display = 'none';
    if (btnStop) btnStop.style.display = 'inline-flex';

    this.startTvStaticAudio();
    this.startNoiseCanvas();
  },

  triggerStop() {
    this.isActive = false;
    const overlay = document.getElementById('tv-estatica-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
    const badge = document.getElementById('tv-status-badge');
    if (badge) {
      badge.textContent = 'Pronto';
      badge.className = 'dispositivo-status-badge ready';
      badge.style.borderColor = '#a855f7';
      badge.style.color = '#c084fc';
    }
    const btnTransmit = document.getElementById('btn-transmit-tv');
    const btnStop = document.getElementById('btn-stop-tv');
    if (btnTransmit) btnTransmit.style.display = 'inline-flex';
    if (btnStop) btnStop.style.display = 'none';

    this.stopTvStaticAudio();
    this.stopNoiseCanvas();
  },

  startTvStaticAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this._audioCtx) {
        this._audioCtx = new AudioCtx();
      }
      if (this._audioCtx.state === 'suspended') {
        this._audioCtx.resume();
      }
      this.stopTvStaticAudio();

      const sampleRate = this._audioCtx.sampleRate;
      const bufferLength = sampleRate * 5;
      const noiseBuffer = this._audioCtx.createBuffer(1, bufferLength, sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferLength; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.25;
      }

      const whiteNoise = this._audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      whiteNoise.loopStart = 0;
      whiteNoise.loopEnd = 5;

      const bandpass = this._audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1000, this._audioCtx.currentTime);
      bandpass.Q.setValueAtTime(0.9, this._audioCtx.currentTime);

      const highpass = this._audioCtx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(280, this._audioCtx.currentTime);

      const gain = this._audioCtx.createGain();
      gain.gain.setValueAtTime(0.005, this._audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.038, this._audioCtx.currentTime + 0.35);

      whiteNoise.connect(highpass);
      highpass.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this._audioCtx.destination);

      whiteNoise.start(0);
      this._staticSource = whiteNoise;
      this._staticGain = gain;
    } catch (e) {}
  },

  stopTvStaticAudio() {
    const oldSource = this._staticSource;
    const oldGain = this._staticGain;
    const ctx = this._audioCtx;
    this._staticSource = null;
    this._staticGain = null;

    if (oldGain && ctx) {
      try {
        oldGain.gain.setValueAtTime(oldGain.gain.value, ctx.currentTime);
        oldGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      } catch (e) {}
    }
    if (oldSource) {
      setTimeout(() => {
        try {
          oldSource.stop();
          oldSource.disconnect();
        } catch (e) {}
      }, 300);
    }
  },
  startNoiseCanvas() {
    const canvas = document.getElementById('tv-noise-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 320;
    canvas.height = 200;

    const imgData = ctx.createImageData(canvas.width, canvas.height);
    const buf = new Uint32Array(imgData.data.buffer);
    const len = buf.length;

    const render = () => {
      if (!this.isActive) return;
      for (let i = 0; i < len; i++) {
        if (Math.random() < 0.12) {
          buf[i] = 0xffffffff;
        } else {
          buf[i] = 0x00000000;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      this._canvasRaf = requestAnimationFrame(render);
    };
    render();
  },

  stopNoiseCanvas() {
    if (this._canvasRaf) {
      cancelAnimationFrame(this._canvasRaf);
      this._canvasRaf = null;
    }
    const canvas = document.getElementById('tv-noise-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
};
window.MesaTvEstatica = MesaTvEstatica;



// ==========================================================================
// MESA SINAL DE TV ANTIGA 2 (VARIAÇÃO COM IMAGEM ALTERNATIVA)
// ==========================================================================
const MesaTvEstatica2 = {
  isActive: false,
  _audioCtx: null,
  _staticSource: null,
  _staticGain: null,
  _canvasRaf: null,

  play() {
    if (!MesaApp.state || !MesaApp.state.isMaster) {
      if (window.MesaApp && typeof MesaApp.showToast === 'function') {
        MesaApp.showToast('Autentique seu Token de Mestre para transmitir a cena.');
      }
      return;
    }
    const now = Date.now();
    this.localStartTime = now;
    this.localActionTime = now;

    const chan = (MesaChat && MesaChat.channel) || (MesaApp && MesaApp.channel);
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'tv_estatica_2_start',
          payload: { timestamp: now }
        });
      } catch (e) {}
    }

    if (typeof MesaApp.queueRow1Update === 'function') {
      MesaApp.queueRow1Update((attrs) => {
        attrs._sys_tv_estatica_2 = { active: true, timestamp: now };
      });
    }

    this.triggerStart();
  },

  stop() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    this.localActionTime = Date.now();

    const chan = (MesaChat && MesaChat.channel) || (MesaApp && MesaApp.channel);
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'tv_estatica_2_stop',
          payload: {}
        });
      } catch (e) {}
    }

    if (typeof MesaApp.queueRow1Update === 'function') {
      MesaApp.queueRow1Update((attrs) => {
        attrs._sys_tv_estatica_2 = { active: false, timestamp: Date.now() };
      });
    }

    this.triggerStop();
  },

  triggerStart() {
    this.isActive = true;
    this.localStartTime = Date.now();
    const overlay = document.getElementById('tv-estatica-2-overlay');
    if (overlay) {
      overlay.classList.add('active');
      if (!this._overlayUnlockBound) {
        this._overlayUnlockBound = () => {
          if (this._audioCtx && this._audioCtx.state === 'suspended') {
            this._audioCtx.resume().catch(() => {});
          }
        };
        overlay.addEventListener('click', this._overlayUnlockBound);
        overlay.addEventListener('pointerdown', this._overlayUnlockBound);
      }
    }
    const badge = document.getElementById('tv2-status-badge');
    if (badge) {
      badge.textContent = 'Em Exibição';
      badge.className = 'dispositivo-status-badge active';
      badge.style.borderColor = '#a855f7';
      badge.style.color = '#c084fc';
    }
    const btnTransmit = document.getElementById('btn-transmit-tv2');
    const btnStop = document.getElementById('btn-stop-tv2');
    if (btnTransmit) btnTransmit.style.display = 'none';
    if (btnStop) btnStop.style.display = 'inline-flex';

    this.startTvStaticAudio();
    this.startNoiseCanvas();
  },

  triggerStop() {
    this.isActive = false;
    const overlay = document.getElementById('tv-estatica-2-overlay');
    if (overlay) {
      overlay.classList.remove('active');
    }
    const badge = document.getElementById('tv2-status-badge');
    if (badge) {
      badge.textContent = 'Pronto';
      badge.className = 'dispositivo-status-badge ready';
      badge.style.borderColor = '#a855f7';
      badge.style.color = '#c084fc';
    }
    const btnTransmit = document.getElementById('btn-transmit-tv2');
    const btnStop = document.getElementById('btn-stop-tv2');
    if (btnTransmit) btnTransmit.style.display = 'inline-flex';
    if (btnStop) btnStop.style.display = 'none';

    this.stopTvStaticAudio();
    this.stopNoiseCanvas();
  },

  startTvStaticAudio() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this._audioCtx) {
        this._audioCtx = new AudioCtx();
      }
      if (this._audioCtx.state === 'suspended') {
        this._audioCtx.resume();
      }
      this.stopTvStaticAudio();

      const sampleRate = this._audioCtx.sampleRate;
      const bufferLength = sampleRate * 5;
      const noiseBuffer = this._audioCtx.createBuffer(1, bufferLength, sampleRate);
      const data = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferLength; i++) {
        data[i] = (Math.random() * 2 - 1) * 0.25;
      }

      const whiteNoise = this._audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;
      whiteNoise.loopStart = 0;
      whiteNoise.loopEnd = 5;

      const bandpass = this._audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1000, this._audioCtx.currentTime);
      bandpass.Q.setValueAtTime(0.9, this._audioCtx.currentTime);

      const highpass = this._audioCtx.createBiquadFilter();
      highpass.type = 'highpass';
      highpass.frequency.setValueAtTime(280, this._audioCtx.currentTime);

      const gain = this._audioCtx.createGain();
      gain.gain.setValueAtTime(0.005, this._audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.038, this._audioCtx.currentTime + 0.35);

      whiteNoise.connect(highpass);
      highpass.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this._audioCtx.destination);

      whiteNoise.start(0);
      this._staticSource = whiteNoise;
      this._staticGain = gain;
    } catch (e) {}
  },

  stopTvStaticAudio() {
    const oldSource = this._staticSource;
    const oldGain = this._staticGain;
    const ctx = this._audioCtx;
    this._staticSource = null;
    this._staticGain = null;

    if (oldGain && ctx) {
      try {
        oldGain.gain.setValueAtTime(oldGain.gain.value, ctx.currentTime);
        oldGain.gain.linearRampToValueAtTime(0.0001, ctx.currentTime + 0.25);
      } catch (e) {}
    }
    if (oldSource) {
      setTimeout(() => {
        try {
          oldSource.stop();
          oldSource.disconnect();
        } catch (e) {}
      }, 300);
    }
  },

  startNoiseCanvas() {
    const canvas = document.getElementById('tv2-noise-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 320;
    canvas.height = 200;

    const imgData = ctx.createImageData(canvas.width, canvas.height);
    const buf = new Uint32Array(imgData.data.buffer);
    const len = buf.length;

    const render = () => {
      if (!this.isActive) return;
      for (let i = 0; i < len; i++) {
        if (Math.random() < 0.12) {
          buf[i] = 0xffffffff;
        } else {
          buf[i] = 0x00000000;
        }
      }
      ctx.putImageData(imgData, 0, 0);
      this._canvasRaf = requestAnimationFrame(render);
    };
    render();
  },

  stopNoiseCanvas() {
    if (this._canvasRaf) {
      cancelAnimationFrame(this._canvasRaf);
      this._canvasRaf = null;
    }
    const canvas = document.getElementById('tv2-noise-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
};
window.MesaTvEstatica2 = MesaTvEstatica2;

// ==========================================================================
// DISPOSITIVO CINEMATOGRÁFICO: FITA_1 (VÍDEO EM TELA CHEIA COM FADE TO BLACK)
// ==========================================================================
const MesaFita1 = {
  isActive: false,
  _fadeTimeout: null,

  play() {
    if (!MesaApp.state || !MesaApp.state.isMaster) {
      if (window.MesaApp && typeof MesaApp.showToast === 'function') {
        MesaApp.showToast('Autentique seu Token de Mestre para transmitir a cena.');
      }
      return;
    }
    const now = Date.now();
    this.localStartTime = now;

    const chan = (MesaChat && MesaChat.channel) || (MesaApp && MesaApp.channel);
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'fita_1_start',
          payload: {
            timestamp: now,
            isLive: true,
            _senderId: (window.MesaApp && MesaApp.clientId) || null
          }
        });
      } catch (e) {}
    }

    if (MesaApp.state && MesaApp.state.rawRow1Atributos) {
      MesaApp.state.rawRow1Atributos._sys_fita_1 = { active: true, timestamp: now };
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
          attrs._sys_fita_1 = { active: true, timestamp: now };
          await MesaApp.supabase
            .from('personagens')
            .update({ atributos: attrs })
            .eq('id', 1);
        } catch (e) {}
      })();
    }

    this.triggerStart(0, true);
  },

  stop() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;

    const chan = (MesaChat && MesaChat.channel) || (MesaApp && MesaApp.channel);
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'fita_1_stop',
          payload: {}
        });
      } catch (e) {}
    }

    if (MesaApp.state && MesaApp.state.rawRow1Atributos) {
      MesaApp.state.rawRow1Atributos._sys_fita_1 = { active: false, timestamp: Date.now() };
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
          attrs._sys_fita_1 = { active: false, timestamp: Date.now() };
          await MesaApp.supabase
            .from('personagens')
            .update({ atributos: attrs })
            .eq('id', 1);
        } catch (e) {}
      })();
    }

    this.triggerStop();
  },

  triggerStart(startTime = 0, isLive = false) {
    this.isActive = true;
    this.localStartTime = Date.now();
    if (this._fadeTimeout) {
      clearTimeout(this._fadeTimeout);
      this._fadeTimeout = null;
    }
    if (this._stopTimeout) {
      clearTimeout(this._stopTimeout);
      this._stopTimeout = null;
    }

    const overlay = document.getElementById('fita-1-overlay');
    const video = document.getElementById('fita-1-video');
    if (!overlay || !video) return;

    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');

    const badge = document.getElementById('fita1-status-badge');
    if (badge) {
      badge.textContent = 'Em Exibição';
      badge.className = 'dispositivo-status-badge active';
      badge.style.borderColor = '#f43f5e';
      badge.style.color = '#fb7185';
    }
    const btnTransmit = document.getElementById('btn-transmit-fita1');
    const btnStop = document.getElementById('btn-stop-fita1');
    if (btnTransmit) btnTransmit.style.display = 'none';
    if (btnStop) btnStop.style.display = 'inline-flex';

    let elapsed = 0;
    if (!isLive && startTime) {
      const diff = (Date.now() - startTime) / 1000;
      if (diff > 1.5 && diff < 75) {
        elapsed = diff;
      } else if (diff >= 75) {
        this.triggerStop();
        return;
      }
    }

    // Blindagem de onended: so encerra se duration for valida e se currentTime estiver nos ultimos 2s
    video.onended = () => {
      if (!video.duration || isNaN(video.duration) || video.duration <= 0) {
        console.warn('onended prematuro ignorado em fita 1. Metadata pendente.');
        return;
      }
      if (video.currentTime < video.duration - 2) {
        console.warn('onended prematuro ignorado em fita 1. Retomando playback.');
        video.play().catch(() => {});
        return;
      }
      this.triggerStop();
      if (MesaApp.state && MesaApp.state.isMaster) {
        this.stop();
      }
    };

    video.onerror = () => {
      console.error('Erro de reproducao no video da fita 1:', video.error);
    };

    MesaApp.seekVideoWhenReady(video, elapsed > 1.5 ? elapsed : 0);

    video.classList.add('playing');
    video.muted = false;

    // Reproduz imediatamente no contexto de clique do usuario
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Playback inicial bloqueado pelo navegador em fita 1, tentando muted:', err);
        video.muted = true;
        video.play().catch((err2) => {
          console.error('Falha ao iniciar video da fita 1:', err2);
        });
      });
    }
  },

  triggerStop() {
    this.isActive = false;
    if (this._fadeTimeout) {
      clearTimeout(this._fadeTimeout);
      this._fadeTimeout = null;
    }
    if (this._stopTimeout) {
      clearTimeout(this._stopTimeout);
      this._stopTimeout = null;
    }

    const overlay = document.getElementById('fita-1-overlay');
    const video = document.getElementById('fita-1-video');
    if (video) {
      video.classList.remove('playing');
    }

    if (overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
    }

    this._stopTimeout = setTimeout(() => {
      if (!this.isActive && video) {
        try {
          video.pause();
          video.currentTime = 0;
        } catch (e) {}
      }
    }, 600);

    const badge = document.getElementById('fita1-status-badge');
    if (badge) {
      badge.textContent = 'Pronto';
      badge.className = 'dispositivo-status-badge ready';
      badge.style.borderColor = '#f43f5e';
      badge.style.color = '#fb7185';
    }
    const btnTransmit = document.getElementById('btn-transmit-fita1');
    const btnStop = document.getElementById('btn-stop-fita1');
    if (btnTransmit) btnTransmit.style.display = 'inline-flex';
    if (btnStop) btnStop.style.display = 'none';
  }
};
window.MesaFita1 = MesaFita1;

// ==========================================================================
// DISPOSITIVO CINEMATOGRÁFICO: FITA_2 (VÍDEO EM TELA CHEIA COM FADE TO BLACK)
// ==========================================================================
const MesaFita2 = {
  isActive: false,
  _fadeTimeout: null,

  play() {
    if (!MesaApp.state || !MesaApp.state.isMaster) {
      if (window.MesaApp && typeof MesaApp.showToast === 'function') {
        MesaApp.showToast('Autentique seu Token de Mestre para transmitir a cena.');
      }
      return;
    }
    const now = Date.now();
    this.localStartTime = now;

    const chan = (MesaChat && MesaChat.channel) || (MesaApp && MesaApp.channel);
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'fita_2_start',
          payload: {
            timestamp: now,
            isLive: true,
            _senderId: (window.MesaApp && MesaApp.clientId) || null
          }
        });
      } catch (e) {}
    }

    if (MesaApp.state && MesaApp.state.rawRow1Atributos) {
      MesaApp.state.rawRow1Atributos._sys_fita_2 = { active: true, timestamp: now };
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
          attrs._sys_fita_2 = { active: true, timestamp: now };
          await MesaApp.supabase
            .from('personagens')
            .update({ atributos: attrs })
            .eq('id', 1);
        } catch (e) {}
      })();
    }

    this.triggerStart(0, true);
  },

  stop() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;

    const chan = (MesaChat && MesaChat.channel) || (MesaApp && MesaApp.channel);
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'fita_2_stop',
          payload: {}
        });
      } catch (e) {}
    }

    if (MesaApp.state && MesaApp.state.rawRow1Atributos) {
      MesaApp.state.rawRow1Atributos._sys_fita_2 = { active: false, timestamp: Date.now() };
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
          attrs._sys_fita_2 = { active: false, timestamp: Date.now() };
          await MesaApp.supabase
            .from('personagens')
            .update({ atributos: attrs })
            .eq('id', 1);
        } catch (e) {}
      })();
    }

    this.triggerStop();
  },

  triggerStart(startTime = 0, isLive = false) {
    this.isActive = true;
    this.localStartTime = Date.now();
    if (this._fadeTimeout) {
      clearTimeout(this._fadeTimeout);
      this._fadeTimeout = null;
    }
    if (this._stopTimeout) {
      clearTimeout(this._stopTimeout);
      this._stopTimeout = null;
    }

    const overlay = document.getElementById('fita-2-overlay');
    const video = document.getElementById('fita-2-video');
    if (!overlay || !video) return;

    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');

    const badge = document.getElementById('fita2-status-badge');
    if (badge) {
      badge.textContent = 'Em Exibição';
      badge.className = 'dispositivo-status-badge active';
      badge.style.borderColor = '#f43f5e';
      badge.style.color = '#fb7185';
    }
    const btnTransmit = document.getElementById('btn-transmit-fita2');
    const btnStop = document.getElementById('btn-stop-fita2');
    if (btnTransmit) btnTransmit.style.display = 'none';
    if (btnStop) btnStop.style.display = 'inline-flex';

    let elapsed = 0;
    if (!isLive && startTime) {
      const diff = (Date.now() - startTime) / 1000;
      if (diff > 1.5 && diff < 280) {
        elapsed = diff;
      } else if (diff >= 280) {
        this.triggerStop();
        return;
      }
    }

    // Blindagem de onended: so encerra se duration for valida e se currentTime estiver nos ultimos 2s
    video.onended = () => {
      if (!video.duration || isNaN(video.duration) || video.duration <= 0) {
        console.warn('onended prematuro ignorado em fita 2. Metadata pendente.');
        return;
      }
      if (video.currentTime < video.duration - 2) {
        console.warn('onended prematuro ignorado em fita 2. Retomando playback.');
        video.play().catch(() => {});
        return;
      }
      this.triggerStop();
      if (MesaApp.state && MesaApp.state.isMaster) {
        this.stop();
      }
    };

    video.onerror = () => {
      console.error('Erro de reproducao no video da fita 2:', video.error);
    };

    MesaApp.seekVideoWhenReady(video, elapsed > 1.5 ? elapsed : 0);

    video.classList.add('playing');
    video.muted = false;

    // Reproduz imediatamente no contexto de clique do usuario
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn('Playback inicial bloqueado pelo navegador em fita 2, tentando muted:', err);
        video.muted = true;
        video.play().catch((err2) => {
          console.error('Falha ao iniciar video da fita 2:', err2);
        });
      });
    }
  },

  triggerStop() {
    this.isActive = false;
    if (this._fadeTimeout) {
      clearTimeout(this._fadeTimeout);
      this._fadeTimeout = null;
    }
    if (this._stopTimeout) {
      clearTimeout(this._stopTimeout);
      this._stopTimeout = null;
    }

    const overlay = document.getElementById('fita-2-overlay');
    const video = document.getElementById('fita-2-video');
    if (video) {
      video.classList.remove('playing');
    }

    if (overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
    }

    this._stopTimeout = setTimeout(() => {
      if (!this.isActive && video) {
        try {
          video.pause();
          video.currentTime = 0;
        } catch (e) {}
      }
    }, 600);

    const badge = document.getElementById('fita2-status-badge');
    if (badge) {
      badge.textContent = 'Pronto';
      badge.className = 'dispositivo-status-badge ready';
      badge.style.borderColor = '#f43f5e';
      badge.style.color = '#fb7185';
    }
    const btnTransmit = document.getElementById('btn-transmit-fita2');
    const btnStop = document.getElementById('btn-stop-fita2');
    if (btnTransmit) btnTransmit.style.display = 'inline-flex';
    if (btnStop) btnStop.style.display = 'none';
  }
};
window.MesaFita2 = MesaFita2;

// ==========================================================================
// MESA DISPOSITIVOS: CONTROLE DO HUB LATERAL, FILTROS E PESQUISA
// ==========================================================================
const MesaDispositivos = {
  isOpen: false,
  activeCategory: 'all',
  searchQuery: '',

  toggleDrawer() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      document.body.classList.add('dispositivos-drawer-open');
      this.updateCounts();
      this.applyFilter();
    } else {
      document.body.classList.remove('dispositivos-drawer-open');
    }
  },

  closeDrawer() {
    this.isOpen = false;
    document.body.classList.remove('dispositivos-drawer-open');
  },

  setCategory(category) {
    this.activeCategory = category || 'all';
    document.querySelectorAll('.dispositivo-category-tab').forEach(tab => {
      if (tab.dataset.category === this.activeCategory) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
    this.applyFilter();
  },

  filterCards(query) {
    this.searchQuery = (query || '').toLowerCase().trim();
    const clearBtn = document.getElementById('dispositivos-search-clear-btn');
    if (clearBtn) {
      clearBtn.style.display = this.searchQuery.length > 0 ? 'inline-flex' : 'none';
    }
    this.applyFilter();
  },

  clearSearch() {
    const input = document.getElementById('dispositivos-search-input');
    if (input) input.value = '';
    this.filterCards('');
  },

  applyFilter() {
    const cards = document.querySelectorAll('.dispositivos-list .dispositivo-card');
    let visibleCount = 0;
    cards.forEach(card => {
      const cardCategory = card.dataset.category || 'mesa';
      const categoryMatches = (this.activeCategory === 'all' || cardCategory === this.activeCategory);

      let textMatches = true;
      if (this.searchQuery) {
        const textContent = (card.textContent || '').toLowerCase();
        const searchTags = (card.dataset.title || '').toLowerCase();
        textMatches = textContent.includes(this.searchQuery) || searchTags.includes(this.searchQuery);
      }

      if (categoryMatches && textMatches) {
        card.style.display = '';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    const emptyMsg = document.getElementById('dispositivos-empty-msg');
    if (emptyMsg) {
      emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }
  },

  updateCounts() {
    const cards = document.querySelectorAll('.dispositivos-list .dispositivo-card');
    let total = 0;
    let cinematica = 0;
    let mesa = 0;
    let mapa = 0;
    cards.forEach(card => {
      total++;
      const cat = card.dataset.category;
      if (cat === 'cinematica') cinematica++;
      else if (cat === 'mesa') mesa++;
      else if (cat === 'mapa') mapa++;
    });

    const elTotal = document.getElementById('disp-count-all');
    const elCin = document.getElementById('disp-count-cinematica');
    const elMesa = document.getElementById('disp-count-mesa');
    const elMapa = document.getElementById('disp-count-mapa');
    if (elTotal) elTotal.textContent = total;
    if (elCin) elCin.textContent = cinematica;
    if (elMesa) elMesa.textContent = mesa;
    if (elMapa) elMapa.textContent = mapa;
  }
};
window.MesaDispositivos = MesaDispositivos;
 
// ==========================================================================
// MESA TABULEIRO TÁTICO: MAPA [OWLBEAR] (POPUP DEDICADO E SINCRONIZADO)
// ==========================================================================
const MesaOwlbear = {
  urlKey: 'wu_owlbear_room_url',
  url: '',
  windowRef: null,

  init() {
    this.url = localStorage.getItem(this.urlKey) || '';
    if (window.MesaApp && MesaApp.state && MesaApp.state.players && MesaApp.state.players[0] && MesaApp.state.players[0].atributos) {
      try {
        const p1Attrs = typeof MesaApp.state.players[0].atributos === 'string'
          ? JSON.parse(MesaApp.state.players[0].atributos)
          : MesaApp.state.players[0].atributos;
        if (p1Attrs && p1Attrs._sys_owlbear_url && p1Attrs._sys_owlbear_url.trim().length > 0) {
          this.url = p1Attrs._sys_owlbear_url.trim();
          localStorage.setItem(this.urlKey, this.url);
        }
      } catch(e) {}
    }
    const input = document.getElementById('disp-owlbear-url');
    if (input && this.url) {
      input.value = this.url;
    }
    this.updateStatusBadge();
  },

  updateStatusBadge() {
    const badge = document.getElementById('owlbear-status-badge');
    if (!badge) return;
    if (this.url && this.url.trim().length > 0) {
      badge.textContent = 'Configurado';
      badge.style.color = '#38bdf8';
      badge.style.borderColor = '#38bdf8';
    } else {
      badge.textContent = 'Pendente';
      badge.style.color = '#94a3b8';
      badge.style.borderColor = '#64748b';
    }
  },

  async saveToSupabase(newUrl) {
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
      attrs._sys_owlbear_url = newUrl;
      await MesaApp.supabase
        .from('personagens')
        .update({ atributos: attrs })
        .eq('id', 1);
    } catch(err) {
      console.warn('[OWLBEAR] Falha ao persistir link no Supabase:', err);
    }
  },

  syncFromRemote(remoteUrl) {
    if (!remoteUrl || typeof remoteUrl !== 'string') return;
    const cleaned = remoteUrl.trim();
    if (!cleaned) return;
    this.url = cleaned;
    localStorage.setItem(this.urlKey, this.url);
    const input = document.getElementById('disp-owlbear-url');
    if (input && input.value !== this.url) {
      input.value = this.url;
    }
    this.updateStatusBadge();
  },

  setUrl(newUrl, broadcast = true) {
    if (!newUrl) return;
    this.url = newUrl.trim();
    localStorage.setItem(this.urlKey, this.url);
    const input = document.getElementById('disp-owlbear-url');
    if (input && input.value !== this.url) {
      input.value = this.url;
    }
    this.updateStatusBadge();

    const isMaster = Boolean(window.MesaApp && MesaApp.state && MesaApp.state.isMaster);
    if (isMaster) {
      this.saveToSupabase(this.url);
      if (broadcast) {
        const chan = (window.MesaApp && MesaApp.channel) || (window.MesaChat && MesaChat.channel);
        if (chan) {
          try {
            chan.send({
              type: 'broadcast',
              event: 'owlbear_url_sync',
              payload: {
                clientId: (window.MesaApp && MesaApp.clientId) || '',
                url: this.url
              }
            });
          } catch(e) {
            console.warn('[OWLBEAR] Erro ao enviar broadcast owlbear_url_sync:', e);
          }
        }
      }
    }
  },

  editUrl() {
    const current = this.url || localStorage.getItem(this.urlKey) || 'https://www.owlbear.rodeo/room/';
    const entered = prompt('Configurar link individual do Mapa [Owlbear Rodeo]:', current);
    if (entered !== null) {
      const cleaned = entered.trim();
      if (cleaned.length > 0) {
        this.setUrl(cleaned);
        alert('Link do Mapa [Owlbear] salvo com sucesso!');
      } else {
        this.url = '';
        localStorage.removeItem(this.urlKey);
        this.updateStatusBadge();
        const input = document.getElementById('disp-owlbear-url');
        if (input) input.value = '';
        alert('Link do Mapa [Owlbear] removido.');
      }
    }
  },

  focusWindow() {
    if (this.windowRef && !this.windowRef.closed) {
      try {
        this.windowRef.focus();
        this.updateActiveUI(true);
      } catch(e) {
        console.warn('[OWLBEAR] Falha ao focar janela:', e);
      }
    } else {
      this.open();
    }
  },

  startWindowWatcher() {
    if (this.pollTimer) clearInterval(this.pollTimer);
    this.pollTimer = setInterval(() => {
      const isAlive = Boolean(this.windowRef && !this.windowRef.closed);
      this.updateActiveUI(isAlive);
      if (!isAlive && this.pollTimer) {
        clearInterval(this.pollTimer);
        this.pollTimer = null;
      }
    }, 1000);
  },

  updateActiveUI(isOpen) {
    const navBtn = document.getElementById('nav-owlbear-btn');
    if (navBtn) {
      navBtn.classList.toggle('active-map-open', isOpen);
    }
  },

  open(customUrl, layout = 'smart') {
    // 1. SE A JANELA JA ESTIVER ABERTA, FOCA IMEDIATAMENTE (SINCRONO NO CLIQUE)
    if (this.windowRef && !this.windowRef.closed && !customUrl) {
      try {
        this.windowRef.focus();
      } catch(e) {}
      this.updateActiveUI(true);
      return;
    }

    if (window.event && (window.event.shiftKey || window.event.altKey)) {
      return this.editUrl();
    }

    let targetUrl = customUrl || this.url || localStorage.getItem(this.urlKey) || '';
    if (!targetUrl || targetUrl.trim().length === 0) {
      if (window.MesaApp && MesaApp.supabase) {
        try {
          const { data } = MesaApp.supabase
            .from('personagens')
            .select('atributos')
            .eq('id', 1)
            .single();
          if (data && data.atributos) {
            const attrs = typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos;
            if (attrs && attrs._sys_owlbear_url && attrs._sys_owlbear_url.trim().length > 0) {
              this.syncFromRemote(attrs._sys_owlbear_url);
              targetUrl = this.url;
            }
          }
        } catch(e) {}
      }
    }

    if (!targetUrl || targetUrl.trim().length === 0) {
      const entered = prompt('Insira o link da sala do Owlbear Rodeo:', 'https://www.owlbear.rodeo/room/');
      if (entered && entered.trim().length > 0) {
        this.setUrl(entered.trim());
        targetUrl = this.url;
      } else {
        return;
      }
    }

    const screenW = window.screen.availWidth || 1280;
    const screenH = window.screen.availHeight || 720;
    let width, height, left, top;

    if (layout === 'split-right' || (screenW >= 1500 && layout === 'smart')) {
      // Posicionamento inteligente lado a lado: ocupa a metade direita sem cobrir a mesa virtual
      width = Math.floor(screenW * 0.48);
      height = Math.floor(screenH * 0.95);
      left = Math.floor(screenW * 0.51);
      top = Math.floor((screenH - height) / 2);
    } else {
      width = Math.min(1180, Math.floor(screenW * 0.72));
      height = Math.min(760, Math.floor(screenH * 0.8));
      left = Math.floor((screenW - width) / 2);
      top = Math.floor((screenH - height) / 2);
    }

    const windowFeatures = `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=yes,scrollbars=yes`;

    try {
      if (this.windowRef && !this.windowRef.closed) {
        this.windowRef.focus();
      } else {
        this.windowRef = window.open(targetUrl, 'wu_owlbear_map_window', windowFeatures);
        this.startWindowWatcher();
        this.updateActiveUI(true);
      }
    } catch (err) {
      console.warn('[OWLBEAR] Falha ao abrir popup:', err);
      window.open(targetUrl, '_blank');
    }
  },

  broadcastOpen() {
    this.open();
    const isMaster = Boolean(window.MesaApp && MesaApp.state && MesaApp.state.isMaster);
    if (isMaster) {
      const chan = (window.MesaApp && MesaApp.channel) || (window.MesaChat && MesaChat.channel);
      if (chan) {
        try {
          chan.send({
            type: 'broadcast',
            event: 'owlbear_broadcast_open',
            payload: {
              clientId: (window.MesaApp && MesaApp.clientId) || '',
              url: this.url
            }
          });
        } catch(e) {
          console.warn('[OWLBEAR] Erro ao enviar broadcast owlbear_broadcast_open:', e);
        }
      }
    }
  },

  handleIncomingSync(payload) {
    if (!payload || !payload.url) return;
    this.syncFromRemote(payload.url);
  },

  handleIncomingBroadcastOpen(payload) {
    if (payload && payload.url) {
      this.syncFromRemote(payload.url);
    }
    this.open();
  },

  showPromptToast() {
    const old = document.getElementById('owlbear-invite-toast');
    if (old) old.remove();

    const toast = document.createElement('div');
    toast.id = 'owlbear-invite-toast';
    toast.className = 'owlbear-invite-toast';
    toast.innerHTML = `
      <div class="owlbear-toast-icon">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#38bdf8" stroke-width="2">
          <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon>
          <line x1="8" y1="2" x2="8" y2="18"></line>
          <line x1="16" y1="6" x2="16" y2="22"></line>
        </svg>
      </div>
      <div class="owlbear-toast-body">
        <div class="owlbear-toast-title">MAPA [OWLBEAR]</div>
        <div class="owlbear-toast-desc">O Mestre abriu o tabuleiro tático da cena.</div>
      </div>
      <button type="button" class="owlbear-toast-btn" onclick="MesaOwlbear.open(); const el = document.getElementById('owlbear-invite-toast'); if(el) el.remove();">
        Abrir Tabuleiro
      </button>
      <button type="button" class="owlbear-toast-close" onclick="const el = document.getElementById('owlbear-invite-toast'); if(el) el.remove();">&times;</button>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      const el = document.getElementById('owlbear-invite-toast');
      if (el) el.remove();
    }, 15000);
  }
};
window.MesaOwlbear = MesaOwlbear;


// ==========================================================================
// MESA ILUSTRAÇÃO CENTRAL DO TABULEIRO: NPCS E CENÁRIO (O QUADRADO PRETO)
// ==========================================================================
const MesaCenterArtwork = {
  active: false,
  npcId: null,
  imgUrl: '',
  title: '',

  init() {
    if (window.MesaApp && MesaApp.state && MesaApp.state.players && MesaApp.state.players[0] && MesaApp.state.players[0].atributos) {
      try {
        const p1Attrs = typeof MesaApp.state.players[0].atributos === 'string'
          ? JSON.parse(MesaApp.state.players[0].atributos)
          : MesaApp.state.players[0].atributos;
        if (p1Attrs && p1Attrs._sys_center_artwork) {
          this.syncFromRemote(p1Attrs._sys_center_artwork);
        }
      } catch(e) {}
    }
  },

  normalizeNpcId(npcId) {
    if (!npcId || typeof npcId !== 'string') return '';
    const clean = npcId.trim().toLowerCase();
    if (clean === 'elias') return 'elias-ribeiro';
    if (clean === 'isaque') return 'isaque-valente';
    if (clean === 'constança' || clean === 'constanca') return 'constanca';
    if (clean === '???' || clean === 'interrogacao' || clean === 'figura-mascarada') return 'figura-mascarada';
    return clean;
  },

  async saveToSupabase(payload) {
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
      attrs._sys_center_artwork = payload;
      await MesaApp.supabase
        .from('personagens')
        .update({ atributos: attrs })
        .eq('id', 1);
    } catch(err) {
      console.warn('[CENTER ARTWORK] Falha ao persistir no Supabase:', err);
    }
  },

  setNpc(rawNpcId, broadcast = true) {
    const npcId = this.normalizeNpcId(rawNpcId);
    let npc = null;
    if (window.MesaAreaManager && typeof MesaAreaManager.getNpcById === 'function') {
      npc = MesaAreaManager.getNpcById(npcId);
    }
    if (!npc && window.CAMPAIGN_NPCS) {
      const list = Array.isArray(window.CAMPAIGN_NPCS) ? window.CAMPAIGN_NPCS : Object.values(window.CAMPAIGN_NPCS);
      npc = list.find(n => n && this.normalizeNpcId(n.id) === npcId);
    }
    if (!npc) {
      if (npcId === 'elias-ribeiro') {
        npc = { id: 'elias-ribeiro', nome: 'Elias Ribeiro', ilustracao: 'assets/npcs/elias-ribeiro.png' };
      } else if (npcId === 'isaque-valente') {
        npc = { id: 'isaque-valente', nome: 'Isaque Valente', ilustracao: 'assets/npcs/isaque-valente.png' };
      }
    }
    if (!npc || !npc.ilustracao) {
      console.warn('[CENTER ARTWORK] Ilustracao nao encontrada para:', rawNpcId);
      return;
    }

    console.log('[CENTER ARTWORK] Definindo NPC:', npc.id, npc.nome, npc.ilustracao);
    this.show(npc.ilustracao, npc.nome, npc.id, broadcast);
  },

  toggleNpc(rawNpcId) {
    const npcId = this.normalizeNpcId(rawNpcId);
    if (this.active && this.normalizeNpcId(this.npcId) === npcId) {
      this.clearArtwork();
    } else {
      this.setNpc(npcId);
    }
  },

  show(imgUrl, title = '', npcId = null, broadcast = true) {
    this.active = true;
    this.imgUrl = imgUrl;
    this.title = title;
    this.npcId = this.normalizeNpcId(npcId);

    this.render();

    const isMaster = Boolean(window.MesaApp && MesaApp.state && MesaApp.state.isMaster);
    if (isMaster) {
      const payload = {
        active: true,
        imgUrl: this.imgUrl,
        title: this.title,
        npcId: this.npcId,
        timestamp: Date.now()
      };
      this.saveToSupabase(payload);

      if (broadcast) {
        const chan = (window.MesaApp && MesaApp.channel) || (window.MesaChat && MesaChat.channel);
        if (chan) {
          try {
            chan.send({
              type: 'broadcast',
              event: 'center_artwork_sync',
              payload: {
                clientId: (window.MesaApp && MesaApp.clientId) || '',
                ...payload
              }
            });
          } catch(e) {
            console.warn('[CENTER ARTWORK] Erro ao enviar broadcast:', e);
          }
        }
      }
    }
  },

  clearArtwork(broadcast = true) {
    this.active = false;
    this.imgUrl = '';
    this.title = '';
    this.npcId = null;

    this.render();

    const isMaster = Boolean(window.MesaApp && MesaApp.state && MesaApp.state.isMaster);
    if (isMaster) {
      const payload = {
        active: false,
        imgUrl: '',
        title: '',
        npcId: null,
        timestamp: Date.now()
      };
      this.saveToSupabase(payload);

      if (broadcast) {
        const chan = (window.MesaApp && MesaApp.channel) || (window.MesaChat && MesaChat.channel);
        if (chan) {
          try {
            chan.send({
              type: 'broadcast',
              event: 'center_artwork_sync',
              payload: {
                clientId: (window.MesaApp && MesaApp.clientId) || '',
                ...payload
              }
            });
          } catch(e) {
            console.warn('[CENTER ARTWORK] Erro ao enviar broadcast:', e);
          }
        }
      }
    }
  },

  syncFromRemote(payload) {
    if (!payload) return;
    if (payload.active && payload.imgUrl) {
      this.active = true;
      this.imgUrl = payload.imgUrl;
      this.title = payload.title || '';
      this.npcId = this.normalizeNpcId(payload.npcId);
    } else {
      this.active = false;
      this.imgUrl = '';
      this.title = '';
      this.npcId = null;
    }
    this.render();
  },

  render() {
    // BACKUP: Exibicao central da ilustracao desativada conforme solicitacao do Mestre
    const container = document.getElementById('board-center-artwork');
    const imgEl = document.getElementById('board-center-artwork-img');
    const tagEl = document.getElementById('board-center-artwork-tag');
    const clearBtn = document.getElementById('board-center-artwork-clear-btn');
    const isMaster = Boolean(window.MesaApp && MesaApp.state && MesaApp.state.isMaster);

    if (container) {
      container.style.display = 'none';
      container.classList.remove('active');
    }

    if (false && container && imgEl) {
      if (this.active && this.imgUrl) {
        imgEl.src = this.imgUrl;
        imgEl.alt = this.title || 'Ilustracao';
        container.style.display = 'flex';
        void container.offsetWidth;
        container.classList.add('active');

        if (tagEl) {
          if (this.title) {
            tagEl.textContent = this.title;
            tagEl.style.display = 'block';
          } else {
            tagEl.style.display = 'none';
          }
        }

        if (clearBtn) {
          clearBtn.style.display = isMaster ? 'inline-flex' : 'none';
        }
      } else {
        container.classList.remove('active');
        setTimeout(() => {
          if (!this.active && container) {
            container.style.display = 'none';
            if (imgEl) imgEl.src = '';
          }
        }, 350);

        if (tagEl) tagEl.style.display = 'none';
        if (clearBtn) clearBtn.style.display = 'none';
      }
    }

    const displayBtns = document.querySelectorAll('.npc-display-btn');
    displayBtns.forEach(btn => {
      const btnNpcId = this.normalizeNpcId(btn.dataset.npcId);
      if (btnNpcId) {
        const isCurrent = this.active && this.normalizeNpcId(this.npcId) === btnNpcId;
        btn.classList.toggle('active', isCurrent);
        btn.textContent = isCurrent ? 'Remover da Mesa Virtual' : 'Exibir Ilustração no Centro da Mesa';
      }
    });

    const dispStatus = document.getElementById('disp-artwork-status');
    if (dispStatus) {
      if (this.active && this.title) {
        dispStatus.textContent = 'Exibindo: ' + this.title;
        dispStatus.style.color = '#38bdf8';
        dispStatus.style.borderColor = '#38bdf8';
      } else {
        dispStatus.textContent = 'Nenhuma';
        dispStatus.style.color = '#94a3b8';
        dispStatus.style.borderColor = '#64748b';
      }
    }
  }
};
window.MesaCenterArtwork = MesaCenterArtwork;
window.closeNpcDrawer = () => {
  if (window.MesaAreaManager && typeof MesaAreaManager.closeNpcDrawer === 'function') {
    MesaAreaManager.closeNpcDrawer();
  } else {
    document.body.classList.remove('npc-drawer-open');
  }
};


// ==========================================================================
// ==========================================================================
// MESA NOTEBOOK DA SARA (SISTEMA OPERACIONAL E CFTV)
// ==========================================================================

// ==========================================================================
// MESA NOTEBOOK DA SARA: SISTEMA OPERACIONAL DOMESTICO E SINCRONIZADO
// ==========================================================================
const MesaSaraDesktop = {
  initialized: false,
  activeFolder: 'Estudos_Primordio',
  pendingLockedFile: null,
  lockedModalOpen: false,
  lockedError: false,
  startMenuOpen: false,
  historyModalOpen: false,
  focusedWindow: null,
  openWindows: { explorer: false, trash: false, viewer: false, browser: false },
  maximizedWindows: { explorer: false, trash: false, viewer: false, browser: false },
  viewerFileRef: null, // { source: 'folder'|'trash'|'locked', folder, id }

  browserView: 'home', // 'home' | 'results' | 'subreddit' | 'topic' | 'sheet_music' | 'youtube' | 'yt_watch' | 'article'
  searchQuery: '',
  currentTopicId: null,
  ytQuery: '',
  ytVideoId: null,
  currentArticle: null,
  currentUrl: 'https://fragsearch.net',
  browserBackStack: [],
  browserForwardStack: [],
  _lastScrollSync: 0,

  // 1. Pastas e Arquivos Domesticos
  folders: {
    'Estudos_Primordio': [
      {
        id: 'biologia_celular',
        name: 'Apostila_Biologia_Celular.pdf',
        type: 'pdf',
        size: '1.4 MB',
        date: '28/07/2061 14:22',
        title: 'Apostila de Biologia Celular - 2º Ano - Colégio Primórdio',
        subtitle: 'Prof. Marcos V. • Módulo 03: Ciclo Celular e Mitose',
        content: `
          <div class="pdf-body-text">
            <h3>1. Estrutura Celular e Membrana Plasmática</h3>
            <p>A célula eucariótica apresenta compartimentalização interna que viabiliza reações metabólicas complexas. A membrana plasmática atua como barreira seletiva semipermeável, regulando a entrada de nutrientes e o descarte de resíduos por difusão facilitada e transporte ativo mediado por ATP.</p>
            <h3>2. O Ciclo Celular e Apoptose</h3>
            <p>O ciclo celular divide-se em Interfase (G1, S, G2) e Mitose (Prófase, Metáfase, Anáfase e Telófase). Durante o ponto de checagem G2/M, a integridade do DNA é minuciosamente avaliada por complexos enzimáticos. Células que acumulam danos irreversíveis no genoma ativam rotas intrínsecas de apoptose (morte celular programada), prevenindo a proliferação anormal no tecido.</p>
            <h3>3. Falhas nos Mecanismos de Controle e Tecidos Anormais</h3>
            <p>Quando mutações silenciam genes supressores de tumor ou ativam proto-oncogenes, o tecido perde o controle de divisão celular. O acúmulo contínuo de células anormais pode invadir tecidos vizinhos e comprometer órgãos vitais através de metástases hematogênicas ou linfáticas, exigindo terapias direcionadas de contenção e ressecção cirúrgica.</p>
          </div>
        `
      },
      {
        id: 'historia_fraguiktos',
        name: 'Resumo_Historia_Fraguiktos.pdf',
        type: 'pdf',
        size: '890 KB',
        date: '24/07/2061 16:05',
        title: 'Resumo de História Regional: A Fundação de Fraguiktos',
        subtitle: 'Colégio Primórdio • Material de Apoio para Avaliação Bimestral',
        content: `
          <div class="pdf-body-text">
            <h3>1. Origens e Ciclo Madeireiro (Década de 1940 - 1970)</h3>
            <p>O subúrbio de Fraguiktos surgiu no início da década de 1940 a partir de assentamentos de trabalhadores atraídos pela instalação das primeiras serrarias a vapor na periferia da Mata do Norte. A abundância de madeira de lei e a proximidade com o rio impulsionaram um rápido crescimento demográfico desordenado.</p>
            <h3>2. A Expansão Urbana e a Borda Florestal</h3>
            <p>Com o declínio da indústria madeireira nos anos 1980, os bairros setentrionais sofreram com o isolamento econômico. O crescimento urbano avançou sobre antigas trilhas de extração, criando uma fronteira difusa entre os blocos residenciais e a mata densa. As construções mais antigas, como o Pavilhão Municipal de Acolhimento, testemunharam a transição do vilarejo para um subúrbio industrial periférico.</p>
            <h3>3. O Relacionamento com as Cidades Vizinhas</h3>
            <p>Historicamente dependente da malha ferroviária que ligava a capital à região de Paládium, Fraguiktos manteve um perfil pacato, marcado por cooperativas locais, comércios tradicionais e uma cultura de vizinhança reservada e desconfiada em relação a interferências externas.</p>
          </div>
        `
      },
      {
        id: 'matematica_exercicios',
        name: 'Lista_Exercicios_Matematica.pdf',
        type: 'pdf',
        size: '512 KB',
        date: '20/07/2061 11:30',
        title: 'Lista de Exercícios 04 - Funções Quadráticas e Logaritmos',
        subtitle: 'Colégio Primórdio • Profª Helena R. • Entrega até 05/08',
        content: `
          <div class="pdf-body-text">
            <h3>Questão 1:</h3>
            <p>Dada a função quadrática f(x) = -2x² + 12x - 10, determine as coordenadas do vértice (Xv, Yv) e o intervalo em que a função é estritamente decrescente.</p>
            <p style="font-family: monospace; color: #475569; background: #f8fafc; padding: 6px 10px; border-left: 2px solid #94a3b8;">
              Rascunho:<br>
              Xv = -b / 2a = -12 / (2 * -2) = 3<br>
              Yv = f(3) = -2(9) + 36 - 10 = -18 + 26 = 8<br>
              Vértice = (3, 8). Decrescente para x > 3.
            </p>
            <h3>Questão 2:</h3>
            <p>Resolva a equação logarítmica: log₂(x - 4) + log₂(x) = 5. Lembre-se de verificar a condição de existência das raízes reais.</p>
            <p style="font-family: monospace; color: #475569; background: #f8fafc; padding: 6px 10px; border-left: 2px solid #94a3b8;">
              Rascunho:<br>
              C.E.: x > 4<br>
              log₂[x(x - 4)] = 5 => x² - 4x = 32 => x² - 4x - 32 = 0<br>
              (x - 8)(x + 4) = 0 => x = 8 (pois x = -4 viola a C.E.)
            </p>
            <h3>Questão 3:</h3>
            <p>Um modelo de decaimento populacional de micro-organismos segue a lei N(t) = N₀ · e^(-kt). Calcule o tempo necessário para que a amostra se reduza a 25% do volume original...</p>
            <p style="font-family: monospace; color: #94a3b8; font-style: italic; padding: 6px 10px;">
              [questão não respondida - sem rascunho]
            </p>
          </div>
        `
      },
      {
        id: 'redacao_rascunho',
        name: 'Redacao_Rascunho.txt',
        type: 'txt',
        size: '1.2 KB',
        date: '19/07/2061 21:40',
        content: `Tema: O Amanhã e Nossas Escolhas
Aluna: Sara Auguil
Turma: 2º B - Ensino Médio

Pensar no futuro sempre foi tratado pelos adultos como um exercício natural de planejamento. Dizem que as escolhas que fazemos aos dezesseis ou dezessete anos determinam quem seremos diante do mundo e qual legado deixaremos para a nossa comunidade.

No entanto, projetar os próximos dez anos exige uma certeza prévia que nem sempre está disponível: a certeza de que haverá um amanhã para onde caminhar. Quando o chão sob os nossos pés deixa de ser firme e o presente se torna uma sala vazia, todo plano vira apenas um rascunho de papel que o vento...

Não consigo terminar isso. Escrever sobre daqui a dez anos parece uma piada de mau gosto quando a casa tá em silêncio há tanto tempo.`
      }
    ],

    'Piani_e_Partituras': [
      {
        id: 'repertorio_treino',
        name: 'Repertorio_Treino.txt',
        type: 'txt',
        size: '840 B',
        date: '02/06/2061 17:15',
        content: `[CRONOGRAMA DE ESTUDO - PIANO]

- Clair de Lune - estudar compasso 15 ao 30 (mão esquerda muito dura nos arpejos)
- Valsa em Lá Menor - memorizar tema principal
- Música antiga da família (a que a mãe cantava) - tentar tirar de ouvido o refrão
- Exercícios de escala 1 a 5 (aquecimento 15 min)`
      },
      {
        id: 'cifra_incompleta',
        name: 'Cifra_Incompleta.txt',
        type: 'txt',
        size: '980 B',
        date: '28/06/2061 23:10',
        content: `Tentativa de tirar de ouvido - Melodia Antiga

Introdução:
[ Ré - Fá - Lá - Sol - Mi... ] [errado]
[ Ré - Fá# - Lá - Sol - Ré... ] [não soa assim]
[ Lá - Dó - Mi - Ré - Si... ] [muito agudo, o tom original era mais triste]

Tentei tocar aquela música de novo hoje. Meus dedos sabem onde apertar, mas parece que eu tô batendo em pedaço de madeira morta. O som sai, mas eu não sinto mais nada.`
      },
      {
        id: 'tentativa_comp_01',
        name: 'tentativa_composicao_01.txt',
        type: 'txt',
        size: '720 B',
        date: '12/04/2061 22:04',
        content: `Data: 12 de Abril - Noite

Comecei a rascunhar uma progressão nova no piano da sala.
Compasso 3/4 bem lento, tentando puxar um clima mais suave.
Quero terminar essa parte da introdução até o fim de semana. O Isaque disse que vem aqui em casa no sábado à tarde depois do treino de tiro com arco, aí posso mostrar pra ele como ficou. Tomara que ele goste da modulação pro refrão.`
      },
      {
        id: 'tentativa_comp_04',
        name: 'tentativa_composicao_04.txt',
        type: 'txt',
        size: '640 B',
        date: '16/07/2061 03:22',
        content: `Data: 16 de Julho

Faz três horas que eu tô sentada na frente do piano no escuro. A casa inteira tá muda desde que a minha irmã sumiu, e agora parece que o silêncio entrou dentro de mim também. Acho que a vontade de tocar morreu antes do resto do meu corpo.`
      }
    ],

    'Pessoal': [
      {
        id: 'contas_da_casa',
        name: 'contas_da_casa.txt',
        type: 'txt',
        size: '560 B',
        date: '01/08/2061 10:14',
        content: `Contas Agosto / Pendências:
- Luz: 85,00 - atrasada (aviso de corte na caixa de correio)
- Água: 40,00
- Mercado: 120,00 (arroz, bolacha, chá, sabão)
- Farmácia: 310,00 (analgésicos e xarope pra tosse)
- Fundo de reserva: 45,00 restante`
      },
      {
        id: 'notas_soltas_1',
        name: 'notas_soltas_1.txt',
        type: 'txt',
        size: '620 B',
        date: '10/06/2061 02:40',
        content: `10 de Junho

Quase dois anos que ela desapareceu e a porta da frente continua trancada do mesmo jeito. Às vezes eu deixo a TV ligada na sala só pra fingir que tem mais alguém respirando nessa casa além de mim.`
      },
      {
        id: 'notas_soltas_2',
        name: 'notas_soltas_2.txt',
        type: 'txt',
        size: '810 B',
        date: '18/07/2061 04:12',
        content: `18 de Julho

Deixei o Isaque terminar tudo ontem. Não tentei explicar nem pedi pra ele ficar. Ele tem uma mania boba de querer consertar tudo, e não dá pra consertar alguém que já tá apodrecendo por dentro. É melhor ele guardar só o eco daquele vídeo do piano do que ver o que vai sobrar de mim.`
      },
      {
        id: 'notas_soltas_3',
        name: 'notas_soltas_3.txt',
        type: 'txt',
        size: '790 B',
        date: '25/07/2061 05:08',
        content: `25 de Julho

Acordei com sangue no travesseiro de novo. Nem doeu. Olhei pro espelho do banheiro e não reconheci a cara que tava lá. A moça do galpão tem razão sobre uma coisa: a dor vai comendo a gente por dentro até sobrar só a casca vazia. Eu tô tão cansada de esperar.`
      },
      {
        id: 'ultimo_registro',
        name: 'ultimo_registro.locked',
        type: 'locked',
        size: '1.8 KB',
        date: '31/07/2061 03:55',
        unlockedTitle: 'particular.txt',
        content: `Quando você passa quase dois anos esperando alguém voltar pela porta, você aprende que algumas coisas simplesmente são engolidas pelo escuro e não voltam mais. Minha irmã foi primeiro. Agora sou eu.

Eu achei que ia ter medo quando a hora chegasse, mas não tem medo nenhum. Só um silêncio muito grande e um barulho de folhas secas atrás dos olhos.

O engraçado de ficar completamente vazia é que o frio da rua não incomoda mais. As mãos não tremem mais. Até o corte fica limpo quando a gente não sente pena.`
      }
    ]
  },

  // 2. Arquivos da Lixeira
  trashFiles: [
    {
      id: 'laudo_clinica',
      name: 'laudo_laboratorio_clinica.pdf',
      type: 'pdf',
      size: '2.1 MB',
      date: '15/07/2061 14:10',
      title: 'Clínica de Diagnóstico e Saúde de Fraguiktos',
      subtitle: 'Departamento de Patologia e Oncologia Clínica • Prontuário: #FR-58190-SA',
      content: `
        <div class="pdf-body-text">
          <p><strong>Paciente:</strong> Sara Auguil &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Idade:</strong> 17 anos &nbsp;&nbsp;|&nbsp;&nbsp; <strong>Data da Coleta:</strong> 12/07/2061</p>
          <p><strong>Médico Responsável:</strong> Dr. Valério G. (CRM/REG 4190)</p>
          <h3>Exame Realizado: Biópsia Citopatológica e Tomografia por Contraste</h3>
          <p>Material colhido de gânglios cervicais profundos e região retroperitoneal. Análise histológica revela densa proliferação celular indiferenciada com padrão infiltrativo avançado, invasão vascular e necrose tecidual difusa.</p>
          <h3>Conclusão Diagnóstica:</h3>
          <p>Quadro histopatológico compatível com neoplasia linfoide agressiva / síndrome degenerativa sistêmica em estágio terminal irreversível. Refratariedade completa às abordagens terapêuticas conservadoras anteriores.</p>
          <p><strong>Recomendação:</strong> Descontinuação de protocolos invasivos fúteis. Encaminhamento imediato para cuidados paliativos domiciliares e suporte de acolhimento social.</p>
        </div>
        <div class="pdf-clinic-stamp">
          <div>Validação Eletrônica: SIG-SAUDE-FRAG-7728</div>
          <div class="pdf-stamp-box">Assistência Social / Encaminhamento: Constança</div>
        </div>
      `
    },
    {
      id: 'rascunho_descartado',
      name: 'rascunho_descartado.txt',
      type: 'txt',
      size: '480 B',
      date: '29/07/2061 02:18',
      content: `Não sei pra quem eu tô escrevendo isso se não tem ninguém em casa pra ler. Se entrarem aqui depois que eu for pro mato, podem ficar com o piano. A música já não tava lá dentro mesmo.`
    }
  ],

  // 3. Historico de Navegacao
  historyEntries: [
    { time: 'Ontem - 03:45', action: 'Pesquisa', query: 'como tirar mancha escura de lamina de aço sem estragar o fio' },
    { time: 'Ontem - 03:12', action: 'Pesquisa', query: 'resina ou cola branca forte para vedar trincado em louça lisa' },
    { time: '3 dias atrás - 02:50', action: 'Pesquisa', query: 'pontos de tendão pulso e tornozelo anatomia' },
    { time: '5 dias atrás - 23:20', action: 'Pesquisa', query: 'horarios ronda policial suburbio norte fraguiktos' },
    { time: '6 dias atrás - 14:15', action: 'Pesquisa', query: 'trilha lateral bosque norte movimento tarde' },
    { time: '8 dias atrás - 22:30', action: 'Acessou', query: 'readit.net/r/Conspiracoes/as_raizes_de_ghorvaelis', topicId: 14 },
    { time: '9 dias atrás - 21:15', action: 'Pesquisa', query: 'livro as raizes de ghorvaelis autor sebo' },
    { time: '10 dias atrás - 20:05', action: 'Pesquisa', query: 'youtube clair de lune piano tutorial compassos' },
    { time: '11 dias atrás - 19:00', action: 'Pesquisa', query: 'terremoto paladium corpos com vinhas nos olhos' },
    { time: '14 dias atrás - 03:10', action: 'Pesquisa', query: 'por que não consigo mais sentir prazer em tocar musica depressao' },
    { time: '15 dias atrás - 18:20', action: 'Pesquisa', query: 'pavilhao abandonado norte grupo de apoio' },
    { time: '18 dias atrás - 16:05', action: 'Pesquisa', query: 'remedio forte para enjoo e tosse com sangue sem receita' },
    { time: '20 dias atrás - 14:00', action: 'Pesquisa', query: 'tempo de vida linfoma avançado sem tratamento' },
    { time: '23 dias atrás - 01:15', action: 'Pesquisa', query: 'pessoas desaparecidas fraguiktos dois anos atras registros' },
    { time: '25 dias atrás - 19:30', action: 'Pesquisa', query: 'partitura piano musica antiga facil pdf' },
    { time: '28 dias atrás - 15:00', action: 'Pesquisa', query: 'resumo biologia celular ensino medio' }
  ],

  // 4. Forum ReadIt (Somente os 4 topicos solicitados + postagens cotidianas comuns)
  readItTopics: [
    {
      id: 1,
      subreddit: 'r/Fraguiktos',
      author: 'u/mod_fraguiktos',
      time: 'Fixado • Há 2 meses',
      votes: 412,
      commentsCount: 19,
      title: '[Fixado] Regras da comunidade: Mantenham o respeito nos comentários e usem as tags corretas.',
      content: `Bem-vindos ao subfórum comunitário de moradores de Fraguiktos e redondezas.

1. Evitem spam comercial ou correntes de boatos sem fonte.
2. Assuntos sobre ônibus, comércios, receitas e pets vão na tag r/Fraguiktos.
3. Teorias aleatórias ou histórias de madrugada vão na tag r/Conspiracoes.
4. Respeitem os vizinhos nos comentários.`,
      comments: [
        { author: 'u/gamer_sem_sinal', time: 'Há 1 mês', text: 'Alguém sabe se dá pra pedir ajuda aqui quando o caminhão do lixo pula a nossa rua?' },
        { author: 'u/mod_fraguiktos', time: 'Há 1 mês', text: 'Pode postar sim, só não coloque endereço residencial completo por segurança.' }
      ]
    },
    {
      id: 2,
      subreddit: 'r/Fraguiktos',
      author: 'u/dona_mimi',
      time: 'Há 2 dias',
      votes: 284,
      commentsCount: 31,
      title: 'Meu gato aprendeu a abrir a porta do armário da cozinha de madrugada e agora derruba todo o macarrão.',
      content: `Sério, eu já coloquei até fita crepe na porta do armário de baixo, mas o Biscoito simplesmente fica em pé nas duas patinhas, puxa a fita com o dente e abre a portinha. Hoje acordei com meio pacote de espaguete espalhado pelo chão e ele deitado bem em cima olhando pra minha cara como se nada tivesse acontecido.

Mais alguém tem um gato laranja completamente caótico assim ou eu adotei um guaxinim disfarçado.`,
      comments: [
        { author: 'u/larica_noturna', time: 'Há 2 dias', text: 'Gato laranja compartilha um único neurônio com todos os outros gatos laranjas do planeta. Trava de armário de bebê resolve.' },
        { author: 'u/cozinha_simples', time: 'Há 1 dia', text: 'O meu aprendeu a ligar a torneira do banheiro e deixa pingando a tarde inteira.' }
      ]
    },
    {
      id: 3,
      subreddit: 'r/Fraguiktos',
      author: 'u/entomologia_amadora',
      time: 'Há 3 dias',
      votes: 147,
      commentsCount: 22,
      title: 'Achei esse besouro grande com carapaça verde metálica no muro do quintal hoje, alguém sabe a espécie?',
      content: `Fui recolher a roupa do varal agora no fim da tarde e vi um inseto do tamanho de um polegar parado perto da lâmpada externa. Ele tem as costas todas verdes bem brilhantes, quase furta-cor, e umas anteninhas curtas em formato de leque.

Deixei ele quieto numa folha de jornal e coloquei perto do canteiro, não quis matar. Será que é aquele besouro-de-maio comum ou algum besouro que come planta?`,
      comments: [
        { author: 'u/planta_em_vaso', time: 'Há 3 dias', text: 'Parece ser um escaravelho verde comum de jardim mesmo. Eles aparecem bastante perto de luz branca depois de chuva, são totalmente inofensivos.' },
        { author: 'u/dona_mimi', time: 'Há 2 dias', text: 'Aqui aparece um monte desses em agosto, meu gato tenta pegar todos.' }
      ]
    },
    {
      id: 4,
      subreddit: 'r/Fraguiktos',
      author: 'u/vigia_noturno',
      time: 'Há 15 dias',
      votes: 485,
      commentsCount: 67,
      title: 'Cuidado ao andar perto do Pavilhão Juvenil abandonado na borda da Mata do Norte.',
      content: `Faço ronda noturna no galpão de ferramentas da prefeitura que fica a 300 metros daquele pavilhão de acolhimento desativado. Nas últimas semanas vi movimentação estranha:

Jovens andando sozinhos ou em duplas pela trilha de cascalho às 2h da madrugada. Eles não carregam lanterna nem falam alto, andam com uma postura rígida e cabeça baixa. Do prédio abandonado sobe um cheiro forte, enjoativo, uma mistura de terra recém-cavada com ferro e perfume floral doce. Já chamei a polícia duas vezes, mas a viatura nunca passa por aquela estrada de terra. Não cheguem perto daquele portão enferrujado.`,
      comments: [
        { author: 'u/spam_bloqueado', time: 'Há 14 dias', text: 'Tem uma mulher de casaco escuro que leva sacolas pra lá no fim da tarde às vezes. Pessoal aqui diz que é gente de assistência social antiga ou coisa assim.' },
        { author: 'u/trabalhador_cansado', time: 'Há 13 dias', text: 'Aquele lugar tá caindo aos pedaços desde 2050, melhor nem chegar perto por causa de telha solta.' }
      ]
    },
    {
      id: 5,
      subreddit: 'r/Conspiracoes',
      author: 'u/furo_jornalistico',
      time: 'Há 18 dias',
      votes: 1420,
      commentsCount: 156,
      title: 'O que realmente encontraram na cratera do "Grande Terremoto" em Paládium?',
      content: `Conversei com um socorrista da equipe de contenção que trabalhou na fenda central de Paládium. Ele foi aposentado compulsoriamente e hoje vive sob medicação controlada.

Segundo ele, a versão do tremor de terra é uma fraude completa para acalmar o público. As fundações da cidade não cederam por falha geológica; a terra se abriu porque algo colossal no subsolo se remexeu.

Lá embaixo, nos níveis inferiores da mina, eles encontraram os corpos dos trabalhadores soterrados intactos, sem ossos quebrados. Porém, todos tinham vinhas prateadas ultrafinas crescendo por baixo das pálpebras, e quando miravam as lanternas nos olhos deles, havia reflexos fosforescentes de luz ciano, rosa e verde correndo pelas pupilas, como se a mente deles ainda estivesse conectada a um circuito invisível.`,
      comments: [
        { author: 'u/ceticista_99', time: 'Há 17 dias', text: 'Mais uma invenção de terremoto sem nenhuma foto nem registro de jornal. Povo acredita em tudo.' },
        { author: 'u/observador_do_vazio', time: 'Há 16 dias', text: 'Procurem os documentos arquivados de vazamento mineral de Paládium antes que apaguem do servidor.' }
      ]
    },
    {
      id: 6,
      subreddit: 'r/Fraguiktos',
      author: 'u/trabalhador_cansado',
      time: 'Há 4 dias',
      votes: 196,
      commentsCount: 28,
      title: 'Ônibus da linha 402 (Centro - Bairro Norte) atrasando 40 minutos todo santo dia essa semana.',
      content: `Eu saio do turno às 18h10 no centro e fico plantado no ponto da Praça Velha até quase 19h esperando o 402 passar. Quando passa, vem lotado até a porta e metade das janelas não fecha direito nesse frio.

Alguém sabe se teve obra interditando a avenida de novo ou se a viação só tirou carro de circulação mesmo?`,
      comments: [
        { author: 'u/quero_dormir', time: 'Há 4 dias', text: 'Ontem o motorista disse que dois ônibus da linha quebraram na garagem e não tem peça de reposição até sexta.' }
      ]
    },
    {
      id: 7,
      subreddit: 'r/Fraguiktos',
      author: 'u/saneamento_04',
      time: 'Há 9 dias',
      votes: 290,
      commentsCount: 42,
      title: 'Os ratos das galerias pluviais estão ficando enormes e com tumores cinzas.',
      content: `Trabalho na manutenção das galerias pluviais e esgotos do quadrante norte. O pessoal da nossa equipe já se recusou a descer duas vezes esta semana.

Os roedores lá embaixo estão do tamanho de gatos grandes, mas o pior não é o tamanho: eles têm nódulos cinzentos e duros crescendo nas costas e na base do crânio. E eles não fogem da luz da lanterna como ratos normais; eles param, ficam encarando em bando com os olhos opacos e avançam nas galochas se a gente der um passo pra frente. Tem algo contaminando a água profunda da drenagem que vem da mata.`,
      comments: [
        { author: 'u/esquecido_sempre', time: 'Há 8 dias', text: 'Isso explica os barulhos horríveis que estavam saindo da boca de lobo aqui da esquina ontem à noite.' }
      ]
    },
    {
      id: 8,
      subreddit: 'r/Fraguiktos',
      author: 'u/larica_noturna',
      time: 'Há 5 dias',
      votes: 76,
      commentsCount: 15,
      title: 'Recomendação de alguma pizzaria aberta depois das 23h que entregue perto da Praça Velha?',
      content: `Cheguei tarde em casa sem nada pronto na geladeira e todas as lanchonetes do aplicativo já fecharam. Alguma dica de telefone de pizzaria de bairro que entrega até mais tarde de quarta-feira?`,
      comments: [
        { author: 'u/gamer_sem_sinal', time: 'Há 5 dias', text: 'Pizzaria Forno de Pedra fica aberta até 00h30, a meia calabresa com catupiry deles salva demais.' }
      ]
    },
    {
      id: 9,
      subreddit: 'r/Fraguiktos',
      author: 'u/cozinha_simples',
      time: 'Há 6 dias',
      votes: 215,
      commentsCount: 24,
      title: 'Receita de bolo de cenoura fofinho que não sola no meio (testada 3 vezes).',
      content: `Muita gente reclama que o bolo de cenoura fica pesado ou solado por causa da quantidade errada de cenoura. O segredo é pesar ou usar só 2 cenouras médias picadas no liquidificador com 3 ovos e meia xícara de óleo, depois misturar as 2 xícaras de farinha de trigo peneiradas à mão bem devagar sem bater no liquidificador.

Fica bem amarelo, fofo e assa em 38 minutos a 180 graus.`,
      comments: [
        { author: 'u/dona_mimi', time: 'Há 5 dias', text: 'Fiz agora à tarde com calda de chocolate de achocolatado e deu super certo, finalmente não afundou no meio.' }
      ]
    },
    {
      id: 10,
      subreddit: 'r/Fraguiktos',
      author: 'u/esquecido_sempre',
      time: 'Há 7 dias',
      votes: 64,
      commentsCount: 8,
      title: 'Alguém encontrou um molho de chaves com chaveiro de tartaruga perto da Padaria Pão Quente?',
      content: `Devo ter deixado cair do bolso da jaqueta quando fui comprar pão ontem por volta das 17h. Tem duas chaves prateadas pequenas, uma chave dourada de portão e um chaveiro de borracha verde em formato de tartaruga meio gasto. Se alguém achou ou deixou no balcão da padaria, me manda mensagem por aqui.`,
      comments: [
        { author: 'u/bazar_bairro', time: 'Há 7 dias', text: 'Passa lá na padaria agora cedo porque o seu Antônio costuma guardar tudo numa caixinha embaixo do caixa.' }
      ]
    },
    {
      id: 11,
      subreddit: 'r/Fraguiktos',
      author: 'u/gamer_sem_sinal',
      time: 'Há 10 dias',
      votes: 112,
      commentsCount: 19,
      title: 'Internet da fibra óptica caindo toda vez que garoa mais forte ou é só aqui no Bloco B?',
      content: `Toda vez que fecha o tempo o ping vai pra 900ms e a luz vermelha do roteador pisca por cinco minutos. O suporte da operadora diz que está tudo normal na central, mas tá impossível terminar qualquer coisa assim.`,
      comments: [
        { author: 'u/foco_vestibular', time: 'Há 9 dias', text: 'Aqui perto do colégio também fica oscilando de noite quando chove, acho que entra umidade na caixa do poste.' }
      ]
    },
    {
      id: 12,
      subreddit: 'r/Fraguiktos',
      author: 'u/quero_dormir',
      time: 'Há 11 dias',
      votes: 330,
      commentsCount: 41,
      title: 'O galo do vizinho começa a cantar às 04h40 da manhã em ponto, estou enlouquecendo.',
      content: `Eu entendo que moramos perto de área rural, mas faz duas semanas que esse bicho acorda antes do sol nascer e não para até às 07h. Já comprei protetor auricular de espuma mas parece que ele canta do lado da minha janela.`,
      comments: [
        { author: 'u/nostalgia_poeira', time: 'Há 10 dias', text: 'Pelo menos você nunca mais perde a hora do trabalho.' }
      ]
    },
    {
      id: 13,
      subreddit: 'r/Fraguiktos',
      author: 'u/planta_em_vaso',
      time: 'Há 12 dias',
      votes: 89,
      commentsCount: 11,
      title: 'Dicas para cuidar de suculentas dentro de apartamento sem muito sol direto?',
      content: `Comprei três vasinhos bonitinhos na feira de sábado, mas as folhas de baixo estão ficando moles e meio transparentes mesmo eu regando só duas vezes na semana.`,
      comments: [
        { author: 'u/entomologia_amadora', time: 'Há 12 dias', text: 'Se fica mole e transparente é excesso de água mesmo. No inverno sem sol direto pode regar uma vez a cada 12 dias só.' }
      ]
    },
    {
      id: 14,
      subreddit: 'r/Conspiracoes',
      author: 'u/observador_do_vazio',
      time: 'Há 2 meses',
      votes: 2490,
      commentsCount: 312,
      title: 'Alguém mais já leu "As Raízes de Ghor\'vaelis"? Aquele livro de horror cósmico não parece ficção.',
      content: `Achei uma edição velha e sem capa desse livro num sebo anos atrás e nunca consegui tirar a história da cabeça. Muita gente acha que o autor estava só escrevendo ficção científica misturada com ocultismo sobre um monstro espacial, mas a forma como ele descreve o ciclo de alimentação da criatura é assustadoramente específica.

No livro, Ghor'vaelis não é um deus nem um demônio local, mas um predador cósmico de biosferas — um organismo astronômico que viaja pelo vazio devorando planetas e civilizações inteiras. O mais bizarro é o método: ele não destrói mundos com guerra ou fogo. Ele cai silencioso e se infiltra na camada invisível do planeta como um micélio ou uma raiz subterrânea gigantesca, esperando.

Segundo o autor, como Ghor'vaelis é vasto demais para forçar a entrada na realidade física sozinho, ele precisa que os próprios nativos abram 'Portas' pelo lado de dentro. E quem ele usa como chave? Pessoas que estão morrendo ou afundadas em depressão terminal. Uma mente saudável tem defesas naturais contra o chamado do parasita, mas quem já perdeu toda a esperança de futuro está com a alma rachada.

No clímax da história, os escolhidos precisam consumir a carne ainda quente de outra vida para concentrar energia vital fresca dentro de si antes de destrancarem a passagem nas árvores. Quando a Porta finalmente se abre, Ghor'vaelis prende a consciência da vítima numa alucinação perfeita e colorida — um suposto paraíso onde nenhuma dor existe — enquanto, no mundo real, o monstro suga a alma da pessoa e usa o corpo vazio como adubo para espalhar vinhas prateadas pelo solo. No fim do livro, o planeta inteiro vira uma casca morta sem que ninguém perceba a invasão a tempo.

Alguém sabe quem escreveu isso de verdade? Porque olhando pras notícias estranhas que vêm saindo nas cidades vizinhas ultimamente, parece menos um romance de terror e mais um aviso.`,
      comments: [
        {
          author: 'u/leitor_cetic0',
          time: 'Há 2 meses',
          text: 'Clássico terror barato de revista antiga. O autor só pegou o conceito de fungos parasitas que controlam formigas na natureza e aumentou pra escala planetária. Muito bem escrito, mas é só ficção, cara.'
        },
        {
          author: 'u/ratos_no_muro',
          time: 'Há 1 mês',
          text: 'O bizarro é que eu tentei procurar esse livro na biblioteca municipal semana passada e o registro consta como \'recolhido\'. A parte das vinhas saindo dos olhos que tem no capítulo 4 me deu pesadelo por dias.'
        },
        {
          author: 'u/s_auguil',
          time: 'Há 9 dias',
          text: 'Se a pessoa do livro já ia morrer sofrendo de qualquer jeito, qual é o problema de escolher ficar presa no sonho colorido? Pelo menos lá dentro não dói.'
        }
      ]
    },
    {
      id: 15,
      subreddit: 'r/Fraguiktos',
      author: 'u/teclas_velhas',
      time: 'Há 16 dias',
      votes: 92,
      commentsCount: 13,
      title: 'Alguém conhece um técnico confiável para afinar piano vertical antigo sem cobrar um absurdo?',
      content: `O piano antigo aqui da sala está com o Dó central e algumas notas graves bem fora de tom por causa da umidade desse mês. Queria o contato de alguém que atenda aqui no bairro mesmo.`,
      comments: [
        { author: 'u/fotografia_rua', time: 'Há 15 dias', text: 'Tem o Seu Roberto ali perto do conservatório municipal, cobra justo e entende bem de mecânica antiga.' }
      ]
    },
    {
      id: 16,
      subreddit: 'r/Fraguiktos',
      author: 'u/nostalgia_poeira',
      time: 'Há 19 dias',
      votes: 158,
      commentsCount: 27,
      title: 'Limpei o sótão da minha avó ontem e achei caixas de fitas VHS antigas com desenhos gravados da TV.',
      content: `Tem comerciais antigos, filmes de domingo gravados em cima de novela e até um jornal local de 1998. Pena que o videocassete queimou a fonte há anos, senão ia passar o fim de semana inteiro digitalizando tudo.`,
      comments: [
        { author: 'u/bazar_bairro', time: 'Há 18 dias', text: 'Na galeria do centro tem uma loja de eletrônica que ainda faz conversão de VHS pra pen drive baratinho.' }
      ]
    },
    {
      id: 17,
      subreddit: 'r/Fraguiktos',
      author: 'u/spam_bloqueado',
      time: 'Há 21 dias',
      votes: 245,
      commentsCount: 36,
      title: 'Mais alguém recebendo 15 ligações por dia de números aleatórios que desligam em 2 segundos?',
      content: `Já bloqueei uns trinta números diferentes esta semana. Atende, fica um silêncio mudo por dois segundos e cai a ligação. Insuportável.`,
      comments: [
        { author: 'u/mod_fraguiktos', time: 'Há 20 dias', text: 'É discador automático de telemarketing testando se a linha tá ativa, não atenda número desconhecido por uns dias que diminui.' }
      ]
    },
    {
      id: 18,
      subreddit: 'r/Fraguiktos',
      author: 'u/fotografia_rua',
      time: 'Há 23 dias',
      votes: 410,
      commentsCount: 18,
      title: 'Pôr do sol hoje visto da passarela da estação de trem sem nenhum filtro.',
      content: `O céu ficou num tom roxo e laranja bem forte por uns dez minutos antes de escurecer tudo. Às vezes até um fim de dia comum aqui em Fraguiktos rende uma vista bonita.`,
      comments: [
        { author: 'u/foco_vestibular', time: 'Há 22 dias', text: 'Saindo da aula passei pela ponte nessa mesma hora, tava muito bonito mesmo.' }
      ]
    },
    {
      id: 19,
      subreddit: 'r/Fraguiktos',
      author: 'u/foco_vestibular',
      time: 'Há 25 dias',
      votes: 118,
      commentsCount: 14,
      title: 'Playlists instrumentais ou sons de chuva bons para estudar pro vestibular de madrugada?',
      content: `Preciso revisar biologia celular e história regional até sexta, mas música cantada me distrai muito. O que vocês escutam para manter o foco?`,
      comments: [
        { author: 'u/teclas_velhas', time: 'Há 24 dias', text: 'Peças lentas de piano clássico no YouTube ajudam bastante, bem calmo e sem letra.' }
      ]
    },
    {
      id: 20,
      subreddit: 'r/Fraguiktos',
      author: 'u/bazar_bairro',
      time: 'Há 27 dias',
      votes: 45,
      commentsCount: 6,
      title: 'Vendendo luminária de mesa articulada usada, 35 créditos - retirar perto do mercado central.',
      content: `Funciona perfeitamente, vai com lâmpada LED branca fria instalada. Só estou desapegando porque troquei por uma menor para a escrivaninha.`,
      comments: [
        { author: 'u/larica_noturna', time: 'Há 26 dias', text: 'Ainda está disponível? Consigo buscar no sábado cedo.' }
      ]
    }
  ],

  // 5. Partituras Classicas (Sem nomes do mundo real)
  sheetMusicPieces: [
    { title: 'Clair de Lune (Arranjo Conservatório)', composer: 'Conservatório Central de Paládium', key: 'Ré Bemol Maior', difficulty: 'Avançado', pages: '6 Páginas', format: 'PDF Partitura' },
    { title: 'Valsa em Lá Menor', composer: 'Acervo Clássico Municipal', key: 'Lá Menor', difficulty: 'Intermediário', pages: '4 Páginas', format: 'PDF Partitura' },
    { title: 'Estudo Noturno No. 1', composer: 'Domínio Público Regional', key: 'Ré Maior', difficulty: 'Fácil / Médio', pages: '3 Páginas', format: 'PDF Partitura' },
    { title: 'Canção Antiga de Ninar', composer: 'Folclore Regional de Fraguiktos', key: 'Mi Menor', difficulty: 'Iniciante', pages: '2 Páginas', format: 'Cifra & Partitura' }
  ],

  // 6. Diretorio de Videos YouTube Simulados (Autentico sem Login)
  youtubeVideos: [
    {
      id: 'clair_de_lune',
      category: 'Piano',
      title: 'Clair de Lune - Tutorial Piano Passo a Passo (Compassos 15-30)',
      channel: 'Canal Piano Clássico',
      subs: '184 mil inscritos',
      avatarColor: '#2563eb',
      views: '240 mil visualizações',
      date: 'há 2 anos',
      duration: '14:22',
      likes: '12 mil',
      description: 'Aula detalhada focada na transição lenta e nos arpejos de mão esquerda entre os compassos 15 e 30.',
      sceneType: 'piano',
      comments: [
        { author: '@estudante_musica', time: 'há 8 meses', text: 'Finalmente consegui destravar o compasso 19 assistindo em velocidade reduzida.' },
        { author: '@teclas_velhas', time: 'há 3 meses', text: 'Didática excelente, ajudou muito na mão esquerda.' }
      ]
    },
    {
      id: 'isaque_arco',
      category: 'Esportes',
      title: 'Treino Arco Recurvo 30m - Ajuste de Mira e Agrupamento',
      channel: 'Isaque Valente',
      subs: '38 inscritos',
      avatarColor: '#15803d',
      views: '42 visualizações',
      date: 'há 3 semanas',
      duration: '06:18',
      likes: '11',
      description: 'Testando novas pontas de flecha no alvo do clube depois das aulas do Primórdio.',
      sceneType: 'archery',
      comments: [
        { author: '@marcos_tiro', time: 'há 2 semanas', text: 'Agrupamento bom demais cara, parabéns.' }
      ]
    },
    {
      id: 'chuva_janela',
      category: 'Música',
      title: 'Chuva Fraca na Janela para Dormir ou Estudar (Sem Propaganda - 3 Horas)',
      channel: 'Sons da Noite',
      subs: '910 mil inscritos',
      avatarColor: '#334155',
      views: '1,2 mi visualizações',
      date: 'há 1 ano',
      duration: '3:00:00',
      likes: '48 mil',
      description: 'Áudio ambiente contínuo de chuva suave em vidro noturno para ajudar na leitura e no sono.',
      sceneType: 'rain',
      comments: [
        { author: '@insonia_frag', time: 'há 1 mês', text: 'Única coisa que ajuda quando a casa fica quieta demais de madrugada.' }
      ]
    },
    {
      id: 'paladium_plantao',
      category: 'Notícias',
      title: 'Plantão Regional: Tremor de Terra e Interdição do Setor Minerário em Paládium',
      channel: 'TV Fraguiktos Hoje',
      subs: '112 mil inscritos',
      avatarColor: '#b91c1c',
      views: '89 mil visualizações',
      date: 'há 3 semanas',
      duration: '04:51',
      likes: '3,1 mil',
      description: 'Autoridades isolam a área central de Paládium após afundamento súbito de solo nas antigas galerias subterrâneas.',
      sceneType: 'news',
      comments: [
        { author: '@morador_centro', time: 'há 2 semanas', text: 'Estranho isolarem quatro quarteirões inteiros só por causa de um desabamento pequeno.' },
        { author: '@furo_jornalistico', time: 'há 1 semana', text: 'Ninguém da prefeitura quis mostrar as fotos do fundo da cratera até hoje.' }
      ]
    },
    {
      id: 'bolo_cenoura',
      category: 'Culinária',
      title: 'Bolo de Cenoura Bem Fofinho - Receita Fácil de Liquidificador',
      channel: 'Cozinha da Ana',
      subs: '430 mil inscritos',
      avatarColor: '#c2410c',
      views: '510 mil visualizações',
      date: 'há 4 meses',
      duration: '08:12',
      likes: '29 mil',
      description: 'Passo a passo simples para fazer um bolo macio com cobertura cremosa de chocolate.',
      sceneType: 'cake',
      comments: [
        { author: '@cozinha_simples', time: 'há 1 mês', text: 'Receita infalível, faço toda semana aqui.' }
      ]
    },
    {
      id: 'gato_laranja',
      category: 'Animais',
      title: 'Gato Laranja Brigando com a Própria Sombra no Corredor',
      channel: 'Bichos da Casa',
      subs: '620 mil inscritos',
      avatarColor: '#b45309',
      views: '3,4 mi visualizações',
      date: 'há 8 meses',
      duration: '01:05',
      likes: '190 mil',
      description: 'Ele passou dez minutos tentando caçar a sombra da própria orelha na parede.',
      sceneType: 'cat',
      comments: [
        { author: '@dona_mimi', time: 'há 2 meses', text: 'Idêntico ao meu aqui de casa.' }
      ]
    },
    {
      id: 'besouro_jardim',
      category: 'Natureza',
      title: 'Insetos Comuns de Jardim: Como Identificar Besouros Verdes de Casca Lisa',
      channel: 'Caderno de Campo',
      subs: '54 mil inscritos',
      avatarColor: '#047857',
      views: '38 mil visualizações',
      date: 'há 1 mês',
      duration: '07:40',
      likes: '2,4 mil',
      description: 'Guia prático sobre escaravelhos inofensivos encontrados perto de postes de luz após chuvas de agosto.',
      sceneType: 'beetle',
      comments: [
        { author: '@entomologia_amadora', time: 'há 2 dias', text: 'Achei um exatamente igual a esse no muro ontem.' }
      ]
    },
    {
      id: 'pecas_lentas_piano',
      category: 'Piano',
      title: 'Peças Lentas de Piano para Estudar Biologia à Noite (Áudio Limpo)',
      channel: 'Conservatório Aberto',
      subs: '205 mil inscritos',
      avatarColor: '#4338ca',
      views: '670 mil visualizações',
      date: 'há 6 meses',
      duration: '45:10',
      likes: '31 mil',
      description: 'Compilado instrumental de valsas lentas e peças noturnas sem letra para leitura focada.',
      sceneType: 'piano_night',
      comments: [
        { author: '@foco_vestibular', time: 'há 3 semanas', text: 'Salvou minhas madrugadas de revisão pro Primórdio.' }
      ]
    }
  ],

  // 7. Paginas Web Diretas e Enciclopedia (FragPedia / Clima / Noticias)
  webArticles: {
    'fragpedia_fraguiktos': {
      domain: 'pt.fragpedia.org/wiki/Fraguiktos',
      url: 'https://pt.fragpedia.org/wiki/Fraguiktos',
      title: 'Fraguiktos - Enciclopédia Livre',
      paragraphs: [
        'Fraguiktos é um distrito e subúrbio periférico situado na extremidade norte da região metropolitana, diretamente adjacente à reserva florestal conhecida como Mata do Norte.',
        'Fundada originalmente na década de 1940 em torno de serrarias madeireiras e do ramal ferroviário para Paládium, a localidade possui cerca de 48 mil habitantes. Entre suas instituições conhecidas estão o Colégio Estadual Primórdio, o Mercado Central e o antigo Pavilhão Municipal de Acolhimento (desativado na década passada).'
      ]
    },
    'fragpedia_paladium': {
      domain: 'pt.fragpedia.org/wiki/Paladium',
      url: 'https://pt.fragpedia.org/wiki/Paladium',
      title: 'Paládium - Enciclopédia Livre',
      paragraphs: [
        'Paládium é uma cidade histórica situada no vale mineral vizinho a Fraguiktos, famosa por sua arquitetura de pedra escura e minas profundas de quartzo e ferro exploradas desde o século XIX.',
        'Recentemente, um colapso geológico de causas ainda não inteiramente esclarecidas formou uma fenda profunda na região central, levando ao isolamento de todo o distrito antigo por equipes de contenção federal.'
      ]
    },
    'clima_fraguiktos': {
      domain: 'clima.fraguiktos.net',
      url: 'https://clima.fraguiktos.net',
      title: 'Previsão do Tempo - Fraguiktos e Subúrbio Norte',
      paragraphs: [
        'Terça-feira, 04 de Agosto de 2061 — Atualizado às 22:00',
        'Temperatura atual: 14°C • Sensação térmica: 12°C • Vento Leste: 11 km/h • Umidade do ar: 89%.',
        'Condição para a madrugada: Céu parcialmente encoberto com formação de neblina densa próxima às áreas de mata e vales entre 02h00 e 06h00. Sem previsão de chuva forte até quinta-feira.'
      ]
    },
    'noticias_fraguiktos': {
      domain: 'noticias.fraguiktos.net',
      url: 'https://noticias.fraguiktos.net',
      title: 'Jornal Local de Fraguiktos - Edição Digital',
      paragraphs: [
        'Prefeitura adia novamente reforma da iluminação pública nas travessas próximas ao bosque norte.',
        'Atrasos na linha 402 voltam a gerar filas na Praça Velha durante o horário de pico.',
        'Clínica Geral amplia horário de atendimento ambulatorial na ala oeste a partir da próxima segunda-feira.'
      ]
    }
  },

  // =========================================================================
  // CONTROLE DE PERMISSAO, DIFFING E SINCRONIZACAO RAPIDA
  // =========================================================================
  ytCategory: 'Tudo',
  ytSidebarCollapsed: false,
  ytIsPlaying: false,
  _lastRenderedFolder: null,
  _trashRendered: false,
  _lastAppliedBrowserSig: null,

  _canControl() {
    if (window.MesaNotebookSara && MesaNotebookSara._applyingRemote) return true;
    return !!(window.MesaApp && MesaApp.state && MesaApp.state.isMaster);
  },

  _notifySync() {
    if (window.MesaNotebookSara && !MesaNotebookSara._applyingRemote && MesaApp.state && MesaApp.state.isMaster) {
      MesaNotebookSara.syncNow();
    }
  },

  init() {
    if (this.initialized) return;
    this.initialized = true;

    const viewerBody = document.getElementById('sara-viewer-content');
    const browserViewport = document.getElementById('sara-browser-viewport');
    const handleScrollSync = () => {
      if (!window.MesaApp || !MesaApp.state || !MesaApp.state.isMaster) return;
      if (window.MesaNotebookSara && MesaNotebookSara._applyingRemote) return;
      const now = Date.now();
      if (now - this._lastScrollSync < 160) return;
      this._lastScrollSync = now;
      if (window.MesaNotebookSara) {
        MesaNotebookSara.syncScrollOnly();
      }
    };
    if (viewerBody) viewerBody.addEventListener('scroll', handleScrollSync, { passive: true });
    if (browserViewport) browserViewport.addEventListener('scroll', handleScrollSync, { passive: true });

    document.addEventListener('click', (e) => {
      if (!window.MesaApp || !MesaApp.state || !MesaApp.state.isMaster) return;
      const menu = document.getElementById('sara-start-menu');
      const btn = document.querySelector('.sara-start-btn');
      if (menu && menu.style.display !== 'none' && !menu.contains(e.target) && (!btn || !btn.contains(e.target))) {
        this.closeStartMenu();
      }
    });

    this.renderFolderFiles(this.activeFolder);
    this._lastRenderedFolder = this.activeFolder;
    this.renderTrashFiles();
    this._trashRendered = true;
    this.renderHistoryList();
    this.renderFragSearchHome(false);
  },

  getSyncState() {
    const viewerBody = document.getElementById('sara-viewer-content');
    const browserViewport = document.getElementById('sara-browser-viewport');
    return {
      openWindows: { ...this.openWindows },
      maximizedWindows: { ...this.maximizedWindows },
      focusedWindow: this.focusedWindow,
      activeFolder: this.activeFolder,
      viewerFileRef: this.viewerFileRef ? { ...this.viewerFileRef } : null,
      lockedModalOpen: !!this.lockedModalOpen,
      lockedError: !!this.lockedError,
      startMenuOpen: !!this.startMenuOpen,
      historyModalOpen: !!this.historyModalOpen,
      browser: {
        view: this.browserView || 'home',
        query: this.searchQuery || '',
        topicId: this.currentTopicId || null,
        ytVideoId: this.ytVideoId || null,
        ytQuery: this.ytQuery || '',
        ytCategory: this.ytCategory || 'Tudo',
        ytSidebarCollapsed: !!this.ytSidebarCollapsed,
        ytIsPlaying: !!this.ytIsPlaying,
        article: this.currentArticle ? { ...this.currentArticle } : null,
        url: this.currentUrl || 'https://fragsearch.net'
      },
      scroll: {
        viewerTop: viewerBody ? viewerBody.scrollTop : 0,
        browserTop: browserViewport ? browserViewport.scrollTop : 0
      }
    };
  },

  applySyncState(state) {
    if (!state) return;
    this.init();

    const ow = state.openWindows || {};
    this.openWindows = {
      explorer: !!ow.explorer,
      trash: !!ow.trash,
      viewer: !!ow.viewer,
      browser: !!ow.browser
    };

    const mw = state.maximizedWindows || {};
    ['explorer', 'trash', 'viewer', 'browser'].forEach(app => {
      const win = document.getElementById(`sara-win-${app}`);
      if (!win) return;
      const shouldShow = !!this.openWindows[app];
      if ((win.style.display === 'flex') !== shouldShow) {
        win.style.display = shouldShow ? 'flex' : 'none';
      }
      const nextMax = !!mw[app];
      if (this.maximizedWindows[app] !== nextMax) {
        this.maximizedWindows[app] = nextMax;
        if (nextMax) {
          win.dataset.isMaximized = 'true';
          win.style.width = '100vw';
          win.style.height = 'calc(100vh - 44px)';
          win.style.top = '0';
          win.style.borderRadius = '0';
        } else {
          win.dataset.isMaximized = 'false';
          win.style.width = '';
          win.style.height = '';
          win.style.top = '40px';
          win.style.borderRadius = '8px';
        }
      }
      if (state.focusedWindow === app) {
        this.focusedWindow = app;
        win.style.zIndex = '55';
      } else {
        win.style.zIndex = '50';
      }
    });

    const btnExp = document.getElementById('task-btn-explorer');
    const btnBrw = document.getElementById('task-btn-browser');
    if (btnExp) btnExp.classList.toggle('active', !!this.openWindows.explorer);
    if (btnBrw) btnBrw.classList.toggle('active', !!this.openWindows.browser);

    const targetFolder = state.activeFolder || 'Estudos_Primordio';
    if (targetFolder !== this._lastRenderedFolder) {
      this._renderFolderState(targetFolder);
    }

    if (this.openWindows.trash && !this._trashRendered) {
      this.renderTrashFiles();
      this._trashRendered = true;
    }

    if (this.openWindows.viewer && state.viewerFileRef) {
      const newRefStr = JSON.stringify(state.viewerFileRef);
      const oldRefStr = JSON.stringify(this.viewerFileRef);
      if (newRefStr !== oldRefStr) {
        this.viewerFileRef = { ...state.viewerFileRef };
        this._openViewerByRef(state.viewerFileRef);
      }
    } else if (!this.openWindows.viewer) {
      this.viewerFileRef = null;
    }

    this.lockedModalOpen = !!state.lockedModalOpen;
    this.lockedError = !!state.lockedError;
    const lockedModal = document.getElementById('sara-locked-modal');
    const lockedErr = document.getElementById('sara-file-password-error');
    if (lockedModal) lockedModal.style.display = this.lockedModalOpen ? 'flex' : 'none';
    if (lockedErr) lockedErr.style.display = this.lockedError ? 'block' : 'none';

    this.startMenuOpen = !!state.startMenuOpen;
    const startMenu = document.getElementById('sara-start-menu');
    if (startMenu) startMenu.style.display = this.startMenuOpen ? 'block' : 'none';

    this.historyModalOpen = !!state.historyModalOpen;
    const histModal = document.getElementById('sara-history-modal');
    if (histModal) histModal.style.display = this.historyModalOpen ? 'flex' : 'none';

    if (state.browser) {
      const b = state.browser;
      const sig = JSON.stringify(b);
      if (sig !== this._lastAppliedBrowserSig) {
        this._lastAppliedBrowserSig = sig;
        this.ytCategory = b.ytCategory || 'Tudo';
        this.ytSidebarCollapsed = !!b.ytSidebarCollapsed;
        this.ytIsPlaying = !!b.ytIsPlaying;
        if (b.view === 'home') this.renderFragSearchHome(false);
        else if (b.view === 'results') this.renderFragSearchResults(b.query || '');
        else if (b.view === 'subreddit') this.renderReadItSubreddit();
        else if (b.view === 'topic') this.renderReadItTopic(b.topicId || 14);
        else if (b.view === 'sheet_music') this.renderSheetMusicPage();
        else if (b.view === 'youtube') this.renderYouTubeHome(b.ytQuery || '');
        else if (b.view === 'yt_watch') this.renderYouTubeWatch(b.ytVideoId);
        else if (b.view === 'article' && b.article) this.renderWebArticle(b.article);
      }
      if (b.url) this.setBrowserUrl(b.url);
    }

    if (state.scroll) {
      const viewerBody = document.getElementById('sara-viewer-content');
      const browserViewport = document.getElementById('sara-browser-viewport');
      if (viewerBody && typeof state.scroll.viewerTop === 'number' && Math.abs(viewerBody.scrollTop - state.scroll.viewerTop) > 4) {
        viewerBody.scrollTop = state.scroll.viewerTop;
      }
      if (browserViewport && typeof state.scroll.browserTop === 'number' && Math.abs(browserViewport.scrollTop - state.scroll.browserTop) > 4) {
        browserViewport.scrollTop = state.scroll.browserTop;
      }
    }
  },

  openApp(appName) {
    if (!this._canControl()) return;
    this.init();

    // Fecha menu iniciar silenciosamente antes do sync unico
    if (this.startMenuOpen) {
      this.startMenuOpen = false;
      const menu = document.getElementById('sara-start-menu');
      if (menu) menu.style.display = 'none';
    }

    if (appName === 'cameras') {
      if (window.MesaNotebookSara) {
        MesaNotebookSara.openCameras();
      }
      return;
    }

    if (this.openWindows.hasOwnProperty(appName)) {
      this.openWindows[appName] = true;
      this.focusedWindow = appName;
      const win = document.getElementById(`sara-win-${appName}`);
      if (win) {
        win.style.display = 'flex';
        this.bringWindowToFront(win, appName);
      }
      if (appName === 'explorer' && this._lastRenderedFolder !== (this.activeFolder || 'Estudos_Primordio')) {
        this._renderFolderState(this.activeFolder || 'Estudos_Primordio');
      }
      if (appName === 'trash' && !this._trashRendered) {
        this.renderTrashFiles();
        this._trashRendered = true;
      }
      if (appName === 'browser' && !this.browserView) {
        this.renderFragSearchHome(false);
      }
    }

    const btnExp = document.getElementById('task-btn-explorer');
    const btnBrw = document.getElementById('task-btn-browser');
    if (btnExp) btnExp.classList.toggle('active', !!this.openWindows.explorer);
    if (btnBrw) btnBrw.classList.toggle('active', !!this.openWindows.browser);

    this._notifySync();
  },

  closeApp(appName) {
    if (!this._canControl()) return;
    if (this.openWindows.hasOwnProperty(appName)) {
      this.openWindows[appName] = false;
      const win = document.getElementById(`sara-win-${appName}`);
      if (win) win.style.display = 'none';
    }
    if (appName === 'viewer') {
      this.viewerFileRef = null;
    }
    const btnExp = document.getElementById('task-btn-explorer');
    const btnBrw = document.getElementById('task-btn-browser');
    if (btnExp) btnExp.classList.toggle('active', !!this.openWindows.explorer);
    if (btnBrw) btnBrw.classList.toggle('active', !!this.openWindows.browser);

    this._notifySync();
  },

  minimizeApp(appName) {
    this.closeApp(appName);
  },

  maximizeApp(appName) {
    if (!this._canControl()) return;
    const win = document.getElementById(`sara-win-${appName}`);
    if (!win) return;
    const next = !this.maximizedWindows[appName];
    this.maximizedWindows[appName] = next;
    if (next) {
      win.dataset.isMaximized = 'true';
      win.style.width = '100vw';
      win.style.height = 'calc(100vh - 44px)';
      win.style.top = '0';
      win.style.borderRadius = '0';
    } else {
      win.dataset.isMaximized = 'false';
      win.style.width = '';
      win.style.height = '';
      win.style.top = '40px';
      win.style.borderRadius = '8px';
    }
    this._notifySync();
  },

  bringWindowToFront(win, appName = null) {
    document.querySelectorAll('.sara-window').forEach(w => w.style.zIndex = '50');
    win.style.zIndex = '55';
    if (appName) this.focusedWindow = appName;
  },

  toggleStartMenu() {
    if (!this._canControl()) return;
    const menu = document.getElementById('sara-start-menu');
    if (!menu) return;
    this.startMenuOpen = !this.startMenuOpen;
    menu.style.display = this.startMenuOpen ? 'block' : 'none';
    this._notifySync();
  },

  closeStartMenu() {
    if (!this._canControl()) return;
    if (!this.startMenuOpen) return;
    this.startMenuOpen = false;
    const menu = document.getElementById('sara-start-menu');
    if (menu) menu.style.display = 'none';
    this._notifySync();
  },

  // =========================================================================
  // EXPLORADOR DE ARQUIVOS & LIXEIRA
  // =========================================================================
  _renderFolderState(folderName) {
    this.activeFolder = folderName;
    this._lastRenderedFolder = folderName;
    const pathEl = document.getElementById('explorer-current-path');
    if (pathEl) {
      pathEl.textContent = `Este Computador > Documentos > ${folderName}`;
    }

    const btnEstudos = document.getElementById('btn-folder-estudos');
    const btnPiano = document.getElementById('btn-folder-piano');
    const btnPessoal = document.getElementById('btn-folder-pessoal');
    if (btnEstudos) btnEstudos.classList.toggle('active', folderName === 'Estudos_Primordio');
    if (btnPiano) btnPiano.classList.toggle('active', folderName === 'Piani_e_Partituras');
    if (btnPessoal) btnPessoal.classList.toggle('active', folderName === 'Pessoal');

    this.renderFolderFiles(folderName);
  },

  switchFolder(folderName) {
    if (!this._canControl()) return;
    if (this._lastRenderedFolder === folderName) return;
    this._renderFolderState(folderName);
    this._notifySync();
  },

  renderFolderFiles(folderName) {
    const container = document.getElementById('sara-explorer-file-list');
    if (!container) return;

    const list = this.folders[folderName] || [];
    let html = '';

    list.forEach(file => {
      let iconSvg = '';
      if (file.type === 'pdf') {
        iconSvg = `<svg viewBox="0 0 24 24" width="36" height="36" fill="#ef4444"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8" fill="#fca5a5"></polyline><text x="7" y="18" fill="#fff" font-size="6" font-family="sans-serif" font-weight="bold">PDF</text></svg>`;
      } else if (file.type === 'locked') {
        iconSvg = `<svg viewBox="0 0 24 24" width="36" height="36" fill="#f59e0b"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4" fill="none" stroke="#f59e0b" stroke-width="2"></path></svg>`;
      } else {
        iconSvg = `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#94a3b8" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;
      }

      html += `
        <div class="sara-file-item" onclick="MesaSaraDesktop.openFile('${folderName}', '${file.id}')" title="${file.name}">
          <div class="sara-file-icon">${iconSvg}</div>
          <div class="sara-file-name">${file.name}</div>
          <div class="sara-file-meta">${file.size || ''}</div>
        </div>
      `;
    });

    container.innerHTML = html;
  },

  renderTrashFiles() {
    const container = document.getElementById('sara-trash-file-list');
    if (!container) return;

    let html = '';
    this.trashFiles.forEach(file => {
      let iconSvg = '';
      if (file.type === 'pdf') {
        iconSvg = `<svg viewBox="0 0 24 24" width="36" height="36" fill="#ef4444"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8" fill="#fca5a5"></polyline><text x="7" y="18" fill="#fff" font-size="6" font-family="sans-serif" font-weight="bold">PDF</text></svg>`;
      } else {
        iconSvg = `<svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#94a3b8" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>`;
      }

      html += `
        <div class="sara-file-item" onclick="MesaSaraDesktop.openTrashFile('${file.id}')" title="${file.name}">
          <div class="sara-file-icon">${iconSvg}</div>
          <div class="sara-file-name">${file.name}</div>
          <div class="sara-file-meta">${file.size || ''}</div>
        </div>
      `;
    });
    container.innerHTML = html;
  },

  _openViewerByRef(ref) {
    if (!ref) return;
    if (ref.source === 'trash') {
      const file = this.trashFiles.find(f => f.id === ref.id);
      if (file) this.renderDocumentViewer(file);
    } else if (ref.source === 'locked') {
      const list = this.folders['Pessoal'] || [];
      const file = list.find(f => f.id === ref.id);
      if (file) {
        this.renderDocumentViewer({
          name: file.unlockedTitle || 'particular.txt',
          type: 'txt',
          content: file.content
        });
      }
    } else if (ref.source === 'folder') {
      const list = this.folders[ref.folder] || [];
      const file = list.find(f => f.id === ref.id);
      if (file) this.renderDocumentViewer(file);
    }
  },

  openFile(folderName, fileId) {
    if (!this._canControl()) return;
    const list = this.folders[folderName] || [];
    const file = list.find(f => f.id === fileId);
    if (!file) return;

    if (file.type === 'locked') {
      this.pendingLockedFile = file;
      this.openLockedPrompt();
      return;
    }

    this.viewerFileRef = { source: 'folder', folder: folderName, id: fileId };
    this.openWindows.viewer = true;
    this.renderDocumentViewer(file);
    this._notifySync();
  },

  openTrashFile(fileId) {
    if (!this._canControl()) return;
    const file = this.trashFiles.find(f => f.id === fileId);
    if (!file) return;
    this.viewerFileRef = { source: 'trash', folder: 'Lixeira', id: fileId };
    this.openWindows.viewer = true;
    this.renderDocumentViewer(file);
    this._notifySync();
  },

  renderDocumentViewer(file) {
    const win = document.getElementById('sara-win-viewer');
    const filenameEl = document.getElementById('sara-viewer-filename');
    const contentEl = document.getElementById('sara-viewer-content');
    if (!win || !contentEl) return;

    if (filenameEl) filenameEl.textContent = file.name || file.unlockedTitle || 'documento';

    if (file.type === 'pdf') {
      contentEl.innerHTML = `
        <div class="sara-pdf-paper">
          <div class="pdf-header">
            <div>
              <div class="pdf-header-title">${file.title || file.name}</div>
              <div class="pdf-header-sub">${file.subtitle || ''}</div>
            </div>
            <div class="pdf-badge">PDF • PÁG 1/1</div>
          </div>
          ${file.content}
        </div>
      `;
    } else {
      contentEl.innerHTML = `<div class="sara-txt-content">${file.content}</div>`;
    }

    contentEl.scrollTop = 0;
    win.style.display = 'flex';
    this.bringWindowToFront(win, 'viewer');
  },

  openLockedPrompt() {
    if (!this._canControl()) return;
    this.lockedModalOpen = true;
    this.lockedError = false;
    const modal = document.getElementById('sara-locked-modal');
    const input = document.getElementById('sara-file-password-input');
    const err = document.getElementById('sara-file-password-error');
    if (modal) modal.style.display = 'flex';
    if (err) err.style.display = 'none';
    if (input) {
      input.value = '';
      if (window.MesaApp && MesaApp.state && MesaApp.state.isMaster) {
        setTimeout(() => input.focus(), 80);
      }
    }
    this._notifySync();
  },

  closeLockedPrompt() {
    if (!this._canControl()) return;
    this.lockedModalOpen = false;
    this.lockedError = false;
    const modal = document.getElementById('sara-locked-modal');
    if (modal) modal.style.display = 'none';
    this.pendingLockedFile = null;
    this._notifySync();
  },

  submitFilePassword() {
    if (!this._canControl()) return;
    const input = document.getElementById('sara-file-password-input');
    const err = document.getElementById('sara-file-password-error');
    const val = input ? input.value.trim() : '';

    if (val === '1415' || val === '0408') {
      const file = this.pendingLockedFile || (this.folders['Pessoal'] || []).find(f => f.id === 'ultimo_registro');
      this.lockedModalOpen = false;
      this.lockedError = false;
      this.pendingLockedFile = null;
      const modal = document.getElementById('sara-locked-modal');
      if (modal) modal.style.display = 'none';

      if (file) {
        this.viewerFileRef = { source: 'locked', folder: 'Pessoal', id: file.id };
        this.openWindows.viewer = true;
        this.renderDocumentViewer({
          name: file.unlockedTitle || 'particular.txt',
          type: 'txt',
          content: file.content
        });
      }
      this._notifySync();
      return;
    }

    this.lockedError = true;
    if (err) err.style.display = 'block';
    if (input) {
      input.value = '';
      input.focus();
    }
    this._notifySync();
  },

  // =========================================================================
  // MINIATURAS ILUSTRADAS DO YOUTUBE (SVG CENARIOS REALISTAS 16:9)
  // =========================================================================
  _getYouTubeThumbSVG(sceneType, overlayTag = '') {
    if (sceneType === 'piano') {
      return `<svg class="yt-scene-svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        <defs><linearGradient id="ytpg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#1e293b"/><stop offset="100%" stop-color="#020617"/></linearGradient></defs>
        <rect width="320" height="180" fill="url(#ytpg1)"/>
        <g transform="translate(30,75)">
          ${[0,1,2,3,4,5,6,7,8,9,10,11].map(i => `<rect x="${i*22}" y="0" width="20" height="82" rx="2" fill="#e2e8f0" stroke="#94a3b8" stroke-width="0.8"/>`).join('')}
          ${[0,1,3,4,5,7,8,10].map(i => `<rect x="${i*22+14}" y="0" width="12" height="50" rx="1" fill="#0f172a"/>`).join('')}
        </g>
        <circle cx="245" cy="40" r="24" fill="rgba(148,163,184,0.12)"/>
        <text x="20" y="34" fill="#f8fafc" font-size="14" font-weight="bold" font-family="sans-serif">CLAIR DE LUNE</text>
        <text x="20" y="52" fill="#93c5fd" font-size="10" font-family="sans-serif">TUTORIAL PIANO • COMPASSOS 15-30</text>
      </svg>`;
    }
    if (sceneType === 'archery') {
      return `<svg class="yt-scene-svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        <rect width="320" height="180" fill="#062814"/>
        <ellipse cx="160" cy="180" rx="180" ry="70" fill="#0c3d20"/>
        <circle cx="215" cy="86" r="46" fill="#f8fafc"/>
        <circle cx="215" cy="86" r="35" fill="#1e293b"/>
        <circle cx="215" cy="86" r="24" fill="#2563eb"/>
        <circle cx="215" cy="86" r="14" fill="#dc2626"/>
        <circle cx="215" cy="86" r="5" fill="#facc15"/>
        <line x1="85" y1="110" x2="212" y2="86" stroke="#e2e8f0" stroke-width="2"/>
        <path d="M75,30 Q105,90 75,150" fill="none" stroke="#92400e" stroke-width="4"/>
        <text x="18" y="34" fill="#ecfdf5" font-size="12" font-weight="bold" font-family="sans-serif">ARCO RECURVO 30M</text>
      </svg>`;
    }
    if (sceneType === 'rain') {
      return `<svg class="yt-scene-svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        <rect width="320" height="180" fill="#09111f"/>
        <rect x="60" y="18" width="200" height="144" fill="#0f1b2e" stroke="#1e293b" stroke-width="6"/>
        <line x1="160" y1="18" x2="160" y2="162" stroke="#1e293b" stroke-width="4"/>
        <line x1="60" y1="90" x2="260" y2="90" stroke="#1e293b" stroke-width="4"/>
        <circle cx="115" cy="120" r="12" fill="rgba(251,191,36,0.18)"/>
        <circle cx="215" cy="128" r="16" fill="rgba(56,189,248,0.12)"/>
        ${[0,1,2,3,4,5,6,7,8,9,10,11].map(i => `<line x1="${75+i*15}" y1="${24+(i%3)*20}" x2="${68+i*15}" y2="${52+(i%3)*20}" stroke="rgba(148,163,184,0.35)" stroke-width="1.2"/>`).join('')}
        <text x="84" y="148" fill="#cbd5e1" font-size="10" font-family="sans-serif">CHUVA NOTURNA NA JANELA</text>
      </svg>`;
    }
    if (sceneType === 'news') {
      return `<svg class="yt-scene-svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        <rect width="320" height="180" fill="#180a0a"/>
        <polygon points="0,120 95,65 160,110 235,55 320,120 320,180 0,180" fill="#291212"/>
        <rect x="0" y="128" width="320" height="32" fill="#b91c1c"/>
        <rect x="0" y="160" width="320" height="20" fill="#0f172a"/>
        <text x="14" y="149" fill="#ffffff" font-size="12" font-weight="bold" font-family="sans-serif">PLANTÃO REGIONAL: FENDA EM PALÁDIUM</text>
        <text x="14" y="173" fill="#cbd5e1" font-size="9" font-family="sans-serif">TV FRAGUIKTOS HOJE • ÁREA CENTRAL ISOLADA</text>
      </svg>`;
    }
    if (sceneType === 'cake') {
      return `<svg class="yt-scene-svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        <rect width="320" height="180" fill="#431407"/>
        <ellipse cx="160" cy="142" rx="95" ry="18" fill="#e2e8f0"/>
        <path d="M90,136 L220,136 L220,90 L90,90 Z" fill="#f97316"/>
        <path d="M88,90 Q120,76 155,82 Q190,74 222,90 L222,102 Q205,112 195,98 Q175,118 160,100 Q140,116 125,98 Q105,114 88,100 Z" fill="#3f1d0b"/>
        <text x="20" y="34" fill="#ffedd5" font-size="13" font-weight="bold" font-family="sans-serif">BOLO DE CENOURA FOFINHO</text>
      </svg>`;
    }
    if (sceneType === 'cat') {
      return `<svg class="yt-scene-svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        <rect width="320" height="180" fill="#27272a"/>
        <rect x="0" y="125" width="320" height="55" fill="#3f3f46"/>
        <ellipse cx="185" cy="115" rx="34" ry="26" fill="#09090b" opacity="0.5"/>
        <circle cx="115" cy="95" r="24" fill="#ea580c"/>
        <polygon points="94,82 98,58 112,74" fill="#ea580c"/>
        <polygon points="118,74 132,58 136,82" fill="#ea580c"/>
        <ellipse cx="115" cy="130" rx="26" ry="20" fill="#f97316"/>
        <circle cx="107" cy="92" r="3" fill="#fef08a"/>
        <circle cx="123" cy="92" r="3" fill="#fef08a"/>
      </svg>`;
    }
    if (sceneType === 'beetle') {
      return `<svg class="yt-scene-svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        <rect width="320" height="180" fill="#064e3b"/>
        <path d="M20,140 Q160,40 300,150 Q160,175 20,140 Z" fill="#047857"/>
        <ellipse cx="165" cy="95" rx="34" ry="24" fill="#10b981" stroke="#022c22" stroke-width="2"/>
        <line x1="165" y1="71" x2="165" y2="119" stroke="#064e3b" stroke-width="2"/>
        <circle cx="132" cy="95" r="10" fill="#065f46"/>
        <line x1="150" y1="74" x2="140" y2="55" stroke="#022c22" stroke-width="2"/>
        <line x1="175" y1="74" x2="185" y2="55" stroke="#022c22" stroke-width="2"/>
        <line x1="150" y1="116" x2="140" y2="135" stroke="#022c22" stroke-width="2"/>
        <line x1="175" y1="116" x2="185" y2="135" stroke="#022c22" stroke-width="2"/>
      </svg>`;
    }
    return `<svg class="yt-scene-svg" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
      <rect width="320" height="180" fill="#1e1b4b"/>
      <rect x="40" y="95" width="240" height="85" fill="#0f172a"/>
      ${[0,1,2,3,4,5,6,7,8,9].map(i => `<rect x="${50+i*22}" y="102" width="18" height="60" fill="#cbd5e1"/>`).join('')}
      <text x="20" y="38" fill="#e0e7ff" font-size="12" font-weight="bold" font-family="sans-serif">PEÇAS LENTAS DE PIANO</text>
      <text x="20" y="56" fill="#a5b4fc" font-size="10" font-family="sans-serif">NOITES CHUVOSAS • ÁUDIO LIMPO</text>
    </svg>`;
  },

  // =========================================================================
  // NAVEGADOR WEB REALISTA (FRAGSEARCH, YOUTUBE IDENTICO, FRAGPEDIA & READIT)
  // =========================================================================
  setBrowserUrl(url) {
    this.currentUrl = url;
    const input = document.getElementById('sara-browser-url-input');
    if (input) input.value = url;
  },

  _pushHistory(entry) {
    this.browserBackStack.push(entry);
    if (this.browserBackStack.length > 25) this.browserBackStack.shift();
    this.browserForwardStack = [];
  },

  _getCurrentNavSnapshot() {
    return {
      view: this.browserView,
      query: this.searchQuery,
      topicId: this.currentTopicId,
      ytVideoId: this.ytVideoId,
      ytQuery: this.ytQuery,
      ytCategory: this.ytCategory,
      ytSidebarCollapsed: this.ytSidebarCollapsed,
      ytIsPlaying: this.ytIsPlaying,
      article: this.currentArticle ? { ...this.currentArticle } : null,
      url: this.currentUrl
    };
  },

  renderFragSearchHome(clearStacks = false) {
    this.browserView = 'home';
    this.searchQuery = '';
    this.setBrowserUrl('https://fragsearch.net');
    const viewport = document.getElementById('sara-browser-viewport');
    if (!viewport) return;

    viewport.innerHTML = `
      <div class="fragsearch-home">
        <div class="fragsearch-logo">
          <span class="logo-f1">F</span><span class="logo-r">r</span><span class="logo-a">a</span><span class="logo-g">g</span><span class="logo-s">S</span><span class="logo-e">e</span><span class="logo-a2">a</span><span class="logo-r2">r</span><span class="logo-c">c</span><span class="logo-h">h</span>
        </div>
        <div class="fragsearch-form">
          <div class="fragsearch-input-box">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#64748b" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input type="text" id="fragsearch-main-input" class="fragsearch-input" placeholder="Pesquisar no FragSearch ou digitar um URL..." autocomplete="off" onkeydown="if(event.key==='Enter') MesaSaraDesktop.execFragSearch(this.value)">
          </div>
          <div class="fragsearch-buttons">
            <button type="button" class="fragsearch-btn" onclick="MesaSaraDesktop.execFragSearch(document.getElementById('fragsearch-main-input').value)">Pesquisa FragSearch</button>
            <button type="button" class="fragsearch-btn" onclick="MesaSaraDesktop.openWebPage('youtube')">YouTube</button>
          </div>
        </div>
      </div>
    `;
    viewport.scrollTop = 0;
  },

  goFragSearchHome() {
    if (!this._canControl()) return;
    if (this.browserView && this.browserView !== 'home') {
      this._pushHistory(this._getCurrentNavSnapshot());
    }
    this.renderFragSearchHome(false);
    this._notifySync();
  },

  navigateFromAddressBar(rawInput) {
    if (!this._canControl()) return;
    const val = (rawInput || '').trim();
    if (!val) {
      this.goFragSearchHome();
      return;
    }
    const lower = val.toLowerCase().replace(/^https?:\/\//, '').replace(/^www\./, '');
    if (lower === 'fragsearch.net') {
      this.goFragSearchHome();
      return;
    }
    if (lower === 'youtube.com' || lower.startsWith('youtube.com/')) {
      this.openWebPage('youtube');
      return;
    }
    if (lower.startsWith('readit.net/r/conspiracoes/topico_14') || lower.includes('ghorvaelis') || lower.includes('topico_14')) {
      this.openReadItTopic(14);
      return;
    }
    if (lower === 'readit.net' || lower.startsWith('readit.net/')) {
      this.openReadItSubreddit();
      return;
    }
    if (lower.includes('partituras')) {
      this.openSheetMusicPage();
      return;
    }
    if (lower.includes('clima.fraguiktos')) {
      this.openWebArticle(this.webArticles.clima_fraguiktos);
      return;
    }
    if (lower.includes('noticias.fraguiktos')) {
      this.openWebArticle(this.webArticles.noticias_fraguiktos);
      return;
    }
    if (lower.includes('fragpedia')) {
      this.openWebArticle(this.webArticles.fragpedia_fraguiktos);
      return;
    }
    this.execFragSearch(val);
  },

  execFragSearch(query) {
    if (!this._canControl()) return;
    if (!query || !query.trim()) {
      this.goFragSearchHome();
      return;
    }
    this._pushHistory(this._getCurrentNavSnapshot());
    this.renderFragSearchResults(query);
    this._notifySync();
  },

  renderFragSearchResults(query) {
    this.browserView = 'results';
    this.searchQuery = query;
    const cleanQ = query.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    this.setBrowserUrl(`https://fragsearch.net/search?q=${encodeURIComponent(query)}`);

    const results = [];

    if (cleanQ.includes('youtube') || cleanQ.includes('video') || cleanQ.includes('musica') || cleanQ.includes('chuva')) {
      results.push({
        url: 'https://www.youtube.com',
        title: 'YouTube',
        snippet: 'Aproveite os vídeos e a música que você ama, compartilhe vídeos com amigos e assista a canais da rede no YouTube.',
        onclick: `MesaSaraDesktop.openWebPage('youtube')`
      });
    }

    this.youtubeVideos.forEach(v => {
      const hay = (v.title + ' ' + v.channel + ' ' + v.description + ' ' + v.category).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const terms = cleanQ.split(/\s+/).filter(t => t.length >= 3);
      if (terms.some(t => hay.includes(t))) {
        results.push({
          url: `https://www.youtube.com/watch?v=${v.id}`,
          title: `${v.title} - YouTube`,
          snippet: `${v.channel} • ${v.views} • ${v.description}`,
          onclick: `MesaSaraDesktop.openYouTubeVideo('${v.id}')`
        });
      }
    });

    if (cleanQ.includes('partitura') || cleanQ.includes('piano') || cleanQ.includes('clair')) {
      results.push({
        url: 'https://partituras-classicas.art/acervo',
        title: 'Acervo de Partituras Clássicas - Biblioteca Digital',
        snippet: 'Download de partituras em PDF e cifras para piano clássico e popular em domínio público.',
        onclick: `MesaSaraDesktop.openSheetMusicPage()`
      });
    }

    if (cleanQ.includes('clima') || cleanQ.includes('tempo') || cleanQ.includes('temperatura') || cleanQ.includes('previsao') || cleanQ.includes('neblina')) {
      results.push({
        url: this.webArticles.clima_fraguiktos.url,
        title: this.webArticles.clima_fraguiktos.title,
        snippet: 'Previsão horária para Fraguiktos e Subúrbio Norte. Mínima 12°C, neblina densa prevista durante a madrugada.',
        onclick: `MesaSaraDesktop.openWebArticleByKey('clima_fraguiktos')`
      });
    }

    if (cleanQ.includes('fraguiktos') || cleanQ.includes('fragpedia') || cleanQ.includes('primordio') || cleanQ.includes('historia')) {
      results.push({
        url: this.webArticles.fragpedia_fraguiktos.url,
        title: this.webArticles.fragpedia_fraguiktos.title,
        snippet: this.webArticles.fragpedia_fraguiktos.paragraphs[0],
        onclick: `MesaSaraDesktop.openWebArticleByKey('fragpedia_fraguiktos')`
      });
    }

    if (cleanQ.includes('paladium') || cleanQ.includes('terremoto') || cleanQ.includes('cratera')) {
      results.push({
        url: this.webArticles.fragpedia_paladium.url,
        title: this.webArticles.fragpedia_paladium.title,
        snippet: this.webArticles.fragpedia_paladium.paragraphs[0],
        onclick: `MesaSaraDesktop.openWebArticleByKey('fragpedia_paladium')`
      });
    }

    if (cleanQ.includes('readit') || cleanQ.includes('forum')) {
      results.push({
        url: 'https://readit.net/r/Conspiracoes+Fraguiktos',
        title: 'ReadIt: r/Fraguiktos & r/Conspiracoes - Comunidade Local',
        snippet: 'Discussões de moradores, utilidade pública, relatos do subúrbio norte e fórum aberto de teorias da região.',
        onclick: `MesaSaraDesktop.openReadItSubreddit()`
      });
    }

    const terms = cleanQ.split(/\s+/).filter(t => t.length >= 2);
    this.readItTopics.forEach(t => {
      const full = (t.title + ' ' + t.content + ' ' + t.author + ' ' + t.subreddit).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (terms.some(term => full.includes(term))) {
        results.push({
          url: `https://readit.net/${t.subreddit}/topico_${t.id}`,
          title: `${t.title} : ${t.subreddit}`,
          snippet: t.content.substring(0, 185).replace(/\n+/g, ' ') + '...',
          onclick: `MesaSaraDesktop.openReadItTopic(${t.id})`
        });
      }
    });

    if (results.length === 0) {
      const encoded = encodeURIComponent(query.trim());
      const domainSlug = cleanQ.replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'busca';
      results.push(
        {
          url: `https://pt.fragpedia.org/wiki/${domainSlug}`,
          title: `${query.trim()} - FragPédia, a enciclopédia livre`,
          snippet: `Artigo e referências gerais sobre "${query.trim()}": definições técnicas, contexto histórico e informações públicas indexadas.`,
          onclick: `MesaSaraDesktop.openDynamicArticle('${query.replace(/'/g, "\\'")}', 'wiki')`
        },
        {
          url: `https://www.youtube.com/results?search_query=${encoded}`,
          title: `Vídeos relacionados a "${query.trim()}" - YouTube`,
          snippet: `Assista a vídeos e gravações relacionadas a ${query.trim()} no YouTube.`,
          onclick: `MesaSaraDesktop.openWebPage('youtube', '${query.replace(/'/g, "\\'")}')`
        },
        {
          url: `https://readit.net/search?q=${encoded}`,
          title: `Resultados da comunidade em ReadIt para "${query.trim()}"`,
          snippet: `Veja o que moradores de Fraguiktos estão comentando recentemente em tópicos locais sobre o assunto.`,
          onclick: `MesaSaraDesktop.openReadItSubreddit()`
        },
        {
          url: `https://noticias.fraguiktos.net/arquivo?q=${encoded}`,
          title: `Arquivo de Notas Regionais: "${query.trim()}"`,
          snippet: `Consulte boletins antigos da região metropolitana de Fraguiktos e Paládium relacionados à pesquisa.`,
          onclick: `MesaSaraDesktop.openWebArticleByKey('noticias_fraguiktos')`
        }
      );
    }

    const viewport = document.getElementById('sara-browser-viewport');
    if (!viewport) return;

    const resultsHtml = results.map(r => `
      <div class="search-result-item">
        <div class="result-url">${r.url}</div>
        <a class="result-title" onclick="${r.onclick}">${r.title}</a>
        <div class="result-snippet">${r.snippet}</div>
      </div>
    `).join('');

    viewport.innerHTML = `
      <div class="fragsearch-results-page">
        <div style="display:flex; gap:10px; align-items:center; margin-bottom:18px; padding-bottom:14px; border-bottom:1px solid #1e293b;">
          <div class="fragsearch-logo" style="font-size:20px; margin:0; cursor:pointer;" onclick="MesaSaraDesktop.goFragSearchHome()">
            <span class="logo-f1">F</span><span class="logo-r">r</span><span class="logo-a">a</span><span class="logo-g">g</span><span class="logo-s">S</span><span class="logo-e">e</span><span class="logo-a2">a</span><span class="logo-r2">r</span><span class="logo-c">c</span><span class="logo-h">h</span>
          </div>
          <div class="fragsearch-input-box" style="height:36px; flex:1; max-width:520px;">
            <input type="text" id="fragsearch-top-input" class="fragsearch-input" value="${query.replace(/"/g, '&quot;')}" autocomplete="off" onkeydown="if(event.key==='Enter') MesaSaraDesktop.execFragSearch(this.value)">
          </div>
          <button type="button" class="fragsearch-btn" onclick="MesaSaraDesktop.execFragSearch(document.getElementById('fragsearch-top-input').value)">Buscar</button>
        </div>
        <div class="results-stats">Aproximadamente ${results.length} resultados (0,14 segundos)</div>
        ${resultsHtml}
      </div>
    `;
    viewport.scrollTop = 0;
  },

  openReadItSubreddit() {
    if (!this._canControl()) return;
    this._pushHistory(this._getCurrentNavSnapshot());
    this.renderReadItSubreddit();
    this._notifySync();
  },

  renderReadItSubreddit() {
    this.browserView = 'subreddit';
    this.setBrowserUrl('https://readit.net/r/Conspiracoes+Fraguiktos');
    const viewport = document.getElementById('sara-browser-viewport');
    if (!viewport) return;

    const postsHtml = this.readItTopics.map(t => `
      <div class="readit-post-card" onclick="MesaSaraDesktop.openReadItTopic(${t.id})">
        <div class="readit-vote-column">
          <span class="vote-arrow">&#9650;</span>
          <span>${t.votes}</span>
          <span class="vote-arrow">&#9660;</span>
        </div>
        <div class="readit-post-main">
          <div class="post-meta">
            <span>${t.subreddit}</span> • <span class="post-author">${t.author}</span> • <span>${t.time}</span>
          </div>
          <div class="post-title">${t.title}</div>
          <div class="post-preview-text">${t.content.substring(0, 160)}...</div>
          <div class="post-footer-stats">
            <span>${t.commentsCount || (t.comments ? t.comments.length : 0)} comentários</span>
            <span>Compartilhar</span>
            <span>Salvar</span>
          </div>
        </div>
      </div>
    `).join('');

    viewport.innerHTML = `
      <div class="readit-container">
        <div class="readit-subreddit-header">
          <div>
            <div class="subreddit-info-title">r/Fraguiktos &bull; r/Conspiracoes</div>
            <div class="subreddit-info-desc">Comunidade local do subúrbio norte: utilidade pública, cotidiano do bairro e discussões abertas.</div>
          </div>
          <div style="font-size: 11px; color: #64748b;">42.8k membros</div>
        </div>
        <div class="readit-posts-list">
          ${postsHtml}
        </div>
      </div>
    `;
    viewport.scrollTop = 0;
  },

  openReadItTopic(topicId) {
    if (!this._canControl()) return;
    this._pushHistory(this._getCurrentNavSnapshot());
    this.renderReadItTopic(topicId);
    this._notifySync();
  },

  renderReadItTopic(topicId) {
    const topic = this.readItTopics.find(t => t.id === Number(topicId));
    if (!topic) return;

    this.browserView = 'topic';
    this.currentTopicId = topic.id;
    this.setBrowserUrl(`https://readit.net/${topic.subreddit}/topico_${topic.id}`);

    const viewport = document.getElementById('sara-browser-viewport');
    if (!viewport) return;

    let commentsHtml = '';
    if (topic.comments && topic.comments.length > 0) {
      commentsHtml = topic.comments.map(c => `
        <div class="comment-card">
          <div class="comment-meta">
            <span class="comment-author">${c.author}</span> • <span>${c.time}</span>
          </div>
          <div class="comment-text">${c.text}</div>
        </div>
      `).join('');
    } else {
      commentsHtml = `
        <div class="comment-card">
          <div class="comment-text" style="color: #64748b;">Nenhum comentário adicional neste tópico.</div>
        </div>
      `;
    }

    viewport.innerHTML = `
      <div class="readit-container">
        <div class="readit-topic-view">
          <button type="button" class="topic-back-btn" onclick="MesaSaraDesktop.openReadItSubreddit()">
            &larr; Voltar para r/Fraguiktos &amp; r/Conspiracoes
          </button>
          <div class="topic-header-meta">
            <span>${topic.subreddit}</span> • <span class="post-author">${topic.author}</span> • <span>${topic.time}</span> • <span>${topic.votes} votos</span>
          </div>
          <div class="topic-full-title">${topic.title}</div>
          <div class="topic-full-body">
            ${topic.content.split('\n\n').map(p => `<p>${p}</p>`).join('')}
          </div>
          <div class="topic-comments-title">Comentários (${topic.comments ? topic.comments.length : 0})</div>
          <div class="topic-comments-list">
            ${commentsHtml}
          </div>
        </div>
      </div>
    `;
    viewport.scrollTop = 0;
  },

  openSheetMusicPage() {
    if (!this._canControl()) return;
    this._pushHistory(this._getCurrentNavSnapshot());
    this.renderSheetMusicPage();
    this._notifySync();
  },

  renderSheetMusicPage() {
    this.browserView = 'sheet_music';
    this.setBrowserUrl('https://partituras-classicas.art/acervo');

    const viewport = document.getElementById('sara-browser-viewport');
    if (!viewport) return;

    const piecesHtml = this.sheetMusicPieces.map(p => `
      <div class="sheet-music-card">
        <div>
          <div class="sheet-info-name">${p.title}</div>
          <div class="sheet-info-composer">${p.composer} • Tom: ${p.key} • Dificuldade: ${p.difficulty}</div>
        </div>
        <div class="sheet-badge">${p.pages}</div>
      </div>
    `).join('');

    viewport.innerHTML = `
      <div class="sheet-music-page">
        <div class="sheet-music-title">Acervo de Partituras Clássicas</div>
        <div class="sheet-music-sub">Biblioteca digital de partituras e estudos para piano de domínio público.</div>
        <div class="sheet-music-grid">
          ${piecesHtml}
        </div>
      </div>
    `;
    viewport.scrollTop = 0;
  },

  // =========================================================================
  // YOUTUBE IDENTICO AO REAL (SEM LOGIN)
  // =========================================================================
  _renderYouTubeMasthead(filterQuery = '') {
    return `
      <div class="yt-masthead">
        <div class="yt-masthead-left">
          <button type="button" class="yt-icon-btn" onclick="MesaSaraDesktop.toggleYouTubeSidebar()" title="Menu">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
          </button>
          <button type="button" class="yt-logo-btn" onclick="MesaSaraDesktop.openWebPage('youtube')">
            <svg viewBox="0 0 28 20" width="28" height="20">
              <rect x="0" y="0" width="28" height="20" rx="5" fill="#ff0000"></rect>
              <polygon points="11,5 11,15 20,10" fill="#ffffff"></polygon>
            </svg>
            <span>YouTube</span>
          </button>
        </div>
        <div class="yt-masthead-center">
          <div class="yt-search-form">
            <div class="yt-search-box">
              <input type="text" id="yt-search-bar" class="yt-search-input" value="${(filterQuery || '').replace(/"/g, '&quot;')}" placeholder="Pesquisar" autocomplete="off" onkeydown="if(event.key==='Enter') MesaSaraDesktop.openWebPage('youtube', this.value)">
            </div>
            <button type="button" class="yt-search-submit" onclick="MesaSaraDesktop.openWebPage('youtube', document.getElementById('yt-search-bar').value)" title="Pesquisar">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
          </div>
          <button type="button" class="yt-mic-btn" title="Pesquisar por voz">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm5-3a1 1 0 1 0-2 0 3 3 0 0 1-6 0 1 1 0 1 0-2 0 5 5 0 0 0 4 4.9V19H9a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2h-2v-3.1A5 5 0 0 0 17 11z"/></svg>
          </button>
        </div>
        <div class="yt-masthead-right">
          <button type="button" class="yt-icon-btn" title="Configurações">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="12" cy="5" r="1.5"></circle><circle cx="12" cy="12" r="1.5"></circle><circle cx="12" cy="19" r="1.5"></circle></svg>
          </button>
          <button type="button" class="yt-signin-pill">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="9" r="3"></circle><path d="M6.5 18.5a6.5 6.5 0 0 1 11 0"></path></svg>
            <span>Fazer login</span>
          </button>
        </div>
      </div>
    `;
  },

  toggleYouTubeSidebar() {
    if (!this._canControl()) return;
    this.ytSidebarCollapsed = !this.ytSidebarCollapsed;
    const sb = document.querySelector('.yt-sidebar');
    if (sb) sb.classList.toggle('collapsed', this.ytSidebarCollapsed);
    this._notifySync();
  },

  selectYouTubeCategory(cat) {
    if (!this._canControl()) return;
    this.ytCategory = cat;
    this.renderYouTubeHome(this.ytQuery || '');
    this._notifySync();
  },

  toggleYouTubePlay() {
    if (!this._canControl()) return;
    this.ytIsPlaying = !this.ytIsPlaying;
    const btn = document.getElementById('yt-play-toggle-icon');
    const fill = document.getElementById('yt-progress-fill');
    if (btn) {
      btn.innerHTML = this.ytIsPlaying
        ? '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>'
        : '<polygon points="6 4 20 12 6 20 6 4"></polygon>';
    }
    if (fill) {
      fill.style.width = this.ytIsPlaying ? '34%' : '18%';
    }
    this._notifySync();
  },

  openWebPage(pageType, query = '') {
    if (!this._canControl()) return;
    this._pushHistory(this._getCurrentNavSnapshot());
    if (pageType === 'youtube') {
      this.ytCategory = 'Tudo';
      this.renderYouTubeHome(query || '');
    }
    this._notifySync();
  },

  renderYouTubeHome(filterQuery = '') {
    this.browserView = 'youtube';
    this.ytQuery = filterQuery;
    this.setBrowserUrl(filterQuery ? `https://www.youtube.com/results?search_query=${encodeURIComponent(filterQuery)}` : 'https://www.youtube.com');

    const viewport = document.getElementById('sara-browser-viewport');
    if (!viewport) return;

    const cleanFilter = (filterQuery || '').trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    let list = this.youtubeVideos;
    if (this.ytCategory && this.ytCategory !== 'Tudo') {
      list = list.filter(v => v.category === this.ytCategory);
    }
    if (cleanFilter) {
      const terms = cleanFilter.split(/\s+/).filter(t => t.length >= 2);
      const filtered = list.filter(v => {
        const hay = (v.title + ' ' + v.channel + ' ' + v.description + ' ' + v.category).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return terms.some(t => hay.includes(t));
      });
      if (filtered.length > 0) list = filtered;
    }

    const chips = ['Tudo', 'Música', 'Piano', 'Notícias', 'Natureza', 'Culinária', 'Animais', 'Esportes'];
    const chipsHtml = chips.map(c => `
      <button type="button" class="yt-chip ${(this.ytCategory || 'Tudo') === c ? 'active' : ''}" onclick="MesaSaraDesktop.selectYouTubeCategory('${c}')">${c}</button>
    `).join('');

    const cardsHtml = list.map(v => `
      <div class="yt-video-card" onclick="MesaSaraDesktop.openYouTubeVideo('${v.id}')">
        <div class="yt-thumb">
          ${this._getYouTubeThumbSVG(v.sceneType)}
          <span class="yt-duration">${v.duration}</span>
        </div>
        <div class="yt-card-info">
          <div class="yt-channel-avatar" style="background: ${v.avatarColor};">${v.channel.charAt(0).toUpperCase()}</div>
          <div class="yt-card-text">
            <div class="yt-video-title">${v.title}</div>
            <div class="yt-video-meta">${v.channel}<br>${v.views} • ${v.date}</div>
          </div>
        </div>
      </div>
    `).join('');

    viewport.innerHTML = `
      <div class="yt-shell">
        ${this._renderYouTubeMasthead(filterQuery)}
        <div class="yt-body-layout">
          <aside class="yt-sidebar ${this.ytSidebarCollapsed ? 'collapsed' : ''}">
            <button type="button" class="yt-nav-item active" onclick="MesaSaraDesktop.selectYouTubeCategory('Tudo')">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
              <span class="yt-nav-label">Início</span>
            </button>
            <button type="button" class="yt-nav-item">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              <span class="yt-nav-label">Shorts</span>
            </button>
            <button type="button" class="yt-nav-item">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="7" width="18" height="14" rx="2"/><line x1="6" y1="3" x2="18" y2="3"/></svg>
              <span class="yt-nav-label">Inscrições</span>
            </button>
            <div class="yt-sidebar-divider"></div>
            <button type="button" class="yt-nav-item">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span class="yt-nav-label">Histórico</span>
            </button>
            <div class="yt-sidebar-divider"></div>
            <div class="yt-sidebar-login-box">
              <span>Faça login para curtir vídeos, comentar e se inscrever.</span>
              <button type="button" class="yt-signin-pill">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="9" r="3"></circle><path d="M6.5 18.5a6.5 6.5 0 0 1 11 0"></path></svg>
                <span>Fazer login</span>
              </button>
            </div>
            <div class="yt-sidebar-divider"></div>
            <div class="yt-sidebar-section-title">Explorar</div>
            <button type="button" class="yt-nav-item" onclick="MesaSaraDesktop.selectYouTubeCategory('Música')">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
              <span class="yt-nav-label">Música</span>
            </button>
            <button type="button" class="yt-nav-item" onclick="MesaSaraDesktop.selectYouTubeCategory('Notícias')">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/></svg>
              <span class="yt-nav-label">Notícias</span>
            </button>
          </aside>
          <main class="yt-main-area">
            <div class="yt-chips-bar">${chipsHtml}</div>
            <div class="yt-grid">${cardsHtml}</div>
          </main>
        </div>
      </div>
    `;
    viewport.scrollTop = 0;
  },

  openYouTubeVideo(vidId) {
    if (!this._canControl()) return;
    this._pushHistory(this._getCurrentNavSnapshot());
    this.ytIsPlaying = true;
    this.renderYouTubeWatch(vidId);
    this._notifySync();
  },

  renderYouTubeWatch(vidId) {
    const video = this.youtubeVideos.find(v => v.id === vidId) || this.youtubeVideos[0];
    if (!video) return;

    this.browserView = 'yt_watch';
    this.ytVideoId = video.id;
    this.setBrowserUrl(`https://www.youtube.com/watch?v=${video.id}`);

    const viewport = document.getElementById('sara-browser-viewport');
    if (!viewport) return;

    const commentsHtml = (video.comments || []).map(c => `
      <div class="yt-comment-item">
        <div class="yt-comment-avatar">${c.author.replace('@', '').charAt(0).toUpperCase()}</div>
        <div class="yt-comment-body">
          <div class="yt-comment-author">${c.author} <span style="color:#aaaaaa; font-weight:400; margin-left:6px;">${c.time || 'há 2 semanas'}</span></div>
          <div class="yt-comment-text">${c.text}</div>
        </div>
      </div>
    `).join('');

    const upNextHtml = this.youtubeVideos.filter(v => v.id !== video.id).map(v => `
      <div class="yt-next-card" onclick="MesaSaraDesktop.openYouTubeVideo('${v.id}')">
        <div class="yt-next-thumb">
          ${this._getYouTubeThumbSVG(v.sceneType)}
          <span class="yt-duration">${v.duration}</span>
        </div>
        <div class="yt-next-info">
          <div class="yt-next-title">${v.title}</div>
          <div class="yt-next-meta">${v.channel}<br>${v.views} • ${v.date}</div>
        </div>
      </div>
    `).join('');

    viewport.innerHTML = `
      <div class="yt-shell">
        ${this._renderYouTubeMasthead(this.ytQuery || '')}
        <div class="yt-watch-layout">
          <div class="yt-watch-primary">
            <div class="yt-player-frame" onclick="MesaSaraDesktop.toggleYouTubePlay()">
              <div class="yt-player-visual">${this._getYouTubeThumbSVG(video.sceneType)}</div>
              <button type="button" class="yt-player-center-btn">
                <svg id="yt-play-toggle-icon" viewBox="0 0 24 24" width="28" height="28" fill="#fff">
                  ${this.ytIsPlaying ? '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>' : '<polygon points="6 4 20 12 6 20 6 4"></polygon>'}
                </svg>
              </button>
              <div class="yt-player-controls">
                <div class="yt-progress-track">
                  <div id="yt-progress-fill" class="yt-progress-fill" style="width:${this.ytIsPlaying ? '34%' : '18%'};"></div>
                </div>
                <div class="yt-controls-row">
                  <div class="yt-controls-left">
                    <button type="button" class="yt-ctrl-btn"><svg viewBox="0 0 24 24" width="18" height="18" fill="#fff"><polygon points="6 4 19 12 6 20 6 4"/></svg></button>
                    <button type="button" class="yt-ctrl-btn"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/></svg></button>
                    <span>0:48 / ${video.duration}</span>
                  </div>
                  <div class="yt-controls-right">
                    <span style="border:1px solid #fff; font-size:9px; padding:1px 4px; border-radius:2px;">CC</span>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9c.26.6.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66 0-1.25.4-1.51 1z"/></svg>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#fff" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <div class="yt-watch-title">${video.title}</div>

            <div class="yt-watch-actions-bar">
              <div class="yt-channel-row">
                <div class="yt-channel-avatar" style="background: ${video.avatarColor};">${video.channel.charAt(0).toUpperCase()}</div>
                <div>
                  <div style="font-size:14px; font-weight:600; color:#f1f1f1;">${video.channel}</div>
                  <div style="font-size:11px; color:#aaaaaa;">${video.subs || '120 mil inscritos'}</div>
                </div>
                <button type="button" class="yt-subscribe-btn">Inscrever-se</button>
              </div>
              <div class="yt-action-pills">
                <button type="button" class="yt-pill-btn">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/></svg>
                  <span>${video.likes || '1,2 mil'}</span>
                </button>
                <button type="button" class="yt-pill-btn">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                  <span>Compartilhar</span>
                </button>
                <button type="button" class="yt-pill-btn">Salvar</button>
              </div>
            </div>

            <div class="yt-watch-desc">
              <div style="font-weight:600; margin-bottom:6px;">${video.views} &nbsp;&bull;&nbsp; ${video.date}</div>
              <div>${video.description}</div>
            </div>

            <div class="yt-comments-header">
              <span>${(video.comments || []).length} comentários</span>
              <span style="font-size:12px; font-weight:500; color:#aaaaaa;">Faça login para comentar</span>
            </div>
            <div>${commentsHtml}</div>
          </div>

          <aside class="yt-watch-secondary">
            <div style="font-size:13px; font-weight:600; color:#f1f1f1; margin-bottom:4px;">Próximos vídeos</div>
            ${upNextHtml}
          </aside>
        </div>
      </div>
    `;
    viewport.scrollTop = 0;
  },

  openWebArticleByKey(key) {
    const art = this.webArticles[key];
    if (art) this.openWebArticle(art);
  },

  openDynamicArticle(query, kind) {
    const art = {
      domain: kind === 'wiki' ? 'pt.fragpedia.org' : 'web.fraguiktos.net',
      url: `https://pt.fragpedia.org/wiki/${encodeURIComponent(query)}`,
      title: `${query} - FragPédia`,
      paragraphs: [
        `Página de referência geral sobre "${query}".`,
        `Informações detalhadas e tópicos externos completos requerem conexão externa fora da intranet local de Fraguiktos. Use o fórum ReadIt ou a busca de arquivos locais para consultas regionais.`
      ]
    };
    this.openWebArticle(art);
  },

  openWebArticle(article) {
    if (!this._canControl()) return;
    this._pushHistory(this._getCurrentNavSnapshot());
    this.renderWebArticle(article);
    this._notifySync();
  },

  renderWebArticle(article) {
    if (!article) return;
    this.browserView = 'article';
    this.currentArticle = article;
    this.setBrowserUrl(article.url || 'https://fragsearch.net');
    const viewport = document.getElementById('sara-browser-viewport');
    if (!viewport) return;

    viewport.innerHTML = `
      <div class="web-article-shell">
        <button type="button" class="topic-back-btn" onclick="MesaSaraDesktop.goFragSearchHome()">&larr; Voltar para FragSearch</button>
        <div class="web-article-domain">${article.domain || ''}</div>
        <div class="web-article-title">${article.title || ''}</div>
        <div class="web-article-body">
          ${(article.paragraphs || []).map(p => `<p>${p}</p>`).join('')}
        </div>
      </div>
    `;
    viewport.scrollTop = 0;
  },

  renderHistoryList() {
    const container = document.getElementById('sara-history-list');
    if (!container) return;

    container.innerHTML = this.historyEntries.map(item => `
      <div class="history-entry-row" onclick="MesaSaraDesktop.handleHistoryClick('${item.query.replace(/'/g, "\\'")}', ${item.topicId || 'null'})">
        <span class="history-time-badge">${item.time}</span>
        <span class="history-query-text"><strong>${item.action}:</strong> "${item.query}"</span>
      </div>
    `).join('');
  },

  handleHistoryClick(query, topicId) {
    if (!this._canControl()) return;
    this.historyModalOpen = false;
    const modal = document.getElementById('sara-history-modal');
    if (modal) modal.style.display = 'none';
    if (topicId) {
      this.openReadItTopic(topicId);
    } else {
      this.execFragSearch(query);
    }
  },

  toggleHistoryModal() {
    if (!this._canControl()) return;
    const modal = document.getElementById('sara-history-modal');
    if (!modal) return;
    this.historyModalOpen = !this.historyModalOpen;
    modal.style.display = this.historyModalOpen ? 'flex' : 'none';
    this._notifySync();
  },

  browserBack() {
    if (!this._canControl()) return;
    if (this.browserBackStack.length > 0) {
      this.browserForwardStack.push(this._getCurrentNavSnapshot());
      const prev = this.browserBackStack.pop();
      this._restoreNavSnapshot(prev);
      this._notifySync();
    } else if (this.browserView !== 'home') {
      this.goFragSearchHome();
    }
  },

  browserForward() {
    if (!this._canControl()) return;
    if (this.browserForwardStack.length > 0) {
      this.browserBackStack.push(this._getCurrentNavSnapshot());
      const next = this.browserForwardStack.pop();
      this._restoreNavSnapshot(next);
      this._notifySync();
    }
  },

  _restoreNavSnapshot(snap) {
    if (!snap) return;
    if (snap.ytCategory) this.ytCategory = snap.ytCategory;
    if (snap.view === 'home') this.renderFragSearchHome(false);
    else if (snap.view === 'results') this.renderFragSearchResults(snap.query || '');
    else if (snap.view === 'subreddit') this.renderReadItSubreddit();
    else if (snap.view === 'topic') this.renderReadItTopic(snap.topicId || 14);
    else if (snap.view === 'sheet_music') this.renderSheetMusicPage();
    else if (snap.view === 'youtube') this.renderYouTubeHome(snap.ytQuery || '');
    else if (snap.view === 'yt_watch') this.renderYouTubeWatch(snap.ytVideoId);
    else if (snap.view === 'article') this.renderWebArticle(snap.article);
  },

  browserReload() {
    if (!this._canControl()) return;
    this._restoreNavSnapshot(this._getCurrentNavSnapshot());
    this._notifySync();
  }
};
window.MesaSaraDesktop = MesaSaraDesktop;

// ==========================================================================
// MESA NOTEBOOK DA SARA (SISTEMA OPERACIONAL E CFTV - SINCRONIZACAO REALTIME)
// ==========================================================================
const MesaNotebookSara = {
  isActive: false,
  stage: 'boot', // 'boot' | 'lock' | 'desktop' | 'cctv'
  activeCam: 1,
  signalLost: false,
  isGlitching: false,
  sessionStartTime: null,
  localStartTime: 0,
  camImages: {
    1: '',
    2: '',
    3: ''
  },
  bootTimeout: null,
  glitchTimeout: null,
  staticAnimId: null,
  clockInterval: null,
  _applyingRemote: false,
  _saveTimer: null,
  _scrollSyncTimer: null,
  _lastLocalActionAt: 0,
  _lastAppliedRemoteSig: null,

  getChannel() {
    return (window.MesaApp && MesaApp.channel) || (window.MesaChat && MesaChat.channel) || null;
  },

  buildSyncSnapshot() {
    return {
      active: !!this.isActive,
      stage: this.stage || 'boot',
      activeCam: this.activeCam || 1,
      signalLost: !!this.signalLost,
      glitch: !!this.isGlitching,
      sessionStartTime: this.sessionStartTime || Date.now(),
      camImages: this.camImages || {},
      desktopState: window.MesaSaraDesktop ? MesaSaraDesktop.getSyncState() : null,
      updatedAt: Date.now()
    };
  },

  syncNow(immediatePersist = true) {
    if (!window.MesaApp || !MesaApp.state || !MesaApp.state.isMaster) return;
    this._lastLocalActionAt = Date.now();
    const snap = this.buildSyncSnapshot();
    if (MesaApp.state.rawRow1Atributos) {
      MesaApp.state.rawRow1Atributos._sys_notebook = snap;
    }
    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'notebook_sync',
          payload: snap
        });
      } catch(e) {}
    }
    this.saveNotebookStateToSupabase(immediatePersist);
  },

  syncScrollOnly() {
    if (!window.MesaApp || !MesaApp.state || !MesaApp.state.isMaster) return;
    this._lastLocalActionAt = Date.now();
    const snap = this.buildSyncSnapshot();
    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'notebook_sync',
          payload: snap
        });
      } catch(e) {}
    }
    clearTimeout(this._scrollSyncTimer);
    this._scrollSyncTimer = setTimeout(() => {
      this.saveNotebookStateToSupabase(false);
    }, 300);
  },

  saveNotebookStateToSupabase(immediate = false) {
    if (!window.MesaApp || !MesaApp.supabase || !MesaApp.state || !MesaApp.state.isMaster) return;
    const runSave = () => {
      if (typeof MesaApp.queueRow1Update === 'function') {
        MesaApp.queueRow1Update((attrs) => {
          attrs._sys_notebook = this.buildSyncSnapshot();
        });
      }
    };

    clearTimeout(this._saveTimer);
    if (immediate) {
      runSave();
    } else {
      this._saveTimer = setTimeout(runSave, 180);
    }
  },

  play() {
    if (!MesaApp.state || !MesaApp.state.isMaster) {
      if (window.MesaApp && typeof MesaApp.showToast === 'function') {
        MesaApp.showToast('Autentique seu Token de Mestre para transmitir a cena.');
      }
      return;
    }
    this.isActive = true;
    this.stage = 'boot';
    this.signalLost = false;
    this.isGlitching = false;
    this.sessionStartTime = Date.now();
    this.localStartTime = this.sessionStartTime;
    this._lastLocalActionAt = this.sessionStartTime;

    const snap = this.buildSyncSnapshot();
    if (MesaApp.state.rawRow1Atributos) {
      MesaApp.state.rawRow1Atributos._sys_notebook = snap;
    }

    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'notebook_start',
          payload: snap
        });
      } catch(e) {}
    }

    this.saveNotebookStateToSupabase(true);
    this.triggerStart(this.sessionStartTime);
  },

  stop() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    this._lastLocalActionAt = Date.now();
    this.isActive = false;
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
    if (MesaApp.state.rawRow1Atributos) {
      MesaApp.state.rawRow1Atributos._sys_notebook = { active: false, updatedAt: Date.now() };
    }
    this.saveNotebookStateToSupabase(true);
    this.triggerStop();
  },

  triggerStart(sessionStartTime, targetStage = null) {
    const overlay = document.getElementById('notebook-sara-overlay');
    if (!overlay) return;

    this.isActive = true;
    this.localStartTime = Date.now();
    this.signalLost = false;
    this.isGlitching = false;
    this.sessionStartTime = sessionStartTime || this.sessionStartTime || Date.now();

    const isMaster = !!(MesaApp.state && MesaApp.state.isMaster);
    overlay.classList.toggle('viewer-only', !isMaster);

    const badge = document.getElementById('notebook-status-badge');
    const btnPlay = document.getElementById('btn-transmit-notebook');
    const btnStop = document.getElementById('btn-stop-notebook');
    if (badge) {
      badge.textContent = 'Transmitindo';
      badge.className = 'dispositivo-status-badge transmitting';
    }
    if (btnPlay) btnPlay.style.display = 'none';
    if (btnStop) btnStop.style.display = 'flex';

    overlay.classList.add('active');
    this.startClock();

    clearTimeout(this.bootTimeout);
    if (targetStage && targetStage !== 'boot') {
      if (targetStage === 'desktop') this.showDesktopStage();
      else if (targetStage === 'cctv') this.showCctvStage(this.activeCam || 1);
      else this.showLockScreen();
      return;
    }

    this.stage = 'boot';
    const bootStage = document.getElementById('notebook-boot-stage');
    const lockStage = document.getElementById('notebook-lock-stage');
    const cctvStage = document.getElementById('notebook-cctv-stage');
    const desktopStage = document.getElementById('notebook-desktop-stage');
    if (bootStage) bootStage.style.display = 'flex';
    if (lockStage) lockStage.style.display = 'none';
    if (cctvStage) cctvStage.style.display = 'none';
    if (desktopStage) desktopStage.style.display = 'none';

    this.bootTimeout = setTimeout(() => {
      if (this.isActive && this.stage === 'boot') {
        this.showLockScreen();
      }
    }, 2400);
  },

  triggerStop() {
    this.isActive = false;
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
      if (this.isActive) return;
      this.stage = 'boot';
      this.signalLost = false;
      this.isGlitching = false;
      const bootStage = document.getElementById('notebook-boot-stage');
      const lockStage = document.getElementById('notebook-lock-stage');
      const cctvStage = document.getElementById('notebook-cctv-stage');
      const desktopStage = document.getElementById('notebook-desktop-stage');
      if (bootStage) bootStage.style.display = 'flex';
      if (lockStage) lockStage.style.display = 'none';
      if (cctvStage) cctvStage.style.display = 'none';
      if (desktopStage) desktopStage.style.display = 'none';
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
      const elapsedMs = Math.max(0, Date.now() - this.sessionStartTime);
      const elapsedSec = Math.floor(elapsedMs / 1000);

      const baseSec = (22 * 60 + 30) * 60;
      const currentSecTotal = baseSec + elapsedSec;

      const hrs = String(Math.floor(currentSecTotal / 3600) % 24).padStart(2, '0');
      const mins = String(Math.floor((currentSecTotal % 3600) / 60)).padStart(2, '0');
      const secs = String(currentSecTotal % 60).padStart(2, '0');
      const ms = String(Math.floor((elapsedMs % 1000) / 10)).padStart(2, '0');

      const timeEl = document.getElementById('windows-lock-time');
      if (timeEl) timeEl.textContent = `${hrs}:${mins}`;

      const dateEl = document.getElementById('windows-lock-date');
      if (dateEl) dateEl.textContent = 'terça-feira, 4 de agosto de 2061';

      const deskTimeEl = document.getElementById('sara-desktop-clock');
      if (deskTimeEl) deskTimeEl.textContent = `${hrs}:${mins}`;

      const deskDateEl = document.getElementById('sara-desktop-date');
      if (deskDateEl) deskDateEl.textContent = '04/08/2061';

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
    clearTimeout(this.bootTimeout);
    this.stage = 'lock';
    const bootStage = document.getElementById('notebook-boot-stage');
    const lockStage = document.getElementById('notebook-lock-stage');
    const cctvStage = document.getElementById('notebook-cctv-stage');
    const desktopStage = document.getElementById('notebook-desktop-stage');
    if (bootStage) bootStage.style.display = 'none';
    if (lockStage) lockStage.style.display = 'flex';
    if (cctvStage) cctvStage.style.display = 'none';
    if (desktopStage) desktopStage.style.display = 'none';

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
    const val = input ? input.value.trim() : '';

    if (val === '1415' || val === '0408') {
      if (wrapper) wrapper.classList.remove('has-error', 'shake-error');
      if (err) err.style.display = 'none';
      if (input) input.value = '';

      this.showDesktopStage();
      this.syncNow(true);
      return;
    }

    if (wrapper) {
      wrapper.classList.add('has-error', 'shake-error');
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

  showDesktopStage() {
    clearTimeout(this.bootTimeout);
    this.stage = 'desktop';
    const bootStage = document.getElementById('notebook-boot-stage');
    const lockStage = document.getElementById('notebook-lock-stage');
    const cctvStage = document.getElementById('notebook-cctv-stage');
    const desktopStage = document.getElementById('notebook-desktop-stage');

    if (bootStage) bootStage.style.display = 'none';
    if (lockStage) lockStage.style.display = 'none';
    if (cctvStage) cctvStage.style.display = 'none';
    if (desktopStage) desktopStage.style.display = 'block';

    if (window.MesaSaraDesktop) {
      MesaSaraDesktop.init();
    }
  },

  lockSystem() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    this.showLockScreen();
    this.syncNow(true);
  },

  openApp(app) { if (window.MesaSaraDesktop) MesaSaraDesktop.openApp(app); },
  closeApp(app) { if (window.MesaSaraDesktop) MesaSaraDesktop.closeApp(app); },
  minimizeApp(app) { if (window.MesaSaraDesktop) MesaSaraDesktop.minimizeApp(app); },
  maximizeApp(app) { if (window.MesaSaraDesktop) MesaSaraDesktop.maximizeApp(app); },
  toggleStartMenu() { if (window.MesaSaraDesktop) MesaSaraDesktop.toggleStartMenu(); },
  closeStartMenu() { if (window.MesaSaraDesktop) MesaSaraDesktop.closeStartMenu(); },
  switchFolder(f) { if (window.MesaSaraDesktop) MesaSaraDesktop.switchFolder(f); },
  openFile(f, id) { if (window.MesaSaraDesktop) MesaSaraDesktop.openFile(f, id); },
  openTrashFile(id) { if (window.MesaSaraDesktop) MesaSaraDesktop.openTrashFile(id); },
  submitFilePassword() { if (window.MesaSaraDesktop) MesaSaraDesktop.submitFilePassword(); },
  closeLockedPrompt() { if (window.MesaSaraDesktop) MesaSaraDesktop.closeLockedPrompt(); },
  goFragSearchHome() { if (window.MesaSaraDesktop) MesaSaraDesktop.goFragSearchHome(); },
  execFragSearch(q) { if (window.MesaSaraDesktop) MesaSaraDesktop.execFragSearch(q); },
  openReadItSubreddit() { if (window.MesaSaraDesktop) MesaSaraDesktop.openReadItSubreddit(); },
  openReadItTopic(id) { if (window.MesaSaraDesktop) MesaSaraDesktop.openReadItTopic(id); },
  openSheetMusicPage() { if (window.MesaSaraDesktop) MesaSaraDesktop.openSheetMusicPage(); },
  openWebPage(p, q) { if (window.MesaSaraDesktop) MesaSaraDesktop.openWebPage(p, q); },
  toggleHistoryModal() { if (window.MesaSaraDesktop) MesaSaraDesktop.toggleHistoryModal(); },
  browserBack() { if (window.MesaSaraDesktop) MesaSaraDesktop.browserBack(); },
  browserForward() { if (window.MesaSaraDesktop) MesaSaraDesktop.browserForward(); },
  browserReload() { if (window.MesaSaraDesktop) MesaSaraDesktop.browserReload(); },

  showCctvStage(camNum = 1) {
    clearTimeout(this.bootTimeout);
    this.stage = 'cctv';
    const bootStage = document.getElementById('notebook-boot-stage');
    const lockStage = document.getElementById('notebook-lock-stage');
    const cctvStage = document.getElementById('notebook-cctv-stage');
    const desktopStage = document.getElementById('notebook-desktop-stage');
    if (bootStage) bootStage.style.display = 'none';
    if (lockStage) lockStage.style.display = 'none';
    if (cctvStage) cctvStage.style.display = 'flex';
    if (desktopStage) desktopStage.style.display = 'none';
    this.switchCamera(camNum, false);
  },

  openCameras() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    this.showCctvStage(this.activeCam || 1);
    this.syncNow(true);
  },

  returnToLock() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    this.showLockScreen();
    this.syncNow(true);
  },

  switchCamera(camNum, shouldSync = true) {
    if (shouldSync && (!MesaApp.state || !MesaApp.state.isMaster)) return;
    if (this.signalLost && shouldSync) return;
    this.activeCam = camNum;

    [1, 2, 3].forEach(n => {
      const tab = document.getElementById(`cctv-tab-${n}`);
      if (tab) tab.classList.toggle('active', n === camNum);
      const ctrlBtn = document.getElementById(`disp-ctrl-cam-${n}`);
      if (ctrlBtn) ctrlBtn.classList.toggle('active', n === camNum);
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
      this.syncNow(true);
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
    if (imgEl) imgEl.style.display = 'none';
    if (procEl) procEl.style.display = 'none';
    if (svgEl) svgEl.innerHTML = '';
  },

  setCustomCamImage(camNum, url) {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    this.camImages[camNum] = url || '';
    if (this.activeCam === camNum) {
      this.renderCameraFeed();
    }
    this.syncNow(true);
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
          payload: { ...this.buildSyncSnapshot(), glitch: true }
        });
      } catch(e) {}
    }

    clearTimeout(this.glitchTimeout);
    this.glitchTimeout = setTimeout(() => {
      this.stopStaticNoise();
      this.signalLost = true;
      this.isGlitching = false;
      this._applySignalLostUI(true);
      this.syncNow(true);
    }, 2500);
  },

  _applySignalLostUI(lost) {
    this.signalLost = !!lost;
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
      if (btn) btn.classList.toggle('disabled', this.signalLost);
    });
    if (!this.signalLost) {
      this.renderCameraFeed();
    }
  },

  restoreSignal() {
    if (!MesaApp.state || !MesaApp.state.isMaster) return;
    this.isGlitching = false;
    this.stopStaticNoise();
    this._applySignalLostUI(false);
    this.switchCamera(this.activeCam, false);
    this.syncNow(true);
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

  syncFromRemote(nb) {
    if (!nb) return;
    const isMaster = !!(window.MesaApp && MesaApp.state && MesaApp.state.isMaster);
    // Enquanto o Mestre estiver em sessao ativa, o polling nao sobrescreve sua tela local
    if (isMaster && this._lastLocalActionAt > 0) {
      return;
    }
    const sig = JSON.stringify(nb);
    if (sig === this._lastAppliedRemoteSig) {
      return;
    }
    this._lastAppliedRemoteSig = sig;

    if (nb.active === false) {
      if (this.isActive) {
        const timeSinceLocal = Date.now() - (this.localStartTime || 0);
        if (!isMaster && timeSinceLocal > 6000) {
          this.triggerStop();
        }
      }
      return;
    }

    if (nb.active && !this.isActive) {
      if (nb.camImages) this.camImages = nb.camImages;
      this.activeCam = nb.activeCam || 1;
      this.triggerStart(nb.sessionStartTime, nb.stage || 'boot');
    }

    this.handleIncomingSync(nb);
  },

  handleIncomingSync(data) {
    if (!data) return;
    this._applyingRemote = true;
    try {
      if (data.camImages) {
        this.camImages = data.camImages;
        this.renderCameraFeed();
      }

      if (data.stage && data.stage !== this.stage) {
        if (data.stage === 'desktop') {
          this.showDesktopStage();
        } else if (data.stage === 'cctv') {
          this.showCctvStage(data.activeCam || this.activeCam || 1);
        } else if (data.stage === 'lock') {
          this.showLockScreen();
        }
      }

      if (data.activeCam && this.stage === 'cctv' && data.activeCam !== this.activeCam) {
        this.switchCamera(data.activeCam, false);
      }

      if (data.glitch && !this.isGlitching) {
        this.isGlitching = true;
        this.startStaticNoise();
        setTimeout(() => {
          this.isGlitching = false;
          this.stopStaticNoise();
        }, 2500);
      }

      if (data.signalLost !== undefined && data.signalLost !== this.signalLost) {
        this._applySignalLostUI(!!data.signalLost);
      }

      if (data.desktopState && this.stage === 'desktop' && window.MesaSaraDesktop) {
        MesaSaraDesktop.applySyncState(data.desktopState);
      }
    } finally {
      this._applyingRemote = false;
    }
  }
};
window.MesaNotebookSara = MesaNotebookSara;

// ==========================================================================
// A TENDA DO IGRIS (INTERFACE DE MERCADOR - SALAO DE RELIQUIAS E TROCAS)
// ==========================================================================
const IGRIS_DEFAULT_ITEMS = [
  // --- ITENS PADROES: AS FRUTAS ESTRANHAS (ESTOQUE PERMANENTE / INFINITO) ---
  {
    id: 'igris_fruta_verde',
    nome: 'FRUTA VERDE ESTRANHA',
    tipo: 'Consumível [ Peso 1 ]',
    peso: 1,
    raridade: 'Consumível',
    efeito: 'Ao ser consumida, tem um sabor estranhamente metálico e doce. Cura 1d4 de vida e remove instantaneamente condições de estado negativas ativas.',
    descricao: 'Uma estranha fruta pequena de casca folhada, semelhante a um repolho, mas em um formato esférico absolutamente perfeito e simétrico.',
    preco: 'Infinito',
    precoVidrilhos: 2,
    quantidade: Infinity,
    isInfinite: true,
    isDefault: true,
    categoria: 'padrao'
  },
  {
    id: 'igris_fruta_roxa',
    nome: 'FRUTA ROXA ESTRANHA',
    tipo: 'Consumível [ Peso 1 ]',
    peso: 1,
    raridade: 'Consumível',
    efeito: 'Ao ser consumida, tem um sabor denso e relaxante. Restaura 4 pontos na barra de stresse do consumidor.',
    descricao: 'Uma estranha fruta pequena de casca folhada e tom arroxeado escuro, semelhante a um repolho, mas num formato esférico absolutamente perfeito e simétrico.',
    preco: 'Infinito',
    precoVidrilhos: 3,
    quantidade: Infinity,
    isInfinite: true,
    isDefault: true,
    categoria: 'padrao'
  },
  {
    id: 'igris_fruta_amarela',
    nome: 'FRUTA AMARELA ESTRANHA',
    tipo: 'Consumível [ Peso 1 ]',
    peso: 1,
    raridade: 'Consumível',
    efeito: 'Ao ser consumida, o seu sumo é efervescente e revigorante. Concede 1d2 PE (Pontos de Esforço) de imediato a quem a consumir.',
    descricao: 'Uma estranha fruta pequena de casca folhada e tom amarelo vibrante, semelhante a um repolho, mas num formato esférico absolutamente perfeito e simétrico.',
    preco: 'Infinito',
    precoVidrilhos: 3,
    quantidade: Infinity,
    isInfinite: true,
    isDefault: true,
    categoria: 'padrao'
  },

  // --- ITENS TRANSITORIOS: ARTEFATOS DA CAMPANHA ---
  {
    id: 'igris_pe_de_cabra',
    nome: 'PÉ DE CABRA ENFERRUJADO',
    tipo: 'Arma / Ferramenta [ Peso 1 ]',
    peso: 1,
    raridade: 'Arma / Ferramenta',
    efeito: 'Causa 1d6 de dano Contundente. Concede Vantagem (+2) em testes de Força/Físico para arrombar estruturas, portas trancadas ou caixotes.',
    descricao: 'Uma barra maciça de ferro hexagonal, pesada e fria, com a ponta curvada em fenda. Está coberta por uma crosta grossa de ferrugem avermelhada e manchas antigas de tinta descascada, mas o centro da haste tem um trapo de couro sujo amarrado firme para não escorregar da mão suada.',
    preco: '1 Unidade',
    precoVidrilhos: 4,
    quantidade: 1,
    isDefault: false,
    categoria: 'transitorio'
  },
  {
    id: 'igris_corrente_bicicleta',
    nome: 'CORRENTE DE BICICLETA COM CADEADO',
    tipo: 'Arma Improvisada [ Peso 1 ]',
    peso: 1,
    raridade: 'Arma Improvisada',
    efeito: 'Causa 1d6 de dano Contundente (Alcance Curto / Varredura). Ataques giratórios acertam múltiplos alvos próximos ou enxames com facilidade, causando +2 de dano extra contra grupos ou aglomerados de criaturas.',
    descricao: 'Uma corrente grossa de elos de aço engraxados, com quase um metro de comprimento. Na ponta de impacto, um cadeado de latão pesado e amassado funciona como um pêndulo brutal; na outra extremidade, os elos foram soldados num punho improvisado que não machuca os dedos de quem gira.',
    preco: '1 Unidade',
    precoVidrilhos: 5,
    quantidade: 1,
    isDefault: false,
    categoria: 'transitorio'
  },
  {
    id: 'igris_sinalizador_magnesio',
    nome: 'SINALIZADOR DE MAGNÉSIO',
    tipo: 'Utilitário / Combate [ Peso 1 ]',
    peso: 1,
    raridade: 'Utilitário / Combate',
    efeito: 'Uso único (dura 1 cena). Acende uma chama vermelha cegante e solta faíscas brancas que iluminam totalmente a área ao redor. Pode ser arremessado ou brandido como arma improvisada para causar 2d6 de dano de Fogo/Luz automático no contato.',
    descricao: 'Um cilindro de papelão industrial grosso e plastificado, da cor de tijolo desbotado, com uma tampa de plástico preto áspero na ponta para riscar. Tem cheiro forte de pólvora seca e enxofre mesmo fechado.',
    preco: '2 Unidades',
    precoVidrilhos: 3,
    quantidade: 2,
    isDefault: false,
    categoria: 'transitorio'
  },
  {
    id: 'igris_fluido_isqueiro',
    nome: 'FLUIDO DE ISQUEIRO ADULTERADO',
    tipo: 'Consumível Tático [ Peso 1 ]',
    peso: 1,
    raridade: 'Consumível Tático',
    efeito: 'Uso único. Pode ser jogado no chão para criar uma barreira de fogo (com um isqueiro) ou despejado sobre uma arma corpo a corpo para somar +1d4 de Fogo pelos próximos 3 ataques.',
    descricao: 'Uma garrafinha achatada de vidro âmbar, sem rótulo e fechada com uma rolha de cortiça inchada. O líquido lá dentro é amarelado, meio oleoso e tem um cheiro químico tão forte de querosene misturado com solvente que faz os olhos lacrimejarem só de destampar.',
    preco: '2 Unidades',
    precoVidrilhos: 3,
    quantidade: 2,
    isDefault: false,
    categoria: 'transitorio'
  },
  {
    id: 'igris_balsamo_seiva',
    nome: 'BÁLSAMO DE SEIVA AMARGA',
    tipo: 'Cura [ Peso 1 ]',
    peso: 1,
    raridade: 'Cura',
    efeito: 'Consumível. Passar em cortes ou ferimentos estanca o sangue na hora, recuperando 1d6 + 2 PV.',
    descricao: 'Um potinho de lata amassado (daqueles antigos de pomada) cheio até a borda com uma pasta verde-escura, quase preta e grudenta. Cheira a folhas maceradas, cânfora velha e álcool puro. Quando passada na pele aberta, arde como brasa por dois segundos antes de adormecer a região inteira.',
    preco: '3 Unidades',
    precoVidrilhos: 3,
    quantidade: 3,
    isDefault: false,
    categoria: 'transitorio'
  },
  {
    id: 'igris_cigarros_cravo',
    nome: 'CIGARROS DE CRAVO MOFADOS',
    tipo: 'Mente / Fôlego [ Peso 0 ]',
    peso: 0,
    raridade: 'Mente / Fôlego',
    efeito: 'Consumível (2 usos por maço). O cheiro forte de cravo queimado corta qualquer fedor do ambiente e acalma a tremedeira nas mãos. Recupera 1d4 de Estresse/Sanidade (ou PE) e anula penalidades por náusea ou mau cheiro.',
    descricao: 'Um maço de papel mole e amarelado pela umidade, amarrado com um elástico velho. Lá dentro há apenas dois cigarros escuros, enrolados de forma irregular, que estalam baixinho quando acesos e soltam uma fumaça densa e adocicada.',
    preco: '2 Maços',
    precoVidrilhos: 2,
    quantidade: 2,
    isDefault: false,
    categoria: 'transitorio'
  },
  {
    id: 'igris_canivete_trincheira',
    nome: 'CANIVETE DE TRINCHEIRA "DENTE DE FERRO"',
    tipo: 'Arma Leve / Soco [ Peso 1 ]',
    peso: 1,
    raridade: 'Arma Leve / Soco',
    efeito: 'Causa 1d4 + 1 de dano Perfurante ou Contundente. Permite escolher entre furar (lâmina) ou esmagar (soqueira) no mesmo golpe, sem precisar trocar de arma.',
    descricao: 'Uma peça bruta de metal escuro que combina uma soqueira de ferro fundido (com quatro anéis grossos para os dedos) e uma lâmina curta e larga de dois gumes que salta da lateral com uma mola dura. O metal está cheio de riscos antigos de uso.',
    preco: '1 Unidade',
    precoVidrilhos: 4,
    quantidade: 1,
    isDefault: false,
    categoria: 'transitorio'
  },
  {
    id: 'igris_oculos_soldador',
    nome: 'ÓCULOS DE SOLDADOR RACHADO',
    tipo: 'Equipamento [ Peso 1 ]',
    peso: 1,
    raridade: 'Equipamento',
    efeito: 'Protege os olhos contra líquidos, pó químico, poeira e clarões súbitos. Concede +1 em Percepção em ambientes cheios de fumaça, penumbra ou detritos no ar.',
    descricao: 'Uma armação pesada de borracha preta ressecada e aros de latão, presa por uma tira elástica larga. A lente direita tem um trincado em forma de teia de aranha no canto, mas o vidro grosso levemente fumê veda perfeitamente o rosto.',
    preco: '1 Unidade',
    precoVidrilhos: 2,
    quantidade: 1,
    isDefault: false,
    categoria: 'transitorio'
  },
  {
    id: 'igris_amuleto_no_cego',
    nome: 'AMULETO DE FIO LARANJA "NÓ CEGO"',
    tipo: 'Relíquia Estranha [ Peso 0 ]',
    peso: 0,
    raridade: 'Relíquia Estranha',
    efeito: 'Uso único. Enquanto estiver no bolso, se o portador falhar em um teste de resistência mental ou contra o sobrenatural, o fio laranja se arrebenta sozinho (queimando como um pavio rápido sem deixar cinzas) e transforma a falha em um Sucesso Automático.',
    descricao: 'Um dente animal amarelado e rachado ao meio, completamente estrangulado por dezenas de voltas de um fio laranja áspero e terroso. Ao segurá-lo na palma da mão, o nó parece pulsar de leve, como se estivesse morno.',
    preco: '1 Unidade',
    precoVidrilhos: 6,
    quantidade: 1,
    isDefault: false,
    categoria: 'transitorio'
  },

  // --- ARTEFATOS ESPECIAIS DO CONCLAVE ---
  {
    id: 'igris_dedal_carne_cega',
    nome: 'DEDAL DA CARNE CEGA',
    tipo: 'Especial do Conclave [ Peso 1 ]',
    peso: 1,
    raridade: 'Especial do Conclave',
    descricao: 'Um dedal antigo de alfaiataria feito de latão escurecido, com o interior revestido por pequenas farpas voltadas para dentro. Da borda inferior pende um pedaço curto de fio alaranjado e áspero, ressecado como um tendão velho. Ao encaixá-lo no dedo, as farpas furam a ponta da pele e o metal parece ficar morno, pulsando junto com o coração do usuário.',
    beneficio: 'Enquanto estiver usando o dedal, a dor física do portador é abafada por um torpor estranho. Uma vez por cena, ao sofrer dano físico de qualquer fonte, o usuário pode puxar o fio do dedal para reduzir o dano recebido pela metade e ignorar qualquer penalidade por ferimento grave ou sangramento até o fim do combate.',
    prejuizo: 'A dor que o corpo deixa de sentir é costurada diretamente nos nervos da mente. Sempre que ativar o efeito para reduzir o dano físico, o portador sofre imediatamente 2d6 de dano de Estresse / Sanidade (ou perde 1d8 de PE) e sente a articulação do braço travar com um puxão brusco nos tendões, ficando com -2 em testes de Agilidade/Destreza na rodada seguinte.',
    preco: '1 Unidade',
    precoVidrilhos: 8,
    quantidade: 1,
    isDefault: false,
    categoria: 'conclave'
  },
  {
    id: 'igris_monoculo_fuliginoso',
    nome: 'MONÓCULO DE VIDRO FULIGINOSO',
    tipo: 'Especial do Conclave [ Peso 1 ]',
    peso: 1,
    raridade: 'Especial do Conclave',
    descricao: 'Uma lente redonda e grossa, sem haste, encaixada num aro de ferro oxidado que parece ter sido arrancado de um equipamento médico velho. O vidro é manchado por uma fuligem escura que nunca sai quando limpo, mas que se move lentamente lá dentro como fumaça presa quando colocado contra a luz.',
    beneficio: 'Olhar através da lente revela o que tenta se esconder na penumbra ou atrás de mentiras. O usuário recebe Vantagem (+2) em testes de Investigação, Percepção ou Ocultismo para encontrar pistas ocultas, rastros de sangue lavado, passagens falsas ou notar quando alguém está mentindo/escondendo algo.',
    prejuizo: 'O vidro não apenas mostra o que está escondido, mas também marca os olhos de quem espia. Sempre que o usuário usar o monóculo para passar em um teste, o olho usado começa a lacrimejar um líquido escuro e frio; até o final da cena, o personagem fica com a visão periférica borrada por vultos (-2 em Percepção passiva e Esquiva/Defesa) e, se houver alguma ameaça na área, ela passa a focar seus ataques prioritariamente nele no primeiro turno.',
    preco: '1 Unidade',
    precoVidrilhos: 8,
    quantidade: 1,
    isDefault: false,
    categoria: 'conclave'
  },
  {
    id: 'igris_isqueiro_sebo',
    nome: 'ISQUEIRO DE SEBO CINZENTO',
    tipo: 'Especial do Conclave [ Peso 1 ]',
    peso: 1,
    raridade: 'Especial do Conclave',
    descricao: 'Um isqueiro de fluido quadrado, pesado e amassado, com a carcaça de metal tomada por uma crosta áspera que lembra cera de vela misturada com cinzas. Quando a tampa é aberta e a roda é riscada, a chama que sobe é baixa, pálida e completamente silenciosa, soltando um cheiro leve de terra molhada e ozônio em vez de querosene.',
    beneficio: 'Encarar a chama silenciosa por alguns segundos esvazia o pânico da cabeça. Uma vez por cena (ou como uma ação rápida), o portador pode acender o isqueiro para recuperar 1d6 de Sanidade / Estresse (ou 1d4 de PE) e encerrar imediatamente condições de medo, tremedeira ou paralisia mental em si mesmo ou em um aliado adjacente.',
    prejuizo: 'O isqueiro não queima fluido comum; ele queima o próprio calor do corpo de quem o segura. Cada vez que a chama é acesa para usar seu efeito, os dedos do usuário ficam roxos de frio e um cansaço pesado desce pelo peito, custando 1d4 de Pontos de Vida (PV) diretos (que não podem ser reduzidos) e deixando as mãos trêmulas de frio (-1 em testes de ataque corpo a corpo ou pontaria pelo resto da cena).',
    preco: '1 Unidade',
    precoVidrilhos: 8,
    quantidade: 1,
    isDefault: false,
    categoria: 'conclave'
  }
];

const MesaIgrisShop = {
  isOpen: false,
  activeTab: 'todos',
  setTab(tab) {
    this.activeTab = tab;
    this.renderShowcase();
  },
  lastLocalUpdate: 0,
  _saveTimer: null,
  merchantImage: 'assets/igris.png',
  items: [...IGRIS_DEFAULT_ITEMS], // Itens padroes da loja sempre presentes
  interests: {}, // Map: { [itemId]: [slotOrMaster, ...] }
  rouletteInProgress: false,

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
      const vidrilhos = (player && player.vidrilhos != null) ? player.vidrilhos : 0;
      return {
        id: `slot_${slot}`,
        slot: slot,
        isMaster: false,
        name: (player && player.nome) ? player.nome : `Jogador ${slot}`,
        image: (player && player.imagem) ? player.imagem : null,
        vidrilhos: vidrilhos
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
    let slotNum = null;
    if (typeof identifier === 'string' && identifier.startsWith('slot_')) {
      slotNum = parseInt(identifier.replace('slot_', ''), 10);
    } else if (typeof identifier === 'number') {
      slotNum = identifier;
    }
    if (slotNum && window.MesaApp && MesaApp.state && MesaApp.state.players) {
      const p = MesaApp.state.players[slotNum - 1];
      if (p) {
        let displayName = p.nome || `Jogador ${slotNum}`;
        if (slotNum === 3 && (displayName === 'Mestre' || !displayName)) {
          displayName = 'Eric "Blade" Tepes Adams';
        }
        return {
          id: `slot_${slotNum}`,
          slot: slotNum,
          name: displayName,
          image: p.avatar || p.imagem || (slotNum === 3 ? 'assets/eric_avatar.png' : null),
          initial: (slotNum === 3 ? 'E' : displayName.trim().charAt(0).toUpperCase()),
          isMaster: false
        };
      }
    }
    if (slotNum === 3) {
      return {
        id: 'slot_3',
        slot: 3,
        name: 'Eric "Blade" Tepes Adams',
        image: 'assets/eric_avatar.png',
        initial: 'E',
        isMaster: false
      };
    }
    return {
      id: identifier || 'desconhecido',
      slot: slotNum,
      name: slotNum ? `Slot ${slotNum}` : `Jogador ${identifier}`,
      image: null,
      initial: slotNum ? `${slotNum}` : '?',
      isMaster: false
    };
  },

  // Audio procedural de voz sintetizada sinistra estilo Undertale / Deltarune
  playVoiceBlip() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }
      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      // Frequencia baixa e profunda, com leve modulacao aleatoria criando a textura vocal
      const freq = 100 + (Math.random() * 18 - 9);
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.72, t + 0.045);

      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.004);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.048);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.052);
    } catch (err) {}
  },

  // Exibe a fala de recusa de Igris letra por letra com som procedural e tremedeira individual
  speakRefusal() {
    const box = document.getElementById('igris-dialogue-box');
    const textEl = document.getElementById('igris-dialogue-text');
    if (!box || !textEl) return;

    if (this.speechTimer) {
      clearTimeout(this.speechTimer);
      this.speechTimer = null;
    }
    if (this.speechFadeTimer) {
      clearTimeout(this.speechFadeTimer);
      this.speechFadeTimer = null;
    }

    const phrases = [
      'VOCE NAO TEM O SUFICIENTE...',
      'SEM VIDRILHOS...',
      'VOLTE UMA OUTRA VEZ...',
      'FALTA LHE VIDRILHOS...'
    ];

    let phrase = phrases[Math.floor(Math.random() * phrases.length)];
    if (this.lastSpeechPhrase && phrases.length > 1) {
      const filtered = phrases.filter(p => p !== this.lastSpeechPhrase);
      phrase = filtered[Math.floor(Math.random() * filtered.length)];
    }
    this.lastSpeechPhrase = phrase;

    textEl.innerHTML = '';
    box.classList.remove('active', 'fading-out');
    void box.offsetWidth;
    box.classList.add('active');

    let charIndex = 0;
    const typeNextChar = () => {
      if (!this.isOpen) return;

      if (charIndex >= phrase.length) {
        this.speechFadeTimer = setTimeout(() => {
          box.classList.add('fading-out');
          setTimeout(() => {
            box.classList.remove('active', 'fading-out');
            textEl.innerHTML = '';
          }, 500);
        }, 3800);
        return;
      }

      const char = phrase.charAt(charIndex);
      charIndex++;

      if (char === ' ') {
        const spaceSpan = document.createElement('span');
        spaceSpan.innerHTML = '&nbsp;';
        spaceSpan.className = 'igris-dialogue-space';
        textEl.appendChild(spaceSpan);
        this.speechTimer = setTimeout(typeNextChar, 50);
      } else {
        const charSpan = document.createElement('span');
        charSpan.className = 'igris-shaky-char';
        charSpan.textContent = char;
        const delay = -(Math.random() * 0.3).toFixed(3);
        const dur = (0.09 + Math.random() * 0.06).toFixed(3);
        charSpan.style.setProperty('--jitter-delay', delay + 's');
        charSpan.style.setProperty('--jitter-dur', dur + 's');
        textEl.appendChild(charSpan);

        this.playVoiceBlip();

        const delayMs = (char === '.') ? 90 : 55;
        this.speechTimer = setTimeout(typeNextChar, delayMs);
      }
    };

    typeNextChar();
  },

  // Abre a interface localmente com animacao suave de fade-in (transmite se for o Mestre)
  open(autoBroadcastIfMaster = true) {
    if (autoBroadcastIfMaster && window.MesaApp && MesaApp.state && MesaApp.state.isMaster) {
      this.broadcastOpen();
      return;
    }
    const overlay = document.getElementById('igris-shop-overlay');
    if (this.isOpen && overlay && overlay.classList.contains('active')) {
      this.updateUserChip();
      this.renderShowcase();
      this.updateMasterControls();
      return;
    }
    this.isOpen = true;
    document.body.classList.add('igris-shop-open');
    if (overlay) {
      overlay.classList.remove('igris-closing');
      if (!overlay.classList.contains('active')) {
        overlay.classList.add('active');
      }
    }
    const isMaster = !!(window.MesaApp && MesaApp.state && MesaApp.state.isMaster);
    const closeBtn = document.querySelector('.igris-floating-close-btn');
    if (closeBtn) {
      closeBtn.style.display = isMaster ? 'flex' : 'none';
    }
    this.updateUserChip();
    this.renderShowcase();
    this.updateMasterControls();
  },

  // Fecha a interface localmente com fade-out suave (apenas o Mestre pode fechar)
  close(forceOrBroadcast = false) {
    const isMaster = !!(window.MesaApp && MesaApp.state && MesaApp.state.isMaster);
    // Jogador normal NAO tem permissao para fechar a loja por conta propria
    if (!isMaster && !forceOrBroadcast) {
      return;
    }
    this.isOpen = false;
    document.body.classList.remove('igris-shop-open');

    if (this.speechTimer) {
      clearTimeout(this.speechTimer);
      this.speechTimer = null;
    }
    if (this.speechFadeTimer) {
      clearTimeout(this.speechFadeTimer);
      this.speechFadeTimer = null;
    }
    const dBox = document.getElementById('igris-dialogue-box');
    if (dBox) dBox.classList.remove('active', 'fading-out');
    const dText = document.getElementById('igris-dialogue-text');
    if (dText) dText.innerHTML = '';

    const overlay = document.getElementById('igris-shop-overlay');
    const doClose = () => {
      if (overlay) {
        overlay.classList.remove('active', 'igris-closing');
      }
    };

    if (overlay && overlay.classList.contains('active')) {
      overlay.classList.add('igris-closing');
      setTimeout(doClose, 350);
    } else {
      doClose();
    }

    if (isMaster) {
      const chan = this.getChannel();
      if (chan) {
        try {
          chan.send({
            type: 'broadcast',
            event: 'igris_shop_close',
            payload: {
              _senderId: (window.MesaApp && MesaApp.clientId) || null
            }
          });
        } catch(e) {}
      }
      this.saveStateToSupabase(true);
    }
  },

  // Transmite a abertura da tenda para todos os jogadores na mesa
  broadcastOpen() {
    if (!window.MesaApp || !MesaApp.state || !MesaApp.state.isMaster) {
      if (window.MesaApp && typeof MesaApp.showToast === 'function') {
        MesaApp.showToast('Autentique seu Token de Mestre para transmitir A Tenda de Igris.');
      }
      return;
    }
    this.open(false);
    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'igris_shop_open',
          payload: {
            interests: this.interests,
            merchantImage: this.merchantImage,
            _senderId: (window.MesaApp && MesaApp.clientId) || null
          }
        });
      } catch (e) {
        console.warn('Erro ao transmitir abertura da Tenda de Igris:', e);
      }
    }
    this.saveStateToSupabase(true);
  },

  // Define uma imagem para o mercador
  setMerchantImage(url) {
    this.merchantImage = url;
    const imgEl = document.getElementById('igris-merchant-img');
    const placeholder = document.getElementById('igris-figure-placeholder');
    if (imgEl) {
      if (url) {
        imgEl.src = url;
        imgEl.style.display = 'block';
        if (placeholder) placeholder.style.display = 'none';
      } else {
        imgEl.src = '';
        imgEl.style.display = 'none';
        if (placeholder) placeholder.style.display = 'flex';
      }
    }
  },

  // Permite alimentar itens na loja futuramente garantindo que os padroes sempre fiquem presentes
  setItems(newItems) {
    const list = Array.isArray(newItems) ? newItems : [];
    const defaultIds = IGRIS_DEFAULT_ITEMS.map(x => x.id);
    const customOnly = list.filter(it => !defaultIds.includes(it.id));
    this.items = [...IGRIS_DEFAULT_ITEMS, ...customOnly];
    this.renderShowcase();
    this.updateMasterControls();
  },

  // Atualiza o chip com o usuario logado e a contagem de selecoes
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

    // Calcula quantos itens este usuario selecionou
    let selectedCount = 0;
    Object.keys(this.interests).forEach(id => {
      if (Array.isArray(this.interests[id]) && this.interests[id].includes(user.id)) {
        selectedCount++;
      }
    });

    const isLimit = selectedCount >= 2;
    const counterBadge = `<span class="igris-selection-counter ${isLimit ? 'at-limit' : ''}">${selectedCount}/2 itens</span>`;

    if (user.isMaster) {
      chip.innerHTML = `
        <div class="igris-user-chip-avatar" style="border-color: #94a3b8; color: #cbd5e1;">M</div>
        <span style="font-weight: 700;">Mestre da Mesa</span>
        ${counterBadge}
      `;
      return;
    }
    const avatarHtml = user.image 
      ? `<img src="${user.image}" class="igris-user-chip-avatar" alt="${user.name}" onerror="this.outerHTML='<div class=\\\'igris-user-chip-avatar\\\'>${user.name.charAt(0).toUpperCase()}</div>'" />`
      : `<div class="igris-user-chip-avatar">${user.name.charAt(0).toUpperCase()}</div>`;
    const playerBalance = user.vidrilhos != null ? user.vidrilhos : 0;
    chip.innerHTML = `
      ${avatarHtml}
      <span>${user.name}</span>
      <span class="igris-user-saldo-badge" title="Saldo disponível de Vidrilhos">Saldo: <img src="assets/vidrilhos.png" class="vidrilhos-icon" alt="" /> <strong>${playerBalance}</strong> Vidrilhos</span>
      ${counterBadge}
    `;
  },

  // Renderiza a vitrina (CSS Grid)
  renderShowcase() {
    const grid = document.getElementById('igris-showcase-grid');
    if (!grid) return;

    this.updateUserChip();

    if (!this.items || this.items.length === 0) {
      this.items = [...IGRIS_DEFAULT_ITEMS];
    }

    const user = this.getCurrentUserIdentity();
    const myId = user ? user.id : null;

    // Categorias de itens
    const defaultItems = this.items.filter(it => it.isDefault === true || (it.categoria === 'padrao') || String(it.id).includes('fruta'));
    const transitorioItems = this.items.filter(it => !it.isDefault && it.categoria === 'transitorio' && !String(it.id).includes('fruta'));
    const conclaveItems = this.items.filter(it => it.categoria === 'conclave' || it.categoria === 'medo');

    const renderCard = (item) => {
      const interestedList = this.interests[item.id] || [];
      const hasMyInterest = myId && interestedList.includes(myId);
      const avatarsHtml = this.renderInterestAvatars(item.id);
      const isConclave = item.categoria === 'conclave' || item.categoria === 'medo';

      let effectHtml = '';
      if (item.beneficio && item.prejuizo) {
        effectHtml = `
          <div class="igris-card-fear-box">
            <div class="igris-card-fear-pros">
              <span class="fear-tag fear-pro-tag">Benefício:</span>
              ${item.beneficio}
            </div>
            <div class="igris-card-fear-cons">
              <span class="fear-tag fear-con-tag">Prejuízo:</span>
              ${item.prejuizo}
            </div>
          </div>
        `;
      } else if (item.efeito) {
        effectHtml = `
          <div class="igris-card-effect">
            <strong>Efeito:</strong> ${item.efeito}
          </div>
        `;
      }

      return `
        <div class="igris-item-card ${isConclave ? 'igris-card-conclave' : ''} ${hasMyInterest ? 'has-my-interest' : ''}" 
             data-item-id="${item.id}" 
             onclick="MesaIgrisShop.toggleInterest('${item.id}')"
             title="Clique para manifestar interesse de troca">
          <div class="igris-card-inner">
            <div class="igris-card-header-top">
              <span class="igris-card-rarity-badge ${isConclave ? 'badge-conclave' : ''}">${item.raridade || (isConclave ? 'Especial do Conclave' : 'Consumível')}</span>
              <span class="igris-card-type-tag">${item.tipo || 'Consumível [ Peso 1 ]'}</span>
            </div>
            <div class="igris-card-content">
              <h4 class="igris-card-title">${item.nome || 'Item Desconhecido'}</h4>
              ${effectHtml}
              <p class="igris-card-desc">${item.descricao || 'Nenhuma informação decifrada sobre esta relíquia.'}</p>
              <div class="igris-card-footer">
                <span class="igris-card-stock ${item.isInfinite || item.quantidade === Infinity || item.isDefault || item.categoria === 'padrao' || String(item.id).includes('fruta') ? 'is-infinite' : ''}">${(item.isInfinite || item.quantidade === Infinity || item.isDefault || item.categoria === 'padrao' || String(item.id).includes('fruta')) ? 'Infinito' : (item.preco || (item.quantidade ? `${item.quantidade} Unidade` : '1 Unidade'))}</span>
                <span class="igris-card-price"><img src="assets/vidrilhos.png" class="vidrilhos-icon" alt="" /> ${item.precoVidrilhos != null ? item.precoVidrilhos : 8} Vidrilhos</span>
              </div>
            </div>
          </div>

          <div class="igris-card-interests" id="igris-card-interests-${item.id}">
            ${avatarsHtml}
          </div>
        </div>
      `;
    };

    const tab = this.activeTab || 'todos';

    // 1. ITENS PADRÕES: SEMPRE ACIMA DE TUDO
    const padraoSection = `
      <div class="igris-category-block">
        <div class="igris-category-header">
          <div class="igris-category-badge">[ ITENS PADRÕES — ESTOQUE PERMANENTE ]</div>
          <div class="igris-category-line"></div>
          <span class="igris-category-count">${defaultItems.length} permanente(s)</span>
        </div>
        <div class="igris-cards-subgrid">
          ${defaultItems.map(renderCard).join('')}
        </div>
      </div>
    `;

    // 2. ARTEFATOS TRANSITÓRIOS
    const transitorioSection = `
      <div class="igris-category-block">
        <div class="igris-category-header">
          <div class="igris-category-badge">[ ARTEFATOS TRANSITÓRIOS ]</div>
          <div class="igris-category-line"></div>
          <span class="igris-category-count">${transitorioItems.length} disponível(is)</span>
        </div>
        ${transitorioItems.length > 0 ? `
          <div class="igris-cards-subgrid">
            ${transitorioItems.map(renderCard).join('')}
          </div>
        ` : `
          <div class="igris-category-empty">Nenhum artefato transitório disponível nesta visita.</div>
        `}
      </div>
    `;

    // 3. ESPECIAIS DO CONCLAVE: POR ÚLTIMO
    const conclaveSection = `
      <div class="igris-category-block">
        <div class="igris-category-header">
          <div class="igris-category-badge badge-conclave">[ ESPECIAIS DO CONCLAVE ]</div>
          <div class="igris-category-line" style="background: linear-gradient(to right, rgba(239, 68, 68, 0.45), rgba(239, 68, 68, 0.05));"></div>
          <span class="igris-category-count" style="border-color: rgba(239, 68, 68, 0.35); color: #fca5a5;">${conclaveItems.length} disponível(is)</span>
        </div>
        ${conclaveItems.length > 0 ? `
          <div class="igris-cards-subgrid">
            ${conclaveItems.map(renderCard).join('')}
          </div>
        ` : `
          <div class="igris-category-empty">Nenhum artefato especial do Conclave disponível nesta visita.</div>
        `}
      </div>
    `;

    let sectionsHtml = '';
    if (tab === 'padrao') {
      sectionsHtml = padraoSection;
    } else if (tab === 'transitorio') {
      sectionsHtml = transitorioSection;
    } else if (tab === 'conclave' || tab === 'medo') {
      sectionsHtml = conclaveSection;
    } else {
      // 'todos': PADROES SEMPRE ACIMA DE TUDO, TRANSITORIOS NO MEIO, CONCLAVE POR ÚLTIMO
      sectionsHtml = padraoSection + transitorioSection + conclaveSection;
    }

    grid.innerHTML = `
      <div class="igris-tabs-nav">
        <button type="button" class="igris-tab-btn ${tab === 'todos' ? 'active' : ''}" onclick="MesaIgrisShop.setTab('todos')">Todos os Artefatos</button>
        <button type="button" class="igris-tab-btn ${tab === 'padrao' ? 'active' : ''}" onclick="MesaIgrisShop.setTab('padrao')">Itens Padrões (${defaultItems.length})</button>
        <button type="button" class="igris-tab-btn ${tab === 'transitorio' ? 'active' : ''}" onclick="MesaIgrisShop.setTab('transitorio')">Artefatos Transitórios (${transitorioItems.length})</button>
        <button type="button" class="igris-tab-btn tab-conclave ${tab === 'conclave' || tab === 'medo' ? 'active' : ''}" onclick="MesaIgrisShop.setTab('conclave')">Especiais do Conclave (${conclaveItems.length})</button>
      </div>

      ${sectionsHtml}
    `;

    this.updateMasterControls();
  },

  renderInterestAvatars(itemId) {
    let list = this.interests[itemId] || [];
    if (!list || list.length === 0) return '';

    // Mestre nunca compra itens na tenda de igris
    list = list.filter(id => id !== 'master');
    if (list.length === 0) return '';

    const shopItem = this.items.find(x => String(x.id) === String(itemId));
    const isInfinite = shopItem && (shopItem.isInfinite || shopItem.quantidade === Infinity || shopItem.isDefault || shopItem.categoria === 'padrao' || String(shopItem.id).includes('fruta'));
    const availableQty = isInfinite ? Infinity : ((shopItem && shopItem.quantidade !== undefined && shopItem.quantidade !== Infinity) ? shopItem.quantidade : 1);
    const isDisputed = !isInfinite && list.length > availableQty;

    let html = '';
    if (isDisputed) {
      html += `<span class="igris-dispute-badge" title="Múltiplos interessados em disputa!">Disputa (${list.length})</span>`;
    }

    const user = this.getCurrentUserIdentity();
    const myId = user ? user.id : null;
    const isMasterViewer = Boolean(user && user.isMaster);

    list.forEach(identifier => {
      const participant = this.getParticipantDisplay(identifier);
      const isMe = (myId && participant.id === myId);
      const canRemove = isMe || isMasterViewer;
      const titleAttr = `Interessado: ${participant.name}${canRemove ? ' — Clique para desmarcar' : ''}`;

      const avatarContent = participant.image
        ? `<img src="${participant.image}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" alt="${participant.name}" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='inline-block';" /><span class="igris-interest-initial" style="display:none;">${participant.initial}</span>`
        : `<span class="igris-interest-initial">${participant.initial}</span>`;

      html += `
        <div class="igris-interest-avatar ${isMe ? 'is-my-slot' : ''} ${canRemove ? 'is-removable' : ''}" 
             title="${titleAttr}"
             ${canRemove ? `onclick="event.stopPropagation(); MesaIgrisShop.removeParticipant('${itemId}', '${identifier}')"` : ''}>
          ${avatarContent}
        </div>
      `;
    });

    return html;
  },

  // Alterna o interesse do jogador logado no cartao com limite de 2 itens por jogador
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

    // Se for o Mestre interagindo com o cartao:
    if (user.isMaster) {
      // O Mestre nao compra itens para si proprio.
      // Clicar em um cartao com interessados desmarca o ultimo participante com seguranca.
      if (this.interests[itemId].length > 0) {
        const removedId = this.interests[itemId].pop();
        this.lastLocalUpdate = Date.now();
        this.updateCardInterestsUI(itemId);
        this.updateUserChip();
        this.updateMasterControls();
        const chan = this.getChannel();
        if (chan) {
          try {
            chan.send({
              type: 'broadcast',
              event: 'igris_interest_sync',
              payload: {
                itemId: itemId,
                interests: this.interests[itemId],
                allInterests: this.interests,
                _senderId: (window.MesaApp && MesaApp.clientId) || null
              }
            });
          } catch(e) {}
        }
        this.saveStateToSupabase(false);
      } else {
        if (window.MesaApp && typeof MesaApp.showToast === 'function') {
          MesaApp.showToast('O Mestre não seleciona itens para si próprio. Os jogadores escolhem suas relíquias.');
        }
      }
      return;
    }

    this.lastLocalUpdate = Date.now();

    const hasMyInterest = this.interests[itemId].includes(user.id);
    if (hasMyInterest) {
      // Se ja esta selecionado pelo jogador, desmarca completamente removendo todas as ocorrencias
      this.interests[itemId] = this.interests[itemId].filter(id => id !== user.id);
    } else {
      // Regra: cada jogador pode selecionar no maximo 2 itens por visita
      let currentSelectedCount = 0;
      Object.keys(this.interests).forEach(id => {
        if (Array.isArray(this.interests[id]) && this.interests[id].includes(user.id)) {
          currentSelectedCount++;
        }
      });

      if (currentSelectedCount >= 2) {
        alert('Você já manifestou interesse no limite máximo de 2 itens nesta visita à Tenda. Desmarque um item para poder escolher outro.');
        return;
      }

      // Verifica se o jogador possui saldo de Vidrilhos suficiente para esta escolha
      const shopItem = this.items.find(x => String(x.id) === String(itemId));
      const itemCost = (shopItem && shopItem.precoVidrilhos != null) ? shopItem.precoVidrilhos : 5;
      
      let currentCommitment = 0;
      Object.keys(this.interests).forEach(id => {
        if (Array.isArray(this.interests[id]) && this.interests[id].includes(user.id)) {
          const it = this.items.find(x => String(x.id) === String(id));
          currentCommitment += (it && it.precoVidrilhos != null) ? it.precoVidrilhos : 5;
        }
      });

      const playerBalance = user.vidrilhos != null ? user.vidrilhos : 0;
      if (currentCommitment + itemCost > playerBalance) {
        this.speakRefusal();
        return;
      }

      this.interests[itemId].push(user.id);
    }

    this.updateCardInterestsUI(itemId);
    this.updateUserChip();
    this.updateMasterControls();

    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'igris_interest_sync',
          payload: {
            itemId: itemId,
            interests: this.interests[itemId],
            allInterests: this.interests,
            _senderId: (window.MesaApp && MesaApp.clientId) || null
          }
        });
      } catch (e) {
        console.warn('Erro ao transmitir interesse:', e);
      }
    }

    this.saveStateToSupabase(false);
  },

  // Remove cirurgicamente um participante de um item (pelo proprio jogador ou pelo Mestre)
  removeParticipant(itemId, participantId) {
    if (!this.interests[itemId]) return;
    this.interests[itemId] = this.interests[itemId].filter(id => id !== participantId);
    this.lastLocalUpdate = Date.now();

    this.updateCardInterestsUI(itemId);
    this.updateUserChip();
    this.updateMasterControls();

    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'igris_interest_sync',
          payload: {
            itemId: itemId,
            interests: this.interests[itemId],
            allInterests: this.interests,
            _senderId: (window.MesaApp && MesaApp.clientId) || null
          }
        });
      } catch (e) {
        console.warn('Erro ao transmitir desmarcacao:', e);
      }
    }

    this.saveStateToSupabase(false);
  },

  // Atualiza apenas os avatares do cartao no DOM de forma cirurgica
  updateCardInterestsUI(itemId) {
    const cardEl = document.querySelector(`.igris-item-card[data-item-id="${itemId}"]`);
    const container = document.getElementById(`igris-card-interests-${itemId}`);
    if (container) {
      const newHtml = this.renderInterestAvatars(itemId);
      if (container.innerHTML !== newHtml) {
        container.innerHTML = newHtml;
      }
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
    this.updateUserChip();
    this.updateMasterControls();

    // Se o Mestre estiver na sala, persiste no banco de dados para manter novos participantes alinhados
    const user = this.getCurrentUserIdentity();
    if (user && user.isMaster) {
      this.lastLocalUpdate = Date.now();
      this.saveStateToSupabase(false);
    }
  },

  // Retorna itens que possuem mais interessados do que unidades disponiveis (padrao 1)
  getConflictedItems() {
    const conflicts = [];
    const allItemIds = Object.keys(this.interests);

    allItemIds.forEach(itemId => {
      const interested = this.interests[itemId] || [];
      const shopItem = (this.items && this.items.find(x => String(x.id) === String(itemId))) || null;
      const isInfinite = shopItem && (shopItem.isInfinite || shopItem.quantidade === Infinity || shopItem.isDefault || shopItem.categoria === 'padrao' || String(shopItem.id).includes('fruta'));
      if (isInfinite) {
        // Frutas e itens de estoque infinito nunca entram em conflito de disputa
        return;
      }

      const availableQty = (shopItem && shopItem.quantidade !== undefined) ? shopItem.quantidade : 1;

      if (interested.length > availableQty) {
        conflicts.push({
          id: itemId,
          nome: shopItem ? shopItem.nome : `Artefato ${itemId}`,
          item: shopItem,
          participants: interested
        });
      }
    });

    return conflicts;
  },

  // Atualiza os controles exclusivos do mestre (confirmacao e botao de roleta)
  updateMasterControls() {
    const controls = document.getElementById('igris-master-controls');
    if (!controls) return;

    const user = this.getCurrentUserIdentity();
    const isMaster = user && user.isMaster;

    if (!isMaster) {
      controls.style.display = 'none';
      return;
    }

    controls.style.display = 'flex';

    const statusEl = document.getElementById('igris-master-status');
    const btnRoulette = document.getElementById('igris-btn-roulette');
    const disputeCountEl = document.getElementById('igris-dispute-count');
    const btnConfirm = document.getElementById('igris-btn-confirm');

    const conflicts = this.getConflictedItems();
    const selectedEntries = Object.entries(this.interests).filter(([_, list]) => list && list.length > 0);

    if (conflicts.length > 0) {
      if (statusEl) statusEl.textContent = `${conflicts.length} artefato(s) em disputa! É necessário rodar a roleta.`;
      if (btnRoulette) {
        btnRoulette.style.display = 'inline-flex';
        if (disputeCountEl) disputeCountEl.textContent = conflicts.length;
      }
      if (btnConfirm) {
        btnConfirm.disabled = true;
        btnConfirm.title = 'Resolva todas as disputas na roleta antes de entregar os itens.';
      }
    } else if (selectedEntries.length > 0) {
      if (statusEl) statusEl.textContent = `${selectedEntries.length} artefato(s) pronto(s) para entrega direta.`;
      if (btnRoulette) btnRoulette.style.display = 'none';
      if (btnConfirm) {
        btnConfirm.disabled = false;
        btnConfirm.title = 'Clique para entregar todos os itens selecionados aos jogadores.';
      }
    } else {
      if (statusEl) statusEl.textContent = 'Aguardando seleções dos jogadores...';
      if (btnRoulette) btnRoulette.style.display = 'none';
      if (btnConfirm) {
        btnConfirm.disabled = true;
        btnConfirm.title = 'Nenhum item selecionado.';
      }
    }
  },

  // Disparado pelo Mestre: inicia o sorteio da primeira disputa na Roleta
  triggerRoulette() {
    const user = this.getCurrentUserIdentity();
    if (!user || !user.isMaster) return;
    if (this.rouletteInProgress) return;

    const conflicts = this.getConflictedItems();
    if (conflicts.length === 0) return;

    const conflict = conflicts[0];
    const participants = conflict.participants;
    if (!participants || participants.length === 0) return;

    const winnerId = participants[Math.floor(Math.random() * participants.length)];

    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'igris_roulette_spin',
          payload: {
            itemId: conflict.id,
            itemName: conflict.nome,
            participants: participants,
            winnerId: winnerId,
            _senderId: (window.MesaApp && MesaApp.clientId) || null
          }
        });
      } catch(e) {
        console.warn('Erro ao transmitir roleta:', e);
      }
    }

    this.runRouletteAnimation(conflict.id, conflict.nome, participants, winnerId);
  },

  // Executa a animacao visual da Roleta Clandestina no centro da tela para todos os jogadores
  runRouletteAnimation(itemId, itemName, participants, winnerId) {
    this.rouletteInProgress = true;
    const overlay = document.getElementById('igris-roulette-overlay');
    const titleEl = document.getElementById('igris-roulette-item-title');
    const avatarEl = document.getElementById('igris-roulette-avatar');
    const nameEl = document.getElementById('igris-roulette-name');
    const statusEl = document.getElementById('igris-roulette-status');
    const footerEl = document.getElementById('igris-roulette-footer');
    const winnerAnnounceEl = document.getElementById('igris-roulette-winner-announcement');

    if (!overlay) return;

    if (titleEl) titleEl.textContent = itemName || 'Artefato em Disputa';
    if (statusEl) statusEl.textContent = 'GIRANDO A ROLETA...';
    if (footerEl) footerEl.style.display = 'none';

    overlay.style.display = 'flex';

    const totalSteps = 24;
    let currentStep = 0;
    let participantIdx = 0;

    const winnerData = this.getParticipantDisplay(winnerId);

    const stepTick = () => {
      currentStep++;
      participantIdx = (participantIdx + 1) % participants.length;

      const currentPartId = (currentStep >= totalSteps) ? winnerId : participants[participantIdx];
      const partData = this.getParticipantDisplay(currentPartId);

      if (avatarEl) {
        if (partData.image) {
          avatarEl.innerHTML = `<img src="${partData.image}" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" alt="${partData.name}" />`;
        } else {
          avatarEl.innerHTML = `<span>${partData.initial}</span>`;
        }
      }
      if (nameEl) nameEl.textContent = partData.name;

      if (currentStep < totalSteps) {
        const progress = currentStep / totalSteps;
        const delay = Math.round(60 + Math.pow(progress, 2.5) * 400);
        setTimeout(stepTick, delay);
      } else {
        if (statusEl) {
          statusEl.textContent = `VENCEDOR: ${winnerData.name.toUpperCase()}!`;
          statusEl.style.color = '#10b981';
        }
        if (footerEl) footerEl.style.display = 'block';
        if (winnerAnnounceEl) {
          const shopItem = (this.items && this.items.find(x => String(x.id) === String(itemId))) || null;
          const itemPrice = (shopItem && shopItem.precoVidrilhos != null) ? shopItem.precoVidrilhos : 5;
          winnerAnnounceEl.innerHTML = `Artefato travado exclusivamente para <strong>${winnerData.name}</strong> por <img src="assets/vidrilhos.png" class="vidrilhos-icon" alt="" /> <strong>${itemPrice} Vidrilhos</strong>!`;
        }

        this.interests[itemId] = [winnerId];
        this.updateCardInterestsUI(itemId);

        const user = this.getCurrentUserIdentity();
        if (user && user.isMaster) {
          this.saveStateToSupabase();
          this.updateMasterControls();
        }

        setTimeout(() => {
          overlay.style.display = 'none';
          this.rouletteInProgress = false;
          if (statusEl) statusEl.style.color = '#f59e0b';
          this.updateMasterControls();
        }, 3500);
      }
    };

    setTimeout(stepTick, 80);
  },

  // Confirmacao e entrega de todos os artefatos selecionados para os inventarios dos jogadores
  async confirmSelections() {
    const user = this.getCurrentUserIdentity();
    if (!user || !user.isMaster) return;

    const conflicts = this.getConflictedItems();
    if (conflicts.length > 0) {
      alert(`Há ${conflicts.length} item(ns) em disputa! Resolva as disputas na roleta antes de entregar os itens.`);
      return;
    }

    const deliveries = [];
    const allItemIds = Object.keys(this.interests);

    allItemIds.forEach(itemId => {
      let interested = this.interests[itemId] || [];
      if (!interested || interested.length === 0) return;

      // Filtra qualquer identificador master acidental
      interested = interested.filter(id => id !== 'master');
      if (interested.length === 0) return;

      const shopItem = (this.items && this.items.find(x => String(x.id) === String(itemId))) || null;
      const itemName = shopItem ? shopItem.nome : `Artefato ${itemId}`;
      const isInfinite = shopItem && (shopItem.isInfinite || shopItem.quantidade === Infinity || shopItem.isDefault || shopItem.categoria === 'padrao' || String(shopItem.id).includes('fruta'));

      // Itens de estoque infinito entregam para todos os que escolheram;
      // Itens limitados requerem que a disputa tenha sido resolvida (exatamente 1 participante).
      const recipients = isInfinite ? interested : (interested.length === 1 ? interested : []);

      recipients.forEach(targetId => {
        let slotNum = null;
        if (typeof targetId === 'string' && targetId.startsWith('slot_')) {
          slotNum = parseInt(targetId.replace('slot_', ''), 10);
        } else if (typeof targetId === 'number') {
          slotNum = targetId;
        }

        if (slotNum) {
          deliveries.push({
            itemId: itemId,
            slot: slotNum,
            item: shopItem,
            itemName: itemName,
            targetId: targetId
          });
        }
      });
    });

    if (deliveries.length === 0) {
      alert('Nenhum item com seleção válida para ser entregue.');
      return;
    }

    // 1. Deduz o custo em Vidrilhos do saldo de cada jogador
    const playerTotals = {};
    deliveries.forEach(d => {
      if (d.slot) {
        const itemCost = (d.item && d.item.precoVidrilhos != null) ? d.item.precoVidrilhos : 5;
        playerTotals[d.slot] = (playerTotals[d.slot] || 0) + itemCost;
      }
    });

    for (const [slotStr, totalCost] of Object.entries(playerTotals)) {
      const slotNum = parseInt(slotStr, 10);
      if (window.MesaApp && typeof MesaApp.updateVidrilhos === 'function') {
        try {
          await MesaApp.updateVidrilhos(slotNum, -totalCost);
        } catch(e) {
          console.warn('Erro ao debitar Vidrilhos do slot', slotNum, e);
        }
      }
    }

    // 2. Concede e registra os itens no acervo de coletáveis
    if (window.MesaColetaveis) {
      if (!Array.isArray(MesaColetaveis.items)) MesaColetaveis.items = [];

      deliveries.forEach(d => {
        const shopItem = d.item;
        const itemId = d.itemId;
        const slotNum = d.slot;
        const isInfinite = shopItem && (shopItem.isInfinite || shopItem.quantidade === Infinity || shopItem.isDefault || shopItem.categoria === 'padrao' || String(shopItem.id).includes('fruta'));
        const grantedId = (shopItem && (shopItem.isDefault || isInfinite))
          ? `${itemId}_${slotNum}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
          : itemId;

        let colItem = MesaColetaveis.items.find(x => String(x.id) === String(grantedId));
        if (!colItem && shopItem) {
          const fearDetail = (shopItem.beneficio && shopItem.prejuizo)
            ? `Benefício: ${shopItem.beneficio}\n\nPrejuízo: ${shopItem.prejuizo}`
            : (shopItem.efeito || shopItem.descricao || '');

          colItem = {
            id: grantedId,
            nome: shopItem.nome || `Artefato ${itemId}`,
            tipo: shopItem.tipo || 'Consumível',
            peso: shopItem.peso !== undefined ? shopItem.peso : 1,
            resumo: shopItem.descricao || '',
            detalhe: fearDetail,
            campo_tipo: (shopItem.ladoBom || shopItem.efeito) ? 'Efeito' : 'Detalhe',
            imagem: shopItem.imagem || null,
            desbloqueado: true,
            posse: slotNum
          };
          MesaColetaveis.items.push(colItem);
        } else if (colItem) {
          colItem.posse = slotNum;
          colItem.desbloqueado = true;
        }
      });

      localStorage.setItem('wu_coletaveis_v2', JSON.stringify(MesaColetaveis.items));
    }

    // 3. Limpa selecoes da loja localmente
    this.interests = {};
    this.renderShowcase();
    this.updateUserChip();
    this.updateMasterControls();

    // 4. PERSISTÊNCIA ATÔMICA NO SUPABASE (MesaColetaveis + MesaIgrisShop unificados sem race condition)
    if (window.MesaApp && MesaApp.supabase && MesaApp.state && MesaApp.state.isMaster) {
      try {
        const { data } = await MesaApp.supabase
          .from('personagens')
          .select('atributos')
          .eq('id', 1)
          .single();

        const attrs = (data && data.atributos)
          ? (typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos)
          : {};

        if (window.MesaColetaveis) {
          attrs._sys_coletaveis = MesaColetaveis.items;
        }
        attrs._sys_igris_shop = {
          isOpen: this.isOpen,
          interests: {},
          updatedAt: Date.now(),
          merchantImage: this.merchantImage
        };

        await MesaApp.supabase
          .from('personagens')
          .update({ atributos: attrs })
          .eq('id', 1);

        if (MesaApp.state) {
          MesaApp.state.rawRow1Atributos = attrs;
        }
      } catch (err) {
        console.error("Erro ao persistir entrega no Supabase:", err);
      }
    }

    // 5. Atualiza a ficha aberta
    if (window.MesaColetaveis) {
      if (typeof MesaColetaveis.renderFicha === 'function') MesaColetaveis.renderFicha();
      if (typeof MesaColetaveis.render === 'function') MesaColetaveis.render();
    }

    // 6. Transmite coletaveis_sync e igris_items_granted para todas as telas remotas
    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'coletaveis_sync',
          payload: {
            items: window.MesaColetaveis ? MesaColetaveis.items : [],
            _senderId: (window.MesaApp && MesaApp.clientId) || null
          }
        });
      } catch(e) {}

      try {
        chan.send({
          type: 'broadcast',
          event: 'igris_items_granted',
          payload: {
            deliveries,
            coletaveis: window.MesaColetaveis ? MesaColetaveis.items : [],
            _senderId: (window.MesaApp && MesaApp.clientId) || null
          }
        });
      } catch(e) {
        console.warn('Erro ao transmitir concessao de itens:', e);
      }
    }

    // 7. Envia aviso no chat
    if (window.MesaChat && MesaChat.channel) {
      try {
        const summary = deliveries.map(d => {
          const p = this.getParticipantDisplay(d.targetId);
          const cost = (d.item && d.item.precoVidrilhos != null) ? d.item.precoVidrilhos : 5;
          return `"${d.itemName}" &rarr; ${p.name} (${cost} Vidrilhos)`;
        }).join(', ');

        MesaChat.channel.send({
          type: 'broadcast',
          event: 'chat_message',
          payload: {
            id: 'msg_' + Date.now(),
            text: `[TENDA DO IGRIS]: O Mercador Igris concluiu os acordos! Os seguintes artefatos foram entregues: ${summary}`,
            sender: 'Mestre',
            role: 'mestre',
            timestamp: Date.now()
          }
        });
      } catch(e) {}
    }

    alert(`Acordo concluído! ${deliveries.length} artefato(s) transferido(s) com sucesso aos inventários dos jogadores.`);
  },

  // Recebe notificacao de itens entregues
  handleItemsGranted(payload) {
    if (!payload) return;
    this.interests = {};
    this.renderShowcase();
    this.updateMasterControls();

    if (window.MesaColetaveis) {
      if (payload.coletaveis && Array.isArray(payload.coletaveis)) {
        const { items: merged } = MesaColetaveis.mergeCanonical(payload.coletaveis);
        MesaColetaveis.items = merged;
        localStorage.setItem('wu_coletaveis_v2', JSON.stringify(merged));
      } else {
        MesaColetaveis.init();
      }
      if (typeof MesaColetaveis.render === 'function') MesaColetaveis.render();
      if (typeof MesaColetaveis.renderFicha === 'function') MesaColetaveis.renderFicha();
    }

    if (window.MesaApp && typeof MesaApp.showToast === 'function') {
      MesaApp.showToast('[TENDA DO IGRIS] O Mestre concluiu o acordo e os itens foram entregues à sua ficha.');
    }
  },

  // Persiste estado no Supabase com suporte a debounce inteligente
  saveStateToSupabase(immediate = false) {
    if (!window.MesaApp || !MesaApp.supabase || !MesaApp.state || !MesaApp.state.isMaster) return;
    if (this._saveTimer) {
      clearTimeout(this._saveTimer);
      this._saveTimer = null;
    }
    const doSave = async () => {
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
          isOpen: !!this.isOpen,
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
    };

    if (immediate) {
      doSave();
    } else {
      this._saveTimer = setTimeout(doSave, 600);
    }
  }
};
window.MesaIgrisShop = MesaIgrisShop;

// ==========================================================================
// MESA MODO DE COMBATE (CINEMATOGRÁFICO, VÍDEO E RAMPA PRETA UNDERTALE)
// ==========================================================================
const MesaCombate = {
  isActive: false,
  lastLocalUpdate: 0,
  _lastSentTs: 0,
  _lastAppliedRemoteTs: 0,
  _pendingSyncCount: 0,
  _videoStallTimer: null,
  _videoRevealTimers: [],
  _videoRetryCount: 0,
  opponentId: 'assasino',
  opponentName: '???',
  videoUrl: 'assets/videos/assasino1.mp4?v=2.5.4',
  selectedPresetId: 'assasino',
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
      id: 'assasino',
      name: '???',
      video: 'assets/videos/assasino1.mp4?v=2.5.4',
      videoEsconderijo: 'assets/videos/assasino1_vermelho.mp4?v=2.5.4',
      desc: 'Oponente misterioso com variação carmesim no esconderijo'
    },
    {
      id: 'ratos',
      name: 'Ratos',
      video: 'assets/videos/rato_cinematica.mp4?v=2.5.4',
      desc: 'Infestação voraz de roedores carniceiros na escuridão'
    },
    {
      id: 'unknown',
      name: 'Inimigo Antigo',
      video: 'assets/videos/inimigo_antigo.mp4?v=2.5.4',
      desc: 'Arquivo do oponente anterior guardado'
    }
  ],

  /** Returns true when the current or supplied opponent uses the assasino video pair. */
  isAssasinoOpponent(url = '') {
    const u = String(url || this.videoUrl || '').toLowerCase();
    return u.includes('assasino1') || this.opponentId === 'assasino' || this.opponentName === '???';
  },

  /** Maps the assasino video to its crimson hiding variant when Esconderijo is active, preserving other opponents. */
  resolveVideoVariantUrl(url, isEsconderijo) {
    const trimmed = String(url || '').trim();
    if (!this.isAssasinoOpponent(trimmed)) return trimmed;
    return isEsconderijo
      ? 'assets/videos/assasino1_vermelho.mp4?v=2.5.4'
      : 'assets/videos/assasino1.mp4?v=2.5.4';
  },

  /** Synchronizes combat overlay, opponent video, and turn cycle from Supabase row 1 without local clock skew bugs. */
  syncFromRemote(cb) {
    if (!cb || typeof cb !== 'object') return;
    const isMaster = Boolean(window.MesaApp && MesaApp.state && MesaApp.state.isMaster);
    const remoteTime = Number(cb.updatedAt) || 0;

    if (isMaster) {
      if ((this._pendingSyncCount || 0) > 0) return;
      if (remoteTime && this._lastSentTs && remoteTime < this._lastSentTs) return;
      if (Date.now() - (this.lastLocalUpdate || 0) < 4000) return;
    } else {
      if (this._lastAppliedRemoteTs && remoteTime <= this._lastAppliedRemoteTs) return;
      if (Date.now() - (this.lastLocalUpdate || 0) < 5000 && !cb.active) return;
    }
    if (remoteTime) this._lastAppliedRemoteTs = Math.max(this._lastAppliedRemoteTs || 0, remoteTime);

    const currentEsc = document.body.classList.contains('esconderijo-active');
    const resolvedRemoteVid = this.resolveVideoVariantUrl(cb.videoUrl || '', Boolean(cb.isEsconderijo) || currentEsc);

    if (cb.active && !this.isActive) {
      this.startCombat({ ...cb, videoUrl: resolvedRemoteVid || cb.videoUrl }, false);
    } else if (!cb.active && this.isActive) {
      this.stopCombat(false);
    } else if (cb.active && this.isActive) {
      const sameName = (cb.opponentName || '') === (this.opponentName || '');
      const sameId = (cb.opponentId || '') === (this.opponentId || '');
      const sameVid = (resolvedRemoteVid || '') === (this.videoUrl || '');
      if (!sameName || !sameId || !sameVid) {
        this.setOpponent({ ...cb, videoUrl: resolvedRemoteVid || cb.videoUrl }, false);
      }
    }

    if (cb.turnCycle) {
      this.syncTurnCycle(cb.turnCycle);
    } else if (this.turnCycle && this.turnCycle.active && !cb.active) {
      this.stopTurnCycle(false);
    }
  },

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
    setTimeout(() => this.preloadVideos(), 2800);
  },

  /** Aborts any background combat video prefetch so an active video gets full bandwidth immediately. */
  abortPreloadVideos() {
    if (this._preloadAbort) {
      try { this._preloadAbort.abort(); } catch (e) {}
      this._preloadAbort = null;
    }
  },

  /** Pre-warms combat video URLs sequentially when idle without locking active combat playback. */
  async preloadVideos() {
    if (this._videosPreloaded || this.isActive) return;
    if (navigator.connection && navigator.connection.saveData) return;
    this._videosPreloaded = true;
    const ctrl = typeof AbortController === 'function' ? new AbortController() : null;
    this._preloadAbort = ctrl;
    const urls = [
      'assets/videos/assasino1.mp4?v=2.5.4',
      'assets/videos/assasino1_vermelho.mp4?v=2.5.4',
      'assets/videos/rato_cinematica.mp4?v=2.5.4',
      'assets/videos/inimigo_antigo.mp4?v=2.5.4'
    ];
    for (const u of urls) {
      if (this.isActive || (ctrl && ctrl.signal.aborted)) break;
      try {
        const res = await fetch(u, { cache: 'default', signal: ctrl ? ctrl.signal : undefined });
        if (res && res.ok) await res.blob();
      } catch (e) {
        if (ctrl && ctrl.signal.aborted) break;
      }
    }
    if (this._preloadAbort === ctrl) this._preloadAbort = null;
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

  isLocalEnvironment() {
    return false;
  },

  forceRemoteSync: true,

  canBroadcast() {
    return true;
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
    const now = Date.now();
    this._lastSentTs = Math.max(this._lastSentTs || 0, now);
    const isEsc = document.body.classList.contains('esconderijo-active');
    const currentVid = this.resolveVideoVariantUrl(this.videoUrl || 'assets/videos/assasino1.mp4?v=2.5.4', isEsc);
    const payload = {
      active: !!this.isActive,
      opponentId: this.opponentId || 'assasino',
      opponentName: this.opponentName || '???',
      videoUrl: currentVid,
      isEsconderijo: isEsc,
      turnCycle: this.turnCycle ? JSON.parse(JSON.stringify(this.turnCycle)) : null,
      updatedAt: now
    };
    this._pendingSyncCount = (this._pendingSyncCount || 0) + 1;
    try {
      await MesaApp.queueRow1Update((attrs) => {
        attrs._sys_combate = payload;
      });
    } catch(e) {
      console.warn("Erro ao persistir estado de combate no Supabase:", e);
    } finally {
      this._pendingSyncCount = Math.max(0, (this._pendingSyncCount || 1) - 1);
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
    if (videoInput) videoInput.value = this.videoUrl || 'assets/videos/assasino1.mp4?v=2.5.4';

    const localNotice = document.getElementById('combat-local-badge');
    if (localNotice) {
      localNotice.style.display = this.isLocalEnvironment() ? 'block' : 'none';
    }
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
    const name = (nameInput && nameInput.value.trim()) || this.opponentName || '???';
    const video = (videoInput && videoInput.value.trim()) || this.videoUrl || 'assets/videos/assasino1.mp4?v=2.5.4';

    this.closeSelectModal();

    if (!this.isActive) {
      this.startCombat({ opponentId: this.selectedPresetId, opponentName: name, videoUrl: video }, true);
    } else {
      this.setOpponent({ opponentId: this.selectedPresetId, opponentName: name, videoUrl: video }, true);
    }
  },

  startCombat(data = {}, shouldBroadcast = true) {
    if (shouldBroadcast && (!MesaApp.state || !MesaApp.state.isMaster)) return;

    const now = Date.now();
    this.isActive = true;
    this.lastLocalUpdate = now;
    if (shouldBroadcast) {
      this._lastSentTs = now;
    } else if (data.updatedAt) {
      this._lastAppliedRemoteTs = Math.max(this._lastAppliedRemoteTs || 0, Number(data.updatedAt) || 0);
    }
    this.opponentId = data.opponentId || 'unknown';
    this.opponentName = (data.opponentName !== undefined && data.opponentName !== null && data.opponentName !== '') ? data.opponentName : (this.opponentName || '???');
    this.videoUrl = data.videoUrl !== undefined ? data.videoUrl : (this.videoUrl || 'assets/videos/rato_cinematica.mp4?v=2.5.4');

    // Reseta cache de PV dos personagens
    this.playerHpCache = {};

    // Sincroniza turnos caso já venham no payload
    if (data.turnCycle) {
      this.turnCycle = data.turnCycle;
      if (this.turnCycle && Array.isArray(this.turnCycle.order)) {
        const bossName = this.opponentName || '???';
        this.turnCycle.order.forEach(it => {
          if (it && it.type === 'boss') {
            it.name = bossName;
          }
        });
      }
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
    this.loadVideo(this.videoUrl, { preserveCrimson: !shouldBroadcast });

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
              turnCycle: this.turnCycle,
              updatedAt: now
            }
          });
        } catch(e) {}
      }
      this.saveCombatStateToSupabase();
    }
  },

  setOpponent(data = {}, shouldBroadcast = true) {
    if (shouldBroadcast && (!MesaApp.state || !MesaApp.state.isMaster)) return;

    const now = Date.now();
    this.lastLocalUpdate = now;
    if (shouldBroadcast) {
      this._lastSentTs = now;
    } else if (data.updatedAt) {
      this._lastAppliedRemoteTs = Math.max(this._lastAppliedRemoteTs || 0, Number(data.updatedAt) || 0);
    }

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

    this.loadVideo(this.videoUrl, { preserveCrimson: !shouldBroadcast });

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
              videoUrl: this.videoUrl,
              updatedAt: now
            }
          });
        } catch(e) {}
      }
      this.saveCombatStateToSupabase();
    }
  },

  stopCombat(shouldBroadcast = true) {
    if (shouldBroadcast && (!MesaApp.state || !MesaApp.state.isMaster)) return;

    const now = Date.now();
    this.isActive = false;
    this.lastLocalUpdate = now;
    if (shouldBroadcast) {
      this._lastSentTs = now;
    }
    this._clearVideoStallTimer();
    this._videoRetryCount = 0;

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
      video.load();
    }
    const fallback = document.getElementById('combat-video-fallback');
    if (fallback) fallback.style.display = 'flex';

    this.updateNavLabels();
    this.updateMasterControls();

    if (shouldBroadcast) {
      const chan = this.getChannel();
      if (chan) {
        try {
          chan.send({
            type: 'broadcast',
            event: 'combat_stop',
            payload: { updatedAt: now }
          });
        } catch(e) {}
      }
      this.saveCombatStateToSupabase();
    }
  },

  _clearVideoStallTimer() {
    if (this._videoStallTimer) {
      clearTimeout(this._videoStallTimer);
      this._videoStallTimer = null;
    }
    if (Array.isArray(this._videoRevealTimers) && this._videoRevealTimers.length) {
      this._videoRevealTimers.forEach(t => clearTimeout(t));
      this._videoRevealTimers = [];
    }
  },

  /** Checks whether the combat video has decoded frame data and reveals it above the fallback. */
  _revealVideoIfReady(video) {
    if (!video || !this.isActive) return false;
    const fallback = document.getElementById('combat-video-fallback');
    if (video.getAttribute('src') && !video.error && (video.readyState >= 2 || video.currentTime > 0 || video.videoWidth > 0)) {
      video.classList.add('playing');
      if (fallback) fallback.style.display = 'none';
      return true;
    }
    return false;
  },

  /** Binds one-time lifecycle handlers on the combat background video to reveal decoded frames and recover from stalls. */
  ensureVideoListeners(video) {
    if (!video || video._mesaBound) return;
    video._mesaBound = true;

    const revealIfReady = () => this._revealVideoIfReady(video);

    const scheduleStallRecovery = () => {
      if (this._videoStallTimer) {
        clearTimeout(this._videoStallTimer);
        this._videoStallTimer = null;
      }
      if (!this.isActive || !video.getAttribute('src')) return;
      this._videoStallTimer = setTimeout(() => {
        if (!this.isActive || !video.getAttribute('src')) return;
        // Nunca interrompe um download em curso (NETWORK_LOADING = 2)
        if (video.networkState === 2) {
          scheduleStallRecovery();
          return;
        }
        if (video.paused && !video.ended) {
          video.muted = true;
          video.play().catch(() => {});
        }
        if (video.readyState < 2 && this._videoRetryCount < 1) {
          this._videoRetryCount++;
          const srcNow = video.getAttribute('src');
          if (srcNow) {
            video.load();
            video.play().catch(() => {});
          }
        }
      }, 8000);
    };

    video.addEventListener('loadedmetadata', revealIfReady);
    video.addEventListener('loadeddata', () => {
      this._clearVideoStallTimer();
      this._videoRetryCount = 0;
      revealIfReady();
    });
    video.addEventListener('canplay', () => {
      this._clearVideoStallTimer();
      revealIfReady();
      if (this.isActive && video.paused) {
        video.muted = true;
        video.play().catch(() => {});
      }
    });
    video.addEventListener('playing', () => {
      this._clearVideoStallTimer();
      this._videoRetryCount = 0;
      revealIfReady();
    });
    video.addEventListener('timeupdate', revealIfReady);
    video.addEventListener('waiting', scheduleStallRecovery);
    video.addEventListener('stalled', scheduleStallRecovery);
    video.addEventListener('error', () => {
      const fallback = document.getElementById('combat-video-fallback');
      this._clearVideoStallTimer();
      console.error('Erro de carregamento no video de combate:', video.error);
      if (this.isActive && this._videoRetryCount < 1 && video.getAttribute('src')) {
        this._videoRetryCount++;
        const rawSrc = video.getAttribute('src');
        const retrySrc = rawSrc.includes('retry=') ? rawSrc : `${rawSrc}${rawSrc.includes('?') ? '&' : '?'}retry=1`;
        setTimeout(() => {
          if (!this.isActive) return;
          video.src = retrySrc;
          video.setAttribute('src', retrySrc);
          video.load();
          video.play().catch(() => {});
        }, 600);
        return;
      }
      video.classList.remove('playing');
      if (fallback) fallback.style.display = 'flex';
    });

    if (!document._combatVideoUnlockBound) {
      document._combatVideoUnlockBound = true;
      const resumeIfPaused = () => {
        const bgVid = document.getElementById('combat-bg-video');
        if (this.isActive && bgVid && bgVid.getAttribute('src') && bgVid.paused && !bgVid.ended) {
          bgVid.muted = true;
          bgVid.play().catch(() => {});
        }
      };
      document.addEventListener('pointerdown', resumeIfPaused, { passive: true });
      document.addEventListener('keydown', resumeIfPaused, { passive: true });
    }
  },

  loadVideo(url, opts = {}) {
    this.abortPreloadVideos();
    const video = document.getElementById('combat-bg-video');
    const fallback = document.getElementById('combat-video-fallback');
    const fallbackLabel = document.getElementById('combat-fallback-label');
    if (!video) return;

    this.ensureVideoListeners(video);

    if (fallbackLabel) {
      fallbackLabel.textContent = this.opponentName || 'ÁREA DE COMBATE';
    }

    const isEsconderijoNow = document.body.classList.contains('esconderijo-active')
      || Boolean(opts && opts.preserveCrimson && String(url || '').includes('_vermelho'));
    const isAssasinoVideo = this.isAssasinoOpponent(url);
    video.classList.toggle('video-assasino', isAssasinoVideo);

    const trimmedUrl = this.resolveVideoVariantUrl(url, isEsconderijoNow);
    if (trimmedUrl) {
      this.videoUrl = trimmedUrl;
      const attrSrc = (video.getAttribute('src') || '').trim();

      video.muted = true;
      video.defaultMuted = true;
      video.setAttribute('muted', '');
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.loop = true;
      video.setAttribute('loop', '');
      video.preload = 'auto';

      const applyPreserveTime = () => {
        const pt = Number(opts && opts.preserveTime) || 0;
        if (pt > 0 && video.duration && !isNaN(video.duration) && video.duration > 0.5) {
          try { video.currentTime = pt % video.duration; } catch(e) {}
        }
      };

      if (attrSrc === trimmedUrl && !video.error) {
        if (!this._revealVideoIfReady(video)) {
          if (fallback) fallback.style.display = 'flex';
        }
        if (video.paused) video.play().catch(() => {});
        return;
      }

      this._clearVideoStallTimer();
      this._videoRetryCount = 0;

      // Mantem o <video> renderizado abaixo do fallback ate ter frame decodificado
      video.classList.remove('playing');
      if (fallback) fallback.style.display = 'flex';

      if (opts && opts.preserveTime) {
        video.addEventListener('loadedmetadata', applyPreserveTime, { once: true });
      }

      try { video.pause(); } catch (e) {}
      video.src = trimmedUrl;
      video.setAttribute('src', trimmedUrl);
      video.load();

      const attemptPlay = () => {
        video.muted = true;
        const p = video.play();
        if (p && typeof p.then === 'function') {
          p.then(() => {
            this._revealVideoIfReady(video);
          }).catch(() => {
            video.muted = true;
          });
        }
      };
      attemptPlay();

      this._videoRevealTimers = [200, 700, 1800].map((delay) => setTimeout(() => {
        if (!this.isActive || video.getAttribute('src') !== trimmedUrl) return;
        if (!this._revealVideoIfReady(video) && video.paused) {
          attemptPlay();
        }
      }, delay));
    } else {
      this._clearVideoStallTimer();
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
        <div class="combat-player-card combat-card-entrance ${p.dadoDePavor ? 'has-pavor' : ''}" id="combat-player-card-${slotNum}" style="animation-delay: ${animDelay}s" onclick="MesaCombate.openPlayerFicha(${slotNum})" title="Clique para abrir a ficha de ${p.nome}">
          <div class="combat-slash-overlay" id="combat-slash-${slotNum}"></div>
          ${p.dadoDePavor ? `<div class="combat-card-pavor-tag">PAVOR</div>` : ''}
          <div class="combat-card-header">
            <span class="combat-card-name">${p.nome}</span>
            <div style="display: flex; align-items: center; gap: 4px;">
              ${MesaApp.state && MesaApp.state.isMaster ? `
                <button type="button" class="combat-pavor-toggle-btn ${p.dadoDePavor ? 'active' : ''}" onclick="event.stopPropagation(); MesaApp.toggleDadoDePavor(${slotNum});" title="${p.dadoDePavor ? 'Desativar Dado de Pavor' : 'Ativar Dado de Pavor'}"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg><span>${p.dadoDePavor ? 'PAVOR ATIVO' : '+ PAVOR'}</span></button>
              ` : ''}
              <span class="combat-card-slot-badge">S${slotNum}</span>
            </div>
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
      const bossRealName = this.opponentName || item.name || '???';
      const label = isBoss ? `${bossRealName} [OPONENTE]` : `${item.name} (S${item.slot})`;
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
    if (this.turnCycle && Array.isArray(this.turnCycle.order)) {
      const bossName = this.opponentName || '???';
      this.turnCycle.order.forEach(it => {
        if (it && it.type === 'boss') {
          it.name = bossName;
        }
      });
    }
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
    const isBossItem = currentItem.type === 'boss';
    const bossRealName = this.opponentName || currentItem.name || '???';
    const displayTurnName = isBossItem ? bossRealName : currentItem.name;

    if (subLabel) {
      subLabel.textContent = `Turno de ${displayTurnName}${actionCountText}`;
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

  updateVideoVariant(isEsconderijo) {
    const video = document.getElementById('combat-bg-video');
    if (!video) return;

    if (!this.isAssasinoOpponent(video.getAttribute('src') || '')) {
      video.classList.remove('video-assasino');
      return;
    }

    const targetUrl = this.resolveVideoVariantUrl('assets/videos/assasino1.mp4?v=2.5.4', isEsconderijo);
    const prevTime = (!isNaN(video.currentTime) && video.currentTime > 0) ? video.currentTime : 0;
    video.style.transition = 'none';
    this.loadVideo(targetUrl, { preserveTime: prevTime });

    if (MesaApp.state && MesaApp.state.isMaster && this.isActive) {
      const now = Date.now();
      this._lastSentTs = Math.max(this._lastSentTs || 0, now);
      const chan = this.getChannel();
      if (chan) {
        try {
          chan.send({
            type: 'broadcast',
            event: 'combat_update',
            payload: {
              opponentId: this.opponentId,
              opponentName: this.opponentName,
              videoUrl: targetUrl,
              updatedAt: now
            }
          });
        } catch(e) {}
      }
      this.saveCombatStateToSupabase();
    }
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

    if (!this._cachedMetricsTime || performance.now() - this._cachedMetricsTime > 400) {
      const dockContainer = document.querySelector('.combat-dock-container');
      const containerRect = dockContainer ? dockContainer.getBoundingClientRect() : null;
      const canvasRect = canvas.getBoundingClientRect();
      this._cachedDockTopInCanvas = (containerRect && canvasRect) ? (containerRect.top - canvasRect.top) : (h * 0.45);
      this._cachedDockLeftInCanvas = (containerRect && canvasRect) ? (containerRect.left - canvasRect.left) : 0;
      this._cachedDockRightInCanvas = (containerRect && canvasRect) ? (containerRect.right - canvasRect.left) : w;
      this._cachedHasContainer = !!(containerRect && containerRect.width > 0 && containerRect.height > 0);
      this._cachedMetricsTime = performance.now();
    }
    const dockTopInCanvas = this._cachedDockTopInCanvas || (h * 0.45);

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

      if (this._cachedHasContainer) {
        targetLeft = Math.max(16, Math.round(this._cachedDockLeftInCanvas - padX));
        targetRight = Math.min(w - 16, Math.round(this._cachedDockRightInCanvas + padX));
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

    // 5. Desenho do Contorno do Domo em Pixel Art (#ff1133 em esconderijo ou #ff5500)
    ctx.save();
    const isEsconderijoActive = document.body.classList.contains('esconderijo-active');
    ctx.fillStyle = isEsconderijoActive ? '#ff1133' : '#ff5500';

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




// ==========================================================================
// MESA ESCONDERIJO E BUSCA DE SETORES — FIOS DO MEDO (PAINEL LATERAL)
// ==========================================================================
const MesaEsconderijo = {
  room: 'media',
  roomSides: 6,
  roomName: 'Sala Média',
  isMasterActive: false,
  isPanelOpen: false,
  currentRoundId: null,
  lastSearch: null,
  lastLocalActionTs: 0,
  _lastSentTs: 0,
  _lastAppliedRemoteTs: 0,
  _pendingSyncCount: 0,
  currentPhase: 'sobreviventes',
  declaredSectors: [],
  selectedSector: null,

  // Estado privado dos dados de camuflagem (exclusivo dos jogadores)
  playerCamouflageDice: [],
  playerMaxCamouflage: 4,
  _rolledRoundId: null,
  _roundJoinedAt: 0,
  _processedSearchIds: new Set(),
  _isRollingDice: false,
  _diceRollTimer: null,
  _diceHideTimer: null,

  _panelWaveRaf: null,
  _panelWaveStartTime: 0,

  init() {
    this.renderSurvivalPanel();
  },

  _isMasterUser() {
    return Boolean(window.MesaApp && MesaApp.state && MesaApp.state.isMaster);
  },

  _randomSector(sides) {
    const maxSides = Math.max(2, Number(sides) || 6);
    if (window.MesaDice && typeof MesaDice.cryptoRandomInt === 'function') {
      return MesaDice.cryptoRandomInt(1, maxSides);
    }
    return Math.floor(Math.random() * maxSides) + 1;
  },

  /** Picks unique sector numbers in [1..maxSides] avoiding duplicates within the batch and existing camouflage dice. */
  _pickUniqueSectors(count, sides) {
    const maxSides = Math.max(2, Number(sides) || this.roomSides || 6);
    const used = new Set(
      (Array.isArray(this.playerCamouflageDice) ? this.playerCamouflageDice : [])
        .map(d => Number(d && d.sector))
        .filter(n => Number.isFinite(n) && n >= 1 && n <= maxSides)
    );
    const available = [];
    for (let s = 1; s <= maxSides; s++) {
      if (!used.has(s)) available.push(s);
    }
    const picked = [];
    for (let i = 0; i < count; i++) {
      if (available.length > 0) {
        const idx = (window.MesaDice && typeof MesaDice.cryptoRandomInt === 'function')
          ? MesaDice.cryptoRandomInt(0, available.length - 1)
          : Math.floor(Math.random() * available.length);
        picked.push(available.splice(idx, 1)[0]);
      } else {
        picked.push(this._randomSector(maxSides));
      }
    }
    return picked;
  },

  _getStorageKey(roundId) {
    return roundId ? `wu_esconderijo_round_${roundId}` : null;
  },

  _savePlayerRoundState() {
    if (this._isMasterUser() || !this._rolledRoundId) return;
    const key = this._getStorageKey(this._rolledRoundId);
    if (!key) return;
    try {
      sessionStorage.setItem(key, JSON.stringify({
        dice: this.playerCamouflageDice,
        joinedAt: this._roundJoinedAt || Date.now(),
        processedSearchIds: Array.from(this._processedSearchIds || [])
      }));
    } catch (e) {}
  },

  _restorePlayerRoundState(roundId) {
    const key = this._getStorageKey(roundId);
    if (!key) return false;
    try {
      const raw = sessionStorage.getItem(key);
      if (!raw) return false;
      const parsed = JSON.parse(raw);
      if (!parsed || !Array.isArray(parsed.dice)) return false;
      this.playerCamouflageDice = parsed.dice
        .filter(d => d && Number(d.sector) >= 1)
        .slice(0, this.playerMaxCamouflage)
        .map((d, idx) => ({
          id: String(d.id || `cam_${roundId}_${idx}`),
          sector: Number(d.sector)
        }));
      this._roundJoinedAt = Number(parsed.joinedAt) || Date.now();
      this._processedSearchIds = new Set(Array.isArray(parsed.processedSearchIds) ? parsed.processedSearchIds : []);
      this._rolledRoundId = roundId;
      return true;
    } catch (e) {
      return false;
    }
  },

  _clearStoredRoundState(roundId) {
    const key = this._getStorageKey(roundId);
    if (!key) return;
    try { sessionStorage.removeItem(key); } catch (e) {}
  },

  _clearDiceTimers() {
    if (this._diceRollTimer) {
      clearTimeout(this._diceRollTimer);
      clearInterval(this._diceRollTimer);
      this._diceRollTimer = null;
    }
    if (this._diceHideTimer) {
      clearTimeout(this._diceHideTimer);
      this._diceHideTimer = null;
    }
  },

  _hideDiceStage() {
    this._clearDiceTimers();
    this._isRollingDice = false;
    const stage = document.getElementById('esconderijo-dice-stage');
    if (stage) {
      stage.classList.remove('active', 'destruction-only');
      stage.innerHTML = '';
    }
    this.renderCamouflagePips();
  },

  _resetRoundState() {
    if (this._rolledRoundId) this._clearStoredRoundState(this._rolledRoundId);
    if (this.currentRoundId) this._clearStoredRoundState(this.currentRoundId);
    this.currentRoundId = null;
    this.lastSearch = null;
    this.playerCamouflageDice = [];
    this._rolledRoundId = null;
    this._roundJoinedAt = 0;
    this._processedSearchIds = new Set();
    this._hideDiceTimersSafe();
  },

  _hideDiceTimersSafe() {
    this._hideDiceStage();
  },

  /** Plays a local crimson dice roll exclusively on the current player's screen and binds results to camouflage points. */
  playLocalCamouflageRoll(count, sides, badgeLabel, onComplete) {
    const dieCount = Math.max(1, Math.min(this.playerMaxCamouflage, Number(count) || 1));
    const maxSides = Math.max(4, Number(sides) || this.roomSides || 6);
    const stage = document.getElementById('esconderijo-dice-stage');

    const rolledValues = this._pickUniqueSectors(dieCount, maxSides);

    this._clearDiceTimers();
    this._isRollingDice = true;
    this.renderCamouflagePips();

    const commitResults = () => {
      const stamp = Date.now();
      rolledValues.forEach((val, idx) => {
        if (this.playerCamouflageDice.length < this.playerMaxCamouflage) {
          this.playerCamouflageDice.push({
            id: `cam_${stamp}_${idx}_${Math.random().toString(36).slice(2, 6)}`,
            sector: val
          });
        }
      });
      this._savePlayerRoundState();
      this.renderCamouflagePips();
      if (typeof onComplete === 'function') onComplete(rolledValues);
    };

    if (!stage) {
      this._isRollingDice = false;
      commitResults();
      return;
    }

    stage.classList.remove('destruction-only');
    stage.innerHTML = `
      <div class="dice-roller-badge esconderijo-badge">${badgeLabel} (d${maxSides})</div>
      <div class="dice-tumbling-arena">
        ${rolledValues.map((_, i) => (window.MesaDice && typeof MesaDice.buildPolyhedralDieHtml === 'function')
          ? MesaDice.buildPolyhedralDieHtml({
              id: `esc-die-box-${i}`,
              sides: maxSides,
              initialVal: '?',
              boxClass: 'esconderijo-die-box rolling'
            })
          : `
            <div id="esc-die-box-${i}" class="dice-tumble-box esconderijo-die-box rolling" data-die-sides="d${maxSides}">
              <span class="dice-tumble-val">?</span>
              <span class="dice-tumble-type">d${maxSides}</span>
            </div>
          `
        ).join('')}
      </div>
      <div class="esconderijo-roll-sub" id="esc-roll-sub">Sorteando setor de camuflagem...</div>
    `;
    stage.classList.add('active');

    rolledValues.forEach((val, i) => {
      const box = stage.querySelector(`#esc-die-box-${i}`);
      const canvas = box ? box.querySelector('.die-3d-canvas') : null;
      if (canvas && window.Mesa3DDice) {
        Mesa3DDice.attach(canvas, {
          sides: maxSides,
          targetVal: val,
          theme: 'esconderijo',
          durationMs: 2560,
          easePower: 3.5,
          size: 110
        });
      }
    });

    this._diceRollTimer = setTimeout(() => {
      this._clearDiceTimers();
      for (let i = 0; i < rolledValues.length; i++) {
        const box = stage.querySelector(`#esc-die-box-${i}`);
        const valEl = stage.querySelector(`#esc-die-box-${i} .dice-tumble-val`);
        const canvas = box ? box.querySelector('.die-3d-canvas') : null;
        if (box) {
          box.classList.remove('rolling');
          box.classList.add('settled');
        }
        if (valEl) valEl.textContent = String(rolledValues[i]);
        if (canvas && window.Mesa3DDice) {
          Mesa3DDice.settle(canvas, rolledValues[i], 'esconderijo');
        }
      }
      const subEl = stage.querySelector('#esc-roll-sub');
      if (subEl) {
        subEl.textContent = `Setor(es) vinculados: ${rolledValues.join(' • ')}`;
      }
      this._isRollingDice = false;
      commitResults();

      this._diceHideTimer = setTimeout(() => {
        stage.classList.remove('active');
        stage.innerHTML = '';
      }, 1250);
    }, 2600);
  },

  /** Triggers the initial 2-dice camouflage roll once per hiding round on non-Master clients. */
  maybeInitializeRoundDice(roundId, sides) {
    if (this._isMasterUser()) return;
    const rid = roundId || 'active';
    if (this._rolledRoundId === rid) return;
    if (this._restorePlayerRoundState(rid)) {
      this.renderCamouflagePips();
      return;
    }

    this._rolledRoundId = rid;
    this._roundJoinedAt = Date.now();
    this._processedSearchIds = new Set();
    this.playerCamouflageDice = [];
    this._savePlayerRoundState();
    this.playLocalCamouflageRoll(2, sides || this.roomSides, 'DADOS DE CAMUFLAGEM INICIAIS');
  },

  toggleSurvivalPanel(shouldBroadcast = true) {
    const isMaster = this._isMasterUser();
    if (this.isPanelOpen) {
      if (isMaster && shouldBroadcast) {
        this.stopHidingRound(false);
      } else if (isMaster) {
        this.closeSurvivalPanel(false, true);
      }
    } else {
      this.openSurvivalPanel(shouldBroadcast);
    }
  },

  openSurvivalPanel(shouldBroadcast = false) {
    this.isPanelOpen = true;
    const isMaster = this._isMasterUser();
    const panel = document.getElementById('combat-survival-panel');
    const toggleBtn = document.getElementById('combat-survival-toggle-btn');

    if (isMaster && !this.currentRoundId) {
      this.currentRoundId = Date.now();
      this.lastSearch = null;
    }

    if (panel) {
      panel.classList.add('active');
      if (toggleBtn) toggleBtn.classList.add('active');
      document.body.classList.add('esconderijo-active', 'esconderijo-panel-open');
      if (window.MesaCombate) {
        MesaCombate._cachedMetricsTime = 0;
        if (typeof MesaCombate.updateVideoVariant === 'function') MesaCombate.updateVideoVariant(true);
      }
      this.startPanelWave();
      this.renderSurvivalPanel();
    }
    if (isMaster && shouldBroadcast) {
      const now = Date.now();
      this.lastLocalActionTs = now;
      this._lastSentTs = Math.max(this._lastSentTs || 0, now);
      this.isMasterActive = true;
      this.broadcastStart(now);
      this.syncStateToSupabase(true, now);
    }
  },

  closeSurvivalPanel(shouldBroadcast = false, force = false) {
    const isMaster = this._isMasterUser();
    // Jogadores nao podem fechar a aba de esconderijo voluntariamente
    if (!isMaster && !force && (this.isPanelOpen || document.body.classList.contains('esconderijo-active'))) {
      return;
    }
    // Se o Mestre fechar pelo botao X enquanto a rodada esta ativa, encerra globalmente para nao reabrir no polling
    if (isMaster && (shouldBroadcast || this.isMasterActive || document.body.classList.contains('esconderijo-active'))) {
      this.stopHidingRound(!shouldBroadcast);
      return;
    }

    this.isPanelOpen = false;
    document.body.classList.remove('esconderijo-panel-open');
    if (window.MesaCombate) MesaCombate._cachedMetricsTime = 0;

    const panel = document.getElementById('combat-survival-panel');
    const toggleBtn = document.getElementById('combat-survival-toggle-btn');
    if (panel) {
      panel.classList.remove('active');
      if (toggleBtn) toggleBtn.classList.remove('active');
      if (!this.isMasterActive || isMaster) {
        document.body.classList.remove('esconderijo-active');
        if (window.MesaCombate && typeof MesaCombate.updateVideoVariant === 'function') MesaCombate.updateVideoVariant(false);
      }
      this.stopPanelWave();
    }
  },

  getChannel() {
    return (window.MesaApp && MesaApp.channel) || (window.MesaChat && MesaChat.channel) || null;
  },

  broadcastStart(timestamp = Date.now()) {
    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'esconderijo_iniciar',
          payload: {
            active: true,
            roundId: this.currentRoundId || timestamp,
            roomSides: this.roomSides,
            roomName: this.roomName,
            phase: this.currentPhase,
            videoUrl: 'assets/videos/assasino1_vermelho.mp4?v=2.5.4',
            timestamp
          }
        });
      } catch (e) {}
    }
  },

  broadcastStop(timestamp = Date.now()) {
    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'esconderijo_encerrar',
          payload: {
            active: false,
            videoUrl: 'assets/videos/assasino1.mp4?v=2.5.4',
            timestamp
          }
        });
      } catch (e) {}
    }
  },

  async syncStateToSupabase(isActive, timestamp = Date.now()) {
    if (!window.MesaApp || !MesaApp.supabase || !MesaApp.state || !MesaApp.state.isMaster) return;
    const now = Number(timestamp) || Date.now();
    this.lastLocalActionTs = Math.max(this.lastLocalActionTs || 0, Date.now());
    this._lastSentTs = Math.max(this._lastSentTs || 0, now);

    const payload = isActive ? {
      active: true,
      roundId: this.currentRoundId || now,
      roomSides: this.roomSides,
      roomName: this.roomName,
      phase: this.currentPhase,
      lastSearch: this.lastSearch || null,
      videoUrl: 'assets/videos/assasino1_vermelho.mp4?v=2.5.4',
      timestamp: now
    } : {
      active: false,
      roundId: null,
      lastSearch: null,
      videoUrl: 'assets/videos/assasino1.mp4?v=2.5.4',
      timestamp: now
    };

    if (MesaApp.state.rawRow1Atributos) {
      MesaApp.state.rawRow1Atributos._sys_esconderijo = payload;
    }

    this._pendingSyncCount = (this._pendingSyncCount || 0) + 1;
    try {
      await MesaApp.queueRow1Update((attrs) => {
        attrs._sys_esconderijo = payload;
      });
    } catch (e) {
      console.warn("Erro ao sincronizar estado de esconderijo no Supabase:", e);
    } finally {
      this._pendingSyncCount = Math.max(0, (this._pendingSyncCount || 1) - 1);
    }
  },

  /** Applies remote _sys_esconderijo snapshots idempotently without fighting in-flight Master actions. */
  syncFromRemote(esc) {
    if (!esc || typeof esc !== 'object') return;
    const isMaster = this._isMasterUser();
    const remoteTs = Number(esc.timestamp) || 0;

    if (isMaster) {
      if ((this._pendingSyncCount || 0) > 0) return;
      if (remoteTs && this._lastSentTs && remoteTs < this._lastSentTs) return;
      if (Date.now() - (this.lastLocalActionTs || 0) < 4000) return;
    } else {
      if (remoteTs && remoteTs < (this._lastAppliedRemoteTs || 0)) return;
    }

    const isSameTs = Boolean(remoteTs && remoteTs === this._lastAppliedRemoteTs);
    if (!isSameTs && remoteTs) {
      this._lastAppliedRemoteTs = remoteTs;
    }

    if (esc.active) {
      if (!isSameTs) {
        this.handleIncomingStart(esc);
      }
      if (!isMaster && esc.lastSearch && esc.lastSearch.searchId && esc.lastSearch.sector) {
        const searchTs = Number(esc.lastSearch.timestamp) || 0;
        if (!this._roundJoinedAt || searchTs >= (this._roundJoinedAt - 1500)) {
          this.handleIncomingSearch(esc.lastSearch);
        }
      }
    } else if (!isSameTs) {
      if (this.isPanelOpen || this.isMasterActive || document.body.classList.contains('esconderijo-active')) {
        this.handleIncomingStop(esc);
      }
    }
  },

  startPanelWave() {
    this.stopPanelWave();
    const canvas = document.getElementById('survival-panel-wave-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this._panelWaveStartTime = performance.now();
    const loop = () => {
      if (!this.isPanelOpen) {
        this.stopPanelWave();
        return;
      }
      this.drawPanelWave(canvas, ctx);
      this._panelWaveRaf = requestAnimationFrame(loop);
    };
    this._panelWaveRaf = requestAnimationFrame(loop);
  },

  stopPanelWave() {
    if (this._panelWaveRaf) {
      cancelAnimationFrame(this._panelWaveRaf);
      this._panelWaveRaf = null;
    }
    const canvas = document.getElementById('survival-panel-wave-canvas');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  },

  drawPanelWave(canvas, ctx) {
    const w = 44;
    const h = canvas.parentElement ? canvas.parentElement.clientHeight : window.innerHeight;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    ctx.clearRect(0, 0, w, h);

    const pixelSize = 4;
    const waveCenter = 24;
    const t = (performance.now() - (this._panelWaveStartTime || 0)) * 0.001;
    const numSteps = Math.ceil(h / pixelSize);

    ctx.save();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    for (let i = 0; i <= numSteps; i++) {
      const y = i * pixelSize;
      const w1 = Math.sin(y * 0.012 - t * 2.2) * 8.0;
      const w2 = Math.cos(y * 0.028 + t * 2.8) * 4.5;
      const x = Math.round((waveCenter + w1 + w2) / pixelSize) * pixelSize;
      if (i === 0) {
        ctx.moveTo(x, 0);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.lineTo(w, h);
    ctx.lineTo(w, 0);
    ctx.closePath();
    ctx.fill();

    // Brilho suave que acompanha apenas a onda pixelada, sem formar linha reta na borda direita
    ctx.shadowColor = 'rgba(255, 17, 51, 0.72)';
    ctx.shadowBlur = 7;
    ctx.shadowOffsetX = -3;
    ctx.shadowOffsetY = 0;
    ctx.fillStyle = '#ff1133';
    let prevX = null;
    for (let i = 0; i <= numSteps; i++) {
      const y = i * pixelSize;
      const w1 = Math.sin(y * 0.012 - t * 2.2) * 8.0;
      const w2 = Math.cos(y * 0.028 + t * 2.8) * 4.5;
      const x = Math.round((waveCenter + w1 + w2) / pixelSize) * pixelSize;

      ctx.fillRect(x, y, pixelSize, pixelSize);
      if (prevX !== null && prevX !== x) {
        const minX = Math.min(prevX, x);
        const maxX = Math.max(prevX, x);
        for (let bx = minX; bx <= maxX; bx += pixelSize) {
          ctx.fillRect(bx, y, pixelSize, pixelSize);
        }
      }
      prevX = x;
    }
    ctx.restore();
  },

  openContextualModal() {
    this.toggleSurvivalPanel();
  },

  advanceEsconderijoPhase(shouldBroadcast = true) {
    if (shouldBroadcast && !this._isMasterUser()) return;
    this.currentPhase = (this.currentPhase === 'sobreviventes') ? 'perseguidor' : 'sobreviventes';
    this.updatePhaseUI();
    const isMaster = this._isMasterUser();
    const now = Date.now();
    if (shouldBroadcast) {
      this.lastLocalActionTs = now;
      this._lastSentTs = Math.max(this._lastSentTs || 0, now);
      const chan = this.getChannel();
      if (chan) {
        try {
          chan.send({
            type: 'broadcast',
            event: 'esconderijo_fase',
            payload: { phase: this.currentPhase, timestamp: now }
          });
        } catch (e) {}
      }
      if (isMaster && this.isPanelOpen) {
        this.syncStateToSupabase(true, now);
      }
    }
    const phaseName = (this.currentPhase === 'sobreviventes') ? 'Fase dos Sobreviventes' : 'Fase do Perseguidor';
    if (window.MesaApp && typeof MesaApp.showToast === 'function') {
      MesaApp.showToast(`Ordem de Esconderijo: ${phaseName}`);
    }
  },

  handleIncomingPhase(payload) {
    if (!payload || !payload.phase) return;
    this.currentPhase = payload.phase;
    this.updatePhaseUI();
    const phaseName = (this.currentPhase === 'sobreviventes') ? 'Fase dos Sobreviventes' : 'Fase do Perseguidor';
    if (window.MesaApp && typeof MesaApp.showToast === 'function') {
      MesaApp.showToast(`Ordem de Esconderijo: ${phaseName}`);
    }
  },

  updatePhaseUI() {
    const badge = document.getElementById('survival-phase-badge');
    const desc = document.getElementById('survival-phase-desc');
    if (!badge || !desc) return;
    if (this.currentPhase === 'sobreviventes') {
      badge.textContent = 'FASE DOS SOBREVIVENTES';
      badge.className = 'survival-phase-badge sobreviventes';
      desc.textContent = 'Sobreviventes agem e declaram suas ações verbais primeiro. Em seguida, a vez passa ao Perseguidor.';
    } else {
      badge.textContent = 'FASE DO PERSEGUIDOR';
      badge.className = 'survival-phase-badge perseguidor';
      desc.textContent = 'A vez passa ao Perseguidor. O Mestre escolhe e declara o setor a ser vasculhado.';
    }
  },

  selectRoom(roomType) {
    if (!this._isMasterUser()) return;
    this.room = roomType;
    if (roomType === 'pequena') {
      this.roomSides = 4;
      this.roomName = 'Sala Pequena';
    } else if (roomType === 'grande') {
      this.roomSides = 8;
      this.roomName = 'Sala Grande';
    } else {
      this.roomSides = 6;
      this.roomName = 'Sala Média';
    }
    document.querySelectorAll('.survival-room-btn').forEach(b => b.classList.remove('selected'));
    const btn = document.getElementById(`srv-room-${roomType}`);
    if (btn) btn.classList.add('selected');
    this.selectedSector = null;
    this.renderMasterSectors();

    if (this.isPanelOpen) {
      const now = Date.now();
      this.lastLocalActionTs = now;
      this._lastSentTs = Math.max(this._lastSentTs || 0, now);
      this.broadcastStart(now);
      this.syncStateToSupabase(true, now);
    }
  },

  renderSurvivalPanel() {
    const isMaster = this._isMasterUser();
    const phaseActionsEl = document.getElementById('survival-master-phase-actions');
    const masterSectionEl = document.getElementById('survival-master-section');
    const camBlockEl = document.getElementById('survival-camouflage-block');
    const playerSectionTitleEl = document.getElementById('survival-player-section-title');

    if (phaseActionsEl) phaseActionsEl.style.display = isMaster ? 'flex' : 'none';
    if (masterSectionEl) masterSectionEl.style.display = isMaster ? 'flex' : 'none';
    if (camBlockEl) camBlockEl.style.display = isMaster ? 'none' : 'flex';
    if (playerSectionTitleEl) {
      playerSectionTitleEl.textContent = isMaster ? 'CONTROLES DA MESA' : 'SEU ESCONDERIJO';
    }

    this.updatePhaseUI();
    this.renderCamouflagePips();
    this.updatePavorToggleUI();
    if (isMaster) {
      this.renderMasterSectors();
      this.updateHistoryBox();
    }
  },

  /** Rolls 1 die matching roomSides exclusively on the player's screen to add +1 sector-bound camouflage point. */
  keepBreathing() {
    if (this._isMasterUser()) return;
    if (this._isRollingDice) return;
    if (this.playerCamouflageDice.length >= this.playerMaxCamouflage) {
      if (window.MesaApp && typeof MesaApp.showToast === 'function') {
        MesaApp.showToast('Limite máximo de 4 pontos de camuflagem atingido.');
      }
      return;
    }
    this.playLocalCamouflageRoll(1, this.roomSides, 'MANTER A RESPIRAÇÃO');
  },

  /** Removes a single specific camouflage die by ID with a dust disintegration effect. */
  removeCamouflageDie(dieId) {
    if (this._isMasterUser()) return;
    const idx = this.playerCamouflageDice.findIndex(d => d && d.id === dieId);
    if (idx === -1) return;

    const itemEl = document.querySelector(`.survival-cam-item[data-cam-die-id="${dieId}"]`);
    const pipEl = itemEl ? itemEl.querySelector('.survival-pip') : null;
    if (pipEl && window.MesaDice && typeof MesaDice.createDustVanishEffect === 'function') {
      MesaDice.createDustVanishEffect(pipEl, '#ff1133', 22);
    }
    if (itemEl) {
      itemEl.style.pointerEvents = 'none';
      itemEl.style.opacity = '0';
      itemEl.style.transform = 'scale(0.2)';
    }

    this.playerCamouflageDice.splice(idx, 1);
    this._savePlayerRoundState();
    setTimeout(() => {
      this.renderCamouflagePips();
    }, 150);
  },

  /** Compatibility fallback wrapper. */
  adjustCamouflage(delta) {
    if (this._isMasterUser()) return;
    if (delta > 0) {
      this.keepBreathing();
    } else if (delta < 0 && this.playerCamouflageDice.length > 0) {
      const last = this.playerCamouflageDice[this.playerCamouflageDice.length - 1];
      if (last) this.removeCamouflageDie(last.id);
    }
  },

  renderCamouflagePips() {
    const container = document.getElementById('survival-cam-pips');
    const countEl = document.getElementById('survival-cam-count');
    const breatheBtn = document.getElementById('survival-keep-breathing-btn');
    const currentCount = this.playerCamouflageDice.length;

    if (countEl) countEl.textContent = `${currentCount}/${this.playerMaxCamouflage}`;
    if (breatheBtn) {
      breatheBtn.disabled = this._isRollingDice || currentCount >= this.playerMaxCamouflage;
    }
    if (!container) return;
    container.innerHTML = '';

    if (currentCount === 0) {
      const empty = document.createElement('span');
      empty.className = 'survival-cam-empty';
      empty.textContent = this._isRollingDice ? 'Rolando dados de camuflagem...' : 'Nenhum ponto de camuflagem ativo.';
      container.appendChild(empty);
      return;
    }

    this.playerCamouflageDice.forEach((die) => {
      const item = document.createElement('div');
      item.className = 'survival-cam-item';
      item.dataset.camDieId = die.id;

      const pip = document.createElement('span');
      pip.className = 'survival-pip filled';
      pip.title = `Ponto de Camuflagem no Setor ${die.sector}`;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'survival-pip-remove';
      removeBtn.textContent = '×';
      removeBtn.title = `Remover camuflagem do Setor ${die.sector}`;
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        this.removeCamouflageDie(die.id);
      };

      const sectorNum = document.createElement('span');
      sectorNum.className = 'survival-pip-sector';
      sectorNum.textContent = String(die.sector);

      item.appendChild(removeBtn);
      item.appendChild(pip);
      item.appendChild(sectorNum);
      container.appendChild(item);
    });
  },

  updatePavorToggleUI() {
    const toggle = document.getElementById('survival-pavor-toggle');
    const label = document.getElementById('survival-pavor-switch-text');
    const isMaster = this._isMasterUser();
    const activePlayer = (window.MesaApp && MesaApp.state && MesaApp.state.myPlayerSlot && MesaApp.state.players[MesaApp.state.myPlayerSlot - 1])
      || (window.MesaApp && MesaApp.state && MesaApp.state.players && MesaApp.state.players[0]);
    const hasPavor = activePlayer ? Boolean(activePlayer.dadoDePavor) : false;
    if (toggle) {
      toggle.checked = hasPavor;
      toggle.disabled = !isMaster;
      toggle.title = isMaster ? 'Alternar Dado de Pavor' : 'Apenas o Mestre pode alterar o Dado de Pavor';
    }
    if (label) {
      label.textContent = hasPavor ? 'Pavor Ativo' : 'Pavor Inativo';
      label.style.color = hasPavor ? '#ff1133' : 'var(--text-muted, #888)';
    }
  },

  togglePavorFromSurvival() {
    if (!this._isMasterUser()) {
      if (window.MesaApp && typeof MesaApp.showToast === 'function') {
        MesaApp.showToast("Apenas o Mestre pode alterar o Dado de Pavor.");
      }
      this.updatePavorToggleUI();
      return;
    }
    const slot = (window.MesaApp && MesaApp.state && MesaApp.state.myPlayerSlot) || 1;
    if (window.MesaApp && typeof MesaApp.toggleDadoDePavor === 'function') {
      MesaApp.toggleDadoDePavor(slot);
    }
    this.updatePavorToggleUI();
  },

  renderMasterSectors() {
    const grid = document.getElementById('survival-master-sectors-grid');
    if (!grid) return;
    grid.innerHTML = '';
    for (let i = 1; i <= this.roomSides; i++) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `survival-sector-btn ${this.selectedSector === i ? 'selected' : ''}`;
      btn.textContent = `Setor ${i}`;
      btn.onclick = () => this.selectMasterSector(i);
      grid.appendChild(btn);
    }
    const declareBtn = document.getElementById('survival-declare-btn');
    if (declareBtn) {
      declareBtn.textContent = this.selectedSector ? `Declarar Busca no Setor ${this.selectedSector}` : 'Selecione um Setor';
      declareBtn.disabled = !this.selectedSector;
    }
  },

  selectMasterSector(num) {
    if (!this._isMasterUser()) return;
    this.selectedSector = num;
    this.renderMasterSectors();
  },

  rollRandomSearch() {
    if (!this._isMasterUser()) return;
    this.selectedSector = this._randomSector(this.roomSides);
    this.renderMasterSectors();
  },

  declareSearch() {
    if (!this._isMasterUser() || !this.selectedSector) return;
    const now = Date.now();
    const sector = this.selectedSector;
    const searchId = `srv_${now}_${Math.random().toString(36).slice(2, 6)}`;

    this.lastLocalActionTs = now;
    this._lastSentTs = Math.max(this._lastSentTs || 0, now);
    this.lastSearch = { sector, searchId, timestamp: now };
    this.declaredSectors.push(sector);
    this.updateHistoryBox();

    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'esconderijo_busca',
          payload: {
            sector,
            searchId,
            roundId: this.currentRoundId,
            timestamp: now
          }
        });
      } catch (e) {}
    }

    if (this.isPanelOpen) {
      this.syncStateToSupabase(true, now);
    }

    if (window.MesaChat && typeof MesaChat.receiveMessage === 'function') {
      MesaChat.receiveMessage({
        id: 'hiding_search_' + now,
        sender_name: 'Perseguidor',
        is_master: true,
        content: `[BUSCA]: A criatura vasculhou o SETOR ${sector}.`,
        created_at: new Date().toISOString()
      });
    }

    this.selectedSector = null;
    this.renderMasterSectors();
  },

  /** Evaporates every local player camouflage die bound to the searched sector. */
  evaporateMatchingDice(sector) {
    if (this._isMasterUser()) return 0;
    const targetSector = Number(sector);
    const matches = this.playerCamouflageDice.filter(d => Number(d.sector) === targetSector);
    if (matches.length === 0) return 0;

    matches.forEach((die) => {
      const itemEl = document.querySelector(`.survival-cam-item[data-cam-die-id="${die.id}"]`);
      const pipEl = itemEl ? itemEl.querySelector('.survival-pip') : null;
      if (pipEl && window.MesaDice && typeof MesaDice.createDustVanishEffect === 'function') {
        MesaDice.createDustVanishEffect(pipEl, '#ff1133', 28);
      }
      if (itemEl) {
        itemEl.style.pointerEvents = 'none';
        itemEl.style.opacity = '0';
        itemEl.style.transform = 'scale(0.2)';
      }
    });

    this.playerCamouflageDice = this.playerCamouflageDice.filter(d => Number(d.sector) !== targetSector);
    this._savePlayerRoundState();

    const mySlot = (window.MesaApp && MesaApp.state && MesaApp.state.myPlayerSlot) || 1;
    this.revealPlayerCardSector(mySlot, targetSector);
    this.playCamouflageFoundDestruction(targetSector, matches.length);

    const chan = this.getChannel();
    if (chan) {
      try {
        chan.send({
          type: 'broadcast',
          event: 'esconderijo_evaporou',
          payload: {
            slot: mySlot,
            sector: targetSector,
            lostCount: matches.length,
            timestamp: Date.now()
          }
        });
      } catch (e) {}
    }

    setTimeout(() => {
      this.renderCamouflagePips();
    }, 170);

    return matches.length;
  },

  /** Displays only the discovered camouflage die(s) at the center of the player's screen, shakes them, and disintegrates into dust without text notices. */
  playCamouflageFoundDestruction(sector, lostCount = 1) {
    const stage = document.getElementById('esconderijo-dice-stage');
    if (!stage) return;

    this._clearDiceTimers();
    this._isRollingDice = false;

    const count = Math.max(1, Number(lostCount) || 1);
    const maxSides = Math.max(4, Number(this.roomSides) || 6);
    stage.classList.add('destruction-only');
    stage.innerHTML = `
      <div class="dice-tumbling-arena">
        ${Array.from({ length: count }).map((_, i) => (window.MesaDice && typeof MesaDice.buildPolyhedralDieHtml === 'function')
          ? MesaDice.buildPolyhedralDieHtml({
              id: `esc-found-die-${i}`,
              sides: maxSides,
              initialVal: String(sector),
              boxClass: 'esconderijo-die-box shaking',
              showType: false
            })
          : `
            <div id="esc-found-die-${i}" class="dice-tumble-box esconderijo-die-box shaking" data-die-sides="d${maxSides}">
              <span class="dice-tumble-val">${sector}</span>
            </div>
          `
        ).join('')}
      </div>
    `;
    stage.classList.add('active');

    for (let i = 0; i < count; i++) {
      const box = stage.querySelector(`#esc-found-die-${i}`);
      const canvas = box ? box.querySelector('.die-3d-canvas') : null;
      if (canvas && window.Mesa3DDice) {
        Mesa3DDice.attach(canvas, {
          sides: maxSides,
          targetVal: sector,
          theme: 'esconderijo',
          instantSettle: true,
          size: 114
        });
      }
    }

    this._diceRollTimer = setTimeout(() => {
      for (let i = 0; i < count; i++) {
        const box = stage.querySelector(`#esc-found-die-${i}`);
        if (box) {
          box.classList.remove('shaking');
          if (window.MesaDice && typeof MesaDice.createDustVanishEffect === 'function') {
            MesaDice.createDustVanishEffect(box, '#ff1133', 42);
          }
          box.style.opacity = '0';
          box.style.transform = 'scale(0.3)';
          box.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        }
      }
      this._diceHideTimer = setTimeout(() => {
        stage.classList.remove('active', 'destruction-only');
        stage.innerHTML = '';
      }, 780);
    }, 880);
  },

  revealPlayerCardSector(slotNum, sector) {
    const card = document.getElementById(`combat-player-card-${slotNum}`);
    if (!card) return;

    const existing = card.querySelector('.card-revealed-sector-badge');
    if (existing) existing.remove();

    const badge = document.createElement('div');
    badge.className = 'card-revealed-sector-badge';
    badge.textContent = `SETOR ${sector}`;
    card.appendChild(badge);

    setTimeout(() => {
      if (window.MesaDice && typeof MesaDice.createDustVanishEffect === 'function') {
        MesaDice.createDustVanishEffect(badge, '#ff1133', 30);
      } else {
        badge.remove();
      }
    }, 1200);
  },

  handleIncomingEvaporation(payload) {
    if (!payload || !payload.slot || !payload.sector) return;
    this.revealPlayerCardSector(Number(payload.slot), Number(payload.sector));
  },

  handleIncomingSearch(payload) {
    if (!payload || !payload.sector || this._isMasterUser()) return;
    const searchId = payload.searchId ? String(payload.searchId) : `s_${payload.sector}_${payload.timestamp || 0}`;
    if (this._processedSearchIds.has(searchId)) return;
    this._processedSearchIds.add(searchId);
    this._savePlayerRoundState();
    this.evaporateMatchingDice(Number(payload.sector));
  },

  handleIncomingStart(payload) {
    if (!payload) return;
    const ts = Number(payload.timestamp) || 0;
    if (ts && ts < (this._lastAppliedRemoteTs || 0)) return;
    if (ts) this._lastAppliedRemoteTs = ts;

    if (payload.roomSides) {
      this.roomSides = Number(payload.roomSides) || 6;
      this.room = this.roomSides === 4 ? 'pequena' : (this.roomSides === 8 ? 'grande' : 'media');
    }
    if (payload.roomName) this.roomName = payload.roomName;
    if (payload.phase) this.currentPhase = payload.phase;

    const incomingRoundId = payload.roundId || ts || 'active';
    if (this.currentRoundId !== incomingRoundId) {
      this.currentRoundId = incomingRoundId;
    }

    this.isMasterActive = true;
    document.body.classList.add('esconderijo-active');
    if (window.MesaCombate && typeof MesaCombate.updateVideoVariant === 'function') MesaCombate.updateVideoVariant(true);
    this.openSurvivalPanel(false);
    this.maybeInitializeRoundDice(this.currentRoundId, this.roomSides);
  },

  handleIncomingStop(payload) {
    const ts = Number(payload && payload.timestamp) || 0;
    if (ts && ts < (this._lastAppliedRemoteTs || 0)) return;
    if (ts) this._lastAppliedRemoteTs = ts;

    this._resetRoundState();
    this.isMasterActive = false;
    document.body.classList.remove('esconderijo-active', 'esconderijo-panel-open');
    if (window.MesaCombate) {
      MesaCombate._cachedMetricsTime = 0;
      if (typeof MesaCombate.updateVideoVariant === 'function') MesaCombate.updateVideoVariant(false);
    }
    this.closeSurvivalPanel(false, true);
  },

  updateHistoryBox() {
    const box = document.getElementById('survival-history-box');
    if (!box) return;
    if (this.declaredSectors.length === 0) {
      box.textContent = 'Nenhum setor revirado ainda.';
    } else {
      box.innerHTML = `<strong>Setores revirados:</strong> ${this.declaredSectors.map(s => `Setor ${s}`).join(' &bull; ')}`;
    }
  },

  stopHidingRound(announceInChat = true) {
    const now = Date.now();
    this.lastLocalActionTs = now;
    this._lastSentTs = Math.max(this._lastSentTs || 0, now);
    this.declaredSectors = [];
    this.selectedSector = null;
    this._resetRoundState();
    this.isMasterActive = false;
    this.isPanelOpen = false;

    const panel = document.getElementById('combat-survival-panel');
    const toggleBtn = document.getElementById('combat-survival-toggle-btn');
    if (panel) panel.classList.remove('active');
    if (toggleBtn) toggleBtn.classList.remove('active');
    document.body.classList.remove('esconderijo-active', 'esconderijo-panel-open');
    this.stopPanelWave();

    if (window.MesaCombate) {
      MesaCombate._cachedMetricsTime = 0;
      if (typeof MesaCombate.updateVideoVariant === 'function') {
        MesaCombate.updateVideoVariant(false);
      }
    }
    this.broadcastStop(now);
    this.syncStateToSupabase(false, now);
    if (announceInChat && window.MesaChat && typeof MesaChat.receiveMessage === 'function') {
      MesaChat.receiveMessage({
        id: 'hiding_end_' + now,
        sender_name: 'Mestre',
        is_master: true,
        content: '[PERSEGUIÇÃO]: A rodada de esconderijo foi encerrada.',
        created_at: new Date().toISOString()
      });
    }
  }
};
window.MesaEsconderijo = MesaEsconderijo;


// ==========================================================================
// REGISTRO DE ROLAGENS DOS JOGADORES (PERSISTÊNCIA EM BANCO DE DADOS SUPABASE)
// ==========================================================================
const MesaRollLog = {
  rolls: [],
  searchQuery: '',

  init() {
    this.render();
    this.fetchFromSupabase();
  },

  openModal() {
    this.fetchFromSupabase();
    const modal = document.getElementById('roll-log-modal');
    if (modal) modal.classList.add('active');
    this.render();
  },

  closeModal() {
    const modal = document.getElementById('roll-log-modal');
    if (modal) modal.classList.remove('active');
  },

  escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  },

  async fetchFromSupabase(showToast = false) {
    if (!MesaApp || !MesaApp.supabase) return;
    try {
      const { data, error } = await MesaApp.supabase
        .from('personagens')
        .select('atributos')
        .eq('id', 1)
        .single();
      if (data && data.atributos) {
        const attrs = typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos;
        if (attrs && Array.isArray(attrs._sys_roll_log)) {
          this.syncFromRemote(attrs._sys_roll_log);
          if (showToast && MesaApp.showToast) {
            MesaApp.showToast('Registro de rolagens sincronizado');
          }
        }
      }
    } catch(err) {
      console.warn("Erro ao buscar registro de rolagens do Supabase:", err);
    }
  },

  syncFromRemote(remoteRolls) {
    if (!Array.isArray(remoteRolls)) return;
    const existingIds = new Set(this.rolls.map(r => r.id));
    let hasNew = false;
    remoteRolls.forEach(r => {
      if (r && r.id && !existingIds.has(r.id)) {
        this.rolls.push(r);
        existingIds.add(r.id);
        hasNew = true;
      }
    });
    this.rolls.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    if (this.rolls.length > 150) {
      this.rolls = this.rolls.slice(0, 150);
    }
    this.render();
  },

  recordRoll(data) {
    const now = Date.now();
    const timeFormatted = new Date(now).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' • ' + new Date(now).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

    const entry = {
      id: 'roll_' + now + '_' + Math.random().toString(36).substr(2, 6),
      timestamp: now,
      timeFormatted: timeFormatted,
      rollerName: data.rollerName || 'Jogador',
      rollerSlot: data.rollerSlot || null,
      results: data.results || [],
      pavorResult: data.pavorResult || null,
      modifier: data.modifier || 0,
      total: data.total !== undefined ? data.total : 0,
      breakdown: data.breakdown || ''
    };

    this.rolls.unshift(entry);
    if (this.rolls.length > 150) {
      this.rolls = this.rolls.slice(0, 150);
    }
    this.render();
    this.saveToSupabase();

    // Insere tambem no historico do chat no Supabase
    if (MesaApp && MesaApp.supabase) {
      const sender = MesaChat.getCurrentSender();
      const modStr = entry.modifier !== 0 ? (entry.modifier > 0 ? ' + ' + entry.modifier : ' - ' + Math.abs(entry.modifier)) : '';
      MesaApp.supabase.from('mensagens_chat').insert({
        sender_name: entry.rollerName,
        sender_token: sender.token,
        is_master: false,
        content: '[REGISTRO] ' + entry.breakdown + modStr + ' -> Total: ' + entry.total
      }).catch(() => {});
    }
  },

  receiveIncomingRoll(data) {
    if (!data || data.isMaster) return;
    const now = Date.now();
    const timeFormatted = new Date(now).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' • ' + new Date(now).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

    const entry = {
      id: 'roll_' + now + '_' + Math.random().toString(36).substr(2, 6),
      timestamp: now,
      timeFormatted: timeFormatted,
      rollerName: data.rollerName || 'Jogador',
      rollerSlot: data.pavorResult ? data.pavorResult.playerSlot : null,
      results: data.results || [],
      pavorResult: data.pavorResult || null,
      modifier: data.modifier || 0,
      total: data.total !== undefined ? data.total : 0,
      breakdown: (data.results || []).map(d => '[d' + d.sides + ': ' + d.val + ']').join(' + ') + (data.pavorResult ? ' - [Pavor d' + data.pavorResult.sides + ': ' + data.pavorResult.val + ']' : '')
    };

    const existing = this.rolls.find(r => Math.abs((r.timestamp || 0) - now) < 2500 && r.rollerName === entry.rollerName && r.total === entry.total);
    if (!existing) {
      this.rolls.unshift(entry);
      if (this.rolls.length > 150) this.rolls = this.rolls.slice(0, 150);
      this.render();
    }
  },

  async saveToSupabase() {
    if (!MesaApp || !MesaApp.supabase) return;
    try {
      const { data } = await MesaApp.supabase
        .from('personagens')
        .select('atributos')
        .eq('id', 1)
        .single();
      const attrs = data && data.atributos
        ? (typeof data.atributos === 'string' ? JSON.parse(data.atributos) : data.atributos)
        : {};
      attrs._sys_roll_log = this.rolls.slice(0, 100);
      await MesaApp.supabase
        .from('personagens')
        .update({ atributos: attrs })
        .eq('id', 1);
    } catch(err) {
      console.warn("Erro ao salvar registro de rolagens no Supabase:", err);
    }
  },

  onSearch(val) {
    this.searchQuery = (val || '').trim().toLowerCase();
    this.render();
  },

  getFilteredRolls() {
    if (!this.searchQuery) return this.rolls;
    const q = this.searchQuery;
    return this.rolls.filter(r => {
      const nameMatch = (r.rollerName || '').toLowerCase().includes(q);
      const totalMatch = String(r.total).includes(q);
      const modMatch = String(r.modifier).includes(q);
      const diceMatch = (r.results || []).some(d => ('d' + d.sides).includes(q) || String(d.val).includes(q));
      const pavorMatch = r.pavorResult && ('pavor'.includes(q) || String(r.pavorResult.val).includes(q));
      return nameMatch || totalMatch || modMatch || diceMatch || pavorMatch;
    });
  },

  render() {
    const container = document.getElementById('roll-log-scroll-container');
    const badge = document.getElementById('roll-log-stats-badge');
    if (badge) badge.textContent = this.rolls.length + (this.rolls.length === 1 ? ' rolagem' : ' rolagens');
    if (!container) return;

    const filtered = this.getFilteredRolls();
    if (filtered.length === 0) {
      container.innerHTML = '<div class="roll-log-empty">' +
        '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>' +
        '<div class="roll-log-empty-title">NENHUMA ROLAGEM REGISTRADA</div>' +
        '<div class="roll-log-empty-sub">As rolagens realizadas pelos jogadores aparecem aqui automaticamente e ficam salvas no banco de dados.</div>' +
        '</div>';
      return;
    }

    container.innerHTML = filtered.map(r => {
      const timeStr = r.timeFormatted || (r.timestamp ? new Date(r.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' • ' + new Date(r.timestamp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '');
      const diceChips = (r.results || []).map(d => '<span class="roll-log-dice-chip">d' + d.sides + ': <strong>' + d.val + '</strong></span>').join('');
      const pavorChip = r.pavorResult ? '<span class="roll-log-pavor-chip"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg> PAVOR d' + r.pavorResult.sides + ': <strong>' + (r.pavorResult.val === 1 ? '1 (SUPERADO / +0)' : '-' + r.pavorResult.val) + '</strong></span>' : '';
      const pavorReliefBadge = (r.pavorResult && r.pavorResult.val === 1) ? '<span class="roll-log-relief-badge">Pavor Superado (Tirou 1)</span>' : '';
      const modChip = (r.modifier !== undefined && r.modifier !== 0) ? '<span class="roll-log-mod-chip">Mod: <strong>' + (r.modifier > 0 ? '+' + r.modifier : r.modifier) + '</strong></span>' : '';
      const slotLabel = r.rollerSlot ? 'S' + r.rollerSlot : 'JOGADOR';

      return '<div class="roll-log-card ' + (r.pavorResult ? 'has-pavor-roll' : '') + '">' +
        '<div class="roll-log-card-header">' +
          '<div class="roll-log-identity">' +
            '<span class="roll-log-slot-tag">' + slotLabel + '</span>' +
            '<span class="roll-log-player-name">' + this.escapeHtml(r.rollerName || 'Jogador') + '</span>' +
            pavorReliefBadge +
          '</div>' +
          '<span class="roll-log-time-tag">' + timeStr + '</span>' +
        '</div>' +
        '<div class="roll-log-card-body">' +
          '<div class="roll-log-chips-row">' +
            diceChips +
            pavorChip +
            modChip +
          '</div>' +
          '<div class="roll-log-total-badge">' +
            '<span class="roll-log-total-lbl">TOTAL</span>' +
            '<span class="roll-log-total-num">' + r.total + '</span>' +
          '</div>' +
        '</div>' +
      '</div>';
    }).join('');
  }
};
window.MesaRollLog = MesaRollLog;


// ==========================================================================
// DESBLOQUEADOR GLOBAL DE AUDIOCONTEXT PARA DISPOSITIVOS DA MESA
// ==========================================================================
(function() {
  const resumeSuspendedAudio = () => {
    if (window.MesaPerseguicaoFloresta && MesaPerseguicaoFloresta._audioCtx && MesaPerseguicaoFloresta._audioCtx.state === 'suspended') {
      MesaPerseguicaoFloresta._audioCtx.resume().catch(() => {});
    }
    if (window.MesaTvEstatica && MesaTvEstatica._audioCtx && MesaTvEstatica._audioCtx.state === 'suspended') {
      MesaTvEstatica._audioCtx.resume().catch(() => {});
    }
    if (window.MesaTvEstatica2 && MesaTvEstatica2._audioCtx && MesaTvEstatica2._audioCtx.state === 'suspended') {
      MesaTvEstatica2._audioCtx.resume().catch(() => {});
    }
  };
  ['pointerdown', 'click', 'keydown', 'touchstart'].forEach(ev => {
    window.addEventListener(ev, resumeSuspendedAudio, { passive: true });
  });
})();
