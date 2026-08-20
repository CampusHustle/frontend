import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App.jsx'
import {
  getAccessToken,
  loadSessionUser,
} from '../utils/session.js'

describe('End-to-End Auth Integration', () => {
  beforeEach(() => {
    localStorage.clear()
    window.history.pushState({}, '', '/')
    vi.restoreAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('performs full user registration flow and navigates to verify-email', async () => {
    const user = userEvent.setup()
    const mockCreatedUser = {
      id: 'u-101',
      name: 'Haile Gebrselassie',
      email: 'haile@aau.edu.et',
      role: 'student',
      university: 'Addis Ababa University',
    }

    globalThis.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/auth/register')) {
        return Promise.resolve({
          ok: true,
          status: 201,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({
            user: mockCreatedUser,
            accessToken: 'test-jwt-access',
            refreshToken: 'test-jwt-refresh',
          }),
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      })
    })

    window.history.pushState({}, '', '/signup')
    render(<App />)

    await user.type(screen.getByLabelText(/Full Name/i), 'Haile Gebrselassie')
    await user.type(screen.getByLabelText(/University Email/i), 'haile@aau.edu.et')
    await user.type(screen.getByLabelText(/^Password/i), 'password123')
    await user.type(screen.getByLabelText(/Confirm Password/i), 'password123')

    const submitBtn = screen.getByRole('button', { name: /Create Account/i })
    await user.click(submitBtn)

    expect(await screen.findByText(/Check your inbox!/i)).toBeInTheDocument()
    expect(screen.getByText('haile@aau.edu.et')).toBeInTheDocument()
    expect(getAccessToken()).toBe('test-jwt-access')
  })

  it('performs first-time user login and redirects to complete-profile', async () => {
    const user = userEvent.setup()
    const mockNewUser = {
      id: 'u-202',
      name: 'Derartu Tulu',
      email: 'derartu@aau.edu.et',
      role: 'student',
      university: 'Addis Ababa University',
    }

    globalThis.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/auth/login')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({
            user: mockNewUser,
            accessToken: 'login-access-token',
            refreshToken: 'login-refresh-token',
          }),
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      })
    })

    window.history.pushState({}, '', '/login')
    render(<App />)

    await user.type(screen.getByLabelText(/^Email/i), 'derartu@aau.edu.et')
    await user.type(screen.getByLabelText(/^Password/i), 'secret123')

    await user.click(screen.getByRole('button', { name: /Log in/i }))

    expect(await screen.findByRole('heading', { name: 'Complete Your Profile' })).toBeInTheDocument()
    expect(loadSessionUser()).toEqual(mockNewUser)
  })

  it('performs completed user login and redirects straight to tutor marketplace', async () => {
    const user = userEvent.setup()
    const mockCompletedUser = {
      id: 'u-203',
      name: 'Kenenisa Bekele',
      email: 'kenenisa@aau.edu.et',
      role: 'student',
      university: 'Addis Ababa University',
      department: 'Athletics & Sports Science',
      bio: 'Olympic champion and sports tutor.',
      isProfileComplete: true,
    }

    globalThis.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/auth/login')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({
            user: mockCompletedUser,
            accessToken: 'login-access-token-2',
            refreshToken: 'login-refresh-token-2',
          }),
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({}),
      })
    })

    window.history.pushState({}, '', '/login')
    render(<App />)

    await user.type(screen.getByLabelText(/^Email/i), 'kenenisa@aau.edu.et')
    await user.type(screen.getByLabelText(/^Password/i), 'secret123')

    await user.click(screen.getByRole('button', { name: /Log in/i }))

    expect(await screen.findByRole('heading', { name: 'Find Tutors' })).toBeInTheDocument()
    expect(loadSessionUser()).toEqual(mockCompletedUser)
  })
})
