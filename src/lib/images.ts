import type { ImageMetadata } from 'astro'
import { toAssetKey } from './asset-path'

const files = import.meta.glob<{ default: ImageMetadata }>('/src/assets/projects/**/*.{png,jpg,jpeg,webp,avif}', {
  eager: true,
})

/** The optimisable image behind a stored project image path, if it exists. */
export function projectImage(path: string | null | undefined): ImageMetadata | undefined {
  return files[toAssetKey(path)]?.default
}
