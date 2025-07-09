import { useEffect, useState } from 'react';
import { fetchWorkspaces } from '../api/workspaces';

export default function Workspaces() {
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWorkspaces()
      .then(setWorkspaces)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page"><div>Lade Workspaces...</div></div>;
  if (error) return <div className="page"><div>Fehler: {error}</div></div>;

  return (
    <div className="page">
      <h1>Deine Workspaces</h1>
      <ul>
        {workspaces.map(ws => (
          <li key={ws.id}>{ws.name}</li>
        ))}
      </ul>
    </div>
  );
}