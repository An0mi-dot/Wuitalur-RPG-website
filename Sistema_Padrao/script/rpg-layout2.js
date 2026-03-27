document.addEventListener('DOMContentLoaded', () => {
    // 1. Injeta a Sidebar no container principal
    const mainContainer = document.querySelector('.main-content .container');
    if (mainContainer) {
        mainContainer.classList.add('grid-layout');

        const sidebar = document.createElement('aside');
        sidebar.className = 'sidebar-quick-access';

        let racasLinks = '';
        document.querySelectorAll('.race-card').forEach(race => {
            let id = race.id;
            let name = race.querySelector('h3') ? race.querySelector('h3').textContent : 'Raca';
            if(id && name) racasLinks += `<li><a href="#${id}">${name}</a></li>`;
        });

        let classesLinks = '';
        document.querySelectorAll('.class-card').forEach(cls => {
            let id = cls.id;
            let name = cls.querySelector('h3') ? cls.querySelector('h3').textContent : 'Classe';
            if(id && name) classesLinks += `<li><a href="#${id}">${name}</a></li>`;
        });

        sidebar.innerHTML = `
            <div class="sidebar-header">
                <h3>&Iacute;NDICE</h3>
            </div>
            <nav class="sidebar-nav">
                <ul>
                    <li><a href="#introducao">Introdu&ccedil;&atilde;o</a></li>
                    <li><a href="#atributos">Atributos</a></li>
                    <li><a href="#origens">Origens</a></li>
                    <li class="has-submenu">
                        <a href="#racas">Ra&ccedil;as</a>
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
                    <li><a href="#equipamentos">Equipamentos</a></li>
                    <li><a href="#sanidade">Sanidade</a></li>
                    <li><a href="#elementos">Elementos</a></li>
                    <li><a href="#condicoes">Condi&ccedil;&otilde;es</a></li>
                    <li><a href="#pericias">Per&iacute;cias</a></li>
                    <li><a href="#mecanicas">Mec&acirc;nicas</a></li>
                    <li><a href="#selos">Selos</a></li>
                </ul>
            </nav>
        `;

        // Create a wrapper to prevent grid bleeding
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'main-content-wrapper';
        
        // Move all children except the new sidebar into the wrapper
        while (mainContainer.firstChild) {
            contentWrapper.appendChild(mainContainer.firstChild);
        }
        
        mainContainer.appendChild(sidebar);
        mainContainer.appendChild(contentWrapper);

        // Sidebar smooth scrolling functionality
        document.querySelectorAll('.sidebar-nav a').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const targetId = this.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                        history.pushState(null, null, targetId);
                    }
                }
            });
        });
    }

    // --- CENSORSHIP PARA ESPECTROS (ARG GLITCH) ---
    const espectroCard = document.getElementById('espectros');
    if (espectroCard) {
        espectroCard.innerHTML = `
            <h3><span class="arg-glitch-text" data-text="[ REGISTRO CORROMPIDO ]">[ REGISTRO CORROMPIDO ]</span></h3>
            <div class="arg-container">
                <div class="arg-terminal">
                    <p class="arg-line">FALHA DE ACESSO: DADOS DA RA&Ccedil;A INDISPON&Iacute;VEIS</p>
                    <p class="arg-line arg-error">erro 0x88_74 :: ARQUIVO NÃO ENCONTRADO</p>
                    <p class="arg-line"></p>
                    <p class="arg-line">Tentando recuperar fragmentos de mem&oacute;ria cache...</p>
                    <p class="arg-line">...</p>
                    <p class="arg-line"></p>
                    <p class="arg-line arg-error">FALHA NA RECUPERA&Ccedil;&Atilde;O</p>
                    <p class="arg-line"><span class="arg-corrupted">nome: [EXCLUI&#769;DO]</span></p>
                    <p class="arg-line"><span class="arg-corrupted">descri&ccedil;&atilde;o: [EXCLUI&#769;DO]</span></p>
                    <p class="arg-line"><span class="arg-corrupted">habilitidades: [EXCLUI&#769;DO]</span></p>
                    <p class="arg-line"></p>
                    <p class="arg-line">>> Sincronizando com servidores remotos...</p>
                    <p class="arg-line">>> Conectando em: wuitalur_core::legacy_db.sys</p>
                    <p class="arg-line arg-error">>> CONEX&Atilde;O RECUSADA</p>
                    <p class="arg-line"></p>
                    <p class="arg-line">fragmento de log encontrado:</p>
                    <p class="arg-line" style="margin-left: 2rem; color: #999;">"Eles observam mas nunca s&atilde;o vistos. Aqueles que os invocam desaparecem da hist&oacute;ria."</p>
                </div>
                <button class="arg-button" onclick="alert('Nvaqn a&atilde;b')">[ TENTAR DESCRIPTOGRAFIA ]</button>
                <div class="arg-metadata">
                    TIMESTAMP: [DESCONHECIDO] | CHECKSUM: INVÁLIDO | ACESSO: NEGADO
                </div>
            </div>
        `;
    }
});