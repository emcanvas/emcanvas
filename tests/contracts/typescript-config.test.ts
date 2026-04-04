import { describe, expect, it } from 'vitest'
import tsconfig from '../../tsconfig.json'

describe('tsconfig strictness', () => {
  it('enables the selected strictness flags', () => {
    expect(tsconfig.compilerOptions.noUnusedLocals).toBe(true)
    expect(tsconfig.compilerOptions.noUnusedParameters).toBe(true)
    expect(tsconfig.compilerOptions.noImplicitReturns).toBe(true)
  })
})
