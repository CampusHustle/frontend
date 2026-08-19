const GALLERY_ITEMS = [
  {
    name: 'CoSc 2011 · Algorithms & Data Structures',
    owner: 'Dawit Haile',
    campus: 'Addis Ababa University (AAiT)',
    desc: 'Full semester lecture annotations, diagrammed recursion trees, dynamic programming cheat-sheets, and 5 years of solved midterms. 4.9 ★ (120+ downloads).',
    image: '/assets/generated/gallery_algorithms_notes_1787121164596.jpg',
  },
  {
    name: 'EE 3102 · Circuit Theory & AC Networks',
    owner: 'Betelhem Worku',
    campus: 'AASTU',
    desc: 'Step-by-step mesh/nodal analysis proofs, Laplace transforms, and exam problem walkthroughs verified for AASTU electrical engineering batch.',
    image: '/assets/generated/gallery_circuits_notes_1787121182544.jpg',
  },
  {
    name: 'Chem 2041 · Organic Chemistry Mechanisms',
    owner: 'Natnael Girma',
    campus: 'Jimma University',
    desc: 'Complete reaction roadmaps, synthesis pathways, and lab summary sheets tailored for pre-med and pharmacy students.',
    image: '/assets/generated/gallery_chemistry_notes_1787121203488.jpg',
  },
  {
    name: 'Math 1022 · Calculus of Several Variables',
    owner: 'Kirubel Assefa',
    campus: 'ASTU (Adama)',
    desc: 'Top-rated peer tutoring pack: multi-variable calculus proofs, vector fields, surface integrals, and 60 solved exam questions with instant Telebirr access.',
    image: '/assets/generated/gallery_calculus_notes_1787121222472.jpg',
    isFeatured: true,
  },
  {
    name: 'Econ 1011 · Applied Microeconomics',
    owner: 'Selamawit Tadesse',
    campus: 'AAU School of Commerce',
    desc: 'High-yield conceptual summaries, cost curve calculations, and model exam walkthroughs with clear Amharic/English explanations.',
    image: '/assets/generated/gallery_economics_notes_1787121241325.jpg',
  },
  {
    name: 'Med 3010 · Clinical Pathology & Anatomy',
    owner: 'Rahel Tesfaye',
    campus: 'Tikur Anbessa Health Sciences',
    desc: 'Organ system summaries, histological photo guides, and diagnostic algorithms designed for Ethiopian medical student clinical years.',
    image: '/assets/generated/gallery_anatomy_notes_1787121267896.jpg',
  },
]

export default function MovementGallery() {
  return (
    <section className="blue-section" aria-label="Academic movement section">
      <p className="blue-section-copy">
        <span className="blue-section-copy-muted">
          <strong className="blue-section-copy-emphasis">Ethiopian students</strong> already share handwritten notes and exam tips across Telegram groups, dorm lounges, and Google Drives.
        </span>{' '}
        <span className="blue-section-copy-strong">Campus Hustle gives that academic economy a verified home.</span>
      </p>

      <section className="gallery-section" aria-label="Featured note packages and tutor offerings">
        <div className="gallery-grid">
          {GALLERY_ITEMS.map((item) => (
            <div
              key={item.name}
              className={`gallery-item ${item.isFeatured ? 'is-featured' : ''}`}
            >
              <img src={item.image} alt={item.name} loading="lazy" width="400" height="400" className="object-cover size-full" />
              <div className="gallery-item-overlay">
                <div className="gallery-item-bottom">
                  <p className="gallery-item-desc">{item.desc}</p>
                  <div className="gallery-item-bottom-row">
                    <span className="gallery-item-meta">{item.name} - by {item.owner}</span>
                    <span className="gallery-item-university">{item.campus}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  )
}
