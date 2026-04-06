// @vitest-environment node

import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createServer, type ViteDevServer } from 'vite'

import pkg from '../../package.json'
import plugin, {
  createPlugin,
  descriptor as exportedDescriptor,
  manifest,
} from '../../src/plugin'
import descriptor from '../../src/plugin/descriptor'
import { pageFragments } from '../../src/plugin/hooks/page-fragments'
import { getPageMetadata } from '../../src/plugin/hooks/page-metadata'
import { routeAdapters } from '../../src/plugin/runtime/route-adapters'

type NativeHookHandler = (...args: never[]) => unknown

type PluginRootModule = typeof import('../../src/plugin')

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
    join(process.cwd(), '.emcanvas-generated-import-'),
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
    expect(packageJson.main).toBe('./src/plugin/index.ts')
    expect(packageJson.exports).toEqual({
      '.': './src/plugin/index.ts',
      './sandbox': './src/plugin/sandbox-entry.ts',
      './admin': './src/plugin/admin-entry.ts',
      './astro': './src/plugin/astro-entry.ts',
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

  it('keeps one native descriptor contract aligned with public package specifiers', () => {
    expect(descriptor).toEqual({
      id: packageJson.name,
      version: packageJson.version,
      entrypoint: packageJson.name,
      format: 'module',
      sandbox: `${packageJson.name}/sandbox`,
      adminEntry: `${packageJson.name}/admin`,
      componentsEntry: `${packageJson.name}/astro`,
    })
  })

  it('loads the root public package surface without a separate dev-source contract', async () => {
    const aliasLoadedRoot = await withLocalAliasServer(
      {},
      (server) =>
        server.ssrLoadModule(
          '/src/plugin/index.ts',
        ) as Promise<PluginRootModule>,
    )

    expect(aliasLoadedRoot.default).toMatchObject({
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
    expect(aliasLoadedRoot.createPlugin()).toMatchObject({
      id: createPlugin().id,
      name: createPlugin().name,
      version: createPlugin().version,
      capabilities: createPlugin().capabilities,
    })
    expect(aliasLoadedRoot.descriptor).toEqual(descriptor)
    expect(Object.keys(aliasLoadedRoot.default.hooks).sort()).toEqual(
      Object.keys(plugin.hooks).sort(),
    )
    expect(Object.keys(aliasLoadedRoot.default.routes).sort()).toEqual(
      Object.keys(plugin.routes).sort(),
    )
  })

  it('keeps generated package-surface imports resolvable without host-local aliases', async () => {
    await withGeneratedImportModule(
      'emcanvas/astro',
      async (generatedModulePath) => {
        const importedModule = await withLocalAliasServer({}, (server) =>
          server.ssrLoadModule(generatedModulePath),
        )

        expect(importedModule.default).toMatchObject({
          blockComponents: {},
        })
      },
    )
  })
})
