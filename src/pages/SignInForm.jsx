import { useState } from 'react'
import AuthTextField from '../components/AuthTextField.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import Toast from '../components/Toast.jsx'
import TrustBadge from '../components/TrustBadge.jsx'
import { mockSignIn } from '../api/mockAuthApi.js'
import { validateEduEmail, validatePassword } from '../utils/validators.js'

export default function SignInForm({ onSwitchToSignUp }) {
  const [values, setValues] = useState({ email: '', password: '', rememberMe: false })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: null }))
  }

  const handleRememberChange = (e) => {
    setValues((v) => ({ ...v, rememberMe: e.target.checked }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nextErrors = {
      email: validateEduEmail(values.email),
      password: validatePassword(values.password),
    }
    setErrors(nextErrors)

    if (nextErrors.email || nextErrors.password) {
      setStatus('idle')
      return
    }

    setStatus('loading')
    try {
      await mockSignIn(values)
      setStatus('success')
    } catch (err) {
      setStatus('error')
      setErrors((prev) => ({
        ...prev,
        form: err?.message ?? 'Something went wrong. Please try again.',
      }))
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-outline-variant bg-surface-container-lowest p-8 shadow-xl">
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">
            Welcome Back
          </h1>
          <p className="mt-1.5 text-sm text-primary/70">
            Log in to continue to your student dashboard
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <AuthTextField
          label="University Email"
          type="email"
          icon="school"
          placeholder="student@university.edu"
          value={values.email}
          onChange={handleChange('email')}
          error={errors.email}
          autoComplete="email"
        />
        <AuthTextField
          label="Password"
          type="password"
          icon="lock"
          value={values.password}
          onChange={handleChange('password')}
          error={errors.password}
          autoComplete="current-password"
          labelAction={
            <a
              href="#"
              className="text-xs font-medium text-primary underline-offset-2 hover:underline"
            >
              Forgot password?
            </a>
          }
        />

        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <input
              id="auth-remember"
              type="checkbox"
              checked={values.rememberMe}
              onChange={handleRememberChange}
              className="size-4 rounded border-outline-variant accent-secondary-container"
            />
            <label htmlFor="auth-remember" className="text-sm font-medium text-primary">
              Remember me
            </label>
          </div>
          <TrustBadge icon="verified_user" label="SSO Enabled" />
        </div>

        {errors.form && <Toast type="error" message={errors.form} />}
        {status === 'success' && <Toast type="success" message="Signed in successfully" />}

        <PrimaryButton loading={status === 'loading'}>
          Sign In
          <span aria-hidden="true" className="material-symbols-outlined text-xl">
            arrow_forward
          </span>
        </PrimaryButton>
      </form>

      <p className="mt-6 text-center text-sm text-primary/70">
        New here?{' '}
        <button
          type="button"
          onClick={onSwitchToSignUp}
          className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
        >
          Get Started
        </button>
      </p>
    </div>
  )
}
