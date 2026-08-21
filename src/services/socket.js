import { io } from 'socket.io-client'
import { loadSessionUser, getAccessToken } from '../utils/session.js'

function resolveSocketUrl() {
  return import.meta.env?.VITE_SOCKET_URL ?? window.location.origin
}

let sharedSocket = null

export function getSharedSocket() {
  const token = getAccessToken()
  const user = loadSessionUser()

  if (!token) {
    if (sharedSocket) {
      sharedSocket.disconnect()
      sharedSocket = null
    }
    return null
  }

  if (!sharedSocket) {
    sharedSocket = io(resolveSocketUrl(), {
      auth: {
        token,
        userId: user?._id ?? null,
      },
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 30_000,
      randomizationFactor: 0.3,
      transports: ['websocket', 'polling'],
      timeout: 10_000,
    })
  } else {
    sharedSocket.auth = {
      token,
      userId: user?._id ?? null,
    }
    if (!sharedSocket.connected && !sharedSocket.connecting) {
      sharedSocket.connect()
    }
  }

  return sharedSocket
}

export function createSocket() {
  const socket = getSharedSocket()
  if (socket) return socket

  const user = loadSessionUser()
  return io(resolveSocketUrl(), {
    auth: {
      token: getAccessToken(),
      userId: user?._id ?? null,
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
