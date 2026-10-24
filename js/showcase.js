/* ============================================================
   WUITALUR RPG — CONTROLADOR SHOWCASE DE CLASSES E RAÇAS
   Canvas de Pontos da Mesa + Navegação por Tópicos Sem Scroll
   ============================================================ */

const ShowcaseEngine = {
  mode: 'classes', // 'classes' ou 'races'
  items: [],
  currentId: null,
  activeTopicIndex: 0,
  
  // Elementos do DOM
  elements: {
    heroArt: null,
    bigName: null,
    ndBadge: null,
    topicTabs: null,
    topicContent: null,
    drawerBackdrop: null,
    drawerList: null,
    drawerInput: null,
    hamburgerBtn: null,
    canvas: null
  },

  // Motor de Partículas (Canvas de Pontos)
  particles: {
    canvas: null,
    ctx: null,
    width: 0,
    height: 0,
    motes: [],
    animId: null,
    
    init(canvasEl) {
      if (!canvasEl) return;
      this.canvas = canvasEl;
      this.ctx = canvasEl.getContext('2d');
      this.resize();
      window.addEventListener('resize', () => this.resize());
      this.spawnMotes();
      this.loop();
    },

    resize() {
      const parent = this.canvas.parentElement;
      if (!parent) return;
      this.width = this.canvas.width = parent.clientWidth;
      this.height = this.canvas.height = parent.clientHeight;
    },

    spawnMotes() {
      this.motes = [];
      const count = 35;
      for (let i = 0; i < count; i++) {
        this.motes.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: Math.random() * 3.5 + 1.2,
          speedY: Math.random() * 0.8 + 0.3,
          speedX: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.5 + 0.2,
          pulse: Math.random() * Math.PI * 2,
          color: Math.random() > 0.4 ? '124, 58, 237' : '56, 189, 248' // Roxo Astral ou Azul Espiritual
        });
      }
    },

    loop() {
      if (!this.ctx) return;
      this.ctx.clearRect(0, 0, this.width, this.height);

      for (let i = 0; i < this.motes.length; i++) {
        const m = this.motes[i];
        m.y -= m.speedY;
        m.x += m.speedX;
        m.pulse += 0.03;

        // Reposiciona quando sai da tela
        if (m.y < -10) {
          m.y = this.height + 10;
          m.x = Math.random() * this.width;
        }

        const alpha = Math.max(0, m.opacity + Math.sin(m.pulse) * 0.15);
        this.ctx.fillStyle = `rgba(${m.color}, ${alpha})`;
        this.ctx.beginPath();
        this.ctx.arc(m.x, m.y, m.size, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.animId = requestAnimationFrame(() => this.loop());
    }
  },

  init(mode = 'classes') {
    document.body.classList.add('has-showcase');
    this.mode = mode;
    this.parseContent();
    this.bindElements();
    this.particles.init(this.elements.canvas);
    this.bindEvents();

    // Determina o item inicial pelo hash da URL ou pega o primeiro
    const hash = window.location.hash.replace('#', '').trim();
    const initialItem = this.items.find(it => it.id === hash) || this.items[0];

    if (initialItem) {
      this.selectItem(initialItem.id, false);
    }
  },

  parseContent() {
    this.items = [];
    const sections = document.querySelectorAll('section.subsection');
    
    sections.forEach(sec => {
      if (sec.id === 'intro') return;

      const id = sec.id;
      const card = sec.querySelector('.race-card, .hud-card') || sec;
      const nameEl = sec.querySelector('.race-name, .hud-card-title, h2, h3');
      const name = nameEl ? nameEl.textContent.trim() : id;
      
      const imgEl = sec.querySelector('.race-card-image img, img');
      const imgSrc = imgEl ? imgEl.getAttribute('src') : '';

      const badgeEl = sec.querySelector('.difficulty-badge, .badge');
      const badge = badgeEl ? badgeEl.textContent.trim() : '';

      // Extrai tópicos internos (Visão Geral, Habilidades, Mecânicas, etc)
      const topics = [];
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
            title: 'Visão Geral',
            contentHtml: wrapper.innerHTML
          });
        }

        // Tópicos subsequentes agrupados por cabeçalhos (H4)
        const h4Elements = body.querySelectorAll('h4');
        h4Elements.forEach(h4 => {
          let title = h4.textContent.trim().replace(/^[—–-\s]+|[—–-\s]+$/g, '').replace(/\s*[—–]\s*/g, ' - ');
          // Encurta nomes muito longos para caber na aba
          if (title.length > 25) {
            title = title.split(' - ')[0] || title.slice(0, 22) + '...';
          }
          const wrapper = document.createElement('div');
          let next = h4.nextElementSibling;
          
          while (next && next.tagName !== 'H4') {
            wrapper.appendChild(next.cloneNode(true));
            next = next.nextElementSibling;
          }

          if (wrapper.children.length > 0) {
            topics.push({
              title: title,
              contentHtml: wrapper.innerHTML
            });
          }
        });
      }

      // Se nenhum tópico específico foi extraído, usa o conteúdo completo
      if (topics.length === 0) {
        topics.push({
          title: 'Conteúdo',
          contentHtml: body ? body.innerHTML : sec.innerHTML
        });
      }

      this.items.push({
        id,
        name,
        imgSrc,
        badge,
        topics
      });
    });

    // Oculta as seções brutas originais para dar lugar ao palco interativo
    sections.forEach(sec => sec.style.display = 'none');
    const intro = document.getElementById('intro');
    if (intro) intro.style.display = 'none';
  },

  bindElements() {
    this.elements.heroArt = document.getElementById('showcase-hero-art');
    this.elements.bigName = document.getElementById('showcase-big-name');
    this.elements.ndBadge = document.getElementById('showcase-nd-badge');
    this.elements.topicTabs = document.getElementById('showcase-topic-tabs');
    this.elements.topicContent = document.getElementById('showcase-topic-content');
    this.elements.drawerBackdrop = document.getElementById('showcase-drawer-backdrop');
    this.elements.drawerList = document.getElementById('showcase-drawer-list');
    this.elements.drawerInput = document.getElementById('showcase-drawer-input');
    this.elements.hamburgerBtn = document.getElementById('showcase-hamburger-btn');
    this.elements.canvas = document.getElementById('showcase-dots-canvas');
  },

  bindEvents() {
    // Abrir gaveta
    if (this.elements.hamburgerBtn) {
      this.elements.hamburgerBtn.addEventListener('click', () => this.openDrawer());
    }

    // Fechar gaveta
    const closeBtn = document.getElementById('showcase-drawer-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeDrawer());
    }

    if (this.elements.drawerBackdrop) {
      this.elements.drawerBackdrop.addEventListener('click', (e) => {
        if (e.target === this.elements.drawerBackdrop) this.closeDrawer();
      });
    }

    // Filtro de busca na gaveta
    if (this.elements.drawerInput) {
      this.elements.drawerInput.addEventListener('input', (e) => {
        const q = (e.target.value || '').toLowerCase().trim();
        this.renderDrawerList(q);
      });
    }

    // Listener de tecla ESC para fechar gaveta
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeDrawer();
    });

    // Hash change na URL
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '').trim();
      if (h && h !== this.currentId) {
        this.selectItem(h, false);
      }
    });
  },

  openDrawer() {
    if (!this.elements.drawerBackdrop) return;
    this.renderDrawerList();
    this.elements.drawerBackdrop.classList.add('is-open');
    if (this.elements.drawerInput) {
      setTimeout(() => this.elements.drawerInput.focus(), 100);
    }
  },

  closeDrawer() {
    if (!this.elements.drawerBackdrop) return;
    this.elements.drawerBackdrop.classList.remove('is-open');
  },

  renderDrawerList(filter = '') {
    if (!this.elements.drawerList) return;
    this.elements.drawerList.innerHTML = '';

    const filtered = this.items.filter(it => 
      !filter || it.name.toLowerCase().includes(filter)
    );

    if (filtered.length === 0) {
      this.elements.drawerList.innerHTML = `<div style="padding: 16px; color: var(--text-muted); text-align: center;">Nenhum item encontrado.</div>`;
      return;
    }

    filtered.forEach(it => {
      const itemEl = document.createElement('div');
      itemEl.className = `showcase-drawer-item ${it.id === this.currentId ? 'active' : ''}`;
      itemEl.innerHTML = `
        <span class="showcase-drawer-name">${it.name}</span>
        ${it.badge ? `<span class="showcase-drawer-badge">${it.badge}</span>` : ''}
      `;
      itemEl.addEventListener('click', () => {
        this.selectItem(it.id);
        this.closeDrawer();
      });
      this.elements.drawerList.appendChild(itemEl);
    });
  },

  selectItem(id, updateHash = true) {
    const item = this.items.find(it => it.id === id);
    if (!item) return;

    this.currentId = id;
    this.activeTopicIndex = 0;

    if (updateHash) {
      window.location.hash = id;
    }

    // Animação de troca da imagem central
    if (this.elements.heroArt) {
      this.elements.heroArt.classList.add('is-switching');
      setTimeout(() => {
        if (item.imgSrc) {
          this.elements.heroArt.src = item.imgSrc;
          this.elements.heroArt.alt = item.name;
          this.elements.heroArt.style.display = 'block';
        } else {
          this.elements.heroArt.style.display = 'none';
        }
        this.elements.heroArt.classList.remove('is-switching');
      }, 150);
    }

    // Nome Gigante Sobreposto com Impacto
    if (this.elements.bigName) {
      this.elements.bigName.textContent = item.name;
      this.elements.bigName.classList.remove('name-slam');
      void this.elements.bigName.offsetWidth; // Força reflow para re-animar
      this.elements.bigName.classList.add('name-slam');
    }

    // Badge
    if (this.elements.ndBadge) {
      this.elements.ndBadge.textContent = item.badge || 'Oficial';
    }

    // Renderiza Abas de Tópicos
    this.renderTopicTabs(item);
  },

  renderTopicTabs(item) {
    if (!this.elements.topicTabs) return;
    this.elements.topicTabs.innerHTML = '';

    item.topics.forEach((topic, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `showcase-tab-btn ${index === this.activeTopicIndex ? 'active' : ''}`;
      btn.textContent = topic.title;
      btn.addEventListener('click', () => {
        this.activeTopicIndex = index;
        this.renderTopicTabs(item);
      });
      this.elements.topicTabs.appendChild(btn);
    });

    // Renderiza o conteúdo do tópico ativo
    this.renderActiveTopicContent(item);
  },

  renderActiveTopicContent(item) {
    if (!this.elements.topicContent) return;
    const activeTopic = item.topics[this.activeTopicIndex] || item.topics[0];
    
    if (activeTopic) {
      this.elements.topicContent.style.opacity = '0';
      this.elements.topicContent.style.transform = 'translateY(6px)';
      
      setTimeout(() => {
        this.elements.topicContent.innerHTML = activeTopic.contentHtml;
        this.elements.topicContent.scrollTop = 0;
        this.elements.topicContent.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        this.elements.topicContent.style.opacity = '1';
        this.elements.topicContent.style.transform = 'translateY(0)';
      }, 80);
    }
  }
};
