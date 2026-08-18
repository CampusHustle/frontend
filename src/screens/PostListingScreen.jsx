import { useState } from 'react'
import {
  IconArrowRight,
  IconBold,
  IconBuildingBank,
  IconChevronDown,
  IconDeviceFloppy,
  IconItalic,
  IconLink,
  IconList,
  IconPhoto,
  IconSchool,
  IconWorld,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import Footer from '../components/Footer.jsx'
import UploadEntryPoint from '../components/UploadEntryPoint.jsx'

const SUBJECTS = ['Economics', 'Computer Science', 'Mathematics', 'Physics']

function sectionClass() {
  return 'glass-card rounded-2xl p-6 sm:p-10'
}

export default function PostListingScreen({ user, onLogout, onNavigate }) {
  const [title, setTitle] = useState('')
  const [subject, setSubject] = useState('')
  const [description, setDescription] = useState('')
  const [tutorialType, setTutorialType] = useState('free')
  const [visibility, setVisibility] = useState('public')
  const [documentFile, setDocumentFile] = useState(null)
  const [feedback, setFeedback] = useState('')

  const handleDocumentSelect = (file) => {
    setDocumentFile(file)
  }

  const handleAction = (message) => {
    setFeedback(message)
    window.setTimeout(() => setFeedback(''), 4000)
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
            Create Tutorial
          </h1>
          <p className="mt-1 text-base text-on-surface-variant">
            Share your knowledge and help peers excel.
          </p>
        </div>

        {feedback && (
          <div className="mb-6 rounded-lg border border-surface-variant bg-surface-low px-4 py-3 text-sm font-medium text-primary shadow-level-1">
            {feedback}
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
                        {SUBJECTS.map((s) => (
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
                          className="text-outline transition-colors hover:text-primary"
                        >
                          <IconBold size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label="Italic"
                          className="text-outline transition-colors hover:text-primary"
                        >
                          <IconItalic size={15} aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          aria-label="Bulleted list"
                          className="text-outline transition-colors hover:text-primary"
                        >
                          <IconList size={16} aria-hidden="true" />
                        </button>
                        <div className="h-4 w-px bg-surface-variant"></div>
                        <button
                          type="button"
                          aria-label="Insert link"
                          className="text-outline transition-colors hover:text-primary"
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
                  <UploadEntryPoint onFileSelect={handleDocumentSelect} />
                </div>
              </section>

              {/* Pricing & Visibility */}
              <section className={sectionClass()}>
                <h2 className="mb-6 font-display text-xl font-bold text-primary">
                  Pricing &amp; Visibility
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold text-on-surface">
                      Tutorial Type
                    </h3>
                    <p className="mb-3 text-sm text-on-surface-variant">
                      Offer for free to build reputation or charge for premium
                      content.
                    </p>
                    <div className="flex space-x-1 rounded-lg border border-surface-variant bg-surface p-1">
                      <button
                        type="button"
                        onClick={() => setTutorialType('free')}
                        aria-pressed={tutorialType === 'free'}
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${tutorialType === 'free'
                            ? 'bg-surface-lowest text-primary shadow-level-1'
                            : 'text-on-surface-variant hover:text-primary'
                          }`}
                      >
                        Free
                      </button>
                      <button
                        type="button"
                        onClick={() => setTutorialType('premium')}
                        aria-pressed={tutorialType === 'premium'}
                        className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition-colors ${tutorialType === 'premium'
                            ? 'bg-surface-lowest text-primary shadow-level-1'
                            : 'text-on-surface-variant hover:text-primary'
                          }`}
                      >
                        Premium
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-surface-variant pt-6">
                    <h3 className="mb-4 text-sm font-semibold text-on-surface">
                      Visibility
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="visibility-public"
                            type="radio"
                            name="visibility"
                            checked={visibility === 'public'}
                            onChange={() => setVisibility('public')}
                            className="h-4 w-4 border-outline-variant text-primary focus:ring-primary"
                          />
                        </div>
                        <div className="ml-3">
                          <label
                            htmlFor="visibility-public"
                            className="flex items-center gap-1.5 text-sm font-medium text-on-surface"
                          >
                            <IconWorld size={15} aria-hidden="true" />
                            Public
                          </label>
                          <p className="text-sm text-on-surface-variant">
                            Anyone on CampusHustle can view.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="flex h-6 items-center">
                          <input
                            id="visibility-university"
                            type="radio"
                            name="visibility"
                            checked={visibility === 'university'}
                            onChange={() => setVisibility('university')}
                            className="h-4 w-4 border-outline-variant text-primary focus:ring-primary"
                          />
                        </div>
                        <div className="ml-3">
                          <label
                            htmlFor="visibility-university"
                            className="flex items-center gap-1.5 text-sm font-medium text-on-surface"
                          >
                            <IconBuildingBank size={15} aria-hidden="true" />
                            University Only
                          </label>
                          <p className="text-sm text-on-surface-variant">
                            Restricted to users with verified university emails.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Preview / Actions Sidebar */}
          <div className="mt-6 lg:col-span-4 lg:mt-0">
            <div className="sticky top-24 space-y-6">
              <div className="glass-card rounded-2xl p-6">
                <div className="mb-4 flex aspect-video items-center justify-center rounded-lg bg-surface-container">
                  <IconPhoto size={36} className="text-outline" aria-hidden="true" />
                </div>
                <h3 className="mb-1 font-display text-lg font-bold text-primary">
                  {title.trim() || 'Untitled Tutorial'}
                </h3>
                <p className="mb-6 flex items-center gap-1 text-sm text-on-surface-variant">
                  <IconSchool size={15} aria-hidden="true" />
                  {subject || 'No Subject Selected'}
                </p>
                <div className="mb-4 flex items-center justify-between border-t border-surface-variant py-4">
                  <span className="text-sm text-on-surface-variant">Status</span>
                  <span className="inline-flex items-center rounded-full bg-surface-container px-2.5 py-0.5 text-xs font-medium text-on-surface">
                    Draft
                  </span>
                </div>
                <div className="space-y-3">
                  <button
                    type="button"
                    disabled={publishDisabled}
                    onClick={() =>
                      handleAction(
                        tutorialType === 'free'
                          ? 'Tutorial published!'
                          : 'Premium tutorial published!',
                      )
                    }
                    className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-bold text-on-primary shadow-level-1 transition-colors hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Publish Tutorial
                    <IconArrowRight size={15} className="ml-2" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction('Saved as draft.')}
                    className="flex w-full items-center justify-center rounded-lg border border-outline-variant bg-surface px-4 py-3 text-sm font-bold text-primary transition-colors hover:bg-surface-low"
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

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
