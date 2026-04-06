# EmDash source-first local consumption

Use this workflow when a local EmDash host consumes EmCanvas directly from the repo package during development.

- Use the native `emcanvas` package specifiers as the only local host contract.
- This workflow is for local EmDash hosts only and does not require EmDash upstream changes.
- `dist/*` remains a secondary packaging artifact and not the primary development runtime contract.

## Native descriptor contract

Import EmCanvas from the public package surface:

```ts
import emcanvasPlugin, { createPlugin, descriptor } from 'emcanvas'
```

The descriptor stays package-specifier based so EmDash resolves the same public contract in development:

- `entrypoint` → `emcanvas`
- `sandbox` → `emcanvas/sandbox`
- `adminEntry` → `emcanvas/admin`
- `componentsEntry` → `emcanvas/astro`

## Host-local boundaries

- Do not introduce a parallel `dev-source` descriptor entry.
- Do not rely on host-local alias fallback for the public `emcanvas/*` surfaces.
- Do not modify EmDash upstream to support this mode; keep all workflow changes host-local.
