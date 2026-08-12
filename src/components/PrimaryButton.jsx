export default function PrimaryButton({ children, loading = false, disabled = false, ...rest }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-secondary-container px-6 py-3.5 text-base font-semibold text-on-secondary-container shadow-md shadow-secondary-container/30 transition-[filter,transform,opacity] duration-200 hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:brightness-100"
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
