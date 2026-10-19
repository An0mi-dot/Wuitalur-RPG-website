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
    subtitulo: "Atributos novos, adeus ao d20, lista de perícias enxuta e o novo molde das raças.",
    autor: "Mestre",
    tempoLeitura: "3 min",
    resumo: "Como prometido no último boletim, já comecei a planejar a nova versão do sistema. Aqui estão as primeiras decisões fechadas sobre dados, atributos, perícias e raças.",
    tags: ["Sistema 2.0", "Regras", "Novidades"],
    conteudoHtml: `
      <section class="boletim-section">
        <h3 class="boletim-section-title">O Plano Começando a Tomar Forma</h3>
        <p class="boletim-lead">
          Como eu tinha comentado no boletim anterior, comecei a planejar como vai ser a <strong>Edição 2.0</strong> do sistema de Wuitalur RPG.
        </p>
        <p>
          Lembrando que o nosso sistema base continua sendo focado em <strong>fantasia com poderes, magia elemental e builds estilosas</strong>. O lance mais investigativo e de horror da nossa mesa atual (com colégio, conspirações e etc) é só do suplemento <em>Fios do Medo</em>, não do sistema padrão.
        </p>
        <p>
          A ideia dessa versão 2.0 é tirar de vez toda aquela burocracia herdada de D&D, Tormenta e Ordem: nada de fórmulas malucas com potências na defesa, nada de somar bônus gigantescos e nada de ter centenas de pontos de mana pra ficar anotando toda hora. É pra ser simples, rápido e direto de jogar.
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Adeus ao d20: O Novo Motor no d12</h3>
        <p>
          A primeira grande mudança é que vamos <strong>sair do d20 tradicional</strong>. O d20 tem muita loteria e dependia de empilhar bônus infinitos na ficha. A partir de agora, o motor de Wuitalur vai rodar no <strong>d12</strong>, de um jeito bem mais direto:
        </p>
        <ul class="boletim-list">
          <li><strong>Teste Comum:</strong> Você rola apenas <strong>1d12 seco</strong> (resultado de 1 a 12).</li>
          <li><strong>Teste Especializado:</strong> Rola <strong>1d12 + 2</strong> (resultado de 3 a 14). Na criação da ficha, você escolhe 2 Atributos Especializados.</li>
          <li><strong>Dificuldades Simples:</strong> 6 (Rotineira), 8 (Desafio comum/perigo ativo), 10 (Difícil), 12 (Heroica, limite humano) e 13 ou 14 (Lendária, exclusiva de quem é Especializado).</li>
          <li><strong>Críticos:</strong> Tirar 12 natural é um Acerto Crítico decisivo. Tirar 1 é uma Complicação.</li>
        </ul>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Os 5 Novos Atributos Base</h3>
        <p>
          Em vez daqueles 8 atributos antigos que geravam confusão (como separar Saúde de Resistência Física, ou ter Fama como atributo), agora teremos apenas <strong>5 Atributos limpos e bem definidos</strong>:
        </p>
        <ul class="boletim-list">
          <li><strong>FORÇA (FOR):</strong> Potência muscular, peso, armas pesadas e impacto.</li>
          <li><strong>DESTREZA (DES):</strong> Reflexos rápidos, pontaria, esquiva e acrobacia.</li>
          <li><strong>VIGOR (VIG):</strong> Saúde corporal, fôlego e tolerância a venenos e cansaço (juntou a antiga Saúde e Resistência Física).</li>
          <li><strong>MENTE (MEN):</strong> Raciocínio, lógica, dedução, alquimia e saberes arcanos.</li>
          <li><strong>EXPRESSÃO (EXP):</strong> Comunicação, lábia, persuasão, intimidação e comando (substituiu Carisma e Fama, sem ficar com cara de outros sistemas).</li>
        </ul>
        <p>
          <em>Nota: O Cosmo deixou de ser atributo comum e vai funcionar como uma trilha mística própria de corrupção e poder.</em>
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">De 36 para 12 Perícias (Com Vantagem)</h3>
        <p>
          Aquela lista gigante de mais de 36 perícias cheia de coisas que quase ninguém usava foi enxugada. Agora temos exatamente <strong>12 perícias essenciais</strong>:
        </p>
        <ul class="boletim-list">
          <li><strong>Físicas:</strong> Acrobacia, Furtividade e Atletismo.</li>
          <li><strong>Mentais e Exploração:</strong> Investigação, Medicina, Ofício, Astral, Sobrevivência e Percepção.</li>
          <li><strong>Sociais:</strong> Persuasão, Enganação e Intimidação.</li>
        </ul>
        <p>
          Cada personagem vai escolher <strong>4 perícias treinadas</strong>. E a mecânica funciona assim: ser treinado em uma perícia agora te dá <strong>Vantagem (rola 2d12 e escolhe o maior)</strong>. Se você também tiver o atributo especializado, soma +2 no dado mais alto. Isso evita aquela situação chata de um especialista experiente tirar 1 no dado e falhar numa tarefa simples.
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">O Novo Molde das 11 Raças</h3>
        <p>
          Todas as 11 raças originais de Wuitalur continuam (Akivus, Animalescos, Plantíferos, Humanos, Vampiros, Dragão Anão, Insectóides, Praguentos, Abissais, E.X.O.s e Espectros).
        </p>
        <p>
          Porém, para ninguém ter uma ficha cheia de traços passivos difíceis de lembrar, cada raça agora segue um molde padronizado:
        </p>
        <ul class="boletim-list">
          <li><strong>Bônus de Raça:</strong> Uma resistência ou fraqueza elemental, ou uma perícia cultural.</li>
          <li><strong>Mecânica Única Profunda:</strong> Algo que muda a forma de jogar com aquela espécie (como os Pontos de Chassi e autorreparo do E.X.O., a estabilidade e falta de cura biológica do Espectro, a biomassa do Praguento, a fome do Vampiro, etc.).</li>
          <li><strong>Uma Habilidade Ativa Marcante:</strong> Apenas um poder ativo por raça, deixando espaço para as classes brilharem.</li>
        </ul>
      </section>

      <div class="boletim-callout highlight-gold">
        <div class="boletim-callout-header">
          <span class="boletim-callout-tag">Próximos Passos</span>
          <span class="boletim-callout-title">O Que Vem Pela Frente</span>
        </div>
        <p>
          Os próximos tópicos que vou desenhar são o sistema de <strong>Defesa no combate</strong> (sem contas malucas), a calibragem da <strong>Energia Astral (EA)</strong> para valores menores e fáceis de controlar, e a adaptação das nossas classes para encaixar no motor de d12.
        </p>
        <p>
          Conforme as coisas forem ficando prontas, vou soltando mais boletins por aqui. Depois me falem o que acharam dessa direção inicial.
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
