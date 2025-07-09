export async function login(username, password) {
  const res = await fetch('http://localhost:8000/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username, password }),
  });
  if (!res.ok) throw new Error('Login fehlgeschlagen');
  return res.json();
}

export async function register(username, password) {
  const res = await fetch('http://localhost:8000/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) throw new Error('Registrierung fehlgeschlagen');
  return res.json();
}

export function getToken() {
  return localStorage.getItem('token');
}

export function removeToken() {
  localStorage.removeItem('token');
}

export function isAuthenticated() {
  return !!getToken();
}