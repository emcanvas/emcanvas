import { describe, expect, it } from 'vitest'
import { getComponentRenderer, registerRenderer } from '../../../src/renderer/components/registry'

describe('getComponentRenderer', () => {
  it('returns render models with explicit category and tag semantics', () => {
    const model = getComponentRenderer('section')({
      id: 'root',
      type: 'section',
      props: {},
      styles: { desktop: {} },
      children: [],
    })

    expect(model.category).toBe('wrapper')
    expect(model.tag).toBe('section')
  })

  it('returns heading leaf models using tag as the only heading semantic', () => {
    const model = getComponentRenderer('heading')({
      id: 'heading-1',
      type: 'heading',
      props: { text: 'Title', level: 4 },
      styles: { desktop: {} },
      children: [],
    })

    expect(model).toEqual({
      category: 'leaf',
      kind: 'heading',
      tag: 'h4',
      textContent: 'Title',
    })
  })

  it('returns generic leaf render semantics without per-kind template requirements', () => {
    const buttonModel = getComponentRenderer('button')({
      id: 'cta',
      type: 'button',
      props: { label: 'Read more', href: '/read-more' },
      styles: { desktop: {} },
      children: [],
    })

    const imageModel = getComponentRenderer('image')({
      id: 'hero-image',
      type: 'image',
      props: { src: '/hero.png', alt: 'Hero' },
      styles: { desktop: {} },
      children: [],
    })

    const videoModel = getComponentRenderer('video')({
      id: 'hero-video',
      type: 'video',
      props: { src: '/hero.mp4' },
      styles: { desktop: {} },
      children: [],
    })

    expect(buttonModel).toEqual({
      category: 'leaf',
      kind: 'button',
      tag: 'a',
      attributes: {
        href: '/read-more',
      },
      textContent: 'Read more',
    })
    expect(imageModel).toEqual({
      category: 'leaf',
      kind: 'image',
      tag: 'img',
      attributes: {
        src: '/hero.png',
        alt: 'Hero',
      },
      isVoid: true,
    })
    expect(videoModel).toEqual({
      category: 'leaf',
      kind: 'video',
      tag: 'video',
      attributes: {
        src: '/hero.mp4',
        controls: true,
      },
    })
  })

  it('throws for unsupported node types', () => {
    expect(() => getComponentRenderer('carousel')).toThrowError("Unsupported canvas node type: carousel")
  })

  it('returns the exact explicitly registered renderer', () => {
    const type = 'custom-test-renderer'
    const node = {
      id: 'custom-node',
      type,
      props: {},
      styles: { desktop: {} },
      children: [],
    }
    const renderer = () => ({ category: 'leaf' as const, kind: 'text' as const, tag: 'p' as const, text: 'custom' })
    const unregister = registerRenderer(type, renderer)

    try {
      expect(getComponentRenderer(type)).toBe(renderer)
      expect(getComponentRenderer(type)(node)).toEqual({ category: 'leaf', kind: 'text', tag: 'p', text: 'custom' })
    } finally {
      unregister()
    }
  })

  it('rejects duplicate renderer registrations for the same type', () => {
    expect(() =>
      registerRenderer('section', () => ({ category: 'wrapper', kind: 'section', tag: 'section' })),
    ).toThrowError('Renderer already registered for type: section')
  })
})
