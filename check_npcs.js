const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const js = fs.readFileSync('js/mesa.js', 'utf8');
const urlMatch = js.match(/SUPABASE_URL:\s*'([^']+)'/);
const keyMatch = js.match(/SUPABASE_KEY:\s*'([^']+)'/);
const supabase = createClient(urlMatch[1], keyMatch[1]);

async function check() {
    const { data: npcData, error: err } = await supabase.from('npcs').select('*').limit(5);
    if (!err) console.log("NPCs:", npcData);
    else console.log("No npcs table");
}

check();
