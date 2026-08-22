# Campus Hustle  🚀

> **The ultimate peer-to-peer campus marketplace & micro-gig platform for university students.**

Campus Hustle connects students who need quick tasks done with fellow campus peers ready to earn extra income. From graphic design and tutoring to moving help and tech support, Campus Hustle makes campus commerce seamless, secure, and hyper-local.

---

## ✨ Features

- **🎓 Campus-Centric Gig Board**: Hyper-local micro-task matching tailored specifically to university communities.
- **⚡ Modern Light-Mode UI**: Built with a clean light aesthetic (`surface`), deep navy accents (`primary`), vibrant gold CTAs (`secondary-container`), and rounded Material-style cards.
- **🔐 Student Verified Sign-Up / Sign-In**: `.edu` email validation, terms acceptance, and an SSO-enabled sign-in flow with a mocked API.
- **📱 Fully Responsive**: Clean, centered card layouts that adapt across mobile and desktop viewports.
- **🎨 Custom Design System**: Tailored theme tokens (navy `primary`, gold `secondary-container`, `surface` palette, `error-container`) with `Montserrat` and `Inter` typography and Material Symbols icons.

---

## 🛠️ Tech Stack

| Technology | Role |
| :--- | :--- |
| **[React 19](https://react.dev/)** | Component-based UI library |
| **[Vite 8](https://vitejs.dev/)** | High-performance frontend build tooling |
| **[Tailwind CSS v4](https://tailwindcss.com/)** | Utility-first CSS framework with custom theme tokens |
| **[Vitest](https://vitest.dev/)** | Unit & component testing with React Testing Library |
| **[Material Symbols](https://fonts.google.com/icons)** | Outline icons for inputs, badges, and CTAs |

---

## 📁 Project Structure

```
frontend/
├── public/              # Static assets and favicons
├── src/
│   ├── __tests__/       # Component & integration tests
│   │   ├── SignUpForm.test.jsx  # Sign-up flow tests
│   │   └── SignInForm.test.jsx  # Sign-in flow tests
│   ├── api/
│   │   └── mockAuthApi.js       # Mocked auth API (swap for real fetch later)
│   ├── components/
│   │   ├── AuthTextField.jsx    # Labeled input with icon + error state
│   │   ├── PrimaryButton.jsx    # Gold CTA button with loading spinner
│   │   ├── Toast.jsx            # Success / error banner
│   │   └── TrustBadge.jsx       # Verified-students / SSO pill badge
│   ├── pages/
│   │   ├── SignUpForm.jsx       # Sign-up form (.edu email, terms)
│   │   └── SignInForm.jsx       # Sign-in form (remember me, SSO)
│   ├── utils/
│   │   └── validators.js        # Pure validation helpers
│   ├── App.jsx          # Root component with sign-in / sign-up toggle
│   ├── main.jsx         # Application entry point
│   ├── setupTests.js    # Jest-DOM matchers for Vitest
│   └── index.css        # Global CSS, fonts & Tailwind CSS v4 theme tokens
├── eslint.config.js     # ESLint configuration
├── vite.config.js       # Vite + Vitest configuration
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
- `npm test` - Runs the Vitest test suite once.
- `npm run test:watch` - Runs Vitest in watch mode.

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
