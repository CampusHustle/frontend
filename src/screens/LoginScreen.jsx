import { useState } from 'react'
import { IconArrowRight, IconLock, IconMail } from '@tabler/icons-react'
import AuthTextField from '../components/AuthTextField.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import Toast from '../components/Toast.jsx'
import { loginUser } from '../api/authApi.js'
import { validateEmail, validatePassword } from '../utils/validators.js'

export default function LoginScreen({ onSwitchToSignup, onLoginSuccess }) {
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nextErrors = {
      email: validateEmail(values.email),
      password: validatePassword(values.password),
    }
    setErrors(nextErrors)

    if (nextErrors.email || nextErrors.password) {
      setStatus('idle')
      return
    }

    setStatus('loading')
    try {
      const result = await loginUser(values)
      setStatus('success')
      onLoginSuccess?.(result.user || result)
    } catch (err) {
      setStatus('error')
      const errorMessage =
        typeof err?.message === 'string'
          ? err.message
          : err?.data?.error?.message || err?.data?.message || 'Invalid email or password. Please try again.'
      setErrors((prev) => ({
        ...prev,
        form: errorMessage,
      }))
    }
  }

  return (
    <div className="mesh-bg flex min-h-screen flex-col items-center justify-center px-4 py-12 antialiased md:px-8">
      <main className="mx-auto w-full max-w-md">
        <div className="mb-10 text-center">
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary">
            CampusHustle
          </h1>
          <p className="mt-1 text-base text-on-surface-variant">Welcome back to the hustle.</p>
        </div>

        <div className="glass-card relative overflow-hidden rounded-xl p-6 md:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-secondary-container/20 blur-xl"
          />

          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5" noValidate>
            <AuthTextField
              label="Email"
              type="email"
              icon={IconMail}
              value={values.email}
              onChange={handleChange('email')}
              error={errors.email}
              placeholder="schoolid@university.edu.et"
              autoComplete="email"
            />
            <AuthTextField
              label="Password"
              type="password"
              icon={IconLock}
              value={values.password}
              onChange={handleChange('password')}
              error={errors.password}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            {errors.form && <Toast type="error" message={errors.form} />}
            {status === 'success' && (
              <Toast type="success" message="Logged in successfully" />
            )}

            <PrimaryButton loading={status === 'loading'} className="mt-1">
              Log in
              <IconArrowRight size={18} aria-hidden="true" />
            </PrimaryButton>
          </form>

          <p className="mt-4 text-center text-xs text-on-surface-variant">
            Demo account: student@campus.edu.et / password123
          </p>
        </div>

        <p className="mt-6 text-center text-base text-on-surface-variant">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignup}
            className="ml-1 text-sm font-semibold text-primary transition-colors hover:text-secondary"
          >
            Sign up
          </button>
        </p>
      </main>
    </div>
  )
}
