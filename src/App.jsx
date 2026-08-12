import { useState } from 'react'
import HomePage from './pages/HomePage.jsx'
import LoginForm from './pages/LoginForm.jsx'
import SignupForm from './pages/SignupForm.jsx'

function App() {
  const [view, setView] = useState('home')

  if (view === 'login') {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(255,175,43,0.14),transparent_65%)]"
        />
        <div className="relative w-full max-w-md">
          <div className="mb-4">
            <button
              onClick={() => setView('home')}
              className="text-label-md text-ink-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer mb-2"
            >
              ← Back to Home
            </button>
          </div>
          <LoginForm onSwitchToSignup={() => setView('signup')} />
        </div>
      </div>
    )
  }

  if (view === 'signup') {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-12">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(255,175,43,0.14),transparent_65%)]"
        />
        <div className="relative w-full max-w-md">
          <div className="mb-4">
            <button
              onClick={() => setView('home')}
              className="text-label-md text-ink-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer mb-2"
            >
              ← Back to Home
            </button>
          </div>
          <SignupForm onSwitchToLogin={() => setView('login')} />
        </div>
      </div>
    )
  }

  return <HomePage onNavigate={(targetView) => setView(targetView)} />
}

export default App
