
document.addEventListener('DOMContentLoaded', () => {
    initSkills();
    loadData();
    addEventListeners();
    calculateAll();
});

const skillsData = [
    { name: "Acrobacia", attr: "des" },
    { name: "Alquimia", attr: "int" },
    { name: "Astronomia", attr: "int" },
    { name: "Atuação", attr: "fam" },
    { name: "Atletismo", attr: "for" },
    { name: "Barganha", attr: "fam" },
    { name: "Cosmo", attr: "int" },
    { name: "Diplomacia", attr: "fam" },
    { name: "Disparada", attr: "des" },
    { name: "Enganação", attr: "fam" },
    { name: "Engenharia", attr: "int" },
    { name: "Forja", attr: "for" },
    { name: "Furtividade", attr: "des" },
    { name: "História", attr: "int" },
    { name: "Intimidação", attr: "fam" },
    { name: "Intuição", attr: "sen" },
    { name: "Investigação", attr: "int" },
    { name: "Liderança", attr: "fam" },
    { name: "Medicina", attr: "int" },
    { name: "Natação", attr: "for" },
    { name: "Navegação", attr: "int" },
    { name: "Percepção", attr: "sen" },
    { name: "Persuasão", attr: "fam" },
    { name: "Sedução", attr: "fam" },
    { name: "Sobrevivência", attr: "sen" }
];

const raceStats = {
    "Akivus": { sau: 1, rf: -1, re: 1 },
    "Vampiros": { sau: 1, fam: 1 },
    "E.X.Os (Doméstico)": { re: 1, int: 3, fam: 1, rf: -4, for: 3, des: 4 },
    "E.X.Os (Guerra)": { re: 3, int: 3, fam: 1, rf: 3, for: 4, des: -3 },
    "E.X.Os (Segurança)": { re: 3, int: 4, fam: 1, rf: 4, for: 3 },
    "Abissais": { sau: -1, des: 1, int: 1 },
    "Espectros": { sau: -5, des: 3, re: 1, for: -2, int: -1, rf: 3 },
    "Humanos": { for: 2, des: 2, int: 4, rf: 2, re: 1, sau: 2, sen: 2, fam: 2 },
    "Praguentos": { des: 2, re: 3, rf: 2 },
    "Insectóides": { des: 3, re: 2, int: 1, fam: -4 },
    "Híbridos (Animalescos)": { des: 1, sen: 1 },
    "Híbridos (Plantíferos)": { sau: 2, fam: 1 },
    "Dragão Anão": { des: 2, int: 1, for: -1, sau: -1 }
};

const originsData = {
    "Filho do Abismo": ["Percepção", "Intimidação"],
    "Guardião da Floresta": ["Furtividade", "Sobrevivência"],
    "Herdeiro de Paladium": ["Persuasão", "História"],
    "Experimento falho da Era Dourada": ["Cosmo", "Furtividade"],
    "Descendente Croma": ["Intimidação", "Sobrevivência"],
    "Descendente Floralis": ["Atletismo", "Acrobacia"],
    "Mercenário": ["Intimidação", "Atletismo"],
    "Camponês": ["Sobrevivência", "História"],
    "Nerd": ["Cosmo", "Investigação"],
    "Herdeiro da Forja": ["História", "Forja"],
    "Morador da Cidade Inexistente": ["Cosmo", "Percepção", "História"],
    "Médico": ["Medicina", "Alquimia"],
    "Guaraciense": ["Intimidação", "Diplomacia", "Engenharia"],
    "Realeza Vampírica": ["Persuasão", "História", "Intimidação"],
    "Medroso": ["Disparada", "Furtividade"],
    "Celebridade": ["Liderança", "Barganha"],
    "Ciborgue": ["Engenharia", "Forja"],
    "Monstro do Mar": ["Navegação", "Astronomia", "Natação"],
    "INSANO": []
};

const originAbilitiesText = {
    "Filho do Abismo": {
        poder: "<strong>Olhos do Abismo</strong> — Você enxerga perfeitamente em escuridão total (até 18B).",
        traco: "<strong>Intuição Sombria</strong> — Sempre que estiver em um ambiente hostil ou desconhecido, você tem vantagem em testes de Sentidos para detectar emboscadas."
    },
    "Guardião da Floresta": {
        poder: "<strong>Vinhas Protetoras</strong> — Como ação bônus, pode criar vinhas que impedem o movimento de um inimigo por 1 turno.",
        traco: "<strong>Conexão Verdejante</strong> — Você pode detectar perigos naturais, como terrenos instáveis ou criaturas camufladas."
    },
    "Herdeiro de Paladium": {
        poder: "<strong>Voz Inspiradora</strong> — Como ação bônus, você pode conceder +1 em um teste a sua escolha de um aliado.",
        traco: "<strong>Nobre Presença</strong> — Quando falar com figuras de autoridade, você tem vantagem em testes de Persuasão."
    },
    "Experimento falho da Era Dourada": {
        poder: "<strong>Instinto de Sobrevivência</strong> — Quando reduzido a 5 PV ou menos, você ganha +4 PV e +2 RF até o fim da cena (uma vez por descanso longo)",
        traco: "<strong>Marca da Fuga</strong> — Você tem vantagem em testes de resistência contra condições que causem paralisia ou efeitos mentais."
    },
    "Descendente Croma": {
        poder: "<strong>Último Reflexo</strong> — Quando seus PV caem abaixo de 25%, você ganha +2 em Força, Destreza e Resistência Física até o fim da cena.",
        traco: "<strong>Instinto Prismático</strong> — Vantagem em testes de resistência contra efeitos de medo enquanto estiver com 25% dos PV."
    },
    "Descendente Floralis": {
        poder: "<strong>Surto Corporal</strong> — Uma vez por cena, você pode ganhar +2 em Destreza e dobrar seu deslocamento por 1 turno.",
        traco: "<strong>Vitalidade Eterna</strong> — Vantagem em testes de resistência contra exaustão."
    },
    "Mercenário": {
        poder: "<strong>Adaptabilidade em Combate</strong> — Você pode transformar sua Ação Bónus em uma segunda Ação Padrão para atacar.",
        traco: "<strong>Líder de Batalha</strong> — Você pode conceder vantagem em um teste de ataque de um aliado uma vez por descanso curto."
    },
    "Camponês": {
        poder: "<strong>Mestre da Terra</strong> — Em um descanso você pode realizar uma colheita de plantas ou caçar por alimentos de forma mais eficiente, garantindo o dobro de recursos que podem conceder bônus.",
        traco: "<strong>Força Natural</strong> — Você consegue carregar +3 da sua carga normal."
    },
    "Nerd": {
        poder: "<strong>Manipulação de Runas</strong> — Você pode ativar ou desativar sistemas de pedra de Everact com facilidade, tendo vantagem em testes para explorar, consertar ou reprogramar esses dispositivos.",
        traco: "<strong>Conexão Arcana com a Pedra</strong> — Você tem vantagem em testes de Cosmo e Investigação relacionados a máquinas feitas de Everact, sendo capaz de discernir seus padrões e operações mágicas com precisão."
    },
    "Herdeiro da Forja": {
        poder: "<strong>Forja Rápida</strong> — Você pode forjar ou reparar um item simples, economizando tempo e recursos.",
        traco: "<strong>Toque de Ferro</strong> — Você tem vantagem em testes de forja para criar ou modificar qualquer item, mudando seus atributos e efeitos."
    },
    "Morador da Cidade Inexistente": {
        poder: "<strong>Memória Desvanecente</strong> — Você pode compreender e manipular tecnologias incomuns usando um teste de Cosmo, Percepção ou História com vantagem.",
        traco: "<strong>Voz do Vazio</strong> — Você tem vantagem em testes de resistência contra dano mental."
    },
    "Médico": {
        poder: "<strong>O Salvador</strong> — Você pode quando um aliado cair, fazer todos os testes de medicina com vantagem, além dos testes de morte terem a CD reduzida em 1d6 quando você estiver cuidando do seu paciente.",
        traco: "<strong>Socorrista Nato</strong> — Pode gastar o dobro do seu deslocamento para chegar a um personagem que acabou de ser ferido, além disso pode rolar um teste de medicina CD 18 uma vez por turno pra curar 25 de vida instantânea do alvo ferido."
    },
    "Guaraciense": {
        poder: "<strong>Guerreiro da Natureza</strong> — Ao estar perto de qualquer tipo de planta, recebe apoio da natureza, ganhando +2 em testes durante o combate.",
        traco: "<strong>Ciência Sustentável</strong> — Suas armas e itens podem ser modificados com algumas plantas e elementos da natureza, acertar com o mestre os efeitos dos itens."
    },
    "Realeza Vampírica": {
        poder: "<strong>Sangue Ancestral</strong> — Uma vez por combate, ao sofrer dano, você pode absorver a força vital do inimigo, recuperando PV igual a metade do dano infligido do seu próximo ataque.",
        traco: "<strong>Nobreza Sombria</strong> — Você tem vantagens em testes de Persuasão, Atuação e Intimidação."
    },
    "Medroso": {
        poder: "<strong>CORRA!</strong> — Durante uma cena de perseguição ou combate, ao sofrer dano pode gastar sua reação para dobrar seu movimento para longe do oponente, não ficando suscetível a golpes de oportunidade.",
        traco: "<strong>Adaptação</strong> — A cada dano de sanidade que você sofre, você fica mais forte, você começa a aprender e se acostumar, quando sofrer dano de sanidade você recebe resistência de 1, no próximo dano resistência de 2 e assim sucessivamente."
    },
    "Celebridade": {
        poder: "<strong>Personalidade Inspiradora</strong> — Pode em situações difíceis inspirar seus aliados, os fazendo receber um bônus igual ao seu modificador de proficiência em seus testes.",
        traco: "<strong>Carteirada</strong> — Pode dar uma Carteirada com sua fama nas pessoas, recebendo vantagem em testes de barganha, intimidação e etc."
    },
    "Ciborgue": {
        poder: "<strong>Homem de Ferro</strong> — Pode modificar alguma parte do seu corpo para transformá-lo em metálico ou armas, acertando com o mestre as modificações, inicialmente pode ter duas.",
        traco: "<strong>Homem Bomba</strong> — Pode se desfazer das suas partes tecnológicas, explodindo elas em cima dos seus alvos ao estarem danificadas ou para se salvar, elas causam o dado de dano da subclasse + 6d6 de dano"
    },
    "Monstro do Mar": {
        poder: "<strong>Senhor das Águas</strong> — Pode controlar água a vontade, como ataques e etc, os ataques causam dano igual ao dano de subclasse. Pode também fazer ondas e etc.",
        traco: "<strong>Bombeamento</strong> — Pode usar a água para aumentar o nível de sangue e bombear com mais força seus músculos, recebendo proficiência a mais de força em cenas de combate."
    },
    "INSANO": {
        poder: "<strong>Doente Mental</strong> — Você já começa o RPG com 0 de sanidade e um traço de loucura, a cada dano de sanidade que você sofre você adquire mais um problema mental, porém ganha também +2 em acertos e 1 ação adicional.",
        traco: "<strong>Insanidade</strong> — Você é um caso de estudo, uma aberração. quando você cai a 0 pontos de vida é como se nada fizesse sentido e você fosse trazido de volta pela loucura, você volta com metade dos seus Hp na primeira queda, na segunda com metade da metade e não existe uma terceira, além disso cada vez que você retornar você causa um dano de sanidade a todo mundo."
    }
};

