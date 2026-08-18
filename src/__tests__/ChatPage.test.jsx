import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ChatPage from '../pages/ChatPage.jsx'

describe('ChatPage (Messenger-Style Tutor & Student 1:1 Live Chat)', () => {
  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
  })

  it('renders the Messenger inbox sidebar, active conversation header, and message bubbles', () => {
    render(<ChatPage user={{ name: 'Daniel Gidey' }} onNavigate={vi.fn()} onLogout={vi.fn()} />)

    expect(screen.getByRole('heading', { name: 'Chats' })).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Search Messenger\.\.\./i)).toBeInTheDocument()

    // Conversions in sidebar / header
    expect(screen.getAllByText('Sarah Jenkins').length).toBeGreaterThan(0)
    expect(screen.getByText('Alex Johnson')).toBeInTheDocument()
    expect(screen.getByText('Abel Tesfaye')).toBeInTheDocument()

    // Active conversation header & booking status
    expect(screen.getByText(/Active now/i)).toBeInTheDocument()
    expect(screen.getByText(/Confirmed/i)).toBeInTheDocument()
    expect(screen.getByText(/Today, 3:00 PM - 4:00 PM/i)).toBeInTheDocument()

    // Message stream bubbles
    expect(screen.getByText(/checked out the Orgo Reaction Mechanisms masterclass/i)).toBeInTheDocument()
  })

  it('allows student to type and send messages in real-time', async () => {
    const user = userEvent.setup()
    render(<ChatPage user={{ name: 'Daniel Gidey' }} onNavigate={vi.fn()} onLogout={vi.fn()} />)

    const input = screen.getByPlaceholderText(/Message Sarah\.\.\./i)
    await user.type(input, 'I uploaded my problem sheet, can you see it?')

    const sendBtn = screen.getByRole('button', { name: /Send message/i })
    expect(sendBtn).toBeInTheDocument()
    await user.click(sendBtn)

    expect(screen.getAllByText('I uploaded my problem sheet, can you see it?').length).toBeGreaterThan(0)

    // Simulated tutor response
    await waitFor(
      () => {
        expect(screen.getAllByText(/Got it! I am reviewing your question/i).length).toBeGreaterThan(0)
      },
      { timeout: 2500 }
    )
  })

  it('sends Messenger quick thumbs up emoji when input is empty', async () => {
    const user = userEvent.setup()
    render(<ChatPage user={{ name: 'Daniel Gidey' }} onNavigate={vi.fn()} onLogout={vi.fn()} />)

    const thumbBtn = screen.getByRole('button', { name: /Send thumbs up/i })
    expect(thumbBtn).toBeInTheDocument()
    await user.click(thumbBtn)

    expect(screen.getAllByText('👍').length).toBeGreaterThan(0)
  })

  it('handles "Share Contact Info" consent and audits off-platform numbers', async () => {
    const user = userEvent.setup()
    render(<ChatPage user={{ name: 'Daniel Gidey' }} onNavigate={vi.fn()} onLogout={vi.fn()} />)

    const shareBtn = screen.getByRole('button', { name: /Share Contact Info/i })
    expect(shareBtn).toBeInTheDocument()
    await user.click(shareBtn)

    expect(screen.getByText(/✓ Contact Info Shared/i)).toBeInTheDocument()
  })

  it('toggles the Conversation Details side drawer', async () => {
    const user = userEvent.setup()
    render(<ChatPage user={{ name: 'Daniel Gidey' }} onNavigate={vi.fn()} onLogout={vi.fn()} />)

    const infoBtn = screen.getByTitle('Conversation Details')
    await user.click(infoBtn)

    expect(screen.getByRole('heading', { name: 'Conversation Info' })).toBeInTheDocument()
    expect(screen.getByText(/Shared Files/i)).toBeInTheDocument()
    expect(screen.getByText(/CampusHustle Escrow Protection/i)).toBeInTheDocument()
  })
})
