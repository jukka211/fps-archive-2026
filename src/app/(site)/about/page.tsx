import type {Metadata} from 'next'
import {Fragment} from 'react'
import {PortableText, type PortableTextComponents} from 'next-sanity'

import {Counter} from '@/components/Counter'
import {frames} from '@/components/frames'
import {HomeOnClick} from '@/components/HomeOnClick'
import {Information} from '@/components/Information'
import {PageTransition} from '@/components/PageTransition'
import {people} from '@/components/people'
import {PosterStrip} from '@/components/PosterStrip'
import {sanityFetch} from '@/sanity/live'
import {ABOUT_QUERY, INDEX_QUERY, POSTERS_QUERY, type About, type IndexEntry, type Poster} from '@/sanity/queries'

import styles from './about.module.css'

export const metadata: Metadata = {
  title: 'About',
}

const components: PortableTextComponents = {
  marks: {
    link: ({value, children}) => <a href={value?.href}>{children}</a>,
  },
}

export default async function AboutPage() {
  const [{data}, {data: posters}, {data: entries}] = await Promise.all([
    sanityFetch({query: ABOUT_QUERY}),
    sanityFetch({query: POSTERS_QUERY}),
    sanityFetch({query: INDEX_QUERY}),
  ])
  const about = data as About
  // How many there are (frames.ts), as the home page counts up to.
  const total = Math.max(0, ...frames((entries ?? []) as IndexEntry[]))

  return (
    <PageTransition>
      <div className={styles.page}>
        <Information />
        <HomeOnClick />
        {/* Behind the text, dimmed. */}
        <Counter value={String(total).padStart(2, '0')} dimmed />
        <div className={styles.content}>
          <div className={styles.text}>
            {about?.body ? <PortableText value={about.body} components={components} /> : null}
          </div>
          {about?.rows?.length ? (
            <ul className={styles.rows}>
              {/* Unseen: the Index's titles, genres, designers and years, so these
                  columns are as wide as the Index's and the text lines up with
                  its crew. */}
              <li className={styles.sizer} aria-hidden>
                {((entries ?? []) as IndexEntry[]).map((entry) => {
                  const designers = people(entry.designers).map(([name]) => name)
                  return (
                    <Fragment key={entry._id}>
                      <div className={styles.sizeTitle}>{entry.title}</div>
                      <div className={styles.sizeGenre}>{entry.genre}</div>
                      <div className={styles.sizeDesigners}>{designers.length ? `G: ${designers.join(', ')}` : null}</div>
                      <div className={styles.sizeYear}>{entry.year}</div>
                    </Fragment>
                  )
                })}
              </li>
              {about.rows.map((row) => (
                <li key={row._key} className={styles.row}>
                  <div>FPS</div>
                  <div className={styles.rowTitle}>{row.title}</div>
                  <div className={styles.rowText}>{row.text}</div>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <PosterStrip posters={(posters ?? []) as Poster[]} />
      </div>
    </PageTransition>
  )
}
