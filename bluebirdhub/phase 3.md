markdown

Copy Code
# Bluebirdhub Sidebar Design - Handmade/Kreide-Look

## Design-Konzept
- **Grundfarbe:** Helles Beige (#F5F5DC, #FFF8E1)
- **Sidebar:** Große, runde Buttons mit Icons und Text
- **Style:** Handmade/Kreide-Look mit dezenten Schatten
- **Icons:** Dunkelgrau/Anthrazit (#2D3748, #4A5568)
- **Schrift:** Kreide-ähnlich (z.B. "Permanent Marker", "Gloria Hallelujah")
- **Kein Darkmode**

## CSS-Implementierung

### 1. Basis-Styles (globals.css)
```css
@import url('https://fonts.googleapis.com/css2?family=Permanent+Marker&family=Gloria+Hallelujah:wght@400&display=swap');

:root {
  /* Beige Farbpalette */
  --bg-primary: #F5F5DC;
  --bg-secondary: #FFF8E1;
  --bg-sidebar: #F0E68C;
  --text-primary: #2D3748;
  --text-secondary: #4A5568;
  --accent: #DEB887;
  --shadow: rgba(0, 0, 0, 0.1);
  --shadow-hover: rgba(0, 0, 0, 0.15);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Gloria Hallelujah', cursive;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.6;
}

.handmade-text {
  font-family: 'Permanent Marker', cursive;
  transform: rotate(-1deg);
  text-shadow: 1px 1px 2px var(--shadow);
}
2. Sidebar-Komponente (Sidebar.jsx)
jsx

Copy Code
import React from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  Coffee,
  CheckSquare,
  MessageCircle 
} from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ activeItem, onItemClick }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard', color: '#8B4513' },
    { id: 'workspaces', icon: Coffee, label: 'Workspaces', color: '#D2691E' },
    { id: 'tasks', icon: CheckSquare, label: 'Aufgaben', color: '#CD853F' },
    { id: 'calendar', icon: Calendar, label: 'Kalender', color: '#DEB887' },
    { id: 'files', icon: FileText, label: 'Dateien', color: '#F4A460' },
    { id: 'team', icon: Users, label: 'Team', color: '#DAA520' },
    { id: 'chat', icon: MessageCircle, label: 'Chat', color: '#B8860B' },
    { id: 'settings', icon: Settings, label: 'Einstellungen', color: '#A0522D' }
  ];

  return (
    <div className="sidebar">
      {/* Logo/Header */}
      <div className="sidebar-header">
        <div className="logo-container">
          <Coffee size={32} className="logo-icon" />
          <h2 className="handmade-text">Bluebirdhub</h2>
        </div>
        <div className="chalk-line"></div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className={`nav-button ${activeItem === item.id ? 'active' : ''}`}
              onClick={() => onItemClick(item.id)}
              style={{ '--button-color': item.color }}
            >
              <div className="button-content">
                <IconComponent 
                  size={24} 
                  className="nav-icon"
                />
                <span className="nav-label">{item.label}</span>
              </div>
              <div className="chalk-dust"></div>
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="chalk-line"></div>
        <p className="footer-text handmade-text">Café Gründer</p>
      </div>
    </div>
  );
};

export default Sidebar;
3. Sidebar-Styles (Sidebar.css)
css

Copy Code
.sidebar {
  width: 280px;
  height: 100vh;
  background: linear-gradient(135deg, var(--bg-sidebar) 0%, var(--bg-secondary) 100%);
  border-right: 3px solid var(--accent);
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  
  /* Handmade-Textur */
  background-image: 
    radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 1px, transparent 1px),
    radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 1px, transparent 1px),
    radial-gradient(circle at 40% 80%, rgba(255,255,255,0.1) 1px, transparent 1px);
  background-size: 50px 50px, 30px 30px, 40px 40px;
}

/* Header */
.sidebar-header {
  margin-bottom: 30px;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 15px;
}

.logo-icon {
  color: var(--text-primary);
  transform: rotate(-5deg);
  filter: drop-shadow(2px 2px 4px var(--shadow));
}

.sidebar-header h2 {
  color: var(--text-primary);
  font-size: 1.8rem;
  margin: 0;
}

/* Kreide-Linie */
.chalk-line {
  height: 3px;
  background: linear-gradient(90deg, 
    transparent 0%, 
    var(--text-secondary) 20%, 
    var(--text-secondary) 80%, 
    transparent 100%
  );
  border-radius: 2px;
  opacity: 0.6;
  position: relative;
}

.chalk-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent 0px,
    rgba(255,255,255,0.3) 2px,
    transparent 4px
  );
}

/* Navigation */
.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.nav-button {
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid var(--button-color, var(--accent));
  border-radius: 20px;
  padding: 16px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  /* Handmade-Schatten */
  box-shadow: 
    4px 4px 8px var(--shadow),
    inset 1px 1px 2px rgba(255,255,255,0.5);
  
  /* Leichte Rotation für Handmade-Look */
  transform: rotate(-0.5deg);
}

.nav-button:nth-child(even) {
  transform: rotate(0.5deg);
}

.nav-button:hover {
  background: rgba(255, 255, 255, 0.95);
  transform: rotate(0deg) translateY(-2px);
  box-shadow: 
    6px 6px 12px var(--shadow-hover),
    inset 1px 1px 2px rgba(255,255,255,0.7);
}

.nav-button.active {
  background: var(--button-color);
  color: white;
  transform: rotate(0deg);
  box-shadow: 
    inset 2px 2px 4px rgba(0,0,0,0.2),
    2px 2px 4px var(--shadow);
}

.button-content {
  display: flex;
  align-items: center;
  gap: 16px;
  position: relative;
  z-index: 2;
}

.nav-icon {
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.nav-button.active .nav-icon {
  color: white;
}

.nav-label {
  font-family: 'Gloria Hallelujah', cursive;
  font-size: 1.1rem;
  font-weight: 400;
  color: var(--text-primary);
  transition: all 0.3s ease;
}

.nav-button.active .nav-label {
  color: white;
  font-weight: 600;
}

/* Kreide-Staub-Effekt */
.chalk-dust {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at 30% 40%, 
    rgba(255,255,255,0.3) 1px, 
    transparent 2px
  );
  background-size: 8px 8px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.nav-button:hover .chalk-dust {
  opacity: 1;
}

/* Footer */
.sidebar-footer {
  margin-top: 20px;
}

.footer-text {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 10px;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    padding: 15px;
  }
  
  .sidebar-nav {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .nav-button {
    flex: 1;
    min-width: 120px;
    padding: 12px 16px;
  }
  
  .nav-label {
    font-size: 0.9rem;
  }
}

/* Animationen */
@keyframes chalkWrite {
  0% { 
    width: 0; 
    opacity: 0; 
  }
  50% { 
    opacity: 1; 
  }
  100% { 
    width: 100%; 
    opacity: 0.8; 
  }
}

.chalk-line {
  animation: chalkWrite 2s ease-in-out;
}

/* Hover-Effekte für Icons */
.nav-icon {
  transition: transform 0.3s ease;
}

.nav-button:hover .nav-icon {
  transform: scale(1.1) rotate(-2deg);
}

.nav-button.active .nav-icon {
  transform: scale(1.05);
}
4. Layout-Integration (Layout.jsx)
jsx

Copy Code
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({ children }) => {
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleItemClick = (itemId) => {
    setActiveItem(itemId);
    // Hier Navigation-Logic einfügen
  };

  return (
    <div className="layout">
      <Sidebar 
        activeItem={activeItem} 
        onItemClick={handleItemClick} 
      />
      <div className="main-content">
        <Header />
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
5. Layout-Styles (Layout.css)
css

Copy Code
.layout {
  display: flex;
  min-height: 100vh;
  background-color: var(--bg-primary);
}

.main-content {
  flex: 1;
  margin-left: 280px;
  display: flex;
  flex-direction: column;
}

.content-area {
  flex: 1;
  padding: 20px;
  background: var(--bg-primary);
  
  /* Subtile Textur */
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 60px 60px;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}
Verwendung

Installation der Abhängigkeiten:
bash

Copy Code
npm install lucide-react
Komponente einbinden:
jsx

Copy Code
import Layout from './components/Layout/Layout';

function App() {
  return (
    <Layout>
      <div>Dein App-Inhalt hier</div>
    </Layout>
  );
}
Features

✅ Heller Beige-Grundton
✅ Große, runde Buttons mit Icons und Text
✅ Handmade/Kreide-Look mit Texturen
✅ Dezente Schatten und Hover-Effekte
✅ Dunkelgraue/Anthrazit Icons
✅ Kreide-ähnliche Schriftarten
✅ Responsive Design
✅ Smooth Animationen
✅ Kein Darkmode
Das Design ist perfekt für euer Café-Projekt und gibt der App einen warmen, einladenden Look!

