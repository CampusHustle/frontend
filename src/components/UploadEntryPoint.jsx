import { useState } from 'react';

export default function UploadEntryPoint({
  onFileSelect,
  onCoverSelect,
  onPreviewsSelect,
  onMediaChange,
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);

  const handleCoverUpdate = (file) => {
    setCoverImage(file);
    onCoverSelect?.(file);
    onMediaChange?.({ file: selectedFile, coverImage: file, previewImages });
  };

  const handlePreviewsUpdate = (files) => {
    setPreviewImages(files);
    onPreviewsSelect?.(files);
    onMediaChange?.({ file: selectedFile, coverImage, previewImages: files });
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

      // Validate file size (e.g., limit to 100MB)
      const MAX_FILE_SIZE = 100 * 1024 * 1024;
      if (file.size > MAX_FILE_SIZE) {
        setErrorMessage('File too large. Maximum size is 100MB.');
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
            <p className="text-lg font-medium text-on-surface">Queuing document...</p>
          </div>
        );
      case 'embedding':
        return (
          <div className="mx-auto flex w-full max-w-sm flex-col items-center justify-center py-6">
            <p className="mb-4 text-lg font-medium text-on-surface">AI Assistant is analyzing your notes...</p>
            <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-surface-container">
              <div className="absolute left-0 top-0 h-full w-full animate-pulse rounded-full bg-secondary-container"></div>
            </div>
          </div>
        );
      case 'ready':
        return (
          <div className="flex w-full flex-col items-center justify-center py-6">
            <div className="mb-6 grid w-full grid-cols-1 gap-6 md:grid-cols-2">
              {/* Left Column (PDF Preview) */}
              <div className="flex flex-col text-left">
                <h4 className="mb-2 text-sm font-semibold text-primary font-display">Document Preview</h4>
                {selectedFile && (
                  <object
                    data={URL.createObjectURL(selectedFile)}
                    className="h-80 w-full rounded-lg border border-surface-variant bg-surface-low"
                  >
                    <p className="p-4 text-sm text-on-surface-variant">Preview not available.</p>
                  </object>
                )}
              </div>

              {/* Right Column (Asset Manager) */}
              <div className="flex h-80 flex-col gap-6 overflow-y-auto pr-2 text-left">
                {/* Section A: Cover Image */}
                <div className="flex flex-col">
                  <h4 className="mb-2 text-sm font-semibold text-primary font-display">Upload Marketplace Cover (JPG/PNG)</h4>
                  {!coverImage ? (
                    <label 
                      className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-surface-variant bg-surface-low transition-colors hover:border-secondary-container hover:bg-surface-high"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="mb-2 h-8 w-8 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-sm font-medium text-on-surface-variant">Click to upload cover</span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/jpeg, image/png, image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) handleCoverUpdate(file);
                        }}
                      />
                    </label>
                  ) : (
                    <div 
                      className="flex h-48 w-full flex-col items-center justify-center rounded-lg border border-surface-variant bg-surface-low p-4"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <img
                        src={URL.createObjectURL(coverImage)}
                        alt="Cover Preview"
                        className="h-24 w-full rounded-lg object-cover"
                      />
                      <label className="mt-4 cursor-pointer rounded bg-surface-lowest px-4 py-2 text-sm font-semibold text-on-surface shadow-sm border border-surface-variant transition-colors hover:bg-surface-high">
                        Change Cover
                        <input
                          type="file"
                          className="hidden"
                          accept="image/jpeg, image/png, image/*"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) handleCoverUpdate(file);
                          }}
                        />
                      </label>
                    </div>
                  )}
                </div>

                {/* Section B: Preview Pages */}
                <div className="flex flex-col">
                  <h4 className="mb-2 text-sm font-semibold text-primary font-display">Upload Preview Pages (JPG/PNG)</h4>
                  {previewImages.length === 0 ? (
                    <label 
                      className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-surface-variant bg-surface-low transition-colors hover:border-secondary-container hover:bg-surface-high"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg className="mb-2 h-6 w-6 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-sm font-medium text-on-surface-variant">Select Preview Pages</span>
                      <input
                        type="file"
                        multiple
                        className="hidden"
                        accept="image/jpeg, image/png"
                        onChange={(e) => {
                          const files = Array.from(e.target.files);
                          if (files.length > 0) handlePreviewsUpdate(files);
                        }}
                      />
                    </label>
                  ) : (
                    <div className="flex w-full flex-col rounded-lg border border-surface-variant bg-surface-low p-4" onClick={(e) => e.stopPropagation()}>
                      <div className="grid grid-cols-3 gap-2">
                        {previewImages.map((file, idx) => (
                          <img
                            key={idx}
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${idx + 1}`}
                            className="aspect-square w-full rounded-md border border-surface-variant bg-surface-lowest object-cover"
                          />
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePreviewsUpdate([]);
                        }}
                        className="mt-4 w-full rounded border border-surface-variant bg-surface-lowest px-4 py-2 text-sm font-semibold text-on-surface shadow-sm transition-colors hover:bg-rose-500/15 hover:text-rose-400 cursor-pointer"
                      >
                        Clear Previews
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Master Reset / Start Over Button */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setUploadStatus('idle');
                setSelectedFile(null);
                handleCoverUpdate(null);
                handlePreviewsUpdate([]);
                setErrorMessage('');
              }}
              className="mt-2 rounded-lg bg-rose-500/15 border border-rose-500/30 px-6 py-2 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-500/25 cursor-pointer"
            >
              Start Over
            </button>
          </div>
        );
      case 'failed':
        return (
          <div className="flex flex-col items-center justify-center py-6">
            <svg className="mb-4 h-12 w-12 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p className="mb-2 text-lg font-medium text-rose-500">Upload failed</p>
            {errorMessage && <p className="mb-4 text-sm text-rose-400">{errorMessage}</p>}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUploadStatus('idle');
                setErrorMessage('');
                setSelectedFile(null);
              }}
              className="rounded-lg bg-rose-500/15 border border-rose-500/30 px-5 py-2 text-sm font-semibold text-rose-500 transition-colors hover:bg-rose-500/25 cursor-pointer"
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
              <h3 className="text-lg font-bold text-primary font-display">Upload Study Materials</h3>
              <p className="mt-2 text-sm text-on-surface-variant">
                Please provide your study notes. You can upload a PDF or take a picture of the document.
              </p>
            </div>

            {errorMessage && (
              <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-500">
                {errorMessage}
              </div>
            )}

            <div className="flex flex-col gap-4 sm:flex-row justify-center">
              {/* PDF Upload Port */}
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-secondary-container px-5 py-3 text-sm font-semibold text-on-secondary-container shadow-level-1 transition-all hover:brightness-105">
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
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-surface-variant bg-surface-lowest px-5 py-3 text-sm font-semibold text-on-surface shadow-sm transition-colors hover:bg-surface-high">
                <svg className="h-5 w-5 text-outline" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
