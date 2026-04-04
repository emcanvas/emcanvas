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
