import { useContext } from 'react'
import { LangContext } from './LangContext.jsx'

// Custom hook: any descendant of LangProvider can call useLang()
// to read { lang, setLang, get_string } without prop drilling.
//
// Lives in its own file because `react-refresh/only-export-components`
// expects .jsx files to export *only* components. Hooks and constants
// belong in a separate .js file.
export function useLang() {
  const ctx = useContext(LangContext)
  if (!ctx) {
    throw new Error('useLang must be used inside <LangProvider>')
  }
  return ctx
}
