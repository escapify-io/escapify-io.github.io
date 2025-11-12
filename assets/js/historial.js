import { appendSharePayload, buildShareUrlFromPayload, ensureSharePayload } from './share.js';

class HistoryManager {
    constructor() {
        this.historyList = document.getElementById('historyList');
        this.searchInput = document.getElementById('searchInput');
        this.filterType = document.getElementById('filterType');
        this.filterDate = document.getElementById('filterDate');
        this.exportBtn = document.getElementById('exportBtn');
        this.clearHistoryBtn = document.getElementById('clearHistoryBtn');
        this.difficultyFilters = document.getElementById('difficultyFilters');
        this.currentDifficulty = 'all';

        this.initializeEventListeners();
        this.loadHistory();
    }

    initializeEventListeners() {
        this.searchInput.addEventListener('input', () => this.filterHistory());
        this.filterType.addEventListener('change', () => this.filterHistory());
        this.filterDate.addEventListener('change', () => this.filterHistory());
        this.exportBtn.addEventListener('click', () => this.exportHistory());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
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
            
            return `
            <li class="history-item">
                <div class="history-item-content">
                    <button class="favorite-btn ${favoriteClass}" data-id="${item.id}" data-type="lock" aria-label="${isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}">
                        <i class="fas fa-star"></i>
                    </button>
                    <span class="history-item-name">${item.name}</span>
                    ${badge}
                    <span class="history-item-type">${this.getTypeLabel(item.type)}</span>
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
        const searchTerm = this.searchInput.value.toLowerCase();
        const typeFilter = this.filterType.value;
        const dateFilter = this.filterDate.value;
        const difficultyFilter = this.currentDifficulty;

        const filtered = this.history.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm);
            const matchesType = typeFilter === 'all' ||
                item.type === typeFilter ||
                (typeFilter === 'directional' && item.type.startsWith('directional')) ||
                (typeFilter === 'pattern' && item.type.startsWith('pattern'));
            const matchesDate = this.matchesDateFilter(item.timestamp, dateFilter);
            const matchesDifficulty = difficultyFilter === 'all' || item.difficulty === difficultyFilter;
            return matchesSearch && matchesType && matchesDate && matchesDifficulty;
        });

        this.renderHistory(filtered);
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

    deleteItem(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este candado del historial?')) {
            this.history = this.history.filter(item => item.id?.toString() !== id?.toString());
            this.persistHistory();
            this.filterHistory();
            if (window.notificationManager) {
                window.notificationManager.success('Candado eliminado del historial');
            }
        }
    }

    exportHistory() {
        const exportData = {
            exportDate: new Date().toISOString(),
            history: this.history
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `candados-historial-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    clearHistory() {
        if (confirm('¿Estás seguro de que quieres limpiar todo el historial?')) {
            this.history = [];
            localStorage.removeItem('lockHistory');
            this.renderHistory([]);
            if (window.notificationManager) {
                window.notificationManager.success('Historial limpiado');
            }
        }
    }
}

// Inicializar el gestor de historial cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const historyManager = new HistoryManager();
}); 
