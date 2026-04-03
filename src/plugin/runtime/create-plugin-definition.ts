import { pages as adminPages } from '../admin-entry'

import { createRuntimePluginDefinition } from './create-runtime-plugin-definition'

export function createPluginDefinition() {
  return {
    ...createRuntimePluginDefinition(),
    adminPages,
  }
}
