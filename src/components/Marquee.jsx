const SCHOOLS = [
  'Addis Ababa University (AAU)',
  'AASTU (Addis Ababa Science & Tech)',
  'ASTU (Adama Science & Tech)',
  'Jimma University',
  'Hawassa University',
  'Bahir Dar University',
  'Mekelle University',
  'Arba Minch University',
  'Haramaya University',
  'Dilla University',
]

export default function Marquee() {
  return (
    <div className="campus-sticky-group">
      <section className="campus-section" aria-label="Supported universities">
        <p className="campus-section-label">Supported Ethiopian Universities</p>
        <div className="campus-section-inner">
          <p className="sr-only">{SCHOOLS.join(', ')}</p>
          <div className="campus-name-display" aria-hidden="true">
            <div className="overflow-hidden campus-school-slider">
              <div className="flex w-max" style={{ gap: '0px', flexDirection: 'row' }}>
                <div className="campus-marquee-sequence animate-[marquee_28s_linear_infinite]">
                  {SCHOOLS.map((school) => (
                    <span key={school} className="campus-item">
                      <span>{school}</span>
                      <span className="campus-dot">·</span>
                    </span>
                  ))}
                </div>
                <div className="campus-marquee-sequence animate-[marquee_28s_linear_infinite]">
                  {SCHOOLS.map((school) => (
                    <span key={`dup-${school}`} className="campus-item">
                      <span>{school}</span>
                      <span className="campus-dot">·</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
