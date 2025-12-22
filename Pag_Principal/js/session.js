// Gerenciamento de Sessão e Perfil

// Elementos de UI (serão preenchidos quando o DOM carregar)
let userDisplay;
let profileModal;

// Verificar autenticação
console.log("Iniciando verificação de autenticação...");
const authCheckTimeout = setTimeout(() => {
    const el = document.getElementById('user-name-display');
    if(el && el.innerText === 'Carregando...') {
        el.innerText = 'Erro: Timeout Auth';
        console.error("O Firebase Auth demorou demais para responder.");
    }
}, 8000);

auth.onAuthStateChanged((user) => {
    clearTimeout(authCheckTimeout);
    if (!user) {
        console.log("Usuário não logado. Redirecionando...");
        // Não logado, redirecionar para login
        if (!window.location.pathname.includes('login.html')) {
             // Usa o caminho definido na página ou tenta adivinhar
             const loginPath = window.LOGIN_PATH || 'login.html';
             window.location.href = loginPath;
        }
    } else {
        console.log("Usuário logado:", user.uid);
        // Logado, carregar dados do perfil
        loadUserProfile(user.uid);
    }
});

function loadUserProfile(uid) {
    console.log("Buscando perfil para UID:", uid);
    const dbTimeout = setTimeout(() => {
         const el = document.getElementById('user-name-display');
         if(el && el.innerText === 'Carregando...') {
             el.innerText = 'Erro: Timeout DB';
             alert("O banco de dados demorou para responder. Verifique sua conexão ou as Regras do Firebase.");
         }
    }, 10000);

    db.collection('users').doc(uid).get().then((doc) => {
        clearTimeout(dbTimeout);
        if (doc.exists) {
            console.log("Perfil encontrado!");
            const data = doc.data();
            applyUserProfile(data);
        } else {
            console.warn("Perfil não encontrado! Tentando recriar automaticamente...");
            createDefaultProfile(uid);
        }
    }).catch((error) => {
        clearTimeout(dbTimeout);
        console.error("Erro ao buscar perfil:", error);
        document.getElementById('user-name-display').innerText = "Erro de Conexão";
    });
}

function createDefaultProfile(uid) {
    const user = firebase.auth().currentUser;
    const email = user ? user.email : "sem-email";
    
    const defaultData = {
        username: "Proscrito",
        title: "Novato",
        bio: "",
        avatar: "default",
        banner: "default",
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection('users').doc(uid).set(defaultData)
        .then(() => {
            console.log("Perfil recriado com sucesso.");
            applyUserProfile(defaultData);
        })
        .catch((error) => {
            console.error("Erro ao recriar perfil:", error);
            document.getElementById('user-name-display').innerText = "Erro Crítico";
        });
}

function applyUserProfile(data) {
    // Atualizar nome de usuário na interface
    const usernameEl = document.getElementById('user-name-display');
    if(usernameEl) usernameEl.innerText = data.username;

    // Atualizar Avatar no Header
    const headerIcon = document.getElementById('header-profile-img');
    if(headerIcon) {
        if(data.avatar && data.avatar !== 'default' && data.avatar.trim() !== '') {
            headerIcon.style.backgroundImage = `url('${data.avatar}')`;
            headerIcon.innerHTML = ''; // Remove o ícone padrão
        } else {
            headerIcon.style.backgroundImage = 'linear-gradient(45deg, #6a11cb, #2575fc)';
            headerIcon.innerHTML = '<i class="fas fa-user" style="color: white;"></i>';
        }
    }

    // Preencher campos do modal
    const inputUser = document.getElementById('profile-username');
    if(inputUser) inputUser.value = data.username || '';

    const inputTitle = document.getElementById('profile-title');
    if(inputTitle) inputTitle.value = data.title || '';

    const inputBio = document.getElementById('profile-bio');
    if(inputBio) inputBio.value = data.bio || '';

    // Avatar Preview e Hidden URL
    const preview = document.getElementById('profile-avatar-preview');
    const hiddenUrl = document.getElementById('profile-avatar-url');
    
    if(data.avatar && data.avatar !== 'default') {
        if(preview) {
            preview.src = data.avatar;
            preview.style.display = 'block';
        }
        if(hiddenUrl) hiddenUrl.value = data.avatar;
    } else {
        if(preview) preview.style.display = 'none';
        if(hiddenUrl) hiddenUrl.value = '';
    }

    const selectBanner = document.getElementById('profile-banner');
    if(selectBanner) selectBanner.value = data.banner || 'default';
}

// Função de Logout
function logout() {
    auth.signOut().then(() => {
        const loginPath = window.LOGIN_PATH || 'login.html';
        window.location.href = loginPath;
    });
}

// Função auxiliar para redimensionar imagem (evita arquivos grandes no Firestore)
function resizeImage(file, maxWidth, maxHeight) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height *= maxWidth / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width *= maxHeight / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                // Converte para JPEG com 70% de qualidade para economizar espaço
                resolve(canvas.toDataURL('image/jpeg', 0.7)); 
            };
            img.src = event.target.result;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Salvar Perfil
