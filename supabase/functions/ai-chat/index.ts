/* ========================================================================
 * ai-chat — Edge Function do Supabase (Deno)
 * ------------------------------------------------------------------------
 * Traduz uma ordem do Mestre em JSON de ação usando o Gemini. O estado
 * compacto chega pronto no corpo (computado no navegador por localState).
 * A chave do Gemini vive como secret da função (Deno.env) — nunca no site.
 * A função NÃO executa a ação: o navegador executa e persistiza.
 * ======================================================================== */

const MODEL = Deno.env.get('GEMINI_MODEL') || 'gemini-3.6-flash';
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;
const CONDITION_NAMES = ['sangramento', 'envenenado', 'queimadura', 'confuso', 'paralisado'];

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json' },
  });
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

function extractJson(text) {
  if (!text) return null;
  const cleaned = text.replace(/```json|```/g, '');
  const start = cleaned.indexOf('{');
  if (start === -1) return null;
  try {
    return JSON.parse(cleaned.slice(start));
  } catch (_e) {
    const end = cleaned.lastIndexOf('}');
    if (end <= start) return null;
    try {
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch (_e2) {
      return null;
    }
  }
}

async function requestGemini(prompt) {
  const key = Deno.env.get('GEMINI_API_KEY');
  if (!key) {
    const err = new Error('Chave da IA não configurada (GEMINI_API_KEY) no Supabase.');
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
      generationConfig: { temperature: 0.2, responseMimeType: 'application/json' },
    }),
    signal: AbortSignal.timeout(25000),
  });
  if (!resp.ok) {
    const err = new Error(`Gemini respondeu status ${resp.status}`);
    err.code = 'GEMINI_HTTP';
    throw err;
  }
  const jsonBody = await resp.json();
  const text = jsonBody.candidates && jsonBody.candidates[0] && jsonBody.candidates[0].content
    && jsonBody.candidates[0].content.parts && jsonBody.candidates[0].content.parts[0]
    ? jsonBody.candidates[0].content.parts[0].text
    : '';
  return text;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });

  if (req.method !== 'POST') return json({ error: 'Método não suportado' }, 405);

  let body;
  try {
    body = await req.json();
  } catch (_e) {
    return json({ error: 'JSON inválido no corpo.' }, 400);
  }

  const message = String((body && body.message) || '').trim();
  const state = (body && body.state) || {};
  if (!message) return json({ error: 'Mensagem vazia' }, 400);

  try {
    const prompt = buildPrompt(message, state);
    const text = await requestGemini(prompt);
    const action = extractJson(text);
    if (!action) {
      return json({ error: 'A IA não retornou uma ação estruturada. Tente reescrever a ordem.' });
    }
    if (action.action === 'clarify') {
      return json({ clarify: action.message || 'Pode repetir com mais detalhes?' });
    }
    return json({ action, raw: text });
  } catch (err) {
    console.error('[ai-chat]', err.message);
    return json({ error: 'Falha ao consultar a IA: ' + err.message }, 500);
  }
});