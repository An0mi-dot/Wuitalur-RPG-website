// ============================================================
// WUITALUR RPG 2.0 - MOTOR DE CALCULO REATIVO (CALCULATION ENGINE)
// ============================================================

(function(global) {
  let Registry = null;

  function getRegistry() {
    if (Registry) return Registry;
    if (typeof module !== "undefined" && module.exports) {
      Registry = require("./rules-registry.js");
    } else if (global.WuRulesRegistry) {
      Registry = global.WuRulesRegistry;
    }
    return Registry;
  }

  function calculateMaestry(level) {
    const reg = getRegistry();
    return reg ? reg.getMaestry(level) : (level >= 13 ? 16 : level >= 9 ? 8 : level >= 5 ? 4 : 2);
  }

  function calculateEffectiveAttributes(charData, customRegistry) {
    const reg = customRegistry || getRegistry();
    const effective = {
      for: 0,
      des: 0,
      vig: 0,
      men: 0,
      exp: 0
    };

    const base = (charData && charData.attributes && charData.attributes.base) || {};
    const mod = (charData && charData.attributes && charData.attributes.modifiers) || {};

    for (const key of ["for", "des", "vig", "men", "exp"]) {
      effective[key] = (Number(base[key]) || 0) + (Number(mod[key]) || 0);
    }

    return effective;
  }

  function calculateVitals(charData, effectiveAttrs, maestry, customRegistry) {
    const reg = customRegistry || getRegistry();
    const level = Math.min(15, Math.max(1, Number(charData?.progression?.level) || 1));
    const raceId = charData?.identity?.raceId || "";
    const classId = charData?.identity?.classId || "";

    const raceDef = reg ? reg.getRace(raceId) : null;
    const classDef = reg ? reg.getClass(classId) : null;

    let resourceType = "pv";
    let resourceLabel = "Pontos de Vida";
    let maxVital = 10;
    let allowMedicine = true;
    let allowExternalHealing = true;
    let deathSaves = { maxFailures: 3, critStabilize: [20] };

    // 1. Verificacao de Substituicoes de Raca (Overrides de Vitalidade)
    if (raceDef && raceDef.overrides && raceDef.overrides.vitalResource) {
      const override = raceDef.overrides.vitalResource;
      resourceType = override.type || "custom";
      resourceLabel = override.label || "Vitalidade";

      if (typeof override.formula === "function") {
        maxVital = override.formula(effectiveAttrs, level, classDef || { baseHpInitial: 10, baseHpPerLevel: 6 });
      }

      if (override.allowMedicine !== undefined) allowMedicine = override.allowMedicine;
      if (override.allowExternalHealing !== undefined) allowExternalHealing = override.allowExternalHealing;
      if (override.deathSaves) deathSaves = override.deathSaves;
    } else if (classDef) {
      // Calculo Padrao de Vida da Classe
      const initHp = classDef.baseHpInitial || 10;
      const perLevelHp = classDef.baseHpPerLevel || 6;
      maxVital = (initHp + effectiveAttrs.vig) + ((level - 1) * (perLevelHp + effectiveAttrs.vig));
    } else {
      maxVital = (10 + effectiveAttrs.vig) + ((level - 1) * (6 + effectiveAttrs.vig));
    }

    // 2. Bonus Permanentes de Habilidades de Classe (ex: Massa Titanica no Nivel 4)
    if (classDef && classDef.progression && classDef.progression.characteristicAbilities) {
      for (const reqLevelStr in classDef.progression.characteristicAbilities) {
        const reqLevel = Number(reqLevelStr);
        if (level >= reqLevel) {
          const charAbility = classDef.progression.characteristicAbilities[reqLevelStr];
          if (charAbility && charAbility.permanentHpBonus) {
            maxVital += charAbility.permanentHpBonus;
          }
        }
      }
    }

    // 3. Calculo de Energia Astral (EA)
    let maxEa = 20;
    if (classDef) {
      const initEa = classDef.baseEaInitial !== undefined ? classDef.baseEaInitial : 20;
      const perLevelEa = classDef.baseEaPerLevel !== undefined ? classDef.baseEaPerLevel : 5;
      maxEa = initEa + ((level - 1) * perLevelEa);

      // Bonus Permanentes de EA (ex: Fonte de Luz no Nivel 4)
      if (classDef.progression && classDef.progression.characteristicAbilities) {
        for (const reqLevelStr in classDef.progression.characteristicAbilities) {
          const reqLevel = Number(reqLevelStr);
          if (level >= reqLevel) {
            const charAbility = classDef.progression.characteristicAbilities[reqLevelStr];
            if (charAbility && charAbility.permanentEaBonus) {
              maxEa += charAbility.permanentEaBonus;
            }
          }
        }
      }
    }

    const damageTaken = Number(charData?.vitalsState?.damageTaken) || 0;
    const tempHp = Number(charData?.vitalsState?.tempHp) || 0;
    const eaSpent = Number(charData?.vitalsState?.eaSpent) || 0;

    const currentVital = Math.max(0, maxVital - damageTaken);
    const currentEa = Math.max(0, maxEa - eaSpent);

    return {
      resourceType,
      resourceLabel,
      max: Math.max(1, maxVital),
      current: currentVital,
      temp: tempHp,
      allowMedicine,
      allowExternalHealing,
      deathSaves,
      energyAstral: {
        max: Math.max(0, maxEa),
        current: currentEa
      }
    };
  }

  function calculateDefense(charData, effectiveAttrs, customRegistry) {
    const reg = customRegistry || getRegistry();
    const raceId = charData?.identity?.raceId || "";
    const raceDef = reg ? reg.getRace(raceId) : null;

    let baseDef = 10 + effectiveAttrs.des;
    let armorBonus = 0;
    let shieldBonus = 0;
    let otherBonus = 0;

    if (raceDef && raceDef.defenseBonus) {
      otherBonus += raceDef.defenseBonus;
    }

    const armor = charData?.equipment?.armor;
    if (armor && armor.equipped) {
      armorBonus = Number(armor.armorBonus) || 0;
    }

    const shield = charData?.equipment?.shield;
    if (shield && shield.equipped) {
      shieldBonus = Number(shield.defenseBonus) || 0;
    }

    return {
      base: baseDef,
      armorBonus,
      shieldBonus,
      otherBonus,
      total: baseDef + armorBonus + shieldBonus + otherBonus
    };
  }

  function calculateLoad(charData, effectiveAttrs, customRegistry) {
    const reg = customRegistry || getRegistry();
    // Regra do Capitulo 6: Espacos de Carga = (FOR * 3) + 5, minimo 5
    const maxLoad = Math.max(5, (effectiveAttrs.for * 3) + 5);

    let currentLoad = 0;
    const ownedKitIds = new Set();

    if (Array.isArray(charData?.equipment?.kits)) {
      for (const kit of charData.equipment.kits) {
        ownedKitIds.add(kit.id);
        currentLoad += Number(kit.load) || 0;
      }
    }

    // Armas: equipadas em maos ativas nao ocupam carga (ate 2 maos)
    if (Array.isArray(charData?.equipment?.weapons)) {
      let equippedCount = 0;
      for (const weapon of charData.equipment.weapons) {
        if (weapon.equipped && equippedCount < 2) {
          equippedCount += (weapon.twoHanded ? 2 : 1);
        } else {
          currentLoad += Number(weapon.load) || 1;
        }
      }
    }

    // Armadura vestida nao ocupa carga na mochila
    const armor = charData?.equipment?.armor;
    if (armor && !armor.equipped) {
      currentLoad += Number(armor.load) || 2;
    }

    // Escudo empunhado
    const shield = charData?.equipment?.shield;
    if (shield && !shield.equipped) {
      currentLoad += Number(shield.load) || 1;
    }

    // Itens individuais e Regra Especial de Armazenamento do Kit
    if (Array.isArray(charData?.equipment?.items)) {
      for (const item of charData.equipment.items) {
        // Se o item esta guardado dentro de um kit possuido, seu peso nao soma individualmente
        if (item.kitId && ownedKitIds.has(item.kitId)) {
          continue;
        }
        currentLoad += (Number(item.load) || 1) * (Number(item.quantity) || 1);
      }
    }

    let status = "normal";
    let penalties = [];

    if (currentLoad > maxLoad + 3) {
      status = "sobrecarga_pesada";
      penalties = [
        "Desvantagem em todos os testes fisicos de Forca, Destreza e Vigor.",
        "Impossibilidade de realizar reacoes ageis de esquiva."
      ];
    } else if (currentLoad > maxLoad) {
      status = "sobrecarga_leve";
      penalties = [
        "Penalidade de -2 em todos os testes e jogadas de Destreza.",
        "Deslocamento reduzido pela metade."
      ];
    }

    return {
      current: currentLoad,
      max: maxLoad,
      status,
      penalties
    };
  }

  function calculateSkills(charData, effectiveAttrs, customRegistry) {
    const reg = customRegistry || getRegistry();
    const skillsCatalog = reg ? reg.SKILLS : {};
    const trainedSet = new Set(charData?.skills?.trained || []);
    const chosenAttrs = charData?.skills?.chosenAttributes || {};

    const evaluated = {};

    for (const skillId in skillsCatalog) {
      const def = skillsCatalog[skillId];
      const isTrained = trainedSet.has(skillId);

      let attrKey = def.attrs[0];
      if (def.attrs.length > 1 && chosenAttrs[skillId] && def.attrs.includes(chosenAttrs[skillId])) {
        attrKey = chosenAttrs[skillId];
      }

      const attrVal = effectiveAttrs[attrKey] || 0;

      evaluated[skillId] = {
        id: def.id,
        name: def.name,
        trained: isTrained,
        hasAdvantage: isTrained,
        attributeKey: attrKey,
        attributeBonus: attrVal,
        rollFormula: isTrained ? `2d20kh1 + ${attrVal}` : `1d20 + ${attrVal}`
      };
    }

    return evaluated;
  }

  function calculateAbilityDC(effectiveAttrs, maestry, attrKey = "men") {
    const attrBonus = Number(effectiveAttrs[attrKey]) || 0;
    return 10 + attrBonus + maestry;
  }

  function calculateProgression(charData, customRegistry) {
    const reg = customRegistry || getRegistry();
    const level = Math.min(15, Math.max(1, Number(charData?.progression?.level) || 1));
    const maestry = calculateMaestry(level);
    const classId = charData?.identity?.classId || "";
    const classDef = reg ? reg.getClass(classId) : null;

    const activeCharacteristics = [];
    const openChoiceMilestones = [];

    if (classDef && classDef.progression) {
      const charMap = classDef.progression.characteristicAbilities || {};
      for (const lvlStr in charMap) {
        if (level >= Number(lvlStr)) {
          activeCharacteristics.push({
            milestoneLevel: Number(lvlStr),
            ...charMap[lvlStr]
          });
        }
      }

      const choicesMap = classDef.progression.choices || {};
      for (const lvlStr in choicesMap) {
        if (level >= Number(lvlStr)) {
          openChoiceMilestones.push(Number(lvlStr));
        }
      }
    }

    return {
      level,
      maestry,
      activeCharacteristics,
      openChoiceMilestones
    };
  }

  function calculateCustomTrackers(charData, customRegistry) {
    const reg = customRegistry || getRegistry();
    const raceId = charData?.identity?.raceId || "";
    const classId = charData?.identity?.classId || "";

    const raceDef = reg ? reg.getRace(raceId) : null;
    const classDef = reg ? reg.getClass(classId) : null;

    const availableTrackers = [];

    if (raceDef && Array.isArray(raceDef.trackers)) {
      availableTrackers.push(...raceDef.trackers);
    }
    if (classDef && Array.isArray(classDef.trackers)) {
      availableTrackers.push(...classDef.trackers);
    }

    const state = {};
    const existing = charData?.customTrackers || {};

    for (const tracker of availableTrackers) {
      if (tracker.type === "pips") {
        const cur = existing[tracker.id]?.current !== undefined ? existing[tracker.id].current : tracker.min || 0;
        state[tracker.id] = {
          ...tracker,
          current: Math.min(tracker.max, Math.max(tracker.min, cur))
        };
      } else if (tracker.type === "slots") {
        const slots = Array.isArray(existing[tracker.id]?.slots) ? existing[tracker.id].slots : [];
        state[tracker.id] = {
          ...tracker,
          slots: slots.slice(0, tracker.maxActive)
        };
      } else if (tracker.type === "boolean_threshold") {
        state[tracker.id] = {
          ...tracker
        };
      }
    }

    return state;
  }

  function recalculate(charData, customRegistry) {
    const reg = customRegistry || getRegistry();
    const effectiveAttrs = calculateEffectiveAttributes(charData, reg);
    const progression = calculateProgression(charData, reg);
    const maestry = progression.maestry;

    const vitals = calculateVitals(charData, effectiveAttrs, maestry, reg);
    const defense = calculateDefense(charData, effectiveAttrs, reg);
    const load = calculateLoad(charData, effectiveAttrs, reg);
    const skills = calculateSkills(charData, effectiveAttrs, reg);
    const trackers = calculateCustomTrackers(charData, reg);

    // Validação de Overclock de E.X.O.s (ativo quando vitalidade < 25%)
    if (trackers.overclock) {
      const thresholdHp = Math.floor(vitals.max * 0.25);
      trackers.overclock.isActive = vitals.current <= thresholdHp;
    }

    return {
      charData,
      level: progression.level,
      maestry,
      effectiveAttributes: effectiveAttrs,
      vitals,
      defense,
      load,
      skills,
      progression,
      trackers,
      abilityDC: {
        men: calculateAbilityDC(effectiveAttrs, maestry, "men"),
        exp: calculateAbilityDC(effectiveAttrs, maestry, "exp"),
        for: calculateAbilityDC(effectiveAttrs, maestry, "for"),
        des: calculateAbilityDC(effectiveAttrs, maestry, "des"),
        vig: calculateAbilityDC(effectiveAttrs, maestry, "vig")
      }
    };
  }

  const CalculationEngine = {
    calculateMaestry,
    calculateEffectiveAttributes,
    calculateVitals,
    calculateDefense,
    calculateLoad,
    calculateSkills,
    calculateAbilityDC,
    calculateProgression,
    calculateCustomTrackers,
    recalculate
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = CalculationEngine;
  } else {
    global.WuCalculationEngine = CalculationEngine;
  }
})(typeof window !== "undefined" ? window : globalThis);
