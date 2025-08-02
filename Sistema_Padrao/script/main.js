// === SISTEMA WUITALUR - SCRIPT PRINCIPAL ===

// === DEFINIÇÕES DE ATRIBUTOS ===
// Abreviações dos atributos para referência:
// DES = Destreza
// DEX = Destreza (alternativa)
// INT = Inteligência  
// RM = Resistência Mágica
// RF = Resistência Física
// SAN = Sanidade

// === FUNÇÕES GLOBAIS PARA NAVEGAÇÃO ===

// === SELETOR DE RAÇAS ===
function openRaceSelector() {
    console.log('🎲 Abrindo seletor de raças...');
    const overlay = document.getElementById('race-selector-overlay');
    console.log('Overlay encontrado:', overlay);
    if (overlay) {
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        console.log('✅ Overlay aberto com sucesso!');
    } else {
        console.error('❌ Overlay não encontrado!');
    }
}

function closeRaceSelector() {
    console.log('🎲 Fechando seletor de raças...');
    const overlay = document.getElementById('race-selector-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
        
        console.log('✅ Overlay fechado com sucesso!');
    }
}

function scrollToRace(raceId) {
    console.log('🎯 Navegando para raça:', raceId);
    closeRaceSelector();
    
    setTimeout(() => {
        // Primeiro tenta encontrar a imagem da raça
        let targetElement = document.getElementById(raceId + '-image');
        console.log('Elemento da imagem encontrado:', targetElement);
        
        // Se não encontrar a imagem, tenta a seção da raça
        if (!targetElement) {
            targetElement = document.getElementById(raceId);
            console.log('Elemento da seção encontrado:', targetElement);
        }
        
        if (targetElement) {
            // Calcula a altura da navbar
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 80;
            console.log('Altura da navbar:', navbarHeight);
            
            // Calcula a posição com scroll suave
            const elementRect = targetElement.getBoundingClientRect();
            const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const targetScrollTop = currentScrollTop + elementRect.top - navbarHeight - 20; // 20px de margem extra
            
            console.log('Posição atual de scroll:', currentScrollTop);
            console.log('Posição do elemento (getBoundingClientRect):', elementRect);
            console.log('Posição de scroll calculada:', targetScrollTop);
            
            // Garante que não vai para posição negativa
            const finalScrollTop = Math.max(0, targetScrollTop);
            
            window.scrollTo({
                top: finalScrollTop,
                behavior: 'smooth'
            });
            
            // Efeito visual - espera um pouco para aplicar após o scroll
            setTimeout(() => {
                if (targetElement.classList.contains('race-image') || targetElement.querySelector('.race-image')) {
                    const imageElement = targetElement.classList.contains('race-image') ? targetElement : targetElement.querySelector('.race-image');
                    
                    if (imageElement) {
                        imageElement.style.boxShadow = '0 0 30px rgba(149, 117, 205, 0.8)';
                        imageElement.style.transform = 'scale(1.05)';
                        imageElement.style.transition = 'all 0.5s ease';
                        imageElement.style.borderRadius = '10px';
                        
                        setTimeout(() => {
                            imageElement.style.boxShadow = '';
                            imageElement.style.transform = '';
                            imageElement.style.borderRadius = '';
                        }, 2500);
                    }
                }
            }, 800); // Aguarda o scroll terminar
            
            console.log('✅ Navegação completada!');
        } else {
            console.error('❌ Nenhum elemento encontrado para a raça:', raceId);
            console.log('Elementos disponíveis:');
            console.log('- IDs com "image":', document.querySelectorAll('[id$="-image"]'));
            console.log('- IDs de raças:', document.querySelectorAll('[id^="abissais"], [id^="akivus"], [id^="vampiros"], [id^="hibridos"], [id^="praguentos"], [id^="humanos"], [id^="insectoides"], [id^="exos"], [id^="espectros"]'));
        }
    }, 500); // Aumentei o timeout para garantir que o overlay feche completamente
}

// === SELETOR DE CLASSES ===
function openClassSelector() {
    console.log('🎯 Abrindo seletor de classes...');
    const overlay = document.getElementById('race-selector-overlay-classes');
    console.log('Overlay encontrado:', overlay);
    if (overlay) {
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        
        setTimeout(() => {
            overlay.style.opacity = '1';
        }, 10);
        
        console.log('✅ Overlay aberto com sucesso!');
    } else {
        console.error('❌ Overlay não encontrado!');
    }
}

