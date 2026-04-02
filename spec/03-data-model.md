# 03 — Data Model

## Objetivo del modelo

Representar un layout visual arbitrario, anidable y renderizable como un árbol JSON simple, versionable y serializable dentro de `entry.data`.

## Interfaces base

```typescript
interface CanvasDocument {
  version: 1;
  root: CanvasNode;
  settings: DocumentSettings;
}

interface CanvasNode {
  id: string;
  type: string;
  props: Record<string, unknown>;
  styles: ResponsiveStyles;
  children?: CanvasNode[];
}

interface ResponsiveStyles {
  desktop: CSSProperties;
  tablet?: CSSProperties;
  mobile?: CSSProperties;
}
```

## Propiedades del modelo

- `version` permite migraciones futuras.
- `root` define un único árbol raíz consistente.
- `type` discrimina el widget concreto.
- `props` encapsula configuración semántica del widget.
- `styles` encapsula presentación responsive.
- `children` habilita composición arbitraria cuando el widget lo permite.

## Persistencia en EmDash

```typescript
entry.data = {
  _emcanvas: {
    enabled: true,
    version: 1,
    editorVersion: "0.1.0"
  },
  canvasLayout: CanvasDocument,
}
```

Los demás campos de la entry siguen existiendo y no son responsabilidad directa de EmCanvas.

## Rationale de almacenamiento

Guardar el layout en `entry.data` permite:

- reutilizar revisiones automáticamente,
- reutilizar preview tokens sin integración extra,
- evitar sincronización entre storages,
- mantener el layout asociado al ciclo de vida natural del contenido.

## Restricciones del modelo

- El árbol debe ser serializable como JSON puro.
- Los widgets no deben depender de funciones embebidas ni clases serializadas.
- La validez estructural depende del registro de widgets y sus reglas de children.
