// @vitest-environment node

import { fileURLToPath } from 'node:url'
import type { UserConfig, UserConfigFnObject } from 'vite'
import { describe, expect, it } from 'vitest'
import tsconfig from '../../tsconfig.json'
import viteConfig from '../../vite.config'
import viteConfigSource from '../../vite.config.ts?raw'

type AliasEntry = {
  find: string
  replacement: string
}

describe('path alias config', () => {
  it('defines the main emcanvas aliases', () => {
    expect(
      tsconfig.compilerOptions.paths['@emcanvas/foundation/*'],
    ).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@emcanvas/editor/*']).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@emcanvas/renderer/*']).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@emcanvas/plugin/*']).toBeDefined()
  })

  it('keeps the Vite alias map aligned with tsconfig', async () => {
    const expectedAliases = Object.fromEntries(
      Object.entries(tsconfig.compilerOptions.paths).map(([alias, [target]]) => [
        alias.replace(/\/\*$/, ''),
        fileURLToPath(
          new URL(`../../${target.replace(/\/\*$/, '')}`, import.meta.url),
        ),
      ]),
    )

    const viteConfigFactory = viteConfig as UserConfigFnObject

    const resolvedViteConfig: UserConfig =
      typeof viteConfig === 'function'
        ? await viteConfigFactory({
            command: 'serve',
            mode: 'test',
            isSsrBuild: false,
            isPreview: false,
          })
        : viteConfig

    const aliasEntries: AliasEntry[] = Array.isArray(resolvedViteConfig.resolve?.alias)
      ? resolvedViteConfig.resolve.alias.filter(
          (entry: unknown): entry is AliasEntry =>
            typeof entry === 'object' &&
            entry !== null &&
            'find' in entry &&
            'replacement' in entry &&
            typeof entry.find === 'string' &&
            typeof entry.replacement === 'string',
        )
      : Object.entries(resolvedViteConfig.resolve?.alias ?? {}).map(
          ([find, replacement]) => ({ find, replacement: String(replacement) }),
        )

    const emcanvasAliases = Object.fromEntries(
      aliasEntries
        .filter((entry) => entry.find.startsWith('@emcanvas/'))
        .map(({ find, replacement }) => [find, replacement]),
    )

    expect(emcanvasAliases).toEqual(expectedAliases)
  })

  it('uses fileURLToPath for portable Vite aliases', () => {
    expect(viteConfigSource).toContain('fileURLToPath(new URL(')
    expect(viteConfigSource).not.toContain('.pathname')
  })
})