function closeClassSelector() {
    console.log('🎯 Fechando seletor de classes...');
    const overlay = document.getElementById('race-selector-overlay-classes');
    if (overlay) {
        overlay.style.opacity = '0';
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            overlay.style.display = 'none';
        }, 300);
        
        console.log('✅ Overlay fechado com sucesso!');
    }
}

function scrollToClass(classId) {
    console.log('🎯 Navegando para classe:', classId);
    closeClassSelector();
    
    setTimeout(() => {
        // Mapeamento específico para IDs de imagens de classes
        let imageId;
        if (classId === 'cavaleiros-paladium') {
            imageId = 'cavaleiros-image';
        } else if (classId === 'rastejantes') {
            imageId = 'rastejantes-image';
        } else {
            imageId = classId + '-image';
        }
        
        // Primeiro tenta encontrar a imagem da classe
        let targetElement = document.getElementById(imageId);
        console.log('Elemento da imagem encontrado:', targetElement);
        
        // Se não encontrar a imagem, tenta a seção da classe
        if (!targetElement) {
            targetElement = document.getElementById(classId);
            console.log('Elemento da seção encontrado:', targetElement);
        }
        
        if (targetElement) {
            console.log('🎯 Fazendo scroll para:', targetElement);
            
            // Scroll suave para o elemento
            targetElement.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
            
            // Destaque visual após o scroll
            setTimeout(() => {
                if (targetElement.classList.contains('class-image') || targetElement.querySelector('.class-image')) {
                    const imageElement = targetElement.classList.contains('class-image') ? targetElement : targetElement.querySelector('.class-image');
                    
                    if (imageElement) {
                        imageElement.style.boxShadow = '0 0 30px rgba(149, 117, 205, 0.8)';
                        imageElement.style.transform = 'scale(1.05)';
                        imageElement.style.transition = 'all 0.5s ease';
                        imageElement.style.borderRadius = '10px';
                        
                        setTimeout(() => {
                            imageElement.style.boxShadow = '';
                            imageElement.style.transform = '';
                            imageElement.style.borderRadius = '';
                        }, 2500);
                    }
                }
            }, 800); // Aguarda o scroll terminar
            
            console.log('✅ Navegação completada!');
        } else {
            console.error('❌ Nenhum elemento encontrado para a classe:', classId);
            console.log('Elementos disponíveis:');
            console.log('- IDs com "image":', document.querySelectorAll('[id$="-image"]'));
            console.log('- IDs de classes:', document.querySelectorAll('[id^="cavaleiros-paladium"]'));
        }
    }, 500); // Timeout para garantir que o overlay feche completamente
}

// === FUNÇÃO UTILITÁRIA PARA DESTACAR ATRIBUTOS ===
function highlightAttribute(attributeName) {
    const elements = document.querySelectorAll(`.attr-${attributeName.toLowerCase()}`);
    
    elements.forEach(element => {
        element.style.animation = 'cosmoGlow 1s ease-in-out';
        
        setTimeout(() => {
            element.style.animation = '';
        }, 1000);
    });
}

