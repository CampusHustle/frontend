import React from 'react';

export default function UploadEntryPoint() {
  return (
    <div className="w-full max-w-md rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
      
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Upload Credentials</h3>
        <p className="mt-2 text-sm text-gray-500">
          Please provide your resume or transcript. You can upload a PDF or take a picture of the document.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row justify-center">
        
        {/* PDF Upload Port */}
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-yellow-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-800 shadow-sm">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <span>Upload PDF</span>
          {/* The hidden ugly input */}
          <input 
            type="file" 
            className="hidden" 
            accept="application/pdf" 
          />
        </label>

        {/* Camera Capture Port */}
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-100 shadow-sm">
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Use Camera</span>
          {/* The hidden ugly input */}
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            capture="environment" 
          />
        </label>

      </div>
    </div>
  );
}