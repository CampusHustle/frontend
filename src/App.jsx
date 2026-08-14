import { useState } from 'react'
import HomePage from './pages/HomePage.jsx'
import LoginForm from './pages/LoginForm.jsx'
import SignupForm from './pages/SignupForm.jsx'
import VerifyEmailPage from './pages/VerifyEmailPage.jsx'
import CompleteProfilePage from './pages/CompleteProfilePage.jsx'
import FindTutorPage from './pages/FindTutorPage.jsx'
import { mockUpdateProfile } from './api/mockAuthApi.js'
import {
  clearSession,
  loadSessionUser,
  saveSessionUser,
  loadSessionView,
  saveSessionView,
} from './utils/session.js'
import { profileFromForm } from './utils/user.js'

function getInitialView(user) {
  const savedView = loadSessionView()
  if (user) {
    // If logged-in user was in the middle of completing profile, preserve it,
    // otherwise default to find-tutor so existing users never see onboarding.
    if (savedView === 'complete-profile') return 'complete-profile'
    return 'find-tutor'
  }
  if (savedView && ['login', 'signup', 'verify-email', 'home'].includes(savedView)) {
    return savedView
  }
  return 'home'
}

function App() {
  const [currentUser, setCurrentUser] = useState(() => loadSessionUser())
  const [view, setView] = useState(() => getInitialView(loadSessionUser()))
  const [pendingUser, setPendingUser] = useState(null)
  const [pendingEmail, setPendingEmail] = useState('')

  const navigate = (targetView) => {
    setView(targetView)
    saveSessionView(targetView)
  }

  if (view === 'login') {
    return (
      <LoginForm
        onSwitchToSignup={() => navigate('signup')}
        onLoginSuccess={(user) => {
          saveSessionUser(user)
          setCurrentUser(user)
          // Existing users skip onboarding and go straight to the marketplace
          navigate('find-tutor')
        }}
      />
    )
  }

  if (view === 'signup') {
    return (
      <SignupForm
        onSwitchToLogin={() => navigate('login')}
        onSignupSuccess={(user) => {
          setPendingUser(user)
          setPendingEmail(user.email)
          navigate('verify-email')
        }}
      />
    )
  }

  if (view === 'verify-email') {
    return (
      <VerifyEmailPage
        email={pendingEmail || currentUser?.email || 'student@campus.edu.et'}
        onBackToLogin={() => navigate('login')}
        onContinue={() => {
          const activeUser = pendingUser || currentUser
          if (activeUser) {
            setCurrentUser(activeUser)
            saveSessionUser(activeUser)
          }
          // New signups proceed to complete profile
          navigate('complete-profile')
        }}
      />
    )
  }

  if (view === 'complete-profile') {
    return (
      <CompleteProfilePage
        user={currentUser || pendingUser}
        onFinish={(form) => {
          const profile = profileFromForm(form)
          const active = currentUser || pendingUser || {}
          const updated = { ...active, ...profile }
          setCurrentUser(updated)
          saveSessionUser(updated)
          navigate('find-tutor')
          mockUpdateProfile(updated.email, profile).catch(() => {})
        }}
      />
    )
  }

  if (view === 'find-tutor') {
    return (
      <FindTutorPage
        user={currentUser}
        onLogout={() => {
          clearSession()
          setCurrentUser(null)
          setPendingUser(null)
          navigate('home')
        }}
        onNavigate={navigate}
      />
    )
  }

  return <HomePage onNavigate={navigate} />
}

export default App
