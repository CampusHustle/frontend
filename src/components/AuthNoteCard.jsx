import { IconCircleCheckFilled, IconFileText } from '@tabler/icons-react'

const AuthNoteCard = ({
  coverImage,
  contentType,
  price,
  title,
  course,
  authorAvatar,
  authorName,
}) => {
  return (
    <div className="group relative flex w-full flex-col overflow-hidden rounded-xl border border-surface-variant bg-surface-lowest shadow-level-1 transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-level-2">
      {/* Top Image Area */}
      <div className="relative h-44 w-full overflow-hidden bg-surface-low flex items-center justify-center">
        {coverImage ? (
          <img
            src={coverImage}
            alt={title || 'Note Cover'}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-primary/10 via-surface-container to-secondary/10 text-primary">
            <IconFileText size={48} className="opacity-40 group-hover:scale-110 transition-transform duration-300" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="rounded-full bg-surface-lowest/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
            {contentType || 'PDF NOTES'}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className="rounded-xl bg-secondary-container px-3 py-1 text-sm font-black text-on-secondary-container shadow-sm font-display">
            {price || 'Free'}
          </span>
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <div className="mb-2 inline-flex items-center gap-1 rounded-md bg-surface-high px-2.5 py-1 text-xs font-semibold text-on-surface-variant">
            {course || 'General Academic'}
          </div>

          <h3 className="line-clamp-2 font-display text-base font-bold leading-snug text-primary transition-colors group-hover:text-primary-container">
            {title || 'Untitled Note'}
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-surface-variant/60 pt-3">
          <div className="flex items-center gap-2">
            {authorAvatar ? (
              <img
                src={authorAvatar}
                alt={authorName || 'Author'}
                className="size-6 rounded-full border border-surface object-cover shadow-sm"
              />
            ) : (
              <div className="size-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center text-[10px] font-bold">
                {(authorName || 'C')[0]?.toUpperCase()}
              </div>
            )}
            <span className="truncate text-xs font-medium text-on-surface-variant">
              {authorName || 'Verified Contributor'}
            </span>
          </div>

          <IconCircleCheckFilled
            size={16}
            className="text-primary shrink-0"
            title="Verified Contributor"
          />
        </div>
      </div>
    </div>
  )
}

export default AuthNoteCard