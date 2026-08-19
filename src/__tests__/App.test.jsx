import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.jsx'
import { saveSessionUser, saveSessionView } from '../utils/session.js'

describe('App navigation and session persistence', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.pushState({}, '', '/')
  })

  it('renders landing page by default when not logged in', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Trade your notes/i)
  })

  it('restores find-tutor page on refresh when user is logged in', () => {
    const user = {
      id: 'u-demo',
      name: 'Demo Student',
      email: 'student@campus.edu.et',
      university: 'Campus University',
      department: 'General Studies',
      rating: { knowledge: 4.8, communication: 4.8, punctuality: 4.8, count: 5 },
      skillsTeaching: ['Python'],
      skillsLearning: [],
    }
    saveSessionUser(user)
    saveSessionView('find-tutor')
    window.history.pushState({}, '', '/tutor')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'Find Tutors' })).toBeInTheDocument()
  })

  it('routes existing user straight to find-tutor after login without showing complete profile', async () => {
    const user = userEvent.setup()
    saveSessionView('login')
    window.history.pushState({}, '', '/login')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'CampusHustle' })).toBeInTheDocument()
    expect(screen.getByText('Welcome back to the hustle.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Email'), 'student@campus.edu.et')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByRole('heading', { name: 'Find Tutors' })).toBeInTheDocument()
    expect(screen.queryByText('Complete Your Profile')).not.toBeInTheDocument()
  })

  it('navigates to My Profile when the profile icon is clicked', async () => {
    const user = userEvent.setup()
    saveSessionView('login')
    window.history.pushState({}, '', '/login')

    render(<App />)

    await user.type(screen.getByLabelText('Email'), 'student@campus.edu.et')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByRole('heading', { name: 'Find Tutors' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'View my profile' }))

    expect(await screen.findByRole('heading', { name: 'My Profile' })).toBeInTheDocument()
    expect(screen.getByText('Demo Student')).toBeInTheDocument()
    expect(screen.getByText('General Studies • Campus University • sophomore')).toBeInTheDocument()
    expect(
      screen.getByText('Demo account used to walk through the CampusHustle flow.'),
    ).toBeInTheDocument()
  })

  it('routes new signups through verify-email', async () => {
    const user = userEvent.setup()
    saveSessionView('signup')
    window.history.pushState({}, '', '/signup')

    render(<App />)

    expect(screen.getByText('Join the academic marketplace.')).toBeInTheDocument()

    const uniqueEmail = `newuser${Date.now()}@campus.edu.et`
    await user.type(screen.getByLabelText('Full Name'), 'New Student')
    await user.type(screen.getByLabelText('University Email'), uniqueEmail)
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(await screen.findByRole('heading', { name: 'Check your inbox!' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Verify & Set Up Profile' })).not.toBeInTheDocument()
  })

  it('navigates to a tutor detail page when a tutor card is clicked', async () => {
    const user = userEvent.setup()
    saveSessionView('login')
    window.history.pushState({}, '', '/login')

    render(<App />)

    await user.type(screen.getByLabelText('Email'), 'student@campus.edu.et')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByRole('heading', { name: 'Find Tutors' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'View profile of Sarah Johnson' }))

    expect(await screen.findByRole('heading', { name: /Sarah Johnson/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Rating Breakdown' })).toBeInTheDocument()
  })

  it('renders footer without marketing links on FindTutorPage when logged in, but with branding and legal links', () => {
    const user = {
      id: 'u-demo',
      name: 'Demo Student',
      email: 'student@campus.edu.et',
      rating: { knowledge: 5, communication: 5, punctuality: 5, count: 1 },
      skillsTeaching: [],
    }
    saveSessionUser(user)
    saveSessionView('find-tutor')
    window.history.pushState({}, '', '/tutor')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'Find Tutors' })).toBeInTheDocument()
    expect(screen.getByText(/CampusHustle Inc\./i)).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /Start hustling/i })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Product' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Resources' })).toBeInTheDocument()
  })

  it('renders full marketing footer on landing page when not logged in', () => {
    render(<App />)
    expect(screen.getAllByRole('link', { name: /Start hustling/i }).length).toBeGreaterThanOrEqual(1)
    expect(screen.getByRole('heading', { name: 'Product' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Resources' })).toBeInTheDocument()
  })

  it('shows logout warning overlay on logout click and cancels smoothly', async () => {
    const user = userEvent.setup()
    const student = {
      id: 'u-demo',
      name: 'Demo Student',
      email: 'student@campus.edu.et',
      university: 'Campus University',
      department: 'General Studies',
    }
    saveSessionUser(student)
    saveSessionView('find-tutor')
    window.history.pushState({}, '', '/tutor')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'Find Tutors' })).toBeInTheDocument()

    // Click logout button in navbar
    await user.click(screen.getByRole('button', { name: 'Log out' }))

    // Logout warning overlay should appear on top of current page
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Log Out of CampusHustle?' })).toBeInTheDocument()
    expect(screen.getByText('Demo Student')).toBeInTheDocument()

    // Clicking "Stay Logged In" dismisses the overlay and keeps user on Find Tutors
    await user.click(screen.getByRole('button', { name: 'Stay Logged In' }))
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Find Tutors' })).toBeInTheDocument()
  })

  it('confirms logout from warning overlay, clears session, and redirects to home', async () => {
    const user = userEvent.setup()
    const student = {
      id: 'u-demo',
      name: 'Demo Student',
      email: 'student@campus.edu.et',
    }
    saveSessionUser(student)
    saveSessionView('find-tutor')
    window.history.pushState({}, '', '/tutor')

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'Log out' }))
    expect(screen.getByRole('alertdialog')).toBeInTheDocument()

    // Confirm logout
    await user.click(screen.getByRole('button', { name: /Yes, Log Out/i }))

    // Overlay is closed, user is logged out and back to landing page
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Trade your notes/i)
  })

  it('navigates to Profile page on avatar click even without active session user', async () => {
    const user = userEvent.setup()
    saveSessionView('find-tutor')
    window.history.pushState({}, '', '/tutor')

    render(<App />)

    await user.click(screen.getByRole('button', { name: 'View my profile' }))

    expect(await screen.findByRole('heading', { name: 'My Profile' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { level: 1, name: /Your campus/i })).not.toBeInTheDocument()
  })
})