const raceAbilitiesData = {
    "Akivus": [
        { level: 1, name: "Afinidade com plantas", desc: "-Passiva- Capacidade inata de interagir com vegetação ao redor." },
        { level: 1, name: "Criação de Vinhas", desc: "&lt; • Ação Padrão • &gt; Cria vinhas que podem ser usadas para amarrar coisas." },
        { level: 1, name: "Névoa Perfumada", desc: "&lt; • Ação Padrão • &gt; Cria vinhas com flores que soltam pólen com cheiros fortes que podem atordoar algum alvo." },
        { level: 1, name: "Cheiro do Perigo", desc: "-Passiva- O Akivus pode ficar parado durante um tempo para sentir o cheiro de quaisquer possíveis ameaças ao redor dentro de um raio de 8m." },
        { level: 1, name: "Regeneração Verde", desc: "-Passiva- Quando em contato direto com o solo ou cercado por vegetação, cura 2d8 a cada 2min." },
        { level: 1, name: "Passo Silencioso", desc: "-Passiva- Move-se silenciosamente pela floresta. Teste de furtividade necessário apenas se correr." },
        { level: 1, name: "Aura de Vitalidade", desc: "&lt; • Ação Padrão • &gt; (Custo: 70 Energia/15 PE) Área de 3B. Aliados ganham +2 em Saúde e RF e +25 PV temporária por 2 turnos." },
        { level: 1, name: "Raízes Constritoras", desc: "-Ação Bônus- (Custo: 100 Energia/20 PE) Prende inimigo (RF CD 18). Dano 2d8/turno enquanto estiver preso." },
        { level: 10, name: "Explosão Floral", desc: "&lt; • Ação Padrão • &gt; (Custo 100 Energia) Granada floral. Raio 5B. Dano 3d15 perfurante + Veneno (2d8/turno)." }
    ],
    "Vampiros": [
        { level: 1, name: "Visão no Escuro", desc: "-Passiva- Enxerga claramente no escuro até 18 metros." },
        { level: 1, name: "Mordida Vampírica", desc: "&lt; • Ação Padrão • &gt; Drena sangue para recuperar PV. Intensidade varia (1d12 a 1d30 + Saúde)." },
        { level: 1, name: "Frenesi Sanguíneo", desc: "-Passiva- Com 20% ou menos de vida, ganha ataques adicionais. (1 ataque nv 1-10; 2 ataques nv 11-15; 3 ataques nv 16-20)." },
        { level: 1, name: "Vínculo de Sangue", desc: "-Ação Bônus- (Custo 30 Energia/5 PE) Liga-se a um aliado compartilhando 50% de dano e cura." }
    ],
    "Híbridos (Animalescos)": [
        { level: 1, name: "Percepção Aprimorada", desc: "-Passiva- Pode rolar SEN + 2 para perceber algo interessante ou escondido." },
        { level: 1, name: "Quadrúpede", desc: "-Ação Bônus- Usa todos os membros para mover. +4 DES e vantagem em esquiva. Não pode usar ações completas/bônus nesta forma." }
    ],
    "Híbridos (Plantíferos)": [
        { level: 1, name: "Afinidade com plantas", desc: "-Passiva- Pode se comunicar com plantas." },
        { level: 1, name: "Criação de Vinhas", desc: "&lt; • Ação Padrão • &gt; Cria vinhas que podem ser usadas para amarrar coisas." },
        { level: 1, name: "Névoa Perfumada", desc: "&lt; • Ação Padrão • &gt; Cria pólen atordoante (RE CD 18)." },
        { level: 3, name: "Canção das Árvores", desc: "-Passiva- Pode ouvir as batidas das árvores e manipular madeira." },
        { level: 3, name: "Punhos Rítmicos", desc: "-Passiva- Ativa punhos de madeira. Ganha 25 PV temp. Dano baseia-se em rolagens de ritmo (dano aumenta no Nível 13)." },
        { level: 10, name: "Ritmo de Animação", desc: "&lt; • Ação Padrão • &gt; Cria área de 4 blocos. Aliados ganham Escudo 25 PV e +2 esquiva." }
    ],
    "Dragão Anão": [
        { level: 1, name: "Sopro Ancestral", desc: "&lt; • Ação Padrão • &gt; Cone de 3B de energia elemental (Fogo/Solar/Estase/Ácido). Dano 3d10. Inimigos rolam Des CD 15." },
        { level: 1, name: "Conexão Sensorial", desc: "-Passiva- Telepatia limitada (emoções/imagens) até 10B." },
        { level: 1, name: "Improvisador Nascido", desc: "-Ação Bônus- Ativa engenhoca improvisada (2 usos/descanso). Distrações, fumaça, etc." },
        { level: 1, name: "Instinto de Sobrevivência", desc: "Vantagem em Sobrevivência e Navegação em ambientes perigosos." },
        { level: 1, name: "Camuflagem Natural", desc: "+2 em testes de Furtividade." },
        { level: 1, name: "Ataque Escondido", desc: "Se escondido, causa +1dDes x2 de dano extra." }
    ],
    "Humanos": [
        { level: 1, name: "Determinação Implacável", desc: "-Passiva- Teste Saúde (CD 15) após cair para continuar lutando por alguns ataques." },
        { level: 1, name: "Adaptação Humana", desc: "-Passiva- Com < 25% HP, recebe +2 FOR e DES até fim da cena." },
        { level: 1, name: "Aprendizado Rápido", desc: "-Passiva- Pode copiar habilidades observadas (se fisicamente possível)." },
        { level: 1, name: "Força de Vontade", desc: "-Reação- (1/descanso longo) Refazer teste de resistência com +3." },
        { level: 1, name: "Inovação", desc: "-Passiva- Pode gastar o dobro do tempo (ou 2 ações padrão) para criar/aprimorar itens com +2 no teste." },
        { level: 1, name: "Resiliência Humana", desc: "-Passiva- Inicio do turno, teste Saúde CD 14 para remover condição negativa." },
        { level: 1, name: "Força Interior", desc: "-Ação Bônus- (1/descanso longo) +2 temporário em qualquer atributo (exceto RE) até fim da cena." }
    ],
    "Praguentos": [
        { level: 1, name: "Manipulação do Lodo", desc: "-Passiva- Pool de Energia de Lodo (180 no nv 1, sobe nos nvs 6, 12, 18, 20)." },
        { level: 1, name: "Recuperação Rápida", desc: "-Passiva- Regenera 10 Energia/turno. Se zerar, penalidade em DES e INT." },
        { level: 1, name: "Criação de Itens", desc: "&lt; • Ação Padrão • &gt; Gasta Energia para criar itens (5 a 150 energia)." },
        { level: 1, name: "Armas de Lodo", desc: "-Ação Bônus- Cria armas acopladas (2d12 + DES). Dura 3 rodadas." },
        { level: 1, name: "Tiro Lamacento", desc: "&lt; • Ação Padrão • &gt; Até 5 tiros (5 energia cada). Dano 2d10 + DES de Podridão." },
        { level: 1, name: "Corpo de Lodo", desc: "&lt; • Ação Padrão • &gt; (Custo 50 energia) Imune a dano físico por 2 turnos. Não pode atacar, move por fendas." }
    ],
    "Insectóides": [
        { level: 1, name: "Voo / Visão no Escuro", desc: "Habilidades básicas." },
        { level: 1, name: "Reputação Negativa", desc: "Converte o redutor natural de -4 em FAMA em +4 de FAMA exclusivamente para testes de Intimidação. Transforma o medo e o preconceito em uma arma social." },
        { level: 1, name: "[Podridão] Sentido Putrefato", desc: "-Passiva- Sente criaturas de podridão a 6 blocos." },
        { level: 7, name: "[Podridão] Engula Lodo", desc: "&lt; • Ação Padrão • &gt; Agarra alvo e causa 2d15 + paralisia." },
        { level: 7, name: "[Nulídrico] Vórtice sem fim", desc: "&lt; • Ação Padrão • &gt; Suga ar e enfraquece 3 alvos (-2 esquiva)." },
        { level: 1, name: "[Nulídrico] Sacrifício de Vida", desc: "&lt; • Ação Padrão • &gt; Usa 35% da vida para criar 2 armas buffadas." },
        { level: 1, name: "[Pesadelo] Lembre-se", desc: "&lt; • Ação Padrão • &gt; 2d10 dano mental e paralisa." },
        { level: 1, name: "[Pesadelo] Ilusão Amedrontadora", desc: "&lt; • Ação Padrão • &gt; Ilusão que paralisa se falhar em RE." },
        { level: 10, name: "[Sombra] Medo", desc: "-Ação Bônus- Sussurra medo. Dano 4d12 se falhar em INT." },
        { level: 1, name: "[Sombra] Toque da Maldade", desc: "&lt; • Ação Padrão • &gt; Atordoa e faz ouvir vozes (Teste RE)." }
    ],
    "E.X.Os (Doméstico)": [
        { level: 1, name: "Consertos", desc: "-Passiva- Capaz de consertar coisas com conhecimento técnico." },
        { level: 1, name: "Ponto Fraco", desc: "&lt; • Ação Padrão • &gt; Teste INT (20 crítico) descobre ponto fraco para +4d15 dano." },
        { level: 1, name: "Agarrão", desc: "&lt; • Ação Padrão • &gt; Imobiliza inimigo (DES vs FOR)." }
    ],
    "E.X.Os (Guerra)": [
        { level: 1, name: "Consertos", desc: "-Passiva- Capaz de consertar coisas com conhecimento técnico." },
        { level: 1, name: "Ponto Fraco", desc: "&lt; • Ação Padrão • &gt; Teste INT (20 crítico) descobre ponto fraco para +4d15 dano." },
        { level: 1, name: "Agarrão", desc: "&lt; • Ação Padrão • &gt; Imobiliza inimigo (DES vs FOR)." }
    ],
    "E.X.Os (Segurança)": [
        { level: 1, name: "Consertos", desc: "-Passiva- Capaz de consertar coisas com conhecimento técnico." },
        { level: 1, name: "Ponto Fraco", desc: "&lt; • Ação Padrão • &gt; Teste INT (20 crítico) descobre ponto fraco para +4d15 dano." },
        { level: 1, name: "Agarrão", desc: "&lt; • Ação Padrão • &gt; Imobiliza inimigo (DES vs FOR)." }
    ],
    "Abissais": [
        { level: 1, name: "Visão no Escuro", desc: "Alcance ilimitado." },
        { level: 1, name: "Luz Amiga", desc: "Espalha esporos brilhantes com antenas." },
        { level: 1, name: "Pressentimento", desc: "1d20 de percepção para emboscadas." },
        { level: 1, name: "Telepatia", desc: "Comunicação mental com aliados." },
        { level: 1, name: "Confusão", desc: "Imita vozes. INT vs INT para impedir ação do alvo." },
        { level: 1, name: "A Fome de Vinhas", desc: "Consome vinhas (inicia com 8) para efeitos aleatórios (1d7) até descanso." }
    ],
    "Espectros": [
        { level: 1, name: "Mecânica de Existência", desc: "Substitui Vida. Inicia com 3d8. Regenera no escuro. Dano Sagrado/Solar é dobrado." },
        { level: 1, name: "Incorporação", desc: "-Passiva- Pode atravessar paredes e objetos sólidos." },
        { level: 1, name: "Visão Espectral", desc: "-Passiva- Detecta invisíveis/etéreos em 30B." },
        { level: 1, name: "Toque Fantasmagórico", desc: "&lt; • Ação Padrão • &gt; 1d8 + DES (Sombra). Paralisa se falhar em Res Mágica." },
        { level: 1, name: "Forma Sombria", desc: "&lt; • Ação Padrão • &gt; Imune a dano por 3 rodadas, mas não lança magias. 1/descanso." },
        { level: 1, name: "Absorção de Medo", desc: "-Passiva- Recupera 1d4 Existência/rodada próximo a criatura terrorizada." }
    ]
};

