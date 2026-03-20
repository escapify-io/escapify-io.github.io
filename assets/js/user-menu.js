// Gestor del menú de usuario
class UserMenu {
    constructor() {
        this.userMenuBtn = null;
        this.userMenuDropdown = null;
        this.init();
    }

    init() {
        this.userMenuBtn = document.getElementById('userMenuBtn');
        this.userMenuDropdown = document.getElementById('userMenuDropdown');
        
        if (!this.userMenuBtn || !this.userMenuDropdown) return;

        // Verificar si hay usuario logueado
        this.updateMenuVisibility();

        // Toggle del menú
        this.userMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Cerrar al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!this.userMenuBtn.contains(e.target) && !this.userMenuDropdown.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Cerrar con Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.closeMenu();
                this.userMenuBtn.focus();
            }
        });

        // Manejar botón de cerrar sesión
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                this.handleLogout();
            });
        }

        // Escuchar cambios en el usuario
        window.addEventListener('storage', (e) => {
            if (e.key === 'escapify_user') {
                this.updateMenuVisibility();
            }
        });
    }

    updateMenuVisibility() {
        try {
            const userInfo = JSON.parse(localStorage.getItem('escapify_user') || '{}');
            const isLoggedIn = userInfo && userInfo.name;

            const loginMenuItem = document.getElementById('loginMenuItem');
            const profileMenuItem = document.getElementById('profileMenuItem');
            const historyMenuItem = document.getElementById('historyMenuItem');
            const panelMenuItem = document.getElementById('panelMenuItem');
            const menuDivider = document.getElementById('menuDivider');
            const logoutBtn = document.getElementById('logoutBtn');

            if (isLoggedIn) {
                if (loginMenuItem) loginMenuItem.style.display = 'none';
                if (profileMenuItem) profileMenuItem.style.display = 'flex';
                if (historyMenuItem) historyMenuItem.style.display = 'flex';
                if (panelMenuItem) panelMenuItem.style.display = 'flex';
                if (menuDivider) menuDivider.style.display = 'block';
                if (logoutBtn) logoutBtn.style.display = 'flex';
            } else {
                if (loginMenuItem) loginMenuItem.style.display = 'flex';
                if (profileMenuItem) profileMenuItem.style.display = 'none';
                if (historyMenuItem) historyMenuItem.style.display = 'none';
                if (panelMenuItem) panelMenuItem.style.display = 'none';
                if (menuDivider) menuDivider.style.display = 'none';
                if (logoutBtn) logoutBtn.style.display = 'none';
            }
        } catch (error) {
            console.error('Error actualizando visibilidad del menú:', error);
        }
    }

    toggleMenu() {
        const isExpanded = this.userMenuBtn.getAttribute('aria-expanded') === 'true';
        this.userMenuBtn.setAttribute('aria-expanded', !isExpanded);
        this.userMenuDropdown.classList.toggle('active');
    }

    closeMenu() {
        this.userMenuBtn.setAttribute('aria-expanded', 'false');
        this.userMenuDropdown.classList.remove('active');
    }

    isOpen() {
        return this.userMenuDropdown.classList.contains('active');
    }

    handleLogout() {
        // Limpiar datos de sesión
        localStorage.removeItem('escapify_user');
        this.updateMenuVisibility();
        if (window.notificationManager) {
            window.notificationManager.info('Sesión cerrada');
        }
        this.closeMenu();
        
        // Redirigir a login si estamos en una página que requiere autenticación
        const protectedPages = ['/perfil.html', '/panel.html'];
        if (protectedPages.includes(window.location.pathname)) {
            setTimeout(() => {
                window.location.href = '/';
            }, 500);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.userMenu = new UserMenu();
});

