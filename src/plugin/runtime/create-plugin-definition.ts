import { pages as adminPages } from '@emcanvas/plugin/admin-entry'

import { createRuntimePluginDefinition } from '@emcanvas/plugin/runtime/create-runtime-plugin-definition'

export function createPluginDefinition() {
  return {
    ...createRuntimePluginDefinition(),
    adminPages,
  }
}
