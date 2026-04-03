import { describe, expect, it } from 'vitest'

import { pluginApi } from '../../src/admin/lib/plugin-api'
import { routeAdapters } from '../../src/plugin/runtime/route-adapters'

describe('plugin api', () => {
  it('uses host-compatible route wrappers', async () => {
    expect(pluginApi.loadDocument).toBe(routeAdapters.loadDocument)
    expect(pluginApi.saveDocument).toBe(routeAdapters.saveDocument)
    expect(pluginApi.getPreviewLink).toBe(routeAdapters.getPreviewLink)
  })
})
