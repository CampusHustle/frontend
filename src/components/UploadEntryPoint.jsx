import { useState } from 'react';

export default function UploadEntryPoint({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setError(null);
    setSelectedFile(null);

    if (file) {
      // Validate file size (e.g., limit to 10MB)
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        setError('File too large. Maximum size is 10MB.');
        return;
      }

      setSelectedFile(file);
      setIsLoading(true);

      try {
        if (onFileSelect) {
          // If onFileSelect returns a Promise, await it to hold the loading state
          await Promise.resolve(onFileSelect(file));
        }
      } catch (err) {
        setError(err.message || 'An error occurred during upload.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl border-2 border-dashed border-gray-200 bg-white p-8 text-center">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-900">Upload Study Materials</h3>
        <p className="mt-2 text-sm text-gray-600">
          Please provide your study notes. You can upload a PDF or take a picture of the document.
        </p>
      </div>

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {selectedFile && !error && (
        <div className="mb-4 text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200 break-all">
          Selected: <span className="font-semibold">{selectedFile.name}</span>
        </div>
      )}

      <div className="flex flex-col gap-4 sm:flex-row justify-center">
        {/* PDF Upload Port */}
        <label
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-amber-600 shadow-sm ${
            isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
          }`}
        >
          {isLoading ? (
            <svg className="h-5 w-5 animate-spin text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          )}
          <span>{isLoading ? 'Uploading...' : 'Upload PDF'}</span>
          <input
            type="file"
            className="hidden"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </label>

        {/* Camera Capture Port */}
        <label
          className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 shadow-sm ${
            isLoading ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
          }`}
        >
          <svg className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>Use Camera</span>
          <input
            type="file"
            className="hidden"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </label>
      </div>
    </div>
  );
}