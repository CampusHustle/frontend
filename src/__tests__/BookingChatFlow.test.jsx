import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import BookingScreen from '../screens/BookingScreen.jsx'
import ChatPage from '../pages/ChatPage.jsx'
import * as bookingApi from '../api/mockBookingApi.js'

vi.mock('../api/mockBookingApi.js', () => ({
  fetchBookings: vi.fn(),
  fetchBooking: vi.fn(),
  updateBookingStatus: vi.fn(),
}))

const mockSocket = {
  emit: vi.fn((event, data) => {
    if (event === 'message:send') {
      mockSocket._listeners['message:receive']?.({
        _id: `msg-${Date.now()}`,
        conversationId: data.conversationId,
        senderId: 'my-user-id',
        content: data.content,
        createdAt: new Date().toISOString(),
      })
    }
  }),
  on: vi.fn((event, cb) => {
    mockSocket._listeners[event] = cb
  }),
  off: vi.fn((event) => {
    delete mockSocket._listeners[event]
  }),
  _listeners: {},
}

vi.mock('../hooks/useSocket.js', () => ({
  useSocket: vi.fn(() => ({ getSocket: () => mockSocket, status: 'connected' })),
}))

vi.mock('../api/chatApi.js', () => ({
  getMessagesWithUser: vi.fn(() =>
    Promise.resolve({
      success: true,
      messages: [
        {
          _id: 'init-1',
          senderId: 'peer-id',
          content: 'Hello there!',
          createdAt: new Date().toISOString(),
        },
      ],
    }),
  ),
  getConversationMessages: vi.fn(() => Promise.resolve({ success: true, messages: [] })),
  getConversations: vi.fn(() => Promise.resolve({ success: true, conversations: [] })),
  getUnreadMessageCount: vi.fn(() => Promise.resolve({ success: true, count: 0 })),
  markConversationAsRead: vi.fn(() => Promise.resolve({ success: true, modifiedCount: 0 })),
  sendMessage: vi.fn((data) => Promise.resolve({ success: true, message: { _id: 'msg-rest-1', ...data } })),
}))

vi.mock('../api/mockChatApi.js', () => ({
  MOCK_PEER: {
    id: 'u-sarah',
    name: 'Sarah Johnson',
    department: 'Computer Science',
    university: 'MIT',
    email: 'sarah.johnson@mit.edu.et',
    phone: '+1 (617) 555-0192',
    profilePicUrl: null,
  },
  INITIAL_MESSAGES: [
    { id: 'init-1', sender: 'peer', text: 'Hello there!', time: '9:01 AM' },
  ],
  subscribeLiveMessages: vi.fn(() => () => { }),
}))

const MOCK_BOOKINGS = [
  {
    id: 'bk-pending',
    title: 'Calculus 101 Tutoring',
    tutorName: 'Sarah Jenkins',
    tutorProfilePicUrl: null,
    status: 'pending',
    scheduledDate: 'Oct 12, 3 PM',
  },
  {
    id: 'bk-confirmed',
    title: 'Python for Beginners',
    tutorName: 'James Okafor',
    tutorProfilePicUrl: null,
    status: 'confirmed',
    scheduledDate: 'Oct 15, 10 AM',
  },
]

function setup() {
  window.HTMLElement.prototype.scrollIntoView = vi.fn()

  bookingApi.fetchBookings.mockResolvedValue(MOCK_BOOKINGS.map((b) => ({ ...b })))
  bookingApi.updateBookingStatus.mockImplementation(async (id, newStatus) => {
    const booking = MOCK_BOOKINGS.find((b) => b.id === id)
    return { ...booking, status: newStatus }
  })
}

