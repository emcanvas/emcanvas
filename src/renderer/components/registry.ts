type AstroComponent = (...args: never[]) => unknown

import { normalizeButtonHref } from '../../foundation/shared/button-href'

type ComponentProps = Record<string, unknown>

type AstroComponentModule = {
  default: AstroComponent
}

type ImportMetaWithGlob = ImportMeta & {
  glob: <T>(pattern: string, options: { eager: true }) => Record<string, T>
}

const componentModules = (
  import.meta as ImportMetaWithGlob
).glob<AstroComponentModule>('./astro/*.astro', {
  eager: true,
})

const components: Record<string, AstroComponent | undefined> = {
  section: componentModules['./astro/Section.astro']?.default,
  columns: componentModules['./astro/Columns.astro']?.default,
  container: componentModules['./astro/Container.astro']?.default,
  heading: componentModules['./astro/Heading.astro']?.default,
  hero: componentModules['./astro/Hero.astro']?.default,
  'features/cards': componentModules['./astro/FeaturesCards.astro']?.default,
  text: componentModules['./astro/Text.astro']?.default,
  button: componentModules['./astro/Button.astro']?.default,
  image: componentModules['./astro/Image.astro']?.default,
  video: componentModules['./astro/Video.astro']?.default,
  spacer: componentModules['./astro/Spacer.astro']?.default,
  divider: componentModules['./astro/Divider.astro']?.default,
}

const componentPropsMappers: Record<
  string,
  ((props: ComponentProps) => ComponentProps) | undefined
> = {
  heading: (props) => ({
    text: typeof props.text === 'string' ? props.text : '',
    level:
      props.level === 1 ||
      props.level === 2 ||
      props.level === 3 ||
      props.level === 4 ||
      props.level === 5 ||
      props.level === 6
        ? props.level
        : 2,
  }),
  hero: (props) => ({
    title: typeof props.title === 'string' ? props.title : '',
    body: typeof props.body === 'string' ? props.body : '',
    ctaLabel: typeof props.ctaLabel === 'string' ? props.ctaLabel : '',
    ctaHref: normalizeButtonHref(props.ctaHref),
    imageSrc: typeof props.imageSrc === 'string' ? props.imageSrc : '',
    imageAlt: typeof props.imageAlt === 'string' ? props.imageAlt : '',
  }),
  'features/cards': (props) => ({
    title: typeof props.title === 'string' ? props.title : '',
    intro: typeof props.intro === 'string' ? props.intro : '',
    card1Title: typeof props.card1Title === 'string' ? props.card1Title : '',
    card1Body: typeof props.card1Body === 'string' ? props.card1Body : '',
    card2Title: typeof props.card2Title === 'string' ? props.card2Title : '',
    card2Body: typeof props.card2Body === 'string' ? props.card2Body : '',
    card3Title: typeof props.card3Title === 'string' ? props.card3Title : '',
    card3Body: typeof props.card3Body === 'string' ? props.card3Body : '',
  }),
  text: (props) => ({
    text: typeof props.text === 'string' ? props.text : '',
  }),
  button: (props) => ({
    href: normalizeButtonHref(props.href),
    label:
      typeof props.label === 'string'
        ? props.label
        : typeof props.text === 'string'
          ? props.text
          : '',
  }),
  image: (props) => ({
    src: typeof props.src === 'string' ? props.src : '',
    alt: typeof props.alt === 'string' ? props.alt : '',
  }),
  video: (props) => ({
    src: typeof props.src === 'string' ? props.src : '',
  }),
}

export function getAstroComponent(type: string): AstroComponent {
  const component = components[type]

  if (!component) {
    throw new Error(`Unsupported canvas node type: ${type}`)
  }

  return component
}

export function getAstroComponentProps(
  type: string,
  props: ComponentProps,
): ComponentProps {
  return componentPropsMappers[type]?.(props) ?? {}
}
