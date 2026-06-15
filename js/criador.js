const SYSTEM_DATA = {
  races: [
    { id: 'abissal', name: 'Abissal', nd: 4, bonuses: '-1 PV, +1 DES, +1 INT, Imunidade Praga, Fraqueza Podridão, Resistência Solar/Gélido/Pesadelo, Visão no Escuro, Bioluminescência, Estrondo Sônico (CT 15, 2d10 + INT, 4B), Garras Afiadas (1d6 + FR), Corpo Praguento (1d4 Praga 3 rodadas)' },
    { id: 'akivus', name: 'Akivus', nd: 3, bonuses: '+2 DES, Visão no Escuro, Faro Apurado, Presas (1d8 perfuração), Sentidos Aguçados, Garras (1d6), Uivo de Caça' },
    { id: 'vampiros', name: 'Vampiros', nd: 4, bonuses: '+2 FR, +1 RE, Visão Noturna, Regeneração (3 PV/rodada), Fraqueza Solar/Podridão/Sagrado, Garras (1d8), Mordida (1d6 + dreno), Hipnose (CT 15)' },
    { id: 'animalescos', name: 'Animalescos', nd: 2, bonuses: '+2 DES, Sentidos Aguçados, Visão no Escuro' },
    { id: 'plantiferos', name: 'Plantíferos', nd: 1, bonuses: '+2 PV, +1 RE, Fotossíntese, Resistência Física reduzida, Fraqueza Fogo' },
    { id: 'dragao-anao', name: 'Dragão Anão', nd: 3, bonuses: '+2 FR, +1 RF, Pele Escamosa (RF+2), Sopro (1d10 + nível), Visão no Escuro' },
    { id: 'praguentos', name: 'Praguentos', nd: 2, bonuses: '+1 RF, +1 PV, Imunidade Veneno, Corpo Praguento (1d4 Praga 3 rodadas ao serem atingidos)' },
    { id: 'humanos', name: 'Humanos', nd: 1, bonuses: '+1 em qualquer atributo, Versatilidade' },
    { id: 'insectoides', name: 'Insectóides', nd: 2, bonuses: '+1 DES, Carapaça Natural (RF+1), Visão Apurada, Seis membros' },
    { id: 'exos', name: 'E.X.O.s', nd: 1, bonuses: 'Constructo (imunidade veneno/sangramento), Personalidade, +1 RE, Modelos: Executor (+1 RF), Explorador (+2 DES, -5 RF), Guerra (+1 FR, +1 RE+RF, -3 DES), Segurança (+1 RE, +1 RF)' },
    { id: 'espectros', name: 'Espect@&%s', nd: 6, bonuses: '+1 RE, +2 INT, -2 FR, PV sempre 0, Desvantagem social, Fraqueza Sagrado/Solar, Estabilidade (1d4), Instável (5 testes CT 19), Estalo de Estática' }
  ],
  origins: [
    { id: 'filho-do-abismo', name: 'Filho do Abismo', bonuses: 'Perícias: Percepção, Intimidação. Idiomas: Padrão e Abissal. Poderes: Olhos do Abismo (enxerga em escuridão total até 18B); Intuição Sombria (vantagem em Sentidos para detectar emboscadas).' },
    { id: 'guardiao-da-floresta', name: 'Guardião da Floresta', bonuses: 'Perícias: Furtividade, Sobrevivência. Ferramentas: Kit de Herbalismo. Idiomas: Florestal e Padrão. Poderes: Vinhas Protetoras (ação bônus imobiliza inimigo 1 turno); Conexão Verdejante (detecta perigos naturais).' },
    { id: 'herdeiro-de-paladium', name: 'Herdeiro de Paladium', bonuses: 'Perícias: Persuasão, História. Idiomas: Padrão e um a escolha. Poderes: Voz Inspiradora (ação bônus +1 em teste de aliado); Nobre Presença (vantagem em Persuasão com autoridades).' },
    { id: 'experimento-falho', name: 'Experimento falho da Era Dourada', bonuses: 'Perícias: Cosmo, Furtividade. Ferramentas: Kit Médico. Poderes: Instinto de Sobrevivência (≤5 PV ganha +4 PV e +2 RF); Marca da Fuga (vantagem contra paralisia/mentais).' },
    { id: 'descendente-croma', name: 'Descendente Croma', bonuses: 'Perícias: Intimidação, Sobrevivência. Idiomas: Padrão e Prisma. Poderes: Último Reflexo (PV<25% ganha +1 Força, Destreza, RF); Instinto Prismático (vantagem contra medo com ≤25% PV).' },
    { id: 'descendente-floralis', name: 'Descendente Floralis', bonuses: 'Perícias: Atletismo, Acrobacia. Idiomas: Padrão e Floralis. Poderes: Surto Corporal (1x/cena +1 Destreza e dobra deslocamento 1 turno); Vitalidade Eterna (vantagem contra exaustão).' },
    { id: 'mercenario', name: 'Mercenário', bonuses: 'Perícias: Intimidação, Atletismo. Poderes: Adaptabilidade em Combate (Ação Bônus vira Ação Padrão para atacar); Líder de Batalha (vantagem em ataque a aliado 1x/descanso curto).' },
    { id: 'campones', name: 'Camponês', bonuses: 'Perícias: Sobrevivência, História. Idiomas: Padrão e da aldeia. Poderes: Mestre da Terra (colheita/caça eficiente, dobra recursos); Força Natural (carga +3).' },
    { id: 'nerd', name: 'Nerd', bonuses: 'Perícias: Cosmo, Investigação. Idiomas: Padrão. Poderes: Manipulação de Runas (vantagem em sistemas de pedra de Everact); Conexão Arcana (vantagem em Cosmo/Investigação sobre máquinas de Everact).' },
    { id: 'herdeiro-da-forja', name: 'Herdeiro da Forja', bonuses: 'Perícias: História, Forja e Engenharia. Idiomas: Padrão e um a escolha. Poderes: Forja Rápida (forja/repara itens simples rápido); Toque de Ferro (vantagem em testes de forja).' },
    { id: 'morador-cidade-inexistente', name: 'Morador da Cidade Inexistente', bonuses: 'Perícias: Cosmo, Percepção e História. Idiomas: Padrão, Idioma de Cirus. Poderes: Memória Desvanecente (vantagem para compreender tecnologias incomuns); Voz do Vazio (vantagem contra dano mental).' },
    { id: 'medico', name: 'Médico', bonuses: 'Perícias: Medicina e Alquimia. Ferramentas: Kit de medicina e alquimia. Poderes: O Salvador (medicina com vantagem ao aliado caído); Socorrista Nato (pode curar 25 PV 1x/turno com Medicina CT 18).' },
    { id: 'guaraciense', name: 'Guaraciense', bonuses: 'Perícias: Intimidação, Diplomacia e Engenharia. Idiomas: Guaracês, Padrão e +2. Poderes: Guerreiro da Natureza (+2 em testes perto de plantas); Ciência Sustentável (modifica armas com plantas).' },
    { id: 'realeza-vampirica', name: 'Realeza Vampírica', bonuses: 'Perícias: Persuasão, História e Intimidação. Idiomas: Padrão, Vampírico Real e +1. Poderes: Sangue Ancestral (1x/combate recupera PV metade do dano do próximo ataque); Nobreza Sombria (vantagem em Persuasão, Atuação, Intimidação).' },
    { id: 'medroso', name: 'Medroso', bonuses: 'Perícias: Disparada e Furtividade. Idiomas: Padrão. Poderes: CORRA! (reação dobra movimento para longe); Adaptação (resistência a dano de sanidade cumulativa).' },
    { id: 'celebridade', name: 'Celebridade', bonuses: 'Perícias: Liderança, Barganha, +1 relacionada à fama. Idiomas: Padrão. Poderes: Personalidade Inspiradora (aliados recebem bônus=proficiência); Carteirada (vantagem em barganha, intimidação, roubo).' },
    { id: 'ciborgue', name: 'Ciborgue', bonuses: 'Perícias: Engenharia e Forja. Idiomas: Padrão e +1. Poderes: Homem de Ferro (2 modificações corporais metálicas); Homem Bomba (explode partes causando dano subclasse + 6d6).' },
    { id: 'monstro-do-mar', name: 'Monstro do Mar', bonuses: 'Perícias: Navegação, Astronomia e Natação. Idiomas: Padrão e +2. Poderes: Senhor das Águas (controla água, dano de subclasse); Bombeamento (proficiência extra de força em combate).' },
    { id: 'insano', name: 'INSANO', bonuses: 'Perícias: 2 a escolha. Idiomas: Nenhum perfeitamente. Equipamento: Nenhum. Poderes: Doente Mental (0 sanidade inicial, +2 acertos e +1 ação por dano de sanidade); Insanidade (volta com metade dos HP ao cair a 0).' }
  ],
  classes: [
    { id: 'cavaleiros', name: 'Cavaleiros de Paladium', nd: 5, dv: 'd12', bonus: 'Combate corpo a corpo, Armadura pesada' },
    { id: 'rastejantes', name: 'Rastejantes', nd: 5, dv: 'd10', bonus: 'Furtividade, Ataques furtivos' },
    { id: 'protegidos', name: 'Protegidos', nd: 5, dv: 'd12', bonus: 'Linha de frente, Proteção de aliados' },
    { id: 'anomalo', name: 'Anômalo', nd: 4, dv: 'd8', bonus: 'Manipulação elemental, Magia' },
    { id: 'compactador', name: 'Compactador', nd: 1, dv: 'd10', bonus: 'Controle de massa, Corpo denso' },
    { id: 'bestial', name: 'Bestial', nd: 2, dv: 'd10', bonus: 'Transformação bestial, Força bruta' },
    { id: 'atirador-espectral', name: 'Atirador Espectral', nd: 4, dv: 'd8', bonus: 'Combate à distância, Precisão' },
    { id: 'furtassaltante', name: 'Furtassaltante', nd: 3, dv: 'd8', bonus: 'Mobilidade, Ataques relâmpago' },
    { id: 'sobrevivente', name: 'Sobrevivente', nd: 0, dv: 'd10', bonus: 'Versatilidade, Adaptação' },
    { id: 'consagrados', name: 'Consagrados', nd: 1, dv: 'd8', bonus: 'Magia divina, Cura, Suporte' }
  ],
  skills: [
    'Acrobacia', 'Adestramento', 'Arcanismo', 'Atletismo', 'Atuação', 'Conhecimento',
    'Diplomacia', 'Engenharia', 'Esquiva', 'Exploração', 'Furtividade', 'História',
    'Intimidação', 'Intuição', 'Investigação', 'Ladinagem', 'Liderança', 'Medicina',
    'Misticismo', 'Navegação', 'Negociação', 'Ofício', 'Percepção', 'Persuasão',
    'Pontaria', 'Prestidigitação', 'Religião', 'Sobrevivência', 'Tática', 'Tecnologia',
    'Vontade'
  ]
};

