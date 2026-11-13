(() => {
  'use strict';

  /* ============================================================
     DESKRPG — uiRenderer.js
     Etapa 1: render visual de batalha com dados fictícios.
     Sem rede / sem Supabase / sem IA.
     Estética herdada do visual original (mesa antiga).
     ============================================================ */

  /* ---------- DADOS FICTÍCIOS ---------- */
  const TEST_STATE = {
    combat: {
      active: true,
      order: ['teste', 'sombra'],
      index: 0,
      round: 1
    },
    characters: [
      {
        id: 'teste', name: 'TESTE', type: 'player', class: 'CLASSE TESTE',
        level: 1,
        pv: { current: 72, max: 100 },
        ea: { current: 45, max: 100 },
        san: { current: 18, max: 100 },
        shield: null,
        stats: { saude: 3, des: 2, forca: 2, int: 1, fama: 0, sen: 0, re: 0, rf: 0 }
      },
      {
        id: 'sombra', name: 'SOMBRA', type: 'npc', class: 'ENTIDADE',
        level: 2,
        pv: { current: 80, max: 80 },
        ea: { current: 30, max: 30 },
        san: { current: 40, max: 60 },
        shield: null,
        stats: { saude: 2, des: 1, forca: 1, int: 0, fama: 0, sen: 0, re: 0, rf: 0 }
      }
    ]
  };

  /* ---------- ESTADO ---------- */
  let state = null;

  function findById(id) {
    return (state.characters || []).find(c => c.id === id);
  }

  function sanMetaOf(c) {
    const sanCycle = 60;
    const level = Math.min(6, Math.floor(c.san.current / sanCycle));
    const percent = level >= 6
      ? 100
      : Math.min(100, ((c.san.current % sanCycle) / sanCycle) * 100);
    return { level, percent };
  }

  /* ---------- CARD 160x200 (party bar) ---------- */
  function cardFor(c) {
    const s = sanMetaOf(c);
    const activeId = state.combat.active ? state.combat.order[state.combat.index] : null;
    const isActive = c.id === activeId;

    return `
      <div class="char-card ${c.type === 'npc' ? 'npc' : ''} ${isActive ? 'active' : ''}">
        <div class="card-frame" style="${c.type === 'npc' ? 'border-color:#ff4444;' : ''}">
          <div class="card-info">
            <div class="card-name-row">
              <span class="card-name">${c.name}</span>
              <span class="card-level">${c.level || 1}</span>
            </div>
            <div class="card-sub">${c.type === 'npc' ? 'NPC' : (c.class || '')}</div>
            <div class="card-hp">HP ${c.pv.current}/${c.pv.max}</div>
            <div class="card-ea">EA ${c.ea.current}/${c.ea.max}</div>
            <div class="card-san-row">
              <span class="card-san-text">SAN L${s.level}</span>
            </div>
            <div class="card-san-bar">
              <div class="card-san-fill" style="width:${s.percent}%"></div>
            </div>
          </div>
        </div>
      </div>`;
  }

  /* ---------- INIMIGO (card central) ---------- */
  function enemyHtml(c) {
    const activeId = state.combat.active ? state.combat.order[state.combat.index] : null;
    const isActive = c.id === activeId;

    return `
      <div class="enemy-card-display ${isActive ? 'active' : ''}">
        <div class="enemy-name">${c.name}</div>
      </div>`;
  }

  /* ---------- FICHA DO TURNO (lateral) ---------- */
  function barOf(label, key, c, extra) {
    const cur = c[key] ? c[key].current : 0;
    const max = c[key] ? c[key].max : 0;
    const pct = max > 0 ? Math.max(0, Math.min(100, (cur / max) * 100)) : 0;
    return `
      <div class="turn-card-stat">
        <span class="turn-card-stat-label">${label}${extra || ''}</span>
        <div class="turn-card-bar">
          <div class="turn-card-bar-fill ${key}" style="width:${pct}%"></div>
          <span class="turn-card-stat-num">${cur}/${max}</span>
        </div>
      </div>`;
  }

  function attrsHtml(c) {
    const s = c.stats || {};
    const cells = [
      ['SAU', s.saude], ['DES', s.des], ['FOR', s.forca], ['INT', s.int],
      ['FAMA', s.fama], ['SEN', s.sen], ['RE', s.re], ['RF', s.rf]
    ].map(([label, val]) => {
      const v = (val === undefined || val === null) ? '—' : val;
      return `<span class="turn-card-attr">${label}<b>${v}</b></span>`;
    }).join('');
    return cells;
  }

  function renderTurnCard() {
    const card = document.getElementById('turn-card');
    if (!card) return;

    const id = state.combat.active ? state.combat.order[state.combat.index] : null;
    const c = id ? findById(id) : null;
    if (!c || c.type === 'npc') {
      card.classList.remove('show');
      card.innerHTML = '';
      return;
    }

    const s = sanMetaOf(c);

    const content = `
      <div class="turn-card-inner">
        <div class="turn-card-header">
          <div class="turn-card-title">VEZ DE</div>
          <div class="turn-card-name">${c.name}</div>
          <div class="turn-card-class">${c.class || ''}</div>
        </div>
        <div class="turn-card-stats">
          ${barOf('VIDA', 'pv', c)}
          ${barOf('ENERGIA', 'ea', c)}
          ${barOf('ESTRESSE', 'san', c, `<span class="turn-card-san-lv">N${s.level}</span>`)}
          ${c.shield && c.shield.max > 0 ? barOf('ESCUDO', 'shield', c) : ''}
        </div>
        <div class="turn-card-attrs">${attrsHtml(c)}</div>
        <div class="turn-card-footer">
          <span class="turn-card-level-badge">NIVEL ${c.level || 1}</span>
        </div>
      </div>`;

    const changed = card.dataset.lastId !== c.id;
    card.innerHTML = content;
    card.dataset.lastId = c.id;

    card.classList.remove('entering');
    if (changed && card.classList.contains('show')) {
      void card.offsetWidth;
      card.classList.add('entering');
    }
    if (!card.classList.contains('show')) {
      card.classList.add('show');
    }
  }

  /* ---------- BANNER ---------- */
  function renderBanner() {
    const round = document.getElementById('turn-round');
    const active = document.getElementById('turn-active');
    if (!round || !active) return;

    if (!state.combat.active || state.combat.order.length === 0) {
      round.textContent = 'SEM COMBATE';
      active.textContent = '-';
      return;
    }
    round.textContent = 'RODADA ' + state.combat.round;
    const c = findById(state.combat.order[state.combat.index]);
    active.textContent = 'Vez de: ' + (c ? c.name : '?');
  }

  /* ---------- ENEMY ZONE ---------- */
  function renderEnemies() {
    const zone = document.getElementById('enemy-zone');
    if (!zone) return;
    const npcs = state.characters.filter(c => c.type === 'npc');
    zone.innerHTML = npcs.length
      ? npcs.map(enemyHtml).join('')
      : '<span class="placeholder">NPC</span>';
  }

  /* ---------- PARTY BAR ---------- */
  function renderParty() {
    const bar = document.getElementById('party-bar');
    if (!bar) return;
    const players = state.characters.filter(c => c.type !== 'npc');
    bar.innerHTML = players.length
      ? players.map(cardFor).join('')
      : '<span class="party-empty">VAZIO</span>';
  }

  function renderAll() {
    renderBanner();
    renderParty();
    renderEnemies();
    renderTurnCard();
  }

  /* ---------- ANIMAÇÕES (danos fake) ---------- */
  function flashDamage(selector) {
    const el = document.querySelector(selector);
    if (!el) return;
    el.classList.remove('anim-damage');
    void el.offsetWidth;
    el.classList.add('anim-damage');
    setTimeout(() => el.classList.remove('anim-damage'), 350);
  }

  /* ---------- API ---------- */
  window.DeskRenderer = {
    init(data) {
      state = data || TEST_STATE;
      renderAll();
    },
    render() { renderAll(); },
    setTurn(index, round) {
      if (!state) return;
      state.combat.index = index;
      if (round !== undefined) state.combat.round = round;
      renderAll();
    },
    setPv(id, current) {
      if (!state) return;
      const c = findById(id);
      if (!c) return;
      c.pv.current = Math.max(0, Math.min(c.pv.max, current));
      renderParty();
      renderTurnCard();
      flashDamage('#party-bar .char-card.active');
    },
    setEa(id, current) {
      if (!state) return;
      const c = findById(id);
      if (!c) return;
      c.ea.current = Math.max(0, Math.min(c.ea.max, current));
      renderParty();
      renderTurnCard();
    },
    setSan(id, current) {
      if (!state) return;
      const c = findById(id);
      if (!c) return;
      c.san.current = Math.max(0, Math.min(c.san.max, current));
      renderParty();
      renderTurnCard();
    },
    hitEnemy() {
      flashDamage('.enemy-card-display');
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('enemy-zone')) return;
    DeskRenderer.init();
  });
})();