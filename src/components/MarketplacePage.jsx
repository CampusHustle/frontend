// src/components/MarketplacePage.jsx
import React from 'react';
import FiltersSidebar from './FiltersSidebar';
import NotesMarketplace from './NotesMarketplace';

export default function MarketplacePage() {
  const PageHeader = (
    <div className="mb-8 flex flex-col items-start justify-between border-b border-gray-200 pb-6 sm:flex-row sm:items-end">
      <div className="w-full sm:w-auto">
        <h1 className="text-4xl font-extrabold tracking-tight text-yellow-600 max-[224px]:text-2xl">
          Study Notes
        </h1>
        <p className="mt-2 text-gray-500 max-[224px]:text-xs">
          High-quality, student-verified notes for top courses.
        </p>
      </div>

      <div className="mt-4 flex w-full items-center gap-2 sm:mt-0 sm:w-auto max-[224px]:mt-3 max-[224px]:flex-col max-[224px]:items-stretch">
        <span className="text-sm text-gray-500 max-[224px]:text-xs">Sort by:</span>
        <select className="w-full min-w-0 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-auto max-[224px]:px-2 max-[224px]:py-1 max-[224px]:text-[10px]">
          <option>Most Popular</option>
          <option>Newest</option>
          <option>Price: Low to High</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 font-sans sm:px-6 lg:px-8">
      <div className="block md:hidden">{PageHeader}</div>

      <div className="flex flex-col gap-8 md:flex-row">
        <div className="w-full flex-shrink-0 md:w-64">
          <FiltersSidebar />
        </div>

        <div className="flex-1 pr-4">
          <div className="hidden md:block">{PageHeader}</div>
          <NotesMarketplace />
        </div>
      </div>
    </div>
  );
}