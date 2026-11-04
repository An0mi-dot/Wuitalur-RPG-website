// ============================================================
// WUITALUR RPG 2.0 - SUITE DE TESTES UNITARIOS DO MOTOR
// ============================================================

const SheetModel = require("./sheet-model.js");
const RulesRegistry = require("./rules-registry.js");
const CalculationEngine = require("./calculation-engine.js");

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = "") {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`[PASS] ${testName}`);
  } else {
    failedTests++;
    console.error(`[FAIL] ${testName}: ${details}`);
  }
}

function assertEqual(actual, expected, testName) {
  const match = actual === expected;
  assert(match, testName, `Esperado: ${expected}, Obtido: ${actual}`);
}

console.log("=== INICIANDO TESTES DO MOTOR DE REGRAS 2.0 ===");

// ------------------------------------------------------------
// 1. Escala Universal de Maestria
// ------------------------------------------------------------
console.log("\n--- 1. Escala de Maestria Universal ---");
assertEqual(CalculationEngine.calculateMaestry(1), 2, "Maestria no Nivel 1 deve ser +2");
assertEqual(CalculationEngine.calculateMaestry(4), 2, "Maestria no Nivel 4 deve ser +2");
assertEqual(CalculationEngine.calculateMaestry(5), 4, "Maestria no Nivel 5 deve ser +4");
assertEqual(CalculationEngine.calculateMaestry(8), 4, "Maestria no Nivel 8 deve ser +4");
assertEqual(CalculationEngine.calculateMaestry(9), 8, "Maestria no Nivel 9 deve ser +8");
assertEqual(CalculationEngine.calculateMaestry(12), 8, "Maestria no Nivel 12 deve ser +8");
assertEqual(CalculationEngine.calculateMaestry(13), 16, "Maestria no Nivel 13 deve ser +16");
assertEqual(CalculationEngine.calculateMaestry(15), 16, "Maestria no Nivel 15 deve ser +16");

// ------------------------------------------------------------
// 2. Calculo de Carga e Contêineres de Kits
// ------------------------------------------------------------
console.log("\n--- 2. Calculo de Carga e Contêineres de Kits ---");

// Teste de Carga Minima com FOR 0
const charFor0 = SheetModel.createDefaultCharacter({
  attributes: { base: { for: 0, des: 0, vig: 0, men: 0, exp: 0 } }
});
const loadFor0 = CalculationEngine.calculateLoad(charFor0, { for: 0, des: 0, vig: 0, men: 0, exp: 0 });
assertEqual(loadFor0.max, 5, "Personagem com FOR 0 deve ter exatamente 5 espacos de carga minima");

// Teste de Carga com FOR negativa (ex: -1)
const loadForNeg = CalculationEngine.calculateLoad(charFor0, { for: -1, des: 0, vig: 0, men: 0, exp: 0 });
assertEqual(loadForNeg.max, 5, "Personagem com FOR negativa deve manter minimo de 5 espacos");

// Teste de Carga com FOR +3
const loadFor3 = CalculationEngine.calculateLoad(charFor0, { for: 3, des: 0, vig: 0, men: 0, exp: 0 });
assertEqual(loadFor3.max, 14, "Personagem com FOR 3 deve ter (3 * 3) + 5 = 14 espacos");

