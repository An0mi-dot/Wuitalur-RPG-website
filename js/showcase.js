/* ============================================================
   WUITALUR RPG — CONTROLADOR SHOWCASE DE CLASSES E RAÇAS (V5)
   - Menu Hambúrguer no Topo Esquerdo
   - Navegação por Tópicos na Esquerda
   - Centro Dinâmico (Alterna entre Ilustração e Conteúdo com fade)
   - Painel Direito em Azul Cobalto com Corte Diagonal e Listras ///
   - Nome Gigante Sobreposto na Divisa
   - Zero Emojis — Chinese Rocks sem Negrito
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
    bladeNd: null,
    bladeRole: null,
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
      const count = 48;
      for (let i = 0; i < count; i++) {
        this.motes.push({
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: Math.random() * 3.6 + 1.2,
          speedY: Math.random() * 0.9 + 0.35,
          speedX: (Math.random() - 0.5) * 0.4,
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
    // Partículas/bolinhas no fundo desativadas conforme pedido do usuário
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
    this.elements.bladeNd = document.getElementById('showcase-blade-nd');
    this.elements.ndTier = document.getElementById('showcase-nd-tier');
    this.elements.ndGauge = document.getElementById('showcase-nd-gauge');
    this.elements.canvas = document.getElementById('showcase-dots-canvas');

    if (this.elements.drawerHeading) {
      this.elements.drawerHeading.textContent = this.mode === 'classes' ? 'Todas as Classes' : 'Todas as Raças';
    }

    if (this.elements.topicCategory) {
      this.elements.topicCategory.textContent = this.mode === 'classes' ? 'Classe' : 'Raça';
    }
  },

  bindEvents() {
    // Abrir gaveta pelo botão hambúrguer no topo da esquerda
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
        this.selectTopic(0); // Tópico 0 é a Ilustração
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
      const ndMeta = this.getNDMeta(it.badge);
      const itemEl = document.createElement('div');
      itemEl.className = `showcase-drawer-item ${it.id === this.currentId ? 'active' : ''}`;
      itemEl.innerHTML = `
        <span class="showcase-drawer-name">${it.name}</span>
        ${it.badge ? `<span class="showcase-drawer-badge" style="color: ${ndMeta.color}; border: 1px solid ${ndMeta.color}60; background: ${ndMeta.color}18;">${it.badge}</span>` : ''}
      `;
      itemEl.addEventListener('click', () => {
        this.selectItem(it.id);
        this.closeDrawer();
      });
      this.elements.drawerList.appendChild(itemEl);
    });
  },

  // Escala de cores do ND: Verde (ND1) -> Amarelo (ND2) -> Laranja (ND3) -> Vermelho (ND4+)
  getNDMeta(badgeText) {
    let ndNum = 1;
    const match = (badgeText || '').match(/ND\s*(\d+)/i);
    if (match) {
      ndNum = parseInt(match[1], 10);
    }

    let color = '#4ade80'; // Verde
    let tier = 'Iniciante';
    let glow = 'rgba(74, 222, 128, 0.7)';

    if (ndNum === 2) {
      color = '#facc15'; // Amarelo / Dourado
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
    this.activeTopicIndex = 0; // Começa sempre com a Ilustração

    if (updateHash) {
      window.location.hash = id;
    }

    // Label do botão hambúrguer no topo da esquerda
    if (this.elements.hamburgerLabel) {
      this.elements.hamburgerLabel.textContent = this.mode === 'classes' ? 'Classes' : 'Raças';
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

    // Nome Gigante na Divisa em Chinese Rocks
    if (this.elements.bigName) {
      this.elements.bigName.textContent = item.name;
      this.elements.bigName.classList.remove('name-slam');
      void this.elements.bigName.offsetWidth; // Força reflow
      this.elements.bigName.classList.add('name-slam');
    }

    // Metadados e Cores do ND (Escala de Verde a Vermelho)
    const badgeText = item.badge || (this.mode === 'classes' ? 'ND 1' : 'Oficial');
    const ndMeta = this.getNDMeta(badgeText);

    // ND Grande na lâmina direita
    if (this.elements.bladeNd) {
      this.elements.bladeNd.textContent = `ND ${ndMeta.ndNum}`;
      this.elements.bladeNd.style.color = ndMeta.color;
      this.elements.bladeNd.style.textShadow = `0 0 18px ${ndMeta.glow}, 2px 2px 0 #000000`;
    }

    // Tier de Dificuldade
    if (this.elements.ndTier) {
      this.elements.ndTier.textContent = ndMeta.tier;
      this.elements.ndTier.style.color = ndMeta.color;
      this.elements.ndTier.style.borderColor = ndMeta.color;
      this.elements.ndTier.style.background = `${ndMeta.color}25`;
      this.elements.ndTier.style.boxShadow = `0 0 12px ${ndMeta.glow}`;
    }

    // Borda do bloco de ND
    const ndBlock = document.querySelector('.showcase-nd-block');
    if (ndBlock) {
      ndBlock.style.borderLeftColor = ndMeta.color;
    }

    // Atualiza Gauge de Pips (Nível de Ameaça com cores)
    if (this.elements.ndGauge) {
      const pips = this.elements.ndGauge.querySelectorAll('.gauge-pip');
      pips.forEach((pip, idx) => {
        if (idx < ndMeta.ndNum) {
          pip.classList.add('active');
          pip.style.background = ndMeta.color;
          pip.style.borderColor = ndMeta.color;
          pip.style.boxShadow = `0 0 10px ${ndMeta.glow}`;
        } else {
          pip.classList.remove('active');
          pip.style.background = '';
          pip.style.borderColor = '';
          pip.style.boxShadow = '';
        }
      });
    }

    // Atualiza badge de ND no cabeçalho do conteúdo
    if (this.elements.ndBadge) {
      this.elements.ndBadge.textContent = `ND ${ndMeta.ndNum}`;
      this.elements.ndBadge.style.color = ndMeta.color;
      this.elements.ndBadge.style.borderColor = ndMeta.color;
      this.elements.ndBadge.style.background = `${ndMeta.color}20`;
      this.elements.ndBadge.style.boxShadow = `0 0 8px ${ndMeta.glow}`;
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
        }, 50);
      }
    }
  }
};
