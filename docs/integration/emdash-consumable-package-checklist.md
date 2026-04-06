# EmDash consumable package checklist

Use this checklist before asking EmDash to consume the local EmCanvas package.

## Consumable package checklist

- Use one canonical local dependency: point EmDash at the EmCanvas repo root/worktree package path.
- Package exports point to source plugin entry modules for local host consumption.
- Local EmDash consumption resolves `emcanvas`, `emcanvas/sandbox`, `emcanvas/admin`, and `emcanvas/astro` through source exports.
- Keep `dist/*` only as a secondary packaging artifact boundary.
- The native plugin descriptor resolves `entrypoint`, `sandbox`, `adminEntry`, and `componentsEntry` from the published package specifiers.
- Public root, sandbox, admin, and astro entry modules stay separated.
- EmDash can import the root and sandbox surfaces from the local package.
- Admin and astro surfaces stay explicit and host-focused.
