import manifest from '../manifest.js'

const adminPages = [
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
] as const

export function createPluginAdminContract() {
  return {
    entry: `${manifest.id}/admin`,
    pages: [...adminPages],
    widgets: [],
  }
}

export function createDescriptorAdminPages() {
  return [...adminPages]
}
