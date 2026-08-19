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
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-surface-variant/80 bg-surface-lowest p-6 sm:p-8 shadow-level-3 transition-all dark:border-white/10 dark:bg-surface dark:text-ink-950">
        {/* Top Close Button */}
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close logout warning"
          className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full text-outline transition-colors hover:bg-surface-high hover:text-on-surface dark:hover:bg-ink-200 dark:hover:text-ink-900 cursor-pointer"
        >
          <IconX size={20} aria-hidden="true" />
        </button>

        {/* Warning Icon and Glow */}
        <div className="mb-5 flex items-center gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-amber-500/30 bg-amber-500/15 text-amber-600 shadow-sm dark:border-amber-400/30 dark:bg-amber-400/20 dark:text-amber-400">
            <IconAlertTriangle size={30} stroke={2.2} aria-hidden="true" />
          </div>
          <div>
            <span className="inline-block rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-amber-700 dark:bg-amber-400/20 dark:text-amber-300">
              Session Warning
            </span>
            <h2
              id="logout-dialog-title"
              className="font-display mt-0.5 text-xl font-bold tracking-tight text-primary dark:text-ink-950 sm:text-2xl"
            >
              Log Out of CampusHustle?
            </h2>
          </div>
        </div>

        {/* Warning description */}
        <p
          id="logout-dialog-description"
          className="text-sm leading-relaxed text-on-surface-variant dark:text-ink-600"
        >
          You are about to end your current active session. Any unsaved edits, active tutor chats,
          or draft listings you haven't published will be discarded.
        </p>

        {/* Active User Identity Info */}
        {user && (
          <div className="mt-5 flex items-center gap-3 rounded-xl border border-surface-variant/70 bg-surface-low p-3.5 dark:border-ink-200/60 dark:bg-ink-100">
            <UserAvatar user={user} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-primary dark:text-ink-950">
                {user.name || 'Campus Student'}
              </p>
              <p className="truncate text-xs text-on-surface-variant dark:text-ink-600">
                {user.email || 'student@campus.edu.et'}
              </p>
              {(user.university || user.department) && (
                <p className="mt-0.5 truncate text-xs text-outline dark:text-ink-400">
                  {[user.department, user.university].filter(Boolean).join(' • ')}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Reassurance Checklist */}
        <div className="mt-4 rounded-xl border border-primary-fixed-dim/40 bg-primary-fixed/20 p-3 text-xs text-primary dark:border-primary/40 dark:bg-primary-container/30 dark:text-primary-fixed">
          <div className="flex items-start gap-2">
            <IconShieldCheck size={16} className="mt-0.5 shrink-0 text-secondary-container" aria-hidden="true" />
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
            className="w-full sm:w-auto rounded-xl border border-outline-variant/80 bg-surface-lowest px-5 py-2.5 text-sm font-semibold text-on-surface transition-all hover:bg-surface-high hover:border-outline focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-ink-300 dark:bg-ink-100 dark:text-ink-900 dark:hover:bg-ink-200 cursor-pointer"
          >
            Stay Logged In
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-error px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-error/40 cursor-pointer"
          >
            <IconLogout size={18} aria-hidden="true" />
            <span>Yes, Log Out</span>
          </button>
        </div>
      </div>
    </div>
  )
}
