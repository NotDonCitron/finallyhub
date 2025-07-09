# 🚀 Bluebirdhub - Team Workspace & Aufgabenmanagement

Eine moderne, vollständig integrierte Team-Workspace-Anwendung mit Docker-Containerisierung, KI-Integration und umfassendem Aufgabenmanagement.

## ✨ Features

- **🏢 Workspaces:** Verschiedene Arbeitsbereiche für Teams und Projekte
- **✅ Aufgabenverwaltung:** Vollständiges Task-Management mit Status, Prioritäten und Terminen
- **📅 Kalender:** Integrierte Terminplanung und Aufgaben-Scheduling
- **📁 Dateimanager:** Drag & Drop Upload mit automatischem KI-Tagging
- **🤖 KI-Integration:** OpenRouter API für intelligente Funktionen
- **💬 Kollaboration:** Kommentarsystem für Aufgaben
- **📱 Mobile-optimiert:** Responsive Design für alle Geräte
- **👥 3-User-Demo-System:** Einfache Demo-Authentifizierung

## 🛠️ Tech Stack

- **Frontend:** React 18 + Tailwind CSS + React Router + React Query
- **Backend:** Node.js + Express + Sequelize ORM
- **Datenbank:** SQLite (Demo) / PostgreSQL (Produktion)
- **Authentifizierung:** JWT-basiert mit bcrypt
- **File Storage:** Lokales Filesystem mit Multer
- **KI:** OpenRouter API Integration
- **Deployment:** Docker + Docker Compose

## 🚀 Schnellstart

### Voraussetzungen

- Docker Desktop ([Download](https://www.docker.com/products/docker-desktop/))
- Git (optional)

### Installation

1. **Projekt klonen/herunterladen:**
   ```bash
   git clone <repository-url>
   cd bluebirdhub
   ```

2. **Umgebungsvariablen konfigurieren:**
   ```bash
   cp .env.example .env
   # Bearbeite .env und füge deinen OpenRouter API Key hinzu
   ```

3. **Anwendung starten:**
   ```bash
   # Alle Services starten
   docker-compose up --build

   # Im Hintergrund starten
   docker-compose up -d --build
   ```

4. **Anwendung öffnen:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Demo-Login

Die Anwendung kommt mit 3 vorkonfigurierten Demo-Benutzern:

- **Benutzer:** `user1` | **Passwort:** `pass123`
- **Benutzer:** `user2` | **Passwort:** `pass123`  
- **Benutzer:** `user3` | **Passwort:** `pass123`

## 📋 API-Endpunkte

### Authentifizierung
- `POST /api/auth/login` - Benutzeranmeldung
- `GET /api/auth/verify` - Token-Verifizierung
- `GET /api/auth/profile` - Benutzerprofil abrufen

### Workspaces
- `GET /api/workspaces` - Alle Workspaces abrufen
- `POST /api/workspaces` - Neuen Workspace erstellen
- `GET /api/workspaces/:id` - Workspace-Details
- `PUT /api/workspaces/:id` - Workspace aktualisieren
- `DELETE /api/workspaces/:id` - Workspace löschen

### Aufgaben
- `GET /api/tasks` - Alle Aufgaben abrufen (mit Filtern)
- `POST /api/tasks` - Neue Aufgabe erstellen
- `GET /api/tasks/:id` - Aufgabe-Details
- `PUT /api/tasks/:id` - Aufgabe aktualisieren
- `DELETE /api/tasks/:id` - Aufgabe löschen

### Dateien
- `POST /api/files/upload` - Datei hochladen
- `GET /api/files` - Alle Dateien abrufen
- `GET /api/files/:id/download` - Datei herunterladen
- `DELETE /api/files/:id` - Datei löschen

### KI-Integration
- `POST /api/ai/generate` - Text generieren
- `POST /api/ai/suggest-tasks` - Aufgaben vorschlagen
- `POST /api/ai/tag-file` - Datei automatisch taggen

## 🔧 Entwicklung

### Backend-Entwicklung

```bash
cd backend
npm install
npm run dev
```

### Frontend-Entwicklung

```bash
cd frontend
npm install
npm start
```

### Datenbank-Migration

```bash
# Im Backend-Verzeichnis
npm run migrate
```

## 🐳 Docker-Konfiguration

Die Anwendung verwendet Docker Compose mit folgenden Services:

- **backend:** Node.js API Server (Port 5000)
- **frontend:** React Development Server (Port 3000)
- **db:** PostgreSQL Datenbank (Port 5432)

### Docker-Commands

```bash
# Alle Services starten
docker-compose up

# Im Hintergrund starten
docker-compose up -d

# Services stoppen
docker-compose down

# Logs anzeigen
docker-compose logs -f

# Einzelnen Service neu starten
docker-compose restart backend
```

## 🔑 Konfiguration

### Umgebungsvariablen

Erstelle eine `.env` Datei im Hauptverzeichnis:

```env
# OpenRouter API Key
OPENROUTER_API_KEY=your_api_key_here

# JWT Secret
JWT_SECRET=your_secret_key_here

# Environment
NODE_ENV=development

# Database
DATABASE_URL=sqlite:./database.sqlite

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### OpenRouter API Key

1. Gehe zu [OpenRouter.ai](https://openrouter.ai/)
2. Erstelle einen Account
3. Generiere einen API Key
4. Füge den Key zu deiner `.env` Datei hinzu

## 🎯 Features im Detail

### Workspace-Management
- Erstelle verschiedene Workspaces für verschiedene Projekte
- Farbkodierung für bessere Übersicht
- Workspace-spezifische Aufgaben und Dateien

### Aufgabenverwaltung
- Status: Offen, In Bearbeitung, Abgeschlossen, Abgebrochen
- Prioritäten: Niedrig, Mittel, Hoch, Dringend
- Fälligkeitsdaten und Terminplanung
- Aufgabenzuweisung an Teammitglieder

### Dateimanagement
- Drag & Drop Upload
- Automatisches Tagging mit KI
- Dateiversionen und Metadaten
- Integration mit Aufgaben

### KI-Integration
- Automatische Aufgabenerstellung basierend auf Projektbeschreibungen
- Intelligentes Datei-Tagging
- Textzusammenfassung und -generierung

## 🚨 Fehlerbehandlung

### Docker File Sharing Issues (macOS)

Falls "mounts denied" Fehler auftreten:

1. Docker Desktop → Einstellungen → Resources → File Sharing
2. Füge `/Applications/Archon` zu den geteilten Pfaden hinzu
3. Starte Docker Desktop neu

### Alternative Lösungen

```bash
# Vom bluebirdhub-Verzeichnis starten
cd bluebirdhub
docker-compose up

# Oder absolute Pfade in docker-compose.yml verwenden
```

### Port-Konflikte

Falls Ports 3000 oder 5000 bereits belegt sind, ändere die Ports in `docker-compose.yml`.

## 📝 Lizenz

Dieses Projekt ist zu Demonstrationszwecken erstellt.

## 🤝 Contributing

1. Fork das Repository
2. Erstelle einen Feature Branch
3. Committe deine Änderungen
4. Push zum Branch
5. Erstelle einen Pull Request

## 📞 Support

Bei Fragen oder Problemen:

1. Überprüfe die [Troubleshooting](#-fehlerbehandlung) Sektion
2. Schaue in die Issues des Repositories
3. Erstelle ein neues Issue mit detaillierter Beschreibung

---

**Bluebirdhub** - Moderne Team-Workspace-Lösung mit KI-Integration 🚀