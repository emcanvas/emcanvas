// @vitest-environment node

import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import tsconfig from '../../tsconfig.json'
import {
  EMCANVAS_VITE_ALIASES,
  readViteConfigSource,
  VITE_CONFIG_SOURCE_PATH,
} from '../../vite.config'

describe('path alias config', () => {
  it('defines the main emcanvas aliases', () => {
    expect(tsconfig.compilerOptions.paths['@emcanvas/admin']).toBeDefined()
    expect(
      tsconfig.compilerOptions.paths['@emcanvas/foundation/*'],
    ).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@emcanvas/editor']).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@emcanvas/editor/*']).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@emcanvas/renderer/*']).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@emcanvas/plugin']).toBeDefined()
    expect(tsconfig.compilerOptions.paths['@emcanvas/plugin/*']).toBeDefined()
  })

  it('keeps the Vite alias map aligned with tsconfig', () => {
    const expectedAliases = Object.fromEntries(
      Object.entries(tsconfig.compilerOptions.paths).map(
        ([alias, [target]]) => [
          alias.replace(/\/\*$/, ''),
          fileURLToPath(
            new URL(`../../${target.replace(/\/\*$/, '')}`, import.meta.url),
          ),
        ],
      ),
    )

    expect(EMCANVAS_VITE_ALIASES).toEqual(expectedAliases)
  })

  it('uses fileURLToPath for portable Vite aliases', () => {
    const viteConfigSource = readViteConfigSource()

    expect(VITE_CONFIG_SOURCE_PATH).toContain('/vite.config.ts')
    expect(viteConfigSource).toContain('fileURLToPath(new URL(')
    expect(viteConfigSource).not.toContain('.pathname')
  })

  it('fails explicitly when the Vite config source cannot be read', () => {
    expect(() =>
      readViteConfigSource(`${VITE_CONFIG_SOURCE_PATH}.missing`),
    ).toThrow(
      `Unable to read Vite config source at ${VITE_CONFIG_SOURCE_PATH}.missing`,
    )
  })
})
