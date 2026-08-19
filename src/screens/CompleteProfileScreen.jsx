import { useState, useRef } from 'react'
import { IconCamera, IconChevronDown, IconSchool, IconUser, IconX } from '@tabler/icons-react'

function TagInput({ id, placeholder, tags, onChange }) {
  const [draft, setDraft] = useState('')

  const addTag = () => {
    const value = draft.trim()
    if (value && !tags.includes(value)) {
      onChange([...tags, value])
    }
    setDraft('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    } else if (e.key === 'Backspace' && !draft && tags.length > 0) {
      onChange(tags.slice(0, -1))
    }
  }

  return (
    <div className="flex min-h-[48px] flex-wrap items-center gap-2 rounded-lg border border-surface-highest bg-surface-bright p-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-surface-highest px-3 py-1 text-xs font-medium text-on-surface"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="text-on-surface-variant transition-colors hover:text-error"
          >
            <IconX size={14} aria-hidden="true" />
          </button>
        </span>
      ))}
      <input
        id={id}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-grow bg-transparent p-0 text-sm text-on-surface placeholder-outline focus:outline-none focus:ring-0"
      />
    </div>
  )
}

const fieldClass =
  'w-full rounded-lg border border-surface-highest bg-surface-bright px-4 py-2 text-base text-on-surface transition-colors placeholder-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'

const sectionClass = 'border-b border-surface-highest py-6'
const labelClass = 'text-sm font-semibold text-on-surface'
const headingClass = 'font-display mb-4 text-xl font-semibold text-primary'

const SCHEDULE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const SCHEDULE_TIMES = ['9:00 AM', '2:00 PM', '5:00 PM']

