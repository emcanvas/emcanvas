# 05 — Visual Canvas System

## Objetivo

Definir la experiencia de edición visual del canvas para crear y modificar layouts con feedback directo, soporte responsive y edición estructural segura.

## Capacidades principales

### Viewport
- Simulación de desktop, tablet y mobile.
- Puede resolverse con iframe o con contenedor acotado según necesidades de aislamiento.

### Drag & Drop
- Inserción y reordenamiento visual de nodos.
- Drop zones visibles.
- Restricciones respetando `allowedChildren`.

### Selection
- Click para seleccionar nodo.
- Breadcrumb de ancestros.
- Estado claro del nodo activo.

### Property Inspector
- Panel lateral para editar `props` del nodo seleccionado.
- UI generada a partir de schemas declarativos.

### Style Editor
- Edición de estilos por breakpoint.
- Foco en propiedades útiles para layout y presentación.

### Undo / Redo
- Basado en command pattern o patches reversibles.
- Debe operar sobre el árbol completo de layout.

### Toolbar
- Inserción de widgets.
- Zoom.
- Cambio de breakpoint.
- Acciones de documento.

## Principios de diseño

- El árbol de layout es la verdad; la UI solo lo manipula.
- Toda acción visible debe poder deshacerse.
- El usuario siempre debe saber qué nodo está editando.
- La edición responsive no debe esconder el baseline desktop.
