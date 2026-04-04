# EmCanvas Path Aliases Design

## Summary

The next medium-priority improvement from `IMPROVEMENTS.md` is import clarity. The repo still has many `../../..` imports across editor, renderer, plugin, and tests. This phase introduces path aliases in a controlled way to reduce fragile deep-relative imports.

## Goal

Add explicit TypeScript/Vite path aliases for the main package domains and migrate a focused set of code to use them.

## Non-Goals

- Repo-wide codemod of every import in one shot
- Feature changes
- Build/runtime redesign

## Intended Outcome

- `tsconfig.json` defines the project aliases
- `vite.config.ts` understands the same aliases
- selected production/test files use aliases instead of deep relative paths
- tests stay green after the migration
