/**
 * Sistema de breadcrumbs (migas de pan) para navegación
 */
class BreadcrumbsManager {
    constructor() {
        this.breadcrumbs = [];
        this.init();
    }

    init() {
        // Crear contenedor de breadcrumbs si no existe
        if (!document.querySelector('.breadcrumbs-container')) {
            this.createContainer();
        }
        this.updateBreadcrumbs();
    }

    createContainer() {
        const container = document.createElement('nav');
        container.className = 'breadcrumbs-container';
        container.setAttribute('aria-label', 'Breadcrumb');
        
        const mainContent = document.querySelector('main#main-content');
        if (mainContent) {
            mainContent.insertBefore(container, mainContent.firstChild);
        } else {
            document.body.insertBefore(container, document.body.firstChild);
        }
    }

    /**
     * Define las breadcrumbs basándose en la página actual
     */
    setBreadcrumbs(items) {
        this.breadcrumbs = items;
        this.updateBreadcrumbs();
    }

    /**
     * Actualiza el HTML de las breadcrumbs
     */
    updateBreadcrumbs() {
        const container = document.querySelector('.breadcrumbs-container');
        if (!container) return;

        // Si no hay breadcrumbs definidas, generarlas automáticamente
        if (this.breadcrumbs.length === 0) {
            this.breadcrumbs = this.generateBreadcrumbs();
        }

        if (this.breadcrumbs.length === 0) return;

        const ol = document.createElement('ol');
        ol.className = 'breadcrumbs';
        ol.setAttribute('itemscope', '');
        ol.setAttribute('itemtype', 'https://schema.org/BreadcrumbList');

        this.breadcrumbs.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'breadcrumb-item';
            li.setAttribute('itemprop', 'itemListElement');
            li.setAttribute('itemscope', '');
            li.setAttribute('itemtype', 'https://schema.org/ListItem');

            const isLast = index === this.breadcrumbs.length - 1;
            const span = document.createElement('span');
            span.setAttribute('itemprop', 'name');
            span.textContent = item.label;

            if (isLast) {
                li.classList.add('breadcrumb-active');
                li.setAttribute('aria-current', 'page');
                li.appendChild(span);
            } else {
                const a = document.createElement('a');
                a.href = item.url || '#';
                a.setAttribute('itemprop', 'item');
                a.appendChild(span);
                li.appendChild(a);
            }

            const meta = document.createElement('meta');
            meta.setAttribute('itemprop', 'position');
            meta.content = index + 1;
            li.appendChild(meta);

            ol.appendChild(li);
        });

        container.innerHTML = '';
        container.appendChild(ol);
    }

    /**
     * Genera breadcrumbs automáticamente basándose en la URL
     */
    generateBreadcrumbs() {
        const path = window.location.pathname;
        const breadcrumbs = [
            { label: 'Inicio', url: '/' }
        ];

        // Mapeo de rutas a etiquetas
        const routeMap = {
            '/generador.html': 'Generador',
            '/historial.html': 'Historial',
            '/recursos.html': 'Recursos',
            '/cifrados.html': 'Cifrados',
            '/ayuda.html': 'Ayuda',
            '/crear-escape.html': 'Crear Escape Room'
        };

        if (path !== '/' && path !== '/index.html') {
            const label = routeMap[path] || path.split('/').pop().replace('.html', '').replace('-', ' ');
            breadcrumbs.push({
                label: label.charAt(0).toUpperCase() + label.slice(1),
                url: path
            });
        }

        return breadcrumbs;
    }
}

// Inicializar breadcrumbs cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.breadcrumbsManager = new BreadcrumbsManager();
});

