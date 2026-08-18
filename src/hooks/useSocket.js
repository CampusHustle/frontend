import { useEffect, useRef, useState, useCallback } from 'react'
import { createSocket } from '../services/socket.js'

export function useSocket() {
  const socketRef = useRef(null)
  const [status, setStatus] = useState('connecting')

  useEffect(() => {
    const socket = createSocket()
    socketRef.current = socket

    function onConnect() { setStatus('connected') }
    function onDisconnect() { setStatus('disconnected') }
    function onConnectError() { setStatus('disconnected') }
    function onReconnectAttempt() { setStatus('connecting') }
    function onReconnect() { setStatus('connected') }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('connect_error', onConnectError)
    socket.io.on('reconnect_attempt', onReconnectAttempt)
    socket.io.on('reconnect', onReconnect)

    socket.connect()

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('connect_error', onConnectError)
      socket.io.off('reconnect_attempt', onReconnectAttempt)
      socket.io.off('reconnect', onReconnect)
      socket.disconnect()
      socketRef.current = null
    }
  }, [])

  const getSocket = useCallback(() => socketRef.current, [])

  return { getSocket, status }
}
