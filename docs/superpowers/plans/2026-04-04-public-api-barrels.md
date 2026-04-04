# EmCanvas Public API Barrels Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add explicit `index.ts` barrels for the main EmCanvas layers and migrate a focused set of consumers to those stable public APIs.

**Architecture:** Barrels should be thin public API surfaces, not wildcard dumps. The migration should be incremental: define the public APIs first, then move a small production slice, then a small test slice.

**Tech Stack:** TypeScript, existing path aliases, Vitest.

---

## Task 1: Add explicit barrel files for the major layers

**Files:**

- Create: `src/foundation/index.ts`
- Create: `src/editor/index.ts`
- Create: `src/renderer/index.ts`
- Create: `src/admin/index.ts`
- Test: `tests/contracts/public-api-barrels.test.ts`

- [ ] **Step 1: Write the failing barrel contract test**

```ts
import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'

describe('public api barrels', () => {
  it('defines barrel files for the main layers', () => {
    expect(existsSync('src/foundation/index.ts')).toBe(true)
    expect(existsSync('src/editor/index.ts')).toBe(true)
    expect(existsSync('src/renderer/index.ts')).toBe(true)
    expect(existsSync('src/admin/index.ts')).toBe(true)
  })
})
```

- [ ] **Step 2: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/public-api-barrels.test.ts`
Expected: FAIL because the barrels do not exist yet.

- [ ] **Step 3: Add thin barrel files for each layer**

```ts
// src/editor/index.ts
export * from './shell/editor-shell'
export * from './state/editor-store'
```

- [ ] **Step 4: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/public-api-barrels.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/foundation/index.ts src/editor/index.ts src/renderer/index.ts src/admin/index.ts tests/contracts/public-api-barrels.test.ts
git commit -m "chore: add public api barrel files"
```

---

## Task 2: Migrate a focused production slice to the new barrels

**Files:**

- Modify: selected production files using deep internal imports
- Test: `tests/contracts/public-api-barrel-usage.test.ts`

- [ ] **Step 1: Write the failing production-usage contract test**

```ts
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

describe('production barrel usage', () => {
  it('uses layer barrels in the selected production slice', () => {
    const source = readFileSync('src/plugin/pages/editor-page.tsx', 'utf8')
    expect(source).toContain('@emcanvas/admin')
  })
})
```

- [ ] **Step 2: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/public-api-barrel-usage.test.ts`
Expected: FAIL

- [ ] **Step 3: Migrate the selected production slice**

```ts
import { CanvasEditorPage } from '@emcanvas/admin'
```

- [ ] **Step 4: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/public-api-barrel-usage.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src tests/contracts/public-api-barrel-usage.test.ts
git commit -m "refactor: use public api barrels in production slice"
```

---

## Task 3: Migrate a focused test slice to the new barrels

**Files:**

- Modify: selected tests using deep internal imports
- Test: `tests/contracts/public-api-barrel-test-usage.test.ts`

- [ ] **Step 1: Write the failing test-usage contract test**

```ts
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

describe('test barrel usage', () => {
  it('uses layer barrels in the selected test slice', () => {
    const source = readFileSync(
      'tests/integration/plugin-admin-mount.test.tsx',
      'utf8',
    )
    expect(source).toContain('@emcanvas/admin')
  })
})
```

- [ ] **Step 2: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/public-api-barrel-test-usage.test.ts`
Expected: FAIL

- [ ] **Step 3: Migrate the selected test slice**

```ts
import { CanvasEditorPage } from '@emcanvas/admin'
```

- [ ] **Step 4: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/public-api-barrel-test-usage.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests tests/contracts/public-api-barrel-test-usage.test.ts
git commit -m "test: use public api barrels in selected tests"
```

---

## Verification Strategy

- Do **not** build after changes.
- End-of-phase verification must include:
  - `pnpm vitest run tests/contracts/public-api-barrels.test.ts`
  - `pnpm vitest run tests/contracts/public-api-barrel-usage.test.ts`
  - `pnpm vitest run tests/contracts/public-api-barrel-test-usage.test.ts`
  - `pnpm vitest run`

## Spec Coverage Check

- add layer barrels → Task 1
- migrate production slice → Task 2
- migrate test slice → Task 3

## Placeholder Scan

- No TODO/TBD placeholders remain.
- Phase intentionally limits churn to a focused slice first.
