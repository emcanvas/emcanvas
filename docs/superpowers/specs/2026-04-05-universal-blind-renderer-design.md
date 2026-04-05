# EmCanvas Universal Blind Renderer Design

## Summary

Las reglas arquitectónicas base del proyecto fueron endurecidas. El renderer ya no debe operar como un mapeador semántico ad hoc con branching por tipo en Astro, sino como un **renderer universal y ciego** que:

- valida el payload antes del SSR
- resuelve dinámicamente el componente real por `node.type`
- inyecta las props semánticas 1:1 desde el JSON
- renderiza hijos recursivamente sin conocimiento específico de cada widget en el shell universal

## Goal

Reorientar el renderer para cumplir tres reglas activas:

1. **Renderer universal y ciego**
2. **Inyección dinámica de props 1:1**
3. **SSR defensivo obligatorio**

## Non-Goals

- Cambiar el modelo `CanvasDocument`.
- Cambiar el editor o el historial en esta fase concreta.
- Agregar nuevos widgets al producto.

## Architecture Direction

### 1. SSR defensive boundary

Antes de llegar a Astro:

- validar `entry.data` estructuralmente
- normalizar a un documento seguro
- si el payload es inválido, devolver fallback seguro y `shouldRender: false`

### 2. Universal renderer registry

El registry deja de ser una tabla de funciones TS que produce render models específicos por tipo.

En su lugar, el renderer resuelve un componente Astro real a partir de `node.type`, idealmente mediante `import.meta.glob`.

### 3. Blind node renderer

`CanvasNodeRenderer.astro` no debe contener `if`/`switch` por tipos de widget.

Responsabilidades:

- resolver el componente
- inyectar `node.props`
- pasar `children` recursivos si existen
- aplicar el contexto/metadata render mínima compartida

## Constraints

- La resolución dinámica debe seguir una lista controlada de componentes, no import arbitrario de strings libres.
- El fallback para tipo desconocido debe ser explícito y seguro.
- El renderer no debe reconstruir props HTML crudas si el componente real puede recibir props semánticas directamente.

## Intended Outcome

Al cerrar esta fase, el renderer deja de depender de branching por `model.kind` y pasa a operar como una capa universal y ciega, alineada con el contrato semántico del JSON.
