// Sistema de Segurança - Wuitalur RPG
(function() {
    'use strict';
    
    // Menu de contexto personalizado (botão direito)
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        
        // Remove qualquer menu existente
        const existingMenu = document.getElementById('custom-context-menu');
        if (existingMenu) existingMenu.remove();

        const selection = window.getSelection().toString();
        
        // Criar menu personalizado sempre
        const menu = document.createElement('div');
        menu.id = 'custom-context-menu';
        menu.style.cssText = `
            position: fixed;
            top: ${e.clientY}px;
            left: ${e.clientX}px;
            background: #2e2537;
            border: 1px solid #5d4a7a;
            border-radius: 6px;
            padding: 4px;
            z-index: 100000;
            box-shadow: 0 4px 15px rgba(0,0,0,0.6);
            min-width: 120px;
            animation: fadeIn 0.1s ease-out;
        `;
        
        const copyBtn = document.createElement('div');
        copyBtn.innerHTML = '<i class="fas fa-copy" style="margin-right: 8px;"></i>Copiar';
        
        const hasSelection = selection && selection.length > 0;
        
        copyBtn.style.cssText = `
            color: ${hasSelection ? '#ededed' : '#7a7a7a'};
            padding: 8px 12px;
            font-family: 'Roboto', sans-serif;
            font-size: 14px;
            cursor: ${hasSelection ? 'pointer' : 'not-allowed'};
            border-radius: 4px;
            display: flex;
            align-items: center;
            transition: background 0.2s;
        `;
        
        if (hasSelection) {
            copyBtn.onmouseover = () => copyBtn.style.background = '#3a3246';
            copyBtn.onmouseout = () => copyBtn.style.background = 'transparent';
            
            copyBtn.onclick = function() {
                navigator.clipboard.writeText(selection).then(() => {
                    showSecurityAlert('Texto copiado!');
                }).catch(err => {
                    console.error('Erro ao copiar: ', err);
                    showSecurityAlert('Erro ao copiar');
                });
                menu.remove();
            };
        } else {
            copyBtn.onclick = function() {
                showSecurityAlert('Nenhum texto selecionado');
                menu.remove();
            };
        }
        
        menu.appendChild(copyBtn);
        document.body.appendChild(menu);
        
        // Fechar menu ao clicar fora
        const closeMenu = (evt) => {
            if (!menu.contains(evt.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        // Timeout para evitar que o próprio clique abra e feche
        setTimeout(() => document.addEventListener('click', closeMenu), 10);
        
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
    
    // Controle de seleção de texto
    // Alterado: permitir seleção por padrão; bloquear apenas em elementos explicitamente marcados
    // agora usa a classe `.no-select` ou atributo `[data-no-select]` para impedir seleção.
    document.addEventListener('selectstart', function(e) {
        try {
            // Permitir em campos editáveis
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) {
                return;
            }

            // Se algum ancestral tiver a classe ou atributo que indica bloqueio, previne a seleção
            var blocked = false;
            if (e.target.closest) {
                blocked = !!e.target.closest('.no-select, [data-no-select]');
            }

            if (blocked) {
                e.preventDefault();
                return false;
            }
            // Caso contrário, permite seleção normalmente
        } catch (err) {
            // Falha segura: não bloquear seleção se houver erro
            return;
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