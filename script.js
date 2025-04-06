document.addEventListener('DOMContentLoaded', () => {
    // FAQ interativo
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
        
        // Adiciona suporte a teclado
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

    // Botão Voltar ao Topo
    const btnVoltar = document.getElementById('voltar-topo');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btnVoltar.classList.add('visible');
        } else {
            btnVoltar.classList.remove('visible');
        }
    });

    btnVoltar.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Atualiza aria-expanded nos FAQs
    document.querySelectorAll('.faq-question').forEach(question => {
        question.setAttribute('aria-expanded', 'false');
        
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            question.setAttribute('aria-expanded', !isExpanded);
        });
    });

    // Gerenciamento do tema
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        // Inicializar o tema
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌓';

        // Adicionar evento de clique
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌓';
            
            console.log('Tema alterado para:', newTheme); // Debug
        });
    }

    // Menu Hamburguer
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });

        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }
});
