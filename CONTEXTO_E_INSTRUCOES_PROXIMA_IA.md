# PROMPT E CONTEXTUALIZACAO PARA A PROXIMA IA // WUITALUR RPG

> Copie e cole o bloco abaixo diretamente na primeira mensagem para a nova IA:

```markdown
Voce esta assumindo a continuidade do desenvolvimento do site de Wuitalur RPG (new-site).
Leia atentamente o arquivo CONTEXTO_E_INSTRUCOES_PROXIMA_IA.md na raiz do projeto antes de fazer qualquer alteracao.

DIRETRIZES FUNDAMENTAIS DO PROJETO:
1. ZERO EMOJIS: Nunca use nenhum emoji no codigo, nos arquivos markdown nem nas respostas.
2. NENHUM COMMIT: Nao faca nenhum commit no git. Todas as alteracoes devem permanecer locais no working tree para testes.
3. TOM DE CONVERSA: Informal, amigavel, de amigos desenvolvedores que jogam RPG juntos.
4. TIPOGRAFIA: A fonte Chinese Rocks ('assets/fonts/chinese-rocks.ttf') e estritamente obrigatoria para titulos, headers de cards, badges e botoes principais.
5. FUNDO ANIMADO COM BOLINHAS: Deve ser MANTIDO. Trata-se do efeito 'mesaDotsRise' (bolinhas subindo verticalmente como na mesa virtual).
6. EFEITO GLITCH: Exclusivo no clique de botoes (:active). NUNCA em cards, textos, titulos ou headers.
7. SEM SCANLINES: Nao adicionar scanlines ou efeitos corporativos como 'REG: GLITCH_CORE'. O nome do sistema e apenas 'WUITALUR'.

SUA TAREFA ATUAL:
O usuario mudou de ideia quanto a paleta roxa Ortho. Ele quer que a base de cores retorne ao esquema escuro anterior (#0D0D12 / #16161E), onde cores fortes e saturadas destacavam os cards e categorias (roxo, rosa, vermelho, ambar/laranja, verde e ciano), conforme a imagem de referencia da home e as especificacoes detalhadas em CONTEXTO_E_INSTRUCOES_PROXIMA_IA.md.
Porem, o fundo animado de bolinhas subindo DEVE CONTINUAR ATIVO, apenas com as bolinhas ajustadas para a cor suave sobre o fundo escuro.
```

---

## 1. Visao Geral do Projeto

- **Nome**: Wuitalur RPG Compendio (new-site)
- **Localizacao**: `PROG/WuSistema/new-site`
- **Stack**: HTML5 puro, CSS3 modular (`css/variables.css`, `css/components.css`, `css/showcase.css`) e Vanilla JavaScript (`js/main.js`).
- **Filosofia Visual**: Dark Fantasy / Neo-Brutalista com alta legibilidade. O site serve como manual de regras, ficha, conclave, boletins e compendio de fichas de criaturas e classes.

---

## 2. O que Foi Construido e DEVE SER RIGOROSAMENTE PRESERVADO

### A. Fundo com Bolinhas Animadas em Movimento Vertical (`mesaDotsRise`)
- O usuario solicitou um fundo com grid de bolinhas em movimento para cima identico ao da mesa virtual do sistema.
- Ele esta ativo globalmente em `body::before` dentro de `css/variables.css`:
  ```css
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: 0;
    background-image: radial-gradient(circle, var(--dot-color) 1px, transparent 1.2px);
    background-size: 8px 8px;
    animation: mesaDotsRise 4.5s linear infinite;
  }
  @keyframes mesaDotsRise {
    0% { background-position: 0 0; }
    100% { background-position: 0 -56px; }
  }
  ```
- **REGRA**: Esse fundo deve continuar funcionando perfeitamente em todo o site. Ao alterar as cores do fundo, apenas garanta que `--dot-color` fique suave (ex: `rgba(255, 255, 255, 0.05)` ou `rgba(124, 58, 237, 0.08)`).

### B. Efeito de Glitch Apenas no Clique dos Botoes
- O glitch existe exclusivamente como resposta tátil ao clique do mouse (`:active`) nos botoes:
  ```css
  button:active, .btn:active, .btn-glitch-action:active {
    animation: btnGlitchImpact 0.18s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
  }
  ```
- **PROIBIDO**:
  - Glitch em cards
  - Glitch em títulos ou headers
  - Scanlines (o usuario ordenou remove-las permanentemente)
  - Textos decorativos corporativos (como "REG: GLITCH_CORE" ou "WUITALUR // TOKYO PUNK"). O nome do projeto e sempre e somente **WUITALUR**.

### C. Sistema de Badges de Dados D20
- Foi criado o icone de dado D20 (`assets/d20.svg`) com facetas aramadas e o numero 20 centralizado em branco.
- As classes `.dice` e `.attr-dice-badge` usam esse SVG via pseudo-elemento `::before`.
- Em `js/main.js`, existe a funcao `autoHighlightDice()` rodando no `DOMContentLoaded`, que encontra mencoes a rolagens de dados em texto puro (como `1d20 + FR`, `1d20 + Mod de INT`, `2d6`, `3d8`) e as envolve automaticamente em `<span class="dice">` com o icone do D20.

