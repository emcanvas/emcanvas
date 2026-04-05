type AstroComponent = (...args: never[]) => unknown

type AstroComponentModule = {
  default: AstroComponent
}

type ImportMetaWithGlob = ImportMeta & {
  glob: <T>(pattern: string, options: { eager: true }) => Record<string, T>
}

const componentModules = (import.meta as ImportMetaWithGlob).glob<AstroComponentModule>('./astro/*.astro', {
  eager: true,
})

const components = Object.fromEntries(
  Object.entries(componentModules).map(([path, module]) => {
    const fileName = path.slice(path.lastIndexOf('/') + 1, -'.astro'.length)
    return [fileName, module.default]
  }),
) as Record<string, AstroComponent>

export function getAstroComponent(type: string): AstroComponent {
  const component = components[type]

  if (!component) {
    throw new Error(`Unsupported canvas node type: ${type}`)
  }

  return component
}
