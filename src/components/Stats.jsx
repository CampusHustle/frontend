import Reveal from './Reveal.jsx'

// Sample stats, swap these for real platform numbers before launch.
const stats = [
  { value: '2,000+', label: 'gigs completed on campus' },
  { value: '120+', label: 'campuses live this semester' },
  { value: '48h', label: 'average time from done to payout' },
]

export default function Stats() {
  return (
    <section className="border-y border-white/5 bg-ink-900/50">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-white/5 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <div className="flex flex-col items-start gap-2 py-10 pr-8 sm:py-14">
              <span className="font-display text-4xl font-semibold tracking-tight text-hustle-500 lg:text-5xl">
                {stat.value}
              </span>
              <span className="text-sm leading-snug text-ink-300">
                {stat.label}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
