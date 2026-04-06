# AGENTS.md

## Project

EmCanvas is a visual page builder for EmDash CMS.

Current state:

- MVP implemented and tested
- runtime/plugin packaging adapted for EmDash consumption
- renderer hardening phase completed

## Working Rules

- Do not modify EmDash upstream.
- All EmCanvas work lives in this repository.
- EmDash is only a host/integration reference unless a task explicitly says otherwise.
- No build after changes unless the user explicitly asks for it.
- Prefer TDD: write failing test first, then minimal implementation.
- Verify with fresh evidence before claiming success.

## Architecture Principles

- Preserve the core architecture unless a change explicitly targets architectural refactoring.
- Keep host/runtime adapters separate from editor/renderer core.
- Keep package/public surfaces explicit:
  - root runtime
  - sandbox
  - admin
  - astro
- Keep renderer semantics single-source-of-truth.
- Avoid hidden fallbacks at boundaries.
- **State Memory**: Use `immer` (or Zustand) to mutate the editor JSON tree immutably, avoiding deep-clone performance hits during Undo/Redo.
- **CSS Strategy**: Generate a scoped page-level stylesheet dynamically during SSR and inject it via EmDash's `page:fragments`. Strictly avoid inline `style="..."` properties. Universally enforce the `emc-` prefix for all CSS classes (e.g., `.emc-node`, `.emc-[node.id]`).
- **Defensive Rendering**: Always parse incoming `entry.data` JSON via structural schemas (e.g. Zod) in the SSR layer to prevent catastrophic crashing (HTTP 500) from corrupted payloads.
- **Widget Schemas**: Expose widget configuration schemas using standard JSON Schema to automate Property Inspector UI generation.

## Preferred Validation

- Main verification command:
  - `pnpm vitest run`
- Use focused contract/integration tests when changing:
  - plugin/package surface
  - renderer behavior
  - host integration

## Pending Explicitly Requested

- Keep this file updated as AI workflow guidance evolves.
