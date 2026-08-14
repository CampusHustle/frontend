import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.jsx'
import { saveSessionUser, saveSessionView } from '../utils/session.js'

describe('App navigation and session persistence', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders landing page by default when not logged in', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Your campus/i)
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

    render(<App />)

    expect(screen.getByRole('heading', { name: 'Find Tutors' })).toBeInTheDocument()
  })

  it('routes existing user straight to find-tutor after login without showing complete profile', async () => {
    const user = userEvent.setup()
    saveSessionView('login')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'CampusHustle' })).toBeInTheDocument()
    expect(screen.getByText('Welcome back to the hustle.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Email'), 'student@campus.edu.et')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByRole('heading', { name: 'Find Tutors' })).toBeInTheDocument()
    expect(screen.queryByText('Complete Your Profile')).not.toBeInTheDocument()
  })

  it('routes new signups through verify-email to complete-profile', async () => {
    const user = userEvent.setup()
    saveSessionView('signup')

    render(<App />)

    expect(screen.getByText('Join the academic marketplace.')).toBeInTheDocument()

    const uniqueEmail = `newuser${Date.now()}@campus.edu.et`
    await user.type(screen.getByLabelText('Full Name'), 'New Student')
    await user.type(screen.getByLabelText('University Email'), uniqueEmail)
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(await screen.findByRole('heading', { name: 'Check your inbox!' })).toBeInTheDocument()

    // Click verify & set up profile
    await user.click(screen.getByRole('button', { name: /Verify & Set Up Profile/i }))

    expect(await screen.findByRole('heading', { name: 'Complete Your Profile' })).toBeInTheDocument()
  })

  it('renders footer on FindTutorPage with same brand branding and links', () => {
    const user = {
      id: 'u-demo',
      name: 'Demo Student',
      email: 'student@campus.edu.et',
      rating: { knowledge: 5, communication: 5, punctuality: 5, count: 1 },
      skillsTeaching: [],
    }
    saveSessionUser(user)
    saveSessionView('find-tutor')

    render(<App />)

    expect(screen.getByRole('heading', { name: 'Find Tutors' })).toBeInTheDocument()
    expect(screen.getByText(/CampusHustle Inc\./i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Start hustling/i })).toBeInTheDocument()
  })
})
