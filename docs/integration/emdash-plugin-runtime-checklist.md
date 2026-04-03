# EmDash plugin runtime checklist

Use this checklist to validate the local EmDash host loop without touching the upstream EmDash repo.

## Contract checks

- `package.json` resolves `.` to `./src/plugin/index.ts` and `./sandbox` to `./src/plugin/sandbox-entry.ts`.
- `src/plugin/descriptor.ts` exposes the same runtime entrypoint and sandbox paths declared by the package surface.
- `src/plugin/index.ts` default-exports the host plugin definition and keeps `descriptor` and `manifest` available as named exports.
- `plugin.routes['canvas-data']`, `plugin.routes['save-canvas-data']`, and `plugin.routes['preview-link']` stay wired to `routeAdapters`.
- `plugin.adminPages.editor` mounts the real editor page and `plugin.adminPages.dashboard` remains loadable.

## Verification commands

- `pnpm vitest run tests/contracts/emdash-plugin-runtime.test.ts`
- `pnpm vitest run tests/integration/admin-editor-publish-flow.test.tsx tests/integration/preview-and-publish-flow.test.ts tests/integration/entry-takeover-flow.test.ts`

## Manual host loop

- Load EmCanvas from the local worktree package in EmDash.
- Open the editor route exposed by the plugin and confirm the real editor mounts.
- Edit a node, publish, and confirm the saved entry data reflects the latest editor state.
- Open the preview link and confirm rendered output contains the published EmCanvas markup.
- Re-open the same entry and confirm takeover metadata, page fragments, and publish state stay coherent.
