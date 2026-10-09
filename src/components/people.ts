import type {Credit} from '@/sanity/queries'

/**
 * Everyone in these credits, once each, in order, with their link if any. A
 * name like “Felix Krisai & Pipi Fröstl” is two people; the credit's link goes
 * to the first of them.
 */
export function people(credits: Credit[] | null) {
  const links = new Map<string, string | null>()
  for (const credit of credits ?? []) {
    credit.name?.split('&').forEach((part, i) => {
      const name = part.trim()
      if (name) links.set(name, links.get(name) || (i === 0 ? credit.url : null))
    })
  }
  return [...links]
}
