import {ViewTransition} from 'react'

/**
 * Wraps a page's content: navigating between pages fades the old one out and
 * the new one in (the `page-fade` animations in globals.css). Browsers without
 * view transitions simply switch pages.
 */
export function PageTransition({children}: {children: React.ReactNode}) {
  return (
    <ViewTransition enter="page-fade" exit="page-fade" default="none">
      {children}
    </ViewTransition>
  )
}
