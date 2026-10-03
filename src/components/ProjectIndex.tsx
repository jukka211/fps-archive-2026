'use client'

import Link from 'next/link'
import {useState} from 'react'

import type {Credit, IndexEntry, Poster} from '@/sanity/queries'

import {Information} from './Information'
import {PosterStrip} from './PosterStrip'
import styles from './ProjectIndex.module.css'

/** Names for one role, comma-separated; each linked when it has a URL. */
function Names({credits}: {credits: Credit[] | null}) {
  return (
    <div>
      {credits?.map((credit, i) => (
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
        {entries.map((entry) => (
          <div
            key={entry._id}
            className={styles.cell}
            onMouseEnter={() => setHovered(entry._id)}
            onMouseLeave={() => setHovered((id) => (id === entry._id ? null : id))}
          >
            <div className={styles.head}>
              <div>
                {entry.slug ? <Link href={`/projects/${entry.slug}`}>{entry.title}</Link> : entry.title}
              </div>
              <div>{entry.year}</div>
            </div>
            <br />
            <Names credits={entry.designers} />
            <Names credits={entry.directors} />
          </div>
        ))}
      </div>
      <PosterStrip posters={posters} highlight={hovered} />
    </div>
  )
}
