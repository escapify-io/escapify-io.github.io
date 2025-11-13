# PWA - Progressive Web App

Escapify ahora es una Progressive Web App (PWA) instalable que funciona offline.

## Características PWA

### ✅ Instalable
- La aplicación se puede instalar en dispositivos móviles y de escritorio
- Aparece como una aplicación nativa
- Acceso rápido desde el escritorio/home screen

### ✅ Funcionamiento Offline
- Los recursos principales se cachean automáticamente
- La aplicación funciona sin conexión a internet
- Los datos se guardan en localStorage

### ✅ Actualizaciones Automáticas
- El Service Worker verifica actualizaciones periódicamente
- Notificación cuando hay una nueva versión disponible
- Actualización con un solo clic

## Cómo Instalar

### En Chrome/Edge (Desktop)
1. Visita la web de Escapify
2. Busca el icono de instalación en la barra de direcciones
3. Haz clic en "Instalar" o "Añadir a pantalla de inicio"

### En Chrome/Edge (Android)
1. Visita la web de Escapify
2. Aparecerá un banner de instalación
3. Toca "Añadir a pantalla de inicio"

### En Safari (iOS)
1. Visita la web de Escapify
2. Toca el botón de compartir
3. Selecciona "Añadir a pantalla de inicio"

## Archivos PWA

- `manifest.json` - Configuración de la aplicación
- `sw.js` - Service Worker para caché y offline
- `assets/js/pwa.js` - Gestión de instalación y actualizaciones

## Notas

- Los iconos de la aplicación deben estar en `/assets/images/`
- El Service Worker se registra automáticamente al cargar la página
- La caché se actualiza automáticamente cuando hay cambios

## Iconos Requeridos

Para que la PWA funcione completamente, necesitas crear los siguientes iconos en `/assets/images/`:

- `icon-72x72.png`
- `icon-96x96.png`
- `icon-128x128.png`
- `icon-144x144.png`
- `icon-152x152.png`
- `icon-192x192.png`
- `icon-384x384.png`
- `icon-512x512.png`

Puedes generar estos iconos desde una imagen base usando herramientas como:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

