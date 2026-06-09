import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCode,
  faCartShopping,
  faUserGraduate,
} from '@fortawesome/free-solid-svg-icons'
import { faFaceSmile } from '@fortawesome/free-regular-svg-icons'
import profileSrc from './assets/profile.jpg'
import { useLang } from './useLang.js'
import { EMAIL } from './email.js'

// Services: only the non-translatable metadata. Texts come from the
// `services` component with identifiers `<key>_title` and `<key>_description`.
const SERVICES = [
  { key: 'elearning', icon: faUserGraduate },
  { key: 'web', icon: faCode },
  { key: 'store', icon: faCartShopping },
]

// About section, kept for later (commented out below together with its JSX):
// Each timeline entry is just its year key + whether it has a description.
// Texts live in the `about` component with the prefix `timeline_<key>_*`.
// const TIMELINE = [
//   { key: '2024', hasDescription: false },
//   { key: '2020', hasDescription: true },
//   { key: '2018', hasDescription: true },
// ]
// Universal hashtags (not translated).
// const HASHTAGS = ['moodler', 'php', 'elearning', 'floss']

export function Home() {
  const { get_string } = useLang()

  return (
    <main id="top">
      <section className="hero">
        <div className="hero-text">
          <h1>
            Héctor Benedicte<span className="cursor">_</span>
          </h1>
          <p className="lead">
            {get_string('lead_pre', 'hero')}
            <span className="highlight">{get_string('lead_highlight', 'hero')}</span>
            {get_string('lead_post', 'hero')}
          </p>
          <p className="lead">{get_string('prompt', 'hero')}</p>
          <a href="#contact" className="btn btn-primary">
            {get_string('cta', 'hero')}
          </a>
        </div>
        <img src={profileSrc} alt="Héctor Benedicte" className="hero-avatar" />
      </section>

      <section id="services" className="section section-alt">
        <h2>{get_string('title', 'services')}</h2>
        <div className="cards">
          {SERVICES.map((s) => (
            <article key={s.key} className="card">
              <FontAwesomeIcon icon={s.icon} className="card-icon" />
              <h3>{get_string(`${s.key}_title`, 'services')}</h3>
              <p>{get_string(`${s.key}_description`, 'services')}</p>
            </article>
          ))}
        </div>
      </section>

      {/*
      <section id="about" className="section">
        <h2>{get_string('title', 'about')}</h2>
        <div className="about">
          <p>{get_string('description', 'about')}</p>
          <ul className="hashtags">
            {HASHTAGS.map((tag) => (
              <li key={tag} className="hashtag">#{tag}</li>
            ))}
          </ul>
        </div>

        <h3 className="timeline-title">{get_string('timeline_title', 'about')}</h3>
        <ol className="timeline">
          {TIMELINE.map((entry) => (
            <li key={entry.key} className="timeline-item">
              <div className="timeline-period">
                {get_string(`timeline_${entry.key}_period`, 'about')}
              </div>
              <div className="timeline-content">
                <strong>{get_string(`timeline_${entry.key}_place`, 'about')}</strong>
                {' · '}
                {get_string(`timeline_${entry.key}_role`, 'about')}
              </div>
              {entry.hasDescription && (
                <p className="timeline-desc">
                  {get_string(`timeline_${entry.key}_description`, 'about')}
                </p>
              )}
            </li>
          ))}
        </ol>
      </section>
      */}

      <section id="contact" className="section section-alt">
        <h2>{get_string('title', 'contact')}</h2>
        <p className="contact-intro">
          {get_string('intro', 'contact')}
          <FontAwesomeIcon icon={faFaceSmile} className="intro-icon" />
        </p>
        <div className="contact-links">
          <a href={`mailto:${EMAIL}`} className="btn btn-primary">
            {EMAIL}
          </a>
        </div>
      </section>
    </main>
  )
}
