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
            this.history = JSON.parse(savedHistory);
            this.renderHistory(this.history);
        } else {
            this.history = [];
            this.historyList.innerHTML = '<li class="empty-history">No hay candados en el historial</li>';
        }
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
                    <button class="btn-copy" data-code="${item.code}">
                        <i class="fas fa-copy"></i>
                    </button>
                    <button class="btn-delete" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </li>
            `;
        }).join('');

        // Agregar event listeners a los botones
        this.historyList.querySelectorAll('.btn-copy').forEach(btn => {
            btn.addEventListener('click', (e) => this.copyCode(e.target.dataset.code));
        });

        this.historyList.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteItem(e.target.dataset.id));
        });
    }

    filterHistory() {
        const searchTerm = this.searchInput.value.toLowerCase();
        const typeFilter = this.filterType.value;
        const dateFilter = this.filterDate.value;
        const difficultyFilter = this.currentDifficulty;

        const filtered = this.history.filter(item => {
            const matchesSearch = item.name.toLowerCase().includes(searchTerm);
            const matchesType = typeFilter === 'all' || item.type === typeFilter;
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
            'directional-4': 'Direccional (4)',
            'directional-8': 'Direccional (8)',
            'color': 'Color',
            'musical': 'Musical',
            'pattern-9': 'Patrón (9)',
            'pattern-16': 'Patrón (16)'
        };
        return types[type] || type;
    }

    async copyCode(code) {
        try {
            await navigator.clipboard.writeText(code);
            this.showNotification('Código copiado al portapapeles', 'success');
        } catch (err) {
            this.showNotification('Error al copiar el código', 'error');
        }
    }

    deleteItem(id) {
        if (confirm('¿Estás seguro de que quieres eliminar este candado del historial?')) {
            this.history = this.history.filter(item => item.id !== id);
            localStorage.setItem('lockHistory', JSON.stringify(this.history));
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