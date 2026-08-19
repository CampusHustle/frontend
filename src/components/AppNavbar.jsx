import { useState, useRef } from 'react'
import { IconLogout, IconMoon, IconPlus, IconSearch, IconSun, IconX } from '@tabler/icons-react'
import { applyTheme } from '../utils/theme.js'

function getInitial(name) {
  return (name || 'Student').trim().charAt(0).toUpperCase() || 'S'
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
      className={`${className} flex items-center justify-center rounded-full border-2 border-outline-variant bg-primary text-sm font-semibold text-on-primary shadow-sm`}
    >
      {getInitial(user?.name)}
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
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark'),
  )
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const searchInputRef = useRef(null)

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev
      applyTheme(next ? 'dark' : 'light')
      return next
    })
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-surface-variant/50 bg-surface-lowest/80 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            onNavigate?.('home')
          }}
          className="font-display text-xl font-bold text-primary transition-opacity hover:opacity-80 flex items-center gap-2 shrink-0"
        >
          <img
            src="/assets/campushustle.jpg"
            alt="CampusHustle logo"
            className="size-8 rounded-lg object-cover"
          />
          <span>CampusHustle</span>
        </a>

        {onSearchChange !== undefined && (
          <div className="relative flex items-center">
            <div
              className={`relative flex items-center transition-all duration-300 ease-out ${
                isSearchExpanded || searchQuery
                  ? 'w-52 sm:w-72 md:w-80'
                  : 'w-9'
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  setIsSearchExpanded((prev) => {
                    const next = !prev
                    if (next) {
                      setTimeout(() => searchInputRef.current?.focus(), 50)
                    }
                    return next
                  })
                }}
                aria-label={isSearchExpanded || searchQuery ? 'Close search' : 'Open search'}
                className="absolute left-0 z-10 inline-flex size-9 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:text-primary cursor-pointer"
              >
                <IconSearch size={18} aria-hidden="true" />
              </button>

              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery || ''}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchExpanded(true)}
                onBlur={() => {
                  if (!searchQuery) {
                    setIsSearchExpanded(false)
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    onSearchChange('')
                    setIsSearchExpanded(false)
                  }
                }}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className={`h-9 w-full rounded-full border border-surface-variant bg-surface-low pl-9 pr-8 text-xs sm:text-sm shadow-level-1 transition-all duration-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-on-surface ${
                  isSearchExpanded || searchQuery
                    ? 'opacity-100 cursor-text'
                    : 'opacity-0 pointer-events-none border-transparent bg-transparent shadow-none'
                }`}
              />

              {(isSearchExpanded || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('')
                    setIsSearchExpanded(false)
                  }}
                  title="Clear search"
                  aria-label="Clear search"
                  className="absolute right-2.5 z-10 text-outline hover:text-primary transition-colors cursor-pointer"
                >
                  <IconX size={15} />
                </button>
              )}
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
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
            className="inline-flex size-9 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:text-primary"
          >
            {isDark ? (
              <IconSun size={18} aria-hidden="true" />
            ) : (
              <IconMoon size={18} aria-hidden="true" />
            )}
          </button>

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
            className="flex items-center rounded-full transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
          >
            <Avatar user={user} className="size-9" />
          </button>
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              aria-label="Log out"
              className="inline-flex size-9 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:text-primary cursor-pointer"
            >
              <IconLogout size={18} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}
