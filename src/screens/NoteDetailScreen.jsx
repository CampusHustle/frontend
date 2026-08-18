import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  IconBrain,
  IconCircleCheckFilled,
  IconFileCertificate,
  IconFileText,
  IconLock,
  IconReceipt,
  IconSchool,
  IconShieldCheck,
  IconSparkles,
  IconStarFilled,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import Footer from '../components/Footer.jsx'
import DocumentCarousel from '../components/DocumentCarousel.jsx'

const DUMMY_NOTE = {
  id: 'note_123',
  title: 'CS101 Midterm Complete Study Guide & Practice Problems',
  course: 'Computer Science 101',
  tutorName: 'Alex Johnson',
  tutorUniversity: 'Addis Ababa University',
  department: 'Computer Science',
  tutorRating: 4.9,
  tutorReviewsCount: 38,
  description:
    'A comprehensive 40-page study guide covering all topics for the midterm exam. Includes detailed handwritten notes on Data Structures, Algorithms, time complexity cheat sheets, and 15 practice problems with step-by-step solutions.',
  priceEtb: 150,
  priceUsd: 15.0,
  purchaseCount: 142,
  pagesCount: 40,
  format: 'PDF with Searchable OCR',
  createdAt: '2026-08-10T10:00:00Z',
  topics: [
    'Asymptotic Analysis & Big-O Notation',
    'Singly and Doubly Linked Lists',
    'Stack & Queue Implementation in C++/Python',
    'Binary Search Trees & Tree Traversals',
    'Recursion & Dynamic Programming Essentials',
    '15 Solved Midterm Exam Questions',
  ],
  previewPages: [
    'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop',
  ],
}

