# EmDash local validation

Use these local checks before review or release.

## Canonical execution order

1. Run `pnpm smoke` for the bounded manual-smoke preflight.
2. Run `node ./scripts/smoke-docker-local-host.mjs up` to start the repo-owned Docker wrapper and seed the canonical smoke entry.
3. Continue with `docs/integration/manual-smoke-harness-playbook.md`, `docs/integration/manual-smoke-harness-seeded-scenario.md`, and `docs/integration/manual-smoke-harness-checklist.md` for the real-host edit, publish, preview, and reopen pass.

Run the manual smoke harness when you need a real EmDash host sanity check beyond automated verification and you want to exercise the seeded scenario end to end.

## External inputs you must supply

- `EMDASH_IMAGE`: a caller-supplied EmDash image or tag that already knows how to start the host.
- `EMDASH_ENV_FILE`: a caller-supplied runtime env file for the host container.
- `EMDASH_SEED_ENDPOINT`: a caller-supplied endpoint that accepts the deterministic seed payload.
- `EMDASH_SEED_TOKEN`: a caller-supplied token for the seed endpoint.
- This repository does not own the EmDash image, runtime env file, admin credentials, runtime secrets, or downstream deployment pipelines.
- browser automation, generic EmDash deployment, and final site publishing remain out of scope for this change.

## Automated verification references

- Run `pnpm vitest run tests/contracts/consumable-package-docs.test.ts` to verify the consumable package checklist doc stays present.
- Run `pnpm vitest run tests/contracts/manual-smoke-harness-docs.test.ts` to verify the manual smoke harness docs stay present and bounded to the real EmDash host loop.
- Run `pnpm vitest run tests/contracts/emdash-plugin-runtime.test.ts` to verify the package surface, descriptor, plugin definition, and route adapters stay coherent for local host loading.
- Run `pnpm vitest run tests/integration/emdash-contracts.test.ts` to verify takeover normalization against EmDash-facing hooks and routes.
- Run `pnpm vitest run tests/integration/admin-editor-publish-flow.test.tsx tests/integration/entry-takeover-flow.test.ts tests/integration/preview-and-publish-flow.test.ts` to confirm the host editor, preview, and publish loop still works.
- Invalid `canvasLayout` payloads must fall back to the default document in `getCanvasData()` and must never leave `_emcanvas.enabled` true.
- EmDash integration points that depend on takeover state are `getCanvasData`, `saveCanvasData`, `getEntryEditorActions`, `getPageMetadata`, and `pageFragments`.
- Use `docs/integration/emdash-consumable-package-checklist.md` as the package-focused compatibility checklist before asking EmDash to consume the worktree package.

## Troubleshooting missing external host inputs

- If `node ./scripts/smoke-docker-local-host.mjs up` fails before Docker starts, copy `docker/local-host/.env.example` and fill the caller-supplied EmDash values.
- If the seed step fails, confirm your host-specific endpoint accepts the canonical `home` / `Homepage` payload before retrying the bounded smoke pass.
