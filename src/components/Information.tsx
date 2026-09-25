import Link from 'next/link'

import styles from './Information.module.css'

/** Top bar on the home, project and index pages: FPS Archive · “Title” Year · Index, About. */
export function Information({title, year}: {title?: string | null; year?: number | null}) {
  return (
    <header className={styles.information}>
      <Link href="/" className={styles.home}>FPS Archive</Link>
      <span className={styles.title}>{title ? `“${title}”${year ? ` ${year}` : ''}` : null}</span>
      <nav className={styles.nav}>
        <Link href="/projects">Index</Link>, <Link href="/about">About</Link>
      </nav>
    </header>
  )
}
