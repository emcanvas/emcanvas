import manifest from './manifest.js'

import { createNativeResolvedPlugin } from './runtime/create-native-resolved-plugin.js'

function createPlugin() {
  return createNativeResolvedPlugin()
}

const plugin = createPlugin()

export { createPlugin, manifest }
export default plugin
