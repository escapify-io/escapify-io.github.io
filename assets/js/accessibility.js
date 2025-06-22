/**
 * Accessibility Module for Escapify
 * Gestiona funcionalidades de accesibilidad incluyendo ColorADD y adaptaciones
 * para diferentes tipos de necesidades.
 */
class AccessibilityManager {
    constructor() {
        // Inicialización de variables
        this.body = document.body;
        this.colorAddEnabled = false;
        this.highContrastEnabled = false;
        this.readableTextEnabled = false;
        this.simplifiedUiEnabled = false;
        this.seniorUiEnabled = false;
        this.kidsUiEnabled = false;
        
        // Crear panel de accesibilidad
        this.createAccessibilityPanel();
        
        // Inicializar eventos
        this.initEvents();
        
        // Cargar preferencias
        this.loadPreferences();
        
        // Inicializar ColorADD
        this.initColorAdd();
    }
    
    /**
     * Crea el panel de accesibilidad en la UI
     */
    createAccessibilityPanel() {
        // Crear el botón de accesibilidad
        const accessButton = document.createElement('button');
        accessButton.className = 'accessibility-toggle';
        accessButton.innerHTML = '<i class="fas fa-universal-access"></i>';
        accessButton.setAttribute('aria-label', 'Opciones de accesibilidad');
        
        // Crear el panel
        const accessPanel = document.createElement('div');
        accessPanel.className = 'accessibility-panel';
        accessPanel.innerHTML = `
            <h2>Opciones de accesibilidad</h2>
            
            <div class="accessibility-section">
                <h3>Daltonismo</h3>
                <div class="accessibility-option">
                    <input type="checkbox" id="coloradd-toggle" name="coloradd-toggle">
                    <label for="coloradd-toggle">Activar ColorADD (ayuda para daltónicos)</label>
                </div>
            </div>
            
            <div class="accessibility-section">
                <h3>Discapacidad Visual</h3>
                <div class="accessibility-option">
                    <input type="checkbox" id="high-contrast-toggle" name="high-contrast-toggle">
                    <label for="high-contrast-toggle">Alto contraste</label>
                </div>
                <div class="accessibility-option">
                    <input type="checkbox" id="negative-contrast-toggle" name="negative-contrast-toggle">
                    <label for="negative-contrast-toggle">Contraste negativo</label>
                </div>
                <div class="accessibility-option">
                    <input type="checkbox" id="grayscale-toggle" name="grayscale-toggle">
                    <label for="grayscale-toggle">Escala de grises</label>
                </div>
                <div class="accessibility-option">
                    <input type="checkbox" id="light-bg-toggle" name="light-bg-toggle">
                    <label for="light-bg-toggle">Fondo claro</label>
                </div>
                <div class="accessibility-option">
                    <input type="checkbox" id="readable-text-toggle" name="readable-text-toggle">
                    <label for="readable-text-toggle">Texto más legible</label>
                </div>
                <div class="accessibility-option">
                    <input type="checkbox" id="underline-links-toggle" name="underline-links-toggle">
                    <label for="underline-links-toggle">Subrayar enlaces</label>
                </div>
                <div class="accessibility-option">
                    <button id="increase-text-btn" class="btn btn-secondary" style="margin-right: 8px;"><i class="fas fa-search-plus"></i> Aumentar texto</button>
                    <button id="decrease-text-btn" class="btn btn-secondary"><i class="fas fa-search-minus"></i> Disminuir texto</button>
                </div>
            </div>
            
            <div class="accessibility-section">
                <h3>Facilidad de Uso</h3>
                <div class="accessibility-option">
                    <input type="checkbox" id="simplified-ui-toggle" name="simplified-ui-toggle">
                    <label for="simplified-ui-toggle">Interfaz simplificada</label>
                </div>
                <div class="accessibility-option">
                    <input type="checkbox" id="senior-ui-toggle" name="senior-ui-toggle">
                    <label for="senior-ui-toggle">Modo para mayores</label>
                </div>
                <div class="accessibility-option">
                    <input type="checkbox" id="kids-ui-toggle" name="kids-ui-toggle">
                    <label for="kids-ui-toggle">Modo para niños</label>
                </div>
            </div>
            <div class="accessibility-section">
                <button id="accessibility-reset" class="btn btn-primary" style="width:100%;margin-top:10px;"><i class="fas fa-undo"></i> Restablecer</button>
            </div>
            <button id="accessibility-close" class="btn btn-secondary">Cerrar</button>
        `;
        
        // Añadir al DOM
        document.body.appendChild(accessButton);
        document.body.appendChild(accessPanel);
        
        // Guardar referencias
        this.accessButton = accessButton;
        this.accessPanel = accessPanel;
    }
    
