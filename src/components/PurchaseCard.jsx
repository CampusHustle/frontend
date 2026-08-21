import {
  IconBolt,
  IconFileText,
  IconShieldCheck,
} from '@tabler/icons-react'

export default function PurchaseCard({ note, handleMakePayment }) {
  return (
    <div className="w-full flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
      {/* Price Row */}
      <div className="flex flex-wrap items-center justify-between border-b border-gray-100 pb-3 gap-2">
        <div>
          <p className="text-[10px] sm:text-[11px] uppercase font-bold tracking-wider text-gray-400">Total Price</p>
          <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
            <span className="text-2xl sm:text-3xl font-extrabold text-[#041534] tracking-tight">
              {note.priceEtb || (typeof note.price === 'number' ? Math.round(note.price * 10) : note.price) || 150} ETB
            </span>
          </div>
        </div>
        <span className="rounded-lg bg-gray-100 px-3 py-1 text-[10px] sm:text-xs font-semibold text-gray-600">
          Digital PDF
        </span>
      </div>

      {/* Note Specs */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center text-xs">
        <div className="rounded-xl bg-gray-50 p-2 border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-[10px] text-gray-400 block font-medium">Format</span>
          <strong className="text-gray-900 font-semibold text-[10px] sm:text-xs mt-0.5 block break-words w-full">{note.format}</strong>
        </div>
        <div className="rounded-xl bg-gray-50 p-2 border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-[10px] text-gray-400 block font-medium">Pages</span>
          <strong className="text-gray-900 font-semibold text-[10px] sm:text-xs mt-0.5 block break-words w-full">{note.length}</strong>
        </div>
        <div className="rounded-xl bg-gray-50 p-2 border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-[10px] text-gray-400 block font-medium">Downloads</span>
          <strong className="text-gray-900 font-semibold text-[10px] sm:text-xs mt-0.5 block break-words w-full">{note.sales}</strong>
        </div>
      </div>

      {/* Description */}
      <div className="text-[11px] sm:text-xs text-gray-600 leading-relaxed bg-gray-50/70 p-3 rounded-xl border border-gray-100">
        <p className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
          <IconFileText size={14} className="text-amber-600" />
          <span>About these notes</span>
        </p>
        <p className="line-clamp-3 sm:line-clamp-2">{note.description}</p>
      </div>

      {/* Buy Now (Make Payment) Button */}
      <button
        type="button"
        onClick={handleMakePayment}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 sm:py-3.5 text-xs sm:text-sm font-bold text-gray-950 shadow-md hover:bg-amber-400 hover:shadow-lg transition-all active:scale-95"
      >
        <IconBolt size={18} />
        <span>Buy Now (Make Payment)</span>
      </button>

      <p className="text-[10px] sm:text-[11px] text-gray-400 flex flex-wrap items-center justify-center gap-1 text-center">
        <IconShieldCheck size={14} className="text-emerald-600 shrink-0" />
        <span>Verified Telebirr, CBE & BOA manual unlock</span>
      </p>
    </div>
  )
}
