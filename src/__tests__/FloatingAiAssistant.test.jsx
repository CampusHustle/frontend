import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FloatingAiAssistant from '../components/FloatingAiAssistant.jsx'

describe('FloatingAiAssistant Component', () => {
  it('renders the floating action button at the bottom right', () => {
    render(<FloatingAiAssistant user={null} />)
    const fabButton = screen.getByRole('button', { name: /Open AI Assistant/i })
    expect(fabButton).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: /AI Assistant chat/i })).not.toBeInTheDocument()
  })

  it('opens and closes the overlay little chat screen when floating button is clicked', async () => {
    const user = userEvent.setup()
    render(<FloatingAiAssistant user={null} />)

    const fabButton = screen.getByRole('button', { name: /Open AI Assistant/i })
    await user.click(fabButton)

    expect(screen.getByRole('dialog', { name: /AI Assistant chat/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'AI Assistant' })).toBeInTheDocument()
    expect(screen.getByText(/Hello! I'm your CampusHustle AI Assistant/)).toBeInTheDocument()
    expect(screen.queryByText(/Quick Prompts/i)).not.toBeInTheDocument()

    // Click close button in header
    await user.click(screen.getByRole('button', { name: 'Close assistant' }))
    expect(screen.queryByRole('dialog', { name: /AI Assistant chat/i })).not.toBeInTheDocument()
  })

  it('sends a user message and streams writing animation to reveal AI response', async () => {
    const user = userEvent.setup()
    render(<FloatingAiAssistant user={null} />)

    await user.click(screen.getByRole('button', { name: /Open AI Assistant/i }))

    const input = screen.getByPlaceholderText('Ask AI assistant... (Enter to send)')
    await user.type(input, 'What is opportunity cost?')
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(screen.getByText('What is opportunity cost?')).toBeInTheDocument()

    // Fast-forward for simulated AI writing animation to complete
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1200))
    })

    expect(screen.getByText(/Here's my answer for "What is opportunity cost\?"/)).toBeInTheDocument()
  })

  it('closes on Escape key press', async () => {
    const user = userEvent.setup()
    render(<FloatingAiAssistant user={null} />)

    await user.click(screen.getByRole('button', { name: /Open AI Assistant/i }))
    expect(screen.getByRole('dialog', { name: /AI Assistant chat/i })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: /AI Assistant chat/i })).not.toBeInTheDocument()
  })

  it('opens when open-ai-assistant custom event is dispatched', () => {
    render(<FloatingAiAssistant user={null} />)

    expect(screen.queryByRole('dialog', { name: /AI Assistant chat/i })).not.toBeInTheDocument()

    act(() => {
      window.dispatchEvent(new CustomEvent('open-ai-assistant'))
    })

    expect(screen.getByRole('dialog', { name: /AI Assistant chat/i })).toBeInTheDocument()
  })
})
