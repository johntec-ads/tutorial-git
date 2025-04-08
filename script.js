/**
 * Script Principal - Tutorial Git
 * 
 * Este arquivo controla as funcionalidades interativas principais do tutorial,
 * incluindo o comportamento do FAQ, botão de retorno ao topo, gerenciamento de tema
 * e menu responsivo para dispositivos móveis.
 * 
 * O script é carregado de forma assíncrona para melhorar o desempenho da página.
 */

document.addEventListener('DOMContentLoaded', () => {
    /**
     * Sistema de FAQ Interativo
     * Permite que os usuários abram/fechem itens de perguntas frequentes
     * com suporte a acessibilidade
     */
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const wasActive = item.classList.contains('active');
            
            // Fecha todas as respostas
            faqItems.forEach(i => i.classList.remove('active'));
            
            // Abre a resposta clicada (se não estava aberta)
            if (!wasActive) {
                item.classList.add('active');
            }
        });
        
        // Adiciona suporte a teclado para acessibilidade
        question.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
        
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
    });

    /**
     * Botão Voltar ao Topo
     * Aparece quando o usuário rola para baixo e permite retornar
     * ao início da página suavemente
     */
    const btnVoltar = document.getElementById('voltar-topo');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btnVoltar.classList.add('visible');
        } else {
            btnVoltar.classList.remove('visible');
        }
    });

    btnVoltar.addEventListener('click', () => {
        // Solução para garantir que a página role completamente até o topo
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        
        // Verificação adicional para garantir que chegue ao topo
        // em casos onde o comportamento smooth pode não funcionar perfeitamente
        setTimeout(() => {
            if (window.scrollY > 0) {
                window.scrollTo(0, 0);
            }
        }, 1000); // Espera 1 segundo após a animação de rolagem
    });

    // Atualiza aria-expanded nos FAQs para acessibilidade
    document.querySelectorAll('.faq-question').forEach(question => {
        question.setAttribute('aria-expanded', 'false');
        
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
        });
    });

    /**
     * Sistema de Alternância de Tema (Claro/Escuro)
     * Mantém a preferência do usuário no localStorage
     */
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        // Inicializar o tema com preferência salva ou padrão
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌓';

        // Adicionar evento de clique para alternar tema
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌓';
            
            console.log('Tema alterado para:', newTheme); // Debug
        });
    }

    /**
     * Menu Hambúrguer para Dispositivos Móveis
     * Implementa navegação responsiva que se adapta a telas pequenas
     */
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o evento se propague
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
            
            // Melhoria para acessibilidade
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true' || false;
            menuToggle.setAttribute('aria-expanded', !expanded);
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            });
        });

        // Fechar menu ao clicar fora da área de navegação
        document.addEventListener('click', (e) => {
            if (menuToggle.classList.contains('active') && 
                !navLinks.contains(e.target) && 
                !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Inicializar o estado do menu
        menuToggle.setAttribute('aria-expanded', 'false');
    }
    
    // Ajuste de viewport para dispositivos móveis
    function adjustViewportForMobile() {
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        if (viewportMeta && window.innerWidth <= 768) {
            // Garante que o zoom inicial esteja adequado para dispositivos móveis
            viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=5.0');
        }
    }
    
    // Chamar ajuste ao carregar
    adjustViewportForMobile();
    
    // E também ao redimensionar (em caso de rotação do dispositivo)
    window.addEventListener('resize', adjustViewportForMobile);
});
