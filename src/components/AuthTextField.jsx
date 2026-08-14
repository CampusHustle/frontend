export default function AuthTextField({
  label,
  type = 'text',
  value,
  onChange,
  error,
  icon: Icon,
  hint,
  ...rest
}) {
  const id = `auth-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold text-on-surface">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={18}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
            aria-hidden="true"
          />
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          aria-invalid={error ? 'true' : 'false'}
          className={`w-full rounded-lg border bg-surface-low py-3 text-base text-on-surface placeholder-outline transition-colors focus:outline-none focus:ring-1 ${
            Icon ? 'pl-10 pr-4' : 'px-4'
          } ${
            error
              ? 'border-error focus:border-error focus:ring-error'
              : 'border-outline-variant focus:border-primary focus:ring-primary'
          }`}
          {...rest}
        />
      </div>
      {error ? (
        <p className="text-sm text-error" data-testid={`${id}-error`}>
          {error}
        </p>
      ) : (
        hint && (
          <p className="text-xs font-medium text-on-surface-variant">{hint}</p>
        )
      )}
    </div>
  )
}
