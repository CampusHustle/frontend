// src/components/FiltersSidebar.jsx
import React from 'react';

export default function FiltersSidebar() {
  return (
    <aside className="w-full flex-shrink-0 rounded-xl border border-gray-100 bg-gray-50 p-6 md:w-64">
      <h3 className="mb-6 text-lg font-bold text-gray-900">Filters</h3>

      <div className="mb-8">
        <h4 className="mb-3 text-sm font-semibold text-gray-700">Categories</h4>
        <div className="space-y-2">
          {['Computer Science', 'Mathematics', 'Physics', 'Economics'].map((category) => (
            <label
              key={category}
              className="flex min-w-0 cursor-pointer items-start gap-3"
            >
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 text-blue-600 focus:ring-blue-500 max-[180px]:h-3.5 max-[180px]:w-3.5"
                defaultChecked={category === 'Computer Science'}
              />
              <span className="min-w-0 flex-1 break-words text-sm leading-snug text-gray-600 max-[180px]:text-[11px]">
                {category}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-gray-700">Price Range</h4>

        <div className="mb-2 h-2 w-full rounded-full bg-gray-200">
          <div className="h-2 w-3/4 rounded-full bg-gray-900"></div>
        </div>
        <div className="flex justify-between text-xs text-gray-500">
          <span>Free</span>
          <span>$50+</span>
        </div>
      </div>
    </aside>
  );
}