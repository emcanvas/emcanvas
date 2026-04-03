import { getEntryEditorActions as entryEditorActions } from '../hooks/entry-editor-actions'
import { pageFragments } from '../hooks/page-fragments'
import { getPageMetadata as pageMetadata } from '../hooks/page-metadata'
import { getCanvasData } from '../routes/get-canvas-data'
import { getPreviewLink as previewLink } from '../routes/preview-link'
import { saveCanvasData } from '../routes/save-canvas-data'

export function createRuntimePluginDefinition() {
  return {
    hooks: {
      'page:fragments': pageFragments,
      'page:metadata': pageMetadata,
      'entry:editor:actions': entryEditorActions,
    },
    routes: {
      'preview-link': previewLink,
      'canvas-data': getCanvasData,
      'save-canvas-data': saveCanvasData,
    },
  }
}
