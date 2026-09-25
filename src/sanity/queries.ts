import {defineQuery, type PortableTextBlock} from 'next-sanity'

export const POSTERS_QUERY = defineQuery(`
  *[_type == "poster" && defined(image.asset)] | order(orderRank asc) {
    _id,
    title,
    year,
    "image": image.asset->{
      url,
      mimeType,
      "width": metadata.dimensions.width,
      "height": metadata.dimensions.height
    },
    credits[]{_key, role, name, url}
  }
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
  image: {
    url: string
    mimeType: string | null
    width: number
    height: number
  }
  credits: Credit[] | null
}

export type About = {
  body: PortableTextBlock[] | null
  colophon: PortableTextBlock[] | null
} | null
