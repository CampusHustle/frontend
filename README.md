# CampusHustle — Frontend

**Learn. Teach. Earn.**

CampusHustle is a university-verified peer-to-peer academic marketplace where students can find tutors, buy and sell study notes, and get AI-powered study help — all within a single trusted campus community. Think of it as an academic creator economy: students earn from knowledge they already have, and learners get affordable, relevant help from peers who recently took the same courses.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Features](#features)
- [Application Routes](#application-routes)
- [Architecture Notes](#architecture-notes)
- [Testing](#testing)
- [CI/CD Pipeline](#cicd-pipeline)
- [Contributing](#contributing)

---

## Tech Stack

| Technology | Version | Role |
|---|---|---|
| React | 19 | Component-based UI library |
| Vite | 8 | Build tool and dev server |
| Tailwind CSS | 4 | Utility-first styling with custom design tokens |
| React Router | 7 | Client-side routing |
| Socket.IO Client | 4 | Real-time chat connection |
| Motion | 13 | Animation library |
| Tabler Icons | 3 | Icon set |
| Vitest | 4 | Unit and component test runner |
| Testing Library | 16 | DOM assertions and user interaction testing |

---

## Getting Started

### Prerequisites

- Node.js `v18` or higher
- npm `v9` or higher

### Setup

```bash
# 1. Clone the repo
git clone git@github.com:CampusHustle/frontend.git
cd frontend

# 2. Install dependencies
npm install

# 3. Copy the environment file and fill in your values
cp .env.example .env

# 4. Start the dev server
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Available Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Starts the dev server with hot reload |
| `npm run build` | Builds the production bundle into `dist/` |
| `npm run preview` | Serves the production build locally |
| `npm run lint` | Runs ESLint across the whole project |
| `npm test` | Runs the full Vitest test suite once |
| `npm run test:watch` | Runs Vitest in watch mode |

---

## Environment Variables

Copy `.env.example` to `.env` and set the following:

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Base URL for the backend API | `https://api.campushustle.com` |
| `VITE_SOCKET_URL` | WebSocket server URL (defaults to `VITE_API_URL` if not set) | `wss://api.campushustle.com` |

> In development with Vite's proxy configured, you can leave `VITE_API_URL` empty.

---

## Project Structure

```
frontend/
├── public/                     # Static assets
├── src/
│   ├── admin/                  # Admin dashboard (separate section)
│   │   ├── components/         # AdminLayout, InteractiveCharts, ModalsAndDrawers
│   │   ├── context/            # AdminThemeContext (dark/light toggle)
│   │   ├── screens/            # Dashboard, UserManagement, VerificationQueue,
│   │   │                       #   ReportsModeration, ReportDetail
│   │   └── mockData.js         # Seed data for admin screens
│   │
│   ├── api/                    # API layer
│   │   ├── client.js           # Axios/fetch base client with auth headers
│   │   ├── authApi.js          # Login, signup, profile, token refresh
│   │   ├── tutorApi.js         # Tutor search, profile, availability
│   │   ├── bookingApi.js       # Create and manage bookings
│   │   ├── chatApi.js          # Conversations and messages
│   │   ├── noteApi.js          # Note listings and purchases
│   │   ├── aiApi.js            # AI study assistant
│   │   ├── reviewApi.js        # Ratings and reviews
│   │   ├── notificationApi.js  # User notifications
│   │   ├── mockAuthApi.js      # Mock auth (used in offline/test mode)
│   │   ├── mockBookingApi.js   # Mock booking state
│   │   ├── mockChatApi.js      # Seed chat data and mock subscription
│   │   └── mockUsers.js        # Seed tutor/user data
│   │
│   ├── components/             # Reusable UI components
│   │   ├── AppNavbar.jsx       # Top navigation bar (search, profile, logout)
│   │   ├── BookingCard.jsx     # Single booking row with status badge and actions
│   │   ├── BookingStatusBadge.jsx  # Pending/confirmed/completed/cancelled pill
│   │   ├── ConsentModal.jsx    # Contact-sharing consent dialog
│   │   ├── FloatingAiAssistant.jsx  # Floating chat bubble for AI assistant
│   │   ├── Footer.jsx          # Site-wide footer
│   │   ├── LogoutWarningModal.jsx  # Logout confirmation dialog
│   │   ├── PurchaseCard.jsx    # Note purchase summary card
│   │   └── ...                 # Landing page sections (Hero, Bento, Stats, etc.)
│   │
│   ├── hooks/
│   │   └── useSocket.js        # Socket lifecycle hook (connect/disconnect/status)
│   │
│   ├── pages/                  # Thin re-exports of screens (for test imports)
│   │
│   ├── screens/                # Full-page screen components
│   │   ├── HomeScreen.jsx      # Landing page
│   │   ├── LoginScreen.jsx     # Sign in
│   │   ├── SignupScreen.jsx     # Sign up with .edu email
│   │   ├── VerifyEmailScreen.jsx
│   │   ├── CompleteProfileScreen.jsx
│   │   ├── FindTutorScreen.jsx  # Search and filter tutors
│   │   ├── TutorDetailScreen.jsx  # Tutor profile, availability, booking
│   │   ├── MarketplaceScreen.jsx   # Study notes marketplace
│   │   ├── NoteDetailScreen.jsx    # Single note with purchase flow
│   │   ├── ProfileScreen.jsx    # Logged-in user profile
│   │   ├── PostListingScreen.jsx   # Create a new note listing
│   │   ├── BookingScreen.jsx    # Student's booking history and status
│   │   ├── TutorBookingRequestScreen.jsx  # Tutor's incoming requests
│   │   ├── ChatScreen.jsx       # Real-time peer messaging
│   │   ├── AiChatScreen.jsx     # AI study assistant
│   │   ├── TermsScreen.jsx
│   │   └── PrivacyScreen.jsx
│   │
│   ├── services/
│   │   └── socket.js           # Socket.IO factory (auth token, reconnection config)
│   │
│   ├── utils/
│   │   ├── sanitize.js         # Message and display text sanitization
│   │   ├── session.js          # localStorage session management (tokens, user)
│   │   ├── user.js             # Profile helpers (hasCompletedProfile, profileFromForm)
│   │   ├── validators.js       # Email, name, and input validation
│   │   └── theme.js            # Theme utilities
│   │
│   ├── __tests__/              # 26 test files covering pages, components, API, session
│   ├── App.jsx                 # Root component — all routes and global state
│   ├── main.jsx                # App entry point
│   ├── index.css               # Global styles and Tailwind v4 design tokens
│   └── setupTests.js           # Vitest global setup (jest-dom, observer stubs)
│
├── .env.example                # Environment variable template
├── .github/workflows/ci.yml    # GitHub Actions CI/CD pipeline
├── eslint.config.js
├── vite.config.js
└── package.json
```

---

## Features

### For Students
- **Find a tutor** — search by subject, price range, rating, and department with live filtering
- **Book a session** — pick an available time slot from a tutor's weekly grid and request a booking
- **Buy study notes** — browse peer-created PDFs and exam prep material, pay via Telebirr or bank transfer
- **Real-time chat** — message tutors directly once a booking is confirmed
- **Share contact info** — send verified contact details through the chat with explicit consent
- **AI study assistant** — ask questions and get answers grounded in tutor-uploaded material

### For Tutors
- **Set availability** — configure fixed weekly time slots for booking
- **Manage requests** — accept or decline incoming booking requests from a dedicated dashboard
- **Sell notes** — upload study materials and earn from every purchase
- **Live chat** — communicate with students after accepting their booking

### Platform
- **Booking status flow** — pending → confirmed → completed (or cancelled at any stage)
- **Input sanitization** — all user-submitted text is stripped of control characters and length-capped before display
- **Session persistence** — access/refresh tokens and last-visited page survive page reloads
- **Admin panel** — moderation dashboard for verifying accounts, managing users, and resolving reports

---

## Application Routes

| Route | Screen | Notes |
|---|---|---|
| `/` | HomeScreen | Public landing page |
| `/login` | LoginScreen | Email + password sign in |
| `/signup` | SignupScreen | Student email registration |
| `/verify-email` | VerifyEmailScreen | Token-based email verification |
| `/complete-profile` | CompleteProfileScreen | Onboarding after signup |
| `/tutor` | FindTutorScreen | Search and filter tutors |
| `/tutor/:id` | TutorDetailScreen | Tutor profile, availability, booking panel |
| `/market` | MarketplaceScreen | Browse all study notes |
| `/notes/:id` | NoteDetailPage | Note preview and purchase |
| `/notes/:id/payment` | NotePaymentPage | Upload payment receipt |
| `/profile` | ProfileScreen | Logged-in user's profile |
| `/post-listing` | PostListingScreen | Create a note listing |
| `/bookings` | BookingScreen | Student's booking history |
| `/tutor-requests` | TutorBookingRequestScreen | Tutor's incoming requests |
| `/chat` | ChatScreen | Peer messaging inbox |
| `/chat/:id` | ChatScreen | Direct conversation with a specific user |
| `/assistant` | AiChatScreen | AI study assistant |
| `/admin` | AdminLayout → DashboardOverviewScreen | Admin dashboard |
| `/admin/users` | UserManagementScreen | User list and actions |
| `/admin/verification` | VerificationQueueScreen | ID verification queue |
| `/admin/reports` | ReportsModerationScreen | Abuse report list |
| `/admin/reports/:id` | ReportDetailScreen | Individual report detail |
| `/terms` | TermsScreen | Terms of service |
| `/privacy` | PrivacyScreen | Privacy policy |

---

## Architecture Notes

### Routing and state

All routes live in `src/App.jsx`. Global state (current user, logout modal, tutorial list) is managed at the `AppRoutes` level and passed down as props. There is no Redux or Zustand — the app uses React's built-in `useState` and `useEffect` for state management.

### Authentication

On login, the backend returns an `accessToken` and `refreshToken`. Both are stored in `localStorage` via `src/utils/session.js`. The current user object is also persisted so the app can restore session state across page reloads. The `getAccessToken()` helper is called by the API client to attach the `Authorization` header to every request.

### Real-time chat

The `useSocket` hook in `src/hooks/useSocket.js` manages the Socket.IO lifecycle. It creates a socket via `src/services/socket.js`, attaches the access token in the auth handshake, handles `connect` / `disconnect` / `connect_error` / `reconnect_attempt` events, and cleans up all listeners on unmount. The `ChatScreen` uses the socket directly to send and receive messages.

### Input safety

`src/utils/sanitize.js` exports two helpers used across every chat input in the app:

- `sanitizeMessage(text)` — strips Unicode control characters and caps the string at 2000 characters
- `sanitizeDisplayText(text)` — same logic, capped at 200 characters for names and labels

React's JSX renderer escapes HTML by default, so there is no `innerHTML` injection risk — the sanitizer handles invisible control characters and length abuse.

### API layer

`src/api/client.js` is a shared fetch/axios base that attaches the access token. Every other file in `src/api/` uses this client. The mock API files (`mockAuthApi.js`, `mockBookingApi.js`, `mockChatApi.js`) are used in tests and offline development — swap them out for the real endpoints by changing the import in the consuming screen.

---

## Testing

The project has 26 test files in `src/__tests__/` covering:

- Page rendering and user interactions (login, signup, profile, tutor detail, marketplace, booking, chat)
- API layer (auth integration, booking status transitions)
- Utility functions (session management, validators)
- UI state (all four booking statuses, connection status badge, consent modal flow)

Run all tests:

```bash
npm test
```

Run a specific file:

```bash
npm test -- BookingStatus
```

Watch mode during development:

```bash
npm run test:watch
```

Tests use Vitest + Testing Library. Mocks for the socket, API calls, and browser APIs (localStorage, clipboard, IntersectionObserver) are set up in `src/setupTests.js` and per-test via `vi.mock()`.

---

## CI/CD Pipeline

Every push to `main` or `develop`, and every pull request targeting those branches, runs the following pipeline via GitHub Actions (`.github/workflows/ci.yml`):

**CI job:**
1. Check out source code
2. Set up Node.js 20 with npm cache
3. Install dependencies (`npm ci`)
4. Run ESLint (`npm run lint`)
5. Run Vitest test suite (`npm test`)
6. Build production bundle (`npm run build`)

**CD job** (runs only on push to `main`, after CI passes):
- Triggers a Vercel or Netlify deployment webhook configured as a repository secret (`VERCEL_DEPLOY_HOOK_URL` or `NETLIFY_BUILD_HOOK_URL`)

To configure deployment, add one of those secrets in your GitHub repository settings under **Settings → Secrets and variables → Actions**.

---

## Contributing

1. Branch off `develop` — never commit directly to `main`

```bash
git checkout develop
git checkout -b feature/your-feature-name
```

2. Make your changes, then verify everything passes before pushing:

```bash
npm run lint
npm test
npm run build
```

3. Push your branch and open a pull request targeting `develop`

```bash
git push -u origin feature/your-feature-name
```

4. The CI pipeline runs automatically. Address any failures before requesting review.

5. Once approved, the branch is merged into `develop`. Merges to `main` trigger the production deployment.

---

## License

Private and proprietary — CampusHustle, INSA CTC Summer Camp Project.
