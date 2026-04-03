# EmCanvas Consumable Runtime Package Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make EmCanvas consumable by EmDash as a real local runtime package by separating public package surfaces and pointing exports to consumable runtime artifacts.

**Architecture:** Preserve the existing core and add a packaging layer that produces explicit runtime/admin/sandbox surfaces. The work focuses on entrypoints, exports, build output, and external-consumption contract tests rather than feature rewrites.

**Tech Stack:** TypeScript, Astro, React, Vitest, pnpm, package exports, local package consumption.

---

## Proposed File Structure

```text
emcanvas/
├── package.json
├── tsup.config.ts (or equivalent packaging config if needed)
├── src/plugin/
│   ├── index.ts
│   ├── sandbox-entry.ts
│   ├── admin-entry.ts
│   ├── astro-entry.ts
│   └── runtime/
├── dist/
│   ├── index.mjs
│   ├── sandbox-entry.mjs
│   ├── admin.mjs
│   └── astro.mjs
└── tests/contracts/
```

## Task 1: Define explicit public runtime entrypoints

**Files:**
- Create: `src/plugin/admin-entry.ts`
- Create: `src/plugin/astro-entry.ts`
- Modify: `src/plugin/index.ts`
- Modify: `src/plugin/sandbox-entry.ts`
- Test: `tests/contracts/plugin-public-exports.test.ts`

- [ ] **Step 1: Write the failing public exports test**

```ts
import { describe, expect, it } from 'vitest'

describe('plugin public exports', () => {
  it('defines dedicated root, sandbox, admin, and astro entry modules', async () => {
    const root = await import('../../src/plugin/index.ts')
    const sandbox = await import('../../src/plugin/sandbox-entry.ts')
    const admin = await import('../../src/plugin/admin-entry.ts')
    const astro = await import('../../src/plugin/astro-entry.ts')

    expect(root.default).toBeDefined()
    expect(sandbox.default).toBeDefined()
    expect(admin.pages).toBeDefined()
    expect(astro.blockComponents).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/contracts/plugin-public-exports.test.ts`
Expected: FAIL because dedicated admin/astro entry modules do not exist yet.

- [ ] **Step 3: Add dedicated public entry modules**

```ts
// src/plugin/admin-entry.ts
export const pages = {
  editor: EditorPage,
  dashboard: DashboardPage,
}
```

- [ ] **Step 4: Run the public exports test**

Run: `pnpm vitest run tests/contracts/plugin-public-exports.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/plugin/index.ts src/plugin/sandbox-entry.ts src/plugin/admin-entry.ts src/plugin/astro-entry.ts tests/contracts/plugin-public-exports.test.ts
git commit -m "feat: define public plugin entry modules"
```

---

## Task 2: Add consumable runtime package exports

**Files:**
- Modify: `package.json`
- Create: `tests/contracts/package-runtime-exports.test.ts`

- [ ] **Step 1: Write the failing package runtime exports test**

```ts
import { describe, expect, it } from 'vitest'
import pkg from '../../package.json'

describe('package runtime exports', () => {
  it('points public exports to consumable runtime artifacts', () => {
    expect(pkg.exports['.']).toBe('./dist/index.mjs')
    expect(pkg.exports['./sandbox']).toBe('./dist/sandbox-entry.mjs')
    expect(pkg.exports['./admin']).toBe('./dist/admin.mjs')
    expect(pkg.exports['./astro']).toBe('./dist/astro.mjs')
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/contracts/package-runtime-exports.test.ts`
Expected: FAIL because exports still point to source files.

- [ ] **Step 3: Update package exports to dist artifacts**

```json
{
  "exports": {
    ".": "./dist/index.mjs",
    "./sandbox": "./dist/sandbox-entry.mjs",
    "./admin": "./dist/admin.mjs",
    "./astro": "./dist/astro.mjs"
  },
  "files": ["dist"]
}
```

- [ ] **Step 4: Run the package runtime exports test**

Run: `pnpm vitest run tests/contracts/package-runtime-exports.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json tests/contracts/package-runtime-exports.test.ts
git commit -m "feat: point package exports at consumable runtime artifacts"
```

---

## Task 3: Add packaging config for consumable dist outputs

**Files:**
- Create: `tsup.config.ts`
- Test: `tests/contracts/package-build-layout.test.ts`

- [ ] **Step 1: Write the failing build-layout contract test**

```ts
import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'

describe('package build layout', () => {
  it('defines a build config for runtime artifacts', () => {
    expect(existsSync('tsup.config.ts')).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/contracts/package-build-layout.test.ts`
Expected: FAIL because packaging config does not exist yet.

- [ ] **Step 3: Add minimal packaging config**

