import {defineQuery, type PortableTextBlock} from 'next-sanity'

export const POSTERS_QUERY = defineQuery(`
  *[_type == "poster" && defined(image.asset)] | order(orderRank asc) {
    _id,
    title,
    year,
    "slug": slug.current,
    "image": image.asset->{
      url,
      mimeType,
      "width": metadata.dimensions.width,
      "height": metadata.dimensions.height
    },
    credits[]{_key, role, name, url}
  }
`)

// How many posters the home page shows (the same filter as POSTERS_QUERY).
export const POSTER_COUNT_QUERY = defineQuery(`
  count(*[_type == "poster" && defined(image.asset)])
`)

export const PROJECT_SLUGS_QUERY = defineQuery(`
  *[_type == "poster" && defined(slug.current)]{"slug": slug.current}
`)

export const PROJECT_QUERY = defineQuery(`
  *[_type == "poster" && slug.current == $slug][0]{title, year}
`)

export const ABOUT_QUERY = defineQuery(`
  *[_id == "about"][0]{body, colophon}
`)

export type Credit = {
  _key: string
  role: string | null
  name: string | null
  url: string | null
}

export type Poster = {
  _id: string
  title: string | null
  year: number | null
  slug: string | null
  image: {
    url: string
    mimeType: string | null
    width: number
    height: number
  }
  credits: Credit[] | null
}

export type Project = {
  title: string | null
  year: number | null
} | null

export type About = {
  body: PortableTextBlock[] | null
  colophon: PortableTextBlock[] | null
} | null
