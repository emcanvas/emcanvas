import type { PersistencePort } from '../../editor/persistence/persistence-port'
import { loadCanvasDocumentState } from '../../shared/persistence/canvas-document-entry'
import type { CanvasEntry } from '../../shared/types/canvas-entry'
import { routeAdapters } from '../../plugin/runtime/route-adapters'

interface EmDashContentItem {
  id: string
  type: string
  data: Record<string, unknown>
}

interface EmDashContentResponse {
  data?: {
    item?: EmDashContentItem
    _rev?: string
  }
  error?: {
    message?: string
  }
}

const EMDASH_CONTENT_API_BASE_PATH = '/_emdash/api/content'
const DEFAULT_EMDASH_CONTENT_COLLECTION = 'pages'

function hasEntryId(entry: CanvasEntry) {
  return typeof entry.data.id === 'string' && entry.data.id.length > 0
}

function resolveContentCollection(entry: CanvasEntry) {
  if (
    typeof entry.data.collection === 'string' &&
    entry.data.collection.length > 0
  ) {
    return entry.data.collection
  }

  if (typeof entry.data.type === 'string' && entry.data.type.length > 0) {
    return entry.data.type
  }

  return DEFAULT_EMDASH_CONTENT_COLLECTION
}

function buildContentUrl(entry: CanvasEntry) {
  const collection = encodeURIComponent(resolveContentCollection(entry))
  const id = encodeURIComponent(String(entry.data.id))

  return `${EMDASH_CONTENT_API_BASE_PATH}/${collection}/${id}`
}

async function parseResponse(
  response: Response,
  options: { requireItemData?: boolean } = {},
) {
  const body = (await response.json()) as EmDashContentResponse

  if (!response.ok) {
    throw new Error(
      body.error?.message ?? `EmDash request failed (${response.status})`,
    )
  }

  const item = body.data?.item

  if (!item) {
    throw new Error('EmDash content API returned an invalid item payload')
  }

  if (
    options.requireItemData !== false &&
    (typeof item.data !== 'object' || item.data === null)
  ) {
    throw new Error('EmDash content API returned an invalid item payload')
  }

  return {
    item,
    _rev: body.data?._rev,
  }
}

async function fetchEntry(entry: CanvasEntry) {
  if (!hasEntryId(entry)) {
    throw new Error(
      'EmCanvas needs a persisted entry id to use the EmDash content API',
    )
  }

  const response = await fetch(buildContentUrl(entry), {
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  })

  return parseResponse(response)
}

export function canUseEmDashContentApi(entry: CanvasEntry) {
  return (
    typeof window !== 'undefined' &&
    typeof fetch === 'function' &&
    window.location.pathname.startsWith('/_emdash/admin/plugins/') &&
    hasEntryId(entry)
  )
}

export const emdashContentApi: PersistencePort = {
  async loadDocument({ entry }) {
    const { item } = await fetchEntry(entry)

    return loadCanvasDocumentState(item.data)
  },
  async saveDocument({ entry, payload }) {
    const { item, _rev } = await fetchEntry(entry)
    const nextData = {
      ...item.data,
      ...payload,
    }

    await parseResponse(
      await fetch(buildContentUrl(entry), {
        method: 'PUT',
        credentials: 'same-origin',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: nextData,
          ...(_rev ? { _rev } : {}),
        }),
      }),
      { requireItemData: false },
    )

    await parseResponse(
      await fetch(`${buildContentUrl(entry)}/publish`, {
        method: 'POST',
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      }),
      { requireItemData: false },
    )

    entry.data = nextData

    return nextData
  },
  getPreviewLink: routeAdapters.getPreviewLink,
}
