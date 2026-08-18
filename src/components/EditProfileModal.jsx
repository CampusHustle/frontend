import { useState, useEffect } from 'react'
import { IconX, IconSchool, IconCheck } from '@tabler/icons-react'

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
    <div className="flex min-h-[44px] flex-wrap items-center gap-1.5 rounded-lg border border-surface-variant bg-surface-low p-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 rounded-full bg-surface-high px-2.5 py-1 text-xs font-medium text-on-surface"
        >
          {tag}
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="text-on-surface-variant transition-colors hover:text-error cursor-pointer"
          >
            <IconX size={13} aria-hidden="true" />
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

export default function EditProfileModal({ isOpen, user, onClose, onSave }) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [bio, setBio] = useState('')
  const [university, setUniversity] = useState('')
  const [department, setDepartment] = useState('')
  const [year, setYear] = useState('')
  const [hourlyRate, setHourlyRate] = useState('')
  const [skillsTeaching, setSkillsTeaching] = useState([])
  const [skillsLearning, setSkillsLearning] = useState([])
  const [profilePicUrl, setProfilePicUrl] = useState('')

  // Sync state when modal opens or user changes
  useEffect(() => {
    if (user) {
      const parts = (user.name || '').split(' ')
      setFirstName(parts[0] || '')
      setLastName(parts.slice(1).join(' ') || '')
      setBio(user.bio || '')
      setUniversity(user.university || '')
      setDepartment(user.department || '')
      setYear(user.year || '')
      setHourlyRate(user.hourlyRate !== null && user.hourlyRate !== undefined ? String(user.hourlyRate) : '')
      setSkillsTeaching(Array.isArray(user.skillsTeaching) ? user.skillsTeaching : [])
      setSkillsLearning(Array.isArray(user.skillsLearning) ? user.skillsLearning : [])
      setProfilePicUrl(user.profilePicUrl || '')
    }
  }, [user, isOpen])

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

  const handleSubmit = (e) => {
    e.preventDefault()
    const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(' ')
    const updatedUser = {
      ...user,
      name: fullName || user?.name || 'Student',
      bio: bio.trim(),
      university: university.trim(),
      department: department.trim(),
      year: year,
      hourlyRate: hourlyRate ? Number(hourlyRate) : null,
      skillsTeaching,
      skillsLearning,
      profilePicUrl: profilePicUrl.trim(),
    }
    onSave(updatedUser)
    onClose()
  }

  const fieldClass =
    'w-full rounded-lg border border-surface-variant bg-surface-low px-3.5 py-2 text-sm text-on-surface transition-colors placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary'
  const labelClass = 'text-xs font-semibold text-on-surface'

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-profile-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-50/75 dark:bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200"
    >
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
              Hourly Tutoring Rate ($/hr)
            </label>
            <input
              id="edit-rate"
              type="number"
              min="0"
              step="5"
              className={fieldClass}
              placeholder="Leave empty if buying only"
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
    </div>
  )
}
