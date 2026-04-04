# EmCanvas Quality Tooling Baseline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a minimum viable quality tooling baseline for EmCanvas so type, style, and test regressions are caught automatically.

**Architecture:** Keep the tooling phase incremental. First add configuration contracts, then wire scripts, then CI, then pre-commit hooks. Avoid broad style rewrites that obscure what the tooling is actually introducing.

**Tech Stack:** TypeScript, ESLint, Prettier, GitHub Actions, simple-git-hooks, lint-staged, pnpm.

---

## Task 1: Add ESLint baseline for TypeScript and React

**Files:**
- Modify: `package.json`
- Create: `eslint.config.js`
- Create: `tests/contracts/eslint-config.test.ts`

- [ ] **Step 1: Write the failing ESLint config test**

```ts
import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'

describe('eslint baseline', () => {
  it('defines an eslint config and lint script', () => {
    expect(existsSync('eslint.config.js')).toBe(true)
  })
})
```

- [ ] **Step 2: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/eslint-config.test.ts`
Expected: FAIL because ESLint config does not exist yet.

- [ ] **Step 3: Add a minimal ESLint baseline**

```js
export default []
```

- [ ] **Step 4: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/eslint-config.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json eslint.config.js tests/contracts/eslint-config.test.ts
git commit -m "chore: add eslint baseline"
```

---

## Task 2: Add Prettier baseline and formatting script

**Files:**
- Modify: `package.json`
- Create: `.prettierrc.json`
- Create: `.prettierignore`
- Create: `tests/contracts/prettier-config.test.ts`

- [ ] **Step 1: Write the failing Prettier config test**

```ts
import { describe, expect, it } from 'vitest'
import { existsSync } from 'node:fs'

describe('prettier baseline', () => {
  it('defines prettier config and format script', () => {
    expect(existsSync('.prettierrc.json')).toBe(true)
  })
})
```

- [ ] **Step 2: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/prettier-config.test.ts`
Expected: FAIL

- [ ] **Step 3: Add minimal Prettier config**

```json
{ "semi": false, "singleQuote": true }
```

- [ ] **Step 4: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/prettier-config.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json .prettierrc.json .prettierignore tests/contracts/prettier-config.test.ts
git commit -m "chore: add prettier baseline"
```

---

## Task 3: Add CI workflow for tests and type-checks

**Files:**
- Create: `.github/workflows/ci.yml`
- Create: `tests/contracts/ci-workflow.test.ts`

- [ ] **Step 1: Write the failing CI workflow test**

```ts
import { describe, expect, it } from 'vitest'
import { existsSync, readFileSync } from 'node:fs'

describe('ci workflow', () => {
  it('runs tests and type-checks', () => {
    expect(existsSync('.github/workflows/ci.yml')).toBe(true)
    const workflow = readFileSync('.github/workflows/ci.yml', 'utf8')
    expect(workflow).toContain('pnpm vitest run')
    expect(workflow).toContain('tsc --noEmit')
  })
})
```

- [ ] **Step 2: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/ci-workflow.test.ts`
Expected: FAIL

- [ ] **Step 3: Add the CI workflow**

```yaml
name: CI
```

- [ ] **Step 4: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/ci-workflow.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/ci.yml tests/contracts/ci-workflow.test.ts
git commit -m "ci: add test and typecheck workflow"
```

---

## Task 4: Add pre-commit quality hooks

**Files:**
- Modify: `package.json`
- Create: `.lintstagedrc.json`
- Create: `tests/contracts/precommit-tooling.test.ts`

- [ ] **Step 1: Write the failing hook-tooling test**

```ts
import { describe, expect, it } from 'vitest'
import pkg from '../../package.json'

describe('precommit tooling', () => {
  it('configures simple-git-hooks and lint-staged', () => {
    expect(pkg['simple-git-hooks']).toBeDefined()
  })
})
```

- [ ] **Step 2: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/precommit-tooling.test.ts`
Expected: FAIL

- [ ] **Step 3: Add simple-git-hooks + lint-staged config**

```json
{ "pre-commit": "pnpm lint-staged" }
```

- [ ] **Step 4: Run the focused contract test**

Run: `pnpm vitest run tests/contracts/precommit-tooling.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add package.json .lintstagedrc.json tests/contracts/precommit-tooling.test.ts
git commit -m "chore: add precommit quality hooks"
```

---

## Verification Strategy

- Do **not** build after changes.
- End-of-phase verification must include:
  - `pnpm vitest run tests/contracts/eslint-config.test.ts`
  - `pnpm vitest run tests/contracts/prettier-config.test.ts`
  - `pnpm vitest run tests/contracts/ci-workflow.test.ts`
  - `pnpm vitest run tests/contracts/precommit-tooling.test.ts`

## Spec Coverage Check

- eslint baseline → Task 1
- prettier baseline → Task 2
- CI workflow → Task 3
- pre-commit hooks → Task 4

## Placeholder Scan

- No TODO/TBD placeholders remain.
- Phase intentionally avoids a larger lint-fix sweep until tooling exists.
