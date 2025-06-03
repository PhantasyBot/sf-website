import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Custom404() {
  const router = useRouter()

  useEffect(() => {
    // Log the 404 for debugging if needed
    if (process.env.NODE_ENV === 'development') {
      console.log('404 - Page not found:', router.asPath)
    }

    // Redirect to homepage after a brief delay
    const timer = setTimeout(() => {
      router.push('/')
    }, 100)

    return () => clearTimeout(timer)
  }, [router])

  // Show a minimal loading state while redirecting
  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--background-primary, #121212)',
        color: 'var(--text-primary, #e0e0e0)',
        fontFamily: 'var(--font, system-ui)',
        zIndex: 9999,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: '14px', opacity: 0.7 }}>
          Redirecting...
        </p>
      </div>
    </div>
  )
}
