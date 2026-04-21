import { useLayoutEffect, useState, type RefObject } from 'react'

interface SelectionOutline {
  top: number
  left: number
  width: number
  height: number
}

export interface SelectionOutlineLayerProps {
  surfaceRef: RefObject<HTMLElement>
  selectedNodeId?: string | null
  measurementKey?: unknown
}

function getNodeElement(surfaceElement: HTMLElement, selectedNodeId: string) {
  return Array.from(
    surfaceElement.querySelectorAll<HTMLElement>('[data-node-id]'),
  ).find((element) => element.dataset.nodeId === selectedNodeId)
}

export function SelectionOutlineLayer({
  surfaceRef,
  selectedNodeId = null,
  measurementKey,
}: SelectionOutlineLayerProps) {
  const [outline, setOutline] = useState<SelectionOutline | null>(null)

  useLayoutEffect(() => {
    const surfaceElement = surfaceRef.current

    if (surfaceElement === null || selectedNodeId === null) {
      setOutline(null)
      return
    }

    const selectedNodeElement = getNodeElement(surfaceElement, selectedNodeId)

    if (selectedNodeElement === undefined) {
      setOutline(null)
      return
    }

    const surfaceRect = surfaceElement.getBoundingClientRect()
    const selectedRect = selectedNodeElement.getBoundingClientRect()

    if (selectedRect.width <= 0 || selectedRect.height <= 0) {
      setOutline(null)
      return
    }

    setOutline({
      top: selectedRect.top - surfaceRect.top,
      left: selectedRect.left - surfaceRect.left,
      width: selectedRect.width,
      height: selectedRect.height,
    })
  }, [surfaceRef, selectedNodeId, measurementKey])

  return (
    <div
      aria-hidden="true"
      className="emc-selection-outline"
      data-layer="selection-outline"
      hidden={outline === null}
      style={
        outline === null
          ? undefined
          : {
              top: `${outline.top}px`,
              left: `${outline.left}px`,
              width: `${outline.width}px`,
              height: `${outline.height}px`,
            }
      }
    />
  )
}
