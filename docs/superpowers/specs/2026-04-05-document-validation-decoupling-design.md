# EmCanvas Document Validation Decoupling Design

## Summary

`validateInsertChildNode` y sus helpers todavía dependen directamente del singleton `widgetRegistry`. Eso vuelve la validación más rígida de lo necesario y hace difícil probar escenarios con registries alternativos o futuros widgets custom.

## Goal

Desacoplar la validación estructural del árbol respecto del singleton global del registry.

## Non-Goals

- Cambiar el formato del documento
- Agregar nuevas reglas de negocio
- Introducir plugin/custom widgets reales todavía

## Intended Outcome

Después de esta fase:

- las funciones de validación reciben el registry como dependencia explícita
- el flujo actual sigue funcionando con el registry default
- los tests pueden usar registries alternativos sin tocar singletons globales
