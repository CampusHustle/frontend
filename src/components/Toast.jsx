const styles = {
  success: 'border-emerald-600/30 bg-emerald-50 text-emerald-700',
  error: 'border-error/30 bg-error-container/60 text-on-error-container',
}

export default function Toast({ type, message }) {
  return (
    <div
      role="status"
      data-testid={`toast-${type}`}
      className={`rounded-lg border px-4 py-3 text-sm font-medium ${styles[type] ?? styles.success}`}
    >
      {message}
    </div>
  )
}
