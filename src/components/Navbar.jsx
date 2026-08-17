import { useState, useRef, useEffect } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, AnimatePresence } from 'motion/react'
import {
  IconMenu2,
  IconX,
  IconArrowRight,
  IconRocket,
  IconWorld,
  IconChevronDown,
  IconCheck,
} from '@tabler/icons-react'

const links = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Gigs', href: '#gigs' },
  { label: 'Community', href: '#community' },
]

const languages = [
  { code: 'en', label: 'Eng', native: 'English', flag: '🌐' },
  { code: 'am', label: 'Amh', native: 'አማርኛ', flag: '🇪🇹' },
  { code: 'ti', label: 'Tig', native: 'ትግርኛ', flag: '🇪🇹' },
  { code: 'om', label: 'Oro', native: 'Afaan Oromoo', flag: '🇪🇹' },
]

export default function Navbar({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [selectedLang, setSelectedLang] = useState('en')
  const langRef = useRef(null)

  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    mass: 0.4,
  })

  // Close language dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNav = (targetView) => (e) => {
    e.preventDefault()
    setOpen(false)
    if (onNavigate) onNavigate(targetView)
  }

  const activeLangObj = languages.find((l) => l.code === selectedLang) || languages[0]

  return (
    <motion.header
      initial={reduce ? false : { y: -72, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 border-b border-white/15 bg-black/40 shadow-[0_4px_30px_rgba(0,0,0,0.15)] backdrop-blur-2xl font-['Space_Grotesk']"
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5 group">
          <img
            src="/assets/campushustle.jpg"
            alt="CampusHustle logo"
            width="36"
            height="36"
            className="size-9 rounded-xl border border-white/20 object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-[17px] font-bold tracking-tight text-white drop-shadow-sm">
            Campus Hustle
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/80 transition-all hover:text-white hover:drop-shadow-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Stylized Language Switcher */}
          <div className="relative" ref={langRef}>
            <button
              type="button"
              onClick={() => setLangOpen((v) => !v)}
              aria-label="Change language"
              aria-expanded={langOpen}
              className="group flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white shadow-sm backdrop-blur-md transition-all duration-200 hover:border-white/40 hover:bg-white/20 active:scale-95"
            >
              <IconWorld size={15} className="text-hustle-400 transition-transform duration-300 group-hover:rotate-45" />
              <span>{activeLangObj.label}</span>
              <IconChevronDown
                size={14}
                className={`text-white/70 transition-transform duration-200 ${langOpen ? 'rotate-180 text-white' : ''}`}
              />
            </button>

            {/* Language Popover Menu */}
            <AnimatePresence>
              {langOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.95 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="absolute right-0 mt-2 w-44 origin-top-right rounded-2xl border border-white/20 bg-black/85 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl"
                >
                  <div className="flex flex-col gap-0.5">
                    {languages.map((lang) => {
                      const isSelected = lang.code === selectedLang
                      return (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => {
                            setSelectedLang(lang.code)
                            setLangOpen(false)
                          }}
                          className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                            isSelected
                              ? 'bg-hustle-500 text-ink-contrast shadow-sm'
                              : 'text-white/85 hover:bg-white/15 hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span>{lang.flag}</span>
                            <span>{lang.native}</span>
                            <span className={`text-[10px] ${isSelected ? 'text-ink-contrast/70' : 'text-white/50'}`}>
                              ({lang.label})
                            </span>
                          </div>
                          {isSelected && <IconCheck size={14} stroke={3} />}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <a
            href="#"
            onClick={handleNav('login')}
            className="hidden rounded-full border border-transparent px-3.5 py-1.5 text-sm font-semibold text-white/85 transition-all duration-200 hover:border-white/20 hover:bg-white/10 hover:text-white md:inline-block"
          >
            Sign in
          </a>

          {/* Animated Start Hustling Navbar CTA Button */}
          <motion.a
            whileHover={reduce ? {} : { scale: 1.05 }}
            whileTap={reduce ? {} : { scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            href="#"
            onClick={handleNav('signup')}
            className="group relative hidden sm:inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-hustle-400 via-hustle-500 to-hustle-600 px-5 py-2 text-sm font-bold text-ink-contrast shadow-[0_2px_12px_rgba(255,175,43,0.35)] transition-shadow duration-300 hover:shadow-[0_4px_20px_rgba(255,175,43,0.6)]"
          >
            {/* Shimmer sweep animation */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />

            {/* Text Flip Effect */}
            <span className="relative z-10 block h-5 overflow-hidden leading-5 font-bold tracking-wide">
              <span className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-5">
                <span>Start hustling</span>
                <span>Join Now</span>
              </span>
            </span>

            {/* Icon Flip Effect */}
            <span className="relative z-10 block size-4 overflow-hidden">
              <span className="flex flex-col items-center transition-transform duration-300 ease-out group-hover:-translate-y-4">
                <IconArrowRight size={16} stroke={2.5} className="shrink-0" />
                <IconRocket size={16} stroke={2.5} className="shrink-0 text-ink-contrast -rotate-45" />
              </span>
            </span>
          </motion.a>

          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-10 items-center justify-center rounded-full border border-white/20 text-white hover:bg-white/10 md:hidden"
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
        <div className="border-t border-white/15 bg-black/85 px-4 pb-6 pt-3 shadow-level-2 backdrop-blur-2xl md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-3 text-base text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </a>
            ))}
            
            {/* Mobile Language Selector Grid */}
            <div className="my-2 border-y border-white/10 py-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-white/50 px-2">Language</span>
              <div className="mt-1.5 grid grid-cols-2 gap-1.5">
                {languages.map((lang) => {
                  const isSelected = lang.code === selectedLang
                  return (
                    <button
                      key={lang.code}
                      type="button"
                      onClick={() => setSelectedLang(lang.code)}
                      className={`flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold ${
                        isSelected
                          ? 'bg-hustle-500 text-ink-contrast'
                          : 'bg-white/10 text-white/85 hover:bg-white/20'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <span>{lang.flag}</span>
                        <span>{lang.label}</span>
                      </span>
                      {isSelected && <IconCheck size={13} stroke={3} />}
                    </button>
                  )
                })}
              </div>
            </div>

            <a
              href="#"
              onClick={handleNav('login')}
              className="rounded-lg px-3 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
            >
              Sign in
            </a>
            <a
              href="#"
              onClick={handleNav('signup')}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-hustle-500 px-5 py-3 text-base font-semibold text-ink-contrast shadow-sm"
            >
              Start hustling
            </a>
          </div>
        </div>
      )}
    </motion.header>
  )
}
