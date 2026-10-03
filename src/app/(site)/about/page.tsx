import type {Metadata} from 'next'
import {PortableText, type PortableTextComponents} from 'next-sanity'

import {Information} from '@/components/Information'
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
      <Information />
      <div className={styles.text}>
        {about?.body ? <PortableText value={about.body} components={components} /> : null}
      </div>
      <PosterStrip posters={(posters ?? []) as Poster[]} />
    </div>
  )
}
