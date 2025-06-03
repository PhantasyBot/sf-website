import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error for debugging if needed
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo)
    }

    // Redirect to homepage after a brief delay
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.location.href = '/'
      }
    }, 100)
  }

  render() {
    if (this.state.hasError) {
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

    return this.props.children
  }
}

export default ErrorBoundary
