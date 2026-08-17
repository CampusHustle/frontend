import Reveal from "./Reveal.jsx";

const stats = [
  { value: "5,000+", label: "Verified university students & tutors" },
  { value: "15+", label: "Ethiopian campuses connected (.edu.et)" },
  { value: "10k+", label: "Course notes scanned & indexed with AI" },
];

export default function Stats() {
  return (
    <section className="border-b border-surface-variant bg-surface-lowest">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y divide-surface-variant px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:divide-surface-variant sm:px-6 lg:px-8">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <div className="flex flex-col items-center sm:items-start gap-2 py-10 px-4 sm:py-14 sm:px-6">
              <span className="font-poppins text-4xl font-bold tracking-tight text-hustle-600 lg:text-5xl">
                {stat.value}
              </span>
              <span className="text-sm font-semibold leading-snug text-on-surface text-center sm:text-left">
                {stat.label}
              </span>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
