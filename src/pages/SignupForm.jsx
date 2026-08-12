import { useState } from 'react'
import AuthTextField from '../components/AuthTextField.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import Toast from '../components/Toast.jsx'
import TrustBadge from '../components/TrustBadge.jsx'
import { mockSignUp } from '../api/mockAuthApi.js'
import {
  validateUsername,
  validateEduEmail,
  validatePassword,
  validateConfirmPassword,
  validateTerms,
} from '../utils/validators.js'

export default function SignUpForm({ onSwitchToSignIn }) {
  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    confirm: '',
    terms: false,
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: null }))
  }

  const handleTermsChange = (e) => {
    setValues((v) => ({ ...v, terms: e.target.checked }))
    setErrors((prev) => ({ ...prev, terms: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const nextErrors = {
      username: validateUsername(values.username),
      email: validateEduEmail(values.email),
      password: validatePassword(values.password),
      confirm: validateConfirmPassword(values.password, values.confirm),
      terms: validateTerms(values.terms),
    }
    setErrors(nextErrors)

    if (Object.values(nextErrors).some((error) => error)) {
      setStatus('idle')
      return
    }

    setStatus('loading')
    try {
      await mockSignUp({
        username: values.username,
        email: values.email,
        password: values.password,
      })
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
        <TrustBadge icon="verified" label="Verified Students Only" />
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary">
            Create your account
          </h1>
          <p className="mt-1.5 text-sm text-primary/70">
            Sign up with your student email to start hustling
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
        <AuthTextField
          label="Username"
          icon="person"
          value={values.username}
          onChange={handleChange('username')}
          error={errors.username}
          autoComplete="username"
        />
        <AuthTextField
          label="Student Email (.edu)"
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
          autoComplete="new-password"
        />
        <AuthTextField
          label="Confirm Password"
          type="password"
          icon="lock_reset"
          value={values.confirm}
          onChange={handleChange('confirm')}
          error={errors.confirm}
          autoComplete="new-password"
        />

        <div className="flex flex-col gap-1.5">
          <div className="flex items-start gap-3">
            <input
              id="auth-terms"
              type="checkbox"
              checked={values.terms}
              onChange={handleTermsChange}
              className="mt-0.5 size-4 shrink-0 rounded border-outline-variant accent-secondary-container"
            />
            <label htmlFor="auth-terms" className="text-sm leading-relaxed text-primary/80">
              I agree to the{' '}
              <a href="#" className="font-medium text-primary underline underline-offset-2">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="font-medium text-primary underline underline-offset-2">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.terms && <p className="text-sm text-error">{errors.terms}</p>}
        </div>

        {errors.form && <Toast type="error" message={errors.form} />}
        {status === 'success' && (
          <Toast type="success" message="Account created successfully" />
        )}

        <PrimaryButton loading={status === 'loading'}>Create Account</PrimaryButton>
      </form>

      <p className="mt-6 text-center text-sm text-primary/70">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignIn}
          className="font-semibold text-primary underline underline-offset-2 hover:text-primary/80"
        >
          Login here
        </button>
      </p>
    </div>
  )
}
