# 02 — Architecture Overview

## Subsistemas principales

1. **EmCanvas Plugin**
   - Plugin trusted definido con `definePlugin()`.
   - Expone admin pages, hooks y rutas específicas.

2. **Canvas Editor**
   - Aplicación React propia.
   - No reutiliza TipTap como base del editor.
   - Vive dentro de una plugin admin page.

3. **Component Registry**
   - Registro tipado de widgets disponibles.
   - Declara props, categorías, restricciones de children y defaults.

4. **Layout Engine**
   - Árbol JSON tipado basado en `CanvasDocument` y `CanvasNode`.
   - Es la fuente de verdad del estado del canvas.

5. **Frontend Renderer**
   - Componente Astro `<EmCanvasRenderer>`.
   - Convierte layout JSON en HTML/CSS responsivo.

6. **Integration Layer**
   - Une hooks, rutas, APIs y wiring del admin con EmDash.

## Flujo de datos

```text
EmDash Admin → Plugin Route → Canvas Editor → Layout JSON → entry.data
EmDash Frontend → getEmDashEntry() → entry.data → EmCanvasRenderer → HTML
```

## Responsabilidades por límite

### EmDash
- Auth, shell de admin y routing base.
- Persistencia de entries.
- Sistema de revisiones.
- Preview tokens.
- Render pipeline y hooks.

### EmCanvas
- UX del editor visual.
- Modelo de layout.
- Registro de widgets.
- Render del layout visual.
- Takeover editorial de entry.

## Decisiones arquitectónicas clave

- El editor visual vive como app propia.
- El layout se guarda dentro de la entry, no en storage paralelo.
- El frontend renderer se integra con templates existentes.
- La estrategia evita full takeovers innecesarios de backend o frontend.
