/* ============================================================
   WUITALUR RPG — BANCO DE DADOS DOS BOLETINS INFORMATIVOS
   Edições Oficiais, Cartas dos Criadores e Bastidores
   (Zero Emojis, Formato Extensível)
   ============================================================ */

const BOLETINS_DATA = [
  {
    id: "edicao-01",
    numero: 1,
    edicao: "Edição #1",
    epoca: "Outubro 2026",
    data: "18 de Outubro de 2026",
    dataIso: "2026-10-18",
    titulo: "Boletim #1",
    subtitulo: "Primeira edição do Boletim Oficial de Wuitalur RPG.",
    autor: "Equipe Wuitalur",
    tempoLeitura: "Em breve",
    resumo: "Esta edição inaugural está sendo preparada e terá seu conteúdo publicado em breve.",
    tags: ["Inaugural", "Boletim"],
    conteudoHtml: `
      <section class="boletim-section">
        <h3 class="boletim-section-title">Em Breve</h3>
        <p class="boletim-lead">
          O conteúdo desta primeira edição do boletim está sendo preparado e será publicado aqui em breve.
        </p>
      </section>
    `
  }
];

if (typeof window !== 'undefined') {
  window.BOLETINS_DATA = BOLETINS_DATA;
}
