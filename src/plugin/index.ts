import descriptor from './descriptor'
import manifest from './manifest'

import { createRuntimePluginDefinition } from './runtime/create-runtime-plugin-definition'

function createPlugin() {
  return createRuntimePluginDefinition()
}

const plugin = createPlugin()

export { createPlugin, descriptor, manifest }
export default plugin
