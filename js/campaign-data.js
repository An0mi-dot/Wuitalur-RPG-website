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
    "dangerLevel": "Fauna Alterada, Névoa Tóxica & Armadilhas",
    "dangerLevelClass": "danger",
    "resumo_atmosfera": "Árvores centenárias retorcidas, neblina espessa que engole os faróis, silêncio sepulcral quebrado pelo estalar de galhos e arame farpado enferrujado sob o chão de terra úmida coberto por seiva escura aromática.",
    "requisitos_acesso": "Área isolada pelas autoridades municipais com cancelas militarizadas no KM 18 guardadas por vigilantes particulares armados. Entrada clandestina viável pela tubulação de drenagem do Ferro-Velho (Atletismo DT 6) ou ravinas das serras.",
    "npcs_presentes": [],
    "pontos_de_interesse": [],
    "conexoes_saida": [
      {
        "area_id": "colegio-primordio",
        "nome": "Colégio Integrado Primórdio",
        "gancho": "A estrada principal que conecta o perímetro rural ao centro cívico e estudantil de Fragktus."
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
    "resumo_atmosfera": "Uma moradia de dois andares de alto padrão, agora transformada em cena de crime. O exterior está isolado e envolto em dezenas de fitas policiais amarelas e pretas de \"Não Ultrapasse\". Durante o dia, viaturas e peritos da polícia bloqueiam o perímetro, tornando qualquer aproximação impossível. É apenas durante a calada da noite, quando as viaturas se retiram e a casa mergulha numa escuridão absoluta, que a oportunidade de infiltração surge. A casa de fora parece silenciosa, mas lá dentro, a atmosfera é pesada, cheirando a lodo e abandono.",
    "requisitos_acesso": "Apenas durante a noite, exigindo infiltração pelos fundos ou janelas laterais para evitar os vizinhos e as fitas policiais.",
    "npcs_presentes": [],
    "pontos_de_interesse": [
      {
        "cabecalho": {
          "nome": "O Perímetro Externo (Infiltração)",
          "descricao_publica": "A calçada está deserta e a casa está lacrada pelas fitas da polícia. As portas da frente e das traseiras estão trancadas, e as janelas fechadas. Entrar aqui exige agir nas sombras e passar pela segurança física da casa sem alertar a vizinhança."
        },
        "testes": [
          {
            "pericia": "Ladinagem / Crime",
            "ct_dt": 7,
            "informacao_revelada": "Permite usar gazuas ou ferramentas improvisadas para destrancar a porta das traseiras (onde a polícia tem um ponto cego) de forma totalmente silenciosa."
          },
          {
            "pericia": "Força",
            "ct_dt": 8,
            "informacao_revelada": "Quebrar o vidro de uma das janelas laterais. Requer amarrar um casaco ao redor do braço para abafar o som do vidro a estilhaçar e não cortar os pulsos."
          },
          {
            "pericia": "Furtividade / Vigor",
            "ct_dt": 6,
            "informacao_revelada": "Necessário caso os jogadores precisem de correr pelo quintal e saltar o muro sem acionar os sensores de luz dos vizinhos."
          }
        ],
        "notas_mestre": "Este PDI reforça que o local é restrito e dá opções de abordagem aos jogadores. Se eles tentarem vir de dia, os NPCs policiais mandam-nos embora. Apenas à noite eles conseguem entrar. É o primeiro desafio físico da sessão."
      },
      {
        "cabecalho": {
          "nome": "O Térreo e as Escadas (O Caminho do Gato)",
          "descricao_publica": "O andar de baixo está bizarramente organizado e limpo, exceto por alguns locais onde a polícia recolheu impressões digitais com pó branco. O silêncio é sufocante, mas há algo a quebrar a simetria perfeita da sala de estar e das escadas."
        },
        "testes": [
          {
            "pericia": "Percepção",
            "ct_dt": 6,
            "informacao_revelada": "Com lanternas, é possível ver pequenas manchas escuras no chão. Não são pegadas humanas, mas sim pequenas marcas de patas de um animal, feitas de um lodo escuro e pastoso, que começam na porta das traseiras e sobem pelas escadas."
          },
          {
            "pericia": "Investigação",
            "ct_dt": 6,
            "informacao_revelada": "As marcas na escada não estão secas. Estão húmidas e cheiram fortemente a terra podre da floresta, provando que \"algo\" continuou a visitar a casa depois que a polícia foi embora."
          }
        ],
        "notas_mestre": "Isto conecta a história do Elias (o barista que viu o gato) com o interior da casa. O gato (ou a entidade que o possuía) não apenas abordou Sara no beco, ele seguiu-a e tomou conta da casa dela."
      },
      {
        "cabecalho": {
          "nome": "O Quarto de Sara (A Degradação)",
          "descricao_publica": "Contrastando com o andar de baixo, o quarto de Sara é o puro caos (o \"Chão do Quarto\"). Roupas, caixas de medicamentos vazias e dezenas de folhas de papel espalhadas. As janelas estão bloqueadas com cobertores para impedir a luz."
        },
        "testes": [
          {
            "pericia": "Investigação",
            "ct_dt": 7,
            "informacao_revelada": "No meio do lixo no chão, encontra-se o \"Papel\" principal: um diário. A caligrafia começa normal, mas a meio, as letras tornam-se tremidas, com desenhos repetitivos de árvores contorcidas e uma figura alta de olhos brilhantes na floresta."
          },
          {
            "pericia": "História / Ocultismo",
            "ct_dt": 8,
            "informacao_revelada": "Analisando os desenhos e as últimas páginas do diário. A última frase escrita é repetida dezenas de vezes: \"Ele disse que a Trisha está à minha espera. A dor vai passar na água preta.\""
          },
          {
            "pericia": "Mente",
            "ct_dt": 6,
            "informacao_revelada": "Teste de sanidade/resistência para os jogadores. Ler os delírios absolutos de uma rapariga terminal que perdeu a cabeça causa um calafrio profundo. Falhar resulta em perda de Pontos de Esforço (PE)."
          }
        ],
        "notas_mestre": "Este é o clímax narrativo e onde os seus apontamentos do caderno (\"Chão do Quarto\" e \"Papel\") brilham. Aqui os jogadores percebem que Sara não foi raptada; ela foi convencida e manipulada pela entidade a ir para a floresta por vontade própria, acreditando que encontraria a irmã e a cura."
      },
      {
        "cabecalho": {
          "nome": "A Banheira da Suíte (A Armadilha)",
          "descricao_publica": "A porta da casa de banho da suíte de Sara está entreaberta. Um cheiro nauseabundo a podridão, enxofre e lodo invade o quarto. Lá dentro, a banheira está cheia até à borda com uma água espessa, preta e parada."
        },
        "testes": [
          {
            "pericia": "Medicina / Alquimia",
            "ct_dt": 6,
            "informacao_revelada": "A água não é de esgoto. É um lodo orgânico e antinatural, como se parte do pântano da Floresta tivesse sido trazido para dentro de casa."
          },
          {
            "pericia": "Percepção",
            "ct_dt": 8,
            "informacao_revelada": "Quem olhar de perto para a água negra vai perceber, uma fração de segundo tarde demais, que o reflexo no fundo não é o do próprio jogador, mas sim de um rosto distorcido."
          }
        ],
        "notas_mestre": "O GATILHO DE COMBATE. Assim que um jogador fizer qualquer teste neste PDI (ou tentar esvaziar/tocar na água), o \"Zumbi de Lodo\" emerge violentamente da banheira e agarra o braço de quem estiver mais perto. É o resíduo apodrecido que a entidade deixou para trás. Aqui a investigação pausa e a iniciativa de combate deve ser rolada!"
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
