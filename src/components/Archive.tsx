'use client'

import Link from 'next/link'
import {useEffect, useState, type CSSProperties} from 'react'

import type {Poster} from '@/sanity/queries'

import {PosterImage} from './PosterImage'
import styles from './Archive.module.css'

const DESKTOP_QUERY = '(min-width: 801px)'

const pad = (n: number) => String(n).padStart(2, '0')

export function Archive({posters}: {posters: Poster[]}) {
  const total = posters.length

  // Counts 0 → total at `total` frames per second on load, e.g. 0FPS … 23FPS.
  const [count, setCount] = useState(0)
  // Poster under the pointer (or last tapped): the big counter shows its number, e.g. 05FPS.
  const [hovered, setHovered] = useState<number | null>(null)
  // Last poster hovered or tapped: stays expanded and shows its title and credits.
  const [active, setActive] = useState<number | null>(null)
  // Poster clicked or tapped to fill the available height; resets when the pointer leaves it.
  const [zoomed, setZoomed] = useState<number | null>(null)

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

  const isDesktop = () => window.matchMedia(DESKTOP_QUERY).matches

  function enter(index: number) {
    if (!isDesktop()) return
    setHovered(index)
    setActive(index)
  }

  function leave(index: number) {
    setHovered((h) => (h === index ? null : h))
    setZoomed((z) => (z === index ? null : z))
  }

  function toggleZoom(index: number) {
    if (!isDesktop()) {
      // Touch screens have no hover, so the tap also selects the poster.
      setHovered(index)
      setActive(index)
    }
    setZoomed((z) => (z === index ? null : index))
  }

  const current = active !== null ? posters[active] : undefined
  const counter = hovered !== null ? pad(hovered + 1) : String(count)

  return (
    <div className={styles.page}>
      <header className={styles.information}>
        <Link href="/">FPS Archive</Link>
        <span className={styles.title}>
          {current?.title ? `“${current.title}”${current.year ? ` ${current.year}` : ''}` : null}
        </span>
        <Link href="/about">About</Link>
      </header>

      <div className={styles.hoverContainer} aria-hidden>
        <div className={styles.counter} data-dimmed={zoomed !== null}>
          {counter}FPS
        </div>
      </div>

      <div className={styles.container}>
        {posters.map((poster, index) => (
          <div
            key={poster._id}
            className={styles.column}
            style={{'--ratio': poster.image.width / poster.image.height} as CSSProperties}
            data-active={active === index}
            data-zoomed={zoomed === index}
            onMouseEnter={() => enter(index)}
            onMouseLeave={() => leave(index)}
            onClick={() => toggleZoom(index)}
            onFocus={() => enter(index)}
            onBlur={() => leave(index)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleZoom(index)
              }
            }}
            onTransitionEnd={(e) => {
              // Mobile: once a tapped poster has grown, scroll the strip so it's fully visible.
              if (e.target !== e.currentTarget || e.propertyName !== 'flex-basis') return
              if (zoomed === index && !isDesktop()) {
                e.currentTarget.scrollIntoView({behavior: 'smooth', inline: 'center', block: 'nearest'})
              }
            }}
            tabIndex={0}
            data-poster-index={index}
          >
            <div className={styles.trigger}>
              <PosterImage poster={poster} />
            </div>
          </div>
        ))}
      </div>

      <div className={styles.credits}>
        {current?.credits?.length ? (
          <div className={styles.creditRow}>
            {current.credits.map((credit) => (
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
