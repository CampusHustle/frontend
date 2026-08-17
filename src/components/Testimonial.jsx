import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { IconArrowLeft, IconArrowRight, IconSparkles } from '@tabler/icons-react'
import Reveal from './Reveal.jsx'

const stories = [
  {
    id: 'maya',
    quote:
      'Between lab hours and my senior project, I tutor Algorithms 4 hours a week at the 4-Kilo library. It comfortably pays my living expenses and sharpened my own technical interview prep.',
    author: 'Maya Olana',
    role: 'Computer Science · 4th Year',
    campus: 'AAU 4-Kilo Campus',
    course: 'CoSc 2011 · Algorithms',
    stat: '4,800 ETB earned / mo',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'yared',
    quote:
      'I always kept neat handwritten diagrams for Circuit Analysis. Scanning them with the OCR upload converted my notebook into a published guide that 40+ freshmen purchased before midterms.',
    author: 'Yared Tadesse',
    role: 'Electrical Engineering · 3rd Year',
    campus: 'ASTU Main Campus',
    course: 'EE 3102 · Circuit Theory',
    stat: '42 note copies purchased',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'selam',
    quote:
      'The AI assistant queries only our tutor’s lecture notes. When studying at 1 AM for Thermodynamics, I got exact slide citations instead of generic web answers that didn’t match our professor’s exam style.',
    author: 'Selamawit Kebede',
    role: 'Mechanical Engineering · 3rd Year',
    campus: 'Hawassa University Tech',
    course: 'MEng 2021 · Thermodynamics',
    stat: 'Grade improved: C+ ➔ A',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  },
  {
    id: 'ermias',
    quote:
      'Having a senior student who aced the exact same course walk you through past exam problems in the campus lounge is 10x better than any online video tutorial.',
    author: 'Ermias Bekele',
    role: 'Software Engineering · 2nd Year',
    campus: 'Jimma University',
    course: 'SEng 2012 · OOP & Java',
    stat: 'Booked 6 peer sessions',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
]

export default function Testimonial() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Auto-advance every 6 seconds unless user is hovering
  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % stories.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isPaused, activeIndex])

  const activeStory = stories[activeIndex]

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % stories.length)
  }

  return (
    <section
      id="community"
      className="relative overflow-hidden bg-surface-lowest py-24 sm:py-32"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-surface-variant pb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-hustle-600">
                Peer Stories
              </span>
              <h2 className="mt-2 font-display text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                Real campus impact across Ethiopia.
              </h2>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous testimonial"
                className="flex size-11 items-center justify-center rounded-full border border-surface-variant text-on-surface transition-colors hover:border-primary hover:bg-surface-low active:scale-95"
              >
                <IconArrowLeft size={18} />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next testimonial"
                className="flex size-11 items-center justify-center rounded-full border border-surface-variant text-on-surface transition-colors hover:border-primary hover:bg-surface-low active:scale-95"
              >
                <IconArrowRight size={18} />
              </button>
            </div>
          </div>
        </Reveal>

        {/* Asymmetrical Editorial Spotlight Grid */}
        <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14 items-center">
          {/* Main Featured Quote (7 cols) */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStory.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col justify-between"
              >
                <blockquote className="font-display text-2xl sm:text-3xl lg:text-[2rem] font-medium leading-snug tracking-tight text-primary">
                  &ldquo;{activeStory.quote}&rdquo;
                </blockquote>

                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <img
                    src={activeStory.avatar}
                    alt={activeStory.author}
                    className="size-14 rounded-full border-2 border-surface-variant object-cover shadow-sm"
                  />
                  <div>
                    <h3 className="text-base font-bold text-primary">{activeStory.author}</h3>
                    <p className="text-sm text-on-surface-variant">{activeStory.role}</p>
                    <p className="text-xs text-outline font-medium">{activeStory.campus}</p>
                  </div>
                  <div className="ml-auto hidden sm:flex flex-col items-end">
                    <span className="inline-flex items-center gap-1 rounded-full bg-hustle-500/15 px-3 py-1 text-xs font-bold text-hustle-700">
                      <IconSparkles size={13} />
                      {activeStory.stat}
                    </span>
                    <span className="mt-1 text-[11px] text-outline">{activeStory.course}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Story Selector List with Live Progress Bar (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            {stories.map((story, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={story.id}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  className={`group relative flex flex-col rounded-xl p-4 text-left transition-all duration-200 ${
                    isActive
                      ? 'bg-surface-low border border-surface-variant shadow-sm'
                      : 'hover:bg-surface-lowest/70 border border-transparent opacity-65 hover:opacity-100'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-outline">0{idx + 1}</span>
                      <span className="text-sm font-bold text-primary">{story.author}</span>
                    </div>
                    <span className="text-xs text-on-surface-variant">{story.campus.split(' ')[0]}</span>
                  </div>

                  <p className="mt-1.5 line-clamp-1 text-xs text-on-surface-variant">
                    {story.course}
                  </p>

                  {/* Animated Progress indicator on active item */}
                  {isActive && !isPaused && (
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 6, ease: 'linear' }}
                      className="absolute bottom-0 left-0 right-0 h-0.5 origin-left bg-hustle-500 rounded-b-xl"
                    />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
