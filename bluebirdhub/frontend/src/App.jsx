import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import './styles/appflowy.css';

// Components
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';
import WorkspaceView from './components/Workspace/WorkspaceView';
import TaskView from './components/Tasks/TaskView';
import CalendarView from './components/Calendar/CalendarView';
import FileManager from './components/Files/FileManager';
import DocumentsPage from './components/Documents/DocumentsPage';
import Layout from './components/Layout/Layout';

// Services
import { verifyToken } from './services/auth';

// Styles
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('authToken');
    if (token) {
      verifyToken(token)
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('authToken');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (userData, token) => {
    setUser(userData);
    localStorage.setItem('authToken', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        backgroundColor: 'var(--bg-primary)', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            backgroundColor: '#8B4513',
            borderRadius: '50%',
            marginBottom: '16px',
            boxShadow: '4px 4px 8px var(--shadow)',
            transform: 'rotate(-2deg)'
          }}>
            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '1.5rem' }}>BB</span>
          </div>
          <div style={{ 
            color: 'var(--text-primary)', 
            fontSize: '1.125rem', 
            fontWeight: '500',
            fontFamily: "'Gloria Hallelujah', cursive"
          }}>
            Lade Bluebirdhub...
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
          {!user ? (
            <Login onLogin={handleLogin} />
          ) : (
            <Layout user={user} onLogout={handleLogout}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/workspace/:id" element={<WorkspaceView />} />
                <Route path="/tasks" element={<TaskView />} />
                <Route path="/calendar" element={<CalendarView />} />
                <Route path="/files" element={<FileManager />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Layout>
          )}
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;