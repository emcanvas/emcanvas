import { describe, expect, it } from 'vitest'
import tsconfig from '../../tsconfig.json'

describe('tsconfig strictness', () => {
  it('enables the selected strictness flags', () => {
    expect(tsconfig.compilerOptions.noUnusedLocals).toBe(true)
    expect(tsconfig.compilerOptions.noUnusedParameters).toBe(true)
    expect(tsconfig.compilerOptions.noImplicitReturns).toBe(true)
  })

  it('keeps tooling and ambient declarations inside the root baseline', () => {
    expect(tsconfig.include).toContain('src/**/*.d.ts')
    expect(tsconfig.include).toContain('tsup.config.ts')
  })

  it('does not enable arbitrary TypeScript extension imports', () => {
    const compilerOptions = tsconfig.compilerOptions as Record<string, unknown>

    expect(compilerOptions.allowImportingTsExtensions).not.toBe(true)
  })
})
