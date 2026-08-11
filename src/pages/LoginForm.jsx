import { useState } from 'react'
import AuthTextField from '../components/AuthTextField.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import Toast from '../components/Toast.jsx'
import { mockLogin } from '../api/mockAuthApi.js'
import { validateEmail, validatePassword } from '../utils/validators.js'

export default function LoginForm({ onSwitchToSignup }) {
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
      await mockLogin(values)
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
    <div className="mx-auto w-full max-w-md rounded-2xl border border-white/10 bg-ink-900/70 p-8 shadow-2xl backdrop-blur">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink-50">
          Welcome back
        </h1>
        <p className="mt-1.5 text-sm text-ink-300">Log in to keep the hustle going</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <AuthTextField
          label="Email"
          type="email"
          value={values.email}
          onChange={handleChange('email')}
          error={errors.email}
          autoComplete="email"
        />
        <AuthTextField
          label="Password"
          type="password"
          value={values.password}
          onChange={handleChange('password')}
          error={errors.password}
          autoComplete="current-password"
        />

        {errors.form && <Toast type="error" message={errors.form} />}
        {status === 'success' && <Toast type="success" message="Logged in successfully" />}

        <PrimaryButton loading={status === 'loading'}>Log in</PrimaryButton>
      </form>

      <p className="mt-6 text-center text-sm text-ink-300">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-semibold text-hustle-500 transition-colors hover:text-hustle-400"
        >
          Sign up
        </button>
      </p>
    </div>
  )
}
