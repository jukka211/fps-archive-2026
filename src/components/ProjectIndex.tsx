'use client'

import Link from 'next/link'
import {useState} from 'react'

import type {Credit, IndexEntry, Poster} from '@/sanity/queries'

import {Information} from './Information'
import {PosterStrip} from './PosterStrip'
import styles from './ProjectIndex.module.css'

/**
 * Everyone in these credits, once each, in order, with their link if any. A
 * name like “Felix Krisai & Pipi Fröstl” is two people; the credit's link goes
 * to the first of them.
 */
function people(credits: Credit[] | null) {
  const links = new Map<string, string | null>()
  for (const credit of credits ?? []) {
    credit.name?.split('&').forEach((part, i) => {
      const name = part.trim()
      if (name) links.set(name, links.get(name) || (i === 0 ? credit.url : null))
    })
  }
  return [...links]
}

/** e.g. “Film: Thomas Marciano, Elahe Aman”: no roles, names comma-separated, each linked when it has a URL. */
function Names({label, credits}: {label: string; credits: Credit[] | null}) {
  const list = people(credits)
  if (!list.length) return null
  return (
    <div>
      {label}:{' '}
      {list.map(([name, url], i) => (
        <span key={name}>
          {i > 0 ? ', ' : null}
          {url ? (
            <a href={url} className={styles.person}>{name}</a>
          ) : (
            name
          )}
        </span>
      ))}
    </div>
  )
}

/**
 * Index page: one project per cell, with the poster strip below. Hovering a
 * cell lights up its poster in the strip; hovering a poster selects its cell.
 */
export function ProjectIndex({entries, posters}: {entries: IndexEntry[]; posters: Poster[]}) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className={styles.page}>
      <Information />
      <div className={styles.grid}>
        {entries.map((entry, i) => (
          <div
            key={entry._id}
            className={hovered === entry._id ? `${styles.cell} ${styles.selected}` : styles.cell}
            onMouseEnter={() => setHovered(entry._id)}
            onMouseLeave={() => setHovered((id) => (id === entry._id ? null : id))}
          >
            {/* Its frame: the number the home page's counter shows for it. */}
            <div>{String(i + 1).padStart(2, '0')}FPS</div>
            <div>
              <div>
                {entry.slug ? (
                  // Opens the poster, large, on the home page, as the strip's thumbnails do.
                  <Link href={{pathname: '/', query: {poster: entry.slug}}} className={styles.title}>
                    {entry.title}
                  </Link>
                ) : (
                  entry.title
                )}
              </div>
              <div>{entry.year}</div>
              <br />
              <Names label="Graphic" credits={entry.designers} />
              {entry.designers?.length && entry.crew?.length ? <br /> : null}
              <Names label="Film" credits={entry.crew} />
            </div>
          </div>
        ))}
      </div>
      <PosterStrip posters={posters} highlight={hovered} onHover={setHovered} />
    </div>
  )
}
