export default function Features({ onNavigate }) {
  const handleCta = (e) => {
    e.preventDefault()
    if (onNavigate) onNavigate('signup')
  }

  return (
    <section className="features-section">
      <div className="features-header">
        <span className="features-header-eyebrow">✦ Verified Ethiopian Students</span>
        <h2 className="features-header-title">Publish &amp; monetize your study notes</h2>
        <p className="features-header-desc">
          To maintain high academic standards and student trust, only verified Ethiopian university students can publish note packages and offer tutor bookings.
        </p>
      </div>

      {/* Row 1: Setup & Get Verified */}
      <div className="feature-row feature-row-img-left">
        <div className="feature-visual feature-visual-left is-visible">
          <img
            alt="Upload and verify your student study notes"
            loading="lazy"
            width="2400"
            height="1479"
            className="feature-img rounded-2xl shadow-xl object-cover"
            style={{ color: 'transparent' }}
            src="/assets/generated/feature_upload_notes_1787086435273.jpg"
          />
        </div>
        <div className="feature-text is-visible">
          <span className="feature-label">Upload &amp; Get Verified</span>
          <h2 className="feature-title">Create your note store in minutes</h2>
          <p className="feature-desc">
            Upload handwritten summaries, solved past exams, or lab manuals, verify your university ID, set your ETB price, and start earning from every batch download.
          </p>
        </div>
      </div>

      {/* Row 2: Get Discovered */}
      <div className="feature-row feature-row-img-right">
        <div className="feature-text is-visible">
          <span className="feature-label">Campus Discovery</span>
          <h2 className="feature-title">Help juniors &amp; classmates find your notes</h2>
          <p className="feature-desc">
            Put your high-yield notes and tutor availability directly in front of classmates, freshmen, and students preparing for semester finals and exit exams.
          </p>
        </div>
        <div className="feature-visual feature-visual-right is-visible">
          <img
            alt="Students discovering study notes on campus"
            loading="lazy"
            width="2400"
            height="1879"
            className="feature-img rounded-2xl shadow-xl object-cover"
            style={{ color: 'transparent' }}
            src="/assets/generated/feature_campus_discovery_1787086541779.jpg"
          />
        </div>
      </div>

      {/* Row 3: Instant Payouts */}
      <div className="feature-row feature-row-img-left">
        <div className="feature-visual feature-visual-left is-visible">
          <img
            alt="Get paid instantly via Telebirr and CBE"
            loading="lazy"
            width="2400"
            height="1461"
            className="feature-img rounded-2xl shadow-xl object-cover"
            style={{ color: 'transparent' }}
            src="/assets/generated/feature_telebirr_payout_1787086658545.jpg"
          />
        </div>
        <div className="feature-text is-visible">
          <span className="feature-label">Instant Telebirr &amp; CBE</span>
          <h2 className="feature-title">Turn academic excellence into reliable income</h2>
          <p className="feature-desc">
            Receive student payments automatically via Telebirr or Commercial Bank of Ethiopia (CBE) with zero friction and instant payout settlements.
          </p>
        </div>
      </div>

      {/* Quote */}
      <figure className="feature-quote">
        <blockquote className="feature-quote-text">
          <img
            alt=""
            aria-hidden="true"
            loading="lazy"
            width="48"
            height="36"
            className="feature-quote-mark"
            style={{ color: 'transparent' }}
            src="/assets/reference/quote-icon.036nlqnv2d587.webp"
          />
          Education is the most powerful weapon which you can use to change the world — and sharing your knowledge empowers everyone around you.”
        </blockquote>
        <figcaption className="feature-quote-attr">
          –<strong>Nelson Mandela</strong>
        </figcaption>
      </figure>

      {/* Launch CTA */}
      <div className="launch-cta-wrap">
        <div className="launch-cta">
          <img
            alt=""
            aria-hidden="true"
            loading="lazy"
            width="80"
            height="80"
            className="launch-icon launch-icon-tl"
            style={{ color: 'transparent' }}
            src="/assets/reference/megaphone.2uvkkdhazn_y_.webp"
          />
          <img
            alt=""
            aria-hidden="true"
            loading="lazy"
            width="80"
            height="80"
            className="launch-icon launch-icon-tr"
            style={{ color: 'transparent' }}
            src="/assets/reference/lightbulb.19u68w2mvfsg3.webp"
          />
          <img
            alt=""
            aria-hidden="true"
            loading="lazy"
            width="80"
            height="80"
            className="launch-icon launch-icon-bl"
            style={{ color: 'transparent' }}
            src="/assets/reference/dollar.1wb35l2ckf9bo.webp"
          />
          <img
            alt=""
            aria-hidden="true"
            loading="lazy"
            width="80"
            height="80"
            className="launch-icon launch-icon-br"
            style={{ color: 'transparent' }}
            src="/assets/reference/laptop.2mv_xk33s9wyg.webp"
          />

          <div className="launch-cta-content">
            <h2 className="launch-cta-title">
              Join Ethiopia’s student<br />academic movement.
            </h2>
            <p className="launch-cta-sub">
              Upload your notes, book verified peer tutors,<br className="launch-cta-break" /> or apply to represent Campus Hustle at your university.
            </p>
            <div className="launch-cta-buttons">
              <button className="launch-cta-btn" type="button" onClick={handleCta}>
                Start Hustling
              </button>
              <a
                className="launch-cta-btn launch-cta-btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
                href="https://t.me/campushustle_et"
              >
                Join Community
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
