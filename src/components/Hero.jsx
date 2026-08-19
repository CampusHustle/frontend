import { useState, useEffect, useRef } from 'react'

const HERO_SLIDES = [
  {
    image: '/assets/generated/hero_ethiopian_student_1787086111395.jpg',
    title: 'Algorithms & Data Structures Guide',
    owner: 'Selamawit Bekele',
    campus: 'Addis Ababa University (AAiT)',
  },
  {
    image: '/assets/generated/hero_ethiopian_male_1787086185387.jpg',
    title: 'Circuit Analysis & Electronics Vault',
    owner: 'Dawit Haile',
    campus: 'AAU 4-Kilo Campus',
  },
  {
    image: '/assets/generated/hero_ethiopian_group_1787086260672.jpg',
    title: 'Multi-Variable Calculus Peer Tutoring',
    owner: 'Kirubel Assefa & Betelhem Worku',
    campus: 'ASTU (Adama)',
  },
  {
    image: '/assets/generated/hero_ethiopian_science_1787086338339.jpg',
    title: 'Clinical Skills & Anatomy Vault',
    owner: 'Rahel Tesfaye',
    campus: 'Tikur Anbessa Health Sciences',
  },
]

export default function Hero({ onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 4500)
    return () => clearInterval(timerRef.current)
  }, [])

  const handleCta = (e) => {
    e.preventDefault()
    if (onNavigate) {
      onNavigate('signup')
    }
  }

  return (
    <section className="hero-stage is-ready relative" aria-label="Homepage hero canvas">
      <div
        className="page-canvas"
        style={{
          '--hero-scroll-opacity': 1,
          '--hero-scroll-card-scale': 1,
          '--hero-scroll-content-scale': 1,
          '--hero-scroll-content-shift': '0px',
        }}
      >
        {/* Background Stack */}
        <div className="hero-background-stack" aria-hidden="true">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.image}
              className={`hero-background-layer ${idx === activeIndex ? 'is-active' : ''}`}
            >
              <img
                alt=""
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  height: '100%',
                  width: '100%',
                  left: 0,
                  top: 0,
                  right: 0,
                  bottom: 0,
                  objectFit: 'cover',
                  color: 'transparent',
                }}
                src={slide.image}
              />
            </div>
          ))}
        </div>

        {/* SVG Line Art Illustrations */}
        <div className="hero-illustration-layer" aria-hidden="true">
          <svg className="hero-line-art hero-line-art-cart" viewBox="0 0 520 520" fill="none" aria-hidden="true">
            <path d="M82 126H126L162 312H372L420 184H188" pathLength="1" style={{ animationDelay: '0ms', animationDuration: '190ms' }} />
            <path d="M126 126H154" pathLength="1" style={{ animationDelay: '190ms', animationDuration: '140ms' }} />
            <path d="M214 160L244 104H330" pathLength="1" style={{ animationDelay: '330ms', animationDuration: '190ms' }} />
            <path d="M212 218H382" pathLength="1" style={{ animationDelay: '520ms', animationDuration: '140ms' }} />
            <path d="M230 272H370" pathLength="1" style={{ animationDelay: '660ms', animationDuration: '140ms' }} />
            <path d="M176 336H364" pathLength="1" style={{ animationDelay: '800ms', animationDuration: '140ms' }} />
            <circle cx="196" cy="392" r="26" pathLength="1" style={{ animationDelay: '940ms', animationDuration: '210ms' }} />
            <circle cx="344" cy="392" r="26" pathLength="1" style={{ animationDelay: '1150ms', animationDuration: '210ms' }} />
          </svg>

          <svg className="hero-line-art hero-line-art-school" viewBox="0 0 560 667" fill="none" aria-hidden="true">
            <path d="M58 644H502" pathLength="1" style={{ animationDelay: '1440ms', animationDuration: '60ms' }} />
            <path d="M78 634V432H224V634" pathLength="1" style={{ animationDelay: '1500ms', animationDuration: '60ms' }} />
            <path d="M336 432H482V634" pathLength="1" style={{ animationDelay: '1500ms', animationDuration: '60ms' }} />
            <path d="M224 666V354H336V666" pathLength="1" style={{ animationDelay: '1620ms', animationDuration: '60ms' }} />
            <path d="M206 432H354" pathLength="1" style={{ animationDelay: '1680ms', animationDuration: '60ms' }} />
            <path d="M78 432H224" pathLength="1" style={{ animationDelay: '1740ms', animationDuration: '60ms' }} />
            <path d="M336 432H482" pathLength="1" style={{ animationDelay: '1800ms', animationDuration: '60ms' }} />
            <path d="M104 432L122 388H200L224 432" pathLength="1" style={{ animationDelay: '1860ms', animationDuration: '60ms' }} />
            <path d="M336 432L360 388H438L456 432" pathLength="1" style={{ animationDelay: '1920ms', animationDuration: '60ms' }} />
            <path d="M224 354L240 316H320L336 354" pathLength="1" style={{ animationDelay: '1980ms', animationDuration: '60ms' }} />
            <circle cx="280" cy="270" r="34" pathLength="1" style={{ animationDelay: '3060ms', animationDuration: '60ms' }} />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="hero-content">
          <div className="hero-header">
            <h1 className="hero-title">
              <span className="hero-title-line">Trade your notes.</span>
              <span className="hero-title-line">Tutor your peers.</span>
              <span className="hero-title-line">Grow your hustle.</span>
            </h1>
            <div className="hero-copy">
              <p className="hero-description">
                <span className="hero-description-line">Campus Hustle connects Ethiopian university students to</span>
                <span className="hero-description-line"> buy verified study notes, book top peer tutors, and</span>
                <span className="hero-description-line"> monetize academic excellence with Telebirr &amp; CBE.</span>
              </p>
            </div>
            <div className="hero-cta-row" aria-label="Primary hero actions">
              <button className="hero-cta-group" type="button" onClick={handleCta}>
                <span className="hero-button hero-button-secondary">Start Your Hustle</span>
                <span className="hero-icon-link">
                  <svg className="action-link-icon" viewBox="0 0 116 116" fill="none" aria-hidden="true">
                    <circle cx="57.9961" cy="58" r="48.5" stroke="currentColor" strokeWidth="3" />
                    <path
                      d="M38.7276 82.1197L76.9948 33.5985M36.0114 38.4406L76.9948 33.5985L81.837 74.582"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          <div className="hero-bottom">
            <div className="hero-shop-meta-stage" aria-label="Featured notes and tutors">
              {HERO_SLIDES.map((slide, idx) => (
                <div
                  key={slide.image}
                  className={`hero-shop-meta ${idx === activeIndex ? 'is-active' : ''}`}
                  aria-hidden={idx !== activeIndex}
                >
                  <span className="hero-shop-meta-title">{slide.title}</span>
                  <span className="hero-shop-meta-owner">by {slide.owner}</span>
                  <span className="hero-shop-meta-campus">{slide.campus}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
