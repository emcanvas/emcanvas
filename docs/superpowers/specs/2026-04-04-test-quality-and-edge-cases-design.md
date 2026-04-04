# EmCanvas Test Quality and Edge Cases Design

## Summary

The next best improvement from `IMPROVEMENTS.md` is not a product feature but test quality. The codebase already has broad coverage, but some tests still validate implementation details instead of behavior, and several small but important modules and edge cases remain under-tested.

## Goal

Improve confidence in the codebase by:

- replacing brittle implementation-detail assertions with observable behavior
- adding dedicated unit coverage for small but important pure modules
- covering edge cases in parsing, style building, and persistence boundaries

## Non-Goals

- new product features
- broad framework/tooling changes
- large refactors not directly justified by testability

## Focus Areas

### 1. Replace implementation-detail tests

From `IMPROVEMENTS.md`:

- `tests/foundation/editor/app.test.tsx`
- `tests/integration/editor-shell-flow.test.tsx`
- `tests/unit/editor/editor-store.test.ts`

These should move toward observable behavior.

### 2. Add missing unit tests for pure modules

High-value targets:

- `src/editor/dnd/dnd-operations.ts`
- `src/editor/dnd/dnd-guards.ts`
- `src/editor/shared/tree-path.ts`
- `src/editor/styles/style-mutations.ts`
- `src/renderer/styles/build-inline-style.ts`
- `src/renderer/styles/build-media-rules.ts`
- `src/renderer/data/normalize-canvas-document.ts`
- `src/admin/lib/error-mapping.ts`
- `src/editor/persistence/entry-payload.ts`

### 3. Add edge-case coverage

Key edge cases already identified:

- malformed DnD payloads
- stronger ID uniqueness confidence
- move-node no-op/sibling edge cases
- CSS injection / undefined / numeric style values
- `saveCanvasData` mutation boundary behavior

## Intended Outcome

After this phase:

- tests describe user-visible/system-visible behavior more often than internals
- pure utility modules have direct unit coverage
- known edge cases are covered by regressions
