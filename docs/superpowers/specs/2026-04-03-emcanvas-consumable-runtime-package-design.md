# EmCanvas Consumable Runtime Package Design

## Summary

EmCanvas ya expone un contrato interno correcto para EmDash, pero todavía no es consumible como paquete local real por el host. El problema no es de features sino de packaging/runtime delivery: los `exports` actuales apuntan a `src/*.ts`, arrastran imports no aptos para consumo externo y mezclan superficies de runtime, admin y estilos.

Esta fase convierte EmCanvas en un paquete runtime consumible por EmDash sin reescribir el core.

## Goal

Hacer que EmDash pueda resolver e importar EmCanvas como paquete local real, con surfaces separadas y consumibles para:

- runtime root
- sandbox runtime
- admin entry
- astro/components entry (si aplica)

## Non-Goals

- Reescribir editor, renderer o modelo.
- Cambiar el contrato funcional ya validado en las fases previas.
- Modificar upstream EmDash.

## Root Cause

La validación acotada contra EmDash mostró:

- `package.json` exporta `src/*.ts`
- el root runtime arrastra imports con extensiones/shape no aptos para consumo externo directo
- el root también termina dependiendo de código que no debería estar en la surface runtime mínima
- el patrón real de referencia en EmDash usa exports consumibles (`dist/*.mjs`) para plugins

## Recommended Approach

Mantener el core actual, pero introducir una **runtime package surface compilada/consumible**.

### Package surfaces objetivo

- `.` → runtime package consumible por host
- `./sandbox` → sandbox runtime consumible
- `./admin` → admin exports consumibles
- `./astro` → Astro/SSR exports consumibles (si se requiere por host contract)

## Architecture

### 1. Core source (queda igual)

- `src/foundation`
- `src/editor`
- `src/renderer`
- `src/shared`

### 2. Public runtime entrypoints (se endurecen)

- `src/plugin/index.ts`
- `src/plugin/sandbox-entry.ts`
- nuevo `src/plugin/admin-entry.ts`
- posible `src/plugin/astro-entry.ts`

### 3. Build output contract

La surface pública final no debe apuntar a TS de `src/` en consumo local externo. Debe apuntar a artefactos consumibles por el host.

## Design Principles

1. **Runtime package surface must be explicit**
   - Cada export público representa una surface clara.

2. **No CSS-bearing imports in root runtime path**
   - El runtime root no debe arrastrar imports de UI/CSS no aptos para consumo directo.

3. **Build only for packaging, not for product redesign**
   - La fase agrega packaging/runtime delivery, no reescribe features.

4. **Keep contracts testable**
   - Cada export público debe tener contract tests consumibles desde afuera.

## Workstreams

### Workstream A — Define consumable public entrypoints
- root runtime
- sandbox runtime
- admin entry
- astro entry

### Workstream B — Add packaging/build surface
- output consumible en `dist/`
- `exports` apuntando a runtime artifacts
- `files` consistentes con publicación local

### Workstream C — Separate host surfaces cleanly
- evitar que root runtime cargue admin/CSS accidentalmente
- admin entry con `pages/widgets/fields` si host lo requiere

### Workstream D — Validate from EmDash consumption model
- import package root
- import sandbox
- validar shape del descriptor y definition
- validar surface admin si aplica

## Outcome

Al cerrar esta fase, EmCanvas no solo tendrá contratos correctos “en teoría”, sino que podrá ser consumido localmente por EmDash con una package surface real y estable.
