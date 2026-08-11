export default function PrimaryButton({ children, loading = false, disabled = false, ...rest }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-hustle-500 px-6 py-3.5 text-base font-semibold text-ink-950 transition-[background-color,opacity,transform] duration-200 hover:bg-hustle-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-hustle-500"
      {...rest}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="size-4 animate-spin rounded-full border-2 border-ink-950/30 border-t-ink-950"
        />
      )}
      {children}
    </button>
  )
}
