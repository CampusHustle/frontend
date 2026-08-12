import React from 'react';

const NoteCard = ({
  courseCode,
  price,
  rating,
  reviewCount,
  title,
  authorName,
  authorAvatar,
  isVerified = false
}) => {
  return (
    <div className="m-2 flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-200 hover:shadow-md max-[280px]:m-1 max-[280px]:max-w-full">
      <div className="relative flex h-36 items-center justify-center bg-gray-200 sm:h-44 max-[280px]:h-28">
        <span className="text-4xl font-extrabold tracking-wider text-gray-300 sm:text-5xl max-[280px]:text-3xl">
          {courseCode}
        </span>

        <div className="absolute right-3 top-3 rounded-full bg-white px-3 py-1.5 text-sm font-bold text-gray-800 shadow-sm max-[280px]:px-2 max-[280px]:py-1 max-[280px]:text-xs">
          {price}
        </div>
      </div>

      <div className="flex flex-col gap-3 p-5 max-[280px]:gap-2 max-[280px]:p-3">
        <div className="flex items-center gap-3 text-sm max-[280px]:gap-2">
          <span className="rounded-md border border-gray-200 bg-white px-2 py-1 text-[10px] font-semibold text-gray-700 max-[280px]:px-1.5">
            {courseCode}
          </span>

          <div className="flex items-center text-sm font-medium text-gray-700 max-[280px]:text-xs">
            <span className="mr-1 text-base text-yellow-500">★</span>
            {rating}
            <span className="ml-1 font-normal text-gray-400">({reviewCount})</span>
          </div>
        </div>

        <h3 className="line-clamp-2 min-h-[3rem] text-lg font-bold leading-tight text-gray-900 max-[280px]:text-base max-[280px]:min-h-[2.5rem]">
          {title}
        </h3>

        <div className="mt-2 flex items-center gap-2 max-[280px]:gap-1.5">
          <img
            src={authorAvatar || "/api/placeholder/24/24"}
            alt={authorName}
            className="h-6 w-6 rounded-full object-cover max-[280px]:h-5 max-[280px]:w-5"
          />
          <span className="text-xs font-medium text-gray-600 max-[280px]:text-[10px]">
            {authorName}
          </span>

          {isVerified && (
            <svg
              className="h-4 w-4 text-blue-500 max-[280px]:h-3.5 max-[280px]:w-3.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteCard;