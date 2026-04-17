# EmDash consumable package checklist

Use this checklist before asking EmDash to consume the local EmCanvas package.

## Consumable package checklist

- Use one canonical local dependency: point EmDash at the EmCanvas repo root/worktree package path.
- Package exports point to `src/plugin/*` entry modules for source-first host consumption.
- Local EmDash consumption resolves `emcanvas`, `emcanvas/descriptor`, `emcanvas/admin`, and `emcanvas/astro` through the package exports map.
- Keep the package exports map aligned with the source-first `src/plugin/*` entry layout.
- The native plugin descriptor resolves `entrypoint`, `adminEntry`, `componentsEntry`, and `adminPages` from the published package specifiers.
- Public root, descriptor, admin, and astro entry modules stay separated.
- EmDash can import the root runtime and descriptor surfaces from the local package.
- Admin and astro surfaces stay explicit and host-focused.
