import type { WidgetDefinition } from './widget-definition'
import { buttonWidget } from './widgets/button'
import { columnsWidget } from './widgets/columns'
import { containerWidget } from './widgets/container'
import { dividerWidget } from './widgets/divider'
import { headingWidget } from './widgets/heading'
import { imageWidget } from './widgets/image'
import { sectionWidget } from './widgets/section'
import { spacerWidget } from './widgets/spacer'
import { textWidget } from './widgets/text'
import { videoWidget } from './widgets/video'

const widgetDefinitions: WidgetDefinition[] = [
  sectionWidget,
  columnsWidget,
  containerWidget,
  headingWidget,
  textWidget,
  buttonWidget,
  spacerWidget,
  dividerWidget,
  imageWidget,
  videoWidget,
]

export const widgetRegistry = new Map(
  widgetDefinitions.map((definition) => [definition.type, definition]),
)
