import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FloatingAiAssistant from '../components/FloatingAiAssistant.jsx'

describe('FloatingAiAssistant Component', () => {
  it('renders the floating action button at the bottom right', () => {
    render(<FloatingAiAssistant user={null} />)
    const fabButton = screen.getByRole('button', { name: /Open Felat/i })
    expect(fabButton).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: /Felat/i })).not.toBeInTheDocument()
  })

  it('opens and closes the overlay little chat screen when floating button is clicked', async () => {
    const user = userEvent.setup()
    render(<FloatingAiAssistant user={null} />)

    const fabButton = screen.getByRole('button', { name: /Open Felat/i })
    await user.click(fabButton)

    expect(screen.getByRole('dialog', { name: /Felat/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Felat/i })).toBeInTheDocument()
    expect(screen.getByText(/I'm Felat \(ፈላጥ\)/)).toBeInTheDocument()
    expect(screen.queryByText(/Quick Prompts/i)).not.toBeInTheDocument()

    // Click close button in header
    await user.click(screen.getByRole('button', { name: /Close chat panel/i }))
    expect(screen.queryByRole('dialog', { name: /Felat/i })).not.toBeInTheDocument()
  })

  it('sends a user message and streams writing animation to reveal AI response', async () => {
    const user = userEvent.setup()
    render(<FloatingAiAssistant user={null} />)

    await user.click(screen.getByRole('button', { name: /Open Felat/i }))

    const input = screen.getByPlaceholderText(/Ask Felat/i)
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

    await user.click(screen.getByRole('button', { name: /Open Felat/i }))
    expect(screen.getByRole('dialog', { name: /Felat/i })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: /Felat/i })).not.toBeInTheDocument()
  })

  it('handles custom event open-ai-assistant', () => {
    render(<FloatingAiAssistant user={null} />)

    expect(screen.queryByRole('dialog', { name: /Felat/i })).not.toBeInTheDocument()

    act(() => {
      window.dispatchEvent(new CustomEvent('open-ai-assistant'))
    })

    expect(screen.getByRole('dialog', { name: /Felat/i })).toBeInTheDocument()
  })
})
