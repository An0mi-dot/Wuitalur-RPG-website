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

  // Floating Índice button for classes page
  const classIndex = document.querySelectorAll('.section-heading')[1];
  if (classIndex) {
    const btn = document.createElement('button');
    btn.textContent = '↑ Índice';
    btn.id = 'floating-index-btn';
    btn.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:998;padding:10px 18px;border-radius:8px;border:1px solid var(--border-accent);background:var(--bg-elevated);color:var(--text-primary);font-size:0.85rem;cursor:pointer;box-shadow:0 4px 16px rgba(0,0,0,0.3);display:none;transition:opacity 0.2s;';
    btn.addEventListener('click', () => {
      document.querySelector('.section-heading h2')?.closest('.section-heading')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    document.body.appendChild(btn);

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const rect = classIndex.getBoundingClientRect();
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
