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

/* Base remota opcional (definida por window.MESA_API; vazia = mesma origem). */
  function apiUrl(p) {
    return ((typeof window !== 'undefined' && window.MESA_API) || '') + p;
  }

  /* Projeta um estado inteiro (init/state/update) para a UI. */
  function projectCharacters(list) {
    return (list || []).map(toUiCharacter);
  }

  /* Helper de POST + parse de resposta. */
  function postCombatAction(url, body) {
    return fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body || {}),
    }).then(function (r) { return r.json(); });
  }

  /* Todas as ações autoritativas que o servidor expõe. */
  var api = {
    // ---------- Estado / personagens ----------
    state: function () {
      return fetch(apiUrl('/api/state')).then(function (r) { return r.json(); });
    },

    // ---------- Atributos (valores absolutos ou deltas validados) ----------
    damage: function (target_id, amount, actor_id) {
      return postCombatAction(apiUrl('/api/damage'), { target_id: target_id, amount: amount, actor_id: actor_id || null });
    },
    heal: function (target_id, amount, actor_id) {
      return postCombatAction(apiUrl('/api/heal'), { target_id: target_id, amount: amount, actor_id: actor_id || null });
    },
    astral: function (target_id, amount, actor_id) {
      return postCombatAction(apiUrl('/api/astral'), { target_id: target_id, amount: amount, actor_id: actor_id || null });
    },
    stress: function (target_id, amount, actor_id) {
      return postCombatAction(apiUrl('/api/stress'), { target_id: target_id, amount: amount, actor_id: actor_id || null });
    },
    ready: function (target_id, ready) {
      return postCombatAction(apiUrl('/api/ready'), { target_id: target_id, ready: !!ready });
    },

    // ---------- Escudo / vida extra / condições ----------
    shield: function (target_id, value, duration) {
      return postCombatAction(apiUrl('/api/shield'), { target_id: target_id, value: value, duration: duration });
    },
    extraLife: function (target_id) {
      return postCombatAction(apiUrl('/api/extra-life'), { target_id: target_id });
    },
    condition: function (target_id, name, duration) {
      return postCombatAction(apiUrl('/api/condition'), { target_id: target_id, name: name, duration: duration });
    },
    removeCondition: function (target_id, name) {
      return postCombatAction(apiUrl('/api/condition/remove'), { target_id: target_id, name: name });
    },
    // ---------- Habilidades ----------
    skill: function (target_id, actor_id, skill_name) {
      return postCombatAction(apiUrl('/api/skill'), {
        target_id: target_id,
        actor_id: actor_id,
        skill: skill_name,
      });
    },

    // ---------- Combate ----------
    startCombat: function () { return postCombatAction(apiUrl('/api/combat/start'), {}); },
    endCombat: function () { return postCombatAction(apiUrl('/api/combat/end'), {}); },
    nextTurn: function () { return postCombatAction(apiUrl('/api/combat/next'), {}); },
    prevTurn: function () { return postCombatAction(apiUrl('/api/combat/prev'), {}); },
    clearLog: function () { return postCombatAction(apiUrl('/api/combat/log/clear'), {}); },
  };

  return {
    toUiCharacter: toUiCharacter,
    projectCharacters: projectCharacters,
    postCombatAction: postCombatAction,
    api: api,
  };
});