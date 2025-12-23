const ITEM_LIBRARY = {
    "Armas Brancas": [
        {
            "name": "Martelo de Guerra",
            "weight": "Peso III",
            "stats": {
                "Dano": "4d6 + FR",
                "Crítico": "20x3"
            },
            "description": "Um martelo pesado feito para guerra.",
            "effect": "<strong>Efeito:</strong> Golpes bem-sucedidos (Acerto 17+) reduzem o movimento do inimigo pela metade no próximo turno."
        },
        {
            "name": "Faca de Caça",
            "weight": "Peso I",
            "stats": {
                "Dano": "1d8 + DES",
                "Crítico": "19x2"
            },
            "description": "Compacta e fácil de manusear, usada para cortes rápidos.",
            "effect": "<strong>Efeito:</strong> Causa sangramento leve (+1d4 de dano por turno por 2 turnos)."
        },
        {
            "name": "Espada Curta",
            "weight": "Peso I",
            "stats": {
                "Dano": "1d10 + DES",
                "Crítico": "20x2"
            },
            "description": "Versátil e eficaz em combate próximo.",
            "effect": "<strong>Efeito:</strong> Contra-ataque – Se bloquear um ataque corpo a corpo, pode atacar imediatamente com metade do dano."
        },
        {
            "name": "Lança",
            "weight": "Peso II",
            "stats": {
                "Dano": "1d10 + FR",
                "Crítico": "20x2"
            },
            "description": "Ótima para manter distância enquanto ataca.",
            "effect": "<strong>Efeito:</strong> Ataques com a lança podem atingir inimigos a até 2B de distância."
        },
        {
            "name": "Machadinha",
            "weight": "Peso I",
            "stats": {
                "Dano": "2d4 + DES",
                "Crítico": "20x3"
            },
            "description": "Uma arma versátil, podendo ser usada tanto em combate corpo a corpo quanto à distância.",
            "effect": "<strong>Efeito:</strong> Pode ser arremessada a até 3B, causando dano total."
        },
        {
            "name": "Bastão de Madeira",
            "weight": "Peso I",
            "stats": {
                "Dano": "1d6 + DES",
                "Crítico": "20x2"
            },
            "description": "Útil para defesa e ataques diretos, perfeito para combate ágil.",
            "effect": "<strong>Efeito:</strong> Concede +2 na Defesa contra ataques corpo a corpo."
        },
        {
            "name": "Adaga Dupla",
            "weight": "Peso I",
            "stats": {
                "Dano": "2d6 + DES",
                "Crítico": "19x2"
            },
            "description": "Ataques rápidos com ambas as mãos, ideal para combates velozes.",
            "effect": "<strong>Efeito:</strong> Permite dois ataques no mesmo turno sem penalidade."
        },
        {
            "name": "Clava de Ferro",
            "weight": "Peso IV",
            "stats": {
                "Dano": "2d8 + FR",
                "Crítico": "20x2"
            },
            "description": "Uma arma brutal usada para quebrar ossos.",
            "effect": "<strong>Efeito:</strong> Pode causar atordoamento (Teste de FR, falha = perde um turno)."
        },
        {
            "name": "Foice",
            "weight": "Peso III",
            "stats": {
                "Dano": "3d6 + DES",
                "Crítico": "20x3"
            },
            "description": "Uma foice grande e pesada, capaz de golpear múltiplos inimigos.",
            "effect": "<strong>Efeito:</strong> Ataques acertam todos os inimigos em um raio de 1B ao redor."
        },
        {
            "name": "Espada Longa",
            "weight": "Peso II",
            "stats": {
                "Dano": "1d10 + FR",
                "Crítico": "19x2"
            },
            "description": "Ideal para combates de frente, com ótima versatilidade.",
            "effect": "<strong>Efeito:</strong> Se usada com as duas mãos, aumenta o dano para 2d8 + FR."
        },
        {
            "name": "Mangual",
            "weight": "Peso II",
            "stats": {
                "Dano": "3d4 + FR",
                "Crítico": "20x3"
            },
            "description": "Uma arma com esfera de ferro presa a uma corrente, excelente contra defesas.",
            "effect": "<strong>Efeito:</strong> Ignora escudos e bloqueios."
        },
        {
            "name": "Lâmina Curva",
            "weight": "Peso II",
            "stats": {
                "Dano": "2d6 + DES",
                "Crítico": "18x2"
            },
            "description": "Design curvado, eficiente para cortes rápidos e ataques consecutivos.",
            "effect": "<strong>Efeito:</strong> Permite dois ataques por turno sem penalidade."
        },
        {
            "name": "Pique",
            "weight": "Peso III",
            "stats": {
                "Dano": "2d12 + FR",
                "Crítico": "20x2"
            },
            "description": "Lança longa para manter inimigos à distância. (3B)",
            "effect": "<strong>Efeito:</strong> Causa derrubada em inimigos menores ao acertar um golpe crítico."
        },
        {
            "name": "Punhal Serrilhado",
            "weight": "Peso I",
            "stats": {
                "Dano": "2d4 + DES",
                "Crítico": "19x3"
            },
            "description": "Luvas de ferro afiadas, criadas para cortes letais.",
            "effect": "<strong>Efeito:</strong> Causa sangramento grave (+2d6 de dano por turno por 3 turnos)."
        }
    ],
    "Armas de Fogo": [
        {
            "name": "Revólver M6",
            "weight": "Peso I",
            "stats": {
                "Dano": "2d6 + DES",
                "Alcance": "8B",
                "Munição": "6 tiros",
                "Crítico": "19x3"
            },
            "description": "Revólver padrão barato, usado tanto por moradores da periferia quanto por alguns guardas de baixo escalão.",
            "effect": "<strong>Efeito:</strong> Pode-se gastar uma ação inteira para se concentrar, fazendo o próximo disparo ignorar armaduras e causar +1d6."
        },
        {
            "name": "Pistola PM-12",
            "weight": "Peso I",
            "stats": {
                "Dano": "2d4 + DES",
                "Alcance": "10B",
                "Munição": "12 tiros",
                "Crítico": "19x2"
            },
            "description": "Pistola de fabricação civil-militar, comum em áreas metropolitanas.",
            "effect": "<strong>Efeito:</strong> Pode disparar 2 vezes no mesmo turno."
        },
        {
            "name": "Escopeta C-32",
            "weight": "Peso III",
            "stats": {
                "Dano": "3d8 + FR",
                "Alcance": "4B",
                "Munição": "2 tiros",
                "Crítico": "20x2"
            },
            "description": "Construção pesada, usada por segurança privada e operações de contenção.",
            "effect": "<strong>Efeito:</strong> Atinge todos os inimigos em um cone de 2B e inimigos próximos a 1B recebem dano X2."
        },
        {
            "name": "Rifle PA-15",
            "weight": "Peso III",
            "stats": {
                "Dano": "2d6 + DES",
                "Alcance": "15B",
                "Munição": "30 tiros",
                "Crítico": "20x2"
            },
            "description": "Rifle oficial dos patrulheiros de Paladium, eficiente e padronizado.",
            "effect": "<strong>Efeito:</strong> Pode disparar em rajada (3 tiros no mesmo turno). Também pode disparar até 6 tiros, porém todos com -3 em seu acerto."
        },
        {
            "name": "Fuzil de Precisão LR-9",
            "weight": "Peso IV",
            "stats": {
                "Dano": "4d10 + DES",
                "Alcance": "25B",
                "Munição": "5 tiros",
                "Recarga": "2 turnos",
                "Crítico": "18x3"
            },
            "description": "Rifles longos usados por franco-atiradores, fabricados com peças importadas e manutenção cara.",
            "effect": "<strong>Efeito:</strong> Ataques ignoram 3 pontos de Esquiva do alvo."
        },
        {
            "name": "Submetralhadora SMT-25",
            "weight": "Peso II",
            "stats": {
                "Dano": "2d4 + DES",
                "Alcance": "5B",
                "Munição": "25 tiros",
                "Crítico": "19x2"
            },
            "description": "Arma de combate urbano popular entre policiais, criminosos e milícias periféricas.",
            "effect": "<strong>Efeito:</strong> Pode disparar 2 vezes no mesmo turno. Essa arma dispara em um Cone, atingindo qualquer algo dentro dele."
        },
        {
            "name": "Lança-Combustível LT-4",
            "weight": "Peso IV",
            "stats": {
                "Dano": "4d6 + FR",
                "Alcance": "6B (cone)",
                "Munição": "5 usos",
                "Recarga": "2 turnos",
                "Crítico": "20x2"
            },
            "description": "Arma pesada que usa combustível pressurizado; empregada em demolição e controle de pragas.",
            "effect": "<strong>Efeito:</strong> Atinge todos os inimigos em um cone (6B) e causa Queimando."
        },
        {
            "name": "Lançador Tático G-01",
            "weight": "Peso IV",
            "stats": {
                "Dano": "6d8",
                "Alcance": "12B",
                "Munição": "3 granadas",
                "Recarga": "2 turnos",
                "Crítico": "20x2"
            },
            "description": "Equipamento militar básico usado para dispersão e supressão.",
            "effect": "<strong>Efeito:</strong> Explosão atinge todos os inimigos em 2B de raio."
        },
        {
            "name": "Arco Reforçado R-12",
            "weight": "Peso II",
            "stats": {
                "Dano": "2d8 + DES",
                "Alcance": "12B",
                "Munição": "1 flecha/turno",
                "Crítico": "19x3"
            },
            "description": "Arco moderno usado por caçadores profissionais e vigilantes.",
            "effect": "<strong>Efeito:</strong> Pode usar flechas especiais (Qualquer tipo)."
        },
        {
            "name": "Metralhadora Pesada MG-88",
            "weight": "Peso V",
            "stats": {
                "Dano": "3d6 + FR",
                "Alcance": "20B",
                "Munição": "100 tiros",
                "Recarga": "2 turnos",
                "Crítico": "20x2"
            },
            "description": "Uma arma pesada, uma monstruosidade que vibra e treme como se fosse viva.",
            "effect": "<strong>Efeito:</strong> O atirador pode escolher disparar de 1 a 7 tiros em um único turno. Penalidade acumulativa de -1 no teste de acerto para cada tiro após o primeiro."
        }
    ],
    "Utilitários": [
        {
            "name": "Granada Fragmentação",
            "weight": "Peso I",
            "stats": {},
            "description": "Um explosivo poderoso que espalha estilhaços letais.",
            "effect": "<strong>Efeito:</strong> Explode em um raio de 2B, causando 4d6 de dano. Uso único."
        },
        {
            "name": "Granada de Fumaça",
            "weight": "Peso I",
            "stats": {},
            "description": "Ideal para fugas estratégicas ou emboscadas.",
            "effect": "<strong>Efeito:</strong> Cria uma área de 3B de névoa densa que obscurece a visão por 3 turnos. Uso único."
        },
        {
            "name": "Granada de Luz",
            "weight": "Peso I",
            "stats": {},
            "description": "Usada para desorientar inimigos antes de um ataque.",
            "effect": "<strong>Efeito:</strong> Ofusca todos em uma área de 3B, forçando um Teste de Resistência de Sentidos (CT:17). Falha = cegueira por 2 turnos. Uso único."
        },
        {
            "name": "Coquetel Molotov",
            "weight": "Peso I",
            "stats": {},
            "description": "Um artefato incendiário improvisado, simples e mortal.",
            "effect": "<strong>Efeito:</strong> Explode em um raio de 2B, incendiando a área por 3 turnos (2d6 de dano por turno). Uso único."
        },
        {
            "name": "Kit Médico",
            "weight": "Peso II",
            "stats": {},
            "description": "Uma bolsa médica completa para emergências em combate.",
            "effect": "<strong>Efeito:</strong> Recupera 3d6 de PV e remove efeitos negativos leves. Uso único."
        },
        {
            "name": "Adrenalina",
            "weight": "Peso I",
            "stats": {},
            "description": "Um estimulante poderoso que aumenta os reflexos e resistência temporariamente.",
            "effect": "<strong>Efeito:</strong> Concede +2 em todos os testes físicos e (+10 PE caso Sobrevivente). Após o efeito, sofre -2 em todos os testes por 1 turno."
        },
        {
            "name": "Cordas Resistentes",
            "weight": "Peso II",
            "stats": {},
            "description": "Uma corda robusta útil para estratégias e armadilhas.",
            "effect": "<strong>Efeito:</strong> Permite escaladas e amarrações seguras. Pode ser usada para prender alvos com um Teste de FR. Reutilizável."
        },
        {
            "name": "Lanterna Tática",
            "weight": "Peso I",
            "stats": {},
            "description": "Essencial para missões noturnas ou em locais escuros.",
            "effect": "<strong>Efeito:</strong> Ilumina até 5B à frente. Reutilizável."
        },
        {
            "name": "Trampolim Dobrável",
            "weight": "Peso II",
            "stats": {},
            "description": "Uma ferramenta improvável, mas eficiente para fugas rápidas ou infiltrações.",
            "effect": "<strong>Efeito:</strong> Permite um salto de até 5B em qualquer direção. Reutilizável."
        },
        {
            "name": "Garrafa de Ácido",
            "weight": "Peso I",
            "stats": {},
            "description": "Um frasco com líquido corrosivo capaz de derreter metais e carne.",
            "effect": "<strong>Efeito:</strong> Joga ácido em um alvo, causando 3d6 de dano e redução de Esquiva em -2 por 3 turnos. Uso único."
        },
        {
            "name": "Dispositivo de Hack",
            "weight": "Peso II",
            "stats": {},
            "description": "Um aparelho essencial para infiltrações e sabotagem.",
            "effect": "<strong>Efeito:</strong> Permite invadir portas eletrônicas, câmeras de segurança e dispositivos digitais com +2 de Bônus. Reutilizável."
        },
        {
            "name": "Bomba de Som",
            "weight": "Peso I",
            "stats": {},
            "description": "Um dispositivo útil para distração ou desorientação.",
            "effect": "<strong>Efeito:</strong> Emite um ruído ensurdecedor em 3B, causando -2 em testes de que envolvam Sentidos e revelando inimigos escondidos. Uso único."
        },
        {
            "name": "Capa de Camuflagem",
            "weight": "Peso II",
            "stats": {},
            "description": "Feita com um material desconhecido e especial, que parece se adaptar ao arredor.",
            "effect": "<strong>Efeito:</strong> Concede +3 em testes de furtividade enquanto estiver parado ou movendo-se devagar. Reutilizável."
        },
        {
            "name": "Dardos Tranquilizantes",
            "weight": "Peso I",
            "stats": {},
            "description": "Dardos carregados com um sedativo forte, ideais para capturas discretas.",
            "effect": "<strong>Efeito:</strong> Ao acertar um alvo, Teste de Resistência (CT:17). Falha = Imobilizado por 2 turnos. Uso único."
        },
        {
            "name": "Garrafa de Veneno",
            "weight": "Peso I",
            "stats": {},
            "description": "Um veneno mortal que pode ser usado de diversas formas.",
            "effect": "<strong>Efeito:</strong> Pode ser aplicada em armas cortantes ou em alimentos, causando 1d6 de dano contínuo por 3 turnos. Uso único."
        },
        {
            "name": "Bomba de Podridão",
            "weight": "Peso I",
            "stats": {},
            "description": "Uma substância pegajosa que imobiliza inimigos e obstrui caminhos.",
            "effect": "<strong>Efeito:</strong> Explode em um raio de 2B, prendendo todos os alvos no local por 1 turno. Uso único."
        },
        {
            "name": "Máscara de Gás",
            "weight": "Peso I",
            "stats": {},
            "description": "Equipamento essencial para sobreviver a ambientes tóxicos.",
            "effect": "<strong>Efeito:</strong> Anula os efeitos de venenos, gases e fumaça. Reutilizável."
        },
        {
            "name": "Pó de Percepção",
            "weight": "Peso I",
            "stats": {},
            "description": "Uma substância que aumenta os sentidos temporariamente.",
            "effect": "<strong>Efeito:</strong> Concede +2 para sua próxima ação de testes de percepção ou iniciativa. Uso único."
        },
        {
            "name": "Bomba Eletromagnética (EMP)",
            "weight": "Peso III",
            "stats": {},
            "description": "Arma tecnológica perfeita para desativar sistemas de segurança e Exos.",
            "effect": "<strong>Efeito:</strong> Desativa todos os dispositivos eletrônicos em 5B por 3 turnos. Uso único."
        }
    ],
    "Proteção": [
        {
            "name": "Escudo Compacto",
            "weight": "Peso I",
            "stats": {},
            "description": "Um pequeno escudo dobrável de fibra reforçada.",
            "effect": "<strong>Defesa:</strong> +3 DEF enquanto empunhado. Reutilizável."
        },
        {
            "name": "Escudo Balístico",
            "weight": "Peso II",
            "stats": {},
            "description": "Um escudo tático usado para contenção e combate urbano.",
            "effect": "<strong>Defesa:</strong> +6 DEF e Resistência a dano perfurante. Reutilizável."
        },
        {
            "name": "Escudo Pesado de Paladium",
            "weight": "Peso III",
            "stats": {},
            "description": "Um escudo massivo com tecnologia de absorção cinética.",
            "effect": "<strong>Defesa:</strong> +12 DEF, Resistência a contundente e perfurante, -3B. Reutilizável."
        },
        {
            "name": "Colete Leve Tático",
            "weight": "Peso I",
            "stats": {},
            "description": "Um colete flexível de proteção básica.",
            "effect": "<strong>Defesa:</strong> +4 DEF. Reutilizável."
        },
        {
            "name": "Armadura Média de Fibra Reforçada",
            "weight": "Peso II",
            "stats": {},
            "description": "Construída com compósitos de alta densidade.",
            "effect": "<strong>Defesa:</strong> +7 DEF e Resistência a dano cortante. Reutilizável."
        },
        {
            "name": "Armadura de Placas",
            "weight": "Peso II",
            "stats": {},
            "description": "Utilizada por unidades táticas especializadas.",
            "effect": "<strong>Defesa:</strong> +10 DEF, Resistência a perfurante e cortante, -1B. Reutilizável."
        },
        {
            "name": "Exotraje Tático Assistido",
            "weight": "Peso III",
            "stats": {},
            "description": "Um conjunto de placas reforçadas com motores assistidos.",
            "effect": "<strong>Defesa:</strong> +14 DEF, -5B e Resistência a dano contundente. Reutilizável."
        },
        {
            "name": "Armadura Centurião",
            "weight": "Peso IV",
            "stats": {},
            "description": "A armadura oficial dos guardas de elite de Paladium.",
            "effect": "<strong>Defesa:</strong> +18 DEF, Resist. cortante/contundente/perfurante, -4 Furtividade e -7B."
        }
    ],
    "Itens Elementais": [
        {
            "name": "Fragmento de Podridão",
            "weight": "Peso II",
            "stats": { "Elemento": "Podridão" },
            "description": "Um pedaço vivo da terra corrompida por Sapila.",
            "effect": "<strong>Efeito:</strong> Ataques corpo a corpo aplicam sangramento leve (+1d4 por 2 turnos). Passivo: -1 em Saúde."
        },
        {
            "name": "Lâmina Espectral de Cadamor",
            "weight": "Peso I",
            "stats": { "Dano": "1d8 + FR", "Elemento": "Solar" },
            "description": "Espada forjada com cristal solar, brilha levemente no escuro.",
            "effect": "<strong>Efeito:</strong> Dano Solar. +1d4 de dano em ambientes escuros."
        },
        {
            "name": "Núcleo Instável de Electro",
            "weight": "Peso III",
            "stats": { "Elemento": "Electro" },
            "description": "Esfera metálica feita a partir de sucata dos EXOs.",
            "effect": "<strong>Efeito:</strong> Arremesso: Descarga elétrica paralisa (2B, 1 turno). Teste de RE."
        },
        {
            "name": "Véu Sombrio",
            "weight": "Peso II",
            "stats": { "Elemento": "Sombra" },
            "description": "Um fragmento de tecido que vibra com falhas no ar.",
            "effect": "<strong>Efeito:</strong> Ativar: +2 Furtividade, inimigos têm desvantagem para acertar (1 rodada). Fim do efeito: 1d4 (3=Ecos, 4=Perde 1d6 Existência)."
        },
        {
            "name": "Cruzeta Sagrada",
            "weight": "Peso I",
            "stats": { "Elemento": "Sagrado" },
            "description": "Relíquia de templos antigos dos Deuses do Tempo.",
            "effect": "<strong>Efeito:</strong> Remove maldição ou veneno de aliado em até 3B."
        },
        {
            "name": "Estilhaço Solar de Ícaron",
            "weight": "Peso I",
            "stats": { "Dano": "2d10", "Elemento": "Solar" },
            "description": "Fragmento inflamado do corpo celestial do pupilo do deus Cadamor.",
            "effect": "<strong>Efeito:</strong> Arremesso: Dano Solar em área (3x3B) e queima o chão (1 turno)."
        },
        {
            "name": "A Calmada",
            "weight": "Peso I",
            "stats": { "Dano": "1d4 + DES", "Elemento": "Sombra" },
            "description": "Ninguém lembra de forjar isso. Ela sempre esteve com você.",
            "effect": "<strong>Efeito:</strong> Dano mental. Se dano >= 6, alvo ouve vozes (Paralisado 1 turno). Role 1d6 colateral."
        },
        {
            "name": "Eco de Amanhã",
            "weight": "Peso III",
            "stats": { "Elemento": "Sombra" },
            "description": "Uma garrafa de vidro trincada por dentro.",
            "effect": "<strong>Efeito:</strong> Névoa escura (4x4, 2 turnos). Teste Saúde (CT 14) ou -1 Ações e alucinação."
        },
        {
            "name": "Corrupção",
            "weight": "Peso II",
            "stats": { "Elemento": "Sombra" },
            "description": "Um anel feito de pensamento solidificado.",
            "effect": "<strong>Efeito:</strong> Ataques ganham +1d6 mental e físico. Início da cena: Teste de colateral (1d6)."
        },
        {
            "name": "Crânio Putrefato de Cavaleiro",
            "weight": "Peso -",
            "stats": { "Elemento": "Podridão" },
            "description": "O crânio retorcido e corroído de um antigo Cavaleiro de Paladium.",
            "effect": "<strong>Ativar:</strong> Perde 1d30+10 PV. Aura 4B (3 rodadas). Inimigos: -2 RF/RE, 1d10 dano. Aliados: +2 RE, +1d8 regen."
        }
    ]
};