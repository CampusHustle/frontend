import Navbar from './components/Navbar.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import HowItWorks from './components/HowItWorks.jsx'
import Bento from './components/Bento.jsx'
import Stats from './components/Stats.jsx'
import Testimonial from './components/Testimonial.jsx'
import FinalCta from './components/FinalCta.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <div className="relative overflow-x-clip bg-ink-950">
      <Navbar />
      <main>
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
  )
}

export default App
