import { useState } from 'react'
import '../../styles/editor.css'
import type { EditorSession } from './state/editor-session'
import { createEditorSession } from './state/editor-session'
import { EditorShell } from './shell/editor-shell'

export interface EditorAppProps {
  session?: EditorSession
}

export function EditorApp({ session }: EditorAppProps) {
  const [stableSession] = useState(() => session ?? createEditorSession())

  return <EditorShell title={stableSession.title} />
}
