import AuthNoteCard from './AuthNoteCard'
import { Link } from 'react-router-dom'

export default function AuthNotesMarketplace({ notes = [], visibleCount = 6, onLoadMore }) {
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
          <Link key={note.id} to={`/notes/${note.id}`} className="block">
            <AuthNoteCard
              contentType={note.contentType}
              price={note.price}
              title={note.title}
              course={note.course}
              authorName={note.authorName}
              authorAvatar={note.authorAvatar}
              coverImage={note.coverImage}
            />
          </Link>
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