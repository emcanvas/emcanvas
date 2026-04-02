import type { CanvasNode } from '../../foundation/types/canvas'
import type { EditorBreakpoint } from '../state/editor-store'
import { widgetRegistry } from '../registry/widget-registry'
import { PropFieldRenderer } from './prop-field-renderer'
import { StyleEditor } from '../styles/style-editor'

export interface PropertyInspectorProps {
  node?: CanvasNode | null
  breakpoint?: EditorBreakpoint
  onBreakpointChange?: (breakpoint: EditorBreakpoint) => void
  onUpdateProps?: (patch: Record<string, unknown>) => void
  onUpdateStyles?: (patch: Record<string, unknown>) => void
}

export function PropertyInspector({
  node = null,
  breakpoint = 'desktop',
  onBreakpointChange = () => undefined,
  onUpdateProps = () => undefined,
  onUpdateStyles = () => undefined,
}: PropertyInspectorProps) {
  const definition = node ? widgetRegistry.get(node.type) : null

  return (
    <form aria-label="Property inspector form">
      <h2>Inspector</h2>
      {!node || !definition ? <p>Select a node to edit its content and styles.</p> : null}
      {definition ? (
        <>
          <section aria-label="Property fields">
            <h3>{definition.label}</h3>
            {definition.propSchema.map((field) => (
              <PropFieldRenderer
                key={field.key}
                field={field}
                value={node.props[field.key]}
                onChange={(value) => onUpdateProps({ [field.key]: value })}
              />
            ))}
          </section>
          <StyleEditor
            styles={node.styles}
            breakpoint={breakpoint}
            onBreakpointChange={onBreakpointChange}
            onChange={onUpdateStyles}
          />
        </>
      ) : null}
    </form>
  )
}
