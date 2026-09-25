import type {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {Information} from '@/components/Information'
import {sanityFetch} from '@/sanity/live'
import {PROJECT_QUERY, PROJECT_SLUGS_QUERY, type Project} from '@/sanity/queries'

type Props = {params: Promise<{slug: string}>}

// Built ahead of time for every poster; posters added later are built on first visit.
export async function generateStaticParams() {
  const {data} = await sanityFetch({query: PROJECT_SLUGS_QUERY, perspective: 'published', stega: false})
  return (data ?? []) as {slug: string}[]
}

async function getProject(slug: string) {
  const {data} = await sanityFetch({query: PROJECT_QUERY, params: {slug}})
  return data as Project
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
  const project = await getProject((await params).slug)
  return project?.title ? {title: `${project.title}${project.year ? ` (${project.year})` : ''}`} : {}
}

export default async function ProjectPage({params}: Props) {
  const project = await getProject((await params).slug)
  if (!project) notFound()

  // Project content comes later; for now only the top bar.
  return <Information title={project.title} year={project.year} />
}
