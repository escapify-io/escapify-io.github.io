document.addEventListener('DOMContentLoaded', function() {
  // Selecciona el botón de vista previa de candado numérico
  const previewBtn = document.querySelector('.resource-card a.btn-preview[href$="plantilla-candado-numerico.html"]');
  if (previewBtn) {
    previewBtn.addEventListener('click', function(e) {
      e.preventDefault();
      // 1. Intenta detectar por clase en <html>
      let theme = '';
      if (document.documentElement.classList.contains('dark')) {
        theme = 'dark';
      }
      // 2. Si no hay clase, intenta por localStorage
      if (!theme) {
        const stored = localStorage.getItem('theme');
        if (stored === 'dark') {
          theme = 'dark';
        }
      }
      // 3. Si no hay nada, usa el modo del sistema
      if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : '';
      }
      // 4. Si sigue sin ser dark, forzamos light
      if (theme !== 'dark') {
        theme = 'light';
      }
      // 5. Abre la vista previa con el parámetro correcto
      const url = '/recursos/plantilla-candado-numerico.html?theme=' + theme;
      window.open(url, '_blank');
    });
  }
}); 