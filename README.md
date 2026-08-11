# Campus Hustle 🚀

> **The ultimate peer-to-peer campus marketplace & micro-gig platform for university students.**

Campus Hustle connects students who need quick tasks done with fellow campus peers ready to earn extra income. From graphic design and tutoring to moving help and tech support, Campus Hustle makes campus commerce seamless, secure, and hyper-local.

---

## ✨ Features

- **🎓 Campus-Centric Gig Board**: Hyper-local micro-task matching tailored specifically to university communities.
- **⚡ Modern Dark-Mode UI**: Built with a sleek dark aesthetic (`bg-ink-950`), vibrant gold accents (`hustle-500`), smooth custom scrollbars, and glassmorphism elements.
- **📱 Fully Responsive & Animated**: Powered by [Motion](https://motion.dev/) for fluid scroll reveals, animated stats, interactive cards, and responsive layouts.
- **🧩 Bento Grid Layout**: Dynamic preview grid highlighting core platform capabilities (instant matching, student verification, secure escrows, and quick payouts).
- **💬 Community Testimonials & Social Proof**: Live marquee ticker of university partners and student success stories.
- **🎨 Custom Design System**: Tailored theme tokens (`ink` palette, `hustle` brand palette) with `Space Grotesk` and `DM Sans` typography.

---

## 🛠️ Tech Stack

| Technology | Role |
| :--- | :--- |
| **[React 19](https://react.dev/)** | Component-based UI library |
| **[Vite 8](https://vitejs.dev/)** | High-performance frontend build tooling |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Utility-first CSS framework with custom theme tokens |
| **[Motion](https://motion.dev/)** | Animations, scroll reveals, and micro-interactions |
| **[Tabler Icons](https://tabler-icons.io/)** | Crisp UI icons for React components |

---

## 📁 Project Structure

```
frontend/
├── public/              # Static assets and favicons
├── src/
│   ├── components/      # Modular UI components
│   │   ├── Bento.jsx        # Interactive platform feature grid
│   │   ├── FinalCta.jsx     # Call-to-action banner
│   │   ├── Footer.jsx       # Footer layout & quick links
│   │   ├── Hero.jsx         # Hero section with live gig cards & CTA
│   │   ├── HowItWorks.jsx   # Step-by-step workflow guide
│   │   ├── Logo.jsx         # Brand logo component
│   │   ├── Marquee.jsx      # Animated campus ticker
│   │   ├── Navbar.jsx       # Navigation header with mobile menu
│   │   ├── Reveal.jsx       # Scroll animation wrapper component
│   │   ├── Stats.jsx        # Key platform metrics & stats counter
│   │   └── Testimonial.jsx  # Student reviews & testimonials
│   ├── App.jsx          # Root application component
│   ├── main.jsx         # Application entry point
│   └── index.css        # Global CSS, font configuration & Tailwind CSS v4 setup
├── eslint.config.js     # ESLint configuration
├── vite.config.js       # Vite configuration
└── package.json         # Project dependencies and script declarations
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed locally:
- **Node.js**: `v18.0.0` or higher
- **npm**: `v9.0.0` or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone git@github.com:CampusHustle/frontend.git
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to `http://localhost:5173`.

---

## 📜 Available Scripts

In the project directory, you can run:

- `npm run dev` - Launches local development server with Hot Module Replacement (HMR).
- `npm run build` - Compiles and bundles production-ready assets into the `dist/` directory.
- `npm run preview` - Serves the production build locally for verification.
- `npm run lint` - Runs ESLint to check for code quality and syntax errors.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

---

## 📄 License

This project is private and proprietary to **Campus Hustle**.
