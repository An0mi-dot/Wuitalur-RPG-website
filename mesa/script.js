let ws;
let characters = [];
let combat = { active: false, order: [], index: 0, round: 1, log: [] };
let previousValues = {};
let currentRole = 'dm';
let sanAmbientIntervals = {};
let eaLowIntervals = {};
let selectedCharId = null;
let addModalIsPlayer = true;
let animationsToRun = [];

/* Base remota opcional (window.MESA_API/config.js). Vazia = mesma origem. */
function apiUrl(p) {
  return (typeof window !== 'undefined' && window.MESA_API ? window.MESA_API : '') + p;
}

function wsUrl() {
  if (typeof window !== 'undefined' && window.MESA_WS) return window.MESA_WS;
  if (typeof window !== 'undefined' && window.MESA_API) {
    return window.MESA_API.replace(/^http/, 'ws');
  }
  const protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  return `${protocol}://${location.host}`;
}

function getPortraitHtml(c) {
  if (!c.image) return '<span class="no-image">?</span>';
  const base = c.image.replace(/\.svg$/, '').replace(/\.png$/, '');
  const src = `images/symbols/${base}.svg`;
  return `<img class="portrait-symbol" src="${src}" onerror="this.onerror=null;this.style.display='none';">`;
}

function connectWS() {
  ws = new WebSocket(wsUrl());

  ws.onopen = () => updateStatus(true);
  ws.onclose = () => {
    updateStatus(false);
    setTimeout(connectWS, 2000);
  };
  ws.onerror = () => updateStatus(false);

  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.type === 'init' || data.type === 'state') {
      characters = typeof toUiCharacter === 'function' ? (data.characters || []).map(toUiCharacter) : data.characters || [];
      combat = data.combat || combat;
      renderCharacters();
      renderCombat();
    } else if (data.type === 'update') {
      const projected = typeof toUiCharacter === 'function' ? toUiCharacter(data.character) : data.character;
      const idx = characters.findIndex((c) => c.id === (projected && projected.id));
      if (projected) {
        if (idx !== -1) characters[idx] = projected;
        else characters.push(projected);
      }
      renderCharacters();
    } else if (data.type === 'dice-roll') {
      handleDiceRoll(data);
    }
  };
}

function updateStatus(connected) {
  const dot = document.querySelector('.status-dot');
  if (!dot) return;
  dot.classList.toggle('connected', connected);
}

function setRole(role) {
  currentRole = role;
  document.getElementById('btn-player').classList.toggle('active', role === 'player');
  document.getElementById('btn-dm').classList.toggle('active', role === 'dm');
  document.body.classList.toggle('is-dm', role === 'dm');
  renderCharacters();
}

function getBarPercent(current, max) {
  if (max === 0) return 0;
  return Math.max(0, Math.min(100, (current / max) * 100));
}

function getSanMeta(c) {
  const sanCycle = 60;
  const level = Math.min(6, Math.floor(c.san.current / sanCycle));
  const percent = level >= 6 ? 100 : Math.min(100, ((c.san.current % sanCycle) / sanCycle) * 100);
  const remainder = c.san.current % sanCycle;
  return { level, percent, remainder, isCritical: remainder >= 55 && remainder < 60, isAlmostFull: level >= 6 || remainder >= 50 };
}

