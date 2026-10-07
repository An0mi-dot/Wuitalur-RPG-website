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
    "npcs_presentes": ["boneco"],
    "pontos_de_interesse": [
      {
        "cabecalho": {
          "nome": "O Armário de Sara (2º Andar, Corredor Norte)",
          "descricao_publica": "O armário metálico nº 73, situado no corredor entre a biblioteca e a sala do 3º ano. O chão em frente e a chapa verde-oliva acolhem um memorial improvisado: vasos pequenos com cravos secos, crisântemos murchos, copos de plástico com cera endurecida de velas e várias mensagens coladas com fita-cola. A porta está encostada apenas no fecho metálico, sem cadeado."
        },
        "testes": [
          {
            "pericia": "Investigação",
            "ct_dt": 6,
            "informacao_revelada": "Ao inspecionar a estrutura física e afastar o amontoado de flores da base, nota-se que as homenagens foram fixadas em momentos distintos. Entre papéis banais de estudantes, há um envelope denso colado com fita-cola na lateral de acesso mais difícil, bem rente à dobra da porta."
          },
          {
            "pericia": "Percepção",
            "ct_dt": 6,
            "informacao_revelada": "Pelas grelhas de ventilação do metal escapa um odor químico de desinfetante hospitalar forte misturado com cera perfumada de flor de laranjeira, destoando completamente do pó e mofo do corredor."
          },
          {
            "pericia": "Ladinagem / Crime",
            "ct_dt": 8,
            "informacao_revelada": "O trinco interior do armário não ostenta mossas, marcas de ferramentas ou sinais de gazua. Ele foi destrancado com a chave-mestra administrativa da coordenação antes da colocação das flores."
          },
          {
            "pericia": "Intuição",
            "ct_dt": 6,
            "informacao_revelada": "A disposição das velas e das jarras não parece puramente espontânea: segue uma ordem excessivamente simétrica e limpa, típica de algo inspecionado ou supervisionado pela própria coordenação escolar."
          }
        ],
        "notas_mestre": "A diretora Constança Montenegro acedeu ao armário com a chave-mestra poucas horas após os boatos do desaparecimento de Sara. Ela higienizou o interior para remover resquícios de medicação e autorizou o memorial como cortina de fumo. Uma busca bem-sucedida revela o Cartão Envelopado."
      },
      {
        "cabecalho": {
          "nome": "O Cartão Envelopado (Encontrado no Armário)",
          "descricao_publica": "Um envelope de alta gramagem, feito de papel de linho texturado, sem remetente formal no exterior. No interior, há um cartão dobrado com a seguinte inscrição manual em caligrafia cursiva elegante: 'Que as tuas dores finalmente encontrem repouso sob a sombra do eterno silêncio. Foste corajosa ao aceitar o descanso que merecias. — C.'"
        },
        "testes": [
          {
            "pericia": "Investigação",
            "ct_dt": 6,
            "informacao_revelada": "O papel de linho e o corte do envelope correspondem exatamente aos materiais de expediente solene utilizados em exclusivo pela direção do Colégio Primórdio."
          },
          {
            "pericia": "Percepção",
            "ct_dt": 6,
            "informacao_revelada": "A tinta utilizada na escrita é fluida, própria de caneta de tinta permanente num tom púrpura escuro, impregnando um perfume suave de essência floral no papel."
          },
          {
            "pericia": "Intuição",
            "ct_dt": 8,
            "informacao_revelada": "A mensagem encara a ausência de Sara como um termo definitivo e consumado, denotando que o autor conhecia a sua enfermidade latente ('as tuas dores') e sabia que a jovem partiu de livre vontade."
          }
        ],
        "notas_mestre": "O cartão foi depositado discretamente no memorial por Constança Montenegro. A tinta roxa é o seu cunho pessoal em despachos formais. O bilhete entrega aos jogadores que alguém com a inicial 'C' na escola sabia do cancro terminal de Sara e apoiou a sua entrega à entidade."
      },
      {
        "cabecalho": {
          "nome": "O Balneário do Ginásio (1º Andar, Rés-do-chão - Ala Este)",
          "descricao_publica": "Um banco de madeira comprido fixo aos azulejos frios nos fundos do balneário feminino da quadra, próximo à saída de emergência que conduz às traseiras do recinto escolar."
        },
        "testes": [
          {
            "pericia": "Investigação",
            "ct_dt": 6,
            "informacao_revelada": "Sob o assento do último banco encontram-se resíduos de fita-cola recente. No vão do ralo desativado logo abaixo, foi descartado um frasco cilíndrico de remédio vazio e sem rótulo comercial, preservando apenas um código impresso da Clínica Médica de Mina de Prata."
          },
          {
            "pericia": "Percepção",
            "ct_dt": 8,
            "informacao_revelada": "Na parede de azulejos, atrás da fila de armários, alguém usou a ponta metálica de um compasso para riscar na argamassa: 'O gato preto estava no pátio outra vez. Ele olhou para mim da árvore.'"
          },
          {
            "pericia": "Medicina / Alquimia",
            "ct_dt": 6,
            "informacao_revelada": "O odor residual no frasco de vidro pertence a analgésicos opioides pesados, prescritos estritamente para o alívio de dor crónica severa em estágios avançados de tumores terminais."
          }
        ],
        "notas_mestre": "Sara lidava com episódios frequentes de náuseas e dores intensas. Com medo de que o seu estado de saúde fosse exposto perante a comunidade elitista do colégio, ela escondia-se no balneário vazio para se medicar em segredo."
      },
      {
        "cabecalho": {
          "nome": "O Gabinete da Direção (1º Andar, Rés-do-chão - Ala Oeste)",
          "descricao_publica": "A secretária imponente de carvalho escuro de Constança Montenegro e um armário de arquivos de aço cinzento encastrado na alvenaria atrás da sua poltrona de cabedal, protegido por uma fechadura cilíndrica de latão."
        },
        "testes": [
          {
            "pericia": "Ladinagem / Crime",
            "ct_dt": 8,
            "informacao_revelada": "Destrancar o compartimento inferior do arquivo de aço sem entortar a lingueta de metal nem disparar o alarme mecânico instalado no batente da porta."
          },
          {
            "pericia": "Investigação",
            "ct_dt": 6,
            "informacao_revelada": "No fundo da gaveta há uma pasta suspensa rotulada 'Transferências & Saúde - Casos Especiais', contendo os relatórios de Trisha Auguil (ano letivo de 2060) e Sara Auguil (2061), acompanhados de cópias de laudos médicos confidenciais."
          },
          {
            "pericia": "Intuição",
            "ct_dt": 8,
            "informacao_revelada": "Agrafado ao laudo de Sara há um bilhete escrito com caneta de tinta permanente roxa: 'Degeneração celular incurável confirmada. Perfil dócil e sem suporte familiar direto. Proceder com a apresentação à Névoa.'"
          }
        ],
        "notas_mestre": "Prova documental direta do papel de Constança. A diretora usa a sua posição de autoridade para mapear jovens desamparados e doentes graves, encaminhando-os para a entidade 'Ele' em troca de manter o seu pacto de influência e prosperidade em Fragktus."
      },
      {
        "cabecalho": {
          "nome": "A Sala de Música (2º Andar, Ala Sul)",
          "descricao_publica": "O piano de cauda negro encostado junto às cortinas pesadas de veludo na sala de ensaio com isolamento acústico, cercado por estantes de partituras e violinos guardados em caixas de madeira."
        },
        "testes": [
          {
            "pericia": "Investigação",
            "ct_dt": 6,
            "informacao_revelada": "Sob as cordas de aço da caixa de ressonância do piano, há uma folha pautada de partitura com uma lista manuscrita de horários de saída e entrada do carro particular de Constança durante as madrugadas de junho."
          },
          {
            "pericia": "História / Ocultismo",
            "ct_dt": 8,
            "informacao_revelada": "No verso da partitura, há anotações manuais que transcrevem uma cantiga arcaica de Fragktus sobre 'Aquele que habita sob as raízes e aceita os que não possuem futuro'."
          },
          {
            "pericia": "Percepção",
            "ct_dt": 6,
            "informacao_revelada": "O fecho da janela das traseiras está destravado e há marcas de terra seca no parapeito, indicando que o local servia de passagem clandestina para a passarela exterior do ginásio."
          }
        ],
        "notas_mestre": "A sala de música era o esconderijo que Sara usava para tentar compreender o que a entidade havia falado por intermédio do gato possuído e para monitorizar as movimentações noturnas da diretora Constança antes de desaparecer de vez."
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
    "npcs_presentes": ["boneco"],
    "pontos_de_interesse": [],
    "conexoes_saida": [
      {
        "area_id": "colegio-primordio",
        "nome": "Colégio Integrado Primórdio",
        "gancho": "A estrada principal que conecta o perímetro rural ao centro cívico e estudantil de Fragktus."
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
