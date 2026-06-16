const CONDITIONS = [
  { key:'agarrado', name:'Agarrado', dur:'Até ser removido', desc:'O deslocamento se torna 0, a criatura não pode realizar Ações ou Reações.' },
  { key:'afogado', name:'Afogado', dur:'Até recuperar o fôlego', desc:'Sofre 1d10 de dano direto por turno enquanto estiver submerso sem ar.' },
  { key:'amedrontado', name:'Amedrontado', dur:'Turnos definidos ou até vencer teste de resistência', desc:'O alvo não pode se aproximar da fonte do medo. Todos os testes têm desvantagem.' },
  { key:'atordoado', name:'Atordoado', dur:'Turnos definidos', desc:'O alvo não pode realizar ações no próximo turno.' },
  { key:'cego', name:'Cego', dur:'Turnos definidos ou permanente', desc:'Sofre desvantagem em todos os testes que dependam de visão.' },
  { key:'confuso', name:'Confuso', dur:'Turnos definidos', desc:'No início de cada turno, rola 1d4: 1=ataca mais próxima, 2=move aleatório, 3=perde ação padrão, 4=age normalmente.' },
  { key:'corroido', name:'Corroído', dur:'Turnos definidos ou até neutralizar', desc:'Sofre 1d6 de dano ácido por turno. Armaduras perdem 1 de defesa a cada 2 turnos.' },
  { key:'desarmado', name:'Desarmado', dur:'Até recuperar a arma', desc:'Solta a arma atual. Precisa de ação padrão para recuperá-la ou equipar outra.' },
  { key:'desorientado', name:'Desorientado', dur:'Turnos definidos', desc:'Sofre desvantagem em ataques, esquivas e testes de Percepção.' },
  { key:'dilacerado', name:'Dilacerado', dur:'Turnos definidos ou até estabilizar', desc:'Recebe +2d8 de dano de qualquer fonte de dano.' },
  { key:'encantado', name:'Encantado', dur:'Turnos definidos ou até sofrer dano', desc:'Não pode atacar ou prejudicar quem o encantou. Testes de resistência com desvantagem.' },
  { key:'enfraquecido', name:'Enfraquecido', dur:'Turnos definidos', desc:'Sofre -2 em Força e Destreza. Ataques corpo a corpo causam -2d8 de dano.' },
  { key:'enraizado', name:'Enraizado', dur:'Turnos definidos ou até destruir a fonte', desc:'Preso ao solo. Não pode se mover. Ataques contra ele têm vantagem.' },
  { key:'envenenado', name:'Envenenado', dur:'Turnos definidos ou até neutralizar', desc:'Sofre 1d8 de dano por turno. Desvantagem em testes físicos.' },
  { key:'espectral', name:'Espectral', dur:'Turnos definidos', desc:'Torna-se intangível. Não pode fazer ou sofrer ataques físicos.' },
  { key:'exausto', name:'Exausto', dur:'Até descanso longo ou curto', desc:'Deslocamento e ações reduzidos à metade. Desvantagem em testes físicos.' },
  { key:'iluminado', name:'Iluminado', dur:'Turnos definidos', desc:'Desvantagem em Furtividade. Ataques contra o alvo têm +2 de acerto.' },
  { key:'paralisado', name:'Paralisado', dur:'Turnos definidos ou até dissipar', desc:'Imóvel e incapaz de agir. Falha automaticamente em testes de resistência físicos. Ataques contra ele têm vantagem.' },
  { key:'petrificado', name:'Petrificado', dur:'Permanente ou até curar', desc:'Transformado em pedra. Incapaz de agir. Tratado como objeto inerte.' },
  { key:'queimando', name:'Queimando', dur:'Turnos definidos ou até apagar', desc:'Sofre 1d8 de dano de fogo por turno. Ataques de fogo contra ele causam +1d8.' },
  { key:'sangramento', name:'Sangramento', dur:'Turnos definidos', desc:'3 graus: Leve (1d4), Normal (1d8), Grave (2d6) por turno. Aplicar de novo aumenta o grau.' },
  { key:'sobrecarga', name:'Sobrecarga', dur:'Turnos definidos ou até neutralizar', desc:'Sofre 1d6 de dano elétrico por turno. Desvantagem em precisão e testes mentais.' },
  { key:'surdo', name:'Surdo', dur:'Turnos definidos ou permanente', desc:'Não ouve. Falha automaticamente em testes baseados em som.' },
  { key:'fragmentado', name:'Fragmentado', dur:'Turnos definidos', desc:'Reduz RF e RE em 2. Desvantagem em esquivas. Ataques têm chance de crítico adicional. (Nulídrico)' },
  { key:'assombrado', name:'Assombrado', dur:'Turnos definidos ou até superar RM', desc:'Sofre 1d6 de dano mental por turno. -2 em testes mentais. (Pesadelo)' },
  { key:'infectado', name:'Infectado', dur:'Permanente até regredir', desc:'Sofre 1% da Vida Máxima enquanto avança. Reduz FR e movimento em 2. (Praga)' },
  { key:'congelado', name:'Congelado', dur:'1 rodada', desc:'Perde o turno. Movimento reduzido a 0. -2 em ações físicas por 2 turnos após sair. (Estase)' },
  { key:'amalgamado', name:'Amalgamado', dur:'Até remover o parasita', desc:'Sofre 1d8 por turno (ignora resistências). Se permanecer até o fim da cena, entra em Morrendo. (Podridão)' }
];

