import type {Metadata} from 'next'

import {Information} from '@/components/Information'

export const metadata: Metadata = {
  title: 'Index',
}

export default function IndexPage() {
  // Index content comes later; for now only the top bar.
  return <Information />
}
