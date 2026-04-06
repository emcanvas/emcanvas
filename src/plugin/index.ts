import descriptor from './descriptor'
import manifest from './manifest'

import { createNativeResolvedPlugin } from './runtime/create-native-resolved-plugin'

function createPlugin() {
  return createNativeResolvedPlugin()
}

const plugin = createPlugin()

export { createPlugin, descriptor, manifest }
export default plugin
