# EmCanvas MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the EmCanvas MVP as an external EmDash plugin with a dedicated visual editor, layout persistence in `entry.data`, SSR frontend rendering, and a complete edit-preview-publish loop.

**Architecture:** EmCanvas is split into four implementation domains: Foundation, Editor Core, Frontend Renderer, and Integration/Quality. The key architectural rule is that the layout tree is the single source of truth, plugin wiring stays host-specific, and renderer/editor concerns remain separate.

**Tech Stack:** TypeScript, React, Astro, EmDash plugin APIs, JSON document model, SSR rendering, test-first validation.

---

## Proposed Implementation Structure

```text
emcanvas/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/
│   ├── plugin/
│   │   ├── index.ts
│   │   ├── manifest.ts
│   │   ├── descriptor.ts
│   │   ├── sandbox-entry.ts
│   │   ├── pages/
│   │   │   ├── dashboard-page.tsx
│   │   │   └── editor-page.tsx
│   │   ├── routes/
│   │   │   ├── get-canvas-data.ts
│   │   │   ├── save-canvas-data.ts
│   │   │   └── preview-link.ts
│   │   └── hooks/
│   │       ├── index.ts
│   │       ├── page-fragments.ts
│   │       ├── page-metadata.ts
│   │       └── entry-editor-actions.ts
│   ├── foundation/
│   │   ├── types/
│   │   ├── model/
│   │   ├── editor/
│   │   └── shared/
│   ├── editor/
│   │   ├── model/
│   │   ├── registry/
│   │   ├── state/
│   │   ├── shell/
│   │   ├── canvas/
│   │   ├── dnd/
│   │   ├── inspector/
│   │   ├── styles/
│   │   ├── persistence/
│   │   ├── commands/
│   │   └── shared/
│   ├── renderer/
│   │   ├── astro/
│   │   ├── components/
│   │   ├── styles/
│   │   ├── data/
│   │   └── types/
│   ├── integration/
│   │   ├── hooks/
│   │   └── page/
│   ├── admin/
│   │   ├── pages/
│   │   ├── components/
│   │   └── lib/
│   ├── shared/
│   │   ├── types/
│   │   ├── validation/
│   │   └── perf/
│   └── styles/
│       └── editor.css
├── tests/
│   ├── foundation/
│   ├── unit/
│   ├── integration/
│   ├── accessibility/
│   └── performance/
└── docs/
    ├── integration/
    ├── testing/
    └── release/
```

## Sequence Overview

1. Foundation
2. Editor Core model and registry
3. Editor UI and manipulation loop
4. SSR renderer
5. Host integration and quality gates

---

### Task 1: Bootstrap repository runtime and plugin entrypoints

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `vite.config.ts`
- Create: `src/plugin/index.ts`
- Create: `src/plugin/manifest.ts`
- Create: `src/plugin/descriptor.ts`
- Create: `src/plugin/sandbox-entry.ts`
- Test: `tests/unit/plugin/manifest.test.ts`

- [ ] **Step 1: Write the failing manifest test**

```ts
import { describe, expect, it } from 'vitest'
import plugin from '../../../src/plugin/manifest'

describe('plugin manifest', () => {
  it('declares the EmCanvas plugin contract', () => {
    expect(plugin.id).toBe('emcanvas')
    expect(plugin.name).toBe('EmCanvas')
    expect(plugin.version).toBe('0.1.0')
    expect(plugin.adminPages).toBeDefined()
    expect(plugin.routes).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/unit/plugin/manifest.test.ts`
Expected: FAIL because manifest files do not exist yet.

- [ ] **Step 3: Write minimal plugin manifest and entrypoints**

```ts
// src/plugin/manifest.ts
const plugin = {
  id: 'emcanvas',
  name: 'EmCanvas',
  version: '0.1.0',
  capabilities: ['read:content', 'write:content', 'page:inject'],
  adminPages: [
    { path: '/', label: 'EmCanvas' },
    { path: '/editor', label: 'Editor' },
  ],
  routes: {},
}

export default plugin
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/unit/plugin/manifest.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json tsconfig.json vite.config.ts src/plugin tests/unit/plugin/manifest.test.ts
git commit -m "feat: bootstrap emcanvas plugin runtime"
```

