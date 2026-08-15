import { useState } from 'react'
import { IconX } from '@tabler/icons-react'

function Tag({ tag, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-secondary-container px-3 py-1 text-sm font-semibold text-on-secondary-container">
      {tag}
      <button
        type="button"
        aria-label={`Remove ${tag}`}
        data-testid={`tag-remove-${tag}`}
        onClick={onRemove}
        className="rounded-full p-0.5 text-on-secondary-container/70 transition-colors hover:text-on-secondary-container"
      >
        <IconX size={14} aria-hidden="true" />
      </button>
    </span>
  )
}

function SuggestionChip({ tag, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-surface-high px-3 py-1 text-xs font-medium text-on-surface transition-colors hover:bg-outline-variant"
    >
      + {tag}
    </button>
  )
}

export default function TagInput({
  label,
  hint,
  placeholder = 'Type and press Enter',
  suggestions = [],
  value,
  onChange,
  error,
}) {
  const [draft, setDraft] = useState('')

  const isPresent = (tag) => value.some((t) => t.toLowerCase() === tag.toLowerCase())

  const commit = (raw) => {
    const tag = raw.trim().replace(/\s+/g, ' ')
    if (!tag || isPresent(tag)) return
    onChange([...value, tag])
    setDraft('')
  }

  const addSuggestion = (tag) => {
    if (!isPresent(tag)) onChange([...value, tag])
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      commit(draft)
    } else if (e.key === 'Backspace' && !draft && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  const id = `tag-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-sm font-semibold text-on-surface">{label}</span>
      <div className="rounded-lg border border-outline-variant bg-surface-high px-3 py-2 transition-colors focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
        <div className="flex flex-wrap items-center gap-2">
          {value.map((tag) => (
            <Tag key={tag} tag={tag} onRemove={() => onChange(value.filter((t) => t !== tag))} />
          ))}
          <input
            id={id}
            type="text"
            data-testid={`${id}-input`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => commit(draft)}
            placeholder={value.length === 0 ? placeholder : ''}
            className="min-w-32 flex-1 bg-transparent py-1 text-sm text-on-surface placeholder-outline focus:outline-none focus:ring-0"
          />
        </div>
      </div>
      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestions
            .filter((s) => !isPresent(s))
            .map((s) => (
              <SuggestionChip key={s} tag={s} onClick={() => addSuggestion(s)} />
            ))}
        </div>
      )}
      {error ? (
        <p className="text-sm text-error" data-testid={`${id}-error`}>
          {error}
        </p>
      ) : (
        hint && <p className="text-xs font-medium text-on-surface-variant">{hint}</p>
      )}
    </div>
  )
}
