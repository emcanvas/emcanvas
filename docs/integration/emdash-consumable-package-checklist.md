# EmDash consumable package checklist

Use this checklist before asking EmDash to consume the local EmCanvas package.

## Consumable package checklist

- Package exports point to `dist` runtime artifacts.
- Public root, sandbox, admin, and astro entry modules stay separated.
- EmDash can import the root and sandbox surfaces from the local package.
- Admin and astro surfaces stay explicit and host-focused.
