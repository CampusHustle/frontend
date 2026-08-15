import Reveal from './Reveal.jsx'

export default function Testimonial() {
  return (
    <section
      id="community"
      className="mx-auto max-w-4xl scroll-mt-24 px-4 py-24 text-center sm:px-6 lg:px-8 lg:py-32"
    >
      <Reveal>
        <span
          aria-hidden="true"
          className="font-display text-7xl leading-none text-hustle-500"
        >
          &ldquo;
        </span>
        <blockquote className="-mt-6 font-display text-2xl font-medium leading-snug tracking-tight text-primary sm:text-3xl lg:text-4xl">
          I made more in one semester of hustling than two summer internships.
          My tutoring side-gig basically pays my rent.
        </blockquote>
        <footer className="mt-8">
          <p className="font-semibold text-primary">Maya O.</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Design student · Eastside campus
          </p>
        </footer>
      </Reveal>
    </section>
  )
}
