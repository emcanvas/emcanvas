import { ViewportPanel } from './viewport-panel'

export interface EditorShellProps {
  title: string
}

export function EditorShell({ title }: EditorShellProps) {
  return (
    <main className="emcanvas-editor-shell">
      <h1>{title}</h1>
      <ViewportPanel />
    </main>
  )
}
