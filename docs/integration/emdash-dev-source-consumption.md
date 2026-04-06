# EmDash dev-source consumption

Use this workflow only when a local EmDash host needs to consume EmCanvas source modules directly during development.

- Keep packaged `dist/*` consumption as the canonical release contract.
- Use the `@emcanvas/plugin` alias namespace only for loading the dev-source descriptor and root plugin module.
- This workflow is for local EmDash hosts only and does not require EmDash upstream changes.

## Dev-source descriptor contract

After the local EmDash host mirrors the `@emcanvas/plugin` namespace in Vite, import the dedicated source descriptor through that alias:

```ts
import descriptor from '@emcanvas/plugin/dev-source'
```

The descriptor keeps `entrypoint` on the mirrored `@emcanvas/plugin` alias, but emits self-resolving absolute source paths for the runtime sub-entries that EmDash imports verbatim:

- `entrypoint` → `@emcanvas/plugin`
- `sandbox` → `/absolute/path/to/emcanvas/src/plugin/sandbox-entry.ts`
- `adminEntry` → `/absolute/path/to/emcanvas/src/plugin/admin-entry.ts`
- `componentsEntry` → `/absolute/path/to/emcanvas/src/plugin/astro-entry.ts`

## Host-local Vite aliases

Mirror the root plugin namespace inside the local EmDash host:

```ts
resolve: {
  alias: {
    '@emcanvas/plugin': '/absolute/path/to/emcanvas/src/plugin',
  },
}
```

Do not add a fallback from these aliases back to packaged `dist` artifacts. If the alias wiring is missing, resolution should fail explicitly so the host fixes its local setup.

Do not add extra alias rules for `sandbox-entry`, `admin-entry`, or `astro-entry`. The dev-source descriptor already points those runtime imports at concrete source files so host-side `index.ts/...` resolution bugs cannot occur.

## Usage boundaries

- Use packaged `file:`/`dist` consumption for release validation and the canonical local package workflow.
- Use dev-source mode only for local development loops where rebuilding EmCanvas package artifacts would slow iteration.
- Do not modify EmDash upstream to support this mode; keep all workflow changes host-local.
