/**
 * ==============================================================================
 * CampusHustle Centralized Environment & API Endpoint Configuration
 * Single Source of Truth for all API base URLs and route endpoints across the app.
 * ==============================================================================
 */

/**
 * Central Backend API Base URL
 * Reads from VITE_API_BASE_URL (or legacy VITE_API_URL).
 * If undefined or empty, falls back safely to origin or http://localhost:5000.
 */
export const API_BASE_URL = (
  import.meta.env?.VITE_API_BASE_URL ||
  import.meta.env?.VITE_API_URL ||
  (typeof window !== 'undefined' && window.location?.origin ? window.location.origin : 'http://localhost:5000')
).replace(/\/$/, '')

/**
 * Central WebSocket / Socket.io server connection URL
 */
export const SOCKET_URL = (
  import.meta.env?.VITE_SOCKET_URL ||
  API_BASE_URL ||
  'http://localhost:5000'
).replace(/\/$/, '')

/**
 * Centralized API Endpoints Dictionary
 * All client API modules reference these endpoint constants directly.
 */
export const API_ENDPOINTS = Object.freeze({
  // ── Authentication & Session ──────────────────────────────────────────────
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
    VERIFY_EMAIL: '/api/auth/verify-email',
    RESEND_VERIFICATION: '/api/auth/resend-verification',
  },

  // ── Users & Tutors ────────────────────────────────────────────────────────
  USERS: {
    ME: '/api/users/me',
    UPDATE_ME: '/api/users/me',
    SEARCH: '/api/users/search',
    SKILLS: '/api/users/skills',
    GET_BY_ID: (id) => `/api/users/${id}`,
    BLOCK: (id) => `/api/users/block/${id}`,
    UNBLOCK: (id) => `/api/users/block/${id}`,
  },

  // ── Study Notes & Marketplace ─────────────────────────────────────────────
  NOTES: {
    SEARCH: '/api/notes/search',
    CREATE: '/api/notes',
    GET_BY_ID: (id) => `/api/notes/${id}`,
    UPDATE: (id) => `/api/notes/${id}`,
    DELETE: (id) => `/api/notes/${id}`,
    BY_TUTOR: (tutorId) => `/api/notes/tutor/${tutorId}`,
    MY_NOTES: '/api/notes/mine',
    PURCHASE: (id) => `/api/notes/${id}/purchase`,
    MY_PURCHASES: '/api/notes/purchases/me',
  },

  // ── Tutor Availability ───────────────────────────────────────────────────
  AVAILABILITY: {
    BY_TUTOR: (tutorId) => `/api/availability/tutor/${tutorId}`,
    ME: '/api/availability/me',
    CREATE: '/api/availability',
    DELETE: (id) => `/api/availability/${id}`,
  },

  // ── Bookings & Sessions ───────────────────────────────────────────────────
  BOOKINGS: {
    LIST: '/api/bookings',
    CREATE: '/api/bookings',
    GET_BY_ID: (id) => `/api/bookings/${id}`,
    UPDATE_STATUS: (id) => `/api/bookings/${id}/status`,
  },

  // ── Real-Time Chat & Direct Messaging ─────────────────────────────────────
  MESSAGES: {
    CONVERSATIONS: '/api/messages/conversations',
    BY_CONVERSATION: (conversationId) => `/api/messages/${encodeURIComponent(conversationId)}`,
    BY_USER: (otherUserId) => `/api/messages/conversation/${otherUserId}`,
    UNREAD_COUNT: '/api/messages/unread-count',
    MARK_READ: (conversationId) => `/api/messages/${encodeURIComponent(conversationId)}/read`,
    SEND: '/api/messages/send',
  },

  // ── Notifications ─────────────────────────────────────────────────────────
  NOTIFICATIONS: {
    LIST: '/api/notifications',
    UNREAD_COUNT: '/api/notifications/unread-count',
    MARK_READ: (id) => `/api/notifications/${id}/read`,
    MARK_ALL_READ: '/api/notifications/read-all',
  },

  // ── Reviews & Ratings ─────────────────────────────────────────────────────
  REVIEWS: {
    CREATE: '/api/reviews',
    BY_USER: (userId) => `/api/reviews/user/${userId}`,
  },

  // ── Felat (ፈላጥ) AI Study Assistant ───────────────────────────────────────
  AI: {
    ASK: '/api/ai/ask',
  },
})

export default {
  API_BASE_URL,
  SOCKET_URL,
  API_ENDPOINTS,
}