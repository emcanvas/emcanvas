import { useEffect, useState } from 'react'
import { createDefaultCanvasDocument } from '../../foundation/model/document-factory'
import type { CanvasDocument } from '../../foundation/types/canvas'
import type { CanvasEntry } from '../../shared/types/canvas-entry'
import { EditorPage } from '../../plugin/pages/editor-page'
import { PreviewActions } from '../components/PreviewActions'
import { SaveStatus, type SaveState } from '../components/SaveStatus'
import { TakeoverBanner } from '../components/TakeoverBanner'
import { mapPluginApiError } from '../lib/error-mapping'
import { pluginApi, type PluginApi } from '../lib/plugin-api'

export interface CanvasEditorPageProps {
  entry: CanvasEntry
  api?: PluginApi
  previewOrigin?: string
}

export function CanvasEditorPage({
  entry,
  api = pluginApi,
  previewOrigin,
}: CanvasEditorPageProps) {
  const [canvasLayout, setCanvasLayout] = useState<CanvasDocument>(() => createDefaultCanvasDocument())
  const [takeoverEnabled, setTakeoverEnabled] = useState(false)
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [message, setMessage] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    void api
      .loadDocument(entry)
      .then((result) => {
        if (!active) {
          return
        }

        setCanvasLayout(result.canvasLayout)
        setTakeoverEnabled(result._emcanvas.enabled)
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
  }, [api, entry])

  async function handlePublish() {
    setSaveState('saving')
    setMessage(null)

    try {
      await api.saveDocument({ entry, canvasLayout })
      setTakeoverEnabled(true)
      setSaveState('saved')
    } catch (error) {
      setSaveState('error')
      setMessage(mapPluginApiError(error))
    }
  }

  const previewUrl = api.getPreviewLink({ entry, origin: previewOrigin })

  return (
    <main>
      <TakeoverBanner enabled={takeoverEnabled} />
      <SaveStatus state={saveState} message={message} />
      <PreviewActions previewUrl={previewUrl} onPublish={handlePublish} />
      <EditorPage />
    </main>
  )
}

export default CanvasEditorPage
