import { useMemo, useState } from 'react'
import {
  IconCircleCheckFilled,
  IconLogout,
  IconSearch,
  IconSparkles,
  IconStar,
} from '@tabler/icons-react'
import { tutors } from '../api/mockUsers.js'
import Footer from '../components/Footer.jsx'

const VISIBLE_STEP = 6

function initialsOf(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function overallRating(user) {
  const { knowledge, communication, punctuality } = user.rating
  return Number(((knowledge + communication + punctuality) / 3).toFixed(1))
}

function Avatar({ user, className = 'size-16' }) {
  if (user.profilePicUrl) {
    return (
      <img
        src={user.profilePicUrl}
        alt={user.name}
        className={`${className} rounded-full border-2 border-surface object-cover shadow-sm`}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className={`${className} flex items-center justify-center rounded-full border-2 border-surface bg-primary-fixed text-lg font-semibold text-primary shadow-sm`}
    >
      {initialsOf(user.name)}
    </div>
  )
}

function TutorCard({ user }) {
  const rating = overallRating(user)

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-xl border border-surface-variant bg-surface-lowest p-4 shadow-level-1 transition-shadow duration-300 hover:shadow-level-2">
      <div className="absolute right-4 top-4 z-10 flex items-center gap-1 rounded-full bg-secondary-container/10 px-2 py-1 text-xs font-medium text-secondary backdrop-blur-sm">
        <IconStar size={14} fill="currentColor" aria-hidden="true" />
        {rating.toFixed(1)}
      </div>

      <div className="relative z-10 mb-4 flex gap-4 pr-16">
        <Avatar user={user} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <h3 className="truncate font-display text-lg font-semibold text-primary">
              {user.name}
            </h3>
            <IconCircleCheckFilled
              size={16}
              className="shrink-0 text-tertiary-container"
              aria-label="Verified Student"
            />
          </div>
          <p className="truncate text-sm text-on-surface-variant">
            {user.department}, {user.university}
          </p>
        </div>
      </div>

      <div className="relative z-10 mb-4 flex flex-wrap gap-2">
        {user.skillsTeaching.map((skill) => (
          <span
            key={skill}
            className="rounded-full bg-surface-high px-3 py-1 text-xs font-medium text-on-surface-variant"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="relative z-10 mt-auto flex items-center justify-between border-t border-surface-variant pt-4">
        <div className="text-sm font-semibold text-primary">
          ${user.hourlyRate} <span className="text-sm font-normal text-on-surface-variant">/hr</span>
        </div>
        <button
          type="button"
          className="rounded-lg border border-primary px-4 py-1.5 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-on-primary"
        >
          Book
        </button>
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-surface to-surface-lowest opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
    </article>
  )
}

export default function FindTutorPage({ user, onLogout, onNavigate }) {
  const [query, setQuery] = useState('')
  const [selectedSubjects, setSelectedSubjects] = useState([])
  const [maxRate, setMaxRate] = useState(100)
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('recommended')
  const [visible, setVisible] = useState(VISIBLE_STEP)

  const subjects = useMemo(
    () => [...new Set(tutors.flatMap((tutor) => tutor.skillsTeaching))].sort(),
    [],
  )

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject) ? prev.filter((s) => s !== subject) : [...prev, subject],
    )
  }

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase()
    const matchesQuery = (tutor) =>
      !term ||
      tutor.name.toLowerCase().includes(term) ||
      tutor.university.toLowerCase().includes(term) ||
      tutor.department.toLowerCase().includes(term) ||
      tutor.skillsTeaching.some((skill) => skill.toLowerCase().includes(term))

    const matchesSubject = (tutor) =>
      selectedSubjects.length === 0 ||
      selectedSubjects.every((s) => tutor.skillsTeaching.includes(s))

    const matchesRate = (tutor) => (tutor.hourlyRate ?? Infinity) <= maxRate
    const matchesRating = (tutor) => overallRating(tutor) >= minRating

    const list = tutors.filter(
      (tutor) =>
        matchesQuery(tutor) && matchesSubject(tutor) && matchesRate(tutor) && matchesRating(tutor),
    )

    if (sortBy === 'price-asc') {
      return [...list].sort((a, b) => (a.hourlyRate ?? 0) - (b.hourlyRate ?? 0))
    }
    if (sortBy === 'rating-desc') {
      return [...list].sort((a, b) => overallRating(b) - overallRating(a))
    }
    return list
  }, [query, selectedSubjects, maxRate, minRating, sortBy])

  const shown = filtered.slice(0, visible)

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <nav className="sticky top-0 z-50 bg-surface-lowest shadow-level-1">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onNavigate?.('home')
            }}
            className="font-display text-xl font-bold text-primary transition-opacity hover:opacity-80"
          >
            CampusHustle
          </a>

          <div className="hidden max-w-md flex-1 md:block">
            <div className="relative">
              <IconSearch
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                aria-hidden="true"
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tutors, subjects..."
                className="w-full rounded-lg border border-surface-variant bg-surface-low py-2 pl-10 pr-4 text-sm shadow-level-1 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          <div className="hidden items-center gap-6 text-base md:flex">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
                onNavigate?.('home')
              }}
              className="text-on-surface-variant transition-colors hover:text-secondary"
            >
              Marketplace
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
              }}
              className="border-b-2 border-secondary-container pb-1 text-primary transition-colors hover:text-secondary"
            >
              Tutors
            </a>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault()
              }}
              className="text-on-surface-variant transition-colors hover:text-secondary"
            >
              AI Assistant
            </a>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar user={user} className="size-9" />
              <span className="hidden text-sm font-semibold text-primary sm:inline">
                {user?.name?.split(' ')[0] ?? 'Student'}
              </span>
            </div>
            <button
              type="button"
              onClick={onLogout}
              aria-label="Log out"
              className="inline-flex size-9 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:text-primary"
            >
              <IconLogout size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto grid w-full max-w-6xl flex-1 grid-cols-1 gap-6 px-4 py-6 md:grid-cols-12 md:px-8 md:py-10">
        <aside className="hidden space-y-6 md:col-span-3 md:block">
          <div className="rounded-xl border border-surface-variant bg-surface-lowest p-6 shadow-level-1">
            <h2 className="font-display mb-4 text-xl font-semibold text-primary">Filters</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-sm font-semibold text-on-surface">Subject</h3>
                <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
                  {subjects.map((subject) => (
                    <label key={subject} className="group flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedSubjects.includes(subject)}
                        onChange={() => toggleSubject(subject)}
                        className="size-4 rounded border-outline-variant accent-primary"
                      />
                      <span className="text-sm text-on-surface-variant transition-colors group-hover:text-primary">
                        {subject}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-on-surface">Hourly Rate</h3>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={maxRate}
                  onChange={(e) => setMaxRate(Number(e.target.value))}
                  className="w-full accent-primary"
                  aria-label="Maximum hourly rate"
                />
                <div className="mt-1 flex justify-between text-xs font-medium text-outline">
                  <span>$10</span>
                  <span>${maxRate === 100 ? '100+' : maxRate}</span>
                </div>
              </div>
              <div>
                <h3 className="mb-2 text-sm font-semibold text-on-surface">Minimum Rating</h3>
                <div className="flex gap-1" role="group" aria-label="Minimum rating">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      aria-label={`${value} star${value > 1 ? 's' : ''}`}
                      onClick={() => setMinRating(minRating === value ? 0 : value)}
                      className="p-0.5"
                    >
                      <IconStar
                        size={20}
                        className={
                          value <= minRating
                            ? 'text-secondary-container'
                            : 'text-surface-variant'
                        }
                        fill="currentColor"
                        aria-hidden="true"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-surface-variant bg-surface-low p-4 text-center">
            <h3 className="font-display mb-2 text-lg font-semibold text-primary">
              Need a study plan?
            </h3>
            <p className="mb-4 text-sm text-on-surface-variant">
              Try our AI Assistant to build a custom schedule.
            </p>
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2 text-sm font-semibold text-on-primary shadow-level-1 transition-colors hover:bg-primary-container"
            >
              <IconSparkles size={16} aria-hidden="true" />
              Try AI Assistant
            </button>
          </div>
        </aside>

        <section className="md:col-span-9">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h1 className="font-display text-2xl font-bold text-primary md:text-3xl">
                Find Tutors
              </h1>
              <p className="mt-1 text-base text-on-surface-variant">
                {filtered.length} available now
              </p>
            </div>
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-xs font-medium text-outline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-surface-variant bg-surface-lowest px-2 py-1 pr-8 text-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="rating-desc">Highest Rated</option>
              </select>
            </div>
          </div>

          {shown.length === 0 ? (
            <div className="rounded-xl border border-dashed border-outline-variant bg-surface-lowest p-12 text-center">
              <h3 className="font-display text-xl font-semibold text-primary">No tutors found</h3>
              <p className="mt-1 text-base text-on-surface-variant">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {shown.map((tutor) => (
                <TutorCard key={tutor.id} user={tutor} />
              ))}
            </div>
          )}

          {visible < filtered.length && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={() => setVisible((v) => v + VISIBLE_STEP)}
                className="rounded-lg border border-outline-variant bg-surface-lowest px-6 py-2 text-sm font-semibold text-primary shadow-level-1 transition-all duration-200 hover:bg-surface-low hover:shadow-level-2"
              >
                Load More Tutors
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
