/**
 * Service Worker - Tutorial Git
 * 
 * Este Service Worker fornece funcionalidade offline e melhor desempenho
 * através do cache de recursos essenciais. Ele implementa uma estratégia
 * "Cache First" para servir arquivos rapidamente quando disponíveis no cache.
 * 
 * Versão: v1
 */

// Incrementar a versão do cache para forçar atualização em deploys
const CACHE_NAME = 'git-tutorial-v2';
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
// Faz o novo Service Worker ativar imediatamente
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

/**
 * Evento de fetch (interceptação de requisições)
 * Implementa estratégia "Cache First" - Tenta cache primeiro, 
 * recorre à rede se recurso não estiver em cache
 */
self.addEventListener('fetch', event => {
    // Estratégia híbrida: Network-first para HTML/CSS/JS críticos,
    // cache-first para images e outros assets.
    const url = new URL(event.request.url);
    const isNavigation = event.request.mode === 'navigate' || event.request.destination === 'document';
    const isStaticAsset = /\.(?:js|css|html)$/.test(url.pathname);
    const isImage = /\.(?:png|jpg|jpeg|gif|webp|svg)$/.test(url.pathname);

    if (isNavigation || isStaticAsset) {
        // Network first: tenta rede, se falhar usa cache
        event.respondWith(
            fetch(event.request).then(networkResponse => {
                // Atualiza o cache com a nova resposta
                if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
                    const copy = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                }
                return networkResponse;
            }).catch(() => caches.match(event.request))
        );
        return;
    }

    // Cache first for images and other requests
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(networkResponse => {
                if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
                    const copy = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
                }
                return networkResponse;
            }).catch(() => {
                // Se tudo falhar, tenta retornar um fallback (opcional)
                return response;
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
// Controla imediatamente os clientes quando o SW é ativado
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});
