import { useState } from 'react'
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

export default function SignupForm({ onSwitchToLogin }) {
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
      await mockSignup(values)
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
          Join the hustle
        </h1>
        <p className="mt-1.5 text-sm text-ink-300">Create your account in two minutes</p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <AuthTextField
          label="Name"
          value={values.name}
          onChange={handleChange('name')}
          error={errors.name}
          autoComplete="name"
        />
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
          autoComplete="new-password"
        />
        <AuthTextField
          label="Confirm Password"
          type="password"
          value={values.confirm}
          onChange={handleChange('confirm')}
          error={errors.confirm}
          autoComplete="new-password"
        />

        {errors.form && <Toast type="error" message={errors.form} />}
        {status === 'success' && <Toast type="success" message="Account created successfully" />}

        <PrimaryButton loading={status === 'loading'}>Sign up</PrimaryButton>
      </form>

      <p className="mt-6 text-center text-sm text-ink-300">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-hustle-500 transition-colors hover:text-hustle-400"
        >
          Log in
        </button>
      </p>
    </div>
  )
}
