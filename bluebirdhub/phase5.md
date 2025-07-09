Bluebirdhub Frontend – Quickstart mit Vite (AppFlowy-Style)

1. Projekt anlegen

bash

Copy Code
npm create vite@latest bluebirdhub-frontend -- --template react
cd bluebirdhub-frontend
npm install
npm install react-icons
2. Projektstruktur

bluebirdhub-frontend/
├─ src/
│  ├─ components/
│  │  └─ Sidebar.jsx
│  ├─ pages/
│  │  ├─ Home.jsx
│  │  ├─ Workspaces.jsx
│  │  └─ Settings.jsx
│  ├─ App.jsx
│  ├─ main.jsx
│  └─ App.css
├─ index.html
└─ package.json
3. Sidebar-Komponente (src/components/Sidebar.jsx)

jsx

Copy Code
import { FaHome, FaFolder, FaCog } from 'react-icons/fa';
import './Sidebar.css';

export default function Sidebar({ active, onNavigate }) {
  return (
    <div className="sidebar">
      <button
        className={`sidebar-btn${active === 'home' ? ' active' : ''}`}
        onClick={() => onNavigate('home')}
      >
        <FaHome /> Home
      </button>
      <button
        className={`sidebar-btn${active === 'workspaces' ? ' active' : ''}`}
        onClick={() => onNavigate('workspaces')}
      >
        <FaFolder /> Workspaces
      </button>
      <button
        className={`sidebar-btn${active === 'settings' ? ' active' : ''}`}
        onClick={() => onNavigate('settings')}
      >
        <FaCog /> Einstellungen
      </button>
    </div>
  );
}
4. Sidebar-Styles (src/components/Sidebar.css)

css

Copy Code
.sidebar {
  background: #fff;
  box-shadow: 0 2px 8px rgba(30, 41, 59, 0.06);
  border-radius: 12px;
  padding: 24px 0;
  width: 220px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  background: none;
  border: none;
  color: #222;
  font-size: 1rem;
  padding: 12px 24px;
  border-radius: 8px;
  transition: background 0.2s, box-shadow 0.2s, color 0.2s;
  cursor: pointer;
}

.sidebar-btn.active,
.sidebar-btn:hover {
  background: #2563eb;
  color: #fff;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.10);
}
5. Beispielseiten (src/pages/Home.jsx, src/pages/Workspaces.jsx, src/pages/Settings.jsx)

Home.jsx
jsx

Copy Code
export default function Home() {
  return <div className="page"><h1>Willkommen bei Bluebirdhub!</h1></div>;
}
Workspaces.jsx
jsx

Copy Code
export default function Workspaces() {
  return <div className="page"><h1>Deine Workspaces</h1></div>;
}
Settings.jsx
jsx

Copy Code
export default function Settings() {
  return <div className="page"><h1>Einstellungen</h1></div>;
}
6. Hauptlayout (src/App.jsx)

jsx

Copy Code
import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Workspaces from './pages/Workspaces';
import Settings from './pages/Settings';
import './App.css';

export default function App() {
  const [active, setActive] = useState('home');

  let Page;
  if (active === 'home') Page = <Home />;
  else if (active === 'workspaces') Page = <Workspaces />;
  else if (active === 'settings') Page = <Settings />;

  return (
    <div className="app-layout">
      <Sidebar active={active} onNavigate={setActive} />
      <main className="main-content">{Page}</main>
    </div>
  );
}
7. Hauptlayout-Styles (src/App.css)

css

Copy Code
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

body {
  background: #F7F8FA;
  font-family: 'Inter', 'Roboto', sans-serif;
  color: #222;
  margin: 0;
}

.app-layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 40px;
  background: #F7F8FA;
}

.page h1 {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 24px 0;
}
8. App starten

bash

Copy Code
npm run dev
Öffne http://localhost:5173 im Browser.
Jetzt hast du ein modernes, AppFlowy-inspiriertes Grundgerüst für Bluebirdhub!
Du kannst die Seiten und Komponenten beliebig erweitern und das Design weiter anpassen.
Wenn du möchtest, kann ich dir auch gleich das Backend-Setup oder weitere Features als Anleitung liefern – sag einfach Bescheid!
Warning: Some URLs are invalid