const classData = {
    "Cavaleiros de Paladium": {
        stats: {
            // stats logic to be implemented later if needed
            profBonus: { 1: 2, 5: 3, 9: 4, 13: 5, 17: 6 }
        },
        features: [
             { level: 1, name: "Golpe Solar", desc: "&lt; • Ação Bônus • &gt; -30 Energia. Ataque com dano extra Solar.", type: "fixed" },
             { level: 1, name: "Égide Radiante", desc: "&lt; • Ação Padrão • &gt; -25 Energia. PVs Temp (1d10 + FOR).", type: "fixed" },
             { level: 4, name: "Olhar Julgador", desc: "&lt; • Ação Padrão • &gt; -35 Energia. Detecta mentiras.", type: "fixed" },
             { 
                level: 4, 
                type: "choice", 
                options: [
                    { name: "Julgamento Ardente", desc: "&lt; • Ação Padrão • &gt; -100 Energia. Condição Queimando." },
                    { name: "Solo Sagrado", desc: "&lt; • Ação Padrão • &gt; -85 Energia. Área de dano e buff." }
                ]
             },
             { level: 8, name: "Julgamento Silencioso", desc: "&lt; • Ação Bônus • &gt; -60 Energia. Causa Medo/Intimidação.", type: "fixed" },
             {
                level: 8,
                type: "choice",
                options: [
                    { name: "Coroa de Chamas", desc: "&lt; • Ação Bônus • &gt; -70 Energia. Gera Carga Solar e cura." },
                    { name: "Fincada Chamuscante", desc: "&lt; • Ação Bônus • &gt; -185 Energia. 3d15 dano + Paralisia." }
                ]
             },
             { level: 10, name: "Memória das Cinzas", desc: "&lt; • Ação Padrão • &gt; -35 Energia. Vê últimos momentos de um cadáver.", type: "fixed" },
             {
                level: 10,
                type: "choice",
                options: [
                    { name: "Lança do Sol", desc: "&lt; • Ação Bônus • &gt; -90 Energia. Arremessa lança de luz (Dano Solar Puro)." },
                    { name: "Erupção Solar", desc: "&lt; • Ação Bônus • &gt; Gasta toda Carga + 120 Energia. Imunidade e buff de dano." }
                ]
             }
        ]
    }
};

let currentClassChoices = {};

function renderClassAbilities() {
    const classInput = document.getElementById('char-class');
    const levelInput = document.getElementById('char-level');
    
    if (!classInput || !levelInput) return;

    const className = classInput.value;
    const level = parseInt(levelInput.value) || 1;
    const data = classData[className];
    
    const section = document.getElementById('class-abilities-section');
    const content = document.getElementById('class-abilities-content');
    
    if (!section || !content) return;

    if (data && data.features && data.features.length > 0) {
        let html = '';
        
        // Initialize choices for this class if not exists
        if (!currentClassChoices[className]) {
            currentClassChoices[className] = {};
        }

        data.features.forEach((feature, index) => {
            const isUnlocked = level >= feature.level;
            const style = isUnlocked ? 'color: #e0e0e0;' : 'color: #666; font-style: italic;';
            const borderStyle = isUnlocked ? 'border-left: 3px solid #f6e05c;' : 'border-left: 3px solid #444;'; // Yellow/Gold for class

            if (feature.type === 'fixed') {
                html += `
                    <div style="margin-bottom: 12px; ${style} ${borderStyle} padding-left: 10px;">
                        <strong style="font-size: 1.05em;">${feature.name}</strong> <span style="font-size: 0.8em;">(Nível ${feature.level})</span><br>
                        <span style="display: block; margin-top: 4px;">${feature.desc}</span>
                    </div>
                `;
            } else if (feature.type === 'choice') {
                // Choice logic
                const choiceKey = `${className}-lvl${feature.level}`;
                // Default to first option (0) if not set
                if (currentClassChoices[className][feature.level] === undefined) {
                    currentClassChoices[className][feature.level] = 0;
                }
                const selectedIndex = currentClassChoices[className][feature.level];
                
                let optionsHtml = '';
                if (isUnlocked) {
                     optionsHtml = `
                        <select onchange="updateClassChoice('${className}', ${feature.level}, this.value)" style="background:#333; color:#fff; border:1px solid #555; padding:5px; width:100%; margin-bottom: 5px; border-radius: 3px;">
                            ${feature.options.map((opt, idx) => `
                                <option value="${idx}" ${idx === selectedIndex ? 'selected' : ''}>${opt.name}</option>
                            `).join('')}
                        </select>
                        <span style="display: block; margin-top: 4px;">${feature.options[selectedIndex].desc}</span>
                    `;
                } else {
                     optionsHtml = `
                        <div style="font-style: italic;">Escolha desbloqueada no nível ${feature.level}</div>
                    `;
                }

                html += `
                    <div style="margin-bottom: 15px; ${style} ${borderStyle} padding-left: 10px;">
                        <strong style="font-size: 1.05em;">Escolha de Habilidade</strong> <span style="font-size: 0.8em;">(Nível ${feature.level})</span><br>
                        ${optionsHtml}
                    </div>
                `;
            }
        });
        
        content.innerHTML = html;
        section.style.display = 'block';
    } else {
        section.style.display = 'none';
        content.innerHTML = '';
    }
}