async function saveProfile() {
    console.log("Iniciando salvamento de perfil...");
    const user = auth.currentUser;
    
    if(!user) {
        alert("Erro: Usuário não autenticado. Tente recarregar a página.");
        return;
    }

    const btn = document.getElementById('btn-save-profile');
    if(btn) btn.innerText = 'Salvando...';

    const newUsername = document.getElementById('profile-username').value;
    const newTitle = document.getElementById('profile-title').value;
    const newBio = document.getElementById('profile-bio').value;
    const newBanner = document.getElementById('profile-banner').value;
    
    let avatarUrl = document.getElementById('profile-avatar-url').value;
    const fileInput = document.getElementById('profile-avatar-upload');

    try {
        // Processamento da imagem (Conversão para Base64 redimensionado)
        if (fileInput && fileInput.files.length > 0) {
            console.log("Arquivo detectado, processando imagem...");
            const file = fileInput.files[0];
            
            // Redimensiona para max 300x300px para caber no Firestore sem problemas
            avatarUrl = await resizeImage(file, 300, 300);
            console.log("Imagem processada com sucesso.");
        }

        const newData = {
            username: newUsername,
            title: newTitle,
            bio: newBio,
            avatar: avatarUrl,
            banner: newBanner
        };

        console.log("Atualizando Firestore com:", newData);
        await db.collection('users').doc(user.uid).update(newData);
        console.log("Firestore atualizado com sucesso.");
        
        if(btn) btn.innerText = 'Salvo!';
        setTimeout(() => { if(btn) btn.innerText = 'Salvar Perfil'; }, 2000);
        
        // Reaplicar mudanças na hora
        applyUserProfile(newData);
        closeProfileModal();

    } catch (error) {
        console.error("Erro ao salvar:", error);
        if(btn) btn.innerText = 'Erro ao salvar';
        alert("Erro ao salvar: " + error.message + "\nVerifique o console (F12) para mais detalhes.");
    }
}

// Inicialização de Eventos de Interface
document.addEventListener('DOMContentLoaded', () => {
    // Preview da imagem ao selecionar arquivo
    const fileInput = document.getElementById('profile-avatar-upload');
    if(fileInput) {
        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(readerEvent) {
                    const preview = document.getElementById('profile-avatar-preview');
                    if(preview) {
                        preview.src = readerEvent.target.result;
                        preview.style.display = 'block';
                    }
                }
                reader.readAsDataURL(file);
            }
        });
    }
});

// Funções do Modal
function openProfileModal() {
    const modal = document.getElementById('profile-modal');
    if(modal) {
        modal.style.display = 'flex';
        // Pequeno delay para permitir que o navegador renderize o display:flex antes da opacidade
        setTimeout(() => {
            modal.style.opacity = '1';
            modal.style.visibility = 'visible';
        }, 10);
        
        // Preencher dados atuais caso tenham mudado
        const user = auth.currentUser;
        if(user) loadUserProfile(user.uid);
    }
}

function closeProfileModal() {
    const modal = document.getElementById('profile-modal');
    if(modal) {
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        // Esperar a transição terminar antes de esconder
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Função para Exportar Usuários (Requer permissão de leitura na coleção 'users')
async function exportUsers() {
    // --- VERIFICAÇÃO DE ADMINISTRAÇÃO ---
    const user = auth.currentUser;
    // TODO: Substitua "seu_email_admin@exemplo.com" pelo seu email real de login
    const ADMIN_EMAIL = "jguivianna@gmail.com"; 
    
    if (!user || user.email !== ADMIN_EMAIL) {
        alert("⛔ ACESSO NEGADO ⛔\n\nEsta função é exclusiva do Administrador (" + ADMIN_EMAIL + ").\n\nEdite o arquivo 'session.js' e coloque seu email na variável ADMIN_EMAIL para liberar o acesso.");
        return;
    }
    // ------------------------------------

    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "Gerando arquivo...";
    
    try {
        const snapshot = await db.collection('users').get();
        
        if (snapshot.empty) {
            alert("Nenhum usuário encontrado ou sem permissão.");
            btn.innerText = originalText;
            return;
        }

        const users = [];
        snapshot.forEach(doc => {
            // Pega os dados e adiciona o ID do documento
            const userData = doc.data();
            // Removemos campos sensíveis se houver, mas mantemos o básico
            users.push({
                uid: doc.id,
                username: userData.username || "Sem Nome",
                email: userData.email || "Sem Email",
                title: userData.title || "",
                bio: userData.bio || "",
                createdAt: userData.createdAt ? new Date(userData.createdAt.seconds * 1000).toLocaleString() : "Desconhecido"
            });
        });
        
        // Cria o arquivo JSON para download
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(users, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "usuarios_wuitalur_" + new Date().toISOString().slice(0,10) + ".json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
        
        btn.innerText = "Arquivo Gerado!";
        setTimeout(() => btn.innerText = originalText, 3000);

    } catch (error) {
        console.error("Erro ao exportar:", error);
        alert("Erro ao exportar usuários.\nProvavelmente as regras de segurança do Firebase impedem a listagem de todos os usuários por um usuário comum.\n\nErro técnico: " + error.message);
        btn.innerText = "Erro na Exportação";
    }
}