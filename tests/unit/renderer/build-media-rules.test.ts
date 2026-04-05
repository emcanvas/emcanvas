import { describe, expect, it } from 'vitest'

import { buildMediaRules } from '../../../src/renderer/styles/build-media-rules'

describe('buildMediaRules', () => {
  it('builds tablet and mobile rules only for breakpoints with declarations', () => {
    expect(
      buildMediaRules('hero', {
        desktop: { color: 'red' },
        tablet: { width: '80%' },
        mobile: { fontSize: '14px' },
      }),
    ).toEqual([
      '@media (max-width: 1024px){[data-emcanvas-node="hero"]{width:80%;}}',
      '@media (max-width: 767px){[data-emcanvas-node="hero"]{font-size:14px;}}',
    ])
  })

  it('omits desktop declarations from responsive-only media rules', () => {
    expect(
      buildMediaRules('hero', {
        desktop: { color: 'red' },
        tablet: {},
        mobile: {},
      }),
    ).toEqual([])
  })

  it('sanitizes the selector value and skips empty responsive styles', () => {
    expect(
      buildMediaRules('hero"]{color:red}body{display:block}/*', {
        desktop: {},
        tablet: {},
        mobile: {
          color: 'red;}</style><script>alert(1)</script>',
        },
      }),
    ).toEqual([
      '@media (max-width: 767px){[data-emcanvas-node="hero___color_red_body_display_block___"]{color:red/stylescriptalert(1)/script;}}',
    ])
  })
})
