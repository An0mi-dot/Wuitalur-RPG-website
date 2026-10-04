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
    'colegio-primordio': {
      id: 'colegio-primordio',
      nome: "Colégio Integrado Primórdio",
      shortName: "Colégio Primórdio",
      svgIcon: '<svg class="area-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>',
      themeClass: 'area-colegio-primordio',
      district: "Setor Estudantil & Cívico • Centro de Fragktus",
      dangerLevel: "Inspetores Rígidos & Vigilância Escolar",
      dangerLevelClass: 'warning',
      resumo_atmosfera: "Corredores ecoantes com cheiro de cera velha e desinfetante hospitalar, murais com fotos desbotadas e armários metálicos enferrujados sob a luz fluorescente fria que zune continuamente pelo teto.",
      requisitos_acesso: "Aberto ao público das 07h00 às 18h30 com uniforme escolar ou credencial de visitante. Acesso noturno requer arrombamento do portão lateral (Ladinagem DT 6) ou despistar a ronda dos inspetores de pátio.",
      npcs_presentes: ['gustavo', 'constanca_montenegro', 'prof_edward', 'sara_auguil'],
      pontos_de_interesse: [
        {
          cabecalho: {
            nome: "Armário 108 de Sara Auguil",
            descricao_publica: "Armário de latão verde-escuro no corredor do 2º Ano B, com a tinta descascada nos cantos e adesivos antigos de bandas colados na porta."
          },
          testes: [
            { pericia: "Ladinagem", ct_dt: 6, informacao_revelada: "O cadeado cede com facilidade. Dentro, atrás de livros didáticos pesados, há uma chave de vestiário colada atrás do espelho de plástico." },
            { pericia: "Investigação", ct_dt: 8, informacao_revelada: "Caderno de anotações com a folha de 30/06 arrancada e o rascunho a lápis de uma árvore gigantesca com olhos: 'Ele prometeu que a dor no peito vai parar'." }
          ],
          notas_mestre: "Sara usava o armário para ocultar os registros de suas pesquisas sobre o que ocorrera com Trisha, temendo que os inspetores revistassem sua mochila. A chave destranca o armário 44 do vestiário feminino subterrâneo."
        },
        {
          cabecalho: {
            nome: "Laboratório de Química B",
            descricao_publica: "Sala com bancadas de granito polido, bicos de Bunsen, frascos de reagentes e vidrarias sob luz fluorescente fria que zune continuamente."
          },
          testes: [
            { pericia: "Ciências", ct_dt: 6, informacao_revelada: "No quadro-negro dos fundos há a fórmula residual de um sedativo hipnótico potente de manipulação controlada, fora do currículo didático." },
            { pericia: "Investigação", ct_dt: 8, informacao_revelada: "O livro de controle de reagentes acusa a retirada de compostos anestésicos autorizada pelo carimbo oficial da Diretora Constança." }
          ],
          notas_mestre: "Constança manipulava insumos da escola para preparar chás calmantes que oferecia aos alunos selecionados, reduzindo sua resistência psicológica."
        },
        {
          cabecalho: {
            nome: "Gabinete da Diretora Constança Montenegro",
            descricao_publica: "Sala suntuosa com piso de madeira nobre, estantes repletas de tomos jurídicos, diplomas aristocráticos e grandes cortinas de veludo carmesim."
          },
          testes: [
            { pericia: "Furtividade", ct_dt: 6, informacao_revelada: "Permite esgueirar-se pela sala sem disparar o sensor de movimento da recepção." },
            { pericia: "Investigação", ct_dt: 8, informacao_revelada: "Pasta confidencial contendo cópias autenticadas dos prontuários de Sara e Trisha com carimbo da Renovare e anotação manual: 'Sem amparo familiar. Pacto selado'." },
            { pericia: "Percepção", ct_dt: 10, informacao_revelada: "Atrás do quadro do fundador na parede há um cofre cuja combinação é a data de desaparecimento de Trisha (041260)." }
          ],
          notas_mestre: "Constança gerenciava o colégio como um viveiro onde mapeava alunos desenganados, vendo a entrega das jovens a 'Ele' como um favor piedoso e um sacrifício sagrado para a família."
        },
        {
          cabecalho: {
            nome: "Memorial de Flores no Saguão Central",
            descricao_publica: "Altar público montado pela administração da escola, composto por retratos emoldurados de Sara rodeados por dezenas de crisântemos e lírios brancos."
          },
          testes: [
            { pericia: "Percepção", ct_dt: 6, informacao_revelada: "Escondido entre as folhas dos vasos há um bilhete anônimo de um estudante: 'Vocês sabem que ela não fugiu. Parem de fingir luto'." },
            { pericia: "Ocultismo", ct_dt: 8, informacao_revelada: "A distribuição geométrica das flores e velas eletrônicas reproduz exatamente o círculo de ancoragem da entidade da floresta." }
          ],
          notas_mestre: "O memorial foi erguido por Constança com duplo propósito: encerrar oficialmente os questionamentos da comunidade e energeticamente fechar o ciclo de Sara no mundo dos vivos."
        },
        {
          cabecalho: {
            nome: "Sala do Professor Edward (História Regional)",
            descricao_publica: "Gabinete entulhado de pilhas de livros antigos, recortes de jornais do século XIX, mapas coloniais de Fragktus e fósseis minerais sobre a escrivaninha."
          },
          testes: [
            { pericia: "História", ct_dt: 6, informacao_revelada: "Edward revela que a cada 25 anos registros da cidade documentam jovens debilitados que entram descalços na floresta ao norte e nunca mais retornam." },
            { pericia: "Investigação", ct_dt: 8, informacao_revelada: "Ele apresenta crônicas de 1910 sobre 'Ele': um organismo primordial da terra que oferece ausência eterna de dor em troca da assimilação voluntária da alma." }
          ],
          notas_mestre: "Edward é o único acadêmico que compreende a verdade mística de Fragktus, mas silenciou por décadas por receio de ser internado ou assassinado pela elite."
        },
        {
          cabecalho: {
            nome: "Atrás da Arquibancada da Quadra Poliesportiva",
            descricao_publica: "Espaço sombrio e empoeirado sob os degraus de concreto da arquibancada, ponto cego habitual para conversas sigilosas dos estudantes."
          },
          testes: [
            { pericia: "Percepção", ct_dt: 6, informacao_revelada: "Copo térmico descartável com o logotipo do Café da Névoa e marcas de duas pessoas que permaneceram sentadas conversando sob a chuva na véspera." },
            { pericia: "Psicologia", ct_dt: 8, informacao_revelada: "Gustavo conversou com Sara aqui; um áudio gravado no celular dele revela Sara chorando e dizendo: 'A quimioterapia não está funcionando, Gustavo. Eu só quero que a dor pare'." }
          ],
          notas_mestre: "O último momento de vulnerabilidade em que Sara quase revelou sua intenção aos amigos mais próximos antes de ser abordada pela diretora."
        },
        {
          cabecalho: {
            nome: "Sala do Grêmio Estudantil",
            descricao_publica: "Sala caótica com sofás puídos, cartazes de protesto empilhados, computadores antigos e murais com comunicados estudantis."
          },
          testes: [
            { pericia: "Investigação", ct_dt: 6, informacao_revelada: "Um rascunho de abaixo-assinado exigindo investigações reais sobre o sumiço de Trisha em 2060, censurado pela administração com ameaça de suspensão geral." },
            { pericia: "Lábia", ct_dt: 8, informacao_revelada: "O líder estudantil confessa que membros da reitoria confiscaram os panfletos sobre Sara no dia seguinte ao desaparecimento." }
          ],
          notas_mestre: "A máquina institucional do colégio agiu de imediato para blindar o nome da instituição contra qualquer repercussão policial."
        },
        {
          cabecalho: {
            nome: "Vestiário Feminino (Armário Trancado 44)",
            descricao_publica: "Vestiário esportivo subterrâneo com chão de azulejos brancos manchados e fileiras de armários numerados com respiradouros."
          },
          testes: [
            { pericia: "Ladinagem", ct_dt: 6, informacao_revelada: "A chave pequena encontrada no armário 108 destranca o compartimento de fundo duplo do armário 44." },
            { pericia: "Tecnologia", ct_dt: 8, informacao_revelada: "Pen drive contendo gravações de áudio clandestinas feitas por Sara das consultas com a Dra. Melissa Vane, onde a médica insiste na venda dos bens de Trisha." }
          ],
          notas_mestre: "Sara já desconfiava da cumplicidade da clínica e arquivou as evidências no vestiário para que não fossem encontradas durante eventuais buscas em seu quarto."
        },
        {
          cabecalho: {
            nome: "Bicicletário dos Fundos",
            descricao_publica: "Pátio cercado por alambrado alto onde alunos guardam bicicletas, próximo ao portão de serviço por onde transitam veículos de entrega."
          },
          testes: [
            { pericia: "Percepção", ct_dt: 6, informacao_revelada: "A bicicleta de Sara permanece acorrentada com os pneus deliberadamente perfurados por instrumento perfurocortante fino." },
            { pericia: "Investigação", ct_dt: 8, informacao_revelada: "Marcas de pneus de sedan no asfalto do portão de carga registradas às 17h30 de 31/06, horário em que Sara teve que aceitar carona da diretora." }
          ],
          notas_mestre: "A sabotagem do transporte de Sara forçou a garota a aceitar a carona de Constança, iniciando o isolamento final que culminou na entrega na floresta."
        },
        {
          cabecalho: {
            nome: "Sala de Servidores de TI do Colégio",
            descricao_publica: "Compartimento refrigerado anexo à biblioteca com racks de rede, modems e servidores de controle acadêmico."
          },
          testes: [
            { pericia: "Hackeamento", ct_dt: 8, informacao_revelada: "O histórico de buscas acadêmicas de Sara mostra consultas repetidas sobre: 'lenda de Ele Fragktus', 'tempo de sobrevida sarcoma grau 4' e 'Trisha Auguil desaparecida'." },
            { pericia: "Investigação", ct_dt: 10, informacao_revelada: "Recupera um e-mail rascunhado por Sara endereçado a Gustavo que não chegou a ser enviado: 'Gustavo, se eu não voltar, vá ao ferro-velho do Rato'." }
          ],
          notas_mestre: "A pista textual direta que orienta o grupo de jogadores a buscar o mecânico da periferia para desvendar a movimentação do veículo de Constança."
        }
      ],
      conexoes_saida: [
        {
          area_id: 'cafe-da-nevoa',
          nome: "Café da Névoa",
          gancho: "Ponto de encontro habitual dos alunos a três quadras do colégio; Sara costumava ir a pé após o término das aulas."
        },
        {
          area_id: 'ferro-velho',
          nome: "Ferro-Velho do Rato",
          gancho: "Mencionado no rascunho de e-mail de Sara nos servidores de TI do colégio como o destino da oficina que atendeu o sedan suspeito."
        },
        {
          area_id: 'clinica-renovare',
          nome: "Clínica Psiquiátrica Renovare",
          gancho: "Origem dos laudos médicos e das fórmulas de sedativos encontradas na pasta confidencial do gabinete da diretora."
        }
      ]
    },

    'cafe-da-nevoa': {
      id: 'cafe-da-nevoa',
      nome: "Café da Névoa",
      shortName: "Café da Névoa",
      svgIcon: '<svg class="area-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3"></path></svg>',
      themeClass: 'area-cafe-da-nevoa',
      district: "Bairro Operário & Boêmio • Centro Velho",
      dangerLevel: "Informantes nas Sombras & Escutas Ocultas",
      dangerLevelClass: 'warning',
      resumo_atmosfera: "Luz lilás tênue, aroma de café torrado misturado à umidade do asfalto, vinil chiando na vitrola antiga e janelas embaçadas pelo vapor quente que escapa da máquina de expresso.",
      requisitos_acesso: "Aberto ao público das 14h00 às 02h00. Fora do horário de expediente, entrada pelos fundos através do beco (Ladinagem DT 6) ou com a chave mestra em posse de Gustavo.",
      npcs_presentes: ['gustavo', 'sara_auguil'],
      pontos_de_interesse: [
        {
          cabecalho: {
            nome: "Beco dos Fundos & A Porta de Serviço",
            descricao_publica: "Ruela estreita e mal iluminada atrás do café, onde latas de lixo e caixotes de madeira acumulam poças de chuva sob um lampião amarelo piscante."
          },
          testes: [
            { pericia: "Ocultismo", ct_dt: 6, informacao_revelada: "Mancha circular de terra calcinada onde um gato de rua morreu em convulsão após ter seu corpo tomado temporariamente por 'Ele'." },
            { pericia: "Percepção", ct_dt: 8, informacao_revelada: "A carcaça preservada do gato esconde olhos transformados em resina vegetal âmbar, com raízes finas brotando das mandíbulas." }
          ],
          notas_mestre: "O local exato onde o pacto de Sara foi selado 12 dias antes do sumiço. A entidade falou com Sara através do felino moribundo, prometendo reencontro com Trisha e alívio de suas dores na floresta."
        },
        {
          cabecalho: {
            nome: "Balcão Principal & Caixa Registradora",
            descricao_publica: "Balcão imponente de madeira escura polida, máquina de expresso de latão brilhante e uma lousa de parede com receitas e recados com giz lilás."
          },
          testes: [
            { pericia: "Investigação", ct_dt: 6, informacao_revelada: "Fundo falso da gaveta de cédulas esconde um caderno contábil com propostas de compra milionárias do imóvel feitas por empresas de fachada de Constança, todas recusadas por Trisha." },
            { pericia: "Percepção", ct_dt: 8, informacao_revelada: "Entalhe fresco na madeira sob o tampo do balcão feito com estilete: '31 de Junho - Eu vou encontrar você, Trisha'." }
          ],
          notas_mestre: "O Café da Névoa era o símbolo da independência das irmãs Auguil. A recusa de Trisha em vender o imóvel desencadeou a perseguição que terminou em seu sumiço em 2060."
        },
        {
          cabecalho: {
            nome: "Mesa 4 (Canto junto à Janela)",
            descricao_publica: "Mesa redonda reservada em um recanto com poltronas aveludadas e cortinas pesadas, com vista para as ruas enevoadas do centro antigo."
          },
          testes: [
            { pericia: "Percepção", ct_dt: 6, informacao_revelada: "Gravador magnético em miniatura fixado com fita adesiva reforçada embaixo do centro da mesa." },
            { pericia: "Tecnologia", ct_dt: 8, informacao_revelada: "A fita revela a Dra. Melissa Vane conversando com Sara: 'Seu corpo não vai aguentar mais um mês, Sara. Fale com a Constança. Ela conhece o caminho para o mundo feliz'." }
          ],
          notas_mestre: "Sara registrou a abordagem direta de sua médica a empurrando para a órbita da diretora, comprovando a coordenação médica e psicológica do plano."
        },
        {
          cabecalho: {
            nome: "Porão Subterrâneo sob o Alçapão",
            descricao_publica: "Abaixo de um alçapão de madeira atrás do balcão, uma escada íngreme leva a um porão de pedra rústica com cheiro de mofo e terra úmida."
          },
          testes: [
            { pericia: "Sobrevivência", ct_dt: 6, informacao_revelada: "Colchão improvisado, garrafas de água e embalagens de ração mostram que Gustavo utilizou o porão como esconderijo de vigilância após o sumiço de Sara." },
            { pericia: "Investigação", ct_dt: 8, informacao_revelada: "Esboço de mapa desenhado por Gustavo marcando as rotas dos veículos de segurança privada entre o café, o colégio e a floresta." }
          ],
          notas_mestre: "Gustavo permaneceu no café por 72 horas após Sara desaparecer, reunindo as primeiras pistas antes de recuar para seu bunker impenetrável."
        }
      ],
      conexoes_saida: [
        {
          area_id: 'colegio-primordio',
          nome: "Colégio Integrado Primórdio",
          gancho: "Apenas 3 quadras de distância; Sara vinha a pé para o café logo após o término das aulas."
        },
        {
          area_id: 'refugio-gustavo',
          nome: "Refúgio do Gustavo",
          gancho: "Pelas anotações encontradas no porão sob o alçapão com as coordenadas do bunker seguro."
        },
        {
          area_id: 'mina-de-prata',
          nome: "Mina de Prata & Mansões",
          gancho: "Cartas de cobrança e intimações judiciais enviadas pelo condomínio da elite encontradas no cofre do mezanino."
        }
      ]
    },

    'ferro-velho': {
      id: 'ferro-velho',
      nome: "Ferro-Velho do Rato",
      shortName: "Ferro-Velho do Rato",
      svgIcon: '<svg class="area-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>',
      themeClass: 'area-ferro-velho',
      district: "Distrito Industrial & Sucata • Periferia Norte",
      dangerLevel: "Cães de Guarda, Sucata Pesada & Mercenários",
      dangerLevelClass: 'danger',
      resumo_atmosfera: "Montanhas de carcaças enferrujadas sob o céu cinzento de fuligem, poças de óleo diesel refletindo néon barato e latidos agressivos de cães acorrentados ao longe.",
      requisitos_acesso: "Pátio cercado por arame farpado e cães de guarda agressivos. Requer acalmar os animais (Adestramento DT 6) ou negociar permissão com o Rato no contêiner do pátio.",
      npcs_presentes: ['rato_ferro_velho', 'gustavo'],
      pontos_de_interesse: [
        {
          cabecalho: {
            nome: "Contêiner Escritório do Rato",
            descricao_publica: "Contêiner enferrujado adaptado com mesa desordenada, ventilador ruidoso, pilhas de notas fiscais falsificadas e monitores analógicos em preto e branco."
          },
          testes: [
            { pericia: "Intimidação", ct_dt: 6, informacao_revelada: "O Rato cede sob ameaça e entrega uma caixa de charutos com cartões de visita de Constança Montenegro e maços de dinheiro vivo." },
            { pericia: "Investigação", ct_dt: 8, informacao_revelada: "Anotações com a placa oficial do sedan de luxo de Constança e a ordem manuscrita: 'Troca de para-choque e descarte das peças avariadas na madrugada de 01/07'." }
          ],
          notas_mestre: "O Rato realizou serviços clandestinos de funilaria para a diretora após o carro colidir com galhos na entrada da mata, guardando recibos para futura extorsão."
        },
        {
          cabecalho: {
            nome: "Câmeras Clandestinas na Estrada da Floresta",
            descricao_publica: "Câmeras de vigilância instaladas ilegalmente pelo Rato em postes podres de madeira na rodovia vicinal que leva à cerca da reserva florestal."
          },
          testes: [
            { pericia: "Tecnologia", ct_dt: 6, informacao_revelada: "Recupera gravação da noite de 31/06 para 01/07 às 02h14: o sedan preto de Constança trafegando em alta velocidade rumo à mata." },
            { pericia: "Percepção", ct_dt: 8, informacao_revelada: "A imagem congelada permite ver Sara imóvel com a cabeça apoiada no vidro do banco do passageiro e Constança ao volante." }
          ],
          notas_mestre: "A evidência visual central do caso: Sara não fugiu sozinha; foi levada diretamente por Constança para a orla da mata."
        },
        {
          cabecalho: {
            nome: "Túnel de Drenagem para a Mata do Norte",
            descricao_publica: "Tubulação de concreto armado de 1,5m de diâmetro sob uma carcaça de caminhão betoneira, com fluxo de água correndo em direção à mata."
          },
          testes: [
            { pericia: "Atletismo", ct_dt: 6, informacao_revelada: "Permite avançar pelo interior da galeria subterrânea, evitando o cerco armado da guarita do KM 18." },
            { pericia: "Percepção", ct_dt: 8, informacao_revelada: "Marcas de pés descalços de mulher na lama do fundo do túnel seguindo em direção à clareira da floresta." }
          ],
          notas_mestre: "A rota clandestina de pedestres utilizada para acessar a orla da floresta sem chamar a atenção dos bloqueios armados da Fundação Montenegro."
        }
      ],
      conexoes_saida: [
        {
          area_id: 'floresta-proibida',
          nome: "A Mata do Norte",
          gancho: "Acesso direto e furtivo através da galeria subterrânea de drenagem no fundo do ferro-velho."
        },
        {
          area_id: 'colegio-primordio',
          nome: "Colégio Integrado Primórdio",
          gancho: "A rota diária do sedan de luxo de Constança que ligava a escola à oficina do Rato."
        },
        {
          area_id: 'clinica-renovare',
          nome: "Clínica Psiquiátrica Renovare",
          gancho: "Origem dos tambores de solventes industriais e peças de ambulância encontradas no pátio de desmanche."
        }
      ]
    },

    'clinica-renovare': {
      id: 'clinica-renovare',
      nome: "Clínica Psiquiátrica Renovare",
      shortName: "Clínica Renovare",
      svgIcon: '<svg class="area-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>',
      themeClass: 'area-clinica-renovare',
      district: "Setor Hospitalar Privado • Colina da Névoa",
      dangerLevel: "Ordem Médica, Câmeras com IA & Sedação Química",
      dangerLevelClass: 'danger',
      resumo_atmosfera: "Paredes brancas imaculadas, cheiro penetrante de éter e desinfetante hospitalar, luzes frias em tom azulado e silêncio cortado por passos apressados de enfermeiros de plantão.",
      requisitos_acesso: "Horário de visitas das 13h00 às 16h00 mediante autorização da recepção. Alas restritas exigem crachá magnético médico ou infiltração furtiva (Ladinagem DT 8 ou Furtividade DT 7).",
      npcs_presentes: ['dra_melissa_vane', 'constanca_montenegro'],
      pontos_de_interesse: [
        {
          cabecalho: {
            nome: "Quarto 12B (O Último Leito de Sara)",
            descricao_publica: "Quarto hospitalar privativo com cama articulada com lençóis de linho impecáveis, suporte para soro vazio e uma janela com grades de ferro elegantes voltada para a floresta."
          },
          testes: [
            { pericia: "Investigação", ct_dt: 6, informacao_revelada: "Prontuário médico com laudo de sarcoma em estágio IV e anotação manual com caligrafia da Dra. Melissa: 'Transferência noturna autorizada pela tutora C. Montenegro em 30/06'." },
            { pericia: "Percepção", ct_dt: 8, informacao_revelada: "Sob o colchão há um bilhete amassado com caligrafia trêmula de Sara: 'A dor vai acabar esta noite. Trisha me chamou'." }
          ],
          notas_mestre: "Sara esteve internada aqui até as 23h40 da noite de 30 de junho, de onde foi retirada em cadeira de rodas sob efeito de sedativos administrados pela equipe médica."
        },
        {
          cabecalho: {
            nome: "Farmácia Central & Arquivo de Entorpecentes",
            descricao_publica: "Sala blindada com porta de cofre de aço com vidro blindado e gaveteiros numerados contendo medicações controladas de tarja preta."
          },
          testes: [
            { pericia: "Ladinagem", ct_dt: 8, informacao_revelada: "Destranca a fechadura digital do armário de substâncias controladas sem acionar o alarme silencioso." },
            { pericia: "Química", ct_dt: 6, informacao_revelada: "Frascos de um alcaloide vegetal não catalogado na Anvisa rotulados como 'Extrato 07 - Cedido pela Fundação Montenegro'." }
          ],
          notas_mestre: "A substância administrada em Sara continha resina vegetal extraída do carvalho sagrado da Mata do Norte, que acelerava o processo de desligamento da consciência humana."
        }
      ],
      conexoes_saida: [
        {
          area_id: 'floresta-proibida',
          nome: "A Mata do Norte",
          gancho: "Destino da ambulância descaracterizada registrada no navegador GPS da doca de cargas na madrugada de 01/07."
        },
        {
          area_id: 'mina-de-prata',
          nome: "Mina de Prata & Mansões",
          gancho: "Origem dos repasses financeiros e das doações milionárias registradas nos computadores da administração."
        },
        {
          area_id: 'ferro-velho',
          nome: "Ferro-Velho do Rato",
          gancho: "Local onde os tambores de descarte de solventes e prontuários incinerados eram despachados para trituração."
        }
      ]
    },

    'floresta-proibida': {
      id: 'floresta-proibida',
      nome: "A Mata do Norte",
      shortName: "Mata do Norte",
      svgIcon: '<svg class="area-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L5 12h4l-3 6h5v4h2v-4h5l-3-6h4L12 2z"></path></svg>',
      themeClass: 'area-floresta-proibida',
      district: "Reserva Florestal Fechada • Zona Rural",
      dangerLevel: "Fauna Alterada, Névoa Tóxica & Armadilhas",
      dangerLevelClass: 'danger',
      resumo_atmosfera: "Árvores centenárias retorcidas, neblina espessa que engole os faróis, silêncio sepulcral quebrado pelo estalar de galhos e arame farpado enferrujado sob o chão de terra úmida coberto por seiva escura aromática.",
      requisitos_acesso: "Área isolada pelas autoridades municipais com cancelas militarizadas no KM 18 guardadas por vigilantes particulares armados. Entrada clandestina viável pela tubulação de drenagem do Ferro-Velho (Atletismo DT 6) ou ravinas das serras.",
      npcs_presentes: ['sara_auguil', 'constanca_montenegro'],
      pontos_de_interesse: [
        {
          cabecalho: {
            nome: "O Carvalho Ancestral & O Altar de Raízes",
            descricao_publica: "Colossal carvalho de dezenas de metros de altura no centro de uma clareira silenciosa e enevoada, cujas raízes expostas formam muralhas orgânicas contorcidas."
          },
          testes: [
            { pericia: "Ocultismo", ct_dt: 6, informacao_revelada: "O ponto focal da entidade 'Ele'. As raízes formam um casulo oco no tronco onde vidas humanas desenganadas são absorvidas para o 'mundo feliz'." },
            { pericia: "Percepção", ct_dt: 8, informacao_revelada: "No interior do oco há o sapato de Sara e fitas de tecido de seu vestido entrelaçadas em cipós que sangram seiva vegetal preta aromática." },
            { pericia: "Sobrevivência", ct_dt: 10, informacao_revelada: "Sob a névoa, a silhueta vegetal serena de Sara e Trisha Auguil pode ser entrevista na madeira viva: suas feições estão em paz, livres de dor." }
          ],
          notas_mestre: "O clímax da investigação: Sara não foi assassinada por violência convencional, mas manipulada para se entregar voluntariamente à entidade para reencontrar a irmã e escapar do câncer incurável."
        },
        {
          cabecalho: {
            nome: "Portão Militarizado do KM 18",
            descricao_publica: "Cancelas duplas reforçadas com cerca concertina cortante, refletores halógenos e guarita guarnecida por seguranças particulares armados dos Montenegro."
          },
          testes: [
            { pericia: "Furtividade", ct_dt: 6, informacao_revelada: "Permite contornar os refletores e sensores de movimento pelas ravinas laterais de mata densa." },
            { pericia: "Investigação", ct_dt: 8, informacao_revelada: "Os guardas operam sob contrato privado direto da Fundação Montenegro, com ordem expressa de atirar em qualquer civil sob pretexto de 'quarentena ambiental'." }
          ],
          notas_mestre: "A barreira física estabelecida pela elite para garantir que nenhum policial ou investigador curioso chegue perto da clareira do pacto."
        }
      ],
      conexoes_saida: [
        {
          area_id: 'ferro-velho',
          nome: "Ferro-Velho do Rato",
          gancho: "A rota de fuga subterrânea pela tubulação de drenagem sob a cerca de arame farpado."
        },
        {
          area_id: 'clinica-renovare',
          nome: "Clínica Psiquiátrica Renovare",
          gancho: "Pela rodovia vicinal onde a ambulância descaracterizada transitou até a cancela."
        },
        {
          area_id: 'mina-de-prata',
          nome: "Mina de Prata & Mansões",
          gancho: "As galerias subterrâneas da antiga mina colonial conectam as raízes da floresta aos porões das mansões."
        }
      ]
    },

    'mina-de-prata': {
      id: 'mina-de-prata',
      nome: "Mina de Prata & Mansões",
      shortName: "Mina de Prata",
      svgIcon: '<svg class="area-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>',
      themeClass: 'area-mina-de-prata',
      district: "Condomínio Fechado de Luxo • Alto da Colina",
      dangerLevel: "Vigilância Privada Armada & Câmeras com IA",
      dangerLevelClass: 'danger',
      resumo_atmosfera: "Mansões opulentas em estilo neoclássico cercadas por muros altos de pedra polida, câmeras com visão noturna, névoa fria descendo da serra e viaturas de patrulha privada circulando a cada dez minutos.",
      requisitos_acesso: "Condomínio fechado com portaria blindada e controle biométrico. Acesso civil bloqueado sem convite formal da família Montenegro ou infiltração pelas galerias de drenagem da mina.",
      npcs_presentes: ['constanca_montenegro', 'dra_melissa_vane'],
      pontos_de_interesse: [
        {
          cabecalho: {
            nome: "Mansão Auguil (Quarto Vazio de Sara)",
            descricao_publica: "Solar decadente com mobília clássica coberta por lençóis brancos, relógios de pêndulo parados e retratos da família sob luz filtrada por pesadas cortinas de veludo."
          },
          testes: [
            { pericia: "Investigação", ct_dt: 6, informacao_revelada: "No criado-mudo de Sara há correspondências da Fundação Montenegro propondo 'apoio espiritual e médico' para alívio do sofrimento." },
            { pericia: "Percepção", ct_dt: 8, informacao_revelada: "Gaveta com fundo duplo escondendo a fita cassete 07 onde Sara gravou: 'Se vocês estão ouvindo isso, eu não fui sequestrada. Eu fui encontrar a Trisha'." }
          ],
          notas_mestre: "A casa da família de Sara revela que a garota estava totalmente isolada e vulnerável após a morte dos pais e o sumiço da irmã mais velha."
        },
        {
          cabecalho: {
            nome: "Guarita Principal do Condomínio Mina de Prata",
            descricao_publica: "Estrutura blindada com vidros espelhados, cancelas automáticas de aço e monitores registrando placas de veículos 24 horas por dia."
          },
          testes: [
            { pericia: "Hackeamento", ct_dt: 6, informacao_revelada: "O registro do leitor automático de placas indica que o sedan de Constança saiu do condomínio às 01h45 de 01/07 e retornou às 04h30 sem passageiros." },
            { pericia: "Suborno / Lábia", ct_dt: 8, informacao_revelada: "O vigia confessa que recebeu ordens para apagar as gravações da câmera de entrada daquela madrugada." }
          ],
          notas_mestre: "A comprovação de horário e movimentação veicular que desmonta o álibi de que a reitora esteve dormindo em sua residência durante a noite do desaparecimento."
        }
      ],
      conexoes_saida: [
        {
          area_id: 'colegio-primordio',
          nome: "Colégio Integrado Primórdio",
          gancho: "A via expressa pavimentada utilizada diariamente pelos veículos dos diretores da fundação."
        },
        {
          area_id: 'clinica-renovare',
          nome: "Clínica Psiquiátrica Renovare",
          gancho: "Contratos de parceria médica e doações patrimoniais ligando o conselho do condomínio à clínica."
        },
        {
          area_id: 'floresta-proibida',
          nome: "A Mata do Norte",
          gancho: "As galerias subterrâneas da antiga mina colonial conectam as adegas das mansões diretamente aos túneis da floresta."
        }
      ]
    },

    'refugio-gustavo': {
      id: 'refugio-gustavo',
      nome: "Refúgio do Gustavo",
      shortName: "Refúgio do Gustavo",
      svgIcon: '<svg class="area-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><path d="M12 8v4M12 16h.01"></path></svg>',
      themeClass: 'area-refugio-gustavo',
      district: "Bunker Subterrâneo Clandestino • Localização Confidencial",
      dangerLevel: "Paranoia Extrema, Armadilhas Caseiras & Escutas",
      dangerLevelClass: 'danger',
      resumo_atmosfera: "Luz de emergência vermelha, paredes forradas com cortiça e mapas repletos de linhas vermelhas de barbante ligando fotos, documentos e fita isolante, sob o ruído de fundo de frequências de rádio captadas.",
      requisitos_acesso: "Bunker ultra-secreto montado por Gustavo. Acesso através de porta blindada de cofre com armadilha elétrica de 2.000V (Ladinagem DT 8 ou chave geral oculta/senha de 4 dígitos transmitida por rádio).",
      npcs_presentes: ['gustavo'],
      pontos_de_interesse: [
        {
          cabecalho: {
            nome: "Mural Conspiratório das Linhas Vermelhas",
            descricao_publica: "Parede inteira forrada de cortiça com dezenas de recortes de jornais de 2060 e 2061, retratos de Sara e Trisha e fios de lã vermelha cruzando o mapa de Fragktus."
          },
          testes: [
            { pericia: "Investigação", ct_dt: 6, informacao_revelada: "Os fios vermelhos conectam geometricamente três locais: a mansão de Constança em Mina de Prata, a Clínica Renovare e o ferro-velho do Rato." },
            { pericia: "Percepção", ct_dt: 8, informacao_revelada: "Gustavo calculou o intervalo de tempo entre o diagnóstico terminal e o sumiço: exatamente seis meses de manipulação psicológica em ambos os casos." }
          ],
          notas_mestre: "Gustavo já havia decifrado toda a engrenagem do esquema criminoso, necessitando apenas de cúmplices confiáveis para obter as provas materiais."
        },
        {
          cabecalho: {
            nome: "Bancada de Escutas & Interceptação de Rádio",
            descricao_publica: "Mesa de aço repleta de receptores de radiofrequência militares, antenas direcionais, fones acolchoados e gravadores de fita cassete em operação contínua."
          },
          testes: [
            { pericia: "Tecnologia", ct_dt: 6, informacao_revelada: "Rádio sintonizado na frequência dos vigilantes privados de Mina de Prata gravando os diálogos da patrulha." },
            { pericia: "Investigação", ct_dt: 8, informacao_revelada: "Gravação da voz de Constança orientando a queima de arquivos no ferro-velho do Rato na manhã de 01/07." }
          ],
          notas_mestre: "A chave que Gustavo entrega aos personagens para demonstrar que o desaparecimento de Sara foi uma entrega premeditada."
        },
        {
          cabecalho: {
            nome: "Secretária Eletrônica & Gravação Magnética 07",
            descricao_publica: "Aparelho analógico de secretária telefônica conectado a uma linha clonada do telefone do quarto de Sara na mansão Auguil."
          },
          testes: [
            { pericia: "Percepção", ct_dt: 6, informacao_revelada: "A última mensagem registrada às 19h00 de 31/06: a voz gélida de Constança dizendo 'O caminho está preparado, Sara. Trisha está esperando'." },
            { pericia: "Psicologia", ct_dt: 8, informacao_revelada: "A resposta entrecortada pelo choro de Sara: 'A dor tá insuportável... eu quero que pare, Constança'." }
          ],
          notas_mestre: "O registro em áudio que comprova o estado de desespero físico e a manipulação final sofrida por Sara horas antes de seu sumiço."
        }
      ],
      conexoes_saida: [
        {
          area_id: 'cafe-da-nevoa',
          nome: "Café da Névoa",
          gancho: "Tubo de ventilação reforçado que dá acesso seguro à galeria de esgoto pluvial saindo perto do café."
        },
        {
          area_id: 'colegio-primordio',
          nome: "Colégio Integrado Primórdio",
          gancho: "A rota de vigilância diária mantida por Gustavo nos horários de entrada e saída dos alunos."
        },
        {
          area_id: 'ferro-velho',
          nome: "Ferro-Velho do Rato",
          gancho: "A rota interceptada no rádio para onde o carro de Constança foi despachado para desmanche."
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
