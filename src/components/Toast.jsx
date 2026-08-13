const styles = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  error: 'border-error/20 bg-error-container text-on-error-container',
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
