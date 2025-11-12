/**
 * Sistema de notificaciones mejorado para Escapify
 * Soporta diferentes tipos, persistencia y auto-cierre
 */
class NotificationManager {
    constructor() {
        this.notifications = [];
        this.container = null;
        this.createContainer();
    }

    createContainer() {
        this.container = document.createElement('div');
        this.container.className = 'notifications-container';
        this.container.setAttribute('aria-live', 'polite');
        this.container.setAttribute('aria-atomic', 'true');
        document.body.appendChild(this.container);
    }

    /**
     * Muestra una notificación
     * @param {string} message - Mensaje a mostrar
     * @param {string} type - Tipo: 'success', 'error', 'warning', 'info'
     * @param {object} options - Opciones adicionales
     */
    show(message, type = 'info', options = {}) {
        const {
            duration = type === 'error' ? 6000 : 4000,
            persistent = false,
            action = null,
            actionLabel = null,
            icon = null
        } = options;

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.setAttribute('role', 'alert');
        notification.setAttribute('aria-live', 'assertive');

        // Icono por defecto según tipo
        const defaultIcons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const iconClass = icon || defaultIcons[type] || defaultIcons.info;

        let notificationHTML = `
            <div class="notification-content">
                <i class="fas ${iconClass}" aria-hidden="true"></i>
                <span class="notification-message">${this.escapeHtml(message)}</span>
            </div>
        `;

        if (action && actionLabel) {
            notificationHTML += `
                <button class="notification-action" aria-label="${actionLabel}">
                    ${this.escapeHtml(actionLabel)}
                </button>
            `;
        }

        if (!persistent) {
            notificationHTML += `
                <button class="notification-close" aria-label="Cerrar notificación">
                    <i class="fas fa-times" aria-hidden="true"></i>
                </button>
            `;
        }

        notification.innerHTML = notificationHTML;

        // Añadir acción si existe
        if (action && actionLabel) {
            const actionBtn = notification.querySelector('.notification-action');
            actionBtn.addEventListener('click', () => {
                action();
                this.remove(notification);
            });
        }

        // Botón cerrar
        if (!persistent) {
            const closeBtn = notification.querySelector('.notification-close');
            closeBtn.addEventListener('click', () => this.remove(notification));
        }

        this.container.appendChild(notification);
        this.notifications.push(notification);

        // Animación de entrada
        requestAnimationFrame(() => {
            notification.classList.add('notification-visible');
        });

        // Auto-remover si no es persistente
        if (!persistent && duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }

        return notification;
    }

    /**
     * Métodos de conveniencia
     */
    success(message, options = {}) {
        return this.show(message, 'success', options);
    }

    error(message, options = {}) {
        return this.show(message, 'error', options);
    }

    warning(message, options = {}) {
        return this.show(message, 'warning', options);
    }

    info(message, options = {}) {
        return this.show(message, 'info', options);
    }

    /**
     * Elimina una notificación
     */
    remove(notification) {
        if (!notification || !notification.parentNode) return;

        notification.classList.remove('notification-visible');
        notification.classList.add('notification-removing');

        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
            const index = this.notifications.indexOf(notification);
            if (index > -1) {
                this.notifications.splice(index, 1);
            }
        }, 300);
    }

    /**
     * Limpia todas las notificaciones
     */
    clear() {
        this.notifications.forEach(notification => {
            this.remove(notification);
        });
    }

    /**
     * Escapa HTML para prevenir XSS
     */
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Instancia global
window.notificationManager = new NotificationManager();

