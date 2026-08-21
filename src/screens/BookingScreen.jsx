import { useState, useEffect, useCallback } from 'react'
import { IconRefresh } from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import BookingCard from '../components/BookingCard.jsx'
import ConsentModal from '../components/ConsentModal.jsx'
import Footer from '../components/Footer.jsx'
import {
  fetchBookings,
  updateBookingStatus as updateMockBookingStatus,
} from '../api/mockBookingApi.js'
import {
  getUserBookings,
  updateBookingStatus as updateLiveBookingStatus,
} from '../api/bookingApi.js'

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
  const [modeTab, setModeTab] = useState('student') // 'student' (My Sessions) or 'tutor' (Incoming Requests)
  const [activeTab, setActiveTab] = useState('all')
  const [toastMsg, setToastMsg] = useState(null)
  const [consentBookingId, setConsentBookingId] = useState(null)

  const isTutor = user?.role === 'tutor' || user?.isTutor === true

  /* ── load bookings from backend with mock fallback ── */
  const loadBookings = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const queryRole = isTutor ? (modeTab === 'tutor' ? 'tutor' : 'student') : undefined
      const res = await getUserBookings(queryRole ? { role: queryRole } : undefined)
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const formatted = res.data.map((b) => ({
          ...b,
          id: b._id || b.id,
          tutorName: b.tutorId?.name || b.tutorName || 'Tutor',
          tutorProfilePicUrl: b.tutorId?.profilePicUrl || b.tutorPic || b.tutorProfilePicUrl || '',
          studentName: b.studentId?.name || b.studentName || 'Student',
          scheduledDate: b.availabilityId
            ? `${b.availabilityId.dayOfWeek || ''} at ${b.availabilityId.startTime || ''}`.trim() || 'Upcoming'
            : b.time || b.scheduledDate || 'Upcoming',
          subject: b.subject || 'Tutoring Session',
          title: b.title || b.subject || 'Tutoring Session',
          price: b.price || b.tutorId?.hourlyRate || 35,
        }))
        setBookings(formatted)
      } else {
        const data = await fetchBookings()
        setBookings(data)
      }
    } catch {
      try {
        const data = await fetchBookings()
        setBookings(data)
      } catch {
        setError('Failed to load bookings. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [isTutor, modeTab])

  useEffect(() => {
    loadBookings()
  }, [loadBookings])

  /* ── toast helper ── */
  function showToast(msg) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(null), 3000)
  }

  async function handleStatusChange(id, newStatus) {
    const prevBooking = bookings.find((b) => b.id === id)
    const prevStatus = prevBooking?.status

    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, _prevStatus: prevStatus, status: newStatus } : b)),
    )

    try {
      const res = await updateLiveBookingStatus(id, newStatus)
      const updatedData = res?.data || res?.booking || res
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...updatedData, status: newStatus } : b)),
      )
      const labels = {
        confirmed: 'Booking confirmed.',
        completed: 'Booking marked as completed.',
        cancelled: 'Booking cancelled.',
        declined: 'Booking declined.',
      }
      showToast(labels[newStatus] ?? 'Status updated.')
    } catch (err) {
      try {
        const updated = await updateMockBookingStatus(id, newStatus)
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, ...updated, status: newStatus } : b)),
        )
        const labels = {
          confirmed: 'Booking confirmed.',
          completed: 'Booking marked as completed.',
          cancelled: 'Booking cancelled.',
          declined: 'Booking declined.',
        }
        showToast(labels[newStatus] ?? 'Status updated.')
      } catch (mockErr) {
        setBookings((prev) =>
          prev.map((b) =>
            b.id === id ? { ...b, status: b._prevStatus ?? prevStatus ?? b.status } : b,
          ),
        )
        showToast(`Error: ${err?.message || mockErr?.message || 'Failed to update booking status'}`)
      }
    }
  }

  const handleOpenChat = (booking) => {
    const peerId = isTutor
      ? (booking.studentId?._id || booking.studentId?.id || booking.studentId)
      : (booking.tutorId?._id || booking.tutorId?.id || booking.tutorId || booking.tutorIdStr)
    const target = peerId || booking.id
    if (target) {
      onNavigate?.(`/chat/${target}`)
    } else {
      onNavigate?.('chat')
    }
  }

  /* ── filtered list ── */
  const visible =
    activeTab === 'all'
      ? bookings
      : bookings.filter((b) => b.status === activeTab)

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

          {/* Mode switch tabs for Tutors */}
          {isTutor && (
            <div className="mt-4 flex rounded-xl border border-surface-variant bg-surface-low p-1 max-w-md">
              <button
                type="button"
                onClick={() => setModeTab('student')}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                  modeTab === 'student'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                My Sessions (Student)
              </button>
              <button
                type="button"
                onClick={() => setModeTab('tutor')}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                  modeTab === 'tutor'
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface'
                }`}
              >
                Incoming Requests (Tutor)
              </button>
            </div>
          )}
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
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === tab.key
                    ? 'bg-primary text-on-primary shadow-sm'
                    : 'bg-white/60 border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`ml-1.5 rounded-full px-1.5 text-[10px] font-bold ${
                      activeTab === tab.key
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
                className="inline-flex items-center gap-1 font-semibold text-xs hover:underline cursor-pointer"
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
              onChat={() => handleOpenChat(booking)}
              onCancel={(id) => handleStatusChange(id, 'cancelled')}
              onAccept={(isTutor || modeTab === 'tutor') ? (id) => handleStatusChange(id, 'confirmed') : undefined}
              onDecline={(isTutor || modeTab === 'tutor') ? (id) => handleStatusChange(id, 'declined') : undefined}
              onShareContact={(id) => setConsentBookingId(id)}
            />
          ))}
        </div>
      </main>

      <Footer onNavigate={onNavigate} user={user} />

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