function renderCharacterCard(c) {
  const prev = previousValues[c.id] || {};
  const pvDiff = (prev.pv !== undefined) ? c.pv.current - prev.pv : 0;
  const eaDiff = (prev.ea !== undefined) ? c.ea.current - prev.ea : 0;
  const sanDiff = (prev.san !== undefined) ? c.san.current - prev.san : 0;

  let animClass = '';
  const s = getSanMeta(c);
  const prevSan = (prev.san !== undefined) ? prev.san : 0;
  const prevLevelSan = Math.min(6, Math.floor(prevSan / 60));
  const isNewLevel = (prev.san !== undefined) && s.level > prevLevelSan && s.level > 0;

  if (pvDiff < 0) {
    animClass += ' anim-damage';
    animationsToRun.push(() => {
      const cardEl = document.querySelector(`.character-card[data-id="${c.id}"]`);
      if (cardEl) spawnDamageEffect(cardEl, Math.abs(pvDiff));
    });
  } else if (pvDiff > 0) {
    animClass += ' anim-heal';
    animationsToRun.push(() => {
      const cardEl = document.querySelector(`.character-card[data-id="${c.id}"]`);
      if (cardEl) spawnHealEffect(cardEl, pvDiff);
    });
  } else if (eaDiff !== 0) {
    animationsToRun.push(() => spawnParticles(c.id, 'ea', Math.abs(eaDiff)));
  } else if (sanDiff !== 0) {
    animationsToRun.push(() => spawnParticles(c.id, 'san', Math.abs(sanDiff)));
  }

  if (c.pv.current <= 15 && c.pv.max > 0) animClass += ' lowhp-tremble';
  if (isNewLevel) {
    animClass += ' anim-levelup';
    animationsToRun.push(() => {
      const cardEl = document.querySelector(`.character-card[data-id="${c.id}"]`);
      if (cardEl) spawnLevelUpEffect(cardEl);
    });
  }

  previousValues[c.id] = { pv: c.pv.current, ea: c.ea.current, san: c.san.current };

  if (s.isAlmostFull && !sanAmbientIntervals[c.id]) animationsToRun.push(() => startSanAmbientParticles(c.id));
  else if (!s.isAlmostFull && sanAmbientIntervals[c.id]) stopSanAmbientParticles(c.id);

  if (c.ea.current <= 50 && c.ea.max > 0 && !eaLowIntervals[c.id]) animationsToRun.push(() => startSweatEffect(c.id));
  else if (c.ea.current > 50 && eaLowIntervals[c.id]) stopSweatEffect(c.id);

  const isActive = combat.active && combat.order[combat.index] === c.id;

  return `
  <div class="character-card ${animClass} ${isActive ? 'active-turn' : ''}" data-id="${c.id}" onclick="openDetail(${c.id})">
    <div class="card-frame">
      <div class="card-portrait">
${getPortraitHtml(c)}
        ${c.shield && c.shield.current > 0 ? `<div class="shield-overlay"></div>` : ''}
        <div class="particles-container" data-id="${c.id}"></div>
      </div>
      <div class="card-info">
        <div class="card-name-row">
          <span class="card-name">${c.name}</span>
          <span class="card-level">${c.level}</span>
        </div>
        <div class="card-sub">${c.class || ''}</div>
        <div class="card-hp">HP ${c.pv.current}/${c.pv.max}</div>
        <div class="card-ea">EA ${c.ea.current}/${c.ea.max}</div>
        <div class="card-san-row">
          <svg class="san-icon" viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="#664488" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <circle cx="12" cy="12" r="4"/>
            <line x1="12" y1="2" x2="12" y2="5"/>
            <line x1="12" y1="19" x2="12" y2="22"/>
            <line x1="2" y1="12" x2="5" y2="12"/>
            <line x1="19" y1="12" x2="22" y2="12"/>
          </svg>
          <span class="card-san-text">${Math.max(0, Math.min(6, s.level))}</span>
        </div>
        <div class="card-san-bar">
          <div class="card-san-fill" style="width: ${s.percent}%"></div>
        </div>
      </div>
    </div>
  </div>`;
}

function renderEnemyCard(c) {
  const prev = previousValues[c.id] || {};
  const pvDiff = (prev.pv !== undefined) ? c.pv.current - prev.pv : 0;
  const ealDiff = (prev.ea !== undefined) ? c.ea.current - prev.ea : 0;
  const sanDiff = (prev.san !== undefined) ? c.san.current - prev.san : 0;

  let animClass = 'anim-npc';
  const s = getSanMeta(c);
  const prevSan = (prev.san !== undefined) ? prev.san : 0;
  const prevLevelSan = Math.min(6, Math.floor(prevSan / 60));
  const isNewLevel = (prev.san !== undefined) && s.level > prevLevelSan && s.level > 0;

  if (pvDiff < 0) {
    animClass += ' anim-damage';
    animationsToRun.push(() => {
      const cardEl = document.querySelector(`.enemy-card[data-id="${c.id}"]`);
      if (cardEl) spawnDamageEffect(cardEl, Math.abs(pvDiff));
    });
  } else if (pvDiff > 0) {
    animClass += ' anim-heal';
    animationsToRun.push(() => {
      const cardEl = document.querySelector(`.enemy-card[data-id="${c.id}"]`);
      if (cardEl) spawnHealEffect(cardEl, pvDiff);
    });
  } else if (ealDiff !== 0) {
    animationsToRun.push(() => spawnParticles(c.id, 'ea', Math.abs(ealDiff)));
  } else if (sanDiff !== 0) {
    animationsToRun.push(() => spawnParticles(c.id, 'san', Math.abs(sanDiff)));
  }

  if (c.ea.current <= 50 && c.ea.max > 0 && !eaLowIntervals[c.id]) animationsToRun.push(() => startSweatEffect(c.id));
  else if (c.ea.current > 50 && eaLowIntervals[c.id]) stopSweatEffect(c.id);

  previousValues[c.id] = { pv: c.pv.current, ea: c.ea.current, san: c.san.current };

  const isActive = combat.active && combat.order[combat.index] === c.id;
  const showStats = currentRole === 'dm';

  return `
  <div class="enemy-card ${animClass} ${isActive ? 'active-turn' : ''}" data-id="${c.id}" onclick="openDetail(${c.id})">
    <div class="enemy-card-name">${c.name}</div>
    <div class="enemy-portrait-area">
      ${getPortraitHtml(c)}
      ${c.shield && c.shield.current > 0 ? `<div class="shield-overlay"></div>` : ''}
      <div class="enemy-particles" data-id="${c.id}"></div>
    </div>
    ${showStats ? `
    <div class="enemy-card-stats">
      <div class="enemy-stat">
        <span class="enemy-stat-label">VIDA</span>
        <div class="enemy-bar"><div class="enemy-bar-fill hp" style="width: ${getBarPercent(c.pv.current, c.pv.max)}%"></div></div>
        <span class="enemy-stat-num hp">${c.pv.current}/${c.pv.max}</span>
      </div>
      <div class="enemy-stat">
        <span class="enemy-stat-label">ENERGIA</span>
        <div class="enemy-bar"><div class="enemy-bar-fill ea" style="width: ${getBarPercent(c.ea.current, c.ea.max)}%"></div></div>
        <span class="enemy-stat-num ea">${c.ea.current}/${c.ea.max}</span>
      </div>
      <div class="enemy-stat">
        <span class="enemy-stat-label">ESTRESSE <span class="enemy-san-lv">N${s.level}</span></span>
        <div class="enemy-bar"><div class="enemy-bar-fill san" style="width: ${s.percent}%"></div></div>
        <span class="enemy-stat-num san">${c.san.current}/${c.san.max}</span>
      </div>
    </div>` : ''}
  </div>`;
}

