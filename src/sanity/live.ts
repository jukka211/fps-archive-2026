import {createClient} from 'next-sanity'
import {defineLive} from 'next-sanity/live'

import {apiVersion, dataset, projectId} from './env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: 'published',
})

// Published content only, so no tokens are needed. <SanityLive /> in the
// layout refreshes the page as soon as an edit is published in the Studio.
export const {sanityFetch, SanityLive} = defineLive({client})
