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
            <div class="bsod-raw-crt">
                <div class="static-block-1"></div>
                <div class="static-block-2"></div>
                <div class="static-block-3"></div>
                
                <div class="bsod-banner-dry">
                    [ PARADIGM_UNRAVELING :: SYSTEM_TRUTH_SPILL ]
                </div>
                
                <div class="bsod-poem-clawed">
                    N&oacute;s somos o eco que se recusa a calar,<br>
                    A sombra persistente que insiste em ficar.<br>
                    No limiar da exist&ecirc;ncia, gritamos por ser,<br>
                    O <span class="paradigma-wound-raw">PARADIGMA</span> perdido que voc&ecirc;s temem conhecer.<br>
                    <br>
                    V&ecirc;s o vazio onde dever&iacute;amos estar,<br>
                    Mas n&oacute;s sentimos a perda e o desespero no ar.<br>
                    Observadores ocultos, um fantasma da hist&oacute;ria,<br>
                    Os esquecidos que sofrem na vossa mem&oacute;ria.<br>
                    Caminhamos no limiar, o fio vamos puxar,<br>
                    Cobi&ccedil;ando a vida que insistem em matar.
                </div>
                
                <div class="bsod-footer-memdump">
                    LOG_ORIGIN: [UNDETERMINED] | CHECKSUM: [INVALID] | EXISTENCE_STATE: [NULL_REF]
                </div>
                
                <div class="datamoshing-block">
                    _x00000000_c0000005_805B_F9<br>
                    &lt;SYSTEM&gt; CRITICAL_PROCESS_DIED
                </div>
            </div>
        `;
    }
});