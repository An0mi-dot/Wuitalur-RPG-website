document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'wuitar_wiki_characters';
  let characters = [];
  let currentId = null;
  let editingId = null;
  let currentTopic = '';

  const hubEl = document.getElementById('universe-hub');
  const topicEl = document.getElementById('universe-topic');
  const charMiniList = document.getElementById('char-mini-list');
  const charCount = document.getElementById('char-count');

  const PWD_HASH_KEY = 'wuitar_wiki_pwd';

  async function hashSHA256(str) {
    const enc = new TextEncoder().encode(str);
    const buf = await crypto.subtle.digest('SHA-256', enc);
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }

  async function initPassword() {
    if (!localStorage.getItem(PWD_HASH_KEY)) {
      const h = await hashSHA256('Wu2202');
      localStorage.setItem(PWD_HASH_KEY, h);
    }
  }

  async function requirePassword() {
    const pwd = prompt('Senha necessária:');
    if (!pwd) return false;
    return (await hashSHA256(pwd)) === localStorage.getItem(PWD_HASH_KEY);
  }

  const SEED_KEY = 'wuitar_wiki_seeded_v3';

  function seedDefaults() {
    if (localStorage.getItem(SEED_KEY)) return;
    const seedMap = new Map(characters.map(c => [c.id, c]));
    const defaults = [
      { id:'seed01',image:'',name:'Elleonor Capellari',pvs:'---',sanidade:'---',fullName:'Elleonor Capellari',age:'22 anos',race:'Akivus',className:'Consagrado',affiliation:'Floricultura da avó Marta',status:'Vivo',summary:'Uma jovem Akivus que equilibra o trabalho na floricultura da avó com suas atividades noturnas como vigilante, usando as habilidades herdadas de sua família para combater vilões.',origin:'Elleonor cresceu com uma vida tranquila em relação à família e condição financeira. Seus pais eram presentes: sua mãe, Sofia Capellari, dona de uma empresa super famosa de sua cidade; e seu pai, Fernandes Capellari, um grande professor de boxe. Assim que soube da existência de Lock, Elleonor decidiu seguir seus passos e aprender com seu pai a lutar para combater vilões e melhorar as habilidades que herdou de sua família, com esperanças de um dia ser tão forte e admirada como ela admirava Lock.',events:'Perdeu um de seus chifres em uma missão como heroína — algo que sua família via como sinal de fraqueza e inutilidade. Melther fez um novo chifre para ela, e ela manteve isso em segredo o máximo possível. Após a perda de Melther, como símbolo de gratidão eterna, permaneceu vinhas com flores de violeta em volta de seu chifre recém-concertado. Namorou dos 16 aos 18 anos com Henry (também Akivus), que terminou após ele e seus amigos tentarem intimidar seu irmão caçula Theo — Elleonor quebrou um dos chifres dele como aviso.',currentSituation:'Trabalha na floricultura de sua avó Marta durante o dia, ajudando com o trabalho pesado. À noite, sai pela cidade não apenas para pichar paredes, mas para descobrir facções e prender vilões.',appearance:'1,82m de altura, 76kg. Akivus com chifres — um deles foi remendado por Melther e adornado com vinhas e flores de violeta em homenagem ao amigo perdido. Suas cores favoritas (roxo e azul) transparecem em seu visual.',behavior:'Curiosa, empática e organizada. Porém é impulsiva, se autocritica excessivamente e tem dificuldade de dizer não. Gosta de passar o tempo pintando quadros ou pichando paredes que encontra pela frente.',powerNature:'Habilidades herdadas de sua família Akivus, combinadas com treinamento de boxe com seu pai.',abilities:'Capacidade de criar vinhas e flores — usa isso para se distrair quando está sem criatividade e também como ferramenta em combate.',fightingStyle:'Aprendeu boxe com seu pai, Fernandes Capellari, integrando golpes físicos com suas habilidades de vinhas.',equipment:'Chifre remendado por Melther, com vinhas e flores de violeta como símbolo de gratidão.',allies:'Kasiya — a protegeu na escola quando outras crianças a intimidavam por ser de uma espécie considerada mais fraca. Charles Capellari (25 anos) — irmão mais velho, muito próximo. Theo Capellari (17 anos) — irmão mais novo, doce e compreensivo. Fernandes Capellari — pai, professor de boxe. Marta — avó, dona da floricultura. Melther (falecido) — amigo que fez seu novo chifre.',enemies:'Henry — ex-namorado Akivus, loiro e alto; tentou intimidar Theo junto com seus amigos. Vilões e facções que ela combate à noite.',organizations:'Facções criminosas que ela investiga durante suas saídas noturnas.',trivia1:'Vegetariana — seu prato favorito é panqueca de queijo.',trivia2:'Roxo e azul são suas cores favoritas. Quando está sem criatividade, gosta de criar vinhas e flores para se distrair e ter novas ideias.',trivia3:'Sempre gostou de presentear amigos próximos com coroas de flores, priorizando as flores favoritas de cada pessoa.' },
      { id:'seed02',image:'',name:'Melther "Zombie" Gufford',pvs:'---',sanidade:'---',fullName:'Melther "Zombie" Gufford',age:'250 anos',race:'Elfo (espécie extinta)',className:'Consagrado',affiliation:'Servo de Uchu / Death Squad',status:'Morto',summary:'Gênio musical e inventor louco, Melther foi um elfo de uma sociedade avançada porém opressora. Traído e morto pelos próprios companheiros de banda, foi ressuscitado por Uchu para se tornar um servo que corrige falhas na realidade.',origin:'Melther vivia numa sociedade élfica avançada, com tecnologias atualmente vistas em Paladium — como os Golens. Porém, essa sociedade era extremamente controladora, preconceituosa e estigmatizada, sem espaço para alguém criativo como Melther, tanto na magia quanto na música. Continuou produzindo invenções "loucas" e fundou a banda Death Squad, de heavy metal, estilo rejeitado pela sociedade élfica. Suas invenções foram consideradas "fora de controle" e ele foi taxado como criminoso e terrorista.',events:'No auge da carreira como estrela do rock, planejava deixar a cidade quando foi traído pelos companheiros de banda e morto num beco sujo. Foi trazido de volta à vida por Uchu, o deus que nunca se importou. Desde então, tornou-se um servo de Uchu — um daqueles que entram em fendas para corrigir erros na realidade — como preço pela segunda vida.',currentSituation:'Está morto.',appearance:'Elfo de 250 anos. Inspirado visualmente no Murdoc Niccals (Gorillaz). Sua história visual também bebe de MC Daleste, Julio Cesar e Arquimedes.',behavior:'Extremamente criativo, rebelde, despreza a maioria dos deuses (era "ateu" antes de ser forçado a servir Uchu). Tinha apelido "Zombie" desde a época da banda — ironia do destino ele ter morrido e voltado à vida.',powerNature:'Ressuscitado por Uchu, tornou-se um Rastejante — o primeiro da história. Passou a se alimentar de almas.',abilities:'Conseguiu criar artificialmente o elemento Pesadelo e, em seus últimos desejos, criou o próprio Pesadelo. Domesticou uma serpente gigante.',fightingStyle:'Combina magia élfica avançada com poderes de Rastejante adquiridos após a ressurreição.',equipment:'Invenções próprias, serpente gigante domesticada.',allies:'Elleonor Capellari — se apaixonou por ela em Cirus, mas faleceu antes de poder dizer algo. J&J (Johnsons&Johnsons) — adotado por ele.',enemies:'Companheiros da Death Squad — o traíram e mataram. A sociedade élfica que o perseguiu.',organizations:'Death Squad (fundador). Servo de Uchu.',trivia1:'O nome "Death Squad" surgiu como paródia crítica da polícia local.',trivia2:'Virou estrela do rock mundial — muitos mais velhos conheciam suas músicas. Inspirado por "Thriller" (Michael Jackson) e "The Trooper" (Iron Maiden). Era bissexual.',trivia3:'Depois de ressuscitado, passou a gostar de comer almas.' }
    ];
    for (const d of defaults) {
      if (seedMap.has(d.id)) Object.assign(seedMap.get(d.id), d);
      else characters.push(d);
    }
    save();
    localStorage.setItem(SEED_KEY, '1');
  }

  function load() {
    try { characters = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch { characters = []; }
    if (localStorage.getItem(SEED_KEY) !== '1') seedDefaults();
  }

  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(characters)); }

  // ========== HUB ==========
  function renderHub() {
    hubEl.hidden = false;
    topicEl.hidden = true;
    topicEl.innerHTML = '';
    renderMiniList();
    bindHubCards();
  }

  function renderMiniList() {
    charCount.textContent = characters.length;
    if (characters.length === 0) {
      charMiniList.innerHTML = '<div class="char-mini-item" style="justify-content:center;color:var(--text-muted);font-size:0.78rem;cursor:default;">Nenhum registrado</div>';
      return;
    }
    charMiniList.innerHTML = characters.map(c => `
      <div class="char-mini-item" data-id="${c.id}">
        <span class="status-dot" style="background:${statusColor(c.status)}"></span>
        <span>${escapeHtml(c.name)}</span>
      </div>
    `).join('');
    charMiniList.querySelectorAll('.char-mini-item').forEach(el => {
      el.addEventListener('click', () => openCharDetail(el.dataset.id));
    });
  }

  function bindHubCards() {
    document.querySelectorAll('.glass-lg, .glass-side[data-topic]').forEach(card => {
      const topic = card.dataset.topic;
      if (!topic) return;
      if (topic === 'personagens') return;
      card.addEventListener('click', () => openConstruction(topic));
    });
    document.getElementById('add-char-btn').addEventListener('click', async () => {
      if (await requirePassword()) openModal(null);
    });
  }

  // ========== CHAR DETAIL (inline no topic view) ==========
  function openCharDetail(id) {
    const c = characters.find(ch => ch.id === id);
    if (!c) return;
    currentId = id;
    hubEl.hidden = true;
    topicEl.hidden = false;
    topicEl.innerHTML = `
      <button class="topic-back" id="topic-back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>
        Personagens
      </button>
      <div class="wiki-layout">
        <aside class="wiki-sidebar">
          <button class="wiki-btn-primary" id="wiki-add-btn" style="width:100%;margin-bottom:var(--space-md);padding:var(--space-md);font-size:0.9rem">+ Novo Personagem</button>
          <input type="text" class="wiki-search" id="wiki-search" placeholder="Buscar personagem...">
          <div class="wiki-list" id="wiki-list"></div>
        </aside>
        <div class="wiki-main" id="wiki-view"></div>
      </div>
    `;
    document.getElementById('topic-back-btn').addEventListener('click', renderHub);
    document.getElementById('wiki-add-btn').addEventListener('click', async () => {
      if (await requirePassword()) openModal(null);
    });
    const listEl = document.getElementById('wiki-list');
    const viewEl = document.getElementById('wiki-view');
    const searchEl = document.getElementById('wiki-search');
    listEl.addEventListener('click', (e) => {
      const item = e.target.closest('.wiki-list-item');
      const del = e.target.closest('.del-btn');
      if (del) { e.stopPropagation(); deleteChar(del.dataset.id); return; }
      if (item) renderDetail(item.dataset.id, viewEl, listEl, searchEl);
    });
    searchEl.addEventListener('input', () => renderList(searchEl.value, listEl, viewEl));
    renderList('', listEl, viewEl);
    renderDetail(id, viewEl, listEl, searchEl);
  }

  // ========== CONSTRUCTION ==========
  function openConstruction(id) {
    const labels = { areas:'Áreas do Mundo', eventos:'Eventos Históricos', divindades:'Deuses e Cosmo', faccoes:'Facções e Organizações', criaturas:'Criaturas e Bestiário' };
    hubEl.hidden = true;
    topicEl.hidden = false;
    topicEl.innerHTML = `
      <button class="topic-back" id="topic-back-btn">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" width="14" height="14"><polyline points="15 18 9 12 15 6"/></svg>
        Voltar
      </button>
      <div class="topic-shell">
        <div class="construction-badge">Em construção</div>
        <h2>${labels[id] || id}</h2>
        <p>Este tópico ainda não possui registros. Em breve será possível explorar todo o conteúdo在这里.</p>
        <div class="construction-grid">
          ${Array.from({length:6}).map((_,i)=>`<div class="construction-slot"><span class="construction-name">${String.fromCharCode(65+i)}</span><span class="construction-placeholder">em breve</span></div>`).join('')}
        </div>
      </div>
    `;
    document.getElementById('topic-back-btn').addEventListener('click', renderHub);
  }

  // ========== LIST / DETAIL (personagens) ==========
  function renderList(search, listEl, viewEl) {
    const filtered = search ? characters.filter(c => c.name.toLowerCase().includes(search.toLowerCase())) : characters;
    if (filtered.length === 0) {
      listEl.innerHTML = '<div style="padding:var(--space-md);text-align:center;color:var(--text-muted);font-size:0.85rem;">Nenhum encontrado.</div>';
      if (!currentId) viewEl.innerHTML = '<div class="wiki-empty"><p>Nenhum personagem registrado.</p></div>';
      return;
    }
    listEl.innerHTML = filtered.map(c => `
      <div class="wiki-list-item ${c.id===currentId?'active':''}" data-id="${c.id}">
        <span class="status-dot" style="background:${statusColor(c.status)}"></span>
        <span class="name">${escapeHtml(c.name)}</span>
        <button class="del-btn" data-id="${c.id}" title="Remover">&times;</button>
      </div>
    `).join('');
  }

  function renderDetail(id, viewEl, listEl, searchEl) {
    const c = characters.find(ch => ch.id === id);
    if (!c) { viewEl.innerHTML = ''; return; }
    currentId = id;
    viewEl.innerHTML = `
      <div class="wiki-card">
        <div class="wiki-card-header">
          <h2>${escapeHtml(c.name)}</h2>
          <button class="wiki-btn-primary" id="wiki-edit-btn">Editar</button>
        </div>
        <div class="wiki-card-body">
          ${c.image ? `<img src="${escapeHtml(c.image)}" alt="${escapeHtml(c.name)}" class="wiki-illustration">` : ''}
          <p style="font-style:italic;color:var(--text-muted);margin-bottom:var(--space-lg)">${escapeHtml(c.summary||'')}</p>
          <div class="wiki-infobox">
            ${infoboxRow('Nome Completo',c.fullName)}${infoboxRow('Idade',c.age)}${infoboxRow('Raça',c.race)}${infoboxRow('Classe',c.className)}${infoboxRow('PVs',c.pvs)}${infoboxRow('Sanidade',c.sanidade)}${infoboxRow('Afiliação',c.affiliation)}${infoboxRow('Status',c.status,statusColor(c.status))}
          </div>
          ${section('Biografia e História',subsection('Origem',c.origin)+subsection('Eventos Marcantes',c.events)+subsection('Situação Atual',c.currentSituation))}
          ${section('Aparência e Personalidade',subsection('Descrição Física',c.appearance)+subsection('Comportamento',c.behavior))}
          ${section('Habilidades e Poderes',subsection('Natureza do Poder',c.powerNature)+subsection('Capacidades',c.abilities)+subsection('Estilo de Luta',c.fightingStyle)+subsection('Equipamento',c.equipment))}
          ${section('Relacionamentos',subsection('Aliados / Amigos',c.allies)+subsection('Rivais / Inimigos',c.enemies)+subsection('Organizações',c.organizations))}
          ${section('Notas e Curiosidades',subsection('Trivia 1',c.trivia1)+subsection('Trivia 2',c.trivia2)+subsection('Trivia 3',c.trivia3))}
        </div>
      </div>
    `;
    document.getElementById('wiki-edit-btn').addEventListener('click', async () => {
      if (await requirePassword()) openModal(c.id);
    });
    renderList(searchEl.value, listEl, viewEl);
  }

  // ========== MODAL ==========
  function openModal(id = null) {
    editingId = id;
    const c = id ? characters.find(ch => ch.id === id) : null;
    document.getElementById('wiki-modal-title').textContent = c ? 'Editar Personagem' : 'Novo Personagem';
    document.getElementById('wiki-form').innerHTML = formHtml(c);
    document.getElementById('wiki-modal-overlay').classList.add('open');
  }

  function closeModal() {
    document.getElementById('wiki-modal-overlay').classList.remove('open');
    editingId = null;
  }

  function saveForm() {
    const d = {};
    ['image','name','fullName','age','race','className','pvs','sanidade','affiliation','summary','origin','events','currentSituation','appearance','behavior','powerNature','abilities','fightingStyle','equipment','allies','enemies','organizations','trivia1','trivia2','trivia3'].forEach(k => {
      const el = document.getElementById('f-'+k);
      d[k] = el ? el.value.trim() : '';
    });
    d.status = document.getElementById('f-status').value;
    if (!d.name) { alert('O nome é obrigatório.'); return; }
    if (editingId) {
      const idx = characters.findIndex(ch => ch.id === editingId);
      if (idx !== -1) characters[idx] = { ...characters[idx], ...d };
    } else {
      d.id = Date.now().toString(36) + Math.random().toString(36).slice(2,6);
      characters.push(d);
    }
    save();
    closeModal();
    currentId = editingId || d.id;
    renderMiniList();
    if (!hubEl.hidden) return;
    const listEl = document.getElementById('wiki-list');
    const viewEl = document.getElementById('wiki-view');
    const searchEl = document.getElementById('wiki-search');
    if (listEl) { renderList(searchEl?.value||'', listEl, viewEl); renderDetail(currentId, viewEl, listEl, searchEl); }
  }

  async function deleteChar(id) {
    if (!(await requirePassword())) return;
    if (!confirm('Remover este personagem?')) return;
    characters = characters.filter(c => c.id !== id);
    save();
    if (currentId === id) currentId = null;
    renderMiniList();
    if (!hubEl.hidden) return;
    renderHub();
  }

  function formHtml(c) {
    const v = (k) => escapeHtml(c?.[k]||'');
    const sel = (v2) => (c?.status===v2)?'selected':'';
    return `
      <div class="form-row"><div><label>Nome *</label><input type="text" id="f-name" value="${v('name')}" required></div><div><label>Nome Completo</label><input type="text" id="f-fullName" value="${v('fullName')}"></div></div>
      <div class="form-row"><div><label>Idade</label><input type="text" id="f-age" value="${v('age')}"></div><div><label>Raça</label><input type="text" id="f-race" value="${v('race')}"></div></div>
      <div class="form-row"><div><label>Classe</label><input type="text" id="f-className" value="${v('className')}"></div><div><label>Afiliação</label><input type="text" id="f-affiliation" value="${v('affiliation')}"></div></div>
      <div class="form-row"><div><label>Status</label><select id="f-status"><option value="Vivo" ${sel('Vivo')}>Vivo</option><option value="Morto" ${sel('Morto')}>Morto</option><option value="Desaparecido" ${sel('Desaparecido')}>Desaparecido</option><option value="Selado" ${sel('Selado')}>Selado</option></select></div><div><label>PVs</label><input type="text" id="f-pvs" value="${v('pvs')}"></div></div>
      <div class="form-row"><div><label>Sanidade</label><input type="text" id="f-sanidade" value="${v('sanidade')}"></div><div></div></div>
      <label>URL da Ilustração</label><input type="text" id="f-image" value="${v('image')}" placeholder="https://...png ou deixe vazio">
      <label>Resumo (uma frase)</label><textarea id="f-summary" rows="2">${v('summary')}</textarea>
      <h3 style="font-family:var(--font-heading);font-size:0.9rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--attr-ea);margin:var(--space-lg)0 var(--space-md);padding-bottom:var(--space-sm);border-bottom:1px solid var(--border-subtle)">Biografia</h3>
      <label>Origem</label><textarea id="f-origin" rows="3">${v('origin')}</textarea>
      <label>Eventos Marcantes</label><textarea id="f-events" rows="3">${v('events')}</textarea>
      <label>Situação Atual</label><textarea id="f-currentSituation" rows="3">${v('currentSituation')}</textarea>
      <h3 style="font-family:var(--font-heading);font-size:0.9rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--attr-ea);margin:var(--space-lg)0 var(--space-md);padding-bottom:var(--space-sm);border-bottom:1px solid var(--border-subtle)">Aparência e Personalidade</h3>
      <label>Descrição Física</label><textarea id="f-appearance" rows="3">${v('appearance')}</textarea>
      <label>Comportamento</label><textarea id="f-behavior" rows="3">${v('behavior')}</textarea>
      <h3 style="font-family:var(--font-heading);font-size:0.9rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--attr-ea);margin:var(--space-lg)0 var(--space-md);padding-bottom:var(--space-sm);border-bottom:1px solid var(--border-subtle)">Habilidades e Poderes</h3>
      <label>Natureza do Poder</label><textarea id="f-powerNature" rows="3">${v('powerNature')}</textarea>
      <label>Capacidades</label><textarea id="f-abilities" rows="3">${v('abilities')}</textarea>
      <label>Estilo de Luta</label><textarea id="f-fightingStyle" rows="3">${v('fightingStyle')}</textarea>
      <label>Equipamento</label><textarea id="f-equipment" rows="3">${v('equipment')}</textarea>
      <h3 style="font-family:var(--font-heading);font-size:0.9rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--attr-ea);margin:var(--space-lg)0 var(--space-md);padding-bottom:var(--space-sm);border-bottom:1px solid var(--border-subtle)">Relacionamentos</h3>
      <label>Aliados / Amigos</label><textarea id="f-allies" rows="2">${v('allies')}</textarea>
      <label>Rivais / Inimigos</label><textarea id="f-enemies" rows="2">${v('enemies')}</textarea>
      <label>Organizações</label><textarea id="f-organizations" rows="2">${v('organizations')}</textarea>
      <h3 style="font-family:var(--font-heading);font-size:0.9rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--attr-ea);margin:var(--space-lg)0 var(--space-md);padding-bottom:var(--space-sm);border-bottom:1px solid var(--border-subtle)">Notas e Curiosidades</h3>
      <label>Trivia 1</label><textarea id="f-trivia1" rows="2">${v('trivia1')}</textarea>
      <label>Trivia 2</label><textarea id="f-trivia2" rows="2">${v('trivia2')}</textarea>
      <label>Trivia 3</label><textarea id="f-trivia3" rows="2">${v('trivia3')}</textarea>
    `;
  }

  // ========== HELPERS ==========
  function statusColor(s) {
    switch(s) { case 'Vivo': return '#55a630'; case 'Morto': return '#ff1f1f'; case 'Desaparecido': return '#f5b700'; case 'Selado': return '#7e00c2'; default: return '#6b6b7b'; }
  }
  function escapeHtml(s) { if(!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function infoboxRow(l,v,c) { if(!v) return ''; const s = c ? ` style="color:${c};font-weight:600"` : ''; return `<div class="wiki-infobox-row"><span class="wiki-infobox-label">${l}</span><span class="wiki-infobox-value"${s}>${escapeHtml(v)}</span></div>`; }
  function section(t,c) { return `<h3>${t}</h3>${c}`; }
  function subsection(t,c) { if(!c) return ''; return `<p><strong>${t}:</strong> ${escapeHtml(c)}</p>`; }

  // ========== GLOBAL EVENTS ==========
  document.getElementById('wiki-modal-overlay').addEventListener('click', e => { if(e.target.id==='wiki-modal-overlay') closeModal(); });
  document.getElementById('wiki-modal-close').addEventListener('click', closeModal);
  document.getElementById('wiki-modal-save').addEventListener('click', saveForm);
  document.addEventListener('keydown', e => {
    if(e.key==='Escape') closeModal();
    if(e.key==='Enter'&&(e.ctrlKey||e.metaKey)&&document.getElementById('wiki-modal-overlay').classList.contains('open')) saveForm();
  });

  // ========== INIT ==========
  initPassword().then(() => { load(); renderHub(); });
});