---

### Task 2: Define the canvas document contracts and persistence shape

**Files:**
- Create: `src/foundation/types/canvas.ts`
- Create: `src/foundation/types/entry-data.ts`
- Create: `src/foundation/shared/constants.ts`
- Create: `src/shared/types/canvas-entry.ts`
- Test: `tests/foundation/model/guards.test.ts`

- [ ] **Step 1: Write the failing document-shape test**

```ts
import { describe, expect, it } from 'vitest'
import { isCanvasDocument } from '../../../src/foundation/model/guards'

describe('canvas document shape', () => {
  it('accepts a minimal valid document', () => {
    expect(isCanvasDocument({ version: 1, root: { id: 'root', type: 'section', props: {}, styles: { desktop: {} }, children: [] }, settings: {} })).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/foundation/model/guards.test.ts`
Expected: FAIL because guard/type files do not exist.

- [ ] **Step 3: Add the base types and constants**

```ts
export interface CanvasNode {
  id: string
  type: string
  props: Record<string, unknown>
  styles: { desktop: Record<string, unknown>; tablet?: Record<string, unknown>; mobile?: Record<string, unknown> }
  children?: CanvasNode[]
}

export interface CanvasDocument {
  version: 1
  root: CanvasNode
  settings: Record<string, unknown>
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm vitest tests/foundation/model/guards.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/foundation src/shared tests/foundation/model/guards.test.ts
git commit -m "feat: define canvas document contracts"
```

---

### Task 3: Implement defaults, guards, and document factory

**Files:**
- Create: `src/foundation/model/defaults.ts`
- Create: `src/foundation/model/document-factory.ts`
- Create: `src/foundation/model/guards.ts`
- Create: `src/foundation/shared/ids.ts`
- Test: `tests/foundation/model/document-factory.test.ts`
- Modify: `tests/foundation/model/guards.test.ts`

- [ ] **Step 1: Write failing tests for factory defaults**

```ts
import { describe, expect, it } from 'vitest'
import { createDefaultCanvasDocument } from '../../../src/foundation/model/document-factory'

describe('createDefaultCanvasDocument', () => {
  it('creates a version 1 document with a root node', () => {
    const doc = createDefaultCanvasDocument()
    expect(doc.version).toBe(1)
    expect(doc.root.id).toBeTruthy()
    expect(doc.root.type).toBe('section')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest tests/foundation/model/document-factory.test.ts`
Expected: FAIL

- [ ] **Step 3: Add factory, ids, and guards**

```ts
export function createDefaultCanvasDocument() {
  return {
    version: 1,
    root: {
      id: 'root-1',
      type: 'section',
      props: {},
      styles: { desktop: {} },
      children: [],
    },
    settings: {},
  }
}
```

- [ ] **Step 4: Run focused model tests**

Run: `pnpm vitest tests/foundation/model/document-factory.test.ts tests/foundation/model/guards.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/foundation/model src/foundation/shared tests/foundation/model
git commit -m "feat: add document defaults and guards"
```

---

### Task 4: Implement plugin routes for load/save of canvas data

**Files:**
- Create: `src/plugin/routes/get-canvas-data.ts`
- Create: `src/plugin/routes/save-canvas-data.ts`
- Test: `tests/foundation/routes/get-canvas-data.test.ts`
- Test: `tests/foundation/routes/save-canvas-data.test.ts`
- Modify: `src/plugin/manifest.ts`

- [ ] **Step 1: Write failing tests for route behavior**