// Teste de Armazenamento de Kit: itens dentro do kit nao somam peso individual
const charWithKit = SheetModel.createDefaultCharacter({
  attributes: { base: { for: 1, des: 0, vig: 0, men: 0, exp: 0 } }, // maxLoad: 8
  equipment: {
    kits: [
      { id: "kit_medico", name: "Kit Medico", load: 3 }
    ],
    items: [
      { id: "estojo_sutura", name: "Estojo de Sutura", load: 1, kitId: "kit_medico" },
      { id: "balsamo", name: "Balsamo", load: 1, kitId: "kit_medico" },
      { id: "antisseptico", name: "Antisseptico", load: 1, kitId: "kit_medico" },
      { id: "pocao_avulsa", name: "Pocao Solta", load: 1 } // Nao pertence ao kit
    ],
    weapons: [],
    armor: null
  }
});
const loadResultKit = CalculationEngine.calculateLoad(charWithKit, { for: 1, des: 0, vig: 0, men: 0, exp: 0 });
// Total esperado: 3 (do kit) + 1 (pocao avulsa) = 4. Os 3 itens dentro do kit nao somam.
assertEqual(loadResultKit.current, 4, "Itens guardados dentro de kit fechado nao somam peso individual a carga");
assertEqual(loadResultKit.status, "normal", "Carga 4/8 deve constar como status normal");

// ------------------------------------------------------------
// 3. Mecanica de Pericias e CD de Habilidades
// ------------------------------------------------------------
console.log("\n--- 3. Mecanica de Pericias e CD ---");

const charSkills = SheetModel.createDefaultCharacter({
  progression: { level: 5 }, // Maestria: 4
  attributes: { base: { for: 0, des: 2, vig: 0, men: 3, exp: 1 } },
  skills: {
    trained: ["investigacao", "acrobacia"],
    chosenAttributes: { atletismo: "des" }
  }
});
const skillsEval = CalculationEngine.calculateSkills(charSkills, { for: 0, des: 2, vig: 0, men: 3, exp: 1 });

assert(skillsEval.investigacao.trained === true, "Investigacao deve constar como treinada");
assert(skillsEval.investigacao.hasAdvantage === true, "Pericia treinada concede Vantagem no teste");
assertEqual(skillsEval.investigacao.rollFormula, "2d20kh1 + 3", "Formula de pericia treinada deve ser 2d20kh1 + Atributo");

assert(skillsEval.furtividade.trained === false, "Furtividade sem treino nao deve ser treinada");
assert(skillsEval.furtividade.hasAdvantage === false, "Pericia sem treino nao tem vantagem");
assertEqual(skillsEval.furtividade.rollFormula, "1d20 + 2", "Formula de pericia sem treino deve ser 1d20 + Atributo");

// CD de Habilidade: 10 + Atributo + Maestria
const cdMen = CalculationEngine.calculateAbilityDC({ men: 3 }, 4, "men");
assertEqual(cdMen, 17, "CD com MEN 3 e Maestria 4 deve ser 10 + 3 + 4 = 17");

// ------------------------------------------------------------
// 4. Calculo de Vitalidade Padrao e Atipica
// ------------------------------------------------------------
console.log("\n--- 4. Calculo de Vitalidade (Padrao e Atipica) ---");

// Caso A: Compactador Padrao (Nivel 1 e Nivel 4)
const compactadorNv1 = SheetModel.createDefaultCharacter({
  progression: { level: 1 },
  identity: { classId: "compactador", raceId: "humanos" },
  attributes: { base: { for: 2, des: 1, vig: 2, men: 0, exp: 1 } }
});
const vitalsCompNv1 = CalculationEngine.calculateVitals(compactadorNv1, { for: 2, des: 1, vig: 2, men: 0, exp: 1 }, 2);
// Nivel 1: 14 + VIG(2) = 16
assertEqual(vitalsCompNv1.resourceType, "pv", "Compactador utiliza PV");
assertEqual(vitalsCompNv1.max, 16, "Compactador Nv 1 com VIG 2 deve ter 14 + 2 = 16 PV");

// Compactador Nivel 4: Nivel 4 desbloqueia Massa Titanica (+12 PV permanentes)
// Base: 16 + 3 * (8 + 2) = 16 + 30 = 46. + 12 (Massa Titanica) = 58
const compactadorNv4 = SheetModel.createDefaultCharacter({
  progression: { level: 4 },
  identity: { classId: "compactador", raceId: "humanos" },
  attributes: { base: { for: 2, des: 1, vig: 2, men: 0, exp: 1 } }
});
const vitalsCompNv4 = CalculationEngine.calculateVitals(compactadorNv4, { for: 2, des: 1, vig: 2, men: 0, exp: 1 }, 2);
assertEqual(vitalsCompNv4.max, 58, "Compactador Nv 4 com VIG 2 e Massa Titanica deve ter 58 PV maximos");

