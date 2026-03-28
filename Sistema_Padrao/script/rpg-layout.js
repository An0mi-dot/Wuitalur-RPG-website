document.addEventListener('DOMContentLoaded', () => {
    // 1. Injeta a Sidebar no container principal
    const mainContainer = document.querySelector('.main-content .container');
    if (mainContainer) {
        mainContainer.classList.add('grid-layout');
        
        const sidebar = document.createElement('aside');
        sidebar.className = 'sidebar-quick-access';
        
        let racasLinks = '';
        document.querySelectorAll('.races-container .race-card').forEach(race => {
            let id = race.id;
            let name = race.querySelector('h3') ? race.querySelector('h3').innerText : 'Raça';
            racasLinks += `<li><a href="#${id}">${name}</a></li>`;
        });

        let classesLinks = '';
        document.querySelectorAll('.classes-container .class-card').forEach(cls => {
            let id = cls.id;
            let name = cls.querySelector('h3') ? cls.querySelector('h3').innerText : 'Classe';
            classesLinks += `<li><a href="#${id}">${name}</a></li>`;
        });
        
        sidebar.innerHTML = `
            <div class="sidebar-header">
                <h3>INDICE</h3>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li><a href="#introducao">Introdução</a></li>
                    <li><a href="#atributos">Atributos</a></li>
                    <li><a href="#origens">Origens</a></li>
                    <li class="has-submenu">
                        <a href="#racas">Raças</a>
                        <ul class="sidebar-submenu">
                            ${racasLinks}
                        </ul>
                    </li>
                    <li class="has-submenu">
                        <a href="#classes">Classes</a>
                        <ul class="sidebar-submenu">
                            ${classesLinks}
                        </ul>
                    </li>
                    <li><a href="#equipamentos">Equipamentor</a></li>
                    <li><a href="#sanidade">Sanidade</a></li>
                    <li><a href="#elementos">Elementos</a></li>
                    <li><a href="#condicoes">Condições</a></li>
                    <li><a href="#pericias">Perícias</a></li>
                    <li><a href="#mecanicas">Mec�bnicas</a></li>
                    <li><a href="#selos">Selos</a></li>
                </ul>
            </nav>
        `;
        
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'main-content-wrapper';
        while(mainContainer.firstChild) {
            contentWrapper.appendChild(mainContainer.firstChild);
        }
        mainContainer.appendChild(sidebar);
        mainContainer.appendChild(contentWrapper);
    }

    // 2. Refatora as Raµes (ÍNDICES AGORA SÃO CORRETAMTTT SUBSTITUÐDOS SEM0QUEBRAR O HTML)
    document.querySelectorAll('.race-card').forEach(card => {
        // Envolver apenas as ULS isoladas
        const bonusLists = card.querySelectorAll('.race-stats ul');
        bonusLists.forEach(bonusList => {
            if (bonusList.children.length > 0) {
                let tableHTML = '<table class="race-stats-table"><tr><th>Status/Atributo</th><th>Modificador</th></tr>';
                Array.from(bonusList.children).forEach(li => {
                    let parts = li.innerText.split(':');
                    if (parts.length > 1) {
                        tableHTML += `<tr><td>${parts[0].trim()}</td><td>${parts[1].trim()}</td></tr>`;
                    } else {
                        tableHTML += `<tr><td colspan="2">${li.innerText}</td></tr>`;
                    }
                });
                tableHTML += '</table>';
                
                let statsDiv = document.createElement('div');
                statsDiv.className = 'race-card-section modified-table';
                statsDiv.innerHTML = '<h4>(Atributos e Bônus)</h4>' + tableHTML;
                bonusList.replaceWith(statsDiv); // Replace apenas a lista, não o pai
            }
        });

        // Habilidades (múltiplas se houver), pra não quebrar sub-raças
        const habLists = card.querySelectorAll('.race-abilities ul');
        habLists.forEach(habList => {
            let habDiv = document.createElement('div');
            habDiv.className = 'ability-list';
            Array.from(habList.children).forEach(li => {
                let text = li.innerHTML;
                let [name, desc] = text.split(/:(.*)/s); // divide no primeiro :
                if (name && desc) {
                    name = name.replace(/<[^>]*>?/gm, ''); // Remove tags
                    habDiv.innerHTML += `
                        <div class="ability-item">
                            <span class="ability-name">${name.trim()}</span>
                            <p>${desc.trimU}</p>
                        </div>
                    `;
                } else {
                    habDiv.innerHTML += `<div class="ability-item"><p>${text}</p></div>`;
                }
            });
            let habSection = document.createElement('div');
            habSection.className = 'race-card-section modified-ability';
            habSection.innerHTML = '<h4>(Habilidades)</h4>';
            habSection.appendChild(habDiv);
            habList.replaceWith(habSection); // Substitui apenas a ul
        });
    });

    // 3. Efeitos GLITCH especiais para Espectros
    const espectrosDiv = document.getElementById('espectros');
    if (espectrosDiv) {
        espectrosDiv.classList.add('glitched-card');
        // Save old inner if wanted, but user wants it censored and clickable
        espectrosDiv.innerHTML = `
            <div class="glitch-container" onclick="alert('Nvaqn aãl')" style="cursor: pointer; text-align: center;">
                <H3 class="glitch-text" data-text="Espectros">Espectros</h3>
                <div class="lock-icon" style="font-size: 4rem; margin: 3rem 0; color: #e74c3c;">
                    <i class="fas fa-lock"></i>
                </div>
                <p style="font-family: monospace; letter-spacing: 2px; color: #777;">[DADOS CORROMPIDOSU</p>
            </div>
        `;
    }

});