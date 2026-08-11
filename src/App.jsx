import { useState } from 'react'
import LoginForm from './pages/LoginForm.jsx'
import SignupForm from './pages/SignupForm.jsx'

function App() {
  const [view, setView] = useState('login')

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(255,175,43,0.14),transparent_65%)]"
      />
      <div className="relative w-full">
        {view === 'login' ? (
          <LoginForm onSwitchToSignup={() => setView('signup')} />
        ) : (
          <SignupForm onSwitchToLogin={() => setView('login')} />
        )}
      </div>
    </div>
  )
}

export default App
