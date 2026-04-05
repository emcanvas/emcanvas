import { getViteConfig } from 'astro/config'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const ASTRO_TEST_SRC_DIR = './tests/fixtures/astro-src'
export const ASTRO_TEST_INLINE_CONFIG = {
  root: '.',
  srcDir: ASTRO_TEST_SRC_DIR,
}

export const VITE_CONFIG_SOURCE_PATH = fileURLToPath(
  new URL('./vite.config.ts', import.meta.url),
)

export const EMCANVAS_VITE_ALIASES = {
  '@emcanvas/admin': fileURLToPath(new URL('./src/admin', import.meta.url)),
  '@emcanvas/foundation': fileURLToPath(
    new URL('./src/foundation', import.meta.url),
  ),
  '@emcanvas/editor': fileURLToPath(new URL('./src/editor', import.meta.url)),
  '@emcanvas/renderer': fileURLToPath(
    new URL('./src/renderer', import.meta.url),
  ),
  '@emcanvas/plugin': fileURLToPath(new URL('./src/plugin', import.meta.url)),
}

export function readViteConfigSource(filePath = VITE_CONFIG_SOURCE_PATH) {
  try {
    return readFileSync(filePath, 'utf8')
  } catch {
    throw new Error(`Unable to read Vite config source at ${filePath}`)
  }
}

export default getViteConfig(
  {
    resolve: {
      alias: EMCANVAS_VITE_ALIASES,
    },
    test: {
      alias: {
        tsup: './tests/stubs/tsup.ts',
      },
      environment: 'jsdom',
      include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
      setupFiles: ['./tests/setup.ts'],
    },
  },
  ASTRO_TEST_INLINE_CONFIG,
)
