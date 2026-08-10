import Logo from './Logo.jsx'

const columns = [
  {
    heading: 'Product',
    links: ['How it works', 'Browse gigs', 'Pricing', 'Trust & safety'],
  },
  {
    heading: 'Community',
    links: ['Student stories', 'Campus program', 'Help center', 'Contact'],
  },
  {
    heading: 'Repo',
    links: ['Frontend', 'Backend', 'Docs', 'Roadmap'],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-ink-900/40">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <a href="#top" className="flex items-center gap-2.5">
              <Logo className="size-8" />
              <span className="font-display text-base font-semibold tracking-tight text-ink-50">
                Campus Hustle
              </span>
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-400">
              The gig platform built for campus life. Post a skill, pick up a
              gig, get paid.
            </p>
          </div>

          {columns.map((column) => (
            <div key={column.heading}>
              <h4 className="text-[13px] font-semibold tracking-widest text-ink-300 uppercase">
                {column.heading}
              </h4>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#top"
                      className="text-sm text-ink-400 transition-colors hover:text-ink-100"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/5 pt-8 sm:flex-row sm:items-center">
          <p className="text-xs text-ink-400">
            © {new Date().getFullYear()} Campus Hustle. All rights reserved.
          </p>
          <p className="text-xs text-ink-400">
            Built with React, Vite &amp; Express
          </p>
        </div>
      </div>
    </footer>
  )
}
