# EmCanvas Base Widget System Phase Design

## Summary

El proyecto ahora incorpora una nueva especificación base: `spec/11-base-widget-system.md`. Eso convierte el “Advanced Tab” en una capacidad estructural del producto, no en una mejora opcional. Esta fase implementa el primer corte útil de ese sistema base sin intentar resolver todo el universo de estilos avanzados de una sola vez.

## Goal

Introducir un **Base Widget System** que permita a cualquier nodo compartir propiedades avanzadas comunes sin duplicar lógica en cada widget ni en cada componente Astro.

## Non-Goals

- Soportar todas las capacidades listadas en `spec/11` en una sola fase.
- Reescribir todo el renderer de una vez.
- Agregar animaciones complejas o custom CSS libre todavía.

## Phase Slice

Esta primera fase se va a limitar a un corte fundacional:

1. **Modelo de datos base compartido**
   - `advancedProps` (o nombre equivalente final) agregado al nodo.

2. **Wrapper arquitectónico universal**
   - renderer capaz de envolver widgets con un contenedor común cuando no esté deshabilitado.

3. **Primer set útil de advanced props**
   - spacing
   - width/height básicos
   - CSS id/classes
   - responsive visibility mínima

4. **Contrato de widget**
   - `disableBaseWrapper?: boolean`

## Architecture Direction

### 1. Node model grows in a bounded way

`CanvasNode` sigue teniendo `props` semánticas del widget, pero suma un bloque separado para configuración avanzada compartida.

### 2. Wrapper owns generic layout behavior

El universal renderer decide si renderiza:

- el widget “puro”, o
- un wrapper arquitectónico común con clases/atributos derivados de `advancedProps`

### 3. Widget core stays domain-focused

Los componentes widget (`Button.astro`, `Heading.astro`, etc.) siguen concentrados en su negocio; el wrapper absorbe spacing/layout/ids/classes/visibility.

## Intended Outcome

Al cerrar esta fase, EmCanvas tendrá la base real para un “Advanced Tab” compartido, sin obligar a que cada widget reinvente márgenes, ids, display conditions o layout básico.