// Consagrados Nivel 4: Nivel 4 desbloqueia Fonte de Luz (+15 EA permanentes)
// Base EA: 30 + 3 * 10 = 60. + 15 (Fonte de Luz) = 75 EA
const consagradoNv4 = SheetModel.createDefaultCharacter({
  progression: { level: 4 },
  identity: { classId: "consagrados", raceId: "humanos" },
  attributes: { base: { for: 0, des: 1, vig: 1, men: 2, exp: 3 } }
});
const vitalsConsNv4 = CalculationEngine.calculateVitals(consagradoNv4, { for: 0, des: 1, vig: 1, men: 2, exp: 3 }, 2);
assertEqual(vitalsConsNv4.energyAstral.max, 75, "Consagrado Nv 4 com Fonte de Luz deve ter 75 EA maxima");

// Caso B: Raca Atipica — Espect@&%s (Estabilidade Cosmica)
// Formula: (10 + MEN) + (level - 1) * (4 + MEN)
// Com MEN 3 e Nivel 4: (10 + 3) + 3 * (4 + 3) = 13 + 21 = 34
const espectroNv4 = SheetModel.createDefaultCharacter({
  progression: { level: 4 },
  identity: { classId: "consagrados", raceId: "espectros" },
  attributes: { base: { for: 0, des: 1, vig: 0, men: 3, exp: 2 } }
});
const vitalsEspectro = CalculationEngine.calculateVitals(espectroNv4, { for: 0, des: 1, vig: 0, men: 3, exp: 2 }, 2);
assertEqual(vitalsEspectro.resourceType, "estabilidade", "Espectros devem operar com Estabilidade Cosmica");
assertEqual(vitalsEspectro.resourceLabel, "Estabilidade Cosmica", "Rotulo vital de Espectros correto");
assertEqual(vitalsEspectro.max, 34, "Estabilidade de Espectro Nv 4 com MEN 3 deve ser 34");
assertEqual(vitalsEspectro.allowExternalHealing, false, "Espectros nao recebem cura externa comum");
assertEqual(vitalsEspectro.deathSaves.maxFailures, 4, "Salvaguarda da morte de Espectros exige 4 falhas");

// Caso C: Raca Atipica — E.X.O.s (Pontos de Chassi)
const exoChar = SheetModel.createDefaultCharacter({
  progression: { level: 1 },
  identity: { classId: "compactador", raceId: "exos" },
  attributes: { base: { for: 3, des: 0, vig: 2, men: 1, exp: 0 } },
  vitalsState: { damageTaken: 13 } // PC max 16, atual 3 (menos de 25%)
});
const fullRecalcExo = CalculationEngine.recalculate(exoChar);
assertEqual(fullRecalcExo.vitals.resourceType, "pc", "E.X.O.s devem operar com Pontos de Chassi");
assertEqual(fullRecalcExo.vitals.allowMedicine, false, "E.X.O.s nao podem ser curados por Medicina");
assert(fullRecalcExo.trackers.overclock.isActive === true, "Overclock ativa automaticamente com menos de 25% de PCs");

// ------------------------------------------------------------
// 5. Marcos de Progressao e Habilidades
// ------------------------------------------------------------
console.log("\n--- 5. Marcos de Progressao e Habilidades ---");

const progNv1 = CalculationEngine.calculateProgression({
  progression: { level: 1 },
  identity: { classId: "compactador" }
});
assertEqual(progNv1.activeCharacteristics.length, 1, "Nivel 1 deve ter 1 habilidade caracteristica ativa");
assertEqual(progNv1.activeCharacteristics[0].id, "densidade_negativa", "Habilidade caracteristica NV1 deve ser Densidade Negativa");
assertEqual(progNv1.openChoiceMilestones.length, 1, "Nivel 1 deve ter 1 marco de escolha aberto");

