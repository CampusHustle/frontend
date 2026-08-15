import { Fragment, useState } from 'react'
import { IconCheck, IconChevronDown } from '@tabler/icons-react'
import AvatarUploader from '../components/AvatarUploader.jsx'
import PrimaryButton from '../components/PrimaryButton.jsx'
import TagInput from '../components/TagInput.jsx'
import {
  validateBio,
  validateDepartment,
  validateSkills,
  validateSubjects,
  validateYear,
} from '../utils/validators.js'

const DEPARTMENTS = [
  'Computer Science',
  'Engineering',
  'Business',
  'Arts & Humanities',
  'Sciences',
]

const YEARS = ['Freshman', 'Sophomore', 'Junior', 'Senior', 'Graduate']

const SKILL_SUGGESTIONS = [
  'Essay Writing',
  'Presentation',
  'Public Speaking',
  'Note-taking',
  'Time Management',
  'Research',
]

const SUBJECT_SUGGESTIONS = [
  'Calculus',
  'Linear Algebra',
  'Data Structures',
  'Algorithms',
  'Physics',
  'Chemistry',
]

const STEPS = ['About You', 'Skills & Tutoring']

const fieldClass =
  'w-full rounded-lg border border-surface-variant bg-surface-low px-4 py-3 text-base text-on-surface transition-colors placeholder-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

const errorFieldClass = 'border-error focus:border-error focus:ring-error'
const errorClass = 'text-sm text-error'

const blurValidators = {
  department: validateDepartment,
  year: validateYear,
  bio: validateBio,
}

