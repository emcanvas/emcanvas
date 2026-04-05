// @vitest-environment node

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { describe, expect, it } from 'vitest'
import EmCanvasRenderer from '../../src/renderer/astro/EmCanvasRenderer.astro'
import { getAstroComponent } from '../../src/renderer/components/registry'
import { getCanvasEntryState } from '../../src/renderer/data/get-canvas-entry-state'
import { buildInlineStyle } from '../../src/renderer/styles/build-inline-style'

const testDir = dirname(fileURLToPath(import.meta.url))

function readProjectFile(relativePath: string) {
  return readFileSync(resolve(testDir, '..', '..', relativePath), 'utf8')
}

describe('renderer improvements backlog', () => {
  it('documents which renderer improvements are already covered in code', async () => {
    expect(
      buildInlineStyle({
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

    expect((html.match(/<style/g) ?? []).length).toBe(1)
    expect(html).toContain('<style data-emcanvas-media-rules>')
    expect(html).toContain(
      '@media (max-width: 767px){[data-emcanvas-node="root"]{padding:12px;}}',
    )
    expect(html).toContain(
      '@media (max-width: 1024px){[data-emcanvas-node="copy"]{max-width:100%;}}',
    )
  })

  it('closes the universal blind renderer item once the Astro template stops branching per node kind', () => {
    const renderModelSource = readProjectFile('src/renderer/types/renderer.ts')
    const astroTemplateSource = readProjectFile(
      'src/renderer/astro/CanvasNodeRenderer.astro',
    )

    expect(renderModelSource).toContain("category: 'wrapper'")
    expect(renderModelSource).toContain("category: 'leaf'")
    expect(renderModelSource).toContain('attributes?: Record<string, string | true>')
    expect(renderModelSource).toContain('textContent?: string')

    expect(astroTemplateSource).toContain('getAstroComponent(node.type)')
    expect(astroTemplateSource).not.toContain('getComponentRenderer(node.type)')
    expect(astroTemplateSource).not.toContain('switch (node.type)')
    expect(astroTemplateSource).not.toContain("case 'heading'")
    expect(astroTemplateSource).not.toContain("case 'text'")
    expect(astroTemplateSource).not.toContain("case 'button'")
    expect(astroTemplateSource).not.toContain("case 'image'")
    expect(astroTemplateSource).not.toContain("case 'video'")
  })
})
