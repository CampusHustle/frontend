import {
  IconArrowUpRight,
  IconCurrencyDollar,
  IconPlus,
  IconUserSearch,
} from '@tabler/icons-react'
import Reveal from './Reveal.jsx'

const steps = [
  {
    icon: IconPlus,
    title: 'Post a gig or skill',
    body: 'Tell your campus what you can do. List a service in under two minutes, no resume required.',
  },
  {
    icon: IconUserSearch,
    title: 'Get matched',
    body: 'Nearby students bid on your gig. Compare offers, check ratings, and chat in-app before you commit.',
  },
  {
    icon: IconCurrencyDollar,
    title: 'Get paid',
    body: 'Money lands in your account within days of delivery. No chasing invoices, no drama.',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <Reveal>
        <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-primary sm:text-4xl lg:text-5xl">
          Three steps.
          <br />
          <span className="text-on-surface-variant">Zero hassle.</span>
        </h2>
      </Reveal>

      <div className="mt-14 border-t border-surface-variant">
        {steps.map((step, i) => (
          <Reveal key={step.title} delay={i * 0.06}>
            <div className="group grid gap-5 border-b border-surface-variant py-9 transition-colors duration-300 md:grid-cols-[80px_1fr_1.2fr_auto] md:items-center md:gap-8 lg:py-11 hover:bg-surface-low/50 px-2 rounded-xl">
              <span className="flex size-14 items-center justify-center rounded-2xl border border-surface-variant bg-surface-lowest shadow-sm text-hustle-600 transition-colors duration-300 group-hover:border-hustle-500/40">
                <step.icon size={22} />
              </span>
              <h3 className="font-display text-xl font-semibold tracking-tight text-primary sm:text-2xl">
                {step.title}
              </h3>
              <p className="max-w-md text-base leading-relaxed text-on-surface-variant">
                {step.body}
              </p>
              <IconArrowUpRight
                size={22}
                className="hidden text-outline transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-hustle-600 md:block"
              />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