function updateClassChoice(className, level, value) {
    if (!currentClassChoices[className]) currentClassChoices[className] = {};
    currentClassChoices[className][level] = parseInt(value);
    renderClassAbilities();
}

function initSkills() {
    const container = document.getElementById('skills-list-container');
    container.innerHTML = '';

    skillsData.forEach(skill => {
        const row = document.createElement('div');
        row.className = 'skill-row';
        
        // Checkbox
        const checkDiv = document.createElement('div');
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'skill-check';
        checkbox.id = `skill-${skill.name.toLowerCase()}`;
        checkbox.dataset.skill = skill.name;
        checkbox.dataset.attr = skill.attr;
        checkDiv.appendChild(checkbox);

        // Name
        const nameDiv = document.createElement('div');
        nameDiv.className = 'skill-name';
        nameDiv.textContent = skill.name;

        // Attr
        const attrDiv = document.createElement('div');
        attrDiv.className = 'skill-attr';
        attrDiv.textContent = skill.attr.toUpperCase();

        // Total
        const totalDiv = document.createElement('div');
        totalDiv.className = 'skill-total';
        totalDiv.id = `skill-total-${skill.name.toLowerCase()}`;
        totalDiv.textContent = '0';

        row.appendChild(checkDiv);
        row.appendChild(nameDiv);
        row.appendChild(attrDiv);
        row.appendChild(totalDiv);

        container.appendChild(row);
    });
}

function addEventListeners() {
    // Inputs de Atributos
    const attrInputs = document.querySelectorAll('.attr-input');
    attrInputs.forEach(input => {
        input.addEventListener('input', calculateAll);
    });

    // Inputs de Status (PV, etc)
    document.getElementById('hp-max').addEventListener('input', calculateDefenses);
    document.getElementById('attr-rf').addEventListener('input', calculateDefenses);
    document.getElementById('attr-re').addEventListener('input', calculateDefenses);
    document.getElementById('proficiency').addEventListener('input', calculateSkills);
    document.getElementById('char-level').addEventListener('input', calculatePoints); // Level affects points

    // Race Change
    document.getElementById('char-race').addEventListener('change', applyRaceStats);
    document.getElementById('char-race').addEventListener('input', applyRaceStats); // For datalist selection

    // Origin Change
    document.getElementById('char-origin').addEventListener('change', applyOriginStats);
    document.getElementById('char-origin').addEventListener('input', applyOriginStats);

    // Class Change
    document.getElementById('char-class').addEventListener('change', calculateAll);
    document.getElementById('char-class').addEventListener('input', calculateAll);

    // Checkboxes de Perícias
    const skillChecks = document.querySelectorAll('.skill-check');
    skillChecks.forEach(check => {
        check.addEventListener('change', calculateSkills);
    });

    // Botões
    document.getElementById('btn-save').addEventListener('click', saveData);
    document.getElementById('btn-load').addEventListener('click', loadData);
    document.getElementById('btn-clear').addEventListener('click', clearData);

    // Manual Abilities Buttons
    const btnAddClass = document.getElementById('btn-add-class-ability');
    if(btnAddClass) btnAddClass.addEventListener('click', () => addManualAbility('class-abilities-list'));
    
    const btnAddArch = document.getElementById('btn-add-archetype-ability');
    if(btnAddArch) btnAddArch.addEventListener('click', () => addManualAbility('archetype-abilities-list'));
}

function calculateAll() {
    applyClassStats(); // Update stats before calculations
    calculateDefenses();
    calculateSkills();
    calculatePoints();
    renderRaceAbilities();
    // renderClassAbilities(); // Desativado para uso manual
}

function calculatePoints() {
    const level = parseInt(document.getElementById('char-level').value) || 1;
    // Base points = 4 + 1 every 3 levels
    // Level 1-2: 4
    // Level 3-5: 5
    // Level 6-8: 6
    // etc.
    const totalPoints = 4 + Math.floor(level / 3);
    
    let spentPoints = 0;
    const attributes = ['for', 'des', 'int', 'rf', 're', 'sau', 'sen', 'fam'];
    
    // Get current race stats to determine base
    const raceInput = document.getElementById('char-race');
    const raceName = raceInput.value;
    const stats = raceStats[raceName] || {};
    
    attributes.forEach(attr => {
        const input = document.getElementById(`attr-${attr}`);
        const currentVal = parseInt(input.value) || 0;
        
        // Base value is 1 + race bonus
        // If race has no bonus for this attr, it's 0.
        // Example: Human has { for: 2 }. Base = 1 + 2 = 3.
        // Example: Akivus has { sau: 1 }. Base = 1 + 1 = 2.
        // Example: Akivus has { rf: -1 }. Base = 1 - 1 = 0.
        // Example: Akivus has { for: undefined }. Base = 1 + 0 = 1.
        
        const raceBonus = stats[attr] !== undefined ? stats[attr] : 0;
        // Note: In my raceStats object, I stored the MODIFIER to be added to 1?
        // Let's check applyRaceStats logic.
        // "input.value = 1 + value;"
        // Yes. So the "Base State" for calculation is (1 + raceBonus).
        
        const baseVal = 1 + raceBonus;
        
        // Points spent = Current - Base
        // If Current > Base, spent is positive.
        // If Current < Base, spent is negative (gaining points back).
        spentPoints += (currentVal - baseVal);
    });
    
    const remaining = totalPoints - spentPoints;
    
    const display = document.getElementById('points-remaining');
    if (display) {
        display.textContent = Math.max(0, remaining);
        // Visual feedback
        if (remaining < 0) {
            display.style.color = '#ff4444'; // Red if overspent
        } else if (remaining === 0) {
            display.style.color = '#44ff44'; // Green if exact
        } else {
            display.style.color = '#b8a1d9'; // Default purple
        }
    }
}

function calculateDefenses() {
    // Obter valores
    const rf = parseInt(document.getElementById('attr-rf').value) || 0;
    const re = parseInt(document.getElementById('attr-re').value) || 0;
    const pvMax = parseInt(document.getElementById('hp-max').value) || 0;

    // DEF = (RF * (PVs^0.6)) / 6
    let def = 0;
    if (pvMax > 0) {
        def = (rf * Math.pow(pvMax, 0.6)) / 6;
    }
    
    // Arredondar (geralmente para baixo ou mais próximo, vou usar floor por segurança ou round)
    // O sistema não especifica, vou usar Math.floor para ser conservador, ou toFixed(0)
    const defFinal = Math.floor(def);
    document.getElementById('def-total').value = defFinal;

    // DEFe = (RE * (PVs^0.5)) / 8 + DEF
    let defElem = 0;
    if (pvMax > 0) {
        defElem = ((re * Math.pow(pvMax, 0.5)) / 8) + defFinal;
    }
    const defElemFinal = Math.floor(defElem);
    document.getElementById('def-elem-total').value = defElemFinal;
}

function calculateSkills() {
    const prof = parseInt(document.getElementById('proficiency').value) || 0;
    
    const skillChecks = document.querySelectorAll('.skill-check');
    skillChecks.forEach(check => {
        const attrName = check.dataset.attr; // 'for', 'des', etc.
        const attrVal = parseInt(document.getElementById(`attr-${attrName}`).value) || 0;
        
        let total = attrVal; // Modificador é igual ao valor do atributo
        
        if (check.checked) {
            total += prof;
        }

        const totalId = `skill-total-${check.dataset.skill.toLowerCase()}`;
        const totalEl = document.getElementById(totalId);
        if (totalEl) {
            totalEl.textContent = total > 0 ? `+${total}` : total;
        }
    });
}

// --- Sistema de Salvamento (Multiplas Fichas) ---

function saveInventory() {
    const items = [];
    document.querySelectorAll('#inventory-list .inventory-item').forEach(div => {
        items.push({
            name: div.querySelector('.item-name').value,
            qty: div.querySelector('.item-qty').value,
            weightNum: parseInt(div.querySelector('.item-weight').value) || 0,
            isInitial: div.querySelector('.item-is-initial').checked,
            isEquipped: div.querySelector('.item-is-equipped').checked,
            desc: div.querySelector('.item-desc').value
        });
    });
    return items;
}

function loadInventory(items) {
    const list = document.getElementById('inventory-list');
    if (!list) return;
    list.innerHTML = '';
    
    if (items && Array.isArray(items)) {
        items.forEach(item => {
            addItemToInventory({
                name: item.name,
                weightNum: item.weightNum,
                qty: item.qty,
                isInitial: item.isInitial,
                isEquipped: item.isEquipped,
                description: item.desc
            });
        });
    }
}

