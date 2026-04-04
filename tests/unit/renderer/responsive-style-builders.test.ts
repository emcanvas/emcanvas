import { describe, expect, it } from 'vitest'
import { buildInlineStyle } from '../../../src/renderer/styles/build-inline-style'
import { buildMediaRules } from '../../../src/renderer/styles/build-media-rules'

describe('responsive style serialization responsibilities', () => {
  it('builds desktop declarations as inline CSS only', () => {
    expect(
      buildInlineStyle({
        color: 'red',
        backgroundColor: '#111111',
        ignored: 42,
      }),
    ).toBe('color:red;background-color:#111111')
  })

  it('preserves valid modern CSS values like calc and var while stripping unsafe chars', () => {
    const result = buildInlineStyle({
      width: 'calc(100% - 20px)',
      color: 'var(--brand-color)',
      backgroundImage: 'url(/images/hero.png" onerror="alert(1))',
    })

    expect(result).toContain('width:calc(100% - 20px)')
    expect(result).toContain('color:var(--brand-color)')
    expect(result).toContain('background-image:url(/images/hero.png onerror=alert(1))')
    expect(result).not.toContain('"')
    expect(result).not.toContain('<')
    expect(result).not.toContain('>')
    expect(result).not.toContain('\\')
  })

  it('builds only non-empty responsive overrides as media rules', () => {
    expect(
      buildMediaRules('hero', {
        desktop: {
          color: 'red',
        },
        tablet: {
          width: '80%',
        },
        mobile: {
          fontSize: '14px',
        },
      }),
    ).toEqual([
      '@media (max-width: 1024px){[data-emcanvas-node="hero"]{width:80%;}}',
      '@media (max-width: 767px){[data-emcanvas-node="hero"]{font-size:14px;}}',
    ])
  })

  it('omits empty declarations and sanitizes selector input in media rules', () => {
    const mediaRules = buildMediaRules('hero"]{color:red}body{display:block}/*', {
      desktop: {},
      tablet: {},
      mobile: {
        color: 'red;}</style><script>alert(1)</script>',
        'fontSize;background:url(javascript:alert(1))': '16px',
      },
    })

    expect(buildInlineStyle({ color: '' })).toBe('')
    expect(mediaRules).toHaveLength(1)
    expect(mediaRules[0]).toContain('[data-emcanvas-node="hero___color_red_body_display_block___"]')
    expect(mediaRules[0]).toContain('{color:red')
    expect(mediaRules[0]).not.toContain('</style>')
    expect(mediaRules[0]).not.toContain('<script>')
    expect(mediaRules[0]).not.toContain('font-size;background:url')
  })
})
