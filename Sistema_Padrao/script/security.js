// Sistema de Segurança - Wuitalur RPG
(function() {
    'use strict';
    
    // Desabilitar menu de contexto (botão direito)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        showSecurityAlert('Clique direito desabilitado por segurança');
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
            showSecurityAlert('Inspetor de elementos bloqueado');
            return false;
        }
        
        // Ctrl+U (Ver código fonte)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            showSecurityAlert('Visualização de código fonte bloqueada');
            return false;
        }
        
        // Ctrl+S (Salvar página)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            showSecurityAlert('Download da página bloqueado');
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
                showSecurityAlert('DevTools detectado - fechando...');
                // Opcional: redirecionar ou fechar aba
                // window.location.href = 'about:blank';
            }
        } else {
            devtools.open = false;
        }
    }
    
    // Verificar periodicamente
    setInterval(detectDevTools, 500);
    
    // Função para mostrar alertas de segurança
    function showSecurityAlert(message) {
        // Criar um alerta personalizado mais sutil
        const alertDiv = document.createElement('div');
        alertDiv.textContent = '🔒 ' + message;
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 9999;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
        `;
        
        document.body.appendChild(alertDiv);
        
        // Remover após 3 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.parentNode.removeChild(alertDiv);
            }
        }, 3000);
    }
    
    // Desabilitar seleção de texto (opcional)
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
    
    console.log('🔒 Sistema de segurança Wuitalur ativo');
})();