/**
 * socket.js
 *
 * Socket factory for CampusHustle.
 *
 * Creates a socket.io-client instance configured with:
 *   - The backend URL from VITE_SOCKET_URL (falls back to the current origin
 *     so the app never crashes when the env var is absent).
 *   - The session auth token read from localStorage via loadSessionUser().
 *   - autoConnect: false so the caller (useSocket hook) controls the lifecycle.
 *   - Built-in socket.io-client exponential-backoff reconnection.
 *
 * Usage:
 *   import { createSocket } from '../services/socket.js'
 *   const socket = createSocket()
 *   socket.connect()
 *   socket.disconnect()
 */

import { io } from 'socket.io-client'
import { loadSessionUser } from '../utils/session.js'

/**
 * Returns the socket server URL.
 * Prefers VITE_SOCKET_URL when set; falls back to the page's own origin
 * so local dev with a proxy and production both work without crashing.
 */
function resolveSocketUrl() {
  return import.meta.env?.VITE_SOCKET_URL ?? window.location.origin
}

/**
 * Creates and returns a new socket.io-client instance.
 * Does NOT connect automatically — call socket.connect() when ready.
 *
 * @returns {import('socket.io-client').Socket}
 */
export function createSocket() {
  const user = loadSessionUser()

  return io(resolveSocketUrl(), {
    // Send the session token so the backend can authenticate the WS handshake
    auth: {
      token: user?.token ?? null,
      userId: user?.id ?? null,
    },

    // Let the hook drive connect/disconnect explicitly
    autoConnect: false,

    // socket.io-client built-in reconnection (exponential back-off)
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,       // start at 1 s
    reconnectionDelayMax: 30_000,  // cap at 30 s
    randomizationFactor: 0.3,

    // Prefer WebSocket; fall back to HTTP long-polling if needed
    transports: ['websocket', 'polling'],

    // 10 s connection timeout before reporting an error
    timeout: 10_000,
  })
}
