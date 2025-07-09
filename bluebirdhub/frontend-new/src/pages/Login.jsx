import { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    
    const endpoint = isRegistering ? '/register' : '/token';
    const body = isRegistering 
      ? JSON.stringify({ username, password })
      : new URLSearchParams({ username, password });
    
    const headers = isRegistering
      ? { 'Content-Type': 'application/json' }
      : { 'Content-Type': 'application/x-www-form-urlencoded' };

    try {
      const res = await fetch(`http://localhost:8000${endpoint}`, {
        method: 'POST',
        headers,
        body,
      });
      
      if (res.ok) {
        if (isRegistering) {
          setIsRegistering(false);
          setError(null);
          alert('Benutzer erfolgreich erstellt! Bitte loggen Sie sich ein.');
        } else {
          const data = await res.json();
          localStorage.setItem('token', data.access_token);
          onLogin();
        }
      } else {
        const errorData = await res.json();
        setError(errorData.detail || 'Fehler aufgetreten');
      }
    } catch (err) {
      setError('Verbindungsfehler');
    }
  }

  return (
    <div className="page" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh'}}>
      <form onSubmit={handleSubmit} style={{background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', minWidth: '300px'}}>
        <h1>{isRegistering ? 'Registrieren' : 'Login'}</h1>
        <div style={{marginBottom: '1rem'}}>
          <input 
            value={username} 
            onChange={e => setUsername(e.target.value)} 
            placeholder="Benutzername"
            required
            style={{width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px'}}
          />
        </div>
        <div style={{marginBottom: '1rem'}}>
          <input 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            placeholder="Passwort"
            required
            style={{width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px'}}
          />
        </div>
        <button 
          type="submit"
          style={{width: '100%', padding: '0.75rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '1rem'}}
        >
          {isRegistering ? 'Registrieren' : 'Login'}
        </button>
        <button 
          type="button"
          onClick={() => setIsRegistering(!isRegistering)}
          style={{width: '100%', padding: '0.5rem', background: 'transparent', color: '#2563eb', border: '1px solid #2563eb', borderRadius: '4px', cursor: 'pointer'}}
        >
          {isRegistering ? 'Bereits registriert? Login' : 'Neuen Account erstellen'}
        </button>
        {error && <div style={{color: 'red', marginTop: '1rem'}}>{error}</div>}
      </form>
    </div>
  );
}