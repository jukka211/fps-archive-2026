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
 * sides. It doesn't scroll or respond to clicks. Small images only, and GIFs
 * as a still frame, so the page doesn't wait on megabytes of thumbnails.
 *
 * With `highlight` passed, the thumbnails are dimmed and only the poster with
 * that id (every copy of it) shows at full opacity; null dims them all.
 */
export function PosterStrip({posters, highlight}: {posters: Poster[]; highlight?: string | null}) {
  const total = posters.length
  if (total === 0) return null

  const slots = []
  for (let distance = -RANGE; distance <= RANGE; distance++) slots.push(mod(distance, total))

  return (
    <div className={styles.strip} aria-hidden>
      {slots.map((index, i) => {
        const poster = posters[index]
        return (
          <div
            key={i}
            className={
              highlight !== undefined && poster._id !== highlight ? `${styles.thumb} ${styles.dim}` : styles.thumb
            }
            style={{aspectRatio: `${poster.image.width} / ${poster.image.height}`}}
          >
            <PosterImage poster={poster} sizes={SIZES} still />
          </div>
        )
      })}
    </div>
  )
}
