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

const goToStep2 = async (user, overrides = {}) => {
  if (overrides.department !== undefined && overrides.department !== null) {
    await user.selectOptions(screen.getByTestId('department'), overrides.department)
  }
  if (overrides.year !== undefined && overrides.year !== null) {
    await user.selectOptions(screen.getByTestId('year'), overrides.year)
  }
  if (overrides.bio !== undefined && overrides.bio !== null) {
    await user.type(screen.getByTestId('bio'), overrides.bio)
  }
  await user.click(screen.getByRole('button', { name: 'Continue' }))
}

describe('CompleteProfilePage', () => {
  it('renders step 1 and steps to skills with valid step-1 data', async () => {
    const { user } = setup()

    expect(screen.getByRole('heading', { name: 'Set Up Your Profile' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'About You' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Continue' })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Finish Setup' })).not.toBeInTheDocument()

    await goToStep2(user, { department: 'Computer Science', year: 'Junior', bio: 'CS student.' })

    expect(screen.getByRole('heading', { name: 'Skills & Tutoring' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Finish Setup' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument()
  })

  it('blocks step 2 until required fields are filled', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Continue' }))

    expect(screen.getByText('Select your department')).toBeInTheDocument()
    expect(screen.getByText('Select your academic year')).toBeInTheDocument()
    expect(screen.getByText('Tell peers a bit about yourself')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Finish Setup' })).not.toBeInTheDocument()
  })

  it('adds and removes skill tags on enter and close', async () => {
    const { user } = setup()
    await goToStep2(user, { department: 'Engineering', year: 'Senior', bio: 'Mech Eng student.' })

    const skillInput = screen.getByTestId('tag-skills-i-can-offer-input')
    await user.type(skillInput, 'Python{Enter}')
    expect(screen.getByText('Python')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Remove Python' }))
    expect(screen.queryByText('Python')).not.toBeInTheDocument()
  })

  it('submits the filled-in profile data', async () => {
    const { user, onFinish } = setup()
    await goToStep2(user, { department: 'Computer Science', year: 'Senior', bio: 'CS senior.' })

    await user.type(screen.getByTestId('tag-skills-i-can-offer-input'), 'Python{Enter}')
    await user.type(screen.getByTestId('tag-subjects-i-want-to-learn-input'), 'Calculus{Enter}')
    await user.type(screen.getByTestId('rate'), '20')

    await user.click(screen.getByRole('button', { name: 'Finish Setup' }))

    expect(onFinish).toHaveBeenCalledTimes(1)
    expect(onFinish).toHaveBeenCalledWith(
      expect.objectContaining({
        department: 'Computer Science',
        year: 'Senior',
        bio: 'CS senior.',
        skills: ['Python'],
        subjects: ['Calculus'],
        hourlyRate: '20',
      }),
    )
  })

  it('blocks finishing until at least one skill and subject are added', async () => {
    const { user, onFinish } = setup()
    await goToStep2(user, { department: 'Engineering', year: 'Freshman', bio: 'New here.' })

    await user.click(screen.getByRole('button', { name: 'Finish Setup' }))

    expect(screen.getByText('Add at least one skill')).toBeInTheDocument()
    expect(screen.getByText('Add at least one subject')).toBeInTheDocument()
    expect(onFinish).not.toHaveBeenCalled()
  })
})
