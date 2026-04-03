# EmCanvas EmDash Plugin Runtime Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adapt EmCanvas so EmDash can load it as a real local plugin and run the full host loop: load, open editor, edit, save, preview, publish, and frontend render.

**Architecture:** Preserve the existing EmCanvas core and add a thin EmDash adapter layer. The work focuses on package surface, real plugin descriptor/entrypoints, host-compatible hooks/routes/pages, and a runtime bridge that keeps EmDash-specific details out of the editor/renderer core.

**Tech Stack:** TypeScript, React, Astro, Vitest, EmDash plugin contracts, local package consumption.

---

## Proposed File Structure

```text
emcanvas/
├── package.json
├── src/
│   ├── plugin/
│   │   ├── descriptor.ts
│   │   ├── index.ts
│   │   ├── sandbox-entry.ts
│   │   ├── runtime/
│   │   │   ├── create-plugin-definition.ts
│   │   │   ├── create-plugin-descriptor.ts
│   │   │   ├── route-adapters.ts
│   │   │   └── hook-adapters.ts
│   │   ├── hooks/
│   │   ├── routes/
│   │   └── pages/
│   ├── admin/
│   ├── integration/
│   └── shared/
├── tests/
│   ├── integration/
│   ├── unit/
│   └── contracts/
└── docs/
    └── integration/
```

## Task 1: Make EmCanvas package-consumable by EmDash

**Files:**
- Modify: `package.json`
- Test: `tests/contracts/package-surface.test.ts`

- [ ] **Step 1: Write the failing package surface test**

```ts
import { describe, expect, it } from 'vitest'
import pkg from '../../package.json'

describe('package surface', () => {
  it('exposes plugin runtime and sandbox entrypoints', () => {
    expect(pkg.main).toBeDefined()
    expect(pkg.exports['.']).toBeDefined()
    expect(pkg.exports['./sandbox']).toBeDefined()
    expect(pkg.files).toContain('src')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/contracts/package-surface.test.ts`
Expected: FAIL because package exports are not defined yet.

- [ ] **Step 3: Add the minimal package surface EmDash can consume**

```json
{
  "main": "./src/plugin/index.ts",
  "exports": {
    ".": "./src/plugin/index.ts",
    "./sandbox": "./src/plugin/sandbox-entry.ts"
  },
  "files": ["src", "docs", "spec", "openspec"],
  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "astro": "^4.0.0"
  }
}
```

- [ ] **Step 4: Run the package surface test**

Run: `pnpm vitest run tests/contracts/package-surface.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json tests/contracts/package-surface.test.ts
git commit -m "feat: expose emcanvas package surface for emdash"
```

---

## Task 2: Align plugin descriptor with EmDash runtime contract

**Files:**
- Modify: `src/plugin/descriptor.ts`
- Create: `src/plugin/runtime/create-plugin-descriptor.ts`
- Test: `tests/contracts/plugin-descriptor.test.ts`

- [ ] **Step 1: Write the failing descriptor contract test**

```ts
import { describe, expect, it } from 'vitest'
import descriptor from '../../src/plugin/descriptor'

describe('plugin descriptor', () => {
  it('matches emdash loader expectations', () => {
    expect(descriptor.entrypoint).toBeDefined()
    expect(descriptor.format).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/contracts/plugin-descriptor.test.ts`
Expected: FAIL because current descriptor uses the wrong shape.

- [ ] **Step 3: Implement the host-compatible descriptor wrapper**

```ts
export function createPluginDescriptor() {
  return {
    entrypoint: './src/plugin/index.ts',
    format: 'module',
    sandbox: './src/plugin/sandbox-entry.ts',
  }
}
```

- [ ] **Step 4: Run the descriptor contract test**

Run: `pnpm vitest run tests/contracts/plugin-descriptor.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/plugin/descriptor.ts src/plugin/runtime/create-plugin-descriptor.ts tests/contracts/plugin-descriptor.test.ts
git commit -m "feat: align plugin descriptor with emdash runtime"
```

---

## Task 3: Replace internal manifest shape with host-compatible plugin definition

**Files:**
- Modify: `src/plugin/index.ts`
- Modify: `src/plugin/manifest.ts`
- Create: `src/plugin/runtime/create-plugin-definition.ts`
- Test: `tests/contracts/plugin-definition.test.ts`

- [ ] **Step 1: Write the failing plugin definition test**

```ts
import { describe, expect, it } from 'vitest'
import plugin from '../../src/plugin'

describe('plugin definition', () => {
  it('exposes host-compatible hooks, routes, and admin pages', () => {
    expect(plugin.hooks['page:fragments']).toBeDefined()
    expect(plugin.hooks['page:metadata']).toBeDefined()
    expect(plugin.routes['preview-link']).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/contracts/plugin-definition.test.ts`
Expected: FAIL because the current manifest shape is internal-only.

- [ ] **Step 3: Add the runtime plugin-definition adapter**

```ts
export function createPluginDefinition() {
  return {
    hooks: {
      'page:fragments': pageFragments,
      'page:metadata': pageMetadata,
      'entry:editor:actions': entryEditorActions,
    },
    routes: {
      'preview-link': previewLink,
      'canvas-data': getCanvasData,
      'save-canvas-data': saveCanvasData,
    },
    adminPages: {
      editor: EditorPage,
      dashboard: DashboardPage,
    },
  }
}
```

- [ ] **Step 4: Run the plugin definition test**

Run: `pnpm vitest run tests/contracts/plugin-definition.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/plugin/index.ts src/plugin/manifest.ts src/plugin/runtime/create-plugin-definition.ts tests/contracts/plugin-definition.test.ts
git commit -m "feat: add host-compatible plugin definition"
```

