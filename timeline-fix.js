/**
 * Correção para Timeline - Tutorial Git
 * 
 * Este arquivo fornece uma inicialização de fallback para a timeline
 * caso o script principal não consiga inicializá-la corretamente.
 */

(function() {
    // Executa apenas depois que o documento for carregado
    window.addEventListener('load', function() {
        console.log('Script de correção da timeline carregado');
        
        setTimeout(function() {
            // Verifica se algum item da timeline já está ativo (definido pelo script principal)
            const timelineElements = document.querySelectorAll('.timeline-item');
            let activeFound = false;
            
            timelineElements.forEach(function(item) {
                if (item.classList.contains('active')) {
                    activeFound = true;
                }
                
                // Só adiciona eventos se o item não tiver um evento de clique
                if (!item._hasTimelineClickEvent) {
                    item._hasTimelineClickEvent = true;
                    
                    item.addEventListener('click', function() {
                        const text = this.textContent.trim();
                        let destination = '#';
                        
                        // Mapeamento simplificado
                        if (text === 'Introdução') destination = 'index.html#tutorial-inicio';
                        else if (text === 'Básico') destination = 'index.html#git-commits';
                        else if (text === 'Branches') destination = 'index.html#criando-branch';
                        else if (text === 'Merge/Rebase') destination = 'git-rebase.html';
                        else if (text === 'Avançado') destination = 'git-tags.html';
                        else if (text === 'GitHub') destination = 'github-actions.html';
                        else if (text === 'CI/CD') destination = 'index.html#github-actions';
                        
                        window.location.href = destination;
                    });
                }
            });
            
            // Se nenhum item estiver ativo, ativa o apropriado com base na URL
            if (!activeFound && timelineElements.length > 0) {
                const path = window.location.pathname;
                
                if (path.includes('git-rebase.html') || path.includes('git-cherry-pick.html')) {
                    // Ativa "Merge/Rebase"
                    timelineElements.forEach(function(item) {
                        if (item.textContent.trim() === 'Merge/Rebase') {
                            item.classList.add('active');
                        }
                    });
                } else if (path.includes('git-tags.html') || path.includes('git-stash.html') ||
                          path.includes('git-hooks.html') || path.includes('git-submodules.html') ||
                          path.includes('git-flow.html')) {
                    // Ativa "Avançado"
                    timelineElements.forEach(function(item) {
                        if (item.textContent.trim() === 'Avançado') {
                            item.classList.add('active');
                        }
                    });
                } else if (path.includes('github-actions.html')) {
                    // Ativa "GitHub"
                    timelineElements.forEach(function(item) {
                        if (item.textContent.trim() === 'GitHub') {
                            item.classList.add('active');
                        }
                    });
                } else {
                    // Por padrão, ativa "Introdução"
                    timelineElements[0].classList.add('active');
                }
            }
        }, 500); // Aguarda meio segundo para garantir que o script principal teve chance de ser executado
    });
})();
