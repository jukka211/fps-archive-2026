'use client'

import {useEffect, useState} from 'react'

import {Counter} from './Counter'

const KEY_STEPS: Record<string, number> = {ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1}

// Scroll distance per step, as on the home page's poster strip.
const stepSize = () => (window.matchMedia('(max-width: 800px)').matches ? 80 : 100)

/**
 * The About page's counter, behind the text. Scrolling (mouse wheel, trackpad,
 * swipe or ↑ ↓ ← →) steps it from 00 up to the number of posters and back down;
 * the page itself doesn't move. White until the first scroll, then faded back.
 */
export function AboutCounter({total}: {total: number}) {
  const [step, setStep] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // How far the visitor has scrolled, in steps (fractional mid-scroll).
    let progress = 0
    const moveTo = (next: number) => {
      progress = Math.min(total, Math.max(0, next))
      setStep(Math.round(progress))
      setScrolled(true)
    }
    const scrollBy = (px: number) => moveTo(progress + px / stepSize())

    const onWheel = (e: WheelEvent) => {
      const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? window.innerHeight : 1
      scrollBy((Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * unit)
    }
    // One finger moving up scrolls on, as it would a page.
    let touchY: number | null = null
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches.length === 1 ? e.touches[0].clientY : null
    }
    const onTouchMove = (e: TouchEvent) => {
      if (touchY === null || e.touches.length !== 1) return
      const y = e.touches[0].clientY
      scrollBy(touchY - y)
      touchY = y
    }
    const onKey = (e: KeyboardEvent) => {
      if (KEY_STEPS[e.key]) moveTo(Math.round(progress) + KEY_STEPS[e.key])
    }

    window.addEventListener('wheel', onWheel, {passive: true})
    window.addEventListener('touchstart', onTouchStart, {passive: true})
    window.addEventListener('touchmove', onTouchMove, {passive: true})
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
    }
  }, [total])

  return <Counter value={String(step).padStart(2, '0')} dimmed={scrolled} />
}
