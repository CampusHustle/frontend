// src/components/AuthNoteCard.jsx
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
    const isVideo = contentType?.includes('VIDEO');

    return (
        <div className="flex w-full max-w-sm mx-auto flex-col overflow-hidden rounded-2xl border border-gray-700 bg-gray-800 shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-yellow-500/10 hover:-translate-y-1">

            {/* Top Image Area */}
            <div className="relative h-40 sm:h-44 w-full bg-gray-900 shrink-0 border-b border-gray-700">
                <img
                    src={coverImage || "/api/placeholder/400/250"}
                    alt={title || "Cover Image"}
                    className="h-full w-full object-cover opacity-90"
                    onError={(e) => {
                        e.target.src = "/api/placeholder/400/250";
                    }}
                />

                {/* Floating Rating Badge */}
                {rating && (
                    <div className="absolute right-3 top-3 flex items-center gap-1 rounded-md bg-gray-900/90 px-2 py-1 text-xs font-bold text-white shadow-sm border border-gray-700 backdrop-blur-sm">
                        <span className="text-yellow-500">★</span> {rating}
                    </div>
                )}
            </div>

            {/* Bottom Content Area */}
            <div className="flex flex-col gap-3 p-4 sm:p-5 h-full">

                <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span 
                        className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider truncate max-w-[65%] ${
                            isVideo 
                                ? 'bg-yellow-500 text-gray-900' 
                                : 'bg-gray-900 border border-gray-700 text-gray-300'
                        }`}
                        title={contentType || "Resource"}
                    >
                        {contentType || "Resource"}
                    </span>
                    <span className="text-base sm:text-lg font-extrabold text-yellow-500 shrink-0">
                        {price || "Free"}
                    </span>
                </div>

                <h3 
                    className="line-clamp-2 min-h-[2.75rem] sm:min-h-[3rem] text-base sm:text-lg font-bold leading-tight text-gray-100"
                    title={title}
                >
                    {title || "Untitled Resource"}
                </h3>

                <div className="mt-auto pt-2 flex items-center gap-2 overflow-hidden border-t border-gray-700/50">
                    <img
                        src={authorAvatar || "/api/placeholder/24/24"}
                        alt={authorName || "Author"}
                        className="h-6 w-6 rounded-full object-cover shrink-0 border border-gray-600 mt-2"
                        onError={(e) => {
                            e.target.src = "/api/placeholder/24/24";
                        }}
                    />
                    <span 
                        className="text-xs sm:text-sm font-medium text-gray-400 truncate mt-2"
                        title={authorName || "Anonymous"}
                    >
                        {authorName || "Anonymous"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AuthNoteCard;