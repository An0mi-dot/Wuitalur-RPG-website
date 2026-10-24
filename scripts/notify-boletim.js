/* ============================================================
   WUITALUR RPG — NOTIFICADOR DE BOLETIM NO DISCORD
   Canal Alvo: 1060717983921610842 (Avisos e Atualizacoes)
   Zero Emojis, Formato Limpo e Direto
   ============================================================ */

const https = require('https');
const { createClient } = require('@supabase/supabase-js');
const { BOLETINS_DATA } = require('../js/boletim-data.js');

const SUPABASE_CONFIG = {
  url: 'https://qkupdpgcjusbedaoahwi.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFrdXBkcGdjanVzYmVkYW9haHdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgxNzk1ODAsImV4cCI6MjEwMzc1NTU4MH0.UDc5nE7ZwUyWmwNZKpq7bGrty1N6Uh0bjq2PJtBkVrk'
};

const DISCORD_CONFIG = {
  channelId: '1060717983921610842',
  webhookUrl: 'https://discord.com/api/webhooks/1563629491639812101/1mWmJgJbuiO4rIndhPrgSZThWX1D6LANhGlKNrgRJutzhQMuZ86jKgwFD41eclL07teZ',
  botAvatar: 'https://cdn.discordapp.com/avatars/1288806072328650818/c32978a4fd5a5aff0a77df81d29e28dd.png?size=256'
};

function buildPayload(boletim) {
  const titleText = boletim.titulo || 'Novo Boletim';

  return {
    username: 'WuB - Utilities',
    avatar_url: DISCORD_CONFIG.botAvatar,
    content: '@everyone [Novo Boletim]\nSOBRE: ' + titleText,
    allowed_mentions: {
      parse: ['everyone']
    }
  };
}

function sendDiscordWebhook(payload) {
  return new Promise((resolve, reject) => {
    const url = new URL(DISCORD_CONFIG.webhookUrl);
    const postData = JSON.stringify(payload);

    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ status: res.statusCode, body: responseBody });
        } else {
          reject(new Error(`Discord webhook returned status ${res.statusCode}: ${responseBody}`));
        }
      });
    });

    req.on('error', (err) => reject(err));
    req.write(postData);
    req.end();
  });
}

async function run() {
  const args = process.argv.slice(2);
  const isForce = args.includes('--force');
  const isDryRun = args.includes('--dry-run');
  const editionIndex = args.indexOf('--edition');
  const targetEditionId = editionIndex !== -1 && args[editionIndex + 1] ? args[editionIndex + 1] : null;

  if (!Array.isArray(BOLETINS_DATA) || BOLETINS_DATA.length === 0) {
    console.error('Nenhum dado de boletim encontrado em js/boletim-data.js');
    process.exit(1);
  }

  // Ordena por numero decrescente
  const sorted = [...BOLETINS_DATA].sort((a, b) => (b.numero || 0) - (a.numero || 0));
  const targetItem = targetEditionId
    ? sorted.find(b => b.id === targetEditionId)
    : sorted[0];

  if (!targetItem) {
    console.error(`Edicao "${targetEditionId}" nao encontrada no arquivo de dados.`);
    process.exit(1);
  }

  console.log('Edicao alvo selecionada:');
  console.log(`- ID: ${targetItem.id}`);
  console.log(`- Edicao: ${targetItem.edicao}`);
  console.log(`- Titulo: ${targetItem.titulo}`);

  const payload = buildPayload(targetItem);

  if (isDryRun) {
    console.log('\n--- MODO DRY RUN (SEM DISPARO REAL) ---');
    console.log(JSON.stringify(payload, null, 2));
    console.log('--------------------------------------');
    return;
  }

  // Consulta status no Supabase
  const supabase = createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.key);
  const { data, error } = await supabase
    .from('personagens')
    .select('atributos')
    .eq('id', 3)
    .single();

  if (error) {
    console.error('Erro ao consultar Supabase:', error.message);
    process.exit(1);
  }

  const rawAtributos = typeof data.atributos === 'string' ? JSON.parse(data.atributos) : (data.atributos || {});
  const boletimMeta = rawAtributos._boletim || {};
  const lastNotifiedId = boletimMeta.lastNotifiedId;

  console.log(`Ultimo boletim registrado no Supabase: ${lastNotifiedId || '(nenhum)'}`);

  if (!isForce && lastNotifiedId === targetItem.id) {
    console.log(`A edicao "${targetItem.id}" ja foi notificada anteriormente. Nenhuma mensagem enviada.`);
    console.log('Use "--force" caso deseje reenviar propositalmente.');
    return;
  }

  console.log(`Disparando notificacao para o canal ${DISCORD_CONFIG.channelId}...`);
  try {
    const result = await sendDiscordWebhook(payload);
    console.log(`Sucesso! Status Discord: ${result.status}`);

    // Atualiza metadados no Supabase
    rawAtributos._boletim = {
      lastNotifiedId: targetItem.id,
      lastNotifiedAt: new Date().toISOString(),
      lastNotifiedTitle: targetItem.titulo
    };

    const { updateError } = await supabase
      .from('personagens')
      .update({ atributos: rawAtributos })
      .eq('id', 3);

    if (updateError) {
      console.warn('Aviso: Notificacao enviada, mas falhou ao gravar no Supabase:', updateError.message);
    } else {
      console.log('Metadados de boletim gravados com sucesso no Supabase.');
    }
  } catch(webhookErr) {
    console.error('Falha ao enviar webhook para o Discord:', webhookErr.message);
    process.exit(1);
  }
}

run().catch(err => {
  console.error('Erro fatal:', err);
  process.exit(1);
});
