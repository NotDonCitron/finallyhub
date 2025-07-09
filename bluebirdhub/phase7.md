1. Authentifizierung (Login & Registrierung)

1.1. Backend: Einfache JWT-Auth mit FastAPI
Installiere die benötigten Pakete:
bash

Copy Code
pip install python-jose[cryptography] passlib[bcrypt]
Beispiel für User-Modell und Auth-Endpoints (main.py):
python

Copy Code
from fastapi import FastAPI, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import jwt
from passlib.context import CryptContext
from pydantic import BaseModel
from datetime import datetime, timedelta

SECRET_KEY = "dein-geheimer-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class User(BaseModel):
    username: str
    password: str

fake_users_db = {}

def verify_password(plain, hashed):
    return pwd_context.verify(plain, hashed)

def get_password_hash(password):
    return pwd_context.hash(password)

def authenticate_user(username, password):
    user = fake_users_db.get(username)
    if not user or not verify_password(password, user["password"]):
        return False
    return user

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

@app.post("/register")
def register(user: User):
    if user.username in fake_users_db:
        raise HTTPException(status_code=400, detail="User exists")
    fake_users_db[user.username] = {"password": get_password_hash(user.password)}
    return {"msg": "User created"}

@app.post("/token")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}
1.2. Frontend: Login-Formular & Token speichern
Beispiel für ein einfaches Login-Formular (src/pages/Login.jsx):
jsx

Copy Code
import { useState } from 'react';

export default function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const res = await fetch('http://localhost:8000/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username, password }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem('token', data.access_token);
      onLogin();
    } else {
      setError('Login fehlgeschlagen');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Benutzername" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Passwort" />
      <button type="submit">Login</button>
      {error && <div>{error}</div>}
    </form>
  );
}
2. CRUD für Workspaces & Dokumente

2.1. Backend: Endpunkte ergänzen
Beispiel für Dokument-Modell und Endpunkte:
python

Copy Code
class Document(BaseModel):
    id: int
    workspace_id: int
    title: str
    content: str

documents = []

@app.get("/documents", response_model=List[Document])
def get_documents():
    return documents

@app.post("/documents", response_model=Document)
def create_document(doc: Document):
    documents.append(doc)
    return doc

@app.delete("/documents/{doc_id}")
def delete_document(doc_id: int):
    global documents
    documents = [d for d in documents if d.id != doc_id]
    return {"msg": "Deleted"}
2.2. Frontend: CRUD-Funktionen
Beispiel für das Anlegen eines Dokuments:
js

Copy Code
export async function createDocument(doc) {
  const res = await fetch('http://localhost:8000/documents', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(doc),
  });
  if (!res.ok) throw new Error('Fehler beim Anlegen');
  return res.json();
}
Analog für Update, Delete und List.
3. UI/UX-Verbesserungen

Ladeanzeigen und Fehlermeldungen einbauen
Drag & Drop für Datei-Uploads (z.B. mit react-dropzone)
Responsive Design für Mobilgeräte
Modale Fenster für Bearbeiten/Löschen
Schöne Icons und Farbakzente
4. Features: Templates, Plugins, AI-Integration

Templates:
Lege Vorlagen für neue Dokumente an (z.B. als JSON im Backend oder als Auswahl im Frontend).
Plugins:
Baue ein System, mit dem du das Frontend/Backend modular erweitern kannst (z.B. über ein Plugin-Verzeichnis).
AI-Integration:
Nutze z.B. OpenRouter oder andere APIs, um KI-Funktionen (z.B. Textvorschläge) einzubauen.
5. Docker & Deployment

5.1. Dockerfile für Backend
dockerfile

Copy Code
FROM python:3.11
WORKDIR /app
COPY . .
RUN pip install fastapi uvicorn[standard] pydantic python-jose[cryptography] passlib[bcrypt]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
5.2. Dockerfile für Frontend
dockerfile

Copy Code
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
CMD ["npm", "run", "preview"]
5.3. docker-compose.yml
yaml

Copy Code
version: '3'
services:
  backend:
    build: ./bluebirdhub-backend
    ports:
      - "8000:8000"
  frontend:
    build: ./bluebirdhub-frontend
    ports:
      - "5173:4173"