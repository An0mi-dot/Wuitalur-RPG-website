const ABILITY_LIBRARY = {
    "Cavaleiros de Paladium": {
    "Nível 1": [
        {
            "name": "Golpe Solar",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "O Cavaleiro imbuí sua arma com energia. Um ataque\ncorpo a corpo que causa dano normal da arma + Dano Solar Base.\n&lt; • Ação Bônus • &gt;\n-30 de Energia Astral-"
        },
        {
            "name": "Égide Radiante",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "Cria uma barreira de luz que concede PVs Temporários equivalentes a 1d10 + Força a si mesmo ou a um aliado a até 9B.\n&lt; • Ação Padrão • &gt;\n-25 de Energia Astral-"
        }
    ],
    "Nível 4": [
        {
            "name": "Olhar Julgador",
            "cost": "-35 de Energia Astral",
            "type": "Ação Padrão",
            "description": "Os olhos do Cavaleiro ardem como duas brasas de Cadamor, revelando a corrupção e a\nmentira.\nVocê enxerga e detecta intenções falsas. Qualquer criatura dentro de 9B que minta\npara você ou esconda sua natureza brilha com uma aura dourada visível apenas para\nvocê."
        },
        {
            "name": "Julgamento Ardente",
            "cost": "-100 de Energia Astral",
            "type": "Ação Padrão",
            "description": "Marca um inimigo com um sigilo solar (3B). O alvo sofre Condição: Queimando igual à\nmetade dos dados do seu Dano Base Solar (ex: no nível 4, o DBS é 3d10, então o dano\nseria 2d10 arredondando para cima) por 3 rodadas."
        },
        {
            "name": "Solo Sagrado",
            "cost": "-85 de Energia Astral",
            "type": "Ação Padrão",
            "description": "Bate com a arma no chão, consagrando uma área de 6B. Inimigos na área sofrem 2d6 de\ndano Solar por turno. Aliados na área recebem +1 em resistências e testes de\nesquiva. Dura 3 rodadas."
        }
    ],
    "Nível 8": [
        {
            "name": "Julgamento Silencioso",
            "cost": "-60 de Energia Astral",
            "type": "Ação Bônus",
            "description": "Sem dizer uma palavra, você pode transmitir autoridade e culpa através do olhar. Uma\ncriatura a até 6B deve fazer um teste de FAMA (CT\n18). Se falhar, ela sente medo, arrependimento ou vergonha intensos, ficando\nCondição: Intimidada."
        },
        {
            "name": "Coroa de Chamas",
            "cost": "-70 de Energia Astral",
            "type": "Ação Bônus",
            "description": "Por 2 turnos, você gera 1 ponto de Carga Solar\nextra no início de cada um de seus turnos. Sua aura de calor (do efeito de 3+\nCargas) também cura aliados adjacentes na mesma quantidade que causa dano a\ninimigos."
        },
        {
            "name": "Fincada Chamuscante",
            "cost": "-185 de Energia Astral",
            "type": "Ação Bônus",
            "description": "O Cavaleiro canaliza uma espetada forte para frente com sua arma (3B para frente)\ncausando 3d15 e causando Condição: Paralisado por 2 turnos + Condição: Queimando."
        }
    ],
    "Nível 10": [
        {
            "name": "Memória das Cinzas",
            "cost": "-35 de Energia Astral",
            "type": "Ação Padrão",
            "description": "Ao tocar as cinzas de um cadáver, o Cavaleiro revive os últimos fragmentos de\nmemória espiritual. Você pode ver uma breve visão (10–15 segundos) dos últimos\nmomentos de vida do cadáver — o que viu, ouviu ou sentiu antes de morrer."
        },
        {
            "name": "Lança do Sol",
            "cost": "-90 de Energia Astral",
            "type": "Ação Bônus",
            "description": "Consome toda a sua Carga Solar para arremessar uma\nlança de luz pura em um alvo a até 18B. O ataque causa dano igual ao seu Dano Base\nSolar completo e ignora resistências. (Requer no mínimo 3 Cargas acumuladas (Não\ngasta))."
        },
        {
            "name": "Erupção Solar",
            "cost": "Toda carga solar + 120 de Energia Astral",
            "type": "Ação Bônus",
            "description": "Você consome toda a sua Carga Solar (Max) em um\nsurto de energia que transforma seu corpo em uma extensão viva do sol.\nPor 2 turnos, você recebe os seguintes efeitos:\n- Seus ataques corpo a corpo causam +1 dado do seu Dano Base Solar para cada\nponto de Carga consumido.\n- Você se torna imune a efeitos de empurrão, medo e atordoamento.\n- Você se torna uma fonte de luz intensa. Inimigos a até 6B têm desvantagem em\nataques contra você se dependerem de visão."
        }
    ],
    "Nível 12": [
        {
            "name": "Olhar da Divindade",
            "cost": "100 de Energia Astral",
            "type": "Ação Bônus",
            "description": "Inimigos em um cone de 9B devem fazer um teste\nde Resistência Mental(Inteligência) (CD 18) ou\nficarão Amedrontados por 2 turnos."
        },
        {
            "name": "Vontade de Paladium",
            "cost": "Nenhum",
            "type": "Ação Bônus",
            "description": "Por 3 turnos, você e aliados a até 9B\ntornam-se imunes a efeitos de medo e controle mental, e ganham +2d8 em suas jogadas\nde dano.\n-110 de Energia Astral-"
        }
    ],
    "Nível 15": [
        {
            "name": "Vingança Solar",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "Quando sua vida cai abaixo de 50%, você libera uma\nErupção Solar (usando 3 Cargas como base, sem\ncusto de Energia Astral) e sua geração de Carga\nSolar é dobrada por 2 turnos.\n-Passiva-"
        },
        {
            "name": "Fortaleza Inabalável",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "Enquanto tiver 3 ou mais pontos de Carga Solar, você não pode ser movido contra sua\nvontade, empurrado, derrubado ou teleportado por efeitos inimigos.\n-Passiva-"
        }
    ],
    "Nível 20": [
        {
            "name": "Avatar da Estrela Ardente",
            "cost": "Nenhum",
            "type": "Ação Bônus",
            "description": "Você se torna um canal vivo de Cadamor\npor 5 Turnos. Efeitos da Transformação: Você fica permanentemente no estado de Coroa Solar (8 Cargas); Seu alcance corpo a corpo aumenta em 3B com\numa lâmina de luz pura; Todos os seus ataques corpo a corpo causam dano adicional\nigual ao seu Dano Base Solar completo; Você se torna imune a dano de Fogo e\nSolar.\n-450 de Energia Astral-"
        }
    ]
},
    "Rastejantes": {
    "Nível 1": [
        {
            "name": "Toque Adoentado (Praga)",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "Você\ntoca um alvo, causando 1d4 de dano de Praga. O\nalvo deve fazer um teste de Resistência Física (CD 10 + INT). Se falhar, fica\nCondição: Enfraquecido por 1d4 turnos.\n&lt; • Ação Padrão • &gt;\n-Sem Custo-"
        },
        {
            "name": "Sussurro Desorientador (Pesadelo)",
            "cost": "Sem Custo",
            "type": "Ação Padrão",
            "description": "Você projeta um eco de pavor na mente de um alvo a até 9m,\ncausando 1d4 de dano psíquico. O alvo deve fazer um teste de Resistência de Intelecto (CD 10 + INT). Se falhar, fica\nCondição: Confuso por 1 turno."
        }
    ],
    "Nível 6": [
        {
            "name": "Enxame Devorador (Praga)",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "Você conjura uma névoa de insetos teleguiada contra um alvo a até 9m. O alvo deve\nfazer um teste de Resistência Física (CD 15). Se falhar, recebe 4d8 de dano de Praga e fica\nCondição: Dilacerado e Condição: Envenenado por 2\nturnos. Em um sucesso, recebe metade do dano e nenhuma condição.\n&lt; • Ação Padrão • &gt;\n-35 de Energia Astral-"
        },
        {
            "name": "Imbuição Aterrorizante (Pesadelo)",
            "cost": "35 de Energia Astral",
            "type": "Ação Bônus",
            "description": "Você imbui uma arma (sua ou de um aliado a até 3m) com a\nenergia do Pesadelo por 3 turnos. Os\nataques com essa arma causam 2d8 de dano psíquico adicional e, a cada golpe, o alvo\ndeve fazer um teste de RM (CD 15) ou ficará\nCondição: Amedrontado por 1 turno."
        }
    ],
    "Nível 7": [
        {
            "name": "Toque Corrosivo (Praga)",
            "cost": "Nenhum",
            "type": "Ação Padrão",
            "description": "Você\ntoca um alvo, que deve fazer um teste de Resistência Física (CD 1d20 + INT + Proficiência). Se falhar, o alvo sofre 3d6\nde dano de Praga e fica\nCondição: Corroído por 2 turnos, sentindo sua carne e armadura se\ndesfazerem.\n-40 de Energia Astral-"
        },
        {
            "name": "Abraço do Terror (Pesadelo)",
            "cost": "Nenhum",
            "type": "Ação Padrão",
            "description": "Você força um alvo ao seu alcance a olhar em seus olhos. O\nalvo deve fazer um teste de Esquiva (CD 1d20 + DES +\nINT + Proficiência). Se falhar, ele é agarrado, recebe\n3d8 + INT de dano psíquico e fica Condição: Marcado\npelo Medo por 2 turnos, incapaz de reagir\nofensivamente.\n-40 de Energia Astral-"
        }
    ],
    "Nível 9": [
        {
            "name": "Sangue Pestilento (Praga)",
            "cost": "Nenhum",
            "type": "-Passiva-",
            "description": "Seu sangue é um veneno virulento. Qualquer criatura que cause dano perfurante ou\ncortante em você com um ataque corpo a corpo deve fazer um teste de RF (CD 17). Em caso de falha, sofre 2d8 de dano de veneno\ne fica Condição: Envenenada e Condição: Exposta por\n2 turnos."
        },
        {
            "name": "Manto de Fobia (Pesadelo)",
            "cost": "Nenhum",
            "type": "-Passiva-",
            "description": "Você ganha resistência a dano psíquico. Adicionalmente, sempre que uma criatura\ntentar afetá-lo com um efeito de medo ou charme, ela sofre 2d8 de dano psíquico de\nretaliação e fica Condição: Desorientada por 1 turno, enquanto sua\nprópria mente é invadida."
        }
    ],
    "Nível 11": [
        {
            "name": "Ninho da Peste (Praga)",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "Você\ntoca o chão e cria uma área de 4m de raio de infestação pútrida a até 12m. A área é\nterreno difícil. Qualquer criatura que comece seu turno na área ou entre nela sofre\n3d10 de dano de Praga e fica\nCondição: Exposta enquanto permanecer no local.\n&lt; • Ação Padrão • &gt;\n-55 de Energia Astral-"
        },
        {
            "name": "Correntes do Desespero (Pesadelo)",
            "cost": "Nenhum",
            "type": "Ação Padrão",
            "description": "Você invoca correntes mágicas arroxeadas do chão para\nprender um alvo a até 12m. O alvo sofre 2d8 de dano psíquico e deve fazer um teste\nde Resistência de Destreza (CD 18). Se falhar,\nfica Condição: Paralisado por 1 rodada. No nível 17, o dano aumenta\npara 4d8 e a paralisia dura 2 rodadas.\n-Custa 1d6 de Pontos de Vida (1d12\nno nível 17)-"
        }
    ],
    "Nível 14": [
        {
            "name": "Peste Fulminante (Praga)",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "Você canaliza a essência da Praga em um alvo\nvisível a até 12m, causando 6d10 de dano de Praga. O alvo deve fazer um teste de Resistência\nde Saúde (CD 20). Se falhar, ele recebe a condição\nCondição: Infectado. Além disso, independentemente do resultado do\nteste, o alvo fica Condição: Exausto por 1 hora.\n&lt; • Ação Padrão • &gt;\n-150 de Energia Astral-"
        },
        {
            "name": "Estilhaçar Sanidade (Pesadelo)",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "Você foca sua vontade para quebrar a mente de um alvo a até\n12m, causando 1d15 de dano de Sanidade. O alvo deve fazer um teste de RM (CD 20). Se falhar, ele recebe a condição\nCondição: Assombrado. Você sofre dano de Sanidade igual à metade do\nresultado (arredondado para baixo) como ricochete.\n&lt; • Ação Padrão • &gt;\n-Custa Sanidade do usuário-"
        }
    ],
    "Nível 16": [
        {
            "name": "Ceifa Entrópica (Praga)",
            "cost": "Nenhum",
            "type": "Ação Bônus",
            "description": "Ao\ncausar dano com um ataque ou habilidade de Praga, você pode usar sua ação bônus para sugar\na vitalidade do alvo. Você recupera Pontos de Vida iguais à metade do dano causado e\no alvo fica Condição: Enfraquecido por 1 turno, sentindo sua força\nser drenada.\n-180 de Energia Astral-"
        },
        {
            "name": "Banquete de Pavor (Pesadelo)",
            "cost": "Sem Custo",
            "type": "Reação",
            "description": "Quando um inimigo a até 9m falha em um teste de resistência\ncontra um efeito de medo ou psíquico seu, você pode usar sua reação para se\nalimentar do terror dele. Isso causa 4d6 de dano psíquico no alvo e o deixa\nCondição: Atordoado por 1 turno. Você recupera 3d10 de Sanidade ou\n50 de Energia Astral (sua escolha)."
        }
    ],
    "Nível 20": [
        {
            "name": "Julgamento do Abismo",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "Torna-se a boca do Abismo. Uma vez por\ncombate, escolhe ponto até 8m e cria Explosão Catastrófica (5m de raio). Todas as\ncriaturas fazem 2 testes simultâneos - Constituição CD 25 e Sanidade CD 25.\nResultados\nFalha nos dois: 25d10 de dano de Praga,\nCondição: Inconsciente por 1 turno,\nCondição: Exausto por 2 turnos. (Criaturas de Podridão:\ndano dobrado)\nFalha em um: 15d10 de dano (Praga ou Mental),\nCondição: Paralisada por 2 turnos\nSucesso em ambos: 12d10 de dano, sem penalidades\nApós usar: Rastejante fica Condição: Marcado por 2 turnos.\n&lt; • Ação Padrão • &gt;"
        }
    ]
},
    "Protegidos": {
    "Nível 1": [
        {
            "name": "\"Fique atrás de mim.\"",
            "cost": "35 de Energia Astral",
            "type": "Ação Bônus",
            "description": "O Protegido pode Proteger um aliado.\nProteger: até o início do próximo turno do Protegido, a Criatura\nGuardiã intercepta todos os ataques direcionados a esse aliado e lhe garante um\nEscudo Espectral de 20 de PVs, quando o escudo for destruído, a criatura se\nprontifica a ser um escudo vivo, absorvendo o dano no lugar do aliado protegido.\nA Criatura pode absorver até 50% do dano total durante esse período. Ao atingir o\nlimite, a Criatura automaticamente retorna ao lado do Protegido e a proteção é\nencerrada.\nA proteção se mantém mesmo que o aliado se mova, desde que continue dentro de\n10B."
        },
        {
            "name": "\"Divida comigo o fardo.\"",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "O Protegido compartilha parte da dor de sua Criatura Guardiã, canalizando seu\nvínculo para aliviar o sofrimento da criatura.\nA Criatura Guardiã recupera 25 de PVs, e o Protegido perde 10 de PVs, ignorando\nresistências e reduções.\nSó pode ser usada se a Criatura estiver com menos de 100% da Vida máxima."
        },
        {
            "name": "[Criatura] \"Se dói em mim, dói menos em você.\"",
            "cost": "Nenhum",
            "type": "Ação Reação",
            "description": "Após o Portador receber algum ataque ou dano, a Criatura transfere força vital para\nacalmar o Portador.\nTransfere até 25 PVs para o Portador. A Criatura perde PVs iguais aos\ntransferidos.\nCaso a fonte do dano tenha sido fora de combate, a criatura pode escolher quantos\npontos quer transferir.\n-PVs definidos-"
        },
        {
            "name": "[Criatura] \"Ele quer ver você bem\"",
            "cost": "35 de Energia Astral",
            "type": "Ação Padrão",
            "description": "Ao início de um combate, a criatura irá priorizar um aliado que esteja no estado de\nProteger.\nQuando esse aliado a 6B receber algum ataque ou dano, a Criatura protege esse\naliado, aumentando sua DEF e DEFe em 10 pontos. Além disso, esse aliado recebe um\nEscudo de 25 de PVs, o qual já recebe o dano desse ataque e dura até o fim do\ncombate ou até ser destruído."
        }
    ],
    "Nível 4": [
        {
            "name": "\"Você é tudo que tenho.\"",
            "cost": "80 de Energia Astral",
            "type": "Ação Bônus",
            "description": "O Protegido se conecta profundamente com sua Criatura Guardiã, lembrando que, mesmo\ndiante do fim, ela é a única coisa que ainda lhe resta.\nA Criatura Guardiã recebe os seguintes benefícios até o fim da próxima rodada:\n- +1 dado em todos os testes.\n- Reduz o dano de todas as fontes pela metade (2x).\n- Ganha 10 de PVs Temporários até o fim de um combate ou cena."
        },
        {
            "name": "\"Não vou deixá-lo cair.\"",
            "cost": "100 de Energia Astral",
            "type": "Ação Bônus",
            "description": "O protegido canaliza sua ligação com a Criatura Guardiã, fazendo com que ela se\nagarre a um aliado à beira da queda.\nO protegido marca um alvo (aliado). Se o alvo for reduzido a 0 de PV até o início do\nseu próximo turno, ele permanece de pé com 1 de PV e recebe uma instância de Cura\nLigada: No início de cada turno por 3 turnos (cura igual a 10 + METADE do SEN do\nprotegido).\nA habilidade só pode manter 1 aliado sob esse efeito por vez. Durante o efeito, a\ncriatura fica Indisponível e não pode ser usada até o fim do efeito. O protegido\npode cancelar o efeito a qualquer momento."
        },
        {
            "name": "[Criatura] \"Garras da Sombra\"",
            "cost": "60 de Energia Astral",
            "type": "Ação Bônus",
            "description": "A Criatura manifesta garras de energia sombria, aumentando seu poder ofensivo.\nSeus ataques corpo a corpo causam 2d10 + FOR de dano adicional e\naplicam Condição: Sangramento (1d6 por turno durante 2 turnos).\nDura 3 turnos."
        },
        {
            "name": "[Criatura] \"Vigília Eterna\"",
            "cost": "Nenhum",
            "type": "-Passiva-",
            "description": "A Criatura nunca descansa completamente. Mesmo quando o Portador dorme, ela\npermanece semi-consciente.\nA Criatura pode realizar 1 Ação de Reação mesmo quando o Portador\nestá dormindo ou inconsciente.\nAlém disso, ganha +3 em testes de percepção para detectar ameaças durante\ndescansos."
        }
    ],
    "Nível 6": [
        {
            "name": "\"A Sombra está comigo\"",
            "cost": "Nenhum",
            "type": "-Passiva-",
            "description": "Você nunca está sozinho. Mesmo quando seus olhos dormem, a Sombra permanece\ndesperta. A Criatura Guardiã vigia por você em todos os momentos, com sentidos que\nnão pertencem a este mundo.\nVocê sempre percebe a aproximação de entidades hostis a até 3B de você, mesmo que\nestejam invisíveis, camufladas ou tentando ocultar sua presença.\nTestes para detectar emboscadas, armadilhas ou ilusões que visem ocultar ameaças não\npodem ser feitos com desvantagem.\nVocê pode dormir normalmente e ainda assim não poderá ser surpreendido."
        },
        {
            "name": "\"Juntos, até o fim\"",
            "cost": "Nenhum",
            "type": "-Passiva-",
            "description": "A ligação entre o protegido e sua criatura transcende palavras, sangue ou medo. Onde\num cair, o outro sangrará. Onde um lutar, o outro estará ao lado. Sempre.\nEnquanto você e sua Criatura Guardiã estiverem a até 12B um do outro, todo dano que\num dos dois receber é dividido igualmente entre ambos (após resistências).\nAlém disso, o Protegido se torna imune a qualquer influência mental."
        },
        {
            "name": "[Criatura] \"Rugido Primordial\"",
            "cost": "80 de Energia Astral",
            "type": "Ação Padrão",
            "description": "A Criatura solta um rugido aterrorizante que ecoa do abismo.\nTodos os inimigos em um raio de 8B devem passar em um teste de Inteligência (CD 16) ou ficam\nCondição: Amedrontados por 2 turnos.\nInimigos amedrontados têm desvantagem em ataques contra o Portador e a Criatura."
        },
        {
            "name": "[Criatura] \"Instinto Protetor\"",
            "cost": "Nenhum",
            "type": "-Passiva-",
            "description": "Quando o Portador está em perigo crítico, a Criatura age por puro instinto.\nSe o Portador cair abaixo de 30% de vida, a Criatura ganha automaticamente:\n- +2 em todos os testes de ataque\n- +1d8 de dano em todos os ataques\n- Movimento aumentado em 3B\nO efeito dura até o Portador recuperar acima de 50% de vida ou até o fim do\ncombate."
        }
    ],
    "Nível 8": [
        {
            "name": "\"Eles esqueceram da escuridão.\"",
            "cost": "120 de Energia Astral",
            "type": "Ação Padrão [Duas vezes por combate/cena]",
            "description": "Você chama a criatura, não como escudo, mas como véu. A sombra se espalha, viva,\nsufocante, lembrando a todos por que a escuridão sempre foi temida.\nAo ativar, você e sua criatura invocam uma zona de trevas vivas com 6B de raio,\ncentrada em qualquer ponto a até 18B de você. A zona dura 3 turnos.\nDentro dessa área:\n- Criaturas inimigas têm Desvantagem em ataques e não podem se beneficiar de\nvisão especial (como infravisão, percepção Elemental ou sentidos passivos\nsuperiores).\n- No início do turno de qualquer inimigo dentro da zona, ele deve passar num\nteste de SEN (15) ou receberá 2d6 de dano cortante.\n- Se a Criatura Guardiã estiver na zona, ela se funde às sombras, ganhando\nVantagem total contra ataques e ignora ataques de oportunidade ao se mover."
        },
        {
            "name": "\"Entre nós, o silêncio reina.\"",
            "cost": "80 de Energia Astral",
            "type": "Ação Reação",
            "description": "Quando a conexão entre você e sua Criatura é ameaçada, algo antigo acorda. A\nresposta não é grito. É o fim de qualquer som.\nGatilho: Um inimigo alvo da sua Criatura Guardiã ou que a tenha\natacado no turno anterior realiza um ataque, conjuração ou tentativa de fuga.\nComo reação, você invoca a Criatura para romper o espaço ao redor do inimigo com um\ntimbre agressivo:\nA criatura-alvo deve realizar um teste de RF (CT\n16).\nFalha: Sofre Dano Espectral massivo (6d8) e fica Desorientado até o\nfim do próximo turno.\nSucesso: Sofre metade do dano e não recebe condições.\nSe o alvo for uma criatura já afetada por uma habilidade sua ou da Criatura, o teste\né feito com Desvantagem."
        },
        {
            "name": "[Criatura] \"Salto das Sombras\"",
            "cost": "90 de Energia Astral",
            "type": "Ação Bônus",
            "description": "A Criatura se funde momentaneamente com as sombras para se reposicionar.\nPode se teleportar até 12B para qualquer ponto que possa ver, ignorando\nobstáculos.\nSe teleportar ao lado de um inimigo que esteja atacando o Portador ou um aliado\nprotegido, pode realizar um ataque imediato com vantagem."
        },
        {
            "name": "[Criatura] \"Regeneração Sombria\"",
            "cost": "Nenhum",
            "type": "-Passiva-",
            "description": "Enquanto estiver em áreas de penumbra ou escuridão, a Criatura regenera vida\nconstantemente.\nRecupera 1d12 + SEN de PVs no início de cada turno se estiver em\nárea escura.\nEm escuridão total, a regeneração dobra para 2d12 + SEN."
        }
    ],
    "Nível 12": [
        {
            "name": "\"Proteja-os, Sombra!\"",
            "cost": "110 de Energia Astral",
            "type": "Ação Bônus",
            "description": "Você comanda sua Criatura Guardiã para formar uma barreira viva ao redor de um\naliado ou de você mesmo.\nEscolha um alvo dentro de 6B ou você mesmo.\nAté o início do seu próximo turno, todos os ataques contra o alvo têm redução de\ndano pela metade.\nEnquanto estiver dentro da barreira, o alvo recebe +2 em testes de RE e RF.\nMáximo 1 alvo por vez."
        },
        {
            "name": "\"Estou de olho em você, amigo.\"",
            "cost": "175 de Energia Astral",
            "type": "Ação Reação",
            "description": "Sua Criatura Guardiã mantém vigilância constante.\nEnquanto estiver a até 12B do Protegido:\nSempre que um aliado dentro dessa distância for atingido, você pode gastar sua\nReação para reduzir o dano em 50%, ou redirecionar o dano inteiro para a Criatura\nGuardiã."
        },
        {
            "name": "[Criatura] \"Abraço Sufocante\"",
            "cost": "120 de Energia Astral",
            "type": "Ação Padrão",
            "description": "A Criatura envolve um inimigo com seus membros sombrios, imobilizando-o.\nEscolha um alvo a até 4B. O alvo deve passar em um teste de Força (CD = 12 + FOR da Criatura).\nFalha: O alvo fica Condição: Agarrado e sofre\n3d8 de dano por turno enquanto estiver preso.\nSucesso: O alvo resiste mas sofre metade do dano.\nO alvo pode tentar se soltar no início de cada turno dele."
        },
        {
            "name": "[Criatura] \"Sentir o Perigo\"",
            "cost": "Nenhum",
            "type": "-Passiva-",
            "description": "A Criatura desenvolve um sexto sentido para ameaças iminentes.\nSempre que o Portador ou um aliado a até 10B for alvo de um ataque surpresa ou\nemboscada, a Criatura pode gastar sua Reação para alertar, concedendo ao alvo +4 em\ntestes de esquiva.\nAlém disso, a Criatura não pode ser surpreendida."
        }
    ],
    "Nível 15": [
        {
            "name": "\"Se afaste!\"",
            "cost": "175 de Energia Astral",
            "type": "Ação Reação",
            "description": "Quando um aliado que você protege sofrer dano que o reduziria a 0 PV:\nVocê pode gastar Reação para colocar sua Criatura entre o aliado e o perigo.\nO aliado permanece com 1 PV.\nEnquanto o efeito durar (2 turnos do inimigo), a Criatura Guardiã absorve 50% de\ntodo dano recebido pelo aliado."
        },
        {
            "name": "\"Ele está com medo.\"",
            "cost": "110 de Energia Astral",
            "type": "Ação Padrão",
            "description": "Quando um aliado cair a 0 PV, a Criatura poderá, a seu comando, reerguer o seu\naliado mesmo à distância."
        },
        {
            "name": "[Criatura] \"Fúria Protetora\"",
            "cost": "150 de Energia Astral",
            "type": "Ação Reação",
            "description": "Quando um aliado protegido pela Criatura é gravemente ferido, ela entra em\nfúria.\nGatilho: Um aliado a até 10B cai abaixo de 25% de vida ou é\nreduzido a 0 PV.\nA Criatura entra em estado de fúria por 3 turnos, ganhando:\n- Vantagem em todos os ataques\n- +2d10 de dano em todos os ataques\n- Resistência a dano físico (reduz pela metade)\n- Imunidade a efeitos de medo e controle mental"
        },
        {
            "name": "[Criatura] \"Vínculo Inabalável\"",
            "cost": "Nenhum",
            "type": "-Passiva-",
            "description": "A conexão entre Portador e Criatura se torna tão forte que a morte de um não\nsignifica o fim do outro.\nSe o Portador for reduzido a 0 PV, a Criatura pode sacrificar 75% de seus\nPVs atuais para estabilizá-lo automaticamente com 1 PV.\nPode ser usado uma vez por descanso longo."
        }
    ],
    "Nível 20": [
        {
            "name": "\"Somos Um, até o Fim\"",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "Você e sua Criatura tornam-se uma unidade perfeita de proteção, impossível de\nseparar:\nEnquanto estiverem juntos, todo aliado dentro de 12B recebe 50% de redução de dano\nde todas as fontes.\nSempre que um aliado ou você for reduzido a 0 PV, a Criatura pode sacrificar metade\nde seus PVs para manter o alvo vivo com 30 PV.\nDurante 3 turnos por ativação, você e a Criatura compartilham PVs: qualquer dano\nrecebido é dividido igualmente.\nPode ser usada uma vez por combate/cena.\n-Após o término do efeito, o Protegido fica Exausto e\nsua criatura desaparece durante 1 turno-"
        },
        {
            "name": "[Criatura] \"Guardião Ancestral\"",
            "cost": "300 de Energia Astral",
            "type": "Ação Bônus",
            "description": "A Criatura atinge seu potencial máximo, tornando-se uma manifestação completa do\npoder ancestral.\nPor 5 turnos, a Criatura se transforma em sua forma ancestral completa,\nganhando:\n- Seus atributos (FOR, DES, SEN) dobram\n- Ganha +50 PVs temporários\n- Todos os ataques causam +3d12 de dano sombrio adicional\n- Pode realizar 2 ataques por turno\n- Cria uma aura de 6B que concede a todos os aliados +3 em DEF e DEFe\n- Inimigos na aura têm desvantagem em todos os ataques\nApós o término, a Criatura fica Condição: Exausta e seus atributos\nsão reduzidos pela metade por 2 turnos.\nPode ser usado uma vez por descanso longo."
        }
    ]
},
    "Consagrados": {
    "Nível 1": [
        {
            "name": "Catalisador Divino",
            "cost": "Redução de Custo",
            "type": "Passiva",
            "description": "\"O Consagrado não apenas ora; ele se\ntorna o próprio canal por onde a vontade das divindades se manifesta na\nrealidade física.\"\nEfeito: Você pode canalizar sua Energia\nAstral de forma mais eficiente. Sempre que ativar um Selo, role\n1d10 x Proficiência. O valor resultante é reduzido do custo total\nde Energia Astral do Selo (mínimo 5 EA). Além disso, você recebe\nOcultismo como perícia treinada."
        }
    ],
    "Nível 3": [
        {
            "name": "Vínculo Elemental",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "\"Sua devoção se cristaliza em uma afinidade elemental pura.\"\nEfeito: Escolha um Elemento para se vincular. Sempre que você utilizar Selos desse elemento, o custo de Energia Astral é reduzido em 10 (mínimo 1) e a CD dos testes de resistência contra esses selos aumenta em +2."
        }
    ],
    "Nível 4": [
        {
            "name": "Confluência de Selos",
            "cost": "45 de Energia Astral",
            "type": "Ação Bônus",
            "description": "\"Através de meditação e sacrifício, o\ncorpo\ndo Consagrado se adapta à pressão elemental dos deuses.\"\nEfeito: Você recebe +1 Selo adicional de sua\ndivindade. Além disso, você aprende a Ampliar Selos: gastando uma\nAção Bônus e +45 EA, você pode dobrar o alcance ou o raio de efeito de qualquer Selo\nque ativar neste turno. Seus Selos de Influência 1 agora causam +1d6 de dano/cura\nextra."
        }
    ],
    "Nível 6": [
        {
            "name": "Sacrifício do Fiel",
            "cost": "Custo em PV",
            "type": "Reação",
            "description": "\"Você entende que o sangue é a forma\nmais pura\nde energia, e que a dor é um preço pequeno para o poder divino.\"\nEfeito: Você recebe +1 Selo adicional. Uma vez por\nrodada, você pode optar por pagar o custo de Energia\nAstral de um Selo usando seus próprios Pontos de\nVida (1 PV para cada 2 EA). Se fizer isso, a Influência do Selo é\nconsiderada +1 para aquele uso (máximo Influência 4)."
        }
    ],
    "Nível 8": [
        {
            "name": "Efeito",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "Você pode sustentar a concentração de um Selo ativo como\nAção Bônus em vez de Ação Padrão. Além disso, todos os inimigos que\niniciarem o turno dentro da área de um dos seus Selos ativos sofrem uma penalidade\nde -2 em Testes de Resistência (RE/RF)."
        }
    ],
    "Nível 12": [
        {
            "name": "Efeito",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "Você recebe +1 Selo adicional. Você agora\npode manter dois Selos ativos simultaneamente (pagando o custo de\nambos). Se ambos os Selos forem da mesma divindade, o custo de manutenção do segundo\nSelo é reduzido pela metade."
        }
    ],
    "Nível 15": [
        {
            "name": "Efeito",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "Você aprende a Acelerar Selo: uma vez por\ncena, você pode ativar um Selo como uma Ação Livre. Além disso,\nvocê recebe imunidade ao dano elemental causado pela sua própria divindade e seus\nSelos ignoram qualquer tipo de Resistência a Dano (RD) elemental."
        }
    ],
    "Nível 20": [
        {
            "name": "Efeito",
            "cost": "500 de Energia Astral",
            "type": "Ação Padrão",
            "description": "Recebe +2 Selos adicionais. Uma vez por\ncena, você pode entrar em estado de Apoteose por 3 turnos. Durante\neste tempo: Você recupera toda a sua Energia Astral;\nPode ativar qualquer Selo que conheça como Ação Bônus; Sua Influência em todos os\nSelos ativados é sempre o máximo permitido (4). Ao final da Apoteose, você fica\nExausto até o fim do combate devido à sobrecarga divina."
        }
    ]
},
    "Furtassaltantes": {
    "Nível 1": [
        {
            "name": "Golpe das Sombras",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "O Furtassaltante canaliza sua energia astral\nem um ataque preciso contra um inimigo Desprevenido, causando dano aumentado. O\npróximo Ataque furtivo causa 2d8 a mais de dano.\n&lt; • Ação Bônus • &gt;\n-55 de Energia Astral-"
        },
        {
            "name": "“Desapareci!”",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "O Furtassaltante não gasta um turno para se\nesconder e consegue se esconder de forma garantida mesmo em terreno aberto,\ntornando-se Indetectável. Neste estado, se mover não provoca\nataques de oportunidade, porém seu próximo ataque o revela.\n&lt; • Ação Bônus • &gt;\n-35 de Energia Astral-"
        }
    ],
    "Nível 4": [
        {
            "name": "Passo Fantasma",
            "cost": "Nenhum",
            "type": "Ação Bônus",
            "description": "O Furtassaltante pode atravessar o campo de\nbatalha sem ser visto, reposicionando-se para atacar de forma vantajosa. Pode se\nmover até 6B sem provocar ataques de oportunidade. Ao final do\nmovimento, o próximo ataque furtivo tem dano aumentado em 1d8\nadicional.\n-35 de Energia Astral-"
        },
        {
            "name": "Ataque Preciso",
            "cost": "Nenhum",
            "type": "-Passiva-",
            "description": "O Furtassaltante foca em pontos vitais do\ninimigo. Escolha um alvo; o próximo ataque contra ele tem chance de crítico\naumentada (o crítico passa a ser 17). Funciona apenas contra\ninimigos a 3B de distância ou menos. Pode marcar apenas 1 inimigo por\nvez."
        }
    ],
    "Nível 6": [
        {
            "name": "Sombra que Mata",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "Toda vez que o Furtassaltante acerta um ataque\nfurtivo, ele causa Sangramento no alvo atingido.\n-Passiva-"
        },
        {
            "name": "Esquiva das Sombras",
            "cost": "Nenhum",
            "type": "-Passiva-",
            "description": "O Furtassaltante reage à aproximação de\ninimigos, aumentando sua facilidade para esquivar de ataques. Testes de esquiva\nrecebem +2."
        }
    ],
    "Nível 8": [
        {
            "name": "“Eles esqueceram da escuridão.”",
            "cost": "190 de Energia Astral",
            "type": "Passiva",
            "description": "Canaliza toda sua força no\npróximo ataque, causando 100% a mais do dano desse ataque +\n2d8, podendo depois dele se deslocar até 3B. Após o ataque, o\nFurtassaltante fica Exausto por 1 Turno. (1 vez por\ncombate)."
        },
        {
            "name": "Passagem Invisível",
            "cost": "60 de Energia Astral",
            "type": "Ação Bônus",
            "description": "O Furtassaltante se torna praticamente\ninvisível por 3 turnos ou até atacar. Inimigos têm desvantagem total em todos os\ntestes de percepção para detectá-lo."
        }
    ],
    "Nível 12": [
        {
            "name": "Mestre das Sombras",
            "cost": "Nenhum",
            "type": "-Passiva-",
            "description": "Ataques furtivos sempre ignoram a Armadura\ndo inimigo. Acertos críticos em ataques furtivos causam o dobro do\ndano."
        },
        {
            "name": "Silêncio Mortal",
            "cost": "Nenhum",
            "type": "-Passiva-",
            "description": "Enquanto estiver sem ser detectado, inimigos\npróximos (3B) sofrem desvantagem em testes de RF e\nDES."
        }
    ],
    "Nível 15": [
        {
            "name": "Golpe Fantasma",
            "cost": "200 de Energia Astral",
            "type": "Ação Bônus",
            "description": "O Furtassaltante usa sua velocidade para\nrepetir um ataque feito anteriormente. Uma vez por turno, após uma ação de\nataque, pode repetir o dano causado anteriormente."
        },
        {
            "name": "Marca do Ladrão",
            "cost": "175 de Energia Astral",
            "type": "Ação Padrão",
            "description": "Marca uma área de 4B de raio\nao seu redor por 3 turnos. Enquanto estiver na área, seus ataques causam\n+1d8 + DES de dano\nadicional. (Apenas 1 marca ativa por vez)."
        }
    ],
    "Nível 20": [
        {
            "name": "\"Vontade Assassina\"",
            "cost": "Nenhum",
            "type": "Passiva",
            "description": "Durante este estado, todo ataque furtivo\ncausa Dano Crítico e Dano Verdadeiro. Você\nrecebe +2 em DES e inimigos\nte atacam com desvantagem. Dura 3 turnos (1 vez por combate).\n-350 de Energia Astral-"
        }
    ]
},

        "Selos": {

        "Nulídrico": [

            {

                "name": "Olhar do Abismo",

                "cost": "20 EA",

                "type": "Ação Padrão",

                "description": "Permite ao usuário enxergar através de matéria sólida inorgânica (paredes, portas) por 10 segundos. A visão torna-se monocromática e distorcida nas bordas.",

                "influence": "1",

                "range": "Pessoal",

                "duration": "10 segundos",

                "components": "Fragmentos de Obsidiana"

            },

            {

                "name": "Passo Inexistente",

                "cost": "15 EA",

                "type": "Ação de Movimento",

                "description": "O usuário remove o som de seus passos e sua pegada física da realidade. Concede vantagem em testes de Furtividade e não deixa rastros físicos.",

                "influence": "1",

                "range": "Pessoal",

                "duration": "1 minuto",

                "components": "Fragmentos de Obsidiana"

            },

            {

                "name": "Colapso Gravitacional",

                "cost": "45 EA",

                "type": "Ação Padrão",

                "description": "Cria uma esfera de gravidade intensa que puxa todos em um raio de 3m para o centro. Causa 4d6 de dano de esmagamento e deixa os alvos caídos.",

                "influence": "2",

                "range": "Curto (9m)",

                "duration": "",

                "components": "Fragmentos de Obsidiana"

            },

            {

                "name": "Bolso de Vácuo",

                "cost": "30 EA",

                "type": "Ação Completa",

                "description": "Abre uma pequena fenda dimensional onde um objeto de até 5kg pode ser guardado. O objeto desaparece da realidade e pode ser recuperado instantaneamente pelo usuário como uma ação livre.",

                "influence": "2",

                "range": "Toque",

                "duration": "Permanente (até recuperar)",

                "components": "Fragmentos de Obsidiana"

            },

            {

                "name": "Negação de Energia",

                "cost": "60 EA",

                "type": "Reação",

                "description": "Cria uma barreira que absorve o próximo selo ou ataque mágico lançado contra o usuário, convertendo-o em nada. O ataque é completamente anulado.",

                "influence": "3",

                "range": "Pessoal",

                "duration": "Instantânea",

                "components": "Fragmentos de Obsidiana"

            },

            {

                "name": "Asfixia Espacial",

                "cost": "55 EA",

                "type": "Ação Padrão",

                "description": "Remove o ar ao redor da cabeça de um alvo. O alvo sofre 3d8 de dano direto, fica Silenciado (não pode falar ou conjurar selos verbais) e começa a sufocar por 1 rodada.",

                "influence": "3",

                "range": "Curto (9m)",

                "duration": "",

                "components": "Fragmentos de Obsidiana"

            }

        ],

        "Solar": [

            {

                "name": "Lança da Alvorada",

                "cost": "35 EA",

                "type": "Ação Padrão",

                "description": "Condensa luz solar em uma lança arremessável. Realize um ataque de toque à distância. Causa 6d6 de dano (metade fogo, metade perfuração) e ignora RD de armaduras leves.",

                "influence": "2",

                "range": "Médio (18m)",

                "duration": "",

                "components": "Pó de Ouro"

            },

            {

                "name": "Aura da Verdade",

                "cost": "40 EA",

                "type": "Ação Padrão",

                "description": "Emite uma luz dourada de 5m. Dentro dessa luz, ilusões falham automaticamente e mentiras causam desconforto físico visível (suor, tremor) em quem as conta. Concede +5 em Intuição.",

                "influence": "2",

                "range": "Pessoal (5m raio)",

                "duration": "Cena",

                "components": "Pó de Ouro"

            },

            {

                "name": "Cauterização Rápida",

                "cost": "15 EA",

                "type": "Ação Padrão",

                "description": "Fecha feridas abertas instantaneamente usando calor intenso. Para condições de Sangramento imediatamente, mas causa 1 ponto de dano de fogo ao alvo.",

                "influence": "1",

                "range": "Toque",

                "duration": "",

                "components": "Pó de Ouro"

            },

            {

                "name": "Supernova Menor",

                "cost": "80 EA",

                "type": "Ação Completa",

                "description": "O usuário explode em luz e calor. Todas as criaturas num raio de 9m sofrem 10d6 de dano de fogo e ficam Cegas por 1 rodada. O usuário fica Atordoado até o fim do seu próximo turno.",

                "influence": "4",

                "range": "Pessoal (9m raio)",

                "duration": "",

                "components": "Pó de Ouro"

            },

            {

                "name": "Lanterna Guia",

                "cost": "10 EA",

                "type": "Ação Padrão",

                "description": "Cria uma esfera de luz que flutua e segue o usuário. Pode ser comandada para iluminar locais distantes até 30m. Revela pegadas recentes com um brilho tênue.",

                "influence": "1",

                "range": "",

                "duration": "1 hora",

                "components": "Pó de Ouro"

            },

            {

                "name": "Escudo de Calor",

                "cost": "25 EA",

                "type": "Reação",

                "description": "Uma aura térmica envolve o usuário. Concede RD 10 contra Frio e derrete projéteis de madeira ou gelo antes que atinjam o usuário (Defesa +5 contra esses ataques).",

                "influence": "2",

                "range": "",

                "duration": "1 rodada",

                "components": "Pó de Ouro"

            }

        ],

        "Estase": [

            {

                "name": "Prisão de Cristal",

                "cost": "30 EA",

                "type": "Ação Padrão",

                "description": "Congela os pés do alvo no chão. O alvo fica Imóvel (deslocamento 0) e recebe -2 em Defesa. Pode tentar quebrar o gelo (Força CD 20) como ação padrão.",

                "influence": "2",

                "range": "Curto (9m)",

                "duration": "",

                "components": "Pó de Quartzo"

            },

            {

                "name": "Cronostase",

                "cost": "45 EA",

                "type": "Ação Padrão",

                "description": "\"Pausa\" a condição de um alvo (sangramento, veneno, buffs ou debuffs). Durante 2 rodadas, a duração desses efeitos não conta e eles não causam dano/efeito.",

                "influence": "3",

                "range": "Toque",

                "duration": "2 rodadas",

                "components": "Pó de Quartzo"

            },

            {

                "name": "Lâmina de Geada",

                "cost": "20 EA",

                "type": "Ação de Movimento",

                "description": "Reveste uma arma corpo-a-corpo com gelo ultra-frio. A arma causa +1d6 de dano de frio. Críticos com a arma reduzem o deslocamento do alvo em 3m por 1 rodada.",

                "influence": "1",

                "range": "Toque",

                "duration": "Cena",

                "components": "Pó de Quartzo"

            },

            {

                "name": "Retroceder Ferida",

                "cost": "50 EA",

                "type": "Reação",

                "description": "Reverte o tempo em um ferimento específico sofrido na última rodada. O alvo recupera PV igual ao dano do último ataque sofrido (máximo 30 PV).",

                "influence": "3",

                "range": "Toque",

                "duration": "",

                "components": "Pó de Quartzo"

            },

            {

                "name": "Ecos do Passado",

                "cost": "35 EA",

                "type": "1 minuto",

                "description": "Permite ver \"fantasmas\" visuais de eventos que ocorreram no local nas últimas 24 horas. As imagens são silenciosas e translúcidas.",

                "influence": "2",

                "range": "Área (local)",

                "duration": "",

                "components": "Pó de Quartzo"

            },

            {

                "name": "Zona de Lentidão",

                "cost": "50 EA",

                "type": "Ação Padrão",

                "description": "Cria uma área onde o tempo flui devagar. Todas as criaturas na área têm seu deslocamento reduzido à metade e não podem fazer reações. Projéteis que entram na área têm -5 no ataque.",

                "influence": "3",

                "range": "Curto (9m)",

                "duration": "Sustentada",

                "components": "Pó de Quartzo"

            }

        ],

        "Praga": [

            {

                "name": "Enxame Devorador",

                "cost": "30 EA",

                "type": "Ação Padrão",

                "description": "Conjura uma nuvem de insetos carnívoros. Causa 4d6 de dano perfurante e o alvo fica Cego até o final do seu próximo turno devido aos insetos nos olhos.",

                "influence": "2",

                "range": "Curto (9m)",

                "duration": "Instantânea",

                "components": "Biomassa"

            },

            {

                "name": "Carapaça Quitinos",

                "cost": "25 EA",

                "type": "Ação Padrão",

                "description": "A pele do usuário endurece e ganha placas de quitina. Concede +5 na Defesa e RD 2 contra dano físico (corte/perfuração/impacto).",

                "influence": "2",

                "range": "Pessoal",

                "duration": "Cena",

                "components": "Biomassa"

            },

            {

                "name": "Rastreio Feromonal",

                "cost": "15 EA",

                "type": "Ação Padrão",

                "description": "Marca um alvo com um cheiro imperceptível para humanos. O usuário sabe a direção exata e distância do alvo enquanto durar o efeito.",

                "influence": "1",

                "range": "Toque",

                "duration": "1 hora",

                "components": "Biomassa"

            },

            {

                "name": "Olho da Mosca",

                "cost": "20 EA",

                "type": "Ação Completa",

                "description": "O usuário transfere sua visão para um inseto comum a até 30m. Pode ver através dele (visão facetada, -2 em Percepção visual) enquanto se concentrar.",

                "influence": "1",

                "range": "",

                "duration": "Concentração",

                "components": "Biomassa"

            },

            {

                "name": "Névoa Tóxica",

                "cost": "45 EA",

                "type": "Ação Padrão",

                "description": "Libera esporos esverdeados. Criaturas na área sofrem 4d6 de dano de veneno e ficam Enjoadas (apenas uma ação por turno). Sucesso no teste reduz dano à metade e evita enjoo.",

                "influence": "3",

                "range": "Curto (9m)",

                "duration": "",

                "components": "Biomassa"

            },

            {

                "name": "Infecção Latente",

                "cost": "40 EA",

                "type": "Ação Padrão",

                "description": "Infecta o alvo com um vírus mágico. O alvo sofre 1d6 de dano na primeira rodada, 2d6 na segunda, 4d6 na terceira, dobrando até passar no teste (realizado no fim de cada turno) ou morrer.",

                "influence": "3",

                "range": "Toque",

                "duration": "",

                "components": "Biomassa"

            }

        ],

        "Pesadelo": [

            {

                "name": "Sussurros da Loucura",

                "cost": "25 EA",

                "type": "Ação Padrão",

                "description": "O alvo ouve vozes constantes e perturbadoras. Sofre desvantagem em todos os testes de Perícia baseados em Inteligência e Percepção.",

                "influence": "2",

                "range": "Médio (18m)",

                "duration": "",

                "components": "Óleo Negro"

            },

            {

                "name": "Doppelganger",

                "cost": "30 EA",

                "type": "Ação Padrão",

                "description": "Cria uma cópia ilusória perfeita do usuário. Ela se move e imita ações, mas não causa dano. Ataques contra o usuário têm 50% de chance de atingir a cópia (que desaparece se atingida).",

                "influence": "2",

                "range": "Curto (9m)",

                "duration": "Cena",

                "components": "Óleo Negro"

            },

            {

                "name": "Leitura Onírica",

                "cost": "20 EA",

                "type": "10 minutos",

                "description": "Se o alvo estiver dormindo, o usuário pode entrar em seu sonho e extrair uma informação específica (uma resposta curta e verdadeira). O alvo não se lembra da invasão.",

                "influence": "1",

                "range": "Toque",

                "duration": "",

                "components": "Óleo Negro"

            },

            {

                "name": "Terror Noturno",

                "cost": "45 EA",

                "type": "Ação Padrão",

                "description": "Materializa o maior medo do alvo. Causa 6d6 de dano mental (Sanidade/Psíquico). Se falhar na resistência, o alvo fica Abalado.",

                "influence": "3",

                "range": "Curto (9m)",

                "duration": "",

                "components": "Óleo Negro"

            },

            {

                "name": "Manto de Sombras",

                "cost": "30 EA",

                "type": "Ação Padrão",

                "description": "O usuário se torna invisível enquanto estiver em áreas de penumbra ou escuridão. Atacar ou usar selos quebra a invisibilidade.",

                "influence": "2",

                "range": "Pessoal",

                "duration": "Sustentada",

                "components": "Óleo Negro"

            },

            {

                "name": "Labirinto Mental",

                "cost": "65 EA",

                "type": "Ação Completa",

                "description": "O alvo acredita estar preso em um labirinto infinito. No mundo real, ele fica Paralisado e indefeso. A cada turno, pode fazer um novo teste de Vontade para tentar escapar.",

                "influence": "4",

                "range": "Curto (9m)",

                "duration": "",

                "components": "Óleo Negro"

            }

        ],

        "Sagrado": [

            {

                "name": "Círculo de Santificação",

                "cost": "50 EA",

                "type": "Ação Completa",

                "description": "Cria um círculo no chão. Criaturas do tipo Morto-vivo, Demônio ou Corrompido não conseguem atravessar a barreira física ou magicamente.",

                "influence": "3",

                "range": "Toque",

                "duration": "Cena",

                "components": "Limalha de Prata"

            },

            {

                "name": "Veredito Final",

                "cost": "45 EA",

                "type": "Ação Padrão",

                "description": "Um raio de luz vertical cai sobre o alvo. Causa 8d8 de dano radiante. Se o alvo causou dano a um inocente ou aliado na última rodada, o dano aumenta para 10d8.",

                "influence": "3",

                "range": "Médio (18m)",

                "duration": "",

                "components": "Limalha de Prata"

            },

            {

                "name": "Purificação",

                "cost": "30 EA",

                "type": "Ação Padrão",

                "description": "Remove instantaneamente todas as condições de Veneno, Doença e Maldições de nível baixo/médio de um alvo.",

                "influence": "2",

                "range": "Toque",

                "duration": "",

                "components": "Limalha de Prata"

            },

            {

                "name": "Elo de Martírio",

                "cost": "25 EA",

                "type": "Ação Padrão",

                "description": "O usuário cria um elo com um aliado. Metade de todo dano que o aliado receberia é transferido para o usuário (que não pode reduzir esse dano).",

                "influence": "2",

                "range": "Curto (9m)",

                "duration": "Cena",

                "components": "Limalha de Prata"

            },

            {

                "name": "Revelação de Intenção",

                "cost": "15 EA",

                "type": "Ação Padrão",

                "description": "O usuário enxerga uma aura ao redor das pessoas. Vermelho para hostil, verde para amigável, cinza para neutro. Bônus de +5 em Intuição.",

                "influence": "1",

                "range": "Pessoal",

                "duration": "1 minuto",

                "components": "Limalha de Prata"

            },

            {

                "name": "Bênção da Coragem",

                "cost": "20 EA",

                "type": "Ação Padrão",

                "description": "Remove a condição Abalado ou Apavorado de aliados e concede imunidade a efeitos de medo pela duração. Concede +2 em testes de Vontade.",

                "influence": "1",

                "range": "Curto (9m)",

                "duration": "Cena",

                "components": "Limalha de Prata"

            }

        ],

        "Electro": [

            {

                "name": "Pulso EMP",

                "cost": "30 EA",

                "type": "Ação Padrão",

                "description": "Desativa todos os eletrônicos não-mágicos, luzes elétricas e sistemas de segurança em um raio de 20m. Aparelhos complexos podem queimar permanentemente.",

                "influence": "2",

                "range": "Pessoal (20m raio)",

                "duration": "Instantânea",

                "components": "Componentes Eletrônicos"

            },

            {

                "name": "Salto Relâmpago",

                "cost": "40 EA",

                "type": "Ação de Movimento",

                "description": "O usuário se transforma em eletricidade pura e se teletransporta instantaneamente para um ponto visível. Causa 2d6 de dano elétrico a quem estiver adjacente ao ponto de chegada.",

                "influence": "3",

                "range": "Curto (15m)",

                "duration": "",

                "components": "Componentes Eletrônicos"

            },

            {

                "name": "Cadeia de Raios",

                "cost": "50 EA",

                "type": "Ação Padrão",

                "description": "Dispara um raio que atinge um alvo primário (6d6 elétrico) e salta para até 2 outros inimigos a até 6m do primeiro (3d6 elétrico cada).",

                "influence": "3",

                "range": "Médio (18m)",

                "duration": "",

                "components": "Componentes Eletrônicos"

            },

            {

                "name": "Sobrecarga Sináptica",

                "cost": "35 EA",

                "type": "Ação Padrão",

                "description": "Sobrecarrega o sistema nervoso do alvo com eletricidade estática. O alvo fica Paralisado por 1 rodada e sofre 2d6 de dano elétrico.",

                "influence": "2",

                "range": "Curto (9m)",

                "duration": "",

                "components": "Componentes Eletrônicos"

            },

            {

                "name": "Condutor Humano",

                "cost": "25 EA",

                "type": "Ação Livre",

                "description": "Aumenta drasticamente os reflexos. O usuário ganha +1 ação de movimento por turno e +2 na Defesa e Reflexos.",

                "influence": "2",

                "range": "Pessoal",

                "duration": "3 rodadas",

                "components": "Componentes Eletrônicos"

            },

            {

                "name": "Ressonância de Sinal",

                "cost": "15 EA",

                "type": "Ação Padrão",

                "description": "Permite ao usuário \"ouvir\" e interceptar transmissões de rádio, celular ou wi-fi no ar sem precisar de aparelhos. Pode rastrear a origem do sinal.",

                "influence": "1",

                "range": "",

                "duration": "10 minutos",

                "components": "Componentes Eletrônicos"

            }

        ],

        "Podridão": [

            {

                "name": "Toque da Ruína",

                "cost": "20 EA",

                "type": "Ação Padrão",

                "description": "O toque do usuário enferruja metais ou apodrece madeira instantaneamente. Causa 2d10 de dano a objetos ou constructos. Destrói fechaduras comuns.",

                "influence": "1",

                "range": "Toque",

                "duration": "",

                "components": "Matéria Necrótica"

            },

            {

                "name": "Interrogar os Mortos",

                "cost": "30 EA",

                "type": "1 minuto",

                "description": "Reanima temporariamente a cabeça de um cadáver para responder a 3 perguntas. As respostas são crípticas e baseadas no que ele sabia em vida.",

                "influence": "2",

                "range": "Toque",

                "duration": "",

                "components": "Matéria Necrótica"

            },

            {

                "name": "Drenar Vitalidade",

                "cost": "45 EA",

                "type": "Ação Padrão",

                "description": "Suga a vida de um alvo orgânico. Causa 6d6 de dano de necrose. O usuário recupera PV igual à metade do dano causado.",

                "influence": "3",

                "range": "Curto (9m)",

                "duration": "",

                "components": "Matéria Necrótica"

            },

            {

                "name": "Miasma da Decomposição",

                "cost": "25 EA",

                "type": "Ação Padrão",

                "description": "Envolve o alvo em um gás corrosivo. Reduz a RD de armaduras e resistência natural do alvo em 5.",

                "influence": "2",

                "range": "Curto (9m)",

                "duration": "Cena",

                "components": "Matéria Necrótica"

            },

            {

                "name": "Marionete de Carne",

                "cost": "50 EA",

                "type": "Ação Completa",

                "description": "Levanta um cadáver próximo (tamanho médio ou pequeno) para lutar. Ele tem as estatísticas de um Zumbi Pútrido (Bestiário). Ao final, vira pó.",

                "influence": "3",

                "range": "Curto (9m)",

                "duration": "1 minuto",

                "components": "Matéria Necrótica"

            }

        ]

    }
};