const progNv7 = CalculationEngine.calculateProgression({
  progression: { level: 7 },
  identity: { classId: "compactador" }
});
assertEqual(progNv7.activeCharacteristics.length, 3, "Nivel 7 deve ter 3 habilidades caracteristicas ativas (1, 4 e 7)");
assertEqual(progNv7.openChoiceMilestones.length, 3, "Nivel 7 deve ter 3 marcos de escolha abertos (1, 4 e 7)");

const progNv15 = CalculationEngine.calculateProgression({
  progression: { level: 15 },
  identity: { classId: "compactador" }
});
assertEqual(progNv15.activeCharacteristics.length, 3, "Nivel 15 mantem 3 habilidades caracteristicas");
assertEqual(progNv15.openChoiceMilestones.length, 5, "Nivel 15 abre todos os 5 marcos de escolha (1, 4, 7, 10, 13)");

// ------------------------------------------------------------
// 6. Trackers Dinamicos de Classe e Raca
// ------------------------------------------------------------
console.log("\n--- 6. Trackers Dinamicos ---");

// Fervor em Consagrados
const consagradoChar = SheetModel.createDefaultCharacter({
  identity: { classId: "consagrados", raceId: "humanos" }
});
const trackersCons = CalculationEngine.calculateCustomTrackers(consagradoChar);
assert(trackersCons.fervor !== undefined, "Consagrados devem ter medidor de Fervor registrado");
assertEqual(trackersCons.fervor.type, "pips", "Fervor deve ser do tipo pips");
assertEqual(trackersCons.fervor.max, 5, "Fervor maximo deve ser 5");

// Estados de Compactacao no Compactador
const compactadorChar = SheetModel.createDefaultCharacter({
  identity: { classId: "compactador", raceId: "humanos" },
  customTrackers: {
    estados_compactacao: { slots: ["compressao", "estabilizacao"] }
  }
});
const trackersComp = CalculationEngine.calculateCustomTrackers(compactadorChar);
assert(trackersComp.estados_compactacao !== undefined, "Compactador deve ter tracker de Estados de Compactacao");
assertEqual(trackersComp.estados_compactacao.maxActive, 2, "Compactador pode manter ate 2 estados ativos");
assertEqual(trackersComp.estados_compactacao.slots.length, 2, "Slots devem refletir os estados ativos salvos");

// Vampiros com Cargas de Sangue
const vampiroChar = SheetModel.createDefaultCharacter({
  identity: { classId: "compactador", raceId: "vampiros" }
});
const trackersVamp = CalculationEngine.calculateCustomTrackers(vampiroChar);
assert(trackersVamp.cargas_sangue !== undefined, "Vampiros devem carregar o medidor de Cargas de Sangue");
assertEqual(trackersVamp.cargas_sangue.max, 3, "Reserva de Sangue comporta ate 3 cargas");

// ------------------------------------------------------------
// 7. Serializacao e Integridade de Schema JSON
// ------------------------------------------------------------
console.log("\n--- 7. Serializacao e Integridade ---");

const originalChar = SheetModel.createDefaultCharacter({
  meta: { name: "Test Hero" },
  progression: { level: 4 }
});
const jsonStr = SheetModel.serializeCharacter(originalChar);
const restoredChar = SheetModel.deserializeCharacter(jsonStr);

assertEqual(restoredChar.meta.name, "Test Hero", "Nome serializado e restaurado com integridade");
assertEqual(restoredChar.progression.level, 4, "Nivel serializado e restaurado com integridade");
assert(SheetModel.validateCharacter(restoredChar).valid, "Ficha restaurada deve ser valida perante o schema");

