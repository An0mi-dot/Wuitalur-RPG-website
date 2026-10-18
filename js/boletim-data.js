/* ============================================================
   WUITALUR RPG — BANCO DE DADOS DOS BOLETINS
   Novidades, atualizacoes do sistema, historia e curiosidades
   (Zero Emojis, Formato Extensivel)
   ============================================================ */

const BOLETINS_DATA = [
  {
    id: "edicao-01",
    numero: 1,
    edicao: "Edicao #1",
    epoca: "Outubro 2026",
    data: "18 de Outubro de 2026",
    dataIso: "2026-10-18",
    titulo: "Boletim #1",
    subtitulo: "Primeira edicao com novidades, sistema e historia.",
    autor: "Mestre",
    tempoLeitura: "Em breve",
    resumo: "Esta primeira edicao esta sendo preparada e tera novidades em breve.",
    tags: ["Novidades", "Boletim"],
    conteudoHtml: `
      <section class="boletim-section">
        <h3 class="boletim-section-title">Em Breve</h3>
        <p class="boletim-lead">
          O conteudo desta primeira edicao esta sendo preparado e vai sair aqui jaja.
        </p>
      </section>
    `
  }
];

if (typeof window !== 'undefined') {
  window.BOLETINS_DATA = BOLETINS_DATA;
}
