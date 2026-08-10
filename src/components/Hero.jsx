import { motion, useReducedMotion } from 'motion/react'
import { IconArrowRight, IconCheck } from '@tabler/icons-react'

const HERO_TALL_IMG =
  'https://picsum.photos/seed/campus-hustle-quad/720/960'
const HERO_SQUARE_IMG =
  'https://picsum.photos/seed/campus-hustle-study/600/600'

function fade(reduce, delay) {
  return {
    initial: reduce ? false : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  }
}

function GigCard() {
  return (
    <div className="w-56 rounded-2xl border border-white/10 bg-ink-900/90 p-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.55)] backdrop-blur-md sm:w-64">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-ink-300">
          Design
        </span>
        <span className="text-[11px] text-ink-400">posted 2h ago</span>
      </div>
      <p className="mt-3 text-sm font-semibold leading-snug text-ink-50">
        Design a club flyer for Spring Fest
      </p>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="font-display text-2xl font-semibold text-hustle-500">
          $45
        </span>
        <span className="text-xs text-ink-400">4 bids · near you</span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-2/3 rounded-full bg-hustle-500" />
        </div>
        <span className="whitespace-nowrap text-[11px] text-ink-400">
          3 matched
        </span>
      </div>
    </div>
  )
}

function PaymentChip() {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-ink-900/90 py-2.5 pl-3 pr-4 shadow-[0_12px_30px_-8px_rgba(0,0,0,0.5)] backdrop-blur-md">
      <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500/20">
        <IconCheck size={14} className="text-emerald-400" />
      </span>
      <span className="text-xs font-semibold text-ink-100">
        Payment received{' '}
        <span className="font-display text-hustle-400">+$45.00</span>
      </span>
    </div>
  )
}

export default function Hero() {
  const reduce = useReducedMotion()

  return (
    <section
      id="top"
      className="relative overflow-hidden pt-28 pb-16 sm:pt-32 lg:min-h-[calc(100svh-4rem)] lg:pb-0"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_55%_at_78%_12%,rgba(255,175,43,0.13),transparent_62%)]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8">
        <div className="max-w-xl">
          <motion.div {...fade(reduce, 0)}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-[13px] font-medium text-ink-200">
              <span className="size-1.5 animate-pulse-dot rounded-full bg-hustle-500" />
              The campus gig platform
            </span>
          </motion.div>

          <motion.h1
            {...fade(reduce, 0.08)}
            className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-ink-50 sm:text-6xl lg:text-[4.4rem]"
          >
            Your campus.
            <br />
            <span className="italic text-hustle-500">Your hustle.</span>
          </motion.h1>

          <motion.p
            {...fade(reduce, 0.16)}
            className="mt-6 max-w-md text-lg leading-relaxed text-ink-300"
          >
            Post a skill, pick up a gig, and get paid within days. Built for
            students, by students.
          </motion.p>

          <motion.div
            {...fade(reduce, 0.24)}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <a
              href="#start"
              className="group inline-flex items-center gap-2 rounded-full bg-hustle-500 px-7 py-3.5 font-semibold text-ink-950 transition-[background-color,transform] duration-200 hover:bg-hustle-400 active:scale-[0.98]"
            >
              Start hustling
              <IconArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </a>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 font-semibold text-ink-100 transition-colors duration-200 hover:border-white/30 hover:bg-white/5"
            >
              How it works
            </a>
          </motion.div>
        </div>

        <motion.div
          {...fade(reduce, 0.2)}
          className="relative mx-auto w-full max-w-[26rem] lg:max-w-none"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-10 -right-6 size-40 rounded-full bg-hustle-500/20 blur-3xl"
          />

          <div className="relative aspect-[3/4] w-[64%] overflow-hidden rounded-[2rem] border border-white/10">
            <img
              src={HERO_TALL_IMG}
              alt="Student on campus"
              width="720"
              height="960"
              fetchPriority="high"
              decoding="async"
              className="size-full object-cover"
            />
          </div>

          <div className="absolute top-1/3 right-0 aspect-square w-[56%] overflow-hidden rounded-[1.75rem] border border-white/10 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.6)]">
            <img
              src={HERO_SQUARE_IMG}
              alt="Late night study session"
              width="600"
              height="600"
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          </div>

          <div className="absolute -left-2 bottom-6 animate-float sm:left-0">
            <GigCard />
          </div>

          <div className="absolute top-4 -left-2 animate-float-slow sm:top-6 sm:left-2">
            <PaymentChip />
          </div>
        </motion.div>
      </div>

      <div className="relative mx-auto mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
        <a
          href="#how-it-works"
          className="inline-flex items-center gap-3 text-[13px] font-medium tracking-widest text-ink-400 uppercase transition-colors hover:text-ink-100"
        >
          <span className="h-px w-10 bg-ink-700" />
          Scroll to explore
        </a>
      </div>
    </section>
  )
}