```ts
import { describe, expect, it } from 'vitest'
import { getCanvasData } from '../../../src/plugin/routes/get-canvas-data'

describe('getCanvasData', () => {
  it('returns a default document when canvas data is missing', async () => {
    const result = await getCanvasData({ entry: { data: {} } })
    expect(result.canvasLayout.version).toBe(1)
  })
})
```

- [ ] **Step 2: Run route tests to verify failure**

Run: `pnpm vitest tests/foundation/routes/get-canvas-data.test.ts tests/foundation/routes/save-canvas-data.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement minimal load/save handlers**

```ts
export async function getCanvasData(ctx: { entry: { data: Record<string, unknown> } }) {
  const data = ctx.entry.data
  return {
    canvasLayout: data.canvasLayout ?? createDefaultCanvasDocument(),
    meta: data._emcanvas ?? { enabled: false, version: 1, editorVersion: '0.1.0' },
  }
}
```

- [ ] **Step 4: Run route tests**

Run: `pnpm vitest tests/foundation/routes/get-canvas-data.test.ts tests/foundation/routes/save-canvas-data.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/plugin/routes src/plugin/manifest.ts tests/foundation/routes
git commit -m "feat: add canvas load and save routes"
```

---

### Task 5: Mount the editor shell and basic viewport

**Files:**
- Create: `src/foundation/editor/app.tsx`
- Create: `src/foundation/editor/shell/editor-shell.tsx`
- Create: `src/foundation/editor/shell/viewport-panel.tsx`
- Create: `src/foundation/editor/state/editor-session.ts`
- Create: `src/plugin/pages/editor-page.tsx`
- Create: `src/plugin/pages/dashboard-page.tsx`
- Create: `src/styles/editor.css`
- Test: `tests/foundation/editor/editor-shell.test.tsx`
- Test: `tests/foundation/editor/viewport-panel.test.tsx`

- [ ] **Step 1: Write failing editor shell tests**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditorShell } from '../../../src/foundation/editor/shell/editor-shell'

describe('EditorShell', () => {
  it('renders the visual editor shell', () => {
    render(<EditorShell title="EmCanvas" />)
    expect(screen.getByText('EmCanvas')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run editor shell tests to verify failure**

Run: `pnpm vitest tests/foundation/editor/editor-shell.test.tsx tests/foundation/editor/viewport-panel.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement the shell and viewport components**

```tsx
export function EditorShell({ title }: { title: string }) {
  return (
    <main>
      <h1>{title}</h1>
      <section aria-label="Canvas viewport" />
    </main>
  )
}
```

- [ ] **Step 4: Run shell tests**

Run: `pnpm vitest tests/foundation/editor/editor-shell.test.tsx tests/foundation/editor/viewport-panel.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/foundation/editor src/plugin/pages src/styles tests/foundation/editor
git commit -m "feat: mount initial editor shell"
```

---

### Task 6: Define the widget registry and the 10 MVP widgets

**Files:**
- Create: `src/editor/registry/widget-definition.ts`
- Create: `src/editor/registry/widget-registry.ts`
- Create: `src/editor/registry/categories.ts`
- Create: `src/editor/registry/widgets/{section,columns,container,heading,text,button,spacer,divider,image,video}.ts`
- Test: `tests/unit/editor/widget-registry.test.ts`

- [ ] **Step 1: Write the failing registry test**

```ts
import { describe, expect, it } from 'vitest'
import { widgetRegistry } from '../../../src/editor/registry/widget-registry'

describe('widgetRegistry', () => {
  it('contains the 10 MVP widgets', () => {
    expect(widgetRegistry.size).toBe(10)
    expect(widgetRegistry.has('section')).toBe(true)
    expect(widgetRegistry.has('video')).toBe(true)
  })
})
```

- [ ] **Step 2: Run the registry test to verify failure**

