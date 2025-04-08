/**
 * Módulo de Pesquisa - Tutorial Git
 * 
 * Este arquivo implementa a funcionalidade de busca em tempo real no tutorial,
 * permitindo que os usuários encontrem rapidamente conteúdo específico.
 * 
 * Características:
 * - Pesquisa com debounce para melhor performance
 * - Destaque do termo pesquisado nos resultados
 * - Navegação direta para a seção correspondente
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos DOM principais
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    // Seleção de todos os elementos que podem ser pesquisados
    const searchableElements = document.querySelectorAll('h1, h2, h3, p, li');
    let debounceTimer;

    /**
     * Manipula evento de entrada do usuário com debounce
     * para evitar muitas pesquisas durante a digitação rápida
     */
    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            
            // Ignora pesquisas muito curtas
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }

            // Procura por correspondências no conteúdo
            const matches = [];
            searchableElements.forEach(element => {
                if (element.textContent.toLowerCase().includes(query)) {
                    // Encontra o id da seção mais próxima
                    let section = element.closest('section, div[id], h1[id], h2[id], h3[id]');
                    let id = section ? section.id : '';
                    
                    // Limita o texto para exibição
                    let text = element.textContent;
                    if (text.length > 100) {
                        text = text.substring(0, 100) + '...';
                    }

                    matches.push({
                        text,
                        id,
                        elementType: element.tagName.toLowerCase()
                    });
                }
            });

            displayResults(matches, query);
        }, 300); // 300ms de debounce
    });

    /**
     * Exibe os resultados da pesquisa na interface
     * @param {Array} matches - Resultados encontrados
     * @param {string} query - Termo pesquisado
     */
    function displayResults(matches, query) {
        searchResults.innerHTML = '';
        
        if (matches.length === 0) {
            searchResults.innerHTML = '<div class="no-results">Nenhum resultado encontrado</div>';
            searchResults.style.display = 'block';
            return;
        }

        // Exibe até 5 resultados mais relevantes
        matches.slice(0, 5).forEach(match => {
            const result = document.createElement('a');
            result.href = match.id ? `#${match.id}` : '#';
            
            // Destaca o termo pesquisado no texto
            const highlightedText = match.text.replace(
                new RegExp(query, 'gi'),
                match => `<strong>${match}</strong>`
            );
            
            result.innerHTML = highlightedText;
            
            result.addEventListener('click', () => {
                searchResults.style.display = 'none';
                searchInput.value = '';
            });
            
            searchResults.appendChild(result);
        });

        searchResults.style.display = 'block';
    }

    // Fecha resultados ao clicar fora da área de pesquisa
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
});
