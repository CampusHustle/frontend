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
import AiAssistantScreen from './screens/AiAssistantScreen.jsx'
import NoteDetailPage from './pages/NoteDetailPage.jsx'
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
    if (savedView === 'assistant') return '/assistant'
    if (savedView === 'bookings') return '/bookings'
    if (savedView === 'chat') return '/chat'
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
      assistant: '/assistant',
      bookings: '/bookings',
      chat: '/chat',
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

  useEffect(() => {
    const initialPath = getInitialPath()
    if (initialPath !== location.pathname && location.pathname === '/') {
      navigate(initialPath, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleNavigate = (targetView) => {
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
      assistant: '/assistant',
      bookings: '/bookings',
      chat: '/chat',
    }
    const path = routeMap[targetView] || (typeof targetView === 'string' && targetView.startsWith('/') ? targetView : '/')
    saveSessionView(targetView)
    navigate(path)
  }

  const handleLogout = () => {
    clearSession()
    setCurrentUser(null)
    setPendingUser(null)
    handleNavigate('home')
  }

  return (
    <Routes>
      <Route path="/" element={<HomeScreen onNavigate={handleNavigate} />} />
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
        path="/profile"
        element={
          currentUser ? (
            <ProfileScreen
              user={currentUser}
              onLogout={handleLogout}
              onNavigate={handleNavigate}
            />
          ) : (
            <Navigate to="/" replace />
          )
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
        path="/assistant"
        element={
          <AiAssistantScreen
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
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
