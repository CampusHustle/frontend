export default function AuthTextField({
  label,
  type = 'text',
  value,
  onChange,
  error,
  icon,
  labelAction,
  ...rest
}) {
  const id = `auth-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-primary">
          {label}
        </label>
        {labelAction}
      </div>
      <div className="relative">
        {icon && (
          <span
            aria-hidden="true"
            className={`material-symbols-outlined pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-xl ${
              error ? 'text-error' : 'text-primary/40'
            }`}
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          aria-invalid={error ? 'true' : 'false'}
          className={`w-full rounded-lg border bg-surface-container-lowest px-4 py-3 text-base text-primary placeholder-outline-variant outline-none transition-shadow focus:ring-4 ${
            icon ? 'pl-11' : ''
          } ${
            error
              ? 'border-error focus:ring-error/15'
              : 'border-outline-variant focus:border-primary focus:ring-primary/15'
          }`}
          {...rest}
        />
      </div>
      {error && <p className="text-sm text-error">{error}</p>}
    </div>
  )
}
