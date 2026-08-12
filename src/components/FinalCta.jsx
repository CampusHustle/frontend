import { IconArrowRight } from '@tabler/icons-react'
import { motion, useReducedMotion } from 'motion/react'
import Reveal from './Reveal.jsx'

export default function FinalCta({ onNavigate }) {
  const reduce = useReducedMotion()

  const handleNav = (targetView) => (e) => {
    e.preventDefault()
    if (onNavigate) onNavigate(targetView)
  }

  const ctaProps = reduce
    ? {}
    : {
        whileHover: { y: -2 },
        whileTap: { scale: 0.97 },
      }

  return (
    <section
      id="start"
      className="relative overflow-hidden scroll-mt-24 px-4 py-28 text-center sm:px-6 lg:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,175,43,0.16),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <h2 className="pb-1 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-ink-50 sm:text-6xl lg:text-7xl">
            Ready to make
            <br />
            your campus <span className="italic text-hustle-500">pay?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-ink-300 sm:text-lg">
            Sign up in two minutes. Post your first gig tonight, start earning
            this week.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <motion.a
              {...ctaProps}
              href="#"
              onClick={handleNav('signup')}
              className="group inline-flex items-center gap-2 rounded-full bg-hustle-500 px-8 py-4 font-semibold text-ink-contrast transition-[background-color] duration-200 hover:bg-hustle-400"
            >
              Start hustling
              <IconArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </motion.a>
            <motion.a
              {...ctaProps}
              href="#gigs"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-4 font-semibold text-ink-100 transition-colors duration-200 hover:border-white/30 hover:bg-white/5"
            >
              See it in action
            </motion.a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
