import { describe, expect, it } from 'vitest'
import {
  createFixtureDocument,
  createFixtureHeadingNode,
} from '../fixtures/document-factory'
import {
  REQUIRED_SEED_ENV_VARS,
  SMOKE_SEED_ENTRY_SLUG,
  SMOKE_SEED_ENTRY_TITLE,
  SMOKE_SEED_INITIAL_HEADING,
  buildSmokeSeedDocument,
  buildSmokeSeedEntryPayload,
} from '../../scripts/smoke-seed-local-host.mjs'

describe('docker local host seed flow', () => {
  it('builds the canonical smoke payload from the fixture factories', () => {
    const document = createFixtureDocument()

    document.root.children = [createFixtureHeadingNode('Welcome')]

    expect(buildSmokeSeedDocument()).toEqual(document)
    expect(buildSmokeSeedEntryPayload()).toEqual({
      slug: 'home',
      title: 'Homepage',
      canvasLayout: document,
    })
  })

  it('locks the deterministic seed identifiers and required auth inputs', () => {
    expect(SMOKE_SEED_ENTRY_SLUG).toBe('home')
    expect(SMOKE_SEED_ENTRY_TITLE).toBe('Homepage')
    expect(SMOKE_SEED_INITIAL_HEADING).toBe('Welcome')
    expect(REQUIRED_SEED_ENV_VARS).toEqual([
      'EMDASH_SEED_ENDPOINT',
      'EMDASH_SEED_TOKEN',
    ])
  })
})
