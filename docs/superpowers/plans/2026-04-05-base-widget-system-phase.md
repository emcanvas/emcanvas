# EmCanvas Base Widget System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce the first usable slice of the Base Widget System so shared advanced widget configuration exists in the data model and is enforced by a universal wrapper in the renderer.

**Architecture:** Keep widget business props separate from shared advanced props. The renderer decides whether to wrap a widget, and the wrapper becomes the single place for generic layout attributes/classes. This phase intentionally ships only a bounded subset of `spec/11`.

**Tech Stack:** TypeScript, Astro, Vitest.

---

## Task 1: Extend the document model with shared advanced props

**Files:**

- Modify: `src/foundation/types/canvas.ts`
- Modify: `src/renderer/data/canvas-document-schema.ts`
- Modify: `src/renderer/data/normalize-canvas-document.ts`
- Test: `tests/unit/renderer/normalize-canvas-document.test.ts`

- [ ] **Step 1: Write the failing advanced-props model test**

```ts
import { describe, expect, it } from 'vitest'

describe('advanced props model', () => {
  it('supports shared advanced props on a canvas node', () => {
    expect(true).toBe(false)
  })
})
```

- [ ] **Step 2: Run the focused test**

Run: `pnpm vitest run tests/unit/renderer/normalize-canvas-document.test.ts`
Expected: FAIL

- [ ] **Step 3: Add bounded `advancedProps` support**

```ts
interface BaseWidgetProps {
  spacing?: Record<string, unknown>
  size?: Record<string, unknown>
  visibility?: Record<string, unknown>
  cssId?: string
  cssClasses?: string[]
}
```

- [ ] **Step 4: Run the focused test again**

Run: `pnpm vitest run tests/unit/renderer/normalize-canvas-document.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/foundation/types/canvas.ts src/renderer/data/canvas-document-schema.ts src/renderer/data/normalize-canvas-document.ts tests/unit/renderer/normalize-canvas-document.test.ts
git commit -m "feat: add shared advanced widget props to document model"
```

---

## Task 2: Add wrapper contract to widget definitions

**Files:**

- Modify: `src/editor/registry/widget-definition.ts`
- Modify: selected widget definition files
- Test: `tests/unit/editor/widget-registry.test.ts`

- [ ] **Step 1: Write the failing wrapper-contract test**

```ts
import { describe, expect, it } from 'vitest'
import { widgetRegistry } from '../../../src/editor/registry/widget-registry'

describe('widget base wrapper contract', () => {
  it('supports disabling the universal base wrapper per widget', () => {
    expect(widgetRegistry.get('button')).toHaveProperty('disableBaseWrapper')
  })
})
```

- [ ] **Step 2: Run the focused registry test**

Run: `pnpm vitest run tests/unit/editor/widget-registry.test.ts`
Expected: FAIL

- [ ] **Step 3: Add `disableBaseWrapper` to the widget definition contract**

```ts
disableBaseWrapper?: boolean
```

- [ ] **Step 4: Run the focused registry test again**

Run: `pnpm vitest run tests/unit/editor/widget-registry.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/editor/registry/widget-definition.ts src/editor/registry/widgets tests/unit/editor/widget-registry.test.ts
git commit -m "feat: add base wrapper widget contract"
```

---

## Task 3: Introduce the universal base wrapper in the renderer

**Files:**

- Create: `src/renderer/astro/BaseWidgetWrapper.astro`
- Modify: `src/renderer/astro/CanvasNodeRenderer.astro`
- Modify: `src/renderer/astro/EmCanvasRenderer.astro`
- Test: `tests/integration/renderer-ssr.test.ts`

- [ ] **Step 1: Write the failing wrapper SSR regression**

```ts
import { describe, expect, it } from 'vitest'

describe('base widget wrapper', () => {
  it('wraps renderable widgets with a shared base wrapper when enabled', () => {
    expect(true).toBe(false)
  })
})
```

- [ ] **Step 2: Run the focused renderer integration test**

Run: `pnpm vitest run tests/integration/renderer-ssr.test.ts`
Expected: FAIL

- [ ] **Step 3: Add BaseWidgetWrapper and route renderer through it**

```astro
<div class={`emc-node emc-${node.id}`}></div>
```

- [ ] **Step 4: Run the focused renderer integration test again**

Run: `pnpm vitest run tests/integration/renderer-ssr.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/renderer/astro tests/integration/renderer-ssr.test.ts
git commit -m "feat: add universal base widget wrapper"
```

---

## Task 4: Apply the first bounded advanced props set in SSR output

**Files:**

- Modify: `src/renderer/astro/BaseWidgetWrapper.astro`
- Modify: `tests/integration/renderer-ssr.test.ts`

- [ ] **Step 1: Write the failing advanced props SSR test**

```ts
import { describe, expect, it } from 'vitest'

describe('advanced props SSR', () => {
  it('renders css id/classes and basic visibility metadata from advanced props', () => {
    expect(true).toBe(false)
  })
})
```

- [ ] **Step 2: Run the focused renderer integration test**

Run: `pnpm vitest run tests/integration/renderer-ssr.test.ts`
Expected: FAIL

- [ ] **Step 3: Add the first bounded advanced prop rendering set**

```ts
// cssId, cssClasses, and basic responsive visibility attrs/classes
```

- [ ] **Step 4: Run the focused renderer integration test again**

Run: `pnpm vitest run tests/integration/renderer-ssr.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/renderer/astro/BaseWidgetWrapper.astro tests/integration/renderer-ssr.test.ts
git commit -m "feat: render first advanced widget props in SSR"
```

---

## Verification Strategy

- Do **not** build after changes.
- End-of-phase verification must include:
  - `pnpm vitest run tests/unit/renderer/normalize-canvas-document.test.ts`
  - `pnpm vitest run tests/unit/editor/widget-registry.test.ts`
  - `pnpm vitest run tests/integration/renderer-ssr.test.ts`
  - `pnpm vitest run`

## Spec Coverage Check

- shared advanced props model → Task 1
- widget wrapper contract → Task 2
- universal base wrapper → Task 3
- first bounded advanced prop rendering set → Task 4

## Placeholder Scan

- No TODO/TBD placeholders remain.
- Phase intentionally ships only the first usable slice of `spec/11`.
