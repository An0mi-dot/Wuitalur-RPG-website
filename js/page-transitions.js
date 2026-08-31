/* ============================================================
   PAGE & TOPIC TRANSITIONS / RADIAL RIPPLE ENGINE
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
  // Standard Cross-fade arrival (for normal topics)
  else if (sessionStorage.getItem('standard_fade') === 'true') {
    sessionStorage.removeItem('standard_fade');
    const veil = document.createElement('div');
    veil.style.cssText = 'position:fixed;inset:0;background:#0c0c11;z-index:9999999;opacity:1;transition:opacity 0.4s ease-out;pointer-events:all;';
    document.documentElement.appendChild(veil);
    requestAnimationFrame(() => {
      setTimeout(() => {
        veil.style.opacity = '0';
        veil.style.pointerEvents = 'none';
        setTimeout(() => {
          if (veil.parentNode) veil.parentNode.removeChild(veil);
        }, 400);
      }, 50);
    });
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

  // Standard Transition Trigger
  function triggerStandardTransition(targetUrl) {
    let overlay = document.createElement('div');
    overlay.style.cssText = 'position:fixed;inset:0;background:#0c0c11;z-index:9999999;opacity:0;transition:opacity 0.2s ease-in;pointer-events:all;';
    document.body.appendChild(overlay);
    
    void overlay.offsetWidth;
    overlay.style.opacity = '1';

    let navigated = false;
    const navigate = () => {
      if (!navigated) {
        navigated = true;
        sessionStorage.setItem('standard_fade', 'true');
        window.location.href = targetUrl;
      }
    };
    
    const timer = setTimeout(navigate, 220);

    // Skip on any subsequent click
    const skipHandler = (evt) => {
      evt.preventDefault();
      evt.stopPropagation();
      clearTimeout(timer);
      navigate();
    };
    window.addEventListener('click', skipHandler, { once: true, capture: true });
  }

  // 3. TOPIC & PAGE TRANSITION HANDLERS
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

