const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const js = fs.readFileSync('js/mesa.js', 'utf8');
const urlMatch = js.match(/SUPABASE_URL:\s*'([^']+)'/);
const keyMatch = js.match(/SUPABASE_KEY:\s*'([^']+)'/);
const supabase = createClient(urlMatch[1], keyMatch[1]);

async function check() {
    const { data, error } = await supabase.from('personagens').select('*');
    if (data && data.length > 0) {
        console.log("Keys:", Object.keys(data[0]));
        console.log("Willian keys:", Object.keys(data.find(d => d.nome === 'Willian') || {}));
    }
}
check();