```ts
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/plugin/index.ts',
    'sandbox-entry': 'src/plugin/sandbox-entry.ts',
    admin: 'src/plugin/admin-entry.ts',
    astro: 'src/plugin/astro-entry.ts',
  },
  format: ['esm'],
  outDir: 'dist',
  splitting: false,
  sourcemap: true,
  clean: true,
})
```

- [ ] **Step 4: Run the build-layout contract test**

Run: `pnpm vitest run tests/contracts/package-build-layout.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tsup.config.ts tests/contracts/package-build-layout.test.ts
git commit -m "feat: add runtime package build config"
```

---

## Task 4: Prove external consumption paths stay CSS-safe and host-focused

**Files:**
- Create: `tests/contracts/plugin-consumption-boundary.test.ts`
- Modify: `src/plugin/index.ts`
- Modify: `src/plugin/admin-entry.ts`
- Modify: `src/plugin/astro-entry.ts`

- [ ] **Step 1: Write the failing consumption-boundary test**

```ts
import { describe, expect, it } from 'vitest'

describe('plugin consumption boundary', () => {
  it('keeps root runtime free of admin-only exports', async () => {
    const root = await import('../../src/plugin/index.ts')
    expect('pages' in root).toBe(false)
  })
})
```

- [ ] **Step 2: Run test to verify it fails if surfaces are mixed**

Run: `pnpm vitest run tests/contracts/plugin-consumption-boundary.test.ts`
Expected: FAIL if public surfaces are still entangled.

- [ ] **Step 3: Separate the root/admin/astro public surfaces cleanly**

```ts
// root runtime exports only descriptor/manifest/default plugin definition
```

- [ ] **Step 4: Run the consumption-boundary test**

Run: `pnpm vitest run tests/contracts/plugin-consumption-boundary.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/plugin/index.ts src/plugin/admin-entry.ts src/plugin/astro-entry.ts tests/contracts/plugin-consumption-boundary.test.ts
git commit -m "refactor: separate public plugin consumption surfaces"
```

---

## Task 5: Document the consumable runtime package flow

**Files:**
- Create: `docs/integration/emdash-consumable-package-checklist.md`
- Modify: `docs/integration/emdash-local-validation.md`

- [ ] **Step 1: Write a failing doc presence test**

```ts
import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'

describe('consumable package docs', () => {
  it('documents the runtime package checklist', () => {
    expect(existsSync('docs/integration/emdash-consumable-package-checklist.md')).toBe(true)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm vitest run tests/contracts/consumable-package-docs.test.ts`
Expected: FAIL because the checklist doc does not exist yet.

- [ ] **Step 3: Add the docs**

```md
## Consumable Package Checklist
- package exports point to dist artifacts
- public entry modules are separated
- host can import root and sandbox surfaces
- admin/astro surfaces are explicit
```

- [ ] **Step 4: Run the doc presence test**

Run: `pnpm vitest run tests/contracts/consumable-package-docs.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add docs/integration/emdash-consumable-package-checklist.md docs/integration/emdash-local-validation.md tests/contracts/consumable-package-docs.test.ts
git commit -m "docs: define consumable runtime package validation"
```

---

## Task 6: Verify the phase with focused contract evidence

**Files:**
- Modify: `tests/contracts/emdash-plugin-runtime.test.ts`

- [ ] **Step 1: Extend the failing runtime contract test**

```ts
expect(pkg.exports['.']).toBe('./dist/index.mjs')
expect(pkg.exports['./sandbox']).toBe('./dist/sandbox-entry.mjs')
```

- [ ] **Step 2: Run focused contracts to verify gaps**

Run: `pnpm vitest run tests/contracts/*.test.ts`
Expected: FAIL until all package/runtime surfaces align.

- [ ] **Step 3: Reconcile the final contract test with the new consumable runtime package**

```ts
// Keep it aligned with the final package/runtime surface
```

- [ ] **Step 4: Run the final focused contract suite**

Run: `pnpm vitest run tests/contracts/*.test.ts tests/integration/plugin-api-host-contract.test.ts tests/integration/plugin-admin-mount.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests/contracts/emdash-plugin-runtime.test.ts
git commit -m "test: verify consumable runtime package contract"
```

---

## Verification Strategy

- Do **not** build after changes unless explicitly revisiting project policy.
- Verify each task with focused contract tests.
- End-of-phase verification must include:
  - `pnpm vitest run tests/contracts/*.test.ts`
  - `pnpm vitest run tests/integration/plugin-api-host-contract.test.ts`
  - `pnpm vitest run tests/integration/plugin-admin-mount.test.tsx`

## Spec Coverage Check

- Explicit public entry modules → Task 1
- Package exports to consumable artifacts → Task 2
- Packaging config for runtime outputs → Task 3
- Surface separation / no accidental root coupling → Task 4
- Consumable package docs → Task 5
- Final runtime contract proof → Task 6

## Placeholder Scan

- No TODO/TBD placeholders remain.
- Plan intentionally focuses on package/runtime consumability only.
