# ADR 002 — Editor Routing Model

## Contexto

El editor visual necesita una URL propia dentro del admin de EmDash con subrutas flexibles.

## Decisión

Usar plugin admin pages bajo `/plugins/emcanvas/editor/*`.

## Alternativas rechazadas

### Custom standalone route
- Requiere resolver auth y shell por fuera.
- Duplica infraestructura de navegación/admin.

## Razones

- Usa routing existente.
- Reutiliza auth y layout del admin.
- Mantiene al usuario dentro del ecosistema EmDash.

## Consecuencias

- El editor debe respetar el ciclo y convenciones del admin host.
