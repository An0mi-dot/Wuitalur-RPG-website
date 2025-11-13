(function(){
  // Lightweight version popup script. Tries multiple parent paths for version.json/updates.json.
  function tryFetchJSON(name){
    const prefixes = ['/', './', './', './', '../', '../../', '../../../', '../../../../'];
    // try absolute then relative progressively
    return new Promise(async (resolve)=>{
      for(const p of prefixes){
        const candidate = (p.endsWith('/')? p: p + '/') + name;
        try{
          const res = await fetch(candidate, {cache:'no-store'});
          if(res && res.ok){ resolve(await res.json()); return; }
        }catch(e){}
      }
      resolve(null);
    });
  }

  function escapeHtml(s){ return s? String(s).replace(/[&<>\"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])) : ''; }

  function insertModalContent(updates){
    if(document.getElementById('vp-modal')) return;
    const modal = document.createElement('div'); modal.id='vp-modal'; modal.className='vp-modal';
    modal.innerHTML = `
      <div class="vp-overlay"></div>
      <div class="vp-content" role="dialog" aria-modal="true" aria-label="Informações e registro de alterações">
        <button class="vp-close" aria-label="Fechar">&times;</button>
        <div class="vp-body">
          <section class="vp-section page-info">
            <h2>Informações da Página</h2>
            <ul>
              <li><strong>Título:</strong> ${escapeHtml(document.title)}</li>
              <li><strong>Caminho:</strong> ${escapeHtml(location.pathname)}</li>
              <li><strong>Última modificação do documento:</strong> ${escapeHtml(document.lastModified)}</li>
            </ul>
          </section>
          <section class="vp-section updates-log">
            <h2>Registro de atualizações (site)</h2>
            <div class="vp-updates">${updates && Array.isArray(updates) && updates.length? updates.slice(0,20).map(u=>`<div class="vp-update"><div class="u-date">${escapeHtml(u.date)}</div><div class="u-msg">${escapeHtml(u.message)}</div></div>`).join(''): '<p>Sem informações de atualização.</p>'}</div>
          </section>
        </div>
      </div>`;
    document.body.appendChild(modal);
    document.body.style.overflow='hidden';
    modal.querySelector('.vp-close').addEventListener('click', ()=>{ modal.remove(); document.body.style.overflow='auto'; });
    modal.querySelector('.vp-overlay').addEventListener('click', ()=>{ modal.remove(); document.body.style.overflow='auto'; });
  }

  async function init(){
    // replace any element with id build-version and build-date
    const verBtn = document.getElementById('version-btn') || document.querySelector('.version-button') || null;
    if(verBtn){
      verBtn.classList.add('vp-version-btn');
      const dateEl = document.getElementById('build-date') || document.getElementById('version-date') || null;
      const ver = await tryFetchJSON('version.json');
      if(ver && ver.display) verBtn.textContent = ver.display;
      if(ver && ver.date && dateEl) dateEl.textContent = '- ' + ver.date;
      verBtn.addEventListener('click', async ()=>{
        const updates = await tryFetchJSON('updates.json') || [];
        insertModalContent(updates);
      });
    }
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
