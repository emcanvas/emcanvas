import descriptor from './descriptor'
import manifest from './manifest'

import { createPluginDefinition } from './runtime/create-plugin-definition'

const plugin = createPluginDefinition()

export { descriptor, manifest }
export default plugin
