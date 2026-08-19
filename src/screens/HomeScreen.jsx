import "../reference-landing.css";
import "../landing-page.css";
import Navbar from "../components/Navbar.jsx";
import Hero from "../components/Hero.jsx";
import Marquee from "../components/Marquee.jsx";
import MovementGallery from "../components/MovementGallery.jsx";
import AppShowcase from "../components/AppShowcase.jsx";
import Features from "../components/Features.jsx";
import GrowthPipeline from "../components/GrowthPipeline.jsx";
import Ecosystem from "../components/Ecosystem.jsx";
import Testimonial from "../components/Testimonial.jsx";
import Footer from "../components/Footer.jsx";

export default function HomeScreen({ onNavigate }) {
  return (
    <div className="landing-page relative min-h-[100dvh] overflow-x-clip bg-surface text-on-surface font-body antialiased">
      <Navbar onNavigate={onNavigate} />
      <main className="app-shell">
        <div className="page-frame">
          <Hero onNavigate={onNavigate} />
          <div className="content-stack">
            <Marquee />
            <MovementGallery />
            <div className="section-divider" aria-hidden="true" />
            <AppShowcase onNavigate={onNavigate} />
            <Features onNavigate={onNavigate} />
            <GrowthPipeline />
            <Ecosystem />
            <Testimonial onNavigate={onNavigate} />
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} isLanding={true} />
    </div>
  );
}
