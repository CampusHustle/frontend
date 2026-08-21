import { useEffect } from 'react'
import { IconLogout, IconX } from '@tabler/icons-react'

export default function LogoutWarningModal({ onConfirm, onCancel }) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-sm rounded-2xl border border-surface-variant/80 bg-surface p-6 shadow-level-3 animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close logout warning"
          className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full text-outline hover:bg-surface-high hover:text-on-surface transition-colors cursor-pointer"
        >
          <IconX size={18} aria-hidden="true" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-error/10 text-error">
            <IconLogout size={24} stroke={2} aria-hidden="true" />
          </div>

          <h2
            id="logout-dialog-title"
            className="font-display text-lg font-bold text-on-surface"
          >
            Log Out of CampusHustle?
          </h2>

          <p
            id="logout-dialog-description"
            className="mt-2 text-sm text-on-surface-variant leading-relaxed"
          >
            Are you sure you want to end your session? You can sign back in anytime with your university credentials.
          </p>

          <div className="mt-6 flex w-full gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 rounded-xl border border-outline-variant py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors cursor-pointer"
            >
              Stay Logged In
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-error py-2.5 text-sm font-bold text-white shadow-sm hover:bg-error/90 active:scale-95 transition-all cursor-pointer"
            >
              <IconLogout size={16} aria-hidden="true" />
              <span>Yes, Log Out</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
