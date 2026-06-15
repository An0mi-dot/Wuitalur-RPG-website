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

  // Populate dropdowns
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

  // Race change -> show bonuses + subrace
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

  // Skills grid
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

  // Calculated stats
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

  // Review
  function renderReview() {
    const review = document.getElementById('c-review');
    const name = form['c-name'].value || '(sem nome)';
    const race = form['c-race'].selectedOptions[0]?.text || '(não selecionada)';
    const origin = form['c-origin'].selectedOptions[0]?.text || '(não selecionada)';
    const cls = form['c-class'].selectedOptions[0]?.text || '(não selecionada)';
    const level = form['c-level'].value || 1;
    const skills = [...document.querySelectorAll('#c-skills-grid input:checked')].map(c => c.value).join(', ') || 'nenhuma';
    const selected = [];
    ['name','age','gender','player','race','subrace','origin','class','level','pvs','re','rf','des','fr','int','fama','sen','cosmo','ea','weapon1','weapon2','armor','items','money'].forEach(k => {
      const el = form['c-' + k];
      if (el) selected.push({ label: k, value: el.value || '—' });
    });
    let html = `<div class="review-card"><h3>${name}</h3>`;
    html += `<p><strong>Raça:</strong> ${race} | <strong>Origem:</strong> ${origin} | <strong>Classe:</strong> ${cls} (Nv ${level})</p>`;
    html += `<p><strong>Atributos:</strong> PVs ${form['c-pvs'].value}, RE ${form['c-re'].value}, RF ${form['c-rf'].value}, DES ${form['c-des'].value}, FR ${form['c-fr'].value}, INT ${form['c-int'].value}, Fama ${form['c-fama'].value}, SEN ${form['c-sen'].value}, COSMO ${form['c-cosmo'].value}, EA ${form['c-ea'].value}</p>`;
    html += `<p><strong>DEF</strong> ${cDef.textContent} | <strong>DEFe</strong> ${cDefe.textContent} | <strong>Iniciativa</strong> ${cInit.textContent} | <strong>Sanidade</strong> ${cSan.textContent}</p>`;
    html += `<p><strong>Perícias:</strong> ${skills}</p>`;
    const eq = [form['c-weapon1'].value, form['c-weapon2'].value, form['c-armor'].value].filter(Boolean).join(', ');
    if (eq) html += `<p><strong>Equipamento:</strong> ${eq}</p>`;
    if (form['c-items'].value) html += `<p><strong>Itens:</strong> ${form['c-items'].value}</p>`;
    if (form['c-money'].value) html += `<p><strong>Dinheiro:</strong> ${form['c-money'].value}</p>`;
    if (form['c-backstory'].value) html += `<p><strong>História:</strong><br>${form['c-backstory'].value}</p>`;
    html += `</div>`;
    review.innerHTML = html;
  }

  // Save
  document.getElementById('c-save').addEventListener('click', () => {
    const data = {};
    els.forEach(id => {
      const el = form[id];
      data[id.replace('c-','')] = el ? el.value : '';
    });
    data.skills = [...document.querySelectorAll('#c-skills-grid input:checked')].map(c => c.value);
    data.id = 'char_' + Date.now();
    data.def = cDef.textContent;
    data.defe = cDefe.textContent;
    data.init = cInit.textContent;
    data.san = cSan.textContent;
    const saved = JSON.parse(localStorage.getItem('wuitalur_chars') || '[]');
    saved.push(data);
    localStorage.setItem('wuitalur_chars', JSON.stringify(saved));
    const msg = document.getElementById('c-saved-msg');
    msg.textContent = 'Personagem salvo com sucesso!';
    msg.className = 'creator-msg success';
    setTimeout(() => { msg.textContent = ''; msg.className = 'creator-msg'; }, 3000);
  });

  // Reset
  document.getElementById('c-reset').addEventListener('click', () => {
    if (!confirm('Tem certeza? Todos os campos serão limpos.')) return;
    els.forEach(id => {
      const el = form[id];
      if (el) {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
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
});
