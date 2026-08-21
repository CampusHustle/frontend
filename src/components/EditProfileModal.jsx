import { useState, useEffect, useRef } from 'react'
import { IconX, IconSchool, IconCheck, IconCamera, IconUser } from '@tabler/icons-react'

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
    <div className="flex min-h-[38px] flex-wrap items-center gap-1.5 rounded-lg border border-surface-variant bg-surface-low px-3 py-1.5 transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-md bg-secondary-container px-2 py-0.5 text-xs font-medium text-on-secondary-container"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="text-on-secondary-container/70 hover:text-on-secondary-container cursor-pointer"
            aria-label={`Remove ${tag}`}
          >
            <IconX size={12} />
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
        className="flex-grow bg-transparent p-0 text-xs text-on-surface placeholder:text-outline focus:outline-none"
      />
    </div>
  )
}

const SCHEDULE_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SCHEDULE_TIMES = ['9:00 AM', '2:00 PM', '5:00 PM']

function EditProfileForm({ user, onClose, onSave }) {
  const fileInputRef = useRef(null)
  const parts = (user?.name || '').split(' ')
  const [firstName, setFirstName] = useState(parts[0] || '')
  const [lastName, setLastName] = useState(parts.slice(1).join(' ') || '')
  const [gender, setGender] = useState(user?.gender || '')
  const [profilePicUrl, setProfilePicUrl] = useState(user?.profilePicUrl || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [university, setUniversity] = useState(user?.university || '')
  const [department, setDepartment] = useState(user?.department || '')
  const [year, setYear] = useState(user?.year || '')
  const [hourlyRate, setHourlyRate] = useState(
    user?.hourlyRate !== null && user?.hourlyRate !== undefined ? String(user.hourlyRate) : '',
  )
  const [skillsTeaching, setSkillsTeaching] = useState(
    Array.isArray(user?.skillsTeaching) ? user.skillsTeaching : [],
  )
  const [skillsLearning, setSkillsLearning] = useState(
    Array.isArray(user?.skillsLearning) ? user.skillsLearning : [],
  )
  const [availability, setAvailability] = useState(
    Array.isArray(user?.availability)
      ? user.availability
      : ['Mon-9:00 AM', 'Wed-2:00 PM', 'Fri-9:00 AM'],
  )

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setProfilePicUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleSlot = (day, time) => {
    const slotKey = `${day}-${time}`
    setAvailability((prev) =>
      prev.includes(slotKey) ? prev.filter((s) => s !== slotKey) : [...prev, slotKey],
    )
  }

  const selectWeekdays = () => {
    const all = []
    SCHEDULE_DAYS.slice(0, 5).forEach((day) => {
      SCHEDULE_TIMES.forEach((time) => {
        all.push(`${day}-${time}`)
      })
    })
    setAvailability(all)
  }

  const clearAvailability = () => {
    setAvailability([])
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ')
    const updatedUser = {
      ...user,
      name: fullName || user?.name || 'Student',
      gender: gender ? gender.toLowerCase().trim() : null,
      profilePicUrl: profilePicUrl || '',
      bio: bio.trim(),
      university: university.trim(),
      department: department.trim(),
      year: year,
      hourlyRate: hourlyRate ? Number(hourlyRate) : null,
      skillsTeaching,
      skillsLearning,
      availability,
    }
    onSave(updatedUser)
    onClose()
  }

  const fieldClass =
    'w-full rounded-lg border border-surface-variant bg-surface-low px-3.5 py-2 text-sm text-on-surface transition-colors placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
  const labelClass = 'text-xs font-semibold text-on-surface'

  return (
    <div className="relative w-full max-w-xl rounded-2xl border border-surface-variant bg-surface-lowest p-6 shadow-level-3 dark:border-white/10 dark:bg-surface my-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-variant/80 pb-4">
        <div>
          <h2 id="edit-profile-title" className="font-display text-xl font-bold text-primary">
            Edit Profile
          </h2>
          <p className="mt-0.5 text-xs text-on-surface-variant">
            Update your personal details, academic background, and skills.
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close edit profile modal"
          className="inline-flex size-8 items-center justify-center rounded-lg text-outline transition-colors hover:bg-surface-high hover:text-on-surface cursor-pointer"
        >
          <IconX size={18} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mt-5 space-y-4 max-h-[70vh] overflow-y-auto pr-1">
        {/* Profile Picture (PFP) Upload */}
        <div className="flex flex-col items-center pb-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoUpload}
          />
          <div className="relative size-24">
            <div className="flex size-full items-center justify-center rounded-full border-2 border-dashed border-outline-variant bg-surface-low text-outline overflow-hidden">
              {profilePicUrl ? (
                <img
                  src={profilePicUrl}
                  alt="Profile preview"
                  className="size-full object-cover"
                />
              ) : (
                <IconUser size={36} aria-hidden="true" />
              )}
            </div>
            <button
              type="button"
              aria-label="Upload Photo"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 rounded-full bg-primary p-1.5 text-on-primary shadow-level-2 transition-colors hover:bg-tertiary-container cursor-pointer"
            >
              <IconCamera size={14} aria-hidden="true" />
            </button>
          </div>
          <p className="mt-1.5 text-center text-[11px] text-on-surface-variant">
            Click the camera icon to upload a headshot.
          </p>
        </div>

        {/* Name */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="edit-firstName" className={labelClass}>
              First Name
            </label>
            <input
              id="edit-firstName"
              className={fieldClass}
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="edit-lastName" className={labelClass}>
              Last Name
            </label>
            <input
              id="edit-lastName"
              className={fieldClass}
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-1">
          <label className={labelClass}>
            Gender
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-all ${
                gender === 'male'
                  ? 'border-primary bg-primary/5 text-primary font-semibold ring-1 ring-primary'
                  : 'border-outline-variant bg-surface-lowest text-on-surface hover:bg-surface-low'
              }`}
            >
              <input
                type="radio"
                name="edit-gender"
                value="male"
                checked={gender === 'male'}
                onChange={(e) => setGender(e.target.value)}
                className="accent-primary size-3.5 cursor-pointer"
              />
              <span className="text-xs">Male</span>
            </label>
            <label
              className={`flex items-center gap-2.5 rounded-lg border p-2.5 cursor-pointer transition-all ${
                gender === 'female'
                  ? 'border-primary bg-primary/5 text-primary font-semibold ring-1 ring-primary'
                  : 'border-outline-variant bg-surface-lowest text-on-surface hover:bg-surface-low'
              }`}
            >
              <input
                type="radio"
                name="edit-gender"
                value="female"
                checked={gender === 'female'}
                onChange={(e) => setGender(e.target.value)}
                className="accent-primary size-3.5 cursor-pointer"
              />
              <span className="text-xs">Female</span>
            </label>
          </div>
        </div>

        {/* Academic Info */}
        <div className="flex flex-col gap-1">
          <label htmlFor="edit-university" className={labelClass}>
            University
          </label>
          <div className="relative">
            <IconSchool
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
              aria-hidden="true"
            />
            <input
              id="edit-university"
              className={`${fieldClass} pl-9`}
              placeholder="e.g. Addis Ababa University / MIT"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label htmlFor="edit-department" className={labelClass}>
              Department / Major
            </label>
            <input
              id="edit-department"
              className={fieldClass}
              placeholder="e.g. Computer Science"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="edit-year" className={labelClass}>
              Year of Study
            </label>
            <select
              id="edit-year"
              className={fieldClass}
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="">Select Year</option>
              <option value="freshman">Freshman</option>
              <option value="sophomore">Sophomore</option>
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
              <option value="grad">Graduate Student</option>
            </select>
          </div>
        </div>

        {/* Bio */}
        <div className="flex flex-col gap-1">
          <label htmlFor="edit-bio" className={labelClass}>
            Bio
          </label>
          <textarea
            id="edit-bio"
            rows="3"
            className={`${fieldClass} resize-none`}
            placeholder="Tell your peers about yourself and your academic passions..."
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Hourly Rate */}
        <div className="flex flex-col gap-1">
          <label htmlFor="edit-rate" className={labelClass}>
            Hourly Tutoring Rate (ETB/hr)
          </label>
          <input
            id="edit-rate"
            type="number"
            min="0"
            step="any"
            className={fieldClass}
            placeholder="e.g. 150 (leave empty if buying only)"
            value={hourlyRate}
            onChange={(e) => setHourlyRate(e.target.value)}
          />
        </div>

        {/* Skills & Subjects */}
        <div className="flex flex-col gap-1">
          <label htmlFor="edit-skillsTeaching" className={labelClass}>
            Skills I Can Offer (Press Enter to add)
          </label>
          <TagInput
            id="edit-skillsTeaching"
            placeholder="e.g. Python, Calculus..."
            tags={skillsTeaching}
            onChange={setSkillsTeaching}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="edit-skillsLearning" className={labelClass}>
            Subjects I'm Learning (Press Enter to add)
          </label>
          <TagInput
            id="edit-skillsLearning"
            placeholder="e.g. Machine Learning, Physics..."
            tags={skillsLearning}
            onChange={setSkillsLearning}
          />
        </div>

        {/* Weekly Availability Schedule */}
        <div className="flex flex-col gap-2 pt-1 border-t border-surface-variant/80">
          <div className="flex items-center justify-between">
            <div>
              <span className={labelClass}>Weekly Availability Schedule</span>
              <p className="text-[11px] text-on-surface-variant">
                Select the days and slots when students can book you.
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={selectWeekdays}
                className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
              >
                Weekdays
              </button>
              <span className="text-xs text-outline">·</span>
              <button
                type="button"
                onClick={clearAvailability}
                className="text-[11px] font-semibold text-outline hover:text-error cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1.5 pt-1">
            {SCHEDULE_DAYS.map((day) => (
              <div key={day} className="text-center text-[10px] font-bold text-outline">
                {day}
              </div>
            ))}
            {SCHEDULE_TIMES.map((time) =>
              SCHEDULE_DAYS.map((day) => {
                const slotKey = `${day}-${time}`
                const isSelected = availability.includes(slotKey)
                return (
                  <button
                    key={slotKey}
                    type="button"
                    onClick={() => toggleSlot(day, time)}
                    aria-pressed={isSelected}
                    className={`rounded-md p-1.5 text-center text-[10px] font-semibold transition-all border cursor-pointer ${
                      isSelected
                        ? 'bg-primary text-on-primary border-primary shadow-sm'
                        : 'bg-surface-low text-on-surface-variant border-surface-variant hover:bg-surface-high'
                    }`}
                  >
                    {time}
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-surface-variant/80 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-outline-variant px-4 py-2 text-sm font-semibold text-on-surface-variant transition-colors hover:border-primary hover:text-primary cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-on-primary shadow-level-1 transition-all hover:bg-primary-container active:scale-95 cursor-pointer"
          >
            <IconCheck size={16} />
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default function EditProfileModal({ isOpen, user, onClose, onSave }) {
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-50/75 dark:bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
      <EditProfileForm user={user} onClose={onClose} onSave={onSave} />
    </div>
  )
}
