import { IconLogout, IconPlus, IconSearch } from '@tabler/icons-react'

function initialsOf(name) {
  return (name || '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function Avatar({ user, className = 'size-9' }) {
  if (user?.profilePicUrl) {
    return (
      <img
        src={user.profilePicUrl}
        alt={user.name || 'User avatar'}
        className={`${className} rounded-full border-2 border-surface object-cover shadow-sm`}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className={`${className} flex items-center justify-center rounded-full border-2 border-surface bg-primary-fixed text-sm font-semibold text-primary shadow-sm`}
    >
      {initialsOf(user?.name || 'Student')}
    </div>
  )
}

export default function AppNavbar({
  user,
  activeView = 'tutor',
  onNavigate,
  onLogout,
  onPostListing,
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search...',
}) {
  return (
    <nav className="sticky top-0 z-50 bg-surface-lowest shadow-level-1">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onNavigate?.('home')
          }}
          className="font-display text-xl font-bold text-primary transition-opacity hover:opacity-80 flex items-center gap-2"
        >
          <img
            src="/assets/campushustle.jpg"
            alt="CampusHustle logo"
            className="size-8 rounded-lg object-cover"
          />
          <span>CampusHustle</span>
        </a>

        {onSearchChange !== undefined && (
          <div className="hidden max-w-md flex-1 md:block">
            <div className="relative">
              <IconSearch
                size={18}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline"
                aria-hidden="true"
              />
              <input
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg border border-surface-variant bg-surface-low py-2 pl-10 pr-4 text-sm shadow-level-1 transition-all duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-on-surface"
              />
            </div>
          </div>
        )}

        <div className="hidden items-center gap-6 text-sm font-medium md:flex">
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onNavigate?.('marketplace')
            }}
            className={
              activeView === 'marketplace'
                ? 'border-b-2 border-secondary-container pb-1 text-primary font-bold'
                : 'text-on-surface-variant transition-colors hover:text-primary'
            }
          >
            Marketplace
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onNavigate?.('tutor')
            }}
            className={
              activeView === 'tutor'
                ? 'border-b-2 border-secondary-container pb-1 text-primary font-bold'
                : 'text-on-surface-variant transition-colors hover:text-primary'
            }
          >
            Tutors
          </a>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              onNavigate?.('assistant')
            }}
            className={
              activeView === 'assistant'
                ? 'border-b-2 border-secondary-container pb-1 text-primary font-bold'
                : 'text-on-surface-variant transition-colors hover:text-primary'
            }
          >
            AI Assistant
          </a>
        </div>

        <div className="flex items-center gap-3">
          {/* Post Listing CTA Button */}
          <button
            type="button"
            onClick={() =>
              onPostListing
                ? onPostListing()
                : onNavigate?.('post-listing')
            }
            className="inline-flex items-center gap-1.5 rounded-lg bg-secondary-container px-3.5 py-1.5 text-xs font-bold text-on-secondary-container shadow-sm transition-all hover:brightness-105 active:scale-95 sm:text-sm"
          >
            <IconPlus size={16} stroke={2.5} aria-hidden="true" />
            <span>Post Listing</span>
          </button>

          <button
            type="button"
            aria-label="View my profile"
            onClick={() => onNavigate?.('profile')}
            className="flex items-center gap-2 rounded-full transition-opacity hover:opacity-80"
          >
            <Avatar user={user} className="size-9" />
            <span className="hidden text-sm font-semibold text-primary sm:inline">
              {user?.name?.split(' ')[0] ?? 'Student'}
            </span>
          </button>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              aria-label="Log out"
              className="inline-flex size-9 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:text-primary"
            >
              <IconLogout size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
