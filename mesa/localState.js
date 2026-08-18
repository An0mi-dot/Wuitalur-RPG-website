/* ========================================================================
 * localState.js — Estado local autoritativo da Mesa (modo Supabase)
 * ------------------------------------------------------------------------
 * Mantém o estado da mesa (characters/combat/ai_chat) em memória e no
 * Postgres (tabela `mesa_state`, linha única id=1). Todas as ações de
 * combate do Mestre são executadas AQUI (validadas com vitaluCoreLogic),
 * persistidas via PostgREST e sincronizadas com os demais clientes via
 * Supabase Realtime (postgres_changes).
 *
 * A única coisa que fica na Edge Function `ai-chat` é a tradução da
 * ordem do mestre (Gemini). O navegador executa a ação resultante.
 * ======================================================================== */

(function (root) {
  'use strict';

  const core = root.vitaluCore || {};
  const LOG_LIMIT = 80;

  let sb = null;
  let db = {
    characters: [],
    combat: { active: false, order: [], index: 0, round: 1, log: [] },
    ai_chat: [],
  };
  let lastSerialized = '';
  const listeners = new Set();

  const SUPABASE_URL = (root.SUPABASE_URL || '');
  const SUPABASE_ANON = (root.SUPABASE_ANON_KEY || '');

  /* ---------- Estado ---------- */

  function normalizeDB(d) {
    const characters = (d && d.characters ? d.characters : [])
      .map((c) => (core.normalizeCharacter ? core.normalizeCharacter(c) : c))
      .filter((c) => c !== null);
    const comb = (d && d.combat) || { active: false, order: [], index: 0, round: 1, log: [] };
    comb.log = comb.log || [];
    return { characters, combat: comb, ai_chat: (d && d.ai_chat) || [] };
  }

  function setDB(next) {
    db = normalizeDB(next);
    fire();
  }

  function fire() {
    const s = JSON.stringify(db);
    if (s === lastSerialized) return;
    lastSerialized = s;
    listeners.forEach((fn) => { try { fn(db); } catch (e) { console.error('[Mesa] listener:', e); } });
  }

  function getDB() { return db; }

  /* ---------- Persistência (PostgREST) ---------- */

  async function persist() {
    if (!sb) return;
    await sb.from('mesa_state').upsert({ id: 1, data: db });
  }

  /* ---------- Notificação ---------- */

  function broadcast(data) {
    // Legacy: a UI moderna escuta via subscribe(); mantemos o contrato.
    data = data || db;
    fire();
  }

  function pushLog(d, text, type) {
    d.combat.log.unshift({ text, type, ts: Date.now() });
    if (d.combat.log.length > LOG_LIMIT) d.combat.log.length = LOG_LIMIT;
  }

  const logger = (d) => ({ log: (text, type) => pushLog(d, text, type) });

  function findChar(d, id) { return d.characters.find((c) => c.char_id === Number(id)); }

  const notFound = (msg) => ({ error: msg || 'Personagem não encontrado', code: 404 });

  /* ---------- Ações autoritativas (porta de socketServerLogic) ---------- */

  async function createCharacter(payload) {
    const d = db;
    const id = d.characters.reduce((max, c) => Math.max(max, Number(c.char_id) || 0), 0) + 1;
    const base = core.createCharacter({
      char_id: id,
      char_name: String(payload.name || '').trim() || `Personagem ${id}`,
      class: payload.class || '',
      type: payload.type === 'npc' ? 'npc' : 'player',
      vitality_max: Number(payload.pvMax) || 100,
      astral_max: Number(payload.eaMax) || 100,
      stress_max: Number(payload.sanMax) || 60,
    });
    base.vitality_current = base.vitality_max;
    base.astral_current = base.astral_max;
    d.characters.push(base);
    pushLog(d, `${base.char_name} entrou na mesa`, 'system');
    await persist();
    fire();
    return base;
  }

  async function deleteCharacter(id) {
    const d = db;
    const idx = d.characters.findIndex((c) => c.char_id === Number(id));
    if (idx === -1) return notFound();
    const [removed] = d.characters.splice(idx, 1);
    d.combat.order = d.combat.order.filter((oid) => oid !== removed.char_id);
    if (d.combat.index >= d.combat.order.length) d.combat.index = 0;
    pushLog(d, `${removed.char_name} saiu da mesa`, 'system');
    await persist();
    fire();
    return { ok: true };
  }

  async function updateCharacter(id, body) {
    const d = db;
    const char = findChar(d, id);
    if (!char) return notFound();
    const prev = JSON.parse(JSON.stringify(char));

    if (body.pv !== undefined) char.vitality_current = Number(body.pv);
    if (body.ea !== undefined) char.astral_current = Number(body.ea);
    if (body.san !== undefined) char.stress_current = Number(body.san);
    if (body.shield !== undefined) {
      char.shield_current = Number(body.shield);
      if (char.shield_current > char.shield_max) char.shield_max = char.shield_current;
      if (char.shield_current <= 0) char.shield_duration = 0;
    }
    if (body.pvMax !== undefined) char.vitality_max = Math.max(1, Number(body.pvMax) || 1);
    if (body.eaMax !== undefined) char.astral_max = Math.max(0, Number(body.eaMax) || 0);
    if (body.sanMax !== undefined) char.stress_max = Math.max(0, Number(body.sanMax) || 0);
    if (body.shieldMax !== undefined) char.shield_max = Math.max(0, Number(body.shieldMax) || 0);

    if (body.vitality_current !== undefined) char.vitality_current = Number(body.vitality_current);
    if (body.vitality_max !== undefined) char.vitality_max = Math.max(1, Number(body.vitality_max) || 1);
    if (body.astral_current !== undefined) char.astral_current = Number(body.astral_current);
    if (body.astral_max !== undefined) char.astral_max = Math.max(0, Number(body.astral_max) || 0);
    if (body.stress_current !== undefined) char.stress_current = Number(body.stress_current);
    if (body.stress_max !== undefined) char.stress_max = Math.max(0, Number(body.stress_max) || 0);
    if (body.shield_current !== undefined) char.shield_current = Number(body.shield_current);
    if (body.shield_max !== undefined) char.shield_max = Math.max(0, Number(body.shield_max) || 0);
    if (body.shield_duration !== undefined) char.shield_duration = Math.max(0, Number(body.shield_duration) || 0);
    if (body.is_extra_life !== undefined) char.is_extra_life = !!body.is_extra_life;
    if (body.is_ready_action !== undefined) char.is_ready_action = !!body.is_ready_action;

    if (body.name !== undefined) char.char_name = String(body.name).trim() || char.char_name;
    if (body.class !== undefined) char.class = String(body.class).trim();
    if (body.level !== undefined) char.level = Math.max(1, Number(body.level) || 1);

    if (core.recompute) core.recompute(char);
    diffLog(d, prev, char);
    await persist();
    fire();
    return char;
  }

  function diffLog(d, prev, next) {
    const name = next.char_name;
    if (prev.vitality_current !== next.vitality_current) {
      const diff = next.vitality_current - prev.vitality_current;
      pushLog(d, diff < 0
        ? `${name} sofreu ${Math.abs(diff)} de dano (${next.vitality_current}/${next.vitality_max})`
        : `${name} recuperou ${diff} de PV (${next.vitality_current}/${next.vitality_max})`,
        diff < 0 ? 'damage' : 'heal');
    }
    if (prev.astral_current !== next.astral_current) {
      const diff = next.astral_current - prev.astral_current;
      pushLog(d, diff < 0
        ? `${name} gastou ${Math.abs(diff)} de EA (${next.astral_current}/${next.astral_max})`
        : `${name} recuperou ${diff} de EA (${next.astral_current}/${next.astral_max})`,
        'ea');
    }
    if (prev.stress_current !== next.stress_current) {
      const diff = next.stress_current - prev.stress_current;
      pushLog(d, diff < 0
        ? `${name} perdeu ${Math.abs(diff)} de Estresse (${next.stress_current}/${next.stress_max})`
        : `${name} ganhou ${Math.abs(diff)} de Estresse (${next.stress_current}/${next.stress_max})`,
        'san');
    }
    if ((prev.shield_current || 0) !== (next.shield_current || 0)) {
      const diff = (next.shield_current || 0) - (prev.shield_current || 0);
      pushLog(d, diff > 0
        ? `${name} ganhou +${diff} de escudo (${next.shield_current}/${next.shield_max})`
        : `${name} perdeu ${Math.abs(diff)} de escudo (${next.shield_current}/${next.shield_max})`,
        'shield');
    }
    if (prev.level !== next.level) {
      pushLog(d, `${name} subiu para o nível ${next.level}!`, 'levelup');
    }
  }

  async function damage(payload) {
    const d = db;
    const target = findChar(d, payload.target_id);
    if (!target) return notFound();
    const report = core.receiveDamage(target, payload.amount, logger(d));
    await persist();
    fire();
    return { ok: true, character: target, report };
  }

  async function heal(payload) {
    const d = db;
    const target = findChar(d, payload.target_id);
    if (!target) return notFound();
    const healed = core.healCharacter(target, payload.amount, logger(d));
    await persist();
    fire();
    return { ok: true, character: target, healed };
  }

  async function astral(payload) {
    const d = db;
    const target = findChar(d, payload.target_id);
    if (!target) return notFound();
    const delta = core.modifyAstral(target, payload.amount, logger(d));
    await persist();
    fire();
    return { ok: true, character: target, delta };
  }

  async function stress(payload) {
    const d = db;
    const target = findChar(d, payload.target_id);
    if (!target) return notFound();
    const delta = core.modifyStress(target, payload.amount, logger(d));
    await persist();
    fire();
    return { ok: true, character: target, delta };
  }

  async function shield(payload) {
    const d = db;
    const target = findChar(d, payload.target_id);
    if (!target) return notFound();
    core.applyShield(target, payload.value, payload.duration, logger(d));
    await persist();
    fire();
    return {
      ok: true,
      character: target,
      shield: { current: target.shield_current, max: target.shield_max, duration: target.shield_duration },
    };
  }

  async function extraLife(payload) {
    const d = db;
    const target = findChar(d, payload.target_id);
    if (!target) return notFound();
    core.applyExtraLife(target, logger(d));
    await persist();
    fire();
    return { ok: true, character: target, is_extra_life: target.is_extra_life };
  }

  async function condition(payload) {
    const d = db;
    const target = findChar(d, payload.target_id);
    if (!target) return notFound();
    const applied = core.applyCondition(target, payload.name, payload.duration, logger(d));
    if (!applied) return { error: `Condição desconhecida: ${payload.name}`, code: 400 };
    await persist();
    fire();
    return { ok: true, character: target, conditions: target.conditions };
  }

  async function removeCondition(payload) {
    const d = db;
    const target = findChar(d, payload.target_id);
    if (!target) return notFound();
    const removed = core.removeCondition(target, payload.name, logger(d));
    await persist();
    fire();
    return { ok: removed, character: target, conditions: target.conditions };
  }

  async function ready(payload) {
    const d = db;
    const target = findChar(d, payload.target_id);
    if (!target) return notFound();
    target.is_ready_action = !!payload.ready;
    await persist();
    fire();
    return { ok: true, character: target, is_ready_action: target.is_ready_action };
  }

  async function skill(payload) {
    const d = db;
    const actor = findChar(d, payload.actor_id);
    if (!actor) return notFound('Ator não encontrado');
    const target = payload.target_id != null ? findChar(d, payload.target_id) : actor;
    const result = core.useSkill(actor, target, payload.skill, logger(d), payload.params || {});
    if (!result.ok) {
      return {
        error: result.reason === 'astral_insufficient'
          ? `EA insuficiente (precisa ${result.cost}, tem ${result.has})`
          : 'Habilidade não encontrada',
        code: result.reason === 'skill_not_found' ? 400 : 422,
        result,
      };
    }
    await persist();
    fire();
    return { ok: true, character: actor, target: target ? target.char_id : null, result };
  }

  async function startCombat(payload) {
    const d = db;
    core.startCombat(d.combat, d.characters, payload && payload.round);
    pushLog(d, 'Combate iniciado!', 'system');
    await persist();
    fire();
    return d.combat;
  }

  async function endCombat() {
    const d = db;
    core.endCombat(d.combat);
    pushLog(d, 'Combate encerrado.', 'system');
    await persist();
    fire();
    return d.combat;
  }

  function requireActive(d) {
    if (!d.combat.active || d.combat.order.length === 0) {
      d.combat.order = core.buildOrder(d.characters);
      d.combat.index = 0;
      d.combat.round = 1;
    }
    d.combat.order = d.combat.order.filter((oid) => d.characters.some((c) => c.char_id === oid));
    if (d.combat.order.length === 0) d.combat.active = false;
  }

  async function nextTurn() {
    const d = db;
    requireActive(d);
    if (d.combat.order.length === 0) return d.combat;
    core.advanceTurn(d.combat, d.characters, logger(d));
    await persist();
    fire();
    return d.combat;
  }

  async function prevTurn() {
    const d = db;
    requireActive(d);
    if (d.combat.order.length === 0) return d.combat;
    d.combat.index -= 1;
    if (d.combat.index < 0) {
      d.combat.index = d.combat.order.length - 1;
      d.combat.round = Math.max(1, d.combat.round - 1);
    }
    const id = d.combat.order[d.combat.index];
    const c = findChar(d, id);
    pushLog(d, `Voltou ao turno de ${c ? c.char_name : '?'}`, 'turn');
    await persist();
    fire();
    return d.combat;
  }

  async function clearLog() {
    const d = db;
    d.combat.log = [];
    await persist();
    fire();
    return d.combat;
  }

  const actions = {
    createCharacter, deleteCharacter, updateCharacter,
    damage, heal, astral, stress, shield, extraLife,
    condition, removeCondition, ready, skill,
    startCombat, endCombat, nextTurn, prevTurn, clearLog,
  };

  /* ---------- Chat com IA (ordem -> ação; executa localmente) ---------- */

  const CONDITION_NAMES = ['sangramento', 'envenenado', 'queimadura', 'confuso', 'paralisado'];

  function compactState(d) {
    const chars = (d.characters || []).map((c) => ({
      id: c.char_id,
      name: c.char_name,
      type: c.type || 'npc',
      pv: c.vitality_current,
      ea: c.astral_current,
      san: c.stress_current,
      shield: c.shield_current > 0 ? c.shield_current : 0,
      conditions: (c.conditions || []).map((x) => ({ name: x.name, duration: x.duration })),
      ready: !!c.is_ready_action,
    }));
    const combat = d.combat || {};
    return {
      personagens: chars,
      combate: {
        ativo: !!combat.active,
        rodada: combat.round || 1,
        vez_de: combat.active && combat.order && combat.order[combat.index] != null
          ? (chars.find((c) => c.id === combat.order[combat.index]) || {}).name
          : null,
      },
    };
  }

  function byName(d, name) {
    if (name == null) return null;
    const found = (d.characters || []).find(
      (c) => String(c.char_name).toLowerCase() === String(name).toLowerCase()
    );
    return found ? found.char_id : null;
  }

  async function executeAiAction(d, action) {
    const a = action && action.action;
    const targetId = (action && action.target_id != null) ? parseInt(action.target_id) : null;
    const tid = targetId != null && !isNaN(targetId) ? targetId : byName(d, action && action.target);

    if (a === 'condition') return actions.condition({ target_id: tid, name: action.name, duration: action.duration });
    if (a === 'remove_condition') return actions.removeCondition({ target_id: tid, name: action.name });
    if (a === 'shield') return actions.shield({ target_id: tid, value: action.value, duration: action.duration });
    if (a === 'damage') return actions.damage({ target_id: tid, amount: action.amount });
    if (a === 'heal') return actions.heal({ target_id: tid, amount: action.amount });
    if (a === 'astral') return actions.astral({ target_id: tid, amount: action.amount });
    if (a === 'stress') return actions.stress({ target_id: tid, amount: action.amount });
    if (a === 'ready') return actions.ready({ target_id: tid, ready: !!action.ready });
    if (a === 'start_combat') return actions.startCombat({});
    if (a === 'end_combat') return actions.endCombat();
    if (a === 'next_turn') return actions.nextTurn();
    if (a === 'prev_turn') return actions.prevTurn();
    if (a === 'clarify') return { ok: false, code: null, clarify: action.message };
    return { ok: false, code: 400, error: `Ação desconhecida: ${a}` };
  }

  function buildAiReply(d, action, result) {
    const a = action && action.action;
    const name = (id) => {
      const c = (d.characters || []).find((x) => x.char_id === parseInt(id));
      return c ? c.char_name : null;
    };
    if (a === 'condition' && result && result.ok) {
      return `Aplicado ${action.name} em ${name(action.target_id)} por ${action.duration} turno(s). O sistema remove sozinho quando zerar.`;
    }
    if (a === 'remove_condition' && result && result.ok) {
      return `Removida a condição ${action.name} de ${name(action.target_id)}.`;
    }
    if (a === 'shield' && result && result.ok) {
      return `Escudo de ${action.value} concedido a ${name(action.target_id)} por ${action.duration} turno(s).`;
    }
    if (a === 'clarify' && result && result.ok === false) {
      return result.clarify || 'Pode repetir com mais detalhe?';
    }
    if (result && result.error) {
      return `Não consegui aplicar: ${result.error}`;
    }
    if (result && result.ok) {
      return 'Ação aplicada com sucesso.';
    }
    return 'Não consegui mapear essa ordem para uma ação do sistema.';
  }

  async function sendAiChat(message) {
    if (!sb) return { reply: 'Ainda não inicializado.', action: null };
    const res = await fetch(`${SUPABASE_URL}/functions/v1/ai-chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SUPABASE_ANON}`,
      },
      body: JSON.stringify({ message, state: compactState(db) }),
    });
    const data = await res.json();
    if (data.error) return { reply: 'Erro: ' + data.error, action: null, raw: data };
    if (data.clarify) {
      const msg = { role: 'user', text: message, ts: Date.now() };
      const rep = { role: 'assistant', text: data.clarify, action: { action: 'clarify' }, ts: Date.now() };
      db.ai_chat.push(msg, rep);
      if (db.ai_chat.length > 100) db.ai_chat = db.ai_chat.slice(-100);
      await persist();
      fire();
      return { reply: data.clarify, action: { action: 'clarify' } };
    }
    const action = data.action;
    const result = await executeAiAction(db, action);
    const reply = buildAiReply(db, action, result);
    db.ai_chat.push({ role: 'user', text: message, ts: Date.now() });
    db.ai_chat.push({ role: 'assistant', text: reply, action: action, ts: Date.now() });
    if (db.ai_chat.length > 100) db.ai_chat = db.ai_chat.slice(-100);
    await persist();
    fire();
    return { reply, action, raw: data };
  }

  /* ---------- Inicialização / Realtime ---------- */

  function subscribe(fn) {
    listeners.add(fn);
    fire();
    return () => listeners.delete(fn);
  }

  async function init() {
    if (!root.supabase) throw new Error('supabase-js não carregado');
    sb = root.supabase.createClient(SUPABASE_URL, SUPABASE_ANON);

    const { data } = await sb.from('mesa_state').select('data').eq('id', 1).maybeSingle();
    if (data && data.data) {
      setDB(data.data);
    } else {
      await sb.from('mesa_state').upsert({ id: 1, data: db });
    }

    sb.channel('mesa')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'mesa_state' }, (payload) => {
        const row = payload.new;
        if (row && row.data) {
          const s = JSON.stringify(row.data);
          if (s !== lastSerialized) setDB(row.data);
        }
      })
      .subscribe();

    return getDB();
  }

  root.Mesa = {
    init, subscribe, getDB,
    actions,
    source: 'supabase',
  };
})(typeof self !== 'undefined' ? self : this);