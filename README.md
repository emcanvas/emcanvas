# EmCanvas

EmCanvas is a visual page builder for EmDash CMS.

It lives as an external plugin, stores layout data inside `entry.data`, and renders pages server-side without requiring mandatory frontend runtime JavaScript.

## Status

- MVP implemented and tested
- package/runtime surfaces aligned for EmDash consumption
- renderer hardening completed
- quick smoke, manual smoke, and Docker-backed local-host smoke flows available

## Repository scope

- Do **not** modify EmDash upstream from this repository.
- EmDash is treated as the host/integration target.
- All EmCanvas code, docs, smoke tooling, and packaging work live here.

## Package surfaces

The package exposes these public entrypoints:

- `.` → root runtime
- `./sandbox` → sandbox runtime entry
- `./admin` → admin bundle entry
- `./astro` → Astro integration entry

The root package exports a native EmDash descriptor plus a named `createPlugin()` factory.

## Core architecture

- The visual editor is a dedicated admin app, not a TipTap extension.
- Layout data is persisted in `entry.data` so EmDash revisions and preview flows stay reusable.
- Frontend rendering is SSR-first.
- Renderer-managed CSS is emitted through scoped page fragments, not inline `style="..."` attributes.
- Host/runtime adapters stay separate from editor/renderer core.

See `spec/README.md` for the project spec set.

## Verification

Main verification command:

```bash
pnpm vitest run
```

Useful focused checks:

```bash
pnpm exec tsc --noEmit
pnpm smoke
```

## Product testing

The packaged `file:`/`dist` workflow is the canonical release and local-host contract.

### Quick preflight

```bash
pnpm smoke
```

This is a bounded preflight that checks the smoke docs and points to the canonical manual flow.

### Test from source

To test EmCanvas from source as a real EmDash plugin:

1. Build EmCanvas artifacts:

```bash
pnpm build
```

2. Add EmCanvas as a local dependency in your EmDash host. For the `emdash/demos/simple` demo this means adding:

```json
"emcanvas": "file:../../../emcanvas"
```

to `dependencies` in `demos/simple/package.json`.

3. Register the plugin in `demos/simple/astro.config.mjs`:

```js
import emcanvasPlugin, { createPlugin, descriptor } from 'emcanvas'
```

EmDash's native plugin loader consumes `descriptor.entrypoint` and imports the named `createPlugin()` factory from that root package surface. For the current local demo integration, you can still include the default runtime plugin in the EmDash integration config:

```js
plugins: [auditLogPlugin(), emcanvasPlugin]
```

4. Refresh dependencies in EmDash:

```bash
cd /Users/lopezlean/development/js/emdash
pnpm install
```

5. Bootstrap and run the demo host:

```bash
cd /Users/lopezlean/development/js/emdash/demos/simple
pnpm bootstrap
pnpm dev
```

6. After EmCanvas changes, repeat the local loop:

```bash
cd /Users/lopezlean/development/js/emcanvas
pnpm build

cd /Users/lopezlean/development/js/emdash
pnpm install

cd /Users/lopezlean/development/js/emdash/demos/simple
pnpm dev
```

7. Run the bounded smoke preflight:

```bash
pnpm smoke
```

8. If your local EmDash host exposes the seed endpoint, create the canonical smoke entry:

```bash
node ./scripts/smoke-seed-local-host.mjs
```

9. Complete the real host pass with:

- `docs/integration/emdash-local-validation.md`
- `docs/integration/manual-smoke-harness-playbook.md`
- `docs/integration/manual-smoke-harness-seeded-scenario.md`
- `docs/integration/manual-smoke-harness-checklist.md`

### Optional: dev-source mode for local EmDash hosts

Dev-source mode is opt-in for local development only and does not replace packaged `dist` consumption.

Use `src/plugin/dev-source.ts` only when a local EmDash host wants to resolve EmCanvas source modules through host-local Vite aliases during development. The host mirrors `@emcanvas/plugin` for loading the descriptor, the descriptor resolves runtime sub-entries to concrete absolute source paths, and packaged `file:`/`dist` consumption remains the release contract.

See `docs/integration/emdash-dev-source-consumption.md` for the bounded host-local setup and guardrails.

### Real local-host smoke

Use the canonical local-path workflow in `docs/integration/emdash-local-validation.md` as the source of truth for real EmDash plugin consumption.

Run `pnpm build` when you need refreshed package artifacts for EmDash local-host consumption.
Then relink or refresh the same local dependency if EmDash still sees stale artifacts, restart or reload the host, and continue with the bounded smoke handoff.

```bash
pnpm build
pnpm smoke
node ./scripts/smoke-seed-local-host.mjs
```

Optional Docker wrapper:

```bash
node ./scripts/smoke-docker-local-host.mjs up
```

Then follow:

- `docs/integration/manual-smoke-harness-playbook.md`
- `docs/integration/manual-smoke-harness-seeded-scenario.md`
- `docs/integration/manual-smoke-harness-checklist.md`
- `docs/integration/emdash-local-validation.md`

## Development notes

- Prefer TDD.
- Do not run builds unless explicitly needed.
- Verify with fresh evidence before claiming success.

## More references

- `spec/README.md` — product and architecture specs
- `docs/integration/` — host validation and smoke docs
- `AGENTS.md` — project-specific workflow and architecture rules
