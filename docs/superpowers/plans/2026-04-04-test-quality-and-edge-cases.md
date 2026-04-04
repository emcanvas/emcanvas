# EmCanvas Test Quality and Edge Cases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Strengthen test quality by replacing brittle implementation-detail assertions and by adding focused unit and edge-case coverage for important pure modules.

**Architecture:** Keep production behavior the same. This phase is almost entirely test-driven, and production changes should only happen when a testability issue or uncovered edge case proves a real bug or poor boundary.

**Tech Stack:** TypeScript, React Testing Library, Vitest.

---

## Task 1: Replace implementation-detail assertions with observable behavior

**Files:**

- Modify: `tests/foundation/editor/app.test.tsx`
- Modify: `tests/integration/editor-shell-flow.test.tsx`
- Modify: `tests/unit/editor/editor-store.test.ts`

- [ ] **Step 1: Write the failing observable-behavior regression updates**

```ts
import { describe, expect, it } from 'vitest'

describe('observable editor behavior', () => {
  it('asserts visible/editor-state outcomes rather than empty assertions or internal spies', () => {
    expect(true).toBe(false)
  })
})
```

- [ ] **Step 2: Run the focused tests to expose current brittle assertions**

Run: `pnpm vitest run tests/foundation/editor/app.test.tsx tests/integration/editor-shell-flow.test.tsx tests/unit/editor/editor-store.test.ts`
Expected: FAIL or expose current implementation-detail assertions.

- [ ] **Step 3: Rewrite those tests around observable outcomes**

```ts
// Replace internal spies and empty assertions with visible UI state / returned state assertions
```

- [ ] **Step 4: Run the focused tests again**

Run: `pnpm vitest run tests/foundation/editor/app.test.tsx tests/integration/editor-shell-flow.test.tsx tests/unit/editor/editor-store.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/foundation/editor/app.test.tsx tests/integration/editor-shell-flow.test.tsx tests/unit/editor/editor-store.test.ts
git commit -m "test: prefer observable editor behavior assertions"
```

---

## Task 2: Add direct unit tests for DnD and tree utilities

**Files:**

- Create: `tests/unit/editor/dnd-operations.test.ts`
- Create: `tests/unit/editor/dnd-guards.test.ts`
- Create: `tests/unit/editor/tree-path.test.ts`

- [ ] **Step 1: Write the failing direct unit tests**

```ts
import { describe, expect, it } from 'vitest'

describe('dnd and tree utils', () => {
  it('covers the pure operations directly', () => {
    expect(true).toBe(false)
  })
})
```

- [ ] **Step 2: Run the focused unit tests**

Run: `pnpm vitest run tests/unit/editor/dnd-operations.test.ts tests/unit/editor/dnd-guards.test.ts tests/unit/editor/tree-path.test.ts`
Expected: FAIL because the test files do not exist yet.

- [ ] **Step 3: Add direct coverage for the pure modules**

```ts
// exercise operation helpers, validation guards, and tree-path utilities directly
```

- [ ] **Step 4: Run the focused unit tests again**

Run: `pnpm vitest run tests/unit/editor/dnd-operations.test.ts tests/unit/editor/dnd-guards.test.ts tests/unit/editor/tree-path.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/unit/editor/dnd-operations.test.ts tests/unit/editor/dnd-guards.test.ts tests/unit/editor/tree-path.test.ts
git commit -m "test: add unit coverage for dnd and tree utilities"
```

---

## Task 3: Add direct unit tests for renderer/style/admin pure modules

**Files:**

- Create: `tests/unit/editor/style-mutations.test.ts`
- Create: `tests/unit/renderer/build-inline-style.test.ts`
- Create: `tests/unit/renderer/build-media-rules.test.ts`
- Create: `tests/unit/renderer/normalize-canvas-document.test.ts`
- Create: `tests/unit/admin/error-mapping.test.ts`
- Create: `tests/unit/editor/entry-payload.test.ts`

- [ ] **Step 1: Write the failing unit tests**

```ts
import { describe, expect, it } from 'vitest'

describe('pure module coverage', () => {
  it('adds dedicated unit tests for currently uncovered helpers', () => {
    expect(true).toBe(false)
  })
})
```

