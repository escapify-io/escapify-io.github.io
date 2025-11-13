/**
 * Sistema de atajos de teclado globales para Escapify
 * Mejora la accesibilidad y productividad
 */
class KeyboardShortcuts {
    constructor() {
        this.shortcuts = new Map();
        this.commandPalette = null;
        this.isCommandPaletteOpen = false;
        this.initializeShortcuts();
        this.setupGlobalListeners();
    }

    initializeShortcuts() {
        // Atajos básicos
        this.registerShortcut('ctrl+n', () => this.createNewLock(), 'Crear nuevo candado');
        this.registerShortcut('ctrl+s', () => this.saveCurrent(), 'Guardar');
        this.registerShortcut('ctrl+f', () => this.focusSearch(), 'Buscar');
        this.registerShortcut('ctrl+k', () => this.openCommandPalette(), 'Abrir paleta de comandos');
        this.registerShortcut('ctrl+/', () => this.showShortcutsHelp(), 'Mostrar atajos de teclado');
        this.registerShortcut('escape', () => this.handleEscape(), 'Cerrar modales/paleta');
        
        // Navegación
        this.registerShortcut('g h', () => this.navigateTo('/historial.html'), 'Ir a Historial');
        this.registerShortcut('g g', () => this.navigateTo('/generador.html'), 'Ir a Generador');
        this.registerShortcut('g r', () => this.navigateTo('/recursos.html'), 'Ir a Recursos');
        this.registerShortcut('g c', () => this.navigateTo('/cifrados.html'), 'Ir a Cifrados');
        this.registerShortcut('g a', () => this.navigateTo('/ayuda.html'), 'Ir a Ayuda');
        this.registerShortcut('g e', () => this.navigateTo('/crear-escape.html'), 'Crear Escape Room');
    }

    registerShortcut(keys, handler, description) {
        this.shortcuts.set(keys.toLowerCase(), { handler, description });
    }

    setupGlobalListeners() {
        document.addEventListener('keydown', (e) => {
            // Ignorar si está escribiendo en un input, textarea o contenteditable
            const target = e.target;
            if (target.tagName === 'INPUT' || 
                target.tagName === 'TEXTAREA' || 
                target.isContentEditable ||
                target.closest('input, textarea, [contenteditable]')) {
                // Permitir algunos atajos incluso en inputs
                if (e.key === 'Escape' || (e.ctrlKey && e.key === 'k')) {
                    // Permitir estos
                } else {
                    return;
                }
            }

            const key = this.getKeyString(e);
            const shortcut = this.shortcuts.get(key);
            
            if (shortcut) {
                e.preventDefault();
                shortcut.handler();
            }

            // Manejar secuencias de teclas (como 'g h')
            this.handleKeySequence(e);
        });
    }

    getKeyString(e) {
        const parts = [];
        if (e.ctrlKey || e.metaKey) parts.push('ctrl');
        if (e.altKey) parts.push('alt');
        if (e.shiftKey) parts.push('shift');
        parts.push(e.key.toLowerCase());
        return parts.join('+');
    }

    handleKeySequence(e) {
        // Sistema de secuencias (ej: 'g' seguido de 'h')
        if (!this.lastKeyTime) this.lastKeyTime = 0;
        if (!this.keySequence) this.keySequence = '';

        const now = Date.now();
        if (now - this.lastKeyTime > 1000) {
            this.keySequence = '';
        }

        // Solo procesar teclas simples (no modificadores)
        if (!e.ctrlKey && !e.altKey && !e.metaKey && e.key.length === 1) {
            this.keySequence += e.key.toLowerCase();
            this.lastKeyTime = now;

            // Buscar atajos que empiecen con esta secuencia
            const matchingShortcut = Array.from(this.shortcuts.keys()).find(key => 
                key.startsWith(this.keySequence) && key.length > this.keySequence.length
            );

            if (!matchingShortcut) {
                // No hay coincidencia, resetear
                setTimeout(() => {
                    if (Date.now() - this.lastKeyTime > 1000) {
                        this.keySequence = '';
                    }
                }, 1000);
            } else if (matchingShortcut === this.keySequence + ' ' + e.key.toLowerCase()) {
                // Secuencia completa
                const shortcut = this.shortcuts.get(matchingShortcut);
                if (shortcut) {
                    e.preventDefault();
                    shortcut.handler();
                    this.keySequence = '';
                }
            }
        }
    }

