import {Suspense} from 'react'

import {Archive, ArchiveFromUrl} from '@/components/Archive'
import {sanityFetch} from '@/sanity/live'
import {POSTERS_QUERY, type Poster} from '@/sanity/queries'

export default async function Home() {
  const {data} = await sanityFetch({query: POSTERS_QUERY})
  const posters = (data ?? []) as Poster[]

  // Opening on a poster (/?poster=echo) depends on the address, which is read in
  // the browser: the page is prerendered as it shows without one.
  return (
    <Suspense fallback={<Archive posters={posters} />}>
      <ArchiveFromUrl posters={posters} />
    </Suspense>
  )
}
