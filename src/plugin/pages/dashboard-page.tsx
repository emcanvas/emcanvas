import { EditorApp } from '../../foundation/editor/app'
import { createEditorSession } from '../../foundation/editor/state/editor-session'

export function DashboardPage() {
  return <EditorApp session={createEditorSession('EmCanvas')} />
}

export default DashboardPage
