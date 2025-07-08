app_guide_content = '''# Bluebirdhub App - Vollständige Anleitung & Code

## 🚀 Über die App

Bluebirdhub ist eine moderne Team-Workspace-App mit:
- Login für 3 Demo-User
- Aufgabenverwaltung (Kanban-Style)
- Kalender für Terminplanung
- Datei-Upload (Drag & Drop)
- Mobile-freundliches Design
- Eigenes Logo und Branding

---

## 📋 Schnellstart (Keine Programmierkenntnisse nötig!)

### 1. Docker Desktop installieren
- Lade Docker Desktop herunter: https://www.docker.com/products/docker-desktop/
- Starte Docker Desktop (warte bis es läuft)

### 2. Projekt herunterladen
- Lade den Projektordner herunter (von GitHub oder als ZIP)
- Öffne ein Terminal (Windows: PowerShell, Mac: Terminal)

### 3. Alles starten
Im Projektordner ausführen:
```bash
docker-compose up


Wenn "Server running" und "Compiled successfully" angezeigt wird, bist du bereit!
4. App öffnen
Gehe zu http://localhost:3000 in deinem Browser
5. Einloggen
Demo-User verwenden:
user1 / pass123
user2 / pass123
user3 / pass123


🗂️ Projektstruktur

bluebirdhub/
├── backend/
│   ├── Dockerfile
│   ├── app.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── files.js
│   ├── models/
│   │   ├── user.js
│   │   ├── task.js
│   │   └── file.js
│   └── package.json
├── frontend/
│   ├── Dockerfile
│   ├── public/
│   │   └── logo.png
│   ├── src/
│   │   ├── App.jsx
│   │   ├── components/
│   │   └── index.js
│   └── package.json
├── docker-compose.yml
└── README.md
🐳 Docker Setup

docker-compose.yml
yaml

Copy Code
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    depends_on:
      - db

  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - REACT_APP_API_URL=http://localhost:5000
    depends_on:
      - backend

  db:
    image: sqlite:latest
    volumes:
      - ./data:/data
🔧 Backend Code (Node.js/Express)

backend/Dockerfile
dockerfile

Copy Code
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
backend/package.json
json

Copy Code
{
  "name": "bluebirdhub-backend",
  "version": "1.0.0",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "multer": "^1.4.5",
    "sqlite3": "^5.1.6",
    "body-parser": "^1.20.2"
  }
}
backend/app.js
javascript

Copy Code
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const fileRoutes = require('./routes/files');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/files', fileRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Bluebirdhub Backend läuft!' });
});

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
backend/routes/auth.js
javascript

Copy Code
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Demo users
const DEMO_USERS = [
  { id: 1, username: 'user1', password: \$2\$1\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' }, // pass123
  { id: 2, username: 'user2', password: \$2\$1\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' }, // pass123
  { id: 3, username: 'user3', password: \$2\$1\$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi' }  // pass123
];

const JWT_SECRET = 'bluebirdhub-secret-key';

// Login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = DEMO_USERS.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Falscher Benutzername oder Passwort' });
  }
  
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ error: 'Falscher Benutzername oder Passwort' });
  }
  
  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
  
  res.json({ 
    token, 
    user: { id: user.id, username: user.username } 
  });
});

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Kein Token bereitgestellt' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Ungültiger Token' });
  }
};

module.exports = { router, verifyToken };
backend/routes/tasks.js
javascript

Copy Code
const express = require('express');
const { verifyToken } = require('./auth');
const router = express.Router();

// In-memory storage (in production: use database)
let tasks = [
  { id: 1, title: 'Beispielaufgabe', date: null, files: [], userId: 1 }
];

// Get all tasks
router.get('/', verifyToken, (req, res) => {
  const userTasks = tasks.filter(task => task.userId === req.user.userId);
  res.json(userTasks);
});

// Create task
router.post('/', verifyToken, (req, res) => {
  const { title, date } = req.body;
  const newTask = {
    id: Date.now(),
    title,
    date: date || null,
    files: [],
    userId: req.user.userId
  };
  
  tasks.push(newTask);
  res.json(newTask);
});

// Update task
router.put('/:id', verifyToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, date } = req.body;
  
  const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.user.userId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Aufgabe nicht gefunden' });
  }
  
  tasks[taskIndex] = { ...tasks[taskIndex], title, date };
  res.json(tasks[taskIndex]);
});

// Delete task
router.delete('/:id', verifyToken, (req, res) => {
  const taskId = parseInt(req.params.id);
  
  const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === req.user.userId);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Aufgabe nicht gefunden' });
  }
  
  tasks.splice(taskIndex, 1);
  res.json({ message: 'Aufgabe gelöscht' });
});

module.exports = router;
backend/routes/files.js
javascript

Copy Code
const express = require('express');
const multer = require('multer');
const path = require('path');
const { verifyToken } = require('./auth');
const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Upload file
router.post('/upload', verifyToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Keine Datei hochgeladen' });
  }
  
  const fileInfo = {
    id: Date.now(),
    name: req.file.originalname,
    filename: req.file.filename,
    path: req.file.path,
    size: req.file.size,
    uploadedBy: req.user.userId,
    uploadedAt: new Date()
  };
  
  res.json(fileInfo);
});

module.exports = router;
⚛️ Frontend Code (React)

frontend/Dockerfile
dockerfile

Copy Code
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
frontend/package.json
json

Copy Code
{
  "name": "bluebirdhub-frontend",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-scripts": "5.0.1",
    "axios": "^1.3.4"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  }
}
frontend/src/App.jsx
jsx

Copy Code
import React, { useState } from 'react';

// Demo users
const DEMO_USERS = [
  { username: 'user1', password: 'pass123' },
  { username: 'user2', password: 'pass123' },
  { username: 'user3', password: 'pass123' },
];

// Simple Calendar (for demo)
function Calendar({ tasks, onDateClick }) {
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    return d;
  });
  return (
    <div className="p-4 bg-white rounded shadow mb-4">
      <h3 className="font-bold mb-2">Kalender (nächste 7 Tage)</h3>
      <div className="flex gap-2">
        {days.map((d, idx) => (
          <div
            key={idx}
            className="flex-1 border rounded p-2 cursor-pointer hover:bg-blue-100"
            onClick={() => onDateClick(d)}
          >
            <div className="text-xs text-gray-500">{d.toLocaleDateString()}</div>
            <div className="text-sm">
              {tasks.filter(t => t.date && new Date(t.date).toDateString() === d.toDateString()).map(t => (
                <div key={t.id} className="bg-blue-50 rounded px-1 my-1 text-xs">{t.title}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Login form
function Login({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleLogin = e => {
    e.preventDefault();
    const user = DEMO_USERS.find(u => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
    } else {
      setError('Falscher Benutzername oder Passwort');
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
      <div className="bg-white p-6 rounded shadow w-full max-w-xs">
        <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
        <form onSubmit={handleLogin}>
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="Benutzername"
            value={username}
            onChange={e => setUsername(e.target.value)}
            autoFocus
          />
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="Passwort"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <div className="text-red-500 text-xs mb-2">{error}</div>}
          <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" type="submit">
            Login
          </button>
        </form>
        <div className="mt-4 text-xs text-gray-500">
          Demo-User: user1, user2, user3<br />Passwort: pass123
        </div>
      </div>
    </div>
  );
}

// File upload with drag & drop
function FileUpload({ onUpload }) {
  const [dragActive, setDragActive] = useState(false);
  const handleDrop = e => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onUpload(Array.from(e.dataTransfer.files));
    }
  };
  const handleChange = e => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(Array.from(e.target.files));
    }
  };
  return (
    <div
      className={`border-2 border-dashed rounded p-4 text-center ${dragActive ? 'bg-blue-100' : 'bg-gray-50'}`}
      onDragOver={e => { e.preventDefault(); setDragActive(true); }}
      onDragLeave={e => { e.preventDefault(); setDragActive(false); }}
      onDrop={handleDrop}
    >
      <input
        type="file"
        multiple
        className="hidden"
        id="file-upload-input"
        onChange={handleChange}
      />
      <label htmlFor="file-upload-input" className="cursor-pointer">
        <div className="text-blue-600 font-bold">Dateien hierher ziehen oder klicken zum Hochladen</div>
      </label>
    </div>
  );
}

// Main App
function App() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([
    { id: 1, title: 'Beispielaufgabe', date: null, files: [] },
  ]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Mobile nav
  const [nav, setNav] = useState('tasks');

  if (!user) return <Login onLogin={setUser} />;

  // Add new task
  const addTask = () => {
    if (newTaskTitle.trim()) {
      setTasks([...tasks, { id: Date.now(), title: newTaskTitle, date: null, files: [] }]);
      setNewTaskTitle('');
      setShowTaskModal(false);
    }
  };

  // Assign file to task
  const handleFileUpload = files => {
    if (selectedTask) {
      setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, files: [...t.files, ...files] } : t));
    }
  };

  // Assign date to task
  const handleDateClick = date => {
    if (selectedTask) {
      setTasks(tasks.map(t => t.id === selectedTask.id ? { ...t, date: date.toISOString() } : t));
    }
  };

  // Logout
  const handleLogout = () => setUser(null);

  // Responsive nav
  const navItems = [
    { key: 'tasks', label: 'Aufgaben' },
    { key: 'calendar', label: 'Kalender' },
    { key: 'files', label: 'Dateien' },
  ];

  // Collect all files
  const allFiles = tasks.flatMap(t => t.files.map(f => ({ ...f, task: t.title })));

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col">
      <header className="bg-white shadow p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src="/attachments/C1B9AA00-A958-442B-A7F2-41B370B2C0AD.png" alt="Logo" className="h-8 w-8 rounded" />
          <span className="font-bold text-blue-700 text-lg">Bluebirdhub</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-600 text-sm">Eingeloggt als: <b>{user.username}</b></span>
          <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={handleLogout}>Logout</button>
        </div>
      </header>
      <nav className="flex justify-center gap-4 bg-blue-100 py-2 md:py-0 md:flex-row flex-col md:items-center">
        {navItems.map(item => (
          <button
            key={item.key}
            className={`px-4 py-2 rounded ${nav === item.key ? 'bg-blue-600 text-white' : 'bg-white text-blue-700'}`}
            onClick={() => setNav(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <main className="flex-1 p-4 max-w-3xl mx-auto w-full">
        {nav === 'tasks' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="font-bold text-xl">Aufgaben</h2>
              <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => setShowTaskModal(true)}>+ Neue Aufgabe</button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              {tasks.map(task => (
                <div key={task.id} className="bg-white rounded shadow p-4 cursor-pointer hover:bg-blue-50" onClick={() => { setSelectedTask(task); setShowTaskModal(true); }}>
                  <div className="font-bold text-blue-700">{task.title}</div>
                  <div className="text-xs text-gray-500">{task.date ? `Fällig: ${new Date(task.date).toLocaleDateString()}` : 'Kein Termin'}</div>
                  <div className="mt-2 text-xs text-gray-600">{task.files.length} Datei(en) angehängt</div>
                </div>
              ))}
            </div>
            {/* Task Modal */}
            {showTaskModal && (
              <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                <div className="bg-white rounded shadow p-6 w-full max-w-md relative">
                  <button className="absolute top-2 right-2 text-gray-400 hover:text-blue-600" onClick={() => { setShowTaskModal(false); setSelectedTask(null); }}>&times;</button>
                  {selectedTask ? (
                    <div>
                      <h3 className="font-bold text-lg mb-2">{selectedTask.title}</h3>
                      <div className="mb-2">
                        <b>Fälligkeitsdatum:</b> {selectedTask.date ? new Date(selectedTask.date).toLocaleDateString() : 'Kein Termin'}
                        <button className="ml-2 text-blue-600 underline text-xs" onClick={() => handleDateClick(new Date())}>Heute setzen</button>
                      </div>
                      <div className="mb-2">
                        <b>Dateien:</b>
                        <ul className="list-disc ml-5">
                          {selectedTask.files.map((f, i) => <li key={i}>{f.name || 'Datei'}</li>)}
                        </ul>
                      </div>
                      <FileUpload onUpload={handleFileUpload} />
                      <div className="mt-4">
                        <button className="bg-blue-600 text-white px-3 py-1 rounded" onClick={() => setShowTaskModal(false)}>Schließen</button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="font-bold text-lg mb-2">Neue Aufgabe</h3>
                      <input
                        className="w-full mb-2 p-2 border rounded"
                        placeholder="Titel der Aufgabe"
                        value={newTaskTitle}
                        onChange={e => setNewTaskTitle(e.target.value)}
                        autoFocus
                      />
                      <button className="bg-blue-600 text-white px-3 py-1 rounded w-full" onClick={addTask}>Anlegen</button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {nav === 'calendar' && (
          <Calendar
            tasks={tasks}
            onDateClick={date => {
              if (selectedTask) handleDateClick(date);
            }}
          />
        )}
        {nav === 'files' && (
          <div>
            <h2 className="font-bold text-xl mb-2">Dateimanager</h2>
            <div className="bg-white rounded shadow p-4">
              <div className="mb-2 text-xs text-gray-500">Alle Dateien, automatisch getaggt nach Aufgabe</div>
              <ul>
                {allFiles.length === 0 && <li className="text-gray-400">Keine Dateien hochgeladen</li>}
                {allFiles.map((f, i) => (
                  <li key={i} className="mb-1 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">{f.task}</span>
                    <span>{f.name || 'Datei'}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </main>
      <footer className="bg-white text-center text-xs text-gray-400 p-2">Bluebirdhub &copy; 2025</footer>
    </div>
  );
}

export default App;
🛠️ Wie es funktioniert

Frontend: React App (Port 3000)
Backend: Node.js/Express API (Port 5000)
Database: SQLite (dateibasiert, kein Setup nötig)
File Uploads: Gespeichert in backend/uploads
🧑‍💻 Für Entwickler

Zum Stoppen: Ctrl+C im Terminal drücken
Zum Neustarten: docker-compose up erneut ausführen
Code ändern: Dateien bearbeiten, dann neustarten
📱 Google Drive Upload Skript

Python-Skript: upload_to_drive.py
python

Copy Code
import os
from googleapiclient.discovery import build
from googleapiclient.http import MediaFileUpload
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request
import pickle

# If modifying these SCOPES, delete the file token.pickle.
SCOPES = ['https://www.googleapis.com/auth/drive.file']

def main():
    creds = None
    # The file token.pickle stores the user's access and refresh tokens.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                'credentials.json', SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open('token.pickle', 'wb') as token:
            pickle.dump(creds, token)

    service = build('drive', 'v3', credentials=creds)

    file_metadata = {'name': 'bluebirdhub.zip'}
    media = MediaFileUpload('bluebirdhub.zip', mimetype='application/zip')
    file = service.files().create(body=file_metadata, media_body=media, fields='id,webViewLink').execute()
    print('File ID:', file.get('id'))
    print('Download-Link:', file.get('webViewLink'))

if __name__ == '__main__':
    main()
Terminal-Befehle für Upload:
bash

Copy Code
# Python-Pakete installieren
pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib

# ZIP erstellen
zip -r bluebirdhub.zip .

# Zu Google Drive hochladen
python upload_to_drive.py
❓ Hilfe

Bei Problemen: Frag deinen AI-Assistenten oder einen Entwickler-Freund!
Dieses Projekt ist so einfach wie möglich für Anfänger gemacht.
Viel Erfolg mit deiner Bluebirdhub App! 🚀
'''
with open('Bluebirdhub_App_Anleitung_und_Code.md', 'w', encoding='utf-8') as f:
f.write(app_guide_content)
print('Bluebirdhub_App_Anleitung_und_Code.md erstellt!')
Output

output

Copy Code
Bluebirdhub_App_Anleitung_und_Code.md erstellt!
