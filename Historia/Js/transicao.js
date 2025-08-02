document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('fade-in');
});

function navigateTo(url) {
    document.body.classList.add('fade-out');
    setTimeout(function() {
        window.location.href = url;
    }, 2000); // Tempo da animação em milissegundos
}

function showDevelopmentMessage() {
    // Mostra a mensagem
    const message = document.getElementById('development-message');
    message.classList.add('show');

    // Esconde a mensagem após 3 segundos
    setTimeout(function() {
        message.classList.remove('show');
    }, 3000);
}