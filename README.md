# EmCanvas

EmCanvas is a visual page builder for EmDash CMS.

It lives as an external plugin, stores layout data inside EmDash content entries, and renders pages server-side without requiring mandatory frontend runtime JavaScript.

## Status

- source-first EmDash integration working
- dedicated admin editor/canvas working
- website-builder MVP working for basic landing pages
- publish wired to the real EmDash content API for `pages`
- renderer hardening completed
- quick smoke, manual smoke, and local-host validation flows available

## What works today

EmCanvas can currently:

- open as a dedicated admin editor from EmDash
- start from an empty valid layout
- create/edit/delete blocks
- build basic pages with:
  - `hero`
  - `features/cards`
  - `heading`
  - `text`
  - `button`
  - `image`
  - `section`
  - `container`
  - `columns`
- persist edits through EmDash's real content API
- publish and reload edited pages
- render the saved layout server-side

This is a **website-builder MVP**, not a full Elementor-class editor yet.

## Repository scope

- Do **not** modify EmDash upstream from this repository.
- EmDash is treated as the host/integration target.
- All EmCanvas code, docs, smoke tooling, and packaging work live here.

## Package surfaces

The package exposes these public entrypoints:

- `.` → root runtime
- `./descriptor` → build-time descriptor
- `./sandbox` → sandbox runtime entry
- `./admin` → admin bundle entry
- `./astro` → Astro integration entry

The root package stays runtime-only, while `emcanvas/descriptor` exposes the build-time descriptor contract.

### Import rules

Use the package surfaces like this:

- `emcanvas/descriptor` in `astro.config.mjs`
- `emcanvas` as the runtime plugin entrypoint
- `emcanvas/admin` for trusted admin React pages
- `emcanvas/astro` for site-side rendering components

Example host registration:

```js
import emcanvasPlugin from 'emcanvas/descriptor'

plugins: [auditLogPlugin(), emcanvasPlugin]
```

Do **not** import the descriptor from `emcanvas` root.

## Core architecture

- The visual editor is a dedicated admin canvas, not a TipTap extension.
- Layout data is persisted through EmDash's content pipeline so revisions, publish, and preview flows stay reusable.
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

The canonical local-host contract is the source-first package surface.

### Quick preflight

```bash
pnpm smoke
```

This is a bounded preflight that checks the smoke docs and points to the canonical manual flow.

### Test from source

To test EmCanvas from source as a real EmDash plugin:

1. Add EmCanvas as a local dependency in your EmDash host:

```json
"emcanvas": "file:../emcanvas"
```

adjusting the relative path to your host repo.

2. Register the plugin in your host `astro.config.mjs`:

```js
import emcanvasPlugin from 'emcanvas/descriptor'
```

Then use it in the EmDash integration config:

```js
plugins: [auditLogPlugin(), emcanvasPlugin]
```

3. Refresh dependencies in the host:

```bash
pnpm install
```

4. Start the host:

```bash
pnpm dev
```

5. If Vite/Astro caches stale plugin code, clear the host caches and restart:

```bash
rm -rf .astro node_modules/.vite
pnpm dev
```

6. Open the editor directly for a page entry if needed:

```text
/_emdash/admin/plugins/emcanvas/editor?id=<entry-id>
```

7. Complete the local validation / smoke flow with:

- `docs/integration/emdash-local-validation.md`
- `docs/integration/manual-smoke-harness-playbook.md`
- `docs/integration/manual-smoke-harness-seeded-scenario.md`
- `docs/integration/manual-smoke-harness-checklist.md`

Build only when you explicitly need packaging artifacts.

### What Publish does

Publish now uses the real EmDash content pipeline for `pages`:

- `GET /_emdash/api/content/pages/:id`
- `PUT /_emdash/api/content/pages/:id`
- `POST /_emdash/api/content/pages/:id/publish`

That means EmCanvas no longer just mutates local in-memory entry data when publishing from the trusted admin editor.

### Quick smoke preflight

```bash
pnpm smoke
```

If your local EmDash host exposes the seed endpoint, create the canonical smoke entry:

```bash
node ./scripts/smoke-seed-local-host.mjs
```

See `docs/integration/emdash-dev-source-consumption.md` for the bounded local package setup and guardrails.

### Real local-host smoke

Use the canonical local-path workflow in `docs/integration/emdash-local-validation.md` as the source of truth for real EmDash plugin consumption.

Restart or reload the same local dependency if EmDash still sees stale source modules, and continue with the bounded smoke handoff.
Run `pnpm build` only when you explicitly need refreshed package artifacts.

```bash
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
