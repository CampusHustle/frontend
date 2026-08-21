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

function formatDbNoteDetail(doc, id) {
  if (!doc) return null
  const tutor = doc.tutorId || {}
  const priceNum = typeof doc.price === 'number' ? doc.price : 0
  const ratingObj = typeof tutor.rating === 'object' && tutor.rating !== null ? tutor.rating : {}
  const ratingKnowledge = typeof ratingObj.knowledge === 'number' ? ratingObj.knowledge : 5.0
  const ratingCount = typeof ratingObj.count === 'number' ? ratingObj.count : 1

  return {
    id: doc._id || doc.id || id,
    _id: doc._id || doc.id || id,
    title: doc.title || 'Academic Study Notes',
    course: doc.course || 'General Academic',
    code: doc.course || 'COURSE',
    department: doc.department || tutor.department || 'Academic',
    lastUpdated: doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently',
    tutorId: tutor._id || tutor.id || null,
    tutorName: tutor.name || 'Campus Contributor',
    tutorRole: `${tutor.department || 'Student'} Contributor`,
    tutorUniversity: tutor.university || 'Ethiopian University',
    tutorRating: ratingKnowledge.toFixed(1),
    tutorReviewsCount: ratingCount,
    tutorAvatar: tutor.profilePicUrl || null,
    price: priceNum,
    priceEtb: priceNum,
    format: doc.fileUrl?.endsWith('.pdf') ? 'Digital PDF' : 'Study Notes',
    length: `${doc.previewPages || 4} Preview Pages`,
    sales: `${doc.purchaseCount || 0} Downloads`,
    previewPagesCount: doc.previewPages || 4,
    previewSlides: [
      {
        id: 1,
        title: `${doc.title || 'Note'} - High-Yield Overview`,
        url: doc.coverImage || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&q=80',
      },
      {
        id: 2,
        title: `Key Formulas & Concepts - ${doc.course || 'Lecture'}`,
        url: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=800&q=80',
      },
      {
        id: 3,
        title: 'Worked Practice Problems & Exam Solutions',
        url: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=800&q=80',
      },
    ],
    description: doc.description || `Comprehensive study notes and reference material for ${doc.course || 'this course'}. Includes worked examples, summaries, and exam prep tips.`,
    whatsInside: [
      `High-yield exam summaries & lecture notes for ${doc.course || 'this subject'}`,
      'Verified peer-reviewed material',
      'Instant digital download & offline access',
    ],
    fileUrl: doc.fileUrl,
  }
}

export default function NoteDetailScreen({ user, onNavigate, onLogout }) {
  const { id } = useParams()
  const noteId = id || 'note_123'
  const [note, setNote] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function fetchNote() {
      if (!noteId) {
        if (isMounted) setIsLoading(false)
        return
      }
      try {
        const res = await getNoteById(noteId)
        if (isMounted && (res?.note || res?.data)) {
          const doc = res.note || res.data
          setNote(formatDbNoteDetail(doc, noteId))
        } else if (isMounted) {
          setNote(null)
        }
      } catch {
        if (isMounted) setNote(null)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchNote()

    return () => {
      isMounted = false
    }
  }, [noteId])

  const handleMakePayment = () => {
    if (!note?.id) return
    if (onNavigate) {
      onNavigate(`/notes/${note.id}/payment`)
    } else {
      window.location.assign(`/notes/${note.id}/payment`)
    }
  }

  const handleMessageSeller = () => {
    const target = note?.tutorId ? `/chat/${note.tutorId}` : '/chat'
    if (onNavigate) {
      onNavigate(target)
    } else {
      window.location.assign(target)
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
          <p className="mt-2 text-sm text-on-surface-variant">The requested study note is no longer available in the database.</p>
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
              <div className="relative mb-2 h-16 w-16 overflow-hidden rounded-full border-2 border-secondary-container flex items-center justify-center bg-surface-container">
                {note.tutorAvatar ? (
                  <img
                    src={note.tutorAvatar}
                    alt={note.tutorName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full bg-primary text-on-primary flex items-center justify-center font-bold text-xl">
                    {(note.tutorName || 'T')[0]?.toUpperCase()}
                  </div>
                )}
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
                onClick={handleMessageSeller}
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