### D. Cores Individuais de Atributos e Elementos
- Toda mencao a atributos e elementos no compendio tem classe especifica e cor propria:
  - **Saude / PV**: `.attr-saude`, `.attr-pv`
  - **RF / DEF**: `.attr-rf`, `.attr-def`
  - **RE / DEFe / RM**: `.attr-re`, `.attr-rm`
  - **DES / Agilidade**: `.attr-des`, `.attr-dex`
  - **FOR / Forca**: `.attr-fr`
  - **INT / Intelecto**: `.attr-int`, `.attr-intelecto`
  - **Fama**: `.attr-fama`
  - **SEN / Sentidos**: `.attr-sen`
  - **COSMO**: `.attr-cosmo` (com animacao de degradê cósmico)
  - **EA (Energia Astral)**: `.attr-ea`
  - **SAN (Sanidade)**: `.attr-san`
  - **Elementos**: `.elem-solar`, `.elem-podridao`, `.elem-praga`, `.elem-sagrado`, `.elem-electro`, `.elem-nulidrico`, `.elem-pesadelo`, `.elem-estase`, `.elem-umbra` (com tremor por letra em `js/main.js`).

---

## 3. O que o Usuario Mudou de Ideia (A Nova Tarefa)

O usuario testou a paleta roxa Ortho (`#150f1e`), mas concluiu que o site perdeu a forca do contraste das categorias e decidiu:
> *"mudei de ideia... Eu quero alterar apenas as cores para como era antes. Essas cores e etc acho que deixac melhor pra destacar os cards e etc e cores fortes se destacam melhor. Porem pra deixar claro, eu ainda quero manter o fundo animado com bolinha e etc."*

O usuario enviou a imagem da home anterior (`media_1792877637298_48290f9b.png`) como referencia direta do que ele quer de volta:

1. **Fundo Escuro Original**:
   - `--bg-primary`: `#0D0D12` (ou `#0b0a10` / `#0e0d14`, preto grafite escuro)
   - `--bg-surface`: `#16161E`
   - `--bg-elevated`: `#1E1E2A`
   - `--bg-hover`: `#2A2A38`
   - `--border-subtle`: `#2E2E3E`
   - `--border-medium`: `#3E3E52`

2. **Destaque das Cores Fortes das Categorias (como visto nos cards da home)**:
   - **Atributos**: Barra superior em Roxo `#7C3AED`
   - **Perícias**: Barra superior em Rosa / Magenta `#EC4899` (ou `#E200C2`)
   - **Raças**: Barra superior em Vermelho Coral `#EF4444` (ou `#FF1F1F`)
   - **Classes**: Barra superior em Ambar / Laranja `#F59E0B`
   - **Origens**: Barra superior em Verde / Esmeralda `#10B981` (ou `#00C48C`)
   - **Elementos**: Barra superior em Ciano Elétrico `#06B6D4` (ou `#00FFFF`)

3. **Botoes e Badges de Acao**:
   - Badge "COMPENDIO": roxo vibrante `#7C3AED`
   - Botao "VER REGRAS": roxo `#7C3AED`
   - Botao "MESA VIRTUAL": borda ambar `#F59E0B`
   - Botao "BOLETIM": solido ambar `#F59E0B` com texto escuro
   - Card "NOVO BOLETIM": borda lateral esquerda de 4px a 5px em `#F59E0B`, titulo em Chinese Rocks na cor `#F59E0B` e botao "VER BOLETIM" solido `#F59E0B`.

4. **Bolinhas Animadas no Fundo Escuro**:
   - Mantenha `mesaDotsRise`, com `--dot-color: rgba(255, 255, 255, 0.055);` para que fiquem elegantes e visiveis no fundo `#0D0D12` sem poluir a leitura.

---

## 4. Mapa dos Arquivos a Serem Modificados

Ao executar a alteracao de cores, a proxima IA deve atualizar:
- `css/variables.css`: Atualizar `:root` com a volta do `--bg-primary: #0D0D12;`, `--bg-surface: #16161E;`, `--bg-elevated: #1E1E2A;`, `--accent: #7C3AED;`, `--border-accent: #7C3AED;`, mantendo o `body::before` com `mesaDotsRise`.
- `css/components.css`: Revisar `.hud-card`, `.home-stat-card`, `.tactical-subnav` e cards de boletim para usar as bordas coloridas fortes da referencia.
- `index.html`: Assegurar que os cards de estatisticas da home tenham as barras superiores coloridas (`#7C3AED`, `#EC4899`, `#EF4444`, `#F59E0B`, `#10B981`, `#06B6D4`) e o card do boletim tenha a borda e botoes ambar `#F59E0B`.
- `atributos.html`: Garantir que os cards de atributos e calculadoras usem as cores fortes originais contra o fundo `#0D0D12`.
- `atributos-preview.html`: Atualizar para refletir a paleta escura com destaques saturados.
- `changelog.html`, `personagem.html`, `personagens.html`: Harmonizar com a base `#0D0D12`.

---

## 5. Cuidados e Erros Conhecidos (Licoes Aprendidas)

1. **Powershell e Aspas no Windows**:
   - NUNCA execute `python -c "..."` com aspas duplas aninhadas diretamente no PowerShell, pois causa erro de parsing.
   - SEMPRE crie scripts `.py` temporarios na pasta `brain/<conversation-id>/scratch/` ou pasta temporaria e execute via `python caminho/do/script.py`.
2. **Line Endings CRLF**:
   - Os arquivos do projeto usam `\r\n`. Ao manipular arquivos via Python, preservar `newline='\r\n'`.
3. **Validacao de Chaves CSS**:
   - Sempre conferir se o total de `{` e `}` bate perfeitamente apos editar qualquer arquivo CSS.
4. **Sem commits**:
   - O comando do usuario e claro: nada de `git commit`. Apenas alteracoes locais unstaged.
