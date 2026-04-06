# EmDash local validation

Use these local checks before review or release:

- Run `pnpm smoke` for the bounded manual-smoke preflight, then use the linked harness docs for the real host pass.
- Run `pnpm vitest run tests/contracts/consumable-package-docs.test.ts` to verify the consumable package checklist doc stays present.
- Run `pnpm vitest run tests/contracts/manual-smoke-harness-docs.test.ts` to verify the manual smoke harness docs stay present and bounded to the real EmDash host loop.
- Run `pnpm vitest run tests/contracts/emdash-plugin-runtime.test.ts` to verify the package surface, descriptor, plugin definition, and route adapters stay coherent for local host loading.
- Run `pnpm vitest run tests/integration/emdash-contracts.test.ts` to verify takeover normalization against EmDash-facing hooks and routes.
- Run `pnpm vitest run tests/integration/admin-editor-publish-flow.test.tsx tests/integration/entry-takeover-flow.test.ts tests/integration/preview-and-publish-flow.test.ts` to confirm the host editor, preview, and publish loop still works.
- Run the manual smoke harness when you need a real EmDash host sanity check beyond automated verification and you want to exercise the seeded scenario end to end.
- Seed the host entry with `docs/integration/manual-smoke-harness-seeded-scenario.md`, follow `docs/integration/manual-smoke-harness-playbook.md`, and review `docs/integration/manual-smoke-harness-checklist.md`.
- Invalid `canvasLayout` payloads must fall back to the default document in `getCanvasData()` and must never leave `_emcanvas.enabled` true.
- EmDash integration points that depend on takeover state are `getCanvasData`, `saveCanvasData`, `getEntryEditorActions`, `getPageMetadata`, and `pageFragments`.
- Use `docs/integration/emdash-consumable-package-checklist.md` as the package-focused compatibility checklist before asking EmDash to consume the worktree package.
