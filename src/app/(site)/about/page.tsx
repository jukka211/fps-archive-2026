import type {Metadata} from 'next'
import Link from 'next/link'
import {PortableText, type PortableTextComponents} from 'next-sanity'

import {PosterStrip} from '@/components/PosterStrip'
import {sanityFetch} from '@/sanity/live'
import {ABOUT_QUERY, POSTERS_QUERY, type About, type Poster} from '@/sanity/queries'

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
  const [{data}, {data: posters}] = await Promise.all([
    sanityFetch({query: ABOUT_QUERY}),
    sanityFetch({query: POSTERS_QUERY}),
  ])
  const about = data as About

  return (
    <div className={styles.page}>
      <header className={styles.information}>
        <Link href="/">FPS Archive</Link>
        <Link href="/" className={styles.close}>Close</Link>
      </header>
      <div className={styles.text}>
        {about?.body ? <PortableText value={about.body} components={components} /> : null}
      </div>
      <PosterStrip posters={(posters ?? []) as Poster[]} />
    </div>
  )
}
