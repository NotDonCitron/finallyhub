import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ user, onLogout, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Set active item based on current path
  const getActiveItem = () => {
    const path = location.pathname;
    if (path.startsWith('/workspace')) return 'workspaces';
    if (path.startsWith('/tasks')) return 'tasks';
    if (path.startsWith('/calendar')) return 'calendar';
    if (path.startsWith('/files')) return 'files';
    if (path.startsWith('/documents')) return 'documents';
    return 'dashboard';
  };

  const handleItemClick = (itemId) => {
    switch (itemId) {
      case 'dashboard':
        navigate('/');
        break;
      case 'workspaces':
        navigate('/');
        break;
      case 'tasks':
        navigate('/tasks');
        break;
      case 'calendar':
        navigate('/calendar');
        break;
      case 'files':
        navigate('/files');
        break;
      case 'documents':
        navigate('/documents');
        break;
      default:
        console.log('Navigating to:', itemId);
    }
  };

  return (
    <div className="layout">
      <Sidebar 
        activeItem={getActiveItem()} 
        onItemClick={handleItemClick} 
      />
      <div className="main-content">
        <main className="content-area">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;