import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginForm from '../pages/LoginForm.jsx'

const setup = () => {
  const user = userEvent.setup()
  render(<LoginForm onSwitchToSignup={() => {}} />)
  return user
}

describe('LoginForm', () => {
  it('shows inline errors when submitting with empty fields', async () => {
    const user = setup()

    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
  })

  it('shows a loading state then a success toast for valid credentials', async () => {
    const user = setup()

    await user.type(screen.getByLabelText('Email'), 'student@campus.edu')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(screen.getByRole('button', { name: 'Log in' })).toBeDisabled()

    expect(await screen.findByTestId('toast-success')).toHaveTextContent('Logged in successfully')
  })

  it('shows a loading state then an error toast when the email contains "fail"', async () => {
    const user = setup()

    await user.type(screen.getByLabelText('Email'), 'fail@campus.edu')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Log in' }))

    expect(screen.getByRole('button', { name: 'Log in' })).toBeDisabled()

    expect(await screen.findByTestId('toast-error')).toHaveTextContent('Invalid email or password')
  })
})
