import type { CanvasNode } from '../../foundation/types/canvas'
import type { EditorBreakpoint } from '../state/editor-store'
import { widgetRegistry } from '../registry/widget-registry'
import { PropFieldRenderer } from './prop-field-renderer'
import { StyleEditor } from '../styles/style-editor'

export interface PropertyInspectorProps {
  node?: CanvasNode | null
  hasDocumentContent?: boolean
  breakpoint?: EditorBreakpoint
  basicAddActionPlacement?: 'below' | 'inside'
  containerAddActionPlacement?: 'below' | 'inside'
  columnsAddActionPlacement?: 'below' | 'inside'
  showAddContainerAction?: boolean
  canDeleteNode?: boolean
  onBreakpointChange?: (breakpoint: EditorBreakpoint) => void
  onAddContainer?: () => void
  onAddColumns?: () => void
  onAddHeading?: () => void
  onAddText?: () => void
  onAddButton?: () => void
  onDeleteNode?: () => void
  onUpdateProps?: (patch: Record<string, unknown>) => void
  onUpdateStyles?: (patch: Record<string, unknown>) => void
}

export function PropertyInspector({
  node = null,
  hasDocumentContent = false,
  breakpoint = 'desktop',
  basicAddActionPlacement = 'below',
  containerAddActionPlacement = 'inside',
  columnsAddActionPlacement = 'below',
  showAddContainerAction = false,
  canDeleteNode = true,
  onBreakpointChange = () => undefined,
  onAddContainer = () => undefined,
  onAddColumns = () => undefined,
  onAddHeading = () => undefined,
  onAddText = () => undefined,
  onAddButton = () => undefined,
  onDeleteNode = () => undefined,
  onUpdateProps = () => undefined,
  onUpdateStyles = () => undefined,
}: PropertyInspectorProps) {
  const definition = node ? widgetRegistry.get(node.type) : null
  const basicAddActionSuffix =
    basicAddActionPlacement === 'inside' ? 'inside' : 'below'
  const containerAddActionSuffix =
    containerAddActionPlacement === 'inside' ? 'inside' : 'below'
  const columnsAddActionSuffix =
    columnsAddActionPlacement === 'inside' ? 'inside' : 'below'

  if (!node || !definition) {
    return (
      <form aria-label="Property inspector form">
        <h2>Inspector</h2>
        <p>Select a node to edit its content and styles.</p>
        {hasDocumentContent ? (
          <section aria-label="Quick add actions">
            <button type="button" onClick={onAddColumns}>
              Add columns to page
            </button>
            <button type="button" onClick={onAddHeading}>
              Add heading to page
            </button>
            <button type="button" onClick={onAddText}>
              Add text to page
            </button>
            <button type="button" onClick={onAddButton}>
              Add button to page
            </button>
          </section>
        ) : null}
      </form>
    )
  }

  return (
    <form aria-label="Property inspector form">
      <h2>Inspector</h2>
      <section aria-label="Quick add actions">
        {showAddContainerAction ? (
          <button type="button" onClick={onAddContainer}>
            Add container {containerAddActionSuffix}
          </button>
        ) : null}
        <button type="button" onClick={onAddColumns}>
          Add columns {columnsAddActionSuffix}
        </button>
        <button type="button" onClick={onAddHeading}>
          Add heading {basicAddActionSuffix}
        </button>
        <button type="button" onClick={onAddText}>
          Add text {basicAddActionSuffix}
        </button>
        <button type="button" onClick={onAddButton}>
          Add button {basicAddActionSuffix}
        </button>
        {canDeleteNode ? (
          <button type="button" onClick={onDeleteNode}>
            Delete block
          </button>
        ) : null}
      </section>
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
    </form>
  )
}
