import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import BookingStatusBadge from '../components/BookingStatusBadge.jsx'
import BookingCard from '../components/BookingCard.jsx'
import BookingScreen from '../screens/BookingScreen.jsx'
import * as bookingApi from '../api/mockBookingApi.js'

// vi.mock hoists above imports so BookingScreen picks up the mock binding
vi.mock('../api/mockBookingApi.js', () => ({
  fetchBookings: vi.fn(),
  fetchBooking: vi.fn(),
  updateBookingStatus: vi.fn(),
}))

/* ─── helpers ────────────────────────────────────────────────── */

function renderWithRouter(ui) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

const MOCK_BOOKINGS = [
  {
    id: 'bk-pending',
    title: 'Calculus 101 Tutoring',
    tutorName: 'Sarah Jenkins',
    tutorProfilePicUrl: null,
    status: 'pending',
    scheduledDate: 'Oct 12, 3 PM',
  },
  {
    id: 'bk-confirmed',
    title: 'Python for Beginners',
    tutorName: 'James Okafor',
    tutorProfilePicUrl: null,
    status: 'confirmed',
    scheduledDate: 'Oct 15, 10 AM',
  },
  {
    id: 'bk-completed',
    title: 'Data Structures Review',
    tutorName: 'Amara Diallo',
    tutorProfilePicUrl: null,
    status: 'completed',
    scheduledDate: 'Sep 28, 2 PM',
  },
  {
    id: 'bk-cancelled',
    title: 'Essay Writing Workshop',
    tutorName: 'Lily Chen',
    tutorProfilePicUrl: null,
    status: 'cancelled',
    scheduledDate: 'Oct 3, 11 AM',
  },
]

/* ─── BookingStatusBadge unit tests ─────────────────────────── */

describe('BookingStatusBadge', () => {
  it('renders the Pending badge with correct label and role', () => {
    render(<BookingStatusBadge status="pending" />)
    const badge = screen.getByRole('status', { name: /booking status: pending/i })
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Pending')
    expect(badge).toHaveAttribute('data-status', 'pending')
  })

  it('renders the Confirmed badge with correct label and role', () => {
    render(<BookingStatusBadge status="confirmed" />)
    const badge = screen.getByRole('status', { name: /booking status: confirmed/i })
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Confirmed')
    expect(badge).toHaveAttribute('data-status', 'confirmed')
  })

  it('renders the Completed badge with correct label and role', () => {
    render(<BookingStatusBadge status="completed" />)
    const badge = screen.getByRole('status', { name: /booking status: completed/i })
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Completed')
    expect(badge).toHaveAttribute('data-status', 'completed')
  })

  it('renders the Cancelled badge with correct label and role', () => {
    render(<BookingStatusBadge status="cancelled" />)
    const badge = screen.getByRole('status', { name: /booking status: cancelled/i })
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Cancelled')
    expect(badge).toHaveAttribute('data-status', 'cancelled')
  })

  it('all four statuses render visually distinct — each has a unique data-status value', () => {
    const { rerender, container } = render(<BookingStatusBadge status="pending" />)
    const collectAttr = () =>
      container.querySelector('[data-status]')?.getAttribute('data-status')

    const seen = new Set()
    for (const status of ['pending', 'confirmed', 'completed', 'cancelled']) {
      rerender(<BookingStatusBadge status={status} />)
      seen.add(collectAttr())
    }
    // All four values must be distinct
    expect(seen.size).toBe(4)
  })

  it('includes the date string in the accessible label when provided', () => {
    render(<BookingStatusBadge status="confirmed" date="Oct 12, 3 PM" />)
    const badge = screen.getByRole('status', {
      name: /booking status: confirmed, oct 12, 3 pm/i,
    })
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Oct 12, 3 PM')
  })

  it('falls back to pending when given an unknown status', () => {
    render(<BookingStatusBadge status="unknown-xyz" />)
    // falls back to pending config, data-status should still be the passed value
    const badge = screen.getByRole('status')
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Pending')
  })
})

/* ─── BookingCard unit tests ─────────────────────────────────── */

