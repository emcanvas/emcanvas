# ADR 004 — Component Schema Format

## Contexto

EmCanvas necesita un formato de documento que soporte layout arbitrario, nesting y edición estructural.

## Decisión

Usar un árbol JSON discriminado con `type`, `props`, `styles` y `children`.

## Alternativas rechazadas

### Portable Text extendido
- No modela bien árboles de layout complejos.
- Su semántica está más orientada a contenido que a composición visual.

## Razones

- Soporta nesting arbitrario.
- Es fácil de serializar.
- Mapea bien a editor y renderer.

## Consecuencias

- El registry de widgets se vuelve parte esencial de la validación.
- Cambios de formato requieren estrategia de migración.
