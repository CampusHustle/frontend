import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ShieldCheck,
  Flag,
  Users,
  Search,
  Bell,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X,
  Menu,
  ArrowRight,
} from 'lucide-react'
import Logo from '../../components/Logo.jsx'
import { AdminThemeProvider, useAdminTheme } from '../context/AdminThemeContext'

function AdminLayoutInner({ children, verificationsCount = 48, openReportsCount = 19, onLogout, user }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { isDark, toggleTheme } = useAdminTheme()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const notificationRef = useRef(null)
  const profileMenuRef = useRef(null)

  // Click outside to dismiss popups
  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const navItems = [
    {
      id: 'overview',
      label: 'Dashboard Overview',
      path: '/admin',
      screenId: '98267591b48d48a082e9acb381f6efec',
      icon: LayoutDashboard,
    },
    {
      id: 'verifications',
      label: 'Verification Queue',
      path: '/admin/verifications',
      screenId: '8be87d2ab79f43c9b7da6ec475671d81',
      icon: ShieldCheck,
      badge: verificationsCount,
      badgeColor: isDark
        ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
        : 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      id: 'reports',
      label: 'Reports & Moderation',
      path: '/admin/reports',
      screenId: '3001f2859c3047abaaf9fff63a797bf4',
      icon: Flag,
      badge: openReportsCount,
      badgeColor: isDark
        ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
        : 'bg-rose-50 text-rose-600 border-rose-200',
    },
    {
      id: 'users',
      label: 'User Management',
      path: '/admin/users',
      screenId: '2f0a1b44a09a49fb948804e7d780c32a',
      icon: Users,
    },
  ]

  const mockNotifications = [
    {
      id: 'notif-1',
      title: 'High Severity Flagged Item',
      text: 'Exam leak report TKT-9912 requires urgent admin review.',
      time: '10m ago',
      unread: true,
    },
    {
      id: 'notif-2',
      title: 'Bulk ID Submissions',
      text: '14 new student ID verifications received from ASTU Adama.',
      time: '35m ago',
      unread: true,
    },
    {
      id: 'notif-3',
      title: 'System Security Alert',
      text: 'Automated scan cleared 45 text listings with 0 violations.',
      time: '2h ago',
      unread: false,
    },
  ]

  const isActivePath = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/'
    }
    return location.pathname.startsWith(path)
  }

  const handleSignOutClick = () => {
    setShowProfileMenu(false)
    if (onLogout) {
      onLogout()
    } else {
      navigate('/login')
    }
  }

  const activeAdminName = user?.name || 'Sarah Admin'
  const activeAdminEmail = user?.email || 'sarah.admin@campushustle.edu.et'
  const activeAdminAvatar =
    user?.profilePicUrl ||
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'

  return (
    <div
      className={`min-h-screen font-sans antialiased transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="flex h-screen overflow-hidden relative">
        {/* --- Mobile Overlay --- */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* --- Sidebar (Desktop & Mobile) --- */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-50 flex flex-col border-r transition-all duration-300 relative ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
          } ${isSidebarCollapsed ? 'w-20' : 'w-64'} ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          {/* Logo & Brand Header */}
          <div
            className={`h-16 flex items-center border-b relative transition-all ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            } ${isSidebarCollapsed ? 'justify-center px-2' : 'justify-between px-4'}`}
          >
            <Link
              to="/admin"
              className={`flex items-center gap-3 overflow-hidden min-w-0 ${
                isSidebarCollapsed ? 'justify-center' : ''
              }`}
              title="CampusHustle Admin"
            >
              <Logo className="size-9 shrink-0" />
              {!isSidebarCollapsed && (
                <div className="truncate min-w-0">
                  <span
                    className={`font-extrabold text-sm tracking-tight block truncate ${
                      isDark ? 'text-white' : 'text-slate-900'
                    }`}
                  >
                    CampusHustle
                  </span>
                  <span className="block text-[10px] font-bold text-indigo-600 uppercase tracking-widest truncate">
                    Admin Portal
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Collapse / Expand Button */}
            {!isSidebarCollapsed ? (
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                className={`hidden md:flex p-1.5 rounded-lg transition-colors shrink-0 ${
                  isDark
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="Collapse sidebar"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="hidden md:flex absolute -right-3 top-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full p-1 shadow-md border border-white/20 z-10 transition-transform hover:scale-110"
                title="Expand sidebar"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Mobile Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className={`md:hidden p-1.5 rounded-lg ${
                isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const active = isActivePath(item.path)

              return (
                <Link
                  key={item.id}
                  to={item.path}
                  data-screen-id={item.screenId}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl text-xs font-semibold transition-all relative group ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                      : isDark
                      ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
                  title={isSidebarCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 ${
                      active
                        ? 'text-white'
                        : isDark
                        ? 'text-slate-400 group-hover:text-indigo-400'
                        : 'text-slate-500 group-hover:text-indigo-600'
                    }`}
                  />
                  {!isSidebarCollapsed && <span className="truncate flex-1 font-bold">{item.label}</span>}
                  {!isSidebarCollapsed && item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  {isSidebarCollapsed && item.badge && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-white" />
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Switch to Marketplace View */}
          <div className={`p-3 border-t ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <Link
              to="/market"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isDark
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              } ${isSidebarCollapsed ? 'justify-center px-0' : ''}`}
              title={isSidebarCollapsed ? 'Marketplace View' : undefined}
            >
              <ArrowRight className="w-4 h-4 text-emerald-600 shrink-0" />
              {!isSidebarCollapsed && <span>Marketplace View</span>}
            </Link>
          </div>
        </aside>

        {/* --- Main Layout Column --- */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top Persistent Header */}
          <header
            className={`h-16 flex items-center justify-between px-4 sm:px-8 border-b z-20 backdrop-blur-md transition-colors ${
              isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white/90 border-slate-200 shadow-xs'
            }`}
          >
            {/* Mobile menu toggle & Global Search */}
            <div className="flex items-center gap-3 flex-1 max-w-xl">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className={`md:hidden p-2 rounded-xl border ${
                  isDark
                    ? 'text-slate-400 hover:text-white bg-slate-800 border-slate-700'
                    : 'text-slate-600 hover:text-slate-900 bg-slate-100 border-slate-200'
                }`}
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="relative w-full">
                <Search
                  className={`w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 ${
                    isDark ? 'text-slate-500' : 'text-slate-400'
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Global search student IDs, reports, listings, or campuses..."
                  className={`w-full pl-10 pr-12 py-2 text-xs rounded-xl border outline-none transition-all ${
                    isDark
                      ? 'bg-slate-950 border-slate-800 text-slate-200 placeholder-slate-500 focus:border-indigo-500/60 focus:ring-2 focus:ring-indigo-500/20'
                      : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-500/10'
                  }`}
                />
                <kbd
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono px-1.5 py-0.5 rounded-md border ${
                    isDark
                      ? 'bg-slate-800 border-slate-700 text-slate-400'
                      : 'bg-slate-100 border-slate-300 text-slate-500'
                  }`}
                >
                  ⌘K
                </kbd>
              </div>
            </div>

            {/* Header Right Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-xl transition-all border cursor-pointer ${
                  isDark
                    ? 'text-amber-400 hover:bg-slate-800 border-slate-800'
                    : 'text-slate-700 hover:bg-slate-100 border-slate-200 bg-white shadow-xs'
                }`}
                title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
                aria-label="Toggle Theme"
              >
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-indigo-600" />}
              </button>

              {/* Notifications Popover (with Click Outside Ref) */}
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={() => {
                    setShowNotifications((prev) => !prev)
                    setShowProfileMenu(false)
                  }}
                  className={`p-2 rounded-xl transition-colors relative border cursor-pointer ${
                    isDark
                      ? 'text-slate-400 hover:text-white hover:bg-slate-800 border-slate-800'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200 bg-white shadow-xs'
                  }`}
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-600 ring-2 ring-white animate-pulse" />
                </button>

                {showNotifications && (
                  <div
                    className={`absolute right-0 mt-3 w-80 rounded-2xl shadow-2xl p-4 z-50 border animate-in fade-in duration-150 ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div
                      className={`flex items-center justify-between border-b pb-3 mb-3 ${
                        isDark ? 'border-slate-800' : 'border-slate-100'
                      }`}
                    >
                      <h4
                        className={`text-xs font-bold flex items-center gap-1.5 ${
                          isDark ? 'text-slate-100' : 'text-slate-900'
                        }`}
                      >
                        <Bell className="w-4 h-4 text-indigo-600" /> Admin Notifications
                      </h4>
                      <span className="text-[10px] bg-indigo-50 text-indigo-600 border border-indigo-200 px-2 py-0.5 rounded-full font-bold">
                        2 New
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {mockNotifications.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl border text-xs ${
                            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <p
                            className={`font-bold flex items-center justify-between ${
                              isDark ? 'text-slate-200' : 'text-slate-800'
                            }`}
                          >
                            {n.title}
                            <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                          </p>
                          <p className={`text-[11px] mt-1 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{n.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Profile Dropdown (with Click Outside Ref) */}
              <div className="relative" ref={profileMenuRef}>
                <button
                  onClick={() => {
                    setShowProfileMenu((prev) => !prev)
                    setShowNotifications(false)
                  }}
                  className={`flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl transition-all border cursor-pointer ${
                    isDark
                      ? 'hover:bg-slate-800 border-transparent hover:border-slate-800'
                      : 'hover:bg-slate-100 border-slate-200 bg-white shadow-xs'
                  }`}
                >
                  <img
                    src={activeAdminAvatar}
                    alt={activeAdminName}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/40"
                  />
                  <div className="text-left hidden sm:block">
                    <span className={`block text-xs font-bold ${isDark ? 'text-slate-200' : 'text-slate-900'}`}>
                      {activeAdminName}
                    </span>
                    <span className="block text-[10px] text-emerald-600 font-semibold">Super Admin</span>
                  </div>
                </button>

                {showProfileMenu && (
                  <div
                    className={`absolute right-0 mt-3 w-56 rounded-2xl shadow-2xl p-2 z-50 border animate-in fade-in duration-150 text-xs ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    <div className={`p-3 border-b ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
                      <p className={`font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{activeAdminName}</p>
                      <p className="text-[11px] text-slate-500 truncate">{activeAdminEmail}</p>
                    </div>
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setShowProfileMenu(false)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-xl ${
                          isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        Account Settings
                      </Link>
                      <button
                        onClick={handleSignOutClick}
                        className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-left font-semibold cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Main Scrollable Content Area */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 space-y-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export function AdminLayout(props) {
  return (
    <AdminThemeProvider>
      <AdminLayoutInner {...props} />
    </AdminThemeProvider>
  )
}
