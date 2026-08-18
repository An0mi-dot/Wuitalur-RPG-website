/* ========================================================================
 * server.js — Servidor DeskRPG (Express + WebSocket)
 * ------------------------------------------------------------------------
 * Este arquivo agora é apenas a "fachada" do app:
 *   - serve os arquivos estáticos da UI (public/);
 *   - expõe as rotas HTTP; e
 *   - mantém a conexão WebSocket de tempo real.
 *
 * Toda a lógica de combate (validação, escudo, vida extra, condições,
 * turnos, custo de EA) vive em:
 *   - public/vitaluCoreLogic.js  → regras puras do Wuitalur;
 *   - socketServerLogic.js       → ações autoritativas + broadcast.
 * ======================================================================== */

require('dotenv').config();
const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const fs = require('fs');
const path = require('path');
const core = require('./public/vitaluCoreLogic.js');
const { createCombatActions } = require('./socketServerLogic.js');
const geminiChat = require('./geminiChat.js');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');
const LOG_LIMIT = 80;

app.use(express.json());

/* CORS: a UI hospedada no GitHub Pages chama o backend em outra origem. */
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

/* ---------- Persistência ---------- */

function readDB() {
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  const db = JSON.parse(raw);
  return normalizeDB(db);
}

function writeDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

/* Migra personagens antigos para o schema novo (vitality/astral/stress). */
function normalizeDB(db) {
  const characters = (db.characters || [])
    .map((c) => core.normalizeCharacter(c))
    .filter((c) => c !== null);
  const combat = db.combat || { active: false, order: [], index: 0, round: 1, log: [] };
  combat.log = combat.log || [];
  return { characters, combat, ai_chat: db.ai_chat || [] };
}

function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

function pushLog(db, text, type = 'system') {
  db.combat.log.unshift({ text, type, ts: Date.now() });
  if (db.combat.log.length > LOG_LIMIT) db.combat.log.length = LOG_LIMIT;
}

/* ---------- Ações de combate (módulo autoritativo) ---------- */

const actions = createCombatActions({ readDB, writeDB, broadcast, pushLog });

/* Resposta uniforme: 4xx se a ação retornar { error, code }. */
function respondAction(res, result) {
  if (result && result.error && result.code) return res.status(result.code).json(result);
  return res.json(result);
}

/* ---------- Rotas de leitura ---------- */

app.get('/api/characters', (req, res) => {
  const db = readDB();
  res.json(db.characters);
});

app.get('/api/state', (req, res) => {
  const db = readDB();
  res.json(db);
});

app.get('/api/characters/:id', (req, res) => {
  const db = readDB();
  const char = db.characters.find((c) => c.char_id === parseInt(req.params.id));
  if (!char) return res.status(404).json({ error: 'Personagem não encontrado' });
  res.json(char);
});

/* ---------- Rotas de personagem ---------- */

app.post('/api/characters', (req, res) => respondAction(res, actions.createCharacter(req.body)));
app.delete('/api/characters/:id', (req, res) => respondAction(res, actions.deleteCharacter(req.params.id)));
app.put('/api/characters/:id', (req, res) => respondAction(res, actions.updateCharacter(req.params.id, req.body)));

/* ---------- Rotas de combate (validadas no servidor) ---------- */

app.post('/api/damage', (req, res) => respondAction(res, actions.damage(req.body)));
app.post('/api/heal', (req, res) => respondAction(res, actions.heal(req.body)));
app.post('/api/astral', (req, res) => respondAction(res, actions.astral(req.body)));
app.post('/api/stress', (req, res) => respondAction(res, actions.stress(req.body)));

app.post('/api/shield', (req, res) => respondAction(res, actions.shield(req.body)));
app.post('/api/extra-life', (req, res) => respondAction(res, actions.extraLife(req.body)));
app.post('/api/condition', (req, res) => respondAction(res, actions.condition(req.body)));
app.post('/api/condition/remove', (req, res) => respondAction(res, actions.removeCondition(req.body)));
app.post('/api/ready', (req, res) => respondAction(res, actions.ready(req.body)));

app.post('/api/skill', (req, res) => respondAction(res, actions.skill(req.body)));

app.post('/api/combat/start', (req, res) => respondAction(res, actions.startCombat(req.body)));
app.post('/api/combat/end', (req, res) => respondAction(res, actions.endCombat()));
app.post('/api/combat/next', (req, res) => respondAction(res, actions.nextTurn()));
app.post('/api/combat/prev', (req, res) => respondAction(res, actions.prevTurn()));
app.post('/api/combat/log/clear', (req, res) => respondAction(res, actions.clearLog()));

/* ---------- Chat do mestre com IA ---------- */

app.get('/api/ai/chat', (req, res) => {
  const db = readDB();
  res.json({ messages: db.ai_chat || [] });
});

app.post('/api/ai/chat', async (req, res) => {
  const message = String((req.body && req.body.message) || '').trim();
  if (!message) return res.status(400).json({ error: 'Mensagem vazia' });
  if (!geminiChat.aiKey()) {
    return res.status(503).json({ error: 'Chave da IA não configurada (GEMINI_API_KEY no .env)' });
  }
  try {
    const db = readDB();
    const result = await geminiChat.handleAiMessage(message, db, actions);
    // A ação autoritativa já gravou e transmitiu o novo estado; releio o
    // disco para não sobrescrever essa mudança com o estado antigo.
    const fresh = readDB();
    fresh.ai_chat = fresh.ai_chat || [];
    fresh.ai_chat.push({ role: 'user', text: message, ts: Date.now() });
    fresh.ai_chat.push({ role: 'assistant', text: result.reply, action: result.action, ts: Date.now() });
    if (fresh.ai_chat.length > 100) fresh.ai_chat = fresh.ai_chat.slice(-100);
    writeDB(fresh);
    res.json({ reply: result.reply, action: result.action, messages: fresh.ai_chat });
  } catch (err) {
    console.error('[AI] erro:', err.message);
    res.status(500).json({ error: 'Falha ao consultar a IA: ' + err.message });
  }
});

/* ---------- WebSocket (tempo real) ---------- */

wss.on('connection', (ws) => {
  console.log('[WS] Cliente conectado');
  const db = readDB();
  ws.send(JSON.stringify({ type: 'init', characters: db.characters, combat: db.combat }));

  ws.on('close', () => {
    console.log('[WS] Cliente desconectado');
  });
});

server.listen(PORT, () => {
  console.log(`[Server] Dashboard rodando em http://localhost:${PORT}`);
  console.log(`[Server] Núcleo Wuitalur carregado: ${Object.keys(core.SKILLS).length} habilidades no registro.`);
});