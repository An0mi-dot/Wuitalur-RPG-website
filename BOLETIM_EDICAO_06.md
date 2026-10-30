# O Rework do Compactador, Novo Inventário e as Vocações
Depois de mostrar a prévia visual dos Consagrados, dei uma avançada boa nas regras: fechei o Compactador no motor 2.0, troquei as origens antigas por Vocações, arrumei o peso dos itens e limpei a tabela de condições.

**Data de Publicação**  
30 de Outubro de 2026

**Expedido por**  
Mestre

**Tempo Estimado**  
5 min

#Sistema2.0  
#Classes  
#Compactador  
#Vocações  
#Equipamentos  
#Regras  

◇

### As 3 tags de papel tático
Depois que coloquei a nova arte dos Consagrados no ar, aproveitei pra fechar como as classes vão ser catalogadas. Em vez de botar aquele monte de texto solto explicando o que cada classe faz, agora toda classe vai carregar 3 tags logo embaixo do nome:

* **Função principal**: Atacante, Defensor ou Estrategista.
* **Foco de gameplay**: Coisas como Tanque, Colosso, Suporte, Canhão de Vidro.
* **Papel secundário**: Coisas como Controlador, Duelista, Tático ou Utilitário.

Nos Consagrados ficou `ESTRATEGISTA` | `SUPORTE` | `CONTROLADOR`, e pro Compactador que terminei agora ficou `DEFENSOR` | `COLOSSO` | `TANQUE`. Bateu o olho na ficha, já dá pra saber na hora como o personagem se porta no combate e o que ele entrega pro grupo.

---

### O novo Compactador: pressão, gravidade e dano na própria vida
O Compactador na versão 1.5 tava bem quebrado. O cara conseguia anular ataque do nada, ficava com 900 de mana acumulada e um monte de cálculo de porcentagem que travava a mesa. Mantive a identidade dele de ser um colosso pesado de linha de frente, mas passei a régua nos excessos:

* **Os 3 Estados de Compactação**: Ele gasta ação bônus e 5 EA pra botar um estado em campo (máximo de 2 ativos ao mesmo tempo):
  * **Compressão**: Pra bater pesado. Soma o Dano Base nos próprios ataques corpo a corpo ou corta a armadura do bicho.
  * **Estabilização**: Pra segurar o tranco. Dá bônus de DEF direto pra ele ou gera uma barreira de vida temporária num aliado.
  * **Distorção**: Essa aqui é a mais perigosa. Desalinha o espaço pra fazer os inimigos errarem golpe e andarem devagar. Só que agora tem um freio sério: **qualquer habilidade que use Distorção consome a vida do próprio Compactador**. Se quiser dobrar o espaço na marra, vai ter que sangrar por isso.
* **Colapso de Estado**: É o gatilho de combo da classe. Se o bicho já tá com um estado aplicado, você pode estourar esse estado pra causar um efeito bruto na hora: mandar o alvo pro chão com impacto sísmico, segurar um golpe pesado num aliado com barreira cinética ou quebrar a continuidade do ataque inimigo gastando vida.
* **Sem árvore inchada**: Assim como fiz nos Consagrados, agora o jogador escolhe 1 entre 2 habilidades nos níveis 1, 4, 7, 10 e 13. Menos texto pra decorar e mais espaço pra montar build diferente.

---

### Teto de nível: do 20 pro 15
Caso alguém não tenha reparado nas tabelas novas, o nível máximo do sistema foi alterado de 20 pra 15.

Tomei essa decisão porque na real, na maioria das campanhas que a gente jogou, nunca dava tempo nem sessão suficiente pra alguém bater nível 20 de verdade. Ficava aquele monte de nível fantasma no fim do livro que ninguém usava. Além disso, encurtar a escala pra 15 níveis justifica ter menos habilidades acumuladas na ficha, que é justamente um dos meus focos principais pro 2.0: menos bagunça pra gerenciar e cada nível conquistado pesando muito mais no personagem.

---

### Inventário, peso e os 7 kits fechados
A parte de carga do 1.5 tava meio confusa e com fórmula desnecessária. Arrumei isso deixando tudo atrelado direto à Força do personagem:

$$\text{Espaços de Carga} = (\text{FOR} \times 3) + 5$$

Se você tem Força 0, carrega 5 espaços de boa. Se tem Força 3, já leva 14. Passou disso, entra sobrecarga: perde 2 de Destreza, anda pela metade e se abusar muito toma desvantagem em teste físico.

Além de converter as 24 armas antigas pro d20, montei **7 kits prontos** (médico, infiltração, forja, exploração, assalto, erudito e boticário). A regra boa aqui é que o kit funciona como uma mochila própria pros itens dele. Enquanto as ferramentas tiverem guardadas dentro da maleta do kit, você só conta o peso do kit fechado na ficha, sem precisar ficar somando peso de atadura, frasquinho e gazua um por um.

---

### O Conclave e os itens iniciais
Em vez de cada um começar escolhendo item avulso de uma lista gigante sem critério, amarrei isso com a lore do Conclave. A ideia é que o Conclave opera aquela troca invisível nas sombras e entrega o que você precisa pra começar a andar pelo mundo:

* Cada personagem começa escolhendo $\text{FOR} + 1$ itens da lista inicial (quem tem Força 0 garante pelo menos 1 item).
* Todas as armas, escudos e utilitários da lista inicial já tão com dano, alcance, peso e propriedades fechadas, sem precisar ficar inventando na hora.

---

### Chega de "Origens", agora são Vocações
As antigas 19 origens tinham muita coisa desbalanceada e com nomes que quebravam o clima do jogo. Limpei tudo e transformei em **10 Vocações**:

* *Guarda, Pesquisador, Renegado, Mercenário, Curandeiro, Artesão, Nômade, Devoto, Aristocrata e Charlatão*.

Cada vocação representa como você se virava no mundo antes de sair se arriscando por aí. Elas dão 2 perícias treinadas, ferramentas de ofício, equipamentos que já conversam com as regras de carga e 2 poderes práticos pra usar no jogo, sem dinheiro sobrando do nada e sem aquela lista infinita de idiomas.

---

### Faxina na tabela de condições
Por fim, dei uma limpada geral nas condições. A gente tinha mais de 30 condições na 1.5, sendo que metade fazia quase a mesma coisa ou tinha regra que ninguém lembrava no meio do combate.

Deixei só as condições que realmente importam pro jogo rodar liso (agarrado, caído, imobilizado, atordoado, cego, etc.), e fechei as regras das **5 condições elementais próprias de Wuitalur**:
* **Fragmentado (Nulídrico)**: Corta a DEF do alvo e abre margem de crítico pra 19-20.
* **Assombrado (Pesadelo)**: Dano mental por turno e desvantagem por alucinação.
* **Infectado (Praga)**: Não cura vida em descanso e corre o risco do corpo virar bicho se morrer infectado.
* **Congelado (Estase)**: Perde o turno inteiro congelado e ainda volta com lentidão pelo choque térmico.
* **Amalgamado (Podridão)**: Parasita vivo que dá dano real todo turno e te joga no chão se não tirar logo.

---

Com essa base toda pronta, a próxima classe da fila pra gente reformular vai ser o **Bestial**. Se tiverem alguma dúvida de como ficaram os poderes ou a carga, vão falando aí.
