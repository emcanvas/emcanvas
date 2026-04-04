# EmCanvas Type Safety and Test Fixture Cleanup Design

## Summary

After the editor and renderer cleanup phases, the next highest-value maintenance work is a small correctness-and-maintainability pass over three medium-priority issues from `IMPROVEMENTS.md`:

1. `Record<string, any>` in `getCanvasEntryState`
2. duplicate `shouldRenderEmCanvas` computation in `page-metadata`
3. duplicated `createFixtureDocument()` helpers across tests

This phase keeps scope intentionally small and low-risk.

## Goal

Improve type safety, avoid redundant runtime work, and reduce test-fixture duplication without expanding product scope.

## Non-Goals

- Tooling overhaul (ESLint/CI/Prettier)
- Path alias work
- Broader architecture changes

## Intended Outcome

- renderer entry-state code uses `Record<string, unknown>` instead of `any`
- page-metadata computes takeover once per request
- tests share a reusable fixture document factory instead of repeating local builders
