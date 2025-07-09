export async function fetchWorkspaces() {
  const res = await fetch('http://localhost:8000/workspaces');
  if (!res.ok) throw new Error('Fehler beim Laden der Workspaces');
  return res.json();
}

export async function createWorkspace(name) {
  const res = await fetch('http://localhost:8000/workspaces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: Date.now(), name }),
  });
  if (!res.ok) throw new Error('Fehler beim Anlegen');
  return res.json();
}