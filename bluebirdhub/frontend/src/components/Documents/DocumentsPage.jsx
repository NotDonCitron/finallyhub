import React, { useState } from 'react';
import DocumentEditor from './DocumentEditor';
import WorkspacesList from '../Workspace/WorkspacesList';
import Layout from '../Layout/Layout';

const DocumentsPage = () => {
  const [selectedWorkspace, setSelectedWorkspace] = useState(null);

  const handleWorkspaceSelect = (workspace) => {
    setSelectedWorkspace(workspace);
  };

  const handleBackToWorkspaces = () => {
    setSelectedWorkspace(null);
  };

  return (
    <Layout>
      {!selectedWorkspace ? (
        <div>
          <WorkspacesList onWorkspaceSelect={handleWorkspaceSelect} />
        </div>
      ) : (
        <div style={{ height: '100vh', overflow: 'hidden' }}>
          <div style={{ 
            padding: '16px 20px', 
            background: '#f8fafc', 
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <button
              onClick={handleBackToWorkspaces}
              className="btn-secondary"
              style={{ padding: '8px 16px' }}
            >
              ← Zurück zu Workspaces
            </button>
            <h2 style={{ margin: 0, color: '#1e293b' }}>
              📄 Dokumente - {selectedWorkspace.name}
            </h2>
          </div>
          <DocumentEditor workspaceId={selectedWorkspace.id} />
        </div>
      )}
    </Layout>
  );
};

export default DocumentsPage;