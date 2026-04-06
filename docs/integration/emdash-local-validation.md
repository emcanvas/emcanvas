# EmDash local validation

Use these local checks before review or release.

## Canonical execution order

1. Confirm EmDash loads EmCanvas from the canonical repo-root/worktree package path.
2. Run `pnpm build` to refresh the `dist/*` artifacts EmDash consumes.
3. Reconfirm or refresh the canonical EmCanvas repo-root/worktree dependency in EmDash if the host still points at stale artifacts.
4. Restart or reload EmDash so the host resolves the refreshed local package before trusting validation output.
5. Run `pnpm smoke` for the bounded manual-smoke preflight.
6. Run `node ./scripts/smoke-seed-local-host.mjs` when you want the deterministic `home` / `Homepage` entry created through a local EmDash seed endpoint.
7. Continue with `docs/integration/manual-smoke-harness-playbook.md`, `docs/integration/manual-smoke-harness-seeded-scenario.md`, and `docs/integration/manual-smoke-harness-checklist.md` for the real-host edit, publish, preview, and reopen pass.

Run the manual smoke harness when you need a real EmDash host sanity check beyond automated verification and you want to exercise the seeded scenario end to end.

## Local seed inputs you must supply

- `EMDASH_SEED_ENDPOINT`: a caller-supplied endpoint that accepts the deterministic seed payload.
- `EMDASH_SEED_TOKEN`: a caller-supplied token for the seed endpoint.
- The canonical local-first workflow does not require Docker, but it does require your local EmDash host to expose a compatible seed endpoint if you want the repo-owned deterministic entry setup.

## Optional Docker wrapper

- If you want the repo-owned Docker bootstrap wrapper, run `node ./scripts/smoke-docker-local-host.mjs up` after the rebuild/relink/restart loop.
- Keep Docker secondary: the local path/worktree host flow above remains the source of truth for real plugin consumption.

## Optional Docker wrapper inputs

- `EMDASH_IMAGE`: a caller-supplied EmDash image or tag that already knows how to start the host.
- `EMDASH_ENV_FILE`: a caller-supplied runtime env file for the host container.
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

## Troubleshooting local host refresh and optional inputs

- If EmDash is not loading EmCanvas from the repo-root/worktree path you expect, fix that dependency first before trusting the rest of the smoke pass.
- If EmDash still resolves stale plugin code after `pnpm build`, refresh the existing local path dependency again and restart or reload the host before retrying the smoke pass.
- If `node ./scripts/smoke-seed-local-host.mjs` fails, confirm your host-specific endpoint accepts the canonical `home` / `Homepage` payload before retrying the bounded smoke pass.
- If `node ./scripts/smoke-docker-local-host.mjs up` fails before Docker starts, copy `docker/local-host/.env.example` and fill the optional Docker wrapper values.
