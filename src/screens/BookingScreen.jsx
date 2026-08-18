import { useState, useEffect, useRef, useCallback } from 'react'
import {
  IconSend,
  IconPaperclip,
  IconDotsVertical,
  IconMessageCircle,
  IconRefresh,
  IconArrowRight,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import BookingCard from '../components/BookingCard.jsx'
import ConsentModal from '../components/ConsentModal.jsx'
import Footer from '../components/Footer.jsx'
import {
  fetchBookings,
  updateBookingStatus,
} from '../api/mockBookingApi.js'



const SEED_MESSAGES = [
  {
    id: 'm-1',
    sender: 'tutor',
    text: 'Hi! I saw you booked the Calculus session. Let me know what specific topics you want to cover so I can prepare!',
    time: '9:01 AM',
  },
  {
    id: 'm-2',
    sender: 'student',
    text: "Hey Sarah! Thanks for reaching out. I'm struggling a bit with derivatives and the chain rule.",
    time: '9:04 AM',
  },
  {
    id: 'm-3',
    sender: 'tutor',
    text: "Perfect, I have some great practice problems for the chain rule. We'll make sure you get it down.",
    time: '9:06 AM',
  },
]

function initialsOf(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

function TutorAvatar({ name, url }) {
  if (url) {
    return (
      <img
        src={url}
        alt={`${name} avatar`}
        className="size-8 shrink-0 rounded-full object-cover shadow-sm mt-1"
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className="size-8 shrink-0 rounded-full bg-primary-fixed text-xs font-bold text-primary flex items-center justify-center mt-1 shadow-sm"
    >
      {initialsOf(name)}
    </div>
  )
}



function ChatPanel({ booking }) {
  const [messages, setMessages] = useState(SEED_MESSAGES)
  const [draft, setDraft] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function handleSend() {
    const text = draft.trim()
    if (!text) return
    setMessages((prev) => [
      ...prev,
      {
        id: `m-${Date.now()}`,
        sender: 'student',
        text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ])
    setDraft('')
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const tutorName = booking?.tutorName ?? 'Tutor'
  const tutorPic = booking?.tutorProfilePicUrl ?? null

  return (
    <section
      aria-label={`Chat with ${tutorName}`}
      className="w-full max-w-3xl flex flex-col glass-card rounded-2xl overflow-hidden"
      style={{ height: 520 }}
    >
      {/* header */}
      <div className="px-5 py-4 border-b border-white/30 flex items-center justify-between bg-white/40 backdrop-blur-md shrink-0">
        <div className="flex items-center gap-3">
          <IconMessageCircle size={22} className="text-primary" aria-hidden="true" />
          <h2 className="font-semibold text-base text-primary">
            Chat with {tutorName}
          </h2>
        </div>
        <button
          type="button"
          aria-label="More options"
          className="text-on-surface-variant hover:text-primary transition-colors rounded-full p-1 hover:bg-white/50"
        >
          <IconDotsVertical size={20} aria-hidden="true" />
        </button>
      </div>

      {/* messages */}
      <div className="flex-grow overflow-y-auto flex flex-col gap-4 px-5 py-4 bg-white/20 backdrop-blur-sm">
        <div className="flex justify-center">
          <span className="bg-surface-container-high/50 backdrop-blur-sm text-on-surface-variant text-xs font-medium py-1 px-4 rounded-full border border-white/40">
            Today
          </span>
        </div>

        {messages.map((msg) =>
          msg.sender === 'tutor' ? (
            <div key={msg.id} className="flex items-start gap-3 max-w-[80%]">
              <TutorAvatar name={tutorName} url={tutorPic} />
              <div>
                <div className="bg-white/70 backdrop-blur-md text-on-surface p-3.5 rounded-2xl rounded-tl-sm text-sm border border-white/50 shadow-sm leading-relaxed">
                  {msg.text}
                </div>
                <span className="text-[11px] text-outline mt-1 ml-1 block">{msg.time}</span>
              </div>
            </div>
          ) : (
            <div
              key={msg.id}
              className="flex items-start gap-3 max-w-[80%] self-end flex-row-reverse"
            >
              <div>
                <div className="bg-secondary-container/90 backdrop-blur-md text-on-secondary-container p-3.5 rounded-2xl rounded-tr-sm text-sm shadow-sm leading-relaxed border border-secondary-container/20">
                  {msg.text}
                </div>
                <span className="text-[11px] text-outline mt-1 mr-1 block text-right">{msg.time}</span>
              </div>
            </div>
          ),
        )}
        <div ref={bottomRef} />
      </div>

      {/* input */}
      <div className="px-4 py-3 border-t border-white/30 bg-white/50 backdrop-blur-md flex items-center gap-3 shrink-0">
        <button
          type="button"
          aria-label="Attach file"
          className="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-full hover:bg-white/50"
        >
          <IconPaperclip size={20} aria-hidden="true" />
        </button>
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          placeholder="Type a message…"
          aria-label="Message input"
          className="flex-grow bg-white/60 border border-white/50 rounded-full py-2.5 px-4 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary/50 focus:outline-none placeholder-on-surface-variant/70 shadow-inner text-on-surface"
        />
        <button
          type="button"
          onClick={handleSend}
          aria-label="Send message"
          className="bg-primary text-on-primary size-10 rounded-full hover:bg-primary-container transition-colors flex items-center justify-center shadow-md hover:shadow-lg shrink-0"
        >
          <IconSend size={18} aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}



const STATUS_TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]



export default function BookingScreen({ user, onLogout, onNavigate }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [activeChat, setActiveChat] = useState(null)
  const [toastMsg, setToastMsg] = useState(null)
  const [consentBookingId, setConsentBookingId] = useState(null)

  /* ── load bookings from mock backend ── */
  const loadBookings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBookings()
      setBookings(data)
    } catch {
      setError('Failed to load bookings. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadBookings()
  }, [loadBookings])

  /* ── toast helper ── */
  function showToast(msg) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }


  async function handleStatusChange(id, newStatus) {

    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
    )
    try {
      const updated = await updateBookingStatus(id, newStatus)
      // apply confirmed data from server
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? updated : b)),
      )
      const labels = {
        confirmed: 'Booking confirmed.',
        completed: 'Booking marked as completed.',
        cancelled: 'Booking cancelled.',
      }
      showToast(labels[newStatus] ?? 'Status updated.')
    } catch (err) {
      // roll back on failure
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id ? { ...b, status: b._prevStatus ?? b.status } : b,
        ),
      )
      showToast(`Error: ${err.message}`)
    }
  }

  /* ── filtered list ── */
  const visible =
    activeTab === 'all'
      ? bookings
      : bookings.filter((b) => b.status === activeTab)

  const chatBooking = activeChat
    ? bookings.find((b) => b.id === activeChat.id) ?? activeChat
    : null

  const consentPeer = consentBookingId
    ? bookings.find((b) => b.id === consentBookingId)?.tutorName ?? 'this tutor'
    : ''

  function handleConsentConfirm() {
    setConsentBookingId(null)
    showToast('Contact info shared.')
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-on-background font-body-md overflow-x-hidden">
      <AppNavbar
        user={user}
        activeView="tutor"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="flex-grow flex flex-col items-center py-10 px-4 md:px-8 gap-8 relative z-10 mesh-bg">
        {/* page title */}
        <div className="w-full max-w-3xl">
          <h1 className="font-bold text-2xl text-primary">My Bookings</h1>
          <p className="text-sm text-on-surface-variant mt-1">
            Track and manage your tutoring sessions.
          </p>
        </div>

        {/* status filter tabs */}
        <div
          role="tablist"
          aria-label="Filter bookings by status"
          className="w-full max-w-3xl flex gap-2 overflow-x-auto pb-1 hide-scrollbar"
        >
          {STATUS_TABS.map((tab) => {
            const count =
              tab.key === 'all'
                ? bookings.length
                : bookings.filter((b) => b.status === tab.key).length
            return (
              <button
                key={tab.key}
                role="tab"
                aria-selected={activeTab === tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${activeTab === tab.key
                  ? 'bg-primary text-on-primary shadow-sm'
                  : 'bg-white/60 border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                  }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`ml-1.5 rounded-full px-1.5 text-[10px] font-bold ${activeTab === tab.key
                      ? 'bg-white/20 text-on-primary'
                      : 'bg-surface-container text-on-surface-variant'
                      }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* booking list */}
        <div className="w-full max-w-3xl flex flex-col gap-4">
          {loading && (
            <div
              role="status"
              aria-live="polite"
              className="text-center py-16 text-on-surface-variant text-sm"
            >
              Loading bookings…
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="rounded-xl border border-error-container bg-error-container text-on-error-container px-4 py-3 text-sm flex items-center justify-between"
            >
              {error}
              <button
                type="button"
                onClick={loadBookings}
                className="inline-flex items-center gap-1 font-semibold text-xs hover:underline"
              >
                <IconRefresh size={14} aria-hidden="true" />
                Retry
              </button>
            </div>
          )}

          {!loading && !error && visible.length === 0 && (
            <div className="text-center py-16 text-on-surface-variant text-sm">
              No {activeTab !== 'all' ? activeTab : ''} bookings found.
            </div>
          )}

          {visible.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onChat={(id) => {
                const b = bookings.find((x) => x.id === id)
                setActiveChat(b ?? null)
              }}
              onCancel={(id) => handleStatusChange(id, 'cancelled')}
              onShareContact={(id) => setConsentBookingId(id)}
            />
          ))}
        </div>


        <section
          aria-label="Demo: simulate backend status updates"
          className="w-full max-w-3xl glass-card rounded-2xl p-5"
        >
          <h2 className="font-semibold text-sm text-primary mb-1">
            Simulate backend status changes
          </h2>
          <p className="text-xs text-on-surface-variant mb-4">
            These buttons mirror what a backend webhook or admin action would do.
          </p>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => handleStatusChange('bk-2', 'confirmed')}
              className="rounded-lg bg-[#e8f5e9] border border-[#c8e6c9] text-[#1b5e20] text-xs font-semibold px-3.5 py-2 hover:brightness-95 transition"
            >
              Confirm "Python for Beginners"
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange('bk-1', 'completed')}
              className="rounded-lg bg-[#e3f2fd] border border-[#bbdefb] text-[#0d47a1] text-xs font-semibold px-3.5 py-2 hover:brightness-95 transition"
            >
              Complete "Calculus 101"
            </button>
            <button
              type="button"
              onClick={() => handleStatusChange('bk-2', 'cancelled')}
              className="rounded-lg bg-[#fce4ec] border border-[#f8bbd0] text-[#880e4f] text-xs font-semibold px-3.5 py-2 hover:brightness-95 transition"
            >
              Cancel "Python for Beginners"
            </button>
          </div>
        </section>

        {/* chat panel (shown when a booking is selected) */}
        {chatBooking && (
          <div className="w-full max-w-3xl flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-sm text-primary">
                Messages — {chatBooking.title}
              </h2>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => onNavigate('chat')}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  Open in Chat
                  <IconArrowRight size={13} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveChat(null)}
                  className="text-xs text-on-surface-variant hover:text-primary transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
            <ChatPanel booking={chatBooking} />
          </div>
        )}
      </main>

      <Footer onNavigate={onNavigate} />

      {/* toast */}
      {toastMsg && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-on-primary text-sm font-medium px-5 py-3 rounded-full shadow-lg"
        >
          {toastMsg}
        </div>
      )}

      <ConsentModal
        isOpen={consentBookingId !== null}
        peerName={consentPeer}
        onCancel={() => setConsentBookingId(null)}
        onConfirm={handleConsentConfirm}
      />
    </div>
  )
}
