import { useRef, useState } from 'react'
import { IconCamera, IconUpload, IconX } from '@tabler/icons-react'

export default function AvatarUploader({ user, onChange }) {
  const inputRef = useRef(null)
  const [preview, setPreview] = useState(null)
  const current = preview || user?.profilePicUrl || null

  const handleFiles = (files) => {
    const file = files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPreview(reader.result)
      onChange(file)
    }
    reader.readAsDataURL(file)
  }

  const handleRemove = () => {
    setPreview(null)
    onChange(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative size-32">
        <div className="flex size-full items-center justify-center overflow-hidden rounded-full bg-surface-low ring-2 ring-outline-variant">
          {current ? (
            <img
              src={current}
              alt="Profile preview"
              className="size-full object-cover"
              data-testid="avatar-preview"
            />
          ) : (
            <IconCamera size={40} className="text-outline" aria-hidden="true" />
          )}
        </div>
        <button
          type="button"
          aria-label="Upload Photo"
          data-testid="avatar-upload-button"
          onClick={() => inputRef.current?.click()}
          className="absolute right-0 bottom-0 rounded-full bg-primary p-2.5 text-on-primary shadow-level-2 transition-colors hover:bg-tertiary-container"
        >
          <IconUpload size={16} aria-hidden="true" />
        </button>
        {current && (
          <button
            type="button"
            aria-label="Remove Photo"
            data-testid="avatar-remove-button"
            onClick={handleRemove}
            className="absolute top-0 right-0 rounded-full bg-error p-1.5 text-on-error shadow-level-1 transition-transform hover:scale-110"
          >
            <IconX size={14} aria-hidden="true" />
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          data-testid="avatar-file-input"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      <p className="max-w-xs text-center text-xs font-medium text-on-surface-variant">
        Upload a clear, professional headshot. High-quality photos increase trust with peers.
      </p>
    </div>
  )
}
