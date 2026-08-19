import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LogoutWarningModal from '../components/LogoutWarningModal.jsx'

describe('LogoutWarningModal component', () => {
  const mockUser = {
    name: 'Sarah Connor',
    email: 'sarah@campus.edu.et',
    department: 'Computer Science',
    university: 'Addis Ababa University',
  }

  it('renders the warning dialog with title, copy, single initial avatar, and user info', () => {
    render(<LogoutWarningModal user={mockUser} onConfirm={vi.fn()} onCancel={vi.fn()} />)

    expect(screen.getByRole('alertdialog')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Log Out of CampusHustle?' })).toBeInTheDocument()
    expect(screen.getByText(/You are about to end your current active session/i)).toBeInTheDocument()
    expect(screen.getByText('Sarah Connor')).toBeInTheDocument()
    expect(screen.getByText('sarah@campus.edu.et')).toBeInTheDocument()
    expect(screen.getByText('Computer Science • Addis Ababa University')).toBeInTheDocument()
    expect(screen.getByText('S')).toBeInTheDocument()
    expect(screen.getByText(/Your published notes, active tutor bookings, and peer reviews will remain safe/i)).toBeInTheDocument()
  })

  it('calls onCancel when Stay Logged In button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onConfirm = vi.fn()

    render(<LogoutWarningModal user={mockUser} onConfirm={onConfirm} onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: 'Stay Logged In' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(onConfirm).not.toHaveBeenCalled()
  })

  it('calls onConfirm when Yes, Log Out button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    const onConfirm = vi.fn()

    render(<LogoutWarningModal user={mockUser} onConfirm={onConfirm} onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: /Yes, Log Out/i }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(onCancel).not.toHaveBeenCalled()
  })

  it('calls onCancel when the close (X) button is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    render(<LogoutWarningModal user={mockUser} onConfirm={vi.fn()} onCancel={onCancel} />)

    await user.click(screen.getByRole('button', { name: 'Close logout warning' }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })

  it('calls onCancel when Escape key is pressed', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()

    render(<LogoutWarningModal user={mockUser} onConfirm={vi.fn()} onCancel={onCancel} />)

    await user.keyboard('{Escape}')
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
