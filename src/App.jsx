import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, useNavigate, Navigate, useLocation } from 'react-router-dom'
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
import TermsScreen from './screens/TermsScreen.jsx'
import PrivacyScreen from './screens/PrivacyScreen.jsx'
import NoteDetailPage from './pages/NoteDetailPage.jsx'
import NotePaymentPage from './pages/NotePaymentPage.jsx'
import LogoutWarningModal from './components/LogoutWarningModal.jsx'
import FloatingAiAssistant from './components/FloatingAiAssistant.jsx'
import { mockUpdateProfile } from './api/mockAuthApi.js'
import {
  clearSession,
  loadSessionUser,
  saveSessionUser,
  loadSessionView,
  saveSessionView,
} from './utils/session.js'
import { profileFromForm } from './utils/user.js'

function getInitialPath() {
  const user = loadSessionUser()
  const savedView = loadSessionView()
  if (user) {
    if (savedView === 'complete-profile') return '/complete-profile'
    if (savedView === 'marketplace' || savedView === 'market') return '/market'
    if (savedView === 'profile') return '/profile'
    if (savedView === 'post-listing') return '/post-listing'
    if (savedView === 'bookings') return '/bookings'
    if (savedView === 'chat') return '/chat'
    if (savedView === 'terms') return '/terms'
    if (savedView === 'privacy') return '/privacy'
    return '/tutor'
  }
  if (savedView) {
    const viewToPath = {
      login: '/login',
      signup: '/signup',
      'verify-email': '/verify-email',
      'complete-profile': '/complete-profile',
      'find-tutor': '/tutor',
      tutor: '/tutor',
      marketplace: '/market',
      market: '/market',
      home: '/',
      bookings: '/bookings',
      chat: '/chat',
      terms: '/terms',
      privacy: '/privacy',
    }
    if (viewToPath[savedView]) return viewToPath[savedView]
  }
  return '/'
}

export function AppRoutes() {
  const navigate = useNavigate()
  const location = useLocation()
  const [currentUser, setCurrentUser] = useState(() => loadSessionUser())
  const [pendingUser, setPendingUser] = useState(null)
  const [pendingEmail, setPendingEmail] = useState('')
  const [showLogoutWarning, setShowLogoutWarning] = useState(false)

  useEffect(() => {
    const initialPath = getInitialPath()
    if (initialPath !== location.pathname && location.pathname === '/') {
      navigate(initialPath, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNavigate = (targetView) => {
    if (targetView === 'assistant') {
      window.dispatchEvent(new CustomEvent('open-ai-assistant'))
      return
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
      terms: '/terms',
      privacy: '/privacy',
    }
    const path = routeMap[targetView] || (typeof targetView === 'string' && targetView.startsWith('/') ? targetView : '/')
    saveSessionView(targetView)
    navigate(path)
  }

  const handleLogout = () => {
    setShowLogoutWarning(true)
  }

  const handleConfirmLogout = () => {
    setShowLogoutWarning(false)
    clearSession()
    setCurrentUser(null)
    setPendingUser(null)
    handleNavigate('home')
  }

  const handleCancelLogout = () => {
    setShowLogoutWarning(false)
  }

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser)
    saveSessionUser(updatedUser)
    if (updatedUser?.email) {
      mockUpdateProfile(updatedUser.email, updatedUser).catch(() => {})
    }
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
              handleNavigate('tutor')
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
            onBackToLogin={() => handleNavigate('login')}
          />
        }
      />
      <Route
        path="/complete-profile"
        element={
          <CompleteProfileScreen
            user={currentUser || pendingUser}
            onFinish={(form) => {
              const profile = profileFromForm(form)
              const active = currentUser || pendingUser || {}
              const updated = { ...active, ...profile }
              setCurrentUser(updated)
              saveSessionUser(updated)
              handleNavigate('tutor')
              mockUpdateProfile(updated.email, profile).catch(() => { })
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
    <FloatingAiAssistant user={currentUser} />
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
