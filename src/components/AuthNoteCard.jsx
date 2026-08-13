import React from 'react';

const AuthNoteCard = ({
  coverImage,
  contentType,
  price,
  title,
  course,
  authorAvatar,
  authorName
}) => {
  return (
    <div className="flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md">
      
      {/* Top Image Area */}
      <div className="relative h-44 w-full bg-gray-100">
        <img 
          src={coverImage || "/api/placeholder/400/250"} 
          alt={title || "Note Cover"}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Bottom Content Area */}
      <div className="flex flex-col gap-3 p-5">
        
        <div className="flex items-center justify-between gap-2">
          <span className="rounded bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-700">
            {contentType || "NOTE"}
          </span>
          <span className="text-lg font-extrabold text-gray-900">
            {price || "Free"}
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-[3rem] text-lg font-bold leading-tight text-gray-900">
          {title || "Untitled Note"}
        </h3>
        
        {/* Course Label */}
        <div className="text-xs font-semibold text-blue-900 bg-blue-50 w-fit px-2 py-1 rounded">
          {course || "General Academic"}
        </div>

        <div className="mt-2 flex items-center gap-2">
          <img
            src={authorAvatar || "/api/placeholder/24/24"}
            alt={authorName || "Author"}
            className="h-6 w-6 rounded-full object-cover"
          />
          <span className="text-sm font-medium text-gray-600 break-words">
            {authorName || "Unknown Author"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthNoteCard;