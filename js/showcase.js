/* ============================================================
   WUITALUR RPG — CONTROLADOR SHOWCASE DE CLASSES E RAÇAS (V4)
   Canvas de Pontos da Mesa + Centro Dinâmico (Ilustração / Conteúdo)
   Painel Diagonal na Direita com Menu Hambúrguer e Nome Gigante
   Zero Emojis — Chinese Rocks sem Negrito
   ============================================================ */

const ShowcaseEngine = {
  mode: 'classes', // 'classes' ou 'races'
  items: [],
  currentId: null,
  activeTopicIndex: 0,
  
  // Elementos do DOM
  elements: {
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
    metaStatus: null,
    metaRole: null,
    canvas: null
  },

  // Motor de Partículas (Canvas de Pontos Ascendentes estilo Mesa Virtual)
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
      const count = 45;
      for (let i = 0; i < count; i++) {
        this.motes.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: Math.random() * 3.8 + 1.2,
          speedY: Math.random() * 0.95 + 0.35,
          speedX: (Math.random() - 0.5) * 0.45,
          opacity: Math.random() * 0.45 + 0.25,
          pulse: Math.random() * Math.PI * 2,
          // Roxo Astral (#7c3aed) ou Azul Cósmico (#38bdf8)
          color: Math.random() > 0.45 ? '124, 58, 237' : '56, 189, 248'
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
        m.pulse += 0.025;

        // Reposiciona na base quando sai pelo topo
        if (m.y < -12) {
          m.y = this.height + 12;
          m.x = Math.random() * this.width;
        }

        const alpha = Math.max(0.08, m.opacity + Math.sin(m.pulse) * 0.18);
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

      // Tópicos da classe/raça
      const topics = [];

      // Tópico 0: Ilustração (mostra a arte no centro)
      topics.push({
        isIllustration: true,
        title: '✦ Ilustração',
        fullTitle: 'Ilustração Oficial',
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
          if (title.length > 28) {
            title = title.split(' - ')[0] || title.slice(0, 26) + '...';
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

      // Se nenhum tópico foi extraído além da ilustração, adiciona o conteúdo bruto
      if (topics.length === 1) {
        topics.push({
          isIllustration: false,
          title: 'Visão Geral',
          fullTitle: 'Visão Geral',
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

    // Oculta as seções brutas originais para dar lugar ao showcase
    sections.forEach(sec => sec.style.display = 'none');
    const intro = document.getElementById('intro');
    if (intro) intro.style.display = 'none';
  },

  bindElements() {
    this.elements.artView = document.getElementById('showcase-art-view');
    this.elements.contentView = document.getElementById('showcase-content-view');
    this.elements.heroArt = document.getElementById('showcase-hero-art');
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
    this.elements.metaStatus = document.getElementById('showcase-meta-status');
    this.elements.metaRole = document.getElementById('showcase-meta-role');
    this.elements.canvas = document.getElementById('showcase-dots-canvas');

    if (this.elements.drawerHeading) {
      this.elements.drawerHeading.textContent = this.mode === 'classes' ? 'Todas as Classes' : 'Todas as Raças';
    }

    if (this.elements.topicCategory) {
      this.elements.topicCategory.textContent = this.mode === 'classes' ? 'Classe' : 'Raça';
    }
  },

  bindEvents() {
    // Abrir gaveta pelo botão hambúrguer no canto superior direito
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

    // Botão "Ver Arte" no cabeçalho do conteúdo
    if (this.elements.btnViewArt) {
      this.elements.btnViewArt.addEventListener('click', () => {
        this.selectTopic(0); // Tópico 0 é sempre a Ilustração
      });
    }

    // Filtro de busca na gaveta
    if (this.elements.drawerInput) {
      this.elements.drawerInput.addEventListener('input', (e) => {
        const q = (e.target.value || '').toLowerCase().trim();
        this.renderDrawerList(q);
      });
    }

    // Tecla ESC para fechar gaveta ou voltar para a arte
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.elements.drawerBackdrop && this.elements.drawerBackdrop.classList.contains('is-open')) {
          this.closeDrawer();
        } else if (this.activeTopicIndex !== 0) {
          this.selectTopic(0);
        }
      }
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
      this.elements.drawerInput.value = '';
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
      this.elements.drawerList.innerHTML = `<div style="padding: 18px; color: var(--text-muted); text-align: center; font-size: 0.88rem;">Nenhum resultado encontrado.</div>`;
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
    this.activeTopicIndex = 0; // Inicia sempre mostrando a Ilustração

    if (updateHash) {
      window.location.hash = id;
    }

    // Label do botão hambúrguer no canto superior direito
    if (this.elements.hamburgerLabel) {
      this.elements.hamburgerLabel.textContent = this.mode === 'classes' ? 'Trocar Classe' : 'Trocar Raça';
    }

    // Atualiza imagem central
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
      }, 140);
    }

    // Nome Gigante na Base do Painel Direito em Chinese Rocks
    if (this.elements.bigName) {
      this.elements.bigName.textContent = item.name;
      this.elements.bigName.classList.remove('name-slam');
      void this.elements.bigName.offsetWidth; // Força reflow
      this.elements.bigName.classList.add('name-slam');
    }

    // Metadados
    if (this.elements.ndBadge) {
      this.elements.ndBadge.textContent = item.badge || (this.mode === 'classes' ? 'ND 1' : 'Oficial');
    }
    if (this.elements.metaStatus) {
      this.elements.metaStatus.textContent = item.badge || 'Oficial';
    }
    if (this.elements.metaRole) {
      this.elements.metaRole.textContent = this.mode === 'classes' ? 'Combatente / Astral' : 'Linhagem Principal';
    }

    // Renderiza Lista Vertical de Tópicos na Esquerda
    this.renderTopicTabs(item);

    // Exibe a visualização inicial (Ilustração)
    this.applyTopicView(item);
  },

  renderTopicTabs(item) {
    if (!this.elements.topicTabs) return;
    this.elements.topicTabs.innerHTML = '';

    item.topics.forEach((topic, index) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = `showcase-tab-btn ${index === this.activeTopicIndex ? 'active' : ''}`;
      btn.textContent = topic.title;
      btn.title = topic.fullTitle || topic.title;
      btn.addEventListener('click', () => {
        this.selectTopic(index);
      });
      this.elements.topicTabs.appendChild(btn);
    });
  },

  selectTopic(index) {
    const item = this.items.find(it => it.id === this.currentId);
    if (!item) return;

    this.activeTopicIndex = index;

    // Atualiza classes ativas dos botões
    const buttons = this.elements.topicTabs.querySelectorAll('.showcase-tab-btn');
    buttons.forEach((b, idx) => {
      if (idx === index) b.classList.add('active');
      else b.classList.remove('active');
    });

    this.applyTopicView(item);
  },

  applyTopicView(item) {
    const activeTopic = item.topics[this.activeTopicIndex] || item.topics[0];
    if (!activeTopic) return;

    // Se for o Tópico 0 (Ilustração), sai do conteúdo e mostra a arte no centro
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

    // Se for qualquer outro tópico, SAI DA ILUSTRAÇÃO e MOSTRA O CONTEÚDO no centro!
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
        }, 60);
      }
    }
  }
};
