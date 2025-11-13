(function(){
  // Cria retângulos animados por trás da seleção de texto.
  // Compatível com múltiplas linhas (gera um retângulo por ClientRect).
  let highlights = [];

  function clearHighlights(){
    if(!highlights || !highlights.length) return;
    highlights.forEach(h=>{
      h.classList.remove('sel-rect--visible');
      // remover após transição
      h.addEventListener('transitionend', ()=>{ if(h.parentNode) h.parentNode.removeChild(h); }, {once:true});
    });
    highlights = [];
  }

  function createHighlights(){
    clearHighlights();
    const sel = document.getSelection();
    if(!sel || sel.isCollapsed) return;

    for(let rIdx=0; rIdx<sel.rangeCount; rIdx++){
      const range = sel.getRangeAt(rIdx);
      const rects = range.getClientRects();
      for(const r of rects){
        // ignorar retângulos muito pequenos
        if(r.width < 2 || r.height < 2) continue;
        const div = document.createElement('div');
        div.className = 'sel-rect';
        // posicionamento relativo à viewport + scroll
        const scrollX = window.scrollX || window.pageXOffset || document.documentElement.scrollLeft;
        const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        // expandir levemente a caixa para cobrir espaçamentos e dar visual mais robusto
        const padY = Math.min(12, Math.max(4, Math.round(r.height * 0.12)));
        const padX = Math.min(8, Math.max(2, Math.round(r.width * 0.02)));
        div.style.left = (r.left + scrollX - padX) + 'px';
        div.style.top = (r.top + scrollY - Math.round(padY/2)) + 'px';
        div.style.width = Math.max(1, r.width + (padX*2)) + 'px';
        div.style.height = Math.max(1, r.height + padY) + 'px';
        document.body.appendChild(div);
        // forçar reflow + adicionar classe visível para animar
        requestAnimationFrame(()=> div.classList.add('sel-rect--visible'));
        highlights.push(div);
      }
    }
  }

  let lastSelectionString = '';
  function updateSelection(){
    try{
      const sel = document.getSelection();
      const s = sel ? sel.toString() : '';
      if(!s){ clearHighlights(); lastSelectionString = ''; return; }
      if(s === lastSelectionString){ return; }
      lastSelectionString = s;
      createHighlights();
    }catch(e){ clearHighlights(); }
  }

  document.addEventListener('selectionchange', updateSelection);
  window.addEventListener('resize', updateSelection);
  window.addEventListener('scroll', ()=>{ /* reposicionar levemente */ updateSelection(); });

  // remover quando a página perde foco (evita retângulos presos)
  window.addEventListener('blur', clearHighlights);

  // API pública (para testes via console)
  window.__WUI_clearSelectionHighlights = clearHighlights;
})();
