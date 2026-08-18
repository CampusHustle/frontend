import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignupForm from '../pages/SignupForm.jsx'

const setup = () => {
  const user = userEvent.setup()
  render(<SignupForm onSwitchToLogin={() => {}} />)
  return user
}

describe('SignupForm', () => {
  it('shows inline errors when submitting with empty fields', async () => {
    const user = setup()

    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(screen.getByText('Name is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
    expect(screen.getByText('Please confirm your password')).toBeInTheDocument()
  })

  it('shows a loading state then a success toast for valid credentials', async () => {
    const user = setup()

    await user.type(screen.getByLabelText('Full Name'), 'Test User')
    await user.type(screen.getByLabelText('University Email'), 'new.student@campus.edu.et')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(screen.getByRole('button', { name: 'Create Account' })).toBeDisabled()

    expect(await screen.findByTestId('toast-success')).toHaveTextContent(
      'Account created successfully',
    )
  })

  it('shows a loading state then an error toast for an already-registered email', async () => {
    const user = setup()

    await user.type(screen.getByLabelText('Full Name'), 'Test User')
    await user.type(screen.getByLabelText('University Email'), 'student@campus.edu.et')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(screen.getByRole('button', { name: 'Create Account' })).toBeDisabled()

    expect(await screen.findByTestId('toast-error')).toHaveTextContent(
      'That email is already registered',
    )
  })

  it('rejects emails that do not end in .edu.et', async () => {
    const user = setup()

    await user.type(screen.getByLabelText('Full Name'), 'Test User')
    await user.type(screen.getByLabelText('University Email'), 'student@gmail.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'password123')
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(screen.getByText('Enter valid student email')).toBeInTheDocument()
  })

  it('shows an error when the passwords do not match', async () => {
    const user = setup()

    await user.type(screen.getByLabelText('Full Name'), 'Test User')
    await user.type(screen.getByLabelText('University Email'), 'new.student@campus.edu.et')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'password124')
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument()
  })
})
