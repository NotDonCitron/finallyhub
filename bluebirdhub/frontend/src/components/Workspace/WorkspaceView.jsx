import React from 'react';
import { useParams } from 'react-router-dom';

const WorkspaceView = () => {
  const { id } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Workspace {id}</h1>
      <div className="card">
        <p className="text-gray-600">
          Workspace-Detailansicht wird hier implementiert...
        </p>
      </div>
    </div>
  );
};

export default WorkspaceView;