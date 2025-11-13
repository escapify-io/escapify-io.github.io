import { appendSharePayload, buildShareUrlFromPayload, ensureSharePayload } from './share.js';

class HistoryManager {
    constructor() {
        this.historyList = document.getElementById('historyList');
        this.searchInput = document.getElementById('searchInput');
        this.filterType = document.getElementById('filterType');
        this.filterDate = document.getElementById('filterDate');
        this.sortBy = document.getElementById('sortBy');
        this.importBtn = document.getElementById('importBtn');
        this.exportBtn = document.getElementById('exportBtn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.difficultyFilters = document.getElementById('difficultyFilters');
        this.tagsFilterContainer = document.getElementById('tagsFilterContainer');
        this.selectedTags = [];
        this.currentDifficulty = 'all';
        this.collectionsGrid = document.getElementById('collectionsGrid');
        this.createCollectionBtn = document.getElementById('createCollectionBtn');
        this.selectedCollection = null;

        this.initializeEventListeners();
        this.initializeTagsFilter();
        this.initializeCollections();
        this.loadHistory();
    }

    initializeEventListeners() {
        this.searchInput.addEventListener('input', () => this.filterHistory());
        this.filterType.addEventListener('change', () => this.filterHistory());
        this.filterDate.addEventListener('change', () => this.filterHistory());
        if (this.sortBy) {
            this.sortBy.addEventListener('change', () => this.filterHistory());
        }
        if (this.importBtn) {
            this.importBtn.addEventListener('click', () => this.importHistory());
        }
        this.exportBtn.addEventListener('click', () => this.exportHistory());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        
        if (this.createCollectionBtn) {
            this.createCollectionBtn.addEventListener('click', () => this.showCreateCollection());
        }
        this.difficultyFilters.addEventListener('click', (e) => {
            if (e.target.classList.contains('difficulty-filter-btn')) {
                this.difficultyFilters.querySelectorAll('.difficulty-filter-btn').forEach(btn => btn.classList.remove('active'));
                e.target.classList.add('active');
                this.currentDifficulty = e.target.dataset.difficulty;
                this.filterHistory();
            }
        });
    }

    loadHistory() {
        const savedHistory = localStorage.getItem('lockHistory');
        if (savedHistory) {
            try {
                const parsed = JSON.parse(savedHistory);
                this.history = parsed.map(item => appendSharePayload(item));
                localStorage.setItem('lockHistory', JSON.stringify(this.history));
                this.renderHistory(this.history);
            } catch (error) {
                console.error('No se pudo cargar el historial:', error);
                this.history = [];
                this.historyList.innerHTML = '<li class="empty-history">No hay candados en el historial</li>';
            }
        } else {
            this.history = [];
            this.historyList.innerHTML = '<li class="empty-history">No hay candados en el historial</li>';
        }
    }

    persistHistory() {
        localStorage.setItem('lockHistory', JSON.stringify(this.history));
    }

    renderHistory(historyItems) {
        if (historyItems.length === 0) {
            this.historyList.innerHTML = '<li class="empty-history">No hay candados en el historial</li>';
            return;
        }

        this.historyList.innerHTML = historyItems.map(item => {
            let badge = '';
            if (item.difficulty) {
                let label = item.difficulty === 'easy' ? 'Fácil' : item.difficulty === 'medium' ? 'Medio' : 'Difícil';
                badge = `<span class="difficulty-badge difficulty-${item.difficulty}">${label}</span>`;
            }
            
            // Verificar si es favorito
            const isFavorite = window.favoritesManager && window.favoritesManager.isLockFavorite(item.id);
            const favoriteClass = isFavorite ? 'active' : '';
            
            // Renderizar etiquetas
            let tagsHTML = '';
            if (item.tags && item.tags.length > 0 && window.tagsManager) {
                const tagsContainer = document.createElement('div');
                tagsContainer.className = 'history-item-tags';
                window.tagsManager.renderTags(tagsContainer, item.tags, { 
                    clickable: true,
                    maxTags: 3 
                });
                tagsHTML = tagsContainer.outerHTML;
            }

            // Renderizar colecciones
            const collectionsHTML = this.renderLockCollections(item.id);
            
            // Indicador de nota
            const hasNote = window.notesManager && window.notesManager.getNote(item.id);
            const noteIndicator = hasNote ? '<i class="fas fa-sticky-note note-indicator" title="Tiene notas" aria-label="Tiene notas"></i>' : '';
            
            // Estadísticas de uso
            const usageCount = item.usageCount || 0;
            const lastUsed = item.lastUsed ? new Date(item.lastUsed).toLocaleDateString() : null;
            const statsHTML = usageCount > 0 ? `
                <span class="history-item-stats" title="Usado ${usageCount} vez${usageCount !== 1 ? 'es' : ''}${lastUsed ? ` - Último uso: ${lastUsed}` : ''}">
                    <i class="fas fa-chart-line"></i> ${usageCount}
                </span>
            ` : '';

            return `
            <li class="history-item">
                <div class="history-item-content">
                    <button class="favorite-btn ${favoriteClass}" data-id="${item.id}" data-type="lock" aria-label="${isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}">
                        <i class="fas fa-star"></i>
                    </button>
                    <span class="history-item-name">${item.name}</span>
                    ${badge}
                    <span class="history-item-type">${this.getTypeLabel(item.type)}</span>
                    ${tagsHTML}
                    ${collectionsHTML}
                    ${noteIndicator}
                    ${statsHTML}
                    <span class="history-item-date">${new Date(item.timestamp).toLocaleString()}</span>
                </div>
                <div class="history-item-actions">
                    <button class="history-action-btn" data-action="copy" data-code="${item.code || ''}" aria-label="Copiar código">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="history-action-btn" data-action="open" data-id="${item.id}" aria-label="Abrir candado">
                        <i class="fas fa-play"></i>
                    </button>
                    <button class="history-action-btn" data-action="share" data-id="${item.id}" aria-label="Copiar enlace del candado">
                        <i class="fas fa-link"></i>
                    </button>
                    <button class="history-action-btn" data-action="duplicate" data-id="${item.id}" aria-label="Duplicar candado">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="history-action-btn" data-action="tags" data-id="${item.id}" aria-label="Gestionar etiquetas">
                        <i class="fas fa-tags"></i>
                    </button>
                    <button class="history-action-btn" data-action="collections" data-id="${item.id}" aria-label="Gestionar colecciones">
                        <i class="fas fa-folder"></i>
                    </button>
                    <button class="history-action-btn" data-action="notes" data-id="${item.id}" aria-label="Gestionar notas">
                        <i class="fas fa-sticky-note"></i>
                    </button>
                    <button class="history-action-btn btn-delete" data-action="delete" data-id="${item.id}" aria-label="Eliminar candado">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
            `;
        }).join('');

        // Event listeners para acciones
        this.historyList.querySelectorAll('.history-action-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                const action = event.currentTarget.dataset.action;
                const { id, code } = event.currentTarget.dataset;

                switch (action) {
                    case 'copy':
                        this.copyCode(code);
                        break;
                    case 'open':
                        this.openLock(id);
                        break;
                    case 'share':
                        this.copyShareLink(id);
                        break;
                    case 'duplicate':
                        this.duplicateItem(id);
                        break;
                    case 'tags':
                        this.manageTags(id);
                        break;
                    case 'collections':
                        this.manageLockCollections(id);
                        break;
                    case 'notes':
                        this.manageNotes(id);
                        break;
                    case 'delete':
                        this.deleteItem(id);
                        break;
                    default:
                        break;
                }
            });
        });

        // Event listeners para favoritos
        this.historyList.querySelectorAll('.favorite-btn').forEach(btn => {
            btn.addEventListener('click', (event) => {
                event.stopPropagation();
                const id = event.currentTarget.dataset.id;
                const type = event.currentTarget.dataset.type;
                
                if (window.favoritesManager) {
                    let isFavorite;
                    if (type === 'lock') {
                        isFavorite = window.favoritesManager.toggleLock(id);
                    } else {
                        isFavorite = window.favoritesManager.toggleEscape(id);
                    }
                    
                    // Actualizar UI
                    event.currentTarget.classList.toggle('active');
                    const icon = event.currentTarget.querySelector('i');
                    if (icon) {
                        icon.classList.toggle('fas');
                        icon.classList.toggle('far');
                    }
                    
                    // Notificación
                    if (window.notificationManager) {
                        if (isFavorite) {
                            window.notificationManager.success('Añadido a favoritos');
                        } else {
                            window.notificationManager.info('Eliminado de favoritos');
                        }
                    }
                }
            });
        });
    }

    filterHistory() {
        const searchTerm = this.searchInput.value.toLowerCase().trim();
        const typeFilter = this.filterType.value;
        const dateFilter = this.filterDate.value;
        const difficultyFilter = this.currentDifficulty;

        let filtered = this.history.filter(item => {
            // Búsqueda mejorada: nombre, descripción, código, tipo
            const searchableText = [
                item.name || '',
                item.description || '',
                item.code || '',
                this.getTypeLabel(item.type) || ''
            ].join(' ').toLowerCase();
            
            const matchesSearch = !searchTerm || searchableText.includes(searchTerm);
            const matchesType = typeFilter === 'all' ||
                item.type === typeFilter ||
                (typeFilter === 'directional' && item.type.startsWith('directional')) ||
                (typeFilter === 'pattern' && item.type.startsWith('pattern'));
            const matchesDate = this.matchesDateFilter(item.timestamp, dateFilter);
            const matchesDifficulty = difficultyFilter === 'all' || item.difficulty === difficultyFilter;
            
            // Filtrar por etiquetas
            const matchesTags = this.selectedTags.length === 0 || 
                                (item.tags && this.selectedTags.every(tag => item.tags.includes(tag)));
            
            // Filtrar por colección
            let matchesCollection = true;
            if (this.selectedCollection) {
                const collection = window.collectionsManager?.getCollection(this.selectedCollection);
                if (collection) {
                    matchesCollection = collection.lockIds.includes(item.id);
                }
            }

            return matchesSearch && matchesType && matchesDate && matchesDifficulty && matchesTags && matchesCollection;
        });

        // Ordenar resultados
        filtered = this.sortHistory(filtered);

        this.renderHistory(filtered);
    }

    sortHistory(items) {
        const sortValue = this.sortBy?.value || 'date-desc';
        
        return [...items].sort((a, b) => {
            switch (sortValue) {
                case 'date-desc':
                    return new Date(b.timestamp) - new Date(a.timestamp);
                case 'date-asc':
                    return new Date(a.timestamp) - new Date(b.timestamp);
                case 'name-asc':
                    return (a.name || '').localeCompare(b.name || '', 'es');
                case 'name-desc':
                    return (b.name || '').localeCompare(a.name || '', 'es');
                case 'difficulty-asc':
                    const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
                    return (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0);
                case 'difficulty-desc':
                    const difficultyOrderDesc = { 'easy': 1, 'medium': 2, 'hard': 3 };
                    return (difficultyOrderDesc[b.difficulty] || 0) - (difficultyOrderDesc[a.difficulty] || 0);
                case 'type-asc':
                    return this.getTypeLabel(a.type).localeCompare(this.getTypeLabel(b.type), 'es');
                default:
                    return 0;
            }
        });
    }

    matchesDateFilter(timestamp, filter) {
        if (filter === 'all') return true;

        const date = new Date(timestamp);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

        switch (filter) {
            case 'today':
                return date >= today;
            case 'week':
                return date >= weekAgo;
            case 'month':
                return date >= monthAgo;
            default:
                return true;
        }
    }

    renderLockCollections(lockId) {
        if (!window.collectionsManager) return '';

        const collections = window.collectionsManager.getLockCollections(lockId);
        if (collections.length === 0) return '';

        return `
            <div class="history-item-collections">
                ${collections.map(c => `
                    <span class="collection-badge" style="background-color: ${c.color}20; color: ${c.color}; border-color: ${c.color};" 
                          title="${this.escapeHtml(c.name)}">
                        <i class="fas fa-folder" aria-hidden="true"></i>
                        ${this.escapeHtml(c.name)}
                    </span>
                `).join('')}
            </div>
        `;
    }

    getTypeLabel(type) {
        const types = {
            'numeric': 'Numérico',
            'alphanumeric': 'Alfanumérico',
            'directional-4': 'Direccional (4)',
            'directional-8': 'Direccional (8)',
            'color': 'Color',
            'musical': 'Musical',
            'pattern-9': 'Patrón (9)',
            'pattern-16': 'Patrón (16)',
            'computer-login': 'Login de ordenador',
            'emoji': 'Emoji',
            'nokia': 'Teclado Nokia',
            'coordinates': 'Coordenadas',
            'word-wheel': 'Palabra giratoria',
            'switches': 'Palancas binarias',
            'slider': 'Deslizadores',
            'cryptex': 'Cryptex',
            'rotary': 'Mando giratorio'
        };
        return types[type] || type;
    }

    async copyCode(code) {
        if (!code) {
            if (window.notificationManager) {
                window.notificationManager.error('Este candado no tiene código disponible');
            }
            return;
        }
        try {
            await navigator.clipboard.writeText(code);
            if (window.notificationManager) {
                window.notificationManager.success('Código copiado al portapapeles');
            }
        } catch (err) {
            if (window.notificationManager) {
                window.notificationManager.error('Error al copiar el código');
            }
        }
    }

    openLock(id) {
        if (!id) return;
        const url = new URL('preview.html', window.location.href);
        url.searchParams.set('id', id);
        window.open(url.toString(), '_blank');
    }

    async copyShareLink(id) {
        const targetLock = this.history.find(item => item.id?.toString() === id?.toString());
        if (!targetLock) {
            if (window.notificationManager) {
                window.notificationManager.error('No encontramos ese candado');
            }
            return;
        }

        const payload = ensureSharePayload(targetLock);
        targetLock.sharePayload = payload;
        const shareUrl = buildShareUrlFromPayload(payload);

        if (!shareUrl) {
            if (window.notificationManager) {
                window.notificationManager.error('No se pudo generar el enlace');
            }
            return;
        }

        try {
            await navigator.clipboard.writeText(shareUrl);
            this.persistHistory();
            if (window.notificationManager) {
                window.notificationManager.success('Enlace copiado al portapapeles');
            }
        } catch (error) {
            console.error('No se pudo copiar el enlace compartido:', error);
            if (window.notificationManager) {
                window.notificationManager.error('Error al copiar el enlace');
            }
        }
    }

    async deleteItem(id) {
        const item = this.history.find(item => item.id?.toString() === id?.toString());
        if (!item) return;

        const confirmed = await window.showConfirm?.(
            'Eliminar candado',
            `¿Estás seguro de que quieres eliminar "${item.name}" del historial? Esta acción no se puede deshacer.`,
            'Eliminar',
            'Cancelar',
            'danger'
        );

        if (confirmed) {
            this.history = this.history.filter(item => item.id?.toString() !== id?.toString());
            this.persistHistory();
            this.filterHistory();
            if (window.notificationManager) {
                window.notificationManager.success('Candado eliminado del historial');
            }
        }
    }

    duplicateItem(id) {
        const item = this.history.find(item => item.id?.toString() === id?.toString());
        if (!item) {
            if (window.notificationManager) {
                window.notificationManager.error('No se encontró el candado');
            }
            return;
        }

        // Crear copia del candado
        const duplicated = {
            ...item,
            id: Date.now(), // Nuevo ID único
            name: `${item.name} (copia)`,
            timestamp: new Date().toISOString()
        };

        // Añadir al historial
        this.history.unshift(duplicated);
        this.persistHistory();
        this.filterHistory();

        if (window.notificationManager) {
            window.notificationManager.success(`Candado "${duplicated.name}" duplicado correctamente`);
        }
    }

    exportHistory() {
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            exportType: 'escapify-history',
            history: this.history,
            metadata: {
                totalItems: this.history.length,
                exportedBy: 'Escapify v1.3.0'
            }
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `escapify-historial-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        if (window.notificationManager) {
            window.notificationManager.success(`Historial exportado (${this.history.length} candados)`);
        }
    }

    async importHistory() {
        // Crear input de archivo
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';
        document.body.appendChild(input);

        input.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) {
                document.body.removeChild(input);
                return;
            }

            try {
                const text = await file.text();
                const importData = JSON.parse(text);

                // Validar formato
                if (!importData.history || !Array.isArray(importData.history)) {
                    throw new Error('Formato de archivo inválido');
                }

                const confirmed = await window.showConfirm?.(
                    'Importar historial',
                    `Se importarán ${importData.history.length} candados. ¿Deseas reemplazar el historial actual o añadirlos al existente?`,
                    'Reemplazar',
                    'Añadir',
                    'warning'
                );

                if (confirmed === true) {
                    // Reemplazar historial
                    this.history = importData.history.map(item => ({
                        ...item,
                        id: item.id || Date.now() + Math.random()
                    }));
                    this.persistHistory();
                    this.filterHistory();
                    
                    if (window.notificationManager) {
                        window.notificationManager.success(`Historial reemplazado con ${this.history.length} candados`);
                    }
                } else if (confirmed === false) {
                    // Cancelar - no hacer nada
                    return;
                } else {
                    // Añadir al historial existente (cuando se cierra el modal sin confirmar)
                    const newItems = importData.history.map(item => ({
                        ...item,
                        id: item.id || Date.now() + Math.random()
                    }));
                    this.history = [...this.history, ...newItems];
                    this.persistHistory();
                    this.filterHistory();
                    
                    if (window.notificationManager) {
                        window.notificationManager.success(`${newItems.length} candados añadidos al historial`);
                    }
                }
            } catch (error) {
                console.error('Error importando historial:', error);
                if (window.notificationManager) {
                    window.notificationManager.error('Error al importar el archivo. Verifica que sea un archivo JSON válido de Escapify.');
                }
            }

            document.body.removeChild(input);
        });

        input.click();
    }

    initializeTagsFilter() {
        if (!this.tagsFilterContainer || !window.tagsManager) return;

        const tagsFilter = document.getElementById('tagsFilter');
        if (!tagsFilter) return;

        // Crear selector de etiquetas para filtrar
        const allTags = window.tagsManager.getAllTags();
        
        if (allTags.length === 0) {
            this.tagsFilterContainer.style.display = 'none';
            return;
        }

        // Renderizar etiquetas disponibles como filtros
        allTags.forEach(tag => {
            const tagEl = window.tagsManager.createTagElement(tag, { clickable: true });
            tagEl.addEventListener('click', () => {
                const index = this.selectedTags.indexOf(tag);
                if (index > -1) {
                    this.selectedTags.splice(index, 1);
                    tagEl.classList.remove('tag-selected');
                } else {
                    this.selectedTags.push(tag);
                    tagEl.classList.add('tag-selected');
                }
                this.filterHistory();
            });
            tagsFilter.appendChild(tagEl);
        });
    }

    manageTags(lockId) {
        if (!window.tagsManager) return;

        const item = this.history.find(item => item.id?.toString() === lockId?.toString());
        if (!item) return;

        const currentTags = item.tags || [];

        // Crear modal para gestionar etiquetas
        const modal = document.createElement('div');
        modal.className = 'confirm-modal visible';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'tagsModalTitle');
        modal.innerHTML = `
            <div class="confirm-modal-overlay"></div>
            <div class="confirm-modal-content" style="max-width: 500px;">
                <div class="confirm-modal-header">
                    <h3 id="tagsModalTitle" class="confirm-modal-title">Gestionar etiquetas</h3>
                    <button class="confirm-modal-close" aria-label="Cerrar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="confirm-modal-body">
                    <p style="margin-bottom: 1rem; color: var(--text-muted);">Candado: <strong>${item.name}</strong></p>
                    <div id="tagsSelectorContainer"></div>
                </div>
                <div class="confirm-modal-footer">
                    <button class="btn btn-secondary confirm-modal-cancel">Cancelar</button>
                    <button class="btn btn-primary confirm-modal-confirm">Guardar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const container = modal.querySelector('#tagsSelectorContainer');
        const selectedTags = [...currentTags];
        window.tagsManager.createTagSelector(container, selectedTags, { allowNew: true });

        const close = () => {
            modal.remove();
            document.body.style.overflow = '';
        };

        const save = () => {
            // Actualizar etiquetas del candado
            item.tags = selectedTags;
            this.persistHistory();
            this.filterHistory();
            
            if (window.notificationManager) {
                window.notificationManager.success('Etiquetas actualizadas');
            }
            close();
        };

        modal.querySelector('.confirm-modal-close').addEventListener('click', close);
        modal.querySelector('.confirm-modal-overlay').addEventListener('click', close);
        modal.querySelector('.confirm-modal-cancel').addEventListener('click', close);
        modal.querySelector('.confirm-modal-confirm').addEventListener('click', save);

        // Escuchar cambios en las etiquetas seleccionadas
        document.addEventListener('tagAdded', (e) => {
            // Las etiquetas ya se actualizan automáticamente en selectedTags
        });

        document.body.style.overflow = 'hidden';
    }

    manageLockCollections(lockId) {
        if (!window.collectionsManager) return;

        const item = this.history.find(item => item.id?.toString() === lockId?.toString());
        if (!item) return;

        const currentCollections = window.collectionsManager.getLockCollections(lockId);
        const allCollections = window.collectionsManager.getAllCollections();

        // Crear modal para gestionar colecciones del candado
        const modal = document.createElement('div');
        modal.className = 'confirm-modal visible';
        modal.setAttribute('role', 'dialog');
        modal.innerHTML = `
            <div class="confirm-modal-overlay"></div>
            <div class="confirm-modal-content" style="max-width: 500px;">
                <div class="confirm-modal-header">
                    <h3 class="confirm-modal-title">Gestionar colecciones</h3>
                    <button class="confirm-modal-close" aria-label="Cerrar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="confirm-modal-body">
                    <p style="margin-bottom: 1rem; color: var(--text-muted);">Candado: <strong>${this.escapeHtml(item.name)}</strong></p>
                    <div class="collections-checkbox-list">
                        ${allCollections.map(collection => {
                            const isInCollection = currentCollections.some(c => c.id === collection.id);
                            return `
                                <label class="collection-checkbox-item">
                                    <input type="checkbox" 
                                           data-collection-id="${collection.id}" 
                                           ${isInCollection ? 'checked' : ''}>
                                    <span class="collection-checkbox-label">
                                        <span class="collection-color-indicator" style="background-color: ${collection.color}"></span>
                                        <span>${this.escapeHtml(collection.name)}</span>
                                        <span class="collection-count">(${collection.lockIds.length})</span>
                                    </span>
                                </label>
                            `;
                        }).join('')}
                        ${allCollections.length === 0 ? '<p class="empty-message">No hay colecciones. Crea una primero.</p>' : ''}
                    </div>
                </div>
                <div class="confirm-modal-footer">
                    <button class="btn btn-secondary confirm-modal-cancel">Cancelar</button>
                    <button class="btn btn-primary confirm-modal-confirm">Guardar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const close = () => {
            modal.remove();
            document.body.style.overflow = '';
        };

        const save = () => {
            const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
                const collectionId = checkbox.dataset.collectionId;
                const isChecked = checkbox.checked;
                const wasInCollection = currentCollections.some(c => c.id?.toString() === collectionId?.toString());

                if (isChecked && !wasInCollection) {
                    window.collectionsManager.addLockToCollection(lockId, collectionId);
                } else if (!isChecked && wasInCollection) {
                    window.collectionsManager.removeLockFromCollection(lockId, collectionId);
                }
            });

            this.filterHistory();
            this.renderCollections();
            document.dispatchEvent(new CustomEvent('collectionsUpdated'));

            if (window.notificationManager) {
                window.notificationManager.success('Colecciones actualizadas');
            }

            close();
        };

        modal.querySelector('.confirm-modal-close').addEventListener('click', close);
        modal.querySelector('.confirm-modal-overlay').addEventListener('click', close);
        modal.querySelector('.confirm-modal-cancel').addEventListener('click', close);
        modal.querySelector('.confirm-modal-confirm').addEventListener('click', save);

        document.body.style.overflow = 'hidden';
    }

    manageNotes(lockId) {
        if (!window.notesManager) return;

        const item = this.history.find(item => item.id?.toString() === lockId?.toString());
        if (!item) return;

        const modal = document.createElement('div');
        modal.className = 'confirm-modal visible';
        modal.setAttribute('role', 'dialog');
        modal.innerHTML = `
            <div class="confirm-modal-overlay"></div>
            <div class="confirm-modal-content" style="max-width: 600px;">
                <div class="confirm-modal-header">
                    <h3 class="confirm-modal-title">Notas privadas</h3>
                    <button class="confirm-modal-close" aria-label="Cerrar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="confirm-modal-body">
                    <p style="margin-bottom: 1rem; color: var(--text-muted);">Candado: <strong>${this.escapeHtml(item.name)}</strong></p>
                    <div id="noteEditorContainer"></div>
                </div>
                <div class="confirm-modal-footer">
                    <button class="btn btn-secondary confirm-modal-cancel">Cerrar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const container = modal.querySelector('#noteEditorContainer');
        window.notesManager.renderNoteEditor(container, lockId, item.name);

        const close = () => {
            modal.remove();
            document.body.style.overflow = '';
        };

        modal.querySelector('.confirm-modal-close').addEventListener('click', close);
        modal.querySelector('.confirm-modal-overlay').addEventListener('click', close);
        modal.querySelector('.confirm-modal-cancel').addEventListener('click', close);

        document.body.style.overflow = 'hidden';
    }

    initializeCollections() {
        if (!this.collectionsGrid || !window.collectionsManager) return;

        this.renderCollections();

        // Escuchar cambios en colecciones
        document.addEventListener('collectionsUpdated', () => {
            this.renderCollections();
        });
    }

    renderCollections() {
        if (!this.collectionsGrid || !window.collectionsManager) return;

        window.collectionsManager.renderCollections(this.collectionsGrid, {
            clickable: true,
            onSelect: (id) => {
                this.selectedCollection = id;
                this.filterHistory();
                this.renderCollections(); // Actualizar selección visual
            },
            onEdit: (id) => {
                this.editCollection(id);
            },
            onDelete: (id) => {
                this.deleteCollection(id);
            },
            onAddLocks: (id) => {
                this.addLocksToCollection(id);
            },
            onCreateLock: (id) => {
                this.createLockInCollection(id);
            },
            selectedId: this.selectedCollection
        });
    }

    showCreateCollection() {
        if (!window.collectionsManager) return;

        window.collectionsManager.showCreateCollectionModal((collection) => {
            this.renderCollections();
            document.dispatchEvent(new CustomEvent('collectionsUpdated'));
        });
    }

    async editCollection(id) {
        if (!window.collectionsManager) return;

        const collection = window.collectionsManager.getCollection(id);
        if (!collection) return;

        const modal = document.createElement('div');
        modal.className = 'confirm-modal visible';
        modal.setAttribute('role', 'dialog');
        modal.innerHTML = `
            <div class="confirm-modal-overlay"></div>
            <div class="confirm-modal-content" style="max-width: 500px;">
                <div class="confirm-modal-header">
                    <h3 class="confirm-modal-title">Editar Colección</h3>
                    <button class="confirm-modal-close" aria-label="Cerrar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="confirm-modal-body">
                    <div class="form-group">
                        <label for="editCollectionName">Nombre de la colección <span class="required">*</span></label>
                        <input type="text" id="editCollectionName" value="${this.escapeHtml(collection.name)}" required>
                    </div>
                    <div class="form-group">
                        <label for="editCollectionDescription">Descripción</label>
                        <textarea id="editCollectionDescription" rows="3">${this.escapeHtml(collection.description || '')}</textarea>
                    </div>
                    <div class="form-group">
                        <label for="editCollectionColor">Color</label>
                        <div class="color-picker">
                            ${window.collectionsManager.getColorOptions().map(color => `
                                <button type="button" class="color-option ${color === collection.color ? 'selected' : ''}" 
                                        data-color="${color}" style="background-color: ${color}" aria-label="Color ${color}">
                                    <i class="fas fa-check" style="display: ${color === collection.color ? 'block' : 'none'};"></i>
                                </button>
                            `).join('')}
                        </div>
                        <input type="hidden" id="editCollectionColor" value="${collection.color}">
                    </div>
                </div>
                <div class="confirm-modal-footer">
                    <button class="btn btn-secondary confirm-modal-cancel">Cancelar</button>
                    <button class="btn btn-primary confirm-modal-confirm">Guardar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const nameInput = modal.querySelector('#editCollectionName');
        const descInput = modal.querySelector('#editCollectionDescription');
        const colorInput = modal.querySelector('#editCollectionColor');
        const colorOptions = modal.querySelectorAll('.color-option');

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

        const close = () => {
            modal.remove();
            document.body.style.overflow = '';
        };

        const save = () => {
            const name = nameInput.value.trim();
            if (!name) {
                if (window.notificationManager) {
                    window.notificationManager.error('El nombre es obligatorio');
                }
                nameInput.focus();
                return;
            }

            window.collectionsManager.updateCollection(id, {
                name,
                description: descInput.value.trim(),
                color: colorInput.value
            });

            this.renderCollections();
            document.dispatchEvent(new CustomEvent('collectionsUpdated'));

            if (window.notificationManager) {
                window.notificationManager.success('Colección actualizada');
            }

            close();
        };

        modal.querySelector('.confirm-modal-close').addEventListener('click', close);
        modal.querySelector('.confirm-modal-overlay').addEventListener('click', close);
        modal.querySelector('.confirm-modal-cancel').addEventListener('click', close);
        modal.querySelector('.confirm-modal-confirm').addEventListener('click', save);

        document.body.style.overflow = 'hidden';
        nameInput.focus();
    }

    async deleteCollection(id) {
        if (!window.collectionsManager) return;

        const collection = window.collectionsManager.getCollection(id);
        if (!collection) return;

        const confirmed = await window.showConfirm?.(
            'Eliminar colección',
            `¿Estás seguro de que quieres eliminar la colección "${collection.name}"? Los candados no se eliminarán, solo se quitarán de la colección.`,
            'Eliminar',
            'Cancelar',
            'danger'
        );

        if (confirmed) {
            window.collectionsManager.deleteCollection(id);
            this.renderCollections();
            document.dispatchEvent(new CustomEvent('collectionsUpdated'));

            if (this.selectedCollection?.toString() === id?.toString()) {
                this.selectedCollection = null;
                this.filterHistory();
            }

            if (window.notificationManager) {
                window.notificationManager.success('Colección eliminada');
            }
        }
    }

    incrementUsage(lockId) {
        const item = this.history.find(item => item.id?.toString() === lockId?.toString());
        if (item) {
            item.usageCount = (item.usageCount || 0) + 1;
            item.lastUsed = new Date().toISOString();
            this.persistHistory();
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async clearHistory() {
        const confirmed = await window.showConfirm?.(
            'Limpiar historial',
            '¿Estás seguro de que quieres eliminar todos los candados del historial? Esta acción no se puede deshacer. Te recomendamos exportar el historial antes de limpiarlo.',
            'Limpiar todo',
            'Cancelar',
            'danger'
        );

        if (confirmed) {
            this.history = [];
            localStorage.removeItem('lockHistory');
            this.renderHistory([]);
            if (window.notificationManager) {
                window.notificationManager.success('Historial limpiado');
            }
        }
    }

    // Añadir candados a una colección
    addLocksToCollection(collectionId) {
        if (!window.collectionsManager) return;

        const collection = window.collectionsManager.getCollection(collectionId);
        if (!collection) return;

        // Obtener todos los candados disponibles
        const allLocks = this.history.filter(lock => {
            // Excluir los que ya están en la colección
            return !collection.lockIds.includes(lock.id);
        });

        if (allLocks.length === 0) {
            if (window.notificationManager) {
                window.notificationManager.info('No hay candados disponibles para añadir a esta colección');
            }
            return;
        }

        // Crear modal para seleccionar candados
        const modal = document.createElement('div');
        modal.className = 'confirm-modal visible';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-labelledby', 'addLocksModalTitle');
        modal.innerHTML = `
            <div class="confirm-modal-overlay"></div>
            <div class="confirm-modal-content" style="max-width: 600px; max-height: 80vh;">
                <div class="confirm-modal-header">
                    <h3 id="addLocksModalTitle" class="confirm-modal-title">Añadir candados a "${this.escapeHtml(collection.name)}"</h3>
                    <button class="confirm-modal-close" aria-label="Cerrar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="confirm-modal-body" style="overflow-y: auto; max-height: 50vh;">
                    <p style="margin-bottom: 1rem;">Selecciona los candados que deseas añadir a esta colección:</p>
                    <div class="locks-selection-list" style="display: flex; flex-direction: column; gap: 0.5rem;">
                        ${allLocks.map(lock => `
                            <label class="lock-selection-item" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem; border: 2px solid var(--border-color); border-radius: 8px; cursor: pointer; transition: all 0.2s;">
                                <input type="checkbox" value="${lock.id}" class="lock-checkbox">
                                <div style="flex: 1;">
                                    <strong>${this.escapeHtml(lock.name || 'Candado sin nombre')}</strong>
                                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted);">${this.getTypeLabel(lock.type)}</p>
                                </div>
                            </label>
                        `).join('')}
                    </div>
                </div>
                <div class="confirm-modal-footer">
                    <button class="btn btn-secondary confirm-modal-cancel">Cancelar</button>
                    <button class="btn btn-primary confirm-modal-confirm">Añadir seleccionados</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Estilos para las opciones
        const style = document.createElement('style');
        style.textContent = `
            .lock-selection-item:hover {
                border-color: var(--primary-color) !important;
                background-color: var(--hover-color) !important;
            }
            .lock-selection-item input[type="checkbox"]:checked + div strong {
                color: var(--primary-color);
            }
        `;
        document.head.appendChild(style);

        const close = () => {
            modal.remove();
            style.remove();
            document.body.style.overflow = '';
        };

        const add = () => {
            const selected = Array.from(modal.querySelectorAll('.lock-checkbox:checked')).map(cb => parseInt(cb.value));
            
            if (selected.length === 0) {
                if (window.notificationManager) {
                    window.notificationManager.warning('Selecciona al menos un candado');
                }
                return;
            }

            // Añadir candados a la colección
            selected.forEach(lockId => {
                window.collectionsManager.addLockToCollection(lockId, collectionId);
                
                // Actualizar el candado en el historial
                const lock = this.history.find(l => l.id === lockId);
                if (lock) {
                    if (!lock.collections) {
                        lock.collections = [];
                    }
                    if (!lock.collections.includes(collectionId)) {
                        lock.collections.push(collectionId);
                    }
                    lock.directory = collectionId;
                }
            });

            // Guardar cambios
            localStorage.setItem('lockHistory', JSON.stringify(this.history));
            
            this.filterHistory();
            this.renderCollections();
            
            if (window.notificationManager) {
                window.notificationManager.success(`${selected.length} candado${selected.length !== 1 ? 's' : ''} añadido${selected.length !== 1 ? 's' : ''} a la colección`);
            }
            
            close();
        };

        modal.querySelector('.confirm-modal-close').addEventListener('click', close);
        modal.querySelector('.confirm-modal-overlay').addEventListener('click', close);
        modal.querySelector('.confirm-modal-cancel').addEventListener('click', close);
        modal.querySelector('.confirm-modal-confirm').addEventListener('click', add);

        document.body.style.overflow = 'hidden';
    }

    // Crear nuevo candado en una colección
    createLockInCollection(collectionId) {
        // Guardar el ID de la colección en sessionStorage para que el generador lo detecte
        sessionStorage.setItem('selectedCollectionForNewLock', collectionId);
        // Redirigir al generador
        window.location.href = '/generador.html';
    }
}

// Inicializar el gestor de historial cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const historyManager = new HistoryManager();
}); 
