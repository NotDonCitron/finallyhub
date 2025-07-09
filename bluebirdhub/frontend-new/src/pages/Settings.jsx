export default function Settings({ onLogout }) {
  return (
    <div className="page">
      <h1>Einstellungen</h1>
      <button 
        onClick={onLogout}
        style={{
          padding: '0.75rem 1.5rem',
          background: '#dc2626',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '1rem'
        }}
      >
        Logout
      </button>
    </div>
  );
}