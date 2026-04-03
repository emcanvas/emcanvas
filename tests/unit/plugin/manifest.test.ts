import { describe, expect, it } from 'vitest'
import plugin from '../../../src/plugin/manifest'

describe('plugin manifest', () => {
  it('declares the EmCanvas plugin contract', () => {
    expect(plugin).toEqual({
      id: 'emcanvas',
      name: 'EmCanvas',
      version: '0.1.0',
    })
  })
})
