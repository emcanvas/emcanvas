import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

describe('public entry import specifiers', () => {
  it('uses explicit .js relative imports across host-facing entry sources', () => {
    const rootEntry = readFileSync('src/plugin/index.ts', 'utf8')
    const descriptorPublicEntry = readFileSync(
      'src/plugin/descriptor.ts',
      'utf8',
    )
    const sandboxEntry = readFileSync('src/plugin/sandbox-entry.ts', 'utf8')
    const adminEntry = readFileSync('src/plugin/admin-entry.ts', 'utf8')
    const nativePluginFactory = readFileSync(
      'src/plugin/runtime/create-native-resolved-plugin.ts',
      'utf8',
    )

    expect(rootEntry).toContain('./manifest.js')
    expect(rootEntry).toContain('./runtime/create-native-resolved-plugin.js')

    expect(sandboxEntry).toContain('./descriptor.js')
    expect(adminEntry).toContain("import('./pages/dashboard-page.js')")
    expect(adminEntry).toContain("import('./pages/editor-page.js')")
    expect(adminEntry).not.toContain("from './pages/dashboard-page.js'")
    expect(adminEntry).not.toContain("from './pages/editor-page.js'")
    expect(descriptorPublicEntry).toContain(
      './runtime/create-plugin-descriptor.js',
    )
    expect(nativePluginFactory).toContain('../manifest.js')
    expect(nativePluginFactory).toContain(
      './create-runtime-plugin-definition.js',
    )
  })
})
