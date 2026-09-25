import type {Metadata} from 'next'
import Link from 'next/link'
import {PortableText, type PortableTextComponents} from 'next-sanity'

import {AboutCounter} from '@/components/AboutCounter'
import {sanityFetch} from '@/sanity/live'
import {ABOUT_QUERY, POSTER_COUNT_QUERY, type About} from '@/sanity/queries'

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
  const [{data}, {data: posterCount}] = await Promise.all([
    sanityFetch({query: ABOUT_QUERY}),
    sanityFetch({query: POSTER_COUNT_QUERY}),
  ])
  const about = data as About

  return (
    <div className={styles.page}>
      <header className={styles.information}>
        <Link href="/">FPS Archive</Link>
        <Link href="/" className={styles.close}>Close</Link>
      </header>
      <AboutCounter total={(posterCount as number | null) ?? 0} />
      <div className={styles.text}>
        {about?.body ? <PortableText value={about.body} components={components} /> : null}
      </div>
      <div className={styles.colophon}>
        {about?.colophon ? <PortableText value={about.colophon} components={components} /> : null}
      </div>
    </div>
  )
}
