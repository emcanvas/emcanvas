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

### Quick preflight

```bash
pnpm smoke
```

This is a bounded preflight that checks the smoke docs and points to the canonical manual flow.

### Real local-host smoke

Use the Docker-backed local-host wrapper plus the smoke harness docs:

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
