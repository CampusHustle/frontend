import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PostListingPage from '../pages/PostListingPage.jsx'

const setup = (onNavigate = vi.fn()) => {
  const user = userEvent.setup()
  const onLogout = vi.fn()
  render(<PostListingPage user={null} onLogout={onLogout} onNavigate={onNavigate} />)
  return { user, onNavigate, onLogout }
}

describe('PostListingPage', () => {
  it('renders the create tutorial header and sections', () => {
    setup()

    expect(screen.getByRole('heading', { name: 'Create Tutorial' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Tutorial Essentials' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Media & Assets' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Pricing & Visibility' })).toBeInTheDocument()
  })

  it('renders the preview sidebar with draft status and action buttons', () => {
    setup()

    expect(screen.getByText('Untitled Tutorial')).toBeInTheDocument()
    expect(screen.getByText('No Subject Selected')).toBeInTheDocument()
    expect(screen.getByText('Draft')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Publish Tutorial' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save as Draft' })).toBeInTheDocument()
  })

  it('updates the preview as the title and subject are filled in', async () => {
    const { user } = setup()

    await user.type(
      screen.getByLabelText('Tutorial Title'),
      'Advanced Microeconomics',
    )
    await user.selectOptions(screen.getByLabelText('Subject Area'), 'Economics')

    expect(screen.getByText('Advanced Microeconomics')).toBeInTheDocument()
    expect(screen.getAllByText('Economics').length).toBeGreaterThanOrEqual(1)
    expect(screen.queryByText('Untitled Tutorial')).not.toBeInTheDocument()
  })

  it('toggles between Free and Premium pricing', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Premium' }))

    expect(screen.getByRole('button', { name: 'Premium' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Free' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('switches visibility to University Only', async () => {
    const { user } = setup()

    await user.click(screen.getByLabelText('University Only'))

    expect(screen.getByLabelText('University Only')).toBeChecked()
    expect(screen.getByLabelText('Public')).not.toBeChecked()
  })

  it('shows the selected file name after choosing a file', async () => {
    const { user } = setup()

    const fileInput = screen.getByLabelText('Upload video or slides')
    await user.upload(fileInput, new File(['video'], 'lecture.mp4', { type: 'video/mp4' }))

    expect(screen.getByText(/Selected: lecture\.mp4/)).toBeInTheDocument()
  })

  it('disables publishing until a title and subject are provided', async () => {
    const { user } = setup()

    expect(screen.getByRole('button', { name: 'Publish Tutorial' })).toBeDisabled()

    await user.type(screen.getByLabelText('Tutorial Title'), 'Linear Algebra Crash')
    expect(screen.getByRole('button', { name: 'Publish Tutorial' })).toBeDisabled()

    await user.selectOptions(screen.getByLabelText('Subject Area'), 'Mathematics')
    expect(screen.getByRole('button', { name: 'Publish Tutorial' })).toBeEnabled()
  })

  it('shows a confirmation when publishing a tutorial', async () => {
    const { user } = setup()

    await user.type(screen.getByLabelText('Tutorial Title'), 'Physics Lab Guide')
    await user.selectOptions(screen.getByLabelText('Subject Area'), 'Physics')
    await user.click(screen.getByRole('button', { name: 'Publish Tutorial' }))

    expect(screen.getByText('Tutorial published!')).toBeInTheDocument()
  })

  it('shows a confirmation when saving a draft', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Save as Draft' }))

    expect(screen.getByText('Saved as draft.')).toBeInTheDocument()
  })

  it('renders the post listing button in the navbar and navigates on click', async () => {
    const onNavigate = vi.fn()
    const { user } = setup(onNavigate)

    await user.click(screen.getByRole('button', { name: 'Post Listing' }))

    expect(onNavigate).toHaveBeenCalledWith('post-listing')
  })
})
