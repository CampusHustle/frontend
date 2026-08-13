export default function TrustBadge({ icon, label }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
      <span aria-hidden="true" className="material-symbols-outlined text-base">
        {icon}
      </span>
      {label}
    </span>
  )
}
