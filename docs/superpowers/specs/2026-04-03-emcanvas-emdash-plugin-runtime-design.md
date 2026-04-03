# EmCanvas EmDash Plugin Runtime Design

## Summary

EmCanvas ya tiene un MVP funcional de editor, renderer, persistence y host integration interno, pero todavía no cumple el contrato real de plugin consumible por EmDash. Esta fase adapta EmCanvas al runtime verdadero del host manteniendo la arquitectura actual al máximo mediante una capa de compatibilidad explícita.

## Goal

Hacer que EmDash pueda cargar EmCanvas como plugin real local y ejecutar el loop completo dentro del host:

- cargar plugin
- abrir editor desde el host
- editar
- guardar
- preview
- publish
- render frontend

## Non-Goals

- Reescribir el editor visual.
- Reescribir el renderer SSR.
- Cambiar el modelo `CanvasDocument` / `CanvasNode`.
- Agregar features post-MVP.
- Modificar upstream EmDash.

## Current Gap

La validación cruzada contra el repo local de EmDash mostró cuatro desajustes principales:

1. **Package surface no consumible**
   - `package.json` no expone `exports`, `main`, `files`, ni `peerDependencies` utilizables por EmDash.

2. **Descriptor no compatible**
   - El descriptor actual no sigue el contrato real esperado por EmDash (`entrypoint`, `format`, etc.).

3. **Manifest/hook/route shape interno**
   - El `manifest` actual modela el producto internamente, pero no coincide todavía con el shape real del sistema de plugins del host.

4. **Bypass del host runtime**
   - La capa admin/persistence todavía llama demasiado directo a contratos internos y no está completamente montada a través del runtime real de EmDash.

## Recommended Approach

Usar una **capa de adaptación fina** entre el core de EmCanvas y el runtime real de EmDash.

### Why this approach

- Protege el trabajo ya hecho del MVP.
- Separa el problema de host packaging del problema de producto.
- Evita reescribir componentes correctos solo por un mismatch de integración.
- Deja abierta la posibilidad futura de soportar otros hosts o runtimes.

## Architecture

### 1. EmCanvas Core (preservado)

Se mantiene sin cambios conceptuales significativos:

- `src/foundation/`
- `src/editor/`
- `src/renderer/`
- `src/shared/`

Esta capa sigue siendo la fuente principal de:

- modelo de documento
- editor visual
- renderer SSR
- validación
- persistence logic interna

### 2. EmDash Plugin Adapter (nuevo foco)

Esta capa adapta el host real al core:

- `package.json` y surface de paquete
- descriptor real del plugin
- entrypoints reales del runtime
- hooks con nombres/shape reales
- routes host-compatible
- admin page exportada por el contrato real del host

### 3. Runtime Bridge

Puente fino entre contrato host y contrato interno:

- traducción de datos de entry/preview/hooks/routes
- encapsulación del acceso host-specific
- aislamiento del core respecto de detalles del loader de EmDash

## Design Principles

1. **Core first, adapter second**
   - El host no debe forzar reescritura del core salvo incompatibilidad real.

2. **One source of truth per concern**
   - Document model sigue viviendo en foundation/editor.
   - Renderer contract sigue viviendo en renderer.
   - Adapter solo traduce, no redefine.

3. **Host compatibility must be explicit**
   - Nada de contratos “parecidos”.
   - Descriptor, manifest, routes y hooks deben copiar el shape real que EmDash espera.

4. **No silent fallbacks at boundaries**
   - Si el host no puede cargar algo, debe fallar con contrato claro.
   - Si un entrypoint no cumple shape, debe detectarse temprano.

## Workstreams

### Workstream A — Package Surface

Definir superficie consumible por EmDash:

- `exports`
- `main`
- `files`
- `peerDependencies`
- paths requeridos para plugin runtime y sandbox

### Workstream B — Descriptor and Entrypoints

Adaptar:

- descriptor real del plugin
- `entrypoint`
- `sandbox` entry si aplica
- formato requerido por el runtime host

### Workstream C — Host Contract Mapping

Alinear:

- manifest
- hooks (`page:fragments`, `page:metadata`, etc.)
- routes reales
- naming y signatures esperadas por EmDash

### Workstream D — Admin Runtime Wiring

Asegurar que la admin page cargada por EmDash:

- monta el editor real
- usa el bridge host-compatible
- guarda el estado vivo del editor
- expone preview/publish reales

### Workstream E — Local Integration Validation

Verificar en entorno real con `/Users/lopezlean/development/js/emdash`:

- plugin load
- admin route mounting
- editor boot
- save/load round-trip
- preview URL
- published frontend render

## Proposed File Direction

Los nombres exactos se validarán con el contrato real del host, pero la fase probablemente toque:

- `package.json`
- `src/plugin/descriptor.ts`
- `src/plugin/index.ts`
- `src/plugin/manifest.ts`
- `src/plugin/sandbox-entry.ts`
- `src/plugin/hooks/*`
- `src/plugin/routes/*`
- `src/plugin/pages/editor-page.tsx`
- `src/admin/lib/plugin-api.ts`

Y posiblemente agregue una subcapa explícita tipo:

- `src/plugin/runtime/*`
- o `src/plugin/adapter/*`

si el shape host-specific necesita aislamiento adicional.

## Verification Strategy

La fase debe considerarse completa solo cuando:

1. EmDash puede resolver/cargar el paquete localmente.
2. El plugin aparece y monta la admin page real.
3. El editor opera dentro del host.
4. Save/load usan la integración host real.
5. Preview funciona vía host.
6. Publish deja la entry y el frontend en estado coherente.
7. Tests relevantes de EmCanvas siguen pasando.

## Risks

### Risk 1 — Adapter leakage
Que detalles del host se filtren al core.

**Mitigation:** bridge explícito y límites claros.

### Risk 2 — Contract drift against EmDash
Implementar “parecido” pero no exacto.

**Mitigation:** basarse en tipos/entrypoints reales del repo host.

### Risk 3 — Breaking the MVP while packaging
Romper editor/renderer existentes por tocar wiring.

**Mitigation:** preservar core y mover cambios al adapter primero.

## Outcome

Al cerrar esta fase, EmCanvas deja de ser solo un MVP funcional interno y pasa a ser un plugin real cargable por EmDash, manteniendo la arquitectura actual y ejecutando el loop completo dentro del host.
