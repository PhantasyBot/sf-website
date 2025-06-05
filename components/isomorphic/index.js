import { useEffect, useState } from 'react'

// Shared hook for mounting state
function useMounted() {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => setIsMounted(true), [])
  return isMounted
}

export function ClientOnly({ children }) {
  const isMounted = useMounted()
  return isMounted ? children || null : null
}

export function ServerOnly({ children }) {
  const isMounted = useMounted()
  return isMounted ? null : children || null
}
