import React from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  Settings, 
  Coffee,
  CheckSquare,
  MessageCircle,
  BookOpen
} from 'lucide-react';

const Sidebar = ({ activeItem, onItemClick }) => {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'workspaces', icon: Coffee, label: 'Workspaces' },
    { id: 'tasks', icon: CheckSquare, label: 'Tasks' },
    { id: 'calendar', icon: Calendar, label: 'Calendar' },
    { id: 'files', icon: FileText, label: 'Files' },
    { id: 'documents', icon: BookOpen, label: 'Documents' },
    { id: 'team', icon: Users, label: 'Team' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'settings', icon: Settings, label: 'Settings' }
  ];

  return (
    <div className="sidebar">
      {/* Logo/Header */}
      <div style={{ padding: '0 24px 24px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            backgroundColor: 'var(--accent)',
            borderRadius: '8px'
          }}>
            <Coffee size={24} style={{ color: 'white' }} />
          </div>
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            color: 'var(--text-primary)',
            margin: 0
          }}>
            Bluebirdhub
          </h2>
        </div>
      </div>

      {/* Navigation */}
      <nav>
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className={`sidebar-btn ${activeItem === item.id ? 'active' : ''}`}
              onClick={() => onItemClick(item.id)}
            >
              <IconComponent size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default Sidebar;