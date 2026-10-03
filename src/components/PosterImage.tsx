'use client'

import NextImage from 'next/image'
import {Image as SanityImage} from 'next-sanity/image'

import type {Poster} from '@/sanity/queries'

const SIZES = '(max-width: 800px) 93vw, 40vw'

/**
 * A poster from the Sanity CDN. `sizes` tells the browser how wide it shows, so
 * it downloads no more than it needs; `still` shows an animated GIF's first
 * frame only, as a small resized image.
 */
export function PosterImage({
  poster,
  sizes = SIZES,
  still = false,
}: {
  poster: Poster
  sizes?: string
  still?: boolean
}) {
  const {url, width, height, mimeType} = poster.image
  const alt = poster.title
    ? `Poster for “${poster.title}”${poster.year ? ` (${poster.year})` : ''}`
    : 'Film poster'

  if (mimeType === 'image/gif') {
    if (still) {
      return <SanityImage src={`${url}?frame=1`} width={width} height={height} alt={alt} sizes={sizes} />
    }
    // Resizing a GIF on the Sanity CDN would drop the animation, so serve the original file.
    return <NextImage src={url} width={width} height={height} alt={alt} sizes={sizes} unoptimized />
  }
  return <SanityImage src={url} width={width} height={height} alt={alt} sizes={sizes} />
}
