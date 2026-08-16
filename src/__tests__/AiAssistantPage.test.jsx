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
  it('renders the assistant header and context selector', () => {
    setup()

    expect(screen.getByRole('heading', { name: 'AI Study Assistant' })).toBeInTheDocument()
    expect(screen.getByText('Context:')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'General Assistant' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Sarah J. (Tutor)' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ECON101 Notes' })).toBeInTheDocument()
  })

  it('renders the welcome message with General context active by default', () => {
    setup()

    expect(
      screen.getByText(/Hello! I'm your CampusHustle AI Study Assistant/),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'General Assistant' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'Sarah J. (Tutor)' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
  })

  it('switches context and acknowledges the new scope', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Sarah J. (Tutor)' }))

    expect(screen.getByRole('button', { name: 'Sarah J. (Tutor)' })).toHaveAttribute(
      'aria-pressed',
      'true',
    )
    expect(screen.getByRole('button', { name: 'General Assistant' })).toHaveAttribute(
      'aria-pressed',
      'false',
    )
    expect(screen.getByText(/Switched to the Sarah J\. \(Tutor\) context/)).toBeInTheDocument()
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
      screen.getByText(/Here's a response to "What is opportunity cost\?" from the General Assistant context/),
    ).toBeInTheDocument()
  })

  it('ignores an empty submission', async () => {
    const { user } = setup()

    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(screen.queryByRole('button', { name: 'Send message' })).toBeInTheDocument()
    expect(screen.getByText(/Hello! I'm your CampusHustle AI Study Assistant/)).toBeInTheDocument()
  })

  it('renders the AI Assistant navbar link and navigates on click', async () => {
    const onNavigate = vi.fn()
    const { user } = setup(onNavigate)

    await user.click(screen.getByRole('link', { name: 'AI Assistant' }))

    expect(onNavigate).toHaveBeenCalledWith('assistant')
  })
})
