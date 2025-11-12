// conditions.js
// Substitui menções de condições por spans com tooltip e estilização (negrito+itálico).
document.addEventListener('DOMContentLoaded', () => {
    const conditions = {
        "Queimando": `Na maioria dos casos, o alvo sofre 1d8 de dano por fogo a cada turno.\n\nDuração: Turnos definidos ou até o fogo ser neutralizado.`,
        "Envenenado": `O alvo sofre 1d4 de dano por veneno a cada turno.\n\nDuração: Turnos definidos ou até o veneno ser neutralizado.`,
        "Sangramento": `Sangramento possui três graus: Leve (1d4 por turno), Normal (1d8 por turno) e Grave (2d6 por turno).\n\nAplicar Sangramento em um alvo já afetado aumenta o grau nessa ordem: Leve → Normal → Grave.\nGrave é o grau máximo. Se aplicado novamente, o dano passa a ser 2d6 + 1d4 por turno.\nSe ainda assim Sangramento for aplicado outra vez, o alvo sofre imediatamente (2d6 + 1d4) × 2 e Desorientado e o efeito termina.`,
        "Atordoado": `O alvo não pode realizar ações no próximo turno.\n\nDuração: Turnos definidos.`,
        "Paralisado": `O alvo não pode se mover ou atacar.\n\nDuração: Turnos definidos ou até ser dissipado.`,
        "Exausto": `Reduz todas as ações pela metade.\n\nRecupera após um descanso longo.`,
        "Enfraquecido": `Diminui a Força Física em 2 pontos por turnos definidos.`,
        "Cego": `O alvo sofre desvantagem em todos os testes baseados em visão.\n\nDuração: Turnos definidos ou para sempre.`,
        "Surdo": `Não pode realizar ações que dependam de audição.\n\nDuração: Turnos definidos ou para sempre.`,
        "Enraizado": `O alvo não pode realizar ações ou movimentos, e qualquer ação de ataque contra ele tem vantagem.\n\nDuração: Turnos definidos ou até a fonte do enraizamento ser quebrada.`,
        "Desarmado": `O alvo perde sua arma atual e precisa de uma ação para recuperá-la ou equipar outra.\n\nDuração: Até recuperar a arma.`,
        "Amedrontado": `O alvo não pode se aproximar da fonte do medo e realiza ações com desvantagem.\n\nDuração: Turnos definidos ou até vencer um teste de resistência.`,
        "Confuso": `O alvo realiza ações aleatórias.\n\nDuração: Turnos definidos.`,
        "Encantado": `O alvo não pode atacar ou agir contra quem o encantou e realiza testes de resistência com desvantagem.\n\nDuração: Turnos definidos ou até sofrer dano.`,
        "Marcado": `O alvo recebe +2 de dano de qualquer ataque contra ele.\n\nDuração: Turnos definidos.`,
        "Corroído": `O alvo sofre 1d6 de dano ácido por turno, e sua armadura ou equipamento perde 1 ponto de defesa.\n\nDuração: Turnos definidos ou até neutralizar o ácido.`,
        "Petrificado": `O alvo se torna pedra, incapaz de agir.\n\nDuração: Permanente, até ser curado por magia ou efeito específico.`,
        "Exposto": `Reduz a Resistência Física em 2 pontos.\n\nDuração: Turnos definidos.`,
        "Desorientado": `O alvo sofre desvantagem em ataques, esquivas e testes de percepção.\n\nDuração: Turnos definidos.`,
        "Espectral": `O alvo se torna intangível, não podendo atacar nem ser atacado por ataques físicos.\n\nDuração: Turnos definidos.`,
        "Sobrecarga": `O alvo sofre 1d6 de dano elétrico por turno, com desvantagem em ações de precisão.\n\nDuração: Turnos definidos ou até neutralizar a eletricidade.`,
        "Afogado": `O alvo não pode respirar, perdendo 1d10 de Vida por turno enquanto permanecer submerso.\n\nDuração: Até recuperar o fôlego.`,
        "Amaldiçoado": `Penalidade de -2 em todos os testes de resistência.\n\nDuração: Permanente ou até dissipar a maldição.`,
        "Dilacerado": `O alvo recebe +2 de dano de ataques cortantes.\n\nDuração: Turnos definidos ou até estabilizar.`,
        "Iluminado": `O alvo brilha, ficando impossível de se esconder e atraindo atenção.\n\nDuração: Turnos definidos ou até apagar a luz.`,
        "Encurralado": `O alvo só pode realizar ações defensivas.\n\nDuração: Turnos definidos ou até escapar.`,
        // Elemental conditions
        "Fragmentado": `Nulídrico – O corpo do alvo é cortado por fissuras vermelhas que se espalham como rachaduras na realidade, afetando sua estabilidade física e mental.\n\nEfeitos: Reduz RF e RE em 2 pontos; desvantagem em testes de esquiva; ataques têm chance de 1d15 (CT15) de crítico adicional.\nDuração: Turnos definidos ou até suporte mágico.\nAcumulação: Não acumulável.`,
        "Assombrado": `Pesadelo – Mente invadida por ilusões.\n\nEfeitos: Sofre 1d6 de dano mental por turno; -2 em testes mentais; desvantagem em esquiva.\nDuração: Turnos definidos ou até superar teste de Resistência Mental.\nAcumulação: Não acumulável.`,
        "Infectado": `Praga – A vítima é contaminada por doença viva.\n\nEfeitos: Sofre 1% da Vida Máxima por turno; reduz FR e Movimento em 2; testes físicos com desvantagem; morte transforma em criatura de Praga em 1d4h.\nDuração: Permanente até regredir.\nAcumulação: Não acumulável.`,
        "Congelado": `Estase – O alvo é preso em gelo cósmico.\n\nEfeitos: Perde turno; Movimento 0; após sair, -2 em ações físicas por 2 turnos.\n\nDuração: 1 rodada.\nAcumulação: Não acumulável.`,
        "Amalgamado": `Podridão – Parasita pútrido se aloja no corpo.\n\nEfeitos: 1d8 de dano por turno (ignora resistências); se permanecer até fim da cena, entra em estado Morrendo.\nDuração: até remoção.\nAcumulação: Não acumulável.`
    };

    // Build a map of variant -> canonical name to cover flexions (feminino/plural)
    const canonicalNames = Object.keys(conditions);
    const variantMap = {}; // variantLower -> canonicalName

    canonicalNames.forEach(name => {
        const variants = new Set();
        variants.add(name);
        // lowercase variant
        variants.add(name.toLowerCase());

        // simple gender swap: final 'o' -> 'a' (Ex: Envenenado -> Envenenada)
        if (/o$/i.test(name)) {
            variants.add(name.slice(0, -1) + 'a');
            variants.add((name.slice(0, -1) + 'a').toLowerCase());
        }

        // common participle ending swap: 'ado' -> 'ada' (mais seguro para alguns casos)
        if (/ado$/i.test(name)) {
            variants.add(name.replace(/ado$/i, 'ada'));
            variants.add(name.replace(/ado$/i, 'ada').toLowerCase());
        }

        // plural form (simple): add trailing 's' when not already plural
        if (!/s$/i.test(name)) {
            variants.add(name + 's');
            variants.add((name + 's').toLowerCase());
        }

        // map all variants to canonical name
        variants.forEach(v => {
            variantMap[v.toLowerCase()] = name;
        });
    });

    // Phrases to ignore entirely (do not convert their internal words into tooltips)
    // Add phrases here when they refer to special class-specific mechanics, ex:
    const ignorePhrases = [
        'marcado pelo medo'
    ].map(s => s.toLowerCase());
    const maxIgnoreLen = ignorePhrases.reduce((m, p) => Math.max(m, p.length), 0);

    // Build regex from all variant keys (longer first to avoid partial matches)
    const names = Object.keys(variantMap).sort((a,b)=>b.length-a.length).map(n => escapeRegExp(n));
    const regex = new RegExp('\\b(' + names.join('|') + ')\\b', 'gi');

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Create tooltip element (delegated to CSS for animation)
    const tooltip = document.createElement('div');
    tooltip.id = 'condition-tooltip';
    // ensure initial hidden state
    tooltip.className = '';
    document.body.appendChild(tooltip);

    function showTooltip(text, x, y) {
        tooltip.textContent = text;
        // position with a small offset
        tooltip.style.left = (x + 14) + 'px';
        tooltip.style.top = (y + 14) + 'px';
        // ensure it's rendered before toggling class for transition
        tooltip.style.display = 'block';
        // force reflow
        void tooltip.offsetWidth;
        tooltip.classList.add('visible');
    }

    function hideTooltip() {
        tooltip.classList.remove('visible');
        // after transition ends, hide from layout
        const onEnd = () => {
            tooltip.style.display = 'none';
            tooltip.removeEventListener('transitionend', onEnd);
        };
        tooltip.addEventListener('transitionend', onEnd);
    }

    // Walk DOM and replace text nodes
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            if (!node.nodeValue || node.nodeValue.trim().length === 0) return NodeFilter.FILTER_REJECT;
            // Avoid replacing inside script/style or already replaced
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            if (parent.closest('script, style, .condition')) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
        }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    nodes.forEach(textNode => {
        const text = textNode.nodeValue;
        if (!regex.test(text)) return;
        const frag = document.createDocumentFragment();
        let lastIndex = 0;
        text.replace(regex, (match, p1, offset) => {
            // push preceding text
            if (offset > lastIndex) {
                frag.appendChild(document.createTextNode(text.slice(lastIndex, offset)));
            }
            // check if this match is inside an ignored phrase (case-insensitive)
            const contextStart = Math.max(0, offset - maxIgnoreLen);
            const contextEnd = Math.min(text.length, offset + match.length + maxIgnoreLen);
            const context = text.slice(contextStart, contextEnd).toLowerCase();
            let insideIgnored = false;
            for (const ip of ignorePhrases) {
                const idx = context.indexOf(ip);
                if (idx !== -1) {
                    // ensure that the match range overlaps the ignore phrase range
                    const ignoreGlobalStart = contextStart + idx;
                    const ignoreGlobalEnd = ignoreGlobalStart + ip.length;
                    const matchGlobalStart = offset;
                    const matchGlobalEnd = offset + match.length;
                    const overlap = Math.max(0, Math.min(ignoreGlobalEnd, matchGlobalEnd) - Math.max(ignoreGlobalStart, matchGlobalStart));
                    if (overlap > 0) {
                        insideIgnored = true;
                        break;
                    }
                }
            }
            if (insideIgnored) {
                // keep original text for this match (no tooltip)
                frag.appendChild(document.createTextNode(match));
                lastIndex = offset + match.length;
                return match;
            }
            // create span
            const span = document.createElement('span');
            span.className = 'condition';
            const canonical = variantMap[match.toLowerCase()];
            if (canonical) span.setAttribute('data-desc', conditions[canonical]);
            // inner content keep original casing
            const strong = document.createElement('strong');
            const em = document.createElement('em');
            em.textContent = match;
            strong.appendChild(em);
            span.appendChild(strong);
            // events
            span.addEventListener('mouseenter', (e) => {
                showTooltip(span.getAttribute('data-desc') || '', e.clientX, e.clientY);
            });
            span.addEventListener('mousemove', (e) => {
                tooltip.style.left = (e.clientX + 14) + 'px';
                tooltip.style.top = (e.clientY + 14) + 'px';
            });
            span.addEventListener('mouseleave', hideTooltip);

            frag.appendChild(span);
            lastIndex = offset + match.length;
            return match;
        });
        if (lastIndex < text.length) frag.appendChild(document.createTextNode(text.slice(lastIndex)));
        textNode.parentNode.replaceChild(frag, textNode);
    });
});
