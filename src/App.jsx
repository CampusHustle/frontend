import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom'
import HomeScreen from './screens/HomeScreen.jsx'
import LoginScreen from './screens/LoginScreen.jsx'
import SignupScreen from './screens/SignupScreen.jsx'
import VerifyEmailScreen from './screens/VerifyEmailScreen.jsx'
import CompleteProfileScreen from './screens/CompleteProfileScreen.jsx'
import FindTutorScreen from './screens/FindTutorScreen.jsx'
import MarketplaceScreen from './screens/MarketplaceScreen.jsx'
import ProfileScreen from './screens/ProfileScreen.jsx'
import TutorDetailScreen from './screens/TutorDetailScreen.jsx'
import PostListingScreen from './screens/PostListingScreen.jsx'
import BookingScreen from './screens/BookingScreen.jsx'
import ChatScreen from './screens/ChatScreen.jsx'
import TutorBookingRequestScreen from './screens/TutorBookingRequestScreen.jsx'
import AiChatScreen from './screens/AiChatScreen.jsx'
import TermsScreen from './screens/TermsScreen.jsx'
import PrivacyScreen from './screens/PrivacyScreen.jsx'
import NoteDetailPage from './pages/NoteDetailPage.jsx'
import NotePaymentPage from './pages/NotePaymentPage.jsx'
import LogoutWarningModal from './components/LogoutWarningModal.jsx'
import FloatingAiAssistant from './components/FloatingAiAssistant.jsx'
import { AdminLayout } from './admin/components/AdminLayout.jsx'
import DashboardOverviewScreen from './admin/screens/DashboardOverviewScreen.jsx'
import VerificationQueueScreen from './admin/screens/VerificationQueueScreen.jsx'
import ReportsModerationScreen from './admin/screens/ReportsModerationScreen.jsx'
import ReportDetailScreen from './admin/screens/ReportDetailScreen.jsx'
import UserManagementScreen from './admin/screens/UserManagementScreen.jsx'
import {
  logoutUser,
  updateCurrentUserProfile,
  getCurrentUserProfile,
} from './api/authApi.js'
import {
  clearSession,
  loadSessionUser,
  saveSessionUser,
  saveSessionView,
  getAccessToken,
} from './utils/session.js'
import { profileFromForm, hasCompletedProfile } from './utils/user.js'