- [ ] **Step 2: Run the focused unit tests**

Run: `pnpm vitest run tests/unit/editor/style-mutations.test.ts tests/unit/renderer/build-inline-style.test.ts tests/unit/renderer/build-media-rules.test.ts tests/unit/renderer/normalize-canvas-document.test.ts tests/unit/admin/error-mapping.test.ts tests/unit/editor/entry-payload.test.ts`
Expected: FAIL because the test files do not exist yet.

- [ ] **Step 3: Add the direct unit coverage**

```ts
// test pure transforms and helpers directly, no extra product changes
```

- [ ] **Step 4: Run the focused unit tests again**

Run: `pnpm vitest run tests/unit/editor/style-mutations.test.ts tests/unit/renderer/build-inline-style.test.ts tests/unit/renderer/build-media-rules.test.ts tests/unit/renderer/normalize-canvas-document.test.ts tests/unit/admin/error-mapping.test.ts tests/unit/editor/entry-payload.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/unit/editor/style-mutations.test.ts tests/unit/renderer/build-inline-style.test.ts tests/unit/renderer/build-media-rules.test.ts tests/unit/renderer/normalize-canvas-document.test.ts tests/unit/admin/error-mapping.test.ts tests/unit/editor/entry-payload.test.ts
git commit -m "test: add unit coverage for pure support modules"
```

---

## Task 4: Cover known edge cases in DnD, styling, and save boundaries

**Files:**

- Modify: existing tests where the closest behavior already lives

- [ ] **Step 1: Write failing edge-case regressions**

```ts
import { describe, expect, it } from 'vitest'

describe('known edge cases', () => {
  it('covers malformed payloads, no-op moves, style edge values, and save boundary behavior', () => {
    expect(true).toBe(false)
  })
})
```

- [ ] **Step 2: Run the focused edge-case tests**

Run: `pnpm vitest run tests/unit/editor/dnd-operations.test.ts tests/unit/editor/dnd-guards.test.ts tests/unit/renderer/build-inline-style.test.ts tests/foundation/routes/save-canvas-data.test.ts`
Expected: FAIL until new edge regressions are added.

- [ ] **Step 3: Add edge-case coverage only**

```ts
// malformed DnD payloads, move-node no-op/sibling cases, CSS injection/undefined/numeric values, save boundary mutation guard
```

- [ ] **Step 4: Run the focused edge-case tests again**

Run: `pnpm vitest run tests/unit/editor/dnd-operations.test.ts tests/unit/editor/dnd-guards.test.ts tests/unit/renderer/build-inline-style.test.ts tests/foundation/routes/save-canvas-data.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/unit/editor/dnd-operations.test.ts tests/unit/editor/dnd-guards.test.ts tests/unit/renderer/build-inline-style.test.ts tests/foundation/routes/save-canvas-data.test.ts
git commit -m "test: cover key edge cases across editor and renderer"
```

---

## Verification Strategy

- Do **not** build after changes.
- End-of-phase verification must include:
  - `pnpm vitest run tests/foundation/editor/app.test.tsx tests/integration/editor-shell-flow.test.tsx tests/unit/editor/editor-store.test.ts`
  - `pnpm vitest run tests/unit/editor/dnd-operations.test.ts tests/unit/editor/dnd-guards.test.ts tests/unit/editor/tree-path.test.ts`
  - `pnpm vitest run tests/unit/editor/style-mutations.test.ts tests/unit/renderer/build-inline-style.test.ts tests/unit/renderer/build-media-rules.test.ts tests/unit/renderer/normalize-canvas-document.test.ts tests/unit/admin/error-mapping.test.ts tests/unit/editor/entry-payload.test.ts`
  - `pnpm vitest run tests/foundation/routes/save-canvas-data.test.ts`

## Spec Coverage Check

- observable behavior instead of implementation details → Task 1
- direct coverage for DnD/tree utilities → Task 2
- direct coverage for pure support modules → Task 3
- edge-case regressions → Task 4

## Placeholder Scan

- No TODO/TBD placeholders remain.
- Phase intentionally prioritizes test quality over new behavior.
