import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

import BookingStatusBadge from '../components/BookingStatusBadge.jsx'
import BookingCard from '../components/BookingCard.jsx'
import BookingScreen from '../screens/BookingScreen.jsx'
import * as liveBookingApi from '../api/bookingApi.js'

// vi.mock hoists above imports so BookingScreen picks up the mock binding
vi.mock('../api/bookingApi.js', () => ({
  getUserBookings: vi.fn(),
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
})

/* ─── BookingCard unit tests ─────────────────────────────────── */

describe('BookingCard', () => {
  it('renders tutor name and title for student view', () => {
    renderWithRouter(<BookingCard booking={MOCK_BOOKINGS[0]} />)
    expect(screen.getByText('Calculus 101 Tutoring')).toBeInTheDocument()
    expect(screen.getByText(/Sarah Jenkins/)).toBeInTheDocument()
    expect(screen.getByText(/Oct 12, 3 PM/)).toBeInTheDocument()
  })

  it('renders Cancel button for pending bookings', () => {
    renderWithRouter(<BookingCard booking={MOCK_BOOKINGS[0] /* pending */} />)
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('renders Cancel button for confirmed bookings', () => {
    renderWithRouter(<BookingCard booking={MOCK_BOOKINGS[1] /* confirmed */} />)
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
  })

  it('calls onCancel callback with booking ID when Cancel button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    renderWithRouter(
      <BookingCard booking={MOCK_BOOKINGS[0]} onCancel={onCancel} />,
    )
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledOnce()
    expect(onCancel).toHaveBeenCalledWith('bk-pending')
  })

  it('calls onChat callback with booking ID when Message button is clicked', async () => {
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
    vi.spyOn(liveBookingApi, 'getUserBookings').mockResolvedValue({
      data: MOCK_BOOKINGS.map((b) => ({ ...b })),
    })
    vi.spyOn(liveBookingApi, 'updateBookingStatus').mockImplementation(
      async (id, newStatus) => {
        const booking = MOCK_BOOKINGS.find((b) => b.id === id)
        return { data: { ...booking, status: newStatus } }
      },
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the page heading and active navbar highlight', async () => {
    renderWithRouter(<BookingScreen />)
    expect(await screen.findByRole('heading', { name: /my bookings/i })).toBeInTheDocument()
    
    // Check active navbar link for Bookings
    const bookingsNavLink = screen.getByRole('link', { name: 'Bookings' })
    expect(bookingsNavLink).toHaveClass('border-b-2')
    expect(bookingsNavLink).toHaveClass('border-secondary-container')
  })

  it('displays all four status badges after loading', async () => {
    renderWithRouter(<BookingScreen />)

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

    renderWithRouter(<BookingScreen />)

    await waitFor(() => expect(screen.getAllByRole('status')).toHaveLength(4))

    const pendingCard = screen
      .getAllByRole('article')
      .find((el) => within(el).queryByRole('status', { name: /pending/i }))
    expect(pendingCard).toBeDefined()

    await user.click(within(pendingCard).getByRole('button', { name: /cancel/i }))

    await waitFor(() => {
      const statuses = screen
        .getAllByRole('status')
        .map((el) => el.getAttribute('data-status'))
      expect(statuses).not.toContain('pending')
      expect(statuses).toContain('cancelled')
    })
  })

  it('shows a loading indicator while bookings are being fetched', () => {
    vi.spyOn(liveBookingApi, 'getUserBookings').mockReturnValue(new Promise(() => { }))
    renderWithRouter(<BookingScreen />)
    const loadingEl = screen.getByRole('status')
    expect(loadingEl).toHaveTextContent(/loading bookings/i)
  })

  it('shows an error message when getUserBookings rejects', async () => {
    vi.spyOn(liveBookingApi, 'getUserBookings').mockRejectedValue(
      new Error('Network error'),
    )
    renderWithRouter(<BookingScreen />)
    expect(
      await screen.findByRole('alert'),
    ).toHaveTextContent(/network error/i)
  })
})
