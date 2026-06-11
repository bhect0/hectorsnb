// Badges, sorted newest first. Names are kept as issued (not translated);
// only the section texts live in the `badges` lang component. Dates are
// 'YYYY-MM' and get formatted in the visitor's language with formatBadgeDate().
//
// `url` is the public verification page and `image` the official badge image
// (512x512 PNGs under assets/badges/).
import moodleTester2026 from './assets/badges/moodle-tester-2026.png'
import helpfulMoodler2026 from './assets/badges/particularly-helpful-moodler-2026.png'
import communityForums from './assets/badges/community-forums.png'
import unitTesting from './assets/badges/unit-testing.png'
import mdk from './assets/badges/mdk.png'
import futuroOpenBadges from './assets/badges/futuro-open-badges.png'
import accessibleDevelopment from './assets/badges/accessible-development-practices.png'
import accessSecurity from './assets/badges/access-security-essentials.png'
import architectureApis from './assets/badges/architecture-apis.png'
import outputEssentials from './assets/badges/output-essentials.png'
import developmentEnvironment from './assets/badges/development-environment.png'

export const LINKEDIN_CERTIFICATIONS =
  'https://www.linkedin.com/in/hectorbenedicte/details/certifications/'

export const BADGES = [
  {
    name: 'Moodle Tester 2026',
    issuer: 'Moodle',
    date: '2026-04',
    url: 'https://moodle.org/badges/badge.php?hash=51fd54cec9e30362742ff2e1c9a25321b2b3964a',
    image: moodleTester2026,
  },
  {
    name: 'Particularly Helpful Moodler 2026',
    issuer: 'Moodle',
    date: '2026-03',
    url: 'https://moodle.org/badges/badge.php?hash=d6f417b8990073b3ea06298675d1e10ee0d83283',
    image: helpfulMoodler2026,
  },
  {
    name: 'Moodle Community Forums',
    issuer: 'Moodle Academy',
    date: '2026-01',
    url: 'https://moodle.academy/badges/badge.php?hash=cbc70c7738e0fd1ce7ccd0b320f0898c30a436db',
    image: communityForums,
  },
  {
    name: 'Unit Testing in Moodle',
    issuer: 'Moodle',
    date: '2025-10',
    url: 'https://moodle.academy/badges/badge.php?hash=624bb263dadc1a38528b80d1a8f1c1f1bdee7c07',
    image: unitTesting,
  },
  {
    name: 'Working with MDK',
    issuer: 'Moodle',
    date: '2025-10',
    url: 'https://moodle.academy/badges/badge.php?hash=8eb5954b252b8cef9f17320636ed4b879df75f1d',
    image: mdk,
  },
  {
    name: 'MoodleMoot Spain 2025: Asistente «Futuro de Open Badges»',
    issuer: 'Moodle',
    date: '2025-04',
    url: 'https://moodlemoot.es/badges/badge.php?hash=ea4469715d24ad81c32789dbb77fbda52ae539e9',
    image: futuroOpenBadges,
  },
  {
    name: 'Accessible Development Practices',
    issuer: 'Moodle',
    date: '2023-06',
    url: 'https://moodle.academy/badges/badge.php?hash=820455b879b2410eee642f803df80caa0d434979',
    image: accessibleDevelopment,
  },
  {
    name: 'Moodle Access and Security Essentials',
    issuer: 'Moodle',
    date: '2023-06',
    url: 'https://moodle.academy/badges/badge.php?hash=d8d38dfbefb30a674aff389dc090fe666ae64e61',
    image: accessSecurity,
  },
  {
    name: 'Moodle’s Modular Architecture and APIs',
    issuer: 'Moodle',
    date: '2023-06',
    url: 'https://moodle.academy/badges/badge.php?hash=31c4585dfa01d5541637cee08c333913dc4b3caa',
    image: architectureApis,
  },
  {
    name: 'Web Output Essentials',
    issuer: 'Moodle',
    date: '2023-05',
    url: 'https://moodle.academy/badges/badge.php?hash=f062f098576f0f19f8bf4da818a3749784be539f',
    image: outputEssentials,
  },
  {
    name: 'Set up your Moodle Development Environment',
    issuer: 'Moodle',
    date: '2023-05',
    url: 'https://moodle.academy/badges/badge.php?hash=ffdb3c8932bf3bae0ad83e9d0355022879030ba7',
    image: developmentEnvironment,
  },
]

// 'YYYY-MM' → 'abr 2026' / 'Apr 2026', following the current language.
export function formatBadgeDate(date, lang) {
  const [year, month] = date.split('-').map(Number)
  return new Intl.DateTimeFormat(lang, {
    month: 'short',
    year: 'numeric',
  }).format(new Date(year, month - 1))
}