export function AppRoutes() {
  const navigate = useNavigate()
  const [availableTutorials, setAvailableTutorials] = useState([])

  const handleAddNote = (newNote) => {
    setAvailableTutorials((prev) => [newNote, ...prev])
  }

  const handleUpdateNote = (updatedNote) => {
    setAvailableTutorials((prev) =>
      prev.map((item) =>
        (item.id || item._id) === (updatedNote.id || updatedNote._id) ? updatedNote : item
      )
    )
  }

  const handleDeleteNote = (noteId) => {
    setAvailableTutorials((prev) =>
      prev.filter((item) => (item.id || item._id) !== noteId)
    )
  }
  const location = useLocation()
  const [currentUser, setCurrentUser] = useState(() => loadSessionUser())
  const [pendingUser, setPendingUser] = useState(null)
  const [pendingEmail, setPendingEmail] = useState('')
  const [pendingVerificationToken, setPendingVerificationToken] = useState('')
  const [showLogoutWarning, setShowLogoutWarning] = useState(false)

  useEffect(() => {
    if (getAccessToken()) {
      getCurrentUserProfile()
        .then((res) => {
          if (res?.user) setCurrentUser(res.user)
        })
        .catch(() => { })
    }
  }, [])

  const handleNavigate = (targetView, context = {}) => {
    if (context && Object.keys(context).length > 0) {
      window.dispatchEvent(new CustomEvent('open-ai-assistant', { detail: context }))
    }
    const routeMap = {
      home: '/',
      login: '/login',
      signup: '/signup',
      'verify-email': '/verify-email',
      'complete-profile': '/complete-profile',
      'find-tutor': '/tutor',
      tutor: '/tutor',
      marketplace: '/market',
      market: '/market',
      profile: '/profile',
      'post-listing': '/post-listing',
      bookings: '/bookings',
      chat: '/chat',
      'tutor-requests': '/tutor-requests',
      assistant: '/assistant',
      ai: '/assistant',
      'ai-chat': '/assistant',
      terms: '/terms',
      privacy: '/privacy',
    }
    const path =
      routeMap[targetView] ||
      (typeof targetView === 'string' && targetView.startsWith('/') ? targetView : '/')
    saveSessionView(targetView)
    navigate(path)
  }

  const handleLogout = () => setShowLogoutWarning(true)
  const handleCancelLogout = () => setShowLogoutWarning(false)

  const handleConfirmLogout = () => {
    setShowLogoutWarning(false)
    logoutUser().catch(() => { })
    clearSession()
    setCurrentUser(null)
    setPendingUser(null)
    handleNavigate('home')
  }

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser)
    saveSessionUser(updatedUser)
    updateCurrentUserProfile(updatedUser).catch(() => { })
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<HomeScreen onNavigate={handleNavigate} />} />
        <Route path="/terms" element={<TermsScreen onNavigate={handleNavigate} />} />
        <Route path="/privacy" element={<PrivacyScreen onNavigate={handleNavigate} />} />

        <Route
          path="/login"
          element={
            <LoginScreen
              onSwitchToSignup={() => handleNavigate('signup')}
              onLoginSuccess={(user) => {
                saveSessionUser(user)
                setCurrentUser(user)
                if (hasCompletedProfile(user)) {
                  handleNavigate('tutor')
                } else {
                  handleNavigate('complete-profile')
                }
              }}
            />
          }
        />

        <Route
          path="/signup"
          element={
            <SignupScreen
              onSwitchToLogin={() => handleNavigate('login')}
              onNavigate={handleNavigate}
              onSignupSuccess={(user) => {
                setPendingUser(user)
                setPendingEmail(user.email)
                setPendingVerificationToken(user.verificationToken || '')
                handleNavigate('verify-email')
              }}
            />
          }
        />

        <Route
          path="/verify-email"
          element={
            <VerifyEmailScreen
              email={pendingEmail || currentUser?.email || 'student@campus.edu.et'}
              devToken={pendingVerificationToken}
              onBackToLogin={() => handleNavigate('login')}
              onVerificationSuccess={() => handleNavigate('login')}
            />
          }
        />

        <Route
          path="/complete-profile"
          element={
            <CompleteProfileScreen
              user={currentUser || pendingUser}
              onFinish={async (form) => {
                const profile = profileFromForm(form)
                const active = currentUser || pendingUser || {}
                const updated = { ...active, ...profile }
                setCurrentUser(updated)
                saveSessionUser(updated)
                try {
                  const res = await updateCurrentUserProfile(profile)
                  if (res?.user) {
                    setCurrentUser(res.user)
                    saveSessionUser(res.user)
                  }
                } catch {
                  // proceed with local state on API failure
                }
                handleNavigate('tutor')
              }}
            />
          }
        />

        <Route
          path="/tutor"
          element={
            <FindTutorScreen
              user={currentUser}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
            />
          }
        />
        <Route
          path="/tutor/:id"
          element={
            <TutorDetailScreen
              user={currentUser}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
            />
          }
        />

        <Route
          path="/market"
          element={
            <MarketplaceScreen
              user={currentUser}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
              availableTutorials={availableTutorials}
            />
          }
        />

        <Route
          path="/notes/:id"
          element={
            <NoteDetailPage
              user={currentUser}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          }
        />

        <Route
          path="/notes/:id/payment"
          element={
            <NotePaymentPage
              user={currentUser}
              onNavigate={handleNavigate}
              onLogout={handleLogout}
            />
          }
        />

        <Route
          path="/profile"
          element={
            <ProfileScreen
              user={currentUser}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
              onUpdateProfile={handleUpdateProfile}
              userNotes={availableTutorials}
              onDeleteNote={handleDeleteNote}
            />
          }
        />

        <Route
          path="/post-listing"
          element={
            <PostListingScreen
              user={currentUser}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
              onAddNote={handleAddNote}
              onUpdateNote={handleUpdateNote}
            />
          }
        />

        <Route
          path="/bookings"
          element={
            <BookingScreen
              user={currentUser}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
            />
          }
        />

        <Route
          path="/chat"
          element={
            <ChatScreen
              user={currentUser}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
            />
          }
        />

        <Route
          path="/chat/:id"
          element={
            <ChatScreen
              user={currentUser}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
            />
          }
        />

        <Route
          path="/tutor-requests"
          element={
            <TutorBookingRequestScreen
              user={currentUser}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
            />
          }
        />

        <Route
          path="/assistant"
          element={
            <AiChatScreen
              user={currentUser}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
            />
          }
        />

        <Route
          path="/ai"
          element={
            <AiChatScreen
              user={currentUser}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
            />
          }
        />

        <Route
          path="/admin"
          element={<AdminLayout user={currentUser} onNavigate={handleNavigate} onLogout={handleLogout} />}
        >
          <Route index element={<DashboardOverviewScreen />} />
          <Route path="users" element={<UserManagementScreen />} />
          <Route path="verification" element={<VerificationQueueScreen />} />
          <Route path="reports" element={<ReportsModerationScreen />} />
          <Route path="reports/:id" element={<ReportDetailScreen />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {currentUser &&
        !['/', '/login', '/signup', '/verify-email', '/complete-profile', '/terms', '/privacy', '/assistant', '/ai'].includes(
          location.pathname
        ) &&
        !location.pathname.startsWith('/admin') && (
          <FloatingAiAssistant user={currentUser} />
        )}

      {showLogoutWarning && (
        <LogoutWarningModal
          user={currentUser}
          onConfirm={handleConfirmLogout}
          onCancel={handleCancelLogout}
        />
      )}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
