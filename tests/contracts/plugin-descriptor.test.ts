import { describe, expect, it } from 'vitest'
import descriptor from '../../src/plugin/descriptor'

describe('plugin descriptor', () => {
  it('matches emdash loader expectations', () => {
    expect(descriptor).toEqual({
      entrypoint: './src/plugin/index.ts',
      format: 'module',
      sandbox: './src/plugin/sandbox-entry.ts',
    })
  })
})
