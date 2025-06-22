class ThemeManager {
    static init() {
        // Cargar preferencias guardadas
        const preferences = JSON.parse(localStorage.getItem('appPreferences') || '{}');
        const savedTheme = preferences.theme || 'light';
        
        // Aplicar tema guardado
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Agregar botón de tema al header si no existe
        this.addThemeToggle();
        
        // Inicializar listeners
        this.setupThemeListeners();
    }

    static addThemeToggle() {
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && !document.querySelector('.theme-toggle')) {
            const themeToggle = document.createElement('li');
            themeToggle.innerHTML = `
                <button class="theme-toggle" id="themeToggle" aria-label="Cambiar tema">
                    <i class="fas fa-${document.documentElement.getAttribute('data-theme') === 'light' ? 'moon' : 'sun'}"></i>
                </button>
            `;
            navMenu.appendChild(themeToggle);
        }
    }

    static setupThemeListeners() {
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme');
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                
                // Actualizar tema
                document.documentElement.setAttribute('data-theme', newTheme);
                
                // Actualizar icono
                themeToggle.innerHTML = `
                    <i class="fas fa-${newTheme === 'light' ? 'moon' : 'sun'}"></i>
                `;
                
                // Guardar preferencia
                this.savePreferences(newTheme);
            });
        }
    }

    static savePreferences(theme) {
        const preferences = JSON.parse(localStorage.getItem('appPreferences') || '{}');
        preferences.theme = theme;
        localStorage.setItem('appPreferences', JSON.stringify(preferences));
    }

    static getCurrentTheme() {
        return document.documentElement.getAttribute('data-theme');
    }

    static isDarkMode() {
        return this.getCurrentTheme() === 'dark';
    }
}

// Inicializar el gestor de temas cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});

// Exportar para uso en otros módulos
export default ThemeManager; 