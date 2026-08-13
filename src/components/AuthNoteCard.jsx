import React from 'react';

const AuthNoteCard = ({
  coverImage,
  rating,
  contentType,
  price,
  title,
  authorAvatar,
  authorName
}) => {
  return (
    <div className="flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md max-[230px]:max-w-full max-[230px]:rounded-xl max-[230px]:border-gray-200">
      
      {/* Top Image Area */}
      <div className="relative h-44 w-full bg-gray-100 max-[230px]:h-32">
        <img 
          src={coverImage || "/api/placeholder/400/250"} 
          alt={title}
          className="h-full w-full object-cover"
        />
        
        {/* Floating Rating Badge */}
        <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-white px-2 py-1 text-xs font-bold text-gray-800 shadow-sm max-[230px]:right-2 max-[230px]:top-2 max-[230px]:px-1.5 max-[230px]:py-0.5 max-[230px]:text-[10px]">
          <span className="text-yellow-500">★</span> {rating}
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="flex flex-col gap-3 p-5 max-[230px]:gap-2 max-[230px]:p-3">
        
        <div className="flex items-center justify-between gap-2 max-[230px]:items-start">
          <span className="rounded bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-700 max-[230px]:px-1.5 max-[230px]:py-0.5 max-[230px]:text-[8px]">
            {contentType}
          </span>
          <span className="text-lg font-extrabold text-gray-900 max-[230px]:text-base">
            {price}
          </span>
        </div>

        <h3 className="line-clamp-2 min-h-[3rem] text-lg font-bold leading-tight text-gray-900 max-[230px]:min-h-0 max-[230px]:text-sm max-[230px]:leading-snug">
          {title}
        </h3>

        <div className="mt-2 flex items-center gap-2 max-[230px]:mt-1 max-[230px]:gap-1.5">
          <img
            src={authorAvatar || "/api/placeholder/24/24"}
            alt={authorName}
            className="h-6 w-6 rounded-full object-cover max-[230px]:h-5 max-[230px]:w-5"
          />
          <span className="text-sm font-medium text-gray-600 max-[230px]:text-[11px] break-words">
            {authorName}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthNoteCard;