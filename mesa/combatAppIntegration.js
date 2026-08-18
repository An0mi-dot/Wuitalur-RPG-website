/* ========================================================================
 * combatAppIntegration.js
 * ------------------------------------------------------------------------
 * Integração frontend do DeskRPG.
 *
 * Duas responsabilidades:
 *  1) PROJEÇÃO: o servidor envia personagens no schema novo
 *     (vitality_current, astral_current, ...). A UI já desenhada consome
 *     o schema antigo (c.pv.current, c.ea.current, ...). `toUiCharacter`
 *     traduz o schema autoritativo para o formato que os cards/fichas leem,
 *     SEM alterar nenhum visual.
 *
 *  2) API: expõe helpers prontos (fetch) para todas as ações de combate
 *     validadas no servidor (dano, escudo, vida extra, condições,
 *     habilidades com custo de EA, turnos...). Usáveis pelo console do
 *     navegador ou por futuros botões, sem recriar UI.
 *
 * Depende de vitaluCoreLogic.js (carregado antes).
 * ======================================================================== */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.DeskRPG = factory();
    // Atalho global para uso direto nos scripts de render.
    root.toUiCharacter = root.DeskRPG.toUiCharacter;
    root.postCombatAction = root.DeskRPG.postCombatAction;
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const root = (typeof self !== 'undefined' ? self : (typeof window !== 'undefined' ? window : globalThis));

  /* Traduz um personagem do schema novo para o formato legado da UI.
   * Mantém também os campos novos no objeto (a UI pode ler ambos). */
  function toUiCharacter(c) {
    if (!c) return c;
    return Object.assign({}, c, {
      id: c.char_id,
      name: c.char_name,
      pv: {
        current: c.vitality_current,
        max: c.vitality_max,
      },
      ea: {
        current: c.astral_current,
        max: c.astral_max,
      },
      san: {
        current: c.stress_current,
        max: c.stress_max,
      },
      shield: {
        current: c.shield_current,
        max: c.shield_max || c.shield_current,
        duration: c.shield_duration,
      },
    });
  }

/* Ações autoritativas executadas no navegador via Mesa (Supabase). */
  function localAction(fn) {
    if (typeof root.Mesa === 'undefined' || !root.Mesa.actions) {
      return Promise.resolve({ error: 'Mesa não inicializada', code: 503 });
    }
    try {
      return Promise.resolve(fn(root.Mesa.actions));
    } catch (err) {
      return Promise.resolve({ error: String(err && err.message || err), code: 500 });
    }
  }

  /* Todas as ações da mesa (validadas com vitaluCore no navegador). */
  var api = {
    // ---------- Estado / personagens ----------
    state: function () {
      if (typeof root.Mesa !== 'undefined' && root.Mesa.getDB) {
        return Promise.resolve(root.Mesa.getDB());
      }
      return Promise.resolve({ error: 'Mesa não inicializada', code: 503 });
    },

    // ---------- Atributos (valores absolutos ou deltas validados) ----------
    damage: function (target_id, amount, actor_id) {
      return localAction((a) => a.damage({ target_id: target_id, amount: amount, actor_id: actor_id || null }));
    },
    heal: function (target_id, amount, actor_id) {
      return localAction((a) => a.heal({ target_id: target_id, amount: amount, actor_id: actor_id || null }));
    },
    astral: function (target_id, amount, actor_id) {
      return localAction((a) => a.astral({ target_id: target_id, amount: amount, actor_id: actor_id || null }));
    },
    stress: function (target_id, amount, actor_id) {
      return localAction((a) => a.stress({ target_id: target_id, amount: amount, actor_id: actor_id || null }));
    },
    ready: function (target_id, ready) {
      return localAction((a) => a.ready({ target_id: target_id, ready: !!ready }));
    },

    // ---------- Escudo / vida extra / condições ----------
    shield: function (target_id, value, duration) {
      return localAction((a) => a.shield({ target_id: target_id, value: value, duration: duration }));
    },
    extraLife: function (target_id) {
      return localAction((a) => a.extraLife({ target_id: target_id }));
    },
    condition: function (target_id, name, duration) {
      return localAction((a) => a.condition({ target_id: target_id, name: name, duration: duration }));
    },
    removeCondition: function (target_id, name) {
      return localAction((a) => a.removeCondition({ target_id: target_id, name: name }));
    },
    // ---------- Habilidades ----------
    skill: function (target_id, actor_id, skill_name) {
      return localAction((a) => a.skill({
        target_id: target_id,
        actor_id: actor_id,
        skill: skill_name,
      }));
    },

    // ---------- Combate ----------
    startCombat: function () { return localAction((a) => a.startCombat({})); },
    endCombat: function () { return localAction((a) => a.endCombat()); },
    nextTurn: function () { return localAction((a) => a.nextTurn()); },
    prevTurn: function () { return localAction((a) => a.prevTurn()); },
    clearLog: function () { return localAction((a) => a.clearLog()); },
  };

  return {
    toUiCharacter: toUiCharacter,
    projectCharacters: projectCharacters,
    postCombatAction: function (path, body) {
      // Mantém assinatura: converte /api/<acao> para a respectiva ação local.
      const map = {
        '/api/damage': 'damage', '/api/heal': 'heal', '/api/astral': 'astral',
        '/api/stress': 'stress', '/api/ready': 'ready', '/api/shield': 'shield',
        '/api/extra-life': 'extraLife', '/api/condition': 'condition',
        '/api/condition/remove': 'removeCondition', '/api/skill': 'skill',
        '/api/combat/start': 'startCombat', '/api/combat/end': 'endCombat',
        '/api/combat/next': 'nextTurn', '/api/combat/prev': 'prevTurn',
        '/api/combat/log/clear': 'clearLog',
      };
      const key = map[path];
      if (!key) return Promise.resolve({ error: 'Ação desconhecida: ' + path, code: 404 });
      return localAction((a) => a[key](body || {}));
    },
    api: api,
  };
});