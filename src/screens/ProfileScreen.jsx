import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconCircleCheckFilled,
  IconAlertCircleFilled,
  IconStarFilled,
  IconEdit,
  IconRefresh,
  IconFileText,
  IconTrash,
  IconPlus,
  IconUpload,
  IconBook,
  IconSearch,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import Footer from '../components/Footer.jsx'
import EditProfileModal from '../components/EditProfileModal.jsx'
import AvailabilityManager from '../components/AvailabilityManager.jsx'
import DeleteNoteModal from '../components/DeleteNoteModal.jsx'
import { switchUserRole } from '../api/authApi.js'
import { deleteNote, getMyUploadedNotes } from '../api/noteApi.js'

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

function isUserOwnedNote(note, activeUser) {
  if (!activeUser) return true
  const userId = activeUser.id || activeUser._id
  const userName = (activeUser.name || '').trim().toLowerCase()
  const userEmail = (activeUser.email || '').trim().toLowerCase()

  // Match by author ID / user ID
  if (note.authorId && userId && String(note.authorId) === String(userId)) return true
  if (note.userId && userId && String(note.userId) === String(userId)) return true
  if (note.tutorId && userId && String(note.tutorId) === String(userId)) return true

  // Match by author Name / Email
  if (note.authorName && userName && note.authorName.trim().toLowerCase() === userName) return true
  if (note.authorEmail && userEmail && note.authorEmail.trim().toLowerCase() === userEmail) return true

  // Default authored in session / generic author
  if (note.authorName === 'Current User' || note.authorName === 'You') return true
  if (!note.authorId && !note.userId && !note.authorName) return true

  return false
}

