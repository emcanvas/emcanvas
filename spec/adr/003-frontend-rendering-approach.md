# ADR 003 — Frontend Rendering Approach

## Contexto

El layout visual debe renderizarse en el frontend sin reemplazar toda la infraestructura de páginas.

## Decisión

Usar un componente Astro `<EmCanvasRenderer>` y el hook `page:fragments` para el CSS requerido.

## Alternativas rechazadas

### Full frontend takeover
- Aumenta complejidad.
- Compite con templates existentes.
- Hace más costosa la adopción.

## Razones

- Integración natural con templates de EmDash.
- SSR limpio.
- Menor superficie de cambio.

## Consecuencias

- El renderer debe respetar contratos del host.
- La inyección de CSS debe ser selectiva.
