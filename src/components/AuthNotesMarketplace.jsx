import React from 'react'
import AuthNoteCard from './AuthNoteCard'

export const dummyNotes = [
  {
    id: 1,
    contentType: 'PDF NOTES',
    price: '$24.00',
    numericPrice: 24,
    title: 'Advanced Data Structures & Algorithms',
    course: 'CS 301',
    department: 'Computer Science',
    authorName: 'Prof. John Doe',
    authorAvatar: 'https://i.pravatar.cc/150?u=john',
    coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80',
  },
  {
    id: 2,
    contentType: 'PDF NOTES',
    price: '$15.00',
    numericPrice: 15,
    title: 'Macroeconomics Midterm Master Notes',
    course: 'ECON 201',
    department: 'Economics',
    authorName: 'Sarah Jenkins',
    authorAvatar: 'https://i.pravatar.cc/150?u=sarah',
    coverImage: 'https://images.unsplash.com/photo-1611095790444-1dfa35e37b52?w=400&q=80',
  },
  {
    id: 3,
    contentType: 'PDF + QUIZ',
    price: '$18.50',
    numericPrice: 18.5,
    title: 'Organic Chemistry 101: Reaction Mechanisms',
    course: 'CHEM 101',
    department: 'Chemistry',
    authorName: 'Michael Chang',
    authorAvatar: 'https://i.pravatar.cc/150?u=michael',
    coverImage: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=80',
  },
  {
    id: 4,
    contentType: 'Exam Prep',
    price: '$29.00',
    numericPrice: 29,
    title: 'Calculus III Comprehensive Review & Practice Solutions',
    course: 'MATH 302',
    department: 'Mathematics',
    authorName: 'Elena Rostova',
    authorAvatar: 'https://i.pravatar.cc/150?u=elena',
    coverImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=80',
  },
  {
    id: 5,
    contentType: 'PDF NOTES',
    price: '$12.00',
    numericPrice: 12,
    title: 'Linear Algebra Summary Cheat Sheets',
    course: 'MATH 201',
    department: 'Mathematics',
    authorName: 'Alex Rivera',
    authorAvatar: 'https://i.pravatar.cc/150?u=alex',
    coverImage: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&q=80',
  },
  {
    id: 6,
    contentType: 'PDF + QUIZ',
    price: '$22.00',
    numericPrice: 22,
    title: 'Machine Learning Fundamentals & Math Review',
    course: 'CS 440',
    department: 'Computer Science',
    authorName: 'David Kim',
    authorAvatar: 'https://i.pravatar.cc/150?u=david',
    coverImage: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&q=80',
  },
]

export default function AuthNotesMarketplace({ notes = dummyNotes, visibleCount = 6, onLoadMore }) {
  if (notes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-surface-variant bg-surface-lowest p-12 text-center shadow-sm">
        <h3 className="font-display text-lg font-bold text-primary">No resources found</h3>
        <p className="mt-1 text-sm text-on-surface-variant">
          Try expanding your search query or loosening your price and filter options.
        </p>
      </div>
    )
  }

  const visibleItems = notes.slice(0, visibleCount)

  return (
    <div className="flex flex-col flex-1">
      {/* The Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleItems.map((note) => (
          <AuthNoteCard
            key={note.id}
            contentType={note.contentType}
            price={note.price}
            title={note.title}
            course={note.course}
            authorName={note.authorName}
            authorAvatar={note.authorAvatar}
            coverImage={note.coverImage}
          />
        ))}
      </div>

      {/* Load More Button */}
      {visibleCount < notes.length && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={onLoadMore}
            className="rounded-lg border border-surface-variant bg-surface-lowest px-6 py-2.5 text-sm font-semibold text-primary shadow-level-1 hover:bg-surface-low transition-colors"
          >
            Load More Resources ({notes.length - visibleCount} remaining)
          </button>
        </div>
      )}
    </div>
  )
}