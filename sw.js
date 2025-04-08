/**
 * Service Worker - Tutorial Git
 * 
 * Este Service Worker fornece funcionalidade offline e melhor desempenho
 * através do cache de recursos essenciais. Ele implementa uma estratégia
 * "Cache First" para servir arquivos rapidamente quando disponíveis no cache.
 * 
 * Versão: v1
 */

const CACHE_NAME = 'git-tutorial-v1';
const urlsToCache = [
    '/',
    '/tutorial.html',
    '/styles.css',
    '/timeline.css',
    '/script.js',
    '/search.js',
    '/exercises.js',
    '/pwa.js',
    '/assets/favicon.png',
    // Recursos essenciais para funcionamento offline
    '/assets/site.webmanifest',
    '/assets/apple-touch-icon.png',
    '/assets/favicon-32x32.png',
    '/assets/favicon-16x16.png',
    '/assets/fivecon.png.jpeg'
];

/**
 * Evento de instalação do Service Worker
 * Pré-cacheia recursos essenciais durante a instalação
 */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Cache aberto com sucesso');
                return cache.addAll(urlsToCache);
            })
    );
});

/**
 * Evento de fetch (interceptação de requisições)
 * Implementa estratégia "Cache First" - Tenta cache primeiro, 
 * recorre à rede se recurso não estiver em cache
 */
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Retorna do cache se disponível
                if (response) {
                    return response;
                }
                // Caso contrário, busca da rede e atualiza o cache
                return fetch(event.request).then(networkResponse => {
                    // Não cacheia respostas de erro ou não-GET
                    if (!networkResponse || networkResponse.status !== 200 || 
                        networkResponse.type !== 'basic' || event.request.method !== 'GET') {
                        return networkResponse;
                    }
                    
                    // Clona a resposta para armazenar no cache
                    // (pois bodies só podem ser lidos uma vez)
                    const responseToCache = networkResponse.clone();
                    
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseToCache);
                    });
                    
                    return networkResponse;
                });
            })
    );
});

/**
 * Evento de ativação do Service Worker
 * Limpa caches antigos quando uma nova versão é ativada
 */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Removendo cache antigo:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
