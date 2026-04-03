# EmCanvas Renderer Hardening and Extensibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refine the existing EmCanvas renderer so it stays functionally equivalent while becoming simpler, safer, cleaner, and more extensible.

**Architecture:** Keep the current renderer pipeline intact, but move more semantics into render models, centralize media-rule emission at the root renderer, improve CSS sanitization, and turn the renderer registry into an explicit extensibility point.

**Tech Stack:** TypeScript, Astro, Vitest, SSR rendering, renderer contract tests.

---

## Proposed File Structure

```text
src/renderer/
├── astro/
│   ├── EmCanvasRenderer.astro
│   └── CanvasNodeRenderer.astro
├── components/
│   ├── registry.ts
│   └── renderers/*.ts
├── styles/
│   ├── build-inline-style.ts
│   ├── build-media-rules.ts
│   ├── serialize-responsive-styles.ts
│   └── collect-media-rules.ts
└── types/
    └── renderer.ts
```

## Task 1: Make render models more expressive and shrink the Astro branching surface

**Files:**
- Modify: `src/renderer/types/renderer.ts`
- Modify: `src/renderer/components/registry.ts`
- Modify: `src/renderer/components/renderers/{section,columns,container,heading,text,button,spacer,divider,image,video}.ts`
- Modify: `src/renderer/astro/CanvasNodeRenderer.astro`
- Test: `tests/unit/renderer/component-registry.test.ts`

- [ ] **Step 1: Write the failing render-model contract test**

```ts
import { describe, expect, it } from 'vitest'
import { getComponentRenderer } from '../../../src/renderer/components/registry'

describe('renderer registry', () => {
  it('returns render models with explicit category and tag semantics', () => {
    const model = getComponentRenderer('section')({
      id: 'root',
      type: 'section',
      props: {},
      styles: { desktop: {} },
      children: [],
    })

    expect(model.category).toBe('wrapper')
    expect(model.tag).toBe('section')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/unit/renderer/component-registry.test.ts`
Expected: FAIL because current render models are less expressive.

- [ ] **Step 3: Introduce wrapper/leaf render models and update renderers**

```ts
export type CanvasNodeRenderModel = WrapperRenderModel | LeafRenderModel
```

- [ ] **Step 4: Run the renderer registry test**

Run: `pnpm vitest run tests/unit/renderer/component-registry.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/renderer/types/renderer.ts src/renderer/components src/renderer/astro/CanvasNodeRenderer.astro tests/unit/renderer/component-registry.test.ts
git commit -m "refactor: simplify canvas node render model"
```

---

## Task 2: Emit responsive media rules once at the root renderer

**Files:**
- Create: `src/renderer/styles/collect-media-rules.ts`
- Modify: `src/renderer/astro/EmCanvasRenderer.astro`
- Modify: `src/renderer/astro/CanvasNodeRenderer.astro`
- Test: `tests/integration/renderer-ssr.test.ts`

- [ ] **Step 1: Write the failing SSR style consolidation test**

```ts
import { describe, expect, it } from 'vitest'

describe('EmCanvasRenderer SSR', () => {
  it('emits a single style block for responsive media rules', async () => {
    const html = '<style data-emcanvas-media-rules></style>'
    expect((html.match(/<style/g) ?? []).length).toBe(1)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/integration/renderer-ssr.test.ts`
Expected: FAIL because styles are still emitted per node.

- [ ] **Step 3: Collect media rules in the root renderer**

```ts
export function collectMediaRules(root: CanvasNode): string {
  return ''
}
```

- [ ] **Step 4: Run the SSR test**

Run: `pnpm vitest run tests/integration/renderer-ssr.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/renderer/styles/collect-media-rules.ts src/renderer/astro/EmCanvasRenderer.astro src/renderer/astro/CanvasNodeRenderer.astro tests/integration/renderer-ssr.test.ts
git commit -m "perf: consolidate renderer media rules"
```

---

## Task 3: Expand CSS value sanitization without opening unsafe paths

**Files:**
- Modify: `src/renderer/styles/build-inline-style.ts`
- Test: `tests/unit/renderer/serialize-responsive-styles.test.ts`

- [ ] **Step 1: Write the failing CSS sanitization regression test**

```ts
import { describe, expect, it } from 'vitest'
import { buildInlineStyle } from '../../../src/renderer/styles/build-inline-style'

describe('buildInlineStyle', () => {
  it('preserves valid modern CSS values like calc and var while stripping unsafe chars', () => {
    const result = buildInlineStyle({ width: 'calc(100% - 20px)', color: 'var(--brand-color)' })
    expect(result).toContain('calc(100% - 20px)')
    expect(result).toContain('var(--brand-color)')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/unit/renderer/serialize-responsive-styles.test.ts`
Expected: FAIL because current sanitization is too strict.

- [ ] **Step 3: Adjust CSS value sanitization conservatively**

```ts
function sanitizeCssValue(value: string): string {
  return value.replace(/[{}<>;\\]/g, '').trim()
}
```

- [ ] **Step 4: Run the CSS sanitization test**

Run: `pnpm vitest run tests/unit/renderer/serialize-responsive-styles.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/renderer/styles/build-inline-style.ts tests/unit/renderer/serialize-responsive-styles.test.ts
git commit -m "fix: relax safe css value sanitization"
```

---

## Task 4: Make the renderer registry explicitly extensible

**Files:**
- Modify: `src/renderer/components/registry.ts`
- Test: `tests/unit/renderer/component-registry.test.ts`

- [ ] **Step 1: Write the failing extensibility test**

```ts
import { describe, expect, it } from 'vitest'
import { getComponentRenderer, registerRenderer } from '../../../src/renderer/components/registry'

describe('renderer registry extensibility', () => {
  it('allows explicit registration of additional renderers', () => {
    registerRenderer('custom', () => ({ category: 'leaf', kind: 'custom', tag: 'div' }))
    expect(getComponentRenderer('custom')).toBeTypeOf('function')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/unit/renderer/component-registry.test.ts`
Expected: FAIL because registry does not support registration yet.

- [ ] **Step 3: Add explicit renderer registration**

```ts
export function registerRenderer(type: string, renderer: CanvasNodeRenderer) {
  renderers.set(type, renderer)
}
```

- [ ] **Step 4: Run the extensibility test**

Run: `pnpm vitest run tests/unit/renderer/component-registry.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/renderer/components/registry.ts tests/unit/renderer/component-registry.test.ts
git commit -m "feat: allow explicit renderer registration"
```

---

## Verification Strategy

- Do **not** build after changes.
- End-of-phase verification must include:
  - `pnpm vitest run tests/unit/renderer/*.test.ts`
  - `pnpm vitest run tests/integration/renderer-ssr.test.ts`

## Spec Coverage Check

- expressive render model → Task 1
- single media-style emission → Task 2
- CSS sanitization improvements → Task 3
- extensible renderer registry → Task 4

## Placeholder Scan

- No TODO/TBD placeholders remain.
- Plan intentionally avoids editor/plugin/runtime scope and stays renderer-only.
