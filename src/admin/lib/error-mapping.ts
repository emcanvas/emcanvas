export function mapPluginApiError(error: unknown) {
  if (error instanceof Error && error.message.length > 0) {
    return error.message
  }

  return 'Unable to complete the EmCanvas request'
}
