import type {Credit} from '@/sanity/queries'

type Film = {title: string | null; year: number | null; designers: Credit[] | null}

/**
 * Each poster's frame: its number, shown as e.g. 05FPS on the home page and the
 * Index. Posters of the same film (title and year) by the same designers share
 * one, e.g. both of Lucas Hoffmann's Echo posters, so the numbers run 1, 2, 3 …
 * without gaps. Posters without designers get one each.
 */
export function frames(posters: Film[]) {
  const byFilm = new Map<string, number>()
  let last = 0
  return posters.map(({title, year, designers}) => {
    // The same name can come in differently encoded, e.g. Häfele's “ä”.
    const names = (designers ?? []).flatMap((credit) => credit.name?.normalize('NFC').trim() || [])
    if (!names.length) return ++last
    const film = JSON.stringify([title, year, names])
    let frame = byFilm.get(film)
    if (frame === undefined) byFilm.set(film, (frame = ++last))
    return frame
  })
}
