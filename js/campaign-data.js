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
      "district": "Reserva Florestal Fechada • Zona Rural",
      "dangerLevel": "Ameaça Desconhecida",
      "dangerLevelClass": "danger",
      "resumo_atmosfera": "A floresta que cerca Mina de Prata é densa, úmida e sufocante. A luz do sol mal penetra a copa das árvores e o chão é um tapete espesso de folhas mortas que abafa os passos. Não há animais cantando; o silêncio é pesado e hostil. No centro de uma clareira específica, o ar torna-se subitamente gélido e cheira a enxofre e lodo.",
      "requisitos_acesso": "Acesso desobstruído até o perímetro interno, mas desorientador e perigoso à noite.",
      "npcs_presentes": [],
      "pontos_de_interesse": [
        {
          "cabecalho": {
            "nome": "A \"Porta\" e os Pertences",
            "descricao_publica": "No meio do nada, ergue-se uma anomalia. Não é uma porta de casa comum, mas sim duas árvores antigas e retorcidas que cresceram entrelaçadas, formando um arco grotesco. O espaço dentro desse arco parece distorcido, como uma miragem, e a terra logo abaixo está encharcada de um lodo negro e espesso que não seca. Aos pés dessa estrutura bizarra, uma mochila escolar está jogada na lama."
          },
          "testes": [
            {
              "pericia": "Ocultismo / Cosmos",
              "ct_dt": 8,
              "informacao_revelada": "O jogador sente uma pressão quase física ao chegar perto do arco. A 'porta' está trancada ou inativa no momento, mas pulsa com uma energia residual de corrupção. Alguma coisa muito antiga e faminta está do outro lado, esperando."
            },
            {
              "pericia": "Investigação",
              "ct_dt": 6,
              "informacao_revelada": "Mexendo na mochila abandonada. Eles encontram cadernos molhados do Colégio Integrado Primórdio (com o nome de Sara Auguil) e um frasco vazio de analgésicos fortíssimos, sem rótulo, mas com o timbre quase apagado da Clínica Médica Renovare."
            },
            {
              "pericia": "Força ou Ladinagem",
              "ct_dt": 99,
              "informacao_revelada": "(Falha Automática): Se tentarem 'abrir' ou forçar a passagem pelo arco agora, nada acontece. É apenas um espaço vazio entre duas árvores. A chave não é física."
            }
          ],
          "notas_mestre": "Este é o mistério central que inicia a campanha. Eles não têm como resolver a Porta agora. A mochila é o gatilho que os obriga a voltar para a cidade e iniciar a investigação urbana para descobrir quem é Sara, o que é a clínica e, por fim, como essa 'porta' foi aberta."
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
    "casa-auguil": {
    "id": "casa-auguil",
    "nome": "Casa Auguil",
    "shortName": "Casa Auguil",
    "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z\"></path><polyline points=\"9 22 9 12 15 12 15 22\"></polyline></svg>",
    "themeClass": "area-casa-auguil",
    "district": "Bairro Residencial • Mina de Prata",
    "dangerLevel": "Isolamento Policial & Atividade Paranormal",
    "dangerLevelClass": "danger",
    "titulo_narrativo": "Interior da Casa",
      "texto_narrativo": "\"A fechadura cede com um estalo abafado e vocês entram, deixando a noite fria e as fitas amarelas da polícia para trás. O ar dentro da Casa Auguil é pesado, denso e tem o gosto amargo de um lugar que foi trancado às pressas e abandonado. Quando vocês acendem as lanternas, os feixes de luz cortam a escuridão absoluta do térreo e revelam algo profundamente perturbador: a normalidade. A sala de estar está impecavelmente arrumada. Os móveis estão alinhados, as almofadas estão em seus lugares e o silêncio é tão espesso que vocês conseguem ouvir a respiração uns dos outros.\n\nMas essa ilusão de paz quebra assim que a luz da lanterna varre o pé da escada.\n\nHá um cheiro que não pertence a esta casa do bairro de Mina de Prata. É o odor úmido de terra podre, folhas molhadas e lodo. Marcando os degraus imaculados de madeira, pequenas pegadas escuras e pastosas sobem em direção ao segundo andar, como se a própria floresta tivesse entrado pela porta dos fundos e subido para os quartos.\n\nCada passo na escada faz a madeira ranger, ecoando no vazio da casa. Quanto mais vocês sobem, mais o ar fica frio e o cheiro de pântano se torna asfixiante, misturando-se com um forte odor de desinfetante e doença. Vocês chegam ao corredor superior. A porta do quarto de Sara está no final, levemente entreaberta.\n\nAo empurrar a porta, o feixe de luz da lanterna revela o caos. O quarto é um abismo de desespero e o contraste absoluto com o térreo. As janelas estão sufocadas por cobertores grossos pregados na parede, bloqueando qualquer fresta de luz. O chão está invisível sob um mar de roupas amassadas, caixas de remédios vazias e dezenas de folhas de papel espalhadas freneticamente, repletas de rascunhos. E, vindo da porta semiaberta do banheiro da suíte, o som sutil de algo gotejando de forma viscosa e o cheiro de enxofre avisam que o horror daquela casa não é apenas uma lembrança do passado. Algo ainda os espera na escuridão.\"",
      "resumo_atmosfera": "Uma moradia de dois andares de alto padrão, agora transformada em cena de crime. O exterior está isolado e envolto em dezenas de fitas policiais amarelas e pretas de 'Não Ultrapasse'. Durante o dia, viaturas e peritos da polícia bloqueiam o perímetro, tornando qualquer aproximação impossível (a polícia abafou o caso a mando da Diretora Constança). É apenas durante a calada da noite, quando as viaturas se retiram e a casa mergulha numa escuridão absoluta, que a oportunidade de infiltração surge. A casa de fora parece silenciosa, mas lá dentro, a atmosfera é pesada, cheirando a lodo e abandono.",
    "requisitos_acesso": "Apenas durante a noite, exigindo infiltração pelos fundos ou janelas laterais para evitar os vizinhos e as fitas policiais.",
    "npcs_presentes": [],
    "pontos_de_interesse": [
      {
        "cabecalho": {
          "nome": "A Janela da Cozinha (Infiltração)",
          "descricao_publica": "Uma janela de correr nos fundos da casa, parcialmente oculta pela sombra de um grande arbusto. As fitas da polícia não cobrem esta parede, mas o vidro está trancado por dentro e reflete a escuridão absoluta do interior."
        },
        "testes": [
          {
            "pericia": "Ladinagem / Crime",
            "ct_dt": 7,
            "informacao_revelada": "Permite inserir uma lâmina fina na fresta e forçar a tranca para cima, deslizando o vidro sem fazer qualquer barulho."
          },
          {
            "pericia": "Força",
            "ct_dt": 8,
            "informacao_revelada": "Quebrar o vidro direto perto da tranca. Requer que o jogador role um casaco no braço para abafar o estilhaço e não se cortar severamente no processo."
          },
          {
            "pericia": "Furtividade / Vigor",
            "ct_dt": 6,
            "informacao_revelada": "Necessário se tentarem pular o muro dos fundos em direção a esta janela sem acionar os sensores de luz da casa vizinha."
          }
        ],
        "notas_mestre": "Este é o ponto de entrada. Se eles tentarem entrar pela porta da frente, estão expostos à rua e à patrulha. A janela da cozinha força os jogadores a entrarem pelos fundos da casa de forma furtiva."
      },
      {
        "cabecalho": {
          "nome": "O Tapete Branco da Escada",
          "descricao_publica": "Um tapete felpudo e imaculadamente branco, posicionado exatamente no primeiro degrau do lance de escadas que leva ao andar de cima. No meio da sala perfeitamente limpa, o tapete destoa, pois tem sujeira incrustada."
        },
        "testes": [
          {
            "pericia": "Percepção",
            "ct_dt": 6,
            "informacao_revelada": "Iluminando o tapete, nota-se que a sujeira não é pó de sapato. São marcas nítidas de patas de um animal pequeno. Elas sujaram o tapete e continuam subindo pela madeira da escada."
          },
          {
            "pericia": "Investigação",
            "ct_dt": 6,
            "informacao_revelada": "Ao tocar na mancha do tapete, o jogador percebe que o lodo não está seco. Ele é úmido, viscoso e tem cheiro de pântano podre, provando que 'algo' visitou a casa muito depois que a polícia foi embora."
          }
        ],
        "notas_mestre": "Isto conecta o relato do Elias (o barista que viu o gato preto) à casa. A entidade seguiu Sara e entrou aqui. O fato de as pegadas levarem direto para o andar de cima atrai os jogadores para o quarto."
      },
      {
        "cabecalho": {
          "nome": "A Escrivaninha de Carvalho (Quarto de Sara)",
          "descricao_publica": "Uma escrivaninha de madeira maciça no canto do quarto. A sua superfície está coberta por dezenas de folhas amassadas e embalagens de remédios. Na cadeira logo abaixo, há uma grande pilha de casacos e cachecóis. Do meio desses casacos, um fraco brilho dourado pulsa lentamente."
        },
        "testes": [
          {
            "pericia": "Investigação",
            "ct_dt": 7,
            "informacao_revelada": "Remexendo as folhas na mesa, os jogadores encontram o diário de Sara (onde as últimas páginas mostram letras trêmulas e desenhos repetitivos de árvores e uma figura alta). Sob os casacos na cadeira, encontram um pote de vidro contendo um líquido dourado e denso de onde brotam faíscas (apenas 1 frasco)."
          },
          {
            "pericia": "Cosmos / Química",
            "ct_dt": 7,
            "informacao_revelada": "Analisando o líquido dourado e a sua reação com o ar dentro do vidro, o jogador identifica que se trata de uma Poção Solar de Cura. Se ingerida ou aplicada na pele, ela queima e purifica infecções, removendo imediatamente a letal condição Amalgamado da Podridão."
          },
          {
            "pericia": "História / Ocultismo",
            "ct_dt": 8,
            "informacao_revelada": "Analisando os delírios no diário, a última frase escrita repetida várias vezes é decifrada: 'Ele disse que a Trisha está à minha espera. A dor vai passar na água preta.'"
          },
          {
            "pericia": "Mente",
            "ct_dt": 6,
            "informacao_revelada": "Teste de sanidade para os investigadores. Ler as anotações esquizofrênicas de uma garota doente que estava sendo corrompida pela entidade causa um calafrio profundo. Falhar resulta em perda de Pontos de Esforço (PE)."
          }
        ],
        "notas_mestre": "Este objeto agrupa as revelações vitais do quarto. O diário prova que ela foi manipulada a ir para a floresta por conta própria, e a escrivaninha entrega a única cura para o combate que está prestes a acontecer na banheira a poucos metros dali."
      },
      {
        "cabecalho": {
          "nome": "A Banheira de Porcelana",
          "descricao_publica": "A porta da casa de banho está entreaberta. Uma banheira de porcelana branca, estilo vitoriano, domina o cômodo. Um cheiro nauseabundo a podridão e enxofre emana dela, pois está cheia até a borda com uma água espessa, preta e parada, como lodo."
        },
        "testes": [
          {
            "pericia": "Medicina / Alquimia",
            "ct_dt": 6,
            "informacao_revelada": "A água não é de esgoto humano. É um lodo orgânico e antinatural, como se o núcleo podre da Floresta tivesse sido bombeado para dentro de casa."
          },
          {
            "pericia": "Percepção",
            "ct_dt": 8,
            "informacao_revelada": "Quem se debruçar sobre a água negra vai perceber, uma fração de segundo tarde demais, que o reflexo pálido no fundo não é o do próprio jogador."
          }
        ],
        "notas_mestre": "GATILHO DE COMBATE. Assim que um jogador fizer qualquer teste neste PDI (ou tentar esvaziar/tocar na água), o Zumbi de Lodo (o cadáver corrompido de Kali) emerge violentamente e ataca. Quando o monstro for derrotado, a água preta escoará, revelando o laço de cabelo rosa de Kali entupindo o ralo, provando que Sara cometeu o sacrifício na própria banheira antes de sumir."
      }
    ],
    "conexoes_saida": [
      {
        "area_id": "colegio-primordio",
        "nome": "Colégio Integrado Primórdio",
        "gancho": "O local de estudo de Sara."
      },
      {
        "area_id": "floresta-proibida",
        "nome": "A Mata do Norte",
        "gancho": "Para onde Sara se dirigiu por vontade própria."
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

  }
};
  // ============================================================
  // EXPORTAÇÃO GLOBAL E MÓDULO
  // ============================================================
  global.CAMPAIGN_NPCS = CAMPAIGN_NPCS;
  global.CAMPAIGN_AREAS = CAMPAIGN_AREAS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      CAMPAIGN_NPCS,
      CAMPAIGN_AREAS
    };
  }

})(typeof window !== 'undefined' ? window : globalThis);
