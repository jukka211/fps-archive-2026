import type {Metadata} from 'next'
import Link from 'next/link'
import {PortableText, type PortableTextComponents} from 'next-sanity'

import {sanityFetch} from '@/sanity/live'
import {ABOUT_QUERY, type About} from '@/sanity/queries'

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
  const {data} = await sanityFetch({query: ABOUT_QUERY})
  const about = data as About

  return (
    <div className={styles.page}>
      <header className={styles.information}>
        <Link href="/">FPS Archive</Link>
        <Link href="/">Close</Link>
      </header>
      <div className={styles.text}>
        {about?.body ? <PortableText value={about.body} components={components} /> : null}
      </div>
      <div className={styles.colophon}>
        {about?.colophon ? <PortableText value={about.colophon} components={components} /> : null}
      </div>
    </div>
  )
}
