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
     * Sistema de Tema Automático Baseado no Horário
     * Define tema claro durante o dia (6h-18h) e escuro à noite
     */
    function setAutomaticTheme() {
        const now = new Date();
        const hour = now.getHours();
        const theme = (hour >= 6 && hour < 18) ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        console.log('Tema automático definido para:', theme, 'às', hour, 'horas');
    }

    // Definir tema inicial
    setAutomaticTheme();

    // Atualizar tema a cada hora
    setInterval(setAutomaticTheme, 60 * 60 * 1000); // 1 hora

    /**
     * Menu Hambúrguer para Dispositivos Móveis
     * Implementa navegação responsiva que se adapta a telas pequenas
     */
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Impede que o evento se propague
            const willOpen = !menuToggle.classList.contains('active');
            menuToggle.classList.toggle('active');
            navLinks.classList.toggle('active');

            // Atualiza atributos ARIA para acessibilidade
            menuToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
            navLinks.setAttribute('aria-hidden', willOpen ? 'false' : 'true');
            // Coloca foco no primeiro link quando abrir
            if (willOpen) {
                const firstLink = navLinks.querySelector('a');
                if (firstLink) firstLink.focus();
            }
        });

        // Fechar menu ao clicar em um link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinks.setAttribute('aria-hidden', 'true');
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
                navLinks.setAttribute('aria-hidden', 'true');
            }
        });
        
        // Inicializar o estado do menu
        menuToggle.setAttribute('aria-expanded', 'false');
        navLinks.setAttribute('aria-hidden', 'true');

        // Fechar menu com tecla Escape para acessibilidade
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' || e.key === 'Esc') {
                if (menuToggle.classList.contains('active')) {
                    menuToggle.classList.remove('active');
                    navLinks.classList.remove('active');
                    menuToggle.setAttribute('aria-expanded', 'false');
                    navLinks.setAttribute('aria-hidden', 'true');
                    menuToggle.focus();
                }
            }
        });
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

/**
 * Simulador de Terminal Git
 * Permite praticar comandos Git em um ambiente simulado
 */
document.addEventListener('DOMContentLoaded', () => {
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    const runCommand = document.getElementById('run-command');

    if (terminalOutput && terminalInput && runCommand) {
        // Estado simulado do repositório
        let currentBranch = 'main';
        let stagedFiles = [];
        let commits = ['Initial commit'];

        const simulatedResponses = {
            'git status': () => `On branch ${currentBranch}\n\nChanges to be committed:\n${stagedFiles.length ? stagedFiles.map(f => `  new file:   ${f}`).join('\n') : '  (working tree clean)'}\n\nUntracked files:\n  (use "git add <file>..." to include in what will be committed)\n\ttest.txt\n`,
            'git add .': () => { stagedFiles.push('test.txt'); return 'Added test.txt to staging area'; },
            'git commit -m': (msg) => { commits.push(msg); stagedFiles = []; return `Committed: ${msg}`; },
            'git log --oneline': () => commits.map((c, i) => `${'a'.repeat(7)}${i} ${c}`).join('\n'),
            'git branch': () => `* ${currentBranch}`,
            'git checkout -b': (branch) => { currentBranch = branch; return `Switched to a new branch '${branch}'`; },
            'clear': () => { terminalOutput.innerHTML = ''; return ''; }
        };

        const executeCommand = (cmd) => {
            const parts = cmd.trim().split(' ');
            const command = parts[0] + (parts[1] ? ' ' + parts[1] : '');
            const arg = parts.slice(2).join(' ');

            if (simulatedResponses[command]) {
                return simulatedResponses[command](arg);
            } else {
                return `git: '${command}' is not a git command. See 'git --help'.`;
            }
        };

        runCommand.addEventListener('click', () => {
            const cmd = terminalInput.value;
            if (cmd) {
                terminalOutput.innerHTML += `<div>$ ${cmd}</div>`;
                const response = executeCommand(cmd);
                if (response) {
                    terminalOutput.innerHTML += `<div>${response}</div>`;
                }
                terminalOutput.innerHTML += '<div>&nbsp;</div>';
                terminalInput.value = '';
                terminalOutput.scrollTop = terminalOutput.scrollHeight;
            }
        });

        terminalInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                runCommand.click();
            }
        });
    }
});

/**
 * Integração com GitHub API
 * Permite buscar informações de repositórios
 */
document.addEventListener('DOMContentLoaded', () => {
    const repoSearch = document.getElementById('repo-search');
    const searchRepo = document.getElementById('search-repo');
    const repoResults = document.getElementById('repo-results');

    if (repoSearch && searchRepo && repoResults) {
        searchRepo.addEventListener('click', async () => {
            const repo = repoSearch.value.trim();
            if (!repo) return;

            try {
                const response = await fetch(`https://api.github.com/repos/${repo}`);
                if (response.ok) {
                    const data = await response.json();
                    repoResults.innerHTML = `
                        <div style="border: 1px solid #ddd; padding: 1rem; border-radius: 8px; margin: 1rem 0;">
                            <h3><a href="${data.html_url}" target="_blank">${data.full_name}</a></h3>
                            <p>${data.description || 'Sem descrição'}</p>
                            <p>⭐ ${data.stargazers_count} | 🍴 ${data.forks_count} | 📝 ${data.language}</p>
                            <p>Último commit: ${new Date(data.updated_at).toLocaleDateString('pt-BR')}</p>
                        </div>
                    `;
                } else {
                    repoResults.innerHTML = '<p>Repositório não encontrado.</p>';
                }
            } catch (error) {
                repoResults.innerHTML = '<p>Erro ao buscar repositório.</p>';
            }
        });

        repoSearch.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchRepo.click();
            }
        });
    }
});
