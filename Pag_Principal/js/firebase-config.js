// Configuração do Firebase
// SUBSTITUA ESTE OBJETO PELAS SUAS CHAVES DO FIREBASE CONSOLE
// 1. Vá em https://console.firebase.google.com/
// 2. Crie um projeto
// 3. Adicione um app Web
// 4. Copie as configurações (firebaseConfig) e cole abaixo

const firebaseConfig = {
    apiKey: "AIzaSyDi0aCywAWF5vYJUpIzjJHoiyo8uUTuJiw",
    authDomain: "loginwu-be2f6.firebaseapp.com",
    projectId: "loginwu-be2f6",
    storageBucket: "loginwu-be2f6.firebasestorage.app",
    messagingSenderId: "280531585782",
    appId: "1:280531585782:web:72b3816e3bd4a4ad0dbad7",
    measurementId: "G-5HVEZR89XB"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
window.auth = firebase.auth();
window.db = firebase.firestore();
window.storage = firebase.storage();
console.log("Firebase inicializado. Auth:", window.auth, "DB:", window.db, "Storage:", window.storage);