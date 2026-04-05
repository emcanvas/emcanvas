# 11 — Base Widget System (Advanced Tab)

## Objetivo

Proveer un motor de herencia en el Editor Visual donde **todos** los widgets compartan un conjunto estandarizado de propiedades de diseño avanzado, replicando y superando el paradigma del tab "Advanced" de herramientas como Elementor.

## El Problema

Si cada componente define su propio padding, margen o background de manera aislada, terminamos con una experiencia de edición inconsistente y un código altamente redundante. Los componentes de frontend (Astro/React) tendrían que reimplementar lógica de layout genérica una y otra vez.

## La Solución: The Base Widget Wrapper

En el JSON Document, el `CanvasNode` expone un objeto `advancedStyles` (o `baseProps`) separado estructuralmente de las `props` específicas del widget. El Editor Visual inyecta siempre las siguientes pestañas de edición para **cualquier** nodo, sin importar su `node.type`:

### 1. Layout & Positioning

- **Margin & Padding**: Controles responsivos (Desktop, Tablet, Mobile) soportando PX, EM, REM, %.
- **Size & Flow**: Width (Auto, 100%, Custom), Height (Auto, Full Screen, Min Height).
- **Positioning**: Default, Absolute, Fixed (Z-index, offsets X/Y).

### 2. Background, Border & Effects

- **Background**: Color sólido, Gradiantes, Imágenes (cover/contain/repeat), y soporte para estado Hover.
- **Border**: Tipo, Ancho, Color, Border Radius estandarizado.
- **Box Shadow**: Color, Blur, Spread, X, Y.
- **Masking & Filters**: Opacidad, CSS Filters (Blur, Brightness, Saturate).

### 3. Motion & Animation

- **Entrance Animations**: Fade in, Slide Up, Zoom In (con control de duración y delay).
- **Scroll Effects**: Parallax (basado en progreso de scroll del navegador).

### 4. Custom CSS & Identifiers

- **CSS ID**: Para links tipo anchor (`#id`).
- **CSS Classes**: Clases utilitarias adicionales.
- **Custom CSS**: Un bloque de código de texto libre inyectado localmente y aislado (scopeado al ID del widget).

### 5. Responsive Visibility

- **Display conditions**: Ocultar en Desktop, Ocultar en Tablet, Ocultar en Mobile.

---

## Implementación en el Arquitectura de Renderizado

En Astro, este modelo se implementa utilizando un **Wrapper Arquitectónico**. En lugar de que `Button.astro` se encargue de aplicar margenes y animaciones, el Universal `<CanvasNodeRenderer>` envuelve la ejecución.

### Flujo del Renderer Modificado:

```astro
---
const { node } = Astro.props
// 1. AstroGlob resuelve el componente del núcleo (ej: Button.astro)
const ElementComponent = componentsCollection[node.type]

// 2. Transforma los advanced properties generando un hash único para clases mapeadas
const baseStyles = generateScopedClasses(node.advancedProps, node.id)
const isWrapperDisabled = getWidgetDef(node.type).disableBaseWrapper;
---

<!-- 3. Si el wrapper está deshabilitado, se renderiza puro. Si no, se lo envuelve universalmente -->
{isWrapperDisabled ? (
  <ElementComponent {...node.props} />
) : (
  <div class={`emc-node ${baseStyles.className} emc-${node.id}`} id={node.advancedProps.cssId}>
    <ElementComponent {...node.props} />
  </div>
)}
```

_(Nota: Previo al renderizado de la página, un worker de SSR en EmDash extrae las configuraciones de todos los nodos y escupe en la cabecera del sitio la definición CSS real de `emc-[id]`)_.

## Conclusión

El **Base Widget System** permite que la creación de un nuevo componente en EmCanvas requiera **únicamente** definir su data de negocio (ej. "URL del botón", "Texto del encabezado"). Todo comportamiento visual complejo (Márgenes, Z-Index, Animaciones de entrada) viene "gratis" provisto por el Wrapper del framework.
