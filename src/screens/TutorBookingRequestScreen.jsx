import { useState, useEffect, useCallback } from 'react'
import {
  IconCheck,
  IconX,
  IconRefresh,
  IconCalendar,
  IconClock,
  IconUser,
  IconMessageCircle,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import Footer from '../components/Footer.jsx'
import { fetchTutorRequests, respondToRequest } from '../api/mockBookingApi.js'
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

function RequestCard({ request, onAccept, onDecline, loading }) {
  const { id, studentName, studentProfilePicUrl, subject, message, scheduledDate, hourlyRate, status } = request
  const isPending = status === 'pending'

  return (
    <article
      aria-label={`Booking request from ${studentName} for ${subject}`}
      className="glass-card rounded-2xl p-5 relative overflow-hidden group transition-shadow hover:shadow-md"
    >
      <div className="pointer-events-none absolute -right-8 -top-8 size-32 rounded-full bg-secondary-container/10 blur-2xl transition-colors group-hover:bg-secondary-container/20" />

      <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left: avatar + info */}
        <div className="flex items-start gap-4">
          <StudentAvatar name={studentName} url={studentProfilePicUrl} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-base text-primary leading-snug">{subject}</h3>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <IconUser size={13} className="text-on-surface-variant shrink-0" aria-hidden="true" />
              <p className="text-sm text-on-surface-variant">{studentName}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <IconCalendar size={13} className="text-on-surface-variant shrink-0" aria-hidden="true" />
              <p className="text-xs text-on-surface-variant">{scheduledDate}</p>
            </div>
            <div className="flex items-center gap-1.5 mt-1">
              <IconClock size={13} className="text-secondary shrink-0" aria-hidden="true" />
              <p className="text-xs font-semibold text-secondary">ETB {hourlyRate} / hr</p>
            </div>
            {message && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-surface-container/60 px-3 py-2">
                <IconMessageCircle size={13} className="text-on-surface-variant shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-on-surface-variant leading-relaxed italic">"{message}"</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: status + actions */}
        <div className="flex flex-col items-start gap-3 sm:items-end shrink-0">
          <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${STATUS_STYLES[status] ?? STATUS_STYLES.pending}`}>
            {STATUS_LABELS[status] ?? status}
          </span>

          {isPending && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onDecline(id)}
                disabled={loading === id}
                aria-label={`Decline request from ${studentName}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-error/30 bg-white/50 px-4 py-1.5 text-xs font-semibold text-error backdrop-blur-sm transition-colors hover:bg-error-container disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <IconX size={13} aria-hidden="true" />
                Decline
              </button>
              <button
                type="button"
                onClick={() => onAccept(id)}
                disabled={loading === id}
                aria-label={`Accept request from ${studentName}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-semibold text-on-primary shadow-sm transition-all hover:bg-primary-container active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
    setLoading(true)
    setError(null)
    try {
      const res = await getUserBookings({ role: 'tutor' })
      if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
        const formatted = res.data.map((b) => ({
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
      } else {
        const data = await fetchTutorRequests()
        setRequests(data)
      }
    } catch {
      try {
        const data = await fetchTutorRequests()
        setRequests(data)
      } catch {
        setError('Failed to load requests. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (isTutor) {
      load()
    }
  }, [isTutor, load])

  function showToast(msg) {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  async function handleRespond(id, response) {
    const newStatus = response === 'accept' ? 'confirmed' : 'declined'
    setActionLoading(id)
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    )
    try {
      const res = await updateBookingStatus(id, newStatus)
      const updatedData = res?.data || res?.booking || res
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, ...updatedData, status: newStatus } : r))
      )
      showToast(response === 'accept' ? 'Request accepted — student will be notified.' : 'Request declined.')
    } catch (err) {
      try {
        const updated = await respondToRequest(id, response)
        setRequests((prev) => (prev.map((r) => (r.id === id ? updated : r))))
        showToast(response === 'accept' ? 'Request accepted — student will be notified.' : 'Request declined.')
      } catch (mockErr) {
        setRequests((prev) => (prev.map((r) => (r.id === id ? { ...r, status: 'pending' } : r))))
        showToast(`Error: ${err?.message || mockErr?.message || 'Failed to process request'}`)
      }
    } finally {
      setActionLoading(null)
    }
  }

  if (!isTutor) {
    return (
      <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
        <AppNavbar user={user} activeView="tutor" onNavigate={onNavigate} onLogout={onLogout} />
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
      <AppNavbar user={user} activeView="tutor" onNavigate={onNavigate} onLogout={onLogout} />

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
                Review and respond to students who want to book you.
              </p>
            </div>
            <button
              type="button"
              onClick={load}
              aria-label="Refresh requests"
              className="flex size-9 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary cursor-pointer"
            >
              <IconRefresh size={17} aria-hidden="true" />
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
            const count = tab.key === 'all'
              ? requests.length
              : requests.filter((r) => r.status === tab.key || (tab.key === 'declined' && r.status === 'cancelled')).length
            return (
              <button
                key={tab.key}
                role="tab"
                type="button"
                aria-selected={activeTab === tab.key}
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

        {/* list */}
        <div className="w-full max-w-3xl flex flex-col gap-4">
          {loading && (
            <div role="status" aria-live="polite" className="text-center py-16 text-on-surface-variant text-sm">
              Loading requests…
            </div>
          )}

          {error && (
            <div role="alert" className="rounded-xl border border-error-container bg-error-container text-on-error-container px-4 py-3 text-sm flex items-center justify-between">
              {error}
              <button type="button" onClick={load} className="inline-flex items-center gap-1 font-semibold text-xs hover:underline cursor-pointer">
                <IconRefresh size={14} aria-hidden="true" />
                Retry
              </button>
            </div>
          )}

          {!loading && !error && visible.length === 0 && (
            <div className="text-center py-16 text-on-surface-variant text-sm">
              No {activeTab !== 'all' ? activeTab : ''} requests yet.
            </div>
          )}

          {visible.map((req) => (
            <RequestCard
              key={req.id}
              request={req}
              onAccept={(id) => handleRespond(id, 'accept')}
              onDecline={(id) => handleRespond(id, 'decline')}
              loading={actionLoading}
            />
          ))}
        </div>
      </main>

      <Footer onNavigate={onNavigate} />

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