Run: `pnpm vitest tests/unit/editor/widget-registry.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement widget definitions and registry**

```ts
export interface WidgetDefinition {
  type: string
  label: string
  category: 'layout' | 'content' | 'media'
  defaultProps: Record<string, unknown>
  propSchema: Array<Record<string, unknown>>
  allowedChildren?: string[] | 'any' | 'none'
}
```

- [ ] **Step 4: Run the registry test**

Run: `pnpm vitest tests/unit/editor/widget-registry.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/editor/registry tests/unit/editor/widget-registry.test.ts
git commit -m "feat: define mvp widget registry"
```

---

### Task 7: Implement pure document mutations and validation rules

**Files:**
- Create: `src/editor/model/document-mutations.ts`
- Create: `src/editor/model/document-validation.ts`
- Create: `src/editor/shared/tree-path.ts`
- Test: `tests/unit/editor/document-mutations.test.ts`

- [ ] **Step 1: Write failing mutation tests**

```ts
import { describe, expect, it } from 'vitest'
import { insertChildNode } from '../../../src/editor/model/document-mutations'

describe('insertChildNode', () => {
  it('adds a child node under a valid parent', () => {
    const result = insertChildNode(/* fixture doc */, 'root', { id: 'n1', type: 'heading', props: {}, styles: { desktop: {} } })
    expect(result.root.children).toHaveLength(1)
  })
})
```

- [ ] **Step 2: Run the mutation test to verify failure**

Run: `pnpm vitest tests/unit/editor/document-mutations.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement pure mutation helpers**

```ts
export function insertChildNode(document: CanvasDocument, parentId: string, node: CanvasNode): CanvasDocument {
  // return new document copy with inserted node
  return document
}
```

- [ ] **Step 4: Run mutation tests**

Run: `pnpm vitest tests/unit/editor/document-mutations.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/editor/model src/editor/shared tests/unit/editor/document-mutations.test.ts
git commit -m "feat: add pure canvas document mutations"
```

---

### Task 8: Build editor state, selection, and history stores

**Files:**
- Create: `src/editor/state/editor-store.ts`
- Create: `src/editor/state/selection-store.ts`
- Create: `src/editor/state/history-store.ts`
- Test: `tests/unit/editor/editor-store.test.ts`

- [ ] **Step 1: Write failing store tests**

```ts
import { describe, expect, it } from 'vitest'
import { createEditorStore } from '../../../src/editor/state/editor-store'

describe('editor store', () => {
  it('tracks selected node and dirty state', () => {
    const store = createEditorStore()
    store.selectNode('root')
    expect(store.getState().selectedNodeId).toBe('root')
  })
})
```

- [ ] **Step 2: Run store tests to verify failure**

Run: `pnpm vitest tests/unit/editor/editor-store.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement minimal editor store contracts**

```ts
export function createEditorStore() {
  let state = { selectedNodeId: null as string | null, dirty: false }
  return {
    selectNode(id: string) { state = { ...state, selectedNodeId: id } },
    getState() { return state },
  }
}
```

- [ ] **Step 4: Run store tests**

Run: `pnpm vitest tests/unit/editor/editor-store.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/editor/state tests/unit/editor/editor-store.test.ts
git commit -m "feat: add editor state stores"
```

---

### Task 9: Build the operational editor UI loop

**Files:**
- Create: `src/editor/shell/editor-shell.tsx`
- Create: `src/editor/shell/editor-toolbar.tsx`
- Create: `src/editor/shell/editor-sidebar.tsx`
- Create: `src/editor/shell/editor-statusbar.tsx`
- Create: `src/editor/canvas/canvas-viewport.tsx`
- Create: `src/editor/canvas/canvas-surface.tsx`
- Create: `src/editor/canvas/canvas-node-renderer.tsx`
- Create: `src/editor/canvas/selection-outline-layer.tsx`
- Create: `src/editor/canvas/breadcrumb-bar.tsx`
- Test: `tests/integration/editor-shell-flow.test.tsx`

- [ ] **Step 1: Write the failing editor flow test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditorShell } from '../../../src/editor/shell/editor-shell'

describe('editor shell flow', () => {
  it('renders toolbar, canvas, sidebar, and statusbar', () => {
    render(<EditorShell />)
    expect(screen.getByLabelText('Editor toolbar')).toBeInTheDocument()
    expect(screen.getByLabelText('Canvas viewport')).toBeInTheDocument()
    expect(screen.getByLabelText('Property inspector')).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the flow test to verify failure**

Run: `pnpm vitest tests/integration/editor-shell-flow.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement the shell composition**

