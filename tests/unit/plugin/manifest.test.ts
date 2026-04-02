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
