'use client'

import {motion} from 'motion/react'
import Link from 'next/link'
import {useEffect, useLayoutEffect, useMemo, useRef, useState} from 'react'

import type {Poster} from '@/sanity/queries'

import {PosterImage} from './PosterImage'
import styles from './Archive.module.css'

// The scroll track holds the posters this many times over and starts in the
// middle, so the strip loops and can be scrolled either way.
const LOOP_CYCLES = 12
const SPRING = {type: 'spring', stiffness: 210, damping: 26, mass: 0.9} as const

type Metrics = {width: number; height: number; thumb: number; gap: number; step: number}

const mod = (n: number, total: number) => ((n % total) + total) % total

/**
 * The poster strip, on desktop and mobile. Scrolling (swipe, mouse wheel,
 * trackpad or ← →) moves through the posters one `--scroll-step` at a time.
 * Once scrolled or clicked, the poster in the centre is large and the rest are
 * thumbnails, all animated with a spring; the large one links to its project
 * page. The strip loops.
 */
export function PosterCarousel({
  posters,
  onChange,
}: {
  posters: Poster[]
  onChange: (index: number, large: boolean) => void
}) {
  const total = posters.length
  const totalSteps = total * LOOP_CYCLES
  const startStep = Math.floor(LOOP_CYCLES / 2) * total
  const scrollerRef = useRef<HTMLDivElement>(null)
  // Current step, readable from the event handlers and resize observer.
  const stepRef = useRef(startStep)
  const [step, setStep] = useState(startStep)
  const [large, setLarge] = useState(false)
  const [metrics, setMetrics] = useState<Metrics | null>(null)

  // Measure the strip and read the sizes from the CSS variables, which differ
  // per screen size. Again whenever it changes size.
  useLayoutEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    const measure = () => {
      if (el.clientWidth === 0) return
      const css = getComputedStyle(el)
      const px = (name: string) => parseFloat(css.getPropertyValue(name)) || 0
      setMetrics({
        width: el.clientWidth,
        height: el.clientHeight,
        thumb: px('--thumb-width'),
        gap: px('--thumb-gap'),
        step: px('--scroll-step') || 80,
      })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // Once the scroll track has its width, scroll to the current step (the
  // middle of the loop at first). Programmatic, so it doesn't count as a scroll.
  // Only when the step size changes: other resizes (e.g. the top bar growing a
  // line) mustn't cut short a swipe.
  const stepSize = metrics?.step
  useLayoutEffect(() => {
    if (stepSize && scrollerRef.current) scrollerRef.current.scrollLeft = stepRef.current * stepSize
  }, [stepSize])

  // Mouse wheels scroll vertically: turn that into sideways scrolling, anywhere
  // on the page. Arrow keys step through the posters too.
  useEffect(() => {
    const el = scrollerRef.current
    if (!el || !metrics) return
    const onWheel = (e: WheelEvent) => {
      const vertical = Math.abs(e.deltaY) > Math.abs(e.deltaX)
      // Sideways trackpad swipes over the strip already scroll it natively.
      if (!vertical && el.contains(e.target as Node)) return
      const unit = e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? el.clientWidth : 1
      el.scrollLeft += (vertical ? e.deltaY : e.deltaX) * unit
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
      const direction = e.key === 'ArrowRight' ? 1 : -1
      el.scrollTo({left: (stepRef.current + direction) * metrics.step, behavior: 'smooth'})
    }
    window.addEventListener('wheel', onWheel, {passive: true})
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [metrics])

  // While a poster is large, a click anywhere but on it shrinks it back.
  useEffect(() => {
    if (!large) return
    const onDocumentClick = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest('[data-distance="0"]')) return
      setLarge(false)
      onChange(mod(stepRef.current, total), false)
    }
    document.addEventListener('click', onDocumentClick)
    return () => document.removeEventListener('click', onDocumentClick)
  }, [large, onChange, total])

  function onScroll() {
    const el = scrollerRef.current
    if (!el || !metrics) return
    const next = Math.min(totalSteps - 1, Math.max(0, Math.round(el.scrollLeft / metrics.step)))
    if (next === stepRef.current) return
    stepRef.current = next
    setStep(next)
    setLarge(true)
    onChange(mod(next, total), true)
  }

  function onClick(index: number, distance: number) {
    if (distance === 0) {
      // Large and linked: the link on top of it opens the project page.
      if (large && posters[index].slug) return
      setLarge(!large)
      onChange(index, !large)
    } else if (!large && metrics) {
      // Scrolling it to the centre makes it the large one. (While one is large,
      // the click shrinks it back instead; see the effect above.)
      scrollerRef.current?.scrollTo({left: (stepRef.current + distance) * metrics.step, behavior: 'smooth'})
    }
  }

  // One card per position on the (endless) loop, centre ± enough to fill the
  // width. Keyed by position, so when the centre moves every card slides over;
  // on a wide screen the next round of posters simply follows on.
  const cards = useMemo(() => {
    if (!metrics || total === 0) return []
    const {width, height, thumb, gap} = metrics
    const range = Math.ceil(width / 2 / (thumb + gap)) + 2

    const slots = []
    for (let distance = -range; distance <= range; distance++) {
      const slot = step + distance
      const index = mod(slot, total)
      const poster = posters[index]
      const ratio = poster.image.width / poster.image.height
      // Large: full height, but narrow enough to keep a thumbnail on each side.
      const w = distance === 0 && large ? Math.min(height * ratio, width - 2 * (thumb + gap)) : thumb
      slots.push({slot, index, poster, distance, w, h: w / ratio, x: 0})
    }

    slots[range].x = (width - slots[range].w) / 2
    for (let i = range - 1; i >= 0; i--) slots[i].x = slots[i + 1].x - gap - slots[i].w
    for (let i = range + 1; i < slots.length; i++) slots[i].x = slots[i - 1].x + slots[i - 1].w + gap
    return slots
  }, [metrics, posters, total, step, large])

  return (
    <div ref={scrollerRef} className={styles.carousel} onScroll={onScroll}>
      <div className={styles.carouselStage}>
        {cards.map(({slot, index, poster, distance, w, h, x}) => (
          <motion.div
            key={slot}
            className={styles.carouselCard}
            initial={false}
            animate={{x, width: w, height: h, opacity: large && distance !== 0 ? 0.4 : 1}}
            transition={SPRING}
            onClick={() => onClick(index, distance)}
            data-poster-index={index}
            data-distance={distance}
          >
            <PosterImage poster={poster} />
            {distance === 0 && large && poster.slug ? (
              <Link
                href={`/projects/${poster.slug}`}
                className={styles.carouselLink}
                aria-label={`Open “${poster.title}”`}
                data-cursor="View More"
              />
            ) : null}
          </motion.div>
        ))}
      </div>
      <div
        className={styles.carouselTrack}
        style={{width: metrics ? (totalSteps - 1) * metrics.step : 0}}
      />
    </div>
  )
}
