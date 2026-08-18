import { useState } from 'react';
import {
  IconCircleCheckFilled,
  IconDownload,
  IconLoader2,
  IconShieldCheck,
} from '@tabler/icons-react';

export default function PurchaseCard({ note, onPurchaseSuccess, initialPurchased = false }) {
  const { title, course, description, price, purchaseCount, tutorName } = note;
  const [purchaseStatus, setPurchaseStatus] = useState(initialPurchased ? 'purchased' : 'idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handlePurchase = async () => {
    setPurchaseStatus('purchasing');
    setErrorMessage('');

    try {
      // Stub purchase endpoint trigger (Day 6 stub, full Chapa integration Day 9)
      await new Promise((resolve) => setTimeout(resolve, 400));
      setPurchaseStatus('purchased');
      onPurchaseSuccess?.(note);
    } catch (err) {
      setPurchaseStatus('error');
      setErrorMessage(err?.message || 'Failed to complete purchase. Please try again.');
    }
  };

  return (
    <div className="sticky top-8 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <span className="inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
            {course}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-gray-900 leading-tight">{title}</h1>
          <p className="mt-2 text-sm text-gray-600 font-medium">By {tutorName}</p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-gray-100 bg-gray-50 p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Price</p>
            <p className="text-3xl font-extrabold text-gray-900">${price.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600 mb-1">Purchases</p>
            <p className="text-lg font-bold text-gray-700">
              {purchaseStatus === 'purchased' ? purchaseCount + 1 : purchaseCount}
            </p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-3">Description</h3>
        <p className="text-base text-gray-600 leading-relaxed">
          {description}
        </p>
      </div>

      {purchaseStatus === 'purchased' ? (
        <div className="space-y-3" data-testid="purchase-result-success">
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm font-semibold text-emerald-800">
            <IconCircleCheckFilled size={20} className="shrink-0 text-emerald-600" aria-hidden="true" />
            <div>
              <p>Purchase Successful!</p>
              <p className="text-xs font-normal text-emerald-700 mt-0.5">
                Full document unlocked and added to your study library.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-3.5 text-center text-base font-bold text-white shadow-sm transition-all hover:bg-emerald-500 hover:shadow-md active:scale-95"
          >
            <IconDownload size={18} />
            <span>Download Full Document</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={purchaseStatus === 'purchasing'}
          onClick={handlePurchase}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-4 text-center text-lg font-bold text-gray-900 shadow-sm transition-all hover:bg-amber-600 hover:shadow-md focus:ring-4 focus:ring-amber-300 disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {purchaseStatus === 'purchasing' ? (
            <>
              <IconLoader2 size={20} className="animate-spin text-gray-900" />
              <span>Processing Purchase...</span>
            </>
          ) : (
            <span>Purchase Document</span>
          )}
        </button>
      )}

      {errorMessage && (
        <p className="mt-3 text-center text-xs text-rose-600 font-medium">{errorMessage}</p>
      )}

      <p className="mt-4 text-center text-xs text-gray-600 flex items-center justify-center gap-1.5 font-medium">
        <IconShieldCheck size={16} className="text-emerald-600" />
        <span>Secure payment via Chapa (Day 6 stub)</span>
      </p>
    </div>
  );
}
