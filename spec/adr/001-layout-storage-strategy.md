# ADR 001 — Layout Storage Strategy

## Contexto

EmCanvas necesita persistir un layout JSON completo asociado a una entry de EmDash.

## Decisión

Guardar el layout en `entry.data.canvasLayout` y usar `_emcanvas` para metadata de activación/versionado.

## Alternativas rechazadas

### Plugin storage separado
- Duplica persistencia.
- Rompe alineación natural con revisiones.
- Obliga a sincronizar contenido y layout.

## Razones

- Revisions gratis.
- Preview gratis.
- Menor complejidad operativa.
- El layout forma parte del contenido publicado.

## Consecuencias

- El documento debe mantenerse serializable y estable.
- Migraciones futuras deben contemplar versionado del layout.
