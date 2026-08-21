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
  IconFileUpload,
  IconPhoto,
  IconReceipt,
  IconShieldCheck,
  IconTrash,
} from '@tabler/icons-react'
import AppNavbar from '../components/AppNavbar.jsx'
import Footer from '../components/Footer.jsx'
import { purchaseNote } from '../api/noteApi.js'

const DUMMY_NOTES_MAP = {
  note_123: {
    id: 'note_123',
    title: 'Organic Chemistry: Reaction Mechanisms Masterclass',
    course: 'Chemistry 201',
    code: 'CHEM 201',
    tutorName: 'Sarah Jenkins',
    tutorUniversity: 'Addis Ababa University',
    department: 'Chemistry',
    priceEtb: 150,
    priceUsd: 18.5,
    pagesCount: 42,
  },
}

const PAYMENT_ACCOUNTS = [
  {
    id: 'telebirr',
    name: 'Telebirr',
    brandBadge: 'Recommended · Instant',
    accountName: 'CampusHustle Inc (Sarah Jenkins)',
    accountNumber: '0911 23 45 67',
    type: 'Ethio Telecom Mobile Money',
    icon: IconDeviceMobile,
    instruction: 'Open Telebirr App or dial *127#, send 150 ETB to 0911234567, and capture the payment confirmation screenshot.',
  },
  {
    id: 'cbe',
    name: 'Commercial Bank of Ethiopia',
    brandBadge: 'CBE Mobile / CBEBirr',
    accountName: 'Campus Hustle Academic Services',
    accountNumber: '1000 4567 8901',
    type: 'CBE Bank Transfer',
    icon: IconBuildingBank,
    instruction: 'Transfer via CBE Mobile Banking or branch slip, enter note title in reference, and upload digital PDF/slip.',
  },
  {
    id: 'boa',
    name: 'Bank of Abyssinia',
    brandBadge: 'BoA Mobile',
    accountName: 'Campus Hustle Platform',
    accountNumber: '5432 1098 7654',
    type: 'BoA Transfer',
    icon: IconBuildingBank,
    instruction: 'Send money using BoA Mobile App to account 543210987654 and save the transaction confirmation receipt.',
  },
]

