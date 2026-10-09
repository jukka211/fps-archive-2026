'use client'

import Link from 'next/link'
import {useState} from 'react'

import type {Poster} from '@/sanity/queries'

import {PosterImage} from './PosterImage'
import styles from './PosterStrip.module.css'

// Thumbnails either side of the centre one: enough to fill the widest screen.
const RANGE = 30
// The thumbnail widths from PosterStrip.module.css.
const SIZES = '(max-width: 800px) 32px, (min-width: 2801px) 82px, (min-width: 2239px) 76px, 60px'

const mod = (n: number, total: number) => ((n % total) + total) % total

/**
 * A still row of poster thumbnails, laid out as the home page's strip before
 * it's scrolled: the first poster in the centre, the rest looping out to both
 * sides. It doesn't scroll. Small images only, and GIFs as a still frame, so
 * the page doesn't wait on megabytes of thumbnails.
 *
 * The thumbnails are dimmed; the hovered poster (every copy of it) shows at
 * full opacity, and a click opens it, large, on the home page. Pass `highlight`
 * to light up posters from outside instead (their ids, or null for none), and
 * `onHover` to hear which one is hovered.
 */
export function PosterStrip({
  posters,
  highlight,
  onHover,
}: {
  posters: Poster[]
  highlight?: string[] | null
  onHover?: (id: string | null) => void
}) {
  const [hovered, setHovered] = useState<string | null>(null)
  const total = posters.length
  if (total === 0) return null

  const lit = highlight === undefined ? (hovered ? [hovered] : []) : (highlight ?? [])
  const hover = (id: string | null) => {
    setHovered(id)
    onHover?.(id)
  }

  const slots = []
  for (let distance = -RANGE; distance <= RANGE; distance++) slots.push(mod(distance, total))

  // Mouse only: the thumbnails repeat, so they stay out of the tab order and
  // screen readers (the Index lists every project anyway).
  return (
    <div className={styles.strip} aria-hidden>
      {slots.map((index, i) => {
        const poster = posters[index]
        const props = {
          className: lit.includes(poster._id) ? styles.thumb : `${styles.thumb} ${styles.dim}`,
          style: {aspectRatio: `${poster.image.width} / ${poster.image.height}`},
          onMouseEnter: () => hover(poster._id),
          onMouseLeave: () => hover(null),
        }
        const image = <PosterImage poster={poster} sizes={SIZES} still />
        return poster.slug ? (
          <Link key={i} href={{pathname: '/', query: {poster: poster.slug}}} tabIndex={-1} {...props}>
            {image}
          </Link>
        ) : (
          <div key={i} {...props}>
            {image}
          </div>
        )
      })}
    </div>
  )
}
