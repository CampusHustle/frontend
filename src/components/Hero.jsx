import { useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { IconArrowRight, IconRocket, IconPlayerPlayFilled } from "@tabler/icons-react";

function fade(reduce, delay) {
  return {
    initial: reduce ? false : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] },
  };
}

export default function Hero({ onNavigate }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);

  const handleNav = (targetView) => (e) => {
    e.preventDefault();
    if (onNavigate) onNavigate(targetView);
  };

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative flex min-h-[90svh] items-center justify-center overflow-hidden pt-28 pb-20 sm:pt-32 font-['Poppins']"
    >
      {/* Direct image background with slight blur and smooth readability gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      >
        <img
          src="/assets/ch.png"
          alt=""
          className="size-full object-cover object-center filter blur-[2px] scale-105"
        />
        {/* Dark contrast gradient to ensure high readability for text */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/75" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.h1
          {...fade(reduce, 0.08)}
          className="mt-6 font-poppins text-5xl font-bold leading-[1.05] tracking-tight text-white drop-shadow-md sm:text-6xl lg:text-7xl"
        >
          Your campus.{" "}
          <span className=" text-hustle-400 drop-shadow">Your hustle.</span>
        </motion.h1>

        <motion.p
          {...fade(reduce, 0.16)}
          className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl leading-relaxed text-white/90 drop-shadow-sm"
        >
          Post a skill, pick up a gig, and get paid within days. Built for
          students, by students.
        </motion.p>

        <motion.div
          {...fade(reduce, 0.24)}
          className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5"
        >
          {/* Primary Button with Text Flip & Icon Metamorphosis */}
          <motion.a
            whileHover={reduce ? {} : { scale: 1.05, y: -2 }}
            whileTap={reduce ? {} : { scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            href="#"
            onClick={handleNav("signup")}
            className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full bg-gradient-to-r from-hustle-400 via-hustle-500 to-hustle-600 px-8 py-4 text-base font-bold text-ink-contrast shadow-[0_4px_20px_rgba(255,175,43,0.4)] transition-shadow duration-300 hover:shadow-[0_8px_32px_rgba(255,175,43,0.65)]"
          >
            {/* Animated light shine beam sweeping across */}
            <span
              aria-hidden="true"
              className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-full"
            />
            
            {/* Text Flip Effect */}
            <span className="relative z-10 block h-6 overflow-hidden leading-6 font-bold tracking-wide">
              <span className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-6">
                <span>Start hustling</span>
                <span>Join the Hustle</span>
              </span>
            </span>

            {/* Icon Flip Effect */}
            <span className="relative z-10 block size-5 overflow-hidden">
              <span className="flex flex-col items-center transition-transform duration-300 ease-out group-hover:-translate-y-5">
                <IconArrowRight size={19} stroke={2.5} className="shrink-0" />
                <IconRocket size={19} stroke={2.5} className="shrink-0 text-ink-contrast -rotate-45" />
              </span>
            </span>
          </motion.a>

          {/* Secondary Button with Text Flip & Play Icon Metamorphosis */}
          <motion.a
            whileHover={reduce ? {} : { scale: 1.05, y: -2 }}
            whileTap={reduce ? {} : { scale: 0.96 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            href="#how-it-works"
            className="group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full border border-white/35 bg-white/10 px-8 py-4 text-base font-semibold text-white shadow-level-1 backdrop-blur-md transition-all duration-300 hover:border-white hover:bg-white/20 hover:shadow-[0_0_24px_rgba(255,255,255,0.3)]"
          >
            {/* Animated Icon Container */}
            <span className="relative z-10 block size-4 overflow-hidden">
              <span className="flex flex-col items-center transition-transform duration-300 ease-out group-hover:-translate-y-4">
                <span className="flex size-2 rounded-full bg-hustle-400 animate-pulse my-1 shrink-0" />
                <IconPlayerPlayFilled size={14} className="text-hustle-400 my-0.5 shrink-0" />
              </span>
            </span>

            {/* Text Flip Effect */}
            <span className="relative z-10 block h-6 overflow-hidden leading-6">
              <span className="flex flex-col transition-transform duration-300 ease-out group-hover:-translate-y-6">
                <span>How it works</span>
                <span className="text-white font-bold">See the Magic</span>
              </span>
            </span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
