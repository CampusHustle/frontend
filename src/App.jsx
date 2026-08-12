import { useState } from 'react'
import SignUpForm from './pages/SignUpForm.jsx'
import SignInForm from './pages/SignInForm.jsx'

function App() {
  const [view, setView] = useState('signIn')

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4 py-12">
      {view === 'signIn' ? (
        <SignInForm onSwitchToSignUp={() => setView('signUp')} />
      ) : (
        <SignUpForm onSwitchToSignIn={() => setView('signIn')} />
      )}
    </div>
  )
}

export default App