    /**
     * Inicializa los eventos para las opciones de accesibilidad
     */
    initEvents() {
        // Toggle panel de accesibilidad
        this.accessButton.addEventListener('click', () => {
            this.accessPanel.classList.toggle('active');
            const isExpanded = this.accessPanel.classList.contains('active');
            this.accessButton.setAttribute('aria-expanded', isExpanded);
        });
        
        // Botón cerrar
        document.getElementById('accessibility-close').addEventListener('click', () => {
            this.accessPanel.classList.remove('active');
            this.accessButton.setAttribute('aria-expanded', false);
        });
        
        // Aumentar texto
        document.getElementById('increase-text-btn').addEventListener('click', () => {
            this.changeFontSize(1);
        });
        
        // Disminuir texto
        document.getElementById('decrease-text-btn').addEventListener('click', () => {
            this.changeFontSize(-1);
        });
        
        // Escala de grises
        document.getElementById('grayscale-toggle').addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('grayscale');
            } else {
                document.body.classList.remove('grayscale');
            }
        });
        
        // Contraste negativo
        document.getElementById('negative-contrast-toggle').addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('negative-contrast');
            } else {
                document.body.classList.remove('negative-contrast');
            }
        });
        
        // Fondo claro
        document.getElementById('light-bg-toggle').addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('light-bg');
            } else {
                document.body.classList.remove('light-bg');
            }
        });
        
        // Subrayar enlaces
        document.getElementById('underline-links-toggle').addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('underline-links');
            } else {
                document.body.classList.remove('underline-links');
            }
        });
        
        // Restablecer
        document.getElementById('accessibility-reset').addEventListener('click', () => {
            this.resetAccessibility();
        });
        
        // Eventos para los toggles
        document.getElementById('coloradd-toggle').addEventListener('change', (e) => {
            this.colorAddEnabled = e.target.checked;
            this.toggleColorAdd(this.colorAddEnabled);
            this.savePreferences();
        });
        
        document.getElementById('high-contrast-toggle').addEventListener('change', (e) => {
            this.highContrastEnabled = e.target.checked;
            this.toggleHighContrast(this.highContrastEnabled);
            this.savePreferences();
        });
        
        document.getElementById('readable-text-toggle').addEventListener('change', (e) => {
            this.readableTextEnabled = e.target.checked;
            this.toggleReadableText(this.readableTextEnabled);
            this.savePreferences();
        });
        
        document.getElementById('simplified-ui-toggle').addEventListener('change', (e) => {
            this.simplifiedUiEnabled = e.target.checked;
            this.toggleSimplifiedUi(this.simplifiedUiEnabled);
            this.savePreferences();
        });
        
        document.getElementById('senior-ui-toggle').addEventListener('change', (e) => {
            this.seniorUiEnabled = e.target.checked;
            this.toggleSeniorUi(this.seniorUiEnabled);
            this.savePreferences();
        });
        
        document.getElementById('kids-ui-toggle').addEventListener('change', (e) => {
            this.kidsUiEnabled = e.target.checked;
            this.toggleKidsUi(this.kidsUiEnabled);
            this.savePreferences();
        });
        
        // Teclas de acceso rápido
        document.addEventListener('keydown', (e) => {
            // Alt + A para abrir/cerrar panel de accesibilidad
            if (e.altKey && e.key === 'a') {
                this.accessPanel.classList.toggle('active');
                const isExpanded = this.accessPanel.classList.contains('active');
                this.accessButton.setAttribute('aria-expanded', isExpanded);
            }
        });
    }
    
    /**
     * Inicializa ColorADD añadiendo los símbolos a elementos basados en color
     */
    initColorAdd() {
        // Añadir ColorADD a los badges de dificultad
        document.querySelectorAll('.difficulty-badge').forEach(badge => {
            const symbol = document.createElement('span');
            symbol.className = 'coloradd-symbol';
            symbol.setAttribute('aria-hidden', 'true');
            badge.appendChild(symbol);
            
            // Tooltip para explicar el símbolo
            badge.classList.add('coloradd-tooltip');
            
            if (badge.classList.contains('difficulty-easy')) {
                badge.setAttribute('data-coloradd-tooltip', 'Verde - Dificultad fácil');
            } else if (badge.classList.contains('difficulty-medium')) {
                badge.setAttribute('data-coloradd-tooltip', 'Amarillo - Dificultad media');
            } else if (badge.classList.contains('difficulty-hard')) {
                badge.setAttribute('data-coloradd-tooltip', 'Rojo - Dificultad difícil');
            }
        });
        
        // Añadir ColorADD a los botones de filtro de dificultad
        document.querySelectorAll('.difficulty-filter-btn').forEach(btn => {
            const symbol = document.createElement('span');
            symbol.className = 'coloradd-symbol';
            symbol.setAttribute('aria-hidden', 'true');
            btn.appendChild(symbol);
            
            // Tooltip para explicar el símbolo
            btn.classList.add('coloradd-tooltip');
            
            if (btn.classList.contains('easy')) {
                btn.setAttribute('data-coloradd-tooltip', 'Verde - Dificultad fácil');
            } else if (btn.classList.contains('medium')) {
                btn.setAttribute('data-coloradd-tooltip', 'Amarillo - Dificultad media');
            } else if (btn.classList.contains('hard')) {
                btn.setAttribute('data-coloradd-tooltip', 'Rojo - Dificultad difícil');
            }
        });
        
        // Por defecto, los símbolos están ocultos
        this.toggleColorAdd(false);
    }
    
    /**
     * Activa/desactiva los símbolos ColorADD
     */
    toggleColorAdd(enabled) {
        const symbols = document.querySelectorAll('.coloradd-symbol');
        symbols.forEach(symbol => {
            symbol.style.display = enabled ? 'inline-block' : 'none';
        });
        
        // Actualizar el checkbox
        document.getElementById('coloradd-toggle').checked = enabled;
        
        if (enabled) {
            this.body.classList.add('daltonismo-activo');
        } else {
            this.body.classList.remove('daltonismo-activo');
        }
    }
    
    /**
     * Activa/desactiva el modo de alto contraste
     */
    toggleHighContrast(enabled) {
        if (enabled) {
            this.body.classList.add('high-contrast');
        } else {
            this.body.classList.remove('high-contrast');
        }
        
        // Actualizar el checkbox
        document.getElementById('high-contrast-toggle').checked = enabled;
    }
    
    /**
     * Activa/desactiva el modo de texto más legible
     */
    toggleReadableText(enabled) {
        if (enabled) {
            this.body.classList.add('readable-text');
        } else {
            this.body.classList.remove('readable-text');
        }
        
        // Actualizar el checkbox
        document.getElementById('readable-text-toggle').checked = enabled;
    }
    
    /**
     * Activa/desactiva la interfaz simplificada
     */
    toggleSimplifiedUi(enabled) {
        if (enabled) {
            this.body.classList.add('simplified-ui');
            
            // Desactivar otros modos incompatibles
            this.kidsUiEnabled = false;
            this.toggleKidsUi(false);
            this.seniorUiEnabled = false;
            this.toggleSeniorUi(false);
        } else {
            this.body.classList.remove('simplified-ui');
        }
        
        // Actualizar el checkbox
        document.getElementById('simplified-ui-toggle').checked = enabled;
    }
    
    /**
     * Activa/desactiva la interfaz para adultos mayores
     */
    toggleSeniorUi(enabled) {
        if (enabled) {
            this.body.classList.add('senior-ui');
            
            // Desactivar otros modos incompatibles
            this.kidsUiEnabled = false;
            this.toggleKidsUi(false);
            this.simplifiedUiEnabled = false;
            this.toggleSimplifiedUi(false);
        } else {
            this.body.classList.remove('senior-ui');
        }
        
        // Actualizar el checkbox
        document.getElementById('senior-ui-toggle').checked = enabled;
    }
    
    /**
     * Activa/desactiva la interfaz para niños
     */
    toggleKidsUi(enabled) {
        if (enabled) {
            this.body.classList.add('kids-ui');
            
            // Desactivar otros modos incompatibles
            this.seniorUiEnabled = false;
            this.toggleSeniorUi(false);
            this.simplifiedUiEnabled = false;
            this.toggleSimplifiedUi(false);
        } else {
            this.body.classList.remove('kids-ui');
        }
        
        // Actualizar el checkbox
        document.getElementById('kids-ui-toggle').checked = enabled;
    }
    
    /**
     * Guarda las preferencias en localStorage
     */
    savePreferences() {
        const preferences = {
            colorAdd: this.colorAddEnabled,
            highContrast: this.highContrastEnabled,
            readableText: this.readableTextEnabled,
            simplifiedUi: this.simplifiedUiEnabled,
            seniorUi: this.seniorUiEnabled,
            kidsUi: this.kidsUiEnabled
        };
        
        localStorage.setItem('escapify_accessibility', JSON.stringify(preferences));
    }
    
    /**
     * Carga las preferencias de localStorage
     */
    loadPreferences() {
        const savedPrefs = localStorage.getItem('escapify_accessibility');
        
        if (savedPrefs) {
            const preferences = JSON.parse(savedPrefs);
            
            // Aplicar preferencias
            this.toggleColorAdd(preferences.colorAdd);
            this.toggleHighContrast(preferences.highContrast);
            this.toggleReadableText(preferences.readableText);
            this.toggleSimplifiedUi(preferences.simplifiedUi);
            this.toggleSeniorUi(preferences.seniorUi);
            this.toggleKidsUi(preferences.kidsUi);
            
            // Actualizar variables
            this.colorAddEnabled = preferences.colorAdd;
            this.highContrastEnabled = preferences.highContrast;
            this.readableTextEnabled = preferences.readableText;
            this.simplifiedUiEnabled = preferences.simplifiedUi;
            this.seniorUiEnabled = preferences.seniorUi;
            this.kidsUiEnabled = preferences.kidsUi;
        }
    }
    
    // Cambia el tamaño de fuente global (acumulativo, reversible)
    changeFontSize(delta) {
        const html = document.documentElement;
        let current = parseFloat(html.style.fontSize) || 16;
        let next = current + delta;
        if (next < 12) next = 12;
        if (next > 28) next = 28;
        html.style.fontSize = next + 'px';
    }
    
    // Restablece todas las opciones de accesibilidad
    resetAccessibility() {
        // Quitar todas las clases
        document.body.classList.remove('grayscale', 'negative-contrast', 'light-bg', 'underline-links');
        // Quitar tamaño de fuente
        document.documentElement.style.fontSize = '';
        // Quitar todos los checkboxes
        [
            'coloradd-toggle',
            'high-contrast-toggle',
            'negative-contrast-toggle',
            'grayscale-toggle',
            'light-bg-toggle',
            'readable-text-toggle',
            'underline-links-toggle',
            'simplified-ui-toggle',
            'senior-ui-toggle',
            'kids-ui-toggle'
        ].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.checked = false;
        });
        // Quitar modos existentes
        this.toggleColorAdd(false);
        this.toggleHighContrast(false);
        this.toggleReadableText(false);
        this.toggleSimplifiedUi(false);
        this.toggleSeniorUi(false);
        this.toggleKidsUi(false);
    }
}

// Inicializar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityManager = new AccessibilityManager();
    
    // Añadir skip to content link si no existe
    if (!document.querySelector('.skip-to-content')) {
        const skipLink = document.createElement('a');
        skipLink.className = 'skip-to-content';
        skipLink.href = '#main-content';
        skipLink.textContent = 'Saltar al contenido principal';
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}); 