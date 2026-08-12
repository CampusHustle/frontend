import {
  IconCircleCheckFilled,
  IconMapPin,
  IconMessageCircle,
  IconStar,
  IconWallet,
} from '@tabler/icons-react'
import Reveal from './Reveal.jsx'

const CELL_A_IMG = 'https://picsum.photos/seed/campus-hustle-lawn/1200/800'
const CELL_C_IMG = 'https://picsum.photos/seed/campus-hustle-friends/600/600'

function CellShell({ className = '', children }) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl border border-white/10 transition-[border-color,transform,box-shadow] duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] ${className}`}
    >
      {children}
    </div>
  )
}

function CellA() {
  return (
    <CellShell className="min-h-[280px] md:col-span-2 md:min-h-[320px]">
      <img
        src={CELL_A_IMG}
        alt="Students hanging out on campus lawns"
        width="1200"
        height="800"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/45 to-ink-950/10" />
      <div className="relative flex h-full flex-col justify-end p-7 lg:p-9">
        <span className="flex items-center gap-1.5 text-[13px] font-medium text-ink-200">
          <IconMapPin size={16} className="text-hustle-500" />
          Walking-distance search
        </span>
        <h3 className="mt-2 max-w-md font-display text-2xl font-semibold leading-tight tracking-tight text-ink-50 lg:text-3xl">
          Find gigs that are actually close to your dorm
        </h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {['2 min walk', 'Campus quad', 'Active now'].map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/15 bg-ink-950/60 px-3 py-1 text-xs font-medium text-ink-100 backdrop-blur-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </CellShell>
  )
}

function CellB() {
  return (
    <CellShell className="flex min-h-[280px] flex-col justify-between bg-hustle-500 p-7 md:min-h-[320px]">
      <div className="flex items-start justify-between">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-ink-950/15">
          <IconWallet size={22} className="text-ink-contrast" />
        </span>
        <span className="font-display text-6xl font-bold leading-none text-ink-contrast/20">
          $
        </span>
      </div>
      <div>
        <h3 className="font-display text-2xl font-bold leading-tight tracking-tight text-ink-contrast lg:text-3xl">
          Get paid fast
        </h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-ink-contrast/80">
          Money lands in your account within 24 hours of a gig marked done. No
          hidden fees, no withdrawal minimums.
        </p>
      </div>
    </CellShell>
  )
}

function CellC() {
  return (
    <CellShell className="min-h-[280px] p-7 md:min-h-[320px]">
      <img
        src={CELL_C_IMG}
        alt="Verified students"
        width="600"
        height="600"
        loading="lazy"
        decoding="async"
        className="absolute inset-0 size-full object-cover opacity-25"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 to-ink-950/40" />
      <div className="relative flex h-full flex-col justify-between">
        <span className="flex items-center gap-1.5 text-[13px] font-medium text-ink-200">
          <IconCircleCheckFilled size={16} className="text-hustle-500" />
          Campus verified
        </span>
        <div>
          <h3 className="font-display text-2xl font-semibold leading-tight tracking-tight text-ink-50">
            Only real students
          </h3>
          <div className="mt-5 flex items-center gap-3">
            <div className="flex -space-x-2">
              {['AK', 'JT', 'MB'].map((initials, i) => (
                <span
                  key={initials}
                  className="flex size-8 items-center justify-center rounded-full border border-ink-950 text-[11px] font-semibold text-ink-950"
                  style={{ backgroundColor: ['#ffaf2b', '#7dd3fc', '#f472b6'][i] }}
                >
                  {initials}
                </span>
              ))}
            </div>
            <span className="text-xs text-ink-300">
              Every profile checked against your campus directory
            </span>
          </div>
        </div>
      </div>
    </CellShell>
  )
}

function CellD() {
  return (
    <CellShell className="min-h-[280px] p-7 md:min-h-[320px]">
      <div className="flex h-full flex-col justify-between">
        <span className="flex items-center gap-1.5 text-[13px] font-medium text-ink-200">
          <IconMessageCircle size={16} className="text-hustle-500" />
          Chat & escrow
        </span>
        <div className="space-y-2">
          <div className="ml-auto w-fit max-w-[80%] rounded-2xl rounded-br-md bg-ink-700 px-4 py-2.5 text-[13px] leading-snug text-ink-50">
            Can you shoot the club fair on Saturday?
          </div>
          <div className="w-fit max-w-[80%] rounded-2xl rounded-bl-md bg-white/8 px-4 py-2.5 text-[13px] leading-snug text-ink-100">
            Deal. $30 and I'll meet you at 9am on the quad.
          </div>
        </div>
        <p className="text-xs text-ink-400">
          Payments sit in escrow until you confirm the gig is done.
        </p>
      </div>
    </CellShell>
  )
}

function CellE() {
  return (
    <CellShell className="flex min-h-[280px] flex-col justify-between bg-ink-850 p-7 md:min-h-[320px]">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <IconStar
            key={i}
            size={20}
            className={i === 4 ? 'text-ink-600' : 'text-hustle-500'}
            fill="currentColor"
          />
        ))}
      </div>
      <div>
        <p className="font-display text-3xl font-semibold tracking-tight text-ink-50">
          4.9 average
        </p>
        <p className="mt-1.5 text-sm text-ink-300">
          Both sides rate each other after every gig. The best hustlers
          rise to the top.
        </p>
      </div>
    </CellShell>
  )
}

export default function Bento() {
  return (
    <section
      id="gigs"
      className="mx-auto max-w-6xl scroll-mt-24 px-4 py-24 sm:px-6 lg:px-8 lg:py-32"
    >
      <Reveal>
        <h2 className="max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight text-ink-50 sm:text-4xl lg:text-5xl">
          Everything you need to start earning
        </h2>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-ink-300">
          From discovery to payout, Campus Hustle is built around the way
          students actually move through a day.
        </p>
      </Reveal>

      <div className="mt-14 grid grid-cols-1 gap-4 md:grid-cols-3">
        <Reveal className="md:col-span-2">
          <CellA />
        </Reveal>
        <Reveal delay={0.08}>
          <CellB />
        </Reveal>
        <Reveal>
          <CellC />
        </Reveal>
        <Reveal delay={0.08}>
          <CellD />
        </Reveal>
        <Reveal delay={0.16}>
          <CellE />
        </Reveal>
      </div>
    </section>
  )
}
