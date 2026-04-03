// @vitest-environment node

import { describe, expect, it } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import EmCanvasRenderer from '../../src/renderer/astro/EmCanvasRenderer.astro'

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
    expect(html).toMatch(/<a[^>]*data-emcanvas-node="hero-button"[^>]*href="\/read-more"[^>]*style="background-color:#222222"[^>]*>Read more<\/a>/)
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
})
