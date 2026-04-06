# EmDash consumable package checklist

Use this checklist before asking EmDash to consume the local EmCanvas package.

## Consumable package checklist

- Use one canonical local dependency: point EmDash at the EmCanvas repo root/worktree package path.
- Package exports point to `dist` runtime artifacts.
- Rebuild the package with `pnpm build` before asking EmDash to consume refreshed local artifacts.
- The canonical package exports stay backed by `./dist/index.mjs`, `./dist/sandbox-entry.mjs`, `./dist/admin.mjs`, and `./dist/astro.mjs`.
- The native plugin descriptor resolves `entrypoint`, `sandbox`, `adminEntry`, and `componentsEntry` from the published package specifiers.
- Public root, sandbox, admin, and astro entry modules stay separated.
- EmDash can import the root and sandbox surfaces from the local package.
- Admin and astro surfaces stay explicit and host-focused.
