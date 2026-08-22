import { useState, useEffect } from 'react'
import {
  IconCalendar,
  IconClock,
  IconPlus,
  IconTrash,
  IconCircleCheckFilled,
  IconAlertCircle,
  IconLoader2,
} from '@tabler/icons-react'
import {
  getMyAvailability,
  createAvailabilitySlot,
  deleteAvailabilitySlot,
} from '../api/bookingApi.js'

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]

const TIME_OPTIONS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
]

export default function AvailabilityManager() {
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Form state
  const [dayOfWeek, setDayOfWeek] = useState('Monday')
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('10:00')
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    let isMounted = true
    getMyAvailability()
      .then((res) => {
        if (!isMounted) return
        if (res?.data && Array.isArray(res.data)) {
          setSlots(res.data)
        } else if (res?.slots && Array.isArray(res.slots)) {
          setSlots(res.slots)
        } else {
          setSlots([])
        }
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Failed to load availability slots.')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  const handleAddSlot = async (e) => {
    e.preventDefault()
    if (!dayOfWeek || !startTime || !endTime) return

    if (startTime >= endTime) {
      setError('End time must be strictly after start time.')
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const res = await createAvailabilitySlot({ dayOfWeek, startTime, endTime })
      const newSlot = res?.data || res?.slot || res
      if (newSlot) {
        setSlots((prev) => [newSlot, ...prev])
        showToast('Availability slot added!')
        // Default next slot to 1 hr later
        const [h] = startTime.split(':').map(Number)
        const nextH = Math.min(h + 1, 20)
        const nextH2 = Math.min(nextH + 1, 21)
        setStartTime(`${String(nextH).padStart(2, '0')}:00`)
        setEndTime(`${String(nextH2).padStart(2, '0')}:00`)
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to add slot.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSlot = async (slotId) => {
    setDeletingId(slotId)
    setError(null)
    try {
      await deleteAvailabilitySlot(slotId)
      setSlots((prev) => prev.filter((s) => (s._id || s.id) !== slotId))
      showToast('Slot deleted.', 'info')
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to delete slot.')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <section
      aria-label="Tutor Availability Management"
      className="mt-6 rounded-xl border border-surface-variant bg-surface-lowest p-6 shadow-level-1"
    >
      <div className="flex items-center justify-between border-b border-surface-variant pb-4 mb-6">
        <div>
          <h3 className="font-display text-lg font-bold text-primary flex items-center gap-2">
            <IconCalendar size={20} className="text-secondary" />
            <span>Manage My Availability</span>
          </h3>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Set recurring weekly slots when students can request tutoring sessions with you.
          </p>
        </div>
        <span className="rounded-full bg-primary-container px-3 py-1 text-xs font-semibold text-on-primary-container">
          {slots.length} {slots.length === 1 ? 'Slot' : 'Slots'} Active
        </span>
      </div>

      {toast && (
        <div
          role="status"
          className={`mb-4 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold animate-in fade-in duration-200 ${
            toast.type === 'info'
              ? 'border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
          }`}
        >
          <IconCircleCheckFilled size={16} />
          <span>{toast.msg}</span>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="mb-4 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-400"
        >
          <IconAlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Slot Form */}
      <form
        onSubmit={handleAddSlot}
        className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-4 items-end rounded-xl border border-surface-variant/70 bg-surface-low p-4"
      >
        <div>
          <label className="block text-xs font-semibold text-on-surface mb-1">Day of Week</label>
          <select
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(e.target.value)}
            className="w-full rounded-lg border border-surface-variant bg-surface px-3 py-2 text-xs font-medium text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {DAYS_OF_WEEK.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-on-surface mb-1">Start Time</label>
          <select
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full rounded-lg border border-surface-variant bg-surface px-3 py-2 text-xs font-medium text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-on-surface mb-1">End Time</label>
          <select
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full rounded-lg border border-surface-variant bg-surface px-3 py-2 text-xs font-medium text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-container active:scale-95 disabled:opacity-50 cursor-pointer"
        >
          {submitting ? (
            <IconLoader2 size={16} className="animate-spin" />
          ) : (
            <IconPlus size={16} stroke={2.5} />
          )}
          <span>Add Slot</span>
        </button>
      </form>

      {/* Slots List */}
      {loading ? (
        <div className="flex items-center justify-center py-8 text-xs text-on-surface-variant gap-2">
          <IconLoader2 size={18} className="animate-spin text-primary" />
          <span>Loading availability slots…</span>
        </div>
      ) : slots.length === 0 ? (
        <div className="rounded-xl border border-dashed border-surface-variant p-8 text-center text-xs text-on-surface-variant">
          <p className="font-semibold text-on-surface mb-1">No availability slots configured</p>
          <p>Use the form above to add weekly recurring slots so students can book you.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {slots.map((slot) => {
            const id = slot._id || slot.id
            const isDeleting = deletingId === id
            return (
              <div
                key={id}
                className="flex items-center justify-between rounded-xl border border-surface-variant bg-surface p-3.5 shadow-xs transition-shadow hover:shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary-container/30 text-primary">
                    <IconClock size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">{slot.dayOfWeek}</p>
                    <p className="text-[11px] text-on-surface-variant">
                      {slot.startTime} – {slot.endTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      slot.isBooked
                        ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {slot.isBooked ? 'Booked' : 'Available'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleDeleteSlot(id)}
                    disabled={slot.isBooked || isDeleting}
                    title={slot.isBooked ? 'Cannot delete booked slot' : 'Delete slot'}
                    aria-label={`Delete ${slot.dayOfWeek} ${slot.startTime} slot`}
                    className="inline-flex size-7 items-center justify-center rounded-lg border border-outline-variant text-on-surface-variant transition-colors hover:border-error hover:bg-error-container hover:text-error disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                  >
                    {isDeleting ? (
                      <IconLoader2 size={13} className="animate-spin" />
                    ) : (
                      <IconTrash size={14} />
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}
