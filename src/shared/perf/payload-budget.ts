export const MVP_LAYOUT_PAYLOAD_BUDGET_BYTES = 32 * 1024

export function measurePayloadBytes(value: unknown): number {
  return new TextEncoder().encode(JSON.stringify(value)).length
}

export function isPayloadWithinBudget(
  value: unknown,
  budgetBytes = MVP_LAYOUT_PAYLOAD_BUDGET_BYTES,
): boolean {
  return measurePayloadBytes(value) <= budgetBytes
}
