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

## Preferred Validation

- Main verification command:
  - `pnpm vitest run`
- Use focused contract/integration tests when changing:
  - plugin/package surface
  - renderer behavior
  - host integration

## Current Known Notes

- Astro warning `Missing pages directory: src/pages` appears during tests but does not currently fail the suite.
- `IMPROVEMENTS.md` contains broader architecture/codebase cleanup opportunities.
- `renderer-improvements.md` contains renderer-specific ideas beyond the completed renderer hardening phase.

## Pending Explicitly Requested

- Keep this file updated as AI workflow guidance evolves.
