import { getViteConfig } from 'astro/config'

export default getViteConfig({
  resolve: {
    alias: {
      '@emcanvas/foundation': new URL('./src/foundation', import.meta.url)
        .pathname,
      '@emcanvas/editor': new URL('./src/editor', import.meta.url).pathname,
      '@emcanvas/renderer': new URL('./src/renderer', import.meta.url).pathname,
      '@emcanvas/plugin': new URL('./src/plugin', import.meta.url).pathname,
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