    createNewLock() {
        if (window.location.pathname.includes('generador.html')) {
            // Ya estamos en el generador, solo mostrar notificación
            if (window.notificationManager) {
                window.notificationManager.info('Ya estás en el generador de candados');
            }
        } else {
            window.location.href = '/generador.html';
        }
    }

    saveCurrent() {
        // Intentar guardar según el contexto
        const saveButton = document.querySelector('[data-action="save"], .btn-save, #saveBtn');
        if (saveButton && !saveButton.disabled) {
            saveButton.click();
            if (window.notificationManager) {
                window.notificationManager.success('Guardado');
            }
        } else {
            if (window.notificationManager) {
                window.notificationManager.info('No hay nada que guardar en este momento');
            }
        }
    }

    focusSearch() {
        const searchInput = document.querySelector('#searchInput, input[type="search"], input[placeholder*="Buscar"]');
        if (searchInput) {
            searchInput.focus();
            searchInput.select();
        } else {
            if (window.notificationManager) {
                window.notificationManager.info('No hay búsqueda disponible en esta página');
            }
        }
    }

    openCommandPalette() {
        if (this.isCommandPaletteOpen) {
            this.closeCommandPalette();
            return;
        }

        this.createCommandPalette();
        this.isCommandPaletteOpen = true;
    }

