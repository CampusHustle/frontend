import {
  IconClock,
  IconCircleCheck,
  IconCircleCheckFilled,
  IconCircleX,
} from '@tabler/icons-react'

/**
 * Maps each booking status to its visual config.
 * Each entry has: icon, label, container classes, icon classes.
 */
const STATUS_CONFIG = {
  pending: {
    Icon: IconClock,
    label: 'Pending',
    containerClass:
      'bg-[#fff8e1] border border-[#ffe082] text-[#7c5e00]',
    iconClass: 'text-[#f59f00]',
    dotClass: 'bg-[#f59f00]',
  },
  confirmed: {
    Icon: IconCircleCheck,
    label: 'Confirmed',
    containerClass:
      'bg-[#e8f5e9] border border-[#c8e6c9] text-[#1b5e20]',
    iconClass: 'text-[#2e7d32]',
    dotClass: 'bg-[#2e7d32]',
  },
  completed: {
    Icon: IconCircleCheckFilled,
    label: 'Completed',
    containerClass:
      'bg-[#e3f2fd] border border-[#bbdefb] text-[#0d47a1]',
    iconClass: 'text-[#1565c0]',
    dotClass: 'bg-[#1565c0]',
  },
  cancelled: {
    Icon: IconCircleX,
    label: 'Cancelled',
    containerClass:
      'bg-[#fce4ec] border border-[#f8bbd0] text-[#880e4f]',
    iconClass: 'text-[#c62828]',
    dotClass: 'bg-[#c62828]',
  },
}

/**
 * BookingStatusBadge
 *
 * Props:
 *   status  — 'pending' | 'confirmed' | 'completed' | 'cancelled'
 *   date    — optional string appended after the label (e.g. "Oct 12, 3 PM")
 *   size    — 'sm' | 'md' (default 'md')
 */
export default function BookingStatusBadge({ status, date, size = 'md' }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending

  const { Icon, label, containerClass, iconClass } = config

  const sizeClasses =
    size === 'sm'
      ? 'py-1 px-2.5 text-xs gap-1'
      : 'py-1.5 px-3 text-sm gap-1.5'

  const iconSize = size === 'sm' ? 13 : 16

  return (
    <span
      role="status"
      aria-label={`Booking status: ${label}${date ? `, ${date}` : ''}`}
      data-status={status}
      className={`inline-flex items-center rounded-full font-semibold backdrop-blur-sm ${containerClass} ${sizeClasses}`}
    >
      <Icon size={iconSize} aria-hidden="true" className={iconClass} />
      {label}
      {date && (
        <span className="font-normal opacity-80">
          &nbsp;—&nbsp;{date}
        </span>
      )}
    </span>
  )
}

export { STATUS_CONFIG }
