const SYSTEM_DATA = {
  races: [
    { id: 'abissal', name: 'Abissal', nd: 4, bonuses: { saude:-1, des:1, int:1 }, abilities: ['Visão no Escuro (ilimitado)', 'Luz Amiga (esporos brilhantes)', 'Pressentimento (percepção p/ emboscadas)', 'Telepatia (comunicação mental c/ aliados)', 'Confusão (INT vs INT+Atuação, alvo incapaz 1 rodada)', 'A Fome de Vinhas (1d7 efeito aleatório ao consumir vinhas)'], immunities: ['Praga'], weaknesses: ['Podridão'], resistances: ['Solar', 'Gélido', 'Pesadelo'] },
    { id: 'akivus', name: 'Akivus', nd: 3, bonuses: { saude:1, rf:-1, re:1 }, abilities: ['Afinidade com plantas', 'Criação de Vinhas', 'Névoa Perfumada', 'Cheiro do Perigo (8m)', 'Regeneração Verde (2d8/2min em contato solo)', 'Passo Silencioso', 'Aura de Vitalidade (+2 Saúde/RF, +25 PV 2 turnos, -70 EA)', 'Raízes Constritoras (RF CT18, 2d8/turno, -100 EA)', 'Explosão Floral (Nv10, 3d15 perfuração + 2d8 veneno)'], weaknesses: ['Podridão'], resistances: ['Sagrado', 'Gélido'] },
    { id: 'vampiros', name: 'Vampiros', nd: 4, bonuses: { saude:1, fama:1 }, abilities: ['Visão no Escuro (18m)', 'Mordida Vampírica (1d12/1d20/1d30 + Saúde)', 'Frenesi Sanguíneo (<=20% PV, ataques adicionais)', 'Vínculo de Sangue (compartilha dano/cura metade, -30 EA)'], weaknesses: ['Praga'], resistances: ['Pesadelo'] },
    { id: 'animalescos', name: 'Animalescos', nd: 2, bonuses: { des:1, sen:1 }, abilities: ['Percepção Aprimorada (SEN+2)', 'Quadrúpede (ação bônus, +4 DES, vantagem esquiva)'], weaknesses: ['Dano Sonoro'] },
    { id: 'plantiferos', name: 'Plantíferos', nd: 1, bonuses: { saude:2, fama:1 }, abilities: ['Afinidade com plantas', 'Criação de Vinhas', 'Névoa Perfumada (RE CT 18)', 'Canção das Árvores (Nv3: Punhos Rítmicos; Nv10: Ritmo de Animação)'], weaknesses: ['Solar', 'Podridão'] },
    { id: 'dragao-anao', name: 'Dragão Anão', nd: 3, bonuses: { des:1, int:1, fr:-2, rf:-2 }, abilities: ['Sopro Ancestral (3B cone, DES CT15, 3d10 elemental)', 'Conexão Sensorial (telepatia 10B)', 'Improvisador Nascido (2x/descanso)', 'Instinto de Sobrevivência (vantagem Sobrevivência/Navegação)', 'Camuflagem Natural (+2 Furtividade)', 'Ataque Escondido (1dDES×2 extra)'], note: 'Resistência Elemental: escolha Solar, Estase ou Ácido' },
    { id: 'praguentos', name: 'Praguentos', nd: 2, bonuses: { des:1, re:1, saude:-2 }, abilities: ['Manipulação do Lodo Corporal (Energia de Lodo: 180 Nv1, 400 Nv20)', 'Recuperação Rápida (+10 Energia Lodo/turno)', 'Criação de Itens de Lodo', 'Armas de Lodo (2d12+DES, 3 rodadas)', 'Tiro Lamacento (5 projéteis, 2d10+DES Podridão, 5 Energia cada)', 'Corpo de Lodo (imune dano físico 2 turnos, 50 Energia)'], weaknesses: ['Gélido', 'Solar/Fogo'], resistances: ['Praga'], immunities: ['Podridão'] },
    { id: 'humanos', name: 'Humanos', nd: 1, bonuses: { saude:1, re:1, rf:1, des:1, fr:1, int:1, fama:1, sen:1 }, abilities: ['Determinação Implacável (Saúde CT15, continua lutando)', 'Adaptação Humana (<25% PV: +2 FR, +2 DES)', 'Aprendizado Rápido (copia habilidades observadas)', 'Força de Vontade (1x/descanso longo, rerrolagem +3)', 'Inovação (+2 em testes, dobra tempo)', 'Resiliência Humana (início turno, Saúde CT14 remove condição)', 'Força Interior (1x/descanso, +2 em atributo)'], weaknesses: ['Pesadelo'] },
    { id: 'insectoides', name: 'Insectóides', nd: 2, bonuses: { des:1, re:1, int:1, fama:-4 }, abilities: ['Reputação Negativa (-4 FAMA vira +4 em Intimidação)', 'Vínculo (escolhe Podridão, Nulídrico, Pesadelo ou Sombra; ganha 2 habilidades)', 'Voo (depende do inseto)', 'Visão no Escuro (depende do inseto)', 'Escalada Aracnídea (depende do inseto)'], weaknesses: ['Solar', 'Gélido'] },
    { id: 'exos', name: 'E.X.O.s', nd: 1, bonuses: { int:1, rf:1 }, abilities: ['Conserta qualquer coisa que conheça', 'Ponto Fraco (INT p/ descobrir, 20 natural = +4d15 dano)', 'Agarrão (DES vs FR p/ imobilizar)'], immunities: ['Fogo', 'Praga'], weaknesses: ['Podridão', 'Água (-1 DES molhado)'], note: 'Modelos: Doméstico (+2 DES, -5 RF, prof Esquiva), Guerra (+1 FR, +1 RE+RF, -3 DES), Segurança (+1 RE, +1 RF)' },
    { id: 'espectros', name: 'Espect@&%s', nd: 6, bonuses: { re:1, int:2, fr:-2, saude:-99 }, abilities: ['Espectros ignoram PVs — usam Estabilidade (1d4)', 'Desvantagem interações sociais', 'Fraqueza Sagrado/Solar', 'Instável (5 testes de morte CT 19)', 'Estalo de Estática (reação após cada ação)'], weaknesses: ['Sagrado', 'Solar'], special: 'espectro' }
  ],
  origins: [
    { id: 'filho-do-abismo', name: 'Filho do Abismo', skills: ['Percepção','Intimidação'], equipment: 'Colar bioluminescente, manto preto, 10 Moedas de Prata', abilities: ['Olhos do Abismo (enxerga escuridão total 18B)', 'Intuição Sombria (vantagem Sentidos p/ emboscadas)'] },
    { id: 'guardiao-da-floresta', name: 'Guardião da Floresta', skills: ['Furtividade','Sobrevivência'], equipment: 'Kit de Herbalismo, amuleto de madeira, sementes raras, 15 Moedas de Prata', abilities: ['Vinhas Protetoras (ação bônus imobiliza 1 turno)', 'Conexão Verdejante (detecta perigos naturais)'] },
    { id: 'herdeiro-de-paladium', name: 'Herdeiro de Paladium', skills: ['Persuasão','História'], equipment: 'Símbolo familiar, roupa nobre, 5 Moedas Negras', abilities: ['Voz Inspiradora (ação bônus +1 teste aliado)', 'Nobre Presença (vantagem Persuasão c/ autoridades)'] },
    { id: 'experimento-falho', name: 'Experimento falho da Era Dourada', skills: ['Cosmo','Furtividade'], equipment: 'Kit Médico, símbolo de código gravado, frasco experimental', abilities: ['Instinto de Sobrevivência (<=5 PV: +4 PV, +2 RF)', 'Marca da Fuga (vantagem vs paralisia/mentais)'] },
    { id: 'descendente-croma', name: 'Descendente Croma', skills: ['Intimidação','Sobrevivência'], equipment: 'Manto com símbolos, pingente cristalino, 5 Moedas de Prata', abilities: ['Último Reflexo (PV<25%: +1 FR/DES/RF)', 'Instinto Prismático (vantagem vs medo <=25% PV)'] },
    { id: 'descendente-floralis', name: 'Descendente Floralis', skills: ['Atletismo','Acrobacia'], equipment: 'Cinto de couro reforçado, cantil floral, 8 Moedas de Prata', abilities: ['Surto Corporal (1x/cena +1 DES, dobra deslocamento 1 turno)', 'Vitalidade Eterna (vantagem vs exaustão)'] },
    { id: 'mercenario', name: 'Mercenário', skills: ['Intimidação','Atletismo'], equipment: 'Arma branca, escudo pequeno, saco de dormir, 3 Moedas de Ouro', abilities: ['Adaptabilidade em Combate (Ação Bônus vira Ação Padrão p/ atacar)', 'Líder de Batalha (vantagem ataque aliado 1x/descanso curto)'] },
    { id: 'campones', name: 'Camponês', skills: ['Sobrevivência','História'], equipment: 'Enxada, saco de sementes, 5 Moedas de Prata', abilities: ['Mestre da Terra (colheita/caça eficiente, dobra recursos)', 'Força Natural (carga +3)'] },
    { id: 'nerd', name: 'Nerd', skills: ['Cosmo','Investigação'], equipment: 'Cristal de Everact carregado, dispositivo de interação, 10 Moedas de Prata', abilities: ['Manipulação de Runas (vantagem sistemas de Everact)', 'Conexão Arcana (vantagem Cosmo/Investigação máquinas Everact)'] },
    { id: 'herdeiro-da-forja', name: 'Herdeiro da Forja', skills: ['História','Ofício','Engenharia'], equipment: 'Kit de ferreiro, martelo, espada simples, 15 Moedas de Prata', abilities: ['Forja Rápida (forja/repara itens simples rápido)', 'Toque de Ferro (vantagem testes de forja)'] },
    { id: 'morador-cidade-inexistente', name: 'Morador da Cidade Inexistente', skills: ['Cosmo','Percepção','História'], equipment: 'Dispositivo de Cirus, fragmento V3RE3X, equipamento antigo', abilities: ['Memória Desvanecente (vantagem p/ tecnologias incomuns)', 'Voz do Vazio (vantagem vs dano mental)'] },
    { id: 'medico', name: 'Médico', skills: ['Medicina','Alquimia'], equipment: 'Kit médico, kit de alquimia, ervas, 2 poções iniciais', abilities: ['O Salvador (Medicina vantagem em aliado caído, CT morte -1d6)', 'Socorrista Nato (curar 25 PV 1x/turno Medicina CT 18)'] },
    { id: 'guaraciense', name: 'Guaraciense', skills: ['Intimidação','Diplomacia','Engenharia'], equipment: 'Kit de ferramentas, casaco de folhas, arma, máscara', abilities: ['Guerreiro da Natureza (+2 testes perto de plantas)', 'Ciência Sustentável (modifica armas c/ plantas 1 mod ativa)'] },
    { id: 'realeza-vampirica', name: 'Realeza Vampírica', skills: ['Persuasão','História','Intimidação'], equipment: 'Kit de alquimia, colar familiar, vestes nobres, arma elegante, anel simbólico', abilities: ['Sangue Ancestral (1x/combate recupera PV metade dano próximo ataque)', 'Nobreza Sombria (vantagem Persuasão/Atuação/Intimidação)'] },
    { id: 'medroso', name: 'Medroso', skills: ['Disparada','Furtividade'], equipment: 'Itens adequados às ocupações', abilities: ['CORRA! (reação dobra movimento para longe, sem golpe oportunidade)', 'Adaptação (resistência sanidade +1 cumulativa a cada dano)'] },
    { id: 'celebridade', name: 'Celebridade', skills: ['Liderança','Barganha'], equipment: 'Itens adequados às ocupações, 1 Moeda Negra', abilities: ['Personalidade Inspiradora (aliados bônus = proficiência)', 'Carteirada (vantagem barganha/intimidação/roubo)'] },
    { id: 'ciborgue', name: 'Ciborgue', skills: ['Engenharia','Ofício'], equipment: 'Ferramentas de forja/engenharia, partes de metal, martelo de forja', abilities: ['Homem de Ferro (2 modificações metálicas)', 'Homem Bomba (explode partes, dano subclasse+6d6)'] },
    { id: 'monstro-do-mar', name: 'Monstro do Mar', skills: ['Navegação','Sobrevivência','Natação'], equipment: 'Ferramentas de localização, arma a escolha', abilities: ['Senhor das Águas (controla água, dano subclasse)', 'Bombeamento (proficiência extra FR em combate)'] },
    { id: 'insano', name: 'INSANO', skills: [], equipment: 'Nenhum', abilities: ['Doente Mental (0 sanidade inicial, +2 acertos e +1 ação por dano sanidade)', 'Insanidade (volta c/ metade HP ao cair a 0, dano sanidade em todos)'] }
  ],
  classes: [
    { id: 'cavaleiros', name: 'Cavaleiros de Paladium', nd: 2, dv: 10, sanBonus: 2, abilities: {
      1: { auto: ['Golpe Solar','Égide Radiante'], choices: [] },
      3: { auto: [], choices: [] },
      4: { auto: ['Olhar Julgador'], choices: [{ id:'cav4', options: ['Julgamento Ardente','Solo Sagrado'] }] },
      8: { auto: ['Julgamento Silencioso'], choices: [{ id:'cav8', options: ['Coroa de Chamas','Fincada Chamuscante'] }] },
      10: { auto: ['Memória das Cinzas'], choices: [{ id:'cav10', options: ['Lança do Sol','Erupção Solar'] }] },
      12: { auto: [], choices: [{ id:'cav12', options: ['Olhar da Divindade','Vontade de Paladium'] }] },
      15: { auto: [], choices: [{ id:'cav15', options: ['Vingança Solar','Fortaleza Inabalável'] }] },
      20: { auto: ['Avatar da Estrela Ardente'], choices: [] }
    }},
    { id: 'rastejantes', name: 'Rastejantes', nd: 5, dv: 8, sanBonus: 1, abilities: {
      1: { auto: [], choices: [{ id:'ras1', options: ['Toque Adoentado (Praga)','Sussurro Desorientador (Pesadelo)'] }] },
      2: { auto: ['Mente Maligna'], choices: [] },
      3: { auto: ['Invocação do Rastejos e Elemento Abissal'], choices: [] },
      4: { auto: ['Incremento'], choices: [] },
      5: { auto: ['Ataque Extra'], choices: [] },
      6: { auto: [], choices: [{ id:'ras6', options: ['Enxame Devorador (Praga)','Imbuição Aterrorizante (Pesadelo)'] }] },
      7: { auto: [], choices: [{ id:'ras7', options: ['Toque Corrosivo (Praga)','Abraço do Terror (Pesadelo)'] }] },
      8: { auto: ['Incremento'], choices: [] },
      9: { auto: [], choices: [{ id:'ras9', options: ['Sangue Pestilento (Praga)','Manto de Fobia (Pesadelo)'] }] },
      10: { auto: ['Ataque Extra'], choices: [] },
      11: { auto: [], choices: [{ id:'ras11', options: ['Ninho da Peste (Praga)','Correntes do Desespero (Pesadelo)'] }] },
      12: { auto: ['Incremento'], choices: [] },
      13: { auto: ['Troca Mente/Física'], choices: [] },
      14: { auto: [], choices: [{ id:'ras14', options: ['Peste Fulminante (Praga)','Estilhaçar Sanidade (Pesadelo)'] }] },
      15: { auto: ['Ataque Extra'], choices: [] },
      16: { auto: ['Incremento'], choices: [{ id:'ras16', options: ['Ceifa Entrópica (Praga)','Banquete de Pavor (Pesadelo)'] }] },
      19: { auto: ['Incremento'], choices: [] },
      20: { auto: ['Ataque Extra','Julgamento do Abismo'], choices: [] }
    }},
    { id: 'protegidos', name: 'Protegidos', nd: 5, dv: 8, sanBonus: 2, abilities: {
      1: { auto: ['Proteger','Divida Comigo o Fardo','Se dói em mim, dói menos em você','Ele quer ver você bem'], choices: [] },
      4: { auto: [], choices: [{ id:'pro4a', options: ['Você é tudo que tenho','Não vou deixá-lo cair'] }, { id:'pro4b', options: ['Garras da Sombra (Criatura)','Vigília Eterna (Criatura)'] }] },
      6: { auto: [], choices: [{ id:'pro6a', options: ['A Sombra está comigo','Juntos, até o fim'] }, { id:'pro6b', options: ['Rugido Primordial (Criatura)','Instinto Protetor (Criatura)'] }] },
      8: { auto: [], choices: [{ id:'pro8a', options: ['Eles esqueceram da escuridão','Entre nós, o silêncio reina'] }, { id:'pro8b', options: ['Salto das Sombras (Criatura)','Regeneração Sombria (Criatura)'] }] },
      12: { auto: [], choices: [{ id:'pro12a', options: ['Proteja-os, Sombra!','Estou de olho em você, amigo'] }, { id:'pro12b', options: ['Abraço Sufocante (Criatura)','Sentir o Perigo (Criatura)'] }] },
      15: { auto: [], choices: [{ id:'pro15a', options: ['Se afaste!','Ele está com medo'] }, { id:'pro15b', options: ['Fúria Protetora (Criatura)','Vínculo Inabalável (Criatura)'] }] },
      20: { auto: ['Somos Um, até o Fim','Guardião Ancestral (Criatura)'], choices: [] }
    }},
    { id: 'anomalo', name: 'Anômalo', nd: 4, dv: 10, sanBonus: 1, abilities: {
      1: { auto: ['Vórtice Anulador','Estilo de Dominância'], choices: [] },
      2: { auto: ['Conhecimento da Morte','Domo de Pressão'], choices: [] },
      3: { auto: ['Destino Mortal','Teleporte Dimensional'], choices: [] },
      7: { auto: ['Armadura Fragmentada'], choices: [] },
      11: { auto: ['Atrofiar Inimigo'], choices: [] },
      14: { auto: ['Tiro de Ar'], choices: [] },
      16: { auto: ['Prensa Anômala'], choices: [] },
      20: { auto: ['Falha Temporal'], choices: [] }
    }},
    { id: 'compactador', name: 'Compactador', nd: 1, dv: 14, sanBonus: 1, abilities: {
      1: { auto: ['Punho de Inércia','Revestimento Essencial'], choices: [] },
      3: { auto: [], choices: [{ id:'com3', options: ['Distorção de Ritmo','Troca de Estrutura'] }] },
      5: { auto: ['Núcleo Condensado','Ataque Extra'], choices: [] },
      7: { auto: [], choices: [{ id:'com7', options: ['Fratura de Impacto','Ancoragem Absoluta'] }] },
      10: { auto: ['Colapso Dirigido'], choices: [] },
      12: { auto: [], choices: [{ id:'com12', options: ['Esmagamento Vetorial','Campo de Assimetria'] }] },
      14: { auto: [], choices: [{ id:'com14', options: ['Forma Inabalável','Reversão Estrutural'] }] },
      16: { auto: ['Sombra Astral'], choices: [] },
      18: { auto: ['Singularidade Astral'], choices: [] },
      20: { auto: ['Forma Transcendente'], choices: [] }
    }},
    { id: 'bestial', name: 'Bestial', nd: 2, dv: 14, sanBonus: 1, abilities: {
      1: { auto: ['Besta de Carga'], choices: [{ id:'bes1', options: ['Couraça Grossa','Golpes Imprevisíveis'] }] },
      2: { auto: ['Corpo Pesado','Escudo Ambulante'], choices: [] },
      3: { auto: ['Fera Divina'], choices: [{ id:'bes3', options: ['Provocação Fervorosa','Marcação Furiosa'] }] },
      5: { auto: ['Ataque Extra','Hibernação'], choices: [{ id:'bes5', options: ['Alcatéia Imparável','Alfa Protetor'] }] },
      8: { auto: ['Instinto Animal'], choices: [{ id:'bes8', options: ['Fator Curativo'] }] },
      10: { auto: ['Adaptabilidade Natural'], choices: [{ id:'bes10', options: ['Corpo Robusto','Alcatéia Violenta'] }] },
      13: { auto: [], choices: [{ id:'bes13', options: ['Besta Descontrolada','Besta Colossal'] }] },
      15: { auto: [], choices: [{ id:'bes15', options: ['Efeito Furioso','Fúria Bestial Aprimorada'] }] },
      18: { auto: ['Corpo Resistente','O Rugido de um Verdadeiro Predador'], choices: [] },
      20: { auto: ['Retaliação Monstruosa'], choices: [] }
    }},
    { id: 'atirador-espectral', name: 'Atirador Espectral', nd: 4, dv: 4, sanBonus: 1, abilities: {
      1: { auto: [], choices: [{ id:'ati1', options: ['Sombra do Caçador','Marca da Caçada'] }] },
      3: { auto: ['Estilo de Caça'], choices: [] },
      4: { auto: [], choices: [{ id:'ati4', options: ['Flecha Fantasma','Enlace do Espectro'] }] },
      8: { auto: [], choices: [{ id:'ati8', options: ['Fuga Etérea','Salto Espectral'] }] },
      10: { auto: [], choices: [{ id:'ati10', options: ['Tiro de Aflição','Absorção Vital'] }] },
      12: { auto: [], choices: [{ id:'ati12', options: ['Lamento do Caçador','Luz da Caçada'] }] },
      15: { auto: [], choices: [{ id:'ati15', options: ['Caçada Imortal','Conexão Etérea'] }] },
      20: { auto: ['Flecha Florida'], choices: [] }
    }},
    { id: 'furtassaltante', name: 'Furtassaltante', nd: 3, dv: 5, sanBonus: 1, abilities: {
      1: { auto: [], choices: [{ id:'fur1', options: ['Golpe das Sombras','"Desapareci!"'] }] },
      4: { auto: [], choices: [{ id:'fur4', options: ['Passo Fantasma','Ataque Preciso'] }] },
      6: { auto: [], choices: [{ id:'fur6', options: ['Sombra que Mata','Esquiva das Sombras'] }] },
      8: { auto: [], choices: [{ id:'fur8', options: ['"Eles esqueceram da escuridão."','Passagem Invisível'] }] },
      12: { auto: [], choices: [{ id:'fur12', options: ['Mestre das Sombras','Silêncio Mortal'] }] },
      15: { auto: [], choices: [{ id:'fur15', options: ['Golpe Fantasma','Marca do Ladrão'] }] },
      20: { auto: ['Vontade Assassina'], choices: [] }
    }},
    { id: 'sobrevivente', name: 'Sobrevivente', nd: 0, dv: 8, sanBonus: 1, abilities: {
      1: { auto: [], choices: [{ id:'sob1', options: ['Improviso','Instinto de Perigo'] }] },
      3: { auto: [], choices: [{ id:'sob3', options: ['Recuperação Rápida','Rastreamento'] }] },
      5: { auto: [], choices: [{ id:'sob5', options: ['Resistência Extrema','Improviso Avançado'] }] },
      7: { auto: [], choices: [{ id:'sob7', options: ['Sobrevivência em Grupo','Conhecimento Prático'] }] },
      9: { auto: [], choices: [{ id:'sob9', options: ['Inquebrável','Armadilhas Improvisadas'] }] },
      11: { auto: [], choices: [{ id:'sob11', options: ['Liderança Natural','Recuperação Total'] }] },
      13: { auto: ['Sobrevivente'], choices: [] }
    }},
    { id: 'consagrados', name: 'Consagrados', nd: 1, dv: 8, sanBonus: 1, abilities: {
      1: { auto: ['Catalisador Divino'], choices: [] },
      3: { auto: ['Vínculo Elemental'], choices: [{ id:'con3', options: ['Doutrina: Campeão (Fúria Sagrada)','Doutrina: Profeta (Arquivista Sacro)'] }] },
      4: { auto: ['Confluência de Selos (+1 Selo, Ampliar Selos)'], choices: [] },
      6: { auto: [], choices: [{ id:'con6', options: ['Purgar o Infiel (Campeão)','Pergaminho Litúrgico (Profeta)'] }] },
      8: { auto: ['Concentração como Ação Bônus'], choices: [{ id:'con8', options: ['Baluarte da Fé (Campeão)','Geometria Sagrada (Profeta)'] }] },
      12: { auto: ['+1 Selo, manter dois Selos ativos'], choices: [{ id:'con12', options: ['Martírio Vingativo (Campeão)','Fluxo Contínuo (Profeta)'] }] },
      15: { auto: ['Acelerar Selo (1x/cena)'], choices: [{ id:'con15', options: ['Avatar da Destruição (Campeão)','Improvisação Divina (Profeta)'] }] },
      20: { auto: ['+2 Selos, Apoteose (3 rodadas)'], choices: [{ id:'con20', options: ['Glória Final (Campeão)','Consciência Onipresente (Profeta)'] }] }
    }},
    { id: 'pistoleiro', name: 'Pistoleiro', nd: 3, dv: 6, sanBonus: 1, abilities: {
      1: { auto: ['Tambor Relâmpago'], choices: [] },
      2: { auto: ['Chumbo Astral'], choices: [] },
      3: { auto: ['Recarga Rápida', 'Atirador Nato'], choices: [
        { id:'pis3', options: ['Trilha Regressor','Trilha Solar','Trilha Gatilho Mortal'] }
      ]},
      6: { auto: ['Alvo do Caçador de Cabeças'], choices: [] },
      8: { auto: ['Disparo Teleguiado'], choices: [] },
      9: { auto: [], choices: [
        { id:'pis9', options: ['Dead Eye','Gatilho Fantasma'] }
      ]},
      12: { auto: ['Disparo Ilusório'], choices: [] },
      15: { auto: [], choices: [
        { id:'pis15', options: ['Duelista Natural','Olho de Gavião'] }
      ]},
      18: { auto: ['Malandro Arcano'], choices: [] },
      20: { auto: ['Apocalipse'], choices: [] }
    }}
  ],
  skills: [
    'Acrobacia','Adestramento','Alquimia','Arcanismo','Atletismo','Atuação','Barganha','Conhecimento',
    'Cosmo','Diplomacia','Disparada','Engenharia','Esquiva','Exploração','Forja','Furtividade',
    'História','Intimidação','Intuição','Investigação','Ladinagem','Liderança','Medicina',
    'Misticismo','Natação','Navegação','Negociação','Ofício','Percepção','Persuasão',
    'Pontaria','Prestidigitação','Religião','Sobrevivência','Tática','Tecnologia','Vontade'
  ]
};

