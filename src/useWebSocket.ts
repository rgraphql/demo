import { useCallback, useEffect, useRef, useState } from 'react'
import WebSocket from 'isomorphic-ws'

export type ConnectionStatus = {
  state: 'connecting' | 'connected' | 'disconnected' | 'error'
  error?: string
  attempts?: number
}

export const useWebSocket = (url: string) => {
  const [ws, setWs] = useState<WebSocket>()
  const [status, setStatus] = useState<ConnectionStatus>({
    state: 'connecting',
  })
  const reconnectTimeoutRef = useRef<number | undefined>(undefined)
  const reconnectAttempts = useRef(0)
  const maxReconnectAttempts = 5
  const baseDelay = 1000 // Start with 1 second delay

  const connect = useCallback(() => {
    try {
      const socket = new WebSocket(url)

      socket.onopen = () => {
        console.log('WebSocket connected')
        reconnectAttempts.current = 0
        setWs(socket)
        setStatus({ state: 'connected' })
      }

      socket.onclose = () => {
        console.log('WebSocket disconnected')
        setWs(undefined)

        // Implement exponential backoff
        if (reconnectAttempts.current < maxReconnectAttempts) {
          const nextAttempt = reconnectAttempts.current + 1
          const delay = Math.min(
            baseDelay * Math.pow(2, reconnectAttempts.current),
            10000,
          )
          setStatus({
            state: 'disconnected',
            attempts: nextAttempt,
          })
          reconnectTimeoutRef.current = window.setTimeout(() => {
            reconnectAttempts.current = nextAttempt
            connect()
          }, delay)
        } else {
          setStatus({
            state: 'error',
            error: 'Maximum reconnection attempts reached',
          })
        }
      }

      socket.onerror = (error) => {
        console.error('WebSocket error:', error)
        setStatus({
          state: 'error',
          error: 'Connection error occurred',
        })
      }

      return socket
    } catch (error) {
      console.error('Failed to create WebSocket:', error)
      return undefined
    }
  }, [url])

  useEffect(() => {
    const socket = connect()

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      socket?.close()
    }
  }, [connect])

  const getStatusMessage = useCallback(() => {
    switch (status.state) {
      case 'connecting':
        return 'Connecting to server...'
      case 'connected':
        return 'Connected to server'
      case 'disconnected':
        return `Disconnected. Attempting to reconnect... (Attempt ${status.attempts} of 5)`
      case 'error':
        return `Connection error: ${status.error}`
      default:
        return 'Unknown connection state'
    }
  }, [status])

  return { ws, status, getStatusMessage }
}
