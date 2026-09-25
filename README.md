# FPS Archive

Next.js 16 site with Sanity for content, deployed on Vercel.

- **Site**: `/` (poster archive) and `/about`
- **Studio**: `/studio`, where you edit posters and the About text (log in with your Sanity account)
- **Sanity project**: `rq2riu6f`, dataset `production` ([manage](https://www.sanity.io/manage/project/rq2riu6f))

## Editing content

Open `/studio` on the live site (or `http://localhost:3000/studio` locally).

- **Project-Posters**: film title, year, poster image (WebP/JPG/PNG or animated GIF) and credits. Drag posters to reorder them; the order here is the order on the site; the counter shows the number of posters (`23FPS`).
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
| `src/components/Archive.tsx` | Home page: poster columns, hover/zoom, FPS counter, mobile thumbnail strip |
| `src/components/Archive.module.css` | Its styles, ported from the original `style.css` |
| `src/app/(site)/about/` | About page |
| `src/app/(studio)/studio/` | Embedded Sanity Studio |
| `src/sanity/schemaTypes/` | Content model (`poster`, `about`) |
| `src/sanity/queries.ts` | GROQ queries and their types |
| `scripts/import-legacy.ts` | One-off import of the original static site from `legacy/` (local only, not in git) |
