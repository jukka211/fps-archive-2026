// Public identifiers, not secrets. Override with env vars (see .env.example),
// e.g. to point a preview deployment at another dataset.
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'rq2riu6f'
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-09-01'
