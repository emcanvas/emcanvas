import manifest from '../manifest'

import { createDescriptorAdminPages } from './plugin-admin-contract.js'

export function createPluginDescriptor() {
  const packageName = manifest.id

  return {
    id: manifest.id,
    version: manifest.version,
    entrypoint: packageName,
    format: 'native',
    adminEntry: `${packageName}/admin`,
    componentsEntry: `${packageName}/astro`,
    adminPages: createDescriptorAdminPages(),
  } as const
}
