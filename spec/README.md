# EmCanvas OpenSpec

## Resumen ejecutivo

EmCanvas es un visual page builder para EmDash CMS, pensado como plugin externo y trusted. Su objetivo es habilitar layouts drag-and-drop tipo Elementor sin modificar upstream EmDash, reutilizando sus capacidades existentes de rutas de plugin, hooks, preview, revisiones y almacenamiento de contenido.

La estrategia central es simple: el editor visual vive en una admin page propia del plugin, el layout se almacena dentro de `entry.data`, y el frontend renderiza ese layout de forma server-side mediante un renderer dedicado. Esto permite aprovechar revisiones, preview tokens y publicación existentes sin duplicar infraestructura.

## Orden de lectura recomendado

1. `01-product-definition.md`
2. `02-architecture-overview.md`
3. `03-data-model.md`
4. `04-entry-takeover-flow.md`
5. `05-visual-canvas-system.md`
6. `06-component-system.md`
7. `07-frontend-renderer.md`
8. `08-emdash-integration-layer.md`
9. `09-mvp-scope.md`
10. `10-phase-roadmap.md`
11. `adr/`

## Glosario

- **CanvasDocument**: documento raíz del layout visual completo.
- **CanvasNode**: nodo individual del árbol de layout/render.
- **Entry takeover**: flujo donde una entry existente pasa a editarse con EmCanvas en lugar del editor estándar.
- **Widget**: componente visual registrable que el editor puede insertar en el canvas.
- **Component Registry**: catálogo tipado de widgets disponibles y sus schemas de props.
- **Trusted plugin**: plugin con acceso a APIs internas, contexto y capacidades avanzadas de EmDash.
- **Frontend renderer**: mecanismo que toma `CanvasDocument` y produce HTML/CSS renderizable en el sitio.

## Principios del spec

- EmCanvas vive como producto desacoplado del roadmap de EmDash.
- La integración usa APIs públicas o hooks ya verificados.
- El layout se persiste en `entry.data` para reutilizar revisiones y preview.
- El editor visual no extiende TipTap: usa una app propia orientada a layout.
- El frontend debe poder renderizar sin requerir runtime JS obligatorio.
