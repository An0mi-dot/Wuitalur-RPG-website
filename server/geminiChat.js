/* ========================================================================
 * geminiChat.js — Chat do Mestre com IA (traduz ordem em ação do combate)
 * ------------------------------------------------------------------------
 * Recebe a mensagem do Mestre + o estado atual da mesa, pede ao Gemini um
 * JSON estruturado e executa a ação pelos mesmos canais autoritativos
 * (socketServerLogic), com broadcast para a UI.
 * A chave fica só no servidor (process.env.GEMINI_API_KEY / .env).
 * ======================================================================== */

'use strict';

const MODEL = 'gemini-3.6-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const CONDITION_NAMES = ['sangramento', 'envenenado', 'queimadura', 'confuso', 'paralisado'];

function aiKey() {
  return process.env.GEMINI_API_KEY || '';
}

/* Compacta o estado da mesa num JSON enxuto para o modelo. */
function compactState(db) {
  const chars = (db.characters || []).map((c) => ({
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
  const combat = db.combat || {};
  return {
    personagens: chars,
    combate: {
      ativo: !!combat.active,
      rodada: combat.round || 1,
      vez_de: combat.active && combat.order && combat.order[combat.index] != null
        ? chars.find((c) => c.id === combat.order[combat.index]).name
        : null,
    },
  };
}

function buildPrompt(userMessage, stateJson) {
  const allowedConditions = CONDITION_NAMES.join(', ');
  return [
    'Você é o assistente do mestre do sistema de RPG DeskRPG. O mestre te dá ordens em português falado.',
    '',
    'ESTADO ATUAL DA MESA (JSON):',
    JSON.stringify(stateJson),
    '',
    'CONDICOES EXISTENTES (use exatamente um destes nomes): ' + allowedConditions,
    'Personagens sao identificados pelo campo id (numerico) no estado.',
    '',
    'SUA TAREFA: traduza a ordem do mestre em EXATAMENTE UMA acao JSON, escolhida entre:',
    '  {"action":"condition","target_id":<id>,"name":"sangramento","duration":<turnos>}',
    '  {"action":"remove_condition","target_id":<id>,"name":"queimadura"}',
    '  {"action":"shield","target_id":<id>,"value":<valor>,"duration":<turnos>}',
    '  {"action":"damage","target_id":<id>,"amount":<valor>}',
    '  {"action":"heal","target_id":<id>,"amount":<valor>}',
    '  {"action":"astral","target_id":<id>,"amount":<valor>}',
    '  {"action":"stress","target_id":<id>,"amount":<valor>}',
    '  {"action":"ready","target_id":<id>,"ready":true|false}',
    '  {"action":"start_combat"}  {"action":"end_combat"}',
    '  {"action":"next_turn"}  {"action":"prev_turn"}',
    '',
    'REGRAS:',
    '- "por N turnos" vira o campo duration, que o sistema zera/remove sozinho no turno certo.',
    '- Somente as acoes e os nomes de condicao listados. Nao invente.',
    '- Use o id numerico do personagem. Se a ordem nao disser o personagem, peca por confirmacao.',
    '- Se a ordem for ambigua ou impossivel de mapear, responda apenas:',
    '  {"action":"clarify","message":"<pergunta curta em portugues ao mestre>"}',
    '- Responda APENAS com o JSON. Sem texto fora do JSON.',
    '',
    'ORDEM DO MESTRE: ' + userMessage,
  ].join('\n');
}

/* Extrai o primeiro objeto JSON de um texto (robusto a ```, prefacio etc). */
function extractJson(text) {
  if (!text) return null;
  const cleaned = text.replace(/```json|```/g, '');
  const start = cleaned.indexOf('{');
  if (start === -1) return null;
  try {
    return JSON.parse(cleaned.slice(start));
  } catch (e) {
    const end = cleaned.lastIndexOf('}');
    if (end <= start) return null;
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch (e2) {
      return null;
    }
  }
}

/* Traduz a ação JSON em chamada dos canais autoritativos. */
function executeAction(action, db, actions) {
  const a = action && action.action;
  const targetId = (action && action.target_id != null) ? parseInt(action.target_id) : null;
  const byName = (name) => {
    if (name == null) return null;
    const found = (db.characters || []).find(
      (c) => String(c.char_name).toLowerCase() === String(name).toLowerCase()
    );
    return found ? found.char_id : null;
  };
  const tid = targetId != null && !isNaN(targetId) ? targetId : byName(action && action.target);

  if (a === 'condition') {
    return actions.condition({ target_id: tid, name: action.name, duration: action.duration });
  }
  if (a === 'remove_condition') {
    return actions.removeCondition({ target_id: tid, name: action.name });
  }
  if (a === 'shield') {
    return actions.shield({ target_id: tid, value: action.value, duration: action.duration });
  }
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

/* Monta o texto de resposta ao Mestre com base no que foi aplicado. */
function buildReply(action, result, db) {
  const a = action && action.action;
  const charName = (id) => {
    const c = (db.characters || []).find((x) => x.char_id === parseInt(id));
    return c ? c.char_name : null;
  };
  if (a === 'condition' && result && result.ok) {
    return `Aplicado ${action.name} em ${charName(action.target_id)} por ${action.duration} turno(s). O sistema remove sozinho quando zerar.`;
  }
  if (a === 'remove_condition' && result && result.ok) {
    return `Removida a condição ${action.name} de ${charName(action.target_id)}.`;
  }
  if (a === 'shield' && result && result.ok) {
    return `Escudo de ${action.value} concedido a ${charName(action.target_id)} por ${action.duration} turno(s).`;
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

async function requestGemini(prompt) {
  const key = aiKey();
  if (!key) {
    const err = new Error('Chave da IA não configurada (GEMINI_API_KEY).');
    err.code = 'NO_KEY';
    throw err;
  }
  const resp = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': key,
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: 'application/json',
      },
    }),
    signal: AbortSignal.timeout(25000),
  });
  if (!resp.ok) {
    const err = new Error(`Gemini respondeu status ${resp.status}`);
    err.code = 'GEMINI_HTTP';
    throw err;
  }
  const json = await resp.json();
  const text = json.candidates && json.candidates[0] && json.candidates[0].content
    && json.candidates[0].content.parts && json.candidates[0].content.parts[0]
    ? json.candidates[0].content.parts[0].text
    : '';
  return text;
}

/* Ponto de entrada principal (chamado pelo server.js). */
async function handleAiMessage(message, db, actions) {
  const prompt = buildPrompt(message, compactState(db));
  const text = await requestGemini(prompt);
  const action = extractJson(text);
  if (!action) {
    return {
      reply: 'Não entendi a resposta da IA. Tente reescrever a ordem ou me inclua mais contexto.',
      action: null,
      raw: text,
    };
  }
  const result = executeAction(action, db, actions);
  return {
    reply: buildReply(action, result, db),
    action: action,
    result: result && result.ok === false ? result : { ok: true },
    raw: text,
  };
}

module.exports = { handleAiMessage, aiKey, extractJson };