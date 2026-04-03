import descriptor from './descriptor'
import manifest from './manifest'

import { createPluginDefinition } from './runtime/create-plugin-definition'

const { adminPages: _adminPages, ...plugin } = createPluginDefinition()

export { descriptor, manifest }
export default plugin
