import Reveal from './Reveal.jsx'

const steps = [
  {
    number: '01',
    title: 'Post a gig or skill',
    body: 'Tell your campus what you can do. List a service in under two minutes — no resume required.',
  },
  {
    number: '02',
    title: 'Get matched',
    body: 'Nearby students bid on your gig. Compare offers, check ratings, and chat in-app before you commit.',
  },
  {
    number: '03',
    title: 'Get paid',
    body: 'Money is released to your account within days of delivery. No chasing invoices, no drama.',
  },
]

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <Reveal>
        <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl lg:text-5xl">
          Three steps.
          <br />
          <span className="text-ink-400">Zero hassle.</span>
        </h2>
      </Reveal>

      <div className="mt-14 border-t border-white/10">
        {steps.map((step, i) => (
          <Reveal key={step.number} delay={i * 0.06}>
            <div className="group grid gap-4 border-b border-white/10 py-10 transition-colors duration-300 md:grid-cols-[140px_1fr_1fr] md:items-baseline md:gap-10 lg:py-12">
              <span
                className="font-display text-5xl font-bold tracking-tight text-transparent transition-colors duration-300 group-hover:text-hustle-500 lg:text-6xl"
                style={{ WebkitTextStroke: '1.5px var(--color-ink-600)' }}
              >
                {step.number}
              </span>
              <h3 className="font-display text-xl font-semibold tracking-tight text-ink-50 sm:text-2xl">
                {step.title}
              </h3>
              <p className="max-w-md text-base leading-relaxed text-ink-300">
                {step.body}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