function MyNotesSection({ notes = [], onEditNote, onDeleteNote, onUploadNew, user }) {
  const [searchQuery, setSearchQuery] = useState('')

  const userOwnedNotes = useMemo(() => {
    return (notes || []).filter((n) => isUserOwnedNote(n, user))
  }, [notes, user])

  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return userOwnedNotes
    return userOwnedNotes.filter((n) => {
      const title = (n.title || '').toLowerCase()
      const course = (n.course || n.department || '').toLowerCase()
      const type = (n.contentType || '').toLowerCase()
      const desc = (n.description || '').toLowerCase()
      return title.includes(q) || course.includes(q) || type.includes(q) || desc.includes(q)
    })
  }, [userOwnedNotes, searchQuery])

  return (
    <section aria-labelledby="my-notes-heading" className="mt-6 rounded-xl border border-surface-variant bg-surface-lowest p-6 shadow-level-1">
      {/* Clean Header: Title + Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center gap-2">
          <h3 id="my-notes-heading" className="font-display text-xl font-bold text-primary sm:text-2xl flex items-center gap-2">
            <IconFileText size={22} className="text-secondary" aria-hidden="true" />
            <span>My Notes</span>
          </h3>
          <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-xs font-bold text-on-surface-variant border border-surface-variant">
            {userOwnedNotes.length}
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Real-time search bar */}
          <div className="relative flex-1 sm:w-64">
            <IconSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-outline"
              aria-hidden="true"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search my notes..."
              aria-label="Search my notes"
              className="w-full rounded-xl border border-surface-variant bg-surface-low pl-9 pr-3 py-2 text-xs text-on-surface placeholder:text-outline focus:border-primary focus:bg-surface focus:outline-none focus:ring-1 focus:ring-primary shadow-xs transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={onUploadNew}
            className="inline-flex items-center gap-1.5 shrink-0 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-on-primary shadow-sm hover:bg-primary-container transition-all active:scale-95 cursor-pointer"
          >
            <IconPlus size={15} />
            <span>Upload</span>
          </button>
        </div>
      </div>

      {userOwnedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-variant bg-surface-low p-10 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-surface-container text-on-surface-variant mb-3 shadow-xs">
            <IconBook size={28} />
          </div>
          <h4 className="font-display text-base font-bold text-on-surface">No notes uploaded yet</h4>
          <p className="mt-1 max-w-xs text-xs text-on-surface-variant leading-relaxed">
            Share your lecture notes, formula sheets, or study guides with campus students.
          </p>
          <button
            type="button"
            onClick={onUploadNew}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-secondary-container px-4 py-2 text-xs font-bold text-on-secondary-container shadow-xs hover:brightness-105 transition-all cursor-pointer font-display"
          >
            <IconUpload size={16} />
            <span>Upload Your First Note</span>
          </button>
        </div>
      ) : filteredNotes.length === 0 ? (
        <div className="rounded-xl border border-dashed border-surface-variant bg-surface-low p-8 text-center">
          <p className="text-sm font-medium text-on-surface-variant">
            No notes found matching "{searchQuery}".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotes.map((note) => {
            const displayPrice =
              note.price || (note.numericPrice ? `${note.numericPrice} ETB` : 'Free')
            const authorDisplayName = note.authorName || user?.name || 'Current User'
            const authorDisplayAvatar =
              note.authorAvatar || user?.avatar || user?.profilePicUrl || 'https://i.pravatar.cc/150'
            const isOwner = isUserOwnedNote(note, user)

            return (
              <article
                key={note.id || note._id}
                aria-label={`Note: ${note.title}`}
                className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-surface-variant bg-surface shadow-level-1 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-level-2"
              >
                {/* Top Image Area */}
                <div className="relative h-44 w-full overflow-hidden bg-surface-low">
                  <img
                    src={note.coverImage || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80'}
                    alt={note.title || 'Note Cover'}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-full bg-surface-lowest/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
                      {note.contentType || 'NOTE'}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="rounded-xl bg-secondary-container px-3 py-1 text-sm font-black text-on-secondary-container shadow-sm font-display">
                      {displayPrice}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <div className="mb-2 inline-flex items-center gap-1 rounded-md bg-surface-high px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
                      {note.course || note.department || 'General Academic'}
                    </div>

                    <h4 className="line-clamp-2 font-display text-base font-bold leading-snug text-primary transition-colors group-hover:text-primary-container">
                      {note.title || 'Untitled Note'}
                    </h4>
                  </div>

                  {/* Author Meta Row */}
                  <div className="mt-4 flex items-center justify-between border-t border-surface-variant/60 pt-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={authorDisplayAvatar}
                        alt={authorDisplayName}
                        className="size-6 rounded-full border border-surface object-cover shadow-sm"
                      />
                      <span className="truncate text-xs font-medium text-on-surface-variant">
                        {authorDisplayName}
                      </span>
                    </div>

                    <IconCircleCheckFilled
                      size={16}
                      className="text-tertiary-container shrink-0"
                      title="Verified Contributor"
                    />
                  </div>

                  {/* Bottom Edit & Delete Actions */}
                  {isOwner && (
                    <div className="mt-3 flex items-center justify-end gap-2 border-t border-surface-variant/40 pt-3">
                      <button
                        type="button"
                        onClick={() => onEditNote(note)}
                        aria-label={`Edit ${note.title}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-surface-variant bg-surface-lowest px-3 py-1.5 text-xs font-semibold text-on-surface hover:border-primary hover:text-primary transition-colors shadow-xs cursor-pointer"
                      >
                        <IconEdit size={14} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteNote(note)}
                        aria-label={`Delete ${note.title}`}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-error/30 bg-error/10 px-3 py-1.5 text-xs font-semibold text-error hover:bg-error hover:text-white transition-colors shadow-xs cursor-pointer"
                      >
                        <IconTrash size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

export default function ProfileScreen({
  user,
  onNavigate,
  onLogout,
  onUpdateProfile,
  userNotes = [],
  onDeleteNote,
}) {
  let navigate = null
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    navigate = useNavigate()
  } catch {
    // Rendered outside Router context
  }
  const [localUser, setLocalUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [savedToast, setSavedToast] = useState('')
  const [toastType, setToastType] = useState('success')
  const [localNotes, setLocalNotes] = useState(null)
  const [noteToDelete, setNoteToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const activeUser = localUser || user || null
  const isTutor = activeUser?.role === 'tutor' || activeUser?.isTutor === true
  const notes = localNotes !== null ? localNotes : userNotes

  const showToast = (message, type = 'success') => {
    setSavedToast(message)
    setToastType(type)
    setTimeout(() => setSavedToast(''), 3000)
  }

  // Always sync own notes from the API and merge with locally added ones
  useEffect(() => {
    const userId = activeUser?._id || activeUser?.id
    if (!userId) return undefined
    let isMounted = true
    getMyUploadedNotes(userId)
      .then((res) => {
        if (!isMounted) return
        const fetched = res?.notes || res?.data || []
        setLocalNotes((prev) => {
          const base = prev !== null ? prev : userNotes || []
          const merged = [...base]
          fetched.forEach((n) => {
            const key = n.id || n._id
            if (!merged.some((m) => (m.id || m._id) === key)) merged.push(n)
          })
          return merged
        })
      })
      .catch(() => {})
    return () => {
      isMounted = false
    }
  }, [userNotes, activeUser?._id, activeUser?.id])

  const handleSaveProfile = (updatedUser) => {
    setLocalUser(updatedUser)
    setIsEditing(false)
    onUpdateProfile?.(updatedUser)
    showToast('Profile updated successfully!')
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
        setTimeout(() => setSavedToast(''), 3000)
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

  const handleEditNote = (note) => {
    if (onNavigate) {
      onNavigate('post-listing', { note })
    } else {
      navigate('/post-listing', { state: { note } })
    }
  }

  const handleUploadNew = () => {
    if (onNavigate) {
      onNavigate('post-listing')
    } else {
      navigate('/post-listing')
    }
  }

  const handleDeleteClick = (note) => {
    setNoteToDelete(note)
  }

  const handleConfirmDelete = async () => {
    if (!noteToDelete || isDeleting) return
    const id = noteToDelete.id || noteToDelete._id
    setIsDeleting(true)

    try {
      await deleteNote(id)
      setLocalNotes((prev) =>
        (prev !== null ? prev : userNotes).filter((n) => (n.id || n._id) !== id)
      )
      onDeleteNote?.(id)
      showToast('Note material deleted successfully!', 'success')
    } catch (err) {
      showToast(err?.message || 'Failed to delete note. Please try again.', 'error')
    } finally {
      setIsDeleting(false)
      setNoteToDelete(null)
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
            className={`mb-4 flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-semibold animate-in fade-in duration-200 ${
              toastType === 'error'
                ? 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
            }`}
          >
            {toastType === 'error' ? (
              <IconAlertCircleFilled size={18} />
            ) : (
              <IconCircleCheckFilled size={18} />
            )}
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

        {/* My Notes section - directly after Availability section */}
        <MyNotesSection
          notes={notes}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteClick}
          onUploadNew={handleUploadNew}
          user={activeUser}
        />

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

      {/* Delete Note Confirmation Modal */}
      <DeleteNoteModal
        isOpen={Boolean(noteToDelete)}
        note={noteToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setNoteToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  )
}
