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
    <section id="top" className="hero-stage is-ready relative" aria-label="Homepage hero canvas">
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
        <div className="hero-content w-full px-4 sm:px-6 md:px-8">
          <div className="hero-header w-full max-w-2xl text-left flex flex-col items-start">
            <h1 className="hero-title flex flex-col text-left font-bold text-white tracking-tight">
              <span className="hero-title-line block">Trade your notes.</span>
              <span className="hero-title-line block">Tutor your peers.</span>
              <span className="hero-title-line block text-amber-300">Grow your hustle.</span>
            </h1>
            
            <div className="hero-copy mt-4 sm:mt-5 w-full max-w-xl text-left">
              <p className="hero-description text-sm sm:text-base md:text-lg text-white/90 leading-relaxed">
                Campus Hustle connects Ethiopian university students to buy verified study notes, book top peer tutors, and monetize academic excellence with Telebirr &amp; CBE.
              </p>
            </div>

            <div className="hero-cta-row mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto" aria-label="Primary hero actions">
              <button
                className="hero-cta-group group relative flex items-center justify-center gap-2 rounded-full bg-primary px-7 py-3.5 min-h-[52px] text-base font-bold text-on-primary shadow-lg transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95 w-full sm:w-auto"
                type="button"
                onClick={handleCta}
              >
                <span className="hero-button hero-button-secondary">Start Your Hustle</span>
                <span className="hero-icon-link flex-shrink-0">
                  <svg className="action-link-icon size-5 transition-transform group-hover:translate-x-1" viewBox="0 0 116 116" fill="none" aria-hidden="true">
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
              <button
                className="hero-cta-group hero-cta-signin flex items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-7 py-3.5 min-h-[52px] text-base font-bold text-white transition-all hover:bg-white/20 w-full sm:w-auto"
                type="button"
                onClick={() => onNavigate?.('login')}
              >
                <span className="hero-button hero-button-tertiary">Sign in</span>
              </button>
            </div>
          </div>


          <div className="hero-bottom mt-16 lg:mt-auto w-full pb-8">
            <div className="hero-shop-meta-stage relative w-full overflow-hidden rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-4 sm:p-6 min-h-[140px] sm:min-h-[100px] flex items-center" aria-label="Featured notes and tutors">
              {HERO_SLIDES.map((slide, idx) => (
                <div
                  key={slide.image}
                  className={`hero-shop-meta absolute inset-0 flex flex-col sm:flex-row sm:items-center justify-center sm:justify-start p-4 sm:p-6 gap-2 sm:gap-4 lg:gap-6 transition-all duration-700 ease-in-out ${idx === activeIndex ? 'opacity-100 translate-y-0 z-10' : 'opacity-0 translate-y-4 -z-10 pointer-events-none'}`}
                  aria-hidden={idx !== activeIndex}
                >
                  <span className="hero-shop-meta-title text-xl sm:text-2xl font-bold text-white break-words line-clamp-1">{slide.title}</span>
                  <div className="flex flex-wrap items-center gap-2 text-sm sm:text-base text-gray-300">
                    <span className="hero-shop-meta-owner font-medium text-primary-300">by {slide.owner}</span>
                    <span className="hidden sm:inline text-gray-500">•</span>
                    <span className="hero-shop-meta-campus break-words text-gray-400">{slide.campus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
    </section>
  )
}
