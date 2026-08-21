import { useEffect } from 'react'
import {
  IconAlertTriangle,
  IconLogout,
  IconX,
  IconShieldCheck,
} from '@tabler/icons-react'

function getInitial(name) {
  return (name || 'Student').trim().charAt(0).toUpperCase() || 'S'
}

function UserAvatar({ user }) {
  if (user?.profilePicUrl) {
    return (
      <img
        src={user.profilePicUrl}
        alt={user.name || 'User avatar'}
        className="size-11 rounded-full border-2 border-surface dark:border-ink-200 object-cover shadow-sm"
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className="flex size-11 items-center justify-center rounded-full border-2 border-surface dark:border-ink-200 bg-primary-fixed dark:bg-primary-container text-base font-bold text-primary dark:text-primary-fixed shadow-sm"
    >
      {getInitial(user?.name)}
    </div>
  )
}

export default function LogoutWarningModal({ user, onConfirm, onCancel }) {
  // Handle keyboard events (Escape to cancel)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onCancel])

  // Prevent background scrolling when overlay is active
  useEffect(() => {
    const originalStyle = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [])

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
      aria-describedby="logout-dialog-description"
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-y-auto p-4 sm:p-6"
    >
      {/* Frosted Glass Backdrop overlapping current page */}
      <div
        className="fixed inset-0 bg-ink-50/75 backdrop-blur-md transition-opacity dark:bg-black/85"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Warning Overlay Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-surface-variant bg-surface p-6 sm:p-8 shadow-level-3 transition-all text-on-surface">
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close logout warning"
          className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-high hover:text-on-surface cursor-pointer"
        >
          <IconX size={20} aria-hidden="true" />
        </button>

        {/* Warning Icon and Glow */}
        <div className="mb-5 flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/15 text-amber-500 shadow-sm">
            <IconAlertTriangle size={30} stroke={2.2} aria-hidden="true" />
          </div>
          <div>
            <span className="inline-block rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-300">
              Session Warning
            </span>
            <h2
              id="logout-dialog-title"
              className="font-display mt-0.5 text-xl font-bold tracking-tight text-primary sm:text-2xl"
            >
              Log Out of CampusHustle?
            </h2>
          </div>
        </div>

        {/* Warning description */}
        <p
          id="logout-dialog-description"
          className="text-sm leading-relaxed text-on-surface-variant"
        >
          You are about to end your current active session. Any unsaved edits, active tutor chats,
          or draft listings you haven't published will be discarded.
        </p>

        {/* Active User Identity Info */}
        {user && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-surface-variant bg-surface-low p-3.5">
            <UserAvatar user={user} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-primary">
                {user.name || 'Campus Student'}
              </p>
              <p className="truncate text-xs text-on-surface-variant">
                {user.email || 'student@campus.edu.et'}
              </p>
              {(user.university || user.department) && (
                <p className="mt-0.5 truncate text-xs text-outline">
                  {[user.department, user.university].filter(Boolean).join(' • ')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Reassurance Checklist */}
        <div className="mt-4 rounded-xl border border-surface-variant bg-surface-low p-3 text-xs text-on-surface-variant">
          <div className="flex items-start gap-2">
            <IconShieldCheck size={16} className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true" />
            <p>
              Your published notes, active tutor bookings, and peer reviews will remain safe in your account.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto rounded-xl border border-surface-variant bg-surface px-5 py-2.5 text-sm font-semibold text-on-surface transition-all hover:bg-surface-high cursor-pointer"
          >
            Stay Logged In
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-red-600 dark:bg-red-600 hover:bg-red-700 dark:hover:bg-red-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500/40 cursor-pointer"
          >
            <IconLogout size={18} aria-hidden="true" />
            <span>Yes, Log Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
