import {Archive} from '@/components/Archive'
import {sanityFetch} from '@/sanity/live'
import {POSTERS_QUERY, type Poster} from '@/sanity/queries'

export default async function Home() {
  const {data} = await sanityFetch({query: POSTERS_QUERY})
  const posters = (data ?? []) as Poster[]

  return <Archive posters={posters} />
}
