class LockGenerator {
    constructor() {
        this.lockHistory = [];
        this.currentLock = null;
        this.initializeElements();
        this.attachEventListeners();
        this.collections = {};
    }

    initializeElements() {
        this.lockDisplay = document.querySelector('.lock-display');
        this.generateBtn = document.querySelector('#generateBtn');
        this.copyBtn = document.querySelector('#copyBtn');
        this.clearHistoryBtn = document.querySelector('#clearHistoryBtn');
        this.historyList = document.querySelector('.history-list');
    }

    attachEventListeners() {
        this.generateBtn.addEventListener('click', () => this.generateLock());
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
    }

    generateLock() {
        // Genera un candado de 6 dígitos con formato XX-XX-XX
        const segments = Array.from({ length: 3 }, () => 
            Math.floor(Math.random() * 100).toString().padStart(2, '0')
        );
        
        this.currentLock = segments.join('-');
        this.updateDisplay();
        this.addToHistory(this.currentLock);
    }

    updateDisplay() {
        if (this.lockDisplay) {
            this.lockDisplay.textContent = this.currentLock || '-- -- --';
        }
    }

    addToHistory(lock) {
        const timestamp = new Date().toLocaleTimeString();
        this.lockHistory.unshift({ lock, timestamp });
        this.updateHistoryDisplay();
    }

    updateHistoryDisplay() {
        if (!this.historyList) return;

        this.historyList.innerHTML = this.lockHistory
            .map(({ lock, timestamp }) => `
                <li class="history-item">
                    <span>${lock} (${timestamp})</span>
                    <button class="copy-btn" data-lock="${lock}">
                        Copiar
                    </button>
                </li>
            `)
            .join('');

        // Agregar event listeners a los nuevos botones de copiar
        this.historyList.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lockToCopy = e.target.dataset.lock;
                this.copySpecificLock(lockToCopy);
            });
        });
    }

    async copyToClipboard() {
        if (!this.currentLock) return;

        try {
            await navigator.clipboard.writeText(this.currentLock);
            this.showNotification('¡Candado copiado al portapapeles!', 'success');
        } catch (err) {
            this.showNotification('Error al copiar el candado', 'error');
        }
    }

    async copySpecificLock(lock) {
        try {
            await navigator.clipboard.writeText(lock);
            this.showNotification('¡Candado copiado al portapapeles!', 'success');
        } catch (err) {
            this.showNotification('Error al copiar el candado', 'error');
        }
    }

    clearHistory() {
        this.lockHistory = [];
        this.updateHistoryDisplay();
        this.showNotification('Historial limpiado', 'success');
    }

    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Aplicar estilos para la notificación
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

        // Eliminar la notificación después de 3 segundos
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    static createNumericTemplate(type) {
        const container = document.createElement('div');
        container.className = 'lock-keypad numeric-keypad';
        container.style.gridTemplateColumns = 'repeat(3, 1fr)';
        container.style.gridTemplateRows = 'repeat(4, 1fr)';
        container.style.gap = '10px';
        
        // Orden lógico para un teclado: 1-9 y 0 abajo
        const buttons = [1,2,3,4,5,6,7,8,9,'',0,''];
        buttons.forEach(num => {
            if (num === '') {
                const spacer = document.createElement('div');
                container.appendChild(spacer);
            } else {
                const button = document.createElement('button');
                button.className = 'keypad-button';
                button.textContent = num.toString();
                button.dataset.value = num.toString();
                if (num === 0) {
                    button.style.gridColumn = '2'; // Centrar el 0
                }
                container.appendChild(button);
            }
        });
        
        return container;
    }

    checkStorage() {
        try {
            localStorage.setItem('test', 'test');
            localStorage.removeItem('test');
            return true;
        } catch (e) {
            this.showNotification('Tu navegador no admite o tiene deshabilitado el almacenamiento local', 'error');
            return false;
        }
    }

    migrateOldData() {
        const savedHistory = localStorage.getItem('lockHistory');
        if (savedHistory) {
            let history = JSON.parse(savedHistory);
            let updated = false;
            
            history = history.map(item => {
                if (!item.difficulty) {
                    item.difficulty = 'medium'; // Valor por defecto
                    updated = true;
                }
                return item;
            });
            
            if (updated) {
                localStorage.setItem('lockHistory', JSON.stringify(history));
                console.log('Datos antiguos migrados con éxito');
            }
            
            return history;
        }
        return [];
    }

    createCollection(id, name, icon = "fas fa-folder") {
        this.collections[id] = {
            id,
            name,
            icon,
            locks: [],
            created: new Date().toISOString()
        };
        this.saveCollections();
    }

    addLockToCollection(lockId, collectionId) {
        if (this.collections[collectionId]) {
            if (!this.collections[collectionId].locks.includes(lockId)) {
                this.collections[collectionId].locks.push(lockId);
                this.saveCollections();
                return true;
            }
        }
        return false;
    }

    saveCollections() {
        localStorage.setItem('lockCollections', JSON.stringify(this.collections));
    }

    generateAccessCode() {
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Caracteres fáciles de leer
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    }

    addNumericOptions() {
        const optionsContainer = document.createElement('div');
        optionsContainer.className = 'numeric-options';
        optionsContainer.innerHTML = `
            <div class="options-section">
                <h4>Opciones</h4>
                <div class="option-group">
                    <p>Orden de visualización de dígitos:</p>
                    <div class="radio-group">
                        <label>
                            <input type="radio" name="digitOrder" value="789456123" checked>
                            789 : 456 : 123
                        </label>
                        <label>
                            <input type="radio" name="digitOrder" value="123456789">
                            123 : 456 : 789
                        </label>
                    </div>
                </div>
                <div class="option-group">
                    <label>
                        <input type="checkbox" id="allowDelete">
                        Permitir borrar la última entrada
                    </label>
                </div>
                <div class="option-group">
                    <label>
                        <input type="checkbox" id="showConfetti" checked>
                        Mostrar confeti en caso de éxito
                    </label>
                </div>
                <div class="option-group">
                    <label>
                        <input type="checkbox" id="playSounds" checked>
                        Emitir sonido en caso de fallo y éxito
                    </label>
                </div>
            </div>
        `;
        
        return optionsContainer;
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const lockGenerator = new LockGenerator();
});

