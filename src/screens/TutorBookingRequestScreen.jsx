import { useState, useEffect, useCallback } from 'react'
import {
  IconCheck,
  IconX,
  IconRefresh,
  IconCalendar,
  IconMessageCircle,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import Footer from '../components/Footer.jsx'
import { getUserBookings, updateBookingStatus } from '../api/bookingApi.js'

function initialsOf(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

function StudentAvatar({ name, url }) {
  if (url) {
    return (
      <img
        src={url}
        alt={`${name} avatar`}
        className="size-14 shrink-0 rounded-full border-2 border-white object-cover shadow-sm"
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className="size-14 shrink-0 rounded-full border-2 border-white bg-primary-fixed text-lg font-bold text-primary flex items-center justify-center shadow-sm"
    >
      {initialsOf(name)}
    </div>
  )
}

const STATUS_STYLES = {
  pending: 'bg-[#fff8e1] border-[#ffe082] text-[#7c5e00]',
  confirmed: 'bg-[#e8f5e9] border-[#c8e6c9] text-[#1b5e20]',
  cancelled: 'bg-[#fce4ec] border-[#f8bbd0] text-[#880e4f]',
  declined: 'bg-[#fce4ec] border-[#f8bbd0] text-[#880e4f]',
}

const STATUS_LABELS = {
  pending: 'Awaiting response',
  confirmed: 'Accepted',
  cancelled: 'Declined',
  declined: 'Declined',
}

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Accepted' },
  { key: 'declined', label: 'Declined' },
]

function RequestCard({ req, onRespond, onChat, loadingId }) {
  const isPending = req.status === 'pending'
  const isConfirmed = req.status === 'confirmed'
  const isLoading = loadingId === req.id

  return (
    <article
      role="article"
      className="rounded-2xl border border-surface-variant bg-surface-lowest p-6 shadow-level-1 transition-shadow hover:shadow-level-2"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: Student info */}
        <div className="flex items-start gap-4">
          <StudentAvatar name={req.studentName} url={req.studentProfilePicUrl} />

          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-display text-base font-bold text-primary">
                {req.studentName}
              </h3>
              <span
                className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
                  STATUS_STYLES[req.status] || STATUS_STYLES.pending
                }`}
              >
                {STATUS_LABELS[req.status] || req.status}
              </span>
            </div>

            <p className="text-xs font-semibold text-secondary-container">
              {req.subject}
            </p>

            {req.message && (
              <p className="mt-1 text-xs text-on-surface-variant italic bg-surface-low rounded-lg p-2 border border-surface-variant/50">
                "{req.message}"
              </p>
            )}

            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-on-surface-variant">
              <span className="inline-flex items-center gap-1">
                <IconCalendar size={14} className="text-outline" aria-hidden="true" />
                {req.scheduledDate}
              </span>
              <span className="inline-flex items-center gap-1 font-semibold text-primary">
                ETB {req.hourlyRate}/hr
              </span>
            </div>
          </div>
        </div>

        {/* Right: Action Buttons */}
        <div className="flex flex-col gap-2 shrink-0 sm:items-end">
          {isConfirmed && (
            <button
              type="button"
              onClick={() => onChat(req)}
              className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-emerald-500 cursor-pointer"
            >
              <IconMessageCircle size={14} aria-hidden="true" />
              Chat with Student
            </button>
          )}

          {isPending && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => onRespond(req.id, 'decline')}
                aria-label={`Decline booking request from ${req.studentName}`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-error/30 bg-error/10 px-3.5 py-2 text-xs font-semibold text-error transition-colors hover:bg-error/20 disabled:opacity-50 cursor-pointer"
              >
                <IconX size={13} aria-hidden="true" />
                Decline
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => onRespond(req.id, 'accept')}
                aria-label={`Accept booking request from ${req.studentName}`}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary shadow-sm transition-colors hover:bg-primary-container disabled:opacity-50 cursor-pointer"
              >
                <IconCheck size={13} aria-hidden="true" />
                Accept
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

export default function TutorBookingRequestScreen({ user, onLogout, onNavigate }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('all')
  const [actionLoading, setActionLoading] = useState(null)
  const [toast, setToast] = useState(null)

  const isTutor = user?.role === 'tutor' || user?.isTutor === true

  const load = useCallback(async () => {
    setError(null)
    try {
      const res = await getUserBookings({ role: 'tutor' })
      const list = res?.data || res?.bookings || []
      const formatted = list.map((b) => ({
        ...b,
        id: b._id || b.id,
        studentName: b.studentId?.name || b.studentName || 'Student',
        studentProfilePicUrl: b.studentId?.profilePicUrl || b.studentProfilePicUrl || '',
        subject: b.subject || b.title || 'Tutoring Session',
        message: b.message || '',
        scheduledDate: b.availabilityId
          ? `${b.availabilityId.dayOfWeek || ''} at ${b.availabilityId.startTime || ''}`.trim() || 'Upcoming Session'
          : b.scheduledDate || b.time || 'Upcoming Session',
        hourlyRate: b.price || b.hourlyRate || 35,
        status: b.status,
      }))
      setRequests(formatted)
    } catch (err) {
      setError(err?.message || 'Failed to load booking requests.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let isMounted = true
    getUserBookings({ role: 'tutor' })
      .then((res) => {
        if (!isMounted) return
        const list = res?.data || res?.bookings || []
        const formatted = list.map((b) => ({
          ...b,
          id: b._id || b.id,
          studentName: b.studentId?.name || b.studentName || 'Student',
          studentProfilePicUrl: b.studentId?.profilePicUrl || b.studentProfilePicUrl || '',
          subject: b.subject || b.title || 'Tutoring Session',
          message: b.message || '',
          scheduledDate: b.availabilityId
            ? `${b.availabilityId.dayOfWeek || ''} at ${b.availabilityId.startTime || ''}`.trim() || 'Upcoming Session'
            : b.scheduledDate || b.time || 'Upcoming Session',
          hourlyRate: b.price || b.hourlyRate || 35,
          status: b.status,
        }))
        setRequests(formatted)
      })
      .catch((err) => {
        if (isMounted) setError(err?.message || 'Failed to load booking requests.')
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function handleRespond(id, response) {
    setActionLoading(id)
    const newStatus = response === 'accept' ? 'confirmed' : 'declined'

    try {
      const res = await updateBookingStatus(id, newStatus)
      const updatedData = res?.data || res?.booking || res
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updatedData, status: newStatus } : r))
      )
      showToast(response === 'accept' ? 'Request accepted — student will be notified.' : 'Request declined.')
    } catch (err) {
      showToast(`Error: ${err?.message || 'Failed to process request'}`)
    } finally {
      setActionLoading(null)
    }
  }

  function handleChat(req) {
    const peerId = req.studentId?._id || req.studentId?.id || req.studentId || req.id
    onNavigate(`/chat/${peerId}`)
  }

  if (!isTutor) {
    return (
      <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
        <AppNavbar user={user} activeView="tutor-requests" onNavigate={onNavigate} onLogout={onLogout} />
        <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold text-primary">Tutor Access Only</h1>
          <p className="text-sm text-on-surface-variant">
            Booking request management is reserved for verified tutors.
          </p>
          <button
            type="button"
            onClick={() => onNavigate('bookings')}
            className="mt-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-on-primary shadow-level-1 cursor-pointer"
          >
            View My Student Bookings
          </button>
        </main>
        <Footer onNavigate={onNavigate} user={user} />
      </div>
    )
  }

  const visible = activeTab === 'all'
    ? requests
    : requests.filter((r) => r.status === activeTab || (activeTab === 'declined' && r.status === 'cancelled'))

  const pendingCount = requests.filter((r) => r.status === 'pending').length

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <AppNavbar user={user} activeView="tutor-requests" onNavigate={onNavigate} onLogout={onLogout} />

      <main className="flex-grow flex flex-col items-center py-10 px-4 md:px-8 gap-8 mesh-bg">
        {/* header */}
        <div className="w-full max-w-3xl">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h1 className="font-bold text-2xl text-primary flex items-center gap-2">
                Booking Requests
                {pendingCount > 0 && (
                  <span className="inline-flex items-center justify-center size-6 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold">
                    {pendingCount}
                  </span>
                )}
              </h1>
              <p className="text-sm text-on-surface-variant mt-1">
                Review and respond to session requests from students.
              </p>
            </div>

            <button
              type="button"
              onClick={load}
              aria-label="Refresh requests"
              className="inline-flex items-center gap-1.5 rounded-lg border border-outline-variant px-3 py-1.5 text-xs font-medium text-on-surface-variant transition-colors hover:text-primary cursor-pointer"
            >
              <IconRefresh size={14} className={loading ? 'animate-spin' : ''} aria-hidden="true" />
              Refresh
            </button>
          </div>
        </div>

        {/* tabs */}
        <div
          role="tablist"
          aria-label="Filter requests by status"
          className="w-full max-w-3xl flex gap-2 overflow-x-auto pb-1 hide-scrollbar"
        >
          {TABS.map((tab) => {
            const count =
              tab.key === 'all'
                ? requests.length
                : requests.filter(
                    (r) =>
                      r.status === tab.key ||
                      (tab.key === 'declined' && r.status === 'cancelled')
                  ).length

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
                    : 'bg-surface-low border border-outline-variant text-on-surface-variant hover:bg-surface-container'
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

        {/* content */}
        <div className="w-full max-w-3xl flex flex-col gap-4">
          {loading && (
            <div role="status" aria-live="polite" className="text-center py-16 text-on-surface-variant text-sm">
              Loading booking requests…
            </div>
          )}

          {error && (
            <div role="alert" className="rounded-xl border border-error/30 bg-error/10 text-error px-4 py-3 text-sm flex items-center justify-between">
              <span>{error}</span>
              <button type="button" onClick={load} className="font-semibold text-xs underline cursor-pointer">
                Retry
              </button>
            </div>
          )}

          {!loading && !error && visible.length === 0 && (
            <div className="text-center py-16 text-on-surface-variant text-sm">
              No {activeTab !== 'all' ? activeTab : ''} booking requests found.
            </div>
          )}

          {!loading &&
            !error &&
            visible.map((req) => (
              <RequestCard
                key={req.id}
                req={req}
                onRespond={handleRespond}
                onChat={handleChat}
                loadingId={actionLoading}
              />
            ))}
        </div>
      </main>

      <Footer onNavigate={onNavigate} user={user} />

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-on-primary text-sm font-medium px-5 py-3 rounded-full shadow-lg"
        >
          {toast}
        </div>
      )}
    </div>
  )
}
