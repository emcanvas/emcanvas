import { describe, expect, it } from 'vitest'

import { buildInlineStyle } from '../../../src/renderer/styles/build-inline-style'

describe('buildInlineStyle', () => {
  it('serializes safe string declarations and ignores unsupported entries', () => {
    expect(
      buildInlineStyle({
        color: 'red',
        backgroundColor: '#111111',
        opacity: 0.5,
        'fontSize;background:url(javascript:alert(1))': '16px',
      }),
    ).toBe('color:red;background-color:#111111')
  })

  it('sanitizes unsafe characters and omits declarations that become empty', () => {
    expect(
      buildInlineStyle({
        backgroundImage: 'url(/hero.png" onerror="alert(1))',
        color: '}</style><script>alert(1)</script>',
        width: '   ',
      }),
    ).toBe('background-image:url(/hero.png onerror=alert(1));color:/stylescriptalert(1)/script')
  })
})
