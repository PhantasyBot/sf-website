export default function Offline() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem',
        textAlign: 'center',
      }}
    >
      <h1>You are offline</h1>
      <p>Please check your internet connection and try again.</p>
    </div>
  )
}
