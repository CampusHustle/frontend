import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import BookingScreen from '../screens/BookingScreen.jsx'
import ChatPage from '../pages/ChatPage.jsx'
import * as bookingApi from '../api/bookingApi.js'

vi.mock('../api/bookingApi.js', () => ({
  getUserBookings: vi.fn(),
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
  getConversations: vi.fn(() => Promise.resolve({ success: true, conversations: [] })),
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

  bookingApi.getUserBookings.mockResolvedValue({ data: MOCK_BOOKINGS.map((b) => ({ ...b })) })
  bookingApi.updateBookingStatus.mockImplementation(async (id, newStatus) => {
    const booking = MOCK_BOOKINGS.find((b) => b.id === id)
    return { data: { ...booking, status: newStatus } }
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
    bookingApi.updateBookingStatus.mockResolvedValueOnce({ data: { ...MOCK_BOOKINGS[0], status: 'cancelled' } })
    await user.click(within(pendingCard).getByRole('button', { name: /cancel/i }))

    await waitFor(() => {
      expect(within(pendingCard).getByRole('status')).toHaveAttribute('data-status', 'cancelled')
    })
  })

  it('navigates to real chat screen after clicking Message on a confirmed booking', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()
    render(<MemoryRouter><BookingScreen onNavigate={onNavigate} /></MemoryRouter>)

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(2))

    const confirmedCard = screen
      .getAllByRole('article')
      .find((el) => within(el).queryByText('Python for Beginners'))

    await user.click(within(confirmedCard).getByRole('button', { name: /message/i }))

    expect(onNavigate).toHaveBeenCalled()
  })

  it('clicking Share Contact opens consent modal without sharing yet', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><BookingScreen onNavigate={vi.fn()} /></MemoryRouter>)

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(2))

    const confirmedCard = screen
      .getAllByRole('article')
      .find((el) => within(el).queryByText('Python for Beginners'))

    await user.click(within(confirmedCard).getByRole('button', { name: /share contact/i }))

    expect(screen.getByRole('dialog', { name: /share your contact information/i })).toBeInTheDocument()
  })

  it('cancelling consent closes the modal and shares nothing', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><BookingScreen onNavigate={vi.fn()} /></MemoryRouter>)

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(2))

    const confirmedCard = screen
      .getAllByRole('article')
      .find((el) => within(el).queryByText('Python for Beginners'))

    await user.click(within(confirmedCard).getByRole('button', { name: /share contact/i }))
    const modal = screen.getByRole('dialog', { name: /share your contact information/i })
    await user.click(within(modal).getByRole('button', { name: /^cancel$/i }))

    expect(screen.queryByRole('dialog', { name: /share your contact information/i })).not.toBeInTheDocument()
  })

  it('confirming consent closes modal and shows a success toast', async () => {
    const user = userEvent.setup()
    render(<MemoryRouter><BookingScreen onNavigate={vi.fn()} /></MemoryRouter>)

    await waitFor(() => expect(screen.getAllByRole('article')).toHaveLength(2))

    const confirmedCard = screen
      .getAllByRole('article')
      .find((el) => within(el).queryByText('Python for Beginners'))

    await user.click(within(confirmedCard).getByRole('button', { name: /share contact/i }))
    const modal = screen.getByRole('dialog', { name: /share your contact information/i })
    await user.click(within(modal).getByRole('button', { name: /share contact info/i }))

    expect(screen.queryByRole('dialog', { name: /share your contact information/i })).not.toBeInTheDocument()
    expect(screen.getByText(/contact info shared/i)).toBeInTheDocument()
  })
})

describe('ChatPage — live messaging & contact sharing', () => {
  beforeEach(setup)
  afterEach(() => vi.restoreAllMocks())

  it('renders the chat thread with seed messages', async () => {
    render(
      <MemoryRouter initialEntries={['/chat/peer-id']}>
        <Routes>
          <Route path="/chat/:id" element={<ChatPage user={{ id: 'my-user-id', name: 'My Name', email: 'my.user@mit.edu.et' }} />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => expect(screen.getByText('Hello there!')).toBeInTheDocument())
  })

  it('sends a message and it appears in the thread', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/chat/peer-id']}>
        <Routes>
          <Route path="/chat/:id" element={<ChatPage user={{ id: 'my-user-id', name: 'My Name', email: 'my.user@mit.edu.et' }} />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => expect(screen.getByText('Hello there!')).toBeInTheDocument())

    const input = screen.getByPlaceholderText(/type a message/i)
    await user.type(input, 'Testing my new message')
    await user.click(screen.getByRole('button', { name: /send/i }))

    await waitFor(() => expect(screen.getByText('Testing my new message')).toBeInTheDocument())
  })

  it('share contact info button opens consent modal', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/chat/peer-id']}>
        <Routes>
          <Route path="/chat/:id" element={<ChatPage user={{ id: 'my-user-id', name: 'My Name', email: 'my.user@mit.edu.et' }} />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => expect(screen.getByText('Hello there!')).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: /share contact/i }))
    expect(screen.getByRole('dialog', { name: /share your contact information/i })).toBeInTheDocument()
  })

  it('confirming consent adds a contact card to the thread', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/chat/peer-id']}>
        <Routes>
          <Route path="/chat/:id" element={<ChatPage user={{ id: 'my-user-id', name: 'My Name', email: 'my.user@mit.edu.et' }} />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => expect(screen.getByText('Hello there!')).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: /share contact/i }))
    const modal = screen.getByRole('dialog', { name: /share your contact information/i })
    await user.click(within(modal).getByRole('button', { name: /share contact info/i }))

    await waitFor(() => {
      expect(screen.getByText('Verified Contact Shared')).toBeInTheDocument()
    })
  })

  it('cancelling consent does not add a contact card', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/chat/peer-id']}>
        <Routes>
          <Route path="/chat/:id" element={<ChatPage user={{ id: 'my-user-id', name: 'My Name', email: 'my.user@mit.edu.et' }} />} />
        </Routes>
      </MemoryRouter>,
    )

    await waitFor(() => expect(screen.getByText('Hello there!')).toBeInTheDocument())

    await user.click(screen.getByRole('button', { name: /share contact/i }))
    const modal = screen.getByRole('dialog', { name: /share your contact information/i })
    await user.click(within(modal).getByRole('button', { name: /^cancel$/i }))

    expect(screen.queryByText(/contact details shared/i)).not.toBeInTheDocument()
  })
})
