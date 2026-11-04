// ============================================================
// WUITALUR RPG 2.0 - REGISTRO DECLARATIVO DE REGRAS (RULES REGISTRY)
// ============================================================

(function(global) {
  const UNIVERSAL_MAESTRY = {
    1: 2, 2: 2, 3: 2, 4: 2,
    5: 4, 6: 4, 7: 4, 8: 4,
    9: 8, 10: 8, 11: 8, 12: 8,
    13: 16, 14: 16, 15: 16
  };

  const STANDARD_ATTRIBUTE_ARRAY = [3, 2, 1, 1, 0];

  const SKILLS = {
    acrobacia: { id: "acrobacia", name: "Acrobacia", attrs: ["des"], desc: "Equilibrio corporal, manobras evasivas e contorcionismo." },
    furtividade: { id: "furtividade", name: "Furtividade", attrs: ["des"], desc: "Mover-se em silencio e ocultar-se nas sombras." },
    investigacao: { id: "investigacao", name: "Investigacao", attrs: ["men"], desc: "Deducao, pistas ocultas e analise de misterios." },
    medicina: { id: "medicina", name: "Medicina", attrs: ["men"], desc: "Estabilizar aliados, diagnosticos e tratamentos de campo." },
    oficio: { id: "oficio", name: "Oficio", attrs: ["men"], desc: "Ferraria, conserto de armas, armaduras e automatos." },
    astral: { id: "astral", name: "Astral", attrs: ["men"], desc: "Conhecimento cosmico, rituais e sintonia com a Energia Astral." },
    persuasao: { id: "persuasao", name: "Persuasao", attrs: ["exp"], desc: "Diplomacia, negociacao e convencimento pela palavra." },
    enganacao: { id: "enganacao", name: "Enganacao", attrs: ["exp"], desc: "Blefes, disfarces sociais e mentiras convincentes." },
    atletismo: { id: "atletismo", name: "Atletismo", attrs: ["for", "des"], desc: "Esforco fisico bruto (FOR) ou corrida e saltos (DES)." },
    intimidacao: { id: "intimidacao", name: "Intimidacao", attrs: ["exp", "for"], desc: "Postura dominadora (EXP) ou demonstracao fisica de forca (FOR)." },
    percepcao: { id: "percepcao", name: "Percepcao", attrs: ["men", "exp"], desc: "Notar detalhes e ruidos (MEN) ou intuicao social (EXP)." },
    sobrevivencia: { id: "sobrevivencia", name: "Sobrevivencia", attrs: ["men", "vig"], desc: "Rastreio e orientacao (MEN) ou marcha forcada e clima (VIG)." }
  };

  const RACES = {
    akivus: {
      id: "akivus",
      name: "Akivus",
      category: "Celeste",
      traits: [
        { id: "plumas_eter", name: "Penas Condutoras", desc: "+2B em distancia de salto e queda sem dano." }
      ]
    },
    animalescos: {
      id: "animalescos",
      name: "Animalescos",
      category: "Biologico",
      traits: [
        { id: "instinto_predatorio", name: "Instinto Predatorio", desc: "Sentidos apurados em combate de proximidade." }
      ]
    },
    plantiferos: {
      id: "plantiferos",
      name: "Plantiferos",
      category: "Vegetal",
      traits: [
        { id: "fotossintese", name: "Fotossintese", desc: "Regeneracao acelerada sob exposicao solar constante." }
      ]
    },
    humanos: {
      id: "humanos",
      name: "Humanos",
      category: "Adaptavel",
      bonusTrainedSkillsCount: 1,
      traits: [
        { id: "adaptabilidade_inata", name: "Adaptabilidade", desc: "Recebe 1 pericia treinada adicional na criacao." }
      ]
    },
    vampiros: {
      id: "vampiros",
      name: "Vampiros",
      category: "Predador",
      trackers: [
        {
          id: "cargas_sangue",
          label: "Reserva de Sangue",
          type: "pips",
          min: 0,
          max: 3,
          options: [
            "Restaurar 1d6 + Vigor em PV",
            "Aplicar Dano Real no proximo ataque",
            "Vantagem ao Desviar nesta rodada"
          ]
        }
      ],
      traits: [
        { id: "visao_noturna_18b", name: "Visao no Escuro", desc: "Enxerga perfeitamente na penumbra e escuridao ate 18B." },
        { id: "mordida_vampirica", name: "Mordida Vampirica", desc: "Ataque com presas que recupera PV e gera 1 Carga de Sangue." }
      ]
    },
    dragao_anao: {
      id: "dragao_anao",
      name: "Dragao Anao",
      category: "Hibrido",
      traits: [
        { id: "escamas_draconicas", name: "Escamas Resilientes", desc: "Resistencia fisica contra impacto e cortes." }
      ]
    },
    insectoides: {
      id: "insectoides",
      name: "Insectoides",
      category: "Quitinoso",
      defenseBonus: 1,
      traits: [
        { id: "exoesqueleto_quitinoso", name: "Exoesqueleto", desc: "+1 de DEF natural permanente." }
      ]
    },
    praguentos: {
      id: "praguentos",
      name: "Praguentos",
      category: "Contaminado",
      traits: [
        { id: "sangue_imune", name: "Sangue Toxico", desc: "Imunidade natural contra envenenamento e enfermidades." }
      ]
    },
    abissais: {
      id: "abissais",
      name: "Abissais",
      category: "Aquatico",
      traits: [
        { id: "bioluminescencia", name: "Bioluminescencia", desc: "Pulso luminoso de campo para coordenacao e visao." }
      ]
    },
    exos: {
      id: "exos",
      name: "E.X.O.s",
      category: "Automato",
      overrides: {
        vitalResource: {
          type: "pc",
          label: "Pontos de Chassi",
          formula: (attrs, level, classDef) => {
            return classDef.baseHpInitial + attrs.vig + ((level - 1) * (classDef.baseHpPerLevel + attrs.vig));
          },
          allowMedicine: false,
          repairSkill: "oficio",
          repairAttr: "men"
        }
      },
      trackers: [
        {
          id: "overclock",
          label: "Sobrecarga de Overclock",
          type: "boolean_threshold",
          thresholdPercent: 25,
          activeBuffDesc: "+2 de DEF e +1d8 de dano adicional enquanto estiver sob 25% de PCs."
        }
      ],
      traits: [
        { id: "fisiologia_mecanica", name: "Fisiologia Mecanica", desc: "Imune a veneno, sangramento e fogo. Nao recebe cura por Medicina." }
      ]
    },
    espectros: {
      id: "espectros",
      name: "Espect@&%s",
      category: "Anomalia",
      overrides: {
        vitalResource: {
          type: "estabilidade",
          label: "Estabilidade Cosmica",
          formula: (attrs, level) => {
            return (10 + attrs.men) + ((level - 1) * (4 + attrs.men));
          },
          allowExternalHealing: false,
          deathSaves: {
            maxFailures: 4,
            critStabilize: [19, 20]
          }
        }
      },
      variants: [
        { id: "blink", name: "Blink", desc: "Disparo de energia negativa a ate 3B." },
        { id: "desbordamento", name: "Desbordamento", desc: "Ruido estatico que causa dano mental." },
        { id: "corrupcao", name: "Corrupcao", desc: "Drena energia e restaura Estabilidade propria." },
        { id: "tela_azul", name: "Tela Azul", desc: "Trava atacante em pane motora 1x/combate." }
      ],
      traits: [
        { id: "deslocamento_de_quadros", name: "Deslocamento de Quadros", desc: "Teleporte instantaneo de ate 4B atravessando frestas." }
      ]
    }
  };

  const CLASSES = {
    consagrados: {
      id: "consagrados",
      name: "Consagrados",
      role: "Canhao de Vidro / Suporte Radiante",
      baseHpInitial: 10,
      baseHpPerLevel: 6,
      baseEaInitial: 30,
      baseEaPerLevel: 10,
      savingThrows: ["exp", "men"],
      proficiencies: {
        weapons: ["espadas_curtas", "lancas", "macas", "martelos_leves", "foices", "arcos_leves", "bestas"],
        armor: ["leves", "medias"]
      },
      trackers: [
        {
          id: "fervor",
          label: "Fervor Divino",
          type: "pips",
          min: 0,
          max: 5,
          milestones: {
            1: "Selo Menor",
            2: "Escudo Sagrado",
            3: "Explosao Radiante",
            4: "Milagre Restaurador",
            5: "Dispersao Elemental"
          }
        }
      ],
      progression: {
        characteristicAbilities: {
          1: {
            id: "sentido_da_fe",
            name: "Nivel 1 — Sentido da Fe",
            tag: "Passiva",
            desc: "O Consagrado sente a presenca de corrupcoes, anomalias astrais, pragas e reliquias sagradas num raio de 20B. Alem disso, le e compreende ritos antigos e escrituras divinas sem precisar de teste."
          },
          4: {
            id: "fonte_de_luz",
            name: "Nivel 4 — Fonte de Luz",
            tag: "Passiva",
            desc: "Sua ligacao continua com os deuses expande sua reserva espiritual. O Consagrado recebe +15 de Energia Astral maxima de forma permanente.",
            permanentEaBonus: 15
          },
          7: {
            id: "pressagio_do_patrono",
            name: "Nivel 7 — Pressagio do Patrono",
            tag: "1/dia",
            desc: "Uma vez por dia, o Consagrado pode entrar em oracao por 5 minutos para buscar orientacao divina sobre uma escolha ou misterio do grupo. O Mestre concede uma visao, pressagio ou pista direta sobre o caminho mais seguro, a fraqueza de uma criatura da regiao ou um perigo iminente."
          }
        },
        choices: {
          1: [
            { id: "golpe_consagrado", name: "Golpe Consagrado", cost: "5 EA", action: "Padrao", desc: "Adiciona o Dano Base em dano elemental ao ataque. Gera 1 Fervor." },
            { id: "guarda_devota", name: "Guarda Devota", cost: "5 EA", action: "Bonus", desc: "Barreira espiritual protetora com 6 + Maestria de PVs em aliado ate 4B. Gera 1 Fervor." }
          ],
          4: [
            { id: "lanca_elemental", name: "Lanca Elemental", cost: "10 EA", action: "Bonus", desc: "Projetil em linha de ate 10B causando Dano Base + Expressao. Gera 1 Fervor." },
            { id: "prece_restauradora", name: "Prece Restauradora", cost: "10 EA", action: "Bonus", desc: "Recupera 2d4 + Maestria + Expressao de PVs de aliado ate 6B. Gera 1 Fervor." }
          ],
          7: [
            { id: "vortice_elemental", name: "Vortice Elemental", cost: "15 EA", action: "Padrao", desc: "Area de 3B em raio causando Dano Base + Expressao e puxando 2B. Gera 1 Fervor." },
            { id: "elo_de_resguarde", name: "Elo de Resguarde", cost: "15 EA", action: "Padrao", desc: "Vinculo radiante com bonus de DEF e cura regenerativa. Gera 1 Fervor." }
          ],
          10: [
            { id: "feixe_do_patrono", name: "Feixe do Patrono", cost: "20 EA", action: "Padrao", desc: "Pilastra concentrada em linha de 12B, reduz armadura e cega. Gera 1 Fervor." },
            { id: "graca_imutavel", name: "Graca Imutavel", cost: "20 EA", action: "Bonus", desc: "Encerra condicoes, cura Dano Base + EXP e ignora proximo dano. Gera 1 Fervor." }
          ],
          13: [
            { id: "ira_primordial", name: "Ira Primordial", cost: "25 EA", action: "Padrao", desc: "Explosao em 6B de raio com dano elemental massivo. Gera 1 Fervor." },
            { id: "apoteose_divina", name: "Apoteose Divina", cost: "25 EA", action: "Bonus", desc: "Transcendencia espiritual por 3 rodadas com voo e buffs sagrados. Gera 1 Fervor." }
          ]
        }
      }
    },
    compactador: {
      id: "compactador",
      name: "Compactador",
      role: "Colosso Inabalavel",
      baseHpInitial: 14,
      baseHpPerLevel: 8,
      baseEaInitial: 25,
      baseEaPerLevel: 10,
      savingThrows: ["for", "vig"],
      proficiencies: {
        weapons: ["simples", "martelos", "clavas_pesadas", "espadas_longas", "machados", "desarmados"],
        armor: ["leves", "medias", "pesadas", "escudos"]
      },
      trackers: [
        {
          id: "estados_compactacao",
          label: "Estados de Compactacao",
          type: "slots",
          maxActive: 2,
          options: [
            { id: "compressao", name: "Compressao", desc: "Aumenta impacto contundente e prepara colapsos." },
            { id: "estabilizacao", name: "Estabilizacao", desc: "Barreira protetora temporal e imunidade a deslocamento." },
            { id: "distorcao", name: "Distorcao", desc: "Desvantagem em ataques inimigos. Consome PV igual a Maestria ao ativar." }
          ]
        }
      ],
      progression: {
        characteristicAbilities: {
          1: {
            id: "densidade_negativa",
            name: "Nivel 1 — Densidade Negativa",
            tag: "Passiva",
            desc: "O Compactador manipula a inercia do proprio corpo e de objetos tocados. Ele nao sofre dano em quedas de ate 10B e consegue erguer, arrastar e transportar cargas e pesos macicos como se pesassem apenas um decimo do peso real."
          },
          4: {
            id: "massa_titanica",
            name: "Nivel 4 — Massa Titanica",
            tag: "Passiva",
            desc: "A densidade da sua carne e ossos se compacta como rocha pura. O Compactador recebe +12 Pontos de Vida maximos de forma permanente.",
            permanentHpBonus: 12
          },
          7: {
            id: "demolidor_de_estruturas",
            name: "Nivel 7 — Demolidor de Estruturas",
            tag: "Passiva",
            desc: "Ao golpear ou arrombar portas reforcadas, portoes de ferro, paredes, grades ou mecanismos macicos, o Compactador causa dano dobrado e recebe vantagem em qualquer teste de Forca para despedacar o obstaculo."
          }
        },
        choices: {
          1: [
            { id: "punho_de_inercia", name: "Punho de Inercia", cost: "5 EA", action: "Padrao", desc: "Ataque com dano de arma + Dano Base contundente e aplica Compressao." },
            { id: "revestimento_de_densidade", name: "Revestimento de Densidade", cost: "5 EA", action: "Bonus", desc: "Barreira com 6 + Maestria em PVs temporarios e ativa Estabilizacao." }
          ],
          4: [
            { id: "quebra_de_ritmo", name: "Quebra de Ritmo", cost: "10 EA + PV Maestria", action: "Bonus", desc: "Distorce espaco-tempo de alvo ate 4B, causando desvantagem e Distorcao." },
            { id: "ancoragem_titanica", name: "Ancoragem Titanica", cost: "10 EA", action: "Padrao", desc: "Atracao gravitacional em 3B de raio, puxa 2B e imobiliza." }
          ],
          7: [
            { id: "fratura_de_impacto", name: "Fratura de Impacto", cost: "15 EA", action: "Padrao", desc: "Golpe esmagador com dano de arma + dobro do Dano Base, anula armadura e derruba." },
            { id: "bastiao_inquebravel", name: "Bastiao Inquebravel", cost: "15 EA", action: "Bonus", desc: "Barreira protetora com 12 + Maestria para Compactador e aliados." }
          ],
          10: [
            { id: "campo_de_assimetria", name: "Campo de Assimetria", cost: "20 EA + PV Maestria", action: "Padrao", desc: "Cupula de 4B de raio causando lentidao, desvantagem e Distorcao." },
            { id: "esmagamento_vetorial", name: "Esmagamento Vetorial", cost: "20 EA", action: "Padrao", desc: "Compressao gravitacional brutal causando Dano Base + FOR e paralisando." }
          ],
          13: [
            { id: "fortaleza_cinetica", name: "Fortaleza Cinetica", cost: "25 EA", action: "Padrao", desc: "Ancora massa fisica ao nucleo do mundo com barreira de 40 PVs e imunidades." },
            { id: "singularidade_astral", name: "Singularidade Astral", cost: "25 EA", action: "Padrao", desc: "Poco gravitacional em 6B de raio com dano e anulacao de armadura." }
          ]
        }
      }
    }
  };

  const VOCATIONS = {
    academico: {
      id: "academico",
      name: "Academico",
      trainedSkills: ["investigacao", "astral"],
      defaultKitId: "kit_erudito",
      powers: [
        { id: "mente_metodica", name: "Mente Metodica", desc: "Vantagem em testes para decifrar textos e misterios historicos." }
      ]
    },
    batedor: {
      id: "batedor",
      name: "Batedor",
      trainedSkills: ["furtividade", "percepcao"],
      defaultKitId: "kit_infiltracao",
      powers: [
        { id: "passo_silencioso", name: "Passo Silencioso", desc: "Desloca-se furtivamente sem penalidade em terreno dificil." }
      ]
    },
    cacador: {
      id: "cacador",
      name: "Cacador",
      trainedSkills: ["sobrevivencia", "percepcao"],
      defaultKitId: "kit_exploracao",
      powers: [
        { id: "rastreador_implacavel", name: "Rastreador Implacavel", desc: "Reconhece tipo, numero e condicao de presas por vestigios." }
      ]
    },
    combatente: {
      id: "combatente",
      name: "Combatente",
      trainedSkills: ["atletismo", "intimidacao"],
      powers: [
        { id: "impeto_de_choque", name: "Impeto de Choque", desc: "Vantagem na iniciativa na primeira rodada e +2B de deslocamento." },
        { id: "preco_de_sangue", name: "Preco de Sangue", desc: "Recupera PV temporario igual a VIG + Maestria ao abater um inimigo." }
      ]
    },
    curandeiro: {
      id: "curandeiro",
      name: "Curandeiro",
      trainedSkills: ["medicina", "sobrevivencia"],
      defaultKitId: "kit_medico",
      powers: [
        { id: "primeiros_socorros_rapidos", name: "Primeiros Socorros", desc: "Estabiliza aliados gastando acao bonus uma vez por cena." }
      ]
    },
    engenhoqueiro: {
      id: "engenhoqueiro",
      name: "Engenhoqueiro",
      trainedSkills: ["oficio", "investigacao"],
      defaultKitId: "kit_manutencao",
      powers: [
        { id: "conserto_improvisado", name: "Conserto Improvisado", desc: "Restaura itens danificados ou automatos em metade do tempo." }
      ]
    },
    nobre: {
      id: "nobre",
      name: "Nobre",
      trainedSkills: ["persuasao", "enganacao"],
      powers: [
        { id: "autoridade_nata", name: "Autoridade Nata", desc: "Facilidade de acesso a instalacoes nobres e conclaves." }
      ]
    },
    trapaceiro: {
      id: "trapaceiro",
      name: "Trapaceiro",
      trainedSkills: ["enganacao", "acrobacia"],
      powers: [
        { id: "truque_sujo", name: "Truque Sujo", desc: "Cria distracoes imediatas para escapar ou desengajar." }
      ]
    }
  };

  const KITS = {
    kit_medico: {
      id: "kit_medico",
      name: "Kit Medico de Emergencia",
      load: 3,
      category: "kit",
      desc: "Estojo de sutura, injetor estimulante, balsamos cicatrizantes e purificador.",
      containedItemIds: ["estojo_sutura", "injetor_estimulante", "balsamo_cicatrizante", "antisseptico"]
    },
    kit_exploracao: {
      id: "kit_exploracao",
      name: "Kit de Exploracao e Desbravamento",
      load: 3,
      category: "kit",
      desc: "Corda com gancho, pederneira rapida, tochas de piche e cantil com filtro.",
      containedItemIds: ["corda_gancho", "pederneira", "tochas_piche", "cantil_filtro"]
    },
    kit_infiltracao: {
      id: "kit_infiltracao",
      name: "Kit de Infiltracao e Arrombamento",
      load: 2,
      category: "kit",
      desc: "Gazuas finas, espelho articulado, oleo desengripante e pe de cabra compacto.",
      containedItemIds: ["gazuas_finas", "espelho_articulado", "oleo_desengripante", "pe_de_cabra"]
    },
    kit_manutencao: {
      id: "kit_manutencao",
      name: "Kit de Manutencao e Forja de Campo",
      load: 2,
      category: "kit",
      desc: "Martelo de ajuste, pedra de amolar diamantada, alicate e oleo anticorrosivo.",
      containedItemIds: ["martelo_ajuste", "pedra_amolar", "alicate_multifuncional", "oleo_anticorrosivo"]
    },
    kit_erudito: {
      id: "kit_erudito",
      name: "Kit do Erudito e Investigador",
      load: 2,
      category: "kit",
      desc: "Lupa de analise, diario impermeavel, bussola astral e bastoes de giz.",
      containedItemIds: ["lupa_analise", "diario_impermeavel", "bussola_astral", "bastoes_giz"]
    }
  };

  const RulesRegistry = {
    UNIVERSAL_MAESTRY,
    STANDARD_ATTRIBUTE_ARRAY,
    SKILLS,
    RACES,
    CLASSES,
    VOCATIONS,
    KITS,

    getMaestry(level) {
      const lvl = Math.min(15, Math.max(1, Number(level) || 1));
      return UNIVERSAL_MAESTRY[lvl] || 2;
    },

    getRace(raceId) {
      return RACES[raceId] || null;
    },

    getClass(classId) {
      return CLASSES[classId] || null;
    },

    getVocation(vocationId) {
      return VOCATIONS[vocationId] || null;
    },

    getKit(kitId) {
      return KITS[kitId] || null;
    },

    registerRace(raceData) {
      if (raceData && raceData.id) {
        RACES[raceData.id] = raceData;
      }
    },

    registerClass(classData) {
      if (classData && classData.id) {
        CLASSES[classData.id] = classData;
      }
    },

    registerVocation(vocationData) {
      if (vocationData && vocationData.id) {
        VOCATIONS[vocationData.id] = vocationData;
      }
    }
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = RulesRegistry;
  } else {
    global.WuRulesRegistry = RulesRegistry;
  }
})(typeof window !== "undefined" ? window : globalThis);
