# FPS Archive

Next.js 16 site with Sanity for content, deployed on Vercel.

- **Site**: `/` (poster archive), `/projects` (Index), `/projects/<page-url>` (one page per poster) and `/about`
- **Studio**: `/studio`, where you edit posters and the About text (log in with your Sanity account)
- **Sanity project**: `rq2riu6f`, dataset `production` ([manage](https://www.sanity.io/manage/project/rq2riu6f))

## Editing content

Open `/studio` on the live site (or `http://localhost:3000/studio` locally).

- **Project-Posters**: film title, page URL (click “Generate”), year, poster image (WebP/JPG/PNG or animated GIF) and credits (the first three show along the bottom of the home page). Drag posters to reorder them; the order here is the order on the site; the counter shows the number of posters (`23FPS`).
- **About**: the text and the credit line at the bottom.

Published changes go live without a redeploy. When you publish in `/studio`, the Studio tells the site to refresh its cached pages; the first visitor after an edit may still get the previous version, and the next one gets the new version.

## Local development

```bash
npm install
npm run dev        # http://localhost:3000
```

No env file is needed: the Sanity project ID and dataset default to the values in `src/sanity/env.ts`. See `.env.example` to override them.

## Deploying

The Vercel project is connected to the GitHub repo, so every push to `main` deploys. Content edits don't need a deploy.

When the site gets a new domain, add it as a CORS origin so the Studio and live updates work there:

```bash
npx sanity cors add https://your-domain.com --credentials
```

## Where things are

| Path | What |
| --- | --- |
| `src/components/Archive.tsx` | Home page: header, FPS counter, credits |
| `src/components/Counter.tsx` | The big “23FPS” counter on the home and About pages; `AboutCounter.tsx` steps it 00 → 23 as you scroll on About |
| `src/components/PosterCarousel.tsx` | The looping poster strip: scroll/click to enlarge the centre poster, click it again to open its project page |
| `src/components/Cursor.tsx` | The mouse pointer as a word: Scroll / View More / Close (not on touch screens) |
| `src/components/Information.tsx` | Top bar: FPS Archive · “Title” Year · Index, About |
| `src/app/(site)/projects/page.tsx` | Index page (for now only the top bar) |
| `src/app/(site)/projects/[slug]/` | Project page (for now only the top bar) |
| `src/components/Archive.module.css` | Styles for both, incl. strip sizes per screen width (`--thumb-width`, `--thumb-gap`, `--scroll-step`) |
| `src/app/(site)/about/` | About page |
| `src/app/(studio)/studio/` | Embedded Sanity Studio |
| `src/sanity/schemaTypes/` | Content model (`poster`, `about`) |
| `src/sanity/queries.ts` | GROQ queries and their types |
| `scripts/import-legacy.ts` | One-off import of the original static site from `legacy/` (local only, not in git) |
