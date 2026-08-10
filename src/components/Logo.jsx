export default function Logo({ className = 'size-9' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="var(--color-hustle-500)" />
      <path d="M22 6 L10 21 H17 L15 34 L30 18 H21 Z" fill="#1a1200" />
    </svg>
  )
}
