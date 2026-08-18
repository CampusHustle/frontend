import { IconArrowLeft, IconDatabase, IconEyeOff, IconFileCertificate, IconLock, IconShieldLock, IconTrash } from '@tabler/icons-react'
import { motion } from 'motion/react'

export default function PrivacyScreen({ onNavigate }) {
  const handleBack = (e) => {
    e?.preventDefault?.()
    if (onNavigate) {
      onNavigate('home')
    } else {
      window.history.back()
    }
  }

  return (
    <div className="min-h-screen bg-surface-lowest text-primary antialiased font-['JetBrains_Mono',monospace]">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 border-b border-surface-variant bg-surface-lowest/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 rounded-full border border-surface-variant bg-surface-low px-3.5 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-primary hover:bg-surface-high active:scale-95"
          >
            <IconArrowLeft size={16} />
            <span>Back to Home</span>
          </button>

          <div className="flex items-center gap-2">
            <img
              src="/assets/campushustle.jpg"
              alt="CampusHustle logo"
              width="28"
              height="28"
              className="size-7 rounded-lg border border-surface-variant object-cover"
            />
            <span className="text-sm font-bold tracking-tight text-primary">
              Campus Hustle
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-surface-variant bg-surface-low px-3 py-1 text-xs font-semibold text-hustle-600">
            <IconShieldLock size={14} />
            <span>Student Privacy Commitment</span>
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Last updated: August 2026 · We protect student academic data across Ethiopian campuses.
          </p>
        </motion.div>

        <div className="mt-10 space-y-10 border-t border-surface-variant pt-10 text-xs sm:text-sm leading-relaxed text-on-surface">
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <IconLock size={20} className="text-hustle-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold">
                1. Information We Collect
              </h2>
            </div>
            <p className="text-on-surface-variant">
              Campus Hustle collects only essential academic and authentication details to ensure a trusted peer network:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
              <li><strong className="text-primary font-semibold">Institutional Credentials:</strong> University name, verified <code className="rounded bg-surface-low px-1.5 py-0.5 text-xs text-primary font-bold">.edu.et</code> email address, and department.</li>
              <li><strong className="text-primary font-semibold">Tutor Profiles:</strong> Teaching skills, hourly tutoring rates, availability slots, and student review scores.</li>
              <li><strong className="text-primary font-semibold">Marketplace Uploads:</strong> Study guides, OCR extracted text notes, and course metadata.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <IconDatabase size={20} className="text-hustle-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold">
                2. How We Use & Process Your Data
              </h2>
            </div>
            <p className="text-on-surface-variant">
              Your data is strictly utilized to facilitate campus peer learning:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
              <li>Connecting students with verified peer tutors in matching university departments.</li>
              <li>Powering tutor-scoped AI Study Assistants using RAG vector embeddings strictly grounded on uploaded lecture notes.</li>
              <li>Calculating objective 3-axis reputation ratings (Knowledge, Communication, Punctuality).</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <IconEyeOff size={20} className="text-hustle-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold">
                3. Zero Third-Party Data Selling
              </h2>
            </div>
            <div className="rounded-xl border border-surface-variant bg-surface-low p-4 text-xs text-on-surface">
              <p className="font-semibold text-primary">Our Core Data Pledge:</p>
              <p className="mt-1 text-on-surface-variant">
                We <strong className="text-primary">never sell</strong>, rent, or trade student profiles, contact details, or study notes to third-party advertisers or data brokers.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <IconFileCertificate size={20} className="text-hustle-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold">
                4. Messaging & Content Auditing
              </h2>
            </div>
            <p className="text-on-surface-variant">
              To safeguard students from harassment, fraudulent off-platform payment scams, or academic dishonesty:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
              <li>Real-time 1:1 in-app chats are monitored with automated contact-info pattern filtering.</li>
              <li>Peer user blocks immediately sever messaging and booking access between both parties.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <IconTrash size={20} className="text-hustle-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold">
                5. Data Retention & Student Rights
              </h2>
            </div>
            <p className="text-on-surface-variant">
              You own your data. Students have full control to:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
              <li>Export or delete uploaded notes from the Marketplace at any time.</li>
              <li>Request full account deletion and email removal upon graduation by contacting support.</li>
            </ul>
          </section>
        </div>

        {/* Footer actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-variant pt-8">
          <p className="text-xs text-on-surface-variant">
            Privacy inquiries: <span className="font-semibold text-primary">privacy@campushustle.edu.et</span>
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="w-full sm:w-auto rounded-full bg-hustle-500 px-6 py-2.5 text-xs sm:text-sm font-bold text-ink-contrast shadow-sm transition-colors hover:bg-hustle-400 active:scale-95"
          >
            Acknowledge & Return
          </button>
        </div>
      </main>
    </div>
  )
}