describe('Booking → accept → chat → contact-share flow', () => {
  beforeEach(setup)
  afterEach(() => vi.restoreAllMocks())

  it('confirms a pending booking', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><BookingScreen onNavigate={vi.fn()} /></MemoryRouter>)

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(2))

    const pendingCard = screen
      .getAllByRole('article')
      .find((el) => within(el).queryByText('Calculus 101 Tutoring'))

    expect(within(pendingCard).getByRole('status')).toHaveAttribute('data-status', 'pending')

    // Cancel the pending booking — this exercises the status-change path
    bookingApi.updateBookingStatus.mockResolvedValueOnce({ ...MOCK_BOOKINGS[0], status: 'cancelled' })
    await user.click(within(pendingCard).getByRole('button', { name: /cancel/i }))

    await waitFor(() => {
      expect(within(pendingCard).getByRole('status')).toHaveAttribute('data-status', 'cancelled')
    })
  })

  it('opens the inline chat panel after clicking Message on a confirmed booking', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><BookingScreen onNavigate={vi.fn()} /></MemoryRouter>)

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(2))

    const confirmedCard = screen
      .getAllByRole('article')
      .find((el) => within(el).queryByText('Python for Beginners'))

    await user.click(within(confirmedCard).getByRole('button', { name: /message/i }))

    expect(await screen.findByRole('region', { name: /chat with james okafor/i })).toBeInTheDocument()
  })

  it('shows "Open in Chat" link inside the chat panel', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><BookingScreen onNavigate={vi.fn()} /></MemoryRouter>)

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(2))

    const confirmedCard = screen
      .getAllByRole('article')
      .find((el) => within(el).queryByText('Python for Beginners'))

    await user.click(within(confirmedCard).getByRole('button', { name: /message/i }))

    await screen.findByRole('region', { name: /chat with james okafor/i })
    expect(screen.getByRole('button', { name: /open in chat/i })).toBeInTheDocument()
  })

  it('sends a message in the inline chat panel', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><BookingScreen onNavigate={vi.fn()} /></MemoryRouter>)

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(2))

    const confirmedCard = screen
      .getAllByRole('article')
      .find((el) => within(el).queryByText('Python for Beginners'))

    await user.click(within(confirmedCard).getByRole('button', { name: /message/i }))

    const chatPanel = await screen.findByRole('region', { name: /chat with james okafor/i })
    const input = within(chatPanel).getByRole('textbox', { name: /message input/i })

    await user.type(input, 'Looking forward to the session!')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(within(chatPanel).getByText('Looking forward to the session!')).toBeInTheDocument()
    })
  })

  it('clicking Share Contact opens consent modal without sharing yet', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><BookingScreen onNavigate={vi.fn()} /></MemoryRouter>)

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(2))

    const confirmedCard = screen
      .getAllByRole('article')
      .find((el) => within(el).queryByText('Python for Beginners'))

    await user.click(within(confirmedCard).getByRole('button', { name: /share contact/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/share your contact information\?/i)).toBeInTheDocument()
    expect(screen.queryByText(/contact info shared/i)).not.toBeInTheDocument()
  })

  it('cancelling consent closes the modal and shares nothing', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><BookingScreen onNavigate={vi.fn()} /></MemoryRouter>)

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(2))

    const confirmedCard = screen
      .getAllByRole('article')
      .find((el) => within(el).queryByText('Python for Beginners'))

    await user.click(within(confirmedCard).getByRole('button', { name: /share contact/i }))
    expect(screen.getByRole('dialog')).toBeInTheDocument()

    // Click the Cancel button inside the dialog
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /^cancel$/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByText(/contact info shared/i)).not.toBeInTheDocument()
  })

  it('confirming consent closes modal and shows a success toast', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><BookingScreen onNavigate={vi.fn()} /></MemoryRouter>)

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(2))

    const confirmedCard = screen
      .getAllByRole('article')
      .find((el) => within(el).queryByText('Python for Beginners'))

    await user.click(within(confirmedCard).getByRole('button', { name: /share contact/i }))
    await user.click(screen.getByRole('button', { name: /^share contact info$/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByRole('status', { name: '' })).toHaveTextContent(/contact info shared/i)
    })
  })
})

describe('Chat page — send message + share contact', () => {
  const mockUser = { _id: 'my-user-id', name: 'Alex Demo', email: 'alex@campus.edu.et', phone: null }

  function renderChat(user = mockUser) {
    return render(
      <MemoryRouter initialEntries={['/chat/u-sarah']}>
        <Routes>
          <Route
            path="/chat/:id"
            element={<ChatPage user={user} onNavigate={vi.fn()} onLogout={vi.fn()} />}
          />
        </Routes>
      </MemoryRouter>,
    )
  }

  beforeEach(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn()
  })
  afterEach(() => vi.restoreAllMocks())

  it('renders the chat thread with seed messages', async () => {
    renderChat()
    expect(await screen.findByRole('log', { name: /chat messages/i })).toBeInTheDocument()
    expect(screen.getByText('Hello there!')).toBeInTheDocument()
  })

  it('sends a message and it appears in the thread', async () => {
    const user = userEvent.setup()
    renderChat()

    const input = screen.getByRole('textbox', { name: /message input/i })
    await user.type(input, 'Can we do 2 PM instead?')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(screen.getByText('Can we do 2 PM instead?')).toBeInTheDocument()
    })
  })

  it('share contact info button opens consent modal', async () => {
    const user = userEvent.setup()
    renderChat()

    await user.click(screen.getByRole('button', { name: /share contact info/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText(/share your contact information\?/i)).toBeInTheDocument()
  })

  it('confirming consent adds a contact card to the thread', async () => {
    const user = userEvent.setup()
    renderChat()

    await user.click(screen.getByRole('button', { name: /share contact info/i }))

    // Confirm inside the dialog specifically to avoid matching the input-bar button
    await user.click(within(screen.getByRole('dialog')).getByRole('button', { name: /share contact info/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    await waitFor(() => {
      expect(screen.getByLabelText(/shared contact information/i)).toBeInTheDocument()
      expect(screen.getByText('Alex Demo')).toBeInTheDocument()
      expect(screen.getByText('alex@campus.edu.et')).toBeInTheDocument()
    })
  })

  it('cancelling consent does not add a contact card', async () => {
    const user = userEvent.setup()
    renderChat()

    await user.click(screen.getByRole('button', { name: /share contact info/i }))
    await user.click(screen.getByRole('button', { name: /^cancel$/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.queryByLabelText(/shared contact information/i)).not.toBeInTheDocument()
  })
})
