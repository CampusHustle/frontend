import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProfilePage from '../pages/ProfilePage.jsx'

describe('ProfilePage and Edit Profile feature', () => {
  const initialUser = {
    id: 'u-1',
    name: 'Daniel Gidey',
    email: 'daniel.gidey@aau.edu.et',
    university: 'Addis Ababa University',
    department: 'Software Engineering',
    year: 'junior',
    bio: 'Passionate coding tutor and student.',
    hourlyRate: 30,
    skillsTeaching: ['React', 'Node.js'],
    skillsLearning: ['Python'],
    rating: { knowledge: 4.8, communication: 4.9, punctuality: 5.0, count: 12 },
    verified: true,
  }

  it('renders the user profile with details and Edit Profile button', () => {
    render(<ProfilePage user={initialUser} />)

    expect(screen.getByRole('heading', { name: 'My Profile' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Daniel Gidey' })).toBeInTheDocument()
    expect(screen.getByText(/Software Engineering • Addis Ababa University • junior/)).toBeInTheDocument()
    expect(screen.getByText('Passionate coding tutor and student.')).toBeInTheDocument()
    expect(screen.getByText(/ETB 30/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Edit Profile' })).toBeInTheDocument()
  })

  it('opens edit profile modal when Edit Profile button is clicked', async () => {
    const user = userEvent.setup()
    render(<ProfilePage user={initialUser} />)

    expect(screen.queryByRole('dialog', { name: /Edit Profile/i })).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Edit Profile' }))

    expect(screen.getByRole('dialog', { name: /Edit Profile/i })).toBeInTheDocument()
    expect(screen.getByLabelText('First Name')).toHaveValue('Daniel')
    expect(screen.getByLabelText('Last Name')).toHaveValue('Gidey')
    expect(screen.getByLabelText('University')).toHaveValue('Addis Ababa University')
    expect(screen.getByLabelText('Bio')).toHaveValue('Passionate coding tutor and student.')
  })

  it('saves updated profile changes and updates the profile display', async () => {
    const user = userEvent.setup()
    const onUpdateProfile = vi.fn()
    render(<ProfilePage user={initialUser} onUpdateProfile={onUpdateProfile} />)

    await user.click(screen.getByRole('button', { name: 'Edit Profile' }))

    // Edit fields
    const bioInput = screen.getByLabelText('Bio')
    await user.clear(bioInput)
    await user.type(bioInput, 'Updated bio for semester 2026.')

    const rateInput = screen.getByLabelText(/Hourly Tutoring Rate/i)
    await user.clear(rateInput)
    await user.type(rateInput, '45')

    // Submit
    await user.click(screen.getByRole('button', { name: 'Save Changes' }))

    // Modal closes
    expect(screen.queryByRole('dialog', { name: /Edit Profile/i })).not.toBeInTheDocument()

    // Profile card updates
    expect(screen.getByText('Updated bio for semester 2026.')).toBeInTheDocument()
    expect(screen.getByText(/ETB 45/)).toBeInTheDocument()
    expect(screen.getByText('Profile updated successfully!')).toBeInTheDocument()

    expect(onUpdateProfile).toHaveBeenCalledWith(
      expect.objectContaining({
        bio: 'Updated bio for semester 2026.',
        hourlyRate: 45,
      }),
    )
  })

  it('cancels editing without applying changes', async () => {
    const user = userEvent.setup()
    render(<ProfilePage user={initialUser} />)

    await user.click(screen.getByRole('button', { name: 'Edit Profile' }))

    const bioInput = screen.getByLabelText('Bio')
    await user.clear(bioInput)
    await user.type(bioInput, 'This should not be saved.')

    await user.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(screen.queryByRole('dialog', { name: /Edit Profile/i })).not.toBeInTheDocument()
    expect(screen.getByText('Passionate coding tutor and student.')).toBeInTheDocument()
    expect(screen.queryByText('This should not be saved.')).not.toBeInTheDocument()
  })
})
