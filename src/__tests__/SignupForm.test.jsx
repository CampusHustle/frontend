import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SignUpForm from '../pages/SignUpForm.jsx'

const setup = () => {
  const user = userEvent.setup()
  render(<SignUpForm onSwitchToSignIn={() => {}} />)
  return user
}

const fillValidFields = async (user) => {
  await user.type(screen.getByLabelText('Username'), 'janedoe')
  await user.type(screen.getByLabelText('Student Email (.edu)'), 'student@university.edu')
  await user.type(screen.getByLabelText('Password'), 'password123')
  await user.type(screen.getByLabelText('Confirm Password'), 'password123')
}

describe('SignUpForm', () => {
  it('shows all inline errors when submitting with empty fields', async () => {
    const user = setup()

    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(screen.getByText('Username is required')).toBeInTheDocument()
    expect(screen.getByText('Email is required')).toBeInTheDocument()
    expect(screen.getByText('Password is required')).toBeInTheDocument()
    expect(screen.getByText('Please confirm your password')).toBeInTheDocument()
    expect(screen.getByText('You must agree to the terms to continue')).toBeInTheDocument()
  })

  it('shows the specific .edu error for a non-edu email', async () => {
    const user = setup()

    await user.type(screen.getByLabelText('Username'), 'janedoe')
    await user.type(screen.getByLabelText('Student Email (.edu)'), 'student@university.com')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'password123')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(screen.getByText('Email must end in .edu')).toBeInTheDocument()
  })

  it('shows a loading state then a success toast for valid input', async () => {
    const user = setup()

    await fillValidFields(user)
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(screen.getByRole('button', { name: 'Create Account' })).toBeDisabled()

    expect(await screen.findByTestId('toast-success')).toHaveTextContent(
      'Account created successfully',
    )
  })

  it('shows a loading state then an error toast when the email contains "fail"', async () => {
    const user = setup()

    await user.type(screen.getByLabelText('Username'), 'janedoe')
    await user.type(screen.getByLabelText('Student Email (.edu)'), 'fail@university.edu')
    await user.type(screen.getByLabelText('Password'), 'password123')
    await user.type(screen.getByLabelText('Confirm Password'), 'password123')
    await user.click(screen.getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: 'Create Account' }))

    expect(screen.getByRole('button', { name: 'Create Account' })).toBeDisabled()

    expect(await screen.findByTestId('toast-error')).toHaveTextContent(
      'That email is already registered',
    )
  })
})
