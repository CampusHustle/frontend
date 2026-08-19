const SCHOOLS = [
  "Addis Ababa University (AAU)",
  "Jimma University",
  "Hawassa University",
  "Bahir Dar University",
  "University of Gondar",
  "Mekelle University",
  "Haramaya University",
  "Addis Ababa Science and Technology University (AASTU)",
  "Adama Science and Technology University (ASTU)",
  "Arba Minch University",
  "Ambo University",
  "Wollo University",
  "Debre Berhan University",
  "Wollega University",
  "Dire Dawa University",
  "Mizan-Tepi University",
  "Dilla University",
  "Wolaita Sodo University",
  "Jijiga University",
  "Debre Markos University",
  "Debre Tabor University",
  "Wolkite University",
  "Arsi University",
  "Madda Walabu University",
  "Mattu University",
  "Adigrat University",
  "Axum University",
  "Bule Hora University",
  "Wachemo University",
  "Jinka University",
  "Samara University",
  "Dembi Dolo University",
];

export default function Marquee() {
  return (
    <div className="campus-sticky-group">
      <section className="campus-section" aria-label="Supported universities">
        <p className="campus-section-label">Supported Ethiopian Universities</p>
        <div className="campus-section-inner">
          <p className="sr-only">{SCHOOLS.join(", ")}</p>
          <div className="campus-name-display" aria-hidden="true">
            <div className="campus-school-slider">
              <div className="campus-marquee-track">
                <div className="campus-marquee-sequence">
                  {SCHOOLS.map((school) => (
                    <span key={school} className="campus-item">
                      <span>{school}</span>
                      <span className="campus-dot">·</span>
                    </span>
                  ))}
                </div>
                <div className="campus-marquee-sequence">
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
  );
}
