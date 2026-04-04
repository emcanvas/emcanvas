import { getViteConfig } from 'astro/config'
import { fileURLToPath } from 'node:url'

export default getViteConfig({
  resolve: {
    alias: {
      '@emcanvas/foundation': fileURLToPath(
        new URL('./src/foundation', import.meta.url),
      ),
      '@emcanvas/editor': fileURLToPath(new URL('./src/editor', import.meta.url)),
      '@emcanvas/renderer': fileURLToPath(
        new URL('./src/renderer', import.meta.url),
      ),
      '@emcanvas/plugin': fileURLToPath(new URL('./src/plugin', import.meta.url)),
    },
  },
  test: {
    alias: {
      tsup: './tests/stubs/tsup.ts',
    },
    environment: 'jsdom',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    setupFiles: ['./tests/setup.ts'],
  },
})
