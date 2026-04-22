import { Suspense, createElement, lazy, type ComponentType } from 'react'

type LazyPageModule<Props extends object> = {
  default: ComponentType<Props>
}

function createLazyPage<Props extends object>(
  loadPage: () => Promise<LazyPageModule<Props>>,
) {
  const LazyPage = lazy(loadPage)

  return function LazyAdminPage(props: Props) {
    return createElement(
      Suspense,
      { fallback: null },
      createElement(LazyPage, props),
    )
  }
}

const pages = {
  '/dashboard': createLazyPage(() => import('./pages/dashboard-page.js')),
  '/editor': createLazyPage(() => import('./pages/editor-page.js')),
}

export { pages }
