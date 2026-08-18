import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import TutorDetailPage from '../pages/TutorDetailPage.jsx'
import { tutors } from '../api/mockUsers.js'

const setup = (id = tutors[0].id, onNavigate = vi.fn()) => {
  const user = userEvent.setup()
  const onLogout = vi.fn()
  render(
    <MemoryRouter initialEntries={[`/tutor/${id}`]}>
      <Routes>
        <Route
          path="/tutor/:id"
          element={<TutorDetailPage user={tutors[0]} onLogout={onLogout} onNavigate={onNavigate} />}
        />
      </Routes>
    </MemoryRouter>,
  )
  return { user, onNavigate, onLogout }
}

describe('TutorDetailPage', () => {
  it('renders the tutor profile header with name, department, and bio', () => {
    const tutor = tutors[0]
    setup(tutor.id)

    expect(screen.getByRole('heading', { name: new RegExp(tutor.name) })).toBeInTheDocument()
    expect(screen.getByText(`${tutor.department} · ${tutor.university}`)).toBeInTheDocument()
    expect(screen.getByText(tutor.bio)).toBeInTheDocument()
  })

  it('shows the rating breakdown, hourly rate, and skills', () => {
    const tutor = tutors[0]
    setup(tutor.id)

    expect(screen.getByRole('heading', { name: 'Rating Breakdown' })).toBeInTheDocument()
    expect(screen.getByText('Subject Knowledge')).toBeInTheDocument()
    expect(screen.getByText('Communication')).toBeInTheDocument()
    expect(screen.getByText('Punctuality')).toBeInTheDocument()
    expect(screen.getByText(`$${tutor.hourlyRate}`)).toBeInTheDocument()
    tutor.skillsTeaching.forEach((skill) => {
      expect(screen.getByText(skill)).toBeInTheDocument()
    })
  })

  it('shows availability slots and requests a booking after selecting one', async () => {
    const { user } = setup(tutors[0].id)

    expect(screen.getByRole('heading', { name: 'Availability' })).toBeInTheDocument()

    const availableSlot = screen
      .getAllByRole('button', { name: /9:00 AM|2:00 PM/i })
      .find((el) => el.getAttribute('aria-pressed') !== null && !el.closest('[aria-disabled="true"]'))
    expect(availableSlot).toBeDefined()

    await user.click(availableSlot)
    await user.click(screen.getByRole('button', { name: 'Request Booking' }))

    expect(screen.getByText(/Booking request sent for/i)).toBeInTheDocument()
  })

  it('disables the booking button until a slot is selected', () => {
    setup(tutors[0].id)

    expect(screen.getByRole('button', { name: 'Request Booking' })).toBeDisabled()
  })

  it('renders the study notes section for the tutor', () => {
    const tutor = tutors[0]
    setup(tutor.id)

    expect(screen.getByRole('heading', { name: `Study Notes by ${tutor.name.split(' ')[0]}` })).toBeInTheDocument()
    expect(screen.getByText('View All')).toBeInTheDocument()
  })

  it('goes back to the tutor list', async () => {
    const onNavigate = vi.fn()
    const { user } = setup(tutors[0].id, onNavigate)

    await user.click(screen.getByRole('button', { name: /Back to Tutors/i }))

    expect(onNavigate).toHaveBeenCalledWith('tutor')
  })

  it('shows a not-found state for an unknown tutor id', () => {
    setup('u-does-not-exist')

    expect(screen.getByRole('heading', { name: 'Tutor not found' })).toBeInTheDocument()
  })

  it('renders all four booking status states distinctly (pending, confirmed, completed, cancelled)', () => {
    const onLogout = vi.fn()
    const onNavigate = vi.fn()

    // 1. Pending Status
    const { unmount: unmountPending } = render(
      <MemoryRouter initialEntries={[`/tutor/${tutors[0].id}`]}>
        <Routes>
          <Route
            path="/tutor/:id"
            element={
              <TutorDetailPage
                user={tutors[0]}
                onLogout={onLogout}
                onNavigate={onNavigate}
                initialBookingStatus="pending"
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByTestId('booking-status-pending')).toBeInTheDocument()
    expect(screen.getByText(/Status: Pending Tutor Confirmation/i)).toBeInTheDocument()
    unmountPending()

    // 2. Confirmed Status
    const { unmount: unmountConfirmed } = render(
      <MemoryRouter initialEntries={[`/tutor/${tutors[0].id}`]}>
        <Routes>
          <Route
            path="/tutor/:id"
            element={
              <TutorDetailPage
                user={tutors[0]}
                onLogout={onLogout}
                onNavigate={onNavigate}
                initialBookingStatus="confirmed"
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByTestId('booking-status-confirmed')).toBeInTheDocument()
    expect(screen.getByText(/Status: Booking Confirmed \(Chat Unlocked\)/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Join Live Chat/i })).toBeInTheDocument()
    unmountConfirmed()

    // 3. Completed Status
    const { unmount: unmountCompleted } = render(
      <MemoryRouter initialEntries={[`/tutor/${tutors[0].id}`]}>
        <Routes>
          <Route
            path="/tutor/:id"
            element={
              <TutorDetailPage
                user={tutors[0]}
                onLogout={onLogout}
                onNavigate={onNavigate}
                initialBookingStatus="completed"
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByTestId('booking-status-completed')).toBeInTheDocument()
    expect(screen.getByText(/Status: Session Completed/i)).toBeInTheDocument()
    unmountCompleted()

    // 4. Cancelled Status
    render(
      <MemoryRouter initialEntries={[`/tutor/${tutors[0].id}`]}>
        <Routes>
          <Route
            path="/tutor/:id"
            element={
              <TutorDetailPage
                user={tutors[0]}
                onLogout={onLogout}
                onNavigate={onNavigate}
                initialBookingStatus="cancelled"
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    )
    expect(screen.getByTestId('booking-status-cancelled')).toBeInTheDocument()
    expect(screen.getByText(/Status: Booking Cancelled/i)).toBeInTheDocument()
  })
})
