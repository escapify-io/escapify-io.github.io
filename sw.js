/**
 * Service Worker para Escapify
 * Permite funcionamiento offline y caché de recursos
 */

const CACHE_NAME = 'escapify-v1.3.1';
const RUNTIME_CACHE = 'escapify-runtime-v1';

// Recursos estáticos para cachear
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/generador.html',
    '/historial.html',
    '/recursos.html',
    '/cifrados.html',
    '/ayuda.html',
    '/crear-escape.html',
    '/404.html',
    '/assets/css/styles.css',
    '/assets/css/accessibility.css',
    '/assets/js/theme.js',
    '/assets/js/nav.js',
    '/assets/js/accessibility.js',
    '/assets/js/notifications.js',
    '/assets/js/favorites.js',
    '/assets/js/keyboard-shortcuts.js',
    '/assets/js/tags.js',
    '/assets/js/confirm-modal.js',
    '/assets/js/historial.js',
    '/assets/js/lock-types.js',
    '/assets/js/lock-system.js',
    '/assets/js/share.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js'
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    console.log('[SW] Instalando Service Worker...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] Cacheando recursos estáticos');
                return cache.addAll(STATIC_ASSETS.map(url => {
                    try {
                        return new Request(url, { mode: 'no-cors' });
                    } catch (e) {
                        return url;
                    }
                })).catch((error) => {
                    console.warn('[SW] Error cacheando algunos recursos:', error);
                    // Continuar aunque algunos recursos fallen
                    return Promise.resolve();
                });
            })
            .then(() => {
                console.log('[SW] Service Worker instalado correctamente');
                return self.skipWaiting(); // Activar inmediatamente
            })
    );
});

// Activación del Service Worker
self.addEventListener('activate', (event) => {
    console.log('[SW] Activando Service Worker...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Eliminar caches antiguos
                        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
                            console.log('[SW] Eliminando cache antiguo:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('[SW] Service Worker activado');
                return self.clients.claim(); // Tomar control de todas las páginas
            })
    );
});

// Estrategia de caché: Cache First, luego Network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Ignorar requests a APIs externas o que no sean GET
    if (request.method !== 'GET') {
        return;
    }

    // Ignorar requests a servicios externos que no queremos cachear
    // Permitir CDNs conocidos
    const allowedOrigins = [
        'cdnjs.cloudflare.com',
        'unpkg.com',
        'fonts.googleapis.com',
        'fonts.gstatic.com'
    ];
    
    if (url.origin !== self.location.origin && 
        !allowedOrigins.some(origin => url.href.includes(origin))) {
        return;
    }

    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                // Si está en caché, devolverlo
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Si no está en caché, hacer fetch y cachear
                return fetch(request)
                    .then((response) => {
                        // Solo cachear respuestas válidas
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        // Clonar la respuesta para cachearla
                        const responseToCache = response.clone();

                        // Cachear en runtime cache
                        caches.open(RUNTIME_CACHE)
                            .then((cache) => {
                                cache.put(request, responseToCache);
                            });

                        return response;
                    })
                    .catch((error) => {
                        console.error('[SW] Error en fetch:', error);
                        
                        // Si es una página HTML y falla, devolver la página offline o index
                        const acceptHeader = request.headers.get('accept') || '';
                        if (acceptHeader.includes('text/html')) {
                            return caches.match('/index.html') || caches.match('/404.html');
                        }
                        
                        // Para otros recursos, devolver una respuesta de error
                        return new Response('Recurso no disponible offline', {
                            status: 408,
                            headers: { 'Content-Type': 'text/plain' }
                        });
                    });
            })
    );
});

// Manejar mensajes del cliente
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
    
    if (event.data && event.data.type === 'CACHE_URLS') {
        event.waitUntil(
            caches.open(RUNTIME_CACHE)
                .then((cache) => {
                    return cache.addAll(event.data.urls);
                })
        );
    }
});

// Sincronización en background (para futuras funcionalidades)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-data') {
        event.waitUntil(
            // Aquí se podría implementar sincronización de datos
            Promise.resolve()
        );
    }
});

// Notificaciones push (para futuras funcionalidades)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json();
        const title = data.title || 'Escapify';
        const options = {
            body: data.body || 'Tienes una nueva notificación',
            icon: '/assets/images/icon-192x192.png',
            badge: '/assets/images/icon-72x72.png',
            vibrate: [200, 100, 200],
            tag: 'escapify-notification',
            requireInteraction: false
        };

        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    }
});

// Manejar clics en notificaciones
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    event.waitUntil(
        clients.openWindow('/')
    );
});

