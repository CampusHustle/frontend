import { mockUsers } from './mockUsers.js'

// Demo-only mock layer: plaintext passwords live here so the frontend flow can
// be exercised without a backend. Production auth uses bcrypt (spec NFR-1) and
// never stores or logs plaintext passwords.
const DELAY = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test' || import.meta.env?.MODE === 'test' ? 50 : 800

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function findMockUser(email) {
  const normalized = email.trim().toLowerCase()
  return mockUsers.find((user) => user.email.toLowerCase() === normalized)
}

export async function mockLogin({ email, password }) {
  await delay(DELAY)
  const user = findMockUser(email)
  if (!user || user.password !== password) {
    throw { message: 'Invalid email or password' }
  }
  const { password: _password, ...safeUser } = user
  return {
    token: `mock-token-${user.email}`,
    user: safeUser,
  }
}

export async function mockSignup({
  name,
  email,
  password,
  university = 'Addis Ababa University',
  department = '',
  year = 1,
  role = 'student',
}) {
  await delay(DELAY)
  if (findMockUser(email)) {
    throw { message: 'That email is already registered' }
  }
  const user = {
    id: `u-${Date.now()}`,
    name,
    email,
    password,
    role: Array.isArray(role) ? role : [role],
    university,
    department,
    year: Number(year) || 1,
    bio: '',
    skillsTeaching: [],
    skillsLearning: [],
    rating: { knowledge: 0, communication: 0, punctuality: 0, count: 0 },
    verified: false,
    isBlocked: false,
    hourlyRate: null,
    profilePicUrl: '',
    createdAt: new Date().toISOString(),
  }
  mockUsers.push(user)
  const { password: _password, ...safeUser } = user
  return {
    token: `mock-token-${user.email}`,
    user: safeUser,
  }
}

export async function mockUpdateProfile(email, patch) {
  await delay(DELAY)
  const user = findMockUser(email)
  if (!user) {
    throw { message: 'User not found' }
  }
  Object.assign(user, patch)
  const { password: _password, ...safeUser } = user
  return { user: safeUser }
}
