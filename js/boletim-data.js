/* ============================================================
   WUITALUR RPG — BANCO DE DADOS DOS BOLETINS
   Novidades, atualizacoes do sistema, historia e curiosidades
   (Zero Emojis, Formato Extensivel)
   ============================================================ */

const BOLETINS_DATA = [
  {
    id: "edicao-05",
    numero: 5,
    edicao: "Edição #5",
    epoca: "Outubro 2026",
    data: "27 de Outubro de 2026",
    dataIso: "2026-10-27",
    titulo: "Prévia da Nova Interface de Classes & Arte dos Consagrados",
    subtitulo: "Disponibilizei uma nova aba de visualização com estética urbana para testes e a nova ilustração dos Consagrados.",
    autor: "Mestre",
    tempoLeitura: "4 min",
    resumo: "Subi uma prévia da nova aba de Classes para o pessoal dar uma olhada. Tudo o que está ali é experimental e feito para termos uma ideia de como serão os visuais e a navegação, acompanhado da nova arte dos Consagrados.",
    tags: ["Interface", "Classes", "Ilustrações", "Prévia"],
    conteudoHtml: `<section class="boletim-section">
        <h3 class="boletim-section-title">Prévia da nova aba de Classes</h3>
        <p class="boletim-lead">
          Coloquei no ar uma nova aba de visualização das classes para quem quiser dar uma olhada e sentir a proposta de navegação.
        </p>
        <p>
          Vale destacar desde já: tudo o que está ali é puro teste e pode sofrer alterações ao longo do desenvolvimento. Fiz essa versão principalmente para termos uma referência visual de como algumas coisas vão funcionar daqui pra frente, com uma pegada urbana e apresentação mais marcante.
        </p>
        <div class="boletim-callout highlight-purple">
          <p>
            <strong>Aviso de testes:</strong> A interface ainda está em construção ativa. Elementos de layout, proporções e interações estão sendo calibrados para encontrar o melhor equilíbrio entre estilo visual e leitura rápida durante as sessões.
          </p>
        </div>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Nova arte dos Consagrados</h3>
        <p class="boletim-lead">
          Junto com essa nova tela, já incluí a nova ilustração dos Consagrados para inaugurar a galeria visual das classes.
        </p>
        <p>
          A ideia é que cada classe tenha sua própria arte em destaque, trazendo presença e identidade pro personagem assim que você abre o dossiê. Os Consagrados já estão com essa nova silhueta e paleta implementadas na página.
        </p>
        <p>
          Dêem uma passada lá na aba de Classes para ver como ficou, testar a navegação e me avisem o que acharam da direção visual.
        </p>
      </section>`
  },
  {
    id: "edicao-04",
    numero: 4,
    edicao: "Edição #4",
    epoca: "Outubro 2026",
    data: "24 de Outubro de 2026",
    dataIso: "2026-10-24",
    titulo: "A Grande Reformulação das Raças 2.0",
    subtitulo: "Fim do inchaço de habilidades na ficha, os 3 Pilares das raças e o retorno do d20.",
    autor: "Mestre",
    tempoLeitura: "6 min",
    resumo: "Passei uma limpa geral nas raças do sistema. Chega de ficha com 10 habilidades ativas competindo com classe: agora toda raça segue a regra de 3 Pilares com mecânica própria e foco imediato.",
    tags: ["Sistema 2.0", "Raças", "Dados"],
    conteudoHtml: `<section class="boletim-section">
        <h3 class="boletim-section-title">A limpa geral nas raças</h3>
        <p class="boletim-lead">
          Seguindo as atualizações da Edição 2.0, decidi mexer num ponto que tava me incomodando bastante: o excesso de coisa acumulada nas raças.
        </p>
        <p>
          Na versão 1.5, você pegava uma raça e vinha aquele monte de 8 a 10 habilidades ativas e passivas na ficha. Na hora do combate ninguém lembrava de tudo, ficava um tempão relendo texto pequeno e a raça acabava chamando mais atenção do que a própria classe do personagem.
        </p>
        <p>
          Pra 2.0 resolvi enxugar tudo e padronizar as raças em <strong>3 pilares simples</strong>:
        </p>

        <!-- OS 3 PILARES SIMPLIFICADOS -->
        <div class="boletim-pillars-grid">
          <div class="boletim-pillar-card pilar-status">
            <span class="boletim-pillar-num">PILAR 1</span>
            <h4 class="boletim-pillar-title">Status de Raça</h4>
            <p class="boletim-pillar-desc">
              Resistências, fraquezas elementais, tipo de visão e perícias nativas. Coisas passivas que você só anota e não precisa ficar gerenciando em combate.
            </p>
          </div>

          <div class="boletim-pillar-card pilar-mecanica">
            <span class="boletim-pillar-num">PILAR 2</span>
            <h4 class="boletim-pillar-title">Mecânica de Raça</h4>
            <p class="boletim-pillar-desc">
              A regra própria que muda como o personagem joga e sobrevive no combate (o chassi dos E.X.O.s, a estabilidade dos Espectros, as vinhas dos Abissais, o sangue dos Vampiros).
            </p>
          </div>

          <div class="boletim-pillar-card pilar-caracteristica">
            <span class="boletim-pillar-num">PILAR 3</span>
            <h4 class="boletim-pillar-title">Característica de Raça</h4>
            <p class="boletim-pillar-desc">
              Só uma habilidade marcante pro personagem usar na mesa e pronto, sem dez regrinhas pra decorar.
            </p>
          </div>
        </div>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">A volta do d20 (desisti do d12)</h3>
        <p class="boletim-lead">
          Outra coisa que mudei de ideia: quem lembra que eu tava querendo testar o sistema em 1d12 pode esquecer, desisti dessa ideia.
        </p>
        <p>
          Testando na mesa deu pra ver que o d12 dava uma sensação estranha de número quebrado e tirava aquele peso dramático que a gente gosta na hora de rolar o dado. Então voltamos oficialmente pro clássico d20.
        </p>
        <p>
          A diferença é que agora o d20 tá limpo daquela maionese matemática de antes:
        </p>
        <ul class="boletim-list">
          <li><strong>Sem bônus gigantescos:</strong> Sem umas soma meio grande dms de dois dígitos tipo +8 ou valores grandes na ficha. Os atributos agora operam numa escala bem mais contida: [+3, +2, +1, +1, 0].</li>
          <li><strong>Sem conta chata:</strong> Teste comum é só <span class="dice">1d20 + Atributo</span> e fechou.</li>
          <li><strong>Perícia com vantagem:</strong> Quem é treinado numa perícia agora joga <span class="dice">2d20</span> e escolhe o maior.</li>
        </ul>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Nova interface do site e ilustrações</h3>
        <div class="boletim-callout highlight-gold">
          <p>
            Aproveitando o embalo, dei uma polida geral na interface aqui do site. Eu não tava curtindo muito o visual de antes, tava meio poluído, então voltei pra uma base escura mais limpa e direta.
          </p>
          <p>
            As páginas de <strong>Classes</strong> e <strong>Raças</strong> já tão com essa interface nova rodando. Além disso, pretendo criar ilustrações novas tanto pras raças quanto pras classes pra combinar certinho com o estilo do site. Vai levar um tempo, mas vou fazer com calma.
          </p>
        </div>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">As 11 Raças da Edição 2.0</h3>
        <p>
          Deixei tudo detalhado aqui raça por raça pra vocês darem uma olhada:
        </p>

        <!-- 1. AKIVUS -->
        <div class="boletim-race-card">
          <div class="boletim-race-header">
            <h4 class="boletim-race-name">1. Akivus</h4>
          </div>
          <div class="boletim-race-content">
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-status">Status</span>
              <p>Treino nativo na perícia Sobrevivência. Resistência natural contra dano <span class="elem-sagrado">Sagrado</span> e Gélido. Fraqueza contra dano de <span class="elem-podridao">Podridão</span>.</p>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-mecanica">Mecânica</span>
              <div>
                <p><strong>Manifestação de Vinhas:</strong> Em locais com vegetação favorável, cria e manipula vinhas em até 5B de alcance para:</p>
                <ul class="boletim-list" style="margin: 6px 0 0 16px;">
                  <li>Interagir com objetos à distância.</li>
                  <li>Agarrar um alvo em alcance.</li>
                  <li>Desferir ataques à distância causando <span class="dice">1d6</span> de dano.</li>
                </ul>
              </div>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-habilidade">Característica</span>
              <p><strong>Passos Silenciosos:</strong> Move-se sem emitir som ao caminhar sobre solo ou vegetação. Recebe vantagem em testes de Furtividade ao se deslocar por ambientes naturais.</p>
            </div>
          </div>
        </div>

        <!-- 2. ANIMALESCOS -->
        <div class="boletim-race-card">
          <div class="boletim-race-header">
            <h4 class="boletim-race-name">2. Animalescos</h4>
          </div>
          <div class="boletim-race-content">
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-status">Status</span>
              <p>Treino nativo na perícia Percepção. Fraqueza contra dano Sonoro.</p>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-mecanica">Mecânica</span>
              <p><strong>Postura Animalesca:</strong> Altera sua postura física para a locomoção instintiva de sua espécie animal. Seu deslocamento aumenta em +3B e recebe vantagem ao Desviar enquanto se desloca nessa postura. Seus membros motores ficam totalmente dedicados à locomoção, impedindo empunhar armas, usar escudos ou manipular itens até retornar à postura padrão.</p>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-habilidade">Característica</span>
              <p><strong>Ataque Predatório:</strong> Seus ataques desarmados utilizam garras, presas ou chifres, causando <span class="dice">+1d6</span> de dano adicional ao dano base de ataque desarmado.</p>
            </div>
          </div>
        </div>

        <!-- 3. PLANTÍFEROS -->
        <div class="boletim-race-card">
          <div class="boletim-race-header">
            <h4 class="boletim-race-name">3. Plantíferos</h4>
          </div>
          <div class="boletim-race-content">
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-status">Status</span>
              <p>Treino nativo na perícia Medicina. Fraqueza contra dano <span class="elem-solar">Solar</span> e dano de <span class="elem-podridao">Podridão</span>.</p>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-mecanica">Mecânica</span>
              <p><strong>Comunicação Botânica:</strong> Pode se comunicar e sentir estímulos através de plantas e árvores próximas. Tocar a vegetação local permite coletar informações simples sobre criaturas que passaram pela área recentemente ou alterações no ambiente.</p>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-habilidade">Característica</span>
              <p><strong>Bulbo de Pólen:</strong> Arremessa um bulbo floral em um ponto a até 6B que explode em uma nuvem de pólen de 4B de raio. Alvos dentro da área devem passar em um teste de Vigor ou sofrem desvantagem em suas ações até o final do próximo turno deles.</p>
            </div>
          </div>
        </div>

        <!-- 4. HUMANOS -->
        <div class="boletim-race-card">
          <div class="boletim-race-header">
            <h4 class="boletim-race-name">4. Humanos</h4>
          </div>
          <div class="boletim-race-content">
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-status">Status</span>
              <p>Escolhe +1 perícia treinada extra na criação do personagem. Fraqueza contra dano de <span class="elem-pesadelo">Pesadelo</span>.</p>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-mecanica">Mecânica</span>
              <p><strong>Adrenalina Sob Pressão:</strong> Quando sua Vida estiver abaixo de 25% do valor total, o Humano recebe vantagem em todos os testes de Força e Destreza até o final da cena.</p>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-habilidade">Característica</span>
              <p><strong>Determinação Implacável:</strong> Ao chegar a 0 PV por um ataque, pode realizar um teste de Vigor. Se tiver sucesso, não cai inconsciente e permanece de pé com 1 PV. Pode ser usado uma vez por cena de combate.</p>
            </div>
          </div>
        </div>

        <!-- 5. VAMPIROS -->
        <div class="boletim-race-card">
          <div class="boletim-race-header">
            <h4 class="boletim-race-name">5. Vampiros</h4>
          </div>
          <div class="boletim-race-content">
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-status">Status</span>
              <p>Visão no escuro em até 18B. Resistência contra dano de <span class="elem-pesadelo">Pesadelo</span>. Fraqueza contra dano de <span class="elem-praga">Praga</span> e dano <span class="elem-solar">Solar</span>.</p>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-mecanica">Mecânica</span>
              <div>
                <p><strong>Reserva de Sangue:</strong> Ao causar dano cortante ou perfurante em um alvo com sangue, acumula até 3 Cargas de Sangue. Pode gastar 1 Carga para:</p>
                <ul class="boletim-list" style="margin: 6px 0 0 16px;">
                  <li>Restaurar <span class="dice">1d6 + Vigor</span> em PV.</li>
                  <li>Fazer com que o próximo ataque cause <em>Dano Real</em> (ignora armadura e qualquer resistência do inimigo).</li>
                  <li>Receber vantagem ao Desviar de um ataque nesta rodada.</li>
                </ul>
              </div>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-habilidade">Característica</span>
              <p><strong>Mordida Vampírica:</strong> Desfere um ataque com presas contra um alvo agarrado, caído ou desprevenido. Causa dano base de ataque desarmado + <span class="dice">1d6</span> de perfuração, recupera PV igual ao dano causado e gera automaticamente 1 Carga de Sangue.</p>
            </div>
          </div>
        </div>

        <!-- 6. DRAGÃO ANÃO -->
        <div class="boletim-race-card">
          <div class="boletim-race-header">
            <h4 class="boletim-race-name">6. Dragão Anão</h4>
          </div>
          <div class="boletim-race-content">
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-status">Status</span>
              <p>Vantagem em testes de Mente para resistir a efeitos mentais e confusão. Resistência contra o elemento escolhido para o sopro na criação: <span class="elem-solar">Solar</span>, <span class="elem-estase">Estase</span> ou <span class="elem-podridao">Podridão</span>.</p>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-mecanica">Mecânica</span>
              <p><strong>Mimetismo de Escamas:</strong> As escamas mudam de tom e textura conforme a superfície onde se apoia. Pode tentar se ocultar com Furtividade mesmo sem cobertura total caso esteja encostado em paredes ou superfícies sólidas. Após desferir um ataque corpo a corpo ou usar o sopro, pode se deslocar até 3B imediatamente.</p>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-habilidade">Característica</span>
              <p><strong>Sopro Ancestral:</strong> Na criação do personagem, escolhe o tipo elemental do sopro: Solar, Estase ou Podridão. Expele um cone frontal de 3B de energia elemental do tipo escolhido. Alvos na área sofrem <span class="dice">2d8</span> de dano elemental direto do tipo correspondente.</p>
            </div>
          </div>
        </div>

        <!-- 7. INSECTÓIDES -->
        <div class="boletim-race-card">
          <div class="boletim-race-header">
            <h4 class="boletim-race-name">7. Insectóides</h4>
          </div>
          <div class="boletim-race-content">
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-status">Status</span>
              <p>Treino nativo na perícia Intimidação. Fraqueza contra dano <span class="elem-solar">Solar</span> e dano Gélido. Sensibilidade a luzes ofuscantes diretas.</p>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-mecanica">Mecânica</span>
              <div>
                <p><strong>Vínculo de Mutação:</strong> Na criação, escolhe um elemento de vínculo: <span class="elem-podridao">Podridão</span>, <span class="elem-nulidrico">Nulídrico</span> ou <span class="elem-pesadelo">Pesadelo</span>. Ao acertar um ataque em combate, acumula até 3 Cargas de Peçonha. Pode gastar 1 Carga para aplicar o efeito do elemento no próximo golpe:</p>
                <ul class="boletim-list" style="margin: 6px 0 0 16px;">
                  <li><em>Podridão:</em> Reduz a DEF do alvo em 2 pontos até o final da rodada.</li>
                  <li><em>Nulídrico:</em> Reduz o deslocamento do alvo pela metade até o final da rodada.</li>
                  <li><em>Pesadelo:</em> Causa <span class="dice">1d6</span> de dano mental direto e impede o alvo de usar reações nesta rodada.</li>
                </ul>
              </div>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-habilidade">Característica</span>
              <p><strong>Fisiologia Quitinosa:</strong> Concede +2 de DEF natural permanente. Consegue escalar superfícies verticais e tetos com velocidade normal de deslocamento sem necessidade de testes.</p>
            </div>
          </div>
        </div>

        <!-- 8. PRAGUENTOS -->
        <div class="boletim-race-card">
          <div class="boletim-race-header">
            <h4 class="boletim-race-name">8. Praguentos</h4>
          </div>
          <div class="boletim-race-content">
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-status">Status</span>
              <p>Imunidade contra dano de <span class="elem-podridao">Podridão</span>. Resistência contra dano de <span class="elem-praga">Praga</span>. Fraqueza contra dano <span class="elem-solar">Solar</span> e dano Gélido.</p>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-mecanica">Mecânica</span>
              <div>
                <p><strong>Biomassa de Lodo:</strong> Possui 3 Cargas de Lodo por cena ou descanso. Pode gastar 1 Carga para:</p>
                <ul class="boletim-list" style="margin: 6px 0 0 16px;">
                  <li>Moldar instantaneamente uma ferramenta simples ou arma corpo a corpo de lodo na sua mão.</li>
                  <li>Esticar seus membros para desferir um ataque corpo a corpo ou agarrar um alvo a até 3B de distância.</li>
                  <li>Destacar uma gota de lodo do próprio corpo e controlá-la para atravessar frestas estreitas e fechaduras a até 10B. A gota não enxerga nem ouve, mas transmite sensações de tato e vibrações do ambiente diretamente ao Praguento.</li>
                </ul>
              </div>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-habilidade">Característica</span>
              <p><strong>Ejeção Cáustica:</strong> Dispara uma golfada de lodo viscoso e fervente em um alvo a até 5B. Causa <span class="dice">2d6</span> de dano de Podridão e o alvo tem seu deslocamento reduzido pela metade até o início do seu próximo turno.</p>
            </div>
          </div>
        </div>

        <!-- 9. ABISSAIS -->
        <div class="boletim-race-card">
          <div class="boletim-race-header">
            <h4 class="boletim-race-name">9. Abissais</h4>
          </div>
          <div class="boletim-race-content">
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-status">Status</span>
              <p>Visão no escuro total em ambientes subterrâneos. Imunidade contra dano de <span class="elem-praga">Praga</span>. Resistência contra dano Solar, Gélido e Pesadelo. Fraqueza contra dano de <span class="elem-podridao">Podridão</span> e desvantagem em Percepção sob luz solar direta.</p>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-mecanica">Mecânica</span>
              <div>
                <p><strong>Fome de Vinhas (Gamble de 1d6):</strong> Consome filamentos de Praga para alterar seu organismo em combate. Possui 3 Vinhas de Praga por cena. Ao engolir 1 vinha com uma ação rápida, rola 1d6 para definir a mutação até o fim da cena:</p>
                
                <div class="boletim-table-wrapper" style="margin: 10px 0 4px;">
                  <table class="boletim-table" style="min-width: 100%;">
                    <thead>
                      <tr>
                        <th style="width: 15%;">Dado</th>
                        <th style="width: 35%;">Mutação</th>
                        <th style="width: 50%;">Efeito</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><span class="dice">1</span></td>
                        <td><strong style="color: #ef4444;">1 (Negativo) — Rejeição Biológica</strong></td>
                        <td>Sofre <span class="dice">1d6</span> de dano e perde 2B de deslocamento.</td>
                      </tr>
                      <tr>
                        <td><span class="dice">2</span></td>
                        <td><strong style="color: #ef4444;">2 (Negativo) — Sobrecarga Sensorial</strong></td>
                        <td>Sofre desvantagem em testes de Mente e Percepção.</td>
                      </tr>
                      <tr>
                        <td><span class="dice">3</span></td>
                        <td><strong style="color: #4ade80;">3 (Positivo) — Carapaça Espinhosa</strong></td>
                        <td>O tecido corporal endurece, concedendo +2 de DEF.</td>
                      </tr>
                      <tr>
                        <td><span class="dice">4</span></td>
                        <td><strong style="color: #4ade80;">4 (Positivo) — Surto Motor</strong></td>
                        <td>Concede +3B de deslocamento e vantagem em testes de Destreza.</td>
                      </tr>
                      <tr>
                        <td><span class="dice">5</span></td>
                        <td><strong style="color: #4ade80;">5 (Positivo) — Secreção Tóxica</strong></td>
                        <td>Seus ataques corpo a corpo causam <span class="dice">+1d6</span> adicional de dano de Praga.</td>
                      </tr>
                      <tr>
                        <td><span class="dice">6</span></td>
                        <td><strong style="color: #38bdf8;">6 (Positivo) — Bioluminescência Máxima</strong></td>
                        <td>Antenas pulsam luz em 6B, concedendo vantagem para ataques de aliados nessa área e curando <span class="dice">1d8</span> de PV do Abissal.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-habilidade">Característica</span>
              <p><strong>Frequência Perturbadora:</strong> Projeta ruídos ensurdecedores e sussurros telepáticos na mente de um alvo a até 6B. O alvo deve passar em um teste de Mente ou fica atordoado, incapaz de agir no próximo turno dele.</p>
            </div>
          </div>
        </div>

        <!-- 10. E.X.O.s -->
        <div class="boletim-race-card">
          <div class="boletim-race-header">
            <h4 class="boletim-race-name">10. E.X.O.s</h4>
          </div>
          <div class="boletim-race-content">
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-status">Status</span>
              <p>Imunidade contra dano de Fogo, <span class="elem-praga">Praga</span>, Sangramento e Envenenamento. Fraqueza contra dano de <span class="elem-podridao">Podridão</span> e dano <span class="elem-nulidrico">Nulídrico</span>.</p>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-mecanica">Mecânica</span>
              <div>
                <p><strong>Fisiologia Mecânica & Núcleo Everact:</strong></p>
                <ul class="boletim-list" style="margin: 6px 0 0 16px;">
                  <li><strong>Pontos de Chassi (PC):</strong> Não possui Vida comum. Poções medicinais, primeiros socorros e a perícia Medicina falham automaticamente nele. Para repará-lo ou estabilizá-lo ao cair para 0 PCs, é obrigatório utilizar o teste da perícia <em>Ofício (Mente)</em>.</li>
                  <li><strong>Autorreparo de Campo:</strong> Uma vez por cena de combate, gasta uma ação rápida para canalizar solda interna, restaurando <span class="dice">2d8 + Mente</span> em PCs. Além disso, a cada rodada, recupera <span class="dice">2d6 + Vigor</span> em PCs.</li>
                  <li><strong>Sobrecarga de Overclock:</strong> Sempre que estiver com menos de 25% de seus PCs totais, o núcleo entra em sobreaquecimento contínuo. Concede +2 de DEF e <span class="dice">+1d8</span> de dano adicional em todos os seus ataques até o final do combate.</li>
                </ul>
              </div>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-habilidade">Característica</span>
              <p><strong>Prensa Hidráulica:</strong> Avança contra um alvo adjacente travando os atuadores de alta pressão de seus braços. Rola um teste de Força contra a Força ou Destreza do alvo. Se vencer, o alvo fica Imobilizado e sofre automaticamente <span class="dice">2d6 + Força</span> de dano de esmagamento no início de cada um dos turnos dele enquanto estiver preso.</p>
            </div>
          </div>
        </div>

        <!-- 11. ESPECTROS -->
        <div class="boletim-race-card">
          <div class="boletim-race-header">
            <h4 class="boletim-race-name">11. Espect@&%s</h4>
          </div>
          <div class="boletim-race-content">
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-status">Status</span>
              <p>Fraqueza contra dano <span class="elem-sagrado">Sagrado</span> e dano <span class="elem-solar">Solar</span>. Desvantagem permanente em testes de Expressão com seres biológicos.</p>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-mecanica">Mecânica</span>
              <div>
                <p><strong>Estabilidade Cósmica & Vínculo de Anomalia:</strong></p>
                <ul class="boletim-list" style="margin: 6px 0 0 16px;">
                  <li><strong>Definição da Estabilidade:</strong> Sua vitalidade inicial é calculada como 10 + Mente (ganha +4 + Mente por nível subsequente). Não possui teto máximo de Estabilidade e não recebe cura biológica externa comum.</li>
                  <li><strong>Instabilidade Crítica (Salvaguarda da Morte):</strong> Ao chegar a 0 de Estabilidade, entra em colapso existencial. Nenhum aliado pode estabilizá-lo. O Espectro realiza seus próprios testes de salvaguarda no início de cada turno: É apagado da realidade apenas se acumular <strong>4 falhas</strong> (em vez das 3 comuns). Tirar 19 ou 20 natural no d20 estabiliza sua existência imediatamente, retornando com 1 de Estabilidade.</li>
                  <li><strong>Vínculo de Anomalia:</strong> Na criação, escolhe o tipo de erro cósmico de sua anomalia:
                    <ul style="margin-top: 4px; padding-left: 18px;">
                      <li><em>Blink:</em> Ao finalizar um ataque, pode realizar imediatamente um disparo de energia negativa contra um alvo a até 3B, causando Mented6 de dano.</li>
                      <li><em>Desbordamento:</em> Suas ações que causam dano emitem ruído estático que sobrecarrega a mente do alvo, causando <span class="dice">1d6</span> de dano mental adicional.</li>
                      <li><em>Corrupção:</em> Ao acertar um golpe corpo a corpo, drena energia do alvo e recupera <span class="dice">1d4</span> de Estabilidade própria.</li>
                      <li><em>Tela Azul:</em> Uma vez por combate, ao sofrer um ataque, força o atacante a travar em pane motora, fazendo-o perder o restante do turno dele.</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
            <div class="boletim-race-row">
              <span class="boletim-race-pill p-habilidade">Característica</span>
              <p><strong>Deslocamento de Quadros (Frame Drop):</strong> O Espectro perde quadros de animação na realidade e se teletransporta instantaneamente para um espaço visível desocupado a até 4B de distância, atravessando grades e obstáculos físicos sem provocar contra-ataques.</p>
            </div>
          </div>
        </div>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Considerações</h3>
        <p>
          A ideia central foi essa: tirar a gordura das fichas e deixar cada espécie com uma pegada bem própria. Agora quando você escolhe uma raça, já sabe exatamente o que ela faz na mesa sem precisar de um manual do lado.
        </p>
        <p>
          Deem uma olhada aí e qualquer coisa comentem no grupo o que acharam. Depois eu trago mais novidades das classes.
        </p>
      </section>`
  },

  {
    id: "edicao-03",
    numero: 3,
    edicao: "Edição #3",
    epoca: "Outubro 2026",
    data: "20 de Outubro de 2026",
    dataIso: "2026-10-20",
    titulo: "Como vai funcionar a Defesa no sistema novo",
    subtitulo: "Fim da calculadora na mesa, uma única DEF pra tudo e as escolhas de desviar ou defender.",
    autor: "Mestre",
    tempoLeitura: "3 min",
    resumo: "Fechei como vai funcionar a defesa na versão 2.0. Nada de calcular fórmula com potência, agora é uma DEF só somada pelo equipamento e a escolha entre esquivar ou defender.",
    tags: ["Sistema 2.0", "Combate", "Defesa"],
    conteudoHtml: `
      <section class="boletim-section">
        <h3 class="boletim-section-title">A Defesa na Edição 2.0</h3>
        <p class="boletim-lead">
          Seguindo o que eu comentei no último boletim, hoje eu fechei como vai funcionar a parte de Defesa nos combates da versão 2.0.
        </p>
        <p>
          No sistema antigo essa era uma das partes mais enroladas da mesa. Tinha duas defesas diferentes, fórmulas chatas com potência fracionária que precisavam de calculadora e três atributos disputando a mesma função. Agora isso foi totalmente simplificado.
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Comparativo: O Sistema Antigo vs. A Edição 2.0</h3>
        <p>
          Montei essa tabela comparando como era antes e como vai ficar agora pra dar pra ver a diferença direto:
        </p>

        <div class="boletim-table-wrapper">
          <table class="boletim-table">
            <thead>
              <tr>
                <th style="width: 25%;">Elemento</th>
                <th style="width: 37%;">No Sistema Antigo (v1.5)</th>
                <th style="width: 38%;">Na Nova Edição 2.0</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Quantidade de Defesas</strong></td>
                <td>2 defesas separadas: DEF (Física) e DEFe (Elemental).</td>
                <td><strong>1 única DEF unificada</strong> para qualquer tipo de dano direto.</td>
              </tr>
              <tr>
                <td><strong>Cálculo da DEF</strong></td>
                <td>
                  Fórmulas algébricas com potências que precisavam de calculadora:<br>
                  <code>DEF = RF × (PVs^0.6) / 6</code><br>
                  <code>DEFe = RE × (PVs^0.5) / 8 + DEF</code>
                </td>
                <td>
                  <strong>Soma direta de equipamento</strong> feita de cabeça em 1 segundo:<br>
                  Armadura (0 a 6) + Escudo (+2) + Vigor Especializado (+2).
                </td>
              </tr>
              <tr>
                <td><strong>Atributos Envolvidos</strong></td>
                <td>Três atributos confusos disputando o corpo: Saúde, RF e RE.</td>
                <td>Apenas <strong>Vigor</strong> (para absorção corporal) e <strong>Destreza</strong> (para esquiva).</td>
              </tr>
              <tr>
                <td><strong>Reação: Desviar</strong></td>
                <td>Rolar 1d20 + DES contra o acerto do atacante.</td>
                <td>Rola <strong>Destreza</strong> (ou perícia Acrobacia) no d12. Se superar o ataque, sofre <strong>0 de dano</strong>.</td>
              </tr>
              <tr>
                <td><strong>Reação: Defender</strong></td>
                <td>Reduz o dano pela DEF física, ou pela DEFe se for ataque elemental.</td>
                <td><strong>Sem rolagem.</strong> Absorve com segurança: reduz qualquer dano direto pela sua DEF única.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Os 3 Grandes Ganhos dessa Mudança</h3>
        <ul class="boletim-list">
          <li>
            <strong>Fim total da calculadora na mesa:</strong> Você nunca mais vai precisar abrir planilha ou o site pra saber quanto tomou de dano. O valor da sua DEF já fica anotado pronto na ficha (tipo DEF 4 ou DEF 6). Tomou dano, subtrai a DEF e pronto.
          </li>
          <li>
            <strong>A escolha tática continua valendo a pena:</strong> Em todo golpe recebido o jogador continua tendo a decisão na mão: arriscar a esquiva na Destreza pra tentar não tomar nada de dano, ou jogar na segurança da armadura e garantir a redução direta pela DEF.
          </li>
          <li>
            <strong>Equilíbrio entre os tipos de personagem:</strong> O personagem ágil brilha na esquiva rápida usando Desviar, e o personagem mais tanque e robusto brilha na couraça e no escudo defendendo com DEF alta.
          </li>
        </ul>
      </section>

      <div class="boletim-callout highlight-gold">
        <div class="boletim-callout-header">
          <span class="boletim-callout-tag">Próximos passos</span>
          <span class="boletim-callout-title">O que vem a seguir</span>
        </div>
        <p>
          Com a Defesa resolvida desse jeito simples, a próxima etapa vai ser calibrar os números da Energia Astral (EA) e passar para o rework das classes no novo motor de d12.
        </p>
        <p>
          Qualquer dúvida sobre como vai funcionar a defesa ou ideias sobre isso podem mandar lá no chat.
        </p>
      </div>
    `
  },
  {
    id: "edicao-02",
    numero: 2,
    edicao: "Edição #2",
    epoca: "Outubro 2026",
    data: "19 de Outubro de 2026",
    dataIso: "2026-10-19",
    titulo: "Primeiros Passos da Edição 2.0",
    subtitulo: "Atributos novos, não vai mais usar d20, lista de perícias enxuta e o novo molde das raças.",
    autor: "Mestre",
    tempoLeitura: "3 min",
    resumo: "Como prometido no último boletim, já comecei a planejar a nova versão do sistema. Aqui estão as primeiras decisões fechadas sobre dados, atributos, perícias e raças.",
    tags: ["Sistema 2.0", "Regras", "Novidades"],
    conteudoHtml: `
      <section class="boletim-section">
        <h3 class="boletim-section-title">Começando a planejar o sistema novo</h3>
        <p class="boletim-lead">
          Como eu falei no outro boletim, sentei pra começar a rabiscar a versão 2.0 do sistema.
        </p>
        <p>
          Só lembrando que o sistema padrão continua sendo de fantasia, com as classes, magias e os elementos normais. Aquela parada de colégio e terror que a gente tá jogando agora é só da nossa campanha com o suplemento de Fios do Medo.
        </p>
        <p>
          O objetivo dessa versão 2.0 é basicamente tirar o que tava chato e enrolado do sistema antigo. Coisa tipo ter que fazer conta com potência pra achar a defesa do personagem, ter 800 de mana pra ficar controlando no papel e ficar somando bônus toda hora. Quero algo que seja rápido de jogar na mesa.
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Não vai mais usar d20</h3>
        <p>
          A primeira coisa é que não vamos mais usar d20. O d20 é muito 8 ou 80 e precisava de um monte de número somado pra fazer sentido. Agora a rolagem vai ser no d12:
        </p>
        <ul class="boletim-list">
          <li><strong>Teste normal:</strong> Rola 1d12 puro (de 1 a 12).</li>
          <li><strong>Teste com atributo especializado:</strong> Rola 1d12 + 2 (de 3 a 14). Na hora de criar a ficha você escolhe 2 atributos pra ser especializado.</li>
          <li><strong>Dificuldades:</strong> 6 pra coisa tranquila, 8 pra situação de perigo comum, 10 pra difícil, 12 pra quase impossível e 13 ou 14 pra coisas lendárias (que só quem é especializado consegue bater).</li>
          <li>Tirar 12 no dado é crítico e tirar 1 dá ruim.</li>
        </ul>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">5 Atributos em vez de 8</h3>
        <p>
          Aqueles 8 atributos antigos eram meio redundantes. Não fazia sentido ter Saúde e Resistência Física separados, e Fama não precisava ser um atributo base. Agora são só 5:
        </p>
        <ul class="boletim-list">
          <li><strong>Força:</strong> Dano físico, carregar peso e armas pesadas.</li>
          <li><strong>Destreza:</strong> Reflexo, esquiva, pontaria e agilidade.</li>
          <li><strong>Vigor:</strong> Fôlego, aguentar porrada, veneno e cansaço (juntei Saúde e Resistência Física aqui).</li>
          <li><strong>Mente:</strong> Lógica, conhecimento, alquimia e dedução.</li>
          <li><strong>Expressão:</strong> Conversa, lábia, intimidação e liderança.</li>
        </ul>
        <p>
          <em>O Cosmo não é mais um atributo comum, vai ser uma trilha separada.</em>
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Menos perícias e sistema de vantagem</h3>
        <p>
          Tinha mais de 36 perícias e metade quase nunca entrava em jogo. Reduzi pra 12:
        </p>
        <ul class="boletim-list">
          <li><strong>Físicas:</strong> Acrobacia, Furtividade e Atletismo.</li>
          <li><strong>Mentais / Exploração:</strong> Investigação, Medicina, Ofício, Astral, Sobrevivência e Percepção.</li>
          <li><strong>Sociais:</strong> Persuasão, Enganação e Intimidação.</li>
        </ul>
        <p>
          Cada um escolhe 4 perícias treinadas. E o treino agora funciona com vantagem: você rola 2d12 e pega o maior. Se tiver atributo especializado junto, soma +2 nesse maior. Assim quem é bom em algo não fica falhando à toa por azar no dado.
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Como vão funcionar as raças</h3>
        <p>
          As 11 raças continuam no jogo, mas sem aquela lista gigante de poderes passivos que ninguém lembrava na hora da sessão. Cada raça vai ter:
        </p>
        <ul class="boletim-list">
          <li>Um bônus básico ou resistência elemental.</li>
          <li>Uma mecânica própria que muda o jeito de jogar com ela (tipo a carcaça do E.X.O., o espectro não ter cura comum, a fome do vampiro, etc).</li>
          <li>Só uma habilidade ativa, pra deixar o foco nas classes.</li>
        </ul>
      </section>

      <div class="boletim-callout highlight-gold">
        <div class="boletim-callout-header">
          <span class="boletim-callout-tag">Próximos passos</span>
          <span class="boletim-callout-title">O que falta ver</span>
        </div>
        <p>
          Agora falta eu fechar como vai ser a defesa nas lutas, diminuir os números da Energia Astral (EA) pra ficar fácil de marcar e passar as classes pro sistema novo.
        </p>
        <p>
          Conforme eu for terminando essas partes eu coloco aqui. Qualquer dúvida ou ideia me mandem no chat.
        </p>
      </div>
    `
  },
  {
    id: "edicao-01",
    numero: 1,
    edicao: "Edição #1",
    epoca: "Outubro 2026",
    data: "18 de Outubro de 2026",
    dataIso: "2026-10-18",
    titulo: "Sessão de Ontem e o Novo Sistema",
    subtitulo: "Agradecimento pela sessão, ritmo das próximas e os planos para uma nova versão do sistema.",
    autor: "Mestre",
    tempoLeitura: "2 min",
    resumo: "Valeu por terem ido ontem. Um aviso sobre o ritmo das próximas sessões e o anúncio de uma reformulação geral do sistema.",
    tags: ["Campanha", "Sistema", "Atualizações"],
    conteudoHtml: `
      <section class="boletim-section">
        <h3 class="boletim-section-title">Sobre a Sessão de Ontem</h3>
        <p class="boletim-lead">
          Bom dia gente. Valeu por terem ido pra sessão ontem, espero que vocês tenham se divertido e etc. Deu bastante trabalho fazer tudo aquilo.
        </p>
        <p>
          Como eu quero manter essa qualidade pra todas as sessões posteriores, provavelmente vai demorar um tempo pra ter a próxima.
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Reformulação do Sistema</h3>
        <p>
          Além disso, eu quero comentar sobre algo também: o sistema padrão vai passar por uma reformulação, e passar pra uma nova versão atualizada.
        </p>
        <p>
          Isso vai rolar enquanto essa campanha acontece.
        </p>
        <p>
          Essas mudanças são mudanças gerais, vou praticamente refazer o sistema do zero, saindo um pouco de ser praticamente uma reconstrução do sistema de Ordem Paranormal e Tormenta 20.
        </p>
        <p>
          Meu objetivo no geral é deixar o sistema mais simples, porém mantendo ainda a investigação, possibilidade de builds e etc, porém sendo algo mais original.
        </p>
      </section>

      <section class="boletim-section">
        <h3 class="boletim-section-title">Coisas que Pretendo Alterar</h3>
        <p>
          É apenas comentando por cima algumas coisas que pretendo mexer:
        </p>
        <ul class="boletim-list">
          <li>Diminuir a quantidade de atributos.</li>
          <li>Diminuir a quantidade de habilidades de classe e arquétipo.</li>
          <li>Fazer o rework de algumas mecânicas de classe de algumas classes.</li>
          <li>Simplificar algumas perícias.</li>
          <li>Talvez mudar a rolagem do RPG, deixando de ser d20 ou só mudando pra um novo tipo de rolagem mais interessante e simples.</li>
        </ul>
      </section>

      <div class="boletim-callout highlight-rose">
        <div class="boletim-callout-header">
          <span class="boletim-callout-tag">Aviso</span>
          <span class="boletim-callout-title">O que acontece com o sistema atual?</span>
        </div>
        <p>
          O sistema atual dessa versão ainda vai existir, e vai estar na aba de <strong>Suplementos</strong> quando eu tiver terminado esse novo sistema.
        </p>
        <p>
          Com o tempo, eu vou atualizando vocês e explicando as coisas novas.
        </p>
      </div>
    `
  }
];

if (typeof window !== 'undefined') {
  window.BOLETINS_DATA = BOLETINS_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BOLETINS_DATA };
}
