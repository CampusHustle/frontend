import { useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { IconMenu2, IconMoon, IconSun, IconX } from '@tabler/icons-react'

const links = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Gigs', href: '#gigs' },
  { label: 'Community', href: '#community' },
]

function toggleTheme() {
  const root = document.documentElement
  const next = root.classList.contains('light') ? 'dark' : 'light'
  root.classList.remove('light', 'dark')
  root.classList.add(next)
  try {
    localStorage.setItem('campus-theme', next)
  } catch (e) {
    /* ignore quota / privacy-mode failures */
  }
}

export default function Navbar({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const [isLight, setIsLight] = useState(() =>
    document.documentElement.classList.contains('light'),
  )
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  })

  const handleNav = (targetView) => (e) => {
    e.preventDefault()
    setOpen(false)
    if (onNavigate) onNavigate(targetView)
  }

  const handleThemeToggle = () => {
    toggleTheme()
    setIsLight((v) => !v)
  }

  return (
    <motion.header
      initial={reduce ? false : { y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink-950/75 backdrop-blur-xl"
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <img
            src="/assets/campushustle.jpg"
            alt="CampusHustle logo"
            width="36"
            height="36"
            className="size-9 rounded-xl border border-white/10 object-cover"
          />
          <span className="font-display text-[17px] font-semibold tracking-tight text-ink-50">
            Campus Hustle
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-ink-300 transition-colors hover:text-ink-50"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleThemeToggle}
            aria-label={isLight ? 'Switch to dark mode' : 'Switch to light mode'}
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-ink-200 transition-colors hover:text-ink-50"
          >
            {isLight ? <IconMoon size={18} /> : <IconSun size={18} />}
          </button>
          <a
            href="#"
            onClick={handleNav('login')}
            className="hidden text-sm font-semibold text-ink-200 transition-colors hover:text-ink-50 md:inline-block"
          >
            Sign in
          </a>
          <a
            href="#"
            onClick={handleNav('signup')}
            className="hidden rounded-full bg-hustle-500 px-5 py-2.5 text-sm font-semibold text-ink-contrast transition-[transform,background-color] duration-200 hover:bg-hustle-400 active:scale-[0.98] sm:inline-flex"
          >
            Start hustling
          </a>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-ink-100 md:hidden"
          >
            {open ? <IconX size={20} /> : <IconMenu2 size={20} />}
          </button>
        </div>
      </nav>

      {!reduce && (
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="h-0.5 origin-left bg-hustle-500"
        />
      )}

      {open && (
        <div className="border-t border-white/5 bg-ink-900 px-4 pb-6 pt-2 md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base text-ink-200 transition-colors hover:bg-white/5 hover:text-ink-50"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#"
              onClick={handleNav('login')}
              className="rounded-lg px-3 py-3 text-base font-semibold text-ink-100 transition-colors hover:bg-white/5"
            >
              Sign in
            </a>
            <a
              href="#"
              onClick={handleNav('signup')}
              className="mt-3 inline-flex items-center justify-center rounded-full bg-hustle-500 px-5 py-3 text-base font-semibold text-ink-contrast"
            >
              Start hustling
            </a>
          </div>
        </div>
      )}
    </motion.header>
  )
}
