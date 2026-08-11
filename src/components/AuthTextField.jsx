export default function AuthTextField({ label, type = 'text', value, onChange, error, ...rest }) {
  const id = `auth-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink-200">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        aria-invalid={error ? 'true' : 'false'}
        className={`w-full rounded-lg border bg-ink-900 px-4 py-3 text-base text-ink-50 placeholder-ink-600 outline-none transition-colors focus:ring-2 ${
          error
            ? 'border-red-500/70 focus:border-red-500 focus:ring-red-500/30'
            : 'border-white/10 focus:border-hustle-500 focus:ring-hustle-500/30'
        }`}
        {...rest}
      />
      {error && (
        <p className="text-sm text-red-400" data-testid={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  )
}
