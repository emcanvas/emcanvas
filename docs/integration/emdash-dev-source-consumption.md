# EmDash dev-source consumption

Use this workflow only when a local EmDash host needs to consume EmCanvas source modules directly during development.

- Keep packaged `dist/*` consumption as the canonical release contract.
- Use the `@emcanvas/plugin` alias namespace and mirror it in the local EmDash host Vite config.
- This workflow is for local EmDash hosts only and does not require EmDash upstream changes.

## Dev-source descriptor contract

After the local EmDash host mirrors the `@emcanvas/plugin` namespace in Vite, import the dedicated source descriptor through that alias:

```ts
import descriptor from '@emcanvas/plugin/dev-source'
```

The descriptor resolves these source specifiers:

- `@emcanvas/plugin`
- `@emcanvas/plugin/sandbox-entry`
- `@emcanvas/plugin/admin-entry`
- `@emcanvas/plugin/astro-entry`

## Host-local Vite aliases

Mirror the same namespace inside the local EmDash host:

```ts
resolve: {
  alias: {
    '@emcanvas/plugin': '/absolute/path/to/emcanvas/src/plugin',
  },
}
```

Do not add a fallback from these aliases back to packaged `dist` artifacts. If the alias wiring is missing, resolution should fail explicitly so the host fixes its local setup.

## Usage boundaries

- Use packaged `file:`/`dist` consumption for release validation and the canonical local package workflow.
- Use dev-source mode only for local development loops where rebuilding EmCanvas package artifacts would slow iteration.
- Do not modify EmDash upstream to support this mode; keep all workflow changes host-local.
