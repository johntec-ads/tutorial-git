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
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
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

    /**
     * Progress Timeline Navigation
     * Permite ao usuário navegar entre as principais seções do tutorial
     * e destaca visualmente a seção atual
     */
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Mapeamento dos itens da timeline para seções/páginas correspondentes
    const timelineMappings = {
        'Introdução': 'index.html#tutorial-inicio',
        'Básico': 'index.html#git-commits',
        'Branches': 'index.html#criando-branch',
        'Merge/Rebase': 'git-rebase.html',
        'Avançado': 'git-tags.html',
        'GitHub': 'github-actions.html',
        'CI/CD': 'index.html#github-actions'
    };

    // Determina qual item da timeline deve estar ativo com base na URL atual
    function updateActiveTimelineItem() {
        const currentPath = window.location.pathname;
        const currentHash = window.location.hash;
        
        // Condição padrão - nenhum item ativo
        let activeFound = false;
        
        timelineItems.forEach(item => {
            const itemText = item.textContent.trim();
            const mappedPath = timelineMappings[itemText] || '';
            
            // Verifica se estamos na página correspondente a este item
            if (
                (currentPath.includes('index.html') && mappedPath.startsWith('index.html') && 
                (currentHash === '' || mappedPath.includes(currentHash))) ||
                (currentPath.includes('git-rebase.html') && itemText === 'Merge/Rebase') ||
                (currentPath.includes('git-cherry-pick.html') && itemText === 'Merge/Rebase') ||
                (currentPath.includes('git-tags.html') && itemText === 'Avançado') ||
                (currentPath.includes('git-stash.html') && itemText === 'Avançado') ||
                (currentPath.includes('git-hooks.html') && itemText === 'Avançado') ||
                (currentPath.includes('git-submodules.html') && itemText === 'Avançado') ||
                (currentPath.includes('git-flow.html') && itemText === 'Avançado') ||
                (currentPath.includes('github-actions.html') && itemText === 'GitHub')
            ) {
                item.classList.add('active');
                activeFound = true;
            } else {
                item.classList.remove('active');
            }
        });
        
        // Se nenhum item foi marcado como ativo, ativa o primeiro por padrão
        if (!activeFound && timelineItems.length > 0) {
            timelineItems[0].classList.add('active');
        }
    }
    
    // Adiciona navegação aos itens da timeline
    timelineItems.forEach(item => {
        const itemText = item.textContent.trim();
        const destination = timelineMappings[itemText] || '#';
        
        // Torna os itens clicáveis
        item.style.cursor = 'pointer';
        item.setAttribute('role', 'link');
        item.setAttribute('aria-label', `Navegar para seção ${itemText}`);
        item.setAttribute('tabindex', '0');
        
        // Adiciona evento de clique
        item.addEventListener('click', () => {
            window.location.href = destination;
        });
        
        // Adiciona navegação por teclado
        item.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                window.location.href = destination;
            }
        });
    });
    
    // Atualiza o item ativo na timeline quando a página carrega
    updateActiveTimelineItem();
    
    // Atualiza também quando o hash da URL muda
    window.addEventListener('hashchange', updateActiveTimelineItem);
    
    // Verificar se o script está sendo executado
    console.log('Script carregado - Timeline deve estar ativa');

    // Garantir que a timeline esteja visível e funcional
    if (timelineItems.length > 0) {
        console.log('Timeline encontrada com ' + timelineItems.length + ' itens');
        
        // Garantir que pelo menos um item esteja ativo
        let anyActive = false;
        timelineItems.forEach(item => {
            if (item.classList.contains('active')) {
                anyActive = true;
                console.log('Item ativo encontrado: ' + item.textContent);
            }
        });
        
        if (!anyActive && timelineItems.length > 0) {
            console.log('Nenhum item ativo encontrado, ativando o primeiro');
            timelineItems[0].classList.add('active');
        }
    } else {
        console.warn('Timeline não encontrada no DOM');
    }
});
