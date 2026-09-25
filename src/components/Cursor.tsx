'use client'

import {useEffect, useRef, useState} from 'react'

import styles from './Cursor.module.css'

/**
 * The mouse pointer on the home page, as a word: “Scroll”, and once a poster is
 * large, “Close”, or whatever the element under the pointer asks for with a
 * `data-cursor` attribute (“View More” on the large poster). Over other links
 * the normal pointer shows instead. Mouse only: nothing on touch screens.
 */
export function Cursor({large}: {large: boolean}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  // The `data-cursor` of the element under the pointer, if any.
  const [hint, setHint] = useState<string | null>(null)
  const [overLink, setOverLink] = useState(false)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      ref.current?.style.setProperty('transform', `translate3d(${e.clientX}px, ${e.clientY}px, 0)`)
      setVisible(true)
    }
    // Also fires when the page moves under a still pointer, e.g. a poster
    // growing or the strip scrolling.
    const onOver = (e: MouseEvent) => {
      const el = e.target instanceof Element ? e.target : null
      const labelled = el?.closest<HTMLElement>('[data-cursor]')
      setHint(labelled?.dataset.cursor ?? null)
      setOverLink(!labelled && Boolean(el?.closest('a')))
    }
    // Left the window.
    const onOut = (e: MouseEvent) => {
      if (!e.relatedTarget) setVisible(false)
    }
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  return (
    <div ref={ref} className={styles.cursor} data-hidden={!visible || overLink} aria-hidden>
      {large ? (hint ?? 'Close') : 'Scroll'}
    </div>
  )
}
