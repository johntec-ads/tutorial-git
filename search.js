document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchableElements = document.querySelectorAll('h1, h2, h3, p, li');
    let debounceTimer;

    searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            const query = e.target.value.toLowerCase().trim();
            
            if (query.length < 2) {
                searchResults.style.display = 'none';
                return;
            }

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
        }, 300);
    });

    function displayResults(matches, query) {
        searchResults.innerHTML = '';
        
        if (matches.length === 0) {
            searchResults.innerHTML = '<div class="no-results">Nenhum resultado encontrado</div>';
            searchResults.style.display = 'block';
            return;
        }

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

    // Fecha resultados ao clicar fora
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
            searchResults.style.display = 'none';
        }
    });
});
