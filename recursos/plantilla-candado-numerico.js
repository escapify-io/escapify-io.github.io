document.addEventListener('DOMContentLoaded', function() {
    // Descargar PDF
    document.getElementById('download-pdf').addEventListener('click', function() {
        // Clonar el contenido y forzar fondo blanco y colores para impresión
        const original = document.getElementById('candado-preview');
        const clone = original.cloneNode(true);
        clone.style.background = '#fff';
        clone.style.color = '#111827';
        clone.querySelectorAll('.combination-box').forEach(box => {
            box.style.background = '#f8fafc';
            box.style.color = '#0252CD';
            box.style.borderColor = '#0252CD';
        });
        clone.querySelector('.preview-title').style.color = '#0252CD';
        clone.querySelector('.escapify-logo').style.color = '#0252CD';
        clone.querySelector('.candado-icon').style.color = '#0252CD';
        clone.querySelector('.preview-subtitle').style.color = '#4b5563';
        clone.querySelector('.instructions').style.color = '#111827';
        // Generar PDF desde el clon
        const opt = {
            margin:       [1.5, 1.5, 1.5, 1.5],
            filename:     'plantilla-candado-numerico.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, useCORS: true },
            jsPDF:        { unit: 'cm', format: 'a4', orientation: 'portrait' }
        };
        html2pdf().set(opt).from(clone).save();
    });

    // Gestión del parámetro theme
    function getThemeFromUrl() {
        const params = new URLSearchParams(window.location.search);
        return params.get('theme');
    }
    function applyTheme() {
        const theme = getThemeFromUrl();
        // Elimina clases previas
        document.body.classList.remove('modo-dark', 'modo-light');
        document.documentElement.classList.remove('modo-dark', 'modo-light');
        if (theme === 'dark') {
            document.body.style.background = '#111827';
            document.documentElement.style.background = '#111827';
            document.body.classList.add('modo-dark');
            document.documentElement.classList.add('modo-dark');
        } else if (theme === 'light') {
            document.body.style.background = '#fff';
            document.documentElement.style.background = '#fff';
            document.body.classList.add('modo-light');
            document.documentElement.classList.add('modo-light');
        } else {
            document.body.style.background = '';
            document.documentElement.style.background = '';
        }
    }
    applyTheme();
}); 