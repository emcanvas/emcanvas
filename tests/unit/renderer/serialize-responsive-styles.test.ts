import { describe, expect, it } from 'vitest'
import { serializeResponsiveStyles } from '../../../src/renderer/styles/serialize-responsive-styles'

describe('serializeResponsiveStyles', () => {
  it('serializes desktop styles to inline CSS and responsive overrides to media rules', () => {
    const serialized = serializeResponsiveStyles('hero', {
      desktop: {
        color: 'red',
        backgroundColor: '#111111',
        ignored: 42,
      },
      tablet: {
        width: '80%',
      },
      mobile: {
        fontSize: '14px',
      },
    })

    expect(serialized.inlineStyle).toBe('color:red;background-color:#111111')
    expect(serialized.mediaRules).toEqual([
      '@media (max-width: 1024px){[data-emcanvas-node="hero"]{width:80%;}}',
      '@media (max-width: 767px){[data-emcanvas-node="hero"]{font-size:14px;}}',
    ])
  })

  it('omits empty breakpoints and empty style declarations', () => {
    const serialized = serializeResponsiveStyles('content', {
      desktop: {
        color: '',
      },
      tablet: {},
      mobile: {
        margin: '0 auto',
      },
    })

    expect(serialized.inlineStyle).toBe('')
    expect(serialized.mediaRules).toEqual([
      '@media (max-width: 767px){[data-emcanvas-node="content"]{margin:0 auto;}}',
    ])
  })
})
