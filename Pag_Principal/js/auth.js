// Lógica da Página de Login

// Elementos do DOM
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginError = document.getElementById('login-error');
const regError = document.getElementById('reg-error');

// Login
if(loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const btn = loginForm.querySelector('button');

        btn.disabled = true;
        btn.innerText = 'Entrando...';
        loginError.innerText = '';

        auth.signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                // Login sucesso
                window.location.href = 'index.html';
            })
            .catch((error) => {
                btn.disabled = false;
                btn.innerText = 'Entrar';
                
                let msg = 'Erro ao entrar.';
                if(error.code === 'auth/user-not-found') msg = 'Usuário não encontrado.';
                if(error.code === 'auth/wrong-password') msg = 'Senha incorreta.';
                if(error.code === 'auth/invalid-email') msg = 'E-mail inválido.';
                
                loginError.innerText = msg;
                console.error(error);
            });
    });
}

// Registro
if(registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const btn = registerForm.querySelector('button');

        if(username.length < 3) {
            regError.innerText = 'Nome de usuário muito curto.';
            return;
        }

        btn.disabled = true;
        btn.innerText = 'Criando conta...';
        regError.innerText = '';

        auth.createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                
                // Criar documento do usuário no Firestore
                return db.collection('users').doc(user.uid).set({
                    username: username,
                    email: email,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    theme: 'default', // Exemplo de customização
                    avatar: 'default.png'
                });
            })
            .then(() => {
                // Sucesso
                window.location.href = 'index.html';
            })
            .catch((error) => {
                btn.disabled = false;
                btn.innerText = 'Cadastrar';
                
                let msg = 'Erro ao cadastrar.';
                if(error.code === 'auth/email-already-in-use') msg = 'E-mail já está em uso.';
                if(error.code === 'auth/weak-password') msg = 'Senha muito fraca (mínimo 6 caracteres).';
                
                regError.innerText = msg;
                console.error(error);
            });
    });
}

// Verificar se já está logado (se abrir a tela de login logado, redireciona)
auth.onAuthStateChanged((user) => {
    if (user && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    }
});