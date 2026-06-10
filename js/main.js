document.addEventListener('DOMContentLoaded', () => {
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
