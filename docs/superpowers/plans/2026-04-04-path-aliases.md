# EmCanvas Path Aliases Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Introduce maintainable path aliases for the main EmCanvas domains and migrate a focused set of imports away from fragile deep-relative paths.

**Architecture:** Keep aliasing explicit and symmetric between TypeScript and Vitest/Vite. Migrate only a controlled set of production and test files first so the repo does not absorb a giant churn burst.

**Tech Stack:** TypeScript, Vite/Vitest aliases.

---

## Task 1: Add alias definitions to tsconfig and vite

**Files:**

- Modify: `tsconfig.json`
- Modify: `vite.config.ts`
- Create: `tests/contracts/path-alias-config.test.ts`

- [ ] **Step 1: Write the failing alias-config test**

```ts
import { describe, expect, it } from 'vitest'
import tsconfig from '../../tsconfig.json'

describe('path alias config', () => {
  it('defines the main emcanvas aliases', () => {
    expect(
      tsconfig.compilerOptions.paths['@emcanvas/foundation/*'],
    ).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@emcanvas/editor/*']).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@emcanvas/renderer/*']).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@emcanvas/plugin/*']).toBeDefined()
  })
})
```

- [ ] **Step 2: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/path-alias-config.test.ts`
Expected: FAIL because aliases are not defined yet.

- [ ] **Step 3: Add alias config in tsconfig and vite**

```json
{
  "compilerOptions": {
    "paths": {
      "@emcanvas/foundation/*": ["./src/foundation/*"],
      "@emcanvas/editor/*": ["./src/editor/*"],
      "@emcanvas/renderer/*": ["./src/renderer/*"],
      "@emcanvas/plugin/*": ["./src/plugin/*"]
    }
  }
}
```

- [ ] **Step 4: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/path-alias-config.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tsconfig.json vite.config.ts tests/contracts/path-alias-config.test.ts
git commit -m "chore: add emcanvas path aliases"
```

---

## Task 2: Migrate a focused production slice to aliases

**Files:**

- Modify: selected files in `src/editor/`, `src/renderer/`, `src/plugin/`
- Test: `tests/contracts/path-alias-usage.test.ts`

- [ ] **Step 1: Write the failing alias-usage test**

```ts
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

describe('path alias usage', () => {
  it('migrates the selected slice away from deep relative imports', () => {
    const source = readFileSync('src/editor/shell/editor-shell.tsx', 'utf8')
    expect(source).toContain('@emcanvas/editor/')
  })
})
```

- [ ] **Step 2: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/path-alias-usage.test.ts`
Expected: FAIL

- [ ] **Step 3: Migrate the selected production slice**

```ts
import { createEditorStore } from '@emcanvas/editor/state/editor-store'
```

- [ ] **Step 4: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/path-alias-usage.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src tests/contracts/path-alias-usage.test.ts
git commit -m "refactor: use path aliases in core production slice"
```

---

## Task 3: Migrate a focused test slice to aliases

**Files:**

- Modify: selected tests currently using deep `../../..` imports
- Test: `tests/contracts/path-alias-test-usage.test.ts`

- [ ] **Step 1: Write the failing test-alias contract test**

```ts
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'

describe('test alias usage', () => {
  it('uses aliases in the selected tests', () => {
    const source = readFileSync(
      'tests/integration/editor-shell-flow.test.tsx',
      'utf8',
    )
    expect(source).toContain('@emcanvas/')
  })
})
```

- [ ] **Step 2: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/path-alias-test-usage.test.ts`
Expected: FAIL

- [ ] **Step 3: Migrate the selected test slice**

```ts
import { EditorShell } from '@emcanvas/editor/shell/editor-shell'
```

- [ ] **Step 4: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/path-alias-test-usage.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add tests tests/contracts/path-alias-test-usage.test.ts
git commit -m "test: use path aliases in selected tests"
```

---

## Verification Strategy

- Do **not** build after changes.
- End-of-phase verification must include:
  - `pnpm vitest run tests/contracts/path-alias-config.test.ts`
  - `pnpm vitest run tests/contracts/path-alias-usage.test.ts`
  - `pnpm vitest run tests/contracts/path-alias-test-usage.test.ts`
  - `pnpm vitest run`

## Spec Coverage Check

- alias config → Task 1
- production slice migration → Task 2
- test slice migration → Task 3

## Placeholder Scan

- No TODO/TBD placeholders remain.
- Phase intentionally limits churn by migrating only a focused slice first.
