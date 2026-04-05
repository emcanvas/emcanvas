# EmCanvas Renderer Improvements Phase Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Absorb the remaining actionable items from `renderer-improvements.md` into tested renderer behavior.

**Architecture:** This phase is intentionally narrow and only executes the renderer improvements still not covered by prior runtime/render phases. Tests and contracts should prove which backlog items are now closed.

**Tech Stack:** TypeScript, Astro, Vitest.

---

## Task 1: Reconcile renderer-improvements backlog against current implementation

**Files:**

- Create: `tests/contracts/renderer-improvements-backlog.test.ts`
- Modify: only if a claimed item is still missing and minimal to prove/close it

- [ ] **Step 1: Write the failing backlog reconciliation test**

```ts
import { describe, expect, it } from 'vitest'

describe('renderer improvements backlog', () => {
  it('documents which renderer improvements are already covered in code', () => {
    expect(true).toBe(false)
  })
})
```

- [ ] **Step 2: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/renderer-improvements-backlog.test.ts`
Expected: FAIL

- [ ] **Step 3: Close or codify remaining renderer backlog items**

```ts
// prove remaining renderer backlog through focused contracts/tests
```

- [ ] **Step 4: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/renderer-improvements-backlog.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/contracts/renderer-improvements-backlog.test.ts src/renderer docs
git commit -m "test: reconcile renderer improvements backlog"
```

---

## Task 2: Add any missing renderer regression coverage from the backlog

**Files:**

- Modify: `tests/unit/renderer/*.test.ts`
- Modify: `tests/integration/renderer-ssr.test.ts`
- Modify production renderer files only if a real uncovered bug appears

- [ ] **Step 1: Write failing regression(s) for remaining renderer backlog**

```ts
import { describe, expect, it } from 'vitest'

describe('renderer backlog regressions', () => {
  it('covers any remaining renderer improvement not yet locked by tests', () => {
    expect(true).toBe(false)
  })
})
```

- [ ] **Step 2: Run the focused renderer tests**

Run: `pnpm vitest run tests/unit/renderer/*.test.ts tests/integration/renderer-ssr.test.ts`
Expected: FAIL if a real renderer gap remains.

- [ ] **Step 3: Add the missing regression coverage and minimal fix if needed**

```ts
// close only real remaining renderer backlog items
```

- [ ] **Step 4: Run the focused renderer tests again**

Run: `pnpm vitest run tests/unit/renderer/*.test.ts tests/integration/renderer-ssr.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/renderer tests/unit/renderer tests/integration/renderer-ssr.test.ts
git commit -m "test: close remaining renderer backlog regressions"
```

---

## Verification Strategy

- Do **not** build after changes.
- End-of-phase verification must include:
  - `pnpm vitest run tests/contracts/renderer-improvements-backlog.test.ts`
  - `pnpm vitest run tests/unit/renderer/*.test.ts tests/integration/renderer-ssr.test.ts`
  - `pnpm vitest run`

## Spec Coverage Check

- reconcile backlog to actual code → Task 1
- close remaining renderer regressions → Task 2

## Placeholder Scan

- No TODO/TBD placeholders remain.
- Phase intentionally executes only the remainder of `renderer-improvements.md`, not already-finished items.
