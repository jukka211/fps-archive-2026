import type {Metadata} from 'next'

import {PageTransition} from '@/components/PageTransition'
import {ProjectIndex} from '@/components/ProjectIndex'
import {sanityFetch} from '@/sanity/live'
import {INDEX_QUERY, POSTERS_QUERY, type IndexEntry, type Poster} from '@/sanity/queries'

export const metadata: Metadata = {
  title: 'Index',
}

export default async function IndexPage() {
  const [{data: entries}, {data: posters}] = await Promise.all([
    sanityFetch({query: INDEX_QUERY}),
    sanityFetch({query: POSTERS_QUERY}),
  ])

  return (
    <PageTransition>
      <ProjectIndex entries={(entries ?? []) as IndexEntry[]} posters={(posters ?? []) as Poster[]} />
    </PageTransition>
  )
}
