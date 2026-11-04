// ============================================================
// WUITALUR RPG 2.0 - MODELO DE DADOS DA FICHA (SHEET MODEL)
// ============================================================

(function(global) {
  const SCHEMA_VERSION = "2.0.0";

  function generateId(prefix = "char") {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    return `${prefix}_${timestamp}_${randomPart}`;
  }

  function createDefaultCharacter(overrides = {}) {
    return {
      schemaVersion: SCHEMA_VERSION,
      meta: {
        id: generateId("char"),
        name: "",
        concept: "",
        player: "",
        portraitUrl: "",
        notes: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      progression: {
        level: 1,
        effortPoints: 3,
        cosmo: 0,
        experience: 0
      },
      identity: {
        raceId: "",
        raceVariant: "",
        vocationId: "",
        classId: "",
        element: ""
      },
      attributes: {
        base: {
          for: 0,
          des: 0,
          vig: 0,
          men: 0,
          exp: 0
        },
        modifiers: {
          for: 0,
          des: 0,
          vig: 0,
          men: 0,
          exp: 0
        }
      },
      skills: {
        trained: [],
        chosenAttributes: {
          atletismo: "for",
          intimidacao: "exp",
          percepcao: "men",
          sobrevivencia: "men"
        }
      },
      abilities: {
        characteristics: [],
        choices: {
          "1": null,
          "4": null,
          "7": null,
          "10": null,
          "13": null
        },
        racialTraits: [],
        vocationPowers: []
      },
      equipment: {
        weapons: [],
        armor: null,
        shield: null,
        items: [],
        kits: []
      },
      vitalsState: {
        damageTaken: 0,
        tempHp: 0,
        eaSpent: 0
      },
      customTrackers: {},
      ...overrides
    };
  }

  function validateCharacter(charData) {
    const errors = [];

    if (!charData || typeof charData !== "object") {
      return { valid: false, errors: ["Dados da ficha invalidos ou inexistentes."] };
    }

    if (charData.schemaVersion !== SCHEMA_VERSION) {
      errors.push(`Versao de schema incompativel: ${charData.schemaVersion}. Esperado: ${SCHEMA_VERSION}.`);
    }

    if (!charData.progression || typeof charData.progression.level !== "number") {
      errors.push("Nivel de progressao indefinido ou invalido.");
    } else if (charData.progression.level < 1 || charData.progression.level > 15) {
      errors.push("O nivel do personagem deve estar entre 1 e 15.");
    }

    if (!charData.attributes || !charData.attributes.base) {
      errors.push("Estrutura de atributos base ausente.");
    } else {
      const requiredAttrs = ["for", "des", "vig", "men", "exp"];
      for (const attr of requiredAttrs) {
        if (typeof charData.attributes.base[attr] !== "number") {
          errors.push(`Atributo base '${attr}' deve ser numerico.`);
        }
      }
    }

    if (!charData.skills || !Array.isArray(charData.skills.trained)) {
      errors.push("Lista de pericias treinadas ausente ou invalida.");
    }

    if (!charData.equipment || !Array.isArray(charData.equipment.weapons) || !Array.isArray(charData.equipment.items)) {
      errors.push("Estrutura de inventario/equipamento corrompida.");
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  function cloneCharacter(charData) {
    return JSON.parse(JSON.stringify(charData));
  }

  function serializeCharacter(charData, pretty = false) {
    return JSON.stringify(charData, null, pretty ? 2 : 0);
  }

  function deserializeCharacter(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      const validation = validateCharacter(data);
      if (!validation.valid) {
        throw new Error(validation.errors.join(" "));
      }
      return data;
    } catch (e) {
      throw new Error(`Falha ao desserializar ficha JSON: ${e.message}`);
    }
  }

  const SheetModel = {
    SCHEMA_VERSION,
    generateId,
    createDefaultCharacter,
    validateCharacter,
    cloneCharacter,
    serializeCharacter,
    deserializeCharacter
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = SheetModel;
  } else {
    global.WuSheetModel = SheetModel;
  }
})(typeof window !== "undefined" ? window : globalThis);
