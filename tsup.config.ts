import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    index: 'src/plugin/index.ts',
    'sandbox-entry': 'src/plugin/sandbox-entry.ts',
    admin: 'src/plugin/admin-entry.ts',
    astro: 'src/plugin/astro-entry.ts',
  },
  format: ['esm'],
  outDir: 'dist',
  splitting: false,
  sourcemap: true,
  clean: true,
})
