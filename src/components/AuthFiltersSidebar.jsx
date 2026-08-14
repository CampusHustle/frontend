import React from 'react';

export default function AuthFiltersSidebar() {
  return (
    <aside className="w-full md:w-64 flex-shrink-0 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit min-w-0">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        <button className="text-xs font-semibold text-amber-500 hover:text-amber-600">Clear All</button>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Category</h4>
        <div className="space-y-3">
          {['Computer Science', 'Economics', 'Mathematics'].map((category) => (
            <label key={category} className="flex items-center space-x-3 cursor-pointer min-w-0">
              <input 
                type="checkbox" 
                className="form-checkbox h-4 w-4 text-amber-500 rounded border-gray-300 focus:ring-amber-500" 
                defaultChecked={category === 'Computer Science'}
              />
              <span className="text-sm text-gray-600 break-words">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Content Type Filter */}
      <div className="mb-8">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Content Type</h4>
        <div className="flex flex-wrap gap-2">
          <button className="rounded-full bg-gray-900 px-4 py-1.5 text-xs font-medium text-white">All</button>
          <button className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-50 transition-colors">PDF Notes</button>
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Max Price</h4>
        <input 
          type="range" 
          min="0" 
          max="100" 
          defaultValue="50" 
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>Free</span>
          <span>$50</span>
          <span>$100+</span>
        </div>
      </div>
    </aside>
  );
}