document.addEventListener('DOMContentLoaded', () => {
  const form = {};
  const els = ['c-name','c-age','c-gender','c-player','c-portrait','c-backstory',
    'c-race','c-subrace','c-origin','c-class','c-level',
    'c-pvs','c-re','c-rf','c-des','c-fr','c-int','c-fama','c-sen','c-cosmo','c-ea',
    'c-weapon1','c-weapon2','c-armor','c-items','c-money'];
  els.forEach(id => { form[id] = document.getElementById(id); });

  const cDef = document.getElementById('c-def');
  const cDefe = document.getElementById('c-defe');
  const cInit = document.getElementById('c-init');
  const cSan = document.getElementById('c-san');

  const steps = document.querySelectorAll('.creator-panel');
  const stepBtns = document.querySelectorAll('.creator-step');
  let currentStep = 1;
  let portraitBase64 = '';

  // Image upload preview
  const portraitInput = form['c-portrait'];
  const previewBox = document.getElementById('c-portrait-preview');
  portraitInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) { previewBox.innerHTML = ''; portraitBase64 = ''; return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      portraitBase64 = ev.target.result;
      previewBox.innerHTML = `<img src="${portraitBase64}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
  });

  function showStep(n) {
    steps.forEach(s => s.classList.remove('active'));
    stepBtns.forEach(b => b.classList.remove('active'));
    document.getElementById('step-' + n).classList.add('active');
    stepBtns.forEach(b => {
      if (parseInt(b.dataset.step) === n) b.classList.add('active');
    });
    currentStep = n;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (n === 8) renderReview();
  }

  document.querySelectorAll('.creator-next').forEach(btn => {
    btn.addEventListener('click', () => showStep(parseInt(btn.dataset.next)));
  });
  document.querySelectorAll('.creator-prev').forEach(btn => {
    btn.addEventListener('click', () => showStep(parseInt(btn.dataset.prev)));
  });
  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => showStep(parseInt(btn.dataset.step)));
  });

  function populateSelect(sel, data) {
    data.forEach(item => {
      const o = document.createElement('option');
      o.value = item.id;
      o.textContent = item.name;
      sel.appendChild(o);
    });
  }
  populateSelect(form['c-race'], SYSTEM_DATA.races);
  populateSelect(form['c-origin'], SYSTEM_DATA.origins);
  populateSelect(form['c-class'], SYSTEM_DATA.classes);

  form['c-race'].addEventListener('change', () => {
    const id = form['c-race'].value;
    const box = document.getElementById('c-race-info');
    const sub = form['c-subrace'];
    sub.innerHTML = '<option value="">Nenhum</option>';
    if (!id) { box.innerHTML = ''; return; }
    const race = SYSTEM_DATA.races.find(r => r.id === id);
    box.innerHTML = `<strong>${race.name}</strong> (ND ${race.nd})<br><em>${race.bonuses}</em>`;
    if (id === 'exos') {
      ['Executor (+1 RF)','Explorador (+2 DES, -5 RF)','Guerra (+1 FR, +1 RE+RF, -3 DES)','Segurança (+1 RE, +1 RF)'].forEach(m => {
        const o = document.createElement('option');
        o.value = m;
        o.textContent = m;
        sub.appendChild(o);
      });
      sub.value = '';
    }
  });

  form['c-origin'].addEventListener('change', () => {
    const id = form['c-origin'].value;
    const box = document.getElementById('c-origin-info');
    if (!id) { box.innerHTML = ''; return; }
    const origin = SYSTEM_DATA.origins.find(o => o.id === id);
    box.innerHTML = `<strong>${origin.name}</strong><br><em>${origin.bonuses}</em>`;
  });

  form['c-class'].addEventListener('change', () => {
    const id = form['c-class'].value;
    const box = document.getElementById('c-class-info');
    if (!id) { box.innerHTML = ''; return; }
    const cls = SYSTEM_DATA.classes.find(c => c.id === id);
    box.innerHTML = `<strong>${cls.name}</strong> (ND ${cls.nd}, DV ${cls.dv})<br><em>${cls.bonus}</em>`;
  });

  const skillsGrid = document.getElementById('c-skills-grid');
  SYSTEM_DATA.skills.forEach(skill => {
    const label = document.createElement('label');
    label.className = 'creator-skill';
    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.value = skill;
    label.appendChild(cb);
    label.appendChild(document.createTextNode(' ' + skill));
    skillsGrid.appendChild(label);
  });

  function calcDerived() {
    const pvs = parseFloat(form['c-pvs'].value) || 0;
    const re = parseFloat(form['c-re'].value) || 0;
    const rf = parseFloat(form['c-rf'].value) || 0;
    const des = parseFloat(form['c-des'].value) || 0;
    const int = parseFloat(form['c-int'].value) || 0;
    const def = (rf * Math.pow(pvs, 0.6)) / 6;
    const defe = (re * Math.sqrt(pvs)) / 8;
    const init = des;
    const san = 10 + int;
    cDef.textContent = def.toFixed(1);
    cDefe.textContent = defe.toFixed(1);
    cInit.textContent = init;
    cSan.textContent = san;
  }
  ['c-pvs','c-re','c-rf','c-des','c-fr','c-int','c-fama','c-sen','c-cosmo','c-ea'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calcDerived);
  });
  calcDerived();

  function getCharData() {
    const skills = [...document.querySelectorAll('#c-skills-grid input:checked')].map(c => c.value);
    return {
      name: form['c-name'].value || '(sem nome)',
      age: form['c-age'].value || '—',
      gender: form['c-gender'].value || '—',
      player: form['c-player'].value || '—',
      portrait: portraitBase64,
      backstory: form['c-backstory'].value || '—',
      race: form['c-race'].selectedOptions[0]?.text || '(não selecionada)',
      subrace: form['c-subrace'].value || '',
      origin: form['c-origin'].selectedOptions[0]?.text || '(não selecionada)',
      cls: form['c-class'].selectedOptions[0]?.text || '(não selecionada)',
      level: form['c-level'].value || '1',
      pvs: form['c-pvs'].value, re: form['c-re'].value, rf: form['c-rf'].value,
      des: form['c-des'].value, fr: form['c-fr'].value, intv: form['c-int'].value,
      fama: form['c-fama'].value, sen: form['c-sen'].value,
      cosmo: form['c-cosmo'].value, ea: form['c-ea'].value,
      def: cDef.textContent, defe: cDefe.textContent,
      init: cInit.textContent, san: cSan.textContent,
      skills: skills,
      weapon1: form['c-weapon1'].value, weapon2: form['c-weapon2'].value,
      armor: form['c-armor'].value, items: form['c-items'].value,
      money: form['c-money'].value
    };
  }

  function renderReview() {
    const d = getCharData();
    const review = document.getElementById('c-review');
    let html = `<div class="review-card"><h3>${d.name}</h3>`;
    if (d.portrait) html += `<div class="review-portrait"><img src="${d.portrait}" alt="Retrato"></div>`;
    html += `<p><strong>Raça:</strong> ${d.race}${d.subrace ? ' ('+d.subrace+')' : ''} | <strong>Origem:</strong> ${d.origin} | <strong>Classe:</strong> ${d.cls} (Nv ${d.level})</p>`;
    html += `<p><strong>Atributos:</strong> PVs ${d.pvs}, RE ${d.re}, RF ${d.rf}, DES ${d.des}, FR ${d.fr}, INT ${d.intv}, Fama ${d.fama}, SEN ${d.sen}, COSMO ${d.cosmo}, EA ${d.ea}</p>`;
    html += `<p><strong>DEF</strong> ${d.def} | <strong>DEFe</strong> ${d.defe} | <strong>Iniciativa</strong> ${d.init} | <strong>Sanidade</strong> ${d.san}</p>`;
    html += `<p><strong>Perícias:</strong> ${d.skills.length ? d.skills.join(', ') : 'nenhuma'}</p>`;
    const eq = [d.weapon1, d.weapon2, d.armor].filter(Boolean).join(', ');
    if (eq) html += `<p><strong>Equipamento:</strong> ${eq}</p>`;
    if (d.items) html += `<p><strong>Itens:</strong> ${d.items}</p>`;
    if (d.money) html += `<p><strong>Dinheiro:</strong> ${d.money}</p>`;
    if (d.backstory && d.backstory !== '—') html += `<p><strong>História:</strong><br>${d.backstory}</p>`;
    html += `</div>`;
    review.innerHTML = html;
  }

  document.getElementById('c-save').addEventListener('click', () => {
    const d = getCharData();
    const data = { ...d, id: 'char_' + Date.now() };
    const saved = JSON.parse(localStorage.getItem('wuitalur_chars') || '[]');
    saved.push(data);
    localStorage.setItem('wuitalur_chars', JSON.stringify(saved));
    const msg = document.getElementById('c-saved-msg');
    msg.textContent = 'Personagem salvo com sucesso!';
    msg.className = 'creator-msg success';
    setTimeout(() => { msg.textContent = ''; msg.className = 'creator-msg'; }, 3000);
  });

  document.getElementById('c-reset').addEventListener('click', () => {
    if (!confirm('Tem certeza? Todos os campos serão limpos.')) return;
    els.forEach(id => {
      const el = form[id];
      if (el) {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else if (el.type === 'file') { el.value = ''; previewBox.innerHTML = ''; portraitBase64 = ''; }
        else el.value = '';
      }
    });
    document.querySelectorAll('#c-skills-grid input').forEach(c => c.checked = false);
    document.getElementById('c-race-info').innerHTML = '';
    document.getElementById('c-origin-info').innerHTML = '';
    document.getElementById('c-class-info').innerHTML = '';
    calcDerived();
    const msg = document.getElementById('c-saved-msg');
    msg.textContent = '';
    msg.className = 'creator-msg';
  });

  // Export PDF - open character sheet in new window
  document.getElementById('c-export-pdf').addEventListener('click', () => {
    const d = getCharData();
    const w = window.open('', '_blank');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${d.name} — Ficha de Personagem</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #0D0D12; color: #E4E4EC; padding: 40px; }
  .sheet { max-width: 1000px; margin: 0 auto; background: #16161E; border: 1px solid #2E2E3E; border-radius: 16px; padding: 40px; }
  .sheet-header { display: flex; gap: 30px; align-items: flex-start; margin-bottom: 30px; border-bottom: 1px solid #2E2E3E; padding-bottom: 25px; }
  .sheet-portrait { width: 120px; height: 140px; border-radius: 8px; border: 1px solid #2E2E3E; overflow: hidden; flex-shrink: 0; background: #1E1E2A; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: #6B6B7B; }
  .sheet-portrait img { width: 100%; height: 100%; object-fit: cover; }
  .sheet-title { flex: 1; }
  .sheet-title h1 { font-family: 'Cinzel', serif; font-size: 2rem; color: #E4E4EC; margin-bottom: 4px; }
  .sheet-title .subtitle { color: #6B6B7B; font-size: 0.85rem; }
  .sheet-row { display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; }
  .sheet-field { flex: 1; min-width: 140px; }
  .sheet-field label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #6B6B7B; margin-bottom: 4px; }
  .sheet-field .val { font-size: 0.95rem; color: #E4E4EC; background: rgba(255,255,255,0.04); border: 1px solid #2E2E3E; border-radius: 6px; padding: 6px 10px; min-height: 32px; outline: none; transition: border-color 0.2s; }
  .sheet-field .val:focus { border-color: #7C3AED; }
  .sheet-section { margin-bottom: 25px; }
  .sheet-section h2 { font-family: 'Cinzel', serif; font-size: 1rem; color: #7C3AED; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #2E2E3E; padding-bottom: 6px; margin-bottom: 12px; }
  .sheet-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; }
  .sheet-stat { text-align: center; }
  .sheet-stat .stat-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6B6B7B; }
  .sheet-stat .stat-val { font-family: 'JetBrains Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #E4E4EC; background: rgba(255,255,255,0.04); border: 1px solid #2E2E3E; border-radius: 6px; padding: 6px 10px; margin-top: 2px; outline: none; min-height: 36px; text-align: center; }
  .sheet-stat .stat-val:focus { border-color: #7C3AED; }
  .sheet-skills { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 4px; }
  .sheet-skills .skill-item { font-size: 0.85rem; color: #9898A8; padding: 3px 8px; background: rgba(255,255,255,0.03); border-radius: 4px; border: 1px solid transparent; outline: none; }
  .sheet-skills .skill-item:focus { border-color: #7C3AED; }
  .sheet-textarea { width: 100%; min-height: 60px; background: rgba(255,255,255,0.04); border: 1px solid #2E2E3E; border-radius: 6px; padding: 8px 12px; color: #E4E4EC; font-family: 'Inter', sans-serif; font-size: 0.9rem; outline: none; resize: vertical; }
  .sheet-textarea:focus { border-color: #7C3AED; }
  .sheet-footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #2E2E3E; text-align: center; font-size: 0.75rem; color: #6B6B7B; font-family: 'Cinzel', serif; letter-spacing: 0.05em; }
  @media print { body { padding: 0; } .sheet { border: none; border-radius: 0; padding: 30px; } }
</style></head><body>
<div class="sheet">
  <div class="sheet-header">
    <div class="sheet-portrait">${d.portrait ? '<img src="'+d.portrait+'">' : 'Sem<br>Ilustração'}</div>
    <div class="sheet-title">
      <h1 contenteditable="true">${d.name}</h1>
      <div class="subtitle"><span contenteditable="true">${d.race}</span>${d.subrace ? ' ('+d.subrace+')' : ''} · <span contenteditable="true">${d.origin}</span> · <span contenteditable="true">${d.cls}</span> · Nv <span contenteditable="true">${d.level}</span></div>
    </div>
  </div>
  <div class="sheet-row">
    <div class="sheet-field"><label>Idade</label><div class="val" contenteditable="true">${d.age}</div></div>
    <div class="sheet-field"><label>Gênero</label><div class="val" contenteditable="true">${d.gender}</div></div>
    <div class="sheet-field"><label>Jogador</label><div class="val" contenteditable="true">${d.player}</div></div>
    <div class="sheet-field"><label>Dinheiro</label><div class="val" contenteditable="true">${d.money || '—'}</div></div>
  </div>
  <div class="sheet-section">
    <h2>Atributos & Derivados</h2>
    <div class="sheet-stats">
      <div class="sheet-stat"><div class="stat-label" style="color:#55a630">PVs</div><div class="stat-val" contenteditable="true" style="color:#55a630">${d.pvs}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#4a49ff">RE</div><div class="stat-val" contenteditable="true" style="color:#4a49ff">${d.re}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#ff1f1f">RF</div><div class="stat-val" contenteditable="true" style="color:#ff1f1f">${d.rf}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#ff9500">DES</div><div class="stat-val" contenteditable="true" style="color:#ff9500">${d.des}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#b30000">FR</div><div class="stat-val" contenteditable="true" style="color:#b30000">${d.fr}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#7e00c2">INT</div><div class="stat-val" contenteditable="true" style="color:#7e00c2">${d.intv}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#e200c2">Fama</div><div class="stat-val" contenteditable="true" style="color:#e200c2">${d.fama}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#f5b700">SEN</div><div class="stat-val" contenteditable="true" style="color:#f5b700">${d.sen}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#9e00ff">COSMO</div><div class="stat-val" contenteditable="true" style="color:#9e00ff">${d.cosmo}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#4dd0e1">EA</div><div class="stat-val" contenteditable="true" style="color:#4dd0e1">${d.ea}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#ff1f1f">DEF</div><div class="stat-val" contenteditable="true" style="color:#ff1f1f">${d.def}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#4a49ff">DEFe</div><div class="stat-val" contenteditable="true" style="color:#4a49ff">${d.defe}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#ff9500">Iniciativa</div><div class="stat-val" contenteditable="true" style="color:#ff9500">${d.init}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#55a630">Sanidade</div><div class="stat-val" contenteditable="true" style="color:#55a630">${d.san}</div></div>
    </div>
  </div>
  <div class="sheet-section">
    <h2>Perícias</h2>
    <div class="sheet-skills">${d.skills.length ? d.skills.map(s => '<div class="skill-item" contenteditable="true">'+s+'</div>').join('') : '<div class="skill-item" contenteditable="true" style="color:#6B6B7B">Nenhuma</div>'}</div>
  </div>
  <div class="sheet-section">
    <h2>Equipamento</h2>
    <div class="sheet-row">
      <div class="sheet-field"><label>Arma Principal</label><div class="val" contenteditable="true">${d.weapon1 || '—'}</div></div>
      <div class="sheet-field"><label>Arma Secundária</label><div class="val" contenteditable="true">${d.weapon2 || '—'}</div></div>
      <div class="sheet-field"><label>Armadura</label><div class="val" contenteditable="true">${d.armor || '—'}</div></div>
    </div>
    <div class="sheet-field"><label>Itens</label><div class="sheet-textarea" contenteditable="true">${d.items || '—'}</div></div>
  </div>
  <div class="sheet-section">
    <h2>História</h2>
    <div class="sheet-textarea" contenteditable="true" style="min-height:80px">${d.backstory || '—'}</div>
  </div>
  <div class="sheet-footer">WUITALUR — Ficha de Personagem</div>
</div>
<script>
  document.querySelectorAll('[contenteditable]').forEach(el => {
    el.addEventListener('keydown', e => { if (e.key === 'Enter') document.execCommand('insertLineBreak'); });
  });
</script>
</body></html>`);
    w.document.close();
  });
});
