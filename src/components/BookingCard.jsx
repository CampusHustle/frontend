import { IconShare2, IconMessageCircle, IconX } from '@tabler/icons-react'
import BookingStatusBadge from './BookingStatusBadge.jsx'

function initialsOf(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

function Avatar({ name, profilePicUrl }) {
  if (profilePicUrl) {
    return (
      <img
        src={profilePicUrl}
        alt={`${name} profile photo`}
        className="size-14 shrink-0 rounded-full border-2 border-white object-cover shadow-sm"
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className="size-14 shrink-0 rounded-full border-2 border-white bg-primary-fixed text-lg font-bold text-primary shadow-sm flex items-center justify-center"
    >
      {initialsOf(name)}
    </div>
  )
}

/**
 * BookingCard
 *
 * Displays a single booking with its status badge and contextual actions.
 *
 * Props:
 *   booking — {
 *     id, title, tutorName, tutorProfilePicUrl,
 *     status: 'pending'|'confirmed'|'completed'|'cancelled',
 *     scheduledDate   — human-readable string e.g. "Oct 12, 3 PM"
 *   }
 *   onChat      — () => void  (open chat)
 *   onCancel    — (id) => void (cancel booking; only shown for pending/confirmed)
 *   onShareContact — (id) => void (only shown when confirmed)
 */
export default function BookingCard({
  booking,
  onChat,
  onCancel,
  onShareContact,
}) {
  const { id, title, tutorName, tutorProfilePicUrl, status, scheduledDate } =
    booking

  const canCancel = status === 'pending' || status === 'confirmed'
  const canShare = status === 'confirmed'
  const canChat = status === 'pending' || status === 'confirmed'

  return (
    <article
      aria-label={`Booking: ${title} with ${tutorName}`}
      className="glass-card rounded-2xl p-5 relative overflow-hidden group transition-shadow hover:shadow-md"
    >
      {/* decorative blob */}
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-secondary-container/10 blur-2xl transition-colors group-hover:bg-secondary-container/20" />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: avatar + info */}
        <div className="flex items-center gap-4">
          <Avatar name={tutorName} profilePicUrl={tutorProfilePicUrl} />
          <div>
            <h3 className="font-semibold text-base text-primary leading-snug">
              {title}
            </h3>
            <p className="text-sm text-on-surface-variant mt-0.5">
              with {tutorName}
            </p>
          </div>
        </div>

        {/* Right: badge + actions */}
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <BookingStatusBadge status={status} date={scheduledDate} />

          <div className="flex flex-wrap gap-2 mt-1">
            {canShare && (
              <button
                type="button"
                onClick={() => onShareContact?.(id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/50 px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm transition-colors hover:bg-surface-container-low"
              >
                <IconShare2 size={14} aria-hidden="true" />
                Share Contact
              </button>
            )}

            {canChat && (
              <button
                type="button"
                onClick={() => onChat?.(id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white/50 px-3.5 py-1.5 text-xs font-semibold text-primary backdrop-blur-sm transition-colors hover:bg-surface-container-low"
              >
                <IconMessageCircle size={14} aria-hidden="true" />
                Message
              </button>
            )}

            {canCancel && (
              <button
                type="button"
                onClick={() => onCancel?.(id)}
                className="inline-flex items-center gap-1.5 rounded-full border border-error/20 bg-white/50 px-3.5 py-1.5 text-xs font-semibold text-error backdrop-blur-sm transition-colors hover:bg-error-container"
              >
                <IconX size={14} aria-hidden="true" />
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
