'use client'

import Link from 'next/link'
import {useState} from 'react'

import type {Credit, IndexEntry, Poster} from '@/sanity/queries'

import {frames} from './frames'
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

/** e.g. “F: Thomas Marciano, Elahe Aman”: no roles, names comma-separated, each linked when it has a URL. */
function Names({label, credits, className}: {label: string; credits: Credit[] | null; className: string}) {
  const list = people(credits)
  if (!list.length) return null
  return (
    <div className={className}>
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

type Row = {entry: IndexEntry; frame: number; ids: string[]}

/**
 * One row per frame: posters that share one (the same film by the same
 * designers, e.g. both Echo posters) share the row of the first of them.
 */
function rows(entries: IndexEntry[]) {
  const list: Row[] = []
  frames(entries).forEach((frame, i) => {
    const entry = entries[i]
    if (list[frame - 1]) list[frame - 1].ids.push(entry._id)
    else list[frame - 1] = {entry, frame, ids: [entry._id]}
  })
  return list
}

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * Index page: one project per row, with the poster strip below. Hovering a
 * row lights up its posters in the strip; hovering a poster selects its row.
 * On phones, tapping a poster in the strip scrolls to its row and grays it.
 */
export function ProjectIndex({entries, posters}: {entries: IndexEntry[]; posters: Poster[]}) {
  const [hovered, setHovered] = useState<string | null>(null)
  // The poster last tapped in the strip on a phone.
  const [tapped, setTapped] = useState<string | null>(null)
  const list = rows(entries)
  const selected = list.find(({ids}) => hovered && ids.includes(hovered))

  const scrollTo = (id: string) => {
    const row = list.find(({ids}) => ids.includes(id))
    if (!row) return
    setTapped(id)
    document.getElementById(`fps-${pad(row.frame)}`)?.scrollIntoView({behavior: 'smooth', block: 'start'})
  }

  return (
    <div className={styles.page}>
      <Information />
      <ol className={styles.list}>
        {list.map(({entry, frame, ids}) => (
          <li
            key={entry._id}
            id={`fps-${pad(frame)}`}
            className={[
              styles.entry,
              selected?.entry === entry ? styles.selected : null,
              tapped && ids.includes(tapped) ? styles.tapped : null,
            ]
              .filter(Boolean)
              .join(' ')}
            onMouseEnter={() => setHovered(entry._id)}
            onMouseLeave={() => setHovered((id) => (id && ids.includes(id) ? null : id))}
          >
            {/* Its frame: the number the home page's counter shows for its posters. */}
            <div className={styles.number}>{pad(frame)}FPS</div>
            <div className={styles.film}>
              {entry.slug ? (
                // Opens the poster, large, on the home page, as the strip's thumbnails do.
                <Link href={{pathname: '/', query: {poster: entry.slug}}} className={styles.title}>
                  {entry.title}
                </Link>
              ) : (
                entry.title
              )}
            </div>
            {entry.genre ? <div className={styles.genre}>{entry.genre}</div> : null}
            {/* G: the poster's designers (Graphic); F: the film's crew (Film). */}
            <Names label="G" credits={entry.designers} className={styles.designers} />
            <Names label="F" credits={entry.crew} className={styles.crew} />
            {entry.year ? <div className={styles.year}>{entry.year}</div> : null}
          </li>
        ))}
      </ol>
      <PosterStrip posters={posters} highlight={selected?.ids ?? null} onHover={setHovered} onSelect={scrollTo} />
    </div>
  )
}
