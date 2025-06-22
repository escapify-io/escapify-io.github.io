class Navigation {
    constructor() {
        this.mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.currentPath = window.location.pathname;

        this.initializeNavigation();
        this.attachEventListeners();
    }

    initializeNavigation() {
        // Marcar el enlace activo basado en la ruta actual
        this.navLinks.forEach(link => {
            const linkPath = link.getAttribute('href');
            if (this.currentPath === linkPath) {
                link.classList.add('active');
            }
        });

        // Cerrar el menú móvil si está abierto al cambiar el tamaño de la ventana
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.navMenu.classList.contains('active')) {
                this.navMenu.classList.remove('active');
            }
        });
    }

    attachEventListeners() {
        // Toggle del menú móvil
        this.mobileMenuBtn.addEventListener('click', () => {
            this.navMenu.classList.toggle('active');
            this.mobileMenuBtn.setAttribute('aria-expanded', 
                this.navMenu.classList.contains('active'));
        });

        // Cerrar el menú móvil al hacer clic en un enlace
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    this.navMenu.classList.remove('active');
                }
            });
        });

        // Cerrar el menú móvil al hacer clic fuera
        document.addEventListener('click', (e) => {
            if (!this.navMenu.contains(e.target) && 
                !this.mobileMenuBtn.contains(e.target) && 
                this.navMenu.classList.contains('active')) {
                this.navMenu.classList.remove('active');
            }
        });

        // Cerrar el menú móvil al pulsar ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.navMenu.classList.contains('active')) {
                this.navMenu.classList.remove('active');
                this.mobileMenuBtn.focus();
            }
        });
    }
}

// Inicializar la navegación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const navigation = new Navigation();
}); 