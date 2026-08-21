import { useState, useRef, useEffect } from 'react'
import {
  IconBell,
  IconLogout,
  IconMessageCircle,
  IconMoon,
  IconPlus,
  IconSearch,
  IconSparkles,
  IconSun,
  IconX,
} from '@tabler/icons-react'
import { applyTheme } from '../utils/theme.js'
import {
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
} from '../api/notificationApi.js'
import { Menu, X } from 'lucide-react'
import { getUnreadMessageCount } from '../api/chatApi.js'
import { getSharedSocket } from '../services/socket.js'

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [showNotifications, setShowNotifications] = useState(false)
  const searchInputRef = useRef(null)
  const notifRef = useRef(null)

  useEffect(() => {
    if (!user) return
    let isMounted = true

    getUnreadNotificationCount()
      .then((res) => {
        if (isMounted && typeof res?.count === 'number') {
          setUnreadCount(res.count)
        }
      })
      .catch(() => {})

    getUnreadMessageCount()
      .then((res) => {
        if (isMounted && typeof res?.count === 'number') {
          setUnreadMessageCount(res.count)
        }
      })
      .catch(() => {})

    const socket = getSharedSocket()
    if (socket) {
      const handleMessageNotify = () => {
        setUnreadMessageCount((prev) => prev + 1)
      }
      const handleUnreadUpdated = () => {
        getUnreadMessageCount()
          .then((res) => {
            if (isMounted && typeof res?.count === 'number') {
              setUnreadMessageCount(res.count)
            }
          })
          .catch(() => {})
      }
      const handleNotificationNew = () => {
        setUnreadCount((prev) => prev + 1)
      }

      socket.on('message:notify', handleMessageNotify)
      socket.on('message:unread_updated', handleUnreadUpdated)
      socket.on('notification:new', handleNotificationNew)

      return () => {
        isMounted = false
        socket.off('message:notify', handleMessageNotify)
        socket.off('message:unread_updated', handleUnreadUpdated)
        socket.off('notification:new', handleNotificationNew)
      }
    }

    return () => {
      isMounted = false
    }
  }, [user])

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    if (showNotifications) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showNotifications])

  const handleToggleNotifications = async () => {
    const next = !showNotifications
    setShowNotifications(next)
    if (next) {
      try {
        const res = await getNotifications({ limit: 5 })
        if (res?.notifications) {
          setNotifications(res.notifications)
        }
      } catch {
        // Fallback demo notifications
        setNotifications([
          {
            _id: 'n-1',
            title: 'Welcome to CampusHustle',
            message: 'Your account is ready! Explore tutors or list your notes.',
            createdAt: new Date().toISOString(),
            isRead: true,
          },
        ])
      }
    }
  }

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead().catch(() => {})
      setUnreadCount(0)
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    } catch {
      setUnreadCount(0)
    }
  }

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
                placeholder={searchPlaceholder}
                className={`h-9 w-full rounded-full border border-surface-variant bg-surface-low pl-9 pr-8 text-xs text-on-surface placeholder:text-outline transition-all duration-300 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary ${
                  isSearchExpanded || searchQuery
                    ? 'opacity-100'
                    : 'pointer-events-none opacity-0'
                }`}
              />

              {(isSearchExpanded || searchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    onSearchChange('')
                    setIsSearchExpanded(false)
                  }}
                  aria-label="Clear and close search"
                  className="absolute right-2 inline-flex size-5 items-center justify-center rounded-full text-outline transition-colors hover:text-on-surface"
                >
                  <IconX size={12} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className="hidden items-center gap-6 text-sm font-medium lg:flex">
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

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden items-center gap-2 sm:gap-3 lg:flex">
            {/* Felat AI Study Workspace button */}
            <button
              type="button"
              aria-label="AI Assistant"
              onClick={() => onNavigate?.('assistant')}
              className={`inline-flex size-9 items-center justify-center rounded-full border border-outline-variant transition-colors cursor-pointer ${
                activeView === 'assistant'
                  ? 'bg-primary text-on-primary border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <IconSparkles size={18} aria-hidden="true" />
            </button>

            {/* Messages shortcut button */}
           {/* <button
              type="button"
              aria-label="Messages"
              onClick={() => onNavigate?.('chat')}
              className={`inline-flex size-9 items-center justify-center rounded-full border border-outline-variant transition-colors cursor-pointer ${
                activeView === 'chat'
                  ? 'bg-primary text-on-primary border-primary'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              <IconMessageCircle size={18} aria-hidden="true" />
            </button>*/}
          {/* Messages shortcut button */}
          <button
            type="button"
            aria-label="Messages"
            onClick={() => onNavigate?.('chat')}
            className={`relative inline-flex size-9 items-center justify-center rounded-full border border-outline-variant transition-colors cursor-pointer ${
              activeView === 'chat'
                ? 'bg-primary text-on-primary border-primary'
                : 'text-on-surface-variant hover:text-primary'
            }`}
          >
            <IconMessageCircle size={18} aria-hidden="true" />
            {unreadMessageCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-on-error shadow-sm animate-pulse">
                {unreadMessageCount > 9 ? '9+' : unreadMessageCount}
              </span>
            )}
          </button>

            <button
              type="button"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              onClick={toggleTheme}
              className="inline-flex size-9 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:text-primary cursor-pointer"
            >
              {isDark ? (
                <IconSun size={18} aria-hidden="true" />
              ) : (
                <IconMoon size={18} aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Notifications Bell */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              aria-label="Notifications"
              onClick={handleToggleNotifications}
              className="relative inline-flex size-9 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:text-primary cursor-pointer"
            >
              <IconBell size={18} aria-hidden="true" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-error text-[10px] font-bold text-on-error shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-surface-variant bg-surface-lowest p-4 shadow-level-3 dark:border-white/10 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between border-b border-surface-variant/70 pb-3">
                  <span className="font-display text-sm font-bold text-primary">Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllRead}
                      className="text-xs font-semibold text-primary hover:underline cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="mt-3 space-y-2.5 max-h-64 overflow-y-auto pr-1">
                  {notifications.length === 0 ? (
                    <p className="py-6 text-center text-xs text-on-surface-variant">
                      No notifications right now.
                    </p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n._id || n.id}
                        className={`rounded-lg p-2.5 text-xs transition-colors ${
                          n.isRead ? 'bg-surface-low text-on-surface-variant' : 'bg-primary-container/20 border border-primary/20 text-on-surface'
                        }`}
                      >
                        <p className="font-semibold text-primary">{n.title}</p>
                        <p className="mt-0.5 leading-relaxed">{n.message}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="hidden items-center gap-2 sm:gap-3 lg:flex">
            {/* Post Listing CTA Button */}
            <button
              type="button"
              onClick={() =>
                onPostListing
                  ? onPostListing()
                  : onNavigate?.('post-listing')
              }
              className="inline-flex items-center gap-1.5 rounded-lg bg-secondary-container px-3.5 py-1.5 text-xs font-bold text-on-secondary-container shadow-sm transition-all hover:brightness-105 active:scale-95 sm:text-sm cursor-pointer"
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

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            aria-label="Toggle mobile menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant transition-colors hover:text-primary cursor-pointer lg:hidden"
          >
            {isMobileMenuOpen ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-surface-variant bg-surface-lowest shadow-lg lg:hidden animate-in slide-in-from-top-2">
          <div className="flex flex-col p-4 space-y-4">
            {/* Navigation Links */}
            <div className="flex flex-col space-y-2">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setIsMobileMenuOpen(false)
                  onNavigate?.('marketplace')
                }}
                className={`p-2 text-sm font-medium rounded-lg transition-colors ${
                  activeView === 'marketplace'
                    ? 'bg-secondary-container text-on-secondary-container font-bold'
                    : 'text-on-surface-variant hover:bg-surface-low hover:text-primary'
                }`}
              >
                Marketplace
              </a>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  setIsMobileMenuOpen(false)
                  onNavigate?.('tutor')
                }}
                className={`p-2 text-sm font-medium rounded-lg transition-colors ${
                  activeView === 'tutor'
                    ? 'bg-secondary-container text-on-secondary-container font-bold'
                    : 'text-on-surface-variant hover:bg-surface-low hover:text-primary'
                }`}
              >
                Tutors
              </a>
            </div>

            <div className="h-px w-full bg-surface-variant/50" />

            {/* Actions */}
            <div className="flex flex-col space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  onNavigate?.('assistant')
                }}
                className={`flex w-full items-center gap-3 rounded-lg p-2 text-sm font-medium transition-colors ${
                  activeView === 'assistant'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:bg-surface-low hover:text-primary'
                }`}
              >
                <IconSparkles size={20} aria-hidden="true" />
                AI Assistant
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  onNavigate?.('chat')
                }}
                className={`flex w-full items-center gap-3 rounded-lg p-2 text-sm font-medium transition-colors ${
                  activeView === 'chat'
                    ? 'bg-primary text-on-primary'
                    : 'text-on-surface-variant hover:bg-surface-low hover:text-primary'
                }`}
              >
                <IconMessageCircle size={20} aria-hidden="true" />
                Messages
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  toggleTheme()
                }}
                className="flex w-full items-center gap-3 rounded-lg p-2 text-sm font-medium text-on-surface-variant transition-colors hover:bg-surface-low hover:text-primary"
              >
                {isDark ? (
                  <IconSun size={20} aria-hidden="true" />
                ) : (
                  <IconMoon size={20} aria-hidden="true" />
                )}
                {isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  onPostListing ? onPostListing() : onNavigate?.('post-listing')
                }}
                className="flex w-full items-center gap-3 rounded-lg p-2 text-sm font-bold text-primary transition-colors hover:bg-surface-low"
              >
                <IconPlus size={20} stroke={2.5} aria-hidden="true" />
                Post Listing
              </button>
            </div>

            <div className="h-px w-full bg-surface-variant/50" />

            {/* User & Logout */}
            <div className="flex items-center justify-between p-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  onNavigate?.('profile')
                }}
                className="flex items-center gap-3 text-left transition-opacity hover:opacity-80"
              >
                <Avatar user={user} className="size-9" />
                <span className="text-sm font-medium text-on-surface">
                  {user?.name || 'My Profile'}
                </span>
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    onLogout()
                  }}
                  aria-label="Log out"
                  className="flex size-9 items-center justify-center rounded-full text-error transition-colors hover:bg-error/10"
                >
                  <IconLogout size={20} aria-hidden="true" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
