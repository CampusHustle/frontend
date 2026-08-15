import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
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
    <div className="w-56 rounded-2xl border border-surface-variant bg-surface-lowest/95 p-4 shadow-level-2 backdrop-blur-md sm:w-64">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-surface-container px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
          Design
        </span>
        <span className="text-[11px] text-outline">posted 2h ago</span>
      </div>
      <p className="mt-3 text-sm font-semibold leading-snug text-primary">
        Design a club flyer for Spring Fest
      </p>
      <div className="mt-3 flex items-baseline justify-between">
        <span className="font-display text-2xl font-semibold text-hustle-600">
          $45
        </span>
        <span className="text-xs text-outline">3 bids · near you</span>
      </div>
    </div>
  )
}

function PaymentChip() {
  return (
    <div className="flex items-center gap-2.5 rounded-full border border-surface-variant bg-surface-lowest/95 py-2.5 pl-3 pr-4 shadow-level-1 backdrop-blur-md">
      <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500/15">
        <IconCheck size={14} className="text-emerald-600" />
      </span>
      <span className="text-xs font-semibold text-primary">
        Payment received{' '}
        <span className="font-display font-bold text-hustle-600">+$45.00</span>
      </span>
    </div>
  )
}

export default function Hero({ onNavigate }) {
  const reduce = useReducedMotion()
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })
  const yTall = useTransform(scrollYProgress, [0, 1], [0, -48])
  const ySquare = useTransform(scrollYProgress, [0, 1], [0, -84])
  const yCards = useTransform(scrollYProgress, [0, 1], [0, 64])

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
      ref={sectionRef}
      id="top"
      className="relative overflow-hidden pt-28 pb-20 sm:pt-32 lg:min-h-[calc(100svh-4rem)]"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_55%_at_78%_12%,rgba(255,175,43,0.18),transparent_62%)]"
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8">
        <div className="max-w-xl">
          <motion.div {...fade(reduce, 0)}>
            <span className="inline-flex items-center rounded-full border border-surface-variant bg-surface-container px-3.5 py-1.5 text-[13px] font-medium text-on-surface-variant">
              The campus gig platform
            </span>
          </motion.div>

          <motion.h1
            {...fade(reduce, 0.08)}
            className="mt-6 font-display text-5xl font-semibold leading-[0.98] tracking-tight text-primary sm:text-6xl lg:text-[4.4rem]"
          >
            Your campus.
            <br />
            <span className="italic text-hustle-600">Your hustle.</span>
          </motion.h1>

          <motion.p
            {...fade(reduce, 0.16)}
            className="mt-6 max-w-md text-lg leading-relaxed text-on-surface-variant"
          >
            Post a skill, pick up a gig, and get paid within days. Built for
            students, by students.
          </motion.p>

          <motion.div
            {...fade(reduce, 0.24)}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <motion.a
              {...ctaProps}
              href="#"
              onClick={handleNav('signup')}
              className="group inline-flex items-center gap-2 rounded-full bg-hustle-500 px-7 py-3.5 font-semibold text-ink-contrast shadow-sm transition-[background-color] duration-200 hover:bg-hustle-400"
            >
              Start hustling
              <IconArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </motion.a>
            <motion.a
              {...ctaProps}
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full border border-outline-variant px-6 py-3.5 font-semibold text-primary transition-colors duration-200 hover:border-primary hover:bg-surface-low"
            >
              How it works
            </motion.a>
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

          <motion.div
            style={reduce ? undefined : { y: yTall }}
            className="relative aspect-[3/4] w-[64%] overflow-hidden rounded-[2rem] border border-surface-variant shadow-level-1"
          >
            <img
              src={HERO_TALL_IMG}
              alt="Student on campus"
              width="720"
              height="960"
              fetchPriority="high"
              decoding="async"
              className="size-full object-cover"
            />
          </motion.div>

          <motion.div
            style={reduce ? undefined : { y: ySquare }}
            className="absolute top-1/3 right-0 aspect-square w-[56%] overflow-hidden rounded-[1.75rem] border border-surface-variant shadow-level-2"
          >
            <img
              src={HERO_SQUARE_IMG}
              alt="Late night study session"
              width="600"
              height="600"
              loading="lazy"
              decoding="async"
              className="size-full object-cover"
            />
          </motion.div>

          <motion.div
            style={reduce ? undefined : { y: yCards }}
            className="absolute -left-2 bottom-6 animate-float sm:left-0"
          >
            <GigCard />
          </motion.div>

          <motion.div
            style={reduce ? undefined : { y: yCards }}
            className="absolute top-4 -left-2 animate-float-slow sm:top-6 sm:left-2"
          >
            <PaymentChip />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