export default function CompleteProfileScreen({ user, onFinish }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    department: '',
    year: '',
    bio: '',
    skills: [],
    subjects: [],
    hourlyRate: '',
  })
  const [errors, setErrors] = useState({})
  const [avatarFile, setAvatarFile] = useState(null)

  const setField = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const setTags = (field) => (tags) => setForm((f) => ({ ...f, [field]: tags }))

  const validateStep = (stepToValidate) => {
    const validators = {
      1: { department: validateDepartment, year: validateYear, bio: validateBio },
      2: { skills: validateSkills, subjects: validateSubjects },
    }[stepToValidate]

    const nextErrors = {}
    Object.entries(validators).forEach(([field, validate]) => {
      const error = validate(form[field])
      if (error) nextErrors[field] = error
    })
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleBlur = (field) => () => {
    const validate = blurValidators[field]
    if (!validate) return
    const error = validate(form[field])
    setErrors((prev) => ({ ...prev, [field]: error }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (step === 1) {
      if (validateStep(1)) setStep(2)
      return
    }
    if (validateStep(2)) onFinish({ ...form, avatarFile })
  }

  return (
    <div className="bg-surface flex min-h-screen flex-col items-center justify-center px-4 py-12 md:px-8">
      <main className="mx-auto w-full max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-primary md:text-3xl">
            Set Up Your Profile
          </h1>
          <p className="mt-1 text-lg text-on-surface-variant">
            {user ? `Welcome, ${user.name}. ` : ''}Let's get you set up to hustle on CampusHustle.
          </p>
        </div>

        <div className="space-y-6 rounded-xl border border-surface-variant bg-surface-lowest p-6 shadow-level-1 md:p-8">
          <div className="flex items-center" role="group" aria-label="Progress">
            {STEPS.map((label, i) => {
              const n = i + 1
              const isCurrent = n === step
              const isDone = n < step
              return (
                <Fragment key={label}>
                  {i > 0 && (
                    <span
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        isDone ? 'bg-secondary-container' : 'bg-surface-highest'
                      }`}
                    />
                  )}
                  <div className="flex flex-col items-center gap-1.5 px-2">
                    <span
                      className={`flex size-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                        isDone
                          ? 'bg-secondary-container text-on-secondary-container'
                          : isCurrent
                            ? 'bg-primary text-on-primary'
                            : 'bg-surface-high text-on-surface-variant'
                      }`}
                    >
                      {isDone ? <IconCheck size={16} aria-hidden="true" /> : n}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        isCurrent ? 'text-primary' : 'text-on-surface-variant'
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                </Fragment>
              )
            })}
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {step === 1 ? (
              <>
                <section className="flex flex-col items-center py-6">
                  <AvatarUploader user={user} onChange={setAvatarFile} />
                </section>

                <section className="space-y-4 border-t border-surface-variant py-6">
                  <h2 className="font-display mb-2 text-xl font-semibold text-primary">
                    About You
                  </h2>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-on-surface" htmlFor="department">
                        Department
                      </label>
                      <div className="relative">
                        <select
                          id="department"
                          data-testid="department"
                          className={`${fieldClass} appearance-none pr-10 ${
                            errors.department ? errorFieldClass : ''
                          }`}
                          value={form.department}
                          onChange={setField('department')}
                          onBlur={handleBlur('department')}
                        >
                          <option value="" disabled>
                            Select department
                          </option>
                          {DEPARTMENTS.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                        <IconChevronDown
                          size={18}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline"
                          aria-hidden="true"
                        />
                      </div>
                      {errors.department && (
                        <p className={errorClass} data-testid="department-error">
                          {errors.department}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-sm font-semibold text-on-surface" htmlFor="year">
                        Year of Study
                      </label>
                      <div className="relative">
                        <select
                          id="year"
                          data-testid="year"
                          className={`${fieldClass} appearance-none pr-10 ${
                            errors.year ? errorFieldClass : ''
                          }`}
                          value={form.year}
                          onChange={setField('year')}
                          onBlur={handleBlur('year')}
                        >
                          <option value="" disabled>
                            Select year
                          </option>
                          {YEARS.map((y) => (
                            <option key={y} value={y}>
                              {y}
                            </option>
                          ))}
                        </select>
                        <IconChevronDown
                          size={18}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline"
                          aria-hidden="true"
                        />
                      </div>
                      {errors.year && (
                        <p className={errorClass} data-testid="year-error">
                          {errors.year}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-on-surface" htmlFor="bio">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      data-testid="bio"
                      rows={3}
                      maxLength={150}
                      className={`${fieldClass} resize-none ${errors.bio ? errorFieldClass : ''}`}
                      placeholder="Tell peers about yourself — your major, interests, and what you're passionate about..."
                      value={form.bio}
                      onChange={setField('bio')}
                      onBlur={handleBlur('bio')}
                    />
                    <div className="flex items-center justify-between">
                      {errors.bio ? (
                        <p className={errorClass} data-testid="bio-error">
                          {errors.bio}
                        </p>
                      ) : (
                        <p className="text-xs font-medium text-on-surface-variant">
                          A short bio helps peers get to know you.
                        </p>
                      )}
                      <span className="text-xs font-medium text-on-surface-variant">
                        {form.bio.length}/150
                      </span>
                    </div>
                  </div>
                </section>
              </>
            ) : (
              <>
                <section className="space-y-4 border-t border-surface-variant py-6">
                  <h2 className="font-display mb-2 text-xl font-semibold text-primary">
                    Skills & Tutoring
                  </h2>
                  <TagInput
                    label="Skills I Can Offer"
                    hint="Press enter to add a skill."
                    placeholder="e.g. Essay Writing"
                    suggestions={SKILL_SUGGESTIONS}
                    value={form.skills}
                    onChange={setTags('skills')}
                    error={errors.skills}
                  />
                  <TagInput
                    label="Subjects I Want to Learn"
                    hint="Press enter to add a subject."
                    placeholder="e.g. Calculus 101"
                    suggestions={SUBJECT_SUGGESTIONS}
                    value={form.subjects}
                    onChange={setTags('subjects')}
                    error={errors.subjects}
                  />
                </section>

                <section className="space-y-4 border-t border-surface-variant py-6">
                  <div className="mb-2 flex items-center justify-between">
                    <h2 className="font-display text-xl font-semibold text-primary">
                      Tutoring Rate
                    </h2>
                    <span className="rounded-full bg-surface-container px-2 py-1 text-xs font-medium text-on-surface-variant">
                      Optional
                    </span>
                  </div>
                  <div className="flex max-w-[200px] flex-col gap-1">
                    <label className="text-sm font-semibold text-on-surface" htmlFor="rate">
                      Hourly Rate ($)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline">
                        $
                      </span>
                      <input
                        id="rate"
                        data-testid="rate"
                        type="number"
                        min="0"
                        step="5"
                        className={`${fieldClass} pl-8`}
                        placeholder="25"
                        value={form.hourlyRate}
                        onChange={setField('hourlyRate')}
                      />
                    </div>
                    <p className="mt-1 text-xs font-medium text-on-surface-variant">
                      Leave blank if you are only buying.
                    </p>
                  </div>
                </section>
              </>
            )}

            <div className="flex items-center gap-4 border-t border-surface-variant pt-6">
              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="rounded-lg border border-outline-variant px-6 py-3 text-sm font-semibold text-on-surface-variant transition-colors hover:text-primary"
                >
                  Back
                </button>
              )}
              <PrimaryButton className={step === 2 ? 'flex-1' : ''}>
                {step === 1 ? 'Continue' : 'Finish Setup'}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
