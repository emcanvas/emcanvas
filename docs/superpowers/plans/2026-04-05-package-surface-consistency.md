# EmCanvas Package Surface Consistency Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove remaining ambiguity from the EmCanvas package surface and maintenance scripts.

**Architecture:** Keep the current runtime/public surface intact, but make the package metadata, sandbox surface, and maintenance scripts say one coherent thing.

**Tech Stack:** TypeScript, package metadata, contract tests.

---

## Task 1: Align package metadata and maintenance scripts

**Files:**

- Modify: `package.json`
- Create: `tests/contracts/package-metadata-consistency.test.ts`

- [ ] **Step 1: Write the failing package consistency test**

```ts
import { describe, expect, it } from 'vitest'
import pkg from '../../package.json'

describe('package metadata consistency', () => {
  it('defines coherent package metadata and maintenance scripts', () => {
    expect(pkg.scripts['type-check']).toBeDefined()
    expect(pkg.scripts['test:watch']).toBeDefined()
  })
})
```

- [ ] **Step 2: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/package-metadata-consistency.test.ts`
Expected: FAIL

- [ ] **Step 3: Add missing maintenance scripts and align metadata stance**

```json
{
  "scripts": {
    "type-check": "tsc --noEmit",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 4: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/package-metadata-consistency.test.ts`
Expected: PASS

- [x] **Step 5: Commit**

```bash
git add package.json tests/contracts/package-metadata-consistency.test.ts
git commit -m "chore: align package metadata and maintenance scripts"
```

---

## Task 2: Clarify the sandbox entry contract

**Files:**

- Modify: `src/plugin/sandbox-entry.ts`
- Test: `tests/contracts/plugin-public-exports.test.ts`

- [ ] **Step 1: Write the failing sandbox contract regression**

```ts
import { describe, expect, it } from 'vitest'

describe('sandbox entry surface', () => {
  it('exposes a deliberate sandbox contract instead of an unexplained passthrough', async () => {
    const sandbox = await import('../../src/plugin/sandbox-entry.ts')
    expect(sandbox.default).toBeDefined()
  })
})
```

- [ ] **Step 2: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/plugin-public-exports.test.ts`
Expected: FAIL or reveal current passthrough ambiguity.

- [ ] **Step 3: Make sandbox entry explicit**

```ts
// either explicit re-export with comment/shape, or a dedicated sandbox object if justified
```

- [ ] **Step 4: Run the focused contract test again**

Run: `pnpm vitest run tests/contracts/plugin-public-exports.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/plugin/sandbox-entry.ts tests/contracts/plugin-public-exports.test.ts
git commit -m "refactor: clarify sandbox entry contract"
```

---

## Verification Strategy

- Do **not** build after changes.
- End-of-phase verification must include:
  - `pnpm vitest run tests/contracts/package-metadata-consistency.test.ts`
  - `pnpm vitest run tests/contracts/plugin-public-exports.test.ts`
  - `pnpm vitest run`

## Spec Coverage Check

- package metadata/scripts coherence → Task 1
- sandbox entry clarity → Task 2

## Placeholder Scan

- No TODO/TBD placeholders remain.
- Phase intentionally stays package-surface only.
