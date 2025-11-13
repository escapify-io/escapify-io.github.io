/**
 * Sistema de etiquetas/tags para candados
 * Permite etiquetar y filtrar candados por múltiples criterios
 */
class TagsManager {
    constructor() {
        this.storageKey = 'escapify_tags';
        this.availableTags = this.loadAvailableTags();
        this.tagColors = this.getTagColors();
    }

    loadAvailableTags() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error cargando etiquetas:', error);
        }
        return [];
    }

    saveAvailableTags() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(this.availableTags));
        } catch (error) {
            console.error('Error guardando etiquetas:', error);
        }
    }

    getTagColors() {
        // Colores predefinidos para etiquetas
        return [
            { bg: '#E3F2FD', text: '#1976D2', border: '#90CAF9' }, // Azul
            { bg: '#F3E5F5', text: '#7B1FA2', border: '#BA68C8' }, // Púrpura
            { bg: '#E8F5E9', text: '#388E3C', border: '#81C784' }, // Verde
            { bg: '#FFF3E0', text: '#F57C00', border: '#FFB74D' }, // Naranja
            { bg: '#FCE4EC', text: '#C2185B', border: '#F48FB1' }, // Rosa
            { bg: '#E0F2F1', text: '#00796B', border: '#4DB6AC' }, // Turquesa
            { bg: '#FFF9C4', text: '#F9A825', border: '#FFF176' }, // Amarillo
            { bg: '#EFEBE9', text: '#5D4037', border: '#A1887F' }, // Marrón
        ];
    }

    getTagColor(tagName) {
        // Asignar color basado en hash del nombre para consistencia
        const index = this.hashString(tagName) % this.tagColors.length;
        return this.tagColors[index];
    }

    hashString(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        return Math.abs(hash);
    }

    // Obtener todas las etiquetas de un candado
    getLockTags(lockId) {
        const history = JSON.parse(localStorage.getItem('lockHistory') || '[]');
        const lock = history.find(l => l.id?.toString() === lockId?.toString());
        return lock?.tags || [];
    }

    // Añadir etiqueta a un candado
    addTagToLock(lockId, tagName) {
        const history = JSON.parse(localStorage.getItem('lockHistory') || '[]');
        const lock = history.find(l => l.id?.toString() === lockId?.toString());
        
        if (!lock) return false;

        if (!lock.tags) lock.tags = [];
        
        const normalizedTag = this.normalizeTag(tagName);
        if (!lock.tags.includes(normalizedTag)) {
            lock.tags.push(normalizedTag);
            
            // Añadir a lista de etiquetas disponibles si no existe
            if (!this.availableTags.includes(normalizedTag)) {
                this.availableTags.push(normalizedTag);
                this.saveAvailableTags();
            }
            
            localStorage.setItem('lockHistory', JSON.stringify(history));
            return true;
        }
        return false;
    }

    // Eliminar etiqueta de un candado
    removeTagFromLock(lockId, tagName) {
        const history = JSON.parse(localStorage.getItem('lockHistory') || '[]');
        const lock = history.find(l => l.id?.toString() === lockId?.toString());
        
        if (!lock || !lock.tags) return false;

        const normalizedTag = this.normalizeTag(tagName);
        lock.tags = lock.tags.filter(t => t !== normalizedTag);
        
        localStorage.setItem('lockHistory', JSON.stringify(history));
        return true;
    }

    // Normalizar nombre de etiqueta
    normalizeTag(tagName) {
        return tagName.trim().toLowerCase();
    }

    // Obtener todas las etiquetas disponibles
    getAllTags() {
        return [...this.availableTags].sort();
    }

    // Renderizar etiquetas en un elemento
    renderTags(container, tags, options = {}) {
        if (!container) return;

        const { 
            removable = false, 
            lockId = null, 
            clickable = true,
            maxTags = null 
        } = options;

        container.innerHTML = '';
        
        if (!tags || tags.length === 0) {
            if (options.showEmpty) {
                container.innerHTML = '<span class="no-tags">Sin etiquetas</span>';
            }
            return;
        }

        const tagsToShow = maxTags ? tags.slice(0, maxTags) : tags;
        
        tagsToShow.forEach(tag => {
            const tagEl = this.createTagElement(tag, { removable, lockId, clickable });
            container.appendChild(tagEl);
        });

        if (maxTags && tags.length > maxTags) {
            const moreEl = document.createElement('span');
            moreEl.className = 'tag-more';
            moreEl.textContent = `+${tags.length - maxTags}`;
            moreEl.title = tags.slice(maxTags).join(', ');
            container.appendChild(moreEl);
        }
    }

    createTagElement(tag, options = {}) {
        const { removable = false, lockId = null, clickable = true } = options;
        const color = this.getTagColor(tag);
        
        const tagEl = document.createElement('span');
        tagEl.className = 'tag';
        tagEl.dataset.tag = tag;
        tagEl.style.backgroundColor = color.bg;
        tagEl.style.color = color.text;
        tagEl.style.borderColor = color.border;
        
        tagEl.innerHTML = `
            <span class="tag-name">${this.formatTagName(tag)}</span>
            ${removable ? `<button class="tag-remove" aria-label="Eliminar etiqueta ${tag}" data-tag="${tag}">
                <i class="fas fa-times"></i>
            </button>` : ''}
        `;

        if (clickable) {
            tagEl.classList.add('tag-clickable');
            tagEl.setAttribute('role', 'button');
            tagEl.setAttribute('tabindex', '0');
            tagEl.setAttribute('aria-label', `Filtrar por ${tag}`);
        }

        if (removable && lockId) {
            const removeBtn = tagEl.querySelector('.tag-remove');
            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.removeTagFromLock(lockId, tag);
                if (window.notificationManager) {
                    window.notificationManager.info(`Etiqueta "${tag}" eliminada`);
                }
                // Disparar evento para actualizar UI
                document.dispatchEvent(new CustomEvent('tagsUpdated', { detail: { lockId } }));
            });
        }

        return tagEl;
    }

    formatTagName(tag) {
        // Capitalizar primera letra de cada palabra
        return tag.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Crear selector de etiquetas
    createTagSelector(container, selectedTags = [], options = {}) {
        if (!container) return;

        const { 
            placeholder = 'Añadir etiqueta...',
            allowNew = true,
            maxTags = null 
        } = options;

        const selector = document.createElement('div');
        selector.className = 'tag-selector';
        
        const inputContainer = document.createElement('div');
        inputContainer.className = 'tag-input-container';
        
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'tag-input';
        input.placeholder = placeholder;
        input.setAttribute('aria-label', 'Añadir etiqueta');
        
        const suggestions = document.createElement('div');
        suggestions.className = 'tag-suggestions';
        suggestions.setAttribute('role', 'listbox');
        
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'tag-selector-tags';
        
        // Renderizar etiquetas seleccionadas
        this.renderTags(tagsContainer, selectedTags, { removable: true });
        
        inputContainer.appendChild(input);
        inputContainer.appendChild(suggestions);
        selector.appendChild(tagsContainer);
        selector.appendChild(inputContainer);

        // Autocompletado
        input.addEventListener('input', (e) => {
            const value = e.target.value.trim().toLowerCase();
            if (value.length === 0) {
                suggestions.innerHTML = '';
                suggestions.style.display = 'none';
                return;
            }

            const available = this.getAllTags().filter(tag => 
                tag.includes(value) && !selectedTags.includes(tag)
            );

            if (available.length > 0 || allowNew) {
                suggestions.innerHTML = '';
                suggestions.style.display = 'block';

                available.slice(0, 5).forEach(tag => {
                    const suggestion = document.createElement('div');
                    suggestion.className = 'tag-suggestion';
                    suggestion.setAttribute('role', 'option');
                    suggestion.textContent = this.formatTagName(tag);
                    suggestion.addEventListener('click', () => {
                        this.addTagToSelector(tag, selectedTags, tagsContainer, input, suggestions, options.maxTags);
                    });
                    suggestions.appendChild(suggestion);
                });

                if (allowNew && !available.includes(value)) {
                    const newTag = document.createElement('div');
                    newTag.className = 'tag-suggestion tag-suggestion-new';
                    newTag.innerHTML = `<i class="fas fa-plus"></i> Crear "${this.formatTagName(value)}"`;
                    newTag.addEventListener('click', () => {
                        this.addTagToSelector(value, selectedTags, tagsContainer, input, suggestions, options.maxTags);
                    });
                    suggestions.appendChild(newTag);
                }
            } else {
                suggestions.style.display = 'none';
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
                e.preventDefault();
                const value = input.value.trim().toLowerCase();
                this.addTagToSelector(value, selectedTags, tagsContainer, input, suggestions, options.maxTags);
            } else if (e.key === 'Escape') {
                suggestions.style.display = 'none';
                input.blur();
            }
        });

        // Cerrar sugerencias al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!selector.contains(e.target)) {
                suggestions.style.display = 'none';
            }
        });

        container.appendChild(selector);
        return selector;
    }

    addTagToSelector(tagValue, selectedTags, tagsContainer, input, suggestions, maxTags = null) {
        const normalized = this.normalizeTag(tagValue);
        
        if (maxTags && selectedTags.length >= maxTags) {
            if (window.notificationManager) {
                window.notificationManager.warning(`Máximo ${maxTags} etiquetas permitidas`);
            }
            return;
        }

        if (!selectedTags.includes(normalized)) {
            selectedTags.push(normalized);
            
            if (!this.availableTags.includes(normalized)) {
                this.availableTags.push(normalized);
                this.saveAvailableTags();
            }
            
            this.renderTags(tagsContainer, selectedTags, { removable: true });
            input.value = '';
            suggestions.style.display = 'none';
            
            // Disparar evento
            document.dispatchEvent(new CustomEvent('tagAdded', { detail: { tag: normalized } }));
        }
    }

    // Filtrar candados por etiquetas
    filterLocksByTags(locks, selectedTags, matchAll = false) {
        if (!selectedTags || selectedTags.length === 0) return locks;

        return locks.filter(lock => {
            const lockTags = lock.tags || [];
            
            if (matchAll) {
                // Todas las etiquetas deben estar presentes
                return selectedTags.every(tag => lockTags.includes(tag));
            } else {
                // Al menos una etiqueta debe estar presente
                return selectedTags.some(tag => lockTags.includes(tag));
            }
        });
    }
}

// Instancia global
window.tagsManager = new TagsManager();

