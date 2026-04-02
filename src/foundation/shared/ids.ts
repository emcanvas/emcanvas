let nextNodeId = 1

export function createNodeId(prefix = 'node'): string {
  const id = `${prefix}-${nextNodeId}`
  nextNodeId += 1
  return id
}
