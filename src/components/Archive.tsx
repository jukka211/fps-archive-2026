'use client'

import {useSearchParams} from 'next/navigation'
import {useEffect, useMemo, useState} from 'react'

import type {Poster} from '@/sanity/queries'

import {Counter} from './Counter'
import {frames} from './frames'
import {Information} from './Information'
import {PosterCarousel} from './PosterCarousel'
import styles from './Archive.module.css'

const pad = (n: number) => String(n).padStart(2, '0')
// Credits shown along the bottom, from the top of the poster's list in the Studio.
const MAX_CREDITS = 3

/**
 * The home page, opened on the poster in the address, if any: e.g. /?poster=echo
 * from a thumbnail on the Info or Index page. The address is only read in the
 * browser, so wrap this in <Suspense> with a plain <Archive> as the fallback,
 * which is what gets prerendered.
 */
export function ArchiveFromUrl({posters}: {posters: Poster[]}) {
  const slug = useSearchParams().get('poster')
  const index = slug ? posters.findIndex((poster) => poster.slug === slug) : -1
  return <Archive posters={posters} start={index >= 0 ? index : null} />
}

/** The home page. With `start`, it skips the intro and opens on that poster, large. */
export function Archive({posters, start = null}: {posters: Poster[]; start?: number | null}) {
  // Each poster's number, e.g. FPS01 for both Echo posters (see frames.ts).
  const frameOf = useMemo(
    () =>
      frames(
        posters.map((poster) => ({
          ...poster,
          designers: poster.credits?.filter((credit) => credit.role === 'Poster Design') ?? null,
        })),
      ),
    [posters],
  )
  const total = Math.max(0, ...frameOf)

  // Counts 0 → the last number at `total` frames per second on load, e.g.
  // FPS00 … FPS21, while the poster strip appears from left to right.
  const [count, setCount] = useState(0)
  // Poster in the centre of the strip once the visitor has scrolled or clicked:
  // its title and credits show, and its number replaces the count, e.g. FPS05.
  const [selected, setSelected] = useState<{index: number; large: boolean} | null>(
    start === null ? null : {index: start, large: true},
  )

  useEffect(() => {
    if (total === 0 || start !== null) return
    let n = 0
    const id = window.setInterval(() => {
      n += 1
      setCount(n)
      if (n >= total) window.clearInterval(id)
    }, 1000 / total)
    return () => window.clearInterval(id)
  }, [total, start])

  const current = selected ? posters[selected.index] : undefined
  const counter = pad(selected ? frameOf[selected.index] : count)

  return (
    <div className={styles.page}>
      <Information title={current?.title} year={current?.year} />

      <Counter value={counter} dimmed={Boolean(selected?.large)} />

      <PosterCarousel
        posters={posters}
        start={start}
        // All at once if the visitor scrolls or clicks before the count is up.
        reveal={selected || total === 0 ? 1 : count / total}
        onChange={(index, large) => setSelected({index, large})}
      />

      <div className={styles.credits}>
        {current?.credits?.length ? (
          <div className={styles.creditRow}>
            {current.credits.slice(0, MAX_CREDITS).map((credit) => (
              <div key={credit._key} className={styles.name}>
                <span className={styles.role}>{credit.role} </span>
                {credit.url ? <a href={credit.url}>{credit.name}</a> : credit.name}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
