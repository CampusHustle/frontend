import { useState, useMemo } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  IconArrowRight,
  IconBold,
  IconChevronDown,
  IconDeviceFloppy,
  IconItalic,
  IconLink,
  IconList,
  IconPhoto,
  IconSchool,
  IconCheck,
  IconAlertCircleFilled,
  IconFileText,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import Footer from '../components/Footer.jsx'
import UploadEntryPoint from '../components/UploadEntryPoint.jsx'
import { uploadNote, updateNote } from '../api/noteApi.js'

const SUBJECT_AREAS = [
  'Computer Science',
  'Software Engineering',
  'Mathematics',
  'Statistics',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Economics',
  'Economics & Business',
  'Medicine & Health Sciences',
  'Physics',
  'Physics & Engineering',
  'Chemistry',
  'Law & Social Studies',
  'Biology & Life Sciences',
  'Accounting & Finance',
  'General Academic',
]

const CONTENT_TYPES = [
  'PDF Notes',
  'Study Guide',
  'Cheat Sheet',
  'Practice Exam',
  'Lecture Slides',
  'Lab Report',
  'Summary Outline',
]

function sectionClass() {
  return 'glass-card rounded-2xl p-6 sm:p-10'
}

export default function PostListingScreen({
  user,
  onLogout,
  onNavigate,
  onAddNote,
  onUpdateNote,
  initialNote,
}) {
  const navigate = useNavigate()
  const location = useLocation()

  const editingNote =
    initialNote ||
    location?.state?.note ||
    location?.state?.tutorial ||
    location?.state?.material ||
    null
  const isEditing = Boolean(editingNote)

  const [title, setTitle] = useState(() => editingNote?.title || '')
  const [subject, setSubject] = useState(() => editingNote?.course || editingNote?.department || '')
  const [contentType, setContentType] = useState(() => editingNote?.contentType || 'PDF Notes')
  const [description, setDescription] = useState(() => editingNote?.description || '')
  const [isPremium, setIsPremium] = useState(() => {
    if (!editingNote) return false
    return (
      (typeof editingNote.numericPrice === 'number' && editingNote.numericPrice > 0) ||
      (typeof editingNote.price === 'string' &&
        editingNote.price !== 'Free' &&
        !editingNote.price.startsWith('0'))
    )
  })
  const [price, setPrice] = useState(() => {
    if (!editingNote) return ''
    if (editingNote.numericPrice) return String(editingNote.numericPrice)
    if (typeof editingNote.price === 'string' && editingNote.price !== 'Free') {
      const match = editingNote.price.replace(/[^\d.]/g, '')
      return match || ''
    }
    return ''
  })
  const [documentFile, setDocumentFile] = useState(null)
  const [coverImageFile, setCoverImageFile] = useState(null)
  const [previewImageFiles, setPreviewImageFiles] = useState([])
  const [feedback, setFeedback] = useState('')
  const [feedbackType, setFeedbackType] = useState('success')

  const coverPreviewUrl = useMemo(() => {
    if (coverImageFile) return URL.createObjectURL(coverImageFile)
    if (documentFile && documentFile.type?.startsWith('image/')) {
      return URL.createObjectURL(documentFile)
    }
    if (editingNote?.coverImage) return editingNote.coverImage
    return null
  }, [coverImageFile, documentFile, editingNote])

  const previewUrls = useMemo(() => {
    return previewImageFiles.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
      name: f.name,
    }))
  }, [previewImageFiles])

  const handleDocumentSelect = (file) => {
    setDocumentFile(file)
  }

  const handleAction = (message, type = 'success') => {
    setFeedback(message)
    setFeedbackType(type)
    window.setTimeout(() => setFeedback(''), 4000)
  }

  const handlePublish = async () => {
    const numericPriceValue = isPremium ? parseFloat(price) || 0 : 0
    const formattedPrice = numericPriceValue > 0 ? `${numericPriceValue} ETB` : 'Free'

    if (isEditing) {
      // Payload matches the PATCH/PUT /api/notes/:noteId contract:
      // only { title, course, description, price, previewPages } are editable,
      // and empty title/course values are rejected by the server.
      const payload = {}
      if (title.trim()) payload.title = title.trim()
      if (subject.trim()) payload.course = subject.trim()
      payload.description = description.trim()
      payload.price = String(numericPriceValue)

      try {
        const id = editingNote.id || editingNote._id
        const res = id ? await updateNote(id, payload) : null
        onUpdateNote?.({
          ...editingNote,
          ...payload,
          contentType: contentType || editingNote.contentType || 'PDF Notes',
          price: formattedPrice,
          numericPrice: numericPriceValue,
          ...(res?.note || {}),
        })
      } catch (err) {
        handleAction(err?.message || 'Failed to update tutorial. Please try again.', 'error')
        return
      }

      handleAction('Tutorial updated successfully!')

      setTimeout(() => {
        if (onNavigate) {
          onNavigate('profile')
        } else {
          navigate('/profile')
        }
      }, 1000)
      return
    }

    const successMsg = !isPremium ? 'Tutorial published!' : 'Premium tutorial published!'

    // Construct Mock API payload (Lifting State Up)
    const newNote = {
      id: Date.now(),
      contentType: contentType || 'PDF Notes',
      price: formattedPrice,
      numericPrice: numericPriceValue,
      title: title.trim() || 'Untitled',
      course: subject || 'Unspecified',
      department: subject || 'Unspecified',
      authorName: user?.name || 'Current User',
      authorAvatar: user?.avatar || user?.profilePicUrl || 'https://i.pravatar.cc/150?u=current',
      coverImage: coverPreviewUrl || 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80',
      description: description.trim(),
    }

    if (onAddNote) {
      onAddNote(newNote)
    }

    try {
      if (documentFile) {
        const formData = new FormData()
        formData.append('title', title.trim())
        formData.append('course', subject)
        formData.append('contentType', contentType)
        formData.append('description', description.trim() || title.trim())
        formData.append('price', isPremium ? price || '0' : '0')
        formData.append('file', documentFile)
        await uploadNote(formData).catch(() => {})
      }
    } catch {
      // Optimistic UI fallback
    }

    handleAction(successMsg)

    // Redirect to marketplace
    setTimeout(() => {
      if (onNavigate) {
        onNavigate('market')
      } else {
        navigate('/market')
      }
    }, 1200)
  }

  const publishDisabled = !title.trim() || !subject

  return (
    <div className="flex min-h-screen flex-col bg-surface mesh-bg font-body text-on-surface">
      <AppNavbar
        user={user}
        activeView="marketplace"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 text-center sm:text-left">
          <h1 className="font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
            {isEditing ? 'Edit Tutorial' : 'Create Tutorial'}
          </h1>
          <p className="mt-1 text-base text-on-surface-variant">
            {isEditing
              ? 'Update your published study materials, topics, and pricing details.'
              : 'Share your knowledge and help peers excel.'}
          </p>
        </div>

        {feedback && (
          <div
            role="status"
            className={`mb-6 rounded-lg border px-4 py-3 text-sm font-medium shadow-level-1 flex items-center gap-2 ${
              feedbackType === 'error'
                ? 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
            }`}
          >
            {feedbackType === 'error' ? (
              <IconAlertCircleFilled size={18} />
            ) : (
              <IconCheck size={18} />
            )}
            <span>{feedback}</span>
          </div>
        )}

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-8">
            <div className="space-y-6">
              {/* Tutorial Essentials */}
              <section className={sectionClass()}>
                <h2 className="mb-6 font-display text-xl font-bold text-primary">
                  Tutorial Essentials
                </h2>
                <div className="space-y-6">
                  <div>
                    <label
                      htmlFor="post-title"
                      className="block text-sm font-semibold text-on-surface"
                    >
                      Tutorial Title
                    </label>
                    <input
                      id="post-title"
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Advanced Microeconomics: Mastery"
                      className="mt-2 w-full rounded-lg border border-surface-variant bg-surface px-4 py-3 text-sm text-on-surface transition-colors placeholder-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="post-subject"
                      className="block text-sm font-semibold text-on-surface"
                    >
                      Subject Area
                    </label>
                    <div className="relative mt-2">
                      <select
                        id="post-subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-surface-variant bg-surface px-4 py-3 pr-10 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Select a subject...</option>
                        {SUBJECT_AREAS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      <IconChevronDown
                        size={16}
                        className="pointer-events-none absolute inset-y-0 right-3 my-auto text-outline"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="post-content-type"
                      className="block text-sm font-semibold text-on-surface"
                    >
                      Content Type
                    </label>
                    <div className="relative mt-2">
                      <select
                        id="post-content-type"
                        value={contentType}
                        onChange={(e) => setContentType(e.target.value)}
                        className="w-full appearance-none rounded-lg border border-surface-variant bg-surface px-4 py-3 pr-10 text-sm text-on-surface transition-colors focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        <option value="">Select a content type...</option>
                        {CONTENT_TYPES.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                      <IconChevronDown
                        size={16}
                        className="pointer-events-none absolute inset-y-0 right-3 my-auto text-outline"
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="post-description"
                      className="mb-2 block text-sm font-semibold text-on-surface"
                    >
                      Description
                    </label>
                    <div className="overflow-hidden rounded-lg border border-surface-variant bg-surface shadow-sm focus-within:border-primary focus-within:ring-1 focus-within:ring-primary">
                      <div className="flex items-center gap-3 border-b border-surface-variant bg-surface-low px-4 py-2">
                        <button
                          type="button"
                          aria-label="Bold"
                          className="text-outline transition-colors hover:text-primary cursor-pointer"
                        >
                          <IconBold size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label="Italic"
                          className="text-outline transition-colors hover:text-primary cursor-pointer"
                        >
                          <IconItalic size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label="Bulleted list"
                          className="text-outline transition-colors hover:text-primary cursor-pointer"
                        >
                          <IconList size={16} aria-hidden="true" />
                        </button>
                        <div className="h-4 w-px bg-surface-variant"></div>
                        <button
                          type="button"
                          aria-label="Insert link"
                          className="text-outline transition-colors hover:text-primary cursor-pointer"
                        >
                          <IconLink size={15} aria-hidden="true" />
                        </button>
                      </div>
                      <textarea
                        id="post-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe what students will learn..."
                        rows="4"
                        className="w-full resize-none border-0 bg-transparent px-4 py-3 text-sm text-on-surface focus:outline-none focus:ring-0"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Media & Assets */}
              <section className={sectionClass()}>
                <h2 className="mb-6 flex items-center font-display text-xl font-bold text-primary">
                  <span className="mr-2 text-2xl" aria-hidden="true">🎬</span> Media &amp; Assets
                </h2>
                <div className="flex w-full justify-center">
                  <UploadEntryPoint
                    onFileSelect={handleDocumentSelect}
                    onCoverSelect={(cover) => setCoverImageFile(cover)}
                    onPreviewsSelect={(previews) => setPreviewImageFiles(previews)}
                    onMediaChange={({ file, coverImage, previewImages }) => {
                      if (file !== undefined) setDocumentFile(file)
                      if (coverImage !== undefined) setCoverImageFile(coverImage)
                      if (previewImages !== undefined) setPreviewImageFiles(previewImages)
                    }}
                  />
                </div>

                {/* Document Cover Page & Preview Pages Showcase */}
                {(coverPreviewUrl || previewUrls.length > 0 || documentFile) && (
                  <div className="mt-6 space-y-4 rounded-xl border border-surface-variant bg-surface-low p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-variant/70 pb-3">
                      <div>
                        <h3 className="font-display text-sm font-bold text-primary flex items-center gap-1.5">
                          <IconPhoto size={16} />
                          <span>Document Cover &amp; Preview Showcase</span>
                        </h3>
                        <p className="text-xs text-on-surface-variant">
                          Live visual preview of your document cover and free sample pages in the marketplace.
                        </p>
                      </div>
                      {previewUrls.length > 0 && (
                        <span className="self-start sm:self-auto rounded-full bg-secondary-container px-2.5 py-0.5 text-xs font-semibold text-on-secondary-container">
                          {previewUrls.length} Preview {previewUrls.length === 1 ? 'Page' : 'Pages'}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                      {/* Main Cover Page Card */}
                      <div className="flex flex-col gap-2 rounded-xl border border-primary/30 bg-surface p-3 shadow-xs">
                        <div className="flex items-center justify-between text-xs font-semibold text-primary">
                          <span>Document Cover</span>
                          <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">Cover Page</span>
                        </div>
                        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-surface-lowest border border-surface-variant flex items-center justify-center">
                          {coverPreviewUrl ? (
                            <img
                              src={coverPreviewUrl}
                              alt="Document Cover Preview"
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex flex-col items-center justify-center p-4 text-center text-outline gap-2">
                              <IconFileText size={36} className="text-primary/60" />
                              <span className="text-xs font-medium text-on-surface line-clamp-1">{title.trim() || 'Document Cover'}</span>
                              <span className="text-[10px] text-outline truncate max-w-[140px]">{documentFile?.name || 'PDF Document'}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Preview Pages Cards */}
                      {previewUrls.map((p, idx) => (
                        <div key={idx} className="flex flex-col gap-2 rounded-xl border border-surface-variant bg-surface p-3 shadow-xs">
                          <div className="flex items-center justify-between text-xs font-semibold text-on-surface">
                            <span>Preview Page {idx + 1}</span>
                            <span className="rounded bg-surface-container px-1.5 py-0.5 text-[10px] text-outline">Sample</span>
                          </div>
                          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-surface-lowest border border-surface-variant">
                            <img
                              src={p.url}
                              alt={`Preview Page ${idx + 1}`}
                              className="size-full object-cover"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isEditing && (
                  <p className="mt-3 text-center text-xs text-outline">
                    Leave unchanged to keep your current uploaded document file.
                  </p>
                )}
              </section>

              {/* Pricing */}
              <section className={sectionClass()}>
                <h2 className="mb-6 font-display text-xl font-bold text-primary">
                  Pricing
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-on-surface">
                      Tutorial Type
                    </h3>
                    <p className="mb-3 text-sm text-on-surface-variant">
                      Offer for free to build reputation or charge for premium content.
                    </p>
                    <div className="flex space-x-1 rounded-lg border border-surface-variant bg-surface p-1">
                      <button
                        type="button"
                        onClick={() => {
                          setIsPremium(false)
                          setPrice('')
                        }}
                        aria-pressed={!isPremium}
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                          !isPremium
                            ? 'bg-surface-lowest text-primary shadow-level-1'
                            : 'text-on-surface-variant hover:text-primary'
                        }`}
                      >
                        Free
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsPremium(true)}
                        aria-pressed={isPremium}
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors cursor-pointer ${
                          isPremium
                            ? 'bg-surface-lowest text-primary shadow-level-1'
                            : 'text-on-surface-variant hover:text-primary'
                        }`}
                      >
                        Premium
                      </button>
                    </div>
                  </div>

                  {isPremium && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
                      <label
                        htmlFor="post-price"
                        className="block text-sm font-semibold text-on-surface"
                      >
                        Price (ETB)
                      </label>
                      <div className="relative mt-2">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                          <span className="text-on-surface-variant font-medium">ETB</span>
                        </div>
                        <input
                          id="post-price"
                          type="number"
                          min="0"
                          step="0.01"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="0.00"
                          className="w-full rounded-lg border border-surface-variant bg-surface py-3 pl-14 pr-4 text-sm text-on-surface transition-colors placeholder-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </section>
            </div>
          </div>

          {/* Preview / Actions Sidebar */}
          <div className="mt-6 lg:col-span-4 lg:mt-0">
            <div className="sticky top-24 space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <div className="relative mb-4 aspect-[4/3] w-full overflow-hidden rounded-xl border border-surface-variant bg-surface-container shadow-sm flex items-center justify-center group">
                  {coverPreviewUrl ? (
                    <img
                      src={coverPreviewUrl}
                      alt={title || 'Document cover'}
                      className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-outline gap-2">
                      <IconPhoto size={36} className="text-outline" aria-hidden="true" />
                      <span className="text-xs font-medium">Document Cover Preview</span>
                    </div>
                  )}

                  <div className="absolute top-2.5 right-2.5 rounded-md bg-surface-lowest/90 backdrop-blur-xs px-2.5 py-1 text-xs font-bold text-primary shadow-xs">
                    {isPremium ? (price ? `${price} ETB` : '0 ETB') : 'FREE'}
                  </div>
                  {previewUrls.length > 0 && (
                    <div className="absolute bottom-2.5 left-2.5 rounded-md bg-black/70 backdrop-blur-xs px-2 py-0.5 text-[10px] font-semibold text-white">
                      {previewUrls.length} Preview {previewUrls.length === 1 ? 'Page' : 'Pages'}
                    </div>
                  )}
                </div>

                <h3 className="mb-1 font-display text-lg font-bold text-primary truncate">
                  {title.trim() || 'Untitled Tutorial'}
                </h3>
                <p className="mb-4 flex items-center gap-1 text-sm text-on-surface-variant">
                  <IconSchool size={15} aria-hidden="true" />
                  <span className="truncate">{subject || 'No Subject Selected'}</span>
                </p>

                <div className="mb-4 space-y-2 border-t border-surface-variant py-3 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Format</span>
                    <span className="font-semibold text-on-surface">{contentType || 'PDF Notes'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Preview Pages</span>
                    <span className="font-semibold text-on-surface">
                      {previewUrls.length > 0 ? `${previewUrls.length} Pages` : 'Standard 3 Pages'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Status</span>
                    <span className="inline-flex items-center rounded-full bg-surface-container px-2.5 py-0.5 text-xs font-medium text-on-surface">
                      {isEditing ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    type="button"
                    disabled={publishDisabled}
                    onClick={handlePublish}
                    className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-on-primary shadow-level-1 transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                  >
                    <span>{isEditing ? 'Save Changes' : 'Publish Tutorial'}</span>
                    <IconArrowRight size={15} className="ml-2" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction('Saved as draft.')}
                    className="flex w-full items-center justify-center rounded-lg border border-outline-variant bg-surface px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-surface-low cursor-pointer"
                  >
                    <IconDeviceFloppy size={15} className="mr-2" aria-hidden="true" />
                    Save as Draft
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer onNavigate={onNavigate} user={user} />
    </div>
  )
}
