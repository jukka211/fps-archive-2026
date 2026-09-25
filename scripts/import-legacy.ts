/**
 * One-off import of the original static site (legacy/) into Sanity:
 * every poster with its title, year, image and credits, plus the About text.
 *
 *   npm run import-legacy                  # skips documents that already exist
 *   npm run import-legacy -- --replace     # overwrites them (loses Studio edits!)
 *   npm run import-legacy -- --dry-run     # prints what would be imported
 */
import {createReadStream, readFileSync} from 'node:fs'
import path from 'node:path'
import {randomUUID} from 'node:crypto'

import {LexoRank} from 'lexorank'

import {slugify} from '../src/sanity/slugify'

const LEGACY_DIR = path.join(process.cwd(), 'legacy')
const PLACEHOLDER_NAME = 'Vorname Nachname'

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const replace = args.includes('--replace')

type Credit = {role: string; name: string; url?: string}
type LegacyPoster = {id: string; title: string; year?: number; file: string; credits: Credit[]}

const key = () => randomUUID().replaceAll('-', '').slice(0, 12)

function decode(html: string) {
  return html
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function readPosters(): LegacyPoster[] {
  const html = readFileSync(path.join(LEGACY_DIR, 'index.html'), 'utf8')

  const titles = new Map<string, string>()
  for (const [, n, text] of html.matchAll(/<tag class="title(\d+)">([^<]*)<\/tag>/g)) {
    titles.set(n, decode(text))
  }

  const credits = new Map<string, Credit[]>()
  const creditsHtml = html.slice(html.indexOf('<div class="container2">'))
  const blocks = creditsHtml.split(/<div class="text(\d+)">/)
  for (let i = 1; i < blocks.length; i += 2) {
    const list: Credit[] = []
    const namePattern = /<div class="name"><tag class="type">([^<]*)<\/tag>([\s\S]*?)<\/div>/g
    for (const [, role, content] of blocks[i + 1].matchAll(namePattern)) {
      const link = content.match(/<a href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/)
      const name = decode(link ? link[2] : content)
      if (!name || name === PLACEHOLDER_NAME) continue
      list.push({role: decode(role), name, ...(link ? {url: link[1]} : {})})
    }
    credits.set(String(Number(blocks[i])), list)
  }

  const posters: LegacyPoster[] = []
  const columnPattern =
    /<div class="column"\s*id="(\d+)"[^>]*>\s*<div class="trigger-container"[^>]*><img src="([^"]+)"/g
  for (const [, id, file] of html.matchAll(columnPattern)) {
    const n = String(Number(id))
    const heading = titles.get(n)
    const match = heading?.match(/^“(.+?)”\s*(\d{4})?$/)
    if (!match) throw new Error(`Could not parse title for poster ${id}: ${heading}`)
    posters.push({
      id,
      title: match[1],
      ...(match[2] ? {year: Number(match[2])} : {}),
      file,
      credits: credits.get(n) ?? [],
    })
  }
  return posters
}

function readAboutParagraphs(): string[] {
  const html = readFileSync(path.join(LEGACY_DIR, 'contact.html'), 'utf8')
  const text = html.match(/<div class="Text">([\s\S]*?)<\/div>/)?.[1]
  if (!text) throw new Error('Could not find the About text in legacy/contact.html')
  return text
    .split(/\n\s*\n/)
    .map(decode)
    .filter(Boolean)
}

type Span = string | {text: string; href: string}

function block(parts: Span[]) {
  const markDefs: {_key: string; _type: 'link'; href: string}[] = []
  const children = parts.map((part) => {
    if (typeof part === 'string') return {_type: 'span', _key: key(), text: part, marks: []}
    const markKey = key()
    markDefs.push({_key: markKey, _type: 'link', href: part.href})
    return {_type: 'span', _key: key(), text: part.text, marks: [markKey]}
  })
  return {_type: 'block', _key: key(), style: 'normal', markDefs, children}
}

async function main() {
  const posters = readPosters()
  const about = {
    _id: 'about',
    _type: 'about',
    body: readAboutParagraphs().map((p) => block([p])),
    colophon: [
      block([
        'Realization, Graphic Design Flowers to ',
        {text: 'Ivan Sukhov', href: 'http://sukhov.xyz/'},
        ' together with ',
        {text: 'Studio Es', href: 'https://www.studio-es.at/'},
        '.',
      ]),
    ],
  }

  if (dryRun) {
    for (const p of posters) {
      const credits = p.credits.map((c) => `${c.role}: ${c.name}${c.url ? ` <${c.url}>` : ''}`)
      console.log(`${p.id} “${p.title}” ${p.year ?? '—'}  [${p.file}]`)
      console.log(credits.length ? `     ${credits.join('\n     ')}` : '     (no credits)')
    }
    console.log(`\nAbout: ${about.body.length} paragraphs`)
    return
  }

  const {getCliClient} = await import('sanity/cli')
  const client = getCliClient({apiVersion: '2026-09-01'})
  const {projectId, dataset} = client.config()
  console.log(`Importing into ${projectId}/${dataset}…`)

  const existing = new Set<string>(await client.fetch(`*[_type in ["poster", "about"]]._id`))
  const write = <T extends {_id: string; _type: string}>(doc: T) =>
    replace ? client.createOrReplace(doc) : client.createIfNotExists(doc)

  // Page URLs: the title, plus -2, -3 … for posters of the same film.
  const slugCount = new Map<string, number>()
  const uniqueSlug = (title: string) => {
    const base = slugify(title)
    const n = (slugCount.get(base) ?? 0) + 1
    slugCount.set(base, n)
    return n === 1 ? base : `${base}-${n}`
  }

  let rank = LexoRank.min()
  for (const poster of posters) {
    rank = rank.genNext().genNext()
    const slug = uniqueSlug(poster.title)
    const _id = `poster-${poster.id}`
    if (existing.has(_id) && !replace) {
      console.log(`  skip   ${_id} (exists)`)
      continue
    }
    const asset = await client.assets.upload(
      'image',
      createReadStream(path.join(LEGACY_DIR, poster.file)),
      {filename: path.basename(poster.file)},
    )
    await write({
      _id,
      _type: 'poster',
      orderRank: rank.toString(),
      title: poster.title,
      slug: {_type: 'slug', current: slug},
      ...(poster.year ? {year: poster.year} : {}),
      image: {_type: 'image', asset: {_type: 'reference', _ref: asset._id}},
      credits: poster.credits.map((c) => ({_type: 'credit', _key: key(), ...c})),
    })
    console.log(`  ok     ${_id} “${poster.title}”`)
  }

  if (existing.has('about') && !replace) {
    console.log('  skip   about (exists)')
  } else {
    await write(about)
    console.log('  ok     about')
  }
  console.log('Done.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
