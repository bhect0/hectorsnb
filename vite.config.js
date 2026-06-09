import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import esMeta from './src/lang/es/meta.js'

// Inyecta el título y la descripción del idioma por defecto (es) en
// index.html, para que el <title>/meta estáticos salgan de una sola
// fuente de verdad: src/lang/es/meta.js. React los sobrescribe luego
// por ruta/idioma (ver el useEffect de App.jsx).
function htmlMeta() {
  return {
    name: 'html-meta',
    transformIndexHtml(html) {
      return html
        .replaceAll('{{title}}', esMeta.title)
        .replaceAll('{{description}}', esMeta.description)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), htmlMeta()],
})
