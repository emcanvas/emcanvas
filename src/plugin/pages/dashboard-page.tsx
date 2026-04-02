import { useState } from 'react'
import { EditorApp } from '../../foundation/editor/app'
import { createEditorSession } from '../../foundation/editor/state/editor-session'

export function DashboardPage() {
  const [session] = useState(() => createEditorSession('EmCanvas'))

  return <EditorApp session={session} />
}

export default DashboardPage
