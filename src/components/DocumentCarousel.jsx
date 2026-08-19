import { useState } from 'react'
import {
  IconChevronLeft,
  IconChevronRight,
  IconCircleCheckFilled,
  IconEye,
} from '@tabler/icons-react'

export default function DocumentCarousel({ note, handleMakePayment }) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    if (!note?.previewSlides?.length) return
    setCurrentSlide((prev) => (prev === note.previewSlides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    if (!note?.previewSlides?.length) return
    setCurrentSlide((prev) => (prev === 0 ? note.previewSlides.length - 1 : prev - 1))
  }

  const activeSlideData = note.previewSlides[currentSlide] || note.previewSlides[0]

  return (
    <div className="flex min-h-0 flex-col gap-3 lg:col-span-7 overflow-hidden">
      {/* Title */}
      <div className="shrink-0 flex items-center justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#041534] leading-snug truncate">
          {note.title}
        </h1>
        <span className="rounded-full bg-gray-200/80 px-2.5 py-0.5 text-[10px] font-bold text-gray-700 shrink-0">
          Sample Slide {currentSlide + 1} of {note.previewSlides.length}
        </span>
      </div>

      {/* Slide Viewer Card - Flex-1 to fit viewport */}
      <div className="group relative min-h-0 flex-1 w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm flex items-center justify-center">
        <img
          key={activeSlideData.id}
          src={activeSlideData.url}
          alt={activeSlideData.title}
          className="h-full w-full object-cover object-top transition-all duration-500 animate-fadeIn"
        />

        {/* Navigation Left Arrow */}
        <button
          type="button"
          onClick={prevSlide}
          aria-label="Previous sample slide"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110 active:scale-95"
        >
          <IconChevronLeft size={20} />
        </button>

        {/* Navigation Right Arrow */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next sample slide"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110 active:scale-95"
        >
          <IconChevronRight size={20} />
        </button>

        {/* Bottom Slide Info & Interactive Dots */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-3 sm:p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-white text-xs font-medium backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-full border border-white/20">
              <IconEye size={15} className="text-amber-400" />
              <span>{activeSlideData.title}</span>
            </div>

            {/* 3 Clickable Slide Dots */}
            <div className="flex items-center gap-1.5 ml-2">
              {note.previewSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all ${
                    currentSlide === idx
                      ? 'w-6 bg-amber-400 shadow-sm'
                      : 'w-2.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleMakePayment}
            className="rounded-full bg-white px-3.5 py-1 text-xs font-bold text-gray-900 shadow hover:bg-gray-100 transition-all active:scale-95 shrink-0 ml-2"
          >
            Full Preview
          </button>
        </div>
      </div>

      {/* Highlights Chips Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 shrink-0">
        {note.whatsInside.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-2 text-[11px] font-medium text-gray-700 shadow-2xs"
          >
            <IconCircleCheckFilled size={14} className="shrink-0 text-amber-500" />
            <span className="truncate">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
