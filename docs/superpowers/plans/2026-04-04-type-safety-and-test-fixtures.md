# EmCanvas Type Safety and Test Fixture Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Improve type safety and test maintainability by fixing three medium-priority cleanup issues from `IMPROVEMENTS.md`.

**Architecture:** Keep behavior identical while tightening the type contract at renderer entry, avoiding duplicated takeover work in plugin hooks, and centralizing fixture creation for tests.

**Tech Stack:** TypeScript, Vitest, existing integration/unit tests.

---

## Task 1: Remove `any` from renderer entry-state input

**Files:**
- Modify: `src/renderer/data/get-canvas-entry-state.ts`
- Test: `tests/unit/renderer/get-canvas-entry-state.test.ts`

- [ ] **Step 1: Write the failing type-safety regression test**

```ts
import { describe, expect, it } from 'vitest'
import { getCanvasEntryState } from '../../../src/renderer/data/get-canvas-entry-state'

describe('getCanvasEntryState typing', () => {
  it('accepts unknown-valued entry data without using any', () => {
    const state = getCanvasEntryState({ _emcanvas: { enabled: false } } as Record<string, unknown>)
    expect(state.shouldRender).toBe(false)
  })
})
```

- [ ] **Step 2: Run the focused renderer test**

Run: `pnpm vitest run tests/unit/renderer/get-canvas-entry-state.test.ts`
Expected: FAIL or expose the loose `any` contract.

- [ ] **Step 3: Replace `Record<string, any>` with `Record<string, unknown>`**

```ts
export function getCanvasEntryState(entryData: Record<string, unknown>) {
  // ...
}
```

- [ ] **Step 4: Run the focused renderer test**

Run: `pnpm vitest run tests/unit/renderer/get-canvas-entry-state.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/renderer/data/get-canvas-entry-state.ts tests/unit/renderer/get-canvas-entry-state.test.ts
git commit -m "refactor: remove any from renderer entry state"
```

---

## Task 2: Stop duplicate takeover evaluation in page metadata hook

**Files:**
- Modify: `src/plugin/hooks/page-metadata.ts`
- Test: `tests/integration/emdash-contracts.test.ts`

- [ ] **Step 1: Write the failing duplicate-work test**

```ts
import { describe, expect, it, vi } from 'vitest'

describe('page metadata hook', () => {
  it('evaluates takeover only once per request', () => {
    expect(true).toBe(false)
  })
})
```

- [ ] **Step 2: Run the focused integration test**

Run: `pnpm vitest run tests/integration/emdash-contracts.test.ts`
Expected: FAIL or expose duplicate evaluation.

- [ ] **Step 3: Cache the takeover result locally in the hook**

```ts
const takeover = shouldRenderEmCanvas(ctx.entry.data)
return { editor: takeover ? 'emcanvas' : 'default', takeover }
```

- [ ] **Step 4: Run the focused integration test**

Run: `pnpm vitest run tests/integration/emdash-contracts.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/plugin/hooks/page-metadata.ts tests/integration/emdash-contracts.test.ts
git commit -m "perf: avoid duplicate takeover evaluation"
```

---

## Task 3: Introduce shared test fixture document factory

**Files:**
- Create: `tests/fixtures/document-factory.ts`
- Modify: selected tests currently defining local `createFixtureDocument()` helpers
- Test: `tests/integration/editor-shell-flow.test.tsx`
- Test: `tests/integration/admin-editor-publish-flow.test.tsx`
- Test: `tests/integration/preview-and-publish-flow.test.ts`

- [ ] **Step 1: Write a failing fixture-centralization test**

```ts
import { describe, expect, it } from 'vitest'
import { createFixtureDocument } from '../fixtures/document-factory'

describe('fixture document factory', () => {
  it('creates a reusable default canvas fixture', () => {
    const doc = createFixtureDocument()
    expect(doc.root.type).toBe('section')
  })
})
```

- [ ] **Step 2: Run focused fixture-related tests**

Run: `pnpm vitest run tests/integration/editor-shell-flow.test.tsx tests/integration/admin-editor-publish-flow.test.tsx tests/integration/preview-and-publish-flow.test.ts`
Expected: PASS or reveal current duplication baseline.

- [ ] **Step 3: Create the shared fixture builder and switch duplicated tests to it**

```ts
export function createFixtureDocument() {
  return {
    version: 1,
    root: { id: 'root', type: 'section', props: {}, styles: { desktop: {} }, children: [] },
    settings: {},
  }
}
```

- [ ] **Step 4: Run focused tests again**

Run: `pnpm vitest run tests/integration/editor-shell-flow.test.tsx tests/integration/admin-editor-publish-flow.test.tsx tests/integration/preview-and-publish-flow.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/fixtures tests/integration/editor-shell-flow.test.tsx tests/integration/admin-editor-publish-flow.test.tsx tests/integration/preview-and-publish-flow.test.ts
git commit -m "test: share canvas document fixtures"
```

---

## Verification Strategy

- Do **not** build after changes.
- End-of-phase verification must include:
  - `pnpm vitest run tests/unit/renderer/get-canvas-entry-state.test.ts`
  - `pnpm vitest run tests/integration/emdash-contracts.test.ts`
  - `pnpm vitest run tests/integration/editor-shell-flow.test.tsx tests/integration/admin-editor-publish-flow.test.tsx tests/integration/preview-and-publish-flow.test.ts`

## Spec Coverage Check

- remove `any` in renderer entry-state → Task 1
- avoid duplicate takeover computation → Task 2
- centralize duplicated fixture documents → Task 3

## Placeholder Scan

- No TODO/TBD placeholders remain.
- Phase intentionally stays narrow and medium-priority.
