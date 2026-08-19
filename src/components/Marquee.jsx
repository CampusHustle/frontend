import { IconBolt } from '@tabler/icons-react'

const categories = [
  'Web design',
  'Tutoring',
  'Photography',
  'Coding',
  'Event help',
  'Delivery',
  'Art & illustration',
  'Music lessons',
  'Video editing',
  'Fitness coaching',
  'Social media',
  'Translation',
]

function Row() {
  return (
    <div className="flex shrink-0 items-center gap-6 pr-6">
      {categories.map((category) => (
        <span
          key={category}
          className="flex items-center gap-3 whitespace-nowrap font-display text-lg font-medium text-white/90"
        >
          <IconBolt size={16} className="text-hustle-400" />
          {category}
        </span>
      ))}
    </div>
  )
}

export default function Marquee() {
  return (
    <section
      aria-label="Gig categories"
      className="relative overflow-hidden border-y border-white/15 bg-black/35 py-5 shadow-sm backdrop-blur-xl"
    >
      <div className="flex w-max animate-marquee">
        <Row />
        <Row />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black/30 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black/30 to-transparent"
      />
    </section>
  )
}
