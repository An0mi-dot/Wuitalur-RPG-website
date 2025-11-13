const fs = require('fs');
const path = require('path');

const INPUT = path.resolve(process.cwd(), 'updates.json');
const OUTPUT = path.resolve(process.cwd(), 'updates.sanitized.json');

function removeDiacritics(s){
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '')
    .replace(/\s+/g, ' ').trim();
}

function tryLatin1Decode(s){
  try{
    const b = Buffer.from(s, 'binary');
    const decoded = b.toString('utf8');
    return decoded;
  }catch(e){
    return s;
  }
}

function sanitizeMessage(msg){
  if(!msg || typeof msg !== 'string') return msg;
  // Try to fix common mojibake by latin1->utf8 roundtrip
  let candidate = tryLatin1Decode(msg);
  // If roundtrip produced replacement chars or weird sequences, fall back to original
  if(candidate.includes('\uFFFD')) candidate = msg;
  // Remove diacritics
  const noDiacritics = removeDiacritics(candidate);
  // Remove problematic control characters
  return noDiacritics.replace(/[\x00-\x1F\x7F]/g, '').trim();
}

function main(){
  if(!fs.existsSync(INPUT)){
    console.error('Arquivo updates.json não encontrado em', INPUT);
    process.exit(1);
  }

  let raw = fs.readFileSync(INPUT, 'utf8');
  // Remove BOM and any leading non-json garbage
  const firstBracket = raw.indexOf('[');
  if(firstBracket > 0) raw = raw.slice(firstBracket);
  raw = raw.trim();
  let data;
  try{ data = JSON.parse(raw); }catch(e){
    console.error('Falha ao parsear updates.json:', e.message);
    process.exit(1);
  }

  if(!Array.isArray(data)){
    console.error('Formato inesperado: esperava um array de updates (root array)');
    process.exit(1);
  }

  const out = data.map(item => {
    const copy = Object.assign({}, item);
    if(copy.message) copy.message = sanitizeMessage(copy.message);
    return copy;
  });

  fs.writeFileSync(OUTPUT, JSON.stringify(out, null, 2), 'utf8');
  console.log('Gerado', OUTPUT);
}

main();
