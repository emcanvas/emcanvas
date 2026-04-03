export function createPluginDescriptor() {
  return {
    entrypoint: './src/plugin/index.ts',
    format: 'module',
    sandbox: './src/plugin/sandbox-entry.ts',
  }
}
