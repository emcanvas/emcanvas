// @vitest-environment node

import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { createServer, type ViteDevServer } from 'vite'
import devSourceGuideContent from '../../docs/integration/emdash-dev-source-consumption.md?raw'
import tsconfig from '../../tsconfig.json'
import {
  EMCANVAS_VITE_ALIASES,
  readViteConfigSource,
  VITE_CONFIG_SOURCE_PATH,
} from '../../vite.config'

const DOCUMENTED_DEV_SOURCE_IMPORT_SPECIFIER =
  devSourceGuideContent.match(/from\s+'([^']+)'/)?.[1]

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

async function withGeneratedImportModule<T>(
  importSpecifier: string,
  run: (modulePath: string) => Promise<T>,
): Promise<T> {
  const tempDirectory = await mkdtemp(
    join(process.cwd(), '.emcanvas-public-import-'),
  )
  const modulePath = join(tempDirectory, 'generated-import.ts')

  await writeFile(
    modulePath,
    `import * as importedEntry from ${JSON.stringify(importSpecifier)}\nexport default importedEntry\n`,
  )

  try {
    return await run(modulePath)
  } finally {
    await rm(tempDirectory, { force: true, recursive: true })
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

  it('keeps internal plugin aliases isolated from the public host contract', () => {
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

  it('documents public package imports instead of a dev-source descriptor alias', () => {
    expect(DOCUMENTED_DEV_SOURCE_IMPORT_SPECIFIER).toBe('emcanvas')
  })

  it('keeps the public root package import executable without mirrored host aliases', async () => {
    const rootModule = await withGeneratedImportModule(
      'emcanvas',
      (modulePath) =>
        withAliasServer({}, (server) => server.ssrLoadModule(modulePath)),
    )

    expect(rootModule.default).toMatchObject({
      createPlugin: expect.any(Function),
      descriptor: expect.objectContaining({
        entrypoint: 'emcanvas',
      }),
    })
  })

  it('keeps public subpath imports executable without mirrored host aliases', async () => {
    const astroModule = await withGeneratedImportModule(
      'emcanvas/astro',
      (modulePath) =>
        withAliasServer({}, (server) => server.ssrLoadModule(modulePath)),
    )

    expect(astroModule.default).toMatchObject({
      blockComponents: {},
    })
  })

  it('fails explicitly when the Vite config source cannot be read', () => {
    expect(() =>
      readViteConfigSource(`${VITE_CONFIG_SOURCE_PATH}.missing`),
    ).toThrow(
      `Unable to read Vite config source at ${VITE_CONFIG_SOURCE_PATH}.missing`,
    )
  })
})
