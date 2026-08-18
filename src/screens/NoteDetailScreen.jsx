import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  IconBolt,
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheckFilled,
  IconEye,
  IconFileText,
  IconMessageCircle,
  IconShieldCheck,
  IconStarFilled,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'

const DUMMY_NOTE = {
  id: 'note_123',
  title: 'Organic Chemistry: Reaction Mechanisms Masterclass',
  course: 'Chemistry 201',
  code: 'CHEM 201',
  department: 'Chemistry',
  lastUpdated: 'Oct 2026',
  tutorName: 'Sarah Jenkins',
  tutorRole: 'Senior, Chemistry Major',
  tutorUniversity: 'Addis Ababa University',
  tutorRating: 4.9,
  tutorReviewsCount: 42,
  tutorAvatar:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDjOwJWmOo4wnikb1axjka0-v8R-36PRThsxPguoCaIV0CuU3MhOYfisMUFouccaprNJZCu-RIpfzSH_IC5Yhik4Kwpa62gUTeb8qUVvOOD48UyGsf1WWlOM6TSfKMiH3S_9aZ1gjoa6GoCPYywaQWXeD3BDR7FBanMILpkjsnGIqFqxwRLaeokfRIpgxu4pYWrfm2yPGE4S7dwna2tdkN8GupeByJP0dQleHAXMWVfYhVt_CP6uUwzlA',
  price: 18.5,
  priceEtb: 150,
  format: 'PDF (12MB)',
  length: '42 Pages',
  sales: '120+ Downloads',
  previewPagesCount: 42,
  previewSlides: [
    {
      id: 1,
      title: 'Chapter 7: Nucleophilic Addition to Carbonyls',
      url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSq0rO8PGRYNgwRirJSUHaLSsluvB5AdFaGKr3unHqsBmUSW1AAVOjPpKf01tOVNC8z5_GJTK2NCK26gifDFEahJZIpQrMf5fEOXXFYqXpZHx-YR9cAz-NM2QtwoWuaamNhyDd--VjYR7e5NjQ97YKr-roz46ddA5YL2mSz2jVuqoAm4aGWBaJzOnu2qR0gFlAti4su92_4tc1BjghdPqvUs_3fCE4HJtQ7mYQCXRt-9ETsc8VUcjBlg',
    },
    {
      id: 2,
      title: 'Chapter 8: Acid-Catalyzed Hydration & Hemiacetal Formation',
      url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=1000&auto=format&fit=crop',
    },
    {
      id: 3,
      title: 'Chapter 9: Grignard Reagents & Alcohol Synthesis Worksheets',
      url: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=1000&auto=format&fit=crop',
    },
  ],
  description:
    'Comprehensive reaction mechanisms masterclass covering SN1/SN2, E1/E2, carbonyl chemistry, and aromatic substitutions with step-by-step electron pushing.',
  whatsInside: [
    '32 pages of high-yield reaction mechanisms',
    'Printable A4 exam summary cheat sheets',
    '50+ solved practice problems with keys',
  ],
}

