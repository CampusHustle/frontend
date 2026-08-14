import React from 'react';

export default function PurchaseCard({ note }) {
  const { title, course, description, price, purchaseCount, tutorName } = note;

  return (
    <div className="sticky top-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-xl">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <span className="inline-block rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
            {course}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-yellow-600 leading-tight">{title}</h1>
          <p className="mt-2 text-sm text-gray-500 font-medium">By {tutorName}</p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-1">Price</p>
            <p className="text-3xl font-extrabold text-gray-900">${price.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-500 mb-1">Purchases</p>
            <p className="text-lg font-bold text-gray-700">{purchaseCount}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">Description</h3>
        <p className="text-base text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>

      <button className="w-full rounded-xl bg-yellow-900 px-6 py-4 text-center text-lg font-bold text-white shadow-md transition-all hover:bg-yellow-800 hover:shadow-lg focus:ring-4 focus:ring-blue-300">
        Purchase Document
      </button>

      <p className="mt-4 text-center text-xs text-gray-500 flex items-center justify-center gap-1.5 font-medium">
        <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secure payment via Chapa
      </p>
    </div>
  );
}
