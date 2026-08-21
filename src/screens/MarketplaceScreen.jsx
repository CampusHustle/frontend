import { useState, useMemo, useEffect } from 'react'
import AuthFiltersSidebar from '../components/AuthFiltersSidebar.jsx'
import AuthNotesMarketplace from '../components/AuthNotesMarketplace.jsx'
import Footer from '../components/Footer.jsx'
import AppNavbar from '../components/AppNavbar.jsx'
import { searchNotes } from '../api/noteApi.js'

const VISIBLE_STEP = 6

function formatNote(n) {
  const tutor = n.tutorId || {}
  const priceNum = typeof n.price === 'number' ? n.price : typeof n.numericPrice === 'number' ? n.numericPrice : 0
  return {
    id: n._id || n.id,
    _id: n._id || n.id,
    title: n.title || 'Untitled Note',
    course: n.course || 'General',
    description: n.description || '',
    fileUrl: n.fileUrl || '',
    numericPrice: priceNum,
    price: priceNum === 0 ? 'Free' : `${priceNum} ETB`,
    contentType: n.contentType || (n.fileUrl?.endsWith('.pdf') ? 'PDF NOTES' : 'Study Notes'),
    department: n.department || tutor.department || tutor.university || 'General',
    authorName: tutor.name || n.authorName || 'Campus Contributor',
    authorAvatar: tutor.profilePicUrl || n.authorAvatar || null,
    coverImage: n.coverImage || null,
    previewPages: n.previewPages || 3,
    purchaseCount: n.purchaseCount || 0,
    createdAt: n.createdAt || new Date().toISOString(),
  }
}

export default function MarketplaceScreen({ user, onLogout, onNavigate, availableTutorials = [] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDepts, setSelectedDepts] = useState([])
  const [contentTypeFilter, setContentTypeFilter] = useState('All')
  const [maxPrice, setMaxPrice] = useState(500)
  const [sortBy, setSortBy] = useState('Recommended')
  const [visibleCount, setVisibleCount] = useState(VISIBLE_STEP)
  const [dbNotes, setDbNotes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load real notes from DB
  useEffect(() => {
    let isMounted = true

    const timer = setTimeout(async () => {
      try {
        const res = await searchNotes({
          q: searchQuery.trim() || undefined,
          department: selectedDepts.length === 1 ? selectedDepts[0] : undefined,
          maxPrice: maxPrice < 500 ? maxPrice : undefined,
          sortBy:
            sortBy === 'Price: Low to High'
              ? 'price_asc'
              : sortBy === 'Price: High to Low'
              ? 'price_desc'
              : 'newest',
        })
        if (isMounted) {
          const notesArr = Array.isArray(res?.notes)
            ? res.notes
            : Array.isArray(res?.data)
            ? res.data
            : []
          setDbNotes(notesArr.map(formatNote))
        }
      } catch {
        if (isMounted) {
          setDbNotes([])
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }, 200)

    return () => {
      isMounted = false
      clearTimeout(timer)
    }
  }, [searchQuery, selectedDepts, maxPrice, sortBy])

  const handleDeptToggle = (dept) => {
    setSelectedDepts((prev) =>
      prev.includes(dept) ? prev.filter((d) => d !== dept) : [...prev, dept]
    )
    setVisibleCount(VISIBLE_STEP)
  }

  const handleClearAll = () => {
    setSelectedDepts([])
    setContentTypeFilter('All')
    setMaxPrice(500)
    setSearchQuery('')
    setVisibleCount(VISIBLE_STEP)
  }

  const allNotes = useMemo(() => {
    const combined = [...dbNotes]
    if (Array.isArray(availableTutorials) && availableTutorials.length > 0) {
      availableTutorials.forEach((t) => {
        const fid = t._id || t.id
        if (!combined.some((c) => (c._id || c.id) === fid)) {
          combined.unshift(formatNote(t))
        }
      })
    }
    return combined
  }, [dbNotes, availableTutorials])

  const filteredAndSortedNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    let result = allNotes.filter((item) => {
      const matchDept = selectedDepts.length === 0 || selectedDepts.includes(item.department)
      const matchFormat = contentTypeFilter === 'All' || item.contentType === contentTypeFilter
      const matchPrice = maxPrice >= 500 ? true : item.numericPrice <= maxPrice
      const matchQuery =
        !q ||
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.course && item.course.toLowerCase().includes(q)) ||
        (item.department && item.department.toLowerCase().includes(q)) ||
        (item.authorName && item.authorName.toLowerCase().includes(q))
      return matchDept && matchFormat && matchPrice && matchQuery
    })

    if (sortBy === 'Price: Low to High') {
      result = [...result].sort((a, b) => a.numericPrice - b.numericPrice)
    } else if (sortBy === 'Price: High to Low') {
      result = [...result].sort((a, b) => b.numericPrice - a.numericPrice)
    }

    return result
  }, [allNotes, searchQuery, selectedDepts, contentTypeFilter, maxPrice, sortBy])

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
            onPostMaterial={() => onNavigate?.('post-listing')}
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
            {isLoading && dbNotes.length === 0 ? (
              <div className="flex h-64 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="text-sm font-medium text-on-surface-variant">Loading marketplace resources...</p>
                </div>
              </div>
            ) : (
              <AuthNotesMarketplace
                notes={filteredAndSortedNotes}
                visibleCount={visibleCount}
                onLoadMore={() => setVisibleCount((c) => c + VISIBLE_STEP)}
              />
            )}
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} user={user} />
    </div>
  )
}
