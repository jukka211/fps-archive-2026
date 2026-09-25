// Turns a title into a URL part, e.g. “Die Sänger” → die-saenger, “I/ME” → i-me.
// Used by the Studio's “Generate” button and scripts/import-legacy.ts.
const GERMAN: Record<string, string> = {ä: 'ae', ö: 'oe', ü: 'ue', ß: 'ss'}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[äöüß]/g, (char) => GERMAN[char])
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 96)
}
