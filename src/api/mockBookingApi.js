/**
 * mockBookingApi.js
 *
 * Simulates a backend that owns booking state.  Every mutating call returns a
 * Promise that resolves after a short delay, mirroring real network latency.
 * Status transitions follow the real lifecycle:
 *
 *   pending → confirmed → completed
 *   pending → cancelled
 *   confirmed → cancelled
 */

const DELAY = 600 // ms

/** @type {import('./mockBookingApi').Booking[]} */
let _bookings = [
  {
    id: 'bk-1',
    title: 'Calculus 101 Tutoring',
    tutorName: 'Sarah Jenkins',
    tutorProfilePicUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAFaeKTzFM4YDER6x-18N_hPeswPK6Mqa0hODS9_M9Q3dHO5mwu5tTDx25XmzZsd2yumBTHd2RGCf7G8nffp4n--wFueDYH30HViox3CFvEchcz5tE8hKH16ueP_gyKkrrXvM1SmgcYwRRE7q95aIMmqZUCGjfdCc4dGuDIznG7C4L3sffv49hNsdjYRjS4hZUh0V3R9-UfJ1o6Sf27z3j_gG9AubO0SsIAGV7nPdyGVToYiAciTVdpxQ',
    status: 'confirmed',
    scheduledDate: 'Oct 12, 3 PM',
  },
  {
    id: 'bk-2',
    title: 'Python for Beginners',
    tutorName: 'James Okafor',
    tutorProfilePicUrl: null,
    status: 'pending',
    scheduledDate: 'Oct 15, 10 AM',
  },
  {
    id: 'bk-3',
    title: 'Data Structures Review',
    tutorName: 'Amara Diallo',
    tutorProfilePicUrl: null,
    status: 'completed',
    scheduledDate: 'Sep 28, 2 PM',
  },
  {
    id: 'bk-4',
    title: 'Essay Writing Workshop',
    tutorName: 'Lily Chen',
    tutorProfilePicUrl: null,
    status: 'cancelled',
    scheduledDate: 'Oct 3, 11 AM',
  },
]

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Fetch all bookings for the current user. */
export async function fetchBookings() {
  await delay(DELAY)
  return _bookings.map((b) => ({ ...b }))
}

/** Fetch a single booking by id. Rejects if not found. */
export async function fetchBooking(id) {
  await delay(DELAY)
  const booking = _bookings.find((b) => b.id === id)
  if (!booking) throw new Error(`Booking ${id} not found`)
  return { ...booking }
}

/**
 * Update the status of a booking.
 * Validates the transition and rejects invalid moves.
 */
export async function updateBookingStatus(id, newStatus) {
  await delay(DELAY)

  const VALID_TRANSITIONS = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['completed', 'cancelled'],
    completed: [],
    cancelled: [],
  }

  const booking = _bookings.find((b) => b.id === id)
  if (!booking) throw new Error(`Booking ${id} not found`)

  const allowed = VALID_TRANSITIONS[booking.status] ?? []
  if (!allowed.includes(newStatus)) {
    throw new Error(
      `Cannot move booking from "${booking.status}" to "${newStatus}"`,
    )
  }

  booking.status = newStatus
  return { ...booking }
}

/**
 * Create a new booking in pending state.
 * @param {{ tutorId: string, tutorName: string, tutorProfilePicUrl: string|null, subject: string, day: string, time: string }} params
 */
export async function createBooking({ _tutorId, tutorName, tutorProfilePicUrl, subject, day, time }) {
  await delay(DELAY)
  const newBooking = {
    id: `bk-${Date.now()}`,
    title: subject,
    tutorName,
    tutorProfilePicUrl: tutorProfilePicUrl ?? null,
    status: 'pending',
    scheduledDate: `${day}, ${time}`,
  }
  _bookings.unshift(newBooking)
  return { ...newBooking }
}
