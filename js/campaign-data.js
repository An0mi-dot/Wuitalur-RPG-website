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
      papel: "Ex-namorado de Sara / Aluno do Colégio Primórdio",
      pv: 12,
      atributos: { Vigor: "d16", Força: "d12", Saúde: "d8", Mente: "d4" },
      personalidade: "Defensivo, vaidoso e um pouco arrogante para esconder a culpa. Tenta agir como se o sumiço de Sara não fosse problema dele, ficando irritado facilmente se for pressionado pelos investigadores.",
      historia_resumida: "Namorou com a Sara durante quase um ano. É o típico jovem de família rica de Mina de Prata. Terminou o relacionamento há poucos meses porque não suportava a \"obsessão\" de Sara pelo desaparecimento da irmã (Trisha). Ele queria uma namorada normal para ir às festas, e não alguém que passava as madrugadas a chorar, visivelmente doente e a investigar mapas da floresta.",
      informacao_livre: "Se os jogadores perguntarem casualmente, ele revira os olhos e diz que a Sara estava a \"ficar maluca\". Reclama que ela estava obcecada com a irmã e passava o tempo todo trancada no Café da Névoa a falar sozinha ou a desenhar rabiscos assustadores em vez de lhe dar atenção.",
      segredo_util: "Na noite em que terminaram o namoro (dentro do carro dele), a Sara teve uma crise de dor e deixou cair um item debaixo do banco: um caderno de rascunhos onde ela desenhou a silhueta da entidade \"Ele\" na floresta e anotou as promessas de que a dor ia acabar. Ele tem esse caderno escondido na mochila escolar porque teve muito medo de o entregar à polícia e se envolver.",
      gatilho_revelacao: "Para o fazer entregar o caderno, os jogadores precisam de um Sucesso em Intimidação DT 7 (encurralando-o e chamando-o de covarde por a ter abandonado) ou Diplomacia/Empatia DT 6 (apelando à culpa que ele sente no fundo por ela ter desaparecido).",
      ligacao_misterio: "Testemunha. Ele presenciou a deterioração mental e física de Sara nas semanas anteriores ao contato com a entidade, mas preferiu fugir a ajudar.",
      notas_mestre: "Onde encontrá-lo: Como o dia na escola será um \"dia de esportes\", os jogadores podem encontrar Isaque na quadra, perto dos vestiários. Isso cria uma ponte direta para eles irem investigar os bancos onde Sara escondia os remédios.\nO Papel Narrativo: Isaque serve para causar raiva nos jogadores. Ele é o retrato da superficialidade do Colégio Primórdio. A atitude dele vai fazer com que o grupo sinta pena de Sara e perceba o quão sozinha e vulnerável ela estava quando a entidade do gato a abordou."
    },
    {
      id: "elias-ribeiro",
      nome: "Elias Ribeiro",
      papel: "Funcionário e Barista do Café da Névoa",
      pv: 10,
      atributos: { Saúde: "d16", Força: "d12", Mente: "d8", Vigor: "d4" },
      personalidade: "Assustado, supersticioso e profundamente cansado. Fala em um tom baixo, esfregando as mãos nervosamente no avental sujo de pó de café. Tem um olhar culpado de quem viu algo que não devia e decidiu fingir que não aconteceu por puro instinto de sobrevivência.",
      historia_resumida: "Elias é um homem na casa dos 40 anos que trabalhava no Café da Névoa desde a época em que Trisha administrava o local. Quando Trisha sumiu, ele ajudou a jovem Sara a manter o negócio a funcionar para que ela não perdesse a única fonte de rendimento. Ele foi a pessoa que passou mais tempo com Sara nos últimos meses e viu de perto a degradação física dela, mas não tinha dinheiro nem autoridade para forçá-la a procurar um hospital de verdade fora de Mina de Prata.",
      informacao_livre: "Se abordado perto do Café (que está fechado) ou no bairro, ele lamenta a perda. Conta que Sara mal conseguia ficar em pé nas últimas semanas e que a Clínica Renovare parou de mandar médicos para avaliá-la, enviando apenas os laudos pelo correio. Ele diz que ela andava muito depressiva e passava horas no beco dos fundos a fumar ou a olhar para o nada.",
      segredo_util: "Ele estava no Café na noite em que a entidade \"Ele\" fez o primeiro contato. Elias foi jogar o lixo no beco e viu Sara ajoelhada a conversar com um gato preto. O terror de Elias começou quando ele ouviu o gato responder com uma voz distorcida e ecoante, prometendo curá-la. No entanto, o mais bizarro foi a reação de Sara: em vez de gritar ou entrar em pânico, ela agiu de forma assustadoramente natural. Ela simplesmente suspirou, pegou na mochila, olhou para o Elias pálido e disse: \"Podes fechar o caixa por hoje, Elias. Até amanhã.\" Ela foi para casa com a maior naturalidade do mundo, deixando-o para trás a tremer de medo. Ele guardou o molho de chaves da Casa dos Auguil que ela deixou no balcão e não contou nada à polícia.\nAlém disso, ele se recorda de, enquanto sara falava com ele, ele viu os olhos dela brilharem em várias cores bem rápido, mas ele acredita que deve ter sido as luzes dos postes ou algo do tipo.",
      gatilho_revelacao: "Para ele contar o que viu no beco e entregar as chaves da casa, os jogadores precisam de um Sucesso em Intimidação DT 8 (ameaçando denunciá-lo à polícia por ocultação de provas de um desaparecimento) ou Ocultismo/Religião DT 6 (mostrando que os jogadores entendem do sobrenatural e não o acharão louco se ele contar que ouviu um animal falar).",
      ligacao_misterio: "Testemunha Ocular Acidental. Ele é a prova de que a entidade fez o primeiro contato no Café, mas a verdadeira manipulação e a possessão ocorreram mais tarde, dentro da própria casa de Sara, para onde o gato a seguiu.",
      notas_mestre: "Onde encontrá-lo: Ele pode estar a varrer a calçada na frente do Café da Névoa fechado, ou pode ser encontrado em algum lugar público do bairro a fumar um cigarro, visivelmente tenso.\nO Papel Narrativo: Elias é a \"ponte\" que entrega as chaves da Casa Auguil aos jogadores. O relato dele serve para criar um contraste perturbador: o horror não foi a Sara ter sido atacada no beco, mas sim ela ter aceitado a presença da entidade com tanta apatia e naturalidade que preferiu ir para casa dormir como se nada tivesse acontecido. Isso prepara os jogadores para a ideia de que, quando chegarem à Casa de Sara, vão encontrar os vestígios da verdadeira madrugada de horrores onde o gato concluiu o seu trabalho."
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
    "district": "Setor Estudantil & Cívico • Centro de Fragktus",
    "dangerLevel": "Inspetores Rígidos & Vigilância Escolar",
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
    "dangerLevel": "Abandono Recente & Luto",
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
    "dangerLevel": "Risco Biológico & Segurança",
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
    "dangerLevel": "Isolamento Policial & Atividade Paranormal",
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
      }
    ]
  }
};

  // ============================================================
  // 3. BANCO DE DADOS DE COLETÁVEIS & ITENS ENCONTRADOS
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
      area: "Casa Auguil",
      desbloqueado: false,
      resumo: "Um caderno espiral de capa preta, manchado de terra umedecida e lodo nas bordas.",
      detalhe: "As dezenas de páginas iniciais foram arrancadas. Na única página restante no fim do caderno, há um texto escrito com caligrafia borrada: \"Ele me chamou. Eu só preciso abrir a porta. E a porta precisa de carne para girar a chave.\""
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
      desbloqueado: false,
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
      desbloqueado: false,
      resumo: "Um livrinho de capa dura e colorida, muito bem conservado, que destoa completamente da bagunça e dos livros escolares da escrivaninha.",
      detalhe: "Um conto ilustrado de quatro páginas sobre uma criatura que desce do espaço para \"abençoar\" um povo doente, consumindo os seus sonhos e colocando o mundo inteiro num sono eterno."
    },
    {
      id: "col_caixa_negra_dourada",
      nome: "Caixa Negra e Dourada",
      peso: 1,
      tipo: "Artefacto Selado",
      campo_tipo: "Efeito",
      area: "Casa Auguil (Quarto de Sara)",
      desbloqueado: false,
      resumo: "Uma pequena caixa pesada de material desconhecido, negra como obsidiana e contornada por filetes de ouro puro que formam padrões geométricos.",
      detalhe: "A caixa encontra-se completamente selada. Qualquer tentativa de impacto, uso de força bruta, lâminas ou ferramentas de arrombamento falha automaticamente, sem deixar um único arranhão na superfície."
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
