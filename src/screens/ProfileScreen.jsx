import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  IconCircleCheckFilled,
  IconStarFilled,
  IconEdit,
  IconFileText,
  IconTrash,
  IconPlus,
  IconUpload,
  IconBook,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import Footer from '../components/Footer.jsx'
import EditProfileModal from '../components/EditProfileModal.jsx'
import DeleteNoteModal from '../components/DeleteNoteModal.jsx'
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
                <IconStarFilled size={16} className="text-amber-500 dark:text-amber-400" aria-hidden="true" />
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

function MyNotesSection({ notes = [], onEditNote, onDeleteNote, onUploadNew }) {
  return (
    <section aria-labelledby="my-notes-heading" className="mt-6 rounded-xl border border-surface-variant bg-surface-lowest p-6 shadow-level-1">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-5 border-b border-surface-variant pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 id="my-notes-heading" className="font-display text-lg font-bold text-primary sm:text-xl flex items-center gap-2">
              <IconFileText size={22} className="text-secondary" aria-hidden="true" />
              <span>My Notes</span>
            </h3>
            <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-xs font-bold text-on-surface-variant border border-surface-variant">
              {notes.length}
            </span>
          </div>
          <p className="mt-1 text-xs text-on-surface-variant">
            Manage, edit, or remove your uploaded tutorial guides and study materials.
          </p>
        </div>

        <button
          type="button"
          onClick={onUploadNew}
          className="inline-flex items-center gap-1.5 self-start rounded-lg bg-primary px-3.5 py-1.5 text-xs font-semibold text-on-primary shadow-sm hover:bg-primary-container transition-all active:scale-95 sm:self-auto cursor-pointer"
        >
          <IconPlus size={15} />
          <span>Upload Material</span>
        </button>
      </div>

      {notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-variant bg-surface-low p-8 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-surface-container text-on-surface-variant mb-3">
            <IconBook size={24} />
          </div>
          <h4 className="font-display text-sm font-bold text-on-surface">No notes uploaded yet</h4>
          <p className="mt-1 max-w-xs text-xs text-on-surface-variant">
            Share your lecture notes, formula sheets, or exam prep guides with students on campus.
          </p>
          <button
            type="button"
            onClick={onUploadNew}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-secondary-container px-4 py-2 text-xs font-bold text-on-secondary-container shadow-xs hover:brightness-105 transition-all cursor-pointer font-display"
          >
            <IconUpload size={15} />
            <span>Upload Your First Note</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {notes.map((note) => {
            const displayPrice = note.price || (note.numericPrice ? `${note.numericPrice} ETB` : 'Free')
            return (
              <article
                key={note.id || note._id}
                aria-label={`Note: ${note.title}`}
                className="flex flex-col justify-between rounded-xl border border-surface-variant bg-surface p-4 shadow-xs hover:shadow-level-1 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="rounded-md bg-surface-container px-2 py-0.5 text-[10px] font-bold text-on-surface-variant border border-surface-variant uppercase tracking-wider">
                      {note.course || note.department || 'Academic'}
                    </span>
                    <span className="rounded-full bg-secondary-container/20 px-2.5 py-0.5 text-xs font-bold text-amber-500 dark:text-amber-300 border border-secondary-container/40">
                      {displayPrice}
                    </span>
                  </div>

                  <h4 className="font-display text-sm font-bold text-primary line-clamp-1 group-hover:text-primary transition-colors">
                    {note.title}
                  </h4>

                  <p className="mt-1 text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                    {note.description || `${note.contentType || 'PDF Notes'} for ${note.course || 'students'}.`}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-surface-variant/60 pt-3 gap-2">
                  <span className="text-[11px] font-medium text-outline">
                    {note.contentType || 'PDF Notes'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onEditNote(note)}
                      aria-label={`Edit ${note.title}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-surface-variant bg-surface-lowest px-2.5 py-1 text-xs font-semibold text-on-surface hover:border-primary hover:text-primary transition-colors cursor-pointer"
                    >
                      <IconEdit size={14} />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteNote(note)}
                      aria-label={`Delete ${note.title}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-error/30 bg-error/10 px-2.5 py-1 text-xs font-semibold text-error hover:bg-error hover:text-white transition-colors cursor-pointer"
                    >
                      <IconTrash size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
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
  const navigate = useNavigate()
  const [localUser, setLocalUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [savedToast, setSavedToast] = useState('')
  const [localNotes, setLocalNotes] = useState(null)
  const [noteToDelete, setNoteToDelete] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const activeUser = localUser || user || null
  const notes = localNotes !== null ? localNotes : userNotes

  // Fetch from API if no userNotes passed as prop
  useEffect(() => {
    if (!userNotes || userNotes.length === 0) {
      if (activeUser?._id || activeUser?.id) {
        let isMounted = true
        getMyUploadedNotes(activeUser._id || activeUser.id)
          .then((res) => {
            if (isMounted && (res?.notes || res?.data)) {
              setLocalNotes(res.notes || res.data)
            }
          })
          .catch(() => {})
        return () => {
          isMounted = false
        }
      }
    }
  }, [userNotes, activeUser?._id, activeUser?.id])

  const handleSaveProfile = (updatedUser) => {
    setLocalUser(updatedUser)
    setIsEditing(false)
    onUpdateProfile?.(updatedUser)
    setSavedToast('Profile updated successfully!')
    setTimeout(() => setSavedToast(''), 3000)
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
    if (!noteToDelete) return
    const id = noteToDelete.id || noteToDelete._id
    setIsDeleting(true)

    try {
      await deleteNote(id).catch(() => {})
    } catch {
      // Optimistic UI fallback
    }

    setLocalNotes((prev) => (prev !== null ? prev : userNotes).filter((n) => (n.id || n._id) !== id))
    onDeleteNote?.(id)
    setIsDeleting(false)
    setNoteToDelete(null)
    setSavedToast('Note material deleted successfully!')
    setTimeout(() => setSavedToast(''), 3000)
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

        <ProfileCard user={activeUser} />

        {/* My Uploaded Notes Section */}
        <MyNotesSection
          notes={notes}
          onEditNote={handleEditNote}
          onDeleteNote={handleDeleteClick}
          onUploadNew={handleUploadNew}
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
