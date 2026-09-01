const CONDITIONS = [
  { key:'agarrado', name:'Agarrado', dur:'Até ser removido', desc:'O deslocamento se torna 0, a criatura não pode realizar Ações ou Reações. A condição se encerra se um efeito remover a criatura agarrada do alcance do agressor. Pode acontecer uma intervenção de outra criatura não agarrada, concedendo vantagem nos testes de libertação.' },
  { key:'afogado', name:'Afogado', dur:'Até recuperar o fôlego', desc:'Sofre 1d10 de dano direto por turno enquanto estiver submerso sem ar.' },
  { key:'amedrontado', name:'Amedrontado', dur:'Turnos definidos ou até vencer teste de resistência', desc:'O alvo não pode se aproximar da fonte do medo. Todos os testes têm desvantagem.' },
  { key:'atordoado', name:'Atordoado', dur:'Turnos definidos', desc:'O alvo não pode realizar ações no próximo turno.' },
  { key:'cego', name:'Cego', dur:'Turnos definidos ou permanente', desc:'Sofre desvantagem em todos os testes que dependam de visão.' },
  { key:'confuso', name:'Confuso', dur:'Turnos definidos', desc:'No início de cada turno, rola 1d4: 1=ataca mais próxima, 2=move aleatório, 3=perde ação padrão, 4=age normalmente.' },
  { key:'corroido', name:'Corroído', dur:'Turnos definidos ou até neutralizar', desc:'Sofre 1d6 de dano ácido por turno. Armaduras perdem 1 de defesa a cada 2 turnos.' },
  { key:'desarmado', name:'Desarmado', dur:'Até recuperar a arma', desc:'Solta a arma atual. Precisa de ação padrão para recuperá-la ou equipar outra.' },
  { key:'doente', name:'Doente', dur:'Até curar ou receber tratamento', desc:'Desvantagem em testes físicos e mentais. Não pode recuperar PVs por descanso.' },
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
  { key:'amalgamado', name:'Amalgamado', dur:'Até remover o parasita', desc:'Sofre 1d8 por turno (ignora resistências). Se permanecer até o fim da cena, entra em Morrendo. (Podridão)' },
  { key:'enjoado', name:'Enjoado', dur:'Turnos definidos ou até vomitar', desc:'Não pode consumir itens. Desvantagem em testes de Concentração e Fortitude.' },
  { key:'inconsciente', name:'Inconsciente', dur:'Até recuperar PVs ou descanso', desc:'Incapaz de agir. Cai no chão. Falha automaticamente em testes de resistência.' },
  { key:'exposto', name:'Exposto', dur:'Turnos definidos', desc:'Armadura e defesa natural reduzidas em 50%. Ataques contra o alvo têm vantagem.' },
  { key:'intimidado', name:'Intimidado', dur:'Turnos definidos', desc:'O alvo não pode tomar a Iniciativa ou fazer Ações de Ataque contra a fonte do medo.' },
  { key:'marcado-pelo-medo', name:'Marcado pelo Medo', dur:'2 turnos', desc:'Incapaz de reagir ou tomar ações ofensivas enquanto durar o medo.' },
  { key:'marcado', name:'Marcado', dur:'Turnos definidos', desc:'O alvo recebe dano adicional de todas as fontes enquanto estiver marcado.' },
  { key:'insanidade', name:'Insanidade', dur:'Até ser curado ou estabilizado', desc:'O alvo perde o controle, agindo de forma irracional ou catatônica. Não pode realizar ações coordenadas.' },
  { key:'morrendo', name:'Morrendo', dur:'Até ser estabilizado ou morrer', desc:'O alvo está inconsciente e à beira da morte. Deve fazer salvamentos de morte a cada turno.' },
  { key:'congelado-fortalecido', name:'Congelado Fortalecido', dur:'Até receber 3 ataques', desc:'Perde o turno. Movimento reduzido a 0. Só sai ao receber 3 ataques. (Estase)' },
  { key:'caido', name:'Caído', dur:'Até levantar (Ação de Movimento)', desc:'Deitado no chão. Ataques corpo a corpo contra o alvo têm vantagem. O alvo tem desvantagem em ataques.' },
  { key:'amaldicoado', name:'Amaldiçoado', dur:'Turnos definidos', desc:'Sofre desvantagem em todos os testes. Dano recebido é aumentado em 1d6.' },
  { key:'encurralado', name:'Encurralado', dur:'Turnos definidos', desc:'Não pode se mover voluntariamente. Ataques contra o alvo têm vantagem.' }
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

    const sorted = CONDITIONS.slice().sort((a, b) => b.name.length - a.name.length);
    const namesRe = new RegExp('\\b(' + sorted.map(c => {
      let pattern = c.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Add feminine support for words ending in 'o' and 'e'
      pattern = pattern.replace(/o(?=\s|$)/g, '[oa]').replace(/e(?=\s|$)/g, '[ea]');
      return pattern + '(?:s|ns)?';
    }).join('|') + ')\\b', 'gi');

    const nameToKey = {};
    CONDITIONS.forEach(c => {
      const base = c.name.toLowerCase();
      nameToKey[base] = c.key;
      // Also add feminine variant (a→o) so "Intimidada" resolves to Intimidado
      if (base.endsWith('a')) {
        nameToKey[base.slice(0, -1) + 'o'] = c.key;
      }
    });

    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT, null, false);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach(textNode => {
      const p = textNode.parentElement;
      if (!p) return;
      if (p.closest('.cond, .cond-card, .sidebar, .page-header, .wiki-dropdown, .section-heading, h1, h2, h3, h4, h5, script, style, a, button, nav, [data-no-auto-cond]')) return;

      const text = textNode.textContent;
      if (!text.trim()) return;

      const matches = [];
      namesRe.lastIndex = 0;
      let m;
      while ((m = namesRe.exec(text)) !== null) {
        const condName = m[1];
        const lookupName = condName
          .replace(/ns$|s$/i, '')
          .split(/\s+/)
          .map(w => w.replace(/a$/i, 'o'))
          .join(' ');
        const key = nameToKey[lookupName.toLowerCase()];
        if (!key) continue;
        const before = text.slice(0, m.index).trim();
        const words = before.split(/\s+/);
        const lastWord = words.length > 0 ? words[words.length - 1].replace(/[.,;:!?()]+$/, '').toLowerCase() : '';
        // Skip common false positives where condition name is used as descriptor
        if (lastWord === 'dano' || lastWord === 'ataque' || lastWord === 'golpe' || lastWord === 'armas' ||
            lastWord === 'atirador' || lastWord === 'escudo' || lastWord === 'visão' || lastWord === 'lâmina' ||
            lastWord === 'lâmpada' || lastWord === 'grito' || lastWord === 'vibração' ||
            lastWord === 'existência' || lastWord === 'energia' || lastWord === 'flecha' || lastWord === 'tiros') continue;
        matches.push({ idx: m.index, end: namesRe.lastIndex, name: condName, key });
      }

      if (!matches.length) return;

      let result = '';
      let lastIdx = 0;
      for (const match of matches) {
        result += text.slice(lastIdx, match.idx);
        result += `<span class="cond" data-cond="${match.key}">${match.name}</span>`;
        lastIdx = match.end;
      }
      result += text.slice(lastIdx);

      const span = document.createElement('span');
      span.innerHTML = result;
      p.replaceChild(span, textNode);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => { injectStyle(); autoWrap(); wrapExisting(); });
  } else {
    injectStyle(); autoWrap(); wrapExisting();
  }
})();
