export default function AuthFiltersSidebar({
  selectedDepts = [],
  onDeptToggle = () => {},
  contentType = 'All',
  onContentTypeChange = () => {},
  maxPrice = 50,
  onMaxPriceChange = () => {},
  onClearAll = () => {},
}) {
  return (
    <aside className="w-full shrink-0 space-y-6 md:w-64">
      <div className="rounded-xl border border-surface-variant bg-surface-lowest p-6 shadow-level-1">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-primary">Filters</h3>
          <button
            type="button"
            onClick={onClearAll}
            className="text-xs font-semibold text-secondary-container hover:underline"
          >
            Clear All
          </button>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-outline">
            Subject
          </h4>
          <div className="space-y-2.5">
            {['Computer Science', 'Economics', 'Mathematics', 'Chemistry'].map((dept) => (
              <label key={dept} className="flex items-center gap-2.5 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedDepts.includes(dept)}
                  onChange={() => onDeptToggle(dept)}
                  className="rounded text-primary border-outline-variant focus:ring-primary"
                />
                <span className="text-sm text-on-surface-variant transition-colors group-hover:text-primary">
                  {dept}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Content Type Filter */}
        <div className="mb-6">
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-outline">
            Format
          </h4>
          <div className="flex flex-wrap gap-2">
            {['All', 'PDF Notes', 'PDF + QUIZ', 'Exam Prep'].map((type) => {
              const isActive = contentType === type
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => onContentTypeChange(type)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'bg-surface-high text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  {type}
                </button>
              )
            })}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-outline">
            Max Price
          </h4>
          <input
            type="range"
            min="0"
            max="100"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(Number(e.target.value))}
            className="w-full accent-primary cursor-pointer"
          />
          <div className="mt-2 flex justify-between text-xs font-medium text-outline">
            <span>Free</span>
            <span>${maxPrice}</span>
            <span>$100+</span>
          </div>
        </div>
      </div>

      {/* Sell Your Notes Promo Box */}
      <div className="rounded-xl border border-surface-variant bg-surface-low p-5 text-center shadow-level-1">
        <h4 className="font-display text-base font-bold text-primary mb-1">Have high-scoring notes?</h4>
        <p className="text-xs text-on-surface-variant mb-4 leading-relaxed">Monetize your study guides and help fellow students succeed.</p>
        <button
          type="button"
          className="w-full rounded-lg bg-secondary-container px-4 py-2 text-sm font-bold text-on-secondary-container shadow-level-1 hover:brightness-105 transition-all"
        >
          Post Material
        </button>
      </div>
    </aside>
  )
}