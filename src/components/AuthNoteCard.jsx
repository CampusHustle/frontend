import React from 'react'
import { IconCircleCheckFilled } from '@tabler/icons-react'

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
      <div className="relative h-44 w-full overflow-hidden bg-surface-low">
        <img
          src={coverImage || '/api/placeholder/400/250'}
          alt={title || 'Note Cover'}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <span className="rounded-full bg-surface-lowest/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-md">
            {contentType || 'NOTE'}
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
            <img
              src={authorAvatar || 'https://i.pravatar.cc/150'}
              alt={authorName || 'Author'}
              className="size-6 rounded-full border border-surface object-cover shadow-sm"
            />
            <span className="truncate text-xs font-medium text-on-surface-variant">
              {authorName || 'Verified Contributor'}
            </span>
          </div>

          <IconCircleCheckFilled
            size={16}
            className="text-tertiary-container shrink-0"
            title="Verified Contributor"
          />
        </div>
      </div>
    </div>
  )
}

export default AuthNoteCard