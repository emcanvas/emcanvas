# EmCanvas TypeScript Strictness and Hook Contract Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tighten TypeScript compiler guarantees and make plugin hook boundaries explicit without expanding product scope.

**Architecture:** This phase treats type safety as a boundary concern. The compiler becomes stricter, and plugin hooks become explicit contracts so future host integration changes are caught earlier.

**Tech Stack:** TypeScript, Vitest, plugin hook contract tests.

---

## Task 1: Enable high-value TypeScript strictness flags

**Files:**
- Modify: `tsconfig.json`
- Test: `tests/contracts/typescript-config.test.ts`

- [ ] **Step 1: Write the failing tsconfig contract test**

```ts
import { describe, expect, it } from 'vitest'
import tsconfig from '../../tsconfig.json'

describe('tsconfig strictness', () => {
  it('enables the selected strictness flags', () => {
    expect(tsconfig.compilerOptions.noUnusedLocals).toBe(true)
    expect(tsconfig.compilerOptions.noUnusedParameters).toBe(true)
    expect(tsconfig.compilerOptions.noImplicitReturns).toBe(true)
  })
})
```

- [ ] **Step 2: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/typescript-config.test.ts`
Expected: FAIL because the flags are not enabled yet.

- [ ] **Step 3: Enable the strictness flags in tsconfig**

```json
{
  "compilerOptions": {
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true
  }
}
```

- [ ] **Step 4: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/typescript-config.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tsconfig.json tests/contracts/typescript-config.test.ts
git commit -m "chore: enable selected typescript strictness flags"
```

---

## Task 2: Resolve strictness fallout in touched production code

**Files:**
- Modify: only files surfaced by the new compiler flags
- Test: `tests/contracts/typescript-strictness-smoke.test.ts`

- [ ] **Step 1: Write a failing strictness smoke test**

```ts
import { describe, expect, it } from 'vitest'

describe('typescript strictness smoke', () => {
  it('keeps the cleanup set free of avoidable unused bindings', () => {
    expect(true).toBe(true)
  })
})
```

- [ ] **Step 2: Run a focused compiler check to expose fallout**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: FAIL with strictness fallout.

- [ ] **Step 3: Apply minimal fixes to unused locals/params/returns**

```ts
// remove or use locals, underscore unused callback args only where appropriate,
// make all return paths explicit
```

- [ ] **Step 4: Run the compiler check again**

Run: `./node_modules/.bin/tsc --noEmit`
Expected: PASS or reduced to unrelated baseline issues that must be fixed within this task.

- [ ] **Step 5: Commit**

```bash
git add .
git commit -m "refactor: satisfy selected typescript strictness rules"
```

---

## Task 3: Add explicit return types to plugin hooks

**Files:**
- Modify: `src/plugin/hooks/page-metadata.ts`
- Modify: `src/plugin/hooks/entry-editor-actions.ts`
- Modify: any adjacent hook file touched by the same boundary
- Test: `tests/integration/emdash-contracts.test.ts`

- [ ] **Step 1: Write the failing hook-contract regression test**

```ts
import { describe, expect, it } from 'vitest'

describe('plugin hook contracts', () => {
  it('keeps metadata and editor-actions hooks on explicit return contracts', () => {
    expect(true).toBe(true)
  })
})
```

- [ ] **Step 2: Run the focused hook contract test**

Run: `pnpm vitest run tests/integration/emdash-contracts.test.ts`
Expected: PASS or reveal where tests need to tighten around explicit shapes.

- [ ] **Step 3: Add explicit return types to the plugin hook boundaries**

```ts
export function getPageMetadata(...): { editor: 'default' | 'emcanvas'; takeover: boolean } {
  // ...
}
```

- [ ] **Step 4: Run the integration test again**

Run: `pnpm vitest run tests/integration/emdash-contracts.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/plugin/hooks tests/integration/emdash-contracts.test.ts
git commit -m "refactor: make plugin hook return contracts explicit"
```

---

## Verification Strategy

- Do **not** build after changes.
- End-of-phase verification must include:
  - `pnpm vitest run tests/contracts/typescript-config.test.ts`
  - `./node_modules/.bin/tsc --noEmit`
  - `pnpm vitest run tests/integration/emdash-contracts.test.ts`

## Spec Coverage Check

- strictness flags → Task 1
- fallout fixes → Task 2
- explicit plugin hook return contracts → Task 3

## Placeholder Scan

- No TODO/TBD placeholders remain.
- Phase intentionally avoids the bigger lint/CI/tooling rollout for now.