describe('BookingCard', () => {
  it('shows Share Contact and Message buttons only for confirmed status', () => {
    renderWithRouter(
      <BookingCard booking={MOCK_BOOKINGS[1] /* confirmed */} />,
    )
    expect(screen.getByRole('button', { name: /share contact/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /message/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('shows Message and Cancel buttons for pending status, but NOT Share Contact', () => {
    renderWithRouter(
      <BookingCard booking={MOCK_BOOKINGS[0] /* pending */} />,
    )
    expect(screen.queryByRole('button', { name: /share contact/i })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /message/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('shows no action buttons for completed status', () => {
    renderWithRouter(
      <BookingCard booking={MOCK_BOOKINGS[2] /* completed */} />,
    )
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /message/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /share contact/i })).not.toBeInTheDocument()
  })

  it('shows no action buttons for cancelled status', () => {
    renderWithRouter(
      <BookingCard booking={MOCK_BOOKINGS[3] /* cancelled */} />,
    )
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /message/i })).not.toBeInTheDocument()
  })

  it('calls onCancel with booking id when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    renderWithRouter(
      <BookingCard
        booking={MOCK_BOOKINGS[0] /* pending */}
        onCancel={onCancel}
      />,
    )
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledOnce()
    expect(onCancel).toHaveBeenCalledWith('bk-pending')
  })

  it('calls onChat with booking id when Message is clicked', async () => {
    const user = userEvent.setup()
    const onChat = vi.fn()
    renderWithRouter(
      <BookingCard
        booking={MOCK_BOOKINGS[1] /* confirmed */}
        onChat={onChat}
      />,
    )
    await user.click(screen.getByRole('button', { name: /message/i }))
    expect(onChat).toHaveBeenCalledOnce()
    expect(onChat).toHaveBeenCalledWith('bk-confirmed')
  })

  it('renders the correct BookingStatusBadge for each status', () => {
    for (const booking of MOCK_BOOKINGS) {
      const { unmount } = renderWithRouter(<BookingCard booking={booking} />)
      const badge = screen.getByRole('status')
      expect(badge).toHaveAttribute('data-status', booking.status)
      unmount()
    }
  })
})

/* ─── BookingScreen integration tests ───────────────────────── */