// Sistema de autenticación simplificado que puedes añadir
function createAccountSystem() {
    // Añadir botones en la barra de navegación
    const navMenu = document.querySelector('.nav-menu');
    const loginButton = document.createElement('li');
    loginButton.innerHTML = '<a href="#" class="nav-link"><i class="fas fa-user"></i> Iniciar sesión</a>';
    navMenu.appendChild(loginButton);
    
    // El resto del sistema puede implementarse con localStorage para una solución simple
    // o Firebase/Auth0 para una solución más robusta
}

// Estructura de datos para colecciones
const collections = {
    "matematicas": {
        name: "Retos matemáticos",
        icon: "fas fa-calculator",
        locks: [] // IDs de candados relacionados
    },
    "historia": {
        name: "Aventuras históricas", 
        icon: "fas fa-landmark",
        locks: []
    }
};

// Función para mostrar colecciones
function displayCollections() {
    const container = document.createElement('div');
    container.className = 'collections-grid';
    
    Object.values(collections).forEach(collection => {
        const card = document.createElement('div');
        card.className = 'collection-card';
        card.innerHTML = `
            <i class="${collection.icon}"></i>
            <h3>${collection.name}</h3>
            <span class="lock-count">${collection.locks.length} candados</span>
        `;
        container.appendChild(card);
    });
    
    return container;
}

// En la creación de candados, añadir:
<div class="form-group">
    <label for="lockCollection">Añadir a colección</label>
    <select id="lockCollection">
        <option value="">-- Sin colección --</option>
        <!-- Opciones generadas dinámicamente -->
    </select>
</div>

<div class="form-group">
    <label for="lockTags">Etiquetas (separadas por comas)</label>
    <input type="text" id="lockTags" placeholder="matemáticas, primaria, geometría...">
</div>

<div class="form-group">
    <label for="lockExpiration">Fecha de expiración (opcional)</label>
    <input type="date" id="lockExpiration">
</div>

<div class="form-group">
    <label for="lockDirectory">Almacenado en el directorio:</label>
    <div class="directory-selector">
        <input type="text" id="lockDirectory" value="Sin directorio" readonly>
        <button class="btn btn-secondary" id="editDirectory">Editar</button>
    </div>
</div>

// En historial.js, modificar renderHistory para incluir información de colección
renderHistory(historyItems) {
    // Código actual...
    
    this.historyList.innerHTML = historyItems.map(item => {
        let badge = '';
        if (item.difficulty) {
            let label = item.difficulty === 'easy' ? 'Fácil' : item.difficulty === 'medium' ? 'Medio' : 'Difícil';
            badge = `<span class="difficulty-badge difficulty-${item.difficulty}">${label}</span>`;
        }
        
        let collection = '';
        if (item.collection) {
            collection = `<span class="collection-badge">${item.collection}</span>`;
        }
        
        let accessCode = '';
        if (item.accessCode) {
            accessCode = `<span class="access-code">Código: ${item.accessCode}</span>`;
        }
        
        return `
        <li class="history-item">
            <div class="history-item-content">
                <span class="history-item-name">${item.name}</span>
                ${badge}
                ${collection}
                ${accessCode}
                <span class="history-item-type">${this.getTypeLabel(item.type)}</span>
                <span class="history-item-date">${new Date(item.timestamp).toLocaleString()}</span>
            </div>
            <div class="history-item-actions">
                <button class="btn-copy" data-code="${item.code}">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="btn-qr" data-id="${item.id}">
                    <i class="fas fa-qrcode"></i>
                </button>
                <button class="btn-delete" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </li>
        `;
    }).join('');
}

function createRichTextEditor() {
    const editorContainer = document.createElement('div');
    editorContainer.className = 'rich-text-editor';
    editorContainer.innerHTML = `
        <div class="editor-toolbar">
            <select class="format-select">
                <option>Párrafo</option>
                <option>Encabezado 1</option>
                <option>Encabezado 2</option>
            </select>
            <button class="toolbar-btn" data-format="bold"><i class="fas fa-bold"></i></button>
            <button class="toolbar-btn" data-format="italic"><i class="fas fa-italic"></i></button>
            <button class="toolbar-btn" data-format="underline"><i class="fas fa-underline"></i></button>
            <button class="toolbar-btn" data-format="link"><i class="fas fa-link"></i></button>
        </div>
        <div class="editor-content" contenteditable="true"></div>
    `;
    
    return editorContainer;
}

/* Agregar a tu archivo CSS */
.option-group {
    margin-bottom: 15px;
}

.radio-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-left: 15px;
}

.directory-selector {
    display: flex;
    gap: 10px;
}

.rich-text-editor {
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
}

.editor-toolbar {
    display: flex;
    padding: 8px;
    background-color: var(--surface-color);
    border-bottom: 1px solid var(--border-color);
}

.toolbar-btn {
    width: 36px;
    height: 36px;
    background: none;
    border: 1px solid transparent;
    border-radius: 4px;
    cursor: pointer;
}

.toolbar-btn:hover {
    background-color: var(--hover-color);
    border: 1px solid var(--border-color);
}

.editor-content {
    min-height: 150px;
    padding: 12px;
    background-color: var(--background-color);
} 