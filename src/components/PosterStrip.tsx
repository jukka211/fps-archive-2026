import type {Poster} from '@/sanity/queries'

import {PosterImage} from './PosterImage'
import styles from './PosterStrip.module.css'

// Thumbnails either side of the centre one: enough to fill the widest screen.
const RANGE = 30

const mod = (n: number, total: number) => ((n % total) + total) % total

/**
 * A still row of poster thumbnails, laid out as the home page's strip before
 * it's scrolled: the first poster in the centre, the rest looping out to both
 * sides. It doesn't scroll or respond to clicks.
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
            <PosterImage poster={poster} />
          </div>
        )
      })}
    </div>
  )
}
