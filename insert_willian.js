const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const js = fs.readFileSync('js/mesa.js', 'utf8');
const urlMatch = js.match(/SUPABASE_URL:\s*'([^']+)'/);
const keyMatch = js.match(/SUPABASE_KEY:\s*'([^']+)'/);
const supabase = createClient(urlMatch[1], keyMatch[1]);

async function run() {
    const willian = {
        slot: 5,
        token: 'J8W4',
        nome: 'Willian',
        raca: 'Feline',
        arquetipo: 'Armeiro',
        idade: '?',
        altura: '?',
        hp: 10,
        hp_max: 10,
        pe: 10,
        pe_max: 10,
        st: 0,
        st_max: 30,
        stress_points: 0,
        stress_points_max: 6,
        atributos: {
            "Força": "d8",
            "Vigor": "d8",
            "Mente": "d8",
            "Saúde": "d8",
            "imagem": "assets/william.png"
        },
        bonus: [],
        pericias: [],
        habilidades: []
    };
    
    // Check if Willian exists
    const { data: existing } = await supabase.from('personagens').select('*').eq('slot', 5).single();
    if (existing) {
        // update
        console.log("Updating existing Willian");
        const newAttrs = { ...existing.atributos, imagem: 'assets/william.png' };
        await supabase.from('personagens').update({ atributos: newAttrs }).eq('slot', 5);
    } else {
        console.log("Inserting new Willian");
        await supabase.from('personagens').insert([willian]);
    }
}
run().then(() => console.log('Done'));
