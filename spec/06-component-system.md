# 06 — Component System

## Objetivo

Definir un registro de widgets tipado y extensible que permita renderizar, editar y validar componentes visuales de forma consistente.

## WidgetDefinition

```typescript
interface WidgetDefinition {
  type: string
  label: string
  icon: string
  category: 'layout' | 'content' | 'media'
  defaultProps: Record<string, unknown>
  propSchema: Record<string, unknown> // Subconjunto de JSON Schema estándar en lugar de interfaces custom
  allowedChildren?: string[] | 'any' | 'none'
  disableBaseWrapper?: boolean // Excluye al componente del Universal Base Wrapper (Advanced Tab)
}
```

## Componentes MVP

| Category | Component | Props                              |
| -------- | --------- | ---------------------------------- |
| Layout   | Section   | backgroundColor, padding, maxWidth |
| Layout   | Columns   | columns, gap, distribution         |
| Layout   | Container | width, alignment, padding          |
| Content  | Heading   | text, level, alignment             |
| Content  | Text      | content, alignment                 |
| Content  | Button    | text, url, variant, size           |
| Content  | Spacer    | height                             |
| Content  | Divider   | style, color, width                |
| Media    | Image     | src, alt, width, objectFit         |
| Media    | Video     | src, poster, autoplay, controls    |

## Reglas del sistema

- Cada widget define defaults seguros.
- Cada widget expone un **JSON Schema** como `propSchema`. Esto automatiza el 100% la UI del _Property Inspector_ usando librerías pre-existentes en React, evitando construir o mantener formularios manuales.
- **Convention over Configuration:** El mapeo entre `node.type` y el Componente Frontend es implícito por nombre. Si el tipo es `Button`, el sistema auto-resuelve importando `Button.astro`, sin necesidad de registrarlo manualmente en código. Este componente recibe `node.props` tal cual configuró el editor (espejo 1:1).
- Las restricciones de nesting deben estar declaradas.
- La semántica del widget debe ser directa y coincidir con las props del componente Astro final asociado.

## Objetivo de extensibilidad

Aunque el MVP no incluye third-party widgets, el registro debe prepararse mentalmente para extensión futura sin romper el formato del documento.
