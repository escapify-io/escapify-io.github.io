/**
 * PWA - Registro del Service Worker y funcionalidades PWA
 */
class PWAManager {
    constructor() {
        this.serviceWorkerRegistration = null;
        this.init();
    }

    async init() {
        if ('serviceWorker' in navigator) {
            try {
                await this.registerServiceWorker();
                this.setupUpdateCheck();
                this.setupInstallPrompt();
            } catch (error) {
                console.error('Error inicializando PWA:', error);
            }
        } else {
            console.log('Service Workers no soportados en este navegador');
        }
    }

    async registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            this.serviceWorkerRegistration = registration;
            console.log('[PWA] Service Worker registrado:', registration.scope);

            // Verificar actualizaciones
            registration.addEventListener('updatefound', () => {
                const newWorker = registration.installing;
                console.log('[PWA] Nueva versión del Service Worker encontrada');

                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // Hay una nueva versión disponible
                        this.showUpdateNotification();
                    }
                });
            });

            return registration;
        } catch (error) {
            console.error('[PWA] Error registrando Service Worker:', error);
            throw error;
        }
    }

    setupUpdateCheck() {
        // Verificar actualizaciones cada hora
        setInterval(() => {
            if (this.serviceWorkerRegistration) {
                this.serviceWorkerRegistration.update();
            }
        }, 60 * 60 * 1000); // 1 hora
    }

    setupInstallPrompt() {
        let deferredPrompt;

        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevenir el prompt automático
            e.preventDefault();
            deferredPrompt = e;

            // Mostrar botón de instalación personalizado
            this.showInstallButton(deferredPrompt);
        });

        // Detectar si ya está instalado
        window.addEventListener('appinstalled', () => {
            console.log('[PWA] Aplicación instalada');
            this.hideInstallButton();
            if (window.notificationManager) {
                window.notificationManager.success('¡Escapify instalado correctamente!');
            }
        });
    }

    showInstallButton(deferredPrompt) {
        // Crear botón de instalación si no existe
        let installBtn = document.getElementById('pwa-install-btn');
        
        if (!installBtn) {
            installBtn = document.createElement('button');
            installBtn.id = 'pwa-install-btn';
            installBtn.className = 'btn btn-primary pwa-install-btn';
            installBtn.innerHTML = '<i class="fas fa-download" aria-hidden="true"></i> Instalar Escapify';
            installBtn.setAttribute('aria-label', 'Instalar aplicación Escapify');
            
            // Añadir al header o a un contenedor específico
            const header = document.querySelector('.main-header');
            if (header) {
                const nav = header.querySelector('.nav-menu');
                if (nav) {
                    const li = document.createElement('li');
                    li.appendChild(installBtn);
                    nav.appendChild(li);
                }
            }
        }

        installBtn.style.display = 'flex';
        installBtn.addEventListener('click', async () => {
            // Mostrar el prompt de instalación
            deferredPrompt.prompt();
            
            const { outcome } = await deferredPrompt.userChoice;
            console.log('[PWA] Resultado de instalación:', outcome);
            
            if (outcome === 'accepted') {
                if (window.notificationManager) {
                    window.notificationManager.success('Instalando Escapify...');
                }
            }
            
            deferredPrompt = null;
            this.hideInstallButton();
        });
    }

    hideInstallButton() {
        const installBtn = document.getElementById('pwa-install-btn');
        if (installBtn) {
            installBtn.style.display = 'none';
        }
    }

    showUpdateNotification() {
        if (window.notificationManager) {
            window.notificationManager.info('Hay una nueva versión disponible. Recarga la página para actualizar.', {
                duration: 10000,
                action: {
                    label: 'Actualizar',
                    handler: () => {
                        this.updateServiceWorker();
                    }
                }
            });
        }
    }

    async updateServiceWorker() {
        if (this.serviceWorkerRegistration && this.serviceWorkerRegistration.waiting) {
            // Enviar mensaje al service worker para que se active
            this.serviceWorkerRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
            
            // Recargar la página
            window.location.reload();
        }
    }

    // Verificar si está en modo standalone (instalado)
    isStandalone() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone ||
               document.referrer.includes('android-app://');
    }

    // Obtener información de instalación
    getInstallInfo() {
        return {
            isInstalled: this.isStandalone(),
            canInstall: 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window,
            isOnline: navigator.onLine
        };
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.pwaManager = new PWAManager();
    
    // Mostrar estado de conexión
    window.addEventListener('online', () => {
        if (window.notificationManager) {
            window.notificationManager.success('Conexión restaurada');
        }
    });

    window.addEventListener('offline', () => {
        if (window.notificationManager) {
            window.notificationManager.warning('Modo offline activado. Algunas funcionalidades pueden estar limitadas.');
        }
    });
});

