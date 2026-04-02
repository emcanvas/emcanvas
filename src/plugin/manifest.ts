import { getCanvasData } from './routes/get-canvas-data'
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
  routes: {
    getCanvasData,
    saveCanvasData,
  },
}

export default plugin
