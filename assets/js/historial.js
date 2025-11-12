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
            return `
            <li class="history-item">
                <div class="history-item-content">
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
            this.showNotification('Este candado no tiene código disponible', 'error');
            return;
        }
        try {
            await navigator.clipboard.writeText(code);
            this.showNotification('Código copiado al portapapeles', 'success');
        } catch (err) {
            this.showNotification('Error al copiar el código', 'error');
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
            this.showNotification('No encontramos ese candado', 'error');
            return;
        }

        const payload = ensureSharePayload(targetLock);
        targetLock.sharePayload = payload;
        const shareUrl = buildShareUrlFromPayload(payload);

        if (!shareUrl) {
            this.showNotification('No se pudo generar el enlace', 'error');
            return;
        }

        try {
            await navigator.clipboard.writeText(shareUrl);
            this.persistHistory();
            this.showNotification('Enlace copiado al portapapeles', 'success');
        } catch (error) {
            console.error('No se pudo copiar el enlace compartido:', error);
            this.showNotification('Error al copiar el enlace', 'error');
        }
    }

    deleteItem(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este candado del historial?')) {
            this.history = this.history.filter(item => item.id?.toString() !== id?.toString());
            this.persistHistory();
            this.filterHistory();
            this.showNotification('Candado eliminado del historial', 'success');
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
            this.showNotification('Historial limpiado', 'success');
        }
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        Object.assign(notification.style, {
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            padding: '1rem 2rem',
            borderRadius: '5px',
            backgroundColor: type === 'success' ? 'var(--success-color)' : 'var(--error-color)',
            color: 'white',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            zIndex: '1000',
            transition: 'opacity 0.3s ease'
        });

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Inicializar el gestor de historial cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const historyManager = new HistoryManager();
}); 
