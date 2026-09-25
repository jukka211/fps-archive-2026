'use client'

import {useEffect, useState} from 'react'

import styles from './Counter.module.css'

/**
 * The giant “23FPS” behind the home and About pages: `value`, then FPS. On
 * phones it sits a little above the middle of the screen until the first touch,
 * click, scroll or key press, then moves up out of the posters' way.
 */
export function Counter({value, dimmed}: {value: string; dimmed: boolean}) {
  const [raised, setRaised] = useState(false)

  useEffect(() => {
    if (raised) return
    const raise = () => setRaised(true)
    const events = ['pointerdown', 'wheel', 'keydown'] as const
    events.forEach((type) => window.addEventListener(type, raise, {passive: true}))
    return () => events.forEach((type) => window.removeEventListener(type, raise))
  }, [raised])

  return (
    <div className={styles.layer} aria-hidden>
      <div className={styles.counter} data-dimmed={dimmed} data-raised={raised}>
        {/* Two parts, so phones can push them to either side. */}
        <span>{value}</span>
        <span>FPS</span>
      </div>
    </div>
  )
}