    createCommandPalette() {
        // Crear paleta de comandos si no existe
        if (this.commandPalette) {
            this.commandPalette.classList.add('visible');
            return;
        }

        const palette = document.createElement('div');
        palette.className = 'command-palette';
        palette.setAttribute('role', 'dialog');
        palette.setAttribute('aria-label', 'Paleta de comandos');
        palette.innerHTML = `
            <div class="command-palette-overlay"></div>
            <div class="command-palette-content">
                <div class="command-palette-header">
                    <input type="text" 
                           class="command-palette-input" 
                           placeholder="Escribe para buscar comandos..." 
                           autocomplete="off"
                           aria-label="Buscar comando">
                    <button class="command-palette-close" aria-label="Cerrar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="command-palette-list" role="listbox">
                    ${this.renderCommandList()}
                </div>
            </div>
        `;
        document.body.appendChild(palette);
        this.commandPalette = palette;

        // Event listeners
        const input = palette.querySelector('.command-palette-input');
        const closeBtn = palette.querySelector('.command-palette-close');
        const overlay = palette.querySelector('.command-palette-overlay');

        input.addEventListener('input', (e) => this.filterCommands(e.target.value));
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCommandPalette();
            } else if (e.key === 'Enter') {
                const selected = palette.querySelector('.command-item.selected');
                if (selected) {
                    selected.click();
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.selectNext();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.selectPrevious();
            }
        });

        closeBtn.addEventListener('click', () => this.closeCommandPalette());
        overlay.addEventListener('click', () => this.closeCommandPalette());

        // Focus en el input
        setTimeout(() => input.focus(), 100);
    }

    renderCommandList() {
        const commands = Array.from(this.shortcuts.entries())
            .filter(([key]) => !key.includes(' ')) // Solo atajos simples
            .map(([key, { description }]) => ({
                key: this.formatKey(key),
                description,
                handler: this.shortcuts.get(key).handler
            }));

        // Añadir comandos de navegación
        commands.push(
            { key: 'G + H', description: 'Ir a Historial', handler: () => this.navigateTo('/historial.html') },
            { key: 'G + G', description: 'Ir a Generador', handler: () => this.navigateTo('/generador.html') },
            { key: 'G + R', description: 'Ir a Recursos', handler: () => this.navigateTo('/recursos.html') },
            { key: 'G + C', description: 'Ir a Cifrados', handler: () => this.navigateTo('/cifrados.html') },
            { key: 'G + A', description: 'Ir a Ayuda', handler: () => this.navigateTo('/ayuda.html') },
            { key: 'G + E', description: 'Crear Escape Room', handler: () => this.navigateTo('/crear-escape.html') }
        );

        return commands.map((cmd, index) => {
            const item = document.createElement('div');
            item.className = 'command-item';
            item.setAttribute('data-index', index);
            item.setAttribute('role', 'option');
            item.innerHTML = `
                <div class="command-key">${cmd.key}</div>
                <div class="command-description">${cmd.description}</div>
            `;
            item.addEventListener('click', () => {
                cmd.handler();
                this.closeCommandPalette();
            });
            return item.outerHTML;
        }).join('');
    }

    formatKey(key) {
        return key.split('+').map(k => {
            if (k === 'ctrl') return 'Ctrl';
            if (k === 'alt') return 'Alt';
            if (k === 'shift') return 'Shift';
            return k.toUpperCase();
        }).join(' + ');
    }

    filterCommands(query) {
        const items = this.commandPalette.querySelectorAll('.command-item');
        const lowerQuery = query.toLowerCase();

        items.forEach((item, index) => {
            const description = item.querySelector('.command-description').textContent.toLowerCase();
            const key = item.querySelector('.command-key').textContent.toLowerCase();
            
            if (description.includes(lowerQuery) || key.includes(lowerQuery)) {
                item.style.display = 'flex';
                if (index === 0) item.classList.add('selected');
            } else {
                item.style.display = 'none';
                item.classList.remove('selected');
            }
        });
    }

    selectNext() {
        const items = Array.from(this.commandPalette.querySelectorAll('.command-item:not([style*="display: none"])'));
        const current = this.commandPalette.querySelector('.command-item.selected');
        const currentIndex = current ? items.indexOf(current) : -1;
        const nextIndex = (currentIndex + 1) % items.length;
        
        if (current) current.classList.remove('selected');
        if (items[nextIndex]) items[nextIndex].classList.add('selected');
    }

    selectPrevious() {
        const items = Array.from(this.commandPalette.querySelectorAll('.command-item:not([style*="display: none"])'));
        const current = this.commandPalette.querySelector('.command-item.selected');
        const currentIndex = current ? items.indexOf(current) : -1;
        const prevIndex = currentIndex <= 0 ? items.length - 1 : currentIndex - 1;
        
        if (current) current.classList.remove('selected');
        if (items[prevIndex]) items[prevIndex].classList.add('selected');
    }

    closeCommandPalette() {
        if (this.commandPalette) {
            this.commandPalette.classList.remove('visible');
            this.isCommandPaletteOpen = false;
        }
    }

    handleEscape() {
        // Cerrar modales abiertos
        const modals = document.querySelectorAll('.modal.visible, .confirm-modal.visible, .command-palette.visible');
        modals.forEach(modal => {
            if (modal.classList.contains('command-palette')) {
                this.closeCommandPalette();
            } else {
                const closeBtn = modal.querySelector('.close-modal, .confirm-modal-close');
                if (closeBtn) closeBtn.click();
            }
        });
    }

    navigateTo(path) {
        window.location.href = path;
    }

    showShortcutsHelp() {
        // Crear modal con todos los atajos
        const shortcutsList = Array.from(this.shortcuts.entries())
            .map(([key, { description }]) => ({
                key: this.formatKey(key),
                description
            }));

        const modal = document.createElement('div');
        modal.className = 'shortcuts-help-modal confirm-modal visible';
        modal.innerHTML = `
            <div class="confirm-modal-overlay"></div>
            <div class="confirm-modal-content" style="max-width: 600px;">
                <div class="confirm-modal-header">
                    <h3 class="confirm-modal-title">Atajos de Teclado</h3>
                    <button class="confirm-modal-close" aria-label="Cerrar">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="confirm-modal-body">
                    <div class="shortcuts-list">
                        ${shortcutsList.map(({ key, description }) => `
                            <div class="shortcut-item">
                                <kbd class="shortcut-key">${key}</kbd>
                                <span class="shortcut-description">${description}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="confirm-modal-footer">
                    <button class="btn btn-primary confirm-modal-confirm">Cerrar</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const close = () => {
            modal.remove();
        };

        modal.querySelector('.confirm-modal-close').addEventListener('click', close);
        modal.querySelector('.confirm-modal-overlay').addEventListener('click', close);
        modal.querySelector('.confirm-modal-confirm').addEventListener('click', close);
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.keyboardShortcuts = new KeyboardShortcuts();
});