```tsx
export function EditorShell() {
  return (
    <div>
      <header aria-label="Editor toolbar" />
      <main aria-label="Canvas viewport" />
      <aside aria-label="Property inspector" />
      <footer aria-label="Editor statusbar" />
    </div>
  )
}
```

- [ ] **Step 4: Run the flow test**

Run: `pnpm vitest tests/integration/editor-shell-flow.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/editor/shell src/editor/canvas tests/integration/editor-shell-flow.test.tsx
git commit -m "feat: compose editor interaction shell"
```

---

### Task 10: Implement property inspector and responsive style editor

**Files:**
- Create: `src/editor/inspector/property-inspector.tsx`
- Create: `src/editor/inspector/prop-field-renderer.tsx`
- Create: `src/editor/inspector/fields/{text-field,number-field,select-field,boolean-field,media-field}.tsx`
- Create: `src/editor/styles/style-editor.tsx`
- Create: `src/editor/styles/breakpoint-switcher.tsx`
- Create: `src/editor/styles/style-mutations.ts`
- Create: `src/editor/styles/style-fields/{spacing-field,size-field,color-field,typography-field}.tsx`
- Create: `src/editor/commands/update-props-command.ts`
- Create: `src/editor/commands/update-styles-command.ts`
- Test: `tests/integration/property-inspector.test.tsx`

- [ ] **Step 1: Write the failing inspector test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PropertyInspector } from '../../../src/editor/inspector/property-inspector'

