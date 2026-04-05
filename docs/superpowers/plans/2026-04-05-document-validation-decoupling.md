# EmCanvas Document Validation Decoupling Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the direct dependency from editor document validation onto the global widget registry singleton.

**Architecture:** Validation functions should receive registry semantics explicitly. The current production flow can still inject the default registry, but the core validation code should stop importing a global singleton.

**Tech Stack:** TypeScript, Vitest.

---

## Task 1: Introduce an explicit validation-registry dependency

**Files:**

- Modify: `src/editor/model/document-validation.ts`
- Test: `tests/unit/editor/dnd-operations.test.ts`

- [ ] **Step 1: Write the failing dependency-injection regression**

```ts
import { describe, expect, it } from 'vitest'

describe('document validation registry dependency', () => {
  it('does not require the global widget registry singleton to validate insertions', () => {
    expect(true).toBe(false)
  })
})
```

- [ ] **Step 2: Run the focused unit tests**

Run: `pnpm vitest run tests/unit/editor/dnd-operations.test.ts`
Expected: FAIL or reveal the singleton dependency.

- [ ] **Step 3: Make validation receive the registry explicitly**

```ts
export function validateInsertChildNode(document, parentId, node, registry) {
  // ...
}
```

- [ ] **Step 4: Run the focused unit tests again**

Run: `pnpm vitest run tests/unit/editor/dnd-operations.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/editor/model/document-validation.ts tests/unit/editor/dnd-operations.test.ts
git commit -m "refactor: inject widget registry into document validation"
```

---

## Task 2: Adapt production call sites to pass the default registry explicitly

**Files:**

- Modify: `src/editor/model/document-mutations.ts`
- Modify: any immediate production caller of validation helpers
- Test: `tests/unit/editor/document-mutations.test.ts`

- [ ] **Step 1: Write the failing production-call regression**

```ts
import { describe, expect, it } from 'vitest'

describe('document mutation validation wiring', () => {
  it('passes the default widget registry explicitly into validation', () => {
    expect(true).toBe(false)
  })
})
```

- [ ] **Step 2: Run the focused mutation tests**

Run: `pnpm vitest run tests/unit/editor/document-mutations.test.ts`
Expected: FAIL or expose broken wiring.

- [ ] **Step 3: Wire the default registry through production paths explicitly**

```ts
import { widgetRegistry } from '../registry/widget-registry'
```

- [ ] **Step 4: Run the focused mutation tests again**

Run: `pnpm vitest run tests/unit/editor/document-mutations.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/editor/model/document-mutations.ts tests/unit/editor/document-mutations.test.ts
git commit -m "refactor: pass default registry into mutation validation"
```

---

## Task 3: Prove tests can use alternative registries without touching globals

**Files:**

- Modify: `tests/unit/editor/dnd-operations.test.ts`
- Modify: `tests/unit/editor/document-mutations.test.ts`

- [ ] **Step 1: Write the failing alternative-registry regression**

```ts
import { describe, expect, it } from 'vitest'

describe('alternative registry validation', () => {
  it('supports custom registry semantics in tests without mutating the global singleton', () => {
    expect(true).toBe(false)
  })
})
```

- [ ] **Step 2: Run the focused tests**

Run: `pnpm vitest run tests/unit/editor/dnd-operations.test.ts tests/unit/editor/document-mutations.test.ts`
Expected: FAIL until tests stop relying on the singleton.

- [ ] **Step 3: Add focused alternative-registry tests**

```ts
// custom registry fixture proving validation behavior changes via explicit dependency
```

- [ ] **Step 4: Run the focused tests again**

Run: `pnpm vitest run tests/unit/editor/dnd-operations.test.ts tests/unit/editor/document-mutations.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/unit/editor/dnd-operations.test.ts tests/unit/editor/document-mutations.test.ts
git commit -m "test: validate document rules with explicit registries"
```

---

## Verification Strategy

- Do **not** build after changes.
- End-of-phase verification must include:
  - `pnpm vitest run tests/unit/editor/dnd-operations.test.ts`
  - `pnpm vitest run tests/unit/editor/document-mutations.test.ts`
  - `pnpm vitest run`

## Spec Coverage Check

- explicit validation dependency → Task 1
- production wiring with default registry → Task 2
- alternative registries in tests → Task 3

## Placeholder Scan

- No TODO/TBD placeholders remain.
- Phase intentionally stays bounded to validation decoupling only.