function renderCharacters() {
  const grid = document.getElementById('characters-grid');
  const enemyZone = document.getElementById('enemy-zone');
  if (!grid) return;

  animationsToRun = [];

  const players = characters.filter((c) => c.type !== 'npc');
  const npcs = characters.filter((c) => c.type === 'npc');

  grid.innerHTML = players.map(renderCharacterCard).join('');
  if (grid.innerHTML === '') grid.innerHTML = '<div class="party-empty">SEM JOGADORES</div>';

  if (enemyZone) {
    enemyZone.innerHTML = npcs.length > 0
      ? npcs.map(renderEnemyCard).join('')
      : `<div class="enemy-placeholder"><span>NPC</span></div>`;
  }

  renderCharList();

  setTimeout(() => {
    animationsToRun.forEach((fn) => fn());
    updateDetailIfOpen();
  }, 50);
}

function renderCharList() {
  const list = document.getElementById('char-list');
  if (!list) return;
  const all = [...characters].sort((a, b) => (a.type === 'npc' ? 1 : 0) - (b.type === 'npc' ? 1 : 0));
  const turnActiveId = currentCombatId();
  list.innerHTML = all.map((c) => `
    <div class="char-list-row ${c.id === selectedCharId ? 'active' : ''} ${c.type === 'npc' ? 'npc' : 'player'} ${c.id === turnActiveId ? 'active-turn' : ''}"
         onclick="openDetail(${c.id})">
      <span class="char-list-name">${c.name}</span>
      <span class="char-list-sub">${c.type === 'npc' ? 'NPC' : (c.class || '')}</span>
      <span class="char-list-hp">${c.pv.current}/${c.pv.max}</span>
    </div>
  `).join('') || '<div class="party-empty">SEM PERSONAGENS</div>';
}

function currentCombatId() {
  if (!combat.active || combat.order.length === 0) return null;
  return combat.order[combat.index];
}

