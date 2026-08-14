import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import VerifyEmailPage from '../pages/VerifyEmailPage.jsx'

describe('VerifyEmailPage', () => {
  it('renders the email address and the inbox message', () => {
    render(<VerifyEmailPage email="student@campus.edu.et" onBackToLogin={() => {}} />)

    expect(screen.getByRole('heading', { name: 'Check your inbox!' })).toBeInTheDocument()
    expect(screen.getByText(/student@campus\.edu/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Resend Email' })).toBeInTheDocument()
  })

  it('updates the resend button after resending', async () => {
    const user = userEvent.setup()
    render(<VerifyEmailPage email="student@campus.edu.et" onBackToLogin={() => {}} />)

    await user.click(screen.getByRole('button', { name: 'Resend Email' }))

    expect(screen.getByRole('button', { name: /Email sent/ })).toBeInTheDocument()
  })

  it('navigates back to login when requested', async () => {
    const user = userEvent.setup()
    const onBackToLogin = vi.fn()
    render(<VerifyEmailPage email="student@campus.edu.et" onBackToLogin={onBackToLogin} />)

    await user.click(screen.getByRole('button', { name: 'Back to Login' }))

    expect(onBackToLogin).toHaveBeenCalledTimes(1)
  })
})
