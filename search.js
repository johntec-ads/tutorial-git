function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        if (query.length < 2) {
            searchResults.style.display = 'none';
            return;
        }

        const allContent = document.querySelectorAll('h1, h2, h3, p, li');
        const matches = [];

        allContent.forEach(element => {
            if (element.textContent.toLowerCase().includes(query)) {
                matches.push({
                    text: element.textContent,
                    href: `#${element.closest('section')?.id || ''}`
                });
            }
        });

        displayResults(matches);
    });
}

function displayResults(matches) {
    const searchResults = document.getElementById('search-results');
    searchResults.innerHTML = '';
    searchResults.style.display = matches.length ? 'block' : 'none';

    matches.forEach(match => {
        const result = document.createElement('a');
        result.href = match.href;
        result.textContent = match.text;
        searchResults.appendChild(result);
    });
}

document.addEventListener('DOMContentLoaded', initSearch);