// ------------------------------------------------------------
// 8. Autenticacao Unificada por Token
// ------------------------------------------------------------
console.log("\n--- 8. Autenticacao Unificada por Token ---");

if (typeof localStorage === "undefined") {
  global.localStorage = {
    _data: {},
    getItem(k) { return this._data[k] || null; },
    setItem(k, v) { this._data[k] = String(v); },
    removeItem(k) { delete this._data[k]; }
  };
}

const AuthToken = require("./auth-token.js");
const SheetStorage = require("./sheet-storage.js");

global.WuCalculationEngine = CalculationEngine;
global.WuRulesRegistry = RulesRegistry;

(async () => {
  // Salvamento e normalizacao de token
  AuthToken.saveActiveToken("r5k1");
  assertEqual(AuthToken.getActiveToken(), "R5K1", "Token deve ser normalizado em letras maiusculas");

  // Chaves sincronizadas
  assertEqual(localStorage.getItem("wu_user_token"), "R5K1", "wu_user_token deve conter o token ativo");
  assertEqual(localStorage.getItem("mesa_token"), "R5K1", "mesa_token deve conter o token ativo");

  // Rejeicao de token vazio
  const emptyRes = await AuthToken.validateToken("");
  assertEqual(emptyRes.valid, false, "Token vazio deve ser rejeitado");

  // Validacao de token formatado
  const validRes = await AuthToken.validateToken("R5K1");
  assertEqual(validRes.valid, true, "Token de 4 caracteres alfanumericos deve ser valido");

  // ------------------------------------------------------------
  // 9. Persistencia de Fichas e Subida de Nivel
  // ------------------------------------------------------------
  console.log("\n--- 9. Persistencia de Fichas e Subida de Nivel ---");

  const testHero = SheetModel.createDefaultCharacter({
    identity: { classId: "compactador", raceId: "humanos" },
    attributes: { base: { for: 2, vig: 2 } }
  });

  const saveRes = await SheetStorage.saveSheet("R5K1", testHero);
  assert(saveRes.success, "Ficha deve ser salva com sucesso");
  assert(saveRes.sheet.meta.id.length > 0, "Ficha deve receber um identificador unico");
  assertEqual(saveRes.sheet.meta.token, "R5K1", "Ficha deve ser associada ao token ativo");

  const loadedList = await SheetStorage.loadSheets("R5K1");
  assertEqual(loadedList.length, 1, "Lista de fichas do token deve conter 1 personagem");

  // Subida de nivel para 5 (marco de Maestria +4)
  const levelUpRes = await SheetStorage.levelUpSheet("R5K1", saveRes.sheet.meta.id, 5);
  assertEqual(levelUpRes.sheet.progression.level, 5, "Nivel da ficha deve ser atualizado para 5");

  const recalcState = CalculationEngine.recalculate(levelUpRes.sheet, RulesRegistry);
  assertEqual(recalcState.maestry, 4, "Maestria no nivel 5 deve ser recalculada para +4");
  assert(levelUpRes.sheet.abilities.characteristics.includes("densidade_negativa"), "Habilidade caracteristica nivel 1 mantida");
  assert(levelUpRes.sheet.abilities.characteristics.includes("massa_titanica"), "Habilidade caracteristica nivel 4 desbloqueada");

  // Exclusao de ficha
  await SheetStorage.deleteSheet("R5K1", saveRes.sheet.meta.id);
  const afterDeleteList = await SheetStorage.loadSheets("R5K1");
  assertEqual(afterDeleteList.length, 0, "Ficha excluida deve ser removida da lista do usuario");

  console.log("\n================================================");
  console.log(`TOTAL DE TESTES: ${totalTests}`);
  console.log(`PASSOU: ${passedTests}`);
  console.log(`FALHOU: ${failedTests}`);
  console.log("================================================");

  if (failedTests > 0) {
    process.exit(1);
  } else {
    console.log("TODOS OS TESTES FORAM APROVADOS COM SUCESSO.");
    process.exit(0);
  }
})();
