/**
 * ============================================================
 * WUITALUR RPG — BANCO DE DADOS PADRONIZADO DA CAMPANHA
 * Schemas Canônicos de Áreas (Locais) e NPCs da Sessão
 * ============================================================
 */

(function (global) {
  'use strict';

  // ============================================================
  // 1. BANCO DE DADOS DE NPCS (SCHEMA PADRONIZADO)
  // ============================================================
  const CAMPAIGN_NPCS = [
    {
      id: "isaque-valente",
      nome: "Isaque Valente",
      ilustracao: "assets/npcs/isaque-valente.png",
      papel: "O Arqueiro Observador • Ex-namorado de Sara / Aluno do Colégio Primórdio",
      pv: 14,
      pe: 4,
      deslocamento: "6B",
      atributos: { Vigor: "d16", Força: "d12", Saúde: "d8", Mente: "d4" },
      equipamento: [
        "Arco de caça reforçado",
        "Faca de combate com serrilha",
        "Máscara respiratória com filtro"
      ],
      pericias: [
        "Pontaria",
        "Disparada",
        "Furtividade",
        "Atletismo",
        "Intimidação"
      ],
      habilidades: [
        {
          nome: "Disparo Furtivo de Caçador",
          tipo: "Ação Padrão (1 PE)",
          efeito: "Ao disparar oculto ou sob cobertura, sobe Vigor em 1 degrau e ignora cobertura leve do alvo, mantendo-se parcialmente camuflado."
        },
        {
          nome: "Retirada com Lâmina Curta",
          tipo: "Reação (1 PE)",
          efeito: "Quando um inimigo entra a 1B dele, desfere um golpe de faca e recua 2B sem sofrer ataque livre, retomando distância para o arco."
        },
        {
          nome: "Foco Cego Contra o Pesadelo",
          tipo: "Ação Bônus (1 PE)",
          efeito: "Fecha os olhos e luta apenas ouvindo o som ambiente. Fica imune a dano de Estresse por visões de anomalias do Pesadelo por 1 rodada."
        }
      ],
      personalidade: "Defensivo, desconfiado e ríspido para esconder a culpa e o terror. Anda com a mão rente às armas temendo agentes do culto.",
      historia_resumida: "Namorou Sara por quase um ano. Quando ela começou a adoecer e terminou friamente, ele percebeu que era fingimento para afastá-lo e passou a vigiá-la, descobrindo o horror do culto.",
      o_que_sabe: [
        "A Mudança e o Término: Sara começou a ter sangramentos nasais e terminou fingindo grosseria para afastá-lo das ameaças que sofria.",
        "O Pavilhão de Acolhimento: Descobriu o prédio abandonado na borda da Mata do Norte onde uma figura adulta mascarada reúne jovens em noites específicas.",
        "O Perfil dos Alvos: Todos os adolescentes acolhidos têm laudos de doenças terminais ou abandono familiar grave; a seita promete um suposto Jardim sem dor.",
        "A Regra das Caixas Negras: Cada jovem ganha uma caixa preta e dourada que só se abre sozinha nas mãos de quem aceitou a morte e desistiu de viver.",
        "O Rito de Sangue: Para atravessar a Porta na floresta, o jovem deve antes cometer um abate sangrento nos limites da mata e ingerir a carne quente da vítima.",
        "O Resgate de Bia: Na noite do sumiço de Sara, foi à mata com seu arco mas chegou tarde. Encontrou sangue, névoa laranja e resgatou Bia desacordada, levando-a à clínica.",
        "As Distorções no Esgoto: Mapeou os túneis sob o pavilhão e aprendeu que eles se expandem sob o Pesadelo, aprendendo a lutar de olhos fechados contra as Amálgamas."
      ],
      o_que_nao_sabe: [
        "A Identidade da Líder: Nunca viu o rosto por trás da máscara e não sabe que se trata da Diretora Constança Montenegro.",
        "A Entidade Ele: Desconhece a origem cósmica da entidade adorada pelo culto e a ligação com as vinhas prateadas.",
        "O Que Bia Viu no Clímax: Como encontrou Bia já desacordada e em choque, não sabe o que aconteceu no momento exato em que a Porta da mata se abriu.",
        "A Senha do Notebook: Não sabe a senha exata do notebook de Sara, mas se o grupo ler a dica da tela para ele, ele recorda a lembrança do namoro que destrava o aparelho."
      ],
      informacao_livre: "Afirma com desdém defensivo que Sara estava maluca, falando sozinha e desenhando horrores no Café da Névoa.",
      segredo_util: "Esconde na mochila o caderno de rascunhos que Sara derrubou no carro dele com desenhos da criatura da mata e frases de desespero.",
      gatilho_revelacao: "Intimidação DT 7 (acusando-o de covardia) ou Diplomacia DT 6 (mostrando que querem salvar Bia e vingar Sara).",
      notas_mestre: "Pode ser encontrado na quadra de esportes do Colégio Primórdio perto dos vestiários. Representa a solidão e o desespero que cercavam Sara."
    },
    {
      id: "elias-ribeiro",
      nome: "Elias Ribeiro",
      ilustracao: "assets/npcs/elias-ribeiro.png",
      papel: "Barista do Café da Névoa • Civil Comum e Testemunha Chave",
      pv: 10,
      pe: 2,
      deslocamento: "6B",
      atributos: { Saúde: "d16", Força: "d12", Mente: "d8", Vigor: "d4" },
      equipamento: [
        "Avental de pano de trabalho",
        "Molho de chaves da Casa dos Auguil",
        "Isqueiro de metal e maço de cigarros"
      ],
      pericias: [
        "Percepção",
        "Intuição",
        "Engenharia"
      ],
      habilidades: [
        {
          nome: "Instinto de Preservação",
          tipo: "Reação (1 PE)",
          efeito: "Ao presenciar violência extrema ou ameaça sobrenatural, encolhe-se e busca cobertura a até 2B, ganhando Vantagem em Esquiva enquanto não atacar."
        },
        {
          nome: "Resistência de Trabalhador",
          tipo: "Passiva",
          efeito: "Acostumado à lida pesada e a noites mal dormidas, ignora a primeira penalidade de fadiga ou cansaço físico comum graças à sua Saúde d16."
        }
      ],
      personalidade: "Assustado, supersticioso e profundamente cansado. Fala baixo, esfrega as mãos no avental e carrega a culpa de quem fingiu não ver o sobrenatural.",
      historia_resumida: "Trabalhava no Café da Névoa desde a época de Trisha. Quando ela sumiu, ajudou Sara a manter o local aberto. Foi a pessoa mais próxima dela nos últimos meses e testemunhou sua degradação física.",
      o_que_sabe: [
        "O Descaso da Renovare: Sara mal parava em pé nas últimas semanas e a Clínica Renovare parou de mandar médicos, enviando laudos apenas pelo correio.",
        "O Contato com o Gato no Beco: Ao jogar lixo no beco, viu Sara conversando com um gato preto que respondia com uma voz distorcida prometendo curá-la.",
        "A Reação Perturbadora de Sara: Ela não entrou em pânico; apenas suspirou, pegou a mochila, mandou Elias fechar o caixa e foi para casa com calma assustadora.",
        "O Brilho nos Olhos de Sara: Enquanto falava com o animal, os olhos dela piscaram em várias cores rapidamente antes de voltar ao normal.",
        "As Chaves da Casa Auguil: Ficou com o molho de chaves que Sara esqueceu no balcão e escondeu no avental com medo da polícia."
      ],
      o_que_nao_sabe: [
        "A Madrugada Seguinte na Residência: Elias foi para casa aterrorizado e não viu o massacre que o gato concluiu na casa de Sara durante a madrugada.",
        "A Existência do Culto e Caixas Negras: Não sabe sobre o galpão abandonado, o sacrifício de sangue ou a seita da floresta.",
        "Quem é Ele: Não compreende o que era a entidade e acredita apenas que a cidade está amaldiçoada."
      ],
      informacao_livre: "Lamenta o sumiço de Sara e conta que ela passava horas no beco dos fundos fumando e olhando para o vazio em depressão profunda.",
      segredo_util: "Testemunhou o gato falante no beco e guarda o molho de chaves da Casa dos Auguil no bolso do avental.",
      gatilho_revelacao: "Intimidação DT 8 (ameaçando prendê-lo por ocultação de provas) ou Ocultismo/Religião DT 6 (mostrando que acreditam no sobrenatural sem julgá-lo louco).",
      notas_mestre: "Encontrado varrendo a calçada em frente ao Café fechado ou fumando tenso no bairro. É a ponte que entrega as chaves da casa de Sara ao grupo."
    },
    {
      id: "constanca",
      nome: "Constança",
      ilustracao: null,
      papel: "Profissional de Saúde • Líder Oculta do Pavilhão Abandonado",
      pv: 12,
      pe: 4,
      deslocamento: "6B",
      atributos: { Vigor: "d8", Força: "d4", Saúde: "d8", Mente: "d16" },
      equipamento: [
        "Caneta-tinteiro de tinta roxa",
        "Bisturi cirúrgico oculto",
        "Chaves de acesso restrito e prontuários médicos"
      ],
      pericias: [
        "Medicina",
        "Diplomacia",
        "Astúcia",
        "Intuição",
        "Investigação",
        "História",
        "Furtividade"
      ],
      habilidades: [
        {
          nome: "Fachada Impecável",
          tipo: "Passiva",
          efeito: "Recebe vantagem em testes de Diplomacia e Astúcia para manter sua reputação pública, manipular autoridades locais ou desacreditar acusações sem provas materiais diretas."
        },
        {
          nome: "Voz da Desistência",
          tipo: "Ação Padrão (1 PE)",
          efeito: "Usa palavras acolhedoras para expor a dor ou falta de futuro de um alvo a alcance curto. O alvo deve passar em Mente DT 8 ou perde 1 PE e fica impedido de realizar ações agressivas contra ela na próxima rodada."
        },
        {
          nome: "Corte Anestésico",
          tipo: "Ação Padrão (1 PE)",
          efeito: "Ataque corpo a corpo com bisturi mirando nervos e tendões. Causa 1d4 de dano e o alvo deve passar em Saúde DT 7 ou tem seu deslocamento reduzido pela metade até o fim da cena."
        }
      ],
      personalidade: "Voz extremamente calma, polida, maternal e acolhedora. Nunca eleva o tom, mantém postura ereta e sorriso sereno que não alcança os olhos. Sob pressão trata ameaças como delírios de jovens estressados. Usa perfume floral forte para disfarçar o odor de formol e terra úmida.",
      historia_resumida: "Figura respeitada no sistema de acolhimento e saúde de Fraguiktos. Após estudar os fenômenos de Paládium e a entidade Ele, passou a usar prontuários médicos para recrutar jovens desenganados ou traumatizados, doutrinando-os no Pavilhão Abandonado para abrirem as Caixas Negras na mata.",
      o_que_sabe: [
        "A Mecânica das Caixas Negras: Elas só destrancam nas mãos de alguém cujo tempo de vida está condenado e que já aceitou o próprio fim.",
        "O Propósito do Canibalismo: Consumir a carne quente de uma vítima saudável serve para acumular Energia Astral extra no espírito do jovem condenado, nutrindo melhor a entidade Ele durante a travessia.",
        "Os Membros da Roda: Sabe a identidade de todos os jovens do Pavilhão, o quadro clínico de Bia e o diagnóstico recente da Praga em Minerva."
      ],
      o_que_nao_sabe: [
        "As Fitas do Pesadelo: Não sabe que os investigadores recuperaram as fitas no pavilhão nem que descobriram seu laboratório secreto no esgoto.",
        "A Investigação de Isaque: Desconhece que Isaque segue seus passos pelas sombras e ignora que foi ele quem resgatou Bia na mata."
      ],
      informacao_livre: "Demonstra profunda compaixão pelo desaparecimento de Sara e pelo estado de Bia, comentando como enfermidades graves abalam as famílias e deixam adolescentes propensos a fugas.",
      segredo_util: "Ela é a pessoa mascarada que lidera a roda do Pavilhão Abandonado e a autora de todas as anotações escritas com tinta roxa.",
      gatilho_revelacao: "Percepção ou Investigação DT 7 para notar a caneta roxa no bolso e o odor de formol sob o perfume; ou Intuição DT 8 ao confrontá-la sobre Minerva para notar seu fascínio clínico em vez de piedade.",
      notas_mestre: "Circula livremente pela clínica e áreas públicas. O objetivo é gerar impotência social nos jogadores ao verem uma assassina protegida pelo prestígio público, além de tentar manipular Minerva após o diagnóstico da Praga."
    },
    {
      id: "figura-mascarada",
      nome: "???",
      ilustracao: null,
      papel: "A Figura Mascarada; predador silencioso da Mata do Norte e condutor dos ritos no Pavilhão Abandonado",
      pv: 16,
      pe: 4,
      deslocamento: "6B",
      atributos: { Vigor: "d12", Força: "d12", Saúde: "d12", Mente: "d16" },
      equipamento: [
        "Máscara lisa e pálida sem feições",
        "Faca de caça pesada (1d8 cortante/perfurante)",
        "Chaves e correntes enferrujadas do Pavilhão"
      ],
      pericias: [
        "Furtividade",
        "Disparada",
        "Atletismo",
        "Percepção",
        "Intimidação",
        "Medicina",
        "Sobrevivência"
      ],
      habilidades: [
        {
          nome: "Obsessão pela Chave",
          tipo: "Passiva",
          efeito: "A figura sente a presença da Caixa Negra e Dourada no escuro, sabendo sempre quem a está carregando. Ignora provocações ou distrações de outros alvos se houver caminho até o portador da caixa e recebe vantagem em testes de Percepção e Sobrevivência para rastreá-lo."
        },
        {
          nome: "Talho Cirúrgico",
          tipo: "Ação Padrão (1 PE)",
          efeito: "Desfere um golpe frio e calculado com a faca de caça mirando pontos vitais e tendões. Causa o dano da arma mais 1d4 adicional e exige que o alvo passe em um teste de Saúde (DT 7) para não sofrer sangramento contínuo até ser enfaixado."
        },
        {
          nome: "Lâmina de Sigilos Dourados",
          tipo: "Ação Padrão (1 PE)",
          efeito: "A figura solta a faca de caça no ar, fazendo-a flutuar cercada por sigilos dourados brilhantes antes de disparar em linha reta contra um alvo em alcance médio. O ataque usa Mente (d16) e causa 1d8 + 2 de dano perfurante. Se houver outro personagem adjacente ou alinhado ao alvo principal, a lâmina atravessa e perfura o segundo alvo também (causando 1d6 de dano perfurante) antes de retornar flutuando para a mão de \"???\"."
        },
        {
          nome: "Clarão de Vedação",
          tipo: "Reação (1 PE)",
          efeito: "Sempre que um personagem tentar agarrar, golpear ou arrancar a máscara de \"???\", as frestas da máscara explodem instantaneamente em um feixe violento de luz ofuscante. A tentativa falha automaticamente e o atacante deve passar em um teste de Vigor ou Saúde (DT 8); se falhar, sofre 1d4 de dano mental/luminoso e fica Atordoado e Cego por 1 rodada."
        },
        {
          nome: "Passo na Fuligem",
          tipo: "Reação (1 PE)",
          efeito: "Ao sofrer dano pesado ou ouvir a aproximação de autoridades externas, a figura se envolve em uma nuvem densa de fumaça cor de ferrugem e fios laranjas, recuando imediatamente para a escuridão sem provocar ataques de oportunidade."
        }
      ],
      personalidade: "Completamente muda e implacável durante perseguições ou combates. Caminha sem emitir som, inclinando a cabeça de forma lenta e inumana para observar o desespero de suas presas. Só utiliza a voz durante os ritos fechados de doutrinação, onde assume um sussurro gélido, solene e desprovido de qualquer calor humano, soando como um eco antigo que guia mentes quebradas.",
      historia_resumida: "Uma presença obscura e anônima que assombra os limites da Mata do Norte e os subterrâneos de Fraguiktos. É a entidade física responsável por entregar as Caixas Negras aos jovens desenganados, conduzir a lavagem cerebral no Pavilhão Abandonado e caçar implacavelmente qualquer um que tente roubar os artefatos destinados à abertura das Portas para \"Ele\".",
      o_que_sabe: [
        "Localização da Caixa: A localização exata da Caixa Negra e Dourada roubada da Casa Auguil e o rastro deixado pelos adolescentes na lama da floresta.",
        "Rotas Subterrâneas: Todos os caminhos ocultos, trancas e passagens que conectam a Mata do Norte, o Pavilhão Abandonado e as galerias de esgoto.",
        "O Ritual de Sangue: O ritual completo exigido pela entidade \"Ele\" para que uma Porta seja aberta através do sacrifício e consumo da carne na floresta."
      ],
      o_que_nao_sabe: [
        "Empatia e Heroísmo: Não compreende laços de empatia ou heroísmo entre o grupo, assumindo que qualquer adolescente acuado acabará cedendo ao medo ou entregando o portador da Caixa para salvar a própria pele.",
        "A Vigilância de Isaque: Não sabe que um arqueiro mascarado (Isaque) tem vigiado os arredores do culto no escuro e conhece rotas seguras pelas galerias."
      ],
      informacao_livre: "Nenhuma. Fora do círculo de doutrinação dos escolhidos, a figura não dialoga, não responde a perguntas e não negocia, comunicando sua intenção apenas através do arranhar da lâmina no metal e do avanço silencioso.",
      segredo_util: "Por trás dos buracos escuros da máscara lisa não há um olhar comum, mas feixes de fios alaranjados acesos como brasas e sigilos ocultos que parecem costurar a própria máscara à carne, impedindo que seu rosto seja revelado à força.",
      gatilho_revelacao: "Percepção ou Medicina (DT 7) durante um confronto próximo para notar que seus golpes não são de um assassino descontrolado, mas cortes cirúrgicos perfeitos de quem conhece anatomia profundamente; ou Investigação (DT 8) para enxergar os fios laranjas e sigilos dourados pulsando por dentro das frestas da máscara.",
      notas_mestre: "Atua como a ameaça física inexorável da campanha nas áreas isoladas e escuras. O objetivo dramático de suas aparições é manter a sensação constante de caça e claustrofobia, forçando os jogadores a fugirem para lugares cada vez mais profundos (como o Pavilhão e o esgoto) para protegerem a Caixa Negra."
    }
  ];

  // ============================================================
  // 2. BANCO DE DADOS DE ÁREAS (SCHEMA PADRONIZADO)
  // ============================================================
  const CAMPAIGN_AREAS = {
  "colegio-primordio": {
    "id": "colegio-primordio",
    "nome": "Colégio Integrado Primórdio",
    "shortName": "Colégio Primórdio",
    "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10v6M2 10l10-5 10 5-10 5z\"></path><path d=\"M6 12v5c3 3 9 3 12 0v-5\"></path></svg>",
    "themeClass": "area-colegio-primordio",
    "district": "Setor Estudantil e Cívico • Centro de Fragktus",
    "dangerLevel": "Inspetores Rígidos e Vigilância Escolar",
    "dangerLevelClass": "warning",
    "resumo_atmosfera": "A arquitetura impõe-se de forma rígida e asseada. Os corredores longos possuem pisos de mosaico polido que refletem uma luz fluorescente pálida, ladeados por filas intermináveis de cacifos de metal verde-oliva. Os passos ecoam de forma seca e solitária nas paredes frias, transmitindo a sensação constante de vigilância e de que as conversas nunca são verdadeiramente privadas. No pátio central e no ginásio, a grandiosidade da infraestrutura serve apenas para reforçar a pequenez e a vulnerabilidade de quem ali estuda.\n\nO ar carrega uma mistura enjoativa de cera de polir, papel velho da biblioteca e desinfetante forte — o aroma da limpeza extrema, usado pela direção para apagar rapidamente qualquer vestígio de fraqueza, dor ou escândalo. Durante as aulas, um silêncio opressivo domina os pisos, quebrado apenas pelo tiquetaque rígido dos relógios de parede e pelo som distante e calculista de sapatos de salto alto a ecoar no rés-do-chão.\n\nA pressão social paira densa nos intervalos. Os alunos, filhos da elite local, agrupam-se com posturas impecáveis e olhares de julgamento, criando um ecossistema hostil a quem não partilha do mesmo estatuto. É um espaço claustrofóbico e profundamente hipócrita, onde o arranjo de flores mortas no corredor contrasta com a ordem imaculada da instituição, provando aos investigadores que o sofrimento ali não é tratado, mas sim silenciado de imediato.",
    "requisitos_acesso": "Aberto ao público das 07h00 às 18h30 com uniforme escolar ou credencial de visitante. Acesso noturno requer arrombamento do portão lateral (Ladinagem DT 6) ou despistar a ronda dos inspetores de pátio.",
    "npcs_presentes": ["isaque-valente"],
    "pontos_de_interesse": [
        {
          "cabecalho": {
            "nome": "O Armário de Sara (Memorial)",
            "descricao_publica": "O armário metálico nº 73, no corredor principal. A base e a porta foram completamente soterradas por um memorial improvisado pelos alunos: dezenas de pequenos vasos de flores, copos de plástico com cera de velas derretida e inúmeras mensagens de luto coladas com fita. A porta do armário está apenas encostada, sem cadeado."
          },
          "testes": [
            {
              "pericia": "Investigação",
              "ct_dt": 6,
              "informacao_revelada": "Ao afastar o amontoado de flores e examinar as frestas do armário vazio, os jogadores encontram duas coisas escondidas propositalmente. A primeira é um envelope denso da diretoria, contendo um cartão escrito com tinta roxa: \"Que as tuas dores encontrem repouso. Foste corajosa ao aceitar o descanso. — C.\". A segunda, presa na parte de dentro da porta sob outras folhas, é uma foto polaroid de Sara sorrindo, abraçada a um rapaz com pinta de atleta que veste um casaco do colégio indicando ser de outra turma."
            },
            {
              "pericia": "Percepção",
              "ct_dt": 6,
              "informacao_revelada": "O interior do armário cheira fortemente a desinfetante hospitalar e cera de polir, destoando do cheiro adocicado das flores do memorial. Alguém limpou tudo lá dentro recentemente e com muita urgência."
            },
            {
              "pericia": "Intuição / Empatia",
              "ct_dt": 7,
              "informacao_revelada": "Analisando a foto, a linguagem corporal indica muita intimidade. Eles não eram apenas amigos, eram claramente um casal."
            }
          ],
          "notas_mestre": "O armário entrega duas pistas cruciais de uma vez. O cheiro de limpeza e o cartão com a inicial \"C\" em tinta roxa provam que a Diretora Constança escondeu as evidências da doença e sabia do sumiço da garota. Já a foto polaroid é o seu \"gancho social\" para a sessão: o rapaz é Isaque Valente. Os jogadores não o conhecem, então precisarão perguntar pelos corredores, o que os levará diretamente para a quadra (onde o \"dia de esportes\" está acontecendo) para confrontá-lo."
        },
        {
          "cabecalho": {
            "nome": "Cabine do Vestiário do Ginásio",
            "descricao_publica": "O colégio está no meio de um \"dia de esportes\", com barulho de alunos na quadra externa. O vestiário feminino está úmido e conta com fileiras de cabines individuais de troca. Na terceira cabine, a porta está meio aberta e o banco de madeira no centro parece ter sido arrastado recentemente."
          },
          "testes": [
            {
              "pericia": "Investigação",
              "ct_dt": 6,
              "informacao_revelada": "Tatiando embaixo do banco do provador, há um frasco de remédio vazio preso com fita adesiva. Ele não tem rótulo comercial, apenas um código da \"Clínica Médica Renovare\"."
            },
            {
              "pericia": "Medicina / Alquimia",
              "ct_dt": 6,
              "informacao_revelada": "O resíduo e o odor no frasco pertencem a analgésicos opioides fortíssimos, do tipo prescrito estritamente para amenizar dores agudas de câncer em estágio terminal."
            },
            {
              "pericia": "Percepção",
              "ct_dt": 8,
              "informacao_revelada": "Atrás da porta da cabine, riscado na tinta verde com a ponta de um compasso, está escrito: \"O gato preto estava no pátio outra vez. Ele me olhou da árvore.\""
            }
          ],
          "notas_mestre": "Sara usava essa cabine individual durante as aulas para tomar seus remédios escondida e esconder a degradação de seu corpo (inclusive de Isaque, que está jogando na quadra lá fora). Com este frasco, os jogadores ganham o pretexto perfeito para ir questionar Isaque na quadra ou para se dirigirem à Clínica Renovare depois da escola."
        },
        {
          "cabecalho": {
            "nome": "O Gabinete da Direção",
            "descricao_publica": "A sala imponente da Diretora Constança Montenegro. Cheira a perfume floral caro e cera. Atrás da pesada mesa de carvalho, há um arquivo de aço cinza encravado na parede, trancado com uma fechadura cilíndrica robusta."
          },
          "testes": [
            {
              "pericia": "Ladinagem / Crime",
              "ct_dt": 8,
              "informacao_revelada": "Permite destrancar a gaveta inferior do arquivo de aço sem entortar a lingueta e sem disparar o alarme mecânico instalado no batente."
            },
            {
              "pericia": "Investigação",
              "ct_dt": 8,
              "informacao_revelada": "No fundo falso da gaveta há uma pasta chamada \"Casos Especiais\". Dentro, laudos médicos completos de Sara Auguil (2061) e da sua irmã Trisha Auguil (2060)."
            },
            {
              "pericia": "Intuição",
              "ct_dt": 7,
              "informacao_revelada": "Grampeado ao laudo de Sara, há um pequeno post-it amarelo com a caligrafia em tinta roxa: \"Degeneração celular incurável. Sem suporte familiar. Proceder com a apresentação à Névoa.\""
            }
          ],
          "notas_mestre": "Esta é a prova definitiva de que a Diretora mapeia alunos doentes, isolados e desamparados (usando contatos na Clínica) para oferecê-los à entidade da Floresta, mantendo assim o pacto de prosperidade das famílias fundadoras de Mina de Prata."
        },
        {
          "cabecalho": {
            "nome": "A Sala de Música",
            "descricao_publica": "Uma sala com isolamento acústico no segundo andar. Possui um piano de cauda, estantes de partituras e violinos guardados. A janela dos fundos, que dá vista para o muro do colégio e a orla da Mata do Norte, está destravada e levemente aberta."
          },
          "testes": [
            {
              "pericia": "Investigação",
              "ct_dt": 6,
              "informacao_revelada": "Presa sob a tampa do piano de cauda, há uma folha pautada de partitura. Ela contém uma tabela manuscrita com os horários em que o carro da Diretora Constança saía da escola durante a madrugada."
            },
            {
              "pericia": "História / Ocultismo",
              "ct_dt": 8,
              "informacao_revelada": "No verso da partitura, há rascunhos de uma cantiga do folclore de Fragktus: \"Aquele que habita nas raízes... que fala pelos mortos e aceita os que não têm futuro\"."
            },
            {
              "pericia": "Percepção",
              "ct_dt": 6,
              "informacao_revelada": "Há vestígios de terra seca e preta no parapeito da janela."
            }
          ],
          "notas_mestre": "Como Sara era multitalentosa e tocava piano, ela tinha acesso livre a esta sala. Ela a usava como esconderijo seguro para investigar a ligação da Diretora com as lendas da floresta antes do gato a visitar em casa e ela ceder à manipulação."
        }
      ],
    "conexoes_saida": [
      {
        "area_id": "floresta-proibida",
        "nome": "A Mata do Norte",
        "gancho": "A rodovia vicinal ao norte que leva diretamente aos limites da reserva florestal fechada."
      }
    ]
  },
  "floresta-proibida": {
        "id": "floresta-proibida",
        "nome": "A Mata do Norte",
        "shortName": "Mata do Norte",
        "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 2L5 12h4l-3 6h5v4h2v-4h5l-3-6h4L12 2z\"></path></svg>",
        "themeClass": "area-floresta-proibida",
        "district": "Reserva Florestal Fechada   Zona Rural",
        "dangerLevel": "Ameaça Desconhecida",
        "dangerLevelClass": "danger",
        "titulo_narrativo": "Chegada à Clareira do Bunker",
        "texto_narrativo": "\"Após caminharem pela mata fechada, as árvores abrem espaço para uma clareira perfeitamente circular. No extremo oposto, incrustada em um monte de terra, há uma pesada porta dupla de metal. Ela é de um branco cirúrgico e antinatural para o meio da floresta, mas está quase totalmente enredada por vinhas prateadas e grossas, que sobem do solo escuro e se agarram ao metal como veias pulsantes. Não há fechadura visível. O ar perto das portas é gélido e cheira a lodo. Apoiada no chão de terra, bem ao lado da porta selada, repousa uma mochila escolar abandonada.\"",
        "resumo_atmosfera": "A floresta que cerca Mina de Prata é densa e sufocante, mas subitamente se abre em uma clareira circular e silenciosa. O chão é um tapete espesso de folhas mortas. Em vez de ruínas ou anomalias naturais, há uma estrutura artificial brutalista quase totalmente engolida pela terra: um bunker. A anomalia não é a estrutura em si, mas a forma como a natureza ao redor parece evitá-la, com exceção de uma vegetação parasita e metálica que a sela.",
        "requisitos_acesso": "Acesso desobstruído até o perímetro interno, mas desorientador e perigoso à noite.",
        "npcs_presentes": [],
        "pontos_de_interesse": [
          {
            "cabecalho": {
              "nome": "O Bunker Selado e a Mochila Escolar",
              "descricao_publica": "A porta dupla branca cravada no monte de terra. As vinhas prateadas que a cobrem têm um brilho opaco e parecem mais duras que aço. No chão, a mochila comum cria um contraste bizarro com o cenário de ficção científica/horror."
            },
            "testes": [
              {
                "pericia": "Investigação",
                "ct_dt": 6,
                "informacao_revelada": "Vasculhando a mochila abandonada. Eles encontram cadernos molhados do Colégio Integrado Primórdio (com o nome de Sara Auguil) e um frasco vazio de analgésicos fortíssimos, sem rótulo, mas com o timbre quase apagado da Clínica Médica Renovare."
              },
              {
                "pericia": "Ocultismo / Cosmos",
                "ct_dt": 8,
                "informacao_revelada": "O jogador que tocar nas vinhas prateadas percebe que elas não são plantas normais; elas reagem ao calor do corpo, enrijecendo-se. O bunker está trancado não por mecanismos físicos, mas selado por uma barreira anômala que exige um catalisador para abrir."
              },
              {
                "pericia": "Força / Tecnologia",
                "ct_dt": 99,
                "informacao_revelada": "(Falha Automática) Tentar empurrar, hackear (se houvesse painel) ou quebrar as portas com pé de cabra é inútil. O metal branco não amassa e as vinhas prateadas são indestrutíveis no momento. É um beco sem saída intransponível."
              }
            ],
            "notas_mestre": "O mistério inicial foi adaptado. O bunker fechado serve como a \"Porta\". Os jogadores percebem que não podem entrar agora. A mochila é o gancho imediato que os obriga a voltar para a cidade (Colégio e Clínica) para descobrir quem esteve aqui e, no fim do episódio, perceberão que Sara usou um sacrifício de sangue para fazer essas vinhas prateadas cederem."
          }
        ],
        "conexoes_saida": [
          {
            "area_id": "colegio-primordio",
            "nome": "Colégio Integrado Primórdio",
            "gancho": "O colégio de onde pertence a mochila encontrada na lama."
          },
          {
            "area_id": "clinica-renovare",
            "nome": "Clínica Médica Renovare",
            "gancho": "A origem dos frascos de remédios sem rótulo encontrados."
          }
        ]
      },
      "cafe-da-nevoa": {
    "id": "cafe-da-nevoa",
    "nome": "Café da Névoa",
    "shortName": "Café",
    "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M18 8h1a4 4 0 0 1 0 8h-1\"></path><path d=\"M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z\"></path><line x1=\"6\" y1=\"1\" x2=\"6\" y2=\"4\"></line><line x1=\"10\" y1=\"1\" x2=\"10\" y2=\"4\"></line><line x1=\"14\" y1=\"1\" x2=\"14\" y2=\"4\"></line></svg>",
    "themeClass": "area-cafe-da-nevoa",
    "district": "Rua Comercial • Centro",
    "dangerLevel": "Abandono Recente e Luto",
    "dangerLevelClass": "warning",
    "titulo_narrativo": "Chegada ao Café",
    "texto_narrativo": "\"Você dobram a esquina e avistam a fachada do Café da Névoa. O letreiro está apagado e as luzes lá dentro já foram cortadas. O som da grade metálica a descer ecoa pela calçada quase deserta. Junto à porta de vidro, um homem de avental sujo — Elias — está com as mãos a tremer enquanto tenta acertar com a chave na fechadura. O rosto dele está encovado, iluminado apenas pela luz pálida do poste de rua. Colado no vidro da porta, mesmo ao lado da cabeça dele, há um papel manuscrito que diz: 'Encerrado por Luto'. Elias olha freneticamente por cima do ombro, para as sombras do beco ao lado do café, como se esperasse que algo saísse de lá a qualquer momento. Vocês chegaram no exato segundo antes de ele fugir para casa.\"",
    "resumo_atmosfera": "O sol está a pôr-se e a rua comercial está a esvaziar. O letreiro de néon do Café da Névoa, que costumava ser um ponto de encontro acolhedor, está apagado. As cadeiras da esplanada já foram recolhidas e empilhadas de forma descuidada. O cheiro a café torrado mistura-se com o odor forte a lixívia e água suja do chão recém-lavado. Há um ar de abandono precoce no local, como se o negócio tivesse morrido junto com a sua dona.",
    "requisitos_acesso": "A porta está trancada por Elias, e o beco é acessível pela lateral livremente.",
    "npcs_presentes": ["elias-ribeiro"],
    "pontos_de_interesse": [
      {
        "cabecalho": {
          "nome": "A Porta de Vidro",
          "descricao_publica": "A porta de entrada do café, onde Elias está encurralado entre a grade semi-descida e o grupo de investigadores. Ele segura o molho de chaves do estabelecimento com tanta força que os nós dos dedos estão brancos."
        },
        "testes": [
          {
            "pericia": "Intuição / Empatia",
            "ct_dt": 6,
            "informacao_revelada": "Lendo a linguagem corporal de Elias, o jogador percebe que ele não está a tremer de tristeza pela morte da patroa. Ele está a tremer de um pavor absoluto e irracional. Ele olha repetidamente para o beco."
          },
          {
            "pericia": "Diplomacia (DT 7) ou Intimidação (DT 8)",
            "ct_dt": 7,
            "informacao_revelada": "Se passarem, ele desmorona e conta a verdade: que viu Sara a falar com o gato preto no beco, que o animal respondeu com uma voz humana, e que Sara foi para casa (Casa Auguil) como se aquilo fosse perfeitamente normal."
          },
          {
            "pericia": "Percepção",
            "ct_dt": 6,
            "informacao_revelada": "Durante a conversa, o jogador nota que há um porta-chaves pesado no bolso do avental de Elias que não pertence às chaves do café. É o molho de chaves da Casa Auguil que Sara deixou para trás."
          }
        ],
        "notas_mestre": "Este é o PDI social da área. O objetivo aqui é arrancar a confissão do Elias e obter as chaves da casa de Sara. Se os jogadores falharem nos testes de diálogo, Elias pode entrar em pânico, atirar as chaves para o chão e fugir a correr pela rua fora."
      },
      {
        "cabecalho": {
          "nome": "Os Caixotes do Lixo no Beco",
          "descricao_publica": "O beco estreito ao lado do café, para onde Elias não parava de olhar. É escuro, cheira a restos de comida e humidade. Há dois grandes contentores de lixo de plástico encostados a uma parede de tijolo. Foi aqui que a entidade fez o primeiro contacto."
        },
        "testes": [
          {
            "pericia": "Investigação",
            "ct_dt": 6,
            "informacao_revelada": "Atrás dos caixotes do lixo, os jogadores encontram várias pontas de cigarros manchadas de batom (provando que Sara passava horas ali escondida) e o cadáver seco de um grande gato preto."
          },
          {
            "pericia": "Medicina / Alquimia",
            "ct_dt": 7,
            "informacao_revelada": "Examinando o gato morto. Ele não tem ferimentos externos visíveis nem foi envenenado por raticida. O interior da boca e os olhos do animal estão preenchidos por um resíduo de lodo negro e seco. Ele foi consumido de dentro para fora no momento em que a entidade abandonou este corpo e seguiu Sara para casa."
          },
          {
            "pericia": "Ocultismo / Cosmos",
            "ct_dt": 8,
            "informacao_revelada": "O jogador sente que o ar neste beco é uns graus mais frio do que na rua. A entidade deixou uma 'cicatriz' no ambiente ao manifestar-se fisicamente no nosso mundo através do animal."
          }
        ],
        "notas_mestre": "Explorar o beco serve para validar a história maluca do Elias. Quando os jogadores encontram o gato morto com lodo negro, eles percebem que o barista não estava a alucinar e que o perigo sobrenatural é real. Isso aumenta a tensão para a invasão da Casa Auguil."
      },
      {
        "cabecalho": {
          "nome": "O Envelope no Balcão do Caixa",
          "descricao_publica": "Se os jogadores espreitarem pelo vidro da porta (ou se pedirem a Elias para abrir a porta por um segundo), podem ver o balcão do caixa lá dentro. Perto da máquina registadora, há um envelope grosso rasgado."
        },
        "testes": [
          {
            "pericia": "Percepção",
            "ct_dt": 6,
            "informacao_revelada": "O envelope tem o logótipo da 'Clínica Médica Renovare'."
          },
          {
            "pericia": "Ladinagem / Crime",
            "ct_dt": 7,
            "informacao_revelada": "Caso o Elias tenha fugido a correr sem lhes abrir a porta, um jogador pode tentar forçar a fechadura da porta de vidro para entrar rapidamente e pegar o envelope."
          },
          {
            "pericia": "Investigação (ao abrir o envelope)",
            "ct_dt": 6,
            "informacao_revelada": "Dentro do envelope estão os resultados dos exames de sangue e os laudos médicos finais de Sara, que a clínica enviou diretamente para o local de trabalho dela (já que ela se recusava a abrir a porta de casa aos médicos). Os papéis confirmam que ela tinha apenas poucas semanas de vida restantes e que a dor era incapacitante."
          }
        ],
        "notas_mestre": "Esta pista reforça o motivo do desespero de Sara. O diagnóstico terminal enviado para o café foi o 'empurrão' final que quebrou o seu espírito no dia do desaparecimento, deixando-a vulnerável para ser abordada pelo gato no beco logo de seguida."
      }
    ],
    "conexoes_saida": [
      {
        "area_id": "casa-auguil",
        "nome": "Casa Auguil",
        "gancho": "A casa para onde Sara foi depois de falar com o gato negro."
      }
    ]

  },
  "clinica-renovare": {
    "id": "clinica-renovare",
    "nome": "Clínica Renovare",
    "shortName": "Clínica",
    "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 12h-4l-3 9L9 3l-3 9H2\"></path></svg>",
    "themeClass": "area-clinica-renovare",
    "district": "Centro Médico • Setor Sul",
    "dangerLevel": "Risco Biológico e Segurança",
    "dangerLevelClass": "danger",
    "titulo_narrativo": "Entrada na Clínica",
    "texto_narrativo": "\"Quando vocês passam pelas portas da Clínica Renovare, o cheiro de desinfetante forte queima as narinas. O lugar é iluminado por uma luz branca e fria que não deixa espaço para sombras. À vossa frente, pintado no chão de forma simétrica, há um grande círculo com um 'X' azul apontando para um balcão de triagem angular e moderno.\n\nO layout é intimidador: um enorme bloco central de vidro e metal domina o meio do edifício, abrigando mesas de computadores, prateleiras de suprimentos e equipamentos estranhos que mais parecem de um centro de pesquisa do que de um hospital comum. Ao redor desse bloco, um longo corredor dá acesso a dezenas de quartos individuais, onde o bip constante de monitores cardíacos ecoa no silêncio. Enfermeiros de branco circulam de forma metódica, com os olhos fixos em pranchetas eletrônicas. Para descobrir o que a Dra. Melissa Vane estava a injetar na Sara, vocês terão de se esgueirar por estes corredores limpos ou encontrar uma forma de aceder aos terminais do bloco central sem disparar o alarme.\"",
    "resumo_atmosfera": "A Clínica Renovare revela-se muito mais do que um simples pronto-socorro de bairro. O interior é uma instalação de ponta, com iluminação fria, piso impecável e um design circular opressivo. O núcleo do edifício é um grande bloco central fechado (com administração, farmácia e laboratórios), rodeado por um longo corredor quadrado que dá acesso a dezenas de quartos de pacientes. A clínica está ativa, com luzes acesas, enfermeiros circulando pelos corredores externos e o zumbido constante de equipamentos de suporte à vida. A Dra. Melissa Vane tem total controle sobre esta ala, e foi aqui que os horrores médicos com Sara aconteceram.",
    "requisitos_acesso": "Acesso público restrito após a meia-noite, exigindo furtividade, credenciais roubadas ou manipulação para circular nas áreas fechadas do bloco central.",
    "npcs_presentes": ["melissa-vane"],
    "pontos_de_interesse": [
      {
        "cabecalho": {
          "nome": "O Terminal de Triagem (Balcão Angular)",
          "descricao_publica": "Logo na entrada, atrás da marcação azul no chão, fica um balcão angular escuro com vários monitores. Uma enfermeira de plantão atende os poucos pacientes noturnos, mas afasta-se ocasionalmente para verificar os corredores."
        },
        "testes": [
          {
            "pericia": "Diplomacia / Enganação",
            "ct_dt": 6,
            "informacao_revelada": "Falar com a enfermeira e inventar uma desculpa sólida para aceder a informações. Ela revelará, hesitando, que Sara Auguil não ficava nos quartos normais, mas sim na 'Ala de Isolamento Biológico' no corredor leste."
          },
          {
            "pericia": "Furtividade / Ladinagem",
            "ct_dt": 7,
            "informacao_revelada": "Esperar a enfermeira virar as costas para roubar um crachá de acesso magnético esquecido em cima do teclado, permitindo abrir as portas do Bloco Central."
          },
          {
            "pericia": "Tecnologia",
            "ct_dt": 6,
            "informacao_revelada": "Hackear rapidamente o terminal destrancado para descobrir a senha dos computadores da administração interna."
          }
        ],
        "notas_mestre": "Este é o ponto de interação inicial. O objetivo aqui é conseguir a localização do quarto de Sara ou o acesso físico/digital para o laboratório no meio do mapa."
      },
      {
        "cabecalho": {
          "nome": "A Mesa Central de Administração (Bloco Central)",
          "descricao_publica": "Dentro do bloco fechado no centro do mapa, há uma sala com quatro mesas azuis dispostas em formato de cruz. É a central de administração da Dra. Melissa Vane. A sala está temporariamente vazia, mas tem paredes de vidro, o que significa que quem estiver lá dentro pode ser visto por patrulhas no corredor."
        },
        "testes": [
          {
            "pericia": "Tecnologia",
            "ct_dt": 7,
            "informacao_revelada": "Acessar os arquivos restritos no computador principal. Os jogadores encontram o prontuário de Sara: ela tinha falência múltipla de órgãos, mas a Dra. Melissa continuava a administrar 'amostras orgânicas não catalogadas'."
          },
          {
            "pericia": "Furtividade",
            "ct_dt": 8,
            "informacao_revelada": "O jogador que estiver nos computadores precisa passar neste teste caso um enfermeiro passe no corredor externo, tendo de se abaixar rapidamente sob a mesa azul para não ser detetado através do vidro."
          },
          {
            "pericia": "Mente",
            "ct_dt": 6,
            "informacao_revelada": "Teste de sanidade ao ler os e-mails da médica, onde ela descreve com fascínio científico como o lodo negro estava a substituir os tecidos mortos de Sara, mantendo-a viva como um parasita."
          }
        ],
        "notas_mestre": "É aqui que a conspiração médica é revelada. A Dra. Melissa não estava a tentar curar Sara, estava a usá-la como incubadora para a entidade da floresta."
      },
      {
        "cabecalho": {
          "nome": "Os Tanques de Contenção Azuis (Laboratório Central)",
          "descricao_publica": "Em uma sala adjacente dentro do bloco central, existem dois grandes tanques ou cilindros circulares azuis conectados a tubulações pesadas. O painel de controle deles pisca com luzes de aviso."
        },
        "testes": [
          {
            "pericia": "Medicina / Química",
            "ct_dt": 6,
            "informacao_revelada": "Analisando os medidores, o jogador percebe que os tanques não contêm oxigênio ou fluidos hospitalares comuns. Eles estão a manter uma substância espessa e orgânica em temperatura controlada."
          },
          {
            "pericia": "Percepção",
            "ct_dt": 7,
            "informacao_revelada": "Olhando pelo visor de vidro de um dos tanques, o jogador vê o líquido escuro e pastoso lá dentro. É o mesmo lodo negro encontrado na Casa Auguil e no beco do Café."
          },
          {
            "pericia": "Ladinagem / Investigação",
            "ct_dt": 7,
            "informacao_revelada": "Abrir um compartimento refrigerado ao lado dos tanques permite recolher uma seringa carregada com esse lodo (que pode ser usada como prova física irrefutável contra a clínica)."
          }
        ],
        "notas_mestre": "Este PDI liga a clínica diretamente aos eventos sobrenaturais. Eles estão literalmente a cultivar ou a armazenar a essência da Podridão em ambiente hospitalar."
      },
      {
        "cabecalho": {
          "nome": "O Leito com Alerta Biológico (Corredor Direito)",
          "descricao_publica": "No corredor da ala direita, há alguns quartos com um grande triângulo vermelho de Risco Biológico colado no chão da entrada. A cama do quarto mais ao norte está desarrumada e vazia, os lençóis manchados, e as luzes dos monitores vitais estão desligadas."
        },
        "testes": [
          {
            "pericia": "Investigação",
            "ct_dt": 6,
            "informacao_revelada": "Examinar os lençóis revela que as manchas escuras não são de sangue, mas sim resíduos do lodo. Debaixo do travesseiro, encontra-se um desenho infantil e perturbador feito por Sara, mostrando Kali (a garota que Sara sacrificou na banheira)."
          },
          {
            "pericia": "Sobrevivência / Intuição",
            "ct_dt": 7,
            "informacao_revelada": "O jogador nota que os dutos de ventilação logo acima da cama foram forçados de dentro para fora. Sara (ou o que quer que ela se tenha tornado) não teve alta médica; ela escapou da clínica no meio da noite."
          }
        ],
        "notas_mestre": "Este foi o último quarto de Sara antes de ela fugir para cometer o sacrifício na sua própria casa. Encontrar os vestígios aqui confirma a linha do tempo e empurra os jogadores para o clímax inevitável: encontrá-la na Floresta."
      }
    ],
    "conexoes_saida": [
      {
        "area_id": "cafe-da-nevoa",
        "nome": "Café da Névoa",
        "gancho": "O diagnóstico de Sara foi enviado para o Café."
      },
      {
        "area_id": "casa-auguil",
        "nome": "Casa Auguil",
        "gancho": "O último rastro lógico de Sara após sua fuga."
      }
    ]
  },
  "casa-auguil": {
    "id": "casa-auguil",
    "nome": "Casa Auguil",
    "shortName": "Casa Auguil",
    "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"></path><polyline points=\"9 22 9 12 15 12 15 22\"></polyline></svg>",
    "themeClass": "area-casa-auguil",
    "district": "Bairro Residencial • Mina de Prata",
    "dangerLevel": "Isolamento Policial e Atividade Paranormal",
    "dangerLevelClass": "danger",
    "titulo_narrativo": "Entrada na Casa Auguil",
    "texto_narrativo": "\"A fechadura cede com um estalo abafado e vocês entram, deixando a noite fria e as fitas amarelas da polícia para trás. O ar dentro da Casa Auguil é pesado, denso e tem o gosto amargo de um lugar que foi trancado às pressas e abandonado. Quando vocês acendem as lanternas, os feixes de luz cortam a escuridão absoluta do térreo e revelam algo profundamente perturbador: a normalidade. A sala de estar está impecavelmente arrumada. Os móveis estão alinhados, as almofadas estão em seus lugares e o silêncio é tão espesso que vocês conseguem ouvir a respiração uns dos outros.\"",
    "resumo_atmosfera": "Uma moradia de dois andares de alto padrão, agora transformada em cena de crime. O exterior está isolado e envolto em dezenas de fitas policiais amarelas e pretas de 'Não Ultrapasse'. Durante o dia, viaturas e peritos da polícia bloqueiam o perímetro, tornando qualquer aproximação impossível. É apenas durante a calada da noite, quando as viaturas se retiram e a casa mergulha numa escuridão absoluta, que a oportunidade de infiltração surge. A atmosfera é pesada, cheirando a lodo e abandono.",
    "requisitos_acesso": "Acesso noturno furtivo contornando o isolamento policial; pode ser facilitado com o Molho de Chaves da Casa Auguil obtido com Elias.",
    "npcs_presentes": [],
    "pontos_de_interesse": [
      {
        "cabecalho": {
          "nome": "A Janela da Cozinha (Infiltração)",
          "descricao_publica": "Nas traseiras da casa, a janela da cozinha encontra-se meio aberta. Não há fitas da polícia aqui, mas o quintal está escuro e coberto de folhas secas."
        },
        "testes": [
          {
            "pericia": "Ladinagem / Crime",
            "ct_dt": 6,
            "informacao_revelada": "Forçar a tranca da janela basculante de forma limpa para abrir passagem suficiente sem quebrar o vidro."
          },
          {
            "pericia": "Furtividade",
            "ct_dt": 7,
            "informacao_revelada": "Necessário se os jogadores tentarem entrar pela frente ou pelos fundos sem alertar os vizinhos. A casa está sob investigação, e qualquer luz de lanterna muito forte pode chamar a atenção de patrulhas."
          },
          {
            "pericia": "Sem Teste (Uso de Item)",
            "ct_dt": "-",
            "informacao_revelada": "Se utilizarem o \"Molho de Chaves da Casa Auguil\" obtido com Elias, abrem a porta da frente ou dos fundos silenciosamente e sem qualquer risco."
          }
        ],
        "notas_mestre": "Este ponto define como os jogadores entram. O silêncio inicial da casa é propositado para contrastar com a tensão do que vão encontrar no andar superior e com a fuga barulhenta que terão de fazer no final."
      },
      {
        "cabecalho": {
          "nome": "O Tapete da Escada (O Rastro)",
          "descricao_publica": "A escada de madeira que liga a sala ao corredor do segundo andar é forrada por um tapete que outrora foi claro. Agora, está imundo. O silêncio na casa é quebrado apenas pelo ranger dos degraus sob o peso dos jogadores."
        },
        "testes": [
          {
            "pericia": "Investigação",
            "ct_dt": 6,
            "informacao_revelada": "Permite analisar as manchas escuras no tapete de perto. Os jogadores percebem que, nos primeiros degraus, as manchas têm o formato perfeito de patas de um gato grande. Contudo, à medida que a escada sobe, as pegadas distorcem-se, derretem e transformam-se nas pegadas pesadas e arrastadas de lodo de um humanoide deformado."
          },
          {
            "pericia": "Sobrevivência / Rastrear",
            "ct_dt": 7,
            "informacao_revelada": "O jogador percebe que as pegadas não indicam alguém a descer. O que quer que tenha subido, nunca mais voltou para o andar de baixo. A ameaça ainda está no segundo piso."
          }
        ],
        "notas_mestre": "Esta é a principal construção de tensão do cenário. Confirma aos jogadores que a entidade parasitou o gato e depois mudou de forma. Prepara o estado mental do grupo para o combate iminente."
      },
      {
        "cabecalho": {
          "nome": "A Mesa de Sara (A Escrivaninha no Quarto)",
          "descricao_publica": "O quarto de Sara é um reflexo de uma mente em colapso. A escrivaninha encostada à parede é um caos absoluto de cadernos rasgados, pratos com restos de comida e canetas partidas. No centro deste desastre, três coisas destacam-se imediatamente à luz das lanternas."
        },
        "testes": [
          {
            "pericia": "Sem Teste (Interação Automática)",
            "ct_dt": "-",
            "informacao_revelada": "Os jogadores avistam imediatamente os três itens centrais:\n\n• O Diário de Sara (que dita que \"a porta precisa de carne para girar a chave\").\n• A Poção Solar de Cura (frasco dourado que cura 1d8).\n• O Notebook de Sara (ligado, bloqueado por senha, mas com o botão \"Acesso Rápido: Câmaras de Segurança\" disponível)."
          },
          {
            "pericia": "Investigação",
            "ct_dt": 7,
            "informacao_revelada": "Vasculhando com cuidado as gavetas e as pilhas de papel no escuro. Se passarem, encontram dois itens fora do comum soterrados: o Livro Infantil \"O Viajante e a Terra\" e a Caixa Negra e Dourada selada."
          },
          {
            "pericia": "Tecnologia (Falha Automática)",
            "ct_dt": "-",
            "informacao_revelada": "Tentar hackear a senha do Notebook falha. Apenas a interface das câmaras está acessível."
          }
        ],
        "notas_mestre": "É crucial que encontrem a poção antes do combate (para terem hipótese contra o Zumbi). A interação com o Notebook deve ser apresentada aqui, mas o seu uso definitivo e aterrante (a falha de sinal e a chegada de Constança) só ocorre após o combate na banheira."
      },
      {
        "cabecalho": {
          "nome": "A Banheira de Porcelana (O Clímax)",
          "descricao_publica": "A porta do quarto de banho adjacente ao quarto de Sara está entreaberta. O cheiro de água podre, esgoto e cobre (sangue) atinge os jogadores como um soco. Lá dentro, a banheira de porcelana branca está transbordar de uma água densa, negra e imóvel, como piche líquido."
        },
        "testes": [
          {
            "pericia": "Percepção",
            "ct_dt": 8,
            "informacao_revelada": "Ao aproximarem-se da porta do quarto de banho, permite notar que a superfície da água preta na banheira vibrou ligeiramente, não devido a passos, mas como se algo denso estivesse a respirar submerso. Evita que o grupo sofra um ataque surpresa."
          },
          {
            "pericia": "Iniciativa (Combate Automático)",
            "ct_dt": "-",
            "informacao_revelada": "Assim que entrarem no raio de alcance ou tocarem na água, o Zumbi de Lodo (Cadáver de Kali) ergue-se violentamente da banheira, iniciando o combate final da sessão."
          },
          {
            "pericia": "Sem Teste (Pós-Combate)",
            "ct_dt": "-",
            "informacao_revelada": "Com o monstro morto e o lodo a escoar pelo ralo da banheira, os jogadores encontram automaticamente o Laço Rosa de Kali preso no metal, confirmando o sacrifício."
          }
        ],
        "notas_mestre": "Após encontrarem o Laço Rosa e a tensão baixar momentaneamente, deve ativar o gatilho sonoro da Porta da Frente a abrir-se no andar de baixo. Se os jogadores correrem para ver as câmaras no Notebook, verão a figura encapuzada de Constança a subir as escadas antes de o ecrã falhar em estática, dando início à fuga desesperada."
      }
    ],
    "conexoes_saida": [
      {
        "area_id": "cafe-da-nevoa",
        "nome": "Café da Névoa",
        "gancho": "Onde Sara trabalhava e de onde Elias guarda as chaves da casa."
      },
      {
        "area_id": "colegio-primordio",
        "nome": "Colégio Integrado Primórdio",
        "gancho": "O local de estudo de Sara."
      },
      {
        "area_id": "floresta-proibida",
        "nome": "A Mata do Norte",
        "gancho": "Para onde Sara fugiu em direção ao sacrifício."
      },
      {
        "area_id": "pavilhao-abandonado",
        "nome": "Pavilhão de Acolhimento Abandonado",
        "gancho": "Anexo clandestino na divisa com a floresta."
      }
    ]
  },
  "pavilhao-abandonado": {
    "id": "pavilhao-abandonado",
    "nome": "Pavilhão de Acolhimento Abandonado",
    "shortName": "Pavilhão Abandonado",
    "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 21h18\"></path><path d=\"M5 21V7l7-4 7 4v14\"></path><path d=\"M9 10a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v11H9V10z\"></path><line x1=\"9\" y1=\"21\" x2=\"9\" y2=\"14\"></line><line x1=\"15\" y1=\"21\" x2=\"15\" y2=\"14\"></line></svg>",
    "themeClass": "area-pavilhao-abandonado",
    "district": "Divisa entre a Mata do Norte e o Subúrbio • Fragktus",
    "dangerLevel": "Zona de Investigação / Perigo Baixo",
    "dangerLevelClass": "warning",
    "resumo_atmosfera": "Um antigo anexo de reabilitação juvenil desativado há décadas, engolido pela vegetação densa na divisa entre a Mata do Norte e o subúrbio de Fragktus.\n\nCondições de Ambiente: Escuridão - Personagens que não possuem visão noturna, recebem -1 em testes de percepção e investigação.",
    "requisitos_acesso": "Acessos do Pavilhão:\n• Janela Quebrada (Lateral): Entrada de emergência vinda da orla da floresta.\n• Porta Principal (Frente): Trancada por fora com correntes pesadas e cadeado enferrujado (Força DT 9 ou Crime DT 8 para abrir por dentro, mas faz muito barulho).\n• Galeria de Escoamento (Subsolo): Saída furtiva que dá acesso às tubulações de drenagem e leva de volta às ruas traseiras da cidade.",
    "npcs_presentes": [],
    "pontos_de_interesse": [
      {
            "cabecalho": {
                  "nome": "A Pilha de Panfletos e o Mural (Corredor de Entrada)",
                  "descricao_publica": "Local no Mapa: Na entrada superior esquerda, espalhados pelo chão e nas escadas de acesso ao mezanino.\n\nO chão está úmido de goteiras e coberto por dezenas de cartazes arrancados dos postes da cidade e empilhados num canto, como se alguém estivesse limpando os arredores da mata para abafar as buscas."
            },
            "testes": [
                  {
                        "pericia": "Sem Teste (Frente do Cartaz)",
                        "ct_dt": "-",
                        "informacao_revelada": "Evidência Encontrada (Frente do Cartaz):\nPROCURA-SE\n• Nome: Kali (Idade aparente: 9 a 11 anos)\n• Descrição: Akivus, cabelos castanhos curtos, olhos expressivos e usa um tapa-olho no olho direito. Blusa de frio simples, vista pela última vez com laço de cabelo rosa.\n• Último Visto: Nas proximidades da trilha do bosque da Mata do Norte."
                  },
                  {
                        "pericia": "Investigação",
                        "ct_dt": 6,
                        "informacao_revelada": "Pista Desbloqueada (Verso do Cartaz — Tinta Roxa):\nNo verso de um dos panfletos, há anotações feitas à mão com uma caneta de tinta roxa (a mesma cor de tinta do bilhete no armário de Sara no EP 1), sem nenhuma assinatura:\n• \"Terça-feira (14:15) — Saiu da aula antes dos outros. Caminha sozinha pela orla da mata.\"\n• \"Quinta-feira (14:10) — O mesmo trajeto. Ninguém a acompanha. O bosque está silencioso neste horário.\"\n• \"Conclusão: Perfeita para a passagem. O cordeiro está pronto para a Porta de Sara.\""
                  }
            ],
            "notas_mestre": "Recompensa / Pista: Panfleto Anotado de Kali (Prova que a criança não foi uma vítima acidental, mas sim vigiada e selecionada para a passagem). A tinta roxa é o elemento que aponta para a diretora Constança."
      },
      {
            "cabecalho": {
                  "nome": "O Círculo de Cadeiras e os Relatos (Centro do Galpão)",
                  "descricao_publica": "Local no Mapa: O círculo central de cadeiras cercado por caixotes, com velas derretidas no chão e papéis espalhados sobre a mesa do mezanino.\n\nNove cadeiras velhas dispostas em círculo no centro do concreto rachado, iluminadas por restos de velas ainda quentes. Ao redor e sobre as bancadas, há diários rasgados, prontuários médicos amassados e recortes de jornais antigos. Não há nenhum documento formal que identifique o dono do local."
            },
            "testes": [
                  {
                        "pericia": "Investigação",
                        "ct_dt": 7,
                        "informacao_revelada": "O Padrão das Vítimas: Todos os jovens que frequentavam aquela roda passavam por tragédias reais e irreversíveis: Sara tinha câncer; outros sofriam de doenças degenerativas sem cura, abandonos severos ou perdas familiares brutais. Quem comanda o círculo seleciona apenas jovens que já estão no limite do sofrimento físico ou mental."
                  },
                  {
                        "pericia": "Ocultismo",
                        "ct_dt": 7,
                        "informacao_revelada": "A Regra da Caixa: Entre os rascunhos de doutrinação sobre o \"Jardim Dele\", uma anotação aparece repetida várias vezes: \"A Caixa só se abre para aqueles cujo tempo na Terra já está condenado.\""
                  }
            ],
            "notas_mestre": "Pistas Desbloqueadas:\n• O Padrão das Vítimas: Todos os jovens que frequentavam aquela roda passavam por tragédias reais e irreversíveis: Sara tinha câncer; outros sofriam de doenças degenerativas sem cura, abandonos severos ou perdas familiares brutais. Quem comanda o círculo seleciona apenas jovens que já estão no limite do sofrimento físico ou mental.\n• A Regra da Caixa: Entre os rascunhos de doutrinação sobre o \"Jardim Dele\", uma anotação aparece repetida várias vezes: \"A Caixa só se abre para aqueles cujo tempo na Terra já está condenado.\""
      },
      {
            "cabecalho": {
                  "nome": "A Gaveta Emperrada — Gravador de Fita #01 (Mezanino Esquerdo)",
                  "descricao_publica": "Local no Mapa: Na mesa de ferro posicionada na passarela elevada à esquerda.\n\nUma escrivaninha de metal enferrujada com a gaveta central travada pela umidade."
            },
            "testes": [
                  {
                        "pericia": "Força (Arrancar no Tranco)",
                        "ct_dt": 7,
                        "informacao_revelada": "Força a gaveta com impacto físico e solta o trilho empenado, revelando o Gravador de Fita Antigo #01 (\"A Exigência da Passagem\")."
                  },
                  {
                        "pericia": "Crime / Destreza (Destravar Trilho)",
                        "ct_dt": 6,
                        "informacao_revelada": "Manipula o trilho corroído com delicadeza, abrindo a gaveta silenciosamente e obtendo o Gravador de Fita Antigo #01 (\"A Exigência da Passagem\")."
                  },
                  {
                        "pericia": "Audição da Fita (Transcrição Completa)",
                        "ct_dt": "-",
                        "informacao_revelada": "[O botão 'Play' afunda com um estalo. Som de goteiras no galpão escuro. Ouve-se uma respiração curta, chiada, e o barulho metálico da Caixa Negra já destrancada no colo de Sara]\n\n— Voz da Mulher (calma, solene, com uma autoridade mansa e inquestionável): \"Muito bem, Sara. Olhe para ela aberta no seu colo. A primeira parte acabou. O seu espírito finalmente soltou as amarras deste mundo. Você já não pertence mais a esta vida.\"\n\n— Sara (demora segundos para responder; voz arrastada, oca, de quem já está com a mente completamente derretida): \"...Já posso ir? Nas árvores... eu já posso passar?\"\n\n— Voz da Mulher: \"Ainda não, minha querida. A chave está na sua mão, mas a Porta não se abre para quem chega de mãos vazias. Como eu lhe disse desde o primeiro dia... a dor que nós sentimos aqui fora nos esvazia. Olhe para você: o sofrimento secou tudo o que havia aí dentro. E Ele não aceita cascas vazias no Jardim.\"\n\n— Sara (um murmúrio confuso, lento, quase infantil): \"Vazia... Eu tô vazia. Mas... o que que falta?\"\n\n— Voz da Mulher (o tom fica mais baixo, frio e dogmático): \"A ordem Dele para a passagem é clara, Sara. Antes de cruzar o arco, você deve tomar para dentro de si uma vida que ainda esteja cheia. Você precisa abater o cordeiro e consumir da sua carne ainda quente.\"\n\n— Sara (pausa longa no escuro; a respiração falha um pouco): \"...Comer? Mas... por quê?\"\n\n— Voz da Mulher: \"Porque é a vontade Dele para que a travessia se cumpra. Não cabe a nós questionar o rito, menina, apenas obedecer. As pessoas lá fora passam a vida inteira engolindo remédios amargos, suportando humilhações e agonizando em camas de hospital em troca de nada... Você vai recusar um único ato sagrado em troca da eternidade sem dor? Quando você engolir aquela carne, a centelha que falta ficará guardada dentro de você. Só assim Ele a reconhecerá quando a Porta abrir.\"\n\n— Sara (um silêncio pesado; depois, uma voz completamente submissa e anestesiada): \"...Se Ele mandou... então eu faço. Só quero que pare de doer.\"\n\n— Voz da Mulher (num sussurro acariciante): \"Eu sabia que você estava pronta. Amanhã, às duas e quinze, na beira do bosque. Ela passa sozinha. Cumpra o que Ele pediu... e o seu descanso estará esperando.\"\n\n— Sara (num sopro quase inaudível): \"...Duas e quinze. Como Ele pediu...\"\n\n[Clique seco desligando o aparelho]"
                  }
            ],
            "notas_mestre": "Item Encontrado: Gravador de Fita Antigo #01 (\"A Exigência da Passagem\"). A fita prova a manipulação direta e fria de Sara pela Voz da Mulher (Constança), ordenando o sacrifício e consumo da carne de Kali para a travessia da Porta."
      },
      {
            "cabecalho": {
                  "nome": "As Mochilas Mofadas — Gravador de Fita #02 (Caixotes Centrais)",
                  "descricao_publica": "Local no Mapa: Escondido entre as pilhas de caixotes de madeira e mochilas velhas ao redor do círculo de cadeiras.\n\nPertences deixados para trás por outros adolescentes que frequentavam o galpão. No fundo de uma mochila rasgada, há um gravador de bolso branco com a tampa presa por fita adesiva."
            },
            "testes": [
                  {
                        "pericia": "Vasculhar Caixotes (Automático ou Percepção / Investigação)",
                        "ct_dt": 6,
                        "informacao_revelada": "Localiza a mochila rasgada e extrai o Gravador de Bolso #02 (\"Por Trás da Máscara\")."
                  },
                  {
                        "pericia": "Audição da Fita (Sara e Bia)",
                        "ct_dt": "-",
                        "informacao_revelada": "[Chiado de fita. Som de chuva fina batendo nas telhas quebradas. Ouve-se o som de Sara balançando o corpo para frente e para trás numa cadeira de madeira que range sem parar]\n\n— Bia (voz jovem, cansada, puxando um caixote para sentar perto): \"Sara? Achei que todo mundo já tinha vazado... Vai ficar aí no escuro até que horas?\"\n\n— Sara (voz baixa, monótona, sem parar de balançar): \"...Só esperando dar amanhã.\"\n\n— Bia (suspira fundo, acendendo um isqueiro só pra fazer luz por um segundo): \"Quem dera eu tivesse pressa pra chegar amanhã. Só de pensar em voltar pra casa, ver meu pai chorando pelos cantos e tomar aquela droga de soro na clínica, já dá vontade de sumir. Às vezes eu fico ouvindo ela falar aqui na roda e penso que a gente é muito idiota mesmo de continuar insistindo nessa vida... Mas sei lá, uma coisa ainda me dá nervoso. Por que ela nunca tira aquela máscara na frente da gente? Se a gente tá todo mundo no mesmo barco, pra que esconder a cara?\"\n\n— Sara (um murmúrio lento, oco, quase sem expressão): \"Ela tirou... Hoje ela me mostrou.\"\n\n— Bia (para na hora; a voz muda, cheia de surpresa e curiosidade): \"Não brinca. Sério? Quando o resto do pessoal saiu? E quem é ela, Sara? A gente conhece da rua?\"\n\n— Sara (com uma calma bizarra, olhando pro vazio): \"Todo mundo conhece... Mas ela disse que rosto é só casca. Só serve pra quem vai ficar aqui. Quando a caixa abriu, ela tirou.\"\n\n— Bia (inclinando-se para perto, impressionada ao olhar para o colo de Sara): \"...A tampa abriu mesmo. Você conseguiu destrancar... Mas me fala logo quem é ela, Sara, não me deixa curiosa.\"\n\n— Sara (ignorando a pergunta sobre o rosto, num tom arrastado e anestesiado): \"Não faz diferença... Ainda falta uma coisa. Ele não deixa passar vazia. Ela disse que eu tenho que fazer o que Ele mandou amanhã.\"\n\n— Bia: \"Ué, mas já não tá com a chave aí na mão? Que que falta fazer?\"\n\n— Sara: \"A passagem... Às duas e quinze, no bosque. Tenho que pegar uma menina que passa lá... e comer a carne enquanto tá quente.\"\n\n— Bia (silêncio de uns três segundos; ela solta o ar devagar, achando bizarro, mas sem entrar em pânico): \"...Comer carne de gente? Pesado isso aí... Você não acha meio estranho Ele pedir um negócio desses?\"\n\n— Sara (apática, quase infantil): \"É a ordem Dele pra abrir a Porta... Lá fora o hospital corta a gente, queima a gente por dentro e não resolve nada. Pelo menos isso... é uma vez só. E depois acaba.\"\n\n— Bia (fica pensativa, a voz baixando num tom melancólico e honesto): \"É... pensando por esse lado, você não tá errada. A gente apanha todo dia de graça mesmo. Sinceramente, Sara? Eu nem julgo você. Se a caixa tivesse aberto pra mim hoje, acho que eu também faria qualquer coisa que mandassem só pra não sentir mais dor.\"\n\n— Sara (vira o rosto devagar na direção dela no escuro): \"...E por que não abriu pra você?\"\n\n— Bia (um riso fraco, cansado, olhando pro chão): \"Sei lá. Acho que lá no fundo eu ainda sou ingênua. Ainda fico esperando acontecer algum milagre, ou ter um dia bom antes de apagar de vez... Mesmo sabendo que é só ilusão e que amanhã vai doer tudo de novo. Você pelo menos teve coragem de largar mão logo.\"\n\n— Sara (voltando a olhar para o nada, a cadeira rangendo): \"Cansa esperar... Eu só quero silêncio.\"\n\n— Bia (levantando do caixote devagar e batendo a poeira da calça): \"Eu sei. Vai dar tudo certo amanhã no bosque, Sara. Tomara que esse Jardim seja bom mesmo... Se eu não aguentar mais essa situação aqui fora, qualquer dia desses eu abro a próxima caixa e vou atrás de você. Boa sorte lá.\"\n\n— Sara (num sopro quase inaudível): \"...Tchau, Bia.\"\n\n[Som dos passos calmos de Bia saindo na chuva. A fita continua rodando no escuro com o barulho constante da cadeira da Sara rangendo — nhec, nhec — até o áudio cortar]"
                  }
            ],
            "notas_mestre": "Item Encontrado: Gravador de Bolso #02 (\"Por Trás da Máscara\"). Revela que Sara viu o rosto da líder mascarada (\"todo mundo conhece\"), confirmando que a responsável é uma figura pública e influente de Fraguiktos."
      },
      {
            "cabecalho": {
                  "nome": "O Canto do Mercador — Igris (Fundo Direito / Caixotes)",
                  "descricao_publica": "Local no Mapa: Sentado sobre as caixas de madeira na lateral direita ou na ponta sul do mezanino, surgindo após o grupo investigar a sala.\n\nUm homem de presença silenciosa organizando mercadorias sobre um pano aberto no escuro, completamente indiferente ao perigo lá fora."
            },
            "testes": [
                  {
                        "pericia": "Diálogo Enigmático",
                        "ct_dt": "-",
                        "informacao_revelada": "Nunca responde perguntas de forma direta; fala apenas por enigmas curtos sobre \"mãos que já não têm nada a perder\" e \"a carne faminta nos túneis abaixo\"."
                  },
                  {
                        "pericia": "Comércio Mercante",
                        "ct_dt": "-",
                        "informacao_revelada": "Permite aos jogadores gastarem seus Vidrilhos para comprar itens de cura, redutores de estresse, lanternas ou armas improvisadas antes de descerem para o esgoto. Desaparece sem deixar rastro assim que o grupo vira as costas."
                  }
            ],
            "notas_mestre": "Interação e Comércio: Nunca responde perguntas de forma direta; fala por enigmas sobre \"mãos que já não têm nada a perder\" e \"a carne faminta nos túneis abaixo\". Permite comprar itens de cura, lanternas ou armas improvisadas usando Vidrilhos antes de descerem para a drenagem."
      },
      {
            "cabecalho": {
                  "nome": "A Grade de Escoamento (Canto Inferior Esquerdo)",
                  "descricao_publica": "Local no Mapa: A grande grade quadrada de ferro enferrujado cercada por lodo e água suja na parte inferior esquerda do mapa.\n\nCom a porta principal acorrentada por fora e vigiada pela Figura Mascarada na mata, a tubulação de drenagem subterrânea é a única rota de fuga de volta para as ruas de Fraguiktos."
            },
            "testes": [
                  {
                        "pericia": "Mecânica da Grade (Fuga)",
                        "ct_dt": "-",
                        "informacao_revelada": "A grade está emperrada pelo lodo e ferrugem, exigindo que alguém se aproxime fisicamente para puxá-la e abrir a passagem de drenagem subterrânea."
                  },
                  {
                        "pericia": "Evento Roteirizado (O Gatilho da Praga)",
                        "ct_dt": "-",
                        "informacao_revelada": "Ao puxarem a grade pesada para abrir passagem, o Rato Carniceiro Portador da Praga salta da tubulação seca em emboscada veloz."
                  },
                  {
                        "pericia": "Alvo Fixo (Ataque a Minerva)",
                        "ct_dt": "-",
                        "informacao_revelada": "A criatura avança diretamente em Minerva (Incisivos Pestilentos), causando 1d4 de dano perfurante aparentemente superficial, mas transmitindo silenciosamente a Praga para a corrente sanguínea dela."
                  }
            ],
            "notas_mestre": "Ameaça Local (Encontro do PDI #06):\nRATO CARNICEIRO (PORTADOR DA PRAGA) [ Criatura Pequena / Besta Infectada ]\n• PV: 12 | Defesa: 6 | Iniciativa: Alta (Age primeiro na emboscada contra Minerva)\n• Passiva — Sangue Pestilento: O corpo do animal está tomado por caroços cinzentos e veias arroxeadas. Qualquer ataque corpo a corpo que o mate espalha sangue escuro e fétido no chão (sem efeito de contágio pelo ar, apenas por mordida direta).\n• Ação — Incisivos Pestilentos (Corpo a Corpo): Avança ferozmente no alvo mais próximo da grade (Minerva), causando 1d4 de dano perfurante e aplicando silenciosamente a condição oculta Portador da Praga (Incubação)."
      }
],
    "conexoes_saida": [
      {
        "area_id": "floresta-proibida",
        "nome": "A Mata do Norte",
        "gancho": "Fuga ou acesso pela orla da floresta."
      },
      {
        "area_id": "casa-auguil",
        "nome": "Casa Auguil",
        "gancho": "Tubulações que retornam às ruas do subúrbio."
      },
      {
        "area_id": "galerias-escoamento",
        "nome": "As Galerias de Escoamento",
        "gancho": "Descida subterrânea pela grade de drenagem."
      }
    ]
  },
  "galerias-escoamento": {
    "id": "galerias-escoamento",
    "nome": "As Galerias de Escoamento (Esgoto de Fraguiktos)",
    "shortName": "Galerias de Escoamento",
    "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"></rect><path d=\"M3 9h18\"></path><path d=\"M3 15h18\"></path><path d=\"M9 3v18\"></path><path d=\"M15 3v18\"></path></svg>",
    "themeClass": "area-galerias-escoamento",
    "district": "Rede de Esgoto Pluvial e Sanitário • Subúrbio de Fraguiktos",
    "dangerLevel": "Zona Subterrânea / Isolamento Fétido",
    "dangerLevelClass": "danger",
    "resumo_atmosfera": "Ao descerem pela grade quebrada, o cheiro pesado de esgoto, lodo podre e umidade velha atinge o nariz de vocês na hora. O túnel é baixo, abafado e escuro, feito de blocos de pedra sujos de limo preto. Pelo meio da galeria corre uma vala de água esverdeada, grossa e parada, cheia de lixo boiando e tábuas de madeira velhas jogadas por cima para servir de passagem. O único som é o pinga-pinga constante de infiltração no teto, o eco dos passos de vocês na pedra molhada e o barulho de água correndo nos canos enferrujados das paredes.\n\nCondições de Ambiente: Mau Cheiro Asfixiante e Escuridão - Testes que dependam de olfato ou concentração sofrem Desvantagem sem proteção nasal.",
    "requisitos_acesso": "Acessos das Galerias:\n• Grade Quebrada do Pavilhão (Norte): Entrada subterrânea a partir do subsolo do Pavilhão de Acolhimento Abandonado.\n• Vala Central e Passarelas: Travessia sobre tábuas de madeira podre e concreto limoso.\n• Escada de Saída do Bueiro (Sul/Leste): Saída de emergência para as ruas do subúrbio a duas quadras do Pavilhão Abandonado.",
    "npcs_presentes": [],
    "pontos_de_interesse": [
      {
        "cabecalho": {
          "nome": "A Vala Central e o Cruzamento de Água Suja (Topo / Centro do Mapa)",
          "descricao_publica": "Local no Mapa: O canal comprido de água esverdeada que desce do norte e corta o mapa até o sul, com passarelas estreitas de concreto nas bordas e tábuas de madeira podre atravessadas por cima.\n\nUm esgoto comum e imundo. A água turva carrega sacolas rasgadas, garrafas velhas, folhas apodrecidas vindas da mata e lama escura acumulada nos cantos."
        },
        "testes": [
          {
            "pericia": "Percepção ou Sobrevivência",
            "ct_dt": 6,
            "informacao_revelada": "• Pegadas no Lodo: No meio da sujeira comum do esgoto e do barro nas passarelas laterais, há pegadas recentes de sapatos que não são de trabalhadores de manutenção — alguém desce ali embaixo com frequência e caminha sempre na direção das salas laterais secas.\n\n• Cobaias Cirúrgicas: Presos numa grade enferrujada dentro da água suja do cruzamento, há restos de pequenos animais de rua (ratos e pombos) que não morreram afogados: estão abertos com cortes retos e limpos, como se alguém os tivesse usado para testar cortes cirúrgicos ali mesmo e jogado na vala."
          }
        ],
        "notas_mestre": "Indica movimentação frequente no subterrâneo e os testes anatômicos prévios antes do abate ritual."
      },
      {
        "cabecalho": {
          "nome": "A Sala de Tubulação (Sala Iluminada — Meio-Esquerda)",
          "descricao_publica": "Local no Mapa: A plataforma quadrada de pedra à esquerda da vala, onde há um cano grosso na parede, alguns barris velhos de manutenção e uma lâmpada amarela/laranja fraca acesa perto de uma válvula vermelha.\n\nUma área técnica comum do esgoto, usada originalmente para controlar a pressão dos canos do bairro. O chão de cimento está seco, mas sujo de poeira e graxa. Alguém puxou um fio clandestino para manter a lâmpada da parede acesa e usou o topo dos barris enferrujados como mesa improvisada para deixar papéis e cadernos longe da água suja."
        },
        "testes": [
          {
            "pericia": "Investigação ou Ocultismo",
            "ct_dt": 7,
            "informacao_revelada": "Pistas Desbloqueadas (Os Cadernos de Estudo sobre \"Ele\"):\n\n• Por que comer a carne (Anotações em Tinta Roxa):\nDentro de uma pasta plástica suja em cima dos barris, há folhas escritas à mão (com a mesma caneta de tinta roxa do cartaz lá de cima). O texto trata o ritual de Sara de forma totalmente fria e calculista, explicando o verdadeiro motivo da ordem de devorar alguém:\n\n\"Anotação #14: Os jovens do Pavilhão abrem as Caixas facilmente porque já desistiram de viver, mas a doença e o sofrimento prolongado deixam suas almas fracas, quase sem Energia Astral. Quando passam pela Porta assim, Ele recebe muito pouco alimento.\"\n\n\"Anotação #19: A carne e o sangue de alguém saudável guardam energia astral limpa. Fazendo o escolhido matar uma vítima e engolir a carne quente antes de abrir a Porta, essa energia fica retida temporariamente dentro dele. Eles acreditam que estão cumprindo uma ordem sagrada Dele para merecer o descanso, sem saber que estão apenas engordando a própria energia interior para que Ele se alimente melhor quando atravessarem.\"\n\n• O Segredo da Caixa Negra:\nRascunhos mostram desenhos da Caixa Negra e Dourada e confirmam por que o grupo não conseguiu abri-la: a caixa não tem fechadura mecânica; ela só destranca quando tocada por alguém que carrega uma condenação real de morte no corpo e já perdeu qualquer esperança de futuro."
          }
        ],
        "notas_mestre": "Revela a verdade perturbadora do culto: o rito canibal serve para 'cevar' a alma condenada com energia astral limpa antes da passagem para alimentar 'Ele'."
      },
      {
        "cabecalho": {
          "nome": "O Depósito Velho de Manutenção (Sala de Madeira — Direita)",
          "descricao_publica": "Local no Mapa: O cômodo grande com piso de tábuas de madeira velha à direita do canal, cheio de barris encostados nas paredes, caixas de papelão/madeira no meio e uma escada de madeira quebrada que dava para o andar de cima.\n\nUm depósito subterrâneo comum, cheio de teias de aranha, cheiro de madeira mofada e barris vazios que antigamente guardavam produtos de limpeza da rede de água. No meio das caixas velhas perto da escada quebrada, há pertences escondidos por quem usa o esgoto."
        },
        "testes": [
          {
            "pericia": "Investigação (Caixas Abertas)",
            "ct_dt": 6,
            "informacao_revelada": "• Fichas Médicas Roubadas: Uma caixa de arquivo contém prontuários médicos reais tirados de hospitais e clínicas de Fraguiktos — incluindo os exames de câncer da Sara Auguil e de outros adolescentes do círculo (como a Bia). Quem lidera o culto usa esses arquivos para escolher a dedo jovens que vão morrer em breve.\n\n• Máscaras Sujas: Enroladas num pano velho, há duas máscaras lisas trincadas, sujas de barro seco."
          },
          {
            "pericia": "Crime (Estourar Cadeado)",
            "ct_dt": 7,
            "informacao_revelada": "• Itens Úteis (Na caixa com cadeado): Suprimentos guardados para emergências (2d4 Vidrilhos, kit de primeiros socorros básico ou lanterna/pilhas de reposição)."
          }
        ],
        "notas_mestre": "Prova o vazamento criminoso de prontuários médicos para seleção de jovens vulneráveis e fornece suprimentos de sobrevivência."
      },
      {
        "cabecalho": {
          "nome": "O Canto Desmoronado e a Estátua da Árvore (Canto Inferior Esquerdo)",
          "descricao_publica": "Local no Mapa: A salinha torta no canto inferior esquerdo, depois de um corredor estreito e escuro que sai da sala dos canos; o fundo tem o piso quebrado em meia-lua com velas no chão e uma escultura em forma de árvore seca/raízes.\n\nUm fim de túnel sem saída do esgoto, onde parte do concreto antigo cedeu. Ao contrário do resto da galeria comum, alguém limpou a lama desse canto e montou um altar improvisado no escuro: no chão de pedra úmida, cercada por tocos de velas derretidas, há uma estátua estranha esculpida na forma de uma Árvore retorcida e sem folhas."
        },
        "testes": [
          {
            "pericia": "Ocultismo ou Investigação",
            "ct_dt": 7,
            "informacao_revelada": "Pistas Desbloqueadas (O Estudo sobre a Árvore e \"Ele\"):\n\n• O que é a Estátua: A árvore é feita de madeira escura velha misturada com ferro retorcido e fios laranjas amarrados nos galhos. Preso na base da estátua, há um caderno aberto cheio de anotações de estudo sobre a relação entre \"Ele\" e as árvores da mata:\n\n\"O que os jovens chamam de 'Jardim' nos seus delírios é a própria extensão Dele. Ele não habita um céu; Ele cresce como uma raiz parasita entre os planos. Toda vez que uma Caixa é usada nas árvores do bosque, a Porta não leva ninguém para descansar — ela usa o corpo e a energia acumulada da vítima como semente para que as vinhas Dele atravessem para o nosso lado.\"\n\n• Amostra nas Raízes (Conexão com o Jornal da Parte 4): Preso num pote de vidro sujo aos pés da estátua da árvore, há um pedaço ressecado e morto de uma vinha de cor prateada (exatamente igual às vinhas prateadas que aparecerão no plantão de TV horas depois nos cadáveres de Paládium). Uma etiqueta no vidro diz apenas: \"Amostra recolhida após o evento de Paládium — A semente responde à mesma entidade.\""
          }
        ],
        "notas_mestre": "Conexão crucial com o horror biológico e cósmico: as caixas plantam vinhas prateadas parasitas nos corpos dos jovens para romper a barreira dimensional."
      },
      {
        "cabecalho": {
          "nome": "A Escada de Saída do Bueiro (Corredor Superior Direito ou Final do Canal)",
          "descricao_publica": "Local no Mapa: A escada de degraus de cimento no canto superior direito do mapa (ou a grade final no fim do canal de água lá embaixo).\n\nUma saída normal de manutenção do esgoto que sobe até uma tampa de bueiro pesada numa rua vazia a duas quadras do Pavilhão Abandonado, permitindo que o grupo saia do subterrâneo em segurança longe da Figura Mascarada."
        },
        "testes": [
          {
            "pericia": "Sem Teste / Ação de Saída",
            "ct_dt": "-",
            "informacao_revelada": "A tampa de ferro fundido dá acesso direto a um beco calmo na periferia de Fraguiktos. O ar fresco da noite alivia a náusea do esgoto e permite que o grupo reorganize seus passos após a fuga do subterrâneo."
          }
        ],
        "notas_mestre": "Ponto de extração seguro que conclui a fuga subterrânea do episódio longe da Figura Mascarada."
      }
    ],
    "conexoes_saida": [
      {
        "area_id": "pavilhao-abandonado",
        "nome": "Pavilhão Abandonado",
        "gancho": "Subida pela grade de drenagem quebrada."
      },
      {
        "area_id": "casa-auguil",
        "nome": "Casa Auguil",
        "gancho": "Ruas traseiras do subúrbio de Fraguiktos após a saída do bueiro."
      }
    ]
  }
};

  // ============================================================
  // 3. BANCO DE DADOS DE COLETÁVEIS E ITENS ENCONTRADOS
  // ============================================================
  const CAMPAIGN_COLETAVEIS = [
    {
      id: "col_mochila_abandonada",
      nome: "Mochila Escolar Abandonada",
      peso: 1,
      tipo: "Recipiente",
      campo_tipo: "Conteúdo",
      area: "A Mata do Norte",
      desbloqueado: false,
      resumo: "Uma mochila de lona escura, suja de terra úmida e exalando um leve cheiro de enxofre.",
      detalhe: "Contém um pequeno frasco de remédios vazio no bolso menor. No compartimento principal, há um caderno do Colégio Integrado Primórdio com o nome \"Sara Auguil\"; todas as páginas internas foram arrancadas na base do arame, restando apenas a capa dura."
    },
    {
      id: "col_frasco_analgesicos",
      nome: "Frasco de Analgésicos Vazio",
      peso: 0,
      tipo: "Objeto",
      campo_tipo: "Detalhe",
      area: "A Mata do Norte / Clínica Renovare",
      desbloqueado: false,
      resumo: "Um pequeno frasco de vidro âmbar arranhado.",
      detalhe: "O frasco não possui tampa e o interior contém um resíduo de pó branco grudado. A etiqueta de papel foi raspada com algum objeto pontiagudo, mas há um timbre em alto-relevo no próprio vidro onde se lê: \"Clínica Médica Renovare\"."
    },
    {
      id: "col_foto_armario",
      nome: "Foto do Armário",
      peso: 0,
      tipo: "Imagem",
      campo_tipo: "Detalhe",
      area: "Colégio Integrado Primórdio",
      desbloqueado: false,
      resumo: "Uma fotografia dobrada ao meio, com as bordas gastas e marcas de fita adesiva amarelada nos cantos.",
      detalhe: "A imagem mostra Sara sorrindo em um parque, abraçada com um garoto humano de cabelo castanho, vestindo uma roupa esportiva e de olhos pretos. O rosto de Sara na fotografia possui dezenas de pequenos furos, como se a ponta de uma caneta tivesse sido pressionada com força repetidas vezes contra o papel."
    },
    {
      id: "col_envelope_roxo",
      nome: "Envelope Roxo",
      peso: 0,
      tipo: "Documento",
      campo_tipo: "Conteúdo",
      area: "Colégio Integrado Primórdio",
      desbloqueado: false,
      resumo: "Um envelope pardo de alta gramatura, rompido na lateral e com restos de cera de selo escurecida.",
      detalhe: "Uma carta impressa em papel timbrado do colégio oferecendo \"auxílio financeiro integral\" para cobrir \"despesas médicas inoportunas\", sob a condição expressa no texto de que a polícia não fosse acionada. Assinada à mão com tinta roxa por \"Diretora Constança\"."
    },
    {
      id: "col_chaves_casa_auguil",
      nome: "Chaves da Casa Auguil",
      peso: 1,
      tipo: "Equipamento",
      campo_tipo: "Efeito",
      area: "Café da Névoa / Casa Auguil",
      desbloqueado: false,
      resumo: "Um chaveiro de metal pesado acompanhado por um pingente de casinha de madeira com a palavra \"Lar\".",
      detalhe: "Contém uma chave grande rústica, uma menor padrão e uma chave de cadeado. Abre as fechaduras correspondentes da residência Auguil."
    },
    {
      id: "col_laudos_clinicos",
      nome: "Laudos Clínicos",
      peso: 0,
      tipo: "Documento",
      campo_tipo: "Conteúdo",
      area: "Clínica Médica Renovare",
      desbloqueado: false,
      resumo: "Um envelope plastificado, rasgado na parte superior, contendo formulários médicos impressos.",
      detalhe: "Três folhas de exames. Há tabelas marcadas em vermelho para níveis de toxicidade no sangue. O laudo final possui a frase \"falência múltipla de órgãos\" e uma anotação manuscrita de \"estimativa de duas semanas de sobrevida\". Assinado por \"Dra. Melissa Vane\"."
    },
    {
      id: "col_cracha_acesso",
      nome: "Crachá de Acesso Magnético",
      peso: 0,
      tipo: "Acesso",
      campo_tipo: "Efeito",
      area: "Clínica Médica Renovare",
      desbloqueado: false,
      resumo: "Um cartão de PVC branco arranhado, com a foto 3x4 de um técnico de enfermagem e o logotipo da clínica.",
      detalhe: "Libera as travas eletrônicas das portas do Bloco Central e do Arquivo da Clínica Renovare."
    },
    {
      id: "col_seringa_lodo",
      nome: "Seringa de Lodo",
      peso: 1,
      tipo: "Amostra",
      campo_tipo: "Detalhe",
      area: "Clínica Médica Renovare (Bloco Central)",
      desbloqueado: false,
      resumo: "Uma seringa hospitalar de vidro grosso contendo um líquido negro e denso.",
      detalhe: "A seringa possui marcações de mililitros. O líquido no interior escorre de maneira anormalmente lenta quando inclinada, aderindo de forma espessa às paredes do vidro. A agulha de calibre grosso ainda possui uma gota negra cristalizada na ponta."
    },
    {
      id: "col_desenho_sara",
      nome: "Desenho de Sara",
      peso: 0,
      tipo: "Documento",
      campo_tipo: "Detalhe",
      area: "Casa Auguil (Quarto de Sara)",
      desbloqueado: false,
      resumo: "Um desenho feito à mão no verso de um receituário médico de papel fino e amassado.",
      detalhe: "O traço a lápis é forte e irregular, afundando o papel em algumas áreas. A ilustração central mostra uma figura escura e sem forma definida abraçando uma garotinha. A garotinha tem um único detalhe colorido: um laço pintado de rosa forte na cabeça."
    },
    {
      id: "col_pocao_solar",
      nome: "Poção Solar de Cura",
      peso: 1,
      tipo: "Consumível - 1 Dose",
      campo_tipo: "Efeito",
      area: "Café da Névoa",
      desbloqueado: false,
      resumo: "Um pequeno frasco de cristal arrolhado com cortiça. O líquido límpido no interior emite um brilho suave e um leve calor.",
      detalhe: "Com o fogo dourado solar, cura 1d8 de vida em quem for usado."
    },
    {
      id: "col_diario_sara",
      nome: "Diário de Sara",
      peso: 1,
      tipo: "Documento",
      campo_tipo: "Conteúdo",
      area: "Casa Auguil (Quarto de Sara)",
      desbloqueado: true,
      imagem: "assets/pagina_diario.png",
      resumo: "Um caderno espiral de capa escura encontrado na escrivaninha. Todas as folhas anteriores foram arrancadas, restando apenas uma única folha escrita à mão.",
      detalhe: "A porta precisa de carne para girar a chave."
    },
    {
      id: "col_laco_rosa",
      nome: "Laço Rosa",
      peso: 0,
      tipo: "Objeto",
      campo_tipo: "Detalhe",
      area: "Casa Auguil (Ralo da Banheira)",
      desbloqueado: false,
      resumo: "Um pequeno laço de cetim preso a um elástico de cabelo, exalando um forte cheiro de água estagnada.",
      detalhe: "O cetim rosa claro original está enrijecido e manchado de um tom escarlate muito escuro, coberto por resíduos lamacentos."
    }
      ,
    {
      id: "col_notebook_sara",
      nome: "Notebook de Sara",
      peso: 2,
      tipo: "Dispositivo Eletrónico",
      campo_tipo: "Efeito",
      area: "Casa Auguil (Quarto de Sara)",
      desbloqueado: true,
      resumo: "Um computador portátil moderno, com a carcaça ligeiramente arranhada e o ecrã a emitir um brilho pálido no quarto escuro.",
      detalhe: "O sistema operativo está bloqueado por uma palavra-passe desconhecida. No ecrã de bloqueio, existe apenas um atalho interativo e funcional rotulado como \"Acesso Rápido: Câmaras de Segurança\"."
    },
    {
      id: "col_livro_viajante_terra",
      nome: "Livro Infantil: \"O Viajante e a Terra\"",
      peso: 0,
      tipo: "Documento",
      campo_tipo: "Conteúdo",
      area: "Casa Auguil (Quarto de Sara)",
      desbloqueado: true,
      resumo: "Um livrinho de capa dura e colorida, muito bem conservado, que destoa completamente da bagunça e dos livros escolares da escrivaninha.",
      detalhe: "Um conto ilustrado de quatro páginas sobre uma criatura que desce do espaço para \"abençoar\" um povo doente, consumindo os seus sonhos e colocando o mundo inteiro num sono eterno. Clique em \"Ler Livro\" para folhear as 4 páginas ilustradas.",
      paginas: [
        {
          numero: 1,
          ilustracao: "Ilustração de uma estrela cadente escura",
          texto: "Veio do céu que não tem fim um Viajante bondoso. Ele viajava pelo escuro do espaço procurando uma casa que precisasse de luz e de cuidado."
        },
        {
          numero: 2,
          ilustracao: "Ilustração de um ser brilhante descendo numa floresta triste",
          texto: "Ele desceu nas árvores de uma terra cansada. O povo de lá estava doente, fraco e com medo. O Viajante abriu os braços e disse: 'Não chorem mais. Eu trago o presente da energia infinita'."
        },
        {
          numero: 3,
          ilustracao: "Ilustração do povo de mãos dadas com o Viajante",
          texto: "O povo ficou feliz e abriu as portas de suas casas para ele. O Viajante pediu que todos fechassem os olhos e lhe entregassem os seus sonhos, pois só ele poderia guardá-los de todo o mal."
        },
        {
          numero: 4,
          ilustracao: "Ilustração do Viajante cobrindo o planeta como um cobertor escuro",
          texto: "Eles entregaram. Então, o Viajante cresceu tanto que abraçou o mundo inteiro. E todos dormiram para sempre, bem quentinhos em seu abraço, em silêncio e em paz."
        }
      ]
    },
    {
      id: "col_cartaz_desaparecido",
      aliasId: "col_panfleto_anotado_kali",
      nome: "Cartaz de Desaparecido",
      peso: 0,
      tipo: "Documento",
      campo_tipo: "Evidência",
      imagem: "assets/kali_cartaz.png",
      area: "Pavilhão de Acolhimento Abandonado",
      desbloqueado: false,
      resumo: "Uma folha de papel sulfite tamanho A4, um pouco amarelada e amassada nas bordas devido à exposição ao clima. O topo traz em letras garrafais pretas o alerta PROCURA-SE. O verso foi totalmente utilizado como rascunho de vigilância em tinta roxa.",
      detalhe: "DESCRIÇÃO:\nTrata-se de uma folha de papel sulfite tamanho A4, um pouco amarelada e amassada nas bordas devido à exposição ao clima e ao tempo colada em postes e muros da cidade. O topo do papel traz em letras garrafais e pretas a palavra de alerta:\n\nPROCURA-SE\n• Nome: Kali (Sem sobrenome divulgado nos panfletos públicos)\n• Idade Aparente: Aprox. 9 a 11 anos\n• Descrição Física: Akivus, cabelos castanhos curtos, olhos expressivos e usa um tapa-olho no olho direito. Veste-se com uma blusa de frio simples e foi vista pela última vez usando um marcante laço de cabelo rosa.\n• Último Visto: Desaparecida desde a tarde do dia 01/08/2061, vista nas proximidades do bosque da Mata do Norte, nos limites do subúrbio de Fraguiktos.\n• Informações: “Se você viu qualquer coisa ou tem pistas sobre o paradeiro de Kali, por favor, entre em contato com as autoridades locais ou ligue para o número abaixo. A família oferece recompensa por qualquer pista real.”\n[Há um número de telefone rasurado à mão no rodapé da folha]\n\nO VERSO DO PANFLETO:\nAo virar o papel, é possível notar que o verso foi totalmente utilizado como rascunho de vigilância:\nAnotações à Margem (Tinta Roxa):\n• Terça-feira (14:15) — Saiu da aula antes dos outros. Caminha sozinha pela orla da mata.\n• Quinta-feira (14:10) — O mesmo trajeto. Ninguém a acompanha. O bosque está silencioso neste horário.\n• Conclusão: Perfeita para a transição. O sacrifício está pronto para a salvação da Proscrita."
    },
    {
      id: "col_panfleto_anotado_kali",
      nome: "Panfleto Anotado de Kali (Cartaz de Desaparecido)",
      peso: 0,
      tipo: "Documento",
      campo_tipo: "Evidência",
      imagem: "assets/kali_cartaz.png",
      area: "Pavilhão de Acolhimento Abandonado",
      desbloqueado: false,
      resumo: "Uma folha A4 com o alerta PROCURA-SE KALI e cronograma de vigilância em tinta roxa no verso.",
      detalhe: "Item idêntico ao Cartaz de Desaparecido, catalogado durante as buscas no Pavilhão de Acolhimento Abandonado."
    },
    {
      "id": "col_gravador_fita_01",
      "nome": "Gravador de Fita Antigo #01 (\"A Exigência da Passagem\")",
      "peso": 1,
      "tipo": "Gravação",
      "campo_tipo": "Áudio / Evidência",
      "area": "Pavilhão de Acolhimento Abandonado",
      "desbloqueado": false,
      "resumo": "Gravador de metal enferrujado resgatado da gaveta emperrada no mezanino esquerdo. Contém o registro da conversa entre a Voz da Mulher e Sara.",
      "detalhe": "Transcrição da Gravação:\n[Ouve-se a respiração curta e o barulho metálico da Caixa Negra destrancada no colo de Sara]\n• Voz da Mulher: \"Muito bem, Sara. Olhe para ela aberta no seu colo. A primeira parte acabou. O seu espírito finalmente soltou as amarras deste mundo.\"\n• Sara: \"...Já posso ir? Nas árvores... eu já posso passar?\"\n• Voz da Mulher: \"Ainda não, minha querida. A ordem Dele para a passagem é clara. Antes de cruzar o arco, você deve tomar para dentro de si uma vida que ainda esteja cheia. Você precisa abater o cordeiro e consumir da sua carne ainda quente.\"\n• Sara: \"...Se Ele mandou... então eu faço. Só quero que pare de doer.\"\n• Voz da Mulher: \"Amanhã, às duas e quinze, na beira do bosque. Ela passa sozinha. Cumpra o que Ele pediu... e o seu descanso estará esperando.\""
},
    {
      "id": "col_gravador_bolso_02",
      "nome": "Gravador de Bolso #02 (\"Por Trás da Máscara\")",
      "peso": 1,
      "tipo": "Gravação",
      "campo_tipo": "Áudio / Evidência",
      "area": "Pavilhão de Acolhimento Abandonado",
      "desbloqueado": false,
      "resumo": "Gravador de bolso branco com a tampa presa por fita adesiva, encontrado numa mochila mofada. Contém o diálogo íntimo entre Sara e Bia.",
      "detalhe": "Transcrição da Gravação:\n[Chiado de fita e chuva nas telhas quebradas. Sara balança o corpo na cadeira de madeira que range sem parar]\n• Bia: \"Por que ela nunca tira aquela máscara na frente da gente? Se a gente tá todo mundo no mesmo barco, pra que esconder a cara?\"\n• Sara: \"Ela tirou... Hoje ela me mostrou.\"\n• Bia: \"Não brinca. Sério? E quem é ela, Sara? A gente conhece da rua?\"\n• Sara: \"Todo mundo conhece... Mas ela disse que rosto é só casca. Só serve pra quem vai ficar aqui. Quando a caixa abriu, ela tirou.\"\n• Sara: \"A passagem... Às duas e quinze, no bosque. Tenho que pegar uma menina que passa lá... e comer a carne enquanto tá quente.\"\n• Bia: \"A gente apanha todo dia de graça mesmo... Vai dar tudo certo amanhã no bosque, Sara. Tomara que esse Jardim seja bom mesmo...\""
},
    {
      id: "col_caixa_negra_dourada",
      nome: "Caixa Negra e Dourada",
      peso: 1,
      tipo: "Artefacto Selado",
      campo_tipo: "Efeito",
      area: "Casa Auguil (Quarto de Sara)",
      desbloqueado: true,
      imagem: "assets/caixa.png",
      resumo: "Uma pequena caixa pesada de material desconhecido, negra como obsidiana e contornada por filetes de ouro puro que formam padrões geométricos.",
      detalhe: "A caixa encontra-se completamente selada. Qualquer tentativa de impacto, uso de força bruta, lâminas ou ferramentas de arrombamento falha automaticamente, sem deixar um único arranhão na superfície."
    },
    {
      id: "col_fita_01",
      nome: "Fita Espectral #01",
      peso: 0,
      tipo: "Relíquia Espectral",
      campo_tipo: "Áudio / Espectral",
      area: "Pavilhão de Acolhimento Abandonado",
      desbloqueado: true,
      resumo: "Uma fita cassete alaranjada, translúcida e espectral, que parece oscilar entre a realidade e o vazio. Ao aproximar o ouvido, sussurros frios e ecos de conversas passadas reverberam sem a necessidade de qualquer aparelho reprodutor.",
      detalhe: "A fita não tem peso físico e emite uma luminescência âmbar oscilante. O carretel magnético gira lentamente no ar mesmo sem qualquer gravador por perto. Vozes sobrepostas emergem da estática alaranjada: passos apressados no lodo, o som distante de uma mulher dando instruções solenes e sussurros apavorados repetindo: '...não olhe para trás, a travessia começou...'."
    },
    {
      id: "col_fita_02",
      nome: "Fita Espectral #02",
      peso: 0,
      tipo: "Relíquia Espectral",
      campo_tipo: "Áudio / Espectral",
      area: "Pavilhão de Acolhimento Abandonado",
      desbloqueado: true,
      resumo: "A segunda fita cassete alaranjada e transparente. Seu brilho espectral pulsa no ritmo de batimentos cardíacos distantes. Fragmentos nítidos de diálogos e interferências cósmicas vazam da fita sem que nenhum botão precise ser acionado.",
      detalhe: "A estática desta fita é mais agressiva, pontuada por estalos secos de interferência analógica. Entre os ruídos, ouve-se a respiração ofegante de quem foge pela mata fechada, galhos estalando e a voz de Sara num transe hipnótico sussurrando códigos e coordenadas que não pertencem ao mapa de Fraguiktos."
    },
    {
      id: "igris_balsamo_seiva",
      nome: "Bálsamo de Seiva Amarga",
      peso: 1,
      tipo: "Cura",
      estoque: 3,
      quantidade: 3,
      campo_tipo: "Efeito",
      area: "Tenda do Igris",
      desbloqueado: true,
      posse: 1,
      resumo: "Um potinho de lata amassado cheio até a borda com uma pasta verde-escura, quase preta e grudenta. Cheira a folhas maceradas, cânfora velha e álcool puro. Quando passada na pele aberta, arde como brasa por dois segundos antes de adormecer a região inteira.",
      detalhe: "Consumível. Passar em cortes ou ferimentos estanca o sangue na hora, recuperando 1d6 + 2 PV."
    },
    {
      id: "igris_isqueiro_sebo",
      nome: "Isqueiro de Sebo Cinzento",
      peso: 1,
      tipo: "Artefato do Medo",
      estoque: 1,
      quantidade: 1,
      campo_tipo: "Efeito",
      area: "Tenda do Igris",
      desbloqueado: true,
      posse: 6,
      resumo: "Um isqueiro de fluido quadrado, pesado e amassado, com a carcaça de metal tomada por uma crosta áspera que lembra cera de vela misturada com cinzas. Quando a tampa é aberta e a roda é riscada, a chama que sobe é baixa, pálida e completamente silenciosa, soltando um cheiro leve de terra molhada e ozônio em vez de querosene.",
      detalhe: "O Lado Bom: Encarar a chama silenciosa por alguns segundos esvazia o pânico da cabeça. Uma vez por cena ou como ação rápida, o portador pode acender o isqueiro para recuperar 1d6 de Sanidade/Estresse ou 1d4 de PE e encerrar imediatamente condições de medo, tremedeira ou paralisia mental em si mesmo ou em um aliado adjacente.\n\nO Lado Ruim: O isqueiro queima o próprio calor do corpo de quem o segura. Cada vez que a chama é acesa para usar seu efeito, os dedos do usuário ficam roxos de frio e um cansaço pesado desce pelo peito, custando 1d4 de PV diretos sem redução e deixando as mãos trêmulas de frio com -1 em testes de ataque corpo a corpo ou pontaria pelo resto da cena."
    },
    {
      id: "igris_fluido_isqueiro",
      nome: "Fluido de Isqueiro Adulterado",
      peso: 1,
      tipo: "Consumível Tático",
      estoque: 2,
      quantidade: 2,
      campo_tipo: "Efeito",
      area: "Tenda do Igris",
      desbloqueado: true,
      posse: 6,
      resumo: "Uma garrafinha achatada de vidro âmbar, sem rótulo e fechada com uma rolha de cortiça inchada. O líquido lá dentro é amarelado, meio oleoso e tem um cheiro químico tão forte de querosene misturado com solvente que faz os olhos lacrimejarem só de destampar.",
      detalhe: "Uso único. Pode ser jogado no chão para criar uma barreira de fogo com um isqueiro ou despejado sobre uma arma corpo a corpo para somar +1d4 de Fogo pelos próximos 3 ataques."
    },
    {
      id: "igris_oculos_soldador",
      nome: "Óculos de Soldador Rachado",
      peso: 1,
      tipo: "Equipamento",
      estoque: 1,
      quantidade: 1,
      campo_tipo: "Efeito",
      area: "Tenda do Igris",
      desbloqueado: true,
      posse: 5,
      resumo: "Uma armação pesada de borracha preta ressecada e aros de latão, presa por uma tira elástica larga. A lente direita tem um trincado em forma de teia de aranha no canto, mas o vidro grosso levemente fumê veda perfeitamente o rosto.",
      detalhe: "Protege os olhos contra líquidos, pó químico, poeira e clarões súbitos. Concede +1 em Percepção em ambientes cheios de fumaça, penumbra ou detritos no ar."
    },
    {
      id: "igris_amuleto_no_cego",
      nome: "Amuleto de Fio Laranja \"Nó Cego\"",
      peso: 0,
      tipo: "Relíquia Estranha",
      estoque: 1,
      quantidade: 1,
      campo_tipo: "Efeito",
      area: "Tenda do Igris",
      desbloqueado: true,
      posse: 5,
      resumo: "Um dente animal amarelado e rachado ao meio, completamente estrangulado por dezenas de voltas de um fio laranja áspero e terroso. Ao segurá-lo na palma da mão, o nó parece pulsar de leve, como se estivesse morno.",
      detalhe: "Uso único. Enquanto estiver no bolso, se o portador falhar em um teste de resistência mental ou contra o sobrenatural, o fio laranja se arrebenta sozinho queimando como um pavio rápido sem deixar cinzas e transforma a falha em um Sucesso Automático."
    },
    {
      id: "igris_canivete_trincheira",
      nome: "Canivete de Trincheira \"Dente de Ferro\"",
      peso: 1,
      tipo: "Arma Leve / Soco",
      estoque: 1,
      quantidade: 1,
      campo_tipo: "Efeito",
      area: "Tenda do Igris",
      desbloqueado: true,
      posse: 2,
      resumo: "Uma peça bruta de metal escuro que combina uma soqueira de ferro fundido com quatro anéis grossos para os dedos e uma lâmina curta e larga de dois gumes que salta da lateral com uma mola dura. O metal está cheio de riscos antigos de uso.",
      detalhe: "Causa 1d4 + 1 de dano Perfurante ou Contundente. Permite escolher entre furar com a lâmina ou esmagar com a soqueira no mesmo golpe, sem precisar trocar de arma."
    },
    {
      id: "igris_monoculo_fuliginoso",
      nome: "Monóculo de Vidro Fuliginoso",
      peso: 1,
      tipo: "Artefato do Medo",
      estoque: 1,
      quantidade: 1,
      campo_tipo: "Efeito",
      area: "Tenda do Igris",
      desbloqueado: true,
      posse: 3,
      resumo: "Uma lente redonda e grossa, sem haste, encaixada num aro de ferro oxidado que parece ter sido arrancado de um equipamento médico velho. O vidro é manchado por uma fuligem escura que nunca sai quando limpo, mas que se move lentamente lá dentro como fumaça presa quando colocado contra a luz.",
      detalhe: "O Lado Bom — Olhar sob a Rasura: Olhar através da lente revela o que tenta se esconder na penumbra ou atrás de mentiras. O usuário recebe Vantagem (+2) em testes de Investigação, Percepção ou Ocultismo para encontrar pistas ocultas, rastros de sangue lavado, passagens falsas ou notar quando alguém está mentindo ou escondendo algo.\n\nO Lado Ruim — Atenção Retribuída: O vidro marca os olhos de quem espia. Sempre que o usuário usar o monóculo para passar em um teste, o olho usado começa a lacrimejar um líquido escuro e frio; até o final da cena, o personagem fica com a visão periférica borrada por vultos, sofrendo -2 em Percepção passiva e Esquiva/Defesa e, se houver alguma ameaça na área, ela passa a focar seus ataques prioritariamente nele no primeiro turno."
    },
    {
      id: "igris_sinalizador_magnesio",
      nome: "Sinalizador de Magnésio",
      peso: 1,
      tipo: "Utilitário / Combate",
      estoque: 2,
      quantidade: 2,
      campo_tipo: "Efeito",
      area: "Tenda do Igris",
      desbloqueado: true,
      posse: 3,
      resumo: "Um cilindro de papelão industrial grosso e plastificado, da cor de tijolo desbotado, com uma tampa de plástico preto áspero na ponta para riscar. Tem cheiro forte de pólvora seca e enxofre mesmo fechado.",
      detalhe: "Uso único, dura 1 cena. Acende uma chama vermelha cegante e solta faíscas brancas que iluminam totalmente a área ao redor. Pode ser arremessado ou brandido como arma improvisada para causar 2d6 de dano de Fogo/Luz automático no contato."
    },
    {
      id: "igris_corrente_bicicleta",
      nome: "Corrente de Bicicleta com Cadeado",
      peso: 1,
      tipo: "Arma Improvisada",
      estoque: 1,
      quantidade: 1,
      campo_tipo: "Efeito",
      area: "Tenda do Igris",
      desbloqueado: true,
      posse: 7,
      resumo: "Uma corrente grossa de elos de aço engraxados, com quase um metro de comprimento. Na ponta de impacto, um cadeado de latão pesado e amassado funciona como um pêndulo brutal; na outra extremidade, os elos foram soldados num punho improvisado que não machuca os dedos de quem gira.",
      detalhe: "Causa 1d6 de dano Contundente em Alcance Curto e Varredura. Ataques giratórios acertam enxames inteiros com facilidade, causando +2 de dano extra contra a Massa de Ratos."
    },
    {
      id: "igris_pe_de_cabra",
      nome: "Pé de Cabra Enferrujado",
      peso: 1,
      tipo: "Arma / Ferramenta",
      estoque: 1,
      quantidade: 1,
      campo_tipo: "Efeito",
      area: "Tenda do Igris",
      desbloqueado: true,
      posse: 8,
      resumo: "Uma barra maciça de ferro hexagonal, pesada e fria, com a ponta curvada em fenda. Está coberta por uma crosta grossa de ferrugem avermelhada e manchas antigas de tinta descascada, mas o centro da haste tem um trapo de couro sujo amarrado firme para não escorregar da mão suada.",
      detalhe: "Causa 1d6 de dano Contundente. Concede Vantagem (+2) em testes de Força/Físico para arrombar estruturas, portas trancadas ou caixotes."
    },
    {
      id: "igris_cigarros_cravo",
      nome: "Cigarros de Cravo Mofados",
      peso: 0,
      tipo: "Mente / Fôlego",
      estoque: "2 maços",
      quantidade: 2,
      campo_tipo: "Efeito",
      area: "Tenda do Igris",
      desbloqueado: true,
      posse: 8,
      resumo: "Um maço de papel mole e amarelado pela umidade, amarrado com um elástico velho. Lá dentro há apenas dois cigarros escuros, enrolados de forma irregular, que estalam baixinho quando acesos e soltam uma fumaça densa e adocicada.",
      detalhe: "Consumível, 2 usos por maço. O cheiro forte de cravo queimado corta qualquer fedor do ambiente e acalma a tremedeira nas mãos. Recupera 1d4 de Estresse/Sanidade ou PE e anula penalidades por náusea ou mau cheiro."
    },
    {
      id: "col_livro_rei_palido",
      nome: "O Rei Pálido (Lorena Valente, 2013)",
      peso: 1,
      tipo: "Item Investigativo Único",
      campo_tipo: "Aparência Física",
      area: "Investigação / Objeto Maldito",
      desbloqueado: true,
      imagem: "assets/coletaveis/livro_rei_palido_capa.webp",
      resumo: "Um livro de capa dura cinza-chumbo, áspero e bastante desgastado pelo tempo. No centro da capa, a pintura gasta e perturbadora de uma figura encapuzada de rosto em vazio negro absoluto.",
      detalhe: "Um livro de capa dura cinza-chumbo, áspero e bastante desgastado pelo tempo. O título \"O REI PÁLIDO\" e o nome da autora estão impressos em letras prateadas descascadas. No centro da capa, há uma pintura gasta e perturbadora de uma figura vestindo um capuz branco pálido, cujo rosto é um vazio negro e absoluto. Ao abri-lo, nota-se que dezenas de páginas foram violentamente rasgadas e removidas, deixando o miolo irregular. No entanto, sete páginas específicas foram cuidadosamente grampeadas juntas, separadas do resto da obra de forma claramente proposital.",
      mestre_info: "Status da Obra: Desvendada pelos Investigadores.\n• Leitura Concluída: O enigma e a escuridão do miolo irregular foram superados pelo grupo. As páginas agora podem ser folheadas e examinadas na íntegra sem o dreno de Sanidade.\n• Reconhecimento Histórico: Coletânea de contos de terror de Lorena Valente (2013), famosa pelo conto de repercussão O Carniceiro."
    },
    {
      id: "col_anotacoes_caixa_negra",
      nome: "Páginas de Pesquisa e Anotações",
      peso: 0,
      tipo: "Item Investigativo Único",
      campo_tipo: "Aparência Física",
      area: "Investigação / Registro Arcano",
      desbloqueado: true,
      imagem: "assets/coletaveis/anotacoes_caixa_1.webp",
      resumo: "Folhas duplas de papel envelhecido e amarelado dispostas lado a lado com ilustrações técnicas de uma caixa de pedra com entalhes dourados e caligrafia cursiva elegante em tinta roxa.",
      detalhe: "Folhas duplas de papel envelhecido e amarelado dispostas lado a lado. A primeira folha exibe desenhos técnicos detalhados e geométricos feitos à mão de uma caixa de pedra com entalhes dourados, apresentando duas visões distintas (uma fechada com medidas estruturais e a legenda \"Trancada\", e outra aberta revelando o interior totalmente escuro). Sobreposta a essas ilustrações, há anotações cursivas manuscritas em tinta roxa com questionamentos ansiosos e confusos. A segunda folha traz longos parágrafos densos e reflexivos preenchidos inteiramente com a mesma caligrafia elegante em tinta roxa."
    },
    {
      id: "col_anotacao_solta_constanca",
      nome: "Página Solta de Reflexão",
      peso: 0,
      tipo: "Item Investigativo Único",
      campo_tipo: "Aparência Física",
      area: "Investigação / Manuscrito Oculto",
      desbloqueado: true,
      imagem: "assets/coletaveis/anotacao_constanca_solta.webp",
      resumo: "Uma folha de papel única e envelhecida, disposta verticalmente, contendo dogmas e justificativas macabras em caligrafia cursiva elegante em louvor à entidade.",
      detalhe: "Uma folha de papel única e envelhecida, com bordas levemente gastas e manchas amareladas, disposta verticalmente sobre uma mesa de madeira. O papel contém um texto centralizado escrito com uma caligrafia cursiva elegante e imaculada, detalhando dogmas e justificativas macabras sobre o sacrifício e a purificação em louvor à entidade."
    }
  ];

  // ============================================================
  // EXPORTAÇÃO GLOBAL E MÓDULO
  // ============================================================
  global.CAMPAIGN_NPCS = CAMPAIGN_NPCS;
  global.CAMPAIGN_AREAS = CAMPAIGN_AREAS;
  global.CAMPAIGN_COLETAVEIS = CAMPAIGN_COLETAVEIS;
  global.MESA_COLETAVEIS = CAMPAIGN_COLETAVEIS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      CAMPAIGN_NPCS,
      CAMPAIGN_AREAS,
      CAMPAIGN_COLETAVEIS
    };
  }

})(typeof window !== 'undefined' ? window : globalThis);
