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

## Custom/Host Components (Extensibilidad)

El sistema soporta nativamente que el proyecto anfitrión defina e inyecte sus propios widgets (ej. `Hero.astro`) sin tocar el núcleo de EmCanvas. La extensibilidad funciona coordinando las dos mitades del sistema:

1. **Frontend Renderer (Astro):** Como se definió en la arquitectura del Renderer, utiliza Vite `import.meta.glob()` de forma transparente. Si el JSON indica `type: 'Hero'`, y el usuario definió `src/components/emcanvas/Hero.astro`, se monta directamente sin puentes ni middlewares.
2. **Visual Editor (React/Admin):** Para que el administrador pueda construir la UI configurando ese widget, debe existir una forma de inyectar los metadatos de configuración. El usuario pasará un array de `WidgetDefinition` vía inicialización del proyecto anfitrión:

   ```typescript
   // EmDash/Astro host config
   export default defineConfig({
     integrations: [
       emcanvas({
         customWidgets: [
           {
             type: 'Hero',
             label: 'Hero Section',
             icon: 'star',
             category: 'content',
             defaultProps: { title: 'Hola', bg: 'dark' },
             propSchema: {
               type: 'object',
               properties: {
                 title: { type: 'string' },
                 bg: { type: 'string', enum: ['dark', 'light'] },
               },
             },
           },
         ],
       }),
     ],
   })
   ```

Con esta inyección, el Editor React une los widgets "built-in" con los `customWidgets`, permitiéndole generar el botón de "Add Hero" y el _Property Inspector_ dinámico basado 100% en el esquema JSON declarado.
