import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AiAssistantPage from '../pages/AiAssistantPage.jsx'

const setup = (onNavigate = vi.fn()) => {
  const user = userEvent.setup()
  const onLogout = vi.fn()
  render(<AiAssistantPage user={null} onLogout={onLogout} onNavigate={onNavigate} />)
  return { user, onNavigate, onLogout }
}

describe('AiAssistantPage', () => {
  it('renders the assistant heading and chat input', () => {
    setup()

    expect(screen.getByRole('heading', { name: 'AI Study Assistant' })).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Message AI Assistant... (Press Enter to send)'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Add attachment' })).toBeInTheDocument()
  })

  it('renders the welcome message by default', () => {
    setup()

    expect(
      screen.getByText(/Hello! I'm your CampusHustle AI Study Assistant/),
    ).toBeInTheDocument()
  })

  it('does not render the context selector bar', () => {
    setup()

    expect(screen.queryByText('Context:')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Sarah J. (Tutor)' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'ECON101 Notes' })).not.toBeInTheDocument()
  })

  it('sends a message and appends the user and AI replies', async () => {
    const { user } = setup()

    await user.type(
      screen.getByPlaceholderText('Message AI Assistant... (Press Enter to send)'),
      'What is opportunity cost?',
    )
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(screen.getByText('What is opportunity cost?')).toBeInTheDocument()
    expect(
      screen.getByText(/Here's my answer for "What is opportunity cost\?"/),
    ).toBeInTheDocument()
  })

  it('ignores an empty submission', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(screen.getByText(/Hello! I'm your CampusHustle AI Study Assistant/)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText('Message AI Assistant... (Press Enter to send)'),
    ).toHaveValue('')
  })

  it('renders the AI Assistant navbar link and navigates on click', async () => {
    const onNavigate = vi.fn()
    const { user } = setup(onNavigate)

    await user.click(screen.getByRole('link', { name: 'AI Assistant' }))

    expect(onNavigate).toHaveBeenCalledWith('assistant')
  })
})