---

## Task 4: Route the admin surface through the real plugin entrypoint

**Files:**
- Modify: `src/plugin/pages/editor-page.tsx`
- Modify: `src/plugin/pages/dashboard-page.tsx`
- Modify: `src/admin/pages/CanvasEditorPage.tsx`
- Test: `tests/integration/plugin-admin-mount.test.tsx`

- [ ] **Step 1: Write the failing admin mount integration test**

```tsx
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EditorPage } from '../../src/plugin/pages/editor-page'

describe('plugin editor page', () => {
  it('mounts the real canvas editor page for the host', () => {
    render(<EditorPage entry={{ data: {} }} />)
    expect(screen.getByText(/takeover/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/integration/plugin-admin-mount.test.tsx`
Expected: FAIL if the host-facing page still bypasses the real admin flow.

- [ ] **Step 3: Wire the plugin page to the admin runtime bridge**

```tsx
export function EditorPage(props: CanvasEditorPageProps) {
  return <CanvasEditorPage {...props} />
}
```

- [ ] **Step 4: Run the admin mount test**

Run: `pnpm vitest run tests/integration/plugin-admin-mount.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/plugin/pages src/admin/pages tests/integration/plugin-admin-mount.test.tsx
git commit -m "feat: route plugin admin surface through canvas editor page"
```

---

## Task 5: Move plugin API calls onto host-compatible route adapters

**Files:**
- Modify: `src/admin/lib/plugin-api.ts`
- Create: `src/plugin/runtime/route-adapters.ts`
- Modify: `src/editor/persistence/load-document.ts`
- Modify: `src/editor/persistence/save-document.ts`
- Test: `tests/integration/plugin-api-host-contract.test.ts`

- [ ] **Step 1: Write the failing plugin API contract test**

```ts
import { describe, expect, it } from 'vitest'
import { pluginApi } from '../../src/admin/lib/plugin-api'

describe('plugin api', () => {
  it('uses host-compatible route wrappers', async () => {
    expect(pluginApi.loadDocument).toBeDefined()
    expect(pluginApi.saveDocument).toBeDefined()
    expect(pluginApi.getPreviewLink).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/integration/plugin-api-host-contract.test.ts`
Expected: FAIL if the API still bypasses the host runtime shape.

- [ ] **Step 3: Add route adapter wrappers and point plugin API at them**

```ts
export const routeAdapters = {
  loadDocument: getCanvasData,
  saveDocument: saveCanvasData,
  getPreviewLink: previewLink,
}
```

- [ ] **Step 4: Run the plugin API contract test**

Run: `pnpm vitest run tests/integration/plugin-api-host-contract.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/admin/lib/plugin-api.ts src/plugin/runtime/route-adapters.ts src/editor/persistence/load-document.ts src/editor/persistence/save-document.ts tests/integration/plugin-api-host-contract.test.ts
git commit -m "feat: route plugin api through host adapters"
```

---

## Task 6: Prove full host loop with local EmDash compatibility contract tests

**Files:**
- Create: `tests/contracts/emdash-plugin-runtime.test.ts`
- Create: `docs/integration/emdash-plugin-runtime-checklist.md`
- Modify: `docs/integration/emdash-local-validation.md`

- [ ] **Step 1: Write the failing host runtime contract test**

```ts
import { describe, expect, it } from 'vitest'
import descriptor from '../../src/plugin/descriptor'
import plugin from '../../src/plugin'

describe('emdash runtime contract', () => {
  it('exposes a consumable plugin surface for local host loading', () => {
    expect(descriptor.entrypoint).toBeDefined()
    expect(plugin.routes['canvas-data']).toBeDefined()
    expect(plugin.routes['save-canvas-data']).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails if any contract is missing**

Run: `pnpm vitest run tests/contracts/emdash-plugin-runtime.test.ts`
Expected: FAIL until the package/descriptor/plugin surface is coherent.

- [ ] **Step 3: Finalize the contract docs and runtime checklist**

```md
## Local Runtime Checklist
- package exports resolve from EmDash
- descriptor entrypoint is loadable
- plugin definition exposes hooks/routes/admin pages
- editor page mounts through host route
- save, preview, and publish use live editor state
```

- [ ] **Step 4: Run the host runtime contract test and relevant integration suite**

Run: `pnpm vitest run tests/contracts/emdash-plugin-runtime.test.ts tests/integration/admin-editor-publish-flow.test.tsx tests/integration/preview-and-publish-flow.test.ts tests/integration/entry-takeover-flow.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/contracts/emdash-plugin-runtime.test.ts docs/integration/emdash-plugin-runtime-checklist.md docs/integration/emdash-local-validation.md
git commit -m "docs: define emdash plugin runtime validation"
```

---

## Verification Strategy

- Do **not** build after changes.
- Verify each task with focused Vitest commands.
- End-of-phase verification must include:
  - `pnpm vitest run tests/contracts/*.test.ts`
  - `pnpm vitest run tests/integration/admin-editor-publish-flow.test.tsx`
  - `pnpm vitest run tests/integration/preview-and-publish-flow.test.ts`
  - `pnpm vitest run tests/integration/entry-takeover-flow.test.ts`

## Spec Coverage Check

- Package consumability → Task 1
- Descriptor/runtime alignment → Task 2
- Host-compatible plugin definition → Task 3
- Real admin page wiring → Task 4
- Host route/API bridge → Task 5
- Local EmDash runtime validation loop → Task 6

## Placeholder Scan

- No TODO/TBD placeholders remain.
- The plan preserves current architecture and focuses on adaptation, not rewrite.
