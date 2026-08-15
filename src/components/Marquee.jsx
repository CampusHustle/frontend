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
          className="flex items-center gap-3 whitespace-nowrap font-display text-lg font-medium text-on-surface-variant"
        >
          <IconBolt size={16} className="text-hustle-600" />
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
      className="relative overflow-hidden border-y border-surface-variant bg-surface-lowest/60 py-5"
    >
      <div className="flex w-max animate-marquee">
        <Row />
        <Row />
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-surface to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-surface to-transparent"
      />
    </section>
  )
}
