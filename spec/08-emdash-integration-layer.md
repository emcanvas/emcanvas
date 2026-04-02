# 08 — EmDash Integration Layer

## Objetivo

Conectar EmCanvas con EmDash usando exclusivamente capacidades verificadas: plugin definition, rutas, hooks, content APIs y contexto trusted.

## Definición conceptual del plugin

```typescript
export default definePlugin({
  id: "emcanvas",
  name: "EmCanvas",
  version: "0.1.0",
  capabilities: ["read:content", "write:content", "page:inject"],
  adminPages: [
    { path: "/", label: "EmCanvas", icon: "layout" },
    { path: "/editor", label: "Editor" }
  ],
  hooks: {
    "page:fragments": injectCanvasCSS,
    "page:metadata": injectCanvasMeta,
  },
  routes: {
    "canvas-data": { handler: getCanvasData },
    "save-canvas": { handler: saveCanvasData },
  }
});
```

## Puntos de integración verificados

- Plugin route splat para subrutas arbitrarias.
- Trusted plugins con acceso a contexto amplio.
- Hook `page:fragments` para inyección frontend.
- Hook `page:metadata` para metadata.
- `entry.data` como almacenamiento JSON arbitrario.
- Revision system ya funcional sobre snapshots completos.
- Preview tokens ya resueltos por EmDash.

## Wiring requerido

- Admin pages para editor y dashboard básico.
- Botón “Edit with EmCanvas” en la edición de entries.
- Rutas livianas para lectura/guardado del layout.
- Uso opcional de content hooks para validación o postprocesamiento.

## Restricción central

La integración debe evitar cualquier modificación upstream en EmDash. Si algo requiere cambios en el core, queda fuera de este diseño.