export default function NoteDetailScreen({ user, onNavigate, onLogout }) {
  const { id } = useParams()
  const [note, setNote] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3 text-primary">
          <div className="size-8 animate-spin rounded-full border-3 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-on-surface-variant">Loading note details...</p>
        </div>
      </div>
    )
  }

  if (!note) {
    return (
      <div className="flex min-h-screen flex-col bg-surface">
        <AppNavbar user={user} activeView="marketplace" onNavigate={onNavigate} onLogout={onLogout} />
        <main className="mx-auto flex max-w-7xl flex-1 flex-col items-center justify-center p-8 text-center">
          <p className="text-xl font-bold text-primary">Note not found.</p>
          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('marketplace') : window.history.back()}
            className="mt-4 rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-on-primary"
          >
            Browse Marketplace
          </button>
        </main>
        <Footer onNavigate={onNavigate} />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <AppNavbar
        user={user}
        activeView="marketplace"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex flex-wrap items-center gap-2 text-xs font-medium text-on-surface-variant">
          <button
            type="button"
            onClick={() => onNavigate ? onNavigate('marketplace') : window.location.assign('/market')}
            className="transition-colors hover:text-primary"
          >
            Marketplace
          </button>
          <span>/</span>
          <span className="text-primary">{note.course}</span>
          <span>/</span>
          <span className="truncate max-w-xs text-outline">{note.title}</span>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          {/* Main Column: Preview & Detailed Content */}
          <div className="space-y-8 lg:col-span-8">
            {/* Header Title & Author */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="rounded-md bg-surface-high px-2.5 py-1 text-xs font-bold text-primary">
                  {note.course}
                </span>
                <span className="rounded-md bg-emerald-500/10 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  {note.format}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-bold text-primary leading-tight">
                {note.title}
              </h1>

              {/* Author & Stats Strip */}
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-on-surface-variant border-y border-surface-variant py-3">
                <div className="flex items-center gap-1.5 font-medium text-primary">
                  <IconSchool size={16} className="text-hustle-600" />
                  <span>{note.tutorName} · {note.tutorUniversity}</span>
                </div>
                <div className="flex items-center gap-1">
                  <IconStarFilled size={14} className="text-secondary" />
                  <span className="font-semibold text-primary">{note.tutorRating}</span>
                  <span>({note.tutorReviewsCount} reviews)</span>
                </div>
                <div>
                  <strong className="text-primary">{note.purchaseCount}</strong> student downloads
                </div>
              </div>
            </div>

            {/* Document Preview Section */}
            <div className="rounded-2xl border border-surface-variant bg-surface-lowest p-5 sm:p-6 shadow-level-1 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconFileText size={20} className="text-hustle-600" />
                  <h2 className="text-lg font-bold text-primary">Interactive Document Preview</h2>
                </div>
                <span className="rounded-full bg-surface-high px-3 py-1 text-xs font-semibold text-primary">
                  Free Sample ({note.previewPages.length} Pages)
                </span>
              </div>

              <DocumentCarousel previewPages={note.previewPages} />

              <div className="flex items-center justify-between rounded-xl bg-surface-low p-3.5 text-xs text-on-surface-variant">
                <div className="flex items-center gap-2">
                  <IconLock size={16} className="text-outline" />
                  <span>Remaining <strong>{note.pagesCount - note.previewPages.length} pages</strong> unlock automatically upon payment verification.</span>
                </div>
              </div>
            </div>

            {/* Topics & Description Section */}
            <div className="rounded-2xl border border-surface-variant bg-surface-lowest p-6 shadow-level-1 space-y-6">
              <div>
                <h3 className="text-base font-bold font-display text-primary mb-2">Description & Syllabus Coverage</h3>
                <p className="text-sm leading-relaxed text-on-surface-variant">{note.description}</p>
              </div>

              {/* Topics Covered Chips */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-outline mb-3">Key Topics Included:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {note.topics.map((topic, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-lg bg-surface-low p-2.5 text-xs text-on-surface border border-surface-variant">
                      <IconCircleCheckFilled size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Value Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-xl border border-surface-variant bg-surface-lowest p-4 text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 mb-2">
                  <IconFileCertificate size={20} />
                </div>
                <p className="text-xs font-bold text-primary">OCR Clean Conversion</p>
                <p className="text-[11px] text-on-surface-variant mt-1">High-clarity text extracted from lecturer notes.</p>
              </div>

              <div className="rounded-xl border border-surface-variant bg-surface-lowest p-4 text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 mb-2">
                  <IconBrain size={20} />
                </div>
                <p className="text-xs font-bold text-primary">AI Study Assistant Ready</p>
                <p className="text-[11px] text-on-surface-variant mt-1">RAG question-answering grounded in this document.</p>
              </div>

              <div className="rounded-xl border border-surface-variant bg-surface-lowest p-4 text-center">
                <div className="mx-auto flex size-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 mb-2">
                  <IconShieldCheck size={20} />
                </div>
                <p className="text-xs font-bold text-primary">Manual Verification</p>
                <p className="text-[11px] text-on-surface-variant mt-1">Secure receipt approval via Telebirr & CBE.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Purchase & Payment Initiation Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 rounded-2xl border border-surface-variant bg-surface-lowest p-6 shadow-level-2 space-y-6">
              {/* Price Display */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-outline">Unlock Full Document</span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-primary font-display">
                    {note.priceEtb} ETB
                  </span>
                  <span className="text-sm font-semibold text-on-surface-variant">
                    (${note.priceUsd.toFixed(2)} USD)
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant mt-1">
                  One-time payment for lifetime document & AI Study Assistant access.
                </p>
              </div>

              {/* Specs Table */}
              <div className="rounded-xl border border-surface-variant bg-surface-low p-4 text-xs space-y-2.5">
                <div className="flex justify-between">
                  <span className="text-outline">Total Length:</span>
                  <strong className="text-primary">{note.pagesCount} Pages</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Format:</span>
                  <strong className="text-primary">{note.format}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Tutor:</span>
                  <strong className="text-primary">{note.tutorName}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-outline">Accepted Payment:</span>
                  <strong className="text-emerald-700 font-bold">Telebirr, CBE, BOA</strong>
                </div>
              </div>

              {/* Primary Action Button -> Redirects to Manual Payment & Receipt Page */}
              <button
                type="button"
                onClick={handleMakePayment}
                className="w-full flex items-center justify-center gap-2.5 rounded-xl bg-hustle-500 px-6 py-4 text-center text-base font-bold text-ink-contrast shadow-sm transition-all hover:bg-hustle-400 hover:shadow-md active:scale-95"
              >
                <IconReceipt size={20} />
                <span>Make Payment (Purchase)</span>
              </button>

              <div className="rounded-xl border border-dashed border-surface-variant p-3.5 text-center text-xs text-on-surface-variant space-y-1">
                <div className="flex items-center justify-center gap-1.5 font-semibold text-primary">
                  <IconSparkles size={15} className="text-hustle-600" />
                  <span>How manual verification works</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Click <strong>Make Payment</strong>, transfer via Telebirr/CBE, and upload the transaction receipt screenshot. Once approved, the document unlocks immediately.
                </p>
              </div>

              <div className="flex items-center justify-center gap-2 text-xs text-outline pt-2 border-t border-surface-variant">
                <IconShieldCheck size={16} className="text-emerald-600" />
                <span>Verified Ethiopian Student Network</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
