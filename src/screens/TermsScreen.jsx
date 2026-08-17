import { IconArrowLeft, IconBook2, IconCircleCheck, IconGavel, IconScale, IconShieldCheck, IconUserCheck } from '@tabler/icons-react'
import { motion } from 'motion/react'

export default function TermsScreen({ onNavigate }) {
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
      {/* Top Header */}
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

      {/* Hero Banner */}
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-surface-variant bg-surface-low px-3 py-1 text-xs font-semibold text-hustle-600">
            <IconScale size={14} />
            <span>Official Platform Terms</span>
          </div>

          <h1 className="mt-3 text-3xl font-bold tracking-tight text-primary sm:text-5xl">
            Terms of Service
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Last updated: August 2026 · Effective for all university students and tutors across Ethiopia.
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="mt-10 space-y-10 border-t border-surface-variant pt-10 text-xs sm:text-sm leading-relaxed text-on-surface">
          {/* Section 1 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <IconUserCheck size={20} className="text-hustle-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold">
                1. University Student Eligibility & Verification
              </h2>
            </div>
            <p className="text-on-surface-variant">
              Campus Hustle is exclusively designated for students, faculty, and teaching assistants actively affiliated with verified Ethiopian higher education institutions.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
              <li>All accounts must register using an official institutional email ending in <code className="rounded bg-surface-low px-1.5 py-0.5 text-xs text-primary font-bold">.edu.et</code>.</li>
              <li>You agree to keep your credentials secure and assume responsibility for all activities occurring under your account.</li>
              <li>Sharing accounts or attempting to impersonate another student is strictly prohibited.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <IconBook2 size={20} className="text-hustle-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold">
                2. Academic Integrity & Honest Tutoring
              </h2>
            </div>
            <p className="text-on-surface-variant">
              Campus Hustle exists to empower collaborative learning, study group coordination, and mentorship.
            </p>
            <div className="rounded-xl border border-surface-variant bg-surface-low p-4 text-xs text-on-surface">
              <p className="font-semibold text-primary">Strict Academic Honor Code:</p>
              <ul className="mt-2 list-disc pl-4 space-y-1 text-on-surface-variant">
                <li>Tutors may provide conceptual explanations, problem walkthroughs, and exam preparation.</li>
                <li>Tutors and students are <strong className="text-error font-semibold">strictly forbidden</strong> from engaging in exam cheating, completing live proctored quizzes on behalf of peers, or plagiarism.</li>
                <li>Violations result in immediate permanent account suspension without refund.</li>
              </ul>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <IconShieldCheck size={20} className="text-hustle-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold">
                3. Note Marketplace & Intellectual Property
              </h2>
            </div>
            <p className="text-on-surface-variant">
              When uploading study notes, lecture summaries, or exam prep guides to the Marketplace:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-on-surface-variant">
              <li>You affirm that the uploaded notes are your original synthesis, summaries, or handwritten study guides.</li>
              <li>You may not upload copyrighted commercial textbooks or proprietary professor exam answer keys without authorization.</li>
              <li>Campus Hustle employs AI-powered OCR content verification and responds promptly to intellectual property takedown notices.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <IconGavel size={20} className="text-hustle-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold">
                4. Bookings, Punctuality & 3-Axis Reviews
              </h2>
            </div>
            <p className="text-on-surface-variant">
              Both tutors and learners agree to adhere to confirmed schedule slots. After each completed tutoring session, both parties submit a 3-axis review assessing:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-lg border border-surface-variant bg-surface-low p-3 text-center">
                <p className="font-bold text-primary text-xs">Knowledge Depth</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">Clarity & subject mastery</p>
              </div>
              <div className="rounded-lg border border-surface-variant bg-surface-low p-3 text-center">
                <p className="font-bold text-primary text-xs">Communication</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">Helpfulness & responsiveness</p>
              </div>
              <div className="rounded-lg border border-surface-variant bg-surface-low p-3 text-center">
                <p className="font-bold text-primary text-xs">Punctuality</p>
                <p className="text-[11px] text-on-surface-variant mt-0.5">Reliability & timekeeping</p>
              </div>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <IconCircleCheck size={20} className="text-hustle-600 shrink-0" />
              <h2 className="text-base sm:text-lg font-bold">
                5. Community Safety & Moderation
              </h2>
            </div>
            <p className="text-on-surface-variant">
              We provide built-in 1-click peer blocking, report mechanisms, and automated contact-info moderation to ensure a safe, respectful campus learning environment.
            </p>
          </section>
        </div>

        {/* Footer actions */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-surface-variant pt-8">
          <p className="text-xs text-on-surface-variant">
            Questions regarding our terms? Reach out to <span className="font-semibold text-primary">support@campushustle.edu.et</span>
          </p>
          <button
            type="button"
            onClick={handleBack}
            className="w-full sm:w-auto rounded-full bg-hustle-500 px-6 py-2.5 text-xs sm:text-sm font-bold text-ink-contrast shadow-sm transition-colors hover:bg-hustle-400 active:scale-95"
          >
            I Understand & Agree
          </button>
        </div>
      </main>
    </div>
  )
}
