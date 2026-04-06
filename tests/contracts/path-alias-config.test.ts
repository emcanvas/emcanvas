// @vitest-environment node

import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { createServer, type ViteDevServer } from 'vite'
import devSourceGuideContent from '../../docs/integration/emdash-dev-source-consumption.md?raw'
import devSourceDescriptor from '../../src/plugin/dev-source'
import tsconfig from '../../tsconfig.json'
import {
  EMCANVAS_VITE_ALIASES,
  readViteConfigSource,
  VITE_CONFIG_SOURCE_PATH,
} from '../../vite.config'

type DevSourceModule = typeof import('../../src/plugin/dev-source')

const DOCUMENTED_DEV_SOURCE_IMPORT_SPECIFIER = devSourceGuideContent.match(
  /import\s+descriptor\s+from\s+'([^']+)'/,
)?.[1]

async function withAliasServer<T>(
  aliases: Record<string, string>,
  run: (server: ViteDevServer) => Promise<T>,
): Promise<T> {
  const server = await createServer({
    appType: 'custom',
    configFile: false,
    optimizeDeps: {
      noDiscovery: true,
    },
    resolve: {
      alias: aliases,
    },
    server: {
      middlewareMode: true,
    },
  })

  try {
    return await run(server)
  } finally {
    await server.close()
  }
}

describe('path alias config', () => {
  it('defines the main emcanvas aliases', () => {
    expect(tsconfig.compilerOptions.paths['@emcanvas/admin']).toBeDefined()
    expect(
      tsconfig.compilerOptions.paths['@emcanvas/foundation/*'],
    ).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@emcanvas/editor']).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@emcanvas/editor/*']).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@emcanvas/renderer/*']).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@emcanvas/plugin']).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@emcanvas/plugin/*']).toBeDefined()
  })

  it('locks the dev-source descriptor to the documented plugin alias namespace', () => {
    expect(devSourceDescriptor).toMatchObject({
      entrypoint: '@emcanvas/plugin',
      sandbox: '@emcanvas/plugin/sandbox-entry',
      adminEntry: '@emcanvas/plugin/admin-entry',
      componentsEntry: '@emcanvas/plugin/astro-entry',
    })

    expect(tsconfig.compilerOptions.paths['@emcanvas/plugin']).toEqual([
      './src/plugin',
    ])
    expect(tsconfig.compilerOptions.paths['@emcanvas/plugin/*']).toEqual([
      './src/plugin/*',
    ])
  })

  it('keeps the Vite alias map aligned with tsconfig', () => {
    const expectedAliases = Object.fromEntries(
      Object.entries(tsconfig.compilerOptions.paths).map(
        ([alias, [target]]) => [
          alias.replace(/\/\*$/, ''),
          fileURLToPath(
            new URL(`../../${target.replace(/\/\*$/, '')}`, import.meta.url),
          ),
        ],
      ),
    )

    expect(EMCANVAS_VITE_ALIASES).toEqual(expectedAliases)
  })

  it('uses fileURLToPath for portable Vite aliases', () => {
    const viteConfigSource = readViteConfigSource()

    expect(VITE_CONFIG_SOURCE_PATH).toContain('/vite.config.ts')
    expect(viteConfigSource).toContain('fileURLToPath(new URL(')
    expect(viteConfigSource).not.toContain('.pathname')
  })

  it('resolves the dev-source descriptor when the host mirrors the documented plugin alias', async () => {
    const devSourceModule = await withAliasServer(
      EMCANVAS_VITE_ALIASES,
      async (server) =>
        (await server.ssrLoadModule(
          '@emcanvas/plugin/dev-source',
        )) as DevSourceModule,
    )

    expect(devSourceModule.default).toEqual(devSourceDescriptor)
    expect(devSourceModule.descriptor).toEqual(devSourceDescriptor)
  })

  it('keeps the docs import contract executable through the mirrored host alias', async () => {
    expect(DOCUMENTED_DEV_SOURCE_IMPORT_SPECIFIER).toBe(
      '@emcanvas/plugin/dev-source',
    )

    const devSourceModule = await withAliasServer(
      EMCANVAS_VITE_ALIASES,
      async (server) =>
        (await server.ssrLoadModule(
          DOCUMENTED_DEV_SOURCE_IMPORT_SPECIFIER!,
        )) as DevSourceModule,
    )

    expect(devSourceModule.default).toEqual(devSourceDescriptor)
    expect(devSourceModule.descriptor).toEqual(devSourceDescriptor)
  })

  it('fails explicitly when the plugin alias is missing instead of falling back to packaged dist artifacts', async () => {
    const aliasesWithoutPlugin = Object.fromEntries(
      Object.entries(EMCANVAS_VITE_ALIASES).filter(
        ([alias]) => alias !== '@emcanvas/plugin',
      ),
    )

    await expect(
      withAliasServer(aliasesWithoutPlugin, (server) =>
        server.ssrLoadModule('@emcanvas/plugin/dev-source'),
      ),
    ).rejects.toThrow(
      'Failed to load url @emcanvas/plugin/dev-source (resolved id: @emcanvas/plugin/dev-source). Does the file exist?',
    )
  })

  it('fails explicitly when the Vite config source cannot be read', () => {
    expect(() =>
      readViteConfigSource(`${VITE_CONFIG_SOURCE_PATH}.missing`),
    ).toThrow(
      `Unable to read Vite config source at ${VITE_CONFIG_SOURCE_PATH}.missing`,
    )
  })
})
