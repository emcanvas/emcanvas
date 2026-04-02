# 01 — Product Definition

## Visión

EmCanvas es un visual page builder para EmDash CMS: “Elementor for EmDash”. Permite construir páginas visuales complejas con drag-and-drop, componentes reutilizables y controles responsive, sin requerir código por parte del editor de contenido.

## Problema

EmDash ofrece edición rica de contenido, pero no resuelve el problema de composición visual de páginas con layout libre. Para landing pages, páginas promocionales, layouts de producto o experiencias editoriales más complejas, el modelo de rich text no alcanza. EmCanvas cubre esa brecha sin reemplazar EmDash ni su modelo general de contenido.

## Usuarios objetivo

- Creadores de contenido que necesitan armar páginas visuales sin tocar código.
- Equipos de marketing que requieren iterar layouts rápido.
- Sitios basados en EmDash que necesitan páginas especiales sin desarrollar templates únicos por cada caso.

## Posicionamiento

EmCanvas es un plugin externo y desacoplado del core de EmDash. No depende de ser first-party ni de alterar el roadmap del CMS. Su propuesta es integrarse profundamente usando puntos de extensión reales, pero manteniendo independencia de producto y release cycle.

## Modelo de integración

El modelo elegido es **entry-level takeover**. EmCanvas no reemplaza content types completos ni redefine toda la experiencia editorial. En cambio, una entry existente puede opt-in al modo EmCanvas y pasar a editarse con el canvas visual.

## Qué sí es EmCanvas

- Un editor visual para páginas y layouts complejos.
- Un plugin trusted que corre dentro del admin de EmDash.
- Un sistema de layout JSON renderizable server-side.

## Qué NO es EmCanvas

- No es un tema.
- No es un reemplazo de Astro.
- No es un fork de EmDash.
- No es un reemplazo global del editor estándar para todo el CMS.

## Resultado buscado

Un usuario debe poder abrir una entry, elegir “Edit with EmCanvas”, construir visualmente un layout, previsualizarlo con la infraestructura existente de EmDash y publicarlo sin romper el flujo editorial normal.
