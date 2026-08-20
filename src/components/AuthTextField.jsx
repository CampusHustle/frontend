import { useState } from 'react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'

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
  const [showPassword, setShowPassword] = useState(false)
  const isPasswordField = type === 'password'
  const effectiveType = isPasswordField ? (showPassword ? 'text' : 'password') : type
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
          type={effectiveType}
          value={value}
          onChange={onChange}
          aria-invalid={error ? 'true' : 'false'}
          className={`w-full rounded-lg border bg-surface-low py-3 text-base text-on-surface placeholder-outline transition-colors focus:outline-none focus:ring-1 ${
            Icon ? 'pl-10' : 'pl-4'
          } ${isPasswordField ? 'pr-11' : 'pr-4'} ${
            error
              ? 'border-error focus:border-error focus:ring-error'
              : 'border-outline-variant focus:border-primary focus:ring-primary'
          }`}
          {...rest}
        />
        {isPasswordField && (
          <button
            type="button"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-primary transition-colors cursor-pointer"
          >
            {showPassword ? (
              <IconEyeOff size={18} aria-hidden="true" />
            ) : (
              <IconEye size={18} aria-hidden="true" />
            )}
          </button>
        )}
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
