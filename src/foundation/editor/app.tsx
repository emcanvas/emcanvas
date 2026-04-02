import '../../styles/editor.css'
import type { EditorSession } from './state/editor-session'
import { createEditorSession } from './state/editor-session'
import { EditorShell } from './shell/editor-shell'

export interface EditorAppProps {
  session?: EditorSession
}

export function EditorApp({ session = createEditorSession() }: EditorAppProps) {
  return <EditorShell title={session.title} />
}
