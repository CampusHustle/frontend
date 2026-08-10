import { useState } from 'react'
import { IconMenu2, IconX } from '@tabler/icons-react'
import Logo from './Logo.jsx'

const links = [
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Gigs', href: '#gigs' },
  { label: 'Community', href: '#community' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-ink-950/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <a href="#top" className="flex items-center gap-2.5">
          <Logo />
          <span className="font-display text-[17px] font-semibold tracking-tight text-ink-50">
            Campus Hustle
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink-300 transition-colors hover:text-ink-50"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href="#start"
            className="hidden rounded-full bg-hustle-500 px-5 py-2.5 text-sm font-semibold text-ink-950 transition-[transform,background-color] duration-200 hover:bg-hustle-400 active:scale-[0.98] sm:inline-flex"
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
              href="#start"
              onClick={() => setOpen(false)}
              className="mt-3 inline-flex items-center justify-center rounded-full bg-hustle-500 px-5 py-3 text-base font-semibold text-ink-950"
            >
              Start hustling
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
