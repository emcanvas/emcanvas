import { describe, expect, it } from 'vitest'

import { buildRendererStylesheet } from '../../../src/renderer/styles/build-renderer-stylesheet'

describe('buildRendererStylesheet', () => {
  it('builds one scoped stylesheet for desktop and responsive node styles', () => {
    const stylesheet = buildRendererStylesheet({
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
    })

    expect(stylesheet.startsWith('[data-emcanvas-root]{width:100%;}')).toBe(
      true,
    )
    expect(stylesheet).toContain('[data-emcanvas-node="root"]{padding:24px;}')
    expect(stylesheet).toContain(
      '[data-emcanvas-node="hero-columns"]{gap:16px;}',
    )
    expect(stylesheet).toContain(
      '[data-emcanvas-node="hero-copy"]{max-width:640px;}',
    )
    expect(stylesheet).toContain(
      '@media (max-width: 1024px){[data-emcanvas-node="hero-copy"]{max-width:100%;}}',
    )
    expect(stylesheet).toContain(
      '@media (max-width: 767px){[data-emcanvas-node="root"]{padding:12px;}}',
    )
    expect(stylesheet).toContain(
      '@media (max-width: 767px){[data-emcanvas-node="hero-columns"]{gap:8px;}}',
    )
  })

  it('sanitizes selector-sensitive node ids for both wrapped and direct widgets', () => {
    expect(
      buildRendererStylesheet({
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
            props: {},
            styles: {
              desktop: {
                color: 'red',
              },
            },
            children: [],
          },
          {
            id: 'media/video?primary=true',
            type: 'video',
            props: {},
            styles: {
              desktop: {
                width: '100%',
              },
            },
            children: [],
          },
        ],
      }),
    ).toContain(
      '[data-emcanvas-node="hero_button___color_red_body_display_block___"]{color:red;}',
    )

    expect(
      buildRendererStylesheet({
        id: 'root',
        type: 'section',
        props: {},
        styles: {
          desktop: {},
        },
        children: [
          {
            id: 'media/video?primary=true',
            type: 'video',
            props: {},
            styles: {
              desktop: {
                width: '100%',
              },
            },
            children: [],
          },
        ],
      }),
    ).toContain('[data-emcanvas-node="media_video_primary_true"]{width:100%;}')
  })

  it('omits document stylesheet payload when no node has renderer-managed styles', () => {
    expect(
      buildRendererStylesheet({
        id: 'root',
        type: 'section',
        props: {},
        styles: { desktop: {} },
        children: [
          {
            id: 'hero-copy',
            type: 'container',
            props: {},
            styles: { desktop: {}, tablet: {}, mobile: {} },
            children: [],
          },
        ],
      }),
    ).toBe('')
  })
})
