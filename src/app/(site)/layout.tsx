import type {Metadata} from 'next'
import localFont from 'next/font/local'

import {SanityLive} from '@/sanity/live'

import './globals.css'

const heros = localFont({
  src: '../../fonts/texgyreheros.gyreheros-regular.otf',
  variable: '--font-regular',
  fallback: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
})
const herosBold = localFont({
  src: '../../fonts/texgyreheros.gyreheros-bold.otf',
  variable: '--font-bold',
  fallback: ['Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif'],
})
const herosCondensed = localFont({
  src: '../../fonts/texgyreheros.gyreheroscondensed-regular.otf',
  variable: '--font-condensed',
  fallback: ['Helvetica Neue', 'Arial Narrow', 'sans-serif'],
})

export const metadata: Metadata = {
  title: 'Frames pro Second Archive',
  description:
    'FPS Archive — film posters designed by students of Filmacademy Vienna, Angewandte Vienna and Kunstuniversität Linz.',
}

export default function SiteLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${heros.variable} ${herosBold.variable} ${herosCondensed.variable}`}>
      <body>
        {children}
        <SanityLive />
      </body>
    </html>
  )
}
