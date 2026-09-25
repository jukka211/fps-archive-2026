import {SanityLive} from '@/sanity/live'

// Separate root layout so the Studio doesn't inherit the site's styles.
// <SanityLive /> here refreshes the site's cached pages the moment an edit is
// published, even when nobody has the public site open.
export default function StudioLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body style={{margin: 0}}>
        {children}
        <SanityLive />
      </body>
    </html>
  )
}
