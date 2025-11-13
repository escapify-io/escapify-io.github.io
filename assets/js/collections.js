/**
 * Sistema de colecciones/grupos para organizar candados
 * Permite crear colecciones y agrupar candados por proyectos
 */
class CollectionsManager {
    constructor() {
        this.storageKey = 'escapify_collections';
        this.collections = this.loadCollections();
    }

    loadCollections() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error cargando colecciones:', error);
            return [];
        }
    }

    saveCollections() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.collections));
        } catch (error) {
            console.error('Error guardando colecciones:', error);
        }
    }

    // Crear una nueva colección
    createCollection(name, description = '', color = null) {
        const collection = {
            id: Date.now(),
            name: name.trim(),
            description: description.trim(),
            color: color || this.getRandomColor(),
            lockIds: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.collections.push(collection);
        this.saveCollections();
        return collection;
    }

    // Obtener color aleatorio para colección
    getRandomColor() {
        const colors = [
            '#0252CD', '#2D7FF9', '#10B981', '#F59E0B', '#EF4444',
            '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    // Obtener todas las colecciones
    getAllCollections() {
        return [...this.collections].sort((a, b) => 
            new Date(b.updatedAt) - new Date(a.updatedAt)
        );
    }

    // Obtener una colección por ID
    getCollection(id) {
        return this.collections.find(c => c.id?.toString() === id?.toString());
    }

    // Actualizar una colección
    updateCollection(id, updates) {
        const collection = this.getCollection(id);
        if (!collection) return false;

        Object.assign(collection, updates);
        collection.updatedAt = new Date().toISOString();
        this.saveCollections();
        return true;
    }

    // Eliminar una colección
    deleteCollection(id) {
        const index = this.collections.findIndex(c => c.id?.toString() === id?.toString());
        if (index === -1) return false;

        this.collections.splice(index, 1);
        this.saveCollections();
        return true;
    }

    // Añadir candado a colección
    addLockToCollection(lockId, collectionId) {
        const collection = this.getCollection(collectionId);
        if (!collection) return false;

        if (!collection.lockIds.includes(lockId)) {
            collection.lockIds.push(lockId);
            collection.updatedAt = new Date().toISOString();
            this.saveCollections();
            return true;
        }
        return false;
    }

    // Eliminar candado de colección
    removeLockFromCollection(lockId, collectionId) {
        const collection = this.getCollection(collectionId);
        if (!collection) return false;

        const index = collection.lockIds.indexOf(lockId);
        if (index > -1) {
            collection.lockIds.splice(index, 1);
            collection.updatedAt = new Date().toISOString();
            this.saveCollections();
            return true;
        }
        return false;
    }

    // Obtener colecciones de un candado
    getLockCollections(lockId) {
        return this.collections.filter(c => c.lockIds.includes(lockId));
    }

    // Obtener candados de una colección
    getCollectionLocks(collectionId) {
        const collection = this.getCollection(collectionId);
        if (!collection) return [];

        const history = JSON.parse(localStorage.getItem('lockHistory') || '[]');
        return history.filter(lock => collection.lockIds.includes(lock.id));
    }

    // Renderizar colecciones en un contenedor
    renderCollections(container, options = {}) {
        if (!container) return;

        const {
            showEmpty = true,
            clickable = true,
            onSelect = null,
            selectedId = null
        } = options;

        const collections = this.getAllCollections();

        if (collections.length === 0 && showEmpty) {
            container.innerHTML = '<p class="empty-collections">No hay colecciones. Crea una para organizar tus candados.</p>';
            return;
        }

        container.innerHTML = collections.map(collection => {
            const lockCount = collection.lockIds.length;
            const isSelected = selectedId && collection.id?.toString() === selectedId?.toString();
            
            return `
                <div class="collection-card ${isSelected ? 'selected' : ''}" 
                     data-collection-id="${collection.id}"
                     ${clickable ? 'role="button" tabindex="0"' : ''}>
                    <div class="collection-header">
                        <div class="collection-color" style="background-color: ${collection.color}"></div>
                        <div class="collection-info">
                            <h3 class="collection-name">${this.escapeHtml(collection.name)}</h3>
                            <p class="collection-meta">
                                ${lockCount} candado${lockCount !== 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>
                    ${collection.description ? `<p class="collection-description">${this.escapeHtml(collection.description)}</p>` : ''}
                    <div class="collection-actions">
                        <button class="btn-icon collection-edit" data-action="edit" data-id="${collection.id}" aria-label="Editar colección">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon collection-delete" data-action="delete" data-id="${collection.id}" aria-label="Eliminar colección">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');

        // Event listeners
        if (clickable && onSelect) {
            container.querySelectorAll('.collection-card').forEach(card => {
                card.addEventListener('click', (e) => {
                    if (!e.target.closest('.collection-actions')) {
                        const id = card.dataset.collectionId;
                        onSelect(id);
                    }
                });
            });
        }

        // Botones de acción
        container.querySelectorAll('.collection-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                if (options.onEdit) {
                    options.onEdit(id);
                }
            });
        });

        container.querySelectorAll('.collection-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.dataset.id;
                if (options.onDelete) {
                    options.onDelete(id);
                }
            });
        });
    }

    // Crear modal para nueva colección
    showCreateCollectionModal(onCreate) {
        const modal = document.createElement('div');
        modal.className = 'confirm-modal visible';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'collectionModalTitle');
        modal.innerHTML = `
            <div class="confirm-modal-overlay"></div>
            <div class="confirm-modal-content" style="max-width: 500px;">
                <div class="confirm-modal-header">
                    <h3 id="collectionModalTitle" class="confirm-modal-title">Nueva Colección</h3>
                    <button class="confirm-modal-close" aria-label="Cerrar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="confirm-modal-body">
                    <div class="form-group">
                        <label for="collectionName">Nombre de la colección <span class="required">*</span></label>
                        <input type="text" id="collectionName" placeholder="Ej: Escape Room Matemáticas 3º ESO" required>
                    </div>
                    <div class="form-group">
                        <label for="collectionDescription">Descripción</label>
                        <textarea id="collectionDescription" rows="3" placeholder="Describe el propósito de esta colección"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="collectionColor">Color</label>
                        <div class="color-picker">
                            ${this.getColorOptions().map(color => `
                                <button type="button" class="color-option" data-color="${color}" style="background-color: ${color}" aria-label="Color ${color}">
                                    <i class="fas fa-check" style="display: none;"></i>
                                </button>
                            `).join('')}
                        </div>
                        <input type="hidden" id="collectionColor" value="${this.getRandomColor()}">
                    </div>
                </div>
                <div class="confirm-modal-footer">
                    <button class="btn btn-secondary confirm-modal-cancel">Cancelar</button>
                    <button class="btn btn-primary confirm-modal-confirm">Crear</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const nameInput = modal.querySelector('#collectionName');
        const descInput = modal.querySelector('#collectionDescription');
        const colorInput = modal.querySelector('#collectionColor');
        const colorOptions = modal.querySelectorAll('.color-option');

        // Selección de color
        colorOptions.forEach(option => {
            option.addEventListener('click', () => {
                colorOptions.forEach(opt => {
                    opt.querySelector('i').style.display = 'none';
                    opt.classList.remove('selected');
                });
                option.querySelector('i').style.display = 'block';
                option.classList.add('selected');
                colorInput.value = option.dataset.color;
            });
        });

        // Seleccionar primer color por defecto
        if (colorOptions[0]) {
            colorOptions[0].click();
        }

        const close = () => {
            modal.remove();
            document.body.style.overflow = '';
        };

        const create = () => {
            const name = nameInput.value.trim();
            if (!name) {
                if (window.notificationManager) {
                    window.notificationManager.error('El nombre es obligatorio');
                }
                nameInput.focus();
                return;
            }

            const collection = this.createCollection(
                name,
                descInput.value.trim(),
                colorInput.value
            );

            if (onCreate) {
                onCreate(collection);
            }

            if (window.notificationManager) {
                window.notificationManager.success(`Colección "${collection.name}" creada`);
            }

            close();
        };

        modal.querySelector('.confirm-modal-close').addEventListener('click', close);
        modal.querySelector('.confirm-modal-overlay').addEventListener('click', close);
        modal.querySelector('.confirm-modal-cancel').addEventListener('click', close);
        modal.querySelector('.confirm-modal-confirm').addEventListener('click', create);

        // Enter para crear
        nameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                create();
            }
        });

        document.body.style.overflow = 'hidden';
        nameInput.focus();
    }

    getColorOptions() {
        return [
            '#0252CD', '#2D7FF9', '#10B981', '#F59E0B', '#EF4444',
            '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316',
            '#6366F1', '#14B8A6', '#F43F5E', '#A855F7', '#3B82F6'
        ];
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Instancia global
window.collectionsManager = new CollectionsManager();

