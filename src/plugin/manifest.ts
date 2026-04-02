import { getCanvasData } from './routes/get-canvas-data'
import { pageFragments } from './hooks/page-fragments'
import { getPageMetadata } from './hooks/page-metadata'
import { getEntryEditorActions } from './hooks/entry-editor-actions'
import { getPreviewLink } from './routes/preview-link'
import { saveCanvasData } from './routes/save-canvas-data'

const plugin = {
  id: 'emcanvas',
  name: 'EmCanvas',
  version: '0.1.0',
  capabilities: ['read:content', 'write:content', 'page:inject'],
  adminPages: [
    { path: '/', label: 'EmCanvas' },
    { path: '/editor', label: 'Editor' },
  ],
  hooks: {
    entryEditorActions: getEntryEditorActions,
    pageFragments,
    pageMetadata: getPageMetadata,
  },
  routes: {
    getCanvasData,
    getPreviewLink,
    saveCanvasData,
  },
}

export default plugin
