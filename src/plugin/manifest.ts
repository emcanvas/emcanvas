const plugin = {
  id: 'emcanvas',
  name: 'EmCanvas',
  version: '0.1.0',
  capabilities: ['read:content', 'write:content', 'page:inject'],
  adminPages: [
    { path: '/', label: 'EmCanvas' },
    { path: '/editor', label: 'Editor' },
  ],
  routes: {},
}

export default plugin
