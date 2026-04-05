# 07 — Frontend Renderer

## Objetivo

Renderizar `CanvasDocument` como HTML/CSS en el frontend de EmDash usando SSR, sin depender de un runtime JS obligatorio para la visualización básica.

## Componente principal

El pipeline principal (`<EmCanvasRenderer>`) pasa cada nodo a un `<CanvasNodeRenderer>` recursivo.
Este nodo es **arquitectónicamente ciego y universal**: carga automáticamente los componentes por convencion usando Vite/AstroGlob (`const ElementComponent = componentsCollection[node.type]`) y le inyecta directamente el 100% de las propiedades semánticas (`<ElementComponent {...node.props} />`). **Cero configuración manual**: si creás `Button.astro`, está disponible. **Bajo ningún punto de vista este componente debe tener switches (ifs) ni armar HTML nativo explícito.**

## Estrategia CSS

- Estilos basados puramente en **CSS Custom Properties en línea** (ej: `style="--mobile-width: 100%; --desktop-width: 50%"`) para evitar parseos pesados en SSR.
- Responsive soportado con una única hoja de estilos global mínima que lee estas propiedades y aplica los media queries (ej: `@media (max-width: 768px) { width: var(--mobile-width); }`).
- Esto evita el problema de que estilos en línea tradicionales no soporten breakpoints o `:hover`, sin requerir inyectar tags `<style>` por cada componente renderizado.

## Integración con EmDash

- `page:fragments` inyecta CSS runtime/reset cuando hace falta.
- El template de página chequea `entry.data._emcanvas?.enabled`.
- Si está activo, renderiza EmCanvas en vez del contenido rich text habitual.

## Requisitos

- SSR-friendly.
- Sin takeover completo del frontend.
- Compatible con templates existentes.
- Sin dependencia obligatoria de hidratación para contenido estático.

## Beneficio principal

El renderer se acopla a la infraestructura de página existente y evita crear un stack paralelo de rendering o publicación.
