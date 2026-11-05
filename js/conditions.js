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

// O recurso de auto-wrap e tooltip flutuante de condicoes foi desativado conforme solicitado.
if (typeof window !== 'undefined') {
  window.CONDITIONS = CONDITIONS;
}

