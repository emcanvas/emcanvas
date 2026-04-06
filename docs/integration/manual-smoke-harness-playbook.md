# EmCanvas manual smoke harness playbook

## Scope and boundary

Use this playbook for one bounded real-host smoke pass inside a local EmDash host.

- This harness covers one deterministic EmCanvas entry: seed, open editor, edit heading text, Publish, open preview, and re-open the same entry.
- EmCanvas Publish only persists `canvasLayout` and `_emcanvas` takeover metadata in the entry payload.
- It does not deploy the final site, invalidate cache, or run downstream host publishing pipelines.
- If your validation goal is broader EmDash release behavior, treat that as outside this harness.

## Prerequisites

- Run `pnpm smoke` first.
- Run `node ./scripts/smoke-docker-local-host.mjs up` before opening the host UI.
- A local EmDash host is running with the local EmCanvas package loaded.
- The Docker bootstrap seeds the canonical `home` / `Homepage` entry.
- The seeded entry from `docs/integration/manual-smoke-harness-seeded-scenario.md` already exists.
- Use the real EmDash host UI. Do not replace this flow with a standalone demo shell.
- Keep the run bounded to the seeded `home` / `Homepage` scenario.
- Treat the EmDash image, runtime secrets, and admin credentials as caller-supplied prerequisites outside this repository.

## Operator flow

1. Open the seeded `Homepage` entry with slug `home` in the local EmDash host.
2. Enable EmCanvas takeover or open the EmCanvas editor for the seeded entry.
3. Confirm the real editor mounts and the entry starts from the documented `Welcome` heading state.
4. Select the heading node. Edit the heading text from `Welcome` to `Published heading`.
5. Publish the entry and confirm the editor reports a saved or published state for the current canvas document.
6. Confirm takeover remains enabled for the entry after Publish.
7. Open the preview link for the same entry.
8. Confirm the preview route renders the published EmCanvas markup and shows `Published heading`.
9. Re-open the same entry and confirm the saved EmCanvas state is still coherent.

## Expected outcomes

- The editor opens through the real plugin page inside EmDash.
- Takeover is enabled for the seeded entry once EmCanvas owns the entry state.
- Publish persists the latest heading mutation into `canvasLayout` together with `_emcanvas` metadata.
- The preview link stays within the EmCanvas-owned preview boundary and points at the EmDash preview route.
- Re-opening the entry preserves takeover metadata and the latest saved heading state.

## Traceability

- Editor mount and publish flow: `tests/integration/admin-editor-publish-flow.test.tsx`
- Takeover persistence and host metadata: `tests/integration/entry-takeover-flow.test.ts`
- Preview link generation and published markup: `tests/integration/preview-and-publish-flow.test.ts`
- Local validation entry point: `docs/integration/emdash-local-validation.md`
