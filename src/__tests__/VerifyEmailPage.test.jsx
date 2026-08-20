import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VerifyEmailPage from '../pages/VerifyEmailPage.jsx'

describe('VerifyEmailPage', () => {
  beforeEach(() => {
    globalThis.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('/api/auth/verify-email')) {
        return Promise.resolve({
          ok: true,
          status: 200,
          headers: new Headers({ 'content-type': 'application/json' }),
          json: async () => ({ success: true, message: 'Email verified successfully.' }),
        })
      }
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({ success: true, message: 'Verification email resent.' }),
      })
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('renders the email address, Verify Email button, and countdown timer', () => {
    render(<VerifyEmailPage email="student@campus.edu.et" onBackToLogin={() => {}} />)

    expect(screen.getByRole('heading', { name: 'Check your inbox!' })).toBeInTheDocument()
    expect(screen.getByText(/student@campus\.edu/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Verify Email' })).toBeInTheDocument()
    expect(screen.getByText(/Resend verification link in/)).toBeInTheDocument()
  })

  it('enables resend button when countdown expires and sends resend request', async () => {
    const user = userEvent.setup()
    render(
      <VerifyEmailPage
        email="student@campus.edu.et"
        initialCountdown={0}
        onBackToLogin={() => {}}
      />
    )

    const resendBtn = screen.getByRole('button', { name: 'Resend Email' })
    expect(resendBtn).not.toBeDisabled()

    await user.click(resendBtn)
    expect(await screen.findByText(/New verification link sent/i)).toBeInTheDocument()
  })

  it('verifies the email when clicking Verify Email with token', async () => {
    const user = userEvent.setup()
    render(
      <VerifyEmailPage
        email="student@campus.edu.et"
        devToken="valid-sample-token"
        onBackToLogin={() => {}}
      />
    )

    await user.click(screen.getByRole('button', { name: 'Verify Email' }))

    expect(await screen.findByRole('heading', { name: 'Email Verified!' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue to Sign In' })).toBeInTheDocument()
  })

  it('navigates back to login when requested', async () => {
    const user = userEvent.setup()
    const onBackToLogin = vi.fn()
    render(<VerifyEmailPage email="student@campus.edu.et" onBackToLogin={onBackToLogin} />)

    await user.click(screen.getByRole('button', { name: 'Back to Login' }))

    expect(onBackToLogin).toHaveBeenCalledTimes(1)
  })
})
