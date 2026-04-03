import descriptor from './descriptor'
import manifest from './manifest'

import { createRuntimePluginDefinition } from './runtime/create-runtime-plugin-definition'

const plugin = createRuntimePluginDefinition()

export { descriptor, manifest }
export default plugin
