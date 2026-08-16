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

  it('does not render the chat sub-header bar or feedback icons', () => {
    setup()

    expect(screen.queryByText('Campus Study AI')).not.toBeInTheDocument()
    expect(screen.queryByText('GPT-4o')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /New Chat/i })).not.toBeInTheDocument()
    expect(screen.queryByTitle('Helpful')).not.toBeInTheDocument()
    expect(screen.queryByTitle('Not helpful')).not.toBeInTheDocument()
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

  it('renders starter prompt cards and sends a prompt when clicked', async () => {
    const { user } = setup()

    const summarizeCard = screen.getByRole('button', { name: /Summarize Lecture Notes/i })
    expect(summarizeCard).toBeInTheDocument()

    await user.click(summarizeCard)

    expect(
      screen.getAllByText(/Summarize the key takeaways and core concepts from my latest lecture in bullet points\./).length,
    ).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/Here's my answer for/)).toBeInTheDocument()
  })

  it('renders the footer at the bottom with brand elements', () => {
    setup()

    expect(screen.getByText(/CampusHustle Inc\./i)).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Start hustling/i })).toBeInTheDocument()
  })
})
