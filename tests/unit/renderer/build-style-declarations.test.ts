import { describe, expect, it } from 'vitest'

import { buildStyleDeclarations } from '../../../src/renderer/styles/build-style-declarations'

describe('buildStyleDeclarations', () => {
  it('serializes safe string declarations and ignores unsupported entries', () => {
    expect(
      buildStyleDeclarations({
        color: 'red',
        backgroundColor: '#111111',
        opacity: 0.5,
        'fontSize;background:url(javascript:alert(1))': '16px',
      }),
    ).toBe('color:red;background-color:#111111')
  })

  it('sanitizes unsafe characters and omits declarations that become empty', () => {
    expect(
      buildStyleDeclarations({
        backgroundImage: 'url(/hero.png" onerror="alert(1))',
        color: '}</style><script>alert(1)</script>',
        width: '   ',
      }),
    ).toBe(
      'background-image:url(/hero.png onerror=alert(1));color:/stylescriptalert(1)/script',
    )
  })

  it('drops undefined and numeric values without breaking adjacent safe declarations', () => {
    expect(
      buildStyleDeclarations({
        color: 'red',
        width: undefined,
        opacity: 0,
        margin: '0',
      }),
    ).toBe('color:red;margin:0')
  })
})
