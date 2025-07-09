import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Workspaces from './pages/Workspaces';
import Settings from './pages/Settings';
import Login from './pages/Login';
import { isAuthenticated } from './api/auth';
import './App.css';

export default function App() {
  const [active, setActive] = useState('home');
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const handleLogin = () => {
    setAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setAuthenticated(false);
  };

  if (!authenticated) {
    return <Login onLogin={handleLogin} />;
  }

  let Page;
  if (active === 'home') Page = <Home />;
  else if (active === 'workspaces') Page = <Workspaces />;
  else if (active === 'settings') Page = <Settings onLogout={handleLogout} />;

  return (
    <div className="app-layout">
      <Sidebar active={active} onNavigate={setActive} />
      <main className="main-content">{Page}</main>
    </div>
  );
}
