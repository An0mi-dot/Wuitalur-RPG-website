/* ============================================================
   WUITALUR RPG — BANCO DE DADOS DOS BOLETINS
   Novidades, atualizacoes do sistema, historia e curiosidades
   (Zero Emojis, Formato Extensivel)
   ============================================================ */

const BOLETINS_DATA = [
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
    resumo: "Valeu por terem ido ontem! Um aviso sobre o ritmo das próximas sessões e o anúncio de uma reformulação geral do sistema.",
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