function saveData() {
    // 1. Coletar Dados dos Inputs com ID
    const data = {};
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        if (input.id) {
            if (input.type === 'checkbox') {
                data[input.id] = input.checked;
            } else {
                data[input.id] = input.value;
            }
        }
    });

    // 2. Coletar Dados Complexos
    const manualData = saveManualAbilities();
    data.classAbilities = manualData.classAbilities;
    data.archetypeAbilities = manualData.archetypeAbilities;
    data.selosAbilities = manualData.selosAbilities;
    data.inventory = saveInventory();

    // 3. Identificar ou Criar ID da Ficha
    let sheetId = document.getElementById('sheet-id').value;
    if (!sheetId) {
        sheetId = 'sheet_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        document.getElementById('sheet-id').value = sheetId;
        data['sheet-id'] = sheetId;
    }

    // 4. Metadados para Listagem
    let charName = document.getElementById('char-name').value || 'Sem Nome';
    let charLevel = document.getElementById('char-level').value || '1';
    let charClass = document.getElementById('char-class').value || 'Classe';

    const sheetEntry = {
        id: sheetId,
        name: charName,
        level: charLevel,
        class: charClass,
        lastModified: Date.now(),
        data: data
    };

    // 5. Salvar no LocalStorage (Objeto 'wuitalur_sheets')
    const allSheets = JSON.parse(localStorage.getItem('wuitalur_sheets') || '{}');
    allSheets[sheetId] = sheetEntry;
    localStorage.setItem('wuitalur_sheets', JSON.stringify(allSheets));

    alert(`Ficha "${charName}" salva com sucesso!`);
}

