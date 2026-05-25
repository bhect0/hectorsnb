import { createContext, useEffect, useMemo, useState } from 'react'
import {
  SUPPORTED_LANGS,
  getInitialLang,
  saveLang,
  makeGetString,
} from './i18n'
import { useLang } from './useLang.js'

// React Context: starts as null and the provider fills in the real value.
// Exported so `useLang` (in useLang.js) can consume it.
// eslint-disable-next-line react-refresh/only-export-components -- the Context ships with the Provider; the hook lives in useLang.js
export const LangContext = createContext(null)

export function LangProvider({ children }) {
  const [lang, setLangState] = useState(getInitialLang)

  // Changes the language and persists it at the same time.
  const setLang = (next) => {
    if (!SUPPORTED_LANGS.includes(next)) return
    setLangState(next)
    saveLang(next)
  }

  // `get_string` depends on the current language: memoize it so the reference
  // only changes when `lang` changes.
  const get_string = useMemo(() => makeGetString(lang), [lang])

  // When the language changes: update <html lang>, the <title>, and the meta description.
  useEffect(() => {
    document.documentElement.lang = lang
    document.title = get_string('title', 'meta')
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', get_string('description', 'meta'))
  }, [lang, get_string])

  return (
    <LangContext.Provider value={{ lang, setLang, get_string }}>
      {children}
    </LangContext.Provider>
  )
}

// Compact language selector, designed to sit in the header.
export function LangSwitcher() {
  const { lang, setLang } = useLang()
  return (
    <div className="lang-switcher" role="group" aria-label="Idioma / Language">
      {SUPPORTED_LANGS.map((code) => (
        <button
          key={code}
          type="button"
          className={code === lang ? 'active' : ''}
          onClick={() => setLang(code)}
          aria-pressed={code === lang}
        >
          {code.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
