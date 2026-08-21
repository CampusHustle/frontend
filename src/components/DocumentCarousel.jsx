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
    <div className="flex w-full flex-col gap-3 lg:col-span-7">
      {/* Title */}
      <div className="shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary font-display leading-snug">
          {note.title}
        </h1>
        <span className="self-start sm:self-auto rounded-full bg-surface-container px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-on-surface-variant shrink-0 border border-surface-variant">
          Sample Slide {currentSlide + 1} of {note.previewSlides.length}
        </span>
      </div>

      {/* Slide Viewer Card - Flex-1 to fit viewport */}
      <div className="group relative flex-1 w-full min-h-[250px] sm:min-h-[300px] aspect-video sm:aspect-auto overflow-hidden rounded-2xl border border-surface-variant bg-surface-lowest shadow-level-1 flex items-center justify-center">
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
          className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <IconChevronLeft size={20} />
        </button>

        {/* Navigation Right Arrow */}
        <button
          type="button"
          onClick={nextSlide}
          aria-label="Next sample slide"
          className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-black/60 text-white shadow-lg backdrop-blur-sm transition-all hover:bg-black/80 hover:scale-110 active:scale-95 cursor-pointer"
        >
          <IconChevronRight size={20} />
        </button>

        {/* Bottom Slide Info & Interactive Dots */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-3 sm:p-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-white text-[10px] sm:text-xs font-medium backdrop-blur-md bg-black/50 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border border-white/20 truncate max-w-[150px] sm:max-w-xs">
              <IconEye size={14} className="text-amber-400 shrink-0" />
              <span className="truncate">{activeSlideData.title}</span>
            </div>

            {/* 3 Clickable Slide Dots */}
            <div className="flex items-center gap-1.5">
              {note.previewSlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 sm:h-2.5 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx
                      ? 'w-5 sm:w-6 bg-amber-400 shadow-sm'
                      : 'w-2 sm:w-2.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={handleMakePayment}
            className="rounded-full bg-secondary-container px-3 py-1 sm:px-3.5 sm:py-1.5 text-[10px] sm:text-xs font-bold text-on-secondary-container shadow-sm hover:brightness-105 transition-all active:scale-95 shrink-0 cursor-pointer"
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
            className="flex items-center gap-2 rounded-xl border border-surface-variant bg-surface-lowest p-2.5 sm:p-2 text-xs sm:text-[11px] font-medium text-on-surface-variant shadow-2xs"
          >
            <IconCircleCheckFilled size={14} className="shrink-0 text-amber-400" />
            <span className="break-words text-on-surface">{item}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
