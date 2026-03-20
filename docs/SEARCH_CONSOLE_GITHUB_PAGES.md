# Google Search Console en `*.github.io`

Puedes **verificar la propiedad** de un sitio GitHub Pages aunque el dominio sea `usuario.github.io` o `usuario.github.io/proyecto`.

## Opción A: Etiqueta HTML (recomendada)

1. En Search Console, elige **Etiqueta HTML** y copia el `content` del meta (o el archivo que te indiquen).
2. Añade en la plantilla principal (por ejemplo `index.html` dentro de `<head>`):

```html
<meta name="google-site-verification" content="TU_CODIGO_AQUI" />
```

3. Haz commit, push y espera el deploy.
4. En Search Console, pulsa **Verificar**.

## Opción B: Archivo HTML

1. Descarga el archivo `googleXXXXXXXX.html` que te da Google.
2. Colócalo en la **raíz del repo** (junto a `index.html`).
3. Push y verifica cuando `https://TU-USUARIO.github.io/googleXXXXXXXX.html` responda 200.

## Revisión de seguridad (Safe Browsing)

Tras corregir el sitio:

1. **Seguridad y acciones manuales** (o el informe de problemas de seguridad).
2. **Solicitar revisión** y describe brevemente los cambios (p. ej. eliminación de redirecciones abiertas, saneo de enlaces en payloads compartidos, sin formularios de credenciales públicos).

La revisión puede tardar **varios días**; no depende solo del código, sino del re-análisis de Google.

## Nota

GitHub Pages **no** permite cabeceras HTTP personalizadas (`Content-Security-Policy`, etc.) en el plan gratuito estándar; la mitigación principal está en el **código del frontend** (como en este proyecto).