function switchSidebar(tab) {
  document.querySelectorAll('.sidebar-tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
  ['chars', 'combat', 'log'].forEach((t) => {
    const p = document.getElementById(`panel-tab-${t}`);
    if (p) p.classList.toggle('active', t === tab);
  });
}

async function adjustStat(charId, key, delta) {
  const char = characters.find((c) => c.id === charId);
  if (!char) return;
  await updateCharacter(charId, { [key]: char[key].current + delta });
}

async function setStat(charId, key, value) {
  await updateCharacter(charId, { [key]: parseInt(value) || 0 });
}

async function setMaxStat(charId, key, value) {
  await updateCharacter(charId, { [key]: parseInt(value) || 0 });
}

async function updateCharacter(id, body) {
  try {
    const res = await fetch(apiUrl(`/api/characters/${id}`), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    applyCharacterUpdate(data);
  } catch (err) {
    console.error('Erro ao atualizar:', err);
  }
}

function applyCharacterUpdate(data) {
  if (!data) return;
  const projected = typeof toUiCharacter === 'function' ? toUiCharacter(data) : data;
  const idx = characters.findIndex((c) => c.id === projected.id);
  if (idx !== -1) characters[idx] = projected;
  renderCharacters();
  updateDetailIfOpen();
}

// ========== CRUD personagens ==========

function openAddModal(isPlayer) {
  addModalIsPlayer = isPlayer;
  document.getElementById('add-modal-title').textContent = isPlayer ? 'NOVO JOGADOR' : 'NOVO NPC';
  document.getElementById('add-modal').classList.remove('hidden');
  document.getElementById('add-name').focus();
}

function closeAddModal() {
  document.getElementById('add-modal').classList.add('hidden');
}

async function createCharacter() {
  const name = document.getElementById('add-name').value.trim();
  const cls = document.getElementById('add-class').value.trim();
  const pv = parseInt(document.getElementById('add-pv').value) || 100;
  const ea = parseInt(document.getElementById('add-ea').value) || 0;
  if (!name) return;
  try {
    await fetch(apiUrl('/api/characters'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, class: cls, type: addModalIsPlayer ? 'player' : 'npc', pvMax: pv, eaMax: ea }),
    });
    ['add-name', 'add-class', 'add-pv', 'add-ea'].forEach((id) => (document.getElementById(id).value = ''));
    closeAddModal();
  } catch (err) {
    console.error('Erro ao criar:', err);
  }
}

async function deleteCharacter(id) {
  if (!confirm('Remover este personagem?')) return;
  try {
    await fetch(apiUrl(`/api/characters/${id}`), { method: 'DELETE' });
    if (selectedCharId === id) closeDetail();
  } catch (err) {
    console.error('Erro ao remover:', err);
  }
}

// ========== Combate ==========

