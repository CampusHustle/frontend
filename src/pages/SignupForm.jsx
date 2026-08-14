import { useState } from 'react'
import {
  IconArrowRight,
  IconCircleCheckFilled,
  IconInfoCircle,
  IconKey,
  IconLock,
  IconSchool,
  IconUser,
} from '@tabler/icons-react'
import AuthTextField from '../components/AuthTextField.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import Toast from '../components/Toast.jsx'
import { mockSignup } from '../api/mockAuthApi.js'
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
} from '../utils/validators.js'

export default function SignupForm({ onSwitchToLogin, onSignupSuccess }) {
  const [values, setValues] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nextErrors = {
      name: validateName(values.name),
      email: validateEmail(values.email),
      password: validatePassword(values.password),
      confirm: validateConfirmPassword(values.password, values.confirm),
    }
    setErrors(nextErrors)

    if (Object.values(nextErrors).some((error) => error)) {
      setStatus('idle')
      return
    }

    setStatus('loading')
    try {
      const { user } = await mockSignup(values)
      setStatus('success')
      onSignupSuccess?.(user)
    } catch (err) {
      setStatus('error')
      setErrors((prev) => ({
        ...prev,
        form: err?.message ?? 'Something went wrong. Please try again.',
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
          <p className="mt-1 text-base text-on-surface-variant">Join the academic marketplace.</p>
        </div>

        <div className="glass-card relative overflow-hidden rounded-xl p-6 md:p-8">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-secondary-container/20 blur-xl"
          />

          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-1 rounded-full border border-outline-variant bg-surface-high px-3 py-1">
              <IconCircleCheckFilled size={16} className="text-primary" aria-hidden="true" />
              <span className="text-xs font-medium uppercase tracking-wider text-primary">
                Verified Students Only
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5" noValidate>
            <AuthTextField
              label="Full Name"
              icon={IconUser}
              value={values.name}
              onChange={handleChange('name')}
              error={errors.name}
              placeholder="Alex Smith"
              autoComplete="name"
            />
            <AuthTextField
              label="University Email"
              type="email"
              icon={IconSchool}
              value={values.email}
              onChange={handleChange('email')}
              error={errors.email}
              placeholder="schoolid@university.edu.et"
              hint={
                <span className="inline-flex items-center gap-1">
                  <IconInfoCircle size={14} aria-hidden="true" />
                  Must be a valid .edu.et address
                </span>
              }
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
              autoComplete="new-password"
            />
            <AuthTextField
              label="Confirm Password"
              type="password"
              icon={IconKey}
              value={values.confirm}
              onChange={handleChange('confirm')}
              error={errors.confirm}
              placeholder="••••••••"
              autoComplete="new-password"
            />

            {errors.form && <Toast type="error" message={errors.form} />}
            {status === 'success' && (
              <Toast type="success" message="Account created successfully" />
            )}

            <PrimaryButton loading={status === 'loading'} className="mt-1">
              Create Account
              <IconArrowRight size={18} aria-hidden="true" />
            </PrimaryButton>
          </form>

          <p className="mt-5 text-center text-sm text-on-surface-variant">
            By signing up, you agree to our{' '}
            <a href="#" className="text-primary underline transition-colors hover:text-secondary">
              Terms
            </a>{' '}
            and{' '}
            <a href="#" className="text-primary underline transition-colors hover:text-secondary">
              Privacy Policy
            </a>
            .
          </p>
        </div>

        <p className="mt-6 text-center text-base text-on-surface-variant">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="ml-1 text-sm font-semibold text-primary transition-colors hover:text-secondary"
          >
            Log in
          </button>
        </p>
      </main>
    </div>
  )
}
