/* ============================================================
   WUITALUR RPG — BANCO DE DADOS DOS BOLETINS INFORMATIVOS
   Edições Oficiais, Cartas dos Criadores e Bastidores
   (Zero Emojis, Formato Extensível)
   ============================================================ */

const BOLETINS_DATA = [
  {
    id: "edicao-03-primavera-2026",
    numero: 3,
    edicao: "Edição #3",
    epoca: "Primavera 2026",
    data: "18 de Outubro de 2026",
    dataIso: "2026-10-18",
    titulo: "A Tenda de Igris, a Tela de Combate e o Retorno do Som",
    subtitulo: "Avanços decisivos na Mesa Virtual, novas relíquias de escambo e os bastidores do horror.",
    autor: "Equipe Wuitalur",
    tempoLeitura: "4 min de leitura",
    resumo: "Detalhes sobre a inauguração da Tenda de Igris com estoque permanente de frutas misteriosas, os novos controles de dados na tela de combate e respostas do Correio do Conclave.",
    tags: ["Mesa Virtual", "Igris", "Combate", "Regras", "Bastidores"],
    conteudoHtml: `
      <section class="boletim-section">
        <h3 class="boletim-section-title">Carta dos Criadores</h3>
        <p class="boletim-lead">
          Saudações a todos os Andarilhos que continuam a desbravar as brumas de Wuitalur.
        </p>
        <p>
          Nas últimas semanas, a nossa atenção esteve completamente voltada para um dos aspectos mais delicados do sistema: a sensação tangível de estar em volta de uma mesa de jogo real, mesmo através de uma tela de computador. Cada detalhe que adicionamos &mdash; desde a trepidação sutil das falas até a tensão de rolar um dado contra um oponente implacável &mdash; tem o propósito de tornar a experiência viva.
        </p>
        <p>
          Se você tem acompanhado as sessões recentes, já deve ter sentido o arrepio de quando a música para e o feixe da lanterna revela algo que não deveria estar ali. É exatamente essa atmosfera que queremos preservar neste terceiro informativo.
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">O Mercador das Sombras: A Tenda de Igris</h3>
        <div class="boletim-callout highlight-gold">
          <div class="boletim-callout-header">
            <span class="boletim-callout-tag">NOVIDADE DO SISTEMA</span>
            <span class="boletim-callout-title">Economia de Vidrilhos e Escambo Místico</span>
          </div>
          <p>
            Igris não aceita ouro comum, papel-moeda ou promessas vazias. Para negociar com ele, os personagens precisam acumular Vidrilhos &mdash; pequenas lascas cristalinas colhidas em locais onde a realidade se rompeu.
          </p>
        </div>
        <p>
          A chegada da <strong>Tenda de Igris</strong> introduziu uma camada inédita de dilema tático aos jogadores. Os itens transitórios &mdash; como o <em>Isqueiro de Prata Fria</em> ou o <em>Cantil de Chá Dourado</em> &mdash; são peças únicas e escassas. Quando dois ou mais jogadores desejam o mesmo artefato, a disputa é resolvida em uma roleta ritualística supervisionada pelo Mestre.
        </p>
        <p>
          Por outro lado, ouvimos o retorno das mesas sobre a necessidade de recursos de sobrevivência mais acessíveis. Por essa razão, as <strong>Frutas Estranhas</strong> (Verde, Roxa e Amarela) foram consagradas com estoque infinito e permanente. Elas nunca se esgotam no mostruário, permitindo que cada membro do grupo adquira seu exemplar para recuperar pontos de vida, aliviar o estresse ou restaurar pontos de esforço essenciais.
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Combate Cinematográfico e o Novo Palco de Dados</h3>
        <p>
          O combate de Wuitalur foi desenhado para ser rápido, brutal e expressivo. O novo modo de combate traz uma rampa diagonal em preto profundo com ondas vivas de pixel art inspiradas em clássicos modernos como Undertale e Deltarune, sem perder a identidade de nanquim e desgaste industrial do nosso universo.
        </p>
        <div class="boletim-box-quote">
          <p>
            "A incerteza de um teste sob pressão máxima precisa ser vista por todos no mesmo milissegundo em que o dado atinge a mesa."
          </p>
          <span class="boletim-quote-author">&mdash; Notas de Design da Mesa Virtual</span>
        </div>
        <p>
          Com a mais recente atualização, integramos a opção direta de <strong>Rolar Dados dentro da tela de combate</strong>. Tanto o Mestre quanto os jogadores agora contam com um botão no topo direito da tela para invocar a bandeja de dados a qualquer instante. Quando a rolagem ocorre, um palco central de dados desce suavemente sobre a cena, exibindo para todos os presentes o sorteio criptográfico seguro de cada face e o cálculo final do modificador.
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Correio do Conclave: Perguntas da Comunidade</h3>
        <div class="boletim-qa-block">
          <div class="boletim-qa-item">
            <div class="boletim-question">
              <strong>Pergunta:</strong> Como a Fruta Roxa atua mecanicamente sobre a barra de estresse? Ela pode anular um Colapso já engatilhado?
            </div>
            <div class="boletim-answer">
              <strong>Resposta do Conclave:</strong> A Fruta Roxa tem um efeito relaxante imediato que restaura 4 pontos na barra de estresse do consumidor. Contudo, se o personagem já tiver atingido a capacidade máxima e sofrido uma Aflição ou Colapso permanente, a fruta alivia a pressão imediata, mas a cicatriz psicológica deve ser tratada através de repouso prolongado ou cuidados de sanidade.
            </div>
          </div>

          <div class="boletim-qa-item">
            <div class="boletim-question">
              <strong>Pergunta:</strong> É possível criar novos oponentes personalizados durante a sessão sem reiniciar a mesa?
            </div>
            <div class="boletim-answer">
              <strong>Resposta do Conclave:</strong> Sim! O Gerenciador de Combate do Mestre permite digitar um nome customizado e um vídeo de fundo em tempo real. Assim que o Mestre confirma, todos os jogadores são transportados para a nova arena sem interrupções de conexão.
            </div>
          </div>
        </div>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Próximos Horizontes</h3>
        <p>
          Estamos trabalhando em novos pontos de interesse para o Mapa de Investigação, refinando o catálogo de pistas interativas e preparando expansões conceituais para as origens dos personagens. Continue atento aos chamados do sino.
        </p>
        <div class="boletim-signoff">
          <div class="boletim-signoff-line"></div>
          <div class="boletim-signoff-text">
            <strong>Pela Luz da Lanterna e pelo Sangue do Conclave,</strong><br>
            Equipe de Desenvolvimento de Wuitalur RPG
          </div>
        </div>
      </section>
    `
  },
  {
    id: "edicao-02-inverno-2026",
    numero: 2,
    edicao: "Edição #2",
    epoca: "Inverno 2026",
    data: "15 de Julho de 2026",
    dataIso: "2026-07-15",
    titulo: "Fios do Medo e a Dança com a Loucura",
    subtitulo: "O florescer do suplemento de horror investigativo e o refinamento do estresse.",
    autor: "Equipe Wuitalur",
    tempoLeitura: "5 min de leitura",
    resumo: "Concepção do suplemento Fios do Medo, as regras de investigação sob pressão, o peso dos traumas de sanidade e o design de perseguições frenéticas.",
    tags: ["Fios do Medo", "Sanidade", "Suplementos", "Investigação"],
    conteudoHtml: `
      <section class="boletim-section">
        <h3 class="boletim-section-title">A Frieza da Noite Eterna</h3>
        <p class="boletim-lead">
          O inverno chegou às terras esquecidas e, com ele, a nossa exploração mais profunda do terror psicológico.
        </p>
        <p>
          Em jogos tradicionais de fantasia, a morte física costuma ser a única consequência temida. Em Wuitalur, acreditamos que perder o controle sobre a própria mente ou ver as certezas do seu personagem ruírem tijolo por tijolo cria histórias infinitamente mais memoráveis.
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Suplemento Oficial: Fios do Medo</h3>
        <p>
          Apresentamos formalmente o suplemento <strong>Fios do Medo</strong>, um módulo filho focado em investigações urbanas claustrofóbicas e ameaças ocultas em vilarejos costeiros isolados. O suplemento traz três novos arquétipos dedicados a decifrar códigos e sobreviver a horrores inenarráveis: o <em>Perito Forense</em>, o <em>Medium Marcado</em> e o <em>Andarilho Cético</em>.
        </p>
        <div class="boletim-callout highlight-crimson">
          <div class="boletim-callout-header">
            <span class="boletim-callout-tag">HORROR INVESTIGATIVO</span>
            <span class="boletim-callout-title">O Relógio de Perseguição</span>
          </div>
          <p>
            Em Fios do Medo, monstros não esperam a iniciativa padrão em uma sala vazia. Criamos o sistema de <strong>Círculo de Perseguição</strong>, onde cada pista não resolvida acelera a aproximação da criatura pela cidade.
          </p>
        </div>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Mecânicas de Sanidade e Traumas</h3>
        <p>
          Nesta edição, detalhamos o fluxo da barra de sanidade. Cada vez que a mente de um personagem cede diante de uma revelação além da compreensão humana, o jogador não perde apenas pontos abstratos: ele adquire um <em>Gatilho de Trauma</em> que molda a interpretação do personagem até o fim da crônica.
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Correio do Conclave</h3>
        <div class="boletim-qa-block">
          <div class="boletim-qa-item">
            <div class="boletim-question">
              <strong>Pergunta:</strong> Os suplementos como Fios do Medo podem ser jogados com as regras base do livro de Wuitalur?
            </div>
            <div class="boletim-answer">
              <strong>Resposta do Conclave:</strong> Sim, completamente. Todos os suplementos compartilham o mesmo núcleo de atributos, combate e perícias. Você pode utilizar seu personagem da campanha principal em um cenário de Fios do Medo com adaptação instantânea.
            </div>
          </div>
        </div>
      </section>

      <section class="boletim-section">
        <div class="boletim-signoff">
          <div class="boletim-signoff-line"></div>
          <div class="boletim-signoff-text">
            <strong>Protejam as velas antes que o vento as apague,</strong><br>
            Equipe Wuitalur
          </div>
        </div>
      </section>
    `
  },
  {
    id: "edicao-01-outono-2026",
    numero: 1,
    edicao: "Edição #1",
    epoca: "Outono 2026",
    data: "21 de Março de 2026",
    dataIso: "2026-03-21",
    titulo: "O Despertar do Conclave — Boletim Inaugural",
    subtitulo: "Bem-vindos à nova era de Wuitalur RPG: o nascimento da plataforma web.",
    autor: "Equipe Wuitalur",
    tempoLeitura: "3 min de leitura",
    resumo: "O manifesto de criação do novo portal de Wuitalur RPG, a digitalização dos sistemas de regras, ficha interativa e a visão de futuro.",
    tags: ["Inaugural", "Manifesto", "Regras", "Plataforma"],
    conteudoHtml: `
      <section class="boletim-section">
        <h3 class="boletim-section-title">Manifesto de Abertura</h3>
        <p class="boletim-lead">
          Hoje damos o primeiro passo oficial na consolidação do universo de Wuitalur.
        </p>
        <p>
          Wuitalur nasceu de cadernos rabiscados com nanquim, dados com cantos gastos e noites inteiras passadas ao redor de uma mesa tentando responder a uma única pergunta: <em>o que acontece com homens e mulheres comuns quando eles encaram o inominável e decidem não recuar?</em>
        </p>
        <p>
          Com este portal, reunimos todas as classes, raças, perícias, origens e suplementos sob uma mesma arquitetura visual limpa, acessível e focada no que mais importa: o calor da narrativa.
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Os Pilares da Plataforma</h3>
        <p>
          O novo site foi construído para ser rápido em qualquer dispositivo &mdash; desde navegadores de desktop até celulares conectados na ponta da mesa de jogo. Entre as ferramentas inaugurais, destacamos:
        </p>
        <ul class="boletim-list">
          <li><strong>Compêndio Completo de Regras:</strong> Atributos, Condições, Sanidade e Mecânicas atualizadas.</li>
          <li><strong>Criador de Ficha Interativo:</strong> Distribuição de pontos, cálculo automático de PV e exportação limpa.</li>
          <li><strong>Mesa Virtual Sincronizada:</strong> Comunicação em tempo real, fichas ao vivo e dados descentralizados.</li>
        </ul>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">O Que Esperar Deste Boletim</h3>
        <p>
          Este boletim será a nossa ponte direta com vocês. A cada virada de estação ou lançamento relevante, publicaremos cartas abertas com os bastidores das regras, decisões de design, artes conceituais e respostas para dúvidas da comunidade.
        </p>
        <div class="boletim-signoff">
          <div class="boletim-signoff-line"></div>
          <div class="boletim-signoff-text">
            <strong>Sejam bem-vindos ao Conclave,</strong><br>
            Equipe de Criação de Wuitalur RPG
          </div>
        </div>
      </section>
    `
  }
];

if (typeof window !== 'undefined') {
  window.BOLETINS_DATA = BOLETINS_DATA;
}
