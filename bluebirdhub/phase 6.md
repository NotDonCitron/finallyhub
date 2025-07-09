Bluebirdhub: FastAPI-Backend & Frontend-Anbindung (Vite + React)

1. FastAPI-Backend aufsetzen

1.1. Projekt anlegen
bash

Copy Code
mkdir bluebirdhub-backend
cd bluebirdhub-backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install fastapi uvicorn[standard] pydantic
1.2. Verzeichnisstruktur
bluebirdhub-backend/
├─ main.py
└─ (venv/)
1.3. Beispiel: main.py
python

Copy Code
from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# CORS für das Frontend erlauben
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Für Entwicklung, später gezielt setzen!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Workspace(BaseModel):
    id: int
    name: str

# Dummy-Daten
workspaces = [
    Workspace(id=1, name="Projekt Alpha"),
    Workspace(id=2, name="Projekt Beta"),
]

@app.get("/workspaces", response_model=List[Workspace])
def get_workspaces():
    return workspaces

@app.post("/workspaces", response_model=Workspace)
def create_workspace(ws: Workspace):
    workspaces.append(ws)
    return ws
1.4. Backend starten
bash

Copy Code
uvicorn main:app --reload
Das Backend läuft jetzt auf http://localhost:8000.
2. React-Frontend mit Backend verbinden

2.1. Service-Datei für API-Anfragen (src/api/workspaces.js)
js

Copy Code
export async function fetchWorkspaces() {
  const res = await fetch('http://localhost:8000/workspaces');
  if (!res.ok) throw new Error('Fehler beim Laden der Workspaces');
  return res.json();
}
2.2. Workspaces-Seite dynamisch machen (src/pages/Workspaces.jsx)
jsx

Copy Code
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

  if (loading) return <div>Lade Workspaces...</div>;
  if (error) return <div>Fehler: {error}</div>;

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
2.3. (Optional) Workspaces anlegen
Du kannst im Frontend ein einfaches Formular bauen, das per POST an /workspaces sendet.
Hier ein Beispiel für die API-Funktion:
js

Copy Code
export async function createWorkspace(name) {
  const res = await fetch('http://localhost:8000/workspaces', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: Date.now(), name }),
  });
  if (!res.ok) throw new Error('Fehler beim Anlegen');
  return res.json();
}
3. Zusammenfassung

Das FastAPI-Backend stellt eine /workspaces-API bereit.
Das React-Frontend lädt die Workspaces dynamisch und zeigt sie an.
Du kannst jetzt Schritt für Schritt weitere Features (z.B. Auth, Dokumente, Templates) ergänzen.
Nächste Schritte:
Authentifizierung einbauen
CRUD für Workspaces/Dokumente
UI/UX verfeinern
Features wie Templates, Plugins, AI-Integration
Docker/Deployment

