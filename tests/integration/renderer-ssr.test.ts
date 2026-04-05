// @vitest-environment node

import { readdirSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { widgetRegistry } from '../../src/editor/registry/widget-registry'
import EmCanvasRenderer from '../../src/renderer/astro/EmCanvasRenderer.astro'

const rendererBranchingPatterns = [
  /getComponentRenderer\(node\.type\)/,
  /switch\s*\(\s*node\.type\s*\)/,
  /node\.type\s*(===|==|!==|!=)/,
  /case\s+['"](?:section|columns|container|heading|text|button|image|video|spacer|divider)['"]/,
]

describe('EmCanvasRenderer', () => {
  it('renders MVP nodes recursively in SSR output', async () => {
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
            styles: {
              desktop: {
                padding: '24px',
              },
            },
            children: [
              {
                id: 'hero-columns',
                type: 'columns',
                props: {},
                styles: {
                  desktop: {
                    gap: '16px',
                  },
                  mobile: {
                    gap: '8px',
                  },
                },
                children: [
                  {
                    id: 'hero-copy',
                    type: 'container',
                    props: {},
                    styles: {
                      desktop: {
                        maxWidth: '640px',
                      },
                    },
                    children: [
                      {
                        id: 'hero-title',
                        type: 'heading',
                        props: {
                          text: 'Hello SSR',
                          level: 1,
                        },
                        styles: {
                          desktop: {
                            color: '#111111',
                          },
                        },
                        children: [],
                      },
                      {
                        id: 'hero-text',
                        type: 'text',
                        props: {
                          text: 'Renderer body copy',
                        },
                        styles: {
                          desktop: {
                            color: '#444444',
                          },
                        },
                        children: [],
                      },
                      {
                        id: 'hero-button',
                        type: 'button',
                        props: {
                          label: 'Read more',
                          href: '/read-more',
                        },
                        styles: {
                          desktop: {
                            backgroundColor: '#222222',
                          },
                        },
                        children: [],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    })

    expect(html).toContain('data-emcanvas-root')
    expect(html).toContain('<section')
    expect(html).toContain('<div data-emcanvas-node="hero-columns"')
    expect(html).toContain('<div data-emcanvas-node="hero-copy"')
    expect(html).toMatch(/<h1[^>]*data-emcanvas-node="hero-title"[^>]*style="color:#111111"[^>]*>Hello SSR<\/h1>/)
    expect(html).toMatch(/<p[^>]*data-emcanvas-node="hero-text"[^>]*style="color:#444444"[^>]*>Renderer body copy<\/p>/)
    expect(html).toMatch(
      /<a(?=[^>]*data-emcanvas-node="hero-button")(?=[^>]*href="\/read-more")(?=[^>]*style="background-color:#222222")[^>]*>Read more<\/a>/,
    )
    expect(html).toContain('@media (max-width: 767px){[data-emcanvas-node="hero-columns"]{gap:8px;}}')
  })

  it('emits a single style block for responsive media rules', async () => {
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
            styles: {
              desktop: {
                padding: '24px',
              },
              mobile: {
                padding: '12px',
              },
            },
            children: [
              {
                id: 'hero-columns',
                type: 'columns',
                props: {},
                styles: {
                  desktop: {
                    gap: '16px',
                  },
                  mobile: {
                    gap: '8px',
                  },
                },
                children: [
                  {
                    id: 'hero-copy',
                    type: 'container',
                    props: {},
                    styles: {
                      desktop: {
                        maxWidth: '640px',
                      },
                      tablet: {
                        maxWidth: '100%',
                      },
                    },
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
    expect(html).toContain('@media (max-width: 767px){[data-emcanvas-node="root"]{padding:12px;}}')
    expect(html).toContain('@media (max-width: 767px){[data-emcanvas-node="hero-columns"]{gap:8px;}}')
    expect(html).toContain('@media (max-width: 1024px){[data-emcanvas-node="hero-copy"]{max-width:100%;}}')
  })

  it('does not leak widget config props into SSR DOM output', async () => {
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
            styles: {
              desktop: {},
            },
            children: [
              {
                id: 'layout-columns',
                type: 'columns',
                props: {
                  columns: 3,
                },
                styles: {
                  desktop: {},
                },
                children: [],
              },
              {
                id: 'hero-video',
                type: 'video',
                props: {
                  src: '/uploads/hero.mp4',
                  provider: 'youtube',
                },
                styles: {
                  desktop: {},
                },
                children: [],
              },
            ],
          },
        },
      },
    })

    expect(html).toMatch(/<div[^>]*data-emcanvas-node="layout-columns"[^>]*><\/div>/)
    expect(html).not.toContain(' columns="3"')
    expect(html).toMatch(
      /<video(?=[^>]*data-emcanvas-node="hero-video")(?=[^>]*src="\/uploads\/hero.mp4")(?=[^>]*controls)[^>]*><\/video>/,
    )
    expect(html).not.toContain(' provider="youtube"')
  })

  describe('base widget wrapper', () => {
    it('wraps renderable widgets with a shared base wrapper when enabled', async () => {
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
              styles: {
                desktop: {},
              },
              children: [
                {
                  id: 'hero-button',
                  type: 'button',
                  props: {
                    label: 'Read more',
                    href: '/read-more',
                  },
                  styles: {
                    desktop: {},
                  },
                  children: [],
                },
              ],
            },
          },
        },
      })

      expect(html).toMatch(
        /<div class="emc-node emc-hero-button"[^>]*><a(?=[^>]*data-emcanvas-node="hero-button")(?=[^>]*href="\/read-more")[^>]*>Read more<\/a><\/div>/,
      )
    })

    it('sanitizes malformed widget ids before deriving the wrapper class suffix', async () => {
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
              styles: {
                desktop: {},
              },
              children: [
                {
                  id: 'hero button"]{color:red}body{display:block}/*',
                  type: 'button',
                  props: {
                    label: 'Read more',
                    href: '/read-more',
                  },
                  styles: {
                    desktop: {},
                  },
                  children: [],
                },
              ],
            },
          },
        },
      })

      expect(html).toContain('class="emc-node emc-hero_button___color_red_body_display_block___"')
      expect(html).not.toContain('class="emc-node emc-hero button')
      expect(html).not.toContain('class="emc-node emc-hero button&#34;]{color:red}body{display:block}/*"')
    })

    it('keeps widgets pure when their universal wrapper is disabled', async () => {
      const originalDefinition = widgetRegistry.get('button')

      if (!originalDefinition) {
        throw new Error('Expected button widget definition to exist')
      }

      widgetRegistry.set('button', {
        ...originalDefinition,
        disableBaseWrapper: true,
      })

      try {
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
                styles: {
                  desktop: {},
                },
                children: [
                  {
                    id: 'hero-button',
                    type: 'button',
                    props: {
                      label: 'Read more',
                      href: '/read-more',
                    },
                    styles: {
                      desktop: {},
                    },
                    children: [],
                  },
                ],
              },
            },
          },
        })

        expect(html).toMatch(
          /<a(?=[^>]*data-emcanvas-node="hero-button")(?=[^>]*href="\/read-more")[^>]*>Read more<\/a>/,
        )
        expect(html).not.toContain('class="emc-node emc-hero-button"')
      } finally {
        widgetRegistry.set('button', originalDefinition)
      }
    })
  })

  it('keeps renderer-layer Astro files blind to concrete node types', () => {
    const rendererAstroDir = 'src/renderer/astro'
    const astroFiles = readdirSync(rendererAstroDir)
      .filter((fileName: string) => fileName.endsWith('.astro'))
      .map((fileName: string) => ({
        fileName,
        source: readFileSync(`${rendererAstroDir}/${fileName}`, 'utf8'),
      }))

    expect(
      astroFiles.some(({ source }: { source: string }) =>
        source.includes('getAstroComponent(node.type)'),
      ),
    ).toBe(true)

    for (const { fileName, source } of astroFiles) {
      for (const pattern of rendererBranchingPatterns) {
        expect(source, `${fileName} should stay blind to concrete node types`).not.toMatch(
          pattern,
        )
      }
    }
  })
})
