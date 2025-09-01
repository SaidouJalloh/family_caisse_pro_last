// Service Worker pour Caissier Familial Pro PWA
const CACHE_NAME = 'caissier-pro-v1.0.0';
const OFFLINE_URL = '/offline.html';

// Fichiers à mettre en cache
const CACHE_URLS = [
    '/',
    '/static/js/bundle.js',
    '/static/css/main.css',
    '/manifest.json',
    '/favicon.ico',
    OFFLINE_URL
];

// Installation du Service Worker
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installation...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Cache ouvert');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => {
                console.log('Service Worker: Fichiers mis en cache');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('Service Worker: Erreur installation', error);
            })
    );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activation...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Service Worker: Suppression ancien cache', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log('Service Worker: Activé');
            return self.clients.claim();
        })
    );
});

// Stratégie de mise en cache : Network First avec Cache Fallback
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorer les requêtes non-HTTP
    if (!request.url.startsWith('http')) return;

    // Stratégie spéciale pour les requêtes Supabase
    if (url.origin.includes('supabase.co')) {
        event.respondWith(
            fetch(request)
                .catch(() => {
                    // En cas d'échec réseau, retourner une réponse d'erreur
                    return new Response(
                        JSON.stringify({ error: 'Mode hors ligne' }),
                        {
                            headers: { 'Content-Type': 'application/json' },
                            status: 503
                        }
                    );
                })
        );
        return;
    }

    // Pour les autres requêtes : Cache First pour les assets, Network First pour le reste
    if (request.destination === 'image' ||
        request.url.includes('/static/') ||
        request.url.includes('.css') ||
        request.url.includes('.js')) {

        // Cache First pour les assets statiques
        event.respondWith(
            caches.match(request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    return fetch(request).then((response) => {
                        const responseClone = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone);
                        });
                        return response;
                    });
                })
                .catch(() => {
                    // Fallback pour les assets
                    return caches.match('/favicon.ico');
                })
        );
    } else {
        // Network First pour les pages HTML
        event.respondWith(
            fetch(request)
                .then((response) => {
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                })
                .catch(() => {
                    return caches.match(request)
                        .then((cachedResponse) => {
                            if (cachedResponse) {
                                return cachedResponse;
                            }
                            // Fallback vers la page hors ligne
                            if (request.mode === 'navigate') {
                                return caches.match(OFFLINE_URL);
                            }
                            return new Response('Contenu non disponible hors ligne', {
                                status: 503,
                                statusText: 'Service Unavailable'
                            });
                        });
                })
        );
    }
});

// Gérer les messages du client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Notification de mise à jour disponible
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'GET_VERSION') {
        event.ports[0].postMessage({ version: CACHE_NAME });
    }
});