import { useState } from 'react';

export default function UploadEntryPoint({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    if (bytes < 1024) return bytes + ' Bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  const simulateUploadProgress = () => {
    setUploadStatus('queued');
    
    setTimeout(() => {
      setUploadStatus('embedding');
      
      setTimeout(() => {
        setUploadStatus('ready');
      }, 2500);
      
    }, 2500);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setErrorMessage('');
    setSelectedFile(null);

    if (file) {
      // Validate file type
      const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setErrorMessage('Invalid file type. Please upload a PDF or Image.');
        setUploadStatus('failed');
        return;
      }

      // Validate file size (e.g., limit to 10MB)
      const MAX_FILE_SIZE = 10 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage('File too large. Maximum size is 10MB.');
        setUploadStatus('failed');
        return;
      }

      setSelectedFile(file);
      simulateUploadProgress();

      try {
        if (onFileSelect) {
          // If onFileSelect returns a Promise, await it
          await Promise.resolve(onFileSelect(file));
        }
      } catch (err) {
        setErrorMessage(err.message || 'An error occurred during upload.');
        setUploadStatus('failed');
      }
    }
  };

  const renderContent = () => {
    switch (uploadStatus) {
      case 'queued':
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <svg className="mb-4 h-10 w-10 animate-spin text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg font-medium text-gray-900">Queuing document...</p>
          </div>
        );
      case 'embedding':
        return (
          <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center py-6">
            <p className="mb-4 text-lg font-medium text-gray-900">AI Assistant is analyzing your notes...</p>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="absolute left-0 top-0 h-full w-full animate-pulse rounded-full bg-amber-500"></div>
            </div>
          </div>
        );
      case 'ready':
        return (
          <div className="flex w-full flex-col items-center justify-center py-6">
            <div className="flex w-full max-w-sm items-center justify-between rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
              <div className="flex items-center space-x-4 overflow-hidden">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1 text-left">
                  <p className="truncate text-sm font-semibold text-gray-900">{selectedFile?.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(selectedFile?.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setUploadStatus('idle');
                  setSelectedFile(null);
                  setErrorMessage('');
                }}
                className="ml-4 shrink-0 rounded-md p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-red-500"
                title="Remove file"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-green-700">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Document ready for publishing!
            </p>
          </div>
        );
      case 'failed':
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <svg className="mb-4 h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="mb-2 text-lg font-medium text-red-600">Upload failed</p>
            {errorMessage && <p className="mb-4 text-sm text-red-500">{errorMessage}</p>}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUploadStatus('idle');
                setErrorMessage('');
                setSelectedFile(null);
              }}
              className="rounded-lg bg-red-100 px-5 py-2 text-sm font-semibold text-red-700 transition-colors hover:bg-red-200"
            >
              Retry
            </button>
          </div>
        );
      case 'idle':
      default:
        return (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-900">Upload Study Materials</h3>
              <p className="mt-2 text-sm text-gray-600">
                Please provide your study notes. You can upload a PDF or take a picture of the document.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              {/* PDF Upload Port */}
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-3 text-sm font-semibold text-gray-900 shadow-sm transition-colors hover:bg-amber-600">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Upload PDF</span>
                <input
                  type="file"
                  className="hidden"
                  accept="application/pdf"
                  data-testid="file-upload-input"
                  onChange={handleFileChange}
                />
              </label>

              {/* Camera Capture Port */}
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50">
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
                />
              </label>
            </div>
          </>
        );
    }
  };

  return (
    <div className="w-full cursor-pointer rounded-xl border-2 border-dashed border-outline-variant p-10 text-center transition-colors duration-200 hover:border-primary hover:bg-surface-variant/30">
      {renderContent()}
    </div>
  );
}
