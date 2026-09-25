'use client'

import NextImage from 'next/image'
import {Image as SanityImage} from 'next-sanity/image'

import type {Poster} from '@/sanity/queries'

const SIZES = '(max-width: 800px) 93vw, 40vw'

export function PosterImage({poster}: {poster: Poster}) {
  const {url, width, height, mimeType} = poster.image
  const alt = poster.title
    ? `Poster for “${poster.title}”${poster.year ? ` (${poster.year})` : ''}`
    : 'Film poster'

  // Resizing a GIF on the Sanity CDN would drop the animation, so serve the original file.
  if (mimeType === 'image/gif') {
    return <NextImage src={url} width={width} height={height} alt={alt} sizes={SIZES} unoptimized />
  }
  return <SanityImage src={url} width={width} height={height} alt={alt} sizes={SIZES} />
}
