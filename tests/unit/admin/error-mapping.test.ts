import { describe, expect, it } from 'vitest'

import { mapPluginApiError } from '../../../src/admin/lib/error-mapping'

describe('mapPluginApiError', () => {
  it('returns the message from a non-empty Error instance', () => {
    expect(mapPluginApiError(new Error('Request failed'))).toBe('Request failed')
  })

  it('falls back to the default message for empty or unknown errors', () => {
    expect(mapPluginApiError(new Error(''))).toBe('Unable to complete the EmCanvas request')
    expect(mapPluginApiError('Request failed')).toBe('Unable to complete the EmCanvas request')
    expect(mapPluginApiError(null)).toBe('Unable to complete the EmCanvas request')
  })
})