describe('BookingScreen', () => {
  beforeEach(() => {
    // Replace the real async API with immediate-resolving stubs
    vi.spyOn(bookingApi, 'fetchBookings').mockResolvedValue(
      MOCK_BOOKINGS.map((b) => ({ ...b })),
    )
    vi.spyOn(bookingApi, 'updateBookingStatus').mockImplementation(
      async (id, newStatus) => {
        const booking = MOCK_BOOKINGS.find((b) => b.id === id)
        return { ...booking, status: newStatus }
      },
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the page heading', async () => {
    renderWithRouter(<BookingScreen />)
    expect(await screen.findByRole('heading', { name: /my bookings/i })).toBeInTheDocument()
  })

  it('displays all four status badges after loading', async () => {
    renderWithRouter(<BookingScreen />)

    // Wait for all four bookings to appear
    await waitFor(() => {
      expect(screen.getAllByRole('status')).toHaveLength(4)
    })

    const statuses = screen
      .getAllByRole('status')
      .map((el) => el.getAttribute('data-status'))

    expect(statuses).toContain('pending')
    expect(statuses).toContain('confirmed')
    expect(statuses).toContain('completed')
    expect(statuses).toContain('cancelled')
  })

  it('shows only pending bookings when the Pending tab is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<BookingScreen />)

    await waitFor(() => expect(screen.getAllByRole('status')).toHaveLength(4))

    await user.click(screen.getByRole('tab', { name: /pending/i }))

    await waitFor(() => {
      const badges = screen.getAllByRole('status')
      expect(badges).toHaveLength(1)
      expect(badges[0]).toHaveAttribute('data-status', 'pending')
    })
  })

  it('shows only confirmed bookings when the Confirmed tab is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<BookingScreen />)

    await waitFor(() => expect(screen.getAllByRole('status')).toHaveLength(4))

    await user.click(screen.getByRole('tab', { name: /confirmed/i }))

    const badges = screen.getAllByRole('status')
    expect(badges).toHaveLength(1)
    expect(badges[0]).toHaveAttribute('data-status', 'confirmed')
  })

  it('shows only completed bookings when the Completed tab is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<BookingScreen />)

    await waitFor(() => expect(screen.getAllByRole('status')).toHaveLength(4))

    await user.click(screen.getByRole('tab', { name: /completed/i }))

    const badges = screen.getAllByRole('status')
    expect(badges).toHaveLength(1)
    expect(badges[0]).toHaveAttribute('data-status', 'completed')
  })

  it('shows only cancelled bookings when the Cancelled tab is clicked', async () => {
    const user = userEvent.setup()
    renderWithRouter(<BookingScreen />)

    await waitFor(() => expect(screen.getAllByRole('status')).toHaveLength(4))

    await user.click(screen.getByRole('tab', { name: /cancelled/i }))

    const badges = screen.getAllByRole('status')
    expect(badges).toHaveLength(1)
    expect(badges[0]).toHaveAttribute('data-status', 'cancelled')
  })

  it('updates the status badge when a backend status change resolves', async () => {
    const user = userEvent.setup()

    // updateBookingStatus mock: resolve immediately with the updated booking
    bookingApi.updateBookingStatus.mockImplementation(async (id, newStatus) => {
      const seed = [
        { id: 'bk-pending', title: 'Calculus 101 Tutoring', tutorName: 'Sarah Jenkins', tutorProfilePicUrl: null, status: 'pending', scheduledDate: 'Oct 12, 3 PM' },
        { id: 'bk-confirmed', title: 'Python for Beginners', tutorName: 'James Okafor', tutorProfilePicUrl: null, status: 'confirmed', scheduledDate: 'Oct 15, 10 AM' },
        { id: 'bk-completed', title: 'Data Structures Review', tutorName: 'Amara Diallo', tutorProfilePicUrl: null, status: 'completed', scheduledDate: 'Sep 28, 2 PM' },
        { id: 'bk-cancelled', title: 'Essay Writing Workshop', tutorName: 'Lily Chen', tutorProfilePicUrl: null, status: 'cancelled', scheduledDate: 'Oct 3, 11 AM' },
      ]
      const booking = seed.find((b) => b.id === id)
      return { ...booking, status: newStatus }
    })

    renderWithRouter(<BookingScreen />)

    // Wait for all four bookings to load
    await waitFor(() => expect(screen.getAllByRole('status')).toHaveLength(4))

    // There is a pending booking — find its Cancel button and cancel it
    const pendingCard = screen
      .getAllByRole('article')
      .find((el) => within(el).queryByRole('status', { name: /pending/i }))
    expect(pendingCard).toBeDefined()

    await user.click(within(pendingCard).getByRole('button', { name: /cancel/i }))

    // The pending booking is now cancelled — the pending badge should disappear
    await waitFor(() => {
      const statuses = screen
        .getAllByRole('status')
        .map((el) => el.getAttribute('data-status'))
      expect(statuses).not.toContain('pending')
      expect(statuses).toContain('cancelled')
    })
  })

  it('opens the chat panel when Message is clicked on a pending booking', async () => {
    const user = userEvent.setup()
    // scrollIntoView is not implemented in jsdom
    window.HTMLElement.prototype.scrollIntoView = vi.fn()

    renderWithRouter(<BookingScreen />)

    await waitFor(() => expect(screen.getAllByRole('status')).toHaveLength(4))

    // The pending booking card should have a Message button
    const pendingCard = screen
      .getAllByRole('article')
      .find((el) => within(el).queryByRole('status', { name: /pending/i }))

    expect(pendingCard).toBeDefined()
    await user.click(within(pendingCard).getByRole('button', { name: /message/i }))

    expect(
      await screen.findByRole('region', { name: /chat with sarah jenkins/i }),
    ).toBeInTheDocument()
  })

  it('shows a loading indicator while bookings are being fetched', () => {
    // Never-resolving promise keeps the loading state active
    vi.spyOn(bookingApi, 'fetchBookings').mockReturnValue(new Promise(() => { }))
    renderWithRouter(<BookingScreen />)
    // The loading div has role="status" but no aria-label — match by text content
    const loadingEl = screen.getByRole('status')
    expect(loadingEl).toHaveTextContent(/loading bookings/i)
  })

  it('shows an error message when fetchBookings rejects', async () => {
    vi.spyOn(bookingApi, 'fetchBookings').mockRejectedValue(
      new Error('Network error'),
    )
    renderWithRouter(<BookingScreen />)
    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(/failed to load bookings/i)
  })
})
