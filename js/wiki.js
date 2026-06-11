document.addEventListener('DOMContentLoaded', () => {
  const STORAGE_KEY = 'wuitar_wiki_characters';
  let characters = [];
  let currentId = null;
  let editingId = null;

  const listEl = document.getElementById('wiki-list');
  const viewEl = document.getElementById('wiki-view');
  const emptyEl = document.getElementById('wiki-empty');
  const modalOverlay = document.getElementById('wiki-modal-overlay');
  const modalTitle = document.getElementById('wiki-modal-title');
  const form = document.getElementById('wiki-form');
  const searchEl = document.getElementById('wiki-search');

  function load() {
    try {
      characters = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch { characters = []; }
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  }

  function renderList(search = '') {
    const filtered = search
      ? characters.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
      : characters;
    if (filtered.length === 0) {
      listEl.innerHTML = '<div style="padding:var(--space-md);text-align:center;color:var(--text-muted);font-size:0.85rem;">Nenhum personagem encontrado.</div>';
      return;
    }
    listEl.innerHTML = filtered.map(c => `
      <div class="wiki-list-item ${c.id === currentId ? 'active' : ''}" data-id="${c.id}">
        <span class="status-dot" style="background: ${statusColor(c.status)}"></span>
        <span class="name">${escapeHtml(c.name)}</span>
        <button class="del-btn" data-id="${c.id}" title="Remover">&times;</button>
      </div>
    `).join('');
  }

  function renderDetail(id) {
    const c = characters.find(ch => ch.id === id);
    if (!c) { viewEl.innerHTML = ''; return; }
    currentId = id;
    viewEl.innerHTML = `
      <div class="wiki-card">
        <div class="wiki-card-header">
          <h2>${escapeHtml(c.name)}</h2>
          <div style="display:flex;gap:var(--space-sm)">
            <button class="wiki-btn-primary" id="wiki-edit-btn">Editar</button>
          </div>
        </div>
        <div class="wiki-card-body">
          <p style="font-style:italic;color:var(--text-muted);margin-bottom:var(--space-lg)">${escapeHtml(c.summary || '')}</p>

          <div class="wiki-infobox">
            ${infoboxRow('Nome Completo', c.fullName)}
            ${infoboxRow('Idade', c.age)}
            ${infoboxRow('Raça', c.race)}
            ${infoboxRow('Classe', c.className)}
            ${infoboxRow('Afiliação', c.affiliation)}
            ${infoboxRow('Status', c.status, statusColor(c.status))}
          </div>

          ${section('Biografia e História', `
            ${subsection('Origem', c.origin)}
            ${subsection('Eventos Marcantes', c.events)}
            ${subsection('Situação Atual', c.currentSituation)}
          `)}

          ${section('Aparência e Personalidade', `
            ${subsection('Descrição Física', c.appearance)}
            ${subsection('Comportamento', c.behavior)}
          `)}

          ${section('Habilidades e Poderes', `
            ${subsection('Natureza do Poder', c.powerNature)}
            ${subsection('Capacidades', c.abilities)}
            ${subsection('Estilo de Luta', c.fightingStyle)}
            ${subsection('Equipamento', c.equipment)}
          `)}

          ${section('Relacionamentos', `
            ${subsection('Aliados / Amigos', c.allies)}
            ${subsection('Rivais / Inimigos', c.enemies)}
            ${subsection('Organizações', c.organizations)}
          `)}

          ${section('Notas e Curiosidades', `
            ${subsection('Trivia 1', c.trivia1)}
            ${subsection('Trivia 2', c.trivia2)}
            ${subsection('Trivia 3', c.trivia3)}
          `)}
        </div>
      </div>
    `;

    document.getElementById('wiki-edit-btn').addEventListener('click', () => openModal(c.id));
    renderList(searchEl.value);
  }

  function openModal(id = null) {
    editingId = id;
    const c = id ? characters.find(ch => ch.id === id) : null;
    modalTitle.textContent = c ? 'Editar Personagem' : 'Novo Personagem';
    form.innerHTML = `
      <div class="form-row">
        <div><label>Nome *</label><input type="text" id="f-name" value="${escapeHtml(c?.name || '')}" required></div>
        <div><label>Nome Completo</label><input type="text" id="f-fullName" value="${escapeHtml(c?.fullName || '')}"></div>
      </div>
      <div class="form-row">
        <div><label>Idade</label><input type="text" id="f-age" value="${escapeHtml(c?.age || '')}"></div>
        <div><label>Raça</label><input type="text" id="f-race" value="${escapeHtml(c?.race || '')}"></div>
      </div>
      <div class="form-row">
        <div><label>Classe</label><input type="text" id="f-className" value="${escapeHtml(c?.className || '')}"></div>
        <div><label>Afiliação</label><input type="text" id="f-affiliation" value="${escapeHtml(c?.affiliation || '')}"></div>
      </div>
      <div class="form-row">
        <div><label>Status</label>
          <select id="f-status">
            <option value="Vivo" ${c?.status === 'Vivo' ? 'selected' : ''}>Vivo</option>
            <option value="Morto" ${c?.status === 'Morto' ? 'selected' : ''}>Morto</option>
            <option value="Desaparecido" ${c?.status === 'Desaparecido' ? 'selected' : ''}>Desaparecido</option>
            <option value="Selado" ${c?.status === 'Selado' ? 'selected' : ''}>Selado</option>
          </select>
        </div>
        <div></div>
      </div>
      <label>Resumo (uma frase)</label><textarea id="f-summary" rows="2">${escapeHtml(c?.summary || '')}</textarea>
      <h3 style="font-family:var(--font-heading);font-size:0.9rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--attr-ea);margin:var(--space-lg)0 var(--space-md);padding-bottom:var(--space-sm);border-bottom:1px solid var(--border-subtle)">Biografia</h3>
      <label>Origem</label><textarea id="f-origin" rows="3">${escapeHtml(c?.origin || '')}</textarea>
      <label>Eventos Marcantes</label><textarea id="f-events" rows="3">${escapeHtml(c?.events || '')}</textarea>
      <label>Situação Atual</label><textarea id="f-currentSituation" rows="3">${escapeHtml(c?.currentSituation || '')}</textarea>
      <h3 style="font-family:var(--font-heading);font-size:0.9rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--attr-ea);margin:var(--space-lg)0 var(--space-md);padding-bottom:var(--space-sm);border-bottom:1px solid var(--border-subtle)">Aparência e Personalidade</h3>
      <label>Descrição Física</label><textarea id="f-appearance" rows="3">${escapeHtml(c?.appearance || '')}</textarea>
      <label>Comportamento</label><textarea id="f-behavior" rows="3">${escapeHtml(c?.behavior || '')}</textarea>
      <h3 style="font-family:var(--font-heading);font-size:0.9rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--attr-ea);margin:var(--space-lg)0 var(--space-md);padding-bottom:var(--space-sm);border-bottom:1px solid var(--border-subtle)">Habilidades e Poderes</h3>
      <label>Natureza do Poder</label><textarea id="f-powerNature" rows="3">${escapeHtml(c?.powerNature || '')}</textarea>
      <label>Capacidades</label><textarea id="f-abilities" rows="3">${escapeHtml(c?.abilities || '')}</textarea>
      <label>Estilo de Luta</label><textarea id="f-fightingStyle" rows="3">${escapeHtml(c?.fightingStyle || '')}</textarea>
      <label>Equipamento</label><textarea id="f-equipment" rows="3">${escapeHtml(c?.equipment || '')}</textarea>
      <h3 style="font-family:var(--font-heading);font-size:0.9rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--attr-ea);margin:var(--space-lg)0 var(--space-md);padding-bottom:var(--space-sm);border-bottom:1px solid var(--border-subtle)">Relacionamentos</h3>
      <label>Aliados / Amigos</label><textarea id="f-allies" rows="2">${escapeHtml(c?.allies || '')}</textarea>
      <label>Rivais / Inimigos</label><textarea id="f-enemies" rows="2">${escapeHtml(c?.enemies || '')}</textarea>
      <label>Organizações</label><textarea id="f-organizations" rows="2">${escapeHtml(c?.organizations || '')}</textarea>
      <h3 style="font-family:var(--font-heading);font-size:0.9rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--attr-ea);margin:var(--space-lg)0 var(--space-md);padding-bottom:var(--space-sm);border-bottom:1px solid var(--border-subtle)">Notas e Curiosidades</h3>
      <label>Trivia 1</label><textarea id="f-trivia1" rows="2">${escapeHtml(c?.trivia1 || '')}</textarea>
      <label>Trivia 2</label><textarea id="f-trivia2" rows="2">${escapeHtml(c?.trivia2 || '')}</textarea>
      <label>Trivia 3</label><textarea id="f-trivia3" rows="2">${escapeHtml(c?.trivia3 || '')}</textarea>
    `;
    modalOverlay.classList.add('open');
  }

  function closeModal() {
    modalOverlay.classList.remove('open');
    editingId = null;
  }

  function saveForm() {
    const data = {
      name: document.getElementById('f-name').value.trim(),
      fullName: document.getElementById('f-fullName').value.trim(),
      age: document.getElementById('f-age').value.trim(),
      race: document.getElementById('f-race').value.trim(),
      className: document.getElementById('f-className').value.trim(),
      affiliation: document.getElementById('f-affiliation').value.trim(),
      status: document.getElementById('f-status').value,
      summary: document.getElementById('f-summary').value.trim(),
      origin: document.getElementById('f-origin').value.trim(),
      events: document.getElementById('f-events').value.trim(),
      currentSituation: document.getElementById('f-currentSituation').value.trim(),
      appearance: document.getElementById('f-appearance').value.trim(),
      behavior: document.getElementById('f-behavior').value.trim(),
      powerNature: document.getElementById('f-powerNature').value.trim(),
      abilities: document.getElementById('f-abilities').value.trim(),
      fightingStyle: document.getElementById('f-fightingStyle').value.trim(),
      equipment: document.getElementById('f-equipment').value.trim(),
      allies: document.getElementById('f-allies').value.trim(),
      enemies: document.getElementById('f-enemies').value.trim(),
      organizations: document.getElementById('f-organizations').value.trim(),
      trivia1: document.getElementById('f-trivia1').value.trim(),
      trivia2: document.getElementById('f-trivia2').value.trim(),
      trivia3: document.getElementById('f-trivia3').value.trim(),
    };
    if (!data.name) { alert('O nome é obrigatório.'); return; }
    if (editingId) {
      const idx = characters.findIndex(ch => ch.id === editingId);
      if (idx !== -1) { characters[idx] = { ...characters[idx], ...data }; }
    } else {
      data.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      characters.push(data);
    }
    save();
    closeModal();
    currentId = editingId || data.id;
    renderList(searchEl.value);
    renderDetail(currentId);
  }

  function deleteChar(id) {
    if (!confirm('Remover este personagem?')) return;
    characters = characters.filter(c => c.id !== id);
    save();
    if (currentId === id) { currentId = null; viewEl.innerHTML = ''; }
    renderList(searchEl.value);
  }

  // Helper functions
  function statusColor(s) {
    switch (s) {
      case 'Vivo': return '#55a630';
      case 'Morto': return '#ff1f1f';
      case 'Desaparecido': return '#f5b700';
      case 'Selado': return '#7e00c2';
      default: return '#6b6b7b';
    }
  }
  function escapeHtml(s) { if (!s) return ''; return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
  function infoboxRow(label, value, color) {
    if (!value) return '';
    const style = color ? ` style="color:${color};font-weight:600"` : '';
    return `<div class="wiki-infobox-row"><span class="wiki-infobox-label">${label}</span><span class="wiki-infobox-value"${style}>${escapeHtml(value)}</span></div>`;
  }
  function section(title, content) { return `<h3>${title}</h3>${content}`; }
  function subsection(title, content) {
    if (!content) return '';
    return `<p><strong>${title}:</strong> ${escapeHtml(content)}</p>`;
  }

  // Event listeners
  document.getElementById('wiki-add-btn').addEventListener('click', () => openModal(null));
  document.getElementById('wiki-modal-close').addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
  document.getElementById('wiki-modal-save').addEventListener('click', saveForm);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && modalOverlay.classList.contains('open')) saveForm();
  });

  listEl.addEventListener('click', (e) => {
    const item = e.target.closest('.wiki-list-item');
    const del = e.target.closest('.del-btn');
    if (del) { e.stopPropagation(); deleteChar(del.dataset.id); return; }
    if (item) renderDetail(item.dataset.id);
  });

  searchEl.addEventListener('input', () => renderList(searchEl.value));

  // Init
  load();
  renderList();
});