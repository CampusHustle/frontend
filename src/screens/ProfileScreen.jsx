import { useState } from 'react'
import { IconCircleCheckFilled, IconStarFilled, IconEdit, IconRefresh } from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import Footer from '../components/Footer.jsx'
import EditProfileModal from '../components/EditProfileModal.jsx'
import AvailabilityManager from '../components/AvailabilityManager.jsx'
import { switchUserRole } from '../api/authApi.js'

function initialsOf(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 1)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function Avatar({ user, className = 'size-24' }) {
  if (user?.profilePicUrl) {
    return (
      <img
        src={user.profilePicUrl}
        alt={user.name || 'Profile avatar'}
        className={`${className} rounded-full border-4 border-surface object-cover shadow-md`}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className={`${className} flex items-center justify-center rounded-full border-4 border-outline-variant bg-primary text-3xl font-bold text-on-primary shadow-md`}
    >
      {initialsOf(user?.name || 'Student')}
    </div>
  )
}

function ChipList({ items, emptyText }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-on-surface-variant">{emptyText}</p>
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-surface-high px-3 py-1 text-sm font-medium text-on-surface"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function RatingBar({ label, value, count }) {
  const pct = count > 0 ? Math.round((value / 5) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 shrink-0 text-sm font-medium text-on-surface-variant">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
        <div
          className="h-full rounded-full bg-primary-container transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right text-sm font-bold text-primary">
        {count > 0 ? value.toFixed(1) : '—'}
      </span>
    </div>
  )
}

function ProfileCard({ user }) {
  const rating = user?.rating || { knowledge: 0, communication: 0, punctuality: 0, count: 0 }
  const hasRatings = rating.count > 0
  const average =
    hasRatings ? (rating.knowledge + rating.communication + rating.punctuality) / 3 : 0

  return (
    <>
      <section className="rounded-xl border border-surface-variant bg-surface-lowest p-6 shadow-level-1 md:p-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <Avatar user={user} className="size-24 shrink-0" />

          <div className="min-w-0 flex-1 text-center md:text-left">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <h2 className="font-display text-xl font-bold text-primary sm:text-2xl">
                {user?.name || 'Student'}
              </h2>
              {user?.verified && (
                <IconCircleCheckFilled
                  size={22}
                  className="shrink-0 text-tertiary-container"
                  aria-label="Verified student"
                />
              )}
            </div>

            <p className="mt-1 text-sm font-medium text-on-surface-variant">
              {[user?.department, user?.university, user?.year].filter(Boolean).join(' • ') ||
                'No academic info yet'}
            </p>
            <p className="text-sm text-on-surface-variant">{user?.email}</p>

            <p className="mt-4 text-sm leading-relaxed text-on-surface">
              {user?.bio || 'No bio yet — tell your peers a bit about yourself.'}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              {user?.hourlyRate ? (
                <span className="rounded-full bg-secondary-container px-4 py-1.5 text-sm font-bold text-on-secondary-container">
                  ETB {user.hourlyRate} <span className="font-medium opacity-80">/hr</span>
                </span>
              ) : (
                <span className="rounded-full bg-surface-high px-4 py-1.5 text-sm font-medium text-on-surface-variant">
                  Buying only
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-high px-4 py-1.5 text-sm font-semibold text-on-surface">
                <IconStarFilled size={16} className="text-primary-container" aria-hidden="true" />
                {hasRatings ? `${average.toFixed(1)} (${rating.count} ratings)` : 'No ratings yet'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-surface-variant bg-surface-lowest p-6 shadow-level-1">
          <h3 className="font-display mb-3 text-base font-bold text-primary">
            Skills I Can Offer
          </h3>
          <ChipList items={user?.skillsTeaching} emptyText="No skills listed yet." />
        </div>
        <div className="rounded-xl border border-surface-variant bg-surface-lowest p-6 shadow-level-1">
          <h3 className="font-display mb-3 text-base font-bold text-primary">
            Subjects I'm Learning
          </h3>
          <ChipList items={user?.skillsLearning} emptyText="No subjects listed yet." />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-surface-variant bg-surface-lowest p-6 shadow-level-1">
        <h3 className="font-display mb-4 text-base font-bold text-primary">Peer Ratings</h3>
        <div className="space-y-3">
          <RatingBar label="Knowledge" value={rating.knowledge} count={rating.count} />
          <RatingBar label="Communication" value={rating.communication} count={rating.count} />
          <RatingBar label="Punctuality" value={rating.punctuality} count={rating.count} />
        </div>
        {!hasRatings && (
          <p className="mt-3 text-sm text-on-surface-variant">
            Ratings appear after peers book and review you.
          </p>
        )}
      </section>
    </>
  )
}

export default function ProfileScreen({ user, onNavigate, onLogout, onUpdateProfile }) {
  const [localUser, setLocalUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [savedToast, setSavedToast] = useState(null)
  const [switchingRole, setSwitchingRole] = useState(false)
  const [blockingBookingsModal, setBlockingBookingsModal] = useState(null)

  const activeUser = localUser || user || null
  const isTutor = activeUser?.role === 'tutor' || activeUser?.isTutor === true

  const handleSaveProfile = (updatedUser) => {
    setLocalUser(updatedUser)
    onUpdateProfile?.(updatedUser)
    setSavedToast('Profile updated successfully!')
    setTimeout(() => setSavedToast(null), 3000)
  }

  const handleToggleRole = async () => {
    const targetRole = isTutor ? 'student' : 'tutor'
    setSwitchingRole(true)
    try {
      const res = await switchUserRole(targetRole)
      if (res?.user) {
        setLocalUser(res.user)
        onUpdateProfile?.(res.user)
        setSavedToast(`Mode updated to ${targetRole === 'tutor' ? 'Tutor Mode' : 'Student Mode'}!`)
        setTimeout(() => setSavedToast(null), 3000)
      }
    } catch (err) {
      if (err?.code === 'ACTIVE_BOOKINGS_EXIST' || err?.data?.code === 'ACTIVE_BOOKINGS_EXIST') {
        const list = err?.blockingBookings || err?.data?.blockingBookings || []
        setBlockingBookingsModal(list)
      } else {
        alert(err?.message || 'Failed to switch role.')
      }
    } finally {
      setSwitchingRole(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <AppNavbar
        user={activeUser}
        activeView="profile"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-5xl flex-grow px-4 py-8 sm:px-6 md:py-10 lg:px-8">
        {/* Feedback Toast */}
        {savedToast && (
          <div
            role="status"
            className="mb-4 flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400 animate-in fade-in duration-200"
          >
            <IconCircleCheckFilled size={18} />
            <span>{savedToast}</span>
          </div>
        )}

        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
              My Profile
            </h1>
            <p className="mt-1 text-sm font-medium text-on-surface-variant">
              {activeUser ? `Welcome back, ${activeUser.name}.` : 'Your CampusHustle profile.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            aria-label="Edit Profile"
            className="inline-flex items-center gap-2 self-start rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-on-primary shadow-level-1 transition-all hover:bg-primary-container hover:shadow-level-2 active:scale-95 sm:self-auto cursor-pointer"
          >
            <IconEdit size={16} stroke={2.2} />
            <span>Edit Profile</span>
          </button>
        </header>

        {/* Role Switch Banner */}
        <section className="mb-6 rounded-xl border border-primary/20 bg-primary-container/10 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Current Mode</span>
            <h3 className="font-display text-lg font-bold text-primary">
              {isTutor ? 'Tutor Mode' : 'Student Mode'}
            </h3>
            <p className="text-xs text-on-surface-variant mt-0.5">
              {isTutor
                ? 'You are listed as an active tutor. Students can discover your profile and book your availability.'
                : 'You are in student mode. Explore tutors, request sessions, and access study materials.'}
            </p>
          </div>
          <button
            type="button"
            disabled={switchingRole}
            onClick={handleToggleRole}
            className="shrink-0 rounded-lg bg-secondary-container px-4 py-2 text-xs font-bold text-on-secondary-container shadow-sm hover:brightness-105 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {switchingRole ? (
              <span className="inline-flex items-center gap-1">
                <IconRefresh size={14} className="animate-spin" /> Switching…
              </span>
            ) : isTutor ? (
              'Switch to Student Mode'
            ) : (
              'Activate Tutor Profile'
            )}
          </button>
        </section>

        <ProfileCard user={activeUser} />

        {isTutor && (
          <div className="mt-6">
            <AvailabilityManager />
          </div>
        )}

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => onNavigate?.('tutor')}
            className="rounded-lg border border-outline-variant px-6 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:border-primary hover:text-primary cursor-pointer"
          >
            Back to Find Tutors
          </button>
        </div>
      </main>

      <Footer onNavigate={onNavigate} user={activeUser} />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditing}
        user={activeUser}
        onClose={() => setIsEditing(false)}
        onSave={handleSaveProfile}
      />

      {/* Active Bookings Conflict Modal */}
      {blockingBookingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl bg-surface-lowest p-6 shadow-level-3 border border-surface-variant">
            <h3 className="font-display text-lg font-bold text-error">Cannot Switch Role</h3>
            <p className="mt-2 text-xs text-on-surface-variant">
              You have active confirmed tutoring sessions. Please complete or cancel these sessions before switching to Student Mode:
            </p>
            <ul className="mt-3 max-h-40 overflow-y-auto space-y-2 text-xs">
              {blockingBookingsModal.map((b) => (
                <li key={b._id || b.id} className="rounded-lg bg-surface-low p-2.5 border border-surface-variant flex justify-between items-center">
                  <span className="font-semibold text-primary">{b.studentId?.name || 'Student'}</span>
                  <span className="rounded-full bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                    Confirmed
                  </span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => setBlockingBookingsModal(null)}
              className="mt-5 w-full rounded-lg bg-primary py-2 text-xs font-semibold text-on-primary shadow-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
