// Email anti-scraper: dividimos usuario y dominio para que el literal
// `hector@hectorsnb.com` no aparezca en el bundle JS. Resolvemos el '@'
// con `atob('QA==')` porque el minificador de Vite (esbuild) no hace
// constant folding sobre `atob` — sí lo hace sobre alternativas como
// `String.fromCharCode(64)` o `decodeURIComponent('%40')`, que dejarían
// el email entero como string literal en el bundle.
// Así esquivamos regex tipo /\w+@\w+\.\w+/ que usan los scrapers simples.
const EMAIL_USER = 'hector'
const EMAIL_HOST = 'hectorsnb.com'
export const EMAIL = `${EMAIL_USER}${atob('QA==')}${EMAIL_HOST}`