function loadData() {
    // Abre Modal de Seleção
    const allSheets = JSON.parse(localStorage.getItem('wuitalur_sheets') || '{}');
    const sheetIds = Object.keys(allSheets);

    // Remove modal anterior se existir
    const oldModal = document.getElementById('load-modal');
    if (oldModal) oldModal.remove();

    if (sheetIds.length === 0) {
        // Tenta carregar o formato antigo (legado) para migração ou alerta
        const legacyData = localStorage.getItem('wuitalur_sheet_data');
        if (legacyData) {
            if (confirm('Ficha antiga detectada. Deseja convertê-la para o novo sistema?')) {
                // Carrega temporariamente e salva no novo formato
                const tempDate = JSON.parse(legacyData);
                // Migração simples não é trivial sem carregar no DOM, então vamos apenas carregar e pedir para salvar
                alert('O sistema de salvamento mudou. Por favor, carregue sua ficha antiga (isso acontecerá agora) e clique em SALVAR novamente para registrar no novo sistema.');
                loadLegacyData(legacyData);
                return;
            }
        }
        alert('Nenhuma ficha salva encontrada.');
        return;
    }

    const div = document.createElement('div');
    div.id = 'load-modal';
    div.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:4000;display:flex;justify-content:center;align-items:center;';
    
    // Sort by Last Modified (Desc)
    const sortedIds = sheetIds.sort((a,b) => allSheets[b].lastModified - allSheets[a].lastModified);

    let listHtml = '';
    sortedIds.forEach(id => {
        const s = allSheets[id];
        const lastMod = new Date(s.lastModified).toLocaleString();
        listHtml += `
            <div style="background:rgba(255,255,255,0.05); padding:10px; margin-bottom:10px; border-radius:5px; display:flex; justify-content:space-between; align-items:center; border:1px solid #444;">
                <div>
                    <strong style="color:#f0ad4e; font-size:1.1em; display:block;">${s.name}</strong>
                    <div style="font-size:0.85em; color:#aaa;">Nível ${s.level} - ${s.class}</div>
                    <div style="font-size:0.75em; color:#666;">Salvo em: ${lastMod}</div>
                </div>
                <div style="display:flex; gap:10px;">
                    <button onclick="loadSheet('${id}')" style="background:linear-gradient(45deg, #6a11cb, #2575fc); color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer; font-weight:bold;">Carregar</button>
                    <button onclick="deleteSheet('${id}')" style="background:#ff4444; color:#fff; border:none; padding:6px 12px; border-radius:4px; cursor:pointer;" title="Inerentemente Apagar"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });

    div.innerHTML = `
        <div style="width:500px; max-width:90%; background:#1a1a2e; border:1px solid #444; border-radius:8px; padding:20px; box-shadow:0 0 30px #000;">
            <div style="display:flex; justify-content:space-between; margin-bottom:15px; border-bottom:1px solid #444; padding-bottom:10px;">
                <h3 style="margin:0; color:#b8a1d9;">Carregar Personagem</h3>
                <button onclick="document.getElementById('load-modal').remove()" style="background:none; border:none; color:#fff; cursor:pointer; font-size:1.2em;">&times;</button>
            </div>
            <div style="max-height:400px; overflow-y:auto; padding-right:5px;">
                ${listHtml}
            </div>
        </div>
    `;
    
    document.body.appendChild(div);
}

function loadSheet(id) {
    const allSheets = JSON.parse(localStorage.getItem('wuitalur_sheets') || '{}');
    const entry = allSheets[id];
    if (!entry) return;

    applyDataToForm(entry.data);

    // Close Modal
    const modal = document.getElementById('load-modal');
    if(modal) modal.remove();
    
    // Feedback
    // alert(`Ficha "${entry.name}" carregada!`); 
    // Talvez não precise de alert, visualmente os dados mudam.
}

function loadLegacyData(json) {
    const data = JSON.parse(json);
    applyDataToForm(data);
}

function applyDataToForm(data) {
    // 1. Limpar Inventário e Habilidades Manuais antes de carregar?
    // O ideal seria resetar o form, mas vamos confiar na sobreescrita.
    
    // 2. Carregar Inputs por ID
    for (const id in data) {
        if (['classAbilities', 'archetypeAbilities', 'selosAbilities', 'inventory'].includes(id)) continue;
        const el = document.getElementById(id);
        if (el) {
            if (el.type === 'checkbox') {
                 el.checked = data[id];
            } else {
                 el.value = data[id];
            }
        }
    }

    // 3. Carregar Listas
    loadManualAbilities(data);
    if (data.inventory) loadInventory(data.inventory);

    // 4. Trigger Updates
    calculateAll();
}

function deleteSheet(id) {
    if(!confirm('Tem certeza que deseja apagar esta ficha para sempre?')) return;
    
    const allSheets = JSON.parse(localStorage.getItem('wuitalur_sheets') || '{}');
    delete allSheets[id];
    localStorage.setItem('wuitalur_sheets', JSON.stringify(allSheets));
    
    // Refresh List
    loadData(); 
}

function clearData() {
    if (confirm('Tem certeza que deseja limpar a ficha atual? Os dados não salvos serão perdidos.')) {
        location.reload();
    }
}

function applyRaceStats() {
    const raceInput = document.getElementById('char-race');
    const raceName = raceInput.value;
    const stats = raceStats[raceName];

    if (stats) {
        // Reset all attributes to 1 first (optional, but good for consistency)
        const attributes = ['for', 'des', 'int', 'rf', 're', 'sau', 'sen', 'fam'];
        attributes.forEach(attr => {
            document.getElementById(`attr-${attr}`).value = 1;
        });

        // Apply bonuses
        for (const [key, value] of Object.entries(stats)) {
            const input = document.getElementById(`attr-${key}`);
            if (input) {
                let currentVal = parseInt(input.value) || 1;
                // Since we reset to 1, we just add the bonus to 1? 
                // Or if the bonus is e.g. +2, the result is 3.
                // If the bonus is -1, the result is 0.
                // The stats object contains the NET bonus? No, the stats object I built contains the modifiers.
                // E.g. Akivus: sau: 1 means +1? Or means the value is 1?
                // The text says "Naturalmente +1". So base 1 + 1 = 2.
                // My object: "Akivus": { sau: 1 ... }
                // So I should add the value in `stats` to the base 1.
                
                // Wait, for Humans I put { for: 2 ... }. Base 1 + 2 = 3. Correct.
                // For Akivus { sau: 1 }. Base 1 + 1 = 2. Correct.
                // For Akivus { rf: -1 }. Base 1 - 1 = 0. Correct.
                
                input.value = 1 + value;
            }
        }
        
        // Recalculate everything
        calculateAll();
    }
}

function applyOriginStats() {
    const originInput = document.getElementById('char-origin');
    const originName = originInput.value;
    const skills = originsData[originName];
    const abilities = originAbilitiesText[originName];

    // Skills Logic
    if (skills) {
        // Uncheck all skills first to avoid accumulation when switching origins
        document.querySelectorAll('.skill-check').forEach(check => {
            check.checked = false;
        });

        skills.forEach(skillName => {
            const checkbox = document.querySelector(`.skill-check[data-skill="${skillName}"]`);
            if (checkbox) {
                checkbox.checked = true;
            }
        });
        calculateSkills();
    }

    // Abilities Logic
    const abilitiesSection = document.getElementById('origin-abilities-section');
    const abilitiesContent = document.getElementById('origin-abilities-content');
    
    if (abilities) {
        abilitiesSection.style.display = 'block';
        abilitiesContent.innerHTML = `
            <p style="margin-bottom: 10px;">${abilities.poder}</p>
            <p>${abilities.traco}</p>
        `;
    } else {
        abilitiesSection.style.display = 'none';
        abilitiesContent.innerHTML = '';
    }
}

function applyClassStats() {
    const classInput = document.getElementById('char-class');
    const levelInput = document.getElementById('char-level');
    if (!classInput || !levelInput) return;
    
    const className = classInput.value;
    const level = parseInt(levelInput.value) || 1;
    const data = classData[className];

    if (!data || !data.stats) return;

    // Proficiency
    if (data.stats.profBonus) {
        let prof = 2;
        const levels = Object.keys(data.stats.profBonus).map(Number).sort((a,b)=>a-b);
        for (let l of levels) {
            if (level >= l) {
                prof = data.stats.profBonus[l];
            }
        }
        const profInput = document.getElementById('proficiency');
        if (profInput && document.activeElement !== profInput) { // Don't overwrite if user is typing? Maybe dangerous.
             profInput.value = prof;
        }
    }

    // Energy Astral
    if (data.stats.energyTable) {
        let energy = 0;
        const levels = Object.keys(data.stats.energyTable).map(Number).sort((a,b)=>a-b);
         for (let l of levels) {
            if (level >= l) {
                energy = data.stats.energyTable[l];
            }
        }
        const peMax = document.getElementById('pe-max');
        if (peMax && document.activeElement !== peMax) {
             peMax.value = energy;
        }
    }
}

let currentInsectoidBond = 'Podridão';

function updateInsectoidBond(value) {
    currentInsectoidBond = value;
    renderRaceAbilities();
}

function renderRaceAbilities() {
    const raceInput = document.getElementById('char-race');
    const levelInput = document.getElementById('char-level');
    
    if (!raceInput || !levelInput) return;

    const raceName = raceInput.value;
    const level = parseInt(levelInput.value) || 1;
    let abilitiesData = raceAbilitiesData[raceName];
    
    const section = document.getElementById('race-abilities-section');
    const content = document.getElementById('race-abilities-content');
    
    if (!section || !content) return;

    if (abilitiesData && abilitiesData.length > 0) {
        let html = '';

        // Lógica específica para Insectóides
        if (raceName === "Insectóides") {
            const bonds = ['Podridão', 'Nulídrico', 'Pesadelo', 'Sombra'];
            
            html += `
                <div style="margin-bottom: 15px; background: #2a2a2a; padding: 10px; border-radius: 5px; border: 1px solid #444;">
                    <label style="display:block; margin-bottom:5px; font-weight:bold; color: #a3a3a3;">Escolha seu Vínculo:</label>
                    <select onchange="updateInsectoidBond(this.value)" style="background:#333; color:#fff; border:1px solid #555; padding:5px; width:100%; border-radius: 3px;">
                        ${bonds.map(bond => `<option value="${bond}" ${currentInsectoidBond === bond ? 'selected' : ''}>${bond}</option>`).join('')}
                    </select>
                </div>
            `;

            abilitiesData = abilitiesData.filter(ability => {
                if (ability.name.startsWith('[')) {
                    return ability.name.startsWith(`[${currentInsectoidBond}]`);
                }
                return true;
            });
        }

        abilitiesData.forEach(ability => {
            const isUnlocked = level >= ability.level;
            const style = isUnlocked ? 'color: #e0e0e0;' : 'color: #666; font-style: italic;';
            
            html += `
                <div style="margin-bottom: 12px; ${style} border-left: 3px solid ${isUnlocked ? '#8b5cf6' : '#444'}; padding-left: 10px;">
                    <strong style="font-size: 1.05em;">${ability.name}</strong> <span style="font-size: 0.8em;">(Nível ${ability.level})</span><br>
                    <span style="display: block; margin-top: 4px;">${ability.desc}</span>
                </div>
            `;
        });
        
        content.innerHTML = html;
        section.style.display = 'block';
    } else {
        section.style.display = 'none';
        content.innerHTML = '';
    }
}

// --- Manual Class/Archetype Abilities System ---

function addManualAbility(containerId, data = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'manual-ability-item';
    
    // Create Header (Name and Level/Type)
    const header = document.createElement('div');
    header.className = 'manual-ability-header';
    
    const inputName = document.createElement('input');
    inputName.type = 'text';
    inputName.className = 'manual-ability-name';
    inputName.placeholder = 'Nome da Habilidade';
    inputName.value = data.name || '';
    
    const inputLevel = document.createElement('input');
    inputLevel.type = 'text';
    inputLevel.className = 'manual-ability-level';
    inputLevel.placeholder = 'Fonte/N�vel';
    inputLevel.value = data.level || '';
    
    header.appendChild(inputName);
    header.appendChild(inputLevel);
    
    // Create Description
    const textArea = document.createElement('textarea');
    textArea.className = 'manual-ability-desc';
    textArea.placeholder = 'Descri��o detalhada da habilidade...';
    textArea.value = data.desc || '';
    
    // Create Remove Button
    const btnRemove = document.createElement('button');
    btnRemove.className = 'btn-remove-ability';
    btnRemove.innerHTML = '<i class="fas fa-times"></i>'; // Using FontAwesome icon if avail, else X
    if (!document.querySelector('link[href*="font-awesome"]')) {
        btnRemove.textContent = 'X';
    }
    btnRemove.title = "Remover habilidade";
    btnRemove.onclick = function() {
        if(confirm('Remover esta habilidade?')) {
            div.remove();
        }
    };
    
    div.appendChild(header);
    div.appendChild(textArea);
    div.appendChild(btnRemove);
    
    container.appendChild(div);
}

function saveManualAbilities() {
    const classAbilities = [];
    document.querySelectorAll('#class-abilities-list .manual-ability-item').forEach(item => {
        classAbilities.push({
            name: item.querySelector('.manual-ability-name').value,
            level: item.querySelector('.manual-ability-level').value,
            desc: item.querySelector('.manual-ability-desc').value
        });
    });

    const archetypeAbilities = [];
    document.querySelectorAll('#archetype-abilities-list .manual-ability-item').forEach(item => {
        archetypeAbilities.push({
            name: item.querySelector('.manual-ability-name').value,
            level: item.querySelector('.manual-ability-level').value,
            desc: item.querySelector('.manual-ability-desc').value
        });
    });

    const selosAbilities = [];
    document.querySelectorAll('#selos-abilities-list .manual-seal-item').forEach(item => {
        selosAbilities.push({
            name: item.querySelector('.seal-name-input').value,
            influence: item.querySelector('input[name="influence"]').value,
            type: item.querySelector('input[name="type"]').value,
            range: item.querySelector('input[name="range"]').value,
            duration: item.querySelector('input[name="duration"]').value,
            components: item.querySelector('input[name="components"]').value,
            cost: item.querySelector('.seal-cost-input').value,
            description: item.querySelector('.seal-effect-input').value
        });
    });

    return { classAbilities, archetypeAbilities, selosAbilities };
}

function loadManualAbilities(data) {
    const classContainer = document.getElementById('class-abilities-list');
    const archContainer = document.getElementById('archetype-abilities-list');
    const selosContainer = document.getElementById('selos-abilities-list');
    
    if(classContainer) classContainer.innerHTML = '';
    if(archContainer) archContainer.innerHTML = '';
    if(selosContainer) selosContainer.innerHTML = '';

    if (data.classAbilities && Array.isArray(data.classAbilities)) {
        data.classAbilities.forEach(ability => addManualAbility('class-abilities-list', ability));
    }

    if (data.archetypeAbilities && Array.isArray(data.archetypeAbilities)) {
        data.archetypeAbilities.forEach(ability => addManualAbility('archetype-abilities-list', ability));
    }

    if (data.selosAbilities && Array.isArray(data.selosAbilities)) {
        data.selosAbilities.forEach(ability => addSealAbility('selos-abilities-list', ability));
    }
}

function addSealAbility(containerId, data = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const div = document.createElement('div');
    div.className = 'seal-card manual-seal-item';
    div.style.position = 'relative';

    const removeBtn = document.createElement('button');
    removeBtn.className = 'btn-remove-ability';
    removeBtn.innerHTML = 'X';
    removeBtn.title = 'Remover Selo';
    removeBtn.onclick = function() {
        if(confirm('Remover este selo?')) div.remove();
    };
    div.appendChild(removeBtn);

    // Name
    const nameInput = document.createElement('input');
    nameInput.className = 'seal-name-input';
    nameInput.placeholder = 'Nome do Selo';
    nameInput.value = data.name || '';
    
    const h4 = document.createElement('h4');
    h4.style.padding = '0';
    h4.appendChild(nameInput);
    div.appendChild(h4);

    // Meta Grid
    const metaDiv = document.createElement('div');
    metaDiv.className = 'seal-meta';

    const fields = [
        { label: 'Influência', name: 'influence', val: data.influence },
        { label: 'Execução', name: 'type', val: data.type },
        { label: 'Alcance', name: 'range', val: data.range },
        { label: 'Duração', name: 'duration', val: data.duration },
        { label: 'Componentes', name: 'components', val: data.components }
    ];

    fields.forEach(f => {
        const item = document.createElement('div');
        item.className = 'seal-meta-item';
        item.innerHTML = `<strong>${f.label}:</strong> `;
        const inp = document.createElement('input');
        inp.className = 'seal-meta-input';
        inp.name = f.name;
        inp.value = f.val || '';
        item.appendChild(inp);
        metaDiv.appendChild(item);
    });
    div.appendChild(metaDiv);

    // Cost
    const costDiv = document.createElement('div');
    costDiv.className = 'seal-cost';
    const costInp = document.createElement('input');
    costInp.className = 'seal-cost-input';
    costInp.placeholder = '0';
    costInp.value = data.cost ? data.cost.replace('EA','').trim() : '';
    costDiv.appendChild(costInp);
    const spanEA = document.createElement('span');
    spanEA.className = 'attr-ea';
    spanEA.innerText = ' EA';
    costDiv.appendChild(spanEA);
    div.appendChild(costDiv);

    // Effect
    const effectDiv = document.createElement('div');
    effectDiv.className = 'seal-effect';
    const effectText = document.createElement('textarea');
    effectText.className = 'seal-effect-input';
    effectText.placeholder = 'Descrição do efeito...';
    effectText.value = data.description || '';
    effectDiv.appendChild(effectText);
    div.appendChild(effectDiv);

    container.appendChild(div);
}

// --- Grimório / Library System ---

document.addEventListener('DOMContentLoaded', () => {
    const btnLib = document.getElementById('btn-open-library');
    if(btnLib) {
        btnLib.addEventListener('click', openLibraryModal);
    }
    
    const btnAddSelo = document.getElementById('btn-add-selo-ability');
    if(btnAddSelo) {
        btnAddSelo.addEventListener('click', () => addSealAbility('selos-abilities-list'));
    }
});

function openLibraryModal() {
    let modal = document.getElementById('library-modal');
    if (!modal) {
        createLibraryModal();
        modal = document.getElementById('library-modal');
    }
    modal.style.display = 'flex';
    // Default category or first available
    if (typeof ABILITY_LIBRARY !== 'undefined') {
        const firstCat = Object.keys(ABILITY_LIBRARY)[0];
        if (firstCat) renderLibrary(firstCat);
    }
}

function closeLibraryModal() {
    const modal = document.getElementById('library-modal');
    if(modal) modal.style.display = 'none';
}

function createLibraryModal() {
    // Create Modal HTML
    const div = document.createElement('div');
    div.id = 'library-modal';
    div.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:3000;display:none;justify-content:center;align-items:center;';
    
    div.innerHTML = `
        <div style="width:900px;max-width:95%;height:85%;background:#1a1a2e;border:1px solid #444;border-radius:12px;display:flex;flex-direction:column;box-shadow:0 0 40px rgba(0,0,0,0.8);">
            <div style="padding:15px 20px;background:#16213e;border-bottom:1px solid #444;display:flex;justify-content:space-between;align-items:center;border-radius:12px 12px 0 0;">
                <h3 style="margin:0;color:#b8a1d9;font-family:'Playfair Display', serif;font-size:1.5rem;">Grimório de Habilidades</h3>
                <button onclick="closeLibraryModal()" style="background:none;border:none;color:#fff;font-size:28px;cursor:pointer;opacity:0.7;transition:0.2s;">&times;</button>
            </div>
            <div style="padding:15px;background:#0f3460;display:flex;gap:10px;overflow-x:auto;border-bottom:1px solid #2a2a40;" id="lib-cats">
                <!-- Categories -->
            </div>
            <div id="lib-content" style="flex:1;overflow-y:auto;padding:25px;background:#121220;">
                <!-- Content -->
            </div>
        </div>
    `;
    document.body.appendChild(div);

    // Populate Categories
    const catContainer = div.querySelector('#lib-cats');
    if (typeof ABILITY_LIBRARY !== 'undefined') {
        Object.keys(ABILITY_LIBRARY).forEach(key => {
            const btn = document.createElement('button');
            btn.innerText = key;
            btn.className = 'lib-cat-btn';
            btn.style.cssText = 'padding:8px 16px;background:#1a1a2e;color:#b8b8b8;border:1px solid #444;border-radius:6px;cursor:pointer;white-space:nowrap;font-weight:600;font-size:0.9rem;transition:all 0.2s;';
            
            btn.onmouseover = () => { if(btn.style.background !== 'rgb(106, 17, 203)') btn.style.borderColor = '#b8a1d9'; };
            btn.onmouseout = () => { if(btn.style.background !== 'rgb(106, 17, 203)') btn.style.borderColor = '#444'; };
            
            btn.onclick = () => renderLibrary(key);
            catContainer.appendChild(btn);
        });
    }
}

function renderLibrary(categoryName) {
    const content = document.getElementById('lib-content');
    content.innerHTML = '';
    
    // Highlight active category
    const buttons = document.querySelectorAll('#lib-cats button');
    buttons.forEach(b => {
        if (b.innerText === categoryName) {
            b.style.background = '#6a11cb';
            b.style.color = '#fff';
            b.style.borderColor = '#6a11cb';
        } else {
            b.style.background = '#1a1a2e';
            b.style.color = '#b8b8b8';
            b.style.borderColor = '#444';
        }
    });

    if (typeof ABILITY_LIBRARY === 'undefined' || !ABILITY_LIBRARY[categoryName]) {
        content.innerHTML = '<div style="text-align:center;padding:40px;color:#666;">Dados não encontrados para esta categoria.</div>';
        return;
    }

    const data = ABILITY_LIBRARY[categoryName];
    
    Object.keys(data).forEach(subCat => { // e.g., "Nível 1"
        const groupTitle = document.createElement('h4');
        groupTitle.innerText = subCat;
        groupTitle.style.cssText = 'color:#e9d5ff;border-bottom:2px solid #333;padding-bottom:8px;margin-top:30px;margin-bottom:15px;font-size:1.2rem;';
        content.appendChild(groupTitle);

        const list = data[subCat];
        if(Array.isArray(list)) {
            list.forEach(ability => {
                const item = document.createElement('div');
                item.style.cssText = 'background:rgba(255,255,255,0.03);padding:15px;margin-bottom:15px;border-radius:8px;border-left:4px solid #6a11cb;transition:0.2s;';
                item.onmouseover = () => item.style.background = 'rgba(255,255,255,0.06)';
                item.onmouseout = () => item.style.background = 'rgba(255,255,255,0.03)';
                
                item.innerHTML = `
                    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                        <strong style="color:#fff;font-size:1.1em;border-bottom:1px dashed #444;padding-bottom:2px;">${ability.name}</strong>
                        <span style="font-size:0.8em;color:#aaa;background:#000;padding:2px 6px;border-radius:4px;">${ability.cost || 'Passiva'}</span>
                    </div>
                    <div style="color:#bbb;font-size:0.95em;margin-bottom:12px;line-height:1.5;white-space:pre-wrap;">${ability.description}</div>
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:0.8em;color:#666;">${ability.type || ''}</span>
                        <button class="btn-import-ability" style="padding:6px 14px;background:linear-gradient(45deg, #6a11cb, #2575fc);color:white;border:none;border-radius:4px;cursor:pointer;font-weight:bold;font-size:0.85em;transition:0.2s;box-shadow:0 4px 10px rgba(0,0,0,0.3);">+ Copiar para Ficha</button>
                    </div>
                `;
                
                item.querySelector('.btn-import-ability').onclick = function() {
                   if (categoryName === 'Selos') {
                       addSealAbility('selos-abilities-list', ability);
                   } else {
                       addManualAbility('class-abilities-list', {
                           name: ability.name,
                           level: `[${categoryName}] ${subCat} ` + (ability.cost ? `(${ability.cost})` : ''),
                           desc: ability.description + (ability.type ? `\n\nTipo: ${ability.type}` : '')
                       });
                   }
                   
                   const btn = this;
                   const originalText = btn.innerText;
                   btn.innerText = "✓ Adicionado!";
                   btn.style.background = "linear-gradient(45deg, #11998e, #38ef7d)";
                   setTimeout(() => {
                       btn.innerText = originalText;
                       btn.style.background = "linear-gradient(45deg, #6a11cb, #2575fc)";
                   }, 1500);
                };

                content.appendChild(item);
            });
        }
    });

    if (categoryName === 'Selos') {
        const obs = document.createElement('div');
        obs.innerHTML = '<p style="color:#aaa;font-style:italic;margin-top:20px;text-align:center;">Nota: Selos são magias específicas dos Consagrados, mas podem ser adquiridos por outros meios a critério do mestre.</p>';
        content.appendChild(obs);
    }
}

// --- Sistema de Inventário e Catálogo ---

function parseWeight(weightStr) {
    if (!weightStr) return 0;
    if (typeof weightStr === 'number') return weightStr;
    const RomanMap = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5 };
    const matchRoman = weightStr.match(/Peso\s*([IV]+)/i);
    if (matchRoman) return RomanMap[matchRoman[1].toUpperCase()] || 0;
    const matchNum = weightStr.match(/(\d+)/);
    if (matchNum) return parseInt(matchNum[1]);
    return 0;
}

function updateInventoryStats() {
    const fr = parseInt(document.getElementById('attr-for').value) || 0;
    const maxLoad = (fr * 3) + 5;
    const maxSlots = 3 + fr;
    
    // Update MAX displays
    const wEl = document.getElementById('weight-max');
    if(wEl) wEl.innerText = maxLoad;
    
    const sEl = document.getElementById('initial-items-max');
    if(sEl) sEl.innerText = maxSlots;

    let currentLoad = 0;
    let currentSlots = 0;
    
    document.querySelectorAll('#inventory-list .inventory-item').forEach(item => {
        const qty = parseInt(item.querySelector('.item-qty').value) || 0;
        const weight = parseInt(item.querySelector('.item-weight').value) || 0;
        const isInitial = item.querySelector('.item-is-initial').checked;
        const isEquipped = item.querySelector('.item-is-equipped').checked;
        
        // Weight calculation: Equipped items DO NOT count? Prompt says "Itens em uso ativo (não ocupam carga)"
        if (!isEquipped) {
            currentLoad += (qty * weight);
        }
        
        if (isInitial) currentSlots += qty;
    });

    // Update Current Load
    const loadSpan = document.getElementById('weight-current');
    if(loadSpan) {
        loadSpan.innerText = currentLoad;
        if(currentLoad > maxLoad) {
            // Overload Logic
            const diff = currentLoad - maxLoad;
            loadSpan.style.color = '#ff4444'; 
            // -2 Destreza warning or logic can be added here
        } else {
            loadSpan.style.color = '#fff';
        }
    }

    // Update Current Slots
    const slotSpan = document.getElementById('initial-items-current');
    if(slotSpan) {
        slotSpan.innerText = currentSlots;
        slotSpan.style.color = currentSlots > maxSlots ? '#ff4444' : '#fff';
    }
}

function addItemToInventory(itemData) {
    const list = document.getElementById('inventory-list');
    if(!list) return;

    const div = document.createElement('div');
    div.className = 'inventory-item';
    div.style.cssText = 'background:rgba(255,255,255,0.05); padding:10px; margin-bottom:8px; border-radius:6px; display:flex; flex-wrap:wrap; gap:10px; align-items:center; border:1px solid #444;';
    
    const weightVal = parseWeight(itemData.weight);

    div.innerHTML = `
        <div style="flex:1; min-width:120px;">
            <input class="item-name" value="${itemData.name || ''}" placeholder="Nome do Item" style="width:100%; border:none; background:none; color:#fff; font-weight:bold;">
        </div>
        <div style="display:flex; align-items:center; gap:5px;" title="Quantidade">
             <span style="font-size:0.8em; color:#aaa;">Qtd:</span>
             <input type="number" class="item-qty" value="${itemData.qty || 1}" min="1" style="width:40px; padding:4px; text-align:center;">
        </div>
        <div style="display:flex; align-items:center; gap:5px;" title="Peso Individual">
             <span style="font-size:0.8em; color:#aaa;">Peso:</span>
             <input type="number" class="item-weight" value="${itemData.weightNum !== undefined ? itemData.weightNum : weightVal}" min="0" style="width:40px; padding:4px; text-align:center;">
        </div>
        <div style="display:flex; flex-direction:column; gap:2px;">
            <label class="checkbox-container" title="Conta como Item Inicial?">
                <input type="checkbox" class="item-is-initial" ${itemData.isInitial ? 'checked' : ''}>
                <span class="checkmark"></span>
                <span style="font-size:0.8em; margin-left:5px;">Inicial</span>
            </label>
            <label class="checkbox-container" title="Item em uso ativo (Não ocupa carga)">
                <input type="checkbox" class="item-is-equipped" ${itemData.isEquipped ? 'checked' : ''}>
                <span class="checkmark"></span>
                <span style="font-size:0.8em; margin-left:5px;">Equipado</span>
            </label>
        </div>
        <button class="btn-remove-item" style="background:#ff4444; color:white; border:none; width:24px; height:24px; border-radius:4px; cursor:pointer;" title="Remover">&times;</button>
        <div style="width:100%; margin-top:5px; font-size:0.85em; color:#bbb; border-top:1px dashed #444; padding-top:4px;">
            <textarea class="item-desc" placeholder="Descrição/Efeitos" rows="1" style="width:100%; background:none; border:none; color:#bbb; resize:vertical;">${itemData.description || ''} ${itemData.effect ? '\n' + itemData.effect.replace(/<[^>]*>/g, '') : ''}</textarea>
        </div>
    `;

    div.querySelector('.btn-remove-item').onclick = () => {
        if(confirm('Remover item?')) {
            div.remove();
            updateInventoryStats();
        }
    };
    
    div.querySelectorAll('input').forEach(inp => {
        inp.addEventListener('input', updateInventoryStats);
        inp.addEventListener('change', updateInventoryStats);
    });

    list.appendChild(div);
    updateInventoryStats();
}

function openShopModal() {
    let modal = document.getElementById('shop-modal');
    if (!modal) {
        createShopModal();
        modal = document.getElementById('shop-modal');
    }
    modal.style.display = 'flex';
    if (typeof ITEM_LIBRARY !== 'undefined') {
        const firstCat = Object.keys(ITEM_LIBRARY)[0];
        if (firstCat) renderShop(firstCat);
    }
}

function closeShopModal() {
    const modal = document.getElementById('shop-modal');
    if(modal) modal.style.display = 'none';
}

function createShopModal() {
    const div = document.createElement('div');
    div.id = 'shop-modal';
    div.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.85);z-index:3000;display:none;justify-content:center;align-items:center;';
    
    div.innerHTML = `
        <div style="width:900px;max-width:95%;height:85%;background:#1a1a2e;border:1px solid #444;border-radius:12px;display:flex;flex-direction:column;box-shadow:0 0 40px rgba(0,0,0,0.8);">
            <div style="padding:15px 20px;background:#16213e;border-bottom:1px solid #444;display:flex;justify-content:space-between;align-items:center;border-radius:12px 12px 0 0;">
                <h3 style="margin:0;color:#f0ad4e;font-family:'Playfair Display', serif;font-size:1.5rem;">Catálogo de Itens & Equipamentos</h3>
                <button onclick="closeShopModal()" style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;">&times;</button>
            </div>
            <div style="padding:15px;background:#0f3460;display:flex;gap:10px;overflow-x:auto;border-bottom:1px solid #2a2a40;" id="shop-cats"></div>
            <div id="shop-content" style="flex:1;overflow-y:auto;padding:25px;background:#121220;"></div>
        </div>
    `;
    document.body.appendChild(div);

    if (typeof ITEM_LIBRARY !== 'undefined') {
        const catContainer = div.querySelector('#shop-cats');
        Object.keys(ITEM_LIBRARY).forEach(key => {
            const btn = document.createElement('button');
            btn.innerText = key;
            btn.className = 'shop-cat-btn';
            btn.style.cssText = 'padding:8px 16px;background:#1a1a2e;color:#b8b8b8;border:1px solid #444;border-radius:6px;cursor:pointer;white-space:nowrap;font-weight:600;font-size:0.9rem;transition:all 0.2s;';
            btn.onclick = () => renderShop(key);
            catContainer.appendChild(btn);
        });
    }
}

function renderShop(categoryName) {
    const content = document.getElementById('shop-content');
    content.innerHTML = '';
    
    document.querySelectorAll('#shop-cats button').forEach(b => {
        if (b.innerText === categoryName) {
            b.style.background = '#f0ad4e';
            b.style.color = '#000';
            b.style.borderColor = '#f0ad4e';
        } else {
            b.style.background = '#1a1a2e';
            b.style.color = '#b8b8b8';
            b.style.borderColor = '#444';
        }
    });

    if (!ITEM_LIBRARY[categoryName]) return;

    ITEM_LIBRARY[categoryName].forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.style.cssText = 'background:rgba(255,255,255,0.03);padding:15px;margin-bottom:15px;border-radius:8px;border-left:4px solid #f0ad4e;transition:0.2s;';
        
        let statsHtml = '';
        if(item.stats) {
             statsHtml = Object.entries(item.stats).map(([k,v]) => `<span style="margin-right:10px;color:#fff;background:#333;padding:2px 5px;border-radius:4px;font-size:0.8em;">${k}: ${v}</span>`).join('');
        }

        itemDiv.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
                <strong style="color:#f0ad4e;font-size:1.1em;">${item.name}</strong>
                <span style="font-size:0.8em;color:#aaa;background:#000;padding:2px 6px;border-radius:4px;">${item.weight || 'Peso 0'}</span>
            </div>
            <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:8px;">${statsHtml}</div>
            <div style="color:#bbb;font-size:0.95em;margin-bottom:12px;line-height:1.5;">${item.description || ''}</div>
            ${item.effect ? `<div style="background:rgba(255,193,7,0.1);padding:8px;border-radius:4px;font-size:0.9em;margin-bottom:10px;color:#ddd;border:1px dashed #555;">${item.effect}</div>` : ''}
            <div style="text-align:right;">
                <button class="btn-buy-item" style="padding:6px 14px;background:linear-gradient(45deg, #FFC107, #FF9800);color:#000;border:none;border-radius:4px;cursor:pointer;font-weight:bold;">Importar</button>
            </div>
        `;
        
        itemDiv.querySelector('.btn-buy-item').onclick = function() {
            addItemToInventory(item);
            const btn = this;
            const originalText = btn.innerText;
            btn.innerText = '✓ Importado!';
            setTimeout(() => btn.innerText = originalText, 1000);
        };
        
        content.appendChild(itemDiv);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const btnShop = document.getElementById('btn-open-shop');
    if(btnShop) btnShop.addEventListener('click', openShopModal);
    
    // Also bind event to the attr-for input to recalculate limits
    const attrFor = document.getElementById('attr-for');
    if(attrFor) {
        attrFor.addEventListener('input', updateInventoryStats);
        attrFor.addEventListener('change', updateInventoryStats);
    }
    
    // Initial Calc
    setTimeout(updateInventoryStats, 1000);
});

