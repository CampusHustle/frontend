import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  IconChevronRight,
  IconCircleCheckFilled,
  IconMessageCircle,
  IconStarFilled,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import DocumentCarousel from '../components/DocumentCarousel.jsx'
import PurchaseCard from '../components/PurchaseCard.jsx'
import Footer from '../components/Footer.jsx'
import { getNoteById } from '../api/noteApi.js'

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

  useEffect(() => {
    let isMounted = true
    const fetchNote = async () => {
      setIsLoading(true)
      try {
        const res = await getNoteById(id || 'note_123')
        if (isMounted && (res?.note || res?.data)) {
          const doc = res.note || res.data
          setNote({
            ...DUMMY_NOTE,
            ...doc,
            id: doc._id || doc.id || id,
            price: doc.price || 18.5,
            priceEtb: doc.price ? Math.round(doc.price * 10) : 150,
            tutorName: doc.tutorId?.name || doc.tutorName || DUMMY_NOTE.tutorName,
            tutorUniversity: doc.tutorId?.university || DUMMY_NOTE.tutorUniversity,
          })
        } else if (isMounted) {
          setNote({ ...DUMMY_NOTE, id: id || 'note_123' })
        }
      } catch {
        if (isMounted) setNote({ ...DUMMY_NOTE, id: id || 'note_123' })
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchNote()
    return () => {
      isMounted = false
    }
  }, [id])

  const handleMakePayment = () => {
    if (onNavigate) {
      onNavigate(`/notes/${note?.id || 'note_123'}/payment`)
    } else {
      window.location.assign(`/notes/${note?.id || 'note_123'}/payment`)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-surface font-body">
        <div className="flex flex-col items-center gap-3 text-primary">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-secondary-container border-t-transparent" />
          <p className="text-sm font-medium text-on-surface-variant">Loading note details...</p>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="flex h-screen w-screen flex-col bg-surface font-body text-on-surface">
        <AppNavbar user={user} activeView="marketplace" onNavigate={onNavigate} onLogout={onLogout} />
        <main className="flex flex-1 flex-col items-center justify-center p-6 text-center">
          <h1 className="text-2xl font-bold text-primary font-display">Note Not Found</h1>
          <p className="mt-2 text-sm text-on-surface-variant">The requested study note is no longer available.</p>
          <button
            type="button"
            onClick={() => (onNavigate ? onNavigate('marketplace') : window.location.assign('/market'))}
            className="mt-4 rounded-full bg-primary px-6 py-2.5 text-xs font-bold text-on-primary shadow-level-1 hover:bg-primary-container transition-colors cursor-pointer"
          >
            Browse Marketplace
          </button>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen w-full overflow-x-hidden flex-col bg-surface font-body text-on-surface antialiased mesh-bg">
      {/* Top Navbar */}
      <AppNavbar
        user={user}
        activeView="marketplace"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      {/* Main Content */}
      <main className="mx-auto flex flex-1 flex-col w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Top Breadcrumb & Header Row */}
        <div className="mb-4 flex shrink-0 flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
          <nav className="flex flex-wrap items-center gap-1.5 text-on-surface-variant font-medium">
            <button
              type="button"
              onClick={() => (onNavigate ? onNavigate('marketplace') : window.location.assign('/market'))}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Marketplace
            </button>
            <IconChevronRight size={14} className="text-outline" />
            <span className="text-on-surface-variant">{note.department}</span>
            <IconChevronRight size={14} className="text-outline" />
            <span className="font-semibold text-on-surface truncate max-w-xs">{note.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-surface-variant bg-surface-lowest px-2.5 py-0.5 text-[11px] font-semibold text-on-surface shadow-2xs">
              <IconStarFilled size={12} className="text-amber-400" />
              <span>{note.tutorRating} ({note.tutorReviewsCount})</span>
            </span>
            <span className="rounded-full bg-primary-container px-2.5 py-0.5 text-[11px] font-bold text-on-primary-container">
              {note.code}
            </span>
            <span className="text-[11px] text-outline">Updated {note.lastUpdated}</span>
          </div>
        </div>

        {/* 2-Column Bento Grid */}
        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-12 pb-1">
          {/* Left Column: 3-Image Slide Preview Stage & Quick Highlights (7 Cols) */}
          <DocumentCarousel note={note} handleMakePayment={handleMakePayment} />

          {/* Right Column: Clean Purchase & Seller Details (5 Cols) */}
          <div className="flex w-full flex-col justify-between gap-3 lg:col-span-5">
            {/* Purchase & Specs Card */}
            <PurchaseCard note={note} handleMakePayment={handleMakePayment} />

            {/* Seller Profile Card (Below Payment Card) */}
            <div className="flex flex-col items-center rounded-2xl border border-surface-variant bg-surface-lowest p-4 text-center shadow-level-1">
              <div className="relative mb-2 h-16 w-16 overflow-hidden rounded-full border-2 border-secondary-container">
                <img
                  src={note.tutorAvatar}
                  alt={note.tutorName}
                  className="h-full w-full object-cover"
                />
                <div className="absolute right-0 bottom-0 flex h-4 w-4 items-center justify-center rounded-full border-2 border-surface bg-secondary-container">
                  <IconCircleCheckFilled size={11} className="text-on-secondary-container" />
                </div>
              </div>
              <h2 className="text-sm font-bold text-primary font-display leading-tight">{note.tutorName}</h2>
              <p className="text-xs text-on-surface-variant mt-0.5">
                {note.tutorRole} · {note.tutorUniversity}
              </p>
              <div className="my-2 flex items-center justify-center gap-1 text-xs text-on-surface-variant">
                <IconStarFilled size={13} className="text-amber-400" />
                <span className="font-semibold text-on-surface">{note.tutorRating}</span>
                <span>({note.tutorReviewsCount} ratings)</span>
              </div>
              <button
                type="button"
                onClick={() => (onNavigate ? onNavigate('/chat/sarah-jenkins') : window.location.assign('/chat/sarah-jenkins'))}
                className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-surface-low border border-surface-variant py-2.5 text-xs font-bold text-on-surface hover:bg-surface-high hover:text-primary transition-colors active:scale-95 cursor-pointer"
              >
                <IconMessageCircle size={15} />
                <span>Message Seller</span>
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer onNavigate={onNavigate} user={user} />
    </div>
  )
}
