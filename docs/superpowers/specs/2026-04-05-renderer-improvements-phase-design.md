# EmCanvas Renderer Improvements Phase Design

## Summary

`renderer-improvements.md` ya no es solo backlog suelto: en esta fase pasa a ser una unidad de trabajo ejecutable. El objetivo es cerrar mejoras puntuales de renderer que todavía quedaron fuera de las fases anteriores, manteniendo el alcance técnico y sin tocar producto.

## Goal

Implementar un bloque final de mejoras del renderer enfocado en:

- consolidación final de media rules si quedó deuda residual
- sanitización CSS con cobertura más completa
- extensibilidad controlada del renderer registry
- cierre de pequeños gaps de contrato del renderer

## Non-Goals

- nuevas features editoriales
- cambios de modelo de documento
- cambios en EmDash upstream

## Scope

1. Revisar qué partes de `renderer-improvements.md` ya quedaron cubiertas por fases previas.
2. Ejecutar solo el remanente real.
3. Endurecer tests/contracts alrededor del renderer.

## Intended Outcome

Al cerrar esta fase, `renderer-improvements.md` deja de ser backlog pendiente y pasa a estar absorbido por el repo y por la suite de tests.
