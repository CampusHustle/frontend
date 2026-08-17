import { IconArrowRight, IconRocket, IconPlayerPlayFilled } from '@tabler/icons-react'
import { motion, useReducedMotion } from 'motion/react'
import Reveal from './Reveal.jsx'

export default function FinalCta({ onNavigate }) {
  const reduce = useReducedMotion()

  const handleNav = (targetView) => (e) => {
    e.preventDefault()
    if (onNavigate) onNavigate(targetView)
  }

  return (
    <section
      id="start"
      className="relative overflow-hidden scroll-mt-24 px-4 py-28 text-center sm:px-6 lg:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_100%,rgba(255,175,43,0.22),transparent_65%)]"
      />
      <div className="relative mx-auto max-w-3xl">
        <Reveal>
          <h2 className="pb-1 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-primary sm:text-6xl lg:text-7xl">
            Ready to make
            <br />
            your campus <span className="italic text-hustle-600">pay?</span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-on-surface-variant sm:text-lg">
            Sign up in two minutes. Post your first gig tonight, start earning
            this week.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            {/* Primary Button with Text Flip & Rocket Launch */}
            <motion.a
              whileHover={reduce ? {} : { scale: 1.05, y: -2 }}
              whileTap={reduce ? {} : { scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              href="#"
              onClick={handleNav('signup')}
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-hustle-400 via-hustle-500 to-hustle-600 px-8 py-4 text-base font-bold text-ink-contrast shadow-[0_4px_20px_rgba(255,175,43,0.4)] transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(255,175,43,0.65)]"
            >
              {/* Animated light shine beam */}
              <span
                aria-hidden="true"
                className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
              />
              
              {/* Text Flip Effect */}
              <span className="relative z-10 block h-6 overflow-hidden leading-6 font-bold tracking-wide">
                <span className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-6">
                  <span>Start hustling</span>
                  <span>Join the Hustle</span>
                </span>
              </span>

              {/* Icon Flip Effect */}
              <span className="relative z-10 block size-5 overflow-hidden">
                <span className="flex flex-col items-center transition-transform duration-300 ease-out group-hover:-translate-y-5">
                  <IconArrowRight size={19} stroke={2.5} className="shrink-0" />
                  <IconRocket size={19} stroke={2.5} className="shrink-0 text-ink-contrast -rotate-45" />
                </span>
              </span>
            </motion.a>

            {/* Secondary Button with Text Flip & Play Icon */}
            <motion.a
              whileHover={reduce ? {} : { scale: 1.05, y: -2 }}
              whileTap={reduce ? {} : { scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              href="#gigs"
              className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full border border-surface-variant bg-surface-lowest px-8 py-4 text-base font-semibold text-primary shadow-level-1 transition-all duration-300 hover:border-primary hover:bg-surface-low hover:shadow-level-2"
            >
              {/* Animated Icon Container */}
              <span className="relative z-10 block size-4 overflow-hidden">
                <span className="flex flex-col items-center transition-transform duration-300 ease-out group-hover:-translate-y-4">
                  <span className="flex size-2 rounded-full bg-hustle-500 animate-pulse my-1 shrink-0" />
                  <IconPlayerPlayFilled size={14} className="text-hustle-600 my-0.5 shrink-0" />
                </span>
              </span>

              {/* Text Flip Effect */}
              <span className="relative z-10 block h-6 overflow-hidden leading-6">
                <span className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-6">
                  <span>See it in action</span>
                  <span className="text-primary font-bold">Explore Gigs</span>
                </span>
              </span>
            </motion.a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
