// Sistema de Gerenciamento de Selos (Edição e Carregamento)
// Autor: Copilot (para jguivianna@gmail.com)

(function() {
    const ALLOWED_EMAIL = "jguivianna@gmail.com";
    const DB_COLLECTION = "system_data";
    const DB_DOC = "selos_registry";
    
    // Mapeamento de classes de cores/elementos
    const ELEMENT_CLASSES = {
        'nulidrico': { css: 'element-nulidrico', titleCss: 'color-nulidrico', name: 'Selos de Nulídrico' },
        'solar': { css: 'element-solar', titleCss: 'color-solar', name: 'Selos de Solar' },
        'estase': { css: 'element-estase', titleCss: 'color-estase', name: 'Selos de Estase' },
        'praga': { css: 'element-praga', titleCss: 'color-praga', name: 'Selos de Praga' },
        'pesadelo': { css: 'element-pesadelo', titleCss: 'color-pesadelo', name: 'Selos de Pesadelo' },
        'sagrado': { css: 'element-sagrado', titleCss: 'color-sagrado', name: 'Selos de Sagrado' },
        'electro': { css: 'element-electro', titleCss: 'color-electro', name: 'Selos de Electro' },
        'podridao': { css: 'element-podridao', titleCss: 'color-podridao', name: 'Selos de Podridão' }
    };

    let isEditMode = false;
    let currentSelosData = [];

    // Mover a função de inicialização para fora do load ou garantir que ela rode
    // O evento DOMContentLoaded pode ser mais rápido que load
    document.addEventListener('DOMContentLoaded', init);
    // Fallback para caso o script carregue depois do DOMContentLoaded
    if(document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    }

    async function init() {
        if(window.selosManagerInitialized) return;
        window.selosManagerInitialized = true;

        console.log("Selos Manager: Inicializando...");
        
        // 1. Iniciar carregamento de dados (não bloquear a auth)
        loadSelosFromDB();

        // 2. Configurar listener de Auth
        if (window.firebase && window.firebase.auth) {
            firebase.auth().onAuthStateChanged(checkUserPermissions);
        } else {
            console.error("Selos Manager: Firebase Auth não encontrado no escopo global. Tentando novamente em 2s...");
            setTimeout(() => {
                if(window.firebase && window.firebase.auth) firebase.auth().onAuthStateChanged(checkUserPermissions);
            }, 2000);
        }
    }

    async function checkUserPermissions(user) {
        if (!user) {
             console.log("Selos Manager: Nenhum usuário logado.");
             return;
        }

        console.log("Selos Manager: Verificando permissões para UID:", user.uid);
        
        try {
            // Busca dados do perfil no Firestore
            const userDoc = await db.collection('users').doc(user.uid).get();
            
            if (userDoc.exists) {
                const userData = userDoc.data();
                console.log("Selos Manager: Dados do usuário analisados:", userData.username, userData.title);

                // Normalização para verificação
                const username = (userData.username || '').toLowerCase().trim();
                const title = (userData.title || '').toLowerCase().trim();
                const bio = (userData.bio || '').toLowerCase();

                // Lógica de autorização flexível
                const isVianna = username === 'vianna';
                const isMestre = title === 'mestre' || title.includes('admin');
                const isCriador = bio.includes('criador') || bio.includes('wuitalur') || bio.includes('wuiltaur'); // Cobre o typo

                if (isVianna || isMestre || isCriador) {
                    console.log("Selos Manager: PERMISSÃO CONCEDIDA! (Vianna/Mestre/Criador)");
                    initAdminControls();
                } else {
                    console.log("Selos Manager: Acesso negado. Critérios não atendidos.");
                }
            } else {
                console.log("Selos Manager: Perfil não encontrado. Tentando verificar email como fallback...");
                if (user.email && user.email === ALLOWED_EMAIL) initAdminControls();
            }
        } catch (error) {
            console.error("Selos Manager: Erro na verificação de permissões:", error);
            // Fallback de segurança: se der erro, mas for o email correto, libera
             if (user.email && user.email === ALLOWED_EMAIL) initAdminControls();
        }
    }

    async function loadSelosFromDB() {
        console.log("Selos Manager: Tentando carregar do Firestore...");
        
        // DEBUG: Force load from HTML locally to see new static content
        const isLocal = window.location.protocol === 'file:' || 
                       window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1' ||
                       window.location.hostname.startsWith('192.168.');

        if (isLocal) {
             console.warn("⚠️ Ambiente LOCAL (IP/File): Carregando selos do HTML estático para validação.");
             scrapeSelosFromHTML();
             return;
        }

        try {
            const doc = await db.collection(DB_COLLECTION).doc(DB_DOC).get();
            if (doc.exists) {
                const data = doc.data();
                if (data.selos && Array.isArray(data.selos) && data.selos.length > 0) {
                    // SE O HTML TIVER MAIS SELOS, PREFERIR O HTML (PARA DESENVOLVIMENTO)
                    const htmlCount = document.querySelectorAll('.seal-card').length;
                    if (htmlCount > data.selos.length) {
                         console.warn(`⚠️ HTML local tem MAIS selos (${htmlCount}) que o DB (${data.selos.length}). Ignorando DB.`);
                         scrapeSelosFromHTML();
                         return;
                    }

                    console.log("Selos Manager: Dados carregados do banco com sucesso.");
                    currentSelosData = data.selos;
                    renderSelos(currentSelosData);
                    return;
                }
            }
            
            console.log("Selos Manager: Nenhum dado salvo encontrado ou vazio.");
            scrapeSelosFromHTML(); 
            
        } catch (error) {
            console.error("Selos Manager: Erro ao ler do banco (possível falta de permissão). Usando HTML local.", error);
            scrapeSelosFromHTML();
        }
    }

    function scrapeSelosFromHTML() {
        console.log("Selos Manager: Scraping HTML atual...");
        currentSelosData = [];
        const sections = document.querySelectorAll('.seal-element-group');
        
        if (sections.length === 0) {
            console.warn("Selos Manager: Nenhuma seção .seal-element-group encontrada para scrape.");
            return;
        }

        sections.forEach(group => {
            let elementKey = 'desconhecido';
            // Tenta identificar o elemento pela classe do título
            const title = group.querySelector('h3');
            if (title) {
                for (const [key, config] of Object.entries(ELEMENT_CLASSES)) {
                    if (title.classList.contains(config.titleCss)) {
                        elementKey = key;
                        break;
                    }
                }
            }

            const cards = group.querySelectorAll('.seal-card');
            cards.forEach(card => {
                const name = card.querySelector('h4').innerText;
                const cost = card.querySelector('.seal-cost').innerText.replace(' EA', '');
                const effect = card.querySelector('.seal-effect').innerText.trim();
                
                // Extrair metadados
                const metas = {};
                card.querySelectorAll('.seal-meta-item').forEach(item => {
                    const text = item.innerText;
                    const parts = text.split(':');
                    if (parts.length > 1) {
                        const key = parts[0].trim().toLowerCase().replace('ç', 'c').replace('ã', 'a');
                        const value = parts.slice(1).join(':').trim();
                        metas[key] = value;
                    }
                });

                currentSelosData.push({
                    id: Date.now() + Math.random().toString(36).substr(2, 9),
                    element: elementKey,
                    name: name,
                    cost: cost,
                    effect: effect,
                    influence: metas['influencia'] || '1',
                    execution: metas['execucao'] || 'Ação Padrão',
                    range: metas['alcance'] || 'Pessoal',
                    duration: metas['duracao'] || 'Instantâneo',
                    components: metas['componentes'] || 'Nenhum',
                    target: metas['alvo'] || '',
                    resistance: metas['resistencia'] || ''
                });
            });
        });
        console.log("Selos extraídos do HTML:", currentSelosData.length);
    }

    function renderSelos(selosList) {
        // Agrupar por elemento
        const grouped = {};
        Object.keys(ELEMENT_CLASSES).forEach(k => grouped[k] = []);
        
        selosList.forEach(selo => {
            if (!grouped[selo.element]) grouped[selo.element] = [];
            grouped[selo.element].push(selo);
        });

        // Encontrar a seção container
        const container = document.getElementById('selos');
        if (!container) return;

        // Limpar os grupos existentes (mantendo o intro e o título H2)
        // Vamos procurar onde começam os grupos. Geralmente após .seal-intro
        const existingGroups = container.querySelectorAll('.seal-element-group');
        existingGroups.forEach(g => g.remove());

        // Renderizar novos grupos
        Object.entries(ELEMENT_CLASSES).forEach(([key, config]) => {
            const selosDoElemento = grouped[key];
            if (selosDoElemento && selosDoElemento.length > 0) {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'seal-element-group';
                
                const h3 = document.createElement('h3');
                h3.className = config.titleCss;
                h3.textContent = config.name;
                groupDiv.appendChild(h3);

                const gridDiv = document.createElement('div');
                gridDiv.className = 'seal-grid';

                selosDoElemento.forEach(selo => {
                    const card = createSealCardDOM(selo, config.css);
                    gridDiv.appendChild(card);
                });

                // Botão de adicionar selo neste grupo (visível apenas em edição)
                if (isEditMode) {
                    const addBtn = document.createElement('div');
                    addBtn.className = 'seal-card add-seal-btn';
                    addBtn.style.cssText = 'display:flex; justify-content:center; align-items:center; cursor:pointer; opacity:0.7; border: 2px dashed #444; min-height: 200px;';
                    addBtn.innerHTML = '<span style="font-size:3em; color:#444;">+</span>';
                    addBtn.onclick = () => addNewSelo(key);
                    gridDiv.appendChild(addBtn);
                }

                groupDiv.appendChild(gridDiv);
                container.appendChild(groupDiv);
            }
        });
    }

    function createSealCardDOM(selo, cssClass) {
        const card = document.createElement('div');
        card.className = `seal-card ${cssClass}`;
        card.dataset.id = selo.id;

        if (isEditMode) {
            card.innerHTML = `
                <div style="text-align:right;"><button onclick="deleteSelo('${selo.id}')" style="background:red;color:white;border:none;cursor:pointer;">X</button></div>
                <input class="edit-field edit-name" value="${selo.name}" placeholder="Nome">
                <div class="seal-meta">
                    <div class="seal-meta-item"><strong>Inf:</strong> <input class="edit-field edit-influence" value="${selo.influence}" style="width:30px"></div>
                    <div class="seal-meta-item"><strong>Exec:</strong> <input class="edit-field edit-execution" value="${selo.execution}"></div>
                    <div class="seal-meta-item"><strong>Alc:</strong> <input class="edit-field edit-range" value="${selo.range}"></div>
                    <div class="seal-meta-item"><strong>Dur:</strong> <input class="edit-field edit-duration" value="${selo.duration}"></div>
                    <div class="seal-meta-item"><strong>Comp:</strong> <input class="edit-field edit-components" value="${selo.components}"></div>
                    <div class="seal-meta-item"><strong>Alvo:</strong> <input class="edit-field edit-target" value="${selo.target || ''}" placeholder="Opcional"></div>
                    <div class="seal-meta-item"><strong>Res:</strong> <input class="edit-field edit-resistance" value="${selo.resistance || ''}" placeholder="Opcional"></div>
                </div>
                <div class="seal-cost"><input class="edit-field edit-cost" value="${selo.cost}" style="width:40px; color:black;"> EA</div>
                <textarea class="edit-field edit-effect" style="width:100%; height:80px; margin-top:10px; color:black;">${selo.effect}</textarea>
            `;
        } else {
            let metaHtml = `
                <div class="seal-meta-item"><strong>Influência:</strong> ${selo.influence}</div>
                <div class="seal-meta-item"><strong>Execução:</strong> ${selo.execution}</div>
                <div class="seal-meta-item"><strong>Alcance:</strong> ${selo.range}</div>
                <div class="seal-meta-item"><strong>Duração:</strong> ${selo.duration}</div>
                <div class="seal-meta-item"><strong>Componentes:</strong> ${selo.components}</div>
            `;
            if (selo.target) metaHtml += `<div class="seal-meta-item"><strong>Alvo:</strong> ${selo.target}</div>`;
            if (selo.resistance) metaHtml += `<div class="seal-meta-item"><strong>Resistência:</strong> ${selo.resistance}</div>`;

            card.innerHTML = `
                <h4>${selo.name}</h4>
                <div class="seal-meta">${metaHtml}</div>
                <div class="seal-cost">${selo.cost} <span class="attr-ea">EA</span></div>
                <div class="seal-effect">${selo.effect}</div>
            `;
        }
        return card;
    }

    function initAdminControls() {
        console.log("Selos Manager: Iniciando controles de admin...");
        
        // Verifica se já existe para não duplicar
        if(document.getElementById('admin-wrapper')) return;

        // Container Wrapper (sempre visível, posicionado no canto, mas transparente para cliques fora dos botões)
        const wrapper = document.createElement('div');
        wrapper.id = 'admin-wrapper';
        wrapper.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 99999;
            display: flex;
            flex-direction: column;
            align-items: flex-end;
            gap: 12px;
            pointer-events: none;
        `;

        // Botão FAB (Martelo - SVG)
        const fab = document.createElement('div');
        fab.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:block;"><path d="M18.3 5.3a2.3 2.3 0 0 0-3.2 0L2.8 17.6a2.3 2.3 0 0 0 0 3.2 2.3 2.3 0 0 0 3.2 0l12.3-12.3a2.3 2.3 0 0 0 0-3.2z"/><path d="M14 6l4 4"/></svg>`; // Ícone simplificado de ferramenta/martelo
        fab.title = "Menu Admin";
        fab.style.cssText = `
            width: 50px;
            height: 50px;
            background: #2c3e50;
            border: 2px solid #34495e;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.5);
            pointer-events: auto;
            transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            color: #fff;
            user-select: none;
        `;
        
        fab.onmouseenter = () => { fab.style.transform = "scale(1.1)"; fab.style.background = "#34495e"; };
        fab.onmouseleave = () => { fab.style.transform = "scale(1)"; fab.style.background = "#2c3e50"; };

        // Painel Admin (Menu Popup)
        const controlsDiv = document.createElement('div');
        controlsDiv.id = 'selos-admin-panel';
        controlsDiv.style.cssText = `
            display: none; /* Oculto inicialmente */
            padding: 16px;
            background: #1a1a1a;
            border-left: 4px solid #9b59b6;
            border-radius: 4px;
            box-shadow: 0 8px 20px rgba(0,0,0,0.6);
            flex-direction: column;
            gap: 12px;
            min-width: 220px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            pointer-events: auto;
            animation: slideIn 0.2s ease-out;
        `;
        
        // Título do Painel
        const title = document.createElement('div');
        title.innerHTML = "<div style='color:#888; font-size:11px; text-transform:uppercase; letter-spacing:1.5px; font-weight:600;'>System Admin</div><div style='color:#fff; font-size:14px; font-weight:700; margin-top:2px;'>Gerenciador de Selos</div><hr style='border:0; border-top:1px solid #333; margin:10px 0;'>";
        controlsDiv.appendChild(title);

        const btnStyle = "padding: 10px 15px; border: none; border-radius: 3px; cursor: pointer; font-weight: 600; font-size: 12px; transition: background 0.2s; width: 100%; text-transform: uppercase; letter-spacing: 0.5px; display: block;";

        // Botão de Toggle Edição
        const toggleBtn = document.createElement('button');
        toggleBtn.innerText = "ATIVAR EDIÇÃO";
        toggleBtn.style.cssText = btnStyle + "background: #333; color: #ecf0f1; border: 1px solid #444;";
        
        toggleBtn.onclick = () => {
            isEditMode = !isEditMode;
            if (isEditMode) {
                toggleBtn.style.background = "#c0392b";
                toggleBtn.style.borderColor = "#e74c3c";
                toggleBtn.innerText = "SAIR DA EDIÇÃO";
            } else {
                toggleBtn.style.background = "#333";
                toggleBtn.style.borderColor = "#444";
                toggleBtn.innerText = "ATIVAR EDIÇÃO";
            }
            renderSelos(currentSelosData);
            saveBtn.style.display = isEditMode ? 'block' : 'none';
        };

        const saveBtn = document.createElement('button');
        saveBtn.innerText = "SALVAR ALTERAÇÕES";
        saveBtn.style.cssText = btnStyle + "background: #27ae60; color: white; display: none; margin-top: 5px;";
        saveBtn.onclick = saveChanges;

        controlsDiv.appendChild(toggleBtn);
        controlsDiv.appendChild(saveBtn);
        
        // Lógica do Clique no Martelo
        fab.onclick = () => {
            const isHidden = controlsDiv.style.display === 'none';
            controlsDiv.style.display = isHidden ? 'flex' : 'none';
        };

        // Adiciona ao wrapper
        wrapper.appendChild(controlsDiv);
        wrapper.appendChild(fab);
        
        // Adiciona ao corpo do documento
        document.body.appendChild(wrapper);
        console.log("Selos Manager: Wrapper Admin inserido no BODY com sucesso.");

        // Define funções globais no escopo window se ainda não existirem
        if (!window.deleteSelo) {
            window.deleteSelo = (id) => {
                if(confirm('Tem certeza que deseja deletar este selo?')) {
                    currentSelosData = currentSelosData.filter(s => s.id !== id);
                    renderSelos(currentSelosData);
                }
            };
        }

        if (!window.addNewSelo) {
            window.addNewSelo = (element) => {
                currentSelosData.push({
                     id: Date.now().toString(),
                     element: element,
                     name: "Novo Selo",
                     influence: "1",
                     execution: "Ação Padrão",
                     range: "PESSOAL",
                     duration: "Instantâneo",
                     components: "Nenhum",
                     cost: "0",
                     effect: "Descrição do efeito..."
                });
                renderSelos(currentSelosData);
            };
        }
    }

    async function saveChanges() {
        if (!isEditMode) return;
        
        // Coleta dados dos inputs
        const cards = document.querySelectorAll('.seal-card[data-id]');
        const newData = [];
        
        cards.forEach(card => {
            // Ignora o botão de adicionar
            if(card.classList.contains('add-seal-btn')) return;

            const id = card.dataset.id;
            // Busca o objeto original para manter o elemento, ou pega do DOM se quisermos permitir mudar elemento (complexo)
            const original = currentSelosData.find(s => s.id === id);
            
            if (original) {
                newData.push({
                    id: id,
                    element: original.element,
                    name: card.querySelector('.edit-name').value,
                    influence: card.querySelector('.edit-influence').value,
                    execution: card.querySelector('.edit-execution').value,
                    range: card.querySelector('.edit-range').value,
                    duration: card.querySelector('.edit-duration').value,
                    components: card.querySelector('.edit-components').value,
                    target: card.querySelector('.edit-target').value,
                    resistance: card.querySelector('.edit-resistance').value,
                    cost: card.querySelector('.edit-cost').value,
                    effect: card.querySelector('.edit-effect').value
                });
            }
        });

        currentSelosData = newData;

        const btn = document.querySelector('button[onclick="saveChanges"]'); // Hacky selector but works locally
        const oldText = btn ? btn.innerText : 'Salvar';
        if(btn) btn.innerText = "Salvando...";

        try {
            await db.collection(DB_COLLECTION).doc(DB_DOC).set({
                selos: currentSelosData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedBy: ALLOWED_EMAIL
            });
            alert('Selos salvos com sucesso!');
            // Re-render to exit edit inputs visual state if wanted, or just update data
            // renderSelos(currentSelosData); 
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert('Erro ao salvar: ' + error.message);
        } finally {
            if(btn) btn.innerText = oldText;
        }
    }

})();
