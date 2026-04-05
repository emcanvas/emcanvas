# Final release checklist

- Run `pnpm vitest run tests/accessibility/canvas-editor.a11y.test.tsx tests/performance/layout-payload.test.ts tests/integration/emdash-contracts.test.ts`.
- Run `pnpm vitest run tests/integration/entry-takeover-flow.test.ts tests/integration/preview-and-publish-flow.test.ts tests/integration/admin-editor-publish-flow.test.tsx`.
- Confirm invalid `canvasLayout` data falls back to the default document and resets takeover to disabled.
- Confirm publish still persists `canvasLayout` plus `_emcanvas` metadata and preview URLs still resolve with `source=emcanvas`.
- Review `docs/integration/manual-smoke-harness-checklist.md` when you want a real-host manual sanity pass; it validates payload persistence and preview behavior only, not final site deployment.
- Review `docs/integration/error-handling.md` and `docs/integration/emdash-local-validation.md` before cutting the release.
