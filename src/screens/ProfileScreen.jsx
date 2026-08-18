import { IconCircleCheckFilled, IconStarFilled } from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import Footer from '../components/Footer.jsx'

function initialsOf(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function Avatar({ user, className = 'size-24' }) {
  if (user?.profilePicUrl) {
    return (
      <img
        src={user.profilePicUrl}
        alt={user.name || 'Profile avatar'}
        className={`${className} rounded-full border-4 border-surface object-cover shadow-md`}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className={`${className} flex items-center justify-center rounded-full border-4 border-outline-variant bg-primary text-3xl font-bold text-on-primary shadow-md`}
    >
      {initialsOf(user?.name || 'Student')}
    </div>
  )
}

function ChipList({ items, emptyText }) {
  if (!items || items.length === 0) {
    return <p className="text-sm text-on-surface-variant">{emptyText}</p>
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-surface-high px-3 py-1 text-sm font-medium text-on-surface"
        >
          {item}
        </span>
      ))}
    </div>
  )
}

function RatingBar({ label, value, count }) {
  const pct = count > 0 ? Math.round((value / 5) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <span className="w-36 shrink-0 text-sm font-medium text-on-surface-variant">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
        <div
          className="h-full rounded-full bg-primary-container transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-10 shrink-0 text-right text-sm font-bold text-primary">
        {count > 0 ? value.toFixed(1) : '—'}
      </span>
    </div>
  )
}

function ProfileCard({ user }) {
  const rating = user?.rating || { knowledge: 0, communication: 0, punctuality: 0, count: 0 }
  const hasRatings = rating.count > 0
  const average =
    hasRatings ? (rating.knowledge + rating.communication + rating.punctuality) / 3 : 0

  return (
    <>
      <section className="rounded-xl border border-surface-variant bg-surface-lowest p-6 shadow-level-1 md:p-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          <Avatar user={user} className="size-24 shrink-0" />

          <div className="min-w-0 flex-1 text-center md:text-left">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <h2 className="font-display text-xl font-bold text-primary sm:text-2xl">
                {user?.name || 'Student'}
              </h2>
              {user?.verified && (
                <IconCircleCheckFilled
                  size={22}
                  className="shrink-0 text-tertiary-container"
                  aria-label="Verified student"
                />
              )}
            </div>

            <p className="mt-1 text-sm font-medium text-on-surface-variant">
              {[user?.department, user?.university, user?.year].filter(Boolean).join(' • ') ||
                'No academic info yet'}
            </p>
            <p className="text-sm text-on-surface-variant">{user?.email}</p>

            <p className="mt-4 text-sm leading-relaxed text-on-surface">
              {user?.bio || 'No bio yet — tell your peers a bit about yourself.'}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:justify-start">
              {user?.hourlyRate ? (
                <span className="rounded-full bg-secondary-container px-4 py-1.5 text-sm font-bold text-on-secondary-container">
                  ${user.hourlyRate} <span className="font-medium opacity-80">/hr</span>
                </span>
              ) : (
                <span className="rounded-full bg-surface-high px-4 py-1.5 text-sm font-medium text-on-surface-variant">
                  Buying only
                </span>
              )}

              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-high px-4 py-1.5 text-sm font-semibold text-on-surface">
                <IconStarFilled size={16} className="text-primary-container" aria-hidden="true" />
                {hasRatings ? `${average.toFixed(1)} (${rating.count} ratings)` : 'No ratings yet'}
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-surface-variant bg-surface-lowest p-6 shadow-level-1">
          <h3 className="font-display mb-3 text-base font-bold text-primary">
            Skills I Can Offer
          </h3>
          <ChipList items={user?.skillsTeaching} emptyText="No skills listed yet." />
        </div>
        <div className="rounded-xl border border-surface-variant bg-surface-lowest p-6 shadow-level-1">
          <h3 className="font-display mb-3 text-base font-bold text-primary">
            Subjects I'm Learning
          </h3>
          <ChipList items={user?.skillsLearning} emptyText="No subjects listed yet." />
        </div>
      </section>

      <section className="mt-6 rounded-xl border border-surface-variant bg-surface-lowest p-6 shadow-level-1">
        <h3 className="font-display mb-4 text-base font-bold text-primary">Peer Ratings</h3>
        <div className="space-y-3">
          <RatingBar label="Knowledge" value={rating.knowledge} count={rating.count} />
          <RatingBar label="Communication" value={rating.communication} count={rating.count} />
          <RatingBar label="Punctuality" value={rating.punctuality} count={rating.count} />
        </div>
        {!hasRatings && (
          <p className="mt-3 text-sm text-on-surface-variant">
            Ratings appear after peers book and review you.
          </p>
        )}
      </section>
    </>
  )
}

export default function ProfileScreen({ user, onNavigate, onLogout }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <AppNavbar
        user={user}
        activeView="profile"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-5xl flex-grow px-4 py-8 sm:px-6 md:py-10 lg:px-8">
        <header className="mb-6">
          <h1 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            My Profile
          </h1>
          <p className="mt-1 text-sm font-medium text-on-surface-variant">
            {user ? `Welcome back, ${user.name}.` : 'Your CampusHustle profile.'}
          </p>
        </header>

        <ProfileCard user={user} />

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => onNavigate?.('tutor')}
            className="rounded-lg border border-outline-variant px-6 py-2.5 text-sm font-semibold text-on-surface-variant transition-colors hover:border-primary hover:text-primary"
          >
            Back to Find Tutors
          </button>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
