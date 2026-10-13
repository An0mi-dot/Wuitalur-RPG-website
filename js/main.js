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

document.addEventListener('DOMContentLoaded', () => {
  initUmbraTremble();
  highlightPV();
  const sidebar = document.getElementById('sidebar');
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
    btn.style.cssText = 'position:fixed;bottom:32px;right:32px;z-index:998;padding:12px 22px;border-radius:100px;border:1px solid rgba(124,58,237,0.3);background:rgba(18,18,24,0.9);color:#e4e4e7;font-size:0.8rem;font-weight:500;letter-spacing:0.3px;cursor:pointer;box-shadow:0 8px 28px rgba(0,0,0,0.4);display:none;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);transition:all 0.25s ease;';
    btn.addEventListener('click', () => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    btn.addEventListener('mouseenter', () => { btn.style.borderColor = '#7C3AED'; btn.style.background = 'rgba(30,30,40,0.95)'; btn.style.boxShadow = '0 8px 28px rgba(124,58,237,0.25)'; });
    btn.addEventListener('mouseleave', () => { btn.style.borderColor = 'rgba(124,58,237,0.3)'; btn.style.background = 'rgba(18,18,24,0.9)'; btn.style.boxShadow = '0 8px 28px rgba(0,0,0,0.4)'; });
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


