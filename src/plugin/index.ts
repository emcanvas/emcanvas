export { default as manifest } from './manifest'
export { default as descriptor } from './descriptor'

import { createPluginDefinition } from './runtime/create-plugin-definition'

const plugin = createPluginDefinition()

export default plugin
