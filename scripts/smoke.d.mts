export const DOCKER_LOCAL_HOST_BOOTSTRAP_COMMAND: string
export const SMOKE_PREFLIGHT_TEST_PATH: string
export const MANUAL_SMOKE_DOC_PATHS: string[]
export const smokeSummaryLines: string[]

export function getMissingSmokeDocs(docPaths?: string[]): string[]
export function runSmokePreflight(): number
