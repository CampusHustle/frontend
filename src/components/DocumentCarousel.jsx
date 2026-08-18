import { useState } from 'react';

export default function DocumentCarousel({ previewPages }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goNext = () => {
    setCurrentIndex((prev) => (prev === previewPages.length - 1 ? 0 : prev + 1));
  };

  const goPrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? previewPages.length - 1 : prev - 1));
  };

  if (!previewPages || previewPages.length === 0) {
    return (
      <div className="flex h-96 items-center justify-center rounded-2xl bg-surface-low border border-outline-variant shadow-sm text-on-surface-variant">
        No preview pages available
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden rounded-2xl bg-surface-low border border-outline-variant shadow-sm group">
      <div className="relative aspect-[3/4] w-full max-h-[800px] flex items-center justify-center bg-surface mx-auto">
        <img 
          src={previewPages[currentIndex]} 
          alt={`Preview page ${currentIndex + 1}`} 
          className="object-cover w-full h-full pointer-events-none"
        />
        
        {previewPages.length > 1 && (
          <>
            <button 
              onClick={goPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-surface-low/90 p-3 text-on-surface opacity-0 shadow-lg backdrop-blur-sm transition-all hover:bg-surface-low hover:scale-110 group-hover:opacity-100 focus:opacity-100"
              aria-label="Previous page"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={goNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-surface-low/90 p-3 text-on-surface opacity-0 shadow-lg backdrop-blur-sm transition-all hover:bg-surface-low hover:scale-110 group-hover:opacity-100 focus:opacity-100"
              aria-label="Next page"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Page Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink-900/80 px-4 py-1.5 text-sm font-semibold text-on-surface backdrop-blur-md shadow-md">
        {currentIndex + 1} / {previewPages.length}
      </div>
    </div>
  );
}