async function combatStart() {
  await fetch(apiUrl('/api/combat/start'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
}

async function combatEnd() {
  await fetch(apiUrl('/api/combat/end'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
}

async function combatNext() {
  await fetch(apiUrl('/api/combat/next'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
}

async function combatPrev() {
  await fetch(apiUrl('/api/combat/prev'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
}

async function combatLogClear() {
  await fetch(apiUrl('/api/combat/log/clear'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
}

function renderCombat() {
  const startBtn = document.getElementById('btn-combat-start');
  const endBtn = document.getElementById('btn-combat-end');
  const nextBtn = document.getElementById('btn-turn-next');
  const prevBtn = document.getElementById('btn-turn-prev');
  const roundEl = document.getElementById('turn-round');
  const orderEl = document.getElementById('turn-order');

  if (startBtn) startBtn.disabled = combat.active;
  if (endBtn) endBtn.disabled = !combat.active;
  if (nextBtn) nextBtn.disabled = !combat.active;
  if (prevBtn) prevBtn.disabled = !combat.active;
  if (roundEl) roundEl.textContent = `RODADA ${combat.round}`;

  if (!orderEl) return;
  let html = '';
  if (!combat.active || combat.order.length === 0) {
    html = '<span class="turn-idle">CLIQUE EM INICIAR PARA A ORDEM</span>';
  } else {
    combat.order.forEach((id, i) => {
      const c = characters.find((x) => x.id === id);
      if (!c) return;
      const active = i === combat.index;
      html += `<span class="turn-chip ${active ? 'turn-active' : ''} ${c.type === 'npc' ? 'turn-npc' : ''}">
        ${i + 1}. ${c.name}
      </span>`;
    });
  }
  orderEl.innerHTML = html;

  // destroy outline
  document.querySelectorAll('.active-turn').forEach((el) => el.classList.remove('active-turn'));
  if (combat.active && combat.order[combat.index] !== undefined) {
    const activeEl = document.querySelector(`.character-card[data-id="${combat.order[combat.index]}"]`);
    if (activeEl) activeEl.classList.add('active-turn');
  }

  renderCombatLog();
}

function renderCombatLog() {
  const list = document.getElementById('combat-log-list');
  if (!list) return;
  list.innerHTML = (combat.log || []).map((entry) => {
    return `<div class="log-item log-${entry.type || 'system'}"><span class="log-text">${entry.text}</span></div>`;
  }).join('');
}

// ========== PARTICLES ==========

function spawnParticles(charId, type, intensity) {
  const container = document.querySelector(`.particles-container[data-id="${charId}"]`) ||
    document.querySelector(`.enemy-particles[data-id="${charId}"]`);
  if (!container) return;

  const count = Math.min(2 + Math.floor(intensity / 3), 15);
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = `particle particle-${type}`;
      const size = 4 + Math.random() * 5;
      const startX = 20 + Math.random() * 60;
      const startY = 20 + Math.random() * 60;
      const tx = (Math.random() - 0.5) * 60;
      const ty = -20 - Math.random() * 40;
      const duration = 1 + Math.random() * 1.5;

      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${startX}%; top: ${startY}%;
        --tx: ${tx}px; --ty: ${ty}px; --duration: ${duration}s;
      `;
      container.appendChild(p);
      setTimeout(() => p.remove(), duration * 1000);
    }, i * 50);
  }
}

function spawnDamageEffect(cardEl, intensity) {
  const container = cardEl.querySelector('.particles-container') || cardEl.querySelector('.enemy-particles');
  if (!container) return;

  const slashCount = Math.min(2 + Math.floor(intensity / 8), 6);
  for (let i = 0; i < slashCount; i++) {
    setTimeout(() => {
      const slash = document.createElement('div');
      slash.className = 'slash-mark';
      const top = 10 + Math.random() * 60;
      const left = 10 + Math.random() * 60;
      const angle = -30 + Math.random() * 60;
      slash.style.cssText = `top:${top}%; left:${left}%; --slash-angle:${angle}deg;`;
      container.appendChild(slash);
      setTimeout(() => slash.remove(), 300);
    }, i * 60);
  }

  const bloodCount = Math.min(2 + Math.floor(intensity / 5), 10);
  for (let i = 0; i < bloodCount; i++) {
    setTimeout(() => {
      const b = document.createElement('div');
      b.className = 'blood-particle';
      const size = 2 + Math.random() * 4;
      const tx = (Math.random() - 0.5) * 60;
      const ty = 10 + Math.random() * 40;
      const duration = 0.4 + Math.random() * 0.4;
      b.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${30 + Math.random() * 40}%; top: ${20 + Math.random() * 40}%;
        --tx: ${tx}px; --ty: ${ty}px; --duration: ${duration}s;
      `;
      container.appendChild(b);
      setTimeout(() => b.remove(), duration * 1000);
    }, i * 30);
  }
}

function spawnHealEffect(cardEl, amount) {
  const container = cardEl.querySelector('.particles-container') || cardEl.querySelector('.enemy-particles');
  if (!container) return;

  const crossCount = Math.min(2 + Math.floor(amount / 10), 8);
  for (let i = 0; i < crossCount; i++) {
    setTimeout(() => {
      const cross = document.createElement('div');
      cross.className = 'heal-cross';
      const left = 20 + Math.random() * 60;
      const duration = 1 + Math.random() * 0.8;
      cross.style.cssText = `left:${left}%; bottom:20%; --duration:${duration}s;`;
      container.appendChild(cross);
      setTimeout(() => cross.remove(), duration * 1000);
    }, i * 80);
  }
}

function spawnLevelUpEffect(cardEl) {
  const container = cardEl.querySelector('.particles-container');
  if (!container) return;
  for (let i = 0; i < 18; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'particle particle-levelup';
      const size = 4 + Math.random() * 5;
      const tx = (Math.random() - 0.5) * 80;
      const ty = -30 - Math.random() * 50;
      const duration = 1.2 + Math.random() * 1;
      p.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}%; top: ${50 + Math.random() * 30}%;
        --tx: ${tx}px; --ty: ${ty}px; --duration: ${duration}s;
      `;
      container.appendChild(p);
      setTimeout(() => p.remove(), duration * 1000);
    }, i * 30);
  }
}

function startSanAmbientParticles(charId) {
  function spawnOne() {
    const container = document.querySelector(`.particles-container[data-id="${charId}"]`);
    if (!container) return;
    const p = document.createElement('div');
    p.className = 'particle particle-san-ambient';
    const size = 3 + Math.random() * 4;
    const tx = (Math.random() - 0.5) * 40;
    const ty = -15 - Math.random() * 30;
    const duration = 2 + Math.random() * 2;
    p.style.cssText = `
      width: ${size}px; height: ${size}px;
      left: ${10 + Math.random() * 80}%; top: ${30 + Math.random() * 50}%;
      --tx: ${tx}px; --ty: ${ty}px; --duration: ${duration}s;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), duration * 1000);
  }
  spawnOne();
  sanAmbientIntervals[charId] = setInterval(spawnOne, 500);
}

function stopSanAmbientParticles(charId) {
  if (sanAmbientIntervals[charId]) {
    clearInterval(sanAmbientIntervals[charId]);
    delete sanAmbientIntervals[charId];
  }
}

function startSweatEffect(charId) {
  function spawnDrop() {
    const cardEl = document.querySelector(`.character-card[data-id="${charId}"]`) ||
      document.querySelector(`.enemy-card[data-id="${charId}"]`);
    if (!cardEl) return;
    const drop = document.createElement('div');
    drop.className = 'particle particle-sweat';
    const duration = 0.8 + Math.random() * 0.6;
    drop.style.cssText = `
      left: ${30 + Math.random() * 40}%; top: ${5 + Math.random() * 15}%;
      --tx: ${5 + Math.random() * 10}px; --ty: ${20 + Math.random() * 30}px; --duration: ${duration}s;
    `;
    cardEl.appendChild(drop);
    setTimeout(() => drop.remove(), duration * 1000);
  }
  spawnDrop();
  eaLowIntervals[charId] = setInterval(spawnDrop, 600);
}

function stopSweatEffect(charId) {
  if (eaLowIntervals[charId]) {
    clearInterval(eaLowIntervals[charId]);
    delete eaLowIntervals[charId];
  }
}

// ========== DICE ==========

function handleDiceRoll(data) {
  const overlay = document.getElementById('dice-overlay');
  const container = document.getElementById('dice-container');
  const resultEl = document.getElementById('dice-result');
  const userEl = document.getElementById('dice-user');

  overlay.classList.remove('hidden', 'fade-out');
  container.innerHTML = '';
  resultEl.textContent = '';
  userEl.textContent = data.user || '';

  const diceCount = data.count || 1;
  const results = [];

  for (let i = 0; i < diceCount; i++) {
    const die = document.createElement('div');
    die.className = 'die rolling';
    die.textContent = '?';
    container.appendChild(die);
    results.push(die);
  }

  setTimeout(() => {
    results.forEach((die, i) => {
      setTimeout(() => {
        die.classList.remove('rolling');
        die.classList.add('bounce');
        die.textContent = data.results ? data.results[i] : data.result;
      }, i * 100);
    });

    resultEl.textContent = `= ${data.total || data.result}`;
  }, 800);

  setTimeout(() => {
    overlay.classList.add('fade-out');
    setTimeout(() => {
      overlay.classList.remove('fade-out');
      overlay.classList.add('hidden');
    }, 500);
  }, 3000);
}

// ========== DETAIL PANEL ==========

function openDetail(charId, focusTab = true) {
  selectedCharId = charId;
  const char = characters.find((c) => c.id === charId);
  if (!char) return;

  if (focusTab) switchSidebar('chars');
  renderCharList();

  const panel = document.getElementById('detail-panel');
  const nameEl = document.getElementById('detail-name');
  const deleteBtn = document.getElementById('detail-delete');
  const body = document.getElementById('detail-body');

  nameEl.textContent = char.name;
  if (deleteBtn) {
    deleteBtn.style.display = currentRole === 'dm' ? 'inline-block' : 'none';
    deleteBtn.onclick = () => deleteCharacter(char.id);
  }

  const sm = getSanMeta(char);

  body.innerHTML = `
    <div class="detail-meta">
      <div class="detail-meta-row"><span>CLASSE</span><input class="detail-input meta" value="${char.class}" onchange="updateCharacter(${char.id}, {class: this.value})"></div>
      <div class="detail-meta-row"><span>TIPO</span><span class="detail-meta-static ${char.type === 'npc' ? 'npc' : 'player'}">${char.type === 'npc' ? 'NPC' : 'JOGADOR'}</span></div>
    </div>

    <div class="detail-stat">
      <span class="detail-stat-label">NIVEL</span>
      <div class="detail-level-row">
        <button class="dm-btn" onclick="event.stopPropagation(); adjustLevel(${char.id}, -1)">-</button>
        <span class="detail-level-num">${char.level}</span>
        <button class="dm-btn" onclick="event.stopPropagation(); adjustLevel(${char.id}, 1)">+</button>
      </div>
    </div>

    <div class="detail-stat">
      <span class="detail-stat-label">VIDA</span>
      <div class="detail-stat-row hp">
        <input class="detail-input hp" type="number" value="${char.pv.current}"
          onclick="event.stopPropagation()"
          onchange="setStat(${char.id}, 'pv', this.value)">
        <span>/ ${char.pv.max}</span>
      </div>
      <div class="detail-bar">
        <div class="detail-bar-fill hp" style="width: ${getBarPercent(char.pv.current, char.pv.max)}%"></div>
      </div>
      <div class="detail-btns">
        <button class="dm-btn" onclick="event.stopPropagation(); adjustStat(${char.id}, 'pv', -5)">-5</button>
        <button class="dm-btn" onclick="event.stopPropagation(); adjustStat(${char.id}, 'pv', -1)">-1</button>
        <button class="dm-btn" onclick="event.stopPropagation(); adjustStat(${char.id}, 'pv', 1)">+1</button>
        <button class="dm-btn" onclick="event.stopPropagation(); adjustStat(${char.id}, 'pv', 5)">+5</button>
      </div>
    </div>
    <div class="detail-stat">
      <span class="detail-stat-label">ENERGIA</span>
      <div class="detail-stat-row ea">
        <input class="detail-input ea" type="number" value="${char.ea.current}"
          onclick="event.stopPropagation()"
          onchange="setStat(${char.id}, 'ea', this.value)">
        <span>/ ${char.ea.max}</span>
      </div>
      <div class="detail-bar">
        <div class="detail-bar-fill ea" style="width: ${getBarPercent(char.ea.current, char.ea.max)}%"></div>
      </div>
      <div class="detail-btns">
        <button class="dm-btn" onclick="event.stopPropagation(); adjustStat(${char.id}, 'ea', -5)">-5</button>
        <button class="dm-btn" onclick="event.stopPropagation(); adjustStat(${char.id}, 'ea', -1)">-1</button>
        <button class="dm-btn" onclick="event.stopPropagation(); adjustStat(${char.id}, 'ea', 1)">+1</button>
        <button class="dm-btn" onclick="event.stopPropagation(); adjustStat(${char.id}, 'ea', 5)">+5</button>
      </div>
    </div>
    <div class="detail-stat">
      <span class="detail-stat-label">
        <svg class="san-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#664488" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="12" r="4"/>
          <line x1="12" y1="2" x2="12" y2="5"/>
          <line x1="12" y1="19" x2="12" y2="22"/>
          <line x1="2" y1="12" x2="5" y2="12"/>
          <line x1="19" y1="12" x2="22" y2="12"/>
        </svg>
        ESTRESSE <span class="san-level-badge">NIVEL ${sm.level}</span>
      </span>
      <div class="detail-stat-row san">
        <input class="detail-input san" type="number" value="${char.san.current}"
          onclick="event.stopPropagation()"
          onchange="setStat(${char.id}, 'san', this.value)">
        <span>/ ${char.san.max}</span>
      </div>
      <div class="detail-bar">
        <div class="detail-bar-fill san" style="width: ${sm.percent}%"></div>
      </div>
      <div class="detail-btns">
        <button class="dm-btn" onclick="event.stopPropagation(); adjustStat(${char.id}, 'san', -10)">-10</button>
        <button class="dm-btn" onclick="event.stopPropagation(); adjustStat(${char.id}, 'san', -5)">-5</button>
        <button class="dm-btn" onclick="event.stopPropagation(); adjustStat(${char.id}, 'san', 5)">+5</button>
        <button class="dm-btn" onclick="event.stopPropagation(); adjustStat(${char.id}, 'san', 10)">+10</button>
      </div>
    </div>
    <div class="detail-stat">
      <span class="detail-stat-label">ESCUDO</span>
      <div class="detail-stat-row shield">
        <input class="detail-input shield" type="number" value="${char.shield.current}"
          onclick="event.stopPropagation()"
          onchange="setStat(${char.id}, 'shield', this.value)">
        <span>/ ${char.shield.max}</span>
      </div>
      <div class="detail-bar">
        <div class="detail-bar-fill shield" style="width: ${getBarPercent(char.shield.current, char.shield.max)}%"></div>
      </div>
      <div class="detail-btns">
        <button class="dm-btn" onclick="event.stopPropagation(); adjustStat(${char.id}, 'shield', -5)">-5</button>
        <button class="dm-btn" onclick="event.stopPropagation(); adjustStat(${char.id}, 'shield', 5)">+5</button>
      </div>
    </div>
    ${renderSheetSection(char)}
  `;

  panel.classList.add('open');
}

function renderSheetSection(c) {
  const s = c.stats || {};
  const cells = [
    ['SAU', s.saude], ['DES', s.des], ['FOR', s.forca], ['INT', s.int],
    ['FAMA', s.fama], ['SEN', s.sen], ['RE', s.re], ['RF', s.rf],
  ].map(([label, val]) => {
    const v = (val === undefined || val === null) ? 'â€”' : val;
    return `<div class="sheet-stat-cell"><span class="sheet-stat-key">${label}</span><span class="sheet-stat-val">${v}</span></div>`;
  }).join('');

  const skillsHtml = Array.isArray(c.skills) && c.skills.length
    ? `<div class="sheet-skills">${c.skills.map((sk) => `<span class="sheet-skill-chip">${sk}</span>`).join('')}</div>`
    : '';

  const defHtml = (c.def !== undefined && c.def !== null && c.def > 0) || (c.defe !== undefined && c.defe !== null && c.defe !== 0)
    ? `<div class="detail-sheet-block"><div class="detail-sheet-label">DEFESA</div><div class="sheet-resist-text">DEF ${c.def} Â· DEFe ${c.defe}</div></div>`
    : '';

  return `
    <div class="detail-sheet">
      <div class="detail-sheet-title">ATRIBUTOS</div>
      <div class="sheet-stats-grid">${cells}</div>
      ${defHtml}
      ${c.resist ? `<div class="detail-sheet-block"><div class="detail-sheet-label">RESISTENCIA</div><div class="sheet-resist-text">${c.resist}</div></div>` : ''}
      ${skillsHtml ? `<div class="detail-sheet-block"><div class="detail-sheet-label">PERICIAS</div>${skillsHtml}</div>` : ''}
    </div>
  `;
}

async function adjustLevel(charId, delta) {
  const char = characters.find((c) => c.id === charId);
  if (!char) return;
  await updateCharacter(charId, { level: Math.max(1, (char.level || 1) + delta) });
}

function closeDetail() {
  selectedCharId = null;
  document.getElementById('detail-panel').classList.remove('open');
  renderCharList();
}

function updateDetailIfOpen() {
  if (selectedCharId !== null) {
    openDetail(selectedCharId, false);
  }
}

// ========== TAB SWITCHING ==========

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach((btn) => btn.classList.remove('active'));
  if (tab === 'battle') {
    document.getElementById('screen-battle').classList.add('active');
    document.getElementById('screen-player').classList.remove('active');
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
  } else if (tab === 'player') {
    document.getElementById('screen-battle').classList.remove('active');
    document.getElementById('screen-player').classList.add('active');
    document.querySelectorAll('.tab-btn')[1].classList.add('active');
  }
}

function openDisplayWindow() {
  if (typeof window.electronAPI !== 'undefined') {
    window.electronAPI.openBattleDisplay();
  } else {
    window.open('display-battle.html', '_blank', 'noopener');
  }
}

// ========== INIT ==========

function startPolling() {
  setInterval(async () => {
    try {
      const res = await fetch(apiUrl('/api/state'));
      const data = await res.json();
      const newStr = JSON.stringify(data);
      if (window.lastStateStr !== newStr) {
        window.lastStateStr = newStr;
        characters = typeof toUiCharacter === 'function' ? (data.characters || []).map(toUiCharacter) : data.characters || [];
        combat = data.combat || combat;
        renderCharacters();
        renderCombat();
      }
    } catch (err) {}
  }, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
  connectWS();
  startPolling();
  loadAiChat();
  // fecha modal ao esc
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAddModal();
  });
});

// ========== CHAT DO MESTRE COM IA ==========

let aiOpen = false;

function toggleAiChat() {
  aiOpen = !aiOpen;
  const panel = document.getElementById('ai-chat');
  if (!panel) return;
  panel.classList.toggle('hidden', !aiOpen);
  if (aiOpen) {
    document.getElementById('ai-chat-input').focus();
    aiScroll();
  }
}

function aiScroll() {
  const list = document.getElementById('ai-chat-list');
  if (list) list.scrollTop = list.scrollHeight;
}

function aiAppend(list, role, text, action) {
  const row = document.createElement('div');
  row.className = 'ai-msg ' + (role === 'assistant' ? 'ai-msg-ia' : 'ai-msg-user');
  const body = document.createElement('div');
  body.className = 'ai-msg-text';
  body.textContent = text;
  row.appendChild(body);
  if (action && role === 'assistant') {
    const tag = document.createElement('div');
    tag.className = 'ai-msg-action';
    tag.textContent = 'acao: ' + action.action;
    row.appendChild(tag);
  }
  list.appendChild(row);
}

async function loadAiChat() {
  try {
    const res = await fetch(apiUrl('/api/ai/chat'));
    const data = await res.json();
    const list = document.getElementById('ai-chat-list');
    if (!list) return;
    list.innerHTML = '';
    (data.messages || []).forEach((m) => aiAppend(list, m.role, m.text, m.action));
    aiScroll();
  } catch (err) {
    console.error('Erro ao carregar chat:', err);
  }
}

async function aiSend() {
  const input = document.getElementById('ai-chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  input.value = '';
  const list = document.getElementById('ai-chat-list');
  aiAppend(list, 'user', msg);
  const typing = document.createElement('div');
  typing.className = 'ai-msg ai-msg-ia ai-msg-typing';
  typing.innerHTML = '<div class="ai-typing-dots"><span></span><span></span><span></span></div>';
  list.appendChild(typing);
  aiScroll();
  try {
    const res = await fetch(apiUrl('/api/ai/chat'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg }),
    });
    const data = await res.json();
    typing.remove();
    if (data.error) {
      aiAppend(list, 'assistant', 'Erro: ' + data.error);
    } else {
      aiAppend(list, 'assistant', data.reply, data.action);
    }
  } catch (err) {
    typing.remove();
    aiAppend(list, 'assistant', 'Falha de conexÃ£o com a IA.');
  }
  aiScroll();
}