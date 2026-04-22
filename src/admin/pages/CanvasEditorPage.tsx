import { useEffect, useMemo, useRef, useState } from 'react'
import { createDefaultCanvasDocument } from '../../foundation/model/document-factory'
import type { CanvasDocument } from '../../foundation/types/canvas'
import type { CanvasEntry } from '../../shared/types/canvas-entry'
import { PreviewActions } from '../components/PreviewActions'
import { SaveStatus, type SaveState } from '../components/SaveStatus'
import { TakeoverBanner } from '../components/TakeoverBanner'
import { mapPluginApiError } from '../lib/error-mapping'
import { pluginApi, type PluginApi } from '../lib/plugin-api'
import {
  EditorShell,
  type EditorShellInstance,
} from '../../editor/shell/editor-shell'

export interface CanvasEditorPageProps {
  entry?: CanvasEntry
  api?: PluginApi
  previewOrigin?: string
  onEditorReady?: (instance: EditorShellInstance) => void
}

function resolveEntryFromLocation(): CanvasEntry {
  if (typeof window === 'undefined') {
    return { data: {} }
  }

  const search = new URLSearchParams(window.location.search)
  const data: CanvasEntry['data'] = {}

  const id = search.get('id')

  if (id) {
    data.id = id
  }

  const slug = search.get('slug')

  if (slug) {
    data.slug = slug
  }

  const title = search.get('title')

  if (title) {
    data.title = title
  }

  return { data }
}

export function CanvasEditorPage({
  entry,
  api = pluginApi,
  previewOrigin,
  onEditorReady,
}: CanvasEditorPageProps) {
  const resolvedEntry = useMemo(
    () => entry ?? resolveEntryFromLocation(),
    [entry],
  )
  const editorInstanceRef = useRef<EditorShellInstance | null>(null)
  const [initialDocument, setInitialDocument] = useState<CanvasDocument>(() =>
    createDefaultCanvasDocument(),
  )
  const [canvasLayout, setCanvasLayout] = useState<CanvasDocument>(() =>
    createDefaultCanvasDocument(),
  )
  const [hasLoadedDocument, setHasLoadedDocument] = useState(false)
  const [takeoverEnabled, setTakeoverEnabled] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    setHasLoadedDocument(false)

    void api
      .loadDocument(resolvedEntry)
      .then((result) => {
        if (!active) {
          return
        }

        setInitialDocument(result.canvasLayout)
        setCanvasLayout(result.canvasLayout)
        setTakeoverEnabled(result._emcanvas.enabled)
        setHasLoadedDocument(true)
      })
      .catch((error: unknown) => {
        if (!active) {
          return
        }

        setSaveState('error')
        setMessage(mapPluginApiError(error))
      })

    return () => {
      active = false
    }
  }, [api, resolvedEntry])

  async function handlePublish() {
    setSaveState('saving')
    setMessage(null)

    try {
      await api.saveDocument({ entry: resolvedEntry, canvasLayout })
      setInitialDocument(canvasLayout)
      editorInstanceRef.current?.store.resetHistory(canvasLayout)
      editorInstanceRef.current?.store.markClean()
      setTakeoverEnabled(true)
      setSaveState('saved')
    } catch (error) {
      setSaveState('error')
      setMessage(mapPluginApiError(error))
    }
  }

  const previewUrl = api.getPreviewLink({
    entry: resolvedEntry,
    origin: previewOrigin,
  })

  return (
    <main aria-labelledby="emcanvas-editor-title">
      <h1 id="emcanvas-editor-title">EmCanvas editor</h1>
      <TakeoverBanner enabled={takeoverEnabled} />
      <SaveStatus state={saveState} message={message} />
      <PreviewActions previewUrl={previewUrl} onPublish={handlePublish} />
      <section aria-label="Canvas editor workspace">
        {hasLoadedDocument ? (
          <EditorShell
            initialDocument={initialDocument}
            onDocumentChange={setCanvasLayout}
            onEditorReady={(instance) => {
              editorInstanceRef.current = instance
              onEditorReady?.(instance)
            }}
          />
        ) : (
          <p>Loading canvas…</p>
        )}
      </section>
    </main>
  )
}

export default CanvasEditorPage
