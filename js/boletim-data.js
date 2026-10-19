/* ============================================================
   WUITALUR RPG — BANCO DE DADOS DOS BOLETINS
   Novidades, atualizacoes do sistema, historia e curiosidades
   (Zero Emojis, Formato Extensivel)
   ============================================================ */

const BOLETINS_DATA = [
  {
    id: "edicao-02",
    numero: 2,
    edicao: "Edição #2",
    epoca: "Outubro 2026",
    data: "19 de Outubro de 2026",
    dataIso: "2026-10-19",
    titulo: "Primeiros Passos da Edição 2.0",
    subtitulo: "Atributos novos, não vai mais usar d20, lista de perícias enxuta e o novo molde das raças.",
    autor: "Mestre",
    tempoLeitura: "3 min",
    resumo: "Como prometido no último boletim, já comecei a planejar a nova versão do sistema. Aqui estão as primeiras decisões fechadas sobre dados, atributos, perícias e raças.",
    tags: ["Sistema 2.0", "Regras", "Novidades"],
    conteudoHtml: `
      <section class="boletim-section">
        <h3 class="boletim-section-title">Começando a planejar o sistema novo</h3>
        <p class="boletim-lead">
          Como eu falei no outro boletim, sentei pra começar a rabiscar a versão 2.0 do sistema.
        </p>
        <p>
          Só lembrando que o sistema padrão continua sendo de fantasia, com as classes, magias e os elementos normais. Aquela parada de colégio e terror que a gente tá jogando agora é só da nossa campanha com o suplemento de Fios do Medo.
        </p>
        <p>
          O objetivo dessa versão 2.0 é basicamente tirar o que tava chato e enrolado do sistema antigo. Coisa tipo ter que fazer conta com potência pra achar a defesa do personagem, ter 800 de mana pra ficar controlando no papel e ficar somando bônus toda hora. Quero algo que seja rápido de jogar na mesa.
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Não vai mais usar d20</h3>
        <p>
          A primeira coisa é que não vamos mais usar d20. O d20 é muito 8 ou 80 e precisava de um monte de número somado pra fazer sentido. Agora a rolagem vai ser no d12:
        </p>
        <ul class="boletim-list">
          <li><strong>Teste normal:</strong> Rola 1d12 puro (de 1 a 12).</li>
          <li><strong>Teste com atributo especializado:</strong> Rola 1d12 + 2 (de 3 a 14). Na hora de criar a ficha você escolhe 2 atributos pra ser especializado.</li>
          <li><strong>Dificuldades:</strong> 6 pra coisa tranquila, 8 pra situação de perigo comum, 10 pra difícil, 12 pra quase impossível e 13 ou 14 pra coisas lendárias (que só quem é especializado consegue bater).</li>
          <li>Tirar 12 no dado é crítico e tirar 1 dá ruim.</li>
        </ul>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">5 Atributos em vez de 8</h3>
        <p>
          Aqueles 8 atributos antigos eram meio redundantes. Não fazia sentido ter Saúde e Resistência Física separados, e Fama não precisava ser um atributo base. Agora são só 5:
        </p>
        <ul class="boletim-list">
          <li><strong>Força:</strong> Dano físico, carregar peso e armas pesadas.</li>
          <li><strong>Destreza:</strong> Reflexo, esquiva, pontaria e agilidade.</li>
          <li><strong>Vigor:</strong> Fôlego, aguentar porrada, veneno e cansaço (juntei Saúde e Resistência Física aqui).</li>
          <li><strong>Mente:</strong> Lógica, conhecimento, alquimia e dedução.</li>
          <li><strong>Expressão:</strong> Conversa, lábia, intimidação e liderança.</li>
        </ul>
        <p>
          <em>O Cosmo não é mais um atributo comum, vai ser uma trilha separada.</em>
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Menos perícias e sistema de vantagem</h3>
        <p>
          Tinha mais de 36 perícias e metade quase nunca entrava em jogo. Reduzi pra 12:
        </p>
        <ul class="boletim-list">
          <li><strong>Físicas:</strong> Acrobacia, Furtividade e Atletismo.</li>
          <li><strong>Mentais / Exploração:</strong> Investigação, Medicina, Ofício, Astral, Sobrevivência e Percepção.</li>
          <li><strong>Sociais:</strong> Persuasão, Enganação e Intimidação.</li>
        </ul>
        <p>
          Cada um escolhe 4 perícias treinadas. E o treino agora funciona com vantagem: você rola 2d12 e pega o maior. Se tiver atributo especializado junto, soma +2 nesse maior. Assim quem é bom em algo não fica falhando à toa por azar no dado.
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Como vão funcionar as raças</h3>
        <p>
          As 11 raças continuam no jogo, mas sem aquela lista gigante de poderes passivos que ninguém lembrava na hora da sessão. Cada raça vai ter:
        </p>
        <ul class="boletim-list">
          <li>Um bônus básico ou resistência elemental.</li>
          <li>Uma mecânica própria que muda o jeito de jogar com ela (tipo a carcaça do E.X.O., o espectro não ter cura comum, a fome do vampiro, etc).</li>
          <li>Só uma habilidade ativa, pra deixar o foco nas classes.</li>
        </ul>
      </section>

      <div class="boletim-callout highlight-gold">
        <div class="boletim-callout-header">
          <span class="boletim-callout-tag">Próximos passos</span>
          <span class="boletim-callout-title">O que falta ver</span>
        </div>
        <p>
          Agora falta eu fechar como vai ser a defesa nas lutas, diminuir os números da Energia Astral (EA) pra ficar fácil de marcar e passar as classes pro sistema novo.
        </p>
        <p>
          Conforme eu for terminando essas partes eu coloco aqui. Qualquer dúvida ou ideia me mandem no chat.
        </p>
      </div>
    `
  },
  {
    id: "edicao-01",
    numero: 1,
    edicao: "Edição #1",
    epoca: "Outubro 2026",
    data: "18 de Outubro de 2026",
    dataIso: "2026-10-18",
    titulo: "Sessão de Ontem e o Novo Sistema",
    subtitulo: "Agradecimento pela sessão, ritmo das próximas e os planos para uma nova versão do sistema.",
    autor: "Mestre",
    tempoLeitura: "2 min",
    resumo: "Valeu por terem ido ontem. Um aviso sobre o ritmo das próximas sessões e o anúncio de uma reformulação geral do sistema.",
    tags: ["Campanha", "Sistema", "Atualizações"],
    conteudoHtml: `
      <section class="boletim-section">
        <h3 class="boletim-section-title">Sobre a Sessão de Ontem</h3>
        <p class="boletim-lead">
          Bom dia gente. Valeu por terem ido pra sessão ontem, espero que vocês tenham se divertido e etc. Deu bastante trabalho fazer tudo aquilo.
        </p>
        <p>
          Como eu quero manter essa qualidade pra todas as sessões posteriores, provavelmente vai demorar um tempo pra ter a próxima.
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Reformulação do Sistema</h3>
        <p>
          Além disso, eu quero comentar sobre algo também: o sistema padrão vai passar por uma reformulação, e passar pra uma nova versão atualizada.
        </p>
        <p>
          Isso vai rolar enquanto essa campanha acontece.
        </p>
        <p>
          Essas mudanças são mudanças gerais, vou praticamente refazer o sistema do zero, saindo um pouco de ser praticamente uma reconstrução do sistema de Ordem Paranormal e Tormenta 20.
        </p>
        <p>
          Meu objetivo no geral é deixar o sistema mais simples, porém mantendo ainda a investigação, possibilidade de builds e etc, porém sendo algo mais original.
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Coisas que Pretendo Alterar</h3>
        <p>
          É apenas comentando por cima algumas coisas que pretendo mexer:
        </p>
        <ul class="boletim-list">
          <li>Diminuir a quantidade de atributos.</li>
          <li>Diminuir a quantidade de habilidades de classe e arquétipo.</li>
          <li>Fazer o rework de algumas mecânicas de classe de algumas classes.</li>
          <li>Simplificar algumas perícias.</li>
          <li>Talvez mudar a rolagem do RPG, deixando de ser d20 ou só mudando pra um novo tipo de rolagem mais interessante e simples.</li>
        </ul>
      </section>

      <div class="boletim-callout highlight-rose">
        <div class="boletim-callout-header">
          <span class="boletim-callout-tag">Aviso</span>
          <span class="boletim-callout-title">O que acontece com o sistema atual?</span>
        </div>
        <p>
          O sistema atual dessa versão ainda vai existir, e vai estar na aba de <strong>Suplementos</strong> quando eu tiver terminado esse novo sistema.
        </p>
        <p>
          Com o tempo, eu vou atualizando vocês e explicando as coisas novas.
        </p>
      </div>
    `
  }
];

if (typeof window !== 'undefined') {
  window.BOLETINS_DATA = BOLETINS_DATA;
}