export default function CompleteProfileScreen({ user, onFinish }) {
  const fileInputRef = useRef(null)
  const [form, setForm] = useState(() => {
    const parts = (user?.name || '').split(' ')
    return {
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      profilePicUrl: user?.profilePicUrl || '',
      bio: user?.bio || '',
      university: user?.university || '',
      major: user?.department || user?.major || '',
      year: user?.year ? String(user.year) : '1',
      skills: user?.skillsLearning || [],
      subjects: user?.skillsTeaching || [],
      hourlyRate: user?.hourlyRate ? String(user.hourlyRate) : '',
      availability: Array.isArray(user?.availability)
        ? user.availability
        : ['Mon-9:00 AM', 'Wed-2:00 PM', 'Fri-9:00 AM'],
    }
  })

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }))
  const setTags = (field) => (tags) => setForm((f) => ({ ...f, [field]: tags }))

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setForm((f) => ({ ...f, profilePicUrl: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleSlot = (day, time) => {
    const slotKey = `${day}-${time}`
    setForm((f) => {
      const exists = f.availability.includes(slotKey)
      return {
        ...f,
        availability: exists
          ? f.availability.filter((s) => s !== slotKey)
          : [...f.availability, slotKey],
      }
    })
  }

  const selectWeekdays = () => {
    const all = []
    SCHEDULE_DAYS.slice(0, 5).forEach((day) => {
      SCHEDULE_TIMES.forEach((time) => {
        all.push(`${day}-${time}`)
      })
    })
    setForm((f) => ({ ...f, availability: all }))
  }

  const clearAvailability = () => {
    setForm((f) => ({ ...f, availability: [] }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onFinish(form)
  }

  return (
    <div className="bg-surface flex min-h-screen flex-col items-center justify-center px-4 py-12 md:px-8">
      <main className="mx-auto w-full max-w-2xl">
        <div className="mb-10 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-primary md:text-3xl">
            Complete Your Profile
          </h1>
          <p className="mt-1 text-lg text-on-surface-variant">
            {user ? `Welcome, ${user.name}. ` : ''}Set up your CampusHustle account to start
            offering services.
          </p>
        </div>

        <div className="space-y-6 rounded-xl border border-surface-highest bg-surface-lowest p-6 shadow-level-1 md:p-8">
          <form onSubmit={handleSubmit}>
            <section className={`${sectionClass} flex flex-col items-center`}>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handlePhotoUpload}
              />
              <div className="relative mb-4 size-32">
                <div className="flex size-full items-center justify-center rounded-full border-2 border-dashed border-outline-variant bg-surface-low text-outline overflow-hidden">
                  {form.profilePicUrl ? (
                    <img
                      src={form.profilePicUrl}
                      alt="Profile preview"
                      className="size-full object-cover"
                    />
                  ) : (
                    <IconUser size={40} aria-hidden="true" />
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Upload Photo"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 rounded-full bg-primary p-2 text-on-primary shadow-level-2 transition-colors hover:bg-tertiary-container cursor-pointer"
                >
                  <IconCamera size={16} aria-hidden="true" />
                </button>
              </div>
              <p className="max-w-xs text-center text-xs font-medium text-on-surface-variant">
                Upload a clear, professional headshot. High-quality photos increase trust with
                peers.
              </p>
            </section>

            <section className={`${sectionClass} space-y-4`}>
              <h2 className={headingClass}>Personal Information</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className={labelClass} htmlFor="firstName">
                    First Name
                  </label>
                  <input
                    id="firstName"
                    className={fieldClass}
                    placeholder="Daniel"
                    value={form.firstName}
                    onChange={set('firstName')}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass} htmlFor="lastName">
                    Last Name
                  </label>
                  <input
                    id="lastName"
                    className={fieldClass}
                    placeholder="Gidey"
                    value={form.lastName}
                    onChange={set('lastName')}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass} htmlFor="bio">
                  Bio
                </label>
                <textarea
                  id="bio"
                  rows="4"
                  className={`${fieldClass} resize-none`}
                  placeholder="Tell your peers a little about yourself, your academic background, and what you're passionate about..."
                  value={form.bio}
                  onChange={set('bio')}
                />
              </div>
            </section>

            <section className={`${sectionClass} space-y-4`}>
              <h2 className={headingClass}>Academic Background</h2>
              <div className="flex flex-col gap-1">
                <label className={labelClass} htmlFor="university">
                  University
                </label>
                <div className="relative">
                  <IconSchool
                    size={18}
                    className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                    aria-hidden="true"
                  />
                  <input
                    id="university"
                    className={`${fieldClass} pl-10`}
                    placeholder="Search for your university..."
                    value={form.university}
                    onChange={set('university')}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="flex flex-col gap-1">
                  <label className={labelClass} htmlFor="major">
                    Major
                  </label>
                  <input
                    id="major"
                    className={fieldClass}
                    placeholder="e.g. Computer Science"
                    value={form.major}
                    onChange={set('major')}
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className={labelClass} htmlFor="year">
                    Year of Study
                  </label>
                  <div className="relative">
                    <select
                      id="year"
                      className={`${fieldClass} appearance-none pr-8`}
                      value={form.year}
                      onChange={set('year')}
                    >
                      <option value="" disabled>
                        Select Year
                      </option>
                      <option value="freshman">Freshman</option>
                      <option value="sophomore">Sophomore</option>
                      <option value="junior">Junior</option>
                      <option value="senior">Senior</option>
                      <option value="grad">Graduate Student</option>
                    </select>
                    <IconChevronDown
                      size={18}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-outline"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className={`${sectionClass} space-y-4`}>
              <h2 className={headingClass}>Expertise</h2>
              <div className="flex flex-col gap-1">
                <label className={labelClass} htmlFor="skills">
                  Academic Skills
                </label>
                <p className="mb-1 text-sm text-on-surface-variant">Press enter to add tags.</p>
                <TagInput
                  id="skills"
                  placeholder="e.g. Essay Writing..."
                  tags={form.skills}
                  onChange={setTags('skills')}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className={labelClass} htmlFor="subjects">
                  Subjects I Can Teach
                </label>
                <TagInput
                  id="subjects"
                  placeholder="e.g. Calculus 101..."
                  tags={form.subjects}
                  onChange={setTags('subjects')}
                />
              </div>
            </section>

            <section className="space-y-4 pt-6 pb-2">
              <div className="mb-4 flex items-center justify-between">
                <h2 className={headingClass}>Tutoring Rate</h2>
                <span className="rounded-full bg-surface-container px-2 py-1 text-xs font-medium text-on-surface-variant">
                  Optional
                </span>
              </div>
              <div className="flex max-w-[200px] flex-col gap-1">
                <label className={labelClass} htmlFor="rate">
                  Hourly Rate ($)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base text-outline">
                    $
                  </span>
                  <input
                    id="rate"
                    type="number"
                    min="0"
                    step="5"
                    className={`${fieldClass} pl-8`}
                    placeholder="25"
                    value={form.hourlyRate}
                    onChange={set('hourlyRate')}
                  />
                </div>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Leave blank if you are only buying.
                </p>
              </div>
            </section>

            {/* Weekly Availability Schedule */}
            <section className={`${sectionClass} space-y-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className={headingClass}>Weekly Availability Schedule</h2>
                  <p className="text-xs text-on-surface-variant">
                    Select the days and time slots when you are available for tutoring sessions.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={selectWeekdays}
                    className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                  >
                    Weekdays
                  </button>
                  <span className="text-xs text-outline">·</span>
                  <button
                    type="button"
                    onClick={clearAvailability}
                    className="text-xs font-semibold text-outline hover:text-error cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-2 pt-2">
                {SCHEDULE_DAYS.map((day) => (
                  <div key={day} className="mb-1 text-center text-xs font-bold text-outline">
                    {day}
                  </div>
                ))}
                {SCHEDULE_TIMES.map((time) =>
                  SCHEDULE_DAYS.map((day) => {
                    const slotKey = `${day}-${time}`
                    const isSelected = form.availability.includes(slotKey)
                    return (
                      <button
                        key={slotKey}
                        type="button"
                        onClick={() => toggleSlot(day, time)}
                        aria-pressed={isSelected}
                        className={`rounded-lg p-2 text-center text-[11px] sm:text-xs font-semibold transition-all border cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-on-primary border-primary shadow-level-1'
                            : 'bg-surface-high text-on-surface-variant border-surface-highest hover:bg-surface-highest'
                        }`}
                      >
                        {time}
                      </button>
                    )
                  })
                )}
              </div>

              <div className="flex items-center gap-4 pt-1">
                <span className="flex items-center gap-1.5 text-xs text-on-surface-variant font-medium">
                  <span className="size-3 rounded-full bg-primary border border-primary" aria-hidden="true" /> Open Slot
                </span>
                <span className="flex items-center gap-1.5 text-xs text-outline">
                  <span className="size-3 rounded-full bg-surface-high border border-surface-highest" aria-hidden="true" /> Unavailable
                </span>
              </div>
            </section>

            <div className="mt-6 flex justify-end border-t border-surface-highest pt-6">
              <button
                type="submit"
                className="rounded-lg bg-secondary-container px-8 py-3 text-sm font-semibold text-on-secondary-container shadow-level-1 transition-all duration-200 hover:bg-secondary hover:text-on-secondary hover:shadow-level-2 cursor-pointer"
              >
                Finish Setup
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
