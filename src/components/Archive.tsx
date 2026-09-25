'use client'

import {useEffect, useState} from 'react'

import type {Poster} from '@/sanity/queries'

import {Cursor} from './Cursor'
import {Information} from './Information'
import {PosterCarousel} from './PosterCarousel'
import styles from './Archive.module.css'

const pad = (n: number) => String(n).padStart(2, '0')
// Credits shown along the bottom, from the top of the poster's list in the Studio.
const MAX_CREDITS = 3

export function Archive({posters}: {posters: Poster[]}) {
  const total = posters.length

  // Counts 0 → total at `total` frames per second on load, e.g. 0FPS … 23FPS.
  const [count, setCount] = useState(0)
  // Poster in the centre of the strip once the visitor has scrolled or clicked:
  // its title and credits show, and its number replaces the count, e.g. 05FPS.
  const [selected, setSelected] = useState<{index: number; large: boolean} | null>(null)
  // Set on the first touch, click, scroll or key press; on phones the counter
  // then moves up out of the posters' way.
  const [raised, setRaised] = useState(false)

  useEffect(() => {
    if (total === 0) return
    let n = 0
    const id = window.setInterval(() => {
      n += 1
      setCount(n)
      if (n >= total) window.clearInterval(id)
    }, 1000 / total)
    return () => window.clearInterval(id)
  }, [total])

  useEffect(() => {
    if (raised) return
    const raise = () => setRaised(true)
    const events = ['pointerdown', 'wheel', 'keydown'] as const
    events.forEach((type) => window.addEventListener(type, raise, {passive: true}))
    return () => events.forEach((type) => window.removeEventListener(type, raise))
  }, [raised])

  const current = selected ? posters[selected.index] : undefined
  const counter = selected ? pad(selected.index + 1) : String(count)

  return (
    <div className={styles.page}>
      <Information title={current?.title} year={current?.year} />

      <div className={styles.hoverContainer} aria-hidden>
        <div className={styles.counter} data-dimmed={Boolean(selected?.large)} data-raised={raised}>
          {/* Two parts, so phones can push them to either side. */}
          <span>{counter}</span>
          <span>FPS</span>
        </div>
      </div>

      <PosterCarousel posters={posters} onChange={(index, large) => setSelected({index, large})} />

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

      <Cursor large={Boolean(selected?.large)} />
    </div>
  )
}
