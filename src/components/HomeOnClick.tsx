'use client'

import {useRouter} from 'next/navigation'
import {useEffect} from 'react'

/** Whether (x, y) falls on the letters of some text inside `element`, not just in its box. */
function onText(element: Element, x: number, y: number) {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue
    range.selectNodeContents(node)
    for (const rect of range.getClientRects()) {
      if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) return true
    }
  }
  return false
}

/**
 * On the Index and Info pages: a click anywhere but on text, a link or a
 * poster goes back to the home page.
 */
export function HomeOnClick() {
  const router = useRouter()

  useEffect(() => {
    const click = (e: MouseEvent) => {
      if (e.button !== 0 || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const target = e.target
      if (!(target instanceof Element) || target.closest('a, button, img')) return
      // The end of a drag that selected some text.
      if (window.getSelection()?.toString()) return
      if (onText(target, e.clientX, e.clientY)) return
      router.push('/')
    }
    document.addEventListener('click', click)
    return () => document.removeEventListener('click', click)
  }, [router])

  return null
}
