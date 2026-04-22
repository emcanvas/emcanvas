// @vitest-environment node

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { ASTRO_TEST_SRC_DIR } from '../../vite.config'
import { widgetRegistry } from '../../src/editor/registry/widget-registry'
import EmCanvasRenderer from '../../src/renderer/astro/EmCanvasRenderer.astro'
import { createFixtureLandingPageDocument } from '../fixtures/document-factory'

const rendererBranchingPatterns = [
  /getComponentRenderer\(node\.type\)/,
  /switch\s*\(\s*node\.type\s*\)/,
  /node\.type\s*(===|==|!==|!=)/,
  /case\s+['"](?:section|columns|container|heading|text|button|image|video|spacer|divider)['"]/,
]

describe('EmCanvasRenderer', () => {
  it('keeps Astro-backed SSR tests anchored to the dedicated Astro fixture srcDir', async () => {
    const fixturePagesDir = fileURLToPath(
      new URL('../fixtures/astro-src/pages', import.meta.url),
    )
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
            children: [],
          },
        },
      },
    })

    expect(ASTRO_TEST_SRC_DIR).toBe('./tests/fixtures/astro-src')
    expect(existsSync(fixturePagesDir)).toBe(true)
    expect(html).toContain('data-emcanvas-root')
  })

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
                      {
                        id: 'hero-image',
                        type: 'image',
                        props: {
                          src: 'https://cdn.example.test/hero.jpg',
                          alt: 'Hero banner',
                        },
                        styles: {
                          desktop: {
                            maxWidth: '100%',
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
    expect(html).toMatch(
      /<h1[^>]*data-emcanvas-node="hero-title"[^>]*>Hello SSR<\/h1>/,
    )
    expect(html).toMatch(
      /<p[^>]*data-emcanvas-node="hero-text"[^>]*>Renderer body copy<\/p>/,
    )
    expect(html).toMatch(
      /<a(?=[^>]*data-emcanvas-node="hero-button")(?=[^>]*href="\/read-more")[^>]*>Read more<\/a>/,
    )
    expect(html).toMatch(
      /<img(?=[^>]*data-emcanvas-node="hero-image")(?=[^>]*src="https:\/\/cdn\.example\.test\/hero\.jpg")(?=[^>]*alt="Hero banner")[^>]*>/,
    )
    expect(html).not.toContain('style="')
    expect(html).not.toContain('<style')
  })

  it('renders a simple hero block with CTA and media in SSR output', async () => {
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
                id: 'hero-1',
                type: 'hero',
                props: {
                  title: 'Launch faster with EmCanvas',
                  body: 'Compose a simple landing hero with headline, copy, CTA, and media.',
                  ctaLabel: 'Start building',
                  ctaHref: '/start-building',
                  imageSrc: 'https://cdn.example.test/hero-card.jpg',
                  imageAlt: 'Website builder preview',
                },
                styles: {
                  desktop: {
                    padding: '32px',
                  },
                },
                children: [],
              },
            ],
          },
        },
      },
    })

    expect(html).toContain('data-emcanvas-node="hero-1"')
    expect(html).toMatch(/<section[^>]*class="emc-hero"[^>]*>/)
    expect(html).toContain('Launch faster with EmCanvas')
    expect(html).toContain(
      'Compose a simple landing hero with headline, copy, CTA, and media.',
    )
    expect(html).toMatch(
      /<a(?=[^>]*href="\/start-building")[^>]*>\s*Start building\s*<\/a>/,
    )
    expect(html).toMatch(
      /<img(?=[^>]*src="https:\/\/cdn\.example\.test\/hero-card\.jpg")(?=[^>]*alt="Website builder preview")[^>]*>/,
    )
    expect(html).not.toContain('style="')
  })

  it('renders a simple features cards block in SSR output', async () => {
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
                id: 'features-cards-1',
                type: 'features/cards',
                props: {
                  title: 'Why teams choose EmCanvas',
                  intro:
                    'Use a compact benefit grid right below the hero to reinforce the value proposition.',
                  card1Title: 'Fast setup',
                  card1Body:
                    'Start from reusable sections instead of rebuilding landing layouts every time.',
                  card2Title: 'Safe editing',
                  card2Body:
                    'Keep edits inside the same entry workflow your team already uses.',
                  card3Title: 'SSR by default',
                  card3Body:
                    'Render a simple section on the frontend without inline styles or client bootstrapping.',
                },
                styles: {
                  desktop: {
                    padding: '32px',
                  },
                },
                children: [],
              },
            ],
          },
        },
      },
    })

    expect(html).toContain('data-emcanvas-node="features-cards-1"')
    expect(html).toMatch(/<section[^>]*class="emc-features-cards"[^>]*>/)
    expect(html).toContain('Why teams choose EmCanvas')
    expect(html).toContain('Fast setup')
    expect(html).toContain('Safe editing')
    expect(html).toContain('SSR by default')
    expect(html).toContain(
      'Render a simple section on the frontend without inline styles or client bootstrapping.',
    )
    expect(html).not.toContain('style="')
  })

  it('renders a published landing page document with hero and features/cards', async () => {
    const container = await AstroContainer.create()
    const html = await container.renderToString(EmCanvasRenderer, {
      props: {
        document: createFixtureLandingPageDocument(),
      },
    })

    expect(html).toContain('Launch your next campaign faster')
    expect(html).toContain('Start building')
    expect(html).toContain('Landing page hero preview')
    expect(html).toContain('Why teams can ship with the MVP')
    expect(html).toContain('Hero section')
    expect(html).toContain('Benefits grid')
    expect(html).toContain('SSR output')
    expect(html).not.toContain('style="')
  })

  it('keeps useful button hrefs and sanitizes unsafe ones in SSR output', async () => {
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
                id: 'valid-button',
                type: 'button',
                props: {
                  label: 'Docs',
                  href: 'https://example.test/docs',
                },
                styles: {
                  desktop: {},
                },
                children: [],
              },
              {
                id: 'invalid-button',
                type: 'button',
                props: {
                  label: 'Unsafe',
                  href: 'javascript:alert(1)',
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
      /<a(?=[^>]*data-emcanvas-node="valid-button")(?=[^>]*href="https:\/\/example\.test\/docs")[^>]*>Docs<\/a>/,
    )
    expect(html).toMatch(
      /<a(?=[^>]*data-emcanvas-node="invalid-button")(?=[^>]*href="#")[^>]*>Unsafe<\/a>/,
    )
    expect(html).not.toContain('href="javascript:alert(1)"')
  })

  it('keeps node selector hooks without renderer-local stylesheet output', async () => {
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

    expect(html).toContain('data-emcanvas-node="root"')
    expect(html).toContain('data-emcanvas-node="hero-columns"')
    expect(html).toContain('data-emcanvas-node="hero-copy"')
    expect(html).not.toContain('<style')
    expect(html).not.toContain('style="')
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

    expect(html).toMatch(
      /<div[^>]*data-emcanvas-node="layout-columns"[^>]*><\/div>/,
    )
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

      expect(html).toContain(
        'class="emc-node emc-hero_button___color_red_body_display_block___"',
      )
      expect(html).not.toContain('class="emc-node emc-hero button')
      expect(html).not.toContain(
        'class="emc-node emc-hero button&#34;]{color:red}body{display:block}/*"',
      )
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

    it('normalizes advanced css classes and omits blank css ids from SSR output', async () => {
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
                  advancedProps: {
                    cssId: '   ',
                    cssClasses: ['custom-hero', ' layout-block '],
                    visibility: {
                      hideOnTablet: true,
                      hideOnMobile: true,
                    },
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
        /<div(?=[^>]*class="emc-node emc-hero-button emc-custom-hero emc-layout-block emc-hide-tablet emc-hide-mobile")(?=[^>]*data-emcanvas-hide-on-tablet="true")(?=[^>]*data-emcanvas-hide-on-mobile="true")(?![^>]*\sid=)[^>]*><a(?=[^>]*data-emcanvas-node="hero-button")(?=[^>]*href="\/read-more")[^>]*>Read more<\/a><\/div>/,
      )
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
        expect(
          source,
          `${fileName} should stay blind to concrete node types`,
        ).not.toMatch(pattern)
      }
    }
  })
})
