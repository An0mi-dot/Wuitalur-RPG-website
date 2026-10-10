const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Read keys from mesa.js to avoid hardcoding
const js = fs.readFileSync('js/mesa.js', 'utf8');
const urlMatch = js.match(/SUPABASE_URL:\s*'([^']+)'/);
const keyMatch = js.match(/SUPABASE_KEY:\s*'([^']+)'/);

if (!urlMatch || !keyMatch) {
    console.error("Could not find keys");
    process.exit(1);
}

const supabase = createClient(urlMatch[1], keyMatch[1]);

async function check() {
    const { data, error } = await supabase.from('personagens').select('*');
    if (error) console.error(error);
    else console.log(data.map(p => ({ id: p.id, nome: p.nome, slot: p.slot })));
}

check();