function trueRandom(max) {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return (arr[0] % max) + 1;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = {};
  const els = ['c-name','c-age','c-gender','c-player','c-portrait','c-backstory',
    'c-race','c-origin','c-class','c-level',
    'c-pvs','c-re','c-rf','c-des','c-fr','c-int','c-fama','c-sen','c-cosmo','c-ea',
    'c-weapon1','c-weapon2','c-armor','c-items','c-money'];
  els.forEach(id => { form[id] = document.getElementById(id); });

  const cDef = document.getElementById('c-def');
  const cDefe = document.getElementById('c-defe');
  const cSan = document.getElementById('c-san');

  const steps = document.querySelectorAll('.creator-panel');
  const stepBtns = document.querySelectorAll('.creator-step');
  let currentStep = 1;
  let portraitBase64 = '';
  let abilityChoices = {};
  let raceBonusesApplied = {};

  /* --- Dice Roller --- */
  const diceResult = document.getElementById('dice-result');
  const diceHistory = document.getElementById('dice-history');
  const rollHistory = [];
  document.getElementById('dice-btns').addEventListener('click', (e) => {
    const btn = e.target.closest('.dice-btn');
    if (!btn) return;
    const sides = parseInt(btn.dataset.dice, 10);
    const val = trueRandom(sides);
    rollHistory.unshift({ sides, val });
    if (rollHistory.length > 50) rollHistory.length = 50;
    diceResult.innerHTML = `<span class="roll-label">d${sides}</span><span class="roll-value">${val}</span>`;
    diceHistory.innerHTML = rollHistory.slice(0, 20).map(r =>
      `<span class="dice-history-item">d${r.sides}: ${r.val}</span>`
    ).join('');
  });

  /* --- Image Upload --- */
  const portraitInput = form['c-portrait'];
  const previewBox = document.getElementById('c-portrait-preview');
  portraitInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) { previewBox.innerHTML = ''; portraitBase64 = ''; return; }
    const reader = new FileReader();
    reader.onload = (ev) => {
      portraitBase64 = ev.target.result;
      previewBox.innerHTML = `<img src="${portraitBase64}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
  });

  /* --- Step Navigation --- */
  function showStep(n) {
    steps.forEach(s => s.classList.remove('active'));
    stepBtns.forEach(b => b.classList.remove('active'));
    document.getElementById('step-' + n).classList.add('active');
    stepBtns.forEach(b => { if (parseInt(b.dataset.step) === n) b.classList.add('active'); });
    currentStep = n;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (n === 8) renderReview();
    if (n === 4) renderClassAbilities();
  }
  document.querySelectorAll('.creator-next').forEach(btn => {
    btn.addEventListener('click', () => showStep(parseInt(btn.dataset.next)));
  });
  document.querySelectorAll('.creator-prev').forEach(btn => {
    btn.addEventListener('click', () => showStep(parseInt(btn.dataset.prev)));
  });
  stepBtns.forEach(btn => {
    btn.addEventListener('click', () => showStep(parseInt(btn.dataset.step)));
  });

  /* --- Populate Selects --- */
  function populateSelect(sel, data) {
    data.forEach(item => {
      const o = document.createElement('option');
      o.value = item.id;
      o.textContent = item.name;
      sel.appendChild(o);
    });
  }
  populateSelect(form['c-race'], SYSTEM_DATA.races);
  populateSelect(form['c-origin'], SYSTEM_DATA.origins);
  populateSelect(form['c-class'], SYSTEM_DATA.classes);

  /* ================================================================== */
  /*  ATTR POINT-BUY                                                     */
  /* ================================================================== */
  const attrFields = ['c-pvs','c-re','c-rf','c-des','c-fr','c-int','c-fama','c-sen'];
  const ATTR_BASE = 1;
  const POINTS_TOTAL = 4;
  const ATTR_MAX = 8;
  const ATTR_MIN = 0;
  let attrBase = {};  // stores base values before race bonuses

  function initAttrBase() {
    attrFields.forEach(id => { attrBase[id] = ATTR_BASE; });
    attrBase['c-sen'] = 4;  // SEN starts at 1 + 3 bonus
    form['c-cosmo'].value = '1';
    form['c-cosmo'].disabled = true;
    form['c-ea'].value = 100;
  }

  function getTotalAttr(id) {
    let base = attrBase[id] || ATTR_BASE;
    if (id === 'c-sen') base = Math.max(base, 4);
    const bonus = raceBonusesApplied[id] || 0;
    return base + bonus;
  }

  function updateAttrField(id) {
    const total = getTotalAttr(id);
    form[id].value = total;
    if (id === 'c-pvs') calcDerived();
  }

  function getPointsUsed() {
    let used = 0;
    attrFields.forEach(id => {
      let base = attrBase[id] || ATTR_BASE;
      if (id === 'c-sen') {
        const senMin = 4;
        base = Math.max(base, senMin);
        used += base - senMin;
      } else {
        used += base - ATTR_BASE;
      }
    });
    return used;
  }

  function getTotalPoints() {
    let total = POINTS_TOTAL;
    attrFields.forEach(id => {
      if ((attrBase[id] || ATTR_BASE) === 0) total += 1;
      if (id === 'c-sen') {
        if ((attrBase[id] || ATTR_BASE) < 4) total += 0; // can't reduce SEN below 4
      }
    });
    return total;
  }

  function updatePointsDisplay() {
    const used = getPointsUsed();
    const total = getTotalPoints();
    const remaining = total - used;
    const el = document.getElementById('c-points-remaining');
    el.textContent = `Pontos: ${remaining} (total ${total})`;
    el.style.color = remaining < 0 ? '#ff4444' : 'var(--attr-ea)';
    return remaining;
  }

  function canAdjustAttr(id, delta) {
    const cur = attrBase[id] || ATTR_BASE;
    if (id === 'c-cosmo' || id === 'c-ea') return false;
    if (id === 'c-sen' && cur <= 4 && delta < 0) return false; // SEN locked at min 4
    const newVal = cur + delta;
    if (newVal < ATTR_MIN) return false;
    if (newVal > ATTR_MAX) return false;
    return true;
  }

  function adjustAttr(id, delta) {
    if (!canAdjustAttr(id, delta)) return false;
    attrBase[id] = (attrBase[id] || ATTR_BASE) + delta;
    if (id === 'c-sen' && attrBase[id] < 4) attrBase[id] = 4;
    const remaining = updatePointsDisplay();
    updateAttrField(id);
    return true;
  }

  function buildPointBuy() {
    attrFields.forEach(id => {
      const inp = form[id];
      const grp = inp.closest('.creator-stat') || inp.parentElement;
      const delta = parseInt(inp.dataset.delta) || 0;
      if (grp && !grp.querySelector('.attr-adjust')) {
        const adjDiv = document.createElement('div');
        adjDiv.className = 'attr-adjust';
        adjDiv.style.cssText = 'display:flex;gap:4px;margin-top:4px';
        const minus = document.createElement('button');
        minus.type = 'button';
        minus.textContent = '−';
        minus.style.cssText = 'font-size:0.75rem;padding:2px 8px;border-radius:3px;border:1px solid var(--border-subtle);background:var(--bg-elevated);color:var(--text-secondary);cursor:pointer';
        const plus = document.createElement('button');
        plus.type = 'button';
        plus.textContent = '+';
        plus.style.cssText = 'font-size:0.75rem;padding:2px 8px;border-radius:3px;border:1px solid var(--border-subtle);background:var(--bg-elevated);color:var(--text-secondary);cursor:pointer';
        adjDiv.appendChild(minus);
        adjDiv.appendChild(plus);
        grp.appendChild(adjDiv);
        minus.addEventListener('click', () => { adjustAttr(id, -1); updateAllCalc(); });
        plus.addEventListener('click', () => { adjustAttr(id, 1); updateAllCalc(); });
        inp.addEventListener('change', () => {
          const v = parseInt(inp.value);
          if (!isNaN(v) && v >= ATTR_MIN && v <= ATTR_MAX) {
            attrBase[id] = v;
            if (id === 'c-sen' && attrBase[id] < 4) attrBase[id] = 4;
            updatePointsDisplay();
            updateAllCalc();
          }
        });
      }
      inp.readOnly = true;
    });
  }

  function updateAllCalc() {
    attrFields.forEach(id => updateAttrField(id));
    calcDerived();
  }

  /* ================================================================== */
  /*  RACE HANDLING                                                      */
  /* ================================================================== */
  function applyRaceBonuses(raceId) {
    raceBonusesApplied = {};
    const race = SYSTEM_DATA.races.find(r => r.id === raceId);
    if (!race || !race.bonuses) return;
    const map = { saude:'c-pvs', re:'c-re', rf:'c-rf', des:'c-des', fr:'c-fr', int:'c-int', fama:'c-fama', sen:'c-sen' };
    for (const [key, val] of Object.entries(race.bonuses)) {
      const fieldId = map[key];
      if (fieldId) raceBonusesApplied[fieldId] = val;
    }
    updateAllCalc();
  }

  form['c-race'].addEventListener('change', () => {
    const id = form['c-race'].value;
    const box = document.getElementById('c-race-info');
    if (!id) { box.innerHTML = ''; applyRaceBonuses(''); return; }
    const race = SYSTEM_DATA.races.find(r => r.id === id);
    const ab = race.abilities.map(a => '<li>' + a + '</li>').join('');
    const extra = race.note ? `<p style="color:var(--attr-ea);font-size:0.82rem;margin-top:4px">${race.note}</p>` : '';
    box.innerHTML = `<strong>${race.name}</strong> (ND ${race.nd})<br><ul style="margin:4px 0 0 16px;font-size:0.85rem;color:var(--text-secondary)">${ab}</ul>${extra}`;
    applyRaceBonuses(id);
    if (id === 'espectros') {
      form['c-pvs'].value = 0;
      document.querySelector('[for="c-pvs"]').textContent = 'Estabilidade (d4)';
    } else {
      document.querySelector('[for="c-pvs"]').textContent = 'Saúde (PVs)';
    }
  });

  /* ================================================================== */
  /*  ORIGIN HANDLING                                                    */
  /* ================================================================== */
  form['c-origin'].addEventListener('change', () => {
    const id = form['c-origin'].value;
    const box = document.getElementById('c-origin-info');
    if (!id) { box.innerHTML = ''; return; }
    const origin = SYSTEM_DATA.origins.find(o => o.id === id);
    const ab = origin.abilities.map(a => '<li>' + a + '</li>').join('');
    box.innerHTML = `<strong>${origin.name}</strong><br><em style="font-size:0.82rem;color:var(--text-secondary)">Equip: ${origin.equipment}</em><br><ul style="margin:4px 0 0 16px;font-size:0.85rem;color:var(--text-secondary)">${ab}</ul>`;
    // Auto-check origin skills
    document.querySelectorAll('#c-skills-grid input').forEach(c => c.checked = false);
    if (origin.skills) {
      origin.skills.forEach(skill => {
        const cb = document.querySelector(`#c-skills-grid input[value="${skill}"]`);
        if (cb) cb.checked = true;
      });
    }
    // Auto-fill equipment
    if (origin.equipment && origin.equipment !== 'Nenhum' && origin.equipment !== 'Itens adequados às ocupações') {
      form['c-items'].value = origin.equipment;
    }
  });

  /* ================================================================== */
  /*  CLASS HANDLING                                                     */
  /* ================================================================== */
  form['c-class'].addEventListener('change', () => {
    const id = form['c-class'].value;
    const box = document.getElementById('c-class-info');
    if (!id) { box.innerHTML = ''; return; }
    const cls = SYSTEM_DATA.classes.find(c => c.id === id);
    box.innerHTML = `<strong>${cls.name}</strong> (ND ${cls.nd}, DV d${cls.dv})<br><em style="color:var(--text-secondary)">${cls.dv + (parseInt(form['c-level'].value||1)-1)*(Math.ceil(cls.dv/2)+1)} PV estimados</em>`;
    abilityChoices = {};
    autoCalcPVs();
    renderClassAbilities();
  });

  form['c-level'].addEventListener('input', () => {
    autoCalcPVs();
    renderClassAbilities();
  });

  function autoCalcPVs() {
    const classId = form['c-class'].value;
    const level = parseInt(form['c-level'].value) || 1;
    if (!classId) return;
    const cls = SYSTEM_DATA.classes.find(c => c.id === classId);
    if (!cls) return;
    const raceId = form['c-race'].value;
    const isEspectro = raceId === 'espectros';
    if (isEspectro) {
      form['c-pvs'].value = 0;
      return;
    }
    const perLevel = Math.ceil(cls.dv / 2) + 1;
    const saude = parseInt(form['c-pvs'].value) || 0;
    const baseSaude = attrBase['c-pvs'] || ATTR_BASE;
    const raceBonus = raceBonusesApplied['c-pvs'] || 0;
    const pvs = cls.dv + (baseSaude + Math.max(raceBonus, 0)) + (level - 1) * perLevel;
    form['c-pvs'].value = Math.max(pvs, 1);
    calcDerived();
  }

  /* ================================================================== */
  /*  CLASS ABILITY CHOICES                                              */
  /* ================================================================== */
  function renderClassAbilities() {
    const container = document.getElementById('c-class-abilities');
    const classId = form['c-class'].value;
    const level = parseInt(form['c-level'].value) || 1;
    if (!classId || !level) { container.innerHTML = ''; return; }
    const cls = SYSTEM_DATA.classes.find(c => c.id === classId);
    if (!cls || !cls.abilities) { container.innerHTML = ''; return; }
    let html = '<div class="creator-section"><h4>Habilidades Disponíveis</h4>';
    const lvls = Object.keys(cls.abilities).map(Number).sort((a,b) => a-b);
    let hasChoices = false;
    for (const l of lvls) {
      if (l > level) continue;
      const entry = cls.abilities[l];
      const auto = entry.auto || [];
      const choices = entry.choices || [];
      if (auto.length === 0 && choices.length === 0) continue;
      hasChoices = true;
      html += `<div style="background:var(--bg-elevated);border:1px solid var(--border-subtle);border-radius:var(--radius-sm);padding:8px 12px;margin-bottom:6px">`;
      html += `<div style="font-size:0.7rem;text-transform:uppercase;letter-spacing:0.1em;color:var(--text-muted);margin-bottom:3px">Nível ${l}</div>`;
      if (auto.length > 0) html += `<div style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:3px">${auto.join(', ')}</div>`;
      choices.forEach((ch, ci) => {
        const key = ch.id || `${l}_${ci}`;
        const saved = abilityChoices[classId + '_' + key] || '';
        html += `<div style="margin:4px 0"><span style="font-size:0.75rem;color:var(--text-muted)">Escolha:</span> `;
        ch.options.forEach(opt => {
          const checked = saved === opt ? ' checked' : '';
          html += `<label style="font-size:0.82rem;color:var(--text-secondary);margin-right:8px;cursor:pointer">
            <input type="radio" name="ab_${classId}_${key}" value="${opt.replace(/"/g,'&quot;')}"${checked} style="margin-right:2px"> ${opt}
          </label>`;
        });
        html += `</div>`;
      });
      html += `</div>`;
    }
    if (!hasChoices) html += `<p style="font-size:0.82rem;color:var(--text-muted)">Nenhuma escolha necessária até este nível.</p>`;
    html += '</div>';
    container.innerHTML = html;
    container.querySelectorAll('input[type="radio"]').forEach(r => {
      r.addEventListener('change', () => {
        const match = r.name.match(/^ab_(.+?)_(.+)$/);
        if (match) {
          const clsId = match[1];
          const key = match[2];
          abilityChoices[clsId + '_' + key] = r.value;
        }
      });
    });
  }

  /* ================================================================== */
  /*  DERIVED STATS                                                      */
  /* ================================================================== */
  function calcDerived() {
    const pvs = parseFloat(form['c-pvs'].value) || 0;
    const re = parseFloat(form['c-re'].value) || 0;
    const rf = parseFloat(form['c-rf'].value) || 0;
    const int = parseFloat(form['c-int'].value) || 0;
    const def = (rf * Math.pow(pvs, 0.6)) / 6;
    const defe = (re * Math.sqrt(pvs)) / 8 + def;  // DEFe includes DEF
    const classId = form['c-class'].value;
    const cls = SYSTEM_DATA.classes.find(c => c.id === classId);
    const sanBonus = cls ? cls.sanBonus || 0 : 0;
    const san = 10 + int + sanBonus;
    cDef.textContent = def.toFixed(1);
    cDefe.textContent = defe.toFixed(1);
    cSan.textContent = san;
  }

  attrFields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', calcDerived);
  });

  /* ================================================================== */
  /*  CHARACTER DATA & REVIEW                                            */
  /* ================================================================== */
  function getClassAbilitiesFinal(classId, level) {
    const cls = SYSTEM_DATA.classes.find(c => c.id === classId);
    if (!cls || !cls.abilities) return [];
    const list = [];
    const lvls = Object.keys(cls.abilities).map(Number).sort((a,b) => a-b);
    for (const l of lvls) {
      if (l > level) continue;
      const entry = cls.abilities[l];
      if (entry.auto) list.push(...entry.auto);
      if (entry.choices) {
        entry.choices.forEach(ch => {
          const key = ch.id || `${l}_${entry.choices.indexOf(ch)}`;
          const chosen = abilityChoices[classId + '_' + key];
          if (chosen) list.push(chosen);
        });
      }
    }
    return list;
  }

  function getCharData() {
    const skills = [...document.querySelectorAll('#c-skills-grid input:checked')].map(c => c.value);
    const raceId = form['c-race'].value;
    const originId = form['c-origin'].value;
    const classId = form['c-class'].value;
    const level = parseInt(form['c-level'].value) || 1;

    const raceData = SYSTEM_DATA.races.find(r => r.id === raceId);
    const originData = SYSTEM_DATA.origins.find(o => o.id === originId);
    const raceAbilities = raceData ? raceData.abilities : [];
    const originAbilities = originData ? originData.abilities : [];
    const classAbilities = getClassAbilitiesFinal(classId, level);

    return {
      name: form['c-name'].value || '(sem nome)',
      age: form['c-age'].value || '—',
      gender: form['c-gender'].value || '—',
      player: form['c-player'].value || '—',
      portrait: portraitBase64,
      backstory: form['c-backstory'].value || '—',
      race: form['c-race'].selectedOptions[0]?.text || '(não selecionada)',
      origin: form['c-origin'].selectedOptions[0]?.text || '(não selecionada)',
      cls: form['c-class'].selectedOptions[0]?.text || '(não selecionada)',
      level: level,
      pvs: form['c-pvs'].value, re: form['c-re'].value, rf: form['c-rf'].value,
      des: form['c-des'].value, fr: form['c-fr'].value, intv: form['c-int'].value,
      fama: form['c-fama'].value, sen: form['c-sen'].value,
      cosmo: form['c-cosmo'].value, ea: form['c-ea'].value,
      def: cDef.textContent, defe: cDefe.textContent, san: cSan.textContent,
      skills: skills,
      weapon1: form['c-weapon1'].value, weapon2: form['c-weapon2'].value,
      armor: form['c-armor'].value, items: form['c-items'].value,
      money: form['c-money'].value,
      raceAbilities, originAbilities, classAbilities
    };
  }

  function renderReview() {
    const d = getCharData();
    const review = document.getElementById('c-review');
    let html = `<div class="review-card"><h3>${d.name}</h3>`;
    if (d.portrait) html += `<div class="review-portrait"><img src="${d.portrait}" alt="Retrato"></div>`;
    html += `<p><strong>Raça:</strong> ${d.race} | <strong>Origem:</strong> ${d.origin} | <strong>Classe:</strong> ${d.cls} (Nv ${d.level})</p>`;
    html += `<p><strong>Atributos:</strong> PVs ${d.pvs}, RE ${d.re}, RF ${d.rf}, DES ${d.des}, FR ${d.fr}, INT ${d.intv}, Fama ${d.fama}, SEN ${d.sen}, COSMO ${d.cosmo}, EA ${d.ea}</p>`;
    html += `<p><strong>DEF</strong> ${d.def} | <strong>DEFe</strong> ${d.defe} | <strong>Sanidade</strong> ${d.san}</p>`;
    html += `<p><strong>Perícias:</strong> ${d.skills.length ? d.skills.join(', ') : 'nenhuma'}</p>`;
    const eq = [d.weapon1, d.weapon2, d.armor].filter(Boolean).join(', ');
    if (eq) html += `<p><strong>Equipamento:</strong> ${eq}</p>`;
    if (d.items) html += `<p><strong>Itens:</strong> ${d.items}</p>`;
    if (d.money) html += `<p><strong>Dinheiro:</strong> ${d.money}</p>`;
    if (d.backstory && d.backstory !== '—') html += `<p><strong>História:</strong><br>${d.backstory}</p>`;
    html += `</div>`;
    review.innerHTML = html;

    const abDiv = document.getElementById('c-abilities-display');
    let abHtml = '';
    if (d.raceAbilities.length) {
      abHtml += `<div class="creator-section"><h4>Habilidades Raciais</h4><div class="ability-list">`;
      d.raceAbilities.forEach(a => { abHtml += `<div class="ability-item">${escapeHtml(a)}</div>`; });
      abHtml += `</div></div>`;
    }
    if (d.originAbilities.length) {
      abHtml += `<div class="creator-section"><h4>Poderes de Origem</h4><div class="ability-list">`;
      d.originAbilities.forEach(a => { abHtml += `<div class="ability-item">${escapeHtml(a)}</div>`; });
      abHtml += `</div></div>`;
    }
    if (d.classAbilities.length) {
      abHtml += `<div class="creator-section"><h4>Habilidades de Classe (Nv ${d.level})</h4><div class="ability-list">`;
      d.classAbilities.forEach(a => { abHtml += `<div class="ability-item">${escapeHtml(a)}</div>`; });
      abHtml += `</div></div>`;
    }
    abDiv.innerHTML = abHtml;
  }

  function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  /* ================================================================== */
  /*  SAVE / RESET / EXPORT                                              */
  /* ================================================================== */
  document.getElementById('c-save').addEventListener('click', () => {
    const d = getCharData();
    const data = { ...d, id: 'char_' + Date.now(), abilityChoices };
    const saved = JSON.parse(localStorage.getItem('wuitalur_chars') || '[]');
    saved.push(data);
    localStorage.setItem('wuitalur_chars', JSON.stringify(saved));
    const msg = document.getElementById('c-saved-msg');
    msg.textContent = 'Personagem salvo com sucesso!';
    msg.className = 'creator-msg success';
    setTimeout(() => { msg.textContent = ''; msg.className = 'creator-msg'; }, 3000);
  });

  document.getElementById('c-reset').addEventListener('click', () => {
    if (!confirm('Tem certeza? Todos os campos serão limpos.')) return;
    els.forEach(id => {
      const el = form[id];
      if (el) {
        if (el.tagName === 'SELECT') el.selectedIndex = 0;
        else if (el.type === 'file') { el.value = ''; previewBox.innerHTML = ''; portraitBase64 = ''; }
        else el.value = '';
      }
    });
    document.querySelectorAll('#c-skills-grid input').forEach(c => c.checked = false);
    document.getElementById('c-race-info').innerHTML = '';
    document.getElementById('c-origin-info').innerHTML = '';
    document.getElementById('c-class-info').innerHTML = '';
    document.getElementById('c-class-abilities').innerHTML = '';
    document.getElementById('c-abilities-display').innerHTML = '';
    abilityChoices = {};
    raceBonusesApplied = {};
    initAttrBase();
    updateAllCalc();
    updatePointsDisplay();
    const msg = document.getElementById('c-saved-msg');
    msg.textContent = '';
    msg.className = 'creator-msg';
  });

  /* --- Export PDF --- */
  document.getElementById('c-export-pdf').addEventListener('click', () => {
    const d = getCharData();
    const w = window.open('', '_blank');
    w.document.write(`<!DOCTYPE html><html><head><meta charset="UTF-8">
<title>${d.name} — Ficha de Personagem</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Inter', sans-serif; background: #0D0D12; color: #E4E4EC; padding: 40px; }
  .sheet { max-width: 1000px; margin: 0 auto; background: #16161E; border: 1px solid #2E2E3E; border-radius: 16px; padding: 40px; }
  .sheet-header { display: flex; gap: 30px; align-items: flex-start; margin-bottom: 30px; border-bottom: 1px solid #2E2E3E; padding-bottom: 25px; }
  .sheet-portrait { width: 120px; height: 140px; border-radius: 8px; border: 1px solid #2E2E3E; overflow: hidden; flex-shrink: 0; background: #1E1E2A; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: #6B6B7B; }
  .sheet-portrait img { width: 100%; height: 100%; object-fit: cover; }
  .sheet-title { flex: 1; }
  .sheet-title h1 { font-family: 'Cinzel', serif; font-size: 2rem; color: #E4E4EC; margin-bottom: 4px; }
  .sheet-title .subtitle { color: #6B6B7B; font-size: 0.85rem; }
  .sheet-row { display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; }
  .sheet-field { flex: 1; min-width: 140px; }
  .sheet-field label { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: #6B6B7B; margin-bottom: 4px; }
  .sheet-field .val { font-size: 0.95rem; color: #E4E4EC; background: rgba(255,255,255,0.04); border: 1px solid #2E2E3E; border-radius: 6px; padding: 6px 10px; min-height: 32px; outline: none; transition: border-color 0.2s; }
  .sheet-field .val:focus { border-color: #7C3AED; }
  .sheet-section { margin-bottom: 25px; }
  .sheet-section h2 { font-family: 'Cinzel', serif; font-size: 1rem; color: #7C3AED; text-transform: uppercase; letter-spacing: 0.08em; border-bottom: 1px solid #2E2E3E; padding-bottom: 6px; margin-bottom: 12px; }
  .sheet-section h3 { font-family: 'Cinzel', serif; font-size: 0.85rem; color: #6B6B7B; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 8px; margin-top: 12px; }
  .sheet-stats { display: grid; grid-template-columns: repeat(auto-fill, minmax(100px, 1fr)); gap: 10px; }
  .sheet-stat { text-align: center; }
  .sheet-stat .stat-label { font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.08em; color: #6B6B7B; }
  .sheet-stat .stat-val { font-family: 'JetBrains Mono', monospace; font-size: 1.2rem; font-weight: 700; color: #E4E4EC; background: rgba(255,255,255,0.04); border: 1px solid #2E2E3E; border-radius: 6px; padding: 6px 10px; margin-top: 2px; outline: none; min-height: 36px; text-align: center; }
  .sheet-stat .stat-val:focus { border-color: #7C3AED; }
  .sheet-skills { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 4px; }
  .sheet-skills .skill-item { font-size: 0.85rem; color: #9898A8; padding: 3px 8px; background: rgba(255,255,255,0.03); border-radius: 4px; border: 1px solid transparent; outline: none; }
  .sheet-skills .skill-item:focus { border-color: #7C3AED; }
  .sheet-textarea { width: 100%; min-height: 60px; background: rgba(255,255,255,0.04); border: 1px solid #2E2E3E; border-radius: 6px; padding: 8px 12px; color: #E4E4EC; font-family: 'Inter', sans-serif; font-size: 0.9rem; outline: none; resize: vertical; }
  .sheet-textarea:focus { border-color: #7C3AED; }
  .sheet-footer { margin-top: 30px; padding-top: 15px; border-top: 1px solid #2E2E3E; text-align: center; font-size: 0.75rem; color: #6B6B7B; font-family: 'Cinzel', serif; letter-spacing: 0.05em; }
  @media print { body { padding: 0; } .sheet { border: none; border-radius: 0; padding: 30px; } }
</style></head><body>
<div class="sheet">
  <div class="sheet-header">
    <div class="sheet-portrait">${d.portrait ? '<img src="'+d.portrait+'">' : 'Sem<br>Ilustração'}</div>
    <div class="sheet-title">
      <h1 contenteditable="true">${d.name}</h1>
      <div class="subtitle"><span contenteditable="true">${d.race}</span> · <span contenteditable="true">${d.origin}</span> · <span contenteditable="true">${d.cls}</span> · Nv <span contenteditable="true">${d.level}</span></div>
    </div>
  </div>
  <div class="sheet-row">
    <div class="sheet-field"><label>Idade</label><div class="val" contenteditable="true">${d.age}</div></div>
    <div class="sheet-field"><label>Gênero</label><div class="val" contenteditable="true">${d.gender}</div></div>
    <div class="sheet-field"><label>Jogador</label><div class="val" contenteditable="true">${d.player}</div></div>
    <div class="sheet-field"><label>Dinheiro</label><div class="val" contenteditable="true">${d.money || '—'}</div></div>
  </div>
  <div class="sheet-section">
    <h2>Atributos & Derivados</h2>
    <div class="sheet-stats">
      <div class="sheet-stat"><div class="stat-label" style="color:#55a630">PVs</div><div class="stat-val" contenteditable="true" style="color:#55a630">${d.pvs}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#4a49ff">RE</div><div class="stat-val" contenteditable="true" style="color:#4a49ff">${d.re}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#ff1f1f">RF</div><div class="stat-val" contenteditable="true" style="color:#ff1f1f">${d.rf}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#ff9500">DES</div><div class="stat-val" contenteditable="true" style="color:#ff9500">${d.des}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#b30000">FR</div><div class="stat-val" contenteditable="true" style="color:#b30000">${d.fr}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#7e00c2">INT</div><div class="stat-val" contenteditable="true" style="color:#7e00c2">${d.intv}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#e200c2">Fama</div><div class="stat-val" contenteditable="true" style="color:#e200c2">${d.fama}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#f5b700">SEN</div><div class="stat-val" contenteditable="true" style="color:#f5b700">${d.sen}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#9e00ff">COSMO</div><div class="stat-val" contenteditable="true" style="color:#9e00ff">${d.cosmo}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#4dd0e1">EA</div><div class="stat-val" contenteditable="true" style="color:#4dd0e1">${d.ea}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#ff1f1f">DEF</div><div class="stat-val" contenteditable="true" style="color:#ff1f1f">${d.def}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#4a49ff">DEFe</div><div class="stat-val" contenteditable="true" style="color:#4a49ff">${d.defe}</div></div>
      <div class="sheet-stat"><div class="stat-label" style="color:#7B6D8D">Sanidade</div><div class="stat-val" contenteditable="true" style="color:#7B6D8D">${d.san}</div></div>
    </div>
  </div>
  <div class="sheet-section">
    <h2>Perícias</h2>
    <div class="sheet-skills">${d.skills.length ? d.skills.map(s => '<div class="skill-item" contenteditable="true">'+escapeHtml(s)+'</div>').join('') : '<div class="skill-item" contenteditable="true" style="color:#6B6B7B">Nenhuma</div>'}</div>
  </div>
  ${d.raceAbilities.length ? '<div class="sheet-section"><h2>Habilidades Raciais</h2><div class="sheet-skills">'+d.raceAbilities.map(a => '<div class="skill-item" contenteditable="true">'+escapeHtml(a)+'</div>').join('')+'</div></div>' : ''}
  ${d.originAbilities.length ? '<div class="sheet-section"><h2>Poderes de Origem</h2><div class="sheet-skills">'+d.originAbilities.map(a => '<div class="skill-item" contenteditable="true">'+escapeHtml(a)+'</div>').join('')+'</div></div>' : ''}
  ${d.classAbilities.length ? '<div class="sheet-section"><h2>Habilidades de Classe (Nv '+d.level+')</h2><div class="sheet-skills">'+d.classAbilities.map(a => '<div class="skill-item" contenteditable="true">'+escapeHtml(a)+'</div>').join('')+'</div></div>' : ''}
  <div class="sheet-section">
    <h2>Equipamento</h2>
    <div class="sheet-row">
      <div class="sheet-field"><label>Arma Principal</label><div class="val" contenteditable="true">${d.weapon1 || '—'}</div></div>
      <div class="sheet-field"><label>Arma Secundária</label><div class="val" contenteditable="true">${d.weapon2 || '—'}</div></div>
      <div class="sheet-field"><label>Armadura</label><div class="val" contenteditable="true">${d.armor || '—'}</div></div>
    </div>
    <div class="sheet-field"><label>Itens</label><div class="sheet-textarea" contenteditable="true">${d.items || '—'}</div></div>
  </div>
  <div class="sheet-section">
    <h2>História</h2>
    <div class="sheet-textarea" contenteditable="true" style="min-height:80px">${d.backstory || '—'}</div>
  </div>
  <div class="sheet-footer">WUITALUR — Ficha de Personagem</div>
</div>
<script>
  document.querySelectorAll('[contenteditable]').forEach(el => {
    el.addEventListener('keydown', e => { if (e.key === 'Enter') document.execCommand('insertLineBreak'); });
  });
<\/script>
</body></html>`);
    w.document.close();
  });

  /* ================================================================== */
  /*  INIT                                                                */
  /* ================================================================== */
  initAttrBase();
  buildPointBuy();
  updateAllCalc();
  updatePointsDisplay();
});
