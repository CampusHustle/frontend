import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import TutorDetailPage from '../pages/TutorDetailPage.jsx'

const testTutor = {
  id: 'u-sarah',
  _id: 'u-sarah',
  name: 'Sarah Johnson',
  department: 'Computer Science',
  university: 'MIT',
  bio: 'CS senior who loves teaching Python, data structures, and algorithms.',
  skillsTeaching: ['Python', 'Data Structures', 'Algorithms'],
  skillsLearning: ['Machine Learning'],
  rating: { knowledge: 4.9, communication: 4.8, punctuality: 5.0, count: 38 },
  hourlyRate: 45,
  isEmailVerified: true,
}

vi.mock('../api/tutorApi.js', () => ({
  getTutorById: vi.fn().mockImplementation(async (id) => {
    if (id === 'u-sarah') {
      return { success: true, user: testTutor }
    }
    return { success: false, user: null }
  }),
}))

const setup = (id = testTutor.id, onNavigate = vi.fn()) => {
  const user = userEvent.setup()
  const onLogout = vi.fn()
  render(
    <MemoryRouter initialEntries={[`/tutor/${id}`]}>
      <Routes>
        <Route
          path="/tutor/:id"
          element={<TutorDetailPage user={testTutor} onLogout={onLogout} onNavigate={onNavigate} />}
        />
      </Routes>
    </MemoryRouter>,
  )
  return { user, onNavigate, onLogout }
}

describe('TutorDetailPage', () => {
  it('renders the tutor profile header with name, department, and bio', async () => {
    setup(testTutor.id)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: new RegExp(testTutor.name) })).toBeInTheDocument()
      expect(screen.getByText(`${testTutor.department} · ${testTutor.university}`)).toBeInTheDocument()
      expect(screen.getByText(testTutor.bio)).toBeInTheDocument()
    })
  })

  it('shows the rating breakdown, hourly rate, and skills', async () => {
    setup(testTutor.id)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Rating Breakdown' })).toBeInTheDocument()
      expect(screen.getByText('Subject Knowledge')).toBeInTheDocument()
      expect(screen.getByText('Communication')).toBeInTheDocument()
      expect(screen.getByText('Punctuality')).toBeInTheDocument()
      expect(screen.getByText(new RegExp(`ETB ${testTutor.hourlyRate}`))).toBeInTheDocument()
      testTutor.skillsTeaching.forEach((skill) => {
        expect(screen.getByText(skill)).toBeInTheDocument()
      })
    })
  })

  it('shows availability slots and requests a booking after selecting one', async () => {
    const { user } = setup(testTutor.id)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Availability' })).toBeInTheDocument()
    })

    const availableSlot = screen
      .getAllByRole('button', { name: /9:00 AM|2:00 PM/i })
      .find((el) => el.getAttribute('aria-pressed') !== null && !el.closest('[aria-disabled="true"]'))
    expect(availableSlot).toBeDefined()

    await user.click(availableSlot)
    await user.click(screen.getByRole('button', { name: 'Request Booking' }))

    expect(screen.getByText(/Booking request sent for/i)).toBeInTheDocument()
  })

  it('disables the booking button until a slot is selected', async () => {
    setup(testTutor.id)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Request Booking' })).toBeDisabled()
    })
  })

  it('renders the study notes section for the tutor', async () => {
    setup(testTutor.id)

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: `Study Notes by ${testTutor.name.split(' ')[0]}` })).toBeInTheDocument()
      expect(screen.getByText('View All')).toBeInTheDocument()
    })
  })

  it('goes back to the tutor list', async () => {
    const onNavigate = vi.fn()
    const { user } = setup(testTutor.id, onNavigate)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Back to Tutors/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /Back to Tutors/i }))

    expect(onNavigate).toHaveBeenCalledWith('tutor')
  })

  it('shows a not-found state for an unknown tutor id', async () => {
    setup('u-does-not-exist')

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Tutor not found' })).toBeInTheDocument()
    })
  })

  it('renders all four booking status states distinctly (pending, confirmed, completed, cancelled)', async () => {
    const onLogout = vi.fn()
    const onNavigate = vi.fn()

    // 1. Pending Status
    const { unmount: unmountPending } = render(
      <MemoryRouter initialEntries={[`/tutor/${testTutor.id}`]}>
        <Routes>
          <Route
            path="/tutor/:id"
            element={
              <TutorDetailPage
                user={testTutor}
                onLogout={onLogout}
                onNavigate={onNavigate}
                initialBookingStatus="pending"
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByTestId('booking-status-pending')).toBeInTheDocument()
      expect(screen.getByText(/Status: Pending Tutor Confirmation/i)).toBeInTheDocument()
    })
    unmountPending()

    // 2. Confirmed Status
    const { unmount: unmountConfirmed } = render(
      <MemoryRouter initialEntries={[`/tutor/${testTutor.id}`]}>
        <Routes>
          <Route
            path="/tutor/:id"
            element={
              <TutorDetailPage
                user={testTutor}
                onLogout={onLogout}
                onNavigate={onNavigate}
                initialBookingStatus="confirmed"
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByTestId('booking-status-confirmed')).toBeInTheDocument()
      expect(screen.getByText(/Status: Booking Confirmed \(Chat Unlocked\)/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /Join Live Chat/i })).toBeInTheDocument()
    })
    unmountConfirmed()

    // 3. Completed Status
    const { unmount: unmountCompleted } = render(
      <MemoryRouter initialEntries={[`/tutor/${testTutor.id}`]}>
        <Routes>
          <Route
            path="/tutor/:id"
            element={
              <TutorDetailPage
                user={testTutor}
                onLogout={onLogout}
                onNavigate={onNavigate}
                initialBookingStatus="completed"
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByTestId('booking-status-completed')).toBeInTheDocument()
      expect(screen.getByText(/Status: Session Completed/i)).toBeInTheDocument()
    })
    unmountCompleted()

    // 4. Cancelled / Declined Status with Re-booking
    const { unmount: unmountCancelled } = render(
      <MemoryRouter initialEntries={[`/tutor/${testTutor.id}`]}>
        <Routes>
          <Route
            path="/tutor/:id"
            element={
              <TutorDetailPage
                user={testTutor}
                onLogout={onLogout}
                onNavigate={onNavigate}
                initialBookingStatus="declined"
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    )
    await waitFor(() => {
      expect(screen.getByTestId('booking-status-cancelled')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Request New Slot' })).toBeInTheDocument()
    })

    // Click a new slot -> status resets to idle -> can click Request Booking
    const newSlotBtn = screen
      .getAllByRole('button', { name: /9:00 AM|2:00 PM/i })
      .find((el) => el.getAttribute('aria-pressed') !== null && !el.closest('[aria-disabled="true"]'))
    if (newSlotBtn) {
      await userEvent.click(newSlotBtn)
      expect(screen.getByRole('button', { name: 'Request Booking' })).toBeEnabled()
    }
    unmountCancelled()
  })
})
