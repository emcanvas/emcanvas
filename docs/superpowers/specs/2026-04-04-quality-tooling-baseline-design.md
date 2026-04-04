# EmCanvas Quality Tooling Baseline Design

## Summary

The next major item from `IMPROVEMENTS.md` is the lack of baseline quality tooling: no ESLint, no Prettier, no CI, and no pre-commit hooks. This phase establishes a minimal tooling baseline without changing product behavior.

## Goal

Add the minimum quality infrastructure needed to keep the codebase from drifting:

- ESLint for TypeScript and React
- Prettier for formatting consistency
- GitHub Actions CI running tests and type-checks
- pre-commit hooks for fast local enforcement

## Non-Goals

- Full lint rule bikeshedding
- Large-scale code style rewrites unrelated to the new tooling
- New product features

## Intended Outcome

After this phase:

- the repo has a working lint command
- the repo has a working format command
- CI verifies tests and type-checks on push/PR
- local pre-commit hooks block obviously broken changes
