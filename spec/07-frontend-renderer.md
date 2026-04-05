# 07 — Frontend Renderer

## Objetivo

Renderizar `CanvasDocument` como HTML/CSS en el frontend de EmDash usando SSR, sin depender de un runtime JS obligatorio para la visualización básica.

## Componente principal

El pipeline principal (`<EmCanvasRenderer>`) pasa cada nodo a un `<CanvasNodeRenderer>` recursivo.
Este nodo es **arquitectónicamente ciego y universal**: carga automáticamente los componentes por convencion usando Vite/AstroGlob (`const ElementComponent = componentsCollection[node.type]`) y le inyecta directamente el 100% de las propiedades semánticas (`<ElementComponent {...node.props} />`). **Cero configuración manual**: si creás `Button.astro`, está disponible. **Bajo ningún punto de vista este componente debe tener switches (ifs) ni armar HTML nativo explícito.**

## Estrategia CSS

## Estrategia CSS

- **Sin estilos en línea**: Por legibilidad del DOM, escalabilidad y estricta seguridad (CSP), se prohíbe el uso intensivo del atributo `style="..."` en los nodos renderizados.
- Se procesa el árbol de nodos JSON generando una única serie de clases mapeadas (e.g., `.emc-hash123`) correspondientes a la configuración de cada componente.
- Todos esos estilos (`margin`, `display`, media queries responsivas, estados `:hover`) se compilan en un único bloque estático de texto CSS durante el proceso de renderizado (SSR).
- Este bloque se inyecta globalmente encapsulado a través del hook `page:fragments`, produciendo una hoja de estilos unificada por página.

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
