import manifest from '../manifest'

export function createPluginDescriptor() {
  const packageName = manifest.id

  return {
    id: manifest.id,
    version: manifest.version,
    entrypoint: packageName,
    format: 'module',
    sandbox: `${packageName}/sandbox`,
    adminEntry: `${packageName}/admin`,
    componentsEntry: `${packageName}/astro`,
  } as const
}
