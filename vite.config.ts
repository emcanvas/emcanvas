import { getViteConfig } from 'astro/config'

export default getViteConfig({
  test: {
    alias: {
      tsup: './tests/stubs/tsup.ts',
    },
    environment: 'jsdom',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    setupFiles: ['./tests/setup.ts'],
  },
})
