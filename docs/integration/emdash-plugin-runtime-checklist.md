# EmDash plugin runtime checklist

Use this checklist to validate the local EmDash host loop without touching the upstream EmDash repo.

## Contract checks

- `package.json` resolves `.` to `./dist/index.mjs`, `./sandbox` to `./dist/sandbox-entry.mjs`, `./admin` to `./dist/admin.mjs`, and `./astro` to `./dist/astro.mjs`.
- The plugin descriptor stays aligned with the published `entrypoint`, `sandbox`, `adminEntry`, and `componentsEntry` package specifiers.
- EmCanvas stays documented as a native EmDash plugin package with a named `createPlugin()` root factory.
- The root runtime default-exports the host plugin definition and keeps `createPlugin`, `descriptor`, and `manifest` available as explicit exports.
- `plugin.routes['canvas-data']`, `plugin.routes['save-canvas-data']`, and `plugin.routes['preview-link']` stay wired to `routeAdapters`.
- Runtime exports stay host-focused and do not promise hot reload or upstream EmDash automation.

## Verification commands

- `pnpm vitest run tests/contracts/emdash-plugin-runtime.test.ts`
- `pnpm vitest run tests/integration/admin-editor-publish-flow.test.tsx tests/integration/preview-and-publish-flow.test.ts tests/integration/entry-takeover-flow.test.ts`

## Manual host loop

- Load EmCanvas from the canonical repo-root/worktree package path in EmDash.
- After package-facing changes, run `pnpm build`, relink or refresh that same path dependency if needed, then restart or reload EmDash before manual validation.
- Open the editor route exposed by the plugin and confirm the real editor mounts.
- Edit a node, publish, and confirm the saved entry data reflects the latest editor state.
- Open the preview link and confirm rendered output contains the published EmCanvas markup.
- Re-open the same entry and confirm takeover metadata, page fragments, and publish state stay coherent.
