import {
  IconBolt,
  IconFileText,
  IconShieldCheck,
} from '@tabler/icons-react'

export default function PurchaseCard({ note, handleMakePayment }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
      {/* Price Row */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3">
        <div>
          <p className="text-[11px] uppercase font-bold tracking-wider text-gray-400">Total Price</p>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl font-extrabold text-[#041534] tracking-tight">
              ${note.price.toFixed(2)}
            </span>
            <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-bold text-amber-800 border border-amber-200">
              {note.priceEtb} ETB
            </span>
          </div>
        </div>
        <span className="rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
          Digital PDF
        </span>
      </div>

      {/* Note Specs */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="rounded-xl bg-gray-50 p-2 border border-gray-100">
          <span className="text-[10px] text-gray-400 block font-medium">Format</span>
          <strong className="text-gray-900 font-semibold text-xs mt-0.5 block">{note.format}</strong>
        </div>
        <div className="rounded-xl bg-gray-50 p-2 border border-gray-100">
          <span className="text-[10px] text-gray-400 block font-medium">Pages</span>
          <strong className="text-gray-900 font-semibold text-xs mt-0.5 block">{note.length}</strong>
        </div>
        <div className="rounded-xl bg-gray-50 p-2 border border-gray-100">
          <span className="text-[10px] text-gray-400 block font-medium">Downloads</span>
          <strong className="text-gray-900 font-semibold text-xs mt-0.5 block">{note.sales}</strong>
        </div>
      </div>

      {/* Description */}
      <div className="text-xs text-gray-600 leading-relaxed bg-gray-50/70 p-3 rounded-xl border border-gray-100">
        <p className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
          <IconFileText size={14} className="text-amber-600" />
          <span>About these notes</span>
        </p>
        <p className="line-clamp-2">{note.description}</p>
      </div>

      {/* Buy Now (Make Payment) Button */}
      <button
        type="button"
        onClick={handleMakePayment}
        className="w-full flex items-center justify-center gap-2 rounded-xl bg-amber-500 py-3.5 text-sm font-bold text-gray-950 shadow-md hover:bg-amber-400 hover:shadow-lg transition-all active:scale-95"
      >
        <IconBolt size={18} />
        <span>Buy Now (Make Payment)</span>
      </button>

      <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1 text-center">
        <IconShieldCheck size={14} className="text-emerald-600" />
        <span>Verified Telebirr, CBE & BOA manual unlock</span>
      </p>
    </div>
  )
}
