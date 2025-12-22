// Script da Comunidade (Listagem de Usuários)

document.addEventListener('DOMContentLoaded', () => {
    // Aguarda um pouco para garantir que o Firebase foi inicializado em firebase-config.js
    setTimeout(loadCommunityUsers, 1000);
});

let allUsers = []; // Cache local para busca

async function loadCommunityUsers() {
    const grid = document.getElementById('users-grid');
    if (!grid) return;

    try {
        // Tenta buscar os últimos 50 usuários (para não pesar)
        // Ordenar por 'createdAt' se existir, ou padrão
        const snapshot = await db.collection('users')
            .limit(50)
            .get();

        if (snapshot.empty) {
            grid.innerHTML = '<p style="color: #aaa; grid-column: 1/-1; text-align: center;">Nenhum viajante encontrado.</p>';
            return;
        }

        allUsers = [];
        grid.innerHTML = ''; // Limpa o "Carregando..."

        snapshot.forEach(doc => {
            const data = doc.data();
            const user = {
                id: doc.id,
                username: data.username || 'Viajante Desconhecido',
                title: data.title || 'Novato',
                avatar: data.avatar || 'default',
                banner: data.banner || 'default',
                bio: data.bio || '',
                createdAt: data.createdAt
            };
            allUsers.push(user);
            grid.appendChild(createUserCard(user));
        });

    } catch (error) {
        console.error("Erro ao carregar comunidade:", error);
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #ff6b6b; background: rgba(255,0,0,0.1); padding: 20px; border-radius: 8px;">
                <h3>Acesso Restrito</h3>
                <p>Você não tem permissão para ver a lista de todos os viajantes ou ocorreu um erro de conexão.</p>
                <p style="font-size: 0.8rem; opacity: 0.7;">Erro: ${error.message}</p>
            </div>
        `;
    }
}

function createUserCard(user) {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.onclick = () => openPublicProfile(user);

    // Avatar Logic
    let avatarSrc = user.avatar;
    if (!avatarSrc || avatarSrc === 'default') {
        // Placeholder visual se não tiver imagem
        // Como é difícil gerar imagem dinâmica sem canvas aqui, vamos usar um ícone ou imagem padrão
        // Mas o CSS espera um src. Vamos usar um placeholder transparente e background color
        avatarSrc = '../../Pag_Principal/assets/default-avatar.png'; // Fallback se existir
        // Ou melhor, usar o mesmo truque do header se for default
    }

    // Se for default, o src vai falhar se a imagem não existir. 
    // Vamos usar um truque: se for default, não põe img tag, põe div.
    // Mas para manter consistência com o layout proposto:
    
    let imgHTML = `<img src="${avatarSrc}" class="user-card-avatar" onerror="this.src='https://via.placeholder.com/80?text=?'">`;
    if (user.avatar === 'default' || !user.avatar) {
        imgHTML = `<div class="user-card-avatar" style="display:flex; align-items:center; justify-content:center; background: linear-gradient(45deg, #6a11cb, #2575fc);"><i class="fas fa-user" style="font-size: 30px; color: white;"></i></div>`;
    }

    card.innerHTML = `
        ${imgHTML}
        <div class="user-card-name">${escapeHtml(user.username)}</div>
        <div class="user-card-title">${escapeHtml(user.title)}</div>
    `;

    return card;
}

function filterUsers() {
    const term = document.getElementById('search-users').value.toLowerCase();
    const grid = document.getElementById('users-grid');
    grid.innerHTML = '';

    const filtered = allUsers.filter(u => u.username.toLowerCase().includes(term));

    if (filtered.length === 0) {
        grid.innerHTML = '<p style="color: #aaa; grid-column: 1/-1; text-align: center;">Nenhum viajante encontrado com esse nome.</p>';
        return;
    }

    filtered.forEach(user => {
        grid.appendChild(createUserCard(user));
    });
}

// --- Lógica do Modal Público ---

function openPublicProfile(user) {
    const modal = document.getElementById('public-profile-modal');
    if (!modal) return;

    // Preencher dados
    document.getElementById('public-username').innerText = user.username;
    document.getElementById('public-title').innerText = user.title;
    document.getElementById('public-bio').innerText = user.bio || "Este viajante ainda não escreveu sua história.";
    
    // Data de entrada
    if (user.createdAt && user.createdAt.seconds) {
        const date = new Date(user.createdAt.seconds * 1000);
        document.getElementById('public-joined').innerText = "Entrou em: " + date.toLocaleDateString('pt-BR');
    } else {
        document.getElementById('public-joined').innerText = "";
    }

    // Avatar
    const avatarEl = document.getElementById('public-avatar');
    const avatarDefaultEl = document.getElementById('public-avatar-default');
    
    if (user.avatar && user.avatar !== 'default') {
        avatarEl.src = user.avatar;
        avatarEl.style.display = 'block';
        if (avatarDefaultEl) avatarDefaultEl.style.display = 'none';
    } else {
        avatarEl.style.display = 'none';
        if (avatarDefaultEl) avatarDefaultEl.style.display = 'flex';
    }

    // Banner (Background color ou imagem baseada na escolha)
    const bannerEl = document.getElementById('public-banner');
    // Mapeamento de banners por Elemento (Cores extraídas do Sistema Padrão)
    const banners = {
        'default': '#333',
        'nulidrico': 'linear-gradient(135deg, #fa0000, #a60000)',       // Vermelho (Baseado em --cor-nulidrico)
        'solar': 'linear-gradient(135deg, #fa6b05, #d95a00)',           // Laranja (Baseado em --cor-solar)
        'estase': 'linear-gradient(90deg, #1a2a4d 60%, #274b7a 100%)',  // Azul Profundo (Cópia exata do CSS .estase-highlight)
        'praga': 'linear-gradient(135deg, #696969, #505050)',           // Cinza Morto (Cópia exata do CSS .plague-theme h5)
        'pesadelo': 'linear-gradient(135deg, #cc6633, #b85c2e)',        // Laranja Queimado (Cópia exata do CSS .nightmare-theme h5)
        'sagrado': 'linear-gradient(135deg, #ffd700, #e6c200)',         // Dourado (Baseado em --cor-sagrado)
        'electro': 'linear-gradient(135deg, #05d9fa, #04a6bf)',         // Ciano Elétrico (Baseado em --cor-electro-seal)
        'podridao': 'linear-gradient(135deg, #1a0302, #330604)'         // Vermelho Quase Preto (Baseado em --cor-podridao)
    };
    bannerEl.style.background = banners[user.banner] || banners['default'];


    // Mostrar modal
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
    }, 10);
}

function closePublicModal() {
    const modal = document.getElementById('public-profile-modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// Utilitário para evitar XSS
function escapeHtml(text) {
    if (!text) return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
