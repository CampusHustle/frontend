import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  IconArrowLeft,
  IconAward,
  IconBinaryTree2,
  IconBook2,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheckFilled,
  IconCircleX,
  IconClock,
  IconCode,
  IconFileText,
  IconMessageCircle,
  IconStarFilled,
} from '@tabler/icons-react'
import { tutors } from '../api/mockUsers.js'
import { dummyNotes } from '../components/AuthNotesMarketplace.jsx'
import Footer from '../components/Footer.jsx'
import AppNavbar from '../components/AppNavbar.jsx'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']
const SLOT_TIMES = ['9:00 AM', '2:00 PM']

const NOTE_ICONS = [IconFileText, IconCode, IconBinaryTree2, IconBook2]

function initialsOf(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function Avatar({ user, className = 'w-32 h-32' }) {
  if (user?.profilePicUrl) {
    return (
      <img
        src={user.profilePicUrl}
        alt={user.name || 'Tutor avatar'}
        className={`${className} rounded-xl object-cover border-2 border-primary shadow-level-1 shrink-0`}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className={`${className} flex items-center justify-center rounded-xl border-2 border-primary bg-primary text-4xl font-bold text-on-primary shadow-level-1 shrink-0`}
    >
      {initialsOf(user?.name || 'Tutor')}
    </div>
  )
}

function seededRand(seed) {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 0xffffffff
  }
}

function buildSlots(tutorId) {
  const rand = seededRand(
    [...tutorId].reduce((acc, ch) => acc + ch.charCodeAt(0), 7),
  )
  const slots = DAYS.map((day) =>
    SLOT_TIMES.map((time) => ({ day, time, booked: rand() < 0.45 })),
  )
  if (slots.every((row) => row.every((s) => s.booked))) {
    slots[0][0].booked = false
  }
  return slots
}

function RatingBreakdown({ rating }) {
  const rows = [
    { label: 'Subject Knowledge', value: rating.knowledge },
    { label: 'Communication', value: rating.communication },
    { label: 'Punctuality', value: rating.punctuality },
  ]
  return (
    <div className="flex flex-col justify-between rounded-xl border border-surface-variant bg-surface p-6 shadow-level-1">
      <h2 className="mb-4 font-display text-xl font-bold text-primary">Rating Breakdown</h2>
      <div className="flex flex-col gap-5">
        {rows.map((row) => (
          <div key={row.label}>
            <div className="mb-1 flex justify-between text-sm">
              <span className="font-medium text-on-surface">{row.label}</span>
              <span className="font-semibold text-primary">{row.value.toFixed(1)}</span>
            </div>
            <div className="h-2 w-full rounded-full bg-surface-container-highest">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${Math.min(100, Math.max(0, row.value * 20))}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function AvailabilityGrid({ slots, selected, onSelect }) {
  const [week, setWeek] = useState(0)
  const label = `Oct ${23 + week * 7} - Oct ${29 + week * 7}`
  return (
    <div className="rounded-xl border border-surface-variant bg-surface p-6 shadow-level-1 lg:col-span-2">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-display text-xl font-bold text-primary">Availability</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous week"
            onClick={() => setWeek((w) => Math.max(0, w - 1))}
            className="rounded-full p-1 text-outline transition-colors hover:text-primary"
          >
            <IconChevronLeft size={18} aria-hidden="true" />
          </button>
          <span className="text-sm font-medium text-on-surface">{label}</span>
          <button
            type="button"
            aria-label="Next week"
            onClick={() => setWeek((w) => w + 1)}
            className="rounded-full p-1 text-outline transition-colors hover:text-primary"
          >
            <IconChevronRight size={18} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="mb-2 text-center text-xs font-medium text-outline"
          >
            {day}
          </div>
        ))}
        {slots.flat().map((slot) => {
          const isSelected = selected?.day === slot.day && selected?.time === slot.time
          if (slot.booked) {
            return (
              <div
                key={`${slot.day}-${slot.time}`}
                aria-disabled="true"
                title="Booked"
                className="cursor-not-allowed rounded-md bg-surface-container-highest p-2 text-center text-xs font-medium text-outline-variant border border-outline-variant"
              >
                {slot.time}
              </div>
            )
          }
          return (
            <button
              key={`${slot.day}-${slot.time}`}
              type="button"
              onClick={() => onSelect({ day: slot.day, time: slot.time })}
              aria-pressed={isSelected}
              className={`rounded-md p-2 text-center text-xs font-medium transition-colors border ${
                isSelected
                  ? 'bg-primary text-on-primary border-primary shadow-level-1'
                  : 'bg-primary-container text-on-primary-container border-primary hover:bg-primary hover:text-on-primary'
              }`}
            >
              {slot.time}
            </button>
          )
        })}
      </div>

      <div className="mt-5 flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-xs text-outline">
          <span className="size-3 rounded-full bg-primary-container border border-primary"></span> Available
        </span>
        <span className="flex items-center gap-1.5 text-xs text-outline">
          <span className="size-3 rounded-full bg-surface-container-highest border border-outline-variant"></span> Booked
        </span>
      </div>
    </div>
  )
}

export function BookingStatusBadge({ status }) {
  switch (status) {
    case 'pending':
      return (
        <div
          data-testid="booking-status-pending"
          className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs sm:text-sm font-semibold text-amber-700 dark:text-amber-400"
        >
          <IconClock size={16} className="shrink-0 text-amber-600 animate-pulse" aria-hidden="true" />
          <span>Status: Pending Tutor Confirmation</span>
        </div>
      )
    case 'confirmed':
      return (
        <div
          data-testid="booking-status-confirmed"
          className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400"
        >
          <IconCircleCheckFilled size={16} className="shrink-0 text-emerald-600" aria-hidden="true" />
          <span>Status: Booking Confirmed (Chat Unlocked)</span>
        </div>
      )
    case 'completed':
      return (
        <div
          data-testid="booking-status-completed"
          className="flex items-center gap-2 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-2 text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-400"
        >
          <IconAward size={16} className="shrink-0 text-blue-600" aria-hidden="true" />
          <span>Status: Session Completed</span>
        </div>
      )
    case 'cancelled':
      return (
        <div
          data-testid="booking-status-cancelled"
          className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs sm:text-sm font-semibold text-rose-700 dark:text-rose-400"
        >
          <IconCircleX size={16} className="shrink-0 text-rose-600" aria-hidden="true" />
          <span>Status: Booking Cancelled</span>
        </div>
      )
    default:
      return null
  }
}

function BookingPanel({
  tutor,
  selected,
  onRequestBooking,
  confirmation,
  bookingStatus = 'idle',
  onSendMessage,
}) {
  return (
    <div className="flex flex-col justify-center rounded-xl border border-surface-variant bg-surface p-6 shadow-level-1">
      <div className="mb-4 text-center">
        <span className="font-display text-3xl font-bold text-primary">${tutor.hourlyRate}</span>
        <span className="text-base text-outline"> / hour</span>
      </div>

      {bookingStatus !== 'idle' ? (
        <div className="mb-5 space-y-3">
          <BookingStatusBadge status={bookingStatus} />
          {confirmation && (
            <p className="text-center text-xs text-on-surface-variant">{confirmation}</p>
          )}
        </div>
      ) : (
        <p className="mb-5 text-center text-sm text-on-surface-variant">
          {selected
            ? `You selected ${selected.day} at ${selected.time}. Request a booking to confirm.`
            : 'Select a time slot from the grid to request a booking. Sessions are held via campus library or Zoom.'}
        </p>
      )}

      {bookingStatus === 'idle' && (
        <button
          type="button"
          disabled={!selected}
          onClick={onRequestBooking}
          className="w-full rounded-lg bg-secondary-container py-3 text-sm font-semibold text-on-secondary-container shadow-level-1 transition-all hover:shadow-level-2 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-level-1 disabled:hover:translate-y-0"
        >
          Request Booking
        </button>
      )}

      {bookingStatus === 'confirmed' && (
        <button
          type="button"
          onClick={onSendMessage}
          className="w-full rounded-lg bg-emerald-600 py-3 text-sm font-semibold text-white shadow-level-1 transition-all hover:bg-emerald-500 hover:shadow-level-2 flex items-center justify-center gap-2"
        >
          <IconMessageCircle size={18} />
          <span>Join Live Chat</span>
        </button>
      )}

      {bookingStatus === 'cancelled' && (
        <button
          type="button"
          disabled={!selected}
          onClick={onRequestBooking}
          className="w-full rounded-lg bg-secondary-container py-3 text-sm font-semibold text-on-secondary-container shadow-level-1 transition-all hover:shadow-level-2 hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-50"
        >
          Request New Slot
        </button>
      )}

      <button
        type="button"
        onClick={onSendMessage}
        className="mt-2 w-full rounded-lg border border-primary py-3 text-sm font-semibold text-primary transition-colors hover:bg-surface-container-low"
      >
        Send Message
      </button>
    </div>
  )
}

function NotesSection({ tutor, onNavigate }) {
  const notes = useMemo(() => {
    const byDept = dummyNotes.filter((n) => n.department === tutor.department)
    return (byDept.length > 0 ? byDept : dummyNotes).slice(0, 3).map((note, index) => ({
      ...note,
      price: `$${[10, 5, 8][index] ?? 5}`,
      Icon: NOTE_ICONS[index % NOTE_ICONS.length],
    }))
  }, [tutor.department])

  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-end justify-between">
        <h2 className="font-display text-2xl font-bold text-primary">
          Study Notes by {tutor.name.split(' ')[0]}
        </h2>
        <button
          type="button"
          onClick={() => onNavigate('marketplace')}
          className="text-sm font-medium text-primary transition-colors hover:text-secondary-container"
        >
          View All
        </button>
      </div>
      <div className="hide-scrollbar flex snap-x gap-4 overflow-x-auto pb-2">
        {notes.map((note) => (
          <button
            key={note.id}
            type="button"
            onClick={() => onNavigate('marketplace')}
            className="group flex w-[280px] min-w-[280px] snap-start flex-col rounded-xl border border-surface-variant bg-surface p-4 shadow-level-1 transition-shadow hover:shadow-level-2"
          >
            <div className="relative mb-3 flex h-32 items-center justify-center overflow-hidden rounded-lg bg-surface-container">
              <img
                src={note.coverImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover opacity-80 mix-blend-multiply"
              />
              <note.Icon
                size={40}
                className="relative z-10 text-primary"
                aria-hidden="true"
              />
            </div>
            <div className="mb-2 flex items-start justify-between gap-2">
              <h3 className="line-clamp-2 text-left text-sm font-semibold text-on-surface transition-colors group-hover:text-primary">
                {note.title}
              </h3>
              <span className="shrink-0 rounded-md bg-primary-container px-2 py-0.5 text-sm font-semibold text-on-primary-container">
                {note.price}
              </span>
            </div>
            <p className="mt-auto line-clamp-2 text-left text-sm text-outline">
              {note.course} · {note.contentType}
            </p>
          </button>
        ))}
      </div>
    </section>
  )
}

export default function TutorDetailScreen({ user, onLogout, onNavigate, initialBookingStatus = 'idle' }) {
  const { id } = useParams()
  const [selected, setSelected] = useState(null)
  const [confirmation, setConfirmation] = useState('')
  const [bookingStatus, setBookingStatus] = useState(initialBookingStatus)

  const tutor = useMemo(() => tutors.find((t) => t.id === id), [id])
  const slots = useMemo(() => buildSlots(id ?? 'unknown'), [id])

  if (!tutor) {
    return (
      <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
        <AppNavbar user={user} activeView="tutor" onNavigate={onNavigate} onLogout={onLogout} />
        <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="font-display text-2xl font-bold text-primary">Tutor not found</h1>
          <p className="text-sm text-on-surface-variant">
            This tutor may no longer be available.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('tutor')}
            className="mt-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary shadow-level-1 transition-colors hover:bg-primary-container"
          >
            Browse Tutors
          </button>
        </main>
        <Footer onNavigate={onNavigate} />
      </div>
    )
  }

  const handleRequestBooking = () => {
    if (!selected) return
    setBookingStatus('pending')
    setConfirmation(`Booking request sent for ${selected.day} at ${selected.time}.`)
  }

  const handleSendMessage = () => {
    onNavigate?.(`/chat/${tutor?.id || 'sarah-jenkins'}`)
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <AppNavbar
        user={user}
        activeView="tutor"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        <button
          type="button"
          onClick={() => onNavigate('tutor')}
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary"
        >
          <IconArrowLeft size={16} aria-hidden="true" />
          Back to Tutors
        </button>

        {/* Header: Profile + Rating Breakdown */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col gap-6 rounded-xl border border-surface-variant bg-surface p-6 shadow-level-1 md:col-span-2 md:flex-row">
            <Avatar user={tutor} />
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="font-display text-2xl font-bold text-primary sm:text-[32px] sm:leading-[1.25] flex items-center gap-1.5">
                    <span className="truncate">{tutor.name}</span>
                    <IconCircleCheckFilled
                      size={20}
                      className="shrink-0 text-tertiary-container"
                      title="Verified Student"
                      aria-label="Verified Student"
                    />
                  </h1>
                  <p className="mt-1 text-base text-on-surface-variant">
                    {tutor.department} · {tutor.university}
                  </p>
                </div>
                <div className="flex shrink-0 flex-col items-end">
                  <div className="flex items-center gap-1 rounded-full bg-primary-container px-2.5 py-1">
                    <IconStarFilled size={14} className="text-on-primary-container" aria-hidden="true" />
                    <span className="text-sm font-semibold text-on-primary-container">
                      {tutor.rating.knowledge.toFixed(1)}
                    </span>
                  </div>
                  <span className="mt-1 text-xs text-outline">
                    {tutor.rating.count} Sessions
                  </span>
                </div>
              </div>
              <p className="mt-1 text-base leading-relaxed text-on-surface">{tutor.bio}</p>
              {tutor.skillsTeaching.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {tutor.skillsTeaching.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full bg-surface-container px-3 py-1 text-xs font-medium text-on-surface"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <RatingBreakdown rating={tutor.rating} />
        </section>

        {/* Availability + Booking */}
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <AvailabilityGrid slots={slots} selected={selected} onSelect={setSelected} />
          <BookingPanel
            tutor={tutor}
            selected={selected}
            onRequestBooking={handleRequestBooking}
            confirmation={confirmation}
            bookingStatus={bookingStatus}
            onSendMessage={handleSendMessage}
          />
        </section>

        {/* Study Notes */}
        <NotesSection tutor={tutor} onNavigate={onNavigate} />
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
