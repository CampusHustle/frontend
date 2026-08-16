/**
 * ChatPage.test.jsx
 *
 * Day 5 UI tests for the chat shell and socket connection status indicator.
 *
 * Strategy:
 *   - vi.mock the useSocket hook so tests are fully deterministic and never
 *     open a real WebSocket connection.
 *   - Each test controls the status value returned by the mock, then asserts
 *     the expected label and accessible role are visible in the UI.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import ChatPage from '../pages/ChatPage.jsx'

// ── Mock useSocket so no real socket is created during tests ─────────────────

vi.mock('../hooks/useSocket.js', () => ({
  useSocket: vi.fn(),
}))

import { useSocket } from '../hooks/useSocket.js'

// ── Helper ───────────────────────────────────────────────────────────────────

function renderChat(socketStatus = 'connecting') {
  useSocket.mockReturnValue({ getSocket: () => null, status: socketStatus })
  render(
    <MemoryRouter>
      <ChatPage user={null} onLogout={vi.fn()} onNavigate={vi.fn()} />
    </MemoryRouter>,
  )
}

// ── Tests ────────────────────────────────────────────────────────────────────

describe('ChatPage — shell structure', () => {
  it('renders the chat header', () => {
    renderChat()
    expect(screen.getByText('CampusHustle Chat')).toBeInTheDocument()
  })

  it('renders the message area placeholder', () => {
    renderChat()
    expect(screen.getByRole('log', { name: 'Chat messages' })).toBeInTheDocument()
    expect(screen.getByText('No messages yet')).toBeInTheDocument()
  })

  it('renders the message input', () => {
    renderChat()
    expect(screen.getByRole('textbox', { name: 'Message input' })).toBeInTheDocument()
  })

  it('renders the send button (disabled while live sending is not wired)', () => {
    renderChat()
    const sendBtn = screen.getByRole('button', { name: 'Send message' })
    expect(sendBtn).toBeInTheDocument()
    expect(sendBtn).toBeDisabled()
  })

  it('renders the attachment button', () => {
    renderChat()
    expect(screen.getByRole('button', { name: 'Add attachment' })).toBeInTheDocument()
  })
})

describe('ChatPage — connection status indicator', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('shows "Connecting…" when status is connecting', () => {
    renderChat('connecting')

    const badge = screen.getByRole('status', {
      name: /socket connection status: connecting/i,
    })
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Connecting…')
    expect(badge).toHaveAttribute('data-connection-status', 'connecting')
  })

  it('shows "Connected" when the socket connects successfully', () => {
    renderChat('connected')

    const badge = screen.getByRole('status', {
      name: /socket connection status: connected/i,
    })
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Connected')
    expect(badge).toHaveAttribute('data-connection-status', 'connected')
  })

  it('shows "Disconnected" when the socket loses connection', () => {
    renderChat('disconnected')

    const badge = screen.getByRole('status', {
      name: /socket connection status: disconnected/i,
    })
    expect(badge).toBeInTheDocument()
    expect(badge).toHaveTextContent('Disconnected')
    expect(badge).toHaveAttribute('data-connection-status', 'disconnected')
  })

  it('all three statuses render distinct data-connection-status values', () => {
    const seen = new Set()
    for (const status of ['connecting', 'connected', 'disconnected']) {
      const { unmount } = (() => {
        useSocket.mockReturnValue({ socket: null, status })
        return render(
          <MemoryRouter>
            <ChatPage user={null} onLogout={vi.fn()} onNavigate={vi.fn()} />
          </MemoryRouter>,
        )
      })()
      seen.add(
        screen.getByRole('status').getAttribute('data-connection-status'),
      )
      unmount()
    }
    expect(seen.size).toBe(3)
  })
})
