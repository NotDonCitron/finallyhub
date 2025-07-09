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