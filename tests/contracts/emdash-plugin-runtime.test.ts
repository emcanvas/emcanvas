// @vitest-environment node

import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { createServer, type ViteDevServer } from 'vite'

import pkg from '../../package.json'
import plugin, {
  createPlugin,
  descriptor as exportedDescriptor,
  manifest,
} from '../../src/plugin'
import devSourceDescriptor, {
  descriptor as exportedDevSourceDescriptor,
} from '../../src/plugin/dev-source'
import descriptor from '../../src/plugin/descriptor'
import { pageFragments } from '../../src/plugin/hooks/page-fragments'
import { getPageMetadata } from '../../src/plugin/hooks/page-metadata'
import { routeAdapters } from '../../src/plugin/runtime/route-adapters'
import { EMCANVAS_VITE_ALIASES } from '../../vite.config'

type NativeHookHandler = (...args: never[]) => unknown

type PluginRootModule = typeof import('../../src/plugin')

type DevSourceModule = typeof import('../../src/plugin/dev-source')

async function withLocalAliasServer<T>(
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
    join(tmpdir(), 'emcanvas-generated-import-'),
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

function expectResolvedHook(
  hook: unknown,
  handler: NativeHookHandler,
  pluginId: string | undefined,
) {
  expect(hook).toEqual({
    priority: 0,
    timeout: 0,
    dependencies: [],
    errorPolicy: 'continue',
    exclusive: false,
    handler,
    pluginId,
  })
}

const packageJson = pkg as {
  name?: string
  main?: string
  exports?: Record<string, string>
  version?: string
}

describe('emdash runtime contract', () => {
  it('keeps the native package runtime surface coherent', () => {
    expect(packageJson.main).toBe('./dist/index.mjs')
    expect(packageJson.exports).toEqual({
      '.': './dist/index.mjs',
      './sandbox': './dist/sandbox-entry.mjs',
      './admin': './dist/admin.mjs',
      './astro': './dist/astro.mjs',
    })

    expect(createPlugin).toBeTypeOf('function')
    expect(exportedDescriptor).toEqual(descriptor)
    expect(manifest).toEqual({
      id: packageJson.name,
      name: 'EmCanvas',
      version: packageJson.version,
    })
    expect(descriptor).toEqual({
      id: packageJson.name,
      version: packageJson.version,
      entrypoint: packageJson.name,
      format: 'module',
      sandbox: `${packageJson.name}/sandbox`,
      adminEntry: `${packageJson.name}/admin`,
      componentsEntry: `${packageJson.name}/astro`,
    })

    const createdPlugin = createPlugin()

    expect(createdPlugin).toEqual(plugin)

    expect(plugin).toMatchObject({
      id: packageJson.name,
      name: 'EmCanvas',
      version: packageJson.version,
      capabilities: ['read:content', 'write:content', 'page:inject'],
    })

    expectResolvedHook(
      plugin.hooks['page:fragments'],
      pageFragments,
      packageJson.name,
    )
    expectResolvedHook(
      plugin.hooks['page:metadata'],
      getPageMetadata,
      packageJson.name,
    )
    expect(plugin.hooks).not.toHaveProperty('entry:editor:actions')

    expect(plugin.routes['canvas-data']).toEqual({
      handler: routeAdapters.loadDocument,
    })
    expect(plugin.routes['save-canvas-data']).toEqual({
      handler: routeAdapters.saveDocument,
    })
    expect(plugin.routes['preview-link']).toEqual({
      handler: routeAdapters.getPreviewLink,
    })

    expect(createdPlugin).not.toHaveProperty('adminPages')
    expect(plugin).not.toHaveProperty('adminPages')
  })

  it('keeps packaged dist exports canonical while exposing a separate dev-source descriptor', () => {
    expect(packageJson.main).toBe('./dist/index.mjs')
    expect(packageJson.exports).toEqual({
      '.': './dist/index.mjs',
      './sandbox': './dist/sandbox-entry.mjs',
      './admin': './dist/admin.mjs',
      './astro': './dist/astro.mjs',
    })

    expect(exportedDevSourceDescriptor).toEqual(devSourceDescriptor)
    expect(devSourceDescriptor).toEqual({
      id: packageJson.name,
      version: packageJson.version,
      format: 'module',
      entrypoint: '@emcanvas/plugin',
      sandbox: fileURLToPath(
        new URL('../../src/plugin/sandbox-entry.ts', import.meta.url),
      ),
      adminEntry: fileURLToPath(
        new URL('../../src/plugin/admin-entry.ts', import.meta.url),
      ),
      componentsEntry: fileURLToPath(
        new URL('../../src/plugin/astro-entry.ts', import.meta.url),
      ),
    })
    expect(devSourceDescriptor).not.toEqual(descriptor)
    expect(devSourceDescriptor.entrypoint).not.toBe(packageJson.name)
    expect(devSourceDescriptor.sandbox).not.toBe(`${packageJson.name}/sandbox`)
    expect(devSourceDescriptor.adminEntry).not.toBe(`${packageJson.name}/admin`)
    expect(devSourceDescriptor.componentsEntry).not.toBe(
      `${packageJson.name}/astro`,
    )
  })

  it('proves local dev-source alias loading preserves packaged runtime behavior while keeping descriptor opt-in separate', async () => {
    const aliasLoadedModules = await withLocalAliasServer(
      EMCANVAS_VITE_ALIASES,
      async (server) => ({
        devSource: (await server.ssrLoadModule(
          '@emcanvas/plugin/dev-source',
        )) as DevSourceModule,
        root: (await server.ssrLoadModule(
          '@emcanvas/plugin',
        )) as PluginRootModule,
      }),
    )

    expect(aliasLoadedModules.root.default).toMatchObject({
      id: plugin.id,
      name: plugin.name,
      version: plugin.version,
      capabilities: plugin.capabilities,
      routes: {
        'preview-link': {
          handler: expect.any(Function),
        },
        'canvas-data': {
          handler: expect.any(Function),
        },
        'save-canvas-data': {
          handler: expect.any(Function),
        },
      },
    })
    expect(aliasLoadedModules.root.createPlugin()).toMatchObject({
      id: createPlugin().id,
      name: createPlugin().name,
      version: createPlugin().version,
      capabilities: createPlugin().capabilities,
    })
    expect(aliasLoadedModules.root.descriptor).toEqual(descriptor)
    expect(Object.keys(aliasLoadedModules.root.default.hooks).sort()).toEqual(
      Object.keys(plugin.hooks).sort(),
    )
    expect(Object.keys(aliasLoadedModules.root.default.routes).sort()).toEqual(
      Object.keys(plugin.routes).sort(),
    )

    expect(aliasLoadedModules.devSource.default).toEqual(devSourceDescriptor)
    expect(aliasLoadedModules.devSource.descriptor).toEqual(devSourceDescriptor)
    expect(aliasLoadedModules.devSource.default).not.toEqual(
      aliasLoadedModules.root.descriptor,
    )
  })

  it('keeps EmDash-style generated imports resolvable when the host aliases only the plugin root entry file', async () => {
    await withGeneratedImportModule(
      devSourceDescriptor.componentsEntry,
      async (generatedModulePath) => {
        const importedModule = await withLocalAliasServer(
          {
            '@emcanvas/plugin': join(process.cwd(), 'src/plugin/index.ts'),
          },
          (server) => server.ssrLoadModule(generatedModulePath),
        )

        expect(importedModule.default).toMatchObject({
          blockComponents: {},
        })
      },
    )
  })
})
