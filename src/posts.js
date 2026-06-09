// Loads the blog posts at build time, the same way i18n.js loads the language
// files. Each post is a folder `posts/<YYYY-MM-DD>-<slug>/` holding one
// Markdown file per language (`es.md`, `en.md`). Metadata is derived from the
// folder name and the content — no frontmatter.
//
// `query: '?raw'` makes Vite import each .md as a plain string instead of a
// module; `eager: true` resolves them synchronously into the bundle.
const files = import.meta.glob('./posts/*/*.md', {
  eager: true,
  query: '?raw',
  import: 'default',
})

// './posts/2026-05-29-hola-mundo/es.md' → date, slug, lang
const PATH_RE = /\.\/posts\/(\d{4}-\d{2}-\d{2})-([^/]+)\/(es|en)\.md$/

const bySlug = {}
for (const path in files) {
  const match = path.match(PATH_RE)
  if (!match) continue
  const [, date, slug, lang] = match
  if (!bySlug[slug]) bySlug[slug] = { slug, date, content: {} }
  bySlug[slug].content[lang] = files[path]
}

// Newest first (ISO dates sort correctly as strings).
const allPosts = Object.values(bySlug).sort((a, b) => b.date.localeCompare(a.date))

export function getAllPosts() {
  return allPosts
}

export function getPost(slug) {
  return bySlug[slug] ?? null
}

// Requested language, falling back to whichever translation exists.
function pickContent(post, lang) {
  return post.content[lang] ?? post.content.es ?? post.content.en ?? ''
}

// False when the post has no translation for `lang` (we then show a notice).
export function isTranslated(post, lang) {
  return Boolean(post.content[lang])
}

// Title = the first `# Heading` line. Falls back to the slug.
export function getTitle(post, lang) {
  const match = pickContent(post, lang).match(/^\s*#\s+(.+)$/m)
  return match ? match[1].trim() : post.slug
}

// Excerpt for the list: the first paragraph of the body as clean text
// (Markdown stripped). The card caps it at a few lines with CSS line-clamp.
export function getExcerpt(post, lang) {
  const firstParagraph = getBody(post, lang).trim().split(/\n\s*\n/)[0] ?? ''
  return firstParagraph
    .replace(/^\s{0,3}#{1,6}\s+/gm, '') // heading markers
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1') // links/images → their text
    .replace(/[*_`]/g, '') // emphasis / inline code
    .replace(/\s+/g, ' ') // collapse wrapped lines into one
    .trim()
}

// Body without the leading `# Title` (BlogPost renders the title itself).
export function getBody(post, lang) {
  return pickContent(post, lang).replace(/^\s*#\s+.+(\r?\n)+/, '')
}
