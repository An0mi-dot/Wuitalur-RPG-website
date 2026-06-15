const SYSTEM_DATA = {
  races: [
    { id: 'abissal', name: 'Abissal', nd: 4, abilities: ['Imunidade Praga', 'Fraqueza Podridão/Solar/Gélido/Pesadelo', 'Visão no Escuro', 'Bioluminescência', 'Estrondo Sônico (CT 15, 2d10+INT, 4B)', 'Garras Afiadas (1d6+FR)', 'Corpo Praguento (1d4 Praga 3 rodadas)'] },
    { id: 'akivus', name: 'Akivus', nd: 3, abilities: ['Visão no Escuro', 'Faro Apurado', 'Presas (1d8 perfuração)', 'Sentidos Aguçados', 'Garras (1d6)', 'Uivo de Caça'] },
    { id: 'vampiros', name: 'Vampiros', nd: 4, abilities: ['Visão Noturna', 'Regeneração (3 PV/rodada)', 'Fraqueza Solar/Podridão/Sagrado', 'Garras (1d8)', 'Mordida (1d6 + dreno)', 'Hipnose (CT 15)'] },
    { id: 'animalescos', name: 'Animalescos', nd: 2, abilities: ['Sentidos Aguçados', 'Visão no Escuro'] },
    { id: 'plantiferos', name: 'Plantíferos', nd: 1, abilities: ['Fotossíntese', 'Resistência Física reduzida', 'Fraqueza Fogo'] },
    { id: 'dragao-anao', name: 'Dragão Anão', nd: 3, abilities: ['Pele Escamosa (RF+2)', 'Sopro (1d10+nível)', 'Visão no Escuro'] },
    { id: 'praguentos', name: 'Praguentos', nd: 2, abilities: ['Imunidade Veneno', 'Corpo Praguento (1d4 Praga 3 rodadas ao ser atingido)'] },
    { id: 'humanos', name: 'Humanos', nd: 1, abilities: ['Versatilidade'] },
    { id: 'insectoides', name: 'Insectóides', nd: 2, abilities: ['Carapaça Natural (RF+1)', 'Visão Apurada', 'Seis Membros'] },
    { id: 'exos', name: 'E.X.O.s', nd: 1, abilities: ['Constructo (imunidade veneno/sangramento)', 'Personalidade'] },
    { id: 'espectros', name: 'Espect@&%s', nd: 6, abilities: ['PV sempre 0', 'Desvantagem social', 'Fraqueza Sagrado/Solar', 'Estabilidade (1d4)', 'Instável (5 testes CT 19)', 'Estalo de Estática'] }
  ],
  origins: [
    { id: 'filho-do-abismo', name: 'Filho do Abismo', abilities: ['Olhos do Abismo (enxerga escuridão total 18B)', 'Intuição Sombria (vantagem Sentidos p/ emboscadas)'] },
    { id: 'guardiao-da-floresta', name: 'Guardião da Floresta', abilities: ['Vinhas Protetoras (ação bônus imobiliza 1 turno)', 'Conexão Verdejante (detecta perigos naturais)'] },
    { id: 'herdeiro-de-paladium', name: 'Herdeiro de Paladium', abilities: ['Voz Inspiradora (ação bônus +1 teste aliado)', 'Nobre Presença (vantagem Persuasão c/ autoridades)'] },
    { id: 'experimento-falho', name: 'Experimento falho da Era Dourada', abilities: ['Instinto de Sobrevivência (<=5 PV +4 PV e +2 RF)', 'Marca da Fuga (vantagem vs paralisia/mentais)'] },
    { id: 'descendente-croma', name: 'Descendente Croma', abilities: ['Último Reflexo (PV<25% +1 FR/DES/RF)', 'Instinto Prismático (vantagem vs medo <=25% PV)'] },
    { id: 'descendente-floralis', name: 'Descendente Floralis', abilities: ['Surto Corporal (1x/cena +1 DES, dobra deslocamento 1 turno)', 'Vitalidade Eterna (vantagem vs exaustão)'] },
    { id: 'mercenario', name: 'Mercenário', abilities: ['Adaptabilidade em Combate (Ação Bônus vira Ação Padrão p/ atacar)', 'Líder de Batalha (vantagem ataque aliado 1x/descanso curto)'] },
    { id: 'campones', name: 'Camponês', abilities: ['Mestre da Terra (colheita/caça eficiente, dobra recursos)', 'Força Natural (carga +3)'] },
    { id: 'nerd', name: 'Nerd', abilities: ['Manipulação de Runas (vantagem sistemas de pedra de Everact)', 'Conexão Arcana (vantagem Cosmo/Investigação sobre máquinas Everact)'] },
    { id: 'herdeiro-da-forja', name: 'Herdeiro da Forja', abilities: ['Forja Rápida (forja/repara itens simples rápido)', 'Toque de Ferro (vantagem testes de forja)'] },
    { id: 'morador-cidade-inexistente', name: 'Morador da Cidade Inexistente', abilities: ['Memória Desvanecente (vantagem p/ tecnologias incomuns)', 'Voz do Vazio (vantagem vs dano mental)'] },
    { id: 'medico', name: 'Médico', abilities: ['O Salvador (medicina c/ vantagem em aliado caído)', 'Socorrista Nato (curar 25 PV 1x/turno Medicina CT 18)'] },
    { id: 'guaraciense', name: 'Guaraciense', abilities: ['Guerreiro da Natureza (+2 testes perto de plantas)', 'Ciência Sustentável (modifica armas c/ plantas)'] },
    { id: 'realeza-vampirica', name: 'Realeza Vampírica', abilities: ['Sangue Ancestral (1x/combate recupera PV metade dano próximo ataque)', 'Nobreza Sombria (vantagem Persuasão/Atuação/Intimidação)'] },
    { id: 'medroso', name: 'Medroso', abilities: ['CORRA! (reação dobra movimento para longe)', 'Adaptação (resistência a dano de sanidade cumulativa)'] },
    { id: 'celebridade', name: 'Celebridade', abilities: ['Personalidade Inspiradora (aliados bônus=proficiência)', 'Carteirada (vantagem barganha/intimidação/roubo)'] },
    { id: 'ciborgue', name: 'Ciborgue', abilities: ['Homem de Ferro (2 modificações metálicas)', 'Homem Bomba (explode partes, dano subclasse+6d6)'] },
    { id: 'monstro-do-mar', name: 'Monstro do Mar', abilities: ['Senhor das Águas (controla água, dano subclasse)', 'Bombeamento (proficiência extra FR em combate)'] },
    { id: 'insano', name: 'INSANO', abilities: ['Doente Mental (0 sanidade inicial, +2 acertos e +1 ação por dano sanidade)', 'Insanidade (volta c/ metade HP ao cair a 0)'] }
  ],
  classes: [
    { id: 'cavaleiros', name: 'Cavaleiros de Paladium', nd: 2, dv: 10, abilities: {
      1: ['Golpe Solar', 'Égide Radiante'],
      4: ['Olhar Julgador', 'Julgamento Ardente ou Solo Sagrado'],
      8: ['Julgamento Silencioso', 'Coroa de Chamas ou Fincada Chamuscante'],
      10: ['Memória das Cinzas', 'Lança do Sol ou Erupção Solar'],
      12: ['Olhar da Divindade ou Vontade de Paladium'],
      15: ['Vingança Solar ou Fortaleza Inabalável'],
      20: ['Avatar da Estrela Ardente']
    }},
    { id: 'rastejantes', name: 'Rastejantes', nd: 3, dv: 8, abilities: {
      1: ['Toque Adoentado (Praga) ou Sussurro Desorientador (Pesadelo)'],
      2: ['Mente Maligna'],
      3: ['Invocação do Rastejos e Elemento Abissal'],
      4: ['Incremento'],
      5: ['Ataque Extra'],
      6: ['Enxame Devorador (Praga) ou Imbuição Aterrorizante (Pesadelo)'],
      7: ['Toque Corrosivo (Praga) ou Abraço do Terror (Pesadelo)'],
      8: ['Incremento'],
      9: ['Sangue Pestilento (Praga) ou Manto de Fobia (Pesadelo)'],
      10: ['Ataque Extra'],
      11: ['Ninho da Peste (Praga) ou Correntes do Desespero (Pesadelo)'],
      12: ['Incremento'],
      13: ['Troca Mente/Física'],
      14: ['Peste Fulminante (Praga) ou Estilhaçar Sanidade (Pesadelo)'],
      15: ['Ataque Extra'],
      16: ['Incremento', 'Ceifa Entrópica (Praga) ou Banquete de Pavor (Pesadelo)'],
      19: ['Incremento'],
      20: ['Ataque Extra', 'Julgamento do Abismo']
    }},
    { id: 'protegidos', name: 'Protegidos', nd: 5, dv: 8, abilities: {
      1: ['Proteger', 'Divida Comigo o Fardo', 'Se dói em mim, dói menos em você', 'Ele quer ver você bem'],
      4: ['Você é tudo que tenho ou Não vou deixá-lo cair', 'Garras da Sombra ou Vigília Eterna (Criatura)'],
      6: ['A Sombra está comigo ou Juntos, até o fim', 'Rugido Primordial ou Instinto Protetor (Criatura)'],
      8: ['Eles esqueceram da escuridão ou Entre nós, o silêncio reina', 'Salto das Sombras ou Regeneração Sombria (Criatura)'],
      12: ['Proteja-os, Sombra! ou Estou de olho em você, amigo', 'Abraço Sufocante ou Sentir o Perigo (Criatura)'],
      15: ['Se afaste! ou Ele está com medo', 'Fúria Protetora ou Vínculo Inabalável (Criatura)'],
      20: ['Somos Um, até o Fim', 'Guardião Ancestral (Criatura)']
    }},
    { id: 'anomalo', name: 'Anômalo', nd: 4, dv: 10, abilities: {
      1: ['Vórtice Anulador', 'Estilo de Dominância'],
      2: ['Conhecimento da Morte', 'Domo de Pressão'],
      3: ['Destino Mortal', 'Teleporte Dimensional'],
      7: ['Armadura Fragmentada'],
      11: ['Atrofiar Inimigo'],
      14: ['Tiro de Ar'],
      16: ['Prensa Anômala'],
      20: ['Falha Temporal']
    }},
    { id: 'compactador', name: 'Compactador', nd: 1, dv: 14, abilities: {
      1: ['Punho de Inércia', 'Revestimento Essencial'],
      3: ['Distorção de Ritmo ou Troca de Estrutura'],
      5: ['Núcleo Condensado', 'Ataque Extra'],
      7: ['Fratura de Impacto ou Ancoragem Absoluta'],
      10: ['Colapso Dirigido'],
      12: ['Esmagamento Vetorial ou Campo de Assimetria'],
      14: ['Forma Inabalável ou Reversão Estrutural'],
      16: ['Sombra Astral'],
      18: ['Singularidade Astral'],
      20: ['Forma Transcendente']
    }},
    { id: 'bestial', name: 'Bestial', nd: 2, dv: 14, abilities: {
      1: ['Besta de Carga', 'Couraça Grossa ou Golpes Imprevisíveis'],
      2: ['Corpo Pesado', 'Escudo Ambulante'],
      3: ['Fera Divina', 'Provocação Fervorosa ou Marcação Furiosa'],
      5: ['Ataque Extra', 'Hibernação', 'Alcatéia Imparável ou Alfa Protetor'],
      8: ['Instinto Animal', 'Fator Curativo'],
      10: ['Adaptabilidade Natural', 'Corpo Robusto ou Alcatéia Violenta'],
      13: ['Besta Descontrolada ou Besta Colossal'],
      15: ['Efeito Furioso ou Fúria Bestial Aprimorada'],
      18: ['Corpo Resistente', 'O Rugido de um Verdadeiro Predador'],
      20: ['Retaliação Monstruosa']
    }},
    { id: 'atirador-espectral', name: 'Atirador Espectral', nd: 4, dv: 4, abilities: {
      1: ['Sombra do Caçador ou Marca da Caçada'],
      3: ['Estilo de Caça'],
      4: ['Flecha Fantasma ou Enlace do Espectro'],
      8: ['Fuga Etérea ou Salto Espectral'],
      10: ['Tiro de Aflição ou Absorção Vital'],
      12: ['Lamento do Caçador ou Luz da Caçada'],
      15: ['Caçada Imortal ou Conexão Etérea'],
      20: ['Flecha Florida']
    }},
    { id: 'furtassaltante', name: 'Furtassaltante', nd: 3, dv: 5, abilities: {
      1: ['Golpe das Sombras ou "Desapareci!"'],
      4: ['Passo Fantasma ou Ataque Preciso'],
      6: ['Sombra que Mata ou Esquiva das Sombras'],
      8: ['"Eles esqueceram da escuridão." ou Passagem Invisível'],
      12: ['Mestre das Sombras ou Silêncio Mortal'],
      15: ['Golpe Fantasma ou Marca do Ladrão'],
      20: ['Vontade Assassina']
    }},
    { id: 'sobrevivente', name: 'Sobrevivente', nd: 0, dv: 8, abilities: {
      1: ['Improviso ou Instinto de Perigo'],
      3: ['Recuperação Rápida ou Rastreamento'],
      5: ['Resistência Extrema ou Improviso Avançado'],
      7: ['Sobrevivência em Grupo ou Conhecimento Prático'],
      9: ['Inquebrável ou Armadilhas Improvisadas'],
      11: ['Liderança Natural ou Recuperação Total'],
      13: ['Sobrevivente']
    }},
    { id: 'consagrados', name: 'Consagrados', nd: 1, dv: 8, abilities: {
      1: ['Catalisador Divino'],
      3: ['Vínculo Elemental', 'Doutrina: Campeão ou Profeta'],
      4: ['Confluência de Selos (+1 Selo, Ampliar Selos)'],
      6: ['Purgar o Infiel (Campeão) ou Pergaminho Litúrgico (Profeta)'],
      8: ['Concentração como Ação Bônus', 'Baluarte da Fé (Campeão) ou Geometria Sagrada (Profeta)'],
      12: ['+1 Selo, manter dois Selos ativos', 'Martírio Vingativo (Campeão) ou Fluxo Contínuo (Profeta)'],
      15: ['Acelerar Selo (1x/cena)', 'Avatar da Destruição (Campeão) ou Improvisação Divina (Profeta)'],
      20: ['+2 Selos, Apoteose (3 rodadas)', 'Glória Final (Campeão) ou Consciência Onipresente (Profeta)']
    }}
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

/* ------------------------------------------------------------------ */
/*  ROLL HISTORY help cap                                              */
/* ------------------------------------------------------------------ */
function trueRandom(max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return (arr[0] % max) + 1;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = {};
  const els = ['c-name','c-age','c-gender','c-player','c-portrait','c-backstory',
    'c-race','c-origin','c-class','c-level',
    'c-pvs','c-re','c-rf','c-des','c-fr','c-int','c-fama','c-sen','c-cosmo','c-ea',
    'c-weapon1','c-weapon2','c-armor','c-items','c-money'];
  els.forEach(id => { form[id] = document.getElementById(id); });

  const cDef = document.getElementById('c-def');
  const cDefe = document.getElementById('c-defe');
  const cSan = document.getElementById('c-san');

  const steps = document.querySelectorAll('.creator-panel');
  const stepBtns = document.querySelectorAll('.creator-step');
  let currentStep = 1;
  let portraitBase64 = '';

  /* dice roller */
  const diceResult = document.getElementById('dice-result');
  const diceHistory = document.getElementById('dice-history');
  const rollHistory = [];

  document.getElementById('dice-btns').addEventListener('click', (e) => {
    const btn = e.target.closest('.dice-btn');
    if (!btn) return;
    const sides = parseInt(btn.dataset.dice, 10);
    const val = trueRandom(sides);
    const label = `d${sides}`;
    rollHistory.unshift({ sides, val });
    if (rollHistory.length > 50) rollHistory.length = 50;
    diceResult.innerHTML = `<span class="roll-label">${label}</span><span class="roll-value">${val}</span>`;
    diceHistory.innerHTML = rollHistory.slice(0, 20).map(r =>
      `<span class="dice-history-item">d${r.sides}: ${r.val}</span>`
    ).join('');
  });

  /* Image upload */
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
    if (!id) { box.innerHTML = ''; return; }
    const race = SYSTEM_DATA.races.find(r => r.id === id);
    const ab = race.abilities.map(a => '<li>' + a + '</li>').join('');
    box.innerHTML = `<strong>${race.name}</strong> (ND ${race.nd})<br><ul style="margin:4px 0 0 16px;font-size:0.85rem;color:var(--text-secondary)">${ab}</ul>`;
  });

  form['c-origin'].addEventListener('change', () => {
    const id = form['c-origin'].value;
    const box = document.getElementById('c-origin-info');
    if (!id) { box.innerHTML = ''; return; }
    const origin = SYSTEM_DATA.origins.find(o => o.id === id);
    const ab = origin.abilities.map(a => '<li>' + a + '</li>').join('');
    box.innerHTML = `<strong>${origin.name}</strong><br><ul style="margin:4px 0 0 16px;font-size:0.85rem;color:var(--text-secondary)">${ab}</ul>`;
  });

  form['c-class'].addEventListener('change', () => {
    const id = form['c-class'].value;
    const box = document.getElementById('c-class-info');
    if (!id) { box.innerHTML = ''; return; }
    const cls = SYSTEM_DATA.classes.find(c => c.id === id);
    box.innerHTML = `<strong>${cls.name}</strong> (ND ${cls.nd}, DV d${cls.dv})<br><em style="color:var(--text-secondary)">${cls.dv} PV no 1º nível + (nível-1)×${Math.ceil(cls.dv/2)+1}</em>`;
    autoCalcPVs();
  });

  form['c-level'].addEventListener('input', autoCalcPVs);

  function autoCalcPVs() {
    const classId = form['c-class'].value;
    const level = parseInt(form['c-level'].value) || 1;
    if (!classId) return;
    const cls = SYSTEM_DATA.classes.find(c => c.id === classId);
    if (!cls) return;
    const perLevel = Math.ceil(cls.dv / 2) + 1;
    const pvs = cls.dv + (level - 1) * perLevel;
    form['c-pvs'].value = pvs;
    calcDerived();
  }

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
    const int = parseFloat(form['c-int'].value) || 0;
    const def = (rf * Math.pow(pvs, 0.6)) / 6;
    const defe = (re * Math.sqrt(pvs)) / 8;
    const san = 10 + int;
    cDef.textContent = def.toFixed(1);
    cDefe.textContent = defe.toFixed(1);
    cSan.textContent = san;
  }
  ['c-pvs','c-re','c-rf','c-des','c-fr','c-int','c-fama','c-sen','c-cosmo','c-ea'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calcDerived);
  });
  calcDerived();

  function getClassAbilities(classId, level) {
    const cls = SYSTEM_DATA.classes.find(c => c.id === classId);
    if (!cls || !cls.abilities) return [];
    const list = [];
    const lvls = Object.keys(cls.abilities).map(Number).sort((a,b) => a-b);
    for (const l of lvls) {
      if (l <= level) list.push(...cls.abilities[l]);
    }
    return list;
  }

  function getCharData() {
    const skills = [...document.querySelectorAll('#c-skills-grid input:checked')].map(c => c.value);
    const raceId = form['c-race'].value;
    const originId = form['c-origin'].value;
    const classId = form['c-class'].value;
    const level = parseInt(form['c-level'].value) || 1;

    const raceData = SYSTEM_DATA.races.find(r => r.id === raceId);
    const originData = SYSTEM_DATA.origins.find(o => o.id === originId);

    const raceAbilities = raceData ? raceData.abilities : [];
    const originAbilities = originData ? originData.abilities : [];
    const classAbilities = getClassAbilities(classId, level);

    return {
      name: form['c-name'].value || '(sem nome)',
      age: form['c-age'].value || '—',
      gender: form['c-gender'].value || '—',
      player: form['c-player'].value || '—',
      portrait: portraitBase64,
      backstory: form['c-backstory'].value || '—',
      race: form['c-race'].selectedOptions[0]?.text || '(não selecionada)',
      origin: form['c-origin'].selectedOptions[0]?.text || '(não selecionada)',
      cls: form['c-class'].selectedOptions[0]?.text || '(não selecionada)',
      level: level,
      pvs: form['c-pvs'].value, re: form['c-re'].value, rf: form['c-rf'].value,
      des: form['c-des'].value, fr: form['c-fr'].value, intv: form['c-int'].value,
      fama: form['c-fama'].value, sen: form['c-sen'].value,
      cosmo: form['c-cosmo'].value, ea: form['c-ea'].value,
      def: cDef.textContent, defe: cDefe.textContent, san: cSan.textContent,
      skills: skills,
      weapon1: form['c-weapon1'].value, weapon2: form['c-weapon2'].value,
      armor: form['c-armor'].value, items: form['c-items'].value,
      money: form['c-money'].value,
      raceAbilities, originAbilities, classAbilities
    };
  }

  function renderReview() {
    const d = getCharData();
    const review = document.getElementById('c-review');
    let html = `<div class="review-card"><h3>${d.name}</h3>`;
    if (d.portrait) html += `<div class="review-portrait"><img src="${d.portrait}" alt="Retrato"></div>`;
    html += `<p><strong>Raça:</strong> ${d.race} | <strong>Origem:</strong> ${d.origin} | <strong>Classe:</strong> ${d.cls} (Nv ${d.level})</p>`;
    html += `<p><strong>Atributos:</strong> PVs ${d.pvs}, RE ${d.re}, RF ${d.rf}, DES ${d.des}, FR ${d.fr}, INT ${d.intv}, Fama ${d.fama}, SEN ${d.sen}, COSMO ${d.cosmo}, EA ${d.ea}</p>`;
    html += `<p><strong>DEF</strong> ${d.def} | <strong>DEFe</strong> ${d.defe} | <strong>Sanidade</strong> ${d.san}</p>`;
    html += `<p><strong>Perícias:</strong> ${d.skills.length ? d.skills.join(', ') : 'nenhuma'}</p>`;
    const eq = [d.weapon1, d.weapon2, d.armor].filter(Boolean).join(', ');
    if (eq) html += `<p><strong>Equipamento:</strong> ${eq}</p>`;
    if (d.items) html += `<p><strong>Itens:</strong> ${d.items}</p>`;
    if (d.money) html += `<p><strong>Dinheiro:</strong> ${d.money}</p>`;
    if (d.backstory && d.backstory !== '—') html += `<p><strong>História:</strong><br>${d.backstory}</p>`;
    html += `</div>`;
    review.innerHTML = html;

    const abDiv = document.getElementById('c-abilities-display');
    let abHtml = '';
    if (d.raceAbilities.length) {
      abHtml += `<div class="creator-section"><h4>Habilidades Raciais</h4><div class="ability-list">`;
      d.raceAbilities.forEach(a => { abHtml += `<div class="ability-item">${a}</div>`; });
      abHtml += `</div></div>`;
    }
    if (d.originAbilities.length) {
      abHtml += `<div class="creator-section"><h4>Poderes de Origem</h4><div class="ability-list">`;
      d.originAbilities.forEach(a => { abHtml += `<div class="ability-item">${a}</div>`; });
      abHtml += `</div></div>`;
    }
    if (d.classAbilities.length) {
      abHtml += `<div class="creator-section"><h4>Habilidades de Classe (Nv ${d.level})</h4><div class="ability-list">`;
      d.classAbilities.forEach(a => { abHtml += `<div class="ability-item">${a}</div>`; });
      abHtml += `</div></div>`;
    }
    abDiv.innerHTML = abHtml;
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
    document.getElementById('c-abilities-display').innerHTML = '';
    calcDerived();
    const msg = document.getElementById('c-saved-msg');
    msg.textContent = '';
    msg.className = 'creator-msg';
  });

  /* Export PDF */
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
  .sheet-section h3 { font-family: 'Cinzel', serif; font-size: 0.85rem; color: #6B6B7B; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; margin-top: 12px; }
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
      <div class="subtitle"><span contenteditable="true">${d.race}</span> · <span contenteditable="true">${d.origin}</span> · <span contenteditable="true">${d.cls}</span> · Nv <span contenteditable="true">${d.level}</span></div>
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
      <div class="sheet-stat"><div class="stat-label" style="color:#7B6D8D">Sanidade</div><div class="stat-val" contenteditable="true" style="color:#7B6D8D">${d.san}</div></div>
    </div>
  </div>
  <div class="sheet-section">
    <h2>Perícias</h2>
    <div class="sheet-skills">${d.skills.length ? d.skills.map(s => '<div class="skill-item" contenteditable="true">'+s+'</div>').join('') : '<div class="skill-item" contenteditable="true" style="color:#6B6B7B">Nenhuma</div>'}</div>
  </div>
  ${d.raceAbilities.length ? `<div class="sheet-section"><h2>Habilidades Raciais</h2><div class="sheet-skills">${d.raceAbilities.map(a => '<div class="skill-item" contenteditable="true">'+a+'</div>').join('')}</div></div>` : ''}
  ${d.originAbilities.length ? `<div class="sheet-section"><h2>Poderes de Origem</h2><div class="sheet-skills">${d.originAbilities.map(a => '<div class="skill-item" contenteditable="true">'+a+'</div>').join('')}</div></div>` : ''}
  ${d.classAbilities.length ? `<div class="sheet-section"><h2>Habilidades de Classe (Nv ${d.level})</h2><div class="sheet-skills">${d.classAbilities.map(a => '<div class="skill-item" contenteditable="true">'+a+'</div>').join('')}</div></div>` : ''}
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
<\/script>
</body></html>`);
    w.document.close();
  });
});
