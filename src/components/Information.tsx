'use client'

import Link from 'next/link'
import {usePathname} from 'next/navigation'

import styles from './Information.module.css'

/**
 * Top bar on every page: FPS Archive · “Title” Year · Index, Info. The link to
 * the page you're on is white, the other gray.
 */
export function Information({title, year}: {title?: string | null; year?: number | null}) {
  const pathname = usePathname()
  const current = (href: string) => (pathname === href ? styles.current : undefined)

  return (
    // Named, so page transitions leave it in place (globals.css).
    <header className={styles.information} style={{viewTransitionName: 'site-header'}}>
      <Link href="/" className={styles.home}>FPS Archive</Link>
      <span className={styles.title}>{title ? `“${title}”${year ? ` ${year}` : ''}` : null}</span>
      <nav className={styles.nav}>
        <Link href="/projects" className={current('/projects')}>Index</Link>,{' '}
        <Link href="/about" className={current('/about')}>Info</Link>
      </nav>
    </header>
  )
}
