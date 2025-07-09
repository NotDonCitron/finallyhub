Bluebirdhub – Kompletter Projekt-Guide
Dieser Guide enthält alle Anleitungen, Codebeispiele und Erklärungen, die ab dem Punkt "Super, dass du das Design jetzt umsetzen lässt! ..." im Chat besprochen wurden. Er führt dich Schritt für Schritt durch das Setup, die wichtigsten Features und die technische Umsetzung von Bluebirdhub.
1. Projektstruktur & Setup
2. Backend (FastAPI)
3. Frontend (React)
4. Docker Setup
5. Features: Templates, Plugins, Self-Hosting
6. Hinweise zu AI-Integration
7. Weiterführende Tipps & ToDos
Projektstruktur & Setup
Das Grundgerüst besteht aus einem Backend (FastAPI) und einem Frontend (React). Die Kommunikation erfolgt über eine REST-API. Das Projekt ist dockerisiert.
Backend (FastAPI)
Das Backend verwaltet Workspaces, Dokumente und Nutzer. Beispiel für ein Workspace-Modell in Python (Pydantic):class Workspace(BaseModel):    id: str    name: str    members: List[str]    documents: List[str]FastAPI-Endpunkte: /workspaces, /documents, /users usw.
Frontend (React)
Das Frontend bietet eine Sidebar mit großen Buttons, Icons und Text, ein helles, freundliches Design und Drag-and-Drop für Datei-Uploads. Die API wird über fetch/axios angebunden.
Docker Setup
Mit Docker Compose werden Backend und Frontend gemeinsam gestartet. Beispiel für eine docker-compose.yml ist enthalten.
Features: Templates, Plugins, Self-Hosting
Templates: Vorgefertigte Dokumentvorlagen.Plugins: Erweiterbar durch eigene Module.Self-Hosting: Anleitung zur lokalen Installation und Konfiguration.
Hinweise zu AI-Integration
OpenRouter-Key kann für verschiedene AI-APIs genutzt werden. Die AI-Funktionen sind modular und können erweitert werden.
Weiterführende Tipps & ToDos
Sichere Authentifizierung, mobile Optimierung, Community-Features, weitere Plugins und Templates.
Backend Beispiel (FastAPI)
```pythonfrom fastapi import FastAPIfrom pydantic import BaseModelfrom typing import Listapp = FastAPI()class Workspace(BaseModel):    id: str    name: str    members: List[str]    documents: List[str]workspaces = []@app.post("/workspaces")def create_workspace(ws: Workspace):    workspaces.append(ws)    return ws```
Frontend Beispiel (React)
```jsx// Sidebar.jsximport React from 'react';export default function Sidebar() {  return (    <div className="sidebar">      <button className="sidebar-btn">        <span role="img" aria-label="home">🏠</span> Home      </button>      {/* Weitere Buttons */}    </div>  );}```
Docker Compose Beispiel
```yaml# docker-compose.ymlversion: '3'services:  backend:    build: ./backend    ports:      - "8000:8000"  frontend:    build: ./frontend    ports:      - "3000:3000"```
