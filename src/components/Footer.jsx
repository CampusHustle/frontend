import { motion, useReducedMotion } from 'motion/react'
import { IconArrowRight } from '@tabler/icons-react'

const productLinks = [
  { label: 'Gigs', href: '#gigs' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Community', href: '#community' },
  { label: 'Find tutors', href: '#how-it-works' },
]

const resourceLinks = [
  { label: 'Blog', href: '#' },
  { label: 'Help Center', href: '#' },
  { label: 'Pricing', href: '#' },
  { label: 'Campus Ambassadors', href: '#' },
]

export default function Footer({ onNavigate }) {
  const reduce = useReducedMotion()

  const handleNav = (targetView) => (e) => {
    e.preventDefault()
    if (onNavigate) onNavigate(targetView)
  }

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-ink-900/40">
      <div className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 pb-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <a href="#top" className="flex items-center gap-2.5">
              <img
                src="/assets/campushustle.jpg"
                alt="CampusHustle logo"
                width="32"
                height="32"
                className="size-8 rounded-xl border border-white/10 object-cover"
              />
              <span className="font-display text-[17px] font-semibold tracking-tight text-ink-50">
                Campus Hustle
              </span>
            </a>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-ink-300">
              Learn. Teach. Earn. The peer-to-peer academic marketplace where
              verified students tutor, sell notes, and turn knowledge into
              income.
            </p>
            <a
              href="#"
              onClick={handleNav('signup')}
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-hustle-500 px-5 py-2.5 text-sm font-semibold text-ink-contrast transition-[background-color] duration-200 hover:bg-hustle-400"
            >
              Start hustling
              <IconArrowRight
                size={16}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-12 md:col-span-6">
            <div>
              <h4 className="font-display text-sm font-semibold text-ink-100">
                Product
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-300">
                {productLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="transition-colors hover:text-ink-50"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-display text-sm font-semibold text-ink-100">
                Resources
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm text-ink-300">
                {resourceLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="transition-colors hover:text-ink-50"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <motion.div
        initial={reduce ? false : { y: 48, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="w-full select-none overflow-hidden px-2 pb-8 text-center"
      >
        <span className="block whitespace-nowrap font-display text-[clamp(3.5rem,12vw,10.5rem)] font-bold leading-none tracking-tighter">
          <span className="text-ink-800 light:text-ink-200">Campus</span>{' '}
          <span className="text-transparent [-webkit-text-stroke:1px_var(--color-ink-600)] light:[-webkit-text-stroke:1px_var(--color-ink-400)]">
            Hustle
          </span>
        </span>
      </motion.div>

      <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-6 text-xs text-ink-400 sm:flex-row">
          <p>© {new Date().getFullYear()} CampusHustle Inc.</p>
          <div className="flex flex-wrap gap-6">
            <a href="#" className="transition-colors hover:text-ink-100">
              About
            </a>
            <a href="#" className="transition-colors hover:text-ink-100">
              Privacy Policy
            </a>
            <a href="#" className="transition-colors hover:text-ink-100">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
