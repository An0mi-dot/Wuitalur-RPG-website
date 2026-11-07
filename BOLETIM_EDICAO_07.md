# Ajustes no Mobile, Compactação de EA e Polimento das Raças
Passei uma revisão geral na interface móvel: corrigi sobreposições de texto, adicionei botão de voltar no Hub e reordenei as ilustrações. Também compactei os tetos de Energia Astral das classes no motor 2.0 e expandi com todos os detalhes as mecânicas de Espectros e Abissais.

**Data de Publicação**  
7 de Novembro de 2026

**Expedido por**  
Mestre

**Tempo Estimado**  
6 min

#Sistema2.0  
#InterfaceMobile  
#Balanceamento  
#EnergiaAstral  
#Raças  
#Classes  

◇

### O foco no PC e a situação das ilustrações no celular
Antes de entrar nas mudanças de regras, quero deixar um aviso claro sobre a navegação no celular.

Eu tenho plena ciência de que as ilustrações ainda estão com uma formatação meio estranha na tela do celular. O corte das imagens, o enquadramento vertical e a proporção de alguns personagens não ficam tão redondos quanto na tela grande. Porém, como o foco principal de desenvolvimento de Wuitalur sempre foi e continua sendo a experiência e a formatação no PC, eu não vou me levar ao trabalho de tentar corrigir isso por agora.

A prioridade no celular era garantir que o site funcionasse: que o menu não travasse a tela inteira, que desse para clicar nas classes e ler as habilidades sem texto atropelando outro. Isso agora está resolvido e utilizável. A parte puramente estética das imagens no celular fica para depois.

---

### Melhorias e correções na interface móvel
Quem tentou acessar o site pelo celular nos últimos dias percebeu que a navegação estava bem complicada. Apliquei um pacote de correções estruturais para destravar o uso em telas pequenas:

* **Fim do menu travado no carregamento**: A barra lateral agora inicia sempre recolhida no celular. O menu hamburger superior duplicado foi removido, mantendo somente o botão flutuante inferior no canto da tela para abrir e fechar a gaveta de navegação.
* **Botão de retorno no Hub de Seleção**: Na tela de seleção de classes e raças, foi adicionado um botão direto para voltar ao Início, permitindo sair da tela de seleção sem precisar abrir a barra lateral.
* **Isolamento do Hub e da tela detalhada**: Havia uma falha em que a ficha do Compactador aparecia renderizada no rodapé do Hub mesmo sem nenhuma classe ter sido clicada. Agora a visualização detalhada só entra em tela quando uma classe ou raça for efetivamente selecionada.
* **Fim das sobreposições de texto**: Na visualização da classe no celular, a ilustração agora fica posicionada abaixo do nome e das etiquetas de função tática. O botão de voltar e os títulos também ganharam espaçamento adequado para evitar colisões visuais.

---

### Compactação da Energia Astral (EA) no motor 2.0
Identifiquei a necessidade de um balanceamento fundamental na reserva de Energia Astral da Edição 2.0 para evitar a inflação desmedida de recursos nos níveis avançados.

Para que os custos de 5 a 25 de EA continuem estratégicos e pesem nas decisões do jogador até o nível 15, adotei uma reserva compacta tanto no livro quanto no motor de cálculo:

* **Consagrados**:
  * EA Inicial: alterada de 30 para 20.
  * EA por Nível: alterada de 10 para 5.
* **Compactador**:
  * EA Inicial: alterada de 25 para 15.
  * EA por Nível: alterada de 10 para 3.

A escala de custos de habilidades por marcos permanece com a seguinte progressão:
* **Marco Nível 1**: 5 de EA
* **Marco Nível 4**: 10 de EA
* **Marco Nível 7**: 15 de EA
* **Marco Nível 10**: 20 de EA
* **Marco Nível 13**: 25 de EA

Essa nova escala foi sincronizada no motor de regras, na suite de testes automatizados (84 testes com aprovação completa) e nos seletores do criador de personagens, garantindo que o teto compacto seja recalculado em tempo real ao subir de nível.

---

### Validação sequencial de etapas no criador de ficha
No assistente de criação de personagens, foi aplicada uma trava de integridade sequencial:
* Não é mais possível pular para fases avançadas (como Fase 4 ou Fase 5) sem antes preencher os pré-requisitos das fases anteriores (escolha de raça, vocação, perícias e distribuição de atributos).
* O retorno para etapas anteriores continua sempre livre, recalculando as dependências caso alguma escolha seja alterada.

---

### Expansão completa das mecânicas de Espectros e Abissais
Algumas mecânicas de raças estavam com explicações muito resumidas e áridas na interface. Reescrevi esses blocos para que o jogador tenha o texto completo e detalhado direto na consulta:

* **Espectros (Estabilidade Cósmica & Vínculo de Anomalia)**:
  * Explicada em detalhes a ausência de PV tradicional, o cálculo de vitalidade baseado em 10 + Mente (+4 + Mente por nível), a impossibilidade de cura externa por poções ou magias comuns e o sistema de salvaguardas de morte próprias exigindo 4 falhas para colapso definitivo.
  * Detalhamento dos 4 Vínculos de Anomalia disponíveis na criação: *Blink* (disparo de Mented6 a 3B), *Desbordamento* (+1d6 mental), *Corrupção* (recupera 1d4 de Estabilidade ao acertar golpes) e *Tela Azul* (o atacante trava em pane temporária).
* **Abissais (Fome de Vinhas)**:
  * Detalhada a regra de consumo de filamentos de Praga como ação rápida (3 vinhas por cena) e a tabela integral do d6 de mutações: 1 (Rejeição), 2 (Sobrecarga), 3 (Carapaça com +2 DEF), 4 (Surto Motor com +3B e vantagem em Destreza), 5 (Secreção Tóxica com +1d6 dano de Praga) e 6 (Bioluminescência com vantagem para ataques aliados e cura).

---

### Polimento visual e limpeza nas Raças
* **Remoção de rótulos genéricos**: Foram eliminados aqueles títulos repetitivos que ficavam antes dos status das raças (como "Vulnerabilidade Sagrada" e "Desconexão Social"), mantendo o texto corrido limpo e direto ao ponto.
* **Estética cromática para Espectros**: Substituída a cor roxa estática por uma paleta glitch com estática e aberração cromática verde, vermelha e branca, alinhando a identidade visual da raça à sua ilustração.
* **Vampiros**: Reposicionamento e tratamento de resolução da arte, eliminando o aspecto embaçado e calibrando o enquadramento.
* **Fim dos cards flutuantes automáticos de condições**: Foi desativado o recurso que marcava palavras comuns do texto idênticas a nomes de condições para exibir cards com o ponteiro do mouse, evitando balões indevidos fora de contexto.
