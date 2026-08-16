import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
import DocumentCarousel from '../components/DocumentCarousel';
import PurchaseCard from '../components/PurchaseCard';

const DUMMY_NOTE = {
  id: 'note_123',
  title: 'CS101 Midterm Complete Study Guide & Practice Problems',
  course: 'Computer Science 101',
  tutorName: 'Alex Johnson',
  description: 'A comprehensive 40-page study guide covering all topics for the midterm exam. Includes detailed handwritten notes on Data Structures, Algorithms, time complexity cheat sheets, and 15 practice problems with step-by-step solutions.',
  price: 15.00,
  purchaseCount: 142,
  createdAt: '2026-08-10T10:00:00Z',
  previewPages: [
    'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1517842645767-c639042777db?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1555099962-4199c345e5dd?q=80&w=800&auto=format&fit=crop'
  ]
};

export default function NoteDetailScreen() {
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNote = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 600));
      setNote(DUMMY_NOTE);
      setIsLoading(false);
    };

    fetchNote();
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <svg className="h-10 w-10 animate-spin text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-600 font-medium">Loading preview...</p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-xl text-gray-600">Note not found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Breadcrumb Navigation */}
        <nav className="mb-8 flex text-sm text-gray-600 font-medium">
          <a href="/notes" className="hover:text-amber-600 transition-colors">Marketplace</a>
          <span className="mx-2 text-gray-400">/</span>
          <a href={`/notes?course=${encodeURIComponent(note.course)}`} className="hover:text-amber-600 transition-colors">{note.course}</a>
          <span className="mx-2 text-gray-400">/</span>
          <span className="text-gray-900 truncate max-w-xs">{note.title}</span>
        </nav>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          
          {/* Main Content Area: Document Preview */}
          <div className="lg:col-span-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Document Preview</h2>
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                Preview ({note.previewPages.length} Pages)
              </span>
            </div>
            
            <DocumentCarousel previewPages={note.previewPages} />
            
            {/* Trust Badges / Extra Info */}
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-xl bg-white p-5 text-center shadow-sm border border-gray-200">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-50 text-amber-600 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900">Verified Quality</h4>
                <p className="mt-2 text-xs text-gray-600">Notes are reviewed by community members.</p>
              </div>
              <div className="rounded-xl bg-white p-5 text-center shadow-sm border border-gray-200">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-50 text-green-600 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900">AI Assistant Ready</h4>
                <p className="mt-2 text-xs text-gray-600">Ask the AI questions strictly grounded in this note.</p>
              </div>
              <div className="rounded-xl bg-white p-5 text-center shadow-sm border border-gray-200">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-4">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900">Instant Access</h4>
                <p className="mt-2 text-xs text-gray-600">Download and access the full PDF immediately.</p>
              </div>
            </div>
          </div>

          {/* Sidebar Area: Purchase Details */}
          <div className="lg:col-span-4">
            <PurchaseCard note={note} />
          </div>

        </div>
      </div>
    </div>
  );
}
