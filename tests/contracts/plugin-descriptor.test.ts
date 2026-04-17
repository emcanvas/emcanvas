import { describe, expect, it } from 'vitest'

import pkg from '../../package.json'
import descriptor from '../../src/plugin/descriptor'

const packageJson = pkg as {
  name?: string
  version?: string
}

describe('plugin descriptor', () => {
  it('matches emdash loader expectations', () => {
    expect(descriptor).toEqual({
      id: packageJson.name,
      version: packageJson.version,
      entrypoint: packageJson.name,
      format: 'module',
      adminEntry: `${packageJson.name}/admin`,
      componentsEntry: `${packageJson.name}/astro`,
      adminPages: [
        {
          path: '/dashboard',
          label: 'Dashboard',
          icon: 'layout-dashboard',
        },
        {
          path: '/editor',
          label: 'Editor',
          icon: 'pen-square',
        },
      ],
    })
  })
})
