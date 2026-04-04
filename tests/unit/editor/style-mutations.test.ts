import { describe, expect, it } from 'vitest'

import type { ResponsiveStyles } from '../../../src/foundation/types/canvas'
import { getBreakpointStyles, updateResponsiveStyles } from '../../../src/editor/styles/style-mutations'

describe('style-mutations', () => {
  it('returns breakpoint styles or an empty object when the breakpoint is missing', () => {
    const styles: ResponsiveStyles = {
      desktop: { color: 'red' },
    }

    expect(getBreakpointStyles(styles, 'desktop')).toEqual({ color: 'red' })
    expect(getBreakpointStyles(styles, 'tablet')).toEqual({})
  })

  it('merges a patch into one breakpoint without mutating the original styles', () => {
    const styles: ResponsiveStyles = {
      desktop: { color: 'red' },
      tablet: { width: '50%' },
      mobile: { fontSize: '12px' },
    }

    const result = updateResponsiveStyles(styles, 'tablet', {
      color: 'blue',
      width: '75%',
    })

    expect(result).toEqual({
      desktop: { color: 'red' },
      tablet: { width: '75%', color: 'blue' },
      mobile: { fontSize: '12px' },
    })
    expect(result).not.toBe(styles)
    expect(result.tablet).not.toBe(styles.tablet)
    expect(result.desktop).toBe(styles.desktop)
    expect(result.mobile).toBe(styles.mobile)
    expect(styles).toEqual({
      desktop: { color: 'red' },
      tablet: { width: '50%' },
      mobile: { fontSize: '12px' },
    })
  })
})
