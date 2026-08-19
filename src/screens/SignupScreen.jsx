import { useState } from 'react'
import {
  IconArrowRight,
  IconBuildingBank,
  IconCircleCheckFilled,
  IconKey,
  IconLock,
  IconSchool,
  IconUser,
} from '@tabler/icons-react'
import AuthTextField from '../components/AuthTextField.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import Toast from '../components/Toast.jsx'
import { registerUser } from '../api/authApi.js'
import {
  validateName,
  validateEmail,
  validatePassword,
  validateConfirmPassword,
  validateUniversity,
} from '../utils/validators.js'

const ETHIOPIAN_UNIVERSITIES = [
  'Addis Ababa University',
  'Adama Science & Technology University (ASTU)',
  'Addis Ababa Science & Technology University (AASTU)',
  'Hawassa University',
  'Jimma University',
  'Bahir Dar University',
  'Mekelle University',
  'Haramaya University',
  'Arba Minch University',
  'University of Gondar',
  'Wollo University',
  'Debre Berhan University',
  'Other',
]

export default function SignupScreen({ onSwitchToLogin, onSignupSuccess, onNavigate }) {
  const [values, setValues] = useState({
    name: '',
    email: '',
    university: 'Addis Ababa University',
    customUniversity: '',
    password: '',
    confirm: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')

  const handleGoToTerms = (e) => {
    e?.preventDefault?.()
    if (onNavigate) {
      onNavigate('terms')
    }
  }

  const handleGoToPrivacy = (e) => {
    e?.preventDefault?.()
    if (onNavigate) {
      onNavigate('privacy')
    }
  }

  const handleChange = (field) => (e) => {
    setValues((v) => ({ ...v, [field]: e.target.value }))
    setErrors((prev) => ({ ...prev, [field]: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const effectiveUniversity =
      values.university === 'Other' ? values.customUniversity.trim() : values.university

    const nextErrors = {
      name: validateName(values.name),
      email: validateEmail(values.email),
      university: validateUniversity(effectiveUniversity),
      customUniversity:
        values.university === 'Other' && !values.customUniversity.trim()
          ? 'Please enter your university name'
          : null,
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
      const result = await registerUser({
        email: values.email,
        password: values.password,
        name: values.name,
        university: effectiveUniversity,
        department: values.department || '',
        year: values.year ? parseInt(values.year, 10) : 1,
        role: values.role || 'student',
      })
      const userObj = result.user || result
      setStatus('success')
      onSignupSuccess?.({
        ...userObj,
        verificationToken: result.verificationToken || userObj.verificationToken,
      })
    } catch (err) {
      setStatus('error')
      const errorMessage =
        typeof err?.message === 'string'
          ? err.message
          : err?.data?.error?.message || err?.data?.message || 'Something went wrong. Please try again.'
      setErrors((prev) => ({
        ...prev,
        form: errorMessage,
      }))
    }
  }

  return (
    <div className="mesh-bg flex min-h-screen h-full flex-col justify-center items-center px-4 py-4 sm:py-6 antialiased md:px-8">
      <main className="mx-auto w-full max-w-lg">
        <div className="mb-3 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            CampusHustle
          </h1>
          <p className="text-xs sm:text-sm text-on-surface-variant">Join the academic marketplace.</p>
        </div>

        <div className="glass-card relative overflow-hidden rounded-2xl p-5 sm:p-6 shadow-level-2">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -top-10 size-28 rounded-full bg-secondary-container/20 blur-xl"
          />

          <div className="mb-4 flex justify-center">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-outline-variant bg-surface-high px-3 py-0.5">
              <IconCircleCheckFilled size={14} className="text-primary" aria-hidden="true" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                Verified .edu.et Students
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-3" noValidate>
            {/* Name and Email 2-column or stacked */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AuthTextField
                label="Full Name"
                icon={IconUser}
                value={values.name}
                onChange={handleChange('name')}
                error={errors.name}
                placeholder="Daniel Gidey"
                autoComplete="name"
              />

              <AuthTextField
                label="University Email"
                type="email"
                icon={IconSchool}
                value={values.email}
                onChange={handleChange('email')}
                error={errors.email}
                placeholder="id@uni.edu.et"
                autoComplete="email"
              />
            </div>

            {/* University Selection */}
            <div className="flex flex-col gap-1">
              <label htmlFor="auth-university" className="text-xs font-semibold text-on-surface">
                University Name
              </label>
              <div className="relative">
                <IconBuildingBank
                  size={17}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                />
                <select
                  id="auth-university"
                  value={values.university}
                  onChange={handleChange('university')}
                  className="w-full rounded-lg border border-outline-variant bg-surface-low py-2.5 pl-9 pr-4 text-xs sm:text-sm text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {ETHIOPIAN_UNIVERSITIES.map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                </select>
              </div>
              {errors.university && (
                <p className="text-[11px] font-medium text-error">{errors.university}</p>
              )}
            </div>

            {/* If Other selected, show custom university input */}
            {values.university === 'Other' && (
              <AuthTextField
                label="Enter University Name"
                icon={IconBuildingBank}
                value={values.customUniversity}
                onChange={handleChange('customUniversity')}
                error={errors.customUniversity}
                placeholder="e.g. Dilla University"
                autoFocus
              />
            )}

            {/* Password and Confirm in 2 columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            </div>

            {errors.form && <Toast type="error" message={errors.form} />}
            {status === 'success' && (
              <Toast type="success" message="Account created successfully" />
            )}

            <PrimaryButton loading={status === 'loading'} className="mt-1 py-2.5 text-sm">
              Create Account
              <IconArrowRight size={17} aria-hidden="true" />
            </PrimaryButton>
          </form>

          <p className="mt-3 text-center text-[11px] text-on-surface-variant">
            By signing up, you agree to our{' '}
            <button
              type="button"
              onClick={handleGoToTerms}
              className="text-primary underline transition-colors hover:text-secondary font-medium"
            >
              Terms of Service
            </button>{' '}
            and{' '}
            <button
              type="button"
              onClick={handleGoToPrivacy}
              className="text-primary underline transition-colors hover:text-secondary font-medium"
            >
              Privacy Policy
            </button>
            .
          </p>
        </div>

        <p className="mt-3 text-center text-xs sm:text-sm text-on-surface-variant">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="ml-1 text-xs sm:text-sm font-semibold text-primary transition-colors hover:text-secondary"
          >
            Log in
          </button>
        </p>
      </main>
    </div>
  )
}
