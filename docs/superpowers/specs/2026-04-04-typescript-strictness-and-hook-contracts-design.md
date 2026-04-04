# EmCanvas TypeScript Strictness and Hook Contract Design

## Summary

The next pragmatic improvement from `IMPROVEMENTS.md` is to tighten TypeScript guarantees without opening a huge tooling front. This phase focuses on compiler strictness and explicit hook contracts, not on full lint/CI/prettier rollout.

## Goal

Increase compile-time safety by:

- enabling selected strictness flags in `tsconfig.json`
- fixing the code they expose
- adding explicit return types to host-facing plugin hooks

## Non-Goals

- Full ESLint/Prettier setup
- CI workflows
- Path aliases
- Coverage tooling

## Scope

### 1. Tighten compiler strictness

Enable the highest-value flags from `IMPROVEMENTS.md` that improve correctness immediately:

- `noUnusedLocals`
- `noUnusedParameters`
- `noImplicitReturns`

`exactOptionalPropertyTypes` may be included only if fallout remains contained.

### 2. Make plugin hook contracts explicit

The plugin hooks form a real boundary with EmDash. Return types should be explicit instead of inferred, especially:

- `page-metadata.ts`
- `entry-editor-actions.ts`
- any adjacent plugin hook touched by fallout

## Intended Outcome

After this phase:

- the compiler catches more correctness issues by default
- hook outputs are explicit and harder to accidentally drift
- the repo remains test-green without expanding feature scope
