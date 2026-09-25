import Link from 'next/link'

import styles from './Information.module.css'

/** Top bar on the home and project pages: FPS Archive · “Title” Year · About. */
export function Information({title, year}: {title?: string | null; year?: number | null}) {
  return (
    <header className={styles.information}>
      <Link href="/">FPS Archive</Link>
      <span className={styles.title}>{title ? `“${title}”${year ? ` ${year}` : ''}` : null}</span>
      <Link href="/about">About</Link>
    </header>
  )
}
