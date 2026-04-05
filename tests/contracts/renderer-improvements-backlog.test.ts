// @vitest-environment node

import { readdirSync, readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, it } from 'vitest'
import EmCanvasRenderer from '../../src/renderer/astro/EmCanvasRenderer.astro'
import { getAstroComponent } from '../../src/renderer/components/registry'
import { getCanvasEntryState } from '../../src/renderer/data/get-canvas-entry-state'
import { buildStyleDeclarations } from '../../src/renderer/styles/build-style-declarations'

const testDir = dirname(fileURLToPath(import.meta.url))

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(testDir, '..', '..', relativePath), 'utf8')
}

function readRendererAstroSources() {
  const rendererAstroDir = resolve(
    testDir,
    '..',
    '..',
    'src',
    'renderer',
    'astro',
  )

  return readdirSync(rendererAstroDir)
    .filter((fileName: string) => fileName.endsWith('.astro'))
    .map((fileName: string) => ({
      fileName,
      source: readFileSync(resolve(rendererAstroDir, fileName), 'utf8'),
    }))
}

const rendererBranchingPatterns = [
  /getComponentRenderer\(node\.type\)/,
  /switch\s*\(\s*node\.type\s*\)/,
  /node\.type\s*(===|==|!==|!=)/,
  /case\s+['"](?:section|columns|container|heading|text|button|image|video|spacer|divider)['"]/,
]

describe('renderer improvements backlog', () => {
  it('documents which renderer improvements are already covered in code', async () => {
    expect(
      buildStyleDeclarations({
        width: 'calc(100% - 20px)',
        color: 'var(--brand-color)',
      }),
    ).toContain('width:calc(100% - 20px);color:var(--brand-color)')

    expect(
      getCanvasEntryState({ _emcanvas: { enabled: false } }).shouldRender,
    ).toBe(false)
    expect(
      readProjectFile('src/renderer/data/get-canvas-entry-state.ts'),
    ).toContain('Record<string, unknown>')

    expect(getAstroComponent('section')).toBeTypeOf('function')
    expect(getAstroComponent('container')).toBeTypeOf('function')
    expect(getAstroComponent('heading')).toBeTypeOf('function')

    const container = await AstroContainer.create()
    const html = await container.renderToString(EmCanvasRenderer, {
      props: {
        document: {
          version: 1,
          settings: {},
          root: {
            id: 'root',
            type: 'section',
            props: {},
            styles: { desktop: {}, mobile: { padding: '12px' } },
            children: [
              {
                id: 'copy',
                type: 'container',
                props: {},
                styles: { desktop: {}, tablet: { maxWidth: '100%' } },
                children: [
                  {
                    id: 'title',
                    type: 'heading',
                    props: { text: 'Hello', level: 2 },
                    styles: { desktop: {} },
                    children: [],
                  },
                ],
              },
            ],
          },
        },
      },
    })

    expect(html).not.toContain('<style')
    expect(html).not.toContain('style="')
  })

  it('closes the universal blind renderer item once the Astro template stops branching per node kind', () => {
    const renderModelSource = readProjectFile('src/renderer/types/renderer.ts')
    const rendererAstroSources = readRendererAstroSources()

    expect(renderModelSource).toContain("category: 'wrapper'")
    expect(renderModelSource).toContain("category: 'leaf'")
    expect(renderModelSource).toContain(
      'attributes?: Record<string, string | true>',
    )
    expect(renderModelSource).toContain('textContent?: string')

    expect(
      rendererAstroSources.some(({ source }: { source: string }) =>
        source.includes('getAstroComponent(node.type)'),
      ),
    ).toBe(true)

    for (const { fileName, source } of rendererAstroSources) {
      for (const pattern of rendererBranchingPatterns) {
        expect(
          source,
          `${fileName} should stay blind to concrete node types`,
        ).not.toMatch(pattern)
      }
    }
  })
})
