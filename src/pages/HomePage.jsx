import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import Marquee from '../components/Marquee.jsx'
import Stats from '../components/Stats.jsx'
import Bento from '../components/Bento.jsx'
import HowItWorks from '../components/HowItWorks.jsx'
import Testimonial from '../components/Testimonial.jsx'
import FinalCta from '../components/FinalCta.jsx'
import Footer from '../components/Footer.jsx'

export default function HomePage({ onNavigate }) {
  return (
    <div className="relative min-h-[100dvh] overflow-x-clip bg-ink-950 text-ink-100 font-body antialiased">
      <Navbar onNavigate={onNavigate} />
      <main>
        <Hero onNavigate={onNavigate} />
        <Marquee />
        <Stats />
        <Bento />
        <HowItWorks />
        <Testimonial />
        <FinalCta onNavigate={onNavigate} />
      </main>
      <Footer onNavigate={onNavigate} />
    </div>
  )
}
