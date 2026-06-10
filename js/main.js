document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const toggle = document.getElementById('sidebar-toggle');

  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      toggle.textContent = sidebar.classList.contains('open') ? '✕' : '☰';
    });
    document.addEventListener('click', (e) => {
      if (window.innerWidth <= 768 && sidebar.classList.contains('open') && !sidebar.contains(e.target) && e.target !== toggle) {
        sidebar.classList.remove('open');
        toggle.textContent = '☰';
      }
    });
  }

  const sidebarLinks = document.querySelectorAll('.sidebar-link');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', function () {
      sidebarLinks.forEach(l => l.classList.remove('active'));
      this.classList.add('active');
      if (window.innerWidth <= 768 && sidebar) {
        sidebar.classList.remove('open');
        if (toggle) toggle.textContent = '☰';
      }
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
