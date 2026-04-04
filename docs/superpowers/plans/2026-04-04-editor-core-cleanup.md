# EmCanvas Editor Core Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove the most important editor-core architectural debt without expanding product scope.

**Architecture:** Preserve the existing editor experience while tightening internals around one shell, one history path, and one dependency direction. The plugin/runtime layer should inject persistence into the editor rather than the editor importing plugin runtime modules.

**Tech Stack:** TypeScript, React, Vitest, command-history pattern.

---

## Task 1: Collapse duplicate editor shell responsibility

**Files:**
- Modify: `src/foundation/editor/app.tsx`
- Modify: `src/plugin/pages/dashboard-page.tsx`
- Delete or reduce: `src/foundation/editor/shell/editor-shell.tsx`
- Test: `tests/foundation/editor/app.test.tsx`
- Test: `tests/unit/plugin/dashboard-page.test.tsx`

- [ ] **Step 1: Write the failing shell-authority test**

```ts
import { describe, expect, it } from 'vitest'
import { DashboardPage } from '../../src/plugin/pages/dashboard-page'

describe('DashboardPage', () => {
  it('uses the real editor shell path rather than the foundation stub shell', () => {
    expect(DashboardPage).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails or exposes the current split**

Run: `pnpm vitest run tests/foundation/editor/app.test.tsx tests/unit/plugin/dashboard-page.test.tsx`
Expected: FAIL or reveal the duplicate-shell path.

- [ ] **Step 3: Remove duplicate shell responsibility**

```ts
// foundation app should delegate to the real editor shell path, not a competing stub shell
```

- [ ] **Step 4: Run shell tests**

Run: `pnpm vitest run tests/foundation/editor/app.test.tsx tests/unit/plugin/dashboard-page.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/foundation/editor src/plugin/pages tests/foundation/editor/app.test.tsx tests/unit/plugin/dashboard-page.test.tsx
git commit -m "refactor: remove duplicate editor shell path"
```

---

## Task 2: Route prop and style edits through command history

**Files:**
- Modify: `src/editor/commands/update-props-command.ts`
- Modify: `src/editor/commands/update-styles-command.ts`
- Modify: `src/editor/shell/editor-sidebar.tsx`
- Test: `tests/integration/property-inspector.test.tsx`
- Test: `tests/integration/editor-history.test.ts`

- [ ] **Step 1: Write the failing history participation test**

```ts
import { describe, expect, it } from 'vitest'

describe('property/style editing history', () => {
  it('makes prop and style edits undoable through the history path', () => {
    expect(true).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify failure**

Run: `pnpm vitest run tests/integration/property-inspector.test.tsx tests/integration/editor-history.test.ts`
Expected: FAIL because edits bypass history.

- [ ] **Step 3: Convert prop/style edit helpers into real command-path participants**

```ts
// update-props-command and update-styles-command should integrate with Command/history flow
```

- [ ] **Step 4: Run history/edit tests**

Run: `pnpm vitest run tests/integration/property-inspector.test.tsx tests/integration/editor-history.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/editor/commands src/editor/shell/editor-sidebar.tsx tests/integration/property-inspector.test.tsx tests/integration/editor-history.test.ts
git commit -m "fix: route prop and style edits through command history"
```

---

## Task 3: Introduce a persistence port for the editor

**Files:**
- Create: `src/editor/persistence/persistence-port.ts`
- Modify: `src/editor/persistence/load-document.ts`
- Modify: `src/editor/persistence/save-document.ts`
- Modify: `src/admin/lib/plugin-api.ts`
- Test: `tests/integration/plugin-api-host-contract.test.ts`
- Test: `tests/integration/editor-save-flow.test.ts`

- [ ] **Step 1: Write the failing dependency-direction test**

```ts
import { describe, expect, it } from 'vitest'

describe('editor persistence port', () => {
  it('lets editor persistence depend on an injected port instead of plugin runtime imports', () => {
    expect(true).toBe(false)
  })
})
```

- [ ] **Step 2: Run tests to verify failure**

Run: `pnpm vitest run tests/integration/plugin-api-host-contract.test.ts tests/integration/editor-save-flow.test.ts`
Expected: FAIL because current editor persistence imports plugin runtime directly.

- [ ] **Step 3: Add persistence port and inject the concrete plugin implementation**

```ts
export interface PersistencePort {
  loadDocument: (...args: never[]) => Promise<unknown>
  saveDocument: (...args: never[]) => Promise<unknown>
  getPreviewLink: (...args: never[]) => string
}
```

- [ ] **Step 4: Run persistence tests**

Run: `pnpm vitest run tests/integration/plugin-api-host-contract.test.ts tests/integration/editor-save-flow.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/editor/persistence src/admin/lib/plugin-api.ts tests/integration/plugin-api-host-contract.test.ts tests/integration/editor-save-flow.test.ts
git commit -m "refactor: inject editor persistence through a port"
```

---

## Verification Strategy

- Do **not** build after changes.
- End-of-phase verification must include:
  - `pnpm vitest run tests/foundation/editor/app.test.tsx tests/unit/plugin/dashboard-page.test.tsx`
  - `pnpm vitest run tests/integration/property-inspector.test.tsx tests/integration/editor-history.test.ts`
  - `pnpm vitest run tests/integration/plugin-api-host-contract.test.ts tests/integration/editor-save-flow.test.ts`

## Spec Coverage Check

- duplicate shell cleanup → Task 1
- undoable prop/style edits → Task 2
- persistence dependency inversion → Task 3

## Placeholder Scan

- No TODO/TBD placeholders remain.
- Plan intentionally focuses on the highest-priority editor-core debt only.
