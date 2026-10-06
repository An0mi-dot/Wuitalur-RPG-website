/**
 * ============================================================
 * WUITALUR RPG â€” BANCO DE DADOS PADRONIZADO DA CAMPANHA
 * Schemas CanÃ´nicos de Ãreas (Locais) e NPCs da SessÃ£o
 * ============================================================
 */

(function (global) {
  'use strict';

  // ============================================================
  // 1. BANCO DE DADOS DE NPCS (SCHEMA PADRONIZADO)
  // ============================================================
  const CAMPAIGN_NPCS = [
    {
      id: "boneco",
      nome: "Boneco",
      papel: "NPC de Teste",
      personalidade: "Parado, calado e paciente. Existe apenas para o Mestre conferir como a interface exibe um dossiÃª completo.",
      historia_resumida: "Registro provisÃ³rio usado para validar a lista de bastidores, o painel lateral do dossiÃª e a leitura dos textos longos. Substitua por NPCs reais quando a campanha pedir.",
      informacao_livre: "Responde a qualquer pergunta com a mesma frase: \"SÃ³ estou aqui para testar.\"",
      segredo_util: "Texto de exemplo para o campo de segredo. Se vocÃª consegue ler isto sem esforÃ§o, o layout do dossiÃª estÃ¡ funcionando.",
      gatilho_revelacao: "Qualquer teste de InvestigaÃ§Ã£o com DT 5.",
      ligacao_misterio: "Nenhuma. Apenas teste de sistema."
    }
  ];

  // ============================================================
  // 2. BANCO DE DADOS DE ÃREAS (SCHEMA PADRONIZADO)
  // ============================================================
  const CAMPAIGN_AREAS = {
  "colegio-primordio": {
    "id": "colegio-primordio",
    "nome": "ColÃ©gio Integrado PrimÃ³rdio",
    "shortName": "ColÃ©gio PrimÃ³rdio",
    "svgIcon": "<svg class=\"area-svg-icon\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M22 10v6M2 10l10-5 10 5-10 5z\"></path><path d=\"M6 12v5c3 3 9 3 12 0v-5\"></path></svg>",
    "themeClass": "area-colegio-primordio",
    "district": "Setor Estudantil & CÃ­vico â€¢ Centro de Fragktus",
    "dangerLevel": "Inspetores RÃ­gidos & VigilÃ¢ncia Escolar",
    "dangerLevelClass": "warning",
    "resumo_atmosfera": "A arquitetura impÃµe-se de forma rÃ­gida e asseada. Os corredores longos possuem pisos de mosaico polido que refletem uma luz fluorescente pÃ¡lida, ladeados por filas interminÃ¡veis de cacifos de metal verde-oliva. Os passos ecoam de forma seca e solitÃ¡ria nas paredes frias, transmitindo a sensaÃ§Ã£o constante de vigilÃ¢ncia e de que as conversas nunca sÃ£o verdadeiramente privadas. No pÃ¡tio central e no ginÃ¡sio, a grandiosidade da infraestrutura serve apenas para reforÃ§ar a pequenez e a vulnerabilidade de quem ali estuda.\n\nO ar carrega uma mistura enjoativa de cera de polir, papel velho da biblioteca e desinfetante forte â€” o aroma da limpeza extrema, usado pela direÃ§Ã£o para apagar rapidamente qualquer vestÃ­gio de fraqueza, dor ou escÃ¢ndalo. Durante as aulas, um silÃªncio opressivo domina os pisos, quebrado apenas pelo tiquetaque rÃ­gido dos relÃ³gios de parede e pelo som distante e calculista de sapatos de salto alto a ecoar no rÃ©s-do-chÃ£o.\n\nA pressÃ£o social paira densa nos intervalos. Os alunos, filhos da elite local, agrupam-se com posturas impecÃ¡veis e olhares de julgamento, criando um ecossistema hostil a quem nÃ£o partilha do mesmo estatuto. Ã‰ um espaÃ§o claustrofÃ³bico e profundamente hipÃ³crita, onde o arranjo de flores mortas no corredor contrasta com a ordem imaculada da instituiÃ§Ã£o, provando aos investigadores que o sofrimento ali nÃ£o Ã© tratado, mas sim silenciado de imediato.",
    "requisitos_acesso": "Aberto ao pÃºblico das 07h00 Ã s 18h30 com uniforme escolar ou credencial de visitante. Acesso noturno requer arrombamento do portÃ£o lateral (Ladinagem DT 6) ou despistar a ronda dos inspetores de pÃ¡tio.",
    "npcs_presentes": ["boneco"],
    "pontos_de_interesse": [
      {
        "cabecalho": {
          "nome": "O ArmÃ¡rio de Sara (2Âº Andar, Corredor Norte)",
          "descricao_publica": "O armÃ¡rio metÃ¡lico nÂº 73, situado no corredor entre a biblioteca e a sala do 3Âº ano. O chÃ£o em frente e a chapa verde-oliva acolhem um memorial improvisado: vasos pequenos com cravos secos, crisÃ¢ntemos murchos, copos de plÃ¡stico com cera endurecida de velas e vÃ¡rias mensagens coladas com fita-cola. A porta estÃ¡ encostada apenas no fecho metÃ¡lico, sem cadeado."
        },
        "testes": [
          {
            "pericia": "InvestigaÃ§Ã£o",
            "ct_dt": 6,
            "informacao_revelada": "Ao inspecionar a estrutura fÃ­sica e afastar o amontoado de flores da base, nota-se que as homenagens foram fixadas em momentos distintos. Entre papÃ©is banais de estudantes, hÃ¡ um envelope denso colado com fita-cola na lateral de acesso mais difÃ­cil, bem rente Ã  dobra da porta."
          },
          {
            "pericia": "PercepÃ§Ã£o",
            "ct_dt": 6,
            "informacao_revelada": "Pelas grelhas de ventilaÃ§Ã£o do metal escapa um odor quÃ­mico de desinfetante hospitalar forte misturado com cera perfumada de flor de laranjeira, destoando completamente do pÃ³ e mofo do corredor."
          },
          {
            "pericia": "Ladinagem / Crime",
            "ct_dt": 8,
            "informacao_revelada": "O trinco interior do armÃ¡rio nÃ£o ostenta mossas, marcas de ferramentas ou sinais de gazua. Ele foi destrancado com a chave-mestra administrativa da coordenaÃ§Ã£o antes da colocaÃ§Ã£o das flores."
          },
          {
            "pericia": "IntuiÃ§Ã£o",
            "ct_dt": 6,
            "informacao_revelada": "A disposiÃ§Ã£o das velas e das jarras nÃ£o parece puramente espontÃ¢nea: segue uma ordem excessivamente simÃ©trica e limpa, tÃ­pica de algo inspecionado ou supervisionado pela prÃ³pria coordenaÃ§Ã£o escolar."
          }
        ],
        "notas_mestre": "A diretora ConstanÃ§a Montenegro acedeu ao armÃ¡rio com a chave-mestra poucas horas apÃ³s os boatos do desaparecimento de Sara. Ela higienizou o interior para remover resquÃ­cios de medicaÃ§Ã£o e autorizou o memorial como cortina de fumo. Uma busca bem-sucedida revela o CartÃ£o Envelopado."
      },
      {
        "cabecalho": {
          "nome": "O CartÃ£o Envelopado (Encontrado no ArmÃ¡rio)",
          "descricao_publica": "Um envelope de alta gramagem, feito de papel de linho texturado, sem remetente formal no exterior. No interior, hÃ¡ um cartÃ£o dobrado com a seguinte inscriÃ§Ã£o manual em caligrafia cursiva elegante: 'Que as tuas dores finalmente encontrem repouso sob a sombra do eterno silÃªncio. Foste corajosa ao aceitar o descanso que merecias. â€” C.'"
        },
        "testes": [
          {
            "pericia": "InvestigaÃ§Ã£o",
            "ct_dt": 6,
            "informacao_revelada": "O papel de linho e o corte do envelope correspondem exatamente aos materiais de expediente solene utilizados em exclusivo pela direÃ§Ã£o do ColÃ©gio PrimÃ³rdio."
          },
          {
            "pericia": "PercepÃ§Ã£o",
            "ct_dt": 6,
            "informacao_revelada": "A tinta utilizada na escrita Ã© fluida, prÃ³pria de caneta de tinta permanente num tom pÃºrpura escuro, impregnando um perfume suave de essÃªncia floral no papel."
          },
          {
            "pericia": "IntuiÃ§Ã£o",
            "ct_dt": 8,
            "informacao_revelada": "A mensagem encara a ausÃªncia de Sara como um termo definitivo e consumado, denotando que o autor conhecia a sua enfermidade latente ('as tuas dores') e sabia que a jovem partiu de livre vontade."
          }
        ],
        "notas_mestre": "O cartÃ£o foi depositado discretamente no memorial por ConstanÃ§a Montenegro. A tinta roxa Ã© o seu cunho pessoal em despachos formais. O bilhete entrega aos jogadores que alguÃ©m com a inicial 'C' na escola sabia do cancro terminal de Sara e apoiou a sua entrega Ã  entidade."
      },
      {
        "cabecalho": {
          "nome": "O BalneÃ¡rio do GinÃ¡sio (1Âº Andar, RÃ©s-do-chÃ£o - Ala Este)",
          "descricao_publica": "Um banco de madeira comprido fixo aos azulejos frios nos fundos do balneÃ¡rio feminino da quadra, prÃ³ximo Ã  saÃ­da de emergÃªncia que conduz Ã s traseiras do recinto escolar."
        },
        "testes": [
          {
            "pericia": "InvestigaÃ§Ã£o",
            "ct_dt": 6,
            "informacao_revelada": "Sob o assento do Ãºltimo banco encontram-se resÃ­duos de fita-cola recente. No vÃ£o do ralo desativado logo abaixo, foi descartado um frasco cilÃ­ndrico de remÃ©dio vazio e sem rÃ³tulo comercial, preservando apenas um cÃ³digo impresso da ClÃ­nica MÃ©dica de Mina de Prata."
          },
          {
            "pericia": "PercepÃ§Ã£o",
            "ct_dt": 8,
            "informacao_revelada": "Na parede de azulejos, atrÃ¡s da fila de armÃ¡rios, alguÃ©m usou a ponta metÃ¡lica de um compasso para riscar na argamassa: 'O gato preto estava no pÃ¡tio outra vez. Ele olhou para mim da Ã¡rvore.'"
          },
          {
            "pericia": "Medicina / Alquimia",
            "ct_dt": 6,
            "informacao_revelada": "O odor residual no frasco de vidro pertence a analgÃ©sicos opioides pesados, prescritos estritamente para o alÃ­vio de dor crÃ³nica severa em estÃ¡gios avanÃ§ados de tumores terminais."
          }
        ],
        "notas_mestre": "Sara lidava com episÃ³dios frequentes de nÃ¡useas e dores intensas. Com medo de que o seu estado de saÃºde fosse exposto perante a comunidade elitista do colÃ©gio, ela escondia-se no balneÃ¡rio vazio para se medicar em segredo."
      },
      {
        "cabecalho": {
          "nome": "O Gabinete da DireÃ§Ã£o (1Âº Andar, RÃ©s-do-chÃ£o - Ala Oeste)",
          "descricao_publica": "A secretÃ¡ria imponente de carvalho escuro de ConstanÃ§a Montenegro e um armÃ¡rio de arquivos de aÃ§o cinzento encastrado na alvenaria atrÃ¡s da sua poltrona de cabedal, protegido por uma fechadura cilÃ­ndrica de latÃ£o."
        },
        "testes": [
          {
            "pericia": "Ladinagem / Crime",
            "ct_dt": 8,
            "informacao_revelada": "Destrancar o compartimento inferior do arquivo de aÃ§o sem entortar a lingueta de metal nem disparar o alarme mecÃ¢nico instalado no batente da porta."
          },
          {
            "pericia": "InvestigaÃ§Ã£o",
            "ct_dt": 6,
            "informacao_revelada": "No fundo da gaveta hÃ¡ uma pasta suspensa rotulada 'TransferÃªncias & SaÃºde - Casos Especiais', contendo os relatÃ³rios de Trisha Auguil (ano letivo de 2060) e Sara Auguil (2061), acompanhados de cÃ³pias de laudos mÃ©dicos confidenciais."
          },
          {
            "pericia": "IntuiÃ§Ã£o",
            "ct_dt": 8,
            "informacao_revelada": "Agrafado ao laudo de Sara hÃ¡ um bilhete escrito com caneta de tinta permanente roxa: 'DegeneraÃ§Ã£o celular incurÃ¡vel confirmada. Perfil dÃ³cil e sem suporte familiar direto. Proceder com a apresentaÃ§Ã£o Ã  NÃ©voa.'"
          }
        ],
        "notas_mestre": "Prova documental direta do papel de ConstanÃ§a. A diretora usa a sua posiÃ§Ã£o de autoridade para mapear jovens desamparados e doentes graves, encaminhando-os para a entidade 'Ele' em troca de manter o seu pacto de influÃªncia e prosperidade em Fragktus."
      },
      {
        "cabecalho": {
          "nome": "A Sala de MÃºsica (2Âº Andar, Ala Sul)",
          "descricao_publica": "O piano de cauda negro encostado junto Ã s cortinas pesadas de veludo na sala de ensaio com isolamento acÃºstico, cercado por estantes de partituras e violinos guardados em caixas de madeira."
        },
        "testes": [
          {
            "pericia": "InvestigaÃ§Ã£o",
            "ct_dt": 6,
            "informacao_revelada": "Sob as cordas de aÃ§o da caixa de ressonÃ¢ncia do piano, hÃ¡ uma folha pautada de partitura com uma lista manuscrita de horÃ¡rios de saÃ­da e entrada do carro particular de ConstanÃ§a durante as madrugadas de junho."
          },
          {
            "pericia": "HistÃ³ria / Ocultismo",
            "ct_dt": 8,
            "informacao_revelada": "No verso da partitura, hÃ¡ anotaÃ§Ãµes manuais que transcrevem uma cantiga arcaica de Fragktus sobre 'Aquele que habita sob as raÃ­zes e aceita os que nÃ£o possuem futuro'."
          },
          {
            "pericia": "PercepÃ§Ã£o",
            "ct_dt": 6,
            "informacao_revelada": "O fecho da janela das traseiras estÃ¡ destravado e hÃ¡ marcas de terra seca no parapeito, indicando que o local servia de passagem clandestina para a passarela exterior do ginÃ¡sio."
          }
        ],
        "notas_mestre": "A sala de mÃºsica era o esconderijo que Sara usava para tentar compreender o que a entidade havia falado por intermÃ©dio do gato possuÃ­do e para monitorizar as movimentaÃ§Ãµes noturnas da diretora ConstanÃ§a antes de desaparecer de vez."
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
    "district": "Reserva Florestal Fechada â€¢ Zona Rural",
    "dangerLevel": "Fauna Alterada, NÃ©voa TÃ³xica & Armadilhas",
    "dangerLevelClass": "danger",
    "resumo_atmosfera": "Ãrvores centenÃ¡rias retorcidas, neblina espessa que engole os farÃ³is, silÃªncio sepulcral quebrado pelo estalar de galhos e arame farpado enferrujado sob o chÃ£o de terra Ãºmida coberto por seiva escura aromÃ¡tica.",
    "requisitos_acesso": "Ãrea isolada pelas autoridades municipais com cancelas militarizadas no KM 18 guardadas por vigilantes particulares armados. Entrada clandestina viÃ¡vel pela tubulaÃ§Ã£o de drenagem do Ferro-Velho (Atletismo DT 6) ou ravinas das serras.",
    "npcs_presentes": ["boneco"],
    "pontos_de_interesse": [],
    "conexoes_saida": [
      {
        "area_id": "colegio-primordio",
        "nome": "ColÃ©gio Integrado PrimÃ³rdio",
        "gancho": "A estrada principal que conecta o perÃ­metro rural ao centro cÃ­vico e estudantil de Fragktus."
      }
    ]
  }
};

  // ============================================================
  // EXPORTAÃ‡ÃƒO GLOBAL E MÃ“DULO
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
