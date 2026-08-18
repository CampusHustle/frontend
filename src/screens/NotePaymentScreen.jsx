import { useState } from 'react'
import { useParams } from 'react-router-dom'
import {
  IconArrowLeft,
  IconBuildingBank,
  IconCheck,
  IconCircleCheckFilled,
  IconClock,
  IconCopy,
  IconDeviceMobile,
  IconFileCertificate,
  IconFileUpload,
  IconPhoto,
  IconShieldCheck,
  IconTrash,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import Footer from '../components/Footer.jsx'

const DUMMY_NOTES_MAP = {
  note_123: {
    id: 'note_123',
    title: 'CS101 Midterm Complete Study Guide & Practice Problems',
    course: 'Computer Science 101',
    tutorName: 'Alex Johnson',
    tutorUniversity: 'Addis Ababa University',
    department: 'Computer Science',
    priceEtb: 150,
    priceUsd: 15.0,
    previewPagesCount: 40,
  },
}

const PAYMENT_ACCOUNTS = [
  {
    id: 'telebirr',
    name: 'Telebirr',
    accountName: 'CampusHustle Inc / Alex Johnson',
    accountNumber: '0911 23 45 67',
    type: 'Mobile Money',
    icon: IconDeviceMobile,
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    instruction: 'Transfer via Telebirr app or *127# and take a screenshot of the transaction SMS/receipt.',
  },
  {
    id: 'cbe',
    name: 'Commercial Bank of Ethiopia (CBE)',
    accountName: 'Campus Hustle Academic Services',
    accountNumber: '1000 4567 8901',
    type: 'Bank Transfer',
    icon: IconBuildingBank,
    badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
    instruction: 'Transfer via CBE Mobile Banking or CBEBirr and upload the digital transaction confirmation.',
  },
  {
    id: 'boa',
    name: 'Bank of Abyssinia (BOA)',
    accountName: 'Campus Hustle Platform',
    accountNumber: '5432 1098 7654',
    type: 'Bank Transfer',
    icon: IconBuildingBank,
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
    instruction: 'Transfer via BoA Mobile App and upload receipt slip screenshot.',
  },
]

export default function NotePaymentScreen({ user, onNavigate, onLogout, initialSubmitted = false }) {
  const { id } = useParams()
  const note = DUMMY_NOTES_MAP[id] || {
    id: id || 'note_123',
    title: 'CS101 Midterm Complete Study Guide & Practice Problems',
    course: 'Computer Science 101',
    tutorName: 'Alex Johnson',
    tutorUniversity: 'Addis Ababa University',
    department: 'Computer Science',
    priceEtb: 150,
    priceUsd: 15.0,
    previewPagesCount: 40,
  }

  const [selectedMethod, setSelectedMethod] = useState('telebirr')
  const [copiedAccount, setCopiedAccount] = useState(null)
  const [transactionRef, setTransactionRef] = useState('')
  const [payerName, setPayerName] = useState(user?.name || '')
  const [receiptFile, setReceiptFile] = useState(null)
  const [receiptPreview, setReceiptPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(initialSubmitted)
  const [formError, setFormError] = useState('')

  const handleCopy = (accountNumber) => {
    navigator.clipboard?.writeText(accountNumber.replace(/\s+/g, ''))
    setCopiedAccount(accountNumber)
    setTimeout(() => setCopiedAccount(null), 2500)
  }

  const handleFileChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      setFormError('Please upload an image (PNG, JPG) or PDF receipt file.')
      return
    }

    setFormError('')
    setReceiptFile(file)

    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setReceiptPreview(event.target?.result)
      }
      reader.readAsDataURL(file)
    } else {
      setReceiptPreview('/assets/pdf-icon.png')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!receiptFile && !receiptPreview) {
      setFormError('Please upload a screenshot or photo of your payment receipt.')
      return
    }

    if (!transactionRef.trim()) {
      setFormError('Please enter the Transaction Reference ID or SMS confirmation code.')
      return
    }

    setIsSubmitting(true)
    setFormError('')

    // Simulate backend receipt recording
    await new Promise((resolve) => setTimeout(resolve, 800))
    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
      <AppNavbar
        user={user}
        activeView="marketplace"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Link */}
        <button
          type="button"
          onClick={() => onNavigate ? onNavigate('marketplace') : window.history.back()}
          className="inline-flex w-fit items-center gap-2 text-sm font-medium text-on-surface-variant transition-colors hover:text-primary mb-6"
        >
          <IconArrowLeft size={16} aria-hidden="true" />
          <span>Back to Note Details</span>
        </button>

        {isSubmitted ? (
          /* ================================================================= */
          /* State: Receipt Submitted / Under Review                           */
          /* ================================================================= */
          <div data-testid="verification-under-review" className="mx-auto w-full max-w-2xl rounded-2xl border border-surface-variant bg-surface-lowest p-6 sm:p-10 shadow-level-2 text-center">
            <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600 mb-5">
              <IconClock size={36} className="animate-pulse" />
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-700 mb-3">
              <IconCircleCheckFilled size={14} />
              <span>Receipt Under Verification</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-display font-bold text-primary">
              Payment Verification in Progress
            </h1>

            <p className="mt-3 text-sm text-on-surface-variant leading-relaxed">
              Thank you, <strong className="text-primary">{payerName || 'Student'}</strong>! We have received your payment proof for{' '}
              <strong className="text-primary">{note.title}</strong>.
            </p>

            <div className="my-6 rounded-xl border border-surface-variant bg-surface-low p-4 text-left text-xs sm:text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-outline">Note Course:</span>
                <span className="font-semibold text-primary">{note.course}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Amount Paid:</span>
                <span className="font-bold text-emerald-600">{note.priceEtb} ETB (${note.priceUsd.toFixed(2)})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Transaction Ref:</span>
                <span className="font-mono font-semibold text-primary">{transactionRef || 'TXN-7890214'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Estimated Verification:</span>
                <span className="font-semibold text-primary">15 – 30 minutes</span>
              </div>
            </div>

            <p className="text-xs text-on-surface-variant leading-relaxed mb-8">
              Once verified by our platform or tutor, you will receive an in-app notification and the full downloadable PDF and AI Study Assistant chat will automatically unlock in your account.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => onNavigate ? onNavigate('marketplace') : window.location.assign('/market')}
                className="w-full sm:w-auto rounded-xl bg-primary px-6 py-3 text-sm font-bold text-on-primary shadow-level-1 transition-colors hover:bg-primary-container"
              >
                Browse More Notes
              </button>
              <button
                type="button"
                onClick={() => onNavigate ? onNavigate('assistant') : window.location.assign('/assistant')}
                className="w-full sm:w-auto rounded-xl border border-surface-variant bg-surface-low px-6 py-3 text-sm font-semibold text-primary hover:bg-surface-high transition-colors"
              >
                Go to AI Assistant
              </button>
            </div>
          </div>
        ) : (
          /* ================================================================= */
          /* State: Manual Payment Instructions & Receipt Upload Form          */
          /* ================================================================= */
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
            {/* Left: Account Transfer Details */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 rounded-full border border-surface-variant bg-surface-low px-3 py-1 text-xs font-semibold text-primary">
                  <IconFileCertificate size={14} className="text-hustle-600" />
                  <span>Step 1: Direct Account Payment</span>
                </div>
                <h1 className="mt-2 text-2xl sm:text-3xl font-display font-bold text-primary tracking-tight">
                  Complete Payment
                </h1>
                <p className="mt-1 text-sm text-on-surface-variant">
                  Transfer the exact amount using any of our verified Ethiopian campus accounts below.
                </p>
              </div>

              {/* Note Summary Card */}
              <div className="rounded-xl border border-surface-variant bg-surface-lowest p-5 shadow-level-1 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="rounded-md bg-surface-high px-2 py-0.5 text-xs font-semibold text-primary">
                    {note.course}
                  </span>
                  <h2 className="mt-1.5 text-base font-bold text-primary line-clamp-1">{note.title}</h2>
                  <p className="text-xs text-on-surface-variant">Author: {note.tutorName} · {note.tutorUniversity}</p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <p className="text-xs text-outline">Total Due</p>
                  <p className="text-2xl font-extrabold text-primary">{note.priceEtb} ETB</p>
                  <p className="text-xs text-on-surface-variant">(${note.priceUsd.toFixed(2)} USD)</p>
                </div>
              </div>

              {/* Account Selection Tabs */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
                  Select Payment Account:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PAYMENT_ACCOUNTS.map((acc) => {
                    const Icon = acc.icon
                    const isSelected = selectedMethod === acc.id
                    return (
                      <button
                        key={acc.id}
                        type="button"
                        onClick={() => setSelectedMethod(acc.id)}
                        className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-primary-fixed/20 shadow-level-1 ring-1 ring-primary'
                            : 'border-surface-variant bg-surface-lowest hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full mb-2">
                          <Icon size={20} className={isSelected ? 'text-primary' : 'text-outline'} />
                          {isSelected && <IconCheck size={16} className="text-primary font-bold" />}
                        </div>
                        <span className="text-xs font-bold text-primary">{acc.name}</span>
                        <span className="text-[11px] text-on-surface-variant mt-0.5">{acc.type}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Active Account Details Box */}
              {(() => {
                const activeAcc = PAYMENT_ACCOUNTS.find((a) => a.id === selectedMethod) || PAYMENT_ACCOUNTS[0]
                return (
                  <div className="rounded-xl border border-surface-variant bg-surface-lowest p-5 sm:p-6 shadow-level-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">
                        {activeAcc.name} Account Information
                      </span>
                      <span className="rounded-full bg-surface-high px-2.5 py-0.5 text-xs font-medium text-on-surface-variant">
                        Manual Verification
                      </span>
                    </div>

                    <div className="rounded-lg border border-surface-variant bg-surface-low p-4 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs text-outline">Account / Phone Number</p>
                        <p className="text-lg sm:text-xl font-mono font-bold text-primary tracking-wide">
                          {activeAcc.accountNumber}
                        </p>
                        <p className="text-xs text-on-surface-variant mt-0.5">Name: <strong className="text-primary">{activeAcc.accountName}</strong></p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(activeAcc.accountNumber)}
                        className="flex items-center gap-1.5 rounded-lg border border-surface-variant bg-surface-lowest px-3 py-2 text-xs font-bold text-primary shadow-xs transition-colors hover:bg-surface-high active:scale-95 shrink-0"
                      >
                        {copiedAccount === activeAcc.accountNumber ? (
                          <>
                            <IconCheck size={14} className="text-emerald-600" />
                            <span className="text-emerald-600">Copied!</span>
                          </>
                        ) : (
                          <>
                            <IconCopy size={14} />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-xs text-on-surface-variant leading-relaxed">
                      💡 <strong>Instruction:</strong> {activeAcc.instruction}
                    </p>
                  </div>
                )
              })()}
            </div>

            {/* Right: Receipt Upload Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleSubmit} className="sticky top-8 rounded-2xl border border-surface-variant bg-surface-lowest p-6 shadow-level-2 space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    <IconShieldCheck size={16} className="text-emerald-600" />
                    <span>Step 2: Upload Proof</span>
                  </div>
                  <h2 className="mt-1 text-xl font-bold font-display text-primary">
                    Submit Payment Receipt
                  </h2>
                  <p className="text-xs text-on-surface-variant mt-0.5">
                    Upload your transaction screenshot or transfer slip to unlock the note.
                  </p>
                </div>

                {/* Payer Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface">Payer Name</label>
                  <input
                    type="text"
                    required
                    value={payerName}
                    onChange={(e) => setPayerName(e.target.value)}
                    placeholder="Daniel Gidey"
                    className="w-full rounded-lg border border-surface-variant bg-surface-low px-3.5 py-2.5 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Transaction Ref / Code */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-on-surface">
                    Transaction ID / Reference Number <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="e.g. TLBR-98726514 / CBE Ref"
                    className="w-full rounded-lg border border-surface-variant bg-surface-low px-3.5 py-2.5 text-sm text-on-surface placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                </div>

                {/* Receipt File Upload */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-on-surface">
                    Receipt Photo / Screenshot <span className="text-error">*</span>
                  </label>
                  {receiptPreview ? (
                    <div className="relative rounded-xl border border-surface-variant bg-surface-low p-2">
                      <img
                        src={receiptPreview}
                        alt="Receipt preview"
                        className="h-36 w-full rounded-lg object-contain bg-surface-lowest"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setReceiptFile(null)
                          setReceiptPreview(null)
                        }}
                        className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors"
                        title="Remove photo"
                      >
                        <IconTrash size={16} />
                      </button>
                      <p className="mt-1.5 text-center text-[11px] text-outline truncate px-2">
                        {receiptFile?.name || 'receipt_screenshot.png'}
                      </p>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-surface-variant bg-surface-low p-6 cursor-pointer hover:border-primary hover:bg-surface-high transition-colors">
                      <div className="flex size-10 items-center justify-center rounded-full bg-surface-high text-primary mb-2">
                        <IconFileUpload size={20} />
                      </div>
                      <span className="text-xs font-bold text-primary">Click or drag screenshot</span>
                      <span className="text-[11px] text-outline mt-0.5">PNG, JPG, JPEG or PDF (max 5MB)</span>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/jpg,application/pdf"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {formError && (
                  <p className="text-xs font-medium text-error bg-error/10 p-2.5 rounded-lg border border-error/20">
                    {formError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-hustle-500 py-3.5 text-sm font-bold text-ink-contrast shadow-sm transition-all hover:bg-hustle-400 hover:shadow-md active:scale-95 disabled:opacity-50"
                >
                  <IconPhoto size={18} />
                  <span>{isSubmitting ? 'Uploading & Submitting...' : 'Submit Receipt for Verification'}</span>
                </button>

                <p className="text-center text-[11px] text-outline flex items-center justify-center gap-1">
                  <IconShieldCheck size={14} className="text-emerald-600" />
                  <span>Verified securely by Ethiopian campus peer tutors</span>
                </p>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer onNavigate={onNavigate} />
    </div>
  )
}
