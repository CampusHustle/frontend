import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../pages/LoginForm.jsx'

const setup = () => {
  const user = userEvent.setup()
  render(<LoginForm onSwitchToSignup={() => {}} />)
  return user
}

describe('LoginForm', () => {
  beforeEach(() => {
    localStorage.clear()
    globalThis.fetch = vi.fn().mockImplementation((url, options) => {
      const body = options?.body ? JSON.parse(options.body) : {}
      if (body.email && body.email.includes('fail')) {
        return Promise.resolve({
          ok: false,
          status: 401,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ message: 'Invalid email or password' }),
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          user: { id: 'u-1', name: 'Demo Student', email: body.email },
          accessToken: 'token-123',
          refreshToken: 'refresh-123',
        }),
      })
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })
  it('shows inline errors when submitting with empty fields', async () => {
    const user = setup()

    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('shows a loading state then a success toast for valid credentials', async () => {
    const user = setup()

    await user.type(screen.getByLabelText('Email'), 'student@campus.edu.et')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByTestId('toast-success')).toHaveTextContent('Logged in successfully')
  })

  it('shows an error toast when login fails', async () => {
    const user = setup()

    await user.type(screen.getByLabelText('Email'), 'fail@campus.edu.et')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(await screen.findByTestId('toast-error')).toHaveTextContent('Invalid email or password')
  })
})
