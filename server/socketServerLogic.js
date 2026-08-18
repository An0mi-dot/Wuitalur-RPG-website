/* ========================================================================
 * socketServerLogic.js
 * ------------------------------------------------------------------------
 * Camada "Mestre autoritativo" do DeskRPG (lado servidor).
 *
 * Centraliza TODAS as ações de combate em um único módulo: cada ação
 *  1) lê o estado atual (db.json),
 *  2) delega às regras puras de vitaluCoreLogic.js,
 *  3) registra no log,
 *  4) persiste,
 *  5) faz broadcast via WebSocket (todos veem em tempo real).
 *
 * O servidor (server.js) apenas enfileira as rotas HTTP para estas ações —
 * a lógica de validação vive aqui, não no cliente.
 * ======================================================================== */

const core = require('./public/vitaluCoreLogic.js');

/* Cria o conjunto de ações atadas ao armazenamento/broadcast do app. */
function createCombatActions(deps) {
  const { readDB, writeDB, broadcast, pushLog } = deps;

  // Contexto de log injetado nas funções puras do núcleo.
  const logger = (db) => ({
    log: (text, type) => pushLog(db, text, type),
  });

  const findChar = (db, id) => db.characters.find((c) => c.char_id === Number(id));
  const broadcastState = (db) => broadcast({ type: 'state', characters: db.characters, combat: db.combat });

  const notFound = (msg) => ({ error: msg || 'Personagem não encontrado', code: 404 });

  /* ---------- Ações de personagem ---------- */

  function createCharacter(payload) {
    const db = readDB();
    const id = db.characters.reduce((max, c) => Math.max(max, Number(c.char_id) || 0), 0) + 1;
    const base = core.createCharacter({
      char_id: id,
      char_name: (payload.name || '').trim() || `Personagem ${id}`,
      class: payload.class || '',
      type: payload.type === 'npc' ? 'npc' : 'player',
      vitality_max: Number(payload.pvMax) || 100,
      astral_max: Number(payload.eaMax) || 100,
      stress_max: Number(payload.sanMax) || 60,
    });
    base.vitality_current = base.vitality_max;
    base.astral_current = base.astral_max;
    db.characters.push(base);
    writeDB(db);
    pushLog(db, `${base.char_name} entrou na mesa`, 'system');
    broadcastState(db);
    return base;
  }

  function deleteCharacter(id) {
    const db = readDB();
    const idx = db.characters.findIndex((c) => c.char_id === Number(id));
    if (idx === -1) return notFound();
    const [removed] = db.characters.splice(idx, 1);
    db.combat.order = db.combat.order.filter((oid) => oid !== removed.char_id);
    if (db.combat.index >= db.combat.order.length) db.combat.index = 0;
    writeDB(db);
    pushLog(db, `${removed.char_name} saiu da mesa`, 'system');
    broadcastState(db);
    return { ok: true };
  }

  /* Aceita o schema NOVO E os aliases antigos da UI (pv/ea/san/shield). */
  function updateCharacter(id, body) {
    const db = readDB();
    const char = findChar(db, id);
    if (!char) return notFound();
    const prev = JSON.parse(JSON.stringify(char));

    // Aliases legados -> campos novos
    if (body.pv !== undefined) char.vitality_current = Number(body.pv);
    if (body.ea !== undefined) char.astral_current = Number(body.ea);
    if (body.san !== undefined) char.stress_current = Number(body.san);
    if (body.shield !== undefined) {
      char.shield_current = Number(body.shield);
      // A UI legada (ficha ESCUDO ±5) só manda o valor atual. Para o escudo
      // não ser zerado pelo clamp do máximo, estende shield_max conforme
      // necessário (escudo criado/extendido manualmente pelo Mestre).
      if (char.shield_current > char.shield_max) char.shield_max = char.shield_current;
      if (char.shield_current <= 0) char.shield_duration = 0;
    }
    if (body.pvMax !== undefined) char.vitality_max = Math.max(1, Number(body.pvMax) || 1);
    if (body.eaMax !== undefined) char.astral_max = Math.max(0, Number(body.eaMax) || 0);
    if (body.sanMax !== undefined) char.stress_max = Math.max(0, Number(body.sanMax) || 0);
    if (body.shieldMax !== undefined) char.shield_max = Math.max(0, Number(body.shieldMax) || 0);

    // Campos novos
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

    core.recompute(char);

    diffLog(db, prev, char);
    writeDB(db);
    broadcastState(db);
    return char;
  }

  function diffLog(db, prev, next) {
    const name = next.char_name;
    if (prev.vitality_current !== next.vitality_current) {
      const d = next.vitality_current - prev.vitality_current;
      pushLog(db, d < 0
        ? `${name} sofreu ${Math.abs(d)} de dano (${next.vitality_current}/${next.vitality_max})`
        : `${name} recuperou ${d} de PV (${next.vitality_current}/${next.vitality_max})`,
        d < 0 ? 'damage' : 'heal');
    }
    if (prev.astral_current !== next.astral_current) {
      const d = next.astral_current - prev.astral_current;
      pushLog(db, d < 0
        ? `${name} gastou ${Math.abs(d)} de EA (${next.astral_current}/${next.astral_max})`
        : `${name} recuperou ${d} de EA (${next.astral_current}/${next.astral_max})`,
        'ea');
    }
    if (prev.stress_current !== next.stress_current) {
      const d = next.stress_current - prev.stress_current;
      pushLog(db, d < 0
        ? `${name} perdeu ${Math.abs(d)} de Estresse (${next.stress_current}/${next.stress_max})`
        : `${name} ganhou ${Math.abs(d)} de Estresse (${next.stress_current}/${next.stress_max})`,
        'san');
    }
    if ((prev.shield_current || 0) !== (next.shield_current || 0)) {
      const d = (next.shield_current || 0) - (prev.shield_current || 0);
      pushLog(db, d > 0
        ? `${name} ganhou +${d} de escudo (${next.shield_current}/${next.shield_max})`
        : `${name} perdeu ${Math.abs(d)} de escudo (${next.shield_current}/${next.shield_max})`,
        'shield');
    }
    if (prev.level !== next.level) {
      pushLog(db, `${name} subiu para o nível ${next.level}!`, 'levelup');
    }
  }

  /* ---------- Ações de combate (validadas no servidor) ---------- */

  function damage(payload) {
    const db = readDB();
    const target = findChar(db, payload.target_id);
    if (!target) return notFound();
    const report = core.receiveDamage(target, payload.amount, logger(db));
    writeDB(db);
    broadcastState(db);
    return { ok: true, character: target, report };
  }

  function heal(payload) {
    const db = readDB();
    const target = findChar(db, payload.target_id);
    if (!target) return notFound();
    const healed = core.healCharacter(target, payload.amount, logger(db));
    writeDB(db);
    broadcastState(db);
    return { ok: true, character: target, healed };
  }

  function astral(payload) {
    const db = readDB();
    const target = findChar(db, payload.target_id);
    if (!target) return notFound();
    const d = core.modifyAstral(target, payload.amount, logger(db));
    writeDB(db);
    broadcastState(db);
    return { ok: true, character: target, delta: d };
  }

  function stress(payload) {
    const db = readDB();
    const target = findChar(db, payload.target_id);
    if (!target) return notFound();
    const d = core.modifyStress(target, payload.amount, logger(db));
    writeDB(db);
    broadcastState(db);
    return { ok: true, character: target, delta: d };
  }

  function shield(payload) {
    const db = readDB();
    const target = findChar(db, payload.target_id);
    if (!target) return notFound();
    core.applyShield(target, payload.value, payload.duration, logger(db));
    writeDB(db);
    broadcastState(db);
    return {
      ok: true,
      character: target,
      shield: { current: target.shield_current, max: target.shield_max, duration: target.shield_duration },
    };
  }

  function extraLife(payload) {
    const db = readDB();
    const target = findChar(db, payload.target_id);
    if (!target) return notFound();
    core.applyExtraLife(target, logger(db));
    writeDB(db);
    broadcastState(db);
    return { ok: true, character: target, is_extra_life: target.is_extra_life };
  }

  function condition(payload) {
    const db = readDB();
    const target = findChar(db, payload.target_id);
    if (!target) return notFound();
    const applied = core.applyCondition(target, payload.name, payload.duration, logger(db));
    if (!applied) return { error: `Condição desconhecida: ${payload.name}`, code: 400 };
    writeDB(db);
    broadcastState(db);
    return { ok: true, character: target, conditions: target.conditions };
  }

  function removeConditionAction(payload) {
    const db = readDB();
    const target = findChar(db, payload.target_id);
    if (!target) return notFound();
    const removed = core.removeCondition(target, payload.name, logger(db));
    writeDB(db);
    broadcastState(db);
    return { ok: removed, character: target, conditions: target.conditions };
  }

  function ready(payload) {
    const db = readDB();
    const target = findChar(db, payload.target_id);
    if (!target) return notFound();
    target.is_ready_action = !!payload.ready;
    writeDB(db);
    broadcastState(db);
    return { ok: true, character: target, is_ready_action: target.is_ready_action };
  }

  /* Habilidade: custo de EA validado (regra Wuitalur). Se o alvo é null,
   * habilidade auto-direcionada (ex: escudo/purificação em si). */
  function skill(payload) {
    const db = readDB();
    const actor = findChar(db, payload.actor_id);
    if (!actor) return notFound('Ator não encontrado');
    const target = payload.target_id != null ? findChar(db, payload.target_id) : actor;
    const result = core.useSkill(actor, target, payload.skill, logger(db), payload.params || {});
    if (!result.ok) {
      return { error: result.reason === 'astral_insufficient'
        ? `EA insuficiente (precisa ${result.cost}, tem ${result.has})`
        : 'Habilidade não encontrada', code: result.reason === 'skill_not_found' ? 400 : 422, result };
    }
    writeDB(db);
    broadcastState(db);
    return { ok: true, character: actor, target: target ? target.char_id : null, result };
  }

  /* ---------- Turnos / combate ---------- */

  function startCombatAction(payload) {
    const db = readDB();
    core.startCombat(db.combat, db.characters, payload && payload.round);
    pushLog(db, 'Combate iniciado!', 'system');
    writeDB(db);
    broadcastState(db);
    return db.combat;
  }

  function endCombatAction() {
    const db = readDB();
    core.endCombat(db.combat);
    pushLog(db, 'Combate encerrado.', 'system');
    writeDB(db);
    broadcastState(db);
    return db.combat;
  }

  function nextAction() {
    const db = readDB();
    requireActive(db);
    if (db.combat.order.length === 0) return db.combat;
    core.advanceTurn(db.combat, db.characters, logger(db));
    writeDB(db);
    broadcastState(db);
    return db.combat;
  }

  function prevAction() {
    const db = readDB();
    requireActive(db);
    if (db.combat.order.length === 0) return db.combat;
    db.combat.index -= 1;
    if (db.combat.index < 0) {
      db.combat.index = db.combat.order.length - 1;
      db.combat.round = Math.max(1, db.combat.round - 1);
    }
    const id = db.combat.order[db.combat.index];
    const c = findChar(db, id);
    pushLog(db, `Voltou ao turno de ${c ? c.char_name : '?'}`, 'turn');
    writeDB(db);
    broadcastState(db);
    return db.combat;
  }

  function requireActive(db) {
    if (!db.combat.active || db.combat.order.length === 0) {
      db.combat.order = core.buildOrder(db.characters);
      db.combat.index = 0;
      db.combat.round = 1;
    }
    db.combat.order = db.combat.order.filter((oid) => db.characters.some((c) => c.char_id === oid));
    if (db.combat.order.length === 0) db.combat.active = false;
  }

  function clearLogAction() {
    const db = readDB();
    db.combat.log = [];
    writeDB(db);
    broadcastState(db);
    return db.combat;
  }

  return {
    createCharacter,
    deleteCharacter,
    updateCharacter,
    damage,
    heal,
    astral,
    stress,
    shield,
    extraLife,
    condition,
    removeCondition: removeConditionAction,
    ready,
    skill,
    startCombat: startCombatAction,
    endCombat: endCombatAction,
    nextTurn: nextAction,
    prevTurn: prevAction,
    clearLog: clearLogAction,
  };
}

module.exports = { createCombatActions };