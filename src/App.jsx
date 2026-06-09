import { useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faLinkedinIn,
  faGithub,
  faMastodon,
} from '@fortawesome/free-brands-svg-icons'
import logoSrc from './assets/logo.png'
import { LangSwitcher } from './LangContext.jsx'
import { useLang } from './useLang.js'
import { Routes, Route, Link, useLocation } from 'react-router'
import { Home } from './Home.jsx'
import { BlogList, BlogPost } from './Blog.jsx'
import { getPost, getTitle } from './posts.js'
import { EMAIL } from './email.js'
import './App.css'

const GITHUB = 'https://github.com/bhect0'
const LINKEDIN = 'https://www.linkedin.com/in/hectorbenedicte'
const MASTODON = 'https://masto.nu/@bhect0'

function App() {
  const { lang, get_string } = useLang()
  const location = useLocation()

  // Document <title> and meta description, per route + language.
  // (LangContext only keeps <html lang> in sync.)
  useEffect(() => {
    const siteTitle = get_string('title', 'meta')
    let title = siteTitle
    let description = get_string('description', 'meta')

    if (location.pathname === '/blog') {
      title = `${get_string('title', 'blog')} — ${siteTitle}`
      description = get_string('intro', 'blog')
    } else if (location.pathname.startsWith('/blog/')) {
      const post = getPost(location.pathname.slice('/blog/'.length))
      if (post) title = `${getTitle(post, lang)} — ${siteTitle}`
    }

    document.title = title
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) metaDesc.setAttribute('content', description)
  }, [location, lang, get_string])

  // On navigation: scroll to the hash target if there is one (the home's
  // section links use it), otherwise scroll to the top.
  useEffect(() => {
    if (location.hash) {
      document.getElementById(location.hash.slice(1))?.scrollIntoView()
    } else {
      window.scrollTo(0, 0)
    }
  }, [location])

  return (
    <>
      <header className="site-header">
        <div className="site-header-inner">
          <Link to="/" className="logo">
            <img src={logoSrc} alt="Héctor Benedicte" />
          </Link>
          <nav>
            <Link to="/#services">{get_string('services', 'nav')}</Link>
            <Link to="/blog">{get_string('blog', 'nav')}</Link>
            <Link to="/#contact">{get_string('contact', 'nav')}</Link>
          </nav>
          <LangSwitcher />
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>

      <footer className="site-footer">
        <a href={`mailto:${EMAIL}`} className="footer-email">
          {EMAIL}
        </a>
        <div className="footer-social">
          <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FontAwesomeIcon icon={faLinkedinIn} />
          </a>
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FontAwesomeIcon icon={faGithub} />
          </a>
          <a href={MASTODON} target="_blank" rel="me noopener noreferrer" aria-label="Mastodon">
            <FontAwesomeIcon icon={faMastodon} />
          </a>
        </div>
        <p>© {new Date().getFullYear()} Héctor Benedicte</p>
      </footer>
    </>
  )
}

export default App
