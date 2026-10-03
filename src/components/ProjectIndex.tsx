'use client'

import Link from 'next/link'
import {useState} from 'react'

import type {Credit, IndexEntry, Poster} from '@/sanity/queries'

import {Information} from './Information'
import {PosterStrip} from './PosterStrip'
import styles from './ProjectIndex.module.css'

/** One role, e.g. “D: Meike Wüstenberg”: names comma-separated, each linked when it has a URL. */
function Names({label, credits}: {label: string; credits: Credit[] | null}) {
  if (!credits?.length) return null
  return (
    <div>
      {label}:{' '}
      {credits.map((credit, i) => (
        <span key={credit._key}>
          {i > 0 ? ', ' : null}
          {credit.url ? (
            <a href={credit.url} className={styles.person}>{credit.name}</a>
          ) : (
            credit.name
          )}
        </span>
      ))}
    </div>
  )
}

/** Index page: one project per cell, with the poster strip below lighting up the hovered one. */
export function ProjectIndex({entries, posters}: {entries: IndexEntry[]; posters: Poster[]}) {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className={styles.page}>
      <Information />
      <div className={styles.grid}>
        {entries.map((entry, i) => (
          <div
            key={entry._id}
            className={styles.cell}
            onMouseEnter={() => setHovered(entry._id)}
            onMouseLeave={() => setHovered((id) => (id === entry._id ? null : id))}
          >
            {/* Its frame: the number the home page's counter shows for it. */}
            <div>{String(i + 1).padStart(2, '0')}</div>
            <div>
              <div>
                {entry.slug ? (
                  <Link href={`/projects/${entry.slug}`} className={styles.title}>
                    {entry.title}
                  </Link>
                ) : (
                  entry.title
                )}
              </div>
              <div>{entry.year}</div>
              <br />
              <Names label="D" credits={entry.directors} />
              <Names label="GD" credits={entry.designers} />
            </div>
          </div>
        ))}
      </div>
      <PosterStrip posters={posters} highlight={hovered} />
    </div>
  )
}
