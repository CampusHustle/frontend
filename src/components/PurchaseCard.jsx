export default function PurchaseCard({ note }) {
  const { title, course, description, price, purchaseCount, tutorName } = note;

  return (
    <div className="sticky top-8 rounded-2xl border border-outline-variant bg-surface-low p-6 shadow-sm">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <span className="inline-block rounded-full bg-surface-container px-3 py-1 text-xs font-semibold text-on-surface">
            {course}
          </span>
          <h1 className="mt-3 text-2xl font-bold text-on-surface leading-tight">{title}</h1>
          <p className="mt-2 text-sm text-on-surface-variant font-medium">By {tutorName}</p>
        </div>
      </div>

      <div className="mb-6 rounded-xl border border-outline-variant bg-surface p-4">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-medium text-on-surface-variant mb-1">Price</p>
            <p className="text-3xl font-extrabold text-on-surface">${price.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-on-surface-variant mb-1">Purchases</p>
            <p className="text-lg font-bold text-on-surface">{purchaseCount}</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-on-surface mb-3">Description</h3>
        <p className="text-base text-on-surface-variant leading-relaxed">
          {description}
        </p>
      </div>

      <button className="w-full rounded-xl bg-primary-container px-6 py-4 text-center text-lg font-bold text-on-primary-container shadow-sm transition-all hover:shadow-level-2 focus:ring-4 focus:ring-primary-fixed">
        Purchase Document
      </button>

      <p className="mt-4 text-center text-xs text-on-surface-variant flex items-center justify-center gap-1.5 font-medium">
        <svg className="h-4 w-4 text-tertiary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        Secure payment via Chapa
      </p>
    </div>
  );
}
