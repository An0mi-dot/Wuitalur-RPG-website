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
  const CAMPAIGN_NPCS = {
    'gustavo': {
      id: 'gustavo',
      nome: "Gustavo 'Gus' Mendes • Ex-Investigador & Confidente de Sara",
      personalidade: "Paranoico, hipervigilante, fumante compulsivo e exausto. Alterna entre acessos de urgência ansiosa e frieza cirúrgica; fala baixo e sempre olhando para as portas e janelas.",
      historia_resumida: "Antigo amigo de infância e confidente das irmãs Auguil. Quando Trisha desapareceu em 2060, tentou investigar por vias legais e foi expulso da corporação policial após 'incomodar as famílias erradas'. Montou uma central clandestina de escutas e passou os últimos seis meses ajudando Sara a rastrear os passos da irmã até o desaparecimento da própria Sara na madrugada de 1º de julho.",
      informacao_livre: "Explica que Sara vinha sentindo dores lancinantes nas últimas semanas e que estava sendo coagida pela diretoria do Colégio Primórdio e pela Dra. Melissa Vane a 'fazer um tratamento definitivo'. Confirma que Sara sumiu na madrugada de 1º de julho e que a polícia local recusou o boletim de ocorrência sob a alegação de 'fuga voluntária de adolescente rebelde'.",
      segredo_util: "Possui a gravação original da secretária telefônica onde Constança diz expressamente: 'O caminho está preparado, Sara. Trisha está esperando'. Além disso, sabe a localização exata da entrada clandestina da Mata do Norte pelo túnel de drenagem do Ferro-Velho.",
      gatilho_revelacao: "Apresentar um pertence pessoal autêntico de Sara (como a chave do armário 44 ou o caderno de rascunhos), obter Sucesso em Diplomacia DT 7 com juramento solene de justiça, ou passar em Intuição DT 8 provando que o grupo não trabalha para a Fundação Montenegro.",
      ligacao_misterio: "Aliado-Chave e Vítima Secundária. É a bússola investigativa e testemunha viva que conecta o Colégio Primórdio, o Café da Névoa e o Ferro-Velho à elite de Mina de Prata."
    },

    'constanca_montenegro': {
      id: 'constanca_montenegro',
      nome: "Diretora Constança Montenegro • Reitora do Colégio Primórdio & Matriarca",
      personalidade: "Elegante, aristocrática, impassível e paternalista. Fala de maneira suave e polida, disfarçando crueldade ritual sob o pretexto de 'piedade humanitária' e 'manutenção da ordem social'.",
      historia_resumida: "Matriarca da linhagem fundadora de Fragktus e responsável por selecionar jovens desenganados ou sem amparo familiar para renovar o pacto da cidade com a entidade 'Ele' na Mata do Norte em troca da opulência mineral contínua da região.",
      informacao_livre: "Lamenta publicamente com pesar controlado o desaparecimento de Sara, afirmando que a garota estava 'muito fragilizada pela doença' e que a escola prestou todo o apoio médico e psicológico possível.",
      segredo_util: "Admite em privado que foi ela própria quem conduziu Sara em seu sedan preto na madrugada de 01/07 até o KM 18 da floresta, convencida de que 'entregá-la a Ele' era a cura prometida contra a agonia do sarcoma terminal.",
      gatilho_revelacao: "Apresentar os registros fiscais com carimbo do gabinete escolar recuperados do cofre (Intimidação DT 9) ou confrontá-la com o vídeo do sedan na guarita (Investigação DT 8).",
      ligacao_misterio: "Cúmplice Principal / Mentora do Sacrifício. Articulou a entrega de Trisha em 2060 e de Sara em 2061."
    },

    'dra_melissa_vane': {
      id: 'dra_melissa_vane',
      nome: "Dra. Melissa Vane • Diretora Clínica da Renovare",
      personalidade: "Fria, calculista, metódica e defensiva. Reage com arrogância a qualquer questionamento sobre seus laudos médicos, mas demonstra nervosismo ao ser confrontada com o histórico de Trisha Auguil.",
      historia_resumida: "Médica oncologista responsável pelo prontuário de Sara e antiga médica de Trisha. Recebia doações milionárias da Fundação Montenegro para atestar 'incurabilidade absoluta' e prescrever calmantes alucinógenos que facilitavam a indução psicológica.",
      informacao_livre: "Afirma que Sara estava em estágio terminal de sarcoma grau 4 e que foi transferida para 'cuidados paliativos domiciliares' sob a tutela da diretora do colégio a pedido da própria paciente.",
      segredo_util: "Guarda na gaveta de seu armário pessoal a apólice de seguro de vida de Sara no valor de 2 milhões de reais com a Clínica Renovare como beneficiária exclusiva, além das gravações de telemetria da simbiose na floresta.",
      gatilho_revelacao: "Confrontar com o frasco de sedativo adulterado furtado da farmácia (Medicina DT 7 ou Investigação DT 7) ou ameaçar denúncia no Conselho de Ética Médica com os laudos falsos (Intimidação DT 8).",
      ligacao_misterio: "Cúmplice Médica e Beneficiária Financeira. Forneceu a base farmacológica e diagnóstica para validar os sumiços perante as autoridades."
    },

    'rato_ferro_velho': {
      id: 'rato_ferro_velho',
      nome: "Dorival 'O Rato' Silveira • Receptador do Ferro-Velho",
      personalidade: "Cínico, covarde, ganancioso e oportunista. Só coopera sob chantagem financeira ou ameaça física evidente; guarda provas contra todos os seus clientes para chantagem futura.",
      historia_resumida: "Dono do ferro-velho clandestino da periferia norte. É o encarregado extraoficial de queimar arquivos, desmontar veículos e apagar rastros de acidentes da elite de Fragktus.",
      informacao_livre: "Diz que não sabe de nada sobre alunas desaparecidas e reclama que a polícia só vem cobrar propina enquanto os cães do canil não deixam ninguém dormir.",
      segredo_util: "Possui a gravação das câmeras ilegais da estrada mostrando o sedan preto de Constança transportando Sara às 02h14 de 01/07 e esconde as peças do para-choque com sangue e resina de pinheiro antes de triturar o veículo.",
      gatilho_revelacao: "Intimidação física direta (DT 6), suborno de 500 moedas em dinheiro vivo, ou ameaça de denunciar suas prensas de desmanche à corregedoria (Lábia DT 7).",
      ligacao_misterio: "Testemunha Comprada e Eliminador de Evidências. Foi pago para triturar o sedan e apagar vestígios do transporte de Sara."
    },

    'prof_edward': {
      id: 'prof_edward',
      nome: "Prof. Edward Fontes • Historiador & Arquivista Regional",
      personalidade: "Erudito, esquivo, amedrontado e melancólico. Fala em meias-palavras, citando metáforas históricas para testar a lealdade e a sanidade de quem conversa com ele.",
      historia_resumida: "Professor titular de história do Colégio Primórdio há 30 anos. Durante décadas reuniu registros municipais, recortes censurados e cartas do século XIX que provam o padrão cíclico de sacrifícios da cidade a cada 25 anos.",
      informacao_livre: "Compartilha a história oficial da fundação de Fragktus em 1880 pela família Montenegro e comenta que 'a prosperidade da cidade sempre custou caro àqueles que não tinham como se defender'.",
      segredo_util: "Entrega o manuscrito original de 1910 descrevendo a entidade 'Ele' como um organismo primordial vegetal sob o carvalho central da mata que devora a carne mas preserva as memórias e sentimentos em um 'sonho pacífico eterno'.",
      gatilho_revelacao: "Demonstrar conhecimento de Ocultismo ou História DT 6 e provar que o grupo busca resgatar a verdade de Sara e Trisha sem sensacionalismo acadêmico.",
      ligacao_misterio: "Aliado Acadêmico e Guardião da Memória. É o único habitante civil que compreende a mitologia real da cidade sem fazer parte do culto."
    },

    'sara_auguil': {
      id: 'sara_auguil',
      nome: "Sara Auguil • A Jovem Desaparecida",
      personalidade: "Sensível, corajosa, leal à irmã Trisha e exausta da dor física lancinante do câncer. Demonstrava resignação serena nos seus últimos dias terrestres.",
      historia_resumida: "Estudante de 17 anos do Colégio Primórdio e herdeira do Café da Névoa. Após o sumiço da irmã Trisha em 2060, dedicou sua vida a investigar o condomínio Mina de Prata. Ao descobrir o diagnóstico de sarcoma incurável em estágio avançado, foi seduzida pela promessa mística de cessar sua agonia física e reencontrar Trisha na simbiose com a floresta.",
      informacao_livre: "Presente através de seus diários, cartas no Café da Névoa e mensagens de despedida aos amigos nos murais do colégio: 'A dor tá insuportável... mas eu descobri onde a Trisha está. Eu não tenho medo do escuro'.",
      segredo_util: "No interior do oco do Carvalho Ancestral na Mata do Norte, a consciência vegetal de Sara e Trisha permanece unida à entidade em harmonia pacífica irreversível.",
      gatilho_revelacao: "Atingir o centro da clareira do Carvalho Ancestral na Mata do Norte com Ocultismo DT 8 ou Percepção DT 8.",
      ligacao_misterio: "Vítima Central do Desaparecimento e Ponto Focal da Conspiração. Sua jornada conduz toda a investigação da campanha."
    }
  };

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
    "npcs_presentes": [
      "gustavo",
      "constanca_montenegro",
      "prof_edward",
      "sara_auguil"
    ],
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
    "npcs_presentes": [
      "sara_auguil",
      "constanca_montenegro"
    ],
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
