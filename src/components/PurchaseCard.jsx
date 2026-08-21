import {
  IconBolt,
  IconFileText,
  IconShieldCheck,
} from '@tabler/icons-react'

export default function PurchaseCard({ note, handleMakePayment }) {
  return (
    <div className="w-full flex flex-col justify-between rounded-2xl border border-surface-variant bg-surface-lowest p-4 sm:p-5 shadow-level-1 space-y-4">
      {/* Price Row */}
      <div className="flex flex-wrap items-center justify-between border-b border-surface-variant pb-3 gap-2">
        <div>
          <p className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-outline">Total Price</p>
          <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-primary font-display tracking-tight">
              ${note.price.toFixed(2)}
            </span>
            <span className="rounded-full bg-secondary-container/20 px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-amber-500 dark:text-amber-300 border border-secondary-container/40">
              {note.priceEtb} ETB
            </span>
          </div>
        </div>
        <span className="rounded-lg bg-surface-container px-3 py-1 text-[10px] sm:text-xs font-semibold text-on-surface-variant border border-surface-variant">
          Digital PDF
        </span>
      </div>

      {/* Note Specs */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center text-xs">
        <div className="rounded-xl bg-surface-low p-2 border border-surface-variant flex flex-col items-center justify-center">
          <span className="text-[10px] text-outline block font-medium">Format</span>
          <strong className="text-on-surface font-semibold text-[10px] sm:text-xs mt-0.5 block break-words w-full">{note.format}</strong>
        </div>
        <div className="rounded-xl bg-surface-low p-2 border border-surface-variant flex flex-col items-center justify-center">
          <span className="text-[10px] text-outline block font-medium">Pages</span>
          <strong className="text-on-surface font-semibold text-[10px] sm:text-xs mt-0.5 block break-words w-full">{note.length}</strong>
        </div>
        <div className="rounded-xl bg-surface-low p-2 border border-surface-variant flex flex-col items-center justify-center">
          <span className="text-[10px] text-outline block font-medium">Downloads</span>
          <strong className="text-on-surface font-semibold text-[10px] sm:text-xs mt-0.5 block break-words w-full">{note.sales}</strong>
        </div>
      </div>

      {/* Description */}
      <div className="text-[11px] sm:text-xs text-on-surface-variant leading-relaxed bg-surface-low p-3 rounded-xl border border-surface-variant">
        <p className="font-semibold text-on-surface mb-1 flex items-center gap-1">
          <IconFileText size={14} className="text-amber-500" />
          <span>About these notes</span>
        </p>
        <p className="line-clamp-3 sm:line-clamp-2">{note.description}</p>
      </div>

      {/* Buy Now (Make Payment) Button */}
      <button
        type="button"
        onClick={handleMakePayment}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-secondary-container py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-on-secondary-container shadow-level-1 hover:brightness-105 hover:shadow-level-2 transition-all active:scale-95 cursor-pointer font-display"
      >
        <IconBolt size={18} />
        <span>Buy Now (Make Payment)</span>
      </button>

      <p className="text-[10px] sm:text-[11px] text-outline flex flex-wrap items-center justify-center gap-1 text-center">
        <IconShieldCheck size={14} className="text-emerald-500 shrink-0" />
        <span>Verified Telebirr, CBE &amp; BOA manual unlock</span>
      </p>
    </div>
  )
}
