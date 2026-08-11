const styles = {
  success: 'border-emerald-500/40 bg-emerald-500/15 text-emerald-300',
  error: 'border-red-500/40 bg-red-500/15 text-red-300',
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