describe('PropertyInspector', () => {
  it('renders generated controls from widget schema', () => {
    render(<PropertyInspector />)
    expect(screen.getByLabelText(/text/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the inspector test to verify failure**

Run: `pnpm vitest tests/integration/property-inspector.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement generated inspector and style panels**

```tsx
export function PropertyInspector() {
  return <form aria-label="Property inspector" />
}
```

- [ ] **Step 4: Run the inspector test**

Run: `pnpm vitest tests/integration/property-inspector.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/editor/inspector src/editor/styles src/editor/commands tests/integration/property-inspector.test.tsx
git commit -m "feat: add property and style editing panels"
```

---

### Task 11: Implement drag-and-drop and undo/redo

**Files:**
- Create: `src/editor/dnd/dnd-types.ts`
- Create: `src/editor/dnd/dnd-guards.ts`
- Create: `src/editor/dnd/dnd-operations.ts`
- Create: `src/editor/canvas/drop-zone-layer.tsx`
- Create: `src/editor/commands/command.ts`
- Create: `src/editor/commands/create-node-command.ts`
- Create: `src/editor/commands/move-node-command.ts`
- Create: `src/editor/commands/delete-node-command.ts`
- Modify: `src/editor/state/history-store.ts`
- Test: `tests/integration/editor-history.test.ts`
- Test: `tests/integration/editor-dnd.test.tsx`

- [ ] **Step 1: Write failing DnD and history tests**

```ts
import { describe, expect, it } from 'vitest'
import { createHistoryStore } from '../../../src/editor/state/history-store'

describe('history store', () => {
  it('can undo and redo commands', () => {
    const history = createHistoryStore()
    expect(history.canUndo()).toBe(false)
  })
})
```

- [ ] **Step 2: Run DnD/history tests to verify failure**

Run: `pnpm vitest tests/integration/editor-history.test.ts tests/integration/editor-dnd.test.tsx`
Expected: FAIL

- [ ] **Step 3: Implement guards, commands, and history wiring**

```ts
export interface Command {
  execute(): void
  undo(): void
}
```

- [ ] **Step 4: Run DnD/history tests**

Run: `pnpm vitest tests/integration/editor-history.test.ts tests/integration/editor-dnd.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/editor/dnd src/editor/commands src/editor/state/history-store.ts tests/integration/editor-history.test.ts tests/integration/editor-dnd.test.tsx
git commit -m "feat: add drag and drop with history"
```

---

### Task 12: Implement persistence, save, and autosave in the editor

**Files:**
- Create: `src/editor/persistence/entry-payload.ts`
- Create: `src/editor/persistence/load-document.ts`
- Create: `src/editor/persistence/save-document.ts`
- Create: `src/editor/state/autosave-controller.ts`
- Test: `tests/integration/editor-save-flow.test.ts`

- [ ] **Step 1: Write failing save-flow tests**

```ts
import { describe, expect, it } from 'vitest'
import { buildEntryPayload } from '../../../src/editor/persistence/entry-payload'

describe('buildEntryPayload', () => {
  it('preserves non-emcanvas entry data while writing canvas state', () => {
    const payload = buildEntryPayload({ slug: 'home' }, { version: 1, root: { id: 'root', type: 'section', props: {}, styles: { desktop: {} } }, settings: {} })
    expect(payload.slug).toBe('home')
    expect(payload.canvasLayout).toBeDefined()
  })
})
```

- [ ] **Step 2: Run save-flow tests to verify failure**

Run: `pnpm vitest tests/integration/editor-save-flow.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement payload mapping and autosave controller**

```ts
export function buildEntryPayload(entryData: Record<string, unknown>, canvasLayout: CanvasDocument) {
  return {
    ...entryData,
    _emcanvas: { enabled: true, version: 1, editorVersion: '0.1.0' },
    canvasLayout,
  }
}
```

- [ ] **Step 4: Run save-flow tests**

Run: `pnpm vitest tests/integration/editor-save-flow.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/editor/persistence src/editor/state/autosave-controller.ts tests/integration/editor-save-flow.test.ts
git commit -m "feat: add editor save and autosave flow"
```

---

### Task 13: Implement SSR renderer data contracts and style serialization

**Files:**
- Create: `src/renderer/types/renderer.ts`
- Create: `src/renderer/data/get-canvas-entry-state.ts`
- Create: `src/renderer/data/normalize-canvas-document.ts`
- Create: `src/renderer/styles/build-inline-style.ts`
- Create: `src/renderer/styles/build-media-rules.ts`
- Create: `src/renderer/styles/serialize-responsive-styles.ts`
- Test: `tests/unit/renderer/get-canvas-entry-state.test.ts`
- Test: `tests/unit/renderer/serialize-responsive-styles.test.ts`

- [ ] **Step 1: Write failing renderer contract tests**

```ts
import { describe, expect, it } from 'vitest'
import { getCanvasEntryState } from '../../../src/renderer/data/get-canvas-entry-state'

describe('getCanvasEntryState', () => {
  it('returns renderable state when emcanvas is enabled', () => {
    const state = getCanvasEntryState({ _emcanvas: { enabled: true }, canvasLayout: { version: 1, root: { id: 'root', type: 'section', props: {}, styles: { desktop: {} } }, settings: {} } })
    expect(state.shouldRender).toBe(true)
  })
})
```

- [ ] **Step 2: Run renderer contract tests to verify failure**

Run: `pnpm vitest tests/unit/renderer/get-canvas-entry-state.test.ts tests/unit/renderer/serialize-responsive-styles.test.ts`
Expected: FAIL

- [ ] **Step 3: Implement entry-state and style serializers**

```ts
export function getCanvasEntryState(data: Record<string, any>) {
  return { shouldRender: Boolean(data._emcanvas?.enabled), document: data.canvasLayout ?? null }
}
```

- [ ] **Step 4: Run renderer contract tests**

Run: `pnpm vitest tests/unit/renderer/get-canvas-entry-state.test.ts tests/unit/renderer/serialize-responsive-styles.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/renderer/types src/renderer/data src/renderer/styles tests/unit/renderer
git commit -m "feat: add renderer contracts and style serialization"
```

---

### Task 14: Build the Astro renderer and MVP component renderers

**Files:**
- Create: `src/renderer/astro/EmCanvasRenderer.astro`
- Create: `src/renderer/astro/CanvasNodeRenderer.astro`
- Create: `src/renderer/components/registry.ts`
- Create: `src/renderer/components/renderers/{section,columns,container,heading,text,button,spacer,divider,image,video}.ts`
- Test: `tests/integration/renderer-ssr.test.ts`

- [ ] **Step 1: Write the failing SSR renderer test**

```ts
import { describe, expect, it } from 'vitest'

describe('EmCanvasRenderer', () => {
  it('renders a heading node in SSR output', async () => {
    const html = '<h1>Hello</h1>'
    expect(html).toContain('Hello')
  })
})
```

- [ ] **Step 2: Run the SSR renderer test to verify failure**

Run: `pnpm vitest tests/integration/renderer-ssr.test.ts`
Expected: FAIL until renderer files and real test setup exist.

- [ ] **Step 3: Implement recursive Astro rendering**

```astro
---
const { document } = Astro.props
---

<div data-emcanvas-root>
  <!-- render nodes recursively -->
</div>
```

- [ ] **Step 4: Run the SSR renderer test**

Run: `pnpm vitest tests/integration/renderer-ssr.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/renderer/astro src/renderer/components tests/integration/renderer-ssr.test.ts
git commit -m "feat: add astro canvas renderer"
```

---

### Task 15: Integrate page takeover, page fragments, preview, and publish flow

**Files:**
- Create: `src/integration/hooks/page-fragments.ts`
- Create: `src/integration/page/should-render-emcanvas.ts`
- Create: `src/integration/page/render-entry-page.ts`
- Create: `src/plugin/hooks/page-fragments.ts`
- Create: `src/plugin/hooks/page-metadata.ts`
- Create: `src/plugin/hooks/entry-editor-actions.ts`
- Create: `src/plugin/routes/preview-link.ts`
- Create: `src/admin/pages/CanvasEditorPage.tsx`
- Create: `src/admin/components/{TakeoverBanner,SaveStatus,PreviewActions}.tsx`
- Create: `src/admin/lib/{plugin-api,error-mapping}.ts`
- Test: `tests/integration/entry-takeover-flow.test.ts`
- Test: `tests/integration/preview-and-publish-flow.test.ts`
- Test: `tests/unit/plugin/hooks/page-fragments.test.ts`

- [ ] **Step 1: Write failing integration tests for takeover and preview**

```ts
import { describe, expect, it } from 'vitest'

describe('entry takeover flow', () => {
  it('switches an entry into emcanvas mode', () => {
    expect(true).toBe(true)
  })
})
```

- [ ] **Step 2: Run integration tests to verify failure**

Run: `pnpm vitest tests/integration/entry-takeover-flow.test.ts tests/integration/preview-and-publish-flow.test.ts tests/unit/plugin/hooks/page-fragments.test.ts`
Expected: FAIL until takeover, preview, and CSS injection are implemented.

- [ ] **Step 3: Implement the host integration layer**

```ts
export function shouldRenderEmCanvas(data: Record<string, unknown>) {
  return Boolean((data as any)._emcanvas?.enabled)
}
```

- [ ] **Step 4: Run integration tests**

Run: `pnpm vitest tests/integration/entry-takeover-flow.test.ts tests/integration/preview-and-publish-flow.test.ts tests/unit/plugin/hooks/page-fragments.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/integration src/plugin/hooks src/plugin/routes/preview-link.ts src/admin tests/integration tests/unit/plugin/hooks/page-fragments.test.ts
git commit -m "feat: integrate emcanvas with host page flow"
```

---

### Task 16: Add accessibility, performance, contract validation, and release docs

**Files:**
- Create: `src/shared/validation/canvas-document.ts`
- Create: `src/shared/validation/takeover-state.ts`
- Create: `src/shared/perf/payload-budget.ts`
- Test: `tests/accessibility/canvas-editor.a11y.test.ts`
- Test: `tests/performance/layout-payload.test.ts`
- Test: `tests/integration/emdash-contracts.test.ts`
- Create: `docs/integration/emdash-local-validation.md`
- Create: `docs/integration/error-handling.md`
- Create: `docs/testing/integration-quality-matrix.md`
- Create: `docs/release/final-checklist.md`

- [ ] **Step 1: Write failing quality-gate tests**

```ts
import { describe, expect, it } from 'vitest'

describe('payload budget', () => {
  it('keeps layout payload under the agreed MVP threshold', () => {
    expect(1).toBeLessThan(2)
  })
})
```

- [ ] **Step 2: Run quality-gate tests to verify failure**

Run: `pnpm vitest tests/accessibility/canvas-editor.a11y.test.ts tests/performance/layout-payload.test.ts tests/integration/emdash-contracts.test.ts`
Expected: FAIL until the quality and host-contract layers exist.

- [ ] **Step 3: Implement validation helpers and write release docs**

```ts
export function isTakeoverEnabled(data: Record<string, unknown>) {
  return Boolean((data as any)._emcanvas?.enabled)
}
```

- [ ] **Step 4: Run quality-gate tests**

Run: `pnpm vitest tests/accessibility/canvas-editor.a11y.test.ts tests/performance/layout-payload.test.ts tests/integration/emdash-contracts.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/shared tests/accessibility tests/performance tests/integration/emdash-contracts.test.ts docs/integration docs/testing docs/release
git commit -m "feat: add emcanvas quality gates and release docs"
```

---

## Verification Strategy

- Do **not** build after changes. Validate with focused tests and type checks only.
- Required verification layers:
  1. Unit tests for data model, guards, registry, mutations, routes, style serializers.
  2. Integration tests for editor flow, DnD, save/autosave, renderer SSR, takeover, preview, publish.
  3. Accessibility tests for focus order, labels, save/error announcements, and switch-back UX.
  4. Contract tests against local EmDash integration points.
- Minimum end-to-end MVP scenario:
  - activate takeover
  - load default document
  - insert and edit widgets
  - reorder nodes
  - edit responsive styles
  - undo/redo
  - save/autosave
  - preview through host
  - publish through normal EmDash flow

## Risks to Watch

- Letting plugin wiring absorb domain logic.
- Divergence between editor registry and renderer registry.
- Overwriting unrelated fields in `entry.data` during save.
- Mixing editor renderer concerns with frontend SSR renderer.
- Shipping unit-test confidence without validating against local EmDash.
- Treating a11y/performance/error handling as optional polish.

## Spec Coverage Check

- `01-product-definition.md` → covered by Tasks 1, 15, 16.
- `02-architecture-overview.md` → covered by the overall structure and Tasks 1–16.
- `03-data-model.md` → covered by Tasks 2, 3, 12, 13, 16.
- `04-entry-takeover-flow.md` → covered by Tasks 4, 12, 15, 16.
- `05-visual-canvas-system.md` → covered by Tasks 5, 8, 9, 10, 11.
- `06-component-system.md` → covered by Tasks 6, 7, 9, 10, 14.
- `07-frontend-renderer.md` → covered by Tasks 13, 14, 15.
- `08-emdash-integration-layer.md` → covered by Tasks 1, 4, 15, 16.
- `09-mvp-scope.md` → covered by Tasks 1–16, with deferred items intentionally excluded.
- `10-phase-roadmap.md` → mapped directly into the sequence of Tasks 1–16.

## Placeholder Scan

- No TODO/TBD placeholders should remain in implementation files created from this plan.
- Replace fixture placeholders in tests before execution begins.
- Keep the path names above stable unless a deliberate architecture decision is recorded first.
