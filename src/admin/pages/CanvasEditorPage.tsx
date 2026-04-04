import { useEffect, useState } from 'react'
import { createDefaultCanvasDocument } from '../../foundation/model/document-factory'
import type { CanvasDocument } from '../../foundation/types/canvas'
import type { CanvasEntry } from '../../shared/types/canvas-entry'
import { validateCanvasDocument } from '../../shared/validation/canvas-document'
import { PreviewActions } from '../components/PreviewActions'
import { SaveStatus, type SaveState } from '../components/SaveStatus'
import { TakeoverBanner } from '../components/TakeoverBanner'
import { mapPluginApiError } from '../lib/error-mapping'
import { pluginApi, type PluginApi } from '../lib/plugin-api'
import { EditorShell, type EditorShellInstance } from '../../editor/shell/editor-shell'

export interface CanvasEditorPageProps {
  entry: CanvasEntry
  api?: PluginApi
  previewOrigin?: string
  onEditorReady?: (instance: EditorShellInstance) => void
}

export function CanvasEditorPage({
  entry,
  api = pluginApi,
  previewOrigin,
  onEditorReady,
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

        setCanvasLayout(validateCanvasDocument(result.canvasLayout).document ?? createDefaultCanvasDocument())
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
    <main aria-labelledby="emcanvas-editor-title">
      <h1 id="emcanvas-editor-title">EmCanvas editor</h1>
      <TakeoverBanner enabled={takeoverEnabled} />
      <SaveStatus state={saveState} message={message} />
      <PreviewActions previewUrl={previewUrl} onPublish={handlePublish} />
      <section aria-label="Canvas editor workspace">
        <EditorShell
          initialDocument={canvasLayout}
          onDocumentChange={setCanvasLayout}
          onEditorReady={onEditorReady}
        />
      </section>
    </main>
  )
}

export default CanvasEditorPage
