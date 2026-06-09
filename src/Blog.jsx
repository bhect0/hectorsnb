import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Link, useParams } from 'react-router'
import { useLang } from './useLang.js'
import profileSrc from './assets/profile.jpg'
import {
  getAllPosts,
  getPost,
  getTitle,
  getExcerpt,
  getBody,
  isTranslated,
} from './posts.js'

// Single-author blog: the byline shown on every post.
const AUTHOR = 'Héctor Benedicte'

// Localized "29 de mayo de 2026" / "May 29, 2026".
// Parse as local midnight (the bare 'YYYY-MM-DD' form is parsed as UTC, which
// can shift the day across timezones).
function formatDate(date, lang) {
  return new Intl.DateTimeFormat(lang, { dateStyle: 'long' }).format(
    new Date(`${date}T00:00:00`),
  )
}

// Custom Markdown link rendering: internal links (starting with "/") navigate
// client-side via React Router; external ones open safely in a new tab.
const markdownComponents = {
  a({ href = '', children }) {
    if (href.startsWith('/')) {
      return <Link to={href}>{children}</Link>
    }
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  },
}

export function BlogList() {
  const { lang, get_string } = useLang()
  const posts = getAllPosts()

  return (
    <main className="section blog">
      <h2>{get_string('title', 'blog')}</h2>
      <p className="blog-intro">{get_string('intro', 'blog')}</p>

      {posts.length === 0 ? (
        <p className="blog-empty">{get_string('empty', 'blog')}</p>
      ) : (
        <div className="cards">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="card post-card"
            >
              <div className="post-author">
                <img src={profileSrc} alt={AUTHOR} className="post-author-avatar" />
                <div className="post-author-info">
                  <span className="post-author-name">{AUTHOR}</span>
                  <span className="post-author-date">{formatDate(post.date, lang)}</span>
                </div>
              </div>
              <h3>{getTitle(post, lang)}</h3>
              <p>{getExcerpt(post, lang)}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}

export function BlogPost() {
  const { slug } = useParams()
  const { lang, get_string } = useLang()
  const post = getPost(slug)

  if (!post) {
    return (
      <main className="section post">
        <Link to="/blog" className="back-link">
          {get_string('back', 'blog')}
        </Link>
        <p className="blog-empty">{get_string('not_found', 'blog')}</p>
      </main>
    )
  }

  return (
    <main className="section post">
      <Link to="/blog" className="back-link">
        {get_string('back', 'blog')}
      </Link>
      <article>
        <h1 className="post-title">{getTitle(post, lang)}</h1>
        <div className="post-author">
          <img src={profileSrc} alt={AUTHOR} className="post-author-avatar" />
          <div className="post-author-info">
            <span className="post-author-name">{AUTHOR}</span>
            <span className="post-author-date">
              {formatDate(post.date, lang)}
            </span>
          </div>
        </div>
        {!isTranslated(post, lang) && (
          <p className="post-notice">{get_string('not_translated', 'blog')}</p>
        )}
        <div className="post-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
            {getBody(post, lang)}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  )
}
