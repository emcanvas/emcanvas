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

const components: Record<string, AstroComponent | undefined> = {
  section: componentModules['./astro/Section.astro']?.default,
  columns: componentModules['./astro/Columns.astro']?.default,
  container: componentModules['./astro/Container.astro']?.default,
  heading: componentModules['./astro/Heading.astro']?.default,
  text: componentModules['./astro/Text.astro']?.default,
  button: componentModules['./astro/Button.astro']?.default,
  image: componentModules['./astro/Image.astro']?.default,
  video: componentModules['./astro/Video.astro']?.default,
  spacer: componentModules['./astro/Spacer.astro']?.default,
  divider: componentModules['./astro/Divider.astro']?.default,
}

export function getAstroComponent(type: string): AstroComponent {
  const component = components[type]

  if (!component) {
    throw new Error(`Unsupported canvas node type: ${type}`)
  }

  return component
}
