# 07 — Frontend Renderer

## Objetivo

Renderizar `CanvasDocument` como HTML/CSS en el frontend de EmDash usando SSR, sin depender de un runtime JS obligatorio para la visualización básica.

## Componente principal

`<EmCanvasRenderer>` recibe `CanvasDocument` y produce markup renderizable por Astro.

## Estrategia CSS

- Estilos inline o generados por nodo para valores específicos.
- Responsive soportado mediante media queries y/o CSS custom properties.
- Runtime CSS mínimo inyectado solo en páginas que usan EmCanvas.

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
