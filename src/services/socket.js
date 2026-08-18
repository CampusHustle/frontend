import { io } from 'socket.io-client'
import { loadSessionUser } from '../utils/session.js'

function resolveSocketUrl() {
  return import.meta.env?.VITE_SOCKET_URL ?? window.location.origin
}

export function createSocket() {
  const user = loadSessionUser()

  return io(resolveSocketUrl(), {
    auth: {
      token: user?.token ?? null,
      userId: user?.id ?? null,
    },
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 30_000,
    randomizationFactor: 0.3,
    transports: ['websocket', 'polling'],
    timeout: 10_000,
  })
}
