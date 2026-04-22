import manifest from '../manifest.js'

export const EMDASH_ADMIN_BASE_PATH = '/_emdash/admin'
export const EMCANVAS_EDITOR_PAGE_PATH = '/editor'

const adminPages = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'layout-dashboard',
  },
  {
    path: EMCANVAS_EDITOR_PAGE_PATH,
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