export default function NoteDetailScreen({ user, onNavigate, onLogout }) {
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const fetchNote = async () => {
      setIsLoading(true)
      setNote({ ...DUMMY_NOTE, id: id || 'note_123' })
      setIsLoading(false)
    }

    fetchNote()
  }, [id])

  const handleMakePayment = () => {
    if (onNavigate) {
      onNavigate(`/notes/${note?.id || 'note_123'}/payment`)
    } else {
      window.location.assign(`/notes/${note?.id || 'note_123'}/payment`)
    }
  }

  const nextSlide = () => {
    if (!note?.previewSlides?.length) return
    setCurrentSlide((prev) => (prev === note.previewSlides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    if (!note?.previewSlides?.length) return
    setCurrentSlide((prev) => (prev === 0 ? note.previewSlides.length - 1 : prev - 1))
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50 font-poppins">
        <div className="flex flex-col items-center gap-3 text-[#041534]">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent" />
          <p className="text-sm font-medium text-gray-600">Loading note details...</p>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="flex h-screen w-screen flex-col bg-gray-50 font-poppins text-gray-900">
        <AppNavbar user={user} activeView="marketplace" onNavigate={onNavigate} onLogout={onLogout} />
        <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900">Note Not Found</h1>
          <p className="mt-2 text-sm text-gray-600">The requested study note is no longer available.</p>
          <button
            type="button"
            onClick={() => (onNavigate ? onNavigate('marketplace') : window.location.assign('/market'))}
            className="mt-4 rounded-full bg-[#041534] px-6 py-2.5 text-xs font-bold text-white shadow hover:bg-[#1b2a4a]"
          >
            Browse Marketplace
          </button>
        </main>
      </div>
    )
  }

  const activeSlideData = note.previewSlides[currentSlide] || note.previewSlides[0]

  return (
    <div
      className="flex h-screen max-h-screen w-screen flex-col overflow-hidden bg-gray-50 font-poppins text-gray-900 antialiased"
      style={{
        backgroundImage: `
          radial-gradient(circle at 15% 50%, rgba(4, 21, 52, 0.03), transparent 25%),
          radial-gradient(circle at 85% 30%, rgba(254, 174, 44, 0.05), transparent 25%)
        `,
      }}
    >
      {/* Top Navbar */}
      <AppNavbar
        user={user}
        activeView="marketplace"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Main Single-Screen Content (No Scrolling on Desktop) */}
      <main className="mx-auto flex h-[calc(100vh-64px)] w-full max-w-7xl flex-1 flex-col overflow-hidden px-4 py-3 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Header Row */}
        <div className="mb-2 flex shrink-0 flex-wrap items-center justify-between gap-2 text-xs">
          <nav className="flex items-center gap-1.5 text-gray-500 font-medium">
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate('marketplace') : window.location.assign('/market'))}
              className="hover:text-gray-900 transition-colors"
            >
              Marketplace
            </button>
            <IconChevronRight size={14} className="text-gray-400" />
            <span className="text-gray-600">{note.department}</span>
            <IconChevronRight size={14} className="text-gray-400" />
            <span className="font-semibold text-gray-900 truncate max-w-xs">{note.title}</span>
          </nav>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-gray-200 bg-white px-2.5 py-0.5 text-[11px] font-semibold text-gray-800 shadow-2xs">
              <IconStarFilled size={12} className="text-amber-500" />
              <span>{note.tutorRating} ({note.tutorReviewsCount})</span>
            </span>
            <span className="rounded-full bg-[#1b2a4a] px-2.5 py-0.5 text-[11px] font-bold text-white">
              {note.code}
            </span>
            <span className="text-[11px] text-gray-400 hidden sm:inline">Updated {note.lastUpdated}</span>
          </div>
        </div>

        {/* 2-Column Bento Grid fitting exactly in viewport */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-12 overflow-hidden pb-1">
          {/* Left Column: 3-Image Slide Preview Stage & Quick Highlights (7 Cols) */}
          <div className="flex min-h-0 flex-col gap-3 lg:col-span-7 overflow-hidden">
            {/* Title */}
            <div className="shrink-0 flex items-center justify-between gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#041534] leading-snug truncate">
                {note.title}
              </h1>
              <span className="rounded-full bg-gray-200/80 px-2.5 py-0.5 text-[10px] font-bold text-gray-700 shrink-0">
                Sample Slide {currentSlide + 1} of {note.previewSlides.length}
              </span>
            </div>

            {/* Slide Viewer Card - Flex-1 to fit viewport */}
            <div className="group relative min-h-0 flex-1 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm flex items-center justify-center">
              <img
                key={activeSlideData.id}
                src={activeSlideData.url}
                alt={activeSlideData.title}
                className="h-full w-full object-cover object-top transition-all duration-500 animate-fadeIn"
              />

              {/* Navigation Left Arrow */}
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous sample slide"
                className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110 active:scale-95"
              >
                <IconChevronLeft size={20} />
              </button>

              {/* Navigation Right Arrow */}
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next sample slide"
                className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110 active:scale-95"
              >
                <IconChevronRight size={20} />
              </button>

              {/* Bottom Slide Info & Interactive Dots */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3 sm:p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 text-white text-xs font-medium backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-full border border-white/20">
                    <IconEye size={15} className="text-amber-400" />
                    <span>{activeSlideData.title}</span>
                  </div>

                  {/* 3 Clickable Slide Dots */}
                  <div className="flex items-center gap-1.5 ml-2">
                    {note.previewSlides.map((slide, idx) => (
                      <button
                        key={slide.id}
                        type="button"
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`h-2.5 rounded-full transition-all ${
                          currentSlide === idx
                            ? 'w-6 bg-amber-400 shadow-sm'
                            : 'w-2.5 bg-white/50 hover:bg-white/80'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleMakePayment}
                  className="rounded-full bg-white px-3.5 py-1 text-xs font-bold text-gray-900 shadow hover:bg-gray-100 transition-all active:scale-95 shrink-0 ml-2"
                >
                  Full Preview
                </button>
              </div>
            </div>

            {/* Highlights Chips Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0">
              {note.whatsInside.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 text-[11px] font-medium text-gray-700 shadow-2xs"
                >
                  <IconCircleCheckFilled size={14} className="shrink-0 text-amber-500" />
                  <span className="truncate">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Clean Purchase & Seller Details (5 Cols) */}
          <div className="flex min-h-0 flex-col justify-between gap-3 lg:col-span-5 overflow-hidden">
            {/* Purchase & Specs Card */}
            <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
              {/* Price Row */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <div>
                  <p className="text-[11px] uppercase font-bold tracking-wider text-gray-400">Total Price</p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-extrabold text-[#041534] tracking-tight">
                      ${note.price.toFixed(2)}
                    </span>
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
                      {note.priceEtb} ETB
                    </span>
                  </div>
                </div>
                <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                  Digital PDF
                </span>
              </div>

              {/* Note Specs */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="rounded-xl bg-gray-50 p-2 border border-gray-100">
                  <span className="text-[10px] text-gray-400 block font-medium">Format</span>
                  <strong className="text-gray-900 font-semibold text-xs mt-0.5 block">{note.format}</strong>
                </div>
                <div className="rounded-xl bg-gray-50 p-2 border border-gray-100">
                  <span className="text-[10px] text-gray-400 block font-medium">Pages</span>
                  <strong className="text-gray-900 font-semibold text-xs mt-0.5 block">{note.length}</strong>
                </div>
                <div className="rounded-xl bg-gray-50 p-2 border border-gray-100">
                  <span className="text-[10px] text-gray-400 block font-medium">Downloads</span>
                  <strong className="text-gray-900 font-semibold text-xs mt-0.5 block">{note.sales}</strong>
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-gray-600 leading-relaxed bg-gray-50/70 p-3 rounded-xl border border-gray-100">
                <p className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                  <IconFileText size={14} className="text-amber-600" />
                  <span>About these notes</span>
                </p>
                <p className="line-clamp-2">{note.description}</p>
              </div>

              {/* Buy Now (Make Payment) Button */}
              <button
                type="button"
                onClick={handleMakePayment}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-gray-950 shadow-md hover:bg-amber-400 hover:shadow-lg transition-all active:scale-95"
              >
                <IconBolt size={18} />
                <span>Buy Now (Make Payment)</span>
              </button>

              <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1 text-center">
                <IconShieldCheck size={14} className="text-emerald-600" />
                <span>Verified Telebirr, CBE & BOA manual unlock</span>
              </p>
            </div>

            {/* Seller Profile Card (Below Payment Card) */}
            <div className="flex flex-col items-center rounded-2xl border border-gray-200 bg-white p-3.5 text-center shadow-sm">
              <div className="relative mb-2 h-14 w-14 overflow-hidden rounded-full border-2 border-amber-400">
                <img
                  src={note.tutorAvatar}
                  alt={note.tutorName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute right-0 bottom-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-amber-500">
                  <IconCircleCheckFilled size={11} className="text-gray-950" />
                </div>
              </div>
              <h2 className="text-sm font-bold text-[#041534] leading-tight">{note.tutorName}</h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {note.tutorRole} · {note.tutorUniversity}
              </p>
              <div className="my-1.5 flex items-center justify-center gap-1 text-[11px] text-gray-600">
                <IconStarFilled size={13} className="text-amber-500" />
                <span className="font-semibold text-gray-900">{note.tutorRating}</span>
                <span>({note.tutorReviewsCount} ratings)</span>
              </div>
              <button
                type="button"
                onClick={() => (onNavigate ? onNavigate('/chat/sarah-jenkins') : window.location.assign('/chat/sarah-jenkins'))}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gray-100 py-2 text-xs font-bold text-gray-800 hover:bg-gray-200 transition-colors active:scale-95"
              >
                <IconMessageCircle size={15} />
                <span>Message Seller</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
