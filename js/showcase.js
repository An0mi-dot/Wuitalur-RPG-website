/* ============================================================
   WUITALUR RPG — CONTROLADOR SHOWCASE DE CLASSES E RAÇAS (V6)
   - Menu Hambúrguer no Topo Esquerdo
   - Navegação por Tópicos na Esquerda
   - Palco Central com Hero Spotlight 2.5D Parallax (Estilo Deadlock)
   - 3 Camadas 3D: Fundo Geométrico / Personagem / Tipografia e Badges
   - Sombra Suave Direcional e Rotação Dinâmica via mousemove (rAF)
   - Paleta Urbana Streetwear: #121114, #1B191F, #9B51E0
   ============================================================ */

const ShowcaseEngine = {
  mode: 'classes', // 'classes' ou 'races'
  items: [],
  currentId: null,
  activeTopicIndex: 0,
  
  // Dicionário de Conceitos / Tags para cada Classe
  classConcepts: {
    consagrados: ['ESTRATEGISTA', 'SUPORTE', 'CONTROLADOR'],
    compactador: ['IMPACTO', 'DANO BRUTO', 'CONTROLE'],
    bestial: ['FERAL', 'SOBREVIVÊNCIA', 'DANO'],
    'cavaleiros-paladium': ['BLINDAGEM', 'DEFESA', 'LIDERANÇA'],
    eterno: ['RESISTÊNCIA', 'IMORTAL', 'VITALIDADE'],
    furtassaltantes: ['FURTIVO', 'AGILIDADE', 'CRÍTICO'],
    pistoleiro: ['DISTÂNCIA', 'PRECISÃO', 'CADÊNCIA'],
    rastejantes: ['SOMBRAS', 'DEBUFF', 'ASSUSTADOR'],
    anomalo: ['MUTÁVEL', 'CAOS', 'CONTROLE'],
    'atirador-espectral': ['DISTÂNCIA', 'ESPÍRITO', 'PERFURAÇÃO'],
    lampinario: ['ILUMINAÇÃO', 'SUPORTE', 'CANALIZADOR'],
    protegidos: ['DEFESA', 'ESCUDO', 'GUARDIÃO'],
    sobrevivente: ['TENACIDADE', 'VERSÁTIL', 'IMPROVISO']
  },

  // Funções Táticas / Dossiês de cada Classe
  classRoles: {
    consagrados: 'ESTRATEGISTA SUPORTE',
    compactador: 'FORÇA BRUTA & IMPACTO',
    bestial: 'PREDADOR FERAL',
    'cavaleiros-paladium': 'DEFENSOR BLINDADO',
    eterno: 'SOBREVIVENTE IMORTAL',
    furtassaltantes: 'ESPECIALISTA EM EMBOSCADA',
    pistoleiro: 'ATIRADOR DE PRECISÃO',
    rastejantes: 'HORROR DAS SOMBRAS',
    anomalo: 'CANALIZADOR DO CAOS',
    'atirador-espectral': 'FRANCO-ATIRADOR ASTRAL',
    lampinario: 'CONJURADOR SOLAR',
    protegidos: 'GUARDIÃO RELICÁRIO',
    sobrevivente: 'TENACIDADE URBANA'
  },

  // Elementos do DOM
  elements: {
    artView: null,
    contentView: null,
    heroArt: null,
    bigName: null,
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
        <filter id="paper-warp" x="-10%" y="-10%" width="120%" height="120%" filterUnits="objectBoundingBox">
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
    this.elements.spotlightViewport = document.getElementById('spotlight-viewport');
    this.elements.spotlightStage = document.getElementById('spotlight-stage');
    this.elements.spotlightTitle = document.getElementById('showcase-spotlight-title');
    this.elements.spotlightTags = document.getElementById('showcase-spotlight-tags');
    this.elements.spotlightCoords = document.getElementById('spotlight-coords');
    this.elements.spotlightNdIndicator = document.getElementById('spotlight-nd-indicator');
    this.elements.spotlightRoleIndicator = document.getElementById('spotlight-role-indicator');
    this.elements.spotlightBack = document.querySelector('.spotlight-layer-back');
    this.elements.spotlightChar = document.querySelector('.spotlight-layer-character');
    this.elements.spotlightFg = document.querySelector('.spotlight-layer-foreground');

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

    // Hash change na URL (navegação pelo histórico do navegador)
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '').trim();
      if (hash && hash !== this.currentId) {
        this.selectItem(hash, false);
      }
    });
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
    this.activeTopicIndex = 0; // Começa sempre com a Ilustração

    if (updateHash) {
      window.location.hash = id;
    }

    // Label do botão hambúrguer no topo da esquerda
    if (this.elements.hamburgerLabel) {
      this.elements.hamburgerLabel.textContent = this.mode === 'classes' ? 'Classes' : 'Raças';
    }

    // Atualiza imagem central recortada
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

    // Nome na Camada 3 do Hero Spotlight (suporta fonte especial para Consagrados)
    if (this.elements.spotlightTitle) {
      this.elements.spotlightTitle.textContent = item.name;
      this.elements.spotlightTitle.setAttribute('data-class', item.id);
      this.elements.spotlightTitle.className = 'spotlight-class-title font-class-' + item.id;
    }

    // Tags de Conceito na Camada 3 (Badges estilo fita adesiva com tilt)
    if (this.elements.spotlightTags) {
      const tags = this.classConcepts[item.id] || ['COMBATE', 'TÁTICA', 'MESTRIA'];
      const styles = ['tag-tape-purple', 'tag-tape-dark', 'tag-tape-hazard'];
      this.elements.spotlightTags.innerHTML = tags.map((t, idx) => `
        <span class="spotlight-tag ${styles[idx % styles.length]}">${t}</span>
      `).join('');
    }

    // Sincroniza bigName legado se presente no DOM
    if (this.elements.bigName) {
      this.elements.bigName.textContent = item.name;
      this.elements.bigName.setAttribute('data-class', item.id);
      this.elements.bigName.className = 'showcase-big-name font-class-' + item.id;
    }

    // Metadados e Cores do ND
    const badgeText = item.badge || (this.mode === 'classes' ? 'ND 1' : 'Base');
    const ndMeta = this.getNDMeta(badgeText);

    // Indicador técnico de ND e Função Tática no TOPO do Hero Spotlight
    if (this.elements.spotlightNdIndicator) {
      this.elements.spotlightNdIndicator.textContent = `ND ${ndMeta.ndNum} // ${ndMeta.tier.toUpperCase()}`;
      this.elements.spotlightNdIndicator.style.color = ndMeta.color;
    }
    if (this.elements.spotlightRoleIndicator) {
      const role = this.classRoles[item.id] || (this.mode === 'classes' ? 'DOSSIÊ TÁTICO' : 'HERANÇA RACIAL');
      this.elements.spotlightRoleIndicator.textContent = role;
    }

    // ND na lâmina direita
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

    // Marcadores da régua (gauge pips)
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

    // Atualiza badge no modal de conteúdo
    if (this.elements.ndBadge) {
      this.elements.ndBadge.textContent = badgeText;
      this.elements.ndBadge.style.borderColor = ndMeta.color;
      this.elements.ndBadge.style.color = ndMeta.color;
    }

    // Reconstrói a lista de tópicos na coluna esquerda
    this.renderTopicsNav(item);

    // Exibe o tópico inicial (Ilustração no Spotlight 2.5D)
    this.applyTopicView(item);
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
