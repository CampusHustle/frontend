import React from 'react';

export default function AuthFiltersSidebar() {
  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-fit max-[185px]:p-3 max-[185px]:rounded-lg max-[185px]:border-gray-200 min-w-0">
      <div className="flex items-center justify-between mb-6 max-[185px]:mb-4">
        <h3 className="text-lg font-bold text-gray-900 max-[185px]:text-base">Filters</h3>
        <button className="text-xs font-semibold text-orange-500 hover:text-orange-600 max-[185px]:text-[10px]">Clear All</button>
      </div>

      {/* Category Filter */}
      <div className="mb-8 max-[185px]:mb-5">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 max-[185px]:mb-2 max-[185px]:text-xs">Category</h4>
        <div className="space-y-3 max-[185px]:space-y-2">
          {['Computer Science', 'Economics', 'Mathematics'].map((category) => (
            <label key={category} className="flex items-center space-x-3 cursor-pointer max-[185px]:space-x-2 min-w-0">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-blue-900 rounded border-gray-300 focus:ring-blue-900 max-[185px]:h-3.5 max-[185px]:w-3.5" 
                defaultChecked={category === 'Computer Science'}
              />
              <span className="text-sm text-gray-600 break-words max-[185px]:text-[10px]">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Content Type Filter */}
      <div className="mb-8 max-[185px]:mb-5">
        <h4 className="text-sm font-semibold text-gray-900 mb-3 max-[185px]:mb-2 max-[185px]:text-xs">Content Type</h4>
        <div className="flex flex-wrap gap-2 max-[185px]:gap-1.5 max-[185px]:justify-center">
          <button className="rounded-full bg-blue-950 px-4 py-1.5 text-xs font-medium text-white max-[185px]:px-2 max-[185px]:py-1 max-[185px]:text-[9px]">All</button>
          <button className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors max-[185px]:px-2 max-[185px]:py-1 max-[185px]:text-[9px]">Video</button>
          <button className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors max-[185px]:px-2 max-[185px]:py-1 max-[185px]:text-[9px]">PDF Notes</button>
        </div>
      </div>

      {/* Minimum Rating Slider */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3 max-[185px]:mb-2 max-[185px]:text-xs">Minimum Rating</h4>
        <input 
          type="range" 
          min="1" 
          max="5" 
          defaultValue="4" 
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-orange-500 max-[185px]:h-0.5"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2 max-[185px]:mt-1 max-[185px]:text-[9px]">
          <span>1</span>
          <span>4.0+</span>
          <span>5</span>
        </div>
      </div>
    </aside>
  );
}