import React, { useState, useMemo } from 'react'
import AuthFiltersSidebar from '../components/AuthFiltersSidebar.jsx'
import AuthNotesMarketplace, { dummyNotes } from '../components/AuthNotesMarketplace.jsx'
import Footer from '../components/Footer.jsx'
import AppNavbar from '../components/AppNavbar.jsx'

const VISIBLE_STEP = 6

export default function MarketplaceScreen({ user, onLogout, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepts, setSelectedDepts] = useState([])
  const [contentTypeFilter, setContentTypeFilter] = useState('All')
  const [maxPrice, setMaxPrice] = useState(50)
  const [sortBy, setSortBy] = useState('Recommended')
  const [visibleCount, setVisibleCount] = useState(VISIBLE_STEP)

  const handleDeptToggle = (dept) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    )
    setVisibleCount(VISIBLE_STEP)
  }

  const handleClearAll = () => {
    setSelectedDepts([])
    setContentTypeFilter('All')
    setMaxPrice(50)
    setSearchQuery('')
    setVisibleCount(VISIBLE_STEP)
  }

  const filteredAndSortedNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let result = dummyNotes.filter((item) => {
      const matchDept = selectedDepts.length === 0 || selectedDepts.includes(item.department)
      const matchFormat = contentTypeFilter === 'All' || item.contentType === contentTypeFilter
      const matchPrice = item.numericPrice <= maxPrice
      const matchQuery =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.course.toLowerCase().includes(q) ||
        item.department.toLowerCase().includes(q) ||
        item.authorName.toLowerCase().includes(q)
      return matchDept && matchFormat && matchPrice && matchQuery
    })

    if (sortBy === 'Price: Low to High') {
      result = [...result].sort((a, b) => a.numericPrice - b.numericPrice)
    } else if (sortBy === 'Price: High to Low') {
      result = [...result].sort((a, b) => b.numericPrice - a.numericPrice)
    }

    return result
  }, [searchQuery, selectedDepts, contentTypeFilter, maxPrice, sortBy])

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <AppNavbar
        user={user}
        activeView="marketplace"
        onNavigate={onNavigate}
        onLogout={onLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchPlaceholder="Search notes, tutorials, courses..."
      />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 md:py-10">
        {/* Top Header Section */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold tracking-tight text-primary sm:text-3xl">
            Academic Marketplace
          </h1>
          <p className="mt-1 text-sm font-medium text-on-surface-variant">
            Discover peer-reviewed notes, tutorial guides, and study materials from top campus contributors.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar Filters */}
          <AuthFiltersSidebar
            selectedDepts={selectedDepts}
            onDeptToggle={handleDeptToggle}
            contentType={contentTypeFilter}
            onContentTypeChange={(type) => {
              setContentTypeFilter(type)
              setVisibleCount(VISIBLE_STEP)
            }}
            maxPrice={maxPrice}
            onMaxPriceChange={(price) => {
              setMaxPrice(price)
              setVisibleCount(VISIBLE_STEP)
            }}
            onClearAll={handleClearAll}
          />

          {/* Right Content Area */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Results Count & Sort Dropdown */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <span className="text-on-surface-variant text-sm font-medium">
                Showing {filteredAndSortedNotes.length} resources
              </span>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <span className="text-xs font-medium text-outline shrink-0">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="rounded-lg border border-surface-variant bg-surface-lowest py-1.5 px-3 text-xs font-medium text-on-surface shadow-level-1 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary w-full sm:w-auto min-w-0"
                >
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Note Cards Grid */}
            <AuthNotesMarketplace
              notes={filteredAndSortedNotes}
              visibleCount={visibleCount}
              onLoadMore={() => setVisibleCount((c) => c + VISIBLE_STEP)}
            />
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
