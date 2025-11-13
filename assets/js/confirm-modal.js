/**
 * Sistema de modales de confirmación mejorado
 * Reemplaza los confirm() nativos con modales accesibles
 */
class ConfirmModal {
    constructor() {
        this.modal = null;
        this.resolve = null;
        this.createModal();
    }

    createModal() {
        // Crear el modal si no existe
        if (document.getElementById('confirmModal')) {
            this.modal = document.getElementById('confirmModal');
            return;
        }

        this.modal = document.createElement('div');
        this.modal.id = 'confirmModal';
        this.modal.className = 'confirm-modal';
        this.modal.setAttribute('role', 'dialog');
        this.modal.setAttribute('aria-labelledby', 'confirmModalTitle');
        this.modal.setAttribute('aria-modal', 'true');
        this.modal.innerHTML = `
            <div class="confirm-modal-overlay" aria-label="Cerrar"></div>
            <div class="confirm-modal-content">
                <div class="confirm-modal-header">
                    <h3 id="confirmModalTitle" class="confirm-modal-title">Confirmar acción</h3>
                    <button class="confirm-modal-close" aria-label="Cerrar" type="button">
                        <i class="fas fa-times" aria-hidden="true"></i>
                    </button>
                </div>
                <div class="confirm-modal-body">
                    <p id="confirmModalMessage" class="confirm-modal-message"></p>
                </div>
                <div class="confirm-modal-footer">
                    <button class="btn btn-secondary confirm-modal-cancel" type="button">Cancelar</button>
                    <button class="btn btn-danger confirm-modal-confirm" type="button">Confirmar</button>
                </div>
            </div>
        `;
        document.body.appendChild(this.modal);

        // Event listeners
        const overlay = this.modal.querySelector('.confirm-modal-overlay');
        const closeBtn = this.modal.querySelector('.confirm-modal-close');
        const cancelBtn = this.modal.querySelector('.confirm-modal-cancel');
        const confirmBtn = this.modal.querySelector('.confirm-modal-confirm');

        const close = () => {
            this.hide();
            if (this.resolve) {
                this.resolve(false);
            }
        };

        overlay.addEventListener('click', close);
        closeBtn.addEventListener('click', close);
        cancelBtn.addEventListener('click', close);
        confirmBtn.addEventListener('click', () => {
            this.hide();
            if (this.resolve) {
                this.resolve(true);
            }
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('visible')) {
                close();
            }
        });
    }

    show(title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', type = 'danger') {
        return new Promise((resolve) => {
            this.resolve = resolve;
            
            const titleEl = this.modal.querySelector('#confirmModalTitle');
            const messageEl = this.modal.querySelector('#confirmModalMessage');
            const confirmBtn = this.modal.querySelector('.confirm-modal-confirm');
            const cancelBtn = this.modal.querySelector('.confirm-modal-cancel');

            titleEl.textContent = title;
            messageEl.textContent = message;
            confirmBtn.textContent = confirmText;
            cancelBtn.textContent = cancelText;

            // Aplicar tipo de botón
            confirmBtn.className = `btn btn-${type} confirm-modal-confirm`;

            // Mostrar modal
            this.modal.classList.add('visible');
            document.body.style.overflow = 'hidden';

            // Focus en el botón de cancelar por defecto (más seguro)
            cancelBtn.focus();
        });
    }

    hide() {
        this.modal.classList.remove('visible');
        document.body.style.overflow = '';
    }
}

// Instancia global
window.confirmModal = new ConfirmModal();

// Función helper para compatibilidad
window.showConfirm = (title, message, confirmText, cancelText, type) => {
    return window.confirmModal.show(title, message, confirmText, cancelText, type);
};

