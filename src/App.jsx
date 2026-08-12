
import { useState } from 'react'
import LoginForm from './pages/LoginForm.jsx'
import SignupForm from './pages/SignupForm.jsx'
import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Bento from './components/Bento.jsx'
import Stats from './components/Stats.jsx'
import Testimonial from './components/Testimonial.jsx'
import FinalCta from './components/FinalCta.jsx'
import Footer from './components/Footer.jsx'
import NoteCard from './components/NoteCard.jsx'
import NotesMarketplace from './components/NotesMarketplace.jsx'
import MarketplacePage from './components/MarketplacePage.jsx'


function App() {
  const [view, setView] = useState('login')

  return (
    <div className="min-h-screen">
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_0%,rgba(255,175,43,0.14),transparent_65%)]">
      </div>
      <div className="relative w-full">
        {view === 'login' ? (
          <LoginForm onSwitchToSignup={() => setView('signup')} />
        ) : (
          <SignupForm onSwitchToLogin={() => setView('login')} />
        )}
      </div>
      </div>
    <div className="relative overflow-x-clip bg-ink-950">
      <Navbar />
      <main>
        <MarketplacePage />
        <Hero />
        <Marquee />
        <HowItWorks />
        <Bento />
        <Stats />
        <Testimonial />
        <FinalCta />
      </main>
      <Footer />
    </div>
  </div>  
  )
}

export default App