(function() {
  const condMap = {};
  CONDITIONS.forEach(c => { condMap[c.key] = c; });

  const tooltipCSS = `
.cond {
  position: relative;
  cursor: help;
  color: var(--attr-ea);
  border-bottom: 1px dashed rgba(245,183,0,0.3);
  transition: border-color 0.15s;
}
.cond:hover { border-color: var(--attr-ea); }
.cond .cond-popup {
  display: none;
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  background: var(--bg-elevated);
  border: 1px solid var(--border-accent);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  width: 280px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0,0,0,0.5);
  pointer-events: none;
  text-align: left;
  font-style: normal;
  font-weight: 400;
  line-height: 1.4;
}
.cond .cond-popup::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--border-accent);
}
.cond .cond-popup h5 {
  font-family: var(--font-heading);
  font-size: 0.85rem;
  color: var(--text-primary);
  margin: 0 0 2px 0;
}
.cond .cond-popup .cond-popup-dur {
  font-size: 0.68rem;
  color: var(--attr-ea);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: block;
  margin-bottom: var(--space-xs);
}
.cond .cond-popup p {
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}
.cond:hover .cond-popup { display: block; }
`;

  function injectStyle() {
    const s = document.createElement('style');
    s.textContent = tooltipCSS;
    document.head.appendChild(s);
  }

  function buildPopup(c) {
    const div = document.createElement('div');
    div.className = 'cond-popup';
    div.innerHTML = `<h5>${c.name}</h5><span class="cond-popup-dur">${c.dur}</span><p>${c.desc}</p>`;
    return div;
  }

  function wrapExisting() {
    document.querySelectorAll('.cond[data-cond]').forEach(el => {
      const c = condMap[el.dataset.cond.toLowerCase()];
      if (c && !el.querySelector('.cond-popup')) el.appendChild(buildPopup(c));
    });
  }

  function autoWrap() {
    const container = document.querySelector('.page-content') || document.querySelector('.main-wrapper') || document.body;
    if (!container) return;

    const condNames = CONDITIONS.map(c => c.name).sort((a, b) => b.length - a.length);
    const condKeys = {};
    CONDITIONS.forEach(c => { condKeys[c.name] = c.key; });

    const leadPattern = '(?:Condi[cç][aà]o:\\s*|condi[cç][aà]o\\s+|sofre\\s+(?:a\\s+)?condi[cç][aà]o\\s+|aplica\\s+(?:a\\s+)?condi[cç][aà]o\\s+|causa\\s+(?:a\\s+)?condi[cç][aà]o\\s+|recebe\\s+(?:a\\s+)?condi[cç][aà]o\\s+|entra\\s+em\\s+|sofre\\s+)';
    const re = new RegExp('(' + leadPattern + ')(' + condNames.join('|') + ')', 'gi');

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, {
      acceptNode: n => {
        const p = n.parentElement;
        if (!p || p.closest('.cond, .sidebar, .page-header, .wiki-dropdown, .section-heading, script, style')) return NodeFilter.FILTER_REJECT;
        if (p.tagName === 'A' || p.tagName === 'BUTTON') return NodeFilter.FILTER_REJECT;
        return re.test(n.textContent) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(textNode => {
      const text = textNode.textContent;
      let result = '';
      let lastIdx = 0;
      let match;
      const localRe = new RegExp(re.source, 'gi');
      while ((match = localRe.exec(text)) !== null) {
        const keyword = match[1];
        const condName = match[2];
        const key = condKeys[condName];
        if (!key) continue;
        if (textNode.parentElement.closest('.cond')) continue;
        result += text.slice(lastIdx, match.index);
        result += keyword;
        result += `<span class="cond" data-cond="${key}">${condName}</span>`;
        lastIdx = localRe.lastIndex;
      }
      if (lastIdx > 0 && lastIdx < text.length) result += text.slice(lastIdx);
      if (result) {
        const span = document.createElement('span');
        span.innerHTML = result;
        textNode.parentElement.replaceChild(span, textNode);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { injectStyle(); autoWrap(); wrapExisting(); });
  } else {
    injectStyle(); autoWrap(); wrapExisting();
  }
})();
