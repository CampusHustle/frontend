/**
 * useSocket.js
 *
 * React hook that manages the full socket lifecycle for a single component.
 *
 * Responsibilities:
 *   - Creates the socket on mount, connects immediately.
 *   - Tracks connection state: 'connecting' | 'connected' | 'disconnected'.
 *   - Handles connect / disconnect / connect_error events gracefully.
 *   - Removes all listeners and disconnects on unmount (no leaks).
 *   - Exposes a getSocket() accessor so callers can reach the socket instance
 *     inside effects/handlers without triggering the refs-during-render rule.
 *
 * @returns {{ getSocket: () => Socket|null, status: 'connecting'|'connected'|'disconnected' }}
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { createSocket } from '../services/socket.js'

/**
 * @typedef {'connecting'|'connected'|'disconnected'} SocketStatus
 */

export function useSocket() {
  const socketRef = useRef(null)
  const [status, setStatus] = useState(/** @type {SocketStatus} */('connecting'))

  useEffect(() => {
    const socket = createSocket()
    socketRef.current = socket

    // ── connection event handlers ────────────────────────────────────────────

    function onConnect() {
      setStatus('connected')
    }

    function onDisconnect(/* reason */) {
      // socket.io-client will attempt to reconnect automatically;
      // we just reflect the transient disconnected state in the UI.
      setStatus('disconnected')
    }

    function onConnectError(/* err */) {
      // Connection attempt failed (network error, auth rejection, timeout…).
      // Do NOT throw — just update the status so the UI can show "Disconnected".
      setStatus('disconnected')
    }

    function onReconnectAttempt(/* attemptNumber */) {
      // While socket.io is retrying, show "Connecting" again.
      setStatus('connecting')
    }

    function onReconnect(/* attemptNumber */) {
      // Fully back online after a reconnect cycle.
      setStatus('connected')
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)
    socket.io.on('reconnect_attempt', onReconnectAttempt)
    socket.io.on('reconnect', onReconnect)

    // Kick off the connection
    socket.connect()

    // ── cleanup on unmount ───────────────────────────────────────────────────
    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
      socket.io.off('reconnect_attempt', onReconnectAttempt)
      socket.io.off('reconnect', onReconnect)
      socket.disconnect()
      socketRef.current = null
    }
  }, []) // run once per mount

  // Stable accessor — safe to call inside effects and event handlers.
  // Avoids reading ref.current on the render path (react-hooks/refs rule).
  const getSocket = useCallback(() => socketRef.current, [])

  return { getSocket, status }
}
