// @vitest-environment node

import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createServer, type ViteDevServer } from 'vite'

import pkg from '../../package.json'
import plugin, { createPlugin, manifest } from '../../src/plugin'
import { EMCANVAS_VITE_ALIASES } from '../../vite.config'
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
  baseDirectory: string,
  importSpecifier: string,
  run: (modulePath: string) => Promise<T>,
): Promise<T> {
  const safeSpecifier = importSpecifier.replaceAll('/', '-')
  const modulePath = join(baseDirectory, `generated-${safeSpecifier}.ts`)

  await writeFile(
    modulePath,
    `import * as importedEntry from ${JSON.stringify(importSpecifier)}\nexport default importedEntry\n`,
  )

  return run(modulePath)
}

const repoRoot = process.cwd()

const consumableEntrySources = {
  '.': {
    hasDefault: true,
    sourcePath: resolve(repoRoot, 'src/plugin/index.ts'),
  },
  './descriptor': {
    hasDefault: true,
    sourcePath: resolve(repoRoot, 'src/plugin/descriptor.ts'),
  },
  './sandbox': {
    hasDefault: true,
    sourcePath: resolve(repoRoot, 'src/plugin/sandbox-entry.ts'),
  },
  './admin': {
    hasDefault: false,
    sourcePath: resolve(repoRoot, 'src/plugin/admin-entry.ts'),
  },
  './astro': {
    hasDefault: false,
    sourcePath: resolve(repoRoot, 'src/plugin/astro-entry.ts'),
  },
} as const

function createShimSource(sourcePath: string, hasDefault: boolean) {
  const viteSourcePath = `/@fs${sourcePath}`
  const exportsBlock = `export * from ${JSON.stringify(viteSourcePath)}\n`

  if (!hasDefault) {
    return exportsBlock
  }

  return `${exportsBlock}export { default } from ${JSON.stringify(viteSourcePath)}\n`
}

async function withConsumablePackageServer<T>(
  run: (server: ViteDevServer, appDirectory: string) => Promise<T>,
): Promise<T> {
  const tempDirectory = await mkdtemp(
    join(tmpdir(), 'emcanvas-consumable-package-'),
  )
  const appDirectory = join(tempDirectory, 'app')
  const packageDirectory = join(appDirectory, 'node_modules/emcanvas')

  await mkdir(packageDirectory, { recursive: true })
  await writeFile(
    join(appDirectory, 'package.json'),
    JSON.stringify({ name: 'emcanvas-consumable-app', private: true }, null, 2),
  )
  await writeFile(
    join(packageDirectory, 'package.json'),
    JSON.stringify(
      {
        exports: packageJson.exports,
        main: packageJson.main,
        name: packageJson.name,
        type: 'module',
        version: packageJson.version,
      },
      null,
      2,
    ),
  )

  for (const [exportKey, exportPath] of Object.entries(
    packageJson.exports ?? {},
  )) {
    const entrySource =
      consumableEntrySources[exportKey as keyof typeof consumableEntrySources]

    if (!entrySource) {
      throw new Error(`Missing consumable entry source for ${exportKey}`)
    }

    const packageEntryPath = join(
      packageDirectory,
      exportPath.replace('./', ''),
    )

    await mkdir(join(packageEntryPath, '..'), { recursive: true })
    await writeFile(
      packageEntryPath,
      createShimSource(entrySource.sourcePath, entrySource.hasDefault),
    )
  }

  const server = await createServer({
    appType: 'custom',
    configFile: false,
    optimizeDeps: {
      noDiscovery: true,
    },
    resolve: {
      alias: EMCANVAS_VITE_ALIASES,
    },
    root: appDirectory,
    ssr: {
      noExternal: ['emcanvas'],
    },
    server: {
      middlewareMode: true,
    },
  })

  try {
    return await run(server, appDirectory)
  } finally {
    await server.close()
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
      './descriptor': './src/plugin/descriptor.ts',
      './sandbox': './src/plugin/sandbox-entry.ts',
      './admin': './src/plugin/admin-entry.ts',
      './astro': './src/plugin/astro-entry.ts',
    })

    expect(createPlugin).toBeTypeOf('function')
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
      adminEntry: `${packageJson.name}/admin`,
      componentsEntry: `${packageJson.name}/astro`,
      adminPages: [
        {
          path: '/dashboard',
          label: 'Dashboard',
          icon: 'layout-dashboard',
        },
        {
          path: '/editor',
          label: 'Editor',
          icon: 'pen-square',
        },
      ],
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
    expect(plugin.storage).toEqual({})
    expect(plugin.admin).toEqual({
      entry: `${packageJson.name}/admin`,
      pages: descriptor.adminPages,
      widgets: [],
    })
    expect(createdPlugin.admin).toEqual(plugin.admin)
  })

  it('keeps one native descriptor contract aligned with public package specifiers', () => {
    expect(descriptor).toEqual({
      id: packageJson.name,
      version: packageJson.version,
      entrypoint: packageJson.name,
      format: 'module',
      adminEntry: `${packageJson.name}/admin`,
      componentsEntry: `${packageJson.name}/astro`,
      adminPages: [
        {
          path: '/dashboard',
          label: 'Dashboard',
          icon: 'layout-dashboard',
        },
        {
          path: '/editor',
          label: 'Editor',
          icon: 'pen-square',
        },
      ],
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
    expect(Object.keys(aliasLoadedRoot.default.hooks).sort()).toEqual(
      Object.keys(plugin.hooks).sort(),
    )
    expect(Object.keys(aliasLoadedRoot.default.routes).sort()).toEqual(
      Object.keys(plugin.routes).sort(),
    )
  })

  it('loads source-first public package specifiers without host-local aliases', async () => {
    await withConsumablePackageServer(async (server, appDirectory) => {
      const rootModule = await withGeneratedImportModule(
        appDirectory,
        'emcanvas',
        (generatedModulePath) => server.ssrLoadModule(generatedModulePath),
      )
      const descriptorModule = await withGeneratedImportModule(
        appDirectory,
        'emcanvas/descriptor',
        (generatedModulePath) => server.ssrLoadModule(generatedModulePath),
      )
      const sandboxModule = await withGeneratedImportModule(
        appDirectory,
        'emcanvas/sandbox',
        (generatedModulePath) => server.ssrLoadModule(generatedModulePath),
      )
      const adminModule = await withGeneratedImportModule(
        appDirectory,
        'emcanvas/admin',
        (generatedModulePath) => server.ssrLoadModule(generatedModulePath),
      )
      const astroModule = await withGeneratedImportModule(
        appDirectory,
        'emcanvas/astro',
        (generatedModulePath) => server.ssrLoadModule(generatedModulePath),
      )

      expect(rootModule.default).toMatchObject({
        createPlugin: expect.any(Function),
        default: expect.objectContaining({
          id: plugin.id,
          name: plugin.name,
          version: plugin.version,
        }),
        manifest,
      })
      expect(descriptorModule.default).toMatchObject({
        default: descriptor,
      })
      expect(sandboxModule.default).toMatchObject({
        default: descriptor,
      })
      expect(adminModule.default).toMatchObject({
        pages: {
          dashboard: expect.any(Function),
          editor: expect.any(Function),
        },
      })
      expect(astroModule.default).toMatchObject({
        blockComponents: {},
      })
    })
  })
})
