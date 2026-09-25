'use client'

import Link from 'next/link'
import {useEffect, useRef, useState} from 'react'

import type {Poster} from '@/sanity/queries'

import {PosterImage} from './PosterImage'
import styles from './Archive.module.css'

const DESKTOP_QUERY = '(min-width: 801px)'

const pad = (n: number) => String(n).padStart(2, '0')

export function Archive({posters}: {posters: Poster[]}) {
  const total = posters.length

  // Counts 0 → total at `total` frames per second on load, e.g. 0FPS … 23FPS.
  const [count, setCount] = useState(0)
  // Poster under the pointer: the big counter shows its number, e.g. 05FPS.
  const [hovered, setHovered] = useState<number | null>(null)
  // Last poster hovered (desktop) or swiped to (mobile): stays expanded and shows its title and credits.
  const [active, setActive] = useState<number | null>(null)
  // Poster clicked to fill the screen height; resets when the pointer leaves it.
  const [zoom, setZoom] = useState<{index: number; flex: string} | null>(null)
  // Mobile: the gallery slides in on the first tap.
  const [open, setOpen] = useState(false)
  const galleryRef = useRef<HTMLDivElement>(null)

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
    setZoom((z) => (z?.index === index ? null : z))
  }

  function toggleZoom(index: number) {
    if (!isDesktop()) return
    // A ~1:√2 poster at this width fills the column height.
    const basis = Math.round(window.innerHeight / 1.59)
    setZoom((z) => (z?.index === index ? null : {index, flex: `1 1 ${basis}px`}))
  }

  function openGallery() {
    if (open || isDesktop()) return
    setOpen(true)
    setActive(0)
  }

  function onGalleryScroll() {
    const el = galleryRef.current
    if (!el || !open || isDesktop()) return
    setActive(Math.min(total - 1, Math.round(el.scrollLeft / el.clientWidth)))
  }

  function flexFor(index: number) {
    if (zoom?.index === index) return zoom.flex
    if (active === null) return undefined
    return active === index ? 3 : 1
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

      <div className={styles.hoverContainer} onClick={openGallery} aria-hidden>
        <div className={styles.counter}>{counter}FPS</div>
      </div>

      <div
        ref={galleryRef}
        className={styles.container}
        data-open={open}
        onScroll={onGalleryScroll}
      >
        {posters.map((poster, index) => (
          <div
            key={poster._id}
            className={styles.column}
            style={{flex: flexFor(index)}}
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
