import type { CanvasNode } from '../../foundation/types/canvas'
import { widgetRegistry } from '../registry/widget-registry'
import { validateInsertChildNode } from './document-validation'

export function validateInsertChildNodeWithWidgetRegistry(
  parent: CanvasNode,
  child: CanvasNode,
  root: CanvasNode,
): void {
  validateInsertChildNode(parent, child, root, widgetRegistry)
}
