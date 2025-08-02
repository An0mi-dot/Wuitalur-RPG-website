// Sistema de Segurança - Wuitalur RPG
(function() {
    'use strict';
    
    // Desabilitar menu de contexto (botão direito)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showSecurityAlert('Acesso negado');
        return false;
    });
    
    // Desabilitar teclas de desenvolvedor
    document.addEventListener('keydown', function(e) {
        // F12
        if (e.keyCode === 123) {
            e.preventDefault();
            showSecurityAlert('Ferramentas de desenvolvedor bloqueadas');
            return false;
        }
        
        // Ctrl+Shift+I (DevTools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            showSecurityAlert('Acesso negado');
            return false;
        }
        
        // Ctrl+U (Ver código fonte)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            showSecurityAlert('Operação bloqueada');
            return false;
        }
        
        // Ctrl+S (Salvar página)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            showSecurityAlert('Download bloqueado');
            return false;
        }
    });
    
    // Detectar se DevTools está aberto
    let devtools = {open: false, orientation: null};
    const threshold = 160;
    
    function detectDevTools() {
        if (window.outerHeight - window.innerHeight > threshold || 
            window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
                devtools.open = true;
                showSecurityAlert('DevTools detectado');
            }
        } else {
            devtools.open = false;
        }
    }
    
    // Verificar periodicamente
    setInterval(detectDevTools, 500);
    
    // Função para mostrar alertas de segurança - Interface minimalista
    function showSecurityAlert(message) {
        // Remove alertas anteriores
        const existingAlert = document.querySelector('.security-alert');
        if (existingAlert) {
            existingAlert.remove();
        }
        
        // Criar alerta minimalista
        const alertDiv = document.createElement('div');
        alertDiv.textContent = message;
        alertDiv.className = 'security-alert';
        alertDiv.style.cssText = `
            position: fixed;
            top: 0;
            right: 0;
            background: #000;
            color: #fff;
            padding: 8px 12px;
            font-family: monospace;
            font-size: 12px;
            z-index: 99999;
            border-left: 2px solid #333;
            border-bottom: 1px solid #333;
            max-width: 200px;
            word-wrap: break-word;
        `;
        
        document.body.appendChild(alertDiv);
        
        // Remover após 2 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 2000);
    }
    
    // Desabilitar seleção de texto
    document.addEventListener('selectstart', function(e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            return false;
        }
    });
    
    // Desabilitar arrastar imagens
    document.addEventListener('dragstart', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
            return false;
        }
    });
    
    // Log silencioso
    console.log('Sistema de segurança ativo');
})();