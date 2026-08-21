import { useMemo, useState, useEffect } from 'react'
import {
  IconCircleCheckFilled,
  IconStarFilled,
  IconLoader2,
} from '@tabler/icons-react'
import { searchTutors, getSkillTags } from '../api/tutorApi.js'
import Footer from '../components/Footer.jsx'
import AppNavbar from '../components/AppNavbar.jsx'

const VISIBLE_STEP = 6

function initialsOf(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function Avatar({ user, className = 'w-16 h-16' }) {
  if (user?.profilePicUrl) {
    return (
      <img
        src={user.profilePicUrl}
        alt={user.name || 'Tutor avatar'}
        className={`${className} rounded-full object-cover border-2 border-surface shadow-sm`}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className={`${className} flex items-center justify-center rounded-full border-2 border-surface bg-primary-fixed text-lg font-bold text-primary shadow-sm`}
    >
      {initialsOf(user?.name || 'Student')}
    </div>
  )
}

function TutorCard({ tutor, onView }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onView(tutor)
    }
  }

  const ratingValue =
    typeof tutor.rating?.knowledge === 'number'
      ? tutor.rating.knowledge
      : typeof tutor.rating === 'number'
        ? tutor.rating
        : 5.0

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`View profile of ${tutor.name}`}
      onClick={() => onView(tutor)}
      onKeyDown={handleKeyDown}
      className="bg-surface-lowest rounded-xl shadow-level-1 hover:shadow-level-2 transition-all duration-300 border border-surface-variant p-5 flex flex-col relative overflow-hidden group cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      {/* Header Info */}
      <div className="flex gap-4 mb-4 relative z-10">
        <Avatar user={tutor} className="w-14 h-14 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 mb-1">
            <h3 className="font-display font-semibold text-lg text-on-surface truncate group-hover:text-primary transition-colors">
              {tutor.name}
            </h3>
            {tutor.isEmailVerified && (
              <IconCircleCheckFilled
                size={18}
                className="text-primary shrink-0"
                aria-label="Verified Student"
              />
            )}
          </div>
          <p className="text-xs text-outline font-medium truncate mb-2">
            {tutor.department || tutor.university}
          </p>

          <div className="flex items-center gap-1.5">
            <IconStarFilled size={14} className="text-amber-500 dark:text-amber-400" aria-hidden="true" />
            <span className="font-bold text-xs text-on-surface">
              {ratingValue.toFixed(1)}
            </span>
            <span className="text-[11px] text-outline">
              ({tutor.rating?.count ?? tutor.reviewsCount ?? 0})
            </span>
          </div>
        </div>
      </div>

      {/* Bio / Description */}
      <p className="text-xs text-on-surface-variant line-clamp-2 mb-4 relative z-10">
        {tutor.bio || 'Verified peer tutor on CampusHustle.'}
      </p>

      {/* Price & Book Action */}
      <div className="mt-auto flex justify-between items-center pt-4 border-t border-surface-variant z-10">
        <div className="text-base font-bold text-primary">
          ETB {tutor.hourlyRate || 25} <span className="text-xs text-on-surface-variant font-normal">/hr</span>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onView(tutor)
          }}
          className="border border-primary text-primary text-sm font-semibold px-4 py-1.5 rounded-lg hover:bg-primary hover:text-on-primary transition-colors cursor-pointer"
        >
          Book
        </button>
      </div>

      <div className="absolute inset-0 bg-gradient-to-br from-surface to-surface-container-lowest opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
    </div>
  )
}

