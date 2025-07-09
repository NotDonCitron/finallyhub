import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { workspaceService } from '../../services/api';

const WorkspacesList = ({ onWorkspaceSelect }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState(null);
  const queryClient = useQueryClient();

  // Fetch workspaces
  const { data: workspaces, isLoading, error: fetchError } = useQuery(
    'workspaces',
    () => workspaceService.getAll(),
    {
      onSuccess: (data) => {
        setError(null);
      },
      onError: (error) => {
        setError(error.response?.data?.error || 'Fehler beim Laden der Workspaces');
      }
    }
  );

  // Create workspace mutation
  const createWorkspaceMutation = useMutation(
    (newWorkspace) => workspaceService.create(newWorkspace),
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries('workspaces');
        setName('');
        setDescription('');
        setShowForm(false);
        setError(null);
      },
      onError: (error) => {
        setError(error.response?.data?.error || 'Fehler beim Erstellen');
      }
    }
  );

  // Delete workspace mutation
  const deleteWorkspaceMutation = useMutation(
    (id) => workspaceService.delete(id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('workspaces');
        setError(null);
      },
      onError: (error) => {
        setError(error.response?.data?.error || 'Fehler beim Löschen');
      }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name ist erforderlich');
      return;
    }
    
    createWorkspaceMutation.mutate({
      name: name.trim(),
      description: description.trim() || null
    });
  };

  const handleDelete = (workspace) => {
    if (window.confirm(`Möchten Sie den Workspace "${workspace.name}" wirklich löschen?`)) {
      deleteWorkspaceMutation.mutate(workspace.id);
    }
  };

  if (isLoading) {
    return <div className="loading">Lade Workspaces...</div>;
  }

  if (fetchError) {
    return (
      <div style={{ 
        padding: '20px', 
        color: '#dc2626', 
        background: '#fee2e2', 
        borderRadius: '8px',
        margin: '20px'
      }}>
        Fehler beim Laden der Workspaces: {fetchError.message}
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#1e293b' }}>Ihre Workspaces</h2>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="btn-primary"
        >
          {showForm ? '❌ Abbrechen' : '➕ Neuer Workspace'}
        </button>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="form-container">
          <h3>Neuer Workspace</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Workspace Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
            <textarea
              placeholder="Beschreibung (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                type="submit" 
                className="btn-primary"
                disabled={createWorkspaceMutation.isLoading}
              >
                {createWorkspaceMutation.isLoading ? 'Erstellt...' : 'Erstellen'}
              </button>
              <button 
                type="button" 
                onClick={() => setShowForm(false)}
                className="btn-secondary"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{ 
          padding: '12px', 
          background: '#fee2e2', 
          color: '#dc2626', 
          borderRadius: '8px', 
          marginBottom: '20px'
        }}>
          {error}
        </div>
      )}

      {/* Workspaces Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '20px' 
      }}>
        {workspaces?.workspaces?.length === 0 ? (
          <div className="empty-state">
            <h3>Keine Workspaces</h3>
            <p>Erstellen Sie Ihren ersten Workspace</p>
          </div>
        ) : (
          workspaces?.workspaces?.map(workspace => (
            <div
              key={workspace.id}
              className="workspace-card"
              onClick={() => onWorkspaceSelect && onWorkspaceSelect(workspace)}
            >
              <h3>{workspace.name}</h3>
              {workspace.description && (
                <p>{workspace.description}</p>
              )}
              <div className="workspace-meta">
                <div className="workspace-stats">
                  <span>📋 {workspace.tasks?.length || 0} Aufgaben</span>
                  <span>👤 {workspace.owner?.displayName || workspace.owner?.username}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(workspace);
                  }}
                  className="btn-danger btn-small"
                  disabled={deleteWorkspaceMutation.isLoading}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WorkspacesList;