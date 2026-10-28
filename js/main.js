// Per-letter trembling for Umbra text
function initUmbraTremble() {
  document.querySelectorAll('.elem-umbra').forEach(el => {
    if (el.dataset.umbraSplit) return;
    el.dataset.umbraSplit = '1';
    const text = el.textContent;
    if (!text) return;
    el.textContent = '';
    [...text].forEach((char, i) => {
      const span = document.createElement('span');
      span.className = 'umbra-char';
      span.textContent = char;
      span.style.animationDelay = `${(i * 0.04).toFixed(3)}s`;
      el.appendChild(span);
    });
  });
}

function highlightPV() {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        if (!node.textContent || !node.textContent.includes('PV')) return NodeFilter.FILTER_REJECT;
        var parent = node.parentElement;
        if (!parent || ['SCRIPT','STYLE','TEXTAREA'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('.pv-stat, h1, h2, h3, h4, h5, .gloss-term, .section-heading')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );
  var nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  nodes.forEach(function(node) {
    var text = node.textContent;
    var frag = document.createDocumentFragment();
    var lastIdx = 0;
    var re = /(\d+\s*)?PV/g;
    var match;
    while ((match = re.exec(text)) !== null) {
      if (match.index > lastIdx) frag.appendChild(document.createTextNode(text.slice(lastIdx, match.index)));
      var span = document.createElement('span');
      span.className = 'pv-stat';
      span.textContent = match[0];
      frag.appendChild(span);
      lastIdx = re.lastIndex;
    }
    if (lastIdx < text.length) frag.appendChild(document.createTextNode(text.slice(lastIdx)));
    node.parentNode.replaceChild(frag, node);
  });
}

function autoHighlightDice() {
  const diceRe = /\b[1-9]\d*d(?:100|20|12|10|8|6|4)(?:\s*[+-]\s*(?:\d+|(?:(?:Mod(?:ificador)?(?:\s+de)?\s+)?(?:Força|Destreza|Saúde|Intelecto|Sentidos|Cosmo|FOR|DES|DEX|SAU|INT|SEN|COS|FAMA|RF|RE|PV|EA|SAN|FR)(?![a-zA-Z\u00C0-\u017F])|Mod(?:ificador)?(?![a-zA-Z\u00C0-\u017F]))))?(?![a-zA-Z0-9\u00C0-\u017F])/gi;

  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_TEXT,
    {
      acceptNode: function(node) {
        if (!node.textContent || !node.textContent.match(diceRe)) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent || ['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT', 'CODE', 'PRE', 'BUTTON'].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest('.dice, .attr-dice-badge, .dice-roller, .dice-btn, .dice-result, h1, h2, h3, .topic-crooked, .page-brand-title')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);

  nodes.forEach(function(node) {
    const text = node.textContent;
    const frag = document.createDocumentFragment();
    let lastIdx = 0;
    let match;
    diceRe.lastIndex = 0;

    while ((match = diceRe.exec(text)) !== null) {
      if (match.index > lastIdx) {
        frag.appendChild(document.createTextNode(text.slice(lastIdx, match.index)));
      }
      const span = document.createElement('span');
      span.className = 'dice';
      span.textContent = match[0];
      frag.appendChild(span);
      lastIdx = diceRe.lastIndex;
    }

    if (lastIdx < text.length) {
      frag.appendChild(document.createTextNode(text.slice(lastIdx)));
    }
    if (node.parentNode) {
      node.parentNode.replaceChild(frag, node);
    }
  });
}


document.addEventListener('DOMContentLoaded', () => {
  initUmbraTremble();
  highlightPV();
  autoHighlightDice();
  const sidebar = document.getElementById('sidebar');
  initSidebarSearch(sidebar);
  const toggle = document.getElementById('sidebar-toggle');

  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'sidebar-overlay';
  overlay.id = 'sidebar-overlay';
  document.body.appendChild(overlay);

  function closeSidebar() {
    if (!sidebar) return;
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    if (toggle) toggle.textContent = '☰';
  }

  function openSidebar() {
    if (!sidebar) return;
    sidebar.classList.add('open');
    overlay.classList.add('open');
    if (toggle) toggle.textContent = '✕';
  }

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      if (sidebar.classList.contains('open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });
    overlay.addEventListener('click', closeSidebar);
  }

  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function () {
      sidebarLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      if (window.innerWidth <= 768) closeSidebar();
    });
  });

  // Wiki dropdown menu
  const wikiBtn = document.getElementById('wiki-menu-btn');
  const wikiDropdown = document.getElementById('wiki-menu-dropdown');
  if (wikiBtn && wikiDropdown) {
    wikiBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      wikiDropdown.classList.toggle('open');
    });
    document.addEventListener('click', () => wikiDropdown.classList.remove('open'));
    wikiDropdown.addEventListener('click', (e) => e.stopPropagation());
  }

  // RE Calculator
  const reInputs = ['re-re', 're-pvs', 're-def'];
  const reResult = document.getElementById('re-result');
  if (reResult) {
    reInputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', calcRE);
    });
    function calcRE() {
      const re = parseFloat(document.getElementById('re-re').value) || 0;
      const pvs = parseFloat(document.getElementById('re-pvs').value) || 1;
      const def = parseFloat(document.getElementById('re-def').value) || 0;
      const deFe = (re * Math.sqrt(pvs)) / 8 + def;
      reResult.textContent = `DEFe = ${deFe.toFixed(2)}`;
    }
    calcRE();
  }

  // Floating Índice button for classes/races page
  const raceNav = document.getElementById('race-nav');
  const classIndex = document.querySelectorAll('.section-heading')[1];
  const target = raceNav || classIndex;
  if (target) {
    const btn = document.createElement('button');
    btn.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:6px"><polyline points="18 15 12 9 6 15"/></svg>Índice';
    btn.id = 'floating-index-btn';
    btn.style.cssText = 'position:fixed;bottom:32px;right:32px;z-index:998;padding:12px 22px;border-radius:100px;border:1.5px solid var(--border-accent, #604a8b);background:rgba(21,15,30,0.95);box-shadow:3px 3px 0px #0c0812;color:#e4e4e7;font-size:0.8rem;font-weight:500;letter-spacing:0.3px;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,0.4);display:none;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);transition:all 0.25s ease;';
    btn.addEventListener('click', () => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    btn.addEventListener('mouseenter', () => { btn.style.borderColor = '#8267b5'; btn.style.background = 'rgba(34,24,46,0.98)'; btn.style.boxShadow = '4px 4px 0px #8267b5'; });
    btn.addEventListener('mouseleave', () => { btn.style.borderColor = '#604a8b'; btn.style.background = 'rgba(21,15,30,0.95)'; btn.style.boxShadow = '3px 3px 0px #0c0812'; });
    document.body.appendChild(btn);

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = target.getBoundingClientRect();
          btn.style.display = rect.top < -100 ? 'block' : 'none';
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  // RF Calculator
  const rfInputs = ['rf-rf', 'rf-pvs'];
  const rfResult = document.getElementById('rf-result');
  if (rfResult) {
    rfInputs.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('input', calcRF);
    });
    function calcRF() {
      const rf = parseFloat(document.getElementById('rf-rf').value) || 0;
      const pvs = parseFloat(document.getElementById('rf-pvs').value) || 1;
      const def = (rf * Math.pow(pvs, 0.6)) / 6;
      rfResult.textContent = `DEF = ${def.toFixed(2)}`;
    }
    calcRF();
  }
});

/* ============================================================
   PAGE E TOPIC TRANSITIONS / RADIAL RIPPLE ENGINE
   ============================================================ */
(function () {
  'use strict';

  // Helper to stagger cards on load dynamically if needed
  const setupEntranceAnimations = () => {
    document.querySelectorAll('.home-card, .attr-box-card, .per-card, .step-card, .fdm-card').forEach((card, i) => {
      if(!card.style.animationDelay) {
        card.style.animationDelay = (i * 0.05) + 's';
      }
    });
  };

  // 1. ARRIVAL FADE HANDLER (Upon entering Fios do Medo)
  if (sessionStorage.getItem('fdm_intro_fade') === 'true') {
    sessionStorage.removeItem('fdm_intro_fade');

    const veil = document.createElement('div');
    veil.id = 'fdm-arrival-veil';
    veil.style.cssText = 'position:fixed;inset:0;background:radial-gradient(circle at center, rgba(255,17,51,0.95) 0%, rgba(144,0,24,0.95) 40%, rgba(8,8,12,0.98) 100%);z-index:9999999;opacity:1;transition:opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1);pointer-events:all;';
    document.documentElement.appendChild(veil);

    const removeVeil = () => {
      veil.style.opacity = '0';
      veil.style.pointerEvents = 'none';
      setTimeout(() => {
        if (veil.parentNode) veil.parentNode.removeChild(veil);
      }, 1200);
    };

    requestAnimationFrame(() => {
      setTimeout(removeVeil, 100);
    });

    window.addEventListener('click', () => {
      if (veil.parentNode) {
        veil.style.transition = 'opacity 0.15s ease';
        removeVeil();
      }
    }, { once: true, capture: true });
  } 
    setupEntranceAnimations();

  // 2. CLICK-ORIGIN RADIAL EXPANSION (When clicking to enter Fios do Medo)
  function triggerRadialExpansion(e, targetUrl) {
    const x = e ? e.clientX : window.innerWidth / 2;
    const y = e ? e.clientY : window.innerHeight / 2;

    let overlay = document.getElementById('radial-transition-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'radial-transition-overlay';
      document.body.appendChild(overlay);
    }

    overlay.style.setProperty('--click-x', x + 'px');
    overlay.style.setProperty('--click-y', y + 'px');
    overlay.classList.remove('expanding');

    void overlay.offsetWidth; // Force reflow
    overlay.classList.add('expanding');

    let navigated = false;
    const navigate = () => {
      if (!navigated) {
        navigated = true;
        sessionStorage.setItem('fdm_intro_fade', 'true');
        window.location.href = targetUrl;
      }
    };

    // Slower, more impactful expansion (600ms)
    const timer = setTimeout(navigate, 600);

    // Skip on any subsequent click
    const skipHandler = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      clearTimeout(timer);
      navigate();
    };
    window.addEventListener('click', skipHandler, { once: true, capture: true });
  }

  // Standard Transition Trigger (Slide instead of fade)
  function triggerStandardTransition(targetUrl) {
    const mainWrapper = document.querySelector('.main-wrapper') || document.querySelector('.app-layout');
    if (mainWrapper) {
      mainWrapper.classList.add('page-exit-left');
    }
    
    let navigated = false;
    const navigate = () => {
      if (!navigated) {
        navigated = true;
        window.location.href = targetUrl;
      }
    };
    
    const timer = setTimeout(navigate, 130);

    const skipHandler = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      clearTimeout(timer);
      navigate();
    };
    window.addEventListener('click', skipHandler, { once: true, capture: true });
  }

  // 3. TOPIC E PAGE TRANSITION HANDLERS
  document.addEventListener('DOMContentLoaded', () => {
    const isInsideFdm = window.location.pathname.includes('fios-do-medo');

    document.querySelectorAll('a').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('javascript:') || link.target === '_blank') return;

      const isFdmTarget = href.includes('fios-do-medo');

      // Entering FDM from outside -> Radial Expansion
      if (!isInsideFdm && isFdmTarget) {
        link.addEventListener('click', function (e) {
          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
          e.preventDefault();
          triggerRadialExpansion(e, this.href);
        });
        return;
      }

      // Smooth topic transition for regular navigation
      if (link.classList.contains('sidebar-link') || link.classList.contains('home-card') || link.classList.contains('sidebar-back-btn') || link.classList.contains('wiki-dropdown-item') || (isInsideFdm && !isFdmTarget)) {
        link.addEventListener('click', function (e) {
          if (e.metaKey || e.ctrlKey || e.shiftKey) return;
          if (link.hostname && link.hostname !== window.location.hostname) return;

          e.preventDefault();
          triggerStandardTransition(this.href);
        });
      }
    });
  });
})();