export default function FindTutorScreen({ user, onLogout, onNavigate }) {
  const [query, setQuery] = useState('')
  const [selectedDepts, setSelectedDepts] = useState([])
  const [maxRate, setMaxRate] = useState(60)
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('rating')
  const [visibleCount, setVisibleCount] = useState(VISIBLE_STEP)
  const [tutorList, setTutorList] = useState([])
  const [skillTags, setSkillTags] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Fetch canonical skill tags on mount
  useEffect(() => {
    let isMounted = true
    async function loadTags() {
      try {
        const res = await getSkillTags()
        if (isMounted && res?.tags && Array.isArray(res.tags)) {
          setSkillTags(res.tags)
        }
      } catch {
        // Fallback to static tags if network is unavailable
      }
    }
    loadTags()
    return () => {
      isMounted = false
    }
  }, [])

  // Live search and filter querying
  useEffect(() => {
    let isMounted = true

    const timer = setTimeout(async () => {
      setIsLoading(true)
      try {
        const res = await searchTutors({
          q: query.trim() || undefined,
          department: selectedDepts.length === 1 ? selectedDepts[0] : undefined,
          maxPrice: maxRate < 100 ? maxRate : undefined,
          minRating: minRating > 0 ? minRating : undefined,
          sortBy: sortBy === 'Price: Low to High' ? 'price_asc' : sortBy === 'Highest Rated' ? 'rating' : 'rating',
        })

        if (isMounted && res?.tutors && Array.isArray(res.tutors) && res.tutors.length > 0) {
          const formatted = res.tutors.map((t) => ({
            ...t,
            id: t._id || t.id,
            rating: t.rating?.knowledge
              ? t.rating
              : { knowledge: 5.0, count: 1, communication: 5.0, punctuality: 5.0 },
          }))
          setTutorList(formatted)
        } else if (isMounted && res?.tutors && Array.isArray(res.tutors) && res.tutors.length === 0) {
          // Empty result from backend
          if (query || selectedDepts.length > 0) {
            setTutorList([])
          }
        }
      } catch {
        // Retain initial seed list on offline test mock
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }, 200)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [query, selectedDepts, maxRate, minRating, sortBy])

  const handleDeptToggle = (dept) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    )
    setVisibleCount(VISIBLE_STEP)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return tutorList.filter((t) => {
      const matchDept = selectedDepts.length === 0 || selectedDepts.includes(t.department)
      const hourly = typeof t.hourlyRate === 'number' ? t.hourlyRate : 0
      const matchRate = hourly <= maxRate
      const rating =
        typeof t.rating?.knowledge === 'number'
          ? t.rating.knowledge
          : typeof t.rating === 'number'
            ? t.rating
            : 5.0
      const matchRating = rating >= minRating
      const matchQuery =
        !q ||
        (t.name && t.name.toLowerCase().includes(q)) ||
        (t.university && t.university.toLowerCase().includes(q)) ||
        (t.department && t.department.toLowerCase().includes(q)) ||
        (Array.isArray(t.skillsTeaching) && t.skillsTeaching.some((s) => s.toLowerCase().includes(q)))
      return matchDept && matchRate && matchRating && matchQuery
    })
  }, [tutorList, query, selectedDepts, maxRate, minRating])

  const visibleTutors = useMemo(
    () => filtered.slice(0, visibleCount),
    [filtered, visibleCount],
  )

  const handleViewTutor = (tutor) => {
    onNavigate?.(`/tutor/${tutor.id}`)
  }

  const availableDepts = useMemo(() => {
    const depts = new Set(['Computer Science', 'Mathematics', 'Physics', 'Electrical Engineering'])
    if (Array.isArray(skillTags)) {
      skillTags.slice(0, 8).forEach((tag) => {
        depts.add(tag.charAt(0).toUpperCase() + tag.slice(1))
      })
    }
    return Array.from(depts).slice(0, 6)
  }, [skillTags])

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <AppNavbar
        user={user}
        activeView="tutor"
        onNavigate={onNavigate}
        onLogout={onLogout}
        searchQuery={query}
        onSearchChange={setQuery}
        searchPlaceholder="Search tutors, subjects..."
      />

      <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <aside className="md:col-span-3 space-y-6 hidden md:block">
          <div className="bg-surface-lowest p-6 rounded-xl shadow-level-1 border border-surface-variant">
            <h2 className="font-display text-lg font-bold text-primary mb-4">Filters</h2>

            <div className="space-y-5">
              {/* Subject Filter */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-outline mb-2">Subject</h3>
                <div className="space-y-2">
                  {availableDepts.map((dept) => (
                    <label key={dept} className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedDepts.includes(dept)}
                        onChange={() => handleDeptToggle(dept)}
                        className="rounded text-primary focus:ring-primary border-outline-variant"
                      />
                      <span className="text-sm text-on-surface-variant group-hover:text-primary transition-colors">
                        {dept}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Hourly Rate Filter */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-outline mb-2">Hourly Rate</h3>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={maxRate}
                  onChange={(e) => {
                    setMaxRate(Number(e.target.value))
                    setVisibleCount(VISIBLE_STEP)
                  }}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-xs text-outline mt-1 font-medium">
                  <span>ETB 10</span>
                  <span>ETB {maxRate === 100 ? '100+' : maxRate}</span>
                </div>
              </div>

              {/* Minimum Rating Filter */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-outline">Minimum Rating</h3>
                  {minRating > 0 && (
                    <span className="text-xs font-bold text-amber-500 dark:text-amber-400">{minRating}★ &amp; up</span>
                  )}
                </div>
                <div className="flex gap-1.5 items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      aria-label={`Filter by ${star} stars and above`}
                      onClick={() => {
                        setMinRating(minRating === star ? 0 : star)
                        setVisibleCount(VISIBLE_STEP)
                      }}
                      className="focus:outline-none transition-transform active:scale-95 hover:scale-110 cursor-pointer"
                    >
                      <IconStarFilled
                        size={22}
                        className={
                          star <= minRating
                            ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)] transition-all'
                            : 'text-surface-variant hover:text-amber-300/60 transition-colors'
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Study Plan AI Banner */}
          <div className="bg-surface-low p-5 rounded-xl border border-surface-variant text-center">
            <h3 className="font-display text-base font-bold text-primary mb-1.5">Need a study plan?</h3>
            <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">Try our AI Assistant to build a custom schedule.</p>
            <button
              type="button"
              onClick={() => onNavigate?.('assistant')}
              className="w-full bg-primary text-on-primary text-sm font-semibold py-2 rounded-lg shadow-level-1 hover:bg-primary-container transition-colors cursor-pointer"
            >
              Try AI Assistant
            </button>
          </div>
        </aside>

        {/* Tutor Grid Section */}
        <section className="md:col-span-9">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight">
                Find Tutors
              </h1>
              <p className="text-sm text-on-surface-variant mt-1 font-medium flex items-center gap-2">
                {isLoading && <IconLoader2 size={16} className="animate-spin text-primary" />}
                <span>{filtered.length} available right now</span>
              </p>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs font-medium text-outline">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-surface-lowest border border-surface-variant rounded-lg text-xs font-medium text-on-surface focus:border-primary focus:ring-1 focus:ring-primary py-1.5 px-3 cursor-pointer"
              >
                <option value="rating">Recommended</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Highest Rated">Highest Rated</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-surface-lowest rounded-xl border border-dashed border-surface-variant p-12 text-center shadow-sm">
              <h3 className="font-display text-lg font-bold text-primary">No tutors found</h3>
              <p className="text-sm text-on-surface-variant mt-1">
                Try widening your search terms or adjusting filter limits.
              </p>
              {(query || selectedDepts.length > 0) && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('')
                    setSelectedDepts([])
                    setMaxRate(100)
                    setMinRating(0)
                  }}
                  className="mt-4 inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-on-primary hover:bg-primary-container transition-colors"
                >
                  Reset Filters
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleTutors.map((tutor) => (
                <TutorCard key={tutor.id} tutor={tutor} onView={handleViewTutor} />
              ))}
            </div>
          )}

          {visibleCount < filtered.length && (
            <div className="pt-8 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + VISIBLE_STEP)}
                className="bg-surface-lowest border border-surface-variant text-primary text-sm font-semibold px-6 py-2.5 rounded-lg shadow-level-1 hover:bg-surface-low transition-colors cursor-pointer"
              >
                Load More Tutors ({filtered.length - visibleCount} remaining)
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer onNavigate={onNavigate} user={user} />
    </div>
  )
}
