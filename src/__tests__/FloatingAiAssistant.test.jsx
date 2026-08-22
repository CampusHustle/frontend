import { describe, it, expect, vi } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FloatingAiAssistant from '../components/FloatingAiAssistant.jsx'

const mockUser = { _id: 'u-1', name: 'Abebe Bikila', email: 'abebe@aau.edu.et' }

describe('FloatingAiAssistant Component', () => {
  it('does not render when user is not logged in (user is null)', () => {
    const { container } = render(<FloatingAiAssistant user={null} />)
    expect(container.firstChild).toBeNull()
    expect(screen.queryByRole('button', { name: /Open Felat/i })).not.toBeInTheDocument()
  })

  it('renders the floating action button at the bottom right for authenticated users', () => {
    render(<FloatingAiAssistant user={mockUser} />)
    const fabButton = screen.getByRole('button', { name: /Open Felat/i })
    expect(fabButton).toBeInTheDocument()
    expect(screen.queryByRole('dialog', { name: /Felat/i })).not.toBeInTheDocument()
  })

  it('opens and closes the overlay little chat screen when floating button is clicked', async () => {
    const user = userEvent.setup()
    render(<FloatingAiAssistant user={mockUser} />)

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
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        answer: 'Opportunity cost represents the potential benefits foregone.',
      }),
    })

    const user = userEvent.setup()
    render(<FloatingAiAssistant user={mockUser} />)

    await user.click(screen.getByRole('button', { name: /Open Felat/i }))

    const input = screen.getByPlaceholderText(/Ask Felat/i)
    await user.type(input, 'What is opportunity cost?')
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    expect(screen.getByText('What is opportunity cost?')).toBeInTheDocument()

    // Fast-forward for AI writing animation to complete
    await act(async () => {
      await new Promise((r) => setTimeout(r, 1200))
    })

    expect(screen.getByText(/Opportunity cost represents the potential benefits foregone/)).toBeInTheDocument()
  })

  it('closes on Escape key press', async () => {
    const user = userEvent.setup()
    render(<FloatingAiAssistant user={mockUser} />)

    await user.click(screen.getByRole('button', { name: /Open Felat/i }))
    expect(screen.getByRole('dialog', { name: /Felat/i })).toBeInTheDocument()

    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog', { name: /Felat/i })).not.toBeInTheDocument()
  })

  it('handles custom event open-ai-assistant when authenticated', () => {
    render(<FloatingAiAssistant user={mockUser} />)

    expect(screen.queryByRole('dialog', { name: /Felat/i })).not.toBeInTheDocument()

    act(() => {
      window.dispatchEvent(new CustomEvent('open-ai-assistant'))
    })

    expect(screen.getByRole('dialog', { name: /Felat/i })).toBeInTheDocument()
  })

  it('accepts tutorId from custom event detail and scopes questions', async () => {
    let capturedBody
    globalThis.fetch = vi.fn().mockImplementation((_url, options) => {
      capturedBody = JSON.parse(options.body)
      return Promise.resolve({
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          success: true,
          answer: 'From the notes: Organic chemistry studies carbon compounds.',
          grounded: true,
          sources: [{ noteId: 'note-abc', pageNumber: 2, similarityScore: 0.87 }],
        }),
      })
    })

    const user = userEvent.setup()
    render(<FloatingAiAssistant user={null} />)

    act(() => {
      window.dispatchEvent(new CustomEvent('open-ai-assistant', { detail: { tutorId: 'tutor-42' } }))
    })

    expect(screen.getByText(/scoped to this tutor/i)).toBeInTheDocument()

    const input = screen.getByPlaceholderText(/Ask Felat/i)
    await user.type(input, 'What is organic chemistry?')
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    await act(async () => {
      await new Promise((r) => setTimeout(r, 1200))
    })

    expect(capturedBody.tutorId).toBe('tutor-42')
    expect(capturedBody.question).toBe('What is organic chemistry?')
    expect(screen.getByText(/Organic chemistry studies carbon compounds/)).toBeInTheDocument()
  })

  it('displays grounded indicator and source references for RAG answers', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        answer: 'Photosynthesis converts light energy into chemical energy.',
        grounded: true,
        sources: [
          { noteId: 'note-1', pageNumber: 5, similarityScore: 0.92 },
          { noteId: 'note-1', pageNumber: 8, similarityScore: 0.78 },
        ],
      }),
    })

    const user = userEvent.setup()
    render(<FloatingAiAssistant user={mockUser} />)

    await user.click(screen.getByRole('button', { name: /Open Felat/i }))

    const input = screen.getByPlaceholderText(/Ask Felat/i)
    await user.type(input, 'Explain photosynthesis')
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    await act(async () => {
      await new Promise((r) => setTimeout(r, 1200))
    })

    expect(screen.getByText(/From notes/i)).toBeInTheDocument()
    expect(screen.getByText(/Page 5/)).toBeInTheDocument()
    expect(screen.getByText(/92% match/)).toBeInTheDocument()
    expect(screen.getByText(/Page 8/)).toBeInTheDocument()
    expect(screen.getByText(/78% match/)).toBeInTheDocument()
  })

  it('displays general indicator for non-grounded answers', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        success: true,
        answer: 'Here is a general explanation of calculus.',
        grounded: false,
        sources: [],
      }),
    })

    const user = userEvent.setup()
    render(<FloatingAiAssistant user={mockUser} />)

    await user.click(screen.getByRole('button', { name: /Open Felat/i }))

    const input = screen.getByPlaceholderText(/Ask Felat/i)
    await user.type(input, 'What is calculus?')
    await user.click(screen.getByRole('button', { name: 'Send message' }))

    await act(async () => {
      await new Promise((r) => setTimeout(r, 1200))
    })

    expect(screen.getByText(/💬 General/)).toBeInTheDocument()
    expect(screen.queryByText(/From notes/)).not.toBeInTheDocument()
  })
})
