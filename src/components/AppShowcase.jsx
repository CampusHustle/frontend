export default function AppShowcase({ onNavigate }) {
  const handleNav = (e) => {
    e.preventDefault()
    if (onNavigate) onNavigate('marketplace')
  }

  return (
    <section className="app-showcase-section">
      <div className="app-showcase-grid-wrap">
        <svg aria-hidden="true" className="grid-pattern-svg app-showcase-grid">
          <defs>
            <pattern id="app_grid_pat" width="36" height="36" patternUnits="userSpaceOnUse" x="-1" y="-1">
              <path d="M.5 36V.5H36" fill="none" strokeDasharray="0" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" strokeWidth="0" fill="url(#app_grid_pat)" />
        </svg>
      </div>

      <svg
        className="app-showcase-bag"
        viewBox="0 0 300 380"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M 96 108 C 90 52 120 34 150 34 C 180 34 210 52 204 108" />
        <path d="M 104 108 C 99 60 124 44 150 44 C 176 44 201 60 196 108" strokeWidth="1" opacity="0.5" />
        <path d="M 52 108 L 60 86 L 240 86 L 248 108" />
        <path d="M 52 108 L 248 108 L 268 348 L 32 348 Z" />
        <line x1="52" y1="108" x2="32" y2="348" />
        <line x1="64" y1="108" x2="46" y2="348" />
        <line x1="248" y1="108" x2="268" y2="348" />
        <line x1="236" y1="108" x2="254" y2="348" />
        <line x1="46" y1="192" x2="254" y2="192" />
        <line x1="34" y1="326" x2="266" y2="326" />
        <line x1="150" y1="108" x2="150" y2="348" strokeWidth="1" opacity="0.4" />
        <rect x="138" y="54" width="24" height="16" rx="3" strokeWidth="0.8" />
        <circle cx="150" cy="266" r="26" strokeWidth="0.8" />
      </svg>

      <p className="app-showcase-left">
        <span className="app-showcase-left-line app-showcase-left-line-desktop-only">Find top notes &amp;</span>
        <span className="app-showcase-left-line app-showcase-left-line-desktop-only">peer tutors all</span>
        <span className="app-showcase-left-line app-showcase-left-line-mobile-only">Find top notes &amp; peer tutors all</span>
        <span className="app-showcase-left-line">in one place.</span>
      </p>

      <div className="app-showcase-phone">
        <img
          alt="Campus Hustle peer mentorship and tutor app"
          loading="lazy"
          width="1200"
          height="2133"
          className="app-showcase-phone-img rounded-3xl shadow-2xl object-cover max-h-[580px]"
          style={{ color: 'transparent' }}
          src="/assets/generated/app_mentorship_mockup_1787121493202.jpg"
        />
      </div>

      <div className="app-showcase-right-col">
        <p className="app-showcase-right">
          No more searching <br className="app-showcase-break" />
          through scattered <br className="app-showcase-break" />
          Telegram groups, drives, <br className="app-showcase-break" />
          or word of mouth.
        </p>
        <div className="app-showcase-cta">
          <a className="hero-cta-group" href="#" onClick={handleNav}>
            <span className="hero-button hero-button-secondary">Explore Notes</span>
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
          </a>
        </div>
      </div>
    </section>
  )
}
