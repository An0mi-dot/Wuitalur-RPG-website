/* ========================================================================
 * vitaluCoreLogic.js
 * ------------------------------------------------------------------------
 * Núcleo da lógica de combate do sistema Wuitalur (DeskRPG).
 *
 * Esta é a camada "cérebro" do app: contém APENAS regras e funções puras
 * de combate, sem depender de Express, WebSocket ou browser. O mesmo
 * arquivo é usado:
 *   - No servidor (Node.js / CommonJS) como autoridade da lógica;
 *   - No navegador (attach a `window.vitaluCore`) para validação local.
 *
 * Estrutura de dados de um personagem (schema novo / autoritativo):
 *   char_id          - identificador único
 *   char_name        - nome
 *   class, type      - classe e tipo ('player' | 'npc' | 'enemy')
 *   element, image   - elemento do sistema e símbolo (SVG)
 *   level
 *   vitality_current / vitality_max   (PV  - Pontos de Vida)
 *   astral_current   / astral_max     (EA  - Energia Astral)
 *   stress_current   / stress_max     (Estresse)
 *   sanitized_value  - derivado do estresse (nível de sanidade 0..6)
 *   shield_current   / shield_max     (escudo temporário absorve dano)
 *   shield_duration  - turnos restantes do escudo
 *   is_extra_life    - "vida extra" impede a morte uma vez
 *   is_ready_action  - segurando/preparando uma ação
 *   conditions       - [{ name, duration, effect_details }]
 * ======================================================================== */

