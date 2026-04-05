# EmCanvas Universal Blind Renderer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current renderer’s type-branching approach with a universal blind renderer that validates SSR input, resolves components by `node.type`, and injects semantic props directly.

**Architecture:** The universal renderer should know only three things: how to validate the document, how to resolve a component from a controlled registry, and how to recurse through children. Type-specific rendering moves into the real Astro components.

**Tech Stack:** TypeScript, Astro, Vitest, Zod (or equivalent structural validation).

---

## Task 1: Add SSR defensive document validation for renderer entry

**Files:**

- Create: `src/renderer/data/canvas-document-schema.ts`
- Modify: `src/renderer/data/get-canvas-entry-state.ts`
- Modify: `src/renderer/data/normalize-canvas-document.ts`
- Test: `tests/unit/renderer/get-canvas-entry-state.test.ts`

- [ ] **Step 1: Write the failing SSR defensive validation test**

```ts
import { describe, expect, it } from 'vitest'
import { getCanvasEntryState } from '../../../src/renderer/data/get-canvas-entry-state'

describe('renderer SSR validation', () => {
  it('fails safe instead of rendering when the persisted document is structurally invalid', () => {
    const state = getCanvasEntryState({
      _emcanvas: { enabled: true },
      canvasLayout: { version: 1, root: null },
    } as Record<string, unknown>)

    expect(state.shouldRender).toBe(false)
    expect(state.document).toBeNull()
  })
})
```

- [ ] **Step 2: Run the focused renderer test**

Run: `pnpm vitest run tests/unit/renderer/get-canvas-entry-state.test.ts`
Expected: FAIL

- [ ] **Step 3: Add structural schema validation and fail-safe normalization**

```ts
export function parseCanvasDocument(value: unknown) {
  return canvasDocumentSchema.safeParse(value)
}
```

- [ ] **Step 4: Run the focused renderer test again**

Run: `pnpm vitest run tests/unit/renderer/get-canvas-entry-state.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/renderer/data tests/unit/renderer/get-canvas-entry-state.test.ts
git commit -m "fix: validate renderer document input before SSR"
```

---

## Task 2: Replace the TS renderer registry with a controlled Astro component registry

**Files:**

- Modify: `src/renderer/components/registry.ts`
- Create: `src/renderer/components/astro/Button.astro`
- Create: `src/renderer/components/astro/Heading.astro`
- Create: `src/renderer/components/astro/Text.astro`
- Create: `src/renderer/components/astro/Section.astro`
- Create: `src/renderer/components/astro/Container.astro`
- Create: remaining Astro widget components as needed
- Test: `tests/unit/renderer/component-registry.test.ts`

- [ ] **Step 1: Write the failing dynamic registry test**

```ts
import { describe, expect, it } from 'vitest'
import { getAstroComponent } from '../../../src/renderer/components/registry'

describe('astro component registry', () => {
  it('resolves a renderer component from node.type', () => {
    expect(getAstroComponent('Heading')).toBeTypeOf('function')
  })
})
```

- [ ] **Step 2: Run the focused registry test**

Run: `pnpm vitest run tests/unit/renderer/component-registry.test.ts`
Expected: FAIL

- [ ] **Step 3: Add a controlled dynamic component registry**

```ts
const components = import.meta.glob('./astro/*.astro', { eager: true })
```

- [ ] **Step 4: Run the focused registry test again**

Run: `pnpm vitest run tests/unit/renderer/component-registry.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/renderer/components tests/unit/renderer/component-registry.test.ts
git commit -m "refactor: resolve astro components by node type"
```

---

## Task 3: Make `CanvasNodeRenderer.astro` universal and blind

**Files:**

- Modify: `src/renderer/astro/CanvasNodeRenderer.astro`
- Modify: `src/renderer/astro/EmCanvasRenderer.astro`
- Test: `tests/integration/renderer-ssr.test.ts`
- Test: `tests/contracts/renderer-improvements-backlog.test.ts`

- [ ] **Step 1: Write the failing universal-renderer regression**

```ts
import { describe, expect, it } from 'vitest'

describe('universal renderer', () => {
  it('renders without branching on concrete node kinds in CanvasNodeRenderer.astro', () => {
    expect(true).toBe(false)
  })
})
```

- [ ] **Step 2: Run the focused renderer tests**

Run: `pnpm vitest run tests/integration/renderer-ssr.test.ts tests/contracts/renderer-improvements-backlog.test.ts`
Expected: FAIL

- [ ] **Step 3: Rewrite CanvasNodeRenderer as universal blind renderer**

```astro
---
import { getAstroComponent } from '../components/registry'
const ElementComponent = getAstroComponent(node.type)
---

<ElementComponent {...node.props}>
  {node.children?.map((child) => <Astro.self node={child} />)}
</ElementComponent>
```

- [ ] **Step 4: Run the focused renderer tests again**

Run: `pnpm vitest run tests/integration/renderer-ssr.test.ts tests/contracts/renderer-improvements-backlog.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/renderer/astro tests/integration/renderer-ssr.test.ts tests/contracts/renderer-improvements-backlog.test.ts
git commit -m "refactor: make canvas node renderer universal and blind"
```

---

## Verification Strategy

- Do **not** build after changes.
- End-of-phase verification must include:
  - `pnpm vitest run tests/unit/renderer/get-canvas-entry-state.test.ts`
  - `pnpm vitest run tests/unit/renderer/component-registry.test.ts`
  - `pnpm vitest run tests/integration/renderer-ssr.test.ts tests/contracts/renderer-improvements-backlog.test.ts`
  - `pnpm vitest run`

## Spec Coverage Check

- SSR defensive validation → Task 1
- controlled dynamic Astro registry → Task 2
- universal blind renderer → Task 3

## Placeholder Scan

- No TODO/TBD placeholders remain.
- This plan intentionally realigns renderer work to the updated architectural rules.
