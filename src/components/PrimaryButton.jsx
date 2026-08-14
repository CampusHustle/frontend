export default function PrimaryButton({
  children,
  loading = false,
  disabled = false,
  className = '',
  ...rest
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary-container px-6 py-3 text-sm font-semibold text-on-secondary-container shadow-level-1 transition-all duration-200 hover:bg-secondary hover:text-on-secondary hover:shadow-level-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-secondary-container disabled:hover:text-on-secondary-container ${className}`}
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-on-secondary-container/30 border-t-on-secondary-container"
        />
      )}
      {children}
    </button>
  )
}
