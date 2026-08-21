import { useEffect } from 'react'
import { IconTrash, IconX } from '@tabler/icons-react'

export default function DeleteNoteModal({ isOpen, note, onConfirm, onCancel, isDeleting = false }) {
  // Handle keyboard events (Escape to cancel)
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onCancel?.()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  // Prevent background scrolling when modal is active
  useEffect(() => {
    if (!isOpen) return
    const originalStyle = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
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
          aria-label="Close delete confirmation"
          className="absolute right-4 top-4 inline-flex size-8 items-center justify-center rounded-full text-outline hover:bg-surface-high hover:text-on-surface transition-colors cursor-pointer"
        >
          <IconX size={18} aria-hidden="true" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-error/10 text-error">
            <IconTrash size={24} stroke={2} aria-hidden="true" />
          </div>

          <h2
            id="delete-dialog-title"
            className="font-display text-lg font-bold text-on-surface"
          >
            Delete Note Material?
          </h2>

          <p
            id="delete-dialog-description"
            className="mt-2 text-sm text-on-surface-variant leading-relaxed"
          >
            Are you sure you want to delete <strong className="text-on-surface">"{note?.title || 'this note'}"</strong>? This will remove the listing from the Academic Marketplace and cannot be undone.
          </p>

          <div className="mt-6 flex w-full gap-3">
            <button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              className="flex-1 rounded-xl border border-outline-variant py-2.5 text-sm font-semibold text-on-surface hover:bg-surface-high transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-error py-2.5 text-sm font-bold text-white shadow-sm hover:bg-error/90 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <IconTrash size={16} aria-hidden="true" />
              <span>{isDeleting ? 'Deleting...' : 'Yes, Delete'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
