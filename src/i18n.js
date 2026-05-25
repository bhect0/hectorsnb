// String system inspired by Moodle's String API.
// https://docs.moodle.org/dev/String_API
//
// Texts live in `src/lang/<language>/<component>.js`, each file being a flat
// object { identifier: 'Text' }. The `get_string(id, component, a)` function
// looks them up and applies Moodle-style placeholders.

// Vite loads *all* files in the directory synchronously at build time.
// `eager: true` prevents them from becoming dynamic chunks and makes them
// immediately available as plain imports.
const modules = import.meta.glob('./lang/*/*.js', { eager: true })

// Builds { es: { nav: {...}, hero: {...} }, en: { ... } } from the files
// loaded above. The keys are extracted from the path with a regex.
export const strings = {}
for (const path in modules) {
  const match = path.match(/\.\/lang\/([^/]+)\/([^/]+)\.js$/)
  if (!match) continue
  const [, lang, component] = match
  if (!strings[lang]) strings[lang] = {}
  strings[lang][component] = modules[path].default
}

export const SUPPORTED_LANGS = ['es', 'en']
const STORAGE_KEY = 'hectorsnb.lang'

// Picks the initial language:
// 1. the one saved in localStorage if valid
// 2. the browser language if supported
// 3. Spanish as the default
export function getInitialLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && SUPPORTED_LANGS.includes(saved)) return saved
  } catch {
    // localStorage may be unavailable (e.g. private mode in some browsers).
  }
  const browser = navigator.language?.slice(0, 2)
  if (SUPPORTED_LANGS.includes(browser)) return browser
  return 'es'
}

export function saveLang(lang) {
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // ignore if we can't persist
  }
}

// Applies Moodle-style placeholders:
//   {$a}         → when `a` is a scalar (string/number)
//   {$a->field}  → when `a` is an object, replaced with a.field
function applyPlaceholders(str, a) {
  if (a === undefined || a === null) return str
  if (typeof a !== 'object') {
    return String(str).replace(/\{\$a\}/g, String(a))
  }
  return String(str).replace(/\{\$a->(\w+)\}/g, (_, key) =>
    a[key] !== undefined ? String(a[key]) : '',
  )
}

// Builds a `get_string` function bound to a specific language.
// Equivalent to get_string($id, $component, $a) in Moodle.
// If the string is missing it returns `[[component/id]]` as a visual hint,
// mirroring how Moodle renders `[[id, component]]` for missing translations.
export function makeGetString(lang) {
  return function get_string(id, component, a) {
    const value = strings[lang]?.[component]?.[id]
    if (value === undefined) return `[[${component}/${id}]]`
    return applyPlaceholders(value, a)
  }
}