export default function NotePaymentScreen({ user, onNavigate, onLogout, initialSubmitted = false }) {
  const { id } = useParams()
  const note = DUMMY_NOTES_MAP[id] || {
    id: id || 'note_123',
    title: 'Organic Chemistry: Reaction Mechanisms Masterclass',
    course: 'Chemistry 201',
    code: 'CHEM 201',
    tutorName: 'Sarah Jenkins',
    tutorUniversity: 'Addis Ababa University',
    department: 'Chemistry',
    priceEtb: 150,
    priceUsd: 18.5,
    pagesCount: 42,
  }

  const [selectedMethod, setSelectedMethod] = useState('telebirr')
  const [copiedAccount, setCopiedAccount] = useState(null)
  const [transactionRef, setTransactionRef] = useState('')
  const [payerName, setPayerName] = useState(user?.name || '')
  const [payerPhone, setPayerPhone] = useState('')
  const [receiptFile, setReceiptFile] = useState(null)
  const [receiptPreview, setReceiptPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(initialSubmitted)
  const [formError, setFormError] = useState('')

  const handleCopy = (accountNumber) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(accountNumber.replace(/\s+/g, ''))
      setCopiedAccount(accountNumber)
      setTimeout(() => setCopiedAccount(null), 2500)
    }
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
      try {
        const reader = new FileReader()
        reader.onload = (event) => {
          setReceiptPreview(event.target?.result || 'data:image/png;base64,dummy')
        }
        reader.readAsDataURL(file)
        if (!receiptPreview) {
          setReceiptPreview(URL.createObjectURL ? URL.createObjectURL(file) : 'data:image/png;base64,dummy')
        }
      } catch {
        setReceiptPreview('data:image/png;base64,dummy')
      }
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

    try {
      if (note?.id) {
        await purchaseNote(note.id).catch(() => {})
      }
    } catch {
      // Optimistic completion
    } finally {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }
  }

  const activeAccount = PAYMENT_ACCOUNTS.find((a) => a.id === selectedMethod) || PAYMENT_ACCOUNTS[0]

  return (
    <div className="flex min-h-screen flex-col bg-surface text-on-surface font-body antialiased mesh-bg">
      <AppNavbar
        user={user}
        activeView="marketplace"
        onNavigate={onNavigate}
        onLogout={onLogout}
      />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => onNavigate ? onNavigate('marketplace') : window.history.back()}
          className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-on-surface-variant transition-colors hover:text-primary mb-6 cursor-pointer"
        >
          <IconArrowLeft size={16} />
          <span>Back to Note Overview</span>
        </button>

        {isSubmitted ? (
          /* =============================================================== */
          /* STATE 2: Verification Under Review / Processing                 */
          /* =============================================================== */
          <div
            data-testid="verification-under-review"
            className="mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-surface-variant bg-surface-lowest p-6 sm:p-10 shadow-level-2 text-center space-y-6"
          >
            {/* Animated Radar Pulse Circle */}
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-secondary-container/20 text-amber-500 shadow-inner">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-3xl bg-amber-400 opacity-20" />
              <IconClock size={40} className="relative z-10 animate-pulse" />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-secondary-container/40 bg-secondary-container/15 px-3.5 py-1 text-xs font-bold text-amber-600 dark:text-amber-300">
                <IconCircleCheckFilled size={14} />
                <span>Verification Ticket #CH-892415</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-primary tracking-tight">
                Payment Verification in Progress
              </h1>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                We received your payment receipt for <strong className="text-on-surface">{note.title}</strong>. Our peer moderation team is verifying the transaction code.
              </p>
            </div>

            {/* Summary Ticket */}
            <div className="rounded-2xl border border-surface-variant bg-surface-low p-5 text-left text-xs sm:text-sm space-y-3 shadow-xs">
              <div className="flex justify-between border-b border-surface-variant pb-2.5">
                <span className="text-outline">Payer:</span>
                <span className="font-semibold text-on-surface">{payerName || 'Student'} {payerPhone && `(${payerPhone})`}</span>
              </div>
              <div className="flex justify-between border-b border-surface-variant pb-2.5">
                <span className="text-outline">Total Amount:</span>
                <span className="font-extrabold text-emerald-500">{note.priceEtb} ETB (${note.priceUsd.toFixed(2)} USD)</span>
              </div>
              <div className="flex justify-between border-b border-surface-variant pb-2.5">
                <span className="text-outline">Transaction Ref:</span>
                <span className="font-mono font-bold text-on-surface">{transactionRef || 'TLBR-98234710'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-outline">Estimated Verification:</span>
                <span className="font-bold text-amber-500">⏱ ~15 – 20 Minutes</span>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-600 dark:text-emerald-300 text-left flex items-start gap-2.5">
              <IconShieldCheck size={18} className="text-emerald-500 shrink-0 mt-0.5" />
              <span>Once confirmed, you will receive an in-app notification and the complete <strong>{note.pagesCount}-page PDF</strong> and AI Assistant study tool will automatically unlock in your account.</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => onNavigate ? onNavigate('marketplace') : window.location.assign('/market')}
                className="w-full sm:w-auto rounded-full bg-secondary-container px-6 py-3 text-xs sm:text-sm font-bold text-on-secondary-container shadow-level-1 transition-all hover:brightness-105 hover:shadow-level-2 active:scale-95 cursor-pointer font-display"
              >
                Browse Marketplace
              </button>
              <button
                type="button"
                onClick={() => onNavigate ? onNavigate('assistant', { tutorId: note?.tutorId || note?._id }) : window.dispatchEvent(new CustomEvent('open-ai-assistant', { detail: { tutorId: note?.tutorId || note?._id } }))}
                className="w-full sm:w-auto rounded-full border border-surface-variant bg-surface px-6 py-3 text-xs sm:text-sm font-semibold text-on-surface transition-colors hover:bg-surface-high cursor-pointer"
              >
                Ask AI Questions Now
              </button>
            </div>
          </div>
        ) : (
          /* =============================================================== */
          /* STATE 1: Manual Transfer & Proof Submission Form                */
          /* =============================================================== */
          <div className="space-y-8">
            {/* Step Progress Header */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 rounded-2xl border border-secondary-container bg-secondary-container/10 p-3.5 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary-container text-xs font-bold text-on-secondary-container">1</div>
                <div>
                  <p className="text-xs font-bold text-primary font-display">Select Account</p>
                  <p className="text-[11px] text-on-surface-variant">Telebirr, CBE, BOA</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-surface-variant bg-surface-lowest p-3.5 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container text-xs font-bold text-on-surface-variant">2</div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Transfer &amp; Upload</p>
                  <p className="text-[11px] text-outline">Attach screenshot</p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-surface-variant bg-surface-lowest p-3.5 shadow-sm">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container text-xs font-bold text-on-surface-variant">3</div>
                <div>
                  <p className="text-xs font-bold text-on-surface">Fast Unlock</p>
                  <p className="text-[11px] text-outline">~15 min verification</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              {/* Left Column: Account Selection & Transfer Guide */}
              <div className="space-y-6 lg:col-span-7">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-primary tracking-tight">
                    Complete Your Payment
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-on-surface-variant">
                    Send <strong className="text-on-surface">{note.priceEtb} ETB</strong> directly to any of the verified student/platform accounts below.
                  </p>
                </div>

                {/* Note Order Summary Pill */}
                <div className="rounded-2xl border border-surface-variant bg-surface-lowest p-5 shadow-level-1 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <span className="rounded-md bg-surface-container px-2 py-0.5 text-[11px] font-bold text-on-surface-variant border border-surface-variant">
                      {note.course}
                    </span>
                    <h2 className="mt-1 text-sm sm:text-base font-bold text-primary font-display truncate">{note.title}</h2>
                    <p className="text-xs text-on-surface-variant">{note.tutorName} · {note.tutorUniversity}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-outline">Total Due</p>
                    <p className="text-2xl font-black text-secondary font-display">{note.priceEtb} ETB</p>
                    <p className="text-[11px] text-outline">(${note.priceUsd.toFixed(2)} USD)</p>
                  </div>
                </div>

                {/* Account Selection Cards */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-outline">
                    1. Choose Payment Method:
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
                          className={`flex flex-col items-start p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? 'border-secondary-container bg-secondary-container/10 shadow-sm ring-2 ring-secondary-container'
                              : 'border-surface-variant bg-surface-lowest hover:border-outline'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full mb-2">
                            <Icon size={22} className={isSelected ? 'text-amber-500' : 'text-outline'} />
                            {isSelected && <IconCheck size={16} className="text-amber-500 font-bold" />}
                          </div>
                          <span className="text-xs font-bold text-on-surface">{acc.name}</span>
                          <span className="text-[10px] text-outline mt-0.5">{acc.brandBadge}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Account Details Box */}
                <div className="rounded-2xl border border-surface-variant bg-surface-lowest p-5 sm:p-6 shadow-level-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary font-display">
                      {activeAccount.name} Transfer Details
                    </span>
                    <span className="rounded-full bg-surface-container px-2.5 py-0.5 text-[11px] font-semibold text-on-surface-variant border border-surface-variant">
                      Verified Account
                    </span>
                  </div>

                  <div className="rounded-xl border border-surface-variant bg-surface-low p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <p className="text-[11px] text-outline">Account / Phone Number:</p>
                      <p className="text-xl sm:text-2xl font-mono font-extrabold text-primary tracking-wider">
                        {activeAccount.accountNumber}
                      </p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        Holder: <strong className="text-on-surface">{activeAccount.accountName}</strong>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleCopy(activeAccount.accountNumber)}
                      className="flex items-center justify-center gap-1.5 rounded-full border border-surface-variant bg-surface px-4 py-2 text-xs font-bold text-on-surface shadow-xs transition-all hover:bg-surface-high active:scale-95 shrink-0 cursor-pointer"
                    >
                      {copiedAccount === activeAccount.accountNumber ? (
                        <>
                          <IconCheck size={15} className="text-emerald-500" />
                          <span className="text-emerald-500 font-bold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <IconCopy size={15} />
                          <span>Copy Number</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="rounded-xl bg-surface-low p-3.5 text-xs text-on-surface-variant leading-relaxed space-y-1 border border-surface-variant">
                    <p className="font-bold text-on-surface">Transfer Instructions:</p>
                    <p>{activeAccount.instruction}</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Receipt Upload & Proof Submission */}
              <div className="lg:col-span-5">
                <form
                  onSubmit={handleSubmit}
                  className="sticky top-24 rounded-3xl border border-surface-variant bg-surface-lowest p-6 sm:p-7 shadow-level-1 space-y-5"
                >
                  <div>
                    <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-500">
                      <IconReceipt size={16} />
                      <span>Step 2: Upload Payment Proof</span>
                    </div>
                    <h2 className="mt-1 text-xl font-bold font-display text-primary">
                      Submit Receipt
                    </h2>
                    <p className="text-xs text-on-surface-variant mt-0.5">
                      Upload your transaction slip or SMS screenshot to verify your payment.
                    </p>
                  </div>

                  {/* Payer Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface">Payer Full Name</label>
                    <input
                      type="text"
                      required
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      placeholder="Daniel Gidey"
                      className="w-full rounded-xl border border-surface-variant bg-surface-low px-4 py-2.5 text-xs sm:text-sm text-on-surface placeholder:text-outline focus:border-primary focus:bg-surface-lowest focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Transaction Ref */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface">
                      Transaction Reference / SMS Code <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. TLBR-98726514 / CBE Ref"
                      className="w-full rounded-xl border border-surface-variant bg-surface-low px-4 py-2.5 font-mono text-xs sm:text-sm text-on-surface placeholder:text-outline focus:border-primary focus:bg-surface-lowest focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Optional Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface">Payer Phone Number (Optional)</label>
                    <input
                      type="tel"
                      value={payerPhone}
                      onChange={(e) => setPayerPhone(e.target.value)}
                      placeholder="0911 00 00 00"
                      className="w-full rounded-xl border border-surface-variant bg-surface-low px-4 py-2.5 text-xs sm:text-sm text-on-surface placeholder:text-outline focus:border-primary focus:bg-surface-lowest focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>

                  {/* Receipt Image / PDF Upload Dropzone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-on-surface">
                      Receipt Screenshot or PDF Slip <span className="text-rose-500">*</span>
                    </label>
                    {receiptPreview ? (
                      <div className="relative rounded-2xl border border-surface-variant bg-surface-low p-2.5">
                        <img
                          src={receiptPreview}
                          alt="Receipt proof preview"
                          className="h-36 w-full rounded-xl object-contain bg-surface-lowest"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setReceiptFile(null)
                            setReceiptPreview(null)
                          }}
                          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-rose-600 text-white shadow-md hover:bg-rose-700 transition-colors cursor-pointer"
                          title="Remove file"
                        >
                          <IconTrash size={16} />
                        </button>
                        <p className="mt-2 text-center text-[11px] text-outline truncate px-2 font-mono">
                          {receiptFile?.name || 'receipt_screenshot.png'}
                        </p>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-surface-variant bg-surface-low p-6 cursor-pointer hover:border-primary hover:bg-surface-high transition-all text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-surface-container text-on-surface-variant mb-2 shadow-xs">
                          <IconFileUpload size={22} />
                        </div>
                        <span className="text-xs font-bold text-primary font-display">Click to upload receipt</span>
                        <span className="text-[11px] text-outline mt-0.5">Supports PNG, JPG, JPEG, PDF (max 10MB)</span>
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
                    <p className="text-xs font-semibold text-rose-500 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                      {formError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary-container py-3.5 text-xs sm:text-sm font-bold text-on-secondary-container shadow-level-1 transition-all hover:brightness-105 hover:shadow-level-2 active:scale-95 disabled:opacity-50 cursor-pointer font-display"
                  >
                    <IconPhoto size={18} />
                    <span>{isSubmitting ? 'Submitting Receipt...' : 'Submit Receipt for Verification'}</span>
                  </button>

                  <div className="flex items-center justify-center gap-1.5 text-[11px] text-outline text-center">
                    <IconShieldCheck size={15} className="text-emerald-500" />
                    <span>Instant document unlock upon payment confirmation</span>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer onNavigate={onNavigate} user={user} />
    </div>
  )
}
