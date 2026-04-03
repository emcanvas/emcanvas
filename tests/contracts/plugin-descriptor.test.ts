import { describe, expect, it } from 'vitest'
import descriptor from '../../src/plugin/descriptor'

type PluginDescriptor = {
  entrypoint?: string
  format?: string
  sandbox?: string
}

describe('plugin descriptor', () => {
  it('matches emdash loader expectations', () => {
    const pluginDescriptor = descriptor as PluginDescriptor

    expect(pluginDescriptor.entrypoint).toBe('./src/plugin/index.ts')
    expect(pluginDescriptor.format).toBe('module')
    expect(pluginDescriptor.sandbox).toBe('./src/plugin/sandbox-entry.ts')
  })
})
