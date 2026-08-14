import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CompleteProfilePage from '../pages/CompleteProfilePage.jsx'

const setup = () => {
  const user = userEvent.setup()
  const onFinish = vi.fn()
  render(<CompleteProfilePage user={{ name: 'Jane Doe' }} onFinish={onFinish} />)
  return { user, onFinish }
}

describe('CompleteProfilePage', () => {
  it('renders all onboarding sections', () => {
    setup()

    expect(screen.getByRole('heading', { name: 'Complete Your Profile' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Personal Information' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Academic Background' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Expertise' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tutoring Rate' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Finish Setup' })).toBeInTheDocument()
  })

  it('adds and removes skill tags on enter and close', async () => {
    const { user } = setup()

    const skillInput = screen.getByLabelText('Academic Skills')
    await user.type(skillInput, 'Python{Enter}')
    expect(screen.getByText('Python')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remove Python' }))
    expect(screen.queryByText('Python')).not.toBeInTheDocument()
  })

  it('submits the filled-in profile data', async () => {
    const { user, onFinish } = setup()

    await user.type(screen.getByLabelText('First Name'), 'Jane')
    await user.type(screen.getByLabelText('Last Name'), 'Doe')
    await user.selectOptions(screen.getByLabelText('Year of Study'), 'senior')
    const skillInput = screen.getByLabelText('Academic Skills')
    await user.type(skillInput, 'Python{Enter}')

    await user.click(screen.getByRole('button', { name: 'Finish Setup' }))

    expect(onFinish).toHaveBeenCalledTimes(1)
    expect(onFinish).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: 'Jane',
        lastName: 'Doe',
        year: 'senior',
        skills: ['Python'],
      }),
    )
  })
})
