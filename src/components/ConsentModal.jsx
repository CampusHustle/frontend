import { useEffect, useRef } from 'react'
import { IconAddressBook, IconX } from '@tabler/icons-react'

export default function ConsentModal({ isOpen, peerName, onCancel, onConfirm }) {
  const cancelBtnRef = useRef(null)
  const dialogRef = useRef(null)

  useEffect(() => {
    if (isOpen) cancelBtnRef.current?.focus()
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    function handleKey(e) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onCancel])

  useEffect(() => {
    if (!isOpen) return
    const dialog = dialogRef.current
    if (!dialog) return
    function handleTab(e) {
      if (e.key !== 'Tab') return
      const focusable = dialog.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus() }
      }
    }
    document.addEventListener('keydown', handleTab)
    return () => document.removeEventListener('keydown', handleTab)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-primary/40 px-4 backdrop-blur-sm"
      onClick={onCancel}
      aria-hidden="true"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="consent-modal-title"
        aria-describedby="consent-modal-desc"
        onClick={(e) => e.stopPropagation()}
        className="glass-card relative w-full max-w-md rounded-2xl border border-outline-variant/40 bg-surface-lowest p-6 shadow-level-3"
      >
        <button
          type="button"
          aria-label="Cancel sharing contact information"
          onClick={onCancel}
          className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container hover:text-primary"
        >
          <IconX size={17} aria-hidden="true" />
        </button>

        <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-secondary-container/20 text-secondary">
          <IconAddressBook size={26} aria-hidden="true" />
        </div>

        <h2
          id="consent-modal-title"
          className="font-display text-lg font-bold text-primary"
        >
          Share your contact information?
        </h2>

        <p
          id="consent-modal-desc"
          className="mt-2 text-sm leading-relaxed text-on-surface-variant"
        >
          Your{' '}
          <strong className="font-semibold text-on-surface">
            name, email address, and phone number
          </strong>{' '}
          will be shared with{' '}
          <strong className="font-semibold text-on-surface">{peerName}</strong> so you
          can coordinate outside the platform. Only share if you are comfortable with
          this.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={cancelBtnRef}
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-outline-variant px-5 py-2.5 text-sm font-semibold text-on-surface transition-colors hover:bg-surface-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-secondary-container px-5 py-2.5 text-sm font-semibold text-on-secondary-container shadow-level-1 transition-all hover:brightness-95 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          >
            Share contact info
          </button>
        </div>
      </div>
    </div>
  )
}