function initSidebarSearch(sidebar) {
  if (!sidebar) return;
  const sidebarNav = sidebar.querySelector('.sidebar-nav');
  if (!sidebarNav) return;

  let searchWrap = sidebar.querySelector('.sidebar-search-wrap');
  if (!searchWrap) {
    searchWrap = document.createElement('div');
    searchWrap.className = 'sidebar-search-wrap';
    searchWrap.innerHTML = '<input type="text" class="sidebar-search-input" id="sidebar-search-input" placeholder="Buscar página..." aria-label="Buscar página">';
    sidebar.insertBefore(searchWrap, sidebarNav);
  }

  const searchInput = searchWrap.querySelector('#sidebar-search-input');
  if (!searchInput) return;

  let emptyMsg = sidebarNav.querySelector('.sidebar-empty-msg');
  if (!emptyMsg) {
    emptyMsg = document.createElement('div');
    emptyMsg.className = 'sidebar-empty-msg';
    emptyMsg.textContent = 'Nenhuma página encontrada';
    emptyMsg.style.display = 'none';
    sidebarNav.appendChild(emptyMsg);
  }

  function normalize(str) {
    return (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim();
  }

  searchInput.addEventListener('input', (e) => {
    const query = normalize(e.target.value);
    const links = sidebarNav.querySelectorAll('.sidebar-link');
    let visibleCount = 0;

    links.forEach(link => {
      const linkText = normalize(link.textContent);
      const linkHref = normalize(link.getAttribute('href') || '');
      const match = !query || linkText.includes(query) || linkHref.includes(query);

      link.style.display = match ? 'flex' : 'none';
      if (match) visibleCount++;
    });

    const sections = sidebarNav.querySelectorAll('.sidebar-section-title');
    sections.forEach(title => {
      if (!query) {
        title.style.display = 'block';
        return;
      }
      let next = title.nextElementSibling;
      let hasVisible = false;
      while (next && !next.classList.contains('sidebar-section-title')) {
        if (next.classList.contains('sidebar-link') && next.style.display !== 'none') {
          hasVisible = true;
          break;
        }
        next = next.nextElementSibling;
      }
      title.style.display = hasVisible ? 'block' : 'none';
    });

    if (emptyMsg) {
      emptyMsg.style.display = (visibleCount === 0 && query) ? 'block' : 'none';
    }
  });
}
