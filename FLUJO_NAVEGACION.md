# 📋 Flujo de Navegación - Escapify

## 🗺️ Mapa de Páginas

### Páginas Principales (Menú de Navegación)
1. **Inicio** (`/index.html`) - Página principal
2. **Generador** (`/generador.html`) - Crear candados individuales
3. **Historial** (`/historial.html`) - Ver y gestionar todos los candados
4. **Escape Room** (`/crear-escape.html`) - Crear escape rooms completos
5. **Recursos** (`/recursos.html`) - Plantillas y recursos descargables
6. **Cifrados** (`/cifrados.html`) - Guía de cifrados y códigos
7. **Ayuda** (`/ayuda.html`) - Centro de ayuda y documentación

### Páginas Secundarias (Accesibles desde acciones rápidas)
- **Panel de Control** (`/panel.html`) - Gestión avanzada con directorios
  - Acceso desde: Historial → Botón "Panel de control"
  - Acceso desde: Historial → Botón "Ver historial completo" → Panel

### Páginas de Soporte
- **404** (`/404.html`) - Página de error
- **Privacidad** (`/privacidad.html`) - Política de privacidad
- **Términos** (`/terminos.html`) - Términos de uso
- **Cookies** (`/cookies.html`) - Política de cookies

### Páginas Funcionales
- **Preview** (`/preview.html`) - Vista previa de candados (accesible con parámetro `?id=`)

---

## 🔄 Flujos de Usuario Principales

### Flujo 1: Crear un Candado Individual
```
Inicio → Generador → [Configurar candado] → Guardar → Historial
```

**Pasos detallados:**
1. Usuario va a **Inicio** o **Generador**
2. Selecciona tipo de candado
3. Configura opciones (nombre, código, dificultad, etc.)
4. Guarda el candado
5. El candado aparece en **Historial**
6. Desde Historial puede:
   - Abrir el candado (Preview)
   - Editar el candado (volver a Generador)
   - Mover a directorio (Panel)
   - Exportar/Compartir

### Flujo 2: Gestionar Candados (Panel de Control)
```
Historial → Panel de Control → [Gestionar directorios] → [Mover candados]
```

**Pasos detallados:**
1. Usuario va a **Historial**
2. Clic en "Panel de control"
3. En el Panel puede:
   - Ver estadísticas
   - Crear/editar/eliminar directorios
   - Filtrar candados por directorio
   - Mover candados entre directorios
   - Ver candados organizados

### Flujo 3: Crear un Escape Room
```
Inicio → Escape Room → [Seleccionar candados] → [Configurar] → Guardar
```

**Pasos detallados:**
1. Usuario va a **Inicio** o **Escape Room**
2. Configura información básica
3. Selecciona candados del historial
4. Añade recursos/plantillas
5. Guarda el escape room

### Flujo 4: Buscar y Filtrar Candados
```
Historial → [Filtros] → [Búsqueda] → [Resultados]
```

**Opciones de filtrado:**
- Por dificultad (Fácil, Media, Difícil)
- Por tipo de candado
- Por directorio/colección
- Por fecha
- Por búsqueda de texto
- Ordenar por: fecha, nombre, dificultad

### Flujo 5: Compartir Candados
```
Historial → [Candado] → Compartir → [Enlace/QR]
```

**Opciones de compartir:**
- Copiar enlace directo
- Generar código QR
- Exportar como JSON
- Compartir en escape room

---

## 🔗 Enlaces Rápidos por Página

### index.html
- **Hero Actions:**
  - Crear escape room → `/crear-escape.html`
  - Explorar recursos → `/recursos.html`
- **Enlaces rápidos:**
  - Ver historial completo → `/historial.html`
  - Generador de candados → `/generador.html`

### generador.html
- **Al guardar:**
  - Redirige a Historial o muestra preview
- **Enlaces:**
  - Historial → `/historial.html`
  - Ayuda → `/ayuda.html`

### historial.html
- **Acciones rápidas:**
  - Nuevo candado → `/generador.html`
  - Panel de control → `/panel.html`
  - Crear Escape Room → `/crear-escape.html`
- **Acciones por candado:**
  - Abrir → `/preview.html?id={id}`
  - Editar → `/generador.html?edit={id}`
  - Exportar → Descarga JSON
  - Compartir → Copia enlace

### panel.html
- **Acciones rápidas:**
  - Nuevo candado → `/generador.html`
  - Ver historial completo → `/historial.html`
- **Acciones por candado:**
  - Mover a directorio → Modal de selección
  - Abrir → `/preview.html?id={id}`
  - Editar → `/generador.html?edit={id}`
  - Exportar → Descarga JSON
  - Eliminar → Confirmación

### crear-escape.html
- **Enlaces:**
  - Historial → `/historial.html`
  - Generador → `/generador.html`
  - Recursos → `/recursos.html`

---

## ⚠️ Problemas Detectados y Corregidos

### ✅ Corregido
1. **Enlaces rotos en historial.html:**
   - ❌ `/nuevo-candado.html` (no existe)
   - ❌ `/creacion-candados.html` (no existe)
   - ✅ Reemplazados por enlaces funcionales

2. **Panel de control accesible:**
   - ✅ Añadido botón en historial.html
   - ✅ Enlace desde panel.html a historial.html

### 📝 Notas de Diseño
- **Panel de control** es una página secundaria (no está en menú principal)
  - Razón: Es una herramienta avanzada de gestión
  - Acceso: Desde Historial → "Panel de control"
  - Alternativa: Podría añadirse al menú si se considera necesario

---

## 🎯 Mejoras Sugeridas

1. **Añadir breadcrumbs** (opcional, ya se removieron por petición del usuario)
2. **Añadir "Panel" al menú principal** si se considera herramienta principal
3. **Mejorar navegación contextual:**
   - Botón "Volver" en preview.html
   - Enlaces de contexto en modales
4. **Añadir atajos de teclado:**
   - `g p` para Panel de control (ya existe `g h` para Historial)

---

## 📊 Resumen del Flujo

```
┌─────────────┐
│   INICIO    │
└──────┬──────┘
       │
       ├──→ Generador ──→ Historial ──→ Panel
       │                      │
       ├──→ Escape Room      ├──→ Preview
       │                      │
       ├──→ Recursos          └──→ Exportar/Compartir
       │
       ├──→ Cifrados
       │
       └──→ Ayuda
```

**Flujo principal recomendado:**
1. **Inicio** → Conocer la plataforma
2. **Generador** → Crear primer candado
3. **Historial** → Ver y gestionar candados
4. **Panel** → Organizar en directorios (avanzado)
5. **Escape Room** → Crear experiencias completas
6. **Recursos** → Descargar plantillas
7. **Ayuda** → Consultar documentación