(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.vitaluCore = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  // Ciclo de estresse do Wuitalur: cada 60 pontos = 1 "nível" de sanidade.
  // A barra de estresse da UI mostra o nível N (0..6) baseado nisso.
  var STRESS_CYCLE = 60;
  var MAX_SANITY_LEVEL = 6;

  // PV que sobra quando a vida extra salva o personagem da morte.
  var EXTRA_LIFE_PV = 1;

  /* --------------------------------------------------------------------
   * Definições de condições (efeitos negativos).
   * Cada condição pode definir `onTurnStart`, aplicado no início do turno
   * do personagem afetado. `name` e `duration` são obrigatórios.
   * -------------------------------------------------------------------- */
  var CONDITIONS = {
    sangramento: {
      name: 'Sangramento',
      onTurnStart: function (c) {
        c.vitality_current = Math.max(0, c.vitality_current - 4);
      },
    },
    envenenado: {
      name: 'Envenenado',
      onTurnStart: function (c) {
        c.vitality_current = Math.max(0, c.vitality_current - 3);
      },
    },
    queimadura: {
      name: 'Queimadura',
      onTurnStart: function (c) {
        c.vitality_current = Math.max(0, c.vitality_current - 5);
      },
    },
    confuso: {
      name: 'Confuso',
      effect_details: 'Sofre 5 de estresse no início do turno.',
      onTurnStart: function (c) {
        c.stress_current = Math.min(c.stress_max, c.stress_current + 5);
        recompute(c);
      },
    },
    paralisado: {
      name: 'Paralisado',
      effect_details: 'Não pode segurar/preparar ações.',
      onTurnStart: function (c) {
        c.is_ready_action = false;
      },
    },
  };

  /* --------------------------------------------------------------------
   * Registro de habilidades (SKILLS) — demonstra a mecânica de EA.
   * Cada habilidade tem `cost` (Energia Astral) e `effect`. A validação
   * de custo é central no servidor: sem EA suficiente, a habilidade
   * NÃO é executada (bloqueio de uso por falta de energia).
   * Nova habilidade = novo item neste registro (e/ou estendido pela UI).
   * -------------------------------------------------------------------- */
  var SKILLS = {
    atacar: {
      name: 'Atacar',
      cost: 0,
      effect: function (ctx, actor, target, params) {
        var dmg = params && params.power ? params.power : 5;
        return receiveDamage(target, dmg, ctx);
      },
    },
    golpe_furioso: {
      name: 'Golpe Furioso',
      cost: 15,
      effect: function (ctx, actor, target, params) {
        var dmg = params && params.power ? params.power : 18;
        return receiveDamage(target, dmg, ctx);
      },
    },
    escudo_astral: {
      name: 'Escudo Astral',
      cost: 20,
      target: 'self',
      effect: function (ctx, actor, target, params) {
        var value = params && params.power ? params.power : 15;
        var dur = params && params.duration ? params.duration : 3;
        applyShield(actor, value, dur, ctx);
        return { ok: true, shield: value, duration: dur };
      },
    },
    sangue_frio: {
      name: 'Sangue Frio',
      cost: 10,
      effect: function (ctx, actor, target, params) {
        var dur = params && params.duration ? params.duration : 3;
        applyCondition(target, 'sangramento', dur, ctx);
        return { ok: true, condition: 'sangramento', duration: dur };
      },
    },
    purificacao: {
      name: 'Purificação',
      cost: 25,
      effect: function (ctx, actor, target, params) {
        var amount = params && params.power ? params.power : 20;
        healCharacter(target, amount, ctx);
        return { ok: true, healed: amount };
      },
    },
    grito_de_guerra: {
      name: 'Grito de Guerra',
      cost: 10,
      effect: function (ctx, actor, target, params) {
        var dur = params && params.duration ? params.duration : 2;
        applyCondition(target, 'confuso', dur, ctx);
        return { ok: true, condition: 'confuso', duration: dur };
      },
    },
  };

  /* ---------------------- utilidades ------------------------------ */

  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }

  function num(v, fallback) {
    var n = Number(v);
    return isNaN(n) ? fallback : n;
  }

  /* Recálculo/estado derivado: mantém os valores dentro dos máximos e
   * atualiza o sanitized_value a partir do estresse. */
  function recompute(c) {
    if (!c) return;
    c.vitality_current = clamp(num(c.vitality_current, 0), 0, c.vitality_max);
    c.astral_current = clamp(num(c.astral_current, 0), 0, c.astral_max);
    c.stress_current = clamp(num(c.stress_current, 0), 0, c.stress_max);
    c.shield_current = clamp(num(c.shield_current, 0), 0, c.shield_max);
    if (c.shield_current <= 0) c.shield_duration = 0;
    c.sanitized_value = computeSanitized(c.stress_current);
  }

  /* Nível de sanidade derivado dos pontos de estresse (regra Wuitalur:
   * a cada 60 de estresse o personagem avança para o próximo nível N). */
  function computeSanitized(stressCurrent) {
    return Math.min(MAX_SANITY_LEVEL, Math.floor(num(stressCurrent, 0) / STRESS_CYCLE));
  }

  /* ---------------------- criação / migração ---------------------- */

  /* Personagem novo com todos os campos do schema autoritativo. */
  function createCharacter(data) {
    return {
      char_id: num(data && data.char_id, null),
      char_name: (data && data.char_name) || 'Sem nome',
      class: (data && data.class) || '',
      element: (data && data.element) || '',
      type: data && data.type === 'npc' ? 'npc' : 'player',
      image: (data && data.image) || '',
      level: num(data && data.level, 1) || 1,
      vitality_current: num(data && data.vitality_current, (data && data.pv && data.pv.max) || 10),
      vitality_max: num(data && data.vitality_max, (data && data.pv && data.pv.max) || 100),
      astral_current: num(data && data.astral_current, (data && data.ea && data.ea.current) || 0),
      astral_max: num(data && data.astral_max, (data && data.ea && data.ea.max) || 100),
      stress_current: num(data && data.stress_current, (data && data.san && data.san.current) || 0),
      stress_max: num(data && data.stress_max, (data && data.san && data.san.max) || 60),
      sanitized_value: 0,
      shield_current: num(data && data.shield_current, (data && data.shield && data.shield.current) || 0),
      shield_max: num(data && data.shield_max, (data && data.shield && data.shield.max) || 0),
      shield_duration: num(data && data.shield_duration, 0),
      is_extra_life: !!(data && data.is_extra_life),
      is_ready_action: !!(data && data.is_ready_action),
      conditions: Array.isArray(data && data.conditions) ? data.conditions.slice() : [],
      race: (data && data.race) || '',
      origin: (data && data.origin) || '',
      age: data && data.age != null ? data.age : null,
      height: (data && data.height) || '',
      languages: (data && data.languages) || '',
      money: (data && data.money) || '',
      def: num(data && data.def, 0),
      defe: num(data && data.defe, 0),
      weight: (data && data.weight) || '',
      movement: (data && data.movement) || '',
      stats: data && data.stats ? data.stats : null,
      resist: (data && data.resist) || '',
      skills: Array.isArray(data && data.skills) ? data.skills.slice() : [],
      weapons: (data && data.weapons) || '',
    };
  }

  /* Migra o schema antigo (pv/ea/san/shield aninhados) para o novo. */
  function normalizeCharacter(raw) {
    if (!raw) return null;
    var c = createCharacter(raw);
    if (c.char_id == null) c.char_id = num(raw.id, null);
    if (!c.char_name || c.char_name === 'Sem nome') c.char_name = raw.name || c.char_name;
    if (raw.pv && raw.pv.max) c.vitality_max = num(raw.pv.max, c.vitality_max);
    if (raw.pv && raw.pv.current != null) c.vitality_current = num(raw.pv.current, c.vitality_current);
    if (raw.ea && raw.ea.max) c.astral_max = num(raw.ea.max, c.astral_max);
    if (raw.ea && raw.ea.current != null) c.astral_current = num(raw.ea.current, c.astral_current);
    if (raw.san && raw.san.max) c.stress_max = num(raw.san.max, c.stress_max);
    if (raw.san && raw.san.current != null) c.stress_current = num(raw.san.current, c.stress_current);
    if (raw.shield && raw.shield.max) c.shield_max = num(raw.shield.max, c.shield_max);
    if (raw.shield && raw.shield.current != null) c.shield_current = num(raw.shield.current, c.shield_current);
    recompute(c);
    return c;
  }

  /* ---------------------- PV / Vitalidade ------------------------- */

  /* Recebimento de dano (regra do escudo + vida extra):
   *  1) dano é absorvido primeiro por shield_current;
   *  2) excesso vai para vitality_current;
   *  3) se vitality chegar a 0 e is_extra_life estiver ativo, salva em 1 PV
   *     e consome a vida extra (flag volta a false).
   * Retorna um relatório do que aconteceu para fins de animação/log. */
  function receiveDamage(character, damageValue, ctx, params) {
    var report = {
      targetId: character && character.char_id,
      damageValue: damageValue,
      shieldAbsorbed: 0,
      vitalityReduced: 0,
      extraLifeTriggered: false,
      killed: false,
    };
    if (!character) return report;

    var remaining = Math.max(0, num(damageValue, 0));

    // 1) Escudo primeiro
    if (character.shield_current > 0 && remaining > 0) {
      var absorbed = Math.min(character.shield_current, remaining);
      character.shield_current -= absorbed;
      report.shieldAbsorbed = absorbed;
      remaining -= absorbed;
      if (character.shield_current <= 0) {
        character.shield_current = 0;
        character.shield_duration = 0; // duração resetada quando o escudo quebra
      }
      if (ctx && ctx.log && absorbed > 0) {
        ctx.log(character.char_name + ' bloqueou ' + absorbed + ' de dano com o escudo.', 'shield');
      }
    }

    // 2) Restante vai para a vitalidade
    if (remaining > 0) {
      var before = character.vitality_current;
      character.vitality_current = Math.max(0, character.vitality_current - remaining);
      report.vitalityReduced = before - character.vitality_current;
      if (ctx && ctx.log && report.vitalityReduced > 0) {
        ctx.log(character.char_name + ' sofreu ' + report.vitalityReduced + ' de dano (' + character.vitality_current + '/' + character.vitality_max + ')', 'damage');
      }

      // 3) Vida extra impede a morte
      if (character.vitality_current <= 0 && character.is_extra_life) {
        character.vitality_current = EXTRA_LIFE_PV;
        character.is_extra_life = false;
        report.extraLifeTriggered = true;
        if (ctx && ctx.log) ctx.log(character.char_name + ' resistiu à morte pela VIDA EXTRA!', 'extra-life');
      }
      if (character.vitality_current <= 0) report.killed = true;
    }

    if (character.vitality_current <= 0 && ctx && ctx.log && !report.extraLifeTriggered) {
      ctx.log(character.char_name + ' foi derrubado!', 'system');
    }

    recompute(character);
    return report;
  }

  /* Cura de vitalidade (não ultrapassa o máximo). */
  function healCharacter(character, amount, ctx) {
    if (!character) return 0;
    var before = character.vitality_current;
    character.vitality_current = clamp(character.vitality_current + Math.max(0, num(amount, 0)), 0, character.vitality_max);
    var healed = character.vitality_current - before;
    if (ctx && ctx.log && healed > 0) {
      ctx.log(character.char_name + ' recuperou ' + healed + ' de PV (' + character.vitality_current + '/' + character.vitality_max + ')', 'heal');
    }
    recompute(character);
    return healed;
  }

  /* ---------------------- EA / Energia Astral ---------------------- */

  /* Gasta energia astral. Retorna false se insuficiente (habilidade
   * bloqueada) — regra do sistema Wuitalur para custo de habilidades. */
  function spendAstral(character, amount, ctx) {
    if (!character) return false;
    var cost = Math.max(0, num(amount, 0));
    if (character.astral_current < cost) return false;
    character.astral_current -= cost;
    recompute(character);
    if (ctx && ctx.log && cost > 0) {
      ctx.log(character.char_name + ' gastou ' + cost + ' de EA (' + character.astral_current + '/' + character.astral_max + ')', 'ea');
    }
    return true;
  }

  function canAffordAstral(character, amount) {
    return !!(character && character.astral_current >= Math.max(0, num(amount, 0)));
  }

  /* Ajusta EA direto (delta pode ser positivo = recupera, negativo = gasta). */
  function modifyAstral(character, delta, ctx) {
    if (!character) return 0;
    var before = character.astral_current;
    character.astral_current = clamp(character.astral_current + num(delta, 0), 0, character.astral_max);
    var d = character.astral_current - before;
    if (ctx && ctx.log && d !== 0) {
      ctx.log(character.char_name + (d < 0 ? ' gastou ' + Math.abs(d) : ' recuperou ' + d) + ' de EA (' + character.astral_current + '/' + character.astral_max + ')', 'ea');
    }
    recompute(character);
    return d;
  }

  /* ---------------------- Estresse -------------------------------- */

  function modifyStress(character, delta, ctx) {
    if (!character) return 0;
    var before = character.stress_current;
    character.stress_current = clamp(character.stress_current + num(delta, 0), 0, character.stress_max);
    var d = character.stress_current - before;
    if (ctx && ctx.log && d !== 0) {
      ctx.log(character.char_name + ' teve ' + Math.abs(d) + ' de estresse ' + (d < 0 ? 'recuperado' : 'aplicado') + ' (' + character.stress_current + '/' + character.stress_max + ')', 'san');
    }
    recompute(character);
    return d;
  }

  /* ---------------------- Escudo ---------------------------------- */

  /* Aplica um escudo temporário: define shield_current, shield_max e
   * shield_duration (em turnos). O escudo absorve dano antes da vida. */
  function applyShield(character, shieldValue, duration, ctx) {
    if (!character) return;
    var value = Math.max(0, num(shieldValue, 0));
    character.shield_current = value;
    character.shield_max = value;
    character.shield_duration = Math.max(0, num(duration, 0));
    recompute(character);
    if (ctx && ctx.log && value > 0) {
      ctx.log(character.char_name + ' ganhou um escudo de ' + value + ' por ' + character.shield_duration + ' turnos.', 'shield');
    }
  }

  /* ---------------------- Vida extra ------------------------------ */

  function applyExtraLife(character, ctx) {
    if (!character) return;
    character.is_extra_life = true;
    if (ctx && ctx.log) ctx.log(character.char_name + ' está protegido pela VIDA EXTRA.', 'extra-life');
  }

  /* ---------------------- Condições ------------------------------- */

  function applyCondition(character, conditionName, duration, ctx) {
    if (!character || !CONDITIONS[conditionName]) return false;
    var existing = character.conditions.find(function (c) {
      return c.name === conditionName;
    });
    var dur = Math.max(1, num(duration, 1));
    if (existing) {
      existing.duration = Math.max(existing.duration, dur);
    } else {
      character.conditions.push({
        name: conditionName,
        duration: dur,
        effect_details: CONDITIONS[conditionName].effect_details || null,
      });
    }
    if (ctx && ctx.log) {
      ctx.log(character.char_name + ' agora está com condição: ' + CONDITIONS[conditionName].name + ' (duração ' + dur + ').', 'condition');
    }
    return true;
  }

  function removeCondition(character, conditionName, ctx) {
    if (!character) return false;
    var idx = character.conditions.findIndex(function (c) {
      return c.name === conditionName;
    });
    if (idx === -1) return false;
    character.conditions.splice(idx, 1);
    if (ctx && ctx.log) ctx.log(character.char_name + ' não está mais sob ' + conditionName + '.', 'condition');
    return true;
  }

  /* Início de turno: decrementa a duração de cada condição e aplica o
   * efeito onTurnStart. Condições com duração zerada são removidas. */
  function applyTurnStartConditions(character, ctx) {
    if (!character || !Array.isArray(character.conditions)) return;
    for (var i = character.conditions.length - 1; i >= 0; i--) {
      var cond = character.conditions[i];
      var def = CONDITIONS[cond.name];
      if (def && def.onTurnStart) def.onTurnStart(character, ctx || {});
      cond.duration = Math.max(0, num(cond.duration, 0) - 1);
      if (ctx && ctx.log && def) {
        ctx.log(character.char_name + ': ' + def.name + ' (restam ' + cond.duration + ' turnos)', 'condition');
      }
      if (cond.duration <= 0) {
        character.conditions.splice(i, 1);
        if (ctx && ctx.log) ctx.log(character.char_name + ': condição ' + (def ? def.name : cond.name) + ' terminou.', 'condition');
      }
    }
    recompute(character);
  }

  /* ---------------------- Habilidades ----------------------------- */

  /* Executa uma habilidade: valida o custo de EA ANTES de qualquer
   * efeito. Se não houver energia suficiente, retorna erro e nada muda. */
  function useSkill(actor, target, skillName, ctx, params) {
    var skill = SKILLS[skillName];
    if (!skill) return { ok: false, reason: 'skill_not_found', skill: skillName };
    if (!canAffordAstral(actor, skill.cost)) {
      return {
        ok: false,
        reason: 'astral_insufficient',
        cost: skill.cost,
        has: actor.astral_current,
        skill: skillName,
      };
    }
    spendAstral(actor, skill.cost, ctx);
    var result = skill.effect(ctx || {}, actor, target, params || {}) || {};
    recompute(actor);
    if (target) recompute(target);
    return { ok: true, skill: skillName, cost: skill.cost, result: result };
  }

  /* ---------------------- Turnos / Combate ------------------------ */

  /* Avança um turno: move o personagem atual para o fim da fila e aplica
   * os efeitos de início de turno (condições) no próximo personagem. */
  function advanceTurn(combat, characters, ctx) {
    if (!combat || !combat.active || !combat.order.length) return false;
    var index = clamp(combat.index, 0, combat.order.length - 1);
    var currentId = combat.order[index];
    combat.order.splice(index, 1);
    combat.order.push(currentId);

    // Se estava no fim da fila, nova rodada
    if (combat.order.length > 0 && index >= combat.order.length) combat.index = 0;
    else combat.index = index;

    var nextId = combat.order[combat.index];
    var next = null;
    for (var i = 0; i < characters.length; i++) {
      if (characters[i].char_id === nextId) { next = characters[i]; break; }
    }
    if (next) applyTurnStartConditions(next, ctx || {});
    if (ctx && ctx.log && next) ctx.log('Turno para ' + next.char_name, 'turn');
    return next ? next.char_id : null;
  }

  /* Define o próximo/atual ativo (para start o index 0 inicia a rodada 1). */
  function startCombat(combat, characters, round) {
    combat.active = true;
    combat.order = characters.map(function (c) { return c.char_id; });
    combat.index = 0;
    combat.round = Math.max(1, num(round, 1)) || 1;
  }

  function endCombat(combat) {
    combat.active = false;
    combat.order = [];
    combat.index = 0;
    combat.round = 1;
  }

  function buildOrder(characters) {
    return characters.map(function (c) { return c.char_id; });
  }

  /* ---------------------- Exports ---------------------------------- */

  return {
    STRESS_CYCLE: STRESS_CYCLE,
    MAX_SANITY_LEVEL: MAX_SANITY_LEVEL,
    EXTRA_LIFE_PV: EXTRA_LIFE_PV,
    CONDITIONS: CONDITIONS,
    SKILLS: SKILLS,
    createCharacter: createCharacter,
    normalizeCharacter: normalizeCharacter,
    computeSanitized: computeSanitized,
    recompute: recompute,
    receiveDamage: receiveDamage,
    healCharacter: healCharacter,
    spendAstral: spendAstral,
    canAffordAstral: canAffordAstral,
    modifyAstral: modifyAstral,
    modifyStress: modifyStress,
    applyShield: applyShield,
    applyExtraLife: applyExtraLife,
    applyCondition: applyCondition,
    removeCondition: removeCondition,
    applyTurnStartConditions: applyTurnStartConditions,
    useSkill: useSkill,
    advanceTurn: advanceTurn,
    startCombat: startCombat,
    endCombat: endCombat,
    buildOrder: buildOrder,
  };
});