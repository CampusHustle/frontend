// src/components/AuthFiltersSidebar.jsx
import React from 'react';

export default function AuthFiltersSidebar() {
  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-gray-800 p-3 sm:p-4 md:p-6 rounded-xl border border-gray-700 shadow-sm h-fit">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-white">Filters</h3>
        <button className="text-[10px] sm:text-xs font-semibold text-yellow-500 hover:text-yellow-400 shrink-0 transition-colors">Clear All</button>
      </div>

      {/* Category Filter */}
      <div className="mb-6 sm:mb-8">
        <h4 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">Category</h4>
        <div className="space-y-2 sm:space-y-3">
          {['Computer Science', 'Economics', 'Mathematics'].map((category) => (
            <label key={category} className="flex items-start space-x-2 sm:space-x-3 cursor-pointer group">
              <div className={`mt-0.5 sm:mt-1 w-3.5 h-3.5 sm:w-4 sm:h-4 rounded border flex items-center justify-center transition-colors flex-shrink-0 ${category === 'Computer Science' ? 'bg-yellow-500 border-yellow-500' : 'bg-gray-900 border-gray-600 group-hover:border-yellow-500'}`}>
                {category === 'Computer Science' && (
                    <svg className="w-3 h-3 text-gray-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
              </div>
              <span className={`text-xs sm:text-sm break-words flex-1 min-w-0 transition-colors ${category === 'Computer Science' ? 'text-white' : 'text-gray-400 group-hover:text-yellow-500'}`}>{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Content Type Filter */}
      <div className="mb-6 sm:mb-8">
        <h4 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">Content Type</h4>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          <button className="rounded-full bg-yellow-500 px-2.5 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-bold text-gray-900 max-w-full truncate">All</button>
          <button className="rounded-full border border-gray-700 bg-gray-900 px-2.5 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-gray-400 hover:text-white hover:border-gray-500 transition-colors max-w-full truncate">Video</button>
          <button className="rounded-full border border-gray-700 bg-gray-900 px-2.5 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium text-gray-400 hover:text-white hover:border-gray-500 transition-colors max-w-full truncate">PDF Notes</button>
        </div>
      </div>

      {/* Minimum Rating Slider */}
      <div>
        <h4 className="text-xs sm:text-sm font-semibold text-white mb-2 sm:mb-3">Minimum Rating</h4>
        <div className="relative w-full h-1.5 bg-gray-700 rounded-full mt-2">
           <div className="absolute top-0 left-0 h-1.5 bg-yellow-500 rounded-full" style={{ width: '80%' }}></div>
           <div className="absolute top-1/2 left-[80%] -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-500 border-2 border-gray-800 rounded-full cursor-pointer shadow-md"></div>
        </div>
        <div className="flex justify-between text-[9px] sm:text-xs text-gray-500 mt-2">
          <span>1</span>
          <span className="text-white">4.0+</span>
          <span>5</span>
        </div>
      </div>
    </aside>
  );
}