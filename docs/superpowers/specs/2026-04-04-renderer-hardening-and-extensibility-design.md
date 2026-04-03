# EmCanvas Renderer Hardening and Extensibility Design

## Summary

El renderer actual de EmCanvas ya funciona y está testeado, pero tiene varias oportunidades reales de mejora en estructura, performance y extensibilidad. Esta fase NO cambia el producto ni el modelo de documento: endurece y refina el renderer existente para dejarlo más mantenible y más preparado para crecimiento.

## Goal

Mejorar el renderer de EmCanvas en cuatro ejes:

- simplificar el template Astro
- consolidar la emisión de media rules
- ampliar la sanitización segura de valores CSS válidos
- hacer extensible el registry de renderers

## Non-Goals

- Cambiar `CanvasDocument` o `CanvasNode`.
- Rehacer el flujo editorial o el plugin runtime.
- Agregar nuevos widgets al producto.
- Introducir nuevos features de UI del editor.

## Source Inputs

Esta fase toma como insumo principal:

- `renderer-improvements.md`

y lo traduce a una unidad de trabajo ejecutable y acotada.

## Proposed Scope

### 1. Simplify `CanvasNodeRenderer.astro`

Hoy el template contiene branching por tipos concretos que va a crecer con cada renderer nuevo. La propuesta es mover más decisión semántica al render model y dejar el template con una cantidad mínima de branches.

### 2. Consolidate media rules at the root renderer

Hoy cada nodo puede emitir su propio bloque `<style>`. Para documentos grandes eso es innecesariamente ruidoso. La propuesta es recolectar media rules en el root renderer y emitirlas una sola vez por documento.

### 3. Improve CSS value sanitization

La sanitización actual es demasiado conservadora y puede romper valores válidos de CSS moderno. Hay que ampliarla sin abrir la puerta a inyección arbitraria.

### 4. Make renderer registry extensible

El registry actual está hardcodeado. La propuesta es exponer un mecanismo explícito para registrar renderers adicionales sin romper el comportamiento default ni el contrato de errores para tipos no soportados.

## Architecture Direction

### Render pipeline stays the same

Se mantiene el pipeline conceptual:

`data normalization -> renderer registry -> render model -> Astro view`

Lo que cambia es qué tan expresivo es el render model y cuánto trabajo hace el template final.

### Root renderer owns global CSS aggregation

El root renderer (`EmCanvasRenderer.astro`) pasa a ser el punto donde se agregan media rules de todo el árbol, en vez de repartir pequeños `<style>` por nodo.

### Registry remains authoritative

La lookup de tipos sigue pasando por el registry. La extensibilidad se diseña como una capa encima del registry default, no como reemplazo implícito.

## Risks

### Risk 1: Over-refactoring the renderer
Si se cambia demasiada estructura de una vez, podemos romper el SSR path que hoy ya funciona.

**Mitigation:** avanzar por tasks chicas con tests SSR y unitarios en cada paso.

### Risk 2: CSS sanitization regression
Al hacerla más permisiva, podemos introducir vectores no deseados.

**Mitigation:** tests explícitos sobre inputs válidos e inválidos.

### Risk 3: Registry drift
Si hacemos el registry extensible sin proteger el comportamiento actual, podemos romper el fallback/error contract.

**Mitigation:** mantener tests sobre tipos soportados y tipos desconocidos.

## Outcome

Al cerrar esta fase, el renderer de EmCanvas sigue haciendo lo mismo a nivel funcional, pero con:

- template Astro más estable
- salida HTML/CSS más limpia
- sanitización CSS más útil
- registry más extensible

sin expandir el alcance del producto.