// === INICIALIZAÇÃO DO SISTEMA ===
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Iniciando Sistema Wuitalur...');
    
    // Verifica se elementos críticos existem
    const overlay = document.getElementById('race-selector-overlay');
    const navBar = document.querySelector('.navbar');
    
    console.log('Overlay presente:', !!overlay);
    console.log('Navbar presente:', !!navBar);
    
    // === SMOOTH SCROLL PARA NAVEGAÇÃO ===
    const navLinks = document.querySelectorAll('.navbar a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // === HIGHLIGHT DA SEÇÃO ATIVA NA NAVEGAÇÃO ===
    function updateActiveSection() {
        const sections = document.querySelectorAll('.content-section');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('active'));
                
                const activeLink = document.querySelector(`.navbar a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }
    
    let ticking = false;
    
    function onScroll() {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateActiveSection();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', onScroll);
    
    // === ANIMAÇÃO DE ENTRADA DOS ELEMENTOS ===
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    const attributeCards = document.querySelectorAll('.attribute-card');
    attributeCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'all 0.6s ease';
        card.style.transitionDelay = `${index * 0.1}s`;
        
        observer.observe(card);
    });
    
    // === EFEITO DE HOVER APRIMORADO PARA CARDS ===
    attributeCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-12px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // === HIGHLIGHT DOS ATRIBUTOS NO TEXTO ===
    function highlightAttributes() {
        const attributeSpans = document.querySelectorAll('[class*="attr-"]');
        
        attributeSpans.forEach(span => {
            span.addEventListener('mouseenter', function() {
                this.style.textShadow = '0 0 10px currentColor';
                this.style.transform = 'scale(1.05)';
                this.style.transition = 'all 0.3s ease';
            });
            
            span.addEventListener('mouseleave', function() {
                this.style.textShadow = 'none';
                this.style.transform = 'scale(1)';
            });
        });
    }
    
    highlightAttributes();
    
    // === LOADING INICIAL DA PÁGINA ===
    window.addEventListener('load', function() {
        document.body.style.opacity = '1';
        
        const header = document.querySelector('.main-header');
        if (header) {
            header.style.opacity = '0';
            header.style.transform = 'translateY(-30px)';
            header.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
            }, 300);
        }
    });
    
    // === ESTILOS DINÂMICOS PARA LINKS ATIVOS ===
    const style = document.createElement('style');
    style.textContent = `
        .navbar a.active {
            background: linear-gradient(135deg, #9575cd, #7e57c2);
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(149, 117, 205, 0.4);
            position: relative;
        }
        
        .navbar a.active::after {
            content: '';
            position: absolute;
            bottom: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, #9575cd, #7e57c2);
            transition: width 0.3s ease;
        }
    `;
    
    document.head.appendChild(style);
    
    console.log('🎲 Sistema Wuitalur carregado com sucesso!');
    console.log('✨ Versão 1.3.4 - Todos os sistemas operacionais');
    console.log('🔧 Funções globais disponíveis: openRaceSelector, closeRaceSelector, scrollToRace');
});

// === FECHA OVERLAY CLICANDO FORA ===
document.addEventListener('click', function(e) {
    const overlay = document.getElementById('race-selector-overlay');
    const container = document.querySelector('.race-selector-container');
    
    if (overlay && e.target === overlay && !container.contains(e.target)) {
        closeRaceSelector();
    }
});

// === FECHA OVERLAY COM ESC ===
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const overlay = document.getElementById('race-selector-overlay');
        if (overlay && overlay.style.display === 'block') {
            closeRaceSelector();
        }
    }
});

// === EXPORTA FUNÇÕES ÚTEIS PARA O CONSOLE ===
window.WuitalurSystem = {
    highlightAttribute,
    openRaceSelector,
    closeRaceSelector,
    scrollToRace,
    version: '1.3.4',
    author: 'Sistema Autoral',
    
    // Função de debug para testar navegação
    testScrollToRace: function(raceId) {
        console.log('🧪 Testando navegação para:', raceId);
        const imageElement = document.getElementById(raceId + '-image');
        const sectionElement = document.getElementById(raceId);
        
        console.log('Elemento imagem:', imageElement);
        console.log('Elemento seção:', sectionElement);
        
        if (imageElement) {
            console.log('offsetTop da imagem:', imageElement.offsetTop);
            console.log('getBoundingClientRect da imagem:', imageElement.getBoundingClientRect());
        }
        
        if (sectionElement) {
            console.log('offsetTop da seção:', sectionElement.offsetTop);
            console.log('getBoundingClientRect da seção:', sectionElement.getBoundingClientRect());
        }
        
        scrollToRace(raceId);
    },
    
    // Lista todos os elementos de raças disponíveis
    listRaceElements: function() {
        console.log('📋 Elementos de raças disponíveis:');
        const imageElements = document.querySelectorAll('[id$="-image"]');
        const raceElements = document.querySelectorAll('#abissais, #akivus, #vampiros, #hibridos, #praguentos, #humanos, #insectoides, #exos, #espectros');
        
        console.log('Imagens das raças:', imageElements);
        console.log('Seções das raças:', raceElements);
        
        return {
            images: imageElements,
            sections: raceElements
        };
    }
};

// Teste de depuração
console.log('📝 Script carregado! Testando funções...');
console.log('openRaceSelector disponível:', typeof openRaceSelector);
console.log('closeRaceSelector disponível:', typeof closeRaceSelector);
console.log('scrollToRace disponível:', typeof scrollToRace);

// Teste imediato após carregamento
setTimeout(() => {
    console.log('🔍 Verificando elementos após carregamento...');
    window.WuitalurSystem.listRaceElements();
}, 1000);
