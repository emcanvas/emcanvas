# EmDash local validation

Use these local checks before review or release:

- Run `pnpm vitest run tests/contracts/emdash-plugin-runtime.test.ts` to verify the package surface, descriptor, plugin definition, and route adapters stay coherent for local host loading.
- Run `pnpm vitest run tests/integration/emdash-contracts.test.ts` to verify takeover normalization against EmDash-facing hooks and routes.
- Run `pnpm vitest run tests/integration/admin-editor-publish-flow.test.tsx tests/integration/entry-takeover-flow.test.ts tests/integration/preview-and-publish-flow.test.ts` to confirm the host editor, preview, and publish loop still works.
- Invalid `canvasLayout` payloads must fall back to the default document in `getCanvasData()` and must never leave `_emcanvas.enabled` true.
- EmDash integration points that depend on takeover state are `getCanvasData`, `saveCanvasData`, `getEntryEditorActions`, `getPageMetadata`, and `pageFragments`.
- Use `docs/integration/emdash-plugin-runtime-checklist.md` as the local compatibility checklist before asking EmDash to consume the worktree package